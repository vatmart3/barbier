/**
 * Images Open Graph / Twitter générées avec next/og, aux couleurs de la marque.
 * Polices embarquées depuis src/assets/fonts (OFL).
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/BigShoulders-ExtraBold.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/SchibstedGrotesk-Medium.ttf")),
]);

interface Og {
  eyebrow: string;
  titre: string[];
  repere: string;
}

export async function ogImage({ eyebrow, titre, repere }: Og) {
  const [display, text] = await fonts;
  const charbon = "#0F0D0C";
  const creme = "#F2EDE4";
  const acier = "#9AA0A6";
  const rouge = "#B8661A";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: charbon, color: creme, fontFamily: "Schibsted" }}>
        {/* Traces de tondeuse */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ height: 1, background: "rgba(242,237,228,0.06)", width: `${60 + ((i * 37) % 40)}%` }} />
          ))}
        </div>
        {/* Chiffre de sabot géant */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: -60,
            fontFamily: "BigShoulders",
            fontSize: 520,
            lineHeight: 1,
            color: "rgba(242,237,228,0.07)",
            letterSpacing: -10,
          }}
        >
          {repere}
        </div>
        {/* Coup de lame */}
        <div style={{ position: "absolute", left: -100, top: 600, width: 1500, height: 3, background: rouge, transform: "rotate(-17deg)" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, letterSpacing: 4, color: acier, textTransform: "uppercase" }}>
            <div style={{ width: 40, height: 2, background: rouge }} />
            <div>{eyebrow}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "BigShoulders", fontSize: 128, lineHeight: 0.92, textTransform: "uppercase" }}>
            {titre.map((l, i) => (
              <div key={l} style={{ color: i === titre.length - 1 && titre.length > 1 ? acier : creme }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "BigShoulders", fontSize: 44, letterSpacing: 1 }}>DÉGRADÉ</div>
              <div style={{ color: acier }}>{`${site.address.street}, ${site.address.city}`}</div>
            </div>
            <div style={{ display: "flex", background: rouge, color: creme, padding: "12px 20px", fontSize: 22, letterSpacing: 2 }}>{site.phone.display}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "BigShoulders", data: display, weight: 800, style: "normal" },
        { name: "Schibsted", data: text, weight: 500, style: "normal" },
      ],
    },
  );
}
