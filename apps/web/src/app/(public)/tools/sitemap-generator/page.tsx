import type { Metadata } from "next";
import { SitemapGeneratorForm } from "./sitemap-generator-form";

export const metadata: Metadata = {
  title: "사이트맵 생성기 — sitemap.xml 자동 생성",
  description: "URL을 입력하면 사이트를 자동 크롤링하여 sitemap.xml을 생성합니다. Google Search Console 제출용.",
  openGraph: {
    title: "사이트맵 생성기 | SEO월드",
    description: "URL 자동 크롤링으로 sitemap.xml을 무료로 생성하세요. Google Search Console 제출용.",
  },
  alternates: { canonical: "/tools/sitemap-generator" },
};

export default function SitemapGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">사이트맵 생성기</h1>
        <p className="mt-2 text-muted-foreground">
          URL 목록을 입력하면 검색엔진에 제출할 수 있는 sitemap.xml을 생성합니다.
        </p>
      </div>
      <SitemapGeneratorForm />
    </div>
  );
}
