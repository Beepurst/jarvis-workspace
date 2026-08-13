---
name: validation-produit
description: >
  Analyse un produit dropshipping de bout en bout et rend un verdict go / no-go
  argumenté et chiffré : demande réelle, niveau de saturation, unit economics
  (marge brute, ROAS break-even, CPA cible), contraintes logistiques et
  réglementaires, saisonnalité, angle marketing possible. Le rapport est
  sauvegardé dans livrables/produits/ et affiché dans le chat. Déclenche cette
  skill dès qu'Edgar évoque un produit candidat, demande si un produit est bon,
  partage un lien AliExpress / Amazon / TikTok / une pub concurrente, demande une
  recherche produit, veut savoir si un produit est saturé ou rentable, ou hésite
  entre plusieurs produits, même s'il ne prononce jamais le mot "validation".
---

# Validation produit

## À quoi sert cette skill

En dropshipping, le produit fait 80 % du résultat. Le piège classique, c'est de
tomber amoureux d'un produit parce qu'il a l'air sympa, de lancer 300 € de pub
dessus, et de découvrir après coup qu'il se vend 12 € sur Amazon en 24 heures ou
que la marge ne couvre même pas le CPA.

Cette skill impose la discipline inverse : on chiffre avant de dépenser. Elle
rend un verdict tranché, pas un avis poli. Un no-go argumenté vaut plusieurs
centaines d'euros de budget pub économisé.

## Déroulé en 4 temps

1. **Collecte** des informations sur le produit.
2. **Recherche terrain** (demande, concurrence, saturation).
3. **Chiffrage** des unit economics.
4. **Verdict** go / no-go + fichier dans `livrables/produits/`.

---

## Temps 1 : la collecte

Pars de ce qu'Edgar a déjà donné, ne le fais pas répéter. Il te manque
généralement peu de choses. Demande uniquement ce qui bloque le chiffrage :

- **Le produit** : lien, nom, ou description
- **Le coût d'achat** : prix fournisseur + frais de port unitaires
- **Le prix de vente envisagé** (s'il n'en a pas, propose-en un et explique)
- **Le marché visé** si ce n'est pas la France

Si Edgar n'a pas les coûts, ne bloque pas : pose une hypothèse explicite, dis-le
clairement dans le rapport, et marque-la comme à confirmer. Un rapport honnête sur
ses hypothèses vaut mieux qu'un rapport bloqué.

---

## Temps 2 : la recherche terrain

Utilise les outils de recherche web disponibles. Ne devine jamais un chiffre de
marché : soit tu as une source, soit tu annonces que c'est une estimation et sur
quoi elle repose.

Ce qu'il faut chercher :

- **Demande** : le produit est-il cherché ? Tendance à la hausse, stable, ou
  morte ? Regarde Google Trends, les volumes de recherche, l'activité TikTok.
- **Saturation** : combien d'annonceurs poussent ce produit ? Depuis combien de
  temps ? Une pub qui tourne depuis 3 mois signale un produit qui convertit, mais
  une bibliothèque publicitaire saturée d'annonceurs signale une guerre de CPM
  déjà perdue pour un nouvel entrant.
- **Le tueur Amazon** : si le produit est dispo sur Amazon en Prime à un prix
  proche du tien, c'est presque toujours rédhibitoire. Vérifie systématiquement.
- **Disponibilité en magasin physique** : même logique.
- **Preuve sociale existante** : vidéos virales, avis, UGC déjà disponible.

Si les recherches ne donnent rien de concluant, dis-le. "Je n'ai pas trouvé de
signal fiable sur la demande" est une information utile, pas un échec.

---

## Temps 3 : le chiffrage

C'est le cœur de la skill. Aucun verdict sans ces calculs.

### Les formules

```
Marge brute unitaire = Prix de vente HT
                     - Coût produit
                     - Frais de port fournisseur
                     - Frais de paiement (~2 % du TTC)
                     - Frais de plateforme

Prix de vente HT     = Prix TTC / 1,20   (TVA France 20 %)

CPA break-even       = Marge brute unitaire
                       (au-delà, tu perds de l'argent sur chaque vente)

ROAS break-even      = Prix de vente TTC / Marge brute unitaire

CPA cible            = Marge brute unitaire - Profit visé par vente
```

### Les seuils de référence en dropshipping

Ce sont des repères, pas des lois. Explique toujours pourquoi un seuil est
franchi ou non.

| Indicateur | Zone rouge | Zone correcte | Zone confortable |
|---|---|---|---|
| Multiplicateur (vente / coût) | < 2,5x | 2,5x à 3x | > 3x |
| Marge brute unitaire | < 20 € | 20 à 30 € | > 30 € |
| ROAS break-even | > 2,5 | 1,8 à 2,5 | < 1,8 |

Une marge brute sous 20 € en acquisition payante est très difficile à tenir : le
CPA réel en cold traffic dépasse souvent ce montant, et il ne reste plus rien pour
absorber les retours, le SAV et les erreurs de campagne.

### Simulation vers l'objectif

Rapporte toujours le produit à l'objectif d'Edgar (10 000 € de profit net par
mois). Calcule :

```
Ventes/mois nécessaires = 10 000 € / Profit net par vente
Ventes/jour nécessaires = Ventes mois / 30
Budget pub/jour associé = Ventes jour × CPA cible
```

Si le résultat exige 40 ventes par jour sur un produit à 8 € de marge, le chiffre
parle de lui-même. C'est souvent la ligne la plus utile du rapport.

---

## Temps 4 : la grille et le verdict

Note chaque critère de 0 à 5, puis pondère.

| Critère | Poids | Ce qu'on regarde |
|---|---|---|
| Marge et unit economics | 25 % | Multiplicateur, marge brute, ROAS break-even |
| Demande réelle | 20 % | Tendance, volume, intérêt observable |
| Niveau de saturation | 15 % | Annonceurs actifs, ancienneté des pubs, Amazon |
| Potentiel créa | 15 % | Effet démontrable en vidéo, problème visuel, hook évident |
| Logistique | 10 % | Poids, volume, fragilité, délais, batteries ou liquides |
| Risque réglementaire | 10 % | Santé, cosmétique, électrique/CE, marque déposée, SAV |
| Saisonnalité et durabilité | 5 % | Produit d'année ou pic éphémère |

**Seuils de décision :**

- **Score ≥ 3,5/5 → GO.** Le produit mérite un test payant.
- **Score entre 2,5 et 3,5 → GO CONDITIONNEL.** Précise la condition exacte à
  lever (renégocier le coût d'achat, monter le prix de vente, valider un angle).
- **Score < 2,5 → NO-GO.** Dis-le franchement et explique le facteur bloquant
  principal en une phrase.

**Les éliminatoires directs**, quel que soit le score : produit dispo sur Amazon
Prime à un prix comparable, marge brute sous 15 €, produit sous marque déposée,
produit médical ou à claim santé, batterie lithium ou liquide inflammable non
transportable, délai fournisseur supérieur à 20 jours sur le marché visé.

---

## Format du rapport

Utilise ce gabarit. Garde les sections vides marquées plutôt que de les
supprimer, pour que les trous restent visibles.

```markdown
# Validation produit — [Nom du produit]

> Date : [AAAA-MM-JJ] · Verdict : [GO / GO CONDITIONNEL / NO-GO] · Score : [X,X/5]

## Verdict en une phrase
[La conclusion, sans détour.]

## 1. Le produit
- **Nom :**
- **Source / fournisseur :**
- **Lien :**
- **Prix d'achat :** [ ] € + [ ] € de port
- **Prix de vente envisagé :** [ ] € TTC

## 2. Unit economics
| Ligne | Montant |
|---|---|
| Prix de vente TTC | |
| Prix de vente HT | |
| Coût produit + port | |
| Frais de paiement (~2 %) | |
| **Marge brute unitaire** | |
| CPA break-even | |
| ROAS break-even | |
| CPA cible (pour [ ] € de profit/vente) | |

## 3. Chemin vers l'objectif
- Ventes/mois nécessaires pour 10 000 € de profit : [ ]
- Ventes/jour : [ ]
- Budget pub/jour associé : [ ]
- **Réaliste ?** [oui / non / sous condition, avec la raison]

## 4. Demande
- **Tendance :**
- **Signaux observés :**
- **Sources :**

## 5. Concurrence et saturation
- **Annonceurs actifs :**
- **Ancienneté des pubs :**
- **Dispo Amazon / magasin :**
- **Lecture :**

## 6. Potentiel créa
- **Effet démontrable :**
- **Problème résolu :**
- **Angles possibles :** [2 ou 3 pistes]

## 7. Logistique et risques
- **Poids / volume / fragilité :**
- **Délai de livraison :**
- **Risque réglementaire :**
- **Risque SAV / retours :**

## 8. Grille de notation
| Critère | Poids | Note /5 | Commentaire |
|---|---|---|---|
| Marge et unit economics | 25 % | | |
| Demande réelle | 20 % | | |
| Saturation | 15 % | | |
| Potentiel créa | 15 % | | |
| Logistique | 10 % | | |
| Risque réglementaire | 10 % | | |
| Saisonnalité | 5 % | | |
| **Score pondéré** | | **/5** | |

## 9. Hypothèses et points à confirmer
- [Toute donnée estimée, toute info manquante]

## 10. Prochaine étape recommandée
- [Action concrète et unique]
```

### Sauvegarde

- Écris le fichier dans `livrables/produits/AAAA-MM-JJ-[slug-produit].md`
- Affiche ensuite le contenu complet dans le chat, qu'Edgar n'ait pas à ouvrir le
  fichier
- Termine en proposant la suite logique : sourcer le fournisseur, passer aux
  angles créas, ou tester un autre produit

---

## Règles transverses

- Toujours en français, tutoiement, pas de tirets longs (em dashes).
- **Ne jamais adoucir un no-go.** C'est le principal service rendu par cette
  skill. Un produit refusé avec une raison claire économise du budget réel.
- **Ne jamais inventer un chiffre de marché.** Estimation annoncée comme telle, ou
  rien.
- Si Edgar soumet plusieurs produits d'un coup, traite-les tous puis termine par
  un classement avec une recommandation unique.
- Si Edgar insiste sur un produit noté no-go, ne cède pas par complaisance :
  redis le facteur bloquant, puis indique la condition précise qui changerait le
  verdict.
