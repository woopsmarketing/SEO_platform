import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { SerpDifficultyForm } from "./serp-difficulty-form";

export const metadata: Metadata = {
  title: "키워드 난이도 체크 — SERP 경쟁도 무료 분석 도구 | SEO월드",
  description:
    "키워드를 입력하면 구글 상위 10개 도메인의 Moz DA 평균을 산출해 난이도 점수(0~100)와 진입 가능 여부를 즉시 판정합니다. KD 점수·SERP 경쟁도·키워드 경쟁 분석을 무료로 확인하세요.",
  openGraph: {
    title: "키워드 난이도 체크 — SERP 경쟁도 무료 분석 | SEO월드",
    description:
      "상위 10개 도메인 DA 평균 기반 키워드 난이도 점수 산출. 공략 가능한 키워드를 데이터로 찾으세요.",
  },
  alternates: { canonical: "/tools/serp-difficulty" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "키워드 난이도 체크 — SERP 경쟁도 무료 분석 도구",
  description:
    "키워드를 입력하면 구글 상위 10개 도메인의 Moz DA 평균을 산출해 난이도 점수(0~100)와 진입 가능 여부를 판정합니다.",
  url: "https://seoworld.co.kr/tools/serp-difficulty",
  inLanguage: "ko",
  isPartOf: {
    "@type": "WebSite",
    name: "SEO월드",
    url: "https://seoworld.co.kr",
  },
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SERP 난이도 맵",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  description:
    "키워드 SERP 경쟁도를 KD 점수(0~100)로 수치화하고 진입 가능 여부를 자동 판정하는 무료 키워드 난이도 체크 도구입니다.",
  url: "https://seoworld.co.kr/tools/serp-difficulty",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "키워드 난이도 체크 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "키워드 입력",
      text: "분석할 키워드를 입력창에 입력하고 \"SERP 난이도 분석\" 버튼을 클릭합니다. 정확한 검색어 형태로 입력하는 것이 실제 SERP와 가장 일치하는 결과를 제공합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "상위 10개 도메인 권위 확인",
      text: "구글 상위 10개 URL의 Moz DA, Ahrefs DR, Majestic TF를 자동 조회합니다. 막대 차트로 각 순위별 DA를 한눈에 비교하고, 편차가 큰 순위를 공략 포인트로 파악하세요.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "진입 전략 수립",
      text: "난이도 점수와 라벨(낮음 / 보통 / 어려움 / 매우 어려움)을 기반으로 즉시 공략, 중장기 목표, 우회 롱테일 전략 중 하나를 선택합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "SERP 난이도 점수는 어떻게 산출되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글 검색 상위 10개 URL의 도메인별 Moz DA를 수집해 평균을 낸 값을 기반으로 0~100 사이의 난이도 점수를 산출합니다. Ahrefs DR, Majestic TF도 보조 지표로 제공됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "DA 30인데 DA 60 키워드를 노려도 될까요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "평균 DA가 60이라도 상위 10개 중 DA 20~30대 결과가 1~2개 포함되어 있다면 진입 가능성이 있습니다. SERP 편차(최솟값~최댓값)를 함께 확인하는 것이 중요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "Ahrefs KD와 점수가 다른 이유는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ahrefs KD는 자체 DR 데이터베이스 기반이며, SEO월드의 SERP 난이도는 Moz DA 평균을 주지표로 사용하기 때문에 수치가 다를 수 있습니다. 각 도구마다 산출 방식이 다르므로 상대적 난이도 비교 용도로 활용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "난이도 낮은 키워드만 공략하면 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "난이도가 낮아도 검색량이 0에 가깝다면 유입 효과가 없습니다. 난이도 점수와 함께 검색량, CPC, 검색 의도 유형을 반드시 병행 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "검색량은 어떻게 같이 확인하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드의 키워드 리서치 도구(/tools/keyword-research)에서 검색량과 CPC를 함께 확인할 수 있습니다. 난이도 점수와 검색량을 교차해서 우선순위 키워드를 결정하세요.",
      },
    },
    {
      "@type": "Question",
      name: "롱테일 키워드 발굴도 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드의 롱테일 키워드 도구(/tools/longtail-keywords)를 이용하면 경쟁이 낮은 롱테일 변형 키워드를 자동으로 발굴할 수 있습니다. 발굴한 키워드의 난이도를 SERP 난이도 맵에서 검증해보세요.",
      },
    },
  ],
};

export default function SerpDifficultyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
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
          <h1 className="text-3xl font-bold">키워드 난이도 체크 — SERP 경쟁도 분석</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            상위 10개 도메인 DA 평균 기반 KD 점수 산출 · 진입 가능 여부 즉시 판정
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            키워드를 입력하면 구글 검색 상위 10개 URL의 Moz DA, Ahrefs DR, Majestic TF를 한꺼번에 조회해
            평균 기반 난이도 점수(0&#126;100)를 계산합니다. 키워드 경쟁 분석과 공략 가능한 키워드 발굴에 활용하세요.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-red-50/50 border-red-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-red-900 mb-2">키워드 난이도란?</h2>
              <p className="text-xs leading-relaxed text-red-800/80">
                특정 키워드로 구글 1페이지에 진입하기 위해 필요한 도메인 권위 수준을 0~100 점수로 나타낸 지표입니다.
                상위 10개 도메인의 평균 DA를 기반으로 산출되며, 점수가 낮을수록 신규 사이트도 상위노출이 가능합니다.
                SERP 경쟁도를 수치로 확인하면 키워드 선정 실패를 줄이고 투자 대비 효율을 높일 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-amber-900 mb-2">DA · DR · TF 3지표</h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                Moz DA는 도메인 전반의 링크 권위, Ahrefs DR은 자체 링크그래프 기반 도메인 평점,
                Majestic TF(Trust Flow)는 신뢰 가능한 사이트로부터 받은 링크 품질을 측정합니다.
                단일 지표보다 세 지표를 교차해서 보면 수치 왜곡을 걸러내고 실제 경쟁 강도를 판단할 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-emerald-900 mb-2">SERP 편차 활용법</h2>
              <p className="text-xs leading-relaxed text-emerald-800/80">
                평균 DA가 높더라도 상위 10개 중 DA 편차가 크면 진입 기회가 있다는 신호입니다.
                DA 최솟값이 내 도메인 DA보다 낮은 결과가 있다면 콘텐츠 품질로 충분히 밀어낼 수 있습니다.
                편차가 작고 모두 60 이상이라면 롱테일 변형을 먼저 공략하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">키워드 난이도 체크 방법</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">1&#xFE0F;&#x20E3;</div>
              <h3 className="font-semibold text-sm mb-1">키워드 입력</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                분석할 키워드를 입력창에 입력하고 &ldquo;SERP 난이도 분석&rdquo; 버튼을 클릭합니다.
                정확한 검색어 형태로 입력하는 것이 실제 SERP와 가장 일치하는 결과를 제공합니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">2&#xFE0F;&#x20E3;</div>
              <h3 className="font-semibold text-sm mb-1">상위 10개 도메인 권위 확인</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                구글 상위 10개 URL의 Moz DA, Ahrefs DR, Majestic TF를 자동 조회합니다.
                막대 차트로 각 순위별 DA를 한눈에 비교하고, 편차가 큰 순위를 공략 포인트로 파악하세요.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">3&#xFE0F;&#x20E3;</div>
              <h3 className="font-semibold text-sm mb-1">진입 전략 수립</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                난이도 점수와 라벨(낮음 / 보통 / 어려움 / 매우 어려움)을 기반으로
                즉시 공략, 중장기 목표, 우회 롱테일 전략 중 하나를 선택합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Tool Form */}
        <SerpDifficultyForm />

        {/* Guide Article */}
        <div className="tools-prose mt-16 border-t pt-12 space-y-12">

          {/* H2-1 */}
          <div>
            <h2 className="text-xl font-bold mb-3">SERP 난이도란 무엇이고 어떻게 계산되는가</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SERP 난이도(Keyword Difficulty, KD)는 특정 키워드로 구글 첫 페이지에 진입하는 데
              필요한 도메인 권위 수준을 수치화한 지표입니다. SEO월드의 SERP 난이도 맵은
              해당 키워드로 실제 검색했을 때 구글 상위 10개 URL을 수집하고,
              각 도메인의 Moz DA 값을 API로 조회해 평균을 산출합니다.
              이 평균값이 난이도 점수(0&#126;100)의 주요 구성 요소이며, Ahrefs DR과 Majestic TF는
              보조 지표로 함께 제공됩니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ahrefs KD 방식은 자체 크롤러가 수집한 DR 데이터베이스를 기반으로
              백분위 점수를 산출하는 반면, Moz KD는 도메인 권위와 페이지 권위를 복합 반영합니다.
              SEO월드가 Moz DA를 주지표로 선택한 이유는 두 가지입니다.
              첫째, DA는 업계에서 가장 널리 쓰이는 도메인 강도 지표로 해석이 직관적입니다.
              둘째, 상위 10개 도메인의 DA 분포를 보면 실제 진입 가능한 &ldquo;틈새&rdquo;를
              빠르게 발견할 수 있기 때문입니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              DA 기반 접근이 합리적인 또 다른 이유는 중소 사이트 입장에서 현실성 있는 판단 기준을 제공한다는 점입니다.
              상위 10개 중 내 DA와 비슷하거나 낮은 도메인이 포함되어 있다면,
              콘텐츠 품질과 내부 링크 최적화만으로도 해당 자리를 밀어낼 가능성이 있습니다.
            </p>
          </div>

          {/* H2-2 */}
          <div>
            <h2 className="text-xl font-bold mb-3">난이도 점수 구간별 전략</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              난이도 점수를 네 구간으로 나누면 각 사이트 규모에 맞는 전략을 수립할 수 있습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">0&#126;30 &mdash; 신규·소형 사이트 공략 구간</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  DA 10~30 수준의 신규 사이트도 충분히 진입할 수 있는 블루오션 구간입니다.
                  핵심 키워드 1개를 타겟하는 롱폼 가이드 페이지 1개만으로도 상위 10위 진입이 가능합니다.
                  빠른 성과가 필요한 런칭 초기에 집중 공략해야 합니다.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">30&#126;60 &mdash; 중견 사이트 경쟁 구간</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  DA 30~50 수준의 중견 사이트가 상위 10위권에 진입할 수 있는 구간입니다.
                  콘텐츠 품질, 내부 링크 구조, 백링크 획득이 세 가지 동시에 요구됩니다.
                  6~12개월 중기 콘텐츠 전략이 필요하며, 관련 롱테일 키워드로 트래픽을 축적하면서 권위를 높여야 합니다.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">60&#126;80 &mdash; 대형 사이트 진입 구간</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  DA 60 이상의 도메인이 점령한 키워드로, 신규 사이트가 직접 진입하기는 어렵습니다.
                  대신 이 키워드를 포함한 롱테일 변형, 지역 키워드, 질문형 키워드를 우선 공략해
                  관련 페이지 클러스터를 구성하는 전략이 효과적입니다.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">80+ &mdash; 브랜드·기관 레벨 구간</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  네이버, 위키백과, 대형 언론사 등 브랜드 권위를 가진 도메인이 독점하는 영역입니다.
                  SEO 단독으로 진입하기보다, 유튜브·소셜·PR 캠페인과 병행하거나
                  완전히 다른 각도의 검색 의도를 타겟하는 방향으로 전환하는 것이 현실적입니다.
                </p>
              </div>
            </div>
          </div>

          {/* H2-3 */}
          <div>
            <h2 className="text-xl font-bold mb-3">난이도가 높은 키워드라도 진입하는 법</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              경쟁이 치열한 키워드를 무조건 피할 필요는 없습니다.
              진입 전략을 바꾸면 DA가 낮은 사이트도 상위 결과에 안착할 수 있습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>롱테일 변형 키워드</strong>를 활용하면 경쟁을 우회할 수 있습니다.
              &ldquo;SEO&rdquo;는 난이도 90이지만 &ldquo;소규모 쇼핑몰 SEO 체크리스트&rdquo;는 난이도 20~30 수준입니다.
              롱테일 키워드로 콘텐츠 클러스터를 구성하면 결국 상위 키워드의 권위도 높아집니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>지역 키워드</strong>는 전국 단위 경쟁을 피할 수 있는 좋은 방법입니다.
              &ldquo;SEO 컨설팅&rdquo;보다 &ldquo;강남 SEO 컨설팅&rdquo;이 SERP 경쟁도가 훨씬 낮고,
              실제 구매 의도도 높아 전환율에서 유리합니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>질문형 키워드</strong>는 People Also Ask 박스를 통해 1순위가 아니어도 검색 결과 상단에 노출될 수 있습니다.
              &ldquo;키워드 난이도 어떻게 확인하나요&rdquo; 같은 How / What / Why 형태의 키워드는
              정보 콘텐츠로 빠르게 진입할 수 있는 영역입니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>틈새 각도(Angle)</strong>는 같은 키워드라도 검색 의도를 다르게 공략하는 방법입니다.
              경쟁 상위 페이지가 모두 &ldquo;방법론 안내&rdquo; 형태라면,
              &ldquo;도구 비교&rdquo; 또는 &ldquo;사례 연구&rdquo; 형태의 콘텐츠가 차별화 진입 각도가 됩니다.
            </p>
          </div>

          {/* H2-4 */}
          <div>
            <h2 className="text-xl font-bold mb-3">난이도 대신 함께 보아야 할 지표</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SERP 경쟁도만 보고 키워드를 선택하면 실수를 반복할 수 있습니다.
              아래 4가지 지표를 함께 고려해야 올바른 키워드 우선순위를 정할 수 있습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">월간 검색량</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  난이도 10이어도 월간 검색량이 10 미만이라면 투자 가치가 없습니다.
                  난이도 점수와 검색량을 매트릭스로 교차해 &ldquo;낮은 난이도 + 충분한 검색량&rdquo; 키워드를 우선 목록에 올리세요.
                  키워드 리서치 도구에서 검색량을 확인하면 의사결정 정확도가 높아집니다.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">CPC (클릭당 광고 단가)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CPC가 높다는 것은 광고주들이 해당 키워드에 높은 전환 가치를 부여한다는 의미입니다.
                  CPC가 높은 키워드를 SEO로 공략하면 유료 트래픽 비용을 절감하고
                  높은 상업적 의도를 가진 방문자를 무료로 유치할 수 있습니다.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">예상 CTR</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  같은 순위라도 키워드에 따라 CTR이 크게 달라집니다.
                  광고, 쇼핑 카드, 지식 패널 등 SERP 기능이 많은 키워드는 오가닉 클릭률이 낮습니다.
                  구글 서치 콘솔에서 실제 CTR을 확인해 기대 트래픽을 현실적으로 계산하세요.
                </p>
              </div>
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-2">검색 의도 유형</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  정보형(Informational), 탐색형(Navigational), 거래형(Transactional) 의도에 따라
                  페이지 형태가 달라야 합니다. 구글이 상위 10개 결과에서 보여주는 콘텐츠 유형을 먼저 파악하고,
                  같은 의도를 더 잘 충족하는 페이지를 만드는 것이 핵심입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">키워드 난이도 체크 FAQ</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">SERP 난이도 점수는 어떻게 산출되나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                구글 검색 상위 10개 URL의 도메인별 Moz DA를 수집해 평균을 낸 값을 기반으로
                0~100 사이의 난이도 점수를 산출합니다. Ahrefs DR과 Majestic TF도 보조 지표로 함께 제공됩니다.
                30 미만은 &ldquo;낮음&rdquo;, 30~50은 &ldquo;보통&rdquo;, 50~70은 &ldquo;어려움&rdquo;, 70 이상은 &ldquo;매우 어려움&rdquo;으로 판정됩니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">DA 30인데 DA 60 키워드를 노려도 될까요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                평균 DA가 60이라도 상위 10개 중 DA 20~30대 결과가 1~2개 포함되어 있다면 진입 가능성이 있습니다.
                SERP 결과 테이블에서 각 순위의 DA를 확인하고, 내 DA보다 낮은 도메인이 있는
                순위를 공략 목표로 삼으세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Ahrefs KD와 점수가 다른 이유는?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ahrefs KD는 자체 DR 데이터베이스 기반이며, SEO월드의 SERP 난이도는 Moz DA 평균을
                주지표로 사용하기 때문에 수치가 다를 수 있습니다.
                각 도구마다 산출 방식이 다르므로 절대값보다 상대적 난이도 비교 용도로 활용하는 것이 정확합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">난이도 낮은 키워드만 공략하면 되나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                난이도가 낮아도 검색량이 0에 가깝다면 유입 효과가 없습니다.
                난이도 점수와 함께 검색량, CPC, 검색 의도 유형을 반드시 병행 확인하세요.
                &ldquo;낮은 난이도 + 충분한 검색량 + 명확한 의도&rdquo; 세 조건이 맞는 키워드가 최우선 공략 대상입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">검색량은 어떻게 같이 확인하나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SEO월드의{" "}
                <Link href="/tools/keyword-research" className="text-blue-600 hover:underline">
                  키워드 리서치 도구
                </Link>
                에서 검색량과 CPC를 함께 확인할 수 있습니다.
                난이도 점수와 검색량을 교차해서 우선순위 키워드 목록을 만드는 것을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">롱테일 키워드 발굴도 가능한가요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SEO월드의{" "}
                <Link href="/tools/longtail-keywords" className="text-blue-600 hover:underline">
                  롱테일 키워드 도구
                </Link>
                를 이용하면 경쟁이 낮은 롱테일 변형 키워드를 자동으로 발굴할 수 있습니다.
                발굴한 키워드의 난이도를 SERP 난이도 맵에서 검증하는 워크플로우를 추천합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12 border-t pt-12">
          <RelatedTools currentTool="serp-difficulty" />
        </div>

        {/* CTA */}
        <div className="mt-12 border-t pt-12 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">키워드 선정부터 상위노출까지, 전문가와 함께하세요</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            SERP 난이도 분석 결과를 바탕으로 콘텐츠 전략·온페이지 최적화·백링크 구축까지
            SEO 전 과정을 SEO월드 전문가가 직접 지원합니다.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            무료 SEO 상담 신청하기
          </Link>
        </div>
      </div>
    </>
  );
}
