"use client";

import { useEffect } from "react";
import { trackSignup } from "@/lib/gtag";

/** 회원가입 완료 후 로그인 페이지에 message 파라미터가 있으면 전환 이벤트 발화 */
export function SignupTracker({ signedUp }: { signedUp: boolean }) {
  useEffect(() => {
    if (signedUp) {
      trackSignup("email");
    }
  }, [signedUp]);

  return null;
}
