import { createAdminClient } from "@/lib/supabase/admin";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds
}

/**
 * DB 기반 Rate Limit — tool_usage_logs 테이블의 IP + 시간으로 체크
 *
 * @param ip - 클라이언트 IP
 * @param toolType - 도구 타입 (rate limit 그룹)
 * @param maxRequests - 허용 최대 요청 수
 * @param windowMinutes - 시간 윈도우 (분)
 */
export async function checkRateLimit(
  ip: string,
  toolType: string,
  maxRequests = 10,
  windowMinutes = 60
): Promise<RateLimitResult> {
  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("tool_usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("tool_type", toolType)
    .eq("ip_address", ip)
    .gte("created_at", windowStart);

  const used = count ?? 0;
  const allowed = used < maxRequests;
  const remaining = Math.max(0, maxRequests - used);

  return {
    allowed,
    remaining,
    resetIn: windowMinutes * 60,
  };
}

/**
 * request 객체에서 IP 추출
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
