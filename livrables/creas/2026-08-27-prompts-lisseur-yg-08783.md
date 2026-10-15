# Prompts de génération d'images : lisseur YOUGOU YG-08783

> Date : 2026-08-27 · Boutique 2, appareils de coiffure · Fournisseur NEXOMI, 8,50 € HT
> Statut : **les 6 prompts ont été rendus le 27 août, 6 retenus, 1 à refaire**

> Outil : Nano Banana (Gemini 2.5 Flash Image) via Google AI Studio
> Méthode reprise de `2026-08-25-prompts-images-white-dream.md`, adaptée aux appareils électriques

**Chaque prompt est autonome.** Le bloc de fidélité et le bloc de forme sont déjà inclus,
il n'y a rien à assembler : tu joins la photo source recadrée et tu colles le prompt entier.

---

## À faire avant de générer : recadrer la photo source

Les images NEXOMI ne sont pas des photos produit, ce sont des planches de catalogue B2B. Chacune
porte le numéro de référence en gros orange, la puissance en pastille, les cotes avec flèches, et
souvent la boîte à côté de l'appareil. **Joins l'image telle quelle et le modèle recopiera tout ça
dans ses rendus**, y compris des flèches de cotation dans une photo lifestyle.

**Recadre sur l'appareil seul.** Un recadrage suffit, pas besoin de détourer. Garde l'appareil
entier dans le cadre avec une petite marge : si tu coupes une extrémité, le modèle invente la
partie manquante et il l'invente mal.

---

## Les six images et leur fonction

| # | Image | Fonction | Ratio |
|---|---|---|---|
| 1 | Packshot premium sans décor | Fiche, image principale | 1:1 |
| 2 | Packshot fond neutre ou socle | Fiche, secondaire | 1:1 |
| 3 | **Produit tenu en main** | Fiche, donne l'échelle | 1:1 |
| 4 | Le geste, le hook | Contenu | 9:16 |
| 5 | Scène d'usage | Contenu | 4:5 |
| 6 | Macro | Contenu | 1:1 |

| | Fiche produit catalogue TikTok Shop | Contenu / créa |
|---|---|---|
| Fond | Uni, blanc ou neutre clair | Libre |
| Texte incrusté, logo, watermark | **Interdit**, motif de rejet | Libre |
| Ratio | 1:1 (min 600x600) ou 3:4 | 9:16 |
| Le produit occupe | 60 à 80 % du cadre | Libre |
| Fidélité au produit réel | **Obligatoire** | Doit rester honnête |

Pour les prompts 1 et 2, un détourage de la photo fournisseur (Photoroom, Pixelcut, Canva) reste
supérieur à la génération : il garde les vrais pixels du produit.

---

## Bilan du premier lot, 27 août 2026

**6 rendus, 6 retenus, 1 à refaire.** Taux très au-dessus du 1 sur 4 attendu.

| Prompt | Verdict | Motif |
|---|---|---|
| 1 Packshot fond blanc | Gardé | Propre. L'appareil pourrait occuper davantage le cadre |
| 2 Packshot socle beige | Gardé, le plus beau | Ombre portée nette, ambiance premium |
| 3 Tenu en main | **À refaire** | L'échelle est fausse, seul rôle de l'image |
| 4 Dans les cheveux | Gardé, le plus fort | Le geste se lit en une seconde, cheveux distincts |
| 5 Coiffeuse | Gardé | Sert aussi de bannière Shopify |
| 6 Macro des plaques | Gardé sous réserve | Plaques rendues roses et brillantes, à confronter au produit réel. Un bout de doigt à recadrer en haut à droite |

**Le défaut dominant n'était aucune des dérives anticipées, c'est la longueur.** L'appareil sortait
à environ 20 cm au lieu de 30. Les six blocs de forme ci-dessous ont été durcis en conséquence.

**Ce qui a bien tenu :** aucune trace de catalogue, le câble présent et attaché sur les six, le rose
resté poudré sans virage fuchsia, cinq doigts et mèches distinctes sur le prompt 4, aucun signal de
danger, aucun visage, aucun claim.

**La réserve ouverte : la couleur des plaques.** Le rendu macro donne des plaques roses brillantes.
Si les plaques réelles sont blanches, nacrées ou noires, cette image est un écart de fidélité
catalogue. **À trancher l'appareil en main.**

---

# Lisseur YOUGOU YG-08783

Rose poudré, 60 W, 220-240 V, environ 30 cm de long, plaques céramique d'environ 11 cm.

## 1. Packshot fond blanc, fiche produit catalogue

```
À partir de cette image, garde uniquement l'appareil de coiffure et supprime entièrement le décor, ainsi que tout texte, chiffre, flèche de cotation, pastille de puissance, code-barres et emballage présents dans l'image source. Place l'appareil seul, parfaitement centré, légèrement incliné en diagonale, sur un fond blanc pur et uniforme. Ajoute une ombre portée très douce et diffuse sous l'appareil, et un léger reflet au sol. Lumière de studio homogène venant du haut à gauche, sans point chaud sur le plastique. L'appareil occupe environ 80 % de la diagonale du cadre. Cadrage carré 1:1.

Conserve l'appareil strictement identique à l'image source : même fer à lisser en plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires lisses, même petit écran d'affichage sombre de forme rectangulaire sur la branche supérieure, mêmes petits boutons de réglage à côté de l'écran, même câble d'alimentation noir sortant de la base de la poignée. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas, pas blanc. Le marquage de marque imprimé sur l'appareil reste tel quel, dans la même police et au même endroit. Ne réécris pas ce texte, ne le traduis pas, n'invente aucune autre marque, n'ajoute aucun logo ni pictogramme.

L'appareil est un fer à lisser droit et allongé, de 30 cm de long pour 3 cm de large, soit environ deux fois la longueur d'une paume adulte et non un mini lisseur de voyage, composé de deux branches parallèles jointes l'une contre l'autre par une charnière située à l'extrémité arrière. Les plaques chauffantes occupent environ un tiers avant de la longueur, la poignée les deux autres tiers. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à boucler cylindrique, en brosse chauffante ni en pince. Les deux branches restent jointes, parallèles et fermées, la pointe est arrondie. Le câble noir reste solidement attaché à la base de la poignée et retombe naturellement au sol, il ne flotte pas dans le vide et n'est pas coupé net.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucune flèche, aucun logo, aucun filigrane.
```

## 2. Packshot socle, seconde image de fiche

```
À partir de cette image, isole l'appareil de coiffure et supprime tout texte, chiffre, flèche de cotation et emballage présents dans l'image source. Pose l'appareil en diagonale sur un socle de pierre beige clair, devant un fond uni couleur lin très pâle légèrement dégradé. Lumière naturelle latérale douce, ombre longue et nette portée vers la droite. Ambiance minimaliste haut de gamme, aucun autre objet dans le cadre. Cadrage carré 1:1.

Conserve l'appareil strictement identique à l'image source : même fer à lisser en plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires lisses, même petit écran d'affichage sombre de forme rectangulaire sur la branche supérieure, mêmes petits boutons de réglage à côté de l'écran, même câble d'alimentation noir sortant de la base de la poignée. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas, pas blanc. Le marquage de marque imprimé sur l'appareil reste tel quel, dans la même police et au même endroit. Ne réécris pas ce texte, ne le traduis pas, n'invente aucune autre marque, n'ajoute aucun logo ni pictogramme.

L'appareil est un fer à lisser droit et allongé, de 30 cm de long pour 3 cm de large, soit environ deux fois la longueur d'une paume adulte et non un mini lisseur de voyage, composé de deux branches parallèles jointes l'une contre l'autre par une charnière située à l'extrémité arrière. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à boucler cylindrique ni en brosse chauffante. Les deux branches restent jointes, parallèles et fermées, la pointe est arrondie. Le câble noir reste solidement attaché à la base de la poignée et retombe naturellement, il ne flotte pas dans le vide et n'est pas coupé net.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucune flèche, aucun logo, aucun filigrane.
```

## 3. Tenu en main, l'image de l'échelle

**Prioritaire.** C'est l'image qui évite le litige sur la taille.

```
À partir de cette image, place cet appareil de coiffure tenu horizontalement dans une main de femme aux ongles courts et naturels, devant un fond uni gris très clair et uniforme. La main tient l'appareil par la poignée, doigts refermés dessus dans une prise naturelle et anatomiquement correcte, avec exactement cinq doigts. L'appareil est vu de profil sur toute sa longueur, de sorte que sa taille par rapport à la main soit immédiatement lisible. L'appareil est éteint et fermé. Lumière de studio douce et homogène, ombre légère. Cadrage carré 1:1.

Conserve l'appareil strictement identique à l'image source : même fer à lisser en plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires lisses, même petit écran d'affichage sombre de forme rectangulaire sur la branche supérieure, mêmes petits boutons de réglage à côté de l'écran, même câble d'alimentation noir sortant de la base de la poignée. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas, pas blanc. Le marquage de marque reste tel quel. Ne réécris pas ce texte, n'invente aucune autre marque, n'ajoute aucun logo.

L'appareil est un fer à lisser professionnel pleine taille de 30 cm de long, soit environ deux fois la longueur d'une paume adulte. Il dépasse très largement de la main des deux côtés : au moins 10 cm de plaques dépassent devant les doigts, et la poignée dépasse derrière la paume. Ce n'est pas un mini lisseur de voyage. Ce rapport de taille est le sujet unique de l'image. Ne le raccourcis pas, ne le réduis pas à la taille d'une main, ne l'épaissis pas, ne le transforme pas en fer à boucler ni en brosse. Les deux branches restent jointes et parallèles. Le câble noir reste attaché à la base de la poignée et retombe naturellement hors du cadre.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

## 4. En action dans les cheveux, le hook

```
À partir de cette image, une main de femme aux ongles courts et naturels tient cet appareil de coiffure et le fait glisser lentement le long d'une mèche de longs cheveux bruns brillants, de haut en bas. La mèche est saisie entre les deux branches fermées de l'appareil et ressort parfaitement lisse en dessous. On voit les cheveux, la main et l'appareil, sans visage dans le cadre. Arrière-plan de salle de bain claire et lumineuse, très flou. Lumière naturelle latérale douce venant de la gauche. Cheveux secs, aucune vapeur, aucune fumée, aucune étincelle. Photographie lifestyle naturelle. Cadrage vertical 9:16.

La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la poignée. Les cheveux passent réellement entre les deux branches de l'appareil et restent des cheveux distincts, séparés et nets : ils ne fusionnent pas avec le plastique, ne se transforment pas en ruban ni en matière continue.

Conserve l'appareil strictement identique à l'image source : même fer à lisser en plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires lisses, même petit écran d'affichage sombre sur la branche supérieure, même câble d'alimentation noir sortant de la base de la poignée. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas. Le marquage de marque reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

L'appareil est un fer à lisser droit et allongé de 30 cm de long pour 3 cm de large, soit environ deux fois la longueur d'une paume adulte et non un mini lisseur de voyage, à deux branches parallèles refermées sur la mèche. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à boucler cylindrique ni en brosse. Le câble noir reste attaché à la base de la poignée et retombe naturellement, il ne flotte pas dans le vide.

Photographie réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

## 5. Scène de coiffeuse

```
À partir de cette image, pose cet appareil de coiffure, éteint et fermé, sur une coiffeuse en bois clair, à côté d'un miroir rond, d'une brosse à cheveux en bois et d'un petit vase avec une tige de fleur séchée. Le câble noir est enroulé lâchement à côté de l'appareil. Arrière-plan de chambre lumineuse, légèrement flou. Lumière naturelle douce de fin d'après-midi venant de la gauche. Palette blanc cassé, beige, bois clair et rose poudré. Composition aérée. Cadrage vertical 4:5.

Conserve l'appareil strictement identique à l'image source : même fer à lisser en plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires lisses, même petit écran d'affichage sombre sur la branche supérieure, mêmes petits boutons de réglage, même câble d'alimentation noir. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas, pas blanc. Le marquage de marque reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

L'appareil est un fer à lisser droit et allongé de 30 cm de long pour 3 cm de large, soit environ deux fois la longueur d'une paume adulte et non un mini lisseur de voyage, à deux branches parallèles jointes et fermées, charnière à l'arrière, pointe arrondie. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à boucler cylindrique ni en brosse chauffante. Le câble noir reste solidement attaché à la base de la poignée.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

## 6. Macro des plaques

```
À partir de cette image, gros plan macro sur la tête de cet appareil de coiffure, vue de trois quarts, les deux branches légèrement entrouvertes de sorte que l'on voie les deux plaques chauffantes lisses se faire face. Lumière rasante latérale qui souligne le poli des plaques et le mat du plastique rose. Arrière-plan neutre gris très clair, entièrement flou. Profondeur de champ très courte, seule la tête de l'appareil est nette. L'appareil est éteint, les plaques ne rougeoient pas. Cadrage carré 1:1.

Conserve l'appareil strictement identique à l'image source : même plastique rose poudré pâle et mat, mêmes plaques chauffantes rectangulaires parfaitement lisses et de couleur uniforme. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas. Si un marquage de marque est visible dans le cadre, il reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo, aucun pictogramme, aucune indication de température.

Les plaques sont deux surfaces rectangulaires planes et lisses, parallèles, d'environ 11 cm de long sur 2,5 cm de large, sans rainure, sans picot, sans grille et sans motif. La charnière reste à l'arrière. Ne transforme pas les plaques en peigne, en brosse ni en surface texturée.

Photographie macro réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

---

---

## Décliner sans repartir de zéro

Une variante utile change **une seule variable**. Reprends un prompt qui a marché et modifie
uniquement :

- **La lumière** : matin doux, contre-jour, lumière rasante de fin de journée, ambiance tamisée
- **Le support** : coiffeuse, rebord de lavabo, étagère de salle de bain, trousse de voyage ouverte, drap froissé
- **La palette** : le blanc et bois clair actuel, virage beige chaud, ou contraste sur fond ardoise
- **L'échelle** : plan large d'ambiance, plan produit, macro
- **La couleur de cheveux** sur les prompts 4 : brun, châtain clair, blond foncé. Ne pas se limiter à un seul type, la cible ne l'est pas

Génère 4 images par prompt et jette 3. C'est le taux normal.

---

---

## Contrôle qualité sur chaque sortie

Ordre établi le 27 août sur le lot du lisseur, le premier rendu de cette boutique.

1. **La longueur.** Le contrôle numéro un, sur toutes les images et pas seulement celle de l'échelle. Le modèle rend systématiquement un modèle de voyage, parce que c'est ce qu'il voit le plus.
2. **La forme spécifique du produit.** Voir le bloc dédié plus haut, c'est ce que le modèle détruit en premier après la taille.
3. **La couleur des surfaces.** À confronter au produit réel une fois le stock reçu.
4. **Le marquage de marque.** Zoome. Le modèle l'affadit et invente des marques qui ressemblent.
5. **Les artefacts de bord.** Un bout de doigt, une main coupée, un objet fantôme en lisière. Se règle au recadrage.
6. **Le filigrane.** Étoile en bas à droite sur les sorties de l'app Gemini. Interdit en catalogue. Générer depuis AI Studio, ou recadrer.
7. **Le câble, les mains, les cheveux, les couleurs vives.** Tenus sur 6 rendus sur 6 au premier lot. Vérification rapide.
8. **Les traces du catalogue.** Aucun chiffre, aucune flèche, aucune pastille orange. Réglé en amont par le recadrage.

---

## Points de vigilance propres aux appareils électriques

Ces règles n'existaient pas sur les brumes. Elles comptent davantage, parce qu'un appareil
chauffant engage la sécurité et pas seulement la satisfaction.

**Aucun claim, jamais.** Ne génère rien qui suggère un soin, une protection, une réparation ou
un bénéfice pour la fibre capillaire. Pas de cheveux abîmés qui redeviennent sains, pas de
comparaison avant et après, pas de mention d'ions, de kératine ou de protection thermique. Un
visuel de transformation spectaculaire est un claim, même sans une ligne de texte.

**Aucun signal de danger dans l'image.** Pas de vapeur, pas de fumée, pas de rougeoiement, pas
d'étincelle, pas d'appareil posé sur une serviette ou près d'un point d'eau, pas de câble tendu
ou enroulé serré autour du corps chaud. Ces détails passent inaperçus à la génération et sautent
aux yeux d'un modérateur.

**Personne d'autre qu'un adulte, et jamais de visage d'enfant.** Ni enfant, ni animal, ni
utilisation sur une autre personne. Cadre sur les mains et les cheveux, sans visage : c'est plus
sûr, plus facile à générer proprement, et ça évite la question de la ressemblance.

**Catalogue.** L'image doit montrer le produit tel qu'il est. Une image générée qui change la
couleur, la longueur, la forme du cône ou fait disparaître la spirale est un motif de retrait de
fiche, et sur un appareil électrique c'est aussi le point de départ d'un litige gagné par
l'acheteur.

**Le packaging attendra le stock.** Les visuels de boîte, de déballage et d'accessoires se font
en photo réelle quand les produits sont là. Générer une boîte, c'est inventer un packaging que
le client ne recevra pas.

---
