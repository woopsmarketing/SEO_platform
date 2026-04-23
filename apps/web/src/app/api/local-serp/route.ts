import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export const maxDuration = 30;

interface SerpOrganicItem {
  title?: string;
  link?: string;
  snippet?: string;
  position?: number;
}

interface LocalSerpRow {
  position: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

// 허용된 국가/언어 쌍 — 임의 값 차단
const ALLOWED_GL = new Set([
  "kr", "us", "jp", "gb", "de", "fr", "ca", "au", "br", "in", "cn", "tw", "sg", "vn",
]);
const ALLOWED_HL = new Set([
  "ko", "en", "ja", "de", "fr", "pt", "hi", "zh-cn", "zh-tw", "vi",
]);

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "local-serp", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const body = (await request.json()) as {
      keyword?: string;
      gl?: string;
      hl?: string;
      location?: string;
    };
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
    const gl = typeof body.gl === "string" ? body.gl.toLowerCase() : "kr";
    const hl = typeof body.hl === "string" ? body.hl.toLowerCase() : "ko";
    const location = typeof body.location === "string" ? body.location.trim() : "";

    if (!keyword) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }
    if (!ALLOWED_GL.has(gl)) {
      return NextResponse.json({ error: "지원하지 않는 국가 코드입니다." }, { status: 400 });
    }
    if (!ALLOWED_HL.has(hl)) {
      return NextResponse.json({ error: "지원하지 않는 언어 코드입니다." }, { status: 400 });
    }

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERP API가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    // 지역 SERP는 캐시 경유하지 않고 직접 호출만 (캐시 키에 지역 구분이 없음)
    const payload: Record<string, unknown> = {
      q: keyword,
      gl,
      hl,
      num: 20,
    };
    if (location) payload.location = location;

    const serperRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!serperRes.ok) {
      return NextResponse.json(
        { error: "SERP 데이터를 가져오는데 실패했습니다." },
        { status: 502 },
      );
    }

    const data = (await serperRes.json()) as { organic?: SerpOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];

    const results: LocalSerpRow[] = organic
      .filter((item) => typeof item.link === "string" && typeof item.title === "string")
      .map((item, i) => ({
        position: item.position || i + 1,
        title: item.title as string,
        url: item.link as string,
        snippet: item.snippet || "",
        domain: extractDomain(item.link as string),
      }));

    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "local-serp",
        input_summary: `${keyword} | ${gl}/${hl}${location ? ` @ ${location}` : ""}`,
        ip_address: ip,
      });
    } catch {
      // 로깅 실패 무시
    }

    return NextResponse.json({
      keyword,
      gl,
      hl,
      location: location || null,
      results,
    });
  } catch {
    return NextResponse.json(
      { error: "지역 SERP 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
