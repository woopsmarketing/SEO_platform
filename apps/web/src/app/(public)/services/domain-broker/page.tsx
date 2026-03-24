import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "도메인 브로커 서비스",
  description: "프리미엄 도메인 매입/매각 중개. 가치 평가, 소유자 협상, 에스크로 거래까지 원스톱 서비스.",
  alternates: { canonical: "/services/domain-broker" },
};

export default function DomainBrokerServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">도메인 브로커 서비스</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          고가치 도메인의 매입/매각을 전문적으로 중개합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>서비스 내용</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>원하는 도메인의 매입 협상부터 안전한 이전까지 도와드립니다.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>도메인 가치 평가 및 시장 분석</li>
                <li>소유자 파악 및 매입 협상 대행</li>
                <li>안전한 에스크로 기반 거래</li>
                <li>도메인 매각 대행</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>진행 프로세스</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>1. 대상 도메인 파악 및 가치 평가</p>
              <p>2. 소유자 컨택 및 협상</p>
              <p>3. 에스크로 거래 진행</p>
              <p>4. 도메인 이전 완료</p>
            </CardContent>
          </Card>
        </div>
        <InquiryForm serviceType="domain-broker" serviceLabel="도메인 브로커" />
      </div>
    </div>
  );
}
