import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // Rate Limit: 3회/일
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, "keyword-density", 3, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "일일 무료 분석 횟수(3회)를 초과했습니다. Pro 플랜으로 업그레이드하면 무제한으로 사용할 수 있습니다.",
          upgrade: true,
        },
        { status: 429 }
      );
    }

    const { url, keyword } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json(
        { error: "타겟 키워드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 도메인 추출 (https://www.example.com/path → example.com)
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    let domain: string;
    try {
      domain = new URL(cleanUrl).hostname.replace(/^www\./, "");
    } catch {
      return NextResponse.json(
        { error: "올바른 URL을 입력해주세요." },
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
      `https://vebapi.com/api/seo/keyworddensity?keyword=${encodeURIComponent(keyword.trim())}&website=${encodeURIComponent(domain)}`,
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "키워드 밀도 데이터를 가져오는데 실패했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();

    // tool_usage_logs 기록
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    await adminSupabase.from("tool_usage_logs").insert({
      tool_type: "keyword-density",
      input_summary: `${domain} / ${keyword.trim()}`,
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
          url: domain,
          keyword: keyword.trim(),
          totalWords: data.words?.length ?? 0,
          title: data.title ?? "",
          description: data.description ?? "",
        };
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "keyword-density",
          input_summary: `${domain} / ${keyword.trim()}`,
          score: null,
          input: { domain, keyword: keyword.trim() },
          result: {
            summary,
            title: data.title,
            description: data.description,
            wordsCount: data.words?.length ?? 0,
          },
        });
      }
    } catch {
      // 사용자 정보 조회 실패 시 무시
    }

    return NextResponse.json({
      domain,
      keyword: keyword.trim(),
      title: data.title ?? "",
      description: data.description ?? "",
      words: data.words ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "키워드 밀도 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
