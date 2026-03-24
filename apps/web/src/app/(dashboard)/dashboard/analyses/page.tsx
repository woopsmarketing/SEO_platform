import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "분석 이력",
};

export default function AnalysesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">분석 이력</h1>
      <p className="mt-2 text-muted-foreground">저장된 분석 결과를 확인하고 관리합니다.</p>
      {/* TODO: 분석 결과 목록 테이블 */}
      {/* TODO: 필터/검색 */}
      {/* TODO: 상세 보기/삭제 */}
    </div>
  );
}
