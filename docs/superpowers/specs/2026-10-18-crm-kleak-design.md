# CRM Kleak Agency : conception

> Rédigée le 18 octobre 2026 avec Edgar. Complète et réordonne
> `2026-10-15-hub-agence-design.md` (lots 2 à 5). Le socle, la Bibliothèque et les Briefs
> (lots 0 et 1) existent déjà dans `livrables/hub-agence/`.

---

## 1. Intention

Kleak Agency trouve ses clients **uniquement par Meta Ads** : pubs statiques, puis formulaire
instantané Meta. Historique d'il y a un an : 2 € par lead, 1 rendez-vous pour 3 leads,
1 signature pour 3 à 4 rendez-vous. Budget de 200 € par mois. Objectif : 2 000 € nets par
mois dès décembre 2026, soit environ 2 550 € de CA.

Edgar travaille seul, 6 h par jour jusqu'à fin décembre. Le CRM doit **tout savoir sur chaque
lead et chaque client, sans saisie manuelle, lisible d'un coup d'œil**, et **tout automatiser**
entre l'arrivée du lead et le paiement du solde. Avant, il faisait tout à la main.

**Ce qui le rend utile** : le CRM dit à Edgar quoi faire aujourd'hui, et fait tout seul ce qui
n'a pas besoin de lui (invitations, relances, passages d'étape, détection des paiements).

### Ce qui serait un échec, même si tout fonctionne techniquement

Hypothèse de Claude, déduite de la conversation (Edgar n'a pas répondu directement) :

- relancer quelqu'un qui a déjà réservé, signé ou payé ;
- perdre un lead (arrivé chez Meta, jamais apparu dans le CRM) ;
- envoyer deux fois le même message ;
- afficher un chiffre faux sur la page d'accueil (CA, coût par lead).

---

## 2. Le trajet d'un client

1. **Lead** : la personne voit la pub et remplit le formulaire instantané Meta. La réponse
   arrive dans le Google Sheet déjà connecté à Meta, puis dans le CRM.
2. **Invitation immédiate** : le lead reçoit un **WhatsApp et un email** (via Brevo), avec le
   lien de prise de rendez-vous **Cal.com**. Deux canaux, deux rôles : WhatsApp pour la vitesse,
   l'email pour la trace, le suivi et les relances. Un lien Cal.com distinct par canal permet de
   savoir lequel a fait réserver.
3. **Relances** : sans réservation, une séquence d'emails part automatiquement. Elle s'arrête
   dès qu'il réserve, répond ou se désinscrit.
4. **Rendez-vous** : la réservation Cal.com fait passer le lead à « RDV pris », avec la date.
5. **Devis** : après l'appel, Edgar choisit dans le CRM la formule et les options. Le CRM génère
   le devis. Le client le reçoit par un lien, l'accepte en ligne en cochant les CGV ; le CRM
   enregistre date, heure, IP et version des CGV. Sans réponse, relances.
6. **Acompte** : après acceptation, le client paie 50 % par **carte (Stripe)** ou par
   **virement (Revolut Business)**, avec une référence unique. Le CRM détecte le paiement tout
   seul.
7. **Production puis livraison**, puis **solde** par le même chemin. Un retard déclenche une
   relance.
8. **Maintenance** (90 €/mois) : choisie sur le devis et acceptée avec lui. Elle démarre au
   paiement du solde, en abonnement Stripe prélevé chaque mois. Engagement de 12 mois, puis
   elle continue sans engagement, résiliable chaque mois. *(Choix de Claude, à confirmer par
   Edgar.)*

L'offre est décrite dans `livrables/offre/` : Essentiel 999 € (3 pages), Pro 1 800 € (5 pages),
automatisation +400 €, page supplémentaire +200 €, maintenance 90 €/mois sur 12 mois.
TVA non applicable, article 293 B du CGI.

---

## 3. Les écrans (validés sur maquettes)

### Accueil : vue mixte

- **En haut, les chiffres du mois** : CA encaissé face à l'objectif (2 550 €), nombre de leads
  et coût par lead, rendez-vous pris et taux lead vers RDV, montant des devis en attente.
- **Au milieu, les actions du jour**, triées par urgence (urgent, aujourd'hui, info). Exemples :
  solde en retard, devis ouvert plusieurs fois sans signature, RDV demain à préparer, séquence
  de relance qui se termine.
- **En bas, un aperçu du pipeline** : nombre de clients par étape.

### Pipeline : colonnes

Étapes : **Nouveau lead, RDV pris, Devis envoyé, Acompte payé, En production, Livré, Soldé**,
plus **Perdu** (hors colonnes principales, filtrable). Ajout de Claude sur la base validée
(« en production », « soldé », « perdu »). Chaque carte avance **toute seule** selon les
événements, avec une étiquette de couleur qui dit ce qui se passe (« mail ouvert »,
« relance 2 envoyée », « ouvert 3 fois, pas signé », « solde en retard J+6 »).

Edgar peut déplacer une carte à la main (par exemple vers « Perdu », ou « En production »
quand il commence). Une étape franchie automatiquement ne revient jamais en arrière toute
seule.

### Fiche client : indicateurs puis fil chronologique

- **En-tête** : nom, entreprise, téléphone, email, étape.
- **4 indicateurs** : dernier échange, temps de réponse moyen du client, devis (montant et
  nombre d'ouvertures), montant payé.
- **Le prochain geste à faire**, surligné.
- **L'historique complet**, du plus récent au plus ancien : réponses au formulaire Meta
  (budget, échéance), emails envoyés, ouverts, cliqués, répondus, WhatsApp envoyés et lus,
  canal de réservation, rendez-vous, devis envoyé, ouvert, accepté, paiements, relances.
- Accès au brief et aux références épinglées (déjà existants).

---

## 4. Décisions de fabrication

- **Tout se construit dans le Hub Agence existant** (`livrables/hub-agence/`, Next.js 15,
  Supabase, Vercel), en suivant ses règles : une source non configurée affiche « non
  configuré » et ne plante pas ; une donnée absente n'est pas une donnée nulle.
- **Toutes les automatisations vivent dans le CRM** (décision d'Edgar, sur recommandation de
  Claude), pas dans n8n : une seule source de vérité, pour que la règle « ne jamais relancer
  quelqu'un qui a réservé ou payé » lise l'état réel.
- **Les textes des messages vivent dans Brevo**, en modèles modifiables par Edgar sans code.
  Le CRM décide quand envoyer quel modèle, à qui.
- **Arrivée des leads : Meta, Google Sheet, CRM.** Le Sheet est alimenté directement par
  Meta à chaque formulaire rempli. Colonnes : `id`, `created_time`, `ad_id`, `ad_name`,
  `adset_id`, `adset_name`, `campaign_id`, `campaign_name`, `form_id`, `form_name`,
  `is_organic`, `platform`, `possédez-vous_déjà_un_site_web_?`,
  `quel_est_votre_budget_pour_la_création_ou_la_refonte_de_votre_site_?`, `full name`, `email`,
  `phone`, `nom_de_l’entreprise`, `is_qualified`, `is_quality`, `is_converted`, `lead_status`.
  - **`id` est l'identifiant du lead Meta** : clé de dédoublonnage, un lead n'est créé qu'une
    fois même si la ligne est relue.
  - Les colonnes de pub (`ad_name`, `adset_name`, `campaign_name`) sont gardées sur le lead :
    le CRM peut ainsi dire **quelle pub amène des rendez-vous et des signatures**, pas seulement
    des leads.
  - Les deux réponses (site existant, budget) s'affichent dans la fiche et en tête de
    l'historique.
  - **Aucune colonne de consentement WhatsApp** : il faut ajouter cette question au formulaire
    Meta avant d'envoyer le moindre WhatsApp. Sans consentement, le lead ne reçoit que l'email.
  - Les noms de colonnes peuvent changer si le formulaire change : la correspondance colonnes
    vers champs vit dans un seul fichier, et une colonne attendue absente est signalée au lieu
    d'être ignorée en silence. On garde le Sheet déjà connecté plutôt
  qu'une application Meta à faire valider (la validation Meta avait bloqué Orbikal pendant des
  semaines). Un petit script dans le Sheet prévient le CRM à chaque nouvelle ligne.
- **Emails : Brevo.** **WhatsApp : API WhatsApp Business** (Brevo le propose ; à défaut, l'API
  Cloud de Meta). **Rendez-vous : Cal.com** (offre gratuite ; le menu Webhooks est visible sur
  le compte d'Edgar). **Paiement carte : Stripe** (compte Kleak existant, distinct de celui d'Orbikal ; à
  confirmer qu'aucun paiement Orbikal n'y passe). **Virement : Revolut
  Business** (compte à ouvrir).
- **Devis générés par le CRM** : ce n'est plus « suivi seulement » comme dans la spec du 15/10.
  Les devis ne relèvent pas de la facturation électronique.

---

## 5. Règles d'automatisation

### Passages d'étape automatiques

| Événement | Effet |
|---|---|
| Nouvelle ligne dans le Sheet | Lead créé (ou rattaché par email ou téléphone), étape « Nouveau lead », invitation envoyée |
| Réservation Cal.com | « RDV pris », date du RDV, séquence de relance lead arrêtée |
| Annulation Cal.com | Retour à « Nouveau lead » avec étiquette « RDV annulé », relance de reprise |
| Devis envoyé depuis le CRM | « Devis envoyé » |
| Devis accepté | Compte au statut client, invitation au paiement de l'acompte |
| Paiement de l'acompte reçu (Stripe ou Revolut) | « Acompte payé » |
| Solde reçu | « Soldé » |

### Séquences de relance (calendrier proposé par Claude, modifiable)

- **Lead sans réservation** : J0 WhatsApp + email ; J+1, J+3 et J+7 email. Puis fin de
  séquence et étiquette « séquence terminée ».
- **Devis sans réponse** : J+2, J+5, J+10.
- **Paiement en retard** : J+1 et J+7 après l'échéance.
- **Arrêt immédiat** de toute séquence dès que l'étape avance, que le client répond, ou qu'il
  se désinscrit.
- **L'invitation J0 part immédiatement, à toute heure** : la vitesse prime sur le premier
  contact. *(Choix de Claude.)*
- Les relances partent entre 9 h et 19 h, du lundi au samedi (heure de Paris). Les délais
  (J+1, J+3…) se comptent en jours calendaires ; une relance qui tombe hors créneau part au
  début du créneau suivant. *(Choix de Claude.)*

### Échéances de paiement *(choix de Claude)*

- **Acompte** : dû 7 jours après l'acceptation du devis.
- **Solde** : demandé quand Edgar passe la carte à « Livré » (passage manuel), dû 7 jours plus
  tard.
- Les relances « paiement en retard » et l'étiquette « solde en retard J+n » se calculent sur
  ces échéances.

### Garde-fous

- **Jamais deux fois le même message** : chaque envoi a une clé unique (client, séquence,
  étape de séquence).
- **Jamais de relance après réservation, réponse, signature ou paiement**, vérifié au moment
  de l'envoi et pas seulement au moment de la programmation.
- **Aucun lead perdu** : chaque événement reçu est enregistré tel quel avant traitement ; un
  événement reçu deux fois n'a qu'un effet.

---

## 6. Conformité

- **Formulaire Meta** : consentement explicite pour WhatsApp (case dédiée) et mention RGPD.
- **Désinscription** : lien dans chaque email (Brevo), et « STOP » sur WhatsApp, qui arrête
  tout envoi.
- **Durée de conservation** des leads non convertis : 3 ans après le dernier contact
  (recommandation de la CNIL pour la prospection), puis suppression.
- **Devis** : mentions obligatoires, lien vers les CGV, trace de l'acceptation.
- **Pages et routes publiques** (page de devis, réception des événements Sheet, Brevo, Cal.com,
  Stripe, Revolut) : chacune vérifie une signature ou un secret partagé. Le reste du CRM reste
  derrière le mot de passe.

---

## 7. Ordre de livraison (option 2, choisie par Edgar)

La première pub part **vers le 25 octobre**. Chaque brique arrive avant son premier usage.

| Phase | Contenu | Prête pour |
|---|---|---|
| **1. Cœur** | **Mise en ligne du Hub** (Vercel, domaine, variables : nécessaire pour recevoir les webhooks), réception des leads (Sheet), invitation email Brevo avec lien Cal.com, suivi Brevo (délivré, ouvert, cliqué), réservation Cal.com, séquence de relance lead, fiche client, pipeline, accueil (leads, RDV, actions du jour) | 25 octobre |
| **2. Vente** | Devis en ligne avec acceptation, paiement Stripe de l'acompte et du solde, relances de devis, **questionnaire de cadrage client** (conception dédiée : `2026-10-18-questionnaire-cadrage-design.md`) | Avant le premier rendez-vous |
| **3. Le reste** | WhatsApp (dès validation des modèles par Meta), Revolut, relances de paiement, maintenance en abonnement Stripe, coût par lead et tableau de bord complet | Novembre |

Tant que WhatsApp n'est pas validé, l'invitation part par email seul.

---

## 8. Hors périmètre

- La réception des briefs par Tally (lot 2 de la spec du 15/10) : remplacée par l'arrivée des
  leads Meta. Le brief reste saisi dans le CRM.
- La prospection sortante.
- L'accès client au CRM (hors page de devis).
- Les campagnes Meta elles-mêmes (création des pubs, ciblage) : elles se font dans Meta.

---

## 9. Laissé au constructeur

- Le modèle de données exact, en partant des tables existantes (`comptes`, `projets`, `briefs`)
  et de la contrainte « tout est un événement horodaté dans l'historique ».
- Le mécanisme de planification des relances, compatible avec l'hébergement Vercel.
- Le rattachement d'un lead à un compte existant (email, téléphone).
- La présentation détaillée des écrans, dans le style du hub existant.

### Emails et réponses

- Adresse d'envoi pas encore créée ; **probablement Google Workspace** sur `kleakagency.fr`.
  À créer avant le 25 octobre.
- Brevo envoie depuis le domaine `kleakagency.fr` (authentification DKIM, SPF, DMARC à poser),
  avec la boîte Google en adresse de réponse.
- **Détection des réponses** : le CRM lit la boîte Google (API Gmail) et rattache chaque
  réponse au lead par son adresse email. Tant que ce branchement n'existe pas, les séquences
  s'arrêtent sur réservation, signature, paiement ou désinscription, mais pas sur réponse ; la
  page d'accueil le signale (« détection des réponses non configurée »).

### Factures

- **Émises par Stripe Invoicing** (choix d'Edgar) pour l'acompte, le solde et chaque mois de
  maintenance, avec la mention « TVA non applicable, article 293 B du CGI » et la numérotation
  continue de Stripe.
- Un paiement reçu par virement Revolut est enregistré sur la facture Stripe comme payé hors
  Stripe : toutes les factures restent au même endroit, avec une seule numérotation.
- À vérifier : les frais de Stripe Invoicing (y compris sur les factures payées hors Stripe).
- À revoir avant septembre 2027 (obligation d'émission en facture électronique).

### Décisions de Claude sur les points ouverts

- **Arrivée des leads** : quel que soit le mécanisme du Sheet, le CRM **relit le Sheet toutes
  les quelques minutes** en plus d'être prévenu, et dédoublonne sur l'identifiant de lead Meta.
  Un déclencheur de script qui ne se lance pas ne fait donc perdre aucun lead.
- **Dépenses publicitaires** : saisie manuelle du montant dépensé par mois en phases 1 et 2.
  Lecture automatique depuis Meta envisageable en phase 3. Sans montant saisi, le coût par lead
  affiche « non renseigné », jamais 0 €.
- **CGV** : à rédiger avant la phase 2 (prérequis). Le CRM sert une page de CGV versionnée, et
  l'acceptation du devis enregistre la version.

### À vérifier avant de construire

- Cal.com : création d'un webhook sur l'offre gratuite, et événements envoyés (réservation,
  annulation, report).
- Brevo : événements disponibles (délivré, ouvert, cliqué, réponse, désinscription), et
  WhatsApp via Brevo (disponibilité, coût, validation des modèles).
- Revolut Business : accès à l'API et aux webhooks selon l'offre choisie.
- Stripe : frais réels du compte Kleak.
