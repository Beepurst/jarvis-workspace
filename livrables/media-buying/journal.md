# Journal des tests Meta Ads

> Tenu par l'agent `media-buyer`. Une entrée par test lancé et par bilan, la plus récente en
> haut. On écrit aussi ce qui n'a rien donné et ce qu'on n'a pas pu conclure, pour ne pas
> refaire le même test.

Format fixe d'une entrée :

```markdown
## JJ/MM/AAAA, <titre court>, <type : test prévu, test lancé ou bilan>

- **Campagne** : nom dans le Gestionnaire, ensembles et pubs (ids des créas)
- **Hypothèse** : ce que le test doit trancher, et le critère de fin
- **Chiffres** : période lue, dépense, leads, CPL, RDV, coût par RDV, CTR, CPM, fréquence
  (« indisponible » quand le hub ne l'a pas), avertissements du hub
- **Décision** : ce qu'Edgar fait dans le Gestionnaire, ou « rien »
- **Leçon** : ce qu'on retient, avec son niveau de preuve (concluant, tendance, pas concluant)
```

## 26/10/2026, placements de la campagne LP sans prix, bilan

- **Campagne** : `Kleak | LP sans prix | 2026-10-26` (id 120251914869350751, Trafic), ensemble
  `Kleak | LP sans prix | Acquisition` optimisé sur `LANDING_PAGE_VIEWS`, placements Advantage+,
  pubs `o-site-captivant-s` et `r-avant-apres-demandes`.
- **Hypothèse** : vérifier qu'Audience Network et Messenger ne mangent pas le budget, et que les
  clics à 0,13 € deviennent bien des vues de la page.
- **Chiffres** (API Meta, du 24/10 au 26/10 en fin de journée) : 13,09 €, 2 390 impressions,
  107 clics sur le lien à 0,12 €, **99 vues de la page de destination (93 % des clics)**.
  Instagram Reels 11,65 € (89 %), 97 clics, 90 vues ; Facebook Reels 0,65 € ; Facebook
  in-stream 0,28 € ; Facebook fil 0,16 €, 0 clic ; **Audience Network 0,14 € (1 %), 109
  impressions, 0 clic** ; **Messenger 0 €, aucune diffusion**. Mobile 13,08 €, ordinateur
  0,01 €. Par pub : r 12,60 € (105 clics, 97 vues), o 0,49 € (2 clics, 2 vues). RDV `canal=lp` :
  à lire au bilan.
- **Décision** : rien dans le Gestionnaire. Exclure Audience Network modifierait le ciblage
  (risque de relancer l'apprentissage) pour 0,14 €. À revoir si Audience Network dépasse 5 % de
  la dépense.
- **Leçon** : placements sains, presque tout le trafic arrive sur la page (concluant sur 107
  clics). Meta concentre 96 % du budget sur r en Reels Instagram : le test mesure r, pas o
  contre r (constat). Le critère reste le coût par RDV `canal=lp`.

## 26/10/2026, textes formulaire de o et r pour la campagne J K D, dépôt

- **Campagne** : `Kleak | multi | 2026-10-22 - Copie` (formulaire instantané), où Edgar ajoute
  `o-site-captivant-s` et `r-avant-apres-demandes` à côté de `j-avis-clients` (J + o + r).
- **Textes** : version formulaire, offre `kleak`, aucun prix, fin de texte calquée sur J
  (« Remplissez le formulaire et vous recevez tout de suite un email pour choisir votre
  créneau d'appel »). 3 textes, 3 titres, 3 descriptions par pub. Déposés le 26/10 :
  o 201 (4 créés, 5 déjà là), r 201 (4 créés, 5 déjà là), aucun refus. Avertissement seul :
  textes principaux de plus de 125 caractères (o 221 à 240, r 236 à 251). Les titres et les
  descriptions « Votre activité, vos objectifs », « Choisissez votre créneau » existaient déjà
  (dépôt LP du 24/10) ; nouveau : « Noté 4,8/5 sur Google ». Dans le hub, o et r gardent aussi
  leurs textes LP (« Réservez un appel gratuit… ») : à ne pas utiliser sur le formulaire.
- **Décision** : Edgar colle ces textes dans o et r de la campagne formulaire.
- **Leçon** : aucune, dépôt.

## 26/10/2026, J K D et LP sans prix à J+3, bilan

- **Campagnes** :
  - `Kleak | multi | 2026-10-22` (id 120251881595700751, en pause depuis le 24/10) et sa copie
    `Kleak | multi | 2026-10-22 - Copie` (id 120251909979950751, active), formulaire
    instantané, pubs `d-avant-apres-appeler`, `j-avis-clients`, `k-devis-prix-fixe`.
  - Campagne LP sans prix (Trafic, `/site-internet`), pubs `o-site-captivant-s`,
    `r-avant-apres-demandes`.
- **Hypothèse** : J K D, CPL du compte face à `cplCible` 5 € (fin à 49 € ou au 30/10). LP,
  coût par RDV sans prix face à J K D (fin le 07/11). Ni l'une ni l'autre atteinte.
- **Chiffres** (lecture hub du 22/10 au 26/10, lecture Meta « ok », aucun avertissement,
  aucune alerte ouverte ; relevés par la session principale, une relecture du même jour donne
  46,08 € au total, écart de diffusion en cours de journée) :
  - Total 45,87 €.
  - J K D originale (en pause) : 13,31 €, 11 clics lien, 0 lead.
  - J K D copie : 19,67 €, 19 clics lien, 1 lead (`j-avis-clients`, budget « moins de 700 € »,
    désinscrit des emails en 22 s).
  - LP sans prix : 12,89 €, 106 clics lien, 98 vues de page de destination selon Meta, 0 RDV.
  - Par pub, deux campagnes J K D additionnées : J 15,24 € et 1 lead, K 11,12 € et 0,
    D 6,62 € et 0. CPM J K D de 35 à 69 €, CTR de 3,4 à 3,7 %. CPL du compte : 1 lead pour
    32,98 €. RDV 0, coût par RDV indisponible.
  - Placements (Graph API, insights par placement) : J K D diffusée à 100 % en Stories
    Facebook et Instagram, alors que les placements de l'ensemble sont automatiques et que les
    créas ont des règles feed et story correctes. LP : 85 % en Reels Instagram (96 clics),
    CPC 0,12 €, un peu d'Audience Network.
- **Diagnostic** : le frein est après le clic, pas l'accroche. 30 clics lien pour 1 lead sur
  le formulaire, 98 vues de page pour 0 RDV sur la LP. Rien ne prouve que le prix bloque : la
  seule pub sans prix de J K D (J) a fait le seul lead, mais la LP sans aucun prix fait 0 RDV.
  Aucune pub n'a atteint le volume minimum (10 leads ou 50 €).
  - Défauts trouvés sur `/site-internet` : pas de bandeau cookies, donc GA4 à 0 session
    (consentement impossible) ; ancien pixel 1414385413320328 en code de page, chargé sans
    consentement. Bandeau ajouté et publié le 26/10 par la session principale. Les vues de
    page et les RDV de la LP avant le 26/10 se lisent donc avec cette réserve.
  - Ancien formulaire de l'agence : mêmes deux questions qu'aujourd'hui (site existant,
    budget). Le formulaire n'est pas ce qui a changé par rapport à l'ancien compte.
- **Décision** (Edgar, 26/10) :
  - plus aucun prix dans les pubs, le prix est présenté en RDV comme avant ;
  - K et D (prix dans l'image) mises en pause, o et r ajoutées à la campagne formulaire à côté
    de J (J + o + r) ;
  - la campagne LP continue (pas de pause), avec le bandeau cookies en place ;
  - l'ancien pixel 1414385413320328 est à retirer à la main par Edgar dans les réglages de la
    page ;
  - site : titre du hero de l'accueil passé à « Votre site internet en ligne en 5 jours »,
    titre et description Google de l'accueil sans prix, `/tarifs` reste en ligne.
- **Leçon** : **pas concluant** sur les performances (aucune pub au volume minimum, 1 lead,
  0 RDV). **Tendance faible** : l'accroche prend (CTR lien de 3,4 à 3,7 % sur J K D, CPC
  0,12 € sur la LP), la perte se fait après le clic. Le prix comme frein n'est ni prouvé ni
  écarté : la décision « sans prix » est un choix d'Edgar, pas une donnée du compte. La
  duplication du 24/10 a relancé l'apprentissage, et l'ajout de o et r avec la pause de K et D
  le relance encore : les chiffres d'avant et d'après le 26/10 ne se comparent pas directement.
  La diffusion 100 % Stories de J K D est à surveiller sur la nouvelle composition.

## 24/10/2026, campagne landing page sans prix (o, r), test lancé

- **Campagne** : publiée par Edgar dans le Gestionnaire le 24/10, créée à la main (le hub ne
  crée pas de campagne Trafic). Objectif Trafic, optimisation « Vues de page de destination ».
  Pubs `o-site-captivant-s` et `r-avant-apres-demandes` (v1), posts 4:5 et stories 9:16.
  Destination https://kleakagency.fr/site-internet, paramètres d'URL
  `ad_id={{ad.id}}&utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`.
  **À confirmer à la première lecture** : nom exact et ids, 7 € par jour, date de fin à J+14
  (07/11 si la diffusion part le 24/10), ciblage identique à J K D, statut (une lecture du hub
  juste après la publication ne montre pas encore la campagne, sans doute en attente de
  validation par Meta). Retargeting t pas lancé, prévu le 31/10 à 2 € par jour.
- **Hub** : correctif du 24/10 en production. Canal et source `lp` ; `ad_id` et `ad_name` du
  RDV transmis par la page à Cal.com, donc **RDV attribuables par pub** (la réserve « pas
  attribuable » de l'entrée « test prévu » ne vaut plus, à vérifier sur le premier RDV) ;
  campagnes Trafic comptées dans la dépense, les tableaux et Finance, sans alerte « sans lead ».
- **Hypothèse** : inchangée (entrée « test prévu » ci-dessous), avec sa limite : pas un A/B
  propre, une tendance au mieux.
- **Chiffres** : aucun encore.
- **Décision** : rien à modifier avant le point d'étape du 27/10 (J+3), sauf refus. Bilan
  après la fin, le 08/11 (lecture du 24/10 au 07/11). Dates à décaler si la diffusion démarre
  plus tard que le 24/10.
- **Leçon** : à écrire au bilan.

## 24/10/2026, campagne landing page sans prix (o, r, t), test prévu, lancé le 24/10

- **Campagne** : `Kleak | LP sans prix | AAAA-MM-JJ`, décidée par Edgar le 24/10, **en parallèle
  de J K D** (choix d'Edgar, conséquence connue : deux campagnes se partagent le compte et se
  lisent séparément). Destination https://kleakagency.fr/site-internet (publiée le 24/10,
  `noindex`), calendrier Cal.com intégré `metadata[canal]=lp`, pas de formulaire. **Le hub ne
  peut pas la créer** : sa création force l'objectif Prospects et un formulaire instantané
  (`buildCampaignPayload`, `OUTCOME_LEADS`, `destination_type: ON_AD`). Création à la main dans
  le Gestionnaire, en pause. Objectif Trafic, optimisation « Vues de page de destination »
  (pixel Kleak Pub), bouton « Réserver ». Ensemble acquisition : France, 25 à 65 ans et plus,
  audience Advantage+ coupée, placements Advantage+ (comme J K D), 7 € par jour, fin à J+14,
  2 pubs : `o-site-captivant-s` et `r-avant-apres-demandes` (v1, choisie par Edgar le 24/10).
  Ensemble retargeting `t-appel-30-minutes` : **décalé au 31/10, 2 € par jour** (décision
  d'Edgar du 24/10), audience d'engagement trop petite avant (J K D a touché de l'ordre de
  400 personnes au 24/10). Audience : interactions avec la page Facebook et le compte Instagram
  (publications et pubs, 365 jours), ouverture du formulaire J K D sans envoi, visiteurs de
  `/site-internet` sur 30 jours (sous-comptés). Edgar crée l'audience dès maintenant et lance
  t le 31/10 si Meta l'accepte, jusqu'à la fin de l'ensemble acquisition. Posts 4:5 seuls,
  pas de story rendue. **Remplace la campagne BTP**, qui n'est pas lancée.
- **Hypothèse** : sans prix affiché (pub et page) et avec réservation directe, le coût par RDV
  réservé est plus bas que celui de J K D. Mesure : RDV `canal=lp` divisé par la dépense de la
  campagne, face au coût par RDV de J K D. Critère de fin : J+14, ou 98 € dépensés sur
  l'ensemble acquisition. Bilan le lendemain de la fin.
- **Limite, écrite avant le lancement** : ce n'est pas un A/B propre. Par rapport à J K D,
  trois choses changent en même temps : la destination (landing page au lieu du formulaire
  instantané), les créas (o, r au lieu de D, J, K) et l'absence de prix, sur une période
  qui se décale vers novembre. Un écart de coût par RDV sera une **tendance**, jamais la preuve
  que le prix bloquait. Le formulaire instantané était déjà le premier suspect au bilan du
  24/10 (0 lead pour 11 clics lien).
- **Volume** : pour conclure sur le coût par RDV de la campagne, il faut `bilanMinLeads`
  (10) RDV, soit au plus 9,80 € par RDV à 98 €. En dessous, tendance. Par pub, le RDV n'est
  pas attribuable (Cal.com ne reçoit pas l'id de la pub) : on ne jugera o et r que sur CTR
  lien, CPC et vues de page, à `bilanMinDepense` (50 €) par pub, que Meta n'atteindra pas
  forcément sur les deux.
- **Mesure, réserves connues** : le pixel ne se charge qu'après accord cookies, les vues de
  page et les audiences de visiteurs sont sous-comptées ; aucun événement de réservation
  n'existe sur la page. Dans le hub au 24/10, `canalReservation` ne connaît que `email`,
  `whatsapp`, `site` : une réservation `canal=lp` devient `direct`, source `autre`, mélangée
  aux autres réservations. Correctif décidé par Edgar le 24/10 (option A) : la session
  principale ajoute le canal `lp` au hub, sur une branche. Ne pas lancer avant sa mise en
  production.
- **Budget** (lecture du 24/10, `depenseMois` 16,36 €, estimations si la LP démarre le
  26/10) : octobre de l'ordre de 106 € (J K D environ 62 €, LP acquisition 42 €, t 2 € le
  31/10), sous les 200 €. Pendant le chevauchement (26 au 30/10), 14 € par jour, le double du
  rythme de 6,60 €. Novembre, sans BTP : LP acquisition 56 € (1er au 08/11) et t 16 € (2 € par
  jour sur la même période), soit **72 €**, 128 € non engagés, à décider au bilan LP.
- **Textes** : validés tels quels par Edgar le 24/10, 3 textes, 3 titres, 3 descriptions par
  pub, offre `kleak`, aucun prix. Déposés le 24/10 : o `o-site-captivant-s` 201 (9 créés),
  r `r-avant-apres-demandes` 201 (9 créés), t `t-appel-30-minutes` 201 (9 créés), aucun refus.
  Seul avertissement : textes principaux de plus de 125 caractères (o 195 à 207, r 198 à 216,
  t 172 et 175 ; le texte 1 de t fait 120). Plusieurs textes par pub : visuel 4:5 seul.
- **Chiffres** : aucun, rien n'est diffusé. Lecture du 24/10 (période 23/10 au 24/10) :
  lecture Meta « ok », aucun avertissement, aucune alerte ouverte.
- **Décision** : rien dans le Gestionnaire tant que le canal `lp` n'est pas lu par le hub en
  production. Ensuite, Edgar crée la campagne à la main (le hub ne sait pas faire Trafic).
- **Dates** (fixées au lancement du 24/10) : point d'étape le 27/10 (J+3), fin le 07/11 (J+14),
  bilan le 08/11. Lancée le 24/10 avec stories 9:16 en plus des posts (entrée « test lancé »).
- **Leçon** : à écrire au bilan.

## 24/10/2026, test J K D relancé en copie, test lancé

- **Campagne** : le 24/10 au matin, Edgar a mis en pause `Kleak | multi | 2026-10-22`
  (id 120251881595700751) et l'a dupliquée en `Kleak | multi | 2026-10-22 - Copie`
  (id 120251909979950751, créée à 10 h 39), active. Même structure : ensemble
  `Kleak | multi | 2026-10-22 | Prospection` (id 120251909979960751), 7 € par jour, fin le 30/10
  à 23 h 59, 3 pubs `d-avant-apres-appeler` (120251909979980751), `j-avis-clients`
  (120251909979940751), `k-devis-prix-fixe` (120251909979970751). Raison de la duplication non
  précisée par Edgar.
- **Hypothèse** : inchangée (CPL du compte face à `cplCible` 5 €). La copie repart en phase
  d'apprentissage. Le budget du test se compte sur les deux campagnes : 13,31 € dépensés sur
  l'originale, critère de fin à 49 € au total ou le 30/10.
- **Chiffres** (lecture Meta du 24/10 vers 13 h 40, copie seule) : 1,77 €, 49 impressions,
  **1 lead** (`j-avis-clients`, Instagram, à 13 h 17). Premier lead du test, et premier lead
  rattaché à une pub dans le CRM. Profil : budget « moins de 700 € », a déjà un site. Chaîne
  complète vérifiée : hub en 17 s, push « Nouveau lead », invitation Brevo délivrée, push
  « Envoyer le WhatsApp » à 13 h 36. Le lead s'est désinscrit des emails 22 s après la
  réception (bouton de Gmail), relances annulées par le hub.
- **Décision** : rien de plus. Point d'étape du 26/10 maintenu, en additionnant les deux campagnes.
- **Leçon** : pas concluant sur les performances. Le formulaire enregistre bien un envoi réel (frein
  « formulaire » du bilan du matin écarté pour ce lead). Côté hub, l'`ad_id` du Sheet arrivait avec
  le préfixe `ag:` et ne se rattachait à aucune pub : corrigé et en production le 24/10. Une
  désinscription en 22 s est un seul cas, à surveiller sur les leads suivants.

## 24/10/2026, test J K D à J+1, bilan (anticipé, à la demande d'Edgar)

- **Campagne** : `Kleak | multi | 2026-10-22` (id 120251881595700751), 1 ensemble, 3 pubs
  `d-avant-apres-appeler`, `j-avis-clients`, `k-devis-prix-fixe`. Active depuis le 23/10 vers
  12 h, fin prévue le 30/10.
- **Hypothèse** : inchangée (remesurer le CPL du compte face à `cplCible` 5 €). Critère de fin :
  49 € dépensés ou 30/10. **Non atteint** : 13,31 € dépensés, soit 27 % du test et 6,7 % de
  `budgetMensuel`.
- **Chiffres** (lecture du 24/10, période 23/10 au 24/10, 24/10 partiel ; lecture Meta « ok »,
  aucun avertissement, aucune alerte ouverte) : dépense 13,31 € (10,12 € le 23/10 pour une
  demi-journée, 3,19 € le 24/10 au moment de la lecture), 296 impressions, couverture 285,
  fréquence 1,04, CPM 44,97 €, 13 clics dont 11 clics lien, CTR 3,72 %, CPC 1,02 €,
  **0 lead Meta**, CPL indisponible, 0 RDV, coût par RDV indisponible, CA et ROAS indisponibles.
  Par pub : D 6,40 €, 93 impr., 4 clics lien, CPM 68,82 €, 0 lead ; J 4,45 €, 117 impr.,
  6 clics lien, CPM 38,03 €, 0 lead ; K 2,46 €, 86 impr., 1 clic lien, CPM 28,60 €, 0 lead.
  CRM : 1 lead non rattaché (budget « non renseigné »), probablement le lead de test du 23/10,
  à confirmer par Edgar. Elements : un seul texte, titre, description par pub, rien à comparer.
- **Décision** : ne rien changer à la diffusion avant le point d'étape du 26/10 (J+3), aucune pub
  à 15 € sans lead (D la plus proche, 6,40 €). Hors diffusion : Edgar vérifie que le formulaire
  enregistre bien un envoi (test réel sur mobile, puis contrôle dans l'Espace prospects de Meta
  et dans le CRM), relève les ouvertures du formulaire dans le Gestionnaire, et identifie le lead
  non rattaché.
- **Leçon** : pas concluant. 0 lead sur 11 clics lien est le seul signal à surveiller
  (formulaire), mais 11 clics ne suffisent pas à juger un taux d'envoi. Si à 49 € (de l'ordre de
  45 clics lien au CPC actuel, estimation) il n'y a toujours aucun lead, le frein est le
  formulaire ou sa technique, pas la créa : condition 2 de l'entrée BTP du 22/10, on corrige le
  formulaire avant tout nouveau lancement.

## 23/10/2026, test J K D, test lancé

- **Campagne** (vérifiée dans Meta le 23/10 à 12 h) : `Kleak | multi | 2026-10-22`, ensemble
  `Kleak | multi | 2026-10-22 | Prospection` (id 120251881595790751), statut ACTIVE, activé par
  Edgar le 23/10 vers 12 h. 3 pubs : `d-avant-apres-appeler`, `j-avis-clients`,
  `k-devis-prix-fixe`, avec les nouveaux textes (email immédiat, entrée du 22/10). Formulaire
  « Kleak | Appel découverte | 2026-10 », bouton « Obtenir un devis ». France, 25 à 65 ans et
  plus, ciblage large. 7 € par jour, date de fin de l'ensemble le 30/10 à 23 h 59, soit environ
  7,5 jours et de l'ordre de 50 € au plus (estimation).
- **Contexte du lancement** : Brevo branché et testé de bout en bout le 22/10 (lead Meta de test
  arrivé dans le hub en 16 s, invitation délivrée). Un contrôle avant l'activation, noté plus tôt
  ici, donnait aussi : lead dans le hub en 17 s, notification push « Nouveau lead » en moins d'une
  minute, lien Cal.com rattaché à la fiche, notification « Nouveau RDV », planning Cal.com corrigé
  (il proposait des créneaux dès 3 h du matin). Une première création depuis le hub a échoué :
  Meta refuse le bouton « Nous contacter » avec un formulaire instantané (bouton retiré du hub).
  L'ancienne campagne J K D créée en pause le 21/10 (anciens textes) a été supprimée par Edgar.
- **Autre campagne sur le compte** : `Kleak | TEST BTP | 2026-10-22` (L, M, N), 5 € par jour,
  23 à 55 ans, **en pause, jamais lancée**, avec les anciens textes (« choisissez votre créneau
  d'appel »). Ne pas l'activer pendant le test J K D (les deux se partageraient le compte et
  brouilleraient la lecture).
- **Hypothèse** : inchangée (entrée du 21/10) : remesurer le CPL du compte face à `cplCible`
  (5 €). Angle (preuve, prix, avant / après) en tendance seulement.
- **Chiffres** : aucun encore.
- **Décision** : rien à modifier avant le 26/10 (J+3, `regles.md` section 3), sauf refus ou
  15 € sans lead sur une pub. Point d'étape le 26/10, bilan après la fin le 30/10 (lecture du
  23/10 au 30/10), taux de RDV relu à J+14 (06/11). Campagne BTP décidée au bilan.
- **Leçon** : à écrire au bilan.

## 22/10/2026, textes principaux de J, K, D : email immédiat (Brevo), test prévu, pas lancé

- **Campagne** : `Kleak | Test J K D`, créée en pause le 21/10, pas activée (lecture du 22/10,
  période 22/09 au 21/10 : aucune campagne diffusée, `depenseMois` 0, aucune alerte, lecture
  Meta « ok », aucun avertissement). Brevo branché et testé de bout en bout le 22/10 : le lead
  reçoit dans la seconde un email pour réserver son appel sur Cal.com, puis des relances. La
  règle « pas de promesse de message immédiat » est levée, **pour l'email seulement** (ni appel
  immédiat, ni WhatsApp automatique).
- **Changement** : seule la fin du texte principal change sur J, K et D. « Remplissez le
  formulaire et choisissez votre créneau d'appel. » devient « Remplissez le formulaire et vous
  recevez tout de suite un email pour choisir votre créneau d'appel. » Titres et descriptions
  inchangés. Dépôts : J (`kleak`), K et D (`one-page`), 201, 1 créé et 1 déjà là chacun (le titre
  existant joint au lot). Seul avertissement : textes de plus de 125 caractères (J 218, K 193,
  D 269). L'API agent ne supprime pas : les anciens textes principaux restent dans le hub, à
  supprimer par Edgar. La campagne déjà créée en pause porte les anciens textes : à corriger
  dans le Gestionnaire ou à recréer depuis le hub avant l'activation.
- **Hypothèse** : inchangée. Pas un test de texte : un seul texte par pub.
- **Chiffres** : aucun, rien n'est diffusé.
- **Décision** : textes BTP (L, M, N) laissés tels quels, même fin « choisissez votre créneau
  d'appel », à aligner si Edgar le veut avant leur lancement.
- **Leçon** : aucune sur les performances. Le texte suit le parcours réel du jour de diffusion.

## 22/10/2026, campagne focus BTP, test prévu : REMPLACÉE PAR LP SANS PRIX, NON LANCÉE

> **24/10, décision d'Edgar** : la campagne BTP n'est pas lancée, la campagne « LP sans prix »
> (entrée du 24/10) la remplace. `Kleak | TEST BTP | 2026-10-22` reste en pause. Les 92,40 €
> prévus en novembre ne sont plus engagés. Les créas L, M, N et leurs textes restent dans le
> hub, inutilisés.

> Ne pas lancer avant le bilan du test J K D (lancement prévu vers le 25/10, 7 jours). Ne
> remplace rien dans J K D. **Mise à jour du 22/10** : créas L (`l-demo-artisan`), M
> (`m-15-minutes-chantiers`) et N (`n-devis-artisan-699`) retenues par Edgar, importées dans
> le hub en post et en story (stories contrôlées). Textes validés par Edgar et déposés, offre
> `one-page`, 1 texte, 1 titre, 1 description par pub (201, 3 créés chacun, seul avertissement :
> textes de 222 à 248 caractères). Campagne pas encore créée.
> **22/10, centres d'intérêt** : réglables depuis le hub à la création (liste « Artisans du
> bâtiment », audience estimée affichée). Décision d'Edgar de cibler les artisans par centres
> d'intérêt : le test BTP ne compare donc plus seulement les créas à J K D, le ciblage change
> aussi. Proposition de centres à cocher : Plomberie (construction), Rénovation (construction),
> Maçonnerie, Terrassement, Chauffage central, Pompe à chaleur, Isolation thermique,
> Construction (industrie).
> **22/10, campagne créée en pause** depuis le hub par Edgar, avec les centres d'intérêt
> Plomberie (construction), Rénovation (construction), Maçonnerie, Chauffage central, Pompe à
> chaleur, Construction (industrie). Premier essai refusé par Meta : Terrassement et Isolation
> thermique sont des centres retirés (correctif du hub sur la branche `interets-valides`). Pas
> activée : à activer après le bilan J K D, date de fin de l'ensemble à J+14.
> **23/10, état vérifié dans Meta** : `Kleak | TEST BTP | 2026-10-22`, en pause, jamais lancée,
> 5 € par jour, 23 à 55 ans, anciens textes. J K D lancé le 23/10 (fin le 30/10) : lancement
> BTP au plus tôt après le bilan J K D. Écarts avec ce plan à trancher avec Edgar avant
> l'activation : budget (5 € au lieu de 6,60 €), âge (23 à 55 au lieu de 25 à 65 et plus),
> textes à aligner sur l'email immédiat.

- **Campagne** : `Kleak | BTP One page | AAAA-MM-JJ`, créée en pause depuis le hub. Objectif
  Prospects, formulaire instantané (le même que J K D, ou une copie avec une question métier,
  à trancher par Edgar). **1 ensemble, 3 pubs au plus** (`regles.md`, section 6), les créas
  retenues par Edgar parmi la commande : démo métier sans prix (Garnier Plomberie, démo
  fictive affichée comme telle), « 15 minutes de questionnaire » sans prix, prix fixe One page
  699 €. Post et story, un texte, un titre et une description par pub (comme J K D, pour que
  le hub envoie les deux formats).
- **Ciblage** : France, 25 à 65 ans et plus, audience Advantage+ coupée, placements Advantage+,
  **identique à J K D**, pour que la seule chose qui change soit la créa. Meta ne permet pas de
  viser les métiers du bâtiment de façon fiable (ciblage par intitulé de poste et une partie
  des centres d'intérêt retirés ces dernières années, d'après ce que je sais, pas vérifié
  aujourd'hui sur une source Meta). Le levier est donc la créa et le texte qui nomment le
  métier. Centres d'intérêt possibles (« Bâtiment », « Plomberie », « Artisan »…) : à relever
  par Edgar dans le Gestionnaire avec la taille d'audience estimée, et à garder pour un test
  suivant, un test = une question. Zone : France entière, une région réduirait l'audience sans
  donnée qui le justifie.
- **Formule** : One page 699 €, seule offre citée. Aucune raison chiffrée de pousser
  l'Essentiel (aucune dépense sur le compte au 22/10). Son contenu colle au BTP mot pour mot :
  « services, avis, zone d'intervention, contact ».
- **Hypothèse** : une créa qui nomme le métier amène des leads d'artisans du bâtiment qui
  prennent RDV, à un CPL proche de `cplCible` (5 €). Mesures : CPL de la campagne, taux de RDV,
  part des leads qui sont du bâtiment (seulement si le formulaire pose la question, sinon à
  relever à la main dans le CRM), budgets déclarés sous 699 €.
- **Budget et durée** : 6,60 € par jour pendant 14 jours, date de fin de l'ensemble à J+14
  dans le Gestionnaire, soit 92,40 € au plus, sur les 200 € de novembre. **Seule campagne
  active pendant ces 14 jours** (J K D terminé), sinon les 6,60 € se partagent. Le reste de
  novembre (environ 107 €) se décide au bilan.
- **Critère de fin** (`regles.md`, section 6) : chaque pub au volume minimum, ou 14 jours, ou
  toutes sauf une coupées. Coupures en cours de test : seulement refus ou 15 € sans lead sur
  une pub, pas avant J+3.
- **Ce que le test pourra conclure** (estimation : à 5 € le lead, 92 € donnent de l'ordre de
  18 leads, à 10 € le lead de l'ordre de 9) : le CPL de la campagne BTP dans son ensemble si
  elle dépasse 10 leads, et la part de leads du bâtiment. **Ce qu'il ne pourra pas conclure** :
  quelle créa BTP est la meilleure (environ 6 leads par pub au mieux), ni que le focus BTP fait
  mieux que les créas généralistes (périodes différentes, novembre plus cher) : ce sera une
  tendance.
- **Conditions de déclenchement, lues au bilan J K D** :
  1. CPL J K D ≤ 10 € (2 × `cplCible`) et parcours qui marche (bouton de réservation vu en fin
     de formulaire) : lancer le plan tel quel.
  2. CPL J K D au-dessus de 10 €, ou moins de 3 leads pour 49 € : regarder où ça casse avant
     de lancer. CTR lien correct mais peu de leads par clic : c'est le formulaire, les créas
     BTP n'y changeront rien, corriger le formulaire d'abord. CTR bas sur les trois pubs : c'est
     l'accroche, le plan BTP se lance (c'est justement une autre accroche).
  3. Angle (tendance seulement) : si K (prix) amène le plus de leads ou de RDV, garder la créa
     prix BTP ; si c'est D (téléphone, démo), garder la démo métier ; si c'est J (preuve), en
     parler avec Edgar, il n'existe aucun avis réel d'artisan à citer aujourd'hui.
  4. Budgets déclarés : si la majorité des leads J K D déclare moins de 699 €, revoir la
     question de budget du formulaire avant de lancer.
  5. Capacité (`regles.md`, section 5) : si J K D a déjà rempli le calendrier de production
     d'Edgar, décaler le lancement.
  6. Si une pub J K D est au CPL cible et qu'Edgar veut la garder, l'ajouter comme 3e pub
     témoin dans l'ensemble BTP (2 créas BTP plus le témoin) plutôt qu'ouvrir une 2e campagne.
- **Pistes de textes d'annonce** (pas validées, pas déposées, à reprendre une fois les créas
  choisies) :
  - Démo : « Plombier, électricien, couvreur, maçon : vos clients vous appellent depuis leur
    téléphone. Nous faisons des sites d'une page avec vos services, votre zone d'intervention
    et vos avis. Remplissez le formulaire et choisissez votre créneau d'appel. » (244
    caractères)
  - Temps : « Vous êtes sur les chantiers toute la journée. Pour votre site, vous remplissez un
    questionnaire de 15 minutes et vous nous envoyez vos photos. Nous construisons la page,
    vous la validez. Remplissez le formulaire et choisissez votre créneau d'appel. » (248)
  - Prix : « Votre site d'artisan sur une page coûte 699 €, prix fixe : services, zone
    d'intervention, avis et formulaire de contact. Livraison en 5 jours ouvrés après réception
    de vos contenus et du premier paiement. Remplissez le formulaire et choisissez votre
    créneau d'appel. » (266)
  - Titres : « Site vitrine pour artisans » (26), « Un site d'une page pour votre métier »
    (36), « Votre site d'artisan, 699 € prix fixe » (37, créa prix seulement). Descriptions :
    « Zone d'intervention incluse » (27), « Questionnaire de 15 minutes » (27), « Mentions
    légales, RGPD inclus » (29).
- **Chiffres** : aucun. Lecture du hub du 22/10 (période 22/09 au 21/10) : `depenseMois` 0,
  aucune campagne diffusée, aucune alerte, lecture Meta « ok », aucun avertissement.
- **Décision** : rien dans le Gestionnaire. Edgar lance la commande de créas, choisit, puis
  `media-buyer` écrit et dépose les textes. Lancement après le bilan J K D.
- **Leçon** : aucune encore.

## 21/10/2026, test J K D : un élément de chaque type par pub, test prévu, pas lancé

- **État** : campagne créée **en pause** depuis le hub par Edgar le 21/10. Pas encore activée. Elle n'apparaît pas dans la lecture agent tant qu'elle n'a pas d'impressions.

- **Campagne** : inchangée, `Kleak | Test J K D | <date de création>`, 1 ensemble, 3 pubs (`j-avis-clients`, `k-devis-prix-fixe`, `d-avant-apres-appeler`), 7 € par jour pendant 7 jours.
- **Changement** : chaque pub ne coche qu'**un texte, un titre et une description**. Avec plusieurs éléments, le hub n'envoie que le visuel 4:5, et Edgar veut la story : historiquement, ses formats story marchaient le mieux. Avec un seul élément de chaque type, le hub envoie les deux visuels, avec une règle par emplacement (le 4:5 dans le fil, le 9:16 en story).
  - J : texte « Avant de nous confier votre site internet… », titre « Parlons de votre site internet », description « Noté 4,8/5 sur Google ».
  - K : texte « Votre site vitrine One page coûte 699 €… », titre « Site vitrine One page, 699 € prix fixe », description « Devis valable 30 jours ».
  - D : texte « Un site qui donne envie d'appeler… », titre « Un site qui donne envie d'appeler », description « Facile à contacter sur mobile ».
- **Écarté** : séparer le fil et la story en 2 ensembles, qui couperait les 7 € par jour en deux. Une pub « story seule » dans le même ensemble ne marche pas non plus, parce que les emplacements se règlent sur l'ensemble.
- **Leçon** : aucune encore. Les variantes non retenues ont été supprimées du hub à la demande d'Edgar : il ne reste qu'un texte, un titre et une description par pub.

## 21/10/2026, textes principaux de A et B réécrits courts, test prévu, pas lancé

- **Campagne** : pas encore créée, A et B restent hors du test J K D prévu. Anciens textes
  principaux de A (4) et de B (3) supprimés du hub par Edgar avant le dépôt (ils promettaient
  « vous recevez tout de suite un message »). Nouveaux dépôts : A `a-un-kleak` (offre `kleak`,
  2 textes sans prix, comme le visuel) et B `b-5-jours-699` (offre `one-page`, 2 textes). Un
  titre déjà présent a été joint à chaque lot (le hub exige au moins 1 titre), compté « déjà là ».
- **Hypothèse** : aucune nouvelle. Mêmes règles que J, K, D : 2 à 4 phrases, appel à l'action
  « Remplissez le formulaire et choisissez votre créneau d'appel », délai avec sa condition
  courte, ni prénom, ni TVA, ni engagement.
- **Chiffres** : aucun, rien n'est diffusé (lecture du 21/10, période 21/09 au 20/10 :
  `depenseMois` 0, aucune campagne, aucune alerte, lecture Meta « ok », aucun avertissement).
  Dépôts : A 201 (2 créés, 1 déjà là), B 201 (2 créés, 1 déjà là), aucun refus. Seul
  avertissement : les 4 textes dépassent 125 caractères (219 à 255).
- **Décision** : `regles.md`, section 8, seuil des budgets déclarés « mauvais signe » passé de
  999 € à 699 € (décision d'Edgar du 21/10). Sur A, proposés à la suppression par Edgar : le
  titre « Site vitrine à 999 €, prix fixe » et la description « Prix fixe, 3 pages » (Essentiel,
  hors positionnement One page, et un prix sur une créa sans prix). Titres et descriptions de B
  relus : conformes à la fiche One page.
- **Leçon** : aucune sur les performances.

## 21/10/2026, textes principaux de J, K, D réécrits courts, test prévu, pas lancé

- **Campagne** : pas encore créée (« Kleak | Test J K D », entrée ci-dessous). Anciens textes
  principaux de J, K, D et description « TVA non applicable » de K supprimés du hub avant le
  dépôt. Nouveaux dépôts : J `j-avis-clients` (offre `kleak`, 2 textes), K `k-devis-prix-fixe`
  (offre `one-page`, 2 textes et la description « Prix fixe, 1 page »), D
  `d-avant-apres-appeler` (offre `one-page`, 2 textes). À cocher à la création : sur J 2 textes,
  2 titres, 2 descriptions ; sur K 2, 2, 2 ; sur D 2 textes, 3 titres, 3 descriptions, soit tout
  ce que le hub a pour ces trois créas.
- **Hypothèse** : inchangée. Décisions d'Edgar appliquées : textes de 2 à 4 phrases, une idée,
  un appel à l'action « Remplissez le formulaire et choisissez votre créneau d'appel » (le lead
  choisit son créneau par le bouton de fin de formulaire, Brevo pas branché), maintenance sans
  engagement (préavis de 2 mois), aucune mention de la TVA, aucun prénom, Kleak parle en « nous ».
- **Chiffres** : aucun, rien n'est diffusé (`depenseMois` 0, aucune campagne, aucune alerte,
  lecture Meta « ok », aucun avertissement de lecture). Dépôts : J 201 (2 créés, 4 déjà là), K
  201 (3 créés, 3 déjà là), D 201 (2 créés, 6 déjà là), aucun refus, citation de Laura Dias
  acceptée. Seul avertissement : les 6 textes dépassent 125 caractères (155 à 246), à cause de
  l'appel à l'action et, sur D, de la condition du délai.
- **Décision** : la vérification Brevo de l'entrée précédente devient : vérifier avec un lead de
  test que le bouton de réservation s'affiche à la fin du formulaire. Les textes de A et B
  promettent encore « vous recevez tout de suite un message » : à réécrire avant toute diffusion
  de A ou B. Titres et descriptions restants de J, K, D relus : aucun ne cite l'engagement, la
  TVA ni un prénom.
- **Leçon** : aucune sur les performances. Un texte d'annonce ne promet que ce que le parcours
  fait le jour de la diffusion (message automatique non branché).

## 21/10/2026, test de 50 € des créas J, K, D, test prévu, pas lancé

- **Campagne** : à créer en pause depuis le hub, nom « Kleak | Test J K D | AAAA-MM-JJ ».
  Objectif Prospects, formulaire instantané « Kleak | Appel découverte | 2026-10 ». Un ensemble
  (France, 25 à 65 ans et plus, audience Advantage+ coupée, placements Advantage+), trois pubs :
  J `j-avis-clients` (preuve, sans prix), K `k-devis-prix-fixe` (prix, One page 699 €), D
  `d-avant-apres-appeler` (avant / après, One page 699 €). A et B hors test (B ferait doublon
  avec K). Éléments à cocher : tous ceux de J (2 textes, 2 titres, 2 descriptions), de K (2, 2, 2)
  et de D (2 textes, 3 titres, 3 descriptions), relus le 21/10 : aucun ne cite une autre offre
  que celle du visuel. Visuel 4:5 seul (plusieurs textes par pub), story non utilisée.
- **Hypothèse** : remesurer le CPL du compte face à `cplCible` (5 €) avant d'engager le reste
  des 200 €. Question secondaire, en tendance seulement : quel angle (preuve, prix, avant /
  après) amène des leads qui prennent RDV. Budget 7 € par jour, date de fin de l'ensemble à
  J+7 dans le Gestionnaire (49 € au plus). Critère de fin : 49 € dépensés ou date de fin.
- **Chiffres** : aucun, rien n'est diffusé (lecture du 21/10, période 21/09 au 20/10 :
  `depenseMois` 0, aucune campagne, aucune alerte, lecture Meta « ok », aucun avertissement).
  Hub conforme à l'état annoncé : `b-7-jours-999` et anciens éléments Essentiel de D absents.
- **Décision** : avant d'activer, vérifier avec un lead de test que le message pour réserver
  l'appel part bien (Brevo encore en attente au 21/10, tous les textes le promettent). Pendant
  les 7 jours, ne rien modifier sauf refus ou dépense sans lead (15 € sans lead sur une pub,
  pas avant J+3). Bilan à la fin, taux de RDV relu à J+14.
- **Leçon** : à écrire au bilan. Prévu d'avance : à 5 € par lead (estimation), 49 € donnent
  une dizaine de leads pour les trois pubs, 3 ou 4 par pub au mieux, et Meta ne répartit pas la
  dépense à parts égales. Le test pourra dire si le CPL du compte est proche de la cible ; il ne
  pourra désigner ni angle gagnant ni texte gagnant (`regles.md`, section 2).

## 21/10/2026, textes déposés pour J, K, B One page et D One page, test prévu, pas lancé

- **Campagne** : pas encore créée. Textes déposés dans le hub : J `j-avis-clients` (offre
  `kleak`, aucun prix : 2 textes, 2 titres, 2 descriptions), K `k-devis-prix-fixe` (offre
  `one-page` : 2 textes, 2 titres, 2 descriptions), B `b-5-jours-699` (nouvelle créa, offre
  `one-page` : 3 textes, 3 titres, 3 descriptions) et D `d-avant-apres-appeler` (visuel passé au
  One page, offre `one-page` : 2 textes, 3 titres, 3 descriptions dont 3 déjà présents).
- **Hypothèse** : aucune nouvelle. Les variantes de texte ne sont pas un test (volume
  `bilanMinLeads` hors d'atteinte par élément). Structure et créas du prochain test à décider
  avec Edgar : A, J, K, B, D ensemble à 6,60 € par jour disperserait le budget.
- **Chiffres** : aucun, rien n'est diffusé (`depenseMois` 0, aucune campagne, aucune alerte,
  lecture Meta « ok », aucun avertissement de lecture). Dépôts : J 201 (6 créés), K 201
  (6 créés), B 201 (9 créés), D 201 (5 créés, 3 déjà là). Aucun refus, citation de Laura Dias
  acceptée sur B. Seul avertissement : tous les textes principaux dépassent 125 caractères.
- **Décision** : à la création de la campagne, sur D, décocher les 3 anciens textes
  (Essentiel 999 €, 3 pages, 7 jours), les titres « Votre site vitrine dès 999 € » et « Votre
  site refait, 999 € prix fixe », la description « Prix fixe, 3 pages ». Ne plus utiliser les
  textes de `b-7-jours-999` (créa supprimée). Les textes de A citent toujours l'Essentiel à
  999 € : cohérent avec A (aucun prix dans l'image), mais à trancher si le test doit porter sur
  une seule offre.
- **Leçon** : aucune sur les performances. Les textes de D dépendaient du prix de la pastille :
  quand un visuel change d'offre, ses textes déposés sont à revoir le jour même.

## 20/10/2026, textes déposés pour A, B, D (test de 50 € prévu, pas lancé)

- **Campagne** : pas encore créée. Textes déposés dans le hub (offre `essentiel`) pour A
  `a-un-kleak` (4 textes, 4 titres, 3 descriptions), B `b-7-jours-999` (3 textes et 2 titres
  nouveaux, « Tout pris en charge » déjà présent, 2 descriptions) et D `d-avant-apres-appeler`
  (3 textes, 3 titres, 3 descriptions). Plusieurs textes par pub : visuel 4:5 seul, pas de story
  dédiée. Pas de seconde variante écrite par Edgar pour D : texte validé plus deux ouvertures.
- **Hypothèse** : inchangée (entrée « test prévu » ci-dessous). Les variantes de texte ne sont
  pas un test : à 50 €, aucun élément n'atteindra `bilanMinLeads`.
- **Chiffres** : aucun, rien n'est diffusé. Dépôts : A 201 (11 créés), B 201 (7 créés, 1 déjà
  là), D 201 (9 créés), aucun refus. Seul avertissement : textes principaux de plus de 125
  caractères (coupés après « Voir plus »), voulus longs par Edgar. Citation de Laura Dias acceptée
  par le hub.
- **Décision** : à la création de la campagne, décocher sur B les deux textes migrés, « Site
  complet 7 j » et « Sans effort de votre part » (délai sans condition, contenu et hébergement
  présentés comme inclus dans les 999 €, promesse trop forte). Description de B ramenée à
  « Mentions légales, RGPD inclus » (31 caractères refusés). Sur D, décocher aussi le texte 3
  (« Votre site date un peu ? On le refait… ») : redite « refait » et « clair » avec la phrase
  suivante, décision d'Edgar du 20/10. D part avec 2 textes.
- **Leçon** : aucune sur les performances. Le hub accepte un délai sans sa condition et
  l'hébergement attribué au prix du site (textes migrés de B) : la relecture contre la fiche
  offre reste à faire par l'agent.

## 20/10/2026, test de 50 € des créas A, B, D, test prévu, pas lancé

- **Campagne** : pas encore créée. Le compte « Kleak Pub » ne contient que les campagnes de mars
  2025, en pause, et la campagne de test de 1 € du hub. Prévu : une campagne Prospects avec
  formulaire instantané, un ensemble, trois pubs : A `a-un-kleak` (marque, « on s'occupe de
  tout », 4,8/5 Google), B `b-7-jours-999` (offre, 999 € en 7 jours, avis Laura Dias), D
  `d-avant-apres-appeler` (avant / après, « un site qui donne envie d'appeler »). Textes dans
  `livrables/creas-meta/TEXTES-ANNONCES.md`, à déposer dans le hub au premier mode PRÉPARER.
- **Hypothèse** : remesurer le coût par lead sur le nouveau compte avant d'engager le reste des
  200 € (`context/CONTEXT.md`, section Acquisition). Cible 5 € par lead ; l'ancien compte faisait
  2 € il y a un an, et novembre est plus cher. Question secondaire : quel angle amène des leads
  qui prennent rendez-vous. Durée prévue : 5 à 7 jours. Critère de fin : 50 € dépensés.
- **Chiffres** : aucun, le test n'a pas commencé.
- **Décision** : rien pour l'instant. Avant le lancement : déposer les textes de A, B, D dans le
  hub, faire trancher à Edgar le texte principal de D, créer la campagne en pause depuis le hub.
- **Leçon** : à écrire au bilan. Prévu d'avance : à 5 € par lead, 50 € donnent une dizaine de
  leads pour les trois pubs ensemble, soit 3 ou 4 par pub. Le test pourra dire si le CPL du
  compte est proche de la cible ; il ne pourra pas désigner un angle gagnant (volume minimum de
  `regles.md`, section 2, non atteint par pub).
