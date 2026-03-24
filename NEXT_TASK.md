# 다음 작업

## 우선순위 1: Git 커밋 + Vercel 배포
- 전체 미커밋 코드 정리 후 커밋
- Vercel 배포 설정 (사용자가 PC 환경에서 진행 예정)

## 우선순위 2: Domain Checker 합치기
- 사용자의 기존 도메인체커 프로젝트를 SEO월드에 통합
- /tools/domain-checker 페이지 구현

## 우선순위 3: 도메인 페이지
- /domains 검색, /domains/[domain] 상세
- 외부 API (Whois, RapidAPI) 연동
- DB 기반 캐시 로직 (domain_metrics 테이블 활용)

## 우선순위 4: 모니터링/분석
- PostHog, Vercel Analytics 연동
- Sentry 에러 추적

## 우선순위 5: 기타
- Resend 이메일 (문의 알림)
- 대시보드 서브페이지 (analyses, downloads, settings)
- 블로그 마크다운 렌더링
