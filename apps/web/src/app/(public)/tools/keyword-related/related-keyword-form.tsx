"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { trackToolUsage } from "@/lib/gtag";
import { BacklinkCta } from "@/components/backlink-cta";
import { RelatedTools } from "@/components/related-tools";

interface RelatedResult {
  keyword: string;
  containing: string[];
  related: string[];
  total: number;
}

export function RelatedKeywordForm() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RelatedResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleAnalyze() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/related-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
      } else {
        trackToolUsage("keyword-related");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  function copyAll() {
    if (!result) return;
    const all = [...result.containing, ...result.related].join("\n");
    navigator.clipboard.writeText(all);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 입력 (예: 백링크, SEO 분석)"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading || !keyword.trim()}>
              {loading ? "분석 중..." : "관련 키워드 찾기"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              구글 자동완성 데이터를 확장 분석하고 있습니다... (약 5~10초)
            </p>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* 통계 */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-3xl font-bold text-primary">{result.total}</p>
                <p className="text-xs text-muted-foreground mt-1">총 관련 키워드</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-3xl font-bold text-blue-600">{result.containing.length}</p>
                <p className="text-xs text-muted-foreground mt-1">포함 키워드</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-3xl font-bold text-green-600">{result.related.length}</p>
                <p className="text-xs text-muted-foreground mt-1">연관 키워드</p>
              </CardContent>
            </Card>
          </div>

          {/* 복사 버튼 */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={copyAll}>
              {copied ? "복사됨!" : "전체 키워드 복사"}
            </Button>
          </div>

          {/* 포함 키워드 */}
          {result.containing.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  포함 키워드 ({result.containing.length}개)
                </CardTitle>
                <CardDescription>
                  &ldquo;{result.keyword}&rdquo;가 포함된 확장 키워드입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.containing.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full border bg-blue-50 px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100 transition-colors cursor-default"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 연관 키워드 */}
          {result.related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  연관 키워드 ({result.related.length}개)
                </CardTitle>
                <CardDescription>
                  &ldquo;{result.keyword}&rdquo;와 함께 검색되는 연관 키워드입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.related.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full border bg-green-50 px-3 py-1.5 text-sm text-green-800 hover:bg-green-100 transition-colors cursor-default"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.total === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p className="text-lg font-medium">관련 키워드를 찾지 못했습니다</p>
                <p className="mt-1 text-sm">다른 키워드로 시도해보세요.</p>
              </CardContent>
            </Card>
          )}
          <BacklinkCta variant="general" />
        </>
      )}
      <RelatedTools currentTool="keyword-related" />
    </div>
  );
}
