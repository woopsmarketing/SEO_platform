import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { AUTHOR, AUTHOR_URL, getAuthorPersonSchema } from "@/lib/blog/author";
import { CATEGORY_COLORS, type BlogCategory } from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== AUTHOR.slug) return {};

  return {
    title: `${AUTHOR.name} — ${AUTHOR.jobTitle}`,
    description: AUTHOR.bio,
    alternates: { canonical: AUTHOR_URL },
    openGraph: {
      type: "profile",
      title: `${AUTHOR.name} — ${AUTHOR.jobTitle} | ${SITE_NAME}`,
      description: AUTHOR.bio,
      url: AUTHOR_URL,
      siteName: SITE_NAME,
      locale: "ko_KR",
      images: [{ url: AUTHOR.image, width: 256, height: 256, alt: AUTHOR.name }],
    },
    twitter: {
      card: "summary",
      title: `${AUTHOR.name} — ${AUTHOR.jobTitle}`,
      description: AUTHOR.bio,
      images: [AUTHOR.image],
    },
  };
}

export async function generateStaticParams() {
  return [{ slug: AUTHOR.slug }];
}

function formatDateKR(s: string): string {
  const d = new Date(s);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== AUTHOR.slug) notFound();

  const posts = await getPublishedPosts();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      ...getAuthorPersonSchema(),
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      mainEntity: {
        "@type": "Person",
        "@id": `${AUTHOR_URL}#person`,
      },
      inLanguage: "ko-KR",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "블로그", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: AUTHOR.name, item: AUTHOR_URL },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        {/* 프로필 헤더 */}
        <header className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-8">
          <Image
            src={AUTHOR.image}
            alt={AUTHOR.name}
            width={128}
            height={128}
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full shrink-0"
            unoptimized
          />
          <div className="mt-4 sm:mt-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {AUTHOR.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-primary">
              {AUTHOR.jobTitle}
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {AUTHOR.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {AUTHOR.knowsAbout.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  #{topic}
                </span>
              ))}
            </div>
            {AUTHOR.sameAs.length > 0 && (
              <div className="mt-4 flex gap-3 justify-center sm:justify-start text-sm">
                {AUTHOR.sameAs.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {new URL(url).hostname.replace("www.", "")}
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 글 목록 */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            작성한 글 <span className="text-sm font-normal text-muted-foreground">({posts.length})</span>
          </h2>
          {posts.length > 0 ? (
            <div className="grid gap-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[post.category as BlogCategory] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateKR(post.published_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.read_time}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">아직 작성된 글이 없습니다.</p>
          )}
        </section>
      </div>
    </>
  );
}
