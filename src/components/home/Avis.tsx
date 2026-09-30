/**
 * « Entendu au fauteuil » — les avis en cartes arrondies, en colonnes de
 * hauteurs libres (comme des mots posés sur le comptoir, pas un carrousel).
 */
import { avis } from "@/data/avis";
import { getBarbier } from "@/data/barbiers";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";

function Etoiles() {
  return (
    <span role="img" className="flex gap-0.5 text-rouge" aria-label="5 sur 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 3.2c.3 0 .6.2.7.5l2.1 4.6 5 .6c.7.1.9.9.4 1.3l-3.7 3.4 1 4.9c.1.7-.6 1.2-1.2.9L12 17l-4.4 2.4c-.6.3-1.3-.2-1.2-.9l1-4.9-3.7-3.4c-.5-.4-.3-1.2.4-1.3l5-.6 2.1-4.6c.2-.3.5-.5.8-.5Z" />
        </svg>
      ))}
    </span>
  );
}

export function Avis() {
  return (
    <section aria-labelledby="avis-titre" className="bg-charbon-2 py-(--spacing-section)">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <Etiquette>Entendu au fauteuil</Etiquette>
            <Lignes id="avis-titre" className="mt-4 text-d2" lines={["Ce qu'ils disent", <span key="b" className="text-acier">en se levant.</span>]} />
          </div>
          <p aria-hidden className="font-script -rotate-2 text-2xl text-rouge-fonce">recopiés du cahier près de la caisse</p>
        </div>

        <ul className="mt-12 gap-4 sm:columns-2 lg:columns-3">
          {avis.map((a, i) => {
            const b = getBarbier(a.barbier);
            return (
              <li key={a.auteur} className="mb-4 break-inside-avoid" data-reveal="monte" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }}>
                <figure className="rounded-[1.75rem] bg-charbon p-6">
                  <Etoiles />
                  <blockquote className="mt-4 text-[1.0625rem] leading-relaxed">« {a.texte} »</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden
                      className="font-display grid size-11 shrink-0 place-items-center rounded-full text-lg"
                      style={{ background: b?.teinte ?? "var(--color-charbon-2)" }}
                    >
                      {a.auteur[0]}
                    </span>
                    <span className="min-w-0 text-sm leading-snug">
                      <span className="block font-semibold">
                        {a.auteur} <span className="font-normal text-acier">· {a.ville}</span>
                      </span>
                      <span className="block text-acier">
                        {a.coupe} avec {b?.prenom} · {a.date}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-acier">Site concept : avis d&apos;illustration, à remplacer par les avis réels du salon.</p>
      </div>
    </section>
  );
}
