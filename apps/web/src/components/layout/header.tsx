import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { ToolsMegaMenu } from "./tools-mega-menu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-600">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
          SEO월드
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/domains" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            도메인
          </Link>
          <ToolsMegaMenu />
          <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            서비스
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            블로그
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">대시보드</Button>
              </Link>
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>

        <MobileNav user={user} />
      </div>
    </header>
  );
}
