"use client";

/**
 * Bannière cookies sobre et conforme CNIL : « Refuser » aussi simple
 * qu'« Accepter », aucun traceur déposé avant consentement.
 * Le site de démo n'installe aucun outil tiers ; `useConsent()` permet
 * d'en conditionner un (mesure d'audience) si le client en ajoute.
 */
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "dg-consent";
const EVENT = "dg-consent-open";

type Consent = { mesure: boolean; date: string } | null;

function read(): Consent {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
let snapshot: string | null | undefined;
const getSnapshot = () => {
  if (snapshot === undefined) {
    try {
      snapshot = localStorage.getItem(KEY);
    } catch {
      snapshot = null;
    }
  }
  return snapshot;
};

function write(c: Consent) {
  try {
    if (c) localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
  snapshot = c ? JSON.stringify(c) : null;
  listeners.forEach((l) => l());
}

/** Consentement courant (null = pas encore choisi) */
export function useConsent(): Consent {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "server");
  if (raw === "server" || !raw) return null;
  return read();
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!read()) {
      const t = window.setTimeout(() => setOpen(true), 1800);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  const choose = (mesure: boolean) => {
    write({ mesure, date: new Date().toISOString() });
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <section
          role="region"
          aria-label="Gestion des cookies"
          className="fixed inset-x-3 bottom-[calc(var(--mobile-bar-h)+env(safe-area-inset-bottom)+0.75rem)] z-[70] max-w-md border border-charbon/15 bg-creme p-5 text-charbon shadow-card animate-[monte-doux_450ms_var(--ease-out-cut)_both] sm:left-auto sm:right-6 lg:bottom-6"
        >
          <h2 className="font-display text-2xl leading-none">Cookies</h2>
          <p className="mt-3 text-sm text-charbon/80">
            Pas de pub, pas de pistage. Seule une mesure d&apos;audience anonyme peut être activée, si vous l&apos;acceptez.{" "}
            <Link href="/confidentialite" className="underline underline-offset-4 hover:text-rouge-fonce">
              En savoir plus
            </Link>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => choose(false)}
              className="min-h-11 border border-charbon px-4 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-charbon hover:text-creme"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="min-h-11 border border-charbon px-4 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-charbon hover:text-creme"
            >
              Accepter
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function GererCookies() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENT))} className="inline-flex min-h-11 items-center hover:text-creme">
      Gérer les cookies
    </button>
  );
}
