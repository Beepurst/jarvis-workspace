# Questionnaire de cadrage client

> Envoyé au client **après acceptation du devis**, par un lien unique propre à son projet (page publique du Hub Agence).
> But : construire le site juste du premier coup, pour tenir **2 ou 3 allers-retours maximum**.
> C'est aussi le moment où le client dépose ses contenus : **le délai de livraison démarre quand le questionnaire est envoyé avec tous les contenus obligatoires** (fiche offre, étape 3).
> Durée annoncée : 15 minutes. Le client peut enregistrer et reprendre plus tard.
> Visuels des choix en images : `livrables/process/questionnaire-visuels/`.

---

## Conventions

| Colonne | Sens |
|---|---|
| Clé | Identifiant stocké dans les réponses (`reponses` du brief) |
| Type | `texte`, `texte_long`, `email`, `tel`, `url`, `choix` (un seul), `choix_multiple` (avec max), `choix_image` (cartes visuelles), `fichiers`, `liste` (lignes répétables), `case` |
| Formule | `E` = Essentiel, `P` = Pro. Une question sans `E` n'est pas posée en Essentiel |
| Oblig. | Obligatoire pour envoyer. « Plus tard » = le client peut cocher « je l'envoie plus tard » ; l'envoi reste possible mais le projet est marqué « contenus incomplets » |

Toutes les questions acceptent une aide courte sous le libellé (colonne « Aide »).

---

## Intro (écran d'accueil)

> **Bienvenue, [prénom].**
> Ce questionnaire nous permet de concevoir un site qui vous ressemble dès la première version. Comptez 15 minutes. Vos réponses sont enregistrées au fur et à mesure : vous pouvez vous arrêter et revenir plus tard avec le même lien.
> Pas de bonne ou de mauvaise réponse. Si vous hésitez, cochez « je vous fais confiance » : c'est notre métier.

---

## 1. Vous et votre entreprise

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `entreprise_nom` | Nom de l'entreprise tel qu'il doit apparaître sur le site | texte | E P | oui | Pré-rempli depuis le compte |
| `contact_nom` | Votre nom | texte | E P | oui | Pré-rempli |
| `contact_email` | Votre email | email | E P | oui | Pré-rempli |
| `contact_tel` | Votre téléphone | tel | E P | oui | Pré-rempli |
| `validateur` | Qui valide le site de votre côté ? | choix : « Moi », « Une autre personne » | E P | oui | Une seule personne valide les maquettes. Plusieurs avis contradictoires sont la première cause de retard |
| `validateur_nom` | Nom et email de cette personne | texte | E P | si « autre personne » | |
| `activite` | Votre activité en deux phrases | texte_long (300 car.) | E P | oui | Comme vous la présenteriez à un nouveau client |
| `services` | Vos services ou produits principaux | liste (3 à 6 lignes : intitulé + une phrase) | E P | oui | Ils deviennent les blocs de votre page Services |
| `client_ideal` | Votre client idéal | texte_long | E P | oui | Qui est-il, que cherche-t-il, qu'est-ce qui le fait hésiter ? |
| `zone` | Votre zone d'intervention | texte | E P | oui | Ville, département, rayon… Utile pour le référencement local |
| `differences` | Pourquoi vous choisit-on plutôt qu'un concurrent ? | liste (3 lignes) | E P | oui | Ce sont vos arguments en tête de site |
| `histoire` | Votre histoire, en quelques lignes | texte_long | P | non | Pour la page À propos : création, parcours, valeurs |

## 2. L'objectif du site

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `action_principale` | Qu'attendez-vous en priorité d'un visiteur ? | choix : Appeler, Demander un devis, Prendre rendez-vous, Venir en boutique ou au cabinet, Écrire un message, Autre | E P | oui | Le bouton principal du site mènera à cette action |
| `action_autre` | Précisez | texte | E P | si « Autre » | |
| `questions_clients` | Les questions que vos clients vous posent toujours | liste (jusqu'à 5) | E P | non | Elles nourrissent les textes et une éventuelle FAQ |
| `pages` | Les pages de votre site | Essentiel : affichage fixe « Accueil, Services, Contact ». Pro : choix_multiple (exactement 5) parmi Accueil, Services, Réalisations, À propos, Contact, Tarifs, FAQ, Avis clients, Équipe, Autre | E P | oui (P) | Pro : 5 pages comprises, une page de plus = + 200 € |
| `pages_autre` | Nom de la page « Autre » | texte | P | si « Autre » | |

## 3. L'ambiance

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `mots` | Choisissez 3 mots pour votre site | choix_multiple (max 3) : Chaleureux, Premium, Minimaliste, Audacieux, Artisanal, Naturel, Technologique, Joyeux, Sobre, Rassurant, Élégant, Dynamique | E P | oui | |
| `luminosite` | Votre site plutôt… | choix_image : Clair, Sombre, Je vous fais confiance | E P | oui | Visuels `luminosite-*.png` |
| `ambiance` | Quelles ambiances vous parlent ? | choix_image (1 ou 2) : `artisan` Artisan chaleureux, `luxe` Luxe épuré, `tech` Moderne et technologique, `nature` Nature et bien-être, `audace` Audacieux et coloré, `classique` Classique et institutionnel, `confiance` Je vous fais confiance | P | oui | Visuels `ambiance-*.png` |
| `polices` | Quel style d'écriture pour vos titres ? | choix_image : `elegante` Élégante (à empattements), `moderne` Moderne et sobre, `geometrique` Géométrique et affirmée, `artisanale` Manuscrite et artisanale, `confiance` Je vous fais confiance | E P | oui | Visuels `polices-*.png` |
| `couleurs_source` | Vos couleurs | choix : J'ai une charte ou des couleurs imposées, Je choisis une palette, Je vous fais confiance | E P | oui | |
| `couleurs_codes` | Vos couleurs (codes ou description) | texte | E P | si « charte » | Ex. #1E3A5F, ou « le bleu de mon logo » |
| `palette` | Choisissez une palette | choix_image : `creme_noyer`, `ardoise_cuivre`, `blanc_marine`, `sauge_sable`, `noir_corail`, `bleu_ciel` | E P | si « palette » | Visuels `palette-*.png` |
| `couleur_interdite` | Une couleur que vous ne voulez surtout pas ? | texte | E P | non | |

## 4. Vos inspirations

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `sites_aimes` | Des sites que vous aimez | liste (Essentiel : 1, Pro : 1 à 3) : lien + « ce qui me plaît » | E P | P : oui (1 min.), E : non | N'importe quel secteur. Dites-nous ce qui vous plaît : les couleurs, les photos, la simplicité… |
| `concurrent` | Un concurrent dont vous voulez vous démarquer | url + texte | P | non | |
| `a_eviter` | Ce que vous ne voulez surtout pas voir sur votre site | texte_long | E P | non | Ex. trop de texte, des photos de stock, des animations partout |

## 5. Vos contenus

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `logo` | Votre logo | fichiers (SVG, PDF, AI, EPS, PNG ; 1 à 3 fichiers) | E P | plus tard | Le fichier vectoriel (SVG, PDF, AI) donne le meilleur rendu. Pas de logo ? Cochez « je n'en ai pas » |
| `logo_absent` | Je n'ai pas de logo | case | E P | non | Nous utiliserons votre nom en typographie soignée |
| `charte` | Votre charte graphique | fichiers (PDF) | E P | non | |
| `photos_source` | Vos photos | choix : Je les envoie, Choisissez des photos libres de droits, Une séance photo est prévue | E P | oui | Vos vraies photos (équipe, locaux, réalisations) convertissent mieux que des photos de stock |
| `photos` | Vos photos | fichiers (JPG, PNG, HEIC ; jusqu'à 30, 20 Mo chacun) | E P | plus tard si « je les envoie » | Le plus grand format possible, pas de captures d'écran |
| `textes_source` | Les textes du site | choix : Je les fournis, Reprenez ceux de mon site actuel en les améliorant, Je souhaite l'option rédaction (sur devis) | E P | oui | |
| `textes` | Vos textes | fichiers (DOCX, PDF, TXT) ou texte_long | E P | plus tard si « je les fournis » | Un document par page, ou un seul document avec des titres |
| `realisations` | Vos réalisations | liste : titre, lieu, courte description, photos | P | plus tard si la page Réalisations est choisie | 3 à 9 projets |
| `equipe` | Votre équipe | liste : nom, rôle, photo | P | non | Si la page Équipe ou À propos est choisie |
| `avis_google` | Lien vers votre fiche Google | url | E P | non | Pour afficher vos avis et votre note |
| `temoignages` | Témoignages à afficher | liste : texte, prénom, ville | E P | non | Uniquement de vrais avis, avec l'accord des clients |
| `chiffres` | Vos chiffres clés | liste (jusqu'à 4) : chiffre + libellé | E P | non | Ex. « 15 ans d'expérience », « 300 chantiers » |
| `adresse` | Adresse à afficher | texte | E P | non | Laissez vide si vous ne recevez pas de public |
| `horaires` | Horaires | texte_long | E P | non | |
| `reseaux` | Réseaux sociaux | liste : réseau + lien | E P | non | |

## 6. Technique et légal

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `domaine_statut` | Votre nom de domaine | choix : J'en ai déjà un, Je dois en acheter un, Je ne sais pas | E P | oui | |
| `domaine` | Lequel, et chez quel prestataire ? | texte | E P | si « déjà un » | Ex. monentreprise.fr chez OVH. Nous vous guiderons pour le brancher |
| `site_actuel` | Votre site actuel, s'il existe | url | E P | non | |
| `email_pro` | L'adresse qui recevra les demandes du formulaire | email | E P | oui | |
| `legal_raison` | Raison sociale et forme juridique | texte | E P | oui | Pour les mentions légales obligatoires |
| `legal_siret` | SIRET | texte (14 chiffres) | E P | oui | |
| `legal_siege` | Adresse du siège | texte | E P | oui | |
| `legal_responsable` | Responsable de la publication | texte | E P | oui | En général le dirigeant |
| `outils` | Outils déjà en place | choix_multiple : Fiche Google Business, Prise de rendez-vous en ligne, CRM, Logiciel de devis, Google Analytics, Aucun | E P | non | |
| `outils_detail` | Lesquels ? | texte | E P | non | Ex. Calendly, Doctolib, Planity |

## 7. Planning et envoi

| Clé | Libellé | Type | Formule | Oblig. | Aide |
|---|---|---|---|---|---|
| `indispos` | Vos indisponibilités dans les 3 semaines à venir | texte | E P | non | Pour caler la présentation de la première version |
| `commentaire` | Un dernier mot ? | texte_long | E P | non | |
| `rgpd` | J'ai lu la mention d'information ci-dessous | case | E P | oui | |

**Mention d'information RGPD** (sous la case) :
> Les informations et fichiers transmis sont utilisés par Kleak Agency uniquement pour concevoir et mettre en ligne votre site, puis en assurer la maintenance si vous l'avez souscrite. Ils sont conservés pendant la durée de notre collaboration puis 3 ans, et ne sont jamais revendus. Vous pouvez y accéder, les rectifier ou demander leur suppression en écrivant à contact@kleakagency.fr.

**Écran de fin** :
> **Merci, c'est reçu.** Nous revenons vers vous sous 48 heures ouvrées. Votre première version arrive [7 / 10] jours ouvrés après réception de l'ensemble de vos contenus.
> Il vous manque des contenus ? Vous pouvez revenir sur ce lien pour les ajouter.

---

## Ce que j'en fais à la réception (production)

- `mots`, `luminosite`, `ambiance`, `polices`, `palette` deviennent la direction artistique proposée à Edgar **avant** construction.
- `sites_aimes` et `a_eviter` sont relus en premier : ils tranchent les hésitations.
- `validateur` est rappelé dans chaque envoi de maquette.
- Un contenu obligatoire coché « plus tard » bloque le démarrage du délai : relance automatique du client à J+2 et J+5.
