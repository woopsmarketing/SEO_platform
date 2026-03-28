import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "백링크 서비스 — 오프페이지 SEO 전문 링크빌딩",
  description: "오프페이지 SEO의 핵심인 고품질 백링크를 전략적으로 구축합니다. 링크빌딩, 게스트 포스팅, 에디토리얼 링크로 도메인 권위를 높이세요.",
  alternates: { canonical: "/services/backlinks" },
};

export default function BacklinksServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">백링크 서비스</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          오프페이지 SEO의 핵심인 링크빌딩을 통해 도메인 권위를 높이고 검색 순위를 개선합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>서비스 내용</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>검색엔진이 신뢰하는 고품질 백링크를 전략적으로 구축하는 오프페이지 SEO 전문 링크빌딩 서비스입니다. 백링크 품질 확인을 거친 안전한 링크만 제공합니다.</p>
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
              <p>1. 현재 백링크 프로필 및 참조도메인 확인</p>
              <p>2. 경쟁사 백링크 분석 후 타겟 사이트 선정 및 전략 수립</p>
              <p>3. 콘텐츠 제작 및 아웃리치</p>
              <p>4. 링크 확보 및 월간 리포트</p>
            </CardContent>
          </Card>
        </div>
        <InquiryForm serviceType="backlinks" serviceLabel="백링크" />
      </div>

      {/* FAQ */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-xl font-bold mb-6">백링크 서비스 FAQ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold mb-1">백링크와 오프페이지 SEO의 관계는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              오프페이지 SEO는 웹사이트 외부에서 검색 순위에 영향을 주는 모든 활동을 말하며,
              백링크 구축(링크빌딩)이 가장 핵심적인 요소입니다.
              고품질 외부 사이트에서의 자연스러운 링크는 구글에 신뢰 신호를 보내 검색 순위를 높여줍니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">좋은 백링크와 나쁜 백링크의 차이는?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              좋은 백링크는 DA/DR이 높고 관련성 있는 사이트에서 자연스럽게 연결된 링크입니다.
              나쁜 백링크는 스팸 사이트, 링크 팜 등에서 인위적으로 생성된 저품질 링크로,
              백링크 품질 확인 없이 무분별하게 구축하면 구글 페널티를 받을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
