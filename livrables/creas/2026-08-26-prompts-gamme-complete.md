# Prompts d'images — gamme complète, 5 références x 4 visuels

> Date : 2026-08-26 · La Brumerie · Outil : Nano Banana via Google AI Studio
> **Ce fichier remplace tous les jeux de prompts précédents.** Les 20 prompts sont
> autonomes : tu joins la photo fournisseur de la référence et tu colles le prompt
> entier, il n'y a rien à assembler.

---

## Les trois corrections, validées sur White Dream le 26 août 2026

Chacune a coûté une série de tirages. Les blocs sont figés, **ne les retouche plus.**

### 1. La proportion du flacon

Deux erreurs successives : un rapport hauteur/diamètre de 2,3 pour 1 **sans préciser
s'il incluait le pulvérisateur**, que le modèle a appliqué au corps en verre seul et
qui a donné des bouteilles de shampoing ; puis l'épaule bombée non décrite, qui a
donné des tubes droits.

Ce qui marche : **des centimètres réels plutôt qu'un rapport** (13 cm de haut pour
7 cm de diamètre sur le corps en verre, 20 cm avec le pulvérisateur), l'épaule en
dôme décrite explicitement, et des interdictions nommées.

### 2. La taille du flacon dans la scène

Problème distinct, propre aux visuels lifestyle. Dans un décor, le modèle n'a aucun
repère et rend un flacon de 500 ml gros comme un bidon de 2 litres. La correction est
un objet de comparaison familier : plus bas qu'une bouteille d'eau d'un litre, à
peine plus haut qu'un grand mug, tient dans une seule main.

### 3. Le rendu 3D, et le piège du matériel d'éclairage

Un packshot décrit en « éclairage de studio homogène » et « verre propre sans traces
ni poussières » sort en mockup de synthèse. Écrire « pas de rendu 3D » à la fin ne
compense pas.

Ce qui marche : **nommer le matériel photographique réel** (reflex, objectif macro
100 mm, f/8, boîte à lumière à gauche, réflecteur à droite), interdire les reflets en
bandes plates, et demander une légère granulation. La mention « verre sans traces ni
poussières » a été supprimée, elle jouait contre le réalisme.

**Le piège, payé deux fois :** décrire le matériel d'éclairage fait dessiner le matériel
dans l'image. Ajouter « tout est hors champ » ne suffit pas, le seul fait de nommer une
boîte à lumière ou un réflecteur lui laisse une chance d'apparaître. **La correction
fiable est de supprimer les noms d'équipement** et de ne décrire que la qualité de la
lumière, suivie d'une exclusion absolue : aucun objet autre que le flacon dans le cadre.

---

## État de la banque au 26 août 2026 : complète

**20 visuels sur 20 validés.** Cinq références, quatre visuels chacune.

| Référence | Packshot | Geste | Scène | Macro |
|---|---|---|---|---|
| White Dream | OK | OK | OK | OK |
| Jasmin Fleur d'oranger | OK | OK | OK | OK |
| Baby Love | OK | contenu seulement | OK | OK |
| Ameerat | OK | contenu seulement | OK | OK |
| Khamra | OK | OK | OK | OK |

**« Contenu seulement »** signifie utilisable en 9:16 dans le feed TikTok, où personne
ne lit l'étiquette, mais **à ne pas recadrer en 1:1 pour une fiche produit** : le texte
de l'étiquette y porte une faute (BÉSODORISANT sur Ameerat) ou est illisible.

### Ce que le geste coûte, et pourquoi

Sur les cinq références, **le geste est le visuel qui rate le plus souvent**, toujours
sur le texte de l'étiquette. La cause est structurelle : le flacon y est incliné, tenu,
partiellement masqué par la main, et plus petit dans le cadre. C'est la configuration
la plus défavorable au rendu du texte. Compter deux à trois tirages sur ce visuel,
contre un seul en général sur les trois autres.

### Réserves relevées

- **Macro d'Ameerat** : le liquide tire vers l'ambré à cause du fond rouge et or. Seule,
  l'image est superbe ; **posée à côté de Khamra dans un carrousel de gamme, les deux
  références deviennent confondables.** Refaire sur fond crème si affichage conjoint.
- **Geste de Khamra** : la tache d'impact sur la laine brune est si marquée qu'elle se
  lit comme une auréole. Acceptable en vidéo où la brume est en mouvement, à éviter en
  image fixe de fiche.

### Ce qui reste à faire, sans générer

1. Détourer les cinq packshots en PNG transparent, matière de tout le reste
2. Composer l'image de gamme à la main sur fond crème, jamais en génération
3. Ranger dans Drive selon `source / fiche / contenu`

---

## Contrôle qualité, par ordre de fréquence constatée

1. **La silhouette.** Compare la hauteur du corps en verre à sa largeur, face à la photo fournisseur.
2. **La taille dans la scène.** Le flacon doit paraître petit et familier.
3. **Le matériel de studio dans le cadre.** Boîtes à lumière, bords noirs, pieds.
4. **L'orthographe du nom.** Fautes déjà constatées : AMCERAT, KHAMNA, TEXTILFS.
5. **La contamination entre étiquettes.** Le coton n'appartient qu'à White Dream, les fleurs et oranges qu'à Jasmin, les dessins de bébé qu'à Baby Love.
6. **Le pulvérisateur blanc de Khamra**, entouré de quatre translucides.
7. **La couleur du liquide.** Dérive vers le vert ou le jaune sur les incolores. Écart à préserver entre le rose froid de Baby Love et le rosé pêche d'Ameerat.
8. **Le filigrane.** Générer depuis AI Studio, pas depuis l'app Gemini.

---

## Image de gamme : générable, mais seulement à partir des packshots détourés

**Constat révisé le 26 août 2026, en fin de journée.** La première conclusion était
qu'une image de gamme ne pouvait pas se générer. Elle valait pour des tirages faits à
partir des photos fournisseur : le modèle devait alors redessiner cinq étiquettes,
et il en cassait toujours une.

**Ce qui a débloqué : fournir les cinq packshots déjà détourés en PNG transparent, et
interdire explicitement de les redessiner.** Le travail du modèle devient une
composition, pas une génération. Formule qui marche, en tête de prompt :

> RÈGLE ABSOLUE. Utilise les cinq flacons fournis TELS QUELS. Ne les redessine pas, ne
> les réinterprète pas, ne redessine aucune étiquette, ne réécris aucun texte. Ton
> travail consiste uniquement à les placer, les mettre à l'échelle, et à créer autour
> d'eux le fond, la lumière, les ombres et les reflets.

Trois autres choses ont été nécessaires :

1. **Un paragraphe VÉRIFICATIONS PRIORITAIRES** nommant les trois points fragiles :
   liquide incolore de White Dream, étiquette rouge à panneau crème d'Ameerat,
   pulvérisateur blanc opaque de Khamra. Sans lui, chaque tirage en cassait un.
2. **Ne pas toucher au paragraphe COMPOSITION une fois qu'un tirage est bon.** Une
   modification de l'espacement seul a suffi à faire réinventer l'étiquette d'Ameerat
   en rose à couronnes. Changer une variable en casse une autre.
3. **Sur le format 16:9, agrandir les flacons.** Groupe sur la moitié droite et flacons
   à 55 % de la hauteur : le texte fin se dégradait sur quatre étiquettes sur cinq.
   Passés à **80 % de la hauteur du cadre et 60 % de la largeur**, tout est redevenu
   net. Le problème n'était pas la formulation mais le nombre de pixels alloués au
   texte.

**Règle de sortie :** deux tirages maximum par correction. Au-delà, composer à la main
dans Canva à partir des packshots détourés reste plus rapide et sans risque.

---

## Ancien constat, conservé pour mémoire : ne pas générer depuis les photos fournisseur

**Constat du 26 août, après cinq tirages et trois passes d'édition.** Une composition
réunissant les cinq flacons demande cinq textes fins simultanément corrects. Le modèle
n'y arrive pas : chaque tirage répare une étiquette et en casse une autre.

Les passes d'édition ciblées ne règlent rien : **Nano Banana ne retouche pas une zone,
il régénère l'image entière.** Trois passes ont réparé deux étiquettes et abîmé les
trois autres.

**Méthode retenue : compositing manuel.** Fond crème uni, les cinq packshots détourés
alignés, ombres portées ajoutées dans l'éditeur. Vingt minutes, cinq étiquettes justes
par construction.

---

# White Dream

Dossier Drive : `01-white-dream`

### A. Packshot premium sans décor — 1:1 — fiche produit

```
Photographie publicitaire du flacon de cette image, seul, sans aucun décor : plus aucune fleur de coton posée autour, aucune fleur blanche, aucun tissu, aucun objet. Le flacon est parfaitement centré et vertical sur un fond blanc uni très légèrement dégradé vers un gris très pâle dans les angles inférieurs.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/8, à hauteur du milieu du flacon. La lumière est large, douce et très diffuse, venant du haut à gauche, adoucie à droite pour lever les ombres, avec un léger contre-jour qui détache l'épaule du flacon. AUCUN OBJET AUTRE QUE LE FLACON N'EST VISIBLE DANS L'IMAGE : le cadre ne contient que le flacon et un fond blanc pur, uniforme et entièrement vide. Aucun panneau, aucun cadre, aucun bord noir, aucune surface sombre, aucune structure, aucun accessoire, aucun matériel, ni sur les côtés ni dans les angles ni en arrière-plan. Sur le verre, la lumière laisse un reflet vertical long et adouci aux bords ; les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes. Le verre a la matière d'un vrai verre photographié : quelques micro-reflets, de très légères variations de netteté sur les bords, aucun aspect lisse et synthétique. Ombre portée douce et courte sous le flacon, et un reflet au sol très atténué qui disparaît en fondu. Texture d'image photographique naturelle, très légère granulation.

CADRAGE. Le flacon, pulvérisateur compris, occupe environ 90 % de la hauteur du cadre et est bien rempli dans la largeur : il ne doit pas paraître petit ni perdu au milieu du carré. Cadrage carré 1:1.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : illustration aquarellée de branches et de capsules de coton beige et brun, et par-dessus un panneau rectangulaire blanc à fin liseré portant le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Le nom s'écrit exactement W-H-I-T-E espace D-R-E-A-M. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune, aucune teinte dorée.

Vraie photographie de studio, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

### B. Le geste, pulvérisation vers un textile — 9:16 — hook TikTok

```
Une main de femme aux ongles courts et naturels tient ce flacon dans la moitié droite du cadre et presse la gâchette. Le flacon est tenu presque vertical, à peine incliné, son étiquette bien face à l'objectif et non déformée par la perspective. La buse du pulvérisateur est clairement visible, vue de trois quarts, et pointée droit vers une chemise en lin blanc suspendue à un cintre en bois, qui occupe la moitié gauche du cadre, à environ 25 centimètres de distance. Un cône de brume très fine part de la buse en ligne droite et vient frapper le tissu : la trajectoire est nette et lisible du bec jusqu'au textile, et l'on voit distinctement les gouttelettes atteindre la surface et l'assombrir très légèrement à l'endroit de l'impact, où le tissu devient un peu plus foncé et satiné. Quelques gouttelettes restent en suspension autour du point d'impact. La brume est éclairée à contre-jour par une fenêtre hors champ à gauche. Le flacon, la main et la buse sont nets, le textile est légèrement moins net. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette, l'index sur la gâchette. Ambiance de buanderie claire et ordonnée, lumière naturelle du matin, palette blanc, beige, écru, bois clair. Cadrage vertical 9:16, avec de la marge autour du flacon pour permettre un recadrage carré ultérieur.

DIRECTION DE LA BRUME. Elle doit partir de la buse et aller vers le textile, jamais dans une autre direction, jamais derrière le flacon, jamais dans le vide.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent. La main l'enveloppe largement : le corps du flacon n'est pas plus large que la paume.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : illustration aquarellée de branches et de capsules de coton beige et brun, et par-dessus un panneau rectangulaire blanc à fin liseré portant le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Le nom s'écrit exactement W-H-I-T-E espace D-R-E-A-M. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune, aucune teinte dorée.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucune épice, aucun agrume, aucun aliment dans le cadre.
```

### C. Scène d'usage — 4:5 — TikTok Shop et Shopify

```
Place ce flacon sur une étagère blanche, à côté d'une pile de serviettes en coton blanc pliées et d'un panier en osier. Arrière-plan de buanderie soignée et lumineuse, légèrement flou. Lumière du jour douce et diffuse, aucune ombre dure. Ambiance ordonnée et fraîche. Le flacon est net et occupe environ 60 % de la hauteur du cadre. Palette blanc, beige, écru, bois clair. Cadrage vertical 4:5.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : illustration aquarellée de branches et de capsules de coton beige et brun, et par-dessus un panneau rectangulaire blanc à fin liseré portant le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Le nom s'écrit exactement W-H-I-T-E espace D-R-E-A-M. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune, aucune teinte dorée.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucune épice, aucun agrume, aucun aliment dans le cadre.
```

### D. Macro de la brume — 1:1 — image secondaire de fiche

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond clair et doux en dégradé de blanc chaud très flou. Chaque gouttelette est captée nettement, effet de lumière rasante. Le haut du flacon et l'étiquette restent nets et lisibles dans le tiers gauche du cadre. Cadrage carré 1:1.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/5,6 et une vitesse d'obturation très rapide qui fige les gouttelettes en plein vol. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : illustration aquarellée de branches et de capsules de coton beige et brun, et par-dessus un panneau rectangulaire blanc à fin liseré portant le texte "White Dream" en script doré-brun et, en dessous, "DÉSODORISANT TEXTILES" en capitales fines espacées, accent aigu sur le E compris. Le nom s'écrit exactement W-H-I-T-E espace D-R-E-A-M. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune, aucune teinte dorée.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

---

# Jasmin Fleur d'oranger

Dossier Drive : `02-jasmin-fleur-oranger`

### A. Packshot premium sans décor — 1:1 — fiche produit

```
Photographie publicitaire du flacon de cette image, seul, sans aucun décor : plus aucun agrume, aucune fleur, aucune feuille, aucune éclaboussure d'eau, aucun objet. Le flacon est parfaitement centré et vertical sur un fond blanc uni très légèrement dégradé vers un gris très pâle dans les angles inférieurs.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/8, à hauteur du milieu du flacon. La lumière est large, douce et très diffuse, venant du haut à gauche, adoucie à droite pour lever les ombres, avec un léger contre-jour qui détache l'épaule du flacon. AUCUN OBJET AUTRE QUE LE FLACON N'EST VISIBLE DANS L'IMAGE : le cadre ne contient que le flacon et un fond blanc pur, uniforme et entièrement vide. Aucun panneau, aucun cadre, aucun bord noir, aucune surface sombre, aucune structure, aucun accessoire, aucun matériel, ni sur les côtés ni dans les angles ni en arrière-plan. Sur le verre, la lumière laisse un reflet vertical long et adouci aux bords ; les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes. Le verre a la matière d'un vrai verre photographié : quelques micro-reflets, de très légères variations de netteté sur les bords, aucun aspect lisse et synthétique. Ombre portée douce et courte sous le flacon, et un reflet au sol très atténué qui disparaît en fondu. Texture d'image photographique naturelle, très légère granulation.

CADRAGE. Le flacon, pulvérisateur compris, occupe environ 90 % de la hauteur du cadre et est bien rempli dans la largeur : il ne doit pas paraître petit ni perdu au milieu du carré. Cadrage carré 1:1.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond blanc entièrement couvert d'une illustration dense de fleurs de jasmin et de fleurs d'oranger blanches à cœur jaune, de feuilles vertes brillantes et de petites oranges. Aucune capsule de coton sur cette étiquette. Au CENTRE de l'étiquette, un bandeau rectangulaire orange vif à coins arrondis. Ce bandeau porte, sur deux lignes en écriture manuscrite blanche parfaitement lisible, "Jasmin" puis "Fleur d'oranger", avec une petite orange dessinée à droite. En dessous du bandeau, "DÉSODORISANT TEXTILES" en capitales fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste orange vif, pas rouge ni jaune.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune.

Vraie photographie de studio, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

### B. Le geste, pulvérisation vers un textile — 9:16 — hook TikTok

```
Une main de femme aux ongles courts et naturels tient ce flacon dans la moitié droite du cadre et presse la gâchette. Le flacon est tenu presque vertical, à peine incliné, son étiquette bien face à l'objectif et non déformée par la perspective. La buse du pulvérisateur est clairement visible, vue de trois quarts, et pointée droit vers un rideau de lin blanc légèrement soulevé par le vent devant une fenêtre ouverte, qui occupe la moitié gauche du cadre, à environ 25 centimètres de distance. Un cône de brume très fine part de la buse en ligne droite et vient frapper le tissu : la trajectoire est nette et lisible du bec jusqu'au textile, et l'on voit distinctement les gouttelettes atteindre la surface et l'assombrir très légèrement à l'endroit de l'impact, où le tissu devient un peu plus foncé et satiné. Quelques gouttelettes restent en suspension autour du point d'impact. La brume est éclairée à contre-jour par une fenêtre hors champ à gauche. Le flacon, la main et la buse sont nets, le textile est légèrement moins net. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette, l'index sur la gâchette. Ambiance méditerranéenne solaire, feuillage vert lumineux et flou dehors, lumière chaude de fin de matinée, palette blanc, vert feuille, bois clair, touches d'orange. Cadrage vertical 9:16, avec de la marge autour du flacon pour permettre un recadrage carré ultérieur.

DIRECTION DE LA BRUME. Elle doit partir de la buse et aller vers le textile, jamais dans une autre direction, jamais derrière le flacon, jamais dans le vide.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent. La main l'enveloppe largement : le corps du flacon n'est pas plus large que la paume.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond blanc entièrement couvert d'une illustration dense de fleurs de jasmin et de fleurs d'oranger blanches à cœur jaune, de feuilles vertes brillantes et de petites oranges. Aucune capsule de coton sur cette étiquette. Au CENTRE de l'étiquette, un bandeau rectangulaire orange vif à coins arrondis. Ce bandeau porte, sur deux lignes en écriture manuscrite blanche parfaitement lisible, "Jasmin" puis "Fleur d'oranger", avec une petite orange dessinée à droite. En dessous du bandeau, "DÉSODORISANT TEXTILES" en capitales fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste orange vif, pas rouge ni jaune.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun agrume, aucun aliment dans le cadre.
```

### C. Scène d'usage — 4:5 — TikTok Shop et Shopify

```
Place ce flacon debout sur un rebord de fenêtre en bois clair, à côté d'une pile de serviettes en coton blanc pliées et d'une petite branche de feuillage vert dans un verre. Derrière, une fenêtre ouverte sur un jardin ensoleillé, très flou. Lumière du jour chaude de fin de matinée entrant par la gauche, ombres douces et allongées. Ambiance méditerranéenne lumineuse et fraîche. Le flacon est net et occupe environ 60 % de la hauteur du cadre. Palette blanc, vert feuille, bois clair, touches d'orange. Cadrage vertical 4:5.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond blanc entièrement couvert d'une illustration dense de fleurs de jasmin et de fleurs d'oranger blanches à cœur jaune, de feuilles vertes brillantes et de petites oranges. Aucune capsule de coton sur cette étiquette. Au CENTRE de l'étiquette, un bandeau rectangulaire orange vif à coins arrondis. Ce bandeau porte, sur deux lignes en écriture manuscrite blanche parfaitement lisible, "Jasmin" puis "Fleur d'oranger", avec une petite orange dessinée à droite. En dessous du bandeau, "DÉSODORISANT TEXTILES" en capitales fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste orange vif, pas rouge ni jaune.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun agrume, aucun aliment dans le cadre.
```

### D. Macro de la brume — 1:1 — image secondaire de fiche

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond clair et doux en dégradé de blanc chaud et de vert feuille très flou. Chaque gouttelette est captée nettement, effet de lumière rasante. Le haut du flacon et l'étiquette restent nets et lisibles dans le tiers gauche du cadre. Cadrage carré 1:1.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/5,6 et une vitesse d'obturation très rapide qui fige les gouttelettes en plein vol. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond blanc entièrement couvert d'une illustration dense de fleurs de jasmin et de fleurs d'oranger blanches à cœur jaune, de feuilles vertes brillantes et de petites oranges. Aucune capsule de coton sur cette étiquette. Au CENTRE de l'étiquette, un bandeau rectangulaire orange vif à coins arrondis. Ce bandeau porte, sur deux lignes en écriture manuscrite blanche parfaitement lisible, "Jasmin" puis "Fleur d'oranger", avec une petite orange dessinée à droite. En dessous du bandeau, "DÉSODORISANT TEXTILES" en capitales fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste orange vif, pas rouge ni jaune.

LIQUIDE. PARFAITEMENT INCOLORE ET TRANSPARENT, exactement comme de l'eau claire. Aucune teinte verte, aucune teinte jaune.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

---

# Baby Love

Dossier Drive : `03-baby-love`

### A. Packshot premium sans décor — 1:1 — fiche produit

```
Photographie publicitaire du flacon de cette image, seul, sans aucun décor : plus aucun ourson, aucun chausson, aucune serviette, aucun jouet, aucune capsule de coton, aucune éclaboussure d'eau. Le flacon est parfaitement centré et vertical sur un fond blanc uni très légèrement dégradé vers un gris très pâle dans les angles inférieurs.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/8, à hauteur du milieu du flacon. La lumière est large, douce et très diffuse, venant du haut à gauche, adoucie à droite pour lever les ombres, avec un léger contre-jour qui détache l'épaule du flacon. AUCUN OBJET AUTRE QUE LE FLACON N'EST VISIBLE DANS L'IMAGE : le cadre ne contient que le flacon et un fond blanc pur, uniforme et entièrement vide. Aucun panneau, aucun cadre, aucun bord noir, aucune surface sombre, aucune structure, aucun accessoire, aucun matériel, ni sur les côtés ni dans les angles ni en arrière-plan. Sur le verre, la lumière laisse un reflet vertical long et adouci aux bords ; les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes. Le verre a la matière d'un vrai verre photographié : quelques micro-reflets, de très légères variations de netteté sur les bords, aucun aspect lisse et synthétique. Ombre portée douce et courte sous le flacon, et un reflet au sol très atténué qui disparaît en fondu. Texture d'image photographique naturelle, très légère granulation.

CADRAGE. Le flacon, pulvérisateur compris, occupe environ 90 % de la hauteur du cadre et est bien rempli dans la largeur : il ne doit pas paraître petit ni perdu au milieu du carré. Cadrage carré 1:1.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond rose pâle couvert de petits dessins au trait fin sur le thème du bébé, en bleu et en rose, bavoir, épingle à nourrice, tétine, nœud, biberon, empreintes de pieds, ourson, soleil et cœurs. Aucune capsule de coton sur cette étiquette. Au centre, un bandeau rectangulaire horizontal partagé en deux moitiés, bleu à gauche et rose à droite, portant le texte "Baby Love" en lettres blanches rondes et épaisses, "Baby" sur la moitié bleue et "Love" sur la moitié rose. En dessous du bandeau, deux courts traits horizontaux, puis "DÉSODORISANT TEXTILES" en capitales blanches fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste strictement bicolore, bleu à gauche et rose à droite, jamais d'une seule couleur.

LIQUIDE. Rose pâle, translucide et limpide, ni fuchsia ni orangé.

Vraie photographie de studio, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

### B. Le geste, pulvérisation vers un textile — 9:16 — hook TikTok

```
Une main de femme aux ongles courts et naturels tient ce flacon dans la moitié droite du cadre et presse la gâchette. Le flacon est tenu presque vertical, à peine incliné, son étiquette bien face à l'objectif et non déformée par la perspective. La buse du pulvérisateur est clairement visible, vue de trois quarts, et pointée droit vers une couverture en maille écrue pliée, posée sur une commode en bois clair, qui occupe la moitié gauche du cadre, à environ 25 centimètres de distance. Un cône de brume très fine part de la buse en ligne droite et vient frapper le tissu : la trajectoire est nette et lisible du bec jusqu'au textile, et l'on voit distinctement les gouttelettes atteindre la surface et l'assombrir très légèrement à l'endroit de l'impact, où le tissu devient un peu plus foncé et satiné. Quelques gouttelettes restent en suspension autour du point d'impact. La brume est éclairée à contre-jour par une fenêtre hors champ à gauche. Le flacon, la main et la buse sont nets, le textile est légèrement moins net. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette, l'index sur la gâchette. Ambiance de chambre d'enfant douce et lumineuse, lumière naturelle du matin, palette rose poudré, blanc, bleu ciel très pâle, bois clair. Cadrage vertical 9:16, avec de la marge autour du flacon pour permettre un recadrage carré ultérieur.

ARRIÈRE-PLAN. Il ne contient qu'un mur clair, un rideau clair et éventuellement le meuble sur lequel repose le linge. AUCUN BERCEAU, aucun lit à barreaux, aucun montant à barreaux verticaux en bois, aucun mobilier de couchage, aucune peluche, aucun jouet, aucun objet de puériculture. Rien qui évoque un couchage de nourrisson.

DIRECTION DE LA BRUME. Elle doit partir de la buse et aller vers le textile, jamais dans une autre direction, jamais derrière le flacon, jamais dans le vide.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent. La main l'enveloppe largement : le corps du flacon n'est pas plus large que la paume.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond rose pâle couvert de petits dessins au trait fin sur le thème du bébé, en bleu et en rose, bavoir, épingle à nourrice, tétine, nœud, biberon, empreintes de pieds, ourson, soleil et cœurs. Aucune capsule de coton sur cette étiquette. Au centre, un bandeau rectangulaire horizontal partagé en deux moitiés, bleu à gauche et rose à droite, portant le texte "Baby Love" en lettres blanches rondes et épaisses, "Baby" sur la moitié bleue et "Love" sur la moitié rose. En dessous du bandeau, deux courts traits horizontaux, puis "DÉSODORISANT TEXTILES" en capitales blanches fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste strictement bicolore, bleu à gauche et rose à droite, jamais d'une seule couleur.

LIQUIDE. Rose pâle, translucide et limpide, ni fuchsia ni orangé.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun bébé, aucun enfant, aucune personne visible en dehors de la main s'il y en a une. Aucun berceau, aucune peluche, aucun jouet.
```

### C. Scène d'usage — 4:5 — TikTok Shop et Shopify

```
Place ce flacon debout sur une étagère en bois clair, à côté d'une pile de linge plié en coton blanc et rose poudré et d'un panier en osier tressé. Arrière-plan de chambre claire et ordonnée, mur blanc, légèrement flou. Lumière du jour douce et diffuse du matin, aucune ombre dure. Le flacon est net et occupe environ 60 % de la hauteur du cadre. Palette rose poudré, blanc, bleu ciel très pâle, bois clair. Cadrage vertical 4:5.

ARRIÈRE-PLAN. Il ne contient qu'un mur clair, un rideau clair et éventuellement le meuble sur lequel repose le linge. AUCUN BERCEAU, aucun lit à barreaux, aucun montant à barreaux verticaux en bois, aucun mobilier de couchage, aucune peluche, aucun jouet, aucun objet de puériculture. Rien qui évoque un couchage de nourrisson.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond rose pâle couvert de petits dessins au trait fin sur le thème du bébé, en bleu et en rose, bavoir, épingle à nourrice, tétine, nœud, biberon, empreintes de pieds, ourson, soleil et cœurs. Aucune capsule de coton sur cette étiquette. Au centre, un bandeau rectangulaire horizontal partagé en deux moitiés, bleu à gauche et rose à droite, portant le texte "Baby Love" en lettres blanches rondes et épaisses, "Baby" sur la moitié bleue et "Love" sur la moitié rose. En dessous du bandeau, deux courts traits horizontaux, puis "DÉSODORISANT TEXTILES" en capitales blanches fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste strictement bicolore, bleu à gauche et rose à droite, jamais d'une seule couleur.

LIQUIDE. Rose pâle, translucide et limpide, ni fuchsia ni orangé.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun bébé, aucun enfant, aucune personne visible en dehors de la main s'il y en a une. Aucun berceau, aucune peluche, aucun jouet.
```

### D. Macro de la brume — 1:1 — image secondaire de fiche

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond clair et doux en dégradé de blanc et de rose poudré très flou. Chaque gouttelette est captée nettement, effet de lumière rasante. Le haut du flacon et l'étiquette restent nets et lisibles dans le tiers gauche du cadre. Cadrage carré 1:1.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/5,6 et une vitesse d'obturation très rapide qui fige les gouttelettes en plein vol. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un fond rose pâle couvert de petits dessins au trait fin sur le thème du bébé, en bleu et en rose, bavoir, épingle à nourrice, tétine, nœud, biberon, empreintes de pieds, ourson, soleil et cœurs. Aucune capsule de coton sur cette étiquette. Au centre, un bandeau rectangulaire horizontal partagé en deux moitiés, bleu à gauche et rose à droite, portant le texte "Baby Love" en lettres blanches rondes et épaisses, "Baby" sur la moitié bleue et "Love" sur la moitié rose. En dessous du bandeau, deux courts traits horizontaux, puis "DÉSODORISANT TEXTILES" en capitales blanches fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. Le bandeau reste strictement bicolore, bleu à gauche et rose à droite, jamais d'une seule couleur.

LIQUIDE. Rose pâle, translucide et limpide, ni fuchsia ni orangé.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

---

# Ameerat

Dossier Drive : `05-ameerat`

### A. Packshot premium sans décor — 1:1 — fiche produit

```
Photographie publicitaire du flacon de cette image, seul, sans aucun décor : plus aucun agrume, aucune fleur, aucune feuille, aucun morceau de bois, aucune capsule de coton, aucune éclaboussure de liquide. Le flacon est parfaitement centré et vertical sur un fond blanc uni très légèrement dégradé vers un gris très pâle dans les angles inférieurs.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/8, à hauteur du milieu du flacon. La lumière est large, douce et très diffuse, venant du haut à gauche, adoucie à droite pour lever les ombres, avec un léger contre-jour qui détache l'épaule du flacon. AUCUN OBJET AUTRE QUE LE FLACON N'EST VISIBLE DANS L'IMAGE : le cadre ne contient que le flacon et un fond blanc pur, uniforme et entièrement vide. Aucun panneau, aucun cadre, aucun bord noir, aucune surface sombre, aucune structure, aucun accessoire, aucun matériel, ni sur les côtés ni dans les angles ni en arrière-plan. Sur le verre, la lumière laisse un reflet vertical long et adouci aux bords ; les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes. Le verre a la matière d'un vrai verre photographié : quelques micro-reflets, de très légères variations de netteté sur les bords, aucun aspect lisse et synthétique. Ombre portée douce et courte sous le flacon, et un reflet au sol très atténué qui disparaît en fondu. Texture d'image photographique naturelle, très légère granulation.

CADRAGE. Le flacon, pulvérisateur compris, occupe environ 90 % de la hauteur du cadre et est bien rempli dans la largeur : il ne doit pas paraître petit ni perdu au milieu du carré. Cadrage carré 1:1.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle rouge profond, légèrement satiné. En son centre, un panneau rectangulaire crème ivoire bordé d'un fin double filet rouge. Sur ce panneau, le nom s'écrit exactement A-M-E-E-R-A-T, sept lettres, avec deux E consécutifs et distincts au milieu, en écriture manuscrite italique rouge profond. Vérifie l'orthographe : AMEERAT, pas AMCERAT. En dessous, un fin trait horizontal rouge terminé par un petit point à chaque extrémité, puis "DÉSODORISANT TEXTILES" en capitales rouges fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette conserve ses deux niveaux : le rouge profond en fond et le panneau crème encadré au centre. Ne l'aplatis pas en un seul aplat rouge, ne supprime pas le panneau crème ni son filet.

LIQUIDE. Rosé pâle légèrement pêche, translucide et limpide, ni fuchsia ni rouge.

Vraie photographie de studio, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

### B. Le geste, pulvérisation vers un textile — 9:16 — hook TikTok

```
Une main de femme aux ongles courts et naturels tient ce flacon dans la moitié droite du cadre et presse la gâchette. Le flacon est tenu presque vertical, à peine incliné, son étiquette bien face à l'objectif et non déformée par la perspective. La buse du pulvérisateur est clairement visible, vue de trois quarts, et pointée droit vers une chemise en lin beige suspendue à un cintre en bois devant un mur clair, qui occupe la moitié gauche du cadre, à environ 25 centimètres de distance. Un cône de brume très fine part de la buse en ligne droite et vient frapper le tissu : la trajectoire est nette et lisible du bec jusqu'au textile, et l'on voit distinctement les gouttelettes atteindre la surface et l'assombrir très légèrement à l'endroit de l'impact, où le tissu devient un peu plus foncé et satiné. Quelques gouttelettes restent en suspension autour du point d'impact. La brume est éclairée à contre-jour par une fenêtre hors champ à gauche. Le flacon, la main et la buse sont nets, le textile est légèrement moins net. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette, l'index sur la gâchette. Ambiance de dressing élégant et feutré, lumière dorée de fin d'après-midi, palette rosé poudré, crème, terracotta doux, bois clair et laiton. Cadrage vertical 9:16, avec de la marge autour du flacon pour permettre un recadrage carré ultérieur.

DIRECTION DE LA BRUME. Elle doit partir de la buse et aller vers le textile, jamais dans une autre direction, jamais derrière le flacon, jamais dans le vide.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent. La main l'enveloppe largement : le corps du flacon n'est pas plus large que la paume.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle rouge profond, légèrement satiné. En son centre, un panneau rectangulaire crème ivoire bordé d'un fin double filet rouge. Sur ce panneau, le nom s'écrit exactement A-M-E-E-R-A-T, sept lettres, avec deux E consécutifs et distincts au milieu, en écriture manuscrite italique rouge profond. Vérifie l'orthographe : AMEERAT, pas AMCERAT. En dessous, un fin trait horizontal rouge terminé par un petit point à chaque extrémité, puis "DÉSODORISANT TEXTILES" en capitales rouges fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette conserve ses deux niveaux : le rouge profond en fond et le panneau crème encadré au centre. Ne l'aplatis pas en un seul aplat rouge, ne supprime pas le panneau crème ni son filet.

LIQUIDE. Rosé pâle légèrement pêche, translucide et limpide, ni fuchsia ni rouge.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun agrume, aucun aliment dans le cadre.
```

### C. Scène d'usage — 4:5 — TikTok Shop et Shopify

```
Place ce flacon debout sur une commode en bois clair, à côté d'une pile de linge en lin beige plié et d'un petit vase en laiton contenant deux tiges de fleurs blanches. Arrière-plan de chambre élégante et lumineuse, mur crème, rideau de lin, très flou. Lumière du jour dorée de fin d'après-midi venant de la droite, ombres douces et allongées. Le flacon est net et occupe environ 60 % de la hauteur du cadre. Palette rosé poudré, crème, terracotta doux, bois clair et laiton. Cadrage vertical 4:5.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle rouge profond, légèrement satiné. En son centre, un panneau rectangulaire crème ivoire bordé d'un fin double filet rouge. Sur ce panneau, le nom s'écrit exactement A-M-E-E-R-A-T, sept lettres, avec deux E consécutifs et distincts au milieu, en écriture manuscrite italique rouge profond. Vérifie l'orthographe : AMEERAT, pas AMCERAT. En dessous, un fin trait horizontal rouge terminé par un petit point à chaque extrémité, puis "DÉSODORISANT TEXTILES" en capitales rouges fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette conserve ses deux niveaux : le rouge profond en fond et le panneau crème encadré au centre. Ne l'aplatis pas en un seul aplat rouge, ne supprime pas le panneau crème ni son filet.

LIQUIDE. Rosé pâle légèrement pêche, translucide et limpide, ni fuchsia ni rouge.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucun agrume, aucun aliment dans le cadre.
```

### D. Macro de la brume — 1:1 — image secondaire de fiche

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond neutre en dégradé de crème et de terracotta très sombre et très flou, les gouttelettes prenant un reflet doré. Chaque gouttelette est captée nettement, effet de lumière rasante. Le haut du flacon et l'étiquette restent nets et lisibles dans le tiers gauche du cadre. Cadrage carré 1:1.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/5,6 et une vitesse d'obturation très rapide qui fige les gouttelettes en plein vol. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique translucide incolore, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle rouge profond, légèrement satiné. En son centre, un panneau rectangulaire crème ivoire bordé d'un fin double filet rouge. Sur ce panneau, le nom s'écrit exactement A-M-E-E-R-A-T, sept lettres, avec deux E consécutifs et distincts au milieu, en écriture manuscrite italique rouge profond. Vérifie l'orthographe : AMEERAT, pas AMCERAT. En dessous, un fin trait horizontal rouge terminé par un petit point à chaque extrémité, puis "DÉSODORISANT TEXTILES" en capitales rouges fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette conserve ses deux niveaux : le rouge profond en fond et le panneau crème encadré au centre. Ne l'aplatis pas en un seul aplat rouge, ne supprime pas le panneau crème ni son filet.

LIQUIDE. Rosé pâle légèrement pêche, translucide et limpide, ni fuchsia ni rouge.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

---

# Khamra

Dossier Drive : `04-khamra`

### A. Packshot premium sans décor — 1:1 — fiche produit

```
Photographie publicitaire du flacon de cette image, seul, sans aucun décor : plus aucune épice, aucun bâton de cannelle, aucune datte, aucune fleur, aucun fruit, aucun aliment, aucune éclaboussure de liquide. Le flacon est parfaitement centré et vertical sur un fond blanc uni très légèrement dégradé vers un gris très pâle dans les angles inférieurs.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/8, à hauteur du milieu du flacon. La lumière est large, douce et très diffuse, venant du haut à gauche, adoucie à droite pour lever les ombres, avec un léger contre-jour qui détache l'épaule du flacon. AUCUN OBJET AUTRE QUE LE FLACON N'EST VISIBLE DANS L'IMAGE : le cadre ne contient que le flacon et un fond blanc pur, uniforme et entièrement vide. Aucun panneau, aucun cadre, aucun bord noir, aucune surface sombre, aucune structure, aucun accessoire, aucun matériel, ni sur les côtés ni dans les angles ni en arrière-plan. Sur le verre, la lumière laisse un reflet vertical long et adouci aux bords ; les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes. Le verre a la matière d'un vrai verre photographié : quelques micro-reflets, de très légères variations de netteté sur les bords, aucun aspect lisse et synthétique. Ombre portée douce et courte sous le flacon, et un reflet au sol très atténué qui disparaît en fondu. Texture d'image photographique naturelle, très légère granulation.

CADRAGE. Le flacon, pulvérisateur compris, occupe environ 90 % de la hauteur du cadre et est bien rempli dans la largeur : il ne doit pas paraître petit ni perdu au milieu du carré. Cadrage carré 1:1.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique BLANC OPAQUE, pas transparent, avec une bague translucide sous la tête, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle brun très foncé, presque noir, mat, portant un double filet doré fin qui forme un cadre rectangulaire à l'intérieur de ses bords. Au centre du cadre, le nom s'écrit exactement K-H-A-M-R-A, six lettres, avec un M bien formé et distinct d'un N, en écriture manuscrite italique dorée. En dessous, un fin trait horizontal doré, puis "DÉSODORISANT TEXTILES" en capitales dorées fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette reste brun très foncé et le texte reste doré : ne l'éclaircis pas en beige, ne rends pas le doré jaune vif.

LIQUIDE. Ambré doré profond, translucide et limpide, couleur miel, ni orange ni jaune vif.

Vraie photographie de studio, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

### B. Le geste, pulvérisation vers un textile — 9:16 — hook TikTok

```
Une main de femme aux ongles courts et naturels tient ce flacon dans la moitié droite du cadre et presse la gâchette. Le flacon est tenu presque vertical, à peine incliné, son étiquette bien face à l'objectif et non déformée par la perspective. La buse du pulvérisateur est clairement visible, vue de trois quarts, et pointée droit vers un manteau en laine brune suspendu à un portant en métal noir, qui occupe la moitié gauche du cadre, à environ 25 centimètres de distance. Un cône de brume très fine part de la buse en ligne droite et vient frapper le tissu : la trajectoire est nette et lisible du bec jusqu'au textile, et l'on voit distinctement les gouttelettes atteindre la surface et l'assombrir très légèrement à l'endroit de l'impact, où le tissu devient un peu plus foncé et satiné. Quelques gouttelettes restent en suspension autour du point d'impact. La brume est éclairée à contre-jour par une fenêtre hors champ à gauche. Le flacon, la main et la buse sont nets, le textile est légèrement moins net. La main a exactement cinq doigts, dans une prise naturelle et anatomiquement correcte sur la gâchette, l'index sur la gâchette. Ambiance de dressing feutré en fin de journée, lumière chaude et rasante, palette ambre, brun, ocre, bois sombre et laiton. Cadrage vertical 9:16, avec de la marge autour du flacon pour permettre un recadrage carré ultérieur.

DIRECTION DE LA BRUME. Elle doit partir de la buse et aller vers le textile, jamais dans une autre direction, jamais derrière le flacon, jamais dans le vide.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent. La main l'enveloppe largement : le corps du flacon n'est pas plus large que la paume.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique BLANC OPAQUE, pas transparent, avec une bague translucide sous la tête, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle brun très foncé, presque noir, mat, portant un double filet doré fin qui forme un cadre rectangulaire à l'intérieur de ses bords. Au centre du cadre, le nom s'écrit exactement K-H-A-M-R-A, six lettres, avec un M bien formé et distinct d'un N, en écriture manuscrite italique dorée. En dessous, un fin trait horizontal doré, puis "DÉSODORISANT TEXTILES" en capitales dorées fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette reste brun très foncé et le texte reste doré : ne l'éclaircis pas en beige, ne rends pas le doré jaune vif.

LIQUIDE. Ambré doré profond, translucide et limpide, couleur miel, ni orange ni jaune vif.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucune épice, aucun aliment dans le cadre.
```

### C. Scène d'usage — 4:5 — TikTok Shop et Shopify

```
Place ce flacon debout sur une console en bois foncé, à côté d'un plaid en laine brun replié et d'un photophore en verre ambré allumé. Arrière-plan de salon feutré en fin de journée, mur beige sombre, rideau de lin épais, très flou. Lumière chaude et latérale venant de la droite, ombres douces et allongées, ambiance dorée. Le flacon est net et occupe environ 60 % de la hauteur du cadre. Palette ambre, brun, ocre, bois sombre et laiton. Cadrage vertical 4:5.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif 50 mm à f/2,8, en lumière naturelle uniquement. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied, aucun projecteur. Profondeur de champ courte et progressive. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes ; le flacon a la matière d'un vrai objet photographié, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

ÉCHELLE DANS LA SCÈNE. Le flacon ne mesure que 20 cm de haut au total. Il doit paraître PETIT et familier dans le décor : il tient entièrement dans une seule main, il est plus bas qu'une bouteille d'eau d'un litre et à peine plus haut qu'un grand mug. Dimensionne tout le reste de la scène en conséquence. Ne le rends pas géant par rapport au mobilier, aux textiles et aux objets qui l'entourent.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique BLANC OPAQUE, pas transparent, avec une bague translucide sous la tête, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

LISIBILITÉ. L'étiquette est entièrement visible, non masquée par la main ni par la brume, parfaitement nette et lisible, présentée bien à plat face à l'objectif. Chaque lettre du nom et de la mention "DÉSODORISANT TEXTILES" est correctement formée, régulière et correctement orthographiée, sans ondulation ni déformation.

REMPLISSAGE. Le flacon est PLEIN de liquide, rempli jusqu'aux trois quarts de la hauteur du corps en verre. La ligne de liquide est haute, juste sous l'épaule bombée. Il ne doit en aucun cas paraître vide ou à moitié vide.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle brun très foncé, presque noir, mat, portant un double filet doré fin qui forme un cadre rectangulaire à l'intérieur de ses bords. Au centre du cadre, le nom s'écrit exactement K-H-A-M-R-A, six lettres, avec un M bien formé et distinct d'un N, en écriture manuscrite italique dorée. En dessous, un fin trait horizontal doré, puis "DÉSODORISANT TEXTILES" en capitales dorées fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette reste brun très foncé et le texte reste doré : ne l'éclaircis pas en beige, ne rends pas le doré jaune vif.

LIQUIDE. Ambré doré profond, translucide et limpide, couleur miel, ni orange ni jaune vif.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane. Aucune épice, aucun aliment dans le cadre.
```

### D. Macro de la brume — 1:1 — image secondaire de fiche

```
Gros plan sur la tête du pulvérisateur de ce flacon au moment exact de la pulvérisation, vu de profil. Un nuage de gouttelettes très fines part vers la droite et devient lumineux à contre-jour sur un fond brun très sombre et neutre, les gouttelettes prenant un reflet doré. Chaque gouttelette est captée nettement, effet de lumière rasante. Le haut du flacon et l'étiquette restent nets et lisibles dans le tiers gauche du cadre. Cadrage carré 1:1.

PRISE DE VUE. Photographie réelle prise au reflex avec un objectif macro 100 mm à f/5,6 et une vitesse d'obturation très rapide qui fige les gouttelettes en plein vol. Aucun matériel de prise de vue n'est visible dans le cadre : aucune boîte à lumière, aucun réflecteur, aucun pied. Sur le verre, les reflets sont irréguliers et progressifs, jamais des bandes plates et uniformes, aucun aspect lisse et synthétique. Texture d'image photographique naturelle, très légère granulation.

FORME ET TAILLE DU FLACON. Le flacon contient environ 500 ml. Son CORPS EN VERRE, sans compter le pulvérisateur, mesure environ 13 cm de haut pour 7 cm de diamètre : il est court et large, sa hauteur ne vaut qu'environ 1,8 fois son diamètre. Ce n'est PAS un flacon élancé, ce n'est PAS une bouteille de shampoing, ce n'est PAS un cylindre étiré. C'est un flacon ramassé et rond. Le haut du corps forme une ÉPAULE NETTEMENT BOMBÉE ET ARRONDIE en dôme, qui occupe environ le quart supérieur du corps et se resserre en un col court et étroit, sans aucun angle vif ; les côtés sont droits et verticaux uniquement sur les trois quarts inférieurs. Le pulvérisateur à gâchette est en plastique BLANC OPAQUE, pas transparent, avec une bague translucide sous la tête, COMPACT et solidement vissé sur le col : sa hauteur totale ne dépasse pas 40 % de la hauteur du corps en verre, et la gâchette ne s'avance pas exagérément vers l'avant. L'ensemble atteint environ 20 cm de haut. L'étiquette est large et couvre environ la moitié de la hauteur du corps en verre et presque toute sa circonférence visible. Elle est nettement plus large que haute sur la face avant.

ÉTIQUETTE. Conserve-la strictement identique à l'image source : un grand rectangle brun très foncé, presque noir, mat, portant un double filet doré fin qui forme un cadre rectangulaire à l'intérieur de ses bords. Au centre du cadre, le nom s'écrit exactement K-H-A-M-R-A, six lettres, avec un M bien formé et distinct d'un N, en écriture manuscrite italique dorée. En dessous, un fin trait horizontal doré, puis "DÉSODORISANT TEXTILES" en capitales dorées fines et espacées, accent aigu sur le E compris. Ne réécris pas ce texte, ne le traduis pas, ne change pas la police, les couleurs ni la mise en page. L'étiquette reste brun très foncé et le texte reste doré : ne l'éclaircis pas en beige, ne rends pas le doré jaune vif.

LIQUIDE. Ambré doré profond, translucide et limpide, couleur miel, ni orange ni jaune vif.

Vraie photographie, pas une illustration, pas un rendu 3D, pas un mockup, pas une image de synthèse. Aucun texte ajouté, aucun logo, aucun filigrane.
```

---

---

# Extension de gamme, 26 août 2026 : trois références de plus

La gamme passe de 5 à 8 références. Ces trois-là n'ont pour l'instant que leur
packshot ; leurs visuels de geste, de scène et de macro se construiront sur les mêmes
gabarits que les cinq premières, avec la palette de décor accordée à la fragrance.

| Référence | Dossier | Famille olfactive | Liquide | Décor à prévoir |
|---|---|---|---|---|
| Mya G | `06-mya-g` | Bouquet floral riche (lys, rose, jasmin, lavande) | Incolore | Clair et fleuri, blanc et vert, touches mauve |
| Figue tonka | `07-figue-tonka` | Gourmand fruité boisé | Rose framboise | Chaleureux, bois, textile épais, rouge profond |
| Figues du Maghreb | `08-figues-du-maghreb` | Fruité méditerranéen (figue, romarin) | Rose mauve | Méditerranéen, pierre claire, verdure, mauve |

## Deux pièges propres à ces trois références

### 1. Le grossiste n'écrit pas la même chose d'une étiquette à l'autre

| Référence | Ce que porte l'étiquette réelle |
|---|---|
| Mya G | **DÉODORISANT** TEXTILES |
| Figue tonka | **DÉODORISANT** TEXTILES |
| Figues du Maghreb | DÉSODORISANT TEXTILES |

Les cinq premières références écrivent toutes DÉSODORISANT. **Décision d'Edgar :
uniformiser sur DÉSODORISANT TEXTILES** pour toute la gamme.

Conséquence assumée : sur Mya G et Figue tonka, la photo de fiche ne correspond plus
exactement au flacon livré. C'est une lettre, le risque est faible, et la cohérence de
gamme le justifie. À vérifier sur les flacons physiques une fois la commande passée.

**Mécanique du prompt.** Le reste du prompt dit « conserve l'étiquette strictement
identique », il faut donc une **exception explicite**, sinon le modèle recopie
fidèlement la faute :

> CORRECTION DE TEXTE, UNIQUE EXCEPTION. Sur l'image source, la mention sous le nom
> est écrite "DÉODORISANT TEXTILES". C'est une erreur qu'il faut CORRIGER : écris à la
> place "DÉSODORISANT TEXTILES", avec un S entre le É et le O. Garde la même police,
> la même couleur, la même taille et la même position. C'est la seule modification
> autorisée sur cette étiquette.

Demander une correction est plus fragile que demander une conservation : vérifier ce
mot en priorité sur chaque rendu, le modèle peut recopier l'original ou inventer un
intermédiaire.

### 2. Quatre liquides roses sur huit

Baby Love, Ameerat, Figue tonka et Figues du Maghreb ont tous un liquide rosé. Alignés
dans une image de gamme, ils seront difficiles à distinguer.

**Conséquence : le rangement par teinte de liquide, du plus clair au plus foncé, ne
tient plus à huit références.** Il faudra soit ranger par famille olfactive, soit
alterner pour séparer les quatre roses.
