import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordForm } from "./keyword-form";

export const metadata: Metadata = {
  title:
    "키워드 분석 도구 — 무료 키워드 리서치 · 검색량 조회 · 경쟁도 확인",
  description:
    "키워드를 입력하면 관련 키워드 추천, 월간 검색량, CPC, 경쟁도를 분석합니다. 구글 키워드 분석으로 롱테일 키워드를 찾고 SEO 전략을 수립하세요.",
  openGraph: {
    title: "키워드 분석 도구 — 무료 키워드 리서치 | SEO월드",
    description:
      "관련 키워드 추천, 월간 검색량, CPC, 경쟁도를 무료로 분석합니다.",
  },
  alternates: { canonical: "/tools/keyword-research" },
};

export default function KeywordResearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">키워드 분석 도구</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          무료 키워드 리서치 및 검색량 조회 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          키워드를 입력하면 관련 키워드 추천, 월간 검색량, CPC, 경쟁도를
          분석합니다. 구글 키워드 분석으로 롱테일 키워드를 찾고 SEO 전략을
          수립하세요.
        </p>
      </div>

      {/* SEO 콘텐츠 카드 3개 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">
              키워드 리서치란?
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              키워드 분석은 사용자가 검색엔진에 입력하는 검색어를 체계적으로
              조사하는 과정입니다. 효과적인 키워드 리서치를 통해 타겟 고객이
              실제로 사용하는 검색어를 파악할 수 있습니다. SEO 키워드 찾는법의
              첫걸음은 시드 키워드를 중심으로 관련 키워드를 확장하고, 검색량과
              경쟁도를 분석하여 최적의 타겟 키워드를 선정하는 것입니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              검색량과 경쟁도의 중요성
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              키워드 검색량 조회를 통해 해당 키워드가 얼마나 자주 검색되는지
              파악할 수 있습니다. 키워드 경쟁도 확인은 해당 키워드로 상위노출이
              얼마나 어려운지를 나타냅니다. 키워드 난이도 확인 결과,
              검색량은 높지만 경쟁도가 낮은 키워드가 초기 SEO 전략에
              가장 효과적입니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">
              이 도구의 이점
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              무료 키워드 분석 도구로 키워드 추천과 관련 키워드 발굴이
              가능합니다. 시드 키워드를 입력하면 롱테일 키워드 찾기에 유용한
              수백 개의 관련 키워드를 제시하고, 각 키워드의 월간 검색량, CPC,
              경쟁도를 한눈에 비교할 수 있습니다. 검색량 높은 키워드를 빠르게
              발굴하여 콘텐츠 전략에 활용하세요.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <KeywordForm />

      {/* 키워드 분석 방법 가이드 */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-3">키워드 분석 방법</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          효과적인 키워드 분석은 3단계로 진행됩니다. 시드 키워드에서 시작하여
          데이터 기반으로 최적의 타겟 키워드를 선정하세요.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">1&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">시드 키워드 입력</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              분석하고 싶은 주제의 핵심 키워드를 입력합니다. 예를 들어
              &ldquo;SEO&rdquo;, &ldquo;다이어트&rdquo;, &ldquo;부동산&rdquo;
              등 비즈니스와 관련된 기본 키워드를 시작점으로 활용하세요.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">2&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">
              검색량 / CPC / 경쟁도 분석
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              각 관련 키워드의 월간 검색량, 클릭당 비용(CPC), 경쟁도를
              확인합니다. 검색량이 높고 경쟁도가 낮은 키워드가 SEO에
              가장 효율적입니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">3&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">타겟 키워드 선정</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              분석 결과를 바탕으로 콘텐츠에 사용할 타겟 키워드를 선정합니다.
              메인 키워드 1개와 서브 키워드 3~5개를 조합하여 SEO 전략을
              수립하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 효과적인 키워드 선정 기준 */}
      <div className="border-t pt-12">
        <h2 className="text-xl font-bold mb-3">
          효과적인 키워드 선정 기준
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          키워드를 선정할 때 아래 4가지 기준을 종합적으로 고려하면 SEO 성과를
          극대화할 수 있습니다.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">검색량 (Volume)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              월간 검색량이 높은 키워드를 선택하면 더 많은 트래픽을 확보할 수
              있습니다. 다만 검색량만 높고 전환이 낮은 키워드는 피하세요.
              업종과 규모에 맞는 적정 검색량을 기준으로 판단하는 것이
              중요합니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">
              경쟁도 (Competition)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Low 또는 Medium 경쟁도의 키워드가 초기 SEO에 적합합니다.
              경쟁도가 High인 키워드는 대형 사이트가 이미 상위를 차지하고
              있어 신규 사이트가 진입하기 어렵습니다. 단계적으로 경쟁도를
              높여가세요.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">CPC (클릭당 비용)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CPC는 광고주가 해당 키워드에 지불하는 금액으로, 상업적 가치를
              나타내는 지표입니다. CPC가 높은 키워드는 전환 가능성이 높아
              수익화에 유리합니다. SEO로 이런 키워드에서 상위노출되면 광고비
              없이 높은 가치의 트래픽을 확보할 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">
              롱테일 키워드 (Long-tail)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              3단어 이상으로 구성된 롱테일 키워드는 검색량은 적지만 전환율이
              높습니다. 예를 들어 &ldquo;SEO&rdquo;보다 &ldquo;중소기업 SEO
              컨설팅 비용&rdquo;이 구매 의도가 명확합니다. 롱테일 키워드를
              많이 확보하면 안정적인 유기 트래픽을 만들 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">키워드 분석 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">
              키워드 분석이 왜 중요한가요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              키워드 분석은 SEO 전략의 출발점입니다. 타겟 고객이 실제로
              검색하는 키워드를 알아야 그에 맞는 콘텐츠를 제작하고 검색엔진
              상위에 노출될 수 있습니다. 키워드 분석 없이 콘텐츠를 만들면
              아무도 검색하지 않는 주제에 시간을 낭비할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              롱테일 키워드란?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              롱테일 키워드는 3개 이상의 단어로 구성된 구체적인 검색어입니다.
              예를 들어 &ldquo;신발&rdquo;이 아닌 &ldquo;남성 런닝화
              추천 2024&rdquo;같은 키워드입니다. 검색량은 적지만 검색 의도가
              명확하여 전환율이 높고, 경쟁이 상대적으로 낮아 상위노출이
              쉽습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              CPC가 높은 키워드가 좋은 건가요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CPC(클릭당 비용)가 높다는 것은 광고주들이 해당 키워드에 높은
              가치를 부여한다는 의미입니다. 이는 해당 키워드의 상업적 가치와
              전환 가능성이 높다는 신호입니다. SEO로 이런 키워드에서
              상위노출되면 광고비 없이 높은 수익을 기대할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">
              경쟁도 Low인 키워드를 노려야 하나요?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              신규 사이트나 도메인 권위가 낮은 사이트는 경쟁도 Low 키워드부터
              공략하는 것이 효과적입니다. 빠르게 상위노출을 달성하여 트래픽과
              도메인 권위를 쌓은 뒤, 점차 경쟁도 Medium과 High 키워드로
              확장하는 전략이 장기적으로 가장 효율적입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
