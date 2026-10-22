# Créas Meta Kleak : journal

> Tenu par l'agent `createur-creas`. Le plus récent en haut. On écrit ce qui a été écarté et
> pourquoi, pas seulement ce qui a été retenu, pour ne pas refaire le même arbitrage.

## Série BTP (22/10/2026) : artisans du bâtiment, One page

Commande de `media-buyer` (`livrables/media-buying/commande-creas-btp.md`), campagne
« Kleak | BTP One page ». Cible : artisans du bâtiment ; c'est l'image qui fait le ciblage,
donc « artisan » ou « chantiers » est dans l'accroche. DA fine de la série 5, une idée par
créa, le prix sur N seulement. Posts rendus, stories codées mais ni rendues ni contrôlées.

- Nouvelle capture : `_captures/garnier-v2-mobile.png` (`node _capture.mjs garnier-v2-mobile`,
  démo V2 publiée sur `/garnier-v2`). Le bandeau « entreprise fictive » du site est en haut de
  l'écran, doublé de la légende « Démo Kleak · entreprise fictive ».
- Vignettes de M : photos Unsplash de la planche Garnier, copiées dans `assets/garnier/`.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| l | `l-demo-artisan` | Démo métier, sans prix : « Un site d'artisan sur une seule page, avec vos services et votre zone *d'intervention.* » Un téléphone, démo Garnier Plomberie V2, légende « Démo Kleak · entreprise fictive » | Proposée |
| m | `m-15-minutes-chantiers` | Le peu de temps, sans prix : « Vous êtes sur les chantiers. Pour votre site, comptez 15 minutes de *questionnaire.* » Carte en verre « Questionnaire · 15 minutes » (rubriques de la fiche : ambiance et couleurs, sites que vous aimez, logo, photos de vos chantiers). Ligne du bas : « Questionnaire en ligne, envoyé à la signature. Textes, photos et logo sont fournis par vous. » | Proposée |
| n | `n-devis-artisan-699` | Prix fixe pour l'artisan : « Votre site d'artisan, à prix *fixe.* » Devis papier (traitement de K) : « Site internet, One page », 699,00 €, « 1 page qui réunit tout : » et les cinq rubriques, total 699,00 €, « Valable 30 jours », tampon « Prix fixe ». Condition : « Formule One page, paiement en une fois. Maintenance en option. » | Proposée |

Écarté volontairement : le prix et « One page » sur L et M, « réalisation » et « client » pour
la démo, tout cadrage sur les avis ou le numéro de la démo, « on écrit tout » ou « rien à
faire » (contenus fournis par le client, rédaction sur devis), la frise des 7 étapes, le délai
(une idée par créa), la TVA, toute durée d'engagement de la maintenance, tout prénom.

## B et D passées au One page (21/10/2026)

Demande d'Edgar : B et D affichent l'offre la plus basse, le One page à 699 €, au lieu de
l'Essentiel à 999 €. Même composition, seuls les textes et les chiffres changent. A n'a pas de
prix et n'est pas touchée. Source : fiche offre, One page : 699 € (prix le plus bas des trois
formules, donc « dès » reste juste), 1 page, « Livraison en 5 jours ouvrés après réception de vos
contenus et du premier paiement », mentions légales, bandeau cookies et conformité RGPD inclus.

- B : « en 7 jours* » devient « en 5 jours* », « dès 999 € » devient « dès 699 € », « 3 pages »
  devient « 1 page » (« mentions légales et RGPD inclus » vaut aussi pour le One page, gardé).
  Condition : « * 5 jours ouvrés après réception de vos contenus et du premier paiement.
  Formule One page. » Fichier renommé `b-5-jours-699` (ex `b-7-jours-999`, PNG supprimés).
  Si l'ancien B a été déposé dans le hub ou dans Meta, il faut l'y remplacer à la main.
- D : la pastille passe à « dès 699 € · en 5 jours* » (nouveau paramètre `pastille` de
  `avantApres`). Condition : « * 5 jours ouvrés après réception de vos contenus et du premier
  paiement. Formule One page. Avant : illustration. » Elle tient sur une ligne sur le post et sur
  deux sur la story.
- Contrôles : planche story OK (rien sous la ligne des 400 px), planche feed OK.
- Les textes d'annonce de B et D (TEXTES-ANNONCES.md, hub) parlent sans doute encore de
  l'Essentiel : à faire revoir par `media-buyer`.

## Série 5 (21/10/2026) : DA fine, une idée par créa

Demande d'Edgar après l'écart de F, G, H et I : 2 créas plus raffinées, dans la DA des
références Orbikal (`assets/references-da/`), une **sans aucun prix** et une **avec le prix
comme seule idée**. Ses retours, valables pour la suite : le prix pas partout, beaucoup moins
d'informations, une idée comprise en deux secondes, rien qui fasse « généré par IA ».

**Ce qui rend les références fines (relevé avant de dessiner).** Une seule accroche en phrase
normale, taille moyenne, semi-grasse, avec beaucoup de vide autour. Un seul objet réaliste et
tactile (le ticket : dents, papier, code-barres, ombre, légère rotation), ou deux cartes en verre
dont une seule mise en avant. Des détails discrets, la marque petite. À éviter : grilles de
tuiles, pastilles répétées, chiffres géants partout, en-têtes « MARQUE · CATÉGORIE » en mono,
titres ultra gras serrés, lueurs fortes.

**La DA appliquée.** Fond `#0A0B0F`, halo brun chaud derrière l'objet, halo bleu Kleak discret en
haut à droite, trame de points à 3,5 %. Accroche en Inter Tight 600 (62 px sur le post),
approche -0,022 em, un mot en Instrument Serif italique. Marque : petit K de 40 px. Briques dans
`build.mjs` : `FONTS_FIN`, `TITRE_FIN`, `italique`, `fondFin`, `marquePetite`, classes `.grain`
(grain de papier) et `.encre` (tampon). Les briques de la série 4 sont retirées.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| j | `j-avis-clients` | Preuve, sans prix : « Avant de nous confier votre site internet, lisez ce qu'en disent nos *clients*. » Carte en retrait : note Google 4,8/5. Carte en avant : avis de Laura Dias, mot pour mot | **Validée** (Edgar, 21/10). Post et story rendus, story contrôlée |
| k | `k-devis-prix-fixe` | Prix, seule idée : « Le prix, vous le connaissez *avant* de commencer. » Devis papier plié en trois, « Site vitrine, formule One page, 1 page », total 699,00 €, « Valable 30 jours », tampon « Prix fixe ». Condition : « Formule One page, paiement en une fois. Maintenance en option, 49 €/mois, engagement 12 mois. TVA non applicable, article 293 B du CGI. » | **Validée** (Edgar, 21/10). Post et story rendus, story contrôlée |

Écarté volontairement : le paiement en 6 fois (fiche à corriger), le délai, tout numéro de
devis, nom de client ou date inventés, les avis de Méliné Grelet et Aurore Melis (texte
inconnu), le nombre d'avis Google (inconnu), tout logo Google.

**Finalisation de J et K (21/10).** Retours d'Edgar.
- J : « on ne comprend pas forcément que c'est de la création de sites internet dès le premier
  regard ». Entre les deux pistes proposées, j'ai pris l'accroche plutôt qu'une ligne en plus :
  « Avant de nous confier votre site internet, lisez ce qu'en disent nos *clients*. ». Le
  visuel n'est pas plus chargé, et le mot « site internet » est dans ce qu'on lit en premier.
  Le quart du bas était vide : tout le bloc descend (marque à 170, titre à 290, cartes à 610 et
  816 sur le post), et sur la story les cartes descendent de 100 px. Style inchangé.
- K : la formule la moins chère, pour donner envie. One page 699 € (« 1 page ») à la place
  d'Essentiel 999 €. Condition : « Maintenance en option, 49 €/mois, engagement 12 mois » à la
  place de « Hors maintenance et hébergement ». J'ai ajouté l'engagement, qui est la condition
  de la fiche pour la maintenance. La fiche ne dit pas « en option » mot pour mot : elle le
  suppose (« Sans maintenance, le site est mis en ligne sur votre propre compte, dont
  l'abonnement est réglé par vous »). Sur la story, le devis remonte de 30 px et passe de 640 à
  610 px pour ne plus frôler la condition. Rien d'autre ne change.
- Contrôle de la zone story : rien sous la ligne des 400 px, ni dans la bande du bas, pour J et K.


## Série 4 (21/10/2026) : F et G en DA « verre sombre »

Demande d'Edgar : refaire F et G dans une autre DA, sombre avec un effet « liquid glass »,
d'après deux créas Orbikal (`assets/references-da/orbikal-ticket.png`,
`orbikal-avant-apres.png`). On reprend la DA seule, ni le contenu ni la marque Orbikal. F et G
sont gardées telles quelles.

**La DA, notée pour la réutiliser.** Fond presque noir (`#07080C`), halo ambre en haut à gauche
et halo bleu Kleak en bas à droite, trame de points à 7 % d'opacité. Cartes en verre : fond
translucide sombre, bord fin lumineux, reflet en haut. La carte mise en avant a un bord
bleuté et une lueur qui va de l'ambre au bleu. Titre en Inter Tight 800, approche serrée
(-0,035 em), avec un seul mot en Instrument Serif italique. Libellés en JetBrains Mono,
capitales espacées. Gros chiffres en Inter Tight, pastilles de statut bleu Kleak avec un point
lumineux. Le K reste en haut, à gauche, suivi d'un libellé mono. L'orange et le logo Orbikal sont
remplacés par le bleu `#0F2FD1` et le K. Briques dans `build.mjs` : `verreFond`, `carteVerre`,
`libelleMono`, `pastilleStatut`, `GROT`, `MONO`, `SERIF`, `FONTS_VERRE`. La propriété `fonts`
d'une créa remplace les polices par défaut, sans effet sur A, B et D.

**Corrections de fond par rapport à F et G.**
- H : la maintenance n'est plus « comprise ». D'après `livrables/offre/note-interne-offre.md`
  (Encaissement), elle est obligatoire, démarre à la mise en ligne et s'ajoute aux versements.
  Elle apparaît donc dans l'image (carte « + 90 €/mois ») et dans la condition (« Maintenance
  obligatoire de 90 €/mois en plus, dès la mise en ligne, engagement 12 mois. »). La fiche offre
  dit encore « La maintenance est comprise dans ce mode de paiement » : elle contredit la note
  interne et doit être corrigée avant toute diffusion de H (règle : mot pour mot avec la fiche).
  F garde l'ancienne condition et ne doit pas être diffusée en l'état.
- I : aucune barre ni aucun graphique. Le rapport ne donne que les trois rubriques de la fiche,
  chacune avec une pastille « Inclus ».

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| h | `h-6-fois-verre` | Paiement, DA verre : « Votre site vitrine en 6 fois, *sans* frais » · « Formule Essentiel, 3 pages, en ligne dès la livraison », carte 6 × 166,50 €, carte maintenance + 90 €/mois | Écartée (Edgar, 21/10) : « j'aime pas », « trop d'informations, on va perdre les visiteurs », « ça fait trop IA, ça se voit que c'est Claude qui les a faits, il faut plus raffiné, plus fin, comme les références », « on parle trop de prix ». Code commenté, PNG supprimés |
| i | `i-suivi-verre` | Suivi, DA verre : « On s'occupe de votre site, même *après* la mise en ligne », carte « Rapport mensuel » 90 €/mois*, tuiles hébergement, mises à jour, 30 min | Écartée (Edgar, 21/10) : « j'aime pas », « trop d'informations, on va perdre les visiteurs », « ça fait trop IA, ça se voit que c'est Claude qui les a faits, il faut plus raffiné, plus fin, comme les références », « on parle trop de prix ». Code commenté, PNG supprimés |

## Série 3 (21/10/2026) : paiement en 6 fois, suivi après la mise en ligne

Demande d'Edgar : 2 créas, angles libres hors marque, prix et avant / après, liberté de
composition dans la charte. Les lettres c et e restent prises (code commenté), d'où f et g.
F tranche par un fond clair (seule créa claire), G par une fiche « Rapport mensuel » au
centre. Toutes les valeurs viennent de la fiche offre (« Payer en une fois ou en 6 fois » pour
F, « Maintenance et hébergement », colonne Essentiel et Pro, pour G), conditions recopiées en
bas. Écarté : « 999 € au total » sur F (le total est ambigu puisque la maintenance est comprise
dans le paiement en 6 fois), tout chiffre dans le rapport de G (barres vides, aucun visiteur ni
demande inventés), Orbikal (en pause, absent de la fiche).

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| f | `f-6-fois-sans-frais` | Paiement : « Votre site vitrine en 6 fois sans frais » · « Formule Essentiel, 3 pages, en ligne dès la livraison », échéancier 6 × 166,50 € | Écartée (Edgar, 21/10) : « j'aime pas », « trop d'informations, on va perdre les visiteurs », « ça fait trop IA, ça se voit que c'est Claude qui les a faits, il faut plus raffiné, plus fin, comme les références », « on parle trop de prix ». Code commenté, PNG supprimés |
| g | `g-suivi-chaque-mois` | Suivi : « On s'occupe de votre site après la mise en ligne » · « Hébergement, mises à jour, et un rapport chaque mois », pastille 90 € par mois* | Écartée (Edgar, 21/10) : « j'aime pas », « trop d'informations, on va perdre les visiteurs », « ça fait trop IA, ça se voit que c'est Claude qui les a faits, il faut plus raffiné, plus fin, comme les références », « on parle trop de prix ». Code commenté, PNG supprimés |

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
| b | `b-5-jours-699` (ex `b-7-jours-999`) | Offre : « Votre site vitrine en 7 jours, dès 999 € », passée au One page le 21/10 (« en 5 jours, dès 699 € »), démo sur ordinateur, avis Laura Dias | **Validée (visuel)** le 18/10, retenue avec A et D pour le test de 50 €. Post et story rendus, story recontrôlée |

Écarté des anciennes pubs : « 49 €/mois » (ne correspond plus à l'offre), « N°1 des agences
Framer » et « +50 % de clients » (invérifiables), les boutons dessinés dans l'image.
