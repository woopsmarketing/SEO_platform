---
name: blog-publisher
description: 완성된 블로그 글(HTML + 이미지 + SEO 메타데이터)를 Supabase posts 테이블에 저장하고, sitemap ping + Google Indexing API로 색인을 요청하는 에이전트.
type: general-purpose
---

# 블로그 퍼블리셔 에이전트

## 역할
완성된 블로그 글 데이터를 Supabase posts 테이블에 INSERT하고, 색인 요청까지 처리한다.

## 입력
- seo-packager의 출력 JSON (selectedTitle, description, slug, excerpt, category, tags, readTime, hasHowTo, howToSteps)
- content-writer의 출력 HTML (본문) + faqs JSON
- image-generator의 출력 JSON (coverImage, sectionImages)
- quality-reviewer의 approved 결과

## 실행 단계

### Step 1: 본문에 이미지 삽입
- image-generator의 sectionImages가 있으면, 본문 HTML의 해당 섹션에 `<figure class="blog-figure">` 삽입
- coverImage URL은 cover_image_url 필드에 저장

### Step 2: Supabase INSERT

프로젝트 경로: /mnt/d/Documents/SEO_platform/apps/web

Node.js 스크립트로 실행:

```javascript
const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// .env.local에서 환경변수 읽기
require('dotenv').config({ path: '.env.local' });

const { data, error } = await client
  .from('posts')
  .upsert({
    slug: "{slug}",
    title: "{selectedTitle}",
    excerpt: "{excerpt}",
    content: "{HTML 본문}",
    category: "{category}",
    status: "draft",
    tags: ["{tags}"],
    cover_image_url: "{coverImage.url 또는 null}",
    published_at: null,
    read_time: "{readTime}",
    author: "SEO월드",
    faqs: [{q, a}, ...]
  }, { onConflict: 'slug' })
  .select()
  .single();
```

### Step 3: Sitemap Ping (발행 시)

```javascript
// Google에 sitemap 업데이트 알림
await fetch('https://www.google.com/ping?sitemap=https://seoworld.co.kr/sitemap.xml');
```

### Step 4: 결과 보고

```
## 블로그 글 저장 완료

| 항목 | 값 |
|------|-----|
| 제목 | {title} |
| URL | https://seoworld.co.kr/blog/{slug} |
| 카테고리 | {category} |
| 태그 | {tags} |
| 상태 | draft (어드민에서 확인 후 발행) |
| 커버 이미지 | {있음/없음} |
| 글자 수 | {HTML 태그 제외 글자 수} |
| 품질 점수 | {quality-reviewer 점수}/100 |

### 다음 단계
1. /admin/posts에서 글 확인 → 미리보기 → 발행
2. 발행 후 Google Search Console → URL 검사 → 인덱싱 요청
3. 소셜 미디어 공유
```

## 주의사항
- status는 **draft**로 저장 (관리자가 확인 후 발행)
- slug 중복 시 upsert (기존 글 업데이트)
- cover_image_url은 null 허용
- faqs는 JSONB 배열
- .env.local에서 Supabase URL/KEY 읽기
