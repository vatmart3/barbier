"use client";

/**
 * FAQ en accordéon : <details>/<summary> natifs (fonctionne sans JS, accessible),
 * ouverture animée en hauteur, un trait de tondeuse qui se trace à l'ouverture.
 */
import { useRef } from "react";
import type { QuestionFaq } from "@/data/faq";

function Item({ q, i }: { q: QuestionFaq; i: number }) {
  const ref = useRef<HTMLDetailsElement>(null);

  const onClick = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const body = el.querySelector<HTMLElement>("[data-corps]");
    if (!body) return;
    e.preventDefault();
    if (el.open) {
      const a = body.animate([{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 320, easing: "cubic-bezier(0.7,0,0.2,1)" });
      a.onfinish = () => (el.open = false);
    } else {
      el.open = true;
      const h = body.offsetHeight;
      body.animate([{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" });
    }
  };

  return (
    <details ref={ref} className="group border-b border-charbon/15">
      <summary
        onClick={onClick}
        className="flex min-h-16 cursor-pointer list-none items-start gap-5 py-5 [&::-webkit-details-marker]:hidden"
      >
        <span className="tabular pt-1 text-xs text-acier-fonce">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="flex-1 font-display text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] normal-case leading-tight">{q.q}</h3>
        <span aria-hidden className="relative mt-3 size-4 shrink-0">
          <span className="absolute inset-x-0 top-1/2 h-px bg-charbon" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-charbon transition-transform duration-300 group-open:scale-y-0" />
        </span>
      </summary>
      <div data-corps className="overflow-hidden">
        <div className="pb-6 pl-9 pr-8">
          <span aria-hidden className="mb-4 block h-px w-12 origin-left scale-x-0 bg-rouge transition-transform delay-150 duration-700 ease-(--ease-blade) group-open:scale-x-100" />
          <p className="max-w-2xl text-charbon/85">{q.r}</p>
        </div>
      </div>
    </details>
  );
}

export function Faq({ items }: { items: QuestionFaq[] }) {
  return (
    <div className="border-t border-charbon/15">
      {items.map((q, i) => (
        <Item key={q.q} q={q} i={i} />
      ))}
    </div>
  );
}
