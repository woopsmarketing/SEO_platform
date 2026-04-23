#!/usr/bin/env node
/**
 * Phase 7 단위 테스트
 *  - SQL migration 테이블/RLS
 *  - cron/serp-tracking 라우트 (CRON_SECRET + fetchWithCache("serp"))
 *  - broken-backlink-recovery API + 페이지 (VebAPI + Promise.allSettled)
 *  - dashboard 페이지 (auth.getUser + redirect)
 *  - tracked-keywords API (GET/POST/DELETE)
 *  - vercel.json cron 엔트리
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

function tryRead(p) {
  try {
    return readFileSync(join(ROOT, p), "utf-8");
  } catch {
    return null;
  }
}

// 1) SQL 마이그레이션
console.log("\n[1] Supabase 마이그레이션 SQL");
const sql = tryRead("supabase/migrations/20260423_phase7_tracking.sql");
ok("migration 파일 존재", sql != null && sql.length > 0);
if (sql) {
  ok("테이블 tracked_keywords 정의", /create table[^;]*tracked_keywords/i.test(sql));
  ok("테이블 serp_tracking 정의", /create table[^;]*serp_tracking/i.test(sql));
  ok("테이블 broken_backlinks 정의", /create table[^;]*broken_backlinks/i.test(sql));
  ok("tracked_keywords unique (user_id, domain, keyword)", /unique\s*\(\s*user_id\s*,\s*domain\s*,\s*keyword\s*\)/i.test(sql));
  ok("serp_tracking index on (tracked_keyword_id, checked_at desc)", /index[^;]*serp_tracking[^;]*tracked_keyword_id[^;]*checked_at\s+desc/i.test(sql));
  ok("broken_backlinks unique (user_id, source_url, target_url)", /unique\s*\(\s*user_id\s*,\s*source_url\s*,\s*target_url\s*\)/i.test(sql));
  ok("RLS policy auth.uid()", sql.includes("auth.uid()") && /create policy/i.test(sql));
  ok("enable row level security 3곳", (sql.match(/enable row level security/gi) ?? []).length >= 3);
}

// 2) cron/serp-tracking 라우트
console.log("\n[2] cron/serp-tracking 라우트");
const cronSrc = tryRead("src/app/api/cron/serp-tracking/route.ts");
ok("cron route 파일 존재", cronSrc != null && cronSrc.length > 0);
if (cronSrc) {
  ok("runtime nodejs + maxDuration=60", cronSrc.includes('runtime = "nodejs"') && cronSrc.includes("maxDuration = 60"));
  ok("CRON_SECRET 검증 (Bearer/header 혹은 query)", cronSrc.includes("CRON_SECRET") && /Bearer\s*\$\{cronSecret\}|authorization|secret/i.test(cronSrc));
  ok('fetchWithCache("serp" ...) 사용', /fetchWithCache\s*(?:<[^>]*>)?\s*\(\s*["']serp["']/.test(cronSrc));
  ok("admin 클라이언트 사용", cronSrc.includes("createAdminClient"));
  ok("tracked_keywords where is_active", cronSrc.includes('"tracked_keywords"') && cronSrc.includes("is_active"));
  ok("serp_tracking insert", cronSrc.includes('"serp_tracking"') && cronSrc.includes(".insert("));
  ok("배치 사이즈 5", /BATCH_SIZE\s*=\s*5|slice\([^)]+,\s*[^)]*\+\s*5\)/.test(cronSrc));
}

// 3) broken-backlink-recovery
console.log("\n[3] broken-backlink-recovery API + 페이지");
const brokenApi = tryRead("src/app/api/broken-backlink-recovery/route.ts");
ok("API 라우트 존재", brokenApi != null && brokenApi.length > 0);
if (brokenApi) {
  ok("VebAPI backlink 호출", brokenApi.includes("vebapi.com/api/seo/backlinkdata"));
  ok("Promise.allSettled 사용", brokenApi.includes("Promise.allSettled"));
  ok("checkRateLimit 호출", brokenApi.includes("checkRateLimit") && brokenApi.includes("@/lib/rate-limit"));
  ok("404/410 필터", /404|410/.test(brokenApi));
  ok("broken_backlinks upsert", brokenApi.includes("broken_backlinks") && brokenApi.includes("upsert"));
}
const brokenPage = tryRead("src/app/(public)/tools/broken-backlink-recovery/page.tsx");
const brokenForm = tryRead("src/app/(public)/tools/broken-backlink-recovery/broken-backlink-recovery-form.tsx");
ok("page.tsx 존재", brokenPage != null && brokenPage.length > 0);
ok("form 컴포넌트 존재 + export", brokenForm != null && brokenForm.includes("export function BrokenBacklinkRecoveryForm"));
if (brokenForm) {
  ok("trackToolAttempt/Usage/Error", ["trackToolAttempt", "trackToolUsage", "trackToolError", "trackRateLimit"].every((k) => brokenForm.includes(k)));
}

// 4) dashboard
console.log("\n[4] dashboard 페이지");
const dashPage = tryRead("src/app/(public)/dashboard/page.tsx");
ok("dashboard page.tsx 존재", dashPage != null && dashPage.length > 0);
if (dashPage) {
  ok("auth.getUser 호출", dashPage.includes("auth.getUser()"));
  ok('redirect("/login...) 로직', /redirect\(["'`]\/login/.test(dashPage));
  ok("tracked_keywords 조회", dashPage.includes("tracked_keywords"));
  ok("serp_tracking 30일 조회", dashPage.includes("serp_tracking") && dashPage.includes("30"));
  ok("broken_backlinks 카운트", dashPage.includes("broken_backlinks"));
}
const dashPanel = tryRead("src/app/(public)/dashboard/tracked-keywords-panel.tsx");
ok("tracked-keywords-panel (client) 존재", dashPanel != null && dashPanel.includes('"use client"'));
const dashSpark = tryRead("src/app/(public)/dashboard/rank-sparkline.tsx");
ok("rank-sparkline (recharts) 존재", dashSpark != null && dashSpark.includes("recharts") && dashSpark.includes("LineChart"));

// 5) tracked-keywords API
console.log("\n[5] tracked-keywords API");
const kwApi = tryRead("src/app/api/tracked-keywords/route.ts");
ok("tracked-keywords route 파일 존재", kwApi != null && kwApi.length > 0);
if (kwApi) {
  ok("GET export", /export\s+async\s+function\s+GET/.test(kwApi));
  ok("POST export", /export\s+async\s+function\s+POST/.test(kwApi));
  ok("DELETE export", /export\s+async\s+function\s+DELETE/.test(kwApi));
  ok("server client 사용", kwApi.includes("@/lib/supabase/server"));
  ok("auth.getUser 체크", kwApi.includes("auth.getUser()"));
}

// 6) vercel.json
console.log("\n[6] vercel.json cron 엔트리");
const vercelJson = tryRead("vercel.json") || tryRead("../vercel.json") || tryRead("../../vercel.json");
ok("vercel.json 파일 존재", vercelJson != null && vercelJson.length > 0);
if (vercelJson) {
  try {
    const parsed = JSON.parse(vercelJson);
    const crons = Array.isArray(parsed.crons) ? parsed.crons : [];
    const entry = crons.find((c) => c && c.path === "/api/cron/serp-tracking");
    ok("/api/cron/serp-tracking cron 엔트리", !!entry);
    ok("cron schedule 필드 존재", entry && typeof entry.schedule === "string" && entry.schedule.length > 0);
  } catch (err) {
    ok("vercel.json JSON parse", false, err?.message ?? "");
  }
}

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
