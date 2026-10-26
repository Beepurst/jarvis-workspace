# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> L'historique du projet ecom (août à septembre 2026) est conservé dans `archive/ecom/context/HISTORY.md`.

---

## 2026-10-26

### Article SEO de la semaine publié

- **« Prix d'un site vitrine pour une PME : ce qu'il faut payer »** (`/blog/prix-site-vitrine-pme`, requête « prix site vitrine », « prix site vitrine pme » absente des suggestions) écrit par `redacteur-seo`, validé par Edgar et publié dans la collection Framer « Articles » le 26/10. 5 articles en ligne. Le chiffre de La Fabrique du Net (médiane 6 000 € pour une PME, 1 312 projets) n'a pas pu être lu sur la page (403) : gardé par décision d'Edgar.
- **Rédaction des textes incluse** ajoutée à l'article et à `livrables/offre/fiche-offre.md` (« contenus fournis par vous » remplacé : textes rédigés par Kleak ou repris de ceux du client, logo et photos fournis par le client), alignée sur la décision du 24/10.

### Landing page claire `/votre-site` et campagne « Kleak | Métiers »

- **Créas** (tâche de la to-do « moins tech, plus orientées PME ») : série 8 en photos de métier sur fond crème, sans écran ni prix, jamais « PME » dans l'accroche. Retenues : **v** (menuisier), **w** (barbier), **x** (bulle « Bonjour, j'ai vu votre site internet… ») ; u, y, z écartées. Posts et stories dans le hub (en JPEG, les PNG dépassent 4 Mo).
- **Landing page claire `/votre-site`** construite dans Framer d'après une maquette HTML validée puis des sections de la bibliothèque choisies par Edgar : hero ciel avec mot « Kleak » lié au défilement, grille de 5 cartes à mini-interfaces et photo centrale, étapes en escalier, comparatif avec interrupteur (testé en ligne), FAQ numérotée, calendrier Cal.com `canal=lp`. Retours d'Edgar intégrés : bulles des étapes jugées « typées IA » retirées, boutons alignés sur ceux de l'accueil (bleu Kleak, taille Small), texte « Un site qui vous amène des clients, quel que soit votre métier ». Publiée par Edgar.
- **Campagne « Kleak | Métiers | 2026-10-26 »** lancée par Edgar : Prospects (formulaire instantané), v w x, 7 € par jour, un seul texte par pub pour garder le visuel story, bouton « En savoir plus ». Choix Prospects plutôt que Trafic : Meta optimise sur le formulaire, la LP Trafic avait fait 98 vues pour 0 RDV.
- **Campagne Trafic « LP sans prix »** : destination passée de `/site-internet` à `/votre-site` par Edgar.
- Reste : RDV de test de bout en bout depuis `/votre-site` ; date de fin de « Métiers » à confirmer.

### Landing page testée avec le trafic des pubs, affichage mobile corrigé

- **Test de bout en bout** : `/site-internet` ouverte en iPhone émulé avec des paramètres de pub factices, faux créneau réservé dans Cal.com. Le hub a créé le compte avec source et canal `lp`, `ad_id` et `ad_name` corrects. Ensuite, réservation annulée dans Cal.com, compte, événements et réceptions supprimés dans Supabase.
- **Défaut trouvé** : en mobile, la section « réalisations » faisait 1280 px de large, la page était dézoomée à 47 % sur téléphone (et débordait aussi sur tablette). C'était le cas depuis la mise en ligne de la LP le 24/10. Largeur passée à 100 %, marges du titre réduites, décor de « services » recalé d'1 px ; publié, contrôlé en ligne (iPhone et iPad à 100 %).
- **Hub** : le téléphone saisi dans Cal.com et la campagne (`utm_campaign`) n'étaient pas gardés sur le compte créé par une réservation, donc pas de rappel WhatsApp du RDV pour les leads de la LP. Corrigé (branche `lp-telephone`, fusionnée par Edgar), en production le 26/10.

### Bilan des pubs à J+3, plus aucun prix affiché

- **Bilan** (hub, Meta, GA4) : 45,87 € sur J K D (originale et copie) et la LP sans prix, 1 lead (J, budget sous 700 €, désinscrit en 22 s), 0 RDV. Le frein est après le clic : 30 clics lien pour 1 lead sur le formulaire, 98 vues de `/site-internet` pour 0 RDV. J K D diffusée à 100 % en Stories (CPM 35 à 69 €), la LP surtout en Reels Instagram. Rien ne prouve que le prix bloque, la LP sans aucun prix faisant 0 RDV.
- **Décision d'Edgar** : plus de prix dans les pubs, présenté en RDV comme avant. K et D en pause, o et r passées dans la campagne formulaire à côté de J (textes par `media-buyer`). La LP n'est pas mise en pause.
- **Site** : titre du hero de l'accueil « Votre site internet en ligne en 5 jours », titre et description Google sans prix, publiés. `/tarifs` reste.
- **`/site-internet`** : pas de bandeau cookies, donc GA4 à 0 visite ; bandeau de l'accueil ajouté et publié. L'ancien pixel `1414385413320328` (code de page, chargé sans consentement) retiré par Edgar et vérifié en ligne.
- **Campagne formulaire** : bug du hub trouvé, la règle du visuel 4:5 ne nomme aucun placement, Meta excluait donc les fils Facebook et Instagram (J K D à 100 % en Stories depuis le 23/10). o et r recréées avec la bonne règle ; J à corriger dans le Gestionnaire ; J corrigée par Edgar ; **correction du hub en production le 26/10** (règle des fils nommée, test ajouté), à confirmer à la prochaine création réelle depuis le hub.
- **Campagne LP** : 13,17 €, 99 vues, 0 RDV, 50 % des vues chez les 65 ans et plus, 87 % en Reels Instagram, r a pris 96 % du budget. Âge passé à 22-55 ans par Edgar.
- L'ancien formulaire de l'agence posait les deux mêmes questions qu'aujourd'hui (site existant, budget).

## 2026-10-24

### Campagne landing page sans prix

- **Question d'Edgar** : est-ce le prix affiché qui bloque les prospects ? Décision : une campagne sans aucun prix (pubs et page), tarifs présentés au RDV, **en parallèle de J K D** (choix d'Edgar, lecture séparée). Un A/B propre (mêmes visuels avec et sans prix) a été proposé puis abandonné : Edgar a retiré tous les prix des créas.
- **Landing page `kleakagency.fr/site-internet`** publiée (`noindex`) : ancienne page brouillon refaite, menu retiré (le lien « Tarifs » faisait fuiter le prix), hero et comparatif à interrupteur tirés de la bibliothèque, réalisations de l'accueil, statistiques sans source et promesses trop fortes retirées, formules sans prix, FAQ, pied de page légal, Calendly remplacé par Cal.com.
- **Créas** o, r, t (2 variantes d'accroche chacune en réserve), posts et stories, dans le hub. t sert au retargeting à partir du 31/10.
- **Suivi** : composant `CalendrierLP` qui passe à Cal.com le canal `lp` et l'`ad_id` de la pub ; hub (branche `canal-lp` fusionnée, `supabase/canal-lp.sql` appliqué) : source et canal `lp`, pub d'origine sur le compte, campagnes Trafic comptées dans la dépense, les tableaux et Finance, sans alerte « sans lead ».
- **Campagne publiée le 24/10** par Edgar, en objectif Trafic, créée à la main. **Campagne BTP abandonnée**, remplacée par celle-ci.

### Performance de kleakagency.fr

- **Tâche de la to-do** « Améliorer la performance de kleakagency.fr », traitée selon la section 9 de la checklist. Quota PageSpeed épuisé, mesures Lighthouse en local (faussées tant que d'autres sessions tournent sur le Mac).
- **Accueil** : fondus retirés sur les cartes, titres et FAQ, et 3 textes qui restaient cachés jusqu'au JavaScript ; textes en Manrope, General Sans, Satoshi et Switzer passés en Inter (dont un style de texte d'ancien modèle sur téléphone) ; contraste du mot « Boost » et du lien du bandeau cookies (rangé dans le composant Footer 2) corrigé. Lighthouse mobile au calme 86-98 ; PageSpeed d'Edgar mobile 55-60 (LCP 6 s, TBT 530 ms), accessibilité 92, SEO et bonnes pratiques 100.
- **`/tarifs` et `/creation-site-vitrine`** : l'accroche de `/creation-site-vitrine` était cachée par un fondu au chargement, corrigé ; tous les fondus retirés sauf les faisceaux décoratifs ; météores et particules masqués sur téléphone ; `/tarifs` passée de General Sans à Inter.
- **Bloc de prix** : en « 6 fois », le montant mensuel prend la taille du prix en une fois et « pendant 6 mois, sans frais » passe dessous en petit (bug de taille signalé par Edgar).
- **Décision d'Edgar** : le globe 3D en WebGL du bloc « Parlons de votre site » est gardé, alors qu'il coûte environ 1 s de calcul sur mobile. Le score mobile de l'accueil devrait rester autour de 55-70 sur PageSpeed.
- Checklist section 9 complétée (polices réellement téléchargées, bandeau cookies dans un composant, script de la barre d'édition, coût du WebGL).

### To-do et Bibliothèque refaites

- **Bibliothèque** (direction « Galerie » retenue sur captures) : filtres dans une barre de verre, pastilles par type de section avec compteur, cartes aérées, « Copier le prompt » en bouton Kleak. En production le 24/10.
- **To-do** : une première version en cartes (carte verte de résumé, cartes de verre par thème) a été mise en production puis **jugée trop « créée par l'IA »** par Edgar. Remplacée le jour même par une version **« tech »** (variante 3 parmi 3, dosage de couleur discret) : liste compacte monochrome, panneau de la tâche à droite, couleur par thème en petites touches, raccourcis clavier. À retenir pour le hub : préférer densité, traits fins et monochrome aux dégradés et cartes de verre sur les pages de travail.
- **Incident** : la copie principale du hub était passée sur la branche `canal-lp` d'une autre session pendant la fusion ; la To-do a été fusionnée dans cette branche par erreur, puis refusionnée proprement sur `main` depuis une copie séparée. Règle ajoutée dans `CLAUDE.md`.

### Nouvelle DA du Hub Agence en production

- **Tâche de la to-do** « Améliorer l'UI du pipeline : plus clair, plus tech, plus de couleur », élargie en séance à tout le hub. Choix faits par Edgar sur captures, en production le 24/10 (lot 2 de la refonte couleur terminé).
- **Pipeline** : bandeau de chiffres (en cours, entrés ce mois, RDV à venir, devis en attente, clients signés), cartes « À traiter » et « Prochain RDV », colonnes teintées à la couleur de l'étape (direction A retenue parmi 4).
- **Couleur** : rouge et bleu des cartes jugés fades, remplacés par un **vert émeraude** façon Shopify, sur l'accueil aussi. Le rouge reste pour les vraies alertes.
- **Fiche client refaite** (maquette V2 « Cockpit » retenue) : frise du parcours, prochaine action en vert, contact, tuiles budget, site, origine, payé, historique en frise.
- **Liquid glass** : version G2 retenue, **sans fond coloré** ; étendu à toutes les cartes du hub.
- **Boutons** : repris de kleakagency.fr (bleu Kleak, halo intérieur, écrin).
- **Tout le hub** : Finance (objectif en carte verte, tuiles), relevés Ads et SEO sur dégradé vert, graphiques en vert.

### Bilan mensuel du Suivi avis : maquette faite

- **Maquette d'une page** dans `livrables/process/bilan-avis/` : modèle HTML à objet unique `BILAN`, export PDF A4 et PNG, exemple fictif Garnier Plomberie. Résumé (nouveaux avis, appels depuis la fiche, demandes venues du site), avis (note, total, réponses, 6 mois, extraits), fiche Google, site (visites, demandes, Search Console), rappel de demande d'avis, limites de mesure en pied de page.
- **Décision** : bilan rempli à la main au premier client sur le pack, automatisation à 2 ou 3 clients. Le déroulé n8n (le 5 du mois, brouillon Gmail validé par Edgar), les sources exactes et les accès sont écrits dans le README ; restent à choisir l'hébergement de n8n, le rendu PDF, et n8n ou le hub.
- **Décision** : GA4 et Search Console installés au démarrage du Suivi avis sur un One page ou un Essentiel (la mesure n'est promise qu'en Pro). Note interne de l'offre mise à jour.

### Page tarifs publiée sur kleakagency.fr

- **Blocage Framer levé** : le workspace du site (compte IONOS) demandait de réactiver l'abonnement des éditeurs. Edgar a retiré `kleakagency@gmail.com` des éditeurs, le projet s'ouvre de nouveau dans l'outil `@framer/agent`.
- **Page `/tarifs` publiée** (structure validée par Edgar, `livrables/site-kleak/page-tarifs.md`) : cartes de prix, tableau comparatif, options, maintenance, Suivi avis, paiement en une fois ou en 6 fois avec exemple chiffré, ce qui n'est pas compris, FAQ prix. « Tarifs » ajouté au menu et au pied de page, lien « Voir le détail des tarifs » sur l'accueil et `/creation-site-vitrine`.
- **FAQ de `/creation-site-vitrine` corrigée** : la maintenance s'ajoute aux versements en 6 fois (elle était dite « comprise »).
- **FAQ sur les textes alignée** (accueil et `/creation-site-vitrine`, publiée) : le client envoie logo et photos, les textes sont les siens ou écrits par Kleak à partir du questionnaire, relus avant la mise en ligne.

### Recette du module devis, mise en page refaite

- **PDF en erreur en production** : les polices de pdfkit n'étaient pas embarquées par Vercel ; corrigé dans `next.config.ts`.
- **Mise en page refaite** sur le modèle d'un ancien devis Shine d'Edgar : logo, numéro et dates en tête, émetteur à gauche et client à droite, titre « Création de votre site internet », tableau à en-tête beige, totaux encadrés, échéancier, maintenance à part, police Inter. Le devis Essentiel tient sur une page.
- **Email du devis** en HTML (Gmail coupait les lignes du texte brut), « Préparer l'email » ouvre le brouillon dans le bon compte ; expéditeur `contact@kleakagency.fr` par un alias Gmail (SMTP IONOS), réglé par Edgar.
- **Facture Stripe** : le pied posé par le hub n'avait pas l'identité du vendeur ; ajout de « Edgar Blomme EI (Kleak Agency), adresse, SIRET ».
- **Réglages devis** : identité, numérotation `DEV-` à partir de 1001, CGV, email du devis, relances J+3 et J+7, message WhatsApp, validés par Edgar.
- **Décisions d'Edgar** : la maintenance reste obligatoire en 6 fois ; les textes du site peuvent être rédigés par Kleak avec l'IA (CGV articles 1 et 2 mis à jour), l'option « Rédaction des textes » est retirée de la fiche offre.
- **Recette** : résumé du RDV, devis, brouillon, signature, vente, client Stripe et facture d'acompte en brouillon validés ; données de test supprimées, aucune facture finalisée. Reste à voir sur le premier client : l'expéditeur, la transcription Cal Video, le numéro de facture et le 6 fois.

## 2026-10-23

### Module devis et Suivi avis en production dans le hub

- **Branche `devis` fusionnée dans `main`** (commit `190ec63`) et déployée : transcription et résumé du RDV, devis prérempli avec PDF et CGV, brouillon Gmail, relances automatiques, devis signé → vente → factures Stripe. Schéma `supabase/devis.sql` appliqué, variables Vercel en place (vérifié).
- **Catalogue du hub aligné sur l'offre** : Suivi avis à 190 €/mois (`SUIVI_AVIS_CENTIMES`), qui démarre le mois qui suit le 6e versement en paiement en 6 fois ; `ENGAGEMENT_MOIS = 12` remplacé par le préavis de 2 mois (`PREAVIS_MAINTENANCE_MOIS`), avec arrêt de maintenance daté sur la fiche client.
- Le cron quotidien des relances enchaîne CRM, formulaires clients, relances de devis puis reprise des transcriptions, chacun isolé.
- Tests : 1 057 sur 1 058, le seul échec est un PNG de créa manquant, sans rapport. La branche `devis` peut être supprimée.

### Kit de demande d'avis

- **Kit prêt** dans `livrables/process/demande-avis/` : messages types (SMS ou WhatsApp, email, une relance, phrase orale, formulations interdites par Google), carte QR aux couleurs du client (PDF A4 de 4 cartes A6 et PNG d'une carte, via `exporter.sh`), mode d'emploi. Exemple sur Garnier avec un lien fictif, QR vérifié par décodage.
- Remis à chaque livraison, toutes formules, et base du Suivi avis. Étape ajoutée à la section 10 de la checklist qualité. Temps estimé à environ 20 minutes par client (au lieu de 1 h), noté dans la note interne de l'offre.
- Rappel mensuel du Suivi avis pas encore fait : il dépend du bilan n8n.

### Commission des apporteurs d'affaires, refonte de pages du site

- **Commission apporteur fixée** : 15 % du prix de la création du site uniquement (105 €, 150 € ou 270 € selon la formule), rien sur la maintenance, versée à l'encaissement (au prorata des échéances en 6 fois). Notée dans `context/CONTEXT.md` et `livrables/offre/fiche-offre.md`.
- **Site kleakagency.fr, chantier décidé**, dans cet ordre :
  1. `/création-de-site-framer` n'est pas supprimée mais refaite en page « création de site vitrine pour PME » (sans parler des artisans) ;
  2. page apporteur refaite avec un formulaire ;
  3. blog refait sur la structure du modèle Agnos.
- **Page site vitrine publiée** (`/creation-site-vitrine`, ancienne adresse en 404 faute de redirections dans le plan Framer). **Page apporteur refaite** avec formulaire de recommandation ; règles ajoutées : versement sous 15 jours après chaque paiement, recommandation valable 6 mois, rien si l'entreprise était déjà en contact, contrat avant le premier versement.
- **Page supplémentaire à 200 € confirmée**, vendable comme page de campagne sur un site Kleak ; pas de landing page seule au catalogue.
- **Blog basculé** : nouvelles pages en `/blog` et `/blog/:Articles`, 4 articles validés (paiement en plusieurs fois, prix d'un site, coût par mois, vitrine ou landing page), anciens articles Framer et ancienne collection supprimés, liens Wordpress/Webflow VS FRAMER retirés du pied de page. Publication par Edgar.
- **Nouveau blog construit en brouillon** (structure Agnos) : collection Framer « Articles » (catégories Prix, Paiement, Choisir son site ; auteur affiché Kleak Agency), pages `/blog-nouveau` et `/articles/:Articles`. Ouverture quand 4 ou 5 vrais articles seront prêts. Procédure dans `livrables/site-kleak/blog-bascule.md`.
- **Cible du site et du SEO : les PME, on ne parle plus des artisans.** Corrigé dans CONTEXT, CLAUDE.md, la stratégie SEO, la liste des sujets (sujet 4 devenu « prix site vitrine PME ») et l'agent `redacteur-seo`.
- **Search Console sur 90 jours** : aucun clic sur les 21 anciens articles Framer, 1 clic sur la page création. Les anciens articles restent en ligne jusqu'à ce que le nouveau blog ait 4 ou 5 articles, puis ils sont supprimés.

### Premier test Meta lancé, parcours du lead testé

- **Campagne « Kleak | multi | 2026-10-22 » activée** par Edgar le 23/10 vers 12 h (ensemble `120251881595790751`) : J, K et D, 7 € par jour, France, 25 à 65 ans et plus, ciblage large, bouton « Obtenir un devis », fin de l'ensemble le 30/10 à 23 h 59. Textes alignés sur l'email immédiat par `media-buyer` (anciens textes supprimés du hub), Accueil Sénior Assistance prévenu, politique de confidentialité publiée. L'ancienne campagne J K D du 21/10, créée avec les anciens textes, a été supprimée.
- **Bouton « Nous contacter » retiré du hub** : une première création a échoué, Meta refuse le bouton `CONTACT_US` avec un formulaire instantané. Rien n'est resté dans Meta (le hub a tout annulé), correctif fusionné et en production.
- **Campagne « Kleak | TEST BTP | 2026-10-22 »** (L, M, N) créée en pause, non lancée : anciens textes, 5 € par jour, 23 à 55 ans, écarts relevés par `media-buyer` dans son journal.
- **Alerte « Nouveau lead »** ajoutée au hub (nom, entreprise, budget, site existant, téléphone ; une fois par lead, jamais pour un ancien lead), fusionnée et en production.
- **Notifications push réparées** : les clés VAPID n'avaient jamais été posées, aucune notification du hub ne partait (RDV et alertes Ads compris). Clés générées et posées sur Vercel, Mac et iPhone abonnés.
- **Lead de test** (outil de test de Meta) : hub 17 s après l'envoi, notification en moins d'une minute, email Brevo délivré, lien Cal.com rattaché à la fiche, notification « Nouveau RDV » reçue. Fiche de test supprimée.
- **Cal.com** : le planning proposait des créneaux dès 3 h du matin (heure de Paris). Corrigé par Edgar : 9 h à 12 h et 15 h à 18 h, du lundi au samedi.
- **Rappel WhatsApp au lead** (demande d'Edgar, « WhatsApp marche bien ») :
  - **API écartée pour l'instant** : garder le numéro WhatsApp Business sur l'iPhone suppose la coexistence de Meta, réservée aux prestataires agréés (YCloud, 360dialog), et Brevo ne la propose pas ;
  - **choix d'Edgar : semi-automatique**. 15 min après un lead sans RDV, notification « Envoyer le WhatsApp », page du hub avec le message, bouton qui ouvre WhatsApp Business avec le texte écrit ;
  - message : « Bonjour <prénom>, c'est Edgar de Kleak… », lien Cal.com marqué WhatsApp, possibilité de répondre avec ses disponibilités ;
  - en production, testé de bout en bout avec un vrai numéro, fiche de test supprimée.

## 2026-10-22

### Brevo branché et testé

- **Domaine `kleakagency.fr` authentifié** dans Brevo, DMARC compris (il manquait la balise `rua`).
- **Webhook** « Hub Agence - événements emails » actif sur 11 événements des emails transactionnels (délivré, ouvert, première ouverture, cliqué, rejets, plainte, désinscrit). « Chargé par proxy » et « Ouverture unique » laissés de côté, car ils faussent les statistiques.
- **7 variables Brevo** posées dans Vercel, expéditeur « Edgar de Kleak », fusionné et déployé.
- **Test avec l'adresse d'Edgar** : invitation reçue, délivré et clic remontés sur la fiche en moins d'une minute. L'ouverture n'est pas remontée, probablement parce que Gmail charge les images par son serveur et que Brevo classe alors l'ouverture « par proxy » : sur des leads Gmail, le hub verra surtout les clics. Comptes de test supprimés.

### Site kleakagency.fr prêt pour les pubs

- **CGV validées** par Edgar (suspension à 15 jours, clôture à 60 jours, pénalités légales, citation du site sauf refus, responsabilité plafonnée au montant payé, pas de clause de tribunal, maintenance obligatoire en 6 fois). Relecture juriste conseillée.
- **Politique de confidentialité** réécrite et publiée : ajouts du 19/10 et des devis, version mobile corrigée (mauvaise adresse et mauvais numéro), droit de réclamation CNIL.
- **Mesure et cookies** : Tag Manager supprimé (il contenait un doublon GA4, un écouteur Calendly et deux scripts d'alerte de test) ; deux pixels Meta trouvés, seul `1220146052806265` appartient à Kleak Pub ; GA4 et ce pixel ne se chargent plus qu'après accord (testé : rien avant accord ni après refus). Lien du bandeau cookies corrigé (il pointait vers la politique de Framer).
- **Vitesse** : cause principale, le titre d'accueil caché par une animation d'apparition ; corrigé, plus images retaillées (1,8 Mo → 0,47 Mo) et animations allégées sur téléphone seulement. PageSpeed mobile 35 → 61-97, bureau 56 → 99, accessibilité 80 → 90. La variance restante vient du chargement de la police sur 4G lente.
- **RDV** : Cal.com intégré sur `/calendly` (le plan Framer n'a pas de redirections, adresse gardée), boutons calendly.com repointés.

- **Audits copywriting et SEO** (agents, rapports dans `livrables/site-kleak/`) : le site parlait aux startups « Framer », pas aux clients des pubs ; 22 articles avec le même titre SEO ; aucune donnée structurée ; Search Console : 1 032 impressions sur des requêtes de designers, 0 clic hors marque.
- **Textes de l'accueil refaits** avec Edgar : pastille « Création de sites internet » (les sites sont pour tout le monde, pas seulement PME et artisans), titre « Votre site internet à 699 €, en ligne en 5 jours », sous-titre « Un site captivant, pensé pour transformer vos visiteurs en clients », boutons « Réserver un appel gratuit », bloc de prix en trois cartes avec interrupteur une fois / 6 fois sur le modèle de qarin.framer.website (Essentiel mis en avant). Faux avis, anglais, promesses non fondées et compteur retirés, `/pricing` en brouillon. Pas de note Google affichée. LCL confirmé client.
- **Page de RDV renommée `/rdv`** (hors de cette session) : `/calendly` en 404, étape de réservation du hub à mettre à jour.
- **SEO de fond** : titres et descriptions Google refaits sur 7 pages (sans « Expert Framer »), modèle d'article du blog relié au titre de chaque article (champ « Description » ajouté au CMS, non utilisable dans le modèle par l'API : description construite sur le titre), `/newsletter` en noindex, FAQ de 6 questions à la place du comparatif sur l'accueil, fautes corrigées et chiffres sans source masqués sur `/création-de-site-framer` et `/seo`, promesse de retouches illimitées alignée sur l'offre. Données structurées prêtes à coller (`livrables/site-kleak/donnees-structurees.html`). Étape de réservation du hub passée à `/rdv` sur la branche `reservation-rdv` (à fusionner).

### Test de production Garnier terminé, de la maquette au transfert

- **V2 Framer** construite d'après la maquette HTML validée, puis 4 sections de la bibliothèque ajoutées : comparatif avec interrupteur, FAQ en panneau, À propos à accroche révélée au scroll, process en 4 étapes. Edgar a validé le site sans retouche visuelle.
- **Checklist** passée :
  - mesures Lighthouse : bureau 88 à 94, mobile 70 à 83 sans la barre d'édition de Framer, accessibilité 100 ;
  - ajouts : données structurées, image de partage, pages légales types.
- **Livraison testée** : copie du projet nettoyée, formulaire reçu sur `kleakagency@gmail.com`, transfert vers un second compte (un clic « Confirm transfer », site resté en ligne).
- **Décision** : un projet Framer par client dès le départ.
- **Process mis à jour** : section 10 « Livraison et transfert » dans la checklist, pièges de l'outil et fermeture des sessions dans `/site`.
- **Bilan** : environ 6 h de travail de Claude depuis la maquette validée ; à revérifier au premier client, le plan payant au transfert.

### IONOS débloqué, site Kleak gardé sur son compte Framer

- **Problème IONOS réglé** par Edgar : boîte mail, domaine et accès au Framer du site de Kleak rétablis.
- **Décision** : le site de Kleak **reste sur le compte Framer lié à la boîte IONOS**, qui porte l'abonnement. Pas de transfert vers `kleakagency@gmail.com`, qui héberge toujours les sites clients.
- **Débloqué** : DMARC et Brevo (alerte et message au lead), Cal.com à la place de Calendly, politique de confidentialité, bandeau cookies, page tarifs, publication des articles SEO.
- **Lancé ensuite** : DMARC chez IONOS et branchement de Brevo.

### Blocage IONOS : Framer de Kleak inaccessible, sites clients sur Gmail

- **Cause du blocage IONOS** : compte coupé pour une facture en retard, réglée vers le 19/10, déblocage en cours avec IONOS. Boîte mail, DNS et accès au Framer du site de Kleak (connexion par lien envoyé sur la boîte IONOS) sont bloqués. Le site reste en ligne.
- **Brevo avec Gmail** : écarté, Brevo n'accepte pas d'expéditeur en adresse gratuite. Pour démarrer, relances et prise de RDV depuis `kleakagency@gmail.com`, Brevo après le réglage du DMARC.
- **Décision** : les sites clients seront hébergés sur le compte Framer `kleakagency@gmail.com` (celui des tests), et le site de Kleak y sera transféré dès l'accès récupéré.
- **Reste à faire** : obtenir la date de rétablissement de la messagerie IONOS, écrire au support Framer, vérifier la carte de l'abonnement Framer du site, puis transférer le site.

### Upsell : Suivi avis à 190 € par mois

- **Point de départ** : Edgar voulait un suivi premium « dans le délire d'Orbikal » (fiche Google, maintenance, hébergement, 5 articles SEO automatisés par mois, plateforme de suivi des avis, de Search Console et de GA4).
- **Décisions d'Edgar** :
  - le pack tient sur deux promesses : plus d'avis Google, tous répondus, et rien à faire pour le client ;
  - il est proposé dès la signature, en face de la maintenance à 90 € ;
  - en paiement en 6 fois, il démarre après le dernier versement.
- **Contenu** :
  - la maintenance ;
  - la demande d'avis (message type, QR code, rappel mensuel) ;
  - la réponse à tous les avis ;
  - 2 à 4 publications par mois sur la fiche Google ;
  - un bilan mensuel d'une page.
- **Écartés pour l'instant** : les articles SEO automatisés (risque de contenu de masse, aucune preuve sur le blog de Kleak) et la plateforme façon Orbikal (à partir de 5 clients).
- **Prix : 190 €/mois**, dans le bas de ce que facturent les agences pour maintenance et gestion de fiche réunies (environ 180 à 250 € HT, d'après des pages d'agences, pas une grille de marché). Temps estimé : 1 h à 1 h 30 par client et par mois.
- **Avant-goût offert** : le message de demande d'avis et le QR code sont remis à chaque livraison.
- **Règle** : les avis sont demandés à tous les clients, sans contrepartie, et on n'écrit jamais d'avis à la place de qui que ce soit (règles Google, pratique commerciale trompeuse). Cette règle est à écrire dans les CGV.
- **API Google Business Profile** : la demande d'accès au nom de Kleak a été refusée tout de suite. On passe par le **projet Google Cloud d'Orbikal**, où l'API (quota de 300 requêtes par minute) et l'écran d'autorisation sont validés. Orbikal reste en pause, mais ce projet ne doit pas disparaître.
- **Script d'appel découverte** écrit, avec le Suivi avis intégré (`livrables/closing/script-appel-decouverte.md`, et sa version PDF).
- **Mis à jour** : `livrables/offre/fiche-offre.md`, `livrables/offre/note-interne-offre.md`, `context/CONTEXT.md`.
- **Reste à faire** :
  - construire le bilan mensuel dans n8n ;
  - ajouter le Suivi avis au catalogue du hub (`offre.ts`) ;
  - le mettre dans les CGV.

---

## 2026-10-21

### Parcours de vente analysé, module devis conçu

- **Analyse du parcours de la pub à la livraison** (`livrables/process/parcours-client-analyse.md`) : le haut (pubs, formulaire, CRM) est prêt, tout ce qui suit le lead l'est le moins. Points clés : aucune alerte quand un lead arrive (Brevo bloqué, le hub ne prévient que des RDV), pas de rappel de RDV, pas de devis, CGV ni paiement prêts, questionnaire de démarrage non construit, construction Framer encore fragile, pubs qui vendent le One page alors que l'objectif demande d'orienter vers l'Essentiel.
- **Réponses d'Edgar** : RDV en visio ; aucun rappel Cal.com réglé ; des sites de l'ancienne agence sont en ligne ; outil de devis à décider ensemble.
- **Décisions** : devis générés par le hub après le RDV (Tiime écarté, saisie à la main) ; visio **Cal Video** avec transcription automatique, tl;dv Pro en plan B (compte tl;dv gratuit, pas de webhook) ; résumé par une IA **gratuite**, Groq retenu ; brouillon Gmail depuis `kleakagency@gmail.com` (même compte Google que le projet Cloud), envoi à la main ; le client renvoie le devis signé ; **factures créées par le hub dans Stripe**, nouvelle série avec premier numéro élevé ; relances email J+3 et J+7 automatiques, WhatsApp semi-automatique (l'API WhatsApp Business est payante et lourde) ; tout construit avant le premier RDV, par sous-agents.
- Spec `docs/superpowers/specs/2026-10-21-devis-automatiques-design.md`, plan `docs/superpowers/plans/2026-10-21-devis-automatiques.md` (12 tâches).


### Test de production One page : style maison et maquette avant Framer

- **Test complet sur un faux client** (Garnier Plomberie Chauffage, plombier fictif à Osny, formule One page) : faux brief au format du questionnaire de cadrage, planche de direction validée en 1 aller-retour, construction Framer par `/site` en 2 h 50 dont environ 1 h 30 perdue sur des erreurs de `@framer/agent` (délais dépassés, publication en échec).
- **Résultat jugé « vieillot, basique, pas Framer »** par Edgar après 2 allers-retours. Causes : prompt décrivant un site de plombier type sans référence de mise en page, animations retirées, direction réglée sur les goûts du client, planche qui validait des couleurs et pas une mise en page.
- **Décision d'Edgar : les modèles Framer servent d'inspiration**, on en mélange plusieurs, on ne part jamais d'un modèle dupliqué.
- **Charte de style maison** (`livrables/process/style-maison.md`) tirée de 20 modèles Framer de la catégorie construction, mesurés en ligne : titres de 64 à 76 px serrés, fond chaud, cartes arrondies sans bordure, en-têtes en deux colonnes, alternance claire et sombre, boutons pilule, photos dominantes, peu d'animation, et un contrôle « niveau Framer » en 10 points.
- **Maquette HTML** de Garnier (`livrables/clients/test-garnier-plomberie/maquette/`) mélangeant BLDR, Renovatehub, Roofaro, Refit et Lintel : **validée par Edgar** (« c'est bien »), qui fera les retouches dans Framer. Prompt V2 : la session Framer reproduit la maquette au lieu de concevoir.
- **Trous du process relevés** : pas de colonne One page dans le questionnaire de cadrage ; le brief du hub (10 champs) ne porte ni questionnaire, ni planche, ni textes ; le modèle de planche colore mal le bouton d'accroche ; l'extension Chrome déconnectée ralentit le choix des photos.

### Créas de la série J, K, test Meta préparé, maintenance sans engagement

- **Maintenance sans engagement**, avec un préavis de 2 mois : l'engagement de 12 mois est abandonné (décision d'Edgar). Fiche offre, note interne et contexte mis à jour. Reste : la constante `ENGAGEMENT_MOIS = 12` du hub (`src/lib/offre.ts`, fins d'engagement des ventes), à revoir sur une branche.
- **Créas** : F, G, H et I écartées (« trop d'informations », « ça fait trop IA », trop de prix). Nouvelle DA d'après les créas Orbikal d'Edgar (`livrables/creas-meta/assets/references-da/`) : fond sombre, verre, une idée et un objet par créa, le prix seulement sur certaines. **J** (avis clients, sans prix) et **K** (devis One page 699 €) validées en post et en story. **B et D passent au One page 699 € en 5 jours.**
- **Règles des pubs** : textes courts ; jamais « Je m'appelle Edgar » ni rien qui dise qui est derrière l'agence ; pas de mention de TVA ni de l'article 293 B ; pas de promesse de message immédiat tant que Brevo n'est pas branché.
- **Hub** : les 5 créas (A, B, D, J, K) importées en post et en story. L'ancienne `b-7-jours-999` et ses textes, ainsi que les textes Essentiel de D, sont supprimés. Les textes de B, D, J et K ont été déposés par `media-buyer`, ceux de J, K et D réécrits en version courte.
- **Test préparé** : J, K et D, 7 € par jour pendant 7 jours (49 €), 1 ensemble, 3 pubs. Il mesure le coût par lead, pas la meilleure pub (trop peu de leads). Avant d'activer : lead de test, prévenir Accueil Sénior Assistance, politique de confidentialité.

### SEO : Search Console branché, agent redacteur-seo, cible nationale

- **Search Console branché au hub** : compte de service `hub-ga4` ajouté en « Restreint » sur la propriété Domaine `kleakagency.fr`, `GSC_SITE_URL=sc-domain:kleakagency.fr` posé en local et dans Vercel, production redéployée par Edgar. L'onglet SEO existait déjà (copie de l'Orbikal Hub).
- **Point de départ** : 16 clics en 90 jours (19 sur les 90 jours précédents), 15 sur la home, la moitié sur la requête « kleak ». Les 22 articles du blog parlent de Framer et n'attirent aucun client. Le site ne mentionne jamais une ville.
- **Décisions d'Edgar** :
  - cible **nationale** (patrons de PME et artisans), le local est mis de côté ; la fiche Google Business Profile, domiciliée à l'étranger, sera à refaire ;
  - pas d'outil payant (Semrush, DataForSEO) : Search Console tranche après publication ;
  - pas d'agent dans le hub : l'agent `redacteur-seo` vit dans Claude Code, Edgar relit chaque article dans la conversation ;
  - publication dans le CMS Framer bloquée tant que le problème IONOS n'est pas réglé.
- **Construit** : agent `redacteur-seo` (modes écrire et bilan), `livrables/seo/` (stratégie, 12 sujets priorisés, suivi, script `gsc.mjs` en lecture seule). 1 article par semaine au départ.
- **Premier article écrit** : « site internet paiement en plusieurs fois ». Réponses d'Edgar : maintenance **en plus** des 6 versements, à partir du **mois de la mise en ligne** ; la suspension en cas d'impayé reste dans l'article ; le paiement en une fois sans maintenance n'est pas mis en avant. **Fiche offre corrigée** : elle disait la maintenance « comprise » dans le paiement en 6 fois.

### Bibliothèque du hub : agent bibliothecaire et prompts de construction

- **Prompts copiables** (en production) : « Copier le prompt » sur chaque fiche de la bibliothèque, et dans le brief d'un client, épingles rangées **par page** (avec une page « Commune » pour navigation et footer), ordonnées, avec une adaptation par client et un bouton « Copier le prompt de la page ». Le hub assemble le prompt sans IA : reprendre la structure et l'adapter au client, ne jamais copier textes, images ni marque, règles de performance de la checklist section 9.
- **Fiches** : bouton Modifier (capture comprise), suppression en deux temps dans la carte, types de section élargis (réalisations, à propos, chiffres, logos, étapes, appel à l'action).
- **Agent `bibliothecaire`** (Sonnet) : Edgar donne une URL et une section, l'agent la capture seule avec Playwright, lit le code de la page, écrit une **fiche technique courte** (6 rubriques, sans couleurs ni polices du site d'origine) et la dépose directement. Mode **retravailler** : refait titre, capture et fiche sur la même ligne, garde la note et les épingles. Les 6 fiches de la bibliothèque ont été retravaillées le 21/10 (vérifier la capture de la fiche process, prise en pleine animation).
- **Économie de tokens** (décision d'Edgar après un test de construction mesuré à 102 tours et environ 19 millions de tokens relus) : sessions de construction ouvertes avec **`/site`** à la place de `/prime`, captures réduites, appels Framer groupés, une capture de contrôle par section ; la session **ouvre le site d'origine** pour voir et reproduire l'animation, limité à la section (correction d'Edgar). Construction gardée sur **Opus**. Agent : environ 170 000 à 240 000 tokens par fiche au lieu de 335 000, sur Sonnet ; étapes regroupées en deux scripts (`preparer.sh`, `deposer.sh`).
- **Animations mesurées** (après un test d'Edgar où une section animée est sortie statique) : causes trouvées, fiche sans recette d'animation, sections Webflow non repérées (un seul conteneur géant), session de construction bloquée sans Chrome. Le script filme maintenant l'entrée de la section (planche de 6 images légendées) et mesure chaque élément (effet, depuis → vers, déclencheur, délai, durée estimée, cascade, survols) ; la rubrique Animations devient une **recette à reproduire** (fiche à 230 mots, longueur contrôlée avant dépôt) ; la session de construction relance le script au lieu de Chrome et ne construit jamais statique une section animée. Les **8 fiches** refaites, **test de construction validé par Edgar** le 21/10. Le script chiffre aussi les **animations liées au défilement** (rotation, décalage, échelle, plage et courbe, ordre des rotations) et les **boucles 3D** (axe, vitesse, perspective, pas angulaire) ; fiche algorix refaite avec l'éventail chiffré.
- Spec `docs/superpowers/specs/2026-10-20-bibliotheque-prompts-design.md`, plans `docs/superpowers/plans/2026-10-20-bibliotheque-prompts.md` et `2026-10-21-bibliotheque-optimisation.md`.

### Business plan closing : pas de closeur pour l'instant

- **Décision : Edgar fait lui-même les premiers RDV.** La contrainte est la production (environ 90 h par mois, 1 Pro + 2 Essentiels), pas la vente. Un closeur à 15 % coûterait environ 570 € par mois pour environ 13 h libérées, soit 44 € par heure face à un net horaire de 34 à 39 €.
- **Déclencheurs du recrutement** : 15 RDV menés par Edgar avec un taux de closing mesuré, un script testé, des CGV, plus de RDV que de temps disponible, et une capacité de production pour absorber plus de ventes. Sans ce dernier point, le premier renfort à recruter est un renfort de production.
- **Barème prévu le jour venu** : 100 % à la commission, montant fixe par formule (70 €, 120 €, 200 €, 40 € pour l'automatisation), versé sur l'encaissé, repris en cas de remboursement, rien sur la maintenance. Risques de requalification et de statut d'agent commercial à faire valider par un juriste.
- Plan dans `livrables/closing/business-plan-closing.md`. Prochaine étape : script d'appel découverte et fiche de RDV avant la campagne du 25/10.

### Formulaire instantané, offres du hub et circuit des leads

- **Formulaire « Kleak | Appel découverte | 2026-10 »** créé sur la Page Kleak (intention plus élevée, sans vérification SMS pour le test de 50 €), relié au Google Sheet dans un **nouvel onglet**. Questions : site existant, budget (moins de 700 €, 700 à 1 000 €, 1 000 à 2 000 €, plus de 2 000 €), nom de l'entreprise, coordonnées. Écran de fin avec bouton vers Cal.com (Brevo pas encore branché).
- **Circuit des leads corrigé** : le script du Sheet ne lisait que le premier onglet ; il lit maintenant tous les onglets à colonne `id`. Le CRM comprend les en-têtes français du nouveau formulaire (`nom_complet`, `e-mail`, `numéro_de_téléphone`) et ignore les leads créés avant le 19/10. Lead test arrivé dans le CRM avec toutes ses réponses, puis supprimé.
- **Offres du hub refaites** d'après la fiche offre : `one-page` (699 €, 49 €), `essentiel` (999 €, 90 €), `pro` (1 800 €, 90 €), `kleak` (tous les prix). Hébergement inclus dans la maintenance, cité dans les textes.
- **« 49 €/mois » n'est plus un contenu interdit** (maintenance du one page, décision d'Edgar).
- **Bug corrigé dans Réglages** : « 999,90 » était lu comme une décimale et refusé.
- **Textes déposés par l'agent `media-buyer`** pour A, B et D (offre Essentiel). À la création de la campagne : décocher sur B les 2 textes migrés, « Site complet 7 j » et « Sans effort de votre part », et sur D le texte 3.

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
- **Validation réelle et mise en production le 20/10 :**
  - SQL exécuté, variables Vercel posées (dont `HUB_DSA_ENTITY` sans guillemets) ;
  - Meta refuse plusieurs textes avec un visuel story séparé : décision d'Edgar, le hub passe au visuel 4:5 seul dès qu'une pub a plusieurs textes, avec les options de texte de Meta (`DEGREES_OF_FREEDOM`), validé dans le Gestionnaire ;
  - `main` (ventes, finance lot 2) fusionné dans la branche, prévisualisation validée par Edgar sur Mac et iPhone, puis mise en production ;
  - lecture de l'agent testée en production (200, aucun avertissement).
- **Reste :** premier dépôt des textes de A, B et D par l'agent.

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
- **Hub adapté et en production le 20/10** (spec et plan `2026-10-20-ventes-paiements`) : une vente signée par compte (formule, une fois ou 6 fois, maintenance), échéancier rapproché des factures Stripe payées (délai de grâce de 5 jours), carte Vente sur la fiche client, section « Ventes signées » dans Finance (à encaisser ce mois, maintenance mensuelle, reste, part en 6 fois, retards, fins d'engagement, prévision sur 6 mois face à 2 538 € de CA). Étapes renommées « 1er paiement reçu » et « Site payé ». Limite connue : les remboursements Stripe n'ont pas de client, ils sont signalés au lieu d'être rattachés. 297 tests.

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
