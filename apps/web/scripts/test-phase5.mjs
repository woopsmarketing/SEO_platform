#!/usr/bin/env node
/**
 * Phase 5 단위 테스트
 * - 4개 페이지 + 4개 API 라우트 존재
 * - longtail에 VebAPI 또는 Serper 호출 + metrics 캐시 경유
 * - snippet/content-gap에 OpenAI 호출
 * - serp-difficulty에 serp 캐시 경유 + 각 도메인 metrics 캐시
 * - 모든 라우트에 rate limit import 있음
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let passed = 0;
let failed = 0;
function ok(name, cond, extra = "") {
  if (cond) {
    passed++;
    console.log(`  PASS ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name} ${extra}`);
  }
}

const read = (p) => readFileSync(join(ROOT, p), "utf-8");

// 1. 4개 페이지 존재 + form 컴포넌트
const pages = [
  ["longtail-keywords", "LongtailForm"],
  ["snippet-optimizer", "SnippetForm"],
  ["content-gap", "ContentGapForm"],
  ["serp-difficulty", "SerpDifficultyForm"],
];
console.log("\n[1] 페이지 + form 컴포넌트 존재");
for (const [slug, comp] of pages) {
  try {
    const p = read(`src/app/(public)/tools/${slug}/page.tsx`);
    ok(`${slug}/page.tsx exists`, p.length > 0);
    ok(`${slug}/page.tsx imports ${comp}`, p.includes(comp));
  } catch {
    ok(`${slug}/page.tsx exists`, false);
  }
}

// form 파일 존재
const forms = [
  ["longtail-keywords", "longtail-form.tsx", "LongtailForm"],
  ["snippet-optimizer", "snippet-form.tsx", "SnippetForm"],
  ["content-gap", "content-gap-form.tsx", "ContentGapForm"],
  ["serp-difficulty", "serp-difficulty-form.tsx", "SerpDifficultyForm"],
];
for (const [slug, fname, comp] of forms) {
  try {
    const f = read(`src/app/(public)/tools/${slug}/${fname}`);
    ok(`${slug}/${fname} exports ${comp}`, f.includes(`export function ${comp}`));
  } catch {
    ok(`${slug}/${fname} exists`, false);
  }
}

// 2. 4개 API 라우트 존재
console.log("\n[2] API 라우트 존재");
const apis = [
  "longtail-keywords",
  "snippet-optimizer",
  "content-gap",
  "serp-difficulty",
];
const apiSrc = {};
for (const name of apis) {
  try {
    apiSrc[name] = read(`src/app/api/${name}/route.ts`);
    ok(`api/${name}/route.ts exists`, apiSrc[name].length > 0);
  } catch {
    ok(`api/${name}/route.ts exists`, false);
  }
}

// 3. 모든 라우트 rate limit import
console.log("\n[3] 모든 라우트 rate limit import");
for (const name of apis) {
  const s = apiSrc[name] || "";
  ok(
    `${name} imports checkRateLimit`,
    s.includes("checkRateLimit") && s.includes("@/lib/rate-limit"),
  );
  ok(`${name} calls checkRateLimit(...)`, /checkRateLimit\s*\(/.test(s));
}

// 4. longtail: VebAPI 또는 Serper + metrics 캐시
console.log("\n[4] longtail-keywords 외부 API + metrics 캐시");
{
  const s = apiSrc["longtail-keywords"] || "";
  ok(
    "longtail uses VebAPI or Serper",
    s.includes("vebapi.com") || s.includes("serper.dev") || s.includes("suggestqueries.google.com"),
  );
  ok(
    "longtail fetchWithCache('metrics', ...)",
    /fetchWithCache<[^>]*>\(\s*["']metrics["']/.test(s) ||
      /fetchWithCache\(\s*["']metrics["']/.test(s),
  );
  ok(
    "longtail fetchWithCache('serp', ...) or Serper 직접",
    s.includes('"serp"') || s.includes("'serp'") || s.includes("serper.dev"),
  );
}

// 5. snippet: OpenAI 호출
console.log("\n[5] snippet-optimizer OpenAI 호출");
{
  const s = apiSrc["snippet-optimizer"] || "";
  ok("snippet OpenAI endpoint", s.includes("api.openai.com/v1/chat/completions"));
  ok("snippet uses gpt-4o-mini", s.includes("gpt-4o-mini"));
  ok("snippet Serper 호출(스니펫 수집)", s.includes("serper.dev") || s.includes("google.serper.dev"));
}

// 6. content-gap: OpenAI 호출
console.log("\n[6] content-gap OpenAI 호출");
{
  const s = apiSrc["content-gap"] || "";
  ok("content-gap OpenAI endpoint", s.includes("api.openai.com/v1/chat/completions"));
  ok("content-gap uses gpt-4o-mini", s.includes("gpt-4o-mini"));
  ok("content-gap extracts topics (diff logic)", s.includes("onlyCompetitor") && s.includes("common"));
}

// 7. serp-difficulty: serp 캐시 + 각 도메인 metrics 캐시
console.log("\n[7] serp-difficulty 캐시 경유");
{
  const s = apiSrc["serp-difficulty"] || "";
  ok("serp-difficulty serp 캐시", /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']serp["']/.test(s));
  ok(
    "serp-difficulty metrics 캐시 (도메인별)",
    /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']metrics["']/.test(s),
  );
  ok("serp-difficulty 점수 계산 (DA*0.4 + DR*0.4 + TF*0.2)",
    s.includes("0.4") && s.includes("0.2") && s.includes("difficultyScore"));
  ok("serp-difficulty 구간 레이블", s.includes("낮음") && s.includes("보통") && s.includes("어려움"));
}

// 8. GA4 이벤트 (form 컴포넌트)
console.log("\n[8] GA4 이벤트 (form 컴포넌트)");
for (const [slug, fname] of forms) {
  try {
    const f = read(`src/app/(public)/tools/${slug}/${fname}`);
    ok(`${slug} trackToolAttempt`, f.includes("trackToolAttempt"));
    ok(`${slug} trackToolUsage`, f.includes("trackToolUsage"));
  } catch {}
}

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
