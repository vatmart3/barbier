import { ogImage } from "@/lib/og";

export const alt = "Confidentialité — Dégradé, barbier à Sète";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé · Confidentialité", titre: ["Vos données,", "en clair."] });
}
