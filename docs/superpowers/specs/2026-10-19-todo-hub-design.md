# To-do du lendemain dans le Hub Agence : design

> Conçu avec Edgar le 19/10/2026. Remplace la to-do Notion héritée de l'Orbikal Hub.
> Code : `livrables/hub-agence/` (dépôt `Beepurst/hub-agence-kleak`).

## Pourquoi

Du temps d'Orbikal, Edgar préparait chaque soir la to-do du lendemain, parfois seul dans Notion, parfois avec Claude qui l'écrivait dans la page. Il veut retrouver ce rituel pour Kleak, avec des tâches concrètes rangées par thématique.

La page To-do actuelle du hub lit une page Notion (`src/lib/notion.ts`, `src/lib/todo.ts`) et ne sait que cocher. Notion n'est pas branché sur le Hub Agence et Edgar a dit qu'il ne lui manquerait rien sans lui. **La to-do vit donc entièrement dans le hub, dans sa base Supabase.**

Succès : le soir, en une session Claude de quelques minutes, la journée du lendemain est prête dans le hub. Le lendemain, Edgar l'exécute depuis son Mac ou son iPhone sans ouvrir autre chose.

## Objectifs

1. Une to-do par jour, rangée en 6 thématiques fixes.
2. Un rituel du soir où Claude propose, Edgar complète, puis Claude écrit dans le hub.
3. Une page utilisable au quotidien sur Mac et iPhone : cocher, ajouter, modifier, supprimer, repousser.

## Non-objectifs

- Aucune synchronisation avec Notion. Le code Notion de la to-do est retiré.
- Pas de gestion de projet : ni dépendances, ni estimations de temps, ni Gantt.
- *Mon choix :* pas de tâches récurrentes, pas de notification push de la to-do, pas d'encart sur l'accueil. Rien de cela n'a été demandé ; ça pourra venir plus tard.

## Anti-objectifs (ce qui ferait échouer le projet même si tout marche)

- **Claude écrit dans la to-do sans validation.** La proposition du soir n'est écrite qu'après le feu vert d'Edgar, d'un seul coup.
- **Une tâche bouge toute seule.** Aucune tâche ne bascule automatiquement d'un jour à l'autre.
- **Une page chargée.** Une ligne porte une tâche. Le détail et le prompt ne s'affichent pas dans la liste (même règle que l'actuelle `todo-prompt.ts` : le prompt ne vit que dans le presse-papier).

## Les thématiques (validées par Edgar)

Ordre d'affichage fixe :

| Clé | Libellé | Ce qu'on y met |
|---|---|---|
| `prospection` | Prospection | Pubs Meta, créas, suivi des leads, relances, prises de RDV |
| `reunions` | Réunions | RDV découverte, appels clients, points de validation. Chaque tâche porte son heure |
| `production` | Production | Construction des sites Framer, retouches, checklist qualité, mises en ligne |
| `clients` | Clients | Questionnaires de cadrage, envoi des livrables, réponses aux demandes, maintenance |
| `admin` | Admin et finances | Devis, factures, acomptes, URSSAF, CGV, conformité |
| `outils` | Outils | Hub, automatisations, agents Claude, site Kleak |

« Opérationnel » n'est pas repris : trop large, il recouvre Production, Clients et Admin. Outils est à part pour voir le temps passé sur ce qui ne rapporte pas directement.

## Une tâche

Champs (décidés avec Edgar, sauf mention) :

- **jour** : la date à laquelle elle est prévue.
- **thématique** : une des 6.
- **libellé** : une ligne, concrète.
- **détail** : texte libre facultatif, à déplier. *Mon choix :* texte brut avec retours à la ligne et listes simples (`- `), pas d'éditeur riche.
- **qui agit** : Edgar ou Claude. *Mon choix :* deux valeurs (`edgar`, `claude`), sans le « les deux » de l'ancienne version Notion ; rien de facultatif, défaut `edgar`.
- **urgente** : oui ou non.
- **heure** : facultative, utile surtout pour Réunions.
- **faite** : oui ou non, avec l'horodatage du moment où elle a été cochée.
- *Mon choix :* **créée par** (`edgar` ou `claude`) et **nombre de reports**, pour que la proposition du soir sache qu'une tâche a déjà été repoussée trois fois.

## La page To-do

Même rubrique et même entrée de navigation qu'aujourd'hui, avec le style de la refonte visuelle (tokens de `theme.css`, aucune couleur en dur, champs à 16 px sur iPhone, contrastes AA). Trois onglets en sous-onglets : **Aujourd'hui**, **Demain**, **Historique**.

### Aujourd'hui (ouvert par défaut)

- Les tâches du jour, groupées par thématique dans l'ordre du tableau. Une thématique sans tâche est masquée.
- Dans chaque thématique : urgentes d'abord, puis par heure pour les tâches qui en ont, puis dans l'ordre d'ajout. *Le tri par heure vaut pour toutes les thématiques, c'est mon choix ; Edgar l'a demandé pour Réunions.*
- **Les tâches en retard** : une tâche d'un jour passé, ni faite ni repoussée, apparaît aussi dans Aujourd'hui, dans sa thématique, marquée « en retard » avec sa date d'origine. Elle ne change pas de jour. *Mon choix :* on peut la cocher ou la repousser depuis Aujourd'hui, c'est le seul endroit où on agit sur un jour passé.
- Les tâches faites restent visibles, cochées et atténuées, en bas de leur thématique.
- Le « jour » se calcule en heure de Paris (`Europe/Paris`), jamais en UTC.

### Les gestes (Mac et iPhone)

- Cocher et décocher.
- Ajouter une tâche (libellé, thématique, et le reste facultatif), dans Aujourd'hui ou Demain.
- Modifier tous les champs, supprimer (sans boîte de dialogue du navigateur : confirmation dans la page ou annulation possible quelques secondes).
- Déplier le détail.
- Changer qui agit.
- **Copier en prompt** : reprend `src/lib/todo-prompt.ts`, adapté pour lire le détail en base au lieu de Notion, sans la valeur `both`. Le prompt n'est jamais affiché. *Mon choix :* le cadre fixe d'Orbikal (commits de retard, `deployer.sh`) est remplacé par un cadre Kleak de 4 lignes au plus : travailler depuis `/Users/ed/Desktop/jarvis-kleak` et lire son `CLAUDE.md` ; répondre en français, sans tirets longs ; le hub est un dépôt git indépendant, jamais commité depuis la racine ; jamais de `npm run build` pendant un serveur dev.
- **Repousser à demain** : la tâche passe au jour suivant aujourd'hui (pas au lendemain de son jour d'origine) et son compteur de reports augmente de 1.

### Demain

La to-do préparée la veille, même présentation, entièrement modifiable.

### Historique

Les jours passés, du plus récent au plus ancien, en lecture seule : ce qui a été fait, ce qui ne l'a pas été. *Mon choix :* 30 jours par page, chargement de la suite à la demande.

## Le rituel du soir

1. Edgar lance la préparation dans une session Claude du workspace. *Mon choix :* une commande `/demain` dans `.claude/commands/` du workspace (à documenter dans `CLAUDE.md`).
2. Claude lit ce que le hub sait déjà, par un accès protégé (voir plus bas). *Les requêtes sont mon choix, sans toucher au schéma CRM :*
   - les tâches d'aujourd'hui pas faites et les tâches en retard (avec leur nombre de reports) ;
   - les tâches déjà posées pour demain ;
   - les RDV des 7 prochains jours : `comptes.rdv_le` (un RDV par compte, rempli par Cal.com). Les appels et points de validation hors Cal.com n'existent pas en base ; ils vivent comme tâches Réunions ;
   - les comptes dont `prochaine_action_le` tombe demain ou est dépassée ;
   - les leads à traiter, dans les deux sens : ceux à l'étape `nouveau_lead` encore jamais contactés, et ceux dont la séquence est terminée (`sequence_terminee_le`) sans RDV pris ;
   - les projets en cours (statut avant `livre`) et leur `livraison_prevue_le`.
3. Claude propose la to-do de demain dans la conversation, rangée par thématique. Il signale les tâches déjà repoussées plusieurs fois. Il ne décide pas à la place d'Edgar de ce qu'il faut faire des tâches pas faites.
4. Edgar complète, corrige, retire.
5. Sur validation explicite, Claude écrit tout d'un coup. *Mon choix :* la date visée est annoncée en clair au début de la proposition (« To-do du mardi 20 octobre ») et envoyée explicitement dans le lot ; le `POST` ne calcule pas « demain » lui-même. Lancée entre minuit et 5 h (heure de Paris), la commande vise le jour qui vient de commencer, puisque c'est encore la veille au sens du rituel. Écritures du lot : créations pour demain, et pour les tâches pas faites, le sort choisi par Edgar (repoussée à demain, laissée en retard, supprimée).

Edgar peut aussi ajouter des tâches directement dans le hub à tout moment.

### L'accès protégé (choix technique de Claude, validé par Edgar sur le principe)

Même modèle que `POST /api/intake/sheet` : routes hors session, protégées par un secret partagé en en-tête (`x-kleak-secret`), comparé en temps constant.

- Nouvelle variable `TODO_AGENT_SECRET`, dans `.env.local` du hub, en production sur Vercel, et dans le `.env` du workspace pour que la commande `/demain` l'utilise. Jamais affichée.
- `GET` : renvoie en une réponse le contexte de l'étape 2.
- `POST` : applique un lot (créations, reports, suppressions) dans une seule transaction (fonction SQL appelée en RPC), tout ou rien. Si le lot échoue, rien n'est écrit et la commande le dit.
- Les routes sont ajoutées à la liste d'exemptions de session du middleware.

## Données

Nouvelle table `taches` dans un fichier SQL idempotent `supabase/todo.sql`, à exécuter par Edgar dans Supabase comme les précédents. RLS activée sans policy, comme le reste du schéma (seule la clé de service, côté serveur, y accède). Index sur `jour`. Contrôles en base sur les valeurs de thématique et de « qui agit ».

## Ce qui disparaît

- `src/lib/notion.ts`, la lecture Notion de `src/lib/todo.ts`, et `src/app/api/todo/route.ts` dans sa forme actuelle.
- L'écran « Notion n'est pas branché » et les variables `NOTION_*`.
- Le composant `todo-board` est réécrit ; son style issu de la refonte (`todo-board.css`) sert de base.

## Contraintes

- **Base de travail :** la branche `refonte-visuelle` du hub n'est pas encore fusionnée. La to-do part de l'état refondu (fusion avant, ou branche partant de `refonte-visuelle`). Le worktree `livrables/hub-agence-ads/` (module Ads) travaille en parallèle : ne pas toucher aux mêmes fichiers sans le signaler.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Les tests suivent l'habitude du dépôt (scripts `scripts/test-*.ts`), au minimum : calcul du jour en heure de Paris, détection du retard, report, tri, validation du lot et refus sans secret.
- Le hub est en ligne sur Vercel, à l'URL définitive `https://hub-agence-kleak.vercel.app` (README du hub ; `CLAUDE.md` du workspace est en retard sur ce point). La commande `/demain` vise cette URL, rangée dans le `.env` du workspace (`HUB_URL`) à côté de `TODO_AGENT_SECRET`. La mise en production se fait après validation d'Edgar, avec le SQL exécuté avant le déploiement et la variable posée sur Vercel.

## Laissé au constructeur

Découpage des composants, forme exacte des réponses JSON, nommage des colonnes, design précis des lignes et du formulaire d'ajout (dans le cadre de la refonte), comportement d'annulation de la suppression, rédaction de la commande `/demain` dans le respect du rituel ci-dessus.
