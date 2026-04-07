# /write-blog 워크플로우

키워드를 입력받아 SEO 최적화된 리치 HTML 블로그 글을 자동 생성하고 저장한다.

## 사용법

```
/write-blog 백링크 확인하는 방법
/write-blog SEO란 무엇인가
/write-blog 구글 상위노출 방법
```

## 실행 흐름

아래 8단계를 순서대로 실행한다. 각 단계의 출력은 다음 단계의 입력으로 전달된다.

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

### 2단계: 링크 큐레이션 (blog-link-curator)

`blog-link-curator` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 키워드 분석 결과를 기반으로 내부링크 + 외부링크를 큐레이션하세요.

키워드 분석 결과:
{keywordAnalysis JSON}

.claude/agents/blog-link-curator.md의 규칙에 따라 실행하세요:
1. blog-config.md의 내부 도구/서비스에서 관련 링크 선별
2. Supabase posts 테이블에서 기존 발행 글 조회하여 클러스터 링크 추천
3. WebSearch + WebFetch로 외부 권위 링크 3단계 검증
4. 통계/수치가 포함된 출처 우선 선별

JSON을 출력하세요.
```

2단계 출력을 `linkCuration` 변수에 저장한다.

### 3단계: 아웃라인 생성 (blog-outline-builder)

`blog-outline-builder` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 키워드 분석 결과를 기반으로 블로그 아웃라인을 생성하세요.

키워드 분석 결과:
{keywordAnalysis JSON}

링크 큐레이션:
{linkCuration JSON}

.claude/agents/blog-outline-builder.md의 규칙에 따라 JSON을 출력하세요.
H1, H2(5~8개) + h2Id, H3, FAQ 질문(4~6개), 시각 요소 배치 계획(visualElements), CTA 배치, 이미지 필요 섹션(imageNeeded)을 포함하세요.
```

3단계 출력을 `outline` 변수에 저장한다.

### 4단계: 이미지 생성 (blog-image-generator)

`blog-image-generator` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 정보를 기반으로 블로그 이미지를 생성하세요.

글 제목: {outline.h1}
메인 키워드: {keywordAnalysis.mainKeyword}

이미지 필요 섹션:
{outline.sections에서 imageNeeded=true인 섹션의 h2Id와 h2 목록}

.claude/agents/blog-image-generator.md의 규칙에 따라:
1. 커버 이미지 1장 (1024x1024, GPT Image 1.5 Medium)
2. 섹션 일러스트 (imageNeeded=true인 섹션당 1장)
3. optimize-image.js로 압축 (PNG→WebP, 커버 1200px/q80, 섹션 800px/q75)
4. 압축된 WebP를 Supabase Storage에 업로드
5. JSON으로 URL 반환

프로젝트 경로: /mnt/d/Documents/SEO_platform/apps/web
.env.local에서 OPENAI_API_KEY와 Supabase 키를 읽으세요.
slug: {예상 slug — keywordAnalysis.mainKeyword 기반 영문 하이픈}
```

4단계 출력을 `imageResult` 변수에 저장한다. (이미지 생성 실패 시 빈 객체로 진행)

### 5단계: 본문 작성 (blog-content-writer)

`blog-content-writer` 에이전트를 호출한다.

전달할 프롬프트:
```
/mnt/d/Documents/SEO_platform/.claude/blog-config.md 파일을 읽고, 아래 아웃라인과 키워드 분석을 기반으로 블로그 본문을 작성하세요.

키워드 분석:
{keywordAnalysis JSON}

아웃라인:
{outline JSON}

링크 큐레이션:
{linkCuration JSON}

이미지:
{imageResult JSON}

.claude/agents/blog-content-writer.md의 규칙에 따라:
- 순수 HTML로 작성 (마크다운 아님)
- H2에 id 속성 필수 (아웃라인의 h2Id 그대로 사용)
- 리치 컴포넌트 적극 활용 (blog-box-summary, blog-box-tip, blog-inline-cta, blog-comparison, details, stats-grid, blog-checklist 등)
- 링크 큐레이션의 내부/외부 링크를 자연스럽게 삽입
- 이미지 URL을 figure 태그로 삽입
- 핵심 요약 박스를 첫 H2 위에 배치
- 3000~4000자 (한글 기준)
- FAQ는 별도 JSON으로 출력 (본문에 포함하지 않음)

HTML 본문과 faqs JSON을 모두 출력하세요.
```

5단계 출력을 `content` (HTML)와 `faqs` (JSON) 변수에 저장한다.

### 6단계: 품질 검수 (blog-quality-reviewer)

`blog-quality-reviewer` 에이전트를 호출한다.

전달할 프롬프트:
```
아래 블로그 글의 품질을 검수하세요.

HTML 본문:
{content}

FAQs:
{faqs JSON}

키워드 분석:
{keywordAnalysis JSON}

링크 큐레이션:
{linkCuration JSON}

.claude/agents/blog-quality-reviewer.md의 규칙에 따라 검수하고 JSON을 출력하세요.
```

6단계 출력을 `qualityResult` 변수에 저장한다.

**분기 처리:**
- `approved=true` → 7단계로 진행
- `approved=false` → `requiredFixes`를 5단계 content-writer에게 전달하여 1회 자동 수정 → 6단계 재검수
- 2차에서도 `approved=false` → 현재 상태로 7단계 진행 (draft 저장 + 경고 표시)

### 7단계: SEO 패키징 (blog-seo-packager)

`blog-seo-packager` 에이전트를 호출한다.

전달할 프롬프트:
```
아래 블로그 글의 SEO 메타데이터를 생성하세요.

키워드 분석:
{keywordAnalysis JSON}

아웃라인:
{outline JSON (h1, hasStepStructure, sections)}

.claude/agents/blog-seo-packager.md의 규칙에 따라 JSON을 출력하세요.
title 후보 3개 생성, HowTo schema 판단, 카테고리는 한글 카테고리 중 선택.
카테고리: "SEO 전략" | "백링크" | "키워드 분석" | "온페이지 SEO" | "테크니컬 SEO"
```

7단계 출력을 `seoPackage` 변수에 저장한다.

### 8단계: 발행 (blog-publisher)

`blog-publisher` 에이전트를 호출한다.

전달할 프롬프트:
```
아래 블로그 글을 Supabase posts 테이블에 저장하세요.

SEO 패키지:
{seoPackage JSON}

HTML 본문:
{content}

FAQs:
{faqs JSON}

이미지:
{imageResult JSON}

품질 점수: {qualityResult.score}/100

프로젝트 경로: /mnt/d/Documents/SEO_platform/apps/web
.env.local에서 Supabase URL/KEY를 읽으세요.

.claude/agents/blog-publisher.md의 규칙에 따라:
1. posts 테이블에 draft로 INSERT (upsert by slug)
2. coverImage URL을 cover_image_url에 저장
3. sitemap ping 실행
4. 결과 보고
```

### 9단계: 완료 보고

아래 형식으로 최종 요약을 출력한다:

```
## /write-blog 완료

### 발행 정보
| 항목 | 값 |
|------|-----|
| 제목 | {selectedTitle} |
| URL | https://seoworld.co.kr/blog/{slug} |
| 카테고리 | {category} |
| 태그 | {tags} |
| 글자 수 | {글자 수} |
| 품질 점수 | {score}/100 |
| 커버 이미지 | {있음/없음} |
| 상태 | draft |

### 제목 후보
1. {titleCandidate1}
2. {titleCandidate2}
3. {titleCandidate3}
→ 선택: {selectedTitle} ({selectionReason})

### 키워드 전략
- 메인 키워드: {mainKeyword}
- 검색 의도: {intent}
- 서브 키워드: {subKeywords}

### 링크 전략
- 내부링크: {내부링크 목록}
- 외부링크: {외부링크 목록}
- 클러스터 링크: {기존 글 링크 목록}

### 시각 요소
- 박스: {박스 수}개
- 테이블: {테이블 수}개
- CTA: {CTA 수}개
- 이미지: {이미지 수}개
- 접기/펼치기: {details 수}개

### 다음 단계
1. /admin/posts에서 글 확인 → 미리보기 → 발행
2. Google Search Console → URL 검사 → 인덱싱 요청
3. 소셜 미디어 공유
```
