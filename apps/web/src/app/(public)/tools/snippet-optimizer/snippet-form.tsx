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
import {
  trackToolAttempt,
  trackToolError,
  trackToolUsage,
  trackRateLimit,
} from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import { BacklinkCta } from "@/components/backlink-cta";

interface Competitor {
  rank: number;
  url: string;
  title: string;
  snippet: string;
}

interface SnippetResult {
  current: { title: string | null; description: string | null };
  competitors: Competitor[];
  suggestions: { titles: [string, string]; description: string };
}

export function SnippetForm() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SnippetResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function handleAnalyze() {
    if (!url.trim() || !keyword.trim()) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("snippet-optimizer");
    try {
      const res = await fetch("/api/snippet-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("snippet-optimizer", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("snippet-optimizer", data.error || "api_error");
      } else {
        trackToolUsage("snippet-optimizer");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("snippet-optimizer", "network_error");
    }
    setLoading(false);
  }

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="분석할 페이지 URL (예: https://example.com/blog/post)"
          />
          <div className="flex gap-3">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="타겟 키워드 (예: 백링크 확인)"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !url.trim() || !keyword.trim()}
            >
              {loading ? "분석 중..." : "스니펫 최적화"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              페이지와 구글 상위 5개 결과를 수집하고 AI 제안을 생성하고 있습니다... (최대 25초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="스니펫 옵티마이저"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* 현재 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">현재 페이지</CardTitle>
                <CardDescription>크롤링된 메타 정보</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Title</p>
                  <p className="mt-1">{result.current.title || "(없음)"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Description</p>
                  <p className="mt-1 leading-relaxed">
                    {result.current.description || "(없음)"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 경쟁사 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">상위 5개 경쟁</CardTitle>
                <CardDescription>구글 검색 결과 (Serper)</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  {result.competitors.map((c) => (
                    <li key={c.rank} className="border-b pb-2 last:border-0 last:pb-0">
                      <p className="text-xs text-muted-foreground">#{c.rank}</p>
                      <p className="font-medium line-clamp-2">{c.title}</p>
                      {c.snippet && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {c.snippet}
                        </p>
                      )}
                    </li>
                  ))}
                  {result.competitors.length === 0 && (
                    <li className="text-muted-foreground">경쟁 데이터가 없습니다.</li>
                  )}
                </ol>
              </CardContent>
            </Card>

            {/* 제안 */}
            <Card className="bg-emerald-50/40 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base">AI 제안</CardTitle>
                <CardDescription>CTR 최적화 (gpt-4o-mini)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Title 1안</p>
                  <p className="mt-1 font-medium">{result.suggestions.titles[0]}</p>
                  <button
                    onClick={() => copy(result.suggestions.titles[0], 0)}
                    className="mt-1 text-xs text-emerald-700 hover:underline"
                  >
                    {copiedIdx === 0 ? "복사됨!" : "복사"}
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Title 2안</p>
                  <p className="mt-1 font-medium">{result.suggestions.titles[1]}</p>
                  <button
                    onClick={() => copy(result.suggestions.titles[1], 1)}
                    className="mt-1 text-xs text-emerald-700 hover:underline"
                  >
                    {copiedIdx === 1 ? "복사됨!" : "복사"}
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Description</p>
                  <p className="mt-1 leading-relaxed">
                    {result.suggestions.description}
                  </p>
                  <button
                    onClick={() => copy(result.suggestions.description, 2)}
                    className="mt-1 text-xs text-emerald-700 hover:underline"
                  >
                    {copiedIdx === 2 ? "복사됨!" : "복사"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          <BacklinkCta variant="general" />
        </>
      )}
    </div>
  );
}
