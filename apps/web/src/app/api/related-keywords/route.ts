import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

// 한글 확장 접미사 (자주 쓰는 음절)
const KO_SUFFIXES = [
  "", " 가", " 나", " 다", " 라", " 마", " 바", " 사", " 아", " 자", " 차", " 카", " 타", " 파", " 하",
  " 구", " 무", " 서", " 확", " 분", " 검", " 방", " 프", " 블", " 추", " 효", " 만", " 대", " 비",
  " 종", " 네", " 순", " 작", " 온", " 오", " 키", " 도", " 상", " 전",
];

// 영문 확장
const EN_SUFFIXES = [
  "", " a", " b", " c", " d", " e", " f", " g", " h", " i", " j", " k", " l", " m",
  " n", " o", " p", " q", " r", " s", " t", " u", " v", " w",
];

export async function POST(request: Request) {
  try {
    // 비로그인 하루 2회, 로그인 하루 10회
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "related-keywords", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 }
      );
    }

    const { keyword } = await request.json();
    if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }

    const kw = keyword.trim();

    // 한글 포함 여부로 확장 접미사 결정
    const isKorean = /[\uac00-\ud7af]/.test(kw);
    const suffixes = isKorean ? KO_SUFFIXES : EN_SUFFIXES;

    // Google Autocomplete 병렬 호출
    const allKeywords: string[] = [];
    const batchSize = 10;

    for (let i = 0; i < suffixes.length; i += batchSize) {
      const batch = suffixes.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (suffix) => {
          const query = kw + suffix;
          const url = `https://suggestqueries.google.com/complete/search?q=${encodeURIComponent(query)}&client=firefox&hl=ko`;
          const res = await fetch(url, {
            signal: AbortSignal.timeout(5000),
            headers: { "User-Agent": "Mozilla/5.0" },
          });
          const buf = await res.arrayBuffer();
          // Google은 EUC-KR로 응답할 수 있음
          let text: string;
          try {
            const decoder = new TextDecoder("euc-kr");
            text = decoder.decode(buf);
            // EUC-KR 디코딩이 정상적이지 않으면 UTF-8로 재시도
            if (text.includes("\ufffd")) {
              text = new TextDecoder("utf-8").decode(buf);
            }
          } catch {
            text = new TextDecoder("utf-8").decode(buf);
          }
          const data = JSON.parse(text);
          return (data[1] as string[]) || [];
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          allKeywords.push(...result.value);
        }
      }
    }

    // 중복 제거 + 필터링
    const seen = new Set<string>();
    const filtered: string[] = [];

    for (const k of allKeywords) {
      const clean = k.trim().toLowerCase();
      if (seen.has(clean)) continue;
      seen.add(clean);

      // 원래 키워드 자체는 제외
      if (clean === kw.toLowerCase()) continue;
      // 너무 짧은 결과 (원래 키워드 + 1글자만 추가된 것) 제외
      if (clean.length <= kw.length + 1) continue;
      // 원래 키워드로 시작하지 않는 것도 포함 (역방향 추천)

      filtered.push(k.trim());
    }

    // 원래 키워드 포함 여부로 그룹 분류
    const containing = filtered.filter((k) => k.toLowerCase().includes(kw.toLowerCase()));
    const related = filtered.filter((k) => !k.toLowerCase().includes(kw.toLowerCase()));

    // tool_usage_logs 기록
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "related-keywords",
        input_summary: kw,
        ip_address: ip,
      });

      // 로그인 사용자 analyses 저장
      const { createClient } = await import("@/lib/supabase/server");
      const userSupabase = await createClient();
      const { data: { user } } = await userSupabase.auth.getUser();
      if (user) {
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "related-keywords",
          input_summary: kw,
          score: null,
          input: { keyword: kw },
          result: {
            summary: {
              keyword: kw,
              totalContaining: containing.length,
              totalRelated: related.length,
            },
          },
        });
      }
    } catch {}

    return NextResponse.json({
      keyword: kw,
      containing,
      related,
      total: containing.length + related.length,
    });
  } catch {
    return NextResponse.json({ error: "관련 키워드 분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
