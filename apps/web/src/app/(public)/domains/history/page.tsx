import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 히스토리 조회 — 소유 이력 · 콘텐츠 변화 추적",
  description: "도메인의 과거 소유 이력, 콘텐츠 변화, WHOIS 기록을 추적하세요. 만료 도메인 · 중고 도메인 구매 전 반드시 확인해야 할 히스토리 정보.",
  alternates: { canonical: "/domains/history" },
};

export default function DomainsHistoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">도메인 히스토리</h1>
      <p className="mt-2 text-muted-foreground">
        도메인의 과거 소유 이력과 콘텐츠 변화를 추적합니다.
      </p>
      {/* TODO: 도메인 입력 폼 */}
      {/* TODO: Wayback CDX 타임라인 */}
    </div>
  );
}
