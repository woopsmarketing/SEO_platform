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
import { Badge } from "@/components/ui/badge";
import type { DomainMetrics } from "@/lib/cache-api";
import { toNumber } from "@/components/domain-metrics-card";
import {
  trackToolAttempt,
  trackToolError,
  trackToolUsage,
  trackRateLimit,
} from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { BacklinkCta } from "@/components/backlink-cta";

interface GapRow {
  domain: string;
  metrics: DomainMetrics | null;
}

interface ApiResponse {
  myDomain: string;
  competitorDomain: string;
  counts: {
    myTotal: number;
    competitorTotal: number;
    onlyMine: number;
    common: number;
    onlyCompetitor: number;
  };
  onlyCompetitor: GapRow[];
  common: string[];
  onlyMine: string[];
  error?: string;
  upgrade?: boolean;
}

function trustBadge(tf: number | null): {
  label: string;
  className: string;
} {
  if (tf == null)
    return { label: "-", className: "bg-slate-100 text-slate-600" };
  if (tf >= 40) return { label: "고신뢰", className: "bg-emerald-100 text-emerald-700" };
  if (tf >= 20) return { label: "중간", className: "bg-amber-100 text-amber-700" };
  return { label: "낮음", className: "bg-rose-100 text-rose-700" };
}

export function BacklinkGapForm() {
  const [myDomain, setMyDomain] = useState("");
  const [competitorDomain, setCompetitorDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function analyze() {
    if (!myDomain.trim() || !competitorDomain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    trackToolAttempt("backlink-gap");

    try {
      const res = await fetch("/api/backlink-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myDomain: myDomain.trim(),
          competitorDomain: competitorDomain.trim(),
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("backlink-gap", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("backlink-gap", data.error || "api_error");
      } else {
        setResult(data);
        trackToolUsage("backlink-gap");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("backlink-gap", "network_error");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={myDomain}
              onChange={(e) => setMyDomain(e.target.value)}
              placeholder="내 도메인 (예: mysite.com)"
            />
            <Input
              value={competitorDomain}
              onChange={(e) => setCompetitorDomain(e.target.value)}
              placeholder="경쟁사 도메인 (예: competitor.com)"
              onKeyDown={(e) => e.key === "Enter" && analyze()}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              onClick={analyze}
              disabled={loading || !myDomain.trim() || !competitorDomain.trim()}
            >
              {loading ? "분석 중..." : "백링크 갭 분석"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              두 도메인의 백링크를 병렬로 조회하고 소스 도메인을 비교하고 있습니다...
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="백링크 갭 분석"
          />
        </CardContent>
      </Card>

      {result && (
        <>
          {/* 요약 카드 */}
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="내 도메인만"
              count={result.counts.onlyMine}
              desc={`${result.myDomain}가 가진 고유 백링크 소스`}
              tone="emerald"
            />
            <SummaryCard
              title="공통"
              count={result.counts.common}
              desc="두 도메인이 모두 가진 소스"
              tone="slate"
            />
            <SummaryCard
              title="경쟁사만"
              count={result.counts.onlyCompetitor}
              desc="내가 확보해야 할 갭 소스"
              tone="rose"
            />
          </div>

          {/* 경쟁사만 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                경쟁사만 가진 백링크 소스 (상위 {result.onlyCompetitor.length}개)
              </CardTitle>
              <CardDescription>
                Moz DA 순으로 정렬된 타깃 리스트. 가장 위에 있는 소스부터 확보
                전략을 세우는 것을 권장합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.onlyCompetitor.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  경쟁사만 가진 백링크 소스가 없습니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">#</th>
                        <th className="py-2 pr-3 font-medium">소스 도메인</th>
                        <th className="py-2 pr-3 font-medium">Moz DA</th>
                        <th className="py-2 pr-3 font-medium">Ahrefs DR</th>
                        <th className="py-2 pr-3 font-medium">Trust</th>
                        <th className="py-2 pr-3 font-medium">방문</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.onlyCompetitor.map((row, i) => {
                        const da = toNumber(row.metrics?.mozDA);
                        const dr = toNumber(row.metrics?.ahrefsDR);
                        const tf = toNumber(row.metrics?.majesticTF);
                        const tb = trustBadge(tf);
                        return (
                          <tr key={row.domain} className="border-b last:border-0">
                            <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                              {i + 1}
                            </td>
                            <td className="py-2.5 pr-3 font-medium">
                              {row.domain}
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {da != null ? Math.round(da) : "-"}
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {dr != null ? Math.round(dr) : "-"}
                            </td>
                            <td className="py-2.5 pr-3">
                              <Badge className={tb.className}>{tb.label}</Badge>
                            </td>
                            <td className="py-2.5 pr-3">
                              <a
                                href={`https://${row.domain}`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                열기 ↗
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <BacklinkCta variant="backlink" />
        </>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  count,
  desc,
  tone,
}: {
  title: string;
  count: number;
  desc: string;
  tone: "emerald" | "slate" | "rose";
}) {
  const colors = {
    emerald: "bg-emerald-50/60 border-emerald-200 text-emerald-900",
    slate: "bg-slate-50 border-slate-200 text-slate-800",
    rose: "bg-rose-50/60 border-rose-200 text-rose-900",
  }[tone];
  return (
    <div className={`rounded-lg border p-5 ${colors}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums">
        {count.toLocaleString("ko-KR")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
