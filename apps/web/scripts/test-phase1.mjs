#!/usr/bin/env node
/**
 * Phase 1 단위 테스트 — 정적 검사로 주요 파일 존재 + 코드 패턴을 확인.
 * 사용: node scripts/test-phase1.mjs  (apps/web 디렉토리에서)
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

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function readFile(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `missing file: ${relPath}`);
  return readFileSync(full, "utf8");
}

function assertFile(relPath) {
  assert(existsSync(resolve(root, relPath)), `missing file: ${relPath}`);
}

console.log("== Phase 1 Test ==\n");

// 1. 신규 파일 존재 확인
console.log("[1] 신규 파일 존재 확인");
test("domain-authority page 존재", () =>
  assertFile("src/app/(public)/tools/domain-authority/page.tsx"));
test("domain-authority form 존재", () =>
  assertFile("src/app/(public)/tools/domain-authority/domain-authority-form.tsx"));
test("domain-authority API 존재", () =>
  assertFile("src/app/api/domain-authority/route.ts"));
test("domain-compare page 존재", () =>
  assertFile("src/app/(public)/tools/domain-compare/page.tsx"));
test("domain-compare form 존재", () =>
  assertFile("src/app/(public)/tools/domain-compare/domain-compare-form.tsx"));
test("domain-compare API 존재", () =>
  assertFile("src/app/api/domain-compare/route.ts"));

// 2. 캐시 경유 로직 확인
console.log("\n[2] 캐시 경유 로직 확인 (fetchWithCache('metrics', ...))");

test("domain-authority API가 캐시 metrics 호출", () => {
  const src = readFile("src/app/api/domain-authority/route.ts");
  assert(src.includes('fetchWithCache'), "fetchWithCache import/call missing");
  assert(/fetchWithCache[\s\S]{0,80}["']metrics["']/.test(src),
    "fetchWithCache(\"metrics\", ...) 패턴이 없음");
});

test("domain-compare API가 캐시 metrics 호출 (두 도메인)", () => {
  const src = readFile("src/app/api/domain-compare/route.ts");
  assert(src.includes('fetchWithCache'), "fetchWithCache missing");
  const matches = src.match(/fetchWithCache[\s\S]{0,80}["']metrics["']/g) || [];
  assert(matches.length >= 2,
    `두 도메인 병렬 조회가 필요한데 fetchWithCache("metrics", ...) 호출이 ${matches.length}개`);
  assert(src.includes("Promise.all"), "Promise.all 병렬 호출이 없음");
});

test("backlink-check API가 metrics 캐시 병렬 호출", () => {
  const src = readFile("src/app/api/backlink-check/route.ts");
  assert(src.includes('fetchWithCache'), "fetchWithCache import missing");
  assert(/fetchWithCache[\s\S]{0,80}["']metrics["']/.test(src),
    "fetchWithCache(\"metrics\", ...) 패턴이 없음");
  assert(src.includes("Promise.all"), "VebAPI + 캐시 병렬 호출이 없음");
  assert(/metrics:\s*\w*[mM]etrics\s*\?\?\s*null/.test(src), "응답에 metrics 필드가 없음");
});

test("competitor-analyzer가 각 도메인 metrics 캐시 호출", () => {
  const src = readFile("src/lib/competitor-analyzer.ts");
  assert(/fetchWithCache[\s\S]{0,80}["']metrics["']/.test(src),
    "경쟁사 분석기에 fetchWithCache(\"metrics\", ...) 패턴이 없음");
  assert(src.includes("metrics?: DomainMetrics | null"),
    "OnPageSummary에 metrics 필드가 없음");
});

// 3. DomainMetricsCard import 확인
console.log("\n[3] DomainMetricsCard import 확인");

test("domain-authority form이 DomainMetricsCard 사용", () => {
  const src = readFile("src/app/(public)/tools/domain-authority/domain-authority-form.tsx");
  assert(src.includes("DomainMetricsCard"), "DomainMetricsCard import 없음");
});

test("domain-compare form이 DomainMetricsCard 사용", () => {
  const src = readFile("src/app/(public)/tools/domain-compare/domain-compare-form.tsx");
  assert(src.includes("DomainMetricsCard"), "DomainMetricsCard import 없음");
  assert(src.includes("RadarChart"), "recharts RadarChart 사용 없음");
});

test("backlink-form이 DomainMetricsCard 사용", () => {
  const src = readFile("src/app/(public)/tools/backlink-checker/backlink-form.tsx");
  assert(src.includes("DomainMetricsCard"), "DomainMetricsCard import 없음");
  assert(src.includes("metrics?: DomainMetrics"), "metrics 타입 누락");
});

test("hero-analyzer가 DA/DR/TF 프리뷰 포함", () => {
  const src = readFile("src/components/hero-analyzer.tsx");
  assert(src.includes("/api/domain-authority"), "domain-authority API 호출 누락");
  assert(src.includes("Moz DA") && src.includes("Ahrefs DR") && src.includes("Majestic TF"),
    "미니 카드 3종 DA/DR/TF 라벨 누락");
  assert(src.includes("/tools/domain-authority"), "deep link 누락");
});

// 4. POST 바디 검증 + rate limit 확인
console.log("\n[4] API 라우트 바디 검증 + rate limit 적용");

test("domain-authority API가 rate limit + body 검증", () => {
  const src = readFile("src/app/api/domain-authority/route.ts");
  assert(src.includes("checkRateLimit"), "checkRateLimit 호출 누락");
  assert(src.includes("isAuthenticated"), "isAuthenticated 호출 누락");
  assert(/["']도메인["']|올바른 도메인/.test(src), "도메인 검증 에러 메시지 누락");
  assert(src.includes("status: 400") || src.includes('"status": 400'),
    "400 응답 처리 누락");
  assert(src.includes("status: 429") || src.includes('"status": 429'),
    "429 응답 처리 누락");
});

test("domain-compare API가 rate limit + 양쪽 도메인 검증", () => {
  const src = readFile("src/app/api/domain-compare/route.ts");
  assert(src.includes("checkRateLimit"), "checkRateLimit 호출 누락");
  assert(src.includes("domainA") && src.includes("domainB"),
    "domainA/domainB 검증 누락");
  assert(src.includes("status: 400"), "400 응답 처리 누락");
  assert(src.includes("status: 429"), "429 응답 처리 누락");
});

// 5. GA4 이벤트 트래킹 확인
console.log("\n[5] GA4 이벤트 트래킹 확인");

test("domain-authority form이 trackToolUsage 호출", () => {
  const src = readFile("src/app/(public)/tools/domain-authority/domain-authority-form.tsx");
  assert(src.includes('trackToolUsage("domain-authority")'),
    'trackToolUsage("domain-authority") 누락');
  assert(src.includes('trackToolAttempt("domain-authority")'),
    'trackToolAttempt 누락');
});

test("domain-compare form이 trackToolUsage 호출", () => {
  const src = readFile("src/app/(public)/tools/domain-compare/domain-compare-form.tsx");
  assert(src.includes('trackToolUsage("domain-compare")'),
    'trackToolUsage("domain-compare") 누락');
});

// 결과 요약
console.log("\n== 결과 ==");
console.log(`  통과: ${pass}`);
console.log(`  실패: ${fail}`);
if (fail > 0) {
  console.log("\n[실패 목록]");
  for (const f of failures) console.log(`  - ${f.name}: ${f.message}`);
  process.exit(1);
} else {
  console.log("\n모든 테스트 통과.");
  process.exit(0);
}
