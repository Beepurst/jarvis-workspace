# Bilan mensuel du Suivi avis

Promis dans la fiche offre (Suivi avis, 190 €/mois) : « un bilan mensuel d'une page : avis reçus, note moyenne, visites et demandes venues du site, appels depuis votre fiche Google ». Conçu le 24/10/2026. **Étape 1, la maquette, est faite. Étape 2, l'automatisation n8n, est conçue ici mais pas construite** (questions ouvertes en fin de fichier).

Rappel de la note interne : la position sur Maps et les appels figurent dans le bilan **comme preuves**, jamais comme promesse. Le bilan montre les chiffres, il ne s'engage sur aucun.

## Fichiers

- `modele-bilan.html` : le modèle. Un seul objet `BILAN` à remplir, la page se construit seule. Ne pas le remplir directement.
- `exporter.sh` : produit le PDF A4 (une page) et un PNG d'aperçu (pour WhatsApp).
- `exemple-garnier.*` : exemple sur le client test Garnier Plomberie, **entreprise et chiffres fictifs**, bandeau « Exemple » affiché. Ne jamais l'envoyer.

```sh
cp livrables/process/bilan-avis/modele-bilan.html livrables/clients/<client>/bilan-<client>-2026-11.html
# remplir l'objet BILAN, mettre exemple: false
sh livrables/process/bilan-avis/exporter.sh livrables/clients/<client>/bilan-<client>-2026-11.html
```

Une donnée absente se met à `null` : la case affiche « non mesuré » au lieu d'un faux zéro, et l'écart au mois précédent disparaît (premier mois).

## Ce que contient la page, et d'où vient chaque chiffre

| Bloc | Chiffre | Source exacte |
|---|---|---|
| Résumé | Nouveaux avis, appels depuis la fiche, demandes venues du site | Repris des blocs ci-dessous |
| Avis | Avis reçus dans le mois, extraits | API Google Business Profile v4, `accounts/{a}/locations/{l}/reviews` : avis dont `createTime` tombe dans le mois |
| Avis | Note moyenne, total | Même appel : `averageRating`, `totalReviewCount` (valeur au jour de l'appel, d'où l'appel le 5 et la mention « données arrêtées au ») |
| Avis | Réponses publiées | Avis du mois qui ont un `reviewReply` |
| Avis | Barres des 6 derniers mois | Historique stocké (voir « Mémoire » plus bas) |
| Fiche | Vues | Business Profile Performance API, `fetchMultiDailyMetricsTimeSeries`, somme de `BUSINESS_IMPRESSIONS_DESKTOP_MAPS`, `_DESKTOP_SEARCH`, `_MOBILE_MAPS`, `_MOBILE_SEARCH` |
| Fiche | Appels, itinéraires, clics vers le site | Même appel : `CALL_CLICKS`, `BUSINESS_DIRECTION_REQUESTS`, `WEBSITE_CLICKS` |
| Fiche | Publications | API v4 `localPosts` : publications créées dans le mois |
| Site | Visites | GA4 Data API `runReport`, métrique `sessions`, sources `.framer.app` exclues comme dans le hub |
| Site | Demandes | GA4 : vues de la page `/merci` (formulaire envoyé) + événements `clic_telephone` et `clic_whatsapp` (voir prérequis) |
| Site | Arrivées depuis Google, affichages, recherches | Search Console API `searchAnalytics/query` : `clicks`, `impressions`, dimension `query`, 5 premières par clics |

Les trois limites écrites en pied de page, à garder : GA4 ne compte que les visiteurs qui acceptent les cookies (bandeau obligatoire, voir `livrables/site-kleak/mesure-apres-consentement.html`), les « appels » sont des appuis sur un bouton et pas des appels décrochés, et Google publie les chiffres de la fiche avec quelques jours de retard.

## Prérequis par client, au démarrage du pack

À ajouter à la mise en route du Suivi avis. **Point à trancher** : la fiche offre ne promet la mesure GA4 qu'en Pro, alors que le Suivi avis est vendu pour toutes les formules. Sur un One page ou un Essentiel, il faut donc la poser au démarrage du pack. Mon estimation : 30 à 45 minutes par site, non mesurées.

- [ ] **Fiche Google** : accès gestionnaire donné au compte Google de Kleak (déjà prévu dans les CGV). Relever l'identifiant du compte et du lieu.
- [ ] **GA4** sur le site, chargé après consentement comme sur kleakagency.fr, avec :
  - le formulaire Framer qui redirige vers une page `/merci` (option de redirection du formulaire) ;
  - un petit script qui envoie `clic_telephone` au clic sur un lien `tel:` et `clic_whatsapp` sur un lien `wa.me` ;
  - le compte de service `hub-ga4@hub-agence-kleak.iam.gserviceaccount.com` ajouté en lecteur de la propriété.
- [ ] **Search Console** : propriété du domaine validée, même compte de service ajouté en utilisateur (lecture).
- [ ] **Lien d'avis** `g.page/r/…/review` du kit de demande d'avis (`livrables/process/demande-avis/`).

Sans GA4 ni Search Console, le bilan sort quand même : les cases du site affichent « non mesuré ». Les avis et la fiche suffisent à tenir la promesse principale.

## Automatisation dans n8n (conçue, pas construite)

### Déroulé

1. **Déclencheur** : le 5 de chaque mois à 8 h (laisse passer le retard des chiffres de la fiche).
2. **Liste des clients** : lecture de l'onglet `Clients` (voir « Mémoire »), uniquement ceux dont le Suivi avis est actif ce mois-ci.
3. **Pour chaque client**, en parallèle :
   - avis (v4 `reviews`, en suivant `nextPageToken` jusqu'à sortir du mois) ;
   - chiffres de la fiche (Performance API, du 1er au dernier jour du mois) ;
   - publications (v4 `localPosts`) ;
   - GA4 (`runReport` : sessions, puis `eventCount` par `eventName` et vues de `/merci`) ;
   - Search Console (totaux, puis 5 requêtes).
4. **Mois précédent** : lu dans l'onglet `Bilans` (ligne du client pour le mois d'avant). Premier mois : rien, les écarts ne s'affichent pas.
5. **Nœud Code** : construit l'objet `BILAN` (même forme que dans le modèle), coupe les extraits à 140 signes, garde 2 avis du mois au plus en préférant ceux qui ont du texte.
6. **Écriture** de la ligne du mois dans `Bilans` (sert au mois suivant et aux barres).
7. **PDF** : le modèle avec l'objet injecté, rendu par un Chrome sans écran (voir question 2).
8. **Brouillon Gmail** dans `kleakagency@gmail.com`, PDF en pièce jointe, et une notification à Edgar. **Rien ne part sans le clic d'Edgar**, comme les devis.

Temps d'Edgar visé : relire, ajouter une phrase si un chiffre mérite un mot, envoyer. Mon estimation : 5 à 10 minutes par client, à mesurer.

### Le message qui accompagne le bilan

C'est aussi le rappel mensuel promis par le kit d'avis. Texte de départ, à reprendre par Edgar :

> Objet : Votre bilan de [mois]
>
> Bonjour [prénom],
>
> Voici le bilan de [mois] en pièce jointe. [Une phrase d'Edgar si besoin.]
>
> Pensez à demander un avis à vos clients du mois, avec le message de votre kit ou ce lien : [lien d'avis].
>
> Edgar, Kleak

### Accès

- **Fiche Google** : identifiants OAuth du projet Google Cloud d'**Orbikal** (seul projet où l'API Business Profile est validée, demande Kleak refusée le 22/10), portée `business.manage`, connecté avec le compte Google qui a l'accès gestionnaire aux fiches. Dans n8n : un identifiant « Google OAuth2 API » générique, utilisé par des nœuds HTTP Request. Le jeton se renouvelle seul tant que l'écran d'autorisation d'Orbikal reste validé.
- **GA4 et Search Console** : le compte de service du hub, en identifiant « Google Service Account » de n8n, portées `analytics.readonly` et `webmasters.readonly`. Sa clé ne doit pas être régénérée côté hub sans la reporter dans n8n.

### Mémoire : un Google Sheet « Suivi avis »

- Onglet `Clients` : nom affiché, prénom et email du contact, id du compte et du lieu Business Profile, id de propriété GA4, propriété Search Console, lien d'avis, mois de démarrage, actif oui/non.
- Onglet `Bilans` : une ligne par client et par mois avec tous les chiffres du bilan.

## Questions ouvertes avant de construire

1. **Où tourne n8n ?** `N8N_WEBHOOK_URL` et `N8N_API_KEY` sont vides dans le `.env`. n8n Cloud est payant, un n8n auto-hébergé demande un serveur.
2. **Rendu du PDF.** n8n ne sait pas transformer du HTML en PDF seul. Soit un service Gotenberg à côté de n8n (gratuit, mais à héberger), soit un service payant à la page.
3. **n8n ou le hub ?** À trancher par Edgar :
   - *Pour n8n* : c'est ce qui était prévu, les essais se font sans toucher au hub en production, et c'est une compétence vendable (option automatisation à 400 €).
   - *Pour le hub* : il a déjà le compte de service GA4 et son code d'appel, un cron quotidien, l'envoi de brouillons Gmail et une base Supabase pour l'historique. Il resterait le rendu PDF (pdfkit au lieu de ce HTML, donc une deuxième mise en page à tenir) et l'appel Business Profile.
   - Mon avis : au premier client, **remplir le modèle à la main** (environ 20 à 30 minutes, estimation), puis automatiser à 2 ou 3 clients, quand les questions 1 et 2 sont réglées. Construire l'automatisation avant d'avoir un client sur le pack ne fait rentrer aucun euro.
