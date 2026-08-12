import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// iOS home-screen icon — renders the real uploaded brand mark
// (assets/Logo.png) at request time via Next's built-in image-generation
// API, so it always matches whatever's in that file.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const logoData = readFileSync(join(process.cwd(), "assets", "Logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={180} height={180} style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size }
  );
}
