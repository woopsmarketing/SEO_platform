#!/usr/bin/env node
/**
 * 백링크샵 공용 캐시 API 연동 검증 스크립트
 *
 * 사용: node scripts/verify-cache-api.mjs
 *
 * 테스트 순서:
 *   T1. env 로딩
 *   T2. GET /api/cache/serp — 미존재 키워드 (MISS 기대)
 *   T3. POST /api/cache/serp — 테스트 데이터 저장
 *   T4. GET /api/cache/serp — T3에서 넣은 키워드 (HIT 기대)
 *   T5. GET /api/cache/metrics — 헤더 없이 호출 (401/403 기대, 인증 작동 확인)
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

function loadEnv(path) {
  try {
    const raw = readFileSync(path, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch (err) {
    console.error(`.env.local 로드 실패: ${err.message}`);
  }
}

loadEnv(envPath);

const CACHE_API_URL = process.env.CACHE_API_URL;
const CACHE_API_KEY = process.env.CACHE_API_KEY;

const results = [];
let passed = 0;
let failed = 0;

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  if (ok) passed++;
  else failed++;
  const mark = ok ? "✅ PASS" : "❌ FAIL";
  console.log(`${mark}  ${name}`);
  if (detail) console.log(`        ${detail}`);
}

async function withTimeout(fn, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

// -------------------- T1 --------------------
console.log("\n=== T1: 환경변수 로딩 ===");
if (CACHE_API_URL && CACHE_API_KEY) {
  record(
    "env 로딩",
    true,
    `URL=${CACHE_API_URL}, KEY=${CACHE_API_KEY.slice(0, 6)}…${CACHE_API_KEY.slice(-4)}`,
  );
} else {
  record("env 로딩", false, `CACHE_API_URL=${CACHE_API_URL}, CACHE_API_KEY=${CACHE_API_KEY ? "set" : "missing"}`);
  console.log("\n중단 — 환경변수 없음");
  process.exit(1);
}

// -------------------- T2: MISS 기대 --------------------
console.log("\n=== T2: GET serp (MISS 기대, 신규 키워드) ===");
const testKeyword = `seoworld-verify-${Date.now()}`;

try {
  const url = `${CACHE_API_URL}/api/cache/serp?keyword=${encodeURIComponent(testKeyword)}`;
  const t0 = Date.now();
  const res = await withTimeout((signal) =>
    fetch(url, { method: "GET", headers: { "x-api-key": CACHE_API_KEY }, signal }),
  );
  const elapsed = Date.now() - t0;
  const body = await res.text();

  let json = null;
  try { json = JSON.parse(body); } catch { /* not json */ }

  // 기대: 2xx로 MISS 알림, 또는 404, 또는 API로 fallthrough한 결과
  // 어느 형태든 인증은 통과해야 함 (401/403이면 실패)
  if (res.status === 401 || res.status === 403) {
    record("T2 GET serp 미존재 키워드", false, `인증 실패: ${res.status} — 키 틀림?`);
  } else {
    const summary = json
      ? `status=${res.status}, source=${json.source ?? "?"}, data=${Array.isArray(json.data) ? `array(${json.data.length})` : typeof json.data}, ${elapsed}ms`
      : `status=${res.status}, body(${body.length}b)=${body.slice(0, 120)}`;
    record("T2 GET serp 미존재 키워드", res.status < 500, summary);
  }
} catch (err) {
  record("T2 GET serp 미존재 키워드", false, `예외: ${err.message}`);
}

// -------------------- T3: POST --------------------
console.log("\n=== T3: POST serp (테스트 데이터 저장) ===");
const saveKeyword = `seoworld-verify-save-${Date.now()}`;
const saveBody = {
  keyword: saveKeyword,
  results: [
    { url: "https://example.com/a", title: "Example A" },
    { url: "https://example.com/b", title: "Example B" },
  ],
};

try {
  const url = `${CACHE_API_URL}/api/cache/serp`;
  const t0 = Date.now();
  const res = await withTimeout((signal) =>
    fetch(url, {
      method: "POST",
      headers: { "x-api-key": CACHE_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(saveBody),
      signal,
    }),
  );
  const elapsed = Date.now() - t0;
  const body = await res.text();
  let json = null;
  try { json = JSON.parse(body); } catch {}

  const ok = res.status >= 200 && res.status < 300;
  const summary = json
    ? `status=${res.status}, ${JSON.stringify(json).slice(0, 140)}, ${elapsed}ms`
    : `status=${res.status}, body=${body.slice(0, 140)}`;
  record("T3 POST serp 저장", ok, summary);
} catch (err) {
  record("T3 POST serp 저장", false, `예외: ${err.message}`);
}

// -------------------- T4: HIT 기대 --------------------
console.log("\n=== T4: GET serp (T3 저장 키워드 재조회, HIT 기대) ===");
try {
  const url = `${CACHE_API_URL}/api/cache/serp?keyword=${encodeURIComponent(saveKeyword)}`;
  const t0 = Date.now();
  const res = await withTimeout((signal) =>
    fetch(url, { method: "GET", headers: { "x-api-key": CACHE_API_KEY }, signal }),
  );
  const elapsed = Date.now() - t0;
  const body = await res.text();
  let json = null;
  try { json = JSON.parse(body); } catch {}

  // HIT이면 data 배열이 2개여야 함
  const hitOk =
    res.ok &&
    json &&
    Array.isArray(json.data) &&
    json.data.length === 2 &&
    json.data[0]?.url === "https://example.com/a";

  const summary = json
    ? `status=${res.status}, source=${json.source ?? "?"}, data.length=${Array.isArray(json.data) ? json.data.length : "not-array"}, ${elapsed}ms`
    : `status=${res.status}, body=${body.slice(0, 140)}`;

  record("T4 GET serp 저장 후 재조회 (HIT)", hitOk, summary);
} catch (err) {
  record("T4 GET serp 저장 후 재조회 (HIT)", false, `예외: ${err.message}`);
}

// -------------------- T5: 인증 검증 --------------------
console.log("\n=== T5: 헤더 없이 GET (인증 작동 확인) ===");
try {
  const url = `${CACHE_API_URL}/api/cache/serp?keyword=anything`;
  const res = await withTimeout((signal) =>
    fetch(url, { method: "GET", signal }),
  );
  // 401/403이면 인증이 제대로 작동하는 것
  const ok = res.status === 401 || res.status === 403;
  record("T5 인증 없이 거부", ok, `status=${res.status} (401/403 기대)`);
} catch (err) {
  record("T5 인증 없이 거부", false, `예외: ${err.message}`);
}

// -------------------- 결과 --------------------
console.log("\n" + "=".repeat(60));
console.log(`결과: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60));

if (failed > 0) process.exit(1);
