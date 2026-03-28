import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { RobotsGeneratorForm } from "./robots-generator-form";

export const metadata: Metadata = {
  title: "Robots.txt 생성기 — 검색엔진 크롤러 제어 무료 도구",
  description: "robots.txt 파일을 간편하게 생성하세요. Googlebot, Bingbot, GPTBot 등 22개 크롤러별 허용/차단 규칙을 설정하고 다운로드할 수 있습니다.",
  openGraph: {
    title: "Robots.txt 생성기 | SEO월드",
    description: "검색엔진 크롤러 차단/허용 규칙을 설정하고 robots.txt를 무료로 생성하세요.",
  },
  alternates: { canonical: "/tools/robots-generator" },
};

export default function RobotsGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Robots.txt 생성기</h1>
        <p className="mt-1 text-lg text-muted-foreground">검색엔진 크롤러 접근 제어 도구</p>
        <p className="mt-1 text-sm text-muted-foreground">
          크롤러별 허용/차단 규칙을 설정하고 robots.txt 파일을 생성합니다. 프리셋으로 빠르게 시작할 수 있습니다.
        </p>
      </div>

      {/* 상단 카드 — robots.txt 소개 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">robots.txt란?</h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              robots.txt는 웹사이트 루트에 위치하는 텍스트 파일로,
              검색엔진 크롤러에게 어떤 페이지를 크롤링할 수 있고 어떤 페이지를 차단할지 알려줍니다.
              구글, 네이버, 빙 등 모든 검색엔진이 이 파일을 우선적으로 확인합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-green-900 mb-2">구글 SEO에 미치는 영향</h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              올바른 robots.txt는 구글봇의 크롤링 예산(Crawl Budget)을 최적화합니다.
              불필요한 페이지(관리자 페이지, 검색 결과 페이지 등)의 크롤링을 차단하면
              구글이 중요한 페이지에 더 집중하여 구글 상위노출에 유리합니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">이 도구의 이점</h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              22개 주요 크롤러(Googlebot, Bingbot, GPTBot, ClaudeBot 등)를 체크박스로 선택하고,
              Allow/Disallow 규칙을 직관적으로 설정할 수 있습니다.
              4개 프리셋(모두 허용, 표준, 엄격, 모두 차단)으로 빠르게 시작하세요.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 도구 본체 */}
      <RobotsGeneratorForm />

      {/* 하단 SEO 콘텐츠 */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">robots.txt 가이드</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">robots.txt는 어디에 업로드하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              웹사이트의 루트 디렉토리에 위치해야 합니다. 예를 들어 example.com이라면
              example.com/robots.txt 경로에서 접근할 수 있어야 합니다.
              FTP 또는 호스팅 파일 관리자를 통해 업로드하면 됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">robots.txt로 페이지를 완전히 숨길 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              아닙니다. robots.txt는 크롤링을 차단할 뿐, 인덱싱을 막지는 않습니다.
              다른 사이트에서 링크된 페이지는 여전히 검색 결과에 나타날 수 있습니다.
              완전한 차단을 원하면 noindex 메타 태그를 함께 사용하세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">AI 크롤러는 왜 차단하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              GPTBot, ClaudeBot 등의 AI 크롤러는 웹사이트 콘텐츠를 학습 데이터로 수집합니다.
              사이트 콘텐츠가 AI 학습에 사용되는 것을 원하지 않는다면 이러한 크롤러를 차단할 수 있습니다.
              구글 검색 순위에는 영향을 주지 않습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Sitemap 경로를 robots.txt에 포함해야 하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              권장됩니다. robots.txt에 Sitemap: https://example.com/sitemap.xml을 추가하면
              검색엔진이 사이트맵을 자동으로 발견할 수 있습니다.
              Google Search Console에 별도로 제출하는 것과 병행하면 더 효과적입니다.
            </p>
          <div>
            <h3 className="text-sm font-semibold mb-1">사이트가 구글에 안뜨는데 robots.txt 때문일 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              네, 사이트가 구글에 안뜨는 이유 중 하나가 robots.txt 설정 오류입니다.
              Disallow: / 규칙이 Googlebot에 적용되어 있으면 전체 사이트 크롤링이 차단됩니다.
              크롤링 문제가 의심된다면 먼저 robots.txt를 확인하고, 필요한 페이지가 차단되어 있지 않은지 점검하세요.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
