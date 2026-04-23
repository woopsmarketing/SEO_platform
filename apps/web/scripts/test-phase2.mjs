#!/usr/bin/env node
/**
 * Phase 2 단위 테스트
 * - 각 페이지/API 라우트 파일 존재
 * - serp-check: fetchWithCache("serp") + saveToCache("serp")
 * - local-serp: gl/hl 파라미터
 * - keyword-research: avgDA 필드/계산 로직
 * - rate-limit import
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
  "src/app/(public)/tools/serp-checker/page.tsx",
  "src/app/(public)/tools/serp-checker/serp-checker-form.tsx",
  "src/app/api/serp-check/route.ts",
  "src/app/(public)/tools/local-serp/page.tsx",
  "src/app/(public)/tools/local-serp/local-serp-form.tsx",
  "src/app/api/local-serp/route.ts",
  "src/app/(public)/tools/people-also-ask/page.tsx",
  "src/app/(public)/tools/people-also-ask/paa-form.tsx",
  "src/app/api/people-also-ask/route.ts",
];
for (const f of files) {
  ok(`${f} exists`, existsSync(join(ROOT, f)));
}

// --- 2. serp-check: 캐시 사용 ---
console.log("\n[2] serp-check API 캐시 경유");
const serpCheckSrc = read("src/app/api/serp-check/route.ts");
ok("fetchWithCache(\"serp\" 호출", /fetchWithCache\b[^(]*\(\s*["']serp["']/.test(serpCheckSrc));
ok("saveToCache(\"serp\" 호출", /saveToCache\b[^(]*\(\s*["']serp["']/.test(serpCheckSrc));
ok("Serper API 직접 호출 fallback", serpCheckSrc.includes("google.serper.dev/search"));
ok("도메인 순위 계산 (myRank)", serpCheckSrc.includes("myRank"));
ok("rate-limit import", serpCheckSrc.includes("@/lib/rate-limit"));

// --- 3. local-serp: gl/hl 파라미터 ---
console.log("\n[3] local-serp API 지역 파라미터");
const localSerpSrc = read("src/app/api/local-serp/route.ts");
ok("gl 파라미터 사용", /\bgl\b/.test(localSerpSrc));
ok("hl 파라미터 사용", /\bhl\b/.test(localSerpSrc));
ok("location 파라미터 지원", localSerpSrc.includes("location"));
ok("캐시 경유하지 않음 (fetchWithCache 미사용)",
   !localSerpSrc.includes("fetchWithCache"));
ok("rate-limit import", localSerpSrc.includes("@/lib/rate-limit"));

// --- 4. people-also-ask ---
console.log("\n[4] people-also-ask API");
const paaSrc = read("src/app/api/people-also-ask/route.ts");
ok("peopleAlsoAsk 필드 추출", paaSrc.includes("peopleAlsoAsk"));
ok("relatedSearches fallback", paaSrc.includes("relatedSearches"));
ok("rate-limit import", paaSrc.includes("@/lib/rate-limit"));

// --- 5. keyword-research: avgDA ---
console.log("\n[5] keyword-research avgDA 보강");
const kwSrc = read("src/app/api/keyword-research/route.ts");
ok("응답에 avgDA 필드 존재", kwSrc.includes("avgDA"));
ok("fetchWithCache(\"metrics\" 사용", /fetchWithCache\b[^(]*\(\s*["']metrics["']/.test(kwSrc));
ok("상위 N개만 계산 (AVG_DA_TOP_N)", kwSrc.includes("AVG_DA_TOP_N"));
ok("Promise.allSettled 사용 (실패 내성)", kwSrc.includes("Promise.allSettled"));
ok("rate-limit import", kwSrc.includes("@/lib/rate-limit"));

const kwFormSrc = read("src/app/(public)/tools/keyword-research/keyword-form.tsx");
ok("키워드 UI에 avgDA 컬럼", kwFormSrc.includes("avgDA"));
ok("UI 컬럼 헤더 \"경쟁도(DA)\"", kwFormSrc.includes("경쟁도(DA)"));

// --- 6. UI: GA4 이벤트 ---
console.log("\n[6] GA4 이벤트 트래킹");
const serpFormSrc = read("src/app/(public)/tools/serp-checker/serp-checker-form.tsx");
ok("serp-checker: trackToolUsage 호출", serpFormSrc.includes("trackToolUsage"));
const localFormSrc = read("src/app/(public)/tools/local-serp/local-serp-form.tsx");
ok("local-serp: trackToolUsage 호출", localFormSrc.includes("trackToolUsage"));
const paaFormSrc = read("src/app/(public)/tools/people-also-ask/paa-form.tsx");
ok("paa: trackToolUsage 호출", paaFormSrc.includes("trackToolUsage"));

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
