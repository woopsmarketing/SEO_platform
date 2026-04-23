import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, saveToCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 30;

interface SerpEntry {
  url: string;
  title: string;
}

interface DifficultyRow {
  rank: number;
  domain: string;
  url: string;
  title: string;
  mozDA: number | null;
  ahrefsDR: number | null;
  majesticTF: number | null;
}

type DifficultyLabel = "낮음" | "보통" | "어려움" | "매우 어려움";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function toNumber(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function labelFor(score: number): DifficultyLabel {
  if (score < 30) return "낮음";
  if (score < 50) return "보통";
  if (score < 70) return "어려움";
  return "매우 어려움";
}

async function fetchSerp(keyword: string): Promise<SerpEntry[]> {
  const cached = await fetchWithCache<SerpEntry[]>("serp", { keyword });
  if (cached && cached.length > 0) return cached;

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
    const organic = (data.organic || []) as Array<{ title: string; link: string }>;
    const entries: SerpEntry[] = organic.slice(0, 10).map((o) => ({
      url: o.link,
      title: o.title,
    }));
    if (entries.length > 0) {
      await saveToCache("serp", { keyword, results: entries });
    }
    return entries;
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "serp-difficulty", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429 },
      );
    }

    const { keyword } = await request.json();
    if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }
    const kw = keyword.trim();

    const serp = await fetchSerp(kw);
    if (serp.length === 0) {
      return NextResponse.json(
        { error: "SERP 결과를 가져오지 못했습니다." },
        { status: 502 },
      );
    }

    // 상위 10개 도메인 metrics 병렬 조회 (각 도메인 캐시 경유)
    const top = serp.slice(0, 10);
    const metricsList = await Promise.all(
      top.map((entry) => {
        const domain = extractDomain(entry.url);
        if (!domain) return Promise.resolve<DomainMetrics | null>(null);
        return fetchWithCache<DomainMetrics>("metrics", { domain });
      }),
    );

    const rows: DifficultyRow[] = top.map((entry, i) => {
      const m = metricsList[i];
      return {
        rank: i + 1,
        domain: extractDomain(entry.url),
        url: entry.url,
        title: entry.title,
        mozDA: m ? toNumber(m.mozDA) : null,
        ahrefsDR: m ? toNumber(m.ahrefsDR) : null,
        majesticTF: m ? toNumber(m.majesticTF) : null,
      };
    });

    const avg = (pick: (r: DifficultyRow) => number | null) => {
      const nums = rows.map(pick).filter((n): n is number => n !== null);
      if (nums.length === 0) return 0;
      return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    };

    const avgDA = avg((r) => r.mozDA);
    const avgDR = avg((r) => r.ahrefsDR);
    const avgTF = avg((r) => r.majesticTF);

    const difficultyScore = Math.round(avgDA * 0.4 + avgDR * 0.4 + avgTF * 0.2);
    const difficultyLabel = labelFor(difficultyScore);

    // 로그
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "serp-difficulty",
        input_summary: kw,
        ip_address: ip,
      });
    } catch {}

    return NextResponse.json({
      keyword: kw,
      avgDA,
      avgDR,
      avgTF,
      difficultyScore,
      difficultyLabel,
      rows,
    });
  } catch {
    return NextResponse.json(
      { error: "SERP 난이도 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
