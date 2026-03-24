import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "툴 사용량",
};

export default function ToolUsagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">툴 사용량</h1>
      <p className="mt-2 text-muted-foreground">무료 툴 사용 통계를 확인합니다.</p>
      {/* TODO: 일별/주별/월별 사용량 차트 */}
      {/* TODO: 툴별 사용 빈도 */}
      {/* TODO: 인기 검색어 */}
    </div>
  );
}
