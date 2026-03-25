import type { Metadata } from "next";
import { MetaGeneratorForm } from "./meta-generator-form";

export const metadata: Metadata = {
  title: "메타태그 분석기 — 메타태그 최적화 도구",
  description: "URL을 입력하면 현재 메타태그를 분석하고 SEO에 최적화된 제목, 설명, 키워드를 AI가 추천합니다. Google 검색 미리보기 포함.",
  openGraph: {
    title: "메타태그 분석기 | SEO월드",
    description: "URL만 입력하면 메타태그를 자동 분석하고 SEO 최적화 추천을 받으세요.",
  },
  alternates: { canonical: "/tools/meta-generator" },
};

export default function MetaGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">메타태그 분석 및 최적화</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          웹사이트 메타태그 진단 도구
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 입력하면 현재 메타태그를 파싱하여 문제점을 진단하고, AI가 최적화된 제목, 설명, 키워드를 추천합니다.
        </p>
      </div>
      <MetaGeneratorForm />
    </div>
  );
}
