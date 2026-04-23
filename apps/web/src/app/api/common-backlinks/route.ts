import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, type DomainMetrics } from "@/lib/cache-api";

export const maxDuration = 60;

// 공통 referring 도메인 중 metrics 조회를 수행할 최대 개수
const TOP_COMMON_FOR_METRICS = 30;

interface VebBacklink {
  url_from?: string;
  url_to?: string;
  anchor?: string;
  doFollow?: boolean;
}

interface CommonRefDomainRow {
  domain: string;
  sourceDA: number | null;
  pairs: Record<string, boolean>;
}

interface CommonBacklinksResponse {
  inputs: string[];
  totalBacklinksPerDomain: Record<string, number>;
  commonRefDomains: CommonRefDomainRow[];
  generatedAt: string;
}

function toHostname(rawUrl?: string): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function normalizeDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withScheme = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function parseDA(metrics: DomainMetrics | null | undefined): number | null {
  if (!metrics) return null;
  const v = metrics.mozDA;
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? Math.round(n) : null;
}

async function fetchBacklinks(
  domain: string,
  apiKey: string,
): Promise<VebBacklink[]> {
  try {
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
    if (!res.ok) return [];
    const data = (await res.json()) as { backlinks?: VebBacklink[] };
    return Array.isArray(data.backlinks) ? data.backlinks : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 2;
    const rateLimit = await checkRateLimit(ip, "common-backlinks", limit, 1440);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `일일 분석 횟수(${limit}회)를 초과했습니다.`,
          upgrade: true,
          remaining: 0,
        },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { domains?: unknown };
    const rawDomains = Array.isArray(body.domains) ? body.domains : [];

    // 입력 검증: 2~5개, 각 항목은 문자열, 도메인 정규화 후 중복 제거
    const normalized: string[] = [];
    for (const d of rawDomains) {
      if (typeof d !== "string") continue;
      const n = normalizeDomain(d);
      if (n && !normalized.includes(n)) normalized.push(n);
    }

    if (normalized.length < 2 || normalized.length > 5) {
      return NextResponse.json(
        { error: "도메인은 2개 이상 5개 이하로 입력해주세요." },
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

    // 각 도메인의 백링크 병렬 조회 (실패 내성)
    const backlinksSettled = await Promise.allSettled(
      normalized.map((d) => fetchBacklinks(d, apiKey)),
    );

    const totalBacklinksPerDomain: Record<string, number> = {};
    const refSetsByInput: Record<string, Set<string>> = {};
    normalized.forEach((input, i) => {
      const r = backlinksSettled[i];
      const bls = r.status === "fulfilled" ? r.value : [];
      totalBacklinksPerDomain[input] = bls.length;
      const hosts = new Set<string>();
      for (const bl of bls) {
        const host = toHostname(bl.url_from);
        // 자기 자신 도메인은 제외
        if (host && host !== input) hosts.add(host);
      }
      refSetsByInput[input] = hosts;
    });

    // Set intersection: 모든 입력 도메인에 공통으로 등장하는 referring 도메인
    let commonSet: Set<string> | null = null;
    for (const input of normalized) {
      const s = refSetsByInput[input];
      if (commonSet === null) {
        commonSet = new Set(s);
      } else {
        const next = new Set<string>();
        for (const h of commonSet) {
          if (s.has(h)) next.add(h);
        }
        commonSet = next;
      }
    }
    const commonList = Array.from(commonSet ?? new Set<string>());

    // 상위 N개 공통 도메인에 대해 metrics 병렬 조회
    const toProbe = commonList.slice(0, TOP_COMMON_FOR_METRICS);
    const metricsSettled = await Promise.allSettled(
      toProbe.map((d) => fetchWithCache<DomainMetrics>("metrics", { domain: d })),
    );

    const rowsProbed: CommonRefDomainRow[] = toProbe.map((domain, i) => {
      const r = metricsSettled[i];
      const metrics = r.status === "fulfilled" ? r.value : null;
      const pairs: Record<string, boolean> = {};
      for (const input of normalized) {
        pairs[input] = refSetsByInput[input].has(domain);
      }
      return {
        domain,
        sourceDA: parseDA(metrics),
        pairs,
      };
    });

    // 조회 대상 밖의 공통 도메인도 DA 없이 포함 (pairs 정보만)
    const rowsRest: CommonRefDomainRow[] = commonList.slice(TOP_COMMON_FOR_METRICS).map(
      (domain) => {
        const pairs: Record<string, boolean> = {};
        for (const input of normalized) pairs[input] = refSetsByInput[input].has(domain);
        return { domain, sourceDA: null, pairs };
      },
    );

    // DA 내림차순 (null은 뒤로)
    const sortedProbed = [...rowsProbed].sort((a, b) => {
      const av = a.sourceDA ?? -1;
      const bv = b.sourceDA ?? -1;
      return bv - av;
    });

    const commonRefDomains: CommonRefDomainRow[] = [...sortedProbed, ...rowsRest];

    // tool_usage_logs 기록
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      await adminSupabase.from("tool_usage_logs").insert({
        tool_type: "common-backlinks",
        input_summary: normalized.join(", "),
        ip_address: ip,
      });
    } catch {}

    const response: CommonBacklinksResponse = {
      inputs: normalized,
      totalBacklinksPerDomain,
      commonRefDomains,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "공통 백링크 분석 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
