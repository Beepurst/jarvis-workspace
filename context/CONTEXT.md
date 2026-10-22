# CONTEXT.md

> Mon contexte personnel et professionnel pour mon Jarvis.
> Mis à jour au fil du temps par Claude, via `/update` ou quand un changement important est détecté.
>
> Dernière mise à jour : 22 octobre 2026

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
| Outil de production | **Framer**, piloté par Claude Code via l'outil `@framer/agent` (décision finale du 18/10). **Compte Framer de l'agence : `kleakagency@gmail.com`** (décision du 22/10), celui des tests, qui hébergera tous les sites clients. Le compte lié à la boîte IONOS ne sert plus qu'au site de Kleak, à transférer |
| Cible | **PME françaises de tous secteurs**, sites vitrines. Pas de spécialisation sectorielle (décision du 18/10, comme l'ancienne agence) |
| Objectif | Cash rapide |
| Statut juridique | Micro-entreprise, BIC prestations de services |

### Framer : décision finale du 18 octobre

Le matin du 18/10, Webflow a été choisi, puis abandonné le jour même après un test réel : **Kleak reste une agence Framer.**

- **Le test :** Claude Code construit des sites Framer complets via l'outil `@framer/agent` (projet `TEST-CLAUDE`). La home de `kleakagency.fr` a été recréée avec ses animations en environ 16 min. Atelier Hauteville a été construit d'après le brief complet (11 sections, CMS des réalisations, menu burger, formulaire, 3 tailles d'écran) en environ 11 min de construction, sans retouche d'Edgar. La V1 Webflow du même brief était inmontrable.
- **Pourquoi Framer :** la contrainte est la capacité de production, pas l'acquisition (Meta Ads). Un prospect à 999 € achète un site, un délai et un prix, pas un outil. Les prix actuels sont calés sur Framer, le site de Kleak y est déjà, et Edgar connaît l'outil.
- **Exigence d'Edgar :** les sites doivent sortir parfaits en **2 ou 3 allers-retours maximum**. Pour ça, on travaille ensemble **en amont** : la direction (structure, ambiance, photos, textes) est validée avant de construire, puis chaque site passe la checklist qualité (`livrables/process/checklist-qualite-site.md`), performance comprise.
- **Méthode de production depuis le 21/10** (après un test One page, Garnier Plomberie, jugé « vieillot, basique, pas Framer ») : une **charte de style maison** fixe le niveau (`livrables/process/style-maison.md`, tirée de 20 modèles Framer mesurés) ; les modèles Framer servent d'**inspiration, en mélangeant plusieurs, jamais de base dupliquée** ; Claude fait d'abord une **maquette HTML** de la page, validée par Edgar, puis la session Framer (`/site`) la **reproduit** au lieu de concevoir. Edgar fait les retouches finales directement dans Framer.
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

**Statut au 21 octobre 2026 : Kleak Agency relancée en agence Framer, aucun client, aucun encaissement.**

| Chantier | Statut |
|----------|--------|
| Outil | **Framer**, décidé le 18/10 après test. Production pilotée par Claude Code |
| Offre et prix | Revue le 20/10, **3 formules** : **One page 699 €** (porte d'entrée petit budget, 1 page, 5 jours), **Essentiel 999 €** (3 pages, fiche Google optimisée, 7 jours), **Pro 1 800 €** (5 pages, sur mesure, SEO local, mesure, 10 jours). Option automatisation 400 €. Maintenance 49 €/mois (one page) ou 90 €/mois (Essentiel, Pro), **sans engagement, préavis de 2 mois** (décision du 21/10, l'engagement de 12 mois est abandonné), **hébergement Framer sur le compte Kleak inclus**, jamais vendu seul. **Suivi avis 190 €/mois** (décision du 22/10), proposé dès la signature à la place de la maintenance : plus d'avis Google, tous répondus, rien à faire pour le client (demande d'avis, réponses, publications sur la fiche, bilan mensuel), sans engagement, démarrage après le dernier versement en paiement en 6 fois ; message et QR code d'avis offerts à chaque livraison. Paiement en une fois (acompte 50 %) ou **en 6 fois sans frais** (prélèvement Stripe, maintenance obligatoire, site à Kleak jusqu'au dernier versement). Fiche client et note interne dans `livrables/offre/`. Page tarifs à ajouter sur `kleakagency.fr` après le problème IONOS. **Devis et factures** (décision du 21/10) : devis générés par le Hub Agence après le RDV, envoyés depuis `kleakagency@gmail.com` en brouillon Gmail, signés et renvoyés par le client ; factures créées par le hub dans Stripe, **nouvelle série de numéros** avec un premier numéro élevé et un préfixe propre (l'EI a déjà facturé avec ce SIRET), aucune facture Kleak émise ailleurs. Reste : téléphone, CGV (rédigées pendant la construction du module devis) |
| Prospection | **Meta Ads uniquement** (décision du 18/10), voir « Acquisition » plus bas. Aucun ancien client ni réseau à relancer. **Closing fait par Edgar** : pas de closeur avant 15 RDV menés, un script testé et une capacité de production pour absorber plus de ventes (décision du 21/10, `livrables/closing/business-plan-closing.md`). **Parcours de vente analysé le 21/10** (`livrables/process/parcours-client-analyse.md`) : le plus faible est ce qui suit le lead (aucune alerte de nouveau lead, pas de rappels de RDV, devis et paiement pas prêts). **RDV découverte en visio sur Cal Video** (transcription automatique, tl;dv Pro en plan B), aucun rappel Cal.com réglé à ce jour, des sites de l'ancienne agence encore en ligne à montrer |
| Clients | Aucun |
| Site de démo | V1 et V2 Framer publiées en test le 18/10. V2 : 77 à 85 sur mobile, 95 sur bureau, accessibilité 100 |
| Site Kleak | `kleakagency.fr` sur Framer, on le garde. **Travaux en suspens** tant que le problème d'adresse mail et de domaine chez IONOS n'est pas réglé (20/10). **Cause (22/10)** : compte IONOS coupé pour une facture en retard, réglée le 19/10, déblocage en cours avec IONOS. La boîte IONOS étant coupée, **Edgar n'a plus accès au compte Framer du site** (connexion par lien envoyé sur cette boîte). Le site reste en ligne. Dès la boîte rétablie : se connecter, puis **transférer le site sur le compte `kleakagency@gmail.com`**. En parallèle : demande de récupération au support Framer, vérifier la carte qui paie l'abonnement du site. À faire ensuite : remplacer l'ancien Calendly par Cal.com avec `canal=site` dans le lien (tâche dans la to-do), vérifier le bandeau cookies (GA4 semble passer par Google Tag Manager) |
| SEO | Décidé le 21/10 : **cible nationale** (patrons de PME et artisans), local mis de côté (la fiche Google Business Profile, domiciliée à l'étranger, sera à refaire le jour où on s'y met). Pas d'outil payant, Search Console tranche. Agent `redacteur-seo` : 1 article par semaine, Edgar relit, publication dans le CMS Framer bloquée tant qu'IONOS n'est pas réglé. Search Console branché au hub (onglet SEO, propriété `sc-domain:kleakagency.fr`). Point de départ : 16 clics en 90 jours, presque tous sur la marque. Premier article (paiement en plusieurs fois) écrit. Stratégie dans `livrables/seo/` |
| Orbikal | En pause, mise en sommeil à organiser (abonnés, facturation Stripe) |
| Outil interne | Hub Agence (`livrables/hub-agence/`, dépôt `Beepurst/hub-agence-kleak`) **en production** sur https://hub-agence-kleak.vercel.app, refondu le 19/10 (thème clair, Notion/Apple, touche verre). **To-do du lendemain** en ligne le 19/10 : 6 thématiques (Prospection, Réunions, Production, Clients, Admin et finances, Outils), onglets Aujourd'hui, Demain et Historique, préparée chaque soir avec Claude par `/demain`, Notion abandonné. CRM : Cal.com et Google Sheet branchés, **Brevo en attente** (DMARC chez IONOS, clé API, 4 modèles, webhook). **Module Ads en production depuis le 20/10** : créatives, campagnes envoyées en pause dans Meta (création validée en réel le 20/10), jusqu'à 5 textes, 5 titres et 5 descriptions par pub, suivi complet (impressions, CTR, CPM, fréquence, résultats par texte et par titre, qualité des leads par pub), seuils dans Réglages, alertes push quotidiennes sur l'iPhone, lecture et dépôt pour l'agent `media-buyer`. Générateur Groq retiré. Plusieurs textes validés en réel : dès qu'une pub a plus d'un texte, titre ou description, le hub envoie le visuel 4:5 seul (Meta refuse plusieurs textes avec un visuel story séparé), avec les options de texte de Meta. Reste : premier dépôt des textes de A, B et D par l'agent. **Onglet Finance en production** (`/finance`) : lot 1 Stripe le 19/10 (brut, net après frais et cotisations estimées à 21,2 %, clients, objectif 2 000 € nets, clé Stripe restreinte en lecture seule) ; **lot 2 le 20/10** : dépenses du compte **Revolut Pro** par import du relevé CSV depuis l'iPhone (pas d'API sur un compte Pro), classées par poste avec corrections rétroactives par fournisseur, et **dépenses Meta synchronisées chaque nuit** (Meta fait foi pour la publicité, lignes Facebook du relevé exclues pour ne pas compter deux fois). **Onglet Analytics en production le 20/10** (`/analytics`) : GA4 de kleakagency.fr branché, funnel du site et funnel des pubs Meta séparés, pages d'arrivée, sources et campagnes, évolution avec repères, trafic des aperçus Framer exclu. Une réservation Cal.com d'une personne inconnue crée désormais un compte (origine « site » si le lien porte `canal=site`). Volume actuel : environ 50 visiteurs par mois. **Retouche des titres** (tailles plus marquées dans tout le hub) prévue après la fusion de Finance lot 2 et du module Ads. **Ventes** en production le 20/10 : formule, paiement en une fois ou en 6 fois, maintenance et échéancier rapproché de Stripe sur la fiche client, section « Ventes signées » dans Finance. **Bibliothèque** en production le 21/10 : fiches de sections avec fiche technique courte, déposées ou retravaillées par l'agent `bibliothecaire` (Sonnet), prompt de section et prompt de page (depuis le brief, épingles par page) à coller dans une session de construction ouverte avec `/site`. Animations filmées et mesurées en recette, 8 fiches à jour, test de construction validé le 21/10 |
| Chiffre d'affaires | 0 € (objectif : 2 550 €/mois dès décembre) |

### Prochain chantier

Lancer le premier test Meta, visé vers le 25 octobre : **J, K et D**, 7 € par jour pendant 7 jours (49 €), 1 campagne, 1 ensemble, 3 pubs, préparé par l'agent `media-buyer` (plan dans `livrables/media-buying/journal.md`). Edgar crée la campagne en pause depuis le hub, puis pose une date de fin à J+7 dans le Gestionnaire.

- **Les créas** (`livrables/creas-meta/`), toutes en post et en story dans le hub : J (avis clients, sans prix), K (devis One page 699 €, prix fixe), D (avant / après, One page 699 € en 5 jours) ; A (marque) et B (One page 699 € en 5 jours) hors du test, B faisant doublon avec K. Nouvelle DA du 21/10 pour J et K : fond sombre, verre, sobre, une idée par créa, le prix seulement sur certaines.
- **Les pubs vendent le One page en premier** (B et D passées de l'Essentiel 999 € au One page 699 € le 21/10).
- **Règles des pubs** (décisions du 21/10) : textes courts, à l'essentiel ; jamais « Je m'appelle Edgar » ni rien qui dise qui est derrière l'agence ; aucune mention de TVA ni de l'article 293 B dans les pubs (elle reste sur les devis et factures) ; aucun engagement de 12 mois.
- **Reste avant d'activer :** un lead de test ; prévenir Accueil Sénior Assistance (D montre leur site) ; la politique de confidentialité (Brevo, Cal.com, WhatsApp). Brevo reste bloqué par le DMARC chez IONOS, donc les textes ne promettent plus de message immédiat.
- **Test de production en cours** (`livrables/clients/test-garnier-plomberie/`) : maquette HTML validée le 21/10, construction Framer V2 à lancer avec `prompt-construction-v2.md`, puis checklist, PageSpeed et bilan (allers-retours, temps réel face aux 5 jours vendus à 699 €). Ensuite : bibliothèque du hub remplie avec les sections retenues, brief du hub capable de porter questionnaire, planche et textes, colonne One page dans le questionnaire de cadrage.
- **En parallèle :** le script d'appel découverte et la fiche de RDV (`livrables/closing/`), les coordonnées sur la fiche offre, les CGV de prestation (préavis de 2 mois sur la maintenance).
- **Module devis du hub, à construire avant le premier RDV** (spec `docs/superpowers/specs/2026-10-21-devis-automatiques-design.md`, plan `docs/superpowers/plans/2026-10-21-devis-automatiques.md`) : transcription du RDV, résumé par Groq (gratuit) avec points d'attention, devis prérempli, brouillon Gmail, relances email J+3 et J+7 automatiques et WhatsApp en un geste, devis signé → vente → factures Stripe.
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
- **Premier vrai relevé Revolut Pro** à importer dans le hub dès les premières opérations, pour vérifier les hypothèses de lecture (dates, frais, libellés des versements Stripe, virements perso, URSSAF)
- **Coût par lead actuel** sur Meta, à remesurer (le chiffre de 2 € date d'un an)
- **Ce que devient la collaboration avec Forqan** après l'arrêt de l'ecom

---

## Notes importantes

> Cette section se remplira au fil des sessions.
