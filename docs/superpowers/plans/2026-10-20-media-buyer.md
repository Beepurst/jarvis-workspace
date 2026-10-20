# Agent media buyer et module Ads renforcé : plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Le hub collecte toutes les données Meta et CRM, envoie jusqu'à 5 textes, 5 titres et 5 descriptions par pub, alerte Edgar par push, et un agent Claude Code `media-buyer` prépare les campagnes, écrit les textes et fait les bilans.

**Architecture:** Même découpage que le module Ads : logique pure dans `src/lib/ads/*.ts` testée par `scripts/test-ads-*.ts` (`node --test`), accès base et réseau dans des fichiers `*-db.ts` / `insights.ts` séparés, routes API minces. Les textes ne sont plus des trios mais des **éléments** indépendants (texte, titre, description) déposés par l'agent via une entrée réservée. Les alertes sont évaluées par une fonction pure appelée par une tâche planifiée Vercel. L'agent vit dans `.claude/agents/media-buyer.md` (workspace) et parle au hub par deux entrées réservées (`/api/agent/ads`).

**Tech Stack:** Next.js 15 (App Router), Supabase, API Graph Meta v26.0 (`GRAPH_BASE`), web-push (`src/lib/push.ts`), Vercel Cron, Node `node --test` avec `scripts/alias-hook.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-20-media-buyer-design.md` (racine du workspace). Plan précédent, dont les contraintes restent valables : `docs/superpowers/plans/2026-10-18-module-ads.md`.

**Où coder :** hub dans le worktree `livrables/hub-agence-ads/`, branche `module-ads` (à jour avec `main` au 20/10). Serveur de dev sur le port 3001. Commits du hub dans son dépôt ; commits du workspace (Tâches 0 côté notes, 12) depuis la racine `jarvis-kleak`. Tests au départ : `npm test` vert (lancer une fois pour noter le nombre exact avant la Tâche 1).

## Global Constraints

- Toutes les « Global Constraints » du plan `2026-10-18-module-ads.md` (statut `PAUSED` et quatre verrous, aucun tiret de ponctuation, interdits de contenu, « indisponible » jamais 0, thème `theme.css`, navigation `navigation.ts`, verre réservé aux chiffres, iPhone sans défilement horizontal, champs à 16 px).
- L'agent n'agit jamais dans Meta. Le hub ne crée que des objets en pause ; aucune route nouvelle n'écrit vers Meta.
- Jusqu'à **5** textes principaux, **5** titres, **5** descriptions par pub ; au moins 1 texte et 1 titre ; descriptions facultatives (0 à 5).
- Limites de longueur reprises de `LIMITES_TEXTE` (`src/lib/ads/reglages.ts`) : titre 40, description 30 (bloquantes au dépôt), texte principal 125 (avertissement, non bloquant).
- Seuils par défaut (spec, Partie 4) : CPL cible **5 €**, budget mensuel **200 €**, pub sans lead à **3 × CPL cible** de dépense, CPL qui double (**× 2**, au moins **3 leads** sur chacune des deux périodes de 7 jours), fréquence **≥ 3** sur 7 jours, dépense du mois **> 20 %** en avance sur le rythme. Volume minimum avant bilan (choix de ce plan, à citer dans `regles.md`) : **10 leads** ou **50 €** de dépense sur une pub.
- Un lead compte en **RDV** selon la définition existante (`comptesAvecRdv`, événement `rdv_reserve` ; couvre aussi un lead passé en RDV puis `perdu`) ; en **client** si `comptes.etape` ∈ `acompte_paye`, `en_production`, `livre`, `solde`. CA signé : `null` (« indisponible ») partout.
- Nouvelles variables : `ADS_AGENT_SECRET` (hub, `.env.example` sans valeur ; et dans le `.env` du workspace pour l'agent). `GROQ_API_KEY` n'est plus requise par le module.
- Ne jamais afficher `.env`, `.env.local` ni un secret. Ne jamais lancer `npm run build` pendant qu'un serveur de dev tourne.

## Review Focus

1. **L'agent dépose 5 textes dont un avec un prix hors offre** : tout le dépôt est refusé, rien n'est enregistré, la réponse dit quel élément et pourquoi. Testé en Tâche 2.
2. **Une pub à un seul visuel avec plusieurs textes** : `asset_feed_spec` sans règles de placement ; un seul texte de chaque : `link_data` comme avant. Testé en Tâche 3.
3. **Une alerte qui persiste plusieurs jours** : une seule notification ; si elle disparaît puis revient, une nouvelle. Testé en Tâche 9.
4. **Jeton Meta expiré pendant la tâche planifiée** : une seule alerte « jeton », aucune alerte calculée sur des données vides (pas de faux « dépense sans lead »). Testé en Tâche 9.
5. **Ventilation par élément absente ou refusée par Meta** : « indisponible » à l'écran et `null` pour l'agent, aucune répartition inventée, la page ne plante pas. Testé en Tâche 6.

---

### Task 0 : Clore la Tâche 13 du module Ads

**Files:**
- Modify: `src/lib/ads/meta-campaign.ts` (en-tête, bloc « CE QUI N'A PAS ENCORE ÉTÉ VÉRIFIÉ EN RÉEL »)

- [ ] **Step 1 :** Renommer le bloc en « CE QUI A ÉTÉ VÉRIFIÉ EN RÉEL (20/10/2026, compte Kleak Pub) » et y noter : campagne, ensemble, créatif à deux visuels (`asset_feed_spec` + règles de placement) et annonce créés en pause et visibles dans le Gestionnaire ; refus du 19/10 sur `degrees_of_freedom_spec` corrigé ; erreur « application en cours de développement » levée en publiant l'app Meta « Kleak Hub » le 20/10. Garder en « reste à vérifier » ce qui ne l'a pas été (lien factice `http://fb.me/` si Edgar ne l'a pas contrôlé, plusieurs textes : Tâche 11).
- [ ] **Step 2 :** Demander à Edgar si la campagne de test de 1 € est supprimée du Gestionnaire ; sinon, le lui faire faire.
- [ ] **Step 3 :** `npm test` : PASS. Commit `Module Ads : validé en réel sur le compte Kleak`.

---

### Task 1 : Schéma (éléments, seuils, alertes)

**Files:**
- Create: `supabase/media-buyer.sql`

**Interfaces:**
- Produces (tables, RLS activée sans policy, idempotent comme `module-ads.sql`) :
  - `elements_annonce` : `id uuid pk`, `creative_nom_base text not null`, `type text check in ('texte','titre','description')`, `contenu text not null`, `offre_cle text` (clé de `offres_ads`), `source text not null default 'agent' check in ('agent','manuel','migration')`, `valide_le timestamptz`, `created_at timestamptz default now()`, `unique (creative_nom_base, type, contenu)`.
  - `seuils_ads` : une seule ligne (`id int primary key default 1 check (id = 1)`), colonnes `cpl_cible numeric default 5`, `budget_mensuel numeric default 200`, `sans_lead_multiple numeric default 3`, `cpl_hausse_ratio numeric default 2`, `cpl_hausse_min_leads int default 3`, `frequence_max numeric default 3`, `rythme_tolerance numeric default 0.2`, `bilan_min_leads int default 10`, `bilan_min_depense numeric default 50`, `updated_at`. Insérer la ligne par défaut (`on conflict do nothing`).
  - `alertes_ads` : `id uuid pk`, `cle text not null`, `type text not null`, `ad_id text`, `message text not null`, `ouverte_le timestamptz default now()`, `fermee_le timestamptz`, `notifiee boolean default false`. Index unique partiel sur `cle` `where fermee_le is null`.
  - Migration : chaque ligne de `textes_annonce` éclatée en éléments (`source 'migration'`, `valide_le` repris), `on conflict do nothing`. `textes_annonce` reste en place (lecture seule désormais).

- [ ] **Step 1 :** Écrire le SQL. Le rejouer deux fois sur une base de dev doit être sans erreur ni doublon.
- [ ] **Step 2 :** Edgar l'exécute dans l'éditeur SQL Supabase. Vérifier par une requête de comptage que les éléments migrés existent.
- [ ] **Step 3 :** Commit `Media buyer : schéma des éléments, seuils et alertes`.

---

### Task 2 : Dépôt des éléments par l'agent

**Files:**
- Create: `src/lib/ads/elements.ts`, `src/lib/ads/elements-db.ts`, `src/app/api/agent/ads/elements/route.ts`, `src/lib/ads/agent-auth.ts`
- Modify: `src/middleware.ts` (rien si `api/agent` est déjà exempté : le vérifier), `.env.example`
- Test: `scripts/test-ads-elements.ts`

**Interfaces:**
- Consumes : `verifierTexte(texte, { prixOffre, tournures, avis })` et `trouverTirets` (`garde-fous.ts`), `LIMITES_TEXTE` (`reglages.ts`), `lireReglagesAds()` (`reglages-db.ts`), `secretValide` (`@/lib/secret`).
- Produces :
  - `type TypeElement = "texte" | "titre" | "description"`
  - `interface DepotElements { creative_nom_base: string; offre_cle: string; textes: string[]; titres: string[]; descriptions: string[] }`
  - `interface RefusElement { type: TypeElement; index: number; contenu: string; problemes: string[] }`
  - `parserDepot(corps: unknown): { ok: true; valeur: DepotElements } | { ok: false; error: string }` : 1 à 5 textes, 1 à 5 titres, 0 à 5 descriptions, chaînes non vides après `trim`, doublons retirés.
  - `verifierDepot(d: DepotElements, ctx: { prixOffre: number[]; tournures: string[]; avis: string[] }): { refus: RefusElement[]; avertissements: RefusElement[] }` : garde-fous sur chaque élément ; titre > 40 ou description > 30 = refus ; texte > 125 = avertissement.
  - `enregistrerElements(d: DepotElements): Promise<{ crees: number; deja: number }>` (`elements-db.ts`, insertion unique en un appel, `on conflict do nothing` via `upsert ... ignoreDuplicates`).
  - `listerElements(nomBase?: string): Promise<ElementLigne[]>` avec `interface ElementLigne { id: string; creative_nom_base: string; type: TypeElement; contenu: string; valide_le: string | null; created_at: string }` ; `lireElementsParIds(ids: string[]): Promise<ElementLigne[]>` ; `marquerElementsValides(ids: string[]): Promise<void>`.
  - `refusAgent(request: NextRequest): NextResponse | null` (`agent-auth.ts`) : 503 si `ADS_AGENT_SECRET` absent, 401 si en-tête `x-kleak-secret` faux.
  - `POST /api/agent/ads/elements` : 400 `{ error }` si mal formé ou offre inconnue ; 422 `{ refus, avertissements }` s'il y a au moins un refus (rien enregistré) ; 201 `{ crees, deja, avertissements }` sinon.

- [ ] **Step 1 : Tests qui échouent** (`scripts/test-ads-elements.ts`) :
  - `parserDepot` refuse 6 titres (`error` mentionne « 5 titres maximum ») et 0 texte ; retire un doublon exact.
  - `verifierDepot` sur 5 textes dont le 4e contient « 1 500 € » avec `prixOffre: [999]` : `refus.length === 1`, `refus[0].type === "texte"`, `refus[0].index === 3`.
  - Titre de 41 caractères : refus ; texte principal de 130 caractères sans autre problème : aucun refus, un avertissement.
  - Texte avec « 999 € — en 7 jours » : refus pour tiret.
- [ ] **Step 2 :** `npm test` : les nouveaux tests échouent (fonctions absentes).
- [ ] **Step 3 :** Implémenter `elements.ts`, `elements-db.ts`, `agent-auth.ts`, la route (relit l'offre par `offre_cle` dans `lireReglagesAds().offres`, passe `avis` en textes, `tournures` en motifs). Ajouter `ADS_AGENT_SECRET=` à `.env.example`.
- [ ] **Step 4 :** `npm test` : PASS. Essai local : un `curl` avec un faux secret répond 401, un dépôt valide 201, le même dépôt rejoué `deja` > 0.
- [ ] **Step 5 :** Commit `Media buyer : dépôt des textes par l'agent`.

---

### Task 3 : Plusieurs textes par pub (envoi Meta)

**Files:**
- Modify: `src/lib/ads/meta-campaign.ts` (`AdInput`, `validateCampaignInput`, `buildAdCreativePayload`), `src/lib/ads/campagne-form.ts`, `src/lib/ads/campagne-route.ts`
- Test: `scripts/test-ads-campaign.ts`, `scripts/test-ads-campagne-form.ts`

**Interfaces:**
- Consumes : `ElementLigne`, `lireElementsParIds`, `marquerElementsValides` (Tâche 2).
- Produces :
  - `AdInput` : `primaryText`, `headline`, `description` remplacés par `primaryTexts: string[]`, `headlines: string[]`, `descriptions: string[]` ; `texteIds` remplacé par `elementIds: string[]`. Aucun champ de statut (verrou 1).
  - `validateCampaignInput` : pour chaque annonce, 1 à 5 `primaryTexts`, 1 à 5 `headlines`, 0 à 5 `descriptions`, aucun vide.
  - `buildAdCreativePayload` : deux visuels → `asset_feed_spec` existant avec `bodies`, `titles`, `descriptions` portant **tous** les éléments ; un visuel et plus d'un élément d'un type → `asset_feed_spec` avec une seule image, `ad_formats: ["SINGLE_IMAGE"]`, sans `asset_customization_rules` ni `optimization_type` ; un visuel et exactement un élément de chaque type → `link_data` comme aujourd'hui.
  - `CreativeChoisie.texte` remplacé par `elements: { textes: ElementChoisi[]; titres: ElementChoisi[]; descriptions: ElementChoisi[] }` avec `interface ElementChoisi { id: string; contenu: string }` ; `construireAds` ne garde que les créatives ayant au moins un texte et un titre.
  - La route relit les éléments par identifiant (`lireElementsParIds`), vérifie qu'ils appartiennent bien à la créative, et appelle `marquerElementsValides` après succès.

- [ ] **Step 1 : Tests qui échouent :**
  - `buildAdCreativePayload` avec feed + story, 3 textes, 2 titres, 0 description : `asset_feed_spec.bodies.length === 3`, `titles.length === 2`, pas de clé `descriptions`, règles de placement présentes.
  - Feed seul, 2 textes, 1 titre : `asset_feed_spec` présent, `images.length === 1`, pas de `asset_customization_rules`, pas de `link_data`.
  - Feed seul, 1 de chaque : `object_story_spec.link_data.message` présent, pas d'`asset_feed_spec`.
  - `validateCampaignInput` refuse 6 titres et 0 texte.
  - Le test existant « aucune charge utile ne contient ACTIVE » couvre les nouvelles formes.
  - `construireAds` ignore une créative sans titre.
- [ ] **Step 2 :** `npm test` : échecs attendus.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** `npm test` : PASS. Commit `Module Ads : plusieurs textes, titres et descriptions par pub`.

---

### Task 4 : Écran de campagne à éléments multiples, retrait de Groq

**Files:**
- Modify: `src/app/(app)/ads/campagnes/nouvelle/page.tsx`, `formulaire.tsx`, `src/app/(app)/ads/creatives/[nom]/page.tsx`, `src/lib/ads/meta-config.ts` (si `GROQ_API_KEY` y est exigée)
- Delete: `src/lib/ads/llm.ts`, `src/lib/ads/textes.ts`, `src/app/(app)/ads/creatives/[nom]/generateur.tsx`, `src/app/api/ads/textes/` (route et `valider/`), `scripts/test-ads-textes.ts`, et `textes-db.ts` s'il n'a plus d'usage

**Interfaces:**
- Consumes : `listerElements` (Tâche 2), `CreativeChoisie.elements` (Tâche 3).
- Produces : dans « Créatives » de `/ads/campagnes/nouvelle`, pour chaque créative cochée, trois listes de cases (Textes principaux, Titres, Descriptions) avec compteur « n/5 » ; au-delà de 5, la case suivante est désactivée ; tout coché par défaut jusqu'à 5. Aide de section : « Meta combine lui-même les textes, titres et descriptions cochés. » La fiche d'une créative (`/ads/creatives/[nom]`) affiche ses éléments par type à la place du générateur, avec la mention « Textes déposés par l'agent media buyer ».

- [ ] **Step 1 :** Construire. `grep -rn "ads/llm\|ads/textes\|GROQ" src` ne renvoie plus rien.
- [ ] **Step 2 :** `npm test` : PASS. Captures à 1440 et 390 px de `/ads/campagnes/nouvelle` et d'une fiche créative ; à 390 px, `scrollWidth <= clientWidth`.
- [ ] **Step 3 :** Commit `Module Ads : choix des éléments à l'écran, générateur Groq retiré`.

---

### Task 5 : Insights Meta complets

**Files:**
- Modify: `src/lib/ads/insights.ts`, `src/lib/ads/performances.ts`, `src/app/(app)/ads/meta/page.tsx`, `tableau.tsx`, `liste-mobile.tsx`
- Test: `scripts/test-ads-performances.ts`, `scripts/test-ads-meta.ts`

**Interfaces:**
- Produces :
  - `CHAMPS` étend avec `adset_id,adset_name,impressions,reach,frequency,cpm,ctr,inline_link_clicks,inline_link_click_ctr`. Vérifier les noms dans la doc Insights v26.0 avant d'écrire ; ajouter tout champ utile pour séparer accroche, formulaire et audience s'il existe sous un nom documenté.
  - `LigneMeta` gagne `adset_id: string`, `adset_name: string`, `impressions: number`, `reach: number`, `linkClicks: number`.
  - `Indicateurs` gagne `impressions: number`, `couverture: number`, `frequence: number | null`, `cpm: number | null`, `ctr: number | null` (clics sur lien / impressions × 100), recalculés par `calculerIndicateurs` à partir des sommes (jamais en moyennant les ratios de Meta). La fréquence d'une campagne agrégée vaut `impressions / couverture` et reste `null` si la couverture est 0. Note dans le code : la couverture de plusieurs pubs ne s'additionne pas exactement (personnes en commun), la fréquence de campagne est donc une approximation basse.
  - `afficherIndicateur` couvre les nouvelles clés (`ctr` en %, une décimale ; `cpm` en euros ; `frequence` une décimale).
  - `/ads/meta` : colonnes ajoutées Impressions, CTR, CPM, Fréquence (tableau Mac) et lignes ajoutées (iPhone).

- [ ] **Step 1 : Tests qui échouent :** `calculerIndicateurs` avec `impressions: 0` donne `cpm`, `ctr`, `frequence` à `null` ; avec 2 000 impressions, 1 000 de couverture, 10 € et 40 clics sur lien : `cpm === 5`, `ctr === 2`, `frequence === 2`. `assembler` fusionne deux lignes d'une même pub en sommant impressions et couverture.
- [ ] **Step 2 :** `npm test` : échecs attendus.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** `npm test` : PASS ; captures 1440 et 390 px de `/ads/meta`. Commit `Module Ads : impressions, CTR, CPM et fréquence`.

---

### Task 6 : Détail par élément (texte, titre, description)

**Files:**
- Create: `src/lib/ads/elements-perf.ts`
- Modify: `src/lib/ads/insights.ts`, page de détail d'une campagne ou d'une pub sous `/ads/meta` (le constructeur choisit : panneau dépliable dans `tableau.tsx`, ou page `/ads/meta/[adId]`)
- Test: `scripts/test-ads-elements-perf.ts`

**Interfaces:**
- Produces :
  - `lireDetailElements(config: MetaConfig, range: DateRange, f?: typeof fetch): Promise<{ ok: true; lignes: LigneElement[] } | { ok: false; message: string }>` : trois lectures `level=ad` avec `breakdowns=body_asset`, puis `title_asset`, puis `description_asset`, champs `ad_id,spend,impressions,inline_link_clicks,actions`.
  - `interface LigneElement { ad_id: string; type: TypeElement; texte: string; depense: number; impressions: number; clics: number; leads: number }`
  - `extraireLigneElement(brute: unknown, type: TypeElement): LigneElement | null` : lit le texte dans l'objet de ventilation (`body_asset.text`, `title_asset.text`, `description_asset.text`) ; `null` si absent.
  - Une ventilation refusée ou vide pour un type donne `null` pour ce type, sans faire échouer les deux autres. L'écran affiche « indisponible » pour ce type.

- [ ] **Step 1 : Tests qui échouent :** `extraireLigneElement` sur une ligne factice `{ ad_id, body_asset: { text: "A" }, spend: "2.5", impressions: "100", inline_link_clicks: "3", actions: [{ action_type: "lead", value: "1" }] }` donne `{ type: "texte", texte: "A", depense: 2.5, leads: 1 }` ; une ligne sans `body_asset` donne `null`.
- [ ] **Step 2 :** `npm test` : échec attendu.
- [ ] **Step 3 :** Implémenter et afficher, par pub, un petit tableau par type (élément, dépense, impressions, CTR, leads, CPL).
- [ ] **Step 4 :** `npm test` : PASS. Commit `Module Ads : résultats par texte, titre et description`. (La forme réelle de la réponse Meta est vérifiée en Tâche 11 ; corriger `extraireLigneElement` et le test si elle diffère.)

---

### Task 7 : Qualité des leads par pub

**Files:**
- Modify: `src/lib/ads/attribution-db.ts`, `src/lib/ads/performances.ts`, affichage `/ads/meta`
- Test: `scripts/test-ads-performances.ts`

**Interfaces:**
- Produces :
  - `CrmParAnnonce` gagne `clients: number` et `budgets: Record<string, number>` (réponse « budget » du formulaire telle que stockée dans `comptes.budget`, `"non renseigné"` si vide).
  - `grouperParAnnonce(comptes: { id: string; ad_id: string | null; etape: string; budget: string | null }[], avecRdv: Set<string>): CrmParAnnonce[]` ; `ETAPES_CLIENT = ["acompte_paye", "en_production", "livre", "solde"]`.
  - `crmParAnnonce` lit `id, ad_id, etape, budget`.
  - `PerfAnnonce` gagne `qualite: { leads: number; rdv: number; clients: number; budgets: Record<string, number> }`.
  - `/ads/meta` : par pub, la répartition des budgets (pastilles « tranche : n ») et le nombre de clients.

- [ ] **Step 1 : Tests qui échouent :** trois comptes de la même pub (`acompte_paye`, `perdu` avec RDV, `nouveau_lead` budget vide) donnent `leads 3`, `rdv` selon `avecRdv`, `clients 1`, `budgets["non renseigné"] === 1` ; un compte sans `ad_id` reste dans la ligne `ad_id: null`.
- [ ] **Step 2 :** `npm test` : échec attendu.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** `npm test` : PASS. Commit `Module Ads : qualité des leads par pub`.

---

### Task 8 : Seuils dans les Réglages

**Files:**
- Create: `src/lib/ads/seuils.ts`, `src/lib/ads/seuils-db.ts`, `src/app/api/ads/seuils/route.ts`
- Modify: `src/app/(app)/ads/reglages/page.tsx`
- Test: `scripts/test-ads-seuils.ts`

**Interfaces:**
- Produces :
  - `interface Seuils { cplCible: number; budgetMensuel: number; sansLeadMultiple: number; cplHausseRatio: number; cplHausseMinLeads: number; frequenceMax: number; rythmeTolerance: number; bilanMinLeads: number; bilanMinDepense: number }`
  - `SEUILS_DEFAUT: Seuils` (valeurs des Global Constraints).
  - `validerSeuils(c: Record<string, unknown>): { ok: true; valeur: Seuils } | { ok: false; error: string }` : nombres positifs, virgule acceptée, `rythmeTolerance` saisi en % (20) et stocké en fraction (0,2).
  - `lireSeuils(): Promise<Seuils>` (repli sur `SEUILS_DEFAUT` si la ligne manque), `ecrireSeuils(s: Seuils): Promise<void>`.
  - Section « Seuils d'alerte » dans `/ads/reglages`, un champ par seuil avec une phrase d'aide.

- [ ] **Step 1 : Tests qui échouent :** `validerSeuils({ cplCible: "5,5", rythmeTolerance: "20", ... })` donne `cplCible 5.5`, `rythmeTolerance 0.2` ; une valeur négative ou vide est refusée avec un message en français.
- [ ] **Step 2 :** `npm test` : échec attendu.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** `npm test` : PASS ; captures 1440 et 390 px. Commit `Module Ads : seuils d'alerte dans les réglages`.

---

### Task 9 : Alertes push

**Files:**
- Create: `src/lib/ads/alertes.ts`, `src/lib/ads/alertes-db.ts`, `src/lib/ads/etat-meta.ts`, `src/app/api/cron/ads-alertes/route.ts`, `src/app/(app)/ads/alertes/page.tsx`
- Modify: `vercel.json`, `src/lib/navigation.ts` (sous-onglet `{ cle: "alertes", href: "/ads/alertes", libelle: "Alertes" }`)
- Test: `scripts/test-ads-alertes.ts`

**Interfaces:**
- Consumes : `Seuils`, `lireSeuils` (Tâche 8), `lireLignesMeta` (Tâche 5), `sendPush` (`src/lib/push.ts`).
- Produces :
  - `lireEtatMeta(config, f?): Promise<{ ok: true; compteActif: boolean; pubsRefusees: { ad_id: string; ad_name: string }[] } | { ok: false; jetonInvalide: boolean; message: string }>` : `account_status` du compte (1 = actif) et pubs dont `effective_status` vaut `DISAPPROVED` ou `WITH_ISSUES`.
  - `interface DonneesAlertes { etat: Awaited<ReturnType<typeof lireEtatMeta>>; semaine: LigneMeta[] | null; semainePrecedente: LigneMeta[] | null; cumul: LigneMeta[] | null; depenseMois: number | null; jourDuMois: number; joursDansMois: number }` (`null` = lecture échouée).
  - `interface AlerteDetectee { cle: string; type: "pub_refusee" | "compte_bloque" | "jeton" | "sans_lead" | "cpl_double" | "frequence" | "rythme" | "bilan"; ad_id: string | null; message: string }`
  - `evaluerAlertes(d: DonneesAlertes, s: Seuils): AlerteDetectee[]` : pure. Clé stable par situation : `` `${type}:${ad_id ?? "compte"}` `` (pour `rythme` : `` `rythme:${AAAA-MM}` ``). Si `etat` est en échec avec `jetonInvalide`, renvoie **seulement** l'alerte `jeton`. Toute règle dont les données sont `null` est sautée. `rythme` n'est pas évaluée avant le 3e jour du mois ; seuil : `depenseMois > budgetMensuel × jourDuMois / joursDansMois × (1 + rythmeTolerance)`. `sans_lead` : cumul de la pub `spend ≥ sansLeadMultiple × cplCible` et `leads === 0`. `cpl_double` : les deux semaines ont `≥ cplHausseMinLeads` leads et `cpl_semaine ≥ cplHausseRatio × cpl_precedente`. `frequence` : fréquence 7 jours de la pub `≥ frequenceMax`. `bilan` : cumul `leads ≥ bilanMinLeads` ou `spend ≥ bilanMinDepense`. Message : une phrase en français, nom de la pub, sans jargon (exemple : « La pub b-7-jours-999 a dépensé 16 € sans aucun lead. »).
  - `synchroniserAlertes(detectees: AlerteDetectee[]): Promise<AlerteDetectee[]>` (`alertes-db.ts`) : ouvre les clés nouvelles, ferme (`fermee_le`) les alertes ouvertes absentes de la liste, renvoie les nouvelles à notifier ; `marquerNotifiee(cle)`.
  - `GET /api/cron/ads-alertes` : même contrôle `CRON_SECRET` que `cron/relances` ; lit les données (périodes : 7 derniers jours, 7 jours d'avant, cumul depuis 30 jours), évalue, synchronise, envoie un push par nouvelle alerte (`tag` = clé), répond `{ detectees, nouvelles, envoyees }`. Si `missingMetaEnv()` n'est pas vide, répond 200 `{ ignore: "Meta non configuré" }`.
  - `vercel.json` : `{ "path": "/api/cron/ads-alertes", "schedule": "0 6 * * *" }` (8 h à Paris en heure d'été).
  - `/ads/alertes` : alertes ouvertes puis fermées des 30 derniers jours, en groupes iOS.

- [ ] **Step 1 : Tests qui échouent** (`scripts/test-ads-alertes.ts`) :
  - Jeton invalide + données vides : exactement `[{ type: "jeton" }]`.
  - Pub à 16 € de cumul, 0 lead, CPL cible 5, multiple 3 : une alerte `sans_lead` ; à 14 € : aucune.
  - CPL 4 € puis 9 € avec 3 leads chaque semaine : `cpl_double` ; avec 2 leads la semaine précédente : aucune.
  - Le 2 du mois avec 60 € dépensés : pas de `rythme` ; le 10 (sur 31 jours) avec 80 € : `rythme` (seuil 77,4 €).
  - Deux appels successifs avec les mêmes données donnent les mêmes clés (stabilité).
- [ ] **Step 2 :** `npm test` : échecs attendus.
- [ ] **Step 3 :** Implémenter. Test de `synchroniserAlertes` en local contre la base de dev : premier passage, 1 nouvelle ; deuxième passage identique, 0 ; passage sans l'alerte puis avec, 1 nouvelle.
- [ ] **Step 4 :** `npm test` : PASS. Appel local de la route avec le bon `CRON_SECRET` : réponse JSON, une notification reçue sur l'iPhone d'Edgar si une alerte est nouvelle (sinon, `api/push/test` pour vérifier l'abonnement). Commit `Module Ads : alertes push quotidiennes`.

---

### Task 10 : Lecture pour l'agent

**Files:**
- Create: `src/lib/ads/agent-lecture.ts`, `src/app/api/agent/ads/route.ts`
- Test: `scripts/test-ads-agent-lecture.ts`

**Interfaces:**
- Consumes : `refusAgent` (Tâche 2), `lireLignesMeta`, `assembler`, `crmParAnnonce` (Tâches 5 et 7), `lireDetailElements` (Tâche 6), `lireSeuils` (Tâche 8), alertes ouvertes (Tâche 9), `listerElements` (Tâche 2), dépense du mois (`depenses_pub`).
- Produces :
  - `GET /api/agent/ads?debut=AAAA-MM-JJ&fin=AAAA-MM-JJ` (par défaut : 30 derniers jours) → `ContexteAgent`.
  - `interface ContexteAgent { periode: { debut: string; fin: string }; seuils: Seuils; depenseMois: number | null; budgetMensuel: number; campagnes: PerfCampagne[]; nonRattaches: {...}; autresPubs: {...}; elements: Record<string, LigneElement[] | null>; textesDeposes: ElementLigne[]; alertesOuvertes: { cle: string; type: string; message: string; ouverte_le: string }[]; lectureMeta: "ok" | string }`
  - `construireContexte(parties): ContexteAgent` : pure, assemble ; si Meta est en échec, `campagnes: []` et `lectureMeta` porte le message (l'agent doit le dire, pas conclure).
  - Paramètres de date invalides : 400 `{ error }`.

- [ ] **Step 1 : Tests qui échouent :** `construireContexte` avec Meta en échec donne `campagnes.length === 0` et `lectureMeta` égal au message ; avec des données, `elements[ad_id]` vaut `null` quand la ventilation est indisponible.
- [ ] **Step 2 :** `npm test` : échec attendu.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** `npm test` : PASS ; `curl` local avec le secret renvoie le JSON, sans secret 401. Commit `Module Ads : lecture complète pour l'agent media buyer`.

---

### Task 11 : Validation réelle et mise en production (avec Edgar)

- [ ] **Step 1 :** En local (port 3001), déposer via `POST /api/agent/ads/elements` 3 textes, 2 titres, 1 description pour une créative à deux visuels (`b-7-jours-999`), puis créer depuis l'écran une campagne de test (budget 1 €, formulaire réel).
- [ ] **Step 2 :** Avec Edgar dans le Gestionnaire : tout en pause, objectif Prospects, formulaire branché, les textes apparaissent comme options multiples, visuel story distinct en story, DSA « Kleak Agency ». Si Meta refuse la combinaison plusieurs textes + règles de placement : **s'arrêter**, présenter à Edgar les options (renoncer au visuel story séparé, ou un seul texte par pub), appliquer son choix, figer la forme par un test.
- [ ] **Step 3 :** Appeler `lireDetailElements` sur une pub qui a déjà diffusé (ancienne campagne de mars 2025 ou, à défaut, attendre la première campagne réelle) pour relever la forme réelle des ventilations ; corriger `extraireLigneElement` et son test si besoin. Si Meta ne fournit aucune ventilation pour ce type d'annonce, le dire à Edgar et laisser l'affichage « indisponible ».
- [ ] **Step 4 :** Edgar supprime la campagne de test. Compléter l'en-tête « vérifié en réel » de `meta-campaign.ts`. Commit `Module Ads : plusieurs textes validés en réel`.
- [ ] **Step 5 :** Revue de toute la branche. Edgar pose sur Vercel, en Preview et Production, par script : les six variables du plan précédent sauf `GROQ_API_KEY`, plus `ADS_AGENT_SECRET`. Pousser la branche, Edgar valide la prévisualisation (Mac et iPhone, notification d'alerte comprise), puis fusion dans `main`.

---

### Task 12 : Agent `media-buyer` (workspace)

**Files (racine `jarvis-kleak`):**
- Create: `.claude/agents/media-buyer.md`, `livrables/media-buying/regles.md`, `livrables/media-buying/journal.md`, `livrables/media-buying/README.md`
- Modify: `.claude/agents/createur-creas.md`, `livrables/creas-meta/README.md`, `CLAUDE.md` (section « Agents et skills »), `.env` et `.env.example` (`ADS_AGENT_SECRET`, `HUB_URL` déjà présent)

**Interfaces:**
- Consumes : `GET /api/agent/ads` (Tâche 10), `POST /api/agent/ads/elements` (Tâche 2), en-tête `x-kleak-secret: $ADS_AGENT_SECRET`, base `$HUB_URL`.
- Produces :
  - `media-buyer.md` : frontmatter (`name: media-buyer`, `description` avec déclencheurs « fais le bilan », « prépare la prochaine campagne », « pourquoi la B ne marche plus », « j'ai reçu une alerte », « il me faut les textes pour Meta », « les textes d'une pub » ; `tools: Read, Write, Edit, Bash, Glob, Grep`). Corps : mission et posture (spec, Partie 1), lectures obligatoires dans l'ordre de la spec, les trois modes PRÉPARER / BILAN / COMMANDER, les règles de copy d'Edgar recopiées depuis `createur-creas.md`, les commandes `curl` exactes (lecture, dépôt, gestion de 422 : corriger les éléments refusés et redéposer), et l'interdiction d'agir dans Meta ou d'inventer un repère de marché.
  - `regles.md` : logique de décision pour 200 € par mois (couvre la liste de la spec, Partie 1), qui renvoie aux Réglages du hub pour toute valeur chiffrée (« la valeur qui fait foi est dans `seuils` de la lecture agent »), en séparant pour chaque règle : source Meta (lien vers la doc citée), donnée du compte (aucune au 20/10), choix de départ à réviser.
  - `journal.md` : format fixe (date, campagne, hypothèse, chiffres, décision, leçon) ; première entrée « 20/10/2026, test de 50 € des créas A, B, D, prévu, pas lancé ».
  - `createur-creas.md` : retirer l'étape d'écriture des textes d'annonce et les déclencheurs « il me faut les textes pour Meta », « les textes d'une pub », « corrige l'accroche » s'il vise le texte d'annonce (l'accroche de l'image reste à lui) ; ajouter « les textes d'annonce sont écrits par l'agent `media-buyer` ».
  - `CLAUDE.md` : une ligne `media-buyer` sous « Agents et skills ».

- [ ] **Step 1 :** Écrire les fichiers.
- [ ] **Step 2 :** Vérification à sec : lancer l'agent en mode BILAN contre la production (après la Tâche 11) ; il doit lire `regles.md`, `journal.md` et la lecture agent, dire que les volumes sont insuffisants pour conclure, et ne proposer aucune action dans Meta hors de la liste à exécuter par Edgar.
- [ ] **Step 3 :** Premier dépôt : l'agent dépose les textes validés de A, B et D depuis `livrables/creas-meta/TEXTES-ANNONCES.md` (mode PRÉPARER), en présentant à Edgar les deux variantes de D encore ouvertes avant de les déposer.
- [ ] **Step 4 :** Commit depuis la racine du workspace `Agent media buyer : règles, journal et dépôt des textes`.
