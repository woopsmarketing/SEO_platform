import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "백링크 서비스",
  description: "DA/DR 높은 사이트에서 고품질 백링크를 구축합니다. 게스트 포스팅, 에디토리얼 링크, 월간 리포트 포함.",
  alternates: { canonical: "/services/backlinks" },
};

export default function BacklinksServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">백링크 서비스</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          고품질 백링크를 구축하여 도메인 권위를 높이고 검색 순위를 개선합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>서비스 내용</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>검색엔진이 신뢰하는 고품질 백링크를 전략적으로 구축합니다.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>DA/DR 높은 사이트에서의 자연스러운 링크 확보</li>
                <li>게스트 포스팅, 에디토리얼 링크, 니치 관련 링크</li>
                <li>경쟁사 백링크 분석 및 갭 리포트</li>
                <li>월간 백링크 성과 리포트 제공</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>진행 프로세스</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>1. 현재 백링크 프로필 분석</p>
              <p>2. 타겟 사이트 선정 및 전략 수립</p>
              <p>3. 콘텐츠 제작 및 아웃리치</p>
              <p>4. 링크 확보 및 월간 리포트</p>
            </CardContent>
          </Card>
        </div>
        <InquiryForm serviceType="backlinks" serviceLabel="백링크" />
      </div>
    </div>
  );
}
