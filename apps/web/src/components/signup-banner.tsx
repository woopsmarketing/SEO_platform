"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignupBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setShow(true);
    });
  }, []);

  if (!show) return null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-5">
      {/* 배경 장식 */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50" />
      <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-purple-100/50" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {/* 별 아이콘 */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 sm:text-base">
              <span className="inline-flex items-center rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white mr-1.5">
                무료
              </span>
              회원가입으로 모든 SEO 도구를 무제한 사용하세요!
            </p>
            <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
              분석 히스토리 자동 저장 · Google 계정으로 3초 만에 가입 · 결제 정보 불필요
            </p>
          </div>
        </div>
        <Link href="/signup" className="shrink-0">
          <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            무료 회원가입
          </Button>
        </Link>
      </div>
    </div>
  );
}
