# 다음 작업

## 마지막 업데이트
2026-03-26

## 완료된 항목
- [x] 전체 코드 커밋 (11개 커밋, master 브랜치)
- [x] Vercel 배포 설정 완료 (woopsmarketing/SEO_platform)
- [x] Anthropic SDK → OpenAI API 교체 (gpt-4o-mini)
- [x] Meta Tag Generator → 메타태그 분석기 (URL 파싱 + AI 추천)
- [x] /api/meta-analyze 엔드포인트 추가
- [x] 빌드 에러 수정 (health/sitemap dynamic, 미들웨어 방어 코드)

## 우선순위 1: Domain Checker 구현 (권장)
- /tools/domain-checker 페이지 — 현재 스캐폴딩만 존재
- 기존 도메인체커 프로젝트 코드를 SEO월드에 통합
- Whois/RapidAPI 연동 또는 자체 파싱 결정 필요

## 우선순위 2: 도메인 페이지
- /domains 검색 페이지, /domains/[domain] 상세 페이지
- DB 기반 캐시 로직 (domain_metrics 테이블 활용)
- stale 정책 결정 (TTL 기준)

## 우선순위 3: 모니터링/분석 연동
- PostHog 연동 (사용자 행동 분석)
- Vercel Analytics 활성화
- Sentry 에러 추적 설정

## 우선순위 4: 기타 미완료 항목
- Resend 이메일 (문의 접수 알림)
- 대시보드 서브페이지 (analyses, downloads, settings)
- 블로그 마크다운 렌더링 (react-markdown 또는 MDX)
- 관리자 툴 사용량 차트 (tool_usage_logs 집계)

## 최근 커밋 이력
```
ebebe37 refactor: Anthropic SDK → OpenAI API로 LLM 교체
4319eb8 fix: 미들웨어에 환경변수 방어 코드 추가
3588c03 fix: health API와 sitemap을 dynamic으로 변경하여 Vercel 빌드 에러 수정
d8623e7 feat: SEO월드 MVP Phase 2 전체 구현
bc85e09 init: SEO_platform 프로젝트 생성
```

## 환경 상태
| 항목 | 상태 |
|------|------|
| 로컬 개발 | 정상 |
| Vercel 배포 | 완료 |
| Supabase | 연결됨 |
| OpenAI API | 설정됨 |
| Resend | 미설정 |
| Sentry | 미설정 |
| PostHog | 미설정 |
