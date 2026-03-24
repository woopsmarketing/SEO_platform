import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = {
  title: "글 수정",
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single();
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <PostEditor post={post} />
    </div>
  );
}
