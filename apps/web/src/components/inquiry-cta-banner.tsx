"use client";

import { useEffect, useState } from "react";
import { getTelegramUrl } from "@/lib/telegram";
import { trackTelegramClick } from "@/lib/analytics";

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
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-center shadow-md mt-6">
      {/* 소셜 프루프 */}
      {totalCount !== null && totalCount > 0 && (
        <p className="text-xs font-medium text-blue-200 mb-3">
          지금까지 {totalCount.toLocaleString()}건의 SEO 분석이 완료되었습니다
        </p>
      )}

      <p className="text-lg sm:text-xl font-bold text-white leading-tight">
        {msg.title}
      </p>
      <p className="mt-2 text-sm text-blue-100 max-w-md mx-auto">
        {msg.subtitle}
      </p>
      <a
        href={telegramUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={handleClick}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow transition-all hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg no-underline"
      >
        텔레그램으로 무료 문의하기
      </a>
    </div>
  );
}
