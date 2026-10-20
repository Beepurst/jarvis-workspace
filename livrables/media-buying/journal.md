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
  « Mentions légales, RGPD inclus » (31 caractères refusés).
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
