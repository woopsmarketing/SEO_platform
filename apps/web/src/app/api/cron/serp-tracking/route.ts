import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchWithCache, saveToCache } from "@/lib/cache-api";

export const runtime = "nodejs";
export const maxDuration = 60;

// Serper 병렬 호출 배치 크기 (외부 API 부담 완화)
const BATCH_SIZE = 5;
// 순위 매칭에 사용할 SERP 상위 결과 수
const SERP_LIMIT = 100;

interface TrackedKeywordRow {
  id: string;
  user_id: string;
  domain: string;
  keyword: string;
  gl: string | null;
  hl: string | null;
}

interface SerpCachedItem {
  url: string;
  title?: string;
  position?: number;
}

interface SerpOrganicItem {
  title?: string;
  link?: string;
  position?: number;
}

interface TrackingResult {
  tracked_keyword_id: string;
  keyword: string;
  domain: string;
  rank: number | null;
  url: string | null;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function normalizeDomain(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return trimmed.replace(/^www\./, "").toLowerCase();
  }
}

function findRank(
  results: SerpCachedItem[],
  targetDomain: string,
): { rank: number; url: string } | null {
  for (let i = 0; i < results.length; i++) {
    const d = extractDomain(results[i].url);
    if (d === targetDomain || d.endsWith(`.${targetDomain}`)) {
      const rank =
        typeof results[i].position === "number"
          ? (results[i].position as number)
          : i + 1;
      return { rank, url: results[i].url };
    }
  }
  return null;
}

/**
 * 키워드의 SERP 상위 결과를 캐시 우선으로 조회. 캐시 MISS 시 Serper 호출 후 저장.
 */
async function fetchSerp(
  keyword: string,
  gl: string,
  hl: string,
): Promise<SerpCachedItem[]> {
  const cached = await fetchWithCache<SerpCachedItem[]>("serp", { keyword });
  if (cached && cached.length > 0) return cached;

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: keyword, gl, hl, num: SERP_LIMIT }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { organic?: SerpOrganicItem[] };
    const organic = Array.isArray(data.organic) ? data.organic : [];
    const rows: SerpCachedItem[] = organic
      .filter(
        (item): item is SerpOrganicItem & { link: string; title: string } =>
          typeof item.link === "string" && typeof item.title === "string",
      )
      .map((item, i) => ({
        url: item.link,
        title: item.title,
        position: typeof item.position === "number" ? item.position : i + 1,
      }));

    if (rows.length > 0) {
      await saveToCache("serp", { keyword, results: rows });
    }
    return rows;
  } catch {
    return [];
  }
}

/**
 * CRON 인증 — header `Authorization: Bearer ${CRON_SECRET}` 또는 query `?secret=...`.
 * CRON_SECRET이 미설정이면 local 개발 편의를 위해 통과.
 */
function verifyCronSecret(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) return true;

  const url = new URL(request.url);
  const query = url.searchParams.get("secret");
  if (query === cronSecret) return true;

  return false;
}

async function processBatch(
  batch: TrackedKeywordRow[],
): Promise<TrackingResult[]> {
  const settled = await Promise.allSettled(
    batch.map(async (row) => {
      const gl = row.gl || "kr";
      const hl = row.hl || "ko";
      const domain = normalizeDomain(row.domain);
      const serp = await fetchSerp(row.keyword, gl, hl);
      const hit = domain ? findRank(serp, domain) : null;
      return {
        tracked_keyword_id: row.id,
        keyword: row.keyword,
        domain: row.domain,
        rank: hit?.rank ?? null,
        url: hit?.url ?? null,
      } satisfies TrackingResult;
    }),
  );

  const out: TrackingResult[] = [];
  for (let i = 0; i < settled.length; i++) {
    const r = settled[i];
    if (r.status === "fulfilled") {
      out.push(r.value);
    } else {
      out.push({
        tracked_keyword_id: batch[i].id,
        keyword: batch[i].keyword,
        domain: batch[i].domain,
        rank: null,
        url: null,
      });
    }
  }
  return out;
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const supabase = createAdminClient();

  const { data: rows, error } = await supabase
    .from("tracked_keywords")
    .select("id, user_id, domain, keyword, gl, hl")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { error: "Failed to load tracked keywords", detail: error.message },
      { status: 500 },
    );
  }

  const list = (rows ?? []) as TrackedKeywordRow[];
  if (list.length === 0) {
    return NextResponse.json({
      scanned: 0,
      tracked: [],
      elapsedMs: Date.now() - started,
    });
  }

  const allResults: TrackingResult[] = [];
  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const results = await processBatch(batch);
    allResults.push(...results);
  }

  // insert serp_tracking rows (admin client → RLS 우회)
  if (allResults.length > 0) {
    const inserts = allResults.map((r) => ({
      tracked_keyword_id: r.tracked_keyword_id,
      rank: r.rank,
      url: r.url,
    }));
    await supabase.from("serp_tracking").insert(inserts);
  }

  return NextResponse.json({
    scanned: list.length,
    tracked: allResults.map((r) => ({ keyword: r.keyword, rank: r.rank })),
    elapsedMs: Date.now() - started,
  });
}
