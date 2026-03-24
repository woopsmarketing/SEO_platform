import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image_url")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "게시글을 찾을 수 없습니다" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
    },
    alternates: { canonical: `/blog/${params.slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mb-8">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; 블로그 목록
        </Link>
      </div>

      {post.cover_image_url && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg bg-muted relative">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
        {post.published_at && (
          <p className="mt-2 text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-gray max-w-none">
        {post.content.split("\n").map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <Link href="/blog">
          <Button variant="outline">다른 글 보기</Button>
        </Link>
      </div>
    </article>
  );
}
