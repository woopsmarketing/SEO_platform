# 대시보드 아키텍처 및 향후 계획

> 최종 업데이트: 2026-03-27

---

## 1. 현재 대시보드 데이터 구조

### 데이터 흐름

```
사용자 로그인 (Supabase Auth)
  ↓
대시보드 페이지 접속 (서버 컴포넌트)
  ↓
서버에서 Supabase JS Client로 DB 직접 조회 (API Route 거치지 않음)
  ↓
쿠키의 세션 토큰으로 user_id 확인
  ↓
user_id로 필터링된 데이터만 조회 (RLS + 코드 필터 이중 보호)
  ↓
서버에서 HTML 렌더링 → 클라이언트에 전달
```

**중요**: 대시보드는 API Route를 거치지 않습니다. Next.js 서버 컴포넌트에서 직접 Supabase를 조회합니다.

### 회원별 데이터 소스

| 페이지 | 테이블 | 필터 | 조회 방식 |
|--------|--------|------|-----------|
| 대시보드 메인 | profiles | id = user_id | 서버 컴포넌트 직접 조회 |
| 대시보드 메인 | analyses | user_id = user_id | 서버 컴포넌트 직접 조회 |
| 대시보드 메인 | inquiries | email = user_email | 서버 컴포넌트 직접 조회 |
| 분석 이력 | analyses | user_id = user_id | 서버 컴포넌트 직접 조회 |
| 내 문의 | inquiries | email = user_email | 서버 컴포넌트 직접 조회 |
| 즐겨찾기 | localStorage | 브라우저 로컬 | 클라이언트 컴포넌트 |
| 경쟁사 비교 | /api/audit 호출 | 실시간 분석 | 클라이언트 → API Route |
| 주간 리포트 | localStorage | 브라우저 로컬 | 클라이언트 컴포넌트 |
| 다운로드 센터 | localStorage | 브라우저 로컬 | 클라이언트 컴포넌트 |
| 프로필 설정 | profiles + auth | id = user_id | 서버 + 클라이언트 혼합 |

### DB 테이블별 스키마

#### profiles (회원 정보)
```sql
id          uuid PK (auth.users 연결)
email       text
display_name text
role        text ('user' | 'admin')
plan        text ('free' | 'pro')    -- 구독 플랜
balance     integer (default 0)       -- 잔액 (원)
created_at  timestamptz
updated_at  timestamptz
```

#### analyses (분석 이력)
```sql
id            bigint PK
user_id       uuid FK → profiles
tool_type     text ('onpage-audit' | 'meta-analyzer' | ...)
input_summary text (분석한 URL)
score         integer (0~100, nullable)
input         jsonb ({ url: "..." })
result        jsonb ({ summary: {...}, analysis: "..." })
created_at    timestamptz
```

result.summary 구조 (온페이지):
```json
{
  "title": "페이지 제목",
  "statusCode": 200,
  "loadTimeMs": 2500,
  "isHttps": true,
  "hasCanonical": true,
  "h1Count": 1,
  "imgTotal": 5,
  "imgWithoutAlt": 0,
  "internalLinks": 30,
  "externalLinks": 2,
  "hasOg": true,
  "hasJsonLd": true,
  "structuredDataTypes": ["Organization", "WebSite"]
}
```

result.summary 구조 (메타태그):
```json
{
  "title": "페이지 제목",
  "titleLength": 37,
  "description": "설명...",
  "descriptionLength": 77,
  "hasCanonical": true,
  "hasOgTitle": true,
  "hasOgDescription": true,
  "hasOgImage": true,
  "hasTwitterCard": true,
  "hasJsonLd": true,
  "lang": "ko",
  "issuesCount": 2
}
```

#### inquiries (서비스 문의)
```sql
id            bigint PK
user_id       uuid FK → profiles (nullable)
name          text
email         text
company       text (nullable)
service_type  text ('backlinks' | 'traffic' | 'web-design' | 'domain-broker' | 'general')
message       text
status        text ('pending' | 'in_progress' | 'resolved' | 'closed')
admin_note    text (nullable)
created_at    timestamptz
updated_at    timestamptz
```

### 보안 (RLS 정책)

```sql
-- profiles: 본인만 조회/수정
SELECT: auth.uid() = id
UPDATE: auth.uid() = id

-- analyses: 본인만 조회, 본인만 생성
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id (+ service_role 정책)

-- inquiries: 이메일 기반 조회
SELECT: email = (SELECT email FROM auth.users WHERE id = auth.uid())
INSERT: 누구나 (비인증 문의 허용)
```

### 분석 결과 저장 흐름

```
사용자가 /tools/onpage-audit에서 URL 분석
  ↓
POST /api/audit (API Route)
  ↓
1. 대상 URL fetch → HTML 파싱 (35개 항목)
2. OpenAI API 호출 → AI 분석 결과
3. tool_usage_logs에 기록 (service_role)
4. 쿠키에서 세션 확인 → 로그인 여부 판단
   ├─ 비로그인: tool_usage_logs만 기록
   └─ 로그인: analyses 테이블에 저장 (user_id, score, summary)
5. 클라이언트에 결과 반환
```

---

## 2. 현재 구현 완료 기능

### 대시보드 사이드바 메뉴 (8개)

| 메뉴 | 경로 | 데이터 | 상태 |
|------|------|--------|------|
| 대시보드 | /dashboard | DB (analyses + inquiries + profiles) | 완료 |
| 분석 이력 | /dashboard/analyses | DB (analyses) | 완료 |
| 내 문의 | /dashboard/inquiries | DB (inquiries) | 완료 |
| 즐겨찾기 도메인 | /dashboard/favorites | localStorage | 완료 |
| 경쟁사 비교 | /dashboard/competitors | /api/audit 실시간 | 완료 |
| 주간 SEO 리포트 | /dashboard/weekly-report | localStorage + /api/weekly-report | 완료 |
| 다운로드 센터 | /dashboard/downloads | localStorage | 완료 |
| 프로필 설정 | /dashboard/settings | DB (profiles + auth) | 완료 |

### 대시보드 메인 통계 카드 (4개)

1. 총 분석 — analyses 테이블 count
2. 서비스 문의 — inquiries 테이블 count (이메일 매칭)
3. 구독 플랜 — profiles.plan (Free/Pro 뱃지)
4. 잔액 — profiles.balance (₩원화)

### 분석 이력 탭 필터

- DB의 tool_type 기반 자동 생성 (하드코딩 아님)
- 새 도구 추가 시 코드 수정 없이 탭 자동 추가
- 미리 등록된 도구: onpage-audit, meta-analyzer, domain-checker, keyword-analyzer, backlink-checker, speed-test

---

## 3. 향후 추가 기능 계획

### 우선순위 1: Domain Checker (/tools/domain-checker)

현재 스캐폴딩만 존재. 구현 시:
- tool_type: "domain-checker"
- 분석 결과: DA, PA, 백링크 수, 스팸 스코어 등
- analyses 테이블에 저장 → 분석 이력에 자동 탭 추가 (녹색 배지)
- summary: { da, pa, backlinks, spamScore, age, registrar }

### 우선순위 2: 키워드 분석기

- tool_type: "keyword-analyzer"
- 기능: 타겟 키워드의 검색량, 경쟁도, 관련 키워드 제안
- 외부 API 연동 필요 (Google Keyword Planner API 또는 대안)
- analyses 테이블에 저장 → 노란색 배지

### 우선순위 3: 백링크 분석기

- tool_type: "backlink-checker"
- 기능: 내 사이트의 백링크 현황 조회
- 외부 API 연동 필요 (Moz, Ahrefs API 등)
- analyses 테이블에 저장 → 분홍색 배지

### 우선순위 4: 페이지 속도 분석

- tool_type: "speed-test"
- 기능: Core Web Vitals (LCP, FID, CLS) 측정
- Google PageSpeed Insights API 활용
- analyses 테이블에 저장 → 청록색 배지

### 우선순위 5: SEO 점수 변화 추적

- 같은 URL을 여러 번 분석하면 analyses 테이블에 이력이 쌓임
- input_summary(URL)로 그룹핑 → 시간순 점수 변화 차트
- 라이브러리: recharts 또는 chart.js

### 우선순위 6: 주간 리포트 자동 발송

현재: 수동 발송 (버튼 클릭)
목표: Vercel Cron으로 자동 발송
필요 작업:
- weekly_report_settings를 localStorage → DB로 이전
- profiles 테이블에 weekly_report_config jsonb 컬럼 추가
- /api/cron/weekly-report API Route 생성
- vercel.json에 cron 설정 추가

### 우선순위 7: 구독/결제 시스템

현재: profiles.plan (free/pro), profiles.balance (잔액)만 존재
목표:
- 결제 연동 (토스페이먼츠 또는 Stripe)
- Pro 플랜: 분석 횟수 제한 해제, 경쟁사 비교 무제한 등
- 잔액 충전: 백링크 서비스 등 일회성 결제에 사용
- 결제 이력 테이블 (payments) 필요

### 우선순위 8: 알림 센터

- SEO 점수 하락 시 이메일 알림
- 문의 답변 시 이메일 알림
- 대시보드 내 알림 벨 아이콘

---

## 4. 새 도구 추가 시 체크리스트

1. API Route 생성 (/api/[tool-name]/route.ts)
2. analyses 테이블에 저장 (tool_type, input_summary, score, summary)
3. TOOL_LABELS에 한글 라벨 추가 (analyses-list.tsx)
4. TOOL_COLORS에 색상 추가 (analyses-list.tsx)
5. 도구별 Summary 컴포넌트 추가 (AuditSummary처럼)
6. /tools 페이지에 카드 추가 (data.ts)
7. sitemap.xml에 경로 추가

분석 이력 탭은 DB 기반 자동 생성이므로 별도 수정 불필요.

---

## 5. localStorage 사용 항목 (DB 이전 후보)

| 키 | 용도 | DB 이전 시 |
|----|------|-----------|
| seoworld_favorites | 즐겨찾기 도메인 | user_favorites 테이블 |
| seoworld_downloads | 다운로드 이력 | user_downloads 테이블 또는 Supabase Storage |
| seoworld_weekly_report | 주간 리포트 설정 | profiles.weekly_report_config jsonb |

현재는 MVP 단계이므로 localStorage 사용. 사용자가 다른 기기에서 접속하면 데이터가 보이지 않는 한계가 있음. 추후 DB 이전 시 멀티 디바이스 지원 가능.
