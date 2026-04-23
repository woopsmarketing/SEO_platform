import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";
import { fetchWithCache, type DomainMetrics } from "@/lib/cache-api";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 15;

function normalizeDomain(input: string): string | null {
  let v = input.trim().toLowerCase();
  if (!v) return null;
  if (!v.startsWith("http://") && !v.startsWith("https://")) v = "https://" + v;
  try {
    const host = new URL(v).hostname.replace(/^www\./, "");
    if (!host.includes(".")) return null;
    return host;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const loggedIn = await isAuthenticated(request);
    const limit = loggedIn ? 10 : 3;
    const rl = await checkRateLimit(ip, "domain-authority", limit, 1440);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body = (await request.json().catch(() => null)) as { domain?: unknown } | null;
    const domainInput = body && typeof body.domain === "string" ? body.domain : "";
    const domain = normalizeDomain(domainInput);
    if (!domain) {
      return NextResponse.json({ error: "올바른 도메인을 입력해주세요." }, { status: 400 });
    }

    // GET-only: SEO월드는 RapidAPI 키가 없음. 캐시 MISS이면 데이터 준비 중 안내.
    const metrics = await fetchWithCache<DomainMetrics>("metrics", { domain });

    // 사용 로그
    try {
      const admin = createAdminClient();
      await admin.from("tool_usage_logs").insert({
        tool_type: "domain-authority",
        input_summary: domain,
        ip_address: ip,
      });
    } catch {
      // 로그 실패는 무시
    }

    if (!metrics) {
      return NextResponse.json(
        {
          domain,
          metrics: null,
          pending: true,
          message:
            "도메인 지표 데이터를 준비 중입니다. 잠시 후 다시 시도해주세요. (최초 조회 시 수집까지 수 분 소요)",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ domain, metrics, pending: false });
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
