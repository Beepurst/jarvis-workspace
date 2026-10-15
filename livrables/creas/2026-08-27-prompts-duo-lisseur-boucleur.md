# Prompts de génération d'images : le duo lisseur + boucleur

> Date : 2026-08-27 · Boutique 2, appareils de coiffure · Offre à 39,90 €
> Statut : **aucun prompt encore rendu**

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

## Pourquoi le duo a ses propres images

Le duo à 39,90 € est **le format de vente par défaut de cette boutique** : il rend 13,17 € de
marge contre 7,58 € pour le lisseur seul et 7,86 € pour le boucleur seul. C'est aussi le seul
dont le ROAS break-even, à 3,48, laisse une chance à la publicité.

Sans visuels dédiés, la fiche la plus rentable de la boutique serait la seule sans image à elle.

**Joins les deux photos sources recadrées dans le même message.** Nano Banana accepte plusieurs
images d'entrée et compose à partir des deux.

---

# Les deux visuels de duo

À produire une seule fois. Ils servent la fiche du duo à 39,90 €, la vignette de collection
Shopify et la bannière d'accueil.

**Joins les deux photos sources dans le même message.** Nano Banana accepte plusieurs images
d'entrée et compose à partir des deux.

## D1. Le duo sur fond blanc, fiche du duo

```
À partir de ces deux images, compose une seule photographie montrant les deux appareils de coiffure ensemble sur un fond blanc pur et uniforme. Supprime tout texte, chiffre, flèche de cotation, pastille et emballage présents dans les images sources. Dispose les deux appareils côte à côte, légèrement en diagonale et parallèles entre eux, le fer à lisser rose à gauche et le fer à boucler noir à droite, avec un espace régulier entre les deux. Ombre portée très douce et diffuse sous chacun, léger reflet au sol. Lumière de studio homogène venant du haut à gauche. Les deux appareils occupent ensemble environ 80 % de la largeur du cadre. Cadrage carré 1:1.

Le premier appareil est un fer à lisser droit et allongé de 30 cm de long, soit environ deux fois la longueur d'une paume adulte, en plastique rose poudré pâle et mat, à deux branches parallèles jointes et fermées, avec un petit écran d'affichage sombre sur la branche supérieure et un câble noir à la base. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas.

Le second appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte. Sa partie chauffante est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. Cette spirale doit rester parfaitement visible et régulière : ne la lisse pas, ne la remplace pas par un cylindre lisse. Il n'y a aucune pince et aucun ressort dessus. Sa poignée est de couleur claire beige très pâle et occupe environ un tiers de la longueur.

Les deux appareils font sensiblement la même longueur et doivent apparaître à la même échelle dans le cadre. Conserve chacun strictement identique à son image source, marquages de marque compris, dans la même police et au même endroit. N'invente aucune marque, n'ajoute aucun logo. Les câbles noirs restent attachés à la base de chaque poignée et retombent naturellement.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucune flèche, aucun logo, aucun filigrane.
```

## D2. Le duo en scène, bannière et contenu

```
À partir de ces deux images, compose une seule photographie montrant les deux appareils de coiffure posés ensemble sur une coiffeuse en bois clair, vus légèrement de dessus. Le fer à lisser rose est posé à plat à gauche, le fer à boucler noir en diagonale à droite, leurs câbles enroulés lâchement. Autour d'eux, avec de l'espace vide : une brosse à cheveux en bois, un miroir à main et une petite serviette blanche pliée. Arrière-plan de chambre lumineuse, flou. Lumière naturelle douce venant de la gauche. Palette blanc cassé, bois clair, rose poudré et noir mat. Composition aérée. Cadrage 4:5.

Le premier appareil est un fer à lisser droit et allongé de 30 cm de long, soit environ deux fois la longueur d'une paume adulte, en plastique rose poudré pâle et mat, à deux branches parallèles jointes et fermées, avec un petit écran d'affichage sombre sur la branche supérieure. Le rose est un rose poudré pâle et mat, pas fuchsia, pas magenta, pas lilas.

Le second appareil mesure 30,5 cm de long, soit environ deux fois la longueur d'une paume adulte. Sa partie chauffante est un cône noir mat parcouru sur toute sa longueur par une rainure hélicoïdale en relief qui s'enroule autour du corps, comme un pas de vis très marqué. Cette spirale doit rester parfaitement visible et régulière : ne la lisse pas, ne la remplace pas par un cylindre lisse. Il n'y a aucune pince et aucun ressort dessus. Sa poignée est de couleur claire beige très pâle.

Les deux appareils font sensiblement la même longueur et doivent apparaître à la même échelle. Conserve chacun strictement identique à son image source, marquages de marque compris. N'invente aucune marque, n'ajoute aucun logo. Les câbles noirs restent attachés à la base de chaque poignée.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun chiffre, aucun logo, aucun filigrane.
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
