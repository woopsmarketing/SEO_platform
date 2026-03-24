import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "관리자",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 관리자 권한 체크
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // 통계 쿼리
  const { count: inquiryCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: todayToolUsage } = await supabase
    .from("tool_usage_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="mt-1 text-muted-foreground">사이트 운영 현황을 확인합니다.</p>
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
            <CardDescription>오늘 툴 사용</CardDescription>
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
  const supabase = await createClient();
  const { data: inquiries } = await supabase
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
            <p className="text-sm font-medium">{inq.name} — {inq.service_type}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(inq.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            inq.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : inq.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
          }`}>
            {inq.status === "pending" ? "대기" : inq.status === "in_progress" ? "처리중" : "완료"}
          </span>
        </div>
      ))}
    </div>
  );
}
