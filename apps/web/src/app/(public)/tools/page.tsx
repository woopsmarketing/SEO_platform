import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tools } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "무료 SEO 도구",
  description: "회원가입 없이 바로 사용하는 무료 SEO 도구. 메타태그 생성, robots.txt, sitemap.xml, 온페이지 SEO 감사까지.",
  openGraph: {
    title: "무료 SEO 도구 모음 | SEO월드",
    description: "회원가입 없이 바로 사용하는 무료 SEO 도구. 메타태그 생성, robots.txt, sitemap.xml, 온페이지 SEO 감사까지.",
  },
  alternates: { canonical: "/tools" },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${SITE_NAME} SEO 도구`,
  description: "회원가입 없이 바로 사용하는 무료 SEO 도구 모음",
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold">무료 SEO 도구</h1>
        <p className="mt-2 text-muted-foreground">
          회원가입 없이 바로 사용할 수 있는 무료 SEO 분석 도구입니다.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className={`h-full transition-shadow hover:shadow-md ${!tool.ready ? "opacity-60" : ""}`}>
              <CardHeader>
                <div className="text-3xl">{tool.icon}</div>
                <CardTitle className="text-lg">
                  {tool.title}
                  {!tool.ready && <span className="ml-2 text-xs font-normal text-muted-foreground">(준비중)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
