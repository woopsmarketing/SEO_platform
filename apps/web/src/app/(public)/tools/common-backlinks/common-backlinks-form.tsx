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

interface CommonRefDomainRow {
  domain: string;
  sourceDA: number | null;
  pairs: Record<string, boolean>;
}

interface CommonBacklinksResult {
  inputs: string[];
  totalBacklinksPerDomain: Record<string, number>;
  commonRefDomains: CommonRefDomainRow[];
  generatedAt: string;
}

const MIN_DOMAINS = 2;
const MAX_DOMAINS = 5;

function csvEscape(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function downloadCsv(result: CommonBacklinksResult) {
  const header = ["domain", "sourceDA", ...result.inputs];
  const rows = result.commonRefDomains.map((row) => [
    row.domain,
    row.sourceDA == null ? "" : String(row.sourceDA),
    ...result.inputs.map((inp) => (row.pairs[inp] ? "Y" : "N")),
  ]);
  const csv =
    header.map(csvEscape).join(",") +
    "\n" +
    rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `common-backlinks-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function CommonBacklinksForm() {
  const [domains, setDomains] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [result, setResult] = useState<CommonBacklinksResult | null>(null);

  function updateDomain(idx: number, value: string) {
    setDomains((prev) => prev.map((d, i) => (i === idx ? value : d)));
  }

  function addDomain() {
    setDomains((prev) => (prev.length < MAX_DOMAINS ? [...prev, ""] : prev));
  }

  function removeDomain(idx: number) {
    setDomains((prev) =>
      prev.length > MIN_DOMAINS ? prev.filter((_, i) => i !== idx) : prev,
    );
  }

  async function handleAnalyze() {
    const filled = domains.map((d) => d.trim()).filter((d) => d.length > 0);
    if (filled.length < MIN_DOMAINS) {
      setError(`도메인을 ${MIN_DOMAINS}개 이상 입력해주세요.`);
      return;
    }
    if (filled.length > MAX_DOMAINS) {
      setError(`도메인은 최대 ${MAX_DOMAINS}개까지 입력 가능합니다.`);
      return;
    }
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("common-backlinks");
    try {
      const res = await fetch("/api/common-backlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: filled }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("common-backlinks", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("common-backlinks", data.error || "api_error");
      } else {
        trackToolUsage("common-backlinks");
        setResult(data as CommonBacklinksResult);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("common-backlinks", "network_error");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">분석할 도메인 ({MIN_DOMAINS}~{MAX_DOMAINS}개)</CardTitle>
          <CardDescription>
            경쟁사 도메인을 입력하고 공통 백링크 referring 도메인을 찾아보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {domains.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={d}
                onChange={(e) => updateDomain(i, e.target.value)}
                placeholder={`도메인 ${i + 1} (예: example.com)`}
                className="flex-1"
              />
              {domains.length > MIN_DOMAINS ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDomain(i)}
                  aria-label="도메인 삭제"
                >
                  삭제
                </Button>
              ) : null}
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {domains.length < MAX_DOMAINS ? (
              <Button variant="outline" size="sm" onClick={addDomain}>
                + 도메인 추가
              </Button>
            ) : null}
            <Button
              onClick={handleAnalyze}
              disabled={loading || domains.filter((d) => d.trim()).length < MIN_DOMAINS}
              className="ml-auto"
            >
              {loading ? "분석 중..." : "공통 백링크 분석"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              각 도메인의 백링크와 공통 referring 도메인 DA를 조회하고 있습니다... (최대 60초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="공통 백링크 분석"
          />
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          {/* 입력 도메인별 총 백링크 + 공통 수 요약 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">공통 referring 도메인</CardTitle>
                <CardDescription>
                  모든 입력 도메인에 링크를 건 공통 백링크 소스
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {result.commonRefDomains.length.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  상위 30개는 Moz DA 내림차순 정렬됩니다.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">입력 도메인별 백링크</CardTitle>
                <CardDescription>VebAPI 기준 도메인별 총 백링크 수</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {result.inputs.map((inp) => (
                  <div key={inp} className="flex justify-between">
                    <span className="font-medium truncate">{inp}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {(result.totalBacklinksPerDomain[inp] ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                공통 referring 도메인 상위 30개
              </CardTitle>
              <CardDescription>
                Moz DA 내림차순 — 각 도메인에 링크를 걸었는지 여부
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.commonRefDomains.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                          <th className="pb-2 pr-3 font-medium">#</th>
                          <th className="pb-2 pr-3 font-medium">도메인</th>
                          <th className="pb-2 pr-3 font-medium text-right">DA</th>
                          {result.inputs.map((inp) => (
                            <th key={inp} className="pb-2 pr-3 font-medium text-center">
                              {inp}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.commonRefDomains.slice(0, 30).map((row, i) => (
                          <tr
                            key={row.domain}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            <td className="py-2.5 pr-3 tabular-nums">{i + 1}</td>
                            <td className="py-2.5 pr-3 font-medium">
                              <a
                                href={`https://${row.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {row.domain}
                              </a>
                            </td>
                            <td className="py-2.5 pr-3 text-right tabular-nums">
                              {row.sourceDA ?? "-"}
                            </td>
                            {result.inputs.map((inp) => (
                              <td key={inp} className="py-2.5 pr-3 text-center">
                                {row.pairs[inp] ? (
                                  <span className="inline-block rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-semibold">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">–</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => downloadCsv(result)}>
                      CSV 다운로드
                    </Button>
                  </div>
                </>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  모든 입력 도메인에 공통으로 등장하는 referring 도메인이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
