import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache } from "@/lib/cache-api";

export const maxDuration = 30;

interface SerpCachedItem {
  url: string;
  title: string;
}

interface SerpOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

interface SerpResultRow {
  position: number;
  title: string;
  url: string;
  domain: string;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function normalizeDomainInput(input: string): string {
  let value = input.trim();
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = "https://" + value;
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return input.trim().replace(/^www\./, "").toLowerCase();
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "serp-checker", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { keyword?: string; domain?: string };
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
    const domainRaw = typeof body.domain === "string" ? body.domain.trim() : "";
    const myDomain = domainRaw ? normalizeDomainInput(domainRaw) : "";

    if (!keyword) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }

    // 1) 캐시 조회
    const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });

    let results: SerpResultRow[] = [];
    let fromCache = false;

    if (cached && cached.length > 0) {
      fromCache = true;
      results = cached.map((item, i) => ({
        position: i + 1,
        title: item.title,
        url: item.url,
        domain: extractDomain(item.url),
      }));
    } else {
      // 2) Serper 직접 호출
      const apiKey = process.env.SERPER_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "SERP API가 설정되지 않았습니다." },
          { status: 500 },
        );
      }

      const serperRes = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: keyword,
          gl: "kr",
          hl: "ko",
          num: 20,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!serperRes.ok) {
        return NextResponse.json(
          { error: "SERP 데이터를 가져오는데 실패했습니다." },
          { status: 502 },
        );
      }

      const data = (await serperRes.json()) as { organic?: SerpOrganicItem[] };
      const organic = Array.isArray(data.organic) ? data.organic : [];

      results = organic
        .filter((item) => typeof item.link === "string" && typeof item.title === "string")
        .map((item, i) => ({
          position: item.position || i + 1,
          title: item.title as string,
          url: item.link as string,
          domain: extractDomain(item.link as string),
        }));

      // 3) 캐시 저장
      if (results.length > 0) {
        await saveToCache("serp", {
          keyword,
          results: results.map((r) => ({ url: r.url, title: r.title })),
        });
      }
    }

    // 4) 내 도메인 순위 계산
    let myRank: number | null = null;
    let myHit: SerpResultRow | null = null;
    if (myDomain) {
      for (const row of results) {
        if (row.domain === myDomain || row.domain.endsWith("." + myDomain)) {
          myRank = row.position;
          myHit = row;
          break;
        }
      }
    }

    // 5) 로깅
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "serp-checker",
        input_summary: myDomain ? `${keyword} | ${myDomain}` : keyword,
        ip_address: ip,
      });
    } catch {
      // 로깅 실패는 무시
    }

    return NextResponse.json({
      keyword,
      domain: myDomain || null,
      fromCache,
      results,
      myRank,
      myHit,
    });
  } catch {
    return NextResponse.json(
      { error: "SERP 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
