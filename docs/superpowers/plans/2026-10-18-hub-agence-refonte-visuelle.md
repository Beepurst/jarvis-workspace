# Hub Agence : refonte visuelle, plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Passer tout le Hub Agence en thème clair « structure Notion, finition Apple », avec barre latérale en texte sur Mac, barre d'onglets en bas sur iPhone, sous-onglets, et un jeu unique de variables de couleur.

**Architecture:** Un fichier de variables (`src/app/theme.css`) devient la seule source des couleurs, rayons et ombres. Un module de navigation pur (`src/lib/navigation.ts`, sans JSX, testé sous Node) remplace `src/lib/channels.tsx` et alimente la barre latérale, la barre d'onglets, la page « Plus » et les sous-onglets. Les écrans gardent leur structure, seuls leurs styles changent, sauf le Pipeline iPhone (liste groupée) et la fiche compte (sélecteur d'étape).

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 4 + CSS classique, tests `node --test` (Node 26, TypeScript natif, alias via `scripts/alias-hook.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-18-hub-agence-refonte-visuelle-design.md` (racine du workspace `jarvis-kleak`). Maquettes : `livrables/hub-agence/.superpowers/brainstorm/86639-1792355263/content/direction.html` (option C), `mobile.html` (option A), `sous-onglets.html`.

Tous les chemins de code ci-dessous sont relatifs à `livrables/hub-agence/`.

## Global Constraints

- Thème clair uniquement. Pas de `prefers-color-scheme: dark`, pas de bascule.
- Police système uniquement : `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. Aucune police téléchargée.
- Aucune nouvelle dépendance npm.
- Interdits visuels (anti-objectifs de la spec) : dégradés, lueurs, verre dépoli décoratif, ombres marquées, une couleur par rubrique, icônes dans la barre latérale, étiquettes en monospace, emojis.
- Aucune couleur écrite en dur hors de `src/app/theme.css` (vérifié par `scripts/test-couleurs.ts`, tâche 12).
- Pas de changement fonctionnel, sauf le sélecteur d'étape ajouté en haut de la fiche compte.
- Les règles `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` sont adaptées, pas supprimées.
- Texte courant au contraste WCAG AA (4,5:1 sur blanc).
- Travail sur la branche `refonte-visuelle` du dépôt `livrables/hub-agence` (dépôt indépendant, jamais commité depuis la racine du workspace). Un push sur `main` déploie en production : on ne fusionne qu'après validation d'Edgar.
- Ne jamais lancer `npm run build` pendant qu'un `npm run dev` tourne.
- Les 98 tests existants restent verts : `npm test`.

## Valeurs fixées (reprises des maquettes)

Variables de `src/app/theme.css`, noms exacts à utiliser partout :

| Variable | Valeur | Usage |
|---|---|---|
| `--fond` | `#FBFBFA` | fond de l'application, derrière la page |
| `--page` | `#FFFFFF` | page flottante, cartes, groupes |
| `--surface-2` | `#F5F5F7` | champs, sélecteur segmenté, colonnes |
| `--survol` | `#EFEFEE` | survol et rubrique active |
| `--texte` | `#1D1D1F` | texte principal |
| `--texte-2` | `#6E6E73` | texte secondaire (≥ 4,5:1) |
| `--texte-3` | `#8A8A8E` | libellés de section, métadonnées non essentielles |
| `--filet` | `#ECECEB` | bordures et séparateurs |
| `--filet-fort` | `#D2D2D0` | bordure au survol, champs |
| `--accent` | `#007AFF` | liens, action principale, onglet actif iPhone |
| `--rouge` | `#FF3B30` | erreurs, « urgent » |
| `--orange` | `#FF9F0A` | « aujourd'hui » |
| `--vert` | `#34C759` | succès |
| `--ombre-page` | `0 0 0 1px rgba(0,0,0,.05), 0 2px 8px rgba(0,0,0,.04)` | page flottante |
| `--ombre-carte` | `0 1px 2px rgba(0,0,0,.05)` | cartes, segment actif |
| `--r-sm` / `--r-md` / `--r-lg` | `6px` / `9px` / `12px` | rayons |

Points d'étape (`COULEUR_ETAPE`, tâche 7) : `nouveau_lead` `#A1A1A6`, `rdv_pris` `#007AFF`, `devis_envoye` `#FF9F0A`, `acompte_paye` `#34C759`, `en_production` `#AF52DE`, `livre` `#30B0C7`, `solde` `#248A3D`, `perdu` `#FF3B30`. Ils sont déclarés dans `theme.css` sous `--etape-<cle>` et référencés en `var(--etape-<cle>)`.

Point de rupture mobile : `860px` (celui déjà utilisé par `globals.css`).

## Review Focus

1. Pages imbriquées (`/comptes/<id>`, `/briefs/<id>`) : la rubrique parente (Pipeline, Briefs) doit rester active dans la barre latérale et la barre d'onglets. Testé dans la tâche 2.
2. Contenu caché sous la barre d'onglets iPhone ou sous l'encoche : le bas de chaque page doit rester lisible au-dessus de la barre et de l'indicateur d'accueil. Vérifié dans la tâche 4.
3. Noms d'entreprise très longs dans les lignes iPhone et les cartes : ils se coupent ou s'abrègent, la page ne défile jamais horizontalement. Vérifié dans les tâches 7 et 12.
4. Rubrique à plus de 4 sous-onglets : le sélecteur segmenté devient des pastilles qui défilent. Testé dans la tâche 2.
5. Réglage iOS « Réduire la transparence » : la barre d'onglets devient opaque. Vérifié dans la tâche 4.

## Structure des fichiers

- Create `src/app/theme.css` : variables uniquement.
- Create `src/lib/navigation.ts` : description des rubriques et fonctions pures. Remplace `src/lib/channels.tsx` (supprimé).
- Create `src/components/nav-icons.tsx` : correspondance clé d'icône vers composant (`src/components/icons.tsx`) pour la barre d'onglets uniquement.
- Create `src/components/tab-bar.tsx` : barre d'onglets iPhone.
- Create `src/app/(app)/plus/page.tsx` : liste « Plus ».
- Create `src/components/ui/sous-onglets.tsx` : sous-onglets (onglets texte sur Mac, segmenté ou pastilles sur iPhone).
- Create `src/components/ui/chiffres.tsx` : ligne de chiffres en haut de page.
- Create `src/app/(app)/pipeline/liste-mobile.tsx` : Pipeline en liste groupée.
- Create `scripts/test-navigation.ts`, `scripts/test-couleurs.ts`.
- Modify : `globals.css`, `layout.tsx`, `public/manifest.json`, `sidebar.tsx`, `app-shell.tsx`, `page-header.tsx`, `pill.ts`, `form-styles.ts`, `lib/crm/affichage.ts`, tous les écrans et composants `ui/`, `todo-board.css`, `kpi-card.css`, `not-connected.css`, graphiques.

---

### Task 1: Branche, variables et socle clair

**Files:**
- Create: `src/app/theme.css`
- Modify: `src/app/globals.css`, `src/app/layout.tsx:11-28`, `public/manifest.json:9-10`

**Interfaces:**
- Produces: les variables du tableau « Valeurs fixées », disponibles partout. Classes de base : `body` sur `var(--fond)`, couleur `var(--texte)`, police système.

- [ ] **Step 1: Créer la branche**

Run: `git checkout -b refonte-visuelle`
Expected: `Switched to a new branch 'refonte-visuelle'`

- [ ] **Step 2: Écrire `src/app/theme.css`** avec un bloc `:root` contenant exactement les variables du tableau « Valeurs fixées » et les huit `--etape-*`. Rien d'autre dans ce fichier.

- [ ] **Step 3: Refaire le socle de `globals.css`**
  - `@import "./theme.css";` juste après `@import "tailwindcss";`.
  - Le bloc `@theme inline` pointe vers les nouvelles variables (`--color-background: var(--fond)`, `--color-foreground: var(--texte)`, `--color-card: var(--page)`, `--color-input: var(--surface-2)`, `--color-accent: var(--accent)`, `--color-muted: var(--texte-2)`, `--color-border: var(--filet)`, `--color-success: var(--vert)`, `--color-error: var(--rouge)`), pour que les usages Tailwind existants suivent.
  - Supprimer la section « MATIERE » (couche d'ambiance `.hub-ambient`, variables `--glass-*`, `backdrop-filter`) et la section « Signature de marque : bouton à anneau conique » (`.btn-accent*`). Garder `--font-mono` seulement s'il sert encore à des chiffres, sinon le retirer.
  - `body` : `font-family` système (Global Constraints), `-webkit-font-smoothing: antialiased`, `font-feature-settings` neutres.
  - Adapter le bloc `prefers-contrast: more` (filets passés à `--filet-fort`, `--texte-2` à `--texte`) et retirer de `prefers-reduced-transparency` ce qui visait le verre.

- [ ] **Step 4: PWA claire**
  - `layout.tsx` : `themeColor: "#FBFBFA"`, `appleWebApp.statusBarStyle: "default"`, commentaire à jour (barre de statut sombre sur fond clair). Garder `viewportFit: "cover"`.
  - `manifest.json` : `background_color` et `theme_color` à `#FBFBFA`.
  - Regarder `public/icons/` : si les icônes sont sur fond noir, le noter pour le rapport final à Edgar, ne pas les redessiner.

- [ ] **Step 5: Vérifier**

Run: `npm test`
Expected: tous les tests passent.
Puis `npm run dev`, ouvrir `http://localhost:3000/dashboard` (l'authentification est désactivée en développement) : fond clair, plus aucune traînée lumineuse. Le reste de l'interface peut être cassé visuellement à ce stade.

- [ ] **Step 6: Commit**

```bash
git add src/app/theme.css src/app/globals.css src/app/layout.tsx public/manifest.json
git commit -m "Refonte : variables du theme clair, retrait du verre et de l'ambiance"
```

---

### Task 2: Modèle de navigation

**Files:**
- Create: `src/lib/navigation.ts`, `scripts/test-navigation.ts`
- Delete: `src/lib/channels.tsx` (après avoir repris ses usages dans les tâches 3 à 5 ; dans cette tâche, `channels.tsx` reste en place pour ne pas casser la compilation)

**Interfaces:**
- Produces:

```ts
export type CleIcone = "accueil" | "pipeline" | "todo" | "briefs" | "bibliotheque" | "analytics" | "seo" | "reglages" | "plus";
export interface SousOnglet { cle: string; href: string; libelle: string }
export interface Rubrique { cle: string; href: string; libelle: string; icone: CleIcone; sousOnglets?: SousOnglet[]; prefixes?: string[] }
export const RUBRIQUES: Record<string, Rubrique>;
export const SECTIONS: { titre: string | null; cles: string[] }[];
export const BAS_DE_BARRE: string[];          // ["reglages"]
export const ONGLETS_MOBILE: string[];        // ["accueil", "pipeline", "todo", "briefs"]
export function rubriqueActive(pathname: string): { rubrique: Rubrique; sousOnglet: SousOnglet | null } | null;
export function rubriquesPlus(): Rubrique[];  // tout ce qui n'est pas dans ONGLETS_MOBILE, dans l'ordre des SECTIONS puis BAS_DE_BARRE
export function modeSousOnglets(n: number): "aucun" | "segmente" | "pastilles";
```

Contenu fixé :
- `RUBRIQUES` : `accueil` (`/dashboard`, « Accueil »), `pipeline` (`/pipeline`, « Pipeline », `prefixes: ["/comptes"]`), `todo` (`/todo`, « To-do »), `briefs` (`/briefs`, « Briefs »), `bibliotheque` (`/bibliotheque`, « Bibliothèque »), `analytics` (`/analytics`, « Analytics »), `seo` (`/seo`, « SEO »), `reglages` (`/reglages`, « Réglages »). Aucune n'a de sous-onglets aujourd'hui.
- `SECTIONS` : `{ titre: null, cles: ["accueil", "pipeline", "todo"] }`, `{ titre: "Production", cles: ["briefs", "bibliotheque"] }`, `{ titre: "Chiffres", cles: ["analytics", "seo"] }`.
- `rubriqueActive` : une rubrique correspond si `pathname === href`, commence par `href + "/"`, ou commence par l'un de ses `prefixes`. Un sous-onglet correspond selon la même règle sur son `href` ; s'il n'y en a aucun, `sousOnglet` vaut `null`.
- `modeSousOnglets` : `"aucun"` sous 2, `"segmente"` de 2 à 4, `"pastilles"` au-delà.
- Module sans JSX ni import React : il doit se charger sous Node.

- [ ] **Step 1: Écrire les tests** dans `scripts/test-navigation.ts` (même en-tête que `scripts/test-crm-vues.ts`) :

```ts
test("une page imbriquee active sa rubrique", () => {
  assert.equal(rubriqueActive("/briefs/abc")?.rubrique.cle, "briefs");
  assert.equal(rubriqueActive("/comptes/123")?.rubrique.cle, "pipeline");
  assert.equal(rubriqueActive("/dashboard")?.rubrique.cle, "accueil");
});
test("un prefixe proche n'active pas la rubrique", () => {
  assert.equal(rubriqueActive("/briefsx"), null);
  assert.equal(rubriqueActive("/plus"), null);
});
test("sous-onglet actif", () => {
  const r = { cle: "ads", href: "/ads", libelle: "Ads", icone: "plus", sousOnglets: [
    { cle: "creatives", href: "/ads/creatives", libelle: "Créatives" },
    { cle: "meta", href: "/ads/meta", libelle: "Meta Ads" } ] } as const;
  RUBRIQUES.ads = r as unknown as Rubrique;
  try { assert.equal(rubriqueActive("/ads/meta/x")?.sousOnglet?.cle, "meta");
        assert.equal(rubriqueActive("/ads")?.sousOnglet, null); }
  finally { delete RUBRIQUES.ads; }
});
test("plus contient tout sauf les onglets du bas", () => {
  assert.deepEqual(rubriquesPlus().map((r) => r.cle), ["bibliotheque", "analytics", "seo", "reglages"]);
});
test("chaque cle citee existe", () => {
  for (const c of [...SECTIONS.flatMap((s) => s.cles), ...BAS_DE_BARRE, ...ONGLETS_MOBILE]) assert.ok(RUBRIQUES[c], c);
});
test("mode des sous-onglets", () => {
  assert.equal(modeSousOnglets(0), "aucun"); assert.equal(modeSousOnglets(1), "aucun");
  assert.equal(modeSousOnglets(2), "segmente"); assert.equal(modeSousOnglets(4), "segmente");
  assert.equal(modeSousOnglets(5), "pastilles");
});
```

- [ ] **Step 2: Lancer, constater l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-navigation.ts`
Expected: FAIL, module `@/lib/navigation` introuvable.

- [ ] **Step 3: Écrire `src/lib/navigation.ts`** selon l'interface et le contenu fixés.

- [ ] **Step 4: Relancer**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-navigation.ts && npm test`
Expected: PASS partout.

- [ ] **Step 5: Commit**

```bash
git add src/lib/navigation.ts scripts/test-navigation.ts
git commit -m "Refonte : modele de navigation unique (rubriques, sections, onglets iPhone, sous-onglets)"
```

---

### Task 3: Coquille Mac (barre latérale texte, page flottante)

**Files:**
- Modify: `src/components/sidebar.tsx`, `src/components/app-shell.tsx`, `src/app/(app)/layout.tsx`, `src/app/globals.css` (sections « App shell » et « Navigation de la coquille »)

**Interfaces:**
- Consumes: `RUBRIQUES`, `SECTIONS`, `BAS_DE_BARRE`, `rubriqueActive` (tâche 2).
- Produces: `AppShell({ children })` (plus de prop `connected`), `SidebarNav()` (plus de props). Classes CSS : `.hub-sidebar`, `.hub-nav-link`, `.hub-nav-link.is-active`, `.hub-nav-sub`, `.hub-nav-group`, `.app-content` (la page flottante).

- [ ] **Step 1: `sidebar.tsx`**
  - En haut : « Kleak Agency » en texte (600, 14px, `--texte`), plus de pastille « A » ni de sous-titre.
  - Rubriques des `SECTIONS`, intitulés de section en `--texte-3` 11.5px. Liens en texte seul, `--texte-2`, rubrique active en `--texte` 500 sur `--survol`, rayon `--r-sm`. Aucune icône, aucune `--nav-accent`, aucun `StatusDot`.
  - Si la rubrique active a des `sousOnglets`, ils s'affichent sous elle, en retrait de 14px, 12.5px, le sous-onglet actif sur `--survol`.
  - En bas (`margin-top: auto`) : les rubriques de `BAS_DE_BARRE` puis « Se déconnecter » (même style de lien, sans icône).
- [ ] **Step 2: `app-shell.tsx`** : retirer la couche d'ambiance, le tiroir mobile, la barre du haut mobile et la prop `connected`. Structure : `.hub-sidebar` (masquée sous 860px) + `.app-main` > `main.app-content`. La barre d'onglets arrive à la tâche 4.
- [ ] **Step 3: `(app)/layout.tsx`** : `<AppShell>{children}</AppShell>`, sans `getChannelConnectivity()` (la fonction reste dans `source-status.ts`, utilisée par Réglages à la tâche 11).
- [ ] **Step 4: CSS** : `.hub-sidebar` largeur 220px, fond `--fond`, sans bordure. `.app-content` au-dessus de 860px : fond `--page`, `border-radius: var(--r-lg)`, `box-shadow: var(--ombre-page)`, marge `10px 10px 10px 0`, padding `34px 40px`, hauteur minimale `calc(100vh - 20px)`. Supprimer les règles `.hub-drawer*`, `.hub-topbar`, `.hub-brand-mark`, `.hub-nav-icon`, `.hub-nav-dot`.
- [ ] **Step 5: Vérifier**

Run: `npm test`, puis `npm run dev` et ouvrir `/pipeline` à 1440px de large.
Expected: barre latérale comme la maquette C (`direction.html`), Pipeline actif, page blanche flottante. `/comptes/<un id>` garde Pipeline actif.

- [ ] **Step 6: Commit**

```bash
git add src/components/sidebar.tsx src/components/app-shell.tsx "src/app/(app)/layout.tsx" src/app/globals.css
git commit -m "Refonte : barre laterale en texte et page flottante (Mac)"
```

---

### Task 4: Coquille iPhone (barre d'onglets, page Plus)

**Files:**
- Create: `src/components/tab-bar.tsx`, `src/components/nav-icons.tsx`, `src/app/(app)/plus/page.tsx`
- Modify: `src/components/app-shell.tsx`, `src/app/globals.css`, `src/components/icons.tsx` (seulement si une icône manque : « plus » en trois points)

**Interfaces:**
- Consumes: `ONGLETS_MOBILE`, `rubriquesPlus`, `rubriqueActive`, `RUBRIQUES`, `CleIcone` (tâche 2).
- Produces: `TabBar()` (composant client, aucun prop). `NAV_ICONES: Record<CleIcone, ComponentType<{ size?: number }>>`. Route `/plus`.

- [ ] **Step 1: `nav-icons.tsx`** : associe chaque `CleIcone` à une icône de `icons.tsx`, trait fin et monochrome (`currentColor`), 22px.
- [ ] **Step 2: `tab-bar.tsx`** : cinq entrées, les quatre `ONGLETS_MOBILE` puis « Plus » (`/plus`). Icône au-dessus du libellé 10px. Actif : `--texte`, 600. Inactif : `--texte-3`. « Plus » est actif sur `/plus` et quand `rubriqueActive(pathname)` renvoie une rubrique de `rubriquesPlus()`. `aria-current="page"` sur l'onglet actif, `nav aria-label="Navigation principale"`.
- [ ] **Step 3: CSS de la barre** (sous 860px seulement) : `position: fixed; bottom: 0`, hauteur `56px + env(safe-area-inset-bottom)`, fond `rgba(251,251,250,.88)` déclaré dans `theme.css` sous `--barre-onglets`, `backdrop-filter: blur(18px)` (seul flou autorisé : il a une fonction, lire la page qui défile dessous), filet haut `0.5px solid var(--filet)`. Sous `prefers-reduced-transparency: reduce` : fond `var(--fond)`, sans flou.
- [ ] **Step 4: Mise en page mobile** (sous 860px) : `.app-content` sans ombre ni rayon, fond `--fond`, padding `calc(env(safe-area-inset-top) + 12px) 16px calc(76px + env(safe-area-inset-bottom))`. Ce dernier padding est ce qui empêche la barre de masquer le bas des pages.
- [ ] **Step 5: `/plus`** : titre « Plus », puis un groupe arrondi (fond `--page`, rayon `--r-lg`, `box-shadow: 0 0 0 1px var(--filet)`) avec une ligne par rubrique de `rubriquesPlus()` (libellé, chevron « › » en `--texte-3`), puis un second groupe avec « Se déconnecter » (en `--rouge`, même appel `POST /api/logout` que la barre latérale). Au-dessus de 860px, `/plus` reste accessible et s'affiche dans la page flottante, sans redirection.
- [ ] **Step 6: Vérifier**, avec l'outil de capture du navigateur (Claude in Chrome, fenêtre redimensionnée à 390 × 844) :
  - `/pipeline` : barre d'onglets en bas, Pipeline actif ; faire défiler jusqu'en bas : le dernier élément reste entièrement visible au-dessus de la barre.
  - `/analytics` : « Plus » actif.
  - `/plus` : la liste et « Se déconnecter ».
  - À 1440px : pas de barre d'onglets.
- [ ] **Step 7: Commit**

```bash
git add src/components/tab-bar.tsx src/components/nav-icons.tsx "src/app/(app)/plus/page.tsx" src/components/app-shell.tsx src/app/globals.css src/app/theme.css src/components/icons.tsx
git commit -m "Refonte : barre d'onglets iPhone et page Plus"
```

---

### Task 5: En-tête de page, sous-onglets, ligne de chiffres

**Files:**
- Modify: `src/components/ui/page-header.tsx` et tous ses appels (`dashboard`, `pipeline`, `comptes/[id]`, `todo`, `briefs`, `briefs/[id]`, `bibliotheque`, `analytics`, `seo`, `reglages`), `src/app/(app)/loading.tsx`
- Create: `src/components/ui/sous-onglets.tsx`, `src/components/ui/chiffres.tsx`
- Delete: `src/lib/channels.tsx` (plus aucun import à la fin de cette tâche ; vérifier avec `grep -rn "lib/channels" src`)

**Interfaces:**
- Consumes: `rubriqueActive`, `modeSousOnglets` (tâche 2).
- Produces:

```ts
export function PageHeader(p: { title: string; eyebrow?: string; subtitle?: string; actions?: ReactNode }): JSX.Element;
export function SousOnglets(): JSX.Element | null;   // client ; lit le pathname, rien si la rubrique a moins de 2 sous-onglets
export function Chiffres(p: { items: { valeur: string; libelle: string }[] }): JSX.Element;
```

- [ ] **Step 1: `PageHeader`** : plus d'icône ni d'accent. `eyebrow` en 12.5px `--texte-3` au-dessus du titre. Titre `h1` 34px (30px sous 860px), 700, `letter-spacing: -0.025em`. `subtitle` en `--texte-2` 15px. `actions` alignées à droite (sur iPhone, à droite du titre, comme le « + » des maquettes). Rend `<SousOnglets />` sous le titre.
- [ ] **Step 2: `SousOnglets`** : selon `modeSousOnglets(n)` et la largeur (CSS, pas de JavaScript de détection) :
  - au-dessus de 860px : onglets texte 13px, actif en `--texte` 500 souligné de 2px `--texte`, filet bas `--filet` (maquette `sous-onglets.html`, partie Mac) ;
  - sous 860px, `"segmente"` : sélecteur segmenté pleine largeur, fond `--surface-2`, segment actif `--page` avec `--ombre-carte` ;
  - sous 860px, `"pastilles"` : pastilles qui défilent horizontalement (`overflow-x: auto`, sans barre visible) ; pastille active : fond `--texte`, texte `--page`.
  Ce sont des liens (`next/link`), `aria-current="page"` sur l'actif.
- [ ] **Step 3: `Chiffres`** : rangée flex, `gap: 36px` (22px sous 860px). Valeur 22px (19px mobile), 600, `font-variant-numeric: tabular-nums`, `letter-spacing: -0.02em`. Libellé 12px `--texte-2`. Retour à la ligne autorisé.
- [ ] **Step 4: Mettre à jour les appels** : retirer `icon` et `accent`, retirer les imports de `CHANNELS` et des icônes de titre. Les composants qui recevaient `accent` de la rubrique (`PeriodSelector`, `CoverageNote`, `TodoBoardView`, `AreaTrend`) reçoivent provisoirement `"var(--accent)"` ; leur nettoyage complet est fait aux tâches 6, 9 et 10. Supprimer `src/lib/channels.tsx`.
- [ ] **Step 5: `loading.tsx`** : squelette aligné sur le nouvel en-tête (pas de pastille d'icône), blocs `--surface-2`.
- [ ] **Step 6: Vérifier**

Run: `grep -rn "lib/channels\|accent={ch\|CHANNELS" src` → aucune ligne. `npm test` → PASS. `npm run dev` : chaque écran a le nouvel en-tête à 1440 et 390px.

- [ ] **Step 7: Commit**

```bash
git add -A src
git commit -m "Refonte : en-tete de page, sous-onglets et ligne de chiffres"
```

---

### Task 6: Primitives (formulaires, pastilles, indicateurs, messages)

**Files:**
- Modify: `src/components/ui/form-styles.ts`, `pill.ts`, `kpi-card.tsx`, `kpi-card.css`, `not-connected.tsx`, `not-connected.css`, `coverage-note.tsx`, `period-selector.tsx`, `scope-selector.tsx`, `refresh-button.tsx`, `lightbox.tsx`, `src/components/push-toggle.tsx`, `src/components/revoke-sessions.tsx`, `src/app/logout-button.tsx`

**Interfaces:**
- Produces (signatures modifiées) :

```ts
export const inputStyle: CSSProperties;   // fond --page, bordure 1px --filet-fort, rayon --r-sm, texte --texte
export const labelStyle: CSSProperties;   // 13px --texte-2
export const buttonStyle: CSSProperties;  // plus une fonction : fond --accent, texte blanc, rayon --r-sm, 500
export const cardStyle: CSSProperties;    // fond --page, bordure 1px --filet, rayon --r-md, sans ombre
export function pillStyle(active: boolean): CSSProperties; // plus de parametre accent
```

Les appels de `buttonStyle(accent)` deviennent `buttonStyle`, ceux de `pillStyle(a, accent)` deviennent `pillStyle(a)`. `PeriodSelector`, `CoverageNote` et `ScopeSelector` perdent leur prop `accent`.

- [ ] **Step 1: `form-styles.ts` et `pill.ts`** selon les signatures. Pastille : inactive texte `--texte-2` sans bordure, fond transparent ; active fond `--survol`, texte `--texte`. Rayon `--r-sm`.
- [ ] **Step 2: `kpi-card`** : sans verre, sans lueur, sans dégradé. Fond `--page`, filet `--filet`, rayon `--r-md`. Chiffre 26px 600 `tabular-nums`, libellé 13px `--texte-2`. Variation positive `--vert`, négative `--rouge`, en texte simple.
- [ ] **Step 3: `not-connected`, `coverage-note`** : bloc sobre fond `--surface-2`, texte `--texte-2`, lien d'action en `--accent`. Plus de couleur d'accent de rubrique.
- [ ] **Step 4: `lightbox`** : voile `rgba(0,0,0,.6)` (déclaré `--voile` dans `theme.css`), boutons de fermeture sur fond `--page`.
- [ ] **Step 5: `push-toggle`, `revoke-sessions`, `logout-button`, `refresh-button`, `period-selector`, `scope-selector`** : toutes les couleurs remplacées par des variables ; interrupteur actif en `--vert` (convention iOS), boutons secondaires texte `--accent` sans fond.
- [ ] **Step 6: Vérifier**

Run: `grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(" src/components/ui/*.ts* src/components/ui/*.css src/components/push-toggle.tsx src/components/revoke-sessions.tsx src/app/logout-button.tsx`
Expected: aucune ligne. `npm test` → PASS.

- [ ] **Step 7: Commit**

```bash
git add -A src
git commit -m "Refonte : primitives (formulaires, pastilles, indicateurs, messages)"
```

---

### Task 7: Pipeline (colonnes Mac, liste iPhone) et fiche compte

**Files:**
- Modify: `src/lib/crm/affichage.ts:10-15`, `src/app/(app)/pipeline/page.tsx`, `src/app/(app)/pipeline/etape-select.tsx`, `src/app/(app)/comptes/[id]/page.tsx`, `scripts/test-crm-vues.ts` (ou un nouveau `scripts/test-crm-affichage.ts` si `affichage.ts` n'a pas encore de test)
- Create: `src/app/(app)/pipeline/liste-mobile.tsx`

**Interfaces:**
- Consumes: `PageHeader`, `Chiffres` (tâche 5), `cardStyle` (tâche 6).
- Produces:

```ts
export const COULEURS_TON: Record<Ton, string>;     // urgent "var(--rouge)", aujourdhui "var(--orange)", info et ok "var(--texte-2)"
export const COULEUR_ETAPE: Record<Etape, string>;  // "var(--etape-<cle>)" pour chaque etape
export function ListeMobile(p: { comptes: CompteVue[]; maintenant: Date }): JSX.Element; // composant client
```

- [ ] **Step 1: Test** :

```ts
test("chaque etape a sa couleur", () => {
  for (const e of ETAPES) assert.equal(COULEUR_ETAPE[e], `var(--etape-${e})`);
});
test("seuls urgent et aujourd'hui sont colores", () => {
  assert.equal(COULEURS_TON.urgent, "var(--rouge)");
  assert.equal(COULEURS_TON.aujourdhui, "var(--orange)");
  assert.equal(COULEURS_TON.info, "var(--texte-2)");
  assert.equal(COULEURS_TON.ok, "var(--texte-2)");
});
```

- [ ] **Step 2: Lancer** → FAIL (`COULEUR_ETAPE` absent, valeurs hexadécimales).
- [ ] **Step 3: `affichage.ts`** selon l'interface. Relancer → PASS.
- [ ] **Step 4: Pipeline, au-dessus de 860px** (maquette C) :
  - `PageHeader` : eyebrow = date du jour en français (« Dimanche 18 octobre », fuseau Europe/Paris), titre « Pipeline », action « Perdu (n) » en pastille (`pillStyle`).
  - `Chiffres` avec des valeurs que la page sait déjà calculer : nombre de comptes en cours, nombre en « RDV pris », nombre en « Devis envoyé ». Aucun montant (la page n'en a pas).
  - Colonnes sans fond, en-tête 12.5px `--texte-2` avec point 6px `COULEUR_ETAPE[e]` et « · n », pas de majuscules.
  - Cartes : `cardStyle`, padding 10px 11px, nom 500, sous-titre `--texte-3` 11.5px, étiquette d'urgence en texte 12px couleur `COULEURS_TON[ton]` sans fond de pastille. `EtapeSelect` reste sur la carte.
- [ ] **Step 5: `ListeMobile`** (affichée sous 860px, colonnes masquées) :
  - Pastilles de filtre « Tout » puis une par étape non vide (état local, `pillStyle`, défilement horizontal).
  - Un groupe par étape non vide : titre 12px `--texte-2` avec point de couleur et nombre ; groupe fond `--page`, rayon `--r-lg`, `box-shadow: 0 0 0 1px var(--filet)`.
  - Une ligne par compte, lien vers `/comptes/<id>` : nom (entreprise sinon nom) 15px, sous-titre `--texte-3` 12px, chevron « › » `--texte-3`. Texte coupé avec `text-overflow: ellipsis` sur une ligne, `min-width: 0` sur le bloc texte. Pas d'`EtapeSelect` dans la liste.
- [ ] **Step 6: Fiche compte** : `EtapeSelect` en haut, à droite du titre (dans `actions` du `PageHeader`) sur toutes les largeurs. `EtapeSelect` restylé : fond `--surface-2`, sans bordure, rayon `--r-sm`, texte `--texte` 13px ; erreur en `--rouge` 12.5px sous le menu. Indicateurs de la fiche avec `cardStyle` et variables, étiquette d'urgence comme sur les cartes.
- [ ] **Step 7: Vérifier**
  - `npm test` → PASS.
  - Créer deux comptes de test directement dans Supabase n'est pas souhaitable (base de production) : vérifier sur la base vide (état « Aucun »), puis avec des données factices en remplaçant temporairement, en local seulement, `listerComptesVue()` par un tableau de 6 comptes dont un nom d'entreprise de 80 caractères. Retirer ce remplacement avant le commit.
  - 1440px : maquette C. 390px : liste groupée, filtres, le nom long est abrégé, `document.documentElement.scrollWidth <= clientWidth` (via l'outil JavaScript du navigateur).
  - Fiche compte à 390px : changer l'étape fonctionne (`PATCH /api/comptes/<id>/etape`), sur un compte factice seulement si une base de test existe ; sinon vérifier l'affichage et l'état d'erreur.
- [ ] **Step 8: Commit**

```bash
git add src/lib/crm/affichage.ts scripts/ "src/app/(app)/pipeline" "src/app/(app)/comptes"
git commit -m "Refonte : pipeline en colonnes (Mac) et en liste (iPhone), etape dans la fiche compte"
```

---

### Task 8: Accueil

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/budget-form.tsx`

**Interfaces:**
- Consumes: `PageHeader`, `Chiffres`, primitives de la tâche 6, `COULEURS_TON`.

- [ ] **Step 1:** Titre « Accueil », eyebrow = date du jour. Les indicateurs déjà calculés par la page passent dans `Chiffres` (ou `KpiCard` s'ils ont une variation). Bandeaux et actions du jour : groupes `--page` à filet, étiquettes d'urgence comme dans la tâche 7. `budget-form` avec `inputStyle` / `buttonStyle`.
- [ ] **Step 2: Vérifier** à 1440 et 390px : aucune couleur en dur (`grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(" "src/app/(app)/dashboard"` → rien), rendu cohérent avec la maquette C.
- [ ] **Step 3: Commit** : `git commit -am "Refonte : accueil"`

---

### Task 9: To-do

**Files:**
- Modify: `src/components/todo/todo-board.tsx`, `src/components/todo/todo-board.css`, `src/app/(app)/todo/page.tsx`

**Interfaces:**
- Consumes: primitives de la tâche 6. `TodoBoardView` perd sa prop `accent`.

- [ ] **Step 1:** Remplacer les 65 couleurs de `todo-board.css` par des variables ; cases à cocher rondes façon Rappels iOS (bordure `--filet-fort`, cochée `--accent`), lignes séparées par `--filet`, groupes `--page` arrondis sur iPhone. Supprimer l'usage d'`accent` dans le composant.
- [ ] **Step 2: Vérifier** : `grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(" src/components/todo` → rien ; `/todo` à 1440 et 390px ; vérifier l'affichage uniquement : les tâches viennent du Notion réel d'Edgar, ne rien cocher, ajouter ni supprimer.
- [ ] **Step 3: Commit** : `git commit -am "Refonte : to-do"`

---

### Task 10: Briefs, fiche brief, Bibliothèque

**Files:**
- Modify: `src/app/(app)/briefs/page.tsx`, `src/app/(app)/briefs/[id]/page.tsx`, `src/app/(app)/bibliotheque/page.tsx`, sections « Bibliothèque de créatives » et « Grilles responsives » de `globals.css`

- [ ] **Step 1:** Listes en groupes arrondis sur iPhone (même recette que `ListeMobile`, ligne avec chevron), tableaux ou grilles à filets fins sur Mac. Vignettes de la bibliothèque : rayon `--r-md`, filet `--filet`, pas d'ombre. Supprimer de `globals.css` les règles de sections qui ne servent plus (« Calendrier de publication » si aucun composant ne les utilise : vérifier avec `grep -rn "<classe>" src` avant de supprimer).
- [ ] **Step 2: Vérifier** : `grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(" "src/app/(app)/briefs" "src/app/(app)/bibliotheque"` → rien ; affichage à 1440 et 390px ; ouverture de la visionneuse.
- [ ] **Step 3: Commit** : `git commit -am "Refonte : briefs et bibliotheque"`

---

### Task 11: Analytics, SEO, graphiques, Réglages, connexion, désinscription

**Files:**
- Modify: `src/app/(app)/analytics/page.tsx`, `src/app/(app)/seo/page.tsx`, `src/components/charts/area-trend.tsx`, `src/components/charts/traffic-split.tsx`, `src/app/(app)/reglages/page.tsx`, `src/app/login/page.tsx`, `src/app/desinscription/page.tsx`

**Interfaces:**
- Consumes: `getChannelConnectivity()` de `src/lib/source-status.ts` (existant), `Chiffres`, primitives.
- Produces: `AreaTrend` sans prop `color` (trait `--accent`, aire `--accent` à 8 % d'opacité via `fillOpacity`, sans dégradé) ; `TrafficSplit` en nuances de gris avec la première série en `--accent`. Recharts reçoit les couleurs sous forme `var(--...)`.

- [ ] **Step 1: Graphiques** : grille horizontale seule en `--filet`, axes sans ligne, graduations 11px `--texte-3`, infobulle fond `--page` filet `--filet` rayon `--r-sm`. Supprimer le halo `--gx/--gy/--gc` de la page SEO.
- [ ] **Step 2: Analytics et SEO** : `Chiffres` ou `KpiCard` pour les indicateurs existants, `PeriodSelector` sans accent.
- [ ] **Step 3: Réglages** : nouveau groupe « Sources » qui liste chaque source de `getChannelConnectivity()` avec « Connecté » (`--vert`) ou « Pas encore connecté » (`--texte-3`) en texte. Notifications et sessions en groupes arrondis.
- [ ] **Step 4: Connexion et désinscription** : page `--fond`, carte centrée `--page` rayon `--r-lg` `--ombre-page`, « Kleak Agency » en texte au-dessus. La désinscription, vue par les prospects, reste sobre et lisible sur iPhone.
- [ ] **Step 5: Vérifier** : `grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(" "src/app/(app)/analytics" "src/app/(app)/seo" src/components/charts "src/app/(app)/reglages" src/app/login src/app/desinscription` → rien ; chaque page à 1440 et 390px ; `/login` et `/desinscription` (sans paramètres : message d'erreur propre).
- [ ] **Step 6: Commit** : `git commit -am "Refonte : analytics, SEO, reglages, connexion, desinscription"`

---

### Task 12: Zéro couleur en dur, contrôle final, prévisualisation, fusion

**Files:**
- Create: `scripts/test-couleurs.ts`
- Modify: `README.md` (section Production : thème, `theme.css`, `navigation.ts`), `src/app/globals.css` (nettoyage final)

**Interfaces:**
- Consumes: tout le reste.

- [ ] **Step 1: Test** `scripts/test-couleurs.ts` : parcourt récursivement `src/` (fichiers `.ts`, `.tsx`, `.css`), ignore `src/app/theme.css`, et échoue en listant `fichier:ligne` pour toute occurrence de `/#[0-9A-Fa-f]{3,8}\b/` ou `/rgba?\(/`. Exception unique : une ligne qui contient le commentaire `couleur-autorisee:` suivi d'une raison (par exemple une couleur imposée par un tiers). Assertion : la liste est vide.
- [ ] **Step 2: Lancer** → FAIL ou PASS selon ce qui reste. Corriger chaque occurrence en variable (ajouter la variable dans `theme.css` si une teinte manque vraiment), puis relancer → PASS. `npm test` → PASS (le nouveau test est pris par le motif `scripts/test-*.ts`).
- [ ] **Step 3: Nettoyage de `globals.css`** : supprimer les règles dont la classe n'apparaît plus dans `src/` (vérifier chaque classe avec `grep -rn`), et les commentaires qui décrivent le verre, l'ambiance ou l'orange.
- [ ] **Step 4: Build** (arrêter `npm run dev` d'abord) : `npm run build` → succès sans avertissement de `themeColor`.
- [ ] **Step 5: Revue visuelle complète** à 1440 × 900 et 390 × 844 : Accueil, Pipeline, fiche compte, To-do, Briefs, fiche brief, Bibliothèque, Analytics, SEO, Réglages, Plus, connexion, désinscription, chargement. Sur chaque page à 390px : `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. Comparer aux maquettes ; aucune trace des anti-objectifs.
- [ ] **Step 6: Prévisualisation pour Edgar**
  - Les variables Vercel n'existent qu'en Production : Edgar doit les copier vers Preview (sans elles, la prévisualisation n'a pas de base). Lui donner la commande par variable : `vercel env add <NOM> preview` avec la valeur de `.env.local`, sans l'afficher, sur le modèle du script `vercel-env-hub.sh` de la mise en ligne. `INTERNAL_APP_PASSWORD` et `INTERNAL_APP_SESSION_SECRET` sont à reposer par Edgar.
  - `git push -u origin refonte-visuelle` : Vercel crée la prévisualisation. Donner l'URL à Edgar. Si la protection des prévisualisations bloque l'iPhone, Edgar se connecte à Vercel dans Safari.
  - Edgar ouvre l'URL sur Mac, puis sur iPhone, l'ajoute à l'écran d'accueil et vérifie : barre de statut, encoche, barre d'onglets, bas de page visible, réglage « Réduire la transparence » (Réglages iOS > Accessibilité > Affichage et taille du texte).
  - Lister à Edgar : l'état des icônes d'accueil (tâche 1), et le rappel que l'app installée en production devra être rouverte après la fusion.
- [ ] **Step 7: Fusion après validation explicite d'Edgar**

```bash
git add scripts/test-couleurs.ts README.md src/app/globals.css
git commit -m "Refonte : aucune couleur en dur, nettoyage final"
git checkout main && git merge --no-ff refonte-visuelle -m "Refonte visuelle : theme clair, navigation Notion/Apple" && git push
```

Expected: déploiement de production en état Ready sur Vercel, `https://hub-agence-kleak.vercel.app/dashboard` renvoie `307` vers `/login`.

- [ ] **Step 8: Suite** : signaler à Edgar que le plan `docs/superpowers/plans/2026-10-18-module-ads.md` doit être réécrit pour la nouvelle navigation (Ads = rubrique de `navigation.ts` avec `sousOnglets`, écrans sur les variables de `theme.css`) et que le worktree `livrables/hub-agence-ads` est à recréer depuis le `main` refondu.
