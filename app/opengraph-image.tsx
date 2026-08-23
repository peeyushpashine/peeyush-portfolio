import { ImageResponse } from "next/og";
import { person } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${person.name}, ML Engineer`;

export default function OG() {
  // The same signal/noise motif as the site, drawn with plain divs.
  const bars = Array.from({ length: 72 }, (_, i) => ({
    i,
    signal: [4, 9, 22, 37, 41, 58, 69].includes(i),
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafaf8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#545a68", letterSpacing: 1 }}>{person.name}</div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: "#14161a",
              letterSpacing: -1.5,
              lineHeight: 1.1,
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {person.thesis}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-end", height: 90, gap: 6 }}>
            {bars.map((b) => (
              <div
                key={b.i}
                style={{
                  width: 6,
                  height: b.signal ? 78 : 20 + ((b.i * 37) % 22),
                  background: b.signal ? "#0b3d91" : "#c7cad2",
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 24, color: "#545a68" }}>
            Lead ML Engineer at Atlassian · 8 patents · AsML, GIDS
          </div>
        </div>
      </div>
    ),
    size
  );
}
