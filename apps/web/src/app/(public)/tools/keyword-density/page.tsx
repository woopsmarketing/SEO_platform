import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { KeywordDensityForm } from "./keyword-density-form";

export const metadata: Metadata = {
  title: "키워드 밀도 분석기 — 웹페이지 키워드 밀도 & 스터핑 체크 | SEO월드",
  description:
    "URL과 타겟 키워드를 입력하면 키워드 밀도(%), 사용 빈도, 제목·설명·H1 포함 여부를 즉시 분석합니다. SEO 키워드 밀도 체크와 키워드 스터핑 확인에 활용하세요.",
  openGraph: {
    title: "키워드 밀도 분석기 — 웹페이지 키워드 밀도 체크 | SEO월드",
    description:
      "URL과 키워드를 입력하면 키워드 밀도, 사용 빈도, 제목/설명 포함 여부를 분석합니다. 무료 SEO 키워드 밀도 체크 도구.",
  },
  alternates: { canonical: "/tools/keyword-density" },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "키워드 밀도 분석기",
  url: "https://seoworld.co.kr/tools/keyword-density",
  description:
    "URL과 타겟 키워드를 입력하면 키워드 밀도(%), 사용 빈도, 제목·메타설명·H1 포함 여부를 분석하는 무료 SEO 도구입니다.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "키워드 밀도가 높을수록 검색 순위가 오르나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아닙니다. 과거에는 키워드 밀도가 순위에 직접 영향을 주었지만, 현재 Google은 키워드 밀도보다 검색 의도 일치, 콘텐츠 품질, 사용자 경험을 우선합니다. 키워드를 과도하게 반복하면 오히려 스패머로 분류되어 순위가 하락할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "적정 키워드 밀도는 몇 %인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1차 키워드는 1~2%, 2차 키워드는 0.5% 내외가 일반적인 권장 구간입니다. 다만 이 수치는 절대 기준이 아니며, 자연스러운 문장 속에 맥락 있게 사용하는 것이 수치를 맞추는 것보다 중요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "키워드 스터핑이란 무엇이고 페널티가 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "키워드 스터핑(Keyword Stuffing)은 검색 순위를 조작하기 위해 동일 키워드를 비정상적으로 반복하는 행위입니다. Google은 이를 스팸 정책 위반으로 보고 수동 조치 또는 알고리즘 페널티를 부과할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "타이틀과 H1에 키워드를 반드시 넣어야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "강제는 아니지만, 타이틀과 H1에 핵심 키워드가 포함되면 검색엔진이 페이지 주제를 더 명확하게 파악합니다. 메타태그 분석기(seoworld.co.kr/tools/meta-generator)로 타이틀·설명 최적화 여부를 함께 점검하세요.",
      },
    },
    {
      "@type": "Question",
      name: "내 글의 키워드를 더 확장하고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "연관 키워드 도구(seoworld.co.kr/tools/keyword-related)와 롱테일 키워드 도구(seoworld.co.kr/tools/longtail-keywords)를 사용하면 주제와 관련된 파생·롱테일 키워드를 발굴할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁 콘텐츠가 다루는 주제를 파악하려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "콘텐츠 갭 분석 도구(seoworld.co.kr/tools/content-gap)를 이용하면 경쟁 페이지에서 다루는 주제와 내 콘텐츠 간의 차이를 확인할 수 있습니다.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "키워드 밀도 분석하는 방법",
  description:
    "SEO월드 키워드 밀도 분석기를 사용하여 웹페이지의 키워드 밀도를 확인하고 최적화하는 방법입니다.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "URL과 키워드 입력",
      text: "분석할 웹페이지의 URL과 타겟 키워드를 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "키워드 밀도 결과 확인",
      text: "키워드 사용 횟수, 밀도(%), 제목·설명 포함 여부를 확인합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "콘텐츠 최적화",
      text: "결과를 바탕으로 키워드 사용 빈도를 조절하고 자연스러운 배치로 콘텐츠를 개선합니다.",
    },
  ],
};

export default function KeywordDensityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">사이트 키워드 분석기</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            키워드 밀도 &amp; 제목·설명 포함 여부 진단
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            URL과 타겟 키워드를 입력하면 웹페이지 키워드 밀도(%), 사용 빈도,
            제목·메타설명·H1 포함 여부를 즉시 분석합니다.
            SEO 키워드 밀도 체크와 키워드 스터핑 확인에 활용하세요.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="border-orange-100 bg-orange-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-orange-900">
                키워드 밀도란?
              </h2>
              <p className="text-xs leading-relaxed text-orange-800/80">
                웹페이지 전체 단어 수 대비 특정 키워드가 등장하는 비율입니다.
                1차 키워드는 1~2%, 2차 키워드는 0.5% 내외가 권장 구간입니다.
                지나친 반복은 키워드 스터핑으로 간주되어 구글 페널티를 받을 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-blue-900">
                SEO 키워드 밀도 체크
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                타겟 키워드가 제목(title), 메타 설명(description), H1에
                포함되어 있는지 확인합니다. 본문 사용 빈도뿐 아니라
                자연스러운 맥락 배치가 핵심이며, 동의어와 LSI 키워드를
                함께 활용하면 효과적입니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-green-900">
                이 도구의 이점
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                URL과 키워드를 입력하면 키워드 사용 횟수, 밀도 퍼센트,
                가중치, 제목·설명 포함 여부를 한눈에 확인합니다.
                내 사이트와 경쟁사 페이지 모두 웹페이지 키워드 분석이 가능한
                무료 도구입니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-5">
            <div className="mb-3 text-2xl">1&#xFE0F;&#x20E3;</div>
            <h3 className="mb-1 text-sm font-semibold">URL과 키워드 입력</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              분석할 웹페이지 URL과 타겟 키워드를 입력합니다.
              https:// 없이 도메인만 입력해도 자동 인식됩니다.
              내 사이트와 경쟁사 모두 키워드 사용 빈도 분석이 가능합니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="mb-3 text-2xl">2&#xFE0F;&#x20E3;</div>
            <h3 className="mb-1 text-sm font-semibold">키워드 밀도 결과 확인</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              키워드 사용 횟수, 밀도(%), 가중치, 제목·설명 포함 여부를
              표로 확인합니다. 밀도 1~2% 녹색, 3~5% 노란색, 5% 이상 빨간색으로
              즉시 상태를 파악할 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="mb-3 text-2xl">3&#xFE0F;&#x20E3;</div>
            <h3 className="mb-1 text-sm font-semibold">콘텐츠 최적화</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              결과를 바탕으로 키워드 사용 빈도를 조절합니다. 동의어·파생어·
              LSI 키워드를 활용해 자연스러운 배치를 유지하면서
              SEO 경쟁력을 높이세요.
            </p>
          </div>
        </div>

        {/* Form */}
        <KeywordDensityForm />

        {/* 가이드 article */}
        <article className="mt-16 border-t pt-12 space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-3">
              키워드 밀도란 무엇이고 왜 논쟁적인가
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              키워드 밀도(Keyword Density)는 웹페이지 전체 단어 수 대비 특정 키워드가
              등장하는 비율로, 과거 SEO에서는 순위를 결정하는 핵심 지표로 여겨졌습니다.
              2000년대 초반에는 키워드를 많이 반복할수록 검색 순위가 올라가는 경우도
              있었기 때문에, 웹마스터들은 의도적으로 키워드를 과밀 삽입하는 전략을
              사용했습니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              하지만 현재 Google은 단순 키워드 반복보다 검색 의도(Search Intent) 일치,
              콘텐츠 품질, E-E-A-T(경험·전문성·권위·신뢰성)를 훨씬 더 중요하게
              평가합니다. 키워드를 자연스럽지 않게 반복하면 오히려 스팸으로 간주되어
              페널티를 받을 위험이 있습니다. 따라서 키워드 밀도는 &ldquo;최소한의 체크리스트&rdquo;로
              활용하되, 맥락 있는 자연스러운 문장 구성이 항상 1순위입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              적정 키워드 밀도 구간
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              업계에서 일반적으로 권장되는 구간은 1차 키워드 1~2%, 2차 키워드 0.5% 내외입니다.
              예를 들어 1,000단어 본문이라면 1차 키워드는 10~20회, 2차 키워드는 5회 안팎이
              자연스러운 수준입니다. 3%를 초과하면 키워드 스터핑 의심 구간이 되고,
              5% 이상은 Google의 스팸 필터에 걸릴 가능성이 높아집니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              그러나 이 수치는 절대 기준이 아닙니다. 콘텐츠의 길이, 주제의 전문성, 경쟁 페이지의
              밀도에 따라 적정 구간은 달라집니다. 경쟁사 상위 페이지의 키워드 밀도를 이 도구로
              먼저 확인한 뒤, 비슷한 수준을 유지하면서 맥락 있는 사용에 집중하는 전략이 효과적입니다.
              핵심은 수치 맞추기가 아닌, 독자가 자연스럽게 읽히는 문장입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              제목 · H1 · 첫 100단어에 키워드를 넣어야 하는 이유
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Google 크롤러는 페이지를 인덱싱할 때 제목(title), H1, 본문 앞부분에 등장하는
              키워드에 더 높은 가중치를 부여합니다. 이 위치들은 페이지가 어떤 주제를 다루는지
              검색엔진에 명확히 전달하는 신호 역할을 합니다. 특히 title 태그에 핵심 키워드가
              포함되면 검색결과 제목에 직접 노출되어 클릭률(CTR)을 높이는 효과도 있습니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              H1은 페이지의 대주제를 나타내는 태그로, 타겟 키워드를 자연스럽게 포함하는 것이
              좋습니다. 본문 첫 100단어 이내에 핵심 키워드를 한 번 이상 배치하면 주제 연관성
              신호를 강화할 수 있습니다. 또한 LSI(Latent Semantic Indexing) 키워드,
              즉 주제와 의미적으로 연관된 단어들을 함께 사용하면 Google이 콘텐츠의 전체 맥락을
              더 정확하게 이해합니다. 예를 들어 &ldquo;키워드 밀도&rdquo;를 다루는 페이지라면
              &ldquo;콘텐츠 최적화&rdquo;, &ldquo;검색 의도&rdquo;, &ldquo;온페이지 SEO&rdquo; 같은 연관 표현을 함께 사용하세요.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              키워드 스터핑 피하면서 SEO 잘 쓰는 법
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              키워드 스터핑을 피하는 가장 쉬운 방법은 동의어와 파생어를 활용하는 것입니다.
              &ldquo;키워드 밀도&rdquo; 대신 &ldquo;키워드 사용 비율&rdquo;, &ldquo;키워드 출현 빈도&rdquo;, &ldquo;키워드 분포&rdquo; 등을
              번갈아 사용하면 자연스러운 문장을 유지하면서도 관련 키워드 신호를 넓힐 수 있습니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              LSI 키워드는 주제와 의미적으로 연관된 단어들로, Google이 페이지의 전체 맥락을
              이해하는 데 사용합니다. 직접적인 타겟 키워드를 줄이고 LSI 키워드를 늘리면
              스터핑 위험 없이 주제 연관성을 강화할 수 있습니다. 결국 SEO에서 가장 중요한
              원칙은 &ldquo;사람이 읽기 편한 글이 검색엔진도 좋아한다&rdquo;입니다. 키워드 밀도 도구는
              내 콘텐츠가 적정 범위에 있는지 점검하는 용도로 사용하고, 실제 작성은 독자를
              위한 자연스러운 문장을 최우선으로 삼으세요.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">키워드 밀도 분석 FAQ</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                키워드 밀도가 높을수록 순위가 오르나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                아닙니다. 현재 Google은 검색 의도 일치, 콘텐츠 품질, 사용자 경험을
                키워드 밀도보다 훨씬 중요하게 평가합니다. 키워드를 과도하게 반복하면
                오히려 스팸으로 분류되어 순위가 하락할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                적정 키워드 밀도는 몇 %인가요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                1차 키워드는 1~2%, 2차 키워드는 0.5% 내외가 일반적인 권장 구간입니다.
                다만 절대 기준은 없으며, 자연스러운 문장 속에 맥락 있게 사용하는 것이
                수치를 맞추는 것보다 중요합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                키워드 스터핑은 무엇이고 페널티가 있나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                키워드 스터핑은 검색 순위 조작을 위해 동일 키워드를 비정상적으로 반복하는 행위입니다.
                Google은 이를 스팸 정책 위반으로 보고 수동 조치 또는 알고리즘 페널티를 부과할 수 있습니다.
                이 도구로 5% 초과 키워드를 미리 발견해 수정하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                타이틀/H1에 키워드를 넣어야만 하나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                강제는 아니지만, 타이틀과 H1에 핵심 키워드가 포함되면 검색엔진이 페이지 주제를
                더 명확하게 파악합니다.{" "}
                <a href="/tools/meta-generator" className="text-primary underline underline-offset-2">
                  메타태그 분석기
                </a>
                로 타이틀·설명 최적화 여부를 함께 점검하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                내 글의 키워드를 더 확장하고 싶어요.
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <a href="/tools/keyword-related" className="text-primary underline underline-offset-2">
                  연관 키워드 도구
                </a>
                와{" "}
                <a href="/tools/longtail-keywords" className="text-primary underline underline-offset-2">
                  롱테일 키워드 도구
                </a>
                를 사용하면 주제와 관련된 파생·롱테일 키워드를 발굴할 수 있습니다.
                다양한 표현으로 콘텐츠를 확장하면 키워드 스터핑 없이 SEO를 강화할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                경쟁 콘텐츠가 다루는 주제를 파악하려면?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <a href="/tools/content-gap" className="text-primary underline underline-offset-2">
                  콘텐츠 갭 분석 도구
                </a>
                를 이용하면 경쟁 페이지가 다루는 주제와 내 콘텐츠 간의 차이를 확인할 수 있습니다.
                빠진 주제를 채우면 내 페이지의 검색 노출 범위를 넓힐 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">함께 쓰면 좋은 도구</h2>
          <RelatedTools currentTool="keyword-density" />
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
          <p className="text-base font-semibold mb-2">
            키워드 최적화 전략이 필요하신가요?
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            키워드 밀도 점검 이후 콘텐츠 SEO 전략 수립, 경쟁 키워드 분석, 온페이지 최적화까지
            전문 컨설팅을 받아보세요.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            무료 SEO 상담 신청
          </a>
        </div>
      </div>
    </>
  );
}
