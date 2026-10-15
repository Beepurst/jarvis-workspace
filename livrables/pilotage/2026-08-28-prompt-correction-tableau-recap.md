# Prompt de correction du tableau récapitulatif Google Drive

> Date : 2026-08-28 · À coller dans la session Claude qui a accès au tableau
> Source de vérité : `context/CONTEXT.md` + les livrables du 27 et 28 août
> Ce prompt est daté. **Après toute nouvelle décision, il est périmé et doit être régénéré.**

---

## Comment t'en servir

Colle le bloc ci-dessous dans la session qui a accès au Google Drive. Il contient toutes les
valeurs justes au 28 août 2026, plus la liste des erreurs qui ont réellement circulé dans le
projet. La session n'a rien à recalculer, elle n'a qu'à comparer et à corriger.

**Un point à vérifier avant :** je n'ai trouvé aucun fichier dans le Drive connecté à cette
session, pas même en cherchant tes propres documents. Le tableau est probablement sur le
compte de Forqan. Assure-toi que la session que tu ouvres est bien connectée au bon Drive,
sinon elle cherchera un fichier qu'elle ne peut pas voir.

---

## LE PROMPT, à copier à partir de la ligne suivante

```
Tu as accès à un tableau Google Drive qui récapitule mon projet ecommerce. Il a été construit
dans une session antérieure et **une partie de ses chiffres est fausse**, parce que le projet a
bougé trois fois depuis : le 22 août, le 27 août et le 28 août.

Ta mission : auditer ce tableau ligne par ligne contre la source de vérité ci-dessous, et le
corriger. Tu ne recalcules rien, tout est fourni.

## Méthode

1. Ouvre le tableau et liste ses onglets et ses colonnes avant de toucher à quoi que ce soit.
2. Compare chaque valeur à la table de référence ci-dessous.
3. Corrige.
4. **Rends-moi un journal des corrections** : pour chaque cellule modifiée, l'onglet, la
   cellule, l'ancienne valeur, la nouvelle, et la raison en cinq mots.
5. Liste à part ce que tu n'as pas pu trancher.

## Trois règles absolues

- **N'invente aucune valeur.** Si le tableau contient un champ qui n'est pas dans la référence
  ci-dessous, tu le laisses tel quel et tu me le signales dans la liste finale. Un chiffre
  plausible mais non sourcé est pire qu'une case vide.
- **Ne supprime aucune ligne ni aucun onglet**, même s'ils décrivent une décision abandonnée.
  L'historique des décisions renversées explique pourquoi le projet est où il est. Marque-les
  « caduc au [date] » plutôt que de les effacer.
- **Distingue ce qui est mesuré de ce qui est estimé.** Chaque valeur ci-dessous porte son
  statut. Une estimation présentée comme un fait dans un tableau de pilotage est exactement le
  genre d'erreur qu'on est en train de corriger.

---

# SOURCE DE VÉRITÉ AU 28 AOÛT 2026

## 1. Les erreurs à chercher en priorité

Ce sont les valeurs périmées qui ont réellement circulé. Cherche-les en premier, elles sont
probablement dans le tableau.

| Valeur fausse à chercher | Valeur juste |
|---|---|
| **500 ml** | **250 ml** (corrigé le 28/08) |
| Flacon **14,90 €** | **13,90 €** (corrigé le 28/08) |
| Trio **bloqué** / « pari à 8 € » / « à ne pas publier » | **Débloqué**, 41,90 € livraison offerte |
| Duo **au même parfum**, 5 variantes | **Duo au choix, 15 combinaisons** (28/08) |
| Budget **200 €** | **600 €**, soit 300 € par boutique (27/08) |
| Poids **950 g** par flacon | **~650 g** emballé, **estimé, non pesé** |
| Trio à **24,90 €** (grille du 22/08) | **41,90 €** |
| Vente 18 € / marge **4,65 €** (scénario du 22/08) | Caduc, voir la grille ci-dessous |
| Port **4,50 €** ou **4 €** | **5,99 € / 7,99 €** selon palier |
| Commission TikTok **5 %** ou **8 %** | **9 %** (grille France depuis le 08/01/2026) |
| Droit de douane **3 € par article** | **Ne s'applique plus** depuis le pivot du 22/08, marchandise achetée en France |
| Franco de port **39 €** ou **38,90 €** | **41,90 €** |
| **756** commandes pour 10 000 € | **759** |
| Objectif 10 000 € pour **mi-novembre 2026** | **Hors d'atteinte, acté.** Horizon 6 à 9 mois |
| **Dropshipping** comme modèle | **Achat en gros à Aubervilliers, stock détenu** (22/08) |
| Niche **anti-stress** | **Abandonnée le 14/08** |

## 2. Le modèle et le statut

| Champ | Valeur | Statut |
|---|---|---|
| Modèle | Achat en gros chez grossistes d'Aubervilliers, stock détenu, expédition à la main depuis Cergy | Arrêté le 22/08/2026 |
| Canal de vente principal | TikTok Shop | |
| Canaux secondaires | Shopify, puis Meta / TikTok / Google Ads **en séquence, jamais en parallèle** | |
| Marché | France métropolitaine uniquement | |
| Statut juridique | Micro-entreprise, achat-revente, **sur le SIRET de Forqan** | |
| APE actuel | **70.22Z**, conseil pour les affaires (activité libérale) | Changement vers achat-revente **déclaré au guichet INPI, en attente de bascule INSEE** |
| Activité | **Mixte.** Les deux CA partagent le même compteur de 85 000 € de franchise TVA | |
| Régime TVA | **Franchise en base**, art. 293 B. Aucune TVA collectée ni déductible | Recommandé et chiffré, non formellement tranché |
| Chiffre d'affaires à ce jour | **0 €** sur les deux boutiques | |
| Produits achetés à ce jour | **0** | |

## 3. La Brumerie : produit et prix

| Champ | Valeur | Statut |
|---|---|---|
| Niche | Désodorisants textiles parfumés | Arrêtée 22/08 |
| Marque | **La Brumerie** | Arrêtée 22/08 |
| Domaine | `labrumerie.fr` réservé | |
| Produit | Flacon verre pulvérisateur à gâchette, **250 ml** | **Corrigé le 28/08** |
| Références en ligne | **5** : White Dream, Jasmin Fleur d'oranger, Baby Love, Ameerat, Khamra | |
| Références au catalogue créas | **8** (les 5 + Mya G, Figue tonka, Figues du Maghreb) | Les 3 dernières n'ont qu'un packshot |
| Coût d'achat | **2,50 € TTC** par flacon | **Relevé sur place le 26/08** |
| Poids emballé | **~650 g** par flacon | ⚠️ **ESTIMÉ, NON PESÉ** |
| Fournisseur | Grossiste d'Aubervilliers, visité le 26/08 | **Rien n'est commandé** |

### Grille de prix, arrêtée le 28 août

| | 1 flacon | 2 flacons | 3 flacons | 4 flacons |
|---|---|---|---|---|
| Prix affiché | **13,90 €** | **26,90 €** | **41,90 €** | 49,90 € (non publié) |
| Port facturé | +5,99 € | +7,99 € | offert | offert |
| **Total encaissé** | **19,89 €** | **34,89 €** | **41,90 €** | 49,90 € |
| **Marge nette TikTok Shop** | **6,44 €** | **13,53 €** | **16,34 €** | 19,92 € |
| **Marge nette Shopify** | **7,68 €** | **15,90 €** | **19,23 €** | 23,42 € |
| ROAS break-even | 3,09 | 2,58 | 2,56 | 2,51 |
| Prix au flacon pour le client | 13,90 € | 13,45 € | 13,97 € | 12,47 € |

**Le duo est l'unité de vente par défaut.** Le flacon seul est un point de comparaison qui
n'est pas fait pour se vendre. Le quatuor existe mais n'est pas publié : il est réservé au
réachat.

### Structure de coûts

| Poste | Valeur |
|---|---|
| Coût d'achat | 2,50 € TTC par flacon |
| Emballage | 0,70 € (1 flacon) · 0,90 € (2) · 1,10 € (3) · 1,30 € (4) |
| Commission TikTok Shop | **9 %** du total encaissé, **port compris**. 4 % les 60 premiers jours si l'incitation nouveaux vendeurs est acceptée |
| URSSAF | **12,415 %** du total encaissé, **port compris** |
| Shopify Payments | 1,5 % + 0,25 € |
| Abonnement Shopify | 1 €/mois les 3 premiers mois, puis ~44,20 €/mois par boutique |

⚠️ **La commission et l'URSSAF frappent le port refacturé.** C'est l'erreur la plus fréquente
du projet, elle a déjà surestimé des marges de 1,20 à 1,30 €. Le CA déclaré en micro-entreprise
est le total encaissé, frais de port compris.

### Port Mondial Relay, grille publique particuliers 2026

| Tranche | Tarif | Nombre de flacons 250 ml |
|---|---|---|
| jusqu'à 0,25 kg | 4,15 € | |
| jusqu'à 1 kg | **5,99 €** | 1 flacon (~0,65 kg) |
| jusqu'à 2 kg | **7,99 €** | 2 flacons (~1,30 kg) |
| jusqu'à 3 kg | **7,99 €** | 3 (~1,95 kg) et 4 (~2,60 kg) |
| jusqu'à 5 kg | 15,99 € | |

**Le port est un escalier, pas une pente**, et il ne bouge pas entre 2 et 4 flacons.

### Seuils et objectifs

| Indicateur | Valeur |
|---|---|
| Total encaissé minimum pour ne pas perdre d'argent | **11,69 €** (1 flacon) · 17,68 € (2) · 21,11 € (3) · 24,55 € (4) |
| Coût marginal d'un flacon ajouté au même colis | **2,70 €** |
| Marge nette moyenne par commande (mix 60/25/15) | **13,17 €** |
| Panier moyen encaissé | **34,39 €** |
| Flacons par commande | 2,10 |
| **ROAS break-even global** | **2,61** |
| **CPA break-even** | **13,17 €** |
| Couvrir les frais de structure | 3,4 commandes/mois |
| **Autofinancer un réassort de 100 €** | **7,6 commandes/mois** |
| 500 € de profit net | 38 commandes/mois |
| 1 000 € de profit net | 76 commandes/mois |
| **10 000 € de profit net** | **759 commandes/mois, soit 25,3 colis/jour** |

⚠️ **En franchise en base, la publicité relève de l'autoliquidation.** 100 € de trésorerie
n'achètent que 83 € de publicité réelle. Toute règle de coupe se lit en trésorerie.

## 4. Trésorerie

| Champ | Valeur |
|---|---|
| Trésorerie totale | **600 €** (relevée le 27/08, 200 € auparavant) |
| Dont par boutique | **300 €** |
| Réinjection mensuelle possible | 100 à 300 € |
| MOQ grossiste physique Aubervilliers | ~150 € |
| MOQ NEXOMI | **100 €, libre sur tout le catalogue** |
| Port + emballage avancés par colis duo | **8,89 €** |
| Cycle de versement TikTok Shop | **31 jours après livraison** (palier introductif) |
| Cycle de versement Shopify Payments | 3 jours |

**Capacité du premier mois sur La Brumerie, avec 300 € :**

| Premier lot | Flacons | Colis finançables | Plafond réel | Ce qui bloque |
|---|---|---|---|---|
| **100 € (recommandé)** | 40 | 22 | **20 colis** | le stock |
| 150 € | 60 | 17 | 17 colis | la trésorerie |
| 200 € | 80 | 11 | 11 colis | la trésorerie |

## 5. Boutique 2 : appareils de coiffure

| Champ | Valeur | Statut |
|---|---|---|
| Niche | Appareils de coiffure pour femmes | Arrêtée 27/08 |
| Marque | **NON DÉFINIE.** Ni nom, ni domaine, ni positionnement | |
| Fournisseur | **NEXOMI**, 43 rue de la Haie Coq, 93300 Aubervilliers, `nexomi.net` | Compte ouvert au nom de Forqan |
| MOQ | 100 €, libre | |
| Prix affichés NEXOMI | **Retenus comme HT** par prudence | ⚠️ **NON VÉRIFIÉ** |
| Lisseur YOUGOU YG-08783 60W | Achat 8,50 € HT / 10,20 € TTC → vente 24,90 € → **marge 7,58 €** | |
| Boucleur CIAOBOSI TX-39065 45W | Achat 5,00 € HT / 6,00 € TTC → vente 19,90 € → **marge 7,86 €** | |
| **Duo lisseur + boucleur** | Achat 16,20 € TTC → vente **39,90 €** → **marge 13,17 €** | Format par défaut |
| Brosse soufflante TX-8947 | **Écartée par Edgar le 27/08**, malgré la meilleure marge des quatre (14,36 €) | |
| Boutique Shopify | **Non créée** | |
| TikTok Shop | **Passe par le Seller Center existant.** Ne JAMAIS créer un second compte vendeur | Le risque est la suspension du premier |

## 6. Ce qui n'est PAS mesuré

**Aucune de ces lignes ne doit apparaître dans le tableau comme une donnée acquise.** Si le
tableau les présente comme des faits, corrige-les en « estimé » ou « non vérifié ».

| Inconnue | Ce qu'elle vaut |
|---|---|
| **Poids réel d'un flacon plein et emballé** | Commande le palier de port. Non pesé |
| **Classement ADR des brumes** | Mondial Relay refuse la classe 3 et cite les parfums. **Si les brumes sont alcoolisées, toute la grille de port est à refaire** |
| Facture du grossiste avec TVA et SIRET | Éliminatoire pour le statut de distributeur |
| Adresse d'importateur UE et numéro de lot sur l'étiquette | Obligation GPSR |
| Prix NEXOMI HT ou TTC | Vaut 1,00 à 1,70 € de marge par vente |
| Documents de conformité électrique NEXOMI | Déclaration UE, notice FR, identifiant ADEME au titre de la REP DEEE |
| **Capacité logistique réelle en colis/jour** | C'est elle qui plafonne le CA, et aucun chiffre n'existe |
| Tarifs professionnels Mondial Relay | Tous les calculs sont sur la grille publique particuliers, donc le pire cas |
| Taux de retour sur appareils chauffants | Poste qui sépare la boutique 2 de La Brumerie |
| Montant de l'abonnement Google AI | Jamais communiqué. Payé le 25/08 pour un mois |

## 7. Échéances

| Date | Échéance |
|---|---|
| **1er septembre 2026** | Obligation de réception de facture électronique. Plateforme agréée à choisir |
| **25 septembre 2026** | Fin de l'abonnement Google AI, à reconduire ou non |
| **30 septembre 2026** | Option pour le versement libératoire de l'IR, pour application au 01/01/2027 |
| 1er novembre 2026 | Redevance européenne de frais de gestion annoncée, non chiffrée |
| Horizon 6 à 9 mois | Objectif 10 000 € de profit net mensuel |

## 8. Quand tu as fini

Rends-moi, dans cet ordre :

1. **Le journal des corrections**, une ligne par cellule modifiée.
2. **Les incohérences internes** que tu as trouvées dans le tableau, c'est-à-dire deux cellules
   qui se contredisent entre elles. Elles sont plus dangereuses qu'une valeur simplement
   périmée, parce qu'on ne sait pas laquelle a servi de base aux calculs suivants.
3. **Ce que tu n'as pas pu trancher**, avec la question précise à me poser.
4. **Ce qui manque au tableau** au vu de la source de vérité ci-dessus, en particulier la
   colonne « statut » qui distingue mesuré, estimé et non vérifié. Si elle n'existe pas,
   propose-la, ne la crée pas sans mon accord.
```
