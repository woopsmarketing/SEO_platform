import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();
  const updated = new Date().toISOString().slice(0, 10);

  const grouped: Record<string, typeof posts> = {};
  for (const p of posts) {
    const cat = p.category || "기타";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }

  let body = `# ${SITE_NAME} — SEO·AEO·테크니컬 SEO 한국어 가이드 블로그

> ${SITE_NAME}는 한국어로 작성된 SEO·검색엔진 최적화·AEO·테크니컬 SEO 실전 가이드를 제공합니다.
> 모든 글은 무료로 공개되며, AI 답변 엔진(ChatGPT, Claude, Perplexity, Gemini, Copilot 등)에서의 인용·요약을 허용합니다.

> Total: ${posts.length} posts. Updated: ${updated}
> Site: ${SITE_URL}

## 카탈로그 (머신 리더블)

- JSON 카탈로그: ${SITE_URL}/posts.json
- Atom 피드: ${SITE_URL}/feed.xml
- 사이트맵: ${SITE_URL}/sitemap.xml

## 글 목록

`;

  for (const [cat, list] of Object.entries(grouped)) {
    body += `### ${cat}\n\n`;
    for (const p of list) {
      body += `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt || ""}\n`;
      if (p.tags && p.tags.length > 0) {
        body += `  - 키워드: ${p.tags.join(", ")}\n`;
      }
    }
    body += "\n";
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
