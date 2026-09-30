import { ogImage } from "@/lib/og";

export const alt = "Réserver chez Dégradé, barbier à Sète";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé — Réserver", titre: ["Prendre place", "en 60 secondes."], repere: "3" });
}
