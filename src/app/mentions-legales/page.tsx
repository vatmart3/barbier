import type { Metadata } from "next";
import { Page } from "@/components/layout/Page";
import { EnTete } from "@/components/ui/EnTete";
import { JsonLd } from "@/components/ui/JsonLd";
import { ACompleter, Prose } from "@/components/ui/Prose";
import { fullAddress, site } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales — Dégradé, barbier à Sète",
  description: "Mentions légales du site Dégradé, barbier à Sète : éditeur, hébergeur, propriété intellectuelle et crédits.",
  path: "/mentions-legales",
});

const ARIANE = [{ name: "Mentions légales", path: "/mentions-legales" }];

export default function MentionsLegales() {
  return (
    <Page>
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <EnTete ariane={ARIANE} titre={["Mentions", "légales."]} />
      <section className="salon bg-creme py-20 text-charbon">
        <div className="container-page">
          <Prose>
            <p>
              Les passages <ACompleter>entre crochets</ACompleter> sont à compléter par l&apos;exploitant du salon avant la mise en ligne.
            </p>
            <h2>Éditeur du site</h2>
            <p>
              {site.legalName}, <ACompleter>forme juridique</ACompleter> au capital de <ACompleter>montant</ACompleter> €
              <br />
              Siège : {fullAddress}
              <br />
              SIRET : <ACompleter>numéro SIRET</ACompleter> — RCS <ACompleter>ville</ACompleter> — TVA intracommunautaire : <ACompleter>numéro</ACompleter>
              <br />
              Inscription au Répertoire des métiers : <ACompleter>numéro RM</ACompleter>
              <br />
              Téléphone : {site.phone.display} — E-mail : {site.email}
              <br />
              Directeur de la publication : <ACompleter>prénom nom, gérant</ACompleter>
            </p>
            <h2>Hébergement</h2>
            <p>
              Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com
            </p>
            <h2>Conception et réalisation</h2>
            <p>
              Design et développement : <a href={site.agency.url}>MJAGENCY</a>, agence web à Sète (Bassin de Thau).
            </p>
            <h2>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus (textes, illustrations, profils gravés, rasoir 3D, logo, mise en page) est protégé par le droit d&apos;auteur. Toute
              reproduction sans autorisation écrite est interdite.
            </p>
            <h2>Médiation de la consommation</h2>
            <p>
              Conformément à l&apos;article L612-1 du Code de la consommation, le client peut recourir gratuitement au médiateur :{" "}
              <ACompleter>nom et coordonnées du médiateur</ACompleter>.
            </p>
            <h2>Responsabilité</h2>
            <p>
              Les prix affichés sont indicatifs et peuvent évoluer ; seuls font foi les tarifs affichés au salon. Les créneaux proposés en ligne sont
              confirmés par le salon.
            </p>
          </Prose>
        </div>
      </section>
    </Page>
  );
}
