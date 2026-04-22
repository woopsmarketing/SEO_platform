import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: IP당 하루 2회
    const rateLimit = await checkRateLimit(ip, "competitor-analysis", 2, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "일일 요청 횟수(2회)를 초과했습니다. 내일 다시 시도해주세요." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { siteUrl, keyword, email, toolName } = body;

    // 입력 검증
    if (!siteUrl || typeof siteUrl !== "string") {
      return NextResponse.json({ error: "분석할 URL을 입력해주세요." }, { status: 400 });
    }
    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 2) {
      return NextResponse.json({ error: "키워드를 입력해주세요. (최소 2자)" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // URL 정규화
    let normalizedUrl = siteUrl.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    const supabase = createAdminClient();

    // 동일 URL+이메일 중복 확인 (24시간 이내)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("competitor_analysis_requests")
      .select("id")
      .eq("site_url", normalizedUrl)
      .eq("email", email)
      .gte("created_at", oneDayAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "동일한 URL로 이미 요청하셨습니다. 이메일을 확인해주세요." },
        { status: 409 },
      );
    }

    // DB 저장
    const { error: insertError } = await supabase.from("competitor_analysis_requests").insert({
      tool_name: toolName || "onpage-audit",
      site_url: normalizedUrl,
      keyword: keyword.trim(),
      email: email.trim().toLowerCase(),
      status: "pending",
      ip_address: ip,
    });

    if (insertError) {
      console.error("DB insert error:", insertError);
      return NextResponse.json({ error: "요청 저장에 실패했습니다." }, { status: 500 });
    }

    // Rate limit 로그 기록
    await supabase.from("tool_usage_logs").insert({
      tool_type: "competitor-analysis",
      input_summary: `${normalizedUrl} | ${keyword}`,
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: "경쟁사 분석 요청이 접수되었습니다. 분석 완료 후 이메일로 리포트를 보내드립니다.",
    });
  } catch {
    return NextResponse.json({ error: "요청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
