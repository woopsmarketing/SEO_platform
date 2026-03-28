import Link from "next/link";
import Image from "next/image";
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
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format"
          alt="구글 SEO 분석 데이터 차트"
          fill
          className="object-cover opacity-[0.06]"
          priority
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-200">
            무료 SEO 분석 도구
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
            구글 상위노출을 위한<br />
            <span className="text-blue-600">SEO 분석과 백링크</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 leading-relaxed md:text-xl">
            URL만 입력하면 35개 SEO 항목을 자동 진단합니다.
            웹사이트 SEO 최적화에 필요한 메타태그 분석, 온페이지 SEO 점검, 사이트맵 생성까지 모두 무료로 제공합니다.
            백링크 서비스와 웹 디자인으로 구글 상위노출을 달성하세요.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/tools">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base px-8 sm:w-auto">
                무료 SEO 분석 시작하기
              </Button>
            </Link>
            <Link href="/services/backlinks">
              <Button size="lg" variant="outline" className="w-full text-base px-8 sm:w-auto">
                백링크 서비스 보기
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">회원가입 없이 바로 사용 가능 &middot; 완전 무료</p>
        </div>
      </section>

      {/* ====== 2. 신뢰 지표 ====== */}
      <section className="border-b bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">35+</p>
              <p className="text-xs text-muted-foreground">SEO 검사 항목</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">5개</p>
              <p className="text-xs text-muted-foreground">무료 분석 도구</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-muted-foreground">무료 사용</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">즉시</p>
              <p className="text-xs text-muted-foreground">분석 결과 확인</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 3. 무료 SEO 도구 카드 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">무료 SEO 분석 도구</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              사이트 SEO 진단부터 SEO 점검까지, 구글 상위노출에 필요한 요소를 무료 SEO 분석 툴로 확인하세요.
              회원가입 없이 URL만 입력하면 즉시 결과를 확인할 수 있습니다.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
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

      {/* ====== 4. 구글 SEO가 중요한 이유 ====== */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">검색엔진최적화, 왜 중요한가요?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                전체 웹 트래픽의 53%가 자연 검색에서 발생합니다.
                구글 검색 결과 1페이지에 노출되는 것만으로 클릭의 90% 이상을 차지하며,
                상위 3개 결과가 전체 클릭의 60%를 가져갑니다.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                웹사이트 SEO를 제대로 갖추면 광고비 없이도 지속적으로 타겟 고객을 유입시키는
                가장 효율적인 마케팅 전략이 됩니다.
                SEO 리드의 전환율은 14.6%로, 유료 광고(1.7%)보다 8배 이상 높습니다.
              </p>
              <div className="mt-6">
                <Link href="/tools/onpage-audit">
                  <Button>내 사이트 SEO 점수 확인하기</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-blue-600">53%</p>
                <p className="mt-1 text-sm text-muted-foreground">웹 트래픽이<br />자연 검색에서 발생</p>
              </div>
              <div className="rounded-xl bg-white border p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-blue-600">90%</p>
                <p className="mt-1 text-sm text-muted-foreground">클릭이 구글<br />1페이지에서 발생</p>
              </div>
              <div className="rounded-xl bg-white border p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-blue-600">14.6%</p>
                <p className="mt-1 text-sm text-muted-foreground">SEO 리드 전환율<br />(광고 1.7%)</p>
              </div>
              <div className="rounded-xl bg-white border p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-blue-600">5.6x</p>
                <p className="mt-1 text-sm text-muted-foreground">SEO 투자 대비<br />평균 ROI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 5. 온페이지 SEO 분석 상세 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-3">
                {["메타태그 분석", "제목 구조 (H1~H3)", "이미지 Alt 태그", "내부/외부 링크",
                  "페이지 로딩 속도", "HTTPS 보안 인증", "구조화 데이터 (JSON-LD)", "Open Graph 태그",
                  "Gzip/Brotli 압축", "모바일 반응형 뷰포트"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2.5 text-sm">
                    <span className="text-green-600 shrink-0">✔</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold">온페이지 SEO 분석으로<br />구글 상위노출 준비하기</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                구글 상위노출의 첫걸음은 웹사이트 내부 SEO 진단입니다.
                URL 하나만 입력하면 35개 SEO 항목을 자동으로 검사하고,
                점수와 함께 구체적인 개선 방법을 코드 예시와 함께 제시합니다.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                메타태그, 헤딩 구조, 이미지 최적화, 보안 헤더, 구조화 데이터까지
                검색엔진최적화에 영향을 미치는 모든 요소를 한번에 SEO 분석할 수 있는 무료 사이트 진단 도구입니다.
              </p>
              <div className="mt-6">
                <Link href="/tools/onpage-audit">
                  <Button size="lg">온페이지 SEO 분석하기</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 6. 메타태그 분석 상세 ====== */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">메타태그 분석 및 최적화</h2>
              <p className="mt-2 text-lg text-muted-foreground">구글 검색 결과의 첫인상을 결정하는 요소</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                메타태그는 구글 검색 결과에 직접 표시되는 제목과 설명입니다.
                잘 최적화된 메타태그는 클릭률(CTR)을 최대 30% 이상 높일 수 있으며,
                구글 상위노출에 필수적인 요소입니다.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">01</span>
                  <span>URL을 입력하면 30개 이상의 메타태그 항목을 자동으로 파싱합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">02</span>
                  <span>현재 메타태그의 문제점을 진단하고 구체적인 개선 방안을 제시합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">03</span>
                  <span>현재 vs 추천 구글 검색 미리보기를 나란히 비교할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">04</span>
                  <span>한글/영문 사이트를 자동 감지하여 적절한 글자 수 기준을 적용합니다.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/tools/meta-generator">
                  <Button variant="outline">메타태그 분석하기</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground mb-3">구글 검색 미리보기 예시</p>
              <div className="rounded-lg border p-4 space-y-1.5">
                <p className="text-xs text-green-700">seoworld.co.kr</p>
                <p className="text-base text-blue-700 font-medium leading-snug">SEO월드 — 구글 상위노출을 위한 무료 SEO 분석 도구</p>
                <p className="text-sm text-gray-600 leading-relaxed">무료 SEO 분석 도구로 메타태그, 온페이지 SEO, 사이트맵을 진단하세요. 백링크 서비스와 웹 디자인까지...</p>
              </div>
              <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-4 space-y-1.5">
                <p className="text-xs font-medium text-green-700 mb-1">최적화 후</p>
                <p className="text-xs text-green-700">seoworld.co.kr</p>
                <p className="text-base text-blue-700 font-medium leading-snug">구글 상위노출 SEO 분석 | 무료 백링크 진단 — SEO월드</p>
                <p className="text-sm text-gray-600 leading-relaxed">35개 항목 자동 검사로 구글 SEO를 진단하세요. 백링크, 메타태그, 온페이지 최적화를 한번에 분석합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 7. 백링크의 중요성 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">구글 상위노출의 핵심, 백링크</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            구글은 다른 웹사이트에서 내 사이트로 연결되는 링크(백링크)를 &ldquo;추천표&rdquo;로 간주합니다.
            고품질 백링크가 많을수록 도메인 권위(DA)가 높아지고, 구글 검색 결과에서 더 높은 순위를 차지합니다.
            하지만 저품질 백링크는 오히려 페널티를 받을 수 있으므로, 전문적인 백링크 전략이 필요합니다.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 text-left shadow-sm">
              <div className="text-2xl mb-3">&#x1F4C8;</div>
              <h3 className="font-semibold">도메인 권위 상승</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                고품질 백링크는 도메인 권위(DA)를 높입니다.
                DA가 높은 사이트는 구글에서 더 신뢰받아 상위노출 확률이 높아집니다.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-left shadow-sm">
              <div className="text-2xl mb-3">&#x1F310;</div>
              <h3 className="font-semibold">레퍼럴 트래픽</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                권위 있는 사이트에서의 백링크는 직접적인 방문자 유입을 만듭니다.
                검색 외 채널에서도 지속적인 트래픽을 확보할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border bg-white p-6 text-left shadow-sm">
              <div className="text-2xl mb-3">&#x1F50D;</div>
              <h3 className="font-semibold">인덱싱 가속</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                구글봇은 백링크를 따라 새로운 페이지를 발견합니다.
                백링크가 많을수록 구글이 내 사이트를 더 빨리, 더 자주 크롤링합니다.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/services/backlinks">
              <Button size="lg">백링크 서비스 자세히 보기</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== 8. SEO 서비스 3개 ====== */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">전문 SEO 컨설팅 및 서비스</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              무료 분석 도구로 현재 상태를 파악하고,
              온페이지부터 오프페이지 SEO까지 전문 서비스로 구글 상위노출을 달성하세요.
            </p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <Card className="border-2 hover:border-blue-400 transition-colors shadow-sm">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F517;</div>
                <CardTitle className="text-xl">백링크 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  고품질 백링크는 구글 상위노출의 핵심 요소입니다.
                  PBN, 게스트 포스트, 니치 에디팅 등 검증된 백링크 전략으로
                  도메인 권위(DA)를 높이고 구글 SEO 성과를 개선합니다.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>&#x2022; 고품질 PBN 네트워크 활용</li>
                  <li>&#x2022; DA/PA 기반 타겟 백링크</li>
                  <li>&#x2022; 투명한 성과 리포트 제공</li>
                </ul>
                <Link href="/services/backlinks">
                  <Button variant="outline" size="sm" className="w-full mt-2">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-blue-400 transition-colors shadow-sm">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F3A8;</div>
                <CardTitle className="text-xl">웹 디자인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  구글 SEO에 최적화된 웹사이트를 설계하고 제작합니다.
                  빠른 로딩 속도, 모바일 반응형, 구조화 데이터 적용까지
                  구글 상위노출에 유리한 웹사이트를 구축합니다.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>&#x2022; Core Web Vitals 최적화</li>
                  <li>&#x2022; 모바일 퍼스트 반응형 디자인</li>
                  <li>&#x2022; SEO 친화적 URL 구조</li>
                </ul>
                <Link href="/services/web-design">
                  <Button variant="outline" size="sm" className="w-full mt-2">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-blue-400 transition-colors shadow-sm">
              <CardHeader>
                <div className="text-3xl mb-2">&#x1F310;</div>
                <CardTitle className="text-xl">프리미엄 도메인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  좋은 도메인은 브랜드의 첫인상이자 SEO 자산입니다.
                  기존 DA가 높은 프리미엄 도메인은 구글 상위노출까지의 시간을
                  크게 단축시킬 수 있습니다.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>&#x2022; 프리미엄 도메인 매입/매각 중개</li>
                  <li>&#x2022; 도메인 가치 및 SEO 지표 분석</li>
                  <li>&#x2022; 비즈니스 맞춤 도메인 추천</li>
                </ul>
                <Link href="/services/domain-broker">
                  <Button variant="outline" size="sm" className="w-full mt-2">자세히 보기</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ====== 9. 서비스 프로세스 ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">구글 상위노출까지의 과정</h2>
          <p className="mt-3 text-center text-muted-foreground">4단계로 SEO 성과를 만듭니다.</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "SEO 진단", desc: "무료 분석 도구로 현재 사이트의 SEO 상태를 정확하게 파악합니다. 35개 항목을 자동 검사합니다." },
              { step: "02", title: "전략 수립", desc: "키워드 분석, 경쟁사 백링크 조사를 기반으로 구글 상위노출을 위한 맞춤 전략을 수립합니다." },
              { step: "03", title: "최적화 실행", desc: "온페이지 SEO 개선, 고품질 백링크 구축, 기술적 SEO 최적화를 체계적으로 실행합니다." },
              { step: "04", title: "성과 보고", desc: "투명한 리포트로 구글 검색 순위 변화, 트래픽 증가, 백링크 현황을 정기적으로 보고합니다." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 10. SEO 체크리스트 ====== */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">SEO 체크리스트 — 테크니컬 SEO 점검 항목</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                구글 상위노출을 위해 반드시 확인해야 할 테크니컬 SEO 핵심 항목들입니다.
                아래 SEO 체크리스트를 기준으로 내 사이트를 점검해보세요.
                SEO월드의 무료 분석 도구로 자동 검사할 수 있습니다.
              </p>
              <div className="mt-6">
                <Link href="/tools/onpage-audit">
                  <Button>자동으로 체크하기</Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                "HTTPS 보안 인증서가 적용되어 있는가?",
                "페이지 제목(Title)에 핵심 키워드가 포함되어 있는가?",
                "메타 설명(Description)이 한글 40~80자로 작성되어 있는가?",
                "H1 태그가 페이지당 1개만 사용되고 있는가?",
                "이미지에 alt 태그가 설정되어 있는가?",
                "모바일 반응형이 적용되어 있는가?",
                "페이지 로딩 속도가 3초 이내인가?",
                "canonical 태그로 정규 URL이 지정되어 있는가?",
                "sitemap.xml이 Google Search Console에 제출되어 있는가?",
                "구조화 데이터(JSON-LD)가 적용되어 있는가?",
                "고품질 백링크가 확보되어 있는가?",
                "내부 링크 구조가 논리적으로 연결되어 있는가?",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-white border px-4 py-2.5">
                  <span className="shrink-0 mt-0.5 text-blue-500">&#x2610;</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== 11. FAQ ====== */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">자주 묻는 질문</h2>
          <p className="mt-2 text-center text-muted-foreground">구글 SEO와 백링크에 대해 궁금한 점을 확인하세요.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                q: "구글 상위노출까지 얼마나 걸리나요?",
                a: "일반적으로 3~6개월 후부터 가시적인 순위 변화가 나타납니다. 키워드 경쟁 강도, 현재 사이트의 도메인 권위, 백링크 품질에 따라 달라지며, 꾸준한 SEO 최적화가 핵심입니다.",
              },
              {
                q: "백링크는 왜 구글 SEO에 중요한가요?",
                a: "구글은 백링크를 다른 사이트가 보내는 '추천표'로 간주합니다. 고품질 백링크가 많은 사이트를 더 신뢰하고 검색 순위를 높여줍니다. 하지만 저품질 백링크는 오히려 페널티를 받을 수 있으므로 전문적인 접근이 필요합니다.",
              },
              {
                q: "무료 SEO 분석 도구만으로 상위노출이 가능한가요?",
                a: "온페이지 SEO(메타태그, 헤딩 구조, 페이지 속도 등)는 무료 도구로 충분히 진단하고 개선할 수 있습니다. 하지만 구글 상위노출을 위해서는 백링크 구축, 콘텐츠 전략 등 오프페이지 SEO도 병행해야 합니다.",
              },
              {
                q: "도메인 권위(DA)란 무엇인가요?",
                a: "Domain Authority(DA)는 0~100 점으로 웹사이트의 검색엔진 권위를 나타내는 지표입니다. DA가 높을수록 구글 상위노출 확률이 높아집니다. 고품질 백링크 확보, 양질의 콘텐츠 발행, 기술적 SEO 최적화로 DA를 높일 수 있습니다.",
              },
              {
                q: "메타태그 최적화로 클릭률이 높아지나요?",
                a: "네, 잘 작성된 메타 제목과 설명은 검색 결과에서 사용자의 관심을 끌어 클릭률(CTR)을 최대 30% 이상 높일 수 있습니다. SEO월드의 메타태그 분석기로 현재 상태를 진단하고 최적화된 추천을 받아보세요.",
              },
              {
                q: "SEO 비용은 얼마나 드나요?",
                a: "SEO월드의 분석 도구는 모두 무료입니다. 전문 백링크 서비스, 웹 디자인, 도메인 브로커 서비스는 프로젝트 규모와 목표에 따라 맞춤 견적을 제공합니다. 무료 상담을 통해 정확한 비용을 확인하세요.",
              },
              {
                q: "SEO란 무엇인가요?",
                a: "SEO(검색엔진 최적화)란 웹사이트가 구글 등 검색엔진에서 더 높은 순위에 노출되도록 최적화하는 방법입니다. 검색엔진 최적화 방법에는 온페이지 SEO(메타태그, 콘텐츠 최적화), 테크니컬 SEO(사이트 속도, 크롤링), 오프페이지 SEO(백링크 구축) 등이 있습니다. SEO WORLD의 무료 도구로 지금 바로 시작해보세요.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 12. CTA ====== */}
      <section className="bg-blue-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">구글 상위노출, 지금 시작하세요</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            무료 SEO 분석 도구로 현재 상태를 파악하고,
            전문 백링크 서비스로 검색 순위를 높이세요.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/tools">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base px-8 sm:w-auto">
                무료 분석 도구 사용하기
              </Button>
            </Link>
            <Link href="/services/backlinks">
              <Button size="lg" variant="outline" className="w-full text-base px-8 sm:w-auto">
                백링크 서비스 문의
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== 외부 링크 섹션 ====== */}
      <section className="border-t py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs text-muted-foreground mb-4">SEO WORLD 분석 기준</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Google Search Central &rarr;
            </a>
            <a href="https://schema.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Schema.org &rarr;
            </a>
            <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Core Web Vitals &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
