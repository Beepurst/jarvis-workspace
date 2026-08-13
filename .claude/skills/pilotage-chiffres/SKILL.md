---
name: pilotage-chiffres
description: >
  Calcule et pilote les chiffres de la boutique ecommerce : unit economics (marge
  brute, ROAS break-even, CPA cible, AOV), P&L mensuel réel, décision de couper ou
  scaler une campagne, et simulation du chemin vers l'objectif de profit. Les
  tableaux sont sauvegardés dans livrables/pilotage/. Déclenche cette skill dès
  qu'Edgar parle de marge, de rentabilité, de ROAS, de CPA, de budget publicitaire,
  de résultats de campagne, de chiffre d'affaires, de profit, de prix de vente, ou
  demande si quelque chose est rentable ou s'il doit couper ou augmenter un budget,
  même s'il ne prononce pas le mot "chiffres".
---

# Pilotage des chiffres

## À quoi sert cette skill

Une boutique ecommerce se pilote avec quatre ou cinq nombres. Tout le reste est du
bruit. Le piège classique, c'est de regarder le ROAS affiché dans l'ad manager, de
le trouver joli, et de découvrir en fin de mois qu'on a perdu de l'argent parce que
le coût produit, les frais de port, les frais de paiement et les remboursements
n'étaient nulle part dans l'équation.

Cette skill ramène chaque décision à sa réalité comptable. Objectif d'Edgar :
**10 000 € de profit net par mois**, pas de chiffre d'affaires.

## Trois modes d'usage

Détecte le besoin réel avant de calculer.

| Mode | Quand | Sortie |
|---|---|---|
| **Unit economics** | Avant de lancer, ou pour fixer un prix | Marge, seuils, CPA cible |
| **Arbitrage campagne** | Une campagne tourne, faut-il couper ou scaler | Décision tranchée |
| **P&L** | Bilan de semaine ou de mois | Tableau de résultat réel |

---

## Mode 1 : unit economics

### Les formules de référence

```
Prix de vente HT       = Prix TTC / 1,20                      (TVA France 20 %)

Coûts variables        = Coût produit
                       + Frais de port fournisseur
                       + Frais de paiement (≈ 2 % du TTC)
                       + Coût d'emballage ou de service tiers

Marge brute unitaire   = Prix de vente HT - Coûts variables

Taux de marge brute    = Marge brute unitaire / Prix de vente HT

CPA break-even         = Marge brute unitaire
ROAS break-even        = 1 / Taux de marge brute

CPA cible              = Marge brute unitaire - Profit visé par vente
ROAS cible             = Prix de vente TTC / CPA cible
```

**Le point que tout le monde rate :** le ROAS break-even ne se calcule pas sur le
prix de vente, mais sur la marge. Vendre à 50 € avec 20 € de marge brute impose un
ROAS break-even de 2,5. Un ROAS de 2 sur ce produit fait perdre de l'argent, même
s'il a l'air correct dans l'interface.

### Sortie attendue

Un tableau clair, plus trois nombres mis en évidence : **marge brute unitaire**,
**ROAS break-even**, **CPA cible**. Ce sont les trois nombres qu'Edgar doit avoir
en tête en permanence.

Termine toujours par la simulation vers l'objectif :

```
Ventes/mois pour 10 000 € de profit = 10 000 / Profit net par vente
Ventes/jour                          = Ventes mois / 30
Budget pub/jour nécessaire           = Ventes jour × CPA cible
CA mensuel correspondant             = Ventes mois × Prix de vente TTC
```

Si le résultat est irréaliste avec le budget d'Edgar, dis-le franchement et indique
le levier qui change tout : monter le prix, baisser le coût d'achat, augmenter
l'AOV par bundle ou upsell, ou changer de produit.

---

## Mode 2 : arbitrage campagne

Quand une campagne tourne, la question est binaire : on coupe, on laisse, ou on
monte. La réponse dépend du volume de données autant que du ROAS.

### Ce qu'il faut demander

Dépense, chiffre d'affaires, nombre de commandes, période, et le niveau analysé
(campagne, adset, ou créa). Sans le nombre de commandes, aucune conclusion n'est
fiable.

### La règle du volume

Ne juge jamais sur trop peu de données. En dessous d'environ 3 fois le CPA
break-even dépensé, ou moins de 3 à 5 conversions, il n'y a pas de signal, juste du
hasard. Dis-le plutôt que de trancher au doigt mouillé.

### La grille de décision

| Situation | Décision |
|---|---|
| ROAS > ROAS cible, volume suffisant | Scaler, +20 à 30 % de budget, pas plus d'une fois tous les 2 jours |
| ROAS entre break-even et cible | Laisser tourner, optimiser la créa ou le prix |
| ROAS < break-even, volume suffisant | Couper |
| ROAS < break-even, volume insuffisant | Laisser courir jusqu'au seuil de données, puis rejuger |
| CTR très bas | Problème de créa ou de hook, pas d'audience |
| CTR correct mais peu d'achats | Problème de page produit, de prix, ou de tunnel |

Cette dernière ligne compte : quand les gens cliquent mais n'achètent pas, le
problème n'est presque jamais dans l'ad manager. Oriente vers la fiche produit, le
prix affiché, les frais de port, ou les délais de livraison annoncés.

**Rends toujours une décision explicite.** "Ça dépend" n'est pas une réponse. Si
les données sont insuffisantes, la décision est "on attend, et voici le seuil à
atteindre".

---

## Mode 3 : P&L

Le tableau de vérité. Rien ne doit y manquer.

```markdown
| Ligne | Montant | % du CA |
|---|---|---|
| Chiffre d'affaires TTC | | |
| TVA collectée | | |
| **Chiffre d'affaires HT** | | 100 % |
| Coût des produits vendus | | |
| Frais de port fournisseur | | |
| **Marge brute** | | |
| Dépenses publicitaires | | |
| Frais de paiement | | |
| Abonnement Shopify et applications | | |
| Remboursements et litiges | | |
| Autres coûts | | |
| **Profit net** | | |
```

Ajoute systématiquement les indicateurs de suivi :

- **AOV** (panier moyen) = CA TTC / nombre de commandes
- **CPA réel** = dépenses pub / nombre de commandes
- **ROAS global** = CA TTC / dépenses pub
- **Taux de remboursement** = remboursements / CA
- **Avancement objectif** = profit net / 10 000 €

Termine par une lecture en trois lignes maximum : ce qui marche, ce qui coûte, le
levier prioritaire du mois suivant.

---

## Sauvegarde

- Écris le fichier dans `livrables/pilotage/AAAA-MM-JJ-[type].md`, où le type est
  `unit-economics-[produit]`, `arbitrage-[campagne]`, ou `pnl-[mois]`
- Affiche le contenu dans le chat
- Si un P&L précédent existe dans `livrables/pilotage/`, lis-le et compare : une
  évolution vaut mieux qu'un instantané

---

## Règles transverses

- Toujours en français, tutoiement, pas de tirets longs (em dashes).
- **Montre toujours le calcul**, pas seulement le résultat. Edgar doit pouvoir le
  refaire seul dans six mois.
- **Ne jamais parler de CA quand la question porte sur le profit.** Si un chiffre
  a l'air bon en CA mais mauvais en net, dis-le immédiatement.
- **Ne jamais inventer une donnée manquante.** Si Edgar n'a pas le nombre de
  commandes ou le coût produit, demande-le. Si c'est indisponible, pose une
  hypothèse explicite et marque-la comme telle.
- **Arrondis proprement**, deux décimales maximum sur les ratios, à l'euro sur les
  montants.
- Si les chiffres racontent que l'objectif de 10 000 € est hors d'atteinte sur la
  trajectoire actuelle, dis-le avec le calcul à l'appui. C'est plus utile trois
  semaines avant l'échéance que le dernier jour.
