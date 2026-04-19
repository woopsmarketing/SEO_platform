import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

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
        const keywords = Array.isArray(data) ? data : [];
        const summary = {
          keyword,
          country,
          totalResults: keywords.length,
          avgCpc:
            keywords.length > 0
              ? (
                  keywords.reduce(
                    (sum: number, k: { cpc: string }) =>
                      sum + parseFloat(k.cpc || "0"),
                    0
                  ) / keywords.length
                ).toFixed(2)
              : "0",
          avgVol:
            keywords.length > 0
              ? Math.round(
                  keywords.reduce(
                    (sum: number, k: { vol: number }) => sum + (k.vol || 0),
                    0
                  ) / keywords.length
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
      results: Array.isArray(data) ? data : [],
    });
  } catch {
    return NextResponse.json(
      { error: "키워드 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
