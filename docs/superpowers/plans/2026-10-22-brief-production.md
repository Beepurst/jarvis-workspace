# Brief de production : plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** la fiche brief du Hub Agence devient le dossier de production du client. Elle a 4 étapes (Questionnaire, Direction, Maquette et textes, Construction), et l'étape Construction produit seule le prompt complet pour Framer.

**Architecture :**
- La logique est en fonctions pures dans `src/lib/`, testées avec `node:test` :
  - la définition du questionnaire ;
  - les règles des étapes ;
  - la construction du prompt.
- Les routes API et la fiche (client React) ne font que lire, appeler ces fonctions et écrire dans Supabase.
- Le brief gagne trois colonnes : `version`, `formule` et `production` (jsonb : étapes, chemins, captures, historique).

**Tech Stack :** Next.js 15 (App Router), React 19, Supabase (Postgres et Storage), TypeScript, tests `node --test` (voir `scripts/test-*.ts`).

**Spec :** `docs/superpowers/specs/2026-10-22-brief-production-design.md` (à lire en entier avant de commencer).

**Dépôt :** `livrables/hub-agence/`, dépôt git indépendant `Beepurst/hub-agence-kleak`.
- Travailler sur une branche `brief-production` ; ne jamais committer depuis la racine du workspace.
- Fusion dans `main` (donc mise en production) seulement après validation d'Edgar.

## Global Constraints

- Textes de l'interface en français, sans tiret long.
- Toutes les couleurs dans `src/app/theme.css` ; aucune couleur en dur dans les composants.
- Tout composant client qui enregistre une donnée affichée par une page serveur appelle `router.refresh()`.
- Ne jamais lancer `npm run build` pendant qu'un serveur de développement tourne.
- Les clés des réponses sont celles de `livrables/process/questionnaire-cadrage.md`, plus `tel_public` et `sections_souhaitees`. Ce sont elles que la future page publique client utilisera.
- Formules du questionnaire : `one_page`, `essentiel`, `pro`. `sur_mesure` (type `Formule` de `src/lib/offre.ts`) suit le Pro.
- Un champ vide n'apparaît jamais dans un prompt (« non renseigné » est interdit), comme dans `bibliotheque-prompt.ts`.
- Rien n'est supprimé en base : les anciens briefs gardent leurs 10 champs.
- Le prompt pointe vers des chemins absolus sous `/Users/ed/Desktop/jarvis-kleak/`.
- L'entrée réservée est protégée par l'en-tête `x-kleak-secret` et le secret `BRIEF_AGENT_SECRET`. Elle suit le modèle de `src/app/api/agent/todo/route.ts` (sous `api/agent`, déjà exempté par `src/middleware.ts`).
- SQL : Edgar exécute lui-même les migrations dans Supabase. **Recopier le SQL complet dans la conversation** au moment de lui demander.

## Review Focus

1. **Enregistrer le questionnaire d'un ancien brief.** Les 10 anciens champs doivent survivre : aucune clé inconnue n'est effacée. À tester dans la tâche 1 (`fusionnerReponses`).
2. **Rouvrir la Direction alors que la Maquette est validée.** La Maquette passe « à revalider » et le prompt devient indisponible. À tester dans la tâche 2.
3. **Contenus « plus tard » encore absents à la construction.** Le prompt part quand même et les liste avec leur repli. À tester dans la tâche 3.
4. **Pas de vente signée, formule non choisie.** La fiche demande la formule avant d'afficher le questionnaire ; le prompt n'est jamais construit sans formule. À tester dans la tâche 3 (formule `null`).
5. **Deux validations en même temps** (bouton et Claude). L'API relit la ligne et applique la règle sur l'état lu, pas sur celui du navigateur. Vérifié à la revue de la tâche 4.

---

### Task 1 : Définition du questionnaire

**Files :**
- Create : `src/lib/questionnaire.ts`
- Create : `scripts/test-questionnaire.ts`
- Modify : `livrables/process/questionnaire-cadrage.md` (racine du workspace, commit séparé à la racine)

**Interfaces :**
- Produces :
  - `type FormuleQ = "one_page" | "essentiel" | "pro"` ;
  - `formuleQuestionnaire(f: Formule | null): FormuleQ | null` (`sur_mesure` → `pro`) ;
  - `type TypeQuestion = "texte" | "texte_long" | "email" | "tel" | "url" | "choix" | "choix_multiple" | "choix_image" | "liste" | "case" | "fichiers"` ;
  - `type EtatFichier = "recu" | "manquant" | "plus_tard" | "sans_objet"` ;
  - `type ValeurReponse = string | string[] | boolean | Record<string, string>[] | EtatFichier` ;
  - `type Reponses = Record<string, ValeurReponse>` ;
  - `interface Question { cle; label; type: TypeQuestion; formules: FormuleQ[]; obligatoire: boolean; plusTardPossible: boolean; condition?: { cle: string; egal: string }; options?: string[]; aide?: string; colonnes?: string[] }` ;
  - `interface Partie { titre: string; questions: Question[] }` ;
  - `QUESTIONNAIRE: Partie[]` ;
  - `questionsPour(f: FormuleQ, r: Reponses): Question[]` (filtre par formule, puis par condition) ;
  - `progression(f: FormuleQ, r: Reponses): { obligatoires: number; remplies: number; manquantes: string[]; plusTard: string[] }` ;
  - `fusionnerReponses(existant: unknown, maj: unknown): Reponses` (garde toutes les clés existantes, y compris inconnues ; écrase les clés envoyées ; une valeur vide supprime seulement une clé du questionnaire) ;
  - `CONTENUS_REPLI: Record<string, string>` (clé fichiers ou contenu → texte de repli).

- [ ] **Step 1 : écrire les tests** dans `scripts/test-questionnaire.ts` :
  - `questionsPour("one_page", {})` contient `tel_public` et `sections_souhaitees`, et ne contient ni `pages`, ni `ambiance`, ni `histoire`, ni `concurrent` ;
  - `questionsPour("pro", {})` contient `pages`, `ambiance`, `histoire` et ne contient pas `sections_souhaitees` ;
  - `validateur_nom` n'apparaît que si `validateur` vaut `"Une autre personne"` ; `domaine` que si `domaine_statut` vaut `"J'en ai déjà un"` ; `couleurs_codes` que si `couleurs_source` vaut `"J'ai une charte ou des couleurs imposées"` ;
  - `progression("essentiel", { logo: "plus_tard" })` place `logo` dans `plusTard` et pas dans `manquantes` ;
  - `progression("one_page", {})` liste `entreprise_nom`, `tel_public` et `rgpd` parmi `manquantes` ;
  - `fusionnerReponses({ cible: "PME", activite: "Plombier" }, { activite: "Plombier chauffagiste", zone: "Osny" })` donne `{ cible: "PME", activite: "Plombier chauffagiste", zone: "Osny" }` ;
  - `fusionnerReponses({ zone: "Osny" }, { zone: "" })` retire `zone` ;
  - `fusionnerReponses("x", { zone: "Osny" })` donne `{ zone: "Osny" }`.
- [ ] **Step 2 :** `node --import ./scripts/alias-hook.mjs --test scripts/test-questionnaire.ts`. Attendu : échec (module absent).
- [ ] **Step 3 :** écrire `src/lib/questionnaire.ts`.
  - Recopier toutes les questions de `questionnaire-cadrage.md` (clés, libellés, types, options, aides, obligation).
  - `formules` : `E` → essentiel, `P` → pro ; toute question `E` vaut aussi pour `one_page`, sauf `pages`.
  - Ajouter :
    - `tel_public` (partie 1, type `tel`, obligatoire, toutes formules, aide « Le numéro affiché sur le site et dans les boutons d'appel ») ;
    - `sections_souhaitees` (partie 2, `choix_multiple`, One page seul, facultatif, options : Services, Pourquoi nous, Avis, Zone d'intervention, Questions fréquentes, Réalisations, À propos, Tarifs, Autre).
  - Les `choix_image` gardent leurs identifiants (`artisan`, `creme_noyer`…) en `options`.
  - `CONTENUS_REPLI` :
    - `logo` : « Nom en typographie soignée » ;
    - `photos` : « Photos libres de droits sur le sujet, à remplacer à réception » ;
    - `textes` et `realisations` : « Textes de la maquette, à signaler à Edgar ».
- [ ] **Step 4 :** relancer le test. Attendu : PASS.
- [ ] **Step 5 :** mettre à jour `questionnaire-cadrage.md` :
  - colonne Formule avec `O` (One page) sur toutes les lignes `E` sauf `pages` ;
  - convention « `O` = One page » ;
  - lignes `tel_public` et `sections_souhaitees` ;
  - `pages` en One page : « affichage fixe « une seule page » ».
- [ ] **Step 6 : commits.** Dans le hub : `git add src/lib/questionnaire.ts scripts/test-questionnaire.ts && git commit -m "Brief : définition du questionnaire de cadrage"`. À la racine du workspace : commit de `questionnaire-cadrage.md`.

### Task 2 : Règles des étapes

**Files :**
- Create : `src/lib/brief-etapes.ts`
- Create : `scripts/test-brief-etapes.ts`

**Interfaces :**
- Consumes : `progression`, `FormuleQ`, `Reponses` (tâche 1).
- Produces :
  - `ETAPES = ["questionnaire", "direction", "maquette", "construction"] as const` ;
  - `type EtapeCle` ;
  - `type EtatEtape = "a_faire" | "en_cours" | "validee" | "a_revalider"` ;
  - `interface PageMaquette { nom: string; chemin: string; capture_bureau: string | null; capture_mobile: string | null }` ;
  - `interface Production` :
    - `etapes: Record<EtapeCle, { etat: EtatEtape; valide_le: string | null; par: "edgar" | "claude" | null; note: string | null }>` ;
    - `dossier: string | null` ;
    - `projet_framer: string | null` ;
    - `direction: { chemin: string | null; capture: string | null }` ;
    - `maquette: { pages: PageMaquette[]; consignes: string | null }` ;
    - `historique: { etape: EtapeCle; action: "validee" | "rouverte"; par: "edgar" | "claude"; le: string; note: string | null }[]` ;
  - `productionVide(): Production` ;
  - `lireProduction(raw: unknown): Production` (complète ce qui manque, ne jette jamais) ;
  - `peutValider(p: Production, e: EtapeCle, ctx: { formule: FormuleQ | null; reponses: Reponses }): { ok: true } | { ok: false; raison: string }` ;
  - `valider(p, e, par, note, maintenant: string): Production` ;
  - `rouvrir(p, e, par, maintenant): Production` ;
  - `marquerEnCours(p, e): Production` (seulement depuis `a_faire`) ;
  - `promptDisponible(p): boolean`.

- [ ] **Step 1 : écrire les tests** :
  - `peutValider(vide, "direction", ...)` est refusé avec raison « Le questionnaire doit être validé avant. » ;
  - `peutValider` du questionnaire est refusé tant que `progression(...).manquantes` n'est pas vide, et accepté avec seulement des `plusTard` ;
  - `peutValider(…, "direction")` est refusé sans `direction.chemin` (« Indique le chemin de la planche. ») ;
  - `peutValider(…, "maquette")` est refusé sans page de maquette ;
  - `peutValider(…, …)` est refusé avec `formule: null` (« Choisis la formule. ») ;
  - `valider` met `etat: "validee"`, `valide_le`, `par` et ajoute une ligne à l'historique ;
  - après validation des 3 premières étapes, `promptDisponible` vaut `true` ;
  - `rouvrir(p, "direction", "edgar", t)` passe la direction `en_cours` et la maquette de `validee` à `a_revalider`. `promptDisponible` vaut alors `false`, et l'historique garde la validation de la maquette ;
  - une étape `a_revalider` peut être revalidée par `valider` ;
  - `lireProduction(null)` est égal à `productionVide()` ;
  - `lireProduction({ etapes: { direction: { etat: "bidon" } } })` remet `a_faire`.
- [ ] **Step 2 :** lancer `scripts/test-brief-etapes.ts`. Attendu : FAIL.
- [ ] **Step 3 :** écrire `src/lib/brief-etapes.ts`. L'étape `construction` n'est jamais validée à la main : elle est `en_cours` quand `promptDisponible` est vrai.
- [ ] **Step 4 :** relancer. Attendu : PASS.
- [ ] **Step 5 : commit** `Brief : règles des étapes de production`.

### Task 3 : Prompt de construction

**Files :**
- Create : `src/lib/brief-prompt.ts`
- Create : `scripts/test-brief-prompt.ts`
- Modify : `src/lib/bibliotheque-prompt.ts` (exporter `blocSection` et `itemListe` sans changer leur comportement ; `scripts/test-bibliotheque-prompt.ts` doit rester vert)

**Interfaces :**
- Consumes : tâches 1 et 2 ; `EpingleRangee`, `trierEpingles` de `src/lib/briefs.ts` ; `blocSection` de `bibliotheque-prompt.ts`.
- Produces : `construirePromptConstruction(args: { entreprise: string | null; formule: FormuleQ | null; reponses: Reponses; production: Production; epingles: EpingleRangee[] }): { ok: true; prompt: string } | { ok: false; raison: string }`.

- [ ] **Step 1 : écrire les tests** (production fabriquée avec les 3 étapes validées, dossier `livrables/clients/garnier`, une page de maquette `maquette/index.html`) :
  - refus si `promptDisponible` est faux, ou si `formule` est `null` ;
  - le prompt contient :
    - `/Users/ed/Desktop/jarvis-kleak/livrables/clients/garnier/maquette/index.html` ;
    - `style-maison.md` et `checklist-qualite-site.md` ;
    - « tu ne conçois rien » ;
    - la valeur de `tel_public` et `tel:` ;
    - `email_pro` ;
    - `legal_siret` ;
  - avec `logo: "plus_tard"`, le prompt contient « Logo » et « Nom en typographie soignée » ;
  - les consignes de construction sont recopiées telles quelles ;
  - en `one_page` avec `sections_souhaitees: ["Avis", "Zone d'intervention"]`, les deux libellés apparaissent ;
  - une réponse vide (`adresse` absente) n'apparaît pas, et « non renseigné » n'apparaît jamais ;
  - deux épingles de pages différentes en `one_page` sortent toutes deux sous « Accueil », avec le titre de leur fiche ;
  - avec 2 pages de maquette, les deux chemins apparaissent.
- [ ] **Step 2 :** lancer `scripts/test-brief-prompt.ts`. Attendu : FAIL.
- [ ] **Step 3 :** écrire `src/lib/brief-prompt.ts`, sur le plan de `livrables/clients/test-garnier-plomberie/prompt-construction-v2.md`, parties dans l'ordre :
  1. le modèle à reproduire (chemins des pages et des captures) ;
  2. la cible (projet Framer, une page Framer par page de maquette) ;
  3. la traduction en Framer à tirer du CSS de la maquette, puis les consignes ;
  4. les faits du client ;
  5. les contenus manquants et leur repli ;
  6. les sections de la bibliothèque (via `blocSection`) ;
  7. les règles (performance, repères HTML, `tel:`) ;
  8. la fin de construction (contrôle « niveau Framer », publication, écarts, checklist sections 9 et 10).
- [ ] **Step 4 :** relancer ce test et `scripts/test-bibliotheque-prompt.ts`. Attendu : PASS pour les deux.
- [ ] **Step 5 : commit** `Brief : prompt de construction`.

### Task 4 : Base et API

**Files :**
- Create : `supabase/brief-production.sql`
- Modify : `src/lib/briefs.ts` (type `Brief` : `version: "ancien" | "questionnaire"`, `formule: Formule | null`, `production: unknown`, `reponses: Record<string, unknown>` ; garder `BRIEF_CHAMPS` pour l'affichage des anciens briefs ; `parserBriefMaj` accepte `formule`, et ses `reponses` passent par `fusionnerReponses`)
- Modify : `src/app/api/briefs/[id]/route.ts` (PATCH : relire `reponses` en base et fusionner ; `version` passe à `questionnaire` sur demande explicite `{ passerAuQuestionnaire: true }`)
- Create : `src/app/api/briefs/[id]/etapes/route.ts` (POST `{ action: "valider" | "rouvrir" | "maj", etape?, note?, dossier?, projet_framer?, direction_chemin?, maquette_pages?, consignes? }`)
- Create : `src/app/api/briefs/[id]/captures/route.ts` (POST multipart `fichier`, `cible: "direction" | "maquette"`, `page?: number`, `vue?: "bureau" | "mobile"`)
- Create : `src/lib/brief-production-db.ts` (lecture du brief et de la formule par défaut depuis `ventes` ; application d'une action ; partagé par la route Edgar et la route agent)
- Create : `src/app/api/agent/briefs/route.ts` (GET `?id=` : brief, réponses, production, prompt si disponible ; GET sans id : liste courte ; POST : mêmes actions que `/etapes`, `par: "claude"`)
- Create : `scripts/test-brief-production-db.ts` (sur le parseur d'action, en pur)

**Interfaces :**
- Produces :
  - `parserActionEtape(body: unknown): { ok: true; value: ActionEtape } | { ok: false; error: string }` ;
  - `appliquerAction(briefId: string, action: ActionEtape, par: "edgar" | "claude"): Promise<{ brief } | { error: string; status: number }>` ;
  - `formuleParDefaut(compteId: string): Promise<Formule | null>` (dernière vente du compte).

- [ ] **Step 1 :** écrire `supabase/brief-production.sql` :
  ```sql
  alter table briefs add column if not exists version text not null default 'questionnaire' check (version in ('ancien', 'questionnaire'));
  alter table briefs add column if not exists formule text check (formule in ('one_page', 'essentiel', 'pro', 'sur_mesure'));
  alter table briefs add column if not exists production jsonb not null default '{}'::jsonb;
  update briefs set version = 'ancien' where created_at < now();
  ```
  Les captures vont dans le bucket existant `BUCKET` (`src/lib/bibliotheque-db.ts`), sous `briefs/<briefId>/`.
- [ ] **Step 2 : tests** de `parserActionEtape` :
  - refuse une action inconnue et une étape inconnue ;
  - refuse `valider` sur `construction` ;
  - nettoie les chaînes (trim, vide → null) ;
  - borne `maquette_pages` à 10 pages ;
  - refuse un chemin qui ne commence pas par `livrables/`.
- [ ] **Step 3 :** lancer le test. Attendu : FAIL. Puis écrire le code et relancer. Attendu : PASS.
- [ ] **Step 3 bis :** ancien champ `statut`. Il est gardé en base mais dérivé à chaque action :
  - `recu` tant que le questionnaire n'est pas validé ;
  - `complete` quand il l'est ;
  - `valide` quand le prompt est disponible.

  La liste des briefs (`src/app/(app)/briefs/page.tsx`) continue de l'afficher sans modification.
- [ ] **Step 4 :** `appliquerAction` relit la ligne en base avant d'appliquer `peutValider`, `valider` ou `rouvrir`. Elle renvoie 409 avec la raison si la règle refuse.
- [ ] **Step 5 :** route agent : modèle `api/agent/todo` ; 503 si `BRIEF_AGENT_SECRET` manque ; 401 si le secret est faux.
- [ ] **Step 6 :** demander à Edgar d'exécuter `supabase/brief-production.sql` (recopier le SQL complet dans le message) et de poser `BRIEF_AGENT_SECRET` dans `.env.local` du hub, dans le `.env` du workspace et dans Vercel (`vercel env add BRIEF_AGENT_SECRET production --value … --non-interactive`).
- [ ] **Step 7 : vérification**, serveur de dev lancé :
  - `curl -s -H "x-kleak-secret: $BRIEF_AGENT_SECRET" "localhost:3000/api/agent/briefs"` renvoie la liste ;
  - sans en-tête, la réponse est 401.
- [ ] **Step 8 : commit** `Brief : base, API et entrée réservée`.

### Task 5 : La fiche brief

**Files :**
- Modify : `src/app/(app)/briefs/[id]/page.tsx` (devient l'assemblage des panneaux)
- Create, dans `src/app/(app)/briefs/[id]/` :
  - `etapes-brief.tsx` (frise des 4 étapes, états et dates) ;
  - `panneau-questionnaire.tsx` (rendu par type de question, formule, progression, « plus tard ») ;
  - `panneau-direction.tsx` ;
  - `panneau-maquette.tsx` (liste de pages, captures, consignes) ;
  - `panneau-construction.tsx` (bouton de copie via `src/lib/presse-papier.ts`) ;
  - `ancien-brief.tsx` (repliable, lecture seule, bouton « Passer au questionnaire »).
- Modify : `src/app/theme.css` si de nouvelles couleurs d'état sont nécessaires.

**Interfaces :**
- Consumes : tâches 1 à 4. Les épingles restent gérées par `epingles-par-page.tsx`. En `one_page`, la page proposée par défaut est « Accueil ».

- [ ] **Step 1 :** frise des étapes. Chaque étape affiche son état (`a_faire`, `en_cours`, `validee` + date + « par Edgar » ou « par Claude », `a_revalider`). Bouton « Valider » quand `peutValider` est vrai, sinon sa raison en clair. Bouton « Rouvrir » sur une étape validée.
- [ ] **Step 2 :** sans formule, le panneau Questionnaire ne montre que le choix de la formule, pré-rempli par `formuleParDefaut`. Puis les 7 parties. Les `choix_image` sont rendus comme des choix simples (images plus tard). Les `fichiers` ont un sélecteur d'état.
- [ ] **Step 3 :** panneaux Direction et Maquette :
  - champs de chemin ;
  - envoi de capture (image, 5 Mo au plus) ;
  - aperçu des captures ;
  - note ;
  - pour la Maquette : ajout et retrait de pages, champ consignes.
- [ ] **Step 4 :** panneau Construction. Le bouton est grisé avec la raison si `promptDisponible` est faux. Après copie : « Prompt copié ». La liste des contenus encore manquants s'affiche au-dessus du bouton.
- [ ] **Step 5 :** un brief `version: "ancien"` s'affiche comme aujourd'hui, en lecture, avec le bouton « Passer au questionnaire ».
- [ ] **Step 6 : vérification**, avec `npm run dev`, sur un brief de test créé pour l'occasion puis supprimé :
  - choisir One page ;
  - remplir les obligatoires et valider le questionnaire ;
  - valider Direction et Maquette avec `livrables/clients/test-garnier-plomberie/maquette/index.html` ;
  - copier le prompt et le comparer à `prompt-construction-v2.md` ;
  - rouvrir la Direction et constater que le bouton est grisé ;
  - capture de la fiche à 1440 et 390 px (Playwright, `livrables/creas-meta`).
- [ ] **Step 7 :** arrêter le serveur de dev, `npm run build` et `npm test`. Attendu : build sans erreur, tous les tests PASS.
- [ ] **Step 8 : commit** `Brief : fiche de production en 4 étapes`.

### Task 6 : Documentation et livraison

**Files (racine du workspace) :**
- Modify : `CLAUDE.md` (partie Hub Agence : une ligne « Brief de production » avec la spec, les 4 étapes et `BRIEF_AGENT_SECRET`)
- Modify : `.claude/commands/site.md` (le prompt de construction vient du brief, étape Construction)
- Modify : `.env.example` (ligne `BRIEF_AGENT_SECRET=`)

- [ ] **Step 1 :** écrire ces trois mises à jour et les committer à la racine.
- [ ] **Step 2 :** pousser la branche `brief-production` du hub et donner à Edgar l'aperçu Vercel de la branche. **Ne pas fusionner** sans sa validation.
