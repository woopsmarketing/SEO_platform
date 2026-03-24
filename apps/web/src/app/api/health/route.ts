import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  let dbStatus = "disconnected";
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    dbStatus = !error ? "connected" : `error: ${error.message}`;
  } catch (e) {
    dbStatus = "unreachable";
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
}
