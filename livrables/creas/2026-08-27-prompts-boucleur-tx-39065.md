# Prompts de génération d'images : boucleur CIAOBOSI TX-39065

> Date : 2026-08-27 · Boutique 2, appareils de coiffure · Fournisseur NEXOMI, 5,00 € HT
> Statut : **aucun prompt encore rendu.** Blocs de forme écrits par anticipation

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

## La dérive à surveiller, avant même de générer

**La spirale va disparaître.** C'est la prédiction la plus sûre de tout ce dossier. Le modèle
connaît des milliers de fers à boucler cylindriques lisses à pince et quasiment aucun fer à
spirale. Il va lisser le cône et rajouter une pince.

**La spirale est le produit.** Sans elle ce n'est plus le même objet, et la fiche devient
trompeuse au sens commercial comme au sens réglementaire. C'est pour cette raison que le bloc de
forme de chaque prompt ci-dessous est deux fois plus long que celui du lisseur, et qu'il répète
trois fois la même contrainte. **Ne l'allège pas.**

Le second point, hérité du lot du lisseur : **la longueur**. Le modèle rend un modèle de voyage.
Le renfort est déjà intégré aux six blocs.

---

# Boucleur CIAOBOSI TX-39065

Corps noir mat en spirale, poignée claire, 45 W, 110-240 V, environ 30,5 cm de long.

> **Le bloc de forme de ces six prompts est plus long que celui du lisseur, et c'est
> délibéré.** La spirale est ce que le modèle va détruire en premier. Ne l'allège pas.

## 1. Packshot fond blanc, fiche produit catalogue

```
À partir de cette image, garde uniquement l'appareil de coiffure et supprime entièrement le décor, ainsi que tout texte, chiffre, flèche de cotation, pastille de puissance, code-barres et emballage présents dans l'image source. Place l'appareil seul, parfaitement centré, légèrement incliné en diagonale, sur un fond blanc pur et uniforme. Ajoute une ombre portée très douce et diffuse sous l'appareil, et un léger reflet au sol. Lumière de studio homogène venant du haut à gauche, sans point chaud. L'appareil occupe environ 80 % de la diagonale du cadre. Cadrage carré 1:1.

La partie chauffante de cet appareil est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué ou un tire-bouchon. Cette spirale est la caractéristique principale du produit : elle doit rester parfaitement visible, régulière et en relief sur toute la longueur du cône. Ne la lisse pas, ne l'atténue pas, ne la remplace pas par un cylindre lisse, ne la transforme pas en fer à boucler classique. Il n'y a aucune pince, aucun ressort et aucun levier sur cet appareil.

Conserve l'appareil strictement identique à l'image source : même corps spiralé noir mat, même poignée de couleur claire beige très pâle légèrement veinée, même bouton rond unique sur la poignée, même petit crochet à l'extrémité de la pointe, même câble d'alimentation noir sortant de la base de la poignée. Le marquage de marque imprimé sur la poignée reste tel quel, dans la même police et au même endroit. Ne réécris pas ce texte, ne le traduis pas, n'invente aucune autre marque, n'ajoute aucun logo ni pictogramme.

L'appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte et non un modèle de voyage. La poignée claire occupe environ un tiers de la longueur, le cône noir spiralé les deux autres tiers, et le diamètre du cône diminue progressivement vers la pointe. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à lisser ni en brosse. Le câble noir reste solidement attaché à la base de la poignée et retombe naturellement au sol, il ne flotte pas dans le vide et n'est pas coupé net.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucune flèche, aucun logo, aucun filigrane.
```

## 2. Packshot socle, seconde image de fiche

```
À partir de cette image, isole l'appareil de coiffure et supprime tout texte, chiffre, flèche de cotation et emballage présents dans l'image source. Pose l'appareil en diagonale sur un socle de pierre beige clair, devant un fond uni couleur lin très pâle légèrement dégradé. Lumière naturelle latérale douce, ombre longue et nette portée vers la droite, qui souligne le relief de la spirale. Ambiance minimaliste haut de gamme, aucun autre objet dans le cadre. Cadrage carré 1:1.

La partie chauffante de cet appareil est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. Cette spirale est la caractéristique principale du produit : elle doit rester parfaitement visible, régulière et en relief sur toute la longueur du cône. Ne la lisse pas, ne l'atténue pas, ne la remplace pas par un cylindre lisse, ne la transforme pas en fer à boucler classique. Il n'y a aucune pince, aucun ressort et aucun levier sur cet appareil.

Conserve l'appareil strictement identique à l'image source : même corps spiralé noir mat, même poignée de couleur claire beige très pâle légèrement veinée, même bouton rond unique sur la poignée, même petit crochet à l'extrémité de la pointe, même câble d'alimentation noir. Le marquage de marque reste tel quel. Ne réécris pas ce texte, n'invente aucune autre marque, n'ajoute aucun logo.

L'appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte et non un modèle de voyage. La poignée claire occupe environ un tiers de la longueur, le cône noir spiralé les deux autres tiers, et le diamètre du cône diminue progressivement vers la pointe. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à lisser ni en brosse. Le câble noir reste attaché à la base de la poignée et retombe naturellement.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucune flèche, aucun logo, aucun filigrane.
```

## 3. Tenu en main, l'image de l'échelle

**Prioritaire.** Sur un fer à boucler, l'acheteur veut aussi juger le diamètre du cône, qui
détermine la taille des boucles.

```
À partir de cette image, place cet appareil de coiffure tenu par la poignée dans une main de femme aux ongles courts et naturels, le cône spiralé pointant vers le haut en diagonale, devant un fond uni gris très clair et uniforme. La main tient la poignée, doigts refermés dessus dans une prise naturelle et anatomiquement correcte, avec exactement cinq doigts. L'appareil est vu de profil sur toute sa longueur, de sorte que sa taille et le diamètre du cône par rapport à la main soient immédiatement lisibles. L'appareil est éteint. Lumière de studio douce et homogène, ombre légère. Cadrage carré 1:1.

La partie chauffante de cet appareil est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. Cette spirale doit rester parfaitement visible, régulière et en relief. Ne la lisse pas, ne la remplace pas par un cylindre lisse, ne la transforme pas en fer à boucler classique. Il n'y a aucune pince et aucun ressort sur cet appareil.

Conserve l'appareil strictement identique à l'image source : même corps spiralé noir mat, même poignée de couleur claire beige très pâle légèrement veinée, même bouton rond unique sur la poignée, même petit crochet à la pointe, même câble d'alimentation noir. Le marquage de marque reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

L'appareil est un fer à boucler professionnel pleine taille de 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte. Il dépasse très largement de la main des deux côtés : au moins 15 cm de cône spiralé dépassent devant les doigts, et la poignée dépasse derrière la paume. Ce n'est pas un modèle de voyage. Ce rapport de taille est le sujet unique de l'image. Ne le raccourcis pas, ne le réduis pas à la taille d'une main, ne l'épaissis pas. La poignée claire occupe environ un tiers de la longueur, le cône spiralé les deux autres tiers. Le câble noir reste attaché à la base de la poignée et retombe hors du cadre.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

## 4. En action, la mèche enroulée sur la spirale, le hook

**Le prioritaire du produit.** C'est le seul visuel qui explique en une seconde à quoi sert
une spirale, et c'est exactement ce qu'un fer à boucler classique ne peut pas montrer.

```
À partir de cette image, une main de femme aux ongles courts et naturels tient cet appareil de coiffure par la poignée, cône pointant vers le bas, et une longue mèche de cheveux bruns brillants est enroulée en hélice autour du cône, en suivant exactement la rainure en spirale du corps. La mèche fait plusieurs tours réguliers autour du cône. On voit les cheveux, la main et l'appareil, sans visage dans le cadre. Arrière-plan de salle de bain claire et lumineuse, très flou. Lumière naturelle latérale douce venant de la gauche. Cheveux secs, aucune vapeur, aucune fumée, aucune étincelle. Photographie lifestyle naturelle. Cadrage vertical 9:16.

La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la poignée. Les cheveux enroulés restent des cheveux distincts, séparés et nets, avec des mèches individuelles visibles : ils ne fusionnent pas avec le corps de l'appareil, ne se transforment pas en ruban ni en matière continue, et n'entrent pas dans le plastique.

La partie chauffante de cet appareil est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. C'est dans cette rainure que la mèche vient se loger, et la spirale doit rester visible entre les tours de cheveux. Ne la lisse pas, ne la remplace pas par un cylindre lisse, ne la transforme pas en fer à boucler classique. Il n'y a aucune pince et aucun ressort sur cet appareil : la mèche tient uniquement par l'enroulement.

Conserve l'appareil strictement identique à l'image source : même corps spiralé noir mat, même poignée de couleur claire beige très pâle, même bouton rond unique sur la poignée, même câble d'alimentation noir sortant de la base de la poignée. Le marquage de marque reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

L'appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte, poignée claire sur un tiers, cône spiralé sur deux tiers. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à lisser. Le câble noir reste attaché à la base de la poignée et retombe naturellement.

Photographie réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

## 5. Scène de coiffeuse

```
À partir de cette image, pose cet appareil de coiffure, éteint, sur une coiffeuse en bois clair, à côté d'un miroir rond, d'une brosse à cheveux en bois et d'un petit vase avec une tige de fleur séchée. Le câble noir est enroulé lâchement à côté de l'appareil. Arrière-plan de chambre lumineuse, légèrement flou. Lumière naturelle douce de fin d'après-midi venant de la gauche, en lumière rasante sur la spirale pour en souligner le relief. Palette blanc cassé, beige, bois clair et noir mat. Composition aérée. Cadrage vertical 4:5.

La partie chauffante de cet appareil est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. Cette spirale doit rester parfaitement visible, régulière et en relief. Ne la lisse pas, ne la remplace pas par un cylindre lisse, ne la transforme pas en fer à boucler classique. Il n'y a aucune pince et aucun ressort sur cet appareil.

Conserve l'appareil strictement identique à l'image source : même corps spiralé noir mat, même poignée de couleur claire beige très pâle légèrement veinée, même bouton rond unique, même petit crochet à la pointe, même câble d'alimentation noir. Le marquage de marque reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

L'appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte, poignée claire sur un tiers, cône spiralé sur deux tiers, diamètre décroissant vers la pointe. Ne le raccourcis pas, ne l'épaissis pas, ne le transforme pas en fer à lisser ni en brosse. Le câble noir reste solidement attaché à la base de la poignée.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

## 6. Macro de la spirale

```
À partir de cette image, gros plan macro sur la partie centrale du cône de cet appareil de coiffure, vue de profil, cadré serré sur trois ou quatre tours de la rainure en spirale. Lumière rasante latérale qui creuse le relief de la spirale et souligne le grain mat du noir. Arrière-plan neutre gris très clair, entièrement flou. Profondeur de champ très courte. L'appareil est éteint, le corps ne rougeoie pas. Cadrage carré 1:1.

Le sujet de l'image est la rainure hélicoïdale en relief qui s'enroule autour du cône noir mat, comme un pas de vis très marqué. Les tours de spirale sont réguliers, nettement creusés et parfaitement lisibles. Ne lisse pas la surface, ne la remplace pas par un cylindre uni, ne la transforme pas en surface texturée, en grille ou en motif décoratif. Il n'y a aucune pince et aucun ressort sur cet appareil.

Conserve la matière strictement identique à l'image source : noir mat uniforme, sans reflet chromé, sans effet métallique brossé, sans dorure. Si un marquage de marque est visible dans le cadre, il reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo, aucun pictogramme, aucune indication de température.

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
