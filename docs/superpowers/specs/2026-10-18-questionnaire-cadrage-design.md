# Questionnaire de cadrage client : conception

> Rédigée le 18 octobre 2026 à partir du cahier des charges d'Edgar. Fait partie du CRM Kleak
> (`2026-10-18-crm-kleak-design.md`), phase 2 « Vente ». S'appuie sur le Hub Agence existant
> (`livrables/hub-agence/`, spec `2026-10-15-hub-agence-design.md`).

**Sources de vérité, à lire en entier avant de construire :**

- Questions, types, règles et textes : `livrables/process/questionnaire-cadrage.md`. Les clés des
  questions sont les clés stockées, **sans renommage**.
- Visuels : `livrables/process/questionnaire-visuels/*.png` (1200 × 800), à copier dans
  `public/questionnaire/`. Le nom de fichier donne la valeur stockée : `ambiance-artisan.png`
  correspond à `ambiance = artisan`. Le dossier `_sources/` n'est pas copié.

---

## 1. Intention

Après acceptation du devis, Edgar envoie au client un lien vers un questionnaire. Le client y
décrit son activité et ses goûts, et y dépose ses contenus (logo, photos, textes, infos
légales). Objectif : **que chaque site sorte juste en 2 ou 3 allers-retours**. Le délai de
livraison démarre quand le questionnaire est envoyé **avec tous les contenus obligatoires**.

C'est la première chose que le client voit de l'agence après sa signature : la page doit être
soignée, rassurante, et pensée d'abord pour le téléphone.

### Ce qui serait un échec

- Un client qui perd ses réponses (onglet fermé, réseau coupé).
- Un lien qui donne accès à autre chose que le questionnaire de son projet.
- Un envoi accepté alors qu'il manque un contenu obligatoire, sans que le projet soit signalé.
- Un brief en double quand le client revient compléter.

---

## 2. Modèle de données

### Évolutions de l'existant

- **`projets`** : ajout de `formule text check (formule in ('essentiel', 'pro'))`. Nul tant que
  la formule n'est pas connue ; le questionnaire ne peut pas être généré sans formule.
- **`briefs`** : la contrainte de `source` accepte en plus `questionnaire`. Un brief issu du
  questionnaire porte `source = 'questionnaire'`, `source_id = <id du questionnaire>`,
  `compte_id` et `projet_id` du projet, `reponses` = réponses par clé du document, `statut`
  initial `recu`. L'index unique existant (`source`, `source_id`) garantit **un seul brief par
  questionnaire** : un renvoi met à jour le même brief.
- Les briefs saisis à la main gardent leurs propres champs (`BRIEF_CHAMPS`). La fiche du brief
  choisit son affichage selon `source`.

### Nouvelles tables

**`questionnaires`** (un par projet)

| Champ | Type | Notes |
|---|---|---|
| `projet_id` | uuid, requis, **unique** | → `projets`, suppression en cascade |
| `jeton` | text, requis, unique | 32 octets aléatoires (`crypto.randomBytes(32)`), en base64url. Stocké en clair pour qu'Edgar puisse recopier le lien à tout moment (la base n'est lisible que par la clé serveur) |
| `actif` | boolean, défaut true | désactivé : le lien répond « lien inactif » |
| `formule` | text, requis | copiée du projet à la génération, figée ensuite |
| `reponses` | jsonb, défaut `{}` | brouillon enregistré en continu |
| `plus_tard` | text[] | clés cochées « je l'envoie plus tard » |
| `etape` | smallint | dernière étape atteinte, pour la reprise |
| `ouvert_le` | timestamptz | première ouverture du lien |
| `envoye_le` | timestamptz | dernier envoi |
| `brief_id` | uuid | → `briefs`, après le premier envoi |

**`questionnaire_fichiers`**

| Champ | Type | Notes |
|---|---|---|
| `questionnaire_id` | uuid, requis | suppression en cascade |
| `cle` | text, requis | `logo`, `charte`, `photos`, `textes`, ou chemin dans une liste : `realisations.2.photos`, `equipe.0.photo` |
| `chemin` | text, requis, unique | `<projet_id>/<cle>/<uuid>.<ext>` dans le bucket privé `questionnaires` |
| `nom_origine` | text | affiché au client et à Edgar, jamais utilisé pour construire le chemin |
| `type`, `taille` | text, bigint | relevés **sur l'objet stocké**, pas sur la déclaration du navigateur |
| `statut` | text | `en_attente` (URL d'envoi délivrée), `ok` (vérifié) |

Bucket **privé** `questionnaires`, avec `file_size_limit` à 20 Mo et la liste des types
autorisés.

### Statut affiché à Edgar (calculé, jamais stocké)

- **Non envoyé** : lien jamais ouvert.
- **En cours** : ouvert, pas encore envoyé.
- **Envoyé complet** : envoyé, aucun contenu obligatoire manquant.
- **Envoyé avec contenus manquants** : envoyé avec au moins une clé obligatoire en « plus
  tard ».
- **Inactif** : lien désactivé.

---

## 3. Le schéma des questions

Une **définition unique en code** (`src/lib/questionnaire/schema.ts`), transcrite du document :
pour chaque question, clé, libellé, aide, type, options, formules, règle d'obligation, règle
d'affichage conditionnel, contraintes (longueur maximale, nombre de lignes, nombre de choix,
types et tailles de fichiers). L'écran client, la validation serveur et l'affichage dans le
Hub lisent tous cette définition.

Règles à traduire fidèlement du document :

- Une question sans `E` n'est ni affichée ni acceptée en Essentiel.
- Conditions : `validateur_nom` si « Une autre personne », `action_autre` si « Autre »,
  `pages_autre` si « Autre » coché, `couleurs_codes` si charte, `palette` si palette,
  `photos` si « Je les envoie », `textes` si « Je les fournis », `realisations` si la page
  Réalisations est choisie, `domaine` si « J'en ai déjà un ». Une réponse à une question masquée
  par sa condition est ignorée à l'envoi.
- `pages` : affichage fixe « Accueil, Services, Contact » en Essentiel ; en Pro, exactement 5
  choix.
- `sites_aimes` : 1 ligne en Essentiel (facultative), 1 à 3 en Pro (au moins 1).
- `ambiance` : 1 ou 2 choix ; « Je vous fais confiance » est exclusif.
- « Plus tard » : `logo` (sauf si `logo_absent` est coché), `photos`, `textes`, `realisations`.
- `rgpd` obligatoire.

**Fichiers** (types vérifiés par extension **et** par type relevé sur l'objet) :

| Clé | Types | Limites |
|---|---|---|
| `logo` | SVG, PDF, AI, EPS, PNG | 1 à 3 fichiers, 20 Mo |
| `charte` | PDF | 20 Mo |
| `photos` | JPG, PNG, HEIC | jusqu'à 30, 20 Mo chacun |
| `textes` | DOCX, PDF, TXT, ou texte saisi | 20 Mo |
| photos de `realisations` et `equipe` | JPG, PNG, HEIC | 20 Mo |

Le SVG est stocké tel quel dans un bucket **privé** et n'est jamais affiché directement par le
navigateur depuis le Hub (téléchargement seulement), pour écarter tout script embarqué.

---

## 4. Routes

### Publiques (exemptées du mot de passe dans le middleware)

Toutes passent par une seule fonction qui résout le jeton : jeton inconnu ou désactivé, même
réponse « lien invalide ou inactif » (aucune différence observable). Le jeton ne donne accès
qu'au questionnaire de son projet. Rate-limit par adresse IP et par jeton (fonction existante
`consume_rate_limit`).

| Route | Rôle |
|---|---|
| `GET /q/[jeton]` | La page du questionnaire |
| `GET /api/q/[jeton]` | Formule, réponses enregistrées, valeurs pré-remplies depuis le compte (nom de l'entreprise, nom, email, téléphone), fichiers déjà envoyés, étape |
| `PATCH /api/q/[jeton]` | Enregistrement automatique : une ou plusieurs clés. Chaque clé est validée par le schéma (type, formule, contraintes) ; une clé inconnue ou hors formule est refusée. Les champs incomplets sont acceptés en brouillon |
| `POST /api/q/[jeton]/envoyer` | Validation complète (obligations, conditions, `rgpd`), création ou mise à jour du brief, notification push, horodatage |
| `POST /api/q/[jeton]/fichiers` | Demande d'envoi : clé, nom, type, taille déclarés. Vérification contre le schéma, création de la ligne `en_attente`, retour d'une **URL d'envoi signée** Supabase pour ce seul chemin |
| `POST /api/q/[jeton]/fichiers/[id]/confirmer` | Après l'envoi : lecture des métadonnées de l'objet stocké (taille, type). Conforme : `ok`. Non conforme : objet et ligne supprimés, erreur claire |
| `DELETE /api/q/[jeton]/fichiers/[id]` | Le client retire un de ses fichiers (objet et ligne) |

L'envoi direct vers Supabase contourne le plafond de 4,5 Mo des fonctions Vercel, nécessaire
pour des photos de 20 Mo.

### Privées (derrière le mot de passe)

| Route | Rôle |
|---|---|
| `POST /api/projets/[id]/questionnaire` | Crée le questionnaire, ou régénère le jeton (l'ancien lien cesse de marcher) |
| `PATCH /api/projets/[id]/questionnaire` | Active ou désactive le lien |
| `GET /api/briefs/[id]/fichiers/[fichierId]` | Lien de téléchargement signé, de courte durée |

---

## 5. Écrans

### Côté client : `/q/[jeton]`

- **Pensé d'abord pour le téléphone** : champs à 16 px minimum (évite le zoom automatique
  d'iOS), zones de clic de 44 px minimum, une colonne, lisible en plein soleil.
- **Écran d'intro** repris du document, avec le prénom du contact.
- **7 étapes** avec barre de progression, boutons Précédent et Suivant. On peut avancer sans
  avoir tout rempli ; les manques sont signalés à l'envoi.
- **Enregistrement automatique** à chaque changement (avec un court délai pour regrouper la
  frappe), et un indicateur discret « enregistré ». En cas d'échec réseau, la saisie reste à
  l'écran et l'enregistrement est retenté. Reprise à la dernière étape avec le même lien.
- **Choix en images** : cartes cliquables avec les PNG, plus une carte « Je vous fais
  confiance » sans image.
- **Fichiers** : barre de progression par fichier, liste des fichiers déjà envoyés avec
  suppression, case « je l'envoie plus tard » sur les contenus concernés.
- **Mention RGPD** en bas de la dernière étape, case obligatoire.
- **Écran de fin** repris du document : « 7 » jours ouvrés en Essentiel, « 10 » en Pro. Il
  rappelle qu'on peut revenir ajouter des contenus.
- Identité visuelle propre à Kleak Agency (claire, sobre), distincte du thème sombre du Hub.
- Lien invalide ou inactif : une page simple qui invite à contacter l'agence.

### Côté Hub

- **Fiche d'un projet** (minimale si la page Projets complète n'existe pas encore) : bouton
  « Questionnaire client » ; une fois créé : le lien avec bouton Copier, Régénérer, Désactiver ou
  Réactiver, et le statut.
- **Fiche du brief** de source `questionnaire` : réponses regroupées par étape, lisibles, avec
  les visuels choisis en vignettes, les fichiers téléchargeables, et **les manques en évidence**
  (contenus « plus tard », obligatoires vides).
- **Accueil, actions du jour** : un questionnaire reçu, ou reçu avec des manques, y apparaît.

---

## 6. Hors périmètre (lots suivants)

- Relances automatiques du client à J+2 et J+5 pour les contenus manquants.
- Envoi du lien par email depuis le Hub.
- Export du brief vers l'outil de production.

---

## 7. Test de bout en bout réel (critère de fin)

Contre le vrai Supabase, sur un projet de test :

1. Génération du lien depuis la fiche projet.
2. Remplissage partiel, fermeture de l'onglet, reprise avec le même lien : tout est là.
3. Dépôt d'un fichier réel, visible côté client, puis suppression et nouveau dépôt.
4. Dépôt refusé : mauvais type, fichier trop lourd. Aucun objet ne reste dans le bucket.
5. Envoi avec un contenu « plus tard » : brief créé, projet signalé « contenus manquants ».
6. Retour sur le lien, ajout du contenu, renvoi : **le même brief** est mis à jour, statut
   « complet ».
7. Le brief apparaît dans le Hub avec réponses, visuels et fichiers téléchargeables.
8. Essentiel : les questions Pro n'apparaissent pas, et une clé Pro envoyée à la main est
   refusée par le serveur.
9. Jeton invalide, puis jeton désactivé : même page « lien invalide ou inactif », aucune donnée
   renvoyée.
10. Affichage vérifié sur un téléphone réel.

---

## 8. Prérequis et articulation avec le CRM

- **Construit après le cœur du CRM** (phase 1) : il réutilise l'historique d'événements du
  client et le bloc « actions du jour » de l'accueil, créés par le cœur. Le questionnaire y
  écrit ses événements : lien créé, premier accès, envoi, renvoi, lien désactivé ou régénéré.
- **Le Hub doit être en ligne** (Vercel, déjà requis par le cœur pour recevoir les webhooks).
  Le test de bout en bout se fait sur le déploiement, pas en local : le plafond de 4,5 Mo de
  Vercel et l'affichage sur téléphone ne se vérifient qu'en ligne.
- **Évolutions de schéma** : un fichier SQL dédié, rejouable sans casse, exécuté par Edgar dans
  le SQL Editor de Supabase avant le déploiement, comme `schema.sql`.
- **URL du lien** : construite à partir d'une variable `PUBLIC_BASE_URL` (domaine du Hub en
  ligne). Sans elle, la génération du lien affiche « non configuré ».
- **Email de l'agence dans la mention RGPD** : variable `AGENCE_EMAIL`. Sans elle, le
  questionnaire ne peut pas être généré (« non configuré »), pour qu'aucun client ne reçoive
  une mention incomplète.

## 9. Choix de Claude, à vérifier par Edgar

- **Création du projet** : ce lot ajoute une création minimale de projet depuis un compte, avec
  choix de la formule. Plus tard, l'acceptation du devis créera le projet et sa formule toute
  seule. La formule reste modifiable tant qu'aucun questionnaire n'existe ; ensuite elle est
  figée sur le questionnaire (pour en changer : régénérer le questionnaire).
- **Renvoi après travail d'Edgar** : un renvoi remplace les réponses du client mais ne touche
  jamais aux notes d'Edgar (`texte`) ni au statut qu'il a posé. Le brief reçoit une étiquette
  « mis à jour par le client le … », une notification push part, et l'action réapparaît dans
  les actions du jour.
- **Vérification des fichiers** : extension, plus lecture des premiers octets du fichier à la
  confirmation (signature de format : PNG, JPEG, PDF, ZIP pour DOCX, HEIC, EPS, texte pour SVG
  et TXT ; AI est accepté comme PDF ou EPS). Le type déclaré par le navigateur seul ne suffit
  pas, puisque Supabase ne fait que le recopier.
- **Prénom de l'écran d'intro** : premier mot du nom du contact ; « Bienvenue » seul si le nom
  est vide.
- Jeton stocké en clair (pour recopier le lien à tout moment) plutôt que haché.


