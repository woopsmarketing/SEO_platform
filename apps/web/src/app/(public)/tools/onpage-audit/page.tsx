import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { AuditForm } from "./audit-form";

export const metadata: Metadata = {
  title: "온페이지 SEO 분석 — 웹사이트 내부최적화 무료 진단",
  description: "무료 SEO 분석 도구로 테크니컬 SEO와 온페이지 요소를 사이트 진단합니다. URL을 입력하면 35개 항목을 자동 검사하고 AI가 점수와 개선 방안을 제시합니다.",
  openGraph: {
    title: "온페이지 SEO 분석 | SEO월드",
    description: "AI가 분석하는 무료 온페이지 SEO 진단. URL만 입력하면 35개 항목 즉시 검사.",
  },
  alternates: { canonical: "/tools/onpage-audit" },
};

export default function OnpageAuditPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">온페이지 SEO 분석</h1>
        <p className="mt-1 text-lg text-muted-foreground">웹사이트 내부최적화 진단 도구</p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 입력하면 35개 SEO 항목을 자동 검사하고, AI가 종합적으로 분석하여 점수와 개선 방안을 제시합니다.
        </p>
      </div>

      {/* SEO 콘텐츠 — 온페이지 SEO 중요성 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-violet-50/50 border-violet-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-violet-900 mb-2">온페이지 SEO란?</h2>
            <p className="text-xs leading-relaxed text-violet-800/80">
              온페이지 SEO는 웹사이트 내부 요소를 최적화하여 검색엔진 순위를 높이는 기술 SEO 작업입니다.
              메타태그 점검, 헤딩 구조, 이미지 alt 태그, 내부링크 구조, 페이지 속도 등
              검색엔진이 페이지를 이해하고 평가하는 데 사용하는 모든 요소를 포함합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-teal-50/50 border-teal-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-teal-900 mb-2">이 도구의 이점</h2>
            <p className="text-xs leading-relaxed text-teal-800/80">
              URL 하나만 입력하면 35개 항목을 자동으로 검사합니다.
              HTTPS, 로딩 속도, 메타태그, 헤딩 구조, 이미지, 링크, 구조화 데이터, 보안 헤더까지
              전문 SEO 감사 도구 수준의 분석을 무료로 제공합니다.
              AI가 점수를 매기고 코드 예시와 함께 구체적인 개선 방안을 제시합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50/50 border-rose-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-rose-900 mb-2">검사 항목 35개</h2>
            <p className="text-xs leading-relaxed text-rose-800/80">
              상태코드, HTTPS, 로딩 속도, 텍스트 비율, URL 구조 최적화,
              Title, Description, Canonical, Keywords, H1~H3 구조,
              이미지 alt, 내부/외부 링크, Viewport, Gzip, HSTS,
              OG 태그, Twitter Card, JSON-LD, Favicon 등을 한번에 검사합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <AuditForm />

      {/* 하단 SEO 콘텐츠 — FAQ */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">온페이지 SEO 최적화 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">온페이지 SEO와 오프페이지 SEO의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              온페이지 SEO는 웹사이트 내부에서 직접 제어할 수 있는 요소(메타태그, 콘텐츠, 페이지 속도 등)를 최적화하는 것이고,
              오프페이지 SEO는 외부 요소(백링크, 소셜 시그널, 브랜드 언급 등)를 통해 권위를 높이는 것입니다.
              온페이지 SEO가 기본이 되어야 오프페이지 SEO 효과도 극대화됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">페이지 로딩 속도가 SEO에 미치는 영향은?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google은 Core Web Vitals를 랭킹 요소로 사용합니다.
              페이지 로딩이 3초를 넘으면 이탈률이 급격히 증가하며,
              모바일 사용자의 53%는 3초 이내에 로드되지 않는 페이지를 떠납니다.
              이미지 최적화, Gzip 압축, 캐시 설정으로 속도를 개선할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">H1 태그는 왜 하나만 사용해야 하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              H1 태그는 페이지의 주제를 검색엔진에 알려주는 가장 중요한 헤딩입니다.
              하나의 페이지에 H1이 여러 개 있으면 검색엔진이 페이지의 핵심 주제를 판단하기 어렵습니다.
              H1은 1개만 사용하고, 하위 주제는 H2, H3로 계층적으로 구성하는 것이 좋습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">구조화 데이터(JSON-LD)는 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              구조화 데이터는 검색엔진이 페이지 내용을 더 정확하게 이해할 수 있도록 하는 표준 형식입니다.
              FAQ, 리뷰, 제품 정보 등을 JSON-LD로 마크업하면 Google 검색결과에서
              리치 스니펫(별점, FAQ 등)으로 노출되어 클릭률이 크게 향상됩니다.
            </p>
          <div>
            <h3 className="text-sm font-semibold mb-1">사이트 크롤링 문제는 어떻게 진단하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              크롤링 문제는 검색엔진이 페이지를 제대로 수집하지 못해 색인 문제로 이어지는 주요 원인입니다.
              robots.txt 점검으로 크롤러 차단 여부를 확인하고, sitemap 점검으로 모든 페이지가 등록되어 있는지 확인하세요.
              SEO월드의 온페이지 분석 도구는 이러한 테크니컬 SEO 항목을 자동으로 검사합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">코어 웹 바이탈이 SEO에 미치는 영향은?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              코어 웹 바이탈(Core Web Vitals)은 Google이 페이지 경험을 평가하는 핵심 지표입니다.
              LCP(최대 콘텐츠 렌더링), FID(첫 입력 지연), CLS(레이아웃 이동) 세 가지 항목으로 구성되며,
              이 지표가 좋을수록 구글 검색 순위에서 유리합니다. 홈페이지 SEO 진단 시 반드시 확인해야 할 항목입니다.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
