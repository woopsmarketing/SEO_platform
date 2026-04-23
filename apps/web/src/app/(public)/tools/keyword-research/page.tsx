import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { KeywordForm } from "./keyword-form";

export const metadata: Metadata = {
  title: "키워드 조사 도구 — 월간 검색량 조회 · CPC · 경쟁도 무료 분석",
  description:
    "시드 키워드를 입력하면 관련 키워드 20~50개의 월간 검색량, CPC, 경쟁도(DA)를 무료로 확인하세요. SEO 키워드 리서치의 첫 단계를 데이터 기반으로 시작하세요.",
  openGraph: {
    title: "키워드 조사 도구 — 월간 검색량 · CPC · 경쟁도 | SEO월드",
    description:
      "키워드 조사 한 번으로 월간 검색량, CPC, 경쟁도(DA)를 한눈에 비교하세요. 무료 SEO 키워드 리서치 도구.",
  },
  alternates: { canonical: "/tools/keyword-research" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "키워드 조사 도구",
  url: "https://seoworld.co.kr/tools/keyword-research",
  applicationCategory: "SEOApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "시드 키워드 입력 시 월간 검색량, CPC, 경쟁도(DA)와 관련 키워드 20~50개를 무료로 제공하는 SEO 키워드 리서치 도구.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "검색량과 CPC 데이터 출처는 어디인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Keyword Planner API 및 복수의 서드파티 SEO 데이터 소스를 병합하여 제공합니다. 월간 검색량은 최근 12개월 평균값이며, CPC는 Google Ads 경쟁 입찰 데이터를 기반으로 합니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁도(DA) 기준은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "경쟁도는 해당 키워드 상위 10위 사이트들의 도메인 권위(Domain Authority) 평균값으로 산출합니다. DA 0~30은 Low, 31~60은 Medium, 61 이상은 High로 분류하며, 신규 사이트는 DA 30 이하 키워드를 우선 공략하는 것을 권장합니다.",
      },
    },
    {
      "@type": "Question",
      name: "제로볼륨(검색량 0) 키워드도 작성해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "제로볼륨 키워드는 공식 데이터에는 잡히지 않지만 실제 검색이 발생하는 경우가 많습니다. 롱테일 키워드 발굴 도구(/tools/longtail-keywords)를 활용하면 제로볼륨 키워드를 포함한 롱테일 후보를 더 체계적으로 발굴할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "키워드 난이도를 더 자세히 보고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SERP 난이도 분석 도구(/tools/serp-difficulty)에서 특정 키워드의 상위 10개 페이지를 직접 분석하여 백링크 수, 콘텐츠 길이, 도메인 권위를 세부적으로 비교할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "지역/국가별 검색량을 보려면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "로컬 SERP 분석 도구(/tools/local-serp)를 이용하면 특정 지역 또는 국가 기준의 검색량과 순위 데이터를 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사가 상위 노출 중인 키워드는 어디서 확인하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "키워드 갭 분석 도구(/tools/keyword-gap)에서 경쟁 도메인을 입력하면 경쟁사가 노출되고 있지만 내 사이트는 빠진 키워드 기회를 발견할 수 있습니다.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "키워드 조사 도구 사용법",
  description:
    "시드 키워드를 입력하고 월간 검색량, CPC, 경쟁도 데이터를 활용해 타겟 키워드를 선정하는 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "시드 키워드 입력",
      text: "분석하려는 주제의 핵심 단어를 입력창에 입력합니다. 예: SEO, 인테리어, 다이어트 등.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "검색량 · CPC · 경쟁도 확인",
      text: "관련 키워드 20~50개와 각각의 월간 검색량, CPC, DA 기반 경쟁도가 표시됩니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "타겟 키워드 선정 및 콘텐츠 계획 수립",
      text: "검색량 대비 경쟁도가 낮은 키워드를 우선순위로 정렬하고, 콘텐츠 캘린더에 반영합니다.",
    },
  ],
};

export default function KeywordResearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">키워드 조사 도구</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            월간 검색량 조회 · CPC · 경쟁도(DA) 무료 분석
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            시드 키워드 하나를 입력하면 관련 키워드 20~50개의 월간 검색량,
            클릭당 비용(CPC), 도메인 권위 기반 경쟁도를 한번에 확인할 수
            있습니다. 데이터 기반 SEO 키워드 리서치를 지금 시작하세요.
          </p>
        </div>

        {/* 3 info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-amber-900 mb-2">
                키워드 리서치란?
              </h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                키워드 리서치는 타겟 고객이 실제로 검색엔진에 입력하는 단어와
                문장을 체계적으로 조사하는 과정입니다. 시드 키워드를 중심으로
                관련 키워드를 확장하고, 검색량과 경쟁도를 분석하여 콘텐츠
                전략의 방향을 결정합니다. SEO 성과의 70%는 올바른 키워드
                선정에서 비롯됩니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                핵심 3지표 — 검색량 · CPC · 경쟁도
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                월간 검색량은 해당 키워드의 수요를 나타내고, CPC는 상업적
                가치를 의미하며, 경쟁도(DA)는 상위 노출 난이도를 보여줍니다.
                세 지표를 종합하면 &ldquo;충분한 수요가 있고, 돈이 되며,
                이길 수 있는&rdquo; 키워드를 찾을 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-green-900 mb-2">
                이 도구의 이점
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                별도 로그인 없이 무료로 관련 키워드 20~50개를 한 번에 발굴할
                수 있습니다. 검색량 · CPC · 경쟁도를 한 화면에서 비교하고,
                낮은 경쟁도 키워드를 빠르게 식별하여 콘텐츠 우선순위를 즉시
                결정하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">사용 방법 3단계</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="text-xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold text-sm mb-1">시드 키워드 입력</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                분석하고 싶은 주제의 핵심 단어를 입력합니다. &ldquo;SEO&rdquo;,
                &ldquo;인테리어&rdquo;, &ldquo;다이어트&rdquo; 등 비즈니스와
                관련된 기본 키워드를 시작점으로 활용하세요.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="font-semibold text-sm mb-1">
                검색량 · CPC · 경쟁도 확인
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                관련 키워드 20~50개와 각각의 월간 검색량, CPC, DA 기반 경쟁도가
                표로 표시됩니다. 컬럼 헤더를 클릭하면 원하는 기준으로
                정렬할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="font-semibold text-sm mb-1">
                타겟 키워드 선정
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                검색량 대비 경쟁도가 낮은 키워드를 우선순위로 정하고, 콘텐츠
                캘린더에 반영합니다. 메인 키워드 1개 + 서브 키워드 3~5개
                조합으로 SEO 전략을 수립하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <KeywordForm />

        {/* 가이드 article */}
        <article className="mt-16 border-t pt-12 space-y-12">
          {/* h2-1 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              키워드 리서치 3가지 핵심 지표
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              키워드를 평가할 때 반드시 확인해야 하는 세 가지 지표가 있습니다.
              이 세 가지를 동시에 고려해야 진짜 &ldquo;기회 키워드&rdquo;를
              발굴할 수 있습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  월간 검색량 — 수요 파악
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  월간 검색량은 해당 키워드가 한 달 동안 얼마나 많이
                  검색되는지를 나타냅니다. 검색량이 높다는 것은 그만큼 많은
                  사람이 해당 주제에 관심을 갖고 있다는 의미입니다. 다만
                  검색량 수치는 계절적 변동이 있으므로 최근 12개월 평균값을
                  기준으로 판단하는 것이 안전합니다. 검색량이 너무 낮으면
                  트래픽 유입 자체가 제한되므로, 사이트 규모와 목표에 맞는
                  최소 임계값을 설정하고 그 이상인 키워드를 우선 검토하세요.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  CPC — 상업적 가치 확인
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CPC(Cost Per Click)는 광고주가 해당 키워드의 클릭 1회에
                  지불하는 평균 금액입니다. CPC가 높다는 것은 광고주들이
                  그 키워드를 통해 들어오는 방문자로부터 충분한 수익을 기대할
                  수 있다는 신호입니다. SEO로 고CPC 키워드에서 상위 노출을
                  달성하면 광고비 없이 그에 준하는 가치의 트래픽을 확보할 수
                  있습니다. 정보성 콘텐츠와 상업성 콘텐츠를 분리할 때 CPC
                  기준을 활용하면 콘텐츠 전략이 명확해집니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  경쟁도(DA) — 진입 난이도 측정
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  경쟁도는 해당 키워드로 상위 10위 안에 진입하기 위해 필요한
                  도메인 권위(DA) 수준을 의미합니다. DA가 높은 사이트들이
                  상위를 독점하고 있다면 신규 사이트가 진입하기 매우 어렵습니다.
                  반대로 DA 30 이하의 사이트들이 상위를 차지하고 있다면 충분히
                  도전할 수 있는 키워드입니다. 경쟁도 분석은 콘텐츠 작성
                  전에 반드시 수행해야 시간 낭비를 줄일 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* h2-2 */}
          <section>
            <h2 className="text-xl font-bold mb-3">검색량 구간별 전략</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              월간 검색량은 키워드의 잠재 트래픽 규모를 나타내지만, 구간별로
              적합한 전략이 다릅니다. 사이트의 현재 도메인 권위에 맞는
              구간을 선택하는 것이 핵심입니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  100 미만 — 롱테일 니치 공략
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  검색량 100 미만의 초세분화 키워드는 &ldquo;제로볼륨&rdquo;
                  또는 &ldquo;롱테일 니치&rdquo;로 분류됩니다. 개별 트래픽은
                  작지만 구매 의도가 매우 명확하고 경쟁이 거의 없습니다.
                  신규 사이트가 빠르게 순위를 확보하고 도메인 권위를 쌓기
                  위한 초기 전략으로 적합합니다. 이런 키워드를 50~100개
                  확보하면 합산 트래픽이 헤드 키워드 하나를 넘어설 수 있습니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  100~1,000 — 중형 키워드 균형 공략
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  월간 검색량 100~1,000 구간은 트래픽 잠재력과 경쟁 수준의
                  균형이 가장 좋은 구간입니다. DA 20~50 수준의 사이트가
                  집중적으로 노려야 하는 핵심 구간이며, 양질의 콘텐츠를
                  작성하면 3~6개월 내 상위 노출을 기대할 수 있습니다.
                  SEO 성과가 처음으로 가시화되는 구간이기도 합니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  1,000~10,000 — 인기 키워드 고품질 대응
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  이 구간은 상당한 경쟁이 존재하지만, 충분한 도메인 권위와
                  심층 콘텐츠가 있다면 도전할 수 있습니다. 단일 페이지보다
                  토픽 클러스터(핵심 페이지 + 서브 페이지) 구조로 접근하면
                  효과적입니다. 한 번 상위 노출되면 안정적인 트래픽을 장기간
                  유지할 수 있습니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  10,000 이상 — 헤드 키워드 브랜드 전략
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  월간 검색량 1만 이상의 헤드 키워드는 대형 포털과 전문
                  사이트들이 독점하는 경우가 많습니다. 단기 SEO 목표로는
                  적합하지 않으며, 브랜드 권위가 충분히 쌓인 이후 장기
                  목표로 설정하는 것이 현실적입니다. 헤드 키워드를 공략할
                  때는 서브 페이지들을 통한 토픽 권위 구축이 선행되어야 합니다.
                </p>
              </div>
            </div>
          </section>

          {/* h2-3 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              검색 의도 4가지와 키워드 매칭
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              같은 검색량의 키워드라도 검색 의도에 따라 적합한 콘텐츠 포맷이
              완전히 다릅니다. 의도를 무시하고 콘텐츠를 작성하면 트래픽이
              유입되더라도 이탈률이 높아지고 전환이 발생하지 않습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  정보형 (Informational)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;SEO란&rdquo;, &ldquo;백링크 만드는 법&rdquo; 같은
                  지식을 구하는 키워드입니다. 블로그 포스트, 가이드, 튜토리얼
                  형식이 적합합니다. 방문자가 즉시 구매할 의도는 없지만
                  장기적으로 브랜드 신뢰를 쌓는 데 효과적입니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  탐색형 (Navigational)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;SEO월드 로그인&rdquo;, &ldquo;네이버 서치어드바이저&rdquo;
                  처럼 특정 사이트나 페이지를 찾는 검색입니다. 브랜드명이
                  포함된 경우가 많으며, 타 브랜드의 탐색형 키워드를 공략하는
                  것은 비효율적입니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  상업형 (Commercial)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;SEO 툴 비교&rdquo;, &ldquo;키워드 분석 도구 추천&rdquo;
                  처럼 구매 전 정보를 수집하는 단계입니다. 비교 리뷰, 순위형
                  콘텐츠, 케이스 스터디가 효과적입니다. CPC가 높고 전환율도
                  상대적으로 높아 SEO 투자 대비 효과가 큰 구간입니다.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  거래형 (Transactional)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  &ldquo;SEO 컨설팅 신청&rdquo;, &ldquo;키워드 도구 구매&rdquo;
                  처럼 즉각적인 행동을 원하는 검색입니다. 랜딩 페이지, 제품
                  상세 페이지, 가격 안내 페이지가 최적의 콘텐츠 형식입니다.
                  CTA(행동 유도 문구)를 명확히 배치하면 전환율을 극대화할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* h2-4 */}
          <section>
            <h2 className="text-xl font-bold mb-3">
              월간 20~40개 키워드로 콘텐츠 캘린더 만드는 법
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              키워드 조사 결과를 실행 가능한 콘텐츠 계획으로 전환하려면
              체계적인 우선순위 결정 방법이 필요합니다. 검색량×경쟁도
              매트릭스를 활용하면 제한된 리소스를 최대한 효율적으로 배분할 수 있습니다.
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  1단계: 키워드를 4분면 매트릭스로 분류
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  X축은 경쟁도(낮음~높음), Y축은 검색량(낮음~높음)으로 설정합니다.
                  &ldquo;고검색량 + 저경쟁도&rdquo; 1분면이 최우선 타겟입니다.
                  &ldquo;저검색량 + 저경쟁도&rdquo; 2분면은 빠른 순위 확보용으로,
                  &ldquo;고검색량 + 고경쟁도&rdquo; 3분면은 장기 목표로 분류하세요.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  2단계: 월별 발행 목표 설정
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  현실적인 월 발행 수를 정한 뒤 (4~8편 권장), 1분면 키워드를
                  60%, 2분면 키워드를 40% 비중으로 배분합니다. 월 첫 주는
                  저경쟁 키워드로 빠른 성과를 확인하고, 이후 중경쟁 키워드로
                  확장하는 리듬을 만드세요.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-sm mb-2">
                  3단계: 토픽 클러스터로 묶어 권위 강화
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  연관성 높은 키워드 5~10개를 하나의 토픽 클러스터로 묶습니다.
                  핵심 페이지(Pillar Page) 1개 + 서브 페이지 4~9개 구조로
                  내부 링크를 연결하면 구글이 해당 토픽에 대한 권위를 인식하여
                  클러스터 전체의 순위가 상승합니다. 키워드 조사 결과를
                  단순 목록이 아닌 클러스터 구조로 재편성하는 것이 핵심입니다.
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                검색량과 CPC 데이터 출처는 어디인가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Keyword Planner API 및 복수의 서드파티 SEO 데이터
                소스를 병합하여 제공합니다. 월간 검색량은 최근 12개월 평균값,
                CPC는 Google Ads 경쟁 입찰 데이터를 기반으로 합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                경쟁도(DA) 기준은 무엇인가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                경쟁도는 해당 키워드 상위 10위 사이트들의 도메인 권위(DA)
                평균값으로 산출합니다. DA 0~30은 Low, 31~60은 Medium,
                61 이상은 High로 분류하며, 신규 사이트는 DA 30 이하 키워드를
                우선 공략하는 것을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                제로볼륨(검색량 0) 키워드도 작성해야 하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                제로볼륨 키워드는 공식 데이터에 잡히지 않지만 실제 검색이
                발생하는 경우가 많습니다.{" "}
                <a href="/tools/longtail-keywords" className="underline text-blue-600">
                  롱테일 키워드 발굴 도구
                </a>
                를 활용하면 제로볼륨 키워드 후보를 더 체계적으로 찾을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                키워드 난이도를 더 자세히 보고 싶어요.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a href="/tools/serp-difficulty" className="underline text-blue-600">
                  SERP 난이도 분석 도구
                </a>
                에서 특정 키워드의 상위 10개 페이지를 직접 분석하여
                백링크 수, 콘텐츠 길이, 도메인 권위를 세부적으로 비교할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                지역/국가별 검색량을 보려면 어떻게 하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a href="/tools/local-serp" className="underline text-blue-600">
                  로컬 SERP 분석 도구
                </a>
                를 이용하면 특정 지역 또는 국가 기준의 검색량과 순위 데이터를
                확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                경쟁사가 상위 노출 중인 키워드는 어디서 확인하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a href="/tools/keyword-gap" className="underline text-blue-600">
                  키워드 갭 분석 도구
                </a>
                에서 경쟁 도메인을 입력하면 경쟁사가 노출되고 있지만
                내 사이트는 빠진 키워드 기회를 발견할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12 border-t pt-12">
          <RelatedTools currentTool="keyword-research" />
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">
            데이터 기반 SEO 전략이 필요하신가요?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            키워드 조사부터 콘텐츠 전략, 백링크 구축까지 — SEO 전문가에게
            무료로 상담받으세요.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            무료 SEO 상담 신청
          </a>
        </div>
      </div>
    </>
  );
}
