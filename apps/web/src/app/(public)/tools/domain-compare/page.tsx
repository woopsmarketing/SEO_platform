import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { DomainCompareForm } from "./domain-compare-form";

export const metadata: Metadata = {
  title: "도메인 비교기 — DA·DR·TF·CF 5축 레이더 차트 무료 비교",
  description:
    "두 도메인의 Moz DA, Ahrefs DR, Majestic TF·CF, 백링크 수를 나란히 비교하세요. 5축 레이더 차트로 경쟁사 도메인 권위를 한눈에 파악합니다.",
  openGraph: {
    title: "도메인 비교기 | SEO월드",
    description:
      "DA DR TF 비교 + 레이더 차트로 두 도메인 SEO 권위를 무료로 시각화합니다.",
  },
  alternates: { canonical: "/tools/domain-compare" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "도메인 비교기 — DA·DR·TF·CF 5축 레이더 차트",
  description:
    "두 도메인의 DA, DR, TF, CF, 백링크 수를 5축 레이더 차트로 시각 비교하는 무료 SEO 도구",
  url: "https://seoworld.co.kr/tools/domain-compare",
  inLanguage: "ko",
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "도메인 비교기",
  applicationCategory: "WebApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "Moz DA, Ahrefs DR, Majestic TF·CF, 참조도메인, 백링크 수를 레이더 차트로 비교하는 무료 도메인 SEO 비교 도구",
  url: "https://seoworld.co.kr/tools/domain-compare",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "도메인 비교기 사용 방법 — 3단계",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "두 도메인 입력",
      text: "비교할 두 도메인을 각각 입력란에 입력합니다. (예: naver.com / daum.net)",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "비교 실행",
      text: "'두 도메인 비교' 버튼을 누르면 DA·DR·TF·CF·백링크 수를 동시에 조회합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "레이더 차트 해석",
      text: "5축 레이더 차트와 상세 비교표로 강점·약점 축을 파악하고 전략에 반영합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "도메인 권위 지표 중 가장 중요한 건?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "단일 지표보다 복합적 해석이 중요합니다. Moz DA는 검색순위 예측력, Ahrefs DR은 백링크 강도, Majestic TF는 신뢰도를 각각 반영합니다. 레이더 차트에서 세 지표가 모두 높은 도메인이 실질적으로 강한 경쟁자입니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 도메인과 경쟁사 격차가 크면 따라잡을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DA 20 이상 격차도 6~18개월 꾸준한 백링크 확보와 콘텐츠 전략으로 좁힐 수 있습니다. 레이더 차트에서 격차가 작은 축부터 집중 공략해 점진적으로 전체 차트를 키워가는 방법이 효율적입니다.",
      },
    },
    {
      "@type": "Question",
      name: "백링크 수가 많다고 권위가 높은 건가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아닙니다. 스팸성 저품질 백링크가 많으면 오히려 Majestic TF가 낮게 나옵니다. TF:CF 비율이 0.5 이상이면 건강한 링크 프로필로 볼 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "3개 이상 도메인 비교는 안 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "현재 도구는 두 도메인 1:1 비교를 지원합니다. 여러 경쟁사를 한꺼번에 분석하려면 /tools/competitor-discovery 또는 /tools/common-backlinks에서 공통 백링크 기준으로 비교하는 방법을 활용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "한 도메인을 더 자세히 보고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "/tools/domain-authority 에서 단일 도메인의 DA, DR, TF, 참조도메인, 유기 키워드 수 등을 상세 조회할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "경쟁사가 더 많은 백링크를 어디서 얻고 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "/tools/backlink-gap 에서 경쟁사에는 있지만 내 도메인에는 없는 백링크 출처를 확인할 수 있습니다.",
      },
    },
  ],
};

export default function DomainComparePage() {
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
        <h1 className="text-3xl font-bold">도메인 비교기</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          두 도메인 DA·DR·TF·CF·백링크 수 5축 레이더 차트 비교
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          경쟁사 도메인 권위를 한눈에 비교하세요. Moz DA, Ahrefs DR, Majestic TF·CF,
          총 백링크 수를 나란히 표시하고 레이더 차트로 강점·약점 패턴을 즉시 확인합니다.
        </p>
      </div>

      {/* 3개 정보 카드 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">레이더 차트 시각 비교</h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              DA·DR·TF·참조도메인·트래픽 5개 축을 0~100으로 정규화해 레이더 차트로 그립니다.
              두 도메인의 차트를 겹쳐 보면 어느 축에서 우세하고 어느 축이 취약한지
              수치 비교 없이도 즉시 파악됩니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">다원 지표 동시 비교</h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              Moz, Ahrefs, Majestic 3개 데이터 소스를 한 화면에서 비교합니다.
              단일 지표만으로 놓치는 신뢰도(TF)·링크양(CF) 비율까지 확인해
              실질적인 링크 프로필 건강도를 평가하세요.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">전략적 격차 분석</h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              상세 비교표에서 A&minus;B 차이를 색상으로 즉시 확인합니다.
              우세한 축은 방어 전략으로, 열세한 축은 집중 투자 우선순위로 활용해
              SEO 로드맵 수립에 바로 사용할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HowTo 3단계 */}
      <div className="mb-10">
        <h2 className="text-base font-semibold mb-4">사용 방법 &mdash; 3단계</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          <li className="flex gap-3 rounded-lg border p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <div>
              <p className="text-sm font-medium">두 도메인 입력</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                비교할 두 도메인을 각각 입력란에 입력합니다. (예: naver.com / daum.net)
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <div>
              <p className="text-sm font-medium">비교 실행</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                &lsquo;두 도메인 비교&rsquo; 버튼을 누르면 DA·DR·TF·CF·백링크 수를 동시에 조회합니다.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <div>
              <p className="text-sm font-medium">레이더 차트 해석</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                5축 레이더 차트와 상세 비교표로 강점·약점 축을 파악하고 전략에 반영합니다.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* 도구 본체 */}
      <DomainCompareForm />

      {/* 가이드 article */}
      <article className="tools-prose mt-16 border-t pt-12 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">경쟁사 비교에서 레이더 차트가 유용한 이유</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            도메인 비교를 수치 테이블로만 보면 &ldquo;DA는 내가 높은데 DR은 낮다&rdquo;처럼 지표마다 따로 판단해야 합니다.
            레이더 차트는 DA·DR·TF·참조도메인·트래픽 5개 축을 동일 스케일로 겹쳐 그려주기 때문에
            두 도메인의 전체 프로필을 단번에 비교할 수 있습니다. 상대보다 차트 면적이 넓으면 전반적으로 강한 도메인,
            특정 축만 돌출되어 있으면 그 지표에 집중 투자한 도메인임을 즉시 알 수 있습니다.
            SEO 경쟁 분석에서 시간 대비 인사이트가 가장 빠른 방법이 레이더 차트 비교입니다.
            실무에서는 분기별로 같은 경쟁사와 비교해 나의 성장 속도를 추적하는 용도로도 활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5축 해석 방법</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            각 축이 측정하는 내용을 알아야 비교 결과를 전략으로 전환할 수 있습니다.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Moz DA (도메인 권위):</strong> 0~100 척도.
              검색 순위 예측에 가장 널리 쓰이는 지표입니다.
              40 이상이면 평균적인 경쟁력, 60 이상이면 틈새 시장에서 매우 강한 도메인으로 봅니다.
            </li>
            <li>
              <strong className="text-foreground">Ahrefs DR (도메인 레이팅):</strong> 백링크 강도를 반영합니다.
              DA보다 업데이트가 빠르고 새 백링크 획득에 민감하게 반응하므로 단기 링크빌딩 효과를 추적하기 좋습니다.
            </li>
            <li>
              <strong className="text-foreground">Majestic TF (트러스트 플로우):</strong> 링크 신뢰도를 측정합니다.
              높을수록 고품질 출처에서 링크를 받고 있다는 뜻입니다. TF가 낮으면 스팸 링크가 많을 가능성이 있습니다.
            </li>
            <li>
              <strong className="text-foreground">Majestic CF (사이테이션 플로우):</strong> 링크 양을 반영합니다.
              TF:CF 비율이 0.5 이상이면 건강한 프로필, 0.3 미만이면 저품질 링크 비중이 높다고 봅니다.
            </li>
            <li>
              <strong className="text-foreground">참조 도메인 수:</strong> 독립적으로 링크를 보내는 도메인 수입니다.
              총 백링크 수보다 더 중요한 다양성 지표입니다. 단일 출처 반복 링크보다 다수 도메인의 단일 링크가 훨씬 가치 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">비교 결과를 전략으로 전환하기</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            레이더 차트 비교 결과를 확인했다면 다음 원칙으로 전략을 수립하세요.
            내가 우세한 축(예: TF)은 링크 품질을 유지하면서 방어 전략을 유지합니다.
            경쟁사가 우세한 축(예: DR)은 백링크 수와 다양성을 집중 확보해 격차를 좁히는 것이 우선입니다.
            TF:CF 비율을 경쟁사와 비교했을 때 내가 낮다면 저품질 링크 비율이 높다는 신호이므로
            링크 감사(Link Audit) 후 Disavow 작업이 필요할 수 있습니다.
            DA와 DR 차이가 15 이상이면 Ahrefs 기준으로 최근 백링크가 급증했거나 손실됐다는 뜻이므로
            최근 6개월 링크 변화를 함께 확인하세요.
            비교 결과는 SEO 에이전시나 컨설턴트에게 현황을 브리핑할 때 레이더 차트 스크린샷만으로도
            명확한 커뮤니케이션 자료가 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">여러 경쟁사와 비교할 때는?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            이 도구는 두 도메인 1:1 비교에 최적화되어 있습니다. 3개 이상을 한꺼번에 비교하려면
            두 가지 방법을 병행하는 것이 현실적입니다.
            첫째, 이 도구로 &ldquo;내 도메인 vs 경쟁사A&rdquo;, &ldquo;내 도메인 vs 경쟁사B&rdquo;를 순차적으로 비교해
            각각의 격차를 기록합니다.
            둘째,{" "}
            <a href="/tools/common-backlinks" className="text-primary underline underline-offset-2">
              공통 백링크 분석기
            </a>
            에서 공통으로 링크를 받는 출처를 찾아 어떤 사이트가 업계 내 핵심 링크 허브인지 파악합니다.
            셋째,{" "}
            <a href="/tools/competitor-discovery" className="text-primary underline underline-offset-2">
              경쟁사 발굴 도구
            </a>
            로 내가 미처 인식하지 못한 검색 경쟁자를 먼저 찾은 뒤 비교 대상을 선정하면
            분석 범위를 체계적으로 확장할 수 있습니다.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">도메인 권위 지표 중 가장 중요한 건?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              단일 지표보다 복합 해석이 중요합니다. DA는 검색순위 예측력, DR은 백링크 강도,
              TF는 신뢰도를 각각 반영합니다. 레이더 차트에서 세 지표가 고르게 높은 도메인이
              실질적으로 강한 경쟁자입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">격차가 크면 따라잡을 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DA 20 이상 격차도 6~18개월 꾸준한 백링크 확보와 콘텐츠 전략으로 좁힐 수 있습니다.
              레이더 차트에서 격차가 작은 축부터 집중 공략해 점진적으로 전체 차트를 키워가는 방법이 효율적입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">백링크 수가 많다고 권위가 높은 건가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              아닙니다. 스팸성 저품질 백링크가 많으면 Majestic TF가 낮게 나옵니다.
              TF:CF 비율이 0.5 이상이면 건강한 링크 프로필로 볼 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">3개 이상 도메인 비교는 안 되나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              현재 도구는 두 도메인 1:1 비교를 지원합니다. 여러 경쟁사를 분석하려면{" "}
              <a href="/tools/competitor-discovery" className="text-primary underline underline-offset-2">
                경쟁사 발굴
              </a>
              {" "}또는{" "}
              <a href="/tools/common-backlinks" className="text-primary underline underline-offset-2">
                공통 백링크 분석기
              </a>
              를 함께 활용하세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">한 도메인을 자세히 보고 싶어요.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <a href="/tools/domain-authority" className="text-primary underline underline-offset-2">
                도메인 권위 조회기
              </a>
              에서 단일 도메인의 DA, DR, TF, 참조도메인, 유기 키워드 수 등을 상세하게 확인할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">경쟁사 백링크 출처를 알 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <a href="/tools/backlink-gap" className="text-primary underline underline-offset-2">
                백링크 갭 분석기
              </a>
              에서 경쟁사에는 있지만 내 도메인에는 없는 백링크 출처를 확인하고
              링크빌딩 우선순위를 정할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">함께 쓰면 좋은 도구</h2>
        <RelatedTools currentTool="domain-compare" />
      </section>

      {/* CTA */}
      <div className="mt-16 rounded-xl bg-muted/50 border px-6 py-10 text-center">
        <h2 className="text-xl font-bold mb-2">전문가 SEO 컨설팅이 필요하신가요?</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
          도메인 비교 결과를 바탕으로 백링크 전략·콘텐츠 로드맵·기술 SEO 개선까지
          맞춤형 컨설팅을 받아보세요.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          무료 상담 신청
        </a>
      </div>
    </div>
  );
}
