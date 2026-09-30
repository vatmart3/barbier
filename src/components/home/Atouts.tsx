/** Bandeau des atouts, sous la réservation express : quatre promesses concrètes. */
import type { ReactNode } from "react";
import { IconCalendrier, IconCarte, IconFauteuil, IconMedaille } from "@/components/ui/Icons";

const ATOUTS: { icone: ReactNode; titre: string; texte: string }[] = [
  { icone: <IconCalendrier size={34} />, titre: "Réservé en une minute", texte: "Le prochain créneau libre, en trois gestes, sans compte." },
  { icone: <IconMedaille size={34} />, titre: "Trois barbiers confirmés", texte: "De 6 à 15 ans de métier. Pas de stagiaire sur votre nuque." },
  { icone: <IconFauteuil size={34} />, titre: "Fauteuils de 1968", texte: "Serviette chaude, et une lame neuve à chaque client." },
  { icone: <IconCarte size={34} />, titre: "Paiement au salon", texte: "Carte, sans contact ou espèces. Rien à régler en ligne." },
];

export function Atouts() {
  return (
    <section aria-label="Pourquoi Dégradé" className="pb-20 md:pb-28">
      <div className="container-page">
        <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-creme/8 bg-creme/8 sm:grid-cols-2 lg:grid-cols-4">
          {ATOUTS.map((a) => (
            <li key={a.titre} className="flex gap-4 bg-charbon-2 p-6 lg:p-7">
              <span className="shrink-0 text-rouge-fonce">{a.icone}</span>
              <span>
                <span className="block text-[1.0625rem] font-medium">{a.titre}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-acier">{a.texte}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
