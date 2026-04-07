import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/db/posts";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 블로그 글 DB 기반 자동 생성
  const posts = await getPublishedPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    // 메인
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },

    // 도구
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tools/meta-generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/robots-generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/sitemap-generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/onpage-audit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/backlink-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/domain-checker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/keyword-research`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/keyword-density`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/keyword-related`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

    // 도메인
    { url: `${SITE_URL}/domains`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/domains/auction`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/domains/history`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/domains/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },

    // 서비스
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services/backlinks`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services/traffic`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services/web-design`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services/domain-broker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },

    // 블로그 (자동)
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...blogEntries,
  ];
}
