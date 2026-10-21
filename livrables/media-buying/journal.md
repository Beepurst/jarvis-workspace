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
