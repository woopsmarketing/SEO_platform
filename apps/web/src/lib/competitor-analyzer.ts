/**
 * 경쟁사 비교 분석 모듈
 *
 * 1. Serper API로 구글 SERP 상위 경쟁사 URL 추출
 * 2. 각 경쟁사 + 고객 사이트 온페이지 크롤링
 * 3. OpenAI로 비교 분석 리포트 생성
 */

import { fetchWithCache, saveToCache, type DomainMetrics } from "./cache-api";

interface SerpResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface OnPageSummary {
  url: string;
  domain: string;
  statusCode: number;
  loadTimeMs: number;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  descriptionLength: number;
  h1: string[];
  h2Count: number;
  h3Count: number;
  wordCount: number;
  imgTotal: number;
  imgWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  isHttps: boolean;
  hasCanonical: boolean;
  hasViewport: boolean;
  hasOgTags: boolean;
  hasJsonLd: boolean;
  hasGzip: boolean;
  textToHtmlRatio: number;
  metrics?: DomainMetrics | null;
  error?: string;
}

export interface CompetitorAnalysisResult {
  customerSite: OnPageSummary;
  competitors: OnPageSummary[];
  serpResults: SerpResult[];
  aiReport: string;
  keyword: string;
  analyzedAt: string;
}

/**
 * Serper.dev API로 구글 검색 결과 가져오기.
 * 백링크샵 공용 캐시 → HIT이면 캐시 데이터, MISS이면 Serper 직접 호출 후 캐시 저장.
 * 캐시 스펙상 snippet/position은 저장되지 않으므로 HIT 시 빈 값/index로 채운다.
 * (snippet/position은 현재 AI 리포트·크롤링에 쓰이지 않아 기능 영향 없음)
 */
async function fetchSerpResults(keyword: string): Promise<SerpResult[]> {
  const cached = await fetchWithCache<Array<{ url: string; title: string }>>(
    "serp",
    { keyword },
  );
  if (cached && cached.length > 0) {
    return cached.map((item, i) => ({
      title: item.title,
      link: item.url,
      snippet: "",
      position: i + 1,
    }));
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) throw new Error("SERPER_API_KEY not set");

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: keyword,
      gl: "kr",
      hl: "ko",
      num: 10,
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status}`);
  }

  const data = await response.json();
  const organic = data.organic || [];

  const results: SerpResult[] = organic.map(
    (item: { title: string; link: string; snippet: string; position: number }, i: number) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet || "",
      position: item.position || i + 1,
    }),
  );

  if (results.length > 0) {
    await saveToCache("serp", {
      keyword,
      results: results.map((r) => ({ url: r.link, title: r.title })),
    });
  }

  return results;
}

/** URL에서 도메인 추출 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** 단일 URL 온페이지 크롤링 */
async function fetchOnPageSummary(url: string): Promise<OnPageSummary> {
  const domain = extractDomain(url);

  try {
    const start = Date.now();
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    const loadTimeMs = Date.now() - start;
    const html = await res.text();
    const headers = Object.fromEntries(res.headers.entries());

    // 간단 파싱
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : null;

    const h1s: string[] = [];
    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    let h1Match;
    while ((h1Match = h1Regex.exec(html)) !== null) {
      const text = h1Match[1].replace(/<[^>]+>/g, "").trim();
      if (text) h1s.push(text);
    }

    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

    const imgs = html.match(/<img[^>]*>/gi) || [];
    const imgWithoutAlt = imgs.filter((img) => !img.match(/alt=["'][^"']+["']/i)).length;

    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");
    const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;

    const textLength = textContent.replace(/\s+/g, "").length;
    const textToHtmlRatio = html.length > 0 ? Math.round((textLength / html.length) * 100) : 0;

    // 링크 카운트
    const origin = new URL(url).origin;
    const allLinks = html.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
    let internalLinks = 0;
    let externalLinks = 0;
    for (const tag of allLinks) {
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      if (!hrefMatch) continue;
      const href = hrefMatch[1];
      if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
      try {
        const resolved = new URL(href, url);
        if (resolved.origin === origin) internalLinks++;
        else externalLinks++;
      } catch { /* skip */ }
    }

    const encoding = headers["content-encoding"] || "";
    const hasGzip = /gzip|br|deflate/i.test(encoding);

    return {
      url,
      domain,
      statusCode: res.status,
      loadTimeMs,
      title,
      titleLength: title?.length ?? 0,
      metaDescription,
      descriptionLength: metaDescription?.length ?? 0,
      h1: h1s,
      h2Count,
      h3Count,
      wordCount,
      imgTotal: imgs.length,
      imgWithoutAlt,
      internalLinks,
      externalLinks,
      isHttps: url.startsWith("https"),
      hasCanonical: /<link[^>]*rel=["']canonical["']/i.test(html),
      hasViewport: /name=["']viewport["']/i.test(html),
      hasOgTags: /property=["']og:title["']/i.test(html) && /property=["']og:description["']/i.test(html),
      hasJsonLd: /application\/ld\+json/i.test(html),
      hasGzip,
      textToHtmlRatio,
    };
  } catch (err) {
    return {
      url,
      domain,
      statusCode: 0,
      loadTimeMs: 0,
      title: null,
      titleLength: 0,
      metaDescription: null,
      descriptionLength: 0,
      h1: [],
      h2Count: 0,
      h3Count: 0,
      wordCount: 0,
      imgTotal: 0,
      imgWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      isHttps: false,
      hasCanonical: false,
      hasViewport: false,
      hasOgTags: false,
      hasJsonLd: false,
      hasGzip: false,
      textToHtmlRatio: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** AI 비교 분석 리포트 생성 */
async function generateAiReport(
  keyword: string,
  customer: OnPageSummary,
  competitors: OnPageSummary[],
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const validCompetitors = competitors.filter((c) => !c.error && c.statusCode === 200);

  const fmtMetric = (v: number | string | undefined | null): string => {
    if (v == null) return "-";
    const n = typeof v === "string" ? parseFloat(v) : v;
    return Number.isFinite(n) ? String(Math.round(n)) : "-";
  };

  const competitorRows = validCompetitors
    .map(
      (c, i) =>
        `| ${i + 1} | ${c.domain} | ${c.title?.slice(0, 30) || "-"} | ${fmtMetric(c.metrics?.mozDA)} | ${fmtMetric(c.metrics?.ahrefsDR)} | ${c.wordCount} | ${c.h1.length > 0 ? "O" : "X"} | ${c.h2Count} | ${c.isHttps ? "O" : "X"} | ${c.hasOgTags ? "O" : "X"} | ${c.hasJsonLd ? "O" : "X"} | ${c.loadTimeMs}ms |`,
    )
    .join("\n");

  const systemPrompt = `당신은 10년 경력의 SEO 전문 컨설턴트입니다. 고객 사이트와 구글 검색 상위 경쟁사를 비교 분석합니다.

## 응답 규칙
1. 한국어로 작성
2. 구체적 수치 기반 비교 (추측 금지)
3. 각 섹션에서 고객 vs 경쟁사 평균/최고를 명확히 비교
4. 실행 가능한 개선 액션을 우선순위 순으로 제시
5. 마크다운 형식으로 작성`;

  const userPrompt = `키워드: "${keyword}"

## 고객 사이트
| 항목 | 값 |
|------|-----|
| URL | ${customer.url} |
| Moz DA / Ahrefs DR | ${fmtMetric(customer.metrics?.mozDA)} / ${fmtMetric(customer.metrics?.ahrefsDR)} |
| Title | ${customer.title || "없음"} (${customer.titleLength}자) |
| Description | ${customer.metaDescription?.slice(0, 60) || "없음"} (${customer.descriptionLength}자) |
| H1 | ${customer.h1.length}개${customer.h1[0] ? ` — "${customer.h1[0]}"` : ""} |
| H2 | ${customer.h2Count}개, H3 | ${customer.h3Count}개 |
| 단어 수 | ${customer.wordCount} |
| 로딩 시간 | ${customer.loadTimeMs}ms |
| HTTPS | ${customer.isHttps ? "O" : "X"} |
| OG Tags | ${customer.hasOgTags ? "O" : "X"} |
| JSON-LD | ${customer.hasJsonLd ? "O" : "X"} |
| Canonical | ${customer.hasCanonical ? "O" : "X"} |
| Gzip | ${customer.hasGzip ? "O" : "X"} |
| 이미지 | ${customer.imgTotal}개 (alt 미설정: ${customer.imgWithoutAlt}개) |
| 내부링크 | ${customer.internalLinks}개, 외부링크 | ${customer.externalLinks}개 |

## 경쟁사 TOP ${validCompetitors.length} (구글 "${keyword}" 검색 상위)
| # | 도메인 | Title(30자) | Moz DA | Ahrefs DR | 단어수 | H1 | H2 | HTTPS | OG | JSON-LD | 속도 |
|---|--------|------------|--------|-----------|--------|----|----|-------|-----|---------|------|
${competitorRows}

## 요청
아래 형식으로 비교 분석 리포트를 작성하세요:

### 종합 평가
- 고객 사이트의 현재 위치와 경쟁력을 2~3문장으로 요약

### 경쟁사 대비 강점
- 고객이 경쟁사보다 우수한 항목 (수치 비교 포함)

### 경쟁사 대비 약점
- 고객이 경쟁사보다 부족한 항목 (수치 비교 포함, 각 항목 2~3문장)

### 핵심 개선 액션 (우선순위 순)
1. **[항목]**: 현재 → 목표 + 구체적 방법
2. ...
3. ...

### 키워드 "${keyword}" 상위 노출을 위한 전략
- 콘텐츠, 기술 SEO, 링크 측면에서 각 1~2개 전략`;

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

/** 전체 경쟁사 분석 실행 */
export async function analyzeCompetitors(
  siteUrl: string,
  keyword: string,
): Promise<CompetitorAnalysisResult> {
  // 1. SERP 검색
  const serpResults = await fetchSerpResults(keyword);

  // 2. 고객 도메인 제외한 상위 5개 경쟁사 선택
  const customerDomain = extractDomain(siteUrl);
  const competitorUrls = serpResults
    .filter((r) => extractDomain(r.link) !== customerDomain)
    .slice(0, 5)
    .map((r) => r.link);

  // 3. 병렬 크롤링 (고객 + 경쟁사)
  const [customerSite, ...competitors] = await Promise.all([
    fetchOnPageSummary(siteUrl),
    ...competitorUrls.map((url) => fetchOnPageSummary(url)),
  ]);

  // 3-1. 도메인 권위 지표 병렬 조회 (공용 캐시 GET-only)
  const allSites = [customerSite, ...competitors];
  const metricsList = await Promise.all(
    allSites.map((s) =>
      s.domain
        ? fetchWithCache<DomainMetrics>("metrics", { domain: s.domain })
        : Promise.resolve<DomainMetrics | null>(null),
    ),
  );
  allSites.forEach((s, i) => {
    s.metrics = metricsList[i];
  });

  // 4. AI 비교 분석
  const aiReport = await generateAiReport(keyword, customerSite, competitors);

  return {
    customerSite,
    competitors,
    serpResults,
    aiReport,
    keyword,
    analyzedAt: new Date().toISOString(),
  };
}
