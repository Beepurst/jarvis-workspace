# Posts organiques Instagram et Facebook

Les posts de `kleak_agency` (Instagram) et de la page Facebook « Kleak », produits par l'agent
`createur-posts` et validés par Edgar dans le hub (rubrique Posts). Spec :
`livrables/hub-agence-posts/docs/superpowers/specs/2026-10-27-posts-organiques-design.md`
(dans le dépôt du hub, branche des posts).

**Le but est la crédibilité** : qu'un visiteur venu d'une pub trouve des comptes vivants et
sérieux. Pas d'acquisition en organique.

## Commandes

```
cd livrables/posts-organiques
node build.mjs <id>                     # rendus/<id>/1.jpg, 2.jpg ... + rendus/<id>/_apercu-420.png
node build.mjs --grille                 # rendus/_grille.png, les posts du plan dans l'ordre d'Instagram
node deposer.mjs <id> --dry-run         # les requêtes prévues, sans réseau
node deposer.mjs <id>                   # téléverse les images puis dépose le post « à valider »
node deposer.mjs <id> --correction      # redépose le même post (même id, date lue dans le hub)
node deposer.mjs --liste                # posts à venir du hub, commentaires des « à corriger »
```

Captures fraîches avant chaque post de réalisation :
`cd livrables/creas-meta && node _capture.mjs asa-desktop asa-mobile`.

- `build.mjs` : la charte, les trois gabarits, les dessins des conseils, la matière réelle
  (avis, réalisations) et l'objet `POSTS` (un id par post). Toujours en JPEG 1080 × 1350,
  qualité 92 : Instagram n'accepte que le JPEG. Le rendu échoue si deux blocs se touchent, si
  un bloc déborde ou si une image ne charge pas.
- `plan-editorial.md` : ordre, dates, statuts, textes sous les posts, ce qui a déjà été montré.
- `deposer.mjs` : lit `HUB_URL` et `POSTS_AGENT_SECRET` dans le `.env` du workspace (ou
  l'environnement), ne les affiche jamais. Refuse un post « à confirmer », sans date, à date
  passée, déjà déposé (sauf `--correction`), ou dont le texte contient un tiret long, un emoji,
  un prix ou plus de 3 hashtags.
- `essais/` : l'essai du 27/10 validé par Edgar. `essai-realisation`, `essai-avis` et
  `essai-conseil` dans `POSTS` le reproduisent à l'identique, comme référence. Ils ne se
  déposent pas.

## Les trois types

Ils alternent dans la grille. **Aucun prix**, ni dans l'image ni dans le texte.

### 1. Réalisation (une image)

- Fond crème `#F2EEE6`, police Manrope (celle du site).
- En haut à gauche, nom du client (600, 30 px) et métier (500, 26 px, `#6f6a62`).
- Capture fraîche du site en bureau (1440×900 @2x), coins 10 px, ombre douce. Capture mobile
  (390×844 @2x) dans un cadre de téléphone noir de 8 px, qui chevauche en bas à droite.
- « Kleak Agency » en bas à gauche.
- Réalisations montrables à ce jour : **Accueil Sénior Assistance** seulement. Mac Alyster,
  Mega Content et Frenchies in Maldives seulement si Edgar confirme que leur site est une
  réalisation Kleak en ligne et montrable. Les démos (Atelier Hauteville, Garnier) jamais :
  ce sont des entreprises fictives.

### 2. Avis client (une image)

- Fond crème, « Avis client » en haut à gauche.
- La carte reprend exactement celle de kleakagency.fr : dégradé
  `linear-gradient(0deg, #1A1A1A 8%, #050B7A 100%)`, coins arrondis, police Inter, photo ronde,
  nom en gras blanc (« Méliné GRELET », prénom en minuscules et nom en capitales), entreprise en
  capitales grises, texte entre guillemets droits.
- Sous la carte : « **4,8 sur 5** sur notre fiche Google ». Pas de logo Google.
- Les trois avis réels (relevés sur kleakagency.fr le 27/10), texte mot pour mot, seules les
  fautes évidentes corrigées : Méliné Grelet (Mac Alyster), Laura Dias (Mega Content), Aurore
  Melis (Frenchies in Maldives). Textes et photos dans `AVIS` de `build.mjs`.

### 3. Conseil en carrousel (4 images)

- Couverture sombre (`#141414`), la promesse en grand (600, 74 px, crème).
- Pages suivantes sur fond crème, une idée par page : numéro en gris, phrase en gras (60 px),
  deux phrases d'explication (32 px, `#4a463f`), puis **un dessin plat qui illustre l'idée**.
  Sans dessin, Edgar juge la page « trop simple ».
- Dessins : noir, gris clair, blanc et un seul accent bleu Kleak `#0F2FD1`. Pas de dégradé,
  pas d'ombre, pas d'icône de banque. Ceux qui existent sont dans `DESSINS` de `build.mjs` ;
  un nouveau sujet ajoute son dessin à côté.
- Pagination « 2/4 » en bas à droite, « Kleak Agency » en bas à gauche.
- Sujets qui parlent au patron qui a, ou n'a pas, un site : téléphone, fiche Google, ce que
  le client cherche en arrivant, mentions légales, etc. **Aucun chiffre sans source.**

## Ce qui fait « typé IA » (interdit)

**C'est la règle numéro un.** Un post réussi techniquement mais qui sent l'IA est un échec.
Anti-objectifs de la spec, mot pour mot :

- Un post qui sent la production automatique : dégradés décoratifs, effet verre, lueurs, grain, mot en italique serif pour faire « designer », emojis, tuiles et pastilles en série, formules (« en un clic »), phrases en miroir, chutes.
- Toute donnée inventée : faux avis, faux client, chiffre de marché sans source, note Google autre que la vraie. Voir la règle « Ne jamais inventer une donnée de marché » du `CLAUDE.md` du workspace.
- Un post publié sans le clic d'Edgar.

Le seul dégradé autorisé est celui de la carte d'avis, parce qu'il est celui du site.

## Les textes sous les posts

Mêmes règles que le copy des pubs : phrasé plat et parlé, court, sans emoji ni formule, **sans
tiret long ni tiret à la place d'une virgule**, sans prix. 0 à 3 hashtags au plus (0 par
défaut). Partir des mots d'Edgar quand il en donne, ne pas les « améliorer ». Pas de « Découvrez »,
« Boostez », « n'attendez plus », « Et si… ? », pas de phrases courtes en miroir ni de chute.

Exemples validés avec l'essai :

- Réalisation : « Le site d'Accueil Sénior Assistance, aide à domicile pour les personnes âgées. Les familles trouvent les services et le numéro dès la première page, sur ordinateur comme sur téléphone. »
- Avis : « Merci Laura pour ce retour. »
- Conseil : « Ouvrez votre site sur votre téléphone et vérifiez ces points. » (l'exemple de l'essai finissait sur une chute avec un « souvent » sans source, réécrit le 27/10)

Le hub refait ses contrôles au dépôt (tournures interdites et avis réels des réglages Ads,
hashtags) : un texte refusé et rien n'est enregistré.

## Refus d'Edgar

À chaque refus ou correction d'Edgar, ajouter ici la règle qui en découle, avec la date.

- 27/10 (relecture de la série) : pas de généralisation sur « vos clients » ou « la plupart des visiteurs » (« vous cherchent souvent », « une bonne partie repart »), pas de chute (« ils appellent le suivant »), pas de série rythmée en trois temps (« une adresse change, une page disparaît, et… »), pas deux fois la même tournure d'un post à l'autre (« cinq minutes suffisent », textes et couvertures qui commencent tous par « Trois … » : une couverture « trois » au plus par série), pas de tournure « X, pas Y », pas de titres en fragments empilés (« Ce que vous faites. / Où vous intervenez. »), pas d'affirmation non vérifiable (« tout se règle depuis votre téléphone »). Des phrases plates qui disent quoi faire.
- 28/10 (s8, Frenchies in Maldives) : une réalisation en une seule image ne suffit pas. « Faire un carrousel qui met en avant des spécificités du site et le présente. » Couverture au gabarit réalisation, puis une spécificité réelle du site par page (phrase en gras, explication, section du site en capture par `_capture-sections.mjs`, prix retirés). Gabarit `realisationCarrousel` dans `build.mjs`.
- 27/10 : l'ordre de la série se fait en diagonale dans la grille, pour qu'aucune colonne n'empile le même type.
