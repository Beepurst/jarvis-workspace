# Du RDV découverte à la facture d'acompte dans le Hub Agence : conception

> 21 octobre 2026. Conçue avec Edgar, à valider.
> Contexte : analyse du parcours client (`livrables/process/parcours-client-analyse.md`, points 9 à 11
> et section 6). Offre de référence : `livrables/offre/fiche-offre.md` et `src/lib/offre.ts`.

## 1. Intention

Le premier test Meta démarre vers le 25/10, et les premiers RDV découverte peuvent tomber dans la
semaine qui suit. Aujourd'hui, après un RDV, il n'y a rien : pas de notes structurées, pas de
modèle de devis, pas de facture prête. Un devis envoyé trois jours après l'appel arrive chez un
prospect déjà refroidi. Le projet doit donc être prêt pour le premier RDV.

Edgar veut que le hub fasse le travail entre la fin de l'appel et l'envoi :

1. le RDV se passe en visio, une IA transcrit l'appel ;
2. à la fin, la transcription arrive seule sur la fiche du prospect, **résumée en points courts**,
   avec les **détails importants mis en avant** (friction sur le prix, demande particulière…) ;
3. un **devis est préparé automatiquement** à partir de ce résumé ;
4. Edgar le vérifie, clique sur un bouton, et le hub crée **un brouillon dans son Gmail** avec le
   devis en pièce jointe. **Edgar envoie à la main** ;
5. le prospect **renvoie le devis signé** ;
6. Edgar le dépose sur la fiche et marque le devis signé : le hub crée la vente et **la facture
   (ou la première échéance) directement dans Stripe**, qu'Edgar vérifie puis envoie depuis le hub.

Le principe qui traverse tout : **le hub prépare, Edgar valide, rien ne part sans son clic.**

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Récupérer sans copier-coller la transcription d'un RDV découverte et la rattacher au bon compte.
- Afficher sur la fiche un résumé lisible en 30 secondes, et un encadré « Points d'attention ».
- Préremplir un devis conforme à partir du résumé et du catalogue `offre.ts`, modifiable.
- Produire le PDF du devis (avec les CGV en annexe) et le déposer en brouillon dans Gmail.
- Au devis signé : créer la vente (module Ventes existant) et la facture dans Stripe.
- Faire avancer le pipeline : `rdv_pris` → `devis_envoye` → `acompte_paye`.

**Non-objectifs**
- Envoyer un devis ou une facture sans action d'Edgar. Seules les relances après devis partent
  seules (section 3.5).
- Signature électronique intégrée : le client signe le PDF (à la main ou dans son lecteur PDF) et
  le renvoie par email.
- Lire la boîte Gmail d'Edgar (le hub écrit des brouillons, il ne lit rien).
- Factures électroniques au format réglementaire 2027 (sujet séparé, plus tard).
- Remplacer Tiime ou un logiciel de comptabilité : il n'y en a pas dans ce circuit.

**Anti-objectifs (le projet échoue s'il…)**
- invente un élément que le prospect n'a pas dit (formule, option, budget, délai) et le met dans le
  devis comme si c'était acquis ;
- produit un devis ou une facture non conforme (mentions obligatoires manquantes, numérotation
  cassée, deux séries de factures) ;
- donne au hub un accès Stripe capable de rembourser ou de virer de l'argent ;
- affiche la transcription brute en gros paragraphes à la place du résumé ;
- bloque Edgar quand l'automatique échoue : il doit toujours pouvoir coller une transcription ou
  remplir le devis à la main.

## 3. Le parcours, étape par étape

### 3.1 Le RDV et sa transcription

- **Outil de visio : Cal Video** (la visio intégrée à Cal.com), décidé avec Edgar le 21/10 sous
  réserve d'un test. Cal.com est déjà branché au hub (webhook `src/app/api/webhooks/calcom`, qui
  traite aujourd'hui `BOOKING_CREATED`, `BOOKING_CANCELLED`, `BOOKING_RESCHEDULED`).
  - Le type de RDV « Appel découverte » passe en lieu Cal Video, avec la transcription automatique
    à l'arrivée de l'organisateur et la transcription non désactivable par l'invité (réglages Cal
    Video avancés).
  - L'API Cal.com v2 fournit les liens de téléchargement des transcriptions d'une réservation
    (`GET /v2/bookings/{uid}/transcripts`, liens valables 1 h). Aucun déclencheur « transcription
    prête » n'a été trouvé : le hub s'abonne à la fin de réunion (`MEETING_ENDED`) et va chercher
    la transcription, en réessayant tant qu'elle n'est pas prête.
- **Test préalable (à faire par Edgar avant la construction de cette partie) :** un appel Cal
  Video de 5 minutes en français, transcription activée. On juge la qualité du français, le délai
  de disponibilité, et que le plan Cal.com d'Edgar inclut bien la transcription.
- **Plan B : tl;dv avec Google Meet**, qu'Edgar utilisait avant (compte gratuit aujourd'hui). Son
  envoi automatique (webhook « transcription générée ») demande un plan payant, Pro ou Business
  selon les sources, environ 18 à 29 $ par mois, à confirmer. Le hub doit être construit pour que
  changer de source ne touche que l'entrée : **une source = un adaptateur qui produit un texte de
  transcription rattaché à un compte.**
- **Toujours disponible : « Coller une transcription »** sur la fiche, pour le cas où
  l'automatique échoue ou pour un appel passé ailleurs (téléphone repris en visio, tl;dv gratuit).
- **Rattachement au compte :** par la réservation Cal.com (uid déjà stocké sur le compte,
  `rdv_uid`). Si aucun compte ne correspond, même traitement que les réservations orphelines
  aujourd'hui : notification « non rattaché » et choix du compte à la main.
- **Consentement :** le prospect est informé que l'appel est transcrit, dans la confirmation de
  RDV et par Edgar au début de l'appel. La politique de confidentialité de kleakagency.fr reçoit
  deux lignes : la transcription par Cal.com, et le traitement par le fournisseur d'IA. Le texte
  de ces ajouts est un livrable de ce projet (pas du code).

### 3.2 Le résumé sur la fiche

À la réception d'une transcription, le hub appelle un modèle d'IA qui renvoie un résultat
**structuré** (champs fixes, pas du texte libre), stocké avec la transcription.

**Fournisseur : Groq, offre gratuite** (décision d'Edgar le 21/10 : la solution doit être
gratuite). La clé `GROQ_API_KEY` existe déjà dans `.env.local` du hub (ancien générateur de
textes, retiré). Selon les conditions de Groq citées par des sources tierces, les entrées et
sorties ne servent pas à entraîner les modèles, et elles sont conservées au plus 30 jours pour
la lutte contre les abus. Le traitement a lieu hors de l'Union européenne : à mentionner dans la
politique de confidentialité. Le constructeur vérifie les conditions, les limites gratuites
(jetons par minute) et choisit le modèle le plus solide en français parmi ceux de l'offre
gratuite. Une transcription de 30 minutes doit tenir dans une requête ; sinon, la découper.
**Écartés :** l'API Anthropic (payante) ; l'offre gratuite de Gemini, dont les contenus peuvent
servir à améliorer les produits Google, ce qui n'est pas acceptable pour des conversations de
prospects. Le fournisseur est isolé derrière une seule fonction, pour pouvoir en changer.

**Bloc « RDV découverte » du JJ/MM**, en points courts :
- **Entreprise** : activité, zone, taille si citée.
- **Besoin** : site existant ou non, ce que le site doit apporter.
- **Formule pressentie** et **options évoquées** (page supplémentaire, automatisation, rédaction).
- **Budget annoncé** et **mode de paiement envisagé** (une fois, 6 fois, pas abordé).
- **Contenus disponibles** : logo, photos, textes, nom de domaine.
- **Prochaine étape** : ce qui a été promis (date du devis, date de rappel).

**Encadré « Points d'attention »**, mis en avant au-dessus du bloc, seulement s'il y en a :
friction sur le prix, demande particulière, hésitation, délai imposé, décision qui dépend d'un
tiers, concurrent cité. **Chaque point porte la phrase exacte du prospect** en citation courte.
Une demande **hors du périmètre vendu** (boutique, espace client, prise de RDV en ligne, traduction…,
voir « Ce qui n'est pas compris » de la fiche offre) est marquée « hors formule ».

**Règles du résumé**
- Rien d'inventé : un champ non abordé dans l'appel vaut « non abordé », jamais une supposition.
- Si l'appel ne permet pas de choisir une formule, la formule vaut « à trancher » et le devis
  n'est pas prérempli sur ce point.
- La transcription complète reste accessible derrière un lien « Voir la transcription », jamais
  affichée en entier sur la fiche.
- Le résumé est **modifiable** par Edgar (il corrige ce que l'IA a mal compris avant de faire le
  devis).
- Une notification push « Résumé du RDV prêt : <nom> » part quand le résumé est disponible.

### 3.3 Le devis

**Préremplissage** depuis le résumé et `offre.ts` : formule, prix catalogue, options retenues,
maintenance de la formule, mode de paiement s'il a été dit. Pour la formule `sur_mesure`, le prix
est laissé vide et doit être saisi.

**Éditeur sur la fiche** : formule, options, prix (modifiable, avec rappel du prix catalogue),
mode de paiement, maintenance (oui/non, obligatoire en 6 fois), lignes libres éventuelles, identité
du client. Chaque modification régénère l'aperçu.

**Identité du client** (mentions obligatoires d'un devis) : raison sociale, adresse, SIRET. Après
un appel, on a souvent seulement le nom de l'entreprise et la ville. Le hub propose les
correspondances de l'annuaire public des entreprises (API Recherche d'entreprises de l'État,
gratuite, sans clé) et Edgar choisit. Ces informations sont enregistrées sur le compte (elles
servent ensuite aux factures et aux mentions légales du site).

**Contenu du devis** (PDF, aux couleurs de Kleak) :
- émetteur : identité légale d'Edgar en entreprise individuelle (nom, mention « EI », adresse,
  SIRET, email, téléphone) ; ces valeurs sont des réglages, pas du code en dur ;
- numéro unique et chronologique, date, **validité 30 jours**. La série des devis démarre au
  même numéro de départ que les factures (voir 3.4), choix de Claude par cohérence ;
- client : raison sociale, adresse, SIRET ;
- détail : formule et ce qu'elle comprend (repris de la fiche offre), options, délai de livraison
  de la formule et sa condition (« après réception des contenus et du premier paiement »), nombre
  de séries de retouches ;
- prix : site, options, total ; « TVA non applicable, article 293 B du CGI » ;
- paiement : en une fois (50 % à la signature, 50 % avant la mise en ligne) ou en 6 fois
  (échéancier écrit en entier : 6 montants, dates relatives, maintenance qui démarre le mois de la
  mise en ligne et s'ajoute aux versements, site à Kleak jusqu'au dernier versement) ;
- maintenance : montant mensuel, **sans engagement, préavis de 2 mois**, hébergement inclus ;
- conditions de paiement entre professionnels : pénalités de retard et indemnité forfaitaire de
  recouvrement de 40 € ;
- zone « Bon pour accord » : date, nom, signature ;
- **CGV en annexe**, dans le même PDF.

**Envoi** : bouton « Préparer l'email ». Le hub crée **un brouillon dans le Gmail d'Edgar** (son
adresse Gmail, c'est elle que voient les prospects) : destinataire du compte, objet « Votre devis
Kleak, <entreprise> », message court modifiable dans un réglage, PDF en pièce jointe. Le hub
affiche ensuite un lien direct vers le brouillon. Le devis passe en « préparé ».
Edgar envoie dans Gmail, puis clique sur « Marquer envoyé » dans le hub : le devis passe en
« envoyé », le compte en `devis_envoye`, avec la date de relance proposée (J+3).

Un devis envoyé n'est plus modifiable : une correction crée une **nouvelle version** (même numéro
suffixé de la version), l'ancienne reste consultable.

### 3.4 Le devis signé, la vente et la facture

Edgar dépose le PDF signé reçu par email sur la fiche et clique « Devis signé ». Le hub :

1. enregistre le PDF signé et passe le devis en « signé » ;
2. crée la **vente** dans le module Ventes existant (`src/lib/ventes`), avec les valeurs du devis
   (formule, prix, options, mode de paiement, maintenance) ; la date de signature est celle du
   clic, modifiable ;
3. crée ou retrouve le **client Stripe** (email, raison sociale, adresse) et l'enregistre sur la
   vente (`stripeClientId`), ce qui branche le rapprochement existant ;
4. prépare dans Stripe, **en brouillon** :
   - en une fois : la facture d'acompte de 50 % ;
   - en 6 fois : la première échéance, et le prélèvement des 5 suivantes ;
5. affiche le brouillon de facture sur la fiche. Edgar clique « Envoyer la facture » : le hub la
   finalise dans Stripe, Stripe l'envoie au client avec le lien de paiement.

Plus tard, depuis la fiche :
- **« Facturer le solde »** (paiement en une fois), à la livraison, même circuit brouillon puis
  envoi ;
- **« Démarrer la maintenance »**, au mois de la mise en ligne, qui crée l'abonnement mensuel.

Chaque facture Stripe porte le numéro du devis (champ personnalisé « Devis n° »).

**Numérotation des factures** (décision d'Edgar, 21/10) : l'entreprise individuelle d'Edgar a déjà
émis des factures avec ce SIRET (ancienne activité), mais Kleak **repart sur une nouvelle série**,
avec un **premier numéro élevé** choisi par Edgar, pour ne pas afficher « facture n° 1 ». Règles :
- la série a son **propre préfixe** (par exemple `KLK-`), distinct de tout ce qui a été émis
  avant, pour qu'il n'y ait jamais deux factures au même numéro sous le même SIRET ;
- à partir du premier numéro, la suite est **continue, sans trou ni doublon** : toutes les
  factures Kleak sortent de Stripe, aucune d'un autre outil ;
- préfixe et premier numéro sont réglés dans Stripe (numérotation séquentielle du compte), par
  Edgar, avant la première facture. Le constructeur vérifie dans Stripe comment fixer le numéro
  de départ et l'indique dans la liste des réglages ;
- une facture finalisée ne se supprime jamais : une erreur se corrige par un avoir. Les mentions
françaises (293 B, pénalités, indemnité de 40 €, identité de l'émetteur) sont posées dans les
réglages de facturation du compte Stripe : liste des réglages à fournir à Edgar, qui les fait.

**Stripe en écriture** : une **seconde clé restreinte**, distincte de `STRIPE_SECRET_KEY` (lecture
seule, Finance), limitée aux permissions nécessaires (clients, factures, lignes de facture,
produits et prix, abonnements). Aucune permission sur les remboursements, les virements, les
comptes. Elle n'est utilisée que par les actions déclenchées par un clic d'Edgar.

### 3.5 Les relances après l'envoi du devis

Décision d'Edgar (21/10) : les relances sont automatisées, par email et par WhatsApp si possible.
C'est la seule exception au principe « rien ne part sans un clic » : elle est décidée par Edgar,
et chaque relance peut être coupée sur la fiche.

**Email, automatique et gratuit, depuis Gmail.** Le hub envoie lui-même la relance depuis
`kleakagency@gmail.com` (même branchement Google que les brouillons, avec en plus le droit
d'envoyer). Avantages : aucun coût, et le problème DMARC d'IONOS (qui bloque Brevo) ne joue pas.
La relance part **en réponse dans le fil du devis** (même objet, l'historique reste visible).
- Calendrier par défaut (choix de Claude, réglable) : J+3 et J+7 après « Marquer envoyé », dans
  les créneaux d'envoi déjà utilisés par le CRM (9 h à 19 h, lundi à samedi, heure de Paris).
- La relance ne part pas si le devis est signé, refusé, remplacé par une nouvelle version, si le
  compte est désinscrit ou perdu, ou si Edgar l'a coupée.
- Le hub ne lit pas la boîte : si le prospect a répondu, Edgar doit couper la relance ou passer le
  devis en « en discussion ». Pour limiter le risque, une notification push part la veille de
  chaque relance : « Relance du devis demain : <nom>. Couper ? ».
- Textes courts, dans le phrasé d'Edgar (pas de formules toutes faites), modifiables dans un
  réglage. Après la dernière relance, la prochaine action devient « Appeler <nom> ».

**WhatsApp : semi-automatique et gratuit.** Un envoi vraiment automatique passe par l'API
WhatsApp Business de Meta : messages modèles validés par Meta, facturés à l'unité (pas de tarif
France trouvé), numéro dédié, vérification de l'entreprise. Trop lourd et payant pour le volume
actuel : **écarté pour l'instant**. À la place, le jour de la relance, si le prospect a accepté
WhatsApp dans le formulaire Meta, la notification push ouvre un lien WhatsApp prérempli (numéro
et message) : Edgar n'a qu'à appuyer sur Envoyer depuis son iPhone. Le hub marque la relance
WhatsApp « proposée » ; Edgar confirme l'envoi d'un clic. À reconsidérer quand le volume de devis
le justifiera.

## 4. Contraintes

- **Prêt pour le premier RDV**, environ une semaine. L'ordre de construction (section 6) doit
  livrer tôt ce qui sert sans transcription.
- Dépôt `Beepurst/hub-agence-kleak`, travail sur une branche, fusion après validation d'Edgar
  (chaque push sur `main` part en production). Jamais de `npm run build` pendant un serveur dev.
- Schéma Supabase : fichier SQL idempotent dans `supabase/`, exécuté par Edgar, et le SQL complet
  recopié dans la conversation.
- Variables d'environnement : posées par Edgar via script, jamais affichées.
- Montants en centimes, catalogue unique `src/lib/offre.ts`. Dates en jour de Paris.
- Couleurs dans `src/app/theme.css`, règles de la refonte couleur (la couleur va aux chiffres et
  aux cartes, jamais aux listes).
- RGPD : transcriptions et PDF signés sont des données personnelles ; stockage privé (pas d'URL
  publique), suppression du compte = suppression des transcriptions et des fichiers.
- `ENGAGEMENT_MOIS = 12` dans `offre.ts` contredit la décision du 21/10 (maintenance sans
  engagement, préavis de 2 mois). Le devis ne doit jamais parler d'engagement de 12 mois.
  **Ce projet corrige ce point** (choix de Claude) : sans cela, la vente créée au devis signé
  contredirait le devis. La maintenance d'une vente devient **sans date de fin** :
  `maintenance_mois` (aujourd'hui non nul, 12 par défaut, `supabase/ventes.sql`) passe à
  « illimitée » (nullable ou équivalent), l'échéancier projette la maintenance sur l'horizon
  de prévision de Finance (6 mois) au lieu de 12 échéances fixes, l'alerte de fin d'engagement
  (`FIN_ENGAGEMENT_ALERTE_JOURS`) disparaît, et une **date d'arrêt** optionnelle sur la vente
  permet d'enregistrer une résiliation (préavis de 2 mois compris). L'abonnement Stripe de
  maintenance est sans date de fin.
- **D'où viennent les RDV** : les leads Meta réservent par Cal.com (bouton de fin du formulaire
  instantané). Le site kleakagency.fr renvoie encore vers l'ancien Calendly tant que le problème
  IONOS bloque les travaux du site (bascule vers Cal.com avec `canal=site` déjà prévue dans la
  to-do). Un RDV pris par Calendly n'a ni transcription automatique ni rattachement : il passe
  par « Coller une transcription », ce qui est acceptable tant que le volume du site reste faible
  (environ 50 visiteurs par mois).

## 5. Ce qui a été décidé avec Edgar (21/10)

- Visio et transcription : Cal Video d'abord (test de 5 min), tl;dv Pro en plan B. Appels en visio.
- Résumé en points, détails importants (friction prix, demande particulière) mis en avant.
- Devis préparé automatiquement, vérifié par Edgar.
- Bouton qui crée un brouillon Gmail avec le PDF ; envoi à la main par Edgar, depuis son adresse
  Gmail.
- Le client renvoie le devis signé.
- La facture est créée directement dans Stripe par le hub (pas à la main dans Stripe).
- Tout est construit maintenant, pas de devis faits à la main en attendant.
- Factures : nouvelle série, premier numéro élevé. Gmail : `kleakagency@gmail.com`, même compte
  Google que le projet Cloud.
- Résumé par une IA gratuite (Groq retenu par Claude sur ce critère).
- Relances après devis automatisées par email ; WhatsApp si possible (semi-automatique retenu
  par Claude, section 3.5).

## 6. Ce qui est laissé au constructeur, et mes choix par défaut

Choix faits par Claude, pas par Edgar, à remettre en cause si le constructeur a mieux :

- **Ordre de construction** : (1) devis éditable, PDF, brouillon Gmail ; (2) devis signé → vente
  → facture Stripe ; (3) transcription Cal Video + résumé IA + préremplissage ; (4) « Coller une
  transcription » arrive avec (3) mais ne dépend pas du test Cal Video. Ainsi (1) et (2) servent
  au premier RDV même si la transcription prend du retard.
- **PDF** : générer côté serveur avec une bibliothèque JavaScript compatible Vercel (par exemple
  `@react-pdf/renderer`), sans navigateur sans tête.
- **Gmail** : la boîte est **`kleakagency@gmail.com`**, un Gmail personnel (pas Google
  Workspace), **même compte Google que le projet Cloud `hub-agence-kleak`** (confirmé par Edgar le
  21/10). OAuth Google avec le seul périmètre de rédaction de brouillons. Le périmètre Gmail est
  restreint : une appli laissée « en test » voit ses jetons expirer au bout de 7 jours, une appli
  publiée sans vérification affiche un avertissement à l'autorisation mais reste utilisable par
  son propriétaire. Le constructeur vérifie la règle Google en vigueur et choisit le statut qui
  garde un jeton durable pour ce seul utilisateur, ou une autre méthode aussi sûre et plus simple.
  Le jeton de rafraîchissement est stocké côté serveur, jamais exposé au navigateur.
- **Paiement en 6 fois dans Stripe** : facture de première échéance puis abonnement à durée
  limitée (ou calendrier d'abonnement), prélèvement SEPA ou carte. À valider en mode test Stripe
  avant tout client réel, y compris la manière dont le client donne son mandat de prélèvement.
- **Stockage des fichiers** (PDF de devis, PDF signés, transcriptions) : Supabase Storage, bucket
  privé, liens signés de courte durée.
- **Réessais de la transcription** : par le cron existant ou une tâche planifiée, pendant quelques
  heures après la fin de réunion, puis abandon avec notification « transcription introuvable ».
- **Relances après l'envoi du devis** : voir 3.5 (décision d'Edgar : automatiser par email et
  WhatsApp si possible). Les jours de relance sont des réglages.

## 7. Livrables hors code (pour Edgar)

- **CGV de prestation** courtes (périmètre, retouches, contenus en retard, propriété jusqu'au
  paiement complet, 6 fois et suspension en cas d'impayé, maintenance sans engagement avec préavis
  de 2 mois, transfert du site), à faire relire. Le devis ne part pas sans elles.
- **Ajouts à la politique de confidentialité** : transcription des appels (Cal.com), traitement
  par le fournisseur d'IA (Groq, hors UE), Stripe pour la facturation, relances par email et
  WhatsApp après un devis.
- **Liste des réglages** : Cal.com (type de RDV en Cal Video, transcription, webhook
  `MEETING_ENDED`, rappels veille et 1 h avant), Stripe (mentions de facture, clé restreinte en
  écriture), Google Cloud (OAuth Gmail), variables Vercel.
- **Identité de l'émetteur** à fournir par Edgar : nom légal, adresse, SIRET, téléphone.
- **Préfixe et premier numéro** de la série de factures (et de devis), choisis par Edgar.

## 8. Critères de réussite

- Après un RDV de test, la fiche montre le résumé et les points d'attention sans aucun copier-coller,
  et le devis est prérempli juste.
- De la fin de l'appel au brouillon Gmail prêt : moins de 10 minutes dont moins de 5 pour Edgar.
- Du devis signé à la facture d'acompte envoyée : 2 clics après le dépôt du PDF.
- La facture payée apparaît dans la vente et dans Finance par le rapprochement existant.
- Aucun devis ni facture ne part sans un clic d'Edgar. Les seuls envois automatiques sont les
  relances email de la section 3.5, et chacune peut être coupée.
