"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { BacklinkCta } from "@/components/backlink-cta";

interface KeywordGapRow {
  keyword: string;
  vol: number | null;
  competitorRank: number | null;
  myRank: number | null;
}

interface ApiResponse {
  myDomain: string;
  competitorDomain: string;
  counts: {
    total: number;
    onlyCompetitor: number;
    both: number;
    onlyMine: number;
    neither: number;
  };
  onlyCompetitor: KeywordGapRow[];
  both: KeywordGapRow[];
  onlyMine: KeywordGapRow[];
  neither: KeywordGapRow[];
  error?: string;
  upgrade?: boolean;
}

type TabKey = "onlyCompetitor" | "both" | "onlyMine";

const TAB_META: Record<TabKey, { label: string; desc: string }> = {
  onlyCompetitor: {
    label: "경쟁사만",
    desc: "경쟁사만 상위 노출된 키워드 — 내 공략 타깃",
  },
  both: {
    label: "공통 노출",
    desc: "두 도메인 모두 SERP에 포함된 키워드",
  },
  onlyMine: {
    label: "나만",
    desc: "나만 노출된 키워드 — 기존 상위 자산",
  },
};

function toCsv(rows: KeywordGapRow[]): string {
  const header = "keyword,vol,competitorRank,myRank";
  const lines = rows.map((r) => {
    const kw = `"${r.keyword.replace(/"/g, '""')}"`;
    const vol = r.vol != null ? String(r.vol) : "";
    const comp = r.competitorRank != null ? String(r.competitorRank) : "";
    const mine = r.myRank != null ? String(r.myRank) : "";
    return `${kw},${vol},${comp},${mine}`;
  });
  return [header, ...lines].join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function KeywordGapForm() {
  const [myDomain, setMyDomain] = useState("");
  const [competitorDomain, setCompetitorDomain] = useState("");
  const [seedInput, setSeedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [tab, setTab] = useState<TabKey>("onlyCompetitor");

  async function analyze() {
    if (!myDomain.trim() || !competitorDomain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    trackToolAttempt("keyword-gap");

    const seeds = seedInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch("/api/keyword-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          myDomain: myDomain.trim(),
          competitorDomain: competitorDomain.trim(),
          seedKeywords: seeds.length > 0 ? seeds : undefined,
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("keyword-gap", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("keyword-gap", data.error || "api_error");
      } else {
        setResult(data);
        trackToolUsage("keyword-gap");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("keyword-gap", "network_error");
    }
    setLoading(false);
  }

  const activeRows: KeywordGapRow[] = result ? result[tab] : [];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-3">
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
            />
          </div>
          <Textarea
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder="시드 키워드 (선택) — 콤마/줄바꿈 구분. 비워두면 경쟁사 도메인에서 자동 추출"
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={analyze}
              disabled={loading || !myDomain.trim() || !competitorDomain.trim()}
            >
              {loading ? "분석 중..." : "키워드 갭 분석"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="text-sm text-muted-foreground">
              키워드 30개의 SERP를 병렬로 조회하고 있습니다... (최대 40초)
            </p>
          )}
          <SignupModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            toolName="키워드 갭 분석"
          />
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <CountTile
              label="경쟁사만"
              value={result.counts.onlyCompetitor}
              tone="rose"
            />
            <CountTile
              label="공통"
              value={result.counts.both}
              tone="slate"
            />
            <CountTile
              label="나만"
              value={result.counts.onlyMine}
              tone="emerald"
            />
            <CountTile
              label="둘 다 없음"
              value={result.counts.neither}
              tone="muted"
            />
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">{TAB_META[tab].label}</CardTitle>
                <CardDescription>{TAB_META[tab].desc}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TAB_META) as TabKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      tab === k
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {TAB_META[k].label} ({result[k].length})
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeRows.length === 0}
                  onClick={() =>
                    downloadCsv(
                      `keyword-gap-${tab}-${result.myDomain}-vs-${result.competitorDomain}.csv`,
                      toCsv(activeRows),
                    )
                  }
                >
                  CSV 다운로드
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">해당 그룹에 키워드가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">키워드</th>
                        <th className="py-2 pr-3 font-medium">월 검색량</th>
                        <th className="py-2 pr-3 font-medium">경쟁사 순위</th>
                        <th className="py-2 pr-3 font-medium">내 순위</th>
                        <th className="py-2 pr-3 font-medium">차이</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRows.map((row) => {
                        const diff =
                          row.myRank != null && row.competitorRank != null
                            ? row.competitorRank - row.myRank
                            : null;
                        return (
                          <tr key={row.keyword} className="border-b last:border-0">
                            <td className="py-2.5 pr-3 font-medium">{row.keyword}</td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {row.vol != null ? row.vol.toLocaleString("ko-KR") : "-"}
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {row.competitorRank != null ? `#${row.competitorRank}` : "-"}
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {row.myRank != null ? `#${row.myRank}` : "-"}
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {diff == null ? (
                                "-"
                              ) : diff > 0 ? (
                                <span className="text-emerald-600 font-semibold">
                                  +{diff}
                                </span>
                              ) : diff < 0 ? (
                                <span className="text-rose-600 font-semibold">{diff}</span>
                              ) : (
                                <span className="text-muted-foreground">동일</span>
                              )}
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

          <BacklinkCta variant="general" />
        </>
      )}
    </div>
  );
}

function CountTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "slate" | "rose" | "muted";
}) {
  const colors = {
    emerald: "bg-emerald-50/60 border-emerald-200",
    slate: "bg-slate-50 border-slate-200",
    rose: "bg-rose-50/60 border-rose-200",
    muted: "bg-muted/40 border-border",
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${colors}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">
        {value.toLocaleString("ko-KR")}
      </p>
    </div>
  );
}
