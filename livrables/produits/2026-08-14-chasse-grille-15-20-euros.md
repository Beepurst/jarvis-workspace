# Chasse produits — grille 15 à 20 €

> Date : 2026-08-14 · **2 candidats retenus sur 22 familles mesurées**, dont 1 seul solide
> Grille appliquée : vente 15-20 €, marge brute 8 € mini, plancher français 12 €, coût rendu max 7,25 € UE / 4,25 € Chine, entrepôt UE en condition.

---

## La réponse à ta question, avant tout le reste

**Non, la grille 15-20 € ne débloque pas la recherche. Elle déplace le mur, elle ne l'enlève pas.**

| Chasse | Familles examinées | Retenus | Taux |
|---|---|---|---|
| 14/08, anti-stress femmes | ~22 | 2 | 9 % |
| 14/08, large avec grille 22-28 € | ~20 | 0 | 0 % |
| **14/08, grille 15-20 € (celle-ci)** | **22** | **2** | **9 %** |

Tu retrouves exactement le taux de la première chasse. Et pour une raison arithmétique que le brief contient déjà sans l'avoir vue :

**tu as assoupli un filtre et durci l'autre, du même geste.**

- Le filtre du plancher français est passé de 15 € à 12 €. Assouplissement.
- Le plafond de coût d'achat est passé de 8 € à **7,25 € en UE et 4,25 € en Chine**, parce qu'il se calcule désormais à partir d'un prix de vente de 18 € au lieu de 25 €. **Durcissement, et il est plus violent que l'assouplissement.**

Résultat mesuré : sur les 4 familles qui repassent effectivement le filtre du plancher, **2 meurent sur le nouveau plafond de coût**. Ce sont précisément celles qui survivaient au plancher parce qu'elles ont de la matière (textile, volume), donc elles coûtent cher à produire et à expédier. Le plancher français au-dessus de 12 € et le coût d'achat sous 4,25 € sont **corrélés négativement**. Un objet dont le prix de détail français ne descend pas sous 12 € est en général un objet qui coûte plus de 5 € à fabriquer et livrer.

La fenêtre que tu cherches exige un rapport **plancher / coût rendu d'au moins 1,7 en UE et 2,8 en Chine**. Sur 22 familles mesurées, une seule l'atteint.

---

## Deux corrections méthodologiques, à lire avant le reste

### 1. Les planchers de la chasse précédente étaient faux, et trop hauts

**leDénicheur n'est pas trié par prix croissant.** Vérifié : `?sort=price` n'existe pas, et l'ordre affiché suit une logique de pertinence. La chasse du 14/08 a lu le haut de page et en a conclu un plancher. Les vrais planchers, lus sur la page entière, sont plus bas.

| Famille | Plancher annoncé le 14/08 | Plancher réel mesuré aujourd'hui | Effet |
|---|---|---|---|
| Tapis de fouille chien | 13,15 € | **8,95 €** | Passe de vivant à mort |
| Tente / cube pour chat | 13,99 € | **10,68 €** | Passe de vivant à mort |
| Kit nettoyage vinyle | 14,99 € | **9,15 €** | Passe de vivant à mort |
| Plaid à manches | 13,49 € | **15,75 €** | Survit au filtre |

**Trois des quatre familles que le brief donnait comme "repassant le filtre" sont mortes.** Le point de départ concret fourni ne tient pas.

Méthode correcte à appliquer désormais : ouvrir la page leDénicheur et demander explicitement le prix le plus bas **de toute la page**, jamais des premiers résultats.

### 2. AliExpress répond. C'est le second déblocage du projet

Le format `https://www.aliexpress.com/w/wholesale-mots-cles.html` **retourne les produits et les prix**. Quatre requêtes ont abouti avant que le site ne coupe (réponses vides ensuite, pas de 403). Le paramètre `?shipFromCountry=ES` est accepté et le bandeau « Expédié depuis : Espagne » s'affiche, même si l'origine n'est pas répétée sur chaque fiche.

**Ce sont les premiers prix d'achat fournisseur relevés depuis le début du projet.** Le point aveugle numéro un du CONTEXT.md est levé, au moins partiellement.

Limite constatée : le débit est faible, environ 4 à 5 requêtes avant blocage temporaire. À utiliser en fin de chasse, sur les seuls survivants du filtre prix, jamais en exploration.

**Un premier enseignement immédiat de ces prix :** sur le hamac de fenêtre pour chat, les offres filtrées « expédié depuis Espagne » démarrent à **17,05 €** contre **9,49 €** sans filtre. L'entrepôt UE est une condition de viabilité, mais il coûte cher en prix d'achat. Le gain de 3 € de droit de douane peut être annulé, et au-delà, par le surcoût du stock européen. **À vérifier produit par produit, jamais à supposer.**

---

## Top 2

1. **Mangeoire à oiseaux à ventouse pour vitre** — le seul candidat qui passe les cinq critères, y compris dans le scénario Chine dégradé. Plancher français à 20,99 €, prix d'achat AliExpress relevé à 1,76 €, saison qui démarre fin octobre, et surtout **aucun vendeur marketplace chinois indexé sur ce sous-format**, ce qui est exactement l'anomalie que sept chasses cherchaient.
2. **Lave-vitre magnétique double face** — passe, mais de très peu et sous condition d'un entrepôt UE sous 7,25 €. Plancher à 12,78 €, soit 0,78 € au-dessus de ton filtre. Je le remonte par honnêteté de couverture, pas par conviction.

Il n'y a pas de troisième.

## Tableau de synthèse

| # | Produit | Plancher FR mesuré | Filtre 12 € | Vente cible | Achat relevé | Marge UE | Marge Chine | Entrepôt UE | Visuel 3 s | Saturation |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Mangeoire à ventouse pour vitre | 20,99 € | Passe | 17-19 € | 1,76 € (AliExpress) | ~10 à 12 € | **8,25 €** | À vérifier | Moyen, dépend d'un oiseau | Faible |
| 2 | Lave-vitre magnétique double face | 12,78 € | Passe de justesse | 17-19 € | 5,59 € (AliExpress) | **8,00 €** | 4,65 €, mort | Obligatoire | Bon | Moyenne à élevée, ancienne |
| — | Plaid à manches | 15,75 € | Passe | 18 € | 11,49 € (AliExpress) | 3,76 €, mort | 0,76 €, mort | — | Bon | Moyenne |
| — | Hamac chat à ventouse fenêtre | 15,99 € | Passe | 18 € | 9,49 € (AliExpress) | 5,76 €, mort | 2,76 €, mort | 17,05 € en ES | Excellent | Moyenne |

Base de calcul des marges, à 18 € de prix de vente : frais Shopify Payments 0,52 €, prélèvement URSSAF 2,23 €, droit de douane forfaitaire 3 € dans le seul scénario Chine. Coût d'achat majoré d'environ 2 € de port sur les relevés AliExpress à l'unité, faute de pouvoir lire le port réel vers la France.

---

## Fiches

### 1. Mangeoire à oiseaux à ventouse pour vitre

- **Ce que c'est :** une petite mangeoire transparente en acrylique qui se colle à la vitre par ventouses, l'oiseau vient manger à 20 cm derrière le verre.
- **Catégorie :** jardin et nature, observation de la faune.
- **Problème résolu :** voir les oiseaux de près quand on n'a pas de jardin. C'est le seul format de mangeoire qui fonctionne en appartement et sur balcon.
- **Plancher français mesuré :** **20,99 €**, Relaxdays, relevé le 14/08/2026 sur [leDénicheur — mangeoire oiseaux](https://ledenicheur.fr/s/mangeoire-oiseaux/). Second point de comparaison relevé le 14/08 par la chasse précédente : **21,50 €** chez [Jardins Animés](https://fr.jardins-animes.com/mangeoire-oiseaux-transparente-pour-fenetre-avec-ventouses-p-3079.html). La [boutique LPO](https://boutique.lpo.fr/categorie/jardin-d-oiseaux/mangeoires/mangeoires-balcons-et-fen%C3%AAtres) tient une catégorie dédiée, prix non lisible en automatisé.
- **Verdict du filtre à 12 € :** **passe largement.** C'est le seul cas sur 22 où le plancher dépasse le filtre de plus de 8 €.
- **L'anomalie qui compte :** sur cette page leDénicheur, le plancher toutes mangeoires confondues est de 5,74 € (IMAC), mais **le sous-format à ventouse n'a que des offres de marque européenne**. Aucun Hixingo, aucun PETSOLA, aucun YKKJ. C'est exactement le contraire de ce que les six chasses précédentes ont constaté partout ailleurs. **Cette anomalie est le cœur du dossier, et c'est aussi ce qu'il faut vérifier en premier**, parce qu'elle peut n'être qu'un trou d'indexation de leDénicheur.
- **Prix de vente cible retenu :** 17 à 19 €, sous le Relaxdays, dans la tranche 10-30 € qui pèse 44,8 % du CA TikTok Shop France.
- **Coût d'achat relevé :** **1,76 €** pièce, mangeoire acrylique transparente à ventouse, 4,8/5 et plus de 800 ventes, sur [AliExpress](https://www.aliexpress.com/w/wholesale-window-bird-feeder-suction-cup.html), relevé le 14/08/2026. Le port à l'unité vers la France n'est pas lisible, la mention affichée est « livraison gratuite dès 10 € d'achat ». J'estime le rendu entre 3 et 4,50 €, **c'est une estimation, pas une mesure.**
- **Origine d'expédition :** Chine sur l'offre relevée. **Aucune option UE vérifiée.** Le candidat est donc formellement dégradé tant que ce point n'est pas levé.
- **Marge brute calculée à 18 € :**
  - Scénario UE, coût rendu 4 € : 18 − 4 − 0,52 − 2,23 = **11,25 €**
  - Scénario Chine, coût rendu 4 € + 3 € de droit : 18 − 4 − 3 − 0,52 − 2,23 = **8,25 €**
  - **C'est le seul candidat de cette chasse qui tient les 8 € même dans le scénario dégradé.**
- **Démontrabilité visuelle en 3 secondes, notée sévèrement : moyenne, et c'est sa vraie faiblesse.** Le plan qui vend est une mésange plein cadre derrière la vitre. Quand tu l'as, c'est imbattable en organique. Mais **tu ne contrôles pas l'oiseau**, et le canal principal du projet exige une cadence de publication. Il faut compter plusieurs jours d'installation avant les premières visites, et la saison n'est pas encore ouverte. Un tournage de secours existe (pose de la ventouse, remplissage, vue de l'intérieur), il est bien plus faible.
- **Pourquoi maintenant :** la [LPO](https://www.lpo.fr/decouvrir-la-nature/conseils-biodiversite/conseils-biodiversite/accueillir-la-faune-sauvage/quand-nourrir-les-oiseaux) situe le nourrissage entre les premières gelées, fin octobre à mi-novembre, et mi-mars. La fenêtre commerciale est devant, pas derrière, et elle dure environ cinq mois. Il reste dix semaines pour construire le compte TikTok avant le pic.
- **Risques réglementaires :** ni jouet, ni électrique, ni contact alimentaire humain. **Mais GPSR s'applique** : en important en direct depuis la Chine, Forqan devient importateur au sens du règlement et endosse les obligations d'identification, de traçabilité et de sécurité du produit. Second point : la LPO documente la transmission de maladies aviaires par les mangeoires mal nettoyées. **Interdiction absolue de tout claim écologique du type « aidez les oiseaux »**, la pratique commerciale trompeuse est le risque, pas la conformité produit.
- **Risque principal, et il est réel :** le produit est en acrylique fin fixé par ventouse en extérieur. Décollement par gel ou par vent, casse en colis, jaunissement UV. Sur un panier à 18 € avec 8 € de marge, **deux retours sur cent ventes mangent un quart du profit.** Et le taux de casse d'un acrylique à 1,76 € expédié de Chine n'est pas connu.
- **Saturation :** faible en dropshipping français, à confirmer. Aucune pression publicitaire mesurée, la bibliothèque Meta n'a pas répondu.
- **Angle évident :** le plan fixe silencieux, oiseau plein cadre à 20 cm, texte à l'écran « depuis mon salon ». Zéro voix off, boucle parfaite.

### 2. Lave-vitre magnétique double face

- **Ce que c'est :** deux blocs aimantés qui se placent de part et d'autre d'une vitre, on nettoie l'extérieur depuis l'intérieur.
- **Catégorie :** entretien de la maison.
- **Problème résolu :** nettoyer l'extérieur d'une fenêtre en étage sans se pencher.
- **Plancher français mesuré :** **12,78 €**, relevé le 14/08/2026 sur [leDénicheur — lave vitre magnétique](https://ledenicheur.fr/s/lave-vitre-magnetique/). Attention, une partie des offres basses sont des aimants pour aquarium, produit différent. Le double face pour vitrage fin démarre autour de 13 €.
- **Verdict du filtre à 12 € :** **passe, de 0,78 €.** C'est une marge d'erreur, pas un écart.
- **Prix de vente cible retenu :** 17 à 19 €. Vendre 18 € quand le plancher est à 12,78 € demande une promesse forte, ce que le produit n'a pas : c'est un objet fonctionnel connu.
- **Coût d'achat relevé :** **5,59 €**, mention « prix le plus bas en 90 jours », sur [AliExpress](https://www.aliexpress.com/w/wholesale-magnetic-window-cleaner-double-sided.html), relevé le 14/08/2026. Port non lisible.
- **Origine d'expédition :** Chine sur l'offre relevée. Option UE non vérifiée.
- **Marge brute calculée à 18 €, coût rendu estimé 7,25 € :**
  - Scénario UE : 18 − 7,25 − 0,52 − 2,23 = **8,00 €**, soit très exactement le seuil, sans un centime de sécurité
  - Scénario Chine : 18 − 7,25 − 3 − 0,52 − 2,23 = **5,00 €**, **mort**
- **Démontrabilité visuelle en 3 secondes : bonne.** Le bloc extérieur qui suit le bloc intérieur à travers la vitre, avec la trace de saleté qui disparaît, se lit sans parole. C'est le meilleur visuel des quatre familles survivantes.
- **Risques réglementaires :** pas de directive jouet, pas de DEEE. GPSR standard. **Risque produit sérieux en revanche** : aimants néodyme puissants, pincement des doigts, et surtout chute du bloc extérieur depuis un étage. Le cordon de sécurité n'est pas optionnel, et sa présence conditionne la notice.
- **Risque principal :** **le produit est vieux en dropshipping.** Il tournait déjà sur Facebook Ads vers 2018-2020, ce qui explique un plancher déjà cassé à 12,78 €. Le pic de tendance est passé. Je le remonte parce qu'il passe les filtres, pas parce que j'y crois.
- **Saturation :** moyenne à élevée, et ancienne.
- **Angle évident :** plan fixe sur une vitre sale d'appartement, main à l'intérieur, saleté qui part à l'extérieur.

---

## Les deux qui passent le plancher et meurent sur le coût

Je les documente parce qu'ils sont la démonstration du mécanisme, pas parce qu'ils sont récupérables.

### Plaid à manches

- Plancher : **15,75 €** sur eBay, **19,99 €** sur Amazon.fr (Vivezen), **24,90 €** en Kanguru. [leDénicheur](https://ledenicheur.fr/s/plaid-avec-manches/), relevé le 14/08/2026. Passe le filtre.
- Saison parfaite, arrivée du froid, visuel correct, aucun dossier réglementaire.
- **Coût d'achat relevé sur [AliExpress](https://www.aliexpress.com/w/wholesale-wearable-blanket-with-sleeves.html) : minimum 11,49 €**, la majorité entre 20 et 30 €. Marge maximale théorique 3,76 € en scénario UE. **Écart d'un facteur 2 avec ton seuil.**
- Leçon : un textile adulte d'un mètre carré ne se source pas sous 7 € rendu. Le poids et le volume tuent le port avant même la matière.

### Hamac à ventouse pour chat, format fenêtre

- Plancher du sous-format : **15,99 €** (LATRAT), le générique hors fenêtre étant à 9,99 €. [leDénicheur](https://ledenicheur.fr/s/hamac-chat/), relevé le 14/08/2026. Passe le filtre.
- **Meilleur visuel 3 secondes de toute la chasse.** Un chat suspendu à une vitre, vu de dessous, se passe totalement de commentaire.
- **Coût relevé sur [AliExpress](https://www.aliexpress.com/w/wholesale-cat-window-hammock.html) : 9,49 €** minimum, et **17,05 €** minimum avec le filtre d'expédition depuis l'Espagne. Marge maximale 5,76 €, et négative en entrepôt UE.
- Leçon : c'est le cas d'école du filtre UE qui coûte plus qu'il ne rapporte. Le droit de 3 € économisé est annulé trois fois par le surcoût du stock européen.

---

## Écartés

**20 familles écartées sur 22 mesurées.** Motifs, par ordre de poids :

**Motif 1, plancher français sous 12 € (16 cas, écrasant).**

| Famille | Plancher mesuré | Source |
|---|---|---|
| Attrape-soleil | 5,59 € | [leDénicheur](https://ledenicheur.fr/s/attrape-soleil/) |
| Distributeur de croquettes | 5,99 € | [leDénicheur](https://ledenicheur.fr/s/distributeur-de-croquettes/) |
| Sac de rangement sous vide | 5,99 € | [leDénicheur](https://ledenicheur.fr/s/sac-sous-vide/) |
| Lampe à lave | 6,74 € | [leDénicheur](https://ledenicheur.fr/s/lampe-a-lave/) |
| Tapis de léchage chien | 6,95 € | [leDénicheur](https://ledenicheur.fr/s/tapis-de-lechage-chien/) |
| Nichoir à oiseaux | 6,98 € | [leDénicheur](https://ledenicheur.fr/s/nichoir/) |
| Griffoir carton pour chat | 6,99 € | [leDénicheur](https://ledenicheur.fr/s/griffoir-chat/) |
| Peignoir de séchage pour chien | 7,98 € | [leDénicheur](https://ledenicheur.fr/s/peignoir-chien/) |
| Couverture polaire simple | 8,42 € | [leDénicheur](https://ledenicheur.fr/s/couverture-polaire/) |
| Mangeoire à écureuil | 8,49 € | [leDénicheur](https://ledenicheur.fr/s/mangeoire-ecureuil/) |
| Tapis de fouille chien | 8,95 € | [leDénicheur](https://ledenicheur.fr/s/tapis-de-fouille-chien/) |
| Kit de nettoyage vinyle | 9,15 € | [leDénicheur](https://ledenicheur.fr/s/kit-nettoyage-vinyle/) |
| Balai à poils d'animaux | 9,49 € | [leDénicheur](https://ledenicheur.fr/s/balai-poils-animaux/) |
| Harnais pour chien | 9,99 € | [leDénicheur](https://ledenicheur.fr/s/harnais-chien/) |
| Hamac chat générique | 9,99 € | [leDénicheur](https://ledenicheur.fr/s/hamac-chat/) |
| Tente / cube pour chat | 10,68 € | [leDénicheur](https://ledenicheur.fr/s/tente-pour-chat/) |

**Motif 2, plancher limite et défaut rédhibitoire ailleurs (2 cas).** Manteau pour chien, plancher 12,23 € en lot de quatre chez Trixie et 17,04 € à l'unité : le problème n'est pas le prix mais les tailles, qui font exploser les retours en dropshipping sans stock. Mangeoire à écureuil en bois fonctionnelle, 13,99 à 15,19 € : le bois lourd rend le coût rendu sous 7,25 € invraisemblable.

**Motif 3, coût d'achat supérieur au plafond (2 cas).** Plaid à manches et hamac chat de fenêtre, détaillés plus haut.

### Cas notables, ceux que tu vas croiser

- **Le tapis de fouille grand format.** Le brief demandait de le mesurer. **Il n'existe pas** : sur toute la page leDénicheur, le plus grand format référencé est un 80 × 48 cm à 23,99 €, et il y a un 80 × 30 cm à 8,99 €. Aucun 60 × 90. La réserve laissée par la chasse précédente est refermée, le sous-format n'a pas de marché français constitué. Et la famille entière est morte à 8,95 €.
- **L'attrape-soleil.** Mort à 5,59 €, mais attention : ce qui est indexé sous ce terme sur leDénicheur, ce sont des **kits créatifs pour enfants** (APLI, Baker Ross, Ursus), pas des cristaux à facettes suspendus. Le sous-format cristal n'a pas pu être isolé, les slugs `suncatcher` et `prisme-cristal` renvoient 404. Mon pronostic reste le même que la chasse précédente : un prisme de verre est l'objet générique par excellence. Et si tu vises le kit créatif, **tu entres dans la directive jouet 2009/48/CE**, ce qui le tue de toute façon.
- **Le hamac chat de fenêtre.** Ne t'y attache pas malgré le visuel. C'est le meilleur contenu TikTok de toute la chasse et il est économiquement mort à 9,49 € d'achat.

---

## Limites de cette chasse

- **La couverture de leDénicheur sur les sous-formats de niche est incertaine, et c'est le point faible du candidat numéro 1.** Le fait que seule Relaxdays apparaisse en mangeoire à ventouse peut signifier « pas de vendeur chinois sur ce format » ou simplement « leDénicheur n'indexe pas la longue traîne Amazon Marketplace sur ce format ». Les deux hypothèses sont compatibles avec ce que j'ai vu, et elles n'ont pas les mêmes conséquences. **C'est la première chose à vérifier.**
- **Le vocabulaire de slugs de leDénicheur est restrictif.** Sur environ 40 requêtes, une quinzaine ont renvoyé 404 malgré deux ou trois reformulations : moustiquaire magnétique, broderie diamant, gamelle anti-glouton, hôtel à insectes, abreuvoir à oiseaux, raclette de douche, organisateur de tiroir, bouillotte, mini serre, bigoudis, boule à neige, cache-pot, plaid à capuche, housse de siège voiture pour chien. **Ces familles n'ont pas été mesurées, elles ne sont pas pour autant des candidats.** Le format `/search?search=` renvoie une 403, il n'y a pas de solution de repli.
- **AliExpress coupe après 4 à 5 requêtes.** J'ai relevé 4 prix d'achat, tous sur le format `/w/wholesale-*.html`. Les requêtes suivantes renvoient une page vide. Le filtre `shipFromCountry=ES` fonctionne mais l'origine n'est pas répétée par fiche, donc **aucune origine d'expédition n'est confirmée à la fiche produit**. Toutes les mentions « entrepôt UE » de ce rapport sont des hypothèses.
- **BigBuy en 403, CJ Dropshipping derrière une page de validation anti-robot, le portail dropshipping vidaXL en 403.** Aucun prix de gros européen n'a pu être relevé. **VidaXL en boutique grand public répond**, mais ce sont des prix de détail TTC, sans valeur pour le sourcing.
- **Bibliothèque publicitaire Meta injoignable**, connexion coupée. Les niveaux de saturation reposent sur la présence en distribution et sur l'ancienneté connue des produits, jamais sur une pression publicitaire mesurée.
- **Angle « produits viraux du moment » improductif, pour la deuxième chasse consécutive.** Les listes d'août 2026 consultées ([Sell The Trend](https://www.sellthetrend.com/blog/winning-products), [CJ](https://cjdropshipping.com/blogs/winning-products/TikTok-Viral-products-2026), Dropified, Zendrop) recyclent les mêmes catégories et affichent des prix de vente à 29,95 et 39,95 dollars, hors grille. Elles sont écrites pour le marché américain, où le plancher français n'existe pas.

---

## À vérifier manuellement par Edgar, 10 minutes

Tout le dossier tient sur la première vérification. Fais-la avant les autres.

### 1. L'anomalie de la mangeoire à ventouse est-elle réelle ? (4 min, décisif)

| À ouvrir | Ce que tu relèves | Ce que ça décide |
|---|---|---|
| [Amazon.fr — mangeoire oiseaux ventouse vitre](https://www.amazon.fr/s?k=mangeoire+oiseaux+ventouse+vitre) | Le **prix le plus bas** d'un modèle acrylique à ventouse, vendu à l'unité, en filtrant sur « Livraison Prime ». Note aussi le **nom du vendeur** | Sous 12 € par un vendeur type Hixingo / YKKJ : **le candidat 1 est mort**, l'anomalie n'était qu'un trou d'indexation. Au-dessus de 15 € et uniquement des marques européennes : **c'est la première vraie fenêtre du projet** |
| [Temu — window bird feeder](https://www.temu.com/search_result.html?search_key=mangeoire%20oiseaux%20fenetre) | Le prix le plus bas | Temu à 5 € ne tue pas le produit mais plafonne ton prix de vente. À connaître avant de fixer 18 € |

### 2. Le sourcing, seulement si le point 1 survit (4 min)

| À ouvrir | Ce que tu relèves |
|---|---|
| [AliExpress — window bird feeder suction cup](https://www.aliexpress.com/w/wholesale-window-bird-feeder-suction-cup.html) | Le **prix pour 1 pièce, port compris vers la France**, sur la fiche produit et pas sur la liste. C'est le chiffre qui manque à tout ce rapport |
| [AliExpress — même requête, expédition depuis l'Espagne](https://www.aliexpress.com/w/wholesale-window-bird-feeder-suction-cup.html?shipFromCountry=ES) | Existe-t-il une offre UE, et à quel prix. Compare au prix Chine + 3 € de droit. **Si l'écart dépasse 3 €, l'entrepôt UE te coûte de l'argent sur ce produit** |
| [AliExpress — expédition depuis la France](https://www.aliexpress.com/w/wholesale-window-bird-feeder-suction-cup.html?shipFromCountry=FR) | Même chose, meilleur délai encore |
| [BigBuy — recherche bird feeder](https://www.bigbuy.eu/fr/catalogsearch/result/?q=bird+feeder) | Le prix de gros HT et la disponibilité. Page inaccessible en automatisé, elle s'ouvre depuis un navigateur |

### 3. Le candidat 2, si tu veux le garder en réserve (2 min)

| À ouvrir | Ce que tu relèves |
|---|---|
| [AliExpress — magnetic window cleaner, expédition Espagne](https://www.aliexpress.com/w/wholesale-magnetic-window-cleaner-double-sided.html?shipFromCountry=ES) | Le prix rendu. **Au-dessus de 7,25 €, le candidat 2 est mort**, il n'a aucune réserve de marge |

---

## Prochaine étape

**Je passe un seul produit en `validation-produit` : la mangeoire à oiseaux à ventouse pour vitre**, et uniquement après que tu aies fait la vérification numéro 1. La lancer avant serait produire un verdict chiffré sur une anomalie non confirmée.

Le lave-vitre magnétique ne mérite pas une validation. Il passe les filtres à 0,78 € et 0,00 € près sur un produit dont le pic est passé. Garde-le en réserve, rien de plus.

**Et le vrai résultat de cette chasse n'est pas le candidat, c'est la mécanique.** Le brief posait la bonne question, et la réponse est que la grille 15-20 € ne débloque rien parce qu'elle serre le plafond de coût plus fort qu'elle ne desserre le plancher de prix. Si la mangeoire tombe à la vérification manuelle, le prochain arbitrage n'est plus un réglage de grille : c'est le critère de non-généricité que le CONTEXT.md a déjà identifié comme manquant, et il coûte soit un MOQ, soit un plafond d'achat relevé.

Cette chasse ne valide rien, elle défriche.
