import { ogImage } from "@/lib/og";

export const alt = "Dégradé, barbier à Sète : dégradés, taper et barbe au coupe-chou";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Dégradé · Barbier à Sète", titre: ["Dégradé,", "barbier à Sète."] });
}
