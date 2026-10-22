# Du RDV découverte à la facture d'acompte : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** après un RDV découverte, le hub récupère la transcription, la résume sur la fiche, prépare un devis conforme, le dépose en brouillon dans Gmail, relance le prospect, et au devis signé crée la vente et les factures dans Stripe.

**Architecture :** trois domaines sous `src/lib/` : `devis/` (calcul, numérotation, PDF, Stripe en écriture, relances), `rdv/` (transcription Cal.com ou collée, résumé Groq) et `google/` (OAuth, MIME, Gmail). Chaque domaine sépare un module pur testé (`node:test`) et un module d'entrée/sortie. Les écrans s'ajoutent à la fiche `/comptes/[id]` et à `/reglages`. Le cron quotidien existant `/api/cron/relances` porte aussi les relances de devis et les réessais de transcription.

**Tech Stack :** Next.js 15 (App Router), TypeScript, Supabase (service role, Storage), `stripe` 23, `@react-pdf/renderer` (nouvelle dépendance), API REST Gmail et Groq appelées par `fetch` (pas de SDK), tests `npm test` (`scripts/test-*.ts`, alias `@/` via `scripts/alias-hook.mjs`).

**Spec :** `docs/superpowers/specs/2026-10-21-devis-automatiques-design.md` (racine du workspace). Offre : `livrables/offre/fiche-offre.md`, catalogue `src/lib/offre.ts`.

## Global Constraints

- Dépôt `livrables/hub-agence/` (`Beepurst/hub-agence-kleak`), jamais commité depuis la racine du workspace. Worktree `livrables/hub-agence-devis` sur la branche `devis`, créée depuis `main` à jour (`f3648cd` ou plus récent). Fusion dans `main` seulement après validation d'Edgar : chaque push sur `main` part en production.
- Jamais de `npm run build` pendant qu'un serveur dev tourne.
- Montants en centimes (`integer`), catalogue unique `src/lib/offre.ts`. Dates en jour de Paris `AAAA-MM-JJ` via `jourParis` de `@/lib/finance/calculs`, euros affichés avec `formatEuros`.
- SQL : un fichier idempotent `supabase/devis.sql`, exécuté par Edgar dans le SQL Editor ; le SQL complet est recopié dans la conversation au moment de le lui demander. RLS activée sans policy, comme le reste du schéma.
- Variables d'environnement nouvelles : `STRIPE_WRITE_KEY`, `CALCOM_API_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`. `GROQ_API_KEY` existe déjà. Posées par Edgar via script, jamais affichées. `STRIPE_SECRET_KEY` (lecture seule, Finance) n'est jamais utilisée pour écrire.
- Rien ne part vers un prospect sans un clic d'Edgar, **sauf les relances email après devis** (spec 3.5), chacune annulable.
- Le résumé n'invente rien : un champ non abordé vaut `null` et s'affiche « non abordé » ; une formule incertaine vaut `"a_trancher"`.
- Le devis ne parle jamais d'engagement de 12 mois. Maintenance : « sans engagement, préavis de 2 mois ».
- Mentions du devis : « TVA non applicable, article 293 B du CGI », validité 30 jours, pénalités de retard et indemnité forfaitaire de recouvrement de 40 €, zone « Bon pour accord ».
- Transcriptions, PDF de devis et PDF signés : bucket Storage privé `devis`, liens signés de 10 minutes, supprimés avec le compte.
- Apparence : couleurs via `src/app/theme.css` uniquement ; la couleur va aux chiffres et aux cartes, jamais aux listes ; lisible sur iPhone. Pas de `alert`/`confirm` du navigateur. Textes au tutoiement, sans tiret long.
- Toute action qui écrit (Stripe, Gmail, base) depuis l'interface appelle `router.refresh()` ensuite (`staleTimes` de 30 s).
- Commits en français préfixés `Devis : `, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Transcription trop longue pour la limite gratuite de Groq** (appel de 45 min, plus de jetons par minute que l'offre gratuite n'en accepte) : le résumé ne doit pas échouer en silence ; découpage ou message « résumé impossible, transcription trop longue » sur la fiche, la transcription reste lisible et le devis reste faisable à la main. Testé en tâche 9.
2. **Prospect qui a déjà répondu « je réfléchis » avant la relance J+3** : le hub ne lit pas la boîte, donc la notification de la veille et le statut « en discussion » doivent bloquer la relance. Testé en tâche 11.
3. **Devis corrigé après envoi** : la version 2 annule les relances de la version 1, garde le même numéro suffixé `-2`, et la version 1 reste lisible mais n'est plus signable. Testé en tâches 3 et 6.
4. **Deux clics sur « Devis signé » ou « Envoyer la facture »** (double tap sur iPhone, réseau lent) : une seule vente, un seul client Stripe, une seule facture. Testé en tâche 8.
5. **RDV sans compte rattaché ou sans réservation Cal.com** (lien Calendly du site, appel repris au téléphone) : « Coller une transcription » produit le même résumé et le même préremplissage. Testé en tâches 8 et 9.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `supabase/devis.sql` | Tables `devis`, `devis_relances`, `rdv_transcriptions`, `reglages_devis`, `google_connexion` ; colonnes d'identité sur `comptes` ; maintenance sans fin sur `ventes` ; bucket `devis` |
| `src/lib/offre.ts`, `src/lib/ventes/*` | Maintenance sans engagement |
| `src/lib/devis/types.ts`, `calcul.ts`, `numero.ts`, `validation.ts` | Devis, pur |
| `src/lib/devis/annuaire.ts` | API Recherche d'entreprises |
| `src/lib/devis/pdf.tsx` | PDF du devis et des CGV |
| `src/lib/devis/db.ts`, `reglages.ts` | Lecture et écriture Supabase |
| `src/lib/devis/stripe-plan.ts` (pur), `stripe-ecriture.ts` | Factures et abonnements Stripe |
| `src/lib/devis/relances.ts` (pur), `relances-db.ts` | Relances après devis |
| `src/lib/google/oauth.ts`, `mime.ts` (pur), `gmail.ts` | Connexion Google et Gmail |
| `src/lib/rdv/types.ts`, `resume.ts` (pur), `groq.ts`, `calcom.ts`, `db.ts` | Transcription et résumé |
| `src/app/api/devis/**`, `src/app/api/rdv/**`, `src/app/api/google/**` | Routes |
| `src/app/(app)/comptes/[id]/rdv-*.tsx`, `devis-*.tsx` | Fiche |
| `src/app/(app)/reglages/devis-*.tsx` | Réglages |
| `livrables/offre/cgv-prestation.md`, `livrables/process/reglages-devis.md` (workspace) | Livrables hors code |

---

### Task 1 : Worktree, schéma et types

**Files :**
- Create : `supabase/devis.sql`, `src/lib/devis/types.ts`, `src/lib/rdv/types.ts`

**Interfaces :**
- Produces (`src/lib/devis/types.ts`) :
  - `type StatutDevis = "brouillon" | "prepare" | "envoye" | "en_discussion" | "signe" | "refuse" | "remplace"`
  - `interface ClientDevis { raisonSociale: string; adresse: string; siret: string | null; email: string }`
  - `interface LigneLibre { libelle: string; centimes: number }`
  - `interface EntreeDevis { compteId: string; formule: Formule; prixSiteCentimes: number; options: OptionCle[]; lignesLibres: LigneLibre[]; modePaiement: ModePaiement; maintenance: boolean; client: ClientDevis }`
  - `interface Devis extends EntreeDevis { id: string; numero: string; version: number; statut: StatutDevis; creeLe: string; envoyeLe: string | null; signeLe: string | null; venteId: string | null; pdfPath: string | null; pdfSignePath: string | null; gmailDraftId: string | null; gmailThreadId: string | null; stripeFactureId: string | null }`
  - `interface Emetteur { nom: string; mention: string; adresse: string; siret: string; email: string; telephone: string }`
  - `interface ReglagesDevis { emetteur: Emetteur; prefixe: string; prochainNumero: number; objetEmail: string; messageEmail: string; relances: { jours: number; texte: string }[]; messageWhatsapp: string; cgv: string }`
- Produces (`src/lib/rdv/types.ts`) :
  - `type SourceTranscription = "calcom" | "collee" | "tldv"`
  - `type StatutTranscription = "en_attente" | "recue" | "resumee" | "introuvable" | "erreur"`
  - `type TypePoint = "prix" | "demande" | "hesitation" | "delai" | "tiers" | "concurrent" | "autre"`
  - `interface PointAttention { type: TypePoint; texte: string; citation: string; horsFormule: boolean }`
  - `interface ResumeRdv { activite: string | null; zone: string | null; taille: string | null; siteExistant: string | null; besoin: string | null; formule: Formule | "a_trancher"; options: OptionCle[]; autresDemandes: string[]; budget: string | null; paiement: ModePaiement | null; contenus: { logo: string | null; photos: string | null; textes: string | null; domaine: string | null }; prochaineEtape: string | null; pointsAttention: PointAttention[] }`

- [ ] **Step 1 : créer le worktree** : `git -C livrables/hub-agence pull --ff-only && git -C livrables/hub-agence worktree add ../hub-agence-devis -b devis`, puis `npm ci` dans le worktree. Vérifier : `npm test` passe sur la branche neuve.
- [ ] **Step 2 : écrire `supabase/devis.sql`** (idempotent) :
  - `comptes` : `raison_sociale text`, `adresse text`, `siret text`.
  - `ventes` : `maintenance_mois` devient nullable (`alter column … drop not null`, `drop default`), contrainte `> 0` gardée quand non nul ; `maintenance_arretee_le date` ; `devis_id uuid references devis(id)`.
  - `devis` : colonnes de `Devis` en snake_case (`options text[]`, `lignes_libres jsonb`, `client jsonb`), `compte_id … on delete cascade`, `numero text not null`, `version integer not null default 1`, `unique (numero, version)`, `statut` contraint aux 7 valeurs, `relances_coupees boolean not null default false`.
  - `devis_relances` : `id`, `devis_id … on delete cascade`, `canal text check in ('email','whatsapp')`, `rang integer`, `prevu_le timestamptz`, `statut text check in ('prevue','envoyee','proposee','faite','annulee','echec')`, `raison text`, `envoye_le timestamptz`, `unique (devis_id, canal, rang)`.
  - `rdv_transcriptions` : `id`, `compte_id … on delete cascade` (nullable tant que non rattachée), `source`, `booking_uid text unique`, `statut`, `texte text`, `resume jsonb`, `essais integer not null default 0`, `erreur text`, `fin_reunion_le timestamptz`, `created_at`.
  - `reglages_devis` : une ligne (`id integer primary key check (id = 1)`), colonnes de `ReglagesDevis` (`emetteur jsonb`, `relances jsonb`…), insérée avec des valeurs vides et `relances = [{jours:3,…},{jours:7,…}]`.
  - `google_connexion` : une ligne (`id = 1`), `email text`, `refresh_token text`, `connecte_le timestamptz`.
  - bucket : `insert into storage.buckets (id, name, public) values ('devis','devis',false) on conflict do nothing`.
- [ ] **Step 3 : écrire les deux fichiers de types** exactement comme dans Interfaces. Vérifier : `npx tsc --noEmit` sans erreur.
- [ ] **Step 4 : commit** `Devis : schéma et types`.

### Task 2 : Maintenance sans engagement

**Files :**
- Modify : `src/lib/offre.ts`, `src/lib/ventes/types.ts`, `echeancier.ts`, `synthese.ts`, `validation.ts`, `db.ts`, `src/app/(app)/comptes/[id]/vente-carte.tsx`, `vente-formulaire.tsx`
- Test : `scripts/test-ventes-echeancier.ts`, `scripts/test-ventes-synthese.ts`, `scripts/test-ventes-validation.ts` (existants, à adapter)

**Interfaces :**
- Produces : `Vente.maintenanceMois: number | null` (null = sans fin), `Vente.maintenanceArreteeLe: string | null` ; `echeancier(v: Vente, jusquAu: string): Echeance[]` ; `PREAVIS_MAINTENANCE_MOIS = 2` dans `offre.ts`. Supprimés : `ENGAGEMENT_MOIS`, `FIN_ENGAGEMENT_ALERTE_JOURS`, `finEngagement`, `LigneFin` et la liste des fins d'engagement de `syntheseVentes`.

- [ ] **Step 1 : tests en échec** :
  - `maintenance sans fin : une échéance par mois jusqu'à jusquAu inclus` (mise en ligne `2026-11-24`, `jusquAu = "2027-02-24"` → 4 échéances `Maintenance 1` à `4`, `total` vaut `null` affiché sans « /N ») ;
  - `maintenance arrêtée : rien après la date d'arrêt` (arrêt `2027-01-10` → échéances du 24/11 et du 24/12 seulement) ;
  - `maintenance limitée gardée pour les ventes existantes` (`maintenanceMois: 12`) ;
  - `validation : maintenanceMois absent → null` et `préavis : arrêt demandé le 2026-12-05 → arrêt effectif 2027-02-05` (`dateArretMaintenance(demandeLe: string): string`).
- [ ] **Step 2 : vérifier l'échec** : `npm test` → les nouveaux tests échouent.
- [ ] **Step 3 : implémenter** : `echeancier` prend `jusquAu` ; le rapprochement passe `aujourdhui`, la prévision de Finance passe `ajouterMois(aujourdhui, 6)`, la fiche passe la même chose que la prévision. `Echeance.total` devient `number | null` et `libelleEcheance` écrit `Maintenance 3` quand `total` est `null`. Le formulaire de vente remplace « Durée (mois) » par « Arrêt de la maintenance » (date facultative, pré-calculée à demande + 2 mois). La carte de vente remplace « Fin d'engagement » par « Sans engagement » ou « Arrêt le … ».
- [ ] **Step 4 : vérifier** : `npm test` passe, `npx tsc --noEmit` sans erreur, `grep -rn "ENGAGEMENT" src` ne renvoie rien.
- [ ] **Step 5 : commit** `Devis : maintenance sans engagement, préavis de 2 mois`.

### Task 3 : Calcul, numérotation et validation du devis (pur)

**Files :**
- Create : `src/lib/devis/calcul.ts`, `numero.ts`, `validation.ts`
- Test : `scripts/test-devis-calcul.ts`, `scripts/test-devis-numero.ts`

**Interfaces :**
- Consumes : types de la tâche 1, `PRIX_SITE_CENTIMES`, `MAINTENANCE_CENTIMES`, `OPTIONS`, `prixPropose` de `offre.ts`.
- Produces :
  - `lignesDevis(e: EntreeDevis): { libelle: string; detail: string[]; centimes: number }[]` (site, puis options, puis lignes libres ; `detail` = ce que comprend la formule, repris de la fiche offre)
  - `totalCentimes(e: EntreeDevis): number`
  - `maintenanceCentimes(e: EntreeDevis): number | null`
  - `echeancierDevis(e: EntreeDevis): { quand: string; centimes: number }[]` (textes relatifs : « À la signature », « Avant la mise en ligne », « Mois 2 »…)
  - `DELAI_JOURS_OUVRES: Record<Exclude<Formule,"sur_mesure">, number>` = `{ one_page: 5, essentiel: 7, pro: 10 }`, `RETOUCHES` = `{ one_page: 1, essentiel: 1, pro: 2 }`
  - `numeroDevis(prefixe: string, n: number, version: number): string`
  - `validerEntreeDevis(corps: unknown): { ok: true; entree: EntreeDevis } | { ok: false; erreur: string }`

- [ ] **Step 1 : tests en échec** :
  - `Essentiel en une fois avec automatisation` : total `139_900`, échéancier `[["À la signature", 69_950], ["Avant la mise en ligne", 69_950]]`, maintenance `9_000`.
  - `One page en 6 fois` : 5 × `11_650` puis `11_650` (total `69_900`), maintenance obligatoire `4_900` même si `maintenance: false` est envoyé (`validerEntreeDevis` refuse : « La maintenance est obligatoire en 6 fois »).
  - `Pro 2 200 € en 6 fois` : `[36_666 ×5, 36_670]`.
  - `sur mesure sans prix` : `validerEntreeDevis` refuse « Prix du site obligatoire en sur mesure ».
  - `numéro` : `numeroDevis("DEV-", 147, 1) === "DEV-0147"`, `numeroDevis("DEV-", 147, 2) === "DEV-0147-2"`.
  - `client incomplet` : raison sociale ou adresse vide → refus ; SIRET présent mais pas 14 chiffres → refus ; SIRET `null` accepté (ajouté plus tard).
  - `aucun texte de lignesDevis ne contient « engagement de 12 »` et la ligne maintenance contient « sans engagement, préavis de 2 mois ».
- [ ] **Step 2 : vérifier l'échec** : `npm test`.
- [ ] **Step 3 : implémenter** les fonctions. Le découpage en 6 réutilise la règle de `echeancier.ts` (dernier versement = reste).
- [ ] **Step 4 : vérifier** : `npm test` passe.
- [ ] **Step 5 : commit** `Devis : calcul, numérotation et validation`.

### Task 4 : Identité du client par l'annuaire public

**Files :**
- Create : `src/lib/devis/annuaire.ts`, `src/app/api/devis/annuaire/route.ts`
- Test : `scripts/test-devis-annuaire.ts`

**Interfaces :**
- Produces : `lireResultatsAnnuaire(json: unknown): { raisonSociale: string; adresse: string; siret: string; ville: string | null }[]` (pur) ; `chercherEntreprise(q: string): Promise<ReturnType<typeof lireResultatsAnnuaire>>` ; `GET /api/devis/annuaire?q=` (sous session).

- [ ] **Step 1 : test en échec** sur un extrait de réponse réelle de `https://recherche-entreprises.api.gouv.fr/search?q=…` enregistré dans le test (le récupérer une fois avec `curl` et garder 2 résultats) : nom, adresse du siège, SIRET du siège ; un résultat sans siège est ignoré ; JSON invalide → `[]`.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter** (`fetch` avec délai de 5 s, 5 résultats max, aucune clé), **Step 4 : `npm test` passe**.
- [ ] **Step 5 : commit** `Devis : recherche de l'entreprise dans l'annuaire public`.

### Task 5 : PDF du devis et CGV

**Files :**
- Create : `src/lib/devis/pdf.tsx`, `scripts/apercu-devis.ts` ; workspace : `livrables/offre/cgv-prestation.md`
- Modify : `package.json` (`@react-pdf/renderer`)
- Test : `scripts/test-devis-pdf.ts`

**Interfaces :**
- Consumes : `lignesDevis`, `totalCentimes`, `echeancierDevis`, `maintenanceCentimes` (tâche 3), `ReglagesDevis`.
- Produces : `genererPdfDevis(d: Devis, r: ReglagesDevis): Promise<Uint8Array>`.

- [ ] **Step 1 : rédiger `livrables/offre/cgv-prestation.md`** (dans le workspace) : périmètre et formule, séries de retouches, contenus fournis par le client et délai qui démarre à leur réception, contenus en retard (pause du projet à J+10 sans contenus), propriété du site jusqu'au paiement complet, paiement en une fois et en 6 fois, suspension en cas d'impayé, maintenance sans engagement avec préavis de 2 mois, transfert du site à l'arrêt, hébergement, responsabilité, droit applicable. Phrasé simple, au vouvoiement, sans formule creuse. **À faire valider par Edgar avant la tâche 12** ; son texte validé est collé dans `reglages_devis.cgv`.
- [ ] **Step 2 : test en échec** : `genererPdfDevis` sur un devis Essentiel en 6 fois renvoie des octets commençant par `%PDF-` ; le texte extrait du PDF (via le rendu en chaîne de la bibliothèque ou une recherche dans le flux non compressé, `compress: false` en test) contient le numéro, « TVA non applicable, article 293 B du CGI », « 40 € », « Bon pour accord », « sans engagement, préavis de 2 mois », et le titre des CGV.
- [ ] **Step 3 : vérifier l'échec**, **Step 4 : implémenter** : page 1 en-tête Kleak (émetteur, numéro, date, validité au JJ/MM/AAAA = date + 30 jours), client, tableau des lignes, total, paiement et échéancier, maintenance, conditions, zone « Bon pour accord » ; pages suivantes : CGV. Polices intégrées de la bibliothèque, pas de chargement réseau. `scripts/apercu-devis.ts` écrit un PDF d'exemple dans le dossier temporaire pour le contrôle visuel.
- [ ] **Step 5 : vérifier** : `npm test` passe ; ouvrir le PDF d'exemple et vérifier qu'il tient sur iPhone (A4 lisible zoomé) ; montrer une capture à Edgar.
- [ ] **Step 6 : commit** `Devis : PDF et CGV` (le fichier CGV est commité côté workspace, pas dans le hub).

### Task 5b : Suivi avis dans le catalogue, le devis et la vente

> Ajoutée le 22/10 (Ruling 10 du journal) : le Suivi avis à 190 €/mois a été décidé par Edgar le 22/10, après la spec. Source : `livrables/offre/fiche-offre.md` (section « Suivi avis ») et `livrables/offre/note-interne-offre.md` (section « Suivi avis »).

**Files :**
- Modify : `src/lib/offre.ts`, `src/lib/devis/types.ts`, `src/lib/devis/calcul.ts`, `src/lib/devis/validation.ts`, `src/lib/devis/contenu.ts`, `src/lib/ventes/types.ts`, `echeancier.ts`, `validation.ts`, `db.ts`, `src/app/(app)/comptes/[id]/vente-formulaire.tsx`, `vente-carte.tsx`, `supabase/devis.sql`
- Test : `scripts/test-devis-calcul.ts`, `scripts/test-devis-pdf.ts`, `scripts/test-ventes-echeancier.ts`, `scripts/test-ventes-validation.ts`

**Interfaces :**
- Produces :
  - `offre.ts` : `SUIVI_AVIS_CENTIMES = 19_000`, `SUIVI_AVIS_LIBELLE = "Suivi avis"`.
  - `type Suivi = "aucun" | "maintenance" | "suivi_avis"` dans `src/lib/devis/types.ts` ; `EntreeDevis.maintenance: boolean` est **remplacé** par `EntreeDevis.suivi: Suivi` (et `Devis` hérite).
  - `calcul.ts` : `maintenanceCentimes(e)` renvoie le montant mensuel de la maintenance de la formule quand `suivi !== "aucun"` (en 6 fois avec Suivi avis, c'est la maintenance qui s'applique pendant les versements), `null` sinon ; nouvelle `suiviAvisCentimes(e): number | null` (`19_000` si `suivi === "suivi_avis"`) ; nouvelle `ligneSuiviAvis(e)` (détail repris de la fiche offre : tout ce que comprend la maintenance Essentiel et Pro, demande d'avis prête à l'emploi, réponse à tous les avis, 2 à 4 publications par mois sur la fiche Google, bilan mensuel d'une page, sans engagement avec préavis de 2 mois).
  - `Vente.suiviAvisCentimes: number | null` (colonne `ventes.suivi_avis_centimes integer`, `> 0` si non nul) ; `devis.suivi text not null default 'maintenance' check in ('aucun','maintenance','suivi_avis')` remplace `devis.maintenance` dans `supabase/devis.sql` (le SQL n'a encore été exécuté nulle part : modifier la table directement).
  - `echeancier(v, jusquAu)` : une fois + Suivi avis → `Suivi avis N` à `suiviAvisCentimes` chaque mois dès la mise en ligne, pas de maintenance ; 6 fois + Suivi avis → `Maintenance N` à `maintenanceCentimes` du mois de la mise en ligne jusqu'au mois du 6e versement inclus, puis `Suivi avis N` à partir du mois suivant le 6e versement. `NatureEcheance` gagne `"suivi_avis"`.

- [ ] **Step 1 : tests en échec** :
  - `validerEntreeDevis` : 6 fois avec `suivi: "aucun"` refusé (« La maintenance est obligatoire en 6 fois ») ; 6 fois avec `suivi: "suivi_avis"` accepté ; `suivi` inconnu refusé.
  - `calcul` : Essentiel en une fois + Suivi avis → `maintenanceCentimes = 9_000`, `suiviAvisCentimes = 19_000` ; One page + Suivi avis → `suiviAvisCentimes = 19_000` (toutes formules) ; `ligneSuiviAvis` contient « 190 € », « 2 à 4 publications », « préavis de 2 mois », jamais « 12 mois ».
  - `contenuDevis` : une fois + Suivi avis → bloc « Suivi avis, 190 € par mois », pas de bloc maintenance ; 6 fois + Suivi avis → la maintenance de la formule pendant les 6 versements, puis « Le Suivi avis (190 € par mois) démarre le mois qui suit le dernier versement. » ; « aucun » en une fois → ni maintenance ni Suivi avis.
  - `echeancier` : Essentiel 6 fois signé le `2026-11-03`, mise en ligne `2026-11-24`, maintenance `9_000`, Suivi avis `19_000`, `jusquAu = "2027-07-31"` → maintenance les 24/11, 24/12, 24/01, 24/02, 24/03, 24/04 (le 6e versement tombe le 03/04/2027), puis Suivi avis les 24/05, 24/06, 24/07 ; une fois + Suivi avis → uniquement des `Suivi avis` dès le 24/11.
  - vente : `validerEntreeVente` accepte `suiviAvisCentimes` positif ou `null`, le refuse sans maintenance en 6 fois.
- [ ] **Step 2 : vérifier l'échec** : `npm test`.
- [ ] **Step 3 : implémenter.** Formulaire de vente : case « Suivi avis » avec le montant (prérempli à 190 €, modifiable : le prix pourra monter pour les nouveaux clients). Carte de vente : « Suivi avis, 190 € par mois » ou « Maintenance, 90 € par mois, puis Suivi avis après le dernier versement ».
- [ ] **Step 4 : vérifier** : `npm test` passe, `npx tsc --noEmit` sans erreur ; régénérer l'aperçu PDF d'un Essentiel 6 fois + Suivi avis et regarder la page 1.
- [ ] **Step 5 : commit** `Devis : Suivi avis dans le catalogue, le devis et la vente`.

### Task 6 : Devis en base, routes et éditeur sur la fiche

**Files :**
- Create : `src/lib/devis/db.ts`, `src/lib/devis/reglages.ts`, `src/app/api/devis/route.ts`, `src/app/api/devis/[id]/route.ts`, `src/app/api/devis/[id]/pdf/route.ts`, `src/app/(app)/comptes/[id]/devis-carte.tsx`, `devis-editeur.tsx`
- Modify : `src/app/(app)/comptes/[id]/page.tsx`
- Test : `scripts/test-devis-statuts.ts`

**Interfaces :**
- Produces :
  - `transitionDevis(de: StatutDevis, action: "preparer" | "envoyer" | "discuter" | "signer" | "refuser" | "remplacer"): StatutDevis | null` (pur)
  - `lireReglagesDevis(): Promise<ReglagesDevis>` ; `ecrireReglagesDevis(r: ReglagesDevis): Promise<void>`
  - `creerDevis(e: EntreeDevis): Promise<Devis>` (réserve le numéro : lit et incrémente `prochain_numero` dans une seule requête conditionnelle, réessaie en cas de conflit)
  - `nouvelleVersion(id: string): Promise<Devis>` (copie, `version + 1`, ancienne → `remplace`, relances annulées)
  - `modifierDevis(id: string, e: EntreeDevis): Promise<Devis>` (refus si statut ≠ `brouillon`)
  - `lireDevisDuCompte(compteId: string): Promise<Devis[]>` ; `lireDevis(id: string): Promise<Devis | null>`
  - `changerStatut(id: string, action): Promise<Devis>`
  - `enregistrerPdf(id: string, octets: Uint8Array, signe: boolean): Promise<string>` ; `lienPdf(path: string): Promise<string>` (lien signé 10 min)
  - Routes : `POST /api/devis` (créer), `PUT /api/devis/[id]` (modifier), `POST /api/devis/[id]` avec `{ action }` (statut, `nouvelle_version`), `GET /api/devis/[id]/pdf` (génère, stocke, redirige vers le lien signé).

- [ ] **Step 1 : tests en échec** de `transitionDevis` : `brouillon → preparer → prepare`, `prepare → envoyer → envoye`, `envoye → discuter → en_discussion`, `envoye|en_discussion → signer → signe`, `remplace → signer → null`, `signe → n'importe quoi → null`, `envoye → remplacer → remplace`.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter** `db.ts`, `reglages.ts` et les routes (sous session, corps validés par `validerEntreeDevis`).
- [ ] **Step 4 : éditeur** : carte « Devis » sur la fiche (liste des versions, statut, numéro, total, bouton « Voir le PDF »). Éditeur : formule, options, prix (prix catalogue rappelé), lignes libres, mode de paiement, maintenance (forcée en 6 fois), client avec recherche annuaire (tâche 4) qui enregistre aussi `raison_sociale`, `adresse`, `siret` sur le compte. Aperçu des totaux et de l'échéancier recalculé à chaque saisie avec les fonctions de la tâche 3. Bouton « Nouveau devis » vide (sans résumé). Un devis non `brouillon` est en lecture seule avec « Corriger (nouvelle version) ».
- [ ] **Step 4 bis : suppression** : si `src/app/api/comptes/[id]/route.ts` supprime un compte, supprimer d'abord ses fichiers du bucket `devis` (préfixe `<compteId>/`, chemins de stockage toujours de la forme `<compteId>/<devisId>/…`) ; les lignes partent par `on delete cascade`.
- [ ] **Step 5 : vérifier** : `npm test` passe ; en local (`npm run dev`, sans build), créer un devis Essentiel sur un compte de test, ouvrir le PDF, corriger en version 2, vérifier que la version 1 passe en « remplacé ».
- [ ] **Step 6 : commit** `Devis : devis en base et éditeur sur la fiche`.

### Task 7 : Connexion Google et brouillon Gmail

**Files :**
- Create : `src/lib/google/oauth.ts`, `mime.ts`, `gmail.ts`, `src/app/api/google/connexion/route.ts`, `src/app/api/google/retour/route.ts`, `src/app/api/devis/[id]/brouillon/route.ts`, `src/app/(app)/reglages/devis-google.tsx`
- Test : `scripts/test-google-mime.ts`

**Interfaces :**
- Produces :
  - `lienAutorisation(etat: string): string` (périmètre unique `https://www.googleapis.com/auth/gmail.compose`, `access_type=offline`, `prompt=consent`) ; `echangerCode(code: string): Promise<{ email: string; refreshToken: string }>` ; `jetonAcces(): Promise<string>` (rafraîchit depuis `google_connexion`, erreur claire « Google non connecté » sinon)
  - `construireMessage(m: { de: string; a: string; objet: string; texte: string; pieceJointe?: { nom: string; type: string; octets: Uint8Array } }): string` (RFC 822 encodé base64url, objet encodé RFC 2047, texte UTF-8)
  - `creerBrouillon(raw: string): Promise<{ draftId: string; threadId: string }>` ; `envoyer(raw: string, threadId?: string): Promise<{ id: string }>` ; `lienBrouillon(): string` (`https://mail.google.com/mail/u/0/#drafts`)
  - `POST /api/devis/[id]/brouillon` : génère le PDF (tâche 5), crée le brouillon, enregistre `gmail_draft_id` et `gmail_thread_id`, passe le devis en `prepare`.

- [ ] **Step 1 : tests en échec** de `construireMessage` : en-têtes `To`, `From`, `Subject` encodé (« Votre devis Kleak, Garnier Plomberie » avec accents), `MIME-Version`, une partie texte et une partie `application/pdf` nommée `Devis-DEV-0147.pdf` dont le contenu décodé est identique aux octets donnés ; sortie sans `+`, `/` ni `=` (base64url).
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter**. Le jeton d'actualisation est stocké dans `google_connexion`, jamais renvoyé au navigateur. `etat` est un jeton aléatoire gardé en cookie court et vérifié au retour. Réglages : carte « Connexion Google » (adresse connectée, bouton Connecter / Reconnecter).
- [ ] **Step 4 : vérifier la règle Google** : chercher dans la doc Google la durée de vie d'un jeton pour une appli « Production » non vérifiée avec un périmètre Gmail restreint, et l'écrire dans `livrables/process/reglages-devis.md` (tâche 12). Si le jeton expire au bout de 7 jours dans ce statut, l'afficher dans Réglages (« reconnexion à faire avant le JJ/MM ») et le signaler à Edgar.
- [ ] **Step 5 : vérifier en réel** : après les réglages Google d'Edgar, connecter `kleakagency@gmail.com`, préparer l'email d'un devis de test adressé à `kleakagency@gmail.com`, vérifier dans Gmail le brouillon, l'objet, le message et le PDF.
- [ ] **Step 6 : commit** `Devis : brouillon Gmail avec le PDF`.

### Task 8 : Devis signé, vente et factures Stripe

**Files :**
- Create : `src/lib/devis/stripe-plan.ts`, `stripe-ecriture.ts`, `src/app/api/devis/[id]/signe/route.ts`, `src/app/api/devis/[id]/facture/route.ts`, `src/app/(app)/comptes/[id]/devis-facture.tsx`
- Modify : `src/lib/ventes/db.ts` (lien `devis_id`), `src/app/api/cron/finance/route.ts` (étape `acompte_paye`)
- Test : `scripts/test-devis-stripe-plan.ts`

**Interfaces :**
- Consumes : `creerVente` (`src/lib/ventes/db.ts`), `echeancierDevis`, `maintenanceCentimes`, `changerStatut`, `enregistrerPdf`.
- Produces :
  - `venteDepuisDevis(d: Devis, signeLe: string): EntreeVente` (pur ; `miseEnLigneLe` = `signeLe` + `MISE_EN_LIGNE_DEFAUT_JOURS`, `maintenanceMois: null`)
  - `planFacture(d: Devis, etape: "acompte" | "solde" | "six_fois" | "maintenance"): { description: string; lignes: { libelle: string; centimes: number }[]; champs: { nom: "Devis n°"; valeur: string }[]; recurrence: null | { mois: number | null } }` (pur ; `six_fois` → récurrence `{ mois: 6 }` d'un sixième ; `maintenance` → `{ mois: null }`)
  - `interface EcritureStripe { trouverOuCreerClient(c: ClientDevis): Promise<string>; brouillonFacture(clientId: string, p: ReturnType<typeof planFacture>, cle: string): Promise<{ id: string }>; envoyerFacture(id: string): Promise<{ url: string }>; creerAbonnement(clientId: string, p: ReturnType<typeof planFacture>, cle: string): Promise<{ id: string; premiereFactureUrl: string | null }> }` et `ecritureStripe(): EcritureStripe` (clé `STRIPE_WRITE_KEY`, clés d'idempotence `cle` = `devis:<id>:<etape>`)
  - `POST /api/devis/[id]/signe` (multipart : PDF signé, date) ; `POST /api/devis/[id]/facture` avec `{ etape, action: "preparer" | "envoyer" }`.

- [ ] **Step 1 : tests en échec** de `planFacture` et `venteDepuisDevis` : acompte d'un Essentiel avec automatisation = une ligne `69_950` « Acompte 50 %, devis DEV-0147 » ; solde = `69_950` ; 6 fois d'un One page = récurrence 6 mois de `11_650` ; maintenance Pro = `9_000` sans fin ; chaque plan porte le champ `Devis n°` = numéro avec version ; `venteDepuisDevis` d'un devis en 6 fois a `maintenanceCentimes` non nul et `maintenanceMois: null`.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter** :
  - « Devis signé » : stocke le PDF signé, passe le devis en `signe` (refus si déjà signé : pas de seconde vente), crée la vente avec `devis_id`, crée ou retrouve le client Stripe (recherche par email, puis création avec raison sociale et adresse), enregistre `stripe_client_id` sur la vente, annule les relances.
  - Une fois : « Préparer la facture » crée le brouillon d'acompte dans Stripe (`collection_method: send_invoice`, échéance 7 jours) ; « Envoyer la facture » le finalise et l'envoie par Stripe.
  - 6 fois : rien n'est créé dans Stripe avant le clic (un abonnement émet sa première facture tout de suite). La fiche montre l'aperçu des 6 échéances ; « Envoyer la facture » crée l'abonnement limité à 6 mois avec `payment_behavior: default_incomplete` et l'enregistrement du moyen de paiement pour les prélèvements suivants. **À valider en mode test Stripe avant tout client réel** : premier paiement par la page Stripe, mandat SEPA enregistré, deuxième échéance prélevée sans action du client (horloge de test Stripe), fin après 6.
  - « Facturer le solde » et « Démarrer la maintenance » : boutons sur la fiche, même circuit.
  - Les doubles clics sont neutralisés par l'état du devis et les clés d'idempotence.
  - Cron Finance : après la synchronisation, un compte en `devis_envoye` dont la vente a sa première échéance payée passe en `acompte_paye`.
- [ ] **Step 4 : vérifier** : `npm test` passe ; en local avec une clé Stripe **de test** dans `STRIPE_WRITE_KEY`, dérouler une fois et 6 fois de bout en bout, payer avec la carte de test, vérifier que la facture payée apparaît dans la vente après la synchronisation Finance (lancée à la main).
- [ ] **Step 5 : commit** `Devis : devis signé, vente et factures Stripe`.

### Task 9 : Transcriptions et résumé

**Files :**
- Create : `src/lib/rdv/resume.ts`, `groq.ts`, `calcom.ts`, `db.ts`, `src/app/api/rdv/transcription/route.ts`, `src/app/api/rdv/[id]/route.ts`, `src/app/(app)/comptes/[id]/rdv-carte.tsx`
- Modify : `src/lib/crm/webhooks.ts` (`MEETING_ENDED`), `src/lib/crm/db.ts` (`appliquerEvenement`), `src/app/api/cron/relances/route.ts`
- Test : `scripts/test-rdv-resume.ts`, `scripts/test-crm-webhooks.ts` (existant ou à créer)

**Interfaces :**
- Produces :
  - `messagesResume(transcription: string): { role: "system" | "user"; content: string }[]` (pur ; consignes : français, rien d'inventé, `null` si non abordé, `"a_trancher"` si la formule n'est pas claire, citations exactes, `horsFormule` d'après la liste « Ce qui n'est pas compris » de la fiche offre recopiée dans le prompt, JSON seul)
  - `lireResume(json: unknown): ResumeRdv | null` (pur, validation stricte ; valeurs hors catalogue écartées)
  - `decouper(transcription: string, maxCaracteres: number): string[]` et `fusionnerResumes(r: ResumeRdv[]): ResumeRdv` (pur)
  - `resumer(transcription: string): Promise<{ ok: true; resume: ResumeRdv } | { ok: false; erreur: string }>` (Groq, `response_format: { type: "json_object" }`, modèle en constante `MODELE_GROQ`)
  - `transcriptionCal(bookingUid: string): Promise<string | null>` (API Cal.com v2, `GET /v2/bookings/{uid}/transcripts`, puis téléchargement du premier lien et conversion en texte « Interlocuteur : phrase »)
  - `traiterTranscription(id: string): Promise<void>` (récupère si `en_attente`, résume, notifie « Résumé du RDV prêt : <nom> »)
  - `reessayerTranscriptions(maintenant: Date): Promise<{ traitees: number; abandonnees: number }>` (abandon après 48 h : statut `introuvable`, notification)
  - Routes : `POST /api/rdv/transcription` (`{ compteId, texte }`, source `collee`) ; `PUT /api/rdv/[id]` (résumé corrigé par Edgar) ; `POST /api/rdv/[id]` `{ action: "reessayer" }`.

- [ ] **Step 1 : tests en échec** :
  - `lireResume` accepte un JSON complet ; remplace une formule inconnue par `"a_trancher"` ; écarte une option hors catalogue ; garde un point d'attention sans citation en refusant le point (citation obligatoire) ; renvoie `null` sur du texte non JSON.
  - `messagesResume` contient « n'invente rien » et la liste hors formule (« boutique en ligne », « espace client », « prise de rendez-vous en ligne », « traduction »).
  - `decouper` d'un texte de 50 000 caractères en morceaux ≤ `maxCaracteres` coupés sur une fin de réplique ; `fusionnerResumes` garde le premier champ non nul et concatène les points d'attention sans doublon.
  - `traduireCal` d'un payload `MEETING_ENDED` → type `rdv_termine`, `cle = cal:MEETING_ENDED:<uid>`.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter**. `MEETING_ENDED` crée une ligne `rdv_transcriptions` `en_attente` rattachée par `rdv_uid` (orpheline sinon, avec la notification « non rattaché » existante) et lance une première tentative avec `after()` de `next/server` (`maxDuration = 60`). Le cron quotidien appelle `reessayerTranscriptions`. Le constructeur vérifie les limites gratuites de Groq (jetons par minute du modèle choisi) et règle `maxCaracteres` pour rester dessous ; si le résumé échoue quand même, statut `erreur` avec le message, et la fiche propose « Réessayer ».
- [ ] **Step 4 : carte « RDV découverte » sur la fiche** : encadré « Points d'attention » en tête quand il y en a (type, texte, citation en italique, étiquette « hors formule »), puis les points courts de la spec 3.2 (« non abordé » en gris quand `null`), lien « Voir la transcription » (texte complet replié), bouton « Corriger le résumé », zone « Coller une transcription », état « Transcription en attente » avec « Réessayer ».
- [ ] **Step 5 : vérifier** : `npm test` passe ; en local, coller la transcription d'un faux appel (écrire un dialogue de 20 répliques où le prospect hésite sur le prix et demande une prise de RDV en ligne) : le résumé sort, la friction prix et la demande « hors formule » sont en tête avec leur citation.
- [ ] **Step 6 : commit** `Devis : transcription des RDV et résumé`.

### Task 10 : Devis prérempli depuis le résumé

**Files :**
- Create : `src/lib/devis/preremplir.ts`
- Modify : `src/app/(app)/comptes/[id]/rdv-carte.tsx`, `devis-editeur.tsx`
- Test : `scripts/test-devis-preremplir.ts`

**Interfaces :**
- Consumes : `ResumeRdv`, `PRIX_SITE_CENTIMES`, compte (`entreprise`, `email`, `raison_sociale`, `adresse`, `siret`).
- Produces : `preremplir(r: ResumeRdv, compte: { entreprise: string | null; email: string | null; raisonSociale: string | null; adresse: string | null; siret: string | null }): { entree: Partial<EntreeDevis>; aTrancher: string[] }`

- [ ] **Step 1 : tests en échec** : résumé Essentiel + automatisation + 6 fois → formule, prix `99_900`, options, mode, maintenance `true` ; formule `"a_trancher"` → pas de formule, `aTrancher` contient « Formule » ; paiement `null` → `une_fois` et `aTrancher` contient « Mode de paiement » ; identité absente du compte → `aTrancher` contient « Identité du client » ; `autresDemandes` ne deviennent jamais des lignes du devis.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter** ; bouton « Préparer le devis » sur la carte RDV, qui ouvre l'éditeur prérempli avec un bandeau « À trancher : … ».
- [ ] **Step 4 : `npm test` passe**, **Step 5 : commit** `Devis : devis prérempli depuis le résumé du RDV`.

### Task 11 : Relances après l'envoi du devis

**Files :**
- Create : `src/lib/devis/relances.ts`, `relances-db.ts`, `src/app/(app)/comptes/[id]/devis-relances.tsx`
- Modify : `src/app/api/devis/[id]/route.ts` (action `envoyer` = « Marquer envoyé »), `src/app/api/cron/relances/route.ts`
- Test : `scripts/test-devis-relances.ts`

**Interfaces :**
- Consumes : `prochainCreneau` (`src/lib/crm/calendrier.ts`), `construireMessage`, `envoyer` (tâche 7), `sendPush`, `changerEtapeManuel`.
- Produces :
  - `planifierRelances(envoyeLe: Date, jours: number[]): Date[]` (pur, chaque date ramenée dans le créneau 9 h à 19 h, lundi à samedi, Paris)
  - `peutRelancer(d: { statut: StatutDevis; relancesCoupees: boolean }, c: { etape: Etape; desinscritLe: string | null }): { ok: true } | { ok: false; raison: "statut" | "coupee" | "desinscrit" | "perdu" }` (pur ; seul `envoye` relance)
  - `lienWhatsapp(telephoneE164: string, texte: string): string` (pur, `https://wa.me/<chiffres>?text=<encodé>`)
  - `texteRelance(modele: string, v: { prenom: string; entreprise: string; numero: string }): string` (pur, remplace `{prenom}`, `{entreprise}`, `{numero}`)
  - `envoyerRelancesDevis(maintenant: Date): Promise<{ envoyees: number; annulees: number; echecs: number }>` ; `prevenirRelancesDuLendemain(maintenant: Date): Promise<number>`

- [ ] **Step 1 : tests en échec** :
  - envoi le vendredi 23/10/2026 à 18 h 30 Paris, jours `[3, 7]` → lundi 26/10 et vendredi 30/10, dans le créneau ; envoi un samedi à 20 h → J+3 tombe un mardi, ramené à 9 h ;
  - `peutRelancer` : `en_discussion` → `statut` ; `signe` → `statut` ; `relancesCoupees` → `coupee` ; compte `perdu` → `perdu` ; désinscrit → `desinscrit` ;
  - `lienWhatsapp("+33612345678", "Bonjour Thomas")` = `https://wa.me/33612345678?text=Bonjour%20Thomas` ;
  - `texteRelance` sans prénom connu → « Bonjour, » sans espace double.
- [ ] **Step 2 : vérifier l'échec**, **Step 3 : implémenter** :
  - « Marquer envoyé » : devis `envoye`, compte en `devis_envoye`, relances email planifiées, relances WhatsApp planifiées aux mêmes dates si le compte a un `telephone_normalise`.
  - Cron quotidien (8 h UTC, dans le créneau) : relances email dues envoyées par Gmail dans le fil du devis (`threadId`, objet « Re: <objet> »), une par devis et par passage ; WhatsApp dues → statut `proposee` et notification dont l'adresse est le lien `wa.me` ; puis notification « Relance du devis demain : <nom>. Couper ? » pour chaque relance email du lendemain, avec l'adresse de la fiche.
  - Après la dernière relance email, `prochaine_action` du compte = « Appeler <nom> », datée du lendemain.
  - Fiche : liste des relances (date, canal, statut), boutons « Couper les relances », « En discussion », « WhatsApp envoyé ».
  - Le constructeur vérifie qu'une réponse envoyée avec `threadId` apparaît bien dans le fil chez le destinataire (test vers une seconde adresse). Si le fil se casse chez le destinataire, ajouter le périmètre `gmail.metadata` pour lire l'en-tête `Message-ID` du devis envoyé et poser `In-Reply-To` / `References`, et le dire à Edgar (nouvelle autorisation Google).
- [ ] **Step 4 : vérifier** : `npm test` passe ; en local, marquer envoyé un devis de test, forcer la date de la relance à maintenant, appeler le cron à la main avec `CRON_SECRET`, vérifier l'email reçu dans le fil et la notification.
- [ ] **Step 5 : commit** `Devis : relances email et WhatsApp après envoi`.

### Task 12 : Réglages, livrables et recette de bout en bout

**Files :**
- Create : `src/app/(app)/reglages/devis-reglages.tsx` ; workspace : `livrables/process/reglages-devis.md`, `livrables/conformite/politique-confidentialite-ajouts-devis.md`
- Modify : `src/app/(app)/reglages/page.tsx`, `CLAUDE.md` du workspace (section Hub Agence, une ligne « Devis »), `context/HISTORY.md` via `/update`

**Interfaces :**
- Consumes : `lireReglagesDevis`, `ecrireReglagesDevis` (tâche 6), carte Google (tâche 7).

- [ ] **Step 1 : section « Devis » dans Réglages** : identité de l'émetteur, préfixe et prochain numéro (modifiable seulement tant qu'aucun devis n'existe, ensuite lecture seule), objet et message de l'email, textes des relances et leurs jours, message WhatsApp, CGV (texte long). Champs à 16 px minimum (iOS).
- [ ] **Step 2 : `livrables/process/reglages-devis.md`**, liste des réglages à faire par Edgar, dans l'ordre : Cal.com (type « Appel découverte » en Cal Video, transcription automatique non désactivable par l'invité, webhook `MEETING_ENDED` ajouté au webhook existant, phrase d'information dans la confirmation de RDV (« L'appel est transcrit pour préparer votre devis. »), clé API `CALCOM_API_KEY`, rappels veille et 1 h avant avec le lien) ; Stripe (clé restreinte `STRIPE_WRITE_KEY` avec seulement clients, factures, lignes de facture, produits et prix, abonnements en écriture ; mentions du pied de facture ; préfixe et premier numéro de facture, avec la méthode vérifiée dans Stripe) ; Google Cloud (écran de consentement, client OAuth Web, adresse de retour `/api/google/retour` en local et en production, statut de publication et durée du jeton vérifiés en tâche 7) ; variables Vercel ; SQL `supabase/devis.sql` (SQL complet recopié dans la conversation).
- [ ] **Step 3 : ajouts à la politique de confidentialité** (`livrables/conformite/politique-confidentialite-ajouts-devis.md`, même format que le fichier du 19/10) : transcription des appels par Cal.com, résumé par Groq (traitement hors UE), Stripe pour la facturation, relances par email et WhatsApp après un devis.
- [ ] **Step 4 : recette de bout en bout, en préproduction**, avec Edgar : appel Cal Video de 5 minutes (le test de la spec 3.1), résumé sur la fiche, devis prérempli, brouillon Gmail, marquer envoyé, relance forcée, devis signé (PDF quelconque), facture Stripe **en mode test**, paiement test, facture remontée dans la vente. Chronométrer « fin de l'appel → brouillon prêt » (cible : moins de 10 min, dont moins de 5 pour Edgar).
- [ ] **Step 5 : vérifier** : `npm test` et `npx tsc --noEmit` passent ; `npm run build` dans le worktree **sans serveur dev lancé** passe.
- [ ] **Step 6 : commit** `Devis : réglages et recette`, puis présenter la branche à Edgar pour fusion. Après fusion : passer `STRIPE_WRITE_KEY` en clé live, proposer la mise à jour de `CLAUDE.md` et de `context/` (nouveau module, décisions du 21/10).
