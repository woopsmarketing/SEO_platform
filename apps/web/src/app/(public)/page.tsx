import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { homeTools } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/domains?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* ====== 1. Hero ====== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 py-24 md:py-32">
        {/* 배경 지구본 이미지 */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 800" className="absolute -right-40 -top-40 h-[700px] w-[700px] text-blue-300" fill="none">
            <circle cx="400" cy="400" r="350" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="400" cy="400" rx="150" ry="350" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="400" cy="400" rx="250" ry="350" stroke="currentColor" strokeWidth="0.8" />
            <line x1="50" y1="400" x2="750" y2="400" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="250" x2="700" y2="250" stroke="currentColor" strokeWidth="0.7" />
            <line x1="100" y1="550" x2="700" y2="550" stroke="currentColor" strokeWidth="0.7" />
            <line x1="150" y1="150" x2="650" y2="150" stroke="currentColor" strokeWidth="0.5" />
            <line x1="150" y1="650" x2="650" y2="650" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            SEO의 모든 것, <span className="text-cyan-400">한 곳에서</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-200 md:text-xl">
            무료 SEO 분석 도구로 웹사이트를 점검하고, 전문 SEO 서비스로 검색 순위를 높이세요.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/tools">
              <Button size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white sm:w-auto">
                무료 SEO 도구 사용하기
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full border-blue-400 text-blue-200 hover:bg-blue-800 sm:w-auto">
                서비스 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== 2. 무료 SEO 도구 카드 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">무료 SEO 분석 도구</h2>
            <p className="mt-2 text-muted-foreground">
              회원가입 없이 바로 사용할 수 있는 검색엔진 최적화 도구입니다.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="text-3xl">{tool.icon}</div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 3. 왜 SEO 도구가 필요한가 ====== */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">검색엔진 최적화, 왜 중요한가요?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                전체 웹 트래픽의 53%가 자연 검색(Organic Search)에서 발생합니다.
                검색 결과 1페이지에 노출되는 것만으로 클릭의 90% 이상을 차지하며,
                상위 3개 결과가 전체 클릭의 60%를 가져갑니다.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                SEO는 한 번 최적화하면 지속적으로 트래픽을 유입시키는 장기 자산입니다.
                광고비 없이도 타겟 고객에게 도달할 수 있는 가장 효율적인 마케팅 채널입니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-background border p-6 text-center">
                <p className="text-3xl font-bold text-primary">53%</p>
                <p className="mt-1 text-sm text-muted-foreground">웹 트래픽이 자연 검색에서 발생</p>
              </div>
              <div className="rounded-xl bg-background border p-6 text-center">
                <p className="text-3xl font-bold text-primary">90%</p>
                <p className="mt-1 text-sm text-muted-foreground">클릭이 검색 1페이지에서 발생</p>
              </div>
              <div className="rounded-xl bg-background border p-6 text-center">
                <p className="text-3xl font-bold text-primary">14.6%</p>
                <p className="mt-1 text-sm text-muted-foreground">SEO 리드 전환율 (광고 1.7%)</p>
              </div>
              <div className="rounded-xl bg-background border p-6 text-center">
                <p className="text-3xl font-bold text-primary">35+</p>
                <p className="mt-1 text-sm text-muted-foreground">항목을 분석하는 SEO 진단 도구</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 4. 온페이지 SEO 분석 소개 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3">
                {["메타태그 분석", "제목 구조 (H1~H3)", "이미지 Alt 태그", "내부/외부 링크",
                  "페이지 로딩 속도", "HTTPS 보안", "구조화 데이터", "Open Graph 태그",
                  "Gzip 압축", "모바일 뷰포트"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="text-green-600">&#x2714;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold">온페이지 SEO 분석</h2>
              <p className="mt-2 text-lg text-muted-foreground">웹사이트 내부 최적화를 한눈에 진단</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                URL 하나만 입력하면 35개 SEO 항목을 자동으로 검사합니다.
                메타태그, 헤딩 구조, 이미지, 링크, 보안 헤더, 구조화 데이터까지
                전문 SEO 감사 도구 수준의 분석을 무료로 제공합니다.
              </p>
              <div className="mt-6">
                <Link href="/tools/onpage-audit">
                  <Button>온페이지 SEO 분석하기</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 5. 메타태그 분석기 소개 ====== */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">메타태그 분석 및 최적화</h2>
              <p className="mt-2 text-lg text-muted-foreground">검색 결과에 보이는 첫인상을 개선하세요</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                메타태그는 Google 검색 결과에 직접 표시되는 제목과 설명입니다.
                잘 작성된 메타태그는 클릭률(CTR)을 최대 30% 높일 수 있습니다.
                URL을 입력하면 현재 메타태그를 분석하고, 최적화된 제목과 설명을 추천합니다.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&#x2192;</span>30개 이상의 메타태그 항목 자동 파싱</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&#x2192;</span>현재 vs 추천 Google 검색 미리보기 비교</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">&#x2192;</span>한글/영문 기준 자동 전환</li>
              </ul>
              <div className="mt-6">
                <Link href="/tools/meta-generator">
                  <Button variant="outline">메타태그 분석하기</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl border bg-background p-6">
              <p className="text-xs text-muted-foreground mb-3">Google 검색 미리보기 예시</p>
              <div className="rounded-lg border bg-white p-4 space-y-1">
                <p className="text-xs text-green-700">seoworld.co.kr</p>
                <p className="text-base text-blue-700 font-medium">SEO월드 — 무료 SEO 분석 도구</p>
                <p className="text-sm text-gray-600">무료 SEO 분석 도구로 메타태그, 온페이지 SEO, 사이트맵을 진단하세요...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 6. SEO 서비스 소개 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">전문 SEO 서비스</h2>
            <p className="mt-2 text-muted-foreground">
              도구만으로 부족할 때, 전문가에게 맡기세요.
            </p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* 백링크 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F517;</div>
                <CardTitle className="text-xl">백링크 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  고품질 백링크는 Google 랭킹의 핵심 요소입니다.
                  PBN, 게스트 포스트, 니치 에디팅 등 다양한 백링크 전략으로
                  도메인 권위(DA)를 높이고 검색 순위를 개선합니다.
                </p>
                <Link href="/services/backlinks">
                  <Button variant="outline" size="sm" className="w-full">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
            {/* 웹 디자인 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F3A8;</div>
                <CardTitle className="text-xl">웹 디자인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  SEO에 최적화된 웹사이트를 설계하고 제작합니다.
                  빠른 로딩 속도, 모바일 반응형, 구조화 데이터 적용까지
                  검색엔진과 사용자 모두를 만족시키는 웹사이트를 만듭니다.
                </p>
                <Link href="/services/web-design">
                  <Button variant="outline" size="sm" className="w-full">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
            {/* 프리미엄 도메인 */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F310;</div>
                <CardTitle className="text-xl">프리미엄 도메인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  좋은 도메인은 브랜드의 첫인상이자 SEO 자산입니다.
                  프리미엄 도메인 매입/매각 중개부터 도메인 가치 평가까지,
                  비즈니스에 맞는 최적의 도메인을 찾아드립니다.
                </p>
                <Link href="/services/domain-broker">
                  <Button variant="outline" size="sm" className="w-full">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ====== 7. 서비스 프로세스 ====== */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">서비스 진행 과정</h2>
          <p className="mt-2 text-center text-muted-foreground">간단한 4단계로 SEO 성과를 만듭니다.</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "무료 상담", desc: "현재 사이트 상태를 파악하고 목표를 설정합니다." },
              { step: "02", title: "전략 수립", desc: "키워드 분석, 경쟁사 조사를 기반으로 맞춤 전략을 제안합니다." },
              { step: "03", title: "실행", desc: "백링크 구축, 온페이지 최적화, 콘텐츠 전략을 실행합니다." },
              { step: "04", title: "성과 보고", desc: "투명한 리포트로 순위 변화와 트래픽 증가를 확인합니다." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 8. 숫자로 보는 SEO ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">숫자로 보는 SEO의 가치</h2>
          <p className="mt-2 text-muted-foreground">검색엔진 최적화가 비즈니스에 미치는 영향</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "5.6배", label: "SEO 투자 대비 평균 ROI", sub: "PPC 광고 대비" },
              { num: "68%", label: "온라인 경험이 검색으로 시작", sub: "BrightEdge 리서치" },
              { num: "0.63%", label: "2페이지 이후 클릭률", sub: "1페이지 28.5% 대비" },
              { num: "22개월", label: "SEO 효과가 지속되는 평균 기간", sub: "장기 자산 가치" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border bg-background p-6">
                <p className="text-3xl font-bold text-primary">{item.num}</p>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 9. SEO 체크리스트 ====== */}
      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">SEO 기본 체크리스트</h2>
              <p className="mt-2 text-muted-foreground">
                검색 순위를 높이기 위해 반드시 확인해야 할 항목들입니다.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "HTTPS 보안 인증서가 적용되어 있는가?",
                "페이지 제목(Title)에 핵심 키워드가 포함되어 있는가?",
                "메타 설명(Description)이 적절한 길이로 작성되어 있는가?",
                "H1 태그가 페이지당 1개만 사용되고 있는가?",
                "이미지에 alt 태그가 설정되어 있는가?",
                "모바일 반응형이 적용되어 있는가?",
                "페이지 로딩 속도가 3초 이내인가?",
                "canonical 태그로 정규 URL이 지정되어 있는가?",
                "sitemap.xml이 Google Search Console에 제출되어 있는가?",
                "구조화 데이터(JSON-LD)가 적용되어 있는가?",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-background border px-4 py-3">
                  <span className="shrink-0 mt-0.5 text-primary">&#x2610;</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== 10. FAQ ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">자주 묻는 질문</h2>
          <p className="mt-2 text-center text-muted-foreground">SEO에 대해 궁금한 점을 확인하세요.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { q: "SEO 효과는 얼마나 걸리나요?", a: "일반적으로 3~6개월 후부터 가시적인 순위 변화가 나타납니다. 경쟁 강도와 현재 사이트 상태에 따라 달라지며, 꾸준한 최적화가 핵심입니다." },
              { q: "백링크는 왜 중요한가요?", a: "백링크는 다른 웹사이트가 내 사이트를 추천하는 것과 같습니다. Google은 고품질 백링크를 가진 사이트를 더 신뢰하고 높은 순위를 부여합니다." },
              { q: "무료 도구만으로 SEO가 가능한가요?", a: "기본적인 온페이지 SEO는 무료 도구로 충분히 진단하고 개선할 수 있습니다. 하지만 백링크 구축, 경쟁 분석 등 오프페이지 SEO는 전문 서비스가 더 효과적입니다." },
              { q: "도메인 점수(DA)란 무엇인가요?", a: "Domain Authority(DA)는 Moz가 개발한 검색엔진 순위 예측 지표로, 0~100 점으로 웹사이트의 권위를 나타냅니다. DA가 높을수록 검색 결과에서 상위에 노출될 가능성이 높습니다." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border bg-background p-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 11. CTA ====== */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">SEO 전문 상담이 필요하신가요?</h2>
          <p className="mt-4 text-blue-200">
            백링크, 웹 디자인, 도메인 등 SEO 관련 모든 서비스를 문의하세요.
            무료 상담으로 시작할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/services">
              <Button size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white sm:w-auto">
                서비스 둘러보기
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline" size="lg" className="w-full border-blue-400 text-blue-200 hover:bg-blue-700 sm:w-auto">
                무료 도구 먼저 써보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== 12. SEO 분석 기준 (외부 링크) ====== */}
      <section className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-lg font-semibold mb-6 text-muted-foreground">SEO 분석 기준</h2>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-lg border p-5">
              <p className="text-sm font-medium mb-1">검색엔진 최적화 가이드</p>
              <p className="text-xs text-muted-foreground mb-2">Google의 공식 SEO 스타터 가이드를 기반으로 분석합니다.</p>
              <a
                href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Google Search Central &rarr;
              </a>
            </div>
            <div className="rounded-lg border p-5">
              <p className="text-sm font-medium mb-1">구조화 데이터</p>
              <p className="text-xs text-muted-foreground mb-2">JSON-LD 마크업으로 리치 스니펫 노출을 돕습니다.</p>
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Schema.org &rarr;
              </a>
            </div>
            <div className="rounded-lg border p-5">
              <p className="text-sm font-medium mb-1">웹 성능 지표</p>
              <p className="text-xs text-muted-foreground mb-2">Core Web Vitals 기준으로 페이지 속도를 평가합니다.</p>
              <a
                href="https://web.dev/articles/vitals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                web.dev &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
