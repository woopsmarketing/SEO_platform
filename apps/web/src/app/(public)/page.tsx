import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { homeTools, homeServices } from "@/lib/data";

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
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            SEO의 모든 것, <span className="text-primary">한 곳에서</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            무료 SEO 분석 도구로 웹사이트를 점검하고, 도메인 정보를 확인하세요.
            전문 서비스가 필요하면 바로 문의할 수 있습니다.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/tools">
              <Button size="lg" className="w-full sm:w-auto">
                무료 툴 사용하기
              </Button>
            </Link>
            <Link href="/domains">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                도메인 검색
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">무료 SEO 도구</h2>
            <p className="mt-2 text-muted-foreground">
              회원가입 없이 바로 사용할 수 있습니다.
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
                    <CardDescription>{tool.desc}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">SEO 서비스</h2>
            <p className="mt-2 text-muted-foreground">
              전문가에게 맡기고 결과에 집중하세요.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeServices.map((svc) => (
              <Link key={svc.href} href={svc.href}>
                <Card className="h-full bg-background transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{svc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{svc.desc}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">SEO 전문 상담이 필요하신가요?</h2>
          <p className="mt-4 text-muted-foreground">
            백링크, 트래픽, 웹 디자인, 도메인 등 SEO 관련 모든 서비스를 문의하세요.
          </p>
          <div className="mt-8">
            <Link href="/services">
              <Button size="lg">서비스 둘러보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
