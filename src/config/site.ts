/**
 * ============================================================================
 *  CONFIGURATION CLIENT — tout ce qui identifie le salon est ici.
 *  Nom, adresse, téléphone (NAP), horaires, réseaux, SEO.
 *  Les données métier (prestations, barbiers, planning, avis…) sont dans
 *  src/data/. Aucune autre modification n'est nécessaire pour reprendre le site.
 * ============================================================================
 */

export type DayKey = "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";

export interface OpeningSlot {
  /** "HH:MM" heure de Paris */
  open: string;
  close: string;
}

export const site = {
  name: "Dégradé",
  fullName: "Dégradé Barbier",
  legalName: "DÉGRADÉ SARL (à compléter)",
  baseline: "Barbier à Sète. Dégradés, taper, barbe au coupe-chou.",
  description:
    "Barbershop à Sète, Grand'Rue. Karim, Théo et Lucas : dégradés au sabot 0,5, taper, taille de barbe à la serviette chaude et au coupe-chou. Du mardi au samedi, nocturne le jeudi.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://barbier-5cs3.vercel.app",
  locale: "fr_FR",

  // ---- NAP : identique partout (header, footer, JSON-LD, mentions) --------
  address: {
    street: "31 Grand'Rue Mario Roustan",
    postalCode: "34200",
    city: "Sète",
    region: "Occitanie",
    country: "FR",
    /** Repère humain, affiché sous l'adresse */
    landmark: "À deux minutes des Halles, côté canal.",
  },
  geo: { lat: 43.40295, lng: 3.69655 },
  phone: {
    display: "04 67 00 00 42",
    e164: "+33467000042",
  },
  email: "salon@exemple.fr",
  /** Délai de rappel promis (réassurance) */
  callbackHours: 2,
  /** Annulation gratuite jusqu'à X heures avant le rendez-vous */
  freeCancellationHours: 2,
  payment: ["Carte bancaire", "Sans contact", "Espèces"],
  priceRange: "15 € – 45 €",

  // ---- Horaires (heure de Paris). Tableau vide = fermé. -------------------
  hours: {
    lundi: [],
    mardi: [{ open: "09:00", close: "19:00" }],
    mercredi: [{ open: "09:00", close: "19:00" }],
    jeudi: [{ open: "10:00", close: "21:00" }], // nocturne
    vendredi: [{ open: "09:00", close: "19:00" }],
    samedi: [{ open: "08:30", close: "17:00" }],
    dimanche: [],
  } satisfies Record<DayKey, OpeningSlot[]>,
  /** Jours de fermeture exceptionnelle "YYYY-MM-DD" (congés, fériés) */
  closedDates: ["2026-11-11", "2026-12-25", "2027-01-01"] as string[],

  // ---- Accès -------------------------------------------------------------
  access: {
    parking: "Parking des Halles, 150 m (payant, 1re demi-heure offerte).",
    train: "Gare de Sète à 12 min à pied, par le quai de la Résistance.",
    bike: "Arceaux vélo devant la pharmacie, en face.",
    fromAround: [
      { place: "Frontignan", minutes: 15 },
      { place: "Balaruc-les-Bains", minutes: 12 },
      { place: "Mèze", minutes: 22 },
      { place: "Marseillan", minutes: 25 },
    ],
  },

  /** Zones desservies (SEO local + JSON-LD areaServed) */
  areaServed: ["Sète", "Frontignan", "Balaruc-les-Bains", "Balaruc-le-Vieux", "Mèze", "Marseillan", "Bouzigues", "Poussan", "Bassin de Thau"],

  /** Réseaux (à remplacer par les comptes du salon) */
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
  },

  /** Signature agence (footer) */
  agency: {
    label: "Site concept — design & développement MJAGENCY",
    url: "https://mjagency.eu",
  },

  seo: {
    keywords: [
      "barbier Sète",
      "barbershop Sète",
      "coiffeur homme Sète",
      "dégradé américain Sète",
      "taille de barbe Sète",
      "barbier Frontignan",
      "rasage traditionnel Sète",
      "skin fade Sète",
      "barbier Balaruc",
      "barbier Bassin de Thau",
    ],
  },
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name} barbier ${site.address.street} ${site.address.postalCode} ${site.address.city}`,
)}`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;

export const telHref = `tel:${site.phone.e164}`;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

export const nav = [
  { href: "/", label: "Accueil", sabot: "0,5" },
  { href: "/coupes", label: "Les coupes", sabot: "1" },
  { href: "/equipe", label: "L'équipe", sabot: "2" },
  { href: "/infos", label: "Infos & accès", sabot: "3" },
] as const;
