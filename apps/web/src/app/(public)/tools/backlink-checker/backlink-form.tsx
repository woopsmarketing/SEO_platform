"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackToolUsage } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  image?: boolean;
  domain_inlink_rank?: number;
  first_seen?: string;
  last_visited?: string;
}

interface BacklinkResult {
  domain: string;
  counts: BacklinkCounts;
  backlinks: BacklinkItem[];
}

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

export function BacklinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleAnalyze() {
    if (!url) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    try {
      const res = await fetch("/api/backlink-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) setShowUpgrade(true);
      } else {
        trackToolUsage("backlink-checker");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  const counts = result?.counts;
  const backlinks = result?.backlinks ?? [];

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
        <>
          {/* 통계 카드 4개 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="총 백링크"
              value={counts?.backlinks?.total ?? 0}
              sub={`doFollow ${counts?.backlinks?.doFollow ?? 0} / noFollow ${counts?.backlinks?.noFollow ?? 0}`}
            />
            <StatCard
              label="doFollow 백링크"
              value={counts?.backlinks?.doFollow ?? 0}
              sub={
                counts?.backlinks?.total
                  ? `전체의 ${Math.round(((counts.backlinks.doFollow ?? 0) / counts.backlinks.total) * 100)}%`
                  : undefined
              }
              highlight
            />
            <StatCard
              label="참조 도메인"
              value={counts?.domains?.total ?? 0}
              sub={`doFollow ${counts?.domains?.doFollow ?? 0} / noFollow ${counts?.domains?.noFollow ?? 0}`}
            />
            <StatCard
              label="홈페이지 링크"
              value={counts?.backlinks?.toHomePage ?? 0}
              sub="루트 도메인으로 향하는 백링크"
            />
          </div>

          {/* 백링크 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                백링크 목록 ({backlinks.length}개)
              </CardTitle>
              <CardDescription>
                {result.domain}에 연결된 백링크 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backlinks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">소스</th>
                        <th className="pb-2 pr-3 font-medium">타겟</th>
                        <th className="pb-2 pr-3 font-medium">앵커 텍스트</th>
                        <th className="pb-2 pr-3 font-medium">타입</th>
                        <th className="pb-2 pr-3 font-medium">권위</th>
                        <th className="pb-2 pr-3 font-medium">최초 발견</th>
                        <th className="pb-2 font-medium">마지막 확인</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backlinks.map((bl, i) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  이 도메인에 대한 백링크 데이터가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
          {/* 백링크 서비스 CTA */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">백링크 전문 서비스</h3>
            <p className="text-sm text-muted-foreground">분석 결과를 바탕으로 사이트의 백링크 품질을 개선하세요.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="text-sm font-bold text-gray-900">스팸 백링크 제거</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  저품질·스팸 백링크는 구글 패널티의 원인이 됩니다.
                  유해한 링크를 식별하고 Google Disavow 처리까지 대행합니다.
                </p>
                <Link href="/services/backlinks" className="mt-3 block">
                  <Button size="sm" className="w-full text-xs">스팸 제거 문의하기</Button>
                </Link>
              </div>
              <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🔗</div>
                <h4 className="text-sm font-bold text-gray-900">고품질 백링크 구축</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  DA 높은 사이트에서 doFollow 백링크를 확보합니다.
                  도메인 권한을 높여 구글 검색 순위를 직접적으로 개선하세요.
                </p>
                <Link href="/services/backlinks" className="mt-3 block">
                  <Button size="sm" className="w-full text-xs">백링크 구축 문의하기</Button>
                </Link>
              </div>
              <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="text-sm font-bold text-gray-900">백링크 정밀 분석</h4>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  경쟁사 대비 백링크 현황을 심층 분석하고,
                  링크 갭 분석을 통해 효과적인 백링크 전략을 수립해드립니다.
                </p>
                <Link href="/services/backlinks" className="mt-3 block">
                  <Button size="sm" className="w-full text-xs">정밀 분석 문의하기</Button>
                </Link>
              </div>
            </div>
          </div>
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
