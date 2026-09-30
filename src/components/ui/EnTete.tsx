import type { ReactNode } from "react";
import { FilAriane } from "./FilAriane";
import { Lignes } from "./Lignes";
import { cn } from "@/lib/cn";

interface Props {
  ariane: { name: string; path: string }[];
  titre: ReactNode[];
  intro?: ReactNode;
  /** Conservé pour compatibilité (plus affiché) */
  repere?: string;
  children?: ReactNode;
  className?: string;
}

/** En-tête de page intérieure : fil d'Ariane, titre centré en deux tons, chapô. */
export function EnTete({ ariane, titre, intro, children, className }: Props) {
  return (
    <header className={cn("bg-charbon pb-16 pt-[calc(var(--header-h)+1rem)] text-creme md:pb-24", className)}>
      <div className="container-page">
        <FilAriane items={ariane} />
        <Lignes as="h1" className="mx-auto mt-12 max-w-[18ch] text-center text-d2 md:mt-20" lines={titre} auto />
        {intro ? <div className="mx-auto mt-6 max-w-2xl text-center text-xl text-acier">{intro}</div> : null}
        {children}
      </div>
    </header>
  );
}
