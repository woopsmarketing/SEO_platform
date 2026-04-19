"use client";

import { useEffect, useState } from "react";
import { getTelegramUrl } from "@/lib/telegram";
import { trackTelegramClick } from "@/lib/analytics";

const KMONG_URL = "https://kmong.com/gig/385229";

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

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-center shadow-md mt-6">
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

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* 텔레그램 버튼 */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={() => trackTelegramClick({ source: "tool_result", score })}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow hover:bg-blue-50 hover:-translate-y-0.5 transition-all no-underline w-full sm:w-auto justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          텔레그램으로 문의하기
        </a>

        {/* 크몽 버튼 */}
        <a
          href={KMONG_URL}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#00C471] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#00b065] hover:-translate-y-0.5 transition-all no-underline w-full sm:w-auto justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
          크몽에서 서비스 보기
        </a>
      </div>
    </div>
  );
}
