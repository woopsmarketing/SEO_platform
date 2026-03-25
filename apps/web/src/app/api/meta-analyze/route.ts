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

async function getRecommendation(apiKey: string, p: ParsedMeta): Promise<MetaRecommendation | null> {
  const prompt = `You are an SEO expert. Analyze the current meta tags of this webpage and provide optimized recommendations.

**URL:** ${p.url}
**Current Title:** ${p.title || "(없음)"} (${p.titleLength}자)
**Current Description:** ${p.metaDescription || "(없음)"} (${p.metaDescriptionLength}자)
**Current Keywords:** ${p.metaKeywords || "(없음)"}
**Canonical:** ${p.canonical || "(없음)"}
**Lang:** ${p.lang || "(없음)"}
**OG Title:** ${p.ogTitle || "(없음)"}
**OG Description:** ${p.ogDescription || "(없음)"}
**OG Image:** ${p.ogImage || "(없음)"}
**OG Type:** ${p.ogType || "(없음)"}
**Twitter Card:** ${p.twitterCard || "(없음)"}
**Structured Data:** ${p.structuredDataTypes.join(", ") || "(없음)"}
**Robots:** ${p.robots || "(없음)"}

Respond in Korean with this exact JSON format (no markdown, just raw JSON):
{
  "title": "최적화된 제목 (50-60자, 핵심 키워드 포함)",
  "description": "최적화된 설명 (120-155자, CTA 포함)",
  "keywords": "추천 키워드1, 키워드2, 키워드3, 키워드4, 키워드5",
  "ogTitle": "OG용 제목 (현재와 다르면 변경, 같으면 그대로)",
  "ogDescription": "OG용 설명",
  "ogType": "website 또는 article 등 적절한 타입",
  "twitterCard": "summary_large_image 또는 summary",
  "issues": ["발견된 문제 1", "발견된 문제 2"],
  "improvements": ["개선 제안 1", "개선 제안 2"]
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
