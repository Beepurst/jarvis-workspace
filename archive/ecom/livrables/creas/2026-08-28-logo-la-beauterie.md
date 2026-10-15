# Prompts de génération : logo La Beauterie

> Date : 2026-08-28 · Boutique 2, appareils de coiffure · Marque : **La Beauterie**
> Domaine `labeauterie.fr` libre au 28/08/2026, non réservé
> Outil : Nano Banana (Gemini 2.5 Flash Image) via Google AI Studio

> **Statut du nom : proposé le 28/08, non arrêté.** Identifiants sociaux non vérifiés,
> recherche INPI non faite. Ne rien réserver ni publier avant ces deux vérifications.

---

## La règle qui commande la méthode

**Aucun modèle d'image ne sait écrire un mot correctement, et surtout pas deux fois de suite.**
Il rend « La Beauterie » en « La Beautorie » ou « La Beauleric », change l'orthographe entre deux
générations, et casse le kerning. C'est exactement l'erreur qui a rendu l'étiquette Ameerat
inutilisable en fiche.

**Méthode en deux temps :**

| Temps | Ce qu'on fait | Avec quoi |
|---|---|---|
| 1 | Générer **le symbole seul**, sans aucune lettre | Nano Banana, prompts ci-dessous |
| 2 | Poser le texte « La Beauterie » | Canva ou Figma, police réelle |

Le prompt 4 génère un logo avec texte. **Il est là pour explorer une mise en page, pas pour produire
un fichier final.** Ne l'utilise jamais comme logo réel.

---

## Le brief de marque, à valider avant de générer

Ces choix ne sont pas arrêtés. Ils sont cohérents avec le positionnement mais Edgar ne les a pas
tranchés.

| Élément | Proposition | Pourquoi |
|---|---|---|
| Ce que la marque est | **La boutique française des appareils de coiffure.** Un lieu, pas un fabricant | Même logique que La Brumerie. Les appareils gardent la marque NEXOMI, le logo ne doit pas entrer en concurrence avec elle |
| Symbole retenu | **Une boucle**, un ruban continu qui se lit à la fois comme une mèche bouclée et comme un B | C'est le produit lui-même. Le boucleur est la référence la plus vendable des deux |
| Registre | Premium abordable, chaleureux. Ni luxe parfumerie, ni clinique médical | Le panier est à 24 à 40 €, un registre luxe ferait mentir le prix |
| Couleur principale | Noir profond ou brun très foncé | Tient en petit, tient en monochrome, tient sur fond clair comme sur fond sombre |
| Accent | Rose poudré mat, celui du lisseur YG-08783 | Fait écho au produit réel sans le décrire |
| Police du texte | **Cormorant Garamond** ou **Marcellus**, gratuites sur Google Fonts | Serif à contraste, lit « beauté » sans tomber dans le script illisible |

### La contrainte technique qui élimine la moitié des idées

**L'avatar vendeur TikTok Shop et le favicon Shopify sont des cercles de 32 à 96 pixels.**

Un logo qui ne survit pas à 32 px n'existe pas sur ces deux canaux, qui sont justement les deux
seuls prévus. Donc, éliminatoire : pas de trait fin, pas de dégradé, pas de détail intérieur,
pas plus de deux couleurs, et le symbole doit rester lisible en noir plein sur blanc.

---

## Prompt 1 : planche d'exploration, six symboles

Sert à choisir une direction, pas à produire le logo. Génère plusieurs fois, le taux de rebut
normal est de 3 sur 4.

```
Crée une planche de six propositions de symboles de logo disposées en grille de trois colonnes sur deux lignes, sur fond blanc pur et uniforme, chaque symbole parfaitement centré dans sa case avec une marge généreuse autour. Chaque symbole est dessiné en noir plein uni, sans dégradé, sans ombre, sans relief, sans texture.

Chaque symbole représente une mèche de cheveux bouclée, traitée comme un ruban continu et lisse qui s'enroule sur lui-même en une seule spirale ouverte. Le tracé est fait d'une seule ligne épaisse et régulière, de largeur constante, aux extrémités arrondies. Les six variantes explorent des enroulements différents : une spirale simple, une boucle refermée en forme de goutte, une double courbe en S, une boucle qui suggère la lettre B, une vague à trois ondulations, et une spirale vue de trois quarts.

Style de marque déposée moderne, épuré, géométrique, dessiné à plat comme une icône vectorielle. Le trait est assez épais pour rester parfaitement lisible réduit à la taille d'un favicon de 32 pixels. Aucun détail intérieur, aucun contour fin, aucun élément séparé du tracé principal.

Aucune lettre, aucun mot, aucun chiffre, aucun texte d'aucune sorte dans l'image. Pas de visage, pas de silhouette, pas de ciseaux, pas de peigne, pas de fer à lisser, pas de flacon, pas de fleur, pas de couronne, pas de cadre, pas de cercle englobant. Pas de photographie, pas de rendu 3D, pas d'effet brillant, pas de filigrane.
```

---

## Prompt 2 : le symbole retenu, version propre

À lancer une fois la direction choisie dans la planche. **Remplace la phrase entre crochets** par
la description de la variante retenue, sinon le modèle repart dans une autre direction.

```
Crée un symbole de logo unique, parfaitement centré sur un fond blanc pur et uniforme, occupant environ 60 % de la hauteur du cadre, avec une marge blanche régulière tout autour. Le symbole est dessiné en noir plein uni, sans dégradé, sans ombre portée, sans relief, sans texture, sans contour de couleur différente.

Le symbole représente [DÉCRIS ICI LA VARIANTE RETENUE : par exemple, une mèche de cheveux bouclée formant une spirale ouverte de deux tours et demi, dont l'extrémité extérieure remonte en courbe vers la droite]. Le tracé est fait d'une seule ligne continue épaisse, de largeur constante sur toute sa longueur, aux deux extrémités arrondies. La forme est symétrique et équilibrée, elle tient dans un carré.

Style de marque déposée moderne, épuré, géométrique, dessiné à plat comme une icône vectorielle destinée à être découpée. Le trait est assez épais pour rester parfaitement lisible réduit à 32 pixels de côté. Aucun détail intérieur, aucun contour fin, aucun élément détaché du tracé principal, aucune variation d'épaisseur.

Aucune lettre, aucun mot, aucun chiffre, aucun texte d'aucune sorte. Pas de visage, pas de silhouette, pas de ciseaux, pas de peigne, pas d'appareil de coiffure, pas de fleur, pas de couronne, pas de cadre, pas de cercle englobant. Pas de photographie, pas de rendu 3D, pas d'effet brillant, pas de filigrane, pas de signature d'artiste.
```

---

## Prompt 3 : version avatar, symbole dans un cercle plein

C'est la version qui sert d'avatar vendeur TikTok Shop et de photo de profil Instagram. Le cercle
est imposé par la plateforme, autant le maîtriser au lieu de le subir.

```
Crée une icône d'application carrée sur fond blanc pur. Au centre, un disque plein de couleur noire profonde occupant environ 80 % du cadre, aux bords parfaitement nets et réguliers. À l'intérieur du disque, centré, un symbole en réserve blanche représentant [DÉCRIS ICI LA VARIANTE RETENUE], dessiné d'un seul trait continu épais de largeur constante, aux extrémités arrondies.

Le symbole occupe environ 55 % du diamètre du disque, avec une marge noire régulière tout autour, et ne touche jamais le bord du disque. Contraste maximal entre le noir du disque et le blanc du symbole.

Style de marque déposée moderne, épuré, géométrique, dessiné à plat. Le contraste et l'épaisseur du trait doivent rester parfaitement lisibles réduits à 32 pixels de côté. Aucun dégradé, aucune ombre, aucun relief, aucune texture, aucune bordure supplémentaire.

Aucune lettre, aucun mot, aucun chiffre, aucun texte d'aucune sorte. Pas de photographie, pas de rendu 3D, pas d'effet brillant, pas de filigrane.
```

**Variante fond sombre :** remplace « disque plein de couleur noire profonde » par « disque plein
de couleur rose poudré pâle et mat » et « symbole en réserve blanche » par « symbole en noir
profond ». Tu auras besoin des deux versions, une pour fond clair et une pour fond sombre.

---

## Prompt 4 : mise en page avec texte, exploration seulement

> **Ne sers jamais du résultat comme logo.** Ce prompt existe pour voir comment le symbole et le
> nom cohabitent. L'orthographe sera fausse, c'est attendu. Le texte final se compose dans Canva.

```
Crée une maquette de logo horizontal sur fond blanc pur et uniforme. À gauche, un symbole en noir plein représentant [DÉCRIS ICI LA VARIANTE RETENUE], dessiné d'un seul trait continu épais aux extrémités arrondies. À droite du symbole, séparés par un espace égal à la moitié de la largeur du symbole, les mots « La Beauterie » composés sur une seule ligne dans une police à empattements élégante et contrastée, en noir, avec une majuscule à L et une majuscule à B et le reste en minuscules.

L'ensemble est aligné sur une même ligne médiane, la hauteur du texte vaut environ 60 % de la hauteur du symbole. Composition équilibrée, marges généreuses, style de marque déposée moderne et épuré, dessiné à plat.

Aucun autre mot, aucune baseline, aucun slogan, aucun chiffre, aucune date, aucun cadre, aucun trait de séparation, aucune ombre, aucun dégradé, aucun effet brillant, aucun filigrane, aucune photographie.
```

---

## Checklist de contrôle avant de retenir un rendu

Un rendu se garde seulement s'il coche les huit lignes.

| # | Contrôle | Motif de rebut |
|---|---|---|
| 1 | **Réduis-le à 32 px et regarde-le.** Si le tracé se referme ou devient une tache, rebut | C'est l'avatar TikTok Shop, il n'y a pas d'appel |
| 2 | Passe-le en noir et blanc pur. Il doit rester lisible | Un logo qui a besoin de sa couleur ne tient pas sur un tampon ni un carton |
| 3 | Aucune lettre parasite dans le symbole | Le modèle en glisse souvent une |
| 4 | Épaisseur de trait constante | Une variation d'épaisseur se vectorise mal |
| 5 | Aucun élément détaché ni flottant | Impossible à détourer proprement |
| 6 | Aucune signature, filigrane ou artefact dans un coin | Fréquent, et fatal pour une marque |
| 7 | Ne ressemble à aucun logo existant du secteur | Vérifie à l'œil sur une recherche d'images |
| 8 | Ne raconte pas un produit qu'on ne vend pas | Pas de ciseaux, pas de flacon, pas de fleur |

---

## Ce qu'il faut faire après la génération

Le PNG sorti de Nano Banana n'est pas un logo utilisable. Il est en pixels, donc il bave dès qu'on
l'agrandit, et son fond blanc n'est pas transparent.

1. **Vectoriser le symbole.** Vectorizer.ai, Adobe Express ou Illustrator Image Trace. Sortie en SVG.
   C'est ce fichier qui devient le logo, pas le PNG.
2. **Poser le texte dans une vraie police.** Cormorant Garamond ou Marcellus, gratuites sur Google
   Fonts. Vérifie l'orthographe caractère par caractère, c'est là que les fautes passent.
3. **Exporter les cinq formats dont tu auras besoin :**

| Usage | Format | Fond |
|---|---|---|
| Avatar TikTok Shop et Instagram | PNG carré 800 x 800 | Plein, pas transparent |
| Favicon Shopify | PNG 512 x 512 | Transparent |
| En-tête Shopify | SVG ou PNG 1000 px de large | Transparent |
| Fond sombre | PNG symbole blanc | Transparent |
| Impression, carton de colis | SVG monochrome noir | Sans objet |

4. **Recherche d'antériorité INPI** avant tout dépôt. Gratuite, dix minutes, en ligne.

---

## Ce qui reste ouvert

- **Le nom n'est pas arrêté.** `@labeauterie` n'a été vérifié ni sur TikTok ni sur Instagram, et la
  recherche INPI n'est pas faite. Un domaine libre avec un identifiant pris ne vaut rien sur ce modèle.
- **Le périmètre de la boutique n'est pas tranché.** « Appareils de coiffure femmes » dans le
  CONTEXT, « produits beauté hommes et femmes » selon Edgar le 28/08. Une boucle de cheveux comme
  symbole ferme la porte au rayon masculin. Si le mixte est confirmé, le symbole est à refaire.
- **La palette est une proposition**, pas une décision.
