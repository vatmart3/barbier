"use client";

/** « Une question qui n'est pas dans la FAQ ? » — formulaire court, réponse sous X h. */
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { contactSchema, type ContactPayload } from "@/lib/schemas";
import { site } from "@/config/site";
import { Champ, inputCls } from "@/components/reservation/Champ";
import { IconCheck, IconFleche } from "@/components/ui/Icons";
import { ease } from "@/design/motion";
import { cn } from "@/lib/cn";

export function Question() {
  const [etat, setEtat] = useState<"form" | "ok">("form");
  const [erreur, setErreur] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { nom: "", contact: "", message: "", consentement: false, site: "" },
  });

  const envoyer = handleSubmit(async (v) => {
    setErreur(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      const json = (await res.json()) as { ok: boolean; erreur?: string; demo?: boolean };
      if (!res.ok || !json.ok) throw new Error(json.erreur ?? "Erreur inconnue.");
      setDemo(!!json.demo);
      setEtat("ok");
      reset();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Impossible d'envoyer.");
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {etat === "ok" ? (
        <motion.div
          key="ok"
          role="status"
          className="border-2 border-charbon p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: ease.outCut }}
        >
          <span className="grid size-12 place-items-center bg-charbon text-creme">
            <IconCheck size={24} />
          </span>
          <p className="mt-6 font-display text-4xl leading-none">Question reçue.</p>
          <p className="mt-3 text-charbon/80">
            On vous répond sous {site.callbackHours} h pendant les horaires d&apos;ouverture. Si c&apos;est urgent : {site.phone.display}.
          </p>
          {demo ? <p className="mt-3 text-xs text-acier-fonce">Site de démonstration : le message n&apos;a pas été transmis.</p> : null}
          <button type="button" onClick={() => setEtat("form")} className="mt-6 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
            Poser une autre question
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={envoyer} noValidate className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Champ id="q-nom" label="Nom" tone="light" erreur={errors.nom?.message}>
              <input id="q-nom" autoComplete="name" className={inputCls("light", !!errors.nom)} aria-invalid={!!errors.nom} aria-describedby={errors.nom ? "q-nom-erreur" : undefined} {...register("nom")} />
            </Champ>
            <Champ id="q-contact" label="Téléphone ou e-mail" tone="light" erreur={errors.contact?.message}>
              <input
                id="q-contact"
                autoComplete="email"
                className={inputCls("light", !!errors.contact)}
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? "q-contact-erreur" : undefined}
                {...register("contact")}
              />
            </Champ>
          </div>
          <Champ id="q-message" label="Votre question" tone="light" erreur={errors.message?.message}>
            <textarea
              id="q-message"
              rows={4}
              placeholder="Vous coupez les cheveux crépus ? Je peux venir avec mon fils de 5 ans ?"
              className={cn(inputCls("light", !!errors.message), "resize-y")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "q-message-erreur" : undefined}
              {...register("message")}
            />
          </Champ>
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="q-site">Ne pas remplir</label>
            <input id="q-site" tabIndex={-1} autoComplete="off" {...register("site")} />
          </div>
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--color-charbon)]" aria-invalid={!!errors.consentement} {...register("consentement")} />
              <span className="text-charbon/80">J&apos;accepte que ces informations servent uniquement à me répondre.</span>
            </label>
            {errors.consentement ? (
              <p role="alert" className="mt-1.5 text-sm text-rouge-fonce">
                {errors.consentement.message}
              </p>
            ) : null}
          </div>
          {erreur ? (
            <p role="alert" className="border-l-2 border-rouge-fonce bg-rouge/10 px-3 py-2 text-sm text-rouge-fonce">
              {erreur}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex min-h-14 items-center gap-4 bg-charbon px-6 text-sm font-semibold uppercase tracking-wide text-creme transition-colors hover:bg-rouge-fonce disabled:cursor-wait disabled:opacity-80"
          >
            {isSubmitting ? "Envoi…" : "Envoyer la question"}
            <IconFleche size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
