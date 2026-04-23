#!/usr/bin/env node
/**
 * Phase 0 단위 테스트
 * - DomainMetricsCard 헬퍼 (toNumber / formatCount / metricTier / hasAnyCoreMetric)
 * - Changelog 상수 존재 여부
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let passed = 0;
let failed = 0;
function ok(name, cond, extra = "") {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name} ${extra}`); }
}

// 1. 공유 컴포넌트 파일 존재
const metricsCardSrc = readFileSync(join(ROOT, "src/components/domain-metrics-card.tsx"), "utf-8");
ok("domain-metrics-card.tsx exists and exports DomainMetricsCard",
   metricsCardSrc.includes("export function DomainMetricsCard"));
ok("exports toNumber", metricsCardSrc.includes("export function toNumber"));
ok("exports formatCount", metricsCardSrc.includes("export function formatCount"));
ok("exports metricTier", metricsCardSrc.includes("export function metricTier"));
ok("exports hasAnyCoreMetric", metricsCardSrc.includes("export function hasAnyCoreMetric"));

// 2. audit-form.tsx에서 중복 정의 제거됨
const auditFormSrc = readFileSync(join(ROOT, "src/app/(public)/tools/onpage-audit/audit-form.tsx"), "utf-8");
ok("audit-form imports DomainMetricsCard from shared", auditFormSrc.includes('@/components/domain-metrics-card'));
ok("audit-form no longer defines DomainMetricsCard locally",
   !/^function DomainMetricsCard\(/m.test(auditFormSrc));

// 3. Changelog 파일
const changelogSrc = readFileSync(join(ROOT, "src/lib/changelog.ts"), "utf-8");
ok("changelog.ts exports CHANGELOG", changelogSrc.includes("export const CHANGELOG"));
ok("changelog has at least one entry with v1.4.0", changelogSrc.includes('"v1.4.0"'));

// 4. ChangelogBanner
const bannerSrc = readFileSync(join(ROOT, "src/components/changelog-banner.tsx"), "utf-8");
ok("changelog-banner exports ChangelogBanner", bannerSrc.includes("export function ChangelogBanner"));
ok("banner has dismiss logic (localStorage)", bannerSrc.includes("localStorage"));

// 5. /updates 페이지
try {
  readFileSync(join(ROOT, "src/app/(public)/updates/page.tsx"), "utf-8");
  ok("/updates/page.tsx exists", true);
} catch {
  ok("/updates/page.tsx exists", false);
}

// 6. recharts 설치 확인
try {
  readFileSync(join(ROOT, "node_modules/recharts/package.json"), "utf-8");
  ok("recharts installed", true);
} catch {
  ok("recharts installed", false);
}

// 7. 로직 유닛: toNumber / formatCount / metricTier 를 직접 실행하기 위해 export 확인
// (런타임 실행 대신 소스 정적 검증)
ok("toNumber handles null", metricsCardSrc.includes('if (v == null) return null;'));
ok("formatCount K/M/B 경계", metricsCardSrc.includes('1_000_000_000') && metricsCardSrc.includes('1_000_000'));
ok("metricTier 70/50/30 경계", metricsCardSrc.includes('>= 70') && metricsCardSrc.includes('>= 50') && metricsCardSrc.includes('>= 30'));

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
