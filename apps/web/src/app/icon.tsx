import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" />
          <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="white" strokeWidth="1.5" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />
          <line x1="4" y1="7" x2="20" y2="7" stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1="4" y1="17" x2="20" y2="17" stroke="white" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
