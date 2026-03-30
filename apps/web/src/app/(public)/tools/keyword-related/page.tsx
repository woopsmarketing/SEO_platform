import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedKeywordForm } from "./related-keyword-form";

export const metadata: Metadata = {
  title: "관련 키워드 찾기 — 무료 연관 검색어 · 롱테일 키워드 추천 도구",
  description:
    "키워드를 입력하면 구글 연관 검색어를 기반으로 관련 키워드와 롱테일 키워드를 추천합니다. SEO 콘텐츠 전략과 키워드 확장에 활용하세요.",
  openGraph: {
    title: "관련 키워드 찾기 | SEO월드",
    description: "구글 연관 검색어 기반 무료 관련 키워드 추천 도구.",
  },
  alternates: { canonical: "/tools/keyword-related" },
};

export default function KeywordRelatedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">관련 키워드 찾기</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          구글 연관 검색어 기반 키워드 추천 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          키워드를 입력하면 구글 자동완성 데이터를 확장 분석하여 관련 키워드와 롱테일 키워드를 추천합니다.
          실제 사용자들이 검색하는 키워드를 기반으로 콘텐츠 전략을 수립하세요.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-purple-900 mb-2">관련 키워드란?</h2>
            <p className="text-xs leading-relaxed text-purple-800/80">
              관련 키워드는 사용자가 특정 주제를 검색할 때 함께 검색하는 연관 검색어입니다.
              구글 자동완성 데이터를 분석하면 사용자의 실제 검색 패턴과 의도를 파악할 수 있습니다.
              이를 통해 콘텐츠에 포함해야 할 키워드를 발견하고 SEO 전략을 강화할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-50/50 border-cyan-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-cyan-900 mb-2">롱테일 키워드의 가치</h2>
            <p className="text-xs leading-relaxed text-cyan-800/80">
              롱테일 키워드는 3단어 이상의 구체적인 검색어로, 경쟁이 낮고 전환율이 높습니다.
              예를 들어 &ldquo;백링크&rdquo;보다 &ldquo;백링크 확인하는 방법&rdquo;이 더 구체적인 검색 의도를 가지며,
              이런 키워드를 타겟팅하면 초기 SEO에서 빠른 성과를 얻을 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">이 도구의 이점</h2>
            <p className="text-xs leading-relaxed text-emerald-800/80">
              구글 자동완성 데이터를 한글 음절별로 확장 분석하여 하나의 시드 키워드에서
              수십 개의 관련 키워드를 찾아냅니다. 실제 사용자들이 구글에서 검색하는 키워드이므로
              검색 수요가 확인된 키워드만 추천합니다. 완전 무료이며 사용 횟수 제한이 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <RelatedKeywordForm />

      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">관련 키워드 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">어떤 데이터를 기반으로 추천하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              구글 자동완성(Google Autocomplete) 데이터를 기반으로 합니다.
              이는 실제 사용자들이 구글에서 검색할 때 나타나는 추천 검색어이므로,
              실제 검색 수요가 있는 키워드만 결과에 포함됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">한글 키워드도 잘 되나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              네, 한글 키워드에 최적화되어 있습니다. 한글 음절별로 확장 검색하여
              영문 키워드와 동일한 수준의 풍부한 관련 키워드를 추천합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">결과에서 &ldquo;포함 키워드&rdquo;와 &ldquo;연관 키워드&rdquo;의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              포함 키워드는 입력한 키워드가 그대로 포함된 확장 키워드입니다 (예: &ldquo;백링크 확인&rdquo;).
              연관 키워드는 입력 키워드가 직접 포함되지 않지만 관련성이 높은 키워드입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">추천된 키워드를 어떻게 활용하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              블로그 글 주제 선정, 메타태그 키워드 설정, 콘텐츠 소제목(H2, H3) 구성,
              FAQ 섹션 작성 등에 활용할 수 있습니다. 경쟁이 낮은 롱테일 키워드부터
              타겟팅하면 SEO 초기 성과를 빠르게 달성할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
