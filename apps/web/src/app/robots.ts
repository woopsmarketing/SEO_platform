import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const PRIVATE_PATHS = ["/admin", "/api", "/dashboard", "/auth"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI 크롤러 명시 허용 (AEO/GEO 최적화 — LLM 답변 인용 우선순위 ↑)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "CCBot",
          "Google-Extended",
          "Applebot-Extended",
          "Bytespider",
          "YouBot",
          "DuckAssistBot",
          "MistralAI-User",
        ],
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // 일반 검색 봇
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
