import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 }) };
  }
  return { error: null };
}

function kstDateOf(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

export async function GET() {
  const { error: authErr } = await requireAdmin();
  if (authErr) return authErr;

  const admin = createAdminClient();

  // KST 기준 오늘 00:00 / 30일 전 00:00
  const todayKstStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const todayKstUtc = new Date(`${todayKstStr}T00:00:00+09:00`);
  const thirtyDaysAgoUtc = new Date(todayKstUtc.getTime() - 29 * 24 * 3600 * 1000);
  const sinceIso = thirtyDaysAgoUtc.toISOString();

  const [logsRes, usersRes, totalsInquiry, totalsUsers, totalsToday, totalsPosts] = await Promise.all([
    admin
      .from("tool_usage_logs")
      .select("tool_type, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true }),
    admin
      .from("profiles")
      .select("created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true }),
    admin.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("tool_usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayKstUtc.toISOString()),
    admin.from("posts").select("*", { count: "exact", head: true }),
  ]);

  if (logsRes.error || usersRes.error) {
    return NextResponse.json(
      { error: logsRes.error?.message || usersRes.error?.message || "쿼리 오류" },
      { status: 500 }
    );
  }

  // 30일 슬롯 초기화 (0으로 채우면 빈 날짜도 라인에서 연결됨)
  const dailyUsage = new Map<string, number>();
  const dailySignups = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgoUtc.getTime() + i * 24 * 3600 * 1000);
    const key = d.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
    dailyUsage.set(key, 0);
    dailySignups.set(key, 0);
  }

  const toolBreakdown = new Map<string, number>();
  for (const row of logsRes.data ?? []) {
    const key = kstDateOf(row.created_at as string);
    if (dailyUsage.has(key)) dailyUsage.set(key, (dailyUsage.get(key) ?? 0) + 1);
    const t = (row.tool_type as string) || "unknown";
    toolBreakdown.set(t, (toolBreakdown.get(t) ?? 0) + 1);
  }
  for (const row of usersRes.data ?? []) {
    const key = kstDateOf(row.created_at as string);
    if (dailySignups.has(key)) dailySignups.set(key, (dailySignups.get(key) ?? 0) + 1);
  }

  const dailyUsageArr = [...dailyUsage.entries()].map(([date, count]) => ({ date, count }));
  const dailySignupsArr = [...dailySignups.entries()].map(([date, count]) => ({ date, count }));
  const toolBreakdownArr = [...toolBreakdown.entries()]
    .map(([tool_type, count]) => ({ tool_type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return NextResponse.json(
    {
      totals: {
        inquiriesPending: totalsInquiry.count ?? 0,
        totalUsers: totalsUsers.count ?? 0,
        todayToolUsage: totalsToday.count ?? 0,
        totalPosts: totalsPosts.count ?? 0,
      },
      dailyUsage: dailyUsageArr,
      dailySignups: dailySignupsArr,
      toolBreakdown: toolBreakdownArr,
      range: { since: sinceIso, until: todayKstUtc.toISOString(), timezone: "Asia/Seoul" },
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
