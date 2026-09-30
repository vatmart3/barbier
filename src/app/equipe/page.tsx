import type { Metadata } from "next";
import { Page } from "@/components/layout/Page";
import { EnTete } from "@/components/ui/EnTete";
import { JsonLd } from "@/components/ui/JsonLd";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { IllustrationSalon } from "@/components/illustrations/IllustrationSalon";
import { EquipeHorizontal } from "@/components/equipe/EquipeHorizontal";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Les barbiers de Dégradé — barbershop à Sète",
  description:
    "Karim, Théo et Lucas : spécialités, style et disponibilités de la semaine. Skin fade, taper, coupes ciseaux, barbe au coupe-chou, Grand'Rue à Sète.",
  path: "/equipe",
});

const ARIANE = [{ name: "L'équipe", path: "/equipe" }];

const REGLES = [
  { n: "01", t: "Lame neuve", r: "Une lame de coupe-chou par client. Elle part à la poubelle devant vous." },
  { n: "02", t: "Tondeuses désinfectées", r: "Spray désinfectant et brosse entre chaque passage. Les sabots trempent le soir." },
  { n: "03", t: "Pas de retouche facturée", r: "Une patte qui gêne dans les 7 jours ? On la reprend, gratuitement." },
];

export default function EquipePage() {
  return (
    <Page>
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <EnTete
        ariane={ARIANE}
        repere="3"
        titre={["Trois fauteuils.", <span key="b" className="text-acier">Trois barbiers.</span>]}
        intro={
          <p>
            Pas de turnover, pas de stagiaire sur votre nuque. Chacun sa spécialité, tous capables de tout. Choisissez selon la coupe, ou selon
            l&apos;humeur.
          </p>
        }
      />
      <EquipeHorizontal />

      <section aria-labelledby="regles-titre" className="salon bg-creme py-(--spacing-section) text-charbon">
        <div className="container-page grid-page gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <Etiquette n="02" className="text-acier-fonce">
              La maison
            </Etiquette>
            <Lignes id="regles-titre" className="mt-6 text-d2" lines={["Trois règles", <span key="b" className="text-acier-fonce">au salon.</span>]} />
            <p className="mt-6 max-w-sm text-charbon/80">
              {site.address.street}, à Sète. Trois fauteuils hydrauliques de 1968 rachetés à un salon de Montpellier, et un bac à shampoing qui a vu
              passer deux générations.
            </p>
            <div className="mt-8">
              <Bouton href="/reserver" iconEnd={<IconFleche size={20} />}>
                Prendre place
              </Bouton>
            </div>
          </div>
          <figure className="col-span-12 lg:order-last" data-reveal="clip-bas">
            <IllustrationSalon
              title="Les trois fauteuils de barbier de Dégradé face aux miroirs en arche, salon Grand'Rue à Sète"
              className="h-auto w-full rounded-[2rem]"
            />
            <figcaption className="eyebrow mt-3 text-acier-fonce">Trois fauteuils de 1968, Grand&apos;Rue, Sète. Le chat, c&apos;est Sabot.</figcaption>
          </figure>
          <ol className="col-span-12 border-t border-charbon/15 lg:col-span-6 lg:col-start-7">
            {REGLES.map((r) => (
              <li key={r.n} className="grid grid-cols-[4rem_1fr] gap-4 border-b border-charbon/15 py-8">
                <span className="font-display text-5xl leading-none text-rouge-fonce">{r.n}</span>
                <div>
                  <h3 className="text-3xl leading-none">{r.t}</h3>
                  <p className="mt-3 text-charbon/80">{r.r}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Page>
  );
}
