"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DomainMetrics } from "@/lib/cache-api";
import { toNumber, metricTier } from "@/components/domain-metrics-card";
import { trackToolAttempt, trackToolUsage, trackToolError } from "@/lib/gtag";

type Tab = "audit" | "authority";

export function HeroAnalyzer() {
  const [tab, setTab] = useState<Tab>("audit");
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    domain: string;
    metrics: DomainMetrics | null;
    pending: boolean;
    message?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleAuditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    let target = url.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    router.push(`/tools/onpage-audit?url=${encodeURIComponent(target)}`);
  }

  async function handleAuthoritySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    trackToolAttempt("domain-authority");
    try {
      const res = await fetch("/api/domain-authority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        trackToolError("domain-authority", data.error || "api_error");
      } else {
        setResult({
          domain: data.domain,
          metrics: data.metrics ?? null,
          pending: !!data.pending,
          message: data.message,
        });
        if (data.metrics) trackToolUsage("domain-authority");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("domain-authority", "network_error");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto mt-8 max-w-xl">
      {/* 탭 */}
      <div className="flex justify-center gap-2">
        <TabButton active={tab === "audit"} onClick={() => setTab("audit")}>
          온페이지 SEO 분석
        </TabButton>
        <TabButton active={tab === "authority"} onClick={() => setTab("authority")}>
          도메인 권위 (DA/DR/TF)
        </TabButton>
      </div>

      {tab === "audit" ? (
        <form onSubmit={handleAuditSubmit} className="mt-4">
          <div className="flex gap-2 rounded-xl bg-white shadow-lg border border-gray-200 p-2">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="분석할 사이트 URL을 입력하세요"
                className="border-0 pl-10 text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 text-base shrink-0"
            >
              무료 분석하기
            </Button>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            예: seoworld.co.kr &middot; 회원가입 없이 바로 분석 &middot; 100% 무료
          </p>
        </form>
      ) : (
        <form onSubmit={handleAuthoritySubmit} className="mt-4">
          <div className="flex gap-2 rounded-xl bg-white shadow-lg border border-gray-200 p-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="도메인 입력 (예: naver.com)"
              className="border-0 pl-4 text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 text-base shrink-0"
            >
              {loading ? "조회 중..." : "DA/DR 미리보기"}
            </Button>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          {result && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {result.metrics ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <MiniTile label="Moz DA" value={toNumber(result.metrics.mozDA)} />
                    <MiniTile label="Ahrefs DR" value={toNumber(result.metrics.ahrefsDR)} />
                    <MiniTile label="Majestic TF" value={toNumber(result.metrics.majesticTF)} />
                  </div>
                  <div className="mt-3 text-center">
                    <Link
                      href={`/tools/domain-authority?d=${encodeURIComponent(result.domain)}`}
                    >
                      <Button variant="outline" size="sm">
                        전체 분석 보기
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium">데이터 준비 중</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {result.message || "잠시 후 다시 시도해주세요."}
                  </p>
                </div>
              )}
            </div>
          )}
          <p className="mt-3 text-sm text-gray-400">
            Moz · Ahrefs · Majestic 권위 지표 &middot; 공용 캐시 기반 &middot; 100% 무료
          </p>
        </form>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white shadow"
          : "bg-white/60 text-gray-600 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function MiniTile({ label, value }: { label: string; value: number | null }) {
  const tier = metricTier(value);
  return (
    <div className="rounded-lg border bg-gray-50 p-3 text-center">
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="mt-0.5 text-2xl font-bold tabular-nums text-gray-900">
        {value != null ? Math.round(value) : "-"}
      </div>
      <div className={`mt-0.5 text-[10px] font-medium ${tier.color}`}>{tier.label}</div>
    </div>
  );
}
