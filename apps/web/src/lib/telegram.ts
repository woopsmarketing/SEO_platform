export const TELEGRAM_USERNAME = 'goat82'

export interface OnpageParams {
  url: string
  score: number
  topIssues: string[]
  issueCount: number
}

export interface MetaParams {
  url: string
  titleStatus: string
  descStatus: string
  ogStatus: string
}

export function getTelegramUrl(type: 'general'): string
export function getTelegramUrl(type: 'onpage', params: OnpageParams): string
export function getTelegramUrl(type: 'meta', params: MetaParams): string
export function getTelegramUrl(type: string, params?: any): string {
  let message: string

  switch (type) {
    case 'onpage': {
      const p = params as OnpageParams
      const issuesText = p.topIssues.slice(0, 3).join(', ')
      message = [
        '안녕하세요! SEO월드에서 보고 문의드립니다.',
        '',
        '📊 온페이지 SEO 분석 결과',
        `• 분석 URL: ${p.url}`,
        `• 종합 점수: ${p.score} / 100점`,
        `• 주요 문제: ${issuesText} (${p.issueCount}개)`,
        '',
        '개선 도움 요청드립니다.',
      ].join('\n')
      break
    }
    case 'meta': {
      const p = params as MetaParams
      message = [
        '안녕하세요! SEO월드에서 보고 문의드립니다.',
        '',
        '📊 메타태그 분석 결과',
        `• 분석 URL: ${p.url}`,
        `• 타이틀: ${p.titleStatus}`,
        `• 디스크립션: ${p.descStatus}`,
        `• OG 태그: ${p.ogStatus}`,
        '',
        '개선 도움 요청드립니다.',
      ].join('\n')
      break
    }
    default:
      message = '안녕하세요! SEO월드에서 보고 문의드립니다.'
  }

  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`
}
