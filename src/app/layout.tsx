import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import { hairSalonJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarreMobile } from "@/components/layout/BarreMobile";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Loader, loaderScript } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const display = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-big-shoulders",
  // Pas de métriques de repli connues pour cette famille : repli explicite
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
});

const text = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-schibsted",
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
  themeColor: "#111111",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-FR" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      </head>
      <body>
        <JsonLd data={hairSalonJsonLd()} />
        <Loader />
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
          <BarreMobile />
          <CookieBanner />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
