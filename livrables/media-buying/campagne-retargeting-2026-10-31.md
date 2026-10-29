# Campagne retargeting du 31/10/2026 : fiche à exécuter dans le Gestionnaire

> Préparée par `media-buyer` le 28/10/2026. Edgar crée la campagne à la main dans le
> Gestionnaire (le hub ne sait créer que des campagnes Prospects avec formulaire). Rien n'est
> fait dans Meta par l'agent. Entrée du journal : « 28/10/2026, retargeting t, test prévu ».

## Ce qui a été lu avant

- Lecture hub du 22/10 au 28/10 (28/10 partiel) : 200, lecture Meta « ok », aucun
  avertissement, aucune alerte ouverte, `depenseMois` 87,96 €, `budgetMensuel` 200 €.
- Décisions d'Edgar reprises du journal : retargeting `t-appel-30-minutes` décalé au 31/10,
  2 € par jour, jusqu'à la fin de l'ensemble acquisition (07/11) ; plus aucun prix dans les
  pubs (26/10) ; note Google retirée des descriptions (26/10).
- Les deux pages sont en ligne et en `noindex` au 28/10 : `/site-internet` (sombre) et
  `/votre-site` (claire, celle de la campagne LP depuis le 26/10, testée de bout en bout le
  26/10, qui dit « 30 minutes, en visio » et « on présente les formules et leurs prix pendant
  l'appel »).

## Campagne

| Réglage | Valeur |
|---|---|
| Nom de la campagne | `Kleak \| Retargeting \| 2026-10-31` |
| Objectif | Trafic |
| Budget de campagne Advantage+ | Désactivé (budget sur l'ensemble) |
| Nom de l'ensemble | `Kleak \| Retargeting \| Engagés 365 j` |
| Lieu de conversion | Site web, pixel Kleak Pub |
| Objectif de performance | Maximiser le nombre de vues de page de destination (comme `LP sans prix`) |
| Budget | 2 € par jour, budget quotidien de l'ensemble |
| Calendrier | Début le 31/10/2026 à 00 h 00, fin le 07/11/2026 à 23 h 59 (8 jours, 16 € au plus) |
| Audience incluse | Audience personnalisée `Kleak \| Engagés 365 j` |
| Audience exclue | `Kleak \| Formulaire envoyé 90 j` (à créer si elle n'existe pas, voir plus bas) |
| Lieu, âge | France, 25 à 65 ans et plus (comme les autres campagnes) |
| Audience Advantage+ | **Désactivée** (« utiliser les options de l'audience d'origine ») : sinon Meta prend l'audience personnalisée pour une simple suggestion et diffuse au-delà, et ce n'est plus du retargeting |
| Placements | Advantage+ (comme les autres campagnes) |
| Pub | Une seule : `t-appel-30-minutes` (le nom de la pub doit être exactement celui-ci, il part dans `utm_content`) |
| Identité | Page Facebook Kleak et compte Instagram Kleak |
| Format | Image unique, visuels personnalisés par placement : post 4:5 `rendus/post/t-appel-30-minutes-post.png` pour les fils, story 9:16 `rendus/story/t-appel-30-minutes-story.png` pour Stories et Reels |
| Textes | Les 4 textes, 4 titres, 4 descriptions ci-dessous (option « plusieurs textes ») |
| Améliorations Advantage+ de la créa | Désactiver celles qui réécrivent le texte ou retouchent l'image (les textes suivent les règles de copy d'Edgar, Meta ne les connaît pas) |
| Bouton | Réserver |
| URL de destination | `https://kleakagency.fr/votre-site` |
| Paramètres d'URL | `ad_id={{ad.id}}&utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` |

### Exclusions

- **Leads du formulaire instantané** : audience personnalisée « Formulaire instantané »,
  « personnes ayant envoyé le formulaire », 90 jours, nom `Kleak | Formulaire envoyé 90 j`. Je
  ne peux pas vérifier qu'elle existe (je n'appelle pas Meta) : si elle n'existe pas, la créer
  avant. Ces personnes ont déjà reçu l'email pour réserver leur appel et les relances du hub.
  Au 28/10, le CRM compte 2 leads de pubs dans la période (J et r de la campagne copie).
- **Personnes qui ont déjà réservé un appel** : **aucune audience possible aujourd'hui**. La
  réservation Cal.com ne déclenche aucun événement pixel sur la page (journal du 24/10), donc
  Meta ne sait pas qui a réservé. Seule voie : une liste de clients (emails et téléphones du
  CRM) importée à la main. Avec 1 RDV de pub à ce jour, ce n'est pas la peine maintenant.
- **Ne pas exclure** l'audience retargeting des campagnes d'acquisition en cours (LP sans prix,
  Métiers) : changer leur audience est une modification importante qui peut relancer leur
  apprentissage (`regles.md`, source Meta 3), pour un recouvrement de quelques personnes à
  2 € par jour.

### Vérifications avant de publier

1. Ouvrir `Kleak | Engagés 365 j` dans Audiences : taille affichée et statut « Prêt ». Si Meta
   la signale trop petite pour diffuser, ne pas lancer et me relancer (on élargira la source :
   visiteurs de `/votre-site` et `/site-internet`, vues de vidéo, par exemple).
2. Relire sa définition : celle prévue le 24/10 réunit les interactions avec la page Facebook
   et le compte Instagram sur 365 jours, l'ouverture du formulaire J K D sans envoi, et les
   visiteurs de `/site-internet` sur 30 jours. Ajouter les visiteurs de `/votre-site` (30
   jours) si ce n'est pas fait : c'est la page de la campagne LP depuis le 26/10.
3. Dans l'aperçu de la pub, vérifier que le 4:5 sort dans les fils et le 9:16 en Stories et
   Reels, et cliquer une fois sur le lien d'aperçu : l'adresse doit arriver sur `/votre-site`
   avec `ad_id=` et les `utm_`.
4. Si Meta refuse le budget de 2 € pour cette optimisation, il affiche le minimum : me le
   donner, on ajuste la durée plutôt que le rythme.

## Créa retenue : `t-appel-30-minutes`

- C'est la seule créa dont l'unique idée est l'offre de cette campagne : « Un appel gratuit
  de 30 minutes pour parler de votre *site.* », avec le calendrier et les créneaux réels de
  Cal.com, légende « Vous choisissez le jour et l'heure. ». Retenue par Edgar le 24/10 pour
  ce retargeting, post et story rendus, story contrôlée (`NOTES.md`, série 7).
- Elle n'a encore jamais été diffusée : les personnes de l'audience ont vu o, r, J, K, D, v,
  w ou x, pas t. Montrer à quelqu'un qui connaît déjà Kleak autre chose que la pub qu'il a
  déjà vue, et lui donner directement l'étape suivante, c'est le rôle de cette pub.
- Aucun prix (décision du 26/10).
- Écartées : `x-appel-bulle` (claire, assortie à `/votre-site`, mais elle tourne déjà dans
  Métiers sur une audience qui recouvre celle-ci, et son idée est l'appel du client de
  l'entreprise, pas l'appel avec Kleak) ; `t-appel-30-minutes-v2` et `-v3` (posts seuls, pas
  de story) ; o et r (déjà vues par une bonne partie de l'audience).
- **Limite connue** : t est une créa sombre (série 7) qui mène à une page claire, comme o et r
  depuis le 26/10. Choix de `/votre-site` plutôt que `/site-internet` (sombre) : c'est la page
  vivante de la campagne LP, testée de bout en bout le 26/10, et la seule des deux qui dit
  « 30 minutes, en visio » en clair. Pas de commande de créa : rien ne dit que l'écart de
  couleur coûte quelque chose, et 16 € ne permettraient pas de le mesurer.

## Textes d'annonce (offre `kleak`, aucun prix), déposés dans le hub le 28/10

Même dernière phrase partout, l'ouverture change d'un texte à l'autre.

| # | Texte principal | Car. | Ce qui change |
|---|---|---|---|
| 1 | Vous pensez toujours à votre site internet ? Réservez un appel gratuit de 30 minutes avec nous. Vous choisissez le jour et l'heure sur notre page. | 146 | Le rappel, pour quelqu'un qui y a déjà pensé |
| 2 | Pendant un appel gratuit de 30 minutes, nous parlons de votre activité et de vos objectifs. Vous choisissez le jour et l'heure sur notre page. | 142 | Ce qui se passe pendant l'appel (fiche, étape 1) |
| 3 | Après un appel gratuit de 30 minutes, vous recevez un devis à prix fixe, valable 30 jours. Vous choisissez le jour et l'heure sur notre page. | 141 | Ce qu'on reçoit après (fiche, étape 2) |
| 4 | Vous avez des questions sur votre site internet ? Posez-les pendant un appel gratuit de 30 minutes. Vous choisissez le jour et l'heure sur notre page. | 150 | Les questions qu'on se pose encore |

| # | Titre | Car. |
|---|---|---|
| 1 | Appel gratuit de 30 minutes | 27 |
| 2 | Parlons de votre site internet | 30 |
| 3 | Réservez votre appel gratuit | 28 |
| 4 | Choisissez votre créneau | 24 |

| # | Description | Car. |
|---|---|---|
| 1 | Vous choisissez l'horaire | 25 |
| 2 | Votre activité, vos objectifs | 29 |
| 3 | Devis valable 30 jours | 22 |
| 4 | Réservation en ligne | 20 |

Les 4 textes dépassent 125 caractères : sur mobile, « Voir plus » coupe après la deuxième
phrase environ, l'appel gratuit de 30 minutes reste toujours dans la partie visible. Dans le
hub, `t-appel-30-minutes` garde aussi ses 3 textes du 24/10 (écrits pour du trafic froid) :
pour cette pub, ne cocher que les 4 ci-dessus. Si Meta refuse de mélanger plusieurs textes et
des visuels par placement, garder le texte 1, le titre 1 et la description 1.

## Hypothèse, critère de fin, bilan

- **Hypothèse** : des personnes qui ont déjà interagi avec Kleak (page, Instagram, pubs)
  réservent un appel depuis `/votre-site` à un coût par RDV plus bas que le trafic froid de
  `Kleak | LP sans prix`.
- **Mesure** : RDV `canal=lp` dont l'`ad_id` est celui de la pub t de cette campagne, divisés
  par la dépense de la campagne. Lu face au coût par RDV `canal=lp` de `LP sans prix` sur la
  même période. À côté : couverture, fréquence, CTR lien, coût par vue de page.
- **Critère de fin** : date de fin de l'ensemble, le 07/11 à 23 h 59 (16 € au plus).
- **Pendant la diffusion** : ne rien modifier, sauf refus de la pub. Point de contrôle le
  03/11 (J+3) : la campagne dépense-t-elle (une audience trop petite peut ne rien dépenser),
  et sur quels placements.
- **Bilan** : le 08/11, avec celui de `LP sans prix` (lecture du 31/10 au 07/11).

## Ce que ce test peut dire, et ce qu'il ne peut pas dire

- **Il ne peut rien conclure au sens de `regles.md`.** 16 € sont loin de `bilanMinDepense`
  (50 €) ; pour 10 RDV (`bilanMinLeads`), il faudrait 1,60 € par RDV. Même prolongé à 14 jours
  (28 €), le volume minimum reste hors d'atteinte. Ce sera au mieux une tendance.
- **Ce qu'il peut montrer** : si l'audience est assez grande pour que Meta dépense 2 € par
  jour ; à quelle fréquence on la touche ; si le CTR lien et le coût par vue de page sont du
  même ordre que ceux du compte (`LP sans prix` : CTR lien 4,20 %, 0,12 € par clic lien du
  22/10 au 28/10) ; et si un RDV arrive. Un seul RDV qui signe un One page (699 €) couvre
  largement la dépense, mais un RDV n'est pas une preuve.
- **Fréquence** : sur une petite audience, une fréquence au-dessus de `frequenceMax` (3 sur
  7 jours) est attendue et l'alerte « Fréquence » du hub peut se déclencher. Sur cette
  campagne, elle ne veut dire ni fatigue ni erreur tant que le CTR lien tient ; si le CTR
  baisse avec elle, la lecture de `regles.md` section 7 s'applique.
- **Mesure, réserves déjà connues** : le bilan du 27/10 a vu la plupart des visites Facebook de
  `/votre-site` arriver en « referral » sans les `utm_` dans GA4. Si `ad_id` se perd de la même
  façon jusqu'à Cal.com, un RDV venu de t serait compté `canal=lp` sans pub, et on ne pourrait
  pas le séparer de la campagne LP. À vérifier sur la première réservation réelle `canal=lp`.

## Budget

- Octobre : 2 € le 31/10. `depenseMois` 87,96 € au 28/10 ; avec LP sans prix et Métiers à
  7 € par jour jusqu'au 31/10, le mois finit de l'ordre de 140 à 160 € (estimation, selon le
  moment où la campagne copie s'arrête), sous les 200 €.
- Novembre : 14 € du 01/11 au 07/11, à côté de LP sans prix (de l'ordre de 49 € jusqu'au
  07/11) et de Métiers (date de fin à confirmer par Edgar).
- Option, à décider par Edgar : prolonger au 13/11 (14 jours, 28 € au total). Pour : 12 € de
  plus, deux fois plus de chances de voir un RDV, et la règle des 14 jours de `regles.md`
  section 6. Contre : le retargeting tournerait seul après la fin de LP sans prix, alors que
  l'audience se nourrit surtout des personnes touchées par les campagnes d'acquisition, et
  le volume minimum reste hors d'atteinte de toute façon.
