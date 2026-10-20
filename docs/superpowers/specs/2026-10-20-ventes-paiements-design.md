# Ventes, paiement en 6 fois et maintenance dans le Hub Agence : conception

> 20 octobre 2026. Proposée par Claude à la demande d'Edgar, à valider.
> Offre de référence : `livrables/offre/note-interne-offre.md` (revue le 20/10).

## 1. Intention

Depuis le 20/10, un client Kleak peut payer son site **en une fois** (50 % à la signature, 50 % à
la mise en ligne) ou **en 6 fois sans frais**, et prendre une **maintenance** à 49 € ou 90 € par
mois (hébergement Framer inclus, engagement de 12 mois, obligatoire en 6 fois).

Aujourd'hui, le hub ne sait rien de ce qui a été vendu : la fiche d'un compte affiche « Devis :
pas encore » et « Payé : pas encore » en dur, et l'onglet Finance ne voit que l'argent déjà
encaissé dans Stripe, sans lien avec les comptes du CRM.

Edgar veut savoir, **sur la fiche client** et **dans Finance** :
- ce que chaque client a acheté, comment il paie, s'il a la maintenance ;
- ce qui a été payé, ce qui reste, et ce qui est en retard ;
- ce qui va rentrer les prochains mois, puisque le 6 fois étale l'argent et que la maintenance
  fait le récurrent.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Enregistrer une **vente signée** par compte : formule, options, prix, mode de paiement,
  maintenance, dates.
- En déduire un **échéancier** (versements du site et mois de maintenance) et le **rapprocher**
  des paiements Stripe déjà synchronisés pour dire, ligne par ligne : payé, à venir, en retard.
- Fiche client : la vente, l'échéancier, payé et reste.
- Finance : à encaisser ce mois, maintenance mensuelle, reste à encaisser, part des clients en
  6 fois, retards, prévision des 6 prochains mois face à l'objectif, fins d'engagement proches.

**Non-objectifs**
- Le hub ne crée rien dans Stripe. La clé Stripe Kleak est restreinte en lecture seule et le
  reste : Edgar programme lui-même les prélèvements (abonnement ou factures) dans Stripe.
- Pas de devis ni de facture générés par le hub (phase 2 du CRM, inchangée).
- Pas de relance automatique des impayés.

**Anti-objectifs** (raté même si ça « marche » si…)
- Un paiement est compté deux fois, ou un retard est annoncé alors que le client a payé.
- Une vente sans lien Stripe affiche « en retard » ou « 0 € payé ». Elle affiche « paiements non
  rapprochés », conformément à la règle du hub : une donnée absente n'est pas zéro.
- Les chiffres existants de Finance (brut, net, objectif) changent. Ils restent basés sur
  l'encaissé réel. La prévision est une section à part, présentée comme une prévision.

**Décision à confirmer par Edgar :** la spec Finance du 19/10 excluait « prévisionnel et
pipeline de devis à encaisser ». Cette spec revient dessus, mais seulement pour les **ventes
signées** (pas les devis).

## 3. Catalogue de l'offre

Une seule source dans le code, `src/lib/offre.ts`, qui sert à pré-remplir le formulaire de
vente (les montants restent modifiables vente par vente, pour une remise ou une montée en
gamme) :

| Clé | Libellé | Prix site | Maintenance proposée |
|---|---|---|---|
| `one_page` | One page | 699 € | 49 €/mois |
| `essentiel` | Essentiel | 999 € | 90 €/mois |
| `pro` | Pro | 1 800 € | 90 €/mois |
| `sur_mesure` | Sur mesure | saisi | saisie |

Options : automatisation des demandes 400 €, page supplémentaire 200 €. Engagement de
maintenance : 12 mois. Délai de grâce avant « en retard » : 5 jours (choix de Claude).

Si l'offre change, on ne modifie que ce fichier ; les ventes déjà enregistrées gardent leurs
montants.

## 4. Données

Nouvelle table `ventes`, script `supabase/ventes.sql` idempotent, RLS activée sans policy
comme le reste du schéma. Montants en centimes, dates en jour de Paris (`date`).

| Colonne | Type | Rôle |
|---|---|---|
| `id` | uuid | |
| `compte_id` | uuid, référence `comptes`, cascade | Le client |
| `formule` | text, check catalogue | |
| `prix_site_centimes` | integer > 0 | Site + options, ce que le client paie pour le site |
| `options` | text[] | Clés des options, pour l'affichage |
| `mode_paiement` | text, `une_fois` ou `six_fois` | |
| `signe_le` | date | Point de départ de l'échéancier |
| `mise_en_ligne_le` | date | Prévue puis réelle, modifiable. Défaut : `signe_le` + 21 jours |
| `maintenance_centimes` | integer, null si aucune | 4 900 ou 9 000 en général |
| `maintenance_mois` | integer, défaut 12 | Durée d'engagement, prolongée au renouvellement |
| `stripe_client_id` | text, null | Client Stripe (`cus_…`) qui paie cette vente |
| `statut` | text, `active` ou `annulee` | Une vente annulée sort de tous les calculs |
| `notes` | text | |
| `created_at`, `updated_at` | timestamptz | |

Contrainte : `mode_paiement = 'six_fois'` exige `maintenance_centimes is not null`.

Un compte peut avoir **plusieurs ventes**, par exemple un one page puis une montée vers
l'Essentiel saisie comme une seconde vente au prix de la différence (300 €).

## 5. Échéancier (calcul pur, rien n'est stocké)

`src/lib/ventes/echeancier.ts`, sans import Next ni Supabase, testé unitairement.

**Site, en une fois :** 50 % à `signe_le`, 50 % à `mise_en_ligne_le`. Si le prix est impair en
centimes, le centime restant va au solde.

**Site, en 6 fois :** 6 versements. Le premier à `signe_le`, les suivants le même jour des 5 mois
suivants (ramené au dernier jour du mois si ce jour n'existe pas, par exemple le 31). Montant :
prix ÷ 6 arrondi au centime inférieur, l'écart reporté sur le dernier versement
(1 800 € + 400 € d'automatisation → 5 × 366,66 € + 366,70 €).

**Maintenance :** `maintenance_mois` mensualités, la première à `mise_en_ligne_le`, puis le même
jour des mois suivants.

Chaque ligne : date, montant, nature (`acompte`, `solde`, `versement 2/6`, `maintenance 3/12`),
vente d'origine.

## 6. Rapprochement avec Stripe

**Le lien :** dans le formulaire de vente, un choix « Client Stripe » qui liste les clients déjà
présents dans `finance_mouvements` (`client_id`, `client_nom`), plus « pas encore dans Stripe ».
Pas d'appel Stripe nouveau : on réutilise la synchronisation existante.

**Les paiements :** les mouvements `source = 'stripe'` et `sens = 'entree'` de ce client
(factures payées, y compris celles marquées payées hors Stripe, remboursements en négatif),
datés à partir de `signe_le` − 30 jours.

**La répartition (choix de Claude) :** on additionne tout ce que le client a payé et on remplit
les échéances de toutes ses ventes **dans l'ordre des dates**, sans chercher à savoir si un
paiement Stripe visait le site ou la maintenance. Le cumul suffit à savoir où il en est et évite
de lire les lignes de facture.

**Statut de chaque échéance :**
- `payee` : le cumul payé couvre le cumul dû jusqu'à elle ;
- `en_retard` : non couverte et sa date + 5 jours est passée ;
- `a_venir` : le reste ;
- sans `stripe_client_id` : toutes en `non_rapprochee`, aucun retard affiché.

## 7. Fiche client (`/comptes/[id]`)

- Les indicateurs « Devis » et « Payé » sont remplacés par **« Formule »** (par exemple
  « Essentiel · 6 fois · maintenance 90 € ») et **« Payé »** (« 333 € sur 999 € », ou « non
  rapproché »). Sans vente : « pas encore », comme aujourd'hui.
- Une carte **Vente** :
  - formule, options, prix, mode de paiement, maintenance et fin d'engagement ;
  - l'échéancier en liste (date, nature, montant, pastille payé / à venir / en retard) ;
  - en pied : payé, reste à payer, prochaine échéance ;
  - boutons Modifier et Annuler la vente (avec confirmation dans la page, pas de boîte du
    navigateur).
- Bouton **Enregistrer la vente** sur la fiche, visible à partir de l'étape « Devis envoyé ».
  Formulaire : formule (pré-remplit prix et maintenance), options, mode de paiement, date de
  signature, date de mise en ligne prévue, maintenance (oui/non, montant), client Stripe, notes.
  En 6 fois, la case maintenance est cochée et verrouillée.
- Libellés d'étapes du pipeline (valeurs inchangées en base, choix de Claude) :
  `acompte_paye` devient « 1er paiement reçu », `solde` devient « Site payé », pour couvrir les
  deux modes.

## 8. Onglet Finance

Nouvelle section **« Ventes signées »**, sous les chiffres existants qui ne changent pas.

**Cartes de chiffres :**
- **À encaisser ce mois** : échéances du mois en cours, site et maintenance, avec « dont X €
  déjà payés ».
- **Maintenance mensuelle** : somme des maintenances en cours ce mois, et nombre de sites.
- **Reste à encaisser** : total des échéances futures ou impayées des ventes actives.
- **Paiement en 6 fois** : « 2 clients sur 5 », et la part en euros du total vendu.

**Listes :**
- **En retard** : client, échéance, montant, jours de retard, lien vers la fiche. Vide :
  « Aucun retard ».
- **Fins d'engagement dans les 45 jours** : client, date de fin, montant mensuel. C'est le
  moment de proposer le renouvellement ou de préparer le transfert du site.
- **Ventes non rapprochées** : ventes sans client Stripe, pour ne pas les oublier.

**Prévision des 6 prochains mois :** un tableau par mois (sites, maintenance, total), avec le
total comparé aux 2 550 € de CA brut qui donnent 2 000 € nets (même taux URSSAF que les
réglages). Intitulé clair « Prévision, ventes signées uniquement ».

Ces calculs vivent dans `src/lib/ventes/synthese.ts`, purs et testés, sur le modèle de
`src/lib/finance/calculs.ts`.

## 9. Contraintes de réalisation

- **Partir de `main` après la fusion de Finance lot 2.** Lot 2 est en cours dans le même
  dossier (branche `finance-lot-2`) et touche la page Finance. Nouvelle branche `ventes`, fusion
  après validation d'Edgar ; chaque push sur `main` part en production.
- Le SQL est exécuté par Edgar dans Supabase avant le déploiement.
- Apparence : couleurs dans `src/app/theme.css`, verre réservé aux cartes de chiffres et aux
  en-têtes, jamais aux listes. Lisible sur iPhone.
- Ne pas lancer `npm run build` pendant qu'un serveur dev tourne.

## 10. Laissé au constructeur

- Le découpage en composants et en server actions, sur le modèle des écrans CRM existants.
- La présentation exacte de l'échéancier sur mobile.
- Les tests : l'échéancier (arrondis, fin de mois, 6 fois avec options), la répartition (paiement
  partiel, trop-perçu, remboursement, plusieurs ventes d'un même client, vente annulée), la
  synthèse Finance.

## 11. Plus tard, hors de ce chantier

- `/demain` qui lit les échéances en retard et les fins d'engagement pour proposer les tâches.
- Rapprocher les virements Revolut quand le lot 2 lira les entrées.
- Générer devis et factures depuis la vente (phase 2 du CRM).
