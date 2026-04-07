import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/db/posts";

export const alt = "SEO월드 블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? "SEO월드 블로그";
  const category = post?.category ?? "";
  const tags = post?.tags?.slice(0, 3) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단: 카테고리 + 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.15)",
                color: "#93c5fd",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            SEO월드
          </div>
        </div>

        {/* 중앙: 제목 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 30 ? "42px" : "48px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.3,
              letterSpacing: "-0.025em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>

          {/* 태그 */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                    fontSize: "16px",
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단: URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "16px",
            }}
          >
            seoworld.co.kr/blog/{slug}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
            }}
          >
            무료 SEO 분석 플랫폼
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
