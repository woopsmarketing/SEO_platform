# SEO월드 — Claude Code 작업 원칙

## 프로젝트 개요
SEO월드(seoworld.co.kr) — SEO 무료 분석 툴 + 도메인 정보 + 서비스 문의 플랫폼

## 기술 스택 (확정 — 변경 금지)
- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Supabase Auth, Supabase Postgres, Supabase Storage
- Supabase JS Client (@supabase/supabase-js) — ORM 없이 직접 사용
- Supabase MCP로 테이블 관리
- Vercel 배포
- Sentry, PostHog, Vercel Analytics
- Resend (이메일)

## 주요 명령어
```bash
# WSL2 + /mnt/d/ 환경 — bin-links 불가로 node 직접 실행
cd apps/web && node node_modules/next/dist/bin/next dev     # 개발 서버
cd apps/web && node node_modules/next/dist/bin/next build   # 빌드
cd apps/web && node node_modules/next/dist/bin/next lint    # 린트

# 의존성 설치 (WSL2 symlink 제한 우회)
cd apps/web && npm install --bin-links=false --ignore-scripts
```

## 작업 슬래시 커맨드
- `/do [요청]` : 짧은 요청을 명세서로 변환 후 구현
- `/fix [에러]` : 에러 진단 및 수정
- `/done` : 작업 완료 처리 (commit + 상태 업데이트 + 보고서)
- `/status-update` : 코드베이스 분석 후 문서 업데이트

## 아키텍처 원칙
1. 단일 도메인 + 하위 디렉토리 URL 구조
2. 내부 코드는 모듈형 구조 (domains, tools, services, cms, admin)
3. MVP에서 Redis 사용 금지 — DB 기반 캐시
4. 캐시 = 이력 = 스냅샷 (DB가 세 역할 동시 수행)
5. stale 정책으로 외부 API 재호출 여부 결정
6. 백그라운드 작업은 cron + route + 단순 배치 형태로 시작
7. 기능 수보다 코어 구조 안정성 우선

## 코딩 규칙
- Server Actions는 Auth(signIn, signUp, signOut) 등 제한적으로만 사용
- 공개 페이지는 SSR/SSG 활용하여 SEO 최적화
- 컴포넌트는 `apps/web/src/components/` 아래 기능별 정리 (ui/, layout/)
- DB 스키마는 Supabase Dashboard 또는 MCP로 관리 (ORM 미사용)
- API 라우트는 `apps/web/src/app/api/` 아래 배치
- 비인증 유저의 DB 쓰기(문의, 툴 로그)는 API Route + service_role로 처리
- Supabase 클라이언트: client.ts(브라우저), server.ts(서버컴포넌트), admin.ts(service_role)
- 환경변수는 `.env.local` 사용, `.env.example`에 키 목록 유지

## WSL2 환경 주의사항
- 프로젝트 경로가 `/mnt/d/` (Windows 파일시스템) — symlink 불가
- npm install 시 반드시 `--bin-links=false --ignore-scripts` 사용
- next CLI: `node node_modules/next/dist/bin/next` (npx next 불가)
- npm workspaces 비활성화 상태 (packages/는 빈 placeholder)

## 범위 통제 규칙
- MVP 범위 외 기능을 임의로 추가하지 마라
- 결제/구독/자동 주문 처리 넣지 마라
- 과도한 추상화, DDD, 마이크로서비스 설계 금지
- 불필요한 디자인 시스템 과설계 금지
- vague placeholder 문장으로 문서를 채우지 마라

## 작업 출력 형식
1. 설계 요약
2. 파일 업데이트 내용
3. 실제 코드
4. 생성된 구조
5. 다음 권장 작업

## 금지사항
- Stripe, 결제 시스템
- Redis, BullMQ, 큐 인프라
- Prisma, Drizzle 등 ORM (supabase-js 직접 사용)
- NextAuth (Supabase Auth 사용)
- Zustand (필요 시 검토, 기본은 서버 상태 중심)
- 하위도메인 분리
- 내가 요구하지 않은 기능 임의 추가
