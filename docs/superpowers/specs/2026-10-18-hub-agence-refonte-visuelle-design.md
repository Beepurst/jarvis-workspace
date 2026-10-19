# Hub Agence : refonte visuelle (thème clair, structure Notion, finition Apple)

Date : 18/10/2026
Code concerné : `livrables/hub-agence/` (dépôt git indépendant `Beepurst/hub-agence-kleak`, en ligne sur https://hub-agence-kleak.vercel.app)
Maquettes validées : `livrables/hub-agence/.superpowers/brainstorm/86639-1792355263/content/` (`direction.html` option C, `mobile.html` option A, `sous-onglets.html`)

## Pourquoi

Edgar trouve que le hub « fait trop IA, trop Claude Code ». Il veut prendre du plaisir visuellement en l'ouvrant, sur Mac comme sur iPhone. Ses références sont le minimalisme d'Apple et celui de Notion. Il veut un thème clair.

Le look actuel vient de l'Orbikal Hub, dont le hub a été copié le 15/10 : fond noir `#050505`, surfaces en verre dépoli avec couche d'ambiance lumineuse, accent orange Orbikal `#C45E1A`, une couleur vive par rubrique (`src/lib/channels.tsx`), étiquettes en monospace. C'est cette combinaison qui produit l'effet « généré par une IA ».

## Objectifs

1. Le hub entier passe en thème clair, dans la direction C validée : **structure Notion, finition Apple**.
2. Sur iPhone, la navigation devient une **barre d'onglets en bas**, avec des **sous-onglets en sélecteur segmenté** sous le titre.
3. Toutes les couleurs passent par un **jeu unique de variables**. Plus aucune couleur écrite en dur dans les composants (234 occurrences aujourd'hui, dont 95 dans `globals.css`, 65 dans `todo-board.css`, le reste réparti dans une trentaine de fichiers).
4. Le système de navigation prévoit les **sous-onglets**, car des rubriques à sous-onglets arrivent (par exemple « Ads » avec Créatives et Meta Ads).

## Non-objectifs

- Pas de changement fonctionnel, sauf le changement d'étape dans la fiche compte (voir « Écrans »). Mêmes écrans, mêmes données, mêmes actions. Pas de nouvelle rubrique (la rubrique Ads n'est qu'un exemple pour concevoir les sous-onglets).
- Pas de thème sombre, pas de bascule automatique selon le réglage du système. Un seul thème, clair.
- Pas de police à télécharger : police système uniquement.
- Pas de nouvelle bibliothèque d'interface (pas de shadcn ni de kit de composants).

## Anti-objectifs (échec même si « ça marche »)

- Retomber dans les marqueurs du style IA par défaut : dégradés, lueurs, verre dépoli décoratif, ombres marquées, coins très arrondis partout, une couleur vive par rubrique, emojis ou icônes à chaque ligne, badges colorés partout.
- Un hub clair mais fade ou « gris administratif » : le minimalisme doit venir de la typographie, de l'espace et de la précision des détails, pas d'un simple retrait de la couleur.
- Un écran laissé dans l'ancien thème sombre (même la page de connexion, la page de désinscription vue par les prospects, l'écran de chargement, la visionneuse d'images).

## La direction visuelle (validée : option C)

**Structure Notion**
- Barre latérale en texte seul : pas d'icônes, pas de couleur par rubrique. Intitulés gris, rubrique active en noir sur un léger fond gris, coins faiblement arrondis.
- Rubriques regroupées sous de petits intitulés de section gris (par exemple « Production », « Chiffres »).
- Nom de l'espace en haut de la barre : « Kleak Agency ».

**Finition Apple**
- Police système Apple : `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", …` avec repli système sur les autres plateformes.
- Grands titres de page serrés (environ 34 px sur Mac, 30 px sur iPhone, graisse 700, interlettrage négatif).
- Chiffres en `tabular-nums`, gras, pour les indicateurs.
- La zone de contenu est une page blanche qui « flotte » sur un fond à peine gris (`#FBFBFA` environ), avec un filet et une ombre très légers, coins arrondis modérés.

**Couleur**
- Texte en noir Apple (`#1D1D1F` environ) et en gris (deux ou trois niveaux).
- La seule couleur régulière : un point par étape du pipeline, dans les teintes système Apple (gris pour Nouveau lead, bleu pour RDV pris, orange pour Devis envoyé, vert pour Acompte payé, etc.).
- Le bleu système Apple (`#007AFF`) pour les liens et les actions principales. Rouge et vert système pour les erreurs et les succès.
- Les valeurs ci-dessus sont celles des maquettes. Le constructeur peut les ajuster pour le contraste (texte gris lisible, conformité WCAG AA sur le texte courant).

**Ce qui disparaît** : fond noir, couche d'ambiance et verre dépoli, accent orange, couleur par rubrique (`accent` de `channels.tsx`), étiquettes en monospace.

## Navigation

### Mac (et écrans larges)
- Barre latérale fixe à gauche, comme dans la maquette C.
- Une rubrique qui a des sous-onglets les **déplie dans la barre latérale** quand elle est ouverte (pages imbriquées façon Notion), en retrait.
- Les mêmes sous-onglets sont repris **en onglets texte en haut de la page**, sous le titre (onglet actif souligné en noir).

### iPhone (et écrans étroits)
- **Barre d'onglets fixée en bas**, fond légèrement translucide, filet fin en haut, respect de la zone de sécurité du bas (indicateur d'accueil).
- Quatre onglets : **Accueil, Pipeline, To-do, Briefs**, puis **Plus** qui ouvre une liste simple des autres rubriques (Bibliothèque, Analytics, SEO, Réglages…). Choix confirmé par Edgar.
- En haut de chaque écran : grand titre à la iOS, date en petit en dessous quand c'est utile, bouton « + » à droite quand l'écran permet de créer quelque chose.
- Les **sous-onglets** deviennent un **sélecteur segmenté** sous le titre (2 à 4 sous-onglets). Au-delà de 4, des pastilles qui défilent horizontalement.
- Le menu latéral actuel (bouton ≡ et tiroir) disparaît.

### Une seule source pour la navigation
La liste des rubriques, leur regroupement en sections, leurs sous-onglets et le choix des quatre onglets iPhone doivent être décrits à un seul endroit (aujourd'hui `src/lib/channels.tsx` et `src/components/sidebar.tsx`), lu à la fois par la barre latérale, la barre d'onglets, le menu « Plus » et les sous-onglets de page. Ajouter une rubrique ou un sous-onglet ne doit demander qu'une entrée dans cette description.

### Ordre et intitulés (choix de Claude, à corriger par Edgar s'il le souhaite)
- Ordre de la maquette C : Accueil, Pipeline, To-do ; section « Production » : Briefs, Bibliothèque ; section « Chiffres » : Analytics, SEO. Les groupes actuels « Commercial » et « Mesure » disparaissent.
- « Dashboard » est renommé « Accueil » partout (navigation, titres). L'adresse `/dashboard` peut rester.
- Réglages et Se déconnecter : en bas de la barre latérale sur Mac, dans « Plus » sur iPhone.
- Les points d'état « Connecté / Pas encore connecté » (`StatusDot`, `getChannelConnectivity()`) sortent de la navigation. L'état reste visible sur la page de la rubrique (message `not-connected` existant) et dans Réglages.

### Coordination avec le module Ads (décidé par Edgar)
- **La refonte passe d'abord.** Le module Ads (plan `docs/superpowers/plans/2026-10-18-module-ads.md`, worktree `livrables/hub-agence-ads`, branche `module-ads`, aucun code écrit au 18/10) attend la fusion de la refonte.
- Ensuite, le plan Ads est réécrit pour la nouvelle navigation : Ads devient une rubrique à sous-onglets (Créatives, Meta Ads, etc.) au lieu de quatre entrées de menu à plat, et ses écrans utilisent le nouveau jeu de variables. Le worktree Ads est repris depuis le `main` refondu.

## Écrans

Chaque écran garde sa mise en page et ses fonctions, il change d'apparence. Inventaire : Accueil (`dashboard`), Pipeline, fiche compte (`comptes/[id]`), To-do (le plus gros composant, `todo-board.tsx` et `todo-board.css`), Briefs et fiche brief, Bibliothèque et visionneuse, Analytics, SEO, Réglages (notifications, sessions), connexion, désinscription (vue par les prospects), écran de chargement.

Points particuliers :

- **Pipeline sur Mac** : colonnes par étape, en-tête de colonne avec point de couleur et nombre, cartes blanches à filet fin, comme la maquette C.
- **Pipeline sur iPhone** : liste groupée par étape (groupes blancs arrondis façon Réglages iOS, une ligne par compte avec nom, sous-titre gris et chevron « › »), filtres en pastilles en haut (« Tout », puis une pastille par étape). La ligne ouvre la fiche compte.
- **Changement d'étape (décidé par Edgar)** : sur iPhone, le menu d'étape (`EtapeSelect`) quitte les lignes du Pipeline et va **en haut de la fiche compte** (`comptes/[id]`), qui aujourd'hui affiche l'étape sans permettre de la modifier. C'est le seul ajout fonctionnel de la refonte. Sur Mac, le menu reste aussi sur les cartes du Pipeline.
- **Étiquettes d'urgence** (`COULEURS_TON`, `src/lib/crm/affichage.ts`) (choix de Claude) : « urgent » en rouge système, « aujourd'hui » en orange système, les tons info et ok passent en gris neutre.
- **Listes sur iPhone** (briefs, to-do, bibliothèque, comptes) : même logique de groupes arrondis sur fond gris clair.
- **Ligne de chiffres en haut de page** (style maquette C : gros chiffre, libellé gris dessous) là où l'écran a déjà des indicateurs (Accueil, Pipeline, Analytics, SEO). Pas d'indicateur inventé : uniquement des chiffres que l'écran calcule déjà.
- **Graphiques** (Recharts : `area-trend.tsx`, `traffic-split.tsx`) : gris avec une seule couleur d'accent, grilles et axes très discrets.
- **Cartes d'indicateurs** (`kpi-card`) : sans verre ni lueur, chiffre gras en `tabular-nums`, libellé gris.
- **Pastilles et étiquettes** (`ui/pill.ts`) : discrètes, fond gris très clair par défaut. La couleur est réservée au sens (étape, erreur, succès).

## Application iPhone (PWA)

- `themeColor` (`src/app/layout.tsx`) et `theme_color` / `background_color` (`public/manifest.json`) passent sur le fond clair.
- `statusBarStyle` passe de `black-translucent` à une barre de statut adaptée au fond clair. Vérifier qu'aucune bande parasite n'apparaît sous l'encoche ni au-dessus de la barre d'onglets.
- Les icônes d'accueil (`public/icons/`) sont à revoir si elles sont sur fond noir : à signaler à Edgar, pas à redessiner sans lui.

## Avenant du 19/10/2026 : touche « liquid glass »

Validée par Edgar sur la maquette `finance-a-verre.html` (conversation Finance), puis étendue au hub. Elle **remplace**, pour ces seuls éléments, l'anti-objectif « verre dépoli décoratif, dégradés » :
- un halo léger en haut des pages principales (vert au centre, violet à droite ; la tache bleue en haut à gauche a été retirée à la demande d'Edgar) ;
- les cartes de chiffres de l'Accueil, le relevé d'Analytics et de SEO, et le sélecteur de période en verre (`.hub-verre`, `.hub-pilules-verre`) ;
- un dégradé vertical subtil sous les courbes, et une barre de progression en dégradé (`.hub-barre-progression`, utilisée par Finance).

Le reste ne change pas : listes, tableaux et barre latérale restent mats. Replis : sans `backdrop-filter` ou avec « Réduire la transparence », le verre devient blanc opaque et le halo disparaît. Jetons dans `theme.css`.

## Contraintes

- Next.js 15, React 19, Tailwind CSS 4 et CSS classique (`globals.css`, fichiers `.css` par composant). Garder cette pile.
- Les règles d'accessibilité déjà présentes dans `globals.css` restent valables et doivent être adaptées, pas supprimées : `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more`.
- Ne jamais lancer `npm run build` pendant qu'un `npm run dev` tourne (ils partagent `.next`).
- Le dépôt est indépendant du workspace : commits dans `livrables/hub-agence/`, jamais depuis la racine.
- Chaque push sur `main` déploie en production. Travailler sur une branche, fusionner une fois qu'Edgar a validé.
- Les 98 tests existants doivent rester verts (ils couvrent la logique, pas l'apparence).

## Vérification

- Captures de chaque écran à deux largeurs (Mac environ 1440 px, iPhone environ 390 px) comparées aux maquettes validées.
- Contrôle qu'aucune couleur n'est écrite en dur hors du fichier de variables (une recherche dans `src/` ne doit plus trouver de code couleur hors de ce fichier et des cas justifiés et commentés).
- Edgar valide sur son Mac et sur son iPhone avant la fusion dans `main` (choix de Claude) : sur l'adresse de prévisualisation Vercel de la branche, ajoutée à l'écran d'accueil de l'iPhone pour vérifier barre de statut, zone de sécurité et barre d'onglets en mode application. Si la protection des prévisualisations Vercel bloque l'accès sur iPhone, Edgar se connecte à Vercel dans Safari ou la protection est levée le temps du test.

## Laissé au constructeur

- Les valeurs exactes de l'échelle d'espacement, des rayons, des ombres et des gris, dans l'esprit des maquettes.
- L'organisation du fichier de variables et le nettoyage de `globals.css` (les longs commentaires sur le verre peuvent partir avec le verre).
- Les icônes de la barre d'onglets iPhone : traits fins, monochromes, dans l'esprit SF Symbols (les icônes de `src/components/icons.tsx` peuvent être réutilisées ou redessinées).
- L'ordre des écrans dans le plan.
