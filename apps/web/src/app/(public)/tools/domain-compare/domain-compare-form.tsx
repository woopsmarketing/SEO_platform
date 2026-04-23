"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DomainMetricsCard, formatCount, toNumber } from "@/components/domain-metrics-card";
import type { DomainMetrics } from "@/lib/cache-api";
import { trackToolAttempt, trackToolUsage, trackToolError, trackRateLimit } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { RelatedTools } from "@/components/related-tools";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface SideResult {
  domain: string;
  metrics: DomainMetrics | null;
  pending: boolean;
}

interface ApiResponse {
  a?: SideResult;
  b?: SideResult;
  error?: string;
  upgrade?: boolean;
}

function formatDiff(a: number | null, b: number | null, greaterIsBetter = true): JSX.Element {
  if (a == null || b == null) return <span className="text-muted-foreground">-</span>;
  const diff = a - b;
  if (diff === 0) return <span className="text-muted-foreground">동일</span>;
  const color =
    (greaterIsBetter && diff > 0) || (!greaterIsBetter && diff < 0)
      ? "text-emerald-600"
      : "text-rose-600";
  const sign = diff > 0 ? "+" : "";
  return <span className={`font-semibold ${color}`}>{sign}{Math.round(diff).toLocaleString("ko-KR")}</span>;
}

function scale(v: number | null, max: number): number {
  if (v == null) return 0;
  const clamped = Math.min(Math.max(v, 0), max);
  return Math.round((clamped / max) * 100);
}

export function DomainCompareForm() {
  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function analyze() {
    if (!domainA || !domainB) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    trackToolAttempt("domain-compare");

    try {
      const res = await fetch("/api/domain-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainA, domainB }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("domain-compare", "guest");
        } else {
          trackToolError("domain-compare", data.error || "api_error");
        }
      } else {
        setResult(data);
        if (data.a?.metrics || data.b?.metrics) trackToolUsage("domain-compare");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("domain-compare", "network_error");
    }
    setLoading(false);
  }

  const a = result?.a ?? null;
  const b = result?.b ?? null;
  const mA = a?.metrics ?? null;
  const mB = b?.metrics ?? null;

  // Radar 차트 데이터 — 각 축을 0~100 스케일로 정규화
  const radarData =
    mA || mB
      ? [
          {
            metric: "Moz DA",
            [a?.domain || "A"]: scale(toNumber(mA?.mozDA), 100),
            [b?.domain || "B"]: scale(toNumber(mB?.mozDA), 100),
          },
          {
            metric: "Ahrefs DR",
            [a?.domain || "A"]: scale(toNumber(mA?.ahrefsDR), 100),
            [b?.domain || "B"]: scale(toNumber(mB?.ahrefsDR), 100),
          },
          {
            metric: "Majestic TF",
            [a?.domain || "A"]: scale(toNumber(mA?.majesticTF), 100),
            [b?.domain || "B"]: scale(toNumber(mB?.majesticTF), 100),
          },
          {
            metric: "참조도메인",
            [a?.domain || "A"]: scale(toNumber(mA?.ahrefsRefDomains), 100000),
            [b?.domain || "B"]: scale(toNumber(mB?.ahrefsRefDomains), 100000),
          },
          {
            metric: "트래픽",
            [a?.domain || "A"]: scale(toNumber(mA?.ahrefsTraffic), 10_000_000),
            [b?.domain || "B"]: scale(toNumber(mB?.ahrefsTraffic), 10_000_000),
          },
        ]
      : [];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={domainA}
              onChange={(e) => setDomainA(e.target.value)}
              placeholder="도메인 A (예: naver.com)"
            />
            <Input
              value={domainB}
              onChange={(e) => setDomainB(e.target.value)}
              placeholder="도메인 B (예: daum.net)"
              onKeyDown={(e) => e.key === "Enter" && analyze()}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={analyze} disabled={loading || !domainA || !domainB}>
              {loading ? "분석 중..." : "두 도메인 비교"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="도메인 비교"
              />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">두 도메인의 권위 지표를 조회하고 있습니다...</p>
          )}
        </CardContent>
      </Card>

      {a && b ? (
        <>
          {/* 두 개 Metrics 카드 나란히 */}
          <div className="grid gap-4 md:grid-cols-2">
            {mA ? (
              <DomainMetricsCard domain={a.domain} metrics={mA} />
            ) : (
              <PendingCard domain={a.domain} />
            )}
            {mB ? (
              <DomainMetricsCard domain={b.domain} metrics={mB} />
            ) : (
              <PendingCard domain={b.domain} />
            )}
          </div>

          {/* Radar 비교 차트 */}
          {(mA || mB) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">5축 권위 비교</CardTitle>
                <CardDescription>
                  DA · DR · TF · 참조도메인 · 트래픽을 0~100 스케일로 정규화하여 비교합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={a.domain}
                        dataKey={a.domain}
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name={b.domain}
                        dataKey={b.domain}
                        stroke="#dc2626"
                        fill="#dc2626"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 비교표 */}
          {(mA || mB) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">상세 비교표</CardTitle>
                <CardDescription>차이는 A − B 기준. 초록 = A 우세.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">지표</th>
                        <th className="py-2 pr-3 font-medium">{a.domain}</th>
                        <th className="py-2 pr-3 font-medium">{b.domain}</th>
                        <th className="py-2 font-medium">차이 (A − B)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Row
                        label="Moz DA"
                        aVal={toNumber(mA?.mozDA)}
                        bVal={toNumber(mB?.mozDA)}
                      />
                      <Row
                        label="Ahrefs DR"
                        aVal={toNumber(mA?.ahrefsDR)}
                        bVal={toNumber(mB?.ahrefsDR)}
                      />
                      <Row
                        label="Majestic TF"
                        aVal={toNumber(mA?.majesticTF)}
                        bVal={toNumber(mB?.majesticTF)}
                      />
                      <Row
                        label="참조 도메인"
                        aVal={toNumber(mA?.ahrefsRefDomains)}
                        bVal={toNumber(mB?.ahrefsRefDomains)}
                        formatter={formatCount}
                      />
                      <Row
                        label="예상 월간 트래픽"
                        aVal={toNumber(mA?.ahrefsTraffic)}
                        bVal={toNumber(mB?.ahrefsTraffic)}
                        formatter={formatCount}
                      />
                      <Row
                        label="유기 키워드"
                        aVal={toNumber(mA?.ahrefsOrganicKeywords)}
                        bVal={toNumber(mB?.ahrefsOrganicKeywords)}
                        formatter={formatCount}
                      />
                      <Row
                        label="총 백링크"
                        aVal={toNumber(mA?.ahrefsBacklinks)}
                        bVal={toNumber(mB?.ahrefsBacklinks)}
                        formatter={formatCount}
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}

      <RelatedTools currentTool="domain-compare" />
    </div>
  );
}

function Row({
  label,
  aVal,
  bVal,
  formatter,
}: {
  label: string;
  aVal: number | null;
  bVal: number | null;
  formatter?: (v: number | null) => string;
}) {
  const fmt = (v: number | null) =>
    v == null ? "-" : formatter ? formatter(v) : Math.round(v).toLocaleString("ko-KR");
  return (
    <tr className="border-b last:border-0">
      <td className="py-2.5 pr-3 font-medium">{label}</td>
      <td className="py-2.5 pr-3 tabular-nums">{fmt(aVal)}</td>
      <td className="py-2.5 pr-3 tabular-nums">{fmt(bVal)}</td>
      <td className="py-2.5 tabular-nums">{formatDiff(aVal, bVal)}</td>
    </tr>
  );
}

function PendingCard({ domain }: { domain: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium">{domain}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          도메인 지표가 아직 수집되지 않았습니다. 잠시 후 다시 시도해주세요.
        </p>
      </CardContent>
    </Card>
  );
}
