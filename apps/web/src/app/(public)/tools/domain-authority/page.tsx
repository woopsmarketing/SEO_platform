import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { DomainAuthorityForm } from "./domain-authority-form";

export const metadata: Metadata = {
  title: "도메인 권위 체커 — Moz DA 확인 · Ahrefs DR · Majestic TF 무료 조회 | SEO월드",
  description:
    "도메인 권위 체커로 Moz DA, Ahrefs DR, Majestic TF·CF를 한 번에 무료 조회하세요. 점수 구간별 해석과 권위 향상 전략까지 제공합니다.",
  keywords: ["도메인 권위 체커", "Moz DA 확인", "Ahrefs DR 조회", "Majestic TF", "도메인 지표 무료 확인"],
  openGraph: {
    title: "도메인 권위 체커 — Moz DA · Ahrefs DR · Majestic TF 무료 조회",
    description: "도메인 하나 입력으로 DA·DR·TF·CF를 한 번에 확인. 점수 해석 가이드 포함.",
    url: "https://seoworld.co.kr/tools/domain-authority",
    type: "website",
  },
  alternates: { canonical: "/tools/domain-authority" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "도메인 권위 체커",
  description:
    "Moz DA, Ahrefs DR, Majestic TF·CF를 한 번에 무료로 조회하는 도메인 권위 체커 도구입니다.",
  url: "https://seoworld.co.kr/tools/domain-authority",
  inLanguage: "ko",
  isPartOf: { "@type": "WebSite", url: "https://seoworld.co.kr" },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "도메인 권위 체커",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description: "Moz DA 확인, Ahrefs DR 조회, Majestic TF 무료 도구",
  url: "https://seoworld.co.kr/tools/domain-authority",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "도메인 권위 체커 사용 방법 3단계",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "분석할 도메인을 example.com 형식으로 입력합니다. 프로토콜(https://)은 제거해도 됩니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "지표 조회",
      text: "분석 버튼을 누르면 Moz DA, Ahrefs DR, Majestic TF·CF와 참조 도메인 수, 유기 트래픽을 한 번에 조회합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "결과 해석",
      text: "점수 구간별 해석 가이드와 TF:CF 비율로 링크 품질을 평가하고 다음 SEO 전략을 수립하세요.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "DA와 DR 중 어느 것이 더 정확한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "두 지표는 측정 방식이 다르기 때문에 우열을 가리기 어렵습니다. Moz DA는 광범위한 백링크 다양성을 반영하고, Ahrefs DR은 링크 네트워크의 상대적 강도를 집중적으로 평가합니다. 실무에서는 두 지표를 함께 보는 것이 가장 신뢰도 높은 판단을 가능하게 합니다.",
      },
    },
    {
      "@type": "Question",
      name: "점수가 낮아도 상위 노출이 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 가능합니다. DA·DR이 낮더라도 롱테일 키워드, 컨텐츠 품질, 온페이지 SEO가 잘 최적화되어 있으면 경쟁이 덜한 키워드에서 상위 노출이 충분히 가능합니다. 특히 신생 사이트라면 경쟁 강도가 낮은 키워드를 우선 공략하는 것이 효과적입니다.",
      },
    },
    {
      "@type": "Question",
      name: "DA를 빠르게 올리려면 어떻게 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DA를 빠르게 올리는 가장 확실한 방법은 신뢰도 높은 도메인(TF가 높은 사이트)으로부터 백링크를 확보하는 것입니다. 또한 내부링크 구조 정비, 중복 콘텐츠 제거, 기술 SEO 오류 수정도 점수 향상에 기여합니다. 단기간에 급격히 올리는 것은 어렵기 때문에 꾸준한 콘텐츠 생산과 자연스러운 링크 빌딩이 중요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "TF와 CF의 차이가 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TF(Trust Flow)는 신뢰할 수 있는 사이트로부터 받는 백링크의 품질을 측정하고, CF(Citation Flow)는 백링크의 양과 인용 규모를 측정합니다. TF:CF 비율이 0.5 이상이면 자연스럽고 품질 좋은 링크 프로필로 평가되며, 비율이 낮을수록 스팸 링크 비중이 높다는 신호일 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "두 도메인의 권위를 비교하고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "두 도메인을 동시에 비교하려면 도메인 비교 도구(https://seoworld.co.kr/tools/domain-compare)를 이용하세요. 두 도메인의 DA·DR·TF·CF를 나란히 비교하고 백링크 차이를 분석할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "백링크 품질을 점검하려면 어떤 도구를 써야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "백링크 품질 점검에는 백링크 체커(https://seoworld.co.kr/tools/backlink-checker)를 사용하세요. 링크 출처 도메인의 TF·DA를 확인하고, 스팸 링크 비율과 앵커텍스트 분포를 분석할 수 있습니다.",
      },
    },
  ],
};

export default function DomainAuthorityPage() {
  return (
    <>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">도메인 권위 체커</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Moz DA 확인 · Ahrefs DR · Majestic TF 무료 조회
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            도메인 하나를 입력하면 Moz DA(0-100), Ahrefs DR, Majestic TF·CF와 참조 도메인 수,
            유기 트래픽 추정치까지 한 번에 확인할 수 있습니다. 도메인 지표 무료 확인 후 점수 해석
            가이드를 참고해 백링크 전략을 수립하세요.
          </p>
        </div>

        {/* 3 info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="border-violet-100 bg-violet-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-violet-900">도메인 권위란?</h2>
              <p className="text-xs leading-relaxed text-violet-800/80">
                도메인 권위는 Moz, Ahrefs, Majestic이 자체 알고리즘으로 산출한 도메인의 검색
                영향력 점수입니다. 점수가 높을수록 경쟁 키워드에서 상위 노출 가능성이 높다고
                평가됩니다. 세 가지 지표를 동시에 비교해 도메인의 신뢰도를 다각도로 판단하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-blue-900">DA · DR · TF · CF 차이</h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                Moz DA는 백링크 양과 다양성을 로그 스케일로 평가하고, Ahrefs DR은 링크 네트워크의
                상대적 강도를 측정합니다. Majestic TF는 신뢰 사이트로부터의 링크 품질을, CF는
                인용 규모를 각각 나타냅니다. TF:CF 비율이 0.5 이상이면 건강한 링크 프로필입니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-green-900">활용 방법</h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                내 도메인의 현재 점수를 파악하고 경쟁사와 격차를 확인하세요. 백링크 구축 시
                출처 도메인의 DA·TF를 먼저 확인해 고품질 링크 여부를 판단할 수 있습니다.
                점수 구간별 해야 할 일은 아래 가이드를 참고하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold">사용 방법 3단계</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "도메인 입력", desc: "분석할 도메인을 example.com 형식으로 입력합니다. 프로토콜(https://)은 제거해도 됩니다." },
              { step: "2", title: "지표 조회", desc: "분석 버튼을 누르면 Moz DA, Ahrefs DR, Majestic TF·CF와 참조 도메인 수, 유기 트래픽을 한 번에 조회합니다." },
              { step: "3", title: "결과 해석", desc: "점수 구간별 해석 가이드와 TF:CF 비율로 링크 품질을 평가하고 다음 SEO 전략을 수립하세요." },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 rounded-lg border p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Suspense fallback={null}>
          <DomainAuthorityForm />
        </Suspense>

        {/* 가이드 article */}
        <article className="tools-prose mt-16 border-t pt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">도메인 권위 지표별 의미</h2>
            <p>
              <strong className="text-foreground">Moz DA(Domain Authority)</strong>는 0부터 100까지의 로그 스케일 점수입니다.
              로그 스케일이기 때문에 DA 20에서 40으로 올리는 것은 DA 60에서 80으로 올리는 것보다
              훨씬 어렵습니다. DA 20 미만 사이트는 기초 백링크 몇 개만 확보해도 점수가 크게 오르지만,
              DA 50 이상부터는 고품질 백링크를 지속적으로 축적해야 소폭 상승이 가능합니다.
              Moz DA는 약 40여 개의 링크 관련 요소를 종합하며, 백링크 수와 품질, 링크 도메인의
              다양성을 주요 변수로 사용합니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">Ahrefs DR(Domain Rating)</strong>은 백링크 네트워크의 상대적 강도를 측정합니다.
              Ahrefs의 방대한 크롤링 데이터베이스를 기반으로 하며, 참조 도메인의 수와 해당
              도메인의 DR 점수를 가중치로 반영합니다. 즉, DR이 높은 도메인으로부터 백링크를
              받을수록 DR 상승 효과가 큽니다. DR은 경쟁사 분석과 게스트 포스팅 대상 사이트를
              선별할 때 가장 자주 활용됩니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">Majestic TF(Trust Flow)</strong>는 신뢰도 높은 시드 사이트(Wikipedia, 정부 기관 등)와
              얼마나 가까운 링크 경로로 연결되어 있는지를 측정합니다. TF가 높을수록 실제 신뢰도
              있는 사이트로부터 백링크를 받고 있음을 의미합니다. 반면{" "}
              <strong className="text-foreground">CF(Citation Flow)</strong>는 백링크의 양적 규모를 나타냅니다.
              TF는 품질, CF는 양이라고 이해하면 됩니다. 두 수치가 비슷하게 높으면 이상적인
              링크 프로필이고, CF가 TF보다 과도하게 높으면 스팸 링크가 섞여 있을 가능성이
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">DA · DR · TF를 조합해서 해석하기</h2>
            <p>
              세 지표를 개별로 보는 것보다 조합해서 해석할 때 훨씬 정확한 판단이 가능합니다.
              먼저 <strong className="text-foreground">TF:CF 비율</strong>을 확인하세요.
              비율이 0.5 이상이면 자연스럽고 품질 좋은 링크 프로필을 뜻하며,
              0.3 미만이면 스팸 링크 정리를 고려해야 합니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">DR은 높고 TF가 낮은 경우</strong>는 주의가 필요합니다.
              Ahrefs 기준으로는 링크 수가 많아 보이지만, Majestic 기준에서는 신뢰 가능한
              링크가 적다는 의미입니다. 이는 링크 팜이나 PBN에서 인위적으로 생성된 백링크가
              섞여 있을 가능성이 있습니다. 반대로{" "}
              <strong className="text-foreground">TF가 DR보다 상대적으로 높은 경우</strong>는
              링크 수는 적지만 신뢰도 높은 사이트에서 언급되고 있다는 긍정적인 신호입니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">DA가 낮고 DR이 높은 경우</strong>는
              Moz가 아직 크롤링하지 못한 새 백링크가 많거나,
              Moz 데이터가 Ahrefs 대비 업데이트가 느린 것이 원인일 수 있습니다.
              신규 도메인이라면 세 지표 모두 낮게 시작하는 것이 정상이며,
              6개월~1년 단위로 추적해야 의미 있는 성장 패턴을 확인할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">점수 구간별 해야 할 일</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-foreground">DA 0~20 — 기초 셋업 단계</p>
                <p className="mt-1 text-xs">
                  도메인이 신규이거나 백링크가 거의 없는 상태입니다. 사이트맵 제출, Google Search Console
                  연동, 기술 SEO 오류 수정을 우선 처리하세요. 소수의 고품질 백링크(지역 디렉토리,
                  업계 협회 등)만 확보해도 점수가 빠르게 오릅니다.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-foreground">DA 20~40 — 지속 백링크 구축</p>
                <p className="mt-1 text-xs">
                  점수를 안정적으로 올리는 구간입니다. 게스트 포스팅, 리소스 페이지 링크,
                  언론 보도 등 다양한 출처에서 꾸준히 백링크를 획득하세요. 이 구간에서
                  경쟁 강도 낮은 롱테일 키워드 공략이 가장 효과적입니다.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-foreground">DA 40~60 — 오소리티 컨텐츠 투자</p>
                <p className="mt-1 text-xs">
                  점수 상승이 둔화되는 구간입니다. 이 단계에서는 단순 링크 수보다 링크 출처의
                  권위(TF·DR)가 더 중요합니다. 업계 리더십을 보여주는 오리지널 연구, 데이터
                  시각화, 전문가 인터뷰 등 링크를 자연스럽게 유인하는 콘텐츠를 제작하세요.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-semibold text-foreground">DA 60+ — PR · 브랜딩 전략</p>
                <p className="mt-1 text-xs">
                  상위 1% 도메인에 해당합니다. 이 구간에서는 PR 활동, 언론 기고, 업계 컨퍼런스
                  참가를 통한 브랜드 검색량 증가가 핵심입니다. 구글은 브랜드 검색 빈도를
                  신뢰 신호로 해석하므로 오프라인 인지도 향상이 DA에도 간접적으로 기여합니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">도메인 권위를 높이는 실전 방법 5가지</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>
                <strong className="text-foreground">양질의 콘텐츠 생산</strong> —
                타 사이트가 자연스럽게 인용하고 싶은 오리지널 데이터, 가이드, 도구를 만드세요.
                링크를 직접 요청하기 전에 링크를 받을 자격 있는 콘텐츠가 먼저입니다.
              </li>
              <li>
                <strong className="text-foreground">내부링크 구조 정비</strong> —
                사일로(Silo) 구조로 관련 페이지를 묶어 링크 에퀴티가 핵심 페이지로 집중되도록
                설계하세요. 고아 페이지(내부링크가 없는 페이지)를 제거하는 것도 중요합니다.
              </li>
              <li>
                <strong className="text-foreground">백링크 출처 다양화</strong> —
                동일 도메인에서 반복되는 링크는 가치가 낮습니다. 언론, 블로그, 포럼, 디렉토리,
                학술 자료 등 다양한 출처에서 자연스럽게 언급되는 링크 프로필을 만드세요.
              </li>
              <li>
                <strong className="text-foreground">기술 SEO 최적화</strong> —
                페이지 속도, Core Web Vitals, 모바일 친화성, HTTPS, 중복 콘텐츠 제거 등
                기술적 문제를 선제적으로 해결하면 크롤 효율이 높아지고 새 백링크의 효과가
                빠르게 반영됩니다.
              </li>
              <li>
                <strong className="text-foreground">브랜드 검색량 증가</strong> —
                소셜 미디어, 유튜브, 이메일 뉴스레터, 오프라인 마케팅을 통해 브랜드명을 직접
                검색하는 유저를 늘리세요. 브랜드 쿼리 증가는 도메인 신뢰도를 높이는 간접
                요소로 작용합니다.
              </li>
            </ol>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-10">
          <h2 className="mb-6 text-lg font-bold">도메인 권위 체커 자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">DA와 DR 중 어느 것이 더 정확한가요?</h3>
              <p className="mt-1 text-sm">
                두 지표는 측정 방식이 달라 우열을 가리기보다 보완적으로 사용하는 것이 맞습니다.
                Moz DA는 다양성, Ahrefs DR은 강도를 중심으로 평가합니다. 실무에서는 두 지표를
                함께 확인해 종합적인 판단을 내리는 것이 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">점수가 낮아도 상위 노출이 가능한가요?</h3>
              <p className="mt-1 text-sm">
                네, 가능합니다. DA·DR이 낮더라도 롱테일 키워드, 콘텐츠 품질, 온페이지 SEO
                최적화가 잘 되어 있으면 경쟁이 낮은 키워드에서 충분히 상위 노출됩니다. 신생
                사이트라면 낮은 경쟁 키워드를 우선 공략하는 전략이 가장 효과적입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">DA를 빠르게 올리려면?</h3>
              <p className="mt-1 text-sm">
                TF 높은 도메인으로부터 백링크를 확보하는 것이 가장 빠른 방법입니다. 내부링크
                구조 정비와 기술 SEO 오류 수정도 병행하세요. 단기간의 급격한 점수 상승은
                어렵기 때문에 꾸준한 콘텐츠 생산과 자연스러운 링크 빌딩이 핵심입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">TF와 CF 차이가 뭔가요?</h3>
              <p className="mt-1 text-sm">
                TF(Trust Flow)는 신뢰 사이트와의 링크 연결 품질을 측정하고, CF(Citation Flow)는
                백링크의 양적 규모를 측정합니다. TF:CF 비율이 0.5 이상이면 자연스러운 링크
                프로필이며, 비율이 낮을수록 스팸 링크 비중이 높다는 신호입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">두 도메인을 비교하고 싶어요.</h3>
              <p className="mt-1 text-sm">
                두 도메인을 나란히 비교하려면{" "}
                <Link href="/tools/domain-compare" className="text-violet-600 underline underline-offset-2">
                  도메인 비교 도구
                </Link>
                를 이용하세요. DA·DR·TF·CF 지표를 나란히 보여주고 백링크 격차를 분석해 드립니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">백링크 품질을 점검하려면?</h3>
              <p className="mt-1 text-sm">
                백링크 출처 도메인의 TF·DA를 확인하고 스팸 링크 비율을 점검하려면{" "}
                <Link href="/tools/backlink-checker" className="text-violet-600 underline underline-offset-2">
                  백링크 체커
                </Link>
                를 사용하세요. 앵커텍스트 분포와 링크 품질을 한눈에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">함께 쓰면 좋은 도구</h2>
          <RelatedTools currentTool="domain-authority" />
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-violet-100 bg-violet-50/60 p-8 text-center">
          <p className="text-base font-semibold text-foreground">
            도메인 권위 향상을 위한 전문 SEO 전략이 필요하신가요?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            백링크 분석부터 콘텐츠 전략, 기술 SEO까지 맞춤형 컨설팅을 받아보세요.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            무료 SEO 컨설팅 문의하기
          </Link>
        </div>
      </div>
    </>
  );
}
