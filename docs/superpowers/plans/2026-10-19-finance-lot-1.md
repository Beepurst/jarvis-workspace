# Onglet Finance, lot 1 (Stripe seul) : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter au Hub Agence un onglet Finance qui affiche brut, dépenses, net, clients, objectif, graphique entrées / sorties et derniers mouvements, à partir du compte Stripe Kleak.

**Architecture:** Les factures payées, remboursements et frais Stripe sont synchronisés dans une table Supabase `finance_mouvements` (cron quotidien + bouton « Actualiser »). Tous les calculs vivent dans un module pur `src/lib/finance/calculs.ts`, testé sous Node ; la page serveur ne fait que lire la table et afficher. Le modèle `Mouvement` porte une `source` pour accueillir Revolut au lot 2 sans refaire la page.

**Tech Stack:** Next.js 15 (App Router, pages serveur), Supabase (clé service role), SDK `stripe`, recharts, tests `node --test` via `scripts/alias-hook.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-19-finance-design.md` (racine du workspace). Maquette : `livrables/hub-agence/.superpowers/brainstorm/36512-1792397416/content/finance-a-verre.html`.

## Global Constraints

- Travailler dans le worktree `livrables/hub-agence-finance/`, branche `finance`, créée depuis `main` du dépôt `livrables/hub-agence/` (les classes verre y sont déjà fusionnées). Le dossier est déjà couvert par `livrables/hub-agence-*/` dans le `.gitignore` du workspace.
- Ne pas modifier `src/app/theme.css` ni les classes verre de `src/app/globals.css` : utiliser `.hub-halo`, `.hub-verre`, `.hub-pilules-verre`, `.hub-barre-progression` telles quelles.
- Aucune couleur en dur (`scripts/test-couleurs.ts`), contraste AA (`scripts/test-contraste.ts`), champs à 16 px sous 860 px (`scripts/test-champs-ios.ts`), aucun défilement horizontal à 390 px.
- Une donnée absente n'est pas zéro : source en erreur = « Indisponible », jamais « 0 € ».
- Montants stockés et calculés en **centimes entiers** ; mois calculés en **Europe/Paris**.
- Taux URSSAF par défaut **21,2 %** ; date de départ par défaut **2026-10-15** ; objectif **2 000 € nets par mois** ; les deux premiers sont modifiables dans Réglages.
- Tant que Revolut n'est pas branché : carte Dépenses « Revolut pas encore branché » (détail : frais Stripe) ; Net libellé « avant dépenses Revolut » ; « Dépenses par poste » en état non connecté.
- Clés dans `.env.local` et Vercel, jamais affichées. Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne. Textes de l'interface en français, sans tiret long.
- Commits avec la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Stripe en panne ou clé invalide** : les cartes affichent « Indisponible », pas 0 € (test dans la tâche 2, `vueFinance`).
2. **Paiement à cheval sur deux mois** : payé le 31/10 à 23 h 30 heure de Paris, il compte en octobre ; le 1/11 à 0 h 30, en novembre (test tâche 2).
3. **Synchronisation relancée deux fois** : aucun doublon, identifiants stables (test tâche 3 ; upsert par `id` tâche 4).
4. **Remboursement client et facture à 0 €** : le remboursement diminue le brut, la facture à 0 € (remise 100 %) est ignorée (test tâche 3).
5. **Vue Année avec départ au 15/10** : l'objectif compte les mois depuis octobre, pas depuis janvier (test tâche 2).

---

### Task 1: Worktree, schéma SQL et dépendance Stripe

**Files:**
- Create: `supabase/finance.sql`
- Modify: `package.json` (dépendance `stripe`), `.env.example` (ligne `STRIPE_SECRET_KEY=`), `src/lib/source-status.ts`

**Interfaces:**
- Produces: tables `finance_mouvements`, `finance_reglages` ; `isStripeConfigured(): boolean` dans `source-status.ts`.

- [ ] **Step 1:** `cd livrables/hub-agence && git worktree add ../hub-agence-finance -b finance main`, puis `cd ../hub-agence-finance && cp ../hub-agence/.env.local . && npm install`. Vérifier : `npm test` passe (état de départ).
- [ ] **Step 2:** `npm install stripe` (dernière version stable).
- [ ] **Step 3: Écrire `supabase/finance.sql`**, idempotent comme `crm-phase-1.sql` :

```sql
create table if not exists finance_mouvements (
  id text primary key,                 -- "stripe:facture:in_…", "stripe:frais:txn_…", "stripe:remboursement:txn_…"
  source text not null check (source in ('stripe', 'revolut')),
  sens text not null check (sens in ('entree', 'sortie')),
  montant_centimes integer not null,   -- positif ; un remboursement client est une entrée négative
  date timestamptz not null,
  libelle text not null,
  client_id text,
  client_nom text,
  poste text,
  synchro_le timestamptz not null default now()
);
create index if not exists finance_mouvements_date on finance_mouvements (date);

create table if not exists finance_reglages (
  id smallint primary key default 1 check (id = 1),
  taux_urssaf numeric not null default 0.212 check (taux_urssaf >= 0 and taux_urssaf < 1),
  date_depart date not null default '2026-10-15',
  derniere_synchro timestamptz
);
insert into finance_reglages (id) values (1) on conflict (id) do nothing;

alter table finance_mouvements enable row level security;
alter table finance_reglages enable row level security;
```

- [ ] **Step 4:** Ajouter `isStripeConfigured()` (vrai si `STRIPE_SECRET_KEY` non vide) dans `source-status.ts`, à côté des autres.
- [ ] **Step 5:** `npm test` passe. Commit : `Finance : schéma, dépendance Stripe, état de connexion`.

---

### Task 2: Calculs purs (`calculs.ts`)

**Files:**
- Create: `src/lib/finance/calculs.ts`
- Test: `scripts/test-finance-calculs.ts`

**Interfaces:**
- Produces:

```ts
export interface Mouvement {
  id: string; source: "stripe" | "revolut"; sens: "entree" | "sortie";
  montantCentimes: number; date: string /* ISO */; libelle: string;
  clientId: string | null; clientNom: string | null; poste: string | null;
}
export type ClePeriode = "mois" | "3mois" | "annee";
export interface Periode { cle: ClePeriode; debut: Date; fin: Date; nbMois: number }
export interface Reglages { tauxUrssaf: number; dateDepart: string /* AAAA-MM-JJ */; derniereSynchro: string | null }
export interface Synthese {
  brut: number; depenses: number; fraisStripe: number; cotisations: number; net: number; // centimes
  clients: number; objectif: number; progression: number; reste: number;
}
export interface PointMois { cle: string /* AAAA-MM */; libelle: string /* "oct." */; entrees: number; sorties: number }
export const OBJECTIF_NET_MENSUEL_CENTIMES = 200_000;
export function lirePeriode(valeur: string | undefined): ClePeriode;         // défaut "mois"
export function periodeFinance(cle: ClePeriode, maintenant: Date, dateDepart: string): Periode;
export function synthese(mouvements: Mouvement[], periode: Periode, tauxUrssaf: number): Synthese;
export function serieMensuelle(mouvements: Mouvement[], maintenant: Date, nb?: number): PointMois[]; // nb = 6
export function derniersMouvements(mouvements: Mouvement[], n?: number): Mouvement[];              // n = 5
export function formatEuros(centimes: number): string;                        // "1 840 €" sans décimales si rondes, sinon "999,50 €"
export function vueFinance(mouvements: Mouvement[] | null, periode: Periode, reglages: Reglages | null): VueFinance;
export interface VueFinance {
  indisponible: boolean;
  cartes: { titre: string; valeur: string; detail: string }[]; // Brut, Dépenses, Net, Clients
  objectif: { texte: string; pourcent: number; detail: string } | null;
}
```

Règles : `periodeFinance` découpe en mois civils de Paris. « mois » = mois en cours ; « 3mois » = mois en cours et les deux précédents ; « annee » = depuis le 1er janvier. `debut` ne descend jamais avant `dateDepart` ; `nbMois` compte les mois civils entre `debut` (ainsi borné) et le mois en cours inclus. `brut` = somme signée des entrées ; `depenses` = somme des sorties ; `fraisStripe` = sorties dont `source === "stripe"` ; `cotisations = Math.round(brut × taux)` (0 si brut ≤ 0) ; `net = brut − depenses − cotisations` ; `clients` = `clientId` distincts (repli `clientNom`) parmi les entrées positives ; `objectif = OBJECTIF × nbMois` ; `progression = max(0, net) / objectif` ; `reste = max(0, objectif − net)`. Dans `vueFinance`, la carte Dépenses a pour valeur « Revolut pas encore branché » et pour détail « Frais Stripe : X » ; le détail de Net est « avant dépenses Revolut · cotisations estimées X ». Si `mouvements` ou `reglages` vaut `null`, `indisponible: true`, chaque valeur vaut « Indisponible » et `objectif: null`.

- [ ] **Step 1: Écrire les tests** dans `scripts/test-finance-calculs.ts` (format de `scripts/test-crm-vues.ts`), avec une fabrique `mvt(surcharge)` :
  - `periodeFinance("mois", 2026-10-20, "2026-10-15")` → `debut` = 15/10/2026 00:00 Paris, `nbMois` 1.
  - `periodeFinance("annee", 2026-11-20T10:00Z, "2026-10-15")` → `nbMois` 2 (Review Focus 5) ; avec `dateDepart` "2026-01-01" → 11.
  - `periodeFinance("3mois", 2027-01-10, "2026-01-01")` → `debut` = 1/11/2026 Paris, `nbMois` 3.
  - mouvement daté `2026-10-31T22:30:00Z` (23 h 30 Paris) inclus dans la période « mois » de `maintenant = 2026-10-31T12:00Z` ; daté `2026-10-31T23:30:00Z` (0 h 30 le 1/11 Paris) exclu (Review Focus 2) ; même règle pour les seaux de `serieMensuelle`.
  - `synthese` avec entrées 99 900 et 90 000 (deux clients), remboursement −9 000, frais Stripe 1 500, taux 0,212 : `brut` 180 900, `cotisations` 38 351, `depenses` 1 500, `net` 141 049, `clients` 2, `objectif` 200 000, `reste` 58 951.
  - deux entrées du même `clientId` → `clients` 1.
  - `serieMensuelle(…, 2026-10-20)` renvoie 6 points de `2026-05` à `2026-10`, libellés `mai`, `juin`, `juil.`, `août`, `sept.`, `oct.`.
  - `formatEuros(184000)` = `1 840 €` (espace insécable fine comme `Intl` fr-FR, comparer via `Intl` ou normaliser les espaces) ; `formatEuros(99950)` = `999,50 €`.
  - `vueFinance(null, …)` → `indisponible` vrai, quatre valeurs « Indisponible », aucune ne contient « 0 » (Review Focus 1).
  - `vueFinance` normal : carte Dépenses = « Revolut pas encore branché », détail de Net commence par « avant dépenses Revolut ».
  - `lirePeriode("x")` = `"mois"`.
- [ ] **Step 2:** `node --import ./scripts/alias-hook.mjs --test scripts/test-finance-calculs.ts` → FAIL (module absent).
- [ ] **Step 3:** Implémenter `src/lib/finance/calculs.ts` (module pur, sans import Next ni Supabase). Pour le fuseau, reprendre la technique `Intl.DateTimeFormat(…, { timeZone: "Europe/Paris" })` de `moisCle` / `debutMoisParis` dans `src/lib/crm/db.ts`.
- [ ] **Step 4:** Le même test → PASS ; `npm test` → PASS.
- [ ] **Step 5:** Commit : `Finance : calculs (brut, net, cotisations, objectif, série mensuelle)`.

---

### Task 3: Conversion Stripe vers mouvements (pur)

**Files:**
- Create: `src/lib/finance/stripe-mouvements.ts`
- Test: `scripts/test-finance-stripe.ts`

**Interfaces:**
- Consumes: `Mouvement` (tâche 2).
- Produces:

```ts
// Sous-ensembles des objets Stripe, pour tester sans le SDK.
export interface FactureStripe {
  id: string; number: string | null; status: string; total: number; customer: string | null;
  customer_name: string | null; status_transitions: { paid_at: number | null };
  lines: { data: { description: string | null }[] };
}
export interface TransactionStripe { id: string; type: string; amount: number; fee: number; created: number; description: string | null }
export function mouvementsDepuisFactures(factures: FactureStripe[], dateDepart: string): Mouvement[];
export function mouvementsDepuisTransactions(transactions: TransactionStripe[], dateDepart: string): Mouvement[];
```

Règles : une facture compte si `status === "paid"`, `total > 0` et `paid_at` non nul et ≥ `dateDepart` (minuit Paris). Mouvement : `id` `stripe:facture:<id>`, entrée, `montantCentimes = total` (y compris facture payée hors Stripe), `date = paid_at`, `libelle` = description de la première ligne, sinon `Facture <number>`, suivie de `, <customer_name>` si présent ; `clientId = customer`. Pour chaque transaction de solde après `dateDepart` : si `fee > 0`, une sortie `stripe:frais:<id>`, montant `fee`, poste `Frais Stripe`, libellé `Frais Stripe` ; si `type === "stripe_fee"`, une sortie `stripe:frais:<id>` de montant `|amount|` ; si `type` vaut `refund` ou `payment_refund`, une entrée **négative** `stripe:remboursement:<id>` de montant `amount` (déjà négatif chez Stripe), libellé `Remboursement client`. Les `payout` et autres types sont ignorés.

- [ ] **Step 1: Écrire les tests** :
  - facture payée 99 900 → un mouvement `stripe:facture:in_1`, entrée, 99 900, libellé contenant le nom du client.
  - facture `total: 0` → ignorée ; facture `status: "open"` → ignorée ; facture payée le 14/10/2026 avec départ 2026-10-15 → ignorée (Review Focus 4).
  - appeler deux fois la conversion sur les mêmes données → mêmes `id` (Review Focus 3).
  - transaction `charge` avec `fee: 1500` → une sortie de 1 500, poste `Frais Stripe`.
  - transaction `refund` `amount: -9000` → entrée de −9 000 (Review Focus 4).
  - transaction `payout` → aucun mouvement.
- [ ] **Step 2:** Lancer `scripts/test-finance-stripe.ts` → FAIL.
- [ ] **Step 3:** Implémenter `stripe-mouvements.ts` (pur, sans import du SDK).
- [ ] **Step 4:** Le test → PASS ; `npm test` → PASS.
- [ ] **Step 5:** Commit : `Finance : conversion des factures et transactions Stripe`.

---

### Task 4: Lecture Stripe, base et synchronisation

**Files:**
- Create: `src/lib/finance/db.ts`, `src/app/api/cron/finance/route.ts`, `src/app/api/finance/actualiser/route.ts`, `src/app/api/finance/reglages/route.ts`
- Modify: `vercel.json`

**Interfaces:**
- Consumes: tâches 2 et 3, `getSupabaseClient()` (`src/lib/supabase.ts`), `isStripeConfigured()`.
- Produces:

```ts
export async function lireReglages(): Promise<Reglages>;
export async function enregistrerReglages(r: { tauxUrssaf: number; dateDepart: string }): Promise<void>;
export async function lireMouvements(depuis: Date): Promise<Mouvement[]>;
export async function synchroniserStripe(maintenant: Date): Promise<{ mouvements: number }>;
```

- [ ] **Step 1:** Dans `db.ts`, `synchroniserStripe` instancie `new Stripe(process.env.STRIPE_SECRET_KEY!)` **dans la fonction** (jamais au niveau module, comme `orbikal-hub/src/lib/revenue.ts`), lit `invoices.list({ status: "paid", created: { gte } })` et `balanceTransactions.list({ created: { gte } })` avec pagination automatique, `gte` = date de départ, convertit via la tâche 3, puis fait un `upsert` sur `finance_mouvements` avec `onConflict: "id"`, et met à jour `finance_reglages.derniere_synchro`. Supprime ensuite les mouvements `stripe` antérieurs à la date de départ (cas où elle a été avancée). Toute erreur Supabase ou Stripe est relancée telle quelle.
- [ ] **Step 2:** `lireMouvements` lit par pages (comme `chiffresDuMois`) et convertit `snake_case` vers `Mouvement`. `lireReglages` lit la ligne `id = 1`.
- [ ] **Step 3:** `src/app/api/cron/finance/route.ts` : GET protégé par `CRON_SECRET`, même vérification que `api/cron/relances/route.ts` ; renvoie 503 si `!isStripeConfigured()`, sinon le résultat de `synchroniserStripe`. `vercel.json` : ajouter `{ "path": "/api/cron/finance", "schedule": "0 5 * * *" }`.
- [ ] **Step 4:** `src/app/api/finance/actualiser/route.ts` : POST (derrière la session, le middleware le couvre), même réponse. `src/app/api/finance/reglages/route.ts` : POST `{ tauxUrssaf: number (0 à 0,5), dateDepart: "AAAA-MM-JJ" }`, validation sur le modèle de `api/depenses-pub/route.ts`, 400 si invalide.
- [ ] **Step 5:** `npx tsc --noEmit` sans erreur ; `npm test` → PASS.
- [ ] **Step 6:** Commit : `Finance : synchronisation Stripe, cron et réglages`.

---

### Task 5: Page Finance et navigation

**Files:**
- Create: `src/app/(app)/finance/page.tsx`, `src/app/(app)/finance/actualiser-bouton.tsx`, `src/components/charts/entrees-sorties.tsx`
- Modify: `src/lib/navigation.ts`, `src/components/nav-icons.tsx`, `scripts/test-navigation.ts`

**Interfaces:**
- Consumes: `lireReglages`, `lireMouvements`, `periodeFinance`, `lirePeriode`, `vueFinance`, `serieMensuelle`, `derniersMouvements`, `formatEuros`, `isStripeConfigured`, `PageHeader`, `NotConnected`.

- [ ] **Step 1: Test de navigation** : dans `scripts/test-navigation.ts`, `rubriqueActive("/finance")?.rubrique.cle === "finance"` et la section « Chiffres » vaut `["finance", "analytics", "seo"]`. Lancer → FAIL.
- [ ] **Step 2:** `navigation.ts` : rubrique `finance` (`/finance`, « Finance », icône `"finance"` ajoutée à `CleIcone`), en tête de la section « Chiffres ». Icône dans `nav-icons.tsx`, dans le style des autres. Test → PASS.
- [ ] **Step 3: Page serveur** (`dynamic = "force-dynamic"`), dans l'ordre de la maquette :
  - `<div className="hub-halo" aria-hidden="true" />` en premier enfant.
  - Si `!isStripeConfigured()` : `NotConnected` (variable `STRIPE_SECRET_KEY`, indice « clé restreinte en lecture du compte Stripe Kleak ») et rien d'autre.
  - `PageHeader` : titre « Finance », sous-titre « Objectif : 2 000 € nets par mois », eyebrow « Stripe · mis à jour <date de derniere_synchro> » ; à droite, pilules `?periode=mois|3mois|annee` (« Ce mois », « 3 mois », « Année ») dans `.hub-pilules-verre` avec `aria-current="page"` sur l'active, et le bouton Actualiser.
  - Lecture en `try/catch` : en erreur, bandeau rouge (classe `hub-bandeau`, comme l'accueil) et `vueFinance(null, …)`.
  - Quatre cartes `.hub-verre` (grille de l'accueil), barre d'objectif dans une carte `.hub-verre` avec `.hub-barre-progression`, graphique, puis deux colonnes (pleine largeur sous 860 px) : « Derniers mouvements » en `.hub-groupe` / `.hub-ligne` (libellé, sous-ligne « date · Stripe », montant signé, entrées en `var(--vert-texte)`) et « Dépenses par poste » en `NotConnected` compact (« Revolut Business pas encore branché »).
  - Aucun mouvement : à la place du graphique et de la liste, texte discret « Aucun encaissement depuis le <date de départ>. »
- [ ] **Step 4:** `entrees-sorties.tsx` : `BarChart` recharts, barres groupées `entrees` en `var(--accent)` (dégradé vertical comme les courbes de la refonte) et `sorties` en `var(--serie-4)`, rayon haut 4 px, montants en euros dans l'infobulle, sur le modèle de `area-trend.tsx`.
- [ ] **Step 5:** `actualiser-bouton.tsx` (client) : POST `/api/finance/actualiser`, état « Actualisation… », puis `router.refresh()` ; message d'erreur en ligne si échec.
- [ ] **Step 6:** `npm test` (dont couleurs, contraste, champs iOS) → PASS ; `npx tsc --noEmit` → OK.
- [ ] **Step 7:** Serveur dev, vérifier `/finance` à 1280 px et 390 px (`scripts/shots-mobile.mjs` ou navigateur) : pas de défilement horizontal, rendu conforme à la maquette. Arrêter le serveur.
- [ ] **Step 8:** Commit : `Finance : page, graphique, navigation`.

---

### Task 6: Réglages

**Files:**
- Create: `src/app/(app)/reglages/finance-form.tsx`
- Modify: `src/app/(app)/reglages/page.tsx`

- [ ] **Step 1:** Ajouter « Stripe (finance) » à la liste des sources (`isStripeConfigured()`).
- [ ] **Step 2:** Section « Finance » : formulaire client avec taux URSSAF en % (saisie 21,2, envoyé 0,212) et date de départ, POST `/api/finance/reglages`, valeurs initiales lues par `lireReglages()` (« Indisponible » si la lecture échoue, formulaire masqué). Champs à 16 px sous 860 px.
- [ ] **Step 3:** `npm test` → PASS ; vérifier en dev qu'un changement de taux modifie le Net sur `/finance`.
- [ ] **Step 4:** Commit : `Finance : taux URSSAF et date de départ dans Réglages`.

---

### Task 7: Mise en route avec Edgar

Pas de code. À faire avec Edgar, pas à pas.

- [ ] **Step 1:** Edgar exécute `supabase/finance.sql` dans l'éditeur SQL du projet `qkjcwjjtirmoffodhuhn`.
- [ ] **Step 2:** Edgar crée dans le Stripe **Kleak** (pas Orbikal) une clé restreinte en lecture seule : Invoices, Balance transactions, Customers. Claude la pose dans `.env.local` du worktree sans l'afficher, et dans Vercel si le projet existe.
- [ ] **Step 3:** « Actualiser » sur `/finance` : la page affiche l'état vide « Aucun encaissement depuis le 15 oct. 2026 » sans erreur.
- [ ] **Step 4:** Fusion de `finance` dans `main` (après accord d'Edgar), en résolvant le conflit attendu sur `navigation.ts` si `module-ads` a été fusionné entre-temps.
