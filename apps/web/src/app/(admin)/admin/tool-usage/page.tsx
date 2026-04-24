import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageHistory } from "./tool-usage-history";

export const metadata: Metadata = {
  title: "툴 사용량",
};

export const dynamic = "force-dynamic";

export default async function ToolUsagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const admin = createAdminClient();
  const { count: totalAll } = await admin
    .from("tool_usage_logs")
    .select("*", { count: "exact", head: true });

  // KST 기준 오늘/7일/30일
  const todayKstStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const todayKstUtc = new Date(`${todayKstStr}T00:00:00+09:00`);
  const last7 = new Date(todayKstUtc.getTime() - 6 * 24 * 3600 * 1000).toISOString();
  const last30 = new Date(todayKstUtc.getTime() - 29 * 24 * 3600 * 1000).toISOString();
  const todayIso = todayKstUtc.toISOString();

  const [today, d7, d30] = await Promise.all([
    admin
      .from("tool_usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayIso),
    admin
      .from("tool_usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last7),
    admin
      .from("tool_usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last30),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">툴 사용량</h1>
        <p className="mt-2 text-muted-foreground">
          누적된 무료 툴 사용 이력을 확인합니다. (KST 기준)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>누적 전체</CardDescription>
            <CardTitle className="text-3xl">{(totalAll ?? 0).toLocaleString("ko-KR")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>오늘</CardDescription>
            <CardTitle className="text-3xl">{(today.count ?? 0).toLocaleString("ko-KR")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>최근 7일</CardDescription>
            <CardTitle className="text-3xl">{(d7.count ?? 0).toLocaleString("ko-KR")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>최근 30일</CardDescription>
            <CardTitle className="text-3xl">{(d30.count ?? 0).toLocaleString("ko-KR")}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <ToolUsageHistory />
    </div>
  );
}
