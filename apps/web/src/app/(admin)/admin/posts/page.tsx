import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostsTab } from "@/components/admin/blog-posts-tab";

export const metadata: Metadata = {
  title: "블로그 관리",
};

export default async function PostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">블로그 관리</h1>
        <p className="mt-1 text-muted-foreground">
          블로그 글을 작성하고 관리합니다.
        </p>
      </div>
      <BlogPostsTab />
    </div>
  );
}
