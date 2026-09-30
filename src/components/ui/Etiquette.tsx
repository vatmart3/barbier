import { cn } from "@/lib/cn";

/** Sur-titre de section : court, gras, couleur d'accent (le numéro n'est plus affiché). */
export function Etiquette({ children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  const sansCouleur = className?.replace(/\btext-\S+/g, "").trim();
  return <p className={cn("text-base font-semibold text-rouge-fonce", sansCouleur)}>{children}</p>;
}
