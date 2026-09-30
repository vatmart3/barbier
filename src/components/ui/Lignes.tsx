/**
 * Masques de texte ligne par ligne : chaque ligne remonte de sous sa propre
 * arête, comme un peigne qui dégage la nuque. CSS pur (voir globals.css).
 */
import { createElement, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  /** Délai de départ, en secondes */
  delay?: number;
  id?: string;
  /** Au-dessus de la ligne de flottaison : animation CSS dès le chargement, sans attendre le JS */
  auto?: boolean;
}

export function Lignes({ lines, as = "h2", className, lineClassName, delay = 0, id, auto = false }: Props) {
  return createElement(
    as,
    { className, id, "data-reveal": auto ? "lignes-auto" : "lignes", style: { "--d": `${delay * 1000}ms` } as CSSProperties },
    lines.map((line, i) => (
      <span key={i} className={cn("ligne", lineClassName)}>
        <span className="ligne-in" style={{ "--i": i } as CSSProperties}>
          {line}
        </span>
      </span>
    )),
  );
}
