"use client";

import { useMemo, useState } from "react";
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

type KeywordType = "롱테일" | "질문형" | "미디엄";
type Filter = "전체" | "롱테일" | "질문형";

interface LongtailItem {
  keyword: string;
  wordCount: number;
  type: KeywordType;
  searchVolume?: number;
  avgDA?: number;
}

interface LongtailResult {
  seed: string;
  total: number;
  results: LongtailItem[];
}

function typeBadgeClass(t: KeywordType): string {
  if (t === "롱테일") return "bg-orange-100 text-orange-700";
  if (t === "질문형") return "bg-violet-100 text-violet-700";
  return "bg-gray-100 text-gray-600";
}

export function LongtailForm() {
  const [seed, setSeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LongtailResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [filter, setFilter] = useState<Filter>("전체");

  async function handleAnalyze() {
    if (!seed.trim()) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("longtail-keywords");
    try {
      const res = await fetch("/api/longtail-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: seed.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("longtail-keywords", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("longtail-keywords", data.error || "api_error");
      } else {
        trackToolUsage("longtail-keywords");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("longtail-keywords", "network_error");
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    if (!result) return [];
    if (filter === "전체") return result.results;
    return result.results.filter((r) => r.type === filter);
  }, [result, filter]);

  const counts = useMemo(() => {
    if (!result) return { longtail: 0, question: 0, medium: 0 };
    return {
      longtail: result.results.filter((r) => r.type === "롱테일").length,
      question: result.results.filter((r) => r.type === "질문형").length,
      medium: result.results.filter((r) => r.type === "미디엄").length,
    };
  }, [result]);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="시드 키워드를 입력하세요 (예: SEO, 백링크)"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading || !seed.trim()}>
              {loading ? "분석 중..." : "롱테일 키워드 발굴"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              관련 키워드 수집 및 상위 SERP 도메인 권위 분석 중... (최대 25초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="롱테일 키워드 발굴기"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard label="전체" value={result.total.toString()} />
            <StatCard label="롱테일" value={counts.longtail.toString()} highlight="orange" />
            <StatCard label="질문형" value={counts.question.toString()} highlight="violet" />
            <StatCard label="미디엄" value={counts.medium.toString()} />
          </div>

          <div className="flex gap-2">
            {(["전체", "롱테일", "질문형"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                관련 키워드 ({filtered.length}개)
              </CardTitle>
              <CardDescription>
                상위 10개는 SERP 도메인 권위(DA) 평균을 함께 제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filtered.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">키워드</th>
                        <th className="pb-2 pr-3 font-medium text-right">단어수</th>
                        <th className="pb-2 pr-3 font-medium">유형</th>
                        <th className="pb-2 pr-3 font-medium text-right">월간 검색량</th>
                        <th className="pb-2 font-medium text-right">평균 DA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-2.5 pr-3 font-medium">{r.keyword}</td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">
                            {r.wordCount}
                          </td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-medium ${typeBadgeClass(r.type)}`}
                            >
                              {r.type}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">
                            {r.searchVolume != null ? r.searchVolume.toLocaleString() : "-"}
                          </td>
                          <td className="py-2.5 text-right tabular-nums">
                            {r.avgDA != null ? r.avgDA : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  해당 필터에 키워드가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
          <BacklinkCta variant="general" />
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "orange" | "violet";
}) {
  const color =
    highlight === "orange"
      ? "text-orange-700"
      : highlight === "violet"
        ? "text-violet-700"
        : "";
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
