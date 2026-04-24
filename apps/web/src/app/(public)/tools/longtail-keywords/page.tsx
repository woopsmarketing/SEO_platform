import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LongtailForm } from "./longtail-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "롱테일 키워드 발굴기 — 무료 질문형 키워드 · 니치 키워드 찾기 도구",
  description:
    "시드 키워드를 입력하면 3단어 이상 롱테일 키워드와 질문형 키워드를 자동 분류합니다. 검색 의도 키워드로 전환율 높은 콘텐츠를 기획하세요. 상위 10개 SERP DA 평균 제공.",
  openGraph: {
    title: "롱테일 키워드 발굴기 | SEO월드",
    description: "시드 키워드에서 롱테일·질문형·니치 키워드를 자동 분류 추천. 무료.",
  },
  alternates: { canonical: "/tools/longtail-keywords" },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "롱테일 키워드 발굴기",
  url: "https://seoworld.co.kr/tools/longtail-keywords",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "시드 키워드를 입력하면 롱테일 키워드, 질문형 키워드, 니치 키워드를 자동으로 분류하여 제공하는 무료 SEO 도구입니다.",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "롱테일 키워드 발굴 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "시드 키워드 입력",
      text: "타겟 주제를 나타내는 핵심 단어(1~2개)를 입력창에 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "자동 분류 결과 확인",
      text: "VebAPI와 구글 자동완성 기반으로 수집된 키워드를 롱테일·질문형·미디엄으로 자동 분류합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "SERP DA 평균으로 경쟁 강도 판단",
      text: "상위 10개 키워드의 구글 SERP 도메인 권위(DA) 평균을 확인하고 공략 가능한 키워드를 선별합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "롱테일 키워드가 왜 전환율이 높나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "롱테일 키워드는 검색 의도가 구체적이고 구매·행동 결정 단계에 있는 사람이 입력하는 경우가 많아, 동일 트래픽 대비 전환율이 숏테일 키워드보다 3~5배 높게 나타납니다.",
      },
    },
    {
      "@type": "Question",
      name: "검색량이 너무 낮은 롱테일도 작성해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "월 검색량 10~50 수준이라도 구매 의도가 명확하고 경쟁이 없는 키워드라면 작성할 가치가 있습니다. 단, 검색량이 0인 키워드는 트래픽 기대치를 낮추고 브랜딩·색인 보강 목적으로만 활용하세요.",
      },
    },
    {
      "@type": "Question",
      name: "질문형 키워드는 어떻게 활용하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "질문형 키워드는 FAQ 섹션, 블로그 소제목(H2), 피처드 스니펫 최적화에 활용합니다. People Also Ask 도구로 추가 질문을 발굴하면 더 풍부한 콘텐츠를 만들 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "롱테일 키워드 난이도는 어떻게 판단하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "상위 10개 SERP 결과의 도메인 권위(DA) 평균이 30 미만이면 공략 가능성이 높습니다. SERP 난이도 맵 도구로 더 정밀한 분석이 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "롱테일 키워드 검색량을 보려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "키워드 리서치 도구를 이용하면 각 롱테일 키워드의 월간 검색량, CPC, 경쟁도를 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "콘텐츠 소재가 더 필요해요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "콘텐츠 갭 분석 도구를 사용하면 경쟁사가 다루는데 내 사이트는 아직 다루지 않은 토픽을 발굴할 수 있습니다.",
      },
    },
  ],
};

export default function LongtailKeywordsPage() {
  return (
    <>
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

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">롱테일 키워드 발굴기</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            시드 키워드에서 롱테일 · 질문형 · 니치 키워드를 자동 분류
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            3단어 이상의 롱테일 키워드와 &lsquo;어떻게/왜/무엇&rsquo; 같은 질문형 키워드를 자동으로 분류합니다.
            상위 10개는 SERP 도메인 권위(DA) 평균을 함께 제공해 경쟁 강도까지 확인할 수 있습니다.
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-orange-50/50 border-orange-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-orange-900 mb-2">롱테일 키워드란?</h2>
              <p className="text-xs leading-relaxed text-orange-800/80">
                3단어 이상으로 구성된 구체적인 검색어입니다. 검색량은 적지만 검색 의도가
                명확해 전환율이 높고, 경쟁이 낮아 신규 사이트가 상위노출을 달성하기 쉽습니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-violet-50/50 border-violet-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-violet-900 mb-2">질문형 키워드의 가치</h2>
              <p className="text-xs leading-relaxed text-violet-800/80">
                &lsquo;어떻게&rsquo;, &lsquo;왜&rsquo;, &lsquo;무엇&rsquo; 같은 질문형 키워드는 구글 People Also Ask 영역과
                피처드 스니펫 노출 확률이 높습니다. FAQ와 블로그 소제목으로 우선 활용하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50/50 border-teal-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-teal-900 mb-2">이 도구의 이점</h2>
              <p className="text-xs leading-relaxed text-teal-800/80">
                VebAPI와 구글 자동완성으로 최대 50개 관련 키워드를 수집한 뒤 단어 수·질문 여부로
                자동 분류합니다. 상위 10개는 SERP DA 평균까지 제공합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">롱테일 키워드 발굴 방법</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              { step: "1", title: "시드 키워드 입력", desc: "핵심 단어 1~2개를 입력창에 입력합니다." },
              { step: "2", title: "자동 분류 결과 확인", desc: "롱테일·질문형·미디엄 세 유형으로 자동 분류된 키워드를 확인합니다." },
              { step: "3", title: "DA로 경쟁 강도 판단", desc: "상위 10개 SERP DA 평균이 낮은 키워드를 우선 공략합니다." },
            ].map((item) => (
              <li key={item.step} className="flex gap-3 rounded-lg border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
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
        <LongtailForm />

        {/* 가이드 Article */}
        <article className="tools-prose mt-16 border-t pt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              롱테일 키워드가 전환율에서 압도적인 이유
            </h2>
            <p>
              검색엔진에서 &ldquo;운동화&rdquo;를 검색하는 사람과 &ldquo;남성 러닝화 발볼 넓은 추천&rdquo;을 검색하는
              사람은 전혀 다른 단계에 있습니다. 전자는 아직 정보를 탐색 중이고, 후자는 이미
              구체적인 조건을 알고 구매를 결정하려 합니다. 이처럼 롱테일 키워드는 검색 의도가
              명확한 사람이 입력하기 때문에, 같은 트래픽이라도 구매·문의·구독으로 이어지는 비율이
              숏테일 키워드보다 3~5배 높게 나타납니다.
            </p>
            <p className="mt-3">
              또한 롱테일 키워드는 경쟁이 낮습니다. 대형 포털과 브랜드 사이트들은 검색량이 많은
              단어에 집중하기 때문에, 3단어 이상의 구체적인 키워드에서는 도메인 권위가 낮은
              신규 사이트도 상위 노출이 가능합니다. 콘텐츠 하나로 수십 개의 롱테일 키워드를
              동시에 잡을 수 있어 투자 대비 효율도 뛰어납니다.
            </p>
            <p className="mt-3">
              구글은 검색어의 문맥과 의도를 이해하는 자연어 처리 능력이 갈수록 향상되고 있습니다.
              구체적인 롱테일 키워드에 맞춘 콘텐츠는 이 알고리즘과 정확히 일치하는 신호를 보내,
              장기적인 검색 트래픽 확보에 유리합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              롱테일 · 질문형 · 니치 키워드 구분하기
            </h2>
            <p>
              세 유형은 겹치는 부분이 있지만 활용 방법이 다릅니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">롱테일 키워드</strong>는 단어 수 기준입니다.
              일반적으로 3단어 이상으로 구성된 검색어를 롱테일이라 부릅니다. &ldquo;SEO&rdquo;가 숏테일이라면
              &ldquo;스타트업 SEO 블로그 운영 방법&rdquo;은 롱테일입니다. 단어 수가 늘수록 검색량은 줄지만
              전환 의도는 높아집니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">질문형 키워드</strong>는 &lsquo;어떻게&rsquo;, &lsquo;왜&rsquo;, &lsquo;무엇&rsquo;,
              &lsquo;언제&rsquo;, &lsquo;어디서&rsquo; 같은 의문사로 시작하거나 끝나는 검색어입니다. 피처드 스니펫과
              People Also Ask 영역에 노출되기 쉬워 클릭 없이 브랜드를 노출하는 제로클릭 SEO에도
              효과적입니다.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">니치 키워드</strong>는 좁은 카테고리나 세분화된
              시장을 나타내는 검색어입니다. &ldquo;비건 친환경 유아 세제&rdquo; 같이 특정 고객 집단이
              검색하는 단어로, 검색량은 매우 적지만 경쟁 사이트가 거의 없고 해당 타겟에게
              정확히 닿을 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              롱테일 키워드로 콘텐츠 클러스터 만드는 법
            </h2>
            <p>
              콘텐츠 클러스터 전략은 하나의 핵심 주제(pillar 페이지)를 중심으로 5~10개의 세부
              주제(supporting 글)를 연결하는 구조입니다. 롱테일 키워드는 이 supporting 글의
              주제로 이상적입니다.
            </p>
            <p className="mt-3">
              예를 들어 &ldquo;SEO&rdquo;를 pillar 주제로 삼는다면, &ldquo;SEO 초보자 시작 방법&rdquo;,
              &ldquo;블로그 SEO 최적화 체크리스트&rdquo;, &ldquo;롱테일 키워드로 구글 상위노출 방법&rdquo; 같은
              롱테일 키워드 각각을 별도 글로 발행합니다. 각 글은 pillar 페이지로 내부 링크를
              연결하고, pillar 페이지도 각 supporting 글로 링크합니다.
            </p>
            <p className="mt-3">
              이 구조는 구글이 사이트의 주제 전문성을 인식하는 데 도움을 주며, 한 글이 순위를
              올리면 클러스터 내 다른 글들도 함께 순위가 올라가는 시너지 효과가 있습니다.
              롱테일 키워드 발굴기에서 나온 결과를 클러스터 주제 후보로 그대로 활용할 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              롱테일 키워드를 블로그에 적용할 때 흔한 실수
            </h2>
            <p>
              <strong className="text-foreground">실수 1 — 검색량 0 키워드로 글 작성.</strong>{" "}
              월 검색량이 전혀 없는 키워드는 아무리 잘 써도 유입이 없습니다. 검색량 도구로
              최소 월 10 이상을 확인한 후 작성하세요.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">실수 2 — 한 글에 너무 많은 키워드.</strong>{" "}
              하나의 글이 너무 많은 롱테일 키워드를 동시에 노리면 어떤 키워드에도 집중되지 않습니다.
              글 하나에 대표 롱테일 키워드 1~2개, 보조 키워드 3~5개 수준으로 집중하세요.
            </p>
            <p className="mt-3">
              <strong className="text-foreground">실수 3 — 제목과 H2에 키워드 미반영.</strong>{" "}
              롱테일 키워드를 본문에만 넣고 H1, H2, 메타 타이틀에 포함하지 않으면 검색엔진이
              해당 글이 그 키워드와 관련 있다고 판단하기 어렵습니다. 키워드는 반드시 제목 태그와
              주요 소제목에 자연스럽게 포함시켜야 합니다.
            </p>
          </div>
        </article>

        {/* FAQ */}
        <section className="mt-12 border-t pt-10">
          <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">롱테일 키워드가 왜 전환율이 높나요?</h3>
              <p className="text-sm text-muted-foreground">
                검색 의도가 구체적이고 구매·행동 결정 단계에 있는 사람이 입력하는 경우가 많아,
                동일 트래픽 대비 전환율이 숏테일 키워드보다 3~5배 높게 나타납니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">검색량이 너무 낮은 롱테일도 작성해야 하나요?</h3>
              <p className="text-sm text-muted-foreground">
                월 검색량 10~50 수준이라도 구매 의도가 명확하고 경쟁이 없다면 작성할 가치가 있습니다.
                검색량 0 키워드는 브랜딩 목적에만 활용하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">질문형 키워드는 어떻게 활용하나요?</h3>
              <p className="text-sm text-muted-foreground">
                FAQ 섹션, 블로그 소제목(H2), 피처드 스니펫 최적화에 활용합니다.{" "}
                <Link href="/tools/people-also-ask" className="text-primary underline underline-offset-2">
                  People Also Ask 도구
                </Link>
                로 추가 질문도 발굴해보세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">롱테일 키워드 난이도는 어떻게 판단하나요?</h3>
              <p className="text-sm text-muted-foreground">
                상위 10개 SERP DA 평균이 30 미만이면 공략 가능성이 높습니다.{" "}
                <Link href="/tools/serp-difficulty" className="text-primary underline underline-offset-2">
                  SERP 난이도 맵
                </Link>
                으로 더 정밀하게 분석하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">롱테일 키워드 검색량을 보려면?</h3>
              <p className="text-sm text-muted-foreground">
                <Link href="/tools/keyword-research" className="text-primary underline underline-offset-2">
                  키워드 리서치 도구
                </Link>
                를 이용하면 월간 검색량, CPC, 경쟁도를 확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">콘텐츠 소재가 더 필요해요.</h3>
              <p className="text-sm text-muted-foreground">
                <Link href="/tools/content-gap" className="text-primary underline underline-offset-2">
                  콘텐츠 갭 분석 도구
                </Link>
                를 사용하면 경쟁사가 다루는데 내 사이트는 아직 다루지 않은 토픽을 발굴할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <div className="mt-12">
          <RelatedTools currentTool="longtail-keywords" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border bg-gradient-to-r from-orange-50 to-amber-50 p-6 text-center">
          <p className="text-base font-semibold text-foreground mb-1">
            키워드 전략 수립이 어렵다면 전문가와 함께하세요
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            롱테일 키워드 선정부터 콘텐츠 클러스터 설계, 퍼블리싱까지 SEO월드가 도와드립니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              무료 상담 신청
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
            >
              다른 SEO 도구 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
