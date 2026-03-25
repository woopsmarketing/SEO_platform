"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedMeta {
  url: string;
  statusCode: number;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  metaKeywords: string | null;
  canonical: string | null;
  robots: string | null;
  author: string | null;
  charset: string | null;
  viewport: string | null;
  lang: string | null;
  favicon: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogLocale: string | null;
  ogSiteName: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  alternateLinks: { hreflang: string; href: string }[];
}

interface MetaRecommendation {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  twitterCard: string;
  issues: string[];
  improvements: string[];
}

interface AnalyzeResult {
  parsed: ParsedMeta;
  recommendation: MetaRecommendation | null;
}

export function MetaGeneratorForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/meta-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "분석에 실패했습니다.");
      } else {
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  async function copyText(text: string, section: string) {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  }

  const p = result?.parsed;
  const rec = result?.recommendation;

  return (
    <div className="space-y-8">
      {/* URL 입력 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="flex-1"
            />
            <Button onClick={handleAnalyze} disabled={loading || !url}>
              {loading ? "분석 중..." : "메타태그 분석"}
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {loading && (
            <p className="mt-3 text-sm text-muted-foreground">
              페이지의 메타태그를 분석하고 있습니다...
            </p>
          )}
        </CardContent>
      </Card>

      {p && (
        <>
          {/* 진단 요약 */}
          {rec && (rec.issues.length > 0 || rec.improvements.length > 0) && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-base">진단 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rec.issues.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">문제점</p>
                    <ul className="space-y-1">
                      {rec.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-red-600 flex gap-2">
                          <span className="shrink-0">&#10005;</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {rec.improvements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">개선 제안</p>
                    <ul className="space-y-1">
                      {rec.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-green-700 flex gap-2">
                          <span className="shrink-0">&#10003;</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Google 검색 미리보기: 현재 vs 추천 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">현재 Google 검색 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <GooglePreview
                  url={p.url}
                  title={p.title}
                  description={p.metaDescription}
                  favicon={p.favicon}
                />
              </CardContent>
            </Card>

            {rec && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-base text-green-700">추천 Google 검색 미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <GooglePreview
                    url={p.url}
                    title={rec.title}
                    description={rec.description}
                    favicon={p.favicon}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* 현재 메타태그 + 추천 메타태그 */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 현재 상태 */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">현재 메타태그 상태</h2>

              <Card>
                <CardHeader><CardTitle className="text-base">기본 메타</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <MetaRow
                    label="Title"
                    value={p.title}
                    sub={p.title ? `${p.titleLength}자` : undefined}
                    ok={!!p.title && p.titleLength >= 10 && p.titleLength <= 60}
                  />
                  <MetaRow
                    label="Description"
                    value={p.metaDescription}
                    sub={p.metaDescription ? `${p.metaDescriptionLength}자` : undefined}
                    ok={!!p.metaDescription && p.metaDescriptionLength >= 50 && p.metaDescriptionLength <= 160}
                  />
                  <MetaRow label="Keywords" value={p.metaKeywords} ok={!!p.metaKeywords} />
                  <MetaRow label="Canonical" value={p.canonical} ok={!!p.canonical} />
                  <MetaRow label="Robots" value={p.robots} />
                  <MetaRow label="Author" value={p.author} />
                  <MetaRow label="Lang" value={p.lang} ok={!!p.lang} />
                  <MetaRow label="Charset" value={p.charset} ok={!!p.charset} />
                  <MetaRow label="Viewport" value={p.viewport} ok={!!p.viewport} />
                  <MetaRow label="Favicon" value={p.favicon ? "있음" : null} ok={!!p.favicon} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Open Graph</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <MetaRow label="og:title" value={p.ogTitle} ok={!!p.ogTitle} />
                  <MetaRow label="og:description" value={p.ogDescription} ok={!!p.ogDescription} />
                  <MetaRow label="og:image" value={p.ogImage} ok={!!p.ogImage} />
                  <MetaRow label="og:url" value={p.ogUrl} ok={!!p.ogUrl} />
                  <MetaRow label="og:type" value={p.ogType} ok={!!p.ogType} />
                  <MetaRow label="og:locale" value={p.ogLocale} />
                  <MetaRow label="og:site_name" value={p.ogSiteName} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Twitter Card</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <MetaRow label="twitter:card" value={p.twitterCard} ok={!!p.twitterCard} />
                  <MetaRow label="twitter:title" value={p.twitterTitle} ok={!!p.twitterTitle} />
                  <MetaRow label="twitter:description" value={p.twitterDescription} ok={!!p.twitterDescription} />
                  <MetaRow label="twitter:image" value={p.twitterImage} ok={!!p.twitterImage} />
                  <MetaRow label="twitter:site" value={p.twitterSite} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">구조화 데이터</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <MetaRow
                    label="JSON-LD"
                    value={p.hasStructuredData ? p.structuredDataTypes.join(", ") : null}
                    ok={p.hasStructuredData}
                  />
                  <MetaRow
                    label="Hreflang"
                    value={p.alternateLinks.length > 0 ? `${p.alternateLinks.length}개 언어` : null}
                    ok={p.alternateLinks.length > 0}
                  />
                </CardContent>
              </Card>
            </div>

            {/* AI 추천 */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-green-700">AI 추천 메타태그</h2>

              {rec ? (
                <>
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">추천 Title</CardTitle>
                      <CardDescription>{rec.title.length}자</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{rec.title}</p>
                        <CopyBtn
                          text={rec.title}
                          section="title"
                          copied={copiedSection}
                          onCopy={copyText}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">추천 Description</CardTitle>
                      <CardDescription>{rec.description.length}자</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm">{rec.description}</p>
                        <CopyBtn
                          text={rec.description}
                          section="desc"
                          copied={copiedSection}
                          onCopy={copyText}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">추천 Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {rec.keywords.split(",").map((kw, i) => (
                            <span key={i} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                        <CopyBtn
                          text={rec.keywords}
                          section="keywords"
                          copied={copiedSection}
                          onCopy={copyText}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-base">추천 OG / Twitter</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">og:title</span>
                        <span className="text-right max-w-[60%] truncate">{rec.ogTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">og:description</span>
                        <span className="text-right max-w-[60%] truncate">{rec.ogDescription}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">og:type</span>
                        <span>{rec.ogType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">twitter:card</span>
                        <span>{rec.twitterCard}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 전체 코드 복사 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">추천 메타태그 코드</CardTitle>
                      <CardDescription>아래 코드를 HTML &lt;head&gt; 안에 붙여넣으세요.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="max-h-[400px] overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed">
                          <code>{generateRecommendedCode(p, rec)}</code>
                        </pre>
                        <Button
                          size="sm"
                          className="absolute right-2 top-2"
                          onClick={() => copyText(generateRecommendedCode(p, rec), "code")}
                        >
                          {copiedSection === "code" ? "복사됨!" : "전체 복사"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      AI 추천을 사용하려면 OPENAI_API_KEY 환경변수를 설정하세요.
                      왼쪽의 현재 메타태그 분석 결과를 참고하여 직접 최적화할 수 있습니다.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GooglePreview({
  url,
  title,
  description,
  favicon,
}: {
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
}) {
  let displayUrl = url;
  try {
    const u = new URL(url);
    displayUrl = u.hostname + u.pathname;
  } catch {}

  return (
    <div className="rounded-lg border bg-white p-4 space-y-1">
      <div className="flex items-center gap-2">
        {favicon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={favicon} alt="" className="h-4 w-4 rounded-sm" />
        )}
        <span className="text-xs text-muted-foreground truncate">{displayUrl}</span>
      </div>
      <p className="text-lg text-blue-700 hover:underline line-clamp-1 leading-snug">
        {title || "(제목 없음)"}
      </p>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {description || "(설명 없음)"}
      </p>
    </div>
  );
}

function MetaRow({
  label,
  value,
  sub,
  ok,
}: {
  label: string;
  value: string | null;
  sub?: string;
  ok?: boolean;
}) {
  const display = value || "없음";
  const isLong = display.length > 60;

  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="shrink-0 font-medium text-muted-foreground text-xs w-28">{label}</span>
      <div className="text-right min-w-0">
        <span
          className={`text-xs break-all ${
            ok === true ? "text-green-700" : ok === false ? "text-red-600" : ""
          }`}
        >
          {ok === true && "&#10003; "}
          {ok === false && "&#10005; "}
          {isLong ? display.slice(0, 60) + "..." : display}
        </span>
        {sub && <span className="text-xs text-muted-foreground ml-1">({sub})</span>}
      </div>
    </div>
  );
}

function CopyBtn({
  text,
  section,
  copied,
  onCopy,
}: {
  text: string;
  section: string;
  copied: string | null;
  onCopy: (text: string, section: string) => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="shrink-0 text-xs h-7"
      onClick={() => onCopy(text, section)}
    >
      {copied === section ? "복사됨!" : "복사"}
    </Button>
  );
}

function generateRecommendedCode(p: ParsedMeta, rec: MetaRecommendation): string {
  const e = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines: string[] = [];

  lines.push(`<!-- 기본 메타 태그 -->`);
  lines.push(`<meta charset="${p.charset || "UTF-8"}">`);
  lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
  lines.push(`<title>${e(rec.title)}</title>`);
  lines.push(`<meta name="description" content="${e(rec.description)}">`);
  lines.push(`<meta name="keywords" content="${e(rec.keywords)}">`);
  if (p.author) lines.push(`<meta name="author" content="${e(p.author)}">`);
  lines.push(`<meta name="robots" content="${p.robots || "index, follow"}">`);
  if (p.canonical) lines.push(`<link rel="canonical" href="${e(p.canonical)}">`);
  else lines.push(`<link rel="canonical" href="${e(p.url)}">`);

  lines.push(``);
  lines.push(`<!-- Open Graph -->`);
  lines.push(`<meta property="og:title" content="${e(rec.ogTitle)}">`);
  lines.push(`<meta property="og:description" content="${e(rec.ogDescription)}">`);
  lines.push(`<meta property="og:url" content="${e(p.ogUrl || p.canonical || p.url)}">`);
  lines.push(`<meta property="og:type" content="${e(rec.ogType)}">`);
  lines.push(`<meta property="og:locale" content="${p.ogLocale || "ko_KR"}">`);
  if (p.ogImage) lines.push(`<meta property="og:image" content="${e(p.ogImage)}">`);
  if (p.ogSiteName) lines.push(`<meta property="og:site_name" content="${e(p.ogSiteName)}">`);

  lines.push(``);
  lines.push(`<!-- Twitter Card -->`);
  lines.push(`<meta name="twitter:card" content="${e(rec.twitterCard)}">`);
  lines.push(`<meta name="twitter:title" content="${e(rec.ogTitle)}">`);
  lines.push(`<meta name="twitter:description" content="${e(rec.ogDescription)}">`);
  if (p.twitterImage || p.ogImage) lines.push(`<meta name="twitter:image" content="${e(p.twitterImage || p.ogImage || "")}">`);
  if (p.twitterSite) lines.push(`<meta name="twitter:site" content="${e(p.twitterSite)}">`);

  return lines.join("\n");
}
