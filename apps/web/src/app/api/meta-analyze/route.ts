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
    // 로그인 유저는 무제한, 비로그인은 IP당 하루 3회
    const { checkRateLimit, getClientIp, isAuthenticated } = await import("@/lib/rate-limit");
    const loggedIn = await isAuthenticated(request);
    if (!loggedIn) {
      const ip = getClientIp(request);
      const rateLimit = await checkRateLimit(ip, "meta-analyzer", 3, 1440);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: "일일 무료 분석 횟수(3회)를 초과했습니다.", upgrade: true, remaining: 0 },
          { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
        );
      }
    }

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
    const adminSupabase = createAdminClient();
    await adminSupabase.from("tool_usage_logs").insert({
      tool_type: "meta-analyzer",
      input_summary: url,
    });

    // 로그인 사용자면 analyses 테이블에도 저장
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const userSupabase = await createClient();
      const { data: { user } } = await userSupabase.auth.getUser();
      if (user) {
        const summary = {
          title: parsed.title,
          titleLength: parsed.titleLength,
          description: parsed.metaDescription,
          descriptionLength: parsed.metaDescriptionLength,
          hasCanonical: !!parsed.canonical,
          hasOgTitle: !!parsed.ogTitle,
          hasOgDescription: !!parsed.ogDescription,
          hasOgImage: !!parsed.ogImage,
          hasTwitterCard: !!parsed.twitterCard,
          hasJsonLd: parsed.hasStructuredData,
          lang: parsed.lang,
          issuesCount: recommendation?.issues?.length ?? 0,
        };
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "meta-analyzer",
          input_summary: url,
          score: null,
          input: { url },
          result: { summary, recommendation },
        });
      }
    } catch {
      // 세션 확인 실패 시 무시 (비로그인 사용자)
    }

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

  // Structured Data — head뿐 아니라 전체 HTML에서 검색 + @graph 배열 대응
  const fullHtml = headMatch ? headMatch[0] + (html.match(/<body[\s\S]*<\/body>/i)?.[0] || "") : html;
  const ldJsonMatches = fullHtml.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const structuredDataTypes: string[] = [];
  for (const match of ldJsonMatches) {
    try {
      const json = match.replace(/<script[^>]*>|<\/script>/gi, "");
      const data = JSON.parse(json);
      extractLdTypes(data, structuredDataTypes);
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

  // 프론트엔드 진단과 동일한 기준 사용
  const titleMin = isKorean ? 15 : 30;
  const titleMax = isKorean ? 40 : 60;
  const descMin = isKorean ? 40 : 80;
  const descMax = isKorean ? 80 : 160;
  const langLabel = isKorean ? "한글" : "영문";

  // 현재 상태 판정
  const titleOk = !!p.title && p.titleLength >= titleMin && p.titleLength <= titleMax;
  const descOk = !!p.metaDescription && p.metaDescriptionLength >= descMin && p.metaDescriptionLength <= descMax;
  const keywordsCount = p.metaKeywords ? p.metaKeywords.split(",").length : 0;
  const keywordsOk = keywordsCount >= 3 && keywordsCount <= 10;

  const prompt = `당신은 SEO 전문가입니다. 아래 웹페이지의 메타태그를 분석하고 최적화 추천을 해주세요.

## 판정 기준 (이 기준을 반드시 따르세요)

| 항목 | ${langLabel} 기준 | 현재 값 | 판정 |
|------|----------|---------|------|
| Title | ${titleMin}~${titleMax}자 | ${p.titleLength}자 | ${titleOk ? "양호" : "개선필요"} |
| Description | ${descMin}~${descMax}자 | ${p.metaDescriptionLength}자 | ${descOk ? "양호" : "개선필요"} |
| Keywords | 5~10개 | ${keywordsCount}개 | ${keywordsOk ? "양호" : "개선필요"} |

## 핵심 규칙

1. **양호 판정된 항목은 현재 값을 그대로 유지하세요.** 양호한 title을 다른 값으로 바꾸지 마세요.
2. **양호 판정된 항목을 issues나 improvements에 넣지 마세요.** 범위 안에 있으면 문제가 아닙니다.
3. issues에는 **실제로 개선이 필요한 항목만** 넣으세요. 양호한 항목을 "초과했습니다"라고 쓰면 안 됩니다.
4. improvements에는 **실행 가능한 구체적 제안만** 넣으세요. 양호한 항목에 대한 제안은 불필요합니다.
5. 모든 항목이 양호하면 issues를 빈 배열로, improvements에는 "현재 메타태그가 잘 최적화되어 있습니다" 하나만 넣으세요.

## 현재 메타태그

**URL:** ${p.url}
**Title:** ${p.title || "(없음)"} (${p.titleLength}자)
**Description:** ${p.metaDescription || "(없음)"} (${p.metaDescriptionLength}자)
**Keywords:** ${p.metaKeywords || "(없음)"} (${keywordsCount}개)
**Canonical:** ${p.canonical || "(없음)"}
**Lang:** ${p.lang || "(없음)"}
**OG Title:** ${p.ogTitle || "(없음)"}
**OG Description:** ${p.ogDescription || "(없음)"}
**OG Image:** ${p.ogImage || "(없음)"}
**OG Type:** ${p.ogType || "(없음)"}
**Twitter Card:** ${p.twitterCard || "(없음)"}
**Structured Data:** ${p.structuredDataTypes.join(", ") || "(없음)"}
**Robots:** ${p.robots || "(없음)"}

## JSON 응답 규칙

- title: ${titleOk ? "현재 제목을 그대로 사용하세요" : `${titleMin}~${titleMax}자 범위로 작성`}
- description: ${descOk ? "현재 설명을 그대로 사용하세요" : `${descMin}~${descMax}자 범위로 작성, CTA 포함`}
- keywords: ${keywordsOk ? "현재 키워드를 그대로 사용하세요" : "5~7개로 제한"}
- ogTitle/ogDescription: OG 태그가 있으면 그대로 유지, 없으면 title/description 기반으로 생성
- issues/improvements: 양호 항목은 제외, 실제 문제만 포함

한국어로 응답하세요. 아래 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "title": "제목",
  "description": "설명",
  "keywords": "키워드1, 키워드2, 키워드3",
  "ogTitle": "OG 제목",
  "ogDescription": "OG 설명",
  "ogType": "website",
  "twitterCard": "summary_large_image",
  "issues": [],
  "improvements": []
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
        max_tokens: 2000,
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
