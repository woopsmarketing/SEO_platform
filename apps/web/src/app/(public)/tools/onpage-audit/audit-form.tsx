"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackToolUsage, trackToolAttempt, trackRateLimit, trackToolError } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import { SmartServiceCta } from "@/components/smart-service-cta";
import { RelatedTools } from "@/components/related-tools";
import { InquiryCTABanner } from "@/components/inquiry-cta-banner";
import { CompetitorAnalysisCTA } from "@/components/competitor-analysis-cta";
import type { DomainMetrics } from "@/lib/cache-api";

interface ParsedSeo {
  url: string;
  statusCode: number;
  loadTimeMs: number;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  metaKeywords: string | null;
  canonical: string | null;
  h1: string[];
  h2: string[];
  h3Count: number;
  imgTotal: number;
  imgWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  hasViewport: boolean;
  hasCharset: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasTwitterCard: boolean;
  hasRobotsMeta: string | null;
  hasHreflang: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  wordCount: number;
  htmlSize: number;
  xRobotsTag: string | null;
  isHttps: boolean;
  lang: string | null;
  hasFavicon: boolean;
  textToHtmlRatio: number;
  urlDepth: number;
  urlLength: number;
  hasDeprecatedTags: string[];
  hasIframes: number;
  inlineCssSize: number;
  inlineJsSize: number;
  hasGzip: boolean;
  hasCacheControl: string | null;
  hasHsts: boolean;
  redirectCount: number;
  redirectIsWww: boolean;
  duplicateH1: boolean;
  duplicateDescription: boolean;
  ogImageUrl: string | null;
}

interface AuditResult {
  parsed: ParsedSeo;
  analysis: string | null;
  metrics?: DomainMetrics | null;
  error?: string;
}

interface CheckItem {
  label: string;
  value: string;
  ok: boolean;
  note?: string;
}

function collectChecks(parsed: ParsedSeo): CheckItem[] {
  const items: CheckItem[] = [];
  items.push({ label: "상태 코드", value: String(parsed.statusCode), ok: parsed.statusCode === 200 });
  items.push({ label: "HTTPS", value: parsed.isHttps ? "적용됨" : "미적용", ok: parsed.isHttps });
  items.push({ label: "로딩 시간", value: parsed.loadTimeMs + "ms", ok: parsed.loadTimeMs < 3000 });
  items.push({ label: "단어 수", value: String(parsed.wordCount), ok: parsed.wordCount >= 300 });
  const textRatioOk = parsed.textToHtmlRatio >= 10;
  const textRatioNote = !textRatioOk && parsed.wordCount >= 300
    ? "Next.js, React 등 프레임워크 사이트는 하이드레이션 스크립트(__NEXT_DATA__ 등)로 인해 HTML 크기가 커져 비율이 낮게 측정될 수 있습니다. 실제 콘텐츠가 충분하다면 SEO에 영향을 주지 않습니다."
    : undefined;
  items.push({ label: "텍스트/HTML 비율", value: parsed.textToHtmlRatio + "%", ok: textRatioOk, note: textRatioNote });
  items.push({ label: "URL 깊이", value: parsed.urlDepth + "단계 (" + parsed.urlLength + "자)", ok: parsed.urlDepth <= 3 });
  items.push({ label: "Title", value: parsed.title ? parsed.title + " (" + parsed.titleLength + "자)" : "없음", ok: !!parsed.title && parsed.titleLength >= 10 && parsed.titleLength <= 60 });
  if (parsed.duplicateDescription) {
    items.push({ label: "중복 Description", value: "description이 2번 이상 선언됨", ok: false });
  }
  items.push({ label: "Description", value: parsed.metaDescription ? parsed.metaDescription.slice(0, 80) + "... (" + parsed.metaDescriptionLength + "자)" : "없음", ok: !!parsed.metaDescription && parsed.metaDescriptionLength >= 50 && parsed.metaDescriptionLength <= 160 });
  items.push({ label: "Canonical", value: parsed.canonical || "없음", ok: !!parsed.canonical });
  items.push({ label: "Lang", value: parsed.lang || "없음", ok: !!parsed.lang });
  items.push({ label: "H1", value: parsed.h1.length + "개" + (parsed.h1.length > 0 ? " — \"" + parsed.h1[0] + "\"" : ""), ok: parsed.h1.length === 1 });
  if (parsed.duplicateH1) {
    items.push({ label: "중복 H1", value: "H1이 " + parsed.h1.length + "개 — 1개만 사용 권장", ok: false });
  }
  items.push({ label: "H2", value: parsed.h2.length + "개", ok: parsed.h2.length > 0 });
  items.push({ label: "Alt 미설정", value: parsed.imgWithoutAlt + "개", ok: parsed.imgWithoutAlt === 0 });
  items.push({ label: "내부 링크", value: parsed.internalLinks + "개", ok: parsed.internalLinks > 0 });
  if (parsed.hasIframes > 0) {
    items.push({ label: "iframe", value: parsed.hasIframes + "개 — 크롤링 방해 가능", ok: false });
  }
  items.push({ label: "Viewport", value: parsed.hasViewport ? "설정됨" : "없음", ok: parsed.hasViewport });
  items.push({ label: "Charset", value: parsed.hasCharset ? "설정됨" : "없음", ok: parsed.hasCharset });
  items.push({ label: "Favicon", value: parsed.hasFavicon ? "있음" : "없음", ok: parsed.hasFavicon });
  items.push({ label: "Gzip/Brotli", value: parsed.hasGzip ? "적용됨" : "미적용", ok: parsed.hasGzip });
  items.push({ label: "HSTS", value: parsed.hasHsts ? "적용됨" : "미적용", ok: parsed.hasHsts });
  items.push({ label: "인라인 CSS", value: (parsed.inlineCssSize / 1024).toFixed(1) + " KB", ok: parsed.inlineCssSize < 50000 });
  const inlineJsOk = parsed.inlineJsSize < 50000;
  const inlineJsNote = !inlineJsOk && parsed.wordCount >= 200
    ? "Next.js, Nuxt 등 SSR 프레임워크는 __NEXT_DATA__ 같은 하이드레이션 데이터를 인라인 스크립트로 포함합니다. 프레임워크 사이트라면 정상적인 수치이며, 성능이나 SEO에 부정적 영향은 없습니다."
    : undefined;
  items.push({ label: "인라인 JS", value: (parsed.inlineJsSize / 1024).toFixed(1) + " KB" + (!inlineJsOk ? " — 외부 파일로 분리 권장" : ""), ok: inlineJsOk, note: inlineJsNote });
  if (parsed.hasDeprecatedTags.length > 0) {
    items.push({ label: "Deprecated 태그", value: parsed.hasDeprecatedTags.join(", "), ok: false });
  }
  const ogParts = [parsed.hasOgTitle && "title", parsed.hasOgDescription && "desc", parsed.hasOgImage && "image"].filter(Boolean).join(", ");
  items.push({ label: "OG Tags", value: ogParts || "없음", ok: !!(parsed.hasOgTitle && parsed.hasOgDescription) });
  items.push({ label: "Twitter Card", value: parsed.hasTwitterCard ? "있음" : "없음", ok: parsed.hasTwitterCard });
  items.push({ label: "JSON-LD", value: parsed.hasStructuredData ? parsed.structuredDataTypes.join(", ") : "없음", ok: parsed.hasStructuredData });
  return items;
}

function calculateScore(parsed: ParsedSeo): number {
  const checks = [
    parsed.statusCode === 200, parsed.isHttps, parsed.loadTimeMs < 3000,
    parsed.wordCount >= 300, parsed.textToHtmlRatio >= 10, parsed.urlDepth <= 3,
    !!parsed.title && parsed.titleLength >= 10 && parsed.titleLength <= 60,
    !!parsed.metaDescription && parsed.metaDescriptionLength >= 50 && parsed.metaDescriptionLength <= 160,
    !!parsed.canonical, !!parsed.lang, parsed.h1.length === 1, parsed.h2.length > 0,
    parsed.imgWithoutAlt === 0, parsed.internalLinks > 0, parsed.hasViewport,
    parsed.hasCharset, parsed.hasFavicon, parsed.hasGzip, parsed.hasHsts,
    parsed.inlineCssSize < 50000, parsed.inlineJsSize < 50000,
    !!(parsed.hasOgTitle && parsed.hasOgDescription), parsed.hasTwitterCard, parsed.hasStructuredData,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const searchParams = useSearchParams();

async function handleAuditWithUrl(targetUrl: string) {
    if (!targetUrl) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("onpage-audit");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("onpage-audit", "guest");
        } else {
          trackToolError("onpage-audit", data.error || "api_error");
        }
      } else {
        if (data.parsed?.statusCode === 403) {
          setError("대상 사이트가 서버에서의 접근을 차단하고 있습니다(403 Forbidden). 일부 사이트는 클라우드 서버 IP를 차단하여 분석이 제한될 수 있습니다.");
        }
        trackToolUsage("onpage-audit");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("onpage-audit", "network_error");
    }
    setLoading(false);
  }

  async function handleAudit() {
    if (!url) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    trackToolAttempt("onpage-audit");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) {
          setShowUpgrade(true);
          trackRateLimit("onpage-audit", "guest");
        } else {
          trackToolError("onpage-audit", data.error || "api_error");
        }
      } else {
        if (data.parsed?.statusCode === 403) {
          setError("대상 사이트가 서버에서의 접근을 차단하고 있습니다(403 Forbidden). 일부 사이트는 클라우드 서버 IP를 차단하여 분석이 제한될 수 있습니다.");
        }
        trackToolUsage("onpage-audit");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      trackToolError("onpage-audit", "network_error");
    }
    setLoading(false);
  }

  const score = result ? calculateScore(result.parsed) : undefined;
  const allChecks = result ? collectChecks(result.parsed) : [];
  const failedItems = allChecks.filter((c) => !c.ok);
  const passedItems = allChecks.filter((c) => c.ok);
  const topIssues = failedItems.slice(0, 3).map((i) => i.label);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === "Enter" && handleAudit()}
              className="flex-1"
            />
            <Button onClick={handleAudit} disabled={loading || !url}>
              {loading ? "분석 중..." : "SEO 분석"}
            </Button>
          </div>
          {error && (
            <div className="mt-3">
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal open={showUpgrade} onClose={() => setShowUpgrade(false)} toolName="온페이지 SEO 분석" />
            </div>
          )}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              페이지를 가져오고 AI가 분석하고 있습니다... (최대 30초)
            </p>
          )}
        </CardContent>
      </Card>

      {result && (
        <CompetitorAnalysisCTA
          siteUrl={result.parsed.url}
          toolName="onpage-audit"
        />
      )}

      <SignupBanner />
      {result && (
        <>
          {result.metrics && (
            <DomainMetricsCard
              domain={(() => {
                try { return new URL(result.parsed.url).hostname.replace(/^www\./, ""); }
                catch { return result.parsed.url; }
              })()}
              metrics={result.metrics}
            />
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ParsedDataCards
                parsed={result.parsed}
                failedItems={failedItems}
                passedItems={passedItems}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>AI SEO 분석</CardTitle>
                  <CardDescription>AI가 분석한 SEO 진단 결과입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  {result.analysis ? (
                    <div className="prose prose-sm max-w-none prose-headings:text-base prose-headings:font-semibold">
                      <MarkdownRenderer text={result.analysis} />
                    </div>
                  ) : result.error ? (
                    <p className="text-sm text-muted-foreground">{result.error}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">AI 분석 결과가 없습니다.</p>
                  )}
                  <div className="mt-6 border-t pt-6">
                    <SmartServiceCta parsed={result.parsed} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <InquiryCTABanner
            score={score}
            issueCount={failedItems.length}
            url={result.parsed.url}
            topIssues={topIssues}
          />
        </>
      )}
      <RelatedTools currentTool="onpage-audit" />
    </div>
  );
}

function ParsedDataCards({
  parsed, failedItems, passedItems,
}: {
  parsed: ParsedSeo; failedItems: CheckItem[]; passedItems: CheckItem[];
}) {
  const [showPassed, setShowPassed] = useState(false);
  const isSpaLikely = !!parsed.title && !parsed.metaDescription && parsed.h1.length === 0 && parsed.imgTotal === 0 && parsed.wordCount < 100;

  return (
    <>
      {isSpaLikely && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-amber-800">JavaScript 렌더링 사이트(SPA) 감지</p>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              이 사이트는 title만 서버에서 렌더링되고, description, H1, 이미지 등은 JavaScript 실행 후에 표시되는 것으로 보입니다.
              아래 분석 결과는 <strong>구글봇이 1차 크롤링 시 보는 것과 동일한 관점</strong>입니다.
            </p>
          </CardContent>
        </Card>
      )}

      {failedItems.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-700">
              문제 항목 ({failedItems.length}개)
            </CardTitle>
            <p className="text-sm font-semibold text-red-600 mt-1">
              이 문제들이 검색 순위를 낮추고 있습니다
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {failedItems.map((item, i) => (
              <div key={"fail-" + i} className="rounded-md bg-red-100/60 px-3 py-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 font-semibold text-red-800">{item.label}</span>
                  <span className="text-right text-red-700 font-medium">
                    ✘ {item.value}
                  </span>
                </div>
                {item.note && (
                  <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1.5 leading-relaxed">
                    💡 {item.note}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {passedItems.length > 0 && (
        <Card className="border-green-200">
          <CardContent className="pt-4 pb-4">
            <button
              type="button"
              onClick={() => setShowPassed(!showPassed)}
              className="w-full flex items-center justify-between text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              <span>통과 항목 {passedItems.length}개 보기</span>
              <span className="text-xs">{showPassed ? "▲" : "▼"}</span>
            </button>
            {showPassed && (
              <div className="mt-3 space-y-2 text-sm">
                {passedItems.map((item, i) => (
                  <div key={"pass-" + i} className="flex items-start justify-between gap-4">
                    <span className="shrink-0 font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-right text-green-700">
                      ✔ {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">추가 정보</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="URL" value={parsed.url} />
          <Row label="HTML 크기" value={(parsed.htmlSize / 1024).toFixed(1) + " KB"} />
          <Row label="Keywords" value={parsed.metaKeywords ? parsed.metaKeywords.slice(0, 60) + "..." : "없음"} />
          <Row label="Robots" value={parsed.hasRobotsMeta || "없음"} />
          <Row label="이미지" value={parsed.imgTotal + "개"} />
          <Row label="외부 링크" value={parsed.externalLinks + "개"} />
          {parsed.nofollowLinks > 0 && <Row label="Nofollow 링크" value={parsed.nofollowLinks + "개"} />}
          <Row label="H3" value={parsed.h3Count + "개"} />
          <Row label="Cache-Control" value={parsed.hasCacheControl || "없음"} />
          <Row label="Hreflang" value={parsed.hasHreflang ? "있음" : "없음"} />
          {parsed.ogImageUrl && <Row label="OG Image" value={parsed.ogImageUrl.length > 50 ? parsed.ogImageUrl.slice(0, 50) + "..." : parsed.ogImageUrl} />}
          {parsed.redirectCount > 0 && (
            <Row label="리다이렉트" value={parsed.redirectIsWww ? parsed.redirectCount + "회 (www 정규화)" : parsed.redirectCount + "회"} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 font-medium text-muted-foreground">{label}</span>
      <span className={`text-right ${ok === true ? "text-green-700" : ok === false ? "text-red-600" : ""}`}>
        {ok === true && "✔ "}{ok === false && "✘ "}{value}
      </span>
    </div>
  );
}


function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  for (const line of lines) {
    i++;
    const trimmed = line.trimEnd();

    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={i} className="mt-4 mb-2 text-lg font-bold">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i} className="mt-3 mb-1 font-semibold">{trimmed.slice(4)}</h3>);
    } else if (trimmed.match(/^\d+\. /)) {
      elements.push(<p key={i} className="ml-4 my-0.5">{trimmed}</p>);
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <p key={i} className="ml-4 my-0.5">
          <span className="text-muted-foreground mr-1">&bull;</span>
          {formatBold(trimmed.slice(2))}
        </p>
      );
    } else if (trimmed === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="my-0.5">{formatBold(trimmed)}</p>);
    }
  }

  return <>{elements}</>;
}


function formatBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function toNumber(v: number | string | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

function formatCount(v: number | string | undefined): string {
  const n = toNumber(v);
  if (n == null) return "-";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString("ko-KR");
}

function metricTier(n: number | null): { label: string; color: string } {
  if (n == null) return { label: "-", color: "text-muted-foreground" };
  if (n >= 70) return { label: "최상위", color: "text-emerald-600" };
  if (n >= 50) return { label: "상위", color: "text-blue-600" };
  if (n >= 30) return { label: "평균", color: "text-amber-600" };
  return { label: "낮음", color: "text-muted-foreground" };
}

function DomainMetricsCard({ domain, metrics }: { domain: string; metrics: DomainMetrics }) {
  const da = toNumber(metrics.mozDA);
  const dr = toNumber(metrics.ahrefsDR);
  const tf = toNumber(metrics.majesticTF);

  // 3대 지표 모두 null이면 표시하지 않음
  if (da == null && dr == null && tf == null) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">도메인 권위 지표</CardTitle>
        <CardDescription>
          {domain} — Moz · Ahrefs · Majestic 외부 SEO 데이터
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Moz DA" value={da} description="Domain Authority" />
          <MetricTile label="Ahrefs DR" value={dr} description="Domain Rating" />
          <MetricTile label="Majestic TF" value={tf} description="Trust Flow" />
        </div>
        <div className="grid gap-y-2 gap-x-6 text-sm sm:grid-cols-2 border-t pt-4">
          <InfoRow label="참조 도메인" value={formatCount(metrics.ahrefsRefDomains)} sub="Ahrefs 기준 백링크 도메인 수" />
          <InfoRow label="예상 월간 트래픽" value={formatCount(metrics.ahrefsTraffic)} sub="Ahrefs 유기 트래픽 추정" />
          <InfoRow label="유기 키워드" value={formatCount(metrics.ahrefsOrganicKeywords)} sub="구글 유기 노출 키워드" />
          <InfoRow label="총 백링크" value={formatCount(metrics.ahrefsBacklinks)} sub="Ahrefs 기준" />
        </div>
        <p className="text-[11px] text-muted-foreground">
          * 데이터는 Moz, Ahrefs, Majestic에서 집계된 외부 지표입니다. 도메인 종합 권위도를 가늠하는 참고 수치로 활용하세요.
        </p>
      </CardContent>
    </Card>
  );
}

function MetricTile({ label, value, description }: { label: string; value: number | null; description: string }) {
  const tier = metricTier(value);
  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold tabular-nums">{value != null ? Math.round(value) : "-"}</div>
      <div className={`mt-1 text-[11px] font-medium ${tier.color}`}>{tier.label}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{description}</div>
    </div>
  );
}

function InfoRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{sub}</div>
      </div>
      <div className="tabular-nums font-semibold text-base shrink-0">{value}</div>
    </div>
  );
}

