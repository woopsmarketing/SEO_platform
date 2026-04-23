import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 60;

// 키워드 최대 조사 수 (비용 제어)
const MAX_KEYWORDS = 50;
// SERP 조회 시 확보할 최상위 결과 수
const SERP_LIMIT = 100;
// avgTopDA 계산에 사용하는 상위 N 도메인
const AVG_DA_DOMAINS = 10;
// 동시성 제한 (배치 크기)
const CONCURRENCY = 10;
// TOP 노출 키워드 반환 수
const TOP_RANKED_KEYWORDS = 20;

interface VebKeywordItem {
  text?: string;
  vol?: number;
}

interface SerpCachedItem {
  url: string;
  title: string;
  position?: number;
}

interface SerpOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

interface RankedKeyword {
  keyword: string;
  myRank: number;
  avgTopDA: number | null;
  searchVolume?: number;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function normalizeDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withScheme = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function toNumber(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

/**
 * VebAPI keyword research로 도메인 관련 시드 키워드 획득
 */
async function fetchSeedKeywords(
  domain: string,
  apiKey: string,
): Promise<VebKeywordItem[]> {
  try {
    // 도메인 자체를 키워드로 입력 — VebAPI가 관련 키워드 확장
    const res = await fetch(
      `https://vebapi.com/api/seo/keywordresearch?keyword=${encodeURIComponent(domain)}&country=kr`,
      {
        headers: { "X-API-KEY": apiKey, Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data as VebKeywordItem[];
  } catch {
    return [];
  }
}

/**
 * 키워드의 SERP 상위 100개를 캐시 경유로 조회. 캐시 MISS 시 Serper 직접 호출 후 저장.
 */
async function fetchSerpResults(keyword: string): Promise<SerpCachedItem[]> {
  const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });
  if (cached && cached.length > 0) return cached;

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, gl: "kr", hl: "ko", num: SERP_LIMIT }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { organic?: SerpOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];
    const rows: SerpCachedItem[] = organic
      .filter(
        (item): item is Required<Pick<SerpOrganicItem, "link" | "title">> & SerpOrganicItem =>
          typeof item.link === "string" && typeof item.title === "string",
      )
      .map((item, i) => ({
        url: item.link,
        title: item.title,
        position: typeof item.position === "number" ? item.position : i + 1,
      }));

    if (rows.length > 0) {
      await saveToCache("serp", { keyword, results: rows });
    }
    return rows;
  } catch {
    return [];
  }
}

/**
 * 도메인 ranking 매칭: SERP 결과에서 대상 도메인이 등장한 최초 순위 반환. 없으면 null.
 */
function findRank(results: SerpCachedItem[], targetDomain: string): number | null {
  for (let i = 0; i < results.length; i++) {
    const d = extractDomain(results[i].url);
    if (d === targetDomain || d.endsWith(`.${targetDomain}`)) {
      return typeof results[i].position === "number"
        ? (results[i].position as number)
        : i + 1;
    }
  }
  return null;
}

/**
 * SERP 상위 N 도메인의 Moz DA 평균 계산 (캐시 경유)
 */
async function computeAvgTopDA(results: SerpCachedItem[]): Promise<number | null> {
  const domains: string[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    const d = extractDomain(r.url);
    if (!d || seen.has(d)) continue;
    seen.add(d);
    domains.push(d);
    if (domains.length >= AVG_DA_DOMAINS) break;
  }
  if (domains.length === 0) return null;

  const settled = await Promise.allSettled(
    domains.map((d) => fetchWithCache<DomainMetrics>("metrics", { domain: d })),
  );
  const values: number[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled" && r.value) {
      const v = toNumber(r.value.mozDA);
      if (v != null) values.push(v);
    }
  }
  if (values.length === 0) return null;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

/**
 * 동시성 제한 배치 처리. Promise.allSettled 기반으로 실패 내성.
 */
async function processBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const settled = await Promise.allSettled(batch.map(worker));
    results.push(...settled);
  }
  return results;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "my-top-keywords", limit, 1440);
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

    const body = (await request.json()) as {
      domain?: unknown;
      seedKeywords?: unknown;
    };

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
        { error: "키워드 분석 API가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    // 1) 시드 키워드 확보: 요청에 포함되면 사용, 아니면 VebAPI로 확장
    let seedKeywords: Array<{ text: string; vol?: number }> = [];
    if (Array.isArray(body.seedKeywords)) {
      seedKeywords = body.seedKeywords
        .filter((k): k is string => typeof k === "string" && k.trim().length > 0)
        .map((k) => ({ text: k.trim() }));
    }
    if (seedKeywords.length === 0) {
      const veb = await fetchSeedKeywords(domain, apiKey);
      seedKeywords = veb
        .filter((k): k is VebKeywordItem & { text: string } => typeof k.text === "string")
        .map((k) => ({ text: k.text, vol: k.vol }));
    }

    // 중복 제거 + MAX_KEYWORDS 제한
    const seen = new Set<string>();
    const keywordList: Array<{ text: string; vol?: number }> = [];
    for (const k of seedKeywords) {
      const key = k.text.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      keywordList.push({ text: k.text.trim(), vol: k.vol });
      if (keywordList.length >= MAX_KEYWORDS) break;
    }

    if (keywordList.length === 0) {
      return NextResponse.json(
        { error: "분석할 키워드를 확보하지 못했습니다." },
        { status: 502 },
      );
    }

    // 2) 각 키워드 SERP 조회 (배치 + allSettled)
    const serpSettled = await processBatches(
      keywordList,
      (k) => fetchSerpResults(k.text),
      CONCURRENCY,
    );

    interface KeywordHit {
      keyword: string;
      myRank: number;
      searchVolume?: number;
      serp: SerpCachedItem[];
    }

    const hits: KeywordHit[] = [];
    keywordList.forEach((k, i) => {
      const r = serpSettled[i];
      if (r.status !== "fulfilled") return;
      const serp = r.value;
      if (serp.length === 0) return;
      const rank = findRank(serp, domain);
      if (rank == null) return;
      hits.push({ keyword: k.text, myRank: rank, searchVolume: k.vol, serp });
    });

    // 3) 순위 오름차순 정렬 후 TOP 20 + avgTopDA 계산
    hits.sort((a, b) => a.myRank - b.myRank);
    const top = hits.slice(0, TOP_RANKED_KEYWORDS);

    const avgDASettled = await processBatches(
      top,
      (h) => computeAvgTopDA(h.serp),
      CONCURRENCY,
    );

    const rankedKeywords: RankedKeyword[] = top.map((h, i) => {
      const r = avgDASettled[i];
      const avgTopDA =
        r && r.status === "fulfilled" && typeof r.value === "number" ? r.value : null;
      return {
        keyword: h.keyword,
        myRank: h.myRank,
        avgTopDA,
        searchVolume: h.searchVolume,
      };
    });

    // tool_usage_logs
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "my-top-keywords",
        input_summary: domain,
        ip_address: ip,
      });
    } catch {}

    return NextResponse.json({
      domain,
      rankedKeywords,
      totalCheckedKeywords: keywordList.length,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "노출 키워드 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
