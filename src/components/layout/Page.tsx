import { ViewTransition, type ReactNode } from "react";

/**
 * Enveloppe de page : transition « coup de lame » entre les pages
 * (View Transitions API ; sans support navigateur, la navigation reste instantanée).
 */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter="page-cut" exit="page-cut" default="none">
      <main id="contenu" tabIndex={-1} className={className}>
        {children}
      </main>
    </ViewTransition>
  );
}
