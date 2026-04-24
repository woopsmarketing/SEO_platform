# SEO월드 툴 카탈로그 (19종)

> 2026-04-24 기준 · `/tools` 페이지에 등록된 전체 무료 SEO 도구 목록
> 운영자(나)가 한눈에 입출력·외부 API·비용·rate limit을 파악하기 위한 레퍼런스.

---

## 📋 빠른 요약 표

| # | 툴 | URL | 외부 API | 캐시 | Rate Limit (익명/로그인) |
|---|---|---|---|---|---|
| 1 | SERP 순위 체커 | `/tools/serp-checker` | Serper | `serp` | 2/일 · 10/일 |
| 2 | 지역 SERP | `/tools/local-serp` | Serper | 없음 | 2/일 · 10/일 |
| 3 | PAA (관련 질문) | `/tools/people-also-ask` | Serper | 없음 | 2/일 · 10/일 |
| 4 | SERP 난이도 | `/tools/serp-difficulty` | Serper + metrics | `serp` / `metrics` | 2/일 · 10/일 |
| 5 | 내 노출 키워드 | `/tools/my-top-keywords` | VebAPI + Serper + metrics | `serp` / `metrics` | 2/일 · 10/일 |
| 6 | 스니펫 최적화 | `/tools/snippet-optimizer` | Serper + OpenAI + HTML fetch | 없음 | 2/일 · 10/일 |
| 7 | 콘텐츠 갭 | `/tools/content-gap` | OpenAI + HTML fetch | 없음 | 2/일 · 10/일 |
| 8 | 키워드 갭 | `/tools/keyword-gap` | VebAPI + Serper | `serp` | 2/일 · 10/일 |
| 9 | 백링크 갭 | `/tools/backlink-gap` | VebAPI + metrics | `metrics` | 2/일 · 10/일 |
| 10 | 공통 백링크 | `/tools/common-backlinks` | VebAPI + metrics | `metrics` | 2/일 · 10/일 |
| 11 | 경쟁 도메인 발굴 | `/tools/competitor-discovery` | Serper + metrics | `serp` / `metrics` | 2/일 · 10/일 |
| 12 | 깨진 백링크 복구 | `/tools/broken-backlink-recovery` | VebAPI + HEAD/GET | 없음 | 1/일 · 5/일 |
| 13 | 도메인 권위 | `/tools/domain-authority` | 캐시 GET-only | `metrics` | 3/일 · 10/일 |
| 14 | 도메인 비교 | `/tools/domain-compare` | 캐시 GET-only | `metrics` | 3/일 · 10/일 |
| 15 | 롱테일 키워드 | `/tools/longtail-keywords` | VebAPI + Google Autocomplete + Serper + metrics | `serp` / `metrics` | 2/일 · 10/일 |
| 16 | 백링크 분석기 (업그레이드) | `/tools/backlink-checker` | VebAPI + metrics | `metrics` | 2/일 · 10/일 |
| 17 | 온페이지 감사 (업그레이드) | `/tools/onpage-audit` | HTML fetch + OpenAI + metrics | `metrics` | 1/일 · 10/일 |
| 18 | 키워드 리서치 (업그레이드) | `/tools/keyword-research` | VebAPI + Serper + metrics | `serp` / `metrics` | 2/일 · 10/일 |
| 19 | 키워드 밀도 (업그레이드) | `/tools/keyword-density` | HTML fetch (외부 API 없음) | 없음 | 2/일 · 10/일 |

> Rate limit은 모두 `checkRateLimit(ip, toolKey, limit, 1440분)` — 즉 **24시간 윈도우 per-IP 기반**.
> 공용 캐시 `metrics` TTL은 백링크샵이 30일, `serp`는 14일을 관리한다 (SEO월드는 consumer).

---

## 🆕 신규 툴 (15종)

### 1. SERP 순위 체커
- **URL**: `/tools/serp-checker`
- **API**: `POST /api/serp-check`
- **입력**: 키워드 (+ 선택: 내 도메인)
- **출력**:
  - 상위 20개 구글 검색 결과 (순위·제목·URL·도메인)
  - 내 도메인 순위 하이라이트 (`myRank`, `myHit`)
  - `fromCache` 플래그로 캐시 경유 여부 표시
- **외부 API**: Serper (구글 SERP, `gl=kr/hl=ko`, `num=20`)
- **캐시**: 공용 `serp` — HIT이면 외부 호출 생략, MISS일 때만 Serper 직접 호출 후 저장
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 캐시 MISS에서만 Serper 1 credit. 동일 키워드 14일 내 재질의는 무료

### 2. 지역 SERP
- **URL**: `/tools/local-serp`
- **API**: `POST /api/local-serp`
- **입력**: 키워드, 국가 코드(`gl`), 언어 코드(`hl`), 선택적 도시(`location`)
- **출력**: 해당 지역 기준 상위 20개 organic 결과 (순위·제목·URL·snippet)
- **외부 API**: Serper (지역 파라미터 포함 직접 호출)
- **캐시**: **없음** — 캐시 키가 `keyword`만 지원해 지역 차이를 구분할 수 없음
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 모든 요청에 Serper 1 credit 소모. 허용 `gl` 14개, `hl` 10개로 남용 차단

### 3. PAA (People Also Ask)
- **URL**: `/tools/people-also-ask`
- **API**: `POST /api/people-also-ask`
- **입력**: 키워드
- **출력**:
  - Google "사람들이 묻는 질문" 항목 리스트 (question · snippet · 소스 URL)
  - `relatedSearches` 배열 (연관 검색어)
  - `hasPaa` 플래그
- **외부 API**: Serper (`peopleAlsoAsk`, `relatedSearches` 필드 추출)
- **캐시**: **없음** — Serper에서만 필요한 필드라 전용 캐시 스키마 없음
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 요청당 Serper 1 credit

### 4. SERP 난이도
- **URL**: `/tools/serp-difficulty`
- **API**: `POST /api/serp-difficulty`
- **입력**: 키워드
- **출력**:
  - 상위 10개 도메인의 Moz DA / Ahrefs DR / Majestic TF
  - 평균 DA/DR/TF
  - 종합 난이도 점수 `difficultyScore = DA*0.4 + DR*0.4 + TF*0.2` + 라벨("낮음"~"매우 어려움")
- **외부 API**: Serper (SERP) + RapidAPI(Moz/Ahrefs/Majestic) — 모두 **캐시 경유**
- **캐시**: `serp` (14일), 각 도메인 `metrics` (30일)
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 캐시 MISS 도메인당 RapidAPI 1 credit · Serper MISS 시 1 credit. Full-hit은 무료

### 5. 내 노출 키워드
- **URL**: `/tools/my-top-keywords`
- **API**: `POST /api/my-top-keywords`
- **입력**: 도메인 (+ 선택: 시드 키워드 배열)
- **출력**:
  - 내 도메인이 SERP 상위 100위 안에 드는 키워드 TOP 20
  - 각 키워드: `myRank`, `avgTopDA` (경쟁 상위 10개 평균 DA), `searchVolume`
- **외부 API**: VebAPI(keywordresearch로 시드 추출) + Serper(각 키워드 상위 100) + RapidAPI metrics
- **캐시**: `serp` / `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 상당히 비쌈. 최대 50 키워드 × SERP MISS 1 credit + TOP 20 × DA 계산용 최대 200 도메인 metrics. 동시성 10 배치 처리

### 6. 스니펫 최적화
- **URL**: `/tools/snippet-optimizer`
- **API**: `POST /api/snippet-optimizer`
- **입력**: URL + 타겟 키워드
- **출력**:
  - 현재 title/description/H1 추출
  - 경쟁사 상위 5개 snippet 리스트
  - GPT-4o-mini가 제안한 `titles[2]` + `description[1]`
- **외부 API**: Serper (상위 5) + OpenAI gpt-4o-mini (max_tokens 700, JSON mode)
- **캐시**: 없음 (snippet 필드는 캐시되지 않음)
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 요청당 Serper 1 credit + OpenAI ~$0.001 (400 tokens in/out 근사)

### 7. 콘텐츠 갭
- **URL**: `/tools/content-gap`
- **API**: `POST /api/content-gap`
- **입력**: 내 페이지 URL + 경쟁사 URL
- **출력**:
  - 두 페이지 각각의 주요 토픽 10개 (LLM 추출)
  - `common` / `onlyMine` / `onlyCompetitor` 토픽 분류
  - `recommended` 3개 — LLM이 상대만 다루는 토픽 중 SEO 가치 높은 항목 선정
- **외부 API**: OpenAI gpt-4o-mini 2회(토픽 추출) + 1회(추천) — 외부 SERP/metrics 사용 없음, HTML 직접 fetch
- **캐시**: 없음
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 요청당 OpenAI ~$0.003 (3회 호출 · 본문 6000자 제한으로 토큰 상한)

### 8. 키워드 갭
- **URL**: `/tools/keyword-gap`
- **API**: `POST /api/keyword-gap`
- **입력**: 내 도메인 + 경쟁 도메인 (+ 선택: seedKeywords 배열)
- **출력**:
  - `onlyCompetitor` / `both` / `onlyMine` / `neither` 4분류
  - 각 키워드 검색량(vol), 경쟁사 순위, 내 순위
- **외부 API**: VebAPI(경쟁사 도메인 시드 확장, 최대 30개) + Serper(각 키워드 상위 20)
- **캐시**: `serp`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI 1 호출 + SERP 최대 30 MISS × 1 credit (캐시 경유로 대부분 HIT)

### 9. 백링크 갭
- **URL**: `/tools/backlink-gap`
- **API**: `POST /api/backlink-gap`
- **입력**: 내 도메인 + 경쟁 도메인
- **출력**:
  - 양쪽 referring 도메인 개수
  - `onlyCompetitor` 상위 30개에 DA 첨부 (DA 내림차순)
  - `common`/`onlyMine` 도메인 리스트 (상위 200)
- **외부 API**: VebAPI `/backlinkdata` 2회 병렬 + 상위 30개 `metrics` 캐시
- **캐시**: `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI 2 호출 + 캐시 MISS 도메인당 RapidAPI 1 credit

### 10. 공통 백링크
- **URL**: `/tools/common-backlinks`
- **API**: `POST /api/common-backlinks`
- **입력**: 도메인 배열 2~5개
- **출력**:
  - 모든 입력 도메인에 **공통으로 링크 거는** referring 도메인
  - 각 행: `domain`, `sourceDA`, `pairs` (어느 입력 도메인에 링크되는지 true/false 맵)
  - 상위 30개만 DA 조회, 나머지는 리스트만
- **외부 API**: VebAPI backlinkdata N회 병렬 + 상위 30 metrics
- **캐시**: `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI N회(2~5) + metrics 캐시 MISS만 RapidAPI

### 11. 경쟁 도메인 발굴
- **URL**: `/tools/competitor-discovery`
- **API**: `POST /api/competitor-discovery`
- **입력**: 시드 키워드 1개
- **출력**:
  - 상위 20 organic에서 고유 도메인 추출(최대 15개)
  - 각 도메인 DA/DR/TF/RefDomains/Traffic → DA 내림차순 정렬
- **외부 API**: Serper 1회 + metrics 최대 15개
- **캐시**: `serp` / `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 캐시 MISS 발생 시 Serper 1 + RapidAPI 최대 15 credit. Full-hit은 무료

### 12. 깨진 백링크 복구
- **URL**: `/tools/broken-backlink-recovery`
- **API**: `POST /api/broken-backlink-recovery`
- **입력**: 도메인
- **출력**:
  - 내 도메인으로 걸린 백링크 중 target이 404/410인 링크 리스트
  - `sourceUrl`(잃어버린 트래픽 출처), `targetUrl`, `statusCode`
  - 로그인 시 `broken_backlinks` 테이블에 upsert 저장 (`saved: true`)
- **외부 API**: VebAPI backlinkdata 1회 + 최대 50개 target에 HEAD/GET 상태 체크
- **캐시**: 없음 (상태 체크는 실시간이어야 함)
- **Rate Limit**: **익명 1/일, 로그인 5/일** — 가장 엄격함 (HEAD 요청 남용 방지)
- **비용**: VebAPI 1 호출 + 50 HEAD/GET (자체 비용 없음, 타임아웃 5s)

### 13. 도메인 권위 (Domain Authority)
- **URL**: `/tools/domain-authority`
- **API**: `POST /api/domain-authority`
- **입력**: 도메인
- **출력**:
  - `mozDA`, `mozPA`, `mozRank`, `mozSpam`
  - `ahrefsDR`, `ahrefsRefDomains`, `ahrefsTraffic`, `ahrefsOrganicKeywords`
  - `majesticTF`, `majesticCF`
  - 캐시 MISS면 `pending: true` + 안내 메시지 ("데이터 준비 중")
- **외부 API**: **공용 캐시 GET-only** — SEO월드에는 RapidAPI 키 없음. 캐시 MISS 시 데이터 없음
- **캐시**: `metrics` (30일 TTL, 백링크샵이 수집 책임)
- **Rate Limit**: 익명 3/일, 로그인 10/일
- **비용**: 0 (캐시 조회만)

### 14. 도메인 비교
- **URL**: `/tools/domain-compare`
- **API**: `POST /api/domain-compare`
- **입력**: 도메인 A + 도메인 B
- **출력**: 두 도메인 metrics를 나란히 — `a: {domain, metrics, pending}`, `b: {...}`
- **외부 API**: 공용 캐시 GET-only × 2 병렬
- **캐시**: `metrics`
- **Rate Limit**: 익명 3/일, 로그인 10/일
- **비용**: 0

### 15. 롱테일 키워드
- **URL**: `/tools/longtail-keywords`
- **API**: `POST /api/longtail-keywords`
- **입력**: 시드 키워드
- **출력**:
  - 관련 키워드 최대 50개 (VebAPI + Google Autocomplete 병합)
  - 각 항목: `wordCount`, `type`("롱테일"/"질문형"/"미디엄"), `searchVolume`
  - 상위 10개에 `avgDA` (SERP 상위 5 도메인 평균 Moz DA) 첨부
  - 검색량 내림차순 정렬
- **외부 API**: VebAPI keywordresearch + Google Autocomplete(보조) + Serper(avgDA 계산) + metrics
- **캐시**: `serp` / `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI 1 + Autocomplete 8회(무료) + SERP 최대 10 MISS + metrics 최대 50 MISS

---

## ⚡ 업그레이드 툴 (4종)

### 16. 백링크 분석기 (업그레이드)
- **URL**: `/tools/backlink-checker`
- **API**: `POST /api/backlink-check`
- **입력**: 도메인
- **출력 (업그레이드 포인트)**:
  - 기본: counts(total/doFollow/domains), backlinks 배열
  - **추가**: 각 백링크에 `sourceDA`, `qualityScore` (sourceDA×0.6 + doFollow보너스 + 앵커다양성 보너스, 0~100)
  - **추가**: `avgQualityScore`, `anchorDiversityRatio` 지표
  - **추가**: 대상 도메인 자체 metrics(`targetMetrics`) 병렬 첨부
  - 로그인 시 `analyses` 테이블에 summary + counts 저장
- **외부 API**: VebAPI backlinkdata + 대상 도메인 metrics + 상위 20 백링크 sourceDA metrics
- **캐시**: `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI 1 호출 + 최대 21 metrics (캐시 MISS만)

### 17. 온페이지 감사 (업그레이드)
- **URL**: `/tools/onpage-audit`
- **API**: `POST /api/audit`
- **입력**: URL
- **출력 (업그레이드 포인트)**:
  - 기본: HTML 파싱 결과 (title/description/canonical/H1~H3/img alt/링크/OG/JSON-LD 등 40+ 필드)
  - GPT-4o-mini SEO 점수 + 잘된 점/개선 필요/핵심 권장사항
  - **추가**: `metrics` — 도메인 권위 캐시 조회 병렬 첨부 (RapidAPI 키 없이 캐시 경유)
  - HTTPS/HSTS/Gzip/redirect/www 정규화/lang/favicon/deprecated 태그/iframe/인라인 CSS·JS/텍스트 비율/URL 깊이 등 추가 감지
  - 자동 점수 계산(`autoScore = 통과항목/총항목 × 100`) 후 LLM이 ±10 범위 내 조정
  - 로그인 시 `analyses` 테이블에 저장 (score 정규식 추출)
- **외부 API**: HTML fetch (자체) + OpenAI gpt-4o-mini (max_tokens 4000) + 캐시 GET metrics
- **캐시**: `metrics` (읽기 전용)
- **Rate Limit**: **익명 1/일, 로그인 10/일** — 가장 엄격 (OpenAI 비용)
- **비용**: OpenAI ~$0.005~0.01/req (4000 tokens cap), 기타는 무료

### 18. 키워드 리서치 (업그레이드)
- **URL**: `/tools/keyword-research`
- **API**: `POST /api/keyword-research`
- **입력**: 키워드 (+ 선택 `country`, 기본 `kr`)
- **출력 (업그레이드 포인트)**:
  - 기본: VebAPI 관련 키워드 배열 (text, vol, cpc, competition)
  - **추가**: 상위 10개 키워드에 `avgDA` — 각 키워드 SERP 상위 3개 도메인 Moz DA 평균
  - 로그인 시 `analyses`에 summary(avgCpc/avgVol/totalResults) 저장
- **외부 API**: VebAPI keywordresearch + Serper(상위 10 키워드별) + metrics
- **캐시**: `serp` / `metrics`
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: VebAPI 1 호출 + 상위 10 키워드 SERP/metrics 캐시 MISS만 유료

### 19. 키워드 밀도 (업그레이드)
- **URL**: `/tools/keyword-density`
- **API**: `POST /api/keyword-density`
- **입력**: URL + 타겟 키워드
- **출력 (업그레이드 포인트)**:
  - title / description 노출 여부 (`inTitle`, `inDescription`)
  - 타겟 키워드 `targetCount`, `targetDensity`
  - 1~3-gram 조합 상위 50개 (2회 이상 등장, `occurrences`, `percent`, `weight`)
  - **업그레이드**: 한국어 조사/어미(`은/는/이/가`, `합니다`, `하세요` 등) 제거 로직
  - **업그레이드**: STOPWORDS 세트 + `isValidKeyword` 필터 (숫자/단일문자/특수문자 제외)
  - 로그인 시 `analyses` 테이블에 summary 저장
- **외부 API**: **외부 API 없음** — 자체 HTML fetch + 정규식 파싱만
- **캐시**: 없음 (계산 비용 미미)
- **Rate Limit**: 익명 2/일, 로그인 10/일
- **비용**: 0 (fetch + CPU만)

---

## 🔌 외부 API 의존성 맵

| API | 용도 | 사용 툴 | 캐시 TTL |
|---|---|---|---|
| **Serper** (google.serper.dev) | 구글 SERP 검색 | 1, 2, 3, 4, 5, 6, 8, 11, 15, 18 | 14일 (`serp`) — 2번(지역)·3번(PAA)·6번(snippet)은 캐시 미경유 |
| **RapidAPI** (Moz/Ahrefs/Majestic) | 도메인 권위/백링크/트래픽 지표 | 4, 5, 9, 10, 11, 13, 14, 15, 16, 17, 18 | 30일 (`metrics`) |
| **VebAPI** (vebapi.com) | 백링크 데이터, 키워드 리서치 | 5, 8, 9, 10, 12, 15, 16, 18 | 없음 — 매번 직접 호출 |
| **OpenAI gpt-4o-mini** | LLM 기반 분석/제안 | 6 (스니펫), 7 (콘텐츠 갭), 17 (온페이지 감사) | 없음 — 매번 호출 |
| **Google Autocomplete** (suggestqueries) | 롱테일 보조 수집 | 15 (롱테일 키워드) | 없음, 무료 |
| **공용 캐시 API** (backlinkshop.co.kr) | 위 RapidAPI/Serper 결과의 분산 저장소 | 거의 전 툴 (13, 14는 GET-only) | 위 TTL 준수 |
| **Supabase** (admin/service_role) | `tool_usage_logs`, `analyses`, `broken_backlinks` | 전 툴 (로깅) · 12·16·17·18 (로그인 시 결과 저장) | - |

### 캐시 전략 요약
- `fetchWithCache(type, params)` → `saveToCache` 왕복 패턴. 캐시 MISS이면 외부 API 직접 호출 후 저장 (SEO월드는 소비자이자 제공자).
- **예외**: 툴 13·14(Domain Authority/Compare)는 RapidAPI 키가 없어 **GET-only**. MISS면 `pending: true`로 "데이터 준비 중" 안내.
- 타임아웃: 읽기 5s, 쓰기 5s (설정 미비 시 전 흐름 통과).

---

## 💰 예상 월간 비용 구조 (참고)

> 하루 트래픽이 툴당 익명 50회 + 로그인 30회 ≈ **80 요청/일/툴**로 가정. 실제는 더 낮을 가능성.

| 비용 카테고리 | 월 추정 | 비고 |
|---|---|---|
| **OpenAI (gpt-4o-mini)** | $30~60 | 툴 6/7/17 합계 · 17번이 대다수 (4000 tokens cap) |
| **Serper** | ~15~25 credit/일 | 캐시 MISS 비율 20% 가정. 월 500~1000 credit (Serper $50/2500credits 플랜 내) |
| **RapidAPI metrics** | ~5~10 credit/일 | 대부분 캐시 HIT(30일 TTL). 백링크샵이 비용 부담 (SEO월드 소비자) |
| **VebAPI** | 매 요청 | 캐시 없음. 툴 5/8/9/10/12/15/16/18에서 호출. **여기가 실질적으로 가장 비쌈** |
| **Supabase** | 무료 tier | `tool_usage_logs`는 일일 수백건 수준 |

운영자 액션 아이템
- [ ] VebAPI 호출 수 모니터링 (특히 깨진 백링크·백링크 갭·공통 백링크는 backlinkdata 1~N회 소모)
- [ ] OpenAI 일별 사용량 알림 설정 (온페이지 감사 남용 방지)
- [ ] Serper 월 credit 대시보드 확인 — 캐시 MISS 비율이 치솟으면 `serp` 캐시 TTL 재검토

---

## 🧭 툴별 엔트리 파일 위치

| # | 툴 | page/form | route |
|---|---|---|---|
| 1 | SERP 체커 | `apps/web/src/app/(public)/tools/serp-checker/page.tsx` | `apps/web/src/app/api/serp-check/route.ts` |
| 2 | 지역 SERP | `.../tools/local-serp/page.tsx` | `.../api/local-serp/route.ts` |
| 3 | PAA | `.../tools/people-also-ask/page.tsx` | `.../api/people-also-ask/route.ts` |
| 4 | SERP 난이도 | `.../tools/serp-difficulty/page.tsx` | `.../api/serp-difficulty/route.ts` |
| 5 | 내 노출 키워드 | `.../tools/my-top-keywords/page.tsx` | `.../api/my-top-keywords/route.ts` |
| 6 | 스니펫 최적화 | `.../tools/snippet-optimizer/page.tsx` | `.../api/snippet-optimizer/route.ts` |
| 7 | 콘텐츠 갭 | `.../tools/content-gap/page.tsx` | `.../api/content-gap/route.ts` |
| 8 | 키워드 갭 | `.../tools/keyword-gap/page.tsx` | `.../api/keyword-gap/route.ts` |
| 9 | 백링크 갭 | `.../tools/backlink-gap/page.tsx` | `.../api/backlink-gap/route.ts` |
| 10 | 공통 백링크 | `.../tools/common-backlinks/page.tsx` | `.../api/common-backlinks/route.ts` |
| 11 | 경쟁 도메인 발굴 | `.../tools/competitor-discovery/page.tsx` | `.../api/competitor-discovery/route.ts` |
| 12 | 깨진 백링크 복구 | `.../tools/broken-backlink-recovery/page.tsx` | `.../api/broken-backlink-recovery/route.ts` |
| 13 | 도메인 권위 | `.../tools/domain-authority/page.tsx` | `.../api/domain-authority/route.ts` |
| 14 | 도메인 비교 | `.../tools/domain-compare/page.tsx` | `.../api/domain-compare/route.ts` |
| 15 | 롱테일 키워드 | `.../tools/longtail-keywords/page.tsx` | `.../api/longtail-keywords/route.ts` |
| 16 | 백링크 분석기 | `.../tools/backlink-checker/backlink-form.tsx` | `.../api/backlink-check/route.ts` |
| 17 | 온페이지 감사 | `.../tools/onpage-audit/audit-form.tsx` | `.../api/audit/route.ts` |
| 18 | 키워드 리서치 | `.../tools/keyword-research/keyword-form.tsx` | `.../api/keyword-research/route.ts` |
| 19 | 키워드 밀도 | `.../tools/keyword-density/keyword-density-form.tsx` | `.../api/keyword-density/route.ts` |

---

## 📚 관련 문서
- `claudedocs/2026-04-23_phase0-8_implementation.md` — 최근 구현 히스토리
- `claudedocs/blog-seo-playbook.md` — 블로그 SEO 플레이북
- `claudedocs/code-review.md` — 코드 리뷰 메모
- `apps/web/src/lib/cache-api.ts` — 공용 캐시 클라이언트 (`fetchWithCache`/`saveToCache`, `DomainMetrics` 스키마)
- `apps/web/src/lib/rate-limit.ts` — `checkRateLimit(ip, key, limit, windowMinutes)` 정의

---

## 🚨 운영 주의사항
1. **`/tools` 페이지**: 19개 툴이 노출되어야 한다. 새 툴 추가 시 `apps/web/src/app/(public)/tools/page.tsx` 메타 리스트 업데이트 필수.
2. **Rate Limit은 IP 기반**: 프록시/VPN 우회에 취약. 어뷰징 탐지는 `tool_usage_logs.ip_address` 쿼리로 사후 검증.
3. **OpenAI 실패 전파**: 툴 6·7·17은 OpenAI 400/500 시 전체 실패 처리. 사용자에게 "LLM 분석 키가 설정되지 않았습니다" 안내.
4. **VebAPI 응답 형상 변경 취약**: 응답이 배열이 아니면 `return []` — 에러가 아니라 **"키워드 데이터를 가져오지 못했습니다"**로 처리되므로 실패 탐지에는 외부 로그(Sentry/PostHog)에 의존.
5. **GET-only 툴(13·14)**: 캐시 MISS 시 사용자에게 "데이터 준비 중" 응답. 운영자가 백링크샵 측 데이터 수집을 트리거해야 의미 있는 응답.
