# Suivi du test One page : Garnier Plomberie

| Étape | Date | Allers-retours | Note |
|---|---|---|---|
| Brief (faux questionnaire) | 21/10 | 0 | Écrit par Claude, validé par Edgar |
| Planche de direction V1 | 21/10 | 1 | Validée avec 3 réponses, sans changement visuel. Photos : 2 séries de recherche Unsplash (extension Chrome déconnectée) |
| Construction | 21/10 | | Prompt donné à 15 h 02 (heure de Paris). Fin : 17 h 52, page construite dans le canevas mais non publiée (publication et captures Framer en échec, voir constats) |
| Retour d'Edgar sur la V1 Framer | 21/10 | 2 | « Vieillot, basique, pas Framer. » Cause : prompt décrivant un site de plombier type, sans référence de mise en page, animations retirées, direction réglée sur les goûts du client |
| Style maison et maquette HTML V2 | 21/10 | | `livrables/process/style-maison.md` tiré de 20 modèles Framer mesurés. Maquette `maquette/index.html` : accroche BLDR, pourquoi moi, zone, questions et appel final Renovatehub, services Roofaro, avis Refit, pied de page Lintel |
| Validation de la maquette V2 | 21/10 | 3 | Validée par Edgar (« c'est bien »), retouches faites ensuite par Edgar dans Framer |
| Construction V2 | 21-22/10 | | Prompt : `prompt-construction-v2.md`, page `/garnier-v2`. Début : 21/10 à 19 h 49. Pause la nuit (de 20 h 40 environ à 10 h 33). Fin : 22/10 à 11 h 22. Temps actif : 1 h 40 environ, dont 45 min perdues sur des erreurs d'outil (voir constats). Publiée sur https://massive-account-916652.framer.app/garnier-v2 |
| Sections bibliothèque sur la V2 | 22/10 | | Comparatif avec / sans (interrupteur dans le titre) après « Pourquoi », FAQ en panneau de 6 questions à la place de l'ancienne. Clics testés sur la page publiée. De 11 h 31 à 12 h 45 environ. Puis À propos (accroche gris → noir au scroll en composant code, grille de 4 chiffres et 2 photos) après le comparatif, et process en 4 étapes (fond clair) après les Services. Ménage des fondus : 5 au total |
| Validation de la V2 par Edgar | 22/10 | 2 | Site validé tel quel (« site validé, c'est un site de test »). Allers-retours : 1 pour les deux premières sections de la bibliothèque, 1 pour les deux suivantes. Aucune retouche visuelle demandée |
| Checklist qualité et PageSpeed | 22/10 | | Lighthouse local (quota de l'API PageSpeed épuisé), sur `.framer.app`. Bureau : 88, 94, 94. Mobile : 63, 63, 83 avec la barre d'édition de Framer (4,1 Mo), 70, 83, 77 sans elle (site : 840 Ko, accroche mobile 74 Ko). Accessibilité 100 après correction de 4 contrastes, bonnes pratiques 96, SEO 69 (blocage d'indexation de `.framer.app` seul en cause). Ajoutés : données structurées `Plumber`, image de partage, pages mentions légales et confidentialité (exemples marqués fictifs) reliées au pied de page et au formulaire. Restent : envoi test du formulaire, favicon (réglage du site entier, partagé avec les autres démos), badge Framer (plan payant), remesure sur un vrai domaine |
| Livraison | | | |

## Constats pour le process

- Construction (21/10) : l'API `@framer/agent` a dépassé son délai sur la plupart des écritures. Les modifications passaient quand même, mais sans le retour des erreurs, donc il fallait tout vérifier par lecture. Deux coupures de connexion (17 min, puis pendant la publication). Créer des blocs de texte enrichi (`TextBlock`/`TextRun`) dans un texte qui a un style bloquait l'appel : remplacé par des textes simples. La capture d'écran Framer et la publication (`publish` aperçu ×2, `framer.publish` ×1) ont échoué. Environ 1 h 30 perdue sur 2 h 50.

- Construction V2 (21-22/10) :
  - **Cause principale de la lenteur trouvée** : 5 sessions `@framer/agent` des tests précédents restaient ouvertes. Les fermer (`session destroy`) et passer `{ pagePath }` à chaque `applyChanges` ramène les écritures de plus de 2 min à quelques secondes. Il reste des dépassements de délai sur les gros lots : les changements passent, il faut relire pour vérifier. À ajouter à `/site` : fermer les anciennes sessions au démarrage.
  - Captures d'écran Framer de la page en échec à chaque essai (celles des composants marchent). Contrôle fait sur la page publiée avec Playwright à 1440, 810 et 390 px.
  - `framer.agent.publish` en échec (délai) : publication faite avec `framer.publish()`, qui publie directement l'adresse `*.framer.app` du projet test.
  - Ne marchent pas par l'API : `framer.addSVG` (même sur un SVG minimal), le choix d'une icône par instance (variable d'icône), les listes (variable tableau) sur une instance, la liaison d'un composant imbriqué à une variable écrite `var(--variable-…)` (il faut la forme `{"from":"var(--variable-…)"}`).
  - Une erreur de ma part a coûté 10 min : un identifiant temporaire réutilisé (« ph ») a renommé un bloc existant. Toujours des identifiants temporaires uniques sur toute la session.

- Le questionnaire de cadrage n'a pas de colonne One page.
- Le modèle de planche colore toujours le bouton de l'accroche avec la 2ᵉ couleur : ajout de `boutonFond` et `boutonTexte` dans la copie du client, à reporter dans `modele.html`.
- Sans brief dans le hub, `/site` n'a pas de prompt à recevoir : prompt écrit à la main dans `prompt-construction.md`.
- Le brief du hub (10 champs libres, `src/lib/briefs.ts`) ne peut pas porter le questionnaire de cadrage, la planche validée ni les textes définitifs. Son prompt de page ne donne que les sections épinglées et les réponses. À cadrer après le test : un brief qui contient questionnaire, planche et textes, et produit seul le prompt complet. Décision du 21/10 : test lancé avec le prompt écrit à la main.
