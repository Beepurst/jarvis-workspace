# Analytics GA4 du Hub Agence : funnels, pages d'arrivée, sources

Date : 19/10/2026. Conçu avec Edgar dans la conversation du 19/10, maquette validée.

## Intention

Edgar veut piloter le funnel de kleakagency.fr depuis le hub : savoir quelle page d'arrivée convertit, où les visiteurs décrochent, quelle source amène des gens qui passent à l'action, et l'optimiser. Il veut voir **le funnel en premier** en ouvrant la page.

Le premier client viendra des pubs Meta (formulaire instantané). Ces leads ne passent pas par le site. Mélanger les deux fausserait le taux de conversion du site : la page montre donc **deux funnels séparés**, site et pubs Meta (décision de Claude, Edgar a demandé « le plus optimisé »).

## Ce qui existe déjà

- **Page `/analytics`** héritée de l'Orbikal Hub (`src/app/(app)/analytics/page.tsx`, `src/lib/analytics.ts`) : sessions, visiteurs uniques, pages vues, rebond, sessions par jour, pages les plus vues, répartition des canaux et sources. Lecture en direct de la GA4 Data API, cache `unstable_cache`, gestion du jour en cours (`partialDay`), « non configuré » et erreur gérés.
- **Branchée le 19/10** : compte de service `hub-ga4@hub-agence-kleak.iam.gserviceaccount.com` (lecteur sur la propriété), propriété `433476352` (flux `G-CHQ4FYE4Q8`). `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` et `GA4_PROPERTY_ID` sont posées dans `.env.local` et dans Vercel production, la production a été redéployée.
- **Restes Orbikal** : `analytics-scope.ts` et `ScopeSelector` (site/app). Un seul périmètre ici.
- **Navigation** : la rubrique `analytics` existe déjà dans `src/lib/navigation.ts` (section Chiffres).
- **Sélecteur de période** commun (`period.ts`, `PeriodSelector`) : aujourd'hui, hier, 7, 30, 90 jours, perso.

Données GA4 relevées le 19/10 (pour se faire une idée du volume) :
- 30 jours : 51 sessions, 47 visiteurs, 57 pages vues.
- 90 jours : l'accueil fait 163 sessions sur environ 200.
- Événements présents : `page_view`, `scroll`, `click`, `calendly_event_type_viewed`, `ads_conversion_Prise_de_rendez_vous_Ch_1`, « GA4 Event Coockie », `gtm.js`.

## Objectifs

1. **Funnel du site**, en tête de page : visiteurs → page de réservation vue → RDV pris depuis le site → clients signés.
2. **Funnel des pubs Meta**, à côté : (dépensé) → leads → RDV pris → clients signés.
3. **Pages d'arrivée** : par page d'entrée, visiteurs, temps engagé moyen, rebond, part qui atteint la réservation, RDV.
4. **Sources et campagnes** : par source (canal regroupé lisible), visiteurs, temps engagé, part vers la réservation, RDV ; détail par campagne UTM sous la source.
5. **Évolution** : visiteurs par jour et RDV par jour sur la période, avec des **repères** posés à la main (par exemple « bandeau cookies installé », « lancement campagne test-50 »).
6. Un seul sélecteur de période pilote tous les blocs.

## Hors périmètre

- **Tout travail sur le site Framer**, suspendu tant que le problème d'adresse mail et de domaine chez IONOS n'est pas réglé : bandeau cookies, événement de clic vers la réservation, remplacement de Calendly par Cal.com sur le site, UTM. La page doit fonctionner sans, et s'enrichir d'elle-même quand ce sera fait.
- Les dépenses Meta et les coûts par lead, RDV et client : ils viendront du module Ads (`docs/superpowers/specs/2026-10-18-module-ads-design.md`). Ici, la marche « Dépensé » et la ligne des coûts affichent « bientôt ».
- La page SEO (Search Console).
- Le trafic du hub lui-même.

## Anti-objectifs

- **Un taux qui ment.** Un pourcentage sur 3 visiteurs présenté comme un résultat. Les effectifs sont toujours affichés à côté des taux.
- **Un 0 % pour une donnée absente.** Une marche qui n'est pas encore mesurable (pas d'événement côté site, pas de module Ads) affiche « pas encore mesuré » ou « bientôt » avec la raison, jamais 0. C'est la même règle que l'onglet Finance (« Indisponible » plutôt que 0 €).
- **Additionner les leads Meta dans le funnel du site.**
- **Une chute de trafic mal lue** le jour où un bandeau cookies arrivera : c'est le rôle des repères.

## Contraintes

- Volume faible : environ 50 visiteurs par mois tant que les pubs ne tournent pas.
- Hub en production, déploiement à chaque push sur `main` : travailler sur une branche, fusionner après validation d'Edgar.
- Apparence : couleurs dans `src/app/theme.css` (vérifiées par `scripts/test-couleurs.ts` et `scripts/test-contraste.ts`), classes verre réservées aux chiffres et aux en-têtes, jamais aux listes. Les deux funnels sont des blocs de chiffres (verre autorisé), les tableaux non.
- Doit rester lisible sur iPhone : les deux funnels passent l'un sous l'autre, les tableaux défilent horizontalement ou réduisent leurs colonnes.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Tests dans `scripts/test-*.ts` (`npm test`), comme le reste du hub.

## Décisions prises

### Ordre de la page (maquette validée)

1. En-tête « Analytics », sous-titre, sélecteur de période.
2. Les deux funnels côte à côte (site à gauche, Meta à droite), l'un sous l'autre sur iPhone.
3. Pages d'arrivée.
4. Sources et campagnes.
5. Évolution, avec repères.

Les tuiles actuelles (sessions, visiteurs, pages vues, rebond) et la répartition des canaux sont remplacées par ces blocs ; les visiteurs et pages vues restent lisibles dans le funnel et les tableaux. Le sélecteur de périmètre Orbikal disparaît.

### Funnel : affichage

- Chaque marche : libellé, effectif, barre proportionnelle à la première marche.
- Entre deux marches : taux de passage. La plus grosse perte du funnel est mise en évidence.
- Une marche dont la source est le CRM porte une petite étiquette « CRM ».
- **Seuil d'échantillon** : sous 100 visiteurs (funnel du site) ou 30 leads (funnel Meta) sur la période, un avertissement dit que les taux sont indicatifs.

### Funnel du site : d'où vient chaque marche

| Marche | Source | Aujourd'hui |
|---|---|---|
| Visiteurs | GA4 `totalUsers` | mesuré |
| Page de réservation vue | GA4 : utilisateurs ayant vu `/calendly`, ou plus tard l'événement de clic vers Cal.com | mesuré via `/calendly` |
| RDV pris depuis le site | CRM : comptes `source = 'site'` créés dans la période | pas encore mesuré |
| Clients signés | CRM : ces mêmes comptes passés par `acompte_paye` ou au-delà | pas encore mesuré |

« Pas encore mesuré » tant qu'aucun compte `source = 'site'` n'existe ; dès le premier, les marches affichent leurs vrais chiffres, 0 compris.

Le site réserve aujourd'hui par l'ancien Calendly, qui ne remonte pas au CRM. Les marches 3 et 4 affichent donc « pas encore mesuré : la réservation du site ne passe pas encore par Cal.com » jusqu'à ce que le site soit modifié. Ce qui permettra au CRM de reconnaître un RDV venu du site : un paramètre sur le lien Cal.com du site (par exemple `canal=site` dans les métadonnées, déjà lues par `webhooks.ts`), et la création d'un compte quand la personne qui réserve est inconnue du CRM (aujourd'hui `appliquerEvenement` dans `db.ts` envoie une notification « RDV non rattaché » et la réception passe en erreur).

**Ce chantier modifie le CRM pour ce cas** (décision d'Edgar), même si le site ne sera branché sur Cal.com que plus tard. Ce lot touche le webhook Cal.com en production, il doit être testé à part et fusionné seulement après validation d'Edgar, de préférence pas pendant le lancement de la première campagne.

Règles retenues (décisions de Claude, sauf la première) :
- **Une réservation Cal.com d'une personne inconnue du CRM crée un compte**, au lieu de finir en « RDV non rattaché ». Nom et email pris sur la réservation, étape `rdv_pris`, `rdv_le`, `rdv_uid` renseignés, `lead_cree_le` = date de la réservation. La notification « Nouveau RDV » part comme pour un lead connu.
- **Origine** : nouvelle valeur `site` pour `comptes.source` et pour `canal_reservation`, ajoutée par une migration SQL qu'Edgar lance à la main sur Supabase (même procédure que les lots précédents). Une réservation avec `canal=site` dans ses métadonnées donne `source = 'site'` et `canal_reservation = 'site'` ; une réservation orpheline sans ce paramètre donne `source = 'autre'` et `canal_reservation = 'direct'`. `db.ts` ne doit plus ramener `site` à `direct`.
- **Pas de séquence de relance Brevo** pour ces comptes : la séquence sert à obtenir un RDV, ils en ont déjà un. Ils apparaissent normalement dans le pipeline.
- Un compte connu (même email) qui réserve par le lien du site garde son origine : on ne réécrit pas `source`.
- Annulation et report d'un RDV d'un compte créé ainsi : même traitement que pour les autres comptes.

### Funnel Meta : d'où vient chaque marche

| Marche | Source |
|---|---|
| Dépensé | module Ads, « bientôt » |
| Leads | CRM : comptes venus du formulaire instantané (`source = 'formulaire'`), `lead_cree_le` dans la période |
| RDV pris | ces leads ayant un événement `rdv_reserve` |
| Clients signés | ces leads passés à `acompte_paye` ou au-delà (`en_production`, `livre`, `solde`) |

**Logique de cohorte** : on suit les leads créés dans la période, puis on regarde jusqu'où ils sont allés (à ce jour), plutôt que de compter des RDV et des signatures survenus dans la période, qui peuvent venir de leads plus anciens. Ça garde des taux entre 0 et 100 %.

Règles de comptage (décisions de Claude) :
- **Une marche atteinte reste atteinte.** On lit l'historique (`evenements`), pas l'étape actuelle : un lead qui a eu un `rdv_reserve` compte dans « RDV pris » même si le RDV a été annulé ensuite (l'étape repasse à `nouveau_lead`, mais le funnel mesure l'intention). Un compte passé par `acompte_paye` compte dans « signés » même s'il finit `perdu`. Pour les étapes, lire les `etape_changee` ; à défaut d'historique, se rabattre sur l'étape actuelle.
- **Un compte appartient à un seul funnel**, celui de son origine : un lead venu du formulaire instantané reste dans le funnel Meta même s'il réserve par le lien du site.

### Pages d'arrivée et sources

- Pages d'arrivée : dimension GA4 `landingPage`, triées par visiteurs. Colonnes : visiteurs, temps engagé moyen, rebond, part vers la réservation (même définition que la marche 2), RDV (CRM, quand l'origine du site sera mesurée ; sinon « pas encore mesuré » une fois en en-tête de colonne, pas sur chaque ligne).
- Sources : canal regroupé lisible (réutiliser `traffic-source.ts`), avec le détail par campagne (`sessionCampaignName`) sous la source quand il y en a.
- **Seuil de ligne** : un taux calculé sur moins de 20 visiteurs est grisé.
- Les pages `(not set)` sont regroupées sous un libellé clair.

### Évolution et repères

- Courbe des visiteurs par jour, points des RDV par jour (RDV tous canaux confondus, sur la date de réservation).
- **Repères** : date et libellé, saisis par Edgar, stockés dans Supabase, affichés en ligne verticale sur la courbe. On peut en ajouter et en supprimer.

## Laissé au constructeur

- La forme exacte des requêtes GA4 (une requête `runReport` par bloc ou des `batchRunReports`), la stratégie de cache, la découpe des fichiers.
- Le moyen d'identifier la marche « page de réservation vue » : une liste de chemins et de noms d'événements dans un seul endroit du code, pour que le jour où le site enverra un événement Cal.com, il suffise d'y ajouter son nom.
- Où se saisissent les repères (sur la page ou dans Réglages), pourvu que ce soit simple.
- Le rendu mobile des tableaux.
- Le nettoyage des restes Orbikal (`analytics-scope.ts`, `ScopeSelector`), s'ils ne servent plus ailleurs.
