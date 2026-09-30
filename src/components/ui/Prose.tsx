import type { ReactNode } from "react";

/** Mise en forme des pages légales. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl text-charbon/85 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:text-4xl [&_h2]:text-charbon [&_li]:mt-1.5 [&_mark]:rounded-md [&_mark]:bg-rouge/10 [&_mark]:px-1.5 [&_mark]:text-[#8f4012] [&_p]:mt-4 [&_strong]:text-charbon [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  );
}

/** Champ que le client doit compléter */
export const ACompleter = ({ children }: { children: ReactNode }) => <mark>[{children}]</mark>;
