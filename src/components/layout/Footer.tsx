import Link from "next/link";
import { directionsUrl, fullAddress, mapsUrl, nav, site, telHref } from "@/config/site";
import { servicesSimples, coupes } from "@/data/prestations";
import { horairesGroupes } from "@/lib/horaires";
import { GererCookies } from "./CookieBanner";
import { IconCiseaux, IconFacebook, IconInstagram, IconMail, IconRoute, IconTel, IconTiktok } from "@/components/ui/Icons";

const titre = "mb-4 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-creme";
const lien = "inline-flex min-h-10 items-center text-creme-2 transition-colors hover:text-rouge-fonce";

export function Footer() {
  const groupes = horairesGroupes();
  const annee = new Date().getFullYear();
  return (
    <footer className="relative border-t border-creme/8 bg-[#0c100e] pb-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom)+1.5rem)] text-sm text-creme lg:pb-0">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-14 sm:gap-x-8 sm:gap-y-12 sm:pb-12 sm:pt-16 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <IconCiseaux size={30} className="text-rouge-fonce" />
            <span className="leading-none">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-creme-2">Barbier · Sète</span>
              <span className="font-display mt-1 block text-[1.5rem]">Dégradé</span>
              <span className="sr-only">, accueil</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed text-acier">
            On coupe, on taille, on rase. Du mardi au samedi, Grand&apos;Rue, avec une nocturne le jeudi pour ceux qui travaillent sur le port.
          </p>
          <ul className="mt-5 flex gap-1" aria-label="Réseaux sociaux">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: IconInstagram },
              { href: site.social.facebook, label: "Facebook", Icon: IconFacebook },
              { href: site.social.tiktok, label: "TikTok", Icon: IconTiktok },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} sur ${label}`}
                  className="grid size-11 place-items-center rounded-full border border-creme/10 text-creme-2 transition-colors hover:border-rouge hover:text-rouge-fonce"
                >
                  <Icon size={19} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Pied de page">
          <h2 className={titre}>Navigation</h2>
          <ul>
            {[...nav, { href: "/reserver", label: "Réserver", sabot: "" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={lien}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={titre}>Prestations</h2>
          <ul>
            {[...coupes.slice(0, 3).map((c) => ({ href: `/reserver?coupe=${c.id}`, label: c.nom })), ...servicesSimples.slice(0, 2).map((x) => ({ href: `/reserver?service=${x.id}`, label: x.nom }))].map((x) => (
              <li key={x.href}>
                <Link href={x.href} className={lien}>
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="col-span-2 not-italic sm:col-span-1">
          <h2 className={titre}>Contact</h2>
          <ul className="space-y-1">
            <li>
              <a href={telHref} className={`${lien} tabular gap-3`}>
                <IconTel size={18} className="shrink-0 text-rouge-fonce" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${lien} gap-3`}>
                <IconMail size={18} className="shrink-0 text-rouge-fonce" />
                {site.email}
              </a>
            </li>
            <li>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${lien} items-start gap-3 py-2`}>
                <IconRoute size={18} className="mt-0.5 shrink-0 text-rouge-fonce" />
                {fullAddress}
              </a>
            </li>
            <li>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 pl-[1.875rem] text-rouge-fonce hover:underline">
                Itinéraire <span aria-hidden>›</span>
              </a>
            </li>
          </ul>
        </address>

        <div className="col-span-2 sm:col-span-1">
          <h2 className={titre}>Horaires</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
            {groupes.map((g) => (
              <div key={g.jours}>
                <dt className="text-creme-2">{g.jours}</dt>
                <dd className="tabular text-acier">{g.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-creme/8">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-acier md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-6">
            <li>© {annee} {site.fullName}</li>
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
          <a href={site.agency.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 hover:text-creme">
            <span aria-hidden className="text-rouge-fonce">♥</span>
            {site.agency.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
