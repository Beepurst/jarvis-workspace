# Créas Meta Kleak : journal

> Tenu par l'agent `createur-creas`. Le plus récent en haut. On écrit ce qui a été écarté et
> pourquoi, pas seulement ce qui a été retenu, pour ne pas refaire le même arbitrage.

## Série 2 (18/10/2026) : avant / après

Demande d'Edgar : une seule créa sur ce thème. L'« avant » est un site daté inventé en HTML
(« VOTRE ENTREPRISE », aucune vraie marque, aucune capture), légendé « Illustration ».
L'« après » est la démo Atelier Hauteville v2, légendée « Démo Kleak · entreprise fictive »
en plus du bandeau du site. Écarté : tout chiffre de résultat et tout « nos clients ont… »
(l'après est fictif), le prix (une idée par créa).

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| c | `c-avant-apres` | Avant / après, fierté : « Un site dont vous serez fier » · « À vos couleurs, clair et net sur téléphone » | Écartée (Edgar, 18/10) : accroche générique. Code commenté, PNG supprimés |
| d | `d-avant-apres-appeler` | Avant / après, contact : « Un site qui donne envie d'appeler » · « Clair dès le premier écran, facile à contacter » | **Validée (visuel)**, post et story rendus, textes dans TEXTES-ANNONCES.md (2 variantes de texte principal à trancher) |
| e | `e-avant-apres-montrer` | Avant / après, fin de la gêne : « Fini le site qu'on n'ose pas montrer » · « Un site clair, à votre image, net sur téléphone » | Écartée (Edgar, 18/10) : « j'aime pas cette accroche ». Code commenté, PNG supprimés |

**D, air et téléphones (19/10).** Retours d'Edgar : la bulle « Après » était presque collée
au sous-titre, et les téléphones un peu trop grands. Sur le post comme sur la story, tout ce
qui est sous le sous-titre descend de 70 px. Les téléphones sont réduits d'environ 10 % (après
306 à 276 px et avant 230 à 207 px sur le post, après 310 à 280 px et avant 240 à 216 px sur la
story) en gardant leur centre, donc le rapport entre eux. La pastille suit l'après, avec le
même léger contact qu'avant. La flèche est recalée et ne touche toujours ni les bulles ni les
téléphones (vérifié au zoom). Positions dans `txt.layout` de D, valeurs par défaut inchangées.

**D, flèche et fond (19/10).** Retours d'Edgar :
- La flèche chevauchait la bulle « Avant ». Elle est maintenant tracée en coordonnées de la
  page (`txt.fleche`). Elle part à distance nette de la bulle « Avant » et de son ombre et
  s'arrête avant la bulle « Après » et le téléphone, sur le post comme sur la story (vérifié
  sur un zoom @2x).
- Le fond est un cran plus sombre pour faire ressortir les textes blancs (`txt.fond`) : haut
  `#0A22B0` au lieu de `#0F2FD1`, bleu nuit dès 55 % au lieu de 75 %, halo bleu ciel réduit de
  0,55 à 0,38. Le bleu du cartouche, de la bulle « Après » et de la pastille ne change pas. La
  constante T et les créas A et B ne sont pas touchées.

**D, légendes remplacées par des arguments (19/10).** Edgar préfère des arguments aux
légendes. Ses mots, repris mot pour mot : « Site vieillot » sous l'avant, « Site moderne et
fluide » sous l'après (Manrope gras, un peu plus grand : 30 px sur le post, 34 px sur la story).
La mention « Avant : illustration » passe en petit dans la ligne de condition (« * 7 jours
ouvrés après réception de vos contenus et de l'acompte. Formule Essentiel. Avant :
illustration. »), pour qu'on ne croie pas que ce client avait ce site avant. Sur la story, la
condition tient sur deux lignes au-dessus de la ligne des 400 px. TEXTES-ANNONCES.md n'a pas été
touché, Edgar les retravaille.

**Finalisation de D (18/10).** Edgar retient D, écarte C et E.
- L'après montre une **vraie réalisation Kleak** à la place de la démo fictive : Accueil
  Sénior Assistance, https://accueilseniorassistance.com/ (Framer, crédit Kleak en pied de page).
  Capture `_captures/asa-mobile.png` (390x844 @2x, `node _capture.mjs asa-mobile`). Le nettoyage
  des cookies reconnaît maintenant aussi « Paramètres des Cookies » et retire le bloc fixe.
- Légendes : « Réalisation Kleak / Accueil Sénior Assistance » sous l'après (« entreprise
  fictive » serait faux), « Avant : illustration » sous l'avant, pour qu'on ne croie pas que ce
  client avait ce site avant. Aucun propos ni résultat prêté au client.
- Le reste de la v3 est inchangé (accroche, sous-titre, bulles, pastille et condition). La story
  passe le contrôle de zone : tout est au-dessus de la ligne des 400 px.
- Les PNG de C et E et la story v2 périmée de C sont supprimés de `rendus/`.

**V3 (18/10, 2e retour d'Edgar : « les textes sont pas terribles », et « avant », « après »,
« dès 999 € en 7 jours* » trop gros pour leurs bulles).**
- Bulles : texte des étiquettes réduit (54 → 44 et 76 → 60 px sur le post) avec plus de marge
  intérieure. Pastille agrandie (236 → 250 px) et son texte réduit (70 → 52 et 36 → 29 px).
- Textes : la composition v2 est factorisée dans `avantApres(fmt, txt)`. c, d et e ne
  diffèrent que par l'accroche et le sous-titre, chacune sur ce que le dirigeant ressent ou
  gagne. L'accroche v2 « Votre site vitrine, version Kleak » est abandonnée (jugée faible).
- Toujours écartés : chiffres de résultat, « nos clients », promesse d'être trouvé sur Google.

**V2 (18/10, retour d'Edgar : « ça ne donne pas forcément envie de cliquer », et penser au
bouton Meta en bas des stories).** Ce qui a changé et pourquoi :
- L'après devient le héros : plus grand, au premier plan, halo bleu ciel. L'avant passe en
  retrait, plus petit, incliné et assombri. Une flèche donne le sens de lecture. En v1, les deux
  téléphones avaient le même poids et la créa était plate.
- Raison de cliquer : pastille « dès 999 € · en 7 jours* » avec la condition de la fiche offre
  en bas (« 7 jours ouvrés après réception de vos contenus et de l'acompte. Formule
  Essentiel. »), comme B. Le prix, écarté en v1, revient donc, à la demande d'Edgar.
- L'écran avant est rempli jusqu'en bas (plan d'accès, livre d'or, formulaire) : en v1 il
  finissait par une zone grise vide. Le fond est désormais continu : la bande sombre de la
  moitié gauche, qui coupait la créa sous le sous-titre, est supprimée.
- L'étiquette « Après » est posée au-dessus du téléphone pour ne pas masquer le bandeau
  « entreprise fictive » du site.
- La story est composée pour elle-même et tout tient au-dessus de la ligne des 400 px. Les
  250 px du bas ne portent que le dégradé.

## Série 1 (18/10/2026)

Inspiration : les anciennes pubs Kleak et celles d'Orbikal, fournies par Edgar. Aucune n'a de
résultat mesuré, ce ne sont pas des « gagnantes ».

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| a | `a-un-kleak` | Marque : « Un site web en un Kleak », démo sur téléphone, 4,8/5 Google | **Validée (visuel)** le 18/10, retenue avec B et D pour le test de 50 €. Post et story rendus, story contrôlée (rien sous la ligne des 400 px) |
| b | `b-7-jours-999` | Offre : « Votre site vitrine en 7 jours, dès 999 € », démo sur ordinateur, avis Laura Dias | **Validée (visuel)** le 18/10, retenue avec A et D pour le test de 50 €. Post et story rendus, story recontrôlée |

Écarté des anciennes pubs : « 49 €/mois » (ne correspond plus à l'offre), « N°1 des agences
Framer » et « +50 % de clients » (invérifiables), les boutons dessinés dans l'image.
