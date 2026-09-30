import type { Metadata, Viewport } from "next";
import { Archivo, Kaushan_Script, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import { hairSalonJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarreMobile } from "@/components/layout/BarreMobile";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Loader, loaderScript } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Revelateur } from "@/components/layout/Revelateur";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const script = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-kaushan",
  // Police d'accent, jamais critique pour le premier affichage
  preload: false,
});

const text = Schibsted_Grotesk({
  subsets: ["latin"],
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
  themeColor: "#0f0d0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-FR" className={`${display.variable} ${script.variable} ${text.variable}`} suppressHydrationWarning>
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
          <Revelateur />
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
