import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

interface PaaItem {
  question?: string;
  snippet?: string;
  title?: string;
  link?: string;
}

interface RelatedSearchItem {
  query?: string;
}

interface PaaRow {
  question: string;
  snippet: string;
  title: string;
  link: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "people-also-ask", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { keyword?: string };
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
    if (!keyword) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERP API가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    // PAA는 전용 캐시가 없으므로 Serper 직접 호출만 수행.
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
        num: 10,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!serperRes.ok) {
      return NextResponse.json(
        { error: "PAA 데이터를 가져오는데 실패했습니다." },
        { status: 502 },
      );
    }

    const data = (await serperRes.json()) as {
      peopleAlsoAsk?: PaaItem[];
      relatedSearches?: RelatedSearchItem[];
    };

    const paaRaw = Array.isArray(data.peopleAlsoAsk) ? data.peopleAlsoAsk : [];
    const paa: PaaRow[] = paaRaw
      .filter((item): item is PaaItem & { question: string } =>
        typeof item.question === "string" && item.question.length > 0,
      )
      .map((item) => ({
        question: item.question,
        snippet: item.snippet || "",
        title: item.title || "",
        link: item.link || "",
      }));

    const related = (Array.isArray(data.relatedSearches) ? data.relatedSearches : [])
      .map((r) => r.query)
      .filter((q): q is string => typeof q === "string" && q.length > 0);

    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "people-also-ask",
        input_summary: keyword,
        ip_address: ip,
      });
    } catch {
      // 로깅 실패 무시
    }

    return NextResponse.json({
      keyword,
      hasPaa: paa.length > 0,
      paa,
      related,
    });
  } catch {
    return NextResponse.json(
      { error: "PAA 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
