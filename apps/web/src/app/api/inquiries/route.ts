import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInquiryNotification } from "@/lib/email";

const ALLOWED_SERVICE_TYPES = [
  "backlinks",
  "traffic",
  "web-design",
  "domain-broker",
  "general",
];

const ALLOWED_BUDGETS = [
  "30만원 이하",
  "30~60만원",
  "60~120만원",
  "120만원 이상",
  "상담 후 결정",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, service_type, message, company, site_url, budget, telegram } = body;

    if (!name || !email || !service_type || !message) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { error: "이름은 100자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@") || email.length > 320) {
      return NextResponse.json(
        { error: "올바른 이메일 형식을 입력해주세요." },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { error: "문의 내용은 5000자 이내로 입력해주세요." },
        { status: 400 }
      );
    }

    if (!ALLOWED_SERVICE_TYPES.includes(service_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 서비스 유형입니다." },
        { status: 400 }
      );
    }

    // 선택 필드 검증
    if (site_url !== undefined && site_url !== null) {
      if (typeof site_url !== "string" || site_url.length > 2000) {
        return NextResponse.json(
          { error: "사이트 URL은 2000자 이내로 입력해주세요." },
          { status: 400 }
        );
      }
    }

    if (budget !== undefined && budget !== null) {
      if (!ALLOWED_BUDGETS.includes(budget)) {
        return NextResponse.json(
          { error: "유효하지 않은 예산 범위입니다." },
          { status: 400 }
        );
      }
    }

    const insertData: Record<string, string> = { name, email, service_type, message };
    if (company) insertData.company = company;
    if (site_url) insertData.site_url = site_url;
    if (budget) insertData.budget = budget;
    if (telegram) insertData.telegram = telegram;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("inquiries")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 이메일 알림 (await하되, 실패해도 문의 접수 응답은 성공)
    try {
      await sendInquiryNotification({
        name,
        email,
        company,
        serviceType: service_type,
        message,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
