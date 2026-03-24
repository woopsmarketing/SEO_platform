import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 검색",
  description: "도메인 SEO 지표, 히스토리, 가치 평가를 한눈에 확인하세요.",
  alternates: { canonical: "/domains" },
};

export default function DomainsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">도메인 검색</h1>
      <p className="mt-2 text-muted-foreground">
        도메인을 검색하고 SEO 지표, 히스토리, 가치를 분석하세요.
      </p>
      {/* TODO: 도메인 검색 입력 폼 */}
      {/* TODO: 최근 검색 / 인기 도메인 목록 */}
    </div>
  );
}
