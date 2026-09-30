"use client";

/**
 * HERO « Rasoir ». Vu depuis le fauteuil : le mot DÉGRADÉ, l'échelle des sabots,
 * le rasoir qui flotte. Au premier scroll, la lame s'ouvre, trace une diagonale
 * rouge et le hero se fend en deux moitiés (clip-path) qui glissent pour révéler
 * « Prochain créneau ». Même effet au premier swipe (défilement tactile).
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/config/site";
import { Bouton } from "@/components/ui/Bouton";
import { IconFleche } from "@/components/ui/Icons";
import { RasoirSVG } from "@/components/illustrations/RasoirSVG";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { loaderDelay } from "@/components/layout/Loader";
import { cn } from "@/lib/cn";
import { CUT, heroState } from "./heroState";

const RasoirScene = dynamic(() => import("@/components/three/RasoirScene"), { ssr: false });

const CLIP_A = `polygon(0 0, 100% 0, 100% ${CUT.right}%, 0 ${CUT.left}%)`;
// La moitié B déborde de 2 px sur A : pas de couture visible au repos
const CLIP_B = `polygon(100% calc(${CUT.right}% - 2px), 100% 100%, 0 100%, 0 calc(${CUT.left}% - 2px))`;
const SABOTS = ["0", "0,5", "1", "1,5", "2", "3", "4"];

function HeroFace({ decor = false }: { decor?: boolean }) {
  const H = decor ? "p" : "h1";
  return (
    <div className="relative flex h-full flex-col bg-charbon text-creme">
      {/* Traces de tondeuse en fond */}
      <div aria-hidden className="absolute inset-x-0 top-[34%] h-[30%] text-creme/[0.05] traces" />

      <div className="container-page relative flex h-full flex-col pb-8 pt-[calc(var(--header-h)+1.5rem)] md:pb-10">
        <div className="grid-page flex-1 content-start gap-y-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <p className="eyebrow text-acier" data-hero-in>
              {site.address.street.replace(/^\d+\s/, "")} · {site.address.city}
            </p>
          </div>
          <div className="col-span-12 hidden justify-end md:col-span-6 md:flex lg:col-span-8" data-hero-in>
            <p className="eyebrow max-w-[22ch] text-right text-acier">Mardi → samedi · nocturne le jeudi jusqu&apos;à 21 h</p>
          </div>
        </div>

        {/* Échelle des sabots, verticale, à droite */}
        <ol aria-hidden className="absolute right-(--spacing-gutter) top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex" data-hero-in>
          {SABOTS.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className={cn("tabular text-xs", i === 1 ? "text-creme" : "text-acier")}>{s}</span>
              <span className={cn("h-px bg-current", i === 1 ? "w-10 bg-rouge" : "w-5 text-acier/60")} />
            </li>
          ))}
        </ol>

        <div className="grid-page items-end gap-y-8">
          <div className="col-span-12 max-w-md sm:col-span-8 md:col-span-5 lg:col-span-4" data-hero-in>
            <p className="text-base text-creme/85 md:text-lg">
              Trois fauteuils, Grand&apos;Rue. Des dégradés sans marche, des barbes finies au coupe-chou. Réserver prend moins d&apos;une minute.
              La coupe, un peu plus.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Bouton href="/reserver" size="lg" iconEnd={<IconFleche size={22} />} tabIndex={decor ? -1 : undefined}>
                Prendre place
              </Bouton>
              <Link
                href="/coupes#configurateur"
                tabIndex={decor ? -1 : undefined}
                className="group inline-flex min-h-11 items-center gap-2 text-sm text-creme/80 underline decoration-creme/30 underline-offset-[6px] transition-colors hover:text-creme hover:decoration-rouge"
              >
                Composer sa coupe
              </Link>
            </div>
          </div>
        </div>

        <H className="relative mt-6 md:mt-8">
          <span className="eyebrow mb-7 block text-acier md:mb-4" data-hero-in>
            Barbier à Sète — fade, taper, barbe au coupe-chou
          </span>
          <span aria-hidden={decor || undefined} className="relative -mb-[0.1em] -mt-[0.12em] block select-none font-display text-[min(30vw,40svh)] leading-[0.74] tracking-[-0.02em]">
            {/* Le mot « DÉGRADÉ » est lui-même un dégradé : plein à gauche, traces à droite.
                Le padding haut garde les accents dans la zone peinte (background-clip / mask). */}
            <span data-hero-word className="block bg-[repeating-linear-gradient(180deg,var(--color-creme)_0_2px,transparent_2px_6px)] bg-clip-text pt-[0.3em] text-transparent">
              Dégradé
            </span>
            <span
              aria-hidden
              data-hero-word
              className="absolute inset-x-0 top-0 block pt-[0.3em] text-creme [mask-image:linear-gradient(90deg,#000_28%,transparent_78%)]"
            >
              Dégradé
            </span>
          </span>
        </H>
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

      // Entrée
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-in]", { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: delay + 0.1 });
        gsap.from("[data-hero-word]", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", delay: delay });
        gsap.from("[data-rasoir]", { opacity: 0, scale: 0.9, rotate: -8, duration: 1.4, ease: "expo.out", delay: delay + 0.2 });

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
        <div data-half-a className="absolute inset-0 z-10 will-change-transform motion-reduce:relative motion-reduce:h-svh" style={{ clipPath: CLIP_A }}>
          <div data-face className="h-full">
            <HeroFace />
          </div>
        </div>
        <div data-half-b aria-hidden inert className="absolute inset-0 z-10 will-change-transform motion-reduce:hidden" style={{ clipPath: CLIP_B }}>
          <div data-face className="h-full">
            <HeroFace decor />
          </div>
        </div>
        {/* Motion-reduce : la moitié A doit être entière */}
        <style>{`@media (prefers-reduced-motion: reduce){[data-half-a]{clip-path:none!important}}`}</style>

        {/* Trait de coupe rouge : longueur et angle calculés sur la taille réelle de l'écran */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden motion-reduce:hidden">
          <span
            className="absolute right-0 block h-[2px] origin-right"
            style={{ top: `${CUT.right}%`, width: "var(--cut-len, 100%)", transform: "rotate(var(--cut-angle, 0deg))" }}
          >
            <span data-cut-line className="block h-full w-full origin-right scale-x-0 bg-rouge shadow-[0_0_12px_rgba(200,16,46,0.6)]" />
          </span>
        </div>

        {/* Rasoir : SVG immédiat, 3D en surcouche quand prête */}
        <div data-rasoir className="pointer-events-none absolute inset-0 z-30 motion-reduce:hidden">
          <div
            data-rasoir-svg
            className={cn(
              "absolute left-1/2 top-[27%] w-[72vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 -rotate-12 transition-opacity duration-700 md:left-[62%] md:top-[40%] md:w-[44vw]",
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
        <p aria-hidden data-scroll-hint className="eyebrow absolute bottom-6 right-(--spacing-gutter) z-20 hidden items-center gap-3 text-acier md:flex motion-reduce:hidden" data-hero-in>
          <span className="inline-block h-8 w-px animate-pulse bg-rouge" />
          Faites défiler : la lame s&apos;ouvre
        </p>
      </div>
    </div>
  );
}
