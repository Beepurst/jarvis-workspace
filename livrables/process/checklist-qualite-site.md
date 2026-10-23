# Checklist qualité avant livraison d'un site

> À passer sur chaque site client avant de le montrer, quel que soit l'outil (Webflow ou Framer).
> Née de l'audit du site de démo Atelier Hauteville (`livrables/demos/atelier-hauteville/2026-10-15-audit-v1.md`).
> Règle de base : **un site n'est jamais "fini" parce qu'il a été construit sans erreur.** Il est fini quand on l'a vu, dans un vrai navigateur, à trois largeurs d'écran.

---

## 0. Avant de construire (depuis le 21/10)

- [ ] Planche de direction validée par le client (couleurs, polices, photos, textes)
- [ ] **Maquette HTML de la page entière** au style maison (`style-maison.md`), une section de référence par partie du site, relue en bureau et en mobile puis **validée par Edgar** avant toute construction Framer
- [ ] Le prompt de construction demande de **reproduire** la maquette, pas de concevoir
- [ ] Contrôle « niveau Framer » (`style-maison.md`, section 8) passé sur les captures avant de montrer le site
- [ ] **Un projet Framer par client**, jamais un site client dans un projet partagé : le transfert porte sur le projet entier (test Garnier, 22/10)

## 10. Livraison et transfert (testé le 22/10 sur Garnier)

- [ ] Titre du site, favicon (180 px) et image de partage au nom du client
- [ ] Composants, styles et fichiers de code non utilisés supprimés
- [ ] Pages mentions légales et confidentialité reliées au pied de page et au formulaire, avec les informations fournies par le client
- [ ] Données structurées `LocalBusiness` (ou le type du métier) posées sur la page, sans note d'avis auto-déclarée
- [ ] Formulaire envoyé vers l'email du client, **envoi test reçu** (vérifier aussi les spams)
- [ ] Transfert : menu Framer, **File** puis **Transfer Project**, email du client, **« rester éditeur » coché**. Le client confirme d'un clic. Procédure complète dans `livrables/clients/test-garnier-plomberie/suivi-test.md`
- [ ] Kit de demande d'avis remis (messages adaptés, PDF des 4 cartes QR, PNG), QR scanné avec un vrai téléphone : `livrables/process/demande-avis/README.md`
- [ ] Avant un transfert avec plan payant : prévenir le client que le plan passe à sa charge (à vérifier au premier cas réel)

## 1. Contrôle visuel (non négociable)

- [ ] Capture de la page entière à 1440 px, 820 px et 375 px, dans un navigateur réel, sur le site **publié**
- [ ] Vérification en navigation privée ou sur un autre ordinateur : c'est là qu'on voit les polices non chargées
- [ ] Aucun défilement horizontal, à aucune largeur
- [ ] Toutes les animations se terminent : aucun élément bloqué à moitié transparent

## 2. Identité

- [ ] Polices **réellement chargées** (Google Fonts ou fichiers importés), pas seulement déclarées dans les styles
- [ ] Couleurs et polices posées en variables, aucune valeur en dur
- [ ] Favicon et image de partage (Open Graph, 1200 x 630) aux couleurs du client
- [ ] Pas de badge de l'outil (plan payant activé)

## 3. Images

- [ ] **Chaque image vérifiée une par une contre sa légende et le métier du client.** Aucune image de stock hors sujet
- [ ] Cohérence entre les images (lumière, tons, style)
- [ ] Image d'accroche en chargement immédiat (`eager`), toutes les autres en différé (`lazy`)
- [ ] Images compressées, en WebP ou AVIF, avec versions responsive. Accroche sous 250 Ko
- [ ] Texte alternatif descriptif sur chaque image

## 4. Mobile (pensé pour le pouce)

- [ ] Page d'accueil raisonnable : viser moins de 8 écrans de téléphone. Carrousels ou extraits plutôt que des grilles empilées
- [ ] Bouton d'action toujours accessible (barre fixe en bas : appeler et prendre rendez-vous, selon le métier)
- [ ] Zones de clic d'au moins 44 px (boutons, champs, liens du menu, burger)
- [ ] Texte courant à 16 px minimum, champs de formulaire à 16 px minimum (sinon iOS zoome à la saisie)
- [ ] Menu : un vrai bouton, une icône qui devient une croix à l'ouverture, fermeture au clic sur un lien
- [ ] Le badge de l'outil ou une bannière ne recouvre aucun bouton

## 5. Formulaires

- [ ] Aucun texte de l'outil laissé par défaut ("Example Text", "Thank you!", "Oops!", "Please wait...")
- [ ] Bon type de champ : `tel`, `email`, listes déroulantes pour les choix fermés
- [ ] Le minimum de champs obligatoires (nom, téléphone ou email, message)
- [ ] Mention RGPD sous le formulaire, avec lien vers la politique de confidentialité
- [ ] **Envoi test réel**, et réception vérifiée sur la boîte du client
- [ ] Protection anti-spam active

## 6. SEO local

- [ ] Title et meta description uniques, avec la ville
- [ ] Un seul H1, hiérarchie H2 et H3 propre
- [ ] `lang="fr"`
- [ ] Données structurées `LocalBusiness` (nom, adresse, téléphone, horaires, zone d'intervention)
- [ ] Balisage `header`, `nav`, `main`, `footer`
- [ ] Carte Google Maps réelle ou rien, jamais un emplacement vide
- [ ] Sitemap généré, domaine branché, redirection www et https

## 7. Légal

- [ ] Mentions légales, politique de confidentialité, CGV si vente : de vraies pages, pas des liens `#`
- [ ] Bandeau cookies si des traceurs sont posés (analytics, pixels)

## 8. Autonomie du client

- [ ] Contenus récurrents (réalisations, actualités, équipe) dans le **CMS**, pas posés à la main
- [ ] Test : le client change un texte, une photo et ajoute un élément au CMS, seul, en moins de 5 minutes

## 9. Performance

- [ ] Rien n'est masqué tant que les animations n'ont pas démarré, surtout pas l'accroche
- [ ] Contrôle PageSpeed Insights sur mobile, viser plus de 80
- [ ] Contrôle fait sur le domaine final, pas sur un sous-domaine de test (`.framer.app` est bloqué à l'indexation, le SEO y plafonne à 69)
- [ ] Si l'API PageSpeed est à court de quota : Lighthouse en local, 3 passages mobile et bureau. Sur `.framer.app`, mesurer aussi en bloquant `app.framerstatic.com` (barre d'édition, 4 Mo) pour approcher le score du domaine final (Garnier, 22/10 : mobile 63-83 avec la barre, 70-83 sans)
- [ ] Contraste des petits textes gris vérifié par Lighthouse : rien sous 4,5:1 (gris à 0,55 ou moins sur blanc : refusé)

> **La performance est un argument de vente de l'agence.** Elle passe avant les grosses animations. Chaque site est mesuré (Lighthouse ou PageSpeed, mobile et bureau, 3 passages) avant d'être présenté, et chaque livraison s'accompagne de la liste des réglages à faire à la main dans Framer (voir plus bas).

### Ce qu'on a appris en mesurant (V2 Atelier Hauteville, 18/10)

- Le site lui-même pèse environ 1,4 Mo. Sur l'adresse de test `.framer.app`, Framer ajoute sa **barre d'édition** (environ 4 Mo de scripts depuis `framer.com/edit` et `app.framerstatic.com`). Selon l'aide Framer, elle n'est montrée qu'aux collaborateurs sur un domaine personnalisé. Une mesure faite en la bloquant ne change presque rien au score (75 à 77).
- Sur mobile, le score est plafonné par le socle de Framer (React et le moteur d'animation, environ 2 s d'attente sur 4G lente) et par le fait que **toutes les images de la page partent au chargement**, même hors écran.
- Les effets de titre mot par mot et les fondus d'apparition coûtent du temps de blocage : 200 à 360 ms avec, 0 à 40 ms sans.

### Règles de construction

- [ ] Effets de texte mot par mot : **interdits**
- [ ] Fondus d'apparition : seulement sur 3 ou 4 éléments forts par page (dévoilement de photo), jamais sur des listes, des chiffres ou des cartes
- [ ] Parallaxe : jamais sur l'image d'accroche ; 3 éléments maximum par page
- [ ] Bandeaux défilants et survols : autorisés (légers)
- [ ] Nombre total d'images limité : viser 10 à 12 par page, car Framer les charge toutes dès l'ouverture
- [ ] Sur mobile, l'élément le plus grand du premier écran doit apparaître vite : photo d'accroche légère (moins de 80 Ko), ou titre en texte si la photo est plus bas

### Réglages à faire à la main dans Framer (à lister au client ou à faire avant livraison)

- [ ] Langue du site en français (réglages du site, localisation) : `lang="fr"`
- [ ] Plan payant et domaine personnalisé branché : retire le badge « Made in Framer », lève le blocage d'indexation (SEO de 69 à 100)
- [ ] Indexation par les moteurs autorisée dans les réglages SEO du site
- Barre d'édition (bouton « Edit ») : rien à faire. Selon l'aide Framer, sur un domaine personnalisé elle n'apparaît qu'aux propriétaires et collaborateurs ; sur l'adresse de test `.framer.app`, elle s'affiche pour tout le monde. Toujours mesurer sur le domaine final
- [ ] Favicon et image de partage
- [ ] Destination des formulaires (email du client, ou outil d'automatisation)
- [ ] Remesure finale sur le domaine définitif, 3 passages mobile et bureau

### Règles Framer, tirées du test Atelier Hauteville (18/10 : 33 sur mobile, 68 sur bureau)

- [ ] **Aucun effet d'apparition au-dessus de la ligne de flottaison** (photo, titre, sous-titre, boutons de l'accroche). Un effet qui part d'une opacité 0 cache le contenu jusqu'à l'exécution du JavaScript : premier affichage à 5,3 s et plus grand élément visible à 11 s sur mobile
- [ ] Effets d'apparition réservés aux sections plus bas, et avec parcimonie : chaque élément animé ajoute du JavaScript (blocage du fil principal à 1,2 s)
- [ ] Images importées à la bonne taille : 1920 px de large pour une photo pleine largeur, 1000 à 1200 px pour une carte ou une colonne. Jamais de source en 2400 px ou plus
- [ ] Portraits recadrés à la source si la zone d'affichage est plus large que haute
- [ ] **Une seule famille de titres, une seule graisse, sans italique** si possible. Chaque graisse ou italique est un fichier de police de plus (environ 100 Ko pour Cormorant)
- [ ] Pas d'effet WebGL (shader) ni de vidéo en fond sur un site vitrine sauf demande explicite
- [ ] Langue du site réglée sur le français dans les réglages Framer (`lang="fr"`)
- [ ] Repères `header`, `nav`, `main`, `footer` posés (balise HTML des cadres)
- [ ] Contraste des petits textes colorés vérifié : le laiton #B08D57 sur crème ne passe pas, utiliser une version plus foncée pour le texte
- [ ] Bouton de menu en balise `button` (un `aria-label` sur un simple `div` est refusé)
