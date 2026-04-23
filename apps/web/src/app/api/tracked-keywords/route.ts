import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface TrackedKeywordInsertBody {
  domain?: unknown;
  keyword?: unknown;
  gl?: unknown;
  hl?: unknown;
}

function normalizeDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tracked_keywords")
    .select("id, domain, keyword, gl, hl, is_active, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: TrackedKeywordInsertBody;
  try {
    body = (await request.json()) as TrackedKeywordInsertBody;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof body.domain !== "string" || typeof body.keyword !== "string") {
    return NextResponse.json(
      { error: "도메인과 키워드를 입력해주세요." },
      { status: 400 },
    );
  }
  const domain = normalizeDomain(body.domain);
  if (!domain) {
    return NextResponse.json(
      { error: "올바른 도메인을 입력해주세요." },
      { status: 400 },
    );
  }
  const keyword = body.keyword.trim();
  if (!keyword) {
    return NextResponse.json(
      { error: "키워드를 입력해주세요." },
      { status: 400 },
    );
  }
  const gl =
    typeof body.gl === "string" && body.gl.trim().length > 0
      ? body.gl.trim().toLowerCase()
      : "kr";
  const hl =
    typeof body.hl === "string" && body.hl.trim().length > 0
      ? body.hl.trim().toLowerCase()
      : "ko";

  // 등록 상한 체크 (사용자당 50개)
  const { count } = await supabase
    .from("tracked_keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);
  if ((count ?? 0) >= 50) {
    return NextResponse.json(
      { error: "최대 50개까지 등록할 수 있습니다. 불필요한 항목을 삭제해주세요." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("tracked_keywords")
    .upsert(
      {
        user_id: user.id,
        domain,
        keyword,
        gl,
        hl,
        is_active: true,
      },
      { onConflict: "user_id,domain,keyword" },
    )
    .select("id, domain, keyword, gl, hl, is_active, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  // soft delete — is_active=false. 히스토리 유지.
  const { error } = await supabase
    .from("tracked_keywords")
    .update({ is_active: false })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
