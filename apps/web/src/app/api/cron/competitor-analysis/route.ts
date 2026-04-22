import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzeCompetitors } from "@/lib/competitor-analyzer";

export const maxDuration = 60;

/**
 * Cron: 경쟁사 분석 처리 (1분마다 호출)
 * pending 요청 1건을 가져와서 분석 실행 → 결과 저장
 */
export async function GET(request: Request) {
  // Cron 인증
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // 1. pending 요청 1건 조회 (가장 오래된 것)
    const { data: pending, error: fetchError } = await supabase
      .from("competitor_analysis_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (fetchError || !pending) {
      return NextResponse.json({ message: "No pending requests" });
    }

    // 2. 재시도 횟수 확인 (3회 초과 → failed)
    if (pending.retry_count >= 3) {
      await supabase
        .from("competitor_analysis_requests")
        .update({
          status: "failed",
          error_message: "Maximum retry count exceeded",
        })
        .eq("id", pending.id);

      return NextResponse.json({ message: "Request failed after max retries", id: pending.id });
    }

    // 3. status를 analyzing으로 변경 (락)
    const { error: lockError } = await supabase
      .from("competitor_analysis_requests")
      .update({
        status: "analyzing",
        retry_count: pending.retry_count + 1,
      })
      .eq("id", pending.id)
      .eq("status", "pending"); // 낙관적 잠금

    if (lockError) {
      return NextResponse.json({ message: "Lock failed", error: lockError.message });
    }

    // 4. 경쟁사 분석 실행
    try {
      const result = await analyzeCompetitors(pending.site_url, pending.keyword);

      // 5. 결과 저장 → status: processing (이메일 발송 대기)
      await supabase
        .from("competitor_analysis_requests")
        .update({
          status: "processing",
          analysis_data: result,
          analyzed_at: new Date().toISOString(),
        })
        .eq("id", pending.id);

      return NextResponse.json({
        message: "Analysis completed",
        id: pending.id,
        competitors: result.competitors.length,
      });
    } catch (err) {
      // 분석 실패 → pending으로 되돌림 (다음 cron에서 재시도)
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      await supabase
        .from("competitor_analysis_requests")
        .update({
          status: "pending",
          error_message: errorMsg,
        })
        .eq("id", pending.id);

      return NextResponse.json({ message: "Analysis failed, will retry", error: errorMsg }, { status: 500 });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
