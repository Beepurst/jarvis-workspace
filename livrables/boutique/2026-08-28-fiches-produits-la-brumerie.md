# Fiches produits Shopify : La Brumerie

> Date : 2026-08-28 · Boutique : La Brumerie (Shopify) · Statut : prêtes à coller
> Périmètre : **2 fiches** (unité et duo), **duo au choix, 15 combinaisons**
> **Révisé le 28 août : le flacon fait 250 ml, pas 500 ml.** Voir l'encadré ci-dessous.
> Le trio n'est pas écrit ici, mais il n'est plus bloqué : voir §10.

---

## ⛔ La correction du 28 août : 250 ml, pas 500 ml

**Tout ce qui a été écrit sur ce produit depuis le 22 août le décrit en 500 ml.** Le flacon
fait 250 ml. Ce document est le premier corrigé. Trois conséquences, dont une bonne.

**1. Le prix du flacon seul passe de 14,90 € à 13,90 €. Tranché le 28 août.**
Le relevé du 27 août donne le 250 ml français entre 8,00 € et 13,90 €. 14,90 € était le
plafond du marché en 500 ml et passait au-dessus du plafond en 250 ml. **13,90 € est
exactement ce plafond.** C'est la seule ligne de la grille exposée à la comparaison, donc la
seule qui bouge : le duo reste à 26,90 € et le trio à 41,90 €.

Calcul complet dans `livrables/pilotage/2026-08-28-unit-economics-brumes-250ml.md`. Le point
qui compte : **le port coûte 5,99 € sur 2,50 € de marchandise**, et un flacon vendu seul à
13,90 € livraison comprise ne rapporterait que 1,73 €. Le prix de marché du 250 ml n'est pas
praticable port inclus, et toute la rentabilité est dans le colis à plusieurs flacons.

**2. La bonne nouvelle : le trio est débloqué.**
Le pari à 8 € par colis venait d'un trio estimé entre 2,55 et 3,05 kg, donc de part et d'autre
de la marche à 3 kg. **En 250 ml, le trio pèse environ 1,8 kg**, largement dans le palier à
7,99 €. Le risque disparaît. Mieux : un quatuor resterait autour de 2,4 kg, donc encore à
7,99 €. Il y a un format haut à construire, et il n'existait pas hier.

**3. Ta banque de 20 visuels montre un flacon deux fois trop gros.**
Les 20 prompts décrivent un corps de 13 cm sur 7 cm de diamètre, ce qui fait 500 ml au calcul.
Traité dans `livrables/creas/2026-08-28-prompt-pour-session-creas.md`.

**Ce qui ne bouge pas :** ton prix d'achat. 2,50 € pour un 250 ml, quand le prix de gros
relevé pour ce format est de 4,00 €, reste un bon achat.

---

## Avant de coller quoi que ce soit

**Ce qui est dans ce document et qui est définitif :** la structure, les prix, les mentions
légales obligatoires, les réglages techniques, le ton.

**Ce qui est dans ce document et qui est provisoire, et c'est assumé :** les descriptions
olfactives. Personne n'a ouvert un flacon. J'ai écrit sur ce qui se lit à l'œil sur
l'étiquette et sur le nom de la référence, jamais sur des notes inventées. Aucune pyramide
olfactive, aucune promesse de tenue en heures ou en jours. Tu réécris ces paragraphes après
avoir senti les cinq flacons, et ça ne casse rien : ce sont des blocs isolés.

**Ce qui n'est toujours pas levé et qui n'est pas dans les fiches :** la pesée et l'ADR. Les
fiches se remplissent, elles ne se publient pas tant que le poids n'est pas mesuré (le champ
poids commande l'affichage du point relais au checkout) et que l'ADR n'est pas levée (Mondial
Relay refuse la classe 3).

---

## 1. Trois règles à ne jamais enfreindre dans ces textes

Elles viennent du positionnement du 22 août et du paquet légal du 25 août. Une seule
infraction suffit à faire tomber une boutique ou à basculer le produit en régime biocide.

| Interdit | Pourquoi |
|---|---|
| **assainissant, désinfectant, antibactérien, purifiant, anti-acarien** | Bascule le produit en **régime biocide**, avec autorisation de mise sur le marché à la clé |
| **anti-stress, aide au sommeil, apaise, relaxant, bien-être** | Allégation de santé non tenable sur un désodorisant textile |
| **« tient 3 jours », « 72 h de fraîcheur »**, toute durée chiffrée | Non testée sur le produit réel. Une durée chiffrée fausse est une pratique commerciale trompeuse |
| **hypoallergénique, naturel, sans produits chimiques** | Non vérifiable sur un produit acheté en gros |

Le mot correct, celui de l'étiquette, est **désodorisant textiles**. Il est employé tel quel
partout dans les fiches.

---

## 2. Réglages Shopify communs aux deux fiches

À faire sur chaque fiche, avant de s'occuper du texte.

| Champ Shopify | Valeur | Pourquoi |
|---|---|---|
| **Poids** | **650 g** par flacon (unité), **1 300 g** (duo) | ⚠️ **Le champ le plus important de la fiche.** Sans poids renseigné, l'option point relais **n'apparaît pas au checkout**. Estimation pour un 250 ml en verre plein et emballé, **à corriger après pesée**. Les deux valeurs sont confortablement dans leur palier |
| Dimensions du colis | environ 15 x 15 x 20 cm (unité) | Même mécanisme, plancher observé autour de 15 cm |
| Suivi du stock | Activé, **Shopify ne vend pas en rupture** | Tu emballes à la main à deux. Une survente est un remboursement et un avis négatif |
| Taxe | **Décoché.** Aucune collecte | Franchise en base. ⚠️ Ne PAS utiliser l'option « Exonération pour les micro-entreprises », qui n'est pas la franchise française |
| Type de produit | `Désodorisant textiles` | Sert le SEO et les collections |
| Fournisseur | *laisser vide* | Ne jamais exposer le grossiste |
| Catégorie produit | Maison et jardin > Entretien du linge | Sert Google Shopping plus tard |

### Mentions à afficher sur les deux fiches, sans exception

À placer sous le prix, dans un bloc de texte fixe du thème :

```
Prix net. TVA non applicable, art. 293 B du CGI.
Livraison en France métropolitaine uniquement.
Frais de port : 5,99 € en point relais (1 flacon) · 7,99 € (2 flacons).
Livraison offerte à partir de 3 flacons.
```

⚠️ **Le port doit être annoncé ici, sur la fiche, pas découvert au checkout.** Il pèse 18 %
du panier. C'est la première cause d'abandon sur ce type d'offre.

### Bloc conformité, à recopier sur chaque fiche

Obligatoire au titre du GPSR, et il évite d'acheter une application à 5 à 20 € par mois.
**Le contenu se recopie de l'étiquette du flacon, il ne s'invente pas.**

```
Informations produit et sécurité

Désodorisant textiles. Fabricant / importateur UE : [NOM ET ADRESSE PORTÉS SUR L'ÉTIQUETTE].
Numéro de lot : indiqué sur chaque flacon.
Allergènes parfumants : [LISTE PORTÉE SUR L'ÉTIQUETTE].
Mentions de danger : [MENTIONS CLP DE L'ÉTIQUETTE, SI LE PRODUIT EST ALCOOLISÉ].
Précautions d'emploi : ne pas pulvériser sur la peau ni sur le visage. Tenir hors de portée
des enfants. Ne pas pulvériser à proximité d'une flamme. Faire un essai sur une zone non
visible avant d'utiliser sur un textile délicat, coloré ou en soie.
```

**Ce bloc est vide tant que tu n'as pas un flacon en main.** C'est le second motif de non
publication, après la pesée.

---

## 3. FICHE 1 : le duo. C'est celle qui compte

**C'est l'unité de vente par défaut et la seule cible de toutes tes vidéos TikTok**, sans
dévier avant 30 ventes dessus. C'est aussi le seul format dont le port ne dépend pas de la
pesée : à environ 1,30 kg, il est au milieu du palier à 7,99 €, avec 700 g de marge.

### Réglages

| Champ | Valeur |
|---|---|
| **Titre** | `Duo de brumes textiles parfumées 250 ml` |
| Handle (URL) | `duo-brumes-textiles-250ml` |
| Prix | `26,90 €` |
| Prix barré (comparaison) | **aucun**, voir ci-dessous |
| Poids | `1300 g` |
| Variantes | **15 combinaisons** (voir la liste ci-dessous) |
| Nom de l'option | `Parfums` |
| SKU | `BRU-DUO-` + les deux codes, ex. `BRU-DUO-WDBL` |
| Tags | `duo`, `brume textile`, `250 ml`, `linge`, `maison` |

### Pas de prix barré sur le duo, et c'est un choix

Le prix barré honnête serait 27,80 €, soit deux flacons à 13,90 €. Ça affiche **0,90 €
d'économie**, ce qui est pire que ne rien afficher : le client lit « aucun intérêt ».

**Le vrai avantage du duo n'est pas la remise produit, c'est le port mutualisé**, et il est
beaucoup plus gros :

| | Total payé par le client |
|---|---|
| Deux flacons commandés séparément | 2 x (13,90 + 5,99) = **39,78 €** |
| Le duo | 26,90 + 7,99 = **34,89 €** |
| **Économie réelle** | **4,89 €** |

C'est vrai, c'est vérifiable, et c'est cinq fois plus parlant que le prix barré. **Mets-le en
toutes lettres dans la description plutôt que dans un champ Shopify**, qui ne sait comparer que
des prix produit et rate donc tout l'argument.

Phrase à coller sous les bénéfices :

```
Deux flacons commandés séparément : 39,78 € livraison comprise.
En duo : 34,89 €. Une seule livraison au lieu de deux.
```

### Les 15 combinaisons

Une seule option, nommée `Parfums`. Codes : WD, JF, BL, AM, KH.

```
White Dream x2                          BRU-DUO-WDWD
Jasmin Fleur d'oranger x2               BRU-DUO-JFJF
Baby Love x2                            BRU-DUO-BLBL
Ameerat x2                              BRU-DUO-AMAM
Khamra x2                               BRU-DUO-KHKH
White Dream + Jasmin Fleur d'oranger    BRU-DUO-WDJF
White Dream + Baby Love                 BRU-DUO-WDBL
White Dream + Ameerat                   BRU-DUO-WDAM
White Dream + Khamra                    BRU-DUO-WDKH
Jasmin Fleur d'oranger + Baby Love      BRU-DUO-JFBL
Jasmin Fleur d'oranger + Ameerat        BRU-DUO-JFAM
Jasmin Fleur d'oranger + Khamra         BRU-DUO-JFKH
Baby Love + Ameerat                     BRU-DUO-BLAM
Baby Love + Khamra                      BRU-DUO-BLKH
Ameerat + Khamra                        BRU-DUO-AMKH
```

**Mets les cinq duos d'un même parfum en tête de liste**, puis les mélanges. Le client qui
sait ce qu'il veut trouve vite, celui qui découvre fait défiler.

⚠️ **Le piège de stock, et il existait déjà avec le duo au même parfum.** Shopify suit le
stock par variante, pas par flacon. Un duo `White Dream + Baby Love` vendu ne décrémente pas
ton stock de White Dream sur la fiche unité. **Shopify ne saura pas que tu n'as plus de
flacons.** À ton volume (5 à 15 commandes le premier mois), la seule réponse raisonnable est
de tenir le stock réel à la main sur une feuille et de ne pas t'appuyer sur les compteurs
Shopify. Le jour où le volume monte, il faudra une application de bundle, et elle est payante.

### Titre affiché et accroche

```
Duo de brumes textiles parfumées 250 ml
Deux flacons, deux parfums si tu veux. Ton linge, ton canapé et ta voiture sentent comme tu veux.
```

### Description (bloc principal)

```
Deux flacons de 250 ml, aux parfums de ton choix. Les deux pareils, ou deux différents.

Une brume textile, c'est le geste le plus rapide qu'on connaisse pour changer l'odeur
d'une pièce. Pas une bougie qu'il faut allumer, pas un diffuseur qu'il faut recharger.
Tu pulvérises sur le tissu, et c'est fait.

Le lit qu'on vient de refaire. Le canapé du salon avant que quelqu'un arrive. Le manteau
sorti du placard en octobre. Les rideaux. La voiture le lundi matin. Les coussins, le
plaid, le tapis de l'entrée. Partout où il y a du textile, la brume tient.

Le pulvérisateur à gâchette diffuse large, sans détremper le tissu.

Le duo est fait pour ne pas avoir à choisir. Prends deux fois le même si tu sais déjà ce
que tu veux, ou deux parfums différents pour voir. Un flacon en bas, un flacon en haut.
Un pour la maison, un pour la voiture. Et c'est le même prix de livraison que pour un
seul flacon.
```

### Bénéfices (bullets)

```
· Deux flacons de 250 ml, aux parfums de ton choix
· Les deux pareils ou deux différents, c'est toi qui décides
· Pulvérisateur à gâchette : diffusion large, le tissu ne se détrempe pas
· Sur le linge, le canapé, les rideaux, le manteau, la voiture
· 5 parfums, des classiques français aux accords orientaux
· Expédié de France sous 2 jours ouvrés, en point relais
· Livraison unique pour deux flacons
```

### Comment ça s'utilise

```
Comment l'utiliser

1. Secoue légèrement le flacon.
2. Tiens-le à 25 ou 30 cm du tissu.
3. Deux ou trois pressions suffisent sur un coussin, quatre à cinq sur un canapé.
4. Laisse sécher quelques minutes avant de t'installer dessus.

Sur un textile délicat, coloré ou en soie, fais d'abord un essai sur une zone
non visible.
```

### FAQ

```
Est-ce que ça marche sur un canapé en tissu ?
Oui, c'est même l'usage principal. Sur du cuir ou du simili, on évite : la brume est
faite pour être absorbée par une fibre.

Est-ce que ça tache ?
Pulvérisée à bonne distance, non. Le risque vient d'un flacon tenu trop près, qui dépose
des gouttes au lieu d'un nuage. Reste à 25 cm et fais un essai sur une zone cachée si le
textile est délicat.

Je peux en mettre sur mes vêtements ?
Sur un manteau, une veste, un pull rangé au placard, oui. Pas sur la peau, pas sur le
visage, et pas sur un vêtement que tu portes à même la peau.

Combien de temps dure un flacon ?
Ça dépend de ton usage. 250 ml, c'est plusieurs centaines de pressions, et c'est le
format le plus courant pour une brume textile.

Je peux prendre deux parfums différents ?
Oui, c'est même l'intérêt du duo. Choisis ta combinaison dans la liste : deux fois le
même parfum, ou deux parfums différents, au même prix.

Vous livrez où ?
En France métropolitaine, en point relais. Nous expédions nous-mêmes, depuis la France.

Et si ça ne me plaît pas ?
Tu as 14 jours pour changer d'avis, même si le flacon est ouvert. Nous n'appliquons
aucune exception au droit de rétractation.
```

⚠️ **Cette question est la plus importante de la FAQ.** C'est elle qui retire l'objection
« et si je n'aime pas ? » à quelqu'un qui découvre le produit dans une vidéo. Ne la déplace
pas en bas de liste.

### Réassurance (sous le bouton d'achat)

```
✓ Expédié de France, sous 2 jours ouvrés
✓ Livraison en point relais, 7,99 €
✓ 14 jours pour changer d'avis, flacon ouvert compris
✓ Paiement sécurisé
```

### SEO

| Champ | Valeur |
|---|---|
| Balise title | `Duo de brumes textiles parfumées 250 ml - La Brumerie` |
| Méta-description | `Deux flacons de 250 ml de brume textile parfumée, aux parfums de votre choix. Pour le linge, le canapé, les rideaux et la voiture. Expédié de France.` |

---

## 4. FICHE 2 : le flacon seul

**Cette fiche n'est pas là pour se vendre.** Elle est là pour qu'à 20,89 € on ait un flacon
et qu'à 34,89 € on en ait deux, ce qui fait que le second coûte 14 € au lieu de 20,89 €.
C'est un point de comparaison. Elle ne va dans aucune vidéo, dans aucune campagne, et elle
n'est pas mise en avant sur la page d'accueil.

### Réglages

| Champ | Valeur |
|---|---|
| **Titre** | `Brume textile parfumée 250 ml` |
| Handle (URL) | `brume-textile-250ml` |
| Prix | `13,90 €` |
| Prix barré | *aucun* |
| Poids | `650 g` |
| Variantes | 5, une par parfum (voir §5) |
| SKU | `BRU-250-WD` · `BRU-250-JFO` · `BRU-250-BL` · `BRU-250-AM` · `BRU-250-KH` |
| Tags | `brume textile`, `250 ml`, `linge`, `maison` |

⚠️ **Pas de prix barré sur cette fiche.** Un prix barré inventé sur un produit vendu à
l'unité est un faux rabais, sanctionné comme pratique commerciale trompeuse. Sur le duo, le
prix barré est vrai puisqu'il est le double du prix unitaire réel.

### Titre affiché et accroche

```
Brume textile parfumée 250 ml
Le parfum, mais pour ton linge.
```

### Description (bloc principal)

```
Un flacon de 250 ml, au parfum de ton choix.

Le geste tient en deux secondes : tu pulvérises sur le tissu, l'odeur s'installe. Le lit
qu'on vient de refaire, le canapé avant que quelqu'un arrive, le manteau sorti du placard,
les rideaux, la voiture le lundi matin.

Le pulvérisateur à gâchette diffuse large, sans détremper le tissu.

Si tu hésites entre deux parfums, prends le duo : tu en choisis deux différents, tu ne
paies qu'une seule livraison, et le flacon revient à 13,45 €.
```

### Bénéfices (bullets)

```
· Flacon de 250 ml à pulvérisateur
· Diffusion large, le tissu ne se détrempe pas
· Sur le linge, le canapé, les rideaux, le manteau, la voiture
· 5 parfums au choix
· Expédié de France sous 2 jours ouvrés, en point relais
```

### Le reste

Les blocs **Comment l'utiliser**, **FAQ** et **Réassurance** sont identiques à ceux de la
fiche duo, à deux différences :

- retirer la question « Je peux prendre deux parfums différents ? »
- dans la réassurance, remplacer `7,99 €` par `5,99 €`

### SEO

| Champ | Valeur |
|---|---|
| Balise title | `Brume textile parfumée 250 ml - La Brumerie` |
| Méta-description | `Brume textile parfumée en flacon pulvérisateur de 250 ml, 5 parfums au choix. Pour le linge, le canapé, les rideaux et la voiture. Expédié de France.` |

---

## 5. Les 5 parfums, en variantes

**Sur Shopify, une variante n'a pas de description propre.** Ces cinq textes vont donc dans
un bloc unique de la description, identique sur les deux fiches, intitulé « Les cinq
parfums ».

Le nom de l'option est `Parfum` sur la fiche unité (5 valeurs) et `Parfums` sur la fiche duo
(15 combinaisons, voir §3).

⚠️ **Ces cinq textes sont la partie provisoire de ce document.** Ils décrivent un univers et
un usage, jamais des notes olfactives, parce que personne n'a ouvert un flacon. Ils sont
justes et ils ne mentent pas, mais ils sont pauvres. Après avoir senti les cinq, tu remplaces
la deuxième phrase de chacun par ce que tu sens réellement. C'est un travail de dix minutes
qui vaut plus que tout le reste de cette fiche.

```
Les cinq parfums

White Dream
Le registre du linge propre. C'est le parfum le plus consensuel de la gamme, celui qu'on
choisit quand on ne veut pas se tromper, et celui qui va partout : les draps, les
serviettes, la chambre d'amis.

Jasmin Fleur d'oranger
Floral et lumineux, deux fleurs blanches que tout le monde reconnaît. Le parfum de
printemps de la gamme. Sur des rideaux ou dans une entrée, il ouvre la pièce.

Baby Love
Doux et propre, le registre de la chambre d'enfant et du linge de bébé. Le plus léger des
cinq. À pulvériser sur les textiles de la pièce, jamais directement sur un vêtement porté
par un enfant.

Ameerat
Le premier des deux accords orientaux. Plus chaud et plus enveloppant que les trois
premiers. Un plaid, un canapé, un manteau d'hiver.

Khamra
Le plus intense de la gamme, ambré et profond. C'est celui qu'on sent en entrant dans la
pièce. À doser plus légèrement que les autres : deux pressions suffisent là où il en faut
quatre ailleurs.
```

⚠️ **Baby Love demande une vigilance particulière.** Ne jamais écrire ni laisser entendre que
le produit s'applique sur un bébé, sur ses vêtements portés ou sur son linge de lit. C'est un
désodorisant textiles, pas un produit pour la peau. La phrase de restriction ci-dessus reste
dans le texte, elle n'est pas négociable.

### Ordre d'affichage des variantes

Sur la fiche unité :

`White Dream` → `Jasmin Fleur d'oranger` → `Baby Love` → `Ameerat` → `Khamra`

Du plus consensuel au plus intense. White Dream en premier est aussi la variante qui
s'affiche par défaut, donc celle dont la photo apparaît en vignette : c'est la bonne, elle a
les quatre visuels de la banque et c'est la moins clivante.

---

## 6. Les images, fiche par fiche

Ta banque est complète pour les cinq références : packshot, geste, scène, macro.

| Position | Fiche unité | Fiche duo |
|---|---|---|
| 1 | Packshot fond blanc de la variante | **Visuel de gamme** (les cinq flacons ensemble) |
| 2 | Scène d'usage 4:5 | Les 5 packshots, à la suite |
| 3 | Macro de la brume 1:1 | Scène d'usage 4:5 |
| 4 | Geste 9:16 recadré | Macro de la brume 1:1 |

⚠️ **Sur la fiche unité, chaque variante doit avoir son packshot associé**, sinon changer de
parfum ne change pas l'image et le client doute de ce qu'il achète.

**Sur la fiche duo, n'associe aucune image à une variante.** Avec 15 combinaisons c'est
impossible à tenir, et ça n'a pas d'intérêt : le visuel de gamme montre les cinq flacons, ce
qui est exactement le propos de la fiche. **Effet de bord du duo au choix : les cinq visuels
de duo que j'annonçais à produire ne sont plus nécessaires. La banque d'images suffit telle
quelle.**

⚠️ **Sous réserve du volume.** Les 20 visuels de la banque montrent un flacon d'environ
500 ml. Voir `livrables/creas/2026-08-28-prompt-pour-session-creas.md`, et la recommandation
de regénérer au moins les 5 packshots.

---

## 7. Décision du 28 août : le duo est au choix

**Arbitré par Edgar le 28 août 2026.** Le duo n'impose plus deux flacons du même parfum : le
client compose sa paire parmi 15 combinaisons.

Ce que ça change, et ce que ça coûte :

| | Duo même parfum | **Duo au choix, retenu** |
|---|---|---|
| Variantes | 5 | **15** |
| Objection « et si je n'aime pas ? » | présente | **levée** |
| Préparation | une ligne à lire | deux lignes à lire |
| Concentration des avis | une seule fiche | **une seule fiche, identique** |
| Écoulement du stock | déséquilibré, 2 fois le best-seller | **équilibré** |
| Visuels de duo à produire | 5 | **aucun** |
| Suivi du stock Shopify | déjà faux | **toujours faux**, voir §3 |

La décision du 27 août sur le **trio** n'est pas touchée : à 35 combinaisons, l'assortiment
fixe reste la bonne réponse. Le seuil de bascule est entre 15 et 35, pas au principe.

---

## 8. Checklist de publication

Dans l'ordre. Rien ne se publie tant que les trois premières lignes ne sont pas cochées.

| # | À faire | Bloquant |
|---|---|---|
| 1 | **Peser un flacon plein, emballé, avec carton, calage et scotch.** 250 ml est un volume, pas un poids : le tarif du port se décide en grammes | ⛔ Le champ poids commande l'affichage du point relais au checkout |
| 2 | **Lever l'ADR** : chercher le losange rouge et blanc à la flamme sur l'étiquette | ⛔ Mondial Relay refuse la classe 3. Si le produit est ADR, le port et donc les prix sont à refaire |
| 3 | **Récupérer le contenu du bloc conformité sur l'étiquette** : importateur UE, allergènes, mentions CLP | ⛔ Obligation GPSR |
| 4 | ~~Trancher le prix~~ **Fait le 28 août : 13,90 / 26,90 / 41,90** | |
| 5 | Regénérer au moins les 5 packshots sur la bonne géométrie de flacon | Fiches publiables sans, mais l'image principale ne correspond pas au produit |
| 6 | Créer les 2 fiches, coller les textes, associer les packshots aux variantes de la fiche unité | |
| 7 | Renseigner poids et dimensions sur **chaque variante**, les 15 du duo comprises | ⛔ Sinon pas de point relais |
| 8 | Vérifier que la case Taxe est décochée, et que « Exonération pour les micro-entreprises » n'est PAS utilisée | ⛔ Sinon tu collectes 20 % de TVA que tu ne dois pas |
| 9 | Compléter les articles 7.2, 7.3, 7.5 des CGV avec les vrais montants et délais de port | ⛔ Champs laissés en crochets le 25 août |
| 10 | Ouvrir la feuille de stock à la main, une ligne par parfum | Shopify ne saura pas décrémenter les flacons d'un duo |
| 11 | Faire le test mobile : ouvrir la fiche sur un téléphone, vérifier que le prix du port est visible sans faire défiler | |
| 12 | Retirer le mot de passe de la boutique | |

---

## 9. Le trio est débloqué par le 250 ml

Le trio était suspendu à un pari de 8 € par colis : estimé entre 2,55 et 3,05 kg en 500 ml,
il tombait de part et d'autre de la marche à 3 kg.

**En 250 ml, le trio pèse environ 1,8 kg.** Il est dans le palier à 7,99 € avec plus d'un kilo
de marge. Le pari disparaît. Et un quatuor à environ 2,4 kg y resterait aussi.

**Le trio part donc en vente à 41,90 €, livraison offerte**, marge 16,34 € sur TikTok Shop et
19,23 € sur Shopify. Sa fiche reste à écrire, dis-moi quand.

Et il y a un cran au-dessus : **un quatuor pèse environ 2,60 kg et reste au même port de
7,99 €.** À 49,90 € livraison offerte, il rend 19,92 € de marge sur un seul colis. À garder
pour le réachat et l'email, pas pour le lancement : le panier médian de TikTok Shop France est
de 21 à 22 €.

Ce qui ne change pas : **le trio reste un assortiment fixe**, pas un trio au choix. 35
combinaisons, c'est autre chose que 15.

---

## 10. Ce que ce document ne fait pas
- **Il n'écrit pas les fiches TikTok Shop.** Le catalogue TikTok Shop a ses propres contraintes
  de longueur et de format, et le port y est affiché à part alors qu'il pourrait être intégré
  sur Shopify. À traiter séparément.
- **Il n'écrit pas la page d'accueil ni la page À propos.**
- **Il ne tranche pas le port affiché à part contre le port intégré sur Shopify.** Les deux
  sont neutres en marge au centime près. La grille arrêtée au 27 août dit port à part, et les
  CGV publiées le 25 août le disent aussi à l'article 4.3. **Si tu bascules sur le port intégré,
  l'article 4.3 des CGV devient faux et doit être réécrit le même jour.**
