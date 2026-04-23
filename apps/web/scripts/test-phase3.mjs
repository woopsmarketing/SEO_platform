#!/usr/bin/env node
/**
 * Phase 3 단위 테스트 — 정적 검사.
 *
 * 사용: node scripts/test-phase3.mjs  (apps/web 디렉토리에서)
 *
 * 검사 대상:
 *   1. backlink-check/route.ts 에 fetchWithCache("metrics" 호출 (백링크 소스 도메인)
 *   2. route.ts 에 qualityScore / anchorDiversityRatio / avgQualityScore 필드/계산 존재
 *   3. backlink-form.tsx 에 "소스 DA", "품질", "최근 30일" 관련 문자열 + recharts import
 *   4. Promise.allSettled 사용 (metrics 병렬 + 실패 내성)
 *   5. recharts 에서 AreaChart 또는 LineChart import
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

let pass = 0;
let fail = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    pass++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failures.push({ name, message: err.message });
    fail++;
  }
}

function read(relPath) {
  const p = resolve(root, relPath);
  if (!existsSync(p)) throw new Error(`file not found: ${relPath}`);
  return readFileSync(p, "utf-8");
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// --- 1. 파일 존재 ---
console.log("\n[1] 파일 존재");
const routePath = "src/app/api/backlink-check/route.ts";
const formPath = "src/app/(public)/tools/backlink-checker/backlink-form.tsx";

test("backlink-check/route.ts 존재", () => {
  assert(existsSync(resolve(root, routePath)), routePath);
});
test("backlink-form.tsx 존재", () => {
  assert(existsSync(resolve(root, formPath)), formPath);
});

const routeSrc = read(routePath);
const formSrc = read(formPath);

// --- 2. route.ts: 소스 도메인 metrics 캐시 호출 ---
console.log("\n[2] route.ts — 백링크 소스 도메인 DA (metrics 캐시)");

test('fetchWithCache("metrics" 호출 있음', () => {
  assert(
    /fetchWithCache\b[^(]*\(\s*["']metrics["']/.test(routeSrc),
    'fetchWithCache("metrics" 패턴이 없음',
  );
});

test("fetchWithCache 호출이 2회 이상 (대상 도메인 + 소스 도메인)", () => {
  const matches = routeSrc.match(/fetchWithCache\b[^(]*\(\s*["']metrics["']/g) ?? [];
  assert(matches.length >= 2, `fetchWithCache("metrics") 호출이 ${matches.length}회`);
});

test("Promise.allSettled 사용 (metrics 병렬 + 실패 내성)", () => {
  assert(
    routeSrc.includes("Promise.allSettled"),
    "Promise.allSettled 미사용 — 소스 도메인 metrics 병렬 실패 내성 필요",
  );
});

test("sourceDA 필드 부착 로직", () => {
  assert(routeSrc.includes("sourceDA"), "sourceDA 필드 없음");
});

// --- 3. route.ts: 품질 점수 / 앵커 다양성 ---
console.log("\n[3] route.ts — 품질 점수 & 앵커 다양성");

test("qualityScore 필드 존재", () => {
  assert(routeSrc.includes("qualityScore"), "qualityScore 필드 없음");
});

test("avgQualityScore 필드 존재", () => {
  assert(routeSrc.includes("avgQualityScore"), "avgQualityScore 필드 없음");
});

test("anchorDiversityRatio 필드 존재", () => {
  assert(
    routeSrc.includes("anchorDiversityRatio"),
    "anchorDiversityRatio 필드 없음",
  );
});

test("앵커 다양성 보너스 계산 존재", () => {
  assert(
    routeSrc.includes("anchorDiversityBonus"),
    "anchorDiversityBonus 변수/계산 없음",
  );
});

test("doFollow 가중치 로직 (40 / 10)", () => {
  assert(
    /40/.test(routeSrc) && /\b10\b/.test(routeSrc),
    "doFollow 가중치(40/10) 미탐지",
  );
});

// --- 4. form: UI ---
console.log("\n[4] backlink-form.tsx — UI");

test('"소스 DA" 컬럼 문자열', () => {
  assert(formSrc.includes("소스 DA"), '"소스 DA" 문자열 없음');
});

test('"품질" 문자열', () => {
  assert(formSrc.includes("품질"), '"품질" 문자열 없음');
});

test('"최근 30일" 필터 문자열', () => {
  assert(
    formSrc.includes("최근 30일"),
    '"최근 30일" 문자열 없음 — 필터 토글 UI 확인',
  );
});

test("recharts import 있음", () => {
  assert(/from\s+["']recharts["']/.test(formSrc), "recharts import 없음");
});

test("AreaChart 또는 LineChart import", () => {
  assert(
    /\bAreaChart\b/.test(formSrc) || /\bLineChart\b/.test(formSrc),
    "AreaChart/LineChart 미사용",
  );
});

test('"use client" 유지', () => {
  assert(/["']use client["']/.test(formSrc), '"use client" 지시문이 없음');
});

test("클라이언트 필터 상태 (recentOnly 등)", () => {
  assert(
    /useState/.test(formSrc) && /recentOnly|recentFilter|recent30/i.test(formSrc),
    "최근 30일 필터 상태가 없음",
  );
});

// --- 5. 타입 / strict 체크 (기본 패턴) ---
console.log("\n[5] TypeScript 패턴 — any 금지");

test("route.ts: : any 직접 사용 없음", () => {
  // 주석/코멘트 제외한 : any 직접 어노테이션 금지
  const stripped = routeSrc.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert(!/:\s*any\b/.test(stripped), ": any 타입이 소스에 남아있음");
});

// --- 결과 ---
console.log(`\n${pass} passed / ${fail} failed`);
if (fail > 0) {
  for (const f of failures) console.log(` - ${f.name}: ${f.message}`);
}
process.exit(fail === 0 ? 0 : 1);
