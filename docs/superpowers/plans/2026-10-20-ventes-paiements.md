# Ventes, paiement en 6 fois et maintenance : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** enregistrer les ventes signées dans le Hub Agence, en tirer l'échéancier (site en une fois ou en 6 fois, maintenance), le rapprocher des paiements Stripe déjà synchronisés, et l'afficher sur la fiche client et dans l'onglet Finance.

**Architecture :** une table `ventes` (Supabase), trois modules purs testés (`echeancier`, `rapprochement`, `synthese`) sous `src/lib/ventes/`, un accès base et des routes API sur le modèle du CRM, puis deux écrans : une carte Vente sur `/comptes/[id]` et une section « Ventes signées » sur `/finance`. Rien n'est écrit dans Stripe : on relit `finance_mouvements`.

**Tech Stack :** Next.js 15 (App Router, server components), TypeScript, Supabase (`getSupabaseClient` service role), tests `node:test` lancés par `npm test` (`scripts/test-*.ts`, alias `@/` via `scripts/alias-hook.mjs`).

**Spec :** `docs/superpowers/specs/2026-10-20-ventes-paiements-design.md` (racine du workspace). Offre : `livrables/offre/note-interne-offre.md`.

## Global Constraints

- Dépôt : `livrables/hub-agence/` (dépôt git indépendant `Beepurst/hub-agence-kleak`), jamais commité depuis la racine du workspace.
- Travailler dans un worktree `livrables/hub-agence-ventes` sur la branche `ventes` créée depuis `main` (Finance lot 2 y est déjà fusionné, commit `03f8dba`). Chaque push sur `main` part en production : fusion seulement après validation d'Edgar.
- Montants en centimes (`integer`), dates en jour de Paris au format `AAAA-MM-JJ`. « Aujourd'hui » = `jourParis(new Date())` de `@/lib/finance/calculs`. Euros affichés avec `formatEuros` du même module.
- Une donnée absente n'est pas zéro : une vente sans `stripe_client_id` affiche « non rapproché », jamais « 0 € payé » ni « en retard ».
- Le hub n'appelle pas Stripe pour cette fonctionnalité et n'écrit rien dans Stripe.
- Les chiffres existants de Finance (brut, net, objectif, graphique) ne changent pas. La prévision est intitulée « Prévision, ventes signées uniquement ».
- Apparence : couleurs uniquement via les variables de `src/app/theme.css` ; `.hub-verre` sur les cartes de chiffres, jamais sur les listes ; lisible sur iPhone (grilles `repeat(auto-fit, minmax(min(…px, 100%), 1fr))` comme la fiche actuelle).
- Pas de `alert`/`confirm` du navigateur : confirmation dans la page.
- Textes de l'interface en français, au tutoiement, sans tiret long.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Commits : messages en français préfixés `Ventes : `, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Prix non divisible par 6 avec options** (1 800 € + 400 € = 2 200 €) : 5 × 366,66 € puis 366,70 €, total exact. Testé en tâche 2.
2. **Signature un 31** (ou un 29, 30) : les versements suivants tombent le dernier jour des mois courts (30/11, 31/12, 31/01, 28/02, 31/03), sans dériver ensuite. Testé en tâche 2.
3. **Deux ventes pour le même client Stripe** (one page puis montée vers l'Essentiel) : les paiements remplissent les échéances des deux ventes dans l'ordre des dates, sans double compte. Testé en tâche 3.
4. **Remboursement après paiement** (entrée négative) : une échéance déjà « payée » redevient non couverte et peut passer en retard. Testé en tâche 3.
5. **Vente annulée ou mise en ligne repoussée** : une vente annulée disparaît de toutes les sommes et listes ; une mise en ligne repoussée déplace le solde et la maintenance dans la prévision. Testé en tâches 3 et 4.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `supabase/ventes.sql` (créer) | Table `ventes`, index, contrainte 6 fois → maintenance, RLS |
| `src/lib/offre.ts` (créer) | Catalogue : formules, options, constantes |
| `src/lib/ventes/types.ts` (créer) | Types partagés |
| `src/lib/ventes/echeancier.ts` (créer) | Dates et échéancier, pur |
| `src/lib/ventes/rapprochement.ts` (créer) | Répartition des paiements, statuts, résumé, pur |
| `src/lib/ventes/synthese.ts` (créer) | Chiffres de Finance, pur |
| `src/lib/ventes/validation.ts` (créer) | Lecture et contrôle du corps des requêtes, pur |
| `src/lib/ventes/db.ts` (créer) | Lecture et écriture Supabase |
| `src/app/api/ventes/route.ts`, `src/app/api/ventes/[id]/route.ts` (créer) | Création, modification, annulation |
| `src/app/(app)/comptes/[id]/vente-carte.tsx`, `vente-formulaire.tsx` (créer), `page.tsx` (modifier) | Fiche client |
| `src/app/(app)/finance/ventes-section.tsx` (créer), `page.tsx` (modifier) | Finance |
| `src/lib/crm/pipeline.ts` (modifier) | Libellés d'étapes |
| `scripts/test-ventes-*.ts` (créer) | Tests |

---

### Task 1 : Worktree, table `ventes`, catalogue et types

**Files :**
- Create : `supabase/ventes.sql`, `src/lib/offre.ts`, `src/lib/ventes/types.ts`
- Test : `scripts/test-ventes-offre.ts`

**Interfaces :**
- Produces (`src/lib/offre.ts`) :
  - `type Formule = "one_page" | "essentiel" | "pro" | "sur_mesure"`, `FORMULES: readonly Formule[]`
  - `FORMULE_LABELS: Record<Formule, string>` = One page, Essentiel, Pro, Sur mesure
  - `PRIX_SITE_CENTIMES: Record<Exclude<Formule, "sur_mesure">, number>` = 69 900, 99 900, 180 000
  - `MAINTENANCE_CENTIMES: Record<Exclude<Formule, "sur_mesure">, number>` = 4 900, 9 000, 9 000
  - `type OptionCle = "automatisation" | "page_supplementaire"`, `OPTIONS: Record<OptionCle, { libelle: string; centimes: number }>` = Automatisation des demandes 40 000, Page supplémentaire 20 000
  - `ENGAGEMENT_MOIS = 12`, `DELAI_GRACE_JOURS = 5`, `MISE_EN_LIGNE_DEFAUT_JOURS = 21`, `FIN_ENGAGEMENT_ALERTE_JOURS = 45`
  - `prixPropose(formule: Formule, options: OptionCle[]): number | null` (null pour `sur_mesure`)
- Produces (`src/lib/ventes/types.ts`) :
  - `type ModePaiement = "une_fois" | "six_fois"`
  - `interface Vente { id: string; compteId: string; formule: Formule; prixSiteCentimes: number; options: OptionCle[]; modePaiement: ModePaiement; signeLe: string; miseEnLigneLe: string; maintenanceCentimes: number | null; maintenanceMois: number; stripeClientId: string | null; statut: "active" | "annulee"; notes: string | null }`
  - `type NatureEcheance = "acompte" | "solde" | "versement" | "maintenance"`
  - `interface Echeance { venteId: string; date: string; montantCentimes: number; nature: NatureEcheance; rang: number; total: number }` (rang et total : 2 et 6 pour « versement 2/6 », 1 et 1 pour acompte et solde)
  - `type StatutEcheance = "payee" | "a_venir" | "en_retard" | "non_rapprochee"`
  - `interface EcheanceSuivie extends Echeance { payeCentimes: number; statut: StatutEcheance }`

- [ ] **Step 1 : Créer le worktree**

```bash
cd /Users/ed/Desktop/jarvis-kleak/livrables/hub-agence
git fetch && git worktree add ../hub-agence-ventes -b ventes main
cd ../hub-agence-ventes && npm install
```
Expected : `npm test` passe sur la base actuelle.

- [ ] **Step 2 : Écrire `supabase/ventes.sql`**

En-tête sur le modèle de `supabase/finance.sql` (à exécuter dans le SQL Editor, idempotent). Colonnes de la spec, section 4 : `id uuid pk default gen_random_uuid()`, `compte_id uuid not null references comptes(id) on delete cascade`, `formule text not null check (formule in (…))`, `prix_site_centimes integer not null check (> 0)`, `options text[] not null default '{}'`, `mode_paiement text not null check (in ('une_fois','six_fois'))`, `signe_le date not null`, `mise_en_ligne_le date not null`, `maintenance_centimes integer check (is null or > 0)`, `maintenance_mois integer not null default 12 check (> 0)`, `stripe_client_id text`, `statut text not null default 'active' check (in ('active','annulee'))`, `notes text`, `created_at`, `updated_at`. Contrainte nommée `ventes_six_fois_maintenance` : `check (mode_paiement <> 'six_fois' or maintenance_centimes is not null)`, et `check (mise_en_ligne_le >= signe_le)`. Index sur `compte_id` et `stripe_client_id`. `alter table ventes enable row level security;`

- [ ] **Step 3 : Écrire le test du catalogue** `scripts/test-ventes-offre.ts`

```ts
test("prix proposés", () => {
  assert.equal(prixPropose("one_page", []), 69_900);
  assert.equal(prixPropose("pro", ["automatisation"]), 220_000);
  assert.equal(prixPropose("essentiel", ["automatisation", "page_supplementaire"]), 159_900);
  assert.equal(prixPropose("sur_mesure", []), null);
});
test("maintenance proposée", () => {
  assert.equal(MAINTENANCE_CENTIMES.one_page, 4_900);
  assert.equal(MAINTENANCE_CENTIMES.essentiel, 9_000);
});
```

- [ ] **Step 4 : Lancer, vérifier l'échec**, puis écrire `offre.ts` et `types.ts`, relancer

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-ventes-offre.ts`
Expected : FAIL (module absent), puis PASS.

- [ ] **Step 5 : Commit** `Ventes : table, catalogue de l'offre et types`

---

### Task 2 : Échéancier

**Files :**
- Create : `src/lib/ventes/echeancier.ts`
- Test : `scripts/test-ventes-echeancier.ts`

**Interfaces :**
- Consumes : `Vente`, `Echeance` (tâche 1)
- Produces :
  - `ajouterMois(date: string, n: number, jourCible?: number): string`. Le jour visé est `jourCible` (par défaut le jour de `date`), ramené au dernier jour du mois si besoin. Les appelants passent toujours le jour de la date d'origine, pour que 31/10 + 4 mois donne 28/02, puis 31/03 à + 5.
  - `ajouterJours(date: string, n: number): string`
  - `echeancier(v: Vente): Echeance[]`, trié par date puis nature (acompte, versement, solde, maintenance)
  - `libelleEcheance(e: Echeance): string` : « Acompte », « Solde », « Versement 2/6 », « Maintenance 3/12 »
  - `finEngagement(v: Vente): string | null` = `ajouterMois(miseEnLigneLe, maintenanceMois)`, null sans maintenance

- [ ] **Step 1 : Écrire les tests**

```ts
const base: Vente = { id: "v1", compteId: "c1", formule: "essentiel", prixSiteCentimes: 99_900, options: [],
  modePaiement: "une_fois", signeLe: "2026-11-03", miseEnLigneLe: "2026-11-24",
  maintenanceCentimes: null, maintenanceMois: 12, stripeClientId: null, statut: "active", notes: null };

test("une fois : 50 % à la signature, le reste à la mise en ligne, centime impair au solde", () => {
  const e = echeancier(base);
  assert.deepEqual(e.map((x) => [x.date, x.montantCentimes, x.nature]),
    [["2026-11-03", 49_950, "acompte"], ["2026-11-24", 49_950, "solde"]]);
  const impair = echeancier({ ...base, prixSiteCentimes: 69_901 });
  assert.deepEqual(impair.map((x) => x.montantCentimes), [34_950, 34_951]);
});

test("6 fois avec options : 5 × 366,66 € puis 366,70 €", () => {
  const e = echeancier({ ...base, formule: "pro", prixSiteCentimes: 220_000, modePaiement: "six_fois",
    maintenanceCentimes: 9_000 }).filter((x) => x.nature === "versement");
  assert.deepEqual(e.map((x) => x.montantCentimes), [36_666, 36_666, 36_666, 36_666, 36_666, 36_670]);
  assert.equal(e.reduce((s, x) => s + x.montantCentimes, 0), 220_000);
  assert.deepEqual(e.map((x) => `${x.rang}/${x.total}`), ["1/6", "2/6", "3/6", "4/6", "5/6", "6/6"]);
});

test("signature un 31 : fins de mois sans dérive", () => {
  const e = echeancier({ ...base, signeLe: "2026-10-31", miseEnLigneLe: "2026-11-21", modePaiement: "six_fois",
    maintenanceCentimes: 4_900 }).filter((x) => x.nature === "versement");
  assert.deepEqual(e.map((x) => x.date),
    ["2026-10-31", "2026-11-30", "2026-12-31", "2027-01-31", "2027-02-28", "2027-03-31"]);
});

test("maintenance : 12 mensualités à partir de la mise en ligne, fin d'engagement", () => {
  const v = { ...base, maintenanceCentimes: 9_000 };
  const m = echeancier(v).filter((x) => x.nature === "maintenance");
  assert.equal(m.length, 12);
  assert.equal(m[0].date, "2026-11-24");
  assert.equal(m[11].date, "2027-10-24");
  assert.equal(finEngagement(v), "2027-11-24");
  assert.equal(finEngagement(base), null);
});

test("libellés", () => {
  const e = echeancier({ ...base, modePaiement: "six_fois", maintenanceCentimes: 9_000 });
  assert.equal(libelleEcheance(e.find((x) => x.nature === "versement" && x.rang === 2)!), "Versement 2/6");
  assert.equal(libelleEcheance(e.find((x) => x.nature === "maintenance" && x.rang === 3)!), "Maintenance 3/12");
});
```

- [ ] **Step 2 : Lancer, vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-ventes-echeancier.ts`
Expected : FAIL (module absent).

- [ ] **Step 3 : Implémenter `echeancier.ts`**

Calcul des dates en UTC sur des chaînes `AAAA-MM-JJ` (pas d'heure, pas de fuseau). En 6 fois : `Math.floor(prix / 6)` pour les 5 premiers, le reste sur le 6e. Chaque date de versement ou de maintenance se calcule depuis la date d'origine (`ajouterMois(origine, k, jourOrigine)`), jamais depuis la date précédente.

- [ ] **Step 4 : Relancer, vérifier que ça passe.** Expected : PASS.

- [ ] **Step 5 : Commit** `Ventes : échéancier (une fois, 6 fois, maintenance)`

---

### Task 3 : Rapprochement avec les paiements Stripe

**Files :**
- Create : `src/lib/ventes/rapprochement.ts`
- Test : `scripts/test-ventes-rapprochement.ts`

**Interfaces :**
- Consumes : `echeancier`, `ajouterJours` (tâche 2), `Mouvement` (`@/lib/finance/calculs`), `DELAI_GRACE_JOURS`
- Produces :
  - `paiementsDuClient(mouvements: Mouvement[], stripeClientId: string, depuis: string): number`. Somme des `montantCentimes` des mouvements `source === "stripe"`, `sens === "entree"`, `clientId === stripeClientId`, dont le jour de Paris (`jourParis(new Date(m.date))`) est ≥ `depuis`. Les remboursements sont déjà des entrées négatives.
  - `suivreVentes(ventes: Vente[], mouvements: Mouvement[], aujourdhui: string): Map<string, EcheanceSuivie[]>`, indexée par `vente.id`. Ventes `annulee` ignorées (absentes de la Map).
  - `interface ResumeVente { rapprochee: boolean; payeCentimes: number; totalCentimes: number; resteCentimes: number; prochaine: EcheanceSuivie | null; enRetard: number }`
  - `resumeVente(suivies: EcheanceSuivie[]): ResumeVente`. `prochaine` = première échéance non payée.

**Règles (spec, section 6) :**
- Ventes groupées par `stripeClientId`. Pour un groupe : `depuis` = plus petite `signeLe` du groupe moins 30 jours. Le montant payé est réparti sur toutes les échéances du groupe triées par date (puis `venteId`, puis rang) : chaque échéance prend `min(montant, reste)`.
- `payee` si `payeCentimes === montantCentimes` ; sinon `en_retard` si `ajouterJours(date, DELAI_GRACE_JOURS) < aujourdhui` ; sinon `a_venir`.
- Sans `stripeClientId` : toutes `non_rapprochee`, `payeCentimes` = 0, `resumeVente(...).rapprochee` = false, `enRetard` = 0.
- Un montant payé total négatif compte comme 0. Le trop-perçu n'est attribué à rien.

- [ ] **Step 1 : Écrire les tests**

Helper `paiement(clientId, jour, centimes)` qui fabrique un `Mouvement` Stripe entrée daté `${jour}T10:00:00Z`.

```ts
test("une fois, acompte payé, solde à venir", () => {
  const v = vente({ stripeClientId: "cus_1" }); // essentiel 999 €, signé 2026-11-03, en ligne 2026-11-24
  const s = suivreVentes([v], [paiement("cus_1", "2026-11-03", 49_950)], "2026-11-10").get("v1")!;
  assert.deepEqual(s.map((e) => e.statut), ["payee", "a_venir"]);
  assert.deepEqual(resumeVente(s), { rapprochee: true, payeCentimes: 49_950, totalCentimes: 99_900,
    resteCentimes: 49_950, prochaine: s[1], enRetard: 0 });
});

test("retard après 5 jours de grâce seulement", () => {
  const v = vente({ stripeClientId: "cus_1" });
  const p = [paiement("cus_1", "2026-11-03", 49_950)];
  assert.equal(suivreVentes([v], p, "2026-11-29").get("v1")![1].statut, "a_venir");
  assert.equal(suivreVentes([v], p, "2026-11-30").get("v1")![1].statut, "en_retard");
});

test("sans client Stripe : non rapprochée, jamais en retard", () => {
  const s = suivreVentes([vente()], [], "2027-06-01").get("v1")!;
  assert.ok(s.every((e) => e.statut === "non_rapprochee"));
  assert.equal(resumeVente(s).rapprochee, false);
  assert.equal(resumeVente(s).enRetard, 0);
});

test("paiement partiel : l'échéance garde le montant reçu", () => {
  const s = suivreVentes([vente({ stripeClientId: "cus_1" })], [paiement("cus_1", "2026-11-03", 30_000)], "2026-11-04").get("v1")!;
  assert.equal(s[0].payeCentimes, 30_000);
  assert.equal(s[0].statut, "a_venir");
});

test("deux ventes du même client : répartition dans l'ordre des dates", () => {
  const a = vente({ id: "a", formule: "one_page", prixSiteCentimes: 69_900, signeLe: "2026-11-01", miseEnLigneLe: "2026-11-08", stripeClientId: "cus_1" });
  const b = vente({ id: "b", prixSiteCentimes: 30_000, signeLe: "2026-12-01", miseEnLigneLe: "2026-12-10", stripeClientId: "cus_1" });
  const m = suivreVentes([a, b], [paiement("cus_1", "2026-11-01", 34_950), paiement("cus_1", "2026-11-08", 34_950), paiement("cus_1", "2026-12-01", 15_000)], "2026-12-02");
  assert.ok(m.get("a")!.every((e) => e.statut === "payee"));
  assert.deepEqual(m.get("b")!.map((e) => e.statut), ["payee", "a_venir"]);
});

test("remboursement : l'échéance n'est plus couverte", () => {
  const s = suivreVentes([vente({ stripeClientId: "cus_1" })],
    [paiement("cus_1", "2026-11-03", 49_950), paiement("cus_1", "2026-11-05", -49_950)], "2026-11-20").get("v1")!;
  assert.equal(s[0].statut, "en_retard");
});

test("vente annulée absente, paiements d'un autre client ignorés", () => {
  const m = suivreVentes([vente({ statut: "annulee", stripeClientId: "cus_1" }), vente({ id: "v2", stripeClientId: "cus_2" })],
    [paiement("cus_1", "2026-11-03", 99_900)], "2026-11-04");
  assert.equal(m.has("v1"), false);
  assert.equal(m.get("v2")![0].payeCentimes, 0);
});

test("paiement antérieur de plus de 30 jours à la signature ignoré", () => {
  const s = suivreVentes([vente({ stripeClientId: "cus_1" })], [paiement("cus_1", "2026-10-01", 49_950)], "2026-11-04").get("v1")!;
  assert.equal(s[0].payeCentimes, 0);
});
```

- [ ] **Step 2 : Lancer, vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-ventes-rapprochement.ts`
Expected : FAIL.

- [ ] **Step 3 : Implémenter `rapprochement.ts`**

- [ ] **Step 4 : Relancer.** Expected : PASS.

- [ ] **Step 5 : Commit** `Ventes : rapprochement des paiements Stripe et statuts des échéances`

---

### Task 4 : Synthèse pour Finance

**Files :**
- Create : `src/lib/ventes/synthese.ts`
- Test : `scripts/test-ventes-synthese.ts`

**Interfaces :**
- Consumes : `suivreVentes`, `resumeVente` (tâche 3), `finEngagement`, `ajouterMois`, `ajouterJours` (tâche 2), `OBJECTIF_NET_MENSUEL_CENTIMES` (`@/lib/finance/calculs`), `FIN_ENGAGEMENT_ALERTE_JOURS`
- Produces :
  - `objectifBrutCentimes(tauxUrssaf: number): number` = `Math.round(OBJECTIF_NET_MENSUEL_CENTIMES / (1 - tauxUrssaf))`
  - `interface LigneRetard { venteId: string; compteId: string; echeance: EcheanceSuivie; joursRetard: number }`
  - `interface LigneFin { venteId: string; compteId: string; fin: string; maintenanceCentimes: number }`
  - `interface PointPrevision { mois: string /* AAAA-MM */; sites: number; maintenance: number; total: number; objectif: number }`
  - `interface SyntheseVentes { aEncaisserMois: { du: number; deja: number }; maintenanceMensuelle: { centimes: number; sites: number }; resteAEncaisser: number; sixFois: { clients: number; clientsTotal: number; partPourcent: number }; retards: LigneRetard[]; finsEngagement: LigneFin[]; nonRapprochees: Vente[]; prevision: PointPrevision[] }`
  - `syntheseVentes(ventes: Vente[], suivies: Map<string, EcheanceSuivie[]>, aujourdhui: string, tauxUrssaf: number): SyntheseVentes`

**Règles :**
- Seules les ventes `active` comptent.
- `aEncaisserMois` : échéances dont `date` commence par le mois d'`aujourdhui`. `du` = somme des montants, `deja` = somme des `payeCentimes`. Les échéances `non_rapprochee` comptent dans `du`, pas dans `deja`.
- `maintenanceMensuelle` : ventes ayant une échéance `maintenance` dans le mois en cours. `sites` = nombre de ventes, `centimes` = somme des `maintenanceCentimes`.
- `resteAEncaisser` : somme de `montantCentimes - payeCentimes` sur toutes les échéances.
- `sixFois` : comptes distincts (`compteId`) ayant au moins une vente `six_fois`, sur le nombre de comptes distincts ayant une vente. `partPourcent` = prix des sites en 6 fois ÷ prix de tous les sites × 100, arrondi à l'entier, 0 sans vente.
- `retards` : échéances `en_retard`, triées des plus anciennes aux plus récentes. `joursRetard` = jours entre `date` et `aujourdhui`.
- `finsEngagement` : ventes avec `finEngagement` comprise entre `aujourdhui` et `ajouterJours(aujourdhui, 45)` incluses.
- `nonRapprochees` : ventes sans `stripeClientId`.
- `prevision` : 6 mois à partir du mois en cours. `sites` = reste à payer (`montant - paye`) des échéances acompte, solde et versement du mois, `maintenance` = idem pour la maintenance. Les échéances en retard des mois passés sont reportées sur le mois en cours. `objectif` = `objectifBrutCentimes(tauxUrssaf)`.

- [ ] **Step 1 : Écrire les tests**

Construire 3 ventes à la main : A essentiel en une fois, maintenance 90 €, `cus_a` ; B one page en 6 fois, maintenance 49 €, `cus_b` ; C pro en une fois, sans maintenance ni client Stripe. Les passer par `suivreVentes` avec quelques paiements.

```ts
test("objectif brut au taux de 21,2 %", () => assert.equal(objectifBrutCentimes(0.212), 253_807));
test("à encaisser ce mois et déjà payé", () => { /* du et deja attendus pour le mois de aujourdhui */ });
test("maintenance mensuelle : sites dont une mensualité tombe ce mois", () => { /* A et B : 13 900, 2 sites */ });
test("part des clients en 6 fois", () => { /* 1 client sur 3, partPourcent = round(69 900 / (99 900 + 69 900 + 180 000) × 100) = 20 */ });
test("retard du mois précédent reporté sur le mois en cours dans la prévision", () => { /* ... */ });
test("fin d'engagement à 45 jours incluse, à 46 jours exclue", () => { /* ... */ });
test("vente annulée : exclue de toutes les sommes et listes", () => { /* ... */ });
test("mise en ligne repoussée : solde et maintenance changent de mois dans la prévision", () => { /* ... */ });
test("sans vente : zéros, listes vides, 6 mois de prévision", () => { /* ... */ });
```
Chaque test vérifie les valeurs exactes en centimes, calculées à la main à partir des règles ci-dessus.

- [ ] **Step 2 : Lancer, vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-ventes-synthese.ts`

- [ ] **Step 3 : Implémenter `synthese.ts`**

- [ ] **Step 4 : Relancer.** Expected : PASS.

- [ ] **Step 5 : Commit** `Ventes : synthèse de Finance (à encaisser, maintenance, 6 fois, retards, prévision)`

---

### Task 5 : Validation, accès base et routes API

**Files :**
- Create : `src/lib/ventes/validation.ts`, `src/lib/ventes/db.ts`, `src/app/api/ventes/route.ts`, `src/app/api/ventes/[id]/route.ts`
- Test : `scripts/test-ventes-validation.ts`

**Interfaces :**
- Consumes : types et catalogue (tâche 1), `getSupabaseClient` (`@/lib/supabase`), `ajouterEvenement` (`@/lib/crm/db`)
- Produces :
  - `type EntreeVente = Omit<Vente, "id" | "statut">`
  - `validerEntreeVente(corps: unknown): { ok: true; valeur: EntreeVente } | { ok: false; erreur: string }`
  - `lireVentes(filtre?: { compteId?: string }): Promise<Vente[]>`, ventes actives et annulées, triées par `signe_le`
  - `creerVente(e: EntreeVente): Promise<{ id: string }>`
  - `modifierVente(id: string, e: EntreeVente): Promise<boolean>` (false si introuvable)
  - `annulerVente(id: string): Promise<boolean>`
  - `clientsStripeConnus(): Promise<{ id: string; nom: string | null }[]>` : `client_id` distincts de `finance_mouvements` où `source = 'stripe'`, avec le dernier `client_nom` connu, triés par nom
  - `POST /api/ventes` (corps `EntreeVente`) → `{ ok: true, id }`, 400 `{ error }`
  - `PATCH /api/ventes/[id]` (corps `EntreeVente`) → `{ ok: true }`, 404 si introuvable
  - `DELETE /api/ventes/[id]` → passe `statut` à `annulee` (pas de suppression), `{ ok: true }`

**Règles de validation** (messages affichés tels quels dans le formulaire) :
- `compteId` : chaîne non vide.
- `formule` dans `FORMULES`, `options` ⊂ clés d'`OPTIONS` (doublons retirés).
- `prixSiteCentimes` : entier > 0.
- `modePaiement` dans `une_fois`, `six_fois`.
- `signeLe`, `miseEnLigneLe` : `AAAA-MM-JJ` valides, `miseEnLigneLe >= signeLe`, sinon « La mise en ligne ne peut pas précéder la signature. »
- `maintenanceCentimes` : null ou entier > 0. En `six_fois`, null est refusé : « En 6 fois, la maintenance est obligatoire. »
- `maintenanceMois` : entier ≥ 1, 12 par défaut si absent.
- `stripeClientId` : null, ou chaîne commençant par `cus_`. `notes` : null ou chaîne, vide → null.

- [ ] **Step 1 : Écrire les tests de validation**

```ts
test("6 fois sans maintenance refusé", () => {
  const r = validerEntreeVente({ ...entreeOk, modePaiement: "six_fois", maintenanceCentimes: null });
  assert.deepEqual(r, { ok: false, erreur: "En 6 fois, la maintenance est obligatoire." });
});
test("mise en ligne avant signature refusée", () => { /* message exact */ });
test("prix en centimes non entier ou nul refusé", () => { /* 0, -1, 12.5, "999" */ });
test("formule ou option inconnue refusée", () => { /* ... */ });
test("valeurs par défaut : maintenanceMois 12, notes vides à null, options dédoublonnées", () => { /* ... */ });
test("client Stripe mal formé refusé", () => { /* "abc" */ });
```

- [ ] **Step 2 : Lancer, vérifier l'échec**, implémenter `validation.ts`, relancer. Expected : PASS.

- [ ] **Step 3 : Implémenter `db.ts`**

Conversion snake_case ↔ camelCase dans ce fichier uniquement. `updated_at = now()` à chaque modification. Un identifiant non uuid (code `22P02`) vaut « introuvable », comme `lireFiche`. Après création, modification ou annulation, appeler `ajouterEvenement(compteId, "vente_enregistree" | "vente_modifiee" | "vente_annulee", new Date().toISOString(), { formule, modePaiement, prixSiteCentimes })`, pour que l'historique de la fiche le montre. Ajouter dans `libelleEvenement` (`src/lib/crm/affichage.ts`) les libellés « Vente enregistrée », « Vente modifiée », « Vente annulée », suivis de la formule. Ajouter ces trois cas à `scripts/test-crm-affichage.ts`.

- [ ] **Step 4 : Écrire les deux routes** sur le modèle de `src/app/api/comptes/[id]/etape/route.ts` : `export const dynamic = "force-dynamic"`, JSON invalide → 400 « JSON invalide », erreurs → 500 `{ error }`. Le middleware protège déjà `/api/*` par la session.

- [ ] **Step 5 : Vérifier**

Run : `npm test && npx tsc --noEmit`
Expected : tous les tests passent, aucune erreur de type.

- [ ] **Step 6 : Commit** `Ventes : validation, accès base et routes API`

---

### Task 6 : Fiche client et libellés du pipeline

**Files :**
- Create : `src/app/(app)/comptes/[id]/vente-carte.tsx` (composant serveur), `src/app/(app)/comptes/[id]/vente-formulaire.tsx` (client)
- Modify : `src/app/(app)/comptes/[id]/page.tsx`, `src/lib/crm/pipeline.ts`
- Test : `scripts/test-crm-pipeline.ts` (libellés), `scripts/test-ventes-affichage.ts`

**Interfaces :**
- Consumes : `lireVentes`, `clientsStripeConnus` (tâche 5), `lireMouvements` (`@/lib/finance/db`), `suivreVentes`, `resumeVente` (tâche 3), `libelleEcheance`, `finEngagement` (tâche 2), `prixPropose`, `MAINTENANCE_CENTIMES`, `FORMULE_LABELS`, `OPTIONS` (tâche 1)
- Produces (dans `src/lib/ventes/affichage.ts`, pur) :
  - `texteFormule(v: Vente): string` : « Essentiel · 6 fois · maintenance 90 € » ; « One page · en une fois » sans maintenance
  - `textePaye(r: ResumeVente): string` : « 333 € sur 999 € » ; « non rapproché » si `!r.rapprochee`
  - `LIBELLE_STATUT: Record<StatutEcheance, string>` = Payé, À venir, En retard, Non rapproché

- [ ] **Step 1 : Tests**

```ts
// test-crm-pipeline.ts
assert.equal(ETAPE_LABELS.acompte_paye, "1er paiement reçu");
assert.equal(ETAPE_LABELS.solde, "Site payé");
// test-ventes-affichage.ts
assert.equal(texteFormule(venteEssentiel6FoisMaint90), "Essentiel · 6 fois · maintenance 90 €");
assert.equal(texteFormule(onePageUneFoisSansMaint), "One page · en une fois");
assert.equal(textePaye({ ...resume, rapprochee: true, payeCentimes: 33_300, totalCentimes: 99_900 }), "333 € sur 999 €");
assert.equal(textePaye({ ...resume, rapprochee: false }), "non rapproché");
```
Le total affiché par `textePaye` couvre le site et la maintenance de la vente (c'est `totalCentimes`).

- [ ] **Step 2 : Lancer, vérifier l'échec**, implémenter `affichage.ts` et les deux libellés, relancer. Expected : PASS.

- [ ] **Step 3 : Page fiche**

Dans `page.tsx`, lire en parallèle `lireVentes({ compteId: id })`, `clientsStripeConnus()` et, s'il existe une vente, `lireMouvements(new Date(<plus petite signeLe − 30 jours>T00:00:00Z))`. Si la lecture des ventes échoue, afficher la fiche normalement avec la carte Vente en « Ventes indisponibles » (pas de 500). Remplacer les indicateurs « Devis » et « Payé » :
- sans vente active : « Formule : pas encore », « Payé : pas encore » ;
- sinon, pour la vente active la plus récente : `texteFormule`, `textePaye`.

`VenteCarte` (une carte `cardStyle` par vente, la plus récente en premier ; une vente annulée apparaît grisée avec « Annulée ») : formule, options, prix, mode, maintenance et fin d'engagement ; liste d'échéances (date au format court, `libelleEcheance`, montant, pastille `LIBELLE_STATUT` colorée via `COULEURS_TON`) ; pied « Payé X · Reste Y · Prochaine : date ». Boutons « Modifier » (ouvre le formulaire pré-rempli) et « Annuler la vente » (deuxième clic « Confirmer l'annulation » dans la page, puis `DELETE`, puis `router.refresh()`).

Bouton « Enregistrer la vente » affiché si l'étape est `devis_envoye` ou une étape suivante, `perdu` exclu.

- [ ] **Step 4 : Formulaire `VenteFormulaire`**

Champs : formule (select, pré-remplit prix et maintenance avec `prixPropose` et `MAINTENANCE_CENTIMES`), cases d'options (recalculent le prix tant qu'Edgar n'a pas modifié le prix à la main), prix en euros (converti en centimes), mode « En une fois / En 6 fois », date de signature (défaut : aujourd'hui), mise en ligne prévue (défaut : signature + 21 jours, recalculée quand la signature change), case maintenance avec montant en euros (cochée et désactivée en 6 fois), durée en mois (défaut 12), client Stripe (select de `clientsStripeConnus` + « Pas encore dans Stripe »), notes. Envoi `POST` ou `PATCH`, erreur de l'API affichée en `role="alert"`, double envoi bloqué, `router.refresh()` en cas de succès. Mêmes styles de champs que les formulaires existants (`@/components/ui/form-styles`), lisible sur iPhone.

- [ ] **Step 5 : Vérifier**

Run : `npm test && npx tsc --noEmit`, puis `npm run dev`. Sur un compte de test : créer une vente en 6 fois (maintenance verrouillée), la modifier, l'annuler. Vérifier l'historique de la fiche et l'affichage à 390 px de large.

- [ ] **Step 6 : Commit** `Ventes : carte Vente et formulaire sur la fiche client, libellés d'étapes`

---

### Task 7 : Section « Ventes signées » de Finance

**Files :**
- Create : `src/app/(app)/finance/ventes-section.tsx` (composant serveur)
- Modify : `src/app/(app)/finance/page.tsx` (insérer la section après le bloc objectif, avant les colonnes existantes, ligne ~258 sur `main`), `src/app/(app)/finance/finance.module.css` si besoin

**Interfaces :**
- Consumes : `lireVentes` (tâche 5), `suivreVentes` (tâche 3), `syntheseVentes` (tâche 4), `texteFormule` (tâche 6), `formatEuros`, `jourParis`, les `mouvements` et `reglages` déjà lus par la page
- Produces : `VentesSection({ ventes, mouvements, aujourdhui, tauxUrssaf, noms }: { ventes: Vente[] | null; mouvements: Mouvement[] | null; aujourdhui: string; tauxUrssaf: number; noms: Map<string, string> })`. `noms` = compteId → entreprise ou nom, lu en une requête sur `comptes` pour les `compteId` des ventes.

- [ ] **Step 1 : Brancher les données**

La page lit `lireVentes()` dans son `try` existant. Les mouvements déjà lus remontent à 6 mois : si la plus petite `signeLe − 30 jours` est plus ancienne, relire depuis cette date. Si `ventes` ou `mouvements` vaut null, la section affiche « Ventes indisponibles » sans casser la page. Sans aucune vente : « Aucune vente enregistrée. Enregistre-la depuis la fiche du client. »

- [ ] **Step 2 : Rendu**

Titre « Ventes signées ». Quatre cartes `.hub-verre`, même grille que les cartes existantes :
- « À encaisser ce mois » : `formatEuros(du)`, détail « dont X déjà payés » ;
- « Maintenance mensuelle » : `formatEuros(centimes)`, détail « N sites » ;
- « Reste à encaisser » : `formatEuros(resteAEncaisser)`, détail « ventes signées » ;
- « Paiement en 6 fois » : « 2 clients sur 5 », détail « 20 % du montant vendu ».

Listes sans verre : « En retard » (client lié à `/comptes/[id]`, `libelleEcheance`, montant, « depuis N jours » ; vide : « Aucun retard »), « Fins d'engagement dans les 45 jours » (client, date, montant mensuel ; masquée si vide), « Ventes non rapprochées » (client, `texteFormule`, « Choisis le client Stripe sur la fiche » ; masquée si vide).

Tableau « Prévision, ventes signées uniquement » : une ligne par mois (« nov. 2026 »), colonnes Sites, Maintenance, Total, et une pastille « objectif atteint » si total ≥ objectif. Note sous le tableau : « Objectif : X € de CA par mois, soit 2 000 € nets au taux de cotisation des réglages. » Défilement horizontal du tableau seul sur iPhone, jamais de la page.

- [ ] **Step 3 : Vérifier**

Run : `npm test && npx tsc --noEmit`, puis `npm run dev`. Avec les ventes de test de la tâche 6, vérifier que les chiffres de la section correspondent à la fiche, que brut, net et objectif n'ont pas bougé, et que la page tient à 390 px.

- [ ] **Step 4 : Commit** `Ventes : section Ventes signées dans Finance`

---

### Task 8 : Revue, mise en production et documentation

**Files :**
- Modify : `/Users/ed/Desktop/jarvis-kleak/CLAUDE.md` (section Hub Agence), `/Users/ed/Desktop/jarvis-kleak/context/CONTEXT.md` (ligne Outil interne), après la fusion seulement

- [ ] **Step 1 : Vérification complète**

Run : `npm test && npx tsc --noEmit && npm run lint`, aucun serveur dev lancé, puis `npm run build`.
Expected : tout passe.

- [ ] **Step 2 : Supprimer les ventes de test** créées en local dans la base (même base que la production) et noter les identifiants supprimés.

- [ ] **Step 3 : Demander à Edgar** d'exécuter `supabase/ventes.sql` dans le SQL Editor, puis de valider la branche en local.

- [ ] **Step 4 : Après son accord**, fusionner `ventes` dans `main` (`git merge --no-ff ventes -m "Fusion : ventes signées, échéancier et maintenance"`), pousser, vérifier le déploiement Vercel `hub-agence-kleak`, puis retirer le worktree (`git worktree remove ../hub-agence-ventes`).

- [ ] **Step 5 : Documenter**

Dans `CLAUDE.md`, section Hub Agence, ajouter une puce : « **Ventes** (spec `docs/superpowers/specs/2026-10-20-ventes-paiements-design.md`) : une vente signée par compte (formule, une fois ou 6 fois, maintenance), échéancier rapproché des paiements Stripe sur la fiche client et dans Finance. Le catalogue de l'offre vit dans `src/lib/offre.ts`. » Mettre à jour la ligne Outil interne de `CONTEXT.md`. Commit dans le dépôt du workspace.
