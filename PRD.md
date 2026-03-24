# SEO월드 PRD (Product Requirements Document)

## 1. 서비스 개요

- **서비스명:** SEO월드
- **도메인:** seoworld.co.kr
- **성격:** SEO 관련 무료 분석 툴 + 도메인 정보 + 서비스 문의 플랫폼
- **핵심 가치:** 무료 SEO 도구로 검색 유입을 확보하고, 회원가입과 서비스 문의로 전환

## 2. MVP 목표

1. 무료 SEO 분석 툴로 검색엔진 유입 확보
2. 회원가입 유도 (분석 결과 저장, 이력 조회)
3. 서비스 소개 페이지를 통한 문의 수집
4. 도메인 데이터 허브로 재방문 유도

## 3. MVP 제외 범위

- 유료 구독 시스템
- 사이트 내 결제 기능
- 자동 주문 처리 / 자동 서비스 제공
- 팀/조직 기능, 고급 CRM
- 자체 호스팅/PBN 자동화
- Redis, BullMQ 등 큐 인프라
- 멀티테넌시, 실시간 WebSocket, API 크레딧 판매

실제 결제 및 서비스 제공은 이메일/텔레그램 상담 후 수동 처리한다.

## 4. 타겟 사용자

| 유형 | 설명 |
|------|------|
| SEO 입문자 | 무료 도구로 SEO를 학습하고 시작하려는 사용자 |
| 온라인 사업자 | 자사 웹사이트 SEO를 직접 관리하는 사업자 |
| SEO 마케터 | 도메인 분석, 온페이지 감사가 필요한 전문 마케터 |
| 아필리에이트 마케터 | 만료 도메인, 백링크 정보가 필요한 마케터 |

## 5. MVP 기능 범위

### 5.1 공개 웹사이트
홈페이지, 도메인 카테고리 허브, 무료 툴 허브, 서비스 소개 허브, 블로그/가이드

### 5.2 도메인 카테고리
- /domains — 도메인 검색 및 카테고리 진입점
- /domains/auction — 경매 중인 도메인 목록
- /domains/history — 도메인 이력 조회
- /domains/compare — 복수 도메인 비교 분석
- /domains/[domain] — 개별 도메인 상세 정보

### 5.3 무료 SEO 툴
- /tools/domain-checker — 도메인 기본 정보 + SEO 지표 조회
- /tools/onpage-audit — URL 입력 시 온페이지 SEO 점검
- /tools/meta-generator — 메타 태그 생성기
- /tools/robots-generator — robots.txt 생성기

### 5.4 서비스 소개/문의
- /services/backlinks — 백링크 서비스 소개 + 문의 폼
- /services/traffic — 트래픽 서비스 소개 + 문의 폼
- /services/web-design — 웹사이트 제작 소개 + 문의 폼
- /services/domain-broker — 도메인 중개 소개 + 문의 폼

### 5.5 회원 영역
- /dashboard — 회원 메인 대시보드
- /dashboard/analyses — 저장된 분석 결과 목록
- /dashboard/downloads — 생성된 파일 다운로드
- /dashboard/settings — 계정 설정

### 5.6 관리자 영역
- /admin — 관리자 메인
- /admin/inquiries — 서비스 문의 목록/처리
- /admin/domain-data — 도메인 데이터 sync 상태
- /admin/tool-usage — 무료 툴 사용 통계
- /admin/posts — 블로그/가이드 작성/수정

### 5.7 인증
- /login — 이메일/소셜 로그인
- /signup — 이메일/소셜 회원가입

## 6. URL 구조

단일 도메인 + 하위 디렉토리 구조. 하위도메인 분리 금지.

## 7. 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Route Handlers |
| Auth | Supabase Auth |
| DB | Supabase Postgres + Drizzle ORM |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Monitoring | Sentry, PostHog, Vercel Analytics |
| Email | Resend |

## 8. 캐시 전략

Redis 없이 Supabase Postgres 기반 캐시. DB가 캐시 + 이력 + 스냅샷 역할 동시 수행.
stale 정책으로 외부 API 재호출 여부 결정.

## 9. 외부 데이터 소스

| 소스 | 용도 |
|------|------|
| Namecheap GraphQL | 도메인 검색, 가격 정보 |
| RapidAPI SEO metrics | DA/PA, 백링크 지표 |
| Wayback CDX API | 도메인 히스토리 스냅샷 |
| Whois provider | 도메인 등록 정보 |

## 10. 비기능 요구사항

- 모든 공개 페이지는 SSR/SSG로 SEO 최적화
- 한국어 UI 기본
- 모바일 반응형 필수
- Core Web Vitals 최적화
