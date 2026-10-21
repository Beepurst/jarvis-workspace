# Suivi du test One page : Garnier Plomberie

| Étape | Date | Allers-retours | Note |
|---|---|---|---|
| Brief (faux questionnaire) | 21/10 | 0 | Écrit par Claude, validé par Edgar |
| Planche de direction V1 | 21/10 | 1 | Validée avec 3 réponses, sans changement visuel. Photos : 2 séries de recherche Unsplash (extension Chrome déconnectée) |
| Construction | 21/10 | | Prompt donné à 15 h 02 (heure de Paris). Fin : 17 h 52, page construite dans le canevas mais non publiée (publication et captures Framer en échec, voir constats) |
| Retour d'Edgar sur la V1 Framer | 21/10 | 2 | « Vieillot, basique, pas Framer. » Cause : prompt décrivant un site de plombier type, sans référence de mise en page, animations retirées, direction réglée sur les goûts du client |
| Style maison et maquette HTML V2 | 21/10 | | `livrables/process/style-maison.md` tiré de 20 modèles Framer mesurés. Maquette `maquette/index.html` : accroche BLDR, pourquoi moi, zone, questions et appel final Renovatehub, services Roofaro, avis Refit, pied de page Lintel |
| Validation de la maquette V2 | 21/10 | 3 | Validée par Edgar (« c'est bien »), retouches faites ensuite par Edgar dans Framer |
| Construction V2 | | | Prompt : `prompt-construction-v2.md`, page `/garnier-v2`. Début : · Fin : |
| Checklist qualité et PageSpeed | | | |
| Livraison | | | |

## Constats pour le process

- Construction (21/10) : l'API `@framer/agent` a dépassé son délai sur la plupart des écritures. Les modifications passaient quand même, mais sans le retour des erreurs, donc il fallait tout vérifier par lecture. Deux coupures de connexion (17 min, puis pendant la publication). Créer des blocs de texte enrichi (`TextBlock`/`TextRun`) dans un texte qui a un style bloquait l'appel : remplacé par des textes simples. La capture d'écran Framer et la publication (`publish` aperçu ×2, `framer.publish` ×1) ont échoué. Environ 1 h 30 perdue sur 2 h 50.

- Le questionnaire de cadrage n'a pas de colonne One page.
- Le modèle de planche colore toujours le bouton de l'accroche avec la 2ᵉ couleur : ajout de `boutonFond` et `boutonTexte` dans la copie du client, à reporter dans `modele.html`.
- Sans brief dans le hub, `/site` n'a pas de prompt à recevoir : prompt écrit à la main dans `prompt-construction.md`.
- Le brief du hub (10 champs libres, `src/lib/briefs.ts`) ne peut pas porter le questionnaire de cadrage, la planche validée ni les textes définitifs. Son prompt de page ne donne que les sections épinglées et les réponses. À cadrer après le test : un brief qui contient questionnaire, planche et textes, et produit seul le prompt complet. Décision du 21/10 : test lancé avec le prompt écrit à la main.
