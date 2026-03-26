import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          borderRadius: "36px",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="white" strokeWidth="1.2" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.2" />
          <line x1="4" y1="7" x2="20" y2="7" stroke="white" strokeWidth="0.8" opacity="0.7" />
          <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="0.8" opacity="0.7" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
