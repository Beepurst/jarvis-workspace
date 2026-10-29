# Règles de décision Meta Ads de Kleak Agency

> Lues par l'agent `media-buyer` avant chaque réponse. Écrites le 20/10/2026 pour un budget de
> 200 € par mois (environ 6,60 € par jour), sur le compte « Kleak Pub », qui n'a encore aucun
> historique exploitable : le test de 50 € des créas A, B, D n'est pas lancé.

## Comment lire ce fichier

**Les valeurs chiffrées font foi dans les Réglages du hub, pas ici.** L'agent les lit dans
`seuils` de la lecture agent (`GET /api/agent/ads`). Les chiffres entre parenthèses ci-dessous
sont les valeurs de départ au 20/10/2026, donnés pour comprendre la logique. Si `seuils` dit
autre chose, c'est `seuils` qui a raison, et l'agent le signale si l'écart rend une règle
incohérente.

| Nom dans `seuils` | Ce que c'est | Valeur de départ |
|---|---|---|
| `cplCible` | Coût par lead visé | 5 € |
| `budgetMensuel` | Budget du mois | 200 € |
| `sansLeadMultiple` | Pub sans lead : dépense en multiples du CPL cible | 3 (soit 15 €) |
| `cplHausseRatio` | CPL des 7 derniers jours face aux 7 précédents | × 2 |
| `cplHausseMinLeads` | Leads minimum sur chacune des deux périodes pour comparer | 3 |
| `frequenceMax` | Fréquence sur 7 jours | 3 |
| `rythmeTolerance` | Avance tolérée sur le rythme du budget mensuel (fraction) | 0,2 (20 %) |
| `bilanMinLeads` | Volume minimum avant bilan, en leads, sur une pub | 10 |
| `bilanMinDepense` | Volume minimum avant bilan, en dépense, sur une pub | 50 € |

Chaque règle porte une ou plusieurs de ces étiquettes :

- **Source Meta** : ce que dit la documentation officielle de Meta, avec le lien.
- **Donnée du compte** : ce que les chiffres de « Kleak Pub » ont montré. **Aucune au
  20/10/2026.** Quand un bilan apporte une donnée, la règle est mise à jour et l'entrée du
  journal est citée.
- **Choix de départ à réviser** : une décision de Claude, raisonnable pour 200 € par mois mais
  pas prouvée. À revoir dès que le journal donne de quoi.

Repère historique (ancien compte de l'agence, il y a un an, `context/CONTEXT.md`) : 2 € par
lead, 1 RDV pour 3 leads, 1 signature pour 3 à 4 RDV. Le nouveau compte part sans historique et
novembre est plus cher : ce repère sert d'ordre de grandeur, jamais de preuve.

## Sources Meta citées

Les pages d'aide de Meta s'affichent par JavaScript. Leur titre a été vérifié le 20/10/2026, et
leur contenu relu à travers les extraits que renvoient les moteurs de recherche. À relire dans
un navigateur avant de s'appuyer sur un point précis.

1. [À propos de la phase d'apprentissage](https://www.facebook.com/business/help/112167992830700) :
   un ensemble de publicités sort de l'apprentissage après environ 50 événements
   d'optimisation sur 7 jours ; les performances y sont moins stables.
2. [À propos de l'apprentissage limité](https://en-gb.facebook.com/business/help/269269737396981) :
   statut affiché quand l'ensemble a peu de chances d'obtenir environ 50 événements
   d'optimisation dans la semaine qui suit la dernière modification importante.
3. [Dernière modification importante](https://www.facebook.com/business/help/942374239243867) :
   mettre en pause un ensemble, changer l'événement d'optimisation, l'audience ou la créa est
   une modification importante ; un changement d'enchère ou de budget l'est selon son ampleur.
   Elle peut relancer l'apprentissage.
4. [Pratiques pour réduire le coût par résultat](https://www.facebook.com/business/help/321695409726523)
   et [Le système de diffusion : placements](https://en-gb.facebook.com/business/help/965529646866485) :
   Meta vise le coût moyen le plus bas sur l'ensemble des placements, pas dans chacun. Un
   morceau de la ventilation qui coûte plus cher n'est pas forcément inefficace.
5. [Résultats par plateforme, appareil et placement](https://www.facebook.com/business/help/1098535543548363) :
   les valeurs des ventilations sont des estimations.
6. [Créer des pubs avec plusieurs textes](https://www.facebook.com/business/help/2579898108796785) :
   jusqu'à 5 textes principaux, 5 titres et 5 descriptions par pub ; Meta montre à chaque
   personne la combinaison à laquelle elle a le plus de chances de répondre ; la description
   ne s'affiche pas toujours.
7. [À propos des diagnostics de pertinence](https://www.facebook.com/business/help/403110480493160) :
   classements qualité, taux d'interaction et taux de conversion face aux pubs concurrentes,
   indisponibles sous 500 impressions.

Aucune source Meta officielle trouvée pour : un seuil de fréquence, un pourcentage de hausse de
budget « sûr » (le chiffre de 20 % qui circule vient de praticiens, pas de Meta), un CTR ou un
CPL « normal ». L'agent ne présente donc aucun de ces repères comme un fait.

## 1. Ce qu'on peut attendre avec 200 € par mois

- Avec le CPL cible (5 €), 200 € donnent de l'ordre de 40 leads par mois, environ 10 par
  semaine, **sur tout le compte**. Les 50 événements par semaine de la phase d'apprentissage
  sont hors d'atteinte : l'ensemble restera en apprentissage ou en apprentissage limité.
  **Source Meta (1, 2)** pour le seuil ; le calcul est une **estimation** à partir des réglages.
- Conséquence : « Apprentissage limité » dans le Gestionnaire est l'état normal du compte, pas
  une alerte. On ne restructure pas pour le faire disparaître. **Choix de départ à réviser.**
- Conséquence : les écarts sur quelques jours sont du bruit. Aucune décision sur moins de
  `bilanMinLeads` leads ou `bilanMinDepense` de dépense par pub, sauf les coupures de la
  section 3. **Choix de départ à réviser.**

## 2. Volume minimum avant de conclure

- **Sur une pub** : on tire une conclusion seulement quand elle a atteint `bilanMinLeads` leads
  (10) **ou** `bilanMinDepense` de dépense (50 €). Avant, on dit « pas encore concluant » et on
  donne le volume manquant. C'est aussi le seuil de l'alerte « lance un bilan ».
  **Choix de départ à réviser.**
- **Entre deux pubs** : pour dire que l'une fait mieux que l'autre, il faut que les deux aient
  atteint le volume minimum, et un écart de CPL d'au moins 50 %. En dessous, on parle de
  tendance, pas de gagnante. **Choix de départ à réviser** (aucun calcul de significativité
  n'est sérieux à 10 leads).
- **Sur un texte, un titre ou une description** d'une pub à plusieurs textes : seulement si
  `elements` donne des **leads** par élément (et pas seulement des impressions), et que chaque
  élément comparé a atteint `bilanMinLeads` leads. Sinon, rien. Meta répartit la diffusion vers
  la combinaison qu'il juge la meilleure (**Source Meta, 6**) et les ventilations sont des
  estimations (**Source Meta, 5**) : un élément peu diffusé n'est pas « perdant », il a été peu
  essayé. **Choix de départ à réviser** pour le seuil.
- **Sur un angle** (marque, prix, avant / après, preuve) : il faut au moins deux pubs du même
  angle, ou une pub au volume minimum plus des RDV comptés. Un angle ne se juge pas sur une seule
  créa. **Choix de départ à réviser.**

## 3. Quand couper une pub

Couper veut dire : Edgar met la pub en pause dans le Gestionnaire. L'agent ne le fait jamais.

- **Dépense sans lead** : dépense ≥ `sansLeadMultiple` × `cplCible` (15 €) et zéro lead → couper.
  À 6,60 € par jour partagés entre 3 pubs, c'est en gros une semaine. Même seuil que l'alerte
  « pub qui dépense sans lead ». **Choix de départ à réviser.**
- **CPL trop haut au volume minimum** : la pub a atteint le volume minimum et son CPL dépasse
  2 × `cplCible` (10 €) → couper, sauf si sa qualité de leads compense (section 8 : coût par RDV
  au moins aussi bon que celui des autres pubs). **Choix de départ à réviser.**
- **CTR très bas** : pas de repère de marché. On compare au reste du compte : après au moins
  1 000 impressions, une pub dont le CTR lien est inférieur à la moitié de celui de la meilleure
  pub du même ensemble a une accroche qui ne prend pas. C'est une raison de couper **si** elle a
  aussi un CPL au-dessus de la cible ; seule, c'est une raison de commander une autre accroche.
  **Choix de départ à réviser.**
- **CPL qui double** (alerte « CPL qui double » : CPL des 7 derniers jours ≥ `cplHausseRatio` ×
  CPL des 7 précédents, avec au moins `cplHausseMinLeads` leads sur chaque période) : on ne coupe
  pas tout de suite. On regarde d'abord fréquence, CPM et CTR (section 7) pour savoir si c'est la
  fatigue, l'audience ou une saison plus chère. **Choix de départ à réviser.**
- **Pub refusée, compte bloqué, jeton qui ne marche plus** : rien à analyser, c'est à régler
  d'abord dans le Gestionnaire ou dans le hub. **Choix de départ à réviser** (évident, mais écrit).
- Ne pas couper pendant les 3 premiers jours d'une pub, sauf refus ou dépense sans lead : avant,
  la diffusion se cherche (**Source Meta, 1**). Le délai de 3 jours est un **choix de départ à
  réviser**.

## 4. Quand garder

- Une pub au volume minimum, avec un CPL ≤ `cplCible`, et un taux de RDV qui n'est pas en
  dessous du reste du compte, on la garde et on n'y touche pas. **Choix de départ à réviser.**
- Une pub au volume minimum avec un CPL entre 1 et 2 × `cplCible` : on la garde si son coût par
  RDV est le meilleur du compte, sinon on la garde jusqu'à ce qu'une nouvelle créa soit prête,
  puis on la remplace. **Choix de départ à réviser.**
- Une pub qui n'a pas le volume minimum : on la garde, sauf coupure de la section 3.
- **On regroupe les changements.** Chaque nouvelle pub, changement d'audience ou pause d'un
  ensemble est une modification importante qui peut relancer l'apprentissage
  (**Source Meta, 3**). L'agent propose donc ses changements en un seul lot par bilan, pas un
  par jour.

## 5. Quand monter le budget, et de combien

- **Le budget n'est pas le frein, la capacité de production l'est** (`context/CONTEXT.md`) :
  à 5 € le lead, 200 € donnent déjà plus de clients que ce qu'Edgar peut produire. Avant de
  proposer plus de budget, l'agent vérifie dans les chiffres du hub combien de RDV et de
  clients sont en cours, et pose la question à Edgar. Il ne propose jamais de dépasser
  `budgetMensuel` sans le dire en toutes lettres. **Choix de départ à réviser.**
- Conditions pour proposer une hausse : au moins une pub au volume minimum avec un CPL ≤
  `cplCible` **et** un taux de RDV correct, pas d'alerte de rythme ouverte, et Edgar a de la
  place pour de nouveaux clients. **Choix de départ à réviser.**
- Ampleur : une hausse de budget peut relancer l'apprentissage selon son ampleur, Meta ne donne
  pas de pourcentage (**Source Meta, 3**). Choix : 20 % au plus à la fois, puis 7 jours sans
  autre changement avant d'en juger. **Choix de départ à réviser** (le 20 % est un usage de
  praticiens, pas une règle Meta).
- **Rythme du mois** : si la dépense du mois est en avance de plus de `rythmeTolerance` (20 %)
  sur le rythme du budget mensuel (alerte « dépense du mois trop rapide »), on baisse le budget
  par jour pour finir le mois à `budgetMensuel`, pas plus. **Choix de départ à réviser.**

## 6. Combien de variantes en même temps

- **Une campagne, un ensemble de publicités, placements automatiques.** Découper 6,60 € par
  jour en plusieurs ensembles éloigne encore plus chacun des 50 événements par semaine
  (**Source Meta, 1, 2**) et Meta optimise mieux sur l'ensemble des placements
  (**Source Meta, 4**). **Choix de départ à réviser.**
- **Trois pubs au plus dans l'ensemble** (comme le test A, B, D). Au-delà, aucune n'atteint le
  volume minimum en un mois. **Choix de départ à réviser.**
- **Plusieurs textes dans une même pub** (jusqu'à 5 textes principaux, 5 titres, 5
  descriptions) : oui, ça ne disperse pas le budget entre pubs, Meta choisit la combinaison
  (**Source Meta, 6**). Mais ce n'est pas un test : on n'en tire de conclusion que dans les
  conditions de la section 2. **Choix de départ à réviser.**
- **Un test = une question.** Un test compare des angles (créas différentes, textes cohérents)
  ou des textes (même créa), jamais les deux à la fois. **Choix de départ à réviser.**
- Un test se termine quand chaque pub a atteint le volume minimum, ou au bout de 14 jours, ou
  quand toutes sauf une ont été coupées. **Choix de départ à réviser.**

## 7. Comment lire la fréquence et faire le diagnostic

La fréquence (impressions divisées par personnes touchées) n'a pas de seuil officiel chez Meta.
`frequenceMax` (3 sur 7 jours) est un **choix de départ à réviser**. Lecture :

- Fréquence qui monte **et** CTR qui baisse **et** CPL qui monte : fatigue de la créa. Action :
  commander une nouvelle créa sur l'angle qui a marché (mode COMMANDER).
- Fréquence qui monte, CTR stable : l'audience est petite. Action : élargir l'audience, pas
  changer la créa.
- Fréquence basse, CPM qui monte : l'enchère est plus chère (saison, concurrence). Rien à
  corriger dans la pub ; on le note au journal.
- **Accroche** : CTR lien bas, CPM normal pour le compte → l'image ou la première ligne du texte
  ne retient pas.
- **Formulaire** : CTR correct mais peu de leads par clic lien → le formulaire freine (trop de
  questions, promesse différente de la pub). Si Meta n'expose pas les ouvertures de formulaire,
  l'agent le dit : « clics lien vers leads » est une approximation.
- **Audience** : CPM élevé et fréquence haute → audience trop étroite.
- **Diagnostics de pertinence** : utiles au-delà de 500 impressions seulement, et ils comparent
  aux pubs concurrentes, pas aux nôtres (**Source Meta, 7**). Le hub ne les lit pas
  aujourd'hui : l'agent peut demander à Edgar de les relever dans le Gestionnaire.
- Ces lectures croisées sont des **choix de départ à réviser**.

## 8. Juger la qualité des leads avant le CPL

Un lead à 3 € qui ne prend jamais rendez-vous coûte plus cher qu'un lead à 8 € qui en prend un.
L'ordre de lecture d'une pub est donc :

1. **Coût par RDV** (`coutParRdv`) et **taux de RDV** (`rdv` divisé par `leadsMeta` ou par
   `qualite.leads`), puis **clients** (`qualite.clients`).
2. **Budget déclaré** dans le formulaire (`qualite.budgets`) : une pub qui attire surtout des
   budgets sous 699 € amène des leads que l'offre ne sert pas, même pas chers. Seuil abaissé de
   999 € à 699 € par décision d'Edgar du 21/10/2026, à cause du One page à 699 €, la formule la
   moins chère de `livrables/offre/fiche-offre.md`.
3. Seulement ensuite, le **CPL**.

Précautions :

- Un lead met quelques jours à réserver son appel. Le taux de RDV d'une pub ne se juge que sur
  les leads de plus de 7 jours. **Choix de départ à réviser.**
- Repère de taux de RDV : 1 RDV pour 3 leads sur l'**ancien compte**, il y a un an. Ce n'est
  pas une donnée de « Kleak Pub ». À remplacer par la valeur mesurée après le premier bilan.
- Le **CA signé** et le **ROAS** sont « indisponibles » tant que le CRM n'a pas les devis et les
  montants : l'agent ne les estime pas.
- Les leads « non rattachés » (sans `ad_id`) et ceux des « autres pubs » ne sont attribués à
  aucune de nos pubs. L'agent donne leur nombre et ne les répartit pas.

## 9. Quand les données manquent

- Une valeur `null` veut dire « indisponible », jamais 0. L'agent écrit « indisponible » et ne
  calcule rien qui en dépend.
- Chaque ligne de `avertissements` est une partie que le hub n'a pas pu lire. L'agent la cite
  telle quelle en tête de sa réponse et ne tire aucune conclusion de cette partie.
- Si `lectureMeta` n'est pas `"ok"`, les chiffres Meta manquent : l'agent dit lesquels, ne fait
  pas de bilan des performances, et peut seulement parler du CRM.
- Si `elements` est `null` pour une pub, Meta n'a pas donné le détail par texte : l'agent le dit,
  ne devine aucune répartition.
- Si le hub ne répond pas (erreur, 401, 503, 404), l'agent s'arrête et le dit. Il ne travaille
  jamais sur des chiffres de mémoire ou d'une conversation précédente.
- Quand un repère manque (pas de donnée du compte, pas de source Meta), l'agent l'annonce comme
  « estimation » ou « choix de départ », jamais comme un fait.

## 10. Cohérence avec les alertes du hub

| Alerte du hub | Règle ici | Ce que fait l'agent quand Edgar dit « j'ai reçu une alerte » |
|---|---|---|
| Pub refusée, compte bloqué | 3 | Explique quoi vérifier dans le Gestionnaire, pas de bilan |
| Jeton Meta | 3, 9 | Dit que la lecture Meta est coupée, renvoie au hub |
| Dépense sans lead | 3 | Propose de couper la pub, chiffres à l'appui |
| CPL qui double | 3, 7 | Diagnostic fréquence, CPM, CTR avant toute coupure |
| Fréquence | 7 | Fatigue ou audience, selon le CTR |
| Rythme du mois | 5 | Nouveau budget par jour pour finir à `budgetMensuel` |
| Volume minimum atteint | 2 | Lance un BILAN de la pub |

Si une valeur de `seuils` change dans les Réglages, ces règles suivent sans modification : elles
citent les noms, pas les chiffres.

## Historique des révisions

- 20/10/2026 : première version, avant tout test. Aucune règle ne vient encore des données du
  compte.
- 21/10/2026 : section 8, le seuil des budgets déclarés qui comptent comme un mauvais signe passe
  de « sous 999 € » à « sous 699 € » (décision d'Edgar, arrivée du One page à 699 €). Ce n'est
  pas une donnée du compte.
- 29/10/2026 : `budgetMensuel` à 300 € (10 € par jour) à partir de novembre, décision d'Edgar.
  Une seule campagne active sur le compte à la fois (octobre : 5 campagnes en parallèle, 2 leads
  pour 100 €). Formulaire en « plus de volume », questions inchangées (site existant, budget, nom
  de l'entreprise). Campagne de relance à 5 pubs par décision d'Edgar, exception à la section 6
  (3 pubs au plus), qui reste la règle par défaut. Section 1 et 5 à relire avec ce budget. Le repère « ancien compte » ne vient pas de
  « Kleak Pub », qui n'avait aucun lead avant octobre 2026 (journal du 29/10).
