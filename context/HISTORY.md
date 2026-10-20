# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> L'historique du projet ecom (août à septembre 2026) est conservé dans `archive/ecom/context/HISTORY.md`.

---

## 2026-10-20

### Onglet Finance, lot 2 en production : Revolut Pro et dépenses Meta

- **Revolut Pro au lieu de Revolut Business** : Edgar a ouvert un compte Pro dans son Revolut perso, avec son propre IBAN. Pas d'API pour ce compte : les dépenses arrivent par **import du relevé CSV depuis l'app iPhone du hub**, environ une fois par mois. Agrégateur bancaire écarté (payant, couverture incertaine).
- **Règles validées par Edgar** : tous les clients paient par Stripe, donc les entrées Revolut ne comptent jamais en chiffre d'affaires ; seules les lignes terminées comptent ; réimport sans doublon ; postes Publicité, Outils et abonnements, Banque et frais, Matériel, Formation, Déplacements, Autre ; une correction de poste s'applique à tout le fournisseur, **rétroactivement**.
- **Meta fait foi pour la publicité** (ajout d'Edgar) : dépense quotidienne du Gestionnaire de publicités synchronisée par le cron et Actualiser ; les lignes Facebook du relevé passent en « couvert par Meta », hors dépenses. « Indisponible » plutôt que 0 € si Meta ne répond pas.
- **Jeton Meta** : jeton d'utilisateur système distinct de celui du module Ads, mais avec les mêmes permissions larges ; Edgar le garde, la lecture seule est assurée par le code. Variables posées dans Vercel (production et prévisualisation), clé Stripe ajoutée en prévisualisation.
- Construit en sous-agents (9 tâches, relecture par tâche et relecture finale), essai de bout en bout sur la vraie base puis nettoyage, validé par Edgar sur iPhone, **en production le 20/10**. Spec `docs/superpowers/specs/2026-10-20-finance-lot-2-revolut-csv-design.md`, plan `docs/superpowers/plans/2026-10-20-finance-lot-2.md`.
- À faire : importer le premier vrai relevé avec des opérations pour vérifier les hypothèses de lecture.

### Agent media buyer et module Ads renforcé

- **Compte publicitaire :** on travaille sur l'ancien compte « Kleak Pub ». Le « nouveau compte » du 19/10 était une erreur d'Edgar.
- **App Meta « Kleak Hub » publiée** (elle était en mode Développement, ce qui bloquait la création des pubs). La création d'une campagne en pause depuis le hub est validée en réel.
- **Décisions d'Edgar :**
  - un agent `media-buyer` vit dans Claude Code, pas dans le hub (API Claude écartée après comparaison des coûts) ;
  - il recommande, Edgar exécute dans le Gestionnaire ;
  - plusieurs textes, titres et descriptions par pub ;
  - toutes les données nécessaires au diagnostic ;
  - notifications push sur l'iPhone.
- **Construit sur la branche `module-ads`** (spec `docs/superpowers/specs/2026-10-20-media-buyer-design.md`, plan associé, relecture à chaque tâche puis relecture finale, 403 tests) :
  - jusqu'à 5 textes, 5 titres et 5 descriptions par pub, déposés par l'agent avec les garde-fous ;
  - générateur Groq retiré ;
  - impressions, CTR, CPM, fréquence, résultats par texte et par titre (vérifiés en réel sur les anciennes pubs), qualité des leads par pub ;
  - seuils dans Réglages ;
  - alertes push chaque matin, une seule fois par alerte, renvoyées tant qu'elles n'ont pas été reçues.
- **Agent `media-buyer`** (`.claude/agents/media-buyer.md`) : modes PRÉPARER, BILAN, COMMANDER, règles dans `livrables/media-buying/regles.md`, journal des tests dans `journal.md`. `createur-creas` ne fait plus que les visuels.
- **Reste (tâche 11, avec Edgar) :** exécuter `supabase/media-buyer.sql`, supprimer la campagne de test à 1 €, tester en réel une campagne à deux visuels et plusieurs textes, poser `ADS_AGENT_SECRET` sur Vercel, valider la prévisualisation, fusionner. Puis premier dépôt des textes de A, B et D par l'agent.

### Onglet Analytics du hub : GA4 de kleakagency.fr branché

- **GA4 branché le 19/10** : compte de service Google `hub-ga4` en lecture seule sur la propriété `433476352`, variables posées en local et dans Vercel.
- **Page Analytics refaite et en production le 20/10** (spec `docs/superpowers/specs/2026-10-19-analytics-ga4-design.md`, plan associé, construite avec relecture à chaque étape) :
  - funnel du site (visiteurs, page de réservation, RDV, signés) et funnel des pubs Meta (dépensé, leads, RDV, signés) séparés, pour ne pas gonfler le taux du site avec les leads du formulaire instantané ;
  - pages d'arrivée, sources et campagnes, évolution avec repères posés à la main ;
  - une marche atteinte reste atteinte, effectifs toujours affichés, « pas encore mesuré » plutôt que 0, alerte sous 100 visiteurs ou 30 leads ;
  - trafic des aperçus `*.framer.app` exclu (décision d'Edgar).
- **CRM** : une réservation Cal.com d'une personne inconnue crée un compte au lieu de finir en « RDV non rattaché ». Migration SQL lancée par Edgar, testée contre la vraie base. Les chiffres Meta de l'accueil ne comptent plus que les leads du formulaire.
- **Constats sur le site** : environ 50 visiteurs par mois, l'accueil fait presque tout le trafic. La page de réservation renvoie encore vers l'ancien Calendly, que le CRM ne voit pas.
- **Site Framer en suspens** à cause d'un problème d'adresse mail et de domaine chez IONOS. Les marches « RDV » et « signés » du funnel du site resteront vides jusqu'au passage à Cal.com avec `canal=site` (tâche ajoutée à la to-do du 21/10).
- **Retouche des titres du hub** demandée (tailles plus marquées) : reportée après la fusion de Finance lot 2 et du module Ads pour éviter les conflits.

### Offre revue : trois formules, paiement en 6 fois, hébergement chez Kleak

- **One page à 699 €**, prix d'entrée pour les leads petit budget : une seule page avec toutes les infos, sections existantes, 1 série de retouches courte, 5 jours ouvrés. Passage à l'Essentiel possible plus tard en payant la différence.
- **Essentiel (999 €) et Pro (1 800 €) inchangés**, sauf l'**optimisation de la fiche Google** ajoutée à l'Essentiel (environ 1 h) pour le distinguer du one page.
- **Maintenance à 49 €/mois pour le one page** (15 min de modifications, rapport simple), 90 €/mois pour les deux autres. Engagement de 12 mois.
- **Hébergement sur le compte Framer de Kleak**, inclus dans la maintenance, jamais vendu seul. Coût estimé à 12 €/mois par site (plan Basic à 10 $/mois facturé à l'année, plus le domaine), à confirmer sur la première facture. À vérifier : prix mensuel du plan Basic et transfert d'un site vers le compte d'un client.
- **Paiement en 6 fois sans frais** (6 × 116,50 €, 166,50 € ou 300 €) : premier versement à la signature, prélèvement Stripe, maintenance obligatoire, site à Kleak jusqu'au dernier versement, suspension en cas d'impayé (à écrire dans les CGV). Moins de cash en novembre : suivre la part des clients en 6 fois.
- **Page tarifs** à créer sur `kleakagency.fr` dans la DA du site (3 cartes, bascule « En une fois / En 6 fois », tableau comparatif), après le problème IONOS.
- **À faire :** adapter le hub (fiche client et onglet Finance : mode de paiement, maintenance).

---

## 2026-10-19

### To-do du lendemain dans le hub, Notion abandonné

- **Rituel retrouvé :** chaque soir, Edgar lance `/demain`. Claude lit le hub (tâches pas faites et en retard, RDV Cal.com des 7 jours, prochaines actions, leads non contactés ou en fin de séquence, projets en cours), propose la to-do du lendemain, Edgar corrige, et Claude l'écrit d'un coup seulement après son accord.
- **6 thématiques :** Prospection, Réunions, Production, Clients, Admin et finances, Outils. « Opérationnel » écarté, trop large ; Outils à part pour voir le temps passé hors travail payant.
- **Page To-do :** onglets Aujourd'hui (avec les tâches en retard, jamais déplacées toutes seules), Demain et Historique ; cocher, ajouter, modifier, supprimer avec annulation, repousser à demain, copier une tâche en prompt Claude.
- **Notion abandonné** pour la to-do : tout vit dans la base Supabase du hub (`supabase/todo.sql`).
- Spec `docs/superpowers/specs/2026-10-19-todo-hub-design.md`, plan `docs/superpowers/plans/2026-10-19-todo-hub.md`. 141 tests, revue finale faite, **en production le 19/10**.

### Onglet Finance du hub (lot 1, Stripe)

- **Conçu avec Edgar** (spec `docs/superpowers/specs/2026-10-19-finance-design.md`, plan `docs/superpowers/plans/2026-10-19-finance-lot-1.md`) :
  - Kleak uniquement : Stripe pour les factures, Revolut Business pour toutes les dépenses ;
  - deux chiffres clés : le brut, et le net après toutes les dépenses et une estimation mensuelle des cotisations (21,2 %, modifiable), pour ne pas attendre le prélèvement URSSAF réel ;
  - objectif comparé à 2 000 € nets par mois.
- **Revolut Business pas encore ouvert**, donc le travail est découpé en deux lots : lot 1 Stripe seul, lot 2 Revolut à l'ouverture du compte.
- **Lot 1 construit et testé** (branche `finance`, 141 tests, relecture par tâche et relecture finale) :
  - synchronisation chaque nuit et bouton « Actualiser » ;
  - « Indisponible » plutôt que 0 € quand la donnée manque ;
  - taux URSSAF et date de départ dans Réglages.
- **Mise en route :**
  - SQL exécuté sur Supabase ;
  - clé Stripe Kleak restreinte en lecture seule (Balance, Customers, Invoices) ;
  - test de bout en bout en mode test Stripe validé par Edgar (999 € + 1 800 € payés hors Stripe − 90 € de remboursement), puis données purgées.
- **Liquid glass** validé sur la maquette Finance et étendu à tout le hub par une autre conversation.
- **En production le 19/10** : branche fusionnée dans `main`, `STRIPE_SECRET_KEY` posée dans Vercel.
- **Taux de cotisation URSSAF confirmé par Edgar : 21,2 %.** Seul le seuil de franchise de TVA reste à vérifier.

### Hub Agence en ligne et refondu

- **Hub en production** sur https://hub-agence-kleak.vercel.app (projet Vercel `hub-agence-kleak`, dépôt `Beepurst/hub-agence-kleak`, déploiement automatique à chaque push sur `main`). Pas de domaine personnalisé, décision d'Edgar : outil interne. Mot de passe d'accès créé par Edgar.
- **Branchement du CRM :**
  - **Cal.com fait** : événement « Appel découverte Kleak Agency » (30 min, Google Meet), `https://cal.com/kleak-agency/appel-decouverte`, 2 rappels email (J-1, H-1) sur le modèle gratuit, webhook réservation/annulation/report vers le hub.
  - **Google Sheet fait** : script Apps Script installé, envoi toutes les 5 min. Les 80 anciens leads de 2025 importés au premier passage ont été supprimés de la base.
  - **Brevo en attente** : domaine `kleakagency.fr` authentifié, expéditeur `contact@kleakagency.fr` vérifié. Restent la balise `rua` du DMARC chez IONOS (problème de boîte mail, appel IONOS prévu), la clé API, les 4 modèles d'email et le webhook.
- **Refonte visuelle du hub, en production le 19/10** (spec `docs/superpowers/specs/2026-10-18-hub-agence-refonte-visuelle-design.md`, plan associé). Ce qui change :
  - thème clair, structure Notion et finition Apple ;
  - barre latérale en texte sur Mac, barre d'onglets en bas sur iPhone ;
  - étape d'un compte modifiable depuis sa fiche ;
  - touche « liquid glass » validée depuis la maquette Finance (halo, cartes de chiffres et sélecteur de période en verre) ;
  - contrastes AA vérifiés par test.
- **Prochaines étapes du hub :**
  - réécrire le plan du module Ads pour la nouvelle navigation (Ads en rubrique à sous-onglets, `src/lib/navigation.ts`) ;
  - onglet Finance conçu et construit dans une autre conversation (voir plus haut) ;
  - icônes de l'app iPhone encore sur fond noir.

### Créas du premier test validées, nouveau compte publicitaire

- **3 créas validées pour le test de 50 €**, en post et en story, avec leurs textes d'annonce (`livrables/creas-meta/`) :
  - A « Un site web en un Kleak » (marque, 4,8/5 Google) ;
  - B « Votre site vitrine en 7 jours, dès 999 € » (prix, avis de Laura Dias) ;
  - D « Un site qui donne envie d'appeler », avant / après : site daté inventé (« Site vieillot », mention « Avant : illustration » en petit) contre la vraie réalisation Accueil Sénior Assistance (« Site moderne et fluide »), pastille « dès 999 € en 7 jours* ». Accroches C et E écartées.
- **Règles d'Edgar sur le copy** : pas de formules ni de paires en miroir « qui font IA », partir de ses mots. Les textes d'annonce finissent sur ce qui se passe vraiment (« vous recevez tout de suite un message pour choisir un créneau d'appel »). Pas de mention de l'hébergement en plus dans les pubs (décision d'Edgar). Coquilles du site client laissées.
- **Nouveau compte publicitaire Meta**, formulaire instantané refait à zéro. Les libellés des questions doivent rester identiques à ceux lus par le CRM (`src/lib/crm/sheet.ts`), « Nom de l’entreprise » en question personnalisée. Le coût par lead d'il y a un an n'est plus un repère.
- Politique de confidentialité de kleakagency.fr (avril 2025) à compléter : Brevo, Cal.com, WhatsApp.

## 2026-10-18

### Module Ads du hub conçu, agent créas en priorité

- **Module Ads du Hub Agence** conçu avec Edgar et planifié (`docs/superpowers/specs/2026-10-18-module-ads-design.md`, plan `docs/superpowers/plans/2026-10-18-module-ads.md`, exécution en subagent-driven) :
  - bibliothèque de créatives, alimentée directement par l'agent créas ;
  - générateur de textes d'annonce : 3 versions par angle, relance d'une version avec consigne, garde-fous vérifiés dans le code (aucun tiret à la place d'une virgule, liste noire de tournures typées IA, prix conformes à l'offre, avis cités mot pour mot) ;
  - **modèle Llama via Groq, gratuit** (Edgar ne veut pas payer pour le moment), passage à Claude possible en une ligne ;
  - campagnes Prospects avec formulaire instantané envoyées **en pause** (l'API Meta n'a pas de brouillons), code repris du Hub Ecom ;
  - suivi par campagne et par pub : dépenses, CPC, leads, CPL, coût par RDV, ROAS calculé avec le CRM (« pas encore de vente » tant que la phase 2 n'existe pas) ;
  - ciblage large par défaut (France, 25 à 65 ans), DSA « Kleak Agency », jeton utilisateur système du Business Manager.
- **Ordre décidé :** agent de production de créas d'abord (Edgar fera produire ses visuels par Claude, plus par Canva), puis le module Ads. La première campagne se monte à la main.
- Worktree `livrables/hub-agence-ads/` (branche `module-ads`) créé pour travailler sur le hub dans deux conversations en parallèle ; `livrables/hub-agence-*/` ajouté au `.gitignore` du workspace.

### Cible, déroulé client et performance

- **Cible confirmée : PME françaises de tous secteurs**, sans spécialisation, comme l'ancienne agence.
- **Pas de maquette Figma.** Le déroulé client devient :
  - questionnaire de cadrage à la signature (`livrables/process/questionnaire-cadrage.md`, intégré au Hub) ;
  - planche de direction sous 48 h (`livrables/process/planche-direction/`) ;
  - pour le Pro, accroche validée dans Framer avant le reste ;
  - puis le site complet.
  - Ajouté à la fiche offre (« Comment ça se passe »).
- **Démo V2 « minimal architecte »** (`/atelier-hauteville-v2`, Instrument Serif, crème et noyer) construite et publiée en test.
- **Performance comme argument de vente.** Elle passe avant les grosses animations, et chaque livraison liste les réglages à faire à la main dans Framer.
  - Mesures de la V2 après optimisation : 77 sur mobile (médiane de 3 passages), 95 sur bureau, accessibilité 96.
  - Règles de construction ajoutées à la checklist qualité (section 9).

### Retour à Framer après test réel

- **Décision finale : Kleak reste une agence Framer.** Le passage à Webflow décidé le matin est annulé le jour même.
- **Le test :** Claude Code pilote Framer via l'outil `@framer/agent` (projet `TEST-CLAUDE`).
  - Home de `kleakagency.fr` recréée avec ses animations en environ 16 min.
  - Démo Atelier Hauteville construite d'après le brief complet en environ 11 min, sans retouche d'Edgar : 11 sections, CMS des réalisations, menu burger, formulaire RGPD, 3 tailles d'écran.
  - Résultat présentable dès la première passe, là où la V1 Webflow ne l'était pas.
- **Exigence d'Edgar :** les sites sortent parfaits en 2 ou 3 allers-retours maximum, en validant la direction ensemble en amont.
- **PageSpeed de la démo au premier passage :** 33 sur mobile, 68 sur bureau. Causes :
  - effets d'apparition sur l'accroche, qui cachent le contenu jusqu'au JavaScript (premier affichage à 5,3 s, plus grand élément visible à 11 s) ;
  - images importées en 2400 px ;
  - 3 fichiers de police Cormorant.
- **Correctifs appliqués :** accroche sans animation, images réimportées en 1000 à 1920 px, une seule graisse de Cormorant sans italique, contraste du laiton, zone `main`, bouton de menu accessible.
- **Règles ajoutées** à la checklist qualité (section 9).

### Kleak Agency devient une agence Webflow (annulé le jour même, voir ci-dessus)

- **Décision : Webflow est l'outil de production.** Kleak passe d'agence Framer à agence Webflow dans tout ce qui est public (site, discours, pubs, démo).
- Raisons : "agence Framer" ne distingue pas ; CMS et édition client plus solides, qui soutiennent la maintenance ; aucun client existant à faire migrer.
- Framer reste en coulisses, non affiché, pour un Essentiel où la vitesse prime.
- Risques notés : tenir 14 h par Essentiel et 24 h par Pro sur Webflow (à mesurer sur la démo corrigée) ; prix 999 € / 1 800 € à confronter au marché Webflow et au coût d'hébergement Webflow pour le client.
- Le site `kleakagency.fr` est sur Framer, à refaire en Webflow à terme.
- Contexte remis à jour : la démo V1 était publiée et auditée depuis le 15/10, le blocage du connecteur n'existe plus.

### Nom de l'agence et canal d'acquisition

- **Nom : Kleak Agency**, repris de l'ancienne agence Framer. Domaine `kleakagency.fr`, page Facebook et compte publicitaire Meta toujours actifs, anciennes pubs et formulaire instantané disponibles.
- **Aucun ancien client ni réseau à relancer.** La stratégie « réseau d'abord » tombe.
- **Acquisition : Meta Ads uniquement**, comme pour l'ancienne agence : pubs statiques, formulaire instantané, relance automatique par email et WhatsApp vers la prise de rendez-vous. Budget 200 € par mois.
- **Historique d'il y a un an** : 2 € par lead, 1 rendez-vous pour 3 leads, 1 signature pour 3 à 4 rendez-vous. Le budget suffit largement ; la contrainte est la capacité de production. Test de 50 € prévu pour remesurer le coût par lead avant d'engager le reste.

---

## 2026-10-16

### Offre et prix définis

- **Essentiel 999 €** : 3 pages, à partir de sections existantes, 1 série de retouches, livraison en 7 jours ouvrés.
- **Pro 1 800 €** : 5 pages, design personnalisé, SEO local, GA4 et suivi des demandes, 2 séries de retouches, 10 jours ouvrés.
- Options : automatisation des demandes 400 €, page supplémentaire 200 € (proposée, à confirmer). Maintenance + reporting 90 €/mois, engagement 12 mois.
- Acompte de 50 % à la signature, solde avant mise en ligne. Abonnement d'hébergement et nom de domaine au nom du client.

**Recalage sur les vrais temps :** 4 à 5 journées de 8 h par site, soit 31 à 37 €/h. L'objectif de décembre n'est tenable qu'en plafonnant la production (14 h pour un Essentiel, 24 h pour un Pro) grâce aux sections réutilisables, et en passant à **6 h par jour jusqu'à fin décembre**. Avec ces deux leviers, 1 Pro + 1 Essentiel signés d'ici mi-novembre suffisent.

Livrables : `livrables/offre/fiche-offre.md` (client) et `livrables/offre/note-interne-offre.md`. À faire : nom de l'agence, coordonnées, CGV de prestation.

---

## 2026-10-15

### Objectif chiffré fixé, Hub Agence construit (lots 0 et 1)

**Objectif :** 2 000 € nets par mois minimum dès décembre 2026, en micro-entreprise BIC prestations de services. Soit environ 2 550 € de CA mensuel : environ 2 sites à 1 500 € signés d'ici mi-novembre, puis environ 1,5 site par mois. Jugé faisable mais serré, uniquement via le réseau et les anciens clients. Prochaine étape : l'offre et son prix.

**Hub Agence :** outil interne copié de l'Orbikal Hub dans `livrables/hub-agence/` (dépôt git indépendant, Supabase dédié). Bibliothèque de références visuelles et Briefs avec références épinglées, testés contre la vraie base, relus par un relecteur indépendant. Pas encore en ligne (dépôt GitHub et Vercel à créer). Spec et plan dans `docs/superpowers/`. Lots suivants : réception des briefs par Tally, comptes et projets, devis et factures, to-do Notion et GA4.

À faire : remplacer la clé `service_role` Supabase, affichée par erreur pendant la session.

### Pivot : arrêt de l'ecom, pause d'Orbikal, relance de l'agence de création de sites

**Décisions :**

- **Le projet ecommerce avec Forqan s'arrête**, sans avoir réalisé de vente. Dernier état : boutique La Sente, tapis de léchage chien sur AliExpress, boutique pas encore en ligne. Contexte, 15 agents, 4 skills et livrables archivés dans `archive/ecom/` (instantané figé au commit `82bcb06`). Le Hub Ecom reste en place, inutilisé.
- **Orbikal est mis en pause**, pas arrêté : plus de développement, l'existant reste en ligne, point à refaire dans 3 mois.
- **Relance de l'agence de création de sites internet**, avec pour objectif de faire rentrer du cash rapidement.

**Framer ou Webflow, pas encore tranché.** Framer produit plus vite et coûte moins cher au client, mais le marché est saturé. Webflow offre un CMS plus solide et des paniers plus élevés, mais il est plus lent à produire et à vendre. Le connecteur Webflow a été branché pour tester l'outil sur un site de démonstration (cuisiniste fictif "Atelier Hauteville" à Cergy). Ce test est bloqué tant qu'aucun site vierge n'existe sur le compte et que le connecteur n'y a pas accès.

**Positionnement recommandé, à valider :** vendre "site + tracking + automatisations + reporting" plutôt qu'un site seul, en offre packagée à prix fixe. Commencer par le réseau et les anciens clients. Recycler Orbikal en reporting mensuel dans un forfait de maintenance.
