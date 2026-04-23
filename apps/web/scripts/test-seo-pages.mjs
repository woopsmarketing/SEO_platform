#!/usr/bin/env node
/**
 * SEO 페이지 정적 검증 테스트 — 19개 툴 페이지의 필수 SEO 요소 존재 확인.
 * 사용: node scripts/test-seo-pages.mjs  (apps/web 디렉토리에서)
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const TOOLS = [
  // 신규 15종
  "serp-checker",
  "local-serp",
  "people-also-ask",
  "serp-difficulty",
  "my-top-keywords",
  "snippet-optimizer",
  "content-gap",
  "keyword-gap",
  "backlink-gap",
  "common-backlinks",
  "competitor-discovery",
  "broken-backlink-recovery",
  "domain-authority",
  "domain-compare",
  "longtail-keywords",
  // 업그레이드 4종
  "backlink-checker",
  "onpage-audit",
  "keyword-research",
  "keyword-density",
];

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

function readPage(slug) {
  const p = resolve(root, `src/app/(public)/tools/${slug}/page.tsx`);
  assert(existsSync(p), `missing: src/app/(public)/tools/${slug}/page.tsx`);
  return readFileSync(p, "utf8");
}

console.log("== SEO 페이지 정적 검증 ==\n");

console.log("[1] 페이지 파일 존재 확인");
for (const slug of TOOLS) {
  test(`${slug}/page.tsx 존재`, () => {
    assert(
      existsSync(resolve(root, `src/app/(public)/tools/${slug}/page.tsx`)),
      `file missing`,
    );
  });
}

console.log("\n[2] Metadata 필수 필드 검증");
for (const slug of TOOLS) {
  test(`${slug} metadata: title + description + canonical`, () => {
    const src = readPage(slug);
    assert(/export const metadata:\s*Metadata/.test(src), "metadata export 누락");
    assert(/title:\s*["'`]/.test(src), "title 누락");
    assert(/description:/.test(src), "description 누락");
    assert(/canonical:\s*["'`]\/tools\//.test(src), "canonical URL 누락");
    assert(/openGraph:/.test(src), "openGraph 누락");
  });
}

console.log("\n[3] JSON-LD 스키마 존재 (WebApplication + FAQPage + HowTo 권장)");
for (const slug of TOOLS) {
  test(`${slug}: JSON-LD script ≥ 3개, FAQPage + HowTo 포함`, () => {
    const src = readPage(slug);
    const scripts = src.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify/g) || [];
    assert(scripts.length >= 3, `JSON-LD script 태그가 ${scripts.length}개 (3개 이상 필요)`);
    assert(/"FAQPage"/.test(src), "FAQPage 스키마 누락");
    assert(/"HowTo"/.test(src), "HowTo 스키마 누락");
    assert(/"@context":\s*"https:\/\/schema\.org"/.test(src), "schema.org context 누락");
  });
}

console.log("\n[4] 시맨틱 구조 (H1 + H2 ≥ 5)");
for (const slug of TOOLS) {
  test(`${slug}: H1 1개 + H2 5개 이상`, () => {
    const src = readPage(slug);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const h2Count = (src.match(/<h2\b/g) || []).length;
    assert(h1Count === 1, `H1이 ${h1Count}개 (1개 필요)`);
    assert(h2Count >= 5, `H2가 ${h2Count}개 (5개 이상 필요)`);
  });
}

console.log("\n[5] 관련 툴 블록 + 하단 CTA");
for (const slug of TOOLS) {
  test(`${slug}: <RelatedTools /> + /contact 링크 포함`, () => {
    const src = readPage(slug);
    assert(
      /<RelatedTools\s+currentTool=/.test(src),
      "<RelatedTools currentTool=...> 누락",
    );
    assert(
      new RegExp(`currentTool=\\s*["']${slug}["']`).test(src),
      `currentTool이 현재 slug(${slug})과 일치하지 않음`,
    );
    assert(/\/contact/.test(src), "/contact 링크 누락");
  });
}

console.log("\n[6] 서버 컴포넌트 + 타입 안전");
for (const slug of TOOLS) {
  test(`${slug}: "use client" 미사용 + next Metadata import`, () => {
    const src = readPage(slug);
    assert(!/^["']use client["']/m.test(src), "'use client' 사용됨 (서버 컴포넌트여야 함)");
    assert(/import type \{ Metadata \} from ["']next["']/.test(src), "Metadata 타입 import 누락");
  });
}

console.log("\n[7] 기존 Form 컴포넌트 import 보존");
const FORM_IMPORTS = {
  "serp-checker": "SerpCheckerForm",
  "local-serp": "LocalSerpForm",
  "people-also-ask": "PaaForm",
  "serp-difficulty": "SerpDifficultyForm",
  "my-top-keywords": "MyTopKeywordsForm",
  "snippet-optimizer": "SnippetForm",
  "content-gap": "ContentGapForm",
  "keyword-gap": "KeywordGapForm",
  "backlink-gap": "BacklinkGapForm",
  "common-backlinks": "CommonBacklinksForm",
  "competitor-discovery": "CompetitorDiscoveryForm",
  "broken-backlink-recovery": "BrokenBacklinkRecoveryForm",
  "domain-authority": "DomainAuthorityForm",
  "domain-compare": "DomainCompareForm",
  "longtail-keywords": "LongtailForm",
  "backlink-checker": "BacklinkForm",
  "onpage-audit": "AuditForm",
  "keyword-research": "KeywordForm",
  "keyword-density": "KeywordDensityForm",
};
for (const [slug, formName] of Object.entries(FORM_IMPORTS)) {
  test(`${slug}: ${formName} import 존재`, () => {
    const src = readPage(slug);
    assert(
      new RegExp(`import\\s*\\{[^}]*${formName}[^}]*\\}`).test(src),
      `${formName} import가 없음`,
    );
  });
}

console.log("\n[8] /tools 페이지 신규 툴 카드 등록 확인");
const toolsPage = readFileSync(
  resolve(root, "src/app/(public)/tools/page.tsx"),
  "utf8",
);
for (const slug of TOOLS) {
  test(`/tools 페이지에 /tools/${slug} 링크 등록`, () => {
    assert(
      new RegExp(`href=["']/tools/${slug}["']`).test(toolsPage),
      `/tools/${slug} 링크 없음`,
    );
  });
}

// 결과 요약
console.log("\n== 결과 ==");
console.log(`  총 테스트: ${pass + fail}`);
console.log(`  통과: ${pass}`);
console.log(`  실패: ${fail}`);
if (fail > 0) {
  console.log("\n[실패 목록]");
  for (const f of failures) {
    console.log(`  - ${f.name}`);
    console.log(`    ${f.message}`);
  }
  process.exit(1);
} else {
  console.log("\n모든 SEO 테스트 통과.");
  process.exit(0);
}
