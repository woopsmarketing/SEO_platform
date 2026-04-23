#!/usr/bin/env node
/**
 * Phase 6-2/6-3 단위 테스트
 * - 2개 페이지 + 2개 API 라우트 존재
 * - common-backlinks: VebAPI backlink + metrics 캐시 + set intersection 로직
 * - my-top-keywords: serp 캐시 + save + 도메인 ranking 매칭 로직
 * - rate limit + Promise.allSettled + 입력 검증
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

// 1. 페이지 + form 컴포넌트
console.log("\n[1] 페이지 + form 컴포넌트 존재");
const pages = [
  ["common-backlinks", "CommonBacklinksForm", "common-backlinks-form.tsx"],
  ["my-top-keywords", "MyTopKeywordsForm", "my-top-keywords-form.tsx"],
];
for (const [slug, comp, fname] of pages) {
  try {
    const p = read(`src/app/(public)/tools/${slug}/page.tsx`);
    ok(`${slug}/page.tsx exists`, p.length > 0);
    ok(`${slug}/page.tsx imports ${comp}`, p.includes(comp));
  } catch {
    ok(`${slug}/page.tsx exists`, false);
  }
  try {
    const f = read(`src/app/(public)/tools/${slug}/${fname}`);
    ok(`${slug}/${fname} exports ${comp}`, f.includes(`export function ${comp}`));
    ok(`${slug} trackToolAttempt`, f.includes("trackToolAttempt"));
    ok(`${slug} trackToolUsage`, f.includes("trackToolUsage"));
  } catch {
    ok(`${slug}/${fname} exists`, false);
  }
}

// 2. API 라우트 존재
console.log("\n[2] API 라우트 존재");
const apis = ["common-backlinks", "my-top-keywords"];
const apiSrc = {};
for (const name of apis) {
  try {
    apiSrc[name] = read(`src/app/api/${name}/route.ts`);
    ok(`api/${name}/route.ts exists`, apiSrc[name].length > 0);
  } catch {
    ok(`api/${name}/route.ts exists`, false);
    apiSrc[name] = "";
  }
}

// 3. rate limit + Promise.allSettled + 입력 검증
console.log("\n[3] 공통 가드 (rate limit / allSettled / 입력 검증)");
for (const name of apis) {
  const s = apiSrc[name];
  ok(
    `${name} imports checkRateLimit`,
    s.includes("checkRateLimit") && s.includes("@/lib/rate-limit"),
  );
  ok(`${name} calls checkRateLimit(...)`, /checkRateLimit\s*\(/.test(s));
  ok(`${name} uses Promise.allSettled`, s.includes("Promise.allSettled"));
  ok(`${name} normalize/validate domain`, /normalizeDomain|new URL\(/.test(s));
}

// 4. common-backlinks: VebAPI backlink + metrics cache + set intersection
console.log("\n[4] common-backlinks 외부 API + 로직");
{
  const s = apiSrc["common-backlinks"];
  ok("common-backlinks hits VebAPI backlinkdata", s.includes("vebapi.com/api/seo/backlinkdata"));
  ok(
    "common-backlinks fetchWithCache('metrics'...)",
    /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']metrics["']/.test(s),
  );
  ok(
    "common-backlinks set intersection 로직",
    s.includes("Set<string>") && /refSetsByInput|commonSet/.test(s),
  );
  ok(
    "common-backlinks 2~5개 제한 검증",
    /length\s*<\s*2|length\s*<\s*MIN_|length\s*>\s*5|length\s*>\s*MAX_|\.length\s*<\s*2\s*\|\|\s*.+?\.length\s*>\s*5/.test(s) ||
      (s.includes("< 2") && s.includes("> 5")),
  );
  ok("common-backlinks DA 내림차순 정렬", s.includes("sort") && s.includes("sourceDA"));
}

// 5. my-top-keywords: serp 캐시 + save + ranking 매칭
console.log("\n[5] my-top-keywords 캐시 + ranking 매칭");
{
  const s = apiSrc["my-top-keywords"];
  ok(
    "my-top-keywords fetchWithCache('serp'...)",
    /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']serp["']/.test(s),
  );
  ok(
    "my-top-keywords saveToCache('serp'...)",
    /saveToCache\s*\(\s*["']serp["']/.test(s),
  );
  ok(
    "my-top-keywords fetchWithCache('metrics'...) — 경쟁도 계산",
    /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']metrics["']/.test(s),
  );
  ok(
    "my-top-keywords 도메인 ranking 매칭",
    /findRank|extractDomain\(.+?\)\s*===\s*targetDomain|d\s*===\s*targetDomain/.test(s),
  );
  ok(
    "my-top-keywords TOP 20 제한",
    /TOP_RANKED_KEYWORDS|slice\(0,\s*20\)/.test(s),
  );
  ok(
    "my-top-keywords MAX 키워드 제한 (50)",
    /MAX_KEYWORDS|50/.test(s),
  );
  ok(
    "my-top-keywords 동시성 제한 batch 처리",
    /processBatches|CONCURRENCY|slice\(i,\s*i\s*\+/.test(s),
  );
}

// 6. GA4 이벤트(form)
console.log("\n[6] GA4 이벤트 (form 컴포넌트)");
for (const [slug, , fname] of pages) {
  try {
    const f = read(`src/app/(public)/tools/${slug}/${fname}`);
    ok(`${slug} trackRateLimit`, f.includes("trackRateLimit"));
    ok(`${slug} trackToolError`, f.includes("trackToolError"));
  } catch {}
}

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
