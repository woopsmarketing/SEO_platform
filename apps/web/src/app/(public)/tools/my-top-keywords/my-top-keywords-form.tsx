"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface RankedKeyword {
  keyword: string;
  myRank: number;
  avgTopDA: number | null;
  searchVolume?: number;
}

interface MyTopKeywordsResult {
  domain: string;
  rankedKeywords: RankedKeyword[];
  totalCheckedKeywords: number;
  generatedAt: string;
}

function rankBadge(rank: number): { label: string; className: string } {
  if (rank <= 3) {
    return {
      label: `🥇 ${rank}위`,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  }
  if (rank <= 10) {
    return {
      label: `🥈 ${rank}위`,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };
  }
  if (rank <= 20) {
    return {
      label: `🥉 ${rank}위`,
      className: "bg-orange-100 text-orange-800 border-orange-200",
    };
  }
  return {
    label: `${rank}위`,
    className: "bg-blue-50 text-blue-700 border-blue-100",
  };
}

function difficultyColor(da: number | null): string {
  if (da == null) return "text-muted-foreground";
  if (da >= 70) return "text-red-600";
  if (da >= 50) return "text-orange-600";
  if (da >= 30) return "text-amber-600";
  return "text-emerald-600";
}

export function MyTopKeywordsForm() {
  const [domain, setDomain] = useState("");
  const [seeds, setSeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [result, setResult] = useState<MyTopKeywordsResult | null>(null);

  async function handleAnalyze() {
    if (!domain.trim()) {
      setError("도메인을 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    const seedList = seeds
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    trackToolAttempt("my-top-keywords");
    try {
      const res = await fetch("/api/my-top-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.trim(),
          seedKeywords: seedList.length > 0 ? seedList : undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("my-top-keywords", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("my-top-keywords", data.error || "api_error");
      } else {
        trackToolUsage("my-top-keywords");
        setResult(data as MyTopKeywordsResult);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("my-top-keywords", "network_error");
    }
    setLoading(false);
  }

  const top10Count =
    result?.rankedKeywords.filter((k) => k.myRank <= 10).length ?? 0;
  const top3Count =
    result?.rankedKeywords.filter((k) => k.myRank <= 3).length ?? 0;
  const avgRank =
    result && result.rankedKeywords.length > 0
      ? Math.round(
          result.rankedKeywords.reduce((s, k) => s + k.myRank, 0) /
            result.rankedKeywords.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">도메인 입력</CardTitle>
          <CardDescription>
            도메인만 입력하면 자동으로 관련 키워드를 확장합니다. 시드 키워드를 직접 입력할 수도 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAnalyze()}
          />
          <div>
            <label className="text-sm font-medium">시드 키워드 (선택)</label>
            <Textarea
              value={seeds}
              onChange={(e) => setSeeds(e.target.value)}
              placeholder="쉼표 또는 줄바꿈으로 구분 (비워두면 VebAPI로 자동 확장)"
              rows={3}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              입력한 키워드는 최대 50개까지 조사됩니다.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAnalyze} disabled={loading || !domain.trim()}>
              {loading ? "분석 중..." : "노출 키워드 분석"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              키워드별 SERP와 경쟁도를 조회하고 있습니다... (최대 60초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="내 노출 키워드 TOP 20"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">총 노출 키워드</p>
                <p className="mt-1 text-2xl font-bold">
                  {result.rankedKeywords.length}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  조사: {result.totalCheckedKeywords}개
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">
                  1~3위 (TOP 3)
                </p>
                <p className="mt-1 text-2xl font-bold text-yellow-700">
                  {top3Count}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">
                  1~10위 (1페이지)
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {top10Count}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">평균 순위</p>
                <p className="mt-1 text-2xl font-bold">
                  {avgRank > 0 ? avgRank : "-"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                노출 키워드 TOP {result.rankedKeywords.length}
              </CardTitle>
              <CardDescription>
                {result.domain} — 구글 상위 100위 안에 노출된 키워드 (순위 오름차순)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.rankedKeywords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">#</th>
                        <th className="pb-2 pr-3 font-medium">키워드</th>
                        <th className="pb-2 pr-3 font-medium">내 순위</th>
                        <th className="pb-2 pr-3 font-medium text-right">월 검색량</th>
                        <th className="pb-2 pr-3 font-medium text-right">
                          경쟁도 (avg DA)
                        </th>
                        <th className="pb-2 font-medium">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rankedKeywords.map((k, i) => {
                        const badge = rankBadge(k.myRank);
                        return (
                          <tr
                            key={k.keyword}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            <td className="py-2.5 pr-3 tabular-nums">{i + 1}</td>
                            <td className="py-2.5 pr-3 font-medium">{k.keyword}</td>
                            <td className="py-2.5 pr-3">
                              <span
                                className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                              {k.searchVolume != null
                                ? k.searchVolume.toLocaleString()
                                : "-"}
                            </td>
                            <td
                              className={`py-2.5 pr-3 text-right tabular-nums font-semibold ${difficultyColor(k.avgTopDA)}`}
                            >
                              {k.avgTopDA ?? "-"}
                            </td>
                            <td className="py-2.5">
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}&gl=kr&hl=ko`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                구글 확인 →
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  구글 상위 100위 안에 노출된 키워드를 찾지 못했습니다.
                  시드 키워드를 직접 입력해 다시 시도해 보세요.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
