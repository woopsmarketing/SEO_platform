import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

interface PageContent {
  url: string;
  text: string;
  h2h3: string[];
}

interface TopicExtraction {
  topics: string[];
}

function normalizeUrl(u: string): string {
  const trimmed = u.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "https://" + trimmed;
  }
  return trimmed;
}

function extractHeadings(html: string): string[] {
  const out: string[] = [];
  const re = /<h(2|3)[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

function extractMainText(html: string): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // 토큰 절약: 최대 6000자
  return cleaned.slice(0, 6000);
}

async function fetchPage(url: string): Promise<PageContent> {
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
    text: extractMainText(html),
    h2h3: extractHeadings(html).slice(0, 30),
  };
}

async function extractTopics(apiKey: string, page: PageContent): Promise<string[]> {
  const systemPrompt = `당신은 SEO 콘텐츠 분석가입니다. 페이지에서 다루는 주요 토픽 키워드를 추출합니다.
규칙:
1. 반드시 10개의 토픽 키워드를 뽑는다
2. 2~4 단어 길이의 한국어 키워드
3. 일반 단어가 아니라 이 페이지가 "다루는 주제"여야 함
4. 응답은 JSON: {"topics": ["키워드1", ...]}`;

  const userPrompt = `URL: ${page.url}

## H2/H3 제목들
${page.h2h3.join("\n") || "(헤딩 없음)"}

## 본문 발췌
${page.text}

위 페이지가 다루는 주요 토픽 10개를 JSON으로 추출하세요.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
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
  let parsed: TopicExtraction;
  try {
    parsed = JSON.parse(content) as TopicExtraction;
  } catch {
    parsed = { topics: [] };
  }
  return Array.isArray(parsed.topics) ? parsed.topics.map(String).slice(0, 10) : [];
}

async function recommendTopics(
  apiKey: string,
  onlyCompetitor: string[],
): Promise<string[]> {
  if (onlyCompetitor.length === 0) return [];
  const systemPrompt = `당신은 SEO 콘텐츠 전략가입니다. 경쟁사가 다루지만 내 페이지가 다루지 않는 토픽 중에서 SEO 가치가 가장 높은 3개를 골라냅니다.`;
  const userPrompt = `경쟁사만 다루는 토픽:
${onlyCompetitor.map((t) => `- ${t}`).join("\n")}

이 중에서 검색 수요와 전환 가능성이 가장 높은 3개를 JSON으로 추천하세요.
형식: {"recommended": ["토픽1", "토픽2", "토픽3"]}`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return onlyCompetitor.slice(0, 3);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  let parsed: { recommended?: unknown };
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }
  const rec = Array.isArray(parsed.recommended)
    ? parsed.recommended.map(String).slice(0, 3)
    : onlyCompetitor.slice(0, 3);
  return rec;
}

function diffTopics(a: string[], b: string[]) {
  const aSet = new Set(a.map((t) => t.toLowerCase()));
  const bSet = new Set(b.map((t) => t.toLowerCase()));
  const common: string[] = [];
  const onlyA: string[] = [];
  const onlyB: string[] = [];
  for (const t of a) {
    if (bSet.has(t.toLowerCase())) common.push(t);
    else onlyA.push(t);
  }
  for (const t of b) {
    if (!aSet.has(t.toLowerCase())) onlyB.push(t);
  }
  return { common, onlyA, onlyB };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "content-gap", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const { myUrl, competitorUrl } = await request.json();
    if (
      !myUrl ||
      typeof myUrl !== "string" ||
      !competitorUrl ||
      typeof competitorUrl !== "string"
    ) {
      return NextResponse.json(
        { error: "내 페이지 URL과 경쟁사 URL을 모두 입력해주세요." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "LLM 분석 키가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const myNormalized = normalizeUrl(myUrl);
    const compNormalized = normalizeUrl(competitorUrl);

    // 1. 두 페이지 병렬 fetch
    let myPage: PageContent;
    let compPage: PageContent;
    try {
      [myPage, compPage] = await Promise.all([
        fetchPage(myNormalized),
        fetchPage(compNormalized),
      ]);
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다." }, { status: 400 });
    }

    // 2. 토픽 추출 병렬
    const [myTopics, compTopics] = await Promise.all([
      extractTopics(apiKey, myPage),
      extractTopics(apiKey, compPage),
    ]);

    // 3. diff
    const { common, onlyA: onlyMine, onlyB: onlyCompetitor } = diffTopics(myTopics, compTopics);

    // 4. 추천 토픽
    const recommended = await recommendTopics(apiKey, onlyCompetitor);

    // 로그
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "content-gap",
        input_summary: `${myNormalized} vs ${compNormalized}`,
        ip_address: ip,
      });
    } catch {}

    return NextResponse.json({
      myUrl: myNormalized,
      competitorUrl: compNormalized,
      myTopics,
      competitorTopics: compTopics,
      common,
      onlyMine,
      onlyCompetitor,
      recommended,
    });
  } catch {
    return NextResponse.json(
      { error: "콘텐츠 갭 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
