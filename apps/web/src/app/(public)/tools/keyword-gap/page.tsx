import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordGapForm } from "./keyword-gap-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "키워드 갭 분석 — 경쟁사 상위 키워드 무료 비교 도구 | SEO월드",
  description:
    "내 도메인과 경쟁사를 비교해 내가 놓친 키워드를 찾아보세요. 경쟁사는 상위 10위에 있지만 내 사이트는 없는 키워드를 검색량·난이도와 함께 제시합니다.",
  openGraph: {
    title: "키워드 갭 분석 | SEO월드",
    description:
      "경쟁사 상위 키워드 중 내가 놓친 키워드를 한눈에 확인하세요. 무료 키워드 인텔리전스 도구.",
  },
  alternates: { canonical: "/tools/keyword-gap" },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "키워드 갭 분석기",
  url: "https://seoworld.co.kr/tools/keyword-gap",
  description:
    "내 도메인과 경쟁사 도메인을 비교하여 경쟁사 상위 키워드 중 내가 놓친 키워드를 검색량·난이도와 함께 제시하는 무료 키워드 갭 분석 도구입니다.",
  applicationCategory: "SEOApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "키워드 갭 분석 사용법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "내 도메인과 비교할 경쟁사 도메인을 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "시드 키워드 설정 (선택)",
      text: "분석 범위를 좁힐 시드 키워드를 입력합니다. 비워두면 경쟁사에서 자동 추출합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "갭 키워드 확인",
      text: "경쟁사만 상위 노출된 키워드를 검색량·순위 데이터와 함께 확인하고 CSV로 내보냅니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "키워드 갭과 콘텐츠 갭의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "키워드 갭은 경쟁사가 특정 키워드에서 상위 노출되지만 내 사이트는 노출되지 않는 키워드 단위 차이를 분석합니다. 콘텐츠 갭은 경쟁사가 다루는 주제나 토픽 중 내 사이트에 없는 콘텐츠 주제 단위 차이를 분석합니다. 키워드 갭이 더 세밀하고 즉시 실행 가능한 타깃 리스트를 제공하며, 콘텐츠 갭은 전략적 콘텐츠 기획에 적합합니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사를 몇 개까지 입력해야 정확한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2~3개가 가장 효과적입니다. 너무 많으면 분석 범위가 방대해져 실행 가능한 키워드보다 노이즈가 많아집니다. 내 사이트와 규모가 비슷하거나 1~2단계 위의 직접 경쟁사를 선택하는 것이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 도메인이 작아도 키워드 갭 분석이 의미 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "오히려 신규 또는 소규모 도메인일수록 갭 분석이 더 유용합니다. 처음부터 타겟을 잡지 못한 키워드를 빠르게 발굴해 콘텐츠 우선순위를 정할 수 있고, 무작정 콘텐츠를 만드는 것보다 경쟁사가 이미 검증한 키워드를 공략하는 편이 리소스 대비 효과가 높습니다.",
      },
    },
    {
      "@type": "Question",
      name: "검색량과 난이도 데이터는 어디서 오나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SERP 실시간 조회 결과와 공개 키워드 데이터 소스를 조합하여 제공합니다. 검색량은 추정치이며, 실제 광고 집행 데이터와 차이가 있을 수 있습니다. 절대적 수치보다 키워드 간 상대적 우선순위 파악 용도로 활용하는 것이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "도메인 권위 차이가 큰 경쟁사와 비교해도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "가능하지만, 대형 도메인의 갭 키워드는 경쟁 난이도가 높아 단기 성과를 내기 어렵습니다. 도메인 권위가 비슷한 경쟁사와 비교하는 편이 실행 가능한 quick win을 더 많이 찾을 수 있습니다. 도메인 권위 비교가 필요하다면 도메인 비교기 도구를 함께 활용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "키워드 갭 분석 결과로 무엇부터 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "먼저 경쟁사만 노출된 키워드 탭에서 검색량이 높고 경쟁사 순위가 1~5위인 키워드를 추립니다. 그 중 내 사이트 콘텐츠와 주제가 겹치는 것을 우선 타깃으로 삼아 기존 페이지를 업데이트하거나 새 콘텐츠를 작성합니다.",
      },
    },
  ],
};

export default function KeywordGapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
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
        <h1 className="text-3xl font-bold">키워드 갭 분석</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          경쟁사 상위 키워드 중 내가 놓친 키워드 인텔리전스
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          내 도메인과 경쟁사 도메인을 비교해 경쟁사는 상위 10위 내에 있지만
          내 사이트에는 없는 키워드를 검색량·순위와 함께 제시합니다.
        </p>
      </div>

      {/* 3 Info Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              경쟁사가 검증한 키워드
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              이미 경쟁사가 상위에 올려놓은 키워드는 검색 수요가 실재함이
              증명된 것입니다. 검색량 데이터와 함께 확인해 콘텐츠 우선순위를
              빠르게 결정하세요.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">
              4가지 그룹 분류
            </h2>
            <p className="text-xs leading-relaxed text-emerald-800/80">
              경쟁사만 노출, 공통 노출, 나만 노출, 둘 다 미노출 — 4가지
              그룹으로 분리해 공략 타깃과 기존 자산을 한눈에 파악합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">
              CSV 내보내기 지원
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              키워드·월 검색량·순위 데이터를 CSV로 즉시 내려받아 스프레드시트
              콘텐츠 계획표에 바로 붙여 넣을 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HowTo 3단계 */}
      <div className="mb-10">
        <h2 className="text-base font-semibold mb-4">키워드 갭 분석 사용법</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "도메인 2개 입력",
              desc: "내 도메인과 비교할 경쟁사 도메인을 각각 입력합니다.",
            },
            {
              step: "2",
              title: "시드 키워드 설정 (선택)",
              desc: "분석 범위를 좁힐 키워드를 입력하거나 비워두면 자동 추출합니다.",
            },
            {
              step: "3",
              title: "갭 키워드 확인 및 내보내기",
              desc: "경쟁사만 상위 노출된 키워드를 검색량·순위와 함께 확인하고 CSV로 저장합니다.",
            },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex gap-3 rounded-lg border bg-muted/30 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {step}
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Form */}
      <KeywordGapForm />

      {/* Guide Article */}
      <article className="tools-prose mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-3">키워드 갭 분석의 전략적 가치</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          키워드 갭 분석은 콘텐츠 기획에서 가장 효율적인 시작점 중 하나입니다.
          처음부터 새로운 키워드를 발굴하는 것도 중요하지만, 경쟁사가 이미 상위에
          올려놓은 키워드는 검색 수요가 실재한다는 것이 검증된 상태입니다. 즉, 시장이
          존재하는 키워드 목록을 경쟁사가 대신 검증해준 셈입니다.
          갭 분석을 통해 얻은 키워드 리스트는 콘텐츠 팀이 무엇을 먼저 써야 할지
          빠르게 결정하게 해줍니다. 검색량이 높고 경쟁사 순위가 1~5위에 있지만 내
          사이트에 관련 콘텐츠가 없다면, 그것은 즉시 채워야 할 공백입니다.
          반대로 비슷한 주제의 글이 있지만 해당 키워드가 포함되지 않았다면
          기존 페이지를 업데이트하는 것만으로 빠른 성과를 기대할 수 있습니다.
          이처럼 키워드 갭 분석은 신규 콘텐츠 발행과 기존 콘텐츠 보강 두 방향 모두에서
          콘텐츠 우선순위를 명확하게 만들어주는 전략적 도구입니다.
        </p>

        <h2 className="text-xl font-bold mb-3">키워드 갭 결과 해석하는 법</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          키워드 갭 분석 결과를 받으면 경쟁사만 상위 노출된 키워드 탭부터 살펴보세요.
          여기서 가장 중요한 것은 검색량과 경쟁사 순위를 함께 보는 것입니다.
          검색량이 높을수록 해당 키워드에서 트래픽 잠재력이 크고,
          경쟁사 순위가 낮을수록(1~3위) 그 키워드가 얼마나 중요한지 알 수 있습니다.
          이 두 값을 조합한 매트릭스로 키워드를 4사분면으로 나눌 수 있습니다.
          검색량 높음 + 경쟁사 순위 낮음(상위) 조합이 최우선 공략 대상이며,
          검색량은 낮지만 경쟁 난이도가 낮은 키워드는 quick win 후보입니다.
          검색량이 높고 경쟁사 순위도 높다면(10위에 가깝다면) 경쟁사도 아직 충분히
          최적화하지 못한 키워드일 가능성이 있어 진입 기회가 열려 있습니다.
          무조건 검색량 순으로만 공략하지 말고, 내 사이트의 현재 도메인 권위와
          기존 콘텐츠 자산을 감안해 실행 가능한 키워드부터 선별하는 것이 현명합니다.
        </p>

        <h2 className="text-xl font-bold mb-3">갭 키워드를 콘텐츠로 전환하는 4단계</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          갭 키워드 리스트를 확보했다면 바로 글을 쓰기 전에 4단계 프로세스를 거치는 것이 좋습니다.
          첫째, 키워드 클러스터링입니다. 비슷한 주제를 가진 키워드를 하나의 그룹으로 묶어
          한 페이지에서 여러 관련 키워드를 동시에 타깃할 수 있게 합니다.
          둘째, 검색 의도 분류입니다. 정보형(informational), 탐색형(navigational),
          거래형(transactional)으로 키워드 의도를 나누면 어떤 형태의 콘텐츠를 만들어야 할지
          방향이 잡힙니다. 셋째, 글 구조 설계입니다. 경쟁 상위 페이지의 구조를 참고해
          H2 항목과 다룰 소주제를 미리 설계합니다. 검색 의도에 맞는 구조가
          SEO 성과에 직결됩니다. 넷째, 발행 및 내부 링크 연결입니다. 글을 발행한 뒤
          관련 기존 페이지에서 새 글로 내부 링크를 추가해 구글이 새 페이지를 빠르게
          크롤링하고 권위를 전달받을 수 있도록 합니다.
        </p>

        <h2 className="text-xl font-bold mb-3">피해야 할 실수</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          키워드 갭 분석에서 흔히 저지르는 첫 번째 실수는 도메인 권위가 압도적으로 큰
          경쟁사를 선택하는 것입니다. 대형 도메인의 갭 키워드는 단기에 공략하기 어렵고,
          결과 목록이 방대해져 실행 가능성이 낮아집니다. 내 사이트와 규모가 비슷한
          경쟁사와 비교해야 실질적인 공략 목록이 나옵니다.
          두 번째 실수는 갭 키워드 전부를 한꺼번에 공략하려 드는 것입니다.
          100개의 키워드를 발견했다고 해서 100개의 글을 동시에 작성하면
          각 콘텐츠의 품질이 낮아지고 집중도도 분산됩니다. 월 3~5개의 우선순위 키워드에
          집중하는 것이 장기적으로 훨씬 효과적입니다.
          세 번째 실수는 검색 의도를 무시하고 키워드만 넣는 것입니다.
          사용자가 특정 키워드로 무엇을 원하는지 파악하지 않으면, 키워드가 포함된 글을
          발행해도 이탈률이 높아 검색 순위가 오르지 않습니다.
          키워드를 채우는 것이 아니라 검색 의도에 맞는 답을 제공하는 것이 핵심입니다.
        </p>
      </article>

      {/* FAQ */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">
              키워드 갭과 콘텐츠 갭의 차이는?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              키워드 갭은 특정 키워드 단위로 경쟁사 SERP 노출 여부를 비교합니다.
              콘텐츠 갭은 경쟁사가 다루는 주제·토픽 단위의 차이를 분석합니다.
              키워드 갭이 더 즉시 실행 가능한 타깃 리스트를 제공하며,
              주제 단위 기획이 필요하다면{" "}
              <Link href="/tools/content-gap" className="underline underline-offset-2 hover:text-foreground">
                콘텐츠 갭 분석
              </Link>
              을 함께 활용하세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              경쟁사를 몇 개까지 입력해야 정확한가요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              2~3개가 가장 효과적입니다. 너무 많으면 분석 범위가 방대해져
              실행 가능한 키워드보다 노이즈가 많아집니다. 내 사이트와 규모가
              비슷하거나 1~2단계 위의 직접 경쟁사를 선택하는 것이 좋습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              내 도메인이 작아도 분석이 의미 있나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              오히려 신규·소규모 도메인일수록 갭 분석이 더 유용합니다.
              타겟을 잡지 못한 키워드를 빠르게 발굴해 콘텐츠 우선순위를 정할 수 있고,
              경쟁사가 이미 검증한 키워드를 공략하는 편이 리소스 대비 효과가 높습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              검색량·난이도 데이터는 어디서 오나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SERP 실시간 조회 결과와 공개 키워드 데이터 소스를 조합하여 제공합니다.
              검색량은 추정치이며 절대적 수치보다 키워드 간 상대적 우선순위 파악
              용도로 활용하는 것이 좋습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              도메인 권위 차이가 큰 경쟁사와 비교해도 되나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              가능하지만 대형 도메인의 갭 키워드는 경쟁 난이도가 높아 단기 성과를
              내기 어렵습니다. 도메인 권위가 비슷한 경쟁사와 비교하는 편이
              quick win을 더 많이 찾을 수 있습니다. 권위 비교가 필요하다면{" "}
              <Link href="/tools/domain-compare" className="underline underline-offset-2 hover:text-foreground">
                도메인 비교기
              </Link>
              를 활용하세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              분석 결과로 무엇부터 해야 하나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              경쟁사만 노출 탭에서 검색량이 높고 경쟁사 순위 1~5위인 키워드를 추립니다.
              내 사이트와 주제가 겹치는 것은 기존 페이지 업데이트로,
              없는 주제는 새 콘텐츠로 공략하는 것이 가장 빠른 방법입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <div className="mt-12">
        <RelatedTools currentTool="keyword-gap" />
      </div>

      {/* CTA */}
      <section className="mt-12 rounded-xl border bg-muted/40 px-6 py-10 text-center">
        <h2 className="text-xl font-bold">직접 SEO 전략을 만들기 어렵다면</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          키워드 갭 분석 결과를 바탕으로 콘텐츠 전략부터 백링크 구축까지
          SEO 전문가가 직접 도와드립니다.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          무료 상담 신청
        </Link>
      </section>
    </div>
  );
}
