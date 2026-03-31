# 블로그 글 작성 고정 규칙

> 이 파일은 /write-blog 파이프라인에서 모든 에이전트가 참조하는 고정 규칙입니다.
> 매 글마다 변하지 않는 사이트 정보, 스타일 가이드, SEO 규칙을 정의합니다.

## 1. 사이트 정보 (고정)

- 사이트명: SEO월드
- 도메인: https://seoworld.co.kr
- 블로그 URL 패턴: https://seoworld.co.kr/blog/{slug}
- 가이드 URL 패턴: https://seoworld.co.kr/guides/{slug}
- DB 테이블: posts (Supabase)
- 카테고리: blog 또는 guide

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

## 4. 글 작성 스타일 가이드 (고정)

### 톤앤매너
- 전문적이되 쉽게 설명
- 존댓말 사용 ("~합니다", "~하세요")
- 과장 금지 ("무조건", "반드시" 남용 금지)
- 구체적 수치/예시 포함

### 본문 구조
- 글자 수: 2000~4000자 (한글 기준)
- H2: 5~8개
- H3: H2당 1~3개 (필요시)
- 문단: 2~4문장
- 리스트: 3개 이상 항목일 때 사용

### 내부링크 규칙
- 본문에 최소 2개, 최대 5개 내부링크 삽입
- 자연스러운 문맥에서만 삽입 (강제 삽입 금지)
- 형식: [앵커텍스트](URL)
- 앵커텍스트에 타겟 키워드 포함 권장

### CTA 규칙
- 글 중간 1회 + 글 끝 1회 CTA 삽입
- 관련 도구로 유도: "지금 바로 [도구명]으로 확인해보세요."
- 서비스 유도 (선택): "전문가의 도움이 필요하다면 [서비스명]을 문의하세요."

### FAQ 규칙
- 4~6개 질문
- 실제 사용자가 검색할 법한 질문
- 각 답변 2~3문장
- 타겟 키워드 자연스럽게 포함

## 5. SEO 규칙 (고정)

### Title
- 한글 기준 30~40자
- 형식: "{핵심 키워드} — {부제 또는 가치 제안}"
- 핵심 키워드를 앞쪽에 배치

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

## 6. Article Schema 템플릿 (고정 구조)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title}}",
  "description": "{{description}}",
  "author": {
    "@type": "Organization",
    "name": "SEO월드",
    "url": "https://seoworld.co.kr"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SEO월드",
    "url": "https://seoworld.co.kr"
  },
  "datePublished": "{{publishedAt}}",
  "dateModified": "{{updatedAt}}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://seoworld.co.kr/blog/{{slug}}"
  }
}
```

## 7. Posts 테이블 스키마 (고정)

```sql
posts (
  id bigint PK,
  slug text UNIQUE,
  title text,
  excerpt text,
  content text,          -- 마크다운 본문
  category text,         -- 'blog' 또는 'guide'
  status text,           -- 'draft', 'published', 'archived'
  author_id uuid,
  cover_image_url text,
  tags text[],
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

## 8. 금지사항

- 키워드 스터핑 (같은 키워드 10회 이상 반복)
- 다른 사이트 콘텐츠 복사/패러프레이징
- 근거 없는 통계 (출처 없이 "연구에 따르면" 금지)
- 외부 링크 남용 (본문에 외부 링크 최대 2개)
- 이미지 없는 글 권장하지 않음 (alt text 반드시 포함)
