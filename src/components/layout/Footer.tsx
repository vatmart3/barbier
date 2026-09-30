import Link from "next/link";
import { directionsUrl, fullAddress, mapsUrl, nav, site, telHref } from "@/config/site";
import { horairesGroupes } from "@/lib/horaires";
import { GererCookies } from "./CookieBanner";

export function Footer() {
  const groupes = horairesGroupes();
  return (
    <footer className="relative overflow-hidden border-t border-creme/10 bg-charbon pb-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom))] text-creme lg:pb-0">
      <div className="container-page grid-page gap-y-12 pt-20 pb-10">
        <div className="col-span-12 lg:col-span-5">
          <p className="font-display text-d1">On coupe. On taille. On rase.</p>
          <p className="mt-4 max-w-sm text-sm text-acier">
            Du mardi au samedi, Grand&apos;Rue à Sète. Nocturne le jeudi jusqu&apos;à 21 h pour ceux qui travaillent sur le port.
          </p>
        </div>

        <address className="col-span-12 not-italic sm:col-span-6 md:col-span-4 lg:col-span-3">
          <h2 className="eyebrow mb-4 text-acier">Le salon</h2>
          <p className="text-sm leading-relaxed">
            {site.fullName}
            <br />
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-creme/30 underline-offset-4 hover:decoration-rouge">
              {fullAddress}
            </a>
          </p>
          <p className="mt-3 text-sm">
            <a href={telHref} className="tabular inline-flex min-h-11 items-center hover:text-acier-clair">
              {site.phone.display}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center hover:text-acier-clair">
              {site.email}
            </a>
          </p>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="eyebrow mt-2 inline-flex min-h-11 items-center gap-2 text-creme hover:text-acier-clair">
            <span aria-hidden className="h-px w-6 bg-rouge" />
            Itinéraire
          </a>
        </address>

        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2">
          <h2 className="eyebrow mb-4 text-acier">Horaires</h2>
          <dl className="space-y-2 text-sm">
            {groupes.map((g) => (
              <div key={g.jours}>
                <dt className="text-acier">{g.jours}</dt>
                <dd className="tabular">{g.texte}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Pied de page" className="col-span-12 md:col-span-4 lg:col-span-2">
          <h2 className="eyebrow mb-4 text-acier">Pages</h2>
          <ul className="text-sm">
            {[...nav, { href: "/reserver", label: "Réserver", sabot: "" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-11 items-center hover:text-acier-clair">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p aria-hidden className="pointer-events-none select-none px-(--spacing-gutter) font-display text-mega leading-[0.72] text-creme/[0.06]">
        Dégradé
      </p>

      <div className="container-page flex flex-col gap-4 border-t border-creme/10 py-6 text-xs text-acier md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <Link href="/mentions-legales" className="inline-flex min-h-11 items-center hover:text-creme">
              Mentions légales
            </Link>
          </li>
          <li>
            <Link href="/confidentialite" className="inline-flex min-h-11 items-center hover:text-creme">
              Confidentialité
            </Link>
          </li>
          <li>
            <GererCookies />
          </li>
        </ul>
        <a href={site.agency.url} target="_blank" rel="noopener" className="group inline-flex min-h-11 items-center gap-2 hover:text-creme">
          <span aria-hidden className="h-px w-5 bg-acier transition-all duration-500 group-hover:w-9 group-hover:bg-rouge" />
          {site.agency.label}
        </a>
      </div>
    </footer>
  );
}
