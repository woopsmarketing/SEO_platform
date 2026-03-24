import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "웹 디자인 서비스",
  description: "처음부터 SEO를 고려한 반응형 웹사이트 제작. Core Web Vitals 최적화, 시맨틱 HTML 포함.",
  alternates: { canonical: "/services/web-design" },
};

export default function WebDesignServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">웹 디자인 서비스</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          SEO 최적화된 반응형 웹사이트를 설계하고 제작합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>서비스 내용</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>처음부터 SEO를 고려한 웹사이트를 제작합니다.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>반응형 디자인 (모바일/태블릿/데스크탑)</li>
                <li>Core Web Vitals 최적화</li>
                <li>시맨틱 HTML + 구조화된 데이터</li>
                <li>빠른 로딩 속도 및 접근성</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>진행 프로세스</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>1. 요구사항 분석 및 기획</p>
              <p>2. 디자인 시안 제작</p>
              <p>3. 개발 및 SEO 적용</p>
              <p>4. 테스트 및 런칭</p>
            </CardContent>
          </Card>
        </div>
        <InquiryForm serviceType="web-design" serviceLabel="웹 디자인" />
      </div>
    </div>
  );
}
