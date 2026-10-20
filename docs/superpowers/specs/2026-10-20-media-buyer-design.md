# Agent media buyer et module Ads renforcé : conception

> 20/10/2026. Conçu avec Edgar. Suite du module Ads (`2026-10-18-module-ads-design.md`, plan
> `../plans/2026-10-18-module-ads.md`), dont les Tâches 1 à 12 sont faites et la Tâche 13
> (validation réelle) presque finie : la création d'une campagne en pause depuis le hub a été
> validée en réel le 20/10 sur le compte « Kleak Pub ».

## Pourquoi

Meta Ads est le canal d'acquisition numéro 1, et pour l'instant le seul, de Kleak Agency. Edgar
ne veut « rien laisser au hasard » et refuse un travail bâclé. Aujourd'hui :

- chaque pub part avec un seul texte principal, un seul titre, une seule description ;
- le hub suit dépense, clics, CPL, RDV, coût par RDV et ROAS, mais pas de quoi diagnostiquer
  (impressions, CTR, CPM, fréquence) ni la qualité des leads par pub ;
- aucune règle écrite ne dit quand couper, garder ou monter le budget ;
- rien ne prévient Edgar quand une campagne déraille.

Le but : un **agent media buyer** qui raisonne comme un media buyer expert, à partir de données
complètes, de règles écrites et d'un journal des tests, et un hub qui lui fournit ces données,
envoie plusieurs textes par pub et alerte Edgar sur son téléphone.

**Contrainte de fond** : budget de 200 € par mois (environ 6,60 € par jour). Les volumes seront
faibles (de l'ordre de quelques dizaines de leads par mois). Tout ce qui suit doit rester
juste avec peu de données : pas de conclusion sur 3 leads, pas de dispersion du budget sur trop
de variantes.

## Objectifs

1. Un agent Claude Code `media-buyer` qui :
   - prépare chaque campagne (structure, budget, créas, jusqu'à 5 textes principaux, 5 titres et
     5 descriptions par pub) et dépose ses textes dans le hub ;
   - fait des bilans : diagnostic chiffré, puis liste d'actions qu'Edgar exécute lui-même ;
   - tient le journal des tests et s'appuie sur des règles de décision écrites ;
   - passe ses commandes à l'agent `createur-creas`.
2. Le hub collecte toutes les données nécessaires (Meta complet, détail par texte et par titre,
   qualité des leads du CRM) et les expose à l'agent.
3. L'écran de création de campagne envoie plusieurs textes par pub, toujours en pause.
4. Le hub surveille les campagnes chaque jour et envoie une notification push sur l'iPhone
   d'Edgar quand un seuil est franchi.

## Non-objectifs

- **L'agent n'agit jamais dans Meta** (décision d'Edgar) : ni pause, ni budget, ni activation.
  Il recommande, Edgar fait. Le hub, lui, continue de créer des campagnes **en pause**
  uniquement, avec les quatre verrous existants de `src/lib/ads/meta-campaign.ts`.
- **Pas d'agent dans le hub** (pas de page de discussion, pas d'API Claude) : décision d'Edgar
  du 20/10 après comparaison des coûts. L'agent vit dans Claude Code.
- Pas de nouveau compte publicitaire : on travaille sur « Kleak Pub » (le seul auquel le jeton
  système a accès).
- Pas d'automatisation des règles côté Meta (règles automatiques du Gestionnaire).

## Anti-objectifs (ce qui serait un échec même si ça marche)

- Des conseils génériques de media buyer qui ignorent les chiffres réels du compte.
- Un repère de marché inventé (CPL moyen, CTR « normal ») présenté comme un fait. Tout repère
  vient soit des données du compte, soit d'une source citée, soit est annoncé comme estimation.
- Une conclusion tirée d'un volume trop faible, présentée comme sûre.
- Du copy qui « fait IA » (voir règles d'Edgar ci-dessous).
- Des notifications si fréquentes qu'Edgar finit par les ignorer.
- Une campagne qui part active, ou à moitié créée sans que l'écran le dise.

## Ce qui a été décidé, et par qui

| Décision | Par |
|---|---|
| L'agent vit dans Claude Code, pas dans le hub | Edgar |
| L'agent recommande, Edgar exécute dans le Gestionnaire | Edgar |
| Ajouter impressions, CTR, CPM, fréquence (et le reste nécessaire au diagnostic) | Edgar |
| Plusieurs textes principaux, titres et descriptions par pub | Edgar |
| Notifications push sur l'iPhone pour les événements importants | Edgar |
| Liste des alertes (section « Alertes ») | Proposée par Claude, acceptée par Edgar (« tout est bon ») |
| Règles et journal dans des fichiers du workspace (`livrables/media-buying/`) | Choix de Claude |
| Le générateur de textes Groq est retiré du module Ads, l'agent écrit les textes | Choix de Claude, présenté à Edgar sans objection |
| Seuils chiffrés des alertes (valeurs par défaut ci-dessous), modifiables dans Réglages | Choix de Claude |

## Partie 1 : l'agent `media-buyer`

**Fichier** : `.claude/agents/media-buyer.md` (racine du workspace), même forme que
`.claude/agents/createur-creas.md` (frontmatter `name`, `description` avec formulations
déclencheuses, `tools`). Une ligne à ajouter dans `CLAUDE.md`, section « Agents et skills ».

**Posture** : media buyer expert Meta, honnête sur ce que les données permettent de conclure.
Français, vouvoiement dans les textes d'annonce, tutoiement avec Edgar, pas de tiret long.

**Ce qu'il lit avant toute réponse** :
1. `livrables/media-buying/regles.md` : ses règles de décision (voir plus bas).
2. `livrables/media-buying/journal.md` : le journal des tests, du plus récent au plus ancien.
3. Les données du hub par l'entrée réservée (Partie 2, « Lecture pour l'agent »).
4. `livrables/offre/fiche-offre.md` (seule source des prix et délais),
   `livrables/creas-meta/README.md` et `NOTES.md` (créas existantes, règles de diffusion).
5. Les règles de copy d'Edgar (déjà appliquées par `createur-creas`, à reprendre telles
   quelles) : pas de formules ni de paires en miroir « qui font IA », partir des mots d'Edgar,
   phrasé plat, pas de chute ; aucun tiret de ponctuation ; interdits de contenu
   (« 49 €/mois », « N°1 des agences Framer », « +50 % de clients ») ; tout prix cité appartient
   à l'offre ; un avis n'est cité que mot pour mot depuis la table `avis` ; pas de mention de
   l'hébergement en plus dans les pubs.

**Trois modes** :

- **PRÉPARER une campagne** (« prépare la prochaine campagne », « on lance un test sur
  l'angle prix ») : propose structure (nombre d'ensembles, de pubs), budget par jour, créas à
  utiliser, hypothèse testée et critère de fin du test. Pour chaque pub, écrit 3 à 5 textes
  principaux, 3 à 5 titres, 3 à 5 descriptions, chacun passé aux garde-fous du hub
  (`src/lib/ads/garde-fous.ts`, via l'entrée de dépôt qui les applique). Edgar valide ou
  corrige ; l'agent dépose ensuite les textes validés dans le hub. Edgar crée la campagne
  depuis l'écran du hub. L'agent ajoute une entrée « test lancé » au journal.
- **BILAN** (« fais le bilan », « pourquoi la B ne marche plus », après une alerte) : lit les
  données, pose un diagnostic chiffré (accroche, formulaire, audience, fatigue, texte gagnant),
  dit ce qui est concluant et ce qui ne l'est pas encore (volume), puis donne une liste
  d'actions numérotées à faire dans le Gestionnaire, chacune avec sa raison et le chiffre qui la
  justifie. Ajoute une entrée « bilan » au journal (date, chiffres clés, décision, ce qu'on en
  retient).
- **COMMANDER des créas** : quand le bilan le justifie, rédige la commande pour
  `createur-creas` (angle, ce qui a marché, ce qu'il faut éviter) et la propose à Edgar, qui la
  lance.

**`livrables/media-buying/regles.md`**, contenu initial à écrire par le constructeur, adapté à
200 € par mois, en distinguant clairement ce qui vient de Meta (doc citée), ce qui vient des
données du compte, et ce qui est un choix de départ à réviser. Doit couvrir au minimum :
volume minimum avant de conclure sur une pub, un texte ou un angle ; quand couper une pub
(dépense sans lead, CPL au-delà d'un multiple du CPL cible, CTR très bas) ; quand garder ;
quand monter le budget et de combien à la fois ; combien de variantes tester en même temps vu
le budget ; comment lire la fréquence ; comment juger la qualité des leads (budget déclaré,
taux de RDV) avant le CPL brut ; ce que l'agent doit dire quand les données manquent. Les
seuils d'alerte du hub (Partie 4) doivent être cohérents avec ces règles.

**`livrables/media-buying/journal.md`** : une entrée par test lancé et par bilan, format fixe
(date, campagne, hypothèse, chiffres, décision, leçon). Repris depuis l'historique existant :
le test de 50 € des créas A, B, D (voir `livrables/creas-meta/NOTES.md` et
`context/CONTEXT.md`, section Acquisition).

## Partie 2 : données du hub

Code dans le worktree `livrables/hub-agence-ads/`, branche `module-ads` (à jour avec `main` au
20/10). Mêmes conventions que le plan du module Ads (logique pure testée dans
`scripts/test-ads-*.ts`, thème `src/app/theme.css`, navigation `src/lib/navigation.ts`, verre
réservé aux chiffres, iPhone sans défilement horizontal).

**Insights Meta complets** (`src/lib/ads/insights.ts`, aujourd'hui
`ad_id,ad_name,campaign_id,campaign_name,objective,spend,clicks,actions`). Ajouter au minimum :
`impressions`, `reach`, `frequency`, `cpm`, `ctr`, `inline_link_clicks`,
`inline_link_click_ctr`, `adset_id`, `adset_name`. Le constructeur vérifie les noms exacts dans
la doc Marketing API de la version utilisée (`GRAPH_BASE`, v26.0) et choisit les éventuels
champs utiles en plus pour distinguer accroche / formulaire / audience (par exemple les actions
d'ouverture de formulaire si Meta les expose). Une donnée absente s'affiche « indisponible »,
jamais 0 (règle existante).

**Détail par texte et par titre** : pour les pubs à plusieurs textes, lire les insights avec
les ventilations par élément créatif (`body_asset`, `title_asset`, `description_asset`). **À
vérifier en réel** : disponibilité de ces ventilations pour une annonce Prospects avec
`asset_feed_spec`, et ce que Meta renvoie (résultats par élément ou seulement impressions).
Si Meta ne les fournit pas, le dire à Edgar ; ne pas inventer de répartition.

**Qualité des leads par pub** : rapprocher les leads du CRM de leur `ad_id` (déjà stocké, voir
`src/lib/crm/sheet.ts`) et exposer par pub : nombre de leads, répartition des réponses
« budget » du formulaire, nombre passés en `rdv` et au-delà, nombre de `client`, CA signé. Les
leads sans `ad_id` restent dans une ligne « non rattachés » (règle existante).

**Affichage** : la page `/ads/meta` montre les nouveaux indicateurs (au moins CTR, CPM,
fréquence, et la qualité des leads par pub). Le détail par texte s'affiche dans la fiche d'une
pub ou d'une campagne. Le constructeur choisit la présentation dans le respect de la refonte.

**Lecture pour l'agent** : une entrée réservée, sur le modèle de `/api/agent/todo`
(en-tête `x-kleak-secret`, secret dédié, par exemple `ADS_AGENT_SECRET`), qui renvoie en JSON,
pour une période donnée : campagnes, ensembles, pubs, indicateurs Meta complets, détail par
élément créatif quand il existe, qualité des leads CRM par pub, dépense du mois face au budget,
alertes récentes. Lecture seule.

**Dépôt des textes par l'agent** : une entrée réservée qui reçoit les textes d'une créative
(plusieurs textes principaux, titres, descriptions), les passe aux garde-fous existants et
répond par la liste des refus motivés, sans rien enregistrer à moitié. Les textes acceptés
alimentent `textes_annonce` (le constructeur adapte le schéma : aujourd'hui une ligne = un
trio texte, titre, description ; il faut pouvoir choisir indépendamment plusieurs textes,
plusieurs titres, plusieurs descriptions).

## Partie 3 : plusieurs textes par pub

**Écran de création de campagne** (`/ads/campagnes/nouvelle`) : pour chaque créative choisie,
Edgar coche jusqu'à 5 textes principaux, 5 titres et 5 descriptions parmi ceux déposés. Au
moins un de chaque est obligatoire (une description peut rester facultative, comme aujourd'hui).

**Envoi** (`buildAdCreativePayload`) : `bodies`, `titles` et `descriptions` de
`asset_feed_spec` portent tous les textes choisis. Le cas « un seul visuel » passe lui aussi
par `asset_feed_spec` dès qu'il y a plus d'un texte.

**À valider en réel avant de fusionner** : Meta accepte-t-il plusieurs textes en même temps que
la personnalisation des placements (visuel story à part) sur un objectif Prospects avec
formulaire instantané ? Envoyer une campagne de test en pause (budget 1 €), vérifier avec
Edgar dans le Gestionnaire que les textes apparaissent bien comme options multiples, puis la
faire supprimer. Si Meta refuse la combinaison, **s'arrêter et présenter les options à Edgar**
avant de choisir (par exemple : renoncer au visuel story séparé, ou un seul texte par pub).
Figer la forme acceptée par un test, comme pour les correctifs du 19/10.

**Groq** : le générateur de textes (`src/lib/ads/llm.ts`, `textes.ts`, la page générateur et
les routes `api/ads/textes`) est retiré du parcours. Le constructeur décide s'il supprime le
code ou le débranche simplement, et retire `GROQ_API_KEY` des variables requises du module.
Les garde-fous (`garde-fous.ts`) restent : ils servent au dépôt de l'agent.

## Partie 4 : alertes push

Le hub a déjà les notifications push (`src/lib/push.ts`, `sendPush`, `sendDailyReminder`,
abonnement depuis l'app iPhone) et des tâches planifiées Vercel (`vercel.json`). Ajouter une
tâche planifiée quotidienne (le constructeur choisit l'heure, le matin) qui évalue les seuils
et envoie une notification par alerte nouvelle. Une même alerte ne repart pas tous les jours
tant que la situation ne change pas (le constructeur choisit le mécanisme, par exemple l'état
des rappels existant ou une table d'alertes). Les alertes sont aussi listées dans le hub et
exposées à l'agent.

**Les alertes** (liste acceptée par Edgar ; seuils par défaut choisis par Claude, modifiables
dans Réglages) :

| Alerte | Seuil par défaut |
|---|---|
| Pub refusée par Meta, ou compte publicitaire bloqué / désactivé | Dès que constaté |
| Jeton Meta qui ne fonctionne plus | Dès que la lecture échoue pour cause d'authentification |
| Pub qui dépense sans lead | Dépense ≥ 3 × CPL cible sans aucun lead |
| CPL qui double | CPL des 7 derniers jours ≥ 2 × CPL des 7 jours précédents, avec un volume minimum de leads sur chaque période |
| Répétition trop élevée | Fréquence ≥ 3 sur 7 jours |
| Dépense du mois trop rapide | Dépense du mois en avance de plus de 20 % sur le rythme du budget mensuel |
| Test arrivé au volume minimum | Volume défini dans `regles.md` atteint : « lance un bilan » |

« CPL cible » et « budget mensuel » sont des réglages (valeurs de départ : 5 € et 200 €, tirées
de `context/CONTEXT.md`, section Acquisition). Le texte de chaque notification dit ce qui se
passe et sur quelle pub, en une phrase, sans jargon.

## Contraintes

- Toutes celles du plan du module Ads (section « Global Constraints ») restent valables.
- Ne jamais afficher `.env.local` ni un secret. Nouvelles variables ajoutées à `.env.example`
  sans valeur ; Edgar les pose sur Vercel par script (`--value`, `--non-interactive`).
- Chaque push sur `main` déploie en production : tout se fait sur la branche `module-ads`,
  fusion après validation d'Edgar sur la prévisualisation (Mac et iPhone).
- Ne jamais lancer `npm run build` pendant qu'un serveur de dev tourne.
- Les écritures dans le workspace (`.claude/agents/`, `livrables/media-buying/`, `CLAUDE.md`)
  se commitent depuis la racine du workspace ; le code du hub se commite dans son propre dépôt.

## Avant de commencer : finir la Tâche 13

Le module Ads n'est pas encore en production. Avant ce chantier (ou en premier lot) :
compléter l'en-tête « CE QUI A ÉTÉ VÉRIFIÉ EN RÉEL » de `meta-campaign.ts`, vérifier que la
campagne de test de 1 € a été supprimée, et noter le passage de l'app Meta « Kleak Hub » en
mode publié le 20/10 (cause de l'erreur « application en cours de développement »).

## Laissé au constructeur

- Le découpage en lots et l'ordre, tant que la validation réelle des textes multiples (Partie
  3) a lieu avant la fusion.
- Le schéma exact des nouvelles tables et colonnes.
- La présentation des nouveaux indicateurs et des alertes dans le hub.
- Le contenu détaillé de `regles.md`, dans le cadre fixé en Partie 1.
- Le mécanisme anti-répétition des alertes et l'heure de la tâche planifiée.
