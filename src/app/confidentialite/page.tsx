import type { Metadata } from "next";
import { Page } from "@/components/layout/Page";
import { EnTete } from "@/components/ui/EnTete";
import { JsonLd } from "@/components/ui/JsonLd";
import { ACompleter, Prose } from "@/components/ui/Prose";
import { GererCookies } from "@/components/layout/CookieBanner";
import { fullAddress, site } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Confidentialité et cookies — Dégradé, barbier Sète",
  description: "Données collectées lors d'une réservation ou d'une question, durée de conservation, vos droits RGPD et gestion des cookies.",
  path: "/confidentialite",
});

const ARIANE = [{ name: "Confidentialité", path: "/confidentialite" }];

export default function Confidentialite() {
  return (
    <Page>
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <EnTete ariane={ARIANE} titre={["Vos données,", "en clair."]} intro={<p>Le strict nécessaire pour vous couper les cheveux à l&apos;heure prévue. Rien de plus.</p>} />
      <section className="salon bg-creme py-20 text-charbon">
        <div className="container-page">
          <Prose>
            <h2>Responsable du traitement</h2>
            <p>
              {site.legalName}, {fullAddress}. Contact : {site.email} — {site.phone.display}.
              <br />
              Référent données : <ACompleter>prénom nom</ACompleter>.
            </p>
            <h2>Ce que nous collectons</h2>
            <ul>
              <li>
                <strong>Réservation</strong> : prénom, nom (facultatif), téléphone, e-mail (facultatif), prestation, créneau, note libre. Base légale :
                exécution du service demandé.
              </li>
              <li>
                <strong>Question</strong> : nom, téléphone ou e-mail, message. Base légale : votre consentement.
              </li>
              <li>
                <strong>Carte de fidélité</strong> : nombre de passages, rattaché à votre prénom et téléphone.
              </li>
            </ul>
            <h2>Durée de conservation</h2>
            <p>12 mois après le dernier rendez-vous, puis suppression. Les questions sont supprimées 3 mois après la réponse.</p>
            <h2>Destinataires</h2>
            <p>
              Uniquement l&apos;équipe du salon. Sous-traitants techniques : Vercel (hébergement) et <ACompleter>Resend ou autre prestataire d&apos;e-mail</ACompleter>{" "}
              (envoi des confirmations). Aucune revente, aucune publicité ciblée.
            </p>
            <h2>Vos droits</h2>
            <p>
              Accès, rectification, effacement, opposition, limitation et portabilité : écrivez à {site.email}. Réponse sous un mois. En cas de
              désaccord, vous pouvez saisir la CNIL (cnil.fr).
            </p>
            <h2>Cookies et traceurs</h2>
            <p>
              Le site ne dépose aucun cookie publicitaire ni traceur tiers. Le plan d&apos;accès est dessiné, sans carte Google intégrée. Nous conservons
              dans votre navigateur (stockage local) votre choix concernant la mesure d&apos;audience, et un indicateur pour ne pas rejouer l&apos;animation
              d&apos;entrée. Une mesure d&apos;audience anonyme n&apos;est activée que si vous l&apos;acceptez.
            </p>
            <p>
              <span className="inline-block border border-charbon px-3 [&_button]:text-charbon">
                <GererCookies />
              </span>
            </p>
          </Prose>
        </div>
      </section>
    </Page>
  );
}
