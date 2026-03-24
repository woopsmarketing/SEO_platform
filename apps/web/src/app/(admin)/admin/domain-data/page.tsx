import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 데이터",
};

export default function DomainDataPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">도메인 데이터</h1>
      <p className="mt-2 text-muted-foreground">도메인 데이터 동기화 상태를 관리합니다.</p>
      {/* TODO: 데이터 소스별 sync 상태 */}
      {/* TODO: 수동 sync 트리거 */}
      {/* TODO: 최근 sync 로그 */}
    </div>
  );
}
