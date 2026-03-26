import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "6px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: "-1px",
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
