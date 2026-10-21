# Prompt de construction V2 : Garnier Plomberie Chauffage (One page)

> À coller dans une session ouverte avec `/site test-garnier-plomberie`.
> **Tu ne conçois rien : tu reproduis une maquette validée par Edgar**, au pixel près autant que Framer le permet.

---

## Le modèle à reproduire

- Code de la maquette : `/Users/ed/Desktop/jarvis-kleak/livrables/clients/test-garnier-plomberie/maquette/index.html`. Lis-le **une fois** en entier : les valeurs exactes (couleurs, tailles, interlettrage, arrondis, espacements, textes, URL des images) sont dans le CSS et le HTML. Les textes sont définitifs, mot pour mot.
- Rendu attendu : `maquette/bureau.png` (1440 px) et `maquette/mobile.png` (390 px), page entière. Regarde-les une fois au début.
- Règles du style maison si un cas n'est pas couvert : `/Users/ed/Desktop/jarvis-kleak/livrables/process/style-maison.md`.

## Cible

- Projet Framer **TEST-CLAUDE**, nouvelle page **`/garnier-v2`**. Ne touche pas à `/garnier-plomberie` (la V1) ni aux autres pages.
- 3 points de rupture : bureau 1440, tablette 810, mobile 390. Les règles `@media` de la maquette (1100 px et 720 px) donnent ce qui change.

## Traduction en Framer

| Maquette | En Framer |
|---|---|
| Variables `:root` | Styles de couleur du projet : Fond `#F2EFEA`, Carte `#FFFFFF`, Sombre `#14273D`, Accent `#F08A24`, Bleu `#1F5FA8` |
| Titres | Plus Jakarta Sans 700, interlettrage en `em` converti en % (−3,5 % pour H1, −3 % pour H2). Texte Inter 400 et 500 |
| Boutons pilule avec rond | Un composant « Bouton » à variantes : Accent, Sombre, Verre ; icône téléphone ou flèche. Survol : le rond glisse de 3 px |
| Services en accordéon | Un composant « Ligne de service » à 2 variantes (fermée, ouverte) ; la ligne 01 ouverte par défaut |
| Questions | Un composant « Question » à 2 variantes ; la première ouverte |
| Avis défilants | Composant Ticker de Framer, vitesse lente, pause au survol |
| Carte de la zone | Le SVG de la maquette importé tel quel |
| Barre d'appel mobile | Pile fixe en bas, visible seulement en mobile |
| `.apparait` | Apparition au défilement (opacité 0 → 1, 24 px → 0, 0,6 s) sur 4 éléments seulement : titres H2 de « Pourquoi », « Services », « Avis », et le bloc orange final. **Rien sur l'accroche** |

## Images

Mêmes URL Unsplash que la maquette, importées à la bonne taille : accroche 1920 px (version mobile sous 80 Ko), photos de services 1100 px, photo « 15 ans » 1000 px, vignette de la carte flottante 240 px. 6 images en tout.

## Règles

- Repères `header`, `nav`, `main`, `footer` ; bouton du menu en `button` ; `lang="fr"`.
- Tous les boutons d'appel ouvrent `tel:+33199004217`.
- Appels Framer groupés par section, une capture de contrôle par section réduite à 1000 px, comparée à la même zone de `bureau.png`.

## Fin de construction

1. Passe le contrôle « niveau Framer » (style maison, section 8) sur tes captures bureau et mobile, et corrige avant de rendre la main.
2. Publie (aperçu) et donne l'adresse.
3. Liste les écarts avec la maquette que Framer n'a pas permis, et pourquoi.
4. Note l'heure de début, l'heure de fin et le temps perdu sur des erreurs d'outil dans `livrables/clients/test-garnier-plomberie/suivi-test.md`, ligne « Construction V2 ».
