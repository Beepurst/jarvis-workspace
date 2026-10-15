# Direction E (essai) — search / solution

> ## >>> NON DIFFUSABLE <<<
>
> Le produit n'est pas arbitré : pas de fournisseur, pas de prix, pas de fiche produit, pas de
> boutique, pas de page d'arrivée. Cette direction éprouve **la chaîne et la composition**, pas
> une offre.
>
> Trois garde-fous, volontairement redondants : le dossier ne s'appelle pas `direction-*` donc
> `ranger-ready.mjs` ne peut pas le ramasser, les fichiers sortent préfixés `ESSAI-`, et la
> condition est répétée ici, dans `build.mjs` et dans `ETAT.md`.

---

## Ce qu'elle montre

Une requête de recherche telle qu'on la taperait vraiment, posée dans une barre de recherche,
puis le produit donné comme réponse. Deux temps, deux libellés, rien d'autre. Fond gris très
clair, produit posé en bas, aucun lockup, aucun bouton.

## Le mécanisme

**Référence :** capture fournie par Edgar, annonce skincare anglophone, « the search: how to
stop dry flaky skin » / « the solution: » + pot de crème sur drap blanc.

**Ce qu'on reprend, le mécanisme.** La requête met des mots sur un besoin que le lecteur
reconnaît, la barre de recherche fait la preuve que la demande existe déjà, et le produit
arrive en réponse plutôt qu'en vitrine. Plus la composition : fond très clair, produit posé,
pas de marque apparente.

**Ce qu'on écarte, la promesse.** « stop dry flaky skin » est un claim que le produit d'origine
peut porter parce qu'il agit dessus. Une pince à cheveux n'a aucun équivalent, et lui en
fabriquer un serait exactement le travers que la méthode interdit. Nos requêtes portent donc
sur le **choix** (originalité, cadeau), jamais sur un effet.

**Corollaire à ne pas perdre :** ce mécanisme rend une requête crédible parce qu'elle est
plausible, pas parce qu'elle est vraie. On n'écrit aucune requête qui affirmerait une
caractéristique produit non vérifiée auprès du fournisseur.

## Version 1 rejetée par Edgar

Verdict : « c'est mauvais ». Trois causes retenues, à ne pas réintroduire.

1. **La photo.** Trois objets détourés alignés sur un aplat gris, soit une fiche marketplace
   agrandie. La référence, elle, **pose** un produit dans une scène : drap froissé, lumière,
   ombre. C'est le défaut principal et il ne se corrige pas au clavier. Voir `BRIEF-PHOTO.md`.
2. **Le produit flottait.** Centré, contenu dans le cadre, sans ombre, avec de l'air partout.
   Dans la référence il déborde du bord bas et occupe les deux tiers de l'image.
   **Corrigé :** détourage sur fond transparent, ombre portée qui suit la silhouette,
   débordement hors cadre.
3. **Les libellés.** « la recherche : / la solution : » est une traduction littérale de
   « the search: / the solution: ». En anglais le rythme porte, en français ça sonne scolaire.
   **Corrigé :** quatre mises en page en concurrence, dont deux sans aucun libellé.

Le mécanisme lui-même n'est pas en cause, Edgar l'a confirmé. Il est conservé tel quel.

## Les mises en page en concurrence

Requête fixe (`idée cadeau pour une ado`) : on ne fait varier **que** la mise en page, sinon on
ne sait plus ce qui a fait la différence.

| | Libellés | Sujet |
|---|---|---|
| MEP1 | « tu cherches : » / « ça existe : » | une méduse |
| MEP2 | aucun, la barre pose le mécanisme seule | une méduse |
| MEP3 | aucun | les trois coloris |
| MEP4 | « la recherche : » / « la solution : » (version littérale, pour comparer) | une méduse |

## Les accroches

Ce qui varie d'un visuel à l'autre, c'est **la requête**. Les deux libellés ne bougent pas :
les faire varier en même temps rendrait la planche illisible, on ne saurait plus ce qui a fait
la différence.

| | Requête | Angle |
|---|---|---|
| a | pince à cheveux originale | recherche directe, intention produit |
| b | idée cadeau pour une ado | cadeau, et le Q4 approche |
| c | quoi offrir à quelqu'un qui a déjà tout | cadeau, angle plus large |
| d | accessoire cheveux introuvable ailleurs | différenciation |

**Écartées, avec leur motif :**

- « pince à cheveux qui tient les cheveux épais » — c'est la **meilleure requête du lot en
  intention d'achat**, et elle est interdite tant que la tenue n'est pas confirmée par le
  fournisseur. Affirmer une caractéristique produit non vérifiée est le défaut qui a déjà coûté
  une direction entière. **À rouvrir dès que la fiche fournisseur documente la tenue.**
- « la pince à cheveux que tout le monde s'arrache » — preuve sociale fabriquée, aucun client
  réel derrière.
- « accessoire cheveux qu'on ne voit sur personne » — version longue de (d), passait sur deux
  lignes. Voir plus bas.

## Conventions de charte appliquées

Aucune, et c'est le point. Il n'y a pas de thème Shopify, donc pas de tokens à recopier. Les
couleurs sont **relevées à l'œil sur la référence**, ce que la méthode interdit en production.
Assumé pour un essai et pour lui seul. Elles sont marquées `>>> A RENSEIGNER` dans le
`build.mjs`.

Poppins retenue pour sa proximité avec la grotesque ronde de la référence.

## Décisions de composition

- **Pas de lockup de marque, pas de bouton.** La référence n'en a pas, et c'est précisément ce
  qui la fait passer pour du contenu plutôt que pour une publicité. L'incitation vivra dans le
  texte d'annonce.
- **La requête en graisse 500, pas 700.** Une requête tapée n'est pas un titre. En 700 elle se
  lit comme un slogan et le mécanisme tombe.
- **Le haut de la zone produit est calé juste sous le second libellé** (530 px en post, 760 px
  en story). Une première version le posait 300 px plus bas : à 420 px de large ce vide se
  lisait comme une erreur de mise en page, et le produit décrochait de la phrase qui l'annonce.
- **La requête (d) a été raccourcie.** En deux lignes la pilule devenait un rectangle et cessait
  de ressembler à un champ de recherche. Le mécanisme repose entièrement sur cette
  ressemblance, donc la contrainte est dure : **une requête doit tenir sur une ligne.**
- **Le produit est dimensionné par la HAUTEUR disponible, jamais par la largeur.** Une version
  fixait sa largeur à 62 % du cadre : la méduse ayant un rapport de 1,9 en hauteur, elle sortait
  à 1298 px dans un cadre de 1350 et **recouvrait la barre de recherche**. Un sujet très allongé
  casse tout dimensionnement pensé en largeur.
- **L'ombre est un `drop-shadow` et non une `box-shadow`** : elle suit l'alpha du détourage,
  donc la silhouette de la méduse, au lieu de dessiner un rectangle.
- **En story, le produit s'arrête à 280 px du bas**, au-dessus de la bande recouverte de 250 px.
  Le texte, lui, reste au-dessus du plancher de 400 px. Ce sont deux limites différentes : le
  produit peut descendre plus bas que le texte, il ne doit simplement pas se faire manger.

## La photo produit

Source fournie par Edgar : **capture d'écran d'une fiche marchande**, 698x688. Elle portait le
cœur « favori », la loupe « zoom », la flèche « suivant » et le liseré blanc de la capture.
Nettoyée par `photos/nettoyer.mjs`, qui est scripté et non retouché à la main pour rester
rejouable le jour où le fournisseur envoie mieux.

Puis détourée par `photos/detourer.mjs`, par **propagation depuis les bords** et non par
seuillage : un seuil « ce qui ressemble au fond devient transparent » perce les bulles, dont les
reflets internes sont aussi clairs que le fond. En partant des bords, est fond ce qui est
**relié** au bord, donc un reflet enfermé dans une bulle est conservé. Une seule méduse est
ensuite isolée par composantes connexes, un rectangle emportant des morceaux des deux autres.

**Défauts résiduels, tous dus à la source, pas à la composition :**

1. **La photo est sous-résolue.** 578x577 après recadrage, agrandie **x3,74** pour remplir un
   post rendu à 2160 px. Le build l'annonce à chaque passage. Il faudrait une source de
   2160 px de large pour un rendu net. **Bloquant pour une diffusion réelle.**
2. **Le flou est visible à l'œil sur la planche.** Conséquence directe du point 1, et c'est ce
   qui empêche de juger la direction autrement que comme une maquette de mise en page.
3. **Une encoche subsiste sur le bord droit de la bulle violette.** La flèche « suivant »
   recouvrait réellement le produit dans la capture : l'information est perdue dans la source.
   La restaurer reviendrait à **inventer des pixels du produit**, ce qui n'a pas été fait.
   Disparaîtra avec la photo fournisseur.

## Ce qui a été vérifié, et comment

- **4 posts rendus**, comptés à la sortie, pas annoncés : `4 visuel(s) écrits (4 attendus)`.
- **Planche 420 px ouverte et regardée.** C'est ce qui a fait apparaître les deux défauts
  ci-dessus, invisibles à 1080.
- **Repères story posés** sur la story de contrôle : aucun texte ne franchit la ligne des
  400 px, le produit reste au-dessus de la bande des 250 px.
- **Le grain a été mesuré** sur un aplat uni : σ 0,000 sans, 3,420 avec. La brique de
  `_lib/grain.mjs` fonctionne. **Elle n'est pas utilisée ici** : fond clair, et on ne dégrade
  pas la photo de ce qu'on vend.

## Pièges rencontrés

**Trois défauts de la chaîne trouvés par ce test, tous corrigés dans le code :**

- **Un nettoyage d'image faux qui sortait en succès.** La première version de `nettoyer.mjs`
  peignait les pixels « clairs ET peu saturés ». Or une icône est un TRAIT GRIS FONCÉ sur un
  DISQUE BLANC : le critère effaçait le disque et préservait le trait, l'inverse exact du but.
  Le script annonçait « 32 179 pixels neutralisés » et sortait 0, avec les icônes toujours en
  place. **Compter des pixels peints ne prouve pas que les bons l'ont été.** Le contrôle vérifie
  désormais qu'il ne reste rien d'étranger, au lieu de compter.
- **Une couleur de fond relevée sur les quatre coins.** Le coin haut-droit tombait dans le
  liseré blanc de la capture, la moyenne sortait #fcfcfc au lieu du vrai #f4f4f4, et le patch
  se voyait comme un rectangle. Les points de relevé sont maintenant choisis, pas pris aux
  coins par commodité.
- **`max-width` n'agrandit pas, il limite.** La photo de 578 px s'affichait à 578 px dans une
  zone de 1080 : le produit paraissait deux fois trop petit et rien ne le signalait. Corrigé en
  `width/height: 100%` + `object-fit: contain`. Le build mesure désormais le facteur
  d'agrandissement et avertit au-delà de 1,15.
- **Une encoche invisible à 420 px, flagrante en story.** Le premier critère de nettoyage
  peignait les reflets clairs du bord de la bulle. La planche feed ne l'a pas vue, les repères
  story si. **Les deux contrôles ne voient pas les mêmes défauts, il faut les deux.**

- Le vide sous « la solution : » ne se voyait pas en regardant le PNG à taille réelle. Il saute
  aux yeux sur la planche à 420 px. C'est le contrôle qui rattrape le plus de défauts, et
  c'est confirmé dès la première direction.
- Le placeholder de photo franchit le plancher des 400 px en story, puisqu'il occupe toute la
  zone produit. Ce n'est pas une faute de composition : c'est du texte de placeholder, il
  disparaît avec la vraie photo. **À revérifier une fois la photo posée.**

## Ce qui reste à faire

1. **Obtenir la photo produit du fournisseur, en haute résolution.** C'est le vrai blocage :
   la source actuelle est une capture d'écran sous-résolue et partiellement recouverte par
   l'interface du marchand.
2. **Trancher la requête sur la planche.** La story rendue pour (b) est un contrôle de mise en
   page, pas un arbitrage.
3. Vérifier auprès du fournisseur la tenue sur cheveux épais, pour rouvrir la requête écartée.
4. `TEXTES-ANNONCES.md`, un jeu par angle et non par fichier.
5. Rien ne part tant qu'il n'y a pas de page d'arrivée : la règle « la surface correspond à sa
   destination » n'a pas d'exception.
