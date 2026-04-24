import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { CommonBacklinksForm } from "./common-backlinks-form";
import { RelatedTools } from "@/components/related-tools";
import Link from "next/link";

export const metadata: Metadata = {
  title: "공통 백링크 도메인 분석기 — 산업 권위 사이트 무료 발굴",
  description:
    "경쟁사 도메인 2~5개를 입력하면 모든 경쟁사가 공통으로 백링크를 받은 출처 도메인을 DA 순으로 추출합니다. 백링크 소스 발굴과 링크 빌딩 타겟 선정에 활용하세요.",
  openGraph: {
    title: "공통 백링크 도메인 분석기 | SEO월드",
    description:
      "여러 경쟁사 공통 백링크를 분석해 산업 권위 사이트를 찾아보세요. 링크 빌딩 타겟을 DA 순으로 무료 추출.",
  },
  alternates: { canonical: "/tools/common-backlinks" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "공통 백링크 도메인 분석기",
  description:
    "경쟁사 도메인 2~5개를 입력해 공통 백링크 referring 도메인을 DA 순으로 추출하는 무료 SEO 도구",
  url: "https://seoworld.co.kr/tools/common-backlinks",
  inLanguage: "ko",
  isPartOf: { "@type": "WebSite", url: "https://seoworld.co.kr" },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "공통 백링크 도메인 분석기",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "여러 경쟁사가 공통으로 받은 백링크 소스를 Moz DA 순으로 추출해 링크 빌딩 타겟을 발굴하는 도구",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "공통 백링크 도메인 분석 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "경쟁사 도메인 입력",
      text: "분석할 경쟁사 도메인을 2~5개 입력합니다. 예: competitor1.com, competitor2.com",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "공통 백링크 분석 실행",
      text: "분석 버튼을 클릭하면 각 도메인의 referring 도메인을 수집한 뒤 공통 교집합을 추출합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "DA 순 결과 확인 및 활용",
      text: "Moz DA 내림차순으로 정렬된 공통 referring 도메인을 확인하고 링크 빌딩 타겟으로 활용합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "공통 백링크가 왜 중요한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "여러 경쟁사가 동일한 도메인으로부터 링크를 받고 있다는 것은 그 사이트가 해당 산업에서 신뢰받는 권위 소스임을 의미합니다. 공통 백링크 소스는 \"산업 필수 백링크\"로 볼 수 있으며, 이 사이트들에 자신의 링크를 추가하면 경쟁 기반 수준의 백링크 프로필을 갖출 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사 몇 개까지 입력해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "최소 2개, 권장은 3~4개입니다. 경쟁사가 많을수록 공통 교집합이 좁아지므로, 3개 입력 시 \"3개 중 2개 이상 공통\" 기준을 적용하면 실용적인 타겟 목록을 얻을 수 있습니다. 5개를 모두 사용하면 핵심 산업 권위 사이트만 추출됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "DA 낮은 공통 백링크는 어떻게 봐야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DA가 낮더라도 주제 관련성이 높거나 모든 경쟁사가 해당 사이트에 등록된 경우, 업종 특화 디렉토리나 협회 사이트일 가능성이 큽니다. DA 단독 기준보다는 주제 일치도와 트래픽을 함께 검토하고, DA 20 이상이라면 적극 공략 대상으로 분류하세요.",
      },
    },
    {
      "@type": "Question",
      name: "백링크 갭 분석과 어떻게 조합하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "공통 백링크는 모든 경쟁사가 이미 확보한 \"산업 기본값\"입니다. 백링크 갭 분석은 특정 경쟁사만 가진 \"경쟁 우위 링크\"를 보여줍니다. 두 도구를 함께 사용하면 방어적 링크 빌딩(공통)과 공격적 링크 빌딩(갭)을 병행할 수 있습니다. 백링크 갭 분석은 백링크 갭 분석기에서 사용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사를 어떻게 식별하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "타겟 키워드 기준 상위 노출 도메인이 실질적인 경쟁사입니다. 직접 Google 검색 결과를 확인하거나, SEO월드의 경쟁사 도메인 발굴 도구를 활용하면 키워드 기반 경쟁 도메인을 자동으로 추출할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "백링크 품질 검증을 더 하려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "공통 백링크 목록을 확보한 뒤 개별 도메인의 DA, 스팸 점수, 링크 프로필을 상세 점검하려면 백링크 분석기를 사용하세요. 해당 도구로 각 소스 도메인의 신뢰도를 한번 더 확인한 뒤 아웃리치 우선순위를 정하는 것이 효율적입니다.",
      },
    },
  ],
};

const faqItems = [
  {
    q: "공통 백링크가 왜 중요한가요?",
    a: "여러 경쟁사가 동일한 도메인으로부터 링크를 받고 있다는 것은 그 사이트가 해당 산업에서 신뢰받는 권위 소스임을 의미합니다. 공통 백링크 소스는 &ldquo;산업 필수 백링크&rdquo;로 볼 수 있으며, 이 사이트들에 자신의 링크를 추가하면 경쟁 기반 수준의 백링크 프로필을 갖출 수 있습니다.",
  },
  {
    q: "경쟁사 몇 개까지 입력해야 하나요?",
    a: "최소 2개, 권장은 3~4개입니다. 경쟁사가 많을수록 공통 교집합이 좁아지므로, 3개 입력 시 &ldquo;3개 중 2개 이상 공통&rdquo; 기준을 적용하면 실용적인 타겟 목록을 얻을 수 있습니다. 5개를 모두 사용하면 핵심 산업 권위 사이트만 추출됩니다.",
  },
  {
    q: "DA 낮은 공통 백링크는 어떻게 봐야 하나요?",
    a: "DA가 낮더라도 주제 관련성이 높거나 모든 경쟁사가 해당 사이트에 등록된 경우, 업종 특화 디렉토리나 협회 사이트일 가능성이 큽니다. DA 단독 기준보다는 주제 일치도와 트래픽을 함께 검토하고, DA 20 이상이라면 적극 공략 대상으로 분류하세요.",
  },
  {
    q: "백링크 갭 분석과 어떻게 조합하나요?",
    a: "공통 백링크는 모든 경쟁사가 이미 확보한 &ldquo;산업 기본값&rdquo;입니다. 백링크 갭 분석은 특정 경쟁사만 가진 &ldquo;경쟁 우위 링크&rdquo;를 보여줍니다. 두 도구를 함께 사용하면 방어적 링크 빌딩(공통)과 공격적 링크 빌딩(갭)을 병행할 수 있습니다. 백링크 갭 분석은 <a href='/tools/backlink-gap' className='underline'>백링크 갭 분석기</a>에서 사용하세요.",
  },
  {
    q: "경쟁사를 어떻게 식별하나요?",
    a: "타겟 키워드 기준 상위 노출 도메인이 실질적인 경쟁사입니다. 직접 Google 검색 결과를 확인하거나, SEO월드의 <a href='/tools/competitor-discovery' className='underline'>경쟁사 도메인 발굴 도구</a>를 활용하면 키워드 기반 경쟁 도메인을 자동으로 추출할 수 있습니다.",
  },
  {
    q: "백링크 품질 검증을 더 하려면?",
    a: "공통 백링크 목록을 확보한 뒤 개별 도메인의 DA, 스팸 점수, 링크 프로필을 상세 점검하려면 <a href='/tools/backlink-checker' className='underline'>백링크 분석기</a>를 사용하세요. 해당 도구로 각 소스 도메인의 신뢰도를 한번 더 확인한 뒤 아웃리치 우선순위를 정하는 것이 효율적입니다.",
  },
];

export default function CommonBacklinksPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">공통 백링크 도메인 분석기</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            여러 경쟁사 공통 백링크 소스를 한번에 발굴하세요
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            경쟁사 도메인 2~5개를 입력하면 모든 경쟁사가 공통으로 받은
            referring 도메인을 Moz DA 순으로 추출합니다. 산업 권위 사이트와
            링크 빌딩 타겟을 바로 파악하세요.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-blue-900">
                산업 필수 백링크 발굴
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                경쟁사 여러 곳이 동시에 링크를 받는 사이트는 해당 산업에서
                공인된 권위 소스입니다. 공통 백링크 소스를 확보하면 경쟁
                기반치 수준의 백링크 프로필을 빠르게 갖출 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-green-900">
                DA 기반 우선순위 정렬
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                Moz Domain Authority 기준으로 내림차순 정렬된 결과를
                제공합니다. 높은 DA 소스부터 아웃리치하면 링크 빌딩 ROI를
                극대화할 수 있습니다. 상위 30개 결과를 CSV로 다운로드하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-amber-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-amber-900">
                갭 분석과 조합 활용
              </h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                공통 백링크(산업 기본값)와 백링크 갭(경쟁 우위)을 함께
                분석하면 방어적 링크 빌딩과 공격적 링크 빌딩을 동시에
                진행할 수 있습니다. 두 도구를 조합해 완성도 높은 전략을
                수립하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold">사용 방법 3단계</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "경쟁사 도메인 입력",
                desc: "분석할 경쟁사 도메인을 2~5개 입력합니다. 예: competitor1.com",
              },
              {
                step: "2",
                title: "공통 백링크 분석 실행",
                desc: "분석 버튼을 클릭하면 각 도메인의 referring 도메인 교집합을 자동 추출합니다.",
              },
              {
                step: "3",
                title: "DA 순 결과 확인 및 활용",
                desc: "Moz DA 내림차순 결과를 확인하고 링크 빌딩 타겟 목록으로 바로 활용하세요.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex gap-3 rounded-xl border bg-card p-4"
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
              </li>
            ))}
          </ol>
        </div>

        {/* Form */}
        <CommonBacklinksForm />

        {/* Guide Article */}
        <article className="tools-prose mt-16 space-y-10 border-t pt-12 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              공통 백링크가 &ldquo;산업 필수 백링크&rdquo;인 이유
            </h2>
            <p>
              여러 경쟁사가 동일한 외부 도메인으로부터 링크를 받는다는 사실은
              단순한 우연이 아닙니다. 그 사이트는 해당 산업에서 신뢰받는 권위
              소스로 자리 잡았기 때문에 다수의 플레이어가 자연스럽게 링크를
              획득하거나 적극적으로 확보한 것입니다. 예를 들어 국내 IT 업계라면
              특정 테크 미디어나 산업 협회 사이트가, 인테리어 업계라면 인테리어
              전문 포털이 공통 백링크 소스로 자주 등장합니다.
            </p>
            <p className="mt-3">
              이러한 공통 소스를 &ldquo;산업 필수 백링크&rdquo;라고 부르는 이유는
              경쟁사가 이미 확보한 링크이기 때문에 검색엔진 입장에서 해당 사이트
              링크를 보유하지 않은 도메인을 신뢰도가 낮다고 볼 수 있기 때문입니다.
              반대로 이 소스들에 링크를 추가하면 경쟁 기반치 이상의 백링크
              프로필을 갖추게 되어 업종 내 신뢰도를 빠르게 채울 수 있습니다.
              신규 사이트나 백링크가 부족한 도메인이라면 공통 백링크 확보를
              최우선 목표로 삼으세요.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              공통 백링크 결과를 우선순위화하는 법
            </h2>
            <p>
              공통 백링크 분석 결과에는 수십 개의 referring 도메인이 등장할 수
              있습니다. 모든 소스를 동등하게 공략하면 시간과 자원이 낭비됩니다.
              우선순위 기준으로는 세 가지를 활용하세요. 첫째, Moz Domain
              Authority(DA)입니다. DA 40 이상은 최우선 타겟, DA 20~39는
              2차 타겟으로 분류하세요. 둘째, 도메인 나이입니다. 오래된
              도메인일수록 검색엔진으로부터 누적된 신뢰가 있으므로 링크
              가치가 높습니다. 셋째, 주제 관련성입니다. DA가 높더라도 산업
              관련성이 낮은 도메인은 링크 가치가 희석됩니다.
            </p>
            <p className="mt-3">
              경쟁사를 3개 입력했다면 &ldquo;3개 중 2개 이상 공통&rdquo; 기준을
              권장합니다. 모든 경쟁사에 등장하는 소스는 반드시 확보해야 하며,
              절반 이상 공통인 소스는 높은 우선순위로 배치하세요. DA와 공통
              빈도를 조합한 점수 체계를 만들면 아웃리치 캠페인의 효율을 크게
              높일 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              공통 백링크 소스에 접근하는 전략
            </h2>
            <p>
              공통 백링크 소스를 확인했다면 해당 사이트에 링크를 추가하는 방법을
              파악해야 합니다. 가장 먼저 해당 사이트의 기고 가이드라인 페이지를
              찾아보세요. 미디어나 블로그 형태의 사이트라면 게스트 포스트를 통해
              링크를 확보할 수 있습니다. 편집자 이메일을 찾아 기고 제안서를 보낼
              때는 독자에게 가치 있는 콘텐츠 아이디어를 중심으로 설득하세요.
            </p>
            <p className="mt-3">
              디렉토리나 리소스 페이지 형태의 소스라면 등록 신청 양식이나
              관리자 연락처를 통해 사이트 등록을 요청하세요. 업계 협회나 단체
              사이트라면 회원 가입이나 파트너십이 링크 획득 경로가 될 수
              있습니다. 또한 해당 사이트의 인터뷰 섹션이나 사례 연구 코너에
              자사 전문가를 소개하는 방식도 효과적입니다. 접근 방식은 소스
              사이트의 성격에 맞게 맞춤화하는 것이 핵심입니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              공통 백링크와 백링크 갭의 조합 전략
            </h2>
            <p>
              공통 백링크 분석과 백링크 갭 분석은 서로 보완 관계입니다. 공통
              백링크는 &ldquo;산업 필수&rdquo; 링크로, 모든 경쟁사가 보유한 기본
              수준의 백링크 프로필을 채우는 데 활용합니다. 반면 백링크 갭
              분석은 특정 경쟁사만 가지고 있는 링크를 보여주므로, 경쟁 우위를
              만들어내는 &ldquo;공격적 링크 빌딩&rdquo;에 적합합니다.
            </p>
            <p className="mt-3">
              실질적인 링크 빌딩 포트폴리오는 두 데이터를 조합해 구성하세요.
              공통 백링크 소스는 확보 난이도가 상대적으로 낮고 리소스 사이트나
              디렉토리 형태가 많아 빠른 성과가 가능합니다. 백링크 갭 소스는
              경쟁사 특화 미디어나 파트너십 링크가 포함돼 아웃리치 난이도가
              높지만 경쟁 우위 확보에 직결됩니다. 월별 링크 빌딩 목표에서
              공통 50%, 갭 50% 비율로 시작한 뒤 성과를 보면서 조정해 나가는
              것을 권장합니다.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-14 border-t pt-12">
          <h2 className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {faqItems.map((item, i) => (
              <div key={i}>
                <h3 className="mb-1 text-sm font-semibold">{item.q}</h3>
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-14 border-t pt-12">
          <RelatedTools currentTool="common-backlinks" />
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-xl font-bold">
            백링크 전략을 전문가에게 맡기고 싶다면
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            공통 백링크 소스 발굴부터 아웃리치 실행까지 SEO월드 전문팀이
            도와드립니다.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            무료 상담 신청
          </Link>
        </div>
      </div>
    </>
  );
}
