# SEO월드 프로젝트 종합 보고서

> 작성일: 2026-03-27
> 프로젝트: SEO월드 (seoworld.co.kr)
> GitHub: woopsmarketing/SEO_platform
> 배포: Vercel

---

## 1. 구현 완료 기능 (전체)

### 1.1 무료 SEO 도구 (4개 완성 + 1개 스캐폴딩)

| 도구 | 경로 | 기능 | LLM |
|------|------|------|-----|
| **메타태그 분석기** | /tools/meta-generator | URL → head 파싱(30+항목) + AI 최적화 추천, 한글/영문 자동 감지, Google 미리보기 비교 | gpt-4o-mini |
| **온페이지 SEO 분석** | /tools/onpage-audit | URL → HTML 파싱(35항목) + AI 점수/개선안, SPA 감지, 코드 예시 포함 개선안 | gpt-4o-mini |
| **Robots.txt 생성기** | /tools/robots-generator | 22개 크롤러 선택, 4개 프리셋, Allow/Disallow 편집, 다운로드 | - |
| **사이트맵 생성기** | /tools/sitemap-generator | URL 자동 크롤링(robots.txt+sitemap 파싱), 벌크/개별 입력, 다운로드 | - |
| 도메인 분석기 | /tools/domain-checker | 스캐폴딩만 존재 | - |

### 1.2 인증 시스템

| 기능 | 방식 |
|------|------|
| 이메일 회원가입 | Supabase Auth signUp |
| 이메일 로그인 | Supabase Auth signInWithPassword |
| **Google 로그인** | Supabase OAuth (Google Provider) |
| 로그아웃 | Server Action signOut |
| 세션 관리 | middleware.ts 자동 갱신 |
| 라우트 보호 | /dashboard, /admin 비인증 → /login 리다이렉트 |
| 관리자 권한 | profiles.role === "admin" 서버 사이드 검증 |
| Open Redirect 방지 | signIn redirect 경로 검증 |

### 1.3 회원 대시보드 (8개 페이지)

| 페이지 | 경로 | 데이터 소스 | 기능 |
|--------|------|-----------|------|
| **대시보드 메인** | /dashboard | DB | 통계 4카드(분석/문의/플랜/잔액) + 최근활동 |
| **분석 이력** | /dashboard/analyses | DB (analyses) | 탭 필터(자동 생성) + 점수 배지 + 요약 펼침 |
| **내 문의** | /dashboard/inquiries | DB (inquiries) | 문의 목록 + 상태 배지 + 관리자 답변 표시 |
| **즐겨찾기 도메인** | /dashboard/favorites | localStorage | 도메인 등록/삭제 + 원클릭 분석 |
| **경쟁사 비교** | /dashboard/competitors | /api/audit 실시간 | 2사이트 SEO 점수 + 8항목 비교 |
| **주간 SEO 리포트** | /dashboard/weekly-report | localStorage + API | 도메인 등록 + "지금 리포트 받기" 이메일 발송 |
| **다운로드 센터** | /dashboard/downloads | localStorage | robots.txt/sitemap/메타태그 재다운로드 |
| **프로필 설정** | /dashboard/settings | DB (profiles+auth) | 계정 정보 + 이름 변경 |

### 1.4 서비스 문의

| 기능 | 상태 |
|------|------|
| 문의 폼 (공통 컴포넌트) | 완성 |
| 백링크/웹디자인/도메인브로커/트래픽 서비스 페이지 | 완성 |
| 문의 API (POST /api/inquiries) | 완성 |
| **Brevo 이메일 알림** (관리자 + 고객) | 완성 |
| 관리자 문의 관리 (상태 변경) | 완성 |

### 1.5 블로그/가이드 CMS

| 기능 | 상태 |
|------|------|
| 블로그 목록/상세 (SSR) | 완성 |
| 가이드 목록/상세 (SSR) | 완성 |
| 관리자 CRUD (PostEditor) | 완성 |
| Article JSON-LD, OG 메타 동적 생성 | 완성 |
| 마크다운 렌더링 | 미구현 (줄바꿈만) |

### 1.6 SEO 최적화

| 항목 | 상태 |
|------|------|
| 모든 공개 페이지 메타데이터 (title, description, canonical, OG, Twitter) | 완성 |
| JSON-LD 구조화 데이터 (WebSite, Organization, Service, Article, WebApplication) | 완성 |
| sitemap.xml 자동 생성 (정적 + 동적 posts) | 완성 |
| robots.txt 자동 생성 (AI 크롤러 차단) | 완성 |
| next/image (avif/webp) + next/font (Noto Sans KR) | 완성 |
| **파비콘 + Apple 아이콘** (파란 지구본) | 완성 |
| **OG 대표 이미지** (ImageResponse API) | 완성 |
| **홈페이지 12섹션** SEO 콘텐츠 | 완성 |
| 핵심 키워드 배치 (구글상위노출, 백링크, 구글SEO) | 완성 |

### 1.7 API 라우트 (12개)

| 엔드포인트 | 메서드 | 인증 | Rate Limit |
|-----------|--------|------|------------|
| /api/health | GET | 불필요 | - |
| /api/audit | POST | 불필요 | **3회/일** |
| /api/meta-analyze | POST | 불필요 | **3회/일** |
| /api/crawl | POST | 불필요 | **3회/일** |
| /api/inquiries | POST | 불필요 | - |
| /api/inquiries/[id] | PATCH | admin | - |
| /api/tool-usage | POST | 불필요 | - |
| /api/posts | POST | admin | - |
| /api/posts/[id] | PATCH/DELETE | admin | - |
| /api/weekly-report | POST | 불필요 | - |
| /auth/callback | GET | - | - |

### 1.8 보안

| 항목 | 상태 |
|------|------|
| IP 기반 Rate Limit (DB) | 3회/일 (audit, meta-analyze, crawl) |
| Pro 플랜 업그레이드 유도 | 초과 시 UI 카드 표시 |
| RLS (Row Level Security) | 모든 테이블 적용 |
| HTTPS | Vercel 자동 SSL |
| Open Redirect 방지 | signIn redirect 검증 |
| HTML 인젝션 방지 | 이메일 escHtml |
| 환경변수 보호 | .gitignore (.env.local, .mcp.json) |

### 1.9 인프라

| 항목 | 상태 |
|------|------|
| Vercel 배포 | 완료 (seoworld.co.kr) |
| Cloudflare DNS | 완료 (DNS only 모드) |
| Supabase (Auth + Postgres + RLS) | 7개 테이블 |
| OpenAI API (gpt-4o-mini) | audit + meta-analyze |
| Brevo (이메일) | 문의 알림 + 주간 리포트 |
| Google OAuth | 로그인 연동 완료 |

---

## 2. DB 스키마 (7개 테이블 + 추가 컬럼)

| 테이블 | 주요 컬럼 | RLS |
|--------|----------|-----|
| profiles | id, email, display_name, role, **plan**, **balance** | 본인만 |
| analyses | id, user_id, tool_type, input_summary, **score**, input(jsonb), result(jsonb) | 본인만 |
| inquiries | id, email, service_type, message, status, admin_note | 이메일 매칭 |
| posts | id, slug, title, content, category, status | published 공개 |
| tool_usage_logs | id, tool_type, ip_address, input_summary | admin 조회 |
| domains | id, domain, tld, registrar | 공개 읽기 |
| domain_metrics | id, domain_id, metric_type, data(jsonb) | 공개 읽기 |

---

## 3. 코드 리뷰 결과 (최종)

### 수정 완료

| 심각도 | 이슈 | 수정 |
|--------|------|------|
| HIGH | Rate Limit DB 에러 시 통과 | error 확인 → deny |
| HIGH | 이메일 HTML 인젝션 | escHtml 적용 |
| HIGH | Open Redirect | 상대 경로만 허용 |

### 수용된 리스크

| 이슈 | 이유 |
|------|------|
| Rate Limit 병렬 우회 (최대 +1회) | 3회/일 제한에서 +1회는 수용 가능 |
| localStorage 멀티 디바이스 미지원 | MVP 단계, 추후 DB 이전 예정 |

---

## 4. 향후 구현 계획 (우선순위순)

### Phase 3: 핵심 기능 확장

| 순위 | 기능 | 난이도 | 비고 |
|------|------|--------|------|
| 1 | **Domain Checker** 구현 | 중간 | /tools/domain-checker, 외부 API 연동 |
| 2 | **도메인 페이지** (/domains) | 중간 | 검색, 상세, Whois API |
| 3 | **블로그 마크다운 렌더링** | 낮음 | react-markdown 또는 MDX |
| 4 | **관리자 tool-usage 차트** | 중간 | recharts로 시각화 |

### Phase 4: 수익화

| 순위 | 기능 | 난이도 | 비고 |
|------|------|--------|------|
| 5 | **Pro 플랜 결제** | 높음 | 토스페이먼츠 또는 Stripe |
| 6 | **잔액 충전** | 중간 | 백링크 서비스 일회성 결제 |
| 7 | **Pro 회원 Rate Limit 해제** | 낮음 | profiles.plan 확인 후 제한 완화 |
| 8 | **결제 이력 테이블** | 중간 | payments 테이블 |

### Phase 5: 고급 SEO 도구

| 순위 | 기능 | tool_type | 배지 색상 |
|------|------|-----------|----------|
| 9 | **키워드 분석기** | keyword-analyzer | 노란색 |
| 10 | **백링크 분석기** | backlink-checker | 분홍색 |
| 11 | **페이지 속도 분석** | speed-test | 청록색 |
| 12 | **SEO 점수 변화 추적** | - | 차트 |

### Phase 6: 자동화 + 모니터링

| 순위 | 기능 | 비고 |
|------|------|------|
| 13 | **주간 리포트 자동 발송** | Vercel Cron + DB 설정 이전 |
| 14 | **알림 센터** | 점수 하락, 문의 답변 알림 |
| 15 | **PostHog 분석** | 사용자 행동 추적 |
| 16 | **Sentry 에러 추적** | 에러 모니터링 |

### Phase 7: 데이터 이전 (localStorage → DB)

| 현재 키 | 이전 대상 |
|---------|----------|
| seoworld_favorites | user_favorites 테이블 |
| seoworld_downloads | user_downloads 테이블 또는 Supabase Storage |
| seoworld_weekly_report | profiles.weekly_report_config jsonb |

---

## 5. 새 도구 추가 시 체크리스트

```
1. API Route 생성 (/api/[tool-name]/route.ts)
   - Rate Limit 적용 (checkRateLimit)
   - 로그인 사용자면 analyses 테이블에 저장
   - tool_usage_logs에 기록
2. analyses-list.tsx에 TOOL_LABELS + TOOL_COLORS 추가
3. 도구별 Summary 컴포넌트 추가
4. /tools 페이지에 카드 추가 (data.ts)
5. sitemap.xml에 경로 추가
6. SEO 콘텐츠 (상단 카드 + 하단 FAQ) 추가
→ 분석 이력 탭은 DB 기반 자동 생성이므로 별도 수정 불필요
```

---

## 6. 기술 스택 요약

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 App Router, TypeScript |
| 스타일 | Tailwind CSS, shadcn/ui |
| DB | Supabase Postgres (supabase-js 직접 사용) |
| 인증 | Supabase Auth (이메일 + Google OAuth) |
| LLM | OpenAI API (gpt-4o-mini, fetch 직접 호출) |
| 이메일 | Brevo API v3 |
| 배포 | Vercel |
| DNS | Cloudflare (DNS only) |
| 도메인 | seoworld.co.kr |

---

## 7. 환경변수

| 변수 | 용도 | 필수 |
|------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL | 필수 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 익명 키 | 필수 |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 서비스 키 | 필수 |
| NEXT_PUBLIC_SITE_URL | 사이트 URL | 필수 |
| OPENAI_API_KEY | OpenAI (audit, meta-analyze) | 필수 |
| BREVO_API_KEY | Brevo 이메일 | 선택 |

---

## 8. Git 통계

- 브랜치: master
- 총 커밋: 30+
- 배포: Vercel 자동 배포 (GitHub push 시)
- 마지막 빌드: 49 라우트, 에러 0
