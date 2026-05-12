/**
 * 잔상 있는 글 이미지 GPT 재생성
 *
 * 이전 한글 오버레이가 정상 박힌 흔적 위에 짧은 새 텍스트가 덧씌워져
 * 옆으로 비져나오는 글들의 cover/section 이미지를 GPT로 새로 생성하고
 * 정상 한글 오버레이를 입힌다.
 *
 * 사용법:
 *   node scripts/regen-blog-images.mjs
 *   node scripts/regen-blog-images.mjs --slug=how-to-find-long-tail-keywords  (단일 슬러그)
 *   node scripts/regen-blog-images.mjs --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";
import os from "os";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const PYTHON_SCRIPT = path.join(__dirname, "image_overlay.py");
const OPTIMIZE_SCRIPT = path.join(__dirname, "..", "..", "..", ".claude", "scripts", "optimize-image.js");

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const OPENAI_KEY = env.OPENAI_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const dryRun = args.includes("--dry-run");

/**
 * 잔상 확인된 7개 슬러그의 이미지별 영문 prompt 시나리오.
 * (한글 텍스트는 image_overlay.py 단계에서 추가하므로 GPT prompt는 영문으로만 작성)
 */
const REGEN_PLAN = {
  "competitor-backlink-analysis-guide": {
    cover: `multiple website domain icons connected by arrows showing backlinks flowing between them, a magnifying glass examining the connection network, comparison bar charts showing competitor link profiles, target icons`,
    sections: {
      "section-1.webp": `two browser windows side by side representing competing websites with chain-link icons connecting them, target arrows pointing at each, gear icon for analysis`,
      "section-2.webp": `a Venn diagram visualization of overlapping backlink sources between two domains, with one highlighted gap area marked by a magnifying glass and arrow`,
    },
  },
  "google-search-console-guide": {
    cover: `an analytics dashboard interface mockup with bar charts, line graphs, gauge meters, and metric cards on a browser window, with a search bar at the top, a globe icon, document stack, magnifying glass`,
    sections: {
      "section-1.webp": `a website verification flow with a browser window connecting to a shield icon with check mark, key icon, file upload icon, all linked by arrows`,
      "section-2.webp": `a URL inspection tool concept with a browser window containing a URL bar, arrows pointing to an indexed document with check mark, magnifying glass examining`,
    },
  },
  "how-to-do-keyword-research": {
    cover: `a workflow with multiple floating keyword bubbles being sorted into a funnel, priority ranking with star icons, magnifying glass, search bar, bar chart showing volume`,
    sections: {
      "section-1.webp": `a 6-step process flow with numbered circles (1 through 6) connected by arrows, each step represented by simple icons - magnifying glass, list, chart, filter, target, document`,
    },
  },
  "how-to-find-long-tail-keywords": {
    cover: `a large funnel with many small keyword bubbles entering at top and filtered specific long-tail keyword bubbles exiting at bottom, magnifying glass icon, target icon, growth chart`,
    sections: {
      "section-1.webp": `a tree-branching diagram with one main keyword bubble at center splitting outward into many smaller specific keyword variations, hierarchy structure`,
      "section-2.webp": `a blog post page mockup with highlighted keyword bubbles being placed into title and paragraph areas, content placement workflow with arrows`,
    },
  },
  "how-to-set-meta-tags": {
    cover: `an HTML document mockup with a highlighted head section, surrounded by tag-shaped brackets, gear configuration icons, a small browser preview window above showing rendered metadata`,
    sections: {
      "section-1.webp": `a grid of 5 distinct tag-shaped cards arranged in flower pattern, each tag a different colored card with simple icons (page, document, shield, link, gear), connected by thin lines`,
    },
  },
  "how-to-write-meta-description": {
    cover: `a stylized Google search result snippet card with a highlighted description area glowing with a blue border, a writing pen icon, click cursor icon, growth arrow`,
    sections: {
      "section-1.webp": `two contrasting search result snippet cards side by side, one with a green check mark above and one with a red cross mark above, with comparison scale icon between`,
    },
  },
  "image-seo-optimization-guide": {
    cover: `multiple stacked image file icons with optimization gear icons, a speedometer showing fast performance, magnifying glass examining an image, alt-text-like floating labels (just colored bars, no actual text)`,
    sections: {
      "section-1.webp": `two image file cards side by side connected by an arrow, one with a clear filename label (just a colored bar shape), the other with a confused question mark, showing ROI growth chart`,
      "section-2.webp": `a page loading concept with a speedometer at top showing speed, images loading progressively shown as a stack of cards with progress bars, lazy-loading visualization with arrows pointing down`,
    },
  },
};

const NEGATIVE_PROMPT = `ABSOLUTELY NO TEXT, NO LETTERS, NO NUMBERS, NO WORDS, NO LABELS, NO TYPOGRAPHY anywhere in the image — not on browser windows, not on documents, not on buttons, not on screens, not on cards. Replace any text with colored bar shapes or abstract symbols. No watermarks. No human faces. No signatures.`;

const STYLE_PROMPT = `Isometric 3D illustration on a clean white (#f8fafc) background. Color palette: #2563eb (primary blue), #10b981 (green accent), #f8fafc (background), soft gray shadows. Style: modern SaaS product illustration, Figma/Notion-like aesthetic, soft drop shadows, rounded corners. High detail, professional blog header.`;

function buildCoverPrompt(scene) {
  return `${STYLE_PROMPT}\nMain scene: ${scene}.\n${NEGATIVE_PROMPT}`;
}
function buildSectionPrompt(scene) {
  return `Flat vector icon composition on clean white (#f8fafc) background. Elements: ${scene}. Single accent color: #2563eb with light #dbeafe tints. Style: minimal line art, tech documentation illustration, rounded shapes. ${NEGATIVE_PROMPT}`;
}

async function generateImage(prompt) {
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + OPENAI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "medium",
    }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, "base64");
  if (data.data[0].url) {
    const ir = await fetch(data.data[0].url);
    return Buffer.from(await ir.arrayBuffer());
  }
  throw new Error("no image data");
}

async function fetchPostMeta(slug) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?slug=eq.${slug}&select=title,content`,
    { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } }
  );
  const rows = await r.json();
  return rows[0];
}

function extractH2s(html) {
  const out = [];
  const re = /<h2[^>]*>(.*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html || ""))) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) out.push(text);
  }
  return out;
}

/**
 * HTML 본문에서 각 이미지 파일명에 가장 가까운 "직전 H2"를 매핑.
 * (bulk-fix-blog-images.mjs와 동일 로직 — 일관성 보장)
 */
function extractImageH2Map(html) {
  const map = new Map();
  if (!html) return map;
  let currentH2 = null;
  const tokenRe = /<h2[^>]*>(.*?)<\/h2>|<img[^>]+src=["'][^"']*blog-images\/[^"'/]+\/([^"'/]+)["']/gi;
  let m;
  while ((m = tokenRe.exec(html))) {
    if (m[1] !== undefined) {
      currentH2 = m[1].replace(/<[^>]+>/g, "").trim();
    } else if (m[2] !== undefined) {
      const filename = m[2];
      if (currentH2 && !map.has(filename)) map.set(filename, currentH2);
    }
  }
  return map;
}

async function compressImage(inputPath, outputPath, width) {
  await execFileAsync("node", [
    OPTIMIZE_SCRIPT,
    inputPath,
    outputPath,
    `--format=webp`,
    `--quality=85`,
    `--width=${width}`,
  ]);
}

async function applyOverlay(inputPath, outputPath, text) {
  await execFileAsync("python3", [
    PYTHON_SCRIPT,
    inputPath,
    outputPath,
    text,
    "--font-size=64",
    "--brightness=0.85", // 한 번만 적용되므로 원래 디자인 의도 그대로
    "--color=random",
  ]);
}

async function uploadImage(slug, filename, buf) {
  const url = `${SUPABASE_URL}/storage/v1/object/blog-images/${slug}/${filename}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + SUPABASE_KEY,
      "Content-Type": "image/webp",
      "x-upsert": "true",
      "Cache-Control": "no-cache",
    },
    body: buf,
  });
  if (!r.ok) throw new Error(`upload ${filename} ${r.status} ${await r.text()}`);
}

async function processOne(slug, filename, scene, isCover, text) {
  const prompt = isCover ? buildCoverPrompt(scene) : buildSectionPrompt(scene);
  const targetWidth = isCover ? 1200 : 800;

  console.log(`  ▶ ${filename}`);
  console.log(`    text: "${text.slice(0, 50)}"`);
  console.log(`    prompt: "${scene.slice(0, 70)}..."`);

  if (dryRun) return;

  const ts = Date.now() + Math.random().toString(36).slice(2, 6);
  const rawPath = path.join(os.tmpdir(), `regen-${ts}-raw.png`);
  const compressedPath = path.join(os.tmpdir(), `regen-${ts}-compressed.webp`);
  const finalPath = path.join(os.tmpdir(), `regen-${ts}-final.webp`);

  try {
    const raw = await generateImage(prompt);
    fs.writeFileSync(rawPath, raw);
    console.log(`    GPT 생성: ${(raw.length / 1024) | 0}KB`);

    await compressImage(rawPath, compressedPath, targetWidth);
    const compressed = fs.readFileSync(compressedPath);
    console.log(`    압축: ${(compressed.length / 1024) | 0}KB @ ${targetWidth}px`);

    await applyOverlay(compressedPath, finalPath, text);
    const final = fs.readFileSync(finalPath);
    console.log(`    오버레이: ${(final.length / 1024) | 0}KB`);

    await uploadImage(slug, filename, final);
    console.log(`    ✅ 업로드 완료`);
  } finally {
    for (const p of [rawPath, compressedPath, finalPath]) {
      try { fs.unlinkSync(p); } catch {}
    }
  }
}

async function main() {
  const targets = Object.keys(REGEN_PLAN).filter((s) => !onlySlug || s === onlySlug);
  console.log(`재생성 대상 슬러그: ${targets.length}개${dryRun ? " (DRY RUN)" : ""}\n`);

  let ok = 0, fail = 0;
  for (const slug of targets) {
    const meta = await fetchPostMeta(slug);
    if (!meta) { console.log(`[${slug}] 글 없음 — skip`); continue; }
    const h2s = extractH2s(meta.content);
    const h2Map = extractImageH2Map(meta.content);
    const plan = REGEN_PLAN[slug];

    console.log(`\n[${slug}] ${meta.title}`);

    // Cover
    try {
      await processOne(slug, "cover.webp", plan.cover, true, meta.title);
      ok++;
    } catch (e) { console.log(`    ❌ ${e.message}`); fail++; }

    // Sections — 본문 위치 매칭 우선, fallback으로 H2 순번
    for (const [filename, scene] of Object.entries(plan.sections || {})) {
      let text = h2Map.get(filename);
      if (!text) {
        const sec = filename.match(/^section-(\d+)\./);
        text = sec ? (h2s[parseInt(sec[1], 10) - 1] || meta.title) : (h2s[0] || meta.title);
      }
      try {
        await processOne(slug, filename, scene, false, text);
        ok++;
      } catch (e) { console.log(`    ❌ ${e.message}`); fail++; }
    }
  }

  console.log(`\n=== 완료: ${ok}장 처리 / ${fail}장 실패 ===`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
