import type { Metadata, Viewport } from "next";
import { Caveat, Figtree } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { hairSalonJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarreMobile } from "@/components/layout/BarreMobile";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { loaderScript } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Revelateur } from "@/components/layout/Revelateur";
import "./globals.css";

// Titres : Fraunces « SOFT » (empattements arrondis), graisse fine et
// tailles optiques 24–144 : 33 Ko au lieu de 120 Ko (voir ASSETS.md)
const titres = localFont({
  src: "../assets/fonts/Fraunces-Soft.woff2",
  weight: "420",
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "serif"],
});

// Texte : Figtree, géométrique et ronde, très lisible en petit
const texte = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

// Notes à la main (répliques, signature) : jamais critique au premier affichage
const main = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Dégradé — Barbier à Sète, fade & barbe", template: "%s — Dégradé, barbier Sète" },
  description: site.description,
  applicationName: site.fullName,
  keywords: [...site.seo.keywords],
  authors: [{ name: "MJAGENCY", url: site.agency.url }],
  creator: "MJAGENCY",
  formatDetection: { telephone: false, email: false, address: false },
  category: "Barbier",
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-FR" className={`${titres.variable} ${texte.variable} ${main.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      </head>
      <body>
        <JsonLd data={hairSalonJsonLd()} />
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
          <BarreMobile />
          <CookieBanner />
          <Revelateur />
        </SmoothScroll>
      </body>
    </html>
  );
}
