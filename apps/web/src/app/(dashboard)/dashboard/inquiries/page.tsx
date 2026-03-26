import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "내 문의" };

const SERVICE_LABELS: Record<string, string> = {
  backlinks: "백링크 서비스",
  traffic: "트래픽 서비스",
  "web-design": "웹 디자인",
  "domain-broker": "도메인 브로커",
  general: "일반 문의",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "대기", color: "bg-gray-100 text-gray-600" },
  in_progress: { label: "처리중", color: "bg-blue-100 text-blue-700" },
  resolved: { label: "완료", color: "bg-green-100 text-green-700" },
  closed: { label: "닫힘", color: "bg-red-100 text-red-600" },
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, service_type, status, message, created_at, admin_note")
    .eq("email", user?.email ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 문의 현황</h1>
          <p className="mt-1 text-muted-foreground">접수한 서비스 문의의 처리 상태를 확인합니다.</p>
        </div>
        <Link href="/services">
          <Button variant="outline">새 문의하기</Button>
        </Link>
      </div>

      {inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const status = STATUS_LABELS[inq.status] || STATUS_LABELS.pending;
            return (
              <Card key={inq.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{SERVICE_LABELS[inq.service_type] || inq.service_type}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                      {inq.admin_note && (
                        <div className="mt-3 rounded-md bg-blue-50 p-3">
                          <p className="text-xs font-medium text-blue-700">관리자 답변</p>
                          <p className="mt-1 text-sm text-blue-600">{inq.admin_note}</p>
                        </div>
                      )}
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {new Date(inq.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">접수한 문의가 없습니다</p>
            <p className="mt-1 text-sm">SEO 서비스에 대해 궁금한 점을 문의해보세요.</p>
            <Link href="/services">
              <Button className="mt-4">서비스 알아보기</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
