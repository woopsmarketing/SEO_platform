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
    event_category: "engagement",
    event_label: toolName,
  });
  // Google Ads 전환 (설정 후 conversion label 교체)
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
    event_category: "conversion",
    event_label: serviceType,
  });
  if (GOOGLE_ADS_ID) {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/inquiry`,
    });
  }
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
