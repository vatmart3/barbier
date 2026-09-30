"use client";

/**
 * Fiches barbiers. Desktop : le fauteuil pivote d'un poste à l'autre
 * (pin + défilement horizontal). Mobile / mouvement réduit : fiches empilées.
 */
import Link from "next/link";
import { useRef } from "react";
import { barbiers } from "@/data/barbiers";
import { gsap, useGSAP } from "@/lib/gsap";
import { ProfilTete } from "@/components/illustrations/ProfilTete";
import { Grave } from "@/components/ui/Grave";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { DispoSemaine } from "./DispoSemaine";
import { cn } from "@/lib/cn";

const JOURS_COURTS: Record<string, string> = { mardi: "mar", mercredi: "mer", jeudi: "jeu", vendredi: "ven", samedi: "sam" };

export function EquipeHorizontal() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const annee = new Date().getFullYear();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            snap: { snapTo: 1 / (barbiers.length - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
            invalidateOnRefresh: true,
            onUpdate: (self) => section.current?.style.setProperty("--pivot", String(self.progress)),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-label="Les barbiers" className="relative overflow-hidden bg-charbon text-creme">
      <div ref={track} className="flex flex-col lg:h-svh lg:w-max lg:flex-row motion-reduce:lg:h-auto motion-reduce:lg:w-full motion-reduce:lg:flex-col">
        {barbiers.map((b, i) => (
          <article
            key={b.id}
            id={b.id}
            aria-labelledby={`nom-${b.id}`}
            className={cn(
              "relative grid scroll-mt-16 grid-cols-12 gap-x-(--spacing-gutter) gap-y-10 border-b border-creme/10 px-(--spacing-gutter) py-20 lg:h-svh lg:w-screen lg:border-b-0 lg:border-r lg:pb-16 lg:pt-[calc(var(--header-h)+2rem)] motion-reduce:lg:h-auto",
            )}
            style={{ ["--paper" as string]: i % 2 ? "var(--color-charbon-2)" : "var(--color-charbon)" }}
          >
            <div className={cn("absolute inset-0 -z-10", i % 2 ? "bg-charbon-2" : "bg-charbon")} />
            <div className="col-span-12 flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="eyebrow tabular text-acier">
                  Fauteuil {i + 1} · {b.role} · depuis {b.depuis}
                </p>
                <div id={`nom-${b.id}`}>
                  <Grave as="h2" text={b.prenom} className="mt-4 text-[clamp(6rem,3rem+13vw,17rem)] leading-none" />
                </div>
              </div>
              <div className={cn("mt-8 w-2/3 max-w-sm self-start lg:mt-0 lg:w-[48%]", i === 1 && "-scale-x-100")}>
                <ProfilTete {...b.portrait} title={b.alt} className="w-full text-creme" />
              </div>
            </div>

            <div className="col-span-12 flex flex-col justify-end gap-8 lg:col-span-5 lg:col-start-8">
              <div>
                <p className="font-display text-4xl leading-none">{b.specialite}</p>
                <p className="mt-3 text-creme/80">{b.style}</p>
              </div>
              <div className="space-y-3 text-sm text-creme/80">
                {b.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t border-creme/15 pt-4 text-sm">
                <div>
                  <dt className="eyebrow text-acier">Signature</dt>
                  <dd className="mt-1">{b.signature}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Outil fétiche</dt>
                  <dd className="mt-1">{b.outil}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Au fauteuil</dt>
                  <dd className="tabular mt-1">{b.jours.map((j) => JOURS_COURTS[j]).join(" · ")}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-acier">Métier</dt>
                  <dd className="tabular mt-1">{annee - b.depuis} ans</dd>
                </div>
              </dl>
              <blockquote className="border-l-2 border-rouge pl-4 italic text-creme/85">{b.replique}</blockquote>
              <DispoSemaine barbier={b.id} prenom={b.prenom} />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Bouton href={`/reserver?barbier=${b.id}`} iconEnd={<IconFleche size={20} />}>
                  Réserver avec {b.prenom}
                </Bouton>
                {i < barbiers.length - 1 ? (
                  <Link href={`#${barbiers[i + 1].id}`} className="hidden text-sm text-acier underline underline-offset-4 hover:text-creme lg:inline">
                    Fauteuil suivant : {barbiers[i + 1].prenom}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-(--spacing-gutter) bottom-6 hidden h-px bg-creme/15 lg:block motion-reduce:hidden">
        <span className="absolute inset-y-0 left-0 w-full origin-left bg-rouge" style={{ transform: "scaleX(var(--pivot, 0))" }} />
      </div>
    </section>
  );
}
