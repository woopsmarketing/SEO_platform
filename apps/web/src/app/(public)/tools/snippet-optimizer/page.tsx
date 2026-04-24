import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SnippetForm } from "./snippet-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "메타 스니펫 최적화 도구 — CTR 높이는 법 무료 분석",
  description:
    "URL을 입력하면 AI가 타이틀·디스크립션을 분석하고 CTR이 높은 스니펫 후보를 제안합니다. 검색 결과 클릭률을 높이는 메타 스니펫 최적화를 무료로 시작하세요.",
  alternates: { canonical: "/tools/snippet-optimizer" },
  openGraph: {
    title: "메타 스니펫 최적화 도구 | SEO월드",
    description:
      "AI가 경쟁사 상위 5개 스니펫을 분석하고 CTR을 높이는 타이틀·디스크립션 후보를 제안합니다.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "스니펫 옵티마이저",
  url: "https://seoworld.co.kr/tools/snippet-optimizer",
  applicationCategory: "SEOApplication",
  operatingSystem: "All",
  description:
    "URL과 타겟 키워드를 입력하면 AI가 메타 스니펫을 분석하고 CTR 최적화 후보를 제안합니다.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "왜 구글이 내 메타 description을 안 쓰고 다른 텍스트를 보여주나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글은 검색 쿼리에 더 관련성이 높다고 판단되는 본문 텍스트를 자동으로 스니펫으로 사용합니다. 메타 description이 검색 의도와 맞지 않거나 너무 짧을 때 발생합니다. 키워드를 자연스럽게 포함하고 검색 의도에 맞는 description을 작성하면 직접 사용 빈도가 높아집니다.",
      },
    },
    {
      "@type": "Question",
      name: "타이틀에 넣으면 CTR이 오르는 키워드 패턴은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "숫자(5가지, 10분 완성), 연도(2025), 질문형(~하는 법?), 긴급성(지금 바로), 결과 보장(클릭률 2배) 등의 패턴이 효과적입니다. 특히 한국어 검색에서는 숫자+명사 조합이 클릭 유발 효과가 큽니다.",
      },
    },
    {
      "@type": "Question",
      name: "숫자·연도를 타이틀에 넣으면 정말 CTR이 오르나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Backlinko 연구에 따르면 숫자를 포함한 타이틀은 그렇지 않은 경우보다 클릭률이 평균 36% 높습니다. 연도는 콘텐츠의 최신성을 나타내어 신뢰도를 높이고, 동일 순위 대비 CTR을 2배까지 끌어올릴 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "스니펫 최적화 후 효과는 언제 나타나나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "구글이 페이지를 재크롤링하고 새 메타 정보를 인덱싱하는 데 보통 3~14일이 걸립니다. GSC의 Search Analytics에서 해당 페이지·키워드 조합의 CTR 변화를 2~4주 후 비교하면 효과를 측정할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "메타 태그 전반을 점검하려면 어떤 도구를 쓰나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드의 메타태그 분석기(/tools/meta-generator)를 사용하면 title, description, OG 태그, canonical, JSON-LD 등 30개 이상의 메타태그 항목을 한 번에 진단할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 도메인이 노출되는 키워드부터 보고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO월드의 내 노출 키워드 TOP 20(/tools/my-top-keywords) 도구를 사용하면 Google Search Console 데이터를 기반으로 현재 노출 중인 상위 키워드를 바로 확인할 수 있습니다.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "스니펫 옵티마이저로 CTR 높이는 법",
  description: "URL과 타겟 키워드를 입력해 AI 스니펫 제안을 받고 적용하는 3단계",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "URL과 키워드 입력",
      text: "분석할 페이지 URL과 타겟 키워드를 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI 스니펫 분석",
      text: "AI가 현재 메타태그와 구글 상위 5개 경쟁 스니펫을 비교·분석합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "최적화 후보 적용",
      text: "CTR을 높이는 타이틀 2안과 디스크립션 1안을 복사해 CMS에 바로 적용합니다.",
    },
  ],
};

export default function SnippetOptimizerPage() {
  return (
    <>
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
          <h1 className="text-3xl font-bold">메타 스니펫 최적화 도구</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            같은 순위라도 스니펫이 다르면 CTR이 2~3배 벌어집니다
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            URL과 타겟 키워드를 입력하면 AI가 구글 상위 5개 경쟁 스니펫을 분석하고,
            CTR을 높이는 타이틀 &middot; 디스크립션 후보를 즉시 제안합니다.
          </p>
        </div>

        {/* 3 info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-blue-900 mb-2">
                스니펫이 트래픽을 좌우합니다
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                구글 1위 평균 CTR은 27%, 2위는 15%입니다. 하지만 같은 1위라도
                스니펫 품질에 따라 CTR은 15%~40%까지 차이납니다. 순위 상승 없이도
                스니펫 개선만으로 트래픽을 즉시 늘릴 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-green-900 mb-2">
                경쟁사 스니펫과 비교 분석
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                현재 내 페이지의 타이틀·디스크립션과 구글 상위 5개 경쟁 스니펫을
                나란히 비교합니다. 어떤 패턴이 클릭을 유도하는지 직관적으로 파악하고
                AI 제안에 반영합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-amber-900 mb-2">
                복사 한 번으로 즉시 적용
              </h2>
              <p className="text-xs leading-relaxed text-amber-800/80">
                타이틀 2안과 디스크립션 1안을 제안받고, 복사 버튼 한 번으로 CMS에
                바로 붙여넣으세요. 적용 후 GSC Search Analytics에서 CTR 변화를
                추적하면 효과를 수치로 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4">사용 방법 &mdash; 3단계</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "URL과 키워드 입력",
                desc: "분석할 페이지 URL과 타겟 키워드를 입력합니다.",
              },
              {
                step: "2",
                title: "AI 스니펫 분석",
                desc: "AI가 현재 메타태그와 구글 상위 5개 경쟁 스니펫을 비교·분석합니다.",
              },
              {
                step: "3",
                title: "최적화 후보 적용",
                desc: "타이틀 2안과 디스크립션 1안을 복사해 CMS에 바로 적용합니다.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-3 rounded-xl border bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Form */}
        <SnippetForm />

        {/* 가이드 article */}
        <article className="tools-prose mt-16 border-t pt-12 space-y-10 max-w-none">
          <section>
            <h2 className="text-xl font-bold mb-3">구글 스니펫이 트래픽을 결정짓는 이유</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Backlinko가 500만 건의 구글 검색 결과를 분석한 연구에 따르면 1위 결과의 평균 CTR은
              27.6%, 2위는 15.8%, 3위는 11.0%입니다. 10위는 2.5%에 불과합니다. 이 수치만 보면
              순위가 곧 트래픽처럼 보이지만, 실제는 다릅니다. 같은 1위 슬롯이라도 스니펫 품질에
              따라 CTR은 15%에서 40% 이상까지 벌어집니다. 순위를 한 단계 올리는 것보다 스니펫을
              최적화하는 것이 더 빠르고 비용 효율적인 트래픽 증가 방법인 이유입니다.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              구글은 검색 결과 페이지에서 사용자에게 &ldquo;이 페이지가 당신의 질문에 답합니다&rdquo;라는
              신호를 스니펫으로 전달합니다. 타이틀과 디스크립션이 검색 의도와 정확히 일치하면
              사용자는 다른 결과를 확인하지 않고 바로 클릭합니다. 반면 모호하거나 브랜드명만
              나열된 스니펫은 더 낮은 순위의 경쟁자에게 클릭을 빼앗깁니다. 스니펫 최적화는
              이미 획득한 순위에서 최대한 많은 트래픽을 가져오는 &ldquo;수확 전략&rdquo;입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">높은 CTR 타이틀 &middot; 디스크립션의 5가지 요소</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              수천 건의 A/B 테스트와 CTR 데이터를 종합하면 클릭을 유발하는 스니펫에는 다섯 가지
              공통 요소가 있습니다.
            </p>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">1. 숫자와 리스트</strong> &mdash; &ldquo;7가지 방법&rdquo;,
                &ldquo;3분 완성&rdquo;처럼 구체적인 숫자는 콘텐츠의 범위를 예고하고 사용자에게 예측 가능성을
                줍니다. Backlinko 데이터에서 숫자 포함 타이틀은 그렇지 않은 경우보다 CTR이 평균 36% 높았습니다.
              </p>
              <p>
                <strong className="text-foreground">2. 질문형 타이틀</strong> &mdash; &ldquo;~하는 법은?&rdquo;,
                &ldquo;~이 뭔가요?&rdquo; 같은 질문형은 사용자의 질문과 직접 매칭되어 관련성 신호를 강화합니다.
                특히 정보성 키워드(how-to, what is)에서 효과적입니다.
              </p>
              <p>
                <strong className="text-foreground">3. 연도 태그</strong> &mdash; &ldquo;2025 최신 가이드&rdquo;처럼
                연도를 포함하면 콘텐츠의 최신성을 시각적으로 전달합니다. 특히 빠르게 변하는 분야(SEO, 마케팅,
                기술)에서 연도 태그는 CTR을 10~20% 추가로 높이는 경우가 많습니다.
              </p>
              <p>
                <strong className="text-foreground">4. 벤치마크 수치</strong> &mdash; &ldquo;평균 CTR 3배&rdquo;,
                &ldquo;2주 만에 순위 상승&rdquo; 같은 구체적 결과 수치는 신뢰도를 높이고 클릭 욕구를 자극합니다.
                디스크립션에 이를 배치하면 스캔 중인 사용자의 시선을 멈추게 합니다.
              </p>
              <p>
                <strong className="text-foreground">5. 감정 트리거</strong> &mdash;
                &ldquo;무료&rdquo;, &ldquo;지금 바로&rdquo;, &ldquo;실수하면 안 되는&rdquo; 같은 단어는 즉각적인 행동 욕구를
                유발합니다. 단, 과도한 어뷰징은 구글이 스니펫을 직접 리라이트하는 원인이 될 수 있으므로 절제가 필요합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">AI 스니펫 제안을 현장에 적용하는 법</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI가 제안한 스니펫 후보를 단순히 복사·붙여넣기하는 것으로 끝나면 안 됩니다.
              실제 트래픽 개선을 수치로 확인하려면 체계적인 적용과 측정이 필요합니다.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              먼저 제안받은 타이틀 2안 중 하나를 선택해 적용한 뒤, 적용 일자를 기록합니다.
              Google Search Console의 Search Analytics에서 해당 페이지를 필터링하고 날짜 범위를
              &ldquo;적용 전 28일 vs 적용 후 28일&rdquo;로 비교하세요. CTR과 클릭 수가 핵심 지표입니다.
              임프레션이 유지되는데 CTR이 오르면 스니펫 최적화가 효과를 낸 것입니다.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              여러 페이지에 동시에 적용할 때는 A/B 방식보다 순차 적용을 권장합니다.
              동시에 변경하면 어떤 스니펫이 효과적인지 파악하기 어렵습니다. 트래픽이 높은 페이지부터
              우선순위를 정하고, 월 1~2개 페이지씩 적용 &middot; 측정 &middot; 개선을 반복하면 3개월 내 전체 CTR을
              의미 있게 끌어올릴 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">스니펫 최적화의 한계와 보완 전략</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              구글은 약 62%의 경우에서 메타 description을 그대로 사용하지 않고 자체적으로 리라이트합니다.
              이는 의도적인 것이 아니라 쿼리에 더 관련성 높은 텍스트를 본문에서 찾았을 때 발생합니다.
              따라서 메타 description 최적화와 함께 본문에도 핵심 키워드와 답변을 명확히 배치해야 합니다.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              구조화 데이터(JSON-LD)는 스니펫을 &ldquo;리치 결과&rdquo;로 확장시킵니다. FAQ 스키마를 적용하면
              검색 결과 아래에 질문·답변이 추가로 노출되어 SERP 점유 면적이 늘어납니다. HowTo 스키마는
              단계별 미리보기를 제공하고, Recipe &middot; Product 스키마는 별점·가격 등 시각 정보를 추가합니다.
              이 모든 요소가 CTR에 긍정적인 영향을 미칩니다.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              이미지 썸네일도 스니펫의 일부입니다. 구글 이미지 검색이나 Discover에서 페이지가 노출될 때
              매력적인 OG 이미지는 추가 클릭을 유도합니다. 사이트링크 스니펫(브랜드 키워드에서 하위 페이지가
              함께 노출되는 형태)은 직접 제어할 수 없지만, 내부 링크 구조를 명확히 하고 사이트맵을 최신
              상태로 유지하면 구글이 사이트링크를 자동 생성할 가능성이 높아집니다.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">
                왜 구글이 내 메타 description을 안 쓰고 다른 텍스트를 보여주나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                구글은 검색 쿼리에 더 관련성이 높다고 판단되는 본문 텍스트를 자동으로 스니펫으로 사용합니다.
                메타 description이 검색 의도와 맞지 않거나 너무 짧을 때 발생합니다. 키워드를 자연스럽게 포함하고
                검색 의도에 맞는 description을 작성하면 구글이 직접 사용하는 빈도가 높아집니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                타이틀에 넣으면 CTR이 오르는 키워드 패턴은?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                숫자(5가지, 10분 완성), 연도(2025), 질문형(&ldquo;~하는 법?&rdquo;), 긴급성(&ldquo;지금 바로&rdquo;),
                결과 보장(&ldquo;클릭률 2배&rdquo;) 패턴이 효과적입니다. 한국어 검색에서는 숫자+명사 조합과
                &ldquo;무료&rdquo; &middot; &ldquo;공짜&rdquo; 같은 단어도 여전히 높은 CTR을 기록합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                숫자 &middot; 연도를 넣으면 정말 CTR이 오르나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Backlinko 연구에 따르면 숫자를 포함한 타이틀은 평균 CTR이 36% 높습니다. 연도는 콘텐츠
                최신성을 나타내어 동일 순위에서 CTR을 2배까지 끌어올리기도 합니다. 단, 연도는 매년
                업데이트해야 오히려 신뢰를 깎지 않습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                스니펫 최적화 후 효과는 언제 나타나나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                구글이 재크롤링 &middot; 재인덱싱하는 데 보통 3~14일이 걸립니다. GSC Search Analytics에서 해당
                페이지와 키워드를 필터링하고 &ldquo;적용 전 28일 vs 적용 후 28일&rdquo; CTR을 비교하면 효과를
                정확히 측정할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                메타 태그 전반을 점검하려면 어떤 도구를 쓰나요?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SEO월드의{" "}
                <Link href="/tools/meta-generator" className="text-blue-600 hover:underline">
                  메타태그 분석기
                </Link>
                를 사용하면 title, description, OG 태그, canonical, JSON-LD 등 30개 이상 항목을
                한 번에 진단할 수 있습니다. 스니펫 최적화 전 기본 메타태그 점검으로 활용하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">
                내 도메인이 노출되는 키워드부터 보고 싶어요.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <Link href="/tools/my-top-keywords" className="text-blue-600 hover:underline">
                  내 노출 키워드 TOP 20
                </Link>
                에서 GSC 데이터 기반으로 현재 노출 중인 상위 키워드를 바로 확인하세요.
                어떤 키워드의 스니펫을 먼저 최적화할지 우선순위를 정하는 데 유용합니다.
              </p>
            </div>
          </div>
        </div>

        {/* RelatedTools */}
        <div className="mt-16">
          <RelatedTools currentTool="snippet-optimizer" />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">스니펫 개선, 전문가와 함께하세요</h2>
          <p className="mt-2 text-blue-100 text-sm leading-relaxed">
            AI 제안을 넘어 CTR 데이터 분석 &middot; 구조화 데이터 세팅 &middot; 콘텐츠 전략까지
            <br className="hidden sm:block" />
            SEO월드 전문가가 도메인 맞춤 스니펫 최적화를 진행합니다.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              무료 상담 신청
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              다른 무료 도구 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
