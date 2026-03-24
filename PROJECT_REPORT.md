# SEO월드 프로젝트 리포트

> 최종 업데이트: 2026-03-24
> 프로젝트: SEO월드 (seoworld.co.kr)
> 기술 스택: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Claude API

---

## 1. 프로젝트 개요

SEO 관련 무료 분석 도구 + 도메인 정보 + 서비스 문의 플랫폼.
무료 도구로 검색 유입을 확보하고, 서비스 문의로 전환하는 구조.

---

## 2. 구현 완료 기능

### 2.1 무료 SEO 도구 (4/5 완성)

| 도구 | 경로 | 상태 | 주요 기능 |
|------|------|------|----------|
| Meta Tag Generator | `/tools/meta-generator` | 완성 | 입력폼, Google 검색 미리보기, OG/Twitter 코드 생성, 복사 |
| Robots.txt Generator | `/tools/robots-generator` | 완성 | 22개 크롤러 체크박스, 4개 프리셋, Allow/Disallow 편집, 다운로드 |
| Sitemap.xml Generator | `/tools/sitemap-generator` | 완성 | URL 자동 크롤링(sitemap+robots.txt 파싱), 벌크/개별 입력, 다운로드 |
| On-page SEO Audit | `/tools/onpage-audit` | 완성 | HTML 파싱(20+ 항목) + Claude AI 분석, SEO 점수/개선안 |
| Domain Checker | `/tools/domain-checker` | 미구현 | 페이지 스캐폴딩만 존재, 별도 프로젝트에서 합칠 예정 |

### 2.2 인증 시스템

| 기능 | 상태 | 구현 방식 |
|------|------|----------|
| 회원가입 | 완성 | Supabase Auth signUp (이메일/비밀번호) |
| 로그인 | 완성 | Supabase Auth signInWithPassword |
| 로그아웃 | 완성 | Server Action signOut |
| 세션 관리 | 완성 | middleware.ts에서 토큰 자동 갱신 |
| 라우트 보호 | 완성 | /dashboard, /admin 비인증 → /login 리다이렉트 |
| 관리자 권한 | 완성 | profiles.role === "admin" 서버 사이드 검증 |
| Profile 자동 생성 | 완성 | auth.users INSERT 트리거 → profiles 자동 생성 |
| Auth 콜백 | 완성 | /auth/callback (OAuth/이메일 확인) |

### 2.3 서비스 문의

| 기능 | 상태 | 비고 |
|------|------|------|
| 문의 폼 (공통 컴포넌트) | 완성 | InquiryForm — 이름/이메일/회사/메시지 |
| 백링크 서비스 페이지 | 완성 | 서비스 설명 + 프로세스 + 문의 폼 |
| 트래픽 서비스 페이지 | 완성 | 동일 |
| 웹 디자인 서비스 페이지 | 완성 | 동일 |
| 도메인 브로커 서비스 페이지 | 완성 | 동일 |
| 문의 API | 완성 | POST /api/inquiries (입력값 검증 포함) |
| 관리자 문의 관리 | 완성 | 목록 조회, 상태 변경(대기/처리중/완료/닫힘) |

### 2.4 블로그/가이드 CMS

| 기능 | 상태 | 비고 |
|------|------|------|
| 블로그 목록 | 완성 | posts 테이블 SSR, 커버 이미지(next/image) |
| 블로그 상세 | 완성 | Article JSON-LD, OG 메타 동적 생성 |
| 가이드 목록 | 완성 | category="guide" 필터 |
| 가이드 상세 | 완성 | OG 메타 동적 생성 |
| 관리자 글 작성 | 완성 | PostEditor (제목→slug 자동, 카테고리, 태그) |
| 관리자 글 수정 | 완성 | PATCH /api/posts/[id] |
| 관리자 글 삭제 | 완성 | DELETE /api/posts/[id] |

### 2.5 대시보드

| 기능 | 상태 | 비고 |
|------|------|------|
| 사용자 대시보드 | 완성 | 분석 통계, 최근 분석 목록, 빈 상태 UI |
| 관리자 대시보드 | 완성 | 문의/회원/툴사용/게시글 통계, 최근 문의 |

### 2.6 레이아웃/컴포넌트

| 컴포넌트 | 상태 | 비고 |
|----------|------|------|
| Header | 완성 | 인증 상태 반영, sticky, 반응형 |
| Footer | 완성 | 사이트맵 링크, shadcn 토큰 |
| Sidebar | 완성 | 대시보드/관리자, active 상태 표시 |
| MobileNav | 완성 | 인증 상태 반영 모바일 메뉴 |
| InquiryForm | 완성 | 서비스 문의 공통 컴포넌트 |
| shadcn/ui | 완성 | Button, Card, Input, Textarea |
| loading.tsx | 완성 | public, dashboard, admin 3개 라우트 그룹 |
| not-found.tsx | 완성 | noindex, shadcn 스타일 |

---

## 3. API 엔드포인트 (9개)

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|--------|------|------|
| `/api/health` | GET | 불필요 | 서버 + DB 상태 확인 |
| `/api/inquiries` | POST | 불필요 | 서비스 문의 생성 (service_role, 입력값 검증) |
| `/api/inquiries/[id]` | PATCH | admin | 문의 상태/메모 변경 |
| `/api/tool-usage` | POST | 불필요 | 툴 사용 로그 기록 (IP, UA 포함) |
| `/api/audit` | POST | 불필요 | HTML 파싱 + Claude AI SEO 분석 |
| `/api/crawl` | POST | 불필요 | robots.txt + sitemap 파싱 + 크롤링 |
| `/api/posts` | POST | admin | 게시글 생성 |
| `/api/posts/[id]` | PATCH | admin | 게시글 수정 |
| `/api/posts/[id]` | DELETE | admin | 게시글 삭제 |
| `/auth/callback` | GET | — | OAuth/이메일 확인 콜백 |

---

## 4. DB 테이블 (7개)

| 테이블 | 설명 | RLS |
|--------|------|-----|
| `profiles` | 유저 프로필 (auth.users 확장, 자동 생성 트리거) | 본인만 읽기/수정 |
| `domains` | 도메인 기본 정보 | 공개 읽기 |
| `domain_metrics` | SEO 지표 캐시/스냅샷 | 공개 읽기 |
| `inquiries` | 서비스 문의 | API route로 삽입, admin 조회/수정 |
| `analyses` | 사용자 분석 결과 | 본인만 CRUD |
| `posts` | 블로그/가이드 | published 공개, admin 전체 |
| `tool_usage_logs` | 툴 사용 기록 | API route로 삽입, admin 조회 |

---

## 5. SEO 최적화 현황

### 메타데이터
- [x] 모든 공개 페이지에 title + description
- [x] 모든 공개 페이지에 canonical URL
- [x] Open Graph (title, description, type, images)
- [x] Twitter Card (summary_large_image)
- [x] keywords 10개 (루트 레이아웃)
- [x] 비공개 페이지 noindex (dashboard, admin, login, signup, 404)

### 구조화 데이터 (JSON-LD)
- [x] 홈페이지: WebSite (SearchAction) + Organization
- [x] 도구 허브: WebApplication (무료, SEO Tool)
- [x] 서비스 허브: Service (provider: Organization)
- [x] 블로그 상세: Article (headline, datePublished, author, image)

### 기술적 SEO
- [x] `/sitemap.xml` — 정적 18페이지 + 동적 posts
- [x] `/robots.txt` — 비공개 경로 차단, AI 크롤러 4개 차단
- [x] `next/image` — 이미지 최적화 (avif/webp, lazy loading)
- [x] `next/font` — Noto Sans KR (FOUT 방지)
- [x] `poweredByHeader: false`
- [x] `reactStrictMode: true`
- [x] `loading.tsx` — LCP 개선
- [x] Google/Naver 인증 — 환경변수 구조 준비

### 미적용 (배포 후)
- [ ] OG 대표 이미지 제작
- [ ] Google Search Console 등록 + sitemap 제출
- [ ] Naver Search Advisor 등록
- [ ] Core Web Vitals 실측 (PageSpeed Insights)

---

## 6. 코드 품질

### 리팩토링 완료
- [x] tools/services 데이터 → `lib/data.ts` 공통 추출
- [x] `Textarea` shadcn/ui 컴포넌트 생성 및 적용
- [x] 하드코딩 색상 (`text-gray-*`) → shadcn 토큰 통일 (17개소)
- [x] API 입력값 검증 (email, name 100자, message 5000자, service_type 화이트리스트)
- [x] searchParams 타입 안전성 (login, signup)
- [x] ESLint 설정 (`next/core-web-vitals`)

### 빌드/린트 상태
```
next build: 성공 (42 라우트, 에러 없음)
next lint: 통과 (경고/에러 0건)
```

---

## 7. 파일 구조

```
apps/web/src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Noto Sans KR, 전역 메타)
│   ├── sitemap.ts              # /sitemap.xml 자동 생성
│   ├── robots.ts               # /robots.txt 자동 생성
│   ├── not-found.tsx           # 404 페이지
│   ├── middleware.ts           # 세션 갱신 + 라우트 보호
│   ├── (auth)/auth/callback/   # OAuth 콜백
│   ├── (public)/               # 공개 페이지
│   │   ├── page.tsx            # 홈 (JSON-LD)
│   │   ├── loading.tsx         # 로딩 UI
│   │   ├── tools/              # 무료 도구 (5개)
│   │   ├── services/           # 서비스 (4개 + 허브)
│   │   ├── domains/            # 도메인 (5개, 대부분 스캐폴딩)
│   │   ├── blog/               # 블로그 (목록 + [slug])
│   │   ├── guides/             # 가이드 (목록 + [slug])
│   │   ├── login/              # 로그인
│   │   └── signup/             # 회원가입
│   ├── (dashboard)/            # 회원 전용
│   │   ├── loading.tsx
│   │   └── dashboard/          # 대시보드 + 서브페이지
│   ├── (admin)/                # 관리자 전용
│   │   ├── loading.tsx
│   │   └── admin/              # 관리자 + 서브페이지
│   └── api/                    # API 라우트
│       ├── health/
│       ├── inquiries/  (+[id])
│       ├── tool-usage/
│       ├── audit/
│       ├── crawl/
│       └── posts/      (+[id])
├── components/
│   ├── layout/                 # header, footer, sidebar, mobile-nav
│   ├── ui/                     # button, card, input, textarea
│   └── inquiry-form.tsx        # 서비스 문의 공통 컴포넌트
├── lib/
│   ├── supabase/               # client, server, admin, middleware, actions
│   ├── data.ts                 # 툴/서비스 정적 데이터
│   ├── constants.ts            # SITE_NAME, SITE_URL 등
│   └── utils.ts                # cn() 유틸
└── styles/
    └── globals.css             # Tailwind + shadcn CSS 변수
```

---

## 8. 환경 설정

### 필수 환경변수 (.env.local)
| 변수 | 용도 | 상태 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | 설정됨 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | 설정됨 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 | 설정됨 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | 설정됨 |
| `ANTHROPIC_API_KEY` | Claude AI (On-page Audit) | 미확인 |

### 선택 환경변수
| 변수 | 용도 | 상태 |
|------|------|------|
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console | 미설정 |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | Naver Search Advisor | 미설정 |
| `RESEND_API_KEY` | 이메일 알림 | 미구현 |
| `SENTRY_DSN` | 에러 추적 | 미구현 |
| `NEXT_PUBLIC_POSTHOG_KEY` | 사용자 분석 | 미구현 |

### WSL2 주의사항
```bash
# 의존성 설치
cd apps/web && npm install --bin-links=false --ignore-scripts

# 개발/빌드/린트
node node_modules/next/dist/bin/next dev
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next lint
```

---

## 9. 미구현 항목 (우선순위 순)

| 순위 | 항목 | 난이도 | 비고 |
|------|------|--------|------|
| 1 | Vercel 배포 | 낮음 | 빌드 통과됨, 설정만 필요 |
| 2 | Domain Checker | 중간 | 별도 프로젝트 합치기 예정 |
| 3 | 도메인 페이지 (/domains 등) | 중간 | 외부 API 연동 필요 |
| 4 | PostHog / Vercel Analytics | 낮음 | 스크립트 삽입 |
| 5 | Sentry 에러 추적 | 낮음 | SDK 설치 + DSN |
| 6 | Resend 이메일 | 중간 | 문의 알림 |
| 7 | 대시보드 서브페이지 (analyses, downloads, settings) | 중간 | 스캐폴딩 상태 |
| 8 | 관리자 툴 사용량 차트 | 중간 | 스캐폴딩 상태 |
| 9 | 블로그 마크다운 렌더링 | 낮음 | 현재 줄바꿈만 처리 |
| 10 | DB 기반 캐시 로직 | 중간 | domain_metrics 활용 |

---

## 10. Git 상태

```
최초 커밋: bc85e09 (init: SEO_platform 프로젝트 생성)
이후 모든 작업: 미커밋 상태 (Working Directory)
```

전체 프로젝트 구현이 커밋되지 않은 상태. 배포 전 커밋 필요.
