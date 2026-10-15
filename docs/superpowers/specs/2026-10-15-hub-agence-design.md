# Hub Agence : conception

> Spec validée en session le 15 octobre 2026. Prochaine étape : plan d'implémentation.

---

## 1. Intention

Un outil interne, pour un seul utilisateur (Edgar), qui sert l'agence de création de sites sur
deux métiers :

1. **La production des sites** : briefs clients et bibliothèque de références visuelles.
2. **Le pilotage commercial** : comptes (prospects et clients), projets, suivi des devis et des
   factures, trafic GA4 du site de l'agence.

Il se construit **en parallèle** de la production des sites clients et du démarchage, jamais à
leur place. Chaque lot doit être utilisable seul, ce qui permet de s'arrêter après n'importe
lequel.

**Critère de réussite** : après le lot 1, la démo Atelier Hauteville et les premiers rendez-vous
s'appuient sur la bibliothèque et les briefs du hub. Après le lot 2, un prospect remplit un
formulaire Tally et son brief apparaît dans le hub sans aucune ressaisie.

### Hypothèses posées

- Edgar est le seul utilisateur. Aucun client n'accède au hub.
- L'outil de production (Framer ou Webflow) n'est **pas tranché**. Il le sera à la fin de la
  démo. Le hub ne doit dépendre d'aucun des deux.
- Le site de l'agence n'existe pas encore. Analytics GA4 reste « non configuré » jusqu'à sa mise
  en ligne.
- Le trafic des sites clients relève d'Orbikal (reporting de la maintenance), pas du hub. Un
  projet porte seulement un lien vers son reporting Orbikal.

---

## 2. Socle et emplacement

**Base** : l'Orbikal Hub original, `jarvis-beepurst/livrables/interne/orbikal-hub` (Next.js 15,
React 19, Supabase, Tailwind 4, Vercel). Choisi plutôt que le Hub Ecom parce qu'il contient
encore Prospects, la to-do Notion et l'agenda du jour.

**L'original n'a pas de dépôt propre** : c'est un sous-dossier du dépôt `Beepurst/Orbikal`.

- **On copie les fichiers, on ne modifie jamais l'original.** Orbikal est en pause mais en ligne.
- Copie dans `livrables/hub-agence/`, **dépôt git indépendant** (`Beepurst/hub-agence`, nom à
  confirmer). Le dossier est ajouté au `.gitignore` de la racine du workspace et ne se commite
  jamais depuis la racine, comme `livrables/hub/`.
- **Nouveau projet Supabase, nouveau projet Vercel.** Aucune variable ne pointe vers Orbikal.
  `INTERNAL_APP_PASSWORD` et `INTERNAL_APP_SESSION_SECRET` sont regénérés.
- Ne pas copier `node_modules`, `.next`, `tsconfig.tsbuildinfo`, `.env*`, ni
  `plan-tiktok-carrousels.json`.

### Gardé tel quel

`auth.ts` (mot de passe, cookie HMAC-SHA256), `session-epoch.ts` (révocation de session),
middleware, `channels.tsx` et sidebar (navigation par groupes), `source-status.ts` (« non
configuré » au lieu de planter), PWA (manifest, service worker, icônes), `push.ts`,
`rate-limit.ts`, `format.ts`, `period.ts`, `duree.ts`, `safe-image-url.ts`, `supabase.ts`.

### Gardé et adapté

- `todo.ts`, `notion.ts`, `agenda.ts`, `reminders.ts` : pointent vers une page Notion « Agence ».
  L'agenda reçoit en plus les relances de comptes et les factures en retard.
- `prospects.ts` : devient la base de `comptes.ts` (voir section 3).
- `analytics.ts`, `analytics-scope.ts`, `search-console.ts`, `google-service-account.ts`,
  `traffic-source.ts` : pointent vers le site de l'agence.

### Retiré

Revenus Stripe et MRR, Clients et Support (propres au SaaS), Annonces, Emails produit,
Meta Ads, Google Ads, Créatives ads et orga, Publication et LinkedIn, Performances organiques,
Mailing Brevo, Connexions, assistant Mika, funnel, Groq. Ainsi que les tables SQL associées.

Le module de prospection sortante (`prospection_*`, `src/lib/prospection/`) est **retiré de la
V1** : il n'existe qu'à moitié dans l'original (schéma et lecture Sirene, aucune page). Il est
conservé dans l'original et pourra revenir dans un lot ultérieur.

**Règle de nettoyage** : après le retrait, aucune importation ne doit pointer vers un module
supprimé, et `npm run build` doit passer sans erreur.

---

## 3. Modèle de données

Toutes les tables : `id uuid` par défaut `gen_random_uuid()`, `created_at` et `updated_at`,
**RLS activée sans policy** (seule la clé serveur lit et écrit), comme dans l'original.

### `comptes`

Chaque entreprise ou contact, de prospect à client. Une seule table : un prospect qui signe ne
change pas de fiche.

| Champ | Type | Notes |
|---|---|---|
| `nom` | text, requis | nom du contact |
| `entreprise` | text | |
| `email` | text | unique quand renseigné, sert à rattacher un brief Tally |
| `telephone` | text | |
| `source` | text | `reseau`, `ancien_client`, `formulaire`, `prospection`, `autre` |
| `statut` | text, requis | `a_contacter`, `contacte`, `rdv`, `devis_envoye`, `client`, `perdu` |
| `prochaine_action` | text | |
| `prochaine_action_le` | date | alimente l'agenda du jour |
| `notes` | text | |

### `projets`

Un site vendu. Un compte peut en avoir plusieurs.

| Champ | Type | Notes |
|---|---|---|
| `compte_id` | uuid, requis | → `comptes` |
| `nom` | text, requis | |
| `type` | text | `vitrine`, `refonte`, `maintenance`, `autre` |
| `statut` | text, requis | `brief`, `maquette`, `production`, `recette`, `livre`, `maintenance` |
| `livraison_prevue_le` | date | |
| `url_preprod`, `url_prod` | text | |
| `url_reporting` | text | lien vers le reporting Orbikal du client |
| `outil` | text | `framer`, `webflow`, `autre`, ou nul tant que non tranché |

### `briefs`

| Champ | Type | Notes |
|---|---|---|
| `compte_id` | uuid, requis | → `comptes` |
| `projet_id` | uuid | → `projets`, facultatif |
| `source` | text, requis | `tally`, `manuel`, `formulaire_site` |
| `source_id` | text | identifiant de réponse Tally, **unique** avec `source` (anti-doublon) |
| `reponses` | jsonb | réponses structurées (entreprise, cible, objectifs, pages, contenus fournis, échéance, budget…) |
| `texte` | text | Markdown libre rédigé par Edgar |
| `brut` | jsonb | charge utile reçue, conservée telle quelle |
| `statut` | text, requis | `recu`, `complete`, `valide` |

### `devis` (suivi, pas génération)

| Champ | Type | Notes |
|---|---|---|
| `projet_id` | uuid, requis | → `projets` |
| `numero` | text | |
| `montant_ht` | numeric, requis | |
| `statut` | text, requis | `envoye`, `accepte`, `refuse`, `expire` |
| `envoye_le`, `valide_jusqu_au` | date | |
| `url_document` | text | lien vers le PDF |

### `factures` (suivi, pas génération)

| Champ | Type | Notes |
|---|---|---|
| `projet_id` | uuid, requis | → `projets` |
| `numero` | text | |
| `montant_ht`, `montant_ttc` | numeric, requis | |
| `recurrente` | boolean | maintenance |
| `statut` | text, requis | `emise`, `payee` |
| `emise_le`, `echeance_le`, `payee_le` | date | |
| `url_document` | text | lien vers l'outil de facturation |

« En retard » n'est **pas un statut stocké** : il se déduit (`statut = 'emise'` et
`echeance_le` dépassée). Un statut recopié à la main se périme en silence, même principe que
`source-status.ts`.

### `bibliotheque`

| Champ | Type | Notes |
|---|---|---|
| `titre` | text, requis | |
| `url_source` | text | site d'origine |
| `capture_path` | text | objet dans le bucket Supabase `bibliotheque` |
| `type_section` | text | `hero`, `navigation`, `services`, `temoignages`, `tarifs`, `faq`, `contact`, `footer`, `page_complete`, `autre` |
| `secteur` | text | |
| `tags` | text[] | style |
| `outil` | text | `aucun`, `framer`, `webflow` |
| `note` | text | |

### `brief_references`

| Champ | Type | Notes |
|---|---|---|
| `brief_id` | uuid, requis | → `briefs`, suppression en cascade |
| `reference_id` | uuid, requis | → `bibliotheque`, suppression en cascade |
| `commentaire` | text | « le client aime ce hero » |

Clé unique sur (`brief_id`, `reference_id`).

### Enchaînements

- **Brief Tally reçu** : compte retrouvé par email, sinon créé avec `source = 'formulaire'` et
  `statut = 'rdv'`. Brief créé en `recu`. Notification push.
- **Devis passé en `accepte`** : le compte passe en `client`. Le projet existe déjà (le devis y
  est rattaché), son statut n'est pas modifié automatiquement.
- **Agenda du jour** : to-do Notion + comptes dont `prochaine_action_le` est aujourd'hui ou
  passée + factures en retard + briefs en `recu`.

---

## 4. Pages

Navigation dans `channels.tsx` :

| Groupe | Pages |
|---|---|
| (sans titre) | Dashboard, To-do |
| Commercial | Comptes, Devis, Factures |
| Production | Projets, Briefs, Bibliothèque |
| Mesure | Analytics, SEO |

- **Dashboard** : CA encaissé du mois (factures `payee`), montant des devis `envoye`, comptes par
  statut, relances du jour, factures en retard, trafic GA4 (« non configuré » tant que le site
  n'existe pas). Une donnée absente n'est pas une donnée nulle : pas de jugement ni de couleur
  sans mesure.
- **Comptes** : liste filtrable par statut, badge « relance due ». La fiche montre projets,
  devis, factures et briefs du compte.
- **Projets** : vue par statut. La fiche rassemble brief, devis, factures et liens.
- **Briefs** : liste (à traiter en premier : `recu`). La fiche montre les réponses du client, la
  zone Markdown, et les références épinglées avec un sélecteur qui cherche dans la bibliothèque.
- **Bibliothèque** : galerie de captures, filtres par type de section, secteur, tags, outil.
  Ajout par URL + capture déposée à la main.
- **Devis**, **Factures** : listes avec totaux, statuts, liens vers les documents.

---

## 5. Réception Tally

Route `POST /api/intake/tally`, **seule route publique ajoutée**, ajoutée aux exemptions du
middleware.

1. Si `TALLY_SIGNING_SECRET` est absent : réponse 503 « non configuré », la page Briefs le
   signale. Rien ne plante.
2. Vérification de la signature (en-tête `Tally-Signature`, HMAC-SHA256 du corps brut, encodé en
   base64, comparaison à temps constant). Signature absente ou fausse : 401, rien n'est écrit.
3. Rate-limit de l'original appliqué.
4. Traduction de la charge utile en brief par un adaptateur dédié, dont la correspondance
   questions → champs vit dans un seul fichier.
5. Anti-doublon : (`source`, `source_id`) unique. Un second envoi de la même réponse renvoie 200
   sans rien créer.
6. Rattachement au compte, création du brief, notification push.

Les adaptateurs partagent une interface commune pour qu'un adaptateur « formulaire du site »
(Webflow ou Framer) s'ajoute plus tard sans toucher au reste.

**À vérifier dans la doc Tally avant d'implémenter** : le nom exact de l'en-tête de signature,
l'algorithme et l'encodage, la forme de la charge utile (`data.responseId`, `data.fields`).

---

## 6. Livraison par lots

| Lot | Contenu | Utilisable pour |
|---|---|---|
| 0 | Copie, nettoyage, nouveau dépôt, Supabase, Vercel, mot de passe | Un hub vide en ligne |
| 1 | Bibliothèque + Briefs (saisie manuelle) + références épinglées | Démo Atelier Hauteville, premiers rendez-vous |
| 2 | Réception Tally + push + rédaction du formulaire Tally et de sa mention RGPD | Envoyer un lien de brief aux prospects |
| 3 | Comptes + Projets + relances dans l'agenda | Le démarchage |
| 4 | Devis + Factures + Dashboard | Les chiffres |
| 5 | To-do Notion « Agence » + Analytics GA4 | Dès que le site de l'agence existe |

Le lot 1 a besoin d'un compte pour rattacher un brief : il crée la table `comptes` avec le
minimum (nom, entreprise, email). Les pages Comptes complètes arrivent au lot 3.

### Ce qu'Edgar seul peut faire

- Lot 0 : vérifier sa place sur l'offre gratuite Supabase (limite à confirmer sur son compte ;
  mettre en pause le Supabase du Hub Ecom libère une place), créer le projet Supabase, le dépôt
  GitHub, le projet Vercel.
- Lot 2 : créer le formulaire Tally à partir des questions rédigées, y renseigner l'URL du
  webhook et le secret de signature.
- Lot 5 : créer la page Notion « Agence », la propriété GA4 du site de l'agence.

---

## 7. Tests et vérification

- **Tests automatisés** (lanceur de tests de Node, comme `test:campagne` dans l'original) là où
  une erreur coûte cher : vérification de signature Tally (bonne, fausse, absente),
  correspondance des champs, anti-doublon au second envoi, rattachement ou création du compte
  par email, déduction « facture en retard ».
- **Vérification réelle à chaque lot** avant de le déclarer fini : `npm run build`, déploiement,
  pages ouvertes en ligne. Pour Tally, un vrai envoi du formulaire.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne (même `.next`).

---

## 8. Conformité

- Mention d'information RGPD sur le formulaire Tally : responsable, finalité, durée de
  conservation, exercice des droits.
- Données client uniquement dans Supabase, RLS activée sans policy.
- Le hub ne génère aucune facture : il suit des montants et des statuts, et pointe vers l'outil
  de facturation qui porte les obligations de la facturation électronique.

---

## 9. Hors V1

Génération de devis ou de factures, prospection sortante, formulaire du site de l'agence, capture
automatique des URL de la bibliothèque, accès client, publication sur les réseaux sociaux,
assistant Mika.
