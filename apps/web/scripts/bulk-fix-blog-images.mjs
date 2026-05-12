/**
 * 블로그 이미지 일괄 재처리 스크립트
 *
 * 모든 published 글의 cover/section 이미지에 한글 텍스트 오버레이를
 * 정상 폰트로 재적용한다 (기존에 한글 폰트 fallback으로 깨졌던 두부를 덮어씌움).
 *
 * 사용법:
 *   node scripts/bulk-fix-blog-images.mjs
 *   node scripts/bulk-fix-blog-images.mjs --dry-run
 *   node scripts/bulk-fix-blog-images.mjs --slug=structured-data-schema-markup
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

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const slugList = args.find((a) => a.startsWith("--slugs="))?.split("=")[1]?.split(",");
const brightnessOpt = args.find((a) => a.startsWith("--brightness="))?.split("=")[1];
const brightness = brightnessOpt ? parseFloat(brightnessOpt) : 1.0;
const includeDrafts = args.includes("--include-drafts");
const dryRun = args.includes("--dry-run");

async function fetchPosts() {
  const statusFilter = includeDrafts ? "" : "status=eq.published&";
  let url = `${SUPABASE_URL}/rest/v1/posts?${statusFilter}select=slug,title,content,status&order=created_at.desc`;
  if (onlySlug) url += `&slug=eq.${onlySlug}`;
  if (slugList && slugList.length) url += `&slug=in.(${slugList.join(",")})`;
  const r = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
  });
  if (!r.ok) throw new Error(`posts ${r.status}`);
  return r.json();
}

function extractH2s(html) {
  const out = [];
  if (!html) return out;
  const re = /<h2[^>]*>(.*?)<\/h2>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) out.push(text);
  }
  return out;
}

/**
 * HTML 본문에서 각 이미지 파일명에 가장 가까운 "직전 H2"를 매핑.
 * 본문 흐름: H2 → ... → <img src=".../filename"> 인 구조에서 H2 텍스트를 추출.
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

async function listStorageImages(slug) {
  const r = await fetch(SUPABASE_URL + "/storage/v1/object/list/blog-images", {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: slug + "/", limit: 100 }),
  });
  if (!r.ok) return [];
  const list = await r.json();
  return list.filter((i) => i.metadata).map((i) => i.name);
}

async function downloadImage(slug, filename) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/blog-images/${slug}/${filename}?bust=${Date.now()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${filename} ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
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

async function processImage(text, inputPath, outputPath) {
  await execFileAsync("python3", [
    PYTHON_SCRIPT,
    inputPath,
    outputPath,
    text,
    "--font-size=64",
    `--brightness=${brightness}`, // 첫 적용=0.85, 누적 방지=1.0
    "--color=random", // 8색 팔레트 무작위
  ]);
}

function pickText(filename, h2Map, h2s, title) {
  if (filename === "cover.webp" || filename === "cover.png") return title;
  const direct = h2Map.get(filename);
  if (direct) return direct;
  const sec = filename.match(/^section-(\d+)\.(webp|png)$/);
  if (sec) {
    const idx = parseInt(sec[1], 10) - 1;
    if (h2s[idx]) return h2s[idx];
  }
  return h2s[0] || title;
}

async function main() {
  const posts = await fetchPosts();
  console.log(`총 ${posts.length}개 글 대상${dryRun ? " (DRY RUN)" : ""}`);

  let imgOK = 0,
    imgFail = 0,
    skipped = 0;

  for (const post of posts) {
    const { slug, title, content } = post;
    const h2s = extractH2s(content);
    const h2Map = extractImageH2Map(content);
    const images = await listStorageImages(slug);

    if (images.length === 0) {
      console.log(`\n[${slug}] 이미지 없음 — skip`);
      skipped++;
      continue;
    }
    console.log(`\n[${slug}] 제목: ${title.slice(0, 50)}`);
    console.log(`  H2 ${h2s.length}개, 이미지 ${images.length}장`);

    for (const filename of images) {
      const text = pickText(filename, h2Map, h2s, title);
      console.log(`    • ${filename}  ←  "${text.slice(0, 45)}"`);
      if (dryRun) continue;

      const ts = Date.now() + Math.random().toString(36).slice(2, 6);
      const inTmp = path.join(os.tmpdir(), `bulk-${ts}-in`);
      const outTmp = path.join(os.tmpdir(), `bulk-${ts}-out.webp`);
      try {
        const buf = await downloadImage(slug, filename);
        fs.writeFileSync(inTmp, buf);
        await processImage(text, inTmp, outTmp);
        const processed = fs.readFileSync(outTmp);
        await uploadImage(slug, filename, processed);
        imgOK++;
      } catch (err) {
        console.log(`      ❌ ${err.message}`);
        imgFail++;
      } finally {
        try {
          fs.unlinkSync(inTmp);
        } catch {}
        try {
          fs.unlinkSync(outTmp);
        } catch {}
      }
    }
  }

  console.log(
    `\n=== 완료: 처리 ${imgOK}장 / 실패 ${imgFail}장 / 이미지 없는 글 ${skipped}개 ===`
  );
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
