import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Public 레이아웃 — 비인증 공개 페이지용
 * Header(글로벌 네비게이션) + Footer 포함
 * 적용 대상: 홈, 도메인, 툴, 서비스, 블로그, 가이드, 로그인, 회원가입
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
