import type { Metadata } from "next";
import { RobotsGeneratorForm } from "./robots-generator-form";

export const metadata: Metadata = {
  title: "Robots.txt 생성기 — 검색엔진 크롤러 제어",
  description: "크롤러별 허용/차단 규칙을 설정하고 robots.txt를 생성합니다. AI 크롤러 차단, 프리셋 지원.",
  openGraph: {
    title: "Robots.txt 생성기 | SEO월드",
    description: "검색엔진 크롤러 차단/허용 규칙을 설정하고 robots.txt를 무료로 생성하세요.",
  },
  alternates: { canonical: "/tools/robots-generator" },
};

export default function RobotsGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Robots.txt 생성기</h1>
        <p className="mt-2 text-muted-foreground">
          크롤러별 허용/차단 규칙을 설정하고 robots.txt 파일을 생성합니다.
        </p>
      </div>
      <RobotsGeneratorForm />
    </div>
  );
}
