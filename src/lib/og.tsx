/**
 * Images Open Graph / Twitter générées avec next/og, dans le style du site :
 * photo du salon assombrie en fond, titre Fraunces arrondie, seconde ligne en or.
 * Polices embarquées depuis src/assets/fonts (OFL).
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/Fraunces-Soft.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Figtree-Medium.ttf")),
]);
// Photo du salon en fond (recadrée sur les fauteuils)
const photo = readFile(join(process.cwd(), "public/images/salon-hero.jpg")).then((b) => `data:image/jpeg;base64,${b.toString("base64")}`);

interface Og {
  eyebrow: string;
  titre: string[];
}

export async function ogImage({ eyebrow, titre }: Og) {
  const [[titres, texte], fond] = await Promise.all([fonts, photo]);
  const blanc = "#f5f5f7";
  const gris = "#d8d2c8";
  const ambre = "#d6b47d";
  const cuivre = "#c9a064";

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
          position: "relative",
          background: "#111513",
          color: blanc,
          fontFamily: "Figtree",
          fontWeight: 500,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fond} alt="" width={1200} height={1500} style={{ position: "absolute", left: 0, top: -560, width: 1200, height: 1500 }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex", background: "linear-gradient(180deg, rgba(12,16,14,0.78) 0%, rgba(12,16,14,0.72) 55%, rgba(12,16,14,0.88) 100%)" }} />
        <div style={{ display: "flex", fontSize: 30, color: ambre }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 18,
            fontFamily: "Fraunces",
            fontSize: 108,
            fontWeight: 400,
            lineHeight: 1.04,
            letterSpacing: -1,
          }}
        >
          {titre.map((l, i) => (
            <div key={l} style={{ color: i > 0 ? ambre : blanc }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 48, fontSize: 26 }}>
          <div style={{ display: "flex", background: cuivre, color: "#1a140c", padding: "14px 32px", borderRadius: 999 }}>
            {site.phone.display}
          </div>
          <div style={{ display: "flex", color: gris }}>{`${site.address.street}, ${site.address.city}`}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: titres, weight: 400, style: "normal" },
        { name: "Figtree", data: texte, weight: 500, style: "normal" },
      ],
    },
  );
}
