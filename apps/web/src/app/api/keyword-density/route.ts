import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // 로그인 유저는 무제한, 비로그인은 IP당 하루 5회
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    if (!loggedIn) {
      const rateLimit = await checkRateLimit(ip, "keyword-density", 5, 1440);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: "일일 무료 분석 횟수(5회)를 초과했습니다.", upgrade: true, remaining: 0 },
          { status: 429 }
        );
      }
    }

    const { url, keyword } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL을 입력해주세요." }, { status: 400 });
    }
    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json({ error: "타겟 키워드를 입력해주세요." }, { status: 400 });
    }

    let fetchUrl = url.trim();
    if (!fetchUrl.startsWith("http")) fetchUrl = "https://" + fetchUrl;

    // 1. 페이지 HTML 가져오기
    let html: string;
    let finalUrl: string;
    try {
      const res = await fetch(fetchUrl, {
        signal: AbortSignal.timeout(10000),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)",
          Accept: "text/html",
        },
        redirect: "follow",
      });
      html = await res.text();
      finalUrl = res.url;
    } catch {
      return NextResponse.json({ error: "페이지를 가져올 수 없습니다. URL을 확인해주세요." }, { status: 400 });
    }

    // 2. 메타 정보 추출
    const title = extractTag(html, /<title[^>]*>([^<]*)<\/title>/i);
    const description = extractMetaContent(html, "description");

    // 3. 본문 텍스트 추출 (script, style 제거)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    const textContent = bodyHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 4. 전체 텍스트 (title + description + body)
    const fullText = [title || "", description || "", textContent].join(" ").toLowerCase();
    const totalWordCount = fullText.split(/\s+/).filter(Boolean).length;

    // 5. 한국어 불용어 + 조사/어미 처리
    const STOPWORDS = new Set([
      // 한국어 조사/어미/접속사
      "은", "는", "이", "가", "을", "를", "의", "에", "에서", "로", "으로", "와", "과", "도", "만", "까지",
      "부터", "에게", "한테", "께", "보다", "처럼", "같이", "마다", "밖에", "뿐", "이나", "나", "든지",
      // 한국어 용언 어미/보조
      "있는", "없는", "하는", "되는", "있는가?", "합니다", "입니다", "합니다.", "입니다.", "있습니다",
      "있습니다.", "됩니다", "됩니다.", "하세요", "하세요.", "보세요", "보세요.",
      "수", "것", "등", "위한", "위해", "통해", "대한", "따라", "관련", "포함",
      "더", "및", "또는", "그리고", "하지만", "그러나", "때문", "때문에",
      // 일반적 의미 없는 단어
      "있는가?", "있는가", "없는가", "인가요?", "인가요", "무엇", "어떻게", "왜",
      "이상", "이하", "이내", "이전", "이후", "현재", "모든", "각", "매우", "가장",
      // 숫자/특수문자 관련
      "q-", "q.", "n/a", "null", "undefined", "true", "false",
    ]);

    // 한국어 조사 제거 함수
    function removeKoreanParticles(word: string): string {
      return word
        .replace(/[을를은는이가의에와과도만로으로에서까지부터]$/, "")
        .replace(/[합입됩]니다\.?$/, "")
        .replace(/하세요\.?$/, "")
        .replace(/[?!.,;:'"()\[\]{}□■◆◇○●▶▷★☆]+/g, "")
        .trim();
    }

    // 유효한 키워드인지 확인
    function isValidKeyword(word: string): boolean {
      if (word.length < 2) return false;
      if (STOPWORDS.has(word)) return false;
      // 순수 숫자/특수문자만
      if (/^[\d\s.,!?;:'"()\-\/\\@#$%^&*=+_~`□■◆◇○●▶▷★☆\[\]{}|<>]+$/.test(word)) return false;
      // 한글 1글자만 (조사 등)
      if (/^[\uac00-\ud7af]$/.test(word)) return false;
      // 영문 1글자만
      if (/^[a-z]$/i.test(word)) return false;
      // 특수문자로 시작하거나 끝남
      if (/^[^a-z가-힣0-9]/i.test(word) || /[^a-z가-힣0-9]$/i.test(word)) return false;
      return true;
    }

    // 6. 키워드 밀도 분석 — 1~3단어 조합 추출 (정제된)
    const rawWords = fullText.split(/\s+/).filter(Boolean);
    const cleanedWords = rawWords.map(removeKoreanParticles).filter(Boolean);
    const ngramCounts: Record<string, number> = {};

    for (let n = 1; n <= 3; n++) {
      for (let i = 0; i <= cleanedWords.length - n; i++) {
        const parts = cleanedWords.slice(i, i + n);
        if (parts.some((p) => !isValidKeyword(p))) continue;
        const gram = parts.join(" ");
        if (gram.length < 2) continue;
        ngramCounts[gram] = (ngramCounts[gram] || 0) + 1;
      }
    }

    // 7. 2회 이상 등장 + 상위 50개
    const targetKw = keyword.trim().toLowerCase();
    const titleLower = (title || "").toLowerCase();
    const descLower = (description || "").toLowerCase();

    const sortedWords = Object.entries(ngramCounts)
      .filter(([word, count]) => count >= 2 && isValidKeyword(word.split(" ")[0]))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([word, occurrences]) => {
        const percent = totalWordCount > 0
          ? ((occurrences / totalWordCount) * 100).toFixed(1) + "%"
          : "0%";
        return {
          word,
          occurrences,
          percent,
          weight: (occurrences / Math.max(totalWordCount, 1) * 10).toFixed(2),
          inTitle: titleLower.includes(word),
          inDescription: descLower.includes(word),
        };
      });

    // 7. 타겟 키워드 밀도 계산
    const targetCount = (fullText.match(new RegExp(targetKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;
    const targetDensity = totalWordCount > 0
      ? ((targetCount / totalWordCount) * 100).toFixed(1) + "%"
      : "0%";

    // 타겟 키워드가 상위 목록에 없으면 추가
    if (targetCount > 0 && !sortedWords.some((w) => w.word === targetKw)) {
      sortedWords.unshift({
        word: targetKw,
        occurrences: targetCount,
        percent: targetDensity,
        weight: (targetCount / Math.max(totalWordCount, 1) * 10).toFixed(2),
        inTitle: titleLower.includes(targetKw),
        inDescription: descLower.includes(targetKw),
      });
    }

    let domain: string;
    try {
      domain = new URL(finalUrl).hostname;
    } catch {
      domain = url.trim();
    }

    // tool_usage_logs 기록
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    await adminSupabase.from("tool_usage_logs").insert({
      tool_type: "keyword-density",
      input_summary: `${domain} / ${keyword.trim()}`,
      ip_address: ip,
    });

    // 로그인 사용자 analyses 저장
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const userSupabase = await createClient();
      const { data: { user } } = await userSupabase.auth.getUser();
      if (user) {
        await adminSupabase.from("analyses").insert({
          user_id: user.id,
          tool_type: "keyword-density",
          input_summary: `${domain} / ${keyword.trim()}`,
          score: null,
          input: { domain, keyword: keyword.trim() },
          result: {
            summary: {
              url: domain,
              keyword: keyword.trim(),
              totalWords: sortedWords.length,
              targetCount,
              targetDensity,
              title: title || "",
              description: description || "",
            },
          },
        });
      }
    } catch {}

    return NextResponse.json({
      domain,
      keyword: keyword.trim(),
      title: title || "",
      description: description || "",
      targetCount,
      targetDensity,
      totalWordCount,
      words: sortedWords,
    });
  } catch {
    return NextResponse.json({ error: "키워드 밀도 분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}

function extractTag(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function extractMetaContent(html: string, name: string): string | null {
  const metaTags = html.match(/<meta[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const nameMatch = tag.match(/name\s*=\s*["']([^"']*)["']/i);
    if (nameMatch && nameMatch[1].toLowerCase() === name.toLowerCase()) {
      const contentMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i);
      return contentMatch ? contentMatch[1].trim() : null;
    }
  }
  return null;
}
