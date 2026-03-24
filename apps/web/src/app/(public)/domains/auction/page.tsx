import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "경매 도메인",
  description: "SEO 가치가 높은 경매 도메인 목록을 확인하세요.",
  alternates: { canonical: "/domains/auction" },
};

export default function DomainsAuctionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">경매 도메인</h1>
      <p className="mt-2 text-muted-foreground">
        경매 중인 도메인을 검색하고 SEO 지표를 비교하세요.
      </p>
      {/* TODO: 필터/정렬 UI */}
      {/* TODO: 경매 도메인 리스트 */}
    </div>
  );
}
