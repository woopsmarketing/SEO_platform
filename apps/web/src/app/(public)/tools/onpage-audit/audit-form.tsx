"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackToolUsage } from "@/lib/gtag";
import { SignupModal } from "@/components/signup-modal";
import { SmartServiceCta } from "@/components/smart-service-cta";

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
  error?: string;
}

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터로 전달된 경우 자동 분석 시작
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !url && !loading && !result) {
      setUrl(urlParam);
      // 다음 렌더 사이클에서 분석 실행
      setTimeout(() => {
        setUrl(urlParam);
        handleAuditWithUrl(urlParam);
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleAuditWithUrl(targetUrl: string) {
    if (!targetUrl) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) setShowUpgrade(true);
      } else {
        if (data.parsed?.statusCode === 403) {
          setError("대상 사이트가 서버에서의 접근을 차단하고 있습니다(403 Forbidden). 일부 사이트는 클라우드 서버 IP를 차단하여 분석이 제한될 수 있습니다.");
        }
        trackToolUsage("onpage-audit");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  async function handleAudit() {
    if (!url) return;
    setLoading(true);
    setError("");
    setShowUpgrade(false);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
        if (data.upgrade) setShowUpgrade(true);
      } else {
        // 403 상태코드 감지 시 안내
        if (data.parsed?.statusCode === 403) {
          setError("대상 사이트가 서버에서의 접근을 차단하고 있습니다(403 Forbidden). 일부 사이트는 클라우드 서버 IP를 차단하여 분석이 제한될 수 있습니다.");
        }
        trackToolUsage("onpage-audit");
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

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
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ParsedDataCards parsed={result.parsed} />
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
        </>
      )}
    </div>
  );
}

function ParsedDataCards({ parsed }: { parsed: ParsedSeo }) {
  // SPA/CSR 감지: title은 있는데 description, h1, 이미지가 모두 없으면
  const isSpaLikely = !!parsed.title
    && !parsed.metaDescription
    && parsed.h1.length === 0
    && parsed.imgTotal === 0
    && parsed.wordCount < 100;

  return (
    <>
      {/* SPA 감지 경고 배너 */}
      {isSpaLikely && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-amber-800">JavaScript 렌더링 사이트(SPA) 감지</p>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              이 사이트는 title만 서버에서 렌더링되고, description, H1, 이미지 등은 JavaScript 실행 후에 표시되는 것으로 보입니다.
              아래 분석 결과는 <strong>구글봇이 1차 크롤링 시 보는 것과 동일한 관점</strong>입니다.
              구글봇은 JS를 실행하지만 지연이 발생하므로, 서버사이드 렌더링(SSR)으로 메타태그와 콘텐츠를 즉시 제공하는 것이 SEO에 유리합니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 기본 정보 */}
      <Card>
        <CardHeader><CardTitle className="text-base">기본 정보</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="URL" value={parsed.url} />
          <Row label="상태 코드" value={String(parsed.statusCode)} ok={parsed.statusCode === 200} />
          <Row label="HTTPS" value={parsed.isHttps ? "적용됨" : "미적용"} ok={parsed.isHttps} />
          <Row label="로딩 시간" value={`${parsed.loadTimeMs}ms`} ok={parsed.loadTimeMs < 3000} />
          <Row label="HTML 크기" value={`${(parsed.htmlSize / 1024).toFixed(1)} KB`} />
          <Row label="단어 수" value={String(parsed.wordCount)} ok={parsed.wordCount >= 300} />
          <Row
            label="텍스트/HTML 비율"
            value={parsed.textToHtmlRatio < 10 ? `${parsed.textToHtmlRatio}% — JS 렌더링 사이트(SPA)일 수 있음` : `${parsed.textToHtmlRatio}%`}
            ok={parsed.textToHtmlRatio >= 10}
          />
          <Row label="URL 깊이" value={`${parsed.urlDepth}단계 (${parsed.urlLength}자)`} ok={parsed.urlDepth <= 3} />
          {parsed.redirectCount > 0 && (
            <Row
              label="리다이렉트"
              value={parsed.redirectIsWww ? `${parsed.redirectCount}회 (www 정규화 — 정상)` : `${parsed.redirectCount}회`}
              ok={parsed.redirectIsWww}
            />
          )}
        </CardContent>
      </Card>

      {/* 메타 태그 */}
      <Card>
        <CardHeader><CardTitle className="text-base">메타 태그</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row
            label="Title"
            value={parsed.title ? `${parsed.title} (${parsed.titleLength}자)` : "없음"}
            ok={!!parsed.title && parsed.titleLength >= 10 && parsed.titleLength <= 60}
          />
          {parsed.duplicateDescription && (
            <Row label="중복 Description" value="description이 2번 이상 선언됨" ok={false} />
          )}
          <Row
            label="Description"
            value={parsed.metaDescription ? `${parsed.metaDescription.slice(0, 80)}... (${parsed.metaDescriptionLength}자)` : "없음"}
            ok={!!parsed.metaDescription && parsed.metaDescriptionLength >= 50 && parsed.metaDescriptionLength <= 160}
          />
          <Row label="Keywords" value={parsed.metaKeywords ? `${parsed.metaKeywords.slice(0, 60)}...` : "없음"} />
          <Row label="Canonical" value={parsed.canonical || "없음"} ok={!!parsed.canonical} />
          <Row label="Robots" value={parsed.hasRobotsMeta || "없음"} />
          <Row label="Lang" value={parsed.lang || "없음"} ok={!!parsed.lang} />
        </CardContent>
      </Card>

      {/* 제목 구조 */}
      <Card>
        <CardHeader><CardTitle className="text-base">제목 구조</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="H1" value={`${parsed.h1.length}개${parsed.h1.length > 0 ? ` — "${parsed.h1[0]}"` : ""}`} ok={parsed.h1.length === 1} />
          {parsed.duplicateH1 && (
            <Row label="중복 H1" value={`H1이 ${parsed.h1.length}개 — 1개만 사용 권장`} ok={false} />
          )}
          <Row label="H2" value={`${parsed.h2.length}개`} ok={parsed.h2.length > 0} />
          <Row label="H3" value={`${parsed.h3Count}개`} />
        </CardContent>
      </Card>

      {/* 이미지 & 링크 */}
      <Card>
        <CardHeader><CardTitle className="text-base">이미지 & 링크</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="이미지" value={`${parsed.imgTotal}개`} />
          <Row label="Alt 미설정" value={`${parsed.imgWithoutAlt}개`} ok={parsed.imgWithoutAlt === 0} />
          <Row label="내부 링크" value={`${parsed.internalLinks}개`} ok={parsed.internalLinks > 0} />
          <Row label="외부 링크" value={`${parsed.externalLinks}개`} />
          {parsed.nofollowLinks > 0 && (
            <Row label="Nofollow 링크" value={`${parsed.nofollowLinks}개`} />
          )}
          {parsed.hasIframes > 0 && (
            <Row label="iframe" value={`${parsed.hasIframes}개 — 크롤링 방해 가능`} ok={false} />
          )}
        </CardContent>
      </Card>

      {/* 기술 SEO */}
      <Card>
        <CardHeader><CardTitle className="text-base">기술 SEO</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Viewport" value={parsed.hasViewport ? "설정됨" : "없음"} ok={parsed.hasViewport} />
          <Row label="Charset" value={parsed.hasCharset ? "설정됨" : "없음"} ok={parsed.hasCharset} />
          <Row label="Favicon" value={parsed.hasFavicon ? "있음" : "없음"} ok={parsed.hasFavicon} />
          <Row label="Gzip/Brotli" value={parsed.hasGzip ? "적용됨" : "미적용"} ok={parsed.hasGzip} />
          <Row label="HSTS" value={parsed.hasHsts ? "적용됨" : "미적용"} ok={parsed.hasHsts} />
          <Row label="Cache-Control" value={parsed.hasCacheControl || "없음"} />
          <Row label="인라인 CSS" value={`${(parsed.inlineCssSize / 1024).toFixed(1)} KB`} ok={parsed.inlineCssSize < 50000} />
          <Row
            label="인라인 JS"
            value={parsed.inlineJsSize > 50000 ? `${(parsed.inlineJsSize / 1024).toFixed(1)} KB — 외부 파일로 분리 권장` : `${(parsed.inlineJsSize / 1024).toFixed(1)} KB`}
            ok={parsed.inlineJsSize < 50000}
          />
          {parsed.hasDeprecatedTags.length > 0 && (
            <Row label="Deprecated 태그" value={parsed.hasDeprecatedTags.join(", ")} ok={false} />
          )}
        </CardContent>
      </Card>

      {/* 소셜 & 구조화 데이터 */}
      <Card>
        <CardHeader><CardTitle className="text-base">소셜 & 구조화 데이터</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="OG Tags" value={[parsed.hasOgTitle && "title", parsed.hasOgDescription && "desc", parsed.hasOgImage && "image"].filter(Boolean).join(", ") || "없음"} ok={parsed.hasOgTitle && parsed.hasOgDescription} />
          {parsed.ogImageUrl && (
            <Row label="OG Image" value={parsed.ogImageUrl.length > 50 ? parsed.ogImageUrl.slice(0, 50) + "..." : parsed.ogImageUrl} />
          )}
          <Row label="Twitter Card" value={parsed.hasTwitterCard ? "있음" : "없음"} ok={parsed.hasTwitterCard} />
          <Row
            label="JSON-LD"
            value={parsed.hasStructuredData ? parsed.structuredDataTypes.join(", ") : "없음"}
            ok={parsed.hasStructuredData}
          />
          <Row label="Hreflang" value={parsed.hasHreflang ? "있음" : "없음"} />
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
