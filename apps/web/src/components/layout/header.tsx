import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          SEO월드
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link href="/domains" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            도메인
          </Link>
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            무료 툴
          </Link>
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
