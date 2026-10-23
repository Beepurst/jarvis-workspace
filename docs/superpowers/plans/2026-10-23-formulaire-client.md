# Formulaire client : plan de construction

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** le client remplit lui-même, par un lien unique, la partie du questionnaire de cadrage que lui seul connaît. Edgar envoie ce lien en un geste par WhatsApp (ou par email Brevo), et les relances par email partent seules, sans relance inutile.

**Architecture :**
- Logique en fonctions pures testées dans `src/lib/` : écrans et ce qui manque, règles de relance, jeton.
- Une couche base de données `src/lib/formulaire-db.ts`.
- Des routes publiques `/api/formulaire/[jeton]/…` exemptées du mot de passe du hub, une page publique `/formulaire/[jeton]`.
- Côté hub : un bloc « Lien client » dans le panneau Questionnaire de la fiche brief.
- Les relances se branchent dans le cron existant `/api/cron/relances`.

**Tech Stack :** Next.js 15 (App Router), React 19, Supabase (Postgres et Storage, URL d'envoi signées), Brevo (modèles), web-push, tests `node --test` (`scripts/test-*.ts`).

**Spec :** `docs/superpowers/specs/2026-10-23-formulaire-client-design.md`, avec sa partie « Précisions après relecture », qui fait foi. Les modules du brief de production sont décrits dans `docs/superpowers/specs/2026-10-22-brief-production-design.md`.

**Dépôt :** `livrables/hub-agence/`, dépôt `Beepurst/hub-agence-kleak`. Travailler dans un worktree `livrables/hub-agence-formulaire` (branche `formulaire-client`). Fusion dans `main` après validation d'Edgar.

## Global Constraints

- Les clés des réponses viennent de `src/lib/questionnaire.ts`. L'obligation d'une question se lit toujours par `questionsPour`, jamais par `.obligatoire` de `QUESTIONNAIRE`.
- Clés jamais montrées au client (remplies depuis l'appel) : `activite`, `services`, `client_ideal`, `differences`, `action_principale`, `action_autre`, `questions_clients`, `pages`, `pages_autre`, `sections_souhaitees`.
- Le client n'écrit que les clés de ses 4 écrans (liste blanche), toujours par `fusionnerReponses`, champ par champ, et la dernière écriture gagne.
- Jeton :
  - 32 octets aléatoires, en base64url dans l'URL ;
  - stocké deux fois : l'empreinte SHA-256 (recherche, comparée en temps constant) et le jeton chiffré en AES-256-GCM avec la clé serveur `FORMULAIRE_CLE` (32 octets en base64, dans `.env.local` et Vercel), pour renvoyer le même lien dans les relances ;
  - « Recréer » invalide l'ancien lien, « Désactiver » le coupe ;
  - expiration à la validation de l'étape Maquette.
- Fichiers :
  - bucket privé `briefs-client`, chemin `<brief_id>/<cle>/<uuid>-<nom nettoyé>` ;
  - 20 Mo par fichier, 30 photos, 300 Mo par brief ;
  - SVG, AI et EPS seulement en téléchargement signé, jamais affichés ;
  - envoi par URL signée Supabase, le serveur vérifiant jeton, type, taille et plafond avant de signer.
- Relances : par email Brevo, 2 au plus.
  - **Conditions, toutes requises :**
    - lien envoyé ;
    - « ce qui manque » non vide ;
    - aucun enregistrement depuis 48 h ;
    - case « En contact » décochée ;
    - jour de semaine (lundi à vendredi, sans jours fériés) ;
    - étape Maquette non validée.
  - **Délais :** première relance 2 jours ouvrés après l'envoi du lien ; seconde 3 jours ouvrés après la première.
  - **Fin :** 3 jours ouvrés après la seconde sans réponse, une alerte push « appeler <client> », une seule fois.
- Brevo : modèles par identifiant, paramètres `prenom`, `lien`, `manquants` (HTML simple). Variables `BREVO_TEMPLATE_FORMULAIRE_LIEN` et `BREVO_TEMPLATE_FORMULAIRE_RELANCE`. Brevo non configuré → bouton email désactivé avec la raison, et aucune relance.
- Page publique :
  - `lang="fr"`, champs à 16 px au moins, zones de clic de 44 px, contraste vérifié ;
  - couleurs par variables CSS ;
  - textes en français sans tiret long ni formules typées IA.
- Couleurs dans `src/app/theme.css` (tests `test-couleurs` et `test-contraste`). Tout composant du hub qui enregistre appelle `router.refresh()`.
- Ne jamais lancer `npm run build` pendant un serveur de dev. SQL exécuté par Edgar, recopié en entier dans la conversation.
- La base Supabase est celle de la production : toute donnée de test est créée puis supprimée, avec ses fichiers.

## Review Focus

1. **Un jeton faux, désactivé, recréé ou expiré** (Maquette validée) donne 404, sans rien révéler. À tester en tâche 3 (lib jeton) et à vérifier en tâche 5 (routes).
2. **Une écriture du client sur une clé de l'appel** (`activite`, `pages`…) est ignorée, même forgée à la main. À tester en tâche 1 (`filtrerReponsesClient`).
3. **Une relance le samedi, ou 1 jour après une saisie du client**, ne part pas. À tester en tâche 2.
4. **Un 31e fichier photo, un fichier de 25 Mo, ou un `.html` déguisé** sont refusés avant la signature. À tester en tâche 1 (`verifierFichier`).
5. **Le client qui revient après validation du questionnaire** ne peut ajouter que les contenus encore attendus. À tester en tâche 1 (`etatFormulaire`, `filtrerReponsesClient`).

---

### Task 1 : Écrans, liste blanche et ce qui manque

**Files :** Create `src/lib/formulaire-client.ts`, `scripts/test-formulaire-client.ts`.

**Interfaces :**
- Consumes : `questionsPour`, `FormuleQ`, `Reponses`, `Question`, `QUESTIONNAIRE` (tâche du brief, `src/lib/questionnaire.ts`).
- Produces :
  - `CLES_APPEL: readonly string[]` (liste des Global Constraints) ;
  - `ECRANS: { titre: string; cles: string[] }[]` : les 4 écrans de la spec, dans l'ordre, avec les clés exactes de la partie « Les 4 écrans » ;
  - `questionsEcran(f: FormuleQ, brief: Reponses, i: 0|1|2|3): Question[]` (conditions évaluées sur le brief entier ; une condition sur une clé de `CLES_APPEL` encore vide masque la question) ;
  - `type EtatFormulaire = "ouvert" | "contenus_seulement" | "ferme"` ;
  - `etatFormulaire(p: Production): EtatFormulaire` (questionnaire validé → `contenus_seulement` ; maquette validée → `ferme`) ;
  - `CLES_CONTENUS_TARDIFS = ["logo", "photos", "textes", "realisations"]` ;
  - `filtrerReponsesClient(f: FormuleQ, etat: EtatFormulaire, maj: unknown): Reponses` (garde seulement les clés autorisées des écrans selon l'état ; `contenus_seulement` → seulement `CLES_CONTENUS_TARDIFS` ; `ferme` → `{}`) ;
  - `interface FichierRecu { cle: string; taille: number }` ;
  - `ceQuiManque(f: FormuleQ, brief: Reponses, fichiers: FichierRecu[]): { cle: string; label: string }[]` (obligatoires des 4 écrans encore vides, plus les contenus « plus tard » sans fichier ni texte) ;
  - `manquantsHtml(m: { label: string }[]): string` (`<ul><li>…</li></ul>`, échappé) ;
  - `verifierFichier(args: { cle: string; nom: string; type: string; taille: number; existants: FichierRecu[] }): { ok: true } | { ok: false; raison: string }` ;
  - `normaliserTel(s: string): { international: string | null; mobile: boolean }` ;
  - `lienWhatsApp(international: string, message: string): string`.

- [ ] **Step 1 : écrire les tests :**
  - **`ECRANS` et liste blanche :**
    - `ECRANS` ne contient aucune clé de `CLES_APPEL` ;
    - toute clé de `ECRANS` existe dans `QUESTIONNAIRE`.
  - **`questionsEcran` :**
    - `questionsEcran("pro", { pages: ["Réalisations"] }, 2)` contient `realisations` ;
    - avec `{}`, elle ne la contient pas.
  - **`filtrerReponsesClient` :**
    - `filtrerReponsesClient("essentiel", "ouvert", { activite: "x", zone: "Osny" })` donne `{ zone: "Osny" }` ;
    - en `contenus_seulement`, `{ zone: "Osny", logo: "recu" }` donne `{ logo: "recu" }` ;
    - en `ferme`, elle donne `{}`.
  - **`ceQuiManque` :**
    - avec `photos_source` « Je les envoie », `photos: "plus_tard"` et aucun fichier `photos`, la liste contient `photos` ;
    - avec un fichier `photos`, elle ne le contient plus ;
    - une clé de l'appel vide n'apparaît jamais.
  - **`verifierFichier` :**
    - refuse 25 Mo, une 31e photo, plus de 300 Mo cumulés, et `page.html` en `text/html` ;
    - accepte `logo.svg` pour `logo` ;
    - refuse `photo.svg` pour `photos`.
  - **`normaliserTel` :**
    - `"06 12 34 56 78"` donne `{ international: "+33612345678", mobile: true }` ;
    - `"01 99 00 42 17"` donne `mobile: false` ;
    - `"+44 7700 900123"` donne `mobile: true`.
  - **`lienWhatsApp` :** encode le message (`https://wa.me/33612345678?text=...`).
  - **`manquantsHtml` :** échappe `<script>`.
- [ ] **Step 2 :** `node --import ./scripts/alias-hook.mjs --test scripts/test-formulaire-client.ts`. Attendu : FAIL.
- [ ] **Step 3 :** écrire `src/lib/formulaire-client.ts`. Types de fichiers par clé :
  - `logo` : svg, pdf, ai, eps, png, jpg, webp ;
  - `charte` : pdf ;
  - `photos` et `realisations` : jpg, jpeg, png, heic, webp ;
  - `textes` : docx, pdf, txt.
- [ ] **Step 4 :** relancer. Attendu : PASS.
- [ ] **Step 5 : commit** `Formulaire : écrans, liste blanche et ce qui manque`.

### Task 2 : Règles de relance

**Files :** Create `src/lib/formulaire-relances.ts`, `scripts/test-formulaire-relances.ts`.

**Interfaces :**
- Produces :
  - `estJourOuvre(d: Date): boolean` (heure de Paris) ;
  - `ajouterJoursOuvres(d: Date, n: number): Date` ;
  - `interface EtatRelance { lienEnvoyeLe: string | null; derniereActiviteLe: string | null; enContact: boolean; maquetteValidee: boolean; relances: { le: string }[]; finAlerteeLe: string | null; nbManquants: number }` ;
  - `decisionRelance(e: EtatRelance, maintenant: Date): { action: "rien" | "relance" | "alerte_fin"; numero?: 1 | 2; raison: string }`.

- [ ] **Step 1 : écrire les tests** (dates fixes en heure de Paris) :
  - lien non envoyé → `rien` ;
  - `nbManquants: 0` → `rien` ;
  - `enContact` → `rien` ;
  - `maquetteValidee` → `rien` ;
  - un samedi → `rien` ;
  - activité il y a 24 h → `rien` ;
  - lien envoyé un lundi, rien depuis, jeudi suivant → `relance` 1 ;
  - lien envoyé un vendredi, mardi suivant → `relance` 1 (2 jours ouvrés : lundi, mardi) ;
  - relance 1 un lundi, mercredi → `rien` ; jeudi → `relance` 2 ;
  - 2 relances, 3 jours ouvrés après la seconde → `alerte_fin` ;
  - `finAlerteeLe` renseigné → `rien` ;
  - jamais de 3e relance.
- [ ] **Step 2 :** FAIL attendu. **Step 3 :** implémenter. **Step 4 :** PASS. **Step 5 : commit** `Formulaire : règles de relance`.

### Task 3 : Jeton

**Files :** Create `src/lib/formulaire-jeton.ts`, `scripts/test-formulaire-jeton.ts`.

**Interfaces :**
- Produces :
  - `genererJeton(): { jeton: string; empreinte: string }` (base64url, 32 octets ; empreinte SHA-256 en hex) ;
  - `empreinteJeton(jeton: string): string | null` (`null` si le format est invalide) ;
  - `memeEmpreinte(a: string, b: string): boolean` (temps constant) ;
  - `chiffrerJeton(jeton: string, cle: string): string` et `dechiffrerJeton(chiffre: string, cle: string): string | null` (AES-256-GCM, `null` si altéré).

- [ ] **Step 1 : tests :**
  - deux jetons diffèrent ;
  - `empreinteJeton(jeton) === empreinte` ;
  - `empreinteJeton("../x")` → `null` ;
  - `memeEmpreinte` faux pour des longueurs différentes ;
  - `dechiffrerJeton(chiffrerJeton(j, cle), cle) === j` ;
  - un chiffré altéré ou une autre clé → `null`.
- [ ] **Step 2 à 4 :** FAIL, implémenter avec `node:crypto`, PASS.
- [ ] **Step 5 : commit** `Formulaire : jeton du lien client`.

### Task 4 : Base et couche de données

**Files :**
- Create `supabase/formulaire-client.sql`
- Create `src/lib/formulaire-db.ts`
- Create `scripts/test-formulaire-db.ts`

**SQL :**
```sql
create table if not exists brief_formulaires (
  brief_id uuid primary key references briefs(id) on delete cascade,
  jeton_empreinte text,
  jeton_chiffre text,
  actif boolean not null default false,
  cree_le timestamptz,
  envoye_whatsapp_le timestamptz,
  envoye_email_le timestamptz,
  envoye_client_le timestamptz,
  derniere_activite_le timestamptz,
  en_contact boolean not null default false,
  relances jsonb not null default '[]'::jsonb,
  fin_alertee_le timestamptz
);
create unique index if not exists brief_formulaires_jeton on brief_formulaires (jeton_empreinte) where jeton_empreinte is not null;
create table if not exists brief_fichiers (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs(id) on delete cascade,
  cle text not null,
  chemin text not null unique,
  nom text not null,
  type text not null,
  taille bigint not null,
  confirme boolean not null default false,
  created_at timestamptz not null default now()
);
insert into storage.buckets (id, name, public) values ('briefs-client', 'briefs-client', false) on conflict (id) do nothing;
```

**Interfaces :**
- Consumes : tâches 1 à 3, `lireProduction`, `marquerEnCours` (`src/lib/brief-etapes.ts`), `fusionnerReponses`.
- Produces (toutes lèvent une `Error` sur une erreur base, sauf mention) :
  - `ouvrirParJeton(jeton: string): Promise<null | { briefId; formule: FormuleQ | null; reponses: Reponses; etat: EtatFormulaire; entreprise: string; prenom: string | null }>` (`null` si le jeton est invalide, inactif ou la maquette validée) ;
  - `enregistrerClient(briefId, maj: unknown): Promise<Reponses>` (`filtrerReponsesClient`, puis `fusionnerReponses` sur la ligne relue, `derniere_activite_le = now`, `marquerEnCours(questionnaire)`) ;
  - `envoyerClient(briefId): Promise<void>` (`envoye_client_le`, push « <entreprise> a envoyé son questionnaire », lien vers `/briefs/<id>`) ;
  - `signerEnvoi(briefId, args: { cle; nom; type; taille }): Promise<{ ok: true; id; url; token } | { ok: false; raison }>` (`verifierFichier` sur les fichiers confirmés, ligne `brief_fichiers` `confirme = false`, `createSignedUploadUrl`) ;
  - `confirmerFichier(briefId, id)` ;
  - `retirerFichier(briefId, id)` (supprime l'objet et la ligne) ;
  - `listerFichiers(briefId, { signerLecture: boolean })` (miniatures signées 10 min pour les images affichables, jamais pour svg, ai et eps) ;
  - `creerLien(briefId): Promise<{ jeton }>` (nouveau jeton, empreinte et chiffré, `actif = true`) ;
  - `lienActuel(briefId): Promise<string | null>` (déchiffre le jeton actif, `null` si aucun) ;
  - `desactiverLien(briefId)` ;
  - `noterEnvoi(briefId, canal: "whatsapp" | "email")` ;
  - `marquerEnContact(briefId, v: boolean)` ;
  - `lireSuivi(briefId)` (état complet pour la fiche brief : lien actif, dates d'envoi, relances, en contact, fichiers, `ceQuiManque`).

- [ ] **Step 1 :** écrire le SQL. Le donner à Edgar plus tard, à l'étape 7.
- [ ] **Step 2 : tests purs** sur les aides internes extraites, par exemple `cheminFichier(briefId, cle, nom)` :
  - nettoie le nom (pas de `/`, pas de `..`) ;
  - garde l'extension en minuscules ;
  - préfixe par un uuid.
- [ ] **Step 3 :** écrire `src/lib/formulaire-db.ts` (client Supabase serveur existant `getSupabaseClient`).
- [ ] **Step 4 :** `npx tsc --noEmit` et le test. Attendu : propre, PASS.
- [ ] **Step 5 : commit** `Formulaire : base et couche de données`.
- [ ] **Step 6 : arrêt contrôleur.** Demander à Edgar d'exécuter `supabase/formulaire-client.sql` (SQL complet recopié), puis vérifier en lecture que la table et le bucket existent.

### Task 5 : Page publique et routes du client

**Files :**
- Modify `src/middleware.ts` : ajouter `formulaire` et `api/formulaire` aux exemptions du matcher, avec un commentaire.
- Create `src/app/formulaire/[jeton]/page.tsx` (serveur : `ouvrirParJeton`, sinon page « Lien invalide ou expiré »).
- Create `src/app/formulaire/[jeton]/formulaire-client.tsx` (client : 4 écrans, barre de progression, enregistrement automatique avec un délai de 800 ms après la dernière frappe et à la sortie d'un champ, indicateur « Enregistré », envoi de fichiers, écran de fin).
- Create les routes :
  - `src/app/api/formulaire/[jeton]/route.ts` (GET : état et réponses filtrées aux écrans ; PATCH : `enregistrerClient`) ;
  - `src/app/api/formulaire/[jeton]/envoyer/route.ts` (POST) ;
  - `src/app/api/formulaire/[jeton]/fichiers/route.ts` (GET : liste ; POST : `signerEnvoi`) ;
  - `src/app/api/formulaire/[jeton]/fichiers/[id]/route.ts` (PATCH : confirmer ; DELETE : retirer).
- Create `src/app/formulaire/layout.tsx` : page sans la navigation du hub, `lang="fr"`, logo Kleak, aux couleurs Kleak.

**Interfaces :** tâches 1 et 4.

- [ ] **Step 1 :** routes. Chaque route :
  - appelle `ouvrirParJeton`, puis renvoie 404 `{ error: "Lien invalide ou expiré." }` si `null` ;
  - applique `consumeRateLimit("formulaire:" + empreinte, 120, 600)` (envoi de fichiers : 40 par 10 min), puis 429 avec `retryAfterSeconds`.
- [ ] **Step 2 :** page et écrans :
  - les `choix_image` affichent les visuels de `livrables/process/questionnaire-visuels/`, copiés dans `public/questionnaire/` (même nom de fichier) ;
  - « Je vous fais confiance » sur les questions de goût, « Je l'envoie plus tard » sur les contenus ;
  - les maxima de l'aide sont appliqués ;
  - en `contenus_seulement`, seuls les contenus tardifs restent modifiables.
- [ ] **Step 3 :** écran de fin. Il reprend le texte du questionnaire de cadrage, avec le délai de la formule (One page 5, Essentiel 7, Pro 10 jours ouvrés, voir `src/lib/offre.ts`) et la liste de `ceQuiManque`.
- [ ] **Step 4 : vérification** avec `npx next dev -p 3021` dans le worktree :
  - un compte et un brief « TEST formulaire (à supprimer) » ;
  - un lien créé avec `creerLien`, en script ;
  - le parcours sur téléphone (Playwright 390 px) : remplir, recharger la page (rien de perdu), envoyer une photo et un logo SVG, envoyer le formulaire ;
  - captures `formulaire-390.png` et `formulaire-1440.png` ;
  - une clé de l'appel forgée à la main dans un PATCH est vérifiée ignorée ;
  - un jeton faux donne 404 ;
  - **tout supprimer ensuite**, fichiers compris.
- [ ] **Step 5 :** arrêter le serveur, `npm run build`, `npm test`.
- [ ] **Step 6 : commit** `Formulaire : page publique du client`.

### Task 6 : Bloc « Lien client » dans la fiche brief et routes du hub

**Files :**
- Create `src/app/api/briefs/[id]/formulaire/route.ts` (GET : `lireSuivi` ; POST `{ action: "creer" | "desactiver" | "whatsapp" | "email" | "en_contact", valeur?, telephone? }`)
- Create `src/app/api/briefs/[id]/fichiers/[fid]/route.ts` (GET : redirection vers une URL de téléchargement signée de 5 min, protégée par la session du hub)
- Create `src/app/(app)/briefs/[id]/bloc-lien-client.tsx`
- Modify `src/app/(app)/briefs/[id]/panneau-questionnaire.tsx` (y insérer le bloc et la liste des fichiers reçus)
- Modify `src/lib/source-status.ts` (`formulaireBrevoConfigure()` : Brevo configuré plus les deux identifiants de modèle)
- Modify `src/app/api/agent/briefs/route.ts` (GET `?id=` renvoie aussi `lireSuivi`)

**Interfaces :** tâches 1, 3 et 4. `envoyerModele` de `src/lib/crm/brevo.ts`.

- [ ] **Step 1 :** route du hub.
  - `creer` renvoie le lien complet `https://<hôte>/formulaire/<jeton>`, affiché une fois avec un bouton Copier. « Recréer » demande une confirmation.
  - `whatsapp` :
    - normalise le téléphone (`telephone` fourni, sinon `contact_tel` du brief ou du compte) ;
    - refuse un fixe (raison « Numéro fixe : envoie le lien par email ou saisis un mobile. ») ;
    - renvoie l'URL `lienWhatsApp(...)` et appelle `noterEnvoi`.
  - `email` : `envoyerModele` avec le modèle lien et `contact_email`, puis `noterEnvoi`. Refus avec raison si Brevo ou le modèle n'est pas configuré.
- [ ] **Step 2 :** « Envoyer par WhatsApp » et « Envoyer par email » réutilisent le lien actif (`lienActuel`), ou en créent un s'il n'y en a pas. Seul « Recréer » change le lien, avec confirmation (« L'ancien lien ne marchera plus. »).
- [ ] **Step 3 :** le bloc affiche :
  - l'état du lien (jamais envoyé, envoyé par WhatsApp le …, par email le …) ;
  - les boutons WhatsApp et Email, puis Désactiver ;
  - la case « En contact avec le client » ;
  - les relances envoyées (date et ce qui manquait) ;
  - « ce qui manque » ;
  - les fichiers reçus (nom, taille, Télécharger).

  `router.refresh()` après chaque action.
- [ ] **Step 4 :** message WhatsApp, à soumettre à Edgar dans le rapport : « Bonjour <prénom>, c'est Edgar de Kleak. Voici le questionnaire pour votre site, 10 minutes suffisent et vous pouvez le reprendre plus tard : <lien> ».
- [ ] **Step 5 : vérification** avec le même brief de test que la tâche 5 :
  - le bouton WhatsApp ouvre la bonne URL (vérifier l'URL produite, sans envoyer de message) ;
  - la case « En contact » s'enregistre ;
  - les fichiers sont téléchargeables ;
  - **tout supprimer ensuite**.

  Puis `npm run build` et `npm test`.
- [ ] **Step 6 : commit** `Formulaire : lien client dans la fiche brief`.

### Task 7 : Relances dans le cron

**Files :**
- Create `src/lib/formulaire-cron.ts` : `relancerFormulaires(maintenant: Date): Promise<{ relances: number; alertes: number; erreurs: string[] }>`
- Modify `src/app/api/cron/relances/route.ts` (appeler `relancerFormulaires` après `envoyerDus`, et fusionner les deux résultats dans la réponse)
- Create `livrables/process/modeles-brevo-formulaire.md` (racine du workspace) : texte des deux modèles Brevo (objet, corps, paramètres `{{ params.prenom }}`, `{{ params.lien }}`, `{{ params.manquants }}`)

**Interfaces :** tâches 1, 2 et 4, `sendPush`.

- [ ] **Step 1 : tests.** Extraire la construction de l'`EtatRelance` d'un brief en fonction pure `etatRelancePour(ligne, production, nbManquants)`, testée.
- [ ] **Step 2 :** `relancerFormulaires`. Pour chaque lien actif avec un envoi noté, calculer `ceQuiManque` et `decisionRelance`.
  - Sur `relance` : `envoyerModele` (modèle relance, lien `lienActuel`, `manquantsHtml`), puis ajout de `{ le, numero, manquants }` à `relances`. Sans `FORMULAIRE_CLE` ou sans lien déchiffrable : pas de relance, erreur notée.
  - Sur `alerte_fin` : `sendPush({ title: "Questionnaire sans réponse", body: "Appeler <entreprise>", url: "/briefs/<id>", tag: "formulaire-<id>" })` et `fin_alertee_le`.
  - Une erreur sur un brief ne bloque pas les autres.
- [ ] **Step 3 :** rédiger `modeles-brevo-formulaire.md`, sobre, sans formules typées IA. Le soumettre à Edgar dans le rapport.
- [ ] **Step 4 :** `npx tsc --noEmit`, `npm test`, puis commit (hub et racine séparés) `Formulaire : relances automatiques`.

### Task 8 : Documentation et livraison

**Files (racine du workspace) :** `CLAUDE.md` (partie Hub Agence : ligne « Formulaire client »), `.claude/commands/site.md` si besoin, `livrables/process/questionnaire-cadrage.md` (note en tête : la partie client est remplie par la page `/formulaire/<jeton>`, la partie appel par Edgar ou Claude).

- [ ] **Step 1 :** écrire et committer à la racine.
- [ ] **Step 2 :** pousser la branche `formulaire-client`, puis donner l'aperçu Vercel (vérifié par `githubCommitRef`). **Ne pas fusionner.**
- [ ] **Step 3 : arrêt contrôleur.** Générer `FORMULAIRE_CLE` (écrite dans les `.env.local` sans l'afficher, posée dans Vercel avec Edgar), puis demander à Edgar :
  - de créer les 2 modèles dans Brevo à partir de `modeles-brevo-formulaire.md` ;
  - de poser `BREVO_TEMPLATE_FORMULAIRE_LIEN` et `BREVO_TEMPLATE_FORMULAIRE_RELANCE` dans `.env.local` et dans Vercel, avec lui.
