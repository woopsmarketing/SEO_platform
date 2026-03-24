import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "다운로드",
};

export default function DownloadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">다운로드</h1>
      <p className="mt-2 text-muted-foreground">생성된 파일을 다운로드하세요.</p>
      {/* TODO: 생성된 파일 목록 (robots.txt, 메타 태그 등) */}
      {/* TODO: 다운로드 버튼 */}
    </div>
  );
}
