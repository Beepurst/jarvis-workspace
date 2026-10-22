# Brief de production : du questionnaire au prompt de construction

> Conception du 22/10/2026, Hub Agence (`livrables/hub-agence/`, dépôt `Beepurst/hub-agence-kleak`).
> Née du test Garnier Plomberie (`livrables/clients/test-garnier-plomberie/suivi-test.md`) : sans brief capable de porter le questionnaire, la planche et la maquette, le prompt de construction a été écrit à la main.

## Pourquoi

Kleak promet un site parfait en 2 ou 3 allers-retours. Le test Garnier l'a tenu en validant tout **avant** de construire : questionnaire, planche de direction, puis maquette HTML (textes compris), et seulement ensuite la construction dans Framer, qui **reproduit** la maquette.

Le brief actuel du hub ne suit pas ce chemin :
- il a 10 champs libres (`BRIEF_CHAMPS` dans `src/lib/briefs.ts`) qui ne correspondent pas au questionnaire de cadrage ;
- il ne sait rien de la planche ni de la maquette ;
- son prompt de page ne donne que les sections épinglées et quelques réponses.

**But :** le brief devient le dossier de production du client. Il garde les réponses du questionnaire, la planche validée et la maquette validée. Quand tout est validé, il produit seul le prompt complet de construction, celui qu'il a fallu écrire à la main pour Garnier (`livrables/clients/test-garnier-plomberie/prompt-construction-v2.md`, modèle à suivre).

## Objectifs

1. La fiche d'un brief montre **4 étapes** en haut : Questionnaire, Direction, Maquette et textes, Construction. Chaque étape a un état (à faire, en cours, validée le …).
2. **Une étape ne s'ouvre qu'après validation de la précédente.** On ne construit jamais sans direction et maquette validées.
3. **Questionnaire** : les réponses sont rangées selon les 7 parties de `livrables/process/questionnaire-cadrage.md`, avec ses clés. Les questions affichées dépendent de la formule : One page, Essentiel ou Pro (le sur mesure suit le Pro).
4. Les contenus marqués « je l'envoie plus tard » sont signalés comme manquants, puisque ce sont eux qui bloquent le démarrage du délai.
5. **Direction** : la planche de direction validée, avec sa date et une capture visible dans le hub.
6. **Maquette et textes** : la maquette HTML validée (textes définitifs compris), avec sa date et deux captures (bureau, mobile) visibles dans le hub.
7. **Construction** : un bouton « Copier le prompt de construction », sur le modèle de `prompt-construction-v2.md`.
8. **Validation des deux façons** : Edgar clique sur « Valider » dans le hub, ou Claude marque l'étape en session par une entrée réservée (protégée par un secret partagé, comme `/api/agent/todo` et `/api/agent/ads`).
9. Une **colonne One page** est ajoutée au questionnaire de cadrage (le document `questionnaire-cadrage.md` est mis à jour en même temps que le code).

## Hors périmètre

- **La page publique que le client remplit lui-même** (lien unique, enregistrement en cours de route, envoi de fichiers, relances à J+2 et J+5). C'est un chantier à part, prévu plus tard. Pour l'instant, Edgar ou Claude saisit ou colle les réponses dans le hub. Les clés choisies ici doivent rester celles que la page publique utilisera.
- L'envoi des fichiers du client (logo, photos, textes) dans le hub : pour l'instant, on note seulement s'ils sont reçus, manquants ou « plus tard ».
- La génération de la planche ou de la maquette par le hub : Claude les produit en session, dans `livrables/clients/<client>/`.
- Le prompt de **section** de la bibliothèque, qui ne change pas.

## Ce qui serait un échec

- Pouvoir copier le prompt de construction alors que la maquette n'est pas validée.
- Perdre ou rendre illisibles les briefs déjà saisis avec les 10 anciens champs.
- Un prompt qui oublie un fait du client que la maquette n'affiche pas mais que le site doit porter (téléphone de lien `tel:`, email du formulaire, mentions légales).
- Des clés différentes de celles du questionnaire de cadrage : la future page publique devrait alors tout reprendre.

## Décisions prises avec Edgar

- **4 étapes**, dans cet ordre. Les textes sont validés **avec** la maquette, comme pour Garnier : Edgar juge les mots dans leur mise en page, ce qui évite un aller-retour.
- **Validation par les deux voies** : bouton dans le hub et entrée réservée pour Claude.
- **La page publique client vient plus tard.**
- **Les contenus « plus tard » ne bloquent pas la construction.** Le bouton du prompt s'active dès que les étapes 1 à 3 sont validées. Le prompt liste les contenus encore manquants, chacun avec sa solution de repli :
  - logo absent : nom en typographie soignée ;
  - photos manquantes : photos libres de droits sur le sujet, à remplacer à réception ;
  - textes ou réalisations manquants : ceux de la maquette, signalés à Edgar.

  La fiche continue de les afficher comme manquants.

## Choix de Claude (à relire par Edgar)

- **Fichiers.** La planche et la maquette restent sur le Mac d'Edgar, dans `livrables/clients/<client>/`, là où Claude les produit. Le brief garde :
  - le **chemin du dossier client** (texte, ex. `livrables/clients/garnier-plomberie`) ;
  - pour la Direction : le chemin de la planche et **une capture** envoyée dans le stockage Supabase ;
  - pour la Maquette : le chemin de `maquette/index.html` et **deux captures** (bureau, mobile) dans le stockage.

  Le prompt pointe vers les fichiers locaux (chemins absolus), puisque la construction tourne sur le Mac. Les captures servent à voir où on en est depuis n'importe où.
- **Colonne One page** du questionnaire :
  - toutes les questions de l'Essentiel ;
  - `pages` remplacé par un affichage fixe « une seule page » ;
  - nouvelle question `sections_souhaitees` (choix multiple parmi Services, Pourquoi nous, Avis, Zone d'intervention, Questions fréquentes, Réalisations, À propos, Tarifs, Autre) ;
  - `sites_aimes` réduit à 1 lien facultatif, comme en Essentiel.
- **Formule du brief.** Prise de la vente signée du compte quand elle existe (table `ventes`), sinon choisie sur la fiche. Elle reste modifiable.
- **Anciens briefs.** Les 10 anciens champs ne sont plus proposés à la saisie. Rien n'est supprimé en base.
  - Un brief porte une **version** :
    - les briefs existants sont marqués « ancien » par la migration ;
    - les nouveaux sont marqués « questionnaire ».
  - Un ancien brief s'affiche en lecture, avec ses 10 champs. On peut le passer au questionnaire : seul `activite` est repris tel quel. Les autres anciens champs restent visibles dans une partie repliable « Ancien brief ». Ils ne remplissent jamais les clés du questionnaire qui portent le même nom (`pages`, `domaine`), dont le sens diffère.
  - Les réponses du questionnaire ne sont plus toutes des textes : listes, choix multiples, états de fichier. Le stockage doit accepter ces valeurs.
  - L'enregistrement ne doit jamais effacer une clé qu'il ne connaît pas. Aujourd'hui, `parserReponses` jette toute clé inconnue : c'est à changer.
- **Maquette par page.** L'étape Maquette porte une **liste de pages** : une seule pour un One page, 3 pour un Essentiel, 5 pour un Pro. Chaque page a son chemin (`maquette/index.html`, `maquette/services.html`…) et ses deux captures, bureau et mobile. Garnier est le cas d'une liste à une page.
- **Rouvrir une étape.** Edgar (ou Claude par l'entrée réservée) peut rouvrir une étape validée.
  - Elle repasse « en cours ».
  - Les étapes suivantes déjà validées passent « à revalider » : leur validation précédente reste dans l'historique.
  - Le bouton du prompt se grise tant que tout n'est pas revalidé.
  - Une étape passe de « à faire » à « en cours » dès qu'on y saisit quelque chose.
- **Téléphone affiché sur le site.** Nouvelle clé `tel_public`, « Le numéro affiché sur le site et dans les boutons d'appel », obligatoire pour toutes les formules. Elle est pré-remplie avec `contact_tel`. Le prompt utilise `tel_public` pour les liens `tel:` et `email_pro` pour le formulaire.
- **Traduction en Framer.** Le prompt ne la fournit pas champ par champ : il demande à la session de construction de la tirer de la maquette, qui contient toutes les valeurs dans son CSS (couleurs, polices, tailles, points de rupture). C'est ce qu'a fait la construction Garnier. Un champ libre « Consignes de construction » sur l'étape Maquette ajoute ce que la maquette ne dit pas : composants à variantes, animations précises, page Framer cible si elle n'est pas l'accueil. Ce champ est recopié tel quel dans le prompt.
- **`sections_souhaitees` (One page).** Facultatif, sans minimum ni maximum. Il guide la maquette et apparaît dans le prompt. En One page, les épingles de la bibliothèque sont toutes rangées dans une seule page « Accueil » (plus « Commune » si besoin). Le regroupement par page reste celui d'aujourd'hui pour l'Essentiel et le Pro.
- **Les épingles de la bibliothèque** (sections choisies par page) restent comme aujourd'hui et entrent dans le prompt de construction.
- **Travail sur une branche** du hub, fusion dans `main` après validation d'Edgar (chaque push sur `main` part en production).

## La fiche brief, étape par étape

### 1. Questionnaire
- Les 7 parties du questionnaire (Vous et votre entreprise, L'objectif du site, L'ambiance, Vos inspirations, Vos contenus, Technique et légal, Planning et envoi), questions filtrées par formule.
- Types du questionnaire repris : `texte`, `texte_long`, `email`, `tel`, `url`, `choix`, `choix_multiple`, `choix_image`, `liste`, `case`. Pour `fichiers`, un simple état : reçu, manquant, plus tard, sans objet. Les choix en images peuvent s'afficher comme de simples choix dans un premier temps.
- Indicateur en tête : nombre de questions obligatoires remplies, et liste des contenus « plus tard ».
- **Valider** : possible seulement quand toutes les questions obligatoires de la formule sont remplies, ou marquées « plus tard » quand le questionnaire l'autorise. Les « plus tard » restent signalés après validation.

### 2. Direction
- Chemin de la planche, capture, date de validation, champ note (ce qu'Edgar a demandé de changer, nombre d'allers-retours).
- **Valider** : demande au moins le chemin de la planche.

### 3. Maquette et textes
- Liste des pages de la maquette (une par page du site). Pour chacune : chemin, captures bureau et mobile. Puis date de validation, note, et champ « Consignes de construction ».
- **Valider** : demande au moins un chemin de page de maquette.

### 4. Construction
- Bouton « Copier le prompt de construction », actif seulement quand les étapes 1 à 3 sont validées (et aucune « à revalider »). Les contenus « plus tard » ne bloquent pas.
- Contenu du prompt, sur le modèle de `prompt-construction-v2.md` :
  - une phrase de cadre (« tu ne conçois rien : tu reproduis une maquette validée ») ;
  - les chemins de la maquette, de ses captures, de `style-maison.md` et de la checklist ;
  - le projet Framer du client (règle : un projet par client), à renseigner sur la fiche ;
  - les **faits du client** que la construction doit porter : nom, `tel_public` (liens `tel:`), `email_pro` (formulaire), adresse, horaires, zone, mentions légales (raison sociale, SIRET, siège, responsable), domaine ;
  - les **contenus encore manquants**, chacun avec sa solution de repli (voir les décisions) ;
  - les **consignes de construction** saisies à l'étape Maquette, et `sections_souhaitees` en One page ;
  - les sections épinglées de la bibliothèque, par page, avec leurs fiches (comme le prompt de page actuel) ;
  - les règles de construction (performance, repères HTML, fondus limités) et la fin de construction : contrôle « niveau Framer », publication, écarts, puis checklist sections 9 et 10.
- Les champs vides sont omis, jamais écrits « non renseigné » (règle déjà en place dans `bibliotheque-prompt.ts`).

## Validation par Claude

Une entrée réservée, sur le modèle de `/api/agent/todo` (en-tête `x-kleak-secret`, secret dans le `.env` et dans Vercel) :
- lire un brief (étapes, réponses, chemins) ;
- marquer une étape validée, avec date et note, et renseigner les chemins et les captures ;
- les mêmes règles d'ordre que le bouton : on ne valide pas l'étape 3 si la 2 ne l'est pas.

## Contraintes

- Next.js et Supabase du hub existant. Toutes les couleurs dans `src/app/theme.css`. Une nouvelle rubrique ou un sous-onglet passe par `src/lib/navigation.ts`.
- Les migrations SQL vont dans `supabase/` comme les autres. L'ancien champ `statut` (reçu, complété, validé) devra être relié aux étapes ou remplacé ; à trancher à la construction, sans casser la liste des briefs.
- Tout composant client qui enregistre une donnée affichée par une page serveur appelle `router.refresh()` (cache navigateur de 30 s).
- Pas de `npm run build` pendant qu'un serveur de développement tourne.

## Laissé au constructeur

- Le schéma exact (colonnes sur `briefs` ou table d'étapes à part), tant que l'historique des validations (date, auteur : Edgar ou Claude) est gardé.
- La forme de la définition du questionnaire dans le code. Une seule définition doit servir au hub et, plus tard, à la page publique.
- La mise en page de la fiche, dans le style du hub (refonte couleur du 21/10).
- Le nom du secret de l'entrée réservée.

## Mises à jour qui accompagnent la livraison

- `livrables/process/questionnaire-cadrage.md` : colonne One page (Formule `O`), questions `sections_souhaitees` et `tel_public`.
- `CLAUDE.md` (partie Hub Agence) : une ligne sur le brief de production et son entrée réservée.
- `.claude/commands/site.md` : le prompt de construction vient désormais du brief.
