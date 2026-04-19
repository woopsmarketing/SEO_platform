/**
 * 블로그 이미지 텍스트 오버레이 스크립트
 *
 * 각 블로그 포스트의 커버 이미지와 섹션 이미지에:
 * 1. 어두운 그라디언트 오버레이 (이미지 하단 40%)
 * 2. 포스트 제목 / H2 섹션 제목 텍스트 삽입
 *
 * 사용법:
 *   node scripts/add-image-text-overlay.mjs
 *   node scripts/add-image-text-overlay.mjs --slug=where-to-put-keywords-in-blog
 *   node scripts/add-image-text-overlay.mjs --dry-run
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

// .env.local 파싱
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// CLI args
const args = process.argv.slice(2);
const targetSlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
const isDryRun = args.includes("--dry-run");

if (isDryRun) console.log("🔍 DRY RUN 모드 — 실제 업로드 안 함\n");

// Supabase에서 블로그 포스트 목록 조회
async function fetchPosts() {
  let url = `${SUPABASE_URL}/rest/v1/posts?status=eq.published&select=slug,title,content,cover_image_url`;
  if (targetSlug) url += `&slug=eq.${targetSlug}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Posts fetch failed: ${res.status}`);
  return res.json();
}

// HTML에서 H2 텍스트 추출
function extractH2s(htmlContent) {
  const h2s = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) h2s.push(text);
  }
  return h2s.slice(0, 3); // 최대 3개
}

// Supabase Storage에서 이미지 다운로드
async function downloadImage(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Image download failed: ${imageUrl} (${res.status})`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// SVG 텍스트 오버레이 생성
function createTextOverlaySvg(width, height, text, position = "bottom") {
  const fontSize = Math.max(24, Math.min(42, Math.floor(width / 18)));
  const lineHeight = fontSize * 1.4;
  const padding = 24;

  // 텍스트 줄바꿈 (최대 30자)
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > 28) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());

  const textBlockHeight = lines.length * lineHeight + padding * 2;
  const overlayHeight = Math.max(textBlockHeight + 40, height * 0.38);

  const y = position === "bottom" ? height - overlayHeight : 0;

  const textLines = lines
    .map(
      (line, i) =>
        `<text
          x="${padding}"
          y="${textBlockHeight - padding - (lines.length - 1 - i) * lineHeight}"
          font-size="${fontSize}"
          font-weight="bold"
          font-family="Arial, sans-serif"
          fill="white"
          filter="url(#shadow)"
        >${escapeXml(line)}</text>`
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="60%" stop-color="black" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.80"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="130%">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="black" flood-opacity="0.8"/>
    </filter>
  </defs>
  <!-- 그라디언트 오버레이 -->
  <rect x="0" y="${y}" width="${width}" height="${overlayHeight}" fill="url(#grad)"/>
  <!-- 텍스트 -->
  <g transform="translate(0, ${y + overlayHeight - textBlockHeight})">
    ${textLines}
  </g>
</svg>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Sharp로 이미지 합성 (동적 import — 없으면 skip)
async function compositeImage(imageBuffer, svgOverlay) {
  try {
    const { default: sharp } = await import("sharp");
    const svgBuf = Buffer.from(svgOverlay);

    const result = await sharp(imageBuffer)
      .modulate({ brightness: 0.88 }) // 밝기 12% 낮춤
      .composite([{ input: svgBuf, blend: "over" }])
      .webp({ quality: 85 })
      .toBuffer();

    return result;
  } catch {
    // Sharp 없으면 원본 반환 (dry-run 확인용)
    console.warn("  ⚠️  Sharp 없음 — 원본 이미지 유지");
    return imageBuffer;
  }
}

// Supabase에 업로드
async function uploadToSupabase(filePath, buffer, contentType = "image/webp") {
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${filePath}`;
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed ${res.status}: ${err}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;
}

// 이미지 URL에서 storage path 추출
function extractStoragePath(url) {
  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
  return match ? match[1] : null;
}

async function processPost(post) {
  const { slug, title, content, cover_image_url } = post;
  const h2s = extractH2s(content || "");

  console.log(`\n📄 ${slug}`);
  console.log(`   제목: ${title}`);
  console.log(`   H2: ${h2s.join(" / ") || "(없음)"}`);

  // 커버 이미지 처리
  if (cover_image_url) {
    try {
      console.log(`   커버 이미지 처리 중...`);
      const imgBuf = await downloadImage(cover_image_url);

      // 이미지 크기 추정 (WebP/PNG 헤더 파싱 간략)
      const width = 1024;
      const height = 1024;

      const svg = createTextOverlaySvg(width, height, title, "bottom");
      const processed = await compositeImage(imgBuf, svg);

      if (!isDryRun) {
        const storagePath = extractStoragePath(cover_image_url);
        if (storagePath) {
          const newPath = storagePath.replace(/\.(png|jpg|jpeg)$/, ".webp");
          const newUrl = await uploadToSupabase(newPath, processed);
          console.log(`   ✅ 커버 업로드: ${newUrl}`);
        }
      } else {
        console.log(`   🔍 DRY RUN: 커버 이미지 처리됨 (${processed.length} bytes)`);
      }
    } catch (err) {
      console.error(`   ❌ 커버 실패: ${err.message}`);
    }
  }

  // 섹션 이미지 처리 (H2별)
  for (let i = 0; i < h2s.length; i++) {
    const h2Text = h2s[i];
    const sectionUrl = cover_image_url?.replace(/cover\.(png|jpg|webp)/, `section-${i + 1}.webp`)
      || cover_image_url?.replace(/cover\.(png|jpg|webp)/, `section-${i + 1}.png`);

    // Supabase에 섹션 이미지가 있는지 확인
    const checkUrl = `${SUPABASE_URL}/storage/v1/object/public/blog-images/${slug}/section-${i + 1}.webp`;
    try {
      const checkRes = await fetch(checkUrl, { method: "HEAD" });
      if (!checkRes.ok) {
        console.log(`   섹션 ${i + 1} 이미지 없음 — skip`);
        continue;
      }

      console.log(`   섹션 ${i + 1} 처리 중: "${h2Text}"`);
      const imgBuf = await downloadImage(checkUrl);
      const svg = createTextOverlaySvg(1024, 1024, h2Text, "bottom");
      const processed = await compositeImage(imgBuf, svg);

      if (!isDryRun) {
        const newUrl = await uploadToSupabase(
          `blog-images/${slug}/section-${i + 1}.webp`,
          processed
        );
        console.log(`   ✅ 섹션 ${i + 1} 업로드: ${newUrl}`);
      } else {
        console.log(`   🔍 DRY RUN: 섹션 ${i + 1} 처리됨 (${processed.length} bytes)`);
      }
    } catch (err) {
      console.error(`   ❌ 섹션 ${i + 1} 실패: ${err.message}`);
    }
  }
}

async function main() {
  console.log("🖼️  블로그 이미지 텍스트 오버레이 작업 시작\n");

  const posts = await fetchPosts();
  console.log(`총 ${posts.length}개 포스트 대상`);

  for (const post of posts) {
    await processPost(post);
  }

  console.log("\n✅ 완료");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
