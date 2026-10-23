# Audit copywriting de kleakagency.fr

> Lu le 22/10/2026 sur le site publié (HTML de Framer et rendu réel en 390 × 844 et 1440 × 900).
> Pages : accueil, /pricing, /rdv, /création-de-site-framer, /seo, /programme-apporteur-daffaires.
> Comparé à `livrables/offre/fiche-offre.md`, `context/CONTEXT.md`, au journal media buying
> (test J K D) et aux créas J, K, D. Les textes d'annonce J K D sont dans le hub, je ne les ai pas
> lus. Aucune modification faite.

## Résumé

1. **Le site vend encore l'ancienne agence Framer « startup ».** Aucun prix, aucun délai, aucun mot pour les PME ou les artisans sur l'accueil. Le visiteur qui arrive d'une pub One page 699 € ne retrouve rien de la pub.
2. **Deux faux avis de modèle sont visibles sur ordinateur** (« Olivia Bennett, Product Manager », « Marcus Reed, Crypto Analyst », en anglais, sur l'investissement). Ils ruinent la crédibilité et posent un problème légal (avis non authentiques).
3. **La preuve qui sert de pub n'est pas sur le site** : « 4,8/5 sur Google » n'apparaît nulle part, alors que la créa J repose dessus.
4. **Promesses et chiffres à risque** : « 1ère Agence FRAMER de FRANCE », « remboursement intégral, sans conditions cachées » (page /seo), « 30 ont déjà rejoint » (apporteurs), statistiques sans source, logo LCL. Rien de cela n'est dans la fiche offre.
5. **Les boutons sont cohérents (tous vers /rdv) mais mal nommés** (« Créer mon site » mène à un calendrier). Point technique lié : **`/calendly` renvoie une page 404** et le hub compte la réservation sur `/calendly` (`RESERVATION` dans `src/lib/analytics/ga4-page.ts`), donc l'étape « page de réservation vue » restera à zéro tant que ce n'est pas aligné sur `/rdv`.

---

## Ce que voit un visiteur mobile venant d'une pub One page 699 €

Premier écran sur un iPhone (390 × 844) :

- Pastille « Agence FRAMER »
- Titre « Vous méritez un site web qui captive, convertit et performe »
- « Découvrez comment notre agence Framer transforme vos idées en site web captivant »
- Bouton « Créer mon site »
- Le bandeau cookies couvre le bas de l'écran.

Le test des 5 secondes :

| Question | Réponse sur le site | Verdict |
|---|---|---|
| Ce que fait Kleak | « site web », noyé dans une formule | Moyen |
| Pour qui | Personne. « Framer » ne parle pas à un artisan | Raté |
| À quel prix | Aucun prix sur tout le site indexé (la seule grille, /pricing, est en noindex, hors menu, et affiche 740 €) | Raté |
| En combien de temps | Rien | Raté |
| Quoi faire ensuite | Un bouton, mais son libellé ne dit pas qu'on réserve un appel | Moyen |
| Preuve | Logos défilants, puis réalisations. Pas de note Google | Moyen |

Cohérence pub vers site :

| Dans la pub | Sur le site |
|---|---|
| One page 699 €, prix fixe (K, D) | Aucun prix. /pricing : « Site One Page 740€ » |
| 5 jours ouvrés (D) | Aucun délai |
| 4,8/5 sur Google (J) | Absent |
| Avis de Laura Dias (J) | Présent (avec les fautes d'origine) |
| Avant / après, « un site qui donne envie d'appeler » (D) | Accueil sur « captive, convertit, performe », animations, SEO |
| Paiement en une fois, maintenance en option (K) | /pricing : « Paiement sur 12 mois » |

---

## Problèmes classés par impact sur la prise de rendez-vous

### Critique

| # | Page, emplacement | Problème |
|---|---|---|
| C1 | Accueil, premier écran | Ni prix, ni délai, ni cible. Le message de la pub est perdu à l'arrivée. |
| C2 | Accueil, « Ce que nos clients disent de nous », version ordinateur | Deux avis de modèle visibles : « Olivia Bennett, Product Manager » et « Marcus Reed, Crypto Analyst », en anglais. Faux avis visibles = perte de confiance immédiate et risque légal. |
| C3 | Tout le site | « 4,8/5 sur Google » absent alors que la pub J le met en avant. Le visiteur qui vient vérifier ne trouve pas la preuve. Lien vers la fiche Google et nombre d'avis : à fournir par Edgar. |
| C4 | /pricing (noindex, hors menu, mais en ligne) | Prix et conditions faux par rapport à l'offre : « 740€ », « 1690€ + 490€/page supplémentaire », « Paiement sur 12 mois », « 1 mois de maintenance offert », « Idéal pour : startups, produits en pré-lancement ». Si le lien circule, il contredit la pub et le devis. |
| C5 | /seo, bloc sous « Boostez votre visibilité avec nos articles » | « nous vous offrons un remboursement intégral, sans conditions cachées » : garantie absente de la fiche offre et des CGV, opposable par un client. |
| C6 | Pied de page /pricing, /création-de-site-framer, /seo | « 1ère Agence FRAMER de FRANCE » et « Paris, FRANCE » : affirmation invérifiable (pratique commerciale trompeuse possible), et l'agence est à Cergy. |
| C7 | Mesure (hors texte) | `/calendly` est en 404, tous les boutons vont sur `/rdv`, le hub compte `/calendly`. Le funnel du test J K D sera faux. Corriger `RESERVATION` dans le hub (ou recréer `/calendly`), et mettre à jour `CONTEXT.md` qui parle encore de `/calendly`. |

### Important

| # | Page, emplacement | Problème |
|---|---|---|
| I1 | Tous les boutons : « Créer mon site », « On en parle », « Passer à la vitesse supérieure », « Réserver un appel gratuit » | Quatre libellés pour la même action. « Créer mon site » promet une création, on tombe sur un calendrier. |
| I2 | Accueil, « Nos services » (Landing Page, Site vitrine, Site E-commerce, Blog) | Ancienne offre. L'e-commerce est hors offre (fiche : « boutique en ligne… sur devis »). Les 3 formules et leurs prix n'apparaissent nulle part. |
| I3 | Accueil, « Un site ultra-rapide et fluide » | Phrase en anglais visible sur téléphone : « Our platform consistently outperforms competitors in speed and efficiency. » |
| I4 | Accueil, « Notre processus pour créer votre site qui convertit » | Trois étapes vagues (« Design & Conception », « Développement », « Vous convertissez ») au lieu du déroulé réel de la fiche offre (appel, devis, questionnaire, planche, site, mise en ligne). |
| I5 | Accueil, « Pourquoi choisir KLEAK fait toute la différence » | Comparatif « Autres Agences / Avec KLEAK » générique, sans aucune objection d'artisan traitée : photos, maintenance, ce qui est compris, paiement en 6 fois, à qui appartient le site. |
| I6 | Accueil, titre, sous-titre, sections | Jargon et mots creux : « captive, convertit et performe » (triplet), « propulser », « booster », « Responsive parfait », « Taux de conversion optimisé », « Un site conçu pour vendre, pas simplement pour exister » (phrase miroir). |
| I7 | Accueil et /rdv, CTA final : « Join the future », « Prêt à propulser votre site au niveau supérieur ? », « Ils nous font confiance – rejoignez-les et transformez votre projet !` » | Anglais, formule creuse, accent grave parasite à la fin. |
| I8 | /rdv, en-tête | « Vous avez une idée en tête… concrétiser vos ambitions » ne rappelle ni la durée de l'appel ni ce qu'on y gagne. L'encart Cal.com, lui, le dit bien (« 30 minutes… formule, délai, prix, sans engagement »). Le RDV indique « Google Meet » (déjà noté dans CONTEXT : passer à Cal Video). |
| I9 | Accueil, bandeau de logos | « Logo LCL » apparaît 4 fois. Si LCL n'a jamais été client de Kleak, à retirer (à vérifier par Edgar). Aucun avis de LCL sur le site. |
| I10 | Tout le site | Aucun téléphone ni zone visibles hors mentions légales (06 95 11 58 14) et WhatsApp de la page apporteurs. Un artisan qui vérifie veut voir un numéro. À confirmer par Edgar (numéro « agence » encore listé à définir dans CONTEXT). |
| I11 | Accueil, `<title>` et description (aperçu Google et partage) | « Création de Sites Web Performants \| Agence Kleak \| Expert Framer » / « Des sites web qui captent, convertissent et performent… ». Parle aux startups, pas aux PME. |

### Secondaire

| # | Page, emplacement | Problème |
|---|---|---|
| S1 | Pied de page, toutes pages | Lien « Noël » vers l'accueil, « © 2025 ». |
| S2 | /création-de-site-framer | Fautes : « Ils sont passé par FRAMER », « À qui s'adressent-ont ? », « Join the futur », « Demarquez-vous », deux H1. |
| S3 | /seo | « Indéxation », « AHREF », « 8x plus de clics que le SEA » et autres chiffres sans source. |
| S4 | Accueil et /création-de-site-framer | Statistiques sans source : « 80% du trafic vient du mobile », « 40% des utilisateurs abandonnent… », « 1s de retard = 7% de conversions en moins ». Source à fournir ou à retirer. |
| S5 | /programme-apporteur-daffaires | « 30 Ont déjà rejoints » (compteur invérifiable, faute), exemple « pour un site à 5 000€ HT » (hors offre, et TVA non applicable), « Commission fixe de 15% garantie ». Page hors parcours pub, à revoir plus tard. |
| S6 | /pricing | « Tout ce qui est dans l'offre site 3 pages » sous une carte « Site 4 Pages ». FAQ qui ne parle que de Framer. |
| S7 | Avis clients | « il ont su… sans aucun soucis :) » : la créa J cite une version corrigée. Demander à Laura Dias si on peut corriger l'orthographe sur le site, sinon laisser tel quel. |
| S8 | Accueil, « Nos Réalisations » | Paragraphe de 4 lignes sans information (« aventure unique… rigueur et passion »). Les captures n'ont pas de légende métier (ex. « Accueil Sénior Assistance, aide à domicile »). Deux images ont un alt faux (Omma Baudimont en « Céline Mestre », ALB Solutions pointe vers cynker.fr). |

---

## Les 10 réécritures les plus rentables

Textes prêts à coller. Chiffres et conditions repris de la fiche offre. Rien n'est inventé : ce qui manque est marqué « à fournir par Edgar ».

### 1. Accueil, premier écran (C1, I6)

**Actuel**
- Pastille : « Agence FRAMER »
- H1 : « Vous méritez un site web qui captive, convertit et performe »
- Sous-titre : « Découvrez comment notre agence Framer transforme vos idées en site web captivant »
- Bouton : « Créer mon site »

**Problème** : ni cible, ni prix, ni délai. Le visiteur de la pub 699 € ne se reconnaît pas.

**Proposé**
- Pastille : `Sites internet pour les entreprises et les artisans`
- H1 : `Votre site internet à 699 €, en ligne en 5 jours`
- Sous-titre : `Une page claire et lisible sur téléphone, avec vos services, vos avis, votre zone et un formulaire qui arrive dans votre boîte mail. Mentions légales et RGPD compris. Prix fixe.`
- Bouton : `Réserver un appel gratuit (30 min)`
- Sous le bouton, en petit : `Noté 4,8/5 sur Google · Paiement possible en 6 fois sans frais`
- Renvoi en bas de la section : `5 jours ouvrés après réception de vos contenus et du premier paiement. Formule One page.`

La note Google doit être cliquable vers la fiche (lien à fournir par Edgar).

### 2. Accueil, avis clients (C2, C3)

**Actuel** : cartes « Olivia Bennett, Product Manager, The platform gave me clarity and confidence in managing my personal investments… » et « Marcus Reed, Crypto Analyst, The AI insights helped me balance risk… » ; titre « Ce que nos clients disent de nous » ; intro « Nos clients sont au cœur de notre démarche. Découvrez leurs retours et expériences après avoir fait confiance à notre expertise pour propulser leur présence en ligne. »

**Problème** : deux faux avis visibles sur ordinateur, aucune note Google, intro creuse.

**Proposé**
- Supprimer les cartes Olivia Bennett et Marcus Reed (vérifier aussi la version tablette).
- Titre : `Ce que disent nos clients`
- Intro : `Noté 4,8/5 sur Google. Voici quelques avis laissés par les entreprises dont nous avons fait le site.`
- Lien sous les cartes : `Lire tous les avis sur Google` (lien à fournir par Edgar).
- Remonter cette section juste après le premier écran sur mobile : c'est ce que vient vérifier le visiteur de la pub J.

### 3. Tous les boutons (I1)

**Actuel** : « Créer mon site » (menu et sections), « On en parle » (/pricing), « Passer à la vitesse supérieure » (CTA final), « Réserver un appel gratuit » (/rdv).

**Problème** : quatre libellés pour une seule action, et le principal promet autre chose qu'un rendez-vous.

**Proposé** : un seul libellé partout, `Réserver un appel gratuit`. Dans le menu sur mobile, où la place manque : `Prendre rendez-vous`.

### 4. Accueil, « Nos services » remplacé par les formules (I2)

**Actuel** : « Nos services. Nous vous accompagnons avec des solutions de création, d'optimisation SEO, et de performance sur Framer pour propulser votre site au sommet des standards web. » puis quatre cartes « Landing Page », « Site vitrine », « Site E-commerce », « Blog ».

**Problème** : ancienne offre, e-commerce hors offre, aucun prix.

**Proposé**
- Titre : `Trois formules, prix fixe`
- Intro : `Le prix est fixé avant de commencer. Il comprend la mise en page à vos couleurs, l'affichage sur téléphone, le formulaire de contact, les mentions légales et le RGPD, et la mise en ligne sur votre nom de domaine.`
- Carte 1 : `One page · 699 €` / `1 page qui réunit tout : présentation, services, avis, zone d'intervention, contact. 1 série de retouches. Livré en 5 jours ouvrés.` / `ou 6 × 116,50 €`
- Carte 2 : `Essentiel · 999 €` / `3 pages : Accueil, Services, Contact. Votre fiche Google optimisée. 1 série de retouches. Livré en 7 jours ouvrés.` / `ou 6 × 166,50 €`
- Carte 3 : `Pro · 1 800 €` / `5 pages, design personnalisé, référencement local, mesure des visites et des demandes, 30 minutes de prise en main. 2 séries de retouches. Livré en 10 jours ouvrés.` / `ou 6 × 300 €`
- Sous les cartes : `Délais comptés après réception de vos contenus et du premier paiement. Maintenance en option à partir de 49 € par mois, sans engagement.`
- Bouton : `Réserver un appel gratuit`

### 5. /pricing (C4)

**Actuel** : « Site One Page 740€ », « Idéal pour : startups, produits en pré-lancement, événements », « Site 4 Pages 1690€ + 490€/page supplémentaire », « Paiement sur 12 mois », « Site Sur-Mesure, Sur devis », « 1 mois de maintenance offert ».

**Problème** : tout est faux par rapport à l'offre actuelle.

**Proposé** : deux options, au choix d'Edgar.
- Rapide : dépublier /pricing (la page n'est pas dans le menu) le temps de la refaire.
- Mieux : la refaire avec le bloc n° 4, le tableau « Payer en une fois ou en 6 fois » et le tableau maintenance de la fiche offre. Titre : `Nos prix`. Intro : `Trois formules à prix fixe. Le prix indiqué est celui que vous payez, sans frais ajoutés.` Interrupteur : `Paiement en une fois` / `Paiement en 6 fois sans frais` (et non « sur 12 mois »).

### 6. Accueil, « Notre processus » (I4)

**Actuel** : « Notre processus pour créer votre site qui convertit » ; « Design & Conception, Création d'une expérience utilisateur unique adaptée à votre audience cible » ; « Développement, Intégration sur FRAMER pour un site performant sur tous les appareils » ; « Vous convertissez, Croissance rapide de votre business grâce à un taux de conversion optimisé ».

**Problème** : jargon, aucune information sur ce que le client doit faire ni sur le délai.

**Proposé**
- Titre : `Comment ça se passe`
- `1. Un appel de 30 minutes. On parle de votre activité et de ce que vous attendez du site.`
- `2. Un devis à prix fixe, valable 30 jours.`
- `3. Un questionnaire de 15 minutes. Vous y déposez votre logo, vos photos et vos textes, et vous nous dites ce que vous aimez.`
- `4. Une planche de direction sous 48 heures : structure, couleurs, polices, photos. Vous validez avant qu'on construise.`
- `5. Votre site complet à la date annoncée, à regarder sur votre téléphone, puis les retouches prévues.`
- `6. Mise en ligne sur votre nom de domaine.`

### 7. Accueil, bloc « Un site conçu pour vendre » (I3, I6)

**Actuel** : H2 « Un site conçu pour vendre, pas simplement pour exister. » ; « Nous concevons des sites web qui captivent dès la première seconde. Grâce à un design interactif, un message percutant et une expérience utilisateur fluide. » ; carte « Un site ultra-rapide et fluide » avec « Our platform consistently outperforms competitors in speed and efficiency. » ; « Un SEO puissant et durable… booster votre position sur Google » ; « 80% du trafic vient du mobile » ; « Un copywriting qui convertit ».

**Problème** : anglais visible sur mobile, phrase miroir, chiffre sans source, « copywriting » promet une rédaction qui est en option sur devis.

**Proposé**
- H2 : `Ce qui est compris dans chaque site`
- Carte 1 : `Rapide sur téléphone` / `Images allégées et chargement surveillé. La plupart de vos visiteurs arrivent depuis leur téléphone.`
- Carte 2 : `Lisible par Google` / `Titre et description de chaque page, structure que Google sait lire.`
- Carte 3 : `Vos coordonnées visibles` / `Téléphone, zone d'intervention et formulaire de contact. Chaque demande arrive dans votre boîte mail.`
- Carte 4 (remplace « copywriting ») : `Conforme à la loi` / `Mentions légales, bandeau cookies et RGPD, déjà en place à la mise en ligne.`
- Garder les scores PageSpeed seulement s'ils sont ceux d'un site Kleak réel, avec son nom (à fournir par Edgar).

### 8. Accueil, comparatif « Pourquoi choisir KLEAK » remplacé par les questions des artisans (I5)

**Actuel** : « Pourquoi choisir KLEAK fait toute la différence. Découvrez concrètement ce qui distingue KLEAK des autres agences et pourquoi nos clients obtiennent des résultats exceptionnels. » puis listes « Autres Agences » / « Avec KLEAK ».

**Problème** : générique, et « résultats exceptionnels » sans preuve. Les vraies questions d'un patron restent sans réponse.

**Proposé** (FAQ courte, réponses tirées de la fiche offre)
- Titre : `Vos questions avant de nous appeler`
- `Combien ça coûte, au total ?` / `699 €, 999 € ou 1 800 € selon la formule, prix fixe. Le prix indiqué est celui que vous payez. Vous pouvez payer en une fois (la moitié à la signature, le reste avant la mise en ligne) ou en 6 fois sans frais.`
- `Je n'ai pas de photos ni de textes.` / `Les contenus sont fournis par vous : logo, photos, textes. Le questionnaire vous guide. La rédaction des textes est possible en option, sur devis. Si vous manquez de photos, parlez-en pendant l'appel.`
- `C'est quoi la maintenance ?` / `L'hébergement, les mises à jour, la surveillance du site, de petites modifications chaque mois (un texte, une photo, un horaire) et un rapport mensuel. 49 € par mois pour le One page, 90 € pour les autres formules. Sans engagement, préavis de 2 mois.`
- `Le site m'appartient-il ?` / `Oui, au paiement du solde. En 6 fois, au dernier versement. Le nom de domaine est à votre nom.`
- `Et si je veux plus de pages plus tard ?` / `Vous passez du One page à l'Essentiel en payant seulement la différence.`
- `Qu'est-ce qui n'est pas compris ?` / `Boutique en ligne, espace client, prise de rendez-vous en ligne, traduction et photos professionnelles. C'est possible, sur devis.`

### 9. CTA final, accueil et autres pages (I7)

**Actuel** : « Join the future » ; « Prêt à propulser votre site au niveau supérieur ? » ; « Découvrez comment notre expertise sur Framer peut transformer votre présence en ligne. » ; bouton « Passer à la vitesse supérieure ».

**Proposé**
- Supprimer « Join the future ».
- H2 : `Parlons de votre site`
- Texte : `Un appel de 30 minutes, gratuit et sans engagement. Vous repartez avec une recommandation de formule, un délai et un prix.`
- Bouton : `Réserver un appel gratuit`
- Ligne sous le bouton : `Ou appelez-nous au 06 95 11 58 14` (numéro des mentions légales, à confirmer par Edgar).

### 10. /rdv, en-tête et bloc de réassurance (I8, I7)

**Actuel** : « Discutons de votre projet » ; « Vous avez une idée en tête ou un projet en cours ? Prenons le temps d'échanger ensemble pour concrétiser vos ambitions. » ; plus bas « Join the future » et « Ils nous font confiance – rejoignez-les et transformez votre projet !` ».

**Proposé**
- H1 : `Réservez votre appel de 30 minutes`
- Texte : `Choisissez un créneau. On parle de votre activité et de votre site, et vous repartez avec une formule, un délai et un prix. C'est gratuit et sans engagement.`
- Supprimer « Join the future ».
- H2 du bloc logos : `Ils nous ont confié leur site`
- Sous l'avis de Méliné Grelet : `Noté 4,8/5 sur Google` (lien à fournir par Edgar).

---

## À corriger en dehors des 10 réécritures

- **Pied de page** : retirer « 1ère Agence FRAMER de FRANCE », remplacer « Paris, FRANCE » par la vraie ville, retirer le lien « Noël », passer à « © 2026 ».
- **/seo** : retirer la phrase sur le « remboursement intégral, sans conditions cachées », ou l'écrire dans les CGV si Edgar la veut vraiment.
- **Titre et description de l'accueil** (aperçu Google et partage) : `Création de site internet pour PME et artisans, dès 699 € | Kleak Agency` et `Site internet à prix fixe, livré en 5 à 10 jours ouvrés, lisible sur téléphone, mentions légales et RGPD compris. Paiement possible en 6 fois sans frais.`
- **Logos** : vérifier LCL et les doublons du bandeau.
- **Hub** : passer `RESERVATION.chemins` de `["/calendly"]` à `["/rdv"]` avant le lancement du test J K D, sinon l'étape de réservation reste vide.
