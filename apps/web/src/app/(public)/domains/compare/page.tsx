import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 비교",
  description: "여러 도메인의 SEO 지표를 나란히 비교 분석하세요.",
  alternates: { canonical: "/domains/compare" },
};

export default function DomainsComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">도메인 비교</h1>
      <p className="mt-2 text-muted-foreground">
        최대 5개 도메인의 SEO 지표를 나란히 비교합니다.
      </p>
      {/* TODO: 다중 도메인 입력 UI */}
      {/* TODO: 비교 테이블/차트 */}
    </div>
  );
}
