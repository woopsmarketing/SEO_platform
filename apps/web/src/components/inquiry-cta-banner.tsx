"use client";

import { useEffect, useState } from "react";
import { getTelegramUrl } from "@/lib/telegram";
import { trackTelegramClick } from "@/lib/analytics";
import { QuickContactForm } from "@/components/quick-contact-form";

interface InquiryCTABannerProps {
  score?: number;
  issueCount?: number;
  url?: string;
  topIssues?: string[];
}

function getScoreMessage(score: number, issueCount: number) {
  if (score < 50) {
    return {
      title: "지금 방치하면 경쟁사에 밀립니다",
      subtitle: `발견된 ${issueCount}개 문제가 검색 순위를 떨어뜨리고 있습니다. 지금 바로 전문가에게 문의하세요.`,
    };
  }
  if (score < 70) {
    return {
      title: `핵심 문제 ${issueCount}개가 발견됐습니다`,
      subtitle: "지금 개선하지 않으면 경쟁사에 순위를 빼앗깁니다. 전문가가 직접 봐드립니다.",
    };
  }
  if (score < 85) {
    return {
      title: "상위 10%까지 단 몇 점 차이입니다",
      subtitle: "경쟁사는 지금 이 순간에도 백링크를 구축하며 순위를 올리고 있습니다.",
    };
  }
  return {
    title: "좋은 점수네요! 그런데 경쟁사도 보셨나요?",
    subtitle: "경쟁사는 지금 이 순간에도 백링크를 구축하며 순위를 유지하고 있습니다. 방심은 금물입니다.",
  };
}

/**
 * 툴 결과 아래에 표시되는 문의 유도 CTA + 소셜 프루프.
 * 결과가 있을 때만 렌더링하도록 부모에서 조건 처리.
 */
export function InquiryCTABanner({ score, issueCount = 0, url, topIssues = [] }: InquiryCTABannerProps) {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tool-usage")
      .then((r) => r.json())
      .then((d) => setTotalCount(d.totalAnalyses ?? null))
      .catch(() => {});
  }, []);

  const hasScore = typeof score === "number";
  const msg = hasScore
    ? getScoreMessage(score, issueCount)
    : {
        title: "이 문제들, 직접 고치기 어려우신가요?",
        subtitle: "SEO 전문가가 분석 결과를 보고 맞춤 개선안을 제안해드립니다. 상담은 무료입니다.",
      };

  const telegramUrl =
    hasScore && url
      ? getTelegramUrl("onpage", { url, score, topIssues, issueCount })
      : getTelegramUrl("general");

  function handleClick() {
    trackTelegramClick({ source: "tool_result", score });
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 shadow-md mt-6">
      {/* 소셜 프루프 */}
      {totalCount !== null && totalCount > 0 && (
        <p className="text-xs font-medium text-blue-200 mb-3 text-center">
          지금까지 {totalCount.toLocaleString()}건의 SEO 분석이 완료되었습니다
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        {/* 왼쪽: 헤드라인 + 텔레그램 */}
        <div className="text-center lg:text-left">
          <p className="text-lg sm:text-xl font-bold text-white leading-tight">
            {msg.title}
          </p>
          <p className="mt-2 text-sm text-blue-100">
            {msg.subtitle}
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={handleClick}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/20 border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/30 transition-colors no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            텔레그램으로 문의
          </a>
        </div>

        {/* 오른쪽: 인라인 문의 폼 */}
        <div className="rounded-xl bg-white/10 border border-white/20 p-4">
          <p className="text-sm font-semibold text-white mb-3 text-center">
            이메일로 바로 문의하기 <span className="text-blue-200 font-normal">(24시간 내 답변)</span>
          </p>
          <QuickContactForm toolName={url ? "onpage-audit" : undefined} siteUrl={url} />
        </div>
      </div>
    </div>
  );
}
