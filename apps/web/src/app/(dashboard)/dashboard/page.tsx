import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "대시보드" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const { count: analysesCount } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: inquiriesCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("email", user?.email ?? "");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, balance")
    .eq("id", userId)
    .single();

  const { data: recentAnalyses } = await supabase
    .from("analyses")
    .select("id, tool_type, input_summary, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInquiries } = await supabase
    .from("inquiries")
    .select("id, service_type, status, created_at")
    .eq("email", user?.email ?? "")
    .order("created_at", { ascending: false })
    .limit(3);

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "회원";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{displayName}님, 안녕하세요</h1>
        <p className="mt-1 text-muted-foreground">SEO 분석 결과와 활동을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>총 분석</CardDescription>
            <CardTitle className="text-3xl">{analysesCount ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/analyses" className="text-xs text-primary hover:underline">분석 이력 보기</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>서비스 문의</CardDescription>
            <CardTitle className="text-3xl">{inquiriesCount ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/inquiries" className="text-xs text-primary hover:underline">문의 현황 보기</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>구독 플랜</CardDescription>
            <CardTitle className="text-3xl">
              <span className={`inline-block rounded-full px-3 py-0.5 text-sm font-bold ${
                profile?.plan === "pro" ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-600"
              }`}>
                {profile?.plan === "pro" ? "Pro" : "Free"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings" className="text-xs text-primary hover:underline">플랜 관리</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>잔액</CardDescription>
            <CardTitle className="text-3xl">{`₩${(profile?.balance ?? 0).toLocaleString()}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/tools/onpage-audit" className="text-xs text-primary hover:underline">SEO 분석하기</Link>
          </CardContent>
        </Card>
      </div>

      {/* 최근 분석 + 최근 문의 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 분석</CardTitle>
            <CardDescription>최근 실행한 SEO 분석 결과</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnalyses && recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.input_summary || a.tool_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.tool_type} &middot; {new Date(a.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/analyses" className="block text-center text-sm text-primary hover:underline">
                  전체 보기
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>아직 분석 결과가 없습니다.</p>
                <Link href="/tools" className="mt-2 inline-block text-primary hover:underline">
                  무료 도구로 첫 분석 시작하기
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">내 문의 현황</CardTitle>
            <CardDescription>접수한 서비스 문의 상태</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInquiries && recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">{inq.service_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      inq.status === "resolved" ? "bg-green-100 text-green-700" :
                      inq.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {inq.status === "resolved" ? "완료" : inq.status === "in_progress" ? "처리중" : "대기"}
                    </span>
                  </div>
                ))}
                <Link href="/dashboard/inquiries" className="block text-center text-sm text-primary hover:underline">
                  전체 보기
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>접수한 문의가 없습니다.</p>
                <Link href="/services" className="mt-2 inline-block text-primary hover:underline">
                  서비스 알아보기
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
