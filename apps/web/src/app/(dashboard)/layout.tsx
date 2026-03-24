import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const dashboardLinks = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/dashboard/analyses", label: "분석 이력" },
  { href: "/dashboard/downloads", label: "다운로드" },
  { href: "/dashboard/settings", label: "설정" },
];

/**
 * Dashboard 레이아웃 — 인증된 회원 전용
 * Header + 좌측 Sidebar 구조
 * 향후 Supabase Auth 미들웨어로 인증 체크 추가
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar title="내 계정" links={dashboardLinks} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
