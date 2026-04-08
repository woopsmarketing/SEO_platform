import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Home } from "lucide-react";
import type { Post } from "@/lib/db/posts";
import { SITE_URL } from "@/lib/constants";
import { ReadingProgress } from "./reading-progress";

/** 본문 HTML의 <img> 태그에 loading, decoding, width, height 속성을 자동 주입 */
function optimizeContentImages(html: string): string {
  return html.replace(
    /<img\b([^>]*)>/gi,
    (match, attrs: string) => {
      // 이미 loading 속성이 있으면 건너뜀
      if (/loading\s*=/i.test(attrs)) return match;

      let optimized = attrs;

      // loading="lazy" + decoding="async" 추가
      optimized += ' loading="lazy" decoding="async"';

      // width/height 없으면 기본값 추가 (CLS 방지)
      if (!/width\s*=/i.test(optimized)) {
        optimized += ' width="800" height="450"';
      }

      // style로 반응형 보장
      if (!/style\s*=/i.test(optimized)) {
        optimized += ' style="max-width:100%;height:auto"';
      }

      return `<img${optimized}>`;
    }
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "SEO 전략": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "백링크": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "키워드 분석": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "온페이지 SEO": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "테크니컬 SEO": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const DEFAULT_CTA = {
  title: "SEO, 혼자 하기 어려우신가요?",
  description:
    "백링크 구축부터 기술 SEO까지, 전문 팀이 검색 순위를 올려드립니다. 텔레그램으로 편하게 문의하세요.",
  buttonText: "무료 상담 문의하기",
  href: "/contact",
};

interface FaqItem {
  q: string;
  a: string;
}

interface BlogLayoutProps {
  post: Post;
  faqs: FaqItem[];
  relatedPosts: Pick<Post, "title" | "slug" | "excerpt">[];
  latestPosts: Pick<Post, "title" | "slug" | "excerpt">[];
  prevPost: { title: string; slug: string } | null;
  nextPost: { title: string; slug: string } | null;
}

export function BlogLayout({
  post,
  faqs,
  relatedPosts,
  latestPosts,
  prevPost,
  nextPost,
}: BlogLayoutProps) {
  const finalCta = DEFAULT_CTA;
  const d = new Date(post.published_at);
  const dateKR = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // 최종 수정일 (published_at과 다를 때만 표시)
  const hasUpdated =
    post.updated_at &&
    post.updated_at !== post.published_at &&
    new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86400000; // 1일 이상 차이
  const updatedKR = hasUpdated
    ? (() => {
        const u = new Date(post.updated_at!);
        return `${u.getFullYear()}년 ${u.getMonth() + 1}월 ${u.getDate()}일`;
      })()
    : null;

  /* TOC: HTML에서 h2 추출 */
  const tocItems = (
    post.content.match(/<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/g) || []
  )
    .map((match) => {
      const idMatch = match.match(/id="([^"]*)"/);
      const textMatch = match.match(/>([^<]*)<\/h2>/);
      return {
        id: idMatch?.[1] || "",
        title: textMatch?.[1] || "",
      };
    })
    .filter((item) => item.id && item.title);
  if (faqs.length > 0) {
    tocItems.push({ id: "faq", title: "자주 묻는 질문" });
  }

  /* JSON-LD */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      author: { "@type": "Organization", name: "SEO월드" },
      publisher: {
        "@type": "Organization",
        name: "SEO월드",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
      },
      mainEntityOfPage: canonicalUrl,
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    },
    ...(faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "블로그",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2컬럼 레이아웃: 본문 + 사이드바 TOC */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex gap-10">
          {/* 본문 영역 */}
          <article className="min-w-0 flex-1 max-w-3xl">
            {/* 브레드크럼 */}
            <nav
              aria-label="브레드크럼"
              className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                블로그
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground truncate max-w-[200px] sm:max-w-none">
                {post.title}
              </span>
            </nav>

            {/* 제목 */}
            <h1 className="text-3xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* 메타 */}
            <div className="blog-meta mt-3">
              <time dateTime={post.published_at}>{dateKR}</time>
              {updatedKR && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span className="text-xs">수정: {updatedKR}</span>
                </>
              )}
              <span aria-hidden="true">&middot;</span>
              <span>{post.read_time} 읽기</span>
              {post.category && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category] || ""}`}
                  >
                    {post.category}
                  </span>
                </>
              )}
            </div>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 모바일 목차 (lg 이하에서만 표시) */}
            {tocItems.length > 0 && (
              <nav className="blog-toc lg:hidden">
                <p className="blog-toc-title">목차</p>
                <ol className="space-y-1.5">
                  {tocItems.map((item, i) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>
                        <span className="mr-2 text-primary font-medium">
                          {i + 1}.
                        </span>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* 본문 */}
            <div className="blog-prose mt-10">
              <div dangerouslySetInnerHTML={{ __html: optimizeContentImages(post.content) }} />

              {/* FAQ */}
              {faqs.length > 0 && (
                <section>
                  <h2 id="faq">자주 묻는 질문</h2>
                  <div className="divide-y rounded-lg border mt-4">
                    {faqs.map((item, i) => (
                      <details key={i} className="group">
                        <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium hover:bg-muted/50">
                          {item.q}
                        </summary>
                        <div className="px-5 pb-4 text-sm text-muted-foreground">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA — FAQ 바로 아래 */}
              <div className="blog-cta mt-10">
                <p className="text-lg font-semibold">{finalCta.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {finalCta.description}
                </p>
                <Link
                  href={finalCta.href}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {finalCta.buttonText}
                </Link>
              </div>
            </div>

            {/* 저자 */}
            <div className="mt-12 flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                SW
              </div>
              <div>
                <p className="font-semibold text-sm">SEO월드 팀</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  검색엔진최적화(SEO) 전문 플랫폼. 무료 분석 도구와 실전
                  가이드를 제공합니다.
                </p>
              </div>
            </div>

            {/* 관련 글 */}
            {relatedPosts.length > 0 && (
              <div className="blog-related">
                <h3 className="text-lg font-semibold mb-4">관련 글</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedPosts.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/blog/${a.slug}`}
                      className="blog-related-card"
                    >
                      <p className="font-medium text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {a.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 이전/다음글 */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" /> 이전 글
                  </span>
                  <span className="mt-1 text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col items-end rounded-lg border p-4 transition-colors hover:border-primary/50 text-right"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    다음 글 <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>

          </article>

          {/* 사이드바 TOC — 데스크탑에서만 표시 */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20 rounded-xl border border-border/60 bg-card p-5">
                <p className="mb-4 text-sm font-bold text-foreground">목차</p>
                <ol className="space-y-3 border-l-2 border-primary/20 pl-4">
                  {tocItems.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-sm text-muted-foreground transition-colors hover:text-primary leading-relaxed"
                      >
                        <span className="mr-2 text-primary font-semibold">
                          {i + 1}.
                        </span>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
                <ReadingProgress />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
