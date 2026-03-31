import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "트래픽 서비스 — 오가닉 트래픽 유입 · 검색 순위 상승",
  description: "키워드 리서치 기반 오가닉 트래픽 유입 서비스. 구글 검색 순위 상승과 전환율 개선을 위한 맞춤 트래픽 전략.",
  alternates: { canonical: "/services/traffic" },
};

export default function TrafficServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">트래픽 서비스</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          타겟 키워드 기반 오가닉 트래픽을 유입하여 웹사이트 성과를 극대화합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>서비스 내용</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>검색엔진과 소셜 채널을 통한 타겟 트래픽을 확보합니다.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>키워드 리서치 및 검색 의도 분석</li>
                <li>온페이지 SEO 최적화</li>
                <li>콘텐츠 마케팅 전략</li>
                <li>월간 트래픽 분석 리포트</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>기대 효과</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>검색 유입 트래픽 증가</p>
              <p>타겟 키워드 검색 순위 상승</p>
              <p>전환율 개선을 위한 방문자 품질 향상</p>
            </CardContent>
          </Card>
        </div>
        <InquiryForm serviceType="traffic" serviceLabel="트래픽" />
      </div>
    </div>
  );
}
