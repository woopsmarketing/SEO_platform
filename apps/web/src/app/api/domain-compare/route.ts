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
    const rl = await checkRateLimit(ip, "domain-compare", limit, 1440);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `일일 분석 횟수(${limit}회)를 초과했습니다.`, upgrade: true, remaining: 0 },
        { status: 429, headers: { "Retry-After": String(rl.resetIn) } },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { domainA?: unknown; domainB?: unknown }
      | null;
    const aInput = body && typeof body.domainA === "string" ? body.domainA : "";
    const bInput = body && typeof body.domainB === "string" ? body.domainB : "";
    const domainA = normalizeDomain(aInput);
    const domainB = normalizeDomain(bInput);
    if (!domainA || !domainB) {
      return NextResponse.json({ error: "두 개의 올바른 도메인을 입력해주세요." }, { status: 400 });
    }
    if (domainA === domainB) {
      return NextResponse.json({ error: "서로 다른 도메인을 입력해주세요." }, { status: 400 });
    }

    // GET-only 캐시 병렬 조회
    const [metricsA, metricsB] = await Promise.all([
      fetchWithCache<DomainMetrics>("metrics", { domain: domainA }),
      fetchWithCache<DomainMetrics>("metrics", { domain: domainB }),
    ]);

    try {
      const admin = createAdminClient();
      await admin.from("tool_usage_logs").insert({
        tool_type: "domain-compare",
        input_summary: `${domainA} vs ${domainB}`,
        ip_address: ip,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      a: { domain: domainA, metrics: metricsA, pending: !metricsA },
      b: { domain: domainB, metrics: metricsB, pending: !metricsB },
    });
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
