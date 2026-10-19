# Module Ads du Hub Agence : plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bibliothèque de créatives, suivi des performances Meta rapproché du CRM, générateur de textes d'annonce (Llama via Groq) avec garde-fous vérifiés dans le code, et envoi de campagnes Prospects en pause dans Meta.

**Architecture:** Même découpage que le reste du hub : logique pure dans `src/lib/ads/*.ts` testée par `scripts/test-ads-*.ts` (node:test), accès base et réseau dans des fichiers séparés, routes API minces, pages serveur sous `src/app/(app)/ads/`. Le code Meta est copié du Hub Ecom (`livrables/hub/`, jamais modifié) puis adapté à l'objectif Prospects avec formulaire instantané. **Ads est une rubrique à sous-onglets** de la navigation refondue le 18-19/10 (`src/lib/navigation.ts`), et ses écrans suivent le thème clair (`src/app/theme.css`).

**Tech Stack:** Next.js 15 (App Router), Supabase (Postgres + Storage), API Graph Meta (v21.0 au départ), API Groq (compatible OpenAI), Node 26 `node --test` avec `scripts/alias-hook.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-18-module-ads-design.md` (racine du workspace). Pour l'apparence et la navigation : `docs/superpowers/specs/2026-10-18-hub-agence-refonte-visuelle-design.md`, avenant « liquid glass » compris.

> **Révision du 19/10/2026.** Le plan d'origine (18/10) ajoutait quatre entrées à plat dans `src/lib/channels.tsx`, en thème sombre. Ce fichier n'existe plus depuis la refonte. Cette révision change uniquement la navigation, les chemins des pages et l'apparence (Tâches 3, 6, 7, 10, 12, nouvelle Tâche 2b) ; la logique (Tâches 1, 2, 4, 5, 8, 9, 11) est inchangée.

**Où coder :** worktree `livrables/hub-agence-ads/`, branche `module-ads`, **recréée depuis le `main` refondu** (l'ancienne branche partait de `f121220`, avant la refonte, et n'avait aucun commit) : `git -C livrables/hub-agence worktree remove ../hub-agence-ads && git -C livrables/hub-agence branch -D module-ads && git -C livrables/hub-agence worktree add ../hub-agence-ads -b module-ads main`, puis `npm install` et copie de `.env.local` depuis `livrables/hub-agence/` (sans l'afficher). Serveur de dev sur le port 3001 (`npm run dev -- -p 3001`). Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne. Ne jamais afficher `.env.local`. D'autres worktrees travaillent en parallèle (`hub-agence-finance`, `hub-agence-todo`) : ne pas y toucher.

**Quand :** après l'agent créas (décision d'Edgar du 18/10). **Mode d'exécution choisi par Edgar : subagent-driven** (superpowers:subagent-driven-development). Le hub est en ligne depuis le 19/10 : chaque push sur `main` déploie en production, donc fusion seulement après validation d'Edgar sur la prévisualisation Vercel de la branche (les variables Preview existent déjà).

## Global Constraints

- Toute campagne, tout ensemble et toute annonce sont créés en `PAUSED`. Les quatre verrous de `livrables/hub/src/lib/meta-campaign.ts` sont repris tels quels (pas de paramètre de statut, `PAUSED` écrit une fois et appliqué après l'étalement, `assertPaused()` avant chaque envoi, `graphPost()` privée).
- Aucun tiret de ponctuation dans un texte d'annonce : ni `—`, ni `–`, ni ` - ` entre deux mots. Les tirets dans un mot composé (« sur-mesure », « clé-en-main ») restent permis. Pas de `—` non plus dans les noms d'objets Meta créés par le hub (séparateur ` | `).
- Interdits de contenu : « 49 €/mois », « N°1 des agences Framer », « +50 % de clients ». Tout prix cité doit appartenir à l'offre choisie. Un avis n'est cité que mot pour mot depuis la table des avis.
- Une case sans donnée affiche « indisponible » (ou « pas encore de vente » pour le ROAS), jamais 0.
- Une saisie manuelle de `depenses_pub` n'est jamais écrasée par Meta.
- Dépense comptée : campagnes d'objectif `OUTCOME_LEADS` ou `LEAD_GENERATION` seulement.
- Payeur et bénéficiaire DSA : `HUB_DSA_ENTITY="Kleak Agency"`.
- Ciblage par défaut : `countries: ["FR"]`, `age_min: 25`, `age_max: 65`, aucun centre d'intérêt.
- Modèle de texte : une seule fonction d'appel (`genererTexte`), modèle lu dans une constante unique (`ADS_TEXT_MODEL`), pour passer à Claude plus tard en changeant une ligne.
- Tables Supabase : RLS activée sans policy, accès par la clé service role côté serveur (convention de `supabase/schema.sql`).
- Fichiers d'image : PNG, JPEG ou WebP, 4 Mo maximum (limite Vercel, cf. `CAPTURE_MAX_BYTES`).
- Variables d'environnement nouvelles : `HUB_META_ADS_ACCESS_TOKEN`, `HUB_META_ADS_ACCOUNT_ID` (`act_…`), `HUB_META_ADS_PAGE_ID`, `HUB_DSA_ENTITY`, `GROQ_API_KEY`, `CREAS_INTAKE_SECRET`. Ajoutées à `.env.example` sans valeur. Sur Vercel, Edgar les pose lui-même par script (`vercel env add <NOM> <env> --value … --yes --force --non-interactive < /dev/null`), en Production et en Preview.
- **Navigation** : une seule entrée dans `src/lib/navigation.ts`, la rubrique `ads` et ses sous-onglets (Tâche 2b). Aucune autre liste de menu à modifier : barre latérale, barre d'onglets, page Plus et sous-onglets en dérivent. Toutes les pages du module vivent sous `/ads/…` pour que la rubrique reste active.
- **Apparence** (refonte du 18-19/10) : aucune couleur écrite en dur hors de `src/app/theme.css` (`scripts/test-couleurs.ts` échoue sinon) ; texte coloré seulement avec les variantes accessibles (`--orange-texte`, `--vert-texte`, `--rouge`, `--accent`, vérifiées par `scripts/test-contraste.ts`) ; composants existants : `PageHeader({ title, eyebrow?, subtitle?, actions? })` (les sous-onglets s'affichent seuls), `Chiffres`, `pillStyle(actif)`, `buttonStyle`, `buttonSecondaireStyle`, `cardStyle`, `inputStyle`, `filtreStyle`, `labelStyle`, `PeriodSelector` (sans prop `accent`), `NotConnected` (sans prop `accent`), `Readout`. Listes en groupes iOS (`.hub-groupe`, `.hub-ligne`, `.hub-ligne-sous`, `.hub-chevron`) ; tableaux dans `.hub-scroll-x`.
- **Verre** : `<div className="hub-halo" aria-hidden="true" />` en premier élément de chaque page principale du module ; `.hub-verre` sur les blocs de chiffres (pas sur les lignes de tableau ni les grilles de vignettes) ; `.hub-pilules-verre` est déjà porté par `PeriodSelector`.
- **iPhone** (sous 860 px) : aucune page ne défile en largeur (`scrollWidth <= clientWidth`, vérifié par capture à 390 px) ; champs à 16 px (règle globale déjà en place).
- Tests existants au départ : 116, tous verts.

## Review Focus

1. **Une pub qui a dépensé sans lead** : CPL affiché « aucun lead », pas « 0,00 € » ni une division par zéro. Testé en Tâche 5.
2. **Un lead du CRM sans `ad_id`** (lead saisi à la main, ancienne campagne) : compté dans une ligne « non rattachés », jamais attribué à une pub au hasard. Testé en Tâche 5.
3. **Prix écrit autrement** (« 999€ », « 999 euros », « 1 800 € », « 1800 € ») : reconnu comme le même prix ; « 1 500 € » avec l'offre Essentiel est rejeté. Testé en Tâche 8.
4. **L'agent créas dépose deux fois la même créa** (même nom de base, même format) : la nouvelle remplace l'ancienne, pas de doublon. Testé en Tâche 2.
5. **Groq répond 429 ou est injoignable, ou le jeton Meta est expiré** : message clair à l'écran, rien d'enregistré à moitié, la page ne plante pas. Testé en Tâches 6 et 9.

---

### Task 0 : Prérequis Meta et Groq (avec Edgar, pas de code)

- [ ] **Step 1 :** Avec Edgar, dans le Business Manager : créer un utilisateur système (rôle admin), lui assigner le compte publicitaire et la Page Kleak, générer un jeton sur son app avec `ads_management`, `ads_read`, `pages_show_list`, `pages_read_engagement`, `pages_manage_ads`, `leads_retrieval`.
- [ ] **Step 2 :** Vérifier dans la doc Meta et sur l'app que ces droits fonctionnent en accès standard sur les actifs d'Edgar. Si une validation d'app est requise, s'arrêter et le dire à Edgar avant les Tâches 4 et 11.
- [ ] **Step 3 :** Edgar crée une clé Groq (offre gratuite). Vérifier dans la doc Groq qu'un modèle Llama acceptant les images est disponible (Llama 4 Scout ou Maverick), noter son identifiant exact, ses limites gratuites et la taille d'image acceptée.
- [ ] **Step 4 :** Poser les variables dans `livrables/hub-agence-ads/.env.local` sans les afficher. `CREAS_INTAKE_SECRET` : `openssl rand -hex 32`.

---

### Task 1 : Schéma de base du module

**Files:**
- Create: `supabase/module-ads.sql`
- Modify: `.env.example`

**Interfaces:**
- Produces (tables) :
  - `creatives (id uuid pk, nom_base text not null, format text check in ('1:1','4:5','9:16'), largeur int, hauteur int, chemin text not null, angle text, accroche text, source_html text, created_at, updated_at, unique (nom_base, format))`
  - `tons (id uuid pk, nom text unique not null, description text not null, created_at)`
  - `offres_ads (id uuid pk, cle text unique not null, nom text not null, contenu text not null, prix int[] not null default '{}', updated_at)` ; `prix` en euros entiers.
  - `avis (id uuid pk, auteur text not null, entreprise text, texte text not null, created_at)`
  - `tournures_interdites (id uuid pk, motif text unique not null)`
  - `textes_annonce (id uuid pk, creative_nom_base text not null, ton_id uuid references tons, offre_id uuid references offres_ads, texte_principal text not null, titre text not null, description text, valide_le timestamptz, created_at)` ; une ligne avec `valide_le` non nul est un exemple de ton.
  - `envois_campagne (id uuid pk, nom text not null, campaign_id text, adset_id text, objets jsonb not null, statut text check in ('ok','echec'), erreur text, created_at)`
  - `alter table depenses_pub add column if not exists source text not null default 'manuel' check (source in ('manuel','meta'))`
  - bucket Storage public `creatives`.

- [ ] **Step 1 :** Écrire `supabase/module-ads.sql`, rejouable (`if not exists`, `on conflict do nothing`), avec RLS activée sur chaque table et les données de départ :
  - `tons` : « Direct et chiffré » (phrases courtes, chiffres en avant, tutoiement exclu, vouvoiement) et « Rassurant » (on s'occupe de tout, pas de jargon).
  - `offres_ads` : `essentiel`, `pro`, `kleak` ; `contenu` et `prix` recopiés de `livrables/offre/fiche-offre.md` (racine du workspace) au moment de l'écriture ; `kleak` porte les deux prix et la note Google « 4,8/5 sur Google ».
  - `avis` : Laura Dias, Mega Content, « Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci ».
  - `tournures_interdites` : `découvrez`, `boostez`, `dans un monde où`, `n'attendez plus`, `et si`, `transformez`, `propulsez`.
- [ ] **Step 2 :** Ajouter les six variables à `.env.example`, sans valeur, avec une ligne de commentaire chacune.
- [ ] **Step 3 :** Faire exécuter le fichier par Edgar dans l'éditeur SQL Supabase (projet `qkjcwjjtirmoffodhuhn`), puis vérifier par une requête `select count(*)` sur `tons`, `offres_ads`, `avis` : 2, 3, 1.
- [ ] **Step 4 :** Commit `Module Ads : schéma (créatives, tons, offres, avis, textes, envois)`.

---

### Task 2 : Logique pure de la bibliothèque de créatives

**Files:**
- Create: `src/lib/ads/creatives.ts`
- Test: `scripts/test-ads-creatives.ts`

**Interfaces:**
- Produces :
  - `type FormatCreative = "1:1" | "4:5" | "9:16"`
  - `formatDepuisDimensions(largeur: number, hauteur: number): FormatCreative | null` : ratio à 2 % près.
  - `lireDimensions(octets: Uint8Array): { largeur: number; hauteur: number } | null` : en-tête PNG (IHDR), JPEG (marqueur SOF0 à SOF15 hors C4, C8, CC), WebP (VP8, VP8L, VP8X). Aucune dépendance ajoutée.
  - `nomDeBase(nomFichier: string): string` : retire l'extension et un suffixe final `-post`, `-story`, `-carre` ; minuscules.
  - `cheminStockage(nomBase: string, format: FormatCreative, ext: string): string` : `${nomBase}/${format.replace(":", "x")}.${ext}`, déterministe pour que le second dépôt remplace le premier.
  - `choisirVisuels(formats: FormatCreative[]): { feed: FormatCreative | null; story: FormatCreative | null }` : feed = 4:5 sinon 1:1 ; story = 9:16 si présent.

- [ ] **Step 1 : Écrire les tests**

```ts
test("formatDepuisDimensions", () => {
  assert.equal(formatDepuisDimensions(1080, 1350), "4:5");
  assert.equal(formatDepuisDimensions(1080, 1920), "9:16");
  assert.equal(formatDepuisDimensions(1080, 1080), "1:1");
  assert.equal(formatDepuisDimensions(1200, 628), null);
});
test("nomDeBase", () => {
  assert.equal(nomDeBase("b-7-jours-999-post.png"), "b-7-jours-999");
  assert.equal(nomDeBase("B-7-jours-999-story.PNG"), "b-7-jours-999");
  assert.equal(nomDeBase("a-un-kleak.jpg"), "a-un-kleak");
});
test("cheminStockage : même créa, même format, même chemin (le second dépôt remplace)", () => {
  assert.equal(cheminStockage("b-7-jours-999", "4:5", "png"), "b-7-jours-999/4x5.png");
  assert.equal(cheminStockage("b-7-jours-999", "4:5", "png"), cheminStockage("b-7-jours-999", "4:5", "png"));
});
test("choisirVisuels", () => {
  assert.deepEqual(choisirVisuels(["1:1", "4:5", "9:16"]), { feed: "4:5", story: "9:16" });
  assert.deepEqual(choisirVisuels(["1:1"]), { feed: "1:1", story: null });
  assert.deepEqual(choisirVisuels(["9:16"]), { feed: null, story: "9:16" });
});
test("lireDimensions : PNG et JPEG réels", () => { /* lire livrables/creas-meta/rendus/post/*.png du workspace (1080x1350 attendu) et un JPEG minimal construit en octets */ });
test("lireDimensions : octets quelconques -> null", () => assert.equal(lireDimensions(new Uint8Array([1, 2, 3])), null));
```

- [ ] **Step 2 :** `node --import ./scripts/alias-hook.mjs --test scripts/test-ads-creatives.ts` : FAIL (module absent).
- [ ] **Step 3 :** Implémenter `src/lib/ads/creatives.ts`.
- [ ] **Step 4 :** Même commande : PASS.
- [ ] **Step 5 :** Commit `Module Ads : logique de la bibliothèque de créatives`.

---

### Task 2b : Rubrique « Ads » dans la navigation

**Files:**
- Modify: `src/lib/navigation.ts`, `src/components/icons.tsx`, `src/components/nav-icons.tsx`, `src/app/globals.css` (règle `.hub-sous-onglets`)
- Create: `src/app/(app)/ads/page.tsx`
- Test: `scripts/test-navigation.ts` (ajouts et mise à jour)

**Interfaces:**
- Produces :
  - `CleIcone` gagne `"ads"` ; `AdsIcon` dans `icons.tsx` (mégaphone, trait fin, `currentColor`, même grille 24 que les autres) ; `NAV_ICONES.ads = AdsIcon`.
  - `RUBRIQUES.ads = { cle: "ads", href: "/ads", libelle: "Ads", icone: "ads", sousOnglets: [{ cle: "creatives", href: "/ads/creatives", libelle: "Créatives" }, { cle: "meta", href: "/ads/meta", libelle: "Meta Ads" }, { cle: "reglages", href: "/ads/reglages", libelle: "Réglages" }] }`. « Nouvelle campagne » n'est pas un sous-onglet : c'est une action (bouton) de `/ads/meta`.
  - `SECTIONS` : nouvelle section `{ titre: "Acquisition", cles: ["ads"] }` insérée entre la section sans titre et « Production ».
  - `ONGLETS_MOBILE` inchangé (`accueil`, `pipeline`, `todo`, `briefs`) : sur iPhone, Ads est dans « Plus ». Choix d'Edgar à confirmer avant exécution ; s'il veut Ads dans la barre du bas, remplacer `briefs` par `ads` dans `ONGLETS_MOBILE` et adapter le test « plus ».
  - `/ads` redirige vers `/ads/creatives` (`redirect` de `next/navigation`).
  - Desktop : `.hub-sous-onglets` gagne `overflow-x: auto` et `scrollbar-width: none` hors media query (mineur reporté de la revue de la refonte : sans lui, des sous-onglets nombreux seraient rognés par `overflow-x: clip` entre 861 et 1000 px).

- [ ] **Step 1 : Tests** (dans `scripts/test-navigation.ts`)

```ts
test("rubrique Ads : sous-onglets et pages imbriquées", () => {
  assert.equal(rubriqueActive("/ads/meta")?.sousOnglet?.cle, "meta");
  assert.equal(rubriqueActive("/ads/creatives/b-7-jours-999")?.sousOnglet?.cle, "creatives");
  const nouvelle = rubriqueActive("/ads/campagnes/nouvelle");
  assert.equal(nouvelle?.rubrique.cle, "ads");
  assert.equal(nouvelle?.sousOnglet, null);
  assert.equal(modeSousOnglets(RUBRIQUES.ads.sousOnglets!.length), "segmente");
});
test("Ads dans la section Acquisition", () => {
  assert.deepEqual(SECTIONS.map((s) => s.titre), [null, "Acquisition", "Production", "Chiffres"]);
});
```

Mettre à jour le test existant « plus contient tout sauf les onglets du bas » : `["ads", "bibliotheque", "analytics", "seo", "reglages"]`.

- [ ] **Step 2 :** `node --import ./scripts/alias-hook.mjs --test scripts/test-navigation.ts` : FAIL.
- [ ] **Step 3 :** Implémenter (navigation, icône, page de redirection, règle CSS).
- [ ] **Step 4 :** Même commande puis `npm test` : PASS.
- [ ] **Step 5 :** Vérifier à l'écran **le premier rendu réel des sous-onglets** (jamais vu depuis la refonte) avec une page provisoire `src/app/(app)/ads/creatives/page.tsx` réduite à un `PageHeader` (remplacée en Tâche 3) :
  - 1440 px : « Ads » dans la section Acquisition de la barre latérale, sous-onglets dépliés dessous, onglets texte soulignés en haut de page ;
  - 390 px : Ads dans la page « Plus », sélecteur segmenté à 3 sous-onglets sous le titre, `scrollWidth <= clientWidth`.
- [ ] **Step 6 :** Commit `Module Ads : rubrique Ads et sous-onglets dans la navigation`.

> **Fusion avec l'onglet Finance :** le worktree `hub-agence-finance` ajoute probablement sa propre rubrique dans `navigation.ts`. Les deux ajouts touchent les mêmes lignes (`RUBRIQUES`, `SECTIONS`, `CleIcone`) : conflit attendu à la fusion, à résoudre en gardant les deux rubriques et en ajustant le test « plus ».

---

### Task 3 : Bibliothèque de créatives (routes, dépôt de l'agent, page)

**Files:**
- Create: `src/lib/ads/creatives-db.ts`, `src/app/api/creatives/route.ts`, `src/app/api/creatives/[id]/route.ts`, `src/app/api/intake/creatives/route.ts`, `src/app/(app)/ads/creatives/page.tsx`, `src/app/(app)/ads/creatives/depot.tsx`
- Test: `scripts/test-ads-creatives.ts` (ajouts)

**Interfaces:**
- Consumes : Tâches 2 et 2b.
- Produces :
  - `enregistrerCreative(p: { octets: Uint8Array; type: string; nomFichier: string; angle?: string | null; accroche?: string | null; source_html?: string | null }): Promise<Creative>` dans `creatives-db.ts` : valide (`validerCapture` de `@/lib/bibliotheque`), lit les dimensions, refuse un format non reconnu avec le message « Format d'image non reconnu (attendu : carré, 4:5 ou story 9:16). », envoie dans le bucket `creatives` avec `upsert: true`, puis `upsert` sur `(nom_base, format)`.
  - `interface Creative { id; nom_base; format: FormatCreative; largeur; hauteur; url: string; angle: string | null; accroche: string | null; created_at }`
  - `listerCreatives(): Promise<Creative[]>`
  - `POST /api/intake/creatives` : en-tête `x-kleak-secret` comparé à `CREAS_INTAKE_SECRET` en temps constant (reprendre `secretValide` de `src/app/api/intake/sheet/route.ts`, l'extraire dans `src/lib/secret.ts` si elle y est privée), multipart `file` + `angle`, `accroche`, `source_html`. 503 si la variable manque, 401 si le secret est faux. Le middleware exclut déjà `api/intake`.
  - `POST /api/creatives` (session Edgar) : multipart, plusieurs `file`.
  - `DELETE /api/creatives/[id]` : retire la ligne et le fichier.
  - Pas de modification de menu : l'entrée « Créatives » existe déjà comme sous-onglet depuis la Tâche 2b.

- [ ] **Step 1 :** Ajouter au test : `secretValide("abc", "abc") === true`, `secretValide("abd", "abc") === false`, `secretValide(null, "abc") === false`, `secretValide("ab", "abc") === false`.
- [ ] **Step 2 :** Lancer : FAIL.
- [ ] **Step 3 :** Implémenter `src/lib/secret.ts`, l'utiliser dans les deux routes d'intake, puis `creatives-db.ts` et les routes.
- [ ] **Step 4 :** Page `/ads/creatives` : halo, `PageHeader` (titre « Ads », sous-titre « Créatives », action « Ajouter » en `buttonStyle`) ; grille groupée par `nom_base` (`gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))"`), une vignette par format avec son étiquette en texte gris, cartes `cardStyle` sans verre ; zone de glisser-déposer multi-fichiers (`depot.tsx`, client) en pointillé `--filet-fort` sur fond `--surface-2` ; bouton supprimer par format en `buttonSecondaireStyle` couleur `--rouge`. Reprendre l'allure de `src/app/(app)/bibliotheque/page.tsx`.
- [ ] **Step 5 :** `npm test` : tout passe (116 tests existants + nouveaux, dont `test-couleurs` et `test-contraste`).
- [ ] **Step 6 :** Vérification à la main, serveur sur 3001, à 1440 et 390 px de large (aucun défilement horizontal) : déposer `livrables/creas-meta/rendus/post/b-7-jours-999-post.png` par la page ; puis `curl -F file=@…/a-un-kleak-post.png -H "x-kleak-secret: $CREAS_INTAKE_SECRET" localhost:3001/api/intake/creatives` (secret lu depuis `.env.local` dans le shell, jamais affiché) ; redéposer le même fichier et constater qu'il n'y a toujours qu'une vignette.
- [ ] **Step 7 :** Documenter l'appel d'intake (URL, en-tête, champs) dans `livrables/creas-meta/README.md` du workspace, pour l'agent créas.
- [ ] **Step 8 :** Commit `Module Ads : bibliothèque de créatives et dépôt par l'agent créas`.

---

### Task 4 : Client Graph Meta et configuration

**Files:**
- Create: `src/lib/ads/meta-graph.ts`, `src/lib/ads/meta-config.ts`
- Modify: `src/lib/source-status.ts`
- Test: `scripts/test-ads-meta.ts`

**Interfaces:**
- Produces :
  - `GRAPH_BASE = "https://graph.facebook.com/v21.0"` (vérifier que v21.0 n'est pas dépréciée ; sinon prendre la plus récente).
  - `type GraphRead = { kind: "ok"; data: any } | { kind: "refus"; status: number; code: number | null; message: string } | { kind: "injoignable"; message: string }`, `graphRead(path: string, token: string): Promise<GraphRead>` : copiés de `livrables/hub/src/lib/meta-campaign.ts` (fonction `graphRead`), plus `graphReadAll(path, token): Promise<GraphRead>` qui suit `paging.next`.
  - `interface MetaConfig { accessToken: string; adAccountId: string; pageId: string }`, `missingMetaEnv(): string[]` (les trois variables `HUB_META_ADS_*` et `HUB_DSA_ENTITY`), `getMetaConfig(): MetaConfig | null`, `getDsaEntity(): string | null`.
  - `isMetaAdsConfigured(): boolean` dans `source-status.ts`.

- [ ] **Step 1 :** Tests : `missingMetaEnv()` liste exactement les variables vides (manipuler `process.env` dans le test puis restaurer) ; `graphRead` sur un `fetch` simulé : 200 → `ok`, 400 avec `{error:{code:190,message:"x"}}` → `refus` code 190, corps illisible → `injoignable`, exception réseau → `injoignable`.
- [ ] **Step 2 :** Lancer : FAIL.
- [ ] **Step 3 :** Implémenter (permettre l'injection de `fetch` en paramètre optionnel, défaut `globalThis.fetch`).
- [ ] **Step 4 :** Lancer : PASS.
- [ ] **Step 5 :** Commit `Module Ads : client Graph Meta et configuration`.

---

### Task 5 : Performances, logique pure (Meta + CRM)

**Files:**
- Create: `src/lib/ads/performances.ts`
- Test: `scripts/test-ads-performances.ts`

**Interfaces:**
- Produces :
  - `OBJECTIFS_PROSPECTS = ["OUTCOME_LEADS", "LEAD_GENERATION"]`
  - `extraireLeads(actions: { action_type: string; value: string }[] | undefined): number` : somme de `lead` ; si absent, `onsite_conversion.lead_grouped` (ne jamais additionner les deux, ce sont des doublons).
  - `interface LigneMeta { ad_id; ad_name; campaign_id; campaign_name; objective: string; spend: number; clicks: number; leads: number; thumbnail: string | null }`
  - `interface CrmParAnnonce { ad_id: string | null; leads: number; rdv: number; ca: number | null }` ; `ad_id: null` = leads non rattachés ; `ca: null` tant que le CRM n'a pas de montant signé.
  - `interface Indicateurs { depense: number; clics: number; leadsMeta: number; cpc: number | null; cpl: number | null; rdv: number | null; coutParRdv: number | null; roas: number | null; ca: number | null }`
  - `calculerIndicateurs(meta: { spend; clicks; leads }, crm: { rdv: number; ca: number | null } | null): Indicateurs` : `cpc` null si 0 clic, `cpl` null si 0 lead, `coutParRdv` null si `crm` null ou 0 RDV, `roas` null si `ca` null.
  - `interface PerfCampagne { campaign_id; campaign_name; indicateurs: Indicateurs; annonces: { ad_id; ad_name; thumbnail; indicateurs: Indicateurs }[] }`
  - `assembler(lignes: LigneMeta[], crm: CrmParAnnonce[]): { campagnes: PerfCampagne[]; nonRattaches: { leads: number; rdv: number } }` : filtre `OBJECTIFS_PROSPECTS`, trie les campagnes par dépense décroissante, somme les annonces pour la campagne.
  - `afficherIndicateur(cle: keyof Indicateurs, i: Indicateurs): string` : `cpl` null avec dépense > 0 → « aucun lead » ; `roas` null → « pas encore de vente » ; autres null → « indisponible » ; montants via `formatCurrency`, ROAS « 2,4 x ».

- [ ] **Step 1 : Tests**

```ts
test("extraireLeads ne double pas lead et lead_grouped", () => {
  assert.equal(extraireLeads([{ action_type: "lead", value: "3" }, { action_type: "onsite_conversion.lead_grouped", value: "3" }]), 3);
  assert.equal(extraireLeads([{ action_type: "onsite_conversion.lead_grouped", value: "2" }]), 2);
  assert.equal(extraireLeads(undefined), 0);
});
test("pub qui a dépensé sans lead : CPL 'aucun lead'", () => {
  const i = calculerIndicateurs({ spend: 12, clicks: 30, leads: 0 }, { rdv: 0, ca: null });
  assert.equal(i.cpl, null);
  assert.equal(afficherIndicateur("cpl", i), "aucun lead");
  assert.equal(afficherIndicateur("roas", i), "pas encore de vente");
});
test("coût par RDV et ROAS", () => {
  const i = calculerIndicateurs({ spend: 50, clicks: 100, leads: 10 }, { rdv: 2, ca: 1800 });
  assert.equal(i.cpl, 5); assert.equal(i.cpc, 0.5); assert.equal(i.coutParRdv, 25); assert.equal(i.roas, 36);
});
test("assembler : filtre les campagnes hors prospects, regroupe par campagne, isole les non rattachés", () => {
  // 2 annonces OUTCOME_LEADS dans la campagne c1, 1 annonce POST_ENGAGEMENT dans c2,
  // crm : ad1 2 leads 1 rdv, null 3 leads 1 rdv
  // attendu : une seule campagne c1, dépense = somme, rdv = 1 ; nonRattaches = { leads: 3, rdv: 1 }
});
```

- [ ] **Step 2 :** Lancer : FAIL.
- [ ] **Step 3 :** Implémenter.
- [ ] **Step 4 :** Lancer : PASS.
- [ ] **Step 5 :** Commit `Module Ads : calcul des performances`.

---

### Task 6 : Page de suivi des performances

**Files:**
- Create: `src/lib/ads/insights.ts`, `src/lib/ads/attribution-db.ts`, `src/app/(app)/ads/meta/page.tsx`, `src/app/(app)/ads/meta/tableau.tsx`, `src/app/(app)/ads/meta/liste-mobile.tsx`
- Modify: `src/lib/crm/db.ts` (extraire la pagination par lots de `chiffresDuMois` si besoin de la réutiliser), `src/lib/period.ts`

**Interfaces:**
- Consumes : Tâches 4 et 5, `parsePeriod` / `PeriodSelector` / `RefreshButton` / `NotConnected` existants.
- Produces :
  - `lireLignesMeta(config: MetaConfig, range: DateRange): Promise<{ ok: true; lignes: LigneMeta[] } | { ok: false; message: string }>` : `insights?level=ad&fields=ad_id,ad_name,campaign_id,campaign_name,objective,spend,clicks,actions&time_range=…`, puis miniatures par `/{ad_id}?fields=creative{thumbnail_url}` en un appel groupé (`?ids=`).
  - `crmParAnnonce(range: DateRange): Promise<CrmParAnnonce[]>` : leads dont `lead_cree_le` est dans la période, groupés par `ad_id` ; RDV = comptes distincts ayant au moins un événement `rdv_reserve` (même définition que `chiffresDuMois`) ; `ca: null` partout tant que la phase 2 n'existe pas.
- Page `/ads/meta` : halo ; `PageHeader` (titre « Ads », action « Nouvelle campagne » en `buttonStyle` vers `/ads/campagnes/nouvelle`) ; `PeriodSelector` (7 j, 30 j, mois en cours, dates libres ; ajouter la clé `mois` à `PeriodKey` et à `parsePeriod` dans `src/lib/period.ts` si l'onglet Finance ne l'a pas déjà fait, vérifier avant) ; bloc de synthèse de la période (dépense, leads, CPL, coût par RDV) dans un `Readout` (déjà en verre) ou une `div.hub-verre` ; tableau des campagnes (dépense, leads, CPL, CPC, coût par RDV, ROAS) dans `.hub-scroll-x`, chiffres en `.hub-mono`, filets `--filet`, clic sur une ligne pour déplier ses annonces avec miniature ; ligne « Leads non rattachés à une pub » ; phrase sous le tableau : « Seules les campagnes de prospects sont comptées. »
- **Sous 860 px**, le tableau est masqué et remplacé par `liste-mobile.tsx` : un groupe `.hub-groupe` par campagne, une ligne par indicateur clé (dépense, leads, CPL, coût par RDV), annonces dépliables. Même règle que le Pipeline : les données sont calculées côté serveur et passées en objets simples (aucune `Date` vers un composant client).
- Si `missingMetaEnv()` non vide : composant `NotConnected` avec la liste des variables. Si `lireLignesMeta` rend `ok: false` (jeton expiré code 190, droits manquants) : bandeau avec le message de Meta, chiffres « indisponible », pas d'exception.

- [ ] **Step 1 :** Ajouter à `scripts/test-ads-meta.ts` : `lireLignesMeta` avec `fetch` simulé renvoyant `{error:{code:190}}` → `ok: false` et message contenant « jeton » ; renvoyant deux pages (`paging.next`) → toutes les lignes.
- [ ] **Step 2 :** Lancer : FAIL. Implémenter. Lancer : PASS.
- [ ] **Step 3 :** Construire la page (aucun menu à toucher). Captures à 1440 et 390 px.
- [ ] **Step 4 :** Vérifier à la main sur le vrai compte (après Tâche 0) : les chiffres d'une campagne sur 30 jours sont égaux à ceux du Gestionnaire de publicités pour la même période. Si la première campagne manuelle n'a pas encore tourné, le vérifier sur une ancienne campagne du compte en retirant temporairement le filtre d'objectif, puis le remettre.
- [ ] **Step 5 :** `npm test` : PASS. Commit `Module Ads : page de suivi Meta Ads`.

---

### Task 7 : Dépense mensuelle depuis Meta

**Files:**
- Create: `src/lib/ads/depenses.ts`
- Modify: `src/lib/crm/db.ts` (`enregistrerDepense` pose `source: "manuel"`), `src/app/(app)/ads/meta/page.tsx`, `src/app/(app)/dashboard/page.tsx` (mention « (Meta) » ou « (saisie) » à côté du coût par lead, en texte `--texte-2`)
- Test: `scripts/test-ads-performances.ts` (ajouts)

**Interfaces:**
- Produces :
  - `decisionDepense(existante: { montant: number; source: "manuel" | "meta" } | null, montantMeta: number): { action: "ecrire" | "garder"; ecart: number | null }` : `null` ou `meta` → écrire ; `manuel` → garder, `ecart = montantMeta - montant` si l'écart dépasse 1 €, sinon `null`.
  - `synchroniserDepenses(config: MetaConfig, mois: string[]): Promise<{ mois: string; action: "ecrire" | "garder"; ecart: number | null }[]>` : dépense des campagnes prospects par mois (`insights?level=campaign&fields=objective,spend&time_range` du mois), puis upsert `source: "meta"` si `ecrire`.
- Appelée au chargement de `/ads/meta` pour le mois en cours et le précédent. Si un écart existe, bandeau au style de l'Accueil (`.hub-bandeau`, point `--orange`) : « Mois de <mois> : saisie manuelle de X €, Meta indique Y €. La saisie manuelle est conservée. »

- [ ] **Step 1 :** Tests : `decisionDepense(null, 40)` → écrire ; `({montant: 30, source: "meta"}, 40)` → écrire ; `({montant: 30, source: "manuel"}, 40)` → garder, écart 10 ; `({montant: 30, source: "manuel"}, 30.5)` → garder, écart null.
- [ ] **Step 2 :** Lancer : FAIL. Implémenter. Lancer : PASS.
- [ ] **Step 3 :** Vérifier à la main : saisir 1 € pour le mois en cours depuis l'Accueil, ouvrir `/ads/meta`, constater le bandeau d'écart et que `depenses_pub` vaut toujours 1 € en `manuel`. Supprimer la ligne ensuite.
- [ ] **Step 4 :** Commit `Module Ads : dépense mensuelle remplie depuis Meta`.

---

### Task 8 : Garde-fous des textes (logique pure)

**Files:**
- Create: `src/lib/ads/garde-fous.ts`
- Test: `scripts/test-ads-garde-fous.ts`

**Interfaces:**
- Produces :
  - `INTERDITS_FIXES = ["49 €/mois", "n°1 des agences framer", "+50 % de clients"]` (comparaison insensible à la casse, espaces normalisés).
  - `trouverTirets(texte: string): string[]` : occurrences de `—`, `–`, et d'un `-` entouré d'espaces.
  - `remplacerTirets(texte: string): string` : chaque tiret de ponctuation devient `, ` (sans double espace ni virgule doublée).
  - `extrairePrix(texte: string): number[]` : « 999 € », « 999€ », « 999 euros », « 1 800 € » (espace fine ou insécable incluses), « 1800 € ».
  - `interface Verdict { ok: boolean; problemes: string[] }`
  - `verifierTexte(texte: string, ctx: { prixOffre: number[]; tournures: string[]; avis: string[] }): Verdict` : tirets, tournures (début de mot, insensible aux accents et à la casse), plus de 2 emojis, prix hors offre, interdits fixes, citation entre « » qui n'est pas mot pour mot un avis.

- [ ] **Step 1 : Tests**

```ts
test("tirets de ponctuation détectés, mots composés permis", () => {
  assert.equal(trouverTirets("Votre site — livré en 7 jours").length, 1);
  assert.equal(trouverTirets("Votre site – livré").length, 1);
  assert.equal(trouverTirets("Votre site - livré").length, 1);
  assert.deepEqual(trouverTirets("Un site sur-mesure, clé-en-main"), []);
});
test("remplacerTirets", () => assert.equal(remplacerTirets("Votre site — livré en 7 jours"), "Votre site, livré en 7 jours"));
test("extrairePrix", () => {
  assert.deepEqual(extrairePrix("Dès 999€ ou 1 800 €"), [999, 1800]);
  assert.deepEqual(extrairePrix("1800 euros"), [1800]);
});
test("prix hors offre rejeté", () => {
  const v = verifierTexte("Votre site à 1 500 €", { prixOffre: [999], tournures: [], avis: [] });
  assert.equal(v.ok, false);
});
test("tournure interdite, insensible aux accents et à la casse", () => {
  assert.equal(verifierTexte("DECOUVREZ notre offre", { prixOffre: [], tournures: ["découvrez"], avis: [] }).ok, false);
});
test("interdits fixes", () => {
  assert.equal(verifierTexte("Le N°1 des agences Framer", { prixOffre: [], tournures: [], avis: [] }).ok, false);
});
test("citation inventée rejetée, citation exacte acceptée", () => {
  const avis = ["Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci"];
  assert.equal(verifierTexte("« Un prestataire génial »", { prixOffre: [], tournures: [], avis }).ok, false);
  assert.equal(verifierTexte(`« ${avis[0]} »`, { prixOffre: [], tournures: [], avis }).ok, true);
});
test("plus de 2 emojis rejeté", () => {
  assert.equal(verifierTexte("Top 🚀🔥✨", { prixOffre: [], tournures: [], avis: [] }).ok, false);
});
```

- [ ] **Step 2 :** Lancer : FAIL. Implémenter. Lancer : PASS.
- [ ] **Step 3 :** Commit `Module Ads : garde-fous des textes d'annonce`.

---

### Task 9 : Générateur de textes (Groq)

**Files:**
- Create: `src/lib/ads/llm.ts`, `src/lib/ads/textes.ts`, `src/lib/ads/textes-db.ts`, `src/app/api/ads/textes/route.ts`
- Test: `scripts/test-ads-textes.ts`

**Interfaces:**
- Consumes : Tâche 8, tables de la Tâche 1.
- Produces :
  - `ADS_TEXT_MODEL` (constante unique, identifiant noté en Tâche 0), `ADS_TEXT_VOIT_IMAGE: boolean`.
  - `genererTexte(p: { systeme: string; utilisateur: string; imageUrl?: string | null }, fetchImpl?: typeof fetch): Promise<{ ok: true; texte: string } | { ok: false; message: string }>` : appel Groq `chat/completions`, `response_format: { type: "json_object" }`, image en `image_url` si `ADS_TEXT_VOIT_IMAGE`. 429 → « Groq limite les appels gratuits, réessaie dans une minute. » ; autre échec → message lisible.
  - `ANGLES = [{ cle: "prix_delai", libelle: "Prix et délai" }, { cle: "tranquillite", libelle: "On s'occupe de tout" }, { cle: "avis", libelle: "Preuve par les avis" }]`
  - `interface VersionTexte { angle: string; texte_principal: string; titre: string; description: string; problemes: string[] }`
  - `construirePrompt(ctx: { ton: { nom; description }; offre: { nom; contenu; prix: number[] }; avis: { auteur; entreprise; texte }[]; tournures: string[]; exemples: { texte_principal; titre; description }[]; creative: { nom_base; angle; accroche }; angle?: string; consigne?: string }): { systeme: string; utilisateur: string }` : le système contient les règles (pas de tiret, liste noire, interdits, citer les avis mot pour mot seulement, vouvoiement, limites : titre 40 caractères, description 30, texte principal 125 conseillés), l'offre, les avis, au plus 6 exemples validés les plus récents.
  - `analyserReponse(brut: string): VersionTexte[] | null` : JSON `{ versions: [...] }`, champs texte obligatoires.
  - `genererVersions(ctx, opts: { angle?: string; consigne?: string }, appel = genererTexte): Promise<{ ok: true; versions: VersionTexte[] } | { ok: false; message: string }>` : sans `angle`, 3 versions (une par angle) ; avec `angle`, une seule. Pour chaque version : `verifierTexte` ; si échec, une régénération ; si les tirets persistent, `remplacerTirets` ; les autres problèmes restants sont rendus dans `problemes` (affichés en avertissement, pas masqués).
  - `POST /api/ads/textes { creative_id, ton_id, offre_id, angle?, consigne? }` → `{ versions }` ou `{ error }` (502 si Groq échoue). Rien n'est écrit en base à ce stade.

- [ ] **Step 1 :** Tests avec un `appel` simulé :
  - réponse valide à 3 versions sans problème → 3 versions, `problemes` vides ;
  - première réponse avec « — », seconde aussi → texte final sans `—`, contenant `, ` à la place ;
  - première réponse avec « 1 500 € » (offre 999), seconde idem → version rendue avec un `problemes` non vide ;
  - JSON illisible deux fois → `ok: false` ;
  - `appel` rendant `{ ok: false, message: "Groq limite…" }` → `ok: false` avec ce message ;
  - `construirePrompt` contient le texte de l'avis de Laura Dias, le mot « tiret », et pas plus de 6 exemples quand on lui en passe 10.
- [ ] **Step 2 :** Lancer : FAIL. Implémenter. Lancer : PASS.
- [ ] **Step 3 :** Essai réel : un appel avec la créa B, ton « Direct et chiffré », offre Essentiel. Lire les 3 versions, noter dans le résumé de tâche si le modèle a vu l'image (le texte parle-t-il du visuel ?).
- [ ] **Step 4 :** Commit `Module Ads : générateur de textes d'annonce (Groq)`.

---

### Task 10 : Écrans du générateur et réglages Ads

**Files:**
- Create: `src/app/(app)/ads/creatives/[nom]/page.tsx`, `src/app/(app)/ads/creatives/[nom]/generateur.tsx`, `src/app/(app)/ads/reglages/page.tsx`, `src/app/api/ads/reglages/route.ts`, `src/app/api/ads/textes/valider/route.ts`
- Modify: `src/lib/ads/textes-db.ts`

**Interfaces:**
- Consumes : Tâches 3 et 9.
- Produces :
  - Page d'une créa (`/ads/creatives/<nom>`, le sous-onglet « Créatives » reste actif) : ses formats, choix du ton et de l'offre en pastilles (`pillStyle`), bouton « Écrire les textes » (`buttonStyle`), 3 cartes modifiables (`cardStyle`, champs `inputStyle`, compteur de caractères en `--texte-3`, en `--rouge` au-delà de la limite), avertissements `problemes` en texte `--orange-texte` précédé d'un point `--orange`, sous chaque carte un champ consigne + « Relancer cette version » (`buttonSecondaireStyle`), bouton « Garder ce texte » qui enregistre dans `textes_annonce` (sans `valide_le`). Sur iPhone, les 3 cartes s'empilent.
  - Si `ADS_TEXT_VOIT_IMAGE` est faux : bandeau `.hub-bandeau` (point `--texte-3`) « Le modèle ne voit pas l'image, il écrit à partir du nom et de l'accroche de la créa. »
  - `/ads/reglages` : quatre sections (`.hub-section-titre`), chacune en groupe `.hub-groupe` modifiable (ajout, suppression, édition) : tons, offres (nom, contenu, prix), avis, tournures interdites.
  - `marquerValides(ids: string[]): Promise<void>` dans `textes-db.ts` (pose `valide_le`), utilisée par la Tâche 12.

- [ ] **Step 1 :** Construire les écrans et la route de réglages (validation : nom et texte non vides, prix entiers positifs).
- [ ] **Step 2 :** Vérification à la main : générer, retoucher, relancer une version avec « plus court », garder ; ajouter une tournure dans les réglages et constater qu'une génération qui l'emploie remonte un avertissement.
- [ ] **Step 3 :** `npm test` : PASS. Captures à 1440 et 390 px. Commit `Module Ads : écrans du générateur et réglages`.

---

### Task 11 : Création de campagne Prospects en pause (lib)

**Files:**
- Create: `src/lib/ads/meta-campaign.ts` (copie adaptée de `livrables/hub/src/lib/meta-campaign.ts`)
- Test: `scripts/test-ads-campaign.ts` (copie adaptée de `livrables/hub/scripts/test-meta-campaign.ts`)

**Interfaces:**
- Consumes : Tâches 2 (`choisirVisuels`) et 4 (`MetaConfig`, `getDsaEntity`, `graphRead`).
- Produces :
  - `DEFAULT_DAILY_BUDGET_EUR = 7`, `DEFAULT_AGE_MIN = 25`, `DEFAULT_AGE_MAX = 65`, `DEFAULT_COUNTRIES = ["FR"]`, `HEADLINE_MAX = 40`, `PRIMARY_TEXT_SOFT_MAX = 125`, `DESCRIPTION_SOFT_MAX = 30`.
  - `CTA_CHOICES` : `SIGN_UP` (« S'inscrire »), `LEARN_MORE` (« En savoir plus »), `GET_QUOTE` (« Obtenir un devis », défaut), `CONTACT_US` (« Nous contacter »).
  - `interface AdInput { nomBase: string; adName: string; feedImageUrl: string | null; storyImageUrl: string | null; primaryText: string; headline: string; description: string; cta: CtaValue; texteIds: string[] }`
  - `interface CampaignInput { campaignName: string; dailyBudgetEur: number; countries: string[]; regions: string[]; ageMin: number; ageMax: number; leadFormId: string; ads: AdInput[] }`
  - `validateCampaignInput(input): string[]` : nom non vide, budget ≥ 1 €, âge 18 à 65, au moins une annonce, formulaire choisi, chaque annonce a au moins un visuel, titre ≤ 40, et `trouverTirets` vide sur les trois textes.
  - `buildCampaignPayload` : `objective: "OUTCOME_LEADS"`, `special_ad_categories: []`, `is_adset_budget_sharing_enabled: false`, `PAUSED`.
  - `buildAdSetPayload` : nom `${campaignName} | Prospection`, `daily_budget` en centimes, `billing_event: "IMPRESSIONS"`, `optimization_goal: "LEAD_GENERATION"`, `destination_type: "ON_AD"`, `promoted_object: { page_id }`, `bid_strategy: "LOWEST_COST_WITHOUT_CAP"`, ciblage `geo_locations` (pays, ou `regions` si non vide), âges, `targeting_automation: { advantage_audience: 0 }` (garde les bornes d'âge posées), DSA payeur et bénéficiaire = `getDsaEntity()`, `PAUSED`.
  - `buildAdCreativePayload(config, ad, hashes: { feed: string | null; story: string | null })` : formulaire via `call_to_action: { type: cta, value: { lead_gen_form_id } }`, `degrees_of_freedom_spec` en `OPT_OUT`. Si `feed` et `story` existent : personnalisation des placements (`asset_feed_spec` avec deux images et `asset_customization_rules` feed / story) ; si un seul visuel : `object_story_spec.link_data` classique. **À valider contre l'API réelle en Tâche 13** ; si la forme à deux visuels est refusée, se rabattre sur le visuel feed seul et le signaler à Edgar.
  - `buildAdPayload` : identique à l'ecom, nom ` | ` au lieu de `—`.
  - `listerFormulaires(config): Promise<{ ok: true; formulaires: { id: string; nom: string; statut: string }[] } | { ok: false; message: string }>` : `/{page_id}/leadgen_forms?fields=id,name,status`, actifs seulement (si Meta exige un jeton de Page, l'obtenir par `/{page_id}?fields=access_token` avec le jeton utilisateur système).
  - `createPausedCampaign(config, input): Promise<CreateCampaignResult>` : même déroulé et même `CreateCampaignResult` que l'ecom (visuels, campagne, ensemble, créatifs, annonces ; en cas d'échec, retour arrière et liste `leftovers`).
  - `lienGestionnaire(adAccountId: string, campaignId: string): string` : `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=<id sans act_>&selected_campaign_ids=<campaignId>`.
  - `runPreflight()` repris de l'ecom, avec en plus la vérification que `listerFormulaires` répond.

- [ ] **Step 1 :** Copier et adapter le test ecom. Garder : aucune charge utile construite ne contient la chaîne `ACTIVE` ; `assertPaused` jette sur un statut falsifié ; le statut ne peut pas venir de l'entrée. Ajouter :

```ts
test("ensemble de publicités Prospects", () => {
  const p = buildAdSetPayload(entree(), "c1");
  assert.equal(p.optimization_goal, "LEAD_GENERATION");
  assert.equal(p.destination_type, "ON_AD");
  assert.deepEqual(p.promoted_object, { page_id: "p1" });
  assert.equal(p.dsa_payor, "Kleak Agency");
  assert.equal(p.dsa_beneficiary, "Kleak Agency");
  assert.equal((p.targeting as any).age_min, 25);
});
test("le créatif porte le formulaire", () => {
  assert.match(JSON.stringify(buildAdCreativePayload(cfg, annonce(), { feed: "h1", story: null })), /"lead_gen_form_id":"f1"/);
});
test("aucun tiret long dans les noms créés", () => {
  for (const p of [buildAdSetPayload(entree(), "c1"), buildAdCreativePayload(cfg, annonce(), { feed: "h1", story: "h2" }), buildAdPayload(annonce(), "s1", "cr1")]) {
    assert.doesNotMatch(String(p.name), /[—–]/);
  }
});
test("validateCampaignInput refuse un texte avec un tiret de ponctuation et une campagne sans formulaire", () => { /* … */ });
test("lienGestionnaire", () => assert.equal(lienGestionnaire("act_123", "456"), "https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=123&selected_campaign_ids=456"));
```

- [ ] **Step 2 :** Lancer : FAIL. Implémenter. Lancer : PASS.
- [ ] **Step 3 :** Commit `Module Ads : création de campagne Prospects en pause`.

---

### Task 12 : Écran de création de campagne

**Files:**
- Create: `src/app/(app)/ads/campagnes/nouvelle/page.tsx`, `src/app/(app)/ads/campagnes/nouvelle/formulaire.tsx`, `src/app/api/ads/campagnes/route.ts`, `src/app/api/ads/formulaires/route.ts`

**Interfaces:**
- Consumes : Tâches 3, 10, 11.
- Produces :
  - Page `/ads/campagnes/nouvelle` : pas de sous-onglet propre (la rubrique Ads reste active, on y arrive par le bouton « Nouvelle campagne » de `/ads/meta`) ; `PageHeader` titre « Nouvelle campagne », eyebrow « Ads ». Formulaire en sections `cardStyle`, champs `inputStyle`, cases et boutons d'appel à l'action en pastilles : nom de campagne prérempli `Kleak | <libellé> | AAAA-MM-JJ` ; choix des créatives (cases), pour chacune la liste des textes gardés (`textes_annonce`) ; budget par jour (défaut 7 €) ; pays France, âge 25 à 65 (modifiables), champ libre région ; formulaire instantané (liste de `GET /api/ads/formulaires`) ; bouton d'appel à l'action ; rappel en haut en `.hub-bandeau` (point `--accent`) : « La campagne est créée en pause. Rien ne diffuse tant que tu ne l'actives pas dans le Gestionnaire. »
  - `POST /api/ads/campagnes` : `validateCampaignInput`, `createPausedCampaign`, enregistre `envois_campagne` (succès ou échec, avec les objets créés), et en cas de succès appelle `marquerValides` sur les textes utilisés.
  - Après succès : lien « Ouvrir dans le Gestionnaire » (`lienGestionnaire`). Après échec : l'étape (`failedAt`), le message de Meta, et la liste `leftovers` s'il en reste.
  - Si `missingMetaEnv()` non vide : `NotConnected`.

- [ ] **Step 1 :** Construire.
- [ ] **Step 2 :** `npm test` : PASS. Captures à 1440 et 390 px. Commit `Module Ads : écran de création de campagne`.

---

### Task 13 : Validation réelle avec Edgar

- [ ] **Step 1 :** Lancer le preflight depuis l'écran : compte actif, droits d'écriture, formulaires listés.
- [ ] **Step 2 :** Envoyer une campagne de test (1 créa en 4:5 et 9:16, budget 1 €, formulaire réel). Vérifier avec Edgar dans le Gestionnaire : statut en pause partout, objectif Prospects, formulaire branché, DSA « Kleak Agency », aperçus feed et story corrects, textes sans tiret.
- [ ] **Step 3 :** Si Meta refuse une charge utile, corriger le constructeur concerné, ajouter un test qui fige la forme acceptée, recommencer.
- [ ] **Step 4 :** Faire supprimer la campagne de test par Edgar.
- [ ] **Step 5 :** Mettre à jour le commentaire d'en-tête de `src/lib/ads/meta-campaign.ts` (« CE QUI A ÉTÉ VÉRIFIÉ EN RÉEL », date). Commit `Module Ads : validé en réel sur le compte Kleak`.
- [ ] **Step 6 :** Revue de toute la branche. Edgar pose les six variables sur Vercel en Preview et en Production par script (`--no-sensitive` pour les identifiants qui ne sont pas secrets). Pousser la branche, Edgar valide sur la prévisualisation (Mac et iPhone), puis fusion dans `main` (déploiement de production).
