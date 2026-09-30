import type { Metadata } from "next";
import { Suspense } from "react";
import { Page } from "@/components/layout/Page";
import { Hero } from "@/components/home/Hero";
import { ProchainCreneau } from "@/components/home/ProchainCreneau";
import { CoupesHorizontal } from "@/components/home/CoupesHorizontal";
import { Barbiers } from "@/components/home/Barbiers";
import { AvantApres } from "@/components/home/AvantApres";
import { Tarifs } from "@/components/home/Tarifs";
import { Fidelite } from "@/components/home/Fidelite";
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
      <Hero>
        <ProchainCreneau />
      </Hero>
      {/* Une frontière Suspense par section : hydratation sélective, en tâches courtes */}
      <Suspense>
        <CoupesHorizontal />
      </Suspense>
      <Suspense>
        <Barbiers />
      </Suspense>
      <Suspense>
        <AvantApres />
      </Suspense>
      <Suspense>
        <Tarifs />
      </Suspense>
      <Suspense>
        <Fidelite />
      </Suspense>
      <Suspense>
        <Avis />
      </Suspense>
      <Suspense>
        <Acces />
      </Suspense>
    </Page>
  );
}
