import { NextResponse } from "next/server";

export const maxDuration = 30;

export interface ParsedMeta {
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
  headRaw: string;
}

export interface MetaRecommendation {
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

    let html: string;
    let statusCode: number;

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)", Accept: "text/html" },
        redirect: "follow",
      });
      statusCode = res.status;
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다. URL을 확인해주세요." }, { status: 400 });
    }

    const parsed = parseHead(html, url, statusCode);

    // AI 추천
    const apiKey = process.env.OPENAI_API_KEY;
    let recommendation: MetaRecommendation | null = null;

    if (apiKey) {
      recommendation = await getRecommendation(apiKey, parsed);
    }

    // 툴 사용 로그
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("tool_usage_logs").insert({
      tool_type: "meta-generator",
      input_summary: url,
    });

    return NextResponse.json({ parsed, recommendation });
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}

function parseHead(html: string, url: string, statusCode: number): ParsedMeta {
  // <head> 섹션 추출
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : html;

  const title = extractTag(head, /<title[^>]*>([^<]*)<\/title>/i);
  const metaDescription = extractMetaContent(head, "description");
  const metaKeywords = extractMetaContent(head, "keywords");
  const canonical = extractLinkHref(head, "canonical");
  const robots = extractMetaContent(head, "robots");
  const author = extractMetaContent(head, "author");
  const viewport = extractMetaContent(head, "viewport");

  // charset
  const charsetMatch = head.match(/<meta[^>]*charset=["']?([^"'\s>]+)/i);
  const charset = charsetMatch ? charsetMatch[1] : null;

  // lang
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : null;

  // favicon
  const faviconMatch = head.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i)
    || head.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon)["']/i);
  const favicon = faviconMatch ? resolveUrl(faviconMatch[1], url) : null;

  // Open Graph
  const ogTitle = extractProperty(head, "og:title");
  const ogDescription = extractProperty(head, "og:description");
  const ogImage = extractProperty(head, "og:image");
  const ogUrl = extractProperty(head, "og:url");
  const ogType = extractProperty(head, "og:type");
  const ogLocale = extractProperty(head, "og:locale");
  const ogSiteName = extractProperty(head, "og:site_name");

  // Twitter
  const twitterCard = extractMetaContent(head, "twitter:card") || extractProperty(head, "twitter:card");
  const twitterTitle = extractMetaContent(head, "twitter:title") || extractProperty(head, "twitter:title");
  const twitterDescription = extractMetaContent(head, "twitter:description") || extractProperty(head, "twitter:description");
  const twitterImage = extractMetaContent(head, "twitter:image") || extractProperty(head, "twitter:image");
  const twitterSite = extractMetaContent(head, "twitter:site") || extractProperty(head, "twitter:site");

  // Structured Data
  const ldJsonMatches = head.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const structuredDataTypes: string[] = [];
  for (const match of ldJsonMatches) {
    try {
      const json = match.replace(/<script[^>]*>|<\/script>/gi, "");
      const data = JSON.parse(json);
      if (data["@type"]) structuredDataTypes.push(data["@type"]);
    } catch {}
  }

  // Hreflang
  const alternateLinks: { hreflang: string; href: string }[] = [];
  const hreflangRegex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let hMatch;
  while ((hMatch = hreflangRegex.exec(head)) !== null) {
    alternateLinks.push({ hreflang: hMatch[1], href: hMatch[2] });
  }

  return {
    url,
    statusCode,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    metaKeywords,
    canonical,
    robots,
    author,
    charset,
    viewport,
    lang,
    favicon,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    ogLocale,
    ogSiteName,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite,
    hasStructuredData: ldJsonMatches.length > 0,
    structuredDataTypes,
    alternateLinks,
    headRaw: head.slice(0, 5000),
  };
}

function extractTag(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

// 모든 <meta> 태그에서 속성을 파싱하는 범용 함수
function getAttr(tag: string, attr: string): string | null {
  // 따옴표 있는 경우: attr="value" 또는 attr='value'
  const r1 = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, "i");
  const m1 = tag.match(r1);
  if (m1) return m1[1];
  const r2 = new RegExp(`${attr}\\s*=\\s*'([^']*)'`, "i");
  const m2 = tag.match(r2);
  if (m2) return m2[1];
  return null;
}

function extractMetaContent(html: string, name: string): string | null {
  // 모든 <meta ...> 태그를 순회하며 name 속성이 일치하는 것을 찾음
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

function extractLinkHref(html: string, rel: string): string | null {
  const r = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i");
  const m = html.match(r);
  return m ? m[1].trim() : null;
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

// 한글 비율 감지 — 한글이 30% 이상이면 한글 기준 적용
function detectKoreanRatio(text: string): number {
  if (!text) return 0;
  const korean = text.match(/[\uac00-\ud7af]/g) || [];
  return korean.length / text.length;
}

async function getRecommendation(apiKey: string, p: ParsedMeta): Promise<MetaRecommendation | null> {
  const isKorean = detectKoreanRatio(p.title || p.metaDescription || "") > 0.3;
  const titleRange = isKorean ? "20~35자 (한글 기준)" : "50~60자 (영문 기준)";
  const descRange = isKorean ? "45~75자 (한글 기준)" : "120~155자 (영문 기준)";

  const prompt = `당신은 SEO 전문가입니다. 아래 웹페이지의 메타태그를 분석하고 최적화 추천을 해주세요.

## Google 공식 가이드 기반 기준

### Title (제목 링크)
- Google은 검색결과에서 title을 약 600px 너비로 표시합니다.
- 한글은 글자당 약 16~18px, 영문은 약 8~10px를 차지합니다.
- 따라서 한글 제목은 약 30~35자, 영문은 약 55~60자가 적절합니다.
- 핵심 키워드를 제목 앞부분에 배치하세요.
- 브랜드명은 끝에 "| 브랜드" 형태로 추가하세요.

### Description (메타 설명)
- Google은 검색결과에서 description을 약 920px 너비(데스크톱 기준)로 표시합니다.
- 한글 기준 약 70~80자, 영문 기준 약 150~160자까지 표시됩니다.
- CTA(행동 유도 문구)를 포함하면 클릭률이 올라갑니다.
- 핵심 키워드를 자연스럽게 포함하되 키워드 남용은 피하세요.

### Keywords
- Google은 meta keywords를 랭킹에 사용하지 않습니다.
- 하지만 Naver, Daum 등 국내 검색엔진에서는 참고합니다.
- 5~10개가 적절하며, 페이지 내용과 직접 관련된 키워드만 넣으세요.

## 현재 메타태그 분석 대상

**URL:** ${p.url}
**현재 Title:** ${p.title || "(없음)"} (${p.titleLength}자)
**현재 Description:** ${p.metaDescription || "(없음)"} (${p.metaDescriptionLength}자)
**현재 Keywords:** ${p.metaKeywords || "(없음)"}
**Canonical:** ${p.canonical || "(없음)"}
**Lang:** ${p.lang || "(없음)"}
**OG Title:** ${p.ogTitle || "(없음)"}
**OG Description:** ${p.ogDescription || "(없음)"}
**OG Image:** ${p.ogImage || "(없음)"}
**OG Type:** ${p.ogType || "(없음)"}
**Twitter Card:** ${p.twitterCard || "(없음)"}
**Structured Data:** ${p.structuredDataTypes.join(", ") || "(없음)"}
**Robots:** ${p.robots || "(없음)"}
**한글 사이트 여부:** ${isKorean ? "예 (한글 기준 적용)" : "아니오 (영문 기준 적용)"}

## 응답 규칙

1. issues와 improvements에는 반드시 **구체적인 수치와 근거**를 포함하세요.
   - 나쁜 예: "메타 설명이 너무 짧음"
   - 좋은 예: "메타 설명이 ${p.metaDescriptionLength}자로 권장 범위(${descRange})보다 짧습니다. 클릭을 유도하는 CTA를 추가하세요."
2. 추천 title은 ${titleRange} 범위로 작성하세요.
3. 추천 description은 ${descRange} 범위로 작성하세요.
4. keywords는 5~7개로 제한하세요.

한국어로 응답하세요. 아래 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "title": "최적화된 제목",
  "description": "최적화된 설명",
  "keywords": "키워드1, 키워드2, 키워드3, 키워드4, 키워드5",
  "ogTitle": "OG용 제목",
  "ogDescription": "OG용 설명",
  "ogType": "website 또는 article",
  "twitterCard": "summary_large_image 또는 summary",
  "issues": ["구체적 수치 포함 문제점"],
  "improvements": ["구체적 수치 포함 개선 제안"]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    // JSON 파싱 — 코드블록 감싸는 경우 대비
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
