# Analytics GA4 du Hub Agence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer la page `/analytics` héritée d'Orbikal par deux funnels (site, pubs Meta), les pages d'arrivée, les sources et campagnes, et une évolution avec repères ; et faire créer un compte au CRM quand une personne inconnue réserve par Cal.com.

**Architecture:** La logique vit dans des modules purs testés sous Node (`src/lib/analytics/*.ts`, `src/lib/crm/reservation.ts`) ; les lectures GA4 et Supabase les alimentent. La page serveur assemble les blocs, chaque source pouvant échouer seule. Le webhook Cal.com gagne une création de compte pour les réservations orphelines.

**Tech Stack:** Next.js App Router (serveur), GA4 Data API v1beta (compte de service existant), Supabase, recharts, tests `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-19-analytics-ga4-design.md` (racine du workspace). Code dans `livrables/hub-agence/`, tous les chemins ci-dessous sont relatifs à ce dépôt.

## Global Constraints

- Travailler dans le worktree `livrables/hub-agence-analytics/` sur la branche `analytics`. Ne rien pousser sur `main` : chaque push sur `main` déploie en production. Fusion après validation d'Edgar.
- La migration `supabase/analytics.sql` doit être exécutée par Edgar sur Supabase **avant** la fusion : le code écrit `source = 'site'`, refusé par l'ancienne contrainte.
- Une donnée absente s'affiche « pas encore mesuré », « bientôt » ou « Indisponible », jamais 0 ni 0 %.
- Seuils : avertissement d'échantillon sous **100 visiteurs** (funnel du site) ou **30 leads** (funnel Meta) ; taux de ligne grisé sous **20 sessions**.
- Étapes « signées » : `acompte_paye`, `en_production`, `livre`, `solde`.
- Une marche atteinte reste atteinte (historique `evenements`), un compte appartient au seul funnel de son origine (`comptes.source`).
- Couleurs uniquement via `src/app/theme.css` ; `npm test` inclut `test-couleurs` et `test-contraste`. Verre (`.hub-verre`) pour les deux funnels seulement, jamais pour les tableaux.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Textes de l'interface en français, sans tiret long.

## Review Focus

1. **Le même webhook de réservation orpheline reçu deux fois** (Cal.com relivre) : un seul compte, une seule notification « Nouveau RDV ». Test : Task 2, `ligneCompteDepuisReservation` déterministe + relecture sur 23505, vérifiée à la main en Task 2 Step 5.
2. **Réservation orpheline sans email exploitable** : pas de compte créé, ancienne notification « RDV non rattaché » conservée. Test : Task 1, `ligneCompteDepuisReservation` rend `null`.
3. **Période à 0 visiteur ou 0 lead** : aucun taux `NaN` ni `0 %` affiché, passages à `null`. Test : Task 3, `construireFunnel` avec première marche à 0.
4. **GA4 en erreur mais Supabase disponible (ou l'inverse)** : le funnel Meta reste affiché ; les blocs GA4 affichent « Indisponible ». Test : Task 6 Step 4, vérification manuelle en vidant `GA4_PROPERTY_ID` en dev.
5. **Repère avec libellé vide, trop long ou date hors période** : refusé à la saisie, ou simplement non dessiné. Test : Task 5, `validerRepere`, et Task 3, `reperesDansPlage`.

---

### Task 1: Origine « site » et compte issu d'une réservation (module pur + migration)

**Files:**
- Create: `supabase/analytics.sql`
- Create: `src/lib/crm/reservation.ts`
- Modify: `src/lib/comptes.ts:5` (ajouter `"site"` à `SOURCES_COMPTE`)
- Test: `scripts/test-crm-reservation.ts`

**Interfaces:**
- Consumes: `EvenementTraduit` (`src/lib/crm/webhooks.ts`), `normaliserEmail` (`src/lib/comptes.ts`).
- Produces:
  - `type CanalReservation = "email" | "whatsapp" | "direct" | "site"`
  - `canalReservation(canal: unknown): CanalReservation` : `email`, `whatsapp`, `site` gardés, tout le reste `direct`.
  - `ligneCompteDepuisReservation(e: EvenementTraduit): LigneCompteReservation | null` avec `LigneCompteReservation = { nom: string; email: string; source: "site" | "autre"; etape: "rdv_pris"; lead_cree_le: string; rdv_le: string | null; rdv_uid: string; canal_reservation: CanalReservation }`.

- [ ] **Step 1: Écrire `supabase/analytics.sql`**

```sql
-- Analytics GA4 (19/10/2026) : origine « site » des comptes et des réservations, repères de la courbe.
-- Avant d'exécuter : vérifier le nom réel des contraintes (select conname from pg_constraint where conrelid = 'comptes'::regclass;).
alter table comptes drop constraint if exists comptes_source_check;
alter table comptes add constraint comptes_source_check
  check (source in ('reseau', 'ancien_client', 'formulaire', 'prospection', 'autre', 'site'));
alter table comptes drop constraint if exists comptes_canal_reservation_check;
alter table comptes add constraint comptes_canal_reservation_check
  check (canal_reservation in ('email', 'whatsapp', 'direct', 'site'));

create table if not exists analytics_reperes (
  id uuid primary key default gen_random_uuid(),
  le date not null,
  libelle text not null check (char_length(libelle) between 1 and 80),
  created_at timestamptz not null default now()
);
alter table analytics_reperes enable row level security;
```

- [ ] **Step 2: Écrire les tests qui échouent**

```ts
// scripts/test-crm-reservation.ts
const base = { type: "rdv_reserve", survenu_le: "2026-10-25T19:00:00Z", cle: "cal:BOOKING_CREATED:u1", compteId: null,
  email: "jean@pme.fr", donnees: { debut: "2026-10-28T09:00:00Z", canal: "site", uid: "u1", nom: "Jean Dupont" } };

test("canalReservation", () => {
  assert.equal(canalReservation("site"), "site");
  assert.equal(canalReservation("whatsapp"), "whatsapp");
  assert.equal(canalReservation("autre-chose"), "direct");
  assert.equal(canalReservation(undefined), "direct");
});
test("réservation du site : compte site à rdv_pris", () => {
  assert.deepEqual(ligneCompteDepuisReservation(base), { nom: "Jean Dupont", email: "jean@pme.fr", source: "site",
    etape: "rdv_pris", lead_cree_le: "2026-10-25T19:00:00Z", rdv_le: "2026-10-28T09:00:00Z", rdv_uid: "u1", canal_reservation: "site" });
});
test("réservation orpheline sans canal=site : source autre, canal direct", () => {
  const l = ligneCompteDepuisReservation({ ...base, donnees: { ...base.donnees, canal: "direct" } });
  assert.equal(l?.source, "autre"); assert.equal(l?.canal_reservation, "direct");
});
test("sans nom : l'email sert de nom", () =>
  assert.equal(ligneCompteDepuisReservation({ ...base, donnees: { ...base.donnees, nom: undefined } })?.nom, "jean@pme.fr"));
test("sans email ou sans uid, ou autre type : null", () => {
  assert.equal(ligneCompteDepuisReservation({ ...base, email: null }), null);
  assert.equal(ligneCompteDepuisReservation({ ...base, donnees: { ...base.donnees, uid: undefined } }), null);
  assert.equal(ligneCompteDepuisReservation({ ...base, type: "rdv_annule" }), null);
});
```

- [ ] **Step 3: Lancer, vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-crm-reservation.ts`
Expected: FAIL, module `@/lib/crm/reservation` introuvable.

- [ ] **Step 4: Implémenter `src/lib/crm/reservation.ts`** (module pur, aucun import réseau) et ajouter `"site"` à `SOURCES_COMPTE`.

- [ ] **Step 5: Lancer `npm test`**, tout passe.

- [ ] **Step 6: Commit**

```bash
git add supabase/analytics.sql src/lib/crm/reservation.ts src/lib/comptes.ts scripts/test-crm-reservation.ts
git commit -m "CRM : origine site et compte issu d'une reservation Cal.com (module pur, migration)"
```

### Task 2: Le webhook Cal.com crée le compte d'une réservation orpheline

**Files:**
- Modify: `src/lib/crm/db.ts` (`appliquerEvenement`, vers la ligne 431 ; remplacer la ligne 462 par `canalReservation`)

**Interfaces:**
- Consumes: `ligneCompteDepuisReservation`, `canalReservation` (Task 1).
- Produces: aucun nouvel export ; `appliquerEvenement` rend désormais un `compteId` non nul pour une réservation orpheline avec email.

- [ ] **Step 1: Ajouter `async function creerCompteReservation(e: EvenementTraduit)`** dans `db.ts` : insère `ligneCompteDepuisReservation(e)` dans `comptes` et rend `{ id, nom, etape, rdv_uid }` ; sur erreur `23505` (même email inséré entre-temps), relire par `compteDeLEvenement(e)`. Ne programme aucune séquence Brevo.

- [ ] **Step 2: Dans `appliquerEvenement`**, quand `compteDeLEvenement` rend `null` et que `e.type === "rdv_reserve"` : appeler `creerCompteReservation` ; si elle rend `null` (pas d'email ni d'uid), garder l'ancien comportement (notification « RDV non rattaché », `compteId: null`). Sinon continuer le flux normal avec ce compte. Comme le compte est déjà à `rdv_pris`, `majEtape` ne fait rien, `majRdv` réécrit les mêmes champs, la notification « Nouveau RDV » part une fois (`nouveau` vient de la clé d'idempotence de l'événement).

- [ ] **Step 3: Remplacer le calcul du canal** (ligne 462) par `canalReservation(e.donnees.canal)` pour que `site` ne redevienne plus `direct`.

- [ ] **Step 4: `npm test`** (les tests CRM existants passent toujours) puis `npx tsc --noEmit`.

- [ ] **Step 5: Vérification à la main, après la migration exécutée par Edgar**, en dev : poster deux fois le même faux webhook signé `BOOKING_CREATED` d'un email inconnu avec `metadata.canal = "site"` (signature HMAC avec `CALCOM_WEBHOOK_SECRET`, voir `scripts/test-crm-webhooks.ts` pour la forme) sur `/api/webhooks/calcom` (vérifier le chemin réel dans `src/app/api`). Attendu : un seul compte `source = site`, étape « RDV pris », un seul événement `rdv_reserve`. Supprimer ce compte de test ensuite.

- [ ] **Step 6: Commit**

```bash
git add src/lib/crm/db.ts
git commit -m "CRM : une reservation Cal.com d'une personne inconnue cree son compte"
```

### Task 3: Funnels et cohortes (module pur)

**Files:**
- Create: `src/lib/analytics/funnel.ts`
- Test: `scripts/test-analytics-funnel.ts`

**Interfaces:**
- Consumes: `DateRange`, `isoInParis` (`src/lib/period.ts`), `Etape` (`src/lib/crm/pipeline.ts`).
- Produces:
  - `interface Marche { cle: string; libelle: string; valeur: number | null; source: "ga4" | "crm" | "ads"; raison?: string }` (`valeur: null` = pas mesurable, `raison` dit pourquoi)
  - `interface Funnel { marches: Marche[]; passages: (number | null)[]; plusGrossePerte: number | null; echantillonFaible: boolean }`
  - `construireFunnel(marches: Marche[], seuil: number): Funnel` : `passages[i]` = `marches[i+1].valeur / marches[i].valeur`, `null` si l'un est `null` ou le dénominateur vaut 0 ; `plusGrossePerte` = index du plus petit passage non nul parmi au moins deux passages calculés, sinon `null` ; `echantillonFaible` = première valeur non nulle `< seuil`.
  - `const ETAPES_SIGNEES: Etape[] = ["acompte_paye", "en_production", "livre", "solde"]`
  - `interface CompteFunnel { source: string | null; lead_cree_le: string | null; aReserve: boolean; aSigne: boolean }`
  - `cohorte(comptes: CompteFunnel[], source: string, range: DateRange): { entrees: number; rdv: number; signes: number }` : comptes de cette `source` dont `lead_cree_le` (date à Paris) est dans la plage.
  - `interface Repere { id: string; le: string; libelle: string }` et `reperesDansPlage(r: Repere[], range: DateRange): Repere[]`.

- [ ] **Step 1: Écrire les tests qui échouent**

```ts
const m = (valeur: number | null) => ({ cle: "x", libelle: "x", valeur, source: "ga4" as const });
test("passages et plus grosse perte", () => {
  const f = construireFunnel([m(47), m(3), m(1), m(0)], 100);
  assert.deepEqual(f.passages.map((p) => p && Math.round(p * 100)), [6, 33, 0]);
  assert.equal(f.plusGrossePerte, 2); assert.equal(f.echantillonFaible, true);
});
test("marche non mesurée : passages null, pas de 0 %", () => {
  const f = construireFunnel([m(47), m(3), m(null), m(null)], 100);
  assert.deepEqual(f.passages.map((p) => p && Math.round(p * 100)), [6, null, null]);
  assert.equal(f.plusGrossePerte, null);
});
test("première marche à 0 : aucun passage calculé", () =>
  assert.deepEqual(construireFunnel([m(0), m(0), m(0)], 30).passages, [null, null]));
const range = { start: "2026-10-01", end: "2026-10-31" };
test("cohorte : source, période à Paris, marches atteintes", () => {
  const c = [
    { source: "formulaire", lead_cree_le: "2026-10-05T10:00:00Z", aReserve: true, aSigne: true },
    { source: "formulaire", lead_cree_le: "2026-10-31T23:30:00Z", aReserve: false, aSigne: false }, // 01/11 00h30 à Paris (UTC+1)
    { source: "formulaire", lead_cree_le: "2026-09-30T22:30:00Z", aReserve: true, aSigne: false },  // 01/10 00h30 à Paris (UTC+2)
    { source: "site", lead_cree_le: "2026-10-10T10:00:00Z", aReserve: true, aSigne: false },
  ];
  assert.deepEqual(cohorte(c, "formulaire", range), { entrees: 2, rdv: 2, signes: 1 });
  assert.deepEqual(cohorte(c, "site", range), { entrees: 1, rdv: 1, signes: 0 });
});
test("repères hors période écartés", () =>
  assert.deepEqual(reperesDansPlage([{ id: "a", le: "2026-10-05", libelle: "x" }, { id: "b", le: "2026-11-02", libelle: "y" }], range).map((r) => r.id), ["a"]));
```

Note : le passage à l'heure d'hiver a lieu le 25/10/2026. La 2e ligne tombe le 01/11 à Paris (hors plage), la 3e le 01/10 (dans la plage) : c'est ce qui prouve que la date est lue à Paris et pas en UTC.

- [ ] **Step 2: Lancer**, `node --import ./scripts/alias-hook.mjs --test scripts/test-analytics-funnel.ts`, FAIL module introuvable.
- [ ] **Step 3: Implémenter `src/lib/analytics/funnel.ts`.**
- [ ] **Step 4: Relancer**, PASS.
- [ ] **Step 5: Commit** `git commit -m "Analytics : funnels, cohortes et reperes (module pur)"`

### Task 4: Lectures GA4 de la page

**Files:**
- Create: `src/lib/analytics/ga4-page.ts` (parseurs purs + `RESERVATION`)
- Modify: `src/lib/analytics.ts` (nouvelle lecture `getAnalyticsPage`, retrait de `getAnalyticsSummary`, du périmètre et de `buildTrafficBreakdown` s'ils ne servent plus)
- Delete: `src/lib/analytics-scope.ts`, `src/components/ui/scope-selector.tsx` (seule la page Analytics les utilise ; vérifier par `grep` avant)
- Test: `scripts/test-analytics-ga4.ts`

**Interfaces:**
- Consumes: `ga4Fetch`, `fillDailyGaps`, `partialDayLabel` (existants, `analytics.ts`), `normalizeSource`, `labelChannelGroup` (`traffic-source.ts`).
- Produces:
  - `const RESERVATION = { chemins: ["/calendly"], evenements: [] as string[] }` : seul endroit à toucher quand le site enverra un événement Cal.com.
  - `filtreReservation(): Record<string, unknown>` : `FilterExpression` GA4 en `orGroup`, un filtre `pagePath` exact par chemin et un filtre `eventName` exact par événement.
  - `interface LigneTrafic { cle: string; libelle: string; sessions: number; tempsEngageS: number; rebond: number; versReservation: number | null; fiable: boolean; campagnes?: LigneTrafic[] }` (`rebond` en %, une décimale ; `versReservation` ratio 0 à 1, `null` si 0 session ; `fiable` = `sessions >= 20`)
  - `fusionnerPages(total: Ga4Res | null, resa: Ga4Res | null): LigneTrafic[]` : par `landingPage`, `(not set)` et vide deviennent « (page inconnue) », tri par sessions décroissantes.
  - `fusionnerSources(total: Ga4Res | null, resa: Ga4Res | null): LigneTrafic[]` : lignes `sessionSource`, `sessionMedium`, `sessionCampaignName` regroupées par `normalizeSource(...).label`, campagnes `(not set)` et `(direct)` ignorées dans `campagnes`.
  - `interface AnalyticsPage { visiteurs: number; visiteursReservation: number; pages: LigneTrafic[] | null; sources: LigneTrafic[] | null; visiteursParJour: { label: string; value: number }[]; partialDay: string | null }`
  - `getAnalyticsPage(range: DateRange): Promise<AnalyticsPage>` (cache `unstable_cache` 45 s comme l'existant) : les requêtes partent ensemble (`Promise.all`) ; totaux (`totalUsers`), totaux filtrés réservation (`totalUsers`), par jour (`date` × `totalUsers`), pages (`landingPage` × `sessions`, `userEngagementDuration`, `bounceRate`, limite 50) et la même filtrée réservation (`sessions`), sources (`sessionSource`, `sessionMedium`, `sessionCampaignName` × mêmes métriques, limite 200) et la même filtrée. Pages et sources ont chacune leur `.catch(() => null)` ; les totaux, s'ils échouent, font échouer l'appel.
  - `tempsEngageS` = `userEngagementDuration` / `sessions`, arrondi à la seconde.

- [ ] **Step 1: Tests qui échouent** (`scripts/test-analytics-ga4.ts`) :

```ts
const res = (rows: [string[], string[]][]) => ({ rows: rows.map(([d, m]) => ({ dimensionValues: d.map((value) => ({ value })), metricValues: m.map((value) => ({ value })) })) });
test("filtreReservation : chemins puis événements", () => {
  const f = filtreReservation() as { orGroup: { expressions: unknown[] } };
  assert.equal(f.orGroup.expressions.length, RESERVATION.chemins.length + RESERVATION.evenements.length);
  assert.deepEqual(f.orGroup.expressions[0], { filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: "/calendly" } } });
});
test("fusionnerPages : taux, fiabilité, page inconnue", () => {
  const lignes = fusionnerPages(
    res([[["/"], ["40", "1920", "0.58"]], [["(not set)"], ["2", "0", "1"]]]),
    res([[["/"], ["2"]]]),
  );
  assert.deepEqual(lignes[0], { cle: "/", libelle: "/", sessions: 40, tempsEngageS: 48, rebond: 58, versReservation: 0.05, fiable: true });
  assert.equal(lignes[1].libelle, "(page inconnue)"); assert.equal(lignes[1].versReservation, 0); assert.equal(lignes[1].fiable, false);
});
test("fusionnerPages : réservation indisponible, taux null", () =>
  assert.equal(fusionnerPages(res([[["/"], ["40", "1920", "0.58"]]]), null)[0].versReservation, null));
test("fusionnerSources : variantes Instagram fusionnées, campagnes en détail", () => {
  const l = fusionnerSources(res([
    [["ig", "social", "test-50"], ["5", "100", "0.6"]],
    [["l.instagram.com", "referral", "(not set)"], ["2", "40", "0.5"]],
  ]), null);
  assert.equal(l.length, 1); assert.equal(l[0].sessions, 7);
  assert.deepEqual(l[0].campagnes?.map((c) => c.libelle), ["test-50"]);
});
```

- [ ] **Step 2: Lancer**, FAIL.
- [ ] **Step 3: Implémenter `ga4-page.ts` puis `getAnalyticsPage`** ; supprimer le code mort (périmètre, `getAnalyticsSummary`, `buildTrafficBreakdown`, `TrafficSplit` s'il n'est plus importé nulle part).
- [ ] **Step 4: `npm test` et `npx tsc --noEmit`** passent (la page sera adaptée en Task 6 ; si `tsc` échoue seulement sur `analytics/page.tsx`, remplacer provisoirement son contenu par un appel à `getAnalyticsPage` affichant `visiteurs`).
- [ ] **Step 5: Vérifier en vrai** avec le script de `scratchpad` adapté ou une route de dev : `getAnalyticsPage({ start: <J-30>, end: <hier> })` rend environ 47 visiteurs et l'accueil en tête des pages.
- [ ] **Step 6: Commit** `git commit -m "Analytics : lectures GA4 de la page (pages d'arrivee, sources, reservation), retrait du perimetre Orbikal"`

### Task 5: Lectures CRM et repères

**Files:**
- Create: `src/lib/analytics/crm.ts`
- Create: `src/app/(app)/analytics/actions.ts` (actions serveur des repères)
- Test: `scripts/test-analytics-funnel.ts` (ajouter `validerRepere`)

**Interfaces:**
- Consumes: `getSupabaseClient` (`src/lib/supabase.ts`), `CompteFunnel`, `ETAPES_SIGNEES`, `Repere` (Task 3).
- Produces:
  - `comptesFunnel(): Promise<CompteFunnel[]>` : comptes `source in ('formulaire', 'site')` avec `aReserve` = événement `rdv_reserve` existant **ou** `rdv_le` non nul ; `aSigne` = étape actuelle dans `ETAPES_SIGNEES` **ou** un événement `etape_changee` dont `donnees->>vers` est dans `ETAPES_SIGNEES`. Deux requêtes (comptes, événements des types `rdv_reserve` et `etape_changee`) et l'assemblage en mémoire.
  - `rdvParJour(range: DateRange): Promise<Map<string, number>>` : événements `rdv_reserve`, tous comptes, comptés par date à Paris de `survenu_le`, clé au format `MM/JJ` (celui des points de `fillDailyGaps`).
  - `listerReperes(): Promise<Repere[]>`, `ajouterRepere(le: string, libelle: string): Promise<void>`, `supprimerRepere(id: string): Promise<void>`.
  - `validerRepere(le: unknown, libelle: unknown): { ok: true; le: string; libelle: string } | { ok: false; erreur: string }` (pure, dans `funnel.ts`) : date `AAAA-MM-JJ` valide, libellé coupé des espaces, 1 à 80 caractères.
  - Actions serveur `ajouterRepereAction(formData)` et `supprimerRepereAction(formData)` : valident, écrivent, `revalidatePath("/analytics")`.

- [ ] **Step 1: Tests `validerRepere`** : `("2026-10-25", "  Lancement test-50 ")` → ok, libellé `"Lancement test-50"` ; `("2026-13-01", "x")` → ko ; `("2026-10-25", "   ")` → ko ; libellé de 81 caractères → ko.
- [ ] **Step 2: Lancer**, FAIL. **Step 3: Implémenter.** **Step 4: `npm test`**, PASS.
- [ ] **Step 5: Vérifier `comptesFunnel()` contre la vraie base** (après migration) : le nombre de comptes `formulaire` correspond à ce que montre le pipeline.
- [ ] **Step 6: Commit** `git commit -m "Analytics : lectures CRM des funnels et reperes de la courbe"`

### Task 6: La page

**Files:**
- Modify: `src/app/(app)/analytics/page.tsx` (réécriture)
- Create: `src/app/(app)/analytics/funnel-carte.tsx`, `src/app/(app)/analytics/tableau-trafic.tsx`, `src/app/(app)/analytics/reperes-form.tsx` (client), `src/app/(app)/analytics/analytics.module.css`
- Create: `src/components/charts/evolution.tsx` (client, recharts)
- Modify: `src/app/theme.css` seulement si une couleur manque (perte en évidence, RDV) ; alors `npm test` doit rester vert.

**Interfaces:**
- Consumes: `getAnalyticsPage` (Task 4), `comptesFunnel`, `rdvParJour`, `listerReperes`, actions (Task 5), `construireFunnel`, `cohorte`, `reperesDansPlage` (Task 3), `parsePeriod`, `PeriodSelector`, `PageHeader`, `NotConnected`.
- Produces: la page.

Contenu, dans l'ordre de la maquette validée :

1. `PageHeader` « Analytics », sous-titre « Funnel et trafic de kleakagency.fr, et funnel des pubs Meta », `PeriodSelector`.
2. Deux `FunnelCarte` (`.hub-verre`), côte à côte au-dessus de 900 px, l'une sous l'autre en dessous.
   - **Site** (seuil 100) : Visiteurs (`visiteurs`), Page de réservation vue (`visiteursReservation`), RDV pris depuis le site et Clients signés (`cohorte(..., "site", period)`, étiquette « CRM »). Tant qu'aucun compte `source = 'site'` n'existe dans `comptesFunnel()` : `valeur: null`, raison « Pas encore mesuré : la réservation du site ne passe pas encore par Cal.com ».
   - **Pubs Meta** (seuil 30) : Dépensé (`valeur: null`, source `ads`, raison « Bientôt, avec le module Ads »), Leads, RDV pris, Clients signés (`cohorte(..., "formulaire", period)`). Le passage « Dépensé → Leads » n'est pas affiché (unités différentes) : construire le funnel sur les trois marches CRM et afficher « Dépensé » au-dessus.
   - Chaque marche : libellé, effectif, barre proportionnelle à la première ; passage en % entre deux marches ; la `plusGrossePerte` mise en évidence avec « la plus grosse perte » ; `echantillonFaible` affiche « Échantillon trop petit pour juger, les taux sont indicatifs. »
   - Si GA4 échoue : les marches GA4 en `null`, raison « Indisponible : Google Analytics ne répond pas ». Si Supabase échoue : idem pour les marches CRM, raison « Indisponible : CRM injoignable ».
3. `TableauTrafic` pages d'arrivée : colonnes Page d'entrée, Sessions, Temps engagé (`0 min 48`), Rebond, → Réservation, RDV. Colonne RDV : « — » partout, en-tête avec la note « RDV par page : pas encore mesuré ». Taux grisé si `!fiable`, note sous le tableau : « Un taux calculé sur moins de 20 sessions est grisé. » `pages === null` : « Indisponible ».
4. `TableauTrafic` sources et campagnes : mêmes colonnes sans rebond, campagnes en lignes indentées sous leur source.
5. `Evolution` : aire des visiteurs par jour, points des RDV (`rdvParJour`) sur les mêmes libellés `MM/JJ`, `ReferenceLine` verticale par repère de `reperesDansPlage`, libellé du repère sur la ligne. `ReperesForm` sous la courbe : date, libellé, « Ajouter », et la liste des repères avec « Supprimer ». Le jour en cours (`partialDay`) signalé comme aujourd'hui.

Les tableaux défilent horizontalement sur iPhone (conteneur `overflow-x: auto`), pas de verre sur les tableaux.

- [ ] **Step 1: Implémenter les composants et la page.**
- [ ] **Step 2: `npm test` et `npx tsc --noEmit`** passent.
- [ ] **Step 3: Vérifier dans le navigateur** (`npm run dev` dans le worktree, `/analytics`, 30 j puis 90 j, largeur bureau et 390 px) : funnels, tableaux et courbe s'affichent ; aucun `NaN`, aucun `0 %` sur une marche non mesurée ; ajouter puis supprimer un repère.
- [ ] **Step 4: Vérifier les pannes** : relancer le dev avec `GA4_PROPERTY_ID=999` (erreur GA4) : funnel Meta visible, blocs GA4 « Indisponible ». Remettre la vraie valeur.
- [ ] **Step 5: Commit** `git commit -m "Analytics : page funnels, pages d'arrivee, sources et evolution avec reperes"`

### Task 7: Mise en route

**Files:**
- Modify: `CLAUDE.md` du workspace (section Hub Agence : une ligne Analytics et la migration)

- [ ] **Step 1: Demander à Edgar d'exécuter `supabase/analytics.sql`** dans l'éditeur SQL de Supabase (après vérification du nom des contraintes, voir l'en-tête du fichier) et attendre sa confirmation.
- [ ] **Step 2: Refaire Task 2 Step 5 et Task 5 Step 5** contre la base migrée.
- [ ] **Step 3: Revue de toute la branche**, puis présenter à Edgar ce qui change et attendre sa validation.
- [ ] **Step 4: Après validation : fusionner `analytics` dans `main`, pousser** (déploiement automatique), vérifier `https://hub-agence-kleak.vercel.app/analytics` avec Edgar, supprimer le worktree.
- [ ] **Step 5: Mettre à jour `CLAUDE.md`** et commiter dans le workspace.
