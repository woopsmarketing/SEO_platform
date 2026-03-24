import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_SERVICE_TYPES = [
  "backlinks",
  "traffic",
  "web-design",
  "domain-broker",
  "general",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, service_type, message, company } = body;

    if (!name || !email || !service_type || !message) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // name length validation
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { error: "이름은 100자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    // email format validation
    if (typeof email !== "string" || !email.includes("@") || email.length > 320) {
      return NextResponse.json(
        { error: "올바른 이메일 형식을 입력해주세요." },
        { status: 400 }
      );
    }

    // message length validation
    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { error: "문의 내용은 5000자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    // service_type whitelist validation
    if (!ALLOWED_SERVICE_TYPES.includes(service_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 서비스 유형입니다." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("inquiries")
      .insert({ name, email, service_type, message, company })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
