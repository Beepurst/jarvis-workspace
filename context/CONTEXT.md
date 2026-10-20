# CONTEXT.md

> Mon contexte personnel et professionnel pour mon Jarvis.
> Mis à jour au fil du temps par Claude, via `/update` ou quand un changement important est détecté.
>
> Dernière mise à jour : 20 octobre 2026

---

## Qui je suis

- **Prénom :** Edgar
- **Ville / Pays :** Cergy, France
- **Situation actuelle :** Je relance mon agence de création de sites internet, pour faire rentrer du cash rapidement
- **Profil :** Marketing, automatisation (n8n, Make) et données. Fondateur d'Orbikal, un SaaS de dashboard marketing multi-connecteurs

---

## Ce que je fais

### Activité principale : l'agence de création de sites

Je reprends mon agence de création de sites internet, Kleak Agency, **et elle reste une agence Framer** (décision finale du 18/10, après un test comparatif). Le but est simple : **générer des revenus rapidement**, la prestation de service étant le chemin le plus court (une mission peut payer dans le mois, là où un SaaS met souvent 12 à 24 mois à remplacer un salaire).

| | |
|---|---|
| Nom | **Kleak Agency** (nom de l'ancienne agence Framer, repris). Domaine `kleakagency.fr`, page Facebook toujours active. **Compte publicitaire Meta « Kleak Pub »**, l'ancien compte, conservé (le « nouveau compte » du 19/10 était une erreur, corrigée le 20/10). App Meta « Kleak Hub » publiée le 20/10, jeton d'utilisateur système sans expiration. Formulaire instantané refait à zéro |
| Activité | Création de sites internet, en prestation |
| Outil de production | **Framer**, piloté par Claude Code via l'outil `@framer/agent` (décision finale du 18/10) |
| Cible | **PME françaises de tous secteurs**, sites vitrines. Pas de spécialisation sectorielle (décision du 18/10, comme l'ancienne agence) |
| Objectif | Cash rapide |
| Statut juridique | Micro-entreprise, BIC prestations de services |

### Framer : décision finale du 18 octobre

Le matin du 18/10, Webflow a été choisi, puis abandonné le jour même après un test réel : **Kleak reste une agence Framer.**

- **Le test :** Claude Code construit des sites Framer complets via l'outil `@framer/agent` (projet `TEST-CLAUDE`). La home de `kleakagency.fr` a été recréée avec ses animations en environ 16 min. Atelier Hauteville a été construit d'après le brief complet (11 sections, CMS des réalisations, menu burger, formulaire, 3 tailles d'écran) en environ 11 min de construction, sans retouche d'Edgar. La V1 Webflow du même brief était inmontrable.
- **Pourquoi Framer :** la contrainte est la capacité de production, pas l'acquisition (Meta Ads). Un prospect à 999 € achète un site, un délai et un prix, pas un outil. Les prix actuels sont calés sur Framer, le site de Kleak y est déjà, et Edgar connaît l'outil.
- **Exigence d'Edgar :** les sites doivent sortir parfaits en **2 ou 3 allers-retours maximum**. Pour ça, on travaille ensemble **en amont** : la direction (structure, ambiance, photos, textes) est validée avant de construire, puis chaque site passe la checklist qualité (`livrables/process/checklist-qualite-site.md`), performance comprise.
- **Point faible révélé par le test : la performance.** Atelier Hauteville a obtenu 33 sur mobile et 68 sur bureau au premier passage PageSpeed (animations sur l'accroche, images trop lourdes, trop de graisses de police). Les règles qui en découlent sont dans la checklist, section 9.

Comparatif fait le matin du 18/10, avant le test :

| | Framer | Webflow |
|---|---|---|
| Pour | Production très rapide (logique Figma), animations natives, moins cher pour le client, adapté aux sites vitrines de PME | CMS bien plus solide, édition client mature avec rôles, paniers plus élevés, écosystème agences établi |
| Contre | Marché saturé de freelances et de templates à 50 €, "je fais du Framer" ne distingue pas | Courbe d'apprentissage forte, plus lent à produire, cycles de vente plus longs, tarifs en hausse depuis 2024-2025 |
| Logique de marge | La marge vient de la vitesse (livraison en 1 à 3 semaines) | La marge vient du ticket et de la maintenance récurrente |

### Le site de démo Atelier Hauteville

Cuisiniste haut de gamme fictif à Cergy, affiché comme entreprise fictive. Direction artistique crème et noyer, titres à empattements, page d'accueil en 11 sections jusqu'au formulaire de rendez-vous, SEO local de base. Briefs desktop et mobile dans `context/import/`.

- **V1 publiée le 15/10** sur https://demo-cuisine.webflow.io/ via le connecteur, puis auditée (`livrables/demos/atelier-hauteville/2026-10-15-audit-v1.md`). Structure saine, mais **pas présentable** : polices non chargées, la moitié des images hors sujet, formulaire avec "Example Text".
- Checklist qualité tirée de l'audit : `livrables/process/checklist-qualite-site.md`.
- **Version Framer construite le 18/10** sur la page `/atelier-hauteville` du projet Framer `TEST-CLAUDE`, publiée en test sur `massive-account-916652.framer.app/atelier-hauteville`. Correctifs de performance appliqués le jour même, nouveau passage PageSpeed à faire après republication.
- La version Webflow et les skills Webflow (`livrables/skills-webflow/`) sont abandonnées.
- La démo sert de réalisation pour les pubs Meta et de socle aux sections réutilisables.

### Le positionnement à construire

Recommandations posées, pas encore validées :

- **Le différenciateur n'est pas l'outil**, c'est mon profil marketing, automatisation et données. Une offre "site + tracking + automatisations + reporting" se vend plus cher qu'un site seul.
- **Une offre packagée plutôt que du sur-mesure.** Par exemple "site vitrine livré en 10 jours, X €" : prix fixe et périmètre clair se vendent plus vite.
- **Le premier contrat viendra de Meta Ads** (aucun ancien client ni réseau à relancer, voir « Acquisition »).
- **Orbikal recyclé en reporting mensuel** inclus dans un forfait de maintenance : revenus récurrents pour l'agence, différence nette face aux freelances, et un SaaS qui reste vivant avec de vrais utilisateurs.

---

## Orbikal : en pause

SaaS de dashboard marketing multi-connecteurs, jusqu'ici mon activité principale (environ 6 h par jour). **Mis en pause le 15 octobre 2026, pas arrêté.**

- Développement arrêté, l'existant reste en ligne, nouvelles inscriptions à fermer si besoin
- Coût de maintenance minimale estimé à quelques dizaines d'euros par mois (Vercel, Supabase, domaine), **à vérifier sur les factures**
- Les validations d'apps Meta et Google sont longues à obtenir et peuvent expirer si l'app est abandonnée
- **Stripe est en live.** S'il y a des abonnés payants : les prévenir, arrêter la facturation, traiter leurs données (RGPD). Pas de coupure du jour au lendemain
- Point à refaire **mi-janvier 2027** (3 mois)

---

## Projets arrêtés

- **Boutique ecommerce avec Forqan** (dropshipping, boutique La Sente, tapis de léchage chien) : arrêtée le 15 octobre 2026, sans avoir réalisé de vente. Tout le contexte, les agents, les skills et les livrables sont archivés dans `archive/ecom/`.
- **Hub Ecom** (`livrables/hub/`, en ligne sur https://hub-ecom-phi.vercel.app) : laissé en place, plus utilisé. Dépôt git séparé, non touché.

---

## Mes objectifs

- **2 000 € nets par mois minimum, à partir de décembre 2026.**
- Soit environ **2 550 € de chiffre d'affaires par mois** (cotisations micro BIC prestations de services de **21,2 %**, taux confirmé par Edgar le 19/10 ; impôt sur le revenu en plus).
- Traduction : environ 2 sites à 1 500 € signés d'ici mi-novembre (acomptes de 50 % en novembre, soldes en décembre), puis environ 1,5 site par mois à 1 800 €, moins à mesure que la maintenance récurrente s'accumule.
- Jugement posé le 15/10 : faisable mais serré. Il supposait le réseau et les anciens clients, qui n'existent pas : depuis le 18/10, tout repose sur Meta Ads (voir « Acquisition »).
- **Recalé le 16/10 sur les vrais temps** (4 à 5 journées de 8 h par site, soit 31 à 37 €/h aux nouveaux prix) : l'objectif n'est tenable qu'avec deux leviers, retenus :
  1. **Production plafonnée** grâce aux sections réutilisables : 14 h pour un Essentiel, 24 h pour un Pro (45 à 50 €/h).
  2. **6 h par jour jusqu'à fin décembre**, puis retour à 4 h.
- Avec ces leviers, **1 Pro + 1 Essentiel signés d'ici mi-novembre** suffisent pour décembre.

---

## Où j'en suis

**Statut au 20 octobre 2026 : Kleak Agency relancée en agence Framer, aucun client, aucun encaissement.**

| Chantier | Statut |
|----------|--------|
| Outil | **Framer**, décidé le 18/10 après test. Production pilotée par Claude Code |
| Offre et prix | Revue le 20/10, **3 formules** : **One page 699 €** (porte d'entrée petit budget, 1 page, 5 jours), **Essentiel 999 €** (3 pages, fiche Google optimisée, 7 jours), **Pro 1 800 €** (5 pages, sur mesure, SEO local, mesure, 10 jours). Option automatisation 400 €. Maintenance 49 €/mois (one page) ou 90 €/mois (Essentiel, Pro), 12 mois, **hébergement Framer sur le compte Kleak inclus**, jamais vendu seul. Paiement en une fois (acompte 50 %) ou **en 6 fois sans frais** (prélèvement Stripe, maintenance obligatoire, site à Kleak jusqu'au dernier versement). Fiche client et note interne dans `livrables/offre/`. Page tarifs à ajouter sur `kleakagency.fr` après le problème IONOS. Reste : téléphone, CGV |
| Prospection | **Meta Ads uniquement** (décision du 18/10), voir « Acquisition » plus bas. Aucun ancien client ni réseau à relancer |
| Clients | Aucun |
| Site de démo | V1 et V2 Framer publiées en test le 18/10. V2 : 77 à 85 sur mobile, 95 sur bureau, accessibilité 100 |
| Site Kleak | `kleakagency.fr` sur Framer, on le garde. **Travaux en suspens** tant que le problème d'adresse mail et de domaine chez IONOS n'est pas réglé (20/10). À faire ensuite : remplacer l'ancien Calendly par Cal.com avec `canal=site` dans le lien (tâche dans la to-do), vérifier le bandeau cookies (GA4 semble passer par Google Tag Manager) |
| Orbikal | En pause, mise en sommeil à organiser (abonnés, facturation Stripe) |
| Outil interne | Hub Agence (`livrables/hub-agence/`, dépôt `Beepurst/hub-agence-kleak`) **en production** sur https://hub-agence-kleak.vercel.app, refondu le 19/10 (thème clair, Notion/Apple, touche verre). **To-do du lendemain** en ligne le 19/10 : 6 thématiques (Prospection, Réunions, Production, Clients, Admin et finances, Outils), onglets Aujourd'hui, Demain et Historique, préparée chaque soir avec Claude par `/demain`, Notion abandonné. CRM : Cal.com et Google Sheet branchés, **Brevo en attente** (DMARC chez IONOS, clé API, 4 modèles, webhook). **Module Ads** construit sur la branche `module-ads` (worktree `livrables/hub-agence-ads/`), **pas encore en production** : créatives, campagnes envoyées en pause dans Meta (création validée en réel le 20/10), jusqu'à 5 textes, 5 titres et 5 descriptions par pub, suivi complet (impressions, CTR, CPM, fréquence, résultats par texte et par titre, qualité des leads par pub), seuils dans Réglages, alertes push quotidiennes sur l'iPhone, lecture et dépôt pour l'agent `media-buyer`. Générateur Groq retiré. Reste la validation réelle avec Edgar (SQL `supabase/media-buyer.sql`, campagne de test à plusieurs textes, `ADS_AGENT_SECRET` sur Vercel, fusion). **Onglet Finance** (lot 1, Stripe seul) **en production** depuis le 19/10 (`/finance`) : brut, net après frais et cotisations estimées à 21,2 %, clients, objectif 2 000 € nets. Stripe Kleak connecté par une clé restreinte en lecture seule. Lot 2 Revolut Business à l'ouverture du compte. **Onglet Analytics en production le 20/10** (`/analytics`) : GA4 de kleakagency.fr branché, funnel du site et funnel des pubs Meta séparés, pages d'arrivée, sources et campagnes, évolution avec repères, trafic des aperçus Framer exclu. Une réservation Cal.com d'une personne inconnue crée désormais un compte (origine « site » si le lien porte `canal=site`). Volume actuel : environ 50 visiteurs par mois. **Retouche des titres** (tailles plus marquées dans tout le hub) prévue après la fusion de Finance lot 2 et du module Ads |
| Chiffre d'affaires | 0 € (objectif : 2 550 €/mois dès décembre) |

### Prochain chantier

Préparer la première campagne Meta, visée vers le 25 octobre. **Fait :** les 3 visuels du test (A marque, B prix, D avant / après avec la réalisation Accueil Sénior Assistance), post et story, et leurs textes d'annonce, produits par l'agent `createur-creas` (`livrables/creas-meta/`, voir `TEXTES-ANNONCES.md`). **Reste :** le formulaire instantané à créer sur « Kleak Pub » (libellés des questions identiques à ceux lus par le CRM, case WhatsApp, lien vers la politique de confidentialité), la politique de confidentialité à mettre à jour (Brevo, Cal.com, WhatsApp), le branchement de Brevo pour l'email d'invitation (le CRM est en ligne, Cal.com et le Sheet sont branchés), prévenir Accueil Sénior Assistance. La première campagne peut partir du hub une fois le module Ads en production, préparée avec l'agent `media-buyer` (textes multiples, budget, critère de fin), qui fait ensuite les bilans à partir des alertes. En parallèle : coordonnées sur la fiche offre et CGV de prestation.

---

## Acquisition

**Canal unique pour le moment : Meta Ads**, ce qui marchait le mieux pour l'ancienne agence.

- Pubs statiques, formulaire instantané Meta, puis email et/ou WhatsApp automatique pour que le lead prenne rendez-vous.
- **Historique mesuré il y a un an, sur l'ancien compte** (repère d'il y a un an, à remesurer) : 2 € par lead, 1 rendez-vous pour 3 leads, 1 signature pour 3 à 4 rendez-vous, soit environ 10 à 12 leads par client.
- **Budget : 200 € par mois.**
- Projection à 5 € par lead (chiffres d'il y a un an, et novembre plus cher) : 40 leads, environ 13 rendez-vous, environ 3,5 signatures par mois, soit plus que la capacité. Le budget n'est pas le frein, la capacité de production l'est.
- Garde-fous : test de 50 € sur 5 à 7 jours pour remesurer le coût par lead avant d'engager le reste ; question de budget dans le formulaire pour filtrer ; consentement WhatsApp explicite et mention RGPD dans le formulaire.
- Avant la première pub : démo en ligne comme réalisation, formulaire mis à jour, automatisation, 2 ou 3 visuels.

---

## Mes outils

- Framer, outil de production, piloté par Claude Code via `@framer/agent`. Webflow abandonné le 18/10 (connecteur encore branché)
- n8n, Make
- Orbikal (mon propre dashboard marketing)
- Claude / Claude Code (ce workspace)
- Hub Agence, mon outil interne (pipeline CRM, to-do du lendemain, briefs, bibliothèque de références, finance, puis devis et factures), copié de l'Orbikal Hub. La to-do vit dans le hub, plus dans Notion

### Style de communication préféré

Direct et efficace, avec des explications détaillées quand c'est utile. Honnêteté brute sur les chiffres et la viabilité des idées.

---

## Points à clarifier

- **Abonnés payants sur Orbikal ?** Conditionne la façon de mettre en pause
- **Seuil de franchise de TVA** applicable (à vérifier sur l'espace URSSAF). Taux de cotisation confirmé : 21,2 %
- **Téléphone de l’agence** à faire figurer sur la fiche offre (email : contact@kleakagency.fr, boîte IONOS)
- **Compte Revolut Business Kleak** à ouvrir (virements clients, toutes les dépenses de l'agence), puis vérifier l'accès API selon l'offre pour le lot 2 de l'onglet Finance
- **Coût par lead actuel** sur Meta, à remesurer (le chiffre de 2 € date d'un an)
- **Ce que devient la collaboration avec Forqan** après l'arrêt de l'ecom

---

## Notes importantes

> Cette section se remplira au fil des sessions.
