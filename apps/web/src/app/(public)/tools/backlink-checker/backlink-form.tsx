"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackToolUsage, trackToolAttempt, trackRateLimit, trackToolError } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import Link from "next/link";
import { RelatedTools } from "@/components/related-tools";
import { CompetitorAnalysisCTA } from "@/components/competitor-analysis-cta";
import { DomainMetricsCard } from "@/components/domain-metrics-card";
import type { DomainMetrics } from "@/lib/cache-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface BacklinkCounts {
  backlinks?: {
    total?: number;
    doFollow?: number;
    noFollow?: number;
    toHomePage?: number;
  };
  domains?: {
    total?: number;
    doFollow?: number;
    noFollow?: number;
  };
}

interface BacklinkItem {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  doFollow?: boolean;
  noFollow?: boolean;
  nofollow?: boolean;
  image?: boolean;
  domain_inlink_rank?: number;
  first_seen?: string;
  last_visited?: string;
  sourceDA?: number | null;
  qualityScore?: number | null;
}

interface BacklinkResult {
  domain: string;
  counts: BacklinkCounts;
  backlinks: BacklinkItem[];
  metrics?: DomainMetrics | null;
  avgQualityScore?: number | null;
  anchorDiversityRatio?: number | null;
}

interface GrowthPoint {
  date: string;
  count: number;
  cumulative: number;
}

const DAYS_RECENT_WINDOW = 30;
const DAYS_TREND_WINDOW = 90;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function extractDomain(url?: string): string {
  if (!url) return "-";
  try {
    return new URL(url).hostname;
  } catch {
    return url.length > 40 ? url.slice(0, 40) + "..." : url;
  }
}

function truncateUrl(url?: string, max = 50): string {
  if (!url) return "-";
  return url.length > max ? url.slice(0, max) + "..." : url;
}

function getRankColor(rank?: number): string {
  if (rank == null) return "bg-gray-100 text-gray-600";
  if (rank >= 70) return "bg-green-100 text-green-700";
  if (rank >= 40) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function getDAColor(da: number | null | undefined): string {
  if (da == null) return "bg-gray-100 text-gray-500";
  if (da >= 70) return "bg-emerald-100 text-emerald-700";
  if (da >= 50) return "bg-blue-100 text-blue-700";
  if (da >= 30) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

function qualityLabel(score: number | null | undefined): { label: string; color: string } {
  if (score == null) return { label: "-", color: "bg-gray-100 text-gray-500" };
  if (score >= 70) return { label: "우수", color: "bg-emerald-100 text-emerald-700" };
  if (score >= 45) return { label: "양호", color: "bg-blue-100 text-blue-700" };
  return { label: "주의", color: "bg-amber-100 text-amber-700" };
}

function daysAgo(dateStr?: string): number | null {
  if (!dateStr) return null;
  const t = Date.parse(dateStr);
  if (!Number.isFinite(t)) return null;
  const diffMs = Date.now() - t;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function buildGrowthSeries(backlinks: BacklinkItem[]): GrowthPoint[] {
  const byDay = new Map<string, number>();
  for (const bl of backlinks) {
    const ts = bl.first_seen ? Date.parse(bl.first_seen) : NaN;
    if (!Number.isFinite(ts)) continue;
    const d = new Date(ts);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  if (byDay.size === 0) return [];

  // 최근 90일 구간 채우기
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - (DAYS_TREND_WINDOW - 1));

  const points: GrowthPoint[] = [];
  let cumulative = 0;
  // 윈도우 시작 이전의 누적분을 기준선으로 더함
  for (const [k, v] of byDay.entries()) {
    const ts = Date.parse(k);
    if (Number.isFinite(ts) && ts < start.getTime()) cumulative += v;
  }

  for (let i = 0; i < DAYS_TREND_WINDOW; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    const count = byDay.get(key) ?? 0;
    cumulative += count;
    points.push({
      date: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`,
      count,
      cumulative,
    });
  }
  return points;
}

export function BacklinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);

  async function handleAnalyze() {
    if (!url) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);
    setRecentOnly(false);

    trackToolAttempt("backlink-checker");
    try {
      const res = await fetch("/api/backlink-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("backlink-checker", "guest");
        } else {
          trackToolError("backlink-checker", data.error || "api_error");
        }
      } else {
        trackToolUsage("backlink-checker");
        setResult(data as BacklinkResult);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("backlink-checker", "network_error");
    }
    setLoading(false);
  }

  const backlinks: BacklinkItem[] = result?.backlinks ?? [];

  // 최근 30일 신규 백링크 개수 (클라이언트 집계)
  const recentCount = useMemo(() => {
    return backlinks.filter((bl) => {
      const d = daysAgo(bl.first_seen);
      return d != null && d <= DAYS_RECENT_WINDOW;
    }).length;
  }, [backlinks]);

  // 필터링된 백링크 목록
  const visibleBacklinks = useMemo(() => {
    if (!recentOnly) return backlinks;
    return backlinks.filter((bl) => {
      const d = daysAgo(bl.first_seen);
      return d != null && d <= DAYS_RECENT_WINDOW;
    });
  }, [backlinks, recentOnly]);

  // 성장 추세 데이터
  const growthSeries = useMemo(() => buildGrowthSeries(backlinks), [backlinks]);
  const hasGrowthData = growthSeries.some((p) => p.count > 0);

  const apiCounts = result?.counts;
  const apiTotal = apiCounts?.backlinks?.total ?? 0;
  const apiDoFollow = apiCounts?.backlinks?.doFollow ?? 0;
  const totalBacklinks = apiTotal > 0 ? apiTotal : backlinks.length;
  const doFollowCount = apiDoFollow > 0
    ? apiDoFollow
    : backlinks.filter((bl) => bl.doFollow === true || bl.nofollow === false).length;
  const noFollowCount = Math.max(0, totalBacklinks - doFollowCount);
  const uniqueDomains = (apiCounts?.domains?.total ?? 0) > 0
    ? (apiCounts?.domains?.total ?? 0)
    : new Set(
        backlinks.map((bl) => {
          try {
            return bl.url_from ? new URL(bl.url_from).hostname : "";
          } catch {
            return bl.url_from ?? "";
          }
        }),
      ).size;
  const doFollowDomains = apiCounts?.domains?.doFollow ?? 0;
  const toHomePage = apiCounts?.backlinks?.toHomePage ?? 0;

  const avgQuality = result?.avgQualityScore ?? null;
  const diversity = result?.anchorDiversityRatio ?? null;

  return (
    <div className="space-y-8">
      {/* URL 입력 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading || !url}>
              {loading ? "분석 중..." : "백링크 분석"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal open={showUpgrade} onClose={() => setShowUpgrade(false)} toolName="백링크 분석" />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              백링크 데이터를 조회하고 있습니다... (최대 20초)
            </p>
          )}
        </CardContent>
      </Card>

      {result && (
        <CompetitorAnalysisCTA
          siteUrl={url.startsWith("http") ? url : `https://${url}`}
          toolName="backlink-checker"
        />
      )}

      <SignupBanner />
      {result && (
        <>
          {/* 도메인 권위 지표 (공용 캐시 — MISS 시 표시 생략) */}
          {result.metrics ? (
            <DomainMetricsCard domain={result.domain} metrics={result.metrics} compact />
          ) : null}

          {/* 통계 카드 4개 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="총 백링크"
              value={totalBacklinks}
              sub={`doFollow ${doFollowCount} / noFollow ${noFollowCount}`}
            />
            <StatCard
              label="doFollow 백링크"
              value={doFollowCount}
              sub={
                totalBacklinks > 0
                  ? `전체의 ${Math.round((doFollowCount / totalBacklinks) * 100)}%`
                  : undefined
              }
              highlight
            />
            <StatCard
              label="참조 도메인"
              value={uniqueDomains}
              sub={doFollowDomains > 0 ? `doFollow ${doFollowDomains}` : undefined}
            />
            <StatCard
              label="홈페이지 링크"
              value={toHomePage}
              sub="루트 도메인으로 향하는 백링크"
            />
          </div>

          {/* 품질 요약 카드 (평균 점수 + 앵커 다양성) */}
          {(avgQuality != null || diversity != null) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">백링크 품질 요약</CardTitle>
                <CardDescription>
                  소스 도메인 DA · doFollow 비율 · 앵커 텍스트 다양성을 종합한 점수입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-4 text-center">
                    <div className="text-xs text-muted-foreground">평균 품질 점수</div>
                    <div className="mt-1 text-3xl font-bold tabular-nums">
                      {avgQuality != null ? avgQuality : "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">0~100</div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 text-center">
                    <div className="text-xs text-muted-foreground">앵커 다양성</div>
                    <div className="mt-1 text-3xl font-bold tabular-nums">
                      {diversity != null ? `${Math.round(diversity * 100)}%` : "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      유니크 앵커 비율
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4 text-center">
                    <div className="text-xs text-muted-foreground">최근 30일 신규</div>
                    <div className="mt-1 text-3xl font-bold tabular-nums">{recentCount}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      신규 백링크 개수
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 백링크 성장 추세 (최근 90일) — recharts */}
          {hasGrowthData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">백링크 성장 추세</CardTitle>
                <CardDescription>
                  최근 {DAYS_TREND_WINDOW}일 간 누적 백링크 증가 추이 (first_seen 기준)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthSeries} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="bl-growth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        formatter={(value) => [
                          typeof value === "number" ? value.toLocaleString("ko-KR") : String(value),
                          "누적 백링크",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#bl-growth)"
                        name="누적 백링크"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 백링크 서비스 CTA — 연두색 배경 */}
          <div className="rounded-xl border border-green-200 bg-green-50/70 p-6">
            <h3 className="text-base font-bold text-green-900">백링크 전문 서비스</h3>
            <p className="text-sm text-green-700 mt-1 mb-4">분석 결과를 바탕으로 사이트의 백링크 품질을 개선하세요.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xl mb-1">🛡️</div>
                <h4 className="text-sm font-bold text-gray-900">스팸 백링크 제거</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  저품질·스팸 백링크를 식별하고 Google Disavow 처리까지 대행합니다.
                </p>
                <Link href="/services/backlinks" className="mt-2 block">
                  <Button size="sm" variant="outline" className="w-full text-xs border-green-300 text-green-800 hover:bg-green-100">스팸 제거 문의</Button>
                </Link>
              </div>
              <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xl mb-1">🔗</div>
                <h4 className="text-sm font-bold text-gray-900">고품질 백링크 구축</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  DA 높은 사이트에서 doFollow 백링크를 확보하여 검색 순위를 개선합니다.
                </p>
                <Link href="/services/backlinks" className="mt-2 block">
                  <Button size="sm" variant="outline" className="w-full text-xs border-green-300 text-green-800 hover:bg-green-100">백링크 구축 문의</Button>
                </Link>
              </div>
              <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xl mb-1">📊</div>
                <h4 className="text-sm font-bold text-gray-900">백링크 정밀 분석</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  경쟁사 대비 심층 분석과 링크 갭 분석으로 효과적인 전략을 수립합니다.
                </p>
                <Link href="/services/backlinks" className="mt-2 block">
                  <Button size="sm" variant="outline" className="w-full text-xs border-green-300 text-green-800 hover:bg-green-100">정밀 분석 문의</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 백링크 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                백링크 목록
              </CardTitle>
              <CardDescription>
                {result.domain}에 연결된 백링크 목록입니다. 상위 {Math.min(20, backlinks.length)}개의 소스 도메인에 대해 DA/품질 점수를 계산합니다.
              </CardDescription>
              {/* 필터 토글 */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setRecentOnly(false)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    !recentOnly
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  전체 ({backlinks.length.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => setRecentOnly(true)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    recentOnly
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  최근 30일 신규 ({recentCount.toLocaleString()})
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {visibleBacklinks.length > 0 ? (<>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">소스</th>
                        <th className="pb-2 pr-3 font-medium">소스 DA</th>
                        <th className="pb-2 pr-3 font-medium">타겟</th>
                        <th className="pb-2 pr-3 font-medium">앵커 텍스트</th>
                        <th className="pb-2 pr-3 font-medium">타입</th>
                        <th className="pb-2 pr-3 font-medium">품질</th>
                        <th className="pb-2 pr-3 font-medium">권위</th>
                        <th className="pb-2 pr-3 font-medium">최초 발견</th>
                        <th className="pb-2 font-medium">마지막 확인</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleBacklinks.map((bl, i) => {
                        const q = qualityLabel(bl.qualityScore);
                        return (
                          <tr
                            key={i}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            {/* 소스 URL */}
                            <td className="py-2.5 pr-3">
                              <a
                                href={bl.url_from}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                                title={bl.url_from}
                              >
                                {extractDomain(bl.url_from)}
                              </a>
                            </td>
                            {/* 소스 DA */}
                            <td className="py-2.5 pr-3">
                              <span
                                className={`rounded px-1.5 py-0.5 text-xs font-medium ${getDAColor(bl.sourceDA)}`}
                              >
                                {bl.sourceDA ?? "-"}
                              </span>
                            </td>
                            {/* 타겟 URL */}
                            <td
                              className="py-2.5 pr-3 text-muted-foreground"
                              title={bl.url_to}
                            >
                              {truncateUrl(bl.url_to, 30)}
                            </td>
                            {/* 앵커 텍스트 */}
                            <td className="py-2.5 pr-3 max-w-[200px] truncate">
                              {bl.image ? (
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  <span className="text-xs">🖼️</span>
                                  {bl.anchor || "(이미지 링크)"}
                                </span>
                              ) : (
                                bl.anchor || "-"
                              )}
                            </td>
                            {/* 타입 배지 */}
                            <td className="py-2.5 pr-3">
                              {bl.doFollow ? (
                                <span className="rounded px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                                  doFollow
                                </span>
                              ) : (
                                <span className="rounded px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                                  noFollow
                                </span>
                              )}
                            </td>
                            {/* 품질 점수 */}
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-1.5">
                                <span className="tabular-nums font-medium text-xs">
                                  {bl.qualityScore ?? "-"}
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${q.color}`}
                                >
                                  {q.label}
                                </span>
                              </div>
                            </td>
                            {/* 권위 점수 */}
                            <td className="py-2.5 pr-3">
                              <span
                                className={`rounded px-1.5 py-0.5 text-xs font-medium ${getRankColor(bl.domain_inlink_rank)}`}
                              >
                                {bl.domain_inlink_rank ?? "-"}
                              </span>
                            </td>
                            {/* 최초 발견 */}
                            <td className="py-2.5 pr-3 text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(bl.first_seen)}
                            </td>
                            {/* 마지막 확인 */}
                            <td className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(bl.last_visited)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* 목록 하단 — 더 자세한 분석 유도 */}
                <div className="pt-6 pb-2 text-center border-t mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    더 많고 자세한 백링크 데이터가 필요하신가요?
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    경쟁사 비교, 스팸 링크 필터링, 앵커 텍스트 분석, 링크 획득 추이 등 심층 분석 리포트를 제공합니다.
                  </p>
                  <Link href="/services/backlinks" className="mt-3 inline-block">
                    <Button className="px-8">
                      더 많고 자세한 백링크 보기
                    </Button>
                  </Link>
                </div>
              </>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {recentOnly
                    ? "최근 30일 내 신규 백링크가 없습니다."
                    : "이 도메인에 대한 백링크 데이터가 없습니다."}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
      <RelatedTools currentTool="backlink-checker" />
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
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={`mt-1 text-2xl font-bold ${highlight ? "text-green-700" : ""}`}
        >
          {value.toLocaleString()}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
