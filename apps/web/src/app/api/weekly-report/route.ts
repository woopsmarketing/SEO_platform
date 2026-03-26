import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

interface ReportItem {
  url: string;
  score: number | null;
  title: string | null;
  issues: string[];
}

export async function POST(request: Request) {
  try {
    const { email, reports } = (await request.json()) as {
      email: string;
      reports: ReportItem[];
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || !Array.isArray(reports) || reports.length === 0) {
      return NextResponse.json(
        { error: "올바른 이메일과 리포트 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    const avgScore =
      reports.filter((r) => r.score !== null).length > 0
        ? Math.round(
            reports
              .filter((r) => r.score !== null)
              .reduce((sum, r) => sum + (r.score ?? 0), 0) /
              reports.filter((r) => r.score !== null).length
          )
        : null;

    const reportRows = reports
      .map(
        (r) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 8px;">
            <a href="${safeUrl(r.url)}" style="color: #2563EB; text-decoration: none;">${escHtml(r.url)}</a>
          </td>
          <td style="padding: 12px 8px; text-align: center; font-weight: bold; color: ${
            (r.score ?? 0) >= 70 ? "#16a34a" : (r.score ?? 0) >= 40 ? "#d97706" : "#dc2626"
          };">
            ${r.score !== null ? r.score + "점" : "분석 실패"}
          </td>
          <td style="padding: 12px 8px; font-size: 13px; color: #666;">
            ${r.issues.length > 0 ? r.issues.slice(0, 3).map((i) => escHtml(i)).join("<br/>") : "양호"}
          </td>
        </tr>`
      )
      .join("");

    const now = new Date();
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; background: #fff;">
        <div style="background: #2563EB; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">SEO월드 주간 리포트</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">${dateStr} 기준</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          ${avgScore !== null ? `<p style="font-size: 16px; margin-bottom: 20px;">평균 SEO 점수: <strong style="color: ${avgScore >= 70 ? "#16a34a" : avgScore >= 40 ? "#d97706" : "#dc2626"}; font-size: 24px;">${avgScore}점</strong></p>` : ""}
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 8px; text-align: left; font-size: 13px; color: #666;">도메인</th>
                <th style="padding: 8px; text-align: center; font-size: 13px; color: #666;">점수</th>
                <th style="padding: 8px; text-align: left; font-size: 13px; color: #666;">주요 이슈</th>
              </tr>
            </thead>
            <tbody>
              ${reportRows}
            </tbody>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://seoworld.co.kr/dashboard"
               style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">
              대시보드에서 자세히 보기
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            이 이메일은 SEO월드에서 자동 발송되었습니다. |
            <a href="https://seoworld.co.kr/dashboard/weekly-report" style="color: #2563EB;">설정 변경</a>
          </p>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: [{ email }],
      subject: `[SEO월드] 주간 SEO 리포트 — ${dateStr}`,
      htmlContent,
    });

    if (result === null) {
      return NextResponse.json(
        { error: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "리포트 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(s: string): string {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? escHtml(s) : "#";
  } catch {
    return "#";
  }
}
