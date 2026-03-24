import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "글 관리",
};

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, category, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">글 관리</h1>
          <p className="mt-1 text-muted-foreground">블로그와 가이드를 작성하고 관리합니다.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>새 글 작성</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>전체 글 ({posts?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <div className="space-y-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /{post.category}/{post.slug} &middot;{" "}
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : post.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {post.status === "published" ? "발행" : post.status === "draft" ? "임시" : "보관"}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {post.category === "blog" ? "블로그" : "가이드"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">아직 작성된 글이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
