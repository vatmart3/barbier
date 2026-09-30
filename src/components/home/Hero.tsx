"use client";

/**
 * HERO « Rasoir ». Vu depuis le fauteuil : le mot DÉGRADÉ, l'échelle des sabots,
 * le rasoir qui flotte. Au premier scroll, la lame s'ouvre, trace une diagonale
 * rouge et le hero se fend en deux moitiés (clip-path) qui glissent pour révéler
 * « Prochain créneau ». Même effet au premier swipe (défilement tactile).
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/config/site";
import { Bouton } from "@/components/ui/Bouton";
import { IconFacebook, IconFleche, IconInstagram, IconTiktok } from "@/components/ui/Icons";
import { VitrineCoupes } from "./VitrineCoupes";
import { RasoirSVG } from "@/components/illustrations/RasoirSVG";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { loaderDelay } from "@/components/layout/Loader";
import { cn } from "@/lib/cn";
import { CUT, heroState } from "./heroState";

const RasoirScene = dynamic(() => import("@/components/three/RasoirScene"), { ssr: false });

const CLIP_A = `polygon(0 0, 100% 0, 100% ${CUT.right}%, 0 ${CUT.left}%)`;
// La moitié B déborde de 2 px sur A : pas de couture visible au repos
const CLIP_B = `polygon(100% calc(${CUT.right}% - 2px), 100% 100%, 0 100%, 0 calc(${CUT.left}% - 2px))`;
function HeroFace() {
  return (
    <div className="ambiance relative h-full overflow-hidden text-creme">
      {/* Réseaux, en colonne à gauche */}
      <ul aria-label="Réseaux sociaux" className="absolute left-(--spacing-gutter) top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex" data-hero-in>
        {[
          { href: site.social.instagram, label: "Instagram", Icon: IconInstagram },
          { href: site.social.facebook, label: "Facebook", Icon: IconFacebook },
          { href: site.social.tiktok, label: "TikTok", Icon: IconTiktok },
        ].map(({ href, label, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} sur ${label}`} className="grid size-11 place-items-center text-creme/85 transition-colors hover:text-ambre">
              <Icon size={20} />
            </a>
          </li>
        ))}
      </ul>

      <div className="container-page relative flex h-full flex-col justify-center pb-10 pt-[calc(var(--header-h)+1rem)] md:pl-24">
        <div className="grid-page items-center">
          <div className="col-span-12 flex flex-col items-center text-center md:col-span-7 md:col-start-6 md:items-end md:text-right lg:col-span-7 lg:col-start-6">
            <h1 className="flex flex-col items-center md:items-end">
              <span className="eyebrow mb-3 text-acier-clair" data-hero-in>
                {site.address.street.replace(/^\d+\s/, "")} · {site.address.city}
              </span>
              <span
                data-hero-word
                className="metal block pt-[0.18em] -mt-[0.18em] font-display text-[min(15vw,19svh)] leading-[0.95] tracking-[0.01em] [font-variation-settings:'wdth'_125] md:text-[min(10.5vw,19svh)]"
              >
                Dégradé
              </span>
              <span data-hero-in className="script -mt-[0.1em] block text-[min(10vw,10svh)] leading-[1.05] md:text-[min(6.2vw,10svh)]">
                Barbier à Sète
              </span>
            </h1>
            <p data-hero-in className="mt-4 font-display text-[clamp(1rem,0.8rem+0.9vw,1.6rem)] normal-case text-ambre [font-variation-settings:'wdth'_100]">
              Fade, taper &amp; barbe au coupe-chou
            </p>
            <div data-hero-in className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <Bouton href="/reserver" size="lg" iconEnd={<IconFleche size={22} />}>
                Prendre place
              </Bouton>
              <Bouton href="/coupes" variant="ligne" size="lg">
                Voir les coupes
              </Bouton>
            </div>
            <p data-hero-in className="tabular mt-5 text-xs tracking-wide text-creme/80 sm:text-sm">
              {site.phone.display} <span className="text-ambre">·</span> mar → sam, nocturne jeudi 21 h
            </p>
          </div>
        </div>
      </div>

      {/* Mini-carrousel des coupes */}
      <div className="absolute bottom-8 right-(--spacing-gutter) z-10 hidden lg:block" data-hero-in>
        <VitrineCoupes />
      </div>
    </div>
  );
}

export function Hero({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const [load3d, setLoad3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [active, setActive] = useState(true);

  // 3D : chargée après la première interaction ou 1,2 s d'inactivité
  useEffect(() => {
    if (tier !== "high") return;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setLoad3d(true);
    };
    const events = ["pointermove", "touchstart", "wheel", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const t = window.setTimeout(go, 1200 + loaderDelay() * 1000);
    return () => {
      window.clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, go));
    };
  }, [tier]);

  // Pointeur → rasoir
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Géométrie du trait de coupe
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const set = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dy = ((CUT.left - CUT.right) / 100) * h;
      el.style.setProperty("--cut-len", `${Math.hypot(w, dy)}px`);
      el.style.setProperty("--cut-angle", `${(-Math.atan2(dy, w) * 180) / Math.PI}deg`);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Rendu 3D suspendu quand le hero est hors écran
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const delay = loaderDelay();

      // Clone de la face A dans la moitié B (décor : aucun titre, aucun élément focalisable).
      // Au repos la face A est entière et interactive ; les deux moitiés n'existent
      // qu'au moment de la coupe (le clone est refait à cet instant, à l'état courant).
      const cloner = () => {
        const faceA = root.current?.querySelector("[data-half-a] [data-face]");
        const halfB = root.current?.querySelector("[data-half-b]");
        if (!faceA || !halfB) return;
        const clone = faceA.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("h1").forEach((h) => {
          const p = document.createElement("p");
          p.className = h.className;
          p.append(...Array.from(h.childNodes));
          h.replaceWith(p);
        });
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        halfB.replaceChildren(clone);
      };
      cloner();

      // Entrée
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-in]", { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: delay + 0.1 });
        // Pas d'opacité sur le mot : il est peint dès le premier rendu (LCP), seul le transform est animé
        gsap.from("[data-hero-word]", { yPercent: 18, duration: 1.2, ease: "expo.out", delay: delay });
        gsap.from("[data-rasoir]", { scale: 0.92, rotate: -6, yPercent: 4, duration: 1.4, ease: "expo.out", delay: delay + 0.2 });

        // Séquence de découpe pilotée au scroll
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              heroState.p = self.progress;
            },
          },
        });
        tl.to("[data-face]", { yPercent: -3, duration: 0.3 }, 0)
          .to("[data-scroll-hint]", { opacity: 0, duration: 0.08 }, 0)
          .fromTo("[data-cut-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power2.in" }, 0.32)
          .to("[data-rasoir-svg]", { x: "-120vw", y: "40vh", rotate: -28, duration: 0.26, ease: "power2.in" }, 0.3)
          .call(cloner, [], 0.5)
          .set("[data-half-a]", { clipPath: CLIP_A }, 0.505)
          .set("[data-half-b]", { visibility: "visible" }, 0.505)
          .to("[data-half-a]", { xPercent: -14, yPercent: -62, rotate: -2, duration: 0.46, ease: "power2.inOut" }, 0.52)
          .to("[data-half-b]", { xPercent: 14, yPercent: 62, rotate: -2, duration: 0.46, ease: "power2.inOut" }, 0.52)
          .to("[data-cut-line]", { opacity: 0, duration: 0.1 }, 0.56)
          .fromTo("[data-reveal]", { scale: 0.92, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.46, ease: "power2.out" }, 0.52)
          .set("[data-half-a], [data-half-b]", { visibility: "hidden" }, 1);
        return () => {
          heroState.p = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[230svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col">
        {/* Section révélée sous le hero */}
        <div data-reveal className="absolute inset-0 origin-center motion-reduce:relative motion-reduce:order-2">
          {children}
        </div>

        {/* Deux moitiés du hero : la première porte le contenu réel, la seconde est un décor */}
        {/* Moitié A : entière au chargement, découpée dès que la moitié B est prête */}
        <div data-half-a className="absolute inset-0 z-10 will-change-transform motion-reduce:relative motion-reduce:h-svh">
          <div data-face className="h-full">
            <HeroFace />
          </div>
        </div>
        {/* Moitié B : copie décorative de la face, clonée côté client (HTML initial plus léger) */}
        <div data-half-b aria-hidden inert className="pointer-events-none invisible absolute inset-0 z-10 will-change-transform motion-reduce:hidden" style={{ clipPath: CLIP_B }} />
        {/* Motion-reduce : la moitié A doit être entière */}
        <style>{`@media (prefers-reduced-motion: reduce){[data-half-a]{clip-path:none!important}}`}</style>

        {/* Trait de coupe rouge : longueur et angle calculés sur la taille réelle de l'écran */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden motion-reduce:hidden">
          <span
            className="absolute right-0 block h-[2px] origin-right"
            style={{ top: `${CUT.right}%`, width: "var(--cut-len, 100%)", transform: "rotate(var(--cut-angle, 0deg))" }}
          >
            <span data-cut-line className="block h-full w-full origin-right scale-x-0 bg-ambre shadow-[0_0_14px_rgba(232,160,74,0.8)]" />
          </span>
        </div>

        {/* Rasoir : SVG immédiat, 3D en surcouche quand prête */}
        <div data-rasoir className="pointer-events-none absolute inset-0 z-30 motion-reduce:hidden">
          <div
            data-rasoir-svg
            className={cn(
              "absolute left-1/2 top-[20%] w-[64vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] transition-opacity duration-700 md:left-[20%] md:top-[56%] md:w-[38vw] md:-rotate-[55deg]",
              ready3d && "opacity-0",
            )}
          >
            <RasoirSVG className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
          </div>
          {load3d ? (
            <div className={cn("absolute inset-0 transition-opacity duration-700", ready3d ? "opacity-100" : "opacity-0")}>
              <RasoirScene active={active} onReady={() => setReady3d(true)} />
            </div>
          ) : null}
        </div>

        {/* Invitation au scroll */}
        <p aria-hidden data-scroll-hint className="eyebrow absolute bottom-6 left-(--spacing-gutter) z-20 hidden items-center gap-3 text-acier md:flex motion-reduce:hidden" data-hero-in>
          <span className="inline-block h-8 w-px animate-pulse bg-ambre" />
          Faites défiler : la lame s&apos;ouvre
        </p>
      </div>
    </div>
  );
}
