# Prompts de génération d'images — La Brumerie

> Date : 2026-08-25 · Produit pilote : White Dream, désodorisant textiles
> Outil : Nano Banana (Gemini 2.5 Flash Image) via Google AI Studio, gratuit
> Réutilisable tel quel sur les autres références du catalogue

**Chaque prompt est autonome.** Le bloc de sécurité est déjà inclus, il n'y a rien
à assembler : tu joins la photo fournisseur et tu colles le prompt entier.

---

## Règle permanente

**Tout jeu de prompts livré pour une référence commence par le packshot premium sans
décor** : produit seul, fond blanc pur, éclairage de studio, ombre douce, cadrage 1:1.
C'est l'image principale de la fiche sur TikTok Shop et sur Shopify, elle existe pour
toutes les références sans exception.

Le détourage de la photo fournisseur reste plus fidèle et ne consomme pas de quota.
Et la génération ne produit pas de fond transparent : pour composer bannières et
vignettes, il faut un PNG détouré.

---

## Volume de production, au 25 août 2026

**Abonnement Google AI payé pour un mois, jusqu'au 25 septembre 2026 environ.** Le
plafond de 3 images par produit, fixé le matin même sur le quota gratuit, est levé
sur cette période. À rappeler avant le 25 septembre : reconduire, ou repasser au
plafond gratuit et à la méthode économe.

**Six images par référence, découpées par fonction et non par plateforme.** TikTok
Shop et Shopify puisent dans la même banque, seuls le ratio et l'ordre d'affichage
changent.

| # | Image | Fonction | Ratio |
|---|---|---|---|
| 1 | Packshot premium sans décor | Fiche, image principale | 1:1 |
| 2 | Packshot fond neutre ou socle | Fiche, secondaire | 1:1 |
| 3 | Produit tenu en main, fond neutre | Fiche, donne l'échelle | 1:1 |
| 4 | Le geste de pulvérisation | Contenu, le hook | 9:16 |
| 5 | Scène d'usage | Contenu | 4:5 |
| 6 | Macro de la brume | Contenu | 1:1 |

L'image 3 est celle que tout le monde oublie. Sur un flacon, l'acheteur ne sait pas
s'il achète 250 ml ou 500 ml, et c'est la première cause de déception à la réception,
donc de retour et d'avis négatif.

**Trois visuels de gamme, produits une seule fois pour toute la marque** et non par
référence : les flacons alignés (collection Shopify, vignette de boutique TikTok
Shop), une bannière horizontale d'accueil, un comparatif des fragrances.

**Garde-fou.** Le chemin critique du projet reste le SIRET et la montée à
Aubervilliers. Produire une banque d'images pour cinq références avant d'avoir acheté
le moindre stock est une façon de se sentir productif sans avancer. Priorité aux six
images de la référence qui partira en premier, puis aux visuels de gamme.

**Repli si le quota est épuisé :** Qwen Chat, Dreamina (ByteDance), Krea.

---

## Deux besoins, deux jeux de règles

| | Fiche produit catalogue TikTok Shop | Contenu / créa |
|---|---|---|
| Fond | Uni, blanc ou neutre clair | Libre |
| Texte incrusté, logo, watermark | **Interdit**, motif de rejet | Libre |
| Ratio | 1:1 (min 600x600) ou 3:4 | 9:16 |
| Le produit occupe | 60 à 80 % du cadre | Libre |
| Fidélité au produit réel | **Obligatoire** | Doit rester honnête |

Pour les prompts 1 et 2, un détourage de la photo fournisseur d'origine (Photoroom,
Pixelcut, Canva) reste supérieur à la génération : il garde les vrais pixels du
produit, donc ni le texte ni la géométrie ne peuvent dériver.

---

## Bilan du premier lot, 25 août 2026

8 rendus, 6 retenus.

| Prompt | Verdict | Motif |
|---|---|---|
| 1 Packshot fond blanc | Gardé | Meilleure fidélité, seul sans filigrane |
| 2 Packshot socle beige | Gardé | Excellent en image de marque |
| 3 Chambre | Refusé | Flacon trapu, pulvérisateur fantomatique, accent É perdu |
| 4 Canapé | Gardé | Forme juste, étiquette nette |
| 5 Buanderie | Gardé | Liquide trop ambré, sans gravité |
| 6 Main qui pulvérise | Gardé, le meilleur | Le geste se lit en une seconde sans son |
| 7 Macro brume | Gardé | Fond sombre hors palette, à réserver au plan d'ouverture |
| 8 Flat lay | Refusé | Flacon aplati en ovale, ce n'est plus le même objet |

**Le défaut n°1 n'est pas le texte de l'étiquette, c'est la géométrie du flacon.**
Le modèle tient le texte et perd la forme, surtout en vue du dessus. Le bloc de
forme intégré à chaque prompt traite précisément ça.

**Le filigrane Gemini** apparaît sur tous les rendus sauf le packshot fond blanc.
Recadrer, ou générer depuis AI Studio plutôt que depuis l'app Gemini.

---

## Les 8 prompts

### 1. Packshot fond blanc — fiche produit catalogue

**Statut : validé le 25/08.** Meilleure fidélité du lot, seul rendu sans filigrane. Nettoyer le léger dégradé gris à droite pour obtenir un blanc pur.

```
À partir de cette image, garde uniquement le flacon et supprime entièrement le décor. Place le flacon seul, parfaitement centré et vertical, sur un fond blanc pur et uniforme. Ajoute une ombre portée très douce et diffuse sous le flacon, et un léger reflet au sol. Lumière de studio homogène venant du haut à gauche, sans point chaud sur le verre. Le flacon occupe environ 75 % de la hauteur du cadre. Cadrage carré 1:1.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 2. Packshot socle beige — seconde image de fiche

**Statut : validé le 25/08.** Recadrer le filigrane.

```
À partir de cette image, isole le flacon et repose-le sur un socle de pierre beige clair, devant un fond uni couleur lin très pâle légèrement dégradé du clair vers le sombre en bas. Lumière naturelle latérale douce, ombre longue et nette portée vers la droite. Ambiance minimaliste haut de gamme, aucun autre objet dans le cadre. Cadrage carré 1:1.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 3. Chambre, lumière du matin

**Statut : refusé le 25/08**, flacon trapu et pulvérisateur fantomatique. Le bloc de forme a été renforcé ci-dessous.

```
Place ce flacon sur une table de chevet en bois clair, dans une chambre baignée de lumière naturelle du matin. En arrière-plan flou, un lit défait avec des draps en coton blanc froissés et un oreiller. Rayon de soleil traversant le cadre en diagonale, poussières en suspension visibles dans la lumière. Profondeur de champ courte, seul le flacon est net. Ambiance calme et chaleureuse, tons blancs et beiges. Cadrage vertical 9:16.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, opaque et bien matérialisé, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Il ne doit être ni transparent au point de disparaître, ni détaché du flacon. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 4. Canapé, salon

**Statut : validé le 25/08.** Recadrer le filigrane.

```
Place ce flacon debout sur l'accoudoir d'un canapé en lin beige, avec un plaid en maille écrue négligemment posé à côté. Arrière-plan flou de salon contemporain lumineux. Lumière naturelle douce de fin d'après-midi venant de la gauche. Palette blanc cassé, beige, bois clair. Cadrage vertical 9:16.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 5. Buanderie, étagère

**Statut : validé le 25/08.** Liquide un peu trop ambré, sans gravité. Recadrer le filigrane.

```
Place ce flacon sur une étagère blanche, à côté d'une pile de serviettes en coton blanc pliées et d'un panier en osier. Arrière-plan de buanderie soignée et lumineuse, légèrement flou. Lumière douce et diffuse, aucune ombre dure. Ambiance ordonnée et fraîche. Cadrage vertical 9:16.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 6. Main qui pulvérise — le prioritaire

**Statut : validé le 25/08, meilleur visuel du lot.** C'est le hook : le geste se comprend en une seconde sans son. Recadrer le filigrane.

```
Une main de femme aux ongles courts et naturels tient ce flacon et presse la gâchette, pulvérisant une fine brume vers un coussin en lin beige posé sur un canapé. La brume est visible, fine et diffuse, éclairée à contre-jour par une fenêtre hors champ. Le flacon et la main sont nets au premier plan à droite, le coussin légèrement flou. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette. Photographie lifestyle naturelle, lumière du jour. Cadrage vertical 9:16.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit, nettement plus haut que large, dans un rapport hauteur/diamètre d'environ 2,5 pour 1. Ne l'aplatis pas, ne l'élargis pas, ne le rends pas trapu, ne le transforme pas en flacon ovale ou rectangulaire. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 7. Macro de la brume à contre-jour

**Statut : validé le 25/08.** Réserve : le fond sombre sort de la palette blanc et beige de la marque. À utiliser en plan d'ouverture, pas comme identité.

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond sombre et neutre. Chaque gouttelette est captée nettement, effet de lumière rasante. Photographie macro, vitesse d'obturation rapide. Cadrage vertical 9:16.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette.

Le flacon est un cylindre droit en verre transparent d'environ 500 ml, à épaules arrondies courtes et col étroit. Le pulvérisateur à gâchette est en plastique translucide incolore, solidement vissé sur le col, avec une gâchette longue inclinée vers l'avant. Le liquide à l'intérieur est quasiment incolore, à peine teinté, transparent et non ambré.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

### 8. Flat lay, vue du dessus

**Statut : refusé deux fois**, flacon aplati en ovale. Le bloc vue du dessus est désormais placé en tête du prompt, avant le bloc de sécurité.

```
Vue du dessus à la verticale. Ce flacon est posé à plat au centre d'une surface en lin froissé blanc cassé. Autour de lui, disposés harmonieusement avec de l'espace vide : deux serviettes en coton blanc pliées, quelques capsules de coton et deux fleurs de jasmin blanc. Lumière naturelle douce du haut, ombres légères. Composition aérée, palette entièrement blanc et beige. Cadrage vertical 9:16.

Le flacon est vu strictement à la verticale depuis le dessus, couché à plat, et conserve sa longueur réelle dans le cadre. Vu du dessus, il reste un cylindre allongé nettement plus long que large, dans un rapport longueur/largeur d'environ 2,5 pour 1, avec le pulvérisateur à gâchette qui prolonge le corps. Ne le raccourcis pas, ne l'aplatis pas en ovale, ne l'écrase pas en forme de galet.

Conserve le flacon et son étiquette strictement identiques à l'image source : même flacon en verre transparent, même pulvérisateur à gâchette en plastique translucide, même liquide clair très légèrement teinté. L'étiquette reste un rectangle blanc à fin liseré, avec l'illustration de branches de coton en arrière-plan, le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police ni la mise en page de l'étiquette. Les fleurs de coton de l'étiquette restent brun-beige, pas roses.

Photographie produit réaliste, pas d'illustration, pas de rendu 3D, aucun texte ajouté, aucun logo, aucun filigrane.
```

---

## Décliner sans repartir de zéro

Une variante utile change **une seule variable**. Reprends un prompt qui a marché
et modifie uniquement :

- **La lumière** : matin doux, contre-jour, lumière rasante de fin de journée, ambiance tamisée du soir
- **Le support** : lit, canapé, rideau, veste sur cintre, siège de voiture, panier de linge
- **La palette** : le tout blanc actuel, virage beige chaud, ou contraste sur fond sombre
- **L'échelle** : plan large d'ambiance, plan produit, macro

Génère 4 images par prompt et jette 3. C'est le taux normal.

---

## Contrôle qualité sur chaque sortie

Par ordre de fréquence réellement constatée.

1. **La géométrie du flacon.** Cylindre droit et élancé, pas ovale, pas trapu. Dérape surtout en vue du dessus.
2. **Le pulvérisateur.** Doit rester matérialisé et vissé au col, pas fantomatique ni flottant.
3. **La couleur du liquide.** Elle vire à l'ambré. L'original est quasi incolore.
4. **Le filigrane.** Étoile en bas à droite sur les sorties de l'app Gemini. Interdit en catalogue.
5. **Le texte de l'étiquette.** Zoome. "DÉSODORISANT TEXTILES", accent compris.
6. **Le nombre de doigts** sur le prompt 6.

---

## Points de vigilance

**Catalogue.** L'image doit montrer le produit tel qu'il est. Une image générée qui
change la contenance ou la forme du flacon est un motif de retrait de fiche.

**Claims.** Ne rien générer qui suggère un effet antibactérien, désinfectant,
assainissant ou hypoallergénique. Éviter tout visuel de pulvérisation vers une
peau, un visage, un bébé ou un animal. Un désodorisant textile est un produit
parfumant, pas un produit d'hygiène, et ce glissement se voit dans les visuels
avant de se voir dans le texte.

**Outils gratuits.** Google AI Studio (aistudio.google.com) donne Nano Banana
gratuitement avec un quota confortable. Alternatives : Qwen Chat, Dreamina
(ByteDance/Seedream), Krea. Les quotas bougent tous les deux mois, vérifier au
moment de s'en servir.
