# Formulaire client : le questionnaire rempli par le client

> Conception du 23/10/2026, Hub Agence (`livrables/hub-agence/`, dépôt `Beepurst/hub-agence-kleak`).
> Suite du brief de production (`docs/superpowers/specs/2026-10-22-brief-production-design.md`), en production depuis le 23/10, qui avait laissé « la page publique que le client remplit lui-même » pour plus tard.

## Pourquoi

Après la signature, il faut recevoir du client ce que lui seul connaît : coordonnées, goûts, logo, photos, mentions légales. Ainsi Kleak construit juste du premier coup, et le délai de livraison démarre quand les contenus sont reçus.

À l'époque, Kleak utilisait un Tally (`https://tally.so/r/3xOObo`, « Onboarding création de site web » : identité, secteur, contact, site actuel, infos juridiques, mode de paiement, cible, offre). Le questionnaire de cadrage du hub est bien plus complet (environ 45 questions), mais trop long à faire remplir à un artisan.

**Principe décidé avec Edgar : le client ne donne que ce que lui seul connaît.** Ce qu'Edgar apprend pendant l'appel découverte n'est pas redemandé. Il est rempli dans le brief par Edgar ou par Claude :
- activité, services, client idéal, points forts ;
- questions fréquentes, bouton principal, sections souhaitées.

## Objectifs

1. **Une page publique par brief**, ouverte par un lien unique, sans compte, pensée d'abord pour le téléphone, aux couleurs de Kleak. Environ 10 minutes.
2. **4 écrans** (le détail des questions est plus bas) :
   1. Vous et vos coordonnées ;
   2. Vos goûts ;
   3. Vos contenus ;
   4. Légal et technique.
3. **Pré-remplissage** : ce que le compte connaît déjà (nom, email, téléphone, entreprise) est affiché et modifiable.
4. **« Je vous fais confiance »** sur chaque question de goût. **« Je l'envoie plus tard »** sur chaque contenu, comme dans le questionnaire de cadrage.
5. **Enregistrement automatique** à chaque réponse : le client peut s'arrêter et revenir avec le même lien, sur un autre appareil.
6. **Envoi de fichiers** depuis le téléphone : logo et photos, stockés dans le hub.
7. **Envoi du formulaire** : le brief du hub se remplit (mêmes clés que le questionnaire de cadrage), l'étape Questionnaire passe « en cours », et Edgar reçoit une alerte push sur son iPhone.
8. **Envoi du lien depuis la fiche brief** :
   - bouton « Envoyer par WhatsApp » : il ouvre WhatsApp sur la conversation du client, avec le message et le lien déjà écrits. Edgar appuie sur « Envoyer » ;
   - si le client n'a pas de numéro mobile, ou au choix d'Edgar : bouton « Envoyer par email », depuis l'adresse du domaine Kleak (IONOS), par Brevo.
9. **Relances automatiques par email**, sans relance inutile (règles plus bas).

## Hors périmètre

- L'API WhatsApp Business (envoi et relances WhatsApp entièrement automatiques) : écartée par Edgar, l'envoi WhatsApp se fait en un geste depuis son numéro.
- Le pré-remplissage automatique des réponses « de l'appel » depuis la transcription du rendez-vous : il dépend du module devis, encore en construction. Pour l'instant, Claude les remplit en session par l'entrée réservée `/api/agent/briefs`, ou Edgar sur la fiche.
- Le paiement : le Tally demandait « Je souhaite payer », mais la vente est déjà signée dans le hub (module Ventes).
- La conversion des photos HEIC et le recadrage : les fichiers sont gardés tels quels.

## Ce qui serait un échec

- Une relance envoyée à un client qui vient de remplir, qui a tout envoyé, ou avec qui Edgar est déjà en contact.
- Un client qui perd ce qu'il a saisi (fermeture de l'onglet, réseau coupé).
- Un lien qui donne accès au brief d'un autre client, ou qui permet de lire autre chose que son propre formulaire.
- Des réponses du client qui écrasent ce qu'Edgar ou Claude a rempli depuis l'appel (activité, services…).
- Un formulaire qui demande à nouveau ce que le client a déjà donné.

## Les 4 écrans

Les clés sont celles de `src/lib/questionnaire.ts` (et de `livrables/process/questionnaire-cadrage.md`). Les questions affichées dépendent de la formule du brief.

1. **Vous et vos coordonnées**
   - pré-remplis : `entreprise_nom`, `contact_nom`, `contact_email`, `contact_tel` ;
   - à compléter : `tel_public`, `zone`, `horaires`, `adresse` (facultatif), `validateur` et `validateur_nom` ;
   - en Pro : `histoire` (facultatif).
2. **Vos goûts** (cartes visuelles, images de `livrables/process/questionnaire-visuels/`)
   - toutes formules : `mots` (3 au plus), `luminosite`, `polices`, `couleurs_source`, `palette` ou `couleurs_codes` selon le choix, `couleur_interdite`, `sites_aimes` (1 lien, facultatif sauf en Pro), `a_eviter` ;
   - en Pro : `ambiance`, `concurrent`.
3. **Vos contenus**
   - `logo` (envoi de fichier) ou `logo_absent`, `charte` ;
   - `photos_source` puis `photos` (envoi de fichiers, 30 au plus) ;
   - `textes_source` puis `textes` ;
   - `avis_google`, `temoignages`, `chiffres`, `reseaux` ;
   - en Pro : `realisations`, `equipe`.
4. **Légal et technique**
   - `domaine_statut` puis `domaine`, `site_actuel` ;
   - `email_pro` ;
   - `legal_raison`, `legal_siret`, `legal_siege`, `legal_responsable` ;
   - `outils`, `outils_detail` ;
   - `indispos`, `commentaire` ;
   - `rgpd` (case obligatoire), avec la mention d'information du questionnaire de cadrage.

**Questions qui ne sont jamais montrées au client** (remplies depuis l'appel) : `activite`, `services`, `client_ideal`, `differences`, `action_principale`, `action_autre`, `questions_clients`, `pages`, `pages_autre`, `sections_souhaitees`.

**Écran de fin** : celui du questionnaire de cadrage (« Merci, c'est reçu… »), avec le délai de la formule. S'il manque des contenus, il les liste et rappelle que le même lien permet de les ajouter.

## Envoi du lien

- Sur la fiche brief (étape Questionnaire), le bouton **« Créer le lien client »** génère un lien unique, long et non devinable, valable pour ce brief seulement. Edgar peut le désactiver ou en recréer un.
- **« Envoyer par WhatsApp »** ouvre `https://wa.me/<numéro>?text=<message>` :
  - le numéro est le `contact_tel` du compte, au format international ;
  - le message est court, signé Edgar, avec le lien.

  Le hub note la date du clic (« lien envoyé par WhatsApp le … »).
- **« Envoyer par email »** passe par Brevo, avec l'expéditeur du domaine Kleak (`BREVO_SENDER_EMAIL`, réponse vers `BREVO_REPLY_TO`). Le hub note l'envoi.

## Relances

Elles partent seules, par email (Brevo), avec deux relances au plus. Une relance part seulement si **toutes** ces conditions sont vraies :
- le lien a été envoyé (WhatsApp ou email) ;
- le formulaire n'a pas été envoyé, ou il l'a été mais il reste des contenus « plus tard » ;
- le client n'a rien enregistré depuis 48 h ;
- Edgar n'a pas coché « En contact avec le client » sur la fiche ;
- on est un jour de semaine, entre 9 h et 18 h, heure de Paris ;
- la précédente relance date de 3 jours au moins (première relance 2 jours ouvrés après l'envoi du lien, seconde 3 jours ouvrés après la première).

Chaque relance :
- dit précisément ce qui manque (« il nous manque votre logo et vos photos ») ;
- contient le lien direct ;
- est notée sur le brief (date, contenu manquant).

Quand la seconde relance reste sans réponse 3 jours ouvrés, aucune nouvelle relance ne part. Edgar reçoit alors une alerte push : « appeler <client> ».

## Décisions prises avec Edgar

- Le client ne remplit que ce que lui seul connaît, en 4 écrans ; le reste vient de l'appel découverte.
- Envoi du lien par WhatsApp en un geste depuis le numéro d'Edgar ; l'email du domaine IONOS en secours.
- Relances automatiques, par email, sans relance inutile.

## Choix de Claude (à relire par Edgar)

- **Brevo par modèles**, comme le CRM (`src/lib/crm/brevo.ts`, `envoyerModele`) : deux nouveaux modèles Brevo, « Lien du questionnaire » et « Relance questionnaire ». Leurs paramètres : prénom, lien, liste de ce qui manque. Edgar les crée dans Brevo (ou Claude lui en donne le texte). Leurs identifiants vont dans des variables d'environnement. Tant que Brevo n'est pas configuré, le bouton email est désactivé avec la raison, et aucune relance ne part.
- **Relances dans le cron existant** `/api/cron/relances` (8 h UTC chaque jour), plutôt qu'un nouveau cron. Une seule passe par jour suffit : la règle « en semaine, en journée » est garantie par l'heure du cron (10 h à Paris), et le samedi et le dimanche sont exclus dans le code.
- **Lien** : jeton aléatoire stocké sur le brief. Le jeton donne accès en lecture et en écriture au formulaire de ce brief seulement, jamais au reste du hub. La page publique et ses routes sont exemptées du mot de passe du hub, comme `api/intake` et `desinscription`.
- **Écriture des réponses** : la page publique n'écrit que les clés des 4 écrans (liste blanche) et passe par `fusionnerReponses`. Elle ne peut donc ni effacer ni modifier les réponses remplies depuis l'appel.
- **Après validation de l'étape Questionnaire** par Edgar ou Claude, le formulaire du client passe en lecture seule (« Votre questionnaire a bien été reçu »). Un envoi de fichier « plus tard » reste possible jusqu'à la validation de l'étape Maquette.
- **Fichiers** dans le stockage Supabase du hub, sous `briefs/<id>/client/`. Images (JPG, PNG, HEIC, WebP) et documents (PDF, SVG, AI, EPS, DOCX, TXT) selon la question. 20 Mo par fichier, 30 photos au plus. Les fichiers apparaissent dans le panneau Questionnaire de la fiche brief.
- **Alerte push** à l'envoi du formulaire et à la fin des relances (même mécanisme que les alertes Ads, `src/lib/push.ts`).

## Précisions après relecture (choix de Claude)

1. **Questions conditionnées par une réponse de l'appel.** Le formulaire évalue les conditions sur le brief entier (réponses du client et réponses de l'appel fusionnées). Ainsi `realisations` n'apparaît que si Edgar a coché la page Réalisations. Une question dont la condition dépend d'une clé de l'appel encore vide est masquée. Elle n'est alors ni demandée, ni comptée comme manquante pour le client.
2. **Ordre appel / formulaire.** Le lien peut être envoyé avant que la partie appel soit remplie. L'envoi du client ne valide rien : l'étape Questionnaire passe « en cours ». Sa validation reste soumise à `peutValider` sur le brief entier, comme aujourd'hui.
3. **« Ce qui manque »** (une fonction pure, testée, utilisée par les relances, l'écran de fin et la fiche) :
   - les questions obligatoires des 4 écrans encore vides ;
   - les contenus marqués « plus tard » qui n'ont toujours ni fichier ni texte.

   Un envoi partiel compte comme reçu : 5 photos sur 30, c'est des photos reçues. « Tout envoyé » veut dire que cette liste est vide.
4. **Calendrier.** Jours ouvrés = du lundi au vendredi, sans jours fériés. Le cron de 8 h UTC tire à 9 h l'hiver et à 10 h l'été à Paris, deux heures dans la fenêtre.
5. **« En contact avec le client »** : une case par brief, sur la fiche (étape Questionnaire). Elle reste cochée jusqu'à ce qu'Edgar la décoche, et rien ne la décoche tout seul.
6. **Fichiers.**
   - **Envoi :** par URL d'envoi signée Supabase (les fonctions Vercel limitent la taille des requêtes). Le serveur vérifie le jeton, le type, la taille et le plafond avant de signer.
   - **Stockage :** un **bucket privé dédié** `briefs-client`.
   - **Plafonds :** 20 Mo par fichier, 30 photos, 300 Mo par brief.
   - **Formats vectoriels :** SVG, AI et EPS sont acceptés pour le logo (ce sont les meilleurs formats), mais ne sont jamais affichés dans le navigateur : téléchargement signé seulement.
   - **Lecture :** le client voit la liste de ses fichiers (nom, miniature pour les photos via une URL de lecture signée de courte durée) et peut en retirer un.
   - **Débit :** limite d'envoi par jeton, avec le `rate-limit` du hub.
7. **Après validation de l'étape Questionnaire**, le client ne peut plus qu'ajouter les contenus encore « plus tard » : fichiers et textes de `textes`, `realisations`, `photos`, `logo`. Les relances continuent tant que la liste de la précision 3 n'est pas vide et que l'étape Maquette n'est pas validée. Elles s'arrêtent ensuite.
8. **Écriture concurrente.** Enregistrement champ par champ, fusionné côté serveur, et la dernière écriture gagne. Le client peut corriger les clés de ses 4 écrans même si Edgar les avait remplies, puisque ce sont ses informations. Il ne touche jamais aux clés de l'appel.
9. **Téléphone.**
   - Normalisation au format international, +33 par défaut pour un numéro à 10 chiffres commençant par 0.
   - Un numéro qui commence par 06 ou 07 (ou un numéro étranger déjà au format +) active le bouton WhatsApp. Un fixe le désactive, avec la raison.
   - Edgar peut toujours saisir un autre numéro pour l'envoi.
10. **Brevo.** Un paramètre `manquants` en texte déjà rédigé (liste à puces en HTML simple), plus `prenom` et `lien`. Claude donne à Edgar le texte des deux modèles à créer dans Brevo.
11. **Jeton.**
    - 32 octets aléatoires. On stocke son empreinte (SHA-256, pour le retrouver, comparée en temps constant) et le jeton chiffré (AES-256-GCM, clé serveur `FORMULAIRE_CLE`), pour que les relances renvoient le même lien que le message WhatsApp.
    - « Recréer » invalide l'ancien lien immédiatement. « Désactiver » le coupe.
    - Le jeton expire de lui-même à la validation de l'étape Maquette.
12. **`sites_aimes`** : 1 lien facultatif pour One page et Essentiel ; en Pro, 1 à 3 liens, dont 1 obligatoire, comme dans le questionnaire de cadrage.

## Contraintes

- Celles du hub : couleurs dans `src/app/theme.css`, navigation dans `src/lib/navigation.ts`, `router.refresh()` après enregistrement côté hub, pas de `npm run build` pendant un serveur de dev.
- Travail sur une branche, fusion dans `main` (donc mise en production) après validation d'Edgar.
- SQL exécuté par Edgar, recopié en entier dans la conversation.
- Textes en français, sans tiret long. La page publique respecte la checklist qualité : contraste, champs à 16 px (sinon iOS zoome à la saisie), zones de clic de 44 px, `lang="fr"`.

## Laissé au constructeur

- Le schéma exact (colonnes sur `briefs` ou table du lien et des relances), tant que l'historique des envois et des relances est gardé.
- La mise en page des 4 écrans, dans l'esprit des visuels Kleak.
- Le texte exact des messages WhatsApp et email, à soumettre à Edgar avant la fusion (règle maison : textes sobres, sans formules typées IA).
