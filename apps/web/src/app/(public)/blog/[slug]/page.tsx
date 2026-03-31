import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { MarkdownRenderer, TableOfContents } from "@/components/blog/markdown-renderer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
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
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.updated_at ? { dateModified: post.updated_at } : {}),
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
  };

  // 관련 글 조회
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, published_at")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* 브레드크럼 */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-foreground">블로그</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{post.title}</span>
      </nav>

      {/* 커버 이미지 */}
      {post.cover_image_url && (
        <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-muted relative">
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

      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {post.published_at && (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span>SEO월드</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed border-l-4 border-blue-200 pl-4">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* 목차 */}
      <TableOfContents content={post.content} />

      {/* 본문 — 마크다운 렌더링 */}
      <div className="blog-content">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* 하단 CTA */}
      <div className="mt-12 rounded-xl bg-blue-50 border border-blue-100 p-6 text-center">
        <p className="text-lg font-bold text-blue-900">SEO 분석이 필요하신가요?</p>
        <p className="mt-2 text-sm text-blue-700">무료 SEO 도구로 웹사이트를 점검해보세요.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/tools">
            <Button>무료 도구 사용하기</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline">서비스 문의</Button>
          </Link>
        </div>
      </div>

      {/* 관련 글 */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">관련 글</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group">
                <div className="rounded-lg border p-4 transition-shadow group-hover:shadow-md">
                  <p className="text-sm font-semibold group-hover:text-blue-600 line-clamp-2">{rp.title}</p>
                  {rp.excerpt && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{rp.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="mt-8 border-t pt-6">
        <Link href="/blog">
          <Button variant="outline">블로그 목록으로</Button>
        </Link>
      </div>
    </article>
  );
}
