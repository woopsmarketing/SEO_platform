import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

// Parse .env.local
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  env[key] = value;
}

const OPENAI_API_KEY = env.OPENAI_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SLUG = "onpage-seo-optimization-guide";

async function generateImage(prompt) {
  console.log("Generating image...");
  console.log("Prompt:", prompt.slice(0, 80) + "...");

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
  if (b64) {
    return Buffer.from(b64, "base64");
  }
  const url = data.data[0].url;
  if (url) {
    const imgRes = await fetch(url);
    const arrBuf = await imgRes.arrayBuffer();
    return Buffer.from(arrBuf);
  }
  throw new Error("No image data in response");
}

async function ensureBucket() {
  // Check if bucket exists
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/blog-images`, {
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  });

  if (listRes.ok) {
    console.log("Bucket blog-images already exists");
    return;
  }

  // Create bucket
  console.log("Creating bucket blog-images...");
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "blog-images",
      name: "blog-images",
      public: true,
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Bucket creation failed ${createRes.status}: ${errText}`);
  }
  console.log("Bucket created successfully");
}

async function uploadToSupabase(filePath, imageBuffer) {
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${filePath}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "image/png",
      "x-upsert": "true",
    },
    body: imageBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${errText}`);
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${filePath}`;
  return publicUrl;
}

async function main() {
  // Ensure bucket exists
  await ensureBucket();

  const results = {
    coverImage: null,
    sectionImages: [],
  };

  // 1. Cover image
  const coverPrompt = `Professional, modern digital illustration for a blog about on-page SEO optimization. Clean minimal design with blue color palette. Abstract representation of web page elements being optimized - title tags, headings, meta descriptions, internal links visualized as connected nodes. No text, no watermarks. Flat illustration style with subtle gradients.`;

  try {
    const coverBuf = await generateImage(coverPrompt);
    console.log(`Cover image generated: ${coverBuf.length} bytes`);
    const coverUrl = await uploadToSupabase(
      `blog-images/${SLUG}/cover.png`,
      coverBuf
    );
    console.log(`Cover uploaded: ${coverUrl}`);
    results.coverImage = {
      url: coverUrl,
      alt: "온페이지 SEO 최적화 핵심 요소를 시각화한 일러스트 - 타이틀 태그, 헤딩, 메타 디스크립션, 내부 링크가 연결된 노드로 표현됨",
    };
  } catch (err) {
    console.error("Cover image failed:", err.message);
  }

  // 2. Section image: onpage-seo-elements
  const section1Prompt = `Clean minimal icon-style illustration showing 7 core on-page SEO elements - title tag, meta description, heading structure, URL, image alt text, internal links, keyword density. Simple composition with blue accent on light background. Professional tech blog style. No text.`;

  try {
    const sec1Buf = await generateImage(section1Prompt);
    console.log(`Section 1 image generated: ${sec1Buf.length} bytes`);
    const sec1Url = await uploadToSupabase(
      `blog-images/${SLUG}/section-1.png`,
      sec1Buf
    );
    console.log(`Section 1 uploaded: ${sec1Url}`);
    results.sectionImages.push({
      sectionId: "onpage-seo-elements",
      url: sec1Url,
      alt: "온페이지 SEO 핵심 7가지 요소 - 타이틀 태그, 메타 디스크립션, 헤딩 구조, URL, 이미지 alt 텍스트, 내부 링크, 키워드 밀도를 아이콘으로 표현한 일러스트",
      caption: "온페이지 SEO를 구성하는 7가지 핵심 요소",
    });
  } catch (err) {
    console.error("Section 1 image failed:", err.message);
  }

  console.log("\n=== RESULT JSON ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
