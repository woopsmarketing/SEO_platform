import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
      return NextResponse.json({ error: "올바른 URL을 입력해주세요." }, { status: 400 });
    }

    // 1. 페이지 가져오기
    let html: string;
    let statusCode: number;
    let headers: Record<string, string> = {};
    let loadTime: number;

    try {
      const start = Date.now();
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "SEOWorld-AuditBot/1.0", Accept: "text/html" },
        redirect: "follow",
      });
      loadTime = Date.now() - start;
      statusCode = res.status;
      headers = Object.fromEntries(res.headers.entries());
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다. URL을 확인해주세요." }, { status: 400 });
    }

    // 2. HTML 파싱 — 주요 SEO 요소 추출
    const parsed = parseHtml(html, url, statusCode, loadTime, headers);

    // 3. LLM 분석
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // API 키 없으면 파싱 결과만 반환
      return NextResponse.json({ parsed, analysis: null, error: "LLM 분석 키가 설정되지 않았습니다." });
    }

    const analysis = await analyzeSeo(apiKey, parsed, url);

    // 툴 사용 로그
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.from("tool_usage_logs").insert({
      tool_type: "onpage-audit",
      input_summary: url,
    });

    return NextResponse.json({ parsed, analysis });
  } catch (e) {
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
  canonical: string | null;
  h1: string[];
  h2: string[];
  h3Count: number;
  imgTotal: number;
  imgWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasViewport: boolean;
  hasCharset: boolean;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasTwitterCard: boolean;
  hasRobotsMeta: string | null;
  hasHreflang: boolean;
  hasStructuredData: boolean;
  wordCount: number;
  htmlSize: number;
  headings: string;
  xRobotsTag: string | null;
  contentType: string | null;
}

function parseHtml(html: string, url: string, statusCode: number, loadTime: number, headers: Record<string, string>): ParsedSeo {
  const title = extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i);
  const metaDescription = extractMetaAttr(html, "description");
  const canonical = extractMetaLink(html, "canonical");

  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2s = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

  const imgs = html.match(/<img[^>]*>/gi) || [];
  const imgWithoutAlt = imgs.filter((img) => !img.match(/alt=["'][^"']+["']/i)).length;

  const allLinks = html.match(/href=["']([^"']+)["']/gi) || [];
  let internalLinks = 0;
  let externalLinks = 0;
  const origin = new URL(url).origin;

  for (const link of allLinks) {
    const href = link.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    try {
      const resolved = new URL(href, url);
      if (resolved.origin === origin) internalLinks++;
      else externalLinks++;
    } catch {
      continue;
    }
  }

  const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;

  const headings = [
    ...h1s.map((h) => `H1: ${h}`),
    ...h2s.map((h) => `H2: ${h}`),
  ].slice(0, 15).join("\n");

  return {
    url,
    statusCode,
    loadTimeMs: loadTime,
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    canonical,
    h1: h1s,
    h2: h2s,
    h3Count,
    imgTotal: imgs.length,
    imgWithoutAlt,
    internalLinks,
    externalLinks,
    hasViewport: /name=["']viewport["']/i.test(html),
    hasCharset: /charset/i.test(html),
    hasOgTitle: /property=["']og:title["']/i.test(html),
    hasOgDescription: /property=["']og:description["']/i.test(html),
    hasOgImage: /property=["']og:image["']/i.test(html),
    hasTwitterCard: /name=["']twitter:card["']/i.test(html),
    hasRobotsMeta: extractMetaAttr(html, "robots"),
    hasHreflang: /hreflang/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
    wordCount,
    htmlSize: html.length,
    headings,
    xRobotsTag: headers["x-robots-tag"] || null,
    contentType: headers["content-type"] || null,
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

function extractMetaLink(html: string, rel: string): string | null {
  const regex = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : null;
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

async function analyzeSeo(apiKey: string, parsed: ParsedSeo, url: string): Promise<string> {
  const prompt = `You are an SEO expert auditor. Analyze this webpage's SEO and provide actionable recommendations.

**URL:** ${url}

**Parsed SEO Data:**
- Status Code: ${parsed.statusCode}
- Load Time: ${parsed.loadTimeMs}ms
- HTML Size: ${(parsed.htmlSize / 1024).toFixed(1)}KB
- Word Count: ${parsed.wordCount}

**Title:** ${parsed.title || "(없음)"}  (${parsed.titleLength}자)
**Meta Description:** ${parsed.metaDescription || "(없음)"}  (${parsed.metaDescriptionLength}자)
**Canonical:** ${parsed.canonical || "(없음)"}

**Headings:**
- H1: ${parsed.h1.length}개 ${parsed.h1.length > 0 ? `→ "${parsed.h1[0]}"` : ""}
- H2: ${parsed.h2.length}개
- H3: ${parsed.h3Count}개

**Images:** 총 ${parsed.imgTotal}개, alt 미설정 ${parsed.imgWithoutAlt}개
**Links:** 내부 ${parsed.internalLinks}개, 외부 ${parsed.externalLinks}개

**Technical:**
- Viewport meta: ${parsed.hasViewport ? "O" : "X"}
- Charset: ${parsed.hasCharset ? "O" : "X"}
- Robots meta: ${parsed.hasRobotsMeta || "(없음)"}
- X-Robots-Tag: ${parsed.xRobotsTag || "(없음)"}
- Structured Data (JSON-LD): ${parsed.hasStructuredData ? "O" : "X"}
- Hreflang: ${parsed.hasHreflang ? "O" : "X"}

**Social:**
- OG Title: ${parsed.hasOgTitle ? "O" : "X"}
- OG Description: ${parsed.hasOgDescription ? "O" : "X"}
- OG Image: ${parsed.hasOgImage ? "O" : "X"}
- Twitter Card: ${parsed.hasTwitterCard ? "O" : "X"}

**Heading Structure:**
${parsed.headings || "(없음)"}

Please respond in Korean. Use this exact format:

## SEO 점수: [0-100점]

### 잘된 점
- (bullet points)

### 개선 필요
- (bullet points with specific, actionable recommendations)

### 핵심 권장사항
1. (numbered, prioritized top 3-5 actions)

Keep it concise and practical. Focus on the most impactful issues.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "분석 결과를 생성하지 못했습니다.";
}
