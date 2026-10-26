# Créas Meta Kleak : journal

> Tenu par l'agent `createur-creas`. Le plus récent en haut. On écrit ce qui a été écarté et
> pourquoi, pas seulement ce qui a été retenu, pour ne pas refaire le même arbitrage.

## Série 8 bis (26/10/2026) : x, y, z, autres angles et autres mises en page

Retour d'Edgar sur la série 8 : v et w retenues, u écartée. Il veut 3 créas complètement
différentes de u, v, w : autres angles, autres mises en page, plus de « photo + phrase sur fond
crème ». Même cadre (patrons au travail, bénéfice concret, aucun écran, aucun prix, ni « PME »,
ni « TPE », ni « artisans »). Posts rendus, stories codées, ni rendues ni contrôlées.

- **Photos Pexels** (licence Pexels : usage commercial gratuit, attribution non obligatoire),
  téléchargées par le CDN `images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg`, copiées dans
  `assets/personnes/`. Identifiants trouvés à partir des séances déjà connues (landing page et R),
  la recherche Pexels étant bloquée. Y et Z viennent des mêmes séances que les photos de la
  landing page (chef 17655298, fleuriste 5409710), avec d'autres images : pub et page se
  ressemblent. X vient de la même séance que la photo de droite de R (même personne).
- Planche : `node _feed.mjs x y z` → `_planche-selection.png`. La planche complète
  (`node _feed.mjs`, 28 posts) plante désormais (page Chromium fermée, image trop lourde) : à
  découper ou à alléger.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| x | `x-appel-bulle` | L'appel qui arrive grâce au site. Photo plein cadre d'une patronne de café au téléphone, qui rit (Pexels 10375889), bulle blanche : « Bonjour, j'ai vu votre site internet, je voudrais un *renseignement.* » Ligne du bas : « Kleak Agency · Création de sites internet », mention « Illustration » | **Retenue** (Edgar, 26/10). Post et story rendus, story contrôlée, déposés dans le hub |
| y | `y-portrait-chef` | La personne derrière l'entreprise. Post coupé en deux : portrait d'un chef de face à gauche (Pexels 17655302), aplat bleu Kleak à droite : « Sur votre site, vos clients voient qui les attend avant de *venir.* » Story : photo en haut, aplat en bas | Écartée (Edgar, 26/10) |
| z | `z-carnet-fleuriste` | Les demandes arrivent sans interrompre le travail. Photo plein cadre d'une fleuriste qui lit son carnet (Pexels 5409734), texte blanc en bas sur dégradé sombre : « Vos clients vous écrivent depuis votre site. Vous répondez quand vous avez un *moment.* » Source : fiche, « chaque demande arrive directement dans votre boîte mail » | Écartée (Edgar, 26/10) |

Écarté volontairement : toute demande précise dans la bulle de X (devis, réservation) qui
exclurait des métiers, tout nom, toute interface d'appel, l'écran de l'ordinateur de la photo X
(recadré, seul un bord du dos reste à droite), les noms de métier dans les accroches, tout délai
de réponse et la réponse automatique sur Z (option payante).

### Finalisation de v, w et x (26/10/2026)

Retenues par Edgar : `v-metier-atelier`, `w-metier-barbier` (série 8) et `x-appel-bulle`
(série 8 bis). Y et Z écartées : code commenté, PNG gardés. Story 9:16 rendue pour chacune
(`node build.mjs v w x`), composition déjà codée, rien recomposé. Seule retouche : une ombre
portée légère sous « Photo d'illustration » de V et sous la ligne de marque de X, pour qu'elles
restent lisibles sur la photo (posts et stories).

- Contrôle des zones : `node _zones-story.mjs v w x`. Rien sous la ligne des 400 px ni dans la
  bande des 250 px. Dernier texte : mention de V à 1450 px, mention de W à 1440 px, ligne de
  marque de X à 1380 px. Sous la ligne, il n'y a que de la photo (V, X) ou du fond (W).
- Posts revérifiés sur `node _feed.mjs v w x`.
- **Dépôt dans le hub** (`POST /api/intake/creatives`, méthode du README) : les PNG font entre
  5,4 et 8,5 Mo (photos plein cadre et grain), au-dessus de la limite de 4 Mo. Déposés en
  **JPEG qualité 92, mêmes dimensions** (2160x2700 et 2160x3840), copies dans `~/Downloads/`
  (`<nom>-post.jpg`, `<nom>-story.jpg`). 201 pour les six, noms de base `v-metier-atelier`,
  `w-metier-barbier`, `x-appel-bulle`, formats 4:5 et 9:16. Les PNG de `rendus/` restent la
  source.

## Série 8 (26/10/2026) : moins tech, plus orientée PME, DA claire

Tâche de la to-do d'Edgar (Prospection) : « Nouvelles créas moins tech, plus orientées PME ».
Des gens au travail dans leur métier, une phrase, rien d'autre : aucun écran, aucune interface,
aucun mockup, aucune carte en verre. **DA claire** (fond crème `#F7F4EE` vers `#F1ECE3`, grain
léger, encre `#17181D`, un mot en Instrument Serif italique bleu Kleak), pensée pour la future
landing page en thème clair. Briques dans `build.mjs` : `fondClair`, `TITRE_CLAIR`,
`italiqueBleu`, `marqueClaire`, `photoCarte`, `mentionPhoto`, `JPG`. L'orientation PME passe
par les photos, jamais par les mots. Mention « Photo d'illustration » sur les trois, pour qu'on
ne prenne pas ces personnes pour des clients Kleak. Posts rendus, stories codées, ni rendues ni
contrôlées.

- **Photos** : la recherche Pexels est bloquée en automatique (403, contrôle anti-robot), et les
  aperçus rawpixel sont filigranés. Source retenue : photos **Unsplash d'avant 2017, licence
  CC0**, hébergées sur Wikimedia Commons (licence vérifiée sur chaque page Commons), copiées dans
  `assets/personnes/` (réduites à 3000 px de large) :
  - U : `unsplash-MhOoD_h90ks.jpg`, Joanna Boj, https://commons.wikimedia.org/wiki/File:Cook_in_a_caf%C3%A9_(Unsplash).jpg
  - V : `unsplash-iXV0i4Wo4yc.jpg`, Igor Ovsyannykov, https://commons.wikimedia.org/wiki/File:Craft_Workshop_(Unsplash).jpg
  - W : `unsplash-m4Pd_e-4zKs.jpg`, Phùng Hải, https://commons.wikimedia.org/wiki/File:Head_shaved_by_barber_(Unsplash).jpg
- Planche de la série : `node _feed.mjs u v w` → `_planche-selection.png`.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| u | `u-metier-cafe` | Restauration, des clients qui viennent : « Pendant que vous travaillez, votre site donne envie de venir vous *voir.* » Photo en carte arrondie : un cuisinier de dos derrière le comptoir d'un café | Écartée (Edgar, 26/10), motif non précisé. Code commenté, PNG gardé mais inutilisé |
| v | `v-metier-atelier` | Artisan, des appels : « Un site qui montre votre travail, pour que vos clients vous *appellent.* » Photo à fond perdu sur le bas : les mains d'un menuisier qui trace sur une planche | **Retenue** (Edgar, 26/10). Post et story rendus, story contrôlée, déposés dans le hub |
| w | `w-metier-barbier` | Service de proximité, tout au même endroit : « Un site où vos clients trouvent vos services, vos avis et votre *numéro.* » Photo en tirage (bord blanc, ombre, légère rotation) : un barbier au travail. Rubriques reprises de la fiche (One page : présentation, services, avis, zone, contact) | **Retenue** (Edgar, 26/10). Post et story rendus, story contrôlée, déposés dans le hub |

Écarté volontairement : « PME », « TPE », « artisans », « restaurant », « chantier » dans les
accroches ; tout prix, délai ou chiffre ; « horaires » et « prix » sur W (pas dans la liste de la
fiche) ; toute promesse d'être trouvé sur Google ; toute réservation en ligne (hors offre) ;
« savoir-faire » (sonne publicité).

## Série 7 (24/10/2026) : sans prix, après le test de la série 6

Décision d'Edgar le 24/10 : **plus aucun prix dans les créas de cette campagne**. La pub mène à
une landing page avec réservation Cal.com directe, les tarifs sont présentés au RDV. De la
série 6, seule `o-site-captivant-s` est retenue (**Retenue**, Edgar, 24/10, fichier gardé tel quel). Deux nouvelles créas, sans prix, aux idées
distinctes de D, J, K, L, M, N, O, P, Q. DA fine de la série 5, posts seuls (stories codées,
ni rendues ni contrôlées).

- **Photos de personnes (R)** : banque d'images **Pexels** (licence Pexels : usage commercial
  gratuit, attribution non obligatoire), copiées dans `assets/personnes/`. Gauche :
  `pexels-5999828` ; droite : `pexels-10375885`. Écartées après essai : `5915296`, `6173674`.
  Aucune image générée. Unsplash a bloqué la recherche automatique (contrôle anti-robot).
- Planche de la série : `node _feed.mjs o-site-captivant-s r t` → `_planche-selection.png`.
- `node build.mjs r s --post` rend des posts seuls, sans story.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| r | `r-avant-apres-demandes` | Avant / après, idée d'Edgar : « Votre site internet devrait vous apporter des *demandes.* » Deux photos : à gauche une dirigeante agacée devant son téléphone, notification « Aucune nouvelle demande · Boîte de réception » ; à droite une personne contente devant son téléphone, notification « 12 nouvelles demandes · Reçues depuis votre site internet ». Bas : « Illustration. Le nombre de demandes dépend de chaque activité. » | **Retenue** (Edgar, 24/10). Post rendu, story codée, ni rendue ni contrôlée |
| s | `s-nom-de-domaine` | Propriété de l'adresse : « Votre site internet, en ligne sur votre propre nom de *domaine.* » Fenêtre de navigateur en verre, barre d'adresse « votre-entreprise.fr » en avant, page en blocs gris. Légende de la fiche : « Le nom de domaine est à votre nom. » | Abandonnée (Edgar, 24/10) : détail rassurant, ne donne pas envie de cliquer. PNG et code gardés, inutilisés |
| t | `t-appel-30-minutes` | Le rendez-vous, à la place de S : « Un appel gratuit de 30 minutes pour parler de votre *site.* » (corrigée, ex « … votre futur *site.* ») Carte en verre « Appel de 30 minutes · Votre activité, vos objectifs, votre site », une semaine (Lun à Ven, sans date) et six créneaux du Cal.com réel (9:30, 10:30, 11:00, 15:30, 16:30, 17:30), 10:30 mis en avant. Légende : « Vous choisissez le jour et l'heure. » Source : fiche offre, étape 1. La créa montre ce que la landing page propose (calendrier Cal.com) | **Retenue** (Edgar, 24/10), corrigée : créneaux réels, « gratuit » validé (les boutons de la LP disent « Réserver un appel gratuit »). Post rendu, story ni rendue ni contrôlée |

Écarté volontairement : tout prix et tout délai, « garanti », toute période ou moyenne attachée
au 12 (c'est une illustration, dite dans l'image), « nos clients », tout nom de personne ou
d'entreprise, toute mention de formulaire, les étiquettes « Avant » / « Après » sur R, « le site
vous appartient » sur S (vrai au dernier versement en 6 fois seulement, il faudrait une
condition), tout vrai domaine ou hébergeur, toute promesse d'être trouvé sur Google. Sur T :
« sans engagement », tout bouton « Réserver »
ou « Confirmer », toute date réelle, le devis (une idée par créa).

### Finalisation des stories de o-S, r et t (24/10/2026)

Retenues par Edgar pour la campagne sans prix : `o-site-captivant-s`, `r-avant-apres-demandes`
(v1) et `t-appel-30-minutes` (corrigée). Story 9:16 rendue pour chacune (`node build.mjs o-s`,
`r`, `t`), même accroche et même visuel que le post, composition déjà codée, rien recomposé.

- Contrôle des zones : `node _zones-story.mjs o-site-captivant-s r t` (le script accepte
  maintenant des préfixes). Rien sous la ligne des 400 px ni dans la bande des 250 px, pour les
  trois. Dernier texte : légende de o à 1220 px, mention « Illustration » de r à 1420 px,
  légende de t à 1360 px, toutes au-dessus de 1520 px.
- Copiées dans `~/Downloads/` et déposées dans le hub (`POST /api/intake/creatives`), 201 pour
  les trois, format 9:16, noms de base `o-site-captivant-s`, `r-avant-apres-demandes`,
  `t-appel-30-minutes`.
- Les variantes `-v2` / `-v3` n'ont pas de story.

### Variantes d'accroche de o-S, r et t (24/10/2026)

Demande d'Edgar : même visuel, 2 accroches de plus par créa retenue (`-v2`, `-v3`), chacune
avec un autre bénéfice ou un autre point d'entrée. Code : objet `VARIANTES` de `build.mjs`.
Planche : `node _planche-lignes.mjs <ligne1> <ligne2> <ligne3>` → `_planche-lignes.png`
(une ligne par visuel). Posts seuls.

| Id | Fichier | Accroche | Point d'entrée | Statut |
|---|---|---|---|---|
| o-s | `o-site-captivant-s` | Un site captivant, pensé pour que vos visiteurs vous *contactent.* | La promesse Kleak | Proposée |
| o-s-v2 | `o-site-captivant-s-v2` | Quand un visiteur vous écrit depuis votre site, vous le recevez tout de *suite.* | La rapidité de réception | Proposée |
| o-s-v3 | `o-site-captivant-s-v3` | Un site où vos visiteurs trouvent tout de suite comment vous *joindre.* | La facilité de contact | Proposée |
| r | `r-avant-apres-demandes` | Votre site internet devrait vous apporter des *demandes.* | Ce qu'un site doit faire | Proposée |
| r-v2 | `r-avant-apres-demandes-v2` | Votre site est en ligne, mais personne ne vous *contacte ?* | La douleur (photo de gauche) | Proposée |
| r-v3 | `r-avant-apres-demandes-v3` | Un site captivant, qui convertit vos visiteurs en *demandes.* | La promesse Kleak, mots d'Edgar | Proposée |
| t | `t-appel-30-minutes` | Un appel gratuit de 30 minutes pour parler de votre *site.* | L'appel gratuit | Proposée |
| t-v2 | `t-appel-30-minutes-v2` | On prend 30 minutes pour comprendre votre activité et vos *objectifs.* | Ce qu'on fait pendant l'appel (fiche, étape 1) | Proposée |
| t-v3 | `t-appel-30-minutes-v3` | Réservez 30 minutes avec nous, au moment qui vous *arrange.* | Le choix du moment ; légende changée en « Appel gratuit de 30 minutes, pour parler de votre site. » | Proposée |

Légendes inchangées partout sauf t-v3 (l'ancienne répétait l'accroche).

## Série 6 (24/10/2026) : test « prix affiché ou non »

Test décidé par Edgar le 24/10 : chaque créa existe en deux versions strictement identiques,
sauf le prix. Version P (`<id>-p`) avec la pastille « Dès 699 € · Formule One page », version S
(`<id>-s`) sans elle, rien mis à la place. Toutes les pubs mènent à la même landing page avec
réservation Cal.com, les tarifs sont présentés au RDV. Accroches indépendantes du prix. DA fine
de la série 5, une idée par créa, marque petite en haut sur les trois.

- Code : `testPrix(id, slug, html)` fabrique les deux entrées ; `pastillePrix()` est le seul
  élément conditionné par `prix`. La condition (« Formule One page ») est dans la pastille, donc
  S n'a rien d'autre à retirer. Contrôle par différence d'image : P et S ne diffèrent que dans
  le rectangle de la pastille (plus un bruit d'anticrénelage de 6 px sur O, sans contenu).
- Planche dédiée : `node _planche-test-prix.mjs o p q` → `_planche-test-prix.png` (une ligne
  par créa, P à gauche, S à droite, à 420 px).
- Stories codées, ni rendues ni contrôlées.

| Id | Fichier | Angle | Statut |
|---|---|---|---|
| o | `o-site-captivant-p` / `-s` | Promesse : « Un site captivant, pensé pour que vos visiteurs vous *contactent.* » Carte en verre « Nouveau message · Reçu depuis votre site internet », message en lignes grises. Légende de la fiche : « Chaque demande arrive directement dans votre boîte mail. » | **S retenue** (Edgar, 24/10) : `o-site-captivant-s`, rien à refaire. P abandonnée, son PNG reste mais ne sert plus |
| p | `p-mentions-legales-p` / `-s` | Conformité : « Votre site internet, livré avec ses mentions légales et la conformité *RGPD.* » Page « Mentions légales » en papier (éditeur, hébergement, données personnelles, cookies, propriété intellectuelle), sans contenu | Écartée (Edgar, 24/10) : plus aucun prix dans la campagne, idée non retenue. P et S abandonnées, PNG gardés mais inutilisés, code commenté |
| q | `q-planche-direction-p` / `-s` | Validation avant construction : « Vous validez le style de votre site avant qu'on le *construise.* » Planche de direction en papier (structure, couleurs, polices, photos, « Sur une seule page »), d'après l'étape 4 de la fiche | Écartée (Edgar, 24/10) : plus aucun prix dans la campagne, idée non retenue. P et S abandonnées, PNG gardés mais inutilisés, code commenté |

Écarté volontairement : tout argument mis à la place du prix en S (devis gratuit, délai),
« 48 heures » pour la planche, tout nom, message, entreprise, domaine ou hébergeur inventé,
les intitulés de champs de formulaire sur O (la destination est un calendrier), toute menace
ou amende sur P, tout tampon (déjà sur K et N), « pour PME et artisans ».

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
