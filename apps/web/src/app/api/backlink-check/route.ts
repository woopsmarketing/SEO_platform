import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // 로그인 유저는 무제한, 비로그인은 IP당 하루 2회
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    if (!loggedIn) {
      const rateLimit = await checkRateLimit(ip, "backlink-checker", 2, 1440);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: "일일 무료 분석 횟수(2회)를 초과했습니다.", upgrade: true, remaining: 0 },
          { status: 429 }
        );
      }
    }

    let { url } = await request.json();
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

    // VebAPI 호출
    const res = await fetch(
      `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
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
        { error: "백링크 데이터를 가져오는데 실패했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();

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
        const summary = {
          domain,
          totalBacklinks: data.counts?.backlinks?.total ?? 0,
          doFollowBacklinks: data.counts?.backlinks?.doFollow ?? 0,
          totalDomains: data.counts?.domains?.total ?? 0,
          doFollowDomains: data.counts?.domains?.doFollow ?? 0,
          toHomePage: data.counts?.backlinks?.toHomePage ?? 0,
        };
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "backlink-checker",
          input_summary: domain,
          score: null,
          input: { domain },
          result: {
            summary,
            counts: data.counts,
            backlinksCount: data.backlinks?.length ?? 0,
          },
        });
      }
    } catch {
      // 사용자 정보 조회 실패 시 무시
    }

    return NextResponse.json({
      domain,
      counts: data.counts,
      backlinks: data.backlinks || [],
    });
  } catch {
    return NextResponse.json(
      { error: "백링크 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
