import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache } from "@/lib/cache-api";

export const maxDuration = 60;

const MAX_KEYWORDS = 30;

interface VebApiKeywordItem {
  text?: string;
  vol?: number;
  cpc?: string | number;
  competition?: string | number;
}

interface SerperOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

interface SerpCachedItem {
  url: string;
  title: string;
}

interface SerpRow {
  position: number;
  url: string;
  domain: string;
  title: string;
}

interface KeywordGapRow {
  keyword: string;
  vol: number | null;
  competitorRank: number | null;
  myRank: number | null;
}

function normalizeDomain(input: string): string | null {
  let v = (input || "").trim().toLowerCase();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  try {
    const host = new URL(v).hostname.replace(/^www\./, "");
    if (!host.includes(".")) return null;
    return host;
  } catch {
    return null;
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function domainMatches(row: string, target: string): boolean {
  return row === target || row.endsWith("." + target);
}

async function fetchSerp(keyword: string, serperKey: string | undefined): Promise<SerpRow[]> {
  // 1) 캐시 조회
  const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });
  if (cached && cached.length > 0) {
    return cached.map((item, i) => ({
      position: i + 1,
      url: item.url,
      domain: extractDomain(item.url),
      title: item.title,
    }));
  }

  if (!serperKey) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, gl: "kr", hl: "ko", num: 20 }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { organic?: SerperOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];
    const rows: SerpRow[] = organic
      .filter((item) => typeof item.link === "string" && typeof item.title === "string")
      .map((item, i) => ({
        position: item.position || i + 1,
        url: item.link as string,
        domain: extractDomain(item.link as string),
        title: item.title as string,
      }));

    if (rows.length > 0) {
      // 캐시 저장
      await saveToCache("serp", {
        keyword,
        results: rows.map((r) => ({ url: r.url, title: r.title })),
      });
    }
    return rows;
  } catch {
    return [];
  }
}

async function fetchSeedKeywordsFromVebApi(
  domain: string,
  vebKey: string,
): Promise<Array<{ text: string; vol: number | null }>> {
  // VebAPI keyword research — domain 자체를 seed로 사용
  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/keywordresearch?keyword=${encodeURIComponent(domain)}&country=kr`,
      {
        headers: {
          "X-API-KEY": vebKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(20000),
      },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as VebApiKeywordItem[] | unknown;
    const list = Array.isArray(data) ? (data as VebApiKeywordItem[]) : [];
    return list
      .filter((k) => typeof k.text === "string" && k.text.trim().length > 0)
      .slice(0, MAX_KEYWORDS)
      .map((k) => ({
        text: k.text as string,
        vol: typeof k.vol === "number" ? k.vol : null,
      }));
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rl = await checkRateLimit(ip, "keyword-gap", limit, 1440);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { myDomain?: unknown; competitorDomain?: unknown; seedKeywords?: unknown }
      | null;
    const myInput = body && typeof body.myDomain === "string" ? body.myDomain : "";
    const compInput = body && typeof body.competitorDomain === "string" ? body.competitorDomain : "";
    const seedRaw = body && Array.isArray(body.seedKeywords) ? body.seedKeywords : null;

    const myDomain = normalizeDomain(myInput);
    const competitorDomain = normalizeDomain(compInput);

    if (!myDomain || !competitorDomain) {
      return NextResponse.json(
        { error: "두 개의 올바른 도메인을 입력해주세요." },
        { status: 400 },
      );
    }
    if (myDomain === competitorDomain) {
      return NextResponse.json(
        { error: "서로 다른 도메인을 입력해주세요." },
        { status: 400 },
      );
    }

    let keywords: Array<{ text: string; vol: number | null }>;
    if (seedRaw && seedRaw.length > 0) {
      keywords = seedRaw
        .filter((k): k is string => typeof k === "string" && k.trim().length > 0)
        .slice(0, MAX_KEYWORDS)
        .map((k) => ({ text: k.trim(), vol: null }));
    } else {
      const vebKey = process.env.VEBAPI_KEY;
      if (!vebKey) {
        return NextResponse.json(
          { error: "키워드 분석 API가 설정되지 않았습니다." },
          { status: 500 },
        );
      }
      keywords = await fetchSeedKeywordsFromVebApi(competitorDomain, vebKey);
      if (keywords.length === 0) {
        return NextResponse.json(
          { error: "경쟁사 도메인에서 키워드를 추출하지 못했습니다. seedKeywords를 직접 입력해주세요." },
          { status: 502 },
        );
      }
    }

    const serperKey = process.env.SERPER_API_KEY;

    // 각 키워드 SERP 병렬 조회 (Promise.allSettled — 실패 내성)
    const serpSettled = await Promise.allSettled(
      keywords.map((k) => fetchSerp(k.text, serperKey)),
    );

    const onlyCompetitor: KeywordGapRow[] = [];
    const both: KeywordGapRow[] = [];
    const onlyMine: KeywordGapRow[] = [];
    const neither: KeywordGapRow[] = [];

    keywords.forEach((kw, i) => {
      const rSettled = serpSettled[i];
      const rows: SerpRow[] =
        rSettled && rSettled.status === "fulfilled" ? rSettled.value : [];

      let myRank: number | null = null;
      let compRank: number | null = null;
      for (const r of rows) {
        if (myRank == null && domainMatches(r.domain, myDomain)) myRank = r.position;
        if (compRank == null && domainMatches(r.domain, competitorDomain)) compRank = r.position;
        if (myRank != null && compRank != null) break;
      }

      const row: KeywordGapRow = {
        keyword: kw.text,
        vol: kw.vol,
        competitorRank: compRank,
        myRank,
      };

      if (compRank != null && myRank == null) onlyCompetitor.push(row);
      else if (compRank != null && myRank != null) both.push(row);
      else if (compRank == null && myRank != null) onlyMine.push(row);
      else neither.push(row);
    });

    // 로깅
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "keyword-gap",
        input_summary: `${myDomain} vs ${competitorDomain}`,
        ip_address: ip,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      myDomain,
      competitorDomain,
      counts: {
        total: keywords.length,
        onlyCompetitor: onlyCompetitor.length,
        both: both.length,
        onlyMine: onlyMine.length,
        neither: neither.length,
      },
      onlyCompetitor,
      both,
      onlyMine,
      neither,
    });
  } catch {
    return NextResponse.json(
      { error: "키워드 갭 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
