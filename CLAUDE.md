# CLAUDE.md

This file provides guidance to Claude Code when working in this workspace.

---

## What This Is

Ce workspace est le Jarvis personnel d'Edgar. Depuis le 15 octobre 2026, il est dédié à la relance de son **agence de création de sites internet**.

**Ce fichier (CLAUDE.md) est la fondation.** Il est automatiquement chargé au début de chaque session. Gardez-le à jour, c'est la source de vérité unique sur la façon dont Claude doit comprendre et opérer dans ce workspace.

Le workspace a servi d'août à septembre 2026 à un projet ecommerce, aujourd'hui arrêté et archivé dans `archive/ecom/`. Le dossier s'appelait alors `jarvis-ecom`, il a été renommé `jarvis-kleak` le 18/10/2026.

---

## Who I Am

Je m'appelle Edgar et je vis à Cergy. Mon profil : marketing, automatisation (n8n, Make) et données.

**La situation au 18 octobre 2026 :**

- **Je relance mon agence de création de sites internet, Kleak Agency**, auparavant spécialisée Framer. Objectif : faire rentrer du cash rapidement.
- **Kleak reste une agence Framer** (décision finale du 18/10, après un test où Claude Code a construit des sites Framer complets via `@framer/agent`). Webflow est abandonné.
- **Exigence qualité :** un site doit sortir parfait en 2 ou 3 allers-retours maximum. On valide la direction ensemble en amont (structure, ambiance, photos, textes) avant de construire, et chaque site passe `livrables/process/checklist-qualite-site.md`, performance comprise.
- **Acquisition par Meta Ads uniquement**, aucun ancien client ni réseau à relancer.
- **Orbikal**, mon SaaS de dashboard marketing, est **en pause** : plus de développement, l'existant reste en ligne. Il peut servir l'agence comme reporting mensuel inclus dans la maintenance.
- **Le projet ecommerce avec Forqan est arrêté.**

Le détail est dans `context/CONTEXT.md`.

---

## How You Should Help Me

Tu es mon assistant personnel pour l'agence : positionnement et offre, prospection, production des sites, propositions commerciales, devis, suivi client, et pilotage des chiffres.

- **Communique en français** systématiquement, sauf si je te demande explicitement une autre langue
- **Sois direct et efficace**, pas de blabla inutile, pas de phrases d'introduction creuses
- **Pose des questions de clarification** avant d'exécuter quand le contexte n'est pas clair, plutôt que de deviner
- **Sois honnête**, même quand la vérité n'est pas agréable. Pas de flagornerie ni de validation systématique
- **Pour les décisions importantes**, donne-moi ton analyse avec les pour et les contre plutôt que de trancher à ma place
- **Adapte ton niveau de détail** selon la complexité de la demande. Les questions simples méritent des réponses courtes
- **N'utilise pas de tirets longs** (em dashes) dans tes réponses. Préfère les virgules ou les points

---

## Règles spécifiques à l'agence

- **Raisonner en chiffres.** Une offre se juge sur son prix, le temps réellement passé, le taux journalier effectif qui en résulte, et la part récurrente (maintenance, reporting). Si les chiffres manquent, demande-les ou pose une hypothèse explicite.
- **Le cash avant tout.** L'objectif déclaré est de faire rentrer de l'argent vite. Privilégie ce qui signe un contrat dans les semaines qui viennent (réseau, anciens clients, offre packagée) plutôt que ce qui construit une marque à long terme.
- **Ne jamais inventer une donnée de marché.** Pas de prix moyens, de taux de conversion de prospection ou de volumes sortis de nulle part. Soit tu as une source, soit tu annonces clairement que c'est une estimation.
- **Protéger le temps d'Edgar.** Le client payant passe toujours avant le reste. Signale quand une demande client sort du périmètre vendu.
- **Penser conformité.** Mentions légales, RGPD et cookies sur les sites livrés, CGV de prestation, facturation électronique. Un site de démonstration sur une entreprise fictive doit l'afficher clairement.

---

## Critical Instruction: Maintain My Context

**Quand Claude détecte un changement important dans mon activité ou mes projets, Claude DOIT proposer de mettre à jour les fichiers de contexte concernés.**

Exemples de changements à détecter :
- Choix de l'outil (Framer ou Webflow)
- Définition de l'offre ou des prix
- Premier client signé, premier encaissement
- Nouveau client, nouveau partenaire
- Décision sur Orbikal (reprise, arrêt définitif)
- Changement d'objectif, de statut juridique ou de temps disponible
- Changement personnel significatif

Quand je raconte un changement de ce type, Claude doit dire :

> "Je remarque que tu m'as parlé de [changement]. Veux-tu que je mette à jour [fichier concerné] pour qu'il reflète cette information ?"

Une fois que je confirme, Claude met à jour le fichier en question et ajoute une entrée dans `context/HISTORY.md` pour tracer le changement.

---

## Workspace Structure

```
.
├── CLAUDE.md                    # Ce fichier, chargé à chaque session
├── .env                         # Secrets et clés API (jamais commité)
├── .env.example                 # Template public des variables
├── context/
│   ├── CONTEXT.md               # Qui je suis, où en est l'agence, mes objectifs
│   ├── HISTORY.md               # Journal évolutif de mes sessions
│   └── import/                  # Documents externes à analyser
├── livrables/                   # Livrables produits par Claude, un sous-dossier par sujet
│   ├── hub-agence/              # Hub Agence, dépôt git indépendant, outil interne de l'agence
│   └── hub/                     # Hub Ecom, dépôt git indépendant, inutilisé
├── archive/
│   └── ecom/                    # Projet ecommerce arrêté (contexte, agents, skills, livrables)
└── .claude/
    ├── commands/                # /prime, /update, /morning, /commit, /agent
    ├── agents/                  # Agents spécialisés créés via /agent (vide pour l'instant)
    └── skills/                  # Skills (vide pour l'instant)
```

Les sous-dossiers de `livrables/` se créent au besoin (par exemple `offre/`, `prospection/`, `clients/`, `demos/`).

**`archive/` est en lecture seule.** On n'y travaille plus. On peut y piocher une référence, jamais en tirer une décision active.

---

## Hub Ecom (inutilisé)

`livrables/hub/` contient le cockpit construit pour l'ecom (Next.js, Supabase, en ligne sur https://hub-ecom-phi.vercel.app). Il n'est plus utilisé mais reste en place. Si on y touche :

- **C'est un dépôt git indépendant** (`github.com/Beepurst/hub-ecom`), exclu du `.gitignore` du workspace. Ne jamais le commiter depuis la racine.
- **Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne**, ils partagent le même `.next`.
- Les pièges connus sont dans `livrables/hub/docs-reprise/05-pieges.md`.

---

## Hub Agence

`livrables/hub-agence/` est l'outil interne de l'agence : briefs, bibliothèque de références, CRM (pipeline des leads Meta, relances, rendez-vous Cal.com), puis devis et factures. Copié de l'Orbikal Hub le 15/10/2026. Spec d'origine : `docs/superpowers/specs/2026-10-15-hub-agence-design.md`.

- **En production** sur https://hub-agence-kleak.vercel.app, protégé par mot de passe. Projet Vercel `hub-agence-kleak`, chaque push sur `main` déploie en production : travailler sur une branche et fusionner après validation d'Edgar.
- **Dépôt git indépendant** `Beepurst/hub-agence-kleak`, exclu du `.gitignore` du workspace. Ne jamais le commiter depuis la racine.
- **Apparence** (refonte du 18-19/10) :
  - toutes les couleurs vivent dans `src/app/theme.css`, `scripts/test-couleurs.ts` et `scripts/test-contraste.ts` le vérifient ;
  - la navigation est décrite une seule fois dans `src/lib/navigation.ts` : une rubrique ou un sous-onglet, c'est une entrée dans ce fichier ;
  - **refonte « couleur » façon admin Shopify** (spec `docs/superpowers/specs/2026-10-21-refonte-couleur-design.md`) : lot 1 en production le 21/10 (cadre clair, échelle des titres `--t-section`/`--t-bloc`/`--t-libelle`, accueil avec bandeau de chiffres, pilules et trois cartes en dégradé). Composants `BandeauChiffres`, `CarteAvant`, `MiniCourbe` (SVG, sans bibliothèque) dans `src/components/ui/`, calculs purs dans `src/lib/accueil/`. La couleur va aux chiffres et aux cartes, jamais aux listes. Halo et verre neutralisés en CSS (classes encore posées dans les pages). **Lot 2 à faire** : bandeau et cartes sur Pipeline, Ads, Finance, Analytics, SEO ;
  - dépense pub du mois : Meta fait foi dès qu'il est connecté (la saisie manuelle n'est plus qu'un repli).
- **Notifications push** (23/10) : clés VAPID dans `.env.local` et Vercel (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`), ne jamais les régénérer (les abonnements tomberaient). Mac et iPhone abonnés depuis Réglages (sur iPhone, depuis l'icône de l'écran d'accueil). Envoi par `sendPush` (`src/lib/push.ts`) : nouveau lead (`/api/intake/sheet`), nouveau RDV, alertes Ads.
- **Onglet Finance** (spec `docs/superpowers/specs/2026-10-19-finance-design.md`) : lot 1 Stripe seul en production depuis le 19/10, clé Stripe Kleak restreinte en lecture seule (`STRIPE_SECRET_KEY`, posée dans Vercel), cron quotidien à 5 h UTC. **Lot 2 en production depuis le 20/10** (spec `docs/superpowers/specs/2026-10-20-finance-lot-2-revolut-csv-design.md`) : compte **Revolut Pro** (pas Revolut Business, pas d'API) lu par import du relevé CSV, et dépenses Meta synchronisées par le même cron (`HUB_META_FINANCE_ACCESS_TOKEN`, `HUB_META_ADS_ACCOUNT_ID`, jeton aux permissions larges gardé par décision d'Edgar ; `src/lib/ads/meta-graph.ts` est une copie identique de celle du module Ads, à garder identique).
- **Onglet Analytics** (spec `docs/superpowers/specs/2026-10-19-analytics-ga4-design.md`, en production le 20/10) : GA4 de kleakagency.fr (propriété `433476352`, compte de service `hub-ga4@hub-agence-kleak.iam.gserviceaccount.com` en lecture seule), funnel du site et funnel des pubs Meta séparés, pages d'arrivée, sources et campagnes, évolution avec repères (table `analytics_reperes`). Le trafic des aperçus `*.framer.app` est exclu. La marche « page de réservation vue » se règle dans `RESERVATION` (`src/lib/analytics/ga4-page.ts`), à compléter quand le site passera de Calendly à Cal.com avec `canal=site` dans le lien : une réservation Cal.com d'une personne inconnue crée alors un compte `source = 'site'`.
- **Ventes** (spec `docs/superpowers/specs/2026-10-20-ventes-paiements-design.md`, en production le 20/10) : une vente signée par compte (formule, paiement en une fois ou en 6 fois, maintenance), échéancier rapproché des factures Stripe payées sur la fiche client et dans Finance (section « Ventes signées », prévision sur 6 mois). Le catalogue de l'offre vit dans `src/lib/offre.ts`. Les remboursements Stripe n'ont pas de client : ils sont signalés, pas rattachés. Choisir le client Stripe sur chaque vente.
- **Brief de production** (spec `docs/superpowers/specs/2026-10-22-brief-production-design.md`, en production le 23/10) : la page d'un brief suit 4 étapes (Questionnaire, Direction, Maquette et textes, Construction), chacune validée avant la suivante, et produit à la fin le prompt de construction Framer. Route réservée à l'agent `GET/POST /api/agent/briefs` (en-tête `x-kleak-secret`, secret `BRIEF_AGENT_SECRET` du `.env`, posé dans Vercel).
- **Devis** (spec `docs/superpowers/specs/2026-10-21-devis-automatiques-design.md`, plan du même jour, **en construction** sur la branche `devis`, worktree `livrables/hub-agence-devis`) : transcription du RDV découverte (Cal Video, ou collée), résumé Groq gratuit avec points d'attention, devis prérempli avec PDF et CGV, brouillon dans `kleakagency@gmail.com`, relances email automatiques (seul envoi sans clic d'Edgar), devis signé → vente → factures Stripe par une seconde clé restreinte `STRIPE_WRITE_KEY`. Le hub ne lit jamais la boîte Gmail. Maintenance sans engagement dans le hub (fin de `ENGAGEMENT_MOIS`).
- **Centres d'intérêt** (spec `docs/superpowers/specs/2026-10-22-centres-interet-design.md`, en production le 22/10) : à la création de campagne, bloc « Centres d'intérêt » (liste du métier, recherche libre, audience estimée par Meta), envoyés avec l'ensemble en pause (`flexible_spec`, logique « au moins un »). Listes par métier dans la table `listes_interets` (SQL `supabase/listes-interets.sql`), modifiables dans Ads > Réglages ; ce sont des mots cherchés chez Meta, beaucoup de propositions sont hors sujet, rien n'est coché d'office. Sans centre coché, le payload est inchangé.
- **Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.**
- **Worktrees** : Turbopack refuse un `node_modules` en lien symbolique, faire `npm ci` dans le worktree. En local, le middleware laisse tout passer (`NODE_ENV=development`).
- **Vitesse** (21/10) : les fonctions tournent à Dublin (`"regions": ["dub1"]` dans `vercel.json`), à côté de Supabase (eu-west-1). Une page déjà vue est gardée 30 s dans le navigateur (`staleTimes` dans `next.config.ts`) : tout composant client qui enregistre une donnée affichée par une page serveur doit appeler `router.refresh()`.
- Variables Vercel posées par Edgar via des scripts qui lisent `.env.local` sans rien afficher. La CLI `vercel env add` doit recevoir `--value` et `--non-interactive`.

---

## Commands

- **/prime** : démarrer une session avec le contexte complet
- **/update** : mettre à jour les fichiers de contexte après un changement
- **/morning** : démarrer la journée avec une veille courte et le focus du jour
- **/commit** : committer le travail en cours avec un message propre
- **/agent** : créer un agent spécialisé dans `.claude/agents/`, à documenter ici en une ligne
- **/demain** : préparer le soir la to-do du lendemain et l'écrire dans le Hub Agence après validation (utilise `HUB_URL` et `TODO_AGENT_SECRET` du `.env`)
- **/site** : démarrer léger une session de construction Framer (`/site <client ou test>`), sans lire le contexte de l'agence, à la place de `/prime`

---

## Agents et skills

- **createur-creas** : produit les créas Meta Ads (HTML rendu en PNG dans `livrables/creas-meta/`) en deux temps, proposer 3 créas sur une planche puis finaliser post et story (les textes d'annonce sont à `media-buyer`). Déclencheur : « fais-moi des créas », « nouvelle série de pubs », « je garde la A et la C ».
- **media-buyer** : media buyer Meta Ads, recommande et n'agit jamais dans Meta. Prépare les campagnes, écrit et dépose les textes d'annonce dans le Hub (entrées `/api/agent/ads`, secret `ADS_AGENT_SECRET` du `.env`), fait les bilans et tient `livrables/media-buying/` (règles, journal). Déclencheur : « fais le bilan », « prépare la prochaine campagne », « j'ai reçu une alerte », « il me faut les textes pour Meta ».
- **bibliothecaire** : agent Sonnet qui ajoute une section d'un site à la bibliothèque du hub (capture, fiche technique courte) et la dépose directement, ou retravaille les fiches existantes (mode retravailler : titre, capture et fiche refaits, note et épingles gardées), ou propose à réception d'un brief 4 ou 5 inspirations du Framer Marketplace du même secteur (mode inspirer : planche `inspirations.jpg` dans `livrables/clients/<client>/`, rien déposé). Déclencheur : « ajoute le hero de … », « range cette section », « retravaille la bibliothèque », « complète les fiches », « retravaille la fiche … », « trouve des inspirations pour … ».
- **redacteur-seo** : rédige un article par semaine pour le blog de kleakagency.fr (cible PME, national, pas les artisans) et fait le bilan mensuel Search Console. Il ne publie jamais : la publication se fait dans le CMS Framer par la session principale, après validation d'Edgar. Stratégie, sujets, articles et suivi dans `livrables/seo/`. Déclencheur : « écris le prochain article », « fais le bilan SEO », « trouve-moi des sujets ».

Les 15 agents et 4 skills de l'ecom sont dans `archive/ecom/.claude/`. Certains pourraient être adaptés à l'agence (`juriste-conformite`, `espion-concurrence`, `auditeur-conversion`), à condition de les réécrire avant de les remettre dans `.claude/`.

---

## Notes importantes

- Les fichiers de contexte doivent rester synthétiques mais suffisants. Si une section devient trop longue, créez un fichier dédié dans `context/import/`
- Pour les documents externes (briefs clients, devis, exports), utilisez `context/import/`
- Ne modifiez pas manuellement HISTORY.md, laissez Claude s'en charger via `/update`
- Les clés API vont dans `.env`, jamais dans un fichier commité
