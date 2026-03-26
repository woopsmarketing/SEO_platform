import { ImageResponse } from "next/og";

export const alt = "SEO월드 — 무료 SEO 분석 도구";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #0EA5E9 100%)",
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
        {/* 로고 + 브랜드명 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="white" strokeWidth="1.2" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.2" />
              <line x1="4" y1="7" x2="20" y2="7" stroke="white" strokeWidth="0.8" opacity="0.7" />
              <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7" />
            </svg>
          </div>
          <span style={{ fontSize: "52px", fontWeight: 800 }}>SEO월드</span>
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 400,
            opacity: 0.85,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          무료 SEO 분석 도구 | 메타태그 분석 | 온페이지 SEO 진단 | 사이트맵 생성
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            opacity: 0.5,
          }}
        >
          seoworld.co.kr
        </div>
      </div>
    ),
    { ...size }
  );
}
