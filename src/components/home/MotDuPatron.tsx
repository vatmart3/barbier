/**
 * Le mot de Karim : la maison racontée à la première personne, signée à la
 * main. Texte de démonstration, à réécrire avec le vrai patron.
 */
import { IllustrationSalon } from "@/components/illustrations/IllustrationSalon";
import { Etiquette } from "@/components/ui/Etiquette";
import { Lignes } from "@/components/ui/Lignes";

export function MotDuPatron() {
  return (
    <section aria-labelledby="mot-titre" className="clair bg-charbon-2 py-(--spacing-section) text-creme">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <figure data-reveal="monte">
          <IllustrationSalon
            title="Le salon Dégradé : trois fauteuils face aux miroirs en arche, suspensions cuivre, et le chat qui dort par terre"
            className="h-auto w-full rounded-[1.75rem]"
          />
        </figure>

        <div className="max-w-xl">
          <Etiquette>Le mot de la maison</Etiquette>
          <Lignes id="mot-titre" className="mt-4 text-d1" lines={["Un salon de quartier.", <span key="b" className="text-acier">Juste bien tenu.</span>]} />
          <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-creme-2">
            <p>
              J&apos;ai ouvert Dégradé en 2019, dans l&apos;ancienne cordonnerie de la Grand&apos;Rue. J&apos;ai gardé l&apos;établi : il sert de
              comptoir, et il sent encore un peu le cuir.
            </p>
            <p>
              Ici, on ne vous vend pas de cire dont vous n&apos;avez pas besoin. On vous dit quel sabot acheter pour tenir entre deux passages, et on
              vous revoit quand même.
            </p>
            <p>Si une patte vous gêne dans la semaine, repassez. On la reprend, sans rendez-vous et sans rien payer.</p>
          </div>
          <div className="mt-8 flex items-end gap-4">
            <p className="font-script -rotate-3 text-[2.75rem] leading-none text-rouge-fonce">Karim</p>
            <p className="pb-1 text-sm text-acier">fondateur, fauteuil n° 1</p>
          </div>
          <p className="mt-6 text-sm text-acier">P.-S. Le chat s&apos;appelle Sabot. Il ne se laisse pas couper.</p>
        </div>
      </div>
    </section>
  );
}
