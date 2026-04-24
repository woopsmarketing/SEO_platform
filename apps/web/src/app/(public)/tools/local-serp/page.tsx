import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LocalSerpForm } from "./local-serp-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "지역 SERP 체커 — 국가·언어별 구글 검색 결과 비교 무료 도구",
  description:
    "같은 키워드로 한국, 미국, 일본 등 국가·언어별 구글 SERP를 즉시 비교하세요. 글로벌 SEO 진출, 해외 경쟁사 파악, hreflang 효과 검증에 활용하는 무료 지역 SERP 체커입니다.",
  keywords: [
    "지역 SERP",
    "국가별 구글 검색",
    "글로벌 SERP 체커",
    "나라별 구글 검색 결과",
    "해외 SEO",
    "언어별 검색 순위",
    "다국어 SEO 도구",
  ],
  openGraph: {
    title: "지역 SERP 체커 — 국가·언어별 구글 검색 결과 비교 | SEO월드",
    description:
      "한국·미국·일본 등 10개국 구글 SERP를 키워드 하나로 비교. 해외 SEO 전략 수립에 필수적인 무료 도구.",
  },
  alternates: { canonical: "/tools/local-serp" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "지역 SERP 체커",
  url: "https://seoworld.co.kr/tools/local-serp",
  description:
    "국가와 언어를 선택해 구글 SERP를 비교하는 무료 글로벌 SEO 도구. 한국·미국·일본·영국·베트남 등 10개국 지원.",
  applicationCategory: "SEO Tool",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  featureList: [
    "국가·언어별 구글 SERP 조회",
    "두 지역 SERP 나란히 비교",
    "10개 주요 국가 지원",
    "실시간 검색 결과 확인",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "같은 키워드인데 나라별로 순위가 다른 이유는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글은 사용자의 국가(gl 파라미터), 언어(hl 파라미터), ccTLD, 현지 백링크 프로필, 클릭 데이터 등을 종합해 각 국가마다 다른 SERP를 반환합니다. 미국 사용자에게 최적화된 영어 콘텐츠가 한국 SERP에서는 낮은 순위를 기록하는 이유입니다.",
      },
    },
    {
      "@type": "Question",
      name: "한국 사이트인데 미국 SERP도 확인해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "영어 콘텐츠나 글로벌 서비스를 운영한다면 미국 SERP 확인은 필수입니다. 현지 경쟁사가 누구인지, 어떤 콘텐츠가 상위에 노출되는지 파악해야 타겟 시장에서 통하는 SEO 전략을 세울 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "hreflang 태그를 넣으면 이 도구로 즉시 반영되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "hreflang은 구글이 크롤링·인덱싱한 후에 반영됩니다. 태그 추가 후 Google Search Console에서 인덱싱 요청을 하고, 수 일~수 주 후 이 도구로 해당 국가 SERP를 다시 확인하는 방식으로 효과를 검증할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "VPN으로 나라를 바꿔 검색하는 것과 차이가 뭔가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VPN은 IP만 바꾸므로 구글 계정 설정·쿠키·개인화 결과가 혼입됩니다. 이 도구는 gl(국가)·hl(언어) 파라미터를 직접 지정해 순수한 지역 SERP를 조회하므로 개인화 노이즈 없이 객관적인 순위를 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "국가별 키워드 조사도 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "국가·언어별 검색량 및 관련 키워드 발굴은 키워드 리서치 도구(/tools/keyword-research)를 이용하세요. 지역 SERP 체커와 함께 사용하면 타겟 키워드의 현지 순위와 검색 수요를 동시에 파악할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "해외 진출 SEO 컨설팅도 받을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, SEO월드에서는 글로벌 SEO 전략 수립, hreflang 구현, 현지 백링크 확보 등 해외 진출 SEO 컨설팅을 제공합니다. /contact 페이지에서 문의해 주시면 담당자가 맞춤 방안을 안내해 드립니다.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "지역 SERP 체커 사용 방법",
  description: "키워드와 국가·언어를 선택해 구글 SERP를 비교하는 3단계 가이드",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "키워드 입력",
      text: "비교할 키워드를 입력창에 입력합니다. 영어·한국어 등 언어 무관하게 입력 가능합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "국가·언어 선택",
      text: "드롭다운에서 조회할 국가와 언어를 선택합니다. 비교 토글을 켜면 두 지역의 SERP를 나란히 볼 수 있습니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "결과 확인 및 전략 수립",
      text: "각 국가의 상위 노출 URL·도메인·스니펫을 분석해 현지 경쟁사를 파악하고 콘텐츠 전략을 수립합니다.",
    },
  ],
};

export default function LocalSerpPage() {
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
          <h1 className="text-3xl font-bold">지역 SERP 체커</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            국가·언어별 구글 검색 결과 비교 — 글로벌 SERP 체커
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            같은 키워드라도 나라별 구글 검색 결과는 크게 다릅니다. 한국·미국·일본 등
            10개국 SERP를 키워드 하나로 즉시 비교해 해외 SEO 전략을 수립하세요.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-amber-900 mb-2">
                지역별 SERP가 왜 다를까
              </h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                구글은 국가(gl)·언어(hl)·ccTLD·현지 백링크 프로필을 종합해
                국가마다 다른 결과를 반환합니다. 미국과 한국 SERP는 같은
                키워드라도 전혀 다른 페이지가 상위에 노출됩니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                해외 SEO 진출에 필수
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                글로벌 서비스·다국어 사이트 운영 시 현지 사용자가 실제로 보는
                SERP를 파악해야 효과적인 콘텐츠·백링크 전략을 수립할 수
                있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-green-900 mb-2">
                두 지역 나란히 비교
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                &ldquo;다른 지역과 비교&rdquo; 토글로 두 국가 SERP를 나란히
                확인하세요. 10개 주요 국가·언어 조합을 지원하며 무료로 이용할
                수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">지역 SERP 체커 사용 방법</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "키워드 입력",
                desc: "비교할 키워드를 입력합니다. 한국어·영어 등 언어 무관하게 입력 가능합니다.",
                color: "bg-slate-100 text-slate-700",
              },
              {
                step: "2",
                title: "국가·언어 선택",
                desc: "드롭다운에서 조회할 국가와 언어를 선택합니다. 비교 토글을 켜면 두 지역 SERP를 동시에 확인합니다.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                step: "3",
                title: "결과 분석",
                desc: "상위 노출 URL·도메인·스니펫을 분석해 현지 경쟁사를 파악하고 콘텐츠 전략을 수립합니다.",
                color: "bg-green-100 text-green-700",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${item.color}`}
                >
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <LocalSerpForm />

        {/* Guide Article */}
        <article className="tools-prose mt-16 border-t pt-12 prose-sm max-w-none">
          <h2 className="text-xl font-bold mb-3">
            왜 국가·언어별 SERP 결과가 다를까
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            구글은 검색 요청이 들어올 때 단순히 키워드만 보는 것이 아니라, 사용자의
            위치 정보와 언어 설정을 함께 고려합니다. 이를 결정하는 핵심 파라미터가
            <strong> gl(국가 코드)</strong>과 <strong>hl(언어 코드)</strong>입니다.
            예를 들어 <code>gl=kr&hl=ko</code>로 검색하면 한국 사용자를 대상으로
            최적화된 결과를, <code>gl=us&hl=en</code>으로 검색하면 미국 영어 사용자
            기준의 결과를 반환합니다.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            ccTLD(국가 최상위 도메인)도 중요한 지역 신호입니다. <code>.kr</code>
            도메인은 한국 SERP에서 가산점을 받고, <code>.jp</code>는 일본 검색에서
            유리합니다. 현지 사용자에게 얼마나 많은 클릭·체류 시간이 발생했는지,
            현지 사이트에서 얼마나 많은 백링크를 받았는지도 지역별 순위에 큰 영향을
            미칩니다. 결국 특정 국가 SERP에서 상위에 오르려면 그 국가 사용자를
            위한 맞춤 콘텐츠와 현지 백링크 전략이 필수입니다.
          </p>

          <h2 className="text-xl font-bold mb-3 mt-8">
            글로벌 SEO 진출 전 확인할 3가지
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            해외 SEO 진출을 계획한다면 기술적 준비와 콘텐츠 전략을 동시에 갖춰야
            합니다. 아래 3가지는 글로벌 SEO에서 빠지기 쉬운 핵심 체크포인트입니다.
          </p>
          <ul className="space-y-3 mb-4">
            <li className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">1. hreflang 태그 구현</strong> —
              동일 콘텐츠의 여러 언어 버전을 운영할 때 각 페이지에
              <code>hreflang</code> 태그를 올바르게 설정해야 구글이 해당 언어 사용자
              에게 적절한 버전을 보여줍니다. 누락되거나 잘못 설정된 hreflang은
              중복 콘텐츠 페널티와 국가별 순위 혼선을 야기합니다.
            </li>
            <li className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">2. 현지 서버·CDN 위치</strong> —
              서버 응답 속도는 Core Web Vitals에 직접 영향을 줍니다. 타겟 국가와
              물리적으로 가까운 CDN 엣지 노드를 활용하면 현지 사용자 경험과 순위를
              함께 개선할 수 있습니다.
            </li>
            <li className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">3. 로컬 백링크 확보</strong> —
              타겟 국가 미디어·블로그·디렉토리에서 언급·링크를 받는 것이 가장
              강력한 지역 신호입니다. 현지 PR, 게스트 포스팅, 로컬 파트너십을
              통해 현지 도메인에서의 백링크를 꾸준히 쌓아야 합니다.
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-3 mt-8">
            지역 SERP 체커 결과 활용법
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            이 도구로 조회한 결과를 어떻게 SEO 전략에 연결할 수 있을까요? 첫째,
            <strong> 타겟 국가에서의 내 사이트 순위를 측정</strong>할 수 있습니다.
            직접 URL을 SERP에서 찾아 현재 위치를 파악하고, 경쟁사와의 격차를
            확인하세요. 둘째, <strong>현지 경쟁사 파악</strong>에 활용하세요.
            상위 10위에 노출되는 도메인을 분석하면 타겟 국가에서 강한 사이트가
            어디인지, 어떤 유형의 콘텐츠(블로그·제품페이지·뉴스)가 주로 노출되는지
            알 수 있습니다. 셋째, <strong>두 지역 비교 기능</strong>으로 같은
            키워드에 대해 국가별 의도 차이를 파악하세요. 한국에서는 정보성 콘텐츠가,
            미국에서는 상업성 랜딩페이지가 상위에 오른다면 각각 다른 전략이
            필요합니다. 마지막으로 hreflang 설정 후 구글이 인덱싱을 완료했다면,
            이 도구로 해당 국가 SERP를 재조회해 효과를 검증하세요.
          </p>

          <h2 className="text-xl font-bold mb-3 mt-8">
            지원 국가·언어 범위
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            현재 지역 SERP 체커는 10개 주요 국가·언어 조합을 지원합니다. 한국(한국어),
            미국(영어), 일본(일본어), 영국(영어), 독일(독일어), 프랑스(프랑스어),
            캐나다(영어), 호주(영어), 싱가포르(영어), 베트남(베트남어)입니다.
            한국 기업이 가장 많이 진출하는 시장인 미국·일본·동남아시아(싱가포르·
            베트남)를 우선 지원하며, 유럽 주요국(독일·프랑스·영국)까지 커버합니다.
            스페인어·중국어 등 추가 언어 지원은 지속적으로 확대할 예정입니다.
            각 지역 SERP 조회는 구글의 공식 검색 파라미터(gl·hl)를 사용하므로
            실제 현지 사용자가 보는 결과와 동일한 데이터를 제공합니다.
          </p>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-10">
          <h2 className="text-xl font-bold mb-6">지역 SERP 체커 자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                같은 키워드인데 나라별로 순위가 다른 이유는?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                구글은 사용자의 국가(gl 파라미터)·언어(hl 파라미터)·ccTLD·현지
                백링크 프로필·클릭 데이터를 종합해 각 국가마다 다른 SERP를
                반환합니다. 미국 최적화 영어 콘텐츠가 한국 SERP에서 낮은 순위를
                기록하는 이유가 여기에 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                한국 사이트인데 미국 SERP도 확인해야 하나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                영어 콘텐츠나 글로벌 서비스를 운영한다면 미국 SERP 확인은 필수입니다.
                현지 경쟁사가 누구인지, 어떤 콘텐츠가 상위에 노출되는지 파악해야
                타겟 시장에서 효과적인 SEO 전략을 세울 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                hreflang 태그를 넣으면 이 도구로 즉시 반영되나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                hreflang은 구글이 크롤링·인덱싱한 후에 반영됩니다. 태그 추가 후
                Google Search Console에서 인덱싱 요청을 하고, 수 일~수 주 후
                이 도구로 해당 국가 SERP를 다시 확인해 효과를 검증하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                VPN으로 나라를 바꿔 검색하는 것과 차이가 뭔가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                VPN은 IP만 바꾸므로 구글 계정·쿠키·개인화 결과가 혼입됩니다. 이
                도구는 gl·hl 파라미터를 직접 지정해 개인화 노이즈 없이 객관적인
                지역 SERP를 조회하므로 SEO 분석에 더 정확합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                국가별 키워드 조사도 가능한가요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                국가·언어별 검색량 및 관련 키워드 발굴은{" "}
                <Link
                  href="/tools/keyword-research"
                  className="text-blue-600 hover:underline"
                >
                  키워드 리서치 도구
                </Link>
                를 이용하세요. 지역 SERP 체커와 함께 사용하면 타겟 키워드의 현지
                순위와 수요를 동시에 파악할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                해외 진출 SEO 컨설팅도 받을 수 있나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                네, SEO월드에서는 글로벌 SEO 전략 수립·hreflang 구현·현지 백링크
                확보 등 해외 진출 SEO 컨설팅을 제공합니다.{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  문의 페이지
                </Link>
                에서 요청해 주시면 담당자가 맞춤 방안을 안내해 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12">
          <RelatedTools currentTool="local-serp" />
        </div>

        {/* CTA Card */}
        <div className="mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">
            글로벌 SEO 전략, 전문가와 함께 수립하세요
          </h2>
          <p className="text-sm text-blue-100 mb-6 max-w-xl mx-auto">
            지역 SERP 데이터를 해석하고 실질적인 해외 진출 SEO 로드맵으로
            연결하려면 전문가의 도움이 필요합니다. SEO월드 컨설팅 팀이 함께
            합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white text-blue-700 font-semibold px-6 py-2.5 text-sm hover:bg-blue-50 transition-colors"
            >
              무료 컨설팅 문의
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-white/50 text-white font-semibold px-6 py-2.5 text-sm hover:bg-white/10 transition-colors"
            >
              다른 SEO 도구 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
