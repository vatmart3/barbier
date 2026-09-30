import type { Metadata } from "next";
import { mapsUrl, site } from "@/config/site";
import { barbiers } from "@/data/barbiers";
import { coupes, formuleVedette, servicesSimples } from "@/data/prestations";
import type { QuestionFaq } from "@/data/faq";
import { openingHoursSpecification } from "./horaires";

export const abs = (path: string) => new URL(path, site.url).toString();

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** Metadata complète d'une page : canonical, Open Graph, Twitter. */
export function pageMetadata({ title, description, path, noindex }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.fullName,
      url: path,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

const SALON_ID = `${site.url}/#salon`;

export function hairSalonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": SALON_ID,
    name: site.fullName,
    alternateName: `${site.name} Barbershop Sète`,
    description:
      "Barbier et barbershop à Sète : dégradé américain (fade bas, moyen, skin fade), taper, buzz cut, coupe ciseaux, taille de barbe et rasage traditionnel à la serviette chaude et au coupe-chou.",
    url: site.url,
    image: abs("/opengraph-image"),
    logo: abs("/icon.svg"),
    telephone: site.phone.e164,
    email: site.email,
    priceRange: site.priceRange,
    currenciesAccepted: "EUR",
    paymentAccepted: site.payment.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: site.areaServed.map((name) => ({ "@type": name === "Bassin de Thau" ? "Place" : "City", name })),
    employee: barbiers.map((b) => ({ "@type": "Person", name: b.prenom, jobTitle: `Barbier — ${b.specialite}` })),
    knowsAbout: ["Dégradé américain", "Skin fade", "Taper fade", "Taille de barbe", "Rasage traditionnel au coupe-chou"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Prestations barbier",
      itemListElement: [
        ...coupes.map((c) => offer(c.nom, c.description, c.prix, `/coupes#${c.id}`)),
        offer(formuleVedette.nom, formuleVedette.detail, formuleVedette.prix, "/coupes#tarifs"),
        ...servicesSimples.map((s) => offer(s.nom, s.detail, s.prix, "/coupes#tarifs")),
      ],
    },
  };
}

function offer(name: string, description: string, price: number, path: string) {
  return {
    "@type": "Offer",
    price: price.toFixed(2),
    priceCurrency: "EUR",
    url: abs(path),
    itemOffered: { "@type": "Service", name, description },
  };
}

/** Un `Service` + `Offer` par prestation (page Les coupes) */
export function servicesJsonLd() {
  const all = [
    ...coupes.map((c) => ({ name: c.nom, description: `${c.description} ${c.entretien}`, price: c.prix, duree: c.duree, id: c.id, type: "Coupe homme" })),
    { name: formuleVedette.nom, description: formuleVedette.detail, price: formuleVedette.prix, duree: formuleVedette.duree, id: "coupe-barbe", type: "Coupe et barbe" },
    ...servicesSimples.map((s) => ({ name: s.nom, description: s.detail, price: s.prix, duree: s.duree, id: s.id, type: "Barbe" })),
  ];
  return {
    "@context": "https://schema.org",
    "@graph": all.map((s) => ({
      "@type": "Service",
      "@id": abs(`/coupes#${s.id}`),
      name: `${s.name} — barbier à Sète`,
      serviceType: s.type,
      description: s.description,
      provider: { "@id": SALON_ID },
      areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
      offers: {
        "@type": "Offer",
        price: s.price.toFixed(2),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: abs(`/reserver`),
        eligibleDuration: { "@type": "QuantitativeValue", value: s.duree, unitCode: "MIN" },
      },
    })),
  };
}

export function faqJsonLd(items: QuestionFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
