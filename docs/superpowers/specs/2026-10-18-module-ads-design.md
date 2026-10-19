# Module Ads du Hub Agence : conception

> Rédigée le 18 octobre 2026 avec Edgar. Complète `2026-10-18-crm-kleak-design.md`.
> Code dans le worktree `livrables/hub-agence-ads/`, branche `module-ads` (dépôt
> `Beepurst/hub-agence-kleak`), partie de `main` au commit `f121220`.

---

## 1. Intention

Kleak Agency trouve ses clients **uniquement par Meta Ads** (formulaire instantané, objectif
Prospects, 200 € par mois). Avant, Edgar faisait tout à la main : visuels dans Canva,
téléchargés, importés un par un dans le Gestionnaire de publicités, textes écrits à chaque
fois, campagne, ensemble de publicités et annonces créés à la main. **Tout était long et
redondant.**

Le module Ads fait trois choses depuis le hub :

1. **Ranger les créatives** (bibliothèque).
2. **Écrire les textes d'annonce avec une IA** qui voit le visuel.
3. **Envoyer une campagne complète dans Meta, en pause**, puis **suivre ses chiffres**,
   jusqu'au ROAS réel calculé avec le CRM.

### Ce qui serait un échec, même si tout fonctionne techniquement

- **Une campagne qui se met à diffuser toute seule** (dépense réelle sans validation d'Edgar).
- **Un texte qui sonne IA** ou qui contient un tiret à la place d'une virgule. Règle d'Edgar :
  « il ne faut surtout pas mettre de "-" pour les virgules, on met des vraies virgules ».
- **Un texte qui promet ce que l'offre ne contient pas** (prix, délai, affirmation invérifiable).
- **Un chiffre faux** sur la page de suivi, en particulier un ROAS ou un CPL à 0 qui veut dire
  « pas de donnée ».

### Hors de ce module, mais lié

**L'environnement de production de créas** (agent Claude Code dans `.claude/agents/`, chaîne
HTML vers PNG de `livrables/creas-meta/`) est un projet séparé, conçu et construit **avant**
ce module. Edgar fera produire ses visuels par Claude, plus par Canva. Le seul contrat entre
les deux : l'agent dépose ses rendus dans la bibliothèque du hub (voir 3.1).

---

## 2. Point de départ : le code du Hub Ecom

On **repart du code du Hub Ecom** (`livrables/hub/`, dépôt séparé, à copier, jamais à
modifier), décision d'Edgar :

| Fichier ecom | Ce qu'on reprend |
|---|---|
| `src/lib/meta-campaign.ts` | Création campagne, ensemble, image, créatif, annonce. Les **quatre verrous PAUSED** sont repris tels quels, avec leur test `scripts/test-meta-campaign.ts`. Gestion d'erreurs Meta, transparence DSA, `standard_enhancements` en OPT_OUT, garde SSRF sur les images |
| `src/app/(app)/creatives/` et `creatives-ads/` | Idées d'interface de bibliothèque et de formulaire de campagne |
| `src/app/(app)/meta-ads/`, `src/lib/meta-ads.ts` | Lecture des performances (insights) |

**Ce qui change par rapport à l'ecom :**

- **Objectif Prospects avec formulaire instantané**, pas ventes ni trafic. Campagne
  `OUTCOME_LEADS`, ensemble optimisé sur les leads, `promoted_object` = la Page, annonce avec
  `lead_gen_form_id` dans le créatif. Pas d'URL de destination ni d'UTM.
- **Le code ecom n'a jamais tourné en réel** (jeton `ads_read` seulement). Les charges utiles
  sont à valider contre l'API réelle sur le compte de Kleak.
- **Les générateurs IA ecom (Groq, Llama)** servent de base technique pour l'appel au modèle, pas pour le prompt (voir 3.2).

---

## 3. Les parties

### 3.1 Bibliothèque de créatives

- **Glisser-déposer de plusieurs fichiers** (PNG, JPG). Le hub lit les dimensions et range le
  format tout seul : carré 1:1, post 4:5, story 9:16.
- **Dépôt direct par l'agent créas** : une route d'import protégée par un secret (même
  principe que `SHEET_INTAKE_SECRET`) qui accepte un fichier et ses métadonnées (nom, angle,
  lien vers le rendu HTML source). L'agent n'a pas besoin de passer par Edgar.
- **Le carré 1:1** *(choix de Claude)* peut servir seul dans une annonce (tous placements).
  Si une créa existe en 4:5, le 4:5 est préféré au carré pour le feed.
- **Post et story d'une même créa sont liés** (même nom de base, ex. `b-7-jours-999-post` et
  `b-7-jours-999-story`). Une annonce utilise les deux si les deux existent (placements feed
  et story), sinon le seul format présent.
- Chaque créative garde : miniature, format, date, textes validés (voir 3.2), campagnes où
  elle a servi, et ses chiffres (repris de 3.4).
- Stockage Supabase Storage, bucket dédié aux créatives. La bibliothèque de **références**
  existante (captures de sites) reste séparée : ce n'est pas le même objet.

### 3.2 Agent IA de textes d'annonce

**Forme : un générateur, pas un chat.** Edgar a demandé « le plus optimisé » : le moins de
clics pour arriver à un texte publiable.

**Entrée** (Edgar) : la créative (le modèle **voit l'image**), le **ton** et **l'offre**.
- **Ton** : choisi d'un clic dans une liste de tons enregistrés dans le hub, chacun avec une
  courte description. Départ proposé : « direct et chiffré », « rassurant ». Edgar en ajoute.
- **Offre** : Essentiel 999 €, Pro 1 800 €, ou « Kleak en général ». Le contenu de chaque
  offre (prix, pages, délai, ce qui est inclus) vient de `livrables/offre/fiche-offre.md`,
  recopié dans le hub (table ou fichier de config) et **modifiable dans le hub**.

**Sortie** : **3 versions** d'un coup, chacune sur un angle différent (prix et délai,
tranquillité « on s'occupe de tout », preuve par les avis), chacune avec les trois champs
Meta : **texte principal, titre, description**. Champs modifiables en place. Chaque version
peut être **relancée seule avec une consigne courte** (« plus court », « commence par le
prix »).

**Modèle : `openai/gpt-oss-120b` via Groq, gratuit** (décision d'Edgar : ne pas payer pour le
moment ; modèle changé le 19/10, voir ci-dessous). Clé `GROQ_API_KEY` (nouvelle, offre gratuite
de Groq), à poser dans `.env.local` du hub et sur Vercel.
- **Pourquoi plus Llama (19/10/2026)** : Groq ne propose plus Llama 4 Scout et réserve ses Llama
  3.x à l'offre Enterprise ; de plus, la licence Llama 4 n'accorde pas certains droits aux
  entreprises basées dans l'UE. `gpt-oss-120b` est sous licence Apache 2.0, disponible en accès
  libre (1 000 requêtes par jour, largement assez).
- Il **ne voit pas l'image** : il écrit à partir du nom de la créa et des métadonnées déposées
  par l'agent créas (angle, accroche), et l'écran le signale (`ADS_TEXT_VOIT_IMAGE = false`).
- L'appel au modèle passe par une seule fonction, pour pouvoir passer à Claude plus tard en
  changeant une ligne de configuration.
- La qualité du français d'un modèle ouvert est moins bonne que celle de Claude : les garde-fous ci-dessous, vérifiés dans
  le code, comptent d'autant plus.

**Garde-fous, vérifiés dans le code, pas seulement demandés au modèle :**

- **Aucun tiret de ponctuation** : ni `—`, ni `–`, ni ` - ` entre deux mots. Si le texte
  produit en contient, il est régénéré (une fois), puis corrigé mécaniquement en virgule
  si besoin. Les tirets dans un mot composé (« sur-mesure », « clé-en-main ») restent permis.
- **Liste noire de tournures typées IA**, dans le prompt **et** vérifiée à la sortie :
  « Découvrez », « Boostez », « dans un monde où », « n'attendez plus », « Et si… ? » en
  ouverture, « transformez », « propulsez », emojis en rafale (plus de 2 par texte).
  La liste est modifiable dans le hub.
- **Exemples de ton** : le prompt contient des textes validés par Edgar. **On démarre sans
  exemple** (Edgar n'a plus les textes de ses anciennes pubs) : le ton repose au départ sur
  la description du ton choisi et la liste noire. **Chaque texte qu'Edgar valide (envoyé
  dans une campagne) rejoint les exemples.**
- **Interdits de contenu** (règles du 18/10) : pas de « 49 €/mois », pas de « N°1 des
  agences Framer », pas de « +50 % de clients ». Tout prix ou délai doit correspondre à
  l'offre choisie. **Avis clients** : seuls ceux enregistrés dans le hub peuvent être cités, mot pour
  mot, jamais inventés ni reformulés en citation. Au départ, un seul texte d'avis est
  connu, celui de Laura Dias (Mega Content) repris sur la créa B : « Un super prestataire
  pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci ».
  Les avis de Méliné Grelet et Aurore Melis sont réels mais leur texte n'est pas connu :
  l'IA peut citer leur nom seulement si Edgar ajoute le texte dans le hub. La note Google
  4,8/5 est citable. Le hub permet d'ajouter un avis (auteur, entreprise, texte).
- Limites de longueur Meta respectées (titre court, description courte), à fixer par le
  constructeur d'après la doc Meta.

### 3.3 Création de campagne (envoi en pause)

**Toujours en pause, jamais en brouillon** : l'API Meta n'expose pas les brouillons d'Ads
Manager. Les objets existent réellement sur le compte, sans diffuser ni dépenser. Edgar
relit dans le Gestionnaire et clique « Activer ». Les quatre verrous du code ecom sont
conservés.

**Structure** : 1 campagne, 1 ensemble de publicités, N annonces (une par créative). Meta
répartit le budget entre les annonces, ce qui donne la comparaison des visuels (test de 50 €).

**Ce qu'Edgar remplit :**
- les créatives (choisies dans la bibliothèque) et, pour chacune, la version de texte retenue ;
- le budget par jour ;
- le ciblage, **prérempli et modifiable** : France entière, 25 à 65 ans et plus, aucun centre
  d'intérêt (Edgar ne ciblait rien en particulier ; l'âge minimum de 25 ans est un choix de
  Claude) ; un champ libre pour viser une région si besoin ;
- **le formulaire instantané**, choisi dans une liste déroulante des formulaires existants de
  la Page (lus par l'API). Le hub **ne crée pas** de formulaire : il se crée une fois dans
  Meta, avec la question de budget et le consentement WhatsApp.
- le bouton d'appel à l'action (liste courte, défaut proposé par le constructeur).

**Ce que le hub règle seul** : objectif Prospects, nom de campagne daté
(par exemple `Kleak | <libellé> | AAAA-MM-JJ`, format exact au choix du constructeur),
payeur et bénéficiaire DSA = **« Kleak Agency »** (décision d'Edgar), statut en pause.

**Après l'envoi** : le hub affiche un lien direct vers la campagne dans le Gestionnaire, et
garde la trace de l'envoi (date, objets Meta créés, créatives et textes utilisés). Si Meta
refuse en cours de route, le hub dit à quelle étape, défait ce qu'il vient de créer
(comportement du code ecom, choix de Claude au moment du plan) et liste ce qui n'a pas pu
être supprimé. Un nouvel essai repart de zéro, sans demi-campagne laissée sur le compte.

### 3.4 Suivi des performances

**Chiffres voulus par Edgar** : dépenses, CPC, nombre de leads, CPL, ROAS. **Ajout de
Claude** : coût par rendez-vous.

**Deux niveaux** (Edgar : « les deux ») : tableau par campagne, chaque campagne se déplie
pour montrer ses annonces avec miniature et mêmes colonnes.

**Période** : 7 jours, 30 jours, mois en cours, dates libres.

| Chiffre | Source |
|---|---|
| Dépenses, CPC, leads, CPL | API Meta (insights), lus à l'ouverture de la page, bouton « Actualiser » |
| Coût par rendez-vous | Dépense Meta ÷ rendez-vous du CRM rattachés à la campagne ou à l'annonce (`comptes.ad_id`, `campaign_name`) |
| ROAS | CA signé dans le CRM rattaché à la campagne ou à l'annonce ÷ dépense Meta |

**ROAS** : le CRM n'enregistre pas encore le montant des contrats (phase 2, devis). D'ici
là, la colonne affiche « pas encore de vente », **jamais 0**. Même règle pour toute case
sans donnée : « indisponible », pas zéro (règle déjà appliquée dans le CRM).

**Dépense mensuelle du CRM** : la table `depenses_pub` (saisie à la main aujourd'hui) est
remplie automatiquement depuis Meta, par mois. *(Choix de Claude)* : une colonne `source`
(`manuel` ou `meta`) est ajoutée. Meta ne remplit et ne met à jour que les mois sans saisie ou
déjà en `meta` ; **une saisie manuelle n'est jamais écrasée**, et l'écran signale l'écart si
Meta donne un autre montant. La saisie manuelle reste possible en secours si Meta est
injoignable. Mécanisme (au chargement ou cron) laissé au constructeur.

**Périmètre de la dépense** *(choix de Claude)* : le compte publicitaire est celui de
l'ancienne agence et peut porter d'autres dépenses (boosts, anciens tests). Ne comptent que
les campagnes d'objectif `OUTCOME_LEADS` (et l'ancien équivalent `LEAD_GENERATION`). La page
de suivi affiche la règle en clair.

**Comptage sur une période** *(choix de Claude, cohérent avec le taux RDV du CRM)* : par
**date d'arrivée du lead**. Pour une période donnée : dépense Meta de la période, leads
arrivés dans la période, et parmi eux ceux qui ont pris un rendez-vous (un RDV reporté
compte une fois, un RDV annulé sans nouveau RDV ne compte pas), et le CA signé par ces
mêmes leads, quelle que soit la date de signature. Le constructeur aligne la définition sur
celle déjà utilisée par le « taux RDV » du CRM si elle diffère.

**Rattachement lead ↔ campagne** : par `ad_id` stocké dans `comptes`. Si les campagnes
créées par le hub et celles créées à la main coexistent, le rattachement par `ad_id`
fonctionne pour les deux.

---

## 4. Accès Meta (prérequis)

- Edgar est administrateur du Business Manager qui porte le compte publicitaire et la Page
  de Kleak, et a déjà une app Meta pour développeurs. **Jeton d'utilisateur système** du
  Business Manager (n'expire pas), porté par cette app. Le constructeur vérifie d'abord que
  les droits ci-dessous s'obtiennent en accès standard sur les actifs d'Edgar, sans
  validation d'app ; si une validation est nécessaire, il le dit avant de planifier les
  lots 3.3 et 3.4.
- Un jeton avec **`ads_management`** (création) et **`ads_read`** (suivi) sur le compte
  publicitaire de Kleak, plus les droits Page nécessaires pour lister les formulaires
  instantanés et publier des annonces au nom de la Page (`pages_show_list`,
  `pages_read_engagement`, `leads_retrieval` ou équivalent, à confirmer par le constructeur).
- Variables : jeton, ID du compte publicitaire, ID de la Page. Jamais affichées, jamais dans
  un fichier commité.
- **Validation réelle obligatoire** avant de considérer la création comme terminée : une
  campagne complète envoyée en pause sur le vrai compte, vérifiée dans le Gestionnaire, puis
  supprimée.

---

## 5. Ordre de livraison

**Prérequis** : le Hub Agence est mis en ligne sur Vercel (traité dans une autre
conversation, sur `main`) avant que ce module ne soit fusionné. La route de dépôt de l'agent
créas et le remplissage automatique supposent l'URL publique et les variables sur Vercel.

L'agent créas passe avant ce module. La **première campagne (visée vers le 25/10) se monte à
la main** dans le Gestionnaire : le module ne sera pas prêt et testé à temps.

Dans le module, ordre proposé par Claude :

1. **Bibliothèque** (sert dès que l'agent créas produit).
2. **Suivi des performances** (lecture seule, droits plus simples, utile dès que la première
   campagne manuelle tourne ; remplit `depenses_pub`).
3. **Agent de textes.**
4. **Création de campagne en pause.**

---

## 6. Hors périmètre

- Création ou modification de formulaires instantanés.
- Activation, mise en pause, modification de budget d'une campagne existante depuis le hub.
- Google Ads, posts organiques, autres réseaux.
- Génération d'images par l'IA (les visuels viennent de l'agent créas).
- Règles automatiques (couper une pub au-delà d'un CPL).

---

## 7. Laissé au constructeur

- Schéma des tables (créatives, textes, tons, offres, envois de campagne), en suivant les
  conventions du schéma existant (RLS activée sans policy, clé service role côté serveur).
- Placement dans la navigation du hub.
- Version de l'API Graph (le code ecom est en v21.0, à mettre à jour si dépréciée).
- Prompt et réglages du modèle, dans le respect de 3.2.
- Limites de longueur des champs Meta.

### À vérifier avant de construire

- Droits exacts du jeton pour lister les formulaires et créer des annonces de prospects.
- Forme exacte d'une annonce à formulaire instantané avec post 4:5 et story 9:16 dans le
  même créatif (personnalisation des placements).
