import { ImageResponse } from "next/og";

export const alt = "SEO월드 — 무료 SEO 분석 도구";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: "60px",
        }}
      >
        {/* 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 800,
            }}
          >
            S
          </div>
          <span style={{ fontSize: "48px", fontWeight: 800 }}>SEO월드</span>
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 500,
            opacity: 0.9,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          무료 SEO 분석 도구 | 메타태그 분석 | 온페이지 SEO 진단
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            opacity: 0.6,
          }}
        >
          seoworld.co.kr
        </div>
      </div>
    ),
    { ...size }
  );
}
