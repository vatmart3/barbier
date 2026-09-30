"use client";

/** CTA collant mobile : Réserver / Appeler / Itinéraire — un geste chacun. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { directionsUrl, telHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { IconCalendrier, IconRoute, IconTel } from "@/components/ui/Icons";

export function BarreMobile() {
  const pathname = usePathname();
  const [depasse, setDepasse] = useState(false);
  const cachee = pathname.startsWith("/reserver");
  // Sur l'accueil, la barre n'arrive qu'une fois le hero passé
  const visible = pathname !== "/" || depasse;

  useEffect(() => {
    const onScroll = () => setDepasse(window.scrollY > window.innerHeight * 0.6);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (cachee) return null;

  return (
    <nav
      aria-label="Actions rapides"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-creme/10 bg-charbon/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 ease-(--ease-out-cut) lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="grid h-(--mobile-bar-h) grid-cols-[1fr_auto_auto]">
        <Link href="/reserver" className="flex items-center justify-center gap-2.5 bg-rouge px-4 text-sm font-semibold uppercase tracking-wide text-creme active:bg-rouge-fonce">
          <IconCalendrier size={18} />
          Réserver
        </Link>
        <a href={telHref} className="flex min-w-20 flex-col items-center justify-center gap-1 border-l border-creme/10 px-4 text-[0.6875rem] uppercase tracking-wider active:bg-creme/10">
          <IconTel size={18} />
          Appeler
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-20 flex-col items-center justify-center gap-1 border-l border-creme/10 px-4 text-[0.6875rem] uppercase tracking-wider active:bg-creme/10"
        >
          <IconRoute size={18} />
          Itinéraire
        </a>
      </div>
    </nav>
  );
}
