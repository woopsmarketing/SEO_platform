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

interface DiagnosticItem {
  type: "error" | "warning" | "success";
  category: string;
  message: string;
}

// 한글 비율 감지
function isKoreanText(text: string | null): boolean {
  if (!text) return false;
  const korean = text.match(/[\uac00-\ud7af]/g) || [];
  return korean.length / text.length > 0.3;
}

function generateDiagnostics(p: ParsedMeta): DiagnosticItem[] {
  const items: DiagnosticItem[] = [];
  const isKr = isKoreanText(p.title) || isKoreanText(p.metaDescription);

  // 한글/영문에 따른 기준 (Google 검색결과 픽셀 기반)
  // Title: ~600px → 한글 약 30~35자, 영문 약 55~60자
  // Description: ~920px → 한글 약 70~80자, 영문 약 150~160자
  const titleMin = isKr ? 15 : 30;
  const titleMax = isKr ? 40 : 60;
  const descMin = isKr ? 40 : 80;
  const descMax = isKr ? 80 : 160;
  const langLabel = isKr ? "한글" : "영문";

  // JS 렌더링 의존 감지
  const hasSomeBasic = !!p.title;
  const missingAll = !p.metaDescription && !p.ogTitle && !p.ogDescription && !p.twitterCard;
  if (hasSomeBasic && missingAll) {
    items.push({
      type: "warning",
      category: "SSR/CSR",
      message: "제목은 감지되었으나 description, OG 태그 등이 모두 없습니다. JavaScript로 동적 삽입하는 SPA(Nuxt, React 등)일 수 있습니다. 검색엔진 크롤러도 JS 실행 전 HTML만 읽으므로, 서버사이드 렌더링(SSR)으로 메타태그를 출력하는 것이 SEO에 중요합니다.",
    });
  }

  // Title
  if (!p.title) {
    items.push({ type: "error", category: "Title", message: "페이지 제목(<title>)이 없습니다. 검색 결과에 표시되지 않습니다." });
  } else if (p.titleLength > titleMax) {
    items.push({ type: "warning", category: "Title", message: `제목이 ${p.titleLength}자입니다. ${langLabel} 기준 ${titleMax}자를 초과하면 Google 검색결과에서 잘립니다. (권장: ${titleMin}~${titleMax}자)` });
  } else if (p.titleLength < titleMin) {
    items.push({ type: "warning", category: "Title", message: `제목이 ${p.titleLength}자로 짧습니다. 핵심 키워드를 포함하여 ${titleMin}~${titleMax}자로 작성하세요. (${langLabel} 기준)` });
  } else {
    items.push({ type: "success", category: "Title", message: `제목 ${p.titleLength}자 — ${langLabel} 기준 적절합니다. (권장: ${titleMin}~${titleMax}자)` });
  }

  // Description
  if (!p.metaDescription) {
    items.push({ type: "error", category: "Description", message: "메타 설명이 없습니다. 검색 결과 클릭률(CTR)이 낮아집니다." });
  } else if (p.metaDescriptionLength > descMax) {
    items.push({ type: "warning", category: "Description", message: `메타 설명이 ${p.metaDescriptionLength}자입니다. ${langLabel} 기준 ${descMax}자를 초과하면 Google 검색결과에서 잘립니다. (권장: ${descMin}~${descMax}자)` });
  } else if (p.metaDescriptionLength < descMin) {
    items.push({ type: "warning", category: "Description", message: `메타 설명이 ${p.metaDescriptionLength}자로 짧습니다. ${descMin}~${descMax}자 범위로 작성하면 검색결과에 충분히 표시됩니다. (${langLabel} 기준)` });
  } else {
    items.push({ type: "success", category: "Description", message: `메타 설명 ${p.metaDescriptionLength}자 — ${langLabel} 기준 적절합니다. (권장: ${descMin}~${descMax}자)` });
  }

  // Canonical
  if (!p.canonical) {
    items.push({ type: "warning", category: "Canonical", message: "canonical 태그가 없습니다. 중복 콘텐츠 문제가 발생할 수 있습니다." });
  } else {
    items.push({ type: "success", category: "Canonical", message: "canonical URL이 설정되어 있습니다." });
  }

  // Viewport
  if (!p.viewport) {
    items.push({ type: "error", category: "Viewport", message: "viewport 메타태그가 없습니다. 모바일에서 레이아웃이 깨질 수 있습니다." });
  }

  // Lang
  if (!p.lang) {
    items.push({ type: "warning", category: "Lang", message: "HTML lang 속성이 없습니다. 검색엔진이 페이지 언어를 판단하기 어렵습니다." });
  }

  // Favicon
  if (!p.favicon) {
    items.push({ type: "warning", category: "Favicon", message: "파비콘이 없습니다. 브라우저 탭과 검색결과에 브랜드 아이콘이 표시되지 않습니다." });
  }

  // Keywords
  if (!p.metaKeywords) {
    items.push({ type: "warning", category: "Keywords", message: "메타 키워드가 없습니다. 직접적인 랭킹 영향은 적지만, 일부 검색엔진(Naver 등)에서 참고합니다." });
  }

  // Open Graph
  if (!p.ogTitle || !p.ogDescription || !p.ogImage) {
    const missing: string[] = [];
    if (!p.ogTitle) missing.push("og:title");
    if (!p.ogDescription) missing.push("og:description");
    if (!p.ogImage) missing.push("og:image");
    items.push({ type: "error", category: "Open Graph", message: `${missing.join(", ")}가 없습니다. SNS 공유 시 미리보기가 제대로 표시되지 않습니다.` });
  } else {
    items.push({ type: "success", category: "Open Graph", message: "OG 태그가 모두 설정되어 있습니다." });
  }

  if (!p.ogLocale) {
    items.push({ type: "warning", category: "Open Graph", message: "og:locale이 없습니다. 한국어 사이트라면 ko_KR을 추가하세요." });
  }

  if (!p.ogSiteName) {
    items.push({ type: "warning", category: "Open Graph", message: "og:site_name이 없습니다. 브랜드명을 추가하면 SNS 공유 시 출처가 명확해집니다." });
  }

  // Twitter Card
  if (!p.twitterCard) {
    items.push({ type: "warning", category: "Twitter", message: "twitter:card가 없습니다. X(Twitter) 공유 시 미리보기가 기본값으로 표시됩니다." });
  } else {
    items.push({ type: "success", category: "Twitter", message: "Twitter Card가 설정되어 있습니다." });
  }

  // Structured Data
  if (!p.hasStructuredData) {
    items.push({
      type: "warning",
      category: "구조화 데이터",
      message: "JSON-LD 구조화 데이터가 없습니다. Organization, WebSite, BreadcrumbList 등을 추가하면 리치 스니펫으로 검색 결과에 노출될 수 있습니다.",
    });
  } else {
    items.push({ type: "success", category: "구조화 데이터", message: `JSON-LD 감지: ${p.structuredDataTypes.join(", ")}` });
  }

  // Hreflang
  if (p.alternateLinks.length === 0) {
    items.push({
      type: "warning",
      category: "Hreflang",
      message: "hreflang 태그가 없습니다. 다국어 사이트라면 추가하여 언어별 검색 결과를 최적화하세요. 단일 언어 사이트라면 무시해도 됩니다.",
    });
  }

  // Robots
  if (p.robots && (p.robots.includes("noindex") || p.robots.includes("nofollow"))) {
    items.push({ type: "error", category: "Robots", message: `robots 값이 "${p.robots}"입니다. 검색엔진에 인덱싱되지 않을 수 있습니다.` });
  }

  return items;
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
  const isKr = p ? (isKoreanText(p.title) || isKoreanText(p.metaDescription)) : false;
  const diagnostics = p ? generateDiagnostics(p) : [];
  const errors = diagnostics.filter((d) => d.type === "error");
  const warnings = diagnostics.filter((d) => d.type === "warning");
  const successes = diagnostics.filter((d) => d.type === "success");

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
          {/* 종합 진단 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">종합 진단 결과</CardTitle>
              <CardDescription>
                총 {diagnostics.length}개 항목 검사 — 문제 {errors.length}개, 주의 {warnings.length}개, 양호 {successes.length}개
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {errors.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">문제점 ({errors.length})</p>
                  <ul className="space-y-2">
                    {errors.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-red-500 mt-0.5">&#x2718;</span>
                        <div>
                          <span className="font-medium text-red-700">[{item.category}]</span>{" "}
                          <span className="text-red-600">{item.message}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {warnings.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-amber-700 mb-2">주의 ({warnings.length})</p>
                  <ul className="space-y-2">
                    {warnings.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-amber-500 mt-0.5">&#x26A0;</span>
                        <div>
                          <span className="font-medium text-amber-700">[{item.category}]</span>{" "}
                          <span className="text-amber-600">{item.message}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {successes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">양호 ({successes.length})</p>
                  <ul className="space-y-2">
                    {successes.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-green-500 mt-0.5">&#x2714;</span>
                        <div>
                          <span className="font-medium text-green-700">[{item.category}]</span>{" "}
                          <span className="text-green-600">{item.message}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI 추가 분석 */}
              {rec && (rec.issues.length > 0 || rec.improvements.length > 0) && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-blue-700 mb-2">AI 추가 분석</p>
                  <ul className="space-y-2">
                    {rec.issues.map((issue, i) => (
                      <li key={`ai-issue-${i}`} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-blue-500 mt-0.5">&#x2192;</span>
                        <span className="text-blue-600">{issue}</span>
                      </li>
                    ))}
                    {rec.improvements.map((imp, i) => (
                      <li key={`ai-imp-${i}`} className="flex gap-2 text-sm">
                        <span className="shrink-0 text-blue-500 mt-0.5">&#x2192;</span>
                        <span className="text-blue-600">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

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
                    ok={!!p.title && p.titleLength >= (isKr ? 15 : 30) && p.titleLength <= (isKr ? 40 : 60)}
                  />
                  <MetaRow
                    label="Description"
                    value={p.metaDescription}
                    sub={p.metaDescription ? `${p.metaDescriptionLength}자` : undefined}
                    ok={!!p.metaDescription && p.metaDescriptionLength >= (isKr ? 40 : 80) && p.metaDescriptionLength <= (isKr ? 80 : 160)}
                  />
                  <MetaRow label="Keywords" value={p.metaKeywords} ok={!!p.metaKeywords} />
                  <MetaRow label="Canonical" value={p.canonical} ok={!!p.canonical} />
                  <MetaRow label="Robots" value={p.robots} />
                  <MetaRow label="Author" value={p.author} />
                  <MetaRow label="Lang" value={p.lang} ok={!!p.lang} />
                  <MetaRow label="Charset" value={p.charset} ok={!!p.charset} />
                  <MetaRow label="Viewport" value={p.viewport ? "설정됨" : null} ok={!!p.viewport} />
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
                  />
                </CardContent>
              </Card>
            </div>

            {/* AI 추천 */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-green-700">AI 추천 메타태그</h2>

              {rec ? (
                <>
                  <RecCard
                    label="추천 Title"
                    current={p.title}
                    recommended={rec.title}
                    section="title"
                    copied={copiedSection}
                    onCopy={copyText}
                  />
                  <RecCard
                    label="추천 Description"
                    current={p.metaDescription}
                    recommended={rec.description}
                    section="desc"
                    copied={copiedSection}
                    onCopy={copyText}
                  />

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
                      왼쪽의 현재 메타태그 분석 결과와 상단 진단을 참고하여 직접 최적화할 수 있습니다.
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

function RecCard({
  label,
  current,
  recommended,
  section,
  copied,
  onCopy,
}: {
  label: string;
  current: string | null;
  recommended: string;
  section: string;
  copied: string | null;
  onCopy: (text: string, section: string) => void;
}) {
  const isSame = current?.trim() === recommended.trim();

  return (
    <Card className={isSame ? "border-muted" : "border-green-200"}>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>
          {isSame ? "현재 값 유지 — 변경 불필요" : `${recommended.length}자`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSame ? (
          <p className="text-sm text-muted-foreground">현재 메타태그가 적절합니다. 그대로 유지하세요.</p>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{recommended}</p>
            <CopyBtn text={recommended} section={section} copied={copied} onCopy={onCopy} />
          </div>
        )}
      </CardContent>
    </Card>
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
          {ok === true && "✔ "}
          {ok === false && "✘ "}
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
