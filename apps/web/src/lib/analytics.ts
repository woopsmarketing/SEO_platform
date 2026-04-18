/** GA4 커스텀 이벤트 — 텔레그램 클릭 추적 */
export function trackTelegramClick(params: {
  source: 'tool_result' | 'service_page' | 'home' | 'dashboard'
  tool?: string
  score?: number
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'telegram_click', params)
  }
}
