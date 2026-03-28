import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BacklinkForm } from "./backlink-form";

export const metadata: Metadata = {
  title: "백링크 분석기 — 무료 백링크 확인 및 조회 도구",
  description:
    "도메인을 입력하면 백링크 목록, doFollow/noFollow 비율, 참조 도메인 수, 앵커 텍스트를 분석합니다. 경쟁사 백링크를 확인하고 링크빌딩 전략을 수립하세요.",
  openGraph: {
    title: "백링크 분석기 | SEO월드",
    description:
      "도메인의 백링크 목록, 참조 도메인, doFollow 비율을 무료로 분석하세요.",
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
          무료 백링크 확인 및 조회 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          도메인을 입력하면 백링크 목록, doFollow/noFollow 비율, 참조 도메인 수,
          앵커 텍스트를 분석합니다. 경쟁사 백링크를 확인하고 링크빌딩 전략을
          수립하세요.
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
              백링크 확인은 다른 웹사이트에서 내 사이트로 연결된 외부링크를
              분석하는 과정입니다. 외부링크 분석을 통해 어떤 사이트가 내 콘텐츠를
              참조하는지, 링크의 품질은 어떤지, doFollow와 noFollow 비율은
              적절한지 파악할 수 있습니다. 정기적인 백링크 조회는 SEO 전략 수립의
              기본입니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              SEO에 미치는 영향
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              Google은 백링크를 페이지 권위를 평가하는 핵심 요소로 사용합니다.
              특히 doFollow 백링크는 링크 주스(Link Juice)를 전달하여 구글 순위에
              직접적인 영향을 줍니다. 다양한 참조 도메인에서 오는 고품질 백링크가
              많을수록 검색 순위가 높아집니다. 백링크 품질 확인은 SEO의 핵심
              작업입니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">
              이 도구의 이점
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              도메인만 입력하면 무료 백링크 확인이 가능합니다. 총 백링크 수,
              doFollow/noFollow 비율, 참조 도메인 수, 앵커 텍스트, 권위 점수까지
              한눈에 확인할 수 있습니다. 경쟁사 백링크 분석을 통해 경쟁사가 어떤
              사이트에서 링크를 받고 있는지 파악하고 링크빌딩 전략을 수립하세요.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <BacklinkForm />

      {/* 하단 SEO 콘텐츠 — FAQ */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">백링크 분석 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">
              백링크란 무엇인가요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              백링크(Backlink)는 다른 웹사이트에서 내 사이트로 연결되는
              외부링크입니다. 인바운드 링크(Inbound Link)라고도 합니다. 백링크
              조회를 통해 어떤 사이트가 내 콘텐츠를 참조하는지 확인할 수 있으며,
              사이트 백링크 확인은 SEO 현황을 파악하는 첫 번째 단계입니다.
              Google은 백링크를 다른 사이트의 &quot;추천&quot;으로 간주하여 검색
              순위를 결정하는 데 활용합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              doFollow와 noFollow의 차이는?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              doFollow 링크는 검색엔진에 &quot;이 링크를 따라가세요&quot;라고
              알려주며, 링크 주스(Link Juice)를 전달하여 SEO에 직접 기여합니다.
              noFollow 링크는 rel=&quot;nofollow&quot; 속성이 붙어 검색엔진에
              링크 주스를 전달하지 않습니다. 백링크 품질 확인 시 doFollow 비율이
              높을수록 SEO 효과가 크지만, 자연스러운 링크 프로필을 위해 noFollow
              링크도 적절히 혼합되어야 합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              참조 도메인이 중요한 이유는?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              참조도메인 확인이 중요한 이유는, 하나의 사이트에서 100개의 백링크를
              받는 것보다 100개의 서로 다른 사이트에서 각 1개씩 받는 것이 SEO에
              훨씬 효과적이기 때문입니다. Google은 다양한 도메인에서 오는
              백링크를 더 높이 평가합니다. 참조 도메인 수는 백링크의 다양성과
              자연스러움을 나타내는 핵심 지표입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              경쟁사 백링크를 어떻게 분석하나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              경쟁사 백링크 분석은 경쟁사의 도메인을 입력하여 어떤 사이트에서
              링크를 받고 있는지 확인하는 것입니다. 경쟁사가 링크를 받고 있는
              사이트에 내 콘텐츠도 소개할 수 있는 기회를 찾을 수 있습니다.
              이 도구에 경쟁사 도메인을 입력하면 백링크 목록, 앵커 텍스트,
              참조 도메인을 확인할 수 있어 효과적인 링크빌딩 전략을 수립할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
