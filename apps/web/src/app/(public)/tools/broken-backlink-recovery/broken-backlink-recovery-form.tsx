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
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import {
  trackToolAttempt,
  trackToolError,
  trackToolUsage,
  trackRateLimit,
} from "@/lib/gtag";

interface BrokenLink {
  sourceUrl: string;
  targetUrl: string;
  statusCode: number;
}

interface BrokenResponse {
  domain: string;
  total: number;
  broken: BrokenLink[];
  saved: boolean;
  elapsed: number;
}

export function BrokenBacklinkRecoveryForm() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrokenResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleCheck() {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);

    trackToolAttempt("broken-backlink-recovery");
    try {
      const res = await fetch("/api/broken-backlink-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        setError(data.error || "일일 무료 사용량을 초과했습니다.");
        trackRateLimit("broken-backlink-recovery", "guest");
      } else if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("broken-backlink-recovery", data.error || "api_error");
      } else {
        setResult(data as BrokenResponse);
        trackToolUsage("broken-backlink-recovery");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("broken-backlink-recovery", "network_error");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="내 도메인 (예: seoworld.co.kr)"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={loading || !domain.trim()}>
              {loading ? "확인 중..." : "깨진 링크 찾기"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="깨진 백링크 복구"
              />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              상위 50개 백링크 타겟의 상태 코드를 확인하는 중입니다... (최대 30초)
            </p>
          )}
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">검사한 타겟</p>
                <p className="mt-1 text-2xl font-bold">{result.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">깨진 링크</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {result.broken.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs font-medium text-muted-foreground">소요 시간</p>
                <p className="mt-1 text-2xl font-bold">
                  {(result.elapsed / 1000).toFixed(1)}s
                </p>
                {result.saved && (
                  <span className="mt-2 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    복구 이력 저장됨
                  </span>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">복구 전략</CardTitle>
              <CardDescription>
                깨진 백링크는 아래 3가지 중 하나로 복구하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-blue-50/50 p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    1. 301 리다이렉트
                  </p>
                  <p className="mt-1 text-xs text-blue-800/80 leading-relaxed">
                    비슷한 주제의 기존 URL로 영구 이동. 링크 주스의 90% 이상을
                    보존합니다. Next.js의 경우 <code>next.config.mjs</code>의{" "}
                    <code>redirects()</code>에 추가.
                  </p>
                </div>
                <div className="rounded-lg border bg-amber-50/50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    2. 콘텐츠 복원
                  </p>
                  <p className="mt-1 text-xs text-amber-800/80 leading-relaxed">
                    원본이 삭제된 경우, 같은 URL에 콘텐츠를 다시 퍼블리시.
                    DB/백업에 원문이 있다면 가장 정확한 복구 방법입니다.
                  </p>
                </div>
                <div className="rounded-lg border bg-green-50/50 p-4">
                  <p className="text-sm font-semibold text-green-900">
                    3. 소유자 연락
                  </p>
                  <p className="mt-1 text-xs text-green-800/80 leading-relaxed">
                    소스 사이트 운영자에게 새 URL로 업데이트 요청. 응답률은
                    낮지만 성공 시 가장 깔끔한 방법입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                깨진 백링크 {result.broken.length}개
              </CardTitle>
              <CardDescription>
                {result.domain} — 소스 URL에서 타겟 URL이 404/410 응답을 반환합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.broken.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium">소스 URL (링크 원천)</th>
                        <th className="pb-2 pr-3 font-medium">깨진 타겟 URL</th>
                        <th className="pb-2 pr-3 font-medium w-20 text-right">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.broken.map((bl, i) => (
                        <tr
                          key={`${bl.sourceUrl}-${bl.targetUrl}-${i}`}
                          className="border-b last:border-0 hover:bg-muted/50"
                        >
                          <td className="py-2.5 pr-3 min-w-0">
                            <a
                              href={bl.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline text-xs break-all"
                            >
                              {bl.sourceUrl}
                            </a>
                          </td>
                          <td className="py-2.5 pr-3 min-w-0">
                            <span className="text-xs text-muted-foreground break-all">
                              {bl.targetUrl}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-right">
                            <span className="inline-block rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                              {bl.statusCode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  검사한 {result.total}개 백링크 중 깨진 링크가 발견되지 않았습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
