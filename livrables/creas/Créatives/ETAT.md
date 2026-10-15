# État de la chaîne de créatives

**Au 13 août 2026.** Mis à jour à chaque session qui touche aux créatives.

---

## En un coup d'œil

| | État |
|---|---|
| Chaîne de production (rendu, contrôles, rangement) | **en place et testée** |
| Sourcing photo Pexels | écrit, **non testé de bout en bout** (clé API absente) |
| Grain SVG | brique testée par la mesure (σ 0,000 → 3,420) |
| Directions | **aucune**. Un essai, `essai-direction-search`, non diffusable |
| Visuels diffusables | **aucun** |

### L'essai en cours

`essai-direction-search/` reprend le mécanisme « the search / the solution » d'une annonce
fournie par Edgar, appliqué à une pince à cheveux méduse. Il éprouve la composition, **pas une
offre** : ni prix, ni délai, ni claim n'y est imprimé, et le dossier ne s'appelle pas
`direction-*` donc `ranger-ready.mjs` ne peut pas le ramasser. Voir son `NOTES.md`.

Il attend `essai-direction-search/photos/produit.png`. Sans la photo, on juge une mise en page,
pas une direction.

---

## Ce qui est en place et vérifié

La chaîne HTML → PNG tourne. Vérifié en exécutant, pas en relisant :

- `_gabarit-direction/build.mjs` rend **1 post** (2160x2700) puis **1 post + 1 story**
  (2160x3840) au format attendu, avec Inter réellement chargée et non une police de repli.
- `_feed.mjs` monte la planche à 420 px et **la planche montre bien les visuels** — vérifié en
  ouvrant le PNG, pas en lisant la sortie du script.
- `_zones-story.mjs` pose les repères 250 px / 400 px sur la story et **échoue avec un exit 1
  explicite quand il n'y a aucune story à mesurer**. C'est le comportement voulu : une sonde qui
  ne trouve rien et se tait se lit exactement comme « tout va bien ».
- `ranger-ready.mjs` reconstruit `Ready/` et écrit son README. Il **sort en erreur** si une
  source déclarée est absente ou vide.

Les sorties du gabarit sont conservées volontairement dans `_gabarit-direction/` : elles sont la
preuve exécutable que la chaîne fonctionne sur ce poste. Elles portent « GABARIT » et le dossier
ne s'appelle pas `direction-*`, donc `ranger-ready.mjs` ne peut pas les ramasser.

## Ce qui est écrit mais non vérifié

`sourcing/fetch-candidates.mjs` et `sourcing/fetch-full.mjs` : syntaxe validée et chemins
d'échec testés (clé absente, lot inconnu, identifiant hors index). **Le ratissage réel n'a
jamais tourné**, faute de `PEXELS_API_KEY` dans le `.env`. À considérer comme non prouvé tant
qu'un vrai lot n'est pas passé dedans.

---

## Ce qui bloque, et pourquoi ça ne se contourne pas

**Il n'y a pas de produit.** Ni niche, ni produit, ni fournisseur, ni boutique, ni prix, ni page
d'arrivée. Une créative produite dans cet état inventerait tout ce qu'elle affiche, ce que la
méthode interdit à trois endroits :

- *« Aucun texte n'est inventé. Libellés, chiffres, couleurs, prix se copient depuis la source
  de vérité. »*
- *« Aucune promesse que la page d'arrivée ne tient pas. »* Il n'y a pas de page d'arrivée.
- *« Les couleurs sont recopiées des tokens du produit, jamais choisies sur la créative. »* Il
  n'y a pas de thème.

Ce n'est pas une réserve de principe : ces visuels seraient **jetés en entier** au moment où le
produit est arbitré, parce que le prix, la promesse, la photo, la palette et le registre en
dépendent tous.

### Les huit relevés nécessaires avant la première direction

| # | À relever | Sert à | Sans ça |
|---|---|---|---|
| 1 | **Le produit et sa niche** | tout | rien ne démarre |
| 2 | **Prix de vente, coût produit, frais de port** | le prix affiché dans l'image | prix inventé, écart avec la fiche produit |
| 3 | **URL de la fiche produit** (page d'arrivée) | correspondance surface / destination | promesse non tenue, risque juridique |
| 4 | **Tokens du thème Shopify** (fond, texte, accent, polices) | palette de la direction | la créative diverge du site |
| 5 | **Nom de marque, logo, avatar** → `assets/` | lockup des ads | pas de lockup possible |
| 6 | **Photos produit réelles** du fournisseur | en ecommerce, le produit EST l'image | photo d'ambiance générique |
| 7 | **Délai de livraison réel** du fournisseur | mentions honnêtes | promesse de délai non mesurée, interdite |
| 8 | **Une capture d'annonce concurrente** | référence dont on reprend le mécanisme | on part sans intention |

Les points 1, 2 et 7 relèvent des skills `validation-produit` et `pilotage-chiffres` : le
produit doit avoir passé le go/no-go chiffré avant qu'une créative existe. Faire l'inverse
revient à financer des visuels pour un produit qui ne tiendra pas sa marge.

---

## Dès que le produit est arbitré

```bash
cd livrables/creas/Créatives
ls -d direction-*                        # AVANT de choisir la lettre
cp -R _gabarit-direction direction-a-<nom>

# sourcing, en deux temps
node sourcing/fetch-candidates.mjs "<lot>" "<8 à 10 requêtes d'ambiance>"
node sourcing/fetch-full.mjs "<lot>" <id> <id> -> direction-a-<nom>/photos

cd direction-a-<nom>
node build.mjs            # 3 à 5 accroches, post seul
node _feed.mjs            # la planche que voit Edgar
# --- Edgar tranche sur pièce ---
node build.mjs <lettre>   # post + story de l'accroche retenue
node _zones-story.mjs
# NOTES.md, TEXTES-ANNONCES.md, puis :
cd .. && node ranger-ready.mjs
```

---

## Dette à échéance, à ne pas oublier

**Tout lot portant un prix ou une promo se relit avant chaque programmation.** Un visuel se
périme en silence : un prix qui change, une promo qui se termine, un produit en rupture ne se
voient ni dans la bibliothèque ni dans les légendes, seulement en rouvrant le `build.mjs`.
