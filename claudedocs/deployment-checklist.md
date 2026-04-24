# SEO월드 배포 체크리스트

> 커밋 `4390e26` 배포 직후 운영자가 수동으로 처리해야 하는 모든 작업
> 2026-04-24 기준 — 113개 파일 변경(신규 툴 15개 + 기존 툴 업그레이드 4개 + SEO 대시보드 + 19개 SEO 페이지)

---

## 🚦 작업 우선순위

1. 🔴 **필수 (배포 즉시)** — 안 하면 기능이 동작하지 않음
   - Supabase SQL 마이그레이션 실행 (테이블 3종)
   - Vercel 환경변수 확인 (특히 `CRON_SECRET`)
2. 🟠 **권장 (24시간 이내)** — SEO 효과 극대화
   - Google Search Console sitemap 재제출
   - URL 검사 도구로 HOT 페이지 색인 요청
3. 🟡 **선택 (여유 있을 때)** — 모니터링/마케팅

---

## 🔴 1. Supabase SQL 마이그레이션 실행 (필수)

### 무엇을 하나?

Phase 7에서 추가된 **SEO 대시보드** (`/dashboard/seo`)와 SERP 추적 cron이 의존하는 테이블 3종을 생성한다.
이 마이그레이션을 돌리지 않으면 대시보드와 SERP 추적 기능이 모두 500 에러로 실패한다.

### 실행 방법 A — Supabase Dashboard (권장, 초보자용)

1. https://supabase.com/dashboard 접속 → SEO월드 프로젝트 선택
2. 좌측 메뉴 → **SQL Editor**
3. **New query** 클릭
4. 다음 파일의 **전체 내용**을 복사 → SQL Editor에 붙여넣기
   ```
   /mnt/d/Documents/SEO_platform/apps/web/supabase/migrations/20260423_phase7_tracking.sql
   ```
5. 우측 하단 **Run** 버튼 (또는 `Ctrl+Enter`)
6. 하단 패널에 "Success. No rows returned" 표시 확인

### 실행 방법 B — Supabase CLI (고급)

```bash
cd /mnt/d/Documents/SEO_platform/apps/web
supabase db push
```

### 생성되는 테이블 3종

| 테이블 | 용도 | 주요 컬럼 |
|---|---|---|
| `tracked_keywords` | 사용자가 등록한 추적 키워드 | `user_id, domain, keyword, gl, hl, is_active` |
| `serp_tracking` | 일별 SERP 순위 스냅샷 (cron이 채움) | `tracked_keyword_id, rank, url, checked_at` |
| `broken_backlinks` | 깨진 백링크 이력 | `user_id, target_domain, source_url, target_url, status_code, resolved` |

모든 테이블에 **RLS 활성화** + `auth.uid()` 기준 CRUD policy 자동 생성됨.
service_role 키는 RLS를 우회하므로 cron에서 직접 insert 가능.

### 검증

Supabase Dashboard → **Table Editor** → 좌측 목록에 위 3개 테이블이 보이는지 확인.

각 테이블의 **Authentication** 탭에서 RLS policies 4개씩(select/insert/update/delete) 등록됐는지 확인.

---

## 🔴 2. Vercel 환경변수 확인 (필수)

### 전체 환경변수 목록 (코드 grep 결과)

프로덕션 빌드가 사용하는 실제 환경변수는 아래와 같다.
소스 코드에서 `grep -rh 'process\.env\.' src/`로 추출한 결과 기준.

| 변수명 | 용도 | Sensitive | 필수 여부 |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | - | 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 (브라우저) | - | 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 (서버 전용) | ✅ | 필수 |
| `NEXT_PUBLIC_SITE_URL` | `https://seoworld.co.kr` | - | 필수 |
| `OPENAI_API_KEY` | gpt-4o-mini (audit, snippet-optimizer, content-gap) | ✅ | 필수 |
| `SERPER_API_KEY` | Serper (SERP 전 영역) | ✅ | 필수 |
| `VEBAPI_KEY` | VebAPI (백링크 리스트, 키워드 확장) | ✅ | 필수 |
| `CACHE_API_URL` | 백링크샵 공용 캐시. 기본 `https://backlinkshop.co.kr` | - | 필수 |
| `CACHE_API_KEY` | 백링크샵 공용 캐시 인증 | ✅ | 필수 |
| `CRON_SECRET` | Vercel cron 인증 (`Authorization: Bearer ...`) | ✅ | 필수 (신규) |
| `BREVO_API_KEY` | 이메일 발송 (Brevo) | ✅ | 권장 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | - | 권장 |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads 전환 태그 | - | 선택 |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console 메타 태그 | - | 권장 |
| `NEXT_PUBLIC_NAVER_VERIFICATION` | 네이버 서치어드바이저 메타 태그 | - | 선택 |

> **주의**: 위 리스트는 `src/` 디렉토리 기준 실제 사용되는 변수만 포함.
> `.env.example` 에 있는 `RAPIDAPI_KEY`, `NAMECHEAP_API_KEY`는 SEO월드 코드에서 직접 호출하지 않는다 (백링크샵 공용 캐시 경유).
> `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`는 모니터링 설정 시점에 추가.

### 직접 grep으로 재확인 (권장)

```bash
cd /mnt/d/Documents/SEO_platform/apps/web
grep -rh 'process\.env\.' src/ | grep -oE 'process\.env\.[A-Z_][A-Z_0-9]*' | sort -u
```

### 추가하는 법 (Vercel Dashboard)

1. https://vercel.com/ → 팀/프로젝트 선택 → **Settings → Environment Variables**
2. **Add New** 클릭
3. `Key`, `Value` 입력
4. Environment 체크박스: **Production + Preview + Development** 모두 체크
5. Sensitive 변수(API 키/시크릿)는 **Sensitive** 토글 활성화
6. **Save** 클릭
7. 변수 추가/수정 후에는 **Deployments → 최신 배포 → Redeploy** 를 눌러야 반영됨

### CRON_SECRET 발급 (최초 1회)

```bash
openssl rand -hex 32
```

출력된 값을 `CRON_SECRET` 으로 등록. 이 값은 Vercel cron이 `/api/cron/serp-tracking` 에 보내는 `Authorization: Bearer ${CRON_SECRET}` 검증에 사용됨.

### 검증

```bash
# 잘못된 secret → 401
curl "https://seoworld.co.kr/api/cron/serp-tracking?secret=WRONG"

# 올바른 secret → 200 + JSON
curl -H "Authorization: Bearer <실제_CRON_SECRET>" \
     "https://seoworld.co.kr/api/cron/serp-tracking"
```

`CRON_SECRET`이 설정되어 있지 않으면 cron 엔드포인트가 **모든 요청을 통과**시킨다 (개발 편의). 프로덕션에서는 반드시 설정 필요.

---

## 🔴 3. Vercel Cron 확인 (자동 등록)

### 현재 설정 (`apps/web/vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/serp-tracking", "schedule": "0 0 * * *" }
  ]
}
```

- **엔드포인트**: `/api/cron/serp-tracking` (GET)
- **스케줄**: 매일 `00:00 UTC` = **한국 시간 09:00**
- **동작**: `tracked_keywords.is_active=true` 전부 스캔 → Serper (+캐시) → `serp_tracking` insert

> 그 외 `/api/cron/competitor-analysis`, `/api/cron/competitor-reports` 엔드포인트 코드는 존재하지만 `vercel.json`에는 등록되어 있지 않다. 현재는 수동 호출 또는 외부 스케줄러가 필요.

### 확인 방법

Vercel Dashboard → 프로젝트 → **Settings → Cron Jobs** 탭에 다음 1개가 자동 표시돼야 한다.

- `/api/cron/serp-tracking` — `0 0 * * *`

**표시되지 않는 경우 원인**:
- 배포가 아직 완료되지 않음 (Deployments 탭에서 최신 빌드 상태 확인)
- **Vercel Hobby(무료) 플랜은 cron이 일 1회로 제한**됨. 현재 설정(하루 1회)은 Hobby에서도 동작
- `vercel.json`이 프로젝트 루트가 아닌 `apps/web/vercel.json`에 있으므로, Vercel 프로젝트의 **Root Directory** 설정이 `apps/web` 이어야 함

### 수동 테스트

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" \
     "https://seoworld.co.kr/api/cron/serp-tracking"
```

응답 예시:
```json
{
  "scanned": 0,
  "tracked": [],
  "elapsedMs": 123
}
```

아직 등록된 `tracked_keywords`가 없으면 `scanned: 0` 정상.

---

## 🟠 4. Google Search Console — 신규 URL 색인 요청

### 신규 19개 툴 페이지 URL

배포로 노출되는 전체 툴 페이지(신규 + 기존 업그레이드):

**신규 (NEW 배지) 14개**
- https://seoworld.co.kr/tools/domain-authority
- https://seoworld.co.kr/tools/domain-compare
- https://seoworld.co.kr/tools/serp-checker
- https://seoworld.co.kr/tools/local-serp
- https://seoworld.co.kr/tools/people-also-ask
- https://seoworld.co.kr/tools/serp-difficulty
- https://seoworld.co.kr/tools/longtail-keywords
- https://seoworld.co.kr/tools/snippet-optimizer
- https://seoworld.co.kr/tools/content-gap
- https://seoworld.co.kr/tools/keyword-gap
- https://seoworld.co.kr/tools/backlink-gap
- https://seoworld.co.kr/tools/common-backlinks
- https://seoworld.co.kr/tools/competitor-discovery
- https://seoworld.co.kr/tools/my-top-keywords
- https://seoworld.co.kr/tools/broken-backlink-recovery

**업그레이드 (HOT 배지) 3개**
- https://seoworld.co.kr/tools/backlink-checker
- https://seoworld.co.kr/tools/onpage-audit
- https://seoworld.co.kr/tools/keyword-research

**업데이트 허브**
- https://seoworld.co.kr/updates

### 제출 방법 A — sitemap 재제출 (권장, 일괄)

1. https://search.google.com/search-console 접속
2. 속성 선택: **seoworld.co.kr**
3. 좌측 **Sitemaps** 메뉴
4. 기존 `sitemap.xml` 항목에서 **⋮ → 제거** → 다시 제출하거나, 새로 제출
5. 제출 URL: `https://seoworld.co.kr/sitemap.xml`
6. 상태가 **성공** 으로 표시되면 완료. 크롤링 반영에 1~3일 소요.

### 제출 방법 B — URL 검사 도구 (개별, 빠름)

중요한 페이지는 개별 색인 요청으로 24시간 내 반영 가능.

1. GSC 상단 검색창에 전체 URL 입력 (예: `https://seoworld.co.kr/tools/serp-checker`)
2. 결과 페이지에서 **색인 생성 요청** 클릭
3. 1~24시간 내 반영
4. **하루 최대 10건** 쿼터 — 아래 우선순위 따라 분배

### 우선순위 추천 (HOT/NEW 섞어서)

**Day 1 (즉시 제출)**
1. `/tools/onpage-audit` — 기존 트래픽, 업그레이드 반영
2. `/tools/backlink-checker` — 기존 트래픽, 업그레이드 반영
3. `/tools/keyword-research` — 기존 트래픽, 업그레이드 반영
4. `/tools/domain-authority` — 신규, 검색량 큼
5. `/tools/serp-checker` — 신규, 검색량 큼
6. `/tools/longtail-keywords` — 신규, 롱테일 유입
7. `/tools/serp-difficulty` — 신규, SEO 난이도 검색어
8. `/tools/keyword-gap` — 경쟁사 분석 니즈
9. `/tools/backlink-gap` — 경쟁사 분석 니즈
10. `/tools/content-gap` — 콘텐츠 기획 니즈

**Day 2 (쿼터 리셋 후)**
11. `/tools/my-top-keywords`
12. `/tools/competitor-discovery`
13. `/tools/common-backlinks`
14. `/tools/people-also-ask`
15. `/tools/snippet-optimizer`
16. `/tools/local-serp`
17. `/tools/domain-compare`
18. `/tools/broken-backlink-recovery`
19. `/updates`

---

## 🟠 5. 네이버 서치어드바이저 (선택)

네이버 검색 유입이 필요하면:

1. https://searchadvisor.naver.com/ 접속
2. 웹마스터 도구 → 사이트 등록 확인 (이미 등록됐다면 생략)
3. 좌측 **요청 → 사이트맵 제출** → `https://seoworld.co.kr/sitemap.xml`
4. **요청 → 웹페이지 수집** 에서 주요 URL 3~5개 개별 수집 요청
   - `/tools/serp-checker`
   - `/tools/domain-authority`
   - `/tools/keyword-research`

> 현재 `NEXT_PUBLIC_NAVER_VERIFICATION` 환경변수가 비어 있으면 네이버 사이트 소유 확인 메타 태그가 주입되지 않는다. 네이버 활용 시 함께 설정.

---

## 🟡 6. 배포 후 스모크 테스트

### 30초 QA (필수)

1. https://seoworld.co.kr/ 열기 → Changelog 배너 표시 + Hero "탭형" (온페이지 / 도메인 권위) 확인
2. https://seoworld.co.kr/tools 열기 → 7개 카테고리 + NEW/HOT 배지 확인
3. 무작위 3개 툴 페이지 열기 → `Hero → 폼 → 결과 영역 플레이스홀더 → 가이드/FAQ → 관련 툴 → CTA` 흐름 확인
4. 모바일(devtools 또는 실제 폰)에서 동일하게 확인

### 5분 QA (핵심 기능)

| 툴 | 테스트 입력 | 기대 결과 |
|---|---|---|
| `/tools/serp-checker` | 키워드 `강아지 사료` + 도메인 `coupang.com` | 순위(또는 "상위 100위 밖") 표시 |
| `/tools/domain-authority` | `naver.com` | Moz DA 90+ / Ahrefs DR / Majestic TF 3개 타일 표시 |
| `/tools/backlink-checker` | `naver.com` | 백링크 20개 + 품질 점수 요약 + 90일 추세 그래프 표시 |
| `/tools/onpage-audit` | `https://seoworld.co.kr` | 점수 + AI 리포트 + DomainMetricsCard 표시 |
| `/tools/keyword-research` | `SEO` | 키워드 리스트 + 경쟁도(avgDA) 컬럼 + tier 배지 표시 |
| `/dashboard/seo` (로그인 후) | — | 추적 키워드 위젯 + 깨진 백링크 위젯 표시 |

### 에러 확인

- 각 폼 제출 후 500 에러 발생 시 Vercel → **Deployments → Functions** 로그에서 `Error: Missing env` 류 체크
- Console에 `Supabase` 관련 에러가 있으면 SQL 마이그레이션 미반영

---

## 🟡 7. 모니터링 설정 (선택)

| 도구 | 확인 포인트 |
|---|---|
| **Vercel Analytics** | Dashboard → Analytics 탭에서 Page Views 증가 확인 |
| **Google Analytics 4** | Realtime 보고서에서 신규 페이지 경로 유입 확인 (배포 후 24시간 대기) |
| **Google Search Console** | 1주 후 Performance → Pages에서 새 URL impressions 발생 확인 |
| **Sentry** (설정된 경우) | 배포 후 새로운 이슈 알림 수신 여부 |
| **PostHog** (설정된 경우) | 이벤트 트래킹(`trackToolUsage`)이 수집되는지 확인 |

---

## ✅ 체크리스트 요약 (복붙용)

```
🔴 필수
- [ ] Supabase SQL 마이그레이션 실행 (tracked_keywords / serp_tracking / broken_backlinks)
- [ ] Supabase Table Editor에서 3개 테이블 + RLS policies 생성 확인
- [ ] Vercel 환경변수 전수 확인 (CRON_SECRET, VEBAPI_KEY, CACHE_API_KEY, OPENAI_API_KEY, SERPER_API_KEY)
- [ ] CRON_SECRET 발급 + 등록 (openssl rand -hex 32)
- [ ] Vercel → Cron Jobs 탭에서 /api/cron/serp-tracking 자동 등록 확인
- [ ] curl로 cron 엔드포인트 401/200 동작 확인

🟠 권장 (24h)
- [ ] Google Search Console sitemap 재제출
- [ ] URL 검사 도구로 HOT/NEW 상위 10개 색인 요청
- [ ] (선택) 네이버 서치어드바이저 sitemap 재제출

🟡 선택
- [ ] 프로덕션 스모크 테스트 (30초 QA)
- [ ] 주요 5개 툴 5분 QA (입력 + 결과 확인)
- [ ] Vercel Analytics / GA4 / Sentry / PostHog 대시보드 순회
```

---

## 🆘 문제 해결

### "페이지가 404로 뜹니다"
→ Vercel 배포가 완료되지 않았거나 실패한 상태. Vercel Dashboard → **Deployments** 에서 최신 커밋(`4390e26`)의 상태가 **Ready** 인지 확인. Building 중이면 대기, Error면 Build Logs 확인.

### "도구가 500 에러"
→ 환경변수 누락 가능성.
- Vercel → **Functions** → 해당 라우트 로그에서 구체적 에러 확인
- 자주 놓치는 것: `VEBAPI_KEY`, `CACHE_API_KEY`, `OPENAI_API_KEY`
- 환경변수 추가/수정 후에는 반드시 **Redeploy** 필요

### "대시보드가 `relation \"tracked_keywords\" does not exist`"
→ SQL 마이그레이션이 아직 적용되지 않음. 1번 항목 다시 실행.

### "Cron이 안 돌아감"
→
1. `vercel.json`의 Root Directory가 `apps/web` 으로 설정됐는지 확인
2. Vercel Hobby는 하루 1회 제한 — 현재 스케줄(`0 0 * * *`)은 호환
3. Dashboard → Cron Jobs에서 최근 실행 로그 확인
4. `CRON_SECRET` 미설정 상태이면 cron은 실행되지만 모든 요청을 통과시킴 (보안 주의)

### "Supabase에서 권한 에러 (new row violates row-level security)"
→ 클라이언트가 `auth.uid()` 기준 policy를 통과하지 못함. 로그인 상태 또는 service_role 사용 여부 확인. Cron은 `createAdminClient()` 로 service_role 사용 중이므로 RLS 우회 정상.

### "백링크샵 캐시 API 호출이 실패"
→ `CACHE_API_URL` (기본 `https://backlinkshop.co.kr`) 과 `CACHE_API_KEY` 둘 다 필요. 키가 틀리면 캐시 MISS 처리되고 각 툴이 Serper/VebAPI 직접 호출로 폴백하므로, 치명적이지 않지만 API 비용 증가 원인. Vercel Functions 로그에서 `cache-api` 관련 경고 확인.

---

## 📋 참고 파일 경로

- SQL 마이그레이션: `/mnt/d/Documents/SEO_platform/apps/web/supabase/migrations/20260423_phase7_tracking.sql`
- Vercel cron 설정: `/mnt/d/Documents/SEO_platform/apps/web/vercel.json`
- SERP tracking cron 구현: `/mnt/d/Documents/SEO_platform/apps/web/src/app/api/cron/serp-tracking/route.ts`
- 환경변수 템플릿: `/mnt/d/Documents/SEO_platform/.env.example`
- 전체 Phase 0~8 구현 내역: `/mnt/d/Documents/SEO_platform/claudedocs/2026-04-23_phase0-8_implementation.md`
