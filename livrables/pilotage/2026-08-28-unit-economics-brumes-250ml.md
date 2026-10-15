# Unit economics et grille de prix : brumes textiles 250 ml

> Date : 2026-08-28 · La Brumerie · Mode : unit economics
> **Remplace la grille du 27 août**, calculée sur un flacon supposé de 500 ml.
> Hypothèses inchangées par ailleurs : achat 2,50 € TTC, commission TikTok 9 %,
> URSSAF 12,415 %, franchise en base de TVA, Mondial Relay grille publique 2026.

---

## Verdict en cinq lignes

**Une seule ligne de la grille bouge : le flacon seul passe de 14,90 € à 13,90 €.** Le duo
reste à 26,90 € et le trio à 41,90 €. Ce n'est pas de la prudence, c'est que le vrai problème
du 250 ml n'est pas le prix affiché, c'est **le port : 5,99 € de transport sur 2,50 € de
marchandise**. Conséquence directe et contre-intuitive : **le prix de marché français du
250 ml, 8,00 € à 13,90 €, est inatteignable port inclus**. Vendre un flacon seul à 13,90 €
livraison comprise rapporte 1,73 €. Toute la rentabilité est dans le colis à plusieurs
flacons, et le 250 ml vient justement de la débloquer.

---

## 1. Pourquoi la formule standard ne s'applique pas ici

La formule habituelle part du prix HT et retranche la TVA. **Elle est fausse dans ce cas** :
en franchise en base (art. 293 B), aucune TVA n'est collectée et aucune n'est déductible. Le
prix affiché est le prix encaissé.

Le modèle correct, établi le 27 août et vérifié ici contre les marges publiées :

```
Total encaissé   = prix affiché + port facturé au client

Marge nette      = Total encaissé
                 - coût produit (2,50 € x nombre de flacons)
                 - port réel Mondial Relay
                 - emballage
                 - commission de plateforme  (9 % du TOTAL encaissé, port compris)
                 - URSSAF                    (12,415 % du TOTAL encaissé, port compris)
```

Soit, en facteur :

```
Marge TikTok  = Total x 0,78585 - coûts directs      (1 - 0,09 - 0,12415)
Marge Shopify = Total x 0,86085 - 0,25 - coûts directs  (1 - 0,015 - 0,12415)
```

**Contrôle du modèle :** appliqué à la grille du 27 août, il rend 13,53 € sur le duo et
16,34 € sur le trio, exactement les chiffres publiés. Le modèle est bon, seules les entrées
changent.

### Ce que pèse le port, maintenant qu'on connaît le format

| Format | Poids estimé emballé | Palier Mondial Relay | Port |
|---|---|---|---|
| 1 flacon | ~0,65 kg | jusqu'à 1 kg | **5,99 €** |
| 2 flacons | ~1,30 kg | jusqu'à 2 kg | **7,99 €** |
| 3 flacons | ~1,95 kg | jusqu'à 3 kg | **7,99 €** |
| 4 flacons | ~2,60 kg | jusqu'à 3 kg | **7,99 €** |

⚠️ **Poids estimés, non pesés.** 250 ml est un volume, pas un poids. Le tarif se décide en
grammes et la pesée reste à faire. Mais la marge de sécurité est maintenant énorme : il
faudrait dépasser 3 kg à quatre flacons pour changer de palier, soit 750 g par flacon emballé.

---

## 2. Les trois nombres qui commandent toute la grille

### a) Le seuil sous lequel une commande perd de l'argent

C'est le **total encaissé**, port compris, en dessous duquel la commande est déficitaire.

| Colis | Coûts directs | **Total minimum** |
|---|---|---|
| 1 flacon | 9,19 € | **11,69 €** |
| 2 flacons | 13,89 € | **17,68 €** |
| 3 flacons | 16,59 € | **21,11 €** |
| 4 flacons | 19,29 € | **24,55 €** |

**Lis bien la première ligne.** Un flacon expédié seul coûte 9,19 € avant d'avoir gagné un
centime. Le marché français du 250 ml affiche 8,00 € à 13,90 €. **Si tu vends un flacon à
13,90 € livraison comprise, tu gagnes 1,73 €. À 12,90 €, tu gagnes 0,95 €. À 11,69 €, tu
travailles gratuitement. En dessous, tu paies pour vendre.**

C'est la conclusion la plus importante de ce document : **le prix de marché du 250 ml n'est
pas un prix que tu peux pratiquer port inclus.** Les sites qui l'affichent facturent le port
en plus, ou ont un contrat transporteur que tu n'as pas. Ne te compare pas à eux sur le prix
affiché sans compter le port.

### b) Ce que rapporte chaque flacon ajouté au même colis

Le port ne bouge pas entre 2 et 4 flacons. Un flacon de plus coûte donc **2,70 €** : 2,50 € de
marchandise et 0,20 € d'emballage.

| Ce flacon en plus est vendu | Marge nette qu'il rapporte |
|---|---|
| +10 € | **5,16 €** |
| +12 € | **6,73 €** |
| +14 € | **8,30 €** |

**Un flacon supplémentaire dans le même colis rapporte plus qu'un flacon vendu seul dans son
propre colis (6,44 €).** Ce n'est pas un détail d'optimisation, c'est là qu'est le business.
Tout ce qui pousse le nombre de flacons par colis vaut plus que tout ce qui pousse le prix.

### c) Franco de port ou port facturé : c'est exactement neutre

À total payé identique, les deux donnent la même marge au centime près, parce que la
commission et l'URSSAF frappent le total encaissé dans les deux cas.

Offrir le port coûte **6,28 € de marge sur TikTok Shop** et 6,88 € sur Shopify. Un franco de
port n'est donc jamais un cadeau marketing gratuit, c'est une remise de 6,28 € déguisée.

**Arrête de te demander si tu factures le port. Demande-toi seulement combien le client paie
au total.** C'est le seul nombre qui pilote ta marge.

---

## 3. La grille retenue

| | 1 flacon | 2 flacons | 3 flacons |
|---|---|---|---|
| **Prix affiché** | **13,90 €** | **26,90 €** | **41,90 €** |
| Livraison | + 5,99 € | + 7,99 € | **offerte** |
| **Total encaissé** | **19,89 €** | **34,89 €** | **41,90 €** |
| Coût produit | -2,50 € | -5,00 € | -7,50 € |
| Port réel | -5,99 € | -7,99 € | -7,99 € |
| Emballage | -0,70 € | -0,90 € | -1,10 € |
| Commission TikTok 9 % | -1,79 € | -3,14 € | -3,77 € |
| URSSAF 12,415 % | -2,47 € | -4,33 € | -5,20 € |
| **Marge nette TikTok Shop** | **6,44 €** | **13,53 €** | **16,34 €** |
| Marge à 4 %, incitation 60 jours | 7,43 € | 15,27 € | 18,43 € |
| **Marge nette Shopify** | **7,68 €** | **15,90 €** | **19,23 €** |
| Prix au flacon pour le client | 13,90 € | 13,45 € | 13,97 € |
| **ROAS break-even** | **3,09** | **2,58** | **2,56** |

### Ce qui change, et ce qui ne change pas

**Seul le flacon seul bouge, de 14,90 € à 13,90 €.** Raison unique : c'est la seule ligne de
la grille exposée à la comparaison. C'est le prix qui apparaîtra dans Google Shopping, dans
les comparateurs, et à côté d'un concurrent sur une recherche par nom de produit. **13,90 €
est exactement le plafond relevé du marché français du 250 ml.** Y être pile te coûte 0,79 €
sur un format qui n'est de toute façon pas fait pour se vendre, et il retire la seule ligne
objectivement au-dessus du marché.

**Effet de bord à connaître, et il se règle en une phrase.** Baisser l'unité écrase l'écart
affiché du duo : deux flacons à 13,90 € font 27,80 €, donc 0,90 € d'économie apparente sur un
duo à 26,90 €. Ne mets pas ce prix barré, il dessert l'offre. **Le vrai écart est le port :**
deux flacons commandés séparément coûtent 2 x 19,89 = **39,78 €**, le duo en coûte **34,89 €**,
soit **4,89 € d'économie réelle**. C'est cet argument-là qui doit figurer dans la fiche.

**Le duo et le trio ne bougent pas.** Personne d'autre ne vend ces lots-là, ils ne sont
comparables à rien, et leur prix au flacon (13,45 € et 13,97 €) reste dans la fourchette du
marché. Les baisser reviendrait à payer une comparaison qui n'existe pas.

**Ce que ça coûte de ne pas descendre plus bas :** rien de mesurable sur TikTok Shop, où
l'acheteur découvre au lieu de comparer, et où la tranche 10 à 30 € pèse 44,8 % du chiffre
d'affaires France. Le risque est sur Shopify alimenté par de la recherche, et tu n'auras pas
ce trafic avant des mois.

### L'alternative que j'écarte, et pourquoi

Descendre toute la grille à 12,90 € / 23,90 € / 34,90 € coûte **2,36 € par duo**, soit 27 %
de la marge, et casse la structure : le trio à 34,90 € port offert ne rapporterait que
10,84 €, **moins que le duo à 11,17 €**. Tu aurais un format haut qui rapporte moins que le
format moyen. C'est incohérent, et ça vient du franco à 6,28 €.

---

## 4. Le format qui n'existait pas hier : le quatuor

Quatre flacons pèsent environ 2,60 kg et restent dans le palier à 7,99 €. **Le port du
quatrième flacon est nul.**

| | Total | Marge TikTok | Marge Shopify | Prix/flacon |
|---|---|---|---|---|
| Quatuor à **49,90 €**, livraison offerte | 49,90 € | **19,92 €** | 23,42 € | 12,47 € |
| Quatuor à **52,90 €**, livraison offerte | 52,90 € | **22,28 €** | 26,00 € | 13,22 € |

**19,92 € de marge sur un seul colis, contre 13,53 € sur le duo.** Le même geste d'emballage,
le même trajet au point relais, le même port avancé.

**Je ne le recommande pas pour le lancement.** Un panier à 49,90 € sur TikTok Shop, dont le
panier médian France est de 21 à 22 €, convertira mal auprès de gens qui découvrent la marque
dans une vidéo. **C'est le bon format pour le réachat et pour l'email**, une fois que des
clients existent et savent ce qu'ils achètent. À garder en réserve, pas à publier maintenant.

---

## 5. Les trois nombres à avoir en tête en permanence

Sur le mix de référence 60 % duo, 25 % trio, 15 % unité :

| | |
|---|---|
| **Marge nette moyenne par commande** | **13,17 €** |
| **ROAS break-even** | **2,61** |
| **CPA break-even** | **13,17 €** |

Panier moyen encaissé 34,39 €, 2,10 flacons par commande.

**Le ROAS break-even à 2,61 est le nombre à retenir avant la première campagne.** Un ROAS de
2 affiché dans le gestionnaire de publicités te fait perdre de l'argent sur ce produit, même
s'il a l'air correct. Et 13,17 € est le maximum absolu que tu peux payer pour acquérir une
commande avant de travailler à perte, publicité comprise.

⚠️ **En franchise en base, la publicité relève de l'autoliquidation.** 100 € de trésorerie
n'achètent que 83 € de publicité réelle. Le CPA se lit sur les 83 €, la trésorerie se vide de
100 €.

---

## 6. Le chemin vers l'objectif

| Objectif | Commandes/mois | Par jour | CA mensuel |
|---|---|---|---|
| Couvrir les frais de structure (44,20 €) | 3,4 | 0,1 | 115 € |
| **Autofinancer un réassort de 100 €** | **7,6** | **0,3** | **261 €** |
| Autofinancer un réassort de 150 € | 11,4 | 0,4 | 392 € |
| 500 € de profit net | 38,0 | 1,3 | 1 306 € |
| 1 000 € de profit net | 75,9 | 2,5 | 2 612 € |
| **10 000 € de profit net** | **759,5** | **25,3** | **26 120 €** |

**L'objectif de 10 000 € reste hors d'atteinte, et le 250 ml ne l'a pas rapproché.** 759
commandes par mois, c'est 25 colis par jour préparés et déposés à la main par deux personnes,
sept jours sur sept. Le mur n'est pas la demande ni la marge, c'est le poste d'emballage. Le
chiffre est le même qu'au 27 août à 3 commandes près.

**Le premier palier qui compte est 8 commandes dans le mois**, celui où la boutique paie son
propre réassort. Il est bas et il est atteignable. C'est celui-là qu'il faut viser avant de
regarder les autres.

---

## 7. Ce que le budget de 300 € autorise réellement

Rappel du mécanisme : sur TikTok Shop, tu avances le port et l'emballage de chaque colis, et
tu es remboursé 31 jours après livraison. Ta capacité du premier mois est le plus petit des
deux nombres, stock et trésorerie.

| Premier lot | Flacons | Colis duo finançables | **Plafond réel** | Ce qui bloque |
|---|---|---|---|---|
| **100 €** | 40 | 22 | **20 colis** | le stock |
| 150 € | 60 | 17 | **17 colis** | la trésorerie |
| 200 € | 80 | 11 | **11 colis** | la trésorerie |

**Le lot à 100 € est le bon, et pour une raison précise : c'est le seul où stock et trésorerie
s'épuisent en même temps.** 40 flacons font 20 duos, et 200 € de réserve financent 22 colis.
Rien ne dort. À 150 €, 26 flacons restent en stock faute de pouvoir payer leur port. À 200 €,
c'est 58 flacons.

**Et 20 colis, c'est 2,5 fois le palier d'autofinancement du réassort.** Le premier lot à
100 € suffit largement à prouver ou à tuer le produit.

⚠️ Ce tableau suppose que les 300 € sont entièrement disponibles pour La Brumerie et que le
port des commandes Shopify est avancé de la même façon. **Le point ouvert du 27 août tient
toujours :** si l'étiquette point de retrait native Shopify est facturée sur la facture
mensuelle Shopify, le port des commandes Shopify n'est pas avancé et le plafond ne s'applique
qu'à TikTok Shop. Ça vaut plusieurs dizaines de colis, et ça se vérifie en une commande test.

---

## 8. Ce qu'il faut faire de ce document

| # | Action | Effet |
|---|---|---|
| 1 | **Passer le flacon seul à 13,90 €** dans les fiches produits | Seule ligne à corriger |
| 2 | **Publier le trio à 41,90 €.** Le pari de 8 € a disparu avec le 250 ml | +16,34 € de marge sur les commandes qui montent |
| 3 | **Peser un flacon emballé** et confirmer les paliers | Sécurise tout le document |
| 4 | Commander un premier lot à **100 €**, pas 150 € | Rien ne dort en stock |
| 5 | Garder le quatuor à 49,90 € en réserve pour le réachat | Ne pas le publier au lancement |
| 6 | Retenir **2,61** comme ROAS break-even avant toute campagne | Évite de scaler une campagne qui perd |

**Ce que ce document ne tranche pas :** le prix affiché du catalogue TikTok Shop contre celui
de Shopify. Ils peuvent différer, la marge Shopify étant supérieure de 2,37 € sur le duo. Je
recommande de garder les mêmes prix sur les deux au lancement, pour une raison qui n'est pas
comptable : deux grilles, c'est deux endroits où se tromper quand on prépare les colis à deux.
