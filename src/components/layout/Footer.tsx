import Link from "next/link";
import { directionsUrl, fullAddress, mapsUrl, nav, site, telHref } from "@/config/site";
import { horairesGroupes } from "@/lib/horaires";
import { GererCookies } from "./CookieBanner";
import { IconFacebook, IconInstagram, IconTiktok } from "@/components/ui/Icons";

export function Footer() {
  const groupes = horairesGroupes();
  return (
    <footer className="cv-auto relative overflow-hidden bg-charbon-2 pb-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom)+1.5rem)] text-sm text-creme lg:pb-0">
      <div className="container-page grid-page gap-y-12 pt-20 pb-10">
        <div className="col-span-12 lg:col-span-5">
          <p className="text-2xl font-semibold tracking-tight">On coupe. On taille. On rase.</p>
          <p className="mt-4 max-w-sm text-sm text-acier">
            Du mardi au samedi, Grand&apos;Rue à Sète. Nocturne le jeudi jusqu&apos;à 21 h pour ceux qui travaillent sur le port.
          </p>
          <ul className="mt-6 flex gap-1" aria-label="Réseaux sociaux">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: IconInstagram },
              { href: site.social.facebook, label: "Facebook", Icon: IconFacebook },
              { href: site.social.tiktok, label: "TikTok", Icon: IconTiktok },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} sur ${label}`} className="grid size-11 place-items-center rounded-full text-acier transition-colors hover:bg-creme/5 hover:text-creme">
                  <Icon size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <address className="col-span-12 not-italic sm:col-span-6 md:col-span-4 lg:col-span-3">
          <h2 className="mb-3 text-xs font-semibold text-creme">Le salon</h2>
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
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1 text-rouge-fonce hover:underline">
            Itinéraire <span aria-hidden>›</span>
          </a>
        </address>

        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2">
          <h2 className="mb-3 text-xs font-semibold text-creme">Horaires</h2>
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
          <h2 className="mb-3 text-xs font-semibold text-creme">Pages</h2>
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
          {site.agency.label}
        </a>
      </div>
    </footer>
  );
}
