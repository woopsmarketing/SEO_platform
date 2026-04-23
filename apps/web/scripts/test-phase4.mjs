#!/usr/bin/env node
/**
 * Phase 4 단위 테스트
 * - 3개 페이지 + 3개 API 라우트 파일 존재
 * - backlink-gap: VebAPI backlinkdata 호출 + fetchWithCache("metrics"
 * - keyword-gap: fetchWithCache("serp" + saveToCache("serp"
 * - competitor-discovery: Serper SERP + serp 캐시 + fetchWithCache("metrics"
 * - 모든 라우트에 rate limit + Promise.allSettled
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let passed = 0;
let failed = 0;
function ok(name, cond, extra = "") {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name} ${extra}`);
  }
}

function read(relPath) {
  return readFileSync(join(ROOT, relPath), "utf-8");
}

// --- 1. 파일 존재 확인 ---
console.log("\n[1] 파일 존재");
const files = [
  "src/app/(public)/tools/backlink-gap/page.tsx",
  "src/app/(public)/tools/backlink-gap/backlink-gap-form.tsx",
  "src/app/api/backlink-gap/route.ts",
  "src/app/(public)/tools/keyword-gap/page.tsx",
  "src/app/(public)/tools/keyword-gap/keyword-gap-form.tsx",
  "src/app/api/keyword-gap/route.ts",
  "src/app/(public)/tools/competitor-discovery/page.tsx",
  "src/app/(public)/tools/competitor-discovery/competitor-discovery-form.tsx",
  "src/app/api/competitor-discovery/route.ts",
];
for (const f of files) {
  ok(`${f} exists`, existsSync(join(ROOT, f)));
}

// --- 2. backlink-gap route ---
console.log("\n[2] backlink-gap API");
const backlinkGapSrc = read("src/app/api/backlink-gap/route.ts");
ok(
  "VebAPI backlinkdata 호출",
  backlinkGapSrc.includes("vebapi.com/api/seo/backlinkdata"),
);
ok(
  'fetchWithCache("metrics" 호출',
  /fetchWithCache\b[^(]*\(\s*["']metrics["']/.test(backlinkGapSrc),
);
ok("rate-limit import", backlinkGapSrc.includes("@/lib/rate-limit"));
ok("Promise.allSettled 사용", backlinkGapSrc.includes("Promise.allSettled"));
ok("Promise.all (두 도메인 병렬 조회)", backlinkGapSrc.includes("Promise.all"));
ok("referring domain 추출 (url_from)", backlinkGapSrc.includes("url_from"));
ok("onlyCompetitor 분류", backlinkGapSrc.includes("onlyCompetitor"));

// --- 3. keyword-gap route ---
console.log("\n[3] keyword-gap API");
const keywordGapSrc = read("src/app/api/keyword-gap/route.ts");
ok(
  'fetchWithCache("serp" 호출',
  /fetchWithCache\b[^(]*\(\s*["']serp["']/.test(keywordGapSrc),
);
ok(
  'saveToCache("serp" 호출',
  /saveToCache\b[^(]*\(\s*["']serp["']/.test(keywordGapSrc),
);
ok(
  "Serper API 직접 호출 (fallback)",
  keywordGapSrc.includes("google.serper.dev/search"),
);
ok("rate-limit import", keywordGapSrc.includes("@/lib/rate-limit"));
ok("Promise.allSettled 사용", keywordGapSrc.includes("Promise.allSettled"));
ok("onlyCompetitor / both / onlyMine 분류", keywordGapSrc.includes("onlyCompetitor") && keywordGapSrc.includes("both") && keywordGapSrc.includes("onlyMine"));
ok("seedKeywords 파라미터 지원", keywordGapSrc.includes("seedKeywords"));

// --- 4. competitor-discovery route ---
console.log("\n[4] competitor-discovery API");
const discoverySrc = read("src/app/api/competitor-discovery/route.ts");
ok(
  "Serper SERP 호출",
  discoverySrc.includes("google.serper.dev/search"),
);
ok(
  'fetchWithCache("serp" 호출',
  /fetchWithCache\b[^(]*\(\s*["']serp["']/.test(discoverySrc),
);
ok(
  'saveToCache("serp" 호출',
  /saveToCache\b[^(]*\(\s*["']serp["']/.test(discoverySrc),
);
ok(
  'fetchWithCache("metrics" 호출',
  /fetchWithCache\b[^(]*\(\s*["']metrics["']/.test(discoverySrc),
);
ok("rate-limit import", discoverySrc.includes("@/lib/rate-limit"));
ok("Promise.allSettled 사용", discoverySrc.includes("Promise.allSettled"));
ok("gl=kr / hl=ko 설정", discoverySrc.includes("\"kr\"") && discoverySrc.includes("\"ko\""));

// --- 5. UI: GA4 이벤트 ---
console.log("\n[5] GA4 이벤트 트래킹");
const backlinkGapForm = read("src/app/(public)/tools/backlink-gap/backlink-gap-form.tsx");
ok("backlink-gap: trackToolUsage", backlinkGapForm.includes("trackToolUsage"));
ok("backlink-gap: trackToolAttempt", backlinkGapForm.includes("trackToolAttempt"));

const keywordGapForm = read("src/app/(public)/tools/keyword-gap/keyword-gap-form.tsx");
ok("keyword-gap: trackToolUsage", keywordGapForm.includes("trackToolUsage"));
ok("keyword-gap: CSV 다운로드 버튼", keywordGapForm.includes("CSV 다운로드"));

const discoveryForm = read("src/app/(public)/tools/competitor-discovery/competitor-discovery-form.tsx");
ok("competitor-discovery: trackToolUsage", discoveryForm.includes("trackToolUsage"));
ok("competitor-discovery: domain-authority 링크", discoveryForm.includes("/tools/domain-authority"));

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
