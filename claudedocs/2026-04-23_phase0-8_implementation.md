# SEO월드 Phase 0~8 구현 전체 정리

**구현일**: 2026-04-23
**스킵**: Phase 6-1 (네이버 검색 연동 — 현재 계획 없음)
**방식**: Wave 기반 병렬 에이전트 오케스트레이션 + 각 Phase 단위 테스트 통과 시 완료 간주
**최종 검증**: Next.js production build 성공 · tsc --noEmit 0 에러 · **288/288 단위 테스트 통과**

---

## 1. 요약 — 한눈에 보기

| 구분 | 개수 | 내용 |
|---|---|---|
| **신규 툴** | 15개 | 도메인 권위 · SERP · 갭 분석 · 콘텐츠 · 백링크 복구 |
| **업그레이드된 기존 툴** | 4개 | 백링크 체커, 키워드 리서치, 온페이지 감사, 홈 Hero |
| **신규 인프라** | 5개 | DomainMetricsCard 공유, Changelog 배너, /updates, SERP 추적 DB/cron, /dashboard/seo |
| **사용한 외부 API** | 4개 | Serper (SERP), RapidAPI (Moz/Ahrefs/Majestic), VebAPI (백링크/키워드), OpenAI (gpt-4o-mini) |
| **공용 캐시 적용** | 2종 | metrics (30일 TTL), serp (14일 TTL) — backlinkshop.co.kr 공유 |

---

## 2. Phase별 상세

### Phase 0 — 공유 인프라 (16/16 테스트 통과)

여러 Phase가 공유할 기반 작업. 먼저 구축.

#### 신규 파일
- `src/components/domain-metrics-card.tsx` — Moz DA, Ahrefs DR, Majestic TF를 3개 타일로 표시하는 공유 컴포넌트. `toNumber`, `formatCount`, `metricTier`, `hasAnyCoreMetric` 헬퍼 포함. `compact` 프롭으로 축약 모드 지원.
- `src/lib/changelog.ts` — `CHANGELOG` 배열 + `CURRENT_VERSION` 상수 + `latestEntry()` 헬퍼. v1.4.0 (2026-04-23) 엔트리 추가.
- `src/components/changelog-banner.tsx` — 홈/툴 상단에 표시되는 업데이트 배너. `variant="default"` (카드), `variant="compact"` (한 줄). localStorage로 버전별 닫기 상태 저장.
- `src/app/(public)/updates/page.tsx` — 전체 변경 이력 페이지.

#### 수정 파일
- `src/app/(public)/tools/onpage-audit/audit-form.tsx` — 기존 내부에 있던 DomainMetricsCard 로컬 정의 제거, 공유 컴포넌트 import.
- `src/app/(public)/page.tsx` — 홈 상단에 `<ChangelogBanner />` 배치.
- `src/app/(public)/tools/onpage-audit/page.tsx` — 툴 페이지 상단에 `<ChangelogBanner variant="compact" />`.
- `package.json` — recharts@3.8.1 설치.

---

### Phase 1 — 도메인 권위 툴 (18/18 테스트 통과)

도메인의 Moz DA · Ahrefs DR · Majestic TF 지표를 활용한 신규 툴 + 기존 툴 강화.

#### 신규 툴 2개
1. **도메인 권위 체커** (`/tools/domain-authority`)
   - 도메인 입력 → DomainMetricsCard 표시
   - 5개 예시 버튼(naver.com, daum.net, kmong.com, seoworld.co.kr, coupang.com)
   - `?d=example.com` 쿼리로 딥링크 자동 분석
   - **캐시 경유**: `fetchWithCache("metrics", { domain })` GET-only
   - RAPIDAPI_KEY를 SEO월드는 보유하지 않음. MISS 시 백링크샵이 fallthrough로 채워줌.

2. **도메인 비교기** (`/tools/domain-compare`)
   - 두 도메인 나란히 비교
   - **5축 RadarChart** (recharts): Moz DA / Ahrefs DR / Majestic TF / 참조 도메인(정규화) / 트래픽(정규화)
   - 상세 비교 표 (차이 +/- 하이라이트)

#### 기존 툴 업그레이드
3. **백링크 분석기** (`/tools/backlink-checker`)
   - VebAPI 백링크 호출과 **병렬**로 대상 도메인 metrics 조회
   - 결과 상단에 `<DomainMetricsCard compact />` 추가

4. **경쟁사 분석** (`src/lib/competitor-analyzer.ts`)
   - SERP 결과의 경쟁사 도메인들에도 metrics 캐시 병렬 조회
   - AI 리포트 프롬프트 테이블에 Moz DA / Ahrefs DR 컬럼 포함
   - 이메일 리포트 템플릿에도 DA/DR 컬럼 추가

5. **홈 Hero** (`src/components/hero-analyzer.tsx`)
   - 탭형으로 리팩토링: "온페이지 SEO 분석" / "도메인 권위 (DA/DR/TF)"
   - 도메인 권위 탭에서 3대 지표 미니 타일 + "전체 분석 보기" 딥링크

---

### Phase 2 — SERP 툴 (32/32 테스트 통과)

구글 검색 결과를 활용한 신규 툴 3개 + 기존 키워드 리서치 강화.

#### 신규 툴 3개
1. **SERP 순위 체커** (`/tools/serp-checker`)
   - 키워드 + 도메인 입력 → 구글 상위 100위 내 내 도메인 순위
   - **캐시 경유**: `fetchWithCache("serp", { keyword })` → MISS 시 Serper 호출 + `saveToCache`
   - 서브도메인 포함 매칭 (`endsWith("." + domain)`)
   - 순위 없을 시 "상위 100위 밖" 안내

2. **지역 SERP 체커** (`/tools/local-serp`)
   - 10개 국가·언어 (KR/ko, US/en, JP/ja 등) 선택
   - Serper `gl` / `hl` / `location` 파라미터
   - **캐시 미경유** (지역별 결과 혼입 방지)

3. **People Also Ask** (`/tools/people-also-ask`)
   - Serper 응답의 `peopleAlsoAsk` 필드 추출
   - 아코디언 UI, `relatedSearches` fallback

#### 기존 툴 업그레이드
4. **키워드 리서치** (`/tools/keyword-research`)
   - VebAPI 응답에 **경쟁도(avgDA)** 컬럼 추가
   - 상위 10개 키워드 × 상위 3개 SERP 도메인의 Moz DA 평균
   - `Promise.allSettled` 실패 내성, tier 배지 (녹/황/적)

---

### Phase 3 — 백링크 강화 (19/19 테스트 통과)

기존 백링크 분석기를 4가지 축으로 강화.

#### 강화 항목 4개
1. **소스 도메인 DA 컬럼**
   - 상위 20개 백링크의 `url_from` 호스트 추출
   - `Promise.allSettled`로 metrics 캐시 병렬 조회
   - 테이블에 "소스 DA" 컬럼 추가 (tier 색상)

2. **백링크 품질 점수**
   - 공식: `sourceDA * 0.6 + (doFollow ? 40 : 10) + anchorDiversityBonus` (0~100)
   - 각 백링크 `qualityScore`, 전체 `avgQualityScore`, `anchorDiversityRatio` 계산
   - UI: 품질 배지 (우수/양호/주의) + 요약 카드

3. **최근 30일 신규 필터**
   - `first_seen` 기준 클라이언트 필터 토글
   - "전체 / 최근 30일 신규" 버튼 + 각 개수 표시

4. **90일 성장 추세 그래프**
   - recharts `AreaChart`로 일별 누적 백링크 증가 추이
   - 데이터 없으면 차트 숨김

---

### Phase 4 — 갭 분석 툴 (36/36 테스트 통과)

경쟁사 대비 차이를 찾아내는 3개 신규 툴.

#### 신규 툴 3개
1. **백링크 갭 분석** (`/tools/backlink-gap`)
   - 내 도메인 vs 경쟁 도메인 백링크 차집합
   - `onlyCompetitor` / `common` / `onlyMine` 3분할
   - 경쟁사만 가진 상위 30개 소스에 대해 **metrics 캐시 조회** → DA 내림차순

2. **키워드 갭 분석** (`/tools/keyword-gap`)
   - 키워드 30개까지 SERP 매칭 (`fetchWithCache("serp")`)
   - 내/경쟁 순위 추출 → 경쟁사만 잡은 키워드 추출
   - 탭형 (경쟁사만/공통/나만) + CSV 다운로드

3. **경쟁사 도메인 발굴** (`/tools/competitor-discovery`)
   - 시드 키워드 → Serper 상위 20 organic → 고유 10~15개 도메인 추출
   - 각 도메인 metrics 캐시 조회 → DA 내림차순
   - 각 행에 `/tools/domain-authority?d=...` 심층 분석 링크

---

### Phase 5 — 콘텐츠 툴 (45/45 테스트 통과)

AI + SERP 데이터로 콘텐츠 전략을 돕는 4개 신규 툴.

#### 신규 툴 4개
1. **롱테일 키워드 발굴기** (`/tools/longtail-keywords`)
   - VebAPI keyword research로 30~50개 확장 (없으면 Serper autocomplete fallback)
   - 분류: 3단어+ 롱테일 / 질문형 ('어떻게/왜/무엇') / 미디엄
   - 상위 10개는 SERP → metrics 캐시로 avgDA 채움

2. **스니펫 옵티마이저** (`/tools/snippet-optimizer`)
   - URL + 키워드 입력
   - 현재 페이지 title/meta 추출 + 상위 5개 경쟁 스니펫
   - **OpenAI gpt-4o-mini**로 CTR 향상 title 2안 + description 1안 제안
   - 3단 비교 UI (현재 / 경쟁 / AI 제안)

3. **콘텐츠 갭 분석** (`/tools/content-gap`)
   - 두 URL의 텍스트 + H2/H3 추출
   - OpenAI로 각 페이지 토픽 10개씩 추출
   - 3분할 (내 것 / 공통 / 경쟁사만) + AI 추천 토픽 3개

4. **SERP 난이도 맵** (`/tools/serp-difficulty`)
   - 키워드 입력 → Serper 상위 10개 도메인 metrics 조회
   - 난이도 점수: `avgDA*0.4 + avgDR*0.4 + avgTF*0.2`
   - 구간: `<30` 낮음 / `<50` 보통 / `<70` 어려움 / `≥70` 매우 어려움
   - recharts BarChart (순위별 DA)

---

### Phase 6-2 / 6-3 — 공통 백링크 + 내 노출 키워드 (36/36 테스트 통과)

※ 6-1 네이버 검색 연동은 스킵

#### 신규 툴 2개
1. **공통 백링크 도메인** (`/tools/common-backlinks`)
   - 2~5개 도메인 입력
   - 각 도메인 VebAPI 백링크 병렬 호출 + Set intersection
   - 공통 referring 도메인 상위 30개 metrics 조회 → DA 내림차순
   - CSV 다운로드

2. **내 노출 키워드 TOP 20** (`/tools/my-top-keywords`)
   - VebAPI로 시드 50개 확보 → 각 키워드 SERP 캐시 → 내 도메인 순위 추출
   - 순위 오름차순 TOP 20 + 경쟁도(avgDA) 컬럼
   - 순위 배지 (🥇1-3, 🥈4-10, 🥉11-20)
   - 동시성 10개로 제한한 배치 처리

---

### Phase 7 — 트래킹 DB · Cron · 대시보드 (43/43 테스트 통과)

장기 추적 기능 기반 구축.

#### Supabase 테이블 3개 (적용 대기)
SQL 파일: `supabase/migrations/20260423_phase7_tracking.sql`

1. **tracked_keywords** — 사용자가 추적하는 키워드
   - `id, user_id, domain, keyword, gl, hl, is_active, created_at`
   - unique `(user_id, domain, keyword)`

2. **serp_tracking** — 일일 순위 기록
   - `id, tracked_keyword_id, rank (null=100위밖), url, checked_at`
   - index `(tracked_keyword_id, checked_at desc)`

3. **broken_backlinks** — 깨진 백링크 이력
   - `user_id, target_domain, source_url, target_url, status_code, first_detected_at, last_checked_at, resolved`

모든 테이블 RLS 활성화 + `auth.uid()` 기준 policy.

#### Cron 1개
- **`/api/cron/serp-tracking`** — 매일 09:00 KST (00:00 UTC)
- `tracked_keywords`에서 활성 키워드 전부 조회
- 5개씩 배치로 Serper 캐시 조회 + 순위 매칭 → `serp_tracking` insert
- `Authorization: Bearer ${CRON_SECRET}` 검증
- `vercel.json`에 스케줄 등록

#### 신규 툴 1개
5. **깨진 백링크 복구** (`/tools/broken-backlink-recovery`)
   - VebAPI 백링크 조회 → 상위 50개 target URL을 HEAD/GET으로 상태 확인
   - 404/410만 broken으로 분류 (Promise.allSettled, 5s timeout)
   - 로그인 시 `broken_backlinks`에 upsert
   - UI: 소스/타겟 URL 표 + 301 redirect 복구 가이드

#### 신규 대시보드
- **`/dashboard/seo`** — 기존 `/dashboard`와 충돌 방지를 위해 sub-route로 이동
- 서버 컴포넌트에서 데이터 pre-fetch:
  - 추적 키워드 수 + 평균 순위
  - 미복구 깨진 백링크 수
  - 이번 주 순위 상승/하락 TOP 3
  - 추적 키워드 표 + 각 행에 최근 30일 **recharts 스파크라인**
- 인라인 추가/삭제 폼 (`/api/tracked-keywords` GET/POST/DELETE)

---

### Phase 8 — 폴리시 (42/42 테스트 통과)

전환율과 UX를 다듬는 마지막 단계.

#### 1. 개인화 CTA (`src/components/smart-service-cta.tsx`)
`ToolResultCta` 컴포넌트 신규 추가. 툴 결과 값에 따라 다른 CTA 2개 노출.

| 툴 | 조건 | CTA 변경 |
|---|---|---|
| domain-authority | DA < 30 | "백링크 서비스로 권위 높이기" + 크몽 패키지 |
| domain-authority | DA 30~60 | "키워드 상위노출 컨설팅" + 추가 백링크 |
| domain-authority | DA ≥ 60 | "트래픽 극대화 서비스" + 맞춤 SEO |
| serp-checker | rank null/> 50 | "SEO 컨설팅" + 색인·권위 백링크 |
| serp-checker | 10 < rank ≤ 50 | "페이지 리라이트+백링크" + TOP 10 컨설팅 |
| serp-checker | rank ≤ 10 | "1위 진입 백링크" + 트래픽 확장 |
| onpage-audit | score < 50 | "종합 SEO 서비스" + 크몽 패키지 |
| onpage-audit | 50 ≤ score < 80 | "부족 항목 수정 대행" + 백링크 부스트 |
| onpage-audit | score ≥ 80 | "콘텐츠 마케팅" + 전환 최적화 |

기존 `SmartServiceCta({ parsed })` 시그니처는 그대로 유지 (backward compatible).

#### 2. NEW/HOT 뱃지
- `Tool` 인터페이스에 `badge?: "NEW" | "HOT"` 추가
- **NEW** (14개 신규 툴): domain-authority, domain-compare, serp-checker, local-serp, people-also-ask, serp-difficulty, longtail-keywords, snippet-optimizer, content-gap, keyword-gap, backlink-gap, common-backlinks, competitor-discovery, my-top-keywords (+ broken-backlink-recovery)
- **HOT** (3개 인기 툴): onpage-audit, backlink-checker, keyword-research
- `ToolCard`에 오른쪽 상단 absolute 뱃지 (NEW=파랑, HOT=빨강)

#### 3. 교차 추천 강화 (`related-tools.tsx`)
- 기존 `TOOL_MAP` 수동 큐레이션 유지
- `TOOL_MAP[slug] ?? fallbackFromData(slug)` 패턴 추가
- 매핑 없을 시 `data.ts` 기반 결정적 셔플 3개 반환
- `getToolBySlug()`, `getFallbackRelatedTools()` 헬퍼 추가

#### 4. 블로그 툴 임베드 (`src/components/blog/tool-embed.tsx`)
- 블로그 본문 중간에 삽입 가능한 `<ToolEmbed tool="..." />` 미니 카드
- 아이콘 + 타이틀 + 설명 + "이 도구 사용하기" 버튼 → `/tools/${slug}`

---

## 3. 외부 API 활용 & 공용 캐시 맵

### 3개 프로젝트(백링크샵/도메인체커/SEO월드) 공용 캐시 (`backlinkshop.co.kr`)

| 캐시 타입 | TTL | 사용하는 툴 |
|---|---|---|
| `metrics` | 30일 | domain-authority, domain-compare, backlink-checker 대상+소스, competitor-analyzer, competitor-discovery, backlink-gap, common-backlinks, my-top-keywords avgDA, keyword-research avgDA, longtail avgDA, serp-difficulty, hero-analyzer |
| `serp` | 14일 | serp-checker, competitor-analyzer, keyword-gap, competitor-discovery, longtail avgDA, serp-difficulty, my-top-keywords, serp-tracking cron |
| `backlink` | 30일 | — (집계 스펙만 지원, SEO월드 UI는 개별 백링크 목록 필요 — 스킵) |

### API별 역할

| API | 키 보유 | 역할 |
|---|---|---|
| **Serper** | ✅ `SERPER_API_KEY` | 구글 SERP (캐시 MISS 시 호출 후 saveToCache) |
| **RapidAPI** (Moz/Ahrefs/Majestic) | ❌ (백링크샵만) | 도메인 권위 지표. SEO월드는 **GET-only** consumer |
| **VebAPI** | ✅ `VEBAPI_KEY` | 백링크 리스트 + 키워드 확장 (캐시 미경유, 직접 호출) |
| **OpenAI** | ✅ `OPENAI_API_KEY` | gpt-4o-mini — snippet-optimizer, content-gap, audit AI 리포트 |

---

## 4. 비용 방어 장치

모든 신규 API 라우트에 공통 적용:

- **Rate limit**: 비로그인 하루 2~3회, 로그인 10회 (`checkRateLimit` + `getClientIp`)
- **Promise.allSettled**: 대량 병렬 호출 시 일부 실패에도 결과 반환
- **상한값**:
  - backlink-gap: 경쟁 백링크 상위 30개만 metrics
  - keyword-gap: 키워드 30개까지
  - competitor-discovery: 상위 20 organic → 고유 15개
  - my-top-keywords: 시드 50개 + 동시성 10개 배치
  - backlink-checker metrics: 상위 20개 소스만
  - keyword-research avgDA: 상위 10개만 계산
- **타임아웃**: 캐시 read/write 5s, Serper 10~15s, 외부 HEAD/GET 5s

---

## 5. 접근 경로 & 카테고리

### 툴 목록 페이지 (`/tools`) 섹션

1. **온페이지 분석 도구** — onpage-audit(HOT), meta-generator, keyword-density
2. **색인 도구** — robots-generator, sitemap-generator
3. **백링크 분석 도구** — backlink-checker(HOT), backlink-gap(NEW), common-backlinks(NEW), broken-backlink-recovery(NEW)
4. **SERP 분석 도구** — serp-checker(NEW), local-serp(NEW), people-also-ask(NEW), serp-difficulty(NEW), my-top-keywords(NEW)
5. **경쟁사 & 갭 분석 도구** — competitor-discovery(NEW), keyword-gap(NEW), content-gap(NEW), snippet-optimizer(NEW)
6. **도메인 도구** — domain-authority(HOT), domain-compare(NEW), domain-checker(준비중)
7. **키워드 분석 도구** — keyword-research(HOT), keyword-related, longtail-keywords(NEW)

### 신규 공개 페이지

- `/updates` — 전체 변경 이력
- `/dashboard/seo` — 로그인 사용자 SEO 추적 대시보드 (기존 `/dashboard` 유지)

---

## 6. 검증 결과

### 단위 테스트 (총 288/288 PASS)

| 스크립트 | 통과 |
|---|---|
| `scripts/test-phase0.mjs` | 16/16 |
| `scripts/test-phase1.mjs` | 18/18 |
| `scripts/test-phase2.mjs` | 32/32 |
| `scripts/test-phase3.mjs` | 19/19 |
| `scripts/test-phase4.mjs` | 36/36 |
| `scripts/test-phase5.mjs` | 45/45 |
| `scripts/test-phase6.mjs` | 36/36 |
| `scripts/test-phase7.mjs` | 43/43 |
| `scripts/test-phase8.mjs` | 42/42 |

### 빌드
- ✅ `tsc --noEmit` → 0 에러
- ✅ `next build` → 성공 (신규 15개 툴 + /dashboard/seo + /updates 전부 라우팅)

---

## 7. 배포 전 체크리스트

1. **Supabase 마이그레이션 적용**
   - 파일: `supabase/migrations/20260423_phase7_tracking.sql`
   - 3개 테이블 + RLS policy 생성

2. **Vercel 환경변수**
   - [x] `CRON_SECRET` (Sensitive) — 본 세션에서 추가됨
   - [x] `CACHE_API_URL=https://backlinkshop.co.kr`
   - [x] `CACHE_API_KEY=bls-cache-x7k9m2p4`
   - [x] `SERPER_API_KEY`, `VEBAPI_KEY`, `OPENAI_API_KEY` (기존)

3. **Vercel Cron 확인**
   - `vercel.json`의 `/api/cron/serp-tracking` 스케줄 (`0 0 * * *`, 매일 09:00 KST) 자동 인식

4. **스모크 테스트 (배포 후)**
   - 각 신규 툴 1회씩 실제 호출 (API 키 동작 확인)
   - `GET /api/cron/serp-tracking?secret=WRONG` → 401 확인
   - `/dashboard/seo` 로그인 리다이렉트 확인

---

## 8. 구현 방식 (병렬 에이전트 오케스트레이션)

사용자 요구: **"각 Phase 별로 병렬로 구현하고 새 에이전트 및 새로운 오케스트레이션으로 구현"**

### Wave 기반 오케스트레이션
- **Wave 0 (직접 구현)**: Phase 0 공유 인프라 (모든 Phase가 의존)
- **Wave A (병렬 3개 에이전트)**: Phase 1, 2, 5
- **Wave B (병렬 3개 에이전트)**: Phase 3, 4, 6-2/6-3
- **Wave C (단독 에이전트)**: Phase 7 (DB + cron + 대시보드, 무거움)
- **Wave D (단독 에이전트)**: Phase 8 (폴리시)
- **최종 통합 (리더)**: data.ts, tools/page.tsx, related-tools.tsx 병합

각 에이전트마다:
- 명확한 contract 전달 (읽어야 할 파일, 수정 금지 파일, 의존성)
- 단위 테스트 작성 필수 (`scripts/test-phase*.mjs`)
- tsc --noEmit 통과 필수
- 파일 충돌 회피 제약 (공통 유틸 신규 생성 금지, data.ts 건드리지 않기 등)

### 충돌 해결
- Phase 1과 Phase 3가 모두 백링크 체커 수정 → Phase 1 먼저 완료 후 Phase 3가 그 위에서 추가 작업
- Phase 7의 `/dashboard`가 기존 `/(dashboard)/dashboard`와 충돌 → `/dashboard/seo`로 이동
- Phase 3가 backlink-check 응답 변수명 변경(metrics→targetMetrics) → Phase 1 테스트 정규식 업데이트

---

## 9. 비고

- **네이버 연동(Phase 6-1)은 제외**됨 (사용자 지시)
- SEO월드는 RapidAPI 키를 보유하지 않음. metrics는 캐시 GET-only, MISS 시 백링크샵이 fallthrough로 채움. 사용자에게는 "데이터 준비 중" 안내.
- 모든 신규 컴포넌트는 기존 shadcn/ui(Card, Button, Input 등)를 재사용. 과도한 추상화 없음.
- `any` 타입 미사용, TypeScript strict 준수.
