# Bibliothèque : agent d'ajout, prompts de section et de page : conception

> 20/10/2026. Conçu avec Edgar. Touche le Hub Agence (`livrables/hub-agence/`, dépôt
> `Beepurst/hub-agence-kleak`) et ajoute un agent Claude Code au workspace.

## Pourquoi

La bibliothèque du hub doit devenir l'accélérateur de production des sites. Edgar repère une
section qui lui plaît sur un site, la range dans le hub, puis s'en sert pour construire les
sites clients dans Framer, avec Claude Code piloté par `@framer/agent`. L'exigence de fond
reste la même : un site sort parfait en 2 ou 3 allers-retours, et la performance passe avant
les grosses animations (`livrables/process/checklist-qualite-site.md`, section 9).

Aujourd'hui :

- l'ajout se fait à la main : capture d'écran, puis saisie de chaque champ. C'est lent, donc la
  bibliothèque grossit peu ;
- une fiche ne dit rien de **comment** la section est construite (grille, espacements, polices,
  animations) ;
- rien ne transforme une section ou une page en consigne pour la session Claude Code du site ;
- une fiche ne peut pas être modifiée depuis l'écran (la route `PATCH` existe, pas l'interface) ;
- la suppression passe par `confirm()` du navigateur, peu fiable dans l'app iPhone.

## Objectifs

1. Un **agent Claude Code `bibliothecaire`** : Edgar lui donne une URL et désigne la section,
   l'agent capture la section, lit le code de la page, remplit la fiche et une **fiche
   technique**, puis la **dépose directement** dans le hub (décision d'Edgar : pas de
   validation avant dépôt, il corrige après coup).
2. Sur chaque fiche de la bibliothèque, un bouton **« Copier le prompt »** pour une section
   isolée.
3. Dans le brief d'un client, les épingles rangées **par page** et dans un **ordre**, avec un
   bouton **« Copier le prompt de la page »** par page (décision d'Edgar : un prompt par page).
4. **Modifier** une fiche depuis la bibliothèque, capture comprise.
5. **Supprimer en deux temps**, dans la carte elle-même.

## Hors périmètre

- Aucune IA appelée par le hub. L'analyse est faite par la session Claude Code (abonnement,
  coût nul). Le hub ne fait qu'assembler du texte.
- Pas de glisser-déposer pour l'ordre (monter / descendre suffit, et marche au doigt).
- Pas de composants Framer réutilisables générés automatiquement. Le prompt aide à construire,
  il ne remplace pas le projet Framer.
- Pas de sélection multiple dans la bibliothèque sans brief : le mode « plusieurs sections »
  passe par le brief, qui est toujours dans le hub quand Edgar monte un site client (confirmé
  par Edgar).

## Ce qui serait un échec, même si ça marche techniquement

- Un prompt qui fait **recopier** la section : textes, images, logos ou marque du site
  d'origine. La règle est « reprendre la structure, adapter au client ».
- Un prompt qui pousse vers des animations lourdes et casse la performance.
- Un agent qui remplit la bibliothèque de doublons ou de fiches vagues (« section moderne et
  épurée ») au lieu d'une description exploitable.

## Le parcours d'Edgar

1. Sur un site qui lui plaît, Edgar ouvre Claude Code et dit à l'agent : « ajoute le hero et la
   FAQ de https://exemple.fr ». Il peut glisser une capture si la section est ambiguë.
2. L'agent dépose une fiche par section et répond avec le titre et le type de chaque fiche
   (et leur lien vers la bibliothèque).
3. Plus tard, sur le brief d'un client, Edgar épingle les fiches voulues, choisit pour chacune
   une page et la monte ou la descend, et écrit son commentaire d'adaptation (« garder la
   grille, mais ses 3 services, pas 6 »).
4. Il clique « Copier le prompt de la page » sur Accueil, colle dans la session Claude Code du
   site, vérifie la page avec la checklist, puis passe à la page suivante.

## L'agent `bibliothecaire`

Fichier : `.claude/agents/bibliothecaire.md` (workspace), à documenter en une ligne dans la
section « Agents et skills » de `CLAUDE.md`. Même modèle que `media-buyer` : il agit seul sur
le hub par une route protégée par un secret.

**Entrée** : une URL, une ou plusieurs sections désignées en mots (« le hero », « la 3e
section », « les témoignages »), éventuellement une capture fournie par Edgar.

**Ce qu'il fait, dans l'ordre :**

1. Vérifie les doublons : interroge le hub pour cette URL. Si une fiche existe déjà pour cette
   URL avec le même type **et qu'il s'agit visiblement de la même section** (même position
   dans la page, titre équivalent), il ne crée rien et le signale à Edgar. Deux sections
   différentes du même type sur une page (deux blocs services) sont deux fiches. *Choix de
   Claude.*
2. Ouvre la page avec Playwright (déjà installé dans `livrables/creas-meta/node_modules`), en
   bureau (1440 px de large) puis en mobile (390 px). Fait défiler la page pour déclencher le
   chargement et les animations.
3. Trouve l'élément de la section et en fait une **capture de l'élément seul** en bureau. Si la
   section ne peut pas être isolée, il capture la zone visible et le dit dans son retour.
   Capture en JPEG ou WebP sous 4 Mo (limite du hub).
4. Lit le code et les styles calculés : familles et graisses de police, tailles des titres et
   du texte, couleurs, grille et colonnes, marges et espacements, largeur maximale, rayons,
   comportement en mobile (ce qui passe en colonne, ce qui disparaît), animations (au
   chargement, au défilement, au survol, défilements automatiques).
5. Remplit la fiche : titre court et descriptif (« Hero split photo à droite, cabinet
   d'architecte »), `url_source`, `type_section`, `secteur` du site d'origine, tags, `outil`
   détecté (Framer, Webflow ou Inspiration).
6. Écrit la **fiche technique** (format ci-dessous) et la dépose avec la capture.
7. Répond à Edgar : une ligne par fiche déposée, plus les sections ignorées et pourquoi.

**Règles :**

- La fiche technique décrit la structure. Elle ne reprend **jamais** les textes du site
  d'origine au-delà de leur forme (« titre de 6 à 8 mots, sur 2 lignes »), ni ses images.
- Chaque animation repérée est classée selon la checklist section 9 : **compatible**, **à
  alléger** (dire comment) ou **à proscrire** (effet mot par mot, apparition au-dessus de la
  ligne de flottaison, parallaxe sur l'accroche, WebGL, vidéo de fond).
- En cas d'échec d'une étape (page protégée, section introuvable), il n'invente pas : il
  dépose sans capture ou ne dépose pas, et le dit.

**Format de la fiche technique** (texte, titres fixes, pour que le prompt reste lisible ;
format court du 21/10, 6 rubriques, 180 mots au plus) :

```
Structure : …
Hiérarchie et grille : …
Mobile : …
Animations : … (chacune marquée compatible / à alléger / à proscrire)
Ce qui fait la force de la section : …
Points d'attention performance : …
```

Ni couleurs exactes (rgb, hex), ni noms de polices du site d'origine, ni textes au-delà de
leur forme.

> Décisions du 21/10 (Sonnet, fiche courte, mode retravailler, `/site`) : `docs/superpowers/plans/2026-10-21-bibliotheque-optimisation.md`, qui prime sur cette spec.

La note d'Edgar (`note`) reste à part : c'est son avis à lui (ce qui lui plaît, ce qu'il
veut changer). L'agent ne la remplit pas, sauf si Edgar lui donne une consigne en ajoutant la
section.

## Le hub

### Base de données

Script SQL à fournir à Edgar (il l'exécute dans Supabase), en ajout au schéma existant :

- `bibliotheque.fiche_technique text` (nullable).
- `bibliotheque.origine text not null default 'manuel' check (origine in ('manuel', 'agent'))`,
  pour savoir quelles fiches viennent de l'agent.
- `brief_references.page text not null default 'Accueil'`.
- `brief_references.ordre integer not null default 0`.

**Types de section étendus** (*choix de Claude*) : les sections courantes d'un site vitrine
tombaient toutes dans « Autre ». On ajoute `chiffres` (Chiffres clés), `logos` (Logos
clients), `realisations` (Réalisations), `a_propos` (À propos), `appel_action` (Bandeau
d'appel à l'action) et `etapes` (Étapes ou process). Le script SQL remplace la contrainte
`check` de `bibliotheque.type_section`. `TYPES_SECTION`, les libellés, les filtres et les tests
suivent.

`page` est un libellé libre. L'interface propose Accueil, Services, À propos, Réalisations,
Contact et **Commune**, et permet d'en taper une autre. « Commune » est réservée aux sections
partagées par tout le site (navigation, footer).

### Route agent

`/api/agent/bibliotheque`, protégée par l'en-tête `x-kleak-secret` comme
`/api/agent/todo` (déjà exemptée du mot de passe par le middleware, motif `api/agent`).
Nouveau secret **`BIBLIO_AGENT_SECRET`**, dans `.env.local`, dans `.env` du workspace (pour
l'agent) et dans Vercel.

- `GET ?url=…` : les fiches existantes pour cette URL (id, titre, type), pour le contrôle des
  doublons. Comparaison sur l'URL normalisée (sans `www.`, sans `/` final, sans paramètres de
  suivi).
- `POST` multipart : les mêmes champs que `POST /api/bibliotheque`, plus `fiche_technique`, et
  la capture. Valide avec `parserReference` et `validerCapture`, écrit `origine = 'agent'`,
  renvoie la fiche créée.

### Page Bibliothèque

- **Modifier** sur chaque carte : ouvre le même formulaire que l'ajout, prérempli, avec la
  fiche technique en plus (zone de texte large). On peut y remplacer la capture : la nouvelle
  est envoyée, la ligne mise à jour, puis l'ancienne supprimée du stockage (si la suppression
  échoue, on le journalise sans faire échouer la modification, comme pour `DELETE`).
- **Supprimer en deux temps** : le lien « Supprimer » devient, dans la carte, « Confirmer la
  suppression » et « Annuler ». Le texte rappelle que la fiche sera retirée des briefs où elle
  est épinglée. Plus de `confirm()`.
- **Copier le prompt** sur chaque carte : copie le prompt de section dans le presse-papier et
  affiche « Prompt copié » quelques secondes. Le prompt n'est pas affiché à l'écran (même règle
  que la to-do, `src/lib/todo/prompt.ts`).
- Le formulaire d'ajout manuel reste, avec le champ fiche technique en plus. Le libellé de
  « Note » devient « Ce qui me plaît, ce que je changerais ».
- Petit repère visuel sur les fiches déposées par l'agent.

### Fiche du brief

- Chaque épingle porte une **page** (liste déroulante avec saisie libre), des boutons **monter**
  et **descendre** dans sa page, et un **commentaire** modifiable (le champ existe en base, il
  manque l'interface). Enregistrement par une nouvelle route `PATCH` sur
  `/api/briefs/[id]/references`.
- Les épingles s'affichent **groupées par page**, Commune en premier, puis dans l'ordre de
  création des pages.
- Une nouvelle épingle va dans la page Accueil, à la fin.
- Chaque page (sauf Commune) a un bouton **« Copier le prompt de la page »**.

## Les prompts

Logique pure dans `src/lib/bibliotheque-prompt.ts`, testée dans
`scripts/test-bibliotheque-prompt.ts` (même façon que `test-todo-prompt.ts`). Texte en
français, sans tirets longs.

**Cadre commun aux deux prompts :**

- Tu construis dans Framer, avec `@framer/agent`, le site en cours dans cette session.
- Reprends la **structure** de chaque section (disposition, hiérarchie, rythme, type
  d'interactions) et adapte-la au site : couleurs, typographies, ton, textes et images du
  client, tels que posés dans cette session (planche de direction, styles Framer existants).
- Ne reprends jamais les textes, images, logos ni la marque du site d'origine.
- Règles de performance **écrites en clair dans le prompt** (rien de masqué avant les
  animations, aucun effet d'apparition au-dessus de la ligne de flottaison, pas d'effet mot par
  mot, fondus sur 3 ou 4 éléments forts au plus, images à la bonne taille, une seule graisse de
  titre), puis renvoi par **chemin absolu** vers
  `/Users/ed/Desktop/jarvis-kleak/livrables/process/checklist-qualite-site.md`, section 9. Le
  prompt marche ainsi quel que soit le dossier où tourne la session du site. *Choix de
  Claude.* Les animations marquées « à proscrire » dans une fiche technique ne sont pas
  reprises, celles « à alléger » le sont dans leur version allégée.
- Pour voir une capture : la télécharger depuis son adresse (curl), puis l'ouvrir. Pour l'URL
  d'origine : l'ouvrir dans un navigateur si la session en a un, sinon s'en tenir à la capture
  et à la fiche technique.

**Prompt de section** (bibliothèque) : le cadre, puis pour la section : titre, type, URL
d'origine (à ouvrir pour voir le comportement réel), adresse de la capture, fiche technique,
note d'Edgar. Consigne : ajouter cette section à l'endroit de la page que la session indique,
ou demander où si ce n'est pas clair.

**Prompt de page** (brief) : le cadre, puis :

- le client : nom du compte et réponses utiles du brief (activité, cible, objectifs, contenus
  fournis, fonctionnalités) ;
- le nom de la page à construire ;
- les sections de **Commune** : à construire une seule fois pour tout le site et à réutiliser
  (si elles existent déjà dans le projet, ne pas les refaire) ;
- les sections de la page, numérotées dans l'ordre, chacune avec les mêmes éléments que le
  prompt de section plus le **commentaire d'adaptation** de l'épingle ;
- la consigne : garder une seule direction artistique sur toute la page (espacements
  réguliers, mêmes styles), construire dans l'ordre, puis vérifier la page avec la checklist
  avant de rendre la main.

Un champ vide est omis, jamais écrit « non renseigné ». Une fiche sans fiche technique reste
utilisable : le prompt demande alors d'ouvrir l'URL et la capture pour en tirer la structure.

## Contraintes

- Travail sur une branche du hub (`bibliotheque-prompts`), fusion dans `main` après validation
  d'Edgar : chaque push sur `main` déploie en production.
- Apparence : couleurs uniquement depuis `src/app/theme.css`, pas de classes verre sur les
  listes et les cartes de la bibliothèque. Tests de couleurs et de contraste à faire passer.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- La branche `module-ads` (worktree `livrables/hub-agence-ads/`) n'est pas encore fusionnée :
  éviter de toucher aux fichiers qu'elle modifie, ou prévoir la fusion.
- Écrans utilisables sur iPhone (boutons au doigt, pas de survol nécessaire).
- **Essai avant fusion** (*choix de Claude*) : le script SQL n'ajoute que des colonnes avec
  valeur par défaut et élargit une contrainte, il peut donc passer sur la base de production
  avant la fusion. L'agent est essayé contre le serveur dev local de la branche (adresse du hub
  passée à l'agent, `BIBLIO_AGENT_SECRET` dans `.env.local`), sur la vraie base, puis les
  fiches d'essai sont supprimées. Le secret est posé dans Vercel au moment de la fusion. Pas
  de variable à poser en prévisualisation.

## Laissé au constructeur

- Le découpage des composants de la page Bibliothèque et de la fiche du brief.
- Le détail de la normalisation d'URL pour les doublons.
- La manière exacte dont l'agent repère une section dans le DOM, tant que le résultat est une
  capture de la section seule ou un échec annoncé.
- Le wording exact des prompts, tant qu'il respecte le cadre et les éléments listés.
