import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "프로필 설정" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">프로필 설정</h1>
        <p className="mt-1 text-muted-foreground">계정 정보를 확인하고 수정합니다.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">계정 정보</CardTitle>
            <CardDescription>기본 계정 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">이메일</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">가입 방법</span>
              <span className="font-medium">{user?.app_metadata?.provider === "google" ? "Google" : "이메일"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">가입일</span>
              <span className="font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">역할</span>
              <span className="font-medium">{profile?.role === "admin" ? "관리자" : "일반 회원"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">프로필 수정</CardTitle>
            <CardDescription>이름을 변경할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm
              currentName={profile?.display_name || user?.user_metadata?.display_name || user?.user_metadata?.full_name || ""}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
