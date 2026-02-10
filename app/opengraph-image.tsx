import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Docs Cost Calculator — What your documentation costs AI to read";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#16a34a",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ color: "#16a34a", fontSize: 48, fontWeight: 700 }}>
            $
          </span>
          <span style={{ color: "#111827", fontSize: 48, fontWeight: 700 }}>
            docs-cost-calc
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "#4b5563",
            fontSize: 32,
            marginBottom: "48px",
            lineHeight: 1.4,
          }}
        >
          What your API documentation costs AI to read.
        </div>

        {/* Mock format bars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                color: "#111827",
                fontSize: 20,
                width: "140px",
              }}
            >
              YAML
            </span>
            <div
              style={{
                height: "28px",
                width: "30%",
                background: "#16a34a",
                borderRadius: "14px",
              }}
            />
            <span style={{ color: "#16a34a", fontSize: 18 }}>
              Most efficient
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                color: "#111827",
                fontSize: 20,
                width: "140px",
              }}
            >
              JSON
            </span>
            <div
              style={{
                height: "28px",
                width: "65%",
                background: "#dbeafe",
                borderRadius: "14px",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                color: "#111827",
                fontSize: 20,
                width: "140px",
              }}
            >
              JSON Pretty
            </span>
            <div
              style={{
                height: "28px",
                width: "85%",
                background: "rgba(220, 38, 38, 0.25)",
                borderRadius: "14px",
              }}
            />
            <span style={{ color: "#dc2626", fontSize: 18 }}>
              Most expensive
            </span>
          </div>
        </div>

        {/* Author */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            color: "#9ca3af",
            fontSize: 18,
          }}
        >
          by Ed Grzetich — grzeti.ch
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
