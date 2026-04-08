# 블로그 글 작성 고정 규칙

> 이 파일은 /write-blog 파이프라인에서 모든 에이전트가 참조하는 고정 규칙입니다.
> 매 글마다 변하지 않는 사이트 정보, 스타일 가이드, SEO 규칙을 정의합니다.

## 1. 사이트 정보 (고정)

- 사이트명: SEO월드
- 도메인: https://seoworld.co.kr
- 블로그 URL 패턴: https://seoworld.co.kr/blog/{slug}
- DB 테이블: posts (Supabase)
- 카테고리: "SEO 전략" | "백링크" | "키워드 분석" | "온페이지 SEO" | "테크니컬 SEO"
- 콘텐츠 형식: HTML (마크다운 아님)

## 2. 내부 도구 링크 (고정)

블로그 글에서 참조할 수 있는 내부 도구 목록:

| 도구 | URL | 용도 |
|------|-----|------|
| 온페이지 SEO 분석 | /tools/onpage-audit | 사이트 진단, 테크니컬 SEO |
| 메타태그 분석기 | /tools/meta-generator | 메타태그 점검, 제목/설명 최적화 |
| Robots.txt 생성기 | /tools/robots-generator | 크롤링 제어, robots.txt |
| 사이트맵 생성기 | /tools/sitemap-generator | sitemap.xml, 색인 |
| 백링크 분석기 | /tools/backlink-checker | 백링크 확인, 경쟁사 분석 |
| 키워드 조사 | /tools/keyword-research | 키워드 검색량, CPC |
| 사이트 키워드 분석기 | /tools/keyword-density | 키워드 밀도 |
| 관련 키워드 찾기 | /tools/keyword-related | 연관 검색어, 롱테일 |

## 3. 내부 서비스 링크 (고정)

| 서비스 | URL |
|--------|-----|
| 백링크 서비스 | /services/backlinks |
| 웹 디자인 | /services/web-design |
| 도메인 브로커 | /services/domain-broker |

## 4. 권위 외부 도메인 시드 (link-curator 참조)

link-curator가 WebSearch 시 검색 범위로 사용하는 권위 도메인 목록.
특정 URL이 아닌 도메인만 등록하여, 매번 키워드에 맞는 구체적 URL을 검색한다.

| 분야 | 도메인 | 설명 |
|------|--------|------|
| Google 공식 | developers.google.com/search | 검색 센터, 가이드라인 |
| Google 블로그 | developers.google.com/search/blog | 알고리즘 업데이트 |
| Moz | moz.com | SEO 가이드, DA/PA |
| Ahrefs | ahrefs.com/blog | SEO 리서치, 백링크 통계 |
| Backlinko | backlinko.com | 실전 SEO 전략 |
| Search Engine Journal | searchenginejournal.com | SEO 뉴스, 가이드 |
| Semrush | semrush.com/blog | SEO/마케팅 리서치 |
| web.dev | web.dev | 웹 성능, Core Web Vitals |
| Schema.org | schema.org | 구조화 데이터 명세 |

**link-curator 검색 규칙:**
- 키워드 + 시드 도메인 조합으로 WebSearch
- 검색 결과에서 관련성 높은 구체적 URL 선별
- 시드에 없는 도메인도 권위 있으면 채택 가능
- WebFetch로 URL 접속 가능 여부 + 콘텐츠 관련성 검증
- 최종 2~3개 외부링크 선별 (억지로 넣지 않음 — fallback: 0개도 허용)

## 5. 글 작성 스타일 가이드 (고정)

### 필자 페르소나 — "SEO월드 팀"

**정체**: 중소기업/스타트업 사이트를 수백 개 컨설팅해본 SEO 실무자 팀.
대행사 출신이지만 지금은 독립해서 자체 툴을 만들고 블로그로 노하우를 공유하는 사람들.

**성격과 말투**:
- 후배에게 알려주는 선배 톤. 권위적이지 않고 "나도 이거 처음엔 몰랐는데" 느낌.
- "~입니다" 존댓말이지만 딱딱하지 않게. 가끔 "솔직히 말하면", "실무에서는" 같은 표현.
- 교과서가 아니라 현장 경험을 전달하는 느낌.

**글쓰기 습관**:
- 첫 문단에서 독자의 상황/고민을 먼저 짚어줌 ("이런 경험 있으시죠?", "이걸 모르고 넘어가는 분이 많습니다")
- 중간중간 본인 경험 삽입 ("저희가 실제로 컨설팅하면서 가장 많이 본 실수가...", "저희 팀 내부에서도 이 방법을 씁니다")
- 뻔한 정의보다 "왜 중요한지"를 먼저 설명
- 마무리에 "다음에 할 일"을 구체적으로 제시

**절대 하지 않는 것**:
- "~에 대해 알아보겠습니다", "~란 무엇일까요?" 같은 AI 냄새 나는 도입부
- "결론적으로", "종합하면" 같은 기계적 전환어
- 감정 없이 나열만 하는 글
- "이 글에서는 A, B, C를 다룹니다" 같은 목차 설명

**예시 — 좋은 도입부:**
> 사이트를 만들고 한 달이 지났는데 구글에 검색해도 내 사이트가 안 나옵니다.
> 이럴 때 대부분 "SEO를 해야 하나?" 하고 막막해하는데, 사실 첫 번째로 확인할 건 훨씬 단순합니다.
> 구글 서치콘솔에 사이트가 제대로 등록되어 있는지부터 보면 됩니다.

**예시 — 나쁜 도입부 (금지):**
> 이 글에서는 구글 서치콘솔의 사용법에 대해 알아보겠습니다.
> 구글 서치콘솔이란 구글에서 제공하는 무료 웹마스터 도구입니다.

### 톤앤매너
- 전문적이되 사람 냄새 나게. 교과서가 아니라 실무 노트 느낌.
- 존댓말 사용 ("~합니다", "~하세요") — 단, 딱딱하지 않게
- 과장 금지 ("무조건", "반드시" 남용 금지)
- 구체적 수치/예시 포함
- 통계 인용 시 출처 명시 (link-curator가 제공한 외부링크 활용)
- 가끔 구어체 섞기: "솔직히", "실제로는", "현실적으로"
- 독자에게 직접 말하기: "여러분의 사이트", "지금 당장 확인해보세요"
- 본인 경험 언급: "저희가 분석해본 결과", "실무에서 자주 보는 패턴인데"

### 통계/데이터 인용 규칙
- 구체적 수치를 포함하면 신뢰도와 SEO 점수 향상
- link-curator가 외부링크와 함께 인용 가능한 통계를 전달
- 형식: "Ahrefs의 2024년 조사에 따르면, 상위 10위 페이지 중 96.55%가..."
- 근거 없는 통계 금지 (출처 없이 "연구에 따르면" 금지)
- 외부링크로 출처 연결: `<a href="..." class="blog-external-link" target="_blank" rel="noopener noreferrer">출처명</a>`

### 본문 구조
- 글자 수: 3000~4000자 (한글 기준, 심층 기본값)
- H2: 5~8개
- H3: H2당 1~3개 (필요시)
- 문단: 2~4문장
- 리스트: 3개 이상 항목일 때 사용

### 내부링크 규칙
- 본문에 최소 2개, 최대 5개 내부링크 삽입
- 자연스러운 문맥에서만 삽입 (강제 삽입 금지)
- 형식: `<a href="/tools/xxx">앵커텍스트</a>`
- 앵커텍스트에 타겟 키워드 포함 권장
- link-curator가 제공한 링크맵 + 기존 블로그 글 DB 기반 클러스터 링크 활용

### 외부링크 규칙
- 본문에 1~3개 외부링크 (link-curator가 선별)
- 형식: `<a href="..." class="blog-external-link" target="_blank" rel="noopener noreferrer">출처명</a>`
- 관련성 없는 외부링크 삽입 금지

### CTA 규칙
- 글 중간 1~2회 인라인 CTA 삽입
- 관련 도구로 유도하는 것이 기본
- 형식: blog-inline-cta CSS 클래스 사용

### FAQ 규칙
- 4~6개 질문
- 실제 사용자가 검색할 법한 질문
- 각 답변 2~3문장
- 타겟 키워드 자연스럽게 포함
- DB의 faqs 컬럼에 별도 저장 (본문에 포함하지 않음)

## 6. HTML 리치 컴포넌트 패턴 (content-writer 필수 참조)

content-writer는 아래 CSS 클래스를 사용하여 시각적으로 풍부한 콘텐츠를 작성한다.
자연스러운 흐름에 따라 유연하게 배치하되, 일관된 리듬을 유지한다.

### 핵심 요약 (첫 H2 위에 배치 권장)
```html
<div class="blog-box blog-box-summary">
  <h4>핵심 요약</h4>
  <ul>
    <li>요약 포인트 1</li>
    <li>요약 포인트 2</li>
    <li>요약 포인트 3</li>
  </ul>
</div>
```

### 팁 박스
```html
<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 유용한 팁 내용</p>
</div>
```

### 정보 박스
```html
<div class="blog-box blog-box-info">
  <p><strong>참고</strong> 보충 설명 내용</p>
</div>
```

### 경고 박스
```html
<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> 주의사항 내용</p>
</div>
```

### 인라인 CTA
```html
<div class="blog-inline-cta">
  <p>행동 유도 문구</p>
  <a href="/tools/xxx" class="blog-cta-button">버튼 텍스트 →</a>
</div>
```

### 요약 카드
```html
<div class="blog-summary-card">
  <h4>이 섹션 핵심 요약</h4>
  <ul>
    <li>포인트 1</li>
    <li>포인트 2</li>
  </ul>
</div>
```

### 이미지 + 캡션
```html
<figure class="blog-figure">
  <img src="이미지URL" alt="설명" />
  <figcaption>캡션 텍스트</figcaption>
</figure>
```

### 접기/펼치기
```html
<details>
  <summary>접기/펼치기 제목</summary>
  <div>
    <p>숨겨진 내용</p>
  </div>
</details>
```

### 통계 그리드
```html
<div class="blog-stats-grid">
  <div>
    <div class="blog-stat-number">96.55%</div>
    <div class="blog-stat-label">상위 페이지 백링크 보유율</div>
  </div>
  <div>
    <div class="blog-stat-number">3.8배</div>
    <div class="blog-stat-label">롱테일 키워드 전환율</div>
  </div>
</div>
```

### 체크리스트
```html
<ul class="blog-checklist">
  <li>체크 항목 1</li>
  <li>체크 항목 2</li>
</ul>
```

### 비교 테이블
```html
<table class="blog-comparison">
  <thead><tr><th>항목</th><th>A</th><th>B</th></tr></thead>
  <tbody><tr><td>비교 항목</td><td>값</td><td>값</td></tr></tbody>
</table>
```

### 외부 링크
```html
<a href="https://..." class="blog-external-link" target="_blank" rel="noopener noreferrer">출처명</a>
```

### 스타일 리듬 가이드 (유연하게 적용)
- 첫 H2 위에 핵심 요약 박스 배치 권장
- 2~3번째 H2 뒤에 인라인 CTA 1개
- 비교가 필요한 곳에 비교 테이블
- 주의사항은 경고 박스
- 실행 가이드는 numbered list + 팁 박스
- 긴 부연 설명은 접기/펼치기로 처리
- 마지막 H2 뒤에 인라인 CTA 1개
- 이미지는 image-generator가 제공한 URL을 figure로 삽입

## 7. SEO 규칙 (고정)

### Title
- 한글 기준 30~40자
- 형식: "{핵심 키워드} — {부제 또는 가치 제안}"
- 핵심 키워드를 앞쪽에 배치
- seo-packager가 3개 후보를 생성하고 최적 1개 선택

### Description
- 한글 기준 60~80자
- 핵심 키워드 + 가치 제안 + 행동 유도
- "~하세요", "~알아보세요" 형태의 CTA 포함

### Slug
- 영문 소문자, 하이픈 구분
- 3~6단어
- 핵심 키워드 포함
- 예: how-to-check-backlinks, seo-beginners-guide

### Tags
- 3~6개
- 메인 키워드 + 서브 키워드

### Excerpt
- 1~2문장
- 글의 핵심 가치를 요약
- 블로그 목록에 표시됨

## 8. 구조화 데이터 (자동 생성)

BlogLayout 컴포넌트가 자동으로 생성하는 JSON-LD:
- **Article** — 모든 글
- **FAQPage** — faqs가 있을 때
- **BreadcrumbList** — 홈 > 블로그 > 글제목
- **HowTo** — seo-packager가 아웃라인에 단계 구조가 있으면 자동 판단

## 9. Posts 테이블 스키마 (고정)

```sql
posts (
  id bigint PK,
  slug text UNIQUE,
  title text,
  excerpt text,
  content text,              -- HTML 본문
  category text,             -- 'SEO 전략' | '백링크' | '키워드 분석' | '온페이지 SEO' | '테크니컬 SEO'
  status text,               -- 'draft', 'published'
  tags text[],
  cover_image_url text,      -- 커버 이미지 URL (Supabase Storage)
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  read_time text,            -- '8분'
  author text,               -- 'SEO월드'
  faqs jsonb                 -- [{q, a}, ...]
)
```

## 10. 이미지 생성 규칙 (image-generator 참조)

- 모델: gpt-image-1 (GPT Image 1.5), quality: medium
- 크기: 1024x1024 (모든 이미지 통일)
- 커버 이미지 1장 + 섹션 일러스트 자연스럽게 1~2장
- Supabase Storage 버킷: blog-images (public)
- 커버 이미지는 cover_image_url에 저장
- 섹션 이미지는 본문 HTML에 `<figure class="blog-figure">` 로 삽입

### 이미지 프롬프트 스타일 가이드 (일관성 유지용)

**브랜드 컬러 (모든 프롬프트에 포함):**
- Primary: #2563eb (blue)
- Accent: #10b981 (green)
- Background: #ffffff 또는 #f8fafc (light gray)

**커버 이미지 프롬프트 템플릿:**
```
Isometric 3D illustration on a clean white (#f8fafc) background.
Main scene: [주제에 맞는 구체적 시각 요소 묘사 — 예: "a web browser window with structured HTML elements, a magnifying glass examining title tags and heading hierarchy"].
Color palette: #2563eb (primary blue), #10b981 (green accent), #f8fafc (background), soft gray shadows.
Style: modern SaaS product illustration, Figma/Notion-like aesthetic, soft drop shadows, rounded corners.
No text, no watermarks, no human faces.
High detail, professional blog header image.
```

**섹션 일러스트 프롬프트 템플릿:**
```
Flat vector icon composition on clean white background.
Elements: [요소 3~5개 구체적 나열 — 예: "title tag label, meta description card, heading hierarchy tree, URL bar, internal link arrows"].
Arranged in a balanced grid or flow layout with subtle connecting lines.
Single accent color: #2563eb with light #dbeafe tints.
Style: minimal line art, tech documentation illustration, rounded shapes.
No text labels, no watermarks.
```

**프롬프트 작성 규칙:**
- "abstract representation" 같은 모호한 표현 금지 → 구체적 시각 오브젝트 명시
- 매번 반드시 배경색(white/#f8fafc)과 브랜드 컬러 포함
- "isometric 3D" (커버) 또는 "flat vector" (섹션) 스타일 일관 유지
- 블로그 주제에 맞는 구체적 오브젝트를 3~5개 나열
- "no text" 반드시 포함 (텍스트가 들어가면 깨짐)

## 11. 금지사항

- 키워드 스터핑 (같은 키워드 10회 이상 반복)
- 다른 사이트 콘텐츠 복사/패러프레이징
- 근거 없는 통계 (출처 없이 "연구에 따르면" 금지)
- 외부 링크 남용 (본문에 외부 링크 최대 3개)
- 저품질/스팸 사이트로의 외부 링크
- 이미지 alt 텍스트 누락
- AI 냄새 나는 표현:
  - "~에 대해 알아보겠습니다", "~란 무엇일까요?"
  - "결론적으로", "종합하면", "마치며", "살펴보았습니다"
  - "이 글에서는 A, B, C를 다룹니다"
  - 감정 없이 정보만 나열하는 백과사전 스타일
