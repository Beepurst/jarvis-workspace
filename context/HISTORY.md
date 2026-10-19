# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> L'historique du projet ecom (août à septembre 2026) est conservé dans `archive/ecom/context/HISTORY.md`.

---

## 2026-10-19

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
  - onglet Finance en cours de conception dans une autre conversation ;
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
