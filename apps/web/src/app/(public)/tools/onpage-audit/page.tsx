import type { Metadata } from "next";
import { AuditForm } from "./audit-form";

export const metadata: Metadata = {
  title: "온페이지 SEO 분석 — 웹사이트 내부최적화 진단",
  description: "URL을 입력하면 35개 SEO 항목을 자동 검사하고 AI가 점수와 구체적인 개선 방안을 제시합니다.",
  openGraph: {
    title: "온페이지 SEO 분석 | SEO월드",
    description: "AI가 분석하는 무료 온페이지 SEO 진단. URL만 입력하면 35개 항목 즉시 검사.",
  },
  alternates: { canonical: "/tools/onpage-audit" },
};

export default function OnpageAuditPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">온페이지 SEO 분석</h1>
        <p className="mt-1 text-lg text-muted-foreground">웹사이트 내부최적화 진단 도구</p>
        <p className="mt-1 text-sm text-muted-foreground">
          URL을 입력하면 35개 SEO 항목을 자동 검사하고, AI가 종합적으로 분석하여 점수와 개선 방안을 제시합니다.
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
