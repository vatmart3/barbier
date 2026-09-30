/**
 * Images Open Graph / Twitter générées avec next/og, dans le style du site :
 * fond noir façon page produit, titre Fraunces arrondie, seconde ligne en gris.
 * Polices embarquées depuis src/assets/fonts (OFL).
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/Fraunces-Soft-600.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Figtree-Medium.ttf")),
]);

interface Og {
  eyebrow: string;
  titre: string[];
}

export async function ogImage({ eyebrow, titre }: Og) {
  const [titres, texte] = await fonts;
  const blanc = "#f5f5f7";
  const gris = "#86868b";
  const ambre = "#f5a25d";
  const cuivre = "#b3541e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse 70% 60% at 50% 110%, #2a2a2d 0%, #000000 70%)",
          color: blanc,
          fontFamily: "Figtree",
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: ambre }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 18,
            fontFamily: "Fraunces",
            fontSize: 108,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: -1,
          }}
        >
          {titre.map((l, i) => (
            <div key={l} style={{ color: i > 0 ? gris : blanc }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 48, fontSize: 26 }}>
          <div style={{ display: "flex", background: cuivre, color: "#ffffff", padding: "14px 32px", borderRadius: 999 }}>
            {site.phone.display}
          </div>
          <div style={{ display: "flex", color: gris }}>{`${site.address.street}, ${site.address.city}`}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: titres, weight: 600, style: "normal" },
        { name: "Figtree", data: texte, weight: 500, style: "normal" },
      ],
    },
  );
}
