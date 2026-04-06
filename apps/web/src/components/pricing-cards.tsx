import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans: { name: string; price: string; description: string; features: string[]; cta: string; href: string; popular: boolean; comingSoon?: boolean }[] = [
  {
    name: "Free",
    price: "0",
    description: "SEO 분석을 시작하는 분들에게",
    features: [
      "온페이지 SEO 분석 (1일 3회)",
      "메타태그 분석 (1일 3회)",
      "키워드 밀도 분석 (1일 3회)",
      "연관 키워드 조회 (1일 3회)",
      "백링크 조회 (1일 3회)",
      "사이트맵 생성기",
      "분석 이력 저장 (최근 10건)",
    ],
    cta: "무료로 시작하기",
    href: "/auth/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "9,900",
    description: "본격적인 SEO 관리가 필요한 분들에게",
    features: [
      "온페이지 SEO 분석 (무제한)",
      "메타태그 분석 (무제한)",
      "키워드 밀도 분석 (무제한)",
      "연관 키워드 조회 (무제한)",
      "백링크 조회 (무제한)",
      "사이트맵 생성기",
      "분석 이력 무제한 저장",
      "경쟁사 비교 분석",
      "주간 SEO 리포트",
      "우선 고객 지원",
    ],
    cta: "출시 예정",
    href: "#",
    popular: true,
    comingSoon: true,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative flex flex-col ${
            plan.popular
              ? "border-2 border-blue-600 shadow-lg"
              : "border shadow-sm"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
              인기
            </div>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="text-center">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-lg text-muted-foreground">원</span>
              <span className="text-sm text-muted-foreground">/월</span>
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 shrink-0 text-blue-600">&#x2713;</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {plan.comingSoon ? (
              <Button className="w-full" size="lg" disabled>
                출시 예정
              </Button>
            ) : (
              <Link href={plan.href} className="w-full">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
