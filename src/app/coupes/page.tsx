import type { Metadata } from "next";
import { Suspense } from "react";
import { Page } from "@/components/layout/Page";
import { EnTete } from "@/components/ui/EnTete";
import { Etiquette } from "@/components/ui/Etiquette";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lignes } from "@/components/ui/Lignes";
import { Configurateur } from "@/components/coupes/Configurateur";
import { CoupesListe } from "@/components/coupes/CoupesListe";
import { Entretien } from "@/components/coupes/Entretien";
import { Tarifs } from "@/components/home/Tarifs";
import { breadcrumbJsonLd, pageMetadata, servicesJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Coupes homme à Sète : dégradé, taper, barbe",
  description:
    "Fade bas, moyen, skin fade, taper, buzz cut, coupe ciseaux : prix, durée et entretien de chaque coupe. Configurez la vôtre et réservez chez Dégradé à Sète.",
  path: "/coupes",
});

const ARIANE = [{ name: "Les coupes", path: "/coupes" }];

export default function CoupesPage() {
  return (
    <Page>
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <EnTete
        ariane={ARIANE}
        repere="0,5"
        titre={["Les coupes,", <span key="b" className="text-acier">du sabot 0 au peigne.</span>]}
        intro={
          <p>
            Six coupes homme, un dégradé américain pour chaque hauteur de tempe. Prix fixes, durées réelles, et le rythme d&apos;entretien pour que ça
            reste net.
          </p>
        }
      />

      <section id="configurateur" aria-labelledby="conf-titre" className="salon scroll-mt-16 bg-creme py-(--spacing-section) text-charbon">
        <div className="container-page">
          <Etiquette n="01" className="text-acier-fonce">
            Configurateur
          </Etiquette>
          <Lignes id="conf-titre" className="mb-14 mt-6 text-d2" lines={["Composez", <span key="b" className="text-acier-fonce">votre coupe.</span>]} />
          <Suspense fallback={<div className="h-[720px] animate-pulse bg-creme-2" />}>
            <Configurateur />
          </Suspense>
        </div>
      </section>

      <section aria-label="Détail des coupes" className="bg-charbon text-creme">
        <CoupesListe />
      </section>

      <Tarifs n="02" />

      <section id="entretien" aria-labelledby="ent-titre" className="salon scroll-mt-16 border-t border-charbon/10 bg-creme py-(--spacing-section) text-charbon">
        <div className="container-page">
          <Etiquette n="03" className="text-acier-fonce">
            Entretien — offert, sans inscription
          </Etiquette>
          <Lignes id="ent-titre" className="mb-14 mt-6 text-d2" lines={["Quand", <span key="b" className="text-acier-fonce">revenir ?</span>]} />
          <Entretien />
        </div>
      </section>
    </Page>
  );
}
