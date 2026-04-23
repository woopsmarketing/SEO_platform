import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { BacklinkForm } from "./backlink-form";

export const metadata: Metadata = {
  title: "백링크 분석기 — 무료 백링크 조회 · 품질 점검 도구",
  description:
    "도메인 입력만으로 백링크 목록, 소스 DA, 품질 점수, 최근 30일 신규 백링크, 90일 성장 추세를 무료로 조회합니다. 백링크 프로파일 분석부터 링크빌딩 전략까지 한눈에 확인하세요.",
  openGraph: {
    title: "백링크 분석기 — 무료 백링크 조회 · 품질 점검 | SEO월드",
    description:
      "백링크 수, 참조 도메인, 소스 DA, 품질 점수, 90일 성장 추세까지 무료로 분석합니다. 경쟁사 백링크 프로파일도 조회 가능.",
  },
  alternates: { canonical: "/tools/backlink-checker" },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "백링크 분석기",
  url: "https://seoworld.co.kr/tools/backlink-checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  description:
    "도메인의 백링크 목록, 소스 DA, 품질 점수, 최근 30일 신규 백링크, 90일 성장 추세를 무료로 분석하는 백링크 조회 도구입니다.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  provider: {
    "@type": "Organization",
    name: "SEO월드",
    url: "https://seoworld.co.kr",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "백링크와 참조 도메인(referring domains) 차이는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "백링크는 내 사이트로 연결된 링크의 총 개수입니다. 참조 도메인은 백링크를 보내는 고유 도메인의 수입니다. 예를 들어 example.com에서 5개의 링크를 받으면 백링크 5개, 참조 도메인 1개입니다. SEO 관점에서는 백링크 총수보다 참조 도메인 다양성이 더 중요한 신호로 평가됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "백링크 수가 많을수록 무조건 좋은가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아닙니다. 저품질 스팸 도메인에서 오는 백링크는 오히려 Google 페널티를 유발할 수 있습니다. 중요한 것은 수량보다 품질입니다. 주제와 관련 있고 DA가 높은 도메인에서 온 doFollow 백링크가 적더라도 순위 상승 효과가 큽니다.",
      },
    },
    {
      "@type": "Question",
      name: "품질 점수는 어떻게 계산되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드 백링크 분석기의 품질 점수(0~100)는 소스 도메인의 DA, doFollow 여부, 앵커 텍스트 다양성, 주제 관련성을 종합하여 산출합니다. 70점 이상은 우수, 45~69점은 양호, 44점 이하는 주의로 분류됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사 백링크 소스를 찾으려면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "경쟁사 도메인을 이 백링크 분석기에 입력하면 경쟁사가 받고 있는 백링크 소스 목록을 확인할 수 있습니다. 더 정밀한 링크 갭 분석은 /tools/backlink-gap, 공통 백링크 분석은 /tools/common-backlinks 도구를 이용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "404 응답하는 백링크는 어떻게 처리하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "백링크 목록에서 타겟 URL이 404인 경우, 해당 URL에 301 리다이렉트를 설정하거나 콘텐츠를 복원하면 백링크 가치를 회수할 수 있습니다. /tools/broken-backlink-recovery 도구를 사용하면 끊어진 백링크를 자동으로 식별하고 복구 전략을 제안받을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "도메인 권위도를 함께 확인하려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "백링크 분석 결과 상단에 해당 도메인의 권위 지표가 자동으로 표시됩니다. 더 자세한 도메인 권위도 분석은 /tools/domain-authority 도구를 이용하세요.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "백링크 분석기 사용 방법",
  description:
    "SEO월드 백링크 분석기로 도메인의 백링크 프로파일을 3단계로 분석하는 방법입니다.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "분석할 도메인을 입력합니다. https:// 없이 도메인만 입력해도 자동 인식됩니다. 내 사이트와 경쟁사 도메인 모두 조회 가능합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "백링크 분석 결과 확인",
      text: "총 백링크 수, doFollow 비율, 참조 도메인, 평균 품질 점수, 최근 30일 신규 백링크, 90일 성장 추세 차트를 확인합니다. 각 백링크의 소스 DA와 품질 점수도 함께 표시됩니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "링크빌딩 전략 수립",
      text: "고품질 백링크를 확보한 경쟁사 소스를 파악하고, 품질 점수 낮은 백링크는 Disavow 처리 대상으로 분류합니다. 전문 컨설팅이 필요하면 SEO월드 서비스 문의를 이용하세요.",
    },
  ],
};

export default function BacklinkCheckerPage() {
  return (
    <>
      {/* JSON-LD */}
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
          <h1 className="text-3xl font-bold">백링크 분석기</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            무료 백링크 조회 · 백링크 품질 점검 도구
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            도메인을 입력하면 백링크 목록, 소스 DA, 품질 점수, 최근 30일 신규 백링크,
            90일 성장 추세를 무료로 분석합니다. 백링크 프로파일 분석부터
            경쟁사 링크 소스 파악까지 한 화면에서 확인하세요.
          </p>
        </div>

        {/* 3 정보 카드 */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-rose-50/50 border-rose-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-rose-900 mb-2">
                백링크 분석이란?
              </h2>
              <p className="text-xs leading-relaxed text-rose-800/80">
                백링크 분석은 다른 웹사이트에서 내 사이트로 연결된 외부 링크를
                체계적으로 조사하는 과정입니다. 백링크 조회를 통해 어떤 도메인이
                내 콘텐츠를 참조하는지, 링크 품질은 어떤지, doFollow 비율은
                적절한지 파악합니다. 정기적인 백링크 품질 점검은 SEO 전략 수립의
                기본이며, 이 도구를 활용하면 전문 지식 없이도 누구나 즉시
                백링크 프로파일 분석이 가능합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                백링크가 SEO에 미치는 영향
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                Google은 백링크를 페이지 권위를 평가하는 핵심 랭킹 요소로
                사용합니다. 고품질 doFollow 백링크는 링크 주스(Link Juice)를
                전달하여 검색 순위에 직접적인 영향을 줍니다. 다양한 참조
                도메인에서 오는 자연스러운 백링크가 많을수록 도메인 권위(DA)가
                높아지고 검색 순위가 상승합니다. 정기적인 백링크 수 확인으로
                SEO 성과를 효과적으로 관리하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-green-900 mb-2">
                이 백링크 도구의 이점
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                도메인만 입력하면 백링크 목록, 소스 DA, 0~100 품질 점수,
                최근 30일 신규 백링크, 90일 누적 성장 추세를 무료로 확인할 수
                있습니다. 경쟁사 백링크 프로파일 분석도 지원하여 경쟁사가 어떤
                사이트에서 링크를 확보하는지 파악하고 효과적인 링크빌딩 전략을
                수립할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6">백링크 분석기 사용 방법</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="mb-3 text-2xl font-bold text-blue-600">1</div>
              <h3 className="font-semibold text-sm mb-1">도메인 입력</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                백링크 조회를 원하는 도메인을 입력합니다. https:// 없이
                도메인만 입력해도 자동 인식됩니다. 내 사이트와 경쟁사 도메인
                모두 분석 가능합니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="mb-3 text-2xl font-bold text-blue-600">2</div>
              <h3 className="font-semibold text-sm mb-1">백링크 프로파일 확인</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                총 백링크 수, doFollow 비율, 참조 도메인, 평균 품질 점수,
                최근 30일 신규 백링크, 90일 성장 추세 차트를 한 화면에서
                확인합니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="mb-3 text-2xl font-bold text-blue-600">3</div>
              <h3 className="font-semibold text-sm mb-1">링크빌딩 전략 수립</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                경쟁사 백링크 소스를 파악하고, 품질 점수가 낮은 링크는
                Disavow 처리 대상으로 분류합니다. 심층 컨설팅이 필요하면
                전문가 문의를 이용하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 도구 본체 */}
        <BacklinkForm />

        {/* 가이드 article */}
        <article className="mt-16 border-t pt-12 prose-sm max-w-none">
          <h2 className="text-xl font-bold mb-3">백링크 분석의 네 가지 핵심 지표</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            백링크 분석기를 사용할 때 단순히 백링크 수만 볼 것이 아니라 네 가지
            지표를 함께 검토해야 합니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">총 백링크 수</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                내 사이트를 가리키는 외부 링크의 총 개수입니다. 절대적인 수보다
                증가 추세와 품질이 중요합니다. 갑작스러운 급증은 스팸 공격 신호일
                수 있으므로 90일 성장 추세 차트와 함께 확인하세요.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">참조 도메인 수 (Referring Domains)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                백링크를 보내는 고유 도메인의 수입니다. 하나의 도메인에서
                100개 링크를 받는 것보다 100개의 다양한 도메인에서 각 1개씩
                받는 것이 SEO에 훨씬 효과적입니다. 참조 도메인 다양성은
                백링크 프로파일의 자연스러움을 나타내는 핵심 신호입니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">평균 소스 DA</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                백링크를 보내는 도메인들의 평균 Domain Authority 점수입니다.
                DA 70 이상 도메인에서 오는 링크는 매우 고품질로 분류됩니다.
                DA 30 미만 도메인에서 집중적으로 링크가 오면 저품질 프로파일로
                평가될 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">앵커 텍스트 분포</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                앵커 텍스트는 백링크에 사용된 클릭 가능한 텍스트입니다.
                브랜드명, URL, 키워드, 일반 텍스트가 자연스럽게 분포되어야
                합니다. 특정 키워드 앵커가 과도하면 Google 페널티의 원인이
                될 수 있으므로 앵커 다양성 비율을 반드시 확인하세요.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">백링크 품질 점수 해석하기</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            SEO월드 백링크 분석기는 각 백링크에 대해 0~100 범위의 품질 점수를
            산출합니다. 이 점수는 네 가지 요소를 종합합니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">소스 DA (도메인 권위)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                백링크를 보내는 도메인의 권위 점수입니다. DA 70 이상은 최우수,
                DA 50~69는 고품질, DA 30~49는 중간, DA 30 미만은 저품질로
                분류됩니다. 품질 점수에서 가장 큰 비중을 차지하는 요소입니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">주제 관련성</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                소스 도메인의 주제가 내 사이트와 관련성이 높을수록 품질 점수가
                올라갑니다. 예를 들어 SEO 관련 사이트에서 오는 백링크는
                음식 관련 사이트에서 오는 것보다 SEO 서비스 사이트에 더 유리합니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">doFollow 비율</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                doFollow 백링크는 링크 주스를 전달하여 SEO에 직접 기여합니다.
                전체 백링크 중 doFollow 비율이 40~70% 수준이면 자연스러운
                프로파일로 평가됩니다. 90% 이상이면 인위적으로 보일 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">앵커 다양성</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                동일한 앵커 텍스트가 반복적으로 사용될수록 품질 점수가
                낮아집니다. 유니크 앵커 비율이 높을수록 자연 링크빌딩으로
                평가됩니다. 결과 화면의 앵커 다양성 지표에서 백분율로 확인하세요.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">최근 30일 신규 · 90일 성장 추세 활용법</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            백링크 성장 데이터는 단순한 수치 이상의 전략적 인사이트를 제공합니다.
          </p>
          <div className="space-y-4 mb-10">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">자연 증가 vs 스파이크</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                90일 추세 차트에서 완만하고 꾸준한 증가는 자연스러운 링크빌딩의
                결과입니다. 반면 특정 날짜에 수십~수백 개가 급증하는 스파이크는
                스팸 공격이거나 PBN(사설 블로그 네트워크) 구매의 흔적일 수
                있습니다. 스파이크 발생 시 해당 날짜의 신규 백링크 소스를
                집중 점검하세요.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">경쟁사 벤치마킹</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                동종 업계 경쟁사 도메인을 동일한 도구에 입력하여 백링크 수 확인
                및 성장 추세를 비교하세요. 경쟁사가 특정 시점에 백링크를 급격히
                늘렸다면 그 시기에 어떤 콘텐츠나 캠페인을 진행했는지 분석하여
                벤치마킹 전략을 수립할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">콘텐츠 업데이트 후 백링크 변화</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                새 콘텐츠를 발행하거나 기존 글을 대폭 업데이트한 후 최근 30일
                신규 백링크 수를 확인하면 콘텐츠 효과를 측정할 수 있습니다.
                신규 백링크가 꾸준히 늘어난다면 해당 콘텐츠가 링크 마그넷으로
                작동하고 있다는 신호입니다.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">백링크 프로파일을 개선하는 4단계</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            백링크 분석 결과를 실질적인 SEO 개선으로 연결하는 체계적인 4단계 프로세스입니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">1단계: 기존 백링크 정리</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                품질 점수가 낮고 스팸성 도메인에서 오는 백링크를 식별합니다.
                Google Search Console에서 Disavow 파일을 제출하거나, 직접
                해당 사이트에 링크 제거를 요청하세요. 독성 백링크 비율을
                줄이면 전체 프로파일 품질이 향상됩니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">2단계: 갭 분석</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                경쟁사 백링크 소스 중 내 사이트에는 없는 도메인을 찾아
                링크 획득 기회 목록을 만듭니다. 경쟁사가 링크를 받고 있다면
                동일한 사이트에서 내 콘텐츠도 소개받을 가능성이 높습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">3단계: 콘텐츠 마그넷</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                자연스럽게 백링크를 끌어당기는 콘텐츠를 제작합니다. 업계 통계,
                종합 가이드, 무료 도구, 인포그래픽이 효과적입니다. 한 번
                만들어두면 지속적으로 신규 백링크가 유입되는 자산이 됩니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-2">4단계: 관계 기반 링크 빌딩</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                게스트 포스팅, 전문가 인터뷰, 파트너십을 통해 DA 높은 관련
                사이트에서 링크를 확보합니다. 단기 성과를 기대하기보다
                지속적인 관계를 구축하는 장기 전략으로 접근하는 것이 효과적입니다.
              </p>
            </div>
          </div>
        </article>

        {/* FAQ */}
        <div className="border-t pt-12">
          <h2 className="text-xl font-bold mb-6">백링크 분석 자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                백링크와 참조 도메인(referring domains) 차이는?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                백링크는 내 사이트로 연결된 링크의 총 개수이고, 참조 도메인은
                그 링크들을 보내는 고유 도메인 수입니다. example.com에서
                5개 링크를 받으면 백링크 5개, 참조 도메인 1개입니다.
                SEO 관점에서는 백링크 총수보다 참조 도메인 다양성이 더 중요한
                신호로 평가됩니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                백링크 수가 많을수록 무조건 좋은가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                아닙니다. 저품질 스팸 도메인에서 오는 백링크는 Google 페널티를
                유발할 수 있습니다. 중요한 것은 수량보다 품질입니다. 주제와
                관련 있고 DA가 높은 도메인에서 온 doFollow 백링크가 적더라도
                순위 상승 효과가 더 큽니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                품질 점수는 어떻게 계산되나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                백링크 품질 점수(0~100)는 소스 도메인 DA, doFollow 여부,
                앵커 텍스트 다양성, 주제 관련성을 종합하여 산출합니다.
                70점 이상은 우수, 45~69점은 양호, 44점 이하는 주의로 분류됩니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                경쟁사 백링크 소스를 찾으려면?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                경쟁사 도메인을 이 백링크 분석기에 입력하면 경쟁사의 백링크
                소스 목록을 확인할 수 있습니다. 더 정밀한 분석은{" "}
                <Link href="/tools/backlink-gap" className="text-blue-600 hover:underline">
                  링크 갭 분석기
                </Link>
                와{" "}
                <Link href="/tools/common-backlinks" className="text-blue-600 hover:underline">
                  공통 백링크 분석기
                </Link>
                를 이용하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                404 응답하는 백링크는 어떻게 처리하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                타겟 URL이 404인 경우 301 리다이렉트를 설정하거나 콘텐츠를
                복원하면 백링크 가치를 회수할 수 있습니다.{" "}
                <Link href="/tools/broken-backlink-recovery" className="text-blue-600 hover:underline">
                  끊어진 백링크 복구 도구
                </Link>
                를 이용하면 자동으로 식별하고 복구 전략을 제안받을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                도메인 권위도를 함께 확인하려면?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                백링크 분석 결과 상단에 해당 도메인의 권위 지표가 자동
                표시됩니다. 더 자세한 분석은{" "}
                <Link href="/tools/domain-authority" className="text-blue-600 hover:underline">
                  도메인 권위도 분석기
                </Link>
                를 이용하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">함께 쓰면 좋은 도구</h2>
          <RelatedTools currentTool="backlink-checker" />
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
          <h2 className="text-lg font-bold mb-2">
            더 정밀한 백링크 프로파일 분석이 필요하신가요?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            경쟁사 대비 심층 링크 갭 분석, 스팸 백링크 제거, 고품질 백링크
            구축까지 전문가가 직접 컨설팅합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              전문가 무료 상담
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              다른 SEO 도구 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
