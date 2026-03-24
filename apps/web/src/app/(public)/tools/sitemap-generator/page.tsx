import type { Metadata } from "next";
import { SitemapGeneratorForm } from "./sitemap-generator-form";

export const metadata: Metadata = {
  title: "Sitemap.xml Generator — 사이트맵 생성기",
  description: "URL 자동 수집 또는 직접 입력으로 sitemap.xml을 생성합니다. 기존 sitemap 파싱, 크롤링 지원.",
  openGraph: {
    title: "Sitemap.xml Generator | SEO월드",
    description: "URL 자동 크롤링으로 sitemap.xml을 무료로 생성하세요. Google Search Console 제출용.",
  },
  alternates: { canonical: "/tools/sitemap-generator" },
};

export default function SitemapGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sitemap.xml Generator</h1>
        <p className="mt-2 text-muted-foreground">
          URL 목록을 입력하면 검색엔진에 제출할 수 있는 sitemap.xml을 생성합니다.
        </p>
      </div>
      <SitemapGeneratorForm />
    </div>
  );
}
