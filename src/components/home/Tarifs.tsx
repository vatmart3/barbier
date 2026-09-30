import Link from "next/link";
import { coupes, formuleVedette, servicesSimples } from "@/data/prestations";
import { Compteur } from "@/components/ui/Compteur";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";

function Ligne({ nom, detail, duree, prix, href }: { nom: string; detail?: string; duree: number; prix: number; href: string }) {
  return (
    <li className="border-b border-charbon/15">
      <Link href={href} className="group grid min-h-16 grid-cols-[1fr_auto] items-baseline gap-x-4 py-3 sm:grid-cols-[1fr_auto_auto]">
        <span>
          <span className="font-display text-2xl leading-none transition-colors group-hover:text-rouge-fonce sm:text-3xl">{nom}</span>
          {detail ? <span className="mt-1 block text-xs text-acier-fonce">{detail}</span> : null}
        </span>
        <span className="tabular hidden text-sm text-acier-fonce sm:block">
          <Compteur value={duree} duration={700} /> min
        </span>
        <span className="font-display text-3xl leading-none sm:w-20 sm:text-right">
          <Compteur value={prix} /> €
        </span>
      </Link>
    </li>
  );
}

/** Tarifs — ancrage : la formule Coupe + barbe face aux prestations séparées. */
export function Tarifs({ n = "05", titre = true }: { n?: string; titre?: boolean }) {
  const economie = formuleVedette.prixSepare - formuleVedette.prix;
  return (
    <section id="tarifs" aria-labelledby="tarifs-titre" className="salon cv-auto scroll-mt-20 bg-creme py-(--spacing-section) text-charbon">
      <div className="container-page grid-page gap-y-14">
        <div className="col-span-12">
          <Etiquette n={n} className="text-acier-fonce">
            Tarifs
          </Etiquette>
          {titre ? (
            <Lignes id="tarifs-titre" className="mt-6 text-d2" lines={["Prix affichés.", <span key="b" className="text-acier-fonce">Pas de surprise.</span>]} />
          ) : (
            <h2 id="tarifs-titre" className="mt-6 text-d2">
              Tarifs
            </h2>
          )}
        </div>

        {/* Formule vedette */}
        <div className="col-span-12 lg:col-span-5">
          <div className="relative bg-charbon p-6 text-creme shadow-card sm:p-8 lg:sticky lg:top-28">
            <p className="eyebrow flex items-center justify-between text-acier">
              <span>La plus demandée</span>
              <span className="bg-rouge px-2 py-1 text-creme">−{economie} €</span>
            </p>
            <p className="mt-6 font-display text-d1">{formuleVedette.nom}</p>
            <p className="mt-2 text-sm text-creme/75">{formuleVedette.detail}</p>
            <div className="mt-8 flex items-end gap-5">
              <p className="font-display text-d3 leading-[0.8]">
                <Compteur value={formuleVedette.prix} duration={1200} />
                <span className="text-d1"> €</span>
              </p>
              <div className="pb-2 text-sm">
                <p className="text-acier line-through decoration-rouge decoration-2">{formuleVedette.prixSepare} € séparément</p>
                <p className="tabular text-creme/80">{formuleVedette.duree} min au fauteuil</p>
              </div>
            </div>
            <div className="mt-8">
              <Bouton href="/reserver?coupe=fade-moyen&dessus=court&barbe=taille" iconEnd={<IconFleche size={20} />}>
                Réserver la formule
              </Bouton>
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-12 lg:col-span-6 lg:col-start-7">
          <div>
            <h3 className="eyebrow mb-2 text-acier-fonce">Coupes</h3>
            <ul className="border-t border-charbon/15">
              {coupes.map((c) => (
                <Ligne key={c.id} nom={c.nom} duree={c.duree} prix={c.prix} href={`/reserver?coupe=${c.id}`} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow mb-2 text-acier-fonce">Barbe & entre deux coupes</h3>
            <ul className="border-t border-charbon/15">
              {servicesSimples.map((s) => (
                <Ligne key={s.id} nom={s.nom} detail={s.detail} duree={s.duree} prix={s.prix} href={`/reserver?service=${s.id}`} />
              ))}
            </ul>
          </div>
          <p className="text-xs text-acier-fonce">Dessus long texturisé : +3 €. Paiement carte, sans contact ou espèces. Bons cadeaux au salon.</p>
        </div>
      </div>
    </section>
  );
}
