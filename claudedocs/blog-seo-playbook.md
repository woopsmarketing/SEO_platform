# 블로그 SEO 최적화 플레이북

다른 프로젝트 블로그 SEO 작업에서 정리한 내용. SEO월드 + 다른 프로젝트에 공통 적용 가능.

---

## 1. 기술적 SEO 체크리스트

| 항목 | 설명 | SEO월드 상태 |
|---|---|---|
| Google Search Console 등록 | sitemap.xml 제출 | ✅ 완료 |
| sitemap.xml 자동 갱신 | 블로그 글 발행 시 자동 추가 | ✅ 완료 |
| 메타태그 (title, description, OG) | 각 페이지별 고유 설정 | ✅ 완료 |
| JSON-LD 구조화 데이터 | Article, BreadcrumbList, FAQPage, ItemList | ✅ 완료 |
| Core Web Vitals | LCP < 2.5초, CLS < 0.1, FID < 100ms | ✅ 개선 완료 |
| 모바일 최적화 | 반응형 레이아웃, 터치타겟 48px+ | ✅ 개선 완료 |

---

## 2. Next.js 성능 최적화 패턴 (범용 — 다른 프로젝트에도 적용)

### 2-1. `<img>` → `next/image` 전환

```tsx
// Before — CLS 발생, 최적화 없음
<img src={url} alt="..." className="w-full h-auto" />

// After — 자동 WebP 변환 + srcset + lazy loading
<div className="relative aspect-[2/1]">  {/* 이미지 공간 미리 확보 = CLS 0 */}
  <Image
    src={url}
    alt="..."
    fill
    sizes="(max-width: 768px) 100vw, 768px"
    className="object-cover"
    priority  // LCP 후보(첫 화면 큰 이미지)에만
  />
</div>
```

**적용 시 체크리스트:**
- `next.config.ts`에 외부 이미지 도메인 `remotePatterns` 등록 필수
- LCP 후보(첫 화면 큰 이미지)에만 `priority` 추가
- 목록형 카드 썸네일은 `priority` 없이 (lazy loading 유지)
- `aspect-[비율]` 컨테이너로 CLS 방지

**SEO월드 상태: ✅ 구현 완료**

### 2-2. GA 스크립트 → `next/script`

```tsx
import Script from "next/script";

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`window.dataLayer=window.dataLayer||[];...`}
</Script>
```

| strategy | 언제 로드 | 용도 |
|---|---|---|
| `beforeInteractive` | 하이드레이션 전 | 반드시 먼저 필요한 것 (consent 등) |
| `afterInteractive` | 하이드레이션 후 | GA, GTM, 채팅 위젯 |
| `lazyOnload` | 브라우저 idle 시 | 중요도 낮은 것 |

**SEO월드 상태: ✅ 구현 완료**

### 2-3. 모바일 UI 규칙

| 규칙 | 패턴 |
|---|---|
| flex 동적 아이템 | 항상 `flex-wrap` |
| 2열 그리드 | `grid-cols-1 sm:grid-cols-2` (모바일 1열 fallback) |
| CTA 버튼 | 최소 높이 44~48px |
| h1 제목 | 반응형 크기 `text-2xl sm:text-3xl` |

**SEO월드 상태: ✅ 구현 완료**

---

## 3. 인덱싱 가속

### 3-1. IndexNow API (Bing, Yandex용)

- 구글은 **미지원** — Bing, Yandex만 지원
- 한국 타겟이면 실질적 트래픽 효과는 작지만, 있으면 손해 없음

**구현 방법:**
1. 랜덤 키 생성 → `public/{키}.txt` 파일 배치 (소유권 증명)
2. `/api/indexnow` 라우트 생성
3. 콘텐츠 발행 시 fire-and-forget으로 호출

```ts
// fire-and-forget — 발행 응답을 지연시키지 않음
void fetch("/api/indexnow", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}` },
  body: JSON.stringify({ urls: [`/blog/${slug}`] }),
});
```

**SEO월드 상태: ✅ 구현 완료**

### 3-2. Google Indexing API (구글용)

- 공식은 JobPosting/BroadcastEvent만 지원하나, 일반 URL도 비공식 작동
- 크롤링 우선순위 상승 효과

**구현 방법:**
1. Google Cloud Console에서 서비스 계정 생성
2. Search Console에 서비스 계정 소유자로 등록
3. 블로그 발행 시 API 호출

**SEO월드 상태: ❌ 미구현 — 현재 Search Console 수동 제출로 대체 중**

### 3-3. Search Console 수동 제출

- URL 검사 → "색인 생성 요청" 버튼
- 주 3~4편 정도면 수동으로도 충분히 커버 가능

---

## 4. 콘텐츠 전략

### 키워드 유형

| 유형 | 예시 | 특징 |
|---|---|---|
| 롱테일 | "만료 도메인 DA 확인 방법" | 검색량 적지만 경쟁 거의 없음 |
| 질문형 | "도메인 DA란 무엇인가" | Featured Snippet 노출 가능 |
| 비교/리스트형 | "2026 무료 SEO 도구 추천" | 클릭률 높음 |

- 빅 키워드(예: "도메인")는 신규 사이트로 1페이지 불가능
- 롱테일 키워드부터 시작 → 도메인 신뢰도 쌓인 후 경쟁 키워드 도전

### 발행 페이스
- 주 3~4편 꾸준히 발행
- 키워드 목록: `apps/web/BLOG_KEYWORDS.md`에 관리

---

## 5. 초기 트래픽 부스팅

| 방법 | 채택 여부 |
|---|---|
| 네이버 카페/커뮤니티 | ❌ 안 함 (시간 부족) |
| Reddit | ❌ 안 함 |
| 카카오톡 오픈방 광고 | ✅ 채택 |
| Google Ads | ✅ 소량 운영 중 |
| 블로그 SEO 콘텐츠 | ✅ 핵심 전략 |

---

## 6. 구현 상태 총정리 (2026-04-08 기준)

### ✅ 원래부터 구현되어 있던 것

| 항목 | 세부 |
|---|---|
| sitemap.xml 자동 갱신 | DB 기반 동적 생성, ISR 적용 |
| 메타태그 | title, description, OG, Twitter 동적 설정 |
| JSON-LD 구조화 데이터 | Article, BreadcrumbList, FAQPage |
| GA → next/script | afterInteractive 적용 |
| 모바일 반응형 | Tailwind 반응형 클래스 |
| next/image (목록 페이지) | 블로그 목록 썸네일만 적용 |

### ✅ 2026-04-08 이 대화에서 구현

| 항목 | 세부 |
|---|---|
| Rate Limit 조정 | AI 툴(audit, meta) 1회/일, 일반 툴 2회/일 |
| 회원가입 유도 배너 | 비로그인 사용자 결과 페이지에 인라인 배너 |
| related-keyword 429 처리 | 누락된 SignupModal 처리 추가 |

### ❌ 미구현 (향후 작업)

| 항목 | 설명 | 우선순위 |
|---|---|---|
| IndexNow API | Bing/Yandex 인덱싱 자동 알림 (라우트 없음) | P1 |
| Google Indexing API | 구글에 직접 인덱싱 요청 (서비스 계정 필요) | P1 |
| 이미지 압축 파이프라인 | 블로그 발행 시 자동 압축 (스크립트만 존재, 파이프라인 미연결) | P1 |
| 블로그 본문 내 이미지 최적화 | dangerouslySetInnerHTML 내 `<img>` → 최적화 필요 | P2 |
