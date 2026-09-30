import type { Metadata } from "next";
import Image from "next/image";
import { Page } from "@/components/layout/Page";
import { EnTete } from "@/components/ui/EnTete";
import { Etiquette } from "@/components/ui/Etiquette";
import { JsonLd } from "@/components/ui/JsonLd";
import { Lignes } from "@/components/ui/Lignes";
import { Acces } from "@/components/home/Acces";
import { Faq } from "@/components/infos/Faq";
import { Question } from "@/components/infos/Question";
import { faq } from "@/data/faq";
import { site } from "@/config/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Horaires, accès et FAQ — Dégradé, barbier à Sète",
  description:
    "Barbier Grand'Rue à Sète, à 15 min de Frontignan et 12 min de Balaruc. Horaires, nocturne du jeudi, parking, paiement et réponses aux questions fréquentes.",
  path: "/infos",
});

const ARIANE = [{ name: "Infos & accès", path: "/infos" }];

export default function InfosPage() {
  return (
    <Page>
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <JsonLd data={faqJsonLd(faq)} />
      <EnTete
        ariane={ARIANE}
        repere="21h"
        titre={["Horaires,", "accès,", <span key="c" className="text-acier">questions.</span>]}
        intro={
          <p>
            Grand&apos;Rue à Sète, du mardi au samedi. Nocturne le jeudi jusqu&apos;à 21 h. On vient de Frontignan, de Balaruc, de Mèze : tout est
            expliqué ici.
          </p>
        }
      />
      <Acces n="01" />
      <figure className="bg-charbon pb-(--spacing-section) text-creme">
        <div className="container-page">
          <div data-reveal="clip-bas">
            <Image
              src="/images/devanture-grand-rue.jpg"
              alt="Devanture noire du barbier Dégradé avec son enseigne et son poteau de barbier, Grand'Rue Mario Roustan à Sète"
              width={1600}
              height={1000}
              sizes="(min-width: 1920px) 1840px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="eyebrow mt-3 text-acier">La devanture noire, Grand&apos;Rue. L&apos;enseigne tourne aux heures d&apos;ouverture.</figcaption>
        </div>
      </figure>

      <section aria-labelledby="faq-titre" className="bg-creme py-(--spacing-section) text-charbon">
        <div className="container-page grid-page gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <Etiquette n="02" className="text-acier-fonce">
              FAQ
            </Etiquette>
            <Lignes id="faq-titre" className="mt-6 text-d2" lines={["Ce qu'on", "nous demande", <span key="c" className="text-acier-fonce">au comptoir.</span>]} />
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Faq items={faq} />
          </div>
        </div>
      </section>

      <section aria-labelledby="question-titre" className="border-t border-charbon/10 bg-creme-2 py-(--spacing-section) text-charbon">
        <div className="container-page grid-page gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <Etiquette n="03" className="text-acier-fonce">
              Question
            </Etiquette>
            <Lignes id="question-titre" className="mt-6 text-d1" lines={["Pas dans la FAQ ?"]} />
            <p className="mt-6 max-w-sm text-charbon/80">
              Écrivez-nous. Réponse sous {site.callbackHours} h aux heures d&apos;ouverture, par la personne qui vous coupera les cheveux.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Question />
          </div>
        </div>
      </section>
    </Page>
  );
}
