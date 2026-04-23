import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 60;

const METRICS_TOP_N = 30;

interface VebApiBacklink {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  doFollow?: boolean;
  domain_inlink_rank?: number;
  first_seen?: string;
  last_visited?: string;
}

interface VebApiBacklinkResponse {
  counts?: {
    backlinks?: { total?: number; doFollow?: number; noFollow?: number };
    domains?: { total?: number; doFollow?: number; noFollow?: number };
  };
  backlinks?: VebApiBacklink[];
}

interface GapRow {
  domain: string;
  metrics: DomainMetrics | null;
}

function normalizeDomain(input: string): string | null {
  let v = (input || "").trim().toLowerCase();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  try {
    const host = new URL(v).hostname.replace(/^www\./, "");
    if (!host.includes(".")) return null;
    return host;
  } catch {
    return null;
  }
}

function extractSourceDomain(urlFrom: string | undefined): string | null {
  if (!urlFrom || typeof urlFrom !== "string") return null;
  try {
    return new URL(urlFrom).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

async function fetchBacklinkDomains(domain: string, apiKey: string): Promise<Set<string>> {
  const res = await fetch(
    `https://vebapi.com/api/seo/backlinkdata?website=${encodeURIComponent(domain)}`,
    {
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(20000),
    },
  );

  if (!res.ok) {
    throw new Error(`VebAPI backlink failed for ${domain}: ${res.status}`);
  }

  const data = (await res.json()) as VebApiBacklinkResponse;
  const list = Array.isArray(data.backlinks) ? data.backlinks : [];

  const set = new Set<string>();
  for (const item of list) {
    const src = extractSourceDomain(item.url_from);
    if (src && src !== domain) set.add(src);
  }
  return set;
}

function toNumber(v: number | string | undefined | null): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

export async function POST(request: Request) {
  try {
    // 비로그인 2회/일, 로그인 10회/일
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rl = await checkRateLimit(ip, "backlink-gap", limit, 1440);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { myDomain?: unknown; competitorDomain?: unknown }
      | null;
    const myInput = body && typeof body.myDomain === "string" ? body.myDomain : "";
    const compInput = body && typeof body.competitorDomain === "string" ? body.competitorDomain : "";

    const myDomain = normalizeDomain(myInput);
    const competitorDomain = normalizeDomain(compInput);

    if (!myDomain || !competitorDomain) {
      return NextResponse.json(
        { error: "두 개의 올바른 도메인을 입력해주세요." },
        { status: 400 },
      );
    }
    if (myDomain === competitorDomain) {
      return NextResponse.json(
        { error: "서로 다른 도메인을 입력해주세요." },
        { status: 400 },
      );
    }

    const apiKey = process.env.VEBAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "백링크 분석 API가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    // 두 도메인 백링크 소스 도메인 병렬 조회
    let mySet: Set<string>;
    let compSet: Set<string>;
    try {
      const [a, b] = await Promise.all([
        fetchBacklinkDomains(myDomain, apiKey),
        fetchBacklinkDomains(competitorDomain, apiKey),
      ]);
      mySet = a;
      compSet = b;
    } catch {
      return NextResponse.json(
        { error: "백링크 데이터를 가져오는데 실패했습니다." },
        { status: 502 },
      );
    }

    // diff 계산
    const onlyCompetitor: string[] = [];
    const common: string[] = [];
    const onlyMine: string[] = [];

    for (const d of compSet) {
      if (mySet.has(d)) common.push(d);
      else onlyCompetitor.push(d);
    }
    for (const d of mySet) {
      if (!compSet.has(d)) onlyMine.push(d);
    }

    // 경쟁사만 상위 METRICS_TOP_N 도메인 metrics 캐시 조회 (Promise.allSettled — 실패 내성)
    const toLookup = onlyCompetitor.slice(0, METRICS_TOP_N);
    const metricsSettled = await Promise.allSettled(
      toLookup.map((d) => fetchWithCache<DomainMetrics>("metrics", { domain: d })),
    );

    const enriched: GapRow[] = toLookup.map((d, i) => {
      const r = metricsSettled[i];
      const metrics =
        r && r.status === "fulfilled" && r.value ? r.value : null;
      return { domain: d, metrics };
    });

    // DA 내림차순 정렬 (없는 건 뒤)
    enriched.sort((a, b) => {
      const da = toNumber(a.metrics?.mozDA) ?? -1;
      const db = toNumber(b.metrics?.mozDA) ?? -1;
      return db - da;
    });

    // tool_usage_logs 기록
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "backlink-gap",
        input_summary: `${myDomain} vs ${competitorDomain}`,
        ip_address: ip,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      myDomain,
      competitorDomain,
      counts: {
        myTotal: mySet.size,
        competitorTotal: compSet.size,
        onlyMine: onlyMine.length,
        common: common.length,
        onlyCompetitor: onlyCompetitor.length,
      },
      onlyCompetitor: enriched,
      common: common.slice(0, 200),
      onlyMine: onlyMine.slice(0, 200),
    });
  } catch {
    return NextResponse.json(
      { error: "백링크 갭 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
