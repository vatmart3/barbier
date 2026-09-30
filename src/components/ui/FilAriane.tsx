import Link from "next/link";

/** Fil d'Ariane visible (le JSON-LD BreadcrumbList est posé par la page). */
export function FilAriane({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="eyebrow text-acier">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-creme">
            Accueil
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            <span aria-hidden className="h-px w-4 bg-rouge" />
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-creme">
                {it.name}
              </span>
            ) : (
              <Link href={it.path} className="inline-flex min-h-11 items-center hover:text-creme">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
