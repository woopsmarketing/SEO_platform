"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import {
  trackToolAttempt,
  trackToolUsage,
  trackToolError,
  trackRateLimit,
} from "@/lib/gtag";

interface PaaRow {
  question: string;
  snippet: string;
  title: string;
  link: string;
}

interface PaaResponse {
  keyword: string;
  hasPaa: boolean;
  paa: PaaRow[];
  related: string[];
}

export function PaaForm() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaaResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  async function handleCheck() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    setOpenIndex(null);

    trackToolAttempt("people-also-ask");
    try {
      const res = await fetch("/api/people-also-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("people-also-ask", "guest");
        } else {
          trackToolError("people-also-ask", data.error || "api_error");
        }
      } else {
        setResult(data as PaaResponse);
        trackToolUsage("people-also-ask");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("people-also-ask", "network_error");
    }
    setLoading(false);
  }

  function toggle(idx: number) {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 (예: 백링크)"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={loading || !keyword.trim()}>
              {loading ? "조회 중..." : "PAA 찾기"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="PAA 마이너"
              />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              PAA 질문을 수집 중입니다...
            </p>
          )}
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                &ldquo;{result.keyword}&rdquo; 관련 질문 {result.paa.length}개
              </CardTitle>
              <CardDescription>
                {result.hasPaa
                  ? "질문을 클릭하면 구글 스니펫과 출처 링크를 확인할 수 있습니다."
                  : "해당 키워드에는 PAA가 노출되지 않았습니다. 관련 검색어를 참고하세요."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.paa.length > 0 ? (
                <ul className="space-y-2">
                  {result.paa.map((row, i) => {
                    const open = openIndex === i;
                    return (
                      <li
                        key={`${i}-${row.question}`}
                        className="rounded-lg border bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(i)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        >
                          <span className="text-sm font-medium text-blue-900">
                            {row.question}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {open ? "▲" : "▼"}
                          </span>
                        </button>
                        {open && (
                          <div className="border-t px-4 py-3 space-y-2">
                            {row.snippet && (
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {row.snippet}
                              </p>
                            )}
                            {row.link && (
                              <a
                                href={row.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-700 hover:underline break-all"
                              >
                                {row.title || row.link}
                              </a>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  PAA 결과가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {result.related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">관련 검색어</CardTitle>
                <CardDescription>
                  구글이 함께 제안하는 연관 검색어입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.related.map((q, i) => (
                    <span
                      key={`${i}-${q}`}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs text-blue-800"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
