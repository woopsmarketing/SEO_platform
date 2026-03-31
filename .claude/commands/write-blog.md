# /write-blog 워크플로우

키워드를 입력받아 SEO 최적화된 블로그 글을 자동 생성하고 발행한다.

## 사용법

```
/write-blog 백링크 확인하는 방법
/write-blog SEO란 무엇인가
/write-blog 구글 상위노출 방법
```

## 실행 흐름

아래 5단계를 순서대로 실행한다. 각 단계의 출력은 다음 단계의 입력으로 전달된다.

### 1단계: 키워드 분석 (blog-keyword-analyst)

`blog-keyword-analyst` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 키워드를 분석하세요.

메인 키워드: {사용자 입력 키워드}

.claude/agents/blog-keyword-analyst.md의 규칙에 따라 JSON을 출력하세요.
검색 의도, 서브 키워드, LSI 키워드, 타겟 독자, 연결 도구를 분석하세요.
blog-config.md의 "내부 도구 링크"와 "내부 서비스 링크"에서 관련 도구/서비스를 선정하세요.
```

1단계 출력을 `keywordAnalysis` 변수에 저장한다.

### 2단계: 아웃라인 생성 (blog-outline-builder)

`blog-outline-builder` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 키워드 분석 결과를 기반으로 블로그 아웃라인을 생성하세요.

키워드 분석 결과:
{1단계 keywordAnalysis JSON}

.claude/agents/blog-outline-builder.md의 규칙에 따라 JSON을 출력하세요.
H1, H2(5~8개), H3, FAQ 질문(4~6개), CTA 배치, 내부링크 배치를 포함하세요.
```

2단계 출력을 `outline` 변수에 저장한다.

### 3단계: 본문 작성 (blog-content-writer)

`blog-content-writer` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 아웃라인과 키워드 분석을 기반으로 블로그 본문을 작성하세요.

키워드 분석:
{keywordAnalysis JSON}

아웃라인:
{outline JSON}

.claude/agents/blog-content-writer.md의 규칙에 따라 마크다운 본문을 작성하세요.
H2부터 시작하세요 (H1은 제외). FAQ 섹션과 마무리 CTA를 포함하세요.
2000~4000자(한글 기준)로 작성하세요.
내부링크를 아웃라인의 지시에 따라 삽입하세요.
```

3단계 출력을 `content` 변수에 저장한다.

### 4단계: SEO 패키징 (blog-seo-packager)

`blog-seo-packager` 에이전트를 호출한다.

전달할 프롬프트:
```
아래 블로그 글의 SEO 메타데이터를 생성하세요.

키워드 분석:
{keywordAnalysis JSON}

아웃라인 H1: {outline.h1}

.claude/agents/blog-seo-packager.md의 규칙에 따라 JSON을 출력하세요.
title, description, slug, excerpt, category, tags, ogTitle, ogDescription을 생성하세요.
```

4단계 출력을 `seoPackage` 변수에 저장한다.

### 5단계: 발행 (blog-publisher)

`blog-publisher` 에이전트를 호출한다.

전달할 프롬프트:
```
아래 블로그 글을 Supabase posts 테이블에 발행하세요.

SEO 패키지:
{seoPackage JSON}

본문 (마크다운):
{content}

프로젝트 경로: /mnt/d/Documents/SEO_platform/apps/web

Supabase admin client (service_role)를 사용하여 posts 테이블에 INSERT하세요.
.claude/agents/blog-publisher.md의 규칙에 따라 실행하고 결과를 보고하세요.

방법: src/lib/supabase/admin.ts의 createAdminClient를 사용하여 Node.js 스크립트로 실행하거나,
또는 Supabase MCP를 사용하여 직접 INSERT하세요.
```

### 6단계: 완료 보고

아래 형식으로 최종 요약을 출력한다:

```
## /write-blog 완료

### 발행 정보
| 항목 | 값 |
|------|-----|
| 제목 | {title} |
| URL | https://seoworld.co.kr/blog/{slug} |
| 카테고리 | {category} |
| 태그 | {tags} |
| 글자 수 | {글자 수} |

### 키워드 전략
- 메인 키워드: {mainKeyword}
- 검색 의도: {intent}
- 서브 키워드: {subKeywords}

### 내부링크
- {삽입된 내부링크 목록}

### 다음 단계
1. Google Search Console → URL 검사 → 인덱싱 요청
2. 소셜 미디어 공유
```
