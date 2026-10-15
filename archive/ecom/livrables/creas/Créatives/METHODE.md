# Méthode de production des créatives

> Mode opératoire fixé par Edgar, éprouvé sur un projet précédent (Orbikal), rejoué ici.
> **Ce fichier est la référence.** Une session qui produit une créative sans l'avoir lu
> refera des arbitrages déjà tranchés.
>
> Règle qui résume tout : **mesurer plutôt que regarder, et écrire pourquoi.**

---

## Le principe

**Une créative est un fichier HTML rendu en PNG par Playwright.** Pas de Figma, pas de Canva,
pas de composition générée par IA.

1. **Une créative se décline.** 4 accroches x 2 formats x 2 lots d'offre = 16 fichiers pour un
   seul travail de composition. À la main, personne ne refait 16 fichiers pour corriger une
   virgule, donc on ne corrige pas et le défaut part en diffusion.
2. **Le texte reste du texte jusqu'au dernier moment.** Changer une accroche coûte une ligne et
   3 secondes de rendu, ce qui permet de trancher **sur pièce** plutôt que sur du texte dans
   une conversation.
3. **Les décisions se documentent là où elles se relisent.** Les commentaires du `build.mjs`
   portent les arbitrages.

L'animé (vidéos, reels, carrousels animés) se fait en **Remotion** : le texte est une prop, la
vidéo se re-rend.

---

## Structure

Une **direction** est un système visuel désigné par une lettre. Elle vit dans son dossier, elle
est rejouable sur place, elle produit tous ses fichiers elle-même.

```
Créatives/
├── METHODE.md                    ce fichier
├── ETAT.md                       ce qui bloque, ce qui est prêt
├── ranger-ready.mjs              range les rendus finis dans Ready/
├── _lib/                         logique partagée des contrôles
├── _gabarit-direction/           squelette à copier pour créer une direction
├── sourcing/                     ratissage photo Pexels
├── Ready/                        ENTIÈREMENT GÉNÉRÉ, ne rien y déposer à la main
│   ├── README.md                 écrit par le script : quoi diffuser, et sous quelle condition
│   ├── ads/<lot-offre>/{post,story}/
│   └── organique/{instagram/{post,story},tiktok/<lot>}/
└── direction-a-<nom>/
    ├── build.mjs                 LE fichier : copy, gabarit HTML, rendu
    ├── NOTES.md                  ce qui a été tranché et pourquoi
    ├── TEXTES-ANNONCES.md        un jeu de textes par angle
    ├── _feed.mjs                 contrôle : planche à 420 px
    ├── _zones-story.mjs          contrôle : zone de sécurité story
    ├── assets/ photos/ html/ _planches/
    └── créatives ads/{post,story}/
```

**Règles de structure, chacune payée par un incident :**

- `Ready/` est **effacé et reconstruit** à chaque passage du script. La vérité vit dans les
  dossiers de direction. On range par **destination**, pas par direction : au moment de poser
  une campagne on cherche un format et un lot, pas un numéro de direction. La direction reste
  lisible dans le préfixe du fichier (`a-`, `b-`).
- `ranger-ready.mjs` **copie**, il ne déplace pas : une direction doit rester rejouable sur
  place, et un build écrit dans SON dossier.
- Un sous-dossier **par format**, jamais à plat. Les contrôles listent des dossiers ; le jour où
  les sorties ont changé de place, une sonde a cherché à plat, n'a rien trouvé, et **s'est tue**,
  ce qui se lit exactement comme « tout va bien ».
- **`ls -d direction-*` AVANT de nommer une direction.** Deux sessions parallèles se sont
  disputé la même lettre deux fois.
- `_lib/` et `_gabarit-direction/` commencent par `_` : ils ne sont jamais pris pour une
  direction diffusable.

---

## Les cinq points du rendu

| Point | Pourquoi |
|---|---|
| `document.fonts.ready` | sans lui Playwright capture la police de repli, et la créative est fausse sans que rien ne le signale |
| `waitForTimeout(450)` | les `filter`, dégradés et grain SVG ne sont pas peints à l'instant du `load` |
| `deviceScaleFactor: 2` | un texte rendu à 1x bave en agrandissement, et Meta demande 1080 px minimum |
| assets en base64 | le HTML s'ouvre en `file://`, un chemin relatif casse à la première réorganisation |
| comptage final | une sortie muette se lit comme un succès : compter les fichiers réellement écrits, jamais se fier aux « OK » |

---

## Marche à suivre

### 0. Relever le produit, avant d'ouvrir un éditeur

**Aucun texte n'est inventé.** Libellés, chiffres, couleurs, prix, états : tout se copie depuis
la source de vérité (fiche produit Shopify, tokens du thème). Chaque fois qu'un libellé a été
écrit « au mieux », il divergeait de la réalité et la créative promettait ce qui n'existe pas.

Relever aussi **ce qui est réellement disponible** : un produit en rupture, une option de
livraison non active, une promo non paramétrée. Un lot construit sur une fonctionnalité non
ouverte porte sa condition de non-diffusion écrite à deux endroits.

### 1. Partir d'une référence, dire ce qu'on en écarte

On démarre presque toujours d'une capture d'annonce fournie par Edgar. **On reprend le
mécanisme, pas la promesse.** Un concurrent peut écrire ce que son produit tient ; le nôtre
peut-être pas. Cette distinction s'écrit dans `NOTES.md`, sinon une prochaine session la
reprend telle quelle.

### 2. Écrire 3 à 5 accroches, pas une

On tranche **sur pièce**. Toutes les accroches vivent dans `COPIES`, on rend les posts, on monte
une planche, Edgar choisit. **Les écartées restent commentées dans le fichier**, avec le motif :
les jeter oblige à refaire l'arbitrage si le sujet revient.

> La skill `angles-creas` du workspace sert à **produire les angles et les hooks**. Elle
> alimente `COPIES`, elle ne remplace pas le build. Angle = matière, build = fabrication.

### 3. Sourcer la photo, en deux temps

C'est le vrai coût d'une créative photo, pas le texte.

1. **Ratisser large par API** (Pexels, licence commerciale) : 200 à 400 candidats sur 8 à 10
   requêtes, en ne téléchargeant que les **vignettes**.
2. **Monter une planche contact**, ne descendre en pleine résolution que les 5 ou 6 retenus.

Un premier ratissage vidéo a téléchargé 3,7 Go pour retenir 5 clips. Ne pas refaire ça.

- **Décrire une ambiance, jamais l'activité du sujet.** Chercher une photo qui « illustre le
  marketing » ramène exactement la banque d'images qu'on veut éviter.
- **Classer par mesure, choisir à l'œil.** Trier par écart-type de luminance dans la bande où
  tombera le texte élimine les 80 % inutilisables ; la mesure élimine, elle ne choisit pas.
- **Juger sur le rendu avec le texte par-dessus**, pas sur la vignette. Deux candidats parfaits
  en vignette perdaient complètement le titre dans leurs hautes lumières.

### 4. Composer, avec ces contraintes systématiques

- **Story 1080x1920 : les 250 derniers pixels du bas sont recouverts** par le CTA natif et le
  nom du compte. Aucun texte ne descend sous **400 px** du bord. Sur le projet précédent, 4
  directions sur 5 étaient en faute, dont une où la seule ligne portant l'offre disparaissait
  en diffusion.
- **Un correctif de zone de sécurité n'est jamais une seule ligne** : remonter le bloc du bas
  oblige à recomposer ce qui est au-dessus.
- **Jamais de bouton dessiné dans l'image.** En story on tape dessus et rien ne se passe, en
  feed il double celui de la plateforme. L'incitation reste, mais **en ligne de texte**.
- **Assombrir globalement, jamais derrière le texte.** Un dégradé calé sur la ligne du titre se
  voit comme un rectangle d'ombre. Recette qui marche sur photo lifestyle :
  `contrast(1.32) saturate(.93) brightness(.82)` sur toute l'image. Le contraste seul
  dessert le titre, il éclaircit aussi les hautes lumières : le `brightness < 1` est nécessaire.
- **Grain SVG `feTurbulence` en `mix-blend-mode: overlay` à ~17 %**, avec deux pièges qui le
  rendent totalement invisible, chacun suffisant seul : il bruite aussi le canal alpha (forcer
  alpha à 1), et son bruit est centré sur 0.5 où `overlay` est mathématiquement neutre (étaler
  l'amplitude avec un `feComponentTransfer`).
  **En ecommerce, le traitement argentique est à écarter par défaut : on ne dégrade pas la
  photo de ce qu'on vend.** Le grain reste disponible pour les fonds d'ambiance.

### 5. Rendre, puis contrôler par la mesure

Trois contrôles, tous scriptés, aucun « je regarde et ça a l'air bien ».

1. **La planche feed à 420 px** (`_feed.mjs`) : la largeur réelle d'un post Instagram, tout ce
   qui est dessiné à 1080 est divisé par 2,57. **Un texte illisible sur cette planche ne se lira
   jamais.** C'est le contrôle qui manque le plus souvent et celui qui rattrape le plus de
   défauts.
2. **Les repères story** (`_zones-story.mjs`) : bande de 250 px et ligne des 400 px dessinées
   par-dessus la story rendue. Il **vérifie**, il ne corrige pas.
3. **La planche de titres** quand plusieurs accroches sont en concurrence.

Tout script de contrôle **échoue bruyamment sur une sortie vide** (`process.exit(1)`). Une sonde
qui ne trouve rien et se tait est pire qu'aucune sonde.

### 6. Faire trancher Edgar sur pièce

Poser la planche, la question, les options. Il tranche vite quand il voit ; il ne tranche pas
sur une description.

### 7. Documenter dans `NOTES.md`

```
# Direction X — <nom>
## Ce qu'elle montre
## Le mécanisme
## Les accroches (retenue + écartées, avec le motif)
## Conventions de charte appliquées
## Décisions de composition
## Ce qui a été vérifié, et comment
## Pièges rencontrés
## Ce qui reste à faire
```

Écrire **ce qui a été écarté et pourquoi**, pas seulement ce qui a été retenu.

### 8. Ranger avec `ranger-ready.mjs`

`SOURCES` déclare pour chaque dossier de sortie sa destination dans `Ready/` et son préfixe. Les
sources **volontairement exclues** y figurent avec `dest: null` et leur motif : les lister
évite qu'on se demande dans six mois si l'oubli est un oubli. Le script réécrit le `README.md`
de `Ready/`, qui répond à une seule question : **qu'est-ce que je peux diffuser aujourd'hui**.
Une créative finie mais qui attend une condition doit s'y signaler.

### 9. Écrire les textes d'annonce

Trou classique : des dizaines de visuels finis et aucun texte, donc rien ne peut partir dans le
gestionnaire. Un `TEXTES-ANNONCES.md` par direction, et **un jeu de textes par angle, jamais par
fichier** : 45 visuels ne portent souvent que 4 ou 5 accroches distinctes.

Pour l'organique, la légende vit dans un `.txt` du même nom de base que le visuel, à côté de
lui. Du texte, pas du JSON : ni échappement des retours à la ligne, ni des emojis, ni des
hashtags, et éditable partout.

### 10. Convertir pour la diffusion

Les rendus sont en @2x (2160 px) parce que le **rendu** l'exige, pas la diffusion. Redescendre à
**1080 px de large en WebP** avant tout envoi vers un stockage : sur le projet précédent, la
bibliothèque passe de ~1,15 Go à une centaine de Mo. Les PNG pleine résolution restent sur le
disque.

---

## Règles d'écriture du copy

Chacune vient d'un lot rejeté ou d'un défaut arrêté avant diffusion.

**Interdits absolus, sans exception :**

- **Aucun témoignage client inventé.** Sans client réel, c'est une pratique commerciale
  trompeuse (art. L121-2, ciblée par la DGCCRF). Vaut aussi pour les faux avis publiés sur une
  fiche Google, y compris postés par un tiers.
- **Aucun chiffre de performance fabriqué** (« -45 % », « 3 h économisées »). **Nuance** : les
  chiffres d'une **maquette d'interface** sont autorisés, ce sont des captures de démonstration,
  pas des affirmations de résultat.
- **Aucune promesse de délai non mesurée** (« livré en 48 h » si ce n'est pas le délai réel du
  fournisseur). Une direction entière est restée non diffusable pour cette seule raison.
- **Aucune promesse que la page d'arrivée ne tient pas.** Défaut le plus récurrent du parc,
  relevé trois fois : une pub qui promet autre chose que sa destination est un problème de
  conversion **et** un risque juridique.
- **En ecommerce, s'ajoutent** les interdits déjà posés dans `CLAUDE.md` : aucun claim santé,
  minceur ou revenus, et le délai de livraison affiché doit être le délai réel, droit de
  rétractation de 14 jours respecté.

**Registre :**

- **Le rythme trahit une production automatique, pas le vocabulaire.** Phrases courtes en
  miroir, antithèses, chutes : sur un feed ça se lit comme une publicité avant même d'être
  compris. Trois lots ont été rejetés d'un mot, « ça fait très IA ».
- **Le registre qui passe est plat** : une seule idée, aucune figure de style, aucune chute, pas
  de point final. Ça doit sonner comme quelqu'un qui parle.
- **Exception documentée** : l'antithèse est autorisée en **énumération de couplets** (chaque
  ligne pose un fait puis le doute qu'il laisse, sans chute) et dans un **carrousel** où chaque
  écran est un temps distinct. Proscrite dans un hook vidéo, où elle s'entend d'un coup.
- **Le mot-clé du message est dans le titre.** La créative doit être comprise en deux secondes
  par quelqu'un qui ne connaît pas le produit. Un titre plus vif qui ne dit rien coûte le
  message.
- **Un logo est un exemple, un mot est une exigence.** Montrer un logo se lit comme un exemple
  parmi d'autres ; l'écrire en toutes lettres se lit comme une condition d'entrée.
- **Un hook réécrit se propage à toute la série.** Dans un carrousel chaque écran s'appuie sur
  le précédent : réécrire l'écran 1 laisse derrière des écrans qui répondent à une phrase
  disparue. Relire les cinq, jamais seulement le deuxième.

---

## Trois surfaces, trois jeux de règles

| | Ads | Organique de marque | **Natif de plateforme** |
|---|---|---|---|
| Lockup de marque | oui | **non**, le compte porte déjà nom et avatar | **non** |
| Offre / promo | oui, en ligne de texte | **non**, un feed qui n'affiche que des réductions se dévalorise | non |
| Bouton dessiné | jamais | jamais | jamais |
| Appel à l'action | fourni par la plateforme | dans la légende | dans la légende |
| Charte, grain, traitement | oui | oui | **non, aucun** |

> ### L'exception à ne pas « corriger »
>
> Sur le projet précédent, le **seul format ayant fait des vues sans audience** est un carrousel
> TikTok qui ne porte **aucun signe de la marque** : pas de logo, pas de couleurs de charte, pas
> de grain, aucun traitement photo, une police neutre plutôt que celle de la marque.
>
> **Le traitement qui professionnalise une image la ramène du côté de la publicité**, c'est-à-dire
> exactement ce qu'on cherche à éviter sur un feed de découverte.
>
> La charte sert à être **reconnaissable**. Un post organique de découverte a d'abord besoin de
> **ne pas être reconnu comme une publicité**. Ce sont deux objectifs opposés, et il faut choisir
> par surface.
>
> **Une session future ne doit pas uniformiser ce format « pour la cohérence ».** C'est passé
> près d'arriver une fois.

---

## Pour l'animé : Remotion

`npx create-video`, chaque composition est un composant React dont le texte, le rush et la typo
sont des **props**.

- **Rendre muet avec le drapeau `--muted`**, pas simplement sans composant audio : sans lui
  Remotion écrit quand même une piste AAC de silence, et un fichier qui porte une piste laisse
  croire qu'il a un son. Sur TikTok le son se pose dans l'application au moment de publier,
  c'est là que se joue la portée.
- **Un élément positionné en CSS se peint au-dessus du contenu en flux normal du même contexte
  d'empilement.** Un fond posé en absolu a recouvert le texte du carton final pendant plusieurs
  rendus, invisible autrement qu'en rendant le texte en rouge à 60 px pour vérifier qu'il était
  bien là.
- **Re-rendre une composition partagée après plusieurs jours embarque tout ce qui a bougé
  entre-temps.** Comparer image par image : l'encodeur est déterministe, donc chaque zone qui
  diffère est significative.

---

## Les pièges déjà payés

- **Une sonde doit pouvoir physiquement observer ce qu'elle cherche.** Le motif le plus coûteux
  et le plus récurrent. Avant de conclure « c'est bon » ou « c'est cassé », vérifier que le
  contrôle peut voir sa cible. **Une sortie vide n'est pas une preuve.**
- **Un « OK » affiché n'est pas un fichier écrit.** Compter les sorties réelles.
- **Un visuel rendu se périme en silence.** Un prix qui a changé, une promo finie, un produit en
  rupture : ça ne se voit ni dans la bibliothèque ni dans les légendes, seulement en rouvrant le
  `build.mjs`. **Relire les `build.mjs` avant de programmer un lot**, pas seulement les images.
- **Aucun texte d'annonce ne rattrape une promesse imprimée dans l'image.**
- **Vérifier ce qui est réellement disponible avant de le montrer.**
- **Ne pas se fier aux notes, se fier au code.** Une note dit ce qui était vrai le jour où elle a
  été écrite.

---

## Ce qui ne se transpose PAS du projet précédent

C'est la méthode qui voyage, pas la charte. À ne pas recopier : la palette orange/bleu sur fond
noir, le dark premium, les polices General Sans / Inter / JetBrains Mono, la signature d'anneau
`conic-gradient`, la signature de marque et le descripteur.

**La démarche qui les a produits se transpose entièrement** : un descripteur qui dit **ce que
c'est** en deux secondes, une signature qui dit **ce qu'on y gagne**, les chiffres dans une
police distincte des titres, et des couleurs **recopiées des tokens du site** plutôt que
choisies sur la créative.

Deux différences de fond propres à l'ecommerce :

1. **Le produit est l'image.** La photo produit remplace la maquette d'interface : le sourcing
   photo devient encore plus central, et le traitement argentique est à écarter par défaut.
2. **Le prix et l'offre sont légitimes dans l'image**, contrairement à un SaaS où ils périment.
   Mais la règle « la surface correspond à la page d'arrivée » vaut plus fort encore : **un prix
   affiché sur une créative doit être celui de la fiche produit, le jour de la diffusion.**
   C'est une dette à échéance : tout lot portant un prix se relit avant chaque programmation.
