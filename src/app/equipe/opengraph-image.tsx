import { ogImage } from "@/lib/og";

export const alt = "Karim, Théo et Lucas, les barbiers de Dégradé à Sète";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé — L'équipe", titre: ["Trois fauteuils.", "Trois barbiers."], repere: "2" });
}
