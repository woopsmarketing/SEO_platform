import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ContentGapForm } from "./content-gap-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "콘텐츠 갭 분석기 — 경쟁사 누락 토픽 발굴 AI 도구",
  description:
    "내 도메인과 경쟁사 도메인을 비교해 콘텐츠 기회를 발굴하세요. AI가 경쟁사는 다루지만 내가 놓친 토픽을 자동으로 추려줍니다. 블로그 주제 아이디어, 경쟁사 콘텐츠 분석 무료 제공.",
  keywords: [
    "콘텐츠 갭 분석",
    "콘텐츠 기회 발굴",
    "경쟁사 콘텐츠 분석",
    "블로그 주제 아이디어",
    "AI 콘텐츠 갭 분석",
  ],
  openGraph: {
    title: "콘텐츠 갭 분석기 | SEO월드",
    description:
      "경쟁사 페이지와 비교해 내가 놓친 핵심 토픽을 AI가 추려주는 무료 도구.",
  },
  alternates: { canonical: "/tools/content-gap" },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "콘텐츠 갭 분석기",
  url: "https://seoworld.co.kr/tools/content-gap",
  description:
    "내 도메인과 경쟁사 도메인을 비교해 경쟁사는 다루지만 내가 놓친 토픽을 AI(gpt-4o-mini)로 추려주는 무료 콘텐츠 갭 분석 도구.",
  applicationCategory: "SEOApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "콘텐츠 갭 분석은 왜 필요한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "경쟁사가 이미 다루는 토픽을 내 사이트가 빠뜨리면 검색엔진은 경쟁사를 더 관련성 높은 문서로 평가합니다. 갭을 메우면 Topical Authority가 올라가고 경쟁사가 노출되는 키워드에 함께 노출될 가능성이 높아집니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사를 어떻게 골라야 정확한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "분석할 특정 주제나 키워드로 Google에서 1~5위에 오른 페이지를 경쟁사로 선택하세요. 도메인 전체가 아닌 단일 페이지 URL을 입력할수록 결과가 구체적입니다.",
      },
    },
    {
      "@type": "Question",
      name: "AI가 추천한 토픽을 그대로 써도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "추천 토픽은 출발점입니다. 해당 토픽의 실제 검색량과 내 사이트 기존 글과의 카니발라이제이션 여부를 확인한 뒤 우선순위를 결정하세요.",
      },
    },
    {
      "@type": "Question",
      name: "키워드 갭과 콘텐츠 갭의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "키워드 갭은 경쟁사가 순위를 가진 특정 검색어 단위의 차이를 다루고, 콘텐츠 갭은 페이지가 다루는 주제(토픽) 단위의 차이를 다룹니다. 두 분석을 함께 활용하면 키워드 레벨과 토픽 레벨 양쪽에서 기회를 발굴할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "관련 키워드 발굴은 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "토픽을 발굴했다면 롱테일 키워드 분석기(/tools/longtail-keywords)로 세부 검색어를 찾고, People Also Ask(/tools/people-also-ask)로 실제 사용자 질문을 확인하면 더 구체적인 콘텐츠 방향을 잡을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "전문가 SEO 컨설팅을 받고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "도구 분석을 넘어 전략 수립과 실행이 필요하다면 SEO월드 전문가 컨설팅(seoworld.co.kr/contact)을 통해 맞춤 제안을 받아보세요.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "콘텐츠 갭 분석기 사용 방법",
  description: "내 페이지와 경쟁사 페이지를 비교해 누락 토픽을 3단계로 발굴하는 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "URL 2개 입력",
      text: "분석할 내 페이지 URL과 경쟁사 페이지 URL을 각각 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI 토픽 추출",
      text: "AI(gpt-4o-mini)가 두 페이지의 H1, H2, H3 및 본문에서 핵심 토픽을 추출하고 공통/내 것만/경쟁사만 3그룹으로 분류합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "추천 토픽 확인 및 콘텐츠 계획",
      text: "경쟁사만 다루는 토픽 중 검색 수요와 전환 가능성이 높은 3개를 AI가 선정합니다. 이를 H2 섹션으로 추가해 콘텐츠를 보강하세요.",
    },
  ],
};

export default function ContentGapPage() {
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
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            콘텐츠 갭 분석기 — 경쟁사가 다루는 토픽, 내가 놓친 기회를 찾아드립니다
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            내 도메인과 경쟁사 도메인을 입력하면 AI가 토픽을 추출하고, 경쟁사는 다루지만
            내가 빠뜨린 주제를 자동으로 추려줍니다.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            블로그 주제 아이디어를 체계적으로 발굴하고 싶은 분, 경쟁사 콘텐츠 분석으로
            Topical Authority를 높이고 싶은 분, 월간 편집 캘린더를 채울 소재가 부족한 분께
            적합합니다. 완전 무료로 제공됩니다.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-indigo-50/50 border-indigo-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-indigo-900 mb-2">콘텐츠 갭이란?</h2>
              <p className="text-xs leading-relaxed text-indigo-800/80">
                경쟁사가 다루는데 내 콘텐츠에는 없는 토픽입니다. 갭을 메울수록 검색엔진이
                내 사이트를 해당 주제의 권위 있는 소스로 인식하고, 경쟁사가 노출되는
                키워드에서 함께 노출될 가능성이 높아집니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-pink-50/50 border-pink-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-pink-900 mb-2">AI 비교 방식</h2>
              <p className="text-xs leading-relaxed text-pink-800/80">
                두 페이지의 H1·H2·H3와 본문을 수집한 뒤 OpenAI gpt-4o-mini가 각 페이지에서
                핵심 토픽 10개를 추출합니다. 공통 토픽, 내 페이지만의 토픽, 경쟁사만의 토픽을
                3그룹으로 분류해 시각화합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-emerald-900 mb-2">결과 활용법</h2>
              <p className="text-xs leading-relaxed text-emerald-800/80">
                AI 선정 우선순위 3개 토픽을 H2 섹션으로 기존 글에 추가하거나 신규 글 주제로
                등록하세요. 경쟁사의 강점을 흡수하면서 내 페이지 고유 관점을 더하면 더 포괄적인
                콘텐츠가 됩니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">3단계로 콘텐츠 갭을 발굴하세요</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "URL 2개 입력",
                desc: "분석할 내 페이지 URL과 경쟁사 페이지 URL을 각각 입력합니다.",
              },
              {
                step: "2",
                title: "AI 토픽 추출 및 분류",
                desc: "AI가 두 페이지에서 핵심 토픽을 추출하고 공통·내 것만·경쟁사만 3그룹으로 분류합니다.",
              },
              {
                step: "3",
                title: "추천 토픽으로 콘텐츠 계획",
                desc: "경쟁사만 다루는 토픽 중 가치 높은 3개를 확인하고 콘텐츠 계획에 반영하세요.",
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4 rounded-xl border bg-card p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-sm mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Form */}
        <ContentGapForm />

        {/* Guide Article */}
        <article className="mt-16 border-t pt-12 prose-sm max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-3">콘텐츠 갭이란 무엇이고 왜 SEO에 중요한가</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              콘텐츠 갭(Content Gap)은 경쟁사가 다루는 토픽 중 내 사이트가 빠뜨린 영역을 말합니다.
              단순히 &ldquo;글이 없다&rdquo;는 수준이 아니라, 특정 주제에 대한 깊이와 커버리지의 차이가
              검색엔진 평가에 직접적으로 영향을 미친다는 점에서 중요합니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Google은 특정 주제를 얼마나 폭넓고 깊게 다루는지를 Topical Authority(주제 권위)로
              평가합니다. 예를 들어 &ldquo;SEO 최적화&rdquo;를 주제로 삼은 사이트가 온페이지 SEO, 백링크,
              기술 SEO, 콘텐츠 전략을 모두 다루면 해당 주제에서 경쟁사보다 높은 도메인 주제 권위를
              얻습니다. 반대로 일부 토픽을 빠뜨리면 검색엔진은 경쟁사를 더 신뢰할 수 있는 소스로
              판단하고 상위에 노출합니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              콘텐츠 갭 분석은 이 차이를 데이터로 시각화하는 작업입니다. 경쟁사 페이지에서 다루는
              토픽 목록을 추출하고 내 페이지 토픽 목록과 대조해 &ldquo;내가 놓친 영역&rdquo;을 특정합니다.
              이렇게 발굴한 토픽은 신규 글의 주제가 되거나, 기존 글에 H2 섹션으로 보강되어
              Topical Authority를 직접적으로 높이는 역할을 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">AI 콘텐츠 갭 분석 결과 이렇게 활용하세요</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI가 추천한 토픽 목록은 콘텐츠 계획의 원재료입니다. 그대로 글 제목으로 쓰기보다
              우선순위를 판단하는 단계가 필요합니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              첫 번째 기준은 검색량입니다. AI가 추천한 토픽을 Google Search Console 또는 키워드
              리서치 도구에 입력해 월간 검색량을 확인하세요. 검색량이 높을수록 해당 토픽을 다루는
              글이 트래픽 기여도가 높습니다. 검색량이 낮더라도 전환 가능성이 높은 상업적 키워드라면
              우선순위를 올려야 합니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              두 번째 기준은 카니발라이제이션(Cannibalization) 방지입니다. 추천 토픽이 이미 다루고
              있는 기존 글과 겹치지 않는지 확인하세요. 유사한 주제를 여러 글에서 중복으로 다루면
              검색엔진이 어느 글을 상위에 올릴지 혼란을 일으킵니다. 기존 글을 보강하는 방향이
              신규 글을 추가하는 것보다 효율적인 경우가 많습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              우선순위가 정해졌다면 토픽별로 &ldquo;기존 글 보강&rdquo;과 &ldquo;신규 글 작성&rdquo; 중 하나를 결정하고
              편집 캘린더에 배정합니다. 한 번에 모든 갭을 메우려 하지 말고 월 4~8편 속도로
              꾸준히 채워가는 것이 지속 가능한 전략입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">토픽 클러스터 전략으로 이어가기</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              콘텐츠 갭 분석으로 발굴한 토픽들은 단독 글로 흩어지게 두지 말고 토픽 클러스터
              구조로 엮어야 SEO 효과가 극대화됩니다. 토픽 클러스터는 하나의 Pillar 페이지(기둥 글)와
              여러 Supporting 글(지원 글)로 구성됩니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Pillar 페이지는 주제 전반을 폭넓게 다루는 긴 형식의 글입니다. 예를 들어
              &ldquo;SEO 콘텐츠 전략 완벽 가이드&rdquo;가 Pillar 페이지라면, 콘텐츠 갭 분석, 키워드 리서치,
              편집 캘린더 작성법 등이 각각 Supporting 글이 됩니다. Supporting 글은 각자의 주제를
              깊이 다루면서 Pillar 페이지로 내부 링크를 연결합니다. Pillar 페이지는 모든
              Supporting 글로의 링크를 포함합니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              이 구조를 실크(silk) 내부 링크 구조라고도 부릅니다. 검색엔진 크롤러가 Pillar에서
              Supporting으로, Supporting에서 다시 Pillar로 순환하며 전체 클러스터를 하나의
              주제 덩어리로 인식합니다. 결과적으로 클러스터 내 모든 글의 권위가 서로 강화됩니다.
              콘텐츠 갭 분석은 &ldquo;어떤 Supporting 글이 빠져 있는가&rdquo;를 알려주는 진단 도구입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">콘텐츠 갭을 기반으로 월간 편집 캘린더 만드는 법</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              발굴한 토픽을 실행으로 옮기려면 편집 캘린더가 필요합니다. 캘린더 없이 즉흥적으로
              글을 쓰면 특정 주제에 쏠리거나 중요한 갭을 계속 미루게 됩니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              월 4~8편을 기준으로 잡으세요. 이 범위는 콘텐츠 품질을 유지하면서 꾸준히 발행할 수
              있는 현실적인 속도입니다. 주제는 균형 있게 분산합니다. 한 달에 같은 클러스터에서만
              글을 쓰기보다 2~3개 클러스터를 번갈아 가며 발행하면 특정 주제의 포화를 막을 수 있습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              시즌별 배정도 중요합니다. 콘텐츠 갭 분석 결과 중 계절성이 강한 토픽(예: 연말 정산,
              수능 관련 키워드 등)은 검색량이 오르기 4~6주 전에 발행해야 Google 색인과 순위
              상승 시간을 확보할 수 있습니다. 반면 상록 콘텐츠(Evergreen Content)는 검색량이
              꾸준한 토픽으로 연간 트래픽 기반을 쌓아줍니다. 캘린더에 시즌성 토픽과 상록 토픽을
              6:4 또는 5:5 비율로 섞으면 단기 트래픽과 장기 트래픽을 동시에 확보할 수 있습니다.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <section className="mt-12 border-t pt-10">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">콘텐츠 갭 분석은 왜 필요한가요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                경쟁사가 이미 다루는 토픽을 내 사이트가 빠뜨리면 검색엔진은 경쟁사를 더 관련성
                높은 문서로 평가합니다. 갭을 메우면 Topical Authority가 올라가고, 경쟁사가
                노출되는 키워드에 함께 노출될 가능성이 높아집니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">경쟁사를 어떻게 골라야 정확한가요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                분석할 주제나 키워드로 Google 검색 1~5위에 오른 페이지를 경쟁사로 선택하세요.
                도메인 전체가 아닌 단일 페이지 URL을 입력할수록 결과가 더 구체적이고 실행
                가능한 토픽이 나옵니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">AI가 추천한 토픽을 그대로 써도 되나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                추천 토픽은 출발점입니다. 실제 검색량과 기존 글과의 카니발라이제이션 여부를
                확인한 뒤 우선순위를 결정하세요. 검색량이 낮아도 구매 의도가 높은 토픽이라면
                전환 측면에서 우선순위가 높을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                키워드 갭과 콘텐츠 갭의 차이는 무엇인가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                키워드 갭은 경쟁사가 순위를 가진 특정 검색어 단위의 차이를 다루고, 콘텐츠 갭은
                페이지가 다루는 주제(토픽) 단위의 차이를 다룹니다.{" "}
                <Link href="/tools/keyword-gap" className="text-indigo-600 underline underline-offset-2">
                  키워드 갭 분석기
                </Link>
                와 함께 활용하면 키워드 레벨과 토픽 레벨 양쪽에서 기회를 발굴할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">관련 키워드 발굴은 어떻게 하나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                토픽을 발굴했다면{" "}
                <Link href="/tools/longtail-keywords" className="text-indigo-600 underline underline-offset-2">
                  롱테일 키워드 분석기
                </Link>
                로 세부 검색어를 찾고,{" "}
                <Link href="/tools/people-also-ask" className="text-indigo-600 underline underline-offset-2">
                  People Also Ask
                </Link>
                로 실제 사용자 질문을 확인하면 더 구체적인 콘텐츠 방향을 잡을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">전문가 SEO 컨설팅을 받고 싶어요.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                도구 분석을 넘어 전략 수립과 실행이 필요하다면{" "}
                <Link href="/contact" className="text-indigo-600 underline underline-offset-2">
                  SEO월드 전문가 컨설팅
                </Link>
                을 통해 맞춤 제안을 받아보세요. 콘텐츠 갭 분석 결과를 가져오시면 바로 전략
                논의를 시작할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <div className="mt-12">
          <RelatedTools currentTool="content-gap" />
        </div>

        {/* Final CTA */}
        <section className="mt-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">콘텐츠 전략을 전문가와 함께 세우고 싶다면</h2>
          <p className="text-sm text-indigo-100 mb-6">
            도구 분석 결과를 기반으로 실제 편집 캘린더와 클러스터 전략을 맞춤 설계해 드립니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              전문가 컨설팅 문의
            </Link>
            <Link
              href="/tools"
              className="rounded-lg border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              다른 무료 도구 보기
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
