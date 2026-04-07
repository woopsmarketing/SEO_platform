/**
 * 블로그 타입 정의 + 카테고리 색상 매핑
 *
 * 콘텐츠 데이터는 Supabase posts 테이블이 단일 소스(Single Source of Truth).
 * 이 파일은 타입과 UI 상수만 관리한다.
 */

export type BlogCategory =
  | "SEO 전략"
  | "백링크"
  | "키워드 분석"
  | "온페이지 SEO"
  | "테크니컬 SEO";

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  "SEO 전략": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "백링크": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "키워드 분석": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "온페이지 SEO": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "테크니컬 SEO": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export const CATEGORIES: BlogCategory[] = [
  "SEO 전략",
  "백링크",
  "키워드 분석",
  "온페이지 SEO",
  "테크니컬 SEO",
];
