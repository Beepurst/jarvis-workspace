# Montage de l'image de gamme et de la bannière

> Date : 2026-08-26 · La Brumerie
> **À faire à la main, pas en génération.** Voir le constat en bas.

## Ce qu'il te faut

Les packshots **détourés en PNG transparent**, un par référence. Détourage via
Photoroom, Pixelcut, remove.bg ou le Background Remover de Canva Pro.

## Montage, une fois pour toutes

1. **Canva**, format personnalisé **1920 x 1080** pour la bannière
2. **Fond** : rectangle plein couleur crème, teinte prise au sélecteur directement sur
   un rendu validé. Ajoute un léger dégradé vers un beige plus sombre en bas et dans
   les angles
3. **Sol** : une bande horizontale légèrement plus claire dans le tiers inférieur,
   comme sur les rendus. C'est elle qui donne l'assise
4. **Les flacons** : importe les PNG détourés, aligne-les à droite sur une même ligne
   de base, même hauteur. Sélection multiple, puis `Position` puis
   `Espacer horizontalement` pour un écart régulier
5. **Ombres** : sur chaque flacon, `Effets` puis `Ombres` puis `Projetée`. Flou faible,
   décalage vers la droite, opacité autour de 30 %. Même réglage pour tous
6. **Reflets**, optionnel : duplique chaque flacon, retourne-le verticalement, opacité
   12 %, dégradé de fondu vers le bas
7. **Zone de titre** : laisse le tiers gauche entièrement vide
8. **Exporte** en PNG, taille x2 si proposée
9. **Duplique la page** et recadre en 1:1 pour la version carrée, flacons recentrés

## Ajouter une référence plus tard

Tu déposes le nouveau PNG, tu re-sélectionnes tout, `Espacer horizontalement`, tu
réexportes. Deux minutes, et aucune étiquette ne peut se dégrader.

**Ordre retenu**, teinte de liquide du plus clair au plus foncé, avec Ameerat
intercalé entre les deux roses les plus proches pour éviter la confusion :

White Dream · Jasmin Fleur d'oranger · Baby Love · Ameerat · Figues du Maghreb · Khamra

À huit références, Mya G (liquide incolore) se place après Jasmin, et Figue tonka
(rose framboise) entre Baby Love et Ameerat.

---

## Pourquoi ce montage ne se génère pas

Constat établi sur trois séries de tirages, les 25 et 26 août 2026.

| Tentative | Résultat |
|---|---|
| Depuis les photos fournisseur, 5 flacons | Le modèle redessine les 5 étiquettes, il en casse toujours une |
| Depuis les packshots détourés, 5 flacons | **Correct.** Le travail devient une composition, pas une génération |
| Depuis les packshots détourés, 6 flacons | 2 étiquettes fausses : "Maghred", "Khaunra", "RÉSODORISANT" |
| 6 flacons agrandis à 90 % de la hauteur | **Régression** : un flacon purement et simplement disparu, et la mention fausse sur les 5 restants |

**Le mécanisme.** Chaque étiquette porte deux textes fins, dont une mention de 21
caractères. Plus il y a de flacons dans le cadre, moins chacun reçoit de pixels, et
le texte fin est ce qui se dégrade en premier. Agrandir les flacons a réparé le
problème à 5, il ne le répare plus à 6.

**Les passes d'édition ciblées ne sauvent rien** : Nano Banana ne retouche pas une
zone, il régénère l'image entière. Une passe testée le 26 août a réparé deux
étiquettes et abîmé les trois autres.

**Et le problème empire à chaque nouvelle fragrance**, alors que le montage manuel,
lui, ne coûte qu'un glisser-déposer de plus.
