import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RelatedTools } from "@/components/related-tools";
import { SerpCheckerForm } from "./serp-checker-form";

export const metadata: Metadata = {
  title: "SERP 순위 체커 — 무료 구글 키워드 순위 확인 도구",
  description:
    "키워드를 입력하면 구글 검색(KR) 상위 20개 결과를 순위·도메인·타이틀과 함께 즉시 확인. 내 도메인 순위 하이라이트 기능 포함. 무료 SERP 체커로 키워드 순위를 지금 바로 점검하세요.",
  keywords: [
    "구글 SERP 체커",
    "키워드 순위 확인",
    "SERP 순위 추적",
    "구글 검색 결과 순위",
    "키워드 순위 체크",
  ],
  openGraph: {
    title: "SERP 순위 체커 — 무료 구글 키워드 순위 확인 도구",
    description:
      "키워드를 입력하면 구글 검색(KR) 상위 20개 결과를 순위·도메인·타이틀과 함께 즉시 확인. 무료 SERP 체커로 키워드 순위를 지금 바로 점검하세요.",
    type: "website",
  },
  alternates: { canonical: "/tools/serp-checker" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SERP 순위 체커",
  url: "https://seoworld.co.kr/tools/serp-checker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "All",
  description:
    "키워드를 입력하면 구글 검색(KR) 상위 20개 결과를 순위·도메인·타이틀·URL과 함께 표시하는 무료 SERP 순위 확인 도구입니다.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  provider: { "@type": "Organization", name: "SEO월드", url: "https://seoworld.co.kr" },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "3단계로 키워드 순위 확인하기",
  description: "SERP 순위 체커로 구글 키워드 순위를 무료로 확인하는 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "키워드 입력",
      text: "조회하고 싶은 키워드를 입력란에 작성합니다. 단일 키워드 또는 구문 모두 가능합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "내 도메인 입력 (선택)",
      text: "본인 웹사이트 도메인을 입력하면 상위 20개 결과 중 내 사이트 순위를 자동 하이라이트로 표시해줍니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "결과 분석",
      text: "구글 KR/ko 기준 상위 20개 결과를 순위·도메인·페이지 제목·URL과 함께 확인하고 경쟁 구도를 파악합니다.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "SERP 순위가 왜 중요한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글 검색 1위 페이지의 평균 클릭률(CTR)은 약 27%에 달합니다. 반면 2페이지(11위 이하)는 1% 미만으로 떨어집니다. 상위 1~3위와 그 이하는 트래픽 격차가 수십 배에 이릅니다. 내 페이지가 어느 순위에 있는지 파악해야 개선 우선순위를 정할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "순위가 매일 바뀌는 이유는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글은 알고리즘을 지속적으로 업데이트하고, 경쟁 페이지들도 콘텐츠·백링크를 꾸준히 보강합니다. 또한 검색자의 위치·디바이스·개인화 설정에 따라 동일 키워드도 다른 결과가 나타날 수 있습니다. 이 도구는 한국(KR/ko) 비개인화 결과를 기준으로 조회합니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 도메인이 상위 20위에 없으면 어떻게 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "상위 20위 밖이라면 먼저 온페이지 SEO(제목 태그, 메타 설명, 본문 키워드 밀도)를 점검하세요. 다음으로 내부 링크 구조와 페이지 로딩 속도를 개선하고, 타겟 키워드 경쟁강도를 재평가해 더 구체적인 롱테일 키워드로 전환하는 전략을 검토하세요.",
      },
    },
    {
      "@type": "Question",
      name: "모바일과 PC 순위가 다른 이유는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글은 모바일 퍼스트 인덱싱을 적용하며, 모바일 페이지 속도·반응형 디자인·모바일 사용성을 별도로 평가합니다. 모바일 최적화가 미흡한 사이트는 PC와 모바일 순위가 최대 수십 계단 차이 날 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "지역이나 언어를 바꿔서 순위를 확인할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "현재 이 도구는 구글 KR/한국어 기준으로 조회합니다. 지역별 SERP 확인이 필요하다면 로컬 SERP 체커(/tools/local-serp)를 이용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "장기적으로 순위 추적은 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "단발성 조회 외에 지속적인 순위 추적이 필요하다면 SEO월드 대시보드(/dashboard/seo)에서 키워드별 순위 히스토리와 주간 변동 추이를 관리하세요. 주 1회 이상 정기 점검을 권장합니다.",
      },
    },
  ],
};

export default function SerpCheckerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          SERP 순위 체커 &mdash; 구글 키워드 순위 무료 확인
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          키워드 하나만 입력하면 구글 검색(KR) 상위 20개 결과를 즉시 조회
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          &ldquo;내 페이지가 구글에서 몇 위인지&rdquo; 궁금하신가요? 이 도구는 키워드를
          입력하는 것만으로 구글 한국 검색 결과 상위 20개를 순위 &middot; 도메인 &middot;
          페이지 제목 &middot; URL과 함께 보여줍니다. 도메인을 함께 입력하면 내 사이트가
          몇 위에 위치하는지도 하이라이트로 확인할 수 있습니다.
        </p>
      </div>

      {/* 2. 인포 카드 3열 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-blue-900">
              SERP 순위란? 📊
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              SERP(Search Engine Results Page)는 특정 키워드로 검색했을 때 나타나는
              검색엔진 결과 페이지를 의미합니다. &ldquo;순위&rdquo;는 내 페이지가 해당
              결과 페이지에서 몇 번째 위치에 노출되는지를 나타내며, SEO 성과를 측정하는
              가장 직접적인 지표입니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-green-900">
              왜 순위 확인이 중요한가요? 🎯
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              구글 1위 페이지 클릭률은 평균 27%, 3위는 11%, 10위는 2% 수준입니다.
              2페이지 이하는 1% 미만으로 사실상 트래픽이 발생하지 않습니다. 현재 순위를
              파악해야 콘텐츠 개선 우선순위와 SEO 전략을 올바르게 수립할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-100 bg-amber-50/50">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-amber-900">
              이 도구의 이점
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              회원가입 없이 무료로 구글 KR &middot; ko 기준 상위 20개 SERP를 실시간
              조회합니다. 내 도메인 입력 시 순위 자동 하이라이트, 경쟁사 도메인 파악,
              페이지 제목 분석까지 한 화면에서 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. HowTo */}
      <div className="mb-10">
        <h2 className="mb-6 text-xl font-bold">3단계로 키워드 순위 확인하기</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200">
            <CardContent className="pb-5 pt-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                1
              </div>
              <h3 className="mb-1 text-sm font-semibold">키워드 입력</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                조회할 키워드를 입력합니다. 단일 단어나 구문(예: &ldquo;서울 인테리어
                업체&rdquo;) 모두 지원합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pb-5 pt-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                2
              </div>
              <h3 className="mb-1 text-sm font-semibold">도메인 입력 (선택)</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                본인 사이트 도메인을 입력하면 상위 20개 결과 중 내 페이지 순위를 자동으로
                하이라이트합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pb-5 pt-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                3
              </div>
              <h3 className="mb-1 text-sm font-semibold">결과 분석</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                순위 &middot; 도메인 &middot; 페이지 제목 &middot; URL을 한눈에 확인하고
                경쟁 구도를 파악하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. 도구 본체 */}
      <SerpCheckerForm />

      {/* 5. 상세 가이드 */}
      <article className="tools-prose mt-16 border-t pt-12">
        <h2 className="mb-3 text-xl font-bold">
          구글 SERP 순위가 트래픽에 미치는 영향
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          SEO 업계에서 자주 인용되는 Backlinko &middot; Sistrix 연구에 따르면, 구글 검색
          1위 결과의 평균 클릭률(CTR)은 약 27.6%입니다. 2위는 15.8%, 3위는 11%,
          4~5위는 각각 8% &middot; 7.4%로 급격히 하락합니다. 10위(1페이지 마지막)는
          약 2.4%이며, 11위(2페이지 첫 번째)부터는 1% 미만으로 떨어집니다. 즉, 1위와
          11위의 클릭률 차이는 30배가 넘습니다.
          <br /><br />
          월간 검색량이 1,000회인 키워드를 예로 들면, 1위 노출 시 월 276회 방문을
          기대할 수 있지만 11위에서는 고작 10회 미만입니다. 동일한 키워드임에도 트래픽
          격차가 수십 배에 달하기 때문에 현재 내 페이지가 어느 순위에 있는지 파악하는
          것이 모든 SEO 작업의 출발점입니다. 또한 순위는 단발성 확인보다 주기적인 추적이
          중요합니다. 알고리즘 업데이트, 경쟁사의 콘텐츠 강화, 계절성 변동 등 다양한
          요인으로 순위가 수시로 바뀌기 때문입니다.
        </p>

        <h2 className="mb-3 text-xl font-bold">SERP 체커 결과 이렇게 해석하세요</h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          상위 3위 이내라면 해당 키워드에서 경쟁 우위를 확보한 상태입니다. CTR이 높은
          구간이므로 제목 태그와 메타 설명을 클릭 유도형으로 지속 최적화하여 유입을
          극대화하세요. 4~10위(1페이지 중하단)는 &ldquo;기회 구간&rdquo;입니다. 콘텐츠
          품질 보강, 내부 링크 강화, E-E-A-T 신호(저자 정보, 출처 명시) 개선으로 상위권
          진입이 충분히 가능합니다.
          <br /><br />
          11~20위(2페이지)는 검색자에게 사실상 노출되지 않는 구간입니다. 키워드 경쟁강도를
          재평가하고, 더 구체적인 롱테일 키워드(예: &ldquo;서울 강남 인테리어 업체
          추천&rdquo;)로 방향을 전환하거나 기존 페이지의 콘텐츠 깊이를 대폭 강화해야
          합니다. 상위 20위에 아예 보이지 않는다면 해당 키워드에 대한 콘텐츠가 없거나
          Google이 아직 색인하지 않은 경우입니다. Google Search Console의 URL 검사
          도구로 색인 상태를 먼저 확인하세요.
        </p>

        <h2 className="mb-3 text-xl font-bold">순위가 낮을 때 어떤 행동을 해야 할까</h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          첫 번째 단계는 온페이지 점검입니다. 타겟 키워드가 title 태그, H1, 본문 첫 단락에
          자연스럽게 포함되어 있는지 확인하세요. 키워드 밀도는 전체 본문의 1~2% 수준이
          적절하며, 과도한 키워드 반복은 스팸으로 처리될 수 있습니다. 페이지 로딩 속도
          (Core Web Vitals)도 순위에 직접 영향을 미치므로 PageSpeed Insights로 점검하세요.
          <br /><br />
          두 번째 단계는 키워드 재설정입니다. 경쟁이 치열한 단일 키워드 대신, 검색 의도가
          명확한 롱테일 키워드를 발굴하세요. &ldquo;인테리어&rdquo; 대신 &ldquo;20평
          아파트 거실 인테리어 비용&rdquo;처럼 구체적인 쿼리를 타겟하면 경쟁이 낮으면서
          전환율 높은 트래픽을 확보할 수 있습니다.
          <br /><br />
          세 번째 단계는 백링크 보강입니다. 도메인 권위(DA)는 외부 링크의 양과 질에 크게
          좌우됩니다. 업계 미디어 기고, 협력사 링크 교환, 디렉토리 등록 등 다양한 경로로
          고품질 외부 링크를 확보하면 장기적으로 순위 상승에 효과적입니다.
        </p>

        <h2 className="mb-3 text-xl font-bold">SERP 순위 추적 베스트 프랙티스</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          효과적인 순위 추적을 위해서는 몇 가지 원칙을 지키는 것이 중요합니다. 첫째, 주 1회
          정기 점검을 습관화하세요. 매일 조회하면 일시적 변동에 과민 반응하게 되고, 월 1회는
          너무 늦게 문제를 감지합니다. 주 1회 점검이 가장 합리적인 주기입니다.
          <br /><br />
          둘째, 핵심 키워드 10~20개를 집중 추적하세요. 수백 개 키워드를 모두 추적하기보다
          비즈니스 목표와 직결된 핵심 키워드를 선별하여 집중 관리하는 것이 효율적입니다.
          브랜드 키워드, 서비스 핵심 키워드, 전환율 높은 롱테일 키워드를 균형 있게 포함하세요.
          <br /><br />
          셋째, 경쟁사 순위도 함께 추적하세요. 내 순위만 보는 것보다 경쟁사 도메인의 변동을
          함께 모니터링하면 업계 동향과 알고리즘 업데이트의 영향을 훨씬 빠르게 파악할 수
          있습니다. 이 도구의 상위 20개 결과에서 동일 경쟁 도메인이 반복해서 등장한다면
          해당 도메인의 콘텐츠 전략을 분석하는 것이 순위 개선의 단서가 될 수 있습니다.
        </p>
      </article>

      {/* 6. FAQ */}
      <div className="mt-12 border-t pt-12">
        <h2 className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              SERP 순위가 왜 중요한가요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              구글 검색 1위 페이지의 평균 클릭률(CTR)은 약 27%에 달합니다. 반면
              2페이지(11위 이하)는 1% 미만으로 떨어집니다. 상위 1~3위와 그 이하는 트래픽
              격차가 수십 배에 이릅니다. 내 페이지가 어느 순위에 있는지 파악해야 개선
              우선순위를 정할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              순위가 매일 바뀌는 이유는 무엇인가요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              구글은 알고리즘을 지속적으로 업데이트하고, 경쟁 페이지들도 콘텐츠 &middot;
              백링크를 꾸준히 보강합니다. 검색자의 위치 &middot; 디바이스 &middot; 개인화
              설정에 따라 동일 키워드도 다른 결과가 나타날 수 있습니다. 이 도구는
              한국(KR/ko) 비개인화 결과를 기준으로 조회합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              내 도메인이 상위 20위에 없으면 어떻게 해야 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              먼저 온페이지 SEO(제목 태그, 메타 설명, 본문 키워드 밀도)를 점검하세요.
              다음으로 내부 링크 구조와 페이지 로딩 속도를 개선하고, 타겟 키워드 경쟁강도를
              재평가해 더 구체적인 롱테일 키워드로 전환하는 전략을 검토하세요.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              모바일과 PC 순위가 다른 이유는 무엇인가요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              구글은 모바일 퍼스트 인덱싱을 적용하며, 모바일 페이지 속도 &middot; 반응형
              디자인 &middot; 모바일 사용성을 별도로 평가합니다. 모바일 최적화가 미흡한
              사이트는 PC와 모바일 순위가 수십 계단 차이 날 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              지역이나 언어를 바꿔서 순위를 확인할 수 있나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              현재 이 도구는 구글 KR &middot; 한국어 기준으로 조회합니다. 지역별 SERP
              확인이 필요하다면{" "}
              <Link
                href="/tools/local-serp"
                className="underline underline-offset-2 hover:text-foreground"
              >
                로컬 SERP 체커
              </Link>
              를 이용하세요.
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">
              장기적으로 순위 추적은 어떻게 하나요?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              단발성 조회 외에 지속적인 순위 추적이 필요하다면{" "}
              <Link
                href="/dashboard/seo"
                className="underline underline-offset-2 hover:text-foreground"
              >
                SEO월드 대시보드
              </Link>
              에서 키워드별 순위 히스토리와 주간 변동 추이를 관리하세요. 주 1회 이상
              정기 점검을 권장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 7. 관련 툴 */}
      <div className="mt-12 border-t pt-12">
        <h2 className="mb-6 text-xl font-bold">함께 쓰면 좋은 도구</h2>
        <RelatedTools currentTool="serp-checker" />
      </div>

      {/* 8. 하단 CTA */}
      <div className="mt-12 border-t pt-12">
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-8 text-center">
            <h2 className="mb-2 text-xl font-bold">
              SEO 전문가의 도움이 필요하신가요?
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              키워드 순위 개선 컨설팅, 콘텐츠 전략 수립, 고품질 백링크 구축까지
              SEO월드 전문팀이 도와드립니다. 무료 상담을 통해 현재 순위 현황을
              진단받고 맞춤 전략을 확인해보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/contact">서비스 문의하기</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tools">다른 무료 도구 보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
