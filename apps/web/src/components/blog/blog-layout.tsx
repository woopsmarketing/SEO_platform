import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Home } from "lucide-react";
import type { Post, CtaStrength } from "@/lib/db/posts";
import Image from "next/image";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { ReadingProgress } from "./reading-progress";
import { TocList } from "./toc-list";
import { ShareButtons, CopyUrlButton } from "./share-buttons";
import { extractHowToSteps } from "@/lib/blog/extract-howto-steps";
import { AUTHOR, AUTHOR_URL, getAuthorPersonSchema } from "@/lib/blog/author";

/** 본문 HTML의 <img> 태그에 loading, decoding, width, height, alt 속성을 자동 주입 */
function optimizeContentImages(html: string, fallbackAlt: string): string {
  const escapedAlt = fallbackAlt.replace(/"/g, "&quot;");
  return html.replace(
    /<img\b([^>]*)>/gi,
    (match, attrs: string) => {
      let optimized = attrs;

      // alt 누락 시 글 제목으로 fallback (SEO 필수)
      if (!/\salt\s*=/i.test(optimized)) {
        optimized += ` alt="${escapedAlt}"`;
      }

      // 이미 loading 속성이 있으면 나머지는 건너뜀
      if (/loading\s*=/i.test(attrs)) return `<img${optimized}>`;

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

/** 본문에서 한글 글자수 계산 (HTML/공백 제외) */
function calcWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, "").length;
}

const CATEGORY_COLORS: Record<string, string> = {
  "SEO 전략": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "백링크": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "키워드 분석": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "온페이지 SEO": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "테크니컬 SEO": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

/* CTA 4종 — customerPsychology.ctaStrength 기반 분기
 * - weak           (informational): 도구 안내, 광고감 0
 * - medium         (problem-solving / troubleshooting / validation): 함께 진행 톤
 * - medium-strong  (comparison): 비교 후 추천
 * - strong         (purchase-intent): 직접 시작 안내
 */
const CTA_BY_STRENGTH: Record<
  CtaStrength,
  { title: string; description: string; buttonText: string; href: string; box: string; button: string }
> = {
  weak: {
    title: "지금 시작하기 막막하다면, 무료 SEO 도구로 가볍게 진단부터",
    description:
      "회원가입 없이 바로 쓰는 무료 도구들 — 키워드·백링크·온페이지 진단까지 한 번에 점검해볼 수 있습니다.",
    buttonText: "무료 도구 둘러보기",
    href: "/tools",
    box: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-900/40 border border-slate-200/70 dark:border-slate-700/50",
    button:
      "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
  },
  medium: {
    title: "이 과정을 직접 정리하기 어렵다면, 함께 진행하는 방식도 있습니다",
    description:
      "사이트 상황에 맞춰 진단부터 단계별 해결까지, 전문가가 함께 정리해드립니다.",
    buttonText: "무료 상담 받아보기",
    href: "/contact",
    box: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white",
    button:
      "bg-white text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg hover:-translate-y-0.5",
  },
  "medium-strong": {
    title: "여러 방법을 비교해봤다면, 다음 단계가 무엇인지 함께 점검해드립니다",
    description:
      "직접 비교한 옵션을 바탕으로 사이트에 가장 적합한 전략을 함께 설계합니다.",
    buttonText: "맞춤 전략 받기",
    href: "/contact",
    box: "bg-gradient-to-br from-indigo-700 to-purple-700 text-white",
    button:
      "bg-white text-indigo-700 hover:bg-indigo-50 shadow-md hover:shadow-lg hover:-translate-y-0.5",
  },
  strong: {
    title: "지금 결정만 남았다면, 컨설팅으로 바로 시작할 수 있습니다",
    description:
      "SEO 전략 수립부터 실행, 측정까지 처음부터 끝까지 함께 진행합니다.",
    buttonText: "전문 상담 시작하기",
    href: "/services",
    box: "bg-gradient-to-br from-slate-900 to-slate-800 text-white ring-1 ring-amber-500/30",
    button:
      "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-md hover:shadow-lg hover:-translate-y-0.5",
  },
};

function pickCta(strength: CtaStrength | null | undefined) {
  // NULL/undefined fallback = 'weak' (가장 안전, 광고감 0)
  return CTA_BY_STRENGTH[strength ?? "weak"] ?? CTA_BY_STRENGTH.weak;
}

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
  const finalCta = pickCta(post.cta_strength);
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

  /* HowTo schema 자동 감지 — 본문에서 단계형 H2/H3 추출 (3개 이상일 때만) */
  const howToSteps = extractHowToSteps(post.content);
  const hasHowTo = howToSteps.length >= 3;

  /* JSON-LD */
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    wordCount: calcWordCount(post.content),
    author: getAuthorPersonSchema(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
  };
  if (post.cover_image_url) {
    articleSchema.image = {
      "@type": "ImageObject",
      url: post.cover_image_url,
      width: 1200,
      height: 630,
    };
  }
  if (post.category) articleSchema.articleSection = post.category;
  if (post.tags.length > 0) articleSchema.keywords = post.tags.join(", ");

  // about — 글의 주된 주제 (Knowledge Graph 연결 시그널)
  if (post.category) {
    articleSchema.about = [{ "@type": "Thing", name: post.category }];
  }
  // mentions — 글이 언급하는 부수적 엔티티 (AEO + 검색엔진 엔티티 추출)
  if (post.tags.length > 0) {
    articleSchema.mentions = post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    }));
  }

  const jsonLd: Record<string, unknown>[] = [
    articleSchema,
    ...(faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "ko-KR",
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["[data-speakable]", ".blog-faq-answer"],
            },
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
    ...(hasHowTo
      ? [
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: post.title,
            description: post.excerpt,
            inLanguage: "ko-KR",
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            ...(post.cover_image_url && {
              image: { "@type": "ImageObject", url: post.cover_image_url },
            }),
            step: howToSteps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.text,
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

            {/* 메타 — 좌측: 날짜/시간/카테고리, 우측: URL 복사 (모바일 wrap) */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="blog-meta">
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
              <CopyUrlButton url={canonicalUrl} />
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

            {/* 모바일 목차 (lg 이하에서만 표시) — 접힌 상태로 시작 */}
            {tocItems.length > 0 && (
              <details className="blog-toc-mobile lg:hidden">
                <summary className="blog-toc-mobile-summary">
                  <span className="blog-toc-mobile-title">
                    목차 <span className="blog-toc-mobile-count">{tocItems.length}</span>
                  </span>
                  <svg
                    className="blog-toc-mobile-chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <ol className="blog-toc-mobile-list">
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
              </details>
            )}

            {/* 본문 */}
            <div className="blog-prose mt-10">
              <div dangerouslySetInnerHTML={{ __html: optimizeContentImages(post.content, post.title) }} />

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
                        <div className="blog-faq-answer px-5 pb-4 text-sm text-muted-foreground">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* CTA — FAQ 바로 아래, blog-prose 밖 (customerPsychology.ctaStrength 기반 4종 분기) */}
            <div className={`mt-12 rounded-2xl p-10 text-center shadow-lg ${finalCta.box}`}>
              <p className="text-2xl sm:text-3xl font-bold leading-tight">
                {finalCta.title}
              </p>
              <p className="mt-3 text-base max-w-lg mx-auto leading-relaxed opacity-90">
                {finalCta.description}
              </p>
              <Link
                href={finalCta.href}
                className={`mt-6 inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold no-underline transition-all ${finalCta.button}`}
              >
                {finalCta.buttonText}
              </Link>
            </div>

            {/* 공유 버튼 */}
            <ShareButtons url={canonicalUrl} title={post.title} />

            {/* 저자 */}
            <Link
              href={`/author/${AUTHOR.slug}`}
              className="mt-12 flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <Image
                src={AUTHOR.image}
                alt={AUTHOR.name}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full"
                unoptimized
              />
              <div>
                <p className="font-semibold text-sm">
                  {AUTHOR.name} · {AUTHOR.jobTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {AUTHOR.bio}
                </p>
              </div>
            </Link>

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

          {/* 사이드바 TOC — 데스크탑에서만 표시 (active highlight) */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20 rounded-xl border border-border/60 bg-card p-5">
                <p className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  목차
                </p>
                <TocList items={tocItems} />
                <ReadingProgress />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
