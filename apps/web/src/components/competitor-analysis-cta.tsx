"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CompetitorAnalysisCTAProps {
  siteUrl?: string;
  toolName?: string;
}

export function CompetitorAnalysisCTA({ siteUrl, toolName = "onpage-audit" }: CompetitorAnalysisCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim() || !email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/competitor-analysis-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: siteUrl || "",
          keyword: keyword.trim(),
          email: email.trim(),
          toolName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "요청에 실패했습니다.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  // 성공 화면
  if (success) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-bold text-green-800">분석 요청이 접수되었습니다</p>
        <p className="mt-2 text-sm text-green-700">
          경쟁사 비교 분석이 완료되면 <strong>{email}</strong>으로 리포트를 보내드립니다.
        </p>
        <p className="mt-1 text-xs text-green-600">보통 5~10분 내에 발송됩니다.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 토글 버튼 — 눈에 띄는 그라데이션 박스 */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-[2px] shadow-lg hover:shadow-xl transition-all group"
        >
          <div className="rounded-[10px] bg-white px-5 py-4 flex items-center gap-4 group-hover:bg-blue-50/50 transition-colors">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-bold text-gray-900">
                경쟁사와 비교 분석하기
                <span className="ml-2 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">무료</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">구글 상위 5개 경쟁사와 내 사이트를 비교한 SEO 리포트를 이메일로 받아보세요</p>
            </div>
            <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* 폼 */}
      {isOpen && (
        <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">경쟁사 비교 분석</h3>
                <p className="text-xs text-gray-500">구글 상위 5개 경쟁사와 온페이지 SEO를 비교합니다</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {siteUrl && (
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-xs font-medium text-gray-400">분석 URL</span>
                <p className="text-sm text-gray-800 truncate">{siteUrl}</p>
              </div>
            )}

            <div>
              <label htmlFor="comp-keyword" className="text-xs font-medium text-gray-600">
                타겟 키워드 <span className="text-red-500">*</span>
              </label>
              <Input
                id="comp-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: SEO 최적화, 백링크 구축"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-400 mt-1">이 키워드로 구글 검색 시 나오는 상위 경쟁사와 비교합니다</p>
            </div>

            <div>
              <label htmlFor="comp-email" className="text-xs font-medium text-gray-600">
                이메일 <span className="text-red-500">*</span>
              </label>
              <Input
                id="comp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="report@example.com"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-400 mt-1">분석 리포트가 이 이메일로 발송됩니다</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !keyword.trim() || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  요청 중...
                </span>
              ) : (
                "무료 경쟁사 분석 리포트 받기"
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              보통 5~10분 내에 이메일로 리포트가 발송됩니다
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
