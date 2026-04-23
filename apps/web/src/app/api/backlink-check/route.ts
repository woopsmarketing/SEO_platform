import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 30;

// 사용자에게 노출되는 상위 백링크 수 (metrics 병렬 호출 대상)
const TOP_BACKLINKS_FOR_METRICS = 20;

interface VebBacklink {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  doFollow?: boolean;
  noFollow?: boolean;
  nofollow?: boolean;
  image?: boolean;
  domain_inlink_rank?: number;
  first_seen?: string;
  last_visited?: string;
}

interface EnrichedBacklink extends VebBacklink {
  sourceDA: number | null;
  qualityScore: number | null;
}

function toHostname(rawUrl?: string): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function parseDA(metrics: DomainMetrics | null | undefined): number | null {
  if (!metrics) return null;
  const v = metrics.mozDA;
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : null;
}

/**
 * 개별 백링크 품질 점수 계산 (0~100 범위 목표)
 *   sourceDA * 0.6 + (doFollow ? 40 : 10) + anchorDiversityBonus
 */
function computeQualityScore(
  sourceDA: number | null,
  doFollow: boolean,
  anchorDiversityBonus: number,
): number | null {
  if (sourceDA == null) return null;
  const base = sourceDA * 0.6;
  const follow = doFollow ? 40 : 10;
  const raw = base + follow + anchorDiversityBonus;
  // 0~100 클램프
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export async function POST(request: Request) {
  try {
    // 비로그인 하루 2회, 로그인 하루 10회
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "backlink-checker", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { url?: string };
    let url = body.url;
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "도메인을 입력해주세요." },
        { status: 400 }
      );
    }

    // 도메인만 추출 (https://www.example.com/path → example.com)
    url = url.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    let domain: string;
    try {
      domain = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return NextResponse.json(
        { error: "올바른 도메인을 입력해주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.VEBAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "백링크 분석 API가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // VebAPI 백링크 + 공용 캐시 metrics(대상 도메인) 병렬 호출
    const [res, targetMetrics] = await Promise.all([
      fetch(
        `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
        {
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(20000),
        }
      ),
      fetchWithCache<DomainMetrics>("metrics", { domain }),
    ]);

    if (!res.ok) {
      return NextResponse.json(
        { error: "백링크 데이터를 가져오는데 실패했습니다." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      counts?: unknown;
      backlinks?: VebBacklink[];
    };

    const backlinks: VebBacklink[] = Array.isArray(data.backlinks)
      ? data.backlinks
      : [];

    // --- 앵커 다양성 계산 (전체 백링크 기준) ---
    const anchorList = backlinks
      .map((bl) => (typeof bl.anchor === "string" ? bl.anchor.trim().toLowerCase() : ""))
      .filter((a) => a.length > 0);
    const uniqueAnchors = new Set(anchorList).size;
    const anchorDiversityRatio = anchorList.length > 0
      ? uniqueAnchors / anchorList.length
      : 0;
    // 0~1 → 0~20 가산점
    const anchorDiversityBonus = Math.round(anchorDiversityRatio * 20);

    // --- 상위 N개 백링크의 소스 도메인에 대해 metrics 병렬 조회 ---
    const topBacklinks = backlinks.slice(0, TOP_BACKLINKS_FOR_METRICS);
    const topHosts = topBacklinks.map((bl) => toHostname(bl.url_from));
    const uniqueHosts = Array.from(
      new Set(topHosts.filter((h): h is string => typeof h === "string" && h.length > 0))
    );

    const metricResults = await Promise.allSettled(
      uniqueHosts.map((host) => fetchWithCache<DomainMetrics>("metrics", { domain: host })),
    );
    const metricsByHost = new Map<string, DomainMetrics | null>();
    uniqueHosts.forEach((host, idx) => {
      const r = metricResults[idx];
      if (r.status === "fulfilled") {
        metricsByHost.set(host, r.value);
      } else {
        metricsByHost.set(host, null);
      }
    });

    // --- 각 백링크에 sourceDA, qualityScore 부착 ---
    const enriched: EnrichedBacklink[] = backlinks.map((bl, idx) => {
      const host = idx < TOP_BACKLINKS_FOR_METRICS ? toHostname(bl.url_from) : null;
      const m = host ? metricsByHost.get(host) ?? null : null;
      const sourceDA = parseDA(m);
      const isDoFollow = bl.doFollow === true || (bl.nofollow === false && bl.noFollow === false);
      const qualityScore = computeQualityScore(sourceDA, isDoFollow, anchorDiversityBonus);
      return {
        ...bl,
        sourceDA,
        qualityScore,
      };
    });

    // --- 평균 품질 점수 (score 있는 항목 기준) ---
    const scored = enriched.filter((bl): bl is EnrichedBacklink & { qualityScore: number } =>
      typeof bl.qualityScore === "number",
    );
    const avgQualityScore = scored.length > 0
      ? Math.round(scored.reduce((acc, bl) => acc + bl.qualityScore, 0) / scored.length)
      : null;

    // tool_usage_logs 기록
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    await adminSupabase.from("tool_usage_logs").insert({
      tool_type: "backlink-checker",
      input_summary: domain,
      ip_address: ip,
    });

    // 로그인 사용자면 analyses에 저장
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const userSupabase = await createClient();
      const {
        data: { user },
      } = await userSupabase.auth.getUser();
      if (user) {
        const counts = (data.counts ?? {}) as {
          backlinks?: { total?: number; doFollow?: number; toHomePage?: number };
          domains?: { total?: number; doFollow?: number };
        };
        const summary = {
          domain,
          totalBacklinks: counts.backlinks?.total ?? 0,
          doFollowBacklinks: counts.backlinks?.doFollow ?? 0,
          totalDomains: counts.domains?.total ?? 0,
          doFollowDomains: counts.domains?.doFollow ?? 0,
          toHomePage: counts.backlinks?.toHomePage ?? 0,
          avgQualityScore,
          anchorDiversityRatio,
        };
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "backlink-checker",
          input_summary: domain,
          score: avgQualityScore,
          input: { domain },
          result: {
            summary,
            counts: data.counts,
            backlinksCount: backlinks.length,
          },
        });
      }
    } catch {
      // 사용자 정보 조회 실패 시 무시
    }

    return NextResponse.json({
      domain,
      counts: data.counts,
      backlinks: enriched,
      metrics: targetMetrics ?? null,
      avgQualityScore,
      anchorDiversityRatio,
    });
  } catch {
    return NextResponse.json(
      { error: "백링크 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
