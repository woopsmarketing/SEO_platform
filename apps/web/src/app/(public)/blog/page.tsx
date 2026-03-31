import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ISR: 60초마다 재검증
export const revalidate = 60;

export const metadata: Metadata = {
  title: "SEO 블로그 — 구글 상위노출 전략 · 검색엔진 최적화 노하우",
  description: "SEO 전략, 백링크 팁, 구글 상위노출 방법, 검색엔진 최적화 노하우, 디지털 마케팅 인사이트를 제공합니다.",
  openGraph: {
    title: "SEO 블로그 — 구글 상위노출 전략 | SEO월드",
    description: "SEO 실무 팁, 백링크 전략, 검색엔진 최적화 인사이트",
  },
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, cover_image_url, tags, published_at")
    .eq("status", "published")
    .eq("category", "blog")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">블로그</h1>
        <p className="mt-2 text-muted-foreground">
          SEO 전략, 도메인 팁, 디지털 마케팅 인사이트
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                {post.cover_image_url && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
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
          <p>아직 게시된 글이 없습니다.</p>
          <p className="mt-1 text-sm">곧 유용한 SEO 콘텐츠를 준비하겠습니다.</p>
        </div>
      )}
    </div>
  );
}
