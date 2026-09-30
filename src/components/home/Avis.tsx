"use client";

/**
 * « Entendu au fauteuil » — les avis en index typographique, pas en carrousel.
 * Chaque ligne entre par un masque horizontal, en alternance gauche / droite.
 */
import { motion, useReducedMotion } from "motion/react";
import { avis, chiffres } from "@/data/avis";
import { getBarbier } from "@/data/barbiers";
import { Compteur } from "@/components/ui/Compteur";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { ease } from "@/design/motion";
import { cn } from "@/lib/cn";

export function Avis() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="avis-titre" className="bg-creme py-(--spacing-section) text-charbon">
      <div className="container-page">
        <div className="grid-page gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <Etiquette n="07" className="text-acier-fonce">
              Entendu au fauteuil
            </Etiquette>
            <Lignes id="avis-titre" className="mt-6 text-d2" lines={["Ce qu'ils disent", <span key="b" className="text-acier-fonce">en se levant.</span>]} />
          </div>
          <dl className="col-span-12 grid grid-cols-3 gap-4 self-end border-t border-charbon/15 pt-6 lg:col-span-6">
            {chiffres.map((c) => (
              <div key={c.legende}>
                <dd className="font-display text-[clamp(2.25rem,1.5rem+3vw,4.5rem)] leading-none">
                  <Compteur value={c.valeur.toLocaleString("fr-FR")} duration={1300} />
                  {c.suffixe}
                </dd>
                <dt className="mt-2 text-xs text-acier-fonce">{c.legende}</dt>
              </div>
            ))}
          </dl>
        </div>

        <ul className="mt-20 border-t border-charbon/15 md:mt-28">
          {avis.map((a, i) => {
            const b = getBarbier(a.barbier);
            const droite = i % 2 === 1;
            return (
              <li key={a.auteur} className="overflow-hidden border-b border-charbon/15">
                <motion.figure
                  className="grid-page gap-y-4 py-10 md:py-14"
                  initial={reduce ? { opacity: 0 } : { clipPath: droite ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", x: droite ? 40 : -40 }}
                  whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0%)", x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 1, ease: ease.outCut }}
                >
                  <figcaption className={cn("col-span-12 text-sm md:col-span-3", droite && "md:order-2 md:col-start-10 md:text-right")}>
                    <span className="block font-semibold">{a.auteur}</span>
                    <span className="block text-acier-fonce">{a.ville}</span>
                    <span className="eyebrow mt-3 block text-acier-fonce">
                      {a.coupe} · avec {b?.prenom}
                    </span>
                    {a.clientDepuis ? <span className="mt-1 block text-xs text-acier-fonce">Client depuis {a.clientDepuis}</span> : null}
                  </figcaption>
                  <blockquote className={cn("col-span-12 md:col-span-8", droite ? "md:col-start-1" : "md:col-start-5")}>
                    <p className="font-display text-[clamp(2rem,1.2rem+3.2vw,4.75rem)] uppercase leading-[0.92]">« {a.extrait} »</p>
                    <p className="mt-4 max-w-xl text-charbon/75">{a.texte}</p>
                    <p className="eyebrow mt-3 text-acier-fonce">{a.date}</p>
                  </blockquote>
                </motion.figure>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-xs text-acier-fonce">Site concept : avis d&apos;illustration, à remplacer par les avis réels du salon.</p>
      </div>
    </section>
  );
}
