import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "분석 이력" };

export default async function AnalysesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, tool_type, input_summary, score, created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">분석 이력</h1>
          <p className="mt-1 text-muted-foreground">저장된 SEO 분석 결과를 확인하고 관리합니다.</p>
        </div>
        <Link href="/tools">
          <Button>새 분석 시작</Button>
        </Link>
      </div>

      {analyses && analyses.length > 0 ? (
        <div className="space-y-3">
          {analyses.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.input_summary || "(제목 없음)"}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.tool_type === "onpage-audit" ? "온페이지 SEO 분석" :
                     a.tool_type === "meta-analyzer" ? "메타태그 분석" :
                     a.tool_type === "meta-generator" ? "메타태그 분석" : a.tool_type}
                    {" "}&middot;{" "}
                    {new Date(a.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                {a.score != null && (
                  <div className={`rounded-full px-3 py-1 text-sm font-bold ${
                    a.score >= 80 ? "bg-green-100 text-green-700" :
                    a.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {a.score}점
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">아직 분석 결과가 없습니다</p>
            <p className="mt-1 text-sm">무료 SEO 도구로 웹사이트를 분석해보세요.</p>
            <Link href="/tools">
              <Button className="mt-4">무료 분석 시작하기</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
