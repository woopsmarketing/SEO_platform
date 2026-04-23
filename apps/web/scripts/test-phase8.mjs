#!/usr/bin/env node
/**
 * Phase 8 단위 테스트
 *  - data.ts : Tool.badge 필드 + NEW 뱃지 10개+ 확인
 *  - tools/page.tsx : ToolCard badge prop 렌더링 (NEW/HOT)
 *  - smart-service-cta.tsx : ToolResultCta + signal.da / rank / score 분기
 *  - related-tools.tsx : TOOL_MAP 미스 시 fallback 로직
 *  - blog/tool-embed.tsx : 파일 존재 + Link/Button import
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

// 1) data.ts
console.log("\n[1] data.ts - Tool.badge 필드");
const data = tryRead("src/lib/data.ts");
ok("data.ts 존재", data != null && data.length > 0);
if (data) {
  ok("Tool 인터페이스에 badge? 필드 정의", /badge\?\s*:\s*ToolBadge/.test(data) || /badge\?\s*:\s*"NEW"\s*\|\s*"HOT"/.test(data));
  ok("ToolBadge 타입 export", /export\s+type\s+ToolBadge/.test(data));
  const newCount = (data.match(/badge:\s*"NEW"/g) ?? []).length;
  ok(`신규 툴에 badge: "NEW" 10개 이상 부여 (현재 ${newCount}개)`, newCount >= 10);
  const hotCount = (data.match(/badge:\s*"HOT"/g) ?? []).length;
  ok(`주요 툴에 badge: "HOT" 1개 이상 부여 (현재 ${hotCount}개)`, hotCount >= 1);
  // 지정된 신규 툴 14개 중 핵심 6개 확인
  for (const slug of [
    "domain-authority",
    "serp-checker",
    "longtail-keywords",
    "keyword-gap",
    "backlink-gap",
    "competitor-discovery",
  ]) {
    const tag = new RegExp(`href:\\s*"/tools/${slug}"[\\s\\S]{0,250}?badge:\\s*"(NEW|HOT)"`);
    ok(`${slug} 에 badge 존재`, tag.test(data));
  }
  ok("getToolBySlug helper export", /export\s+function\s+getToolBySlug/.test(data));
  ok("getFallbackRelatedTools helper export", /export\s+function\s+getFallbackRelatedTools/.test(data));
}

// 2) tools/page.tsx - ToolCard badge prop
console.log("\n[2] tools/page.tsx - ToolCard badge prop");
const toolsPage = tryRead("src/app/(public)/tools/page.tsx");
ok("tools/page.tsx 존재", toolsPage != null && toolsPage.length > 0);
if (toolsPage) {
  ok("ToolCard props 에 badge 타입", /badge\?\s*:\s*"NEW"\s*\|\s*"HOT"/.test(toolsPage));
  ok("badgeLabel NEW 분기 렌더링", /badgeLabel\s*===?\s*"NEW"/.test(toolsPage));
  ok("badgeLabel HOT 분기 렌더링", /badgeLabel\s*===?\s*"HOT"/.test(toolsPage));
  ok("badge=\"HOT\" 호출부 1개 이상", /badge=\"HOT\"/.test(toolsPage));
  ok("badge=\"NEW\" 호출부 1개 이상", /badge=\"NEW\"/.test(toolsPage));
  const newCalls = (toolsPage.match(/badge="NEW"/g) ?? []).length;
  ok(`신규 툴 호출부 badge="NEW" 8개 이상 (현재 ${newCalls}개)`, newCalls >= 8);
}

// 3) smart-service-cta.tsx
console.log("\n[3] smart-service-cta.tsx - ToolResultCta + 분기");
const cta = tryRead("src/components/smart-service-cta.tsx");
ok("smart-service-cta.tsx 존재", cta != null && cta.length > 0);
if (cta) {
  ok("ToolResultCta export", /export\s+function\s+ToolResultCta/.test(cta));
  ok("ToolCtaSignal interface export", /export\s+interface\s+ToolCtaSignal/.test(cta));
  ok("signal.da 분기 존재", /signal\.da|da\s*<\s*30|da\s*<\s*60/.test(cta));
  ok("signal.rank 분기 존재", /signal\.rank|rank\s*==\s*null|rank\s*>\s*50|rank\s*<=?\s*10/.test(cta));
  ok("signal.score 분기 존재", /signal\.score|score\s*<\s*50|score\s*<\s*80/.test(cta));
  ok("기존 SmartServiceCta 유지 (backward-compat)", /export\s+function\s+SmartServiceCta/.test(cta));
  ok("domain-authority toolName 분기", /toolName\s*===?\s*"domain-authority"/.test(cta));
  ok("serp-checker toolName 분기", /toolName\s*===?\s*"serp-checker"/.test(cta));
  ok("onpage-audit toolName 분기", /toolName\s*===?\s*"onpage-audit"/.test(cta));
}

// 4) related-tools.tsx - fallback
console.log("\n[4] related-tools.tsx - fallback 로직");
const related = tryRead("src/components/related-tools.tsx");
ok("related-tools.tsx 존재", related != null && related.length > 0);
if (related) {
  ok("getFallbackRelatedTools import", /getFallbackRelatedTools/.test(related));
  ok("TOOL_MAP[currentTool] ?? fallback 패턴", /TOOL_MAP\[[^\]]+\]\s*\?\?\s*fallbackFromData/.test(related));
  ok("fallbackFromData helper 정의", /function\s+fallbackFromData/.test(related));
  ok("tools === null/empty 가드 유지", /if\s*\(!tools[^)]*\)\s*return\s+null/.test(related));
}

// 5) blog/tool-embed.tsx
console.log("\n[5] blog/tool-embed.tsx - 신규 컴포넌트");
const embed = tryRead("src/components/blog/tool-embed.tsx");
ok("blog/tool-embed.tsx 존재", embed != null && embed.length > 0);
if (embed) {
  ok("ToolEmbed export", /export\s+function\s+ToolEmbed/.test(embed));
  ok("ToolEmbedProps export", /export\s+interface\s+ToolEmbedProps/.test(embed));
  ok("Link import", /import\s+Link\s+from\s+"next\/link"/.test(embed));
  ok("Button import", /import\s+\{\s*Button\s*\}\s+from\s+"@\/components\/ui\/button"/.test(embed));
  ok("getToolBySlug 사용", /getToolBySlug/.test(embed));
  ok("이 도구 사용하기 버튼 라벨", /이 도구 사용하기/.test(embed));
}

console.log(`\n${passed} passed / ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
