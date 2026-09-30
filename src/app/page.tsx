import type { Metadata } from "next";
import { Suspense } from "react";
import { Page } from "@/components/layout/Page";
import { Hero } from "@/components/home/Hero";
import { ReservationExpress } from "@/components/home/ReservationExpress";
import { Atouts } from "@/components/home/Atouts";
import { CoupesHorizontal } from "@/components/home/CoupesHorizontal";
import { Barbiers } from "@/components/home/Barbiers";
import { MotDuPatron } from "@/components/home/MotDuPatron";
import { Galerie } from "@/components/home/Galerie";
import { Tarifs } from "@/components/home/Tarifs";
import { Avis } from "@/components/home/Avis";
import { Acces } from "@/components/home/Acces";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dégradé — Barbier à Sète, fade, taper & barbe",
  description:
    "Barbershop à Sète, Grand'Rue : dégradé américain, skin fade, taper, taille de barbe et rasage au coupe-chou. Réservation en ligne en moins d'une minute.",
  path: "/",
});

export default function Accueil() {
  return (
    <Page>
      <Hero />
      <ReservationExpress />
      <Atouts />
      {/* Une frontière Suspense par section : hydratation sélective, en tâches courtes */}
      <CoupesHorizontal />
      <Barbiers />
      <Galerie />
      <Suspense>
        <Avis />
      </Suspense>
      <Suspense>
        <Tarifs />
      </Suspense>
      <MotDuPatron />
      <Suspense>
        <Acces />
      </Suspense>
    </Page>
  );
}
