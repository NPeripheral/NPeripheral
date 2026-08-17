import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.motto}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card, composed on the same rules as the site: flat ink ground, type
 * held in the left two-thirds, one ember mark in the right third.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0b0a09",
          color: "#f4efe6",
          fontFamily: "serif",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 24,
              letterSpacing: 2,
              color: "rgba(244,239,230,0.62)",
              fontFamily: "sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 12,
                height: 12,
                borderRadius: 12,
                backgroundColor: "#e2542a",
              }}
            />
            NPERIPHERAL — SOCIAL MEDIA MARKETING STUDIO
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 108, lineHeight: 1, letterSpacing: -3 }}>
              Appear to your
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 108,
                lineHeight: 1.05,
                letterSpacing: -3,
                fontStyle: "italic",
                color: "#e2542a",
              }}
            >
              audience.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(244,239,230,0.55)",
              fontFamily: "sans-serif",
            }}
          >
            Strategy · Content · Paid media · Measurement
          </div>
        </div>

        {/* The mark, locked to the right third. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            borderLeft: "1px solid rgba(244,239,230,0.14)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              borderRadius: 200,
              border: "1px solid rgba(244,239,230,0.32)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 96,
                height: 96,
                borderRadius: 96,
                backgroundColor: "#e2542a",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
