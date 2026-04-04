"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackToolUsage } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { BacklinkCta } from "@/components/backlink-cta";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface KeywordItem {
  text: string;
  vol: number;
  cpc: string;
  competition: string;
  score?: number;
}

interface KeywordResult {
  keyword: string;
  country: string;
  results: KeywordItem[];
}

const COUNTRIES = [
  { code: "kr", label: "한국" },
  { code: "us", label: "미국" },
  { code: "jp", label: "일본" },
  { code: "gb", label: "영국" },
  { code: "de", label: "독일" },
  { code: "fr", label: "프랑스" },
  { code: "ca", label: "캐나다" },
  { code: "au", label: "호주" },
  { code: "br", label: "브라질" },
  { code: "in", label: "인도" },
];

type SortKey = "text" | "vol" | "cpc" | "competition" | "score";
type SortDir = "asc" | "desc";

function getCompetitionOrder(c: string): number {
  if (c === "Low") return 0;
  if (c === "Medium") return 1;
  if (c === "High") return 2;
  return 3;
}

function getCompetitionBadge(c: string): string {
  if (c === "Low") return "bg-green-100 text-green-700";
  if (c === "Medium") return "bg-yellow-100 text-yellow-700";
  if (c === "High") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

export function KeywordForm() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("kr");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KeywordResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("vol");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  async function handleAnalyze() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    try {
      const res = await fetch("/api/keyword-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim(), country }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) setShowUpgrade(true);
      } else {
        trackToolUsage("keyword-research");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "text" ? "asc" : "desc");
    }
  }

  const sortedResults = useMemo(() => {
    if (!result?.results) return [];
    const items = [...result.results];
    items.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "text":
          cmp = a.text.localeCompare(b.text, "ko");
          break;
        case "vol":
          cmp = (a.vol || 0) - (b.vol || 0);
          break;
        case "cpc":
          cmp = parseFloat(a.cpc || "0") - parseFloat(b.cpc || "0");
          break;
        case "competition":
          cmp =
            getCompetitionOrder(a.competition) -
            getCompetitionOrder(b.competition);
          break;
        case "score":
          cmp = (a.score || 0) - (b.score || 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return items;
  }, [result?.results, sortKey, sortDir]);

  const totalKeywords = result?.results?.length ?? 0;
  const avgVol =
    totalKeywords > 0
      ? Math.round(
          result!.results.reduce((sum, k) => sum + (k.vol || 0), 0) /
            totalKeywords
        )
      : 0;
  const avgCpc =
    totalKeywords > 0
      ? (
          result!.results.reduce(
            (sum, k) => sum + parseFloat(k.cpc || "0"),
            0
          ) / totalKeywords
        ).toFixed(2)
      : "0.00";

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="space-y-8">
      {/* 입력 폼 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 입력하세요 (예: SEO, 다이어트)"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <Button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
            >
              {loading ? "분석 중..." : "키워드 분석"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal open={showUpgrade} onClose={() => setShowUpgrade(false)} toolName="키워드 분석" />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              키워드 데이터를 조회하고 있습니다... (최대 20초)
            </p>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* 통계 카드 3개 */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="총 관련 키워드"
              value={totalKeywords.toLocaleString()}
              sub="검색된 관련 키워드 수"
            />
            <StatCard
              label="평균 검색량"
              value={avgVol.toLocaleString()}
              sub="월간 평균 검색량"
              highlight
            />
            <StatCard
              label="평균 CPC"
              value={`$${avgCpc}`}
              sub="평균 클릭당 비용"
            />
          </div>

          {/* 키워드 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                관련 키워드 목록 ({totalKeywords}개)
              </CardTitle>
              <CardDescription>
                &ldquo;{result.keyword}&rdquo;에 대한 관련 키워드 분석
                결과입니다. 헤더를 클릭하면 정렬할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th
                          className="pb-2 pr-3 font-medium cursor-pointer hover:text-foreground select-none"
                          onClick={() => handleSort("text")}
                        >
                          키워드{sortArrow("text")}
                        </th>
                        <th
                          className="pb-2 pr-3 font-medium cursor-pointer hover:text-foreground select-none text-right"
                          onClick={() => handleSort("vol")}
                        >
                          월간 검색량{sortArrow("vol")}
                        </th>
                        <th
                          className="pb-2 pr-3 font-medium cursor-pointer hover:text-foreground select-none text-right"
                          onClick={() => handleSort("cpc")}
                        >
                          CPC{sortArrow("cpc")}
                        </th>
                        <th
                          className="pb-2 pr-3 font-medium cursor-pointer hover:text-foreground select-none"
                          onClick={() => handleSort("competition")}
                        >
                          경쟁도{sortArrow("competition")}
                        </th>
                        <th
                          className="pb-2 font-medium cursor-pointer hover:text-foreground select-none text-right"
                          onClick={() => handleSort("score")}
                        >
                          점수{sortArrow("score")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((kw, i) => (
                        <tr
                          key={i}
                          className="border-b last:border-0 hover:bg-muted/50"
                        >
                          <td className="py-2.5 pr-3 font-medium">
                            {kw.text}
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">
                            {(kw.vol || 0).toLocaleString()}
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">
                            ${kw.cpc || "0.00"}
                          </td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-medium ${getCompetitionBadge(kw.competition)}`}
                            >
                              {kw.competition || "-"}
                            </span>
                          </td>
                          <td className="py-2.5 text-right tabular-nums">
                            {kw.score ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  이 키워드에 대한 관련 키워드 데이터가 없습니다.
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
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={`mt-1 text-2xl font-bold ${highlight ? "text-amber-700" : ""}`}
        >
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
