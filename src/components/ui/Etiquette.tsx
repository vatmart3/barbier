import { cn } from "@/lib/cn";

/** Numéro de section + libellé, façon repère de sabot : « 03 — Les coupes » */
export function Etiquette({ n, children, className }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      {n ? <span className="tabular">{n}</span> : null}
      <span aria-hidden className="h-px w-8 bg-rouge" />
      <span>{children}</span>
    </p>
  );
}
