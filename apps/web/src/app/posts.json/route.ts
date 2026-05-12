import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();

  return NextResponse.json(
    {
      site: SITE_NAME,
      url: SITE_URL,
      updated_at: new Date().toISOString(),
      count: posts.length,
      posts: posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        url: `${SITE_URL}/blog/${p.slug}`,
        category: p.category,
        tags: p.tags,
        cover_image_url: p.cover_image_url,
        published_at: p.published_at,
        updated_at: p.updated_at,
        read_time: p.read_time,
        author: p.author,
      })),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
