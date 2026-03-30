import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BacklinkForm } from "./backlink-form";

export const metadata: Metadata = {
  title: "백링크 분석기 — 무료 백링크 확인 · 백링크 체크 · 백링크 조회 도구",
  description:
    "도메인을 입력하면 백링크 목록, doFollow/noFollow 비율, 참조 도메인 수, 앵커 텍스트를 무료로 분석합니다. 백링크 확인 방법을 모르더라도 URL만 입력하면 즉시 백링크 체크가 가능합니다.",
  openGraph: {
    title: "백링크 분석기 — 무료 백링크 체커 | SEO월드",
    description:
      "무료 백링크 확인 도구로 도메인의 백링크를 분석하세요. 경쟁사 백링크 분석부터 링크빌딩 전략까지.",
  },
  alternates: { canonical: "/tools/backlink-checker" },
};

export default function BacklinkCheckerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">백링크 분석기</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          무료 백링크 확인 및 백링크 체크 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          도메인을 입력하면 백링크 목록, doFollow/noFollow 비율, 참조 도메인 수, 앵커 텍스트를 무료로 분석합니다.
          백링크 확인 방법을 모르더라도 URL만 입력하면 즉시 백링크 조회 결과를 확인할 수 있습니다.
        </p>
      </div>

      {/* SEO 콘텐츠 카드 3개 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-rose-50/50 border-rose-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-rose-900 mb-2">
              백링크 분석이란?
            </h2>
            <p className="text-xs leading-relaxed text-rose-800/80">
              백링크 분석은 다른 웹사이트에서 내 사이트로 연결된 외부 링크를 체계적으로 조사하는 과정입니다.
              백링크 체크를 통해 어떤 사이트가 내 콘텐츠를 참조하고 있는지, 링크의 품질은 어떤지,
              doFollow와 noFollow 비율은 적절한지 파악할 수 있습니다.
              정기적인 백링크 확인은 검색엔진최적화 전략 수립의 기본이며,
              이 백링크 도구를 활용하면 별도의 SEO 전문 지식 없이도 누구나 쉽게 백링크 조회가 가능합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              백링크가 SEO에 미치는 영향
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              Google은 백링크를 페이지 권위를 평가하는 핵심 랭킹 요소로 사용합니다.
              고품질 doFollow 백링크는 링크 주스(Link Juice)를 전달하여 구글 상위노출에
              직접적인 영향을 줍니다. 다양한 참조 도메인에서 오는 자연스러운 백링크가
              많을수록 도메인 권위(DA)가 높아지고 검색 순위가 상승합니다.
              백링크 체커로 정기적으로 백링크 현황을 모니터링하면 SEO 성과를 효과적으로 관리할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">
              이 백링크 도구의 이점
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              도메인만 입력하면 무료로 백링크 확인이 가능한 백링크 체커입니다.
              총 백링크 수, doFollow/noFollow 비율, 참조 도메인 수, 앵커 텍스트,
              도메인 권위 점수까지 한눈에 파악할 수 있습니다.
              경쟁사 백링크 분석도 지원하여, 경쟁사가 어떤 사이트에서 백링크를 확보하고 있는지
              확인하고 효과적인 링크빌딩 전략을 수립할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <BacklinkForm />

      {/* 백링크 확인 방법 가이드 */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-3">백링크 확인 방법</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          백링크 확인 방법은 간단합니다. 위의 백링크 체커에 분석하고 싶은 도메인을 입력하고 &ldquo;백링크 분석&rdquo; 버튼을 클릭하세요.
          몇 초 내에 해당 도메인으로 연결된 모든 백링크 목록을 조회할 수 있습니다.
          내 사이트뿐 아니라 경쟁사의 도메인도 입력하여 경쟁사 백링크를 분석할 수 있습니다.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">1️⃣</div>
            <h3 className="font-semibold text-sm mb-1">도메인 입력</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              백링크 확인을 원하는 도메인을 입력합니다. https:// 없이 도메인만 입력해도 자동으로 인식됩니다.
              내 사이트와 경쟁사 사이트 모두 백링크 조회가 가능합니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">2️⃣</div>
            <h3 className="font-semibold text-sm mb-1">백링크 분석 결과 확인</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              총 백링크 수, doFollow 비율, 참조 도메인 수를 통계 카드로 확인합니다.
              아래 표에서 각 백링크의 소스 URL, 앵커 텍스트, 권위 점수, 링크 유형을 상세히 확인할 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">3️⃣</div>
            <h3 className="font-semibold text-sm mb-1">링크빌딩 전략 수립</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              백링크 체크 결과를 바탕으로 고품질 백링크를 확보할 수 있는 사이트를 찾습니다.
              경쟁사가 백링크를 받고 있는 사이트에 내 콘텐츠도 소개하는 것이 효과적인 링크빌딩 방법입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 백링크 분석 시 확인해야 할 핵심 지표 */}
      <div className="border-t pt-12">
        <h2 className="text-xl font-bold mb-3">백링크 분석 시 확인해야 할 핵심 지표</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          백링크 체크를 할 때 단순히 백링크 수만 보는 것이 아니라, 아래 핵심 지표들을 종합적으로 분석해야 합니다.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">doFollow / noFollow 비율</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              doFollow 백링크는 구글에 직접적인 SEO 신호를 전달합니다.
              일반적으로 doFollow 비율이 40~60% 정도면 자연스러운 백링크 프로필로 평가됩니다.
              doFollow가 90% 이상이면 오히려 인위적으로 보일 수 있으므로 주의가 필요합니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">참조 도메인 다양성</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              하나의 사이트에서 100개의 백링크를 받는 것보다 100개의 서로 다른 도메인에서
              각 1개씩 받는 것이 SEO에 훨씬 효과적입니다.
              참조 도메인의 다양성은 백링크의 자연스러움과 신뢰도를 나타내는 핵심 지표입니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">도메인 권위 점수 (Domain Authority)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              백링크를 보내는 사이트의 도메인 권위가 높을수록 더 큰 SEO 효과를 가집니다.
              DA 30 이상인 사이트에서 오는 백링크는 고품질로 분류되며,
              백링크 확인 시 domain_inlink_rank 점수를 참고하여 품질을 판단할 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">앵커 텍스트 분포</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              앵커 텍스트는 백링크에 사용된 클릭 가능한 텍스트입니다.
              브랜드명, URL, 키워드, 일반 텍스트가 자연스럽게 분포되어야 합니다.
              특정 키워드 앵커가 과도하면 구글 페널티의 원인이 될 수 있으므로
              백링크 분석 시 앵커 텍스트 분포를 반드시 확인하세요.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">백링크 분석 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">백링크란 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              백링크(Backlink)는 다른 웹사이트에서 내 사이트로 연결되는 외부 링크입니다.
              인바운드 링크(Inbound Link)라고도 합니다.
              백링크 조회를 통해 어떤 사이트가 내 콘텐츠를 참조하는지 확인할 수 있으며,
              Google은 백링크를 다른 사이트의 &ldquo;추천&rdquo;으로 간주하여
              검색 순위를 결정하는 핵심 요소로 활용합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">doFollow와 noFollow의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              doFollow 링크는 검색엔진에 &ldquo;이 링크를 따라가세요&rdquo;라고 알려주며,
              링크 주스를 전달하여 SEO에 직접 기여합니다.
              noFollow 링크는 링크 주스를 전달하지 않지만, 자연스러운 백링크 프로필을 위해
              적절히 혼합되어야 합니다.
              백링크 체커로 정기적으로 두 유형의 비율을 확인하는 것이 중요합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">무료 백링크 확인 도구와 유료 도구의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SEO월드의 백링크 분석기는 무료로 백링크 목록, 참조 도메인, doFollow 비율 등
              핵심 데이터를 제공합니다. Ahrefs, Moz 같은 유료 백링크 도구는 과거 이력 추적,
              경쟁사 비교 대시보드, 알림 기능 등 고급 기능을 추가로 제공합니다.
              기본적인 백링크 체크와 경쟁사 분석은 무료 백링크 도구로도 충분히 수행할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">경쟁사 백링크를 어떻게 분석하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              경쟁사 백링크 분석은 경쟁사의 도메인을 이 백링크 체커에 입력하는 것만으로 시작할 수 있습니다.
              경쟁사가 백링크를 받고 있는 사이트 목록을 확인하면,
              같은 사이트에 내 콘텐츠도 소개할 수 있는 링크빌딩 기회를 발견할 수 있습니다.
              백링크 확인 방법 중 가장 효과적인 전략 중 하나입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
