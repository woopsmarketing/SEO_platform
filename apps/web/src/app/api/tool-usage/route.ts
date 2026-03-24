import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool_type, input_summary, user_id } = body;

    if (!tool_type) {
      return NextResponse.json({ error: "tool_type is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("tool_usage_logs")
      .insert({
        tool_type,
        input_summary,
        user_id: user_id || null,
        ip_address: request.headers.get("x-forwarded-for") || null,
        user_agent: request.headers.get("user-agent") || null,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
