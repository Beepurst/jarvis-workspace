# Onglet Finance, lot 2 (relevé CSV Revolut Pro) : plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Edgar importe depuis l'iPhone le relevé CSV de son compte Revolut Pro, et l'onglet Finance en tire les vraies dépenses, classées par poste et corrigeables.

**Architecture:** Le fichier est lu par une fonction pure (`revolut-releve.ts`) qui produit des mouvements bruts, enregistrés dans `finance_mouvements` (source `revolut`) sans jamais écraser une correction manuelle. Le classement (dépense, remboursement, interne, cotisations, à vérifier, ignoré) et le poste ne sont **pas figés** : ils sont recalculés à chaque lecture par `revolut-classement.ts`, dans l'ordre correction de la ligne, puis choix retenu pour le fournisseur, puis règles automatiques, ce qui rend la correction rétroactive. Les calculs de `calculs.ts` ne comptent une ligne Revolut que si elle est classée dépense ou remboursement.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Supabase (PostgREST), tests `node:test` lancés par `npm test` (`scripts/test-*.ts`, alias `@/` via `scripts/alias-hook.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-20-finance-lot-2-revolut-csv-design.md`, qui complète `docs/superpowers/specs/2026-10-19-finance-design.md`. Lire les deux.

## Global Constraints

- Code dans `livrables/hub-agence/` (dépôt `Beepurst/hub-agence-kleak`, indépendant du workspace : ne jamais le commiter depuis la racine). Travailler sur la branche `finance-lot-2` ; **chaque push sur `main` déploie en production**, la fusion attend la validation d'Edgar.
- **Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne** (même `.next`). Vérifier les types avec `npx tsc --noEmit`.
- Couleurs : uniquement les variables de `src/app/theme.css`. Ne toucher ni à `theme.css` ni à `globals.css`. `scripts/test-couleurs.ts`, `scripts/test-contraste.ts` et `scripts/test-champs-ios.ts` doivent rester verts.
- Classes existantes à réutiliser : `hub-verre` (cartes de chiffres et en-têtes seulement, jamais les listes), `hub-groupe`, `hub-ligne`, `hub-ligne-texte`, `hub-ligne-sous`, `hub-bandeau`, `hub-section-titre`, `hub-mono`, composant `NotConnected`.
- Textes visibles en français simple, tutoiement d'Edgar dans les aides, **aucun tiret long**.
- Une donnée absente n'est pas zéro : afficher « Indisponible » ou un texte, jamais « 0 € » par défaut.
- En-tête exact du CSV : `Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance`.
- Postes, dans cet ordre : `Publicité`, `Outils et abonnements`, `Banque et frais`, `Matériel`, `Formation`, `Déplacements`, `Autre`. Choix manuels en plus : `Interne (exclu)`, `Cotisations`.
- Relevé ancien : bandeau au-delà de **35 jours** après le dernier import.
- Date de départ par défaut : 15/10/2026 (Réglages), appliquée **à la lecture**, jamais par suppression des lignes Revolut.

## Review Focus

- **Fichier venu de l'app Fichiers d'iOS** : type MIME vide ou `application/octet-stream`, BOM UTF-8, fins de ligne `\r\n`. Le fichier doit être reconnu par son contenu, pas par son type. Tests : Task 1 (`BOM et CRLF`) et Task 1 (`typeFichier`).
- **Description contenant une virgule ou des guillemets** (« Framer, Inc. », `"Abonnement ""Pro"""`) : un seul champ, pas de colonne décalée. Test : Task 1 (`guillemets et virgules`).
- **Même relevé importé deux fois, ou relevés qui se recoupent** : aucun doublon, compte rendu « déjà présentes ». Test : Task 2 (`compteRendu : réimport`).
- **Ligne en attente devenue terminée ou annulée au relevé suivant** (état, date de fin, frais et solde changent) : même identifiant, ligne mise à jour. Test : Task 1 (`identifiant stable`) et Task 2 (`compteRendu : mise à jour`).
- **Date de départ reculée après un import** : les lignes antérieures, conservées en base, réapparaissent avec leurs corrections. Test : Task 2 (`compteRendu : avant le départ`, comptées ignorées mais présentes dans `lignes`).

---

### Task 1 : lecture du relevé CSV

**Files:**
- Create: `livrables/hub-agence/src/lib/finance/revolut-releve.ts`
- Modify: `livrables/hub-agence/src/lib/finance/calculs.ts` (exporter `instantParis`)
- Test: `livrables/hub-agence/scripts/test-finance-revolut-releve.ts`

**Interfaces:**
- Produces:
  - `instantParis(an: number, mois: number, jour: number, h: number, min: number, s: number): Date` dans `calculs.ts` (heure murale de Paris vers instant UTC, même technique que `minuitParis`, qui devient un appel à `instantParis(an, mois, jour, 0, 0, 0)`).
  - `typeFichier(debut: Uint8Array): "csv" | "xlsx" | "pdf"` : `PK` en tête = xlsx, `%PDF` = pdf, sinon csv.
  - `interface LigneReleve { type: string; produit: string; debut: string /* ISO */; fin: string | null /* ISO */; description: string; montantCentimes: number /* signé */; fraisCentimes: number /* ≥ 0 */; devise: string; etat: string; solde: string }`
  - `lireReleveRevolut(texte: string): { ok: true; lignes: LigneReleve[] } | { ok: false; erreur: string }`
  - `interface MouvementRevolut { id: string; sens: "entree" | "sortie"; montantCentimes: number /* > 0 */; date: string /* ISO */; libelle: string; type: string; etat: string; devise: string; fournisseur: string }`
  - `mouvementsDepuisReleve(lignes: LigneReleve[]): MouvementRevolut[]`
  - `cleFournisseur(description: string): string`

- [ ] **Step 1 : créer la branche**

```bash
cd livrables/hub-agence && git checkout main && git pull && git checkout -b finance-lot-2
```

- [ ] **Step 2 : écrire les tests qui échouent** dans `scripts/test-finance-revolut-releve.ts` (en-tête de fichier sur le modèle de `test-finance-calculs.ts`) :

```ts
const ENTETE = "Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance";

test("relevé vide : en-tête seul, zéro ligne", () => {
  assert.deepEqual(lireReleveRevolut(ENTETE + "\n"), { ok: true, lignes: [] });
});

test("ligne de paiement par carte", () => {
  const r = lireReleveRevolut(`${ENTETE}\nCARD_PAYMENT,Current,2026-10-20 10:15:00,2026-10-21 09:00:00,Framer,-15.00,0.00,EUR,COMPLETED,85.00`);
  assert.ok(r.ok);
  assert.deepEqual(r.lignes[0], {
    type: "CARD_PAYMENT", produit: "Current",
    debut: "2026-10-20T08:15:00.000Z", fin: "2026-10-21T07:00:00.000Z",
    description: "Framer", montantCentimes: -1500, fraisCentimes: 0,
    devise: "EUR", etat: "COMPLETED", solde: "85.00",
  });
});

test("BOM et CRLF", () => { /* "﻿" + ENTETE + "\r\n" + ligne + "\r\n" donne 1 ligne identique */ });
test("colonnes dans un autre ordre", () => { /* en-tête permuté, mêmes valeurs lues */ });
test("guillemets et virgules", () => {
  // Description `"Framer, Inc."` et `"Abonnement ""Pro"""` lues comme `Framer, Inc.` et `Abonnement "Pro"`
});
test("date de fin vide", () => { /* Completed Date vide → fin: null (ligne PENDING) */ });
test("refus : en-tête différent", () => {
  const r = lireReleveRevolut("Date,Montant\n2026-10-20,12");
  assert.equal(r.ok, false);
  assert.match((r as { erreur: string }).erreur, /CSV/);
});
test("refus : montant illisible, tout le fichier", () => {
  // une bonne ligne puis "abc" en Amount → ok:false, erreur qui cite le numéro de ligne (« ligne 3 »)
});
test("typeFichier", () => {
  assert.equal(typeFichier(new Uint8Array([0x50, 0x4b, 3, 4])), "xlsx");
  assert.equal(typeFichier(new TextEncoder().encode("%PDF-1.7")), "pdf");
  assert.equal(typeFichier(new TextEncoder().encode("﻿Type,")), "csv");
});
test("mouvementsDepuisReleve : sortie, entrée, frais en ligne à part", () => {
  // Amount -15.00 Fee 0.50 → 2 mouvements : sortie 1500 libellé "Framer", et sortie 50
  //   d'id `${id}:frais`, type "FEE", libellé "Frais Revolut, Framer", fournisseur "frais revolut"
  // Amount 200.00 → entree 200 ; Amount 0 et Fee 0 → aucun mouvement
  // date = fin si présente, sinon debut
});
test("identifiant stable", () => {
  // même ligne avec State PENDING→COMPLETED, Completed Date, Fee et Balance différents : même id
  // deux lignes strictement identiques dans un fichier : deux ids différents (rang d'occurrence)
  // id commence par "revolut:"
});
test("cleFournisseur", () => {
  assert.equal(cleFournisseur("FACEBK *RWXK2A9BC2"), "facebk");
  assert.equal(cleFournisseur("Framer, Inc."), "framer inc");
  assert.equal(cleFournisseur("Vercel Inc. 4821"), "vercel inc");
  assert.equal(cleFournisseur("Café Été"), "cafe ete");
});
```

- [ ] **Step 3 : vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-finance-revolut-releve.ts`
Expected: FAIL, module `@/lib/finance/revolut-releve` introuvable.

- [ ] **Step 4 : implémenter** `revolut-releve.ts` et `instantParis`.
  - Lecteur CSV maison (pas de dépendance) : champs entre guillemets, `""` échappé, virgules dans les guillemets, `\r\n` ou `\n`, BOM retiré, lignes vides finales ignorées.
  - En-tête : l'ensemble des 10 colonnes doit être présent, ordre libre. Message d'erreur : `Ce fichier n'est pas un relevé CSV Revolut. Dans Revolut, choisis le format CSV.`
  - Dates `AAAA-MM-JJ HH:MM:SS` lues comme heure de Paris via `instantParis`. Montants : point décimal, signe éventuel, conversion en centimes par arrondi (`Math.round(x * 100)`). Toute valeur illisible : `Ligne N illisible (montant | date).`, N = numéro de ligne du fichier (en-tête = 1).
  - Identifiant : `revolut:` + SHA-1 hex (`node:crypto`) de `[type, debut, description, montantCentimes, devise, rang].join("\u001f")`, `rang` = nombre de lignes identiques sur ces champs déjà vues dans le fichier.
  - `cleFournisseur` : minuscules, accents retirés (NFD), tout ce qui suit `*` retiré, chiffres retirés, tout caractère non lettre remplacé par une espace, espaces réduites, rognée.

- [ ] **Step 5 : vérifier** : la commande du step 3 passe, puis `npm test` et `npx tsc --noEmit` passent.

- [ ] **Step 6 : commit**

```bash
git add src/lib/finance/revolut-releve.ts src/lib/finance/calculs.ts scripts/test-finance-revolut-releve.ts
git commit -m "Finance lot 2 : lecture du relevé CSV Revolut"
```

---

### Task 2 : classement et compte rendu d'import

**Files:**
- Create: `livrables/hub-agence/src/lib/finance/revolut-classement.ts`
- Test: `livrables/hub-agence/scripts/test-finance-revolut-classement.ts`

**Interfaces:**
- Consumes: `MouvementRevolut` (Task 1).
- Produces:
  - `POSTES = ["Publicité", "Outils et abonnements", "Banque et frais", "Matériel", "Formation", "Déplacements", "Autre"] as const`, `type Poste = (typeof POSTES)[number]`
  - `type Choix = Poste | "interne" | "cotisations"`, `CHOIX_LIBELLES: Record<Choix, string>` (`interne` → `Interne (exclu)`, `cotisations` → `Cotisations`, un poste → lui-même), `estChoix(v: unknown): v is Choix`
  - `type Classement = "depense" | "remboursement" | "interne" | "cotisations" | "a_verifier" | "ignore"`
  - `type EntreeClassement = Pick<MouvementRevolut, "sens" | "type" | "etat" | "devise" | "libelle" | "fournisseur"> & { choixManuel: Choix | null }`
  - `classer(e: EntreeClassement, regles: Map<string, Choix>): { classement: Classement; poste: Poste | null }`
  - `interface CompteRendu { total: number; ajoutees: number; dejaPresentes: number; misesAJour: number; ignorees: number; aVerifier: number }`
  - `compteRendu(nouveaux: MouvementRevolut[], existants: Map<string, Pick<MouvementRevolut, "etat" | "date" | "montantCentimes">>, regles: Map<string, Choix>, dateDepart: string): CompteRendu`

- [ ] **Step 1 : écrire les tests qui échouent** (une fabrique `ent(surcharge)` qui part d'une sortie `CARD_PAYMENT`, `COMPLETED`, `EUR`, libellé `Framer`, fournisseur `framer`, sans choix manuel) :

```ts
test("règles automatiques", () => {
  const vide = new Map();
  assert.deepEqual(classer(ent({}), vide), { classement: "depense", poste: "Outils et abonnements" });
  assert.deepEqual(classer(ent({ libelle: "FACEBK *X", fournisseur: "facebk" }), vide), { classement: "depense", poste: "Publicité" });
  assert.deepEqual(classer(ent({ libelle: "Boulangerie", fournisseur: "boulangerie" }), vide), { classement: "depense", poste: "Autre" });
  assert.deepEqual(classer(ent({ type: "FEE" }), vide), { classement: "depense", poste: "Banque et frais" });
  assert.deepEqual(classer(ent({ etat: "PENDING" }), vide), { classement: "ignore", poste: null });
  assert.deepEqual(classer(ent({ etat: "REVERTED" }), vide), { classement: "ignore", poste: null });
  assert.deepEqual(classer(ent({ type: "EXCHANGE" }), vide), { classement: "interne", poste: null });
  assert.deepEqual(classer(ent({ sens: "entree", type: "TRANSFER", libelle: "STRIPE PAYMENTS", fournisseur: "stripe payments" }), vide), { classement: "interne", poste: null });
  assert.deepEqual(classer(ent({ sens: "entree", type: "TOPUP" }), vide), { classement: "interne", poste: null });
  assert.deepEqual(classer(ent({ type: "TRANSFER", libelle: "To Edgar", fournisseur: "to edgar" }), vide), { classement: "interne", poste: null });
  assert.deepEqual(classer(ent({ libelle: "URSSAF", fournisseur: "urssaf" }), vide), { classement: "cotisations", poste: null });
  assert.deepEqual(classer(ent({ sens: "entree", type: "CARD_REFUND" }), vide), { classement: "remboursement", poste: "Outils et abonnements" });
  assert.deepEqual(classer(ent({ sens: "entree", type: "TRANSFER", libelle: "Inconnu", fournisseur: "inconnu" }), vide), { classement: "a_verifier", poste: null });
  assert.deepEqual(classer(ent({ devise: "USD" }), vide), { classement: "a_verifier", poste: null });
});

test("priorité : ligne, puis fournisseur, puis règles", () => {
  const regles = new Map([["framer", "Formation" as const]]);
  assert.deepEqual(classer(ent({}), regles), { classement: "depense", poste: "Formation" });
  assert.deepEqual(classer(ent({ choixManuel: "Matériel" }), regles), { classement: "depense", poste: "Matériel" });
  assert.deepEqual(classer(ent({ choixManuel: "interne" }), regles), { classement: "interne", poste: null });
  assert.deepEqual(classer(ent({ sens: "entree", type: "TRANSFER", libelle: "Inconnu", fournisseur: "inconnu", choixManuel: "Publicité" }), regles), { classement: "remboursement", poste: "Publicité" });
});

test("un choix ne réveille jamais une ligne ignorée", () => {
  assert.equal(classer(ent({ etat: "PENDING", choixManuel: "Publicité" }), new Map()).classement, "ignore");
});

test("compteRendu : premier import", () => { /* 3 nouveaux, 0 existant → ajoutees 3 */ });
test("compteRendu : réimport", () => { /* mêmes 3, déjà existants à l'identique → dejaPresentes 3, ajoutees 0 */ });
test("compteRendu : mise à jour", () => { /* existant PENDING, nouveau COMPLETED → misesAJour 1 */ });
test("compteRendu : ignorées et à vérifier", () => {
  // PENDING, interne et date avant dateDepart comptées dans ignorees ; entrée inconnue dans aVerifier
  // total = nouveaux.length
});
```

- [ ] **Step 2 : vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-finance-revolut-classement.ts`
Expected: FAIL, module introuvable.

- [ ] **Step 3 : implémenter** `revolut-classement.ts`. Ordre des règles automatiques, la première qui s'applique gagne :
  1. `etat !== "COMPLETED"` → ignore (aucun choix ne s'applique) ;
  2. choix manuel de la ligne, puis choix du fournisseur (`regles.get(fournisseur)`) : un poste donne `depense` pour une sortie, `remboursement` pour une entrée ;
  3. `EXCHANGE` → interne ;
  4. libellé contenant `urssaf` → cotisations ;
  5. entrée : `stripe` dans le libellé ou type `TOPUP` → interne ; `CARD_REFUND` ou `REFUND` → remboursement, poste par fournisseur connu, sinon `Autre` ; toute autre entrée → a_verifier ;
  6. sortie de type `TRANSFER` dont le libellé contient `edgar`, `personal` ou `perso` → interne (hypothèse à confirmer sur le premier vrai relevé) ;
  7. `devise !== "EUR"` → a_verifier ;
  8. type `FEE` → depense, `Banque et frais` ;
  9. sortie → depense, poste par fournisseur connu, sinon `Autre`.

  Fournisseurs connus, sur le libellé en minuscules : `facebk|facebook|meta` → Publicité ; `framer|vercel|supabase|cal\.com|brevo|anthropic|claude|ionos` → Outils et abonnements ; `revolut` → Banque et frais.
  `compteRendu` : une ligne existante est « mise à jour » si `etat`, `date` ou `montantCentimes` diffèrent, sinon « déjà présente ». `ignorees` = classement `ignore` ou `interne`, ou date avant `debutJourParis(dateDepart)`.

- [ ] **Step 4 : vérifier** : la commande du step 2 passe, puis `npm test` et `npx tsc --noEmit` passent.

- [ ] **Step 5 : commit**

```bash
git add src/lib/finance/revolut-classement.ts scripts/test-finance-revolut-classement.ts
git commit -m "Finance lot 2 : classement des lignes Revolut et compte rendu d'import"
```

---

### Task 3 : calculs de l'onglet avec Revolut

**Files:**
- Modify: `livrables/hub-agence/src/lib/finance/calculs.ts`
- Modify: `livrables/hub-agence/src/lib/finance/stripe-mouvements.ts` (renseigner `classement: null`)
- Test: `livrables/hub-agence/scripts/test-finance-calculs.ts`, `livrables/hub-agence/scripts/test-finance-stripe.ts`

**Interfaces:**
- Consumes: `Classement`, `Poste`, `POSTES` (Task 2).
- Produces:
  - `Mouvement` gagne `classement: Classement | null` (`null` pour Stripe) ; `poste` porte le poste calculé pour Revolut.
  - `Reglages` gagne `dernierImport: string | null`.
  - `compte(m: Mouvement): boolean` : vrai pour Stripe, et pour Revolut classé `depense` ou `remboursement`.
  - `depensesParPoste(mouvements: Mouvement[], periode: Periode): { poste: Poste; totalCentimes: number; nb: number }[]` : du plus gros au plus petit, sans les postes à zéro ; un remboursement vient en déduction.
  - `releveAncien(dernierImport: string | null, maintenant: Date): boolean` : vrai seulement au-delà de 35 jours.
  - `aVerifier(mouvements: Mouvement[]): Mouvement[]` : lignes Revolut classées `a_verifier`.

- [ ] **Step 1 : adapter les fabriques de test existantes** (`mvt()` gagne `classement: null`, `REGLAGES` gagne `dernierImport: null`) et **écrire les tests qui échouent** :

```ts
const PERIODE_OCTOBRE = periodeFinance("mois", new Date("2026-10-20T12:00:00Z"), "2026-10-15");
const rev = (s: Partial<Mouvement>) => mvt({ source: "revolut", sens: "sortie", classement: "depense", poste: "Publicité", ...s });

test("synthese : dépenses Revolut, remboursement déduit, internes et à vérifier ignorés", () => {
  const ms = [
    mvt({ montantCentimes: 100_000 }),
    rev({ montantCentimes: 5_000 }),
    rev({ sens: "entree", classement: "remboursement", montantCentimes: 1_000 }),
    rev({ sens: "entree", classement: "interne", montantCentimes: 90_000 }),
    rev({ sens: "entree", classement: "a_verifier", montantCentimes: 7_000 }),
    rev({ classement: "cotisations", montantCentimes: 21_200 }),
  ];
  const s = synthese(ms, PERIODE_OCTOBRE, 0.212);
  assert.equal(s.brut, 100_000);
  assert.equal(s.depenses, 4_000);
  assert.equal(s.net, 100_000 - 4_000 - 21_200);
});
test("serieMensuelle et derniersMouvements ignorent ce qui ne compte pas", () => { /* mêmes données */ });
test("depensesParPoste : tri, remboursement déduit, postes vides absents", () => { /* … */ });
test("releveAncien : null faux, 35 jours faux, 36 jours vrai", () => { /* … */ });
test("vueFinance : sans import, Dépenses en texte et Net « avant dépenses Revolut »", () => {
  // cartes[1].valeur === "Aucun relevé Revolut importé" ; cartes[1].detail commence par "Frais Stripe"
  // cartes[2].detail contient "avant dépenses Revolut"
});
test("vueFinance : après import, vraie somme et date du relevé", () => {
  // dernierImport "2026-11-03T09:00:00Z" → cartes[1].valeur = formatEuros(depenses),
  // cartes[1].detail === "relevé importé le 3 nov." ; cartes[2].detail sans "avant dépenses"
  // (format : `cotisations estimées ${formatEuros(cotisations)} déduites`)
});
```

- [ ] **Step 2 : vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-finance-calculs.ts`
Expected: FAIL sur les nouveaux tests (et erreur de type tant que `classement` n'existe pas).

- [ ] **Step 3 : implémenter.** `synthese`, `serieMensuelle` et `derniersMouvements` passent par `compte(m)`. Pour Revolut : `depense` ajoute aux dépenses ou aux sorties, `remboursement` les diminue. Les clients et le brut restent Stripe seul. `vueFinance` : textes exacts du step 1, date au format `Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })`.

- [ ] **Step 4 : vérifier** : `npm test` et `npx tsc --noEmit` passent (ce dernier signalera aussi `db.ts`, à compléter en Task 4 ; dans ce cas, renseigner provisoirement `classement: null` et `dernierImport: null` dans `db.ts` pour que les types passent).

- [ ] **Step 5 : commit**

```bash
git add src/lib/finance/calculs.ts src/lib/finance/stripe-mouvements.ts src/lib/finance/db.ts scripts/test-finance-calculs.ts scripts/test-finance-stripe.ts
git commit -m "Finance lot 2 : calculs avec les dépenses Revolut"
```

---

### Task 4 : schéma et accès base

**Files:**
- Create: `livrables/hub-agence/supabase/finance-lot-2.sql`
- Modify: `livrables/hub-agence/src/lib/finance/db.ts`

**Interfaces:**
- Consumes: `MouvementRevolut` (Task 1), `classer`, `compteRendu`, `Choix`, `estChoix` (Task 2), `Mouvement`, `Reglages` (Task 3).
- Produces:
  - `importerReleve(mouvements: MouvementRevolut[], maintenant: Date): Promise<CompteRendu>`
  - `enregistrerChoix(id: string, choix: Choix): Promise<void>`
  - `lireMouvements(depuis: Date)` renvoie aussi les lignes Revolut, classées ; `lireReglages()` renvoie `dernierImport`.

- [ ] **Step 1 : écrire `supabase/finance-lot-2.sql`**, idempotent, commenté comme `finance.sql` :

```sql
alter table finance_mouvements
  add column if not exists revolut_type text,
  add column if not exists revolut_etat text,
  add column if not exists devise text,
  add column if not exists fournisseur text,
  add column if not exists choix_manuel text;
create index if not exists finance_mouvements_fournisseur on finance_mouvements (fournisseur);

create table if not exists finance_fournisseurs (
  fournisseur text primary key,
  choix text not null,
  maj_le timestamptz not null default now()
);
alter table finance_fournisseurs enable row level security;

alter table finance_reglages add column if not exists dernier_import timestamptz;
```

- [ ] **Step 2 : implémenter dans `db.ts`.**
  - `importerReleve` : lit les règles (`finance_fournisseurs`), la date de départ et les lignes existantes pour les ids reçus (`in("id", …)`, par paquets de 200), calcule `compteRendu`, puis un `upsert` (`onConflict: "id"`) qui envoie **uniquement** `id, source: "revolut", sens, montant_centimes, date, libelle, revolut_type, revolut_etat, devise, fournisseur, synchro_le` (jamais `choix_manuel` ni `poste`, pour ne pas écraser une correction), par paquets de `PAGE`, et enfin met `dernier_import` à `maintenant`, y compris pour un relevé vide. Aucune suppression de ligne Revolut.
  - `lireMouvements` : sélectionne aussi les nouvelles colonnes et lit les règles une fois ; pour chaque ligne Revolut, `classer(…)` donne `classement` et `poste` ; un `choix_manuel` ou une règle qui ne passe pas `estChoix` est ignoré.
  - `enregistrerChoix` : met `choix_manuel` sur la ligne, puis upsert `{ fournisseur, choix, maj_le }` dans `finance_fournisseurs` avec le fournisseur de cette ligne (rétroactif par construction, puisque le classement se recalcule à la lecture). Erreur si l'id n'existe pas ou n'est pas Revolut.
  - La purge par date de départ de `synchroniserStripe` reste limitée à Stripe.

- [ ] **Step 3 : vérifier** : `npx tsc --noEmit` et `npm test` passent.

- [ ] **Step 4 : commit**

```bash
git add supabase/finance-lot-2.sql src/lib/finance/db.ts
git commit -m "Finance lot 2 : schéma et accès base pour les lignes Revolut"
```

---

### Task 5 : routes d'import et de correction

**Files:**
- Create: `livrables/hub-agence/src/app/api/finance/revolut/import/route.ts`
- Create: `livrables/hub-agence/src/app/api/finance/revolut/classer/route.ts`

**Interfaces:**
- Consumes: `typeFichier`, `lireReleveRevolut`, `mouvementsDepuisReleve` (Task 1), `estChoix` (Task 2), `importerReleve`, `enregistrerChoix` (Task 4).
- Produces:
  - `POST /api/finance/revolut/import`, multipart, champ `fichier` → `200 { compteRendu: CompteRendu }` ou `400 { error: string }`.
  - `POST /api/finance/revolut/classer`, JSON `{ id: string, choix: Choix }` → `200 { ok: true }` ou `400 { error }`.

- [ ] **Step 1 : implémenter les deux routes** sur le modèle de `api/finance/reglages/route.ts` (`dynamic = "force-dynamic"`, `try/catch`, 500 avec le message). Toutes deux sont protégées par le middleware existant (non listées dans les exclusions de `src/middleware.ts` : ne pas les y ajouter).
  - Import : **ne jamais se fier au type MIME** (iOS envoie souvent un type vide). Refus 400 si pas de fichier ou fichier vide ; au-delà de 2 Mo : `Fichier trop lourd pour un relevé (2 Mo maximum).` ; `typeFichier` xlsx : `C'est un fichier Excel. Dans Revolut, choisis le format CSV.` ; pdf : `C'est un PDF. Dans Revolut, choisis le format CSV.` ; sinon décodage UTF-8, `lireReleveRevolut`, et l'erreur de lecture est renvoyée telle quelle. Rien n'est enregistré avant que tout le fichier soit lu. Le fichier n'est stocké nulle part.
  - Classer : 400 si `id` n'est pas une chaîne commençant par `revolut:` ou si `estChoix(choix)` est faux.

- [ ] **Step 2 : vérifier** : `npx tsc --noEmit` et `npm test` passent. Le test de bout en bout des routes se fait par l'écran, en Task 6, step 3 (refus d'un PDF compris).

- [ ] **Step 3 : commit**

```bash
git add src/app/api/finance/revolut
git commit -m "Finance lot 2 : routes d'import du relevé et de correction de poste"
```

---

### Task 6 : écrans (import, dépenses par poste, correction)

**Files:**
- Create: `livrables/hub-agence/src/app/(app)/finance/import-releve.tsx` (client)
- Create: `livrables/hub-agence/src/app/(app)/finance/choix-poste.tsx` (client)
- Create: `livrables/hub-agence/src/app/(app)/finance/revolut/page.tsx`
- Modify: `livrables/hub-agence/src/app/(app)/finance/page.tsx`
- Modify si besoin: `livrables/hub-agence/src/app/(app)/finance/finance.module.css`

**Interfaces:**
- Consumes: routes de la Task 5 ; `depensesParPoste`, `aVerifier`, `releveAncien`, `compte`, `vueFinance` (Task 3) ; `POSTES`, `CHOIX_LIBELLES`, `Choix` (Task 2) ; `lireMouvements`, `lireReglages` (Task 4).
- Produces:
  - `ImportReleve()` : bouton « Importer un relevé » + `<input type="file" accept=".csv,text/csv,text/comma-separated-values,application/octet-stream">` caché ; aide sous le bouton : `Dans Revolut, exporte le relevé en CSV et enregistre-le dans Fichiers, puis choisis-le ici.` ; après envoi, compte rendu en une ou deux lignes (`3 lignes ajoutées · 2 déjà présentes · 1 mise à jour · 4 ignorées`, puis `2 à vérifier` en lien vers `/finance/revolut?filtre=a-verifier` s'il y en a ; relevé vide : `Aucune opération dans ce relevé.`), erreur en `role="alert"`, puis `router.refresh()`.
  - `ChoixPoste({ id, choix }: { id: string; choix: Choix | null })` : `<select>` natif (sélecteur iOS) avec les 9 choix de `CHOIX_LIBELLES`, envoie à `/api/finance/revolut/classer` au changement, `router.refresh()`, erreur en `role="alert"`.
  - Page `/finance/revolut?poste=<Poste>&periode=<ClePeriode>` ou `?filtre=a-verifier` : titre (le poste ou « À vérifier »), lien retour vers `/finance`, liste `hub-groupe` de lignes (libellé, date, montant signé, `ChoixPoste`). Pas d'entrée dans `src/lib/navigation.ts` : l'onglet Finance reste actif par préfixe.

- [ ] **Step 1 : modifier `finance/page.tsx`.**
  - En-tête : `eyebrow` = `Stripe · mis à jour X · Revolut Pro · relevé du Y` (ou `Revolut Pro · aucun relevé`) ; `ImportReleve` à côté d'`ActualiserBouton`.
  - Bandeau orange si `releveAncien` : `Dernier relevé Revolut importé le 3 nov. : pense à importer celui du mois.`
  - Bandeau si `aVerifier(...)` n'est pas vide : `N lignes Revolut à vérifier`, lien vers `/finance/revolut?filtre=a-verifier`.
  - « Dépenses par poste » : sans import, `NotConnected` avec le titre `Aucun relevé Revolut importé` et la description `Importe le relevé CSV du compte Revolut Pro pour voir les dépenses par poste.` ; sinon liste `hub-groupe`, une `hub-ligne` par poste (poste, nombre de lignes, total en `hub-mono`) en lien vers `/finance/revolut?poste=…&periode=…` ; période sans dépense : `Aucune dépense sur la période.`
  - Le commentaire et la règle « muet » de la carte Dépenses restent valables (texte sans chiffre).
  - Plus aucune mention de « Revolut Business ».

- [ ] **Step 2 : créer `import-releve.tsx`, `choix-poste.tsx` et `finance/revolut/page.tsx`** selon les Interfaces ci-dessus. Champs à 16 px sur iPhone : déjà assuré par `globals.css`, ne pas mettre de taille inférieure en style inline sans vérifier `test-champs-ios.ts`.

- [ ] **Step 3 : vérifier** : `npm test` et `npx tsc --noEmit` passent. Serveur dev lancé, SQL exécuté sur la base (voir Task 7, step 1, à faire faire par Edgar avant ce test) : importer un CSV d'essai de 4 lignes (une dépense Framer, une Facebook avec frais, un versement Stripe, une entrée inconnue) ; vérifier le compte rendu, la carte Dépenses, les postes, la ligne à vérifier, puis reclasser la ligne Facebook en `Formation` et constater que l'autre ligne Facebook suit. Réimporter le même fichier : `déjà présentes`. Choisir un PDF : message PDF, rien d'enregistré. Captures à 390 px de large (`SHOT_WIDTH=390`, sur le modèle de `scripts/shots-mobile.mjs`, pages `finance` et `finance/revolut`) sans débordement horizontal. Supprimer ensuite les lignes d'essai (`delete from finance_mouvements where source = 'revolut'`, `delete from finance_fournisseurs`, `update finance_reglages set dernier_import = null`) avec l'accord d'Edgar. Arrêter le serveur dev.

- [ ] **Step 4 : commit**

```bash
git add "src/app/(app)/finance"
git commit -m "Finance lot 2 : import du relevé, dépenses par poste et correction depuis l'iPhone"
```

---

### Task 7 : dépenses Meta, logique pure

Spec : section 11. Branchement Meta repris du module Ads (worktree `livrables/hub-agence-ads`, branche `module-ads`, non fusionnée).

**Files:**
- Create: `livrables/hub-agence/src/lib/ads/meta-graph.ts` (copie **à l'identique** de `git show module-ads:src/lib/ads/meta-graph.ts`, pour une fusion sans conflit ; ne pas le modifier)
- Create: `livrables/hub-agence/src/lib/finance/meta-depenses.ts`
- Modify: `livrables/hub-agence/src/lib/finance/revolut-classement.ts`
- Modify: `livrables/hub-agence/src/lib/finance/calculs.ts`
- Test: `livrables/hub-agence/scripts/test-finance-meta.ts`, `scripts/test-finance-revolut-classement.ts`, `scripts/test-finance-calculs.ts`

**Interfaces:**
- Consumes: `graphReadAll(path, accessToken, f?)` et `masquer` de `meta-graph.ts` ; `Mouvement`, `debutJourParis`, `instantParis` (calculs) ; `classer` (Task 2).
- Produces:
  - `meta-depenses.ts` :
    - `getMetaFinanceConfig(): { accessToken: string; adAccountId: string } | null` : lit `HUB_META_FINANCE_ACCESS_TOKEN` et `HUB_META_ADS_ACCOUNT_ID` (rognés) ; `adAccountId` toujours préfixé `act_` (ajouté s'il manque).
    - `metaBranche(): boolean` = `getMetaFinanceConfig() !== null`.
    - `interface JourMeta { date_start: string; spend: string; account_currency?: string }`
    - `mouvementsDepuisInsights(jours: JourMeta[], adAccountId: string, dateDepart: string): { ok: true; mouvements: Mouvement[] } | { ok: false; erreur: string }`
    - `lireDepensesMeta(config, depuis: string /* AAAA-MM-JJ */, jusqua: string, f?: typeof fetch): Promise<{ ok: true; jours: JourMeta[] } | { ok: false; erreur: string }>` : `graphReadAll` sur `/${adAccountId}/insights?level=account&fields=spend,account_currency&time_increment=1&time_range=${encodeURIComponent(JSON.stringify({ since, until }))}&limit=500`.
  - `revolut-classement.ts` : `Classement` gagne `"couvert_meta"` ; `Choix` gagne `"couvert_meta"` (libellé `Couvert par Meta (exclu)`) ; `classer(e, regles, options?: { metaBranche?: boolean })`.
  - `calculs.ts` : `Mouvement.source` devient `"stripe" | "revolut" | "meta"` ; `Reglages` gagne `derniereSynchroMeta: string | null` ; `vueFinance(mouvements, periode, reglages, options?: { metaBranche?: boolean })`.

- [ ] **Step 1 : copier `meta-graph.ts`** : `git show module-ads:src/lib/ads/meta-graph.ts > src/lib/ads/meta-graph.ts` (le dépôt partage ses branches avec le worktree). Vérifier `git diff --no-index` nul avec la version de la branche.

- [ ] **Step 2 : écrire les tests qui échouent.**

```ts
// test-finance-meta.ts
test("mouvementsDepuisInsights : un jour, une ligne", () => {
  const r = mouvementsDepuisInsights([{ date_start: "2026-10-21", spend: "7.35", account_currency: "EUR" }], "act_123", "2026-10-15");
  assert.ok(r.ok);
  assert.deepEqual(r.mouvements, [{
    id: "meta:act_123:2026-10-21", source: "meta", sens: "sortie", montantCentimes: 735,
    date: instantParis(2026, 10, 21, 12, 0, 0).toISOString(), libelle: "Publicité Meta",
    clientId: null, clientNom: null, poste: "Publicité", classement: null,
  }]);
});
test("mouvementsDepuisInsights : aucune dépense, aucun jour", () => {
  assert.deepEqual(mouvementsDepuisInsights([], "act_123", "2026-10-15"), { ok: true, mouvements: [] });
});
test("mouvementsDepuisInsights : jour à 0 ignoré, jour avant le départ ignoré", () => { /* spend "0" et date_start "2026-10-14" → aucune ligne */ });
test("mouvementsDepuisInsights : devise autre que l'euro refusée", () => {
  const r = mouvementsDepuisInsights([{ date_start: "2026-10-21", spend: "5", account_currency: "USD" }], "act_123", "2026-10-15");
  assert.equal(r.ok, false);
  assert.match((r as { erreur: string }).erreur, /euro/);
});
test("getMetaFinanceConfig : préfixe act_ ajouté, null si une variable manque", () => { /* process.env, restaurer après */ });
test("lireDepensesMeta : fetch simulé, réponse ok, refus et réseau en panne", () => {
  // f simulé : renvoie { data: [ ... ] } → ok ; { error: { code: 190, message: "Malformed access token EAAxyz" } } en 400
  // → ok:false, erreur sans "EAAxyz" ; fetch qui lève → ok:false
});

// test-finance-revolut-classement.ts
test("couvert par Meta : seulement si Meta est branché", () => {
  const fb = ent({ libelle: "FACEBK *X", fournisseur: "facebk" });
  assert.deepEqual(classer(fb, new Map()), { classement: "depense", poste: "Publicité" });
  assert.deepEqual(classer(fb, new Map(), { metaBranche: true }), { classement: "couvert_meta", poste: null });
  assert.deepEqual(classer(ent({ sens: "entree", type: "CARD_REFUND", libelle: "Facebook", fournisseur: "facebook" }), new Map(), { metaBranche: true }), { classement: "couvert_meta", poste: null });
  assert.deepEqual(classer(ent({ libelle: "Metro", fournisseur: "metro" }), new Map(), { metaBranche: true }), { classement: "depense", poste: "Autre" });
});
test("couvert par Meta : priorités", () => {
  const fb = ent({ libelle: "FACEBK *X", fournisseur: "facebk" });
  assert.equal(classer(fb, new Map([["facebk", "Publicité" as const]]), { metaBranche: true }).classement, "couvert_meta");
  assert.equal(classer({ ...fb, choixManuel: "interne" }, new Map(), { metaBranche: true }).classement, "interne");
  assert.equal(classer({ ...fb, choixManuel: "couvert_meta" }, new Map()).classement, "couvert_meta");
  assert.equal(classer({ ...fb, etat: "PENDING" }, new Map(), { metaBranche: true }).classement, "ignore");
});

// test-finance-calculs.ts
const meta = (s: Partial<Mouvement>) => mvt({ source: "meta", sens: "sortie", poste: "Publicité", classement: null, ...s });
test("Meta : compté en dépenses, en Publicité, absent des derniers mouvements", () => {
  // synthese : depenses inclut meta ; couvert_meta Revolut exclu ; depensesParPoste inclut Publicité meta ;
  // serieMensuelle sorties inclut meta ; derniersMouvements ne contient aucune ligne meta
});
test("vueFinance : Meta branché jamais synchronisé, Dépenses et Net indisponibles", () => {
  // reglages.derniereSynchroMeta null, options { metaBranche: true } → cartes[1].valeur et cartes[2].valeur === "Indisponible",
  // cartes[0] (Brut) chiffré ; detail des deux cartes : "Meta jamais synchronisé"
});
test("vueFinance : Meta non branché, comportement inchangé", () => { /* options absentes ou metaBranche false */ });
```

- [ ] **Step 3 : vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-finance-meta.ts scripts/test-finance-revolut-classement.ts scripts/test-finance-calculs.ts`
Expected: FAIL (module `meta-depenses` introuvable, nouveaux tests en échec).

- [ ] **Step 4 : implémenter.**
  - Ligne Meta : `date` = midi, heure de Paris, du jour `date_start` ; montant `Math.round(parseFloat(spend) * 100)` ; un `spend` illisible fait échouer tout le lot (`Réponse Meta illisible.`). Devise absente : acceptée (le champ est demandé, Meta le renvoie) ; présente et différente de `EUR` : `Le compte publicitaire n'est pas en euros (XXX).`
  - Reconnaissance « couvert par Meta » : libellé en minuscules qui contient `facebk`, `facebook` ou le mot `meta` (`\bmeta\b`), entrée ou sortie. Ordre dans `classer` : `ignore` d'abord, puis choix de la ligne, puis `couvert_meta` si `metaBranche`, puis choix du fournisseur, puis règles automatiques. Le choix manuel `couvert_meta` donne `couvert_meta` même Meta non branché. Profiter de ce changement pour borner aussi la règle Publicité existante à `\bmeta\b` (minor différé de la Task 2).
  - `compteRendu` : `couvert_meta` compté dans `ignorees` ; il reçoit `options` et les transmet à `classer`.
  - Calculs : `compte(m)` vrai pour `meta` ; `meta` ajouté aux dépenses, aux sorties du graphique et à `depensesParPoste` (poste Publicité) ; `derniersMouvements` écarte `meta`. `vueFinance` : `metaBranche && derniereSynchroMeta === null` donne « Indisponible » sur Dépenses et Net, détail `Meta jamais synchronisé`.
  - Mettre à jour les fabriques de test et `db.ts` pour les nouveaux champs (`derniereSynchroMeta: null` provisoire si besoin, Task 8 le lit vraiment).

- [ ] **Step 5 : vérifier** : la commande du step 3 passe, puis `npm test` et `npx tsc --noEmit`.

- [ ] **Step 6 : commit**

```bash
git add src/lib/ads/meta-graph.ts src/lib/finance scripts/test-finance-*.ts
git commit -m "Finance lot 2 : dépenses Meta (logique) et classement « couvert par Meta »"
```

---

### Task 8 : dépenses Meta, synchro et affichage

**Files:**
- Modify: `livrables/hub-agence/supabase/finance-lot-2.sql`
- Modify: `livrables/hub-agence/src/lib/finance/db.ts`
- Modify: `livrables/hub-agence/src/app/api/cron/finance/route.ts`, `src/app/api/finance/actualiser/route.ts`
- Modify: `livrables/hub-agence/src/app/(app)/finance/page.tsx`, `src/app/(app)/finance/revolut/page.tsx`, `src/app/(app)/finance/actualiser-bouton.tsx` si besoin
- Modify: `livrables/hub-agence/.env.example` s'il existe (nom de variable seul, sans valeur)

**Interfaces:**
- Consumes: tout ce que produit la Task 7.
- Produces:
  - `synchroniserMeta(maintenant: Date): Promise<{ jours: number }>` dans `db.ts` : lève une `Error` au message déjà masqué si Meta ne répond pas.
  - `lireReglages()` renvoie `derniereSynchroMeta` ; `lireMouvements` lit les lignes `meta` et passe `{ metaBranche: metaBranche() }` à `classer`.

- [ ] **Step 1 : compléter `supabase/finance-lot-2.sql`** (pas encore exécuté par Edgar), idempotent :

```sql
alter table finance_mouvements drop constraint if exists finance_mouvements_source_check;
alter table finance_mouvements add constraint finance_mouvements_source_check
  check (source in ('stripe', 'revolut', 'meta'));
alter table finance_reglages add column if not exists derniere_synchro_meta timestamptz;
```

- [ ] **Step 2 : `synchroniserMeta` dans `db.ts`.** Config absente : `Error("Meta non configuré")`. Lit de la date de départ à aujourd'hui (jour de Paris) ; en cas d'échec, lève sans rien écrire ni effacer. En cas de succès : upsert des lignes (`onConflict: "id"`), puis suppression des lignes `source = 'meta'` de la plage dont l'id n'est pas dans la réponse (aucune ligne reçue = toutes celles de la plage retirées), puis `derniere_synchro_meta = maintenant`. Les lignes `meta` antérieures à la date de départ ne sont jamais lues (filtre existant à la lecture), ni supprimées.

- [ ] **Step 3 : cron et Actualiser.** Stripe puis Meta, chacun dans son propre `try`. Meta non configuré : on le saute sans erreur. Réponse : `{ stripe: {…} | { error }, meta: {…} | { error } | null }`, statut 500 seulement si toutes les sources configurées ont échoué. Le bouton Actualiser affiche le message d'erreur Meta s'il y en a un (`Meta : <message>`), même quand Stripe a réussi, puis rafraîchit. Le cron garde sa vérification `CRON_SECRET` à l'identique.

- [ ] **Step 4 : page Finance.** Eyebrow : ajouter `Meta · mis à jour X` (ou `Meta · jamais synchronisé`) quand Meta est branché, rien sinon. Bandeau orange si `synchroPerimee(derniereSynchroMeta)` : `Données Meta du 21/10 à 05:00 : la synchronisation automatique ne passe plus. Clique sur Actualiser.` Passer `{ metaBranche }` à `vueFinance`. Page de détail Revolut : afficher les lignes `couvert_meta` (filtre `?filtre=couvert-meta`, lien depuis « Dépenses par poste » quand il y en a : `N lignes Revolut couvertes par Meta`).

- [ ] **Step 5 : vérifier** : `npx tsc --noEmit` et `npm test` passent. Ne pas lancer le serveur ni appeler Meta.

- [ ] **Step 6 : commit**

```bash
git add supabase/finance-lot-2.sql src/lib/finance/db.ts src/app/api "src/app/(app)/finance"
git commit -m "Finance lot 2 : synchronisation des dépenses Meta dans le cron et Actualiser"
```

---

### Task 9 : essai de bout en bout et mise en production

- [ ] **Step 1 :** Edgar exécute `supabase/finance-lot-2.sql` dans le SQL Editor du projet Supabase du hub (avant le test de la Task 6 et avant le déploiement).
- [ ] **Step 2 :** `npm test` et `npx tsc --noEmit` sur la branche, relecture finale de toute la branche.
- [ ] **Step 2 bis :** essai de bout en bout reporté de la Task 6 (son step 3, avec l'accord d'Edgar pour les lignes d'essai), plus Meta : Edgar pose `HUB_META_FINANCE_ACCESS_TOKEN` (et vérifie `HUB_META_ADS_ACCOUNT_ID`) dans `.env.local` puis dans Vercel ; Actualiser synchronise Meta sans erreur sur un compte sans dépense (eyebrow `Meta · mis à jour …`, Publicité 0 €) ; avec Meta branché, la ligne d'essai Facebook passe en « couvert par Meta » et sort des dépenses.
- [ ] **Step 3 :** Edgar valide sur un déploiement de prévisualisation Vercel de la branche, depuis l'iPhone : import du relevé vide du compte Pro (compte rendu `Aucune opération dans ce relevé.`, eyebrow `relevé du …`).
- [ ] **Step 4 :** après son accord seulement, fusion dans `main` (`git checkout main && git merge --no-ff finance-lot-2 -m "Fusion : onglet Finance, lot 2 (relevé Revolut Pro et dépenses Meta)" && git push`), ce qui déploie en production.
- [ ] **Step 5 :** au premier vrai relevé d'Edgar, vérifier les hypothèses de la spec (types, signe des montants, frais, libellés des virements Stripe et perso) et ajuster `revolut-releve.ts` ou les règles de `revolut-classement.ts` si besoin.
