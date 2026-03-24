import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "대시보드",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { count: analysesCount } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "");

  const { data: recentAnalyses } = await supabase
    .from("analyses")
    .select("id, tool_type, created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="mt-1 text-muted-foreground">
          분석 결과와 활동을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>총 분석</CardDescription>
            <CardTitle className="text-3xl">{analysesCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>이메일</CardDescription>
            <CardTitle className="text-lg truncate">{user?.email}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>빠른 시작</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tools">
              <Button size="sm" className="w-full">새 분석 시작</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 분석</CardTitle>
          <CardDescription>최근 실행한 분석 결과입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnalyses && recentAnalyses.length > 0 ? (
            <div className="space-y-3">
              {recentAnalyses.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">{a.tool_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <Link href={`/dashboard/analyses`}>
                    <Button variant="ghost" size="sm">보기</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>아직 분석 결과가 없습니다.</p>
              <Link href="/tools" className="mt-2 inline-block text-primary hover:underline">
                무료 툴로 첫 분석 시작하기
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
