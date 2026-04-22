"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackToolUsage, trackToolAttempt, trackRateLimit, trackToolError } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import { BacklinkCta } from "@/components/backlink-cta";
import { RelatedTools } from "@/components/related-tools";
import { CompetitorAnalysisCTA } from "@/components/competitor-analysis-cta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WordItem {
  word?: string;
  occurrences?: number;
  percent?: string;
  weight?: string;
  inTitle?: boolean;
  inDescription?: boolean;
}

interface KeywordDensityResult {
  domain: string;
  keyword: string;
  title: string;
  description: string;
  targetCount: number;
  targetDensity: string;
  totalWordCount: number;
  words: WordItem[];
}

function parsePercent(p?: string): number {
  if (!p) return 0;
  return parseFloat(p.replace("%", "")) || 0;
}

function getDensityBadge(percent?: string): string {
  const n = parsePercent(percent);
  if (n >= 5) return "bg-red-100 text-red-700";
  if (n >= 3) return "bg-yellow-100 text-yellow-700";
  if (n >= 1) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-600";
}

export function KeywordDensityForm() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KeywordDensityResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleAnalyze() {
    if (!url || !keyword) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("keyword-density");
    try {
      const res = await fetch("/api/keyword-density", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("keyword-density", "guest");
        } else {
          trackToolError("keyword-density", data.error || "api_error");
        }
      } else {
        trackToolUsage("keyword-density");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("keyword-density", "network_error");
    }
    setLoading(false);
  }

  const words = result?.words ?? [];
  const sortedWords = [...words].sort(
    (a, b) => (b.occurrences ?? 0) - (a.occurrences ?? 0)
  );

  // 타겟 키워드 찾기
  const targetWord = words.find(
    (w) => w.word?.toLowerCase() === result?.keyword?.toLowerCase()
  );

  return (
    <div className="space-y-8">
      {/* 입력 폼 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="SEO 분석"
              className="flex-1 sm:max-w-[240px]"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !url || !keyword}
              className="shrink-0"
            >
              {loading ? "분석 중..." : "키워드 분석"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal open={showUpgrade} onClose={() => setShowUpgrade(false)} toolName="키워드 밀도 분석" />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              키워드 밀도를 분석하고 있습니다... (최대 20초)
            </p>
          )}
        </CardContent>
      </Card>

      <SignupBanner />
      {result && (
        <>
          {/* 페이지 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">페이지 정보</CardTitle>
              <CardDescription>{result.domain}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  제목 (Title)
                </p>
                <p className="text-sm">{result.title || "(제목 없음)"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  설명 (Description)
                </p>
                <p className="text-sm">
                  {result.description || "(설명 없음)"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 통계 카드 3개 */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="발견된 키워드 수"
              value={words.length}
              sub="페이지에서 발견된 고유 키워드"
            />
            <StatCard
              label="타겟 키워드 밀도"
              value={
                result.targetCount > 0
                  ? result.targetDensity
                  : "미발견"
              }
              sub={
                result.targetCount > 0
                  ? `"${result.keyword}" — ${result.targetCount}회 사용`
                  : `"${result.keyword}" 키워드가 페이지에서 발견되지 않았습니다`
              }
              highlight={result.targetCount > 0}
              warning={false}
            />
            <StatCard
              label="총 분석 단어 수"
              value={result.totalWordCount.toLocaleString()}
              sub="페이지 내 전체 단어 수"
            />
          </div>

          {/* 키워드 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                키워드 분석 결과 ({sortedWords.length}개)
              </CardTitle>
              <CardDescription>
                사용 횟수 내림차순으로 정렬. 밀도 1~3% 녹색, 3~5% 노란색, 5%
                이상 빨간색.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedWords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">키워드</th>
                        <th className="pb-2 pr-3 font-medium text-right">
                          사용 횟수
                        </th>
                        <th className="pb-2 pr-3 font-medium text-right">
                          밀도
                        </th>
                        <th className="pb-2 pr-3 font-medium text-right">
                          가중치
                        </th>
                        <th className="pb-2 pr-3 font-medium text-center">
                          제목 포함
                        </th>
                        <th className="pb-2 font-medium text-center">
                          설명 포함
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedWords.map((w, i) => (
                        <tr
                          key={i}
                          className={`border-b last:border-0 hover:bg-muted/50 ${
                            w.word?.toLowerCase() ===
                            result.keyword?.toLowerCase()
                              ? "bg-orange-50/50"
                              : ""
                          }`}
                        >
                          <td className="py-2.5 pr-3 font-medium">
                            {w.word || "-"}
                            {w.word?.toLowerCase() ===
                              result.keyword?.toLowerCase() && (
                              <span className="ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700">
                                타겟
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">
                            {w.occurrences ?? 0}
                          </td>
                          <td className="py-2.5 pr-3 text-right">
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-medium ${getDensityBadge(w.percent)}`}
                            >
                              {w.percent ?? "-"}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                            {w.weight ?? "-"}
                          </td>
                          <td className="py-2.5 pr-3 text-center">
                            {w.inTitle ? (
                              <span className="text-green-600 font-semibold">
                                &#x2714;
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                &#x2718;
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-center">
                            {w.inDescription ? (
                              <span className="text-green-600 font-semibold">
                                &#x2714;
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                &#x2718;
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  이 페이지에서 키워드 데이터가 발견되지 않았습니다.
                </p>
              )}
            </CardContent>
          </Card>
          <BacklinkCta variant="general" />
          <CompetitorAnalysisCTA
            siteUrl={url.startsWith("http") ? url : `https://${url}`}
            toolName="keyword-density"
          />
        </>
      )}
      <RelatedTools currentTool="keyword-density" />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
  warning,
}: {
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            warning
              ? "text-red-600"
              : highlight
                ? "text-green-700"
                : ""
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
