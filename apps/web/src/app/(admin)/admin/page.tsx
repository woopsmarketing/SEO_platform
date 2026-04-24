import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  //    (profiles/inquiries RLS가 본인만 노출하므로 count가 왜곡되는 것을 방지)
  const admin = createAdminClient();
  const todayIso = kstTodayStartIso();

  const [
    { count: inquiryCount },
    { count: totalUsers },
    { count: todayToolUsage },
    { count: totalPosts },
  ] = await Promise.all([
    admin.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>대기 중 문의</CardDescription>
            <CardTitle className="text-3xl">{inquiryCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>최근 문의</CardTitle>
          <CardDescription>처리 대기 중인 문의입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentInquiries />
        </CardContent>
      </Card>
    </div>
  );
}

async function RecentInquiries() {
  const admin = createAdminClient();
  const { data: inquiries } = await admin
    .from("inquiries")
    .select("id, name, service_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!inquiries || inquiries.length === 0) {
    return <p className="py-4 text-center text-muted-foreground">아직 문의가 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => (
        <div key={inq.id} className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">
              {inq.name} — {inq.service_type}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(inq.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              inq.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : inq.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {inq.status === "pending" ? "대기" : inq.status === "in_progress" ? "처리중" : "완료"}
          </span>
        </div>
      ))}
    </div>
  );
}
