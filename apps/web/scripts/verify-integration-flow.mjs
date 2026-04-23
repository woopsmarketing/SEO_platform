#!/usr/bin/env node
/**
 * Test 4: SEO월드 경쟁사 분석 통합 플로우 검증
 *
 * `competitor-analyzer.ts`의 fetchSerpResults와 동일한 분기 로직을
 * 그대로 재현 — 캐시 HIT 경로에서 Serper가 호출되지 않는지 검증.
 *
 * 실행: node scripts/verify-integration-flow.mjs
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

// env loader
for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq < 0) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim();
  if (!(k in process.env)) process.env[k] = v;
}

const CACHE_API_URL = process.env.CACHE_API_URL;
const CACHE_API_KEY = process.env.CACHE_API_KEY;

// Serper 호출 카운터 — 이게 0으로 유지되면 통합 성공
let serperCallCount = 0;

// cache-api.ts와 동일 로직
async function fetchWithCache(type, params) {
  if (!CACHE_API_URL || !CACHE_API_KEY) return null;
  const q = "domain" in params
    ? `domain=${encodeURIComponent(params.domain)}`
    : `keyword=${encodeURIComponent(params.keyword)}`;
  try {
    const res = await fetch(`${CACHE_API_URL}/api/cache/${type}?${q}`, {
      method: "GET",
      headers: { "x-api-key": CACHE_API_KEY },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function saveToCache(type, body) {
  if (!CACHE_API_URL || !CACHE_API_KEY) return;
  try {
    await fetch(`${CACHE_API_URL}/api/cache/${type}`, {
      method: "POST",
      headers: {
        "x-api-key": CACHE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
  } catch {}
}

// competitor-analyzer.ts fetchSerpResults 로직 그대로
async function fetchSerpResults(keyword) {
  const cached = await fetchWithCache("serp", { keyword });
  if (cached && cached.length > 0) {
    console.log(`   [캐시 HIT] ${cached.length}개 결과 — Serper 우회`);
    return cached.map((item, i) => ({
      title: item.title,
      link: item.url,
      snippet: "",
      position: i + 1,
    }));
  }

  console.log(`   [캐시 MISS] Serper 직접 호출 예정...`);
  serperCallCount++;

  // 실제로는 여기서 Serper API 호출 — 테스트에선 모킹
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) throw new Error("SERPER_API_KEY not set");

  // 실제 Serper는 호출하지 않고, mock 데이터로 흐름만 검증
  const mockResults = [
    { title: `Mock result for "${keyword}"`, link: "https://mock.test/1", snippet: "", position: 1 },
  ];

  await saveToCache("serp", {
    keyword,
    results: mockResults.map((r) => ({ url: r.link, title: r.title })),
  });

  return mockResults;
}

// -------- 테스트 시나리오 --------
console.log("=".repeat(60));
console.log("Test 4: SEO월드 경쟁사 분석 통합 플로우");
console.log("=".repeat(60));

let pass = 0, fail = 0;

// 4.1: "삼성전자" — Test 3에서 캐시 시드됨 → HIT 기대
console.log("\n[4.1] keyword='삼성전자' (Test 3에서 시드됨) — HIT 기대");
serperCallCount = 0;
const r1 = await fetchSerpResults("삼성전자");
const r1Ok = r1.length > 0 && r1[0].link === "https://samsung.com" && serperCallCount === 0;
console.log(`   결과: ${JSON.stringify(r1)}`);
console.log(`   Serper 호출 수: ${serperCallCount}`);
if (r1Ok) { pass++; console.log("   ✅ PASS — 캐시에서 데이터 복원, Serper 호출 0"); }
else { fail++; console.log("   ❌ FAIL"); }

// 4.2: "seoworld-test-marker" — Test 1에서 시드 → HIT 기대
console.log("\n[4.2] keyword='seoworld-test-marker' (Test 1에서 시드됨) — HIT 기대");
serperCallCount = 0;
const r2 = await fetchSerpResults("seoworld-test-marker");
const r2Ok = r2.length > 0 && r2[0].title === "FROM_SEOWORLD" && serperCallCount === 0;
console.log(`   결과: ${JSON.stringify(r2)}`);
console.log(`   Serper 호출 수: ${serperCallCount}`);
if (r2Ok) { pass++; console.log("   ✅ PASS — SEO월드 마커 그대로 복원"); }
else { fail++; console.log("   ❌ FAIL"); }

// 4.3: 유일 신규 키워드 — MISS → 모의 Serper → 캐시 저장 흐름 확인
const uniqueKw = `integration-miss-${Date.now()}`;
console.log(`\n[4.3] keyword='${uniqueKw}' (신규) — MISS → mock Serper → POST 기대`);
serperCallCount = 0;
const r3 = await fetchSerpResults(uniqueKw);
const r3MissOk = r3.length > 0 && serperCallCount === 1;
console.log(`   Serper 호출 수: ${serperCallCount} (1이어야 함)`);

// 4.4: 방금 신규로 저장한 키워드 재조회 → HIT 기대
console.log(`\n[4.4] 같은 keyword 재조회 — 이번엔 HIT 기대 (POST→GET 라운드트립)`);
serperCallCount = 0;
const r4 = await fetchSerpResults(uniqueKw);
const r4Ok = r4.length > 0 && serperCallCount === 0 && r4[0].link === "https://mock.test/1";
console.log(`   결과: ${JSON.stringify(r4)}`);
console.log(`   Serper 호출 수: ${serperCallCount}`);
const roundTripOk = r3MissOk && r4Ok;
if (roundTripOk) { pass++; console.log("   ✅ PASS — MISS→POST→HIT 라운드트립 완성"); }
else { fail++; console.log("   ❌ FAIL"); }

console.log("\n" + "=".repeat(60));
console.log(`Test 4 결과: ${pass} passed, ${fail} failed`);
console.log("=".repeat(60));
process.exit(fail > 0 ? 1 : 0);
