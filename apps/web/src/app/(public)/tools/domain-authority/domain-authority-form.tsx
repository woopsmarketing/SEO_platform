"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DomainMetricsCard } from "@/components/domain-metrics-card";
import type { DomainMetrics } from "@/lib/cache-api";
import { trackToolAttempt, trackToolUsage, trackToolError, trackRateLimit } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { RelatedTools } from "@/components/related-tools";

interface ApiResponse {
  domain?: string;
  metrics?: DomainMetrics | null;
  pending?: boolean;
  message?: string;
  error?: string;
  upgrade?: boolean;
}

const EXAMPLES = ["naver.com", "daum.net", "kmong.com", "seoworld.co.kr", "coupang.com"];

export function DomainAuthorityForm() {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  // URL 쿼리 ?d=example.com 으로 진입 시 자동 분석
  useEffect(() => {
    const d = searchParams.get("d");
    if (d && d.trim()) {
      setDomain(d);
      analyze(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function analyze(target?: string) {
    const input = (target ?? domain).trim();
    if (!input) return;
    if (target) setDomain(target);

    setLoading(true);
    setError("");
    setResult(null);
    setShowUpgrade(false);
    trackToolAttempt("domain-authority");

    try {
      const res = await fetch("/api/domain-authority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: input }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("domain-authority", "guest");
        } else {
          trackToolError("domain-authority", data.error || "api_error");
        }
      } else {
        setResult(data);
        if (data.metrics) trackToolUsage("domain-authority");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("domain-authority", "network_error");
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
              placeholder="example.com"
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              className="flex-1"
            />
            <Button onClick={() => analyze()} disabled={loading || !domain}>
              {loading ? "분석 중..." : "도메인 권위 분석"}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">예시:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => analyze(ex)}
                disabled={loading}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="도메인 권위 분석"
              />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              도메인 지표를 조회하고 있습니다...
            </p>
          )}
        </CardContent>
      </Card>

      {result && result.metrics ? (
        <DomainMetricsCard domain={result.domain ?? domain} metrics={result.metrics} />
      ) : null}

      {result && !result.metrics ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">데이터 준비 중</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.message ||
                "도메인 지표가 아직 수집되지 않았습니다. 잠시 후 다시 시도해주세요."}
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => analyze(result.domain ?? domain)}>
                다시 시도
              </Button>
              <Link href="/tools/onpage-audit">
                <Button size="sm" variant="outline">
                  온페이지 SEO 분석으로 이동
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <RelatedTools currentTool="domain-authority" />
    </div>
  );
}
