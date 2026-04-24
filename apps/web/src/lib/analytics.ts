import { GOOGLE_ADS_ID } from './gtag'

/** GA4 커스텀 이벤트 — 텔레그램 클릭 추적 */
export function trackTelegramClick(params: {
  source: 'tool_result' | 'service_page' | 'home' | 'dashboard'
  tool?: string
  score?: number
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'telegram_click', params)
    // Google Ads Primary 전환 송출
    if (GOOGLE_ADS_ID) {
      (window as any).gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/telegram_click`,
      })
    }
  }
}
