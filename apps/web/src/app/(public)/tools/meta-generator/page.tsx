import type { Metadata } from "next";
import { MetaGeneratorForm } from "./meta-generator-form";

export const metadata: Metadata = {
  title: "Meta Tag Generator — 메타태그 생성기",
  description: "페이지 제목, 설명, 키워드를 입력하면 SEO에 최적화된 메타 태그 코드를 자동으로 생성합니다. Google 검색 결과 미리보기 포함.",
  openGraph: {
    title: "Meta Tag Generator | SEO월드",
    description: "SEO 최적화 메타 태그를 무료로 생성하세요. Google 검색 미리보기와 OG/Twitter 태그까지.",
  },
  alternates: { canonical: "/tools/meta-generator" },
};

export default function MetaGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meta Tag Generator</h1>
        <p className="mt-2 text-muted-foreground">
          페이지 정보를 입력하면 SEO에 최적화된 메타 태그 코드를 생성합니다.
        </p>
      </div>
      <MetaGeneratorForm />
    </div>
  );
}
