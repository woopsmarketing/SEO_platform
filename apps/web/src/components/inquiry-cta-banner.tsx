"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 툴 결과 아래에 표시되는 문의 유도 CTA + 소셜 프루프.
 * 결과가 있을 때만 렌더링하도록 부모에서 조건 처리.
 */
export function InquiryCTABanner() {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tool-usage")
      .then((r) => r.json())
      .then((d) => setTotalCount(d.totalAnalyses ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-center shadow-md mt-6">
      {/* 소셜 프루프 */}
      {totalCount !== null && totalCount > 0 && (
        <p className="text-xs font-medium text-blue-200 mb-3">
          지금까지 {totalCount.toLocaleString()}건의 SEO 분석이 완료되었습니다
        </p>
      )}

      <p className="text-lg sm:text-xl font-bold text-white leading-tight">
        이 문제들, 직접 고치기 어려우신가요?
      </p>
      <p className="mt-2 text-sm text-blue-100 max-w-md mx-auto">
        SEO 전문가가 분석 결과를 보고 맞춤 개선안을 제안해드립니다. 상담은 무료입니다.
      </p>
      <Link
        href="/contact"
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow transition-all hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-lg no-underline"
      >
        무료 SEO 진단 받기
      </Link>
    </div>
  );
}
