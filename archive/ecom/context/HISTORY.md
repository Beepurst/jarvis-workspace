# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-09-15

### Premier produit post-reset lancé : tapis de léchage chien, fournisseur AliExpress sans engagement, marque "La Sente"

Suite directe du reset du 14 septembre. Chasse produit large (8 candidats), validation chiffrée de trois d'entre eux, sourcing, créas et choix de marque bouclés en une session-fleuve.

**Validation produit :** trois candidats passés en revue (`livrables/produits/2026-09-14-*.md`). Masque Halloween LED en GO conditionnel mais fenêtre de vente trop courte pour être prioritaire, SnackSpin en NO-GO net (marge 5,38€, très sous le seuil de 15€, et le format "pétales" s'est révélé déjà présent sur Amazon.fr contrairement à l'hypothèse initiale). **Le tapis de léchage chien en silicone est retenu**, GO à 3,7/5.

**Sourcing en deux temps, et une vraie leçon dedans.** Le sourcing initial (agent `sourceur-fournisseurs`) a buté sur les pages produit Alibaba (non chargeables) et a estimé un coût rendu de 9-11€ pour une version différenciée à MOQ 100-300. **Edgar a ensuite retrouvé lui-même la fiche AliExpress exacte** : 2,20€/pièce en lot de 2, livraison gratuite, 5-9 jours (stock probablement déjà intra-UE), 10 000+ ventes et 1100 avis à 4,5/5, MOQ 1. Un vrai gain par rapport aux hypothèses, avec un vrai risque révélé par les avis : **54 mentions sur 1100 signalent des ventouses peu efficaces**, exactement le point que le sourcing voulait vérifier sur échantillon. **Edgar a choisi de tester en dropshipping réel, sans commander d'échantillon au préalable** : le risque qualité reste donc non vérifié avant les premiers envois clients, décision assumée.

**Un fournisseur Alibaba moins cher trouvé en cours de route (Xiamen Hands Chain Silicone, 1,16€/pièce) a été écarté pour la phase de test**, son MOQ de 200 pièces (232€ engagés) revenant à du stock, exactement ce que le reset du 14 septembre visait à éviter. Gardé en réserve pour une phase de scale une fois la demande prouvée.

**Prix de lancement : 24,90€**, marge brute recalculée à 15,64€ avec le coût réel du fournisseur (bien meilleur que les hypothèses initiales), douane forfaitaire de 3€ à confirmer au paiement.

**Créas produites** : 5 packshots détourés (un par couleur) et 4 visuels d'ambiance générés via Nano Banana à partir de la vraie photo produit en référence (méthode détourage pour la fidélité, génération uniquement pour le contexte/l'ambiance). Couleur gris retenue comme hero. Prompts et angles vidéo dans `livrables/creas/2026-09-14-prompts-tapis-lechage-chien.md`.

**Marque : "La Sente".** Recherche menée par l'agent `architecte-marque` sous le nom provisoire "La Flânerie" (`livrables/boutique/2026-09-14-marque-la-flanerie.md`), écarté après vérification par Edgar (nom déjà pris). Deuxième candidat, "La Doucerie", écarté aussi après vérification : une société française réelle porte ce nom exact depuis 2020. **"La Sente" retenu**, aucun conflit trouvé en recherche web (le seul homonyme est un salon de beauté japonais sans rapport). Nom volontairement atmosphérique, sans référence explicite au chien, pour ne pas devoir tout renommer si un futur produit animalerie suit celui-ci. Edgar a confirmé vouloir rester sur cette logique de nom large plutôt qu'un nom explicitement canin.

**Rappel posé par l'agent, et il reste valable :** Edgar a déjà changé de marque deux fois sans avoir vendu une seule pièce (La Brumerie, La Beauterie). Le brief de marque recommande de ne pas dépasser un wordmark simple avant la première centaine de ventes.

**En cours à la fin de la session :** mise à jour des mentions légales pour le nouveau nom et la nouvelle activité (agent `juriste-conformite`), rédaction de la fiche produit Shopify (agent `copywriter-fiches`). Reste à la charge d'Edgar : renommer la boutique Shopify existante, réserver `lasente.fr`, vérifier les identifiants sociaux et l'INPI avant tout investissement d'identité visuelle.

---

## 2026-09-14

### Reset complet : abandon du modèle Aubervilliers, retour au dropshipping classique, une seule boutique

**Décision d'Edgar :** trop de problématiques rencontrées avec les fournisseurs physiques d'Aubervilliers. Le modèle d'achat en gros et de stock détenu (pivot du 22 août) est abandonné. Retour au **dropshipping classique**, fournisseur type Alibaba. **Toute la recherche produit repart de zéro.**

**Contradiction relevée par Claude avant d'exécuter :** le retour au dropshipping Chine rend TikTok Shop impraticable comme canal de vente, exactement pour la raison qui avait motivé le pivot du 22 août (délai de remise transporteur sous 2-3 jours incompatible avec un envoi Chine de 2 à 4 semaines). Trois questions de cadrage posées avant de toucher aux fichiers.

**Réponses d'Edgar, qui fixent le nouveau cadre :**
1. **Canal principal : Shopify + Ads.** TikTok Shop abandonné comme place de marché. TikTok organique redevient un pur moteur de découverte qui renvoie vers Shopify.
2. **Tout remettre à plat**, y compris la niche : les brumes textiles (La Brumerie) et les appareils de coiffure (La Beauterie) ne sont pas conservés comme niches de travail.
3. **Une seule boutique.** Fin de la parallélisation à deux boutiques adoptée le 27 août : en dropshipping il n'y a plus de MOQ à financer par boutique, donc plus besoin de répartir le budget en deux paris.

**Ce que le reset remet en jeu, et qu'il faut anticiper dès la prochaine chasse produit :**
- Le mur arithmétique du prix de détail français (archive du 13-14 août) redevient le facteur de blocage principal
- Le droit de douane forfaitaire de 3 € par article redevient applicable
- Le risque de trésorerie s'inverse à nouveau : le danger redevient le succès (cash à avancer sur un pic de commandes), pas le stock mort
- Le critère "MOQ nul" redevient un vrai filtre de sélection

**Ce qui est archivé, pas supprimé :** La Brumerie (5 références de brumes textiles, boutique Shopify `labrumerie.fr` ouverte, pages légales publiées, fiches produit rédigées le 28 août, fournisseur Aubervilliers à 2,50 € l'unité, chemin critique jamais résolu sur le poids et l'ADR) et la boutique 2 coiffure (marque proposée non arrêtée "La Beauterie", fournisseur NEXOMI, lisseur + boucleur + tondeuse à poils de nez comme produit d'ajout). Rien n'avait été commandé sur aucune des deux, CA resté à 0 € sur toute la période du 22 août au 14 septembre. Détail conservé dans `livrables/` et dans l'archive de `CONTEXT.md`.

**Fichiers mis à jour :** `CLAUDE.md` (section "Who I Am") et `context/CONTEXT.md` (réécriture large : modèle, stratégie d'acquisition, critères de sélection produit revenus à la grille du 14 août, contraintes financières, statut des chantiers remis à zéro, deux boutiques archivées en une section dédiée). Les mécanismes fiscaux et sociaux (URSSAF, franchise de TVA, autoliquidation publicité) restent valables et ont été conservés tels quels, ils ne dépendent pas du mode de sourcing.

**Point d'honnêteté posé :** le reset raccourcit le délai réel avant l'objectif de mi-novembre 2026 (produit rentable + machine à contenu qui tourne). Il reste environ 62 jours et toute la chaîne repart de zéro.

**Prochain chantier :** relancer la recherche de niche et de produit en dropshipping classique, avec la règle de sourcing inversée (plancher français d'abord via `leDénicheur.fr`, fournisseur ensuite via Alibaba), en s'appuyant sur les agents `analyste-niche` et `chasseur-produits`.

---

## 2026-08-27

### Seconde boutique lancée en parallèle : appareils de coiffure, fournisseur NEXOMI, budget porté à 600 €

**Décision d'Edgar :** une seconde boutique est lancée en parallèle de La Brumerie, en test, sur les appareils de coiffure pour femmes. Elle a son propre fournisseur, son propre budget et sa propre marque, encore à nommer. **Le budget total passe de 200 € à 600 €, soit 300 € par boutique**, ce qui rend deux paris produit finançables là où un seul l'était.

**Le fournisseur est le premier du projet à avoir un catalogue en ligne.** NEXOMI, 43 rue de la Haie Coq à Aubervilliers, plateforme B2B avec compte déjà ouvert au nom de Forqan, références, EAN et fiches techniques. Cinq catégories au catalogue, dont quatre hors beauté, ce qui en fait une source à reconsulter pour toute future chasse produit.

**Minimum de commande à 100 €, libre sur tout le catalogue, et c'est structurant.** Là où les 150 € du grossiste physique imposaient d'engager la moitié du budget sur une référence choisie à l'aveugle, un panier libre permet un test en deux temps : commande de test sur plusieurs références, puis réassort de 180 € sur celle qui perce. Le réassort étant à Aubervilliers, la rupture coûte une heure de trajet et non trois semaines.

**Quatre prix relevés, deux références retenues.** Brosse soufflante TX-8947 à 7,20 €, boucleur TX-39065 à 5,00 €, brosse chauffante TX-39700 à 8,40 €, lisseur YOUGOU YG-08783 à 8,50 €, tous en HT retenu par prudence. Edgar retient **le lisseur et le boucleur**, et écarte la brosse soufflante qui était pourtant la meilleure marge des quatre à 14,36 €.

**Marges, avec la règle du 27 août appliquée :** lisseur 7,58 €, boucleur 7,86 €, **duo dans un seul colis 13,17 €**. Le duo est le format qui tient, exactement comme sur La Brumerie, le port mutualisé valant 2 € de marge.

**Correction faite en séance, et elle change les chiffres.** Les premières marges annoncées sur ces produits étaient surestimées de 1,20 à 1,30 € : la commission TikTok et l'URSSAF avaient été calculées hors port, alors que le livrable de la veille établit qu'elles frappent le total encaissé, port compris. La règle est désormais consignée dans les unit economics du CONTEXT.

**Le point qui a failli coûter la première boutique : ne pas créer un second Seller Center TikTok Shop.** Edgar s'apprêtait à en ouvrir un. Une pièce d'identité déjà utilisée pour vérifier une boutique ne peut pas être réutilisée, et les sources évoquant 5 boutiques par licence visent des sociétés américaines avec EIN, pas une micro-entreprise rattachée à une personne physique. **Le risque n'est pas le refus du second compte, c'est la suspension du premier**, déjà approuvé et destiné à porter du stock payé. Alternative retenue, sans risque ni coût : un seul Seller Center, plusieurs comptes TikTok liés en comptes marketing qui publient vers le même catalogue. Les deux boutiques Shopify restent totalement séparées.

**Réserve posée et non levée : le plancher français du lisseur.** leDénicheur donne un mini lisseur à **6,98 €** rendu en France, soit moins que le prix d'achat TTC du YG-08783. Le mur arithmétique du 14 août est donc intact sur cette référence. Il ne pèse pas sur TikTok Shop où l'acheteur découvre au lieu de comparer, il pèse sur toute recherche par référence ou sur Google.

**Deux autres réserves, propres à l'électrique.** La conformité (déclaration UE, importateur UE sur l'emballage, identifiant ADEME au titre de la REP DEEE), que NEXOMI déclare complète et dont les fichiers restent à récupérer. Et le SAV : un appareil chauffant tombe en panne, la garantie légale de 2 ans est à la charge du vendeur, et le risque de brûlure fait de ce dossier le seul du projet dont un défaut produit peut coûter plus cher que le stock.

**Ce que le budget ne résout pas, dit et acté :** 600 € financent deux stocks mais ne doublent pas le temps de production de contenu. Deux univers de marque à animer à deux personnes reste la seule contrainte de cette décision qu'aucune trésorerie ne lève.

**Point de contexte réglé en séance :** le code APE du SIRET de Forqan, listé comme ouvert et bloquant depuis le 14 août, est identifié dans le livrable légal du 25 août (70.22Z, activité libérale non réglementée), et le changement d'activité vers l'achat-revente est déclaré au guichet unique INPI, en attente de bascule INSEE. Ce n'est plus une décision en suspens mais un délai administratif.

**Prochain chantier, inchangé sur La Brumerie et ajouté sur la boutique 2 :** peser un flacon et lever l'ADR côté brumes, récupérer les documents de conformité et vérifier le HT ou TTC côté NEXOMI, et nommer la seconde boutique.

---

### Stratégie de prix et d'offre de La Brumerie : la grille du 22 août est caduque

Session consacrée aux prix et à la structure d'offre, avant toute écriture de fiche produit. Livrable : `livrables/pilotage/2026-08-27-strategie-prix-et-offre-la-brumerie.md`.

**Le point de départ, et il n'était pas prévu : la grille héritée du 22 août ne tient pas.** Le trio à 24,90 € avait été calculé sur un flacon de 250 ml et 4,50 € de port. Le produit réel est un flacon de verre de 500 ml qui pèse près d'un kilo emballé, expédié à 7,99 €. À 4,50 € d'achat, ce trio rendait 3,26 € de marge sur TikTok Shop et **moins 3,02 € port offert**. Le prix d'achat réel à 2,50 € le remonte à 9,26 €, mais la grille reste sous-calibrée.

**Grille arrêtée : 14,90 € l'unité, 26,90 € le duo, 41,90 € le trio livraison offerte**, port facturé à part sur les deux premiers. Marges TikTok Shop à 9 % : **7,23 €, 13,53 €, 16,34 €**. Sur Shopify : 8,54 €, 15,90 €, 19,23 €. Le prix est borné par le marché : le 500 ml se vend 12,90 € à 14,90 € chez les revendeurs français, ce qui fixe le plafond à l'unité.

**Trois mécanismes découverts dans les calculs, tous absents des documents antérieurs.**

1. **Le port est un escalier, pas une pente.** Mondial Relay : 5,99 € jusqu'à 1 kg, 7,99 € jusqu'à 3 kg, **15,99 € au-delà**. Le troisième flacon ne coûte rien en port, mais le colis trio est estimé entre 2,55 et 3,05 kg, donc **de part et d'autre d'une marche à 8 €**. Le duo est le seul format dont le port ne dépend pas de la pesée, et c'est la raison principale pour laquelle il devient l'unité de vente par défaut, contre la recommandation du 22 août qui plaçait le trio.
2. **L'URSSAF frappe le port refacturé.** Le CA déclaré en micro-entreprise est le total encaissé, frais de port compris. Facturer 7,99 € de port n'en laisse que 6,28 € sur TikTok et 6,88 € sur Shopify. **Correction apportée au plan Shopify du 25 août**, qui affirmait que facturer le port y était strictement plus favorable : l'arbitrage port facturé ou intégré est en réalité neutre en marge et ne se tranche que sur la conversion.
3. **Le franco de port est à 41,90 €, pas à 39 €.** Offrir le port coûte 6,28 € de marge quand le passage du duo au trio n'en rapporte que 6,73. Le point d'équilibre exact est 38,33 €, et l'intuition non chiffrée du 25 août, « autour de 39 € », tombait pile sur le point mort du dispositif. Un franco à 38,90 € fait travailler la logistique pour 45 centimes.

**Structure d'offre arrêtée :** trois fiches, une par format, les parfums en variantes, et **le trio en assortiment fixe** et non au choix, sinon c'est 35 combinaisons ingérables en variantes et une erreur de préparation garantie. Décision opérationnelle qui va avec : **toutes les vidéos TikTok taguent la fiche duo**, sans dévier avant 30 ventes dessus, pour concentrer les avis au lieu de les éparpiller.

**Upsell et cross-sell tranchés :** le seul levier retenu est le palier de quantité affiché dans le sélecteur de variantes, sur la fiche et jamais après le panier. Écartés et chiffrés : upsell post-achat (crée une seconde expédition), cross-sell d'accessoire (tout ce qui s'ajoute pèse, et le seul cross-sell à port marginal nul est un autre flacon), application de bundle payante, paiement en plusieurs fois, remise de bienvenue.

**Le régime de TVA tranché en recommandation.** À prix affiché identique, le régime réel coûte 2,78 € par commande duo. La valeur ajoutée est trop élevée pour que la TVA déductible compense la TVA collectée : 0,42 € récupérés sur un achat à 2,50 € contre 2,24 € collectés sur une vente à 13,45 €. **La franchise en base est nettement supérieure jusqu'à 85 000 € de CA**, soit environ 205 commandes par mois.

**Le chiffre le plus dur de la session, et il inverse une bonne nouvelle.** Le prix d'achat à 2,50 € fait que 150 € achètent **60 flacons** au lieu de 33. Mais expédier ces 60 flacons en duos demande **267 € de port et d'emballage avancés**, remboursés 31 jours après livraison par TikTok. Avec 50 € de réserve, le plafond est de **cinq colis**, contre les 11 annoncés le 22 août sur un port supposé à 4,50 €. **Le prix d'achat bas a doublé le stock sans toucher à la capacité de l'expédier.** Recommandation : négocier un premier lot à 100 € plutôt que 150 €, en repli sur l'ouverture immédiate de Shopify, qui verse en 3 jours contre 31.

**Point mort recalculé.** Frais de structure de 2,20 €/mois pendant trois mois puis 44,20 €/mois, hors abonnement Google AI dont le montant n'a jamais été communiqué. Quatre commandes par mois couvrent la structure. **Le premier palier utile est 15 commandes dans le mois**, celui où la boutique paie son propre réassort. L'objectif de 10 000 € demande 756 commandes par mois, soit 25 colis par jour à deux et à la main, contre 33 dans le calcul du 22 août.

**Chemin critique redéfini : ce n'est plus le SIRET, ce sont deux mesures physiques.** Peser un flacon plein et emballé, et lire l'étiquette pour l'ADR. Mondial Relay refuse les classes ADR 1 à 9 et cite explicitement les parfums comme liquides inflammables de classe 3 ; La Poste interdit les parfums en colis postal. Si les brumes sont alcoolisées, le point relais est fermé et la grille entière est à refaire, la bascule vers Colissimo coûtant 2,50 € par commande duo et 8,70 € sur le trio. **La visite à Aubervilliers du 26 août a rapporté le prix mais aucune de ces deux réponses.**

**Consigne posée pour la suite :** aucune fiche produit ne s'écrit avant la pesée et la levée de l'ADR. Un prix inscrit dans une fiche se change mal une fois les vidéos publiées et les avis accumulés.

---

## 2026-08-23 au 2026-08-26

### La boutique prend forme : marque, TikTok Shop approuvé, Shopify ouvert, premier prix fournisseur

Séquence de quatre jours non tracée au fil de l'eau, reconstituée le 27 août à partir des livrables produits.

**Le produit et la marque sont arrêtés.** Le projet vend des **désodorisants textiles parfumés en flacon pulvérisateur de verre d'environ 500 ml**, cinq références : White Dream, Jasmin Fleur d'oranger, Baby Love, Ameerat, Khamra. Statut de **revendeur et non de fabricant**, les flacons gardent la marque de leur fabricant. La boutique s'appelle **La Brumerie** : un lieu et non une maison de parfum, ce qui correspond exactement au statut et laisse les marques des flacons exister sans conflit. `labrumerie.fr` et `labrumerie.com` étaient libres au 22 août. Livrable : `livrables/boutique/2026-08-22-nom-et-positionnement-boutique.md`.

**La leçon de la recherche de nom :** dans cette niche, tous les beaux mots arabes sont déjà des noms de fragrances, donc un nom de boutique pris dans ce registre entre toujours en collision avec le produit de quelqu'un. Il fallait se placer un cran au-dessus.

**Le compte vendeur TikTok Shop est approuvé.** Analyse complète des sept missions de configuration, des frais, de la politique d'expédition et du cycle de versement dans `livrables/boutique/2026-08-22-tiktok-shop-configuration-compte-approuve.md`. Trois découvertes qui ont changé le plan : la **commission est de 9 %** et non de 5 à 8 %, les sources françaises secondaires décrivant la grille d'avant le 08/01/2026 ; le délai de livraison imposé est de **4 jours ouvrés depuis la commande** et non 15 jours, ce qui change le choix du transporteur ; et le versement est à **31 jours après livraison** en palier introductif, ce qui fait de la réserve de port le vrai plafond du premier mois. Recommandation posée et tenue : ne pas publier de produit fantôme pour décrocher la fenêtre d'incitation de 14 jours, dont la valeur réaliste est de 20 à 60 € contre 150 € de stock mort en cas de mauvais pari.

**La boutique Shopify est ouverte, le domaine réservé, les pages légales publiées.** Plan de préconfiguration en 60 étapes dans `livrables/boutique/2026-08-25-preconfiguration-shopify-la-brumerie.md` : forfait Basic en mensuel avec l'offre à 1 €, l'annuel étant éliminé net à 324 € payés d'avance ; thème Dawn ; **aucune collecte de TVA**, avec le piège de l'option « Exonération pour les micro-entreprises » qui n'est pas la franchise en base française et ferait collecter 20 % ; points de retrait natifs en France sans application ni compte transporteur préalable.

**Le paquet légal complet est rédigé et publié**, dans `livrables/boutique/2026-08-25-pages-legales-la-brumerie.md`. Il a mis au jour un point resté ouvert depuis le 14 août : **le SIRET de Forqan porte l'APE 70.22Z, conseil pour les affaires**, donc une activité libérale et non commerciale. L'activité de la boutique est donc **mixte**, et les deux chiffres d'affaires partagent le même compteur de 85 000 € de franchise de TVA. Le changement d'activité a été déclaré au guichet unique INPI et **attend la bascule INSEE**.

**Les visuels produit.** Abonnement Google AI payé le 25 août pour un mois, ce qui lève le plafond de trois images par produit jusqu'au 25 septembre. Méthode arrêtée **par fonction et non par plateforme** : trois visuels de fiche dont le packshot par détourage et non par génération, trois visuels de contenu, et les visuels de gamme produits une seule fois pour toute la marque. Prompts pour les cinq références dans `livrables/creas/2026-08-26-prompts-gamme-complete.md`, montage de la bannière dans `livrables/creas/2026-08-26-montage-image-de-gamme.md`. **Zéro visuel diffusable à ce jour.**

**La montée à Aubervilliers a eu lieu le 26 août, et elle a rapporté le premier prix fournisseur ferme du projet : 2,50 € l'unité.** C'est la résolution d'un point aveugle vieux de sept passes de recherche, où aucun prix d'achat n'avait jamais pu être vérifié. Rien n'a été commandé. La fiche de relevé préparée pour la visite, `livrables/fournisseurs/2026-08-26-questions-grossiste-brumes.md`, comportait 22 lignes dont trois éliminatoires et une décisive sur l'ADR : **le poids du flacon et le classement ADR ne sont pas revenus de cette visite**, et ce sont eux qui bloquent la suite.

---

## 2026-08-22

### Pivot du modèle : fin du dropshipping, achat en gros à Aubervilliers, TikTok Shop en canal principal

**Décision d'Edgar, prise et assumée :** le dropshipping classique est abandonné. Le projet achète désormais en gros chez des grossistes d'Aubervilliers, avec un minimum de commande d'environ 150 € par fournisseur, stocke, et expédie les colis à la main depuis Cergy. TikTok Shop devient le canal de vente principal, complété par des campagnes Google, Meta et TikTok Ads.

Edgar s'appuie sur des personnes de son entourage qui font tourner ce modèle. La réserve posée par Claude n'a pas porté sur le modèle mais sur son arithmétique, détaillée plus bas.

**Ce que le pivot débloque, et pourquoi il tient mieux que les six passes précédentes.**

Le lien entre ses deux moitiés n'avait pas été nommé par Edgar mais il est structurant : **TikTok Shop exclut le dropshipping depuis la Chine.** La politique d'expédition impose une remise au transporteur sous 2 à 3 jours ouvrés et une livraison sous 15 jours ; un envoi en 3 à 4 semaines fait chuter le score vendeur puis suspendre le compte. Le stock local n'est donc pas une contrainte subie, c'est la condition d'accès au canal visé.

Trois effets secondaires favorables :
- Le droit de douane forfaitaire de 3 € par article, entré en vigueur au 01/07/2026, ne s'applique plus : la marchandise est dédouanée par le grossiste
- Le mur arithmétique perd de sa force. Le plancher de prix français tenu par les vendeurs marketplace chinois d'Amazon.fr tuait une boutique alimentée par Google ; il pèse beaucoup moins sur un achat d'impulsion en flux vidéo, où l'acheteur découvre au lieu de comparer
- Le statut passe d'importateur à distributeur au sens GPSR, ce qui allège réellement la conformité produit, **à la stricte condition d'obtenir du grossiste une facture avec TVA et SIRET**

**Le chiffre qui a changé le plan : le port.**

En dropshipping le port était inclus dans le prix AliExpress. Il est désormais payé de la poche : environ 4 € pour un colis de moins de 500 g en point relais, environ 6 € à 1 kg, plus l'emballage. **Ce poste mange plus que les 3 € de droit de douane économisés.**

Conséquence chiffrée sur le scénario hérité (vente 18 €, achat 5 € TTC, commission TikTok 9 %, URSSAF 12,415 %) : la marge tombe à **4,65 €**, soit **moins que les 7,25 € du scénario dropshipping Chine le plus dégradé**. Il faudrait un coût d'achat sous 2,40 € TTC pour simplement égaler l'ancien modèle, et 72 colis par jour pour atteindre l'objectif de profit, ce que deux personnes ne peuvent pas emballer à la main.

**Arbitrage qui en découle, et qui est la vraie décision de la session : le prix de vente cible remonte de 15-20 € vers 22-30 €.** La grille basse avait été adoptée le 14 août pour survivre à la comparaison de prix sur Amazon.fr, comparaison que TikTok Shop n'impose plus. À 25 €, la marge passe à 10,15 €, le ROAS break-even à 2,46, et l'objectif redescend à environ 985 ventes par mois. 25 € reste dans la tranche 10 à 30 € qui pèse 44,8 % du chiffre d'affaires de TikTok Shop France.

**Le risque numéro un s'inverse.** Avant le pivot, le danger était le succès : fournisseur payé avant l'encaissement, 800 à 1 200 € de cash indisponible sur une vidéo qui perce. Après le pivot, le danger est l'échec : 150 € de stock mort, soit toute la capacité du projet. Un troisième risque apparaît, propre à la marketplace : un compte TikTok Shop suspendu emporte le stock déjà payé, ce qui fait de la boutique Shopify une assurance et non plus un confort.

**Grille de sélection produit réécrite, de cinq à six critères.** Le critère "aucun MOQ" est mort par construction et le critère "entrepôt UE" est sans objet. Les nouveaux : disponible chez un grossiste qui facture, coût d'achat TTC compatible avec le prix visé, **léger et compact** (le poids devient un critère à part entière, 2 € de marge séparent un colis de 500 g d'un colis de 1 kg), effet visuel en 3 secondes sans parole, rotation compatible avec la trésorerie, pas de contrainte réglementaire lourde.

**Le chemin critique devient administratif.** TikTok Shop exige une raison sociale conforme à l'INSEE et, selon les sources secondaires, un SIRET actif depuis au moins 30 jours dans la bonne activité. Le changement d'activité vers l'achat-revente, identifié dès le 14 août, n'est toujours pas fait. Tant qu'il ne l'est pas, la boutique ne peut pas ouvrir et tout le reste attend.

**Créé dans la session :** l'agent `specialiste-tiktok-shop`, référent unique de la plateforme comme canal de vente : ouverture et KYC du compte vendeur, frais et marge nette après commission, catalogue, politique d'expédition et score vendeur, programme d'affiliation créateurs, LIVE shopping, Shop Ads, versements et trésorerie. Sa frontière avec `planificateur-tiktok` : le compte publie, la boutique vend.

**Réserve posée par Claude sur le paid, et non tranchée.** 140 € engageables répartis sur Google, Meta et TikTok Ads ne font pas trois canaux, ils font trois tests ratés. La recommandation est de les séquencer après validation organique, un canal à la fois. Le stock absorbant désormais l'essentiel de la trésorerie, la question se reposera de toute façon au moment de l'arbitrage.

**Chiffre non tranché, bloquant pour tout calcul de marge :** le taux de commission de TikTok Shop. Les sources françaises se contredisent entre 9 % standard avec 4 % les 60 premiers jours, et 5 % puis 8 % pour les micro-entrepreneurs. Quatre points d'écart valent 0,72 € sur une vente à 18 €. À trancher sur le Seller Center officiel.

**Prochain chantier :** changement d'activité au SIRET, plateforme de facturation électronique avant le 1er septembre, montée à Aubervilliers pour relever des prix d'achat réels et repérer les grossistes qui facturent, puis chasse produit sur la nouvelle grille.

---

## 2026-08-14

### Le mur arithmétique nommé, le POD écarté, la grille de prix révisée

**Point de départ.** Une sixième passe de recherche produit lancée à la demande d'Edgar sur les objets anti-stress destinés aux femmes actives, en dropshipping classique, avec la règle de sourcing inversée. Réserve posée d'avance et assumée : la niche était déclarée abandonnée la veille.

**Résultat de la chasse : 22 produits examinés, 2 survivants, aucun vérifié.** Carillon harmonique type Koshi (41 à 47 € chez trois marchands) et cadre de sable mouvant grand format (plancher à 20,79 € sur Rakuten, plus un risque jouet 2009/48/CE réel). Aucune marge annonçable, aucun prix fournisseur relevé. Livrable : `livrables/produits/2026-08-14-chasse-stress-femmes-objets.md`.

**La trouvaille de la session n'est pas un produit, c'est un mécanisme.** 14 des 22 candidats sont morts sur la même contradiction interne, ni sur la demande ni sur la tendance : le critère "aucun MOQ" impose un article de catalogue, donc générique, donc arbitrable sur Amazon.fr entre 15 et 25 € dès lors qu'il coûte 8 € rendu. Le projet ne cherchait pas mal, il cherchait un objet qui ne peut pas exister.

**Éliminations notables :** trousse anti-anxiété (seule tendance fraîche sur la cible, mais contenu déjà refusé et nom constituant un claim de santé mentale), tingsha à 7 € chez un spécialiste français, organisateur de charge mentale à 12 € chez Ferflex. Correction d'un dossier antérieur au passage : le steel tongue drum, candidat n°2 du 14 août, est à partir de 35 € chez Nature & Découvertes, plafond plus bas que ce que son dossier indiquait.

**Décision 1 : l'impression à la demande est écartée.** Elle avait été retenue plus tôt dans la journée comme sortie du mur arithmétique : la valeur ne vient plus de la matière mais d'un design possédé, ce qui la rend inarbitrable sur Amazon, supprime le mur de trésorerie et exploite la production de créas par IA de Forqan. Edgar l'écarte au motif qu'elle échange un risque de sourcing contre un risque créatif et fait du design le produit lui-même. **Retour confirmé au dropshipping classique d'objets physiques.**

**Décision 2 : le paramètre levé est le prix de vente, pas le coût d'achat.** Le prix cible passe de 35 à 45 € vers **22 à 28 €**, le plafond d'achat restant à 8 €. Logique retenue : à 40 € face à un équivalent Amazon à 20 €, le rapport est de 2 et rien ne se vend. À 25 € face à 18 €, le rapport est de 1,4, territoire normal d'un ecommerce de marque. Le projet cesse de combattre le prix de marché français et se place dedans.

Deux règles ajustées en conséquence, sinon elles se contredisaient :
- Critère de sélection n°5 : marge brute minimale de **25 € ramenée à 12 €**
- Règle de sourcing inversée : filtre Amazon.fr abaissé de **20 € à 15 €**

**Décision 3 : régime micro-entreprise**, achat-revente de marchandises, sur le SIRET existant de Forqan.

**Ce que ça coûte, chiffré.** Une première estimation donnait 13,22 € de marge disponible sur une vente à 25 €. Le cadrage fiscal rendu en fin de session l'a corrigée à la baisse : **≈ 10,20 €**, après coût produit 8 €, droit de douane forfaitaire 3 €, frais Shopify Payments 0,63 € et prélèvement URSSAF 3,10 €. ROAS break-even **2,45**, CPA maximum absolu 10,20 € soit **8,50 € de dépense publicitaire réelle** une fois la TVA non récupérable retirée.

Trois conséquences actées :
- **Le payant est arithmétiquement inaccessible à la découverte produit.** Un CPA sous 8,50 € en acquisition froide sur un produit à 25 € n'est pas un objectif réaliste. La cartouche de 140 € ne peut servir qu'à amplifier un angle déjà validé.
- **TikTok organique cesse d'être prioritaire pour devenir obligatoire.** Le compte n'est toujours pas créé.
- **L'objectif de 10 000 € demande environ 980 ventes par mois**, soit 33 par jour. Le cap n'est pas mort, il est nettement plus loin qu'estimé.

### Cadrage fiscal micro-entreprise : quatre trouvailles qui changent le plan

Livrable sourcé, chaque chiffre daté : `livrables/boutique/2026-08-14-cadrage-fiscal-micro-entreprise.md`.

1. **La franchise douanière des 150 € est supprimée depuis le 1er juillet 2026**, remplacée par un **droit forfaitaire de 3 € par article** jusqu'en juillet 2028, avec une redevance européenne de gestion annoncée au 1er novembre 2026. Sur un coût rendu de 8 €, c'est **+37,5 %**. Le sourcing depuis la Chine s'est structurellement dégradé six semaines avant ce cadrage, et personne dans le projet ne le savait. Un fournisseur à entrepôt UE cesse d'être un confort de délai pour devenir un avantage de 3 € par vente. Source : communiqué economie.gouv.fr du 30/06/2026 et Commission européenne.
2. **L'abattement forfaitaire de 71 % ment sur la rentabilité réelle.** Le fisc impose 29 % du CA quelle que soit la marge effective, aucune charge n'étant déductible. Tant que la marge réelle dépasse 29 % du CA c'est indolore, mais dès que la publicité entre dans le calcul elle passe dessous et l'impôt porte sur un bénéfice largement fictif. C'est le piège le plus dangereux du régime pour ce modèle.
3. **140 € de budget publicitaire coûtent 168 €** et n'achètent que 116,67 € de publicité réelle. Meta Ireland et TikTok Technology Limited relèvent de l'autoliquidation, 20 % à verser au Trésor sans droit à déduction. La règle de coupe à 100 € doit se lire en trésorerie et non en budget média.
4. **ACRE : ne rien budgéter.** Taux tombé à 25 % au 01/07/2026, non automatique depuis le 01/01/2026, et surtout un changement d'activité sur un SIRET existant n'est pas une création, donc n'ouvre aucun droit.

**Deux angles morts sérieux, remontés dans les points à clarifier.** Si le SIRET de Forqan porte déjà une prestation de services, l'activité devient mixte et les deux CA partagent le même compteur de 85 000 € de franchise de TVA. Et le montage "un SIRET, deux personnes qui se partagent le revenu" n'a aucune existence juridique : il se requalifie en travail dissimulé (art. L8224-1, 3 ans et 45 000 €) ou en société créée de fait, à arbitrer avec un expert-comptable avant tout partage.

**Confirmations utiles :** le seuil de franchise de TVA reste à 85 000 € / 93 500 €, la réforme des 25 000 € ayant été définitivement abrogée par la loi n° 2025-1044 du 3 novembre 2025. Plafond micro-fiscal porté à 203 100 € pour 2026-2028. Changement d'activité gratuit au guichet unique INPI, à déclarer dans le mois.

**Échéance courte relevée :** l'obligation de **réception** des factures électroniques s'applique au **1er septembre 2026** à tous les assujettis, franchisés en base inclus. Dix-huit jours au moment du cadrage. Une plateforme agréée est nécessaire.

**Le point aveugle nommé.** Six passes de recherche, zéro prix fournisseur vérifié. AliExpress et tous les comparateurs (idealo, ledenicheur, touslesprix, LionsHome, Fnac) renvoient un 403 à l'accès automatisé. Le critère prioritaire du projet n'a jamais été testé sur un seul candidat. Tant que ce blocage tient, toute recherche produit s'arrête à mi-chemin.

**Lancé en fin de session :** un cadrage fiscal et social sourcé (`livrables/boutique/`), destiné à remplacer les hypothèses de taux par des chiffres officiels datés, et à traiter le point de la redistribution entre deux associés de fait sur une structure mono-titulaire.

### Septième chasse : 0 candidat, mais le mécanisme enfin nommé

Chasse large sans niche imposée, pilotée par le seul filtre prix, avec la grille 22-28 €. Livrable : `livrables/produits/2026-08-14-chasse-large-filtre-prix.md`.

**Résultat : 0 candidat sur 20 familles.** Le taux de survie passe de 9 % (2/22) à 0 %.

**Erreur d'analyse identifiée et corrigée.** Le seuil du filtre Amazon avait été abaissé de 20 € à 15 € pour préserver un écart commercial après la baisse du prix de vente. C'était traiter le filtre comme un curseur à régler alors qu'il teste une existence : baisser son prix ne fait pas disparaître l'objet moins cher. Deux paramètres avaient été bougés en sens contraire, en assouplissant la contrainte qui ne tuait pas et en durcissant celle qui tue. Le réglage n'était de toute façon pas le levier, le plancher mesuré étant sous 15 € dans 13 cas sur 13.

**Le mécanisme, formulé correctement pour la première fois.** Le plancher de prix français n'est pas tenu par Amazon Retail mais par des **vendeurs marketplace chinois installés en direct sur Amazon.fr** (Hixingo, Pratvider, YKKJ, PETSOLA), qui sont exactement les fournisseurs potentiels du projet. La boutique ne les concurrence pas, elle leur revend leur propre produit plus cher qu'eux. Les critères "achat sous 8 €" et "aucun MOQ" enferment par construction dans le catalogue générique, seule zone où ce plancher existe. **Il manque un critère à la grille : la non-généricité.** Le diagnostic a convergé trois fois vers ce point dans la journée, par trois chemins indépendants.

**Le déblocage technique de la journée : `leDénicheur.fr`.** Il répond aux requêtes automatisées et agrège Amazon.fr et sa marketplace, ManoMano, Cdiscount, Rakuten et Darty, trié par prix croissant. Format `https://ledenicheur.fr/s/mots-cles-avec-tirets/`. Le test du plancher français passe de plusieurs heures bloquées à vingt secondes par produit. C'était le point aveugle du projet depuis six chasses. Piège relevé : une requête sans résultat renvoie une 404, jamais une page vide.

**Décision : le prix de vente descend à 15-20 €**, quatrième sortie proposée, choisie contre la recommandation de relever le plafond d'achat.

Ce qui la soutient : le panier médian de TikTok Shop France est de 21-22 € et la tranche 10-30 € pèse 44,8 % du chiffre d'affaires (analyse Effinity sur 50,5 M€ de ventes), l'achat devient impulsif ce qui sert le canal organique, et **4 des 13 familles mesurées repassent le filtre** avec cette grille alors qu'aucune ne passait à 22-28 €.

Ce qu'elle coûte : la marge tombe entre 7,25 € et 10,25 € selon l'origine du fournisseur, le payant est définitivement hors jeu, et elle contourne le mécanisme par le volume au lieu de le résoudre.

**Conséquence non négociable :** le fournisseur à entrepôt UE passe de "si possible" à condition de viabilité. Le droit forfaitaire de 3 € par article représente 60 % de surcoût sur un produit acheté 5 €, et pèse 400 ventes mensuelles d'écart sur l'objectif.

**Critères ajustés en conséquence :** marge brute minimale ramenée de 12 € à **8 €**, filtre du plancher français fixé à **12 €**, critère 4 requalifié en condition.

**Incohérences corrigées dans `CONTEXT.md` :** le décompte des dossiers refusés (3 et 4 selon les sections, désormais 7 passes et 3 dossiers de validation), et la ligne du Hub qui prévoyait d'intégrer un coût d'impression à la demande.

### Huitième chasse : la grille 15-20 € ne débloque rien, mais un premier candidat sort

Livrable : `livrables/produits/2026-08-14-chasse-grille-15-20-euros.md`. Taux de survie **2 sur 22**, exactement celui de la première chasse, après le 0 sur 20 de la septième.

**Réponse à la question posée : non, la grille 15-20 € ne débloque pas la recherche.** La raison est arithmétique. Abaisser le filtre du plancher de 15 € à 12 € assouplit une contrainte, mais durcir le plafond d'achat de 8 € à 7,25 € en UE ou 4,25 € en Chine en durcit une autre plus violemment. **Les deux filtres sont corrélés négativement :** les objets dont le plancher français dépasse 12 € sont précisément ceux qui ont de la matière, donc qui coûtent plus de 5 € rendus. Baisser le prix de vente ne peut pas résoudre le mécanisme, seulement le déplacer.

**Deux corrections méthodologiques, l'une coûteuse.**

1. **`leDénicheur.fr` ne trie pas ses résultats par prix croissant.** La septième chasse avait lu le haut de page et publié des planchers surestimés de 4 à 6 €. Trois des quatre familles annoncées comme "repassant le filtre" étaient en réalité mortes : tapis de fouille 8,95 € et non 13,15 €, tente pour chat 10,68 € et non 13,99 €, kit vinyle 9,15 € et non 14,99 €. L'erreur a été transmise à Edgar avant correction. **Il faut balayer la liste entière.**
2. **AliExpress répond** via `https://www.aliexpress.com/w/wholesale-mots-cles.html`, avec le filtre `?shipFromCountry=ES` accepté, et coupe après 4 ou 5 requêtes. **Ce sont les premiers prix fournisseurs obtenus sur ce projet**, après sept chasses menées à l'aveugle sur le critère prioritaire.

**Hypothèse du brief contredite par la mesure.** L'entrepôt UE avait été posé comme condition de viabilité au motif qu'il économise 3 € de droit de douane. Sur le hamac pour chat, les offres expédiées d'Espagne démarrent à 17,05 € contre 9,49 € sans filtre, soit **7,56 € de surcoût pour économiser 3 €**. L'entrepôt UE se vérifie produit par produit, il ne se suppose pas. Le critère 4 a été requalifié en conséquence.

**Le premier candidat sérieux du projet : mangeoire à oiseaux à ventouse pour vitre.** Plancher français 20,99 €, prix d'achat relevé 1,76 €, marge estimée 11 € en UE et **8,25 € même en scénario Chine dégradé**. C'est le seul candidat en huit chasses à tenir la marge cible dans le pire scénario. Et surtout, **aucun vendeur marketplace chinois n'est indexé sur ce sous-format** : c'est exactement l'anomalie que les chasses précédentes cherchaient sans savoir la nommer. Faiblesses : la démonstration visuelle dépend d'un oiseau non contrôlé, et la saison n'ouvre que fin octobre (source LPO).

Second candidat remonté sans conviction : le lave-vitre magnétique, qui passe à 0,78 € près sur le plancher et à 0,00 € près sur la marge, sur un produit dont le pic dropshipping date de 2018-2020.

**Rien n'est validé.** Tout tient sur une vérification manuelle de dix minutes : relever sur Amazon.fr le prix le plus bas et le nom du vendeur sur la mangeoire à ventouse. Sous 12 € chez un vendeur de type Hixingo, le candidat est mort et l'anomalie n'était qu'un trou d'indexation.

**Prochain chantier :** cette vérification, puis ouvrir le compte TikTok, choisir une plateforme de facturation électronique avant le 1er septembre, et effectuer le changement d'activité au SIRET.

---

### Hub Ecom : reprise, adaptation et mise en ligne du cockpit interne

**Point de départ.** Copie désinstrumentée d'un outil qui tournait en production depuis juillet 2026 sur un autre projet, un SaaS B2B. Environ 60 % du code agnostique au business, 40 % écrits pour un modèle par abonnement.

**Arbitrages posés par Edgar :**
- Tout séparer de l'ancien projet : nouveau nom, nouveau dépôt, nouveau Supabase, nouveau Vercel
- Le dossier reste dans le workspace, en `livrables/hub/`, mais en dépôt git indépendant
- Périmètre du redesign limité à l'habillage, la structure des pages ne bouge pas
- Les commentaires de conception qui citent le projet d'origine sont conservés : ils expliquent le pourquoi du code et ne connectent rien

**Ce qui a été fait :**
- Socle en marche : Supabase dédié créé, 13 tables migrées, 4 variables du socle, serveur de développement fonctionnel
- Variables `ORBIKAL_META_*` renommées `HUB_META_*`, marque centralisée dans `src/lib/brand.ts`
- Système de tokens étendu (texte, typographie, espacements, rayons) et **544 valeurs en dur remplacées** dans les styles inline. Changer une couleur coûtait 82 éditions, il en coûte une
- **Suppression des pages du SaaS** : Clients, Support, Inscriptions, Annonces, plus leurs libs et leurs variables. Plus un seul appel vers l'ancien produit
- `agenda.ts` amputé de trois de ses cinq sources, de 374 à 255 lignes
- Dépôt `github.com/Beepurst/hub-ecom` créé, déployé sur https://hub-ecom-phi.vercel.app

**Trouvaille de conformité.** `dsa_beneficiary` et `dsa_payor`, les champs de transparence DSA que Meta publie dans sa bibliothèque publicitaire, étaient **écrits en dur au nom du projet d'origine** et l'export désinstrumenté les avait manqués. Toute campagne lancée depuis le Hub aurait déclaré un payeur faux. La valeur vient désormais de l'environnement (`HUB_DSA_ENTITY`) et bloque la création de campagne tant qu'elle est vide.

**Ce qui reste bloqué sur le projet.** Quatre prompts d'IA produisent encore de la copie pour un SaaS B2B. Ils attendent la niche et l'univers de marque.

**Réserve à connaître.** Toutes les vérifications ont porté sur des pages vides, aucune source n'étant branchée. Le verdict « aucun débordement de mise en page » ne couvre pas le contenu dense, qui est précisément ce que les correctifs CSS protègent.

**Prochain chantier sur le Hub :** la page Boutique branchée sur l'API Shopify Admin, qui remplace la page Revenus héritée de Stripe. Demande un dev store Shopify Partners. Elle porte le seul chiffre que le Hub devra calculer au lieu de le lire : la marge.

---

### Abandon de la niche anti-stress et adoption de la règle de sourcing inversée

**Décision : sortie de la catégorie anti-stress et relaxation.**

Trois dossiers consécutifs refusés, tous sur le même facteur, jamais sur le fournisseur : le prix de détail français.

1. **NeeDoh méduse Schylling**, NO-GO à 2,35/5. Trois éliminatoires : marque déposée de Schylling Inc., disponibilité Amazon et Smyths Toys, marge brute sous 15 €. Alerte réglementaire relevée au passage : jouet pour moins de 14 ans, donc directive 2009/48/CE, marquage CE, essais EN 71, plus GPSR depuis décembre 2024.
2. **Lampe chauffe-bougie**, tuée par Amazon.fr à 12,70 € contre 39,99 € visés.
3. **Squishy kawaii de bureau**, proposé par Edgar avec deux fiches Alibaba du fournisseur Yiwu Zihai à 0,81 € l'unité. Tué par un lot de 40 pièces à 15,99 € sur Amazon.fr, soit **0,40 € la pièce livrée au client, moins cher que le prix d'achat en gros départ Chine**. Le format coffret, seule porte de sortie envisagée, est déjà occupé à 21,59 € pour 44 pièces.

**Lecture retenue : le blocage est structurel, pas conjoncturel.** La catégorie est trop distribuée (Amazon, Temu, Shein, Action) et trop bon marché. Circana mesure un prix moyen d'environ 6 € sur les jeux sensoriels dans le retail jouet français, pour un marché total d'environ 400 k€ par mois. Aucun prix de vente à 35 ou 45 € n'y tient.

**Règle de sourcing inversée, adoptée.** Relever d'abord le prix de vente constaté chez trois marchands français et vérifier l'absence d'équivalent Amazon.fr sous 20 €. Aller chercher un fournisseur seulement ensuite. Chercher dans l'autre sens est du sourcing, pas du ecommerce.

**Point réglementaire consolidé :** la mention "14 ans et plus" affichée par un fournisseur ne suffit pas à sortir du périmètre de la directive 2009/48/CE, qui vise tout produit destiné, exclusivement ou non, au jeu des moins de 14 ans. Précédent ILNAS 2017 sur le fidget spinner.

**Créé dans la session :** l'agent `monteur-boutique-shopify`, qui rend un plan de montage écran par écran sans jamais toucher à la boutique lui-même.

**Prochain chantier :** choisir un nouvel axe de niche, hors anti-stress.

---

### Cadrage de l'équipe, du budget et de la stratégie d'acquisition

**Nouvelle donne :**
- **Forqan rejoint le projet.** Profil technique et IA. Répartition : Edgar sur le produit, le sourcing et les chiffres, Forqan sur la production de contenu par IA, le montage Shopify et le tracking.
- **Structure juridique débloquée.** SIRET existant au nom de Forqan, un changement d'activité vers l'achat-revente de marchandises suffit. Le mur juridique le plus coûteux est en grande partie franchi.
- **Budget cadré :** 200 € de budget publicitaire, plus 100 à 300 € de réinjection mensuelle possible à deux. Frais de structure de 60 à 130 € sur la période.

**Décision stratégique : bascule en organique d'abord.**

Le cadrage budgétaire a montré qu'un test Meta minimum viable coûte 100 à 200 € pour un seul signal, souvent négatif. Avec 200 €, le projet dispose d'une seule cartouche paid sur toute la période. La publicité payante ne peut donc pas financer la découverte produit.

Nouvel ordre des canaux : TikTok organique en canal principal, paid en amplification d'un angle déjà validé (Spark Ads en priorité), Google Ads reporté.

**Risque identifié et documenté : la trésorerie d'exécution.**

Le danger principal n'est pas l'échec mais le succès. Le fournisseur est payé avant l'encaissement, et un compte Shopify Payments neuf verse en 7 à 14 jours. Une vidéo qui perce et génère 100 commandes exigerait 800 à 1 200 € de cash indisponible. Parade : 60 € des 200 € sont réservés à la trésorerie et ne seront jamais dépensés en publicité, ce qui ramène le budget pub réellement engageable à 140 €.

**Cinq critères de sélection produit adoptés**, remplaçant les critères implicites du rapport du 13 août : coût d'achat sous 8 €, aucun MOQ, effet visuel démontrable en 3 secondes sans parole, fournisseur avec entrepôt UE si possible, marge brute de 25 € minimum. Le rapport de chasse produits du 13 août est à rejouer sur cette base.

**Règle de coupe fixée avant lancement :** sur le premier test payant, si à 100 € dépensés il n'y a pas au moins 2 ventes, on coupe.

**Révision de l'objectif.** L'objectif de 10 000 € de profit net mensuel à mi-novembre 2026 a été reconnu hors d'atteinte avec le capital disponible : il suppose environ 400 ventes par mois, soit 13 par jour en continu, ce qu'un capital de 300 à 700 € ne permet pas d'atteindre en 93 jours. Le cap de 10 000 € est conservé mais reporté à un horizon de 6 à 9 mois. L'objectif de mi-novembre devient : un produit rentable et une machine à contenu qui tourne.

**Décision d'exécution notable :** ouvrir le compte TikTok et publier avant que la boutique existe et avant que le produit soit arrêté, pour que le compte vieillisse et trouve son format pendant que le reste se construit.

**Prochain chantier :** rejouer la sélection produit avec les cinq critères, ouvrir le compte TikTok sous 72 heures, effectuer le changement d'activité au SIRET.

---

## 2026-08-13

### Pivot complet du workspace vers l'ecommerce

**Décision :** abandon total de l'activité Treenity Group et de l'automatisation marketing. Le workspace devient dédié à un projet unique, la création d'une boutique ecommerce en dropshipping.

**Nouveau cadre :**
- Modèle : dropshipping sur Shopify, boutique en propre
- Objectif : 10 000 € de profit net par mois d'ici mi-novembre 2026
- Acquisition : Google Ads, Meta Ads, TikTok organique
- Point de départ : zéro. Pas de boutique, pas de niche, pas de produit
- Rôle attendu de Claude : assistant personnel spécialisé ecommerce, de A à Z

**Refonte technique du workspace :**
- `CLAUDE.md` réécrit intégralement, avec une section de règles spécifiques ecommerce (raisonner en chiffres, profit et non CA, pas de données inventées, conformité UE, pas de claims non tenables)
- `CONTEXT.md` réécrit : profil entrepreneur ecommerce, tableau de statut des chantiers, points à clarifier
- Arborescence `livrables/` refondue autour de la chaîne ecommerce : `produits/`, `boutique/`, `creas/`, `campagnes/`, `pilotage/`, `fournisseurs/`
- Skill `cadrage-automatisation` supprimée (obsolète, ancrée n8n/Make/CRM Treenity)
- Trois nouvelles skills créées : `validation-produit`, `angles-creas`, `pilotage-chiffres`
- Skill `recherche-actualites` réorientée vers la veille ecommerce
- Commandes `/prime` et `/morning` adaptées au nouveau contexte
- Anciens livrables du site Prodvocation supprimés

**Réserve posée par Claude et assumée par Edgar :** 10 000 € de profit net mensuel en 3 mois, en dropshipping depuis zéro, se situe dans le très haut du panier de ce qui se fait. L'objectif est conservé tel quel et sera piloté avec des chiffres réels plutôt qu'avec de l'optimisme.

**Prochain chantier :** choix de la niche et recherche produit.

---

## Avant le pivot (archive)

> Contexte historique conservé pour mémoire. Plus actif depuis le 13 août 2026.

### 2026-06-17

**Création de la skill "cadrage-automatisation"** (depuis supprimée)
- Skill de cadrage d'automatisation produisant un cahier des charges (objectif, déclencheur, entrées, sorties, règles, cas limites, reco n8n vs Make)
- Validée sur 3 cas de test réels

**Installation initiale du Jarvis**
- Workspace créé pour Edgar, basé à Cergy
- Profil : Head of Automatisation Marketing chez Treenity Group, équipe marketing de 5 personnes
- Objectifs de l'époque : v1 d'une app de création de posts, automatisation du reporting marketing mensuel, gain de temps sur la production de contenu
- Vision : devenir la référence IA et automatisation du groupe Treenity
- Note technique : contenu du kit remonté du sous-dossier `jarvis-starter-kit/` vers la racine du workspace
