import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

interface CurrentPage {
  url: string;
  title: string | null;
  description: string | null;
  h1: string | null;
}

interface CompetitorEntry {
  rank: number;
  url: string;
  title: string;
  snippet: string;
}

interface Suggestions {
  titles: [string, string];
  description: string;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function extractMetaDesc(html: string): string | null {
  const tags = html.match(/<meta[^>]*>/gi) || [];
  for (const tag of tags) {
    const nameMatch = tag.match(/name\s*=\s*["']description["']/i);
    if (!nameMatch) continue;
    const content = tag.match(/content\s*=\s*"([^"]*)"/i) || tag.match(/content\s*=\s*'([^']*)'/i);
    if (content) return content[1].trim();
  }
  return null;
}

function extractH1(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, "").trim() || null;
}

async function fetchPage(url: string): Promise<CurrentPage> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)",
      Accept: "text/html",
    },
    redirect: "follow",
  });
  const html = await res.text();
  return {
    url,
    title: extractTitle(html),
    description: extractMetaDesc(html),
    h1: extractH1(html),
  };
}

/**
 * Serper에서 상위 5개 결과의 title/URL/snippet 확보.
 * 캐시 스펙에 snippet이 없어서 직접 호출.
 */
async function fetchSerpTop5(keyword: string): Promise<CompetitorEntry[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: keyword, gl: "kr", hl: "ko", num: 10 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const organic = (data.organic || []) as Array<{
      title: string;
      link: string;
      snippet?: string;
      position?: number;
    }>;
    return organic.slice(0, 5).map((o, i) => ({
      rank: o.position || i + 1,
      url: o.link,
      title: o.title,
      snippet: o.snippet || "",
    }));
  } catch {
    return [];
  }
}

async function generateSuggestions(
  apiKey: string,
  keyword: string,
  current: CurrentPage,
  competitors: CompetitorEntry[],
): Promise<Suggestions> {
  const compList = competitors
    .map(
      (c, i) =>
        `${i + 1}. [${c.title}]\n   ${c.snippet || "(snippet 없음)"}`,
    )
    .join("\n");

  const systemPrompt = `당신은 SEO 카피라이터입니다. 검색 의도와 CTR을 높이는 title/description을 한국어로 작성합니다.

규칙:
1. 타겟 키워드를 반드시 포함
2. 과장/허위 표현 금지 ("최고", "1등", "100%" 등 자제)
3. Title은 30자 내외, Description은 80~120자
4. 상위 경쟁사의 공통 패턴을 참고하되 차별화된 표현 사용
5. 응답은 반드시 JSON 형식`;

  const userPrompt = `타겟 키워드: "${keyword}"

## 현재 페이지
- URL: ${current.url}
- Title: ${current.title || "(없음)"}
- Description: ${current.description || "(없음)"}
- H1: ${current.h1 || "(없음)"}

## 구글 상위 ${competitors.length}개 경쟁 결과
${compList || "(경쟁 데이터 없음)"}

CTR이 높아지도록 다음을 JSON으로 응답하세요:
{
  "titles": ["새 title 1안", "새 title 2안"],
  "description": "새 description 1안"
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  let parsed: { titles?: unknown; description?: unknown };
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }
  const titlesArr = Array.isArray(parsed.titles) ? parsed.titles.map(String) : [];
  const title1 = titlesArr[0] || "";
  const title2 = titlesArr[1] || "";
  const description = typeof parsed.description === "string" ? parsed.description : "";
  return {
    titles: [title1, title2],
    description,
  };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "snippet-optimizer", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    let { url, keyword } = await request.json();
    if (!url || typeof url !== "string" || !keyword || typeof keyword !== "string") {
      return NextResponse.json(
        { error: "URL과 키워드를 모두 입력해주세요." },
        { status: 400 },
      );
    }
    url = url.trim();
    keyword = keyword.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "LLM 분석 키가 설정되지 않았습니다." }, { status: 500 });
    }

    // 1. 현재 페이지 + 상위 5 병렬
    let current: CurrentPage;
    try {
      [current] = await Promise.all([fetchPage(url)]);
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다." }, { status: 400 });
    }
    const competitors = await fetchSerpTop5(keyword);

    // 2. 제안 생성
    const suggestions = await generateSuggestions(apiKey, keyword, current, competitors);

    // 로그
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "snippet-optimizer",
        input_summary: `${url} | ${keyword}`,
        ip_address: ip,
      });
    } catch {}

    return NextResponse.json({
      current: { title: current.title, description: current.description },
      competitors,
      suggestions,
    });
  } catch {
    return NextResponse.json(
      { error: "스니펫 최적화 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
