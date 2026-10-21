# Style maison Kleak

> Le niveau minimum de tout site Kleak, dès la première sortie. Le client choisit ses couleurs, ses photos et son ton. Il ne choisit pas le niveau de design.
> Tiré de l'étude de modèles Framer du 21/10/2026 (Renovatehub, Renove, Roofaro, Norfolk, Gridfly, BLDR, Refit), **mesurés** sur leurs pages en ligne. Les modèles sont des inspirations : on mélange leurs idées, on ne part jamais de l'un d'eux.
> S'applique avec la checklist qualité (`checklist-qualite-site.md`), section 9 performance comprise.

---

## 1. Ce qui fait « niveau Framer » (et ce qui fait vieillot)

| Niveau Framer | Vieillot (site Garnier V1, 21/10) |
|---|---|
| Titres très grands et serrés (interlettrage négatif) | Titres moyens, interlettrage normal |
| Fond chaud ou teinté, cartes blanches **sans bordure** | Fond gris froid, cartes blanches à bord fin |
| Photo arrondie **dans** une carte, avec une étiquette posée dessus | Photo en vignette carrée au-dessus d'un texte |
| En-tête de section en deux colonnes (titre à gauche, phrase et bouton à droite) | Titre seul au-dessus d'une grille |
| Sections claires et sombres en alternance | Toutes les sections sur le même fond |
| Boutons pilule avec flèche dans un rond | Boutons arrondis simples, centrés |
| Blocs « produit » : avant / après, note avec avatars, carte de zone, badge | Icônes dans des carrés, texte à côté |
| L'accroche est une image forte, plein cadre | Deux colonnes texte et photo |

---

## 2. Grille et espace

- Largeur utile **1320 px**, marges latérales **60 px** sur bureau, **20 px** sur mobile.
- Espace vertical par section : **96 à 120 px** sur bureau, **64 px** sur mobile. Jamais de vide sans fonction : chaque section remplit sa hauteur.
- Écart entre cartes : **16 à 20 px**. Grille de 3 colonnes par défaut, 2 sur tablette, 1 sur mobile.

## 3. Typographie

Une famille de titres, une graisse. Deux directions au choix :

| Direction | Titres | Texte | Quand |
|---|---|---|---|
| **Nette** (par défaut) | Sans-serif géométrique, 700 : Satoshi si disponible dans Framer, sinon Plus Jakarta Sans | Inter 400 | Artisans, dépannage, services, BTP |
| **Éditoriale** | Serif fine, 300 ou 400 : Instrument Serif, Fraunces | Inter 400 | Haut de gamme : cuisiniste, architecte, décoration |

| Élément | Bureau | Mobile | Interligne | Interlettrage |
|---|---|---|---|---|
| Titre d'accroche (H1) | **64 à 76 px** | 40 px | 1,1 | **−3 %** (−4 % en éditoriale) |
| Titre de section (H2) | **48 à 60 px** | 32 px | 1,1 | −3 % |
| Titre de carte (H3) | 18 à 22 px (nette), 32 à 40 px (éditoriale) | 18 à 24 px | 1,2 | −1 % |
| Texte | 16 px | 15 px | 1,5 | 0 |
| Étiquette de section | 13 px | 12 px | 1,4 | 0, préfixée « // » ou par un point |

Le texte secondaire est la couleur du texte à 60-70 %, pas un gris neutre.

## 4. Couleurs

Cinq rôles, toujours les mêmes :

| Rôle | Règle | Exemple Renovatehub |
|---|---|---|
| **Fond** | Neutre chaud ou teinté par la couleur du client, jamais gris froid ni blanc pur | `#EFEBE3` |
| **Carte** | Blanc, ou fond un ton plus clair | `#FFFFFF` |
| **Sombre** | Presque noir chaud, ou la couleur foncée du client. Sert aux sections sombres et au texte | `#1A1A17` |
| **Accent** | La couleur vive du client : boutons, puces, détails. Jamais en texte sur fond clair si le contraste est sous 4,5 | `#EAD9BE` |
| **Texte secondaire** | Le sombre à 60-70 % d'opacité | |

Une page compte **2 ou 3 sections sombres** sur 8 à 10, jamais deux à la suite.

## 5. Composants

- **Carte :** arrondi **16 à 20 px**, sans bordure ni ombre visible (ombre très douce tolérée au survol). Padding 20 à 24 px. Photo dans la carte avec un arrondi de **12 px** et une marge intérieure de 6 à 8 px.
- **Étiquette sur photo :** pastille semi-transparente (blanc à 70 % + flou), texte 12 px, en haut à gauche.
- **Bouton principal :** pilule de **40 à 48 px** de haut, arrondi complet, texte 14 px, avec la **flèche ou l'icône dans un rond** de la couleur inverse à droite (padding 4 px 4 px 4 px 16 px). Bouton secondaire : même forme, contour fin ou fond transparent.
- **Accroche :** photo plein cadre dans un bloc arrondi de 16 à 24 px, **décollé des bords de 8 à 12 px**, voile sombre en dégradé vers le bas. Titre blanc en bas à gauche, texte court en bas à droite, boutons dessous, une ligne de 3 ou 4 garanties cochées, puis éventuellement un bandeau de logos ou de chiffres.
- **En-tête de section :** étiquette, puis titre H2 sur la moitié gauche ; phrase de 1 ou 2 lignes et bouton sur la moitié droite, alignés en bas.
- **Avis :** note globale en grand avec des avatars superposés, puis des cartes avec étoiles, texte, prénom et ville.
- **Liste de services en accordéon** (Renove) ou **cartes photo** (Renovatehub) : jamais des icônes dans des carrés.
- **Navigation :** posée sur l'accroche (texte blanc) ou dans une pilule flottante ; bouton principal à droite.
- **Pied de page :** fond sombre, nom en très grand (style Lintel) ou colonnes de liens.

## 6. Photos

- Des photos **dominantes** : l'accroche plein cadre, des cartes avec photo. Une page sans photos grandes fait vieillot.
- Toutes du même ton (chaud ou froid, pas de mélange), même luminosité.
- Pas de plombier souriant posé en tenue neuve, ni de fond bleu néon ou d'éclairage de studio coloré.
- Arrondies partout (12 à 24 px), jamais à angle droit sauf choix éditorial assumé.

## 7. Mouvement

Les modèles mesurés en ont **peu**. La qualité vient de la composition, pas de l'animation. Recette Kleak :

- Accroche : **aucune** entrée (règle de performance). Seule la photo peut avoir un léger zoom lent si c'est sans coût.
- Sections plus bas : un fondu montant (opacité 0 → 1, 24 px → 0, 0,6 s) sur **le titre de section** et **un bloc fort** par section, au plus 4 sur la page.
- Survols : cartes qui montent de 4 px, photo qui zoome de 3 % dans sa carte, flèche du bouton qui glisse.
- Autorisés : bandeau de logos défilant, avant / après à glisser, accordéons.
- Interdits : texte mot par mot, parallaxe sur l'accroche, WebGL, vidéo de fond.

---

## 8. Contrôle « niveau Framer » avant de montrer un site

À passer sur la capture bureau **et** mobile, par la session de construction puis par Edgar. Un seul « non » et on corrige avant d'envoyer.

1. L'accroche est-elle une image forte, avec un titre d'au moins 64 px sur bureau ?
2. Les titres de section font-ils au moins 48 px, serrés ?
3. Le fond est-il chaud ou teinté, et les cartes sans bordure ?
4. Y a-t-il 2 ou 3 sections sombres, jamais à la suite ?
5. Les boutons sont-ils en pilule avec une icône dans un rond ?
6. Chaque section a-t-elle une mise en page tirée d'une référence de la bibliothèque, et pas une grille d'icônes ?
7. Les photos sont-elles grandes, arrondies et du même ton ?
8. Rien de centré par défaut : les en-têtes sont en deux colonnes, sauf l'appel final ?
9. Sur mobile, le titre d'accroche fait-il au moins 40 px et le premier écran donne-t-il envie de continuer ?
10. Mis à côté de Renovatehub, le site tient-il la comparaison ?
