import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BacklinkGapForm } from "./backlink-gap-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "백링크 갭 분석 — 경쟁사 백링크 기회 무료 발굴",
  description:
    "내 도메인과 경쟁사 도메인을 입력하면 경쟁사는 받고 있지만 내 사이트엔 없는 백링크 소스를 DA 순으로 정렬해 드립니다. 백링크 갭 분석으로 링크 빌딩 전략을 수립하세요.",
  openGraph: {
    title: "백링크 갭 분석 | SEO월드",
    description:
      "경쟁사 전용 백링크를 DA 순으로 확인하고 백링크 기회를 발굴하세요.",
  },
  alternates: { canonical: "/tools/backlink-gap" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "백링크 갭 분석",
  description:
    "내 도메인과 경쟁사 도메인을 비교해 경쟁사만 가진 백링크 소스를 DA 순으로 제시하는 무료 도구입니다.",
  url: "https://seoworld.co.kr/tools/backlink-gap",
  inLanguage: "ko",
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "백링크 갭 분석기",
  applicationCategory: "WebApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "경쟁사 전용 백링크 소스를 발굴하여 링크 빌딩 전략의 우선순위를 정하는 SEO 도구입니다.",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "백링크 갭 분석 사용 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "내 도메인과 분석할 경쟁사 도메인을 각각 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "갭 분석 실행",
      text: "두 도메인의 백링크를 병렬로 조회하고 소스 도메인을 비교합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "타깃 리스트 확보",
      text: "DA 순으로 정렬된 경쟁사 전용 소스를 확인하고 아웃리치 전략을 수립합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "백링크 갭 분석은 몇 명의 경쟁사로 하는 게 좋나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2~3개가 적당합니다. 경쟁사가 많아질수록 공통 소스가 줄어들어 오히려 타깃 리스트가 희석됩니다. 내 사이트와 검색 의도가 가장 유사한 직접 경쟁사 2개를 먼저 분석하고, 이후 추가하는 방식을 권장합니다.",
      },
    },
    {
      "@type": "Question",
      name: "DA가 낮은 백링크도 쓸모 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DA 10 미만 소스는 효과가 거의 없고 스팸 위험이 있습니다. 그러나 DA 20~39 구간이라도 주제 관련성이 높고 실제 트래픽이 있는 사이트라면 링크 가치는 충분합니다. DA 단독보다 관련성과 트래픽을 함께 고려하세요.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사가 없는 주제는 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "직접 경쟁사가 없다면 같은 카테고리의 해외 사이트나 유사 주제 블로그를 경쟁사로 입력해 보세요. 그 사이트들이 백링크를 받는 소스가 내 콘텐츠에도 관심 있을 가능성이 높습니다.",
      },
    },
    {
      "@type": "Question",
      name: "공통 백링크 분석과 백링크 갭 분석의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "공통 백링크 분석은 두 도메인이 모두 가진 소스를 확인해 내가 이미 확보했는지 점검하는 용도입니다. 백링크 갭 분석은 경쟁사만 가진 소스, 즉 아직 내가 확보하지 못한 기회를 찾는 용도입니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 사이트 깨진 백링크도 점검해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 깨진 백링크는 이미 얻은 링크 자산을 낭비하는 것과 같습니다. 브로큰 백링크 복구 도구로 먼저 내 사이트의 깨진 백링크를 복구한 뒤, 갭 분석으로 신규 소스를 확보하는 순서가 효율적입니다.",
      },
    },
    {
      "@type": "Question",
      name: "전문 백링크 구축 서비스가 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드는 백링크 구축 대행 서비스를 제공합니다. 갭 분석 결과를 바탕으로 고DA 소스에 직접 게스트 포스팅 및 링크 제안을 진행해 드립니다. 문의 페이지에서 상담 요청을 남겨주세요.",
      },
    },
  ],
};

export default function BacklinkGapPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">백링크 갭 분석</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          경쟁사 백링크 기회를 DA 순으로 발굴하는 무료 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          내 도메인과 경쟁사 도메인을 입력하면 경쟁사는 이미 확보했지만 내
          사이트엔 없는 백링크 소스를 Moz DA 기준으로 정렬하여 링크 빌딩
          전략의 우선순위를 잡을 수 있습니다.
        </p>
      </div>

      {/* 3개 정보 카드 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-blue-900">
              백링크 갭이란?
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              경쟁사는 링크를 받고 있지만 내 도메인은 아직 확보하지 못한
              백링크 소스의 집합입니다. 이미 경쟁사에 링크를 준 사이트는
              같은 주제의 내 콘텐츠에도 링크를 줄 가능성이 높아 가장
              검증된 링크 빌딩 타깃이 됩니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-green-900">
              어떻게 활용하나요?
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              분석 결과에서 DA 40 이상 소스를 우선 타깃으로 정하고
              게스트 포스팅 제안, 리소스 페이지 추가 요청, 브로큰 링크
              대체 등 다양한 아웃리치 방법으로 접근합니다. DA 순 정렬로
              ROI가 높은 소스부터 순서대로 공략할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-amber-900">
              분석 지표
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              각 소스 도메인에 대해 Moz DA, Ahrefs DR, Majestic Trust
              Flow를 함께 표시합니다. 세 지표를 교차 확인하면 특정 툴에
              치우친 왜곡 없이 도메인 권위도를 보다 정확하게 평가할 수
              있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HowTo 3단계 */}
      <div className="mb-10">
        <h2 className="mb-4 text-base font-semibold">사용 방법</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "도메인 입력",
              desc: "내 도메인과 분석할 경쟁사 도메인을 각각 입력합니다.",
            },
            {
              step: "2",
              title: "갭 분석 실행",
              desc: "두 도메인의 백링크를 병렬로 조회하고 소스 도메인을 비교합니다.",
            },
            {
              step: "3",
              title: "타깃 리스트 확보",
              desc: "DA 순으로 정렬된 경쟁사 전용 소스를 확인하고 아웃리치 전략을 수립합니다.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-3 rounded-lg border bg-muted/30 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 도구 본체 */}
      <BacklinkGapForm />

      {/* 가이드 article */}
      <article className="tools-prose mt-16 space-y-10 border-t pt-12 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">
            백링크 갭이 왜 가장 빠른 링크 빌딩 전략인가
          </h2>
          <p>
            링크 빌딩에서 가장 어려운 것은 처음 접근할 사이트를 찾는 일입니다.
            수천 개의 사이트 중 어디에 연락해야 할지 모른 채 무작위로 이메일을
            보내면 응답률은 1% 미만으로 떨어집니다. 반면 백링크 갭 분석은 이미
            같은 주제에 링크를 준 사이트만을 타깃으로 하기 때문에, 그 사이트가
            내 콘텐츠에도 관심 있을 가능성이 구조적으로 높습니다.
          </p>
          <p className="mt-3">
            경쟁사가 이미 확보한 소스는 세 가지 의미에서 검증된 타깃입니다.
            첫째, 해당 사이트가 외부 링크를 허용한다는 것이 증명되어 있습니다.
            둘째, 그 주제 영역에 링크를 줄 의향이 있음이 행동으로 확인됩니다.
            셋째, 경쟁사와 내 도메인이 같은 키워드를 타겟으로 한다면 동일
            사이트가 두 곳 모두에 링크를 줄 충분한 이유가 있습니다. 이처럼
            백링크 갭 분석은 아웃리치 리스트를 처음부터 만드는 작업을
            생략하고, 즉시 실행 가능한 타깃 목록을 제공합니다.
          </p>
          <p className="mt-3">
            실무에서는 직접 경쟁사 2~3개를 분석한 결과를 합쳐 중복을 제거한
            마스터 타깃 리스트를 만드는 것이 일반적입니다. 한 경쟁사에만
            링크된 소스보다 두 곳 이상 공통으로 나타나는 소스일수록 그 주제에
            관심이 높은 사이트이므로 우선순위를 높게 설정하는 것이 좋습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">
            백링크 갭 결과를 DA/관련성으로 우선순위 매기기
          </h2>
          <p>
            갭 분석 결과로 수십 개에서 수백 개의 소스 도메인이 나올 수
            있습니다. 모든 소스에 동등한 노력을 쏟으면 리소스가 낭비됩니다.
            우선순위를 정하는 기준은 크게 세 가지입니다.
          </p>
          <p className="mt-3">
            첫 번째는 도메인 권위도입니다. Moz DA 40 이상 소스는 검색엔진이
            신뢰도 높은 도메인으로 평가하므로 같은 노력 대비 링크 효과가
            큽니다. DA 40~69 구간은 적극적인 아웃리치 대상이고, DA 70 이상은
            진입 장벽이 높지만 성공하면 도메인 권위도에 큰 영향을 줍니다.
            DA 20 미만 소스는 아웃리치 우선순위를 낮추고 신규 소스 발굴에
            집중하는 것이 낫습니다.
          </p>
          <p className="mt-3">
            두 번째는 주제 관련성입니다. DA가 50이어도 내 사이트와 주제가
            완전히 다른 도메인에서 받은 링크는 효과가 제한적입니다. 소스
            도메인의 카테고리와 내 콘텐츠의 주제가 겹치는지 실제 사이트를
            열어 확인하는 것이 중요합니다. 이 도구의 &ldquo;열기&rdquo; 버튼을
            활용해 각 소스를 직접 확인하세요.
          </p>
          <p className="mt-3">
            세 번째는 dofollow 비율입니다. nofollow 링크는 검색엔진에 신호를
            전달하지 않습니다. 같은 DA라면 dofollow 링크를 더 많이 제공하는
            소스를 우선합니다. 블로그, 뉴스 사이트, 리소스 페이지는 대체로
            dofollow 비율이 높은 편입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">
            실제로 백링크를 따는 법
          </h2>
          <p>
            타깃 리스트가 준비되었다면 실제 링크를 확보하는 방법을 선택해야
            합니다. 가장 범용적인 방법은 네 가지입니다.
          </p>
          <p className="mt-3">
            게스트 포스팅은 타깃 사이트에 기고문을 제안하는 방식입니다.
            소스 사이트에서 이미 다루는 주제에 맞는 독창적인 글 아이디어를
            제안하면 수락률이 올라갑니다. 단, 기고 목적이 링크 확보임이
            노골적으로 드러나면 거부당하기 쉽습니다. 사이트 독자에게 실질적인
            가치를 주는 콘텐츠 각도로 접근하세요.
          </p>
          <p className="mt-3">
            브로큰 링크 재지정은 타깃 사이트에서 이미 깨진 외부 링크를
            찾아내고, 그 링크가 가리키던 콘텐츠와 유사한 내 콘텐츠로 교체를
            제안하는 방식입니다. 사이트 운영자 입장에서는 깨진 링크를 수정하는
            것이 이익이므로 응답률이 상대적으로 높습니다.
          </p>
          <p className="mt-3">
            리소스 페이지 제안은 특정 주제의 유용한 링크를 모아둔 페이지에
            내 콘텐츠를 추가해달라고 요청하는 방식입니다.
            &ldquo;best resources [주제]&rdquo; 또는 &ldquo;useful links
            [주제]&rdquo;로 검색해 적합한 리소스 페이지를 발굴하세요.
            마지막으로 HARO(Help a Reporter Out)나 국내 전문가 인터뷰 플랫폼을
            통해 언론 및 뉴스 사이트에서 자연스럽게 인용 링크를 확보하는
            방법도 고려할 만합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-foreground">
            링크 빌딩 시 주의사항
          </h2>
          <p>
            링크 빌딩은 SEO에서 강력한 효과를 내지만, 잘못된 방식은 Google
            페널티로 이어질 수 있습니다. 반드시 피해야 할 패턴이 있습니다.
          </p>
          <p className="mt-3">
            과도한 앵커 텍스트 반복은 가장 흔한 실수입니다. 모든 링크의 앵커
            텍스트가 완전히 동일한 키워드로 통일되면 구글이 인위적인 링크
            조작으로 판단합니다. 브랜드명, URL, 자연어 문장 등 다양한 앵커
            텍스트를 섞어 자연스러운 링크 프로필을 유지해야 합니다.
          </p>
          <p className="mt-3">
            스팸 소스는 즉시 제외하세요. DA가 낮고 외국어 카지노, 도박,
            의약품 키워드가 섞인 사이트에서 받은 링크는 독이 됩니다.
            Google Search Console에서 해당 링크를 발견하면 Disavow 파일로
            거부 처리하는 것이 좋습니다.
          </p>
          <p className="mt-3">
            자연스러운 증가율도 중요합니다. 단기간에 수백 개의 링크가 폭발적으로
            증가하면 구글 알고리즘의 이상 탐지 시스템에 걸릴 수 있습니다.
            월 10~30개 수준의 꾸준한 링크 획득이 장기적으로 안전하고 효과적인
            전략입니다. 백링크 갭 분석으로 발굴한 타깃도 단계적으로 아웃리치하여
            자연스러운 성장 패턴을 유지하세요.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <div className="mt-12 border-t pt-10">
        <h2 className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              백링크 갭 분석은 몇 명의 경쟁사로 하는 게 좋나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              2~3개가 적당합니다. 경쟁사가 많아질수록 공통 소스가 줄어들어
              타깃 리스트가 희석됩니다. 검색 의도가 가장 유사한 직접 경쟁사
              2개를 먼저 분석하고 이후 추가하는 방식을 권장합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              DA가 낮은 백링크도 쓸모 있나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              DA 10 미만은 효과가 거의 없고 스팸 위험이 있습니다. DA 20~39
              구간이라도 주제 관련성이 높고 실제 트래픽이 있는 사이트라면
              링크 가치는 충분합니다. DA 단독보다 관련성과 트래픽을 함께
              고려하세요.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              경쟁사가 없는 주제는 어떻게 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              직접 경쟁사가 없다면 같은 카테고리의 해외 사이트나 유사 주제
              블로그를 경쟁사로 입력해 보세요. 그 사이트들이 백링크를 받는
              소스가 내 콘텐츠에도 관심 있을 가능성이 높습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              공통 백링크 분석과 백링크 갭 분석의 차이는 무엇인가요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <a
                href="/tools/common-backlinks"
                className="text-primary hover:underline"
              >
                공통 백링크 분석
              </a>
              은 두 도메인이 모두 가진 소스를 확인하는 용도입니다. 백링크
              갭 분석은 경쟁사만 가진 소스, 즉 아직 내가 확보하지 못한
              기회를 찾는 용도입니다. 목적이 반대이므로 병행 활용을
              권장합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              내 사이트 깨진 백링크도 점검해야 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              네, 깨진 백링크는 이미 얻은 링크 자산을 낭비하는 것과
              같습니다.{" "}
              <a
                href="/tools/broken-backlink-recovery"
                className="text-primary hover:underline"
              >
                브로큰 백링크 복구 도구
              </a>
              로 먼저 내 사이트 깨진 백링크를 복구한 뒤, 갭 분석으로
              신규 소스를 확보하는 순서가 효율적입니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              전문 백링크 구축 서비스가 있나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              SEO월드는 백링크 구축 대행 서비스를 제공합니다. 갭 분석
              결과를 바탕으로 고DA 소스에 직접 게스트 포스팅 및 링크 제안을
              진행해 드립니다.{" "}
              <a href="/contact" className="text-primary hover:underline">
                문의 페이지
              </a>
              에서 상담 요청을 남겨주세요.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="mt-12 border-t pt-10">
        <RelatedTools currentTool="backlink-gap" />
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-primary/10 bg-primary/5 p-8 text-center">
        <h2 className="text-lg font-bold">
          백링크 갭 분석 결과를 직접 실행으로 연결하고 싶으신가요?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          SEO월드 전문가가 갭 분석 결과를 검토하고 실제 아웃리치까지
          대행합니다.
        </p>
        <a
          href="/contact"
          className="mt-5 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          백링크 구축 무료 상담
        </a>
      </div>
    </div>
  );
}
