import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const adminLinks = [
  { href: "/admin", label: "관리자 홈" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/domain-data", label: "도메인 데이터" },
  { href: "/admin/tool-usage", label: "툴 사용량" },
  { href: "/admin/posts", label: "글 관리" },
];

/**
 * Admin 레이아웃 — 관리자 전용
 * Header 없이 좌측 Sidebar만 사용 (관리자 전용 인터페이스)
 * 향후 관리자 권한 체크 미들웨어 추가
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="관리자" links={adminLinks} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
