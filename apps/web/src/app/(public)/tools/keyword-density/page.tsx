import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordDensityForm } from "./keyword-density-form";

export const metadata: Metadata = {
  title: "사이트 키워드 분석기 — 웹페이지 키워드 밀도 확인 도구",
  description:
    "URL과 타겟 키워드를 입력하면 웹페이지에서 해당 키워드가 얼마나 사용되었는지, 제목과 설명에 포함되어 있는지 분석합니다. 키워드 최적화와 SEO 콘텐츠 점검에 활용하세요.",
  openGraph: {
    title: "사이트 키워드 분석기 — 웹페이지 키워드 밀도 확인 | SEO월드",
    description:
      "URL과 타겟 키워드를 입력하면 키워드 밀도, 사용 빈도, 제목/설명 포함 여부를 분석합니다.",
  },
  alternates: { canonical: "/tools/keyword-density" },
};

export default function KeywordDensityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">사이트 키워드 분석기</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          웹페이지 키워드 밀도 확인 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL과 타겟 키워드를 입력하면 웹페이지에서 해당 키워드가 얼마나 사용되었는지,
          제목과 설명에 포함되어 있는지 분석합니다. 키워드 밀도 검사와 키워드 최적화,
          SEO 콘텐츠 점검에 활용하세요.
        </p>
      </div>

      {/* SEO 콘텐츠 카드 3개 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-orange-900 mb-2">
              키워드 밀도 분석이란?
            </h2>
            <p className="text-xs leading-relaxed text-orange-800/80">
              웹페이지에서 특정 키워드가 전체 콘텐츠 대비 얼마나 사용되었는지
              비율로 분석하는 것입니다. 키워드 밀도가 너무 낮으면 검색엔진이
              해당 키워드와 페이지의 관련성을 파악하기 어렵고, 너무 높으면
              키워드 스터핑으로 판단되어 페널티를 받을 수 있습니다.
              일반적으로 1~3%가 적절한 키워드 밀도로 권장됩니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              SEO 콘텐츠 최적화
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              키워드가 제목(title), 메타 설명(description)에 포함되어 있는지
              확인하는 것이 중요합니다. 본문에서의 키워드 사용 빈도뿐 아니라
              자연스러운 배치가 핵심입니다. 키워드 분석 도구를 활용하면
              온페이지 키워드 최적화 상태를 한눈에 확인할 수 있으며,
              SEO 키워드 확인을 통해 콘텐츠 SEO를 개선할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">
              이 도구의 이점
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              URL과 키워드를 입력하면 해당 페이지의 키워드 사용 현황을 자동
              분석합니다. title/description 포함 여부, 키워드 사용 빈도,
              밀도 퍼센트를 한눈에 확인할 수 있습니다. SEO 키워드 확인과
              콘텐츠 SEO 점검에 최적화된 무료 키워드 밀도 검사 도구입니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <KeywordDensityForm />

      {/* 키워드 밀도 분석 가이드 */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-3">키워드 밀도 검사 방법</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          키워드 밀도 검사는 간단합니다. 위 키워드 분석 도구에 분석하고 싶은 URL과
          타겟 키워드를 입력하고 &ldquo;키워드 분석&rdquo; 버튼을 클릭하세요.
          몇 초 내에 해당 페이지의 키워드 사용 빈도와 밀도를 확인할 수 있습니다.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">1&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">URL과 키워드 입력</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              키워드 밀도를 확인할 웹페이지 URL과 타겟 키워드를 입력합니다.
              https:// 없이 도메인만 입력해도 자동으로 인식됩니다.
              내 사이트와 경쟁사 사이트 모두 키워드 분석이 가능합니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">2&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">키워드 밀도 결과 확인</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              페이지에서 발견된 모든 키워드의 사용 횟수, 밀도 퍼센트, 가중치를 확인합니다.
              제목과 메타 설명에 키워드가 포함되어 있는지도 한눈에 파악할 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <div className="text-2xl mb-3">3&#xFE0F;&#x20E3;</div>
            <h3 className="font-semibold text-sm mb-1">콘텐츠 최적화</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              키워드 밀도 검사 결과를 바탕으로 키워드 사용 빈도를 조절합니다.
              1~3% 범위를 유지하면서 자연스러운 키워드 배치를 목표로
              콘텐츠 SEO를 개선하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 키워드 밀도 최적화 팁 */}
      <div className="border-t pt-12">
        <h2 className="text-xl font-bold mb-3">키워드 밀도 최적화 팁</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          키워드 최적화는 단순히 키워드 사용 빈도를 높이는 것이 아닙니다.
          아래 핵심 전략을 참고하여 자연스러운 키워드 배치로 콘텐츠 SEO를 강화하세요.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">적절한 키워드 밀도 유지</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              키워드 밀도는 1~3%가 적절합니다. 3% 이상이면 키워드 스터핑으로
              판단될 위험이 있고, 1% 미만이면 검색엔진이 해당 키워드와의
              관련성을 인식하기 어렵습니다. 키워드 밀도 검사 도구로 정기적으로 확인하세요.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">제목과 메타 설명에 키워드 포함</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              타겟 키워드가 페이지 제목(title)과 메타 설명(description)에
              자연스럽게 포함되어야 합니다. 이는 검색엔진과 사용자 모두에게
              페이지의 주제를 명확히 전달하는 핵심 온페이지 키워드 전략입니다.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">동의어와 관련 키워드 활용</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              같은 키워드를 반복하는 대신, 동의어와 관련 키워드를 함께 사용하세요.
              Google은 LSI(Latent Semantic Indexing) 키워드를 통해 콘텐츠의
              전체적인 맥락을 이해합니다. 키워드 분석을 통해 관련 키워드를 파악하세요.
            </p>
          </div>
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-2">자연스러운 문장 구성</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              키워드 최적화의 핵심은 자연스러움입니다. 키워드를 억지로 넣는 것이 아니라,
              독자가 읽기에 자연스러운 문장 속에 키워드를 녹여야 합니다.
              사용자 경험과 SEO를 동시에 만족하는 콘텐츠가 상위 노출됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">키워드 밀도 분석 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">키워드 밀도란 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              키워드 밀도(Keyword Density)는 웹페이지 전체 콘텐츠에서 특정 키워드가
              차지하는 비율입니다. 예를 들어 1,000단어 글에서 키워드가 20번 등장하면
              키워드 밀도는 2%입니다. 적절한 키워드 밀도를 유지하면 검색엔진이
              페이지의 주제를 정확히 파악할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">적절한 키워드 밀도는 몇 퍼센트인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              일반적으로 1~3%가 적절한 키워드 밀도로 권장됩니다.
              3%를 초과하면 키워드 스터핑으로 판단될 수 있고,
              1% 미만이면 키워드 관련성이 약해질 수 있습니다.
              다만 콘텐츠의 자연스러움이 가장 중요하며, 숫자에만 집착하지 마세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">키워드 스터핑이란 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              키워드 스터핑(Keyword Stuffing)은 검색 순위를 높이기 위해 콘텐츠에
              키워드를 과도하게 반복 삽입하는 행위입니다. Google은 이를 스팸으로
              간주하여 페널티를 부과합니다. 키워드 밀도 검사를 통해
              스터핑 여부를 사전에 확인하고 예방할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">경쟁사 페이지의 키워드도 분석할 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              네, 공개적으로 접근 가능한 웹페이지라면 모두 분석할 수 있습니다.
              경쟁사가 어떤 키워드를 얼마나 사용하는지 파악하면
              효과적인 키워드 최적화 전략을 수립하는 데 큰 도움이 됩니다.
              SEO 키워드 확인을 통해 경쟁사 콘텐츠를 벤치마킹하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
