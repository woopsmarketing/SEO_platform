import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // 사용자 세션으로 관리자 권한 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const body = await request.json();
  const { status, admin_note } = body;

  const ALLOWED_STATUS = ["pending", "in_progress", "completed"];
  const updateData: Record<string, string> = {};
  if (status) {
    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json({ error: "유효하지 않은 상태입니다." }, { status: 400 });
    }
    updateData.status = status;
  }
  if (admin_note !== undefined) updateData.admin_note = admin_note;

  // RLS 우회하여 업데이트 (권한은 위에서 이미 검증)
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("inquiries")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
