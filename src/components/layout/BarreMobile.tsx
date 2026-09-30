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
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-[transform,opacity] duration-500 ease-(--ease-out-cut) lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0",
      )}
    >
      <div className="verre flex h-(--mobile-bar-h) items-center gap-1.5 rounded-full border border-creme/10 p-1.5 shadow-card">
        <Link href="/reserver" className="flex h-full flex-1 items-center justify-center gap-2 rounded-full bg-rouge px-4 text-[0.9375rem] font-semibold text-sur-accent active:scale-[0.98]">
          <IconCalendrier size={18} />
          Réserver
        </Link>
        <a href={telHref} aria-label="Appeler le salon" className="flex h-full min-w-14 flex-col items-center justify-center gap-0.5 rounded-full px-3 text-[0.6875rem] text-creme active:bg-creme/10">
          <IconTel size={18} />
          Appeler
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Itinéraire vers le salon"
          className="flex h-full min-w-14 flex-col items-center justify-center gap-0.5 rounded-full px-3 text-[0.6875rem] text-creme active:bg-creme/10"
        >
          <IconRoute size={18} />
          Itinéraire
        </a>
      </div>
    </nav>
  );
}
