import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = {
  title: "새 글 작성",
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <PostEditor />
    </div>
  );
}
