import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SEO 가이드",
  description: "SEO 초보자부터 실무자까지, 단계별 가이드와 실전 튜토리얼로 검색엔진 최적화를 학습하세요.",
  openGraph: {
    title: "SEO 가이드 | SEO월드",
    description: "단계별 SEO 가이드와 실전 튜토리얼",
  },
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, cover_image_url, tags, published_at")
    .eq("status", "published")
    .eq("category", "guide")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">가이드</h1>
        <p className="mt-2 text-muted-foreground">
          SEO 초보자를 위한 단계별 가이드와 실전 튜토리얼
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/guides/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  {post.published_at && (
                    <CardDescription>
                      {new Date(post.published_at).toLocaleDateString("ko-KR")}
                    </CardDescription>
                  )}
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          <p>아직 게시된 가이드가 없습니다.</p>
          <p className="mt-1 text-sm">곧 유용한 SEO 가이드를 준비하겠습니다.</p>
        </div>
      )}
    </div>
  );
}
