import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuditForm } from "./audit-form";
import { ChangelogBanner } from "@/components/changelog-banner";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "온페이지 SEO 분석기 — 35개 항목 자동 검사 + AI 점수",
  description:
    "URL 입력만으로 HTTPS, 로딩 속도, 메타태그, 헤딩 구조, 이미지, 내부 링크, 구조화 데이터, 보안 헤더 등 35개 항목을 자동 검사합니다. AI가 종합 점수와 우선순위별 개선안을 즉시 제시합니다.",
  openGraph: {
    title: "온페이지 SEO 분석기 | SEO월드",
    description: "35개 항목 자동 검사 + AI SEO 점수. URL 하나로 사이트 진단 즉시 시작.",
  },
  alternates: { canonical: "/tools/onpage-audit" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "온페이지 SEO 분석기",
  url: "https://seoworld.co.kr/tools/onpage-audit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "URL을 입력하면 35개 SEO 항목을 자동 검사하고 AI가 점수와 개선안을 제시하는 무료 온페이지 SEO 분석 도구입니다.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "온페이지 SEO와 테크니컬 SEO의 차이는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "온페이지 SEO는 페이지 내 콘텐츠·메타태그·헤딩 구조처럼 콘텐츠 관련 요소를 최적화하는 작업입니다. 테크니컬 SEO는 크롤링·인덱싱·사이트 속도·보안 헤더처럼 기술 인프라를 최적화합니다. 두 영역은 겹치는 부분이 있으며, 이 도구는 양쪽을 모두 35개 항목으로 검사합니다.",
      },
    },
    {
      "@type": "Question",
      name: "점수만 올리면 구글 순위가 오르나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "점수는 기술적 최적화 수준을 반영하는 지표일 뿐, 순위 상승을 보장하지 않습니다. 콘텐츠 품질, 백링크, 사용자 신호 등 외부 요소도 함께 개선되어야 실질적인 순위 향상을 기대할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "SPA/CSR 사이트도 분석 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "분석은 가능하지만, JavaScript 실행 전 서버 응답 HTML을 기준으로 검사합니다. React·Next.js·Vue 등 CSR 사이트는 구글봇 1차 크롤링 시 보이는 것과 동일한 관점으로 결과가 표시됩니다. SSR 또는 사전 렌더링이 적용되었는지 함께 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "분석 후 가장 먼저 해야 할 일은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI가 제시한 문제 항목을 심각도 순서로 정렬하세요. 보안(HTTPS, HSTS) 문제를 최우선으로 수정하고, 다음으로 메타태그·헤딩 등 SEO 직결 항목, 마지막으로 이미지 alt·내부 링크 등 콘텐츠 개선 순서로 진행하는 것을 권장합니다.",
      },
    },
    {
      "@type": "Question",
      name: "메타태그만 따로 보고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "메타태그 분석기(/tools/meta-generator)를 사용하면 title, description, OG 태그, canonical 등을 전용으로 분석하고 AI 최적화 추천문까지 받을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "전문 SEO 컨설팅이 필요해요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "자동 분석 결과 이상의 맞춤 전략이 필요하다면 SEO월드 전문가 컨설팅 문의(/contact)를 통해 사이트별 심층 진단을 받으실 수 있습니다.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "온페이지 SEO 분석기 사용법",
  description: "URL을 입력해 35개 항목 자동 검사 후 AI 점수와 개선안을 확인하는 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "URL 입력",
      text: "분석할 웹페이지 주소(https://로 시작)를 입력창에 붙여넣습니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "자동 검사",
      text: "SEO 분석 버튼을 누르면 35개 항목이 자동으로 검사됩니다. 결과는 최대 30초 내에 표시됩니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "AI 개선안 적용",
      text: "AI가 항목별 점수와 우선순위 개선안을 제시합니다. 심각도 높은 항목부터 순서대로 수정하세요.",
    },
  ],
};

export default function OnpageAuditPage() {
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
        <div className="mb-4">
          <ChangelogBanner variant="compact" />
        </div>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">온페이지 SEO 분석기</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            35개 항목 자동 검사 + AI SEO 점수 &amp; 개선안
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            URL을 입력하면 HTTPS, 로딩 속도, 메타태그, 헤딩 구조, 이미지, 내부 링크, 구조화
            데이터, 보안 헤더를 즉시 검사하고 AI가 사이트 진단 결과를 제시합니다.
          </p>
        </div>

        {/* 3개 정보 카드 */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="bg-violet-50/50 border-violet-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-violet-900 mb-2">온페이지 SEO란?</h2>
              <p className="text-xs leading-relaxed text-violet-800/80">
                온페이지 SEO는 웹사이트 내부 요소를 최적화해 검색엔진 순위를 높이는 작업입니다.
                메타태그, 헤딩 구조, 이미지 alt, 내부 링크, 페이지 속도 등 검색엔진이 페이지를
                이해하고 평가하는 모든 요소를 포함합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50/50 border-teal-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-teal-900 mb-2">35개 항목 자동 검사</h2>
              <p className="text-xs leading-relaxed text-teal-800/80">
                상태 코드·HTTPS·로딩 속도·텍스트 비율·URL 구조, Title·Description·canonical·Lang,
                H1~H3 구조, 이미지 alt, 내부/외부 링크, Viewport, Gzip, HSTS, OG 태그, Twitter
                Card, JSON-LD, robots meta까지 한번에 검사합니다.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-rose-50/50 border-rose-100">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-sm font-semibold text-rose-900 mb-2">AI SEO 진단</h2>
              <p className="text-xs leading-relaxed text-rose-800/80">
                단순 체크리스트에 그치지 않습니다. AI가 검사 결과를 종합 분석해 종합 점수를 매기고,
                각 항목의 심각도와 코드 예시를 포함한 구체적인 개선 방안을 제시합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo 3단계 */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4">사용 방법 3단계</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "URL 입력",
                desc: "분석할 페이지 주소(https://)를 아래 입력창에 붙여넣습니다.",
              },
              {
                step: "2",
                title: "자동 검사",
                desc: "'SEO 분석' 버튼을 누르면 35개 항목이 자동으로 검사됩니다. 최대 30초 소요.",
              },
              {
                step: "3",
                title: "AI 개선안 적용",
                desc: "AI가 점수와 우선순위 개선안을 제시합니다. 심각도 높은 항목부터 수정하세요.",
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-3 rounded-lg border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 도구 본체 */}
        <Suspense fallback={null}>
          <AuditForm />
        </Suspense>

        {/* 가이드 article */}
        <article className="mt-16 border-t pt-12 space-y-12 text-sm leading-relaxed text-foreground/90">

          {/* h2-1 */}
          <section>
            <h2 className="text-xl font-bold mb-4">온페이지 SEO 35개 항목 카테고리별 이해</h2>
            <p className="mb-3">
              SEO월드 온페이지 분석기는 35개 항목을 6가지 카테고리로 분류해 검사합니다. 각 카테고리의
              역할을 이해하면 분석 결과를 더 효과적으로 활용할 수 있습니다.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  cat: "테크니컬 (7개)",
                  items: "상태 코드, 리다이렉트 횟수, URL 깊이, URL 길이, 텍스트/HTML 비율, Gzip/Brotli 압축, Cache-Control",
                  color: "bg-violet-50 border-violet-200",
                },
                {
                  cat: "메타태그 (8개)",
                  items: "Title·길이, Description·길이·중복 여부, Canonical, Lang, Keywords, Robots meta, X-Robots-Tag",
                  color: "bg-teal-50 border-teal-200",
                },
                {
                  cat: "콘텐츠 구조 (6개)",
                  items: "H1 개수·중복 여부, H2 존재 여부, H3 수, 단어 수, Deprecated 태그, iframe 개수",
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  cat: "이미지 최적화 (4개)",
                  items: "전체 이미지 수, alt 미설정 이미지 수, OG 이미지 URL 존재 여부, Favicon",
                  color: "bg-amber-50 border-amber-200",
                },
                {
                  cat: "링크 (5개)",
                  items: "내부 링크 수, 외부 링크 수, nofollow 링크 수, Hreflang, OG/Twitter Card 소셜 메타",
                  color: "bg-rose-50 border-rose-200",
                },
                {
                  cat: "보안·성능 (5개)",
                  items: "HTTPS 적용 여부, HSTS 헤더, 로딩 속도(ms), 인라인 CSS 크기, 인라인 JS 크기",
                  color: "bg-green-50 border-green-200",
                },
              ].map(({ cat, items, color }) => (
                <div key={cat} className={`rounded-lg border p-4 ${color}`}>
                  <p className="font-semibold text-sm mb-1">{cat}</p>
                  <p className="text-xs text-muted-foreground">{items}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              각 카테고리는 독립적으로 채점되지 않습니다. 예를 들어 HTTPS가 미적용이면 보안 점수뿐
              아니라 구글 신뢰도 자체에 영향을 줍니다. 카테고리를 가로질러 연결된 항목을 함께
              개선할수록 전체 점수가 빠르게 올라갑니다.
            </p>
          </section>

          {/* h2-2 */}
          <section>
            <h2 className="text-xl font-bold mb-4">점수 해석 가이드</h2>
            <p className="mb-4">
              AI가 제시하는 종합 점수는 24개 핵심 항목의 통과 비율을 0~100점으로 환산한 값입니다.
              구간별 의미와 권장 행동을 참고하세요.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  range: "0 ~ 40점",
                  label: "시급 개선",
                  desc: "기초 요소 다수 누락. HTTPS, Title, H1, canonical을 우선 점검하세요.",
                  color: "border-red-300 bg-red-50",
                  textColor: "text-red-700",
                },
                {
                  range: "40 ~ 70점",
                  label: "중간 단계",
                  desc: "기본은 갖춰졌으나 개선 여지가 많습니다. AI 개선안 상위 5개를 목표로 수정하세요.",
                  color: "border-amber-300 bg-amber-50",
                  textColor: "text-amber-700",
                },
                {
                  range: "70 ~ 90점",
                  label: "양호",
                  desc: "대부분의 항목이 통과됩니다. 나머지 실패 항목을 개별 수정하면 상위 10%에 진입합니다.",
                  color: "border-teal-300 bg-teal-50",
                  textColor: "text-teal-700",
                },
                {
                  range: "90점+",
                  label: "우수",
                  desc: "기술적 최적화가 잘 되어 있습니다. 이제 콘텐츠 품질과 백링크에 집중하세요.",
                  color: "border-green-300 bg-green-50",
                  textColor: "text-green-700",
                },
              ].map(({ range, label, desc, color, textColor }) => (
                <div key={range} className={`rounded-lg border p-4 ${color}`}>
                  <p className={`text-lg font-bold ${textColor}`}>{range}</p>
                  <p className={`text-sm font-semibold ${textColor} mb-1`}>{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              점수는 절대적 지표가 아닙니다. 경쟁 페이지보다 높은 점수를 목표로 삼고, 주기적으로
              재검사해 개선 추이를 확인하는 것이 효과적입니다.
            </p>
          </section>

          {/* h2-3 */}
          <section>
            <h2 className="text-xl font-bold mb-4">자주 놓치는 5가지 온페이지 이슈</h2>
            <p className="mb-4">
              수십 개의 사이트를 진단한 결과, 다음 5가지 이슈가 가장 빈번하게 발견됩니다. 각 항목을
              반드시 확인하세요.
            </p>
            <ol className="space-y-4">
              <li className="rounded-lg border p-4">
                <p className="font-semibold mb-1">1. H1 태그 누락 또는 중복</p>
                <p className="text-muted-foreground">
                  H1은 페이지 주제를 검색엔진에 알리는 가장 중요한 신호입니다. 없거나 2개 이상이면
                  구글이 페이지 핵심 주제를 오해할 수 있습니다. 페이지당 H1은 반드시 1개, 핵심
                  키워드를 포함해 작성하세요.
                </p>
              </li>
              <li className="rounded-lg border p-4">
                <p className="font-semibold mb-1">2. Canonical 오설정</p>
                <p className="text-muted-foreground">
                  canonical이 없거나 잘못된 URL을 가리키면 중복 콘텐츠 페널티 위험이 있습니다.
                  특히 www·non-www, https·http, 트레일링 슬래시 혼재 시 반드시 canonical을
                  명시하세요.
                </p>
              </li>
              <li className="rounded-lg border p-4">
                <p className="font-semibold mb-1">3. Alt 없는 이미지</p>
                <p className="text-muted-foreground">
                  이미지 alt 속성은 스크린 리더 접근성뿐 아니라 이미지 검색 유입 경로이기도 합니다.
                  alt가 없으면 구글 이미지 검색에서 완전히 누락됩니다. 모든 콘텐츠 이미지에 키워드를
                  포함한 구체적인 alt를 작성하세요.
                </p>
              </li>
              <li className="rounded-lg border p-4">
                <p className="font-semibold mb-1">4. 내부 링크 부족</p>
                <p className="text-muted-foreground">
                  내부 링크가 없거나 매우 적으면 페이지 권위(PageRank)가 사이트 전체로 전달되지
                  않습니다. 연관 페이지로 3개 이상의 내부 링크를 연결하고, 앵커 텍스트에 키워드를
                  포함하세요.
                </p>
              </li>
              <li className="rounded-lg border p-4">
                <p className="font-semibold mb-1">5. 한글 Meta Description 60자 초과 잘림</p>
                <p className="text-muted-foreground">
                  구글 검색 결과에서 description은 약 160자(영문 기준)로 잘립니다. 한글은 2바이트
                  문자이므로 실질적으로 75~80자 내외에서 잘리는 경우가 많습니다. 핵심 메시지를
                  앞쪽 60자 이내에 배치하세요.
                </p>
              </li>
            </ol>
          </section>

          {/* h2-4 */}
          <section>
            <h2 className="text-xl font-bold mb-4">AI 진단 결과를 개발팀에 전달하는 법</h2>
            <p className="mb-4">
              AI 분석 결과를 개발팀 또는 에이전시에 공유할 때 다음 방법을 사용하면 수정 반영 속도가
              크게 빨라집니다.
            </p>

            <h3 className="font-semibold mb-2">1단계: 항목별 심각도 우선순위 정리</h3>
            <p className="mb-4">
              AI가 제시한 문제 항목을 심각도 순서(Critical &rarr; Warning &rarr; Notice)로 분류해
              스프레드시트에 정리하세요. &quot;보안 헤더 HSTS 미적용&quot;, &quot;H1 2개 중복&quot;
              처럼 항목명과 현재 값을 함께 적으면 개발자가 즉시 이해할 수 있습니다.
            </p>

            <h3 className="font-semibold mb-2">2단계: 코드 예시 포함</h3>
            <p className="mb-3">
              AI 개선안에는 코드 예시가 포함됩니다. 예를 들어 HSTS 헤더 추가 방법은 다음과 같습니다.
            </p>
            <div className="rounded-md bg-muted px-4 py-3 font-mono text-xs mb-4 overflow-x-auto">
              <span className="text-muted-foreground"># Nginx 예시</span>
              <br />
              add_header Strict-Transport-Security &quot;max-age=31536000; includeSubDomains&quot; always;
            </div>
            <p className="mb-4">
              코드 예시를 티켓에 그대로 첨부하면 개발자의 구현 시간을 단축할 수 있습니다.
            </p>

            <h3 className="font-semibold mb-2">3단계: 배포 우선순위 — 보안 &rarr; SEO &rarr; 콘텐츠</h3>
            <p>
              수정 배포 순서는 보안 관련 항목(HTTPS, HSTS, CSP)을 먼저 처리하고, 그 다음 SEO 직결
              항목(canonical, Title, H1, alt), 마지막으로 콘텐츠 개선(내부 링크, Description 최적화)
              순으로 진행합니다. 보안 이슈를 미해결 상태로 SEO 작업을 선행하면 보안 패치 이후
              재검사에서 점수가 달라질 수 있으므로, 순서를 지키는 것이 효율적입니다.
            </p>
          </section>
        </article>

        {/* FAQ */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-bold mb-6">온페이지 SEO 분석 FAQ</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-1">온페이지 SEO와 테크니컬 SEO의 차이는?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                온페이지 SEO는 페이지 내 콘텐츠·메타태그·헤딩 구조 등 콘텐츠 관련 요소를 최적화합니다.
                테크니컬 SEO는 크롤링·인덱싱·사이트 속도·보안 헤더처럼 기술 인프라를 다룹니다. 두 영역은
                겹치는 부분이 있으며, 이 도구는 양쪽을 모두 35개 항목으로 검사합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">점수만 올리면 구글 순위가 오르나요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                점수는 기술적 최적화 수준을 반영하는 지표이지, 순위를 보장하지는 않습니다. 콘텐츠 품질,
                백링크 획득, 사용자 만족도 등 외부 요소도 함께 개선해야 실질적인 순위 상승을 기대할 수
                있습니다. 점수는 &quot;기반&quot;을 닦는 작업입니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">SPA/CSR 사이트도 분석 가능한가요?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                분석은 가능하지만, JavaScript 실행 전 서버 응답 HTML 기준으로 검사합니다. React·Next.js
                CSR 사이트는 구글봇 1차 크롤링 시 보이는 것과 동일한 관점으로 결과가 표시됩니다. SSR 또는
                사전 렌더링 적용 여부를 함께 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">분석 후 가장 먼저 해야 할 일은?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI 개선안에서 심각도가 높은 항목을 우선 수정하세요. 보안(HTTPS, HSTS) 문제를 먼저
                처리하고, 메타태그·H1·canonical 등 SEO 직결 항목, 마지막으로 이미지 alt와 내부 링크
                순서로 진행하는 것을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">메타태그만 따로 보고 싶어요.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a href="/tools/meta-generator" className="underline text-foreground">
                  메타태그 분석기
                </a>
                를 사용하면 title, description, OG 태그, canonical 등을 전용으로 분석하고 AI 최적화
                추천문까지 받을 수 있습니다. 메타태그에 집중하고 싶다면 해당 도구를 사용하세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">전문 SEO 컨설팅이 필요해요.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                자동 분석 이상의 맞춤 전략이 필요하다면{" "}
                <a href="/contact" className="underline text-foreground">
                  SEO월드 전문가 컨설팅 문의
                </a>
                를 통해 사이트별 심층 진단을 받으실 수 있습니다. 온페이지 SEO부터 링크 빌딩까지
                종합 전략을 제안해 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* RelatedTools */}
        <div className="mt-12">
          <RelatedTools currentTool="onpage-audit" />
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-xl border bg-violet-50/60 px-6 py-8 text-center">
          <p className="text-lg font-bold mb-2">전문가 SEO 진단이 필요하신가요?</p>
          <p className="text-sm text-muted-foreground mb-4">
            AI 자동 분석 이상의 맞춤 SEO 전략이 필요하다면 SEO월드 전문가에게 문의하세요.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-md bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            무료 상담 문의하기
          </a>
        </div>
      </div>
    </>
  );
}
