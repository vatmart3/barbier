import { ogImage } from "@/lib/og";

export const alt = "Horaires, accès et FAQ de Dégradé, barbier à Sète";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé — Infos & accès", titre: ["Grand'Rue,", "côté canal."], repere: "4" });
}
