/**
 * HERO — le salon en photo plein cadre, lumineux : fauteuils cuir, miroirs en
 * arche, mur à tasseaux. Un dégradé sombre ne couvre que la zone du texte.
 * Composant serveur : image prioritaire (LCP), léger zoom au scroll en CSS pur.
 */
import Image from "next/image";
import Link from "next/link";
import { Bouton } from "@/components/ui/Bouton";
import { IconCalendrier } from "@/components/ui/Icons";

export function Hero() {
  return (
    <div id="hero" className="nuit relative isolate overflow-hidden bg-charbon text-creme">
      <div className="hero-photo absolute inset-0 -z-10">
        <Image
          src="/images/salon-hero.jpg"
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[50%_60%]"
        />
      </div>
      {/* Lisibilité : sombre derrière le texte seulement, la photo reste claire */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(12_16_14/0.86)_0%,rgb(12_16_14/0.72)_45%,rgb(12_16_14/0.1)_72%,rgb(12_16_14/0.4)_100%)] lg:bg-[linear-gradient(90deg,rgb(12_16_14/0.9)_0%,rgb(12_16_14/0.72)_30%,rgb(12_16_14/0.2)_55%,transparent_70%),linear-gradient(0deg,rgb(17_21_19/0.9)_0%,transparent_22%)]"
      />

      <div className="container-page flex min-h-[max(40rem,94svh)] items-start pb-24 pt-[calc(var(--header-h)+3rem)] lg:items-center lg:pt-[calc(var(--header-h)+2rem)]">
        <div className="max-w-2xl">
          <p data-hero-in style={{ ["--i" as string]: 0 }} className="text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-ambre">
            Style <span aria-hidden>•</span> Précision <span aria-hidden>•</span> Caractère
          </p>
          <h1 className="mt-6 text-[clamp(2.75rem,1.6rem+4.2vw,5.25rem)] leading-[1.04] [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]">
            <span className="block">Votre dégradé,</span>
            <span className="metal block whitespace-nowrap">notre obsession.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-creme/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.5)]">
            Réservez en une minute et prenez place dans l&apos;un des trois fauteuils de la Grand&apos;Rue, à Sète. Fade, taper, barbe au
            coupe-chou.
          </p>
          <div data-hero-in style={{ ["--i" as string]: 2 }} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Bouton href="#reserver-express" size="lg" iconEnd={<IconCalendrier size={18} />}>
              Réserver maintenant
            </Bouton>
            <Link href="/coupes" className="inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-medium text-creme hover:text-ambre">
              Voir les coupes <span aria-hidden>›</span>
            </Link>
          </div>
          <dl data-hero-in style={{ ["--i" as string]: 3 }} className="mt-12 hidden gap-10 text-sm sm:flex">
            {[
              ["3", "fauteuils de 1968"],
              ["6", "coupes à prix fixe"],
              ["21 h", "nocturne le jeudi"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <dt className="text-creme/80">{l}</dt>
                <dd className="font-display order-first text-3xl text-creme">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
