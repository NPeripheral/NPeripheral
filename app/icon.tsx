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
          background: "#0b0a09",
          color: "#f4efe6",
          border: "1px solid #e2542a",
          fontSize: 20,
          fontWeight: 600,
          fontFamily: "serif",
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
