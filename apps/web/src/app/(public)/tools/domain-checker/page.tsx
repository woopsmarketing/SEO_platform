import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Checker",
  description: "도메인의 DA, PA, 백링크, 스팸 스코어 등 SEO 지표를 무료로 확인하세요.",
};

export default function DomainCheckerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">Domain Checker</h1>
      <p className="mt-2 text-muted-foreground">
        도메인을 입력하면 DA, PA, 백링크 수, 스팸 스코어 등 핵심 SEO 지표를 확인할 수 있습니다.
      </p>
      {/* TODO: 도메인 입력 폼 */}
      {/* TODO: 결과 카드 (DA, PA, 백링크, 스팸 스코어) */}
      {/* TODO: 로그인 시 결과 저장 CTA */}
    </div>
  );
}
