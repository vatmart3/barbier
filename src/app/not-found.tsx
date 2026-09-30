import Link from "next/link";
import { Page } from "@/components/layout/Page";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <Page>
      <section className="container-page flex min-h-svh flex-col justify-center pb-24 pt-[calc(var(--header-h)+2rem)]">
        <p className="eyebrow text-acier">Erreur 404</p>
        <h1 className="mt-6 font-display text-[clamp(6rem,3rem+14vw,16rem)] leading-[0.8]">
          4<span className="text-transparent [-webkit-text-stroke:2px_var(--color-creme)]">0</span>4
        </h1>
        <p className="mt-8 max-w-md text-xl">Cette page a été rasée de trop près. Il n&apos;en reste rien.</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Bouton href="/reserver" iconEnd={<IconFleche size={20} />}>
            Réserver quand même
          </Bouton>
          <Link href="/" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </Page>
  );
}
