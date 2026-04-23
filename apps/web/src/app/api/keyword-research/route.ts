import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 60;

interface KeywordItem {
  text: string;
  vol: number;
  cpc: string;
  competition: string;
  score?: number;
  avgDA?: number | null;
}

interface SerpCachedItem {
  url: string;
  title: string;
}

interface SerpOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

const AVG_DA_TOP_N = 10; // 상위 10개 키워드만 avgDA 계산
const AVG_DA_DOMAINS = 3; // 각 키워드 상위 3개 도메인 DA 평균

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function toNumber(v: number | string | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/** Serper에서 상위 N개 도메인을 가져온다. 캐시 경유. */
async function fetchTopDomains(keyword: string, limit: number): Promise<string[]> {
  const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });
  if (cached && cached.length > 0) {
    return cached.slice(0, limit).map((item) => extractDomain(item.url));
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
      body: JSON.stringify({ q: keyword, gl: "kr", hl: "ko", num: limit }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { organic?: SerpOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];
    const rows = organic
      .filter((item) => typeof item.link === "string" && typeof item.title === "string")
      .slice(0, Math.max(limit, 10));

    if (rows.length > 0) {
      await saveToCache("serp", {
        keyword,
        results: rows.map((r) => ({ url: r.link as string, title: r.title as string })),
      });
    }
    return rows.slice(0, limit).map((r) => extractDomain(r.link as string));
  } catch {
    return [];
  }
}

/** 도메인의 Moz DA를 캐시 경유로 가져온다. */
async function fetchDomainDA(domain: string): Promise<number | null> {
  if (!domain) return null;
  const metrics = await fetchWithCache<DomainMetrics>("metrics", { domain });
  if (!metrics) return null;
  return toNumber(metrics.mozDA);
}

/** 키워드 하나에 대한 avgDA(상위 N개 도메인 Moz DA 평균) 계산. */
async function computeAvgDA(keyword: string): Promise<number | null> {
  const domains = await fetchTopDomains(keyword, AVG_DA_DOMAINS);
  if (domains.length === 0) return null;

  const settled = await Promise.allSettled(
    domains.map((d) => fetchDomainDA(d)),
  );
  const values: number[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled" && typeof r.value === "number") values.push(r.value);
  }
  if (values.length === 0) return null;
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.round(avg);
}

export async function POST(request: Request) {
  try {
    // 비로그인 하루 2회, 로그인 하루 10회
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "keyword-research", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 }
      );
    }

    const { keyword, country = "kr" } = await request.json();
    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json(
        { error: "키워드를 입력해주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.VEBAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "키워드 분석 API가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // VebAPI 호출
    const res = await fetch(
      `https://vebapi.com/api/seo/keywordresearch?keyword=${encodeURIComponent(keyword.trim())}&country=${encodeURIComponent(country)}`,
      {
        headers: {
          "X-API-KEY": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "키워드 데이터를 가져오는데 실패했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const rawResults: KeywordItem[] = Array.isArray(data) ? data : [];

    // 상위 N개 키워드에 대해 avgDA 계산 (Promise.allSettled로 실패 내성)
    const topN = rawResults.slice(0, AVG_DA_TOP_N);
    const avgDASettled = await Promise.allSettled(
      topN.map((item) => computeAvgDA(item.text)),
    );

    const results: KeywordItem[] = rawResults.map((item, i) => {
      if (i < AVG_DA_TOP_N) {
        const r = avgDASettled[i];
        const avgDA =
          r && r.status === "fulfilled" && typeof r.value === "number"
            ? r.value
            : null;
        return { ...item, avgDA };
      }
      return { ...item, avgDA: null };
    });

    // tool_usage_logs 기록
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    await adminSupabase.from("tool_usage_logs").insert({
      tool_type: "keyword-research",
      input_summary: keyword,
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
        const summary = {
          keyword,
          country,
          totalResults: results.length,
          avgCpc:
            results.length > 0
              ? (
                  results.reduce(
                    (sum: number, k) => sum + parseFloat(k.cpc || "0"),
                    0
                  ) / results.length
                ).toFixed(2)
              : "0",
          avgVol:
            results.length > 0
              ? Math.round(
                  results.reduce(
                    (sum: number, k) => sum + (k.vol || 0),
                    0
                  ) / results.length
                )
              : 0,
        };
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "keyword-research",
          input_summary: keyword,
          score: null,
          input: { keyword, country },
          result: { summary },
        });
      }
    } catch {
      // 사용자 저장 실패 시 무시
    }

    return NextResponse.json({
      keyword,
      country,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "키워드 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
