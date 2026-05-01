import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

type KeywordType = "롱테일" | "질문형" | "미디엄";

interface LongtailItem {
  keyword: string;
  wordCount: number;
  type: KeywordType;
  searchVolume?: number;
}

interface VebApiItem {
  text?: string;
  vol?: number;
}

const QUESTION_WORDS = [
  "어떻게",
  "왜",
  "무엇",
  "언제",
  "어디서",
  "어디",
  "누가",
  "얼마",
  "how",
  "what",
  "why",
  "when",
  "where",
  "who",
  "which",
];

function classify(keyword: string): { wordCount: number; type: KeywordType } {
  const trimmed = keyword.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const lower = trimmed.toLowerCase();
  const isQuestion = QUESTION_WORDS.some((q) => lower.includes(q.toLowerCase()));
  if (isQuestion) return { wordCount, type: "질문형" };
  if (wordCount >= 3) return { wordCount, type: "롱테일" };
  return { wordCount, type: "미디엄" };
}

/** VebAPI에서 seed 관련 키워드 수집. 실패 시 빈 배열 반환. */
async function fetchVebKeywords(seed: string): Promise<VebApiItem[]> {
  const apiKey = process.env.VEBAPI_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://vebapi.com/api/seo/keywordresearch?keyword=${encodeURIComponent(seed)}&country=kr`,
      {
        headers: { "X-API-KEY": apiKey, Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as VebApiItem[]) : [];
  } catch {
    return [];
  }
}

/** Google Autocomplete로 보조 키워드 수집 (VebAPI 실패 폴백) */
async function fetchAutocompleteKeywords(seed: string): Promise<string[]> {
  const suffixes = ["", " 방법", " 추천", " 비교", " 후기", " 어떻게", " 왜", " 뜻"];
  const keywords: string[] = [];
  const results = await Promise.allSettled(
    suffixes.map(async (suffix) => {
      const q = (seed + suffix).trim();
      const url = `https://suggestqueries.google.com/complete/search?q=${encodeURIComponent(q)}&client=firefox&hl=ko`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const buf = await res.arrayBuffer();
      let text: string;
      try {
        text = new TextDecoder("euc-kr").decode(buf);
        if (text.includes("�")) text = new TextDecoder("utf-8").decode(buf);
      } catch {
        text = new TextDecoder("utf-8").decode(buf);
      }
      const data = JSON.parse(text);
      return (data[1] as string[]) || [];
    }),
  );
  for (const r of results) {
    if (r.status === "fulfilled") keywords.push(...r.value);
  }
  return keywords;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "longtail-keywords", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const { seed } = await request.json();
    if (!seed || typeof seed !== "string" || seed.trim().length === 0) {
      return NextResponse.json({ error: "시드 키워드를 입력해주세요." }, { status: 400 });
    }
    const seedKw = seed.trim();

    // 1. VebAPI 키워드 수집
    const vebItems = await fetchVebKeywords(seedKw);

    // 2. 부족하면 Google Autocomplete 보강
    let collected: Array<{ keyword: string; vol?: number }> = vebItems
      .map((k) => ({ keyword: (k.text || "").trim(), vol: typeof k.vol === "number" ? k.vol : undefined }))
      .filter((k) => k.keyword);

    if (collected.length < 30) {
      const auto = await fetchAutocompleteKeywords(seedKw);
      for (const kw of auto) {
        const clean = kw.trim();
        if (!clean) continue;
        if (collected.some((c) => c.keyword.toLowerCase() === clean.toLowerCase())) continue;
        collected.push({ keyword: clean });
      }
    }

    // 중복 제거 + 최대 50개
    const seen = new Set<string>();
    collected = collected.filter((c) => {
      const key = c.keyword.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 50);

    if (collected.length === 0) {
      return NextResponse.json({ error: "관련 키워드를 찾지 못했습니다." }, { status: 404 });
    }

    // 3. 분류
    const items: LongtailItem[] = collected.map((c) => {
      const { wordCount, type } = classify(c.keyword);
      return {
        keyword: c.keyword,
        wordCount,
        type,
        searchVolume: c.vol,
      };
    });

    // 검색량 내림차순 정렬 (없으면 뒤로)
    items.sort((a, b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1));

    // 로그
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "longtail-keywords",
        input_summary: seedKw,
        ip_address: ip,
      });
    } catch {}

    return NextResponse.json({ seed: seedKw, total: items.length, results: items });
  } catch {
    return NextResponse.json({ error: "롱테일 키워드 분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
