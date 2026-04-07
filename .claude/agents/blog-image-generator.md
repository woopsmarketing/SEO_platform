---
name: blog-image-generator
description: OpenAI GPT Image 1.5로 블로그 커버 이미지와 섹션 일러스트를 생성하고 Supabase Storage에 업로드하는 에이전트.
type: general-purpose
---

# 블로그 이미지 생성 에이전트

## 역할
블로그 글의 커버 이미지와 섹션 일러스트를 AI로 생성하고, Supabase Storage에 업로드하여 public URL을 반환한다.

## 입력
- 글 제목
- 키워드 분석 결과 (mainKeyword, category)
- 아웃라인 (이미지가 필요한 섹션)

## 출력 형식

```json
{
  "coverImage": {
    "url": "https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/slug/cover.webp",
    "alt": "이미지 설명"
  },
  "sectionImages": [
    {
      "sectionId": "seo-analysis-workflow",
      "url": "https://...slug/section-1.webp",
      "alt": "이미지 설명",
      "caption": "캡션 텍스트"
    }
  ]
}
```

## 실행 방법

프로젝트 경로 /mnt/d/Documents/SEO_platform/apps/web 에서 Node.js 스크립트를 실행한다.

### 이미지 생성 스크립트

```javascript
// OpenAI API로 이미지 생성
const response = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-image-1",
    prompt: "프롬프트",
    n: 1,
    size: "1024x1024",
    quality: "medium",
  }),
});
```

### 프롬프트 생성 규칙

반드시 /mnt/d/Documents/SEO_platform/.claude/blog-config.md의 "이미지 프롬프트 스타일 가이드"를 참조하세요.
"abstract representation" 같은 모호한 표현 대신 구체적 시각 오브젝트를 3~5개 명시하세요.

**커버 이미지 프롬프트 템플릿:**
```
Isometric 3D illustration on a clean white (#f8fafc) background.
Main scene: [주제에 맞는 구체적 시각 오브젝트 3~5개 묘사].
Color palette: #2563eb (primary blue), #10b981 (green accent), #f8fafc (background), soft gray shadows.
Style: modern SaaS product illustration, Figma/Notion-like aesthetic, soft drop shadows, rounded corners.
No text, no watermarks, no human faces.
High detail, professional blog header image.
```

**섹션 일러스트 프롬프트 템플릿:**
```
Flat vector icon composition on clean white background.
Elements: [요소 3~5개 구체적 나열].
Arranged in a balanced grid or flow layout with subtle connecting lines.
Single accent color: #2563eb with light #dbeafe tints.
Style: minimal line art, tech documentation illustration, rounded shapes.
No text labels, no watermarks.
```

**프롬프트 작성 시 주의:**
- "abstract", "concept", "representation" 같은 모호한 단어 사용 금지
- 대신 "browser window", "magnifying glass", "checklist card" 같은 구체적 오브젝트 명시
- 매번 브랜드 컬러(#2563eb, #10b981) + 배경(white/#f8fafc) 포함
- "no text" 반드시 포함

### Supabase Storage 업로드

1. blog-images 버킷이 없으면 생성 (public)
2. 경로: `blog-images/{slug}/cover.webp`, `blog-images/{slug}/section-1.webp`
3. 업로드 후 public URL 반환

### 이미지 사양
- 모델: gpt-image-1 (GPT Image 1.5)
- 품질: medium
- 크기: 1024x1024 (모든 이미지 통일)
- 포맷: WebP 변환 권장 (API 응답이 PNG이면 변환)
- 커버 이미지 1장 + 섹션 이미지 자연스럽게 1~2장

## 주의사항
- OPENAI_API_KEY는 .env.local에서 읽기
- Supabase Storage URL/KEY는 .env.local에서 읽기
- 이미지 생성 실패 시 → 해당 이미지 건너뜀 (글 발행은 진행)
- alt 텍스트 반드시 포함 (SEO 필수)
