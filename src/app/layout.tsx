import type { Metadata, Viewport } from "next";
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
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-FR" suppressHydrationWarning>
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
