import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache } from "@/lib/cache-api";

export const maxDuration = 30;

const SERP_FETCH_NUM = 20;
const MAX_UNIQUE_DOMAINS = 15;

interface SerperOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

interface SerpCachedItem {
  url: string;
  title: string;
}

interface DiscoveryRow {
  domain: string;
  rank: number;
}

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

async function fetchSerpDomains(keyword: string): Promise<string[]> {
  // 1) 캐시 조회
  const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });
  if (cached && cached.length > 0) {
    return cached
      .slice(0, SERP_FETCH_NUM)
      .map((item) => extractDomain(item.url))
      .filter((d): d is string => d !== null);
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: keyword,
        gl: "kr",
        hl: "ko",
        num: SERP_FETCH_NUM,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { organic?: SerperOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];
    const rows = organic
      .filter(
        (item) => typeof item.link === "string" && typeof item.title === "string",
      )
      .slice(0, SERP_FETCH_NUM);

    if (rows.length > 0) {
      // 캐시 저장
      await saveToCache("serp", {
        keyword,
        results: rows.map((r) => ({
          url: r.link as string,
          title: r.title as string,
        })),
      });
    }

    return rows
      .map((r) => extractDomain(r.link as string))
      .filter((d): d is string => d !== null);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    if (!loggedIn) {
      return NextResponse.json(
        {
          error: "경쟁 도메인 발굴은 로그인 회원 전용입니다.",
          requireLogin: true,
        },
        { status: 401 },
      );
    }
    // 로그인 회원도 하루 1회로 제한 (외부 API 비용 통제)
    const rl = await checkRateLimit(ip, "competitor-discovery", 1, 1440);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: "이 도구는 하루 1회만 사용 가능합니다.",
          upgrade: false,
          remaining: 0,
        },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { seedKeyword?: unknown }
      | null;
    const seedKeyword =
      body && typeof body.seedKeyword === "string" ? body.seedKeyword.trim() : "";

    if (!seedKeyword) {
      return NextResponse.json(
        { error: "시드 키워드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 1) SERP(상위 20 organic) 조회 — 공용 캐시 경유
    const domains = await fetchSerpDomains(seedKeyword);

    // 2) 고유 도메인 추출 (최대 MAX_UNIQUE_DOMAINS개) — SERP 등장 순서 유지
    const seen = new Set<string>();
    const rows: DiscoveryRow[] = [];
    domains.forEach((d, i) => {
      if (seen.has(d)) return;
      seen.add(d);
      rows.push({ domain: d, rank: i + 1 });
    });
    const truncated = rows.slice(0, MAX_UNIQUE_DOMAINS);

    if (truncated.length === 0) {
      return NextResponse.json(
        { error: "SERP에서 경쟁 도메인을 찾지 못했습니다." },
        { status: 502 },
      );
    }

    // 로깅
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "competitor-discovery",
        input_summary: seedKeyword,
        ip_address: ip,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      seedKeyword,
      totalUniqueDomains: truncated.length,
      rows: truncated,
    });
  } catch {
    return NextResponse.json(
      { error: "경쟁 도메인 발굴 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
