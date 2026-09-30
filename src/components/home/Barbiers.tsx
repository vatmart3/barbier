import Link from "next/link";
import { barbiers } from "@/data/barbiers";
import { Grave } from "@/components/ui/Grave";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";
import { ProfilStatique } from "@/components/illustrations/ProfilStatique";
import { IconFleche } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

const OFFSETS = ["md:col-start-1", "md:col-start-5", "md:col-start-2"];

/** Les barbiers — noms gravés au burin, portraits en hachures. */
export function Barbiers() {
  const annee = new Date().getFullYear();
  return (
    <section aria-labelledby="barbiers-titre" className="salon cv-auto bg-creme py-(--spacing-section) text-charbon" style={{ ["--paper" as string]: "var(--color-creme)" }}>
      <div className="container-page">
        <div className="grid-page gap-y-6">
          <Etiquette n="03" className="col-span-12 text-acier-fonce">
            Les barbiers
          </Etiquette>
          <Lignes
            id="barbiers-titre"
            className="col-span-12 text-d2 md:col-span-9"
            lines={["Trois paires de mains.", <span key="b" className="text-acier-fonce">Trois manies.</span>]}
          />
        </div>

        <ul className="mt-20 space-y-24 md:mt-28 md:space-y-32">
          {barbiers.map((b, i) => (
            <li key={b.id} className="grid-page items-end gap-y-6">
              <div className={cn("col-span-12 md:col-span-8", OFFSETS[i])}>
                <p className="eyebrow mb-4 flex gap-4 text-acier-fonce">
                  <span>{b.role}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular">{annee - b.depuis} ans de tondeuse</span>
                </p>
                <div className="flex items-end gap-6">
                  <Grave text={b.prenom} className="text-[clamp(5rem,3rem+10vw,13rem)] leading-none" delay={i * 120} />
                  <div className={cn("hidden w-40 shrink-0 sm:block lg:w-52", i === 1 && "-scale-x-100")}>
                    <ProfilStatique id={`b-${b.id}`} {...b.portrait} title={b.alt} className="w-full" />
                  </div>
                </div>
                <div className="mt-6 grid gap-6 border-t border-charbon/15 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="font-display text-2xl leading-tight">{b.specialite}</p>
                    <p className="mt-2 text-sm text-acier-fonce">{b.style}</p>
                  </div>
                  <div className="flex flex-col justify-between gap-4">
                    <blockquote className="text-sm italic text-charbon/80">{b.replique}</blockquote>
                    <div className="flex flex-wrap gap-x-6">
                      <Link href={`/reserver?barbier=${b.id}`} className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
                        <span className="text-rouge-fonce group-hover:underline">Réserver avec {b.prenom}</span>
                        <IconFleche size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <Link href={`/equipe#${b.id}`} className="inline-flex min-h-11 items-center text-sm text-acier-fonce underline underline-offset-4 hover:text-charbon">
                        Ses dispos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
