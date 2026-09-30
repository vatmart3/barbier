"use client";

/**
 * Barre de navigation : logo ciseaux + nom, liens en capitales espacées,
 * bouton « Réserver » cerné d'or. Fond anthracite légèrement translucide.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";
import { IconCalendrier, IconCiseaux, IconMenu } from "@/components/ui/Icons";
import { ProchainCreneauPastille } from "./ProchainCreneauPastille";
import { Menu } from "./Menu";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a href="#contenu" className="sr-only-focusable left-4 top-4 rounded-xl bg-rouge px-4 py-3 text-sur-accent">
        Aller au contenu
      </a>
      <header className="verre fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-creme/8 text-creme">
        <div className="container-page flex h-full items-center gap-4">
          <Link href="/" className="mr-auto flex items-center gap-3 lg:mr-0">
            <IconCiseaux size={30} className="shrink-0 text-rouge-fonce" />
            <span className="leading-none">
              <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-creme-2">Barbier · Sète</span>
              <span className="font-display mt-1 block text-[1.5rem] leading-none">Dégradé</span>
              <span className="sr-only">, accueil</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-4 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors",
                        active ? "text-rouge-fonce" : "text-creme-2 hover:text-creme",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span className="contents lg:hidden">
            <ProchainCreneauPastille compact />
          </span>

          <Link
            href="/reserver"
            className="hidden min-h-11 items-center gap-2.5 rounded-xl border border-rouge/80 px-5 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-rouge-fonce transition-colors hover:bg-rouge hover:text-sur-accent sm:inline-flex"
          >
            Réserver
            <IconCalendrier size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="menu-principal"
          >
            <IconMenu size={22} />
          </button>
        </div>
      </header>
      <Menu open={open} onClose={close} />
    </>
  );
}
