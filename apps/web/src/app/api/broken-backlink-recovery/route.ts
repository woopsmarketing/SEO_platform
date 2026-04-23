import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

// 한번에 상태 확인할 타겟 URL 수
const MAX_TARGETS = 50;
// 개별 HEAD/GET 타임아웃
const REQUEST_TIMEOUT_MS = 5000;

interface VebBacklink {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  first_seen?: string;
  last_visited?: string;
}

interface BrokenLink {
  sourceUrl: string;
  targetUrl: string;
  statusCode: number;
}

function normalizeDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * target URL 상태 확인. HEAD가 막히면 GET fallback.
 * 404/410만 깨진 링크로 간주 (5xx/타임아웃은 일시적 장애 가능성).
 */
async function checkUrlStatus(url: string): Promise<number | null> {
  // 1) HEAD 시도
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.status === 405 || res.status === 501) {
      // HEAD 미지원 → GET fallback
    } else {
      return res.status;
    }
  } catch {
    // HEAD 실패 → GET 시도
  }

  // 2) GET fallback (본문 버림)
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    // stream을 무시하고 상태만 사용
    try {
      await res.body?.cancel();
    } catch {
      // cancel 실패 무시
    }
    return res.status;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 5 : 1;
    const rateLimit = await checkRateLimit(
      ip,
      "broken-backlink-recovery",
      limit,
      1440,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `일일 분석 횟수(${limit}회)를 초과했습니다.`,
          upgrade: true,
          remaining: 0,
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { domain?: unknown };
    if (!body.domain || typeof body.domain !== "string") {
      return NextResponse.json(
        { error: "도메인을 입력해주세요." },
        { status: 400 },
      );
    }
    const domain = normalizeDomain(body.domain);
    if (!domain) {
      return NextResponse.json(
        { error: "올바른 도메인을 입력해주세요." },
        { status: 400 },
      );
    }

    const apiKey = process.env.VEBAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "백링크 분석 API가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const started = Date.now();

    // VebAPI 백링크 조회
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "백링크 데이터를 가져오는데 실패했습니다." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { backlinks?: VebBacklink[] };
    const backlinks: VebBacklink[] = Array.isArray(data.backlinks)
      ? data.backlinks
      : [];

    // 내 도메인 target URL 상위 MAX_TARGETS개 뽑기 (중복 제거)
    const seen = new Set<string>();
    const candidates: { sourceUrl: string; targetUrl: string }[] = [];
    for (const bl of backlinks) {
      const targetUrl = typeof bl.url_to === "string" ? bl.url_to : "";
      const sourceUrl = typeof bl.url_from === "string" ? bl.url_from : "";
      if (!targetUrl || !sourceUrl) continue;
      const key = `${sourceUrl}${targetUrl}`;
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push({ sourceUrl, targetUrl });
      if (candidates.length >= MAX_TARGETS) break;
    }

    // Promise.allSettled로 병렬 상태 체크 (실패 내성)
    const settled = await Promise.allSettled(
      candidates.map(async (c) => {
        const status = await checkUrlStatus(c.targetUrl);
        return { ...c, status };
      }),
    );

    const broken: BrokenLink[] = [];
    for (const s of settled) {
      if (s.status !== "fulfilled") continue;
      const { sourceUrl, targetUrl, status } = s.value;
      if (status === 404 || status === 410) {
        broken.push({ sourceUrl, targetUrl, statusCode: status });
      }
    }

    const elapsed = Date.now() - started;

    // tool_usage_logs + (로그인 시) broken_backlinks upsert
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "broken-backlink-recovery",
        input_summary: domain,
        ip_address: ip,
      });

      if (loggedIn && broken.length > 0) {
        const { createClient } = await import("@/lib/supabase/server");
        const userClient = await createClient();
        const {
          data: { user },
        } = await userClient.auth.getUser();
        if (user) {
          const now = new Date().toISOString();
          const rows = broken.map((b) => ({
            user_id: user.id,
            target_domain: domain,
            source_url: b.sourceUrl,
            target_url: b.targetUrl,
            status_code: b.statusCode,
            last_checked_at: now,
            resolved: false,
          }));
          // upsert (unique: user_id + source_url + target_url)
          await adminSupabase
            .from("broken_backlinks")
            .upsert(rows, {
              onConflict: "user_id,source_url,target_url",
              ignoreDuplicates: false,
            });
        }
      }
    } catch {
      // 로깅/저장 실패는 사용자 응답에 영향 없음
    }

    return NextResponse.json({
      domain,
      total: candidates.length,
      broken,
      saved: loggedIn,
      elapsed,
    });
  } catch {
    return NextResponse.json(
      { error: "깨진 백링크 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
