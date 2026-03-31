"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/lib/supabase/actions";

export function MobileNav({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-16 z-50 w-full border-b bg-background p-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <Link href="/domains" onClick={() => setOpen(false)} className="text-sm font-medium">도메인</Link>
            <Link href="/tools" onClick={() => setOpen(false)} className="text-sm font-medium">무료 툴</Link>
            <Link href="/services" onClick={() => setOpen(false)} className="text-sm font-medium">서비스</Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="text-sm font-medium">블로그</Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="text-sm font-medium">가격</Link>
            <hr className="my-1" />
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">대시보드</Link>
                <form action={signOut}>
                  <button type="submit" className="text-sm font-medium text-muted-foreground">로그아웃</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium">로그인</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="text-sm font-medium text-primary">회원가입</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
