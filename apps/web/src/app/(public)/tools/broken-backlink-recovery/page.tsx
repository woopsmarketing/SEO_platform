import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BrokenBacklinkRecoveryForm } from "./broken-backlink-recovery-form";
import { RelatedTools } from "@/components/related-tools";

export const metadata: Metadata = {
  title: "깨진 백링크 복구 도구 — 404 백링크 찾기 & 링크 에퀴티 회수",
  description:
    "도메인을 입력하면 404·410 응답하는 깨진 백링크를 자동으로 찾아냅니다. 301 리디렉트·콘텐츠 복원·소유자 연락 등 상황별 복구 전략을 제시합니다. 링크 에퀴티를 놓치지 마세요.",
  openGraph: {
    title: "깨진 백링크 복구 도구 | SEO월드",
    description:
      "404 백링크를 찾아 링크 에퀴티를 회수하세요. 무료 깨진 백링크 복구 도구.",
  },
  alternates: { canonical: "/tools/broken-backlink-recovery" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "깨진 백링크 복구 도구",
  description:
    "도메인의 404·410 깨진 백링크를 탐지하고 복구 전략을 제시하는 무료 SEO 도구",
  url: "https://seoworld.co.kr/tools/broken-backlink-recovery",
  inLanguage: "ko",
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "깨진 백링크 복구 도구",
  applicationCategory: "WebApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  url: "https://seoworld.co.kr/tools/broken-backlink-recovery",
  description:
    "백링크 중 404·410 응답을 반환하는 깨진 링크를 탐지하고 상황별 복구 방법을 제공합니다.",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "깨진 백링크 복구 도구 사용 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "도메인 입력",
      text: "복구할 내 도메인을 입력하고 '깨진 링크 찾기'를 클릭합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "404 백링크 확인",
      text: "소스 URL·깨진 타겟 URL·상태 코드 목록을 테이블로 확인합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "복구 전략 적용",
      text: "301 리디렉트·콘텐츠 복원·소유자 연락 중 상황에 맞는 방법을 선택해 즉시 조치합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "깨진 백링크가 왜 SEO에 악영향인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "외부 사이트가 링크를 보내도 목적지 URL이 404를 반환하면 링크 에퀴티가 전달되지 않습니다. Google은 404 페이지에 전달된 링크 신호를 무효 처리하며, 크롤러가 반복 방문해 크롤 예산을 낭비합니다. 사용자가 깨진 링크를 클릭하면 즉시 이탈해 브랜드 신뢰도도 하락합니다.",
      },
    },
    {
      "@type": "Question",
      name: "깨진 백링크는 얼마나 자주 점검해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "월 1회 정기 점검을 권장합니다. URL 구조 변경, 플랫폼 마이그레이션, 대규모 콘텐츠 정리 이후에는 즉시 점검하세요. Google Search Console의 404 보고서와 병행해 2주 간격으로 확인하면 더욱 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "301 리디렉트와 410 중 어떤 걸 써야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "대체 URL이 있다면 301 리디렉트를 사용하세요. 링크 에퀴티의 90% 이상이 전달됩니다. 콘텐츠를 영구 삭제하고 대체 URL도 없다면 410(Gone)을 반환해 Google이 빠르게 인덱스에서 제거하도록 유도합니다.",
      },
    },
    {
      "@type": "Question",
      name: "404가 많은 경쟁사 도메인에서 백링크를 가져올 수도 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 가능합니다. 경쟁사의 깨진 백링크를 분석해 링크 원천에 내 콘텐츠를 대안으로 제안하는 깨진 링크 빌딩 전략입니다. 백링크 갭 분석 도구(/tools/backlink-gap)를 활용하면 경쟁사와 내 사이트의 백링크 차이를 비교할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "전체 백링크 품질을 한눈에 보고 싶어요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "깨진 링크 외에 전체 백링크 프로필(도메인 수, 앵커 텍스트 분포, 팔로우 여부 등)을 확인하려면 백링크 분석 도구(/tools/backlink-checker)를 사용하세요. 두 도구를 병행하면 링크 전략을 더 입체적으로 수립할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "수십 개 이상의 깨진 백링크를 대량으로 복구해야 합니다.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "리디렉트 맵 작성, 서버 설정 일괄 수정, 소유자 아웃리치 이메일 발송 등 대규모 복구 작업은 전문가의 도움이 효과적입니다. SEO월드 전문가 상담(/contact)을 통해 맞춤 복구 플랜을 받아보세요.",
      },
    },
  ],
};

export default function BrokenBacklinkRecoveryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
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
          <h1 className="text-3xl font-bold">깨진 백링크 복구 도구</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            404 백링크를 찾아 링크 에퀴티를 회수하세요
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            도메인을 입력하면 백링크 중 404·410으로 응답하는 깨진 링크를 자동
            탐지하고, 301 리디렉트·콘텐츠 복원·소유자 연락 등 상황별 복구
            전략을 제시합니다.
          </p>
        </div>

        {/* Info cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Card className="border-red-100 bg-red-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-red-900">
                링크 에퀴티 소실
              </h2>
              <p className="text-xs leading-relaxed text-red-800/80">
                외부 사이트가 내 사이트를 링크해도 목적지 URL이 404를 반환하면
                그 링크 신호는 Google에 전달되지 않습니다. 쌓아온 백링크
                자산이 소리 없이 사라집니다.
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-blue-900">
                자동 탐지 &amp; 복구 전략
              </h2>
              <p className="text-xs leading-relaxed text-blue-800/80">
                도메인 입력 한 번으로 상위 백링크 타겟 50개의 상태 코드를
                일괄 확인합니다. 깨진 링크별로 적합한 복구 방법을 즉시
                확인하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/50">
            <CardContent className="pb-5 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-green-900">
                죽은 링크 복구 이력 저장
              </h2>
              <p className="text-xs leading-relaxed text-green-800/80">
                로그인 사용자는 점검 이력이 자동 저장됩니다. 이전 결과와
                비교해 복구 진행 상황을 추적하고 월별 백링크 점검을 체계적으로
                관리하세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* HowTo */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">사용 방법</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            <li className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="text-sm font-medium">도메인 입력</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  복구할 내 도메인을 입력하고 &lsquo;깨진 링크 찾기&rsquo;를
                  클릭합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <div>
                <p className="text-sm font-medium">404 백링크 확인</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  소스 URL·깨진 타겟 URL·상태 코드 목록을 테이블로 확인합니다.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              <div>
                <p className="text-sm font-medium">복구 전략 적용</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  301 리디렉트·콘텐츠 복원·소유자 연락 중 상황에 맞는 방법을
                  선택해 즉시 조치합니다.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Form */}
        <BrokenBacklinkRecoveryForm />

        {/* Guide article */}
        <article className="tools-prose mt-16 space-y-10 border-t pt-12">
          <section>
            <h2 className="mb-3 text-xl font-bold">
              깨진 백링크가 SEO에 미치는 3가지 손실
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                백링크는 Google이 페이지 권위를 평가하는 핵심 신호입니다.
                외부 사이트가 내 URL을 링크할 때 그 URL이 정상적으로 응답해야만
                링크 에퀴티(PageRank 신호)가 실제로 전달됩니다. 목적지가
                404·410을 반환하면 Google은 해당 링크를 사실상 무효로 처리합니다.
                즉, 링크를 받고도 순위 향상 효과를 전혀 누리지 못하는 셈입니다.
              </p>
              <p>
                두 번째 손실은 사용자 이탈입니다. 외부 사이트 방문자가 링크를
                클릭했을 때 404 페이지를 만나면 즉시 뒤로 가기를 누릅니다. 잠재
                고객이 내 사이트에 도달하기 전에 이탈하는 것이므로 트래픽과
                전환 모두 손실됩니다. 브랜드 신뢰도 역시 하락합니다.
              </p>
              <p>
                세 번째는 크롤 예산 낭비입니다. Googlebot은 도메인에 할당된
                크롤 예산 내에서 페이지를 방문합니다. 깨진 URL을 반복적으로
                크롤하는 데 예산이 소모되면 정작 순위를 올려야 할 핵심 페이지의
                크롤 빈도가 줄어듭니다. 콘텐츠 업데이트가 빠르게 반영되지
                않는 원인이 되기도 합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              깨진 백링크 복구 우선순위 매기기
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                깨진 백링크가 여러 개라면 모두 동시에 처리하기보다 우선순위를
                정해 순차적으로 복구하는 것이 효율적입니다. 가장 중요한 기준은
                링크 소스 사이트의 도메인 권위(DA/DR)입니다. 권위 높은 사이트에서
                오는 깨진 링크를 먼저 복구하면 가장 큰 링크 에퀴티를 빠르게
                회수할 수 있습니다.
              </p>
              <p>
                두 번째 기준은 주제 관련성입니다. 내 사이트 주제와 밀접한
                소스 사이트의 링크는 그렇지 않은 링크보다 Google이 더 높이
                평가합니다. 관련성 높은 링크가 깨진 경우 복구 우선도를
                높게 설정하세요.
              </p>
              <p>
                세 번째는 앵커 텍스트 품질입니다. 타겟 키워드가 포함된 앵커
                텍스트로 연결된 링크는 복구 시 키워드 랭킹에 직접 기여합니다.
                이 세 가지 기준을 조합해 스프레드시트로 점수화하면 팀 단위
                복구 작업에서도 일관된 판단이 가능합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">
              상황별 복구 전략 4가지
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">첫 번째, 301 영구 리디렉트.</strong>{" "}
                깨진 URL과 주제가 비슷한 현재 운영 중인 페이지가 있다면
                301 리디렉트가 가장 빠른 해결책입니다. Next.js 프로젝트의 경우
                next.config.mjs 의 redirects() 배열에 추가하면 됩니다.
                301은 링크 에퀴티의 90% 이상을 목적지로 전달합니다.
              </p>
              <p>
                <strong className="text-foreground">두 번째, 원본 URL 복원.</strong>{" "}
                페이지가 실수로 삭제되거나 URL slug가 변경된 경우 원래 URL을
                그대로 복원하는 것이 가장 이상적입니다. CMS 백업이나 데이터베이스
                이력이 있다면 원문을 그대로 재퍼블리시하고, 없다면 Wayback Machine
                에서 아카이빙된 콘텐츠를 참고해 재작성합니다.
              </p>
              <p>
                <strong className="text-foreground">세 번째, 콘텐츠 이전.</strong>{" "}
                구조 변경이나 도메인 이전으로 URL 체계 자체가 달라진 경우,
                이전 URL 패턴에서 새 URL 패턴으로의 리디렉트 맵을 작성해
                일괄 적용합니다. 예를 들어 /blog/[id]에서 /posts/[slug]로
                구조가 바뀌었다면 모든 이전 ID를 새 slug로 매핑하는 규칙을
                서버 설정에 추가합니다.
              </p>
              <p>
                <strong className="text-foreground">네 번째, 소유자에게 직접 연락.</strong>{" "}
                링크 소스 사이트 운영자에게 새 URL로 링크를 업데이트해 달라고
                요청하는 방법입니다. 응답률은 낮지만 성공하면 리디렉트 없이
                직접 링크로 전환되어 에퀴티 손실이 전혀 없습니다. 요청 이메일에는
                기존 링크 URL·새 URL·링크 교체로 얻는 독자 이점을 명확히
                기술하세요.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">예방 체크리스트</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                가장 효과적인 깨진 백링크 관리는 사전 예방입니다. URL을 변경할
                때마다 리디렉트 맵을 즉시 작성하는 습관이 핵심입니다. 엑셀이나
                Notion에 &ldquo;이전 URL &rarr; 새 URL&rdquo; 형식으로 기록하고 배포와 동시에
                서버 설정에 적용하세요. 히스토리가 쌓이면 미래의 재구조화
                작업도 훨씬 수월해집니다.
              </p>
              <p>
                콘텐츠를 삭제할 때는 slug 재사용을 피하세요. 한 번 사용한
                slug를 다른 콘텐츠에 재사용하면 기존 백링크가 전혀 다른 페이지로
                연결되어 관련성이 떨어지고 Google이 혼동할 수 있습니다.
                삭제한 slug는 가급적 비워두거나 적절한 주제의 페이지로
                영구 리디렉트 처리합니다.
              </p>
              <p>
                자동화 점검 체계도 갖추는 것이 좋습니다. Google Search Console의
                &ldquo;적용 범위&rdquo; 리포트에서 404 오류를 월 1회 확인하고, 본 도구를
                활용한 백링크 상태 점검을 같은 주기로 수행하세요. 사이트 규모가
                크다면 Screaming Frog 또는 Ahrefs의 알림 기능을 설정해 신규
                404 발생 시 즉시 통보받는 환경을 구축하면 복구 골든타임을
                놓치지 않을 수 있습니다.
              </p>
            </div>
          </section>
        </article>

        {/* FAQ */}
        <section className="mt-12 border-t pt-10">
          <h2 className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                깨진 백링크가 왜 SEO에 악영향인가요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                404를 반환하는 URL로 보내진 링크는 링크 에퀴티가 전달되지
                않아 순위 향상 효과가 사라집니다. 사용자 이탈과 크롤
                예산 낭비까지 이어져 SEO 전반에 부정적 영향을 미칩니다.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                얼마나 자주 점검해야 하나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                월 1회 정기 점검을 권장합니다. URL 변경·플랫폼 마이그레이션
                이후에는 즉시 점검하세요. Google Search Console의 404 보고서와
                병행하면 더욱 정확합니다.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                301 리디렉트와 410 중 어떤 걸 써야 하나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                대체 URL이 있으면 301 리디렉트를 사용해 링크 에퀴티를
                보존하세요. 영구 삭제하고 대체 URL도 없다면 410(Gone)을
                반환해 Google이 빠르게 인덱스에서 제거하도록 유도합니다.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                404가 많은 경쟁사 도메인에서 백링크를 가져올 수 있나요?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                네, &lsquo;깨진 링크 빌딩&rsquo; 전략이 가능합니다.{" "}
                <Link
                  href="/tools/backlink-gap"
                  className="text-blue-700 hover:underline"
                >
                  백링크 갭 분석 도구
                </Link>
                를 함께 활용하면 경쟁사가 받고 있지만 내 사이트에는 없는
                링크 기회를 발굴할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                전체 백링크 품질을 보고 싶어요.
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                깨진 링크 외에 도메인 수·앵커 텍스트·팔로우 여부 등 전체
                백링크 프로필을 확인하려면{" "}
                <Link
                  href="/tools/backlink-checker"
                  className="text-blue-700 hover:underline"
                >
                  백링크 분석 도구
                </Link>
                를 사용하세요. 두 도구를 병행하면 링크 전략을 입체적으로
                수립할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold">
                대량 복구 작업이 필요합니다.
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                리디렉트 맵 작성, 서버 설정 일괄 수정, 소유자 아웃리치 등
                대규모 작업은 전문가의 도움이 효과적입니다.{" "}
                <Link
                  href="/contact"
                  className="text-blue-700 hover:underline"
                >
                  SEO월드 전문가 상담
                </Link>
                을 통해 맞춤 복구 플랜을 받아보세요.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <div className="mt-12">
          <RelatedTools currentTool="broken-backlink-recovery" />
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border bg-muted/40 px-6 py-8 text-center">
          <p className="text-base font-semibold">
            깨진 백링크 복구부터 링크 빌딩 전략까지 전문가와 함께하세요
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            직접 처리가 어렵거나 대규모 백링크 정리가 필요하다면 SEO월드
            전문가에게 문의하세요.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            무료 상담 신청
          </Link>
        </div>
      </div>
    </>
  );
}
