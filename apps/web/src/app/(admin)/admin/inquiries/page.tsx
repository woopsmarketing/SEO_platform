import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryList } from "./inquiry-list";

export const metadata: Metadata = {
  title: "문의 관리",
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">문의 관리</h1>
        <p className="mt-1 text-muted-foreground">서비스 문의를 확인하고 처리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>전체 문의 ({inquiries?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <InquiryList inquiries={inquiries ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
