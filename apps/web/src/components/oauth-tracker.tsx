"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackSignup } from "@/lib/gtag";

/** OAuth 가입/로그인 후 대시보드 진입 시 전환 이벤트 발화 */
export function OAuthTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("ref") === "oauth") {
      trackSignup("google");
      // URL에서 ref 파라미터 제거 (중복 발화 방지)
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

  return null;
}
