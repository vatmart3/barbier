# DÉGRADÉ — Barbier, Sète

Site vitrine de démonstration — portfolio **MJAGENCY** (site 02/10).
Marque fictive traitée comme un vrai client : réservation fonctionnelle, configurateur de coupe, galerie de vraies photos, SEO local complet.

> Direction visuelle : **vert bouteille profond, noyer, crème et or**. Hero en photo plein cadre du salon (lumineuse, dégradé sombre seulement derrière le texte), sections sombres et sections crème en alternance, grands titres serif fins en deux tons, sur-titres en capitales espacées, boutons or, panneaux et cartes arrondis. Titres en **Fraunces « SOFT »** (empattements ronds), texte en **Figtree**, répliques et signature écrites à la main en **Caveat**. Le salon et la devanture sont **dessinés** de nuit (aplats arrondis, avec Sabot, le chat de la maison).
>
> Concept : **« la chaise »**. On réserve dès l'accueil (prestation, barbier, date et heure, récapitulatif côte à côte, pré-remplis avec le prochain créneau réel). Le reste est sobre : photos, typographie, peu d'effets.

---

## Démarrer

Prérequis : Node.js ≥ 20.9.

```bash
npm install
npm run dev          # http://localhost:3000
```

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | Build de production (TypeScript strict, 0 warning) |
| `npm start` | Sert le build |
| `npm run lint` | ESLint (config Next, règles React Compiler) |
| `npm run typecheck` | TypeScript sans émission |
| `npm run assets` | Régénère les favicons et icônes PWA |
| `npm run test:e2e` | Parcours Playwright (réservation, réservation express, interactions, console) sur un serveur lancé en :3000 |

Les tests e2e utilisent Playwright ; en local, installez d'abord son navigateur : `npx playwright install chromium`.

## Déployer sur Vercel

1. Poussez le dépôt sur GitHub, puis **Add New → Project** sur vercel.com et importez-le. Aucun réglage : Vercel détecte Next.js.
2. Dans **Settings → Environment Variables**, renseignez (voir `.env.example`) :
   - `NEXT_PUBLIC_SITE_URL` : l'URL définitive (`https://www.votre-domaine.fr`) — canonical, sitemap, Open Graph ;
   - `RESEND_API_KEY`, `RESEND_FROM`, `SALON_EMAIL` pour recevoir réellement les réservations et questions.
3. Redéployez. Sans clé Resend, le site tourne en **mode démo** : formulaires validés, écrans de succès, messages simplement journalisés côté serveur (logs Vercel).

## Modifier le contenu

**Tout ce qui est propre au client est dans deux endroits :**

| Fichier | Contenu |
|---|---|
| `src/config/site.ts` | Nom, adresse, téléphone, e-mail (NAP), coordonnées GPS, horaires, fermetures exceptionnelles, accès/parking, zones desservies, réseaux, mots-clés SEO |
| `src/data/prestations.ts` | Coupes, prix, durées, entretien conseillé, options du configurateur, formule Coupe + barbe |
| `src/data/barbiers.ts` | L'équipe : textes, jours travaillés, horaires particuliers, paramètres du portrait gravé |
| `src/data/planning.ts` | Réglages de réservation (pas, délai minimum, horizon), pauses, habitués, absences |
| `src/data/avis.ts` | **Avis de démonstration à remplacer** par de vrais avis (avec l'accord des clients) + chiffres |
| `src/data/faq.ts` | Questions fréquentes (alimente aussi le JSON-LD `FAQPage`) |
| `src/data/galerie.ts` | Galerie « Au fauteuil » : photos, légendes, crédits |

Couleurs et typographie : `src/design/tokens.css` (rôles des couleurs, polices, arrondis) et `src/app/globals.css` (portées `.salon` gris clair, `.nuit` hero noir, `.papier` cartes blanches).

Les prix modifiés se répercutent partout : pages, configurateur, réservation, e-mails, JSON-LD `Service`/`Offer`.

### Images

- Photos : `public/images/salon-hero.jpg` (hero, mot de la maison, page L'équipe) et `public/images/galerie/*` ; remplacez-les par celles du salon en gardant les mêmes noms. Formats et crédits dans `ASSETS.md`.
- Favicons : modifiez `src/app/icon.svg` puis `npm run assets`.

### Brancher un vrai agenda

Le planning de démo est déterministe (habitués + remplissage simulé selon la date). Pour un vrai agenda, remplacez `getRendezVous()` dans `src/lib/slots.ts` (appel à une base, Google Agenda, Planity…) : l'affichage **et** la validation serveur de `/api/reservation` utilisent la même fonction.

## Architecture

```
src/
  app/                 routes (App Router), API, sitemap, robots, manifest, OG images
  config/site.ts       identité du salon (NAP, horaires…)
  data/                données métier
  design/              tokens.css (design system) + motion.ts (easings/durées JS)
  lib/                 heure de Paris, moteur de créneaux, tarifs, .ics, schémas zod, SEO, OG
  components/
    layout/            header, pastille « prochain créneau », menu, CTA mobile, footer, cookies, Lenis, révélateur
    illustrations/     profil gravé paramétrique (configurateur), carte de Sète
    home/ coupes/ equipe/ reservation/ infos/ ui/
scripts/               génération d'assets + contrôles Playwright
```

**Stack** : Next.js 16 (App Router, statique), React 19, TypeScript strict, Tailwind CSS 4 (tokens en variables CSS), next/font (Fraunces en instance locale de 33 Ko, Figtree, Caveat non préchargée), Motion (configurateur, tunnel), Lenis, react-hook-form + zod (`zod/mini`), Resend.

**Choix de performance** : Motion n'est chargé que là où il sert (configurateur, réservation) ; les révélations au scroll sont en CSS via un seul `IntersectionObserver` ; aucune 3D ni animation pilotée au scroll (plus rapide, plus fiable) ; la photo du hero est préchargée en priorité haute.

## Checklist qualité (mesurée sur le build de production)

- `npm run build` : 0 erreur, 0 warning — `npm run lint` et `tsc` propres.
- Lighthouse mobile (simulation par défaut) : Accessibilité **100**, Bonnes pratiques **100**, SEO **100** ; Performance **85 à 96** (accueil 92, pages 85–96) ; LCP 2,5 à 3,3 s, CLS ≤ 0,01.
- Captures contrôlées à 320, 375, 768, 1024, 1280, 1440 et 1920 px ; `prefers-reduced-motion` testé (aucune erreur d'hydratation).

## Mentions

Pages `/mentions-legales` et `/confidentialite` : champs à compléter surlignés `[entre crochets]`. Bannière cookies conforme (refus aussi simple que l'acceptation, aucun traceur par défaut) ; `useConsent()` (`src/components/layout/CookieBanner.tsx`) permet de conditionner une mesure d'audience.

---

Site concept — design & développement [MJAGENCY](https://mjagency.eu), Sète.
