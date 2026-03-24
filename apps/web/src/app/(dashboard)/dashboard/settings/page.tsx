import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">계정 설정</h1>
      <p className="mt-2 text-muted-foreground">프로필과 알림 설정을 관리합니다.</p>
      {/* TODO: 프로필 수정 폼 */}
      {/* TODO: 비밀번호 변경 */}
      {/* TODO: 알림 설정 */}
    </div>
  );
}
