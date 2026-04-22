/**
 * 경쟁사 분석 리포트 이메일 HTML 템플릿
 */

import type { CompetitorAnalysisResult } from "@/lib/competitor-analyzer";

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 마크다운을 간단한 HTML로 변환 */
function markdownToHtml(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return `<h3 style="color:#1e40af;margin:20px 0 8px;font-size:16px;">${escHtml(trimmed.slice(4))}</h3>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2 style="color:#1e3a8a;margin:24px 0 10px;font-size:18px;">${escHtml(trimmed.slice(3))}</h2>`;
      }
      if (trimmed.match(/^\d+\.\s\*\*/)) {
        const text = trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        return `<p style="margin:6px 0 6px 16px;">${text}</p>`;
      }
      if (trimmed.startsWith("- ")) {
        const text = trimmed.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        return `<p style="margin:4px 0 4px 16px;">&bull; ${text}</p>`;
      }
      if (trimmed === "") return "<br/>";
      const text = trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return `<p style="margin:4px 0;">${text}</p>`;
    })
    .join("\n");
}

export function renderCompetitorReportEmail(result: CompetitorAnalysisResult): string {
  const { customerSite, competitors, keyword, aiReport, analyzedAt } = result;
  const validCompetitors = competitors.filter((c) => !c.error && c.statusCode === 200);
  const date = new Date(analyzedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const competitorRows = validCompetitors
    .map(
      (c, i) => `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:8px 12px;font-size:13px;">${i + 1}</td>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;">${escHtml(c.domain)}</td>
        <td style="padding:8px 12px;font-size:13px;">${escHtml(c.title?.slice(0, 25) || "-")}${(c.title?.length ?? 0) > 25 ? "..." : ""}</td>
        <td style="padding:8px 12px;font-size:13px;text-align:center;">${c.wordCount}</td>
        <td style="padding:8px 12px;font-size:13px;text-align:center;">${c.h2Count}</td>
        <td style="padding:8px 12px;font-size:13px;text-align:center;">${c.loadTimeMs}ms</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;">

    <!-- 헤더 -->
    <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:22px;margin:0;">경쟁사 SEO 비교 분석 리포트</h1>
      <p style="color:#bfdbfe;font-size:14px;margin:8px 0 0;">키워드: "${escHtml(keyword)}" | ${date}</p>
    </div>

    <!-- 고객 사이트 요약 -->
    <div style="padding:24px;">
      <h2 style="color:#1e3a8a;font-size:16px;margin:0 0 12px;">내 사이트 현황</h2>
      <div style="background:#eff6ff;border-radius:8px;padding:16px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 8px;color:#6b7280;font-size:13px;width:120px;">URL</td>
            <td style="padding:4px 8px;font-size:13px;font-weight:600;">${escHtml(customerSite.url)}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px;color:#6b7280;font-size:13px;">Title</td>
            <td style="padding:4px 8px;font-size:13px;">${escHtml(customerSite.title || "없음")} (${customerSite.titleLength}자)</td>
          </tr>
          <tr>
            <td style="padding:4px 8px;color:#6b7280;font-size:13px;">로딩 속도</td>
            <td style="padding:4px 8px;font-size:13px;">${customerSite.loadTimeMs}ms</td>
          </tr>
          <tr>
            <td style="padding:4px 8px;color:#6b7280;font-size:13px;">콘텐츠 양</td>
            <td style="padding:4px 8px;font-size:13px;">${customerSite.wordCount}단어 | H1: ${customerSite.h1.length}개 | H2: ${customerSite.h2Count}개</td>
          </tr>
          <tr>
            <td style="padding:4px 8px;color:#6b7280;font-size:13px;">기술 SEO</td>
            <td style="padding:4px 8px;font-size:13px;">
              HTTPS: ${customerSite.isHttps ? "O" : "X"} |
              Canonical: ${customerSite.hasCanonical ? "O" : "X"} |
              OG: ${customerSite.hasOgTags ? "O" : "X"} |
              JSON-LD: ${customerSite.hasJsonLd ? "O" : "X"}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 경쟁사 비교 테이블 -->
    <div style="padding:0 24px 24px;">
      <h2 style="color:#1e3a8a;font-size:16px;margin:0 0 12px;">구글 "${escHtml(keyword)}" 상위 경쟁사</h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;font-size:12px;text-align:left;color:#6b7280;">#</th>
              <th style="padding:8px 12px;font-size:12px;text-align:left;color:#6b7280;">도메인</th>
              <th style="padding:8px 12px;font-size:12px;text-align:left;color:#6b7280;">Title</th>
              <th style="padding:8px 12px;font-size:12px;text-align:center;color:#6b7280;">단어수</th>
              <th style="padding:8px 12px;font-size:12px;text-align:center;color:#6b7280;">H2</th>
              <th style="padding:8px 12px;font-size:12px;text-align:center;color:#6b7280;">속도</th>
            </tr>
          </thead>
          <tbody>
            ${competitorRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI 분석 리포트 -->
    <div style="padding:0 24px 24px;">
      <h2 style="color:#1e3a8a;font-size:16px;margin:0 0 12px;">AI 비교 분석</h2>
      <div style="background:#fafafa;border-radius:8px;padding:20px;border:1px solid #e5e7eb;">
        ${markdownToHtml(aiReport)}
      </div>
    </div>

    <!-- CTA -->
    <div style="padding:24px;text-align:center;background:#eff6ff;border-top:1px solid #dbeafe;">
      <p style="color:#1e40af;font-size:15px;font-weight:600;margin:0 0 8px;">
        전문가의 맞춤 SEO 개선이 필요하신가요?
      </p>
      <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">
        경쟁사보다 앞서기 위한 구체적인 전략을 제안해드립니다.
      </p>
      <a href="https://t.me/goat82?text=${encodeURIComponent("안녕하세요! 경쟁사 분석 리포트를 받고 문의드립니다.")}"
         style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        텔레그램으로 상담하기
      </a>
      <div style="margin-top:12px;">
        <a href="https://seoworld.co.kr/services/backlinks"
           style="color:#2563eb;font-size:13px;text-decoration:underline;">
          백링크 서비스 알아보기 &rarr;
        </a>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="padding:20px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">
        이 리포트는 <a href="https://seoworld.co.kr" style="color:#2563eb;">SEO월드</a>에서 자동 생성되었습니다.
      </p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">
        &copy; ${new Date().getFullYear()} SEO월드 | seoworld.co.kr
      </p>
    </div>

  </div>
</body>
</html>`;
}
