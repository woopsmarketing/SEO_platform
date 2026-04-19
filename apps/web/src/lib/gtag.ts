// Google Analytics 4 + Google Ads 전환 추적 유틸리티

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

// GA4 페이지뷰
export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", "page_view", {
    page_path: url,
  });
}

// 범용 이벤트
export function event(action: string, params?: Record<string, string | number | boolean>) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", action, params);
}

// --- 전환 이벤트 ---

/** 도구 사용 완료 (핵심 전환) */
export function trackToolUsage(toolName: string) {
  event("tool_usage", {
    tool_name: toolName,       // GA4 커스텀 측정기준으로 등록 가능
  });
  // Google Ads 전환
  if (GOOGLE_ADS_ID) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/tool_usage`,
    });
  }
}

/** 회원가입 완료 */
export function trackSignup(method: string) {
  event("sign_up", {
    method,
  });
  if (GOOGLE_ADS_ID) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/signup`,
    });
  }
}

/** 문의 폼 제출 완료 */
export function trackInquirySubmit(serviceType: string) {
  event("generate_lead", {
    service_type: serviceType,
  });
  if (GOOGLE_ADS_ID) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/inquiry`,
    });
  }
}

/** 도구 사용 시도 (버튼 클릭 — 성공/실패 전) */
export function trackToolAttempt(toolName: string) {
  event("tool_attempt", {
    tool_name: toolName,
  });
}

/** Rate limit 도달 */
export function trackRateLimit(toolName: string, userType: "logged_in" | "guest") {
  event("rate_limit_reached", {
    tool_name: toolName,
    user_type: userType,
  });
}

/** 도구 API 에러 */
export function trackToolError(toolName: string, errorType: string) {
  event("tool_error", {
    tool_name: toolName,
    error_type: errorType,
  });
}

/** 회원가입 모달 노출 (rate limit or 결과 하단 배너) */
export function trackSignupPrompt(trigger: "rate_limit" | "banner" | "cta") {
  event("signup_prompt_shown", {
    trigger,
  });
}

// gtag 타입 선언
declare global {
  interface Window {
    gtag: (
      command: string,
      targetOrAction: string,
      params?: Record<string, string | number | boolean>
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}
