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
  trackToolUsage,
  trackToolError,
  trackRateLimit,
} from "@/lib/gtag";

interface SerpRow {
  position: number;
  title: string;
  url: string;
  domain: string;
}

interface SerpResponse {
  keyword: string;
  domain: string | null;
  fromCache: boolean;
  results: SerpRow[];
  myRank: number | null;
  myHit: SerpRow | null;
}

export function SerpCheckerForm() {
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SerpResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleCheck() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);

    trackToolAttempt("serp-checker");
    try {
      const res = await fetch("/api/serp-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          domain: domain.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("serp-checker", "guest");
        } else {
          trackToolError("serp-checker", data.error || "api_error");
        }
      } else {
        setResult(data as SerpResponse);
        trackToolUsage("serp-checker");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("serp-checker", "network_error");
    }
    setLoading(false);
  }

  const myRankLabel = (() => {
    if (!result || !result.domain) return null;
    if (result.myRank == null) return "상위 100위 밖 (조회 범위에 없음)";
    return `${result.myRank}위`;
  })();

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 (예: SEO 도구)"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="내 도메인 (선택, 예: seoworld.co.kr)"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <Button onClick={handleCheck} disabled={loading || !keyword.trim()}>
              {loading ? "조회 중..." : "순위 확인"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="SERP 체커"
              />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              구글 검색 상위 결과를 가져오고 있습니다...
            </p>
          )}
        </CardContent>
      </Card>

      <SignupBanner />

      {result && (
        <>
          {result.domain && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-5 pb-5">
                <p className="text-xs font-medium text-amber-900">
                  내 도메인 <span className="font-mono">{result.domain}</span>
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-800">
                  {myRankLabel}
                </p>
                {result.myHit && (
                  <p className="mt-1 text-xs text-amber-800/80 truncate">
                    {result.myHit.title}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                &ldquo;{result.keyword}&rdquo; 구글 검색 상위 {result.results.length}개
              </CardTitle>
              <CardDescription>
                Google.com (gl=kr, hl=ko) 기준 유기 검색 결과입니다.
                {result.fromCache ? " (캐시됨)" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3 font-medium w-12">순위</th>
                        <th className="pb-2 pr-3 font-medium">제목 / URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((row) => {
                        const isMine =
                          result.domain &&
                          (row.domain === result.domain ||
                            row.domain.endsWith("." + result.domain));
                        return (
                          <tr
                            key={`${row.position}-${row.url}`}
                            className={`border-b last:border-0 ${
                              isMine ? "bg-amber-50" : "hover:bg-muted/50"
                            }`}
                          >
                            <td className="py-2.5 pr-3 font-semibold tabular-nums">
                              {row.position}
                            </td>
                            <td className="py-2.5 pr-3 min-w-0">
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-700 hover:underline"
                              >
                                {row.title}
                              </a>
                              <p className="text-xs text-muted-foreground truncate">
                                {row.url}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  검색 결과가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
