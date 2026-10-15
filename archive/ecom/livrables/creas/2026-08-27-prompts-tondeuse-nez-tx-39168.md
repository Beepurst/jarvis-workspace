# Prompts de génération d'images : tondeuse à poils de nez CIAOBOSI TX-39168

> Date : 2026-08-27 · Boutique 2, appareils de coiffure · Fournisseur NEXOMI, 4,80 € HT
> Statut : **aucun prompt encore rendu.** Blocs de forme écrits par anticipation
> Outil : Nano Banana (Gemini 2.5 Flash Image) via Google AI Studio

**Chaque prompt est autonome.** Le bloc de fidélité et le bloc de forme sont déjà inclus,
il n'y a rien à assembler : tu joins la photo source recadrée et tu colles le prompt entier.

---

## Deux incertitudes à lever avant de produire la banque complète

**1. La cote annoncée ne colle pas avec la photo.** La fiche NEXOMI annonce 2,5 × 5,7 cm, soit un
rapport de 2,3 pour 1. La photo montre un objet nettement plus élancé, autour de 5 pour 1, ce qui
donnerait plutôt 12 cm de haut. Une tondeuse nez format stylo fait typiquement 12 à 14 cm.

**Les blocs ci-dessous décrivent la forme par proportion et non par cote absolue**, ce qui est de
toute façon plus robuste pour un modèle d'image. Mesure l'appareil à réception et corrige ce
fichier si nécessaire.

**2. La couleur.** Le produit existe en noir, blanc et vert. La fiche NEXOMI avait `BLANC`
sélectionné, la photo disponible montre le noir. **Les prompts décrivent le noir**, puisque c'est
l'image que tu vas joindre. Substitution pour le blanc en fin de document.

---

## La dérive à surveiller, avant même de générer

**Un cylindre noir avec un petit écran et un bouton, c'est exactement une cigarette
électronique.** Le modèle va y aller tout seul, et il en a vu des milliers. Chaque bloc de forme
ci-dessous le bloque nommément.

Le second point, hérité du lot du lisseur : **la taille**. Le modèle agrandit les petits objets.
Ici le risque est qu'il rende une tondeuse à cheveux de barbier au lieu d'un objet de 12 cm qui
tient dans le creux de la main.

---

## À faire avant de générer : recadrer la photo source

Les images NEXOMI sont des planches de catalogue B2B : numéro de référence en gros orange,
pastille de puissance, cotes avec flèches, boîte à côté de l'appareil. **Joins l'image telle
quelle et le modèle recopiera tout ça dans ses rendus.**

Recadre sur l'appareil seul, en gardant l'objet entier avec une petite marge.

---

## Les six images et leur fonction

| # | Image | Fonction | Ratio |
|---|---|---|---|
| 1 | Packshot premium sans décor | Fiche, image principale | 1:1 |
| 2 | Packshot socle | Fiche, secondaire | 1:1 |
| 3 | **Tenue en main** | Fiche, donne l'échelle | 1:1 |
| 4 | **La lame rincée sous l'eau** | Contenu, le hook | 9:16 |
| 5 | Rebord de lavabo | Contenu | 4:5 |
| 6 | Macro de la tête | Contenu | 1:1 |

| | Fiche produit catalogue TikTok Shop | Contenu / créa |
|---|---|---|
| Fond | Uni, blanc ou neutre clair | Libre |
| Texte incrusté, logo, watermark | **Interdit**, motif de rejet | Libre |
| Ratio | 1:1 (min 600x600) ou 3:4 | 9:16 |
| Fidélité au produit réel | **Obligatoire** | Doit rester honnête |

---

# Les six prompts

## 1. Packshot fond blanc, fiche produit catalogue

```
À partir de cette image, garde uniquement l'appareil et supprime entièrement le décor, ainsi que tout texte, chiffre, flèche de cotation, pastille et emballage présents dans l'image source. Place l'appareil seul, debout à la verticale, parfaitement centré, sur un fond blanc pur et uniforme. Ajoute une ombre portée très douce et diffuse à sa base, et un léger reflet au sol. Lumière de studio homogène venant du haut à gauche, avec un reflet net et propre sur la tête métallique. L'appareil occupe environ 75 % de la hauteur du cadre. Cadrage carré 1:1.

L'appareil est une tondeuse électrique compacte à poils de nez, de la forme et de la taille d'un stylo épais. Son corps est un cylindre régulier noir mat, environ cinq fois plus long que large, à base plate. À son sommet se trouve une tête en métal argenté brillant, en forme de dôme arrondi surmonté d'une petite pointe centrale : c'est la lame rotative. Sur la face avant du corps, un petit écran digital de forme ovale affiche deux chiffres lumineux, et en dessous se trouve un unique bouton rond en léger relief. Ce n'est pas une cigarette électronique, ce n'est pas un vaporisateur, ce n'est pas un stylo, ce n'est pas un rasoir à lames, ce n'est pas une tondeuse à cheveux. Ne l'épaissis pas, ne le raccourcis pas en objet trapu, n'ajoute ni embout de vapotage, ni capuchon, ni clip, ni grille de rasoir.

Conserve l'appareil strictement identique à l'image source : même corps noir mat, même tête métallique argentée brillante en dôme, même petit écran digital, même bouton rond unique. Si un marquage de marque est visible, il reste tel quel, dans la même police et au même endroit. Ne réécris pas ce texte, n'invente aucune autre marque, n'ajoute aucun logo ni pictogramme.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre ajouté, aucune flèche, aucun logo, aucun filigrane.
```

## 2. Packshot socle, seconde image de fiche

```
À partir de cette image, isole l'appareil et supprime tout texte, chiffre, flèche de cotation et emballage présents dans l'image source. Pose l'appareil debout sur un socle de pierre beige clair, devant un fond uni couleur lin très pâle légèrement dégradé. Lumière naturelle latérale douce, ombre longue et nette portée vers la droite, avec un reflet propre sur la tête métallique. Ambiance minimaliste haut de gamme, aucun autre objet dans le cadre. Cadrage carré 1:1.

L'appareil est une tondeuse électrique compacte à poils de nez, de la forme et de la taille d'un stylo épais. Son corps est un cylindre régulier noir mat, environ cinq fois plus long que large, à base plate. À son sommet se trouve une tête en métal argenté brillant, en forme de dôme arrondi surmonté d'une petite pointe centrale. Sur la face avant du corps, un petit écran digital de forme ovale affiche deux chiffres lumineux, et en dessous un unique bouton rond en léger relief. Ce n'est pas une cigarette électronique, ce n'est pas un vaporisateur, ce n'est pas un stylo, ce n'est pas un rasoir à lames. Ne l'épaissis pas, ne le raccourcis pas, n'ajoute ni embout de vapotage, ni capuchon, ni clip.

Conserve l'appareil strictement identique à l'image source : même corps noir mat, même tête métallique argentée brillante en dôme, même petit écran digital, même bouton rond unique. Si un marquage de marque est visible, il reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre ajouté, aucune flèche, aucun logo, aucun filigrane.
```

## 3. Tenue en main, l'image de l'échelle

**La plus importante des six sur ce produit.** À 44 g et une douzaine de centimètres, l'écart
entre ce que l'acheteur imagine et ce qu'il reçoit est maximal.

```
À partir de cette image, place cet appareil tenu à la verticale entre le pouce et l'index d'une main de femme aux ongles courts et naturels, devant un fond uni gris très clair et uniforme. La prise est naturelle et anatomiquement correcte, la main a exactement cinq doigts. L'appareil est vu de face sur toute sa longueur, de sorte que sa taille par rapport à la main soit immédiatement lisible. Lumière de studio douce et homogène, ombre légère. Cadrage carré 1:1.

L'appareil est une tondeuse électrique compacte à poils de nez, de la longueur d'un stylo à bille : il tient entièrement dans le creux d'une main et ne dépasse que de très peu de part et d'autre des doigts qui le tiennent. C'est un objet petit et léger, et ce rapport de taille est le sujet unique de l'image. Ne l'agrandis pas à la taille d'une tondeuse à cheveux, ne le fais pas dépasser largement de la main, ne l'épaissis pas.

Son corps est un cylindre régulier noir mat, environ cinq fois plus long que large, à base plate. À son sommet se trouve une tête en métal argenté brillant, en forme de dôme arrondi surmonté d'une petite pointe centrale. Sur la face avant, un petit écran digital ovale affiche deux chiffres lumineux, et en dessous un unique bouton rond. Ce n'est pas une cigarette électronique, ce n'est pas un vaporisateur, ce n'est pas un stylo. N'ajoute ni embout de vapotage, ni capuchon, ni clip.

Conserve l'appareil strictement identique à l'image source. Si un marquage de marque est visible, il reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre ajouté, aucun logo, aucun filigrane.
```

## 4. La lame rincée sous l'eau, le hook

**La nature de cette image est différente des autres produits, et c'est délibéré.** Sur le lisseur
et le boucleur, le hook est le geste d'usage. Ici le geste d'usage est une lame dans une narine :
inmontrable en publicité, à peu près certain d'être rejeté en modération, et repoussant sur une
vignette. Le seul bénéfice à la fois réel, distinctif et visuellement satisfaisant de ce produit,
c'est la **lame détachable et lavable**. C'est ce qu'on filme.

```
À partir de cette image, la tête métallique argentée de cet appareil est détachée du corps et tenue entre le pouce et l'index d'une main, sous un filet d'eau claire qui coule d'un robinet chromé et vient la rincer. Les gouttes d'eau sont nettes et brillantes sur le métal, quelques éclaboussures figées en l'air. Le corps noir de l'appareil est posé en arrière-plan flou sur un rebord de lavabo blanc. Arrière-plan de salle de bain claire et lumineuse, très flou. Lumière naturelle douce venant de la gauche. Photographie macro lifestyle, vitesse d'obturation rapide. Cadrage vertical 9:16.

La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte. L'eau est parfaitement claire et propre, il n'y a aucun résidu, aucun poil, aucune saleté visible dans le cadre.

La tête est une pièce en métal argenté brillant, en forme de dôme arrondi surmonté d'une petite pointe centrale, avec de fines ouvertures régulières sur son pourtour par lesquelles passe la lame. Elle est petite, de la taille du bout d'un pouce. Le corps noir mat visible en arrière-plan est un cylindre régulier environ cinq fois plus long que large. Ce n'est pas une cigarette électronique, ce n'est pas un vaporisateur. N'ajoute ni embout de vapotage, ni capuchon.

Conserve les deux pièces strictement identiques à l'image source. N'invente aucune marque, n'ajoute aucun logo.

Photographie réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

## 5. Scène de rebord de lavabo

```
À partir de cette image, pose cet appareil debout sur un rebord de lavabo en pierre claire, à côté d'un petit verre à dents en céramique blanche, d'une serviette blanche pliée et d'un savon. Un câble USB blanc est enroulé lâchement à côté. Arrière-plan de salle de bain lumineuse et épurée, légèrement flou, carrelage blanc. Lumière naturelle douce venant de la gauche. Palette blanc, pierre claire et noir mat. Composition aérée. Cadrage vertical 4:5.

L'appareil est une tondeuse électrique compacte à poils de nez, de la taille d'un stylo à bille : il est nettement plus petit que le verre à dents posé à côté de lui, et ce rapport de taille doit être respecté. Son corps est un cylindre régulier noir mat, environ cinq fois plus long que large, à base plate, surmonté d'une tête en métal argenté brillant en forme de dôme arrondi à pointe centrale. Sur la face avant, un petit écran digital ovale et un unique bouton rond. Ce n'est pas une cigarette électronique, ce n'est pas un vaporisateur, ce n'est pas un stylo. Ne l'agrandis pas, n'ajoute ni embout de vapotage, ni capuchon, ni clip.

Conserve l'appareil strictement identique à l'image source. Si un marquage de marque est visible, il reste tel quel. N'invente aucune autre marque, n'ajoute aucun logo.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre ajouté, aucun logo, aucun filigrane.
```

## 6. Macro de la tête

```
À partir de cette image, gros plan macro sur la tête métallique de cet appareil, vue de trois quarts légèrement en plongée, cadré serré sur le dôme argenté et le haut du corps noir. Lumière rasante latérale qui fait briller le métal et révèle les fines ouvertures du pourtour. Arrière-plan neutre gris très clair, entièrement flou. Profondeur de champ très courte. Cadrage carré 1:1.

Le sujet de l'image est la tête : une pièce en métal argenté brillant, en forme de dôme arrondi surmonté d'une petite pointe centrale, percée sur son pourtour de fines ouvertures régulières par lesquelles passe la lame rotative. Ces ouvertures sont ce qui rend l'objet identifiable comme une tondeuse et doivent rester nettes et bien définies. Ne les bouche pas, ne les lisse pas, ne remplace pas le dôme par une surface pleine, n'ajoute pas de grille de rasoir électrique ni de lames apparentes.

Conserve la matière strictement identique à l'image source : métal argenté brillant sur la tête, noir mat uniforme sur le corps. Sans dorure, sans effet cuivré. Si un marquage de marque est visible dans le cadre, il reste tel quel. N'invente aucune marque, n'ajoute aucun logo, aucun pictogramme.

Photographie macro réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
```

---

## Si tu pars sur la version blanche

Remplace partout `cylindre régulier noir mat` par `cylindre régulier blanc mat`, et `noir mat sur
le corps` par `blanc mat sur le corps`. Ajoute cette phrase au bloc de fidélité :

```
Le blanc est un blanc mat uniforme, sans reflet nacré, sans virage crème ni gris.
```

**Mais joins alors une photo de la version blanche.** Sans elle, le modèle doit inventer une
couleur qu'il n'a jamais vue sur cet objet, et c'est exactement la situation où il dérive le plus.

---

## Décliner sans repartir de zéro

Une variante utile change **une seule variable**. Reprends un prompt qui a marché et modifie
uniquement :

- **La lumière** : matin doux, contre-jour, lumière rasante, ambiance tamisée
- **Le support** : rebord de lavabo, étagère de salle de bain, trousse de toilette ouverte, table de nuit, plateau de voyage
- **La palette** : le blanc et pierre claire actuel, virage beige chaud, ou contraste sur fond ardoise
- **L'échelle** : plan large d'ambiance, plan produit, macro

Génère 4 images par prompt et jette 3. C'est le taux normal.

---

## Contrôle qualité sur chaque sortie

Ordre établi le 27 août sur le lot du lisseur, le premier rendu de cette boutique, adapté à ce
produit.

1. **La taille.** L'objet doit tenir dans le creux de la main et paraître plus petit qu'un verre à dents. Le modèle agrandit systématiquement.
2. **La confusion avec une cigarette électronique.** Aucun embout de vapotage, aucun capuchon, aucun clip. Si le rendu ressemble à une vape, il est bon à jeter.
3. **Les ouvertures de la tête.** Nettes et bien définies. C'est ce qui rend l'objet identifiable comme une tondeuse.
4. **Le marquage de marque.** Zoome. Le modèle l'affadit et invente des marques qui ressemblent.
5. **Les artefacts de bord.** Un bout de doigt, une main coupée, un objet fantôme en lisière. Se règle au recadrage.
6. **Le filigrane.** Étoile en bas à droite sur les sorties de l'app Gemini. Interdit en catalogue. Générer depuis AI Studio, ou recadrer.
7. **Les traces du catalogue.** Aucun chiffre, aucune flèche, aucune pastille orange. Réglé en amont par le recadrage.

---

## Points de vigilance propres à ce produit

Ces règles s'ajoutent à celles des appareils de coiffure, elles ne les remplacent pas.

**Aucune image d'usage réel.** Ni narine, ni gros plan de visage en cours d'utilisation, ni poil
visible. Le geste de ce produit est inmontrable en publicité : il se fait rejeter en modération et
il repousse sur une vignette. C'est la raison pour laquelle le hook de ce produit est la lame
rincée sous l'eau et non le geste.

**Aucun claim médical ou d'hygiène.** Pas de stérile, d'antiseptique, de désinfectant, de sans
douleur garanti, de dispositif médical. Un produit d'entretien personnel n'est pas un dispositif
de santé, et ce glissement se voit dans les visuels avant de se voir dans le texte.

**Aucun signal de danger.** Pas de lame apparente, pas de coupure, pas de sang, pas d'appareil
branché près d'un point d'eau. L'appareil est rechargeable par USB, donc jamais de câble secteur
dans une scène de salle de bain.

**Catalogue.** L'image doit montrer le produit tel qu'il est. Une image générée qui change la
couleur ou la taille est un motif de retrait de fiche, et sur un appareil électrique c'est aussi
le point de départ d'un litige gagné par l'acheteur.

**Le packaging attendra le stock.** Les visuels de boîte, de déballage et de câble USB fourni se
font en photo réelle quand le produit est là.
