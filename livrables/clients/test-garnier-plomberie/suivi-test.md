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
| Copie « site client » et formulaire | 22/10 | | Copie du projet par Edgar (la copie et le transfert ne passent pas par l'API), `/garnier-v2` en accueil, sur https://angelic-fabric-749963.framer.app/. Ménage par Claude : 16 composants et 109 styles des autres démos supprimés, 2 composants code Kleak retirés, titre du site et favicon mis à Garnier. Formulaire vers kleakagency@gmail.com (réglé par Edgar) ; envoi test le 22/10 à 18 h, message de succès affiché, mail reçu par Edgar dans sa boîte principale (pas en spam) |
| Transfert du projet | 22/10 | | Fait par Edgar vers un second compte, en restant éditeur. Côté destinataire : un seul bouton « Confirm transfer », aucun message sur le plan ni la facturation (projet sans plan payant). L'adresse `.framer.app` a continué de répondre après l'acceptation |
| Livraison | 22/10 | | Test terminé. Domaine, plan payant et facture de solde non testés (site fictif) |

## Procédure de transfert (testée le 22/10)

1. **Un projet Framer par client, dès le départ.** Le transfert porte sur le projet entier : un projet qui mélange plusieurs sites oblige à dupliquer puis à nettoyer (16 composants et 109 styles à supprimer ici).
2. Avant le transfert, dans le projet du client :
   - le titre et le favicon du site sont à son nom ;
   - les composants, styles et fichiers de code non utilisés sont supprimés ;
   - le formulaire est envoyé à l'adresse du client, avec un envoi test reçu ;
   - le site est publié.
3. Transfert : menu Framer, puis **File**, puis **Transfer Project** (ou **Share**, puis **Transfer Project**). Indiquer l'email du compte du client et **cocher « rester éditeur »**, sinon l'agence perd l'accès, maintenance comprise.
4. Le client se connecte ou crée son compte Framer, puis clique sur « Confirm transfer ». Le site reste en ligne pendant le transfert.
5. **Non testé, à vérifier au premier client payant :** selon l'aide Framer, un plan déjà payé est résilié au transfert, la part non utilisée est créditée à l'agence, et le client doit prendre son propre plan. Le domaine personnalisé reste branché. À écrire dans la fiche de maintenance et à annoncer au client avant le transfert.

## Bilan du test (22/10)

- **Temps passé par Claude (estimation, d'après les heures notées) :**
  - construction V2 : 1 h 40, dont environ 45 min perdues sur l'outil ;
  - 4 sections de la bibliothèque : environ 2 h 15 ;
  - checklist et PageSpeed : environ 1 h 30 ;
  - copie et transfert : environ 30 min.

  Soit environ 6 h depuis la maquette validée. Brief, planche, V1 et maquette HTML ne sont pas comptés. La cible de 7 à 9 h pour un One page est tenable si l'outil ne plante pas, mais la marge est faible.
- **Allers-retours :**
  - 3 sur la maquette ;
  - 0 retouche visuelle sur la V2 construite ;
  - 2 pour les sections de la bibliothèque.

  L'objectif de 2 ou 3 allers-retours est tenu à partir de la maquette validée.
- **Qualité, mesurée sur `.framer.app` :**
  - accessibilité 100, bonnes pratiques 96 à 100 ;
  - bureau 88 à 94 ;
  - mobile 63 à 83 avec la barre d'édition de Framer, 70 à 83 sans elle ;
  - SEO 69, plafonné par l'adresse de test.

  La note mobile n'est fiable que sur un vrai domaine.
- **Ce qui a marché :** maquette HTML validée en amont puis reproduite, composants à variantes (interrupteur, accordéons), composant code pour l'accroche révélée au scroll, contrôle sur la page publiée avec Playwright plutôt qu'avec les captures Framer.
- **Ce qui coûte :** les délais de l'API, les fonctions qui échouent (import SVG, icône par instance, listes en instance, captures de page, publication par l'agent), les sessions restées ouvertes. Et une erreur de ciblage, qui a touché la V1 puis a été réparée : `getNodesOfTypes` renvoie des nœuds de toutes les pages, il faut toujours partir de l'arbre de la page.

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
