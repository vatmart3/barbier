import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

const PAGES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/coupes", priority: 0.9, freq: "monthly" },
  { path: "/reserver", priority: 0.9, freq: "daily" },
  { path: "/equipe", priority: 0.7, freq: "monthly" },
  { path: "/infos", priority: 0.8, freq: "monthly" },
  { path: "/mentions-legales", priority: 0.2, freq: "yearly" },
  { path: "/confidentialite", priority: 0.2, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map((p) => ({
    url: abs(p.path),
    lastModified,
    changeFrequency: p.freq,
    priority: p.priority,
    images: p.path === "/" ? [abs("/opengraph-image")] : undefined,
  }));
}
