# Parcours client : de la pub à la livraison

> Analyse du 21/10/2026, faite à partir de ce qui existe vraiment : textes et règles des pubs
> (`media-buying/`), formulaire instantané, CRM du hub (code de production), fiche offre et note
> interne, questionnaire de cadrage, checklist qualité, test Garnier Plomberie, business plan
> closing. Aucun client n'est encore passé par ce parcours : les taux cités sont les **repères
> d'il y a un an** (ancien compte) ou des **hypothèses**, jamais des mesures.

---

## 1. Le parcours tel qu'il est aujourd'hui

| # | Étape | Ce qui existe | État |
|---|---|---|---|
| 1 | Pub Meta | J, K, D en post et story, textes déposés, campagne créée en pause | Prêt |
| 2 | Formulaire instantané | « Kleak, Appel découverte, 2026-10 » : site existant, budget, entreprise, coordonnées, bouton Cal.com en fin | Prêt, lead de test à refaire |
| 3 | Lead dans le CRM | Meta vers Google Sheet vers Apps Script vers hub, étape « Nouveau lead » | Marche (lead test du 21/10) |
| 4 | Prise de RDV | Bouton Cal.com en fin de formulaire. Relances email J+1, J+3, J+7 codées mais **Brevo bloqué** (DMARC IONOS) | **Trou** |
| 5 | Appel découverte | 30 min annoncées. Script et fiche de RDV en cours | **Manque** |
| 6 | Devis et signature | Étape « Devis envoyé » dans le pipeline, module Ventes, Stripe en lecture seule. Pas de modèle de devis, pas de CGV, pas de téléphone sur la fiche | **Manque** |
| 7 | Premier paiement | Stripe. Paiement en 6 fois prévu en prélèvement | À monter |
| 8 | Questionnaire et contenus | Questionnaire écrit (Essentiel et Pro), pas de colonne One page. Le brief du hub n'a que 10 champs libres | **Écrit, pas construit** |
| 9 | Planche de direction | Modèle HTML, testé sur Garnier (1 aller-retour) | Prêt |
| 10 | Construction | `/site` et prompts de la bibliothèque. Test Garnier : 2 h 50, dont 1 h 30 perdue sur les délais de l'API Framer, page non publiée | **Fragile** |
| 11 | Retouches, contrôle | Checklist qualité, PageSpeed | Prêt |
| 12 | Mise en ligne | Domaine du client, plan Framer sur le compte Kleak. Procédure de transfert non vérifiée | À vérifier |
| 13 | Solde, facture | Stripe. Factures conformes et module factures à faire | **Manque** |
| 14 | Après livraison | Maintenance, rapport mensuel (Orbikal en idée). Rien sur les avis ni les cas clients | **Manque** |

Le haut du parcours (1 à 3) est très outillé. Ce qui vient après le lead, au moment où l'argent
se décide, est le moins prêt.

---

## 2. Ce que le parcours doit produire

L'objectif reste **1 Pro et 1 Essentiel signés d'ici mi-novembre**, dans 25 jours.

Ordre de grandeur, avec les repères d'il y a un an (1 RDV pour 3 leads, 1 signature pour 3 à 4
RDV) et le CPL cible de 5 € :

| | Test de 49 € | 200 € par mois |
|---|---|---|
| Leads | environ 10 | environ 40 |
| RDV | environ 3 | environ 13 |
| Signatures | 0 ou 1 | 3 ou 4 |

Avec ces repères, il n'y a pas de marge. Un lead qui reste sans réponse ou un RDV où la personne
ne vient pas, c'est déjà un tiers d'une signature perdu. **Les points 3 à 6 du parcours pèsent
plus que le CPL.**

**Le mix des offres :** les pubs vendent maintenant le One page à 699 €. Si la plupart des
signatures sont des One page, il en faut environ 4 par mois pour atteindre 2 550 €, soit environ
45 leads. C'est tout le budget, au repère d'il y a un an. Proposer l'Essentiel pendant l'appel
n'est donc pas un bonus : l'objectif en dépend. Le formulaire demande déjà le budget, et c'est
ce qui permet de préparer chaque appel.

---

## 3. Les faiblesses, étape par étape

### Étape 4 : du lead au RDV (le plus urgent)

1. **Aucune alerte quand un lead arrive.** Le hub envoie une notification pour un RDV pris ou
   annulé, pas pour un nouveau lead (vérifié dans `src/lib/crm/db.ts`). Brevo est bloqué, donc
   une personne qui ferme le formulaire sans cliquer sur Cal.com ne reçoit rien et tu ne le sais
   pas. Elle a pourtant vu une pub, rempli un formulaire et donné son numéro.
   **À faire :** une notification « Nouveau lead : nom, budget, site existant » dès la réception,
   avec l'appel du lead comme seule action. C'est une petite modification du hub, à faire sur
   une branche.
2. **Aucune règle de rappel.** Meta ne garde pas ce lead au chaud : il a vu d'autres pubs entre-
   temps. **À faire :** une règle écrite. Lead arrivé entre 9 h et 19 h : appel dans l'heure. Sinon,
   le lendemain avant 10 h. Si tu tombes sur la messagerie : un SMS court avec le lien Cal.com.
   Ce délai d'une heure est un choix de départ, pas un chiffre mesuré.
3. **Le consentement WhatsApp est demandé, mais rien n'est prévu pour s'en servir.** Prépare 2
   messages types (premier contact, relance à J+2), envoyés à la main en attendant Brevo.
4. **Les relances codées supposent Brevo.** Tant que le DMARC chez IONOS n'est pas réglé, la
   séquence J+1, J+3, J+7 ne part pas. Ce problème bloque déjà le site, le blog et les emails. Il
   a maintenant un coût direct en leads. **C'est le blocage technique qui coûte le plus cher.**
5. **Le délai entre Meta et le hub n'est pas mesuré.** Il dépend de la fréquence de l'Apps
   Script. Au lead de test, note l'heure d'envoi du formulaire et l'heure d'arrivée dans le hub.

### Étape 5 : le RDV et l'appel

6. **Pas de rappel avant le RDV** (confirmé le 21/10 : aucun rappel réglé dans Cal.com). C'est
   l'étape où on perd le plus facilement un RDV sans s'en rendre compte. **À faire :** régler dans
   Cal.com un rappel email la veille et 1 h avant (rubrique Workflows, vérifier ce que ton plan
   permet), et envoyer toi-même un SMS le matin du RDV tant que le volume le permet.
   L'appel se fait **en visio** : le lien doit figurer dans le rappel et la confirmation, et la
   règle est simple, si la personne n'est pas connectée 3 minutes après l'heure, tu l'appelles
   au téléphone. Beaucoup de patrons de PME et d'artisans ne sont pas à l'aise avec la visio, le
   téléphone sert de filet. La visio a aussi un avantage : tu peux partager ton écran pour
   montrer les sites et la planche de direction.
7. **Script d'appel pas encore écrit.** Il est prévu (`closing/`). Il doit couvrir :
   - le budget et le site existant, déjà connus par le formulaire ;
   - la qualification ;
   - la formule proposée, avec la règle « moins de 1 000 € : One page, sinon Essentiel » ;
   - les 5 objections les plus probables : prix, délai, « j'ai déjà un neveu », « je n'ai pas
     de photos », « c'est quoi la maintenance » ;
   - la conclusion : devis envoyé pendant l'appel ou dans l'heure, et date de rappel fixée.
8. **Des sites de l'ancienne agence sont encore en ligne** (confirmé le 21/10). Ce sont de vraies
   réalisations : elles passent avant les démos fictives (Atelier Hauteville, Garnier). **À
   faire :** en choisir 2 ou 3, idéalement dans des métiers proches de la cible (artisans, PME
   de service). Vérifier pour chacun qu'il est toujours fait par Kleak (pas refait depuis par
   quelqu'un d'autre), qu'il s'affiche bien sur mobile, et passer PageSpeed : un site lent montré
   par une agence qui vend la vitesse se retourne contre toi. Garde les liens dans un onglet prêt
   à partager pendant la visio. Pour les utiliser aussi dans les pubs ou sur kleakagency.fr,
   demande l'accord du client.
9. **Une fiche de RDV remplie après chaque appel** (formule, objection, décision, prochaine
   date). Sans elle, le taux de closing et la liste des objections ne se mesurent pas. Le
   business plan closing repose sur ces deux chiffres.

### Étape 6 : devis et signature (ce qui bloque l'encaissement)

10. **Pas de modèle de devis ni de CGV.** Un prospect convaincu le lundi qui reçoit son devis le
    jeudi s'est refroidi entre-temps. **À faire avant le premier RDV :**
    - un devis par formule, prêt à remplir en 5 minutes ;
    - des CGV courtes jointes au devis. Elles doivent couvrir le périmètre, le nombre de retouches,
      les contenus en retard, la propriété du site jusqu'au paiement complet, le paiement en 6
      fois, la suspension en cas d'impayé, le préavis de 2 mois et le transfert du site ;
    - une acceptation sans friction : signature électronique ou « bon pour accord » par email,
      plus le paiement.
11. **Le paiement n'est pas branché au devis.** La clé Stripe du hub est en lecture seule, c'est
    voulu. Les liens se créent donc à la main dans Stripe. Prépare à l'avance un lien de paiement
    par acompte (349,50 €, 499,50 €, 900 €) et le montage du paiement en 6 fois (abonnement de 6
    échéances, SEPA ou carte). Teste-le une fois avec une petite somme avant le premier client.
    C'est le premier point à recevoir de l'argent.
12. **Téléphone absent de la fiche offre.** À régler en même temps.
13. **Un point juridique à garder en tête.** Un contrat conclu **hors établissement** (signé chez
    le client, en face à face) avec une entreprise de 5 salariés au plus, quand le site ne relève
    pas de son métier, peut ouvrir un délai de rétractation de 14 jours (Code de la consommation,
    article L221-3). Les ventes se font en visio, ce qui en principe ne relève pas de ce cas. Il
    redevient un sujet le jour où tu signes chez un client : à faire confirmer par un juriste
    avant.

### Étapes 7 et 8 : du paiement au démarrage

14. **Le questionnaire n'existe que sur papier.** Il est écrit pour Essentiel et Pro. La page
    publique du hub, avec envoi de fichiers, enregistrement et relances J+2 et J+5, n'est pas
    construite, et il n'a pas de version One page (constat du test Garnier). Or c'est la
    réception des contenus qui fait démarrer le délai : un client qui traîne retarde le solde.
    Deux options :
    - **Formulaire externe** (Tally, Google Form) avec dépôt de fichiers, recopié dans un brief à
      la main. **Pour :** prêt en une demi-journée, suffit pour 2 ou 3 clients. **Contre :** une
      recopie à chaque client, et des fichiers hors du hub.
    - **Questionnaire dans le hub**, d'après le constat Garnier : un brief qui contient
      questionnaire, planche et textes, et produit seul le prompt de construction. **Pour :** zéro
      recopie, le prompt sort tout seul. **Contre :** plusieurs jours de développement avant
      d'avoir un client.

    Mon avis : le formulaire externe d'abord. Le hub ensuite, une fois que 2 vrais clients ont
    montré ce qui manque. À toi de trancher.
15. **Les contenus sont le premier risque sur le délai.** Les artisans visés ont rarement des
    textes et des photos prêts. Le questionnaire prévoit « reprenez les textes de mon site actuel »
    et des photos libres de droits. Annonce-le pendant l'appel pour que le client ne bloque pas
    dessus. Fixe aussi la règle écrite : sans contenus à J+10, le projet est mis en pause et le
    planning passe au client suivant.

### Étapes 9 à 11 : production

16. **L'outil de construction n'est pas fiable.** Sur le test Garnier, 1 h 30 a été perdue sur
    2 h 50 : délais de l'API `@framer/agent`, coupures, publication et captures en échec. Le site
    n'a pas été publié. Le temps cible du One page (7 à 9 h) n'est pas mesuré non plus.
    **À faire :** finir le test Garnier jusqu'à la livraison, PageSpeed compris, avant le premier
    client. Note le temps réel et prévois une procédure de secours : publier à la main dans
    Framer si l'API échoue.
17. **Capacité et planning.** Un One page en 5 jours ouvrés tient seul. Deux signatures la même
    semaine et un Essentiel en cours, en revanche, peuvent dépasser les 90 h du mois. Ne vends
    pas une date avant de l'avoir vérifiée dans un planning simple (une ligne par client, date de
    réception des contenus, date de livraison promise).

### Étapes 12 et 13 : mise en ligne, solde, facture

18. **Le domaine du client est le point technique le plus imprévisible** : accès perdus, DNS
    chez un prestataire inconnu, emails sur le même domaine. Le problème IONOS en est un exemple.
    **À faire :** demander dès la signature qui détient le domaine et les accès. Écrire un guide
    d'une page pour OVH, IONOS et Gandi. Ne jamais toucher aux enregistrements MX.
19. **Factures.** Les mentions obligatoires doivent y être : numérotation suivie, « TVA non
    applicable, article 293 B du CGI », pénalités de retard et indemnité forfaitaire de 40 €.
    Factures électroniques : depuis le 1er septembre 2026, toute entreprise doit pouvoir en
    recevoir. L'obligation d'en émettre arrive en septembre 2027 pour les micro-entreprises.
    Confirme le calendrier sur impots.gouv avant de choisir l'outil de facturation.
20. **Transfert du site non vérifié.** La fiche promet le transfert sur le compte du client à
    l'arrêt de la maintenance, et la note interne le liste à vérifier. Fais le transfert une fois
    sur le site Garnier pour connaître la procédure avant de la promettre à un client.

### Étape 14 : après la livraison (ce qui alimente les pubs suivantes)

21. **Rien n'est prévu pour transformer un client livré en preuve.** C'est pourtant le moyen le
    plus direct de faire baisser le coût d'acquisition. **À faire à la livraison :**
    - demander un avis Google ;
    - demander l'accord pour montrer le site dans les pubs et sur kleakagency.fr ;
    - faire une capture avant / après (format de la créa D) ;
    - demander une recommandation : un autre artisan ou un fournisseur.
22. **La maintenance doit se vendre au moment du devis, pas après la livraison.** Elle est
    obligatoire en 6 fois. En une fois, l'argument de l'hébergement inclus ne tient que si la
    maintenance est proposée dans le devis par défaut, en ligne à part.

---

## 4. Par où commencer

**Avant d'activer le test (vers le 25/10)**

1. Lead de test de bout en bout : heure d'envoi, heure d'arrivée dans le hub, bouton Cal.com
   vu, RDV réservé, notification reçue.
2. Notification « Nouveau lead » dans le hub (branche, puis fusion après ta validation).
3. Règle de rappel dans l'heure, SMS et 2 messages WhatsApp types.
4. Politique de confidentialité à jour. Pixel Meta et GA4 chargés seulement après accord dans le
   bandeau cookies : la CNIL relève souvent ce point, et il touche aussi le formulaire. Prévenir
   Accueil Sénior Assistance.
5. Script d'appel et fiche de RDV, pensés pour la visio.
6. Rappels Cal.com (veille et 1 h avant, avec le lien de la visio).
7. 2 ou 3 sites de l'ancienne agence choisis et vérifiés (mobile, PageSpeed).

**Avant le premier RDV (vers le 28/10)**

8. Outil de devis et factures choisi (section 6), devis par formule, CGV courtes, téléphone sur
   la fiche.
9. Factures d'acompte et paiement en 6 fois testés dans Stripe avec une petite somme.
10. Questionnaire de démarrage dans un formulaire externe, version One page comprise.

**Avant la première livraison**

11. Test Garnier terminé, temps réel du One page mesuré, procédure de publication à la main.
12. Guide domaine, transfert de site testé.
13. Étapes de fin de projet : avis, accord de diffusion, avant / après, recommandation.

**En continu :** régler IONOS. Ce blocage pèse sur 4 étapes du parcours (relances, site, blog,
emails des clients).

---

## 5. Réponses d'Edgar (21/10)

- Appel découverte : **en visio** (point 6).
- Rappels Cal.com : **aucun réglé** (point 6).
- Sites de l'ancienne agence en ligne : **oui** (point 8).
- Outil de devis et de factures : **à décider ensemble** (section 6).

Reste à mesurer au lead de test : la fréquence de l'Apps Script du Google Sheet, donc le délai
d'arrivée d'un lead dans le hub.

---

## 6. Devis et factures : la décision à prendre

### La contrainte qui tranche

L'onglet Finance et le suivi des ventes du hub lisent **les factures Stripe payées**, rattachées à
un client Stripe (`stripe.invoices.list`, statut `paid`, dans `src/lib/finance/db.ts`). Un
paiement qui n'arrive pas sous forme de facture Stripe n'apparaît ni dans Finance ni dans
l'échéancier de la vente. Le paiement en 6 fois passe aussi par Stripe. **Le paiement et la
facture doivent donc rester dans Stripe**, sinon le hub ne voit rien sans développement en plus.

### Ce dont tu as besoin

| Besoin | Pourquoi |
|---|---|
| Devis prêt en 5 minutes, par formule | Envoyé pendant l'appel ou dans l'heure |
| Acceptation en ligne (signature ou bon pour accord) | Pas d'impression, pas de scan |
| Lien de paiement de l'acompte sur la facture | Le client paie dans la foulée |
| Paiement en 6 fois en prélèvement | Déjà promis dans la fiche offre |
| Factures conformes (numérotation, 293 B, pénalités, 40 €) | Obligatoire |
| Livre des recettes | Obligatoire en micro-entreprise |
| Factures électroniques en émission | Obligatoire pour toi en septembre 2027, pas avant (calendrier à confirmer) |

### Les trois options

**A. Devis en PDF depuis un modèle, factures et paiements dans Stripe** (ma recommandation)

- Un modèle de devis par formule, avec les CGV en annexe, et une signature électronique simple.
  La facture d'acompte est créée dans Stripe avec le bouton de paiement, et le paiement en 6 fois
  est un abonnement Stripe de 6 échéances.
- **Pour :** prêt en une demi-journée, le hub voit tout de suite chaque paiement, rien à
  développer, aucun nouvel abonnement en dehors de Stripe.
- **Contre :** le devis est un fichier à part, sans suivi « ouvert, signé ». Les mentions
  françaises sont à poser dans les champs personnalisés et le pied de facture Stripe, à vérifier
  une fois. Stripe facture l'usage de l'outil de facturation, à vérifier sur ta page de tarifs
  Stripe. Il faudra une plateforme agréée pour la facture électronique en 2027.

**B. Un logiciel de facturation pour micro-entrepreneur** (Abby, Indy, Freebe, Tiime…)

- **Pour :** devis, signature, factures conformes et livre des recettes au même endroit. Certains
  préparent déjà la facture électronique.
- **Contre :** ces factures ne sont pas des factures Stripe, donc le hub ne les voit pas sans
  développer un rapprochement. Le paiement en 6 fois en prélèvement n'est pas toujours possible.
  C'est un abonnement de plus. Les prix et fonctions sont à vérifier outil par outil, je n'en ai
  testé aucun.

**C. Module devis et factures dans le hub** (prévu dans la spec d'origine)

- **Pour :** tout au même endroit. Le devis peut sortir de la fiche client et de la vente déjà
  saisie, et créer la facture dans Stripe.
- **Contre :** plusieurs jours de développement avant d'avoir un client, et la clé Stripe du hub
  est en lecture seule par choix : il faudrait une clé qui écrit. La conformité des factures
  serait à porter par toi.

**D. Devis dans un logiciel (Tiime ou autre), factures et paiements dans Stripe** (proposée par
Edgar le 21/10)

- **Pour :** devis propres, numérotés, avec acceptation en ligne et suivi, sans rien développer.
  Le hub continue de tout voir, puisque les factures restent dans Stripe.
- **Contre :** chaque client et chaque montant est saisi deux fois (logiciel puis Stripe). Il y
  a deux outils à tenir. Et le logiciel ne doit jamais émettre de facture, sinon tu as deux séries
  de numéros, ce qui pose un problème au moindre contrôle.
- **Conditions pour que ça tienne :**
  1. aucune facture ni facture d'acompte dans le logiciel, la transformation du devis en facture
     n'est jamais utilisée ;
  2. le numéro du devis est repris sur la facture Stripe (champ personnalisé « Devis n° ») ;
  3. même raison sociale, même adresse et même SIRET dans les deux outils ;
  4. les CGV sont jointes au devis, et l'échéancier y est écrit en toutes lettres si le client
     paie en 6 fois, maintenance comprise ;
  5. la facture d'acompte Stripe part le jour de l'acceptation du devis.
- **À vérifier dans Tiime avant de choisir :** ce que le plan gratuit permet (acceptation en
  ligne, signature, modèles), si la transformation en facture peut être évitée, et si Tiime fait
  partie des plateformes agréées pour la facture électronique. Ce dernier point compte pour 2027,
  pas pour maintenant.

### Mon avis

**A maintenant, C plus tard si le volume le justifie.** Le cash passe avant l'outil : il faut un
devis et une facture fiables avant le premier RDV, dans une semaine, et la seule option qui
garde le hub à jour sans rien développer, c'est A. On reverra la question avec 3 ou 4 clients
réels, ou en préparant la facture électronique de 2027. B n'a de sens que si tu ne veux pas faire
ta comptabilité dans Stripe et le hub.

**Si tu choisis A, voici ce que je prépare :**
1. Les 3 modèles de devis (One page, Essentiel, Pro) avec les options et la maintenance en ligne
   à part.
2. Les CGV courtes, à faire relire.
3. La liste des réglages Stripe : mentions du pied de facture, champs, produits et prix, montage
   du paiement en 6 fois. C'est toi qui les fais, la session n'a pas accès en écriture à Stripe.
