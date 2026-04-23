"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCount } from "@/components/domain-metrics-card";
import {
  trackToolAttempt,
  trackToolError,
  trackToolUsage,
  trackRateLimit,
} from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { BacklinkCta } from "@/components/backlink-cta";

interface DiscoveryRow {
  domain: string;
  da: number | null;
  dr: number | null;
  tf: number | null;
  refDomains: number | null;
  traffic: number | null;
}

interface ApiResponse {
  seedKeyword: string;
  totalUniqueDomains: number;
  rows: DiscoveryRow[];
  error?: string;
  upgrade?: boolean;
}

function avg(values: Array<number | null>): number | null {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length === 0) return null;
  return Math.round(nums.reduce((s, v) => s + v, 0) / nums.length);
}

export function CompetitorDiscoveryForm() {
  const [seedKeyword, setSeedKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function analyze() {
    if (!seedKeyword.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    trackToolAttempt("competitor-discovery");

    try {
      const res = await fetch("/api/competitor-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedKeyword: seedKeyword.trim() }),
      });
      const data = (await res.json()) as ApiResponse;
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("competitor-discovery", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("competitor-discovery", data.error || "api_error");
      } else {
        setResult(data);
        trackToolUsage("competitor-discovery");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("competitor-discovery", "network_error");
    }
    setLoading(false);
  }

  const avgDa = result ? avg(result.rows.map((r) => r.da)) : null;
  const avgDr = result ? avg(result.rows.map((r) => r.dr)) : null;
  const avgTraffic = result ? avg(result.rows.map((r) => r.traffic)) : null;

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="시드 키워드 (예: SEO 툴)"
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              className="flex-1"
            />
            <Button onClick={analyze} disabled={loading || !seedKeyword.trim()}>
              {loading ? "분석 중..." : "경쟁 도메인 발굴"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              구글 SERP 상위 20개에서 고유 도메인을 추출하고 지표를 조회하고 있습니다...
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="경쟁 도메인 발굴"
          />
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <SummaryTile label="고유 도메인" value={result.totalUniqueDomains} />
            <SummaryTile label="평균 DA" value={avgDa} />
            <SummaryTile label="평균 DR" value={avgDr} />
            <SummaryTile label="평균 트래픽" value={avgTraffic} formatter={formatCount} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                &ldquo;{result.seedKeyword}&rdquo; 경쟁 도메인 리스트
              </CardTitle>
              <CardDescription>
                SERP 상위 organic에서 추출한 고유 도메인을 Moz DA 내림차순으로 정렬했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">#</th>
                      <th className="py-2 pr-3 font-medium">도메인</th>
                      <th className="py-2 pr-3 font-medium">Moz DA</th>
                      <th className="py-2 pr-3 font-medium">Ahrefs DR</th>
                      <th className="py-2 pr-3 font-medium">Majestic TF</th>
                      <th className="py-2 pr-3 font-medium">참조도메인</th>
                      <th className="py-2 pr-3 font-medium">트래픽</th>
                      <th className="py-2 pr-3 font-medium">심층 분석</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={row.domain} className="border-b last:border-0">
                        <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="py-2.5 pr-3 font-medium">
                          <a
                            href={`https://${row.domain}`}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="hover:underline"
                          >
                            {row.domain}
                          </a>
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {row.da != null ? Math.round(row.da) : "-"}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {row.dr != null ? Math.round(row.dr) : "-"}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {row.tf != null ? Math.round(row.tf) : "-"}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {formatCount(row.refDomains)}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {formatCount(row.traffic)}
                        </td>
                        <td className="py-2.5 pr-3">
                          <Link
                            href={`/tools/domain-authority?d=${encodeURIComponent(row.domain)}`}
                            className="text-primary hover:underline"
                          >
                            분석 →
                          </Link>
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

function SummaryTile({
  label,
  value,
  formatter,
}: {
  label: string;
  value: number | null;
  formatter?: (v: number | null) => string;
}) {
  const display =
    value == null
      ? "-"
      : formatter
        ? formatter(value)
        : value.toLocaleString("ko-KR");
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{display}</p>
    </div>
  );
}
