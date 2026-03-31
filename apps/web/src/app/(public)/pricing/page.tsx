import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/pricing-cards";

export const metadata: Metadata = {
  title: "요금제 비교 — 무료 SEO 분석 vs Pro 무제한 (월 9,900원)",
  description:
    "SEO월드 무료 요금제와 Pro 요금제를 비교하세요. 월 9,900원으로 무제한 SEO 분석, 경쟁사 비교, 주간 리포트를 이용할 수 있습니다.",
  openGraph: {
    title: "요금제 비교 — Free vs Pro | SEO월드",
    description: "무료 SEO 분석 vs Pro 무제한 — 월 9,900원으로 구글 SEO 분석 업그레이드",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold md:text-4xl">
          나에게 맞는 요금제를 선택하세요
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          무료로 시작하고, 필요할 때 Pro로 업그레이드하세요.
        </p>
      </div>

      <PricingCards />

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          모든 요금제는 부가세 포함 가격입니다. 언제든지 해지할 수 있습니다.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          궁금한 점이 있으신가요?{" "}
          <Link href="/inquiry" className="text-blue-600 hover:underline">
            문의하기
          </Link>
        </p>
      </div>
    </div>
  );
}
