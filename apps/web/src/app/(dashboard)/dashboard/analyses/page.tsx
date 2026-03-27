import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AnalysesList } from "./analyses-list";

export const metadata: Metadata = { title: "분석 이력" };

export default async function AnalysesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, tool_type, input_summary, score, result, created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(100);

  return <AnalysesList analyses={analyses || []} />;
}
