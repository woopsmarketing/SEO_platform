import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { MetaGeneratorForm } from "./meta-generator-form";

export const metadata: Metadata = {
  title: "메타태그 분석기 — 무료 메타태그 최적화 도구",
  description: "URL을 입력하면 현재 메타태그를 분석하고 SEO에 최적화된 제목, 설명, 키워드를 AI가 추천합니다. Google 검색 미리보기 포함.",
  openGraph: {
    title: "메타태그 분석기 | SEO월드",
    description: "URL만 입력하면 메타태그를 자동 분석하고 SEO 최적화 추천을 받으세요.",
  },
  alternates: { canonical: "/tools/meta-generator" },
};

export default function MetaGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">메타태그 분석 및 최적화</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          웹사이트 메타태그 진단 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 입력하면 현재 메타태그를 파싱하여 문제점을 진단하고, AI가 최적화된 제목, 설명, 키워드를 추천합니다.
        </p>
      </div>

      {/* SEO 콘텐츠 — 메타태그 중요성 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">메타태그가 중요한 이유</h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              메타태그는 검색엔진이 페이지 내용을 이해하는 첫 번째 단서입니다.
              Google은 title 태그를 검색결과 제목으로, description을 설명문으로 직접 사용합니다.
              잘 작성된 메타태그는 클릭률(CTR)을 최대 30% 이상 높일 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">이 도구의 이점</h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              URL 하나만 입력하면 30개 이상의 메타태그 항목을 자동으로 파싱합니다.
              현재 상태를 진단하고, AI가 Google 검색 가이드 기준에 맞는 최적화된 제목과 설명을 추천합니다.
              현재 vs 추천 Google 검색 미리보기를 나란히 비교할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">분석 항목</h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              Title, Description, Keywords, Canonical, Open Graph(title/desc/image),
              Twitter Card, 구조화 데이터(JSON-LD), Hreflang, Favicon, Lang 속성 등
              검색엔진 최적화에 필요한 모든 메타태그를 한눈에 확인합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <MetaGeneratorForm />

      {/* 하단 SEO 콘텐츠 — FAQ */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">메타태그 최적화 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">메타태그란 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              메타태그는 HTML의 &lt;head&gt; 영역에 위치하는 태그로, 검색엔진과 SNS 플랫폼에 페이지 정보를 전달합니다.
              대표적으로 title, meta description, Open Graph, canonical 등이 있으며,
              검색 결과에 직접 노출되는 요소이기 때문에 SEO에서 가장 기본적이면서 중요한 요소입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">title 태그의 적절한 길이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google은 검색 결과에서 약 600px 너비로 제목을 표시합니다.
              한글 기준 30~35자, 영문 기준 55~60자가 적절합니다.
              핵심 키워드를 앞쪽에 배치하고, 브랜드명은 끝에 추가하는 것이 효과적입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">meta description은 순위에 영향을 주나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google은 공식적으로 meta description을 랭킹 요소로 사용하지 않는다고 밝혔습니다.
              하지만 검색 결과에 표시되는 설명문은 클릭률에 직접적인 영향을 미치며,
              높은 CTR은 간접적으로 검색 순위 향상에 기여합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Open Graph 태그는 왜 필요한가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Open Graph(OG) 태그는 카카오톡, 페이스북, 트위터 등에서 링크를 공유할 때
              미리보기 제목, 설명, 이미지를 결정합니다.
              OG 태그가 없으면 SNS에서 콘텐츠가 매력적으로 보이지 않아 공유 효과가 떨어집니다.
            </p>
          <div>
            <h3 className="text-sm font-semibold mb-1">메타태그로 검색 노출을 늘리려면?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              검색노출을 늘리는 법의 핵심은 타겟 키워드를 title과 description에 자연스럽게 포함하는 것입니다.
              제목에는 핵심 키워드를 앞쪽에 배치하고, 설명에는 사용자의 검색 의도에 맞는 구체적인 내용을 담으세요.
              SEO 글쓰기 원칙을 메타태그에도 적용하면 클릭률과 검색 순위를 동시에 개선할 수 있습니다.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
