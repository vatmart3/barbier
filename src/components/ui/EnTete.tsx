import type { ReactNode } from "react";
import { FilAriane } from "./FilAriane";
import { Lignes } from "./Lignes";
import { cn } from "@/lib/cn";

interface Props {
  ariane: { name: string; path: string }[];
  titre: ReactNode[];
  intro?: ReactNode;
  /** Grand repère en fond (numéro de sabot) */
  repere?: string;
  children?: ReactNode;
  className?: string;
}

/** En-tête de page intérieure : fil d'Ariane, h1 en masques, repère géant. */
export function EnTete({ ariane, titre, intro, repere, children, className }: Props) {
  return (
    <header className={cn("relative overflow-hidden bg-charbon pb-16 pt-[calc(var(--header-h)+1.5rem)] text-creme md:pb-24", className)}>
      {repere ? (
        <p
          aria-hidden
          className="pointer-events-none absolute -right-[0.04em] top-[calc(var(--header-h)-0.1em)] select-none font-display text-[clamp(7rem,3rem+17vw,21rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(242_237_228/0.14)]"
        >
          {repere}
        </p>
      ) : null}
      <div className="container-page relative">
        <FilAriane items={ariane} />
        <Lignes as="h1" className="mt-10 max-w-[14ch] text-d2 md:mt-16" lines={titre} auto />
        {intro ? <div className="mt-8 max-w-xl text-lg text-creme/80">{intro}</div> : null}
        {children}
      </div>
    </header>
  );
}
