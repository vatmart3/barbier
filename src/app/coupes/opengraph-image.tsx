import { ogImage } from "@/lib/og";

export const alt = "Les coupes de Dégradé, barbier à Sète : fade, taper, buzz, ciseaux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé — Les coupes", titre: ["Six coupes.", "Aucune au hasard."], repere: "1" });
}
