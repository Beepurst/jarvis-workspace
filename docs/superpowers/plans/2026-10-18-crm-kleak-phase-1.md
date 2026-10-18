# CRM Kleak, phase 1 (Cœur) : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre le Hub Agence en ligne et lui faire recevoir les leads Meta, les inviter et les relancer par email via Brevo, détecter les réservations Cal.com, et afficher pipeline, fiche client et accueil, pour la première pub du 25 octobre 2026.

**Architecture:** Tout vit dans le Hub existant (`livrables/hub-agence/`, Next.js 15 App Router, Supabase). Chaque événement extérieur (ligne du Sheet, webhook Cal.com, webhook Brevo) est d'abord enregistré brut dans `receptions`, puis traduit par une fonction pure en événement horodaté sur le compte (`evenements`), qui fait avancer l'étape. Les relances sont des lignes `envois` programmées, envoyées par un cron quotidien qui revérifie l'éligibilité au moment d'envoyer. Étiquettes, actions du jour et chiffres sont calculés par des fonctions pures, jamais stockés.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.8, Supabase (`@supabase/supabase-js` 2), Vercel (cron), API Brevo v3, webhooks Cal.com, Google Apps Script, Node 26 (`node --test`, TypeScript natif).

**Spec:** `docs/superpowers/specs/2026-10-18-crm-kleak-design.md` (phase 1 de la section 7). S'appuie sur `docs/superpowers/specs/2026-10-15-hub-agence-design.md`.

## Global Constraints

- Code dans `livrables/hub-agence/` : **dépôt git indépendant**. Toutes les commandes git des tâches s'exécutent dedans, jamais depuis la racine du workspace.
- Ne jamais lancer `npm run build` pendant qu'un `npm run dev` tourne.
- Ne jamais afficher ni lire en clair le contenu de `.env.local` (secrets).
- Une source non configurée affiche « non configuré » et ne plante pas. Une donnée absente n'est pas une donnée nulle : jamais « 0 € » pour « non renseigné ».
- Étapes du pipeline, valeurs exactes : `nouveau_lead`, `rdv_pris`, `devis_envoye`, `acompte_paye`, `en_production`, `livre`, `solde`, `perdu`.
- Séquence lead : rang 0 (invitation) immédiat à toute heure ; rangs 1, 2, 3 à J+1, J+3, J+7 en jours calendaires, décalés au créneau suivant si hors **9 h à 19 h, lundi à samedi, heure de Paris**.
- Arrêt immédiat de toute relance si l'étape a quitté `nouveau_lead`, si le compte est désinscrit, ou si un RDV est réservé. Vérifié **au moment de l'envoi**.
- Jamais deux fois le même envoi : clé unique (`compte_id`, `sequence`, `rang`).
- Chaque événement reçu deux fois n'a qu'un effet (clé unique par réception).
- Pas de WhatsApp en phase 1 (le formulaire Meta n'a pas encore de consentement).
- Textes des emails dans Brevo (modèles) ; le CRM ne choisit que le modèle, le destinataire et les paramètres.
- Fichiers testés : pas d'`enum`, pas de `namespace`, imports de types en `import type` (Node retire les types sans compiler).
- Interface en français, pas de tiret long.

## Review Focus

1. **Le même lead renvoyé à chaque passage du script (toutes les 5 minutes)** : un seul compte, une seule invitation. Test de bout en bout en tâche 8 (deux envois identiques).
2. **Un lead qui réserve entre la programmation et l'envoi d'une relance** : la relance est annulée, pas envoyée. Test `peutEnvoyer` en tâche 5, et vérification réelle en tâche 12.
3. **Un lead sans email** (téléphone seul) : compte créé, aucune séquence email, action du jour « appeler ». Tests en tâches 4, 5 et 7.
4. **Le même email venu de deux formulaires Meta** (deux `id`) : un seul compte, une seule séquence. Vérification en tâche 8.
5. **Un webhook mal signé ou sans jeton** : 401, rien n'est écrit. Tests en tâche 6, vérification curl en tâche 10.

---

## Structure des fichiers

Dans `livrables/hub-agence/` :

| Fichier | Rôle |
|---|---|
| `supabase/crm-phase-1.sql` | Évolution de schéma, rejouable |
| `src/lib/crm/calendrier.ts` | Créneaux d'envoi, dates de séquence (pur) |
| `src/lib/crm/sheet.ts` | Lecture d'une ligne du Sheet, téléphone, email (pur) |
| `src/lib/crm/pipeline.ts` | Étapes, transitions, éligibilité des envois (pur) |
| `src/lib/crm/webhooks.ts` | Signatures et traduction Cal.com / Brevo, jeton de désinscription (pur) |
| `src/lib/crm/vues.ts` | Étiquettes, actions du jour, prochain geste, chiffres du mois (pur) |
| `src/lib/crm/db.ts` | Accès Supabase du CRM |
| `src/lib/crm/brevo.ts` | Envoi d'un email modèle |
| `src/app/api/intake/sheet/route.ts` | Réception des lignes du Sheet |
| `src/app/api/webhooks/calcom/route.ts`, `src/app/api/webhooks/brevo/route.ts` | Webhooks |
| `src/app/api/cron/relances/route.ts` | Envoi des relances dues |
| `src/app/desinscription/page.tsx` | Page publique de désinscription |
| `src/app/api/comptes/[id]/route.ts`, `src/app/api/comptes/[id]/etape/route.ts`, `src/app/api/depenses-pub/route.ts` | API privées |
| `src/app/(app)/pipeline/page.tsx`, `src/app/(app)/comptes/[id]/page.tsx`, `src/app/(app)/dashboard/page.tsx` | Écrans |
| `scripts/apps-script-sheet.gs` | Script à coller dans le Google Sheet |
| `scripts/test-crm-*.ts` | Tests |

---

### Task 1: Mise en ligne du socle existant (avec Edgar)

Prérequis de tout le reste : Cal.com et Brevo ont besoin d'une adresse publique.

**Files:**
- Modify: `README.md` (URL de production)

**Interfaces:**
- Produces: un Hub en ligne derrière mot de passe, à l'URL `https://hub.kleakagency.fr` (ou l'URL Vercel tant que le domaine n'est pas branché), notée `PUBLIC_BASE_URL`.

- [ ] **Step 1 (Edgar): Remplacer la clé `service_role` Supabase** (affichée par erreur le 15/10) : Project Settings, API Keys, nouvelle clé secrète, désactivation de l'ancienne, mise à jour de `.env.local`.
- [ ] **Step 2 (Edgar): Dépôt GitHub privé `Beepurst/hub-agence`**, puis `git remote add origin git@github.com:Beepurst/hub-agence.git && git push -u origin main`.
- [ ] **Step 3 (Edgar ou Claude après `vercel login`): Projet Vercel `hub-agence`** lié au dépôt, variables de production : `INTERNAL_APP_PASSWORD`, `INTERNAL_APP_SESSION_SECRET` (`openssl rand -hex 32`), `SUPABASE_URL` (`--no-sensitive`), `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` (`openssl rand -hex 32`). Vérifier la syntaxe avec `vercel env add --help`.
- [ ] **Step 4 (Edgar): Domaine** : sous-domaine `hub.kleakagency.fr` ajouté au projet Vercel, enregistrement DNS chez le registraire, puis variable `PUBLIC_BASE_URL=https://hub.kleakagency.fr`.
- [ ] **Step 5: Vérifier**

Run: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" $PUBLIC_BASE_URL/dashboard`
Expected: `307 <PUBLIC_BASE_URL>/login`. Puis Edgar se connecte, ouvre Bibliothèque et Briefs : aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add README.md && git commit -m "README : URL de production" && git push
```

---

### Task 2: Schéma de la phase 1

**Files:**
- Create: `supabase/crm-phase-1.sql`

**Interfaces:**
- Produces (colonnes et tables utilisées par toutes les tâches suivantes) :
  - `comptes` + `etape text not null default 'nouveau_lead'` (check sur les 8 étapes), `meta_lead_id text unique`, `telephone_normalise text`, `a_un_site text`, `budget text`, `ad_id`, `ad_name`, `adset_name`, `campaign_name`, `form_name` (text), `lead_cree_le timestamptz`, `rdv_le timestamptz`, `rdv_uid text`, `canal_reservation text check in ('email','whatsapp','direct')`, `desinscrit_le timestamptz`, `sequence_terminee_le timestamptz`. Index unique partiel sur `telephone_normalise` quand non nul.
  - `receptions` : `id`, `source text check in ('sheet','calcom','brevo')`, `cle text not null`, `payload jsonb not null`, `recu_le timestamptz default now()`, `traite_le timestamptz`, `erreur text`, **unique (`source`, `cle`)**.
  - `evenements` : `id`, `compte_id uuid not null references comptes on delete cascade`, `type text not null`, `survenu_le timestamptz not null`, `donnees jsonb not null default '{}'`, `cle text unique`, `created_at`. Index sur (`compte_id`, `survenu_le desc`).
  - `envois` : `id`, `compte_id` (cascade), `sequence text not null` (`lead`), `rang smallint not null`, `modele int not null`, `prevu_le timestamptz not null`, `statut text not null default 'prevu' check in ('prevu','envoye','annule','echec')`, `envoye_le timestamptz`, `raison text`, `brevo_message_id text`, **unique (`compte_id`, `sequence`, `rang`)**. Index partiel sur `prevu_le` où `statut = 'prevu'`.
  - `depenses_pub` : `mois date primary key` (premier jour du mois), `montant numeric not null check (montant >= 0)`, `updated_at`.
  - RLS activée sans policy sur les 4 nouvelles tables.
- Types d'événements (`evenements.type`), valeurs exactes : `lead_recu`, `email_envoye`, `email_delivre`, `email_ouvert`, `email_clique`, `email_rejete`, `rdv_reserve`, `rdv_annule`, `rdv_reporte`, `sequence_terminee`, `desinscription`, `etape_changee`.

- [ ] **Step 1: Écrire `supabase/crm-phase-1.sql`** avec `alter table ... add column if not exists`, `create table if not exists`, `create unique index if not exists`, rejouable sans casse. En tête : « À exécuter dans le SQL Editor du projet Supabase du hub, avant le déploiement de la phase 1. »
- [ ] **Step 2 (Edgar): Exécuter le fichier** dans le SQL Editor, deux fois de suite.

Expected: deux fois « Success », les tables `receptions`, `evenements`, `envois`, `depenses_pub` visibles.

- [ ] **Step 3: Commit**

```bash
git add supabase/crm-phase-1.sql && git commit -m "Schema CRM phase 1 : etapes, receptions, evenements, envois, depenses pub"
```

---

### Task 3: Calendrier d'envoi (TDD)

**Files:**
- Create: `src/lib/crm/calendrier.ts`
- Test: `scripts/test-crm-calendrier.ts`

**Interfaces:**
- Produces:
  - `prochainCreneau(d: Date): Date` : `d` si elle tombe du lundi au samedi entre 9 h 00 incluse et 19 h 00 exclue, heure de Paris ; sinon le prochain 9 h 00 de Paris d'un lundi à samedi. Gère le changement d'heure.
  - `datesSequenceLead(creeLe: Date): [Date, Date, Date]` : J+1, J+3, J+7 (jours calendaires, même heure de Paris que `creeLe`), chacune passée dans `prochainCreneau`.
  - `debutMoisParis(d: Date): Date` : premier jour du mois à 0 h, heure de Paris.

- [ ] **Step 1: Écrire les tests**

```ts
test("prochainCreneau : dans le creneau, inchange", () => {
  const d = new Date("2026-10-21T12:00:00Z"); // mercredi 14 h Paris (CEST)
  assert.equal(prochainCreneau(d).toISOString(), d.toISOString());
});
test("prochainCreneau : avant 9 h, meme jour 9 h", () => {
  assert.equal(prochainCreneau(new Date("2026-10-21T06:00:00Z")).toISOString(), "2026-10-21T07:00:00.000Z");
});
test("prochainCreneau : 19 h pile est hors creneau", () => {
  assert.equal(prochainCreneau(new Date("2026-10-21T17:00:00Z")).toISOString(), "2026-10-22T07:00:00.000Z");
});
test("prochainCreneau : samedi soir saute le dimanche et le changement d'heure", () => {
  // samedi 24/10 20 h CEST -> lundi 26/10 9 h CET (heure d'hiver depuis le 25/10)
  assert.equal(prochainCreneau(new Date("2026-10-24T18:00:00Z")).toISOString(), "2026-10-26T08:00:00.000Z");
});
test("prochainCreneau : dimanche midi -> lundi 9 h", () => {
  assert.equal(prochainCreneau(new Date("2026-11-01T11:00:00Z")).toISOString(), "2026-11-02T08:00:00.000Z");
});
test("datesSequenceLead : lead mercredi 22 h", () => {
  const r = datesSequenceLead(new Date("2026-10-21T20:00:00Z"));
  assert.deepEqual(r.map((d) => d.toISOString()), [
    "2026-10-23T07:00:00.000Z", // jeudi 22 h -> vendredi 9 h
    "2026-10-26T08:00:00.000Z", // samedi 22 h -> lundi 9 h CET
    "2026-10-29T08:00:00.000Z", // mercredi 28 22 h -> jeudi 9 h CET
  ]);
});
test("datesSequenceLead : lead mardi 10 h reste a 10 h", () => {
  const r = datesSequenceLead(new Date("2026-10-20T08:00:00Z"));
  assert.deepEqual(r.map((d) => d.toISOString()), [
    "2026-10-21T08:00:00.000Z", "2026-10-23T08:00:00.000Z", "2026-10-27T09:00:00.000Z",
  ]);
});
test("debutMoisParis : 1er novembre 0 h Paris", () => {
  assert.equal(debutMoisParis(new Date("2026-11-15T10:00:00Z")).toISOString(), "2026-10-31T23:00:00.000Z");
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-crm-calendrier.ts`
Expected: FAIL, module `src/lib/crm/calendrier.ts` introuvable.

- [ ] **Step 3: Implémenter** sans dépendance : lire jour et heure de Paris avec `Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", ... }).formatToParts`, construire une heure locale de Paris en UTC en corrigeant par le décalage de Paris à cette date (calculé par la même méthode, recalculé après correction pour les jours de changement d'heure).
- [ ] **Step 4: Vérifier le succès**

Run: `npm test`
Expected: PASS, tous les tests (anciens et nouveaux).

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/calendrier.ts scripts/test-crm-calendrier.ts && git commit -m "CRM : creneaux d'envoi et dates de sequence, avec tests"
```

---

### Task 4: Lecture des lignes du Sheet (TDD)

**Files:**
- Create: `src/lib/crm/sheet.ts`
- Test: `scripts/test-crm-sheet.ts`

**Interfaces:**
- Consumes: `normaliserEmail(raw: unknown): string | null` de `@/lib/comptes`.
- Produces:
  - `COLONNES_SHEET` : correspondance exacte nom de colonne vers champ :
    `id → meta_lead_id`, `created_time → lead_cree_le`, `ad_id`, `ad_name`, `adset_name`, `campaign_name`, `form_name`, `possédez-vous_déjà_un_site_web_? → a_un_site`, `quel_est_votre_budget_pour_la_création_ou_la_refonte_de_votre_site_? → budget`, `full name → nom`, `email → email`, `phone → telephone`, `nom_de_l’entreprise → entreprise` (apostrophe typographique U+2019).
  - `COLONNES_OBLIGATOIRES = ["id", "created_time", "full name"]`.
  - `normaliserTelephone(raw: unknown): string | null` : format E.164 ; retire le préfixe `p:` posé par Meta, les espaces, points et tirets ; `06 12 34 56 78` et `0612345678` donnent `+33612345678` ; `+33 6 12...` conservé ; moins de 8 chiffres donne `null`.
  - `interface LeadSheet { meta_lead_id: string; lead_cree_le: string /* ISO */; nom: string; entreprise: string | null; email: string | null; telephone: string | null; telephone_normalise: string | null; a_un_site: string | null; budget: string | null; ad_id: string | null; ad_name: string | null; adset_name: string | null; campaign_name: string | null; form_name: string | null }`
  - `lireLigneSheet(ligne: Record<string, unknown>): { ok: true; lead: LeadSheet } | { ok: false; erreur: string; colonnesManquantes: string[] }`
  - `colonnesAbsentes(entetes: string[]): string[]` : colonnes de `COLONNES_SHEET` absentes de l'en-tête.

- [ ] **Step 1: Écrire les tests**

```ts
const base = {
  id: "l:1234567890", created_time: "2026-10-25T18:42:11+0000", ad_id: "120", ad_name: "Pro 1800 v1",
  adset_id: "x", adset_name: "Val-d'Oise 30-55", campaign_id: "y", campaign_name: "Lancement oct",
  form_id: "z", form_name: "Devis site", is_organic: "false", platform: "fb",
  "possédez-vous_déjà_un_site_web_?": "non",
  "quel_est_votre_budget_pour_la_création_ou_la_refonte_de_votre_site_?": "1_000_€_à_2_000_€",
  "full name": " Marie Dupont ", email: "Marie@Exemple.FR ", phone: "p:+33612345678",
  "nom_de_l’entreprise": "Fleurs & Co", is_qualified: "", is_quality: "", is_converted: "", lead_status: "",
};
test("lireLigneSheet : ligne complete", () => {
  const r = lireLigneSheet(base);
  assert.equal(r.ok, true); if (!r.ok) return;
  assert.equal(r.lead.meta_lead_id, "l:1234567890");
  assert.equal(r.lead.lead_cree_le, "2026-10-25T18:42:11.000Z");
  assert.equal(r.lead.nom, "Marie Dupont");
  assert.equal(r.lead.email, "marie@exemple.fr");
  assert.equal(r.lead.telephone_normalise, "+33612345678");
  assert.equal(r.lead.entreprise, "Fleurs & Co");
  assert.equal(r.lead.budget, "1_000_€_à_2_000_€");
  assert.equal(r.lead.ad_name, "Pro 1800 v1");
});
test("lireLigneSheet : sans email ni telephone valide, accepte avec nulls", () => {
  const r = lireLigneSheet({ ...base, email: "", phone: "12" });
  assert.equal(r.ok, true); if (!r.ok) return;
  assert.equal(r.lead.email, null); assert.equal(r.lead.telephone_normalise, null);
});
test("lireLigneSheet : id ou nom absent refuse, colonnes nommees", () => {
  const r = lireLigneSheet({ ...base, id: "", "full name": undefined });
  assert.equal(r.ok, false); if (r.ok) return;
  assert.deepEqual(r.colonnesManquantes.sort(), ["full name", "id"]);
});
test("lireLigneSheet : date illisible refusee", () => {
  assert.equal(lireLigneSheet({ ...base, created_time: "hier" }).ok, false);
});
test("normaliserTelephone", () => {
  assert.equal(normaliserTelephone("06 12 34 56 78"), "+33612345678");
  assert.equal(normaliserTelephone("0612345678"), "+33612345678");
  assert.equal(normaliserTelephone("+33 6.12.34.56.78"), "+33612345678");
  assert.equal(normaliserTelephone("p:+32470123456"), "+32470123456");
  assert.equal(normaliserTelephone("123"), null);
  assert.equal(normaliserTelephone(undefined), null);
});
test("colonnesAbsentes : signale une colonne renommee", () => {
  const entetes = Object.keys(base).filter((k) => k !== "phone").concat("telephone");
  assert.deepEqual(colonnesAbsentes(entetes), ["phone"]);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-crm-sheet.ts`
Expected: FAIL, module introuvable.

- [ ] **Step 3: Implémenter `src/lib/crm/sheet.ts`** avec les signatures ci-dessus. `created_time` : format Meta `+0000` sans deux-points, à normaliser avant `new Date`.
- [ ] **Step 4: Vérifier le succès**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/sheet.ts scripts/test-crm-sheet.ts && git commit -m "CRM : lecture des lignes du Sheet Meta, avec tests"
```

---

### Task 5: Pipeline et éligibilité des envois (TDD)

**Files:**
- Create: `src/lib/crm/pipeline.ts`
- Test: `scripts/test-crm-pipeline.ts`

**Interfaces:**
- Produces:
  - `ETAPES` (les 8 valeurs, dans l'ordre), `type Etape`, `ETAPE_LABELS: Record<Etape, string>` (« Nouveau lead », « RDV pris », « Devis envoyé », « Acompte payé », « En production », « Livré », « Soldé », « Perdu »).
  - `etapeApres(actuelle: Etape, type: "rdv_reserve" | "rdv_annule"): Etape | null` : `rdv_reserve` depuis `nouveau_lead` donne `rdv_pris` ; `rdv_annule` depuis `rdv_pris` donne `nouveau_lead` ; tout autre cas `null` (aucun recul automatique ailleurs).
  - `interface EtatCompte { etape: Etape; email: string | null; desinscrit_le: string | null; rdv_le: string | null }`
  - `peutEnvoyer(compte: EtatCompte, envoi: { sequence: "lead"; rang: number }): { ok: true } | { ok: false; raison: "etape" | "desinscrit" | "rdv" | "sans_email" }`

- [ ] **Step 1: Écrire les tests**

```ts
const lead: EtatCompte = { etape: "nouveau_lead", email: "a@b.fr", desinscrit_le: null, rdv_le: null };
test("etapeApres : reservation fait avancer un nouveau lead", () => assert.equal(etapeApres("nouveau_lead", "rdv_reserve"), "rdv_pris"));
test("etapeApres : reservation ne fait pas reculer un devis envoye", () => assert.equal(etapeApres("devis_envoye", "rdv_reserve"), null));
test("etapeApres : annulation ramene rdv_pris a nouveau_lead", () => assert.equal(etapeApres("rdv_pris", "rdv_annule"), "nouveau_lead"));
test("etapeApres : annulation sans effet apres le devis", () => assert.equal(etapeApres("devis_envoye", "rdv_annule"), null));
test("peutEnvoyer : lead eligible", () => assert.deepEqual(peutEnvoyer(lead, { sequence: "lead", rang: 2 }), { ok: true }));
test("peutEnvoyer : a reserve entre-temps", () => assert.deepEqual(peutEnvoyer({ ...lead, rdv_le: "2026-10-28T09:00:00Z" }, { sequence: "lead", rang: 1 }), { ok: false, raison: "rdv" }));
test("peutEnvoyer : etape avancee a la main", () => assert.deepEqual(peutEnvoyer({ ...lead, etape: "perdu" }, { sequence: "lead", rang: 1 }), { ok: false, raison: "etape" }));
test("peutEnvoyer : desinscrit", () => assert.deepEqual(peutEnvoyer({ ...lead, desinscrit_le: "2026-10-26T10:00:00Z" }, { sequence: "lead", rang: 0 }), { ok: false, raison: "desinscrit" }));
test("peutEnvoyer : sans email", () => assert.deepEqual(peutEnvoyer({ ...lead, email: null }, { sequence: "lead", rang: 0 }), { ok: false, raison: "sans_email" }));
```

- [ ] **Step 2: Vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-crm-pipeline.ts`
Expected: FAIL, module introuvable.

- [ ] **Step 3: Implémenter `src/lib/crm/pipeline.ts`.** Ordre de vérification de `peutEnvoyer` : `desinscrit`, `etape`, `rdv`, `sans_email`.
- [ ] **Step 4: Vérifier le succès** : `npm test`, PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/pipeline.ts scripts/test-crm-pipeline.ts && git commit -m "CRM : etapes, transitions et eligibilite des relances, avec tests"
```

---

### Task 6: Webhooks et désinscription (TDD)

**Files:**
- Create: `src/lib/crm/webhooks.ts`
- Test: `scripts/test-crm-webhooks.ts`

**Interfaces:**
- Produces:
  - `verifierSignatureCal(corpsBrut: string, entete: string | null, secret: string): boolean` : en-tête `X-Cal-Signature-256` = HMAC-SHA256 hexadécimal du corps brut ; comparaison à temps constant (`timingSafeEqual`), `false` si absent ou de longueur différente.
  - `interface EvenementTraduit { type: string; survenu_le: string; cle: string; compteId: string | null; email: string | null; donnees: Record<string, unknown> }`
  - `traduireCal(payload: unknown): EvenementTraduit | null` : `triggerEvent` `BOOKING_CREATED` → `rdv_reserve`, `BOOKING_CANCELLED` → `rdv_annule`, `BOOKING_RESCHEDULED` → `rdv_reporte` ; autre → `null`. `cle` = `cal:<triggerEvent>:<payload.uid>` ; `compteId` = `payload.metadata.compte` ; `email` = premier `payload.attendees[].email` normalisé ; `donnees` = `{ debut: payload.startTime, canal: payload.metadata.canal ?? "direct", uid }`.
  - `traduireBrevo(payload: unknown): EvenementTraduit | null` : `event` `delivered` → `email_delivre`, `opened` et `unique_opened` → `email_ouvert`, `click` → `email_clique`, `hard_bounce`, `soft_bounce`, `blocked`, `invalid_email`, `error` → `email_rejete` ; autre → `null`. `compteId` tiré du tag `compte:<uuid>` ; `cle` = `brevo:<event>:<message-id>:<ts_event>` ; `donnees` = `{ message_id, lien: link ?? null, rang }` (rang tiré du tag `rang:<n>`).
  - `signerDesinscription(compteId: string, secret: string): string` (HMAC-SHA256 base64url) et `verifierDesinscription(compteId: string, signature: string, secret: string): boolean`.

- [ ] **Step 1: Écrire les tests** (le secret de test est en clair dans le fichier de test)

```ts
const secret = "secret-test";
const corps = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "abc", startTime: "2026-10-28T09:00:00Z", attendees: [{ email: "Marie@Exemple.fr" }], metadata: { compte: "c-1", canal: "email" } } });
const sig = createHmac("sha256", secret).update(corps).digest("hex");
test("verifierSignatureCal : bonne, fausse, absente", () => {
  assert.equal(verifierSignatureCal(corps, sig, secret), true);
  assert.equal(verifierSignatureCal(corps, sig.replace(/.$/, "0"), secret), false);
  assert.equal(verifierSignatureCal(corps, null, secret), false);
  assert.equal(verifierSignatureCal(corps + " ", sig, secret), false);
});
test("traduireCal : reservation", () => {
  assert.deepEqual(traduireCal(JSON.parse(corps)), {
    type: "rdv_reserve", survenu_le: "2026-10-28T09:00:00Z", cle: "cal:BOOKING_CREATED:abc",
    compteId: "c-1", email: "marie@exemple.fr", donnees: { debut: "2026-10-28T09:00:00Z", canal: "email", uid: "abc" },
  });
});
test("traduireCal : evenement ignore", () => assert.equal(traduireCal({ triggerEvent: "MEETING_ENDED", payload: {} }), null));
test("traduireBrevo : clic rattache au compte et au rang", () => {
  const r = traduireBrevo({ event: "click", email: "a@b.fr", "message-id": "<m1@brevo>", ts_event: 1792500000, tags: ["compte:c-1", "rang:2"], link: "https://cal.com/kleak?x" });
  assert.equal(r?.type, "email_clique"); assert.equal(r?.compteId, "c-1"); assert.equal(r?.donnees.rang, 2);
  assert.equal(r?.cle, "brevo:click:<m1@brevo>:1792500000");
});
test("traduireBrevo : evenement inconnu ignore", () => assert.equal(traduireBrevo({ event: "list_addition" }), null));
test("desinscription : signature verifiable et liee au compte", () => {
  const s = signerDesinscription("c-1", secret);
  assert.equal(verifierDesinscription("c-1", s, secret), true);
  assert.equal(verifierDesinscription("c-2", s, secret), false);
  assert.equal(verifierDesinscription("c-1", "abc", secret), false);
});
```

`survenu_le` d'un événement Brevo : `ts_event` (secondes) converti en ISO ; à défaut, `date`.

- [ ] **Step 2: Vérifier l'échec**, Step 3 : implémenter, Step 4 : `npm test` PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/webhooks.ts scripts/test-crm-webhooks.ts && git commit -m "CRM : signatures et traduction des webhooks Cal.com et Brevo, desinscription, avec tests"
```

---

### Task 7: Étiquettes, actions du jour et chiffres (TDD)

**Files:**
- Create: `src/lib/crm/vues.ts`
- Test: `scripts/test-crm-vues.ts`

**Interfaces:**
- Consumes: `Etape` (tâche 5).
- Produces:
  - `interface CompteVue { id: string; nom: string; entreprise: string | null; etape: Etape; email: string | null; telephone_normalise: string | null; lead_cree_le: string | null; rdv_le: string | null; desinscrit_le: string | null; sequence_terminee_le: string | null; dernierRangEnvoye: number | null; ouvert: boolean; clique: boolean; rdvAnnule: boolean }`
  - `type Ton = "urgent" | "aujourdhui" | "info" | "ok"`
  - `etiquette(c: CompteVue, maintenant: Date): { texte: string; ton: Ton }`
  - `actionsDuJour(comptes: CompteVue[], maintenant: Date): { compteId: string; nom: string; texte: string; ton: Ton }[]`, triées urgent, puis aujourd'hui, puis info.
  - `prochainGeste(c: CompteVue, maintenant: Date): string`
  - `chiffresMois(p: { leads: number; rdv: number; depense: number | null }): { leads: number; rdv: number; coutParLead: number | null; tauxRdv: number | null; coutAffiche: string }`

Règles exactes :

| Situation (`nouveau_lead` sauf mention) | Étiquette (ton) | Action du jour (ton) |
|---|---|---|
| sans email ni téléphone | « Injoignable » (urgent) | « Lead sans coordonnées : vérifier dans Meta » (urgent) |
| sans email, avec téléphone | « Appeler » (aujourdhui) | « Pas d'email : appeler <nom> » (aujourdhui) |
| `rdvAnnule` | « RDV annulé » (aujourdhui) | « RDV annulé : rappeler <nom> » (aujourdhui) |
| `sequence_terminee_le` non nul | « Séquence terminée » (info) | « Séquence terminée sans RDV : appeler ou passer en perdu » (info) |
| `desinscrit_le` non nul | « Désinscrit » (info) | aucune |
| `clique` | « Lien cliqué » (ok) | aucune |
| `ouvert` | « Mail ouvert » (ok) | aucune |
| `dernierRangEnvoye` ≥ 1 | « Relance <n> envoyée » (info) | aucune |
| sinon | « Invité » (info) ; s'il a moins de 24 h : action « Nouveau lead : <nom> » (info) |
| `rdv_pris`, RDV à venir | « RDV le jj/mm à hh h mm » (ok) ; si dans les 24 h : action « RDV demain ou aujourd'hui : préparer <nom> » (aujourdhui) |
| `rdv_pris`, RDV passé | « RDV passé : envoyer le devis » (urgent) | « RDV passé avec <nom> : envoyer le devis » (urgent) |

Les situations se testent dans l'ordre du tableau, la première qui s'applique gagne. `prochainGeste` rend le texte de l'action du compte, sinon « Rien à faire : le CRM relance automatiquement ». `chiffresMois` : `coutAffiche` vaut « non renseigné » si `depense` est nul, « pas de lead » si `leads` vaut 0, sinon le montant formaté (`formatCurrency` de `@/lib/format`).

- [ ] **Step 1: Écrire les tests**, un par ligne du tableau (au minimum : injoignable, appeler, RDV annulé, séquence terminée, désinscrit sans action, clic, RDV passé urgent, RDV dans les 24 h, ordre de tri urgent avant info), plus :

```ts
test("chiffresMois : depense non saisie n'est pas zero", () => {
  assert.deepEqual(chiffresMois({ leads: 10, rdv: 3, depense: null }).coutAffiche, "non renseigné");
  assert.equal(chiffresMois({ leads: 10, rdv: 3, depense: null }).coutParLead, null);
});
test("chiffresMois : pas de lead", () => assert.equal(chiffresMois({ leads: 0, rdv: 0, depense: 50 }).coutAffiche, "pas de lead"));
test("chiffresMois : calcul", () => {
  const c = chiffresMois({ leads: 25, rdv: 8, depense: 120 });
  assert.equal(c.coutParLead, 4.8); assert.equal(c.tauxRdv, 0.32);
});
```

- [ ] **Step 2: Vérifier l'échec**, Step 3 : implémenter, Step 4 : `npm test` PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/crm/vues.ts scripts/test-crm-vues.ts && git commit -m "CRM : etiquettes, actions du jour, prochain geste et chiffres du mois, avec tests"
```

---

### Task 8: Réception des leads (Sheet vers CRM)

**Files:**
- Create: `src/lib/crm/db.ts`, `src/app/api/intake/sheet/route.ts`, `scripts/apps-script-sheet.gs`
- Modify: `src/middleware.ts` (exemptions `api/intake`, `api/webhooks`, `desinscription`), `.env.example`

**Interfaces:**
- Consumes: `lireLigneSheet`, `LeadSheet` (tâche 4) ; `datesSequenceLead` (tâche 3) ; `getSupabaseClient`.
- Produces (dans `src/lib/crm/db.ts`) :
  - `enregistrerReception(source: "sheet" | "calcom" | "brevo", cle: string, payload: unknown): Promise<{ nouvelle: boolean; id: string }>` : insertion ignorée si (`source`, `cle`) existe déjà.
  - `marquerReception(id: string, erreur: string | null): Promise<void>`
  - `upsertLead(lead: LeadSheet): Promise<{ compteId: string; cree: boolean }>` : rattachement par `meta_lead_id`, puis par email (`normaliserEmail`), puis par `telephone_normalise` ; sinon création avec `source = 'formulaire'`, `etape = 'nouveau_lead'`. Un compte existant n'est jamais remis à `nouveau_lead`.
  - `ajouterEvenement(compteId: string, type: string, survenuLe: string, donnees: Record<string, unknown>, cle?: string): Promise<boolean>` : `false` si la clé existe déjà.
  - `programmerSequenceLead(compteId: string, creeLe: Date, modeles: number[]): Promise<void>` : 4 lignes `envois` (rang 0 à `now`, rangs 1 à 3 aux dates de `datesSequenceLead`), insertion ignorée sur la clé unique.
- Route `POST /api/intake/sheet` : en-tête `X-Kleak-Secret` comparé à temps constant à `SHEET_INTAKE_SECRET` (absent : 503 « non configuré » ; faux : 401). Corps `{ entetes: string[]; lignes: Record<string, string>[] }`. Pour chaque ligne : `enregistrerReception("sheet", id, ligne)` ; si nouvelle et lisible : `upsertLead`, événement `lead_recu` (clé `sheet:<id>`), et si compte créé : `programmerSequenceLead` puis envoi immédiat du rang 0 (fonction `envoyerDus` de la tâche 9, limitée à ce compte). Réponse : `{ recues, nouvelles, crees, erreurs: [{ id, erreur }], colonnesAbsentes }`.
- `scripts/apps-script-sheet.gs` : fonction `envoyerAuCrm()` qui lit l'en-tête et les 200 dernières lignes de la première feuille et les poste en JSON vers `<PUBLIC_BASE_URL>/api/intake/sheet` avec l'en-tête secret (lus dans les propriétés du script `CRM_URL` et `CRM_SECRET`) ; fonction `installer()` qui crée un déclencheur horaire toutes les 5 minutes et un déclencheur « à la modification ». Commentaire d'en-tête : comment l'installer, en 5 étapes.

Décision : le Sheet pousse vers le CRM toutes les 5 minutes (déclencheur horaire, qui se lance quel que soit l'outil qui écrit les lignes) plutôt que le CRM ne lise le Sheet : même garantie « aucun lead perdu » que la spec, sans identifiants Google ni cron à la minute côté Vercel.

- [ ] **Step 1: Écrire `db.ts`, la route, le script et les exemptions du middleware.** Ajouter à `.env.example` : `SHEET_INTAKE_SECRET`, `PUBLIC_BASE_URL`, `CRON_SECRET`.
- [ ] **Step 2: Compiler** : `npx tsc --noEmit && npm test`, 0 erreur, PASS.
- [ ] **Step 3: Vérifier en local contre Supabase** (`npm run dev`, Brevo non configuré : le rang 0 est enregistré en `echec` avec raison « brevo non configuré », sans planter) :

```bash
S=$(grep '^SHEET_INTAKE_SECRET=' .env.local | cut -d= -f2-)
L='{"entetes":["id","created_time","full name","email","phone"],"lignes":[{"id":"t:1","created_time":"2026-10-20T08:00:00+0000","full name":"Test Un","email":"test.un@exemple.fr","phone":"0612345678"}]}'
curl -s -X POST localhost:3000/api/intake/sheet -H "X-Kleak-Secret: $S" -H 'content-type: application/json' -d "$L"
curl -s -X POST localhost:3000/api/intake/sheet -H "X-Kleak-Secret: $S" -H 'content-type: application/json' -d "$L"
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/intake/sheet -H "X-Kleak-Secret: faux" -d "$L"
```

Expected: première réponse `crees: 1`, deuxième `nouvelles: 0, crees: 0` ; troisième `401`. Un 2e lead `t:2` avec le même email en majuscules : `crees: 0`, rattaché au même compte. En base : 1 compte, 4 envois, 1 événement `lead_recu`. `colonnesAbsentes` liste les colonnes Meta manquantes de l'exemple. Nettoyer les données de test.

- [ ] **Step 4: Commit**

```bash
git add src/lib/crm/db.ts src/app/api/intake src/middleware.ts scripts/apps-script-sheet.gs .env.example
git commit -m "CRM : reception des leads depuis le Sheet, sans doublon, et script Apps Script"
```

---

### Task 9: Envoi Brevo, relances et désinscription

**Files:**
- Create: `src/lib/crm/brevo.ts`, `src/app/api/cron/relances/route.ts`, `src/app/desinscription/page.tsx`
- Modify: `src/lib/crm/db.ts`, `src/lib/source-status.ts`, `vercel.json`, `.env.example`

**Interfaces:**
- Consumes: `peutEnvoyer` (tâche 5), `signerDesinscription`, `verifierDesinscription` (tâche 6), `ajouterEvenement` (tâche 8).
- Produces:
  - `isBrevoConfigured(): boolean` dans `source-status.ts` (`BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_TEMPLATE_INVITATION`, `BREVO_TEMPLATE_RELANCE_1`, `_2`, `_3`).
  - `modelesSequenceLead(): number[]` : `[invitation, relance1, relance2, relance3]` depuis l'environnement.
  - `envoyerModele(p: { email: string; nom: string; modele: number; params: Record<string, string>; tags: string[] }): Promise<{ ok: true; messageId: string } | { ok: false; erreur: string }>` : `POST https://api.brevo.com/v3/smtp/email`, en-tête `api-key`, corps `{ sender: { email: BREVO_SENDER_EMAIL, name: "Kleak Agency" }, to: [{ email, name }], replyTo: { email: BREVO_REPLY_TO } (si défini), templateId, params, tags }`.
  - Paramètres passés aux modèles, valeurs exactes : `prenom` (premier mot du nom), `entreprise`, `lien_rdv` (`CALCOM_URL` + `?metadata[compte]=<id>&metadata[canal]=email&name=<nom>&email=<email>`, encodés), `lien_desinscription` (`<PUBLIC_BASE_URL>/desinscription?c=<id>&s=<signature>`). Tags : `compte:<id>`, `rang:<n>`, `seq:lead`.
  - `envoyerDus(p: { maintenant: Date; compteId?: string }): Promise<{ envoyes: number; annules: number; echecs: number }>` dans `db.ts` : pour chaque envoi `prevu` dû, relit le compte, applique `peutEnvoyer` ; non éligible : `annule` + raison ; éligible : envoi Brevo, `envoye` + `brevo_message_id` + événement `email_envoye` (`{ rang }`) ; échec : `echec` + raison. Après l'envoi du rang 3 : `sequence_terminee_le` et événement `sequence_terminee`. Passage de `prevu` à un autre statut par mise à jour conditionnelle (`where statut = 'prevu'`) pour qu'un envoi ne parte jamais deux fois.
  - `GET /api/cron/relances` : `Authorization: Bearer <CRON_SECRET>` obligatoire (401 sinon), appelle `envoyerDus({ maintenant: new Date() })`.
  - `vercel.json` : cron `{ "path": "/api/cron/relances", "schedule": "0 8 * * *" }` (une fois par jour, compatible avec l'offre gratuite de Vercel).
  - Page `/desinscription` : vérifie la signature ; valide : `desinscrit_le`, envois `prevu` du compte passés en `annule` (raison `desinscrit`), événement `desinscription`, message « Vous ne recevrez plus nos emails. » ; invalide : « Lien invalide. » Aucune autre donnée affichée.
- `.env.example` : `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_REPLY_TO`, `BREVO_TEMPLATE_INVITATION`, `BREVO_TEMPLATE_RELANCE_1`, `BREVO_TEMPLATE_RELANCE_2`, `BREVO_TEMPLATE_RELANCE_3`, `CALCOM_URL`, `DESINSCRIPTION_SECRET`.

- [ ] **Step 1: Écrire les modules, la route, la page et le cron.**
- [ ] **Step 2: Compiler** : `npx tsc --noEmit && npm test`, PASS.
- [ ] **Step 3: Vérifier en local** avec un compte de test dont un envoi `prevu` a `prevu_le` dans le passé : Brevo non configuré → `echec` « brevo non configuré » ; compte passé en `perdu` → `annule` raison `etape` ; deux appels successifs du cron : aucun envoi traité deux fois ; `GET /api/cron/relances` sans en-tête → 401 ; lien de désinscription valide → message attendu et envois annulés ; signature modifiée → « Lien invalide. ».
- [ ] **Step 4: Commit**

```bash
git add src/lib/crm src/app/api/cron src/app/desinscription src/lib/source-status.ts vercel.json .env.example
git commit -m "CRM : envoi Brevo, relances quotidiennes revalidees a l'envoi, desinscription"
```

---

### Task 10: Webhooks Cal.com et Brevo

**Files:**
- Create: `src/app/api/webhooks/calcom/route.ts`, `src/app/api/webhooks/brevo/route.ts`
- Modify: `src/lib/crm/db.ts`, `.env.example`

**Interfaces:**
- Consumes: `verifierSignatureCal`, `traduireCal`, `traduireBrevo` (tâche 6) ; `etapeApres` (tâche 5) ; `enregistrerReception`, `marquerReception`, `ajouterEvenement` (tâche 8) ; `sendPush` (`@/lib/push`).
- Produces:
  - `appliquerEvenement(e: EvenementTraduit): Promise<{ compteId: string | null }>` dans `db.ts` : compte retrouvé par `compteId`, sinon par email ; introuvable : réception marquée en erreur « compte introuvable », rien d'autre. Sinon : `ajouterEvenement` (clé `e.cle`) ; si nouveau : pour `rdv_reserve`, `rdv_le`, `rdv_uid`, `canal_reservation`, passage d'étape via `etapeApres`, envois `prevu` annulés (raison `rdv`), push « Nouveau RDV : <nom>, <jj/mm hh:mm> » ; pour `rdv_annule`, `rdv_le` remis à nul, passage via `etapeApres`, push « RDV annulé : <nom> » ; pour `rdv_reporte`, nouveau `rdv_le`.
  - `POST /api/webhooks/calcom` : corps lu en texte brut, `verifierSignatureCal` avec `CALCOM_WEBHOOK_SECRET` (absent : 503 ; faux : 401), puis réception, traduction, application.
  - `POST /api/webhooks/brevo?jeton=<BREVO_WEBHOOK_TOKEN>` : jeton comparé à temps constant (absent : 503 ; faux : 401). Brevo peut envoyer un tableau ou un objet : traiter les deux.
  - Les deux répondent 200 dès que la réception est enregistrée, y compris pour un événement ignoré, pour éviter des réessais inutiles.
- `.env.example` : `CALCOM_WEBHOOK_SECRET`, `BREVO_WEBHOOK_TOKEN`.

- [ ] **Step 1: Écrire les routes et `appliquerEvenement`.**
- [ ] **Step 2: Compiler** : `npx tsc --noEmit && npm test`, PASS.
- [ ] **Step 3: Vérifier en local** : un webhook Cal.com signé (signature calculée avec `openssl dgst -sha256 -hmac`) pour un compte de test → étape `rdv_pris`, `rdv_le` posé, envois annulés ; le même rejoué → aucun deuxième événement ; signature fausse → 401 et aucune réception ; webhook Brevo `click` avec le bon jeton → événement `email_clique` ; sans jeton → 401 ; annulation Cal.com → retour à `nouveau_lead`. Nettoyer.
- [ ] **Step 4: Commit**

```bash
git add src/app/api/webhooks src/lib/crm/db.ts .env.example
git commit -m "CRM : webhooks Cal.com et Brevo, passage d'etape et arret des relances a la reservation"
```

---

### Task 11: Écrans (pipeline, fiche client, accueil)

**Files:**
- Create: `src/app/(app)/pipeline/page.tsx`, `src/app/(app)/comptes/[id]/page.tsx`, `src/app/api/comptes/[id]/route.ts`, `src/app/api/comptes/[id]/etape/route.ts`, `src/app/api/depenses-pub/route.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`, `src/lib/channels.tsx` (groupe « Commercial » : Pipeline), `src/lib/crm/db.ts`

**Interfaces:**
- Consumes: `etiquette`, `actionsDuJour`, `prochainGeste`, `chiffresMois`, `CompteVue` (tâche 7) ; `ETAPES`, `ETAPE_LABELS` (tâche 5) ; `debutMoisParis` (tâche 3).
- Produces:
  - `listerComptesVue(): Promise<CompteVue[]>` et `chiffresDuMois(maintenant: Date): Promise<{ leads: number; rdv: number; depense: number | null }>` dans `db.ts` (`leads` = comptes avec `lead_cree_le` dans le mois de Paris ; `rdv` = événements `rdv_reserve` reçus dans le mois).
  - `GET /api/comptes/[id]` → `{ compte, evenements }` (événements du plus récent au plus ancien).
  - `PATCH /api/comptes/[id]/etape` `{ etape }` : changement manuel, toute valeur de `ETAPES` acceptée, événement `etape_changee` (`{ de, vers, manuel: true }`) ; passage hors `nouveau_lead` annule les envois `prevu` (raison `etape`).
  - `POST /api/depenses-pub` `{ mois: "YYYY-MM", montant }` : upsert.
- Écrans, conformes aux maquettes validées (spec, section 3) :
  - **Pipeline** : colonnes des 7 étapes hors « Perdu », « Perdu » en filtre ; carte = entreprise ou nom, depuis quand, étiquette colorée par ton ; sélecteur d'étape sur la carte pour le passage manuel ; clic → fiche.
  - **Fiche client** : en-tête (nom, entreprise, téléphone cliquable `tel:`, email, étape) ; 4 indicateurs : dernier échange (dernier événement), temps de réponse (« non mesuré » en phase 1), devis (« pas encore »), payé (« pas encore ») ; prochain geste surligné ; réponses Meta (site existant, budget) et pub d'origine (`ad_name`, `campaign_name`) ; historique chronologique lisible (libellé par type d'événement, date et heure de Paris).
  - **Accueil** (remplace le tableau de bord provisoire) : 4 chiffres (CA encaissé : « arrive avec la vente (phase 2) », jamais 0 € ; leads du mois ; coût par lead avec champ de saisie du budget du mois ; RDV pris et taux lead vers RDV), objectif « 2 550 € par mois » affiché ; actions du jour ; aperçu du pipeline (nombre par étape). Bandeau « non configuré » si Brevo ou Cal.com ne le sont pas, et bandeau permanent « détection des réponses non configurée : les relances s'arrêtent à la réservation, pas à une réponse » (la lecture de la boîte Gmail arrive plus tard).
  - Tout est lisible sur téléphone (une colonne, pas de défilement horizontal de la page ; le pipeline défile horizontalement dans son propre cadre).

- [ ] **Step 1: Écrire les routes, les fonctions `db.ts` et les écrans.**
- [ ] **Step 2: Compiler et builder** : `npx tsc --noEmit && npm test && npm run build`, succès, pages `/pipeline` et `/comptes/[id]` listées.
- [ ] **Step 3: Vérifier en local** avec 3 comptes de test (nouveau, RDV à venir, RDV passé) : étiquettes et actions conformes au tableau de la tâche 7 ; passage manuel en « Perdu » → disparaît des colonnes, envois annulés ; saisie de 50 € pour le mois → coût par lead calculé ; sans saisie → « non renseigné ». Nettoyer.
- [ ] **Step 4: Commit**

```bash
git add src/app "src/app/(app)" src/lib/channels.tsx src/lib/crm/db.ts
git commit -m "CRM : pipeline, fiche client et accueil"
```

---

### Task 12: Branchement réel et test de bout en bout (avec Edgar)

**Files:**
- Modify: `README.md`, `/Users/ed/Desktop/jarvis-ecom/CLAUDE.md` (section Hub Agence), `/Users/ed/Desktop/jarvis-ecom/context/CONTEXT.md` (sur accord d'Edgar)

- [ ] **Step 1 (Edgar): Brevo** : domaine `kleakagency.fr` authentifié (DKIM, SPF, DMARC), expéditeur, 4 modèles (invitation, relances 1 à 3) utilisant `{{ params.prenom }}`, `{{ params.lien_rdv }}`, `{{ params.lien_desinscription }}`, clé API, puis webhook transactionnel vers `<PUBLIC_BASE_URL>/api/webhooks/brevo?jeton=<BREVO_WEBHOOK_TOKEN>` (événements délivré, ouvert, cliqué, rejets). Claude rédige les 4 textes si Edgar le souhaite.
- [ ] **Step 2 (Edgar): Cal.com** : webhook vers `<PUBLIC_BASE_URL>/api/webhooks/calcom` avec secret, événements réservation, annulation, report. Vérifier sur une réservation réelle que `metadata.compte` et `metadata.canal` passés dans le lien arrivent bien dans le webhook ; sinon, le rattachement se fait par email (déjà prévu) et le canal vaut « direct ».
- [ ] **Step 3 (Edgar): Google Sheet** : coller `scripts/apps-script-sheet.gs`, renseigner `CRM_URL` et `CRM_SECRET`, lancer `installer()` une fois, autoriser.
- [ ] **Step 4: Variables Vercel** de toutes les tâches (liste complète dans `.env.example`), puis déploiement.
- [ ] **Step 5: Test de bout en bout réel**
  1. Edgar remplit le formulaire Meta en mode test (outil de test des prospects de Meta) avec son propre email.
  2. Dans les 5 minutes : le lead apparaît dans le pipeline, l'invitation arrive dans sa boîte.
  3. Il ouvre l'email et clique : la fiche montre « Mail ouvert » puis « Lien cliqué ».
  4. Il réserve sur Cal.com : la carte passe à « RDV pris » sans action, une notification push arrive, les relances programmées sont annulées.
  5. Il annule : retour à « Nouveau lead », étiquette « RDV annulé ».
  6. Le lendemain : le cron a tourné, aucune relance n'est partie pour un compte qui a réservé.
  7. Le lien de désinscription d'un email arrête les envois.
  8. Le Sheet relu au passage suivant ne crée aucun doublon.

Expected: les 8 points passent. Tout écart est corrigé avant de déclarer la phase finie.

- [ ] **Step 6: Documentation** : README (état, variables, installation du script), section Hub Agence de `CLAUDE.md` (en ligne, URL), proposition de mise à jour de `CONTEXT.md` à Edgar.
- [ ] **Step 7: Commit et push**

```bash
git add README.md && git commit -m "README : CRM phase 1 en ligne" && git push
```
