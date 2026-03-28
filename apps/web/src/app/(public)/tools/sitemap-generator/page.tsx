import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { SitemapGeneratorForm } from "./sitemap-generator-form";

export const metadata: Metadata = {
  title: "사이트맵 생성기 — sitemap.xml 무료 자동 생성 도구",
  description: "URL을 입력하면 sitemap 점검과 자동 크롤링으로 sitemap.xml을 생성합니다. 구글 서치콘솔에 사이트맵 제출하여 색인 확인까지 한번에 해결하세요.",
  openGraph: {
    title: "사이트맵 생성기 | SEO월드",
    description: "URL 자동 크롤링으로 sitemap.xml을 무료로 생성하세요. Google Search Console 제출용.",
  },
  alternates: { canonical: "/tools/sitemap-generator" },
};

export default function SitemapGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">사이트맵 생성기</h1>
        <p className="mt-1 text-lg text-muted-foreground">sitemap.xml 자동 생성 도구</p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 입력하면 사이트를 자동 크롤링하여 검색엔진에 제출할 수 있는 sitemap.xml을 생성합니다.
        </p>
      </div>

      {/* 상단 카드 — 사이트맵 소개 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-indigo-900 mb-2">sitemap.xml이란?</h2>
            <p className="text-xs leading-relaxed text-indigo-800/80">
              sitemap.xml은 웹사이트의 모든 페이지 목록을 검색엔진에 알려주는 XML 파일입니다.
              각 페이지의 URL, 마지막 수정 날짜, 변경 빈도, 우선순위 정보를 포함하며,
              정기적인 sitemap 점검으로 구글봇이 사이트 구조를 효율적으로 파악하도록 돕는 것이 중요합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">구글 상위노출에 미치는 영향</h2>
            <p className="text-xs leading-relaxed text-emerald-800/80">
              구글 서치콘솔에 사이트맵을 제출하면 구글이 새로운 페이지를 더 빠르게 발견하고 색인 확인이 수월해집니다.
              특히 신규 사이트, 페이지가 많은 사이트, 내부 링크가 부족한 페이지에서
              사이트맵 제출로 구글 상위노출까지의 시간을 크게 단축할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-orange-900 mb-2">이 도구의 이점</h2>
            <p className="text-xs leading-relaxed text-orange-800/80">
              URL 하나만 입력하면 사이트의 robots.txt와 기존 sitemap을 분석한 후
              내부 링크를 자동으로 크롤링하여 페이지 목록을 수집합니다.
              구글 서치콘솔 제출용으로 changefreq와 priority를 개별 편집하고 즉시 다운로드할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <SitemapGeneratorForm />

      {/* 하단 SEO 콘텐츠 */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">사이트맵 가이드</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">sitemap.xml은 꼭 필요한가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              필수는 아니지만, Google이 공식적으로 권장합니다.
              특히 500개 이상의 페이지가 있거나, 신규 사이트이거나,
              내부 링크 구조가 복잡한 경우에는 사이트맵이 인덱싱 속도를 크게 향상시킵니다.
              구글 상위노출을 목표로 한다면 반드시 제출하는 것이 좋습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Google Search Console에 어떻게 제출하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              생성된 sitemap.xml을 웹사이트 루트에 업로드한 후,
              Google Search Console &gt; 색인 &gt; 사이트맵에서
              sitemap.xml URL을 입력하고 제출하면 됩니다.
              추가로 robots.txt에 Sitemap 경로를 명시하면 자동으로 발견됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">changefreq와 priority는 무엇인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              changefreq는 페이지가 변경되는 빈도를 검색엔진에 알려주는 힌트입니다.
              (daily, weekly, monthly 등)
              priority는 사이트 내에서 해당 페이지의 상대적 중요도를 0.0~1.0으로 표시합니다.
              Google은 이 값을 참고만 하며 강제하지는 않습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">사이트맵을 얼마나 자주 업데이트해야 하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              새로운 페이지가 추가되거나 기존 페이지가 삭제될 때마다 업데이트하는 것이 이상적입니다.
              CMS를 사용한다면 자동 생성을 설정하고,
              정적 사이트라면 월 1회 이상 갱신하여 구글이 최신 상태를 파악하도록 하세요.
            </p>
          <div>
            <h3 className="text-sm font-semibold mb-1">페이지가 색인이 안되는 이유는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              페이지가 색인이 안되는 이유는 다양합니다. noindex 태그 설정, robots.txt에 의한 크롤링 차단,
              사이트맵 미등록, 중복 콘텐츠 문제 등이 대표적입니다. 구글 서치콘솔의 색인 확인 기능으로
              어떤 페이지가 색인에서 제외되었는지 확인하고, 사이트맵을 제출하여 색인을 요청할 수 있습니다.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
