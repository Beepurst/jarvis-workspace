# Brief photo — ce qu'il faut obtenir avant de refaire des créatives

> C'est le vrai blocage de cette direction. La mise en page est réglée, les textes sont en
> concurrence, mais aucune photo de fiche marketplace ne donnera une créative correcte.

---

## Pourquoi la source actuelle ne peut pas marcher

| | Source actuelle | Ce qu'il faut |
|---|---|---|
| Résolution | capture d'écran, méduse seule à **170 px** de large | **2160 px** minimum sur le sujet |
| Agrandissement au rendu | **x7,9** pour la méduse seule, x3,7 pour le trio | x1 ou moins |
| Mise en scène | produits alignés sur aplat gris | produit posé dans une scène |
| Ombre | aucune, les objets flottent | ombre portée réelle |
| Intégrité | la flèche du marchand recouvrait le bord d'une bulle | produit entier |

Le flou visible sur les visuels vient uniquement de là. Tant que la source est une capture, on
regarde une maquette de mise en page, pas une créative.

---

## Ce qu'il faut demander au fournisseur

C'est la voie la plus rapide et la moins chère. À demander tel quel :

1. **Les photos produit en pleine résolution**, fichiers d'origine, pas des captures de la
   fiche. 2000 px minimum sur le côté le plus long.
2. **Les photos sur fond blanc ou gris uni**, une par coloris, produit entier, sans texte ni
   filigrane.
3. **Les photos de mise en scène** si elles existent, dites « lifestyle ».
4. **Une vidéo courte du produit** si elle existe : elle sert pour TikTok et pour les stories.

À demander en même temps, parce que ça conditionne le copy :

5. **Les dimensions exactes** et la **matière**.
6. **La tenue réelle** : sur quel type et quelle épaisseur de cheveux. C'est ce qui débloquerait
   la meilleure requête du lot, aujourd'hui interdite faute de preuve.
7. **Le délai de livraison réel** vers la France, et le coût unitaire par palier.

---

## Si les photos fournisseur ne suffisent pas : shooter soi-même

Un téléphone récent suffit largement, la contrainte est la lumière, pas le boîtier.

**La scène.** Une surface avec de la matière, c'est ce qui manque le plus à la source actuelle :
drap de lin froissé, sable clair, marbre, papier texturé. La référence fournie par Edgar est
exactement ça, un pot posé sur un drap blanc.

**La lumière.** Fenêtre de côté, en journée, sans soleil direct. Pas de flash, il écrase la
translucidité, qui est justement l'atout de ce produit. Un carton blanc en face de la fenêtre
pour déboucher l'ombre.

**Le cadrage.** Un seul produit au premier plan, les deux autres coloris en retrait ou hors
champ. Trois objets alignés se lisent comme un catalogue, pas comme une envie. Prévoir de la
marge autour du sujet : la même photo doit se recadrer en 4:5 pour le feed et en 9:16 pour la
story.

**L'angle.** Légèrement plongeant, comme quelqu'un qui regarde l'objet posé devant lui.

**À faire absolument :** poser le produit sur la surface pour qu'il ait une **vraie ombre**.
C'est ce qui sépare une photo produit d'un objet détouré qui flotte.

**À éviter :** le détourage sur blanc pur, le fond dégradé de studio, les trois coloris alignés,
et tout ce qui ressemble à une photo de marketplace, puisque c'est précisément ce qu'on cherche
à ne pas avoir l'air d'être.

**Ce qu'il faut ramener :** 5 ou 6 photos exploitables, pas 200. Un coloris en gros plan posé,
le même en plan large avec de la marge, les trois coloris ensemble mais en composition et non
alignés, et un plan porté dans les cheveux si c'est possible.

---

## Ce que ça change dans le build

Rien à recomposer. Déposer les fichiers dans `photos/`, relancer
`node photos/nettoyer.mjs && node photos/detourer.mjs` si un détourage reste nécessaire, puis
`node build.mjs`. C'est tout l'intérêt d'avoir la photo comme asset et non comme composition.

Le build affiche le facteur d'agrandissement à chaque passage et signale toute source
sous-résolue. Tant qu'il affiche `SOUS-RÉSOLUE`, rien ne part en diffusion.
