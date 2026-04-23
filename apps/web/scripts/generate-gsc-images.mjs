import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const optimizeScript = "/mnt/d/Documents/SEO_platform/.claude/scripts/optimize-image.js";

// Parse .env.local
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const OPENAI_API_KEY = env.OPENAI_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SLUG = "google-search-console-guide";

const TMP_DIR = path.join(__dirname, "..", "tmp-images");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

async function generateImage(prompt) {
  console.log("Generating image...");
  console.log("Prompt:", prompt.slice(0, 100) + "...");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const b64 = data.data[0].b64_json;
  if (b64) return Buffer.from(b64, "base64");
  const url = data.data[0].url;
  if (url) {
    const imgRes = await fetch(url);
    return Buffer.from(await imgRes.arrayBuffer());
  }
  throw new Error("No image data in response");
}

function optimizeImage(inputPath, outputPath, width, quality) {
  const cmd = `node "${optimizeScript}" "${inputPath}" "${outputPath}" --format=webp --width=${width} --quality=${quality}`;
  console.log("Optimizing:", cmd);
  execSync(cmd, { stdio: "inherit" });
}

async function ensureBucket() {
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/blog-images`, {
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  });
  if (listRes.ok) {
    console.log("Bucket blog-images exists");
    return;
  }
  console.log("Creating bucket blog-images...");
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: "blog-images", name: "blog-images", public: true }),
  });
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Bucket creation failed ${createRes.status}: ${errText}`);
  }
  console.log("Bucket created");
}

async function uploadToSupabase(storagePath, localFilePath) {
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${storagePath}`;
  const fileBuffer = fs.readFileSync(localFilePath);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload error ${res.status}: ${errText}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

async function main() {
  await ensureBucket();

  const results = { coverImage: null, sectionImages: [] };

  // --- COVER IMAGE ---
  const coverPrompt = `Isometric 3D illustration on a clean white (#f8fafc) background.
Main scene: a large browser window showing the Google Search Console dashboard with a performance graph trending upward, a magnifying glass hovering over a sitemap tree structure, a verification badge icon with a green checkmark, a bar chart with click-through-rate metrics, and a search query list panel with ranking arrows.
Color palette: #2563eb (primary blue), #10b981 (green accent), #f8fafc (background), soft gray shadows.
Style: modern SaaS product illustration, Figma/Notion-like aesthetic, soft drop shadows, rounded corners.
No text, no watermarks, no human faces.
High detail, professional blog header image.`;

  try {
    const coverBuf = await generateImage(coverPrompt);
    const coverPng = path.join(TMP_DIR, "cover.png");
    const coverWebp = path.join(TMP_DIR, "cover.webp");
    fs.writeFileSync(coverPng, coverBuf);
    console.log(`Cover PNG: ${coverBuf.length} bytes`);

    optimizeImage(coverPng, coverWebp, 1200, 80);

    const coverUrl = await uploadToSupabase(
      `blog-images/${SLUG}/cover.webp`,
      coverWebp
    );
    console.log(`Cover uploaded: ${coverUrl}`);
    results.coverImage = {
      url: coverUrl,
      alt: "구글 서치콘솔 대시보드, 검색 실적 그래프, 사이트맵 구조, 소유권 인증 배지가 표현된 아이소메트릭 일러스트",
    };
  } catch (err) {
    console.error("Cover image failed:", err.message);
  }

  // --- SECTION 1: registration-and-verification ---
  const section1Prompt = `Flat vector icon composition on clean white background.
Elements: a browser address bar with a domain URL, a DNS record card with TXT entry fields, an HTML file icon with a verification code snippet, a Google Search Console logo-style magnifying glass, a green shield badge with a checkmark indicating verified ownership.
Arranged in a balanced flow layout with subtle connecting dotted lines between steps.
Single accent color: #2563eb with light #dbeafe tints.
Style: minimal line art, tech documentation illustration, rounded shapes.
No text labels, no watermarks.`;

  try {
    const sec1Buf = await generateImage(section1Prompt);
    const sec1Png = path.join(TMP_DIR, "section-1.png");
    const sec1Webp = path.join(TMP_DIR, "section-1.webp");
    fs.writeFileSync(sec1Png, sec1Buf);
    console.log(`Section 1 PNG: ${sec1Buf.length} bytes`);

    optimizeImage(sec1Png, sec1Webp, 800, 75);

    const sec1Url = await uploadToSupabase(
      `blog-images/${SLUG}/section-1.webp`,
      sec1Webp
    );
    console.log(`Section 1 uploaded: ${sec1Url}`);
    results.sectionImages.push({
      sectionId: "registration-and-verification",
      url: sec1Url,
      alt: "구글 서치콘솔 등록 과정 - 도메인 입력, DNS TXT 레코드, HTML 파일 인증, 소유권 확인 배지를 단계별로 보여주는 벡터 일러스트",
      caption: "구글 서치콘솔 소유권 확인 방법 — DNS, HTML 파일, 메타태그 등 다양한 인증 방식",
    });
  } catch (err) {
    console.error("Section 1 image failed:", err.message);
  }

  // --- SECTION 2: url-inspection-and-indexing ---
  const section2Prompt = `Flat vector icon composition on clean white background.
Elements: a URL bar with a page icon being inspected under a magnifying glass, a document with a crawl status indicator (green dot), an index database cylinder with an arrow pointing into it, a clock icon representing indexing queue time, a mobile device and desktop monitor showing rendered page preview.
Arranged in a horizontal pipeline flow with arrow connectors between each step.
Single accent color: #2563eb with light #dbeafe tints.
Style: minimal line art, tech documentation illustration, rounded shapes.
No text labels, no watermarks.`;

  try {
    const sec2Buf = await generateImage(section2Prompt);
    const sec2Png = path.join(TMP_DIR, "section-2.png");
    const sec2Webp = path.join(TMP_DIR, "section-2.webp");
    fs.writeFileSync(sec2Png, sec2Buf);
    console.log(`Section 2 PNG: ${sec2Buf.length} bytes`);

    optimizeImage(sec2Png, sec2Webp, 800, 75);

    const sec2Url = await uploadToSupabase(
      `blog-images/${SLUG}/section-2.webp`,
      sec2Webp
    );
    console.log(`Section 2 uploaded: ${sec2Url}`);
    results.sectionImages.push({
      sectionId: "url-inspection-and-indexing",
      url: sec2Url,
      alt: "URL 검사 및 색인 요청 과정 - URL 입력, 크롤링 상태 확인, 색인 데이터베이스 등록, 페이지 렌더링 미리보기를 파이프라인으로 보여주는 벡터 일러스트",
      caption: "URL 검사 도구를 활용한 색인 요청 워크플로우",
    });
  } catch (err) {
    console.error("Section 2 image failed:", err.message);
  }

  // Cleanup tmp
  console.log("\nCleaning up temp files...");
  try {
    fs.rmSync(TMP_DIR, { recursive: true });
  } catch {}

  console.log("\n=== RESULT JSON ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
