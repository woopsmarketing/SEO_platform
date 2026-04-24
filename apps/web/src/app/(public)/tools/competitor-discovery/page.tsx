import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CompetitorDiscoveryForm } from "./competitor-discovery-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "경쟁사 도메인 발굴기 — 무료 SEO 경쟁사 찾기 도구 | SEO월드",
  description:
    "시드 키워드를 입력하면 구글 상위 노출 도메인을 집계해 실제 검색 경쟁사를 자동으로 발굴합니다. 경쟁 도메인 식별, 유기 검색 경쟁사 분석을 무료로 시작하세요.",
  openGraph: {
    title: "경쟁사 도메인 발굴기 | SEO월드",
    description:
      "키워드만 입력하면 구글 상위에 반복 등장하는 경쟁 도메인 10개를 즉시 추출합니다.",
  },
  alternates: { canonical: "/tools/competitor-discovery" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "경쟁사 도메인 발굴기",
  description:
    "시드 키워드 입력만으로 구글 SERP 상위에 반복 노출되는 경쟁 도메인을 자동 집계합니다.",
  url: "https://seoworld.co.kr/tools/competitor-discovery",
  inLanguage: "ko",
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "경쟁사 도메인 발굴기",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "검색 경쟁사 찾기, 경쟁 도메인 식별, 유기 검색 경쟁사 분석을 무료로 제공하는 SEO 도구입니다.",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "경쟁사 도메인 발굴기 사용법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "시드 키워드 입력",
      text: "업종 핵심 키워드를 입력창에 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "경쟁 도메인 발굴 클릭",
      text: "버튼을 클릭하면 구글 SERP 상위 결과에서 고유 도메인을 자동 추출합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "결과 확인 및 활용",
      text: "추출된 경쟁 도메인 목록과 DA, DR, 트래픽 지표를 확인하고 키워드 갭, 백링크 갭 분석에 활용합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "시드 키워드는 몇 개가 적당한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "업종 핵심 키워드 3–5개를 각각 따로 조회하는 것을 권장합니다. 키워드마다 다른 경쟁 도메인이 등장할 수 있으며, 여러 조회에서 반복 등장하는 도메인이 핵심 경쟁사입니다. 너무 광범위한 키워드 하나보다 중간 난이도 키워드 여러 개가 더 유용한 결과를 제공합니다.",
      },
    },
    {
      "@type": "Question",
      name: "우리 업계와 무관한 도메인이 나오는 이유는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "검색 키워드가 다의적이거나 광범위할 때 발생합니다. 예를 들어 \"디자인 툴\" 같은 키워드는 그래픽 디자인, UI 디자인 등 다양한 업종이 혼재됩니다. 더 구체적이고 업종 특화된 키워드로 다시 조회하면 관련성 높은 경쟁 도메인을 얻을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사를 몇 개 선정해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "심층 분석 대상으로는 3–5개가 실용적입니다. DA/DR이 내 사이트보다 약간 높은 도메인을 우선 선정하면 현실적인 벤치마킹이 가능합니다. DA 차이가 30 이상 나는 대형 도메인은 단기 목표보다는 장기 참고용으로 활용하는 것이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사가 나오면 그 다음은 무엇을 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "경쟁 도메인 목록을 확보했다면 키워드 갭 분석, 콘텐츠 갭 분석, 백링크 갭 분석 순서로 이어가세요. 경쟁사가 선점한 키워드와 토픽, 백링크 소스를 파악하면 SEO 우선순위가 명확해집니다.",
      },
    },
    {
      "@type": "Question",
      name: "도메인 권위를 빠르게 비교하려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "발굴된 경쟁 도메인과 내 사이트를 나란히 비교하려면 도메인 비교기를 활용하세요. DA, DR, TF, 참조 도메인, 트래픽을 두 도메인 기준으로 한 화면에서 비교할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사 분석을 체계적으로 진행하고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "도구를 직접 사용하기 어렵거나 여러 경쟁사를 체계적으로 분석하고 전략 보고서까지 받고 싶다면 SEO 전문가 상담을 신청하세요. 경쟁사 도메인 발굴부터 키워드 갭, 백링크 전략까지 통합적으로 지원합니다.",
      },
    },
  ],
};

export default function CompetitorDiscoveryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">경쟁사 도메인 발굴기</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          SEO 경쟁사 찾기 &mdash; 구글 상위에 반복 등장하는 경쟁 도메인을 자동 추출
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          시드 키워드를 입력하면 구글 SERP 유기 결과에서 반복 노출되는 도메인을 집계해
          실제 검색 경쟁사 목록을 즉시 제공합니다. Moz DA, Ahrefs DR, 트래픽 지표를 함께
          확인하세요.
        </p>
      </div>

      {/* 3 info cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-blue-900">
              왜 검색 경쟁사 찾기가 중요한가요?
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              오프라인 브랜드 경쟁사와 구글 상위 경쟁사는 완전히 다를 수 있습니다.
              실제 유기 검색 경쟁 도메인을 파악해야 키워드 갭, 콘텐츠 갭, 백링크 갭
              분석을 올바르게 수행할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-green-900">
              경쟁 도메인 식별 방식
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              입력한 시드 키워드를 기준으로 구글 SERP 상위 20개 유기 결과를 수집하고,
              도메인 단위로 집계합니다. 여러 키워드에서 반복 등장하는 도메인일수록
              핵심 경쟁사일 가능성이 높습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-amber-900">
              제공 지표
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              발굴된 경쟁 도메인마다 Moz DA, Ahrefs DR, Majestic TF, 참조 도메인 수,
              예상 트래픽을 함께 제공합니다. 도메인 권위와 규모를 한눈에 파악해
              우선순위를 빠르게 결정하세요.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HowTo 3단계 */}
      <div className="mb-10">
        <h2 className="mb-4 text-base font-semibold">사용 방법 &mdash; 3단계</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "시드 키워드 입력",
              desc: "업종 핵심 키워드 또는 주요 서비스 키워드를 입력합니다.",
            },
            {
              step: "2",
              title: "경쟁 도메인 발굴 실행",
              desc: "버튼 클릭 한 번으로 구글 SERP에서 고유 도메인을 자동 추출합니다.",
            },
            {
              step: "3",
              title: "결과 확인 및 활용",
              desc: "경쟁 도메인 목록과 지표를 확인하고 키워드 갭, 백링크 갭 분석으로 연결합니다.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-3 rounded-lg border bg-muted/20 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <CompetitorDiscoveryForm />

      {/* 가이드 article */}
      <article className="tools-prose mt-16 space-y-10 border-t pt-12 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">
            &ldquo;브랜드 경쟁사&rdquo;와 &ldquo;검색 경쟁사&rdquo;가 다른 이유
          </h2>
          <p>
            많은 마케터들이 SEO 전략을 세울 때 업계에서 잘 알려진 브랜드를
            경쟁사 목록에 올립니다. 하지만 오프라인 시장에서의 브랜드 경쟁과
            구글 유기 검색에서의 경쟁은 완전히 별개일 수 있습니다.
          </p>
          <p className="mt-2">
            예를 들어, 인테리어 업계에서 대형 브랜드 A와 B가 양분하는 시장이라도,
            &ldquo;인테리어 비용 견적&rdquo;이라는 키워드 검색 결과 상위에는 비교 블로그나
            정보성 콘텐츠 사이트가 등장할 수 있습니다. 이 콘텐츠 사이트들이
            실질적인 구글 검색 경쟁사입니다. 실제 SEO 전략은 구글 SERP에서
            반복 등장하는 도메인을 기준으로 수립해야 합니다.
          </p>
          <p className="mt-2">
            경쟁사 도메인 발굴기는 입력한 키워드를 구글에 실제로 조회한 뒤
            상위 유기 결과에 등장하는 도메인을 집계합니다. 따라서 &ldquo;검색
            경쟁사 찾기&rdquo;에 최적화된 데이터를 제공합니다. 마케팅 팀이
            인식하는 경쟁사와 구글이 인식하는 경쟁사 간 차이를 이 도구로
            빠르게 파악하세요.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">
            경쟁사 도메인 발굴 결과 해석하기
          </h2>
          <p>
            결과 테이블에 나타나는 도메인은 입력 키워드 기준 SERP 상위 20개
            유기 결과에서 추출된 고유 도메인입니다. 결과를 올바르게 해석하려면
            빈도와 지표를 함께 살펴봐야 합니다.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">높은 빈도 도메인</strong>은 핵심
            경쟁사입니다. 여러 키워드에서 반복 등장하는 도메인은 검색 엔진이
            해당 업계에서 권위 있다고 판단하는 사이트입니다. 이 도메인들의
            콘텐츠 구조, 키워드 전략, 백링크 프로필을 집중적으로 분석해야 합니다.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">낮은 빈도 도메인</strong>은 틈새
            경쟁사입니다. 특정 키워드에서만 등장하는 도메인은 롱테일 영역에
            집중하는 전문 사이트일 수 있습니다. DA나 DR이 낮더라도 특정 주제에서
            꾸준히 등장한다면 콘텐츠 전략 측면에서 참고할 가치가 있습니다.
          </p>
          <p className="mt-2">
            Moz DA와 Ahrefs DR이 높은 도메인은 단기간에 추월하기 어렵습니다.
            반면 DA 30&ndash;50 구간의 도메인은 콘텐츠 품질과 백링크 전략으로
            충분히 경쟁 가능한 타겟입니다. 도메인 비교 도구를 활용해 내 사이트와
            수치를 나란히 놓고 전략을 수립하세요.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">
            경쟁사 목록을 확보한 후의 5가지 활용법
          </h2>
          <p>
            경쟁 도메인 식별은 SEO 분석의 출발점입니다. 목록을 확보했다면 다음
            다섯 가지 방향으로 심층 분석을 이어가세요.
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-2">
            <li>
              <strong className="text-foreground">키워드 갭 분석</strong>&nbsp;&mdash;
              경쟁사가 순위를 갖고 있지만 내 사이트는 없는 키워드를 발굴합니다.
              빠른 트래픽 기회를 찾는 가장 효율적인 방법입니다.
            </li>
            <li>
              <strong className="text-foreground">콘텐츠 갭 분석</strong>&nbsp;&mdash;
              경쟁사가 다루고 있는 토픽 중 내 사이트에 없는 주제를 파악합니다.
              콘텐츠 캘린더 우선순위 결정에 직접 활용할 수 있습니다.
            </li>
            <li>
              <strong className="text-foreground">백링크 갭 분석</strong>&nbsp;&mdash;
              경쟁사는 받고 있지만 내 사이트는 받지 못한 백링크 소스를 찾아
              링크 빌딩 아웃리치 대상 목록을 만듭니다.
            </li>
            <li>
              <strong className="text-foreground">공통 백링크 도메인</strong>&nbsp;&mdash;
              여러 경쟁사에 공통으로 링크를 제공하는 도메인은 업계 신뢰 소스일
              가능성이 높습니다. 이 도메인에 먼저 기고하거나 링크를 요청하세요.
            </li>
            <li>
              <strong className="text-foreground">도메인 권위 비교</strong>&nbsp;&mdash;
              내 사이트 DA/DR과 경쟁사를 나란히 비교해 전반적인 도메인 경쟁력을
              수치로 파악합니다. 도메인 비교기를 활용하면 두 도메인을
              한 화면에서 비교할 수 있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-foreground">
            시드 키워드 잘 고르는 법
          </h2>
          <p>
            경쟁사 도메인 발굴의 품질은 시드 키워드 선택에 달려 있습니다.
            키워드 하나로 조회할 때는 해당 키워드를 실제로 검색하는 사용자의
            의도를 정확하게 반영한 표현을 사용해야 합니다.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">제품·서비스 핵심 키워드</strong>는
            업종을 대표하는 직접적인 키워드입니다. 예를 들어 SEO 서비스 업체라면
            &ldquo;SEO 컨설팅&rdquo;, &ldquo;SEO 대행&rdquo;, &ldquo;검색 최적화 서비스&rdquo; 등이
            해당합니다. 이 키워드로 발굴된 도메인은 직접 경쟁사일 가능성이 높습니다.
          </p>
          <p className="mt-2">
            <strong className="text-foreground">니즈 표현 키워드</strong>는 사용자가
            문제를 해결하려 할 때 사용하는 표현입니다. &ldquo;검색 순위 올리는 법&rdquo;,
            &ldquo;구글 상위 노출 방법&rdquo;처럼 정보 탐색 의도가 담긴 키워드입니다.
            이 키워드에서 상위에 있는 도메인은 콘텐츠 마케팅으로 유기 트래픽을
            선점한 사이트들로, 콘텐츠 전략 벤치마킹 대상이 됩니다.
          </p>
          <p className="mt-2">
            두 유형을 혼합해 여러 번 조회하면 직접 경쟁사와 콘텐츠 경쟁사를
            모두 파악할 수 있습니다. 결과에서 반복 등장하는 도메인이 가장 전략적으로
            중요한 핵심 경쟁사입니다.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <div className="mt-16 border-t pt-12">
        <h2 className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              시드 키워드는 몇 개가 적당한가요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              업종 핵심 키워드 3&ndash;5개를 각각 따로 조회하는 것을 권장합니다.
              키워드마다 다른 경쟁 도메인이 등장할 수 있으며, 여러 조회에서
              반복 등장하는 도메인이 핵심 경쟁사입니다. 너무 광범위한 키워드
              하나보다 중간 난이도 키워드 여러 개가 더 유용한 결과를 제공합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              우리 업계와 무관한 도메인이 나오는 이유는?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              검색 키워드가 다의적이거나 광범위할 때 발생합니다. 예를 들어
              &ldquo;디자인 툴&rdquo; 같은 키워드는 그래픽 디자인, UI 디자인 등 다양한
              업종이 혼재됩니다. 더 구체적이고 업종 특화된 키워드로 다시
              조회하면 관련성 높은 경쟁 도메인을 얻을 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              경쟁사를 몇 개 선정해야 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              심층 분석 대상으로는 3&ndash;5개가 실용적입니다. DA/DR이 내 사이트보다
              약간 높은 도메인을 우선 선정하면 현실적인 벤치마킹이 가능합니다.
              DA 차이가 30 이상 나는 대형 도메인은 단기 목표보다는 장기 참고용으로
              활용하는 것이 좋습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              경쟁사가 나오면 그 다음은 무엇을 해야 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              경쟁 도메인 목록을 확보했다면{" "}
              <Link href="/tools/keyword-gap" className="text-primary hover:underline">
                키워드 갭 분석
              </Link>
              ,{" "}
              <Link href="/tools/content-gap" className="text-primary hover:underline">
                콘텐츠 갭 분석
              </Link>
              ,{" "}
              <Link href="/tools/backlink-gap" className="text-primary hover:underline">
                백링크 갭 분석
              </Link>{" "}
              순서로 이어가세요. 경쟁사가 선점한 키워드와 토픽, 백링크 소스를
              파악하면 SEO 우선순위가 명확해집니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              도메인 권위를 빠르게 비교하려면?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              발굴된 경쟁 도메인과 내 사이트를 나란히 비교하려면{" "}
              <Link href="/tools/domain-compare" className="text-primary hover:underline">
                도메인 비교기
              </Link>
              를 활용하세요. DA, DR, TF, 참조 도메인, 트래픽을 두 도메인
              기준으로 한 화면에서 비교할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              경쟁사 분석을 체계적으로 진행하고 싶어요.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              도구를 직접 사용하기 어렵거나 여러 경쟁사를 체계적으로 분석하고
              전략 보고서까지 받고 싶다면{" "}
              <Link href="/contact" className="text-primary hover:underline">
                SEO 전문가 상담
              </Link>
              을 신청하세요. 경쟁사 도메인 발굴부터 키워드 갭, 백링크 전략까지
              통합적으로 지원합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-16 border-t pt-12">
        <RelatedTools currentTool="competitor-discovery" />
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center text-white">
        <h2 className="text-xl font-bold">
          경쟁사 분석, 전문가와 함께 전략으로 연결하세요
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          경쟁 도메인 발굴부터 키워드 갭, 백링크 전략 수립까지 SEO 전문가가
          직접 컨설팅합니다.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          무료 상담 신청하기
        </Link>
      </div>
    </div>
  );
}
