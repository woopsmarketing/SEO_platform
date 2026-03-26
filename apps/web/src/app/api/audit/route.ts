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

  // 중복 H1
  const duplicateH1 = h1s.length > 1;

  // 중복 description
  const descMetas = (html.match(/<meta[^>]*name=["']description["'][^>]*>/gi) || []);
  const duplicateDescription = descMetas.length > 1;

  // OG image URL
  const ogImageUrl = extractProperty(html, "og:image");

  // 구조화 데이터 타입
  const ldJsonMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const structuredDataTypes: string[] = [];
  for (const match of ldJsonMatches) {
    try {
      const json = match.replace(/<script[^>]*>|<\/script>/gi, "");
      const data = JSON.parse(json);
      if (data["@type"]) structuredDataTypes.push(data["@type"]);
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
    duplicateH1,
    duplicateDescription,
    ogImageUrl,
  };
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
  const prompt = `당신은 SEO 전문 감사관입니다. 아래 파싱 데이터를 기반으로 실행 가능한 개선안을 제시하세요.

**URL:** ${p.url}

**기본 정보:**
- 상태 코드: ${p.statusCode} | 로딩 시간: ${p.loadTimeMs}ms | HTML: ${(p.htmlSize / 1024).toFixed(1)}KB | 단어 수: ${p.wordCount}
- HTTPS: ${p.isHttps ? "O" : "X"} | 리다이렉트: ${p.redirectCount > 0 ? `${p.redirectCount}회` : "없음"}
- 텍스트/HTML 비율: ${p.textToHtmlRatio}% | URL 깊이: ${p.urlDepth}단계 (${p.urlLength}자)

**메타 태그:**
- Title: ${p.title || "(없음)"} (${p.titleLength}자)
- Description: ${p.metaDescription || "(없음)"} (${p.metaDescriptionLength}자)
- Keywords: ${p.metaKeywords || "(없음)"}
- Canonical: ${p.canonical || "(없음)"}
- Robots: ${p.hasRobotsMeta || "(없음)"} | X-Robots-Tag: ${p.xRobotsTag || "(없음)"}
- 중복 Description: ${p.duplicateDescription ? "O — 문제" : "X"}
- Lang: ${p.lang || "(없음)"} | Favicon: ${p.hasFavicon ? "O" : "X"}

**제목 구조:**
- H1: ${p.h1.length}개${p.h1.length > 0 ? ` → "${p.h1[0]}"` : ""} ${p.duplicateH1 ? "(중복 H1!)" : ""}
- H2: ${p.h2.length}개 | H3: ${p.h3Count}개

**이미지/링크:**
- 이미지: ${p.imgTotal}개, alt 미설정: ${p.imgWithoutAlt}개
- 내부 링크: ${p.internalLinks}개 | 외부 링크: ${p.externalLinks}개 | nofollow: ${p.nofollowLinks}개
- iframe: ${p.hasIframes}개

**기술:**
- Viewport: ${p.hasViewport ? "O" : "X"} | Charset: ${p.hasCharset ? "O" : "X"}
- JSON-LD: ${p.hasStructuredData ? p.structuredDataTypes.join(", ") : "X"}
- Hreflang: ${p.hasHreflang ? "O" : "X"}
- Gzip/Brotli: ${p.hasGzip ? "O" : "X"} | HSTS: ${p.hasHsts ? "O" : "X"}
- Cache-Control: ${p.hasCacheControl || "(없음)"}
- 인라인 CSS: ${(p.inlineCssSize / 1024).toFixed(1)}KB | 인라인 JS: ${(p.inlineJsSize / 1024).toFixed(1)}KB
- Deprecated 태그: ${p.hasDeprecatedTags.length > 0 ? p.hasDeprecatedTags.join(", ") : "없음"}

**소셜:**
- OG: title=${p.hasOgTitle ? "O" : "X"}, desc=${p.hasOgDescription ? "O" : "X"}, image=${p.hasOgImage ? "O" : "X"}${p.ogImageUrl ? ` (${p.ogImageUrl})` : ""}
- Twitter Card: ${p.hasTwitterCard ? "O" : "X"}

**Heading 구조:**
${p.headings || "(없음)"}

한국어로 응답하세요. 아래 형식을 정확히 따르세요:

## SEO 점수: [0-100점]

### 잘된 점
- (구체적 항목과 수치 포함)

### 개선 필요
- (구체적 수치와 실행 가능한 권장사항)

### 핵심 권장사항
1. (우선순위 높은 순, 최대 5개)

간결하고 실용적으로 작성하세요.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "분석 결과를 생성하지 못했습니다.";
}
