import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { MyTopKeywordsForm } from "./my-top-keywords-form";

export const metadata: Metadata = {
  title: "내 노출 키워드 TOP 20 — 내 도메인 노출 키워드 무료 확인 도구",
  description:
    "도메인을 입력하면 구글 상위에 노출된 키워드 TOP 20을 순위·검색량과 함께 추출합니다. GSC 없이도 내 사이트 순위 키워드를 확인하고 경쟁사 도메인도 분석할 수 있습니다.",
  openGraph: {
    title: "내 도메인 노출 키워드 TOP 20 | SEO월드",
    description:
      "도메인별 키워드 조회 무료 도구. 내 사이트가 구글에서 노출되는 키워드를 순위순으로 확인하세요.",
  },
  alternates: { canonical: "/tools/my-top-keywords" },
};

const jsonLdWebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "내 노출 키워드 TOP 20",
  url: "https://seoworld.co.kr/tools/my-top-keywords",
  applicationCategory: "SEOApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "도메인을 입력하면 구글 상위 노출 키워드 TOP 20을 순위·검색량·경쟁도와 함께 추출하는 무료 SEO 도구입니다.",
};

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Google Search Console과 뭐가 다른가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Search Console은 본인 소유 사이트만 확인할 수 있고 등록·인증 절차가 필요합니다. 이 도구는 도메인만 입력하면 소유 인증 없이도 내 사이트뿐 아니라 경쟁사 도메인의 노출 키워드도 바로 조회할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "TOP 20 이후 키워드는 왜 안 나오나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "무료 제공 범위를 TOP 20으로 제한하고 있습니다. 21위 이후 키워드까지 포함한 전수 조사가 필요하다면 SEO월드 /contact 페이지에서 맞춤 분석을 문의해 주세요.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사 도메인도 분석할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 가능합니다. 경쟁사 도메인을 입력하면 경쟁사가 구글 상위에 노출되는 키워드를 확인할 수 있어 콘텐츠 갭 전략을 수립하는 데 활용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "데이터는 얼마나 최신인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "분석 버튼을 클릭하는 시점에 VebAPI를 통해 실시간으로 구글 SERP를 조회합니다. 따라서 결과는 조회 당일 기준의 최신 순위 데이터를 반영합니다.",
      },
    },
    {
      "@type": "Question",
      name: "지속적으로 순위를 추적하고 싶어요",
      acceptedAnswer: {
        "@type": "Answer",
        text: "이 도구는 즉시 조회 방식입니다. 주요 키워드를 정기적으로 모니터링하려면 SEO월드 대시보드(/dashboard/seo)의 순위 추적 기능을 이용하시거나, /contact에서 모니터링 서비스를 문의해 주세요.",
      },
    },
    {
      "@type": "Question",
      name: "추출된 키워드로 무엇을 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "11~20위 키워드는 콘텐츠 보강, 내부 링크, 제목·설명 재작성으로 1페이지 진입을 노려볼 수 있는 최우선 대상입니다. 콘텐츠 갭 분석(/tools/content-gap)과 스니펫 최적화(/tools/snippet-optimizer) 도구를 함께 활용해 보세요.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "내 도메인 노출 키워드 TOP 20 확인하는 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "분석할 도메인(예: example.com)을 입력하세요. https:// 없이 도메인만 입력해도 됩니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "노출 키워드 분석 실행",
      text: "버튼을 클릭하면 VebAPI가 관련 시드 키워드를 확장하고 구글 SERP에서 도메인 순위를 조회합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "결과 확인 및 전략 수립",
      text: "TOP 20 키워드를 순위·검색량·경쟁도(평균 DA)와 함께 확인하고, 11~20위 키워드를 1페이지로 끌어올리는 전략을 수립합니다.",
    },
  ],
};

export default function MyTopKeywordsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">내 노출 키워드 TOP 20</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            내 도메인 노출 키워드 무료 확인 — 도메인별 키워드 조회 도구
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            도메인을 입력하면 VebAPI로 관련 시드 키워드를 자동 확장하고, 구글 SERP 상위
            100위에서 도메인이 노출된 키워드와 순위·검색량·경쟁도를 TOP 20으로 정리합니다.
            Google Search Console 없이도 내 사이트 순위 키워드를 즉시 확인할 수 있습니다.
          </p>
        </div>

        {/* 3 info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                GSC 대체 무료 도구
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                Google Search Console은 소유 인증이 필요하고 본인 사이트만 조회됩니다.
                이 도구는 도메인만 입력하면 소유 인증 없이 내 사이트와 경쟁사 도메인의
                상위 노출 키워드를 모두 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-amber-900 mb-2">
                경쟁도(평균 DA)까지 한눈에
              </h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                각 노출 키워드의 구글 상위 10개 도메인의 평균 Moz DA를 계산해 경쟁도를
                함께 제공합니다. 낮은 경쟁도 + 높은 순위 키워드가 최고의 보강 기회입니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-emerald-900 mb-2">
                11~20위 키워드 전략
              </h2>
              <p className="text-xs leading-relaxed text-emerald-800/80">
                11~20위 키워드는 이미 구글이 관련 페이지로 인정한 신호입니다. 콘텐츠 보강,
                내부 링크, 메타 재작성, 백링크 확보로 1페이지 진입이 가능한 최우선 대상입니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10 border-b pb-10">
          <h2 className="text-lg font-bold mb-4">내 도메인 노출 키워드 확인하는 방법</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">1</div>
              <h3 className="font-semibold text-sm mb-1">도메인 입력</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                분석할 도메인을 입력합니다. https:// 없이 도메인만 입력해도 자동으로
                인식됩니다. 시드 키워드를 직접 추가하면 조사 범위를 좁힐 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">2</div>
              <h3 className="font-semibold text-sm mb-1">SERP 자동 조회</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                VebAPI가 관련 키워드를 최대 50개 확장하고 각 키워드의 구글 SERP를
                실시간 조회합니다. 도메인이 상위 100위 안에 등장한 키워드만 필터링됩니다.
              </p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-3">3</div>
              <h3 className="font-semibold text-sm mb-1">결과 확인 및 전략 수립</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                TOP 20 키워드를 순위·검색량·경쟁도와 함께 확인합니다. 11~20위 키워드를
                1페이지로 끌어올리는 전략에 즉시 활용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <MyTopKeywordsForm />

        {/* 가이드 article */}
        <article className="tools-prose mt-16 border-t pt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              내 도메인이 노출되는 키워드를 왜 알아야 할까
            </h2>
            <p>
              많은 사이트 운영자가 &ldquo;우리 사이트는 어떤 검색어로 들어오는가&rdquo;를 정확히 모릅니다.
              Google Search Console을 연동했다면 클릭 기준 상위 키워드를 볼 수 있지만,
              도메인 소유 인증 절차와 데이터 누적 기간이 필요합니다.
              특히 신규 사이트나 경쟁사 도메인은 GSC로 조회할 수 없습니다.
            </p>
            <p className="mt-3">
              이 도구는 도메인만 입력하면 소유 인증 없이 해당 도메인이 구글 상위에
              노출되는 키워드를 즉시 조회합니다. 활용 방법은 크게 세 가지입니다.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-foreground">내 사이트 현황 파악:</strong> 예상치 못한 키워드로 상위 노출되고 있다면
                해당 페이지를 더 강화하거나, 관련 롱테일 키워드를 추가로 공략할 수 있습니다.
              </li>
              <li>
                <strong className="text-foreground">경쟁사 도메인 조사:</strong> 경쟁사가 노출되는 TOP 20 키워드를 파악하면
                내가 놓치고 있는 검색 수요를 발견할 수 있습니다.
              </li>
              <li>
                <strong className="text-foreground">2페이지 푸시 키워드 발굴:</strong> 11~20위권 키워드는 구글이 이미
                &ldquo;관련 있음&rdquo;으로 인정한 신호입니다. 약간의 콘텐츠 보강만으로 1페이지 진입이 가능한
                최고의 성장 기회입니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              TOP 20 키워드 결과 해석하기
            </h2>
            <p>
              결과 표에는 키워드, 내 순위, 월 검색량, 경쟁도(평균 DA) 네 가지 지표가 표시됩니다.
              각 지표를 올바르게 해석하는 것이 전략 수립의 출발점입니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">내 순위</strong>는 현재 해당 키워드의 구글 검색 결과에서 내 페이지가
              위치한 순번입니다. 1~3위는 CTR이 각각 약 28%, 15%, 11%로, 순위 한 단계 차이가
              트래픽에 큰 영향을 미칩니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">월 검색량</strong>은 해당 키워드의 한 달 평균 구글 검색 횟수입니다.
              검색량이 높고 내 순위가 낮다면 개선 가능성이 가장 큰 키워드입니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">경쟁도(평균 DA)</strong>는 해당 키워드 구글 상위 10개 도메인의
              평균 Moz Domain Authority입니다. DA 30 미만이면 상대적으로 경쟁이 약한 키워드로,
              중소 사이트도 충분히 1페이지 진입을 노릴 수 있습니다.
            </p>
            <p className="mt-3">
              특히 <strong className="text-foreground">11~20위 키워드는 2페이지 푸시 대상</strong>으로
              우선 관리하세요. 구글은 이미 해당 페이지를 이 키워드와 연관 있다고 평가한 상태이므로,
              콘텐츠 보강과 UX 개선만으로 1페이지 상단 진입이 가능한 경우가 많습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              11~20위 키워드를 1페이지로 끌어올리는 전략
            </h2>
            <p>
              2페이지 최상단(11위)과 1페이지 최하단(10위)의 트래픽 차이는 약 3~5배에 달합니다.
              11~20위 키워드는 이미 구글의 인정을 받은 상태이므로 네 가지 전략을 순서대로 적용하면
              대부분 4~8주 내에 순위 상승을 확인할 수 있습니다.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">기존 콘텐츠 보강:</strong> 해당 키워드가 노출된 페이지에 접속해
                콘텐츠 길이, 정보의 구체성, 최신성을 점검합니다. 경쟁 상위 페이지와 비교해
                빠진 소주제나 데이터를 추가합니다.
              </li>
              <li>
                <strong className="text-foreground">내부 링크 강화:</strong> 해당 페이지로 연결되는 내부 링크가 부족하다면
                관련 콘텐츠에서 앵커 텍스트에 타겟 키워드를 포함한 링크를 추가합니다.
                내부 링크는 구글이 페이지 중요도를 평가하는 신호입니다.
              </li>
              <li>
                <strong className="text-foreground">제목과 메타 설명 재작성:</strong> title 태그에 타겟 키워드를 앞쪽에
                배치하고, meta description에 클릭을 유도하는 액션 문구를 추가합니다.
                CTR 개선은 간접적으로 순위 상승에 기여합니다.
              </li>
              <li>
                <strong className="text-foreground">백링크 확보:</strong> 경쟁도(평균 DA)가 높은 키워드라면 관련 사이트에서
                백링크를 추가로 확보해야 합니다. 게스트 포스팅, 자료 배포, 업계 디렉토리 등록이
                효과적인 방법입니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              경쟁사 도메인에도 적용하기
            </h2>
            <p>
              이 도구의 가장 강력한 기능 중 하나는 경쟁사 도메인을 그대로 입력해 분석할 수 있다는
              점입니다. 경쟁사의 TOP 20 키워드를 확인하면 다음 세 가지 인사이트를 얻을 수 있습니다.
            </p>
            <p className="mt-3">
              첫째, <strong className="text-foreground">내가 놓친 키워드 발견</strong>입니다. 경쟁사가 상위 노출되는 키워드 중
              내 사이트에서는 노출되지 않는 키워드가 있다면, 해당 주제에 대한 콘텐츠가 부재하거나
              최적화가 부족한 것입니다.
            </p>
            <p className="mt-3">
              둘째, <strong className="text-foreground">콘텐츠 갭 전략 수립</strong>입니다. 경쟁사 TOP 20과 내 TOP 20을
              비교해 겹치지 않는 키워드를 목록화합니다. 이 키워드들이 콘텐츠 갭으로,
              새 콘텐츠를 제작하거나 기존 콘텐츠를 보강할 우선순위 주제가 됩니다.
              /tools/content-gap 도구를 활용하면 더 체계적으로 분석할 수 있습니다.
            </p>
            <p className="mt-3">
              셋째, <strong className="text-foreground">현실적인 목표 순위 설정</strong>입니다. 경쟁사가 특정 키워드에서
              1~3위를 차지하고 있다면, 해당 키워드의 경쟁도(평균 DA)를 확인해
              내 현재 도메인 권위로 도전 가능한 키워드부터 순서를 잡아야 합니다.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                Google Search Console과 뭐가 다른가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Search Console은 본인 소유 사이트만 조회되며 도메인 소유 인증과
                데이터 누적 시간이 필요합니다. 이 도구는 도메인만 입력하면 소유 인증 없이
                내 사이트와 경쟁사 도메인 모두 즉시 조회할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                TOP 20 이후 키워드는 왜 안 나오나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                무료 제공 범위를 TOP 20으로 제한하고 있습니다. 21위 이후 키워드까지 포함한
                전수 조사가 필요하다면{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  /contact
                </a>
                에서 맞춤 분석을 문의해 주세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                경쟁사 도메인도 분석할 수 있나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                네, 가능합니다. 경쟁사 도메인을 입력란에 그대로 입력하면 경쟁사가 구글 상위에
                노출되는 TOP 20 키워드를 확인할 수 있습니다. 콘텐츠 갭 전략 수립에 바로
                활용할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                데이터는 얼마나 최신인가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                분석 버튼을 클릭하는 시점에 VebAPI를 통해 실시간으로 구글 SERP를 조회합니다.
                결과는 조회 당일 기준의 최신 순위 데이터를 반영합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                지속적으로 순위를 추적하고 싶어요
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                이 도구는 즉시 조회 방식입니다. 주요 키워드를 정기적으로 모니터링하려면
                SEO월드{" "}
                <a href="/dashboard/seo" className="text-blue-600 hover:underline">
                  대시보드
                </a>
                의 순위 추적 기능을 이용하시거나{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  /contact
                </a>
                에서 모니터링 서비스를 문의해 주세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                추출된 키워드로 무엇을 해야 하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                11~20위 키워드는 콘텐츠 보강, 내부 링크, 제목·설명 재작성으로 1페이지 진입을
                노려볼 수 있는 최우선 대상입니다.{" "}
                <a href="/tools/content-gap" className="text-blue-600 hover:underline">
                  콘텐츠 갭 분석
                </a>
                과{" "}
                <a href="/tools/snippet-optimizer" className="text-blue-600 hover:underline">
                  스니펫 최적화
                </a>{" "}
                도구를 함께 활용해 보세요.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12 border-t pt-12">
          <RelatedTools currentTool="my-top-keywords" />
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            더 깊은 SEO 분석이 필요하신가요?
          </h2>
          <p className="text-sm text-blue-100 mb-5">
            TOP 20 추출 이후 전략 수립, 경쟁사 분석, 백링크 확보까지 SEO 전문가의 도움을 받아보세요.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            무료 상담 문의하기
          </a>
        </div>
      </div>
    </>
  );
}
