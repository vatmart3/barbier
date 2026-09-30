import type { Metadata } from "next";
import { Suspense } from "react";
import { Page } from "@/components/layout/Page";
import { FilAriane } from "@/components/ui/FilAriane";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reservation } from "@/components/reservation/Reservation";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { site, telHref } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Réserver chez votre barbier à Sète — Dégradé",
  description:
    "Choisissez la coupe, le barbier et le créneau : réservation en moins d'une minute chez Dégradé, barbier à Sète. Confirmation immédiate, annulation libre.",
  path: "/reserver",
});

const ARIANE = [{ name: "Réserver", path: "/reserver" }];

export default function ReserverPage() {
  return (
    <Page className="bg-charbon text-creme">
      <JsonLd data={breadcrumbJsonLd(ARIANE)} />
      <section aria-labelledby="reserver-titre" className="container-page pb-(--spacing-section) pt-[calc(var(--header-h)+1.5rem)]">
        <FilAriane items={ARIANE} />
        <div className="mb-12 mt-8 flex flex-wrap items-end justify-between gap-6">
          <h1 id="reserver-titre" className="text-d2">
            Prendre place
          </h1>
          <p className="max-w-xs text-sm text-acier">
            Trois étapes, moins d&apos;une minute. Plutôt au téléphone ?{" "}
            <a href={telHref} className="tabular whitespace-nowrap text-creme underline underline-offset-4">
              {site.phone.display}
            </a>
          </p>
        </div>
        <Suspense fallback={<div className="h-[60vh] animate-pulse bg-creme/5" />}>
          <Reservation />
        </Suspense>
      </section>
    </Page>
  );
}
