import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminCharts } from "./admin-charts";

export const metadata: Metadata = {
  title: "관리자",
};

export const dynamic = "force-dynamic";

// KST(Asia/Seoul) 기준 오늘 00:00을 UTC ISO로 환산
function kstTodayStartIso(): string {
  const kstDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  return new Date(`${kstDate}T00:00:00+09:00`).toISOString();
}

export default async function AdminPage() {
  // 1) 사용자 세션 기반 인증 체크 (RLS 필요)
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

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // 2) 통계 쿼리 — RLS 우회를 위해 service_role 사용
  const admin = createAdminClient();
  const todayIso = kstTodayStartIso();

  const [
    { count: totalUsers },
    { count: todayToolUsage },
    { count: totalPosts },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("tool_usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayIso),
    admin.from("posts").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="mt-1 text-muted-foreground">사이트 운영 현황과 추이를 한눈에 확인합니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>전체 회원</CardDescription>
            <CardTitle className="text-3xl">{totalUsers ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>오늘 툴 사용 (KST)</CardDescription>
            <CardTitle className="text-3xl">{todayToolUsage ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>게시글 수</CardDescription>
            <CardTitle className="text-3xl">{totalPosts ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <AdminCharts />
    </div>
  );
}
