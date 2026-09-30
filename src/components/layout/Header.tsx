"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";
import { Bouton } from "@/components/ui/Bouton";
import { IconMenu } from "@/components/ui/Icons";
import { Enseigne } from "./Enseigne";
import { ProchainCreneauPastille } from "./ProchainCreneauPastille";
import { Menu } from "./Menu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#contenu" className="sr-only-focusable left-4 top-4 bg-creme px-4 py-3 text-charbon">
        Aller au contenu
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-(--header-h) transition-[background-color,border-color] duration-500",
          scrolled ? "border-b border-creme/10 bg-charbon/92 backdrop-blur-md" : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-full items-center gap-3 sm:gap-4">
          <Link href="/" className="group mr-auto flex items-baseline gap-2.5 lg:mr-0" aria-label="Dégradé, barbier à Sète — accueil">
            <span className="font-display text-[1.9rem] leading-none tracking-tight">Dégradé</span>
            <span className="eyebrow hidden text-acier xl:inline">Barbier · Sète</span>
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:ml-8 lg:mr-auto">
            <Enseigne />
            <span className="hidden xl:contents">
              <ProchainCreneauPastille />
            </span>
            <span className="contents xl:hidden">
              <ProchainCreneauPastille compact />
            </span>
          </div>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.slice(1).map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-flex min-h-11 items-center gap-1.5 px-3 text-sm"
                    >
                      <sup className="tabular text-[0.625rem] text-acier">{item.sabot}</sup>
                      <span>{item.label}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 bottom-2 h-px origin-left bg-rouge transition-transform duration-500 ease-(--ease-blade)",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span className="hidden sm:contents">
            <Bouton href="/reserver">Réserver</Bouton>
          </span>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="menu-principal"
          >
            <IconMenu size={24} />
          </button>
        </div>
      </header>
      <Menu open={open} onClose={close} />
    </>
  );
}
