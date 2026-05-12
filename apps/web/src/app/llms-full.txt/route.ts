import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

const MAX_POSTS = 50;
const MAX_BODY_CHARS = 4000;

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  const posts = (await getPublishedPosts()).slice(0, MAX_POSTS);
  const updated = new Date().toISOString().slice(0, 10);

  let body = `# ${SITE_NAME} — 전체 글 본문 (LLM 학습/인용용)

> Updated: ${updated}
> Site: ${SITE_URL}
> Posts: ${posts.length} (최신 ${MAX_POSTS}개 발췌)
> 각 글은 ${MAX_BODY_CHARS}자까지 발췌됩니다. 전문은 원문 URL 참조.

---

`;

  for (const p of posts) {
    const url = `${SITE_URL}/blog/${p.slug}`;
    const plain = stripHtml(p.content);
    const excerpt = plain.length > MAX_BODY_CHARS ? plain.slice(0, MAX_BODY_CHARS) + "…" : plain;
    body += `## ${p.title}\n\n`;
    body += `- URL: ${url}\n`;
    body += `- 카테고리: ${p.category || "기타"}\n`;
    body += `- 발행일: ${p.published_at?.slice(0, 10) || "-"}\n`;
    body += `- 태그: ${(p.tags || []).join(", ")}\n\n`;
    body += `${excerpt}\n\n---\n\n`;
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
