# Prompts de génération : tapis de léchage chien

> Date : 2026-09-14 · Produit : tapis en silicone à ventouses, fiche AliExpress `Shop1105053467 Store`
> Prix de vente retenu : 24,90 € · Outil : Google AI Studio (Nano Banana / Gemini 2.5 Flash Image)
> Lié à : `livrables/produits/2026-09-14-tapis-lechage-chien-premium.md`

---

## La règle qui commande la méthode

**Le packshot ne se génère jamais, il se détoure.** Nano Banana ne sait pas reproduire fidèlement un objet réel à partir d'un texte : il invente sa propre version du tapis, avec ses propres ventouses, sa propre texture, potentiellement une taille ou une couleur différente de ce que le client recevra. Vendre une image générée comme photo produit est trompeur et prépare un litige au premier avis "pas comme sur la photo".

**Méthode en deux temps :**

| Temps | Ce qu'on fait | Avec quoi |
|---|---|---|
| 1 | Récupérer les vraies photos du vendeur sur la fiche AliExpress (toutes les couleurs si possible) | Fiche produit, clic droit > enregistrer, ou capture d'écran haute résolution |
| 2 | Détourer sur fond blanc pour la fiche produit | Photoroom, Pixelcut, Canva (détourage automatique, gratuit) |

**Pour les visuels d'ambiance/contenu (ceux ci-dessous), on part de la vraie photo en entrée** (Nano Banana accepte une image + un prompt de transformation) plutôt que de générer de zéro, pour que le tapis reste reconnaissable. C'est plus fiable que de décrire le produit en toutes lettres.

---

## Packshot fiche produit (détourage, pas de prompt)

1. Prendre la photo la plus nette du vendeur, de face, couleur qui deviendra la couleur "hero" de la fiche (proposition : **Blue and Gray**, neutre et premium, évite le violet/orange plus enfantins)
2. Détourer sur fond blanc pur (#FFFFFF) via Photoroom ou Pixelcut
3. Vérifier qu'aucune ventouse ni aucun relief n'est coupé par le cadrage
4. Garder 2-3 couleurs détourées en variantes si la fiche Shopify propose un choix de couleur

---

## Prompts d'ambiance / contenu (image + texte, à partir de la vraie photo)

Charge la photo détourée ou la photo brute du vendeur comme image de référence dans Nano Banana, puis colle un des prompts ci-dessous. Génère 3-4 variations par prompt, le taux de rebut normal est de 3 sur 4.

### 1. Avant/après calme (angle principal, cf. validation produit)

> Using the exact dog licking mat shown in the reference image (same color, same suction cup texture, same shape), place it in a softly lit modern living room, suction-cupped to a light wooden floor or a large ceramic bowl. A golden retriever or a calm medium-sized dog is lying down peacefully next to it, tongue mid-lick, in a relaxed home environment with warm natural window light. Photorealistic, shallow depth of field, lifestyle pet photography style, no text overlay.

### 2. Usage détourné : bain / toilettage

> Using the exact dog licking mat shown in the reference image, show it suction-cupped to a wet bathroom tile wall or the side of a bathtub, smeared with a light peanut-butter-colored paste. A small-to-medium dog is standing in a bath, licking the mat calmly while being gently washed, water droplets visible, bright clean bathroom lighting, photorealistic, lifestyle photography, no text overlay.

### 3. Gros plan "satisfaisant" (hook TikTok muet)

> Extreme close-up, macro-style shot of the exact dog licking mat from the reference image, suction cups visibly gripping a smooth kitchen counter or bowl surface, a dog's tongue captured mid-motion licking a ridge filled with a creamy treat. Bright, clean, high-contrast lighting, shallow depth of field, hyper-detailed texture, photorealistic, vertical 9:16 framing suited for TikTok.

### 4. Comparatif visuel (packshot amélioré, optionnel)

> Using the exact dog licking mat from the reference image, place it centered on a clean, softly shadowed light gray surface, styled like a premium product photo (similar to a high-end pet brand catalog), no hands, no background clutter, soft studio lighting from the top left, subtle reflection beneath the product, photorealistic, square 1:1 framing.

---

## Angles vidéo à tourner en priorité (rappel du rapport de validation)

1. **Avant/après** : chien agité → chien calme dès la pose du tapis
2. **Usage bain/toilettage détourné** : le tapis comme distraction pendant un moment habituellement pénible pour le chien
3. **Test comparatif** : "j'ai testé 3 façons d'occuper mon chien, laquelle il préfère" avec le tapis en vainqueur évident

**Point de vigilance à intégrer dans le script ou la fiche produit** : 54 avis sur 1100 signalent des ventouses peu efficaces. Filmer sur une surface bien lisse et propre (carrelage, verre, céramique) pour maximiser la tenue réelle, et le mentionner explicitement dans la fiche ("fonctionne mieux sur surface lisse et propre") pour limiter les retours et les avis négatifs.
