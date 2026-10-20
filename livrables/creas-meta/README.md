# Créas Meta Ads de Kleak Agency

Les visuels publicitaires de Kleak sont **codés en HTML et rendus en PNG** par Playwright, pas
dessinés dans Canva. Changer une accroche coûte une ligne et un rendu de quelques secondes, et
toutes les décisions restent écrites. Méthode reprise d'Orbikal
(`~/Desktop/jarvis-beepurst/livrables/interne/procedures/methode-creatives.md`).

Producteur attitré des visuels : l'agent `createur-creas` (`.claude/agents/createur-creas.md`).
Les textes d'annonce (texte principal, titre, description) sont écrits par l'agent
`media-buyer` (`.claude/agents/media-buyer.md`), qui les dépose dans le Hub Agence
(`livrables/media-buying/`).

## Commandes

| Commande | Effet |
|---|---|
| `node build.mjs` | rend le **post** (1080x1350) de toutes les créas |
| `node build.mjs <id>` | rend le post **et la story** (1080x1920) d'une créa (`a`, `b`…) |
| `node _feed.mjs` | planche des posts à 420 px, la taille réelle dans le fil → `_planche-feed.png` |
| `node _zones-story.mjs` | stories avec la zone recouverte par Meta → `_planche-story.png` |
| `node _capture.mjs` | recapture kleakagency.fr et la démo (à relancer si elles changent) |

Les PNG sortent en @2x (2160 px de large) pour un texte net. Playwright 1.61.1, lancé avec
`chromium.launch({ channel: 'chromium' })`.

## Dossiers

- `build.mjs` : la charte, les briques (icône K, téléphone, ordinateur, étoiles) et **toutes les
  créas**, dans l'objet `CREAS`. Une créa écartée reste dans le fichier, commentée, avec le motif.
- `rendus/post/`, `rendus/story/` : les PNG finaux. `html/` : intermédiaires jetables.
- `_captures/` : captures des sites montrés. `assets/` : logo.
- `NOTES.md` : ce qui a été produit, retenu, écarté, et pourquoi.
- `TEXTES-ANNONCES.md` : les premiers textes validés de A, B et D, écrits avant l'agent
  `media-buyer`. Ils sont déposés une fois dans le hub par `media-buyer` ; les textes suivants
  vivent dans le hub, pas dans ce fichier.

## Charte (relevée sur kleakagency.fr, pas inventée)

- Bleu `#0F2FD1`, bleu nuit `#050B7A`, marine `#090C3B`, ciel `#3DA8FF`.
- Texte en **Manrope**. Accroche en **Anton penchée** (`skewX(-9deg)`), capitales, comme les
  anciennes pubs Kleak, avec le cartouche blanc incliné et son ombre décalée.
- Icône K blanche sur carré bleu arrondi, centrée en haut.

## Règles (chacune est une condition de diffusion)

**Contenu**
- Tout prix, délai ou contenu d'offre affiché correspond **mot pour mot** à
  `livrables/offre/fiche-offre.md` le jour de la diffusion. Un délai porte sa condition
  (« 7 jours ouvrés après réception de vos contenus et de l'acompte »).
- Interdits : « 49 €/mois » (ancienne offre), « N°1 des agences Framer », « +50 % de clients »,
  et tout chiffre de résultat non mesuré.
- Avis : seulement des avis réels. Texte connu : Laura Dias (Mega Content), « Un super
  prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun
  souci ». Méliné Grelet et Aurore Melis sont réels, mais leur texte n'est pas connu : ne pas
  les citer tant qu'Edgar ne l'a pas fourni. La note **4,8/5 sur Google** est réelle.
- La démo Atelier Hauteville garde visible la mention « entreprise fictive » (elle est dans le
  bandeau du site, ne pas la recadrer).
- Le ton : vouvoiement, une idée par créa, pas de figure de style ni de chute, pas de rythme
  « publicité IA » (phrases courtes en miroir, antithèses).
- **Aucun tiret à la place d'une virgule**, ni `—` ni `–` ni ` - `. Le `·` sert de séparateur.

**Composition**
- Aucun bouton dessiné dans l'image : le bouton est celui de Meta.
- Story : rien d'important sous la ligne des **400 px** du bas, les 250 derniers sont recouverts.
- Lisible sur la planche à 420 px, sinon illisible dans le fil.

## Dépôt dans le hub

Quand le module Ads du Hub Agence sera en ligne, les créas validées s'y déposent par
`POST /api/intake/creatives` (en-tête `x-kleak-secret`). Le détail sera ajouté ici à la
tâche 3 du plan `docs/superpowers/plans/2026-10-18-module-ads.md`. Jusque-là, les PNG de
`rendus/` s'importent à la main dans le Gestionnaire de publicités.

## Dépôt des créas dans le Hub (bibliothèque de créatives)

Chaque PNG finalisé peut être envoyé au Hub pour alimenter Ads > Créatives. Un même nom de base et un même format redéposés remplacent l'ancien visuel (pas de doublon).

- URL : `https://hub-agence-kleak.vercel.app/api/intake/creatives` (production), `http://localhost:3000/api/intake/creatives` en dev.
- Méthode : `POST`, multipart/form-data.
- En-tête : `x-kleak-secret: <valeur de CREAS_INTAKE_SECRET>`.
- Champs : `file` (PNG, JPEG ou WebP, 4 Mo max, carré, 4:5 ou 9:16), et facultatifs `angle`, `accroche`, `source_html`.
- Le nom de base vient du nom de fichier, sans extension ni suffixe `-post`, `-story`, `-carre` (`b-7-jours-999-post.png` devient `b-7-jours-999`). Le format est lu dans les dimensions de l'image.

```
curl -F file=@rendus/post/b-7-jours-999-post.png -F angle="prix" -F accroche="Ton site en 7 jours" \
  -H "x-kleak-secret: $CREAS_INTAKE_SECRET" https://hub-agence-kleak.vercel.app/api/intake/creatives
```

Réponses : `201` créative enregistrée (JSON `creative`), `401` secret faux, `503` `CREAS_INTAKE_SECRET` non configuré côté Hub, `400` fichier absent, format ou poids refusé (message en français dans `error`).
