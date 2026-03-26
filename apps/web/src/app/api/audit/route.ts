import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    let { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "올바른 URL을 입력해주세요." }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // 1. 페이지 가져오기
    let html: string;
    let statusCode: number;
    let headers: Record<string, string> = {};
    let loadTime: number;
    let finalUrl: string;

    try {
      const start = Date.now();
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)", Accept: "text/html" },
        redirect: "follow",
      });
      loadTime = Date.now() - start;
      statusCode = res.status;
      headers = Object.fromEntries(res.headers.entries());
      html = await res.text();
      finalUrl = res.url;
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다. URL을 확인해주세요." }, { status: 400 });
    }

    // 2. HTML 파싱
    const parsed = parseHtml(html, url, finalUrl, statusCode, loadTime, headers);

    // 3. LLM 분석
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ parsed, analysis: null, error: "LLM 분석 키가 설정되지 않았습니다." });
    }

    const analysis = await analyzeSeo(apiKey, parsed);

    // 툴 사용 로그
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("tool_usage_logs").insert({
      tool_type: "onpage-audit",
      input_summary: url,
    });

    return NextResponse.json({ parsed, analysis });
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}

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
  headings: string;
  xRobotsTag: string | null;
  contentType: string | null;
  // 새로 추가된 항목
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

function parseHtml(html: string, requestUrl: string, finalUrl: string, statusCode: number, loadTime: number, headers: Record<string, string>): ParsedSeo {
  const title = extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i);
  const metaDescription = extractMetaAttr(html, "description");
  const metaKeywords = extractMetaAttr(html, "keywords");
  const canonical = extractMetaLink(html, "canonical");

  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgWithoutAlt = imgs.filter((img) => !img.match(/alt=["'][^"']+["']/i)).length;

  // 링크 분석 (nofollow 포함)
  const allLinkTags = html.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
  let internalLinks = 0;
  let externalLinks = 0;
  let nofollowLinks = 0;
  const origin = new URL(finalUrl).origin;

  for (const tag of allLinkTags) {
    const href = getAttr(tag, "href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    try {
      const resolved = new URL(href, finalUrl);
      if (resolved.origin === origin) internalLinks++;
      else externalLinks++;
    } catch { continue; }
    const rel = getAttr(tag, "rel");
    if (rel && rel.toLowerCase().includes("nofollow")) nofollowLinks++;
  }

  // 텍스트/HTML 비율
  const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;
  const textLength = textContent.replace(/\s+/g, "").length;
  const textToHtmlRatio = html.length > 0 ? Math.round((textLength / html.length) * 100) : 0;

  const headings = [
    ...h1s.map((h) => `H1: ${h}`),
    ...h2s.map((h) => `H2: ${h}`),
  ].slice(0, 15).join("\n");

  // HTTPS
  const isHttps = finalUrl.startsWith("https://");

  // lang 속성
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : null;

  // favicon
  const hasFavicon = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i.test(html);

  // URL 분석
  let urlDepth = 0;
  let urlLength = 0;
  try {
    const u = new URL(finalUrl);
    urlDepth = u.pathname.split("/").filter(Boolean).length;
    urlLength = finalUrl.length;
  } catch {}

  // Deprecated HTML 태그
  const deprecatedTags = ["font", "center", "marquee", "blink", "strike", "big", "tt"];
  const hasDeprecatedTags: string[] = [];
  for (const tag of deprecatedTags) {
    if (new RegExp(`<${tag}[\\s>]`, "i").test(html)) {
      hasDeprecatedTags.push(`<${tag}>`);
    }
  }

  // iframe
  const hasIframes = (html.match(/<iframe[^>]*>/gi) || []).length;

  // 인라인 CSS/JS 크기
  const inlineStyles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const inlineCssSize = inlineStyles.reduce((sum, s) => sum + s.length, 0);
  const inlineScripts = html.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const inlineJsSize = inlineScripts.reduce((sum, s) => sum + s.length, 0);

  // 응답 헤더 분석
  const encoding = headers["content-encoding"] || "";
  const hasGzip = /gzip|br|deflate/i.test(encoding);
  const hasCacheControl = headers["cache-control"] || null;
  const hasHsts = !!headers["strict-transport-security"];

  // 리다이렉트 감지
  const redirectCount = requestUrl !== finalUrl ? 1 : 0;
  // www 리다이렉트인지 판정 (example.com → www.example.com 또는 반대)
  let redirectIsWww = false;
  if (redirectCount > 0) {
    try {
      const reqHost = new URL(requestUrl).hostname;
      const finalHost = new URL(finalUrl).hostname;
      redirectIsWww =
        reqHost === "www." + finalHost ||
        finalHost === "www." + reqHost ||
        reqHost.replace(/^www\./, "") === finalHost.replace(/^www\./, "");
    } catch {}
  }

  // 중복 H1
  const duplicateH1 = h1s.length > 1;

  // 중복 description
  const descMetas = (html.match(/<meta[^>]*name=["']description["'][^>]*>/gi) || []);
  const duplicateDescription = descMetas.length > 1;

  // OG image URL
  const ogImageUrl = extractProperty(html, "og:image");

  // 구조화 데이터 타입 — @graph 배열 및 중첩 구조 대응
  const ldJsonMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const structuredDataTypes: string[] = [];
  for (const match of ldJsonMatches) {
    try {
      const json = match.replace(/<script[^>]*>|<\/script>/gi, "");
      const data = JSON.parse(json);
      extractLdTypes(data, structuredDataTypes);
    } catch {}
  }

  return {
    url: finalUrl,
    statusCode,
    loadTimeMs: loadTime,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    metaKeywords,
    canonical,
    h1: h1s,
    h2: h2s,
    h3Count,
    imgTotal: imgs.length,
    imgWithoutAlt,
    internalLinks,
    externalLinks,
    nofollowLinks,
    hasViewport: /name=["']viewport["']/i.test(html),
    hasCharset: /charset/i.test(html),
    hasOgTitle: !!extractProperty(html, "og:title"),
    hasOgDescription: !!extractProperty(html, "og:description"),
    hasOgImage: !!ogImageUrl,
    hasTwitterCard: !!extractMetaAttr(html, "twitter:card") || !!extractProperty(html, "twitter:card"),
    hasRobotsMeta: extractMetaAttr(html, "robots"),
    hasHreflang: /hreflang/i.test(html),
    hasStructuredData: ldJsonMatches.length > 0,
    structuredDataTypes,
    wordCount,
    htmlSize: html.length,
    headings,
    xRobotsTag: headers["x-robots-tag"] || null,
    contentType: headers["content-type"] || null,
    isHttps,
    lang,
    hasFavicon,
    textToHtmlRatio,
    urlDepth,
    urlLength,
    hasDeprecatedTags,
    hasIframes,
    inlineCssSize,
    inlineJsSize,
    hasGzip,
    hasCacheControl,
    hasHsts,
    redirectCount,
    redirectIsWww,
    duplicateH1,
    duplicateDescription,
    ogImageUrl,
  };
}

function extractLdTypes(data: Record<string, unknown>, types: string[]) {
  if (!data || typeof data !== "object") return;
  if (data["@type"]) {
    const t = data["@type"];
    if (Array.isArray(t)) t.forEach((v: string) => { if (!types.includes(v)) types.push(v); });
    else if (typeof t === "string" && !types.includes(t)) types.push(t);
  }
  if (Array.isArray(data["@graph"])) {
    for (const item of data["@graph"]) extractLdTypes(item, types);
  }
  if (Array.isArray(data)) {
    for (const item of data) extractLdTypes(item, types);
  }
}

function extractMeta(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function getAttr(tag: string, attr: string): string | null {
  const r1 = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, "i");
  const m1 = tag.match(r1);
  if (m1) return m1[1];
  const r2 = new RegExp(`${attr}\\s*=\\s*'([^']*)'`, "i");
  const m2 = tag.match(r2);
  if (m2) return m2[1];
  return null;
}

function extractMetaAttr(html: string, name: string): string | null {
  const metaTags = html.match(/<meta[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const nameVal = getAttr(tag, "name");
    if (nameVal && nameVal.toLowerCase() === name.toLowerCase()) {
      const content = getAttr(tag, "content");
      return content?.trim() || null;
    }
  }
  return null;
}

function extractProperty(html: string, prop: string): string | null {
  const metaTags = html.match(/<meta[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const propVal = getAttr(tag, "property");
    if (propVal && propVal.toLowerCase() === prop.toLowerCase()) {
      const content = getAttr(tag, "content");
      return content?.trim() || null;
    }
  }
  return null;
}

function extractMetaLink(html: string, rel: string): string | null {
  const r = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i");
  const m = html.match(r);
  return m ? m[1].trim() : null;
}

function extractAll(html: string, regex: RegExp): string[] {
  const results: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) results.push(text);
  }
  return results;
}

async function analyzeSeo(apiKey: string, p: ParsedSeo): Promise<string> {
  // 한글 비율 감지
  const textSample = p.title || p.metaDescription || "";
  const koreanChars = textSample.match(/[\uac00-\ud7af]/g) || [];
  const isKorean = koreanChars.length / (textSample.length || 1) > 0.3;
  const titleMax = isKorean ? 40 : 60;
  const descMax = isKorean ? 80 : 160;

  // 항목별 사전 판정
  const checks = {
    https: p.isHttps,
    status: p.statusCode === 200,
    speed: p.loadTimeMs < 3000,
    title: !!p.title && p.titleLength >= 15 && p.titleLength <= titleMax,
    desc: !!p.metaDescription && p.metaDescriptionLength >= 40 && p.metaDescriptionLength <= descMax,
    canonical: !!p.canonical,
    viewport: p.hasViewport,
    charset: p.hasCharset,
    lang: !!p.lang,
    favicon: p.hasFavicon,
    h1: p.h1.length === 1,
    h2: p.h2.length > 0,
    ogTags: p.hasOgTitle && p.hasOgDescription && p.hasOgImage,
    twitter: p.hasTwitterCard,
    jsonLd: p.hasStructuredData,
    gzip: p.hasGzip,
    hsts: p.hasHsts,
    imgAlt: p.imgTotal === 0 || p.imgWithoutAlt === 0,
    urlDepth: p.urlDepth <= 3,
  };
  const passCount = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  const autoScore = Math.round((passCount / totalChecks) * 100);

  const systemPrompt = `당신은 온페이지 SEO 전문 감사관입니다.

## 채점 규칙
- 기본 점수는 ${autoScore}점입니다 (${passCount}/${totalChecks} 항목 통과).
- 이 점수를 기준으로 ±10점 범위 내에서 조정하세요.
- 아래 "사전 판정" 테이블에서 "양호"인 항목은 절대 "개선 필요"에 넣지 마세요.

## 판정 기준 (${isKorean ? "한글" : "영문"} 사이트)
| 항목 | 양호 기준 | 현재 값 | 판정 |
|------|----------|---------|------|
| HTTPS | https | ${p.isHttps ? "O" : "X"} | ${checks.https ? "양호" : "개선"} |
| 상태코드 | 200 | ${p.statusCode} | ${checks.status ? "양호" : "개선"} |
| 로딩시간 | <3000ms | ${p.loadTimeMs}ms | ${checks.speed ? "양호" : "개선"} |
| Title | 15~${titleMax}자 | ${p.titleLength}자 | ${checks.title ? "양호" : "개선"} |
| Description | 40~${descMax}자 | ${p.metaDescriptionLength}자 | ${checks.desc ? "양호" : "개선"} |
| Canonical | 있음 | ${p.canonical ? "O" : "X"} | ${checks.canonical ? "양호" : "개선"} |
| H1 | 정확히 1개 | ${p.h1.length}개 | ${checks.h1 ? "양호" : "개선"} |
| OG 태그 | 3개 모두 | title=${p.hasOgTitle ? "O" : "X"} desc=${p.hasOgDescription ? "O" : "X"} img=${p.hasOgImage ? "O" : "X"} | ${checks.ogTags ? "양호" : "개선"} |
| JSON-LD | 있음 | ${p.hasStructuredData ? p.structuredDataTypes.join(",") : "X"} | ${checks.jsonLd ? "양호" : "개선"} |
| Gzip | 있음 | ${p.hasGzip ? "O" : "X"} | ${checks.gzip ? "양호" : "개선"} |

## 프레임워크 특성 (무시할 항목)
- 텍스트/HTML 비율이 10% 미만이고 단어 수가 300 이상이면 → Next.js/Nuxt.js SSR 하이드레이션 때문. 실제 SEO 문제가 아님.
- 인라인 JS가 50KB 이상이어도 __NEXT_DATA__ 등 프레임워크 데이터면 줄일 수 없는 구조. 경고 불필요.
- Cache-Control이 no-cache여도 dynamic SSR 페이지의 정상 동작.

## 응답 형식
한국어로 아래 형식을 정확히 따르세요. 각 섹션은 3~5개 항목만 작성하세요.`;

  const userPrompt = `아래 사이트를 분석해주세요.

**URL:** ${p.url}

**파싱 데이터:**
- 상태코드: ${p.statusCode} | 로딩: ${p.loadTimeMs}ms | HTML: ${(p.htmlSize / 1024).toFixed(1)}KB | 단어: ${p.wordCount}
- HTTPS: ${p.isHttps ? "O" : "X"} | 리다이렉트: ${p.redirectCount > 0 ? (p.redirectIsWww ? "www정규화" : p.redirectCount + "회") : "없음"}
- 텍스트/HTML: ${p.textToHtmlRatio}% | URL깊이: ${p.urlDepth}단계

**메타:** Title="${p.title || ""}"(${p.titleLength}자) | Desc="${(p.metaDescription || "").slice(0, 60)}"(${p.metaDescriptionLength}자)
Keywords: ${p.metaKeywords ? p.metaKeywords.split(",").length + "개" : "없음"} | Canonical: ${p.canonical ? "O" : "X"} | Robots: ${p.hasRobotsMeta || "없음"} | Lang: ${p.lang || "X"}

**구조:** H1=${p.h1.length}개 H2=${p.h2.length}개 H3=${p.h3Count}개 | 중복H1: ${p.duplicateH1 ? "O" : "X"}

**링크:** 내부=${p.internalLinks} 외부=${p.externalLinks} nofollow=${p.nofollowLinks} | 이미지=${p.imgTotal} alt미설정=${p.imgWithoutAlt} | iframe=${p.hasIframes}

**기술:** Viewport=${p.hasViewport ? "O" : "X"} Charset=${p.hasCharset ? "O" : "X"} Favicon=${p.hasFavicon ? "O" : "X"} Gzip=${p.hasGzip ? "O" : "X"} HSTS=${p.hasHsts ? "O" : "X"}
인라인CSS=${(p.inlineCssSize / 1024).toFixed(1)}KB 인라인JS=${(p.inlineJsSize / 1024).toFixed(1)}KB | Deprecated: ${p.hasDeprecatedTags.length > 0 ? p.hasDeprecatedTags.join(",") : "없음"}

**소셜:** OG(title=${p.hasOgTitle ? "O" : "X"} desc=${p.hasOgDescription ? "O" : "X"} img=${p.hasOgImage ? "O" : "X"}) Twitter=${p.hasTwitterCard ? "O" : "X"}
JSON-LD: ${p.hasStructuredData ? p.structuredDataTypes.join(", ") : "없음"} | Hreflang: ${p.hasHreflang ? "O" : "X"}

## SEO 점수: [${autoScore}점 기준 ±10 조정]

### 잘된 점
- (양호 판정 항목 중 핵심 3~5개, 구체적 수치 포함)

### 개선 필요
- (개선 판정 항목만, 구체적 수치와 실행 가능한 방법 포함)

### 핵심 권장사항
1. (우선순위 높은 순, 최대 5개, 구체적 액션)`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "분석 결과를 생성하지 못했습니다.";
}
