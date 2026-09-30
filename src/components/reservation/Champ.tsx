import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Champ de formulaire : libellé, aide, message d'erreur relié (aria-describedby). */
export function Champ({
  id,
  label,
  erreur,
  aide,
  optionnel,
  children,
  className,
  tone = "dark",
}: {
  id: string;
  label: string;
  erreur?: string;
  aide?: string;
  optionnel?: boolean;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-semibold">
        {label}
        {optionnel ? <span className={cn("text-xs font-normal", tone === "dark" ? "text-acier" : "text-acier-fonce")}>facultatif</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {aide && !erreur ? (
        <p id={`${id}-aide`} className={cn("mt-1.5 text-xs", tone === "dark" ? "text-acier" : "text-acier-fonce")}>
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={`${id}-erreur`} role="alert" className={cn("mt-1.5 flex items-center gap-2 text-sm", tone === "dark" ? "text-erreur" : "text-rouge-fonce")}>
          <span aria-hidden className="inline-block size-1.5 shrink-0 rounded-full bg-current" />
          {erreur}
        </p>
      ) : null}
    </div>
  );
}

export const inputCls = (tone: "dark" | "light", invalide?: boolean) =>
  cn(
    "block min-h-12 w-full border bg-transparent px-3.5 py-2 text-base transition-colors duration-200 focus:outline-none",
    tone === "dark"
      ? "border-creme/25 text-creme placeholder:text-acier/70 focus:border-creme"
      : "border-charbon/30 text-charbon placeholder:text-acier-fonce/70 focus:border-charbon",
    invalide && (tone === "dark" ? "border-erreur" : "border-rouge-fonce"),
  );
