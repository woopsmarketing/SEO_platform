"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
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

type DifficultyLabel = "낮음" | "보통" | "어려움" | "매우 어려움";

interface Row {
  rank: number;
  domain: string;
  url: string;
  title: string;
  mozDA: number | null;
  ahrefsDR: number | null;
  majesticTF: number | null;
}

interface SerpDifficultyResult {
  keyword: string;
  avgDA: number;
  avgDR: number;
  avgTF: number;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  rows: Row[];
}

function labelBadge(l: DifficultyLabel): string {
  if (l === "낮음") return "bg-green-100 text-green-700 border-green-200";
  if (l === "보통") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (l === "어려움") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-red-100 text-red-700 border-red-200";
}

export function SerpDifficultyForm() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SerpDifficultyResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleAnalyze() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("serp-difficulty");
    try {
      const res = await fetch("/api/serp-difficulty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("serp-difficulty", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("serp-difficulty", data.error || "api_error");
      } else {
        trackToolUsage("serp-difficulty");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("serp-difficulty", "network_error");
    }
    setLoading(false);
  }

  const chartData = result?.rows.map((r) => ({
    rank: `#${r.rank}`,
    DA: r.mozDA ?? 0,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 입력하세요 (예: SEO 도구)"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading || !keyword.trim()}>
              {loading ? "분석 중..." : "SERP 난이도 분석"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              구글 상위 10개 도메인의 권위 지표를 조회하고 있습니다... (최대 20초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="SERP 난이도 맵"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">난이도 점수</p>
                <p className="mt-1 text-3xl font-bold">{result.difficultyScore}</p>
                <span
                  className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${labelBadge(result.difficultyLabel)}`}
                >
                  {result.difficultyLabel}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">평균 Moz DA</p>
                <p className="mt-1 text-2xl font-bold">{result.avgDA}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">
                  평균 Ahrefs DR
                </p>
                <p className="mt-1 text-2xl font-bold">{result.avgDR}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">
                  평균 Majestic TF
                </p>
                <p className="mt-1 text-2xl font-bold">{result.avgTF}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">순위별 Moz DA</CardTitle>
              <CardDescription>
                상위 10개 도메인의 Moz Domain Authority 비교
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rank" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="DA" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                상위 10개 결과 ({result.rows.length}개)
              </CardTitle>
              <CardDescription>각 도메인의 권위 지표와 URL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">#</th>
                      <th className="pb-2 pr-3 font-medium">도메인</th>
                      <th className="pb-2 pr-3 font-medium">Title</th>
                      <th className="pb-2 pr-3 font-medium text-right">DA</th>
                      <th className="pb-2 pr-3 font-medium text-right">DR</th>
                      <th className="pb-2 font-medium text-right">TF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.rank} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-2.5 pr-3 tabular-nums">{r.rank}</td>
                        <td className="py-2.5 pr-3 font-medium">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {r.domain}
                          </a>
                        </td>
                        <td className="py-2.5 pr-3 max-w-sm truncate">{r.title}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums">
                          {r.mozDA ?? "-"}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums">
                          {r.ahrefsDR ?? "-"}
                        </td>
                        <td className="py-2.5 text-right tabular-nums">
                          {r.majesticTF ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <BacklinkCta variant="general" />
        </>
      )}
    </div>
  );
}
