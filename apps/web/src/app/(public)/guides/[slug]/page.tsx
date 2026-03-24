import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

interface GuidePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .eq("status", "published")
    .eq("category", "guide")
    .single();

  if (!post) return { title: "가이드를 찾을 수 없습니다" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
    },
    alternates: { canonical: `/guides/${params.slug}` },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .eq("category", "guide")
    .single();

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; 가이드 목록
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
        {post.published_at && (
          <p className="mt-2 text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        )}
      </header>

      <div className="prose prose-gray max-w-none">
        {post.content.split("\n").map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <Link href="/guides">
          <Button variant="outline">다른 가이드 보기</Button>
        </Link>
      </div>
    </article>
  );
}
