import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL } from "@/lib/constants";
import { CATEGORY_COLORS, type BlogCategory } from "@/lib/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "SEO 블로그 — 구글 상위노출 전략 · 검색엔진 최적화 노하우",
  description:
    "SEO 전략, 백링크 팁, 구글 상위노출 방법, 검색엔진 최적화 노하우, 디지털 마케팅 인사이트를 제공합니다.",
  keywords: [
    "SEO 블로그",
    "구글 상위노출",
    "백링크 전략",
    "키워드 분석",
    "검색엔진 최적화",
  ],
  openGraph: {
    title: "SEO 블로그 — 구글 상위노출 전략 | SEO월드",
    description: "SEO 실무 팁, 백링크 전략, 검색엔진 최적화 인사이트",
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

function formatDateKR(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const categories = [
    "전체",
    ...Array.from(new Set(posts.map((p) => p.category))),
  ];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <h1 className="text-3xl font-bold tracking-tight">블로그</h1>
      <p className="mt-2 text-muted-foreground">
        SEO 전략, 백링크 팁, 검색엔진 최적화 인사이트
      </p>

      {/* 카테고리 배지 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              cat === "전체"
                ? "bg-foreground/10 text-foreground"
                : CATEGORY_COLORS[cat as BlogCategory] ||
                  "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-4">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <div className="blog-card">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* 썸네일 */}
                  {post.cover_image_url && (
                    <div className="relative w-full sm:w-32 sm:h-24 h-40 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 128px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            CATEGORY_COLORS[post.category as BlogCategory] ||
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {post.category}
                        </span>
                        {index === 0 && (
                          <span className="blog-badge-new">NEW</span>
                        )}
                      </div>

                      <h2 className="blog-card-title">{post.title}</h2>

                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>

                      <span className="blog-card-arrow mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        읽어보기 <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 text-xs text-muted-foreground shrink-0">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateKR(post.published_at)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.read_time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 py-16 text-center text-muted-foreground">
          <p>아직 게시된 글이 없습니다.</p>
          <p className="mt-1 text-sm">
            곧 유용한 SEO 콘텐츠를 준비하겠습니다.
          </p>
        </div>
      )}
    </div>
  );
}
