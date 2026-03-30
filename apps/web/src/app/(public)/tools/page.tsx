import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "무료 SEO 도구 — 구글 상위노출을 위한 무료 분석 도구 모음",
  description: "메타태그 분석, 온페이지 SEO 진단, robots.txt 생성, sitemap.xml 생성까지. 구글 상위노출에 필요한 SEO 도구를 무료로 사용하세요.",
  openGraph: {
    title: "무료 SEO 도구 모음 | SEO월드",
    description: "구글 상위노출에 필요한 SEO 분석 도구를 무료로 사용하세요. 회원가입 없이 URL만 입력하면 즉시 분석.",
  },
  alternates: { canonical: "/tools" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${SITE_NAME} SEO 도구`,
  description: "구글 상위노출을 위한 무료 SEO 분석 도구 모음",
  url: `${SITE_URL}/tools`,
  applicationCategory: "SEO Tool",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      {/* 헤더 */}
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold">무료 SEO 분석 도구</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          무료 SEO 분석과 무료 SEO 툴로 구글 상위노출에 필요한 요소를 점검하세요.
          회원가입 없이 URL만 입력하면 무료 사이트 진단 결과를 즉시 확인할 수 있습니다.
        </p>
      </div>

      {/* 카테고리별 도구 */}
      <div className="space-y-12">
        {/* 온페이지 분석 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold">온페이지 분석 도구</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">웹사이트 내부 SEO 요소를 검사하고 최적화하는 도구입니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard href="/tools/onpage-audit" icon="📊" title="온페이지 SEO 분석" desc="테크니컬 SEO부터 메타태그까지 35개 항목을 자동 검사하고 AI가 점수와 개선안을 제시합니다." />
            <ToolCard href="/tools/meta-generator" icon="🏷️" title="메타태그 분석기" desc="URL을 입력하면 메타태그를 파싱하여 점검하고, 제목 태그 최적화와 메타 설명 최적화를 추천합니다." />
          </div>
        </div>

        {/* 색인 도구 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🗂️</span>
            <h2 className="text-xl font-bold">색인 도구</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">검색엔진이 사이트를 올바르게 크롤링하고 색인하도록 돕는 도구입니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard href="/tools/robots-generator" icon="🤖" title="Robots.txt 생성기" desc="22개 크롤러별 허용/차단 규칙을 설정하여 크롤링 문제와 색인 문제를 예방합니다." />
            <ToolCard href="/tools/sitemap-generator" icon="🗺️" title="사이트맵 생성기" desc="URL을 입력하면 사이트를 크롤링하여 구글 서치콘솔 제출용 sitemap.xml을 생성합니다." />
          </div>
        </div>

        {/* 백링크 분석 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <h2 className="text-xl font-bold">백링크 분석 도구</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">사이트의 백링크 프로필을 분석하여 오프페이지 SEO를 점검하는 도구입니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard href="/tools/backlink-checker" icon="🔗" title="백링크 분석기" desc="도메인의 백링크 목록, 참조 도메인, doFollow 비율, 앵커 텍스트를 분석합니다." />
          </div>
        </div>

        {/* 도메인 도구 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h2 className="text-xl font-bold">도메인 도구</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">도메인의 SEO 지표와 WHOIS 정보를 확인하는 도구입니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard href="/tools/domain-checker" icon="🌐" title="도메인 분석기" desc="도메인 점수, WHOIS 정보, DNS 데이터를 확인합니다." ready={false} />
          </div>
        </div>

        {/* 키워드 분석 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h2 className="text-xl font-bold">키워드 분석 도구</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">타겟 키워드의 검색량, 경쟁도를 분석하고 관련 키워드를 추천하는 도구입니다.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard href="/tools/keyword-research" icon="🔍" title="키워드 조사" desc="키워드의 월간 검색량, CPC, 경쟁도를 조회합니다." ready={false} />
            <ToolCard href="/tools/keyword-related" icon="💡" title="관련 키워드" desc="입력한 키워드와 관련된 롱테일 키워드를 추천합니다." ready={false} />
          </div>
        </div>
      </div>

      {/* 도구별 상세 소개 */}
      <div className="mt-20 space-y-16">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">메타태그 분석기</h2>
            <p className="mt-1 text-sm text-blue-600 font-medium">구글 검색 결과의 첫인상을 결정하는 도구</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              메타태그는 구글 검색 결과에 직접 노출되는 제목(Title)과 설명(Description)입니다.
              URL을 입력하면 현재 설정된 30개 이상의 메타태그 항목을 자동으로 파싱하고,
              무료 사이트 진단을 통해 구글 상위노출에 최적화된 추천안을 제시합니다.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>Title, Description, OG, Twitter Card 등 30+ 항목 분석</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>현재 vs 추천 구글 검색 미리보기 비교</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>한글/영문 사이트 자동 감지 및 기준 전환</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>최적화된 메타태그 코드 복사 기능</li>
            </ul>
            <div className="mt-5">
              <Link href="/tools/meta-generator"><Button size="sm">메타태그 분석하기</Button></Link>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">온페이지 SEO 분석</h2>
            <p className="mt-1 text-sm text-blue-600 font-medium">웹사이트 내부 최적화를 35개 항목으로 진단</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              구글 상위노출의 기본은 온페이지 SEO입니다.
              URL 하나만 입력하면 HTTPS, 로딩 속도, 메타태그, 헤딩 구조, 이미지 최적화,
              내부/외부 링크, 구조화 데이터, 보안 헤더까지 35개 항목을 자동으로 검사합니다.
              점수와 함께 코드 예시가 포함된 구체적인 개선 방안을 제시합니다.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>35개 SEO 항목 자동 검사 및 점수 산출</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>코드 예시가 포함된 구체적 개선안</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>Next.js, Nuxt.js 등 프레임워크 특성 반영</li>
              <li className="flex gap-2"><span className="text-green-600 shrink-0">✔</span>SPA/CSR 사이트 감지 및 SSR 권장 안내</li>
            </ul>
            <div className="mt-5">
              <Link href="/tools/onpage-audit"><Button size="sm">온페이지 SEO 분석하기</Button></Link>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Robots.txt 생성기</h2>
            <p className="mt-1 text-sm text-blue-600 font-medium">검색엔진 크롤러의 접근을 제어하는 도구</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              robots.txt는 검색엔진 크롤러에게 어떤 페이지를 크롤링할 수 있고 어떤 페이지는 차단할지 알려주는 파일입니다.
              22개 주요 크롤러(Googlebot, Bingbot, GPTBot 등)를 선택하고
              허용/차단 규칙을 설정하면 즉시 robots.txt 파일을 생성합니다.
              구글 SEO에서 불필요한 페이지가 인덱싱되는 것을 방지하여 크롤링 예산을 최적화할 수 있습니다.
            </p>
            <div className="mt-5">
              <Link href="/tools/robots-generator"><Button size="sm">Robots.txt 생성하기</Button></Link>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">사이트맵 생성기</h2>
            <p className="mt-1 text-sm text-blue-600 font-medium">검색엔진에 모든 페이지를 알려주는 도구</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              sitemap.xml은 검색엔진에게 웹사이트의 모든 페이지 목록을 제공하는 파일입니다.
              URL을 입력하면 사이트를 자동으로 크롤링하여 내부 페이지를 수집하고,
              Google Search Console에 바로 제출할 수 있는 sitemap.xml을 생성합니다.
              구글이 새로운 페이지를 더 빠르게 발견하고 인덱싱하도록 도와 구글 상위노출에 기여합니다.
            </p>
            <div className="mt-5">
              <Link href="/tools/sitemap-generator"><Button size="sm">사이트맵 생성하기</Button></Link>
            </div>
          </div>
        </div>
      </div>

      {/* SEO 도구를 사용해야 하는 이유 */}
      <div className="mt-20 border-t pt-16">
        <h2 className="text-2xl font-bold text-center">왜 SEO 분석 툴을 사용해야 할까요?</h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          구글 상위노출을 위해서는 웹사이트의 SEO 상태를 정확히 파악하는 것이 첫걸음입니다.
          SEO월드는 무료 SEO 점검 사이트로서 전문 SEO 분석 툴 수준의 진단을 누구나 쉽게 사용할 수 있도록 제공합니다.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border p-6 text-center">
            <div className="text-3xl mb-3">&#x26A1;</div>
            <h3 className="font-semibold">즉시 진단</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              URL만 입력하면 수 초 내에 무료 SEO 점검이 완료됩니다.
              복잡한 설정이나 설치 없이 브라우저에서 바로 사용 가능합니다.
            </p>
          </div>
          <div className="rounded-xl border p-6 text-center">
            <div className="text-3xl mb-3">&#x1F4CA;</div>
            <h3 className="font-semibold">구체적 개선안</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              단순한 점수가 아니라, 코드 예시와 함께 구체적으로 무엇을 어떻게 수정해야 하는지
              실행 가능한 개선 방안을 제시합니다.
            </p>
          </div>
          <div className="rounded-xl border p-6 text-center">
            <div className="text-3xl mb-3">&#x1F310;</div>
            <h3 className="font-semibold">구글 기준 분석</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Google Search Central 공식 가이드를 기준으로 분석합니다.
              한글/영문 사이트를 자동 감지하여 적절한 기준을 적용합니다.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 border-t pt-16">
        <h2 className="text-2xl font-bold text-center">무료 SEO 도구 FAQ</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          <div>
            <h3 className="text-sm font-semibold mb-1">정말 무료인가요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              네, SEO월드의 모든 분석 도구는 100% 무료입니다. 회원가입도 필요 없으며
              사용 횟수 제한 없이 원하는 만큼 분석할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">분석 결과를 어떻게 활용하나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              각 도구의 분석 결과에는 구체적인 개선 방안이 포함되어 있습니다.
              제시된 코드를 그대로 복사하여 웹사이트에 적용하면 됩니다.
              전문적인 도움이 필요하면 SEO 서비스를 문의하세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">어떤 사이트든 분석할 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              공개적으로 접속 가능한 웹사이트라면 모두 분석할 수 있습니다.
              JavaScript로 렌더링되는 SPA 사이트도 분석하며, SSR 권장 안내를 함께 제공합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">경쟁사 사이트도 분석할 수 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              네, URL만 있으면 어떤 사이트든 분석 가능합니다.
              경쟁사의 메타태그, SEO 구조, 구조화 데이터를 파악하여
              벤치마킹에 활용할 수 있습니다.
            </p>
          <div>
            <h3 className="text-sm font-semibold mb-1">사이트 진단 툴 추천이 있나요?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SEO월드의 온페이지 SEO 분석기는 35개 항목을 무료로 자동 검사하는 사이트 진단 툴입니다.
              메타태그 분석기, 사이트맵 생성기, robots.txt 생성기까지 함께 활용하면
              웹사이트의 SEO 상태를 종합적으로 점검할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">무료 SEO 점검 사이트와 유료 도구의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              유료 SEO 도구는 키워드 추적, 백링크 모니터링 등 장기적인 관리 기능을 제공합니다.
              하지만 온페이지 SEO 진단과 기본적인 기술 점검은 SEO월드 같은 무료 SEO 점검 사이트로도
              충분히 수행할 수 있습니다. 먼저 무료 도구로 현재 상태를 파악하는 것을 권장합니다.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ href, icon, title, desc, ready = true }: { href: string; icon: string; title: string; desc: string; ready?: boolean }) {
  const content = (
    <Card className={`h-full transition-all ${ready ? "hover:shadow-lg hover:-translate-y-1" : "opacity-50 cursor-not-allowed"}`}>
      <CardHeader className="pb-2">
        <div className="text-2xl">{icon}</div>
        <CardTitle className="text-base">
          {title}
          {!ready && <span className="ml-2 text-xs font-normal text-muted-foreground">(준비중)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );

  if (!ready) return <div>{content}</div>;
  return <Link href={href}>{content}</Link>;
}
