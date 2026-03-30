import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, "keyword-density", 9999, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "일일 무료 분석 횟수(3회)를 초과했습니다. Pro 플랜으로 업그레이드하면 무제한으로 사용할 수 있습니다.", upgrade: true },
        { status: 429 }
      );
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

    // 5. 키워드 밀도 분석 — 1~3단어 조합 추출
    const words = fullText.split(/\s+/).filter(Boolean);
    const ngramCounts: Record<string, number> = {};

    // 1-gram, 2-gram, 3-gram
    for (let n = 1; n <= 3; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const gram = words.slice(i, i + n).join(" ");
        if (gram.length < 2) continue;
        // 순수 숫자, 특수문자만인 경우 스킵
        if (/^[\d\s.,!?;:'"()\-]+$/.test(gram)) continue;
        ngramCounts[gram] = (ngramCounts[gram] || 0) + 1;
      }
    }

    // 6. 2회 이상 등장한 키워드만 필터 + 상위 50개
    const targetKw = keyword.trim().toLowerCase();
    const titleLower = (title || "").toLowerCase();
    const descLower = (description || "").toLowerCase();

    const sortedWords = Object.entries(ngramCounts)
      .filter(([, count]) => count >= 2)
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
