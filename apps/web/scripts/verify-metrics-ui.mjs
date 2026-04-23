#!/usr/bin/env node
/**
 * Metrics 통합 검증:
 * 1) cache API가 DomainMetrics 스키마에 맞는 응답을 주는지
 * 2) audit-form.tsx의 DomainMetricsCard 파생 값 계산이 맞는지 시뮬레이션
 *
 * 실행: node scripts/verify-metrics-ui.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf-8").split(/\r?\n/)) {
  const t = line.trim(); if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("="); if (eq < 0) continue;
  if (!(t.slice(0, eq).trim() in process.env))
    process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}

// audit-form.tsx의 helper 복제
function toNumber(v) { if (v == null) return null; const n = typeof v === "string" ? parseFloat(v) : v; return Number.isFinite(n) ? n : null; }
function formatCount(v) { const n = toNumber(v); if (n == null) return "-"; if (n >= 1e9) return `${(n/1e9).toFixed(1)}B`; if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`; return Math.round(n).toLocaleString("ko-KR"); }
function metricTier(n) { if (n == null) return "-"; if (n >= 70) return "최상위"; if (n >= 50) return "상위"; if (n >= 30) return "평균"; return "낮음"; }

async function fetchMetrics(domain) {
  const url = `${process.env.CACHE_API_URL}/api/cache/metrics?domain=${encodeURIComponent(domain)}`;
  const res = await fetch(url, { headers: { "x-api-key": process.env.CACHE_API_KEY } });
  const json = await res.json();
  return json.data;
}

function renderPreview(domain, m) {
  const da = toNumber(m.mozDA);
  const dr = toNumber(m.ahrefsDR);
  const tf = toNumber(m.majesticTF);

  console.log(`\n[${domain}]`);
  console.log(`  ┌────────────────┬────────────────┬────────────────┐`);
  console.log(`  │ Moz DA ${String(da ?? "-").padEnd(7)} │ Ahrefs DR ${String(dr ?? "-").padEnd(4)} │ Majestic TF ${String(tf ?? "-").padEnd(3)}│`);
  console.log(`  │   (${metricTier(da)})${" ".repeat(Math.max(0, 8 - metricTier(da).length))} │   (${metricTier(dr)})${" ".repeat(Math.max(0, 8 - metricTier(dr).length))} │   (${metricTier(tf)})${" ".repeat(Math.max(0, 8 - metricTier(tf).length))} │`);
  console.log(`  └────────────────┴────────────────┴────────────────┘`);
  console.log(`    참조 도메인:         ${formatCount(m.ahrefsRefDomains)}`);
  console.log(`    예상 월간 트래픽:    ${formatCount(m.ahrefsTraffic)}`);
  console.log(`    유기 키워드:         ${formatCount(m.ahrefsOrganicKeywords)}`);
  console.log(`    총 백링크:           ${formatCount(m.ahrefsBacklinks)}`);

  // 스키마 확인
  const requiredForCard = ["mozDA", "ahrefsDR", "majesticTF"];
  const missing = requiredForCard.filter((k) => m[k] == null);
  if (missing.length === 0) {
    console.log(`  ✅ 3대 지표 모두 있음 — 카드 정상 렌더`);
  } else {
    console.log(`  ⚠️  ${missing.join(", ")} 누락 — 해당 칸은 '-'로 표시됨`);
  }
}

const domains = ["naver.com", "seoworld.co.kr", "daum.net"];
console.log("=".repeat(60));
console.log("Metrics 통합 UI 렌더링 시뮬레이션");
console.log("=".repeat(60));

for (const d of domains) {
  try {
    const m = await fetchMetrics(d);
    if (!m || Object.keys(m).length === 0) {
      console.log(`\n[${d}] ❌ 빈 데이터 — UI에서 카드 숨김`);
      continue;
    }
    renderPreview(d, m);
  } catch (err) {
    console.log(`\n[${d}] ❌ ${err.message}`);
  }
}
