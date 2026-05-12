import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = (await getPublishedPosts()).slice(0, 50);
  const updated = new Date().toISOString();

  const entries = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const published = new Date(p.published_at).toISOString();
      const modified = new Date(p.updated_at || p.published_at).toISOString();
      return `  <entry>
    <id>${url}</id>
    <link rel="alternate" type="text/html" href="${url}"/>
    <title>${escapeXml(p.title)}</title>
    <summary>${escapeXml(p.excerpt || "")}</summary>
    <published>${published}</published>
    <updated>${modified}</updated>
    <author><name>${escapeXml(p.author || SITE_NAME)}</name></author>
    ${p.category ? `<category term="${escapeXml(p.category)}"/>` : ""}
    ${(p.tags || []).map((t) => `<category term="${escapeXml(t)}"/>`).join("\n    ")}
  </entry>`;
    })
    .join("\n");

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ko">
  <id>${SITE_URL}/</id>
  <link rel="self" href="${SITE_URL}/feed.xml"/>
  <link rel="alternate" href="${SITE_URL}"/>
  <title>${escapeXml(SITE_NAME)} — SEO 블로그</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <updated>${updated}</updated>
${entries}
</feed>`;

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
