# Onglet Finance du Hub Agence : conception

> 19 octobre 2026. Conçu avec Edgar. Maquette validée :
> `livrables/hub-agence/.superpowers/brainstorm/36512-1792397416/content/finance-a-verre.html`

## 1. Intention

Edgar veut ouvrir un onglet et savoir tout de suite si Kleak Agency gagne de l'argent et si son
objectif est tenu : **2 000 € nets par mois dès décembre 2026**. Aujourd'hui, aucun revenu ne
passe par Stripe, aucun client n'est signé. L'onglet sera vide jusqu'au premier encaissement :
il doit être prêt avant, pas après.

Périmètre : **Kleak uniquement**. Orbikal a son propre Stripe et n'apparaît pas ici.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Voir le **brut** (CA encaissé) et le **net** (après toutes les dépenses et les cotisations
  estimées) sur une période.
- Voir le nombre de clients, les entrées et sorties mois par mois, les derniers mouvements et
  les dépenses par poste.
- Zéro saisie manuelle en temps normal : tout vient de Stripe et de Revolut Business.

**Non-objectifs**
- Pas de comptabilité, pas de facturation (Stripe Invoicing s'en charge, phase 2 du CRM), pas de
  déclaration URSSAF, pas de gestion de TVA (micro-entreprise en franchise).
- Pas de prévisionnel ni de pipeline de devis à encaisser.
- Pas d'Orbikal.

**Anti-objectifs** (l'onglet est raté même s'il « marche » si…)
- Un même paiement est compté deux fois (virement client présent sur Revolut et sur sa facture
  Stripe, ou versement Stripe arrivant sur Revolut).
- Le net est faux parce qu'un virement d'Edgar vers son compte perso est compté comme une
  dépense, ou parce que le prélèvement URSSAF réel s'ajoute à l'estimation.
- Une source en panne affiche « 0 € » au lieu de « indisponible » (règle déjà en vigueur dans
  le hub : une donnée absente n'est pas zéro).

## 3. Sources

| Source | Ce qu'on y lit |
|---|---|
| **Stripe** (compte Kleak, distinct d'Orbikal) | Factures payées : acompte, solde, maintenance mensuelle. Y compris celles marquées « payées hors Stripe » (virement Revolut), conformément à la spec CRM du 18/10 : toutes les factures sont émises par Stripe Invoicing. Frais Stripe. |
| **Revolut Business** (compte Kleak) | Toutes les sorties d'argent : Edgar paie tout avec. Les entrées qui ne correspondent à aucune facture Stripe. |

Le compte Revolut Business sert **uniquement à Kleak** (confirmé par Edgar) : aucun poste « hors
Kleak » à prévoir.

### Découpage en deux lots (décision d'Edgar du 19/10)

Le compte Revolut Business **n'est pas encore ouvert**. On construit donc en deux temps :

- **Lot 1, maintenant : Stripe seul.** Brut, clients, cotisations estimées, frais Stripe,
  graphique et mouvements à partir des factures Stripe. La page entière est construite selon la
  maquette. Tant que Revolut n'est pas branché (choix de Claude) : la carte Dépenses affiche
  « Revolut pas encore branché » avec les seuls frais Stripe en détail ; le Net est libellé
  « avant dépenses Revolut » pour ne jamais passer pour le vrai net ; « Dépenses par poste » montre
  un état non connecté (composant `not-connected` existant). Les règles de la section 4 qui
  concernent Revolut ne s'appliquent pas encore. Le code doit rester prêt à accueillir une seconde
  source sans refaire la page.
- **Lot 2, à l'ouverture du compte : Revolut Business.** Branchement de l'API (accès selon
  l'offre choisie, à vérifier à l'ouverture ; agrégateur bancaire ou import CSV en secours),
  rapprochement avec les factures Stripe, classement des dépenses. Il fera l'objet de son propre
  plan.

## 4. Règles de calcul (décidées)

- **Brut** = somme des factures Stripe payées sur la période (date de paiement), toutes méthodes
  confondues, plus les entrées Revolut qui ne correspondent à aucune facture Stripe.
- **Dépenses** = sorties Revolut + frais Stripe, **hors** cotisations URSSAF réelles, virements
  internes et virements vers le compte perso d'Edgar.
- **Cotisations estimées** = brut × taux URSSAF. Taux par défaut **21,2 %**, modifiable dans
  Réglages (le taux exact est à confirmer sur l'espace URSSAF d'Edgar). On déduit l'estimation
  chaque mois au lieu d'attendre le prélèvement réel, qui arrive avec un décalage d'un mois ou
  d'un trimestre et fausserait deux mois sur trois.
- **Net** = brut − dépenses − cotisations estimées.
- **Le prélèvement URSSAF réel** qui passe sur Revolut est reconnu, classé « Cotisations » et
  exclu des dépenses : il n'est jamais compté en plus de l'estimation.
- **Entrées Revolut sans facture Stripe** (choix de Claude) : un apport d'Edgar depuis son compte
  perso et un versement Stripe sont des mouvements internes, exclus. Un remboursement
  fournisseur (Meta, Framer…) vient en déduction des dépenses de son poste. Toute autre entrée
  sans facture est comptée en brut mais signalée « à vérifier », reclassable à la main.
- **Date de départ** (choix de Claude) : rien avant le **15 octobre 2026** (relance de l'agence),
  date modifiable dans Réglages.
- **Clients** = clients distincts ayant payé au moins une fois sur la période (supposition de
  Claude, non contredite par Edgar).
- **Pas de double comptage**, ni des virements clients (Revolut + facture payée hors Stripe), ni
  des versements Stripe vers Revolut (mouvement interne).

## 5. Ce qu'Edgar voit (maquette validée)

En-tête façon hub : « Finance », sous-titre de l'objectif, sélecteur **Ce mois · 3 mois · Année**.

1. **Quatre cartes** : Brut, Dépenses, Net (détail : cotisations estimées déduites), Clients.
2. **Barre d'objectif** : net du mois comparé à **2 000 €**, avec le reste à atteindre (choix de
   Claude : l'objectif d'Edgar est fixé en net). Sur 3 mois ou Année, l'objectif est multiplié
   par le nombre de mois de la période.
3. **Graphique entrées / sorties**, 6 derniers mois, barres groupées (entrées en accent, sorties
   en gris).
4. **Derniers mouvements** (libellé, date, source Stripe ou Revolut, montant signé).
5. **Dépenses par poste.** Chaque sortie est classée automatiquement (par exemple Meta =
   Publicité, Framer = Outils) ; Edgar peut corriger le poste d'une ligne à la main, et la
   correction est conservée.

**Habillage « liquid glass »** : halo de couleur doux en haut de page, cartes, objectif et
sélecteur en verre dépoli, barre d'objectif et barres d'entrées en dégradé bleu. Edgar l'étend à
tout le hub dans **une autre conversation** qui crée dans `theme.css` et `globals.css` les
jetons et les classes `.hub-halo`, `.hub-verre`, `.hub-pilules-verre`,
`.hub-barre-progression`. **Finance ne crée pas ces classes et ne touche pas à ces deux
fichiers** : elle les utilise.

## 6. Contraintes

- Hub existant : Next.js 15, Supabase, recharts, page protégée par mot de passe, mise en ligne
  sur Vercel en cours. Conventions du hub à suivre (aucune couleur en dur, contraste AA, champs 16 px sous
  860 px, aucun défilement horizontal en 390 px).
- Le dépôt `livrables/hub-agence/` est utilisé en parallèle par une autre conversation (branche
  `refonte-visuelle`, modifications non commitées). Travailler dans un **worktree dédié**
  (`livrables/hub-agence-finance/`, branche `finance`), comme pour le module Ads. Choix de
  Claude : partir de `main` **après la fusion de `refonte-visuelle`**, qui porte les classes
  verre ; si elle tarde, partir de `refonte-visuelle` et rebaser ensuite. `module-ads` modifie
  sans doute `navigation.ts` : conflit attendu, à résoudre à la fusion.
- Choix de Claude : **pas de webhook**. Synchronisation planifiée (cron Vercel quotidien) plus un
  bouton « Actualiser » sur la page. Ça marche avant la mise en ligne publique et suffit à un
  suivi hebdomadaire.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Clés dans `.env.local` et dans Vercel, jamais affichées.

## 7. Laissé au constructeur

- Le stockage des mouvements (Supabase recommandé, nécessaire pour garder les corrections de
  poste) et la façon de rapprocher une entrée Revolut d'une facture Stripe.
- La liste des postes de dépense et les règles de classement automatique.
- Le détail des états vides, non configurés et en erreur, en suivant les composants existants
  (`not-connected`, bandeaux de l'accueil).
