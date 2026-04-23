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

interface ContentGapResult {
  myUrl: string;
  competitorUrl: string;
  myTopics: string[];
  competitorTopics: string[];
  common: string[];
  onlyMine: string[];
  onlyCompetitor: string[];
  recommended: string[];
}

export function ContentGapForm() {
  const [myUrl, setMyUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentGapResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleAnalyze() {
    if (!myUrl.trim() || !competitorUrl.trim()) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("content-gap");
    try {
      const res = await fetch("/api/content-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myUrl: myUrl.trim(),
          competitorUrl: competitorUrl.trim(),
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("content-gap", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("content-gap", data.error || "api_error");
      } else {
        trackToolUsage("content-gap");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("content-gap", "network_error");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Input
            value={myUrl}
            onChange={(e) => setMyUrl(e.target.value)}
            placeholder="내 페이지 URL"
          />
          <div className="flex gap-3">
            <Input
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="경쟁사 페이지 URL"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !myUrl.trim() || !competitorUrl.trim()}
            >
              {loading ? "분석 중..." : "콘텐츠 갭 분석"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              두 페이지를 크롤링하고 AI로 토픽을 추출하고 있습니다... (최대 25초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="콘텐츠 갭 분석"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <TopicColumn
              title="내 페이지만 다룸"
              desc={`${result.myUrl}`}
              topics={result.onlyMine}
              color="green"
            />
            <TopicColumn
              title="공통 토픽"
              desc="두 페이지가 함께 다루는 주제"
              topics={result.common}
              color="gray"
            />
            <TopicColumn
              title="경쟁사만 다룸"
              desc="갭 — 추가 고려 대상"
              topics={result.onlyCompetitor}
              color="red"
            />
          </div>

          {result.recommended.length > 0 && (
            <Card className="bg-emerald-50/40 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base">추천 추가 토픽</CardTitle>
                <CardDescription>
                  경쟁사만 다루는 토픽 중에서 검색 수요와 전환 가능성이 가장 높은 3개 (AI 선정)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.recommended.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-emerald-200 bg-white p-4"
                    >
                      <p className="text-xs font-medium text-emerald-700 mb-1">
                        우선순위 {i + 1}
                      </p>
                      <p className="text-sm font-semibold text-emerald-900">{t}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <BacklinkCta variant="general" />
        </>
      )}
    </div>
  );
}

function TopicColumn({
  title,
  desc,
  topics,
  color,
}: {
  title: string;
  desc: string;
  topics: string[];
  color: "green" | "gray" | "red";
}) {
  const colorClass =
    color === "green"
      ? "bg-green-50 text-green-800 border-green-200"
      : color === "red"
        ? "bg-rose-50 text-rose-800 border-rose-200"
        : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="truncate">{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        {topics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <span
                key={i}
                className={`rounded-full border px-3 py-1.5 text-sm ${colorClass}`}
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">없음</p>
        )}
      </CardContent>
    </Card>
  );
}
