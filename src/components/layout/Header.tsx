"use client";

/**
 * Barre de navigation translucide (style Apple) : fine, floutée, le contenu
 * défile dessous. Sombre au-dessus du hero noir, claire ailleurs.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { nav } from "@/config/site";
import { cn } from "@/lib/cn";
import { IconMenu } from "@/components/ui/Icons";
import { Enseigne } from "./Enseigne";
import { ProchainCreneauPastille } from "./ProchainCreneauPastille";
import { Menu } from "./Menu";

export function Header() {
  const pathname = usePathname();
  const [surHero, setSurHero] = useState(pathname === "/");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Au-dessus du hero noir de l'accueil, la barre passe en matériau sombre
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      setSurHero(!!hero && hero.getBoundingClientRect().bottom > 52);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <>
      <a href="#contenu" className="sr-only-focusable left-4 top-4 rounded-full bg-creme px-4 py-3 text-charbon">
        Aller au contenu
      </a>
      <header
        className={cn(
          "verre fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-creme/10 text-creme transition-colors duration-300",
          surHero && "nuit",
        )}
      >
        <div className="container-page flex h-full items-center gap-3 sm:gap-5">
          <Link href="/" className="mr-auto text-[1.1875rem] font-semibold tracking-tight lg:mr-0" aria-label="Dégradé, barbier à Sète — accueil">
            Dégradé
          </Link>

          <div className="flex min-w-0 items-center gap-2 lg:ml-6 lg:mr-auto">
            <Enseigne className="max-[359px]:hidden" />
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
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-3 text-[0.8125rem] transition-colors",
                        active ? "text-creme" : "text-creme/70 hover:text-creme",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/reserver"
            className="relative hidden min-h-8 items-center rounded-full bg-rouge after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-[''] px-4 text-[0.8125rem] font-medium text-white transition-[filter] hover:brightness-110 active:scale-[0.97] sm:inline-flex"
          >
            Réserver
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
