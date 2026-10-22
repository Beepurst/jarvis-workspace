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

## 22/10/2026, campagne focus BTP, test prévu : PRÉPARÉE, À LANCER APRÈS J K D

> Ne pas lancer avant le bilan du test J K D (lancement prévu vers le 25/10, 7 jours). Ne
> remplace rien dans J K D. **Mise à jour du 22/10** : créas L (`l-demo-artisan`), M
> (`m-15-minutes-chantiers`) et N (`n-devis-artisan-699`) retenues par Edgar, importées dans
> le hub en post et en story (stories contrôlées). Textes validés par Edgar et déposés, offre
> `one-page`, 1 texte, 1 titre, 1 description par pub (201, 3 créés chacun, seul avertissement :
> textes de 222 à 248 caractères). Campagne pas encore créée.

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
