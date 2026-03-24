# SEO월드 운영 런북

## 1. 로컬 개발 환경 시작

### 사전 요구사항
- Node.js 20+
- npm 10+
- Supabase 프로젝트 (Postgres DB, Auth)
- WSL2 환경 (프로젝트가 /mnt/d/ 하위에 있음)

### 초기 설정
```bash
# 1. 저장소 클론
git clone <repo-url> && cd SEO_platform

# 2. 의존성 설치 (WSL2 symlink 제한 우회)
cd apps/web && npm install --bin-links=false --ignore-scripts

# 3. 환경변수 설정
cp ../../.env.example .env.local
# .env.local 파일을 열고 실제 Supabase 키 입력

# 4. 개발 서버 시작
node node_modules/next/dist/bin/next dev
# http://localhost:3000 에서 확인
```

### 개발 서버 명령어
```bash
cd apps/web
node node_modules/next/dist/bin/next dev     # 개발 서버 (포트 3000)
node node_modules/next/dist/bin/next build   # 프로덕션 빌드
node node_modules/next/dist/bin/next lint    # ESLint 실행
node node_modules/next/dist/bin/next start   # 프로덕션 모드 시작
```

> **참고:** WSL2 + /mnt/d/ 환경에서는 `npx next`가 동작하지 않으므로 node 직접 경로를 사용한다.

## 2. 환경변수 설정

`.env.local` 파일에 아래 값들이 필요하다.

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | O |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | O |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (서버만) | O |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | O |
| `ANTHROPIC_API_KEY` | Claude AI (On-page Audit) | 선택 (없으면 파싱만) |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Google Search Console 인증 | 선택 |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | Naver Search Advisor 인증 | 선택 |
| `RESEND_API_KEY` | Resend 이메일 API 키 | 미구현 |
| `SENTRY_DSN` | Sentry DSN | 미구현 |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog 프로젝트 키 | 미구현 |

> `DATABASE_URL`은 현재 미사용 (supabase-js 직접 사용, ORM 없음)

## 3. DB 구조

### Supabase 설정
1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. Settings > API에서 URL과 키 확인
3. SQL Editor에서 마이그레이션 실행

### DB 테이블 (7개)
| 테이블 | 설명 | RLS |
|--------|------|-----|
| `profiles` | 유저 프로필 (auth.users 확장) | 본인만 읽기/수정 |
| `domains` | 도메인 기본 정보 | 공개 읽기 |
| `domain_metrics` | SEO 지표 캐시/스냅샷 | 공개 읽기 |
| `inquiries` | 서비스 문의 | API route로 삽입, admin만 조회 |
| `analyses` | 사용자 분석 결과 | 본인만 CRUD |
| `posts` | 블로그/가이드 | published만 공개, admin 전체 관리 |
| `tool_usage_logs` | 툴 사용 기록 | API route로 삽입, admin만 조회 |

### 마이그레이션 적용
```bash
# Supabase SQL Editor에서 실행하거나 Management API로 실행
# 파일 위치: apps/web/supabase/migrations/001_initial_schema.sql
```

### 주요 트리거
- `handle_new_user()` — auth.users INSERT 시 profiles 자동 생성
- `update_updated_at()` — profiles, domains, inquiries, posts의 updated_at 자동 갱신

## 4. Supabase 클라이언트 사용법

```
src/lib/supabase/
├── client.ts      # 브라우저용 (createBrowserClient)
├── server.ts      # Server Component/Action용 (createServerClient + cookies)
├── admin.ts       # service_role용 — API Route에서만 사용
├── middleware.ts   # Next.js middleware용 (세션 갱신 + 라우트 보호)
└── actions.ts     # Server Actions (signIn, signUp, signOut)
```

**사용 원칙:**
- 클라이언트 컴포넌트 → `client.ts`
- 서버 컴포넌트/서버 액션 → `server.ts`
- API Route에서 비인증 데이터 쓰기 → `admin.ts` (service_role)
- `admin.ts`는 절대 클라이언트에 노출하지 않는다

## 5. 인증 플로우

```
회원가입 → Supabase Auth signUp → 이메일 확인 → 로그인
로그인 → signInWithPassword → /dashboard 리다이렉트
로그아웃 → signOut → / 리다이렉트
비인증 → /dashboard, /admin 접근 시 → /login?redirect= 리다이렉트
```

- middleware.ts에서 세션 토큰 자동 갱신
- profiles 테이블의 `role` 필드로 admin 권한 체크

## 6. API 라우트

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|--------|------|------|
| `/api/health` | GET | 불필요 | 서버 + DB 상태 확인 |
| `/api/inquiries` | POST | 불필요 | 서비스 문의 생성 (service_role, 입력값 검증) |
| `/api/inquiries/[id]` | PATCH | admin | 문의 상태/메모 변경 |
| `/api/tool-usage` | POST | 불필요 | 툴 사용 로그 기록 (IP, UA 포함) |
| `/api/audit` | POST | 불필요 | HTML 파싱 + Claude AI SEO 분석 (ANTHROPIC_API_KEY 필요) |
| `/api/crawl` | POST | 불필요 | robots.txt + sitemap 파싱 + 내부 링크 크롤링 |
| `/api/posts` | POST | admin | 게시글 생성 |
| `/api/posts/[id]` | PATCH | admin | 게시글 수정 |
| `/api/posts/[id]` | DELETE | admin | 게시글 삭제 |
| `/auth/callback` | GET | — | OAuth/이메일 확인 콜백 |

## 7. 배포

### Vercel 배포
```bash
npm i -g vercel
vercel          # 프리뷰 배포
vercel --prod   # 프로덕션 배포
```

### Vercel 설정
- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: `npm run build`
- Install Command: `npm install`
- 환경변수: Vercel Dashboard > Settings > Environment Variables에 등록

### 배포 체크리스트
1. `next build` 로컬에서 에러 없이 완료 확인
2. `next lint` 경고/에러 없음 확인
3. 환경변수 모두 Vercel에 등록
4. Supabase에서 Vercel 도메인을 Auth 리다이렉트 URL에 추가
5. 커스텀 도메인(seoworld.co.kr) Vercel에 연결

## 8. Cron / 배치 작업

MVP에서는 복잡한 큐를 사용하지 않는다:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/domain-sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## 9. 장애 확인

| 확인 대상 | 방법 |
|-----------|------|
| 앱 상태 | `GET /api/health` |
| 에러 로그 | Sentry Dashboard (미연동) |
| 배포 상태 | Vercel Dashboard > Deployments |
| DB 상태 | Supabase Dashboard > Database |
| Auth 상태 | Supabase Dashboard > Auth > Users |

## 10. 트러블슈팅

### WSL2에서 npm install 실패
```bash
# symlink 에러 발생 시:
cd apps/web
rm -rf node_modules
npm install --bin-links=false --ignore-scripts
```

### 개발 서버가 안 뜰 때
```bash
cd apps/web
rm -rf .next node_modules
npm install --bin-links=false --ignore-scripts
node node_modules/next/dist/bin/next dev
```

### DB 연결 실패
1. `.env.local`의 Supabase URL/키 확인
2. `GET /api/health` 응답의 `database` 필드 확인
3. Supabase Dashboard에서 DB 상태 확인
