import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { renderCompetitorReportEmail } from "@/lib/email/competitor-report-template";
import type { CompetitorAnalysisResult } from "@/lib/competitor-analyzer";

export const maxDuration = 30;

/**
 * Cron: 경쟁사 분석 리포트 이메일 발송 (2분마다 호출)
 * processing 상태 + analysis_data 있는 요청에 이메일 발송
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
    // 1. processing 상태 + analyzed_at이 2분 이상 경과한 요청 조회
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    const { data: requests, error: fetchError } = await supabase
      .from("competitor_analysis_requests")
      .select("*")
      .eq("status", "processing")
      .not("analysis_data", "is", null)
      .lte("analyzed_at", twoMinAgo)
      .order("analyzed_at", { ascending: true })
      .limit(3);

    if (fetchError || !requests || requests.length === 0) {
      return NextResponse.json({ message: "No reports to send" });
    }

    const results: { id: number; status: string }[] = [];

    for (const req of requests) {
      // 2. 발송 락 (status: sending_report)
      const { error: lockError } = await supabase
        .from("competitor_analysis_requests")
        .update({ status: "sending_report" })
        .eq("id", req.id)
        .eq("status", "processing");

      if (lockError) {
        results.push({ id: req.id, status: "lock_failed" });
        continue;
      }

      try {
        // 3. 이메일 템플릿 렌더링
        const analysisData = req.analysis_data as CompetitorAnalysisResult;
        const htmlContent = renderCompetitorReportEmail(analysisData);

        // 4. 이메일 발송 (Brevo)
        const emailResult = await sendEmail({
          to: [{ email: req.email }],
          subject: `[SEO월드] "${req.keyword}" 경쟁사 비교 분석 리포트`,
          htmlContent,
        });

        if (emailResult) {
          // 발송 성공
          await supabase
            .from("competitor_analysis_requests")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
            })
            .eq("id", req.id);

          results.push({ id: req.id, status: "sent" });
        } else {
          // 발송 실패 → processing으로 되돌림
          await supabase
            .from("competitor_analysis_requests")
            .update({
              status: "processing",
              error_message: "Email send failed",
            })
            .eq("id", req.id);

          results.push({ id: req.id, status: "send_failed" });
        }
      } catch (err) {
        // 에러 → processing으로 되돌림
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        await supabase
          .from("competitor_analysis_requests")
          .update({
            status: "processing",
            error_message: errorMsg,
          })
          .eq("id", req.id);

        results.push({ id: req.id, status: "error" });
      }
    }

    return NextResponse.json({ message: "Report sending completed", results });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
