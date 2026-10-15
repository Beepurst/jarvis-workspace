# Plan de préconfiguration Shopify : La Brumerie

> Date : 2026-08-25 · Produit pilote : White Dream (désodorisant textiles) · Statut de départ : compte Shopify créé, admin vide, aucun produit
> Périmètre : tout ce qui se configure **sans produit**. La création des fiches produits est exclue.
> Prix et règles vérifiés en ligne le 25/08/2026, sources en fin de document.

---

## Ce que tu obtiens à la fin

Une boutique Shopify entièrement paramétrée, en français, en euros, **sans collecte de TVA**, avec ses pages, ses menus, ses paiements, sa grille de livraison en point relais et son suivi analytique, encore protégée par mot de passe. Il ne restera qu'à coller les fiches produits et à retirer le mot de passe.

---

## Avant de commencer

### Prérequis bloquants

| # | Prérequis | Pourquoi c'est bloquant | Statut |
|---|---|---|---|
| 1 | **Le compte Shopify doit appartenir à Forqan** | Shopify Payments vérifie le SIRET, la pièce d'identité et l'IBAN du **propriétaire du compte**. Le SIRET est celui de Forqan. Un compte au nom d'Edgar échoue au KYC ou se fait geler après les premières ventes | À trancher |
| 2 | **Le poids réel du flacon plein et emballé** | Toute la grille de port en dépend, et l'hypothèse à 4,00 € du CONTEXT est très probablement fausse pour White Dream (voir l'alerte ci-dessous) | **Manquant** |
| 3 | Nom exact de l'entité à l'INSEE (avis de situation SIRENE) | Il doit être recopié au caractère près dans les coordonnées de la boutique et dans Shopify Payments | À sortir |

### Alerte poids : lis ça avant de paramétrer quoi que ce soit sur la livraison

Le CONTEXT retient **4,00 € de port pour un colis de moins de 500 g**. White Dream est décrit dans les prompts créas comme un **flacon en verre d'environ 500 ml avec pulvérisateur à gâchette**.

Ordre de grandeur : 500 ml de liquide font 500 g, le verre d'un flacon de cette contenance pèse 250 à 350 g, le pulvérisateur 50 à 70 g. **Un seul flacon plein et emballé sort entre 850 g et 1 kg. Le trio sort entre 2,5 et 3 kg.**

Conséquence directe : la tranche tarifaire « jusqu'à 500 g » ne s'applique à rien de ce que tu vends. **Tu n'es pas sur le tarif que tu crois.** Ce n'est pas un détail de paramétrage, c'est 2 à 4 € de marge par colis sur une offre trio à 24,90 €.

**Ce que tu fais :** tu montes la boutique entière avec les blocs 1 à 5, tu paramètres la livraison en **provisoire** au bloc 6, et tu re-tarifes une fois le flacon pesé sur une balance de cuisine, emballage compris. Le bloc 6 est le seul dont les valeurs ne sont pas définitives, et c'est assumé.

### Décisions à prendre en amont (liste complète en fin de document)

Huit décisions, dont trois vraiment bloquantes : la propriété du compte, l'achat ou non du domaine, et l'adresse publiée en mentions légales.

### Temps total estimé

**5 h 30 à 7 h**, découpables en trois sessions. Aucun bloc ne dépasse 1 h 15.

---

## Ordre des blocs

| # | Bloc | Étapes | Temps | Dépend de | Statut |
|---|---|---|---|---|---|
| 1 | Socle : propriété, forfait, identité, domaine | 1 à 10 | 45 min | — | À faire |
| 2 | **TVA : franchise en base** | 11 à 18 | 30 min | 1 | À faire |
| 3 | Thème et habillage | 19 à 26 | 60 min | 1 | À faire |
| 4 | Arborescence : pages et menus | 27 à 36 | 50 min | 3 | À faire |
| 5 | Paiements | 37 à 45 | 45 min | 1, 2 | À faire |
| 6 | Livraison (provisoire tant que rien n'est pesé) | 46 à 55 | 60 min | 1 | À faire |
| 7 | Emails transactionnels et checkout | 56 à 62 | 40 min | 1, 4 | À faire |
| 8 | Applications et cookies | 63 à 68 | 30 min | 4 | À faire |
| 9 | Suivi et mesure | 69 à 74 | 40 min | 8 | À faire |
| 10 | Verrouillage et checklist | 75 à 80 | 25 min | tous | À faire |

---

# Bloc 1 : Le socle

**Temps estimé : 45 min**

## 1. Trancher qui possède le compte, avant tout le reste

Admin > **Paramètres > Utilisateurs**

- Si le compte a été créé avec l'email d'Edgar : clique sur le nom du propriétaire, puis **Transférer la propriété** vers l'adresse email de Forqan.
- Edgar reste dans la boutique en **membre du personnel** avec toutes les autorisations.

**Pourquoi.** Shopify Payments effectue une vérification KYC sur le propriétaire du compte : SIRET, pièce d'identité, justificatif de domicile, IBAN au nom de l'entreprise. Le SIRET est celui de Forqan, donc l'identité vérifiée doit être celle de Forqan. Un compte propriété d'Edgar avec un SIRET de Forqan est un dossier incohérent : soit il est refusé, soit il passe et les fonds sont gelés à la première vérification renforcée.

⚠️ **C'est le même piège que sur TikTok Shop, où il a déjà été signalé pour l'IBAN.** Il se rejoue à l'identique ici.

## 2. Renseigner les coordonnées de la boutique

Admin > **Paramètres > Général > Coordonnées de la boutique**

| Champ | Valeur |
|---|---|
| Nom de la boutique | `La Brumerie` |
| Email de la boutique | l'adresse de gestion (celle de Forqan pour l'instant) |
| Téléphone | numéro joignable, il sera visible des clients |
| Nom légal de l'entreprise | **le nom exact figurant sur l'avis de situation SIRENE de Forqan**, au caractère près |
| Adresse | adresse de l'entreprise |

⚠️ Le champ « nom légal » alimente les documents de facturation. Une micro-entreprise est une personne physique : l'entité s'appelle « PRÉNOM NOM », pas « La Brumerie ». **La Brumerie est un nom commercial, pas une raison sociale.** Ne saisis pas « La Brumerie » dans le champ légal.

⚠️ L'adresse saisie ici sera reprise dans les mentions légales et donc publique. Si c'est le domicile de Cergy, c'est une décision à prendre en conscience, pas par défaut. Voir la liste des décisions en fin de document.

## 3. Régler la devise, les unités et le fuseau

Admin > **Paramètres > Général**

- **Devise du magasin :** `EUR (€)`
- **Fuseau horaire :** `(GMT+01:00) Paris`
- **Système d'unités :** `Système métrique`
- **Unité de poids par défaut :** `kg`
- **Format d'adresse par défaut :** `France`

⚠️ **La devise ne se change plus librement après la première commande** : il faut passer par l'assistance. Vérifie avant de fermer l'écran.

## 4. Fixer la langue de la boutique

Admin > **Paramètres > Langues**

- Langue par défaut : **Français**. Aucune langue supplémentaire.

Ne publie pas d'anglais « au cas où ». Chaque langue publiée est un jeu de pages légales à traduire et à maintenir, et tu ne vends qu'en France.

## 5. Verrouiller le marché sur la France

Admin > **Paramètres > Marchés**

- Marché principal : **France**, actif.
- **Ne crée aucun autre marché.** Si un marché « International » ou « Reste du monde » existe par défaut, **désactive-le**.

**Pourquoi.** Un marché ouvert crée des zones d'expédition, des devises et surtout des obligations fiscales que tu ne peux pas tenir. Vendre 50 € en Belgique t'expose au régime des ventes à distance intracommunautaires, sujet que tu n'as ni le temps ni le budget d'instruire. France uniquement, c'est un choix, pas une limite subie.

## 6. Choisir le forfait : le calcul

Admin > **Paramètres > Forfait**

Grille vérifiée le 25/08/2026 sur [shopify.com/fr/pricing](https://www.shopify.com/fr/pricing) :

| Formule | Mensuel | Annuel | Commission Shopify Payments, cartes standard |
|---|---|---|---|
| Starter | 5 €/mois (source secondaire, non confirmé sur la page officielle) | — | Pas de vitrine complète |
| **Basic** | **36 €/mois** | 27 €/mois (engagement 12 mois) | **1,5 % + 0,25 €** |
| Grow | 105 €/mois | 79 €/mois | 1,3 % + 0,25 € |
| Advanced | 384 €/mois | 289 €/mois | 1,1 % + 0,25 € |

**Offre en cours, vérifiée le 25/08/2026 : 3 jours d'essai gratuit, puis 1 €/mois pendant 3 mois.**

**Ce que tu fais : tu prends Basic en facturation MENSUELLE, avec l'offre à 1 €/mois.**

Le raisonnement chiffré, avec 200 € de trésorerie totale :

| Option | Décaissement sur 3 mois | Décaissement sur 12 mois |
|---|---|---|
| **Basic mensuel avec l'offre à 1 €** | **3 €** | 3 € + 9 × 36 € = **327 €** |
| Basic annuel à 27 €/mois | **324 € d'un coup** | 324 € |
| Starter à 5 €/mois | 15 € | 60 €, mais pas de vraie boutique |

- **L'annuel est éliminé net.** 324 € payés d'avance, c'est 162 % de ta trésorerie totale et deux fois ton stock. Il est moins cher au mois, il est impossible à financer. Ne clique pas sur l'onglet « annuel », l'écart affiché est un piège de cadrage.
- **Starter est éliminé aussi**, et pour deux raisons. D'abord il coûte 5 € quand Basic en coûte 1 pendant 3 mois. Ensuite et surtout, la boutique Shopify existe dans ce projet comme **assurance contre une suspension du compte TikTok Shop**. Une assurance qui ne sait pas afficher un catalogue, des pages légales et un tunnel complet n'assure rien.
- **Grow et Advanced :** l'écart de commission ne se rentabilise jamais à ton volume. Passer de Basic à Grow économise 0,2 point de commission, soit **0,06 € sur une vente à 29,40 €**, pour 69 € d'abonnement en plus par mois. Il faudrait **1 150 ventes par mois** pour rentabiliser. Reste sur Basic, et n'y reviens pas avant plusieurs milliers d'euros de CA mensuel.

⚠️ **Note la date d'échéance de l'offre dans ton calendrier.** Au 4e mois, le prélèvement passe de 1 € à 36 €. C'est là que la boutique doit déjà avoir vendu, ou que la question de la fermer se pose honnêtement.

## 7. Renseigner les informations fiscales de facturation Shopify

Admin > **Paramètres > Facturation**

- Ajoute le moyen de paiement de l'abonnement.
- Dans la section informations fiscales : renseigne le **numéro de TVA intracommunautaire de Forqan dès qu'il est obtenu**.

**Pourquoi.** Shopify facture depuis l'Irlande. Sans numéro de TVA intracom, Shopify ajoute 20 % de TVA française à l'abonnement. Avec le numéro, la facture part en autoliquidation. **Dans les deux cas tu paies les 20 %** : en franchise en base tu ne récupères rien, et l'autoliquidation te fait verser la TVA au Trésor toi-même. La différence n'est pas financière, elle est juridique.

**Traduction en trésorerie : 36 €/mois d'abonnement coûtent 43,20 €.** Compte 43,20 €, pas 36 €.

### Délégué à un autre agent
- **`juriste-conformite`** : obtention du numéro de TVA intracommunautaire auprès du SIE, périodicité de la CA3 d'autoliquidation, et l'obligation de **réception de factures électroniques au 1er septembre 2026**, soit dans 7 jours. Shopify émet des factures électroniques irlandaises, ce point n'est pas théorique.

## 8. Le domaine : la recommandation chiffrée

Admin > **Paramètres > Domaines**

**Recommandation : achète `labrumerie.fr` maintenant, chez un registrar tiers, et pas `labrumerie.com`.**

Le calcul, avec ~50 € disponibles hors stock :

| Option | Coût an 1 | Ce que ça t'apporte | Ce que ça te coûte |
|---|---|---|---|
| Rester sur `xxx.myshopify.com` | 0 € | 0 € dépensé | Pas d'email `@labrumerie.fr`, donc pas d'authentification du domaine d'envoi, donc **des emails de confirmation de commande qui partent en spam**. Un lien myshopify en bio TikTok qui dit « boutique de test ». Et le nom, publiquement documenté depuis le 22/08, reste réservable par n'importe qui |
| **`labrumerie.fr` chez un registrar tiers** | **environ 10 à 15 € l'an 1, à vérifier au moment de l'achat** | Email pro, authentification d'envoi, crédibilité du lien, nom sécurisé, et le domaine te reste si tu quittes Shopify | ~12 €, soit **environ un quart de ta réserve hors stock** |
| `.fr` + `.com` + `brumerie.fr` en défensif | 30 à 45 € | Rien de plus tant que tu vends en France | 20 à 30 € de stock en moins. Non |
| Acheter le domaine **via Shopify** | environ 11 à 15 €/an selon l'extension, à vérifier à l'écran | Branchement automatique, zéro manipulation DNS | Le domaine est lié à ton compte Shopify. Si tu arrêtes Shopify, le transfert est une corvée |

**Pourquoi maintenant et pas à la première commande de stock.** Ce n'est pas une question d'image, c'est une question de délivrabilité. L'étape 57 de ce plan te fait authentifier le domaine d'envoi des emails Shopify. Sans domaine, tu ne peux pas, et tes confirmations de commande arrivent en indésirables. Un client qui ne reçoit pas sa confirmation écrit au SAV ou ouvre un litige. **12 € pour ne pas générer de litiges sur tes 30 premières commandes est le meilleur rapport de ce plan.**

**Pourquoi chez un registrar tiers et pas chez Shopify.** Le renouvellement à l'an 2 est généralement moins cher, et le domaine reste indépendant du compte Shopify. C'est cohérent avec le fait que la boutique Shopify est ici une assurance : une assurance ne doit pas détenir tes actifs.

⚠️ **Je n'ai pas de prix de registrar vérifié aujourd'hui.** Compare OVH, Gandi et Namecheap au moment de l'achat, et **regarde le prix de renouvellement, pas le prix d'appel de la première année.** Certains affichent 1 € la première année et 15 € ensuite.

## 9. Brancher le domaine

Admin > **Paramètres > Domaines > Connecter un domaine existant**

1. Saisis `labrumerie.fr`.
2. Shopify affiche deux enregistrements DNS à créer chez ton registrar : un **A** vers l'IP indiquée par Shopify, et un **CNAME** `www` vers `shops.myshopify.com`.
3. Crée-les dans la zone DNS du registrar, reviens sur Shopify, clique **Vérifier la connexion**.
4. Une fois connecté : **Définir comme domaine principal**, et coche **Rediriger tout le trafic vers ce domaine**.

**Délai :** la propagation DNS prend de 15 minutes à 48 h. Le certificat SSL est délivré automatiquement par Shopify ensuite, gratuitement. Ne panique pas si le cadenas met quelques heures à apparaître.

## 10. Créer l'adresse email de la marque

Chez ton registrar, active une **redirection email** de `contact@labrumerie.fr` vers ta boîte personnelle. C'est gratuit chez la plupart des registrars.

Si tu veux aussi **envoyer** depuis cette adresse : Zoho Mail propose une offre gratuite pour un domaine. Pas indispensable au lancement, la redirection suffit.

---

# Bloc 2 : La TVA en franchise en base

**Temps estimé : 30 min. C'est le bloc le plus important de ce plan.**

Shopify est livré configuré pour collecter la TVA. **Tu n'es pas assujetti.** Une boutique qui affiche ou facture de la TVA sans y être assujettie émet des factures irrégulières, et la TVA mentionnée à tort est due au Trésor par celui qui l'a facturée (art. 283-3 du CGI). Ce n'est pas un risque théorique, c'est mécanique.

## 11. Vérifier qu'aucune immatriculation TVA n'existe

Admin > **Paramètres > Taxes et frais de douane**

1. Regarde la section **Pays/régions**.
2. Si **France** ou **Union européenne** y figure avec une immatriculation ou un taux : clique dessus, puis **supprime l'immatriculation**.
3. L'état correct est : **aucun pays immatriculé**. La liste doit être vide, ou France doit y figurer sans numéro de TVA et sans taux actif.

**Pourquoi.** Sans immatriculation, Shopify ne calcule aucune taxe et n'affiche aucune ligne de TVA au checkout. C'est exactement le comportement voulu.

## 12. Ne PAS cliquer sur « Exonération pour les micro-entreprises »

⚠️ **C'est le piège numéro un de ce bloc, et il porte un nom qui ressemble exactement à ta situation.**

Dans **Paramètres > Taxes et frais de douane > Union européenne > Percevoir la TVA**, Shopify propose une option intitulée **« Exonération pour les micro-entreprises »**.

**Ce n'est pas la franchise en base française.** C'est le régime européen du seuil de 10 000 € de ventes à distance intracommunautaires : il fait appliquer **le taux du pays d'origine à toutes les commandes UE**. Traduction concrète : le choisir te ferait **collecter 20 % de TVA française sur chaque commande**. C'est précisément ce qu'on veut éviter.

**Ne sélectionne pas cette option. Ne renseigne aucun numéro de TVA dans cet écran.**

## 13. Désactiver l'inclusion des taxes dans les prix

Admin > **Paramètres > Taxes et frais de douane > Calculs de taxes**

- **Décoche** « Inclure les taxes dans les prix des produits ».
- **Décoche** « Facturer la taxe sur les frais d'expédition ».

**Pourquoi.** En franchise en base, ton prix n'est ni HT ni TTC : c'est **un prix net, sans TVA**. Laisser Shopify raisonner en « prix taxes incluses » l'amènerait à extraire une TVA fictive dès qu'une immatriculation apparaîtrait un jour par erreur.

## 14. Poser la règle produit à appliquer à chaque fiche future

Cette étape ne s'exécute pas maintenant (pas de produit), **mais elle se note dans ta procédure de création de fiche.**

Sur chaque produit : **Produits > [le produit] > section Tarification > décocher « Facturer des taxes sur ce produit »**.

C'est une double sécurité par rapport à l'étape 11. Si un jour la boutique bascule en TVA, cette case sera à recocher volontairement, produit par produit. C'est un garde-fou, pas une redondance inutile.

## 15. Placer la mention obligatoire : en pied de page de la boutique

Admin > **Boutique en ligne > Thèmes > Personnaliser > section Pied de page**

Ajoute un bloc de texte contenant exactement :

```
TVA non applicable, article 293 B du CGI.
```

## 16. Placer la mention obligatoire : sur les emails de confirmation

Admin > **Paramètres > Notifications > Notifications de commande > Confirmation de commande > Modifier le code**

En bas du modèle, ajoute la même ligne. Fais-le aussi sur **Facture de commande** et **Confirmation d'expédition**.

## 17. Placer la mention obligatoire : sur la facture jointe au colis

Admin > **Applications > Shopify Order Printer** (application gratuite éditée par Shopify)

1. Installe-la.
2. **Modèles > Modifier**, ajoute la ligne de mention dans le pied du modèle de facture.
3. C'est ce document que tu imprimes et glisses dans le colis.

**Pourquoi une facture papier.** Tu vends à des particuliers, la facture n'est pas systématiquement obligatoire en dessous d'un certain montant, mais elle est obligatoire dès que le client la demande, et elle est ton seul document de traçabilité côté sortie. Vu que la traçabilité amont (facture du grossiste avec TVA et SIRET) est déjà un point critique de ton dossier GPSR, autant que l'aval soit propre dès le premier colis.

## 18. Où la mention doit encore apparaître, et par qui

| Emplacement | Qui rédige |
|---|---|
| CGV, article prix | **`juriste-conformite`** |
| Mentions légales | **`juriste-conformite`** |
| Page produit, sous le prix : « Prix net. TVA non applicable, art. 293 B du CGI » | **`copywriter-fiches`**, mention imposée par ce plan |

⚠️ **N'écris jamais « TTC » nulle part sur la boutique.** « TTC » signifie « toutes taxes comprises », donc affirme qu'une taxe est comprise. En franchise, c'est faux, et c'est une mention trompeuse. Écris « prix net » ou rien.

### Ce que ce bloc ne tranche pas
Je ne me prononce pas sur le régime fiscal lui-même, ni sur les conséquences du code APE, ni sur l'articulation des seuils en activité mixte. **`juriste-conformite`** et un expert-comptable, c'est déjà cadré dans `2026-08-14-cadrage-fiscal-micro-entreprise.md`.

---

# Bloc 3 : Le thème

**Temps estimé : 60 min**

## 19. Installer Dawn

Admin > **Boutique en ligne > Thèmes > Bibliothèque de thèmes > Ajouter un thème > Explorer les thèmes gratuits > Dawn > Ajouter**

Puis **Publier**.

**Pourquoi Dawn et pas Horizon.**

Shopify pousse Horizon, son nouveau thème par défaut, plus riche en blocs. Les mesures publiques de 2026 donnent des scores PageSpeed mobile autour de **82 pour Dawn contre environ 52 pour Horizon**, pour des scores desktop équivalents (96-97). Sources secondaires, à re-mesurer toi-même après montage, mais l'écart est trop large pour être du bruit.

Ton trafic vient à 90 % de TikTok : mobile, froid, impatient, souvent en 4G. **Sur ce trafic, la vitesse n'est pas un critère de confort, c'est le premier filtre de conversion.** Un visiteur TikTok qui attend 4 secondes est reparti dans le flux.

Ce que Dawn te coûte : moins de blocs prêts à l'emploi, pas de bouton d'achat collant natif. Ce que ça change réellement au lancement : rien. Le bouton collant s'ajoute plus tard, quand `auditeur-conversion` aura mesuré qu'il manque.

Ce que Dawn te donne : **0 €**, mises à jour maintenues par Shopify, zéro dépendance à une application tierce pour fonctionner. Un thème payant à 300 $ ne t'achèterait rien que tu ne puisses obtenir autrement à ce stade, et 300 $, c'est deux commandes de stock.

## 20. Nettoyer le thème de démonstration

Admin > **Boutique en ligne > Thèmes > Personnaliser**

Sur la page d'accueil, supprime toutes les sections de démonstration : images d'exemple, textes en latin, collections fictives. **Tu repartiras d'une page vide au bloc 7 de ta vie de boutique, quand les produits existeront.**

Laisse en place uniquement : en-tête, un espace vide, pied de page.

## 21. Régler les couleurs

Admin > **Boutique en ligne > Thèmes > Personnaliser > Paramètres du thème (icône engrenage) > Couleurs**

Valeurs neutres conformes à la direction visuelle actée le 22/08 (fond neutre chaud, accent unique sombre, les couleurs viennent des produits) :

| Rôle | Valeur |
|---|---|
| Fond du schéma principal | `#FAF6F0` (crème) |
| Texte | `#2B2622` |
| Fond des boutons | `#2B2622` |
| Texte des boutons | `#FAF6F0` |
| Fond du schéma secondaire (sections alternées) | `#EFE7DC` (sable) |

⚠️ Valeurs de travail. **`architecte-marque`** doit livrer la palette définitive. Ne fais pas fabriquer de visuels sur ces codes tant qu'ils ne sont pas validés.

## 22. Régler les typographies

Admin > **Personnaliser > Paramètres du thème > Typographie**

- **Titres :** une police à empattements fine. Dans la bibliothèque Shopify : `Cardo`, `EB Garamond` ou `Playfair Display`.
- **Corps de texte :** une sans-serif neutre. `Assistant` ou `Inter`.
- **Deux polices maximum.** Chaque police supplémentaire est une requête réseau de plus sur mobile.

**Test à faire avant de valider :** écris « La Brumerie » dans le titre, réduis la fenêtre du navigateur à 120 px de large, et vérifie que le nom reste lisible. C'est le test posé le 22/08 pour la vignette TikTok.

## 23. Charger le favicon

Admin > **Personnaliser > Paramètres du thème > Favicon**

- Format : PNG carré 512 × 512 px, fond transparent.
- Contenu provisoire : les lettres `LB` sur fond crème.

⚠️ Le signe définitif (volute de vapeur, trait unique) vient de **`architecte-marque`**. Emplacement à remplacer.

## 24. Configurer l'en-tête

Admin > **Personnaliser > section En-tête**

| Réglage | Valeur |
|---|---|
| Disposition du logo | Gauche (meilleure lisibilité mobile que centré) |
| Largeur du logo sur mobile | 90 à 110 px |
| Type de menu | Menu déroulant |
| Icône panier | Visible |
| Barre de recherche | **Masquée au lancement.** Un catalogue de 1 à 3 références n'a rien à chercher, et le champ vide dégrade la page |
| En-tête collant | **Activé** |

## 25. Configurer le bandeau d'annonce

Admin > **Personnaliser > section Barre d'annonce**

Texte à saisir, **une fois le poids du flacon connu et la grille de port validée** :

```
Expédié de France sous 2 jours ouvrés · Livraison en point relais
```

⚠️ **N'écris aucune promesse de délai avant le bloc 6.** Et n'écris pas « Livraison offerte » tant que `pilotage-chiffres` n'a pas tranché le seuil de franco.

## 26. Configurer le pied de page

Admin > **Personnaliser > section Pied de page**

Trois colonnes :

| Colonne | Contenu |
|---|---|
| 1 | Bloc de texte : nom commercial, une phrase de positionnement, la mention `TVA non applicable, article 293 B du CGI` posée à l'étape 15 |
| 2 | Menu **Informations** (créé à l'étape 35) |
| 3 | Menu **Informations légales** (créé à l'étape 36) |

- Désactive le bloc d'inscription à la newsletter pour l'instant : sans outil d'emailing branché, tu collectes des adresses que tu ne peux pas exploiter et tu crées une obligation RGPD sans contrepartie. **`redacteur-flows-email`** le rallumera quand il y aura un flow derrière.
- Icônes de paiement : **Activées**. C'est de la réassurance gratuite.
- Icônes sociales : à remplir quand les comptes `@labrumerie` existent (**`planificateur-tiktok`**).

---

# Bloc 4 : L'arborescence

**Temps estimé : 50 min**

## 27. Créer les pages de vente

Admin > **Boutique en ligne > Pages > Ajouter une page**

Crée ces pages **vides**, avec exactement ces titres et ces URL :

| Titre | Handle (URL) | Qui remplit |
|---|---|---|
| À propos | `a-propos` | `copywriter-fiches` |
| Contact | `contact` | Gabarit `page.contact` (voir étape 28) |
| Questions fréquentes | `faq` | `copywriter-fiches` |
| Livraison et retours | `livraison-et-retours` | Ce plan (bloc 6) + `juriste-conformite` |
| Suivre ma commande | `suivi-de-commande` | Ce plan (étape 30) |
| Sécurité produit | `securite-produit` | Ce plan (étape 31) + `juriste-conformite` |

## 28. Basculer la page Contact sur le bon gabarit

Admin > **Boutique en ligne > Pages > Contact > champ Modèle de thème > sélectionner `page.contact`**

Ce gabarit injecte le formulaire de contact natif de Dawn. Les messages arrivent sur l'email de la boutique renseigné à l'étape 2.

**Pourquoi c'est obligatoire et pas cosmétique.** Le droit de la consommation impose un moyen de contact direct et effectif. Une page « Contact » sans formulaire ni email visible est un défaut de conformité, et c'est aussi le premier réflexe d'un acheteur inquiet : s'il ne trouve pas comment te joindre, il ouvre un litige au lieu d'écrire.

## 29. Créer les pages légales

Admin > **Paramètres > Politiques**

Shopify propose ici des **modèles générés automatiquement**. Tu peux les générer pour ne pas avoir de page vide, **mais tu ne les publies pas en l'état.**

| Politique | Statut au montage |
|---|---|
| Politique de remboursement | Générer le modèle, marquer « à réécrire » |
| Politique de confidentialité | Générer le modèle, marquer « à réécrire » |
| Conditions générales de vente | Générer le modèle, marquer « à réécrire » |
| Politique d'expédition | À écrire au bloc 6 |
| Informations de contact | Renseigner tout de suite |

⚠️ **Les modèles Shopify sont des textes anglo-saxons traduits automatiquement.** Ils ne traitent pas correctement le droit de rétractation de 14 jours (art. L221-18 du code de la consommation), ni la médiation de la consommation obligatoire, ni les mentions propres à la franchise en base. **Ne mets pas de trafic payant sur une boutique qui affiche ces modèles.**

### Délégué à un autre agent
- **`juriste-conformite`** : rédaction intégrale des CGV, mentions légales, politique de confidentialité, politique de cookies, politique de retour et rétractation. Phrase de déclenchement : *« Rédige les pages légales de La Brumerie : boutique Shopify, micro-entreprise en franchise en base, vente de désodorisants textiles en France, statut de distributeur au sens GPSR, expédition en point relais depuis Cergy. »*

## 30. Préparer la page de suivi de commande

Admin > **Boutique en ligne > Pages > Suivre ma commande**

Contenu minimal à saisir toi-même (ce n'est pas du texte marketing, c'est de l'information de service) :

- Le numéro de suivi est envoyé par email dès la remise au transporteur.
- Lien vers le suivi Mondial Relay.
- Délai avant de s'inquiéter : X jours ouvrés (à compléter au bloc 6).
- Lien vers la page Contact.

**Pourquoi cette page existe avant même la première vente.** Un client sans nouvelles à J+4 fait l'une de ces trois choses : il écrit, il ouvre un litige, ou il laisse un avis négatif. Une page de suivi visible dans le pied de page absorbe la majorité des « où est mon colis ». C'est du SAV évité, pas de la décoration.

## 31. Préparer la page Sécurité produit (GPSR)

Le règlement (UE) 2023/988 s'applique **depuis le 13 décembre 2024**. Son article 19 impose qu'une offre en ligne affiche l'identité du fabricant, celle de la personne responsable établie dans l'UE quand le fabricant est hors UE, l'identification du produit et les avertissements de sécurité, **dans la langue de l'acheteur**.

Tu es **distributeur**, pas fabricant. Ces informations sont sur l'étiquette du flacon. **Tu les recopies, tu ne les inventes pas.**

Structure de la page, à remplir une fois les flacons en main :

1. Nom et adresse du fabricant ou de l'importateur UE figurant sur l'étiquette
2. Numéro de lot
3. Mentions CLP si le produit est alcoolisé : pictogramme et mentions de danger, recopiées à l'identique
4. Précautions d'emploi
5. Contact pour signaler un problème de sécurité

⚠️ **N'installe pas d'application GPSR payante.** Le marché en propose plusieurs à 5-20 €/mois. Elles servent à gérer des catalogues de centaines de références multi-marketplaces. Avec 1 à 3 références, une page et un bloc de texte sur la fiche produit font le même travail pour 0 €.

⚠️ **Ce bloc doit aussi apparaître sur chaque fiche produit**, pas seulement sur cette page. Emplacement à réserver, contenu à recopier de l'étiquette.

## 32. Créer la collection principale

Admin > **Produits > Collections > Créer une collection**

- Titre : `Toutes les brumes`
- Type : **Automatique**, condition : `Le produit est en stock` (ou une condition sur un tag `brume`)
- Image : à ajouter plus tard

Une collection automatique se remplit toute seule quand tu ajoutes des produits. Tu n'auras rien à refaire.

## 33. Trancher : page d'accueil distincte ou non

**Décision : oui, tu gardes une page d'accueil distincte de la page produit.**

Le raisonnement dépend de la source de trafic, et la tienne est particulière :

- Sur une boutique mono-produit alimentée par de la publicité qui pointe directement sur la fiche, la page d'accueil ne sert quasiment à rien, et beaucoup la remplacent par la page produit.
- **Mais ta boutique Shopify n'est pas ton canal principal.** Elle est le second canal et l'assurance en cas de suspension TikTok Shop. Son trafic viendra d'un lien en bio, donc sur la **racine du domaine**, et d'un visiteur qui ne sait pas encore ce que tu vends.
- Et ton offre est un **trio**, avec plusieurs références au catalogue (Ameerat, Khamra, White Dream). Une page produit unique ne sait pas présenter une collection.

**Structure d'accueil à poser** (sections vides pour l'instant, ordre imposé, mobile d'abord) :

| # | Section | Rôle |
|---|---|---|
| 1 | Bannière image | Le geste de pulvérisation. Une phrase, un bouton. **Le bouton doit être visible sans faire défiler sur un écran de 390 px de large** |
| 2 | Bloc réassurance, 3 icônes | Expédié de France · Point relais · Paiement sécurisé |
| 3 | Collection en vedette | `Toutes les brumes` |
| 4 | Bloc « le trio » | L'offre par défaut, mise en avant |
| 5 | Texte + image | Ce qu'est La Brumerie, registre domestique |
| 6 | Avis clients | **Section vide, activée quand les avis existent.** Pas de faux avis |
| 7 | FAQ courte | 4 questions, dont livraison et délai |
| 8 | Pied de page | |

Le contenu de chaque section vient de **`copywriter-fiches`**. Toi tu poses l'ordre.

## 34. Construire le menu principal

Admin > **Boutique en ligne > Navigation > Menu principal**

| Libellé | Cible |
|---|---|
| Nos brumes | Collection `Toutes les brumes` |
| Le trio | Le produit trio (à créer plus tard) |
| À propos | Page `a-propos` |
| FAQ | Page `faq` |
| Contact | Page `contact` |

**Cinq entrées, aucun lien légal.** Un visiteur venu de TikTok a une attention de quelques secondes : chaque lien ajouté au menu principal dilue le seul clic qui compte.

## 35. Construire le menu « Informations » du pied de page

Admin > **Boutique en ligne > Navigation > Ajouter un menu**, nom `Informations`

| Libellé | Cible |
|---|---|
| Livraison et retours | `/pages/livraison-et-retours` |
| Suivre ma commande | `/pages/suivi-de-commande` |
| Sécurité produit | `/pages/securite-produit` |
| Nous contacter | `/pages/contact` |
| FAQ | `/pages/faq` |

## 36. Construire le menu « Informations légales » du pied de page

Admin > **Boutique en ligne > Navigation > Ajouter un menu**, nom `Informations legales`

| Libellé | Cible |
|---|---|
| Mentions légales | `/pages/mentions-legales` |
| Conditions générales de vente | `/policies/terms-of-service` |
| Politique de confidentialité | `/policies/privacy-policy` |
| Politique de cookies | `/pages/politique-de-cookies` |
| Droit de rétractation et remboursement | `/policies/refund-policy` |

⚠️ Les URL en `/policies/` sont générées automatiquement par Shopify dès que la politique correspondante contient du texte. Une politique vide donne un lien mort. **Vérifie chaque lien à l'étape 79.**

---

# Bloc 5 : Les paiements

**Temps estimé : 45 min**

## 37. Activer Shopify Payments

Admin > **Paramètres > Paiements > Shopify Payments > Terminer la configuration du compte**

Documents et informations à préparer avant de commencer, sinon tu abandonnes en cours de formulaire :

| Champ | Valeur |
|---|---|
| Type d'entreprise | **Entreprise individuelle** |
| Numéro d'identification | Le **SIRET** de Forqan |
| Nom légal | Le nom exact de l'avis de situation SIRENE |
| Représentant de l'entreprise | **Forqan**, avec sa pièce d'identité |
| Justificatif de domicile | Au nom de Forqan, récent |
| Compte bancaire | **IBAN français au nom de Forqan** |
| Description du produit | `Désodorisants textiles parfumés, revente` |
| Nom sur le relevé bancaire du client | `LA BRUMERIE` |

⚠️ **Les quatre pièges de la vérification, dans l'ordre de fréquence :**

1. **Nom du titulaire du compte bancaire différent du nom légal.** Une micro-entreprise est une personne physique : l'INSEE écrit souvent « NOM Prénom » quand la banque écrit « M. Prénom Nom ». Sors l'avis SIRENE et compare avant de saisir.
2. **IBAN d'Edgar.** Rejet certain. L'entité vérifiée est Forqan.
3. **Compte Shopify au nom d'Edgar.** Voir l'étape 1. Si tu n'as pas fait le transfert de propriété, arrête-toi et fais-le maintenant.
4. **Description d'activité vague ou fausse.** Écris ce que tu vends réellement. Une description qui ne correspond pas aux produits déclenche une vérification renforcée aux premières ventes, et un gel des fonds pendant l'instruction.

**Commission Basic vérifiée le 25/08/2026 : 1,5 % + 0,25 € sur les cartes européennes standard, 2,7 % + 0,25 € sur les cartes internationales et American Express.**

Sur une commande de 29,40 € (trio + port) : **0,69 € de frais.**

## 38. Régler le calendrier de versement

Admin > **Paramètres > Paiements > Shopify Payments > Gérer > Versements**

- Fréquence : **Quotidienne**.

**Délai constaté en France : environ 3 jours ouvrés** entre le paiement du client et le crédit sur le compte bancaire, week-ends et jours fériés bancaires exclus. Un paiement du vendredi arrive généralement le mardi ou le mercredi.

⚠️ **Compare avec TikTok Shop : 31 jours après livraison en palier introductif.** La boutique Shopify encaisse **environ dix fois plus vite** que ton canal principal. Ce n'est pas un détail de confort : avec 50 € de réserve hors stock et 4,50 € de port avancé par colis, c'est le facteur qui décide combien de colis tu peux expédier avant d'être à sec. **C'est un argument sérieux pour ne pas traiter Shopify comme un canal secondaire décoratif.**

## 39. Activer les paiements express

Admin > **Paramètres > Paiements > Portefeuilles**

Active : **Shop Pay**, **Apple Pay**, **Google Pay**.

Coût : aucun frais supplémentaire, ils passent par Shopify Payments au même taux.

**Pourquoi c'est le meilleur réglage gratuit du plan.** Sur mobile, ces boutons suppriment la saisie d'adresse et de carte, qui est l'endroit exact où un visiteur TikTok abandonne. Ils apparaissent en haut de la page produit et court-circuitent le panier.

## 40. Activer PayPal

Admin > **Paramètres > Paiements > Modes de paiement supplémentaires > PayPal > Activer**

Puis connecte le compte PayPal Business **de Forqan** (même logique de cohérence d'identité).

**Tarif vérifié le 25/08/2026 sur paypal.com/fr : 2,90 % + 0,35 € pour une transaction commerciale domestique.**

Le calcul honnête sur une commande de 29,40 € :

| Moyen | Frais | Écart |
|---|---|---|
| Shopify Payments | 0,69 € | — |
| PayPal | 1,20 € | **+0,51 €** |

**Verdict : active-le quand même.** 0,51 € par commande, c'est 5 % de ta marge nette, et c'est le prix d'entrée pour convertir les acheteurs qui refusent de taper un numéro de carte sur une marque inconnue de deux semaines. Sur une boutique sans historique, sans avis et sans notoriété, la protection acheteur PayPal fait partie de la réassurance.

À réévaluer par **`auditeur-conversion`** quand tu auras 50 commandes et une répartition réelle des moyens de paiement.

## 41. Ce que tu n'actives pas, et pourquoi

| Moyen | Décision | Raison chiffrée |
|---|---|---|
| **Paiement en 3 ou 4 fois** (Klarna, Alma, Scalapay) | **Non** | Ton panier est de 22 à 30 €. Personne ne finance un achat de 25 € en quatre fois. Coût 3 à 6 % du montant, soit 0,90 à 1,80 € par commande, pour zéro conversion supplémentaire. **C'est l'application la plus inutile qu'on te recommandera.** À reconsidérer au-dessus de 80 € de panier moyen |
| **Paiement à la livraison** | **Non** | Impossible en point relais, et taux de refus de colis massif |
| **Virement bancaire manuel** | **Non** | Aucun acheteur d'impulsion ne fait un virement |
| **Amazon Pay, crypto, autres** | **Non** | Aucun volume en France sur ton profil d'acheteur |

## 42. Régler le checkout

Admin > **Paramètres > Paiement**

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Contact client | **Email** | Le SMS coûte et sert à peu de chose à ce volume |
| Comptes clients | **Facultatif** (jamais « obligatoire ») | Un compte obligatoire est un tueur de conversion sur trafic froid |
| Nom du client | Prénom et nom obligatoires | Nécessaire pour le retrait en point relais |
| Téléphone | **Obligatoire** | Mondial Relay envoie le SMS de mise à disposition. Sans numéro, le colis dort en relais et revient |
| Adresse ligne 2 | Facultatif | |
| Marketing par email | Case **décochée par défaut** | Consentement RGPD : l'opt-in doit être actif, jamais pré-coché |
| Abandons de panier | Email automatique **activé**, envoi à 10 h | Gratuit, et c'est le seul revenu additionnel qui ne coûte pas de budget média |

⚠️ **Shopify Editions Spring '26, publié le 17 juin 2026, a refondu visuellement le checkout** : espaces blancs réduits, bouton d'achat repositionné, saisie et validation automatiques de l'adresse en France. **Ne cherche pas à personnaliser le checkout**, il bouge, et sur Basic tes possibilités sont de toute façon limitées au logo et aux couleurs. C'est très bien ainsi : le checkout Shopify converti mieux que ce que tu bricolerais.

## 43. Personnaliser l'apparence du checkout

Admin > **Paramètres > Paiement > Personnaliser**

- Logo : le logo provisoire, aligné à gauche
- Couleur d'accentuation : `#2B2622`
- Image d'arrière-plan : aucune

## 44. Rédiger le message post-achat

Admin > **Paramètres > Paiement > section Traitement des commandes > Message supplémentaire sur la page de remerciement**

Contenu à saisir une fois le bloc 6 validé : rappel du délai d'expédition et du délai de livraison, et lien vers la page de suivi.

**Pourquoi.** C'est le seul écran que 100 % de tes acheteurs voient. Y rappeler le délai réel évite la moitié des « où est mon colis » de J+3.

## 45. L'avertissement sur les oppositions de paiement

⚠️ **À lire, même si ton risque est plus faible qu'en dropshipping.**

Une opposition de paiement (chargeback) est une contestation du client auprès de sa banque. Sur Shopify Payments, elle entraîne le débit immédiat du montant, plus des frais de dossier, et **elle compte dans un ratio surveillé par Visa et Mastercard**. Au-delà d'un certain taux, le compte passe sous surveillance, puis peut être suspendu. Le seuil couramment cité tourne autour de 0,9 % des transactions. **Je n'ai pas vérifié ce chiffre aujourd'hui, ne t'en approche pas.**

**Ta bonne nouvelle :** tu expédies depuis Cergy en 2 jours ouvrés, pas depuis la Chine en 4 semaines. Le motif numéro un de litige en dropshipping, la non-réception, est structurellement écarté.

**Ton risque réel est ailleurs et il est opérationnel :** deux personnes qui emballent à la main peuvent prendre du retard. Un colis expédié à J+6 au lieu de J+2 sur un client qui n'a reçu aucune information, c'est un litige. La parade est le bloc 7 : des emails transactionnels qui partent vraiment et qui arrivent.

**Règle à tenir :** rembourse toujours plutôt que de laisser un litige s'ouvrir. Un remboursement de 24,90 € coûte 24,90 €. Un litige coûte 24,90 € **plus** les frais **plus** un point de ratio. **`gestionnaire-sav`** cadrera les règles d'arbitrage chiffrées.

---

# Bloc 6 : La livraison

**Temps estimé : 60 min. Valeurs provisoires tant que le flacon n'est pas pesé.**

## 46. Régler l'emplacement d'expédition

Admin > **Paramètres > Emplacements**

- Renomme l'emplacement par défaut : `Stock Cergy`
- Adresse : l'adresse réelle de stockage
- Coche **Cet emplacement gère l'inventaire** et **Cet emplacement peut expédier des commandes**

⚠️ L'adresse d'origine détermine les tarifs proposés par les transporteurs et les points relais affichés au client. Une adresse fausse donne des tarifs faux.

## 47. Activer les points de retrait natifs

Admin > **Paramètres > Expédition et livraison > Autres modes de livraison > Points de retrait**

1. Sélectionne l'emplacement `Stock Cergy`
2. Active **Expédier vers des points de retrait depuis cet emplacement**
3. Choisis les transporteurs : **Mondial Relay** et, si tu le veux, **Colissimo point de retrait**

**C'est le changement Shopify France le plus utile de ce plan, et la plupart des tutoriels en ligne ne l'ont pas intégré.** Les points de retrait sont désormais **natifs en France, sur tous les forfaits, sans application et sans compte transporteur préalable**. Le client choisit son relais sur une carte pendant le checkout, et tu achètes l'étiquette depuis la commande, aux tarifs négociés par Shopify, facturée sur ta facture Shopify.

Ce que ça t'économise : l'application Mondial Relay officielle est facturée entre 14,90 $ et 139,90 $ par mois. **Tu n'en as pas besoin.**

⚠️ **Le piège qui fait perdre une heure :** l'option de point relais **n'apparaît pas au checkout** si la fiche produit n'a pas de poids et de dimensions renseignés, avec un plancher observé autour de **0,201 kg et 15 cm**. Un flacon de 500 ml passe largement ces seuils, mais **seulement si tu as renseigné le poids sur la fiche**. Note-le dans ta procédure de création de produit.

## 48. Créer le profil d'expédition France

Admin > **Paramètres > Expédition et livraison > Tarifs généraux > Gérer**

1. Zone d'expédition : renomme en `France métropolitaine`
2. Contenu de la zone : **France** uniquement
3. **Supprime toute autre zone** (Europe, Reste du monde) si elle existe

⚠️ **N'inclus pas les DOM-TOM au lancement.** Un colis de 900 g vers La Réunion coûte trois à quatre fois le tarif métropole. Si tu laisses la zone ouverte au tarif métropole, tu vends à perte sans t'en apercevoir. Pour les exclure proprement : la zone « France » de Shopify inclut par défaut les régions d'outre-mer, il faut les décocher une à une dans l'écran de sélection.

## 49. Poser la grille de tarifs, version provisoire

**Tarifs de référence relevés le 25/08/2026 :**

| Transporteur | Prestation | Tarif public constaté |
|---|---|---|
| Mondial Relay | Point relais, jusqu'à 500 g | **4,10 €** (sources : grille publique 2026 ; une autre source donne 3,94 €) |
| Colissimo | Domicile, 250 à 500 g | **7,59 € TTC** |

⚠️ **Ces deux lignes ne couvrent pas ton produit.** Un flacon de 500 ml en verre, plein et emballé, sort à 850 g - 1 kg. Le trio sort à 2,5 - 3 kg. **Je n'ai pas de tarif vérifié pour ces tranches, et je ne l'invente pas.**

**Grille à saisir en provisoire**, dans **Tarifs de la zone France métropolitaine > Ajouter un tarif > Définir vos propres tarifs** :

| Nom du tarif | Condition | Prix | Statut |
|---|---|---|---|
| `Point de retrait Mondial Relay` | Poids 0 à 1 kg | **à saisir après pesée** | Provisoire |
| `Point de retrait Mondial Relay` | Poids 1 à 3 kg | **à saisir après pesée** | Provisoire |
| `Livraison à domicile Colissimo` | Poids 0 à 1 kg | **à saisir après pesée** | Optionnel |

**Méthode de calcul, une fois la pesée faite :**

```
Tarif affiché au client = tarif transporteur de la tranche réelle
                        + 0,70 € d'emballage
                        arrondi aux 50 centimes supérieurs
```

L'emballage est un coût de vente, il n'a aucune raison de sortir de ta marge. Arrondir au-dessus absorbe les erreurs de pesée.

⚠️ **Le libellé du tarif doit contenir les mots « point de retrait »**, sinon l'affichage de la carte des relais ne se déclenche pas correctement au checkout.

## 50. Trancher : port facturé ou intégré

**Recommandation : port facturé, affiché tôt, jamais intégré au prix.**

Le raisonnement, propre à ton offre :

- Ton flacon seul doit rester crédible face à un plancher de détail français relevé entre **4,90 € et 11,90 €**. Y intégrer 4,50 € de port le pousse hors marché instantanément.
- Ton offre par défaut est le **trio à 24,90 €**, construit précisément pour amortir le port sur trois unités. Intégrer le port dans le trio ferait passer l'affichage à 29,40 €, ce qui casse le seuil psychologique des 25 € et l'écart avec les 29,70 € du prix à l'unité.
- **Différence importante avec TikTok Shop :** là-bas, la commission de 9 % s'applique aussi sur le port que tu factures, donc facturer ou intégrer revient au même. **Sur Shopify, il n'y a pas de commission sur le port.** Facturer le port est strictement plus favorable ici.

⚠️ **Le port doit être annoncé avant le checkout**, dans le bandeau et sur la page produit. Un frais découvert à la dernière étape est la première cause d'abandon de panier, et là c'est un frais qui représente 18 % du panier.

### Ce que je ne tranche pas
**Le seuil de livraison offerte.** C'est un arbitrage qui se calcule, pas qui s'estime. À poser à **`pilotage-chiffres`** avec la question exacte : *« À quel seuil de panier la livraison offerte est-elle rentable, sachant un port réel de X €, une marge unitaire de Y € sur le trio, et un taux de conversion inconnu ? »* Mon intuition, non chiffrée : un seuil autour de 39 € pousserait au double trio. **Ne l'active pas sur mon intuition.**

## 51. Fixer les délais affichés

**Règle absolue de ce plan : le délai affiché ne descend jamais en dessous du délai réellement tenable.**

Le calcul :

| Étape | Délai | Source |
|---|---|---|
| Traitement, préparation, dépôt en relais | **2 jours ouvrés** | Capacité annoncée par Edgar et Forqan |
| Transport Mondial Relay point relais | **3 à 5 jours ouvrés** | Délai commercial annoncé par le transporteur |
| **Total à afficher** | **5 à 7 jours ouvrés** | |

**Tu affiches « 5 à 7 jours ouvrés ». Tu n'affiches pas « 48 h », ni « 2 à 3 jours », ni « expédition express ».**

⚠️ **Le scénario de retard le plus probable est banal : la commande du vendredi soir.** Jours ouvrés = lundi à vendredi. Une commande le vendredi à 21 h te laisse jusqu'au mardi pour déposer, et le transport démarre au mieux le mercredi. **Prévois une tournée de dépôt le vendredi en fin d'après-midi**, c'est le seul geste opérationnel qui protège vraiment ce délai.

⚠️ Ce délai est **plus long que le SLA de 4 jours ouvrés imposé par TikTok Shop**. Ce n'est pas incohérent : Shopify n'a pas de SLA plateforme, et un délai honnête vaut mieux qu'un délai flatteur raté. Mais tes deux canaux n'auront pas la même promesse, et il faut que ce soit un choix, pas un oubli.

## 52. Écrire la page Livraison et retours

Admin > **Boutique en ligne > Pages > Livraison et retours**

Structure à poser (le contenu de la partie retours vient de `juriste-conformite`) :

1. **Où on livre :** France métropolitaine uniquement
2. **Comment :** point relais Mondial Relay, à domicile en option
3. **Combien :** la grille de l'étape 49
4. **En combien de temps :** expédition sous 2 jours ouvrés, livraison sous 5 à 7 jours ouvrés
5. **D'où :** expédié de France, depuis Cergy
6. **Suivi :** numéro communiqué par email
7. **Retours et rétractation de 14 jours** → **`juriste-conformite`**
8. **Colis non retiré en relais** → **`gestionnaire-sav`**

## 53. Renseigner la politique d'expédition Shopify

Admin > **Paramètres > Politiques > Politique d'expédition**

Recopie le contenu des points 1 à 6 de l'étape 52. Cette politique est celle qui s'affiche en lien pendant le checkout.

## 54. Régler les paramètres de commande

Admin > **Paramètres > Expédition et livraison > section Traitement des commandes**

- **Décoche** « Traiter automatiquement les articles de la commande ». Tu prépares à la main, tu marques comme expédié quand c'est vrai.
- Coche « Notifier les clients quand leur commande est expédiée » si l'option existe.

**Pourquoi.** Le traitement automatique enverrait un email « votre commande a été expédiée » alors que le colis est encore sur la table de la cuisine. C'est exactement le mensonge qui déclenche un litige à J+7.

## 55. Régler l'emballage par défaut

Admin > **Paramètres > Expédition et livraison > Emballage > Ajouter un emballage**

- Type : **Boîte**
- Dimensions et poids à vide de ton carton réel

⚠️ Ce poids à vide s'ajoute au poids produit pour calculer la tranche tarifaire. Un carton oublié, c'est une tranche de dessous, c'est une étiquette sous-payée et un rattrapage facturé par le transporteur.

---

# Bloc 7 : Emails transactionnels et checkout

**Temps estimé : 40 min**

## 56. Régler l'expéditeur des emails

Admin > **Paramètres > Notifications > Expéditeur**

- Adresse d'expéditeur : `contact@labrumerie.fr`
- Adresse de réponse : la même

## 57. Authentifier le domaine d'envoi

Admin > **Paramètres > Notifications > Expéditeur > Authentifier**

Shopify affiche 3 à 4 enregistrements **CNAME** à créer dans la zone DNS du domaine. Crée-les chez ton registrar, reviens, clique **Vérifier**.

**Pourquoi c'est non négociable.** Sans authentification, tes emails partent depuis les serveurs Shopify avec ton adresse en expéditeur, ce que Gmail et Outlook traitent comme de l'usurpation. Résultat : **confirmations de commande en indésirables**. Un client qui ne reçoit pas sa confirmation pense qu'il a été débité pour rien. C'est un litige à J+1, avant même que le colis parte.

⚠️ **Cette étape est impossible sans domaine.** C'est l'argument opérationnel décisif de l'étape 8.

## 58. Personnaliser la confirmation de commande

Admin > **Paramètres > Notifications > Confirmation de commande > Modifier le code**

À ajouter dans le corps :

- Le délai réel : expédition sous 2 jours ouvrés, livraison sous 5 à 7 jours ouvrés
- Le rappel que le numéro de suivi arrive dans un second email
- Le lien vers la page Contact
- La mention `TVA non applicable, article 293 B du CGI` (étape 16)

## 59. Personnaliser la confirmation d'expédition

Même chemin, notification **Confirmation d'expédition**.

- Rappelle que le colis va en **point relais** et qu'un SMS du transporteur préviendra de la mise à disposition
- Rappelle le **délai de garde en relais** (généralement 7 à 14 jours selon le transporteur, à vérifier auprès de Mondial Relay)

**Pourquoi ce dernier point.** Un colis non retiré revient à l'expéditeur, et tu paies le retour. C'est de la marge perdue sur une vente déjà réalisée, et c'est évitable par une phrase.

## 60. Vérifier les autres notifications

Passe en revue et personnalise a minima : **Facture de commande**, **Commande annulée**, **Remboursement**, **Panier abandonné**.

⚠️ **Relis-les en cherchant l'anglais résiduel et les tournures de traduction automatique.** Les modèles Shopify français sont corrects mais certaines notifications secondaires gardent des formulations bancales. C'est le genre de détail qu'un acheteur français repère immédiatement et qui signale « site étranger ».

## 61. Régler le SEO de base de la boutique

Admin > **Boutique en ligne > Préférences**

| Champ | Valeur |
|---|---|
| Titre de la page d'accueil | À rédiger par **`copywriter-fiches`** |
| Méta-description | À rédiger par **`copywriter-fiches`** |

Emplacement à remplir, valeur provisoire acceptable : `La Brumerie - Brumes textiles parfumées`.

## 62. Vérifier que la boutique est bien protégée par mot de passe

Admin > **Boutique en ligne > Préférences > Restreindre l'accès à la boutique**

- **Activé**, avec un mot de passe.
- Message affiché : `Bientôt ouvert.`

Tu le retireras à l'étape 80, pas avant.

---

# Bloc 8 : Applications et cookies

**Temps estimé : 30 min**

**Principe : zéro application payante au lancement.** Chaque application ralentit la boutique et prélève de la marge. Avec 43,20 € de coût mensuel déjà engagés et environ 10 € de marge par commande, **une application à 10 €/mois consomme une vente entière chaque mois.**

## 63. Le tableau des applications

| Application | Coût | Besoin couvert | Ce qui se passe si tu ne l'installes pas | Décision |
|---|---|---|---|---|
| **Shopify Order Printer** | 0 € | Facture avec mention 293 B à glisser dans le colis | Pas de facture propre, traçabilité aval bancale | **Installer** |
| **Facebook & Instagram** (canal Shopify) | 0 € | Pixel Meta et API de conversions natifs | Aucun suivi Meta possible plus tard | **Installer quand le Business Manager existera** |
| **Google & YouTube** (canal Shopify) | 0 € | GA4 avec le jeu d'événements ecommerce complet, sans code | Tu pilotes à l'aveugle | **Installer maintenant** |
| **TikTok** (canal Shopify) | 0 € | Pixel TikTok navigateur | Pas de suivi TikTok Ads | **Attendre le compte de marque** |
| Application d'avis (Judge.me, Loox) | Offres gratuites limitées | Collecte et affichage des avis | Rien, tant que tu as zéro client | **Attendre la 10e commande** |
| Application GPSR | 5 à 20 €/mois | Champs de conformité produit | Rien : une page et un bloc de texte font pareil sur 3 références | **Non** |
| Application de bandeau cookies (Pandectes, Consentmo, Axeptio) | 0 à 15 €/mois | Consentement RGPD | Le bandeau natif Shopify existe et est gratuit | **Non au lancement**, voir l'étape 65 |
| Application de paiement fractionné | 3 à 6 % | Financement du panier | Rien à 25 € de panier | **Non** |
| Applications de bundle, d'upsell, de compte à rebours | 10 à 30 €/mois | — | Rien | **Non** |

## 64. Les applications à ne jamais installer

⚠️ **Interdiction ferme, et ce n'est pas une question de goût.**

| Type | Pourquoi c'est exclu |
|---|---|
| Compteurs de fausse urgence (« offre expire dans 09:58 » qui se relance à chaque visite) | Pratique commerciale trompeuse au sens de l'article L121-2 du code de la consommation |
| Faux stocks (« plus que 3 en stock ! » sur un stock réel de 30) | Idem |
| Notifications d'achats fictives (« Sophie de Lyon vient d'acheter... ») | Idem, et le visiteur français les repère en trois secondes |
| Faux avis, avis importés, avis générés | Idem, et c'est sanctionné spécifiquement |

Au-delà du droit : ta défense concurrentielle est le contenu et la confiance, pas le prix. Une boutique qui ment sur son stock a détruit la seule chose qu'elle avait.

## 65. Activer le bandeau de cookies natif

Admin > **Paramètres > Confidentialité des clients**

1. Active le **bandeau de cookies**
2. Région d'affichage : **Union européenne** (ou toutes régions)
3. Vérifie que le bandeau propose bien **« Refuser tout »** au même niveau visuel que **« Accepter tout »**
4. Active **Limiter le suivi des clients en Europe**

⚠️ **La CNIL exige que refuser soit aussi simple qu'accepter.** Le bandeau natif Shopify a été critiqué sur ce point par le passé. **Regarde-le toi-même sur ton téléphone**, à l'étape 78, et compte les clics nécessaires pour refuser. Si refuser demande plus de clics qu'accepter, il faudra une solution tierce, et c'est le seul cas où une dépense sera justifiée.

⚠️ **Le bandeau conditionne aussi la mesure.** Les pixels ne se déclenchent qu'après consentement. Un bandeau mal configuré casse ton suivi de conversion autant qu'il t'expose juridiquement.

### Délégué à un autre agent
- **`juriste-conformite`** : formulation exacte du bandeau, contenu de la politique de cookies, et vérification de la conformité CNIL du bandeau natif tel qu'il s'affiche réellement.

## 66. Rédiger la page Politique de cookies

Admin > **Boutique en ligne > Pages > Ajouter une page**, titre `Politique de cookies`, handle `politique-de-cookies`.

Page vide pour l'instant. Contenu par **`juriste-conformite`**.

## 67. Vérifier les applications préinstallées

Admin > **Applications**

Désinstalle tout ce qui a pu être installé pendant l'assistant de démarrage et que tu n'as pas décidé. Shopify propose des installations en un clic pendant l'onboarding, et elles restent.

## 68. Mesurer la vitesse avant d'ajouter quoi que ce soit

Admin > **Boutique en ligne > Thèmes > section Vitesse de la boutique en ligne**

Note le score actuel, thème nu. **C'est ta référence.** Chaque application installée plus tard devra justifier sa baisse de score.

---

# Bloc 9 : Suivi et mesure

**Temps estimé : 40 min**

## 69. Ce qui s'installe maintenant, ce qui attend

| Outil | Maintenant ? | Pourquoi |
|---|---|---|
| **GA4** | **Oui** | Ne dépend d'aucun autre compte. C'est ta seule source de vérité neutre sur le trafic |
| **Pixel Meta** | **Non, en attente** | Il faut un Business Manager, et `HUB_DSA_ENTITY` est bloqué sur le changement d'activité au SIRET. Rien ne presse : zéro budget Meta prévu à court terme |
| **Pixel TikTok** | **Non, en attente** | Le compte TikTok de marque n'existe pas encore. Périmètre de **`planificateur-tiktok`** |
| **Suivi côté serveur (Events API)** | **Non** | L'intégration native TikTok de Shopify n'envoie qu'un pixel navigateur. L'API serveur passe par une application tierce payante. **Sans budget publicitaire, elle ne sert à rien.** À reconsidérer au-delà de quelques centaines d'euros de dépense média mensuelle |

## 70. Installer GA4

1. Crée une propriété **Google Analytics 4** sur analytics.google.com, au nom `La Brumerie`, fuseau Paris, devise EUR
2. Admin Shopify > **Applications et canaux de vente > Boutique d'applications Shopify > Google & YouTube > Installer**
3. Connecte le compte Google, puis **Analytics > Connecter**, sélectionne la propriété GA4

**Ce que ça installe :** le jeu complet d'événements ecommerce GA4 (`page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`), sans une ligne de code.

⚠️ **Depuis le 17 août 2026**, le canal Google & YouTube envoie davantage d'événements à GA4, avec un paramètre technique `shopify_event_name`. **Conséquence directe : n'ajoute surtout pas Google Tag Manager en plus.** Deux sources qui envoient `purchase` donnent des ventes comptées deux fois, et donc un ROAS faux par un facteur 2. C'est pire que pas de mesure du tout.

## 71. Ne pas activer Merchant Center tout de suite

Le canal Google & YouTube propose de synchroniser un flux produit vers Merchant Center. **Laisse-le éteint.** Sans produit et sans pages légales validées, une synchronisation prématurée génère un refus de compte Merchant Center, et un refus se rattrape mal. Périmètre de **`strategiste-google`**, quand le moment viendra.

## 72. Vérifier les événements clients

Admin > **Paramètres > Événements clients**

C'est ici que vivent les pixels installés par les canaux et les éventuels pixels personnalisés. **Il ne doit y avoir aucun pixel personnalisé pour l'instant.** S'il y en a un, tu ne l'as pas mis, supprime-le.

## 73. La commande test, et pourquoi elle est obligatoire

**Cette étape ne peut se faire qu'après la création du premier produit.** Elle est hors périmètre de ce plan mais elle est notée ici parce qu'elle conditionne tout arbitrage publicitaire futur.

Procédure, une fois un produit en ligne :

1. Passe une **vraie commande** avec une vraie carte, à un prix réel
2. Vérifie l'arrivée de l'email de confirmation **dans la boîte principale, pas en indésirables**
3. Ouvre GA4 > **Rapports > Temps réel** et vérifie que l'événement `purchase` apparaît **avec le bon montant**
4. Marque la commande comme expédiée, vérifie l'email de confirmation d'expédition
5. **Rembourse la commande** et vérifie l'email de remboursement
6. Vérifie que le remboursement apparaît bien dans Shopify Payments

**Pourquoi j'insiste.** Une boutique dont le suivi de conversion est cassé rend tout arbitrage publicitaire impossible : tu couperas des campagnes rentables et tu laisseras tourner celles qui perdent. Et tu ne le sauras pas, parce qu'une mesure fausse ressemble exactement à une mesure vraie.

## 74. Le Hub Ecom

Le Hub attend une page Boutique branchée sur l'API Shopify Admin. Maintenant que la boutique existe, la clé d'API peut être générée : **Paramètres > Applications et canaux de vente > Développer des applications**.

Ne le fais pas maintenant, c'est un chantier à part. Note-le juste comme débloqué.

---

# Bloc 10 : Verrouillage et checklist

**Temps estimé : 25 min**

## 75. Créer les comptes de personnel

Admin > **Paramètres > Utilisateurs > Ajouter un utilisateur**

Ajoute Edgar avec toutes les autorisations sauf la gestion du forfait et des paiements. Le propriétaire reste Forqan.

## 76. Activer l'authentification à deux facteurs

Admin > **Paramètres > Utilisateurs > [chaque utilisateur] > Sécurité > Authentification à deux facteurs**

Sur les deux comptes. Une boutique qui encaisse de l'argent avec un simple mot de passe est une boutique qu'on se fait prendre.

## 77. Sauvegarder les accès

Note dans un gestionnaire de mots de passe : accès Shopify, accès registrar, accès PayPal, accès Google. **Pas dans un fichier du dépôt git.**

## 78 à 80. La checklist de mise en ligne

Voir le tableau ci-dessous.

---

## Checklist de mise en ligne

À faire **dans l'ordre**, avant de retirer le mot de passe et avant tout envoi de trafic payant.

### Partie A : réalisable maintenant, sans produit

| # | Vérification | Fait |
|---|---|---|
| A1 | Le propriétaire du compte Shopify est bien Forqan | ☐ |
| A2 | Le nom légal correspond au caractère près à l'avis de situation SIRENE | ☐ |
| A3 | Devise EUR, langue française, unités métriques, marché France uniquement | ☐ |
| A4 | **Paramètres > Taxes et frais de douane : aucune immatriculation TVA active** | ☐ |
| A5 | **L'option « Exonération pour les micro-entreprises » n'est PAS sélectionnée** | ☐ |
| A6 | « Inclure les taxes dans les prix » est décoché | ☐ |
| A7 | La mention `TVA non applicable, article 293 B du CGI` est en pied de page | ☐ |
| A8 | La même mention est dans la confirmation de commande et sur le modèle de facture | ☐ |
| A9 | Le mot « TTC » n'apparaît nulle part sur la boutique | ☐ |
| A10 | Le domaine est branché, le SSL est actif, le cadenas s'affiche | ☐ |
| A11 | Le domaine d'envoi des emails est authentifié (CNAME vérifiés) | ☐ |
| A12 | Shopify Payments est vérifié et actif, IBAN au nom de Forqan | ☐ |
| A13 | PayPal est actif, Shop Pay / Apple Pay / Google Pay sont actifs | ☐ |
| A14 | Aucun paiement fractionné n'est activé | ☐ |
| A15 | Les points de retrait Mondial Relay sont activés depuis `Stock Cergy` | ☐ |
| A16 | Les DOM-TOM sont exclus de la zone France | ☐ |
| A17 | Toutes les pages du pied de page s'ouvrent, aucun lien mort | ☐ |
| A18 | Le bandeau de cookies s'affiche, et refuser demande le même nombre de clics qu'accepter | ☐ |
| A19 | GA4 est connecté et reçoit `page_view` en temps réel | ☐ |
| A20 | Aucun pixel personnalisé en doublon dans Événements clients | ☐ |
| A21 | Aucune application non décidée n'est installée | ☐ |
| A22 | Score de vitesse mobile relevé et noté | ☐ |
| A23 | Authentification à deux facteurs active sur les deux comptes | ☐ |
| A24 | Relecture complète : aucun texte d'exemple, aucun latin, aucun anglais résiduel | ☐ |
| A25 | Parcours complet refait **sur un téléphone**, pas sur un ordinateur redimensionné | ☐ |

### Partie B : après création du premier produit, avant le trafic

| # | Vérification | Fait |
|---|---|---|
| B1 | **Le flacon plein et emballé a été pesé**, la grille de port est recalculée sur le poids réel | ☐ |
| B2 | La case « Facturer des taxes sur ce produit » est décochée sur chaque fiche | ☐ |
| B3 | Le poids et les dimensions sont renseignés sur chaque fiche (sinon pas de point relais) | ☐ |
| B4 | L'option point relais apparaît réellement au checkout, avec la carte | ☐ |
| B5 | Le délai affiché est bien 5 à 7 jours ouvrés, nulle part moins | ☐ |
| B6 | Aucun visuel ne comporte de texte étranger incrusté ni de filigrane Gemini | ☐ |
| B7 | Les informations GPSR sont recopiées de l'étiquette réelle, sur la page et sur la fiche | ☐ |
| B8 | Les CGV, mentions légales et politique de confidentialité sont celles de `juriste-conformite`, pas les modèles Shopify | ☐ |
| B9 | **Commande test réelle payée**, email de confirmation reçu hors indésirables | ☐ |
| B10 | L'événement `purchase` apparaît dans GA4 avec le bon montant | ☐ |
| B11 | Commande test remboursée, email de remboursement reçu | ☐ |
| B12 | Étiquette de test achetée depuis la commande, tarif réel constaté et comparé à la grille | ☐ |

---

## Statut final

**La boutique n'est pas prête pour du trafic payant, et ce n'est pas un problème : ce plan ne prétend pas l'y amener.**

À l'issue des étapes 1 à 80, la boutique est **prête à recevoir ses produits**. Il manquera ensuite, dans l'ordre :

1. **Le poids réel du flacon emballé.** Bloque la grille de port définitive et donc tout calcul de marge Shopify.
2. **Le produit et son prix d'achat réel à Aubervilliers.** Bloque tout.
3. **Les fiches produits** (`copywriter-fiches`).
4. **Les pages légales réelles** (`juriste-conformite`). Sans elles, pas de mise en ligne, encore moins de publicité.
5. **La commande test validée de bout en bout** (partie B de la checklist).
6. **Un audit du tunnel** (`auditeur-conversion`) avant le premier euro de budget média.

---

## Ce que ce plan ne couvre pas

| Sujet | Agent ou skill | Phrase de déclenchement |
|---|---|---|
| Logo, palette définitive, favicon, ton de voix | **`architecte-marque`** | *« Livre l'identité visuelle de La Brumerie : logo, palette, favicon, à partir du positionnement du 22/08. »* |
| Texte des fiches produits, page À propos, FAQ, balises SEO | **`copywriter-fiches`** | *« Rédige la fiche produit White Dream pour la boutique Shopify La Brumerie. »* |
| CGV, mentions légales, confidentialité, cookies, rétractation, formulation du bandeau | **`juriste-conformite`** | *« Rédige les pages légales de La Brumerie : Shopify, micro-entreprise en franchise en base, distributeur GPSR, France uniquement. »* |
| Seuil de livraison offerte, prix de vente définitif, marge réelle par canal | **`pilotage-chiffres`** | *« Calcule le seuil de franco de port de La Brumerie sur Shopify, avec le poids réel et le port réel. »* |
| Audit du tunnel une fois en ligne | **`auditeur-conversion`** | *« Audite le tunnel de La Brumerie en mobile d'abord avant le premier budget média. »* |
| Compte TikTok de marque, pixel TikTok, liaison des comptes | **`planificateur-tiktok`** | — |
| Paramétrage TikTok Shop, commission, expédition, versements | **`specialiste-tiktok-shop`** | — |
| Politique de retour opérationnelle, colis non retirés, litiges | **`gestionnaire-sav`** | — |
| Emails marketing et flows | **`redacteur-flows-email`** | — |

---

## Coûts mensuels du montage

| Poste | Coût mois 1 à 3 | Coût à partir du mois 4 | Vérifié le |
|---|---|---|---|
| Abonnement Shopify Basic | 1,00 €/mois | 36,00 €/mois | 25/08/2026, [shopify.com/fr/pricing](https://www.shopify.com/fr/pricing) |
| TVA 20 % non récupérable sur l'abonnement (franchise en base) | 0,20 €/mois | 7,20 €/mois | Calcul, art. 293 B CGI |
| Domaine `labrumerie.fr` | ~1,00 €/mois (soit ~12 €/an) | ~1,00 €/mois | **À vérifier chez le registrar** |
| Thème Dawn | 0 € | 0 € | 25/08/2026 |
| Points de retrait natifs (pas d'application Mondial Relay) | 0 € | 0 € | 25/08/2026 |
| Shopify Order Printer | 0 € | 0 € | 25/08/2026 |
| Canal Google & YouTube (GA4) | 0 € | 0 € | 25/08/2026 |
| Bandeau de cookies natif | 0 € | 0 € | 25/08/2026 |
| **Total mensuel** | **~2,20 €** | **~44,20 €** | |

**Décaissement total pour mettre la boutique debout : environ 15 € sur les trois premiers mois** (3 € d'abonnement, ~12 € de domaine). C'est 7,5 % de ta trésorerie totale, et 30 % de ta réserve hors stock.

Frais variables, hors abonnement, sur chaque vente :

| Poste | Sur une commande de 29,40 € (trio + port) |
|---|---|
| Shopify Payments, 1,5 % + 0,25 € | 0,69 € |
| ou PayPal, 2,90 % + 0,35 € | 1,20 € |

### Combien de ventes pour couvrir les frais fixes

Marge par commande, **hypothèses explicites, toutes à confirmer** : trio à 24,90 € + 4,50 € de port facturé, coût d'achat 2,50 € l'unité (chiffre cible du 22/08, **jamais relevé sur place**), emballage 0,70 €, URSSAF 12,415 %, Shopify Payments.

| Scénario | Port réel | Marge nette par commande |
|---|---|---|
| Optimiste, colis sous 1 kg | 4,50 € | **12,36 €** |
| Réaliste, trio de flacons verre 500 ml | 7,50 € | **9,36 €** |

| Période | Frais fixes mensuels | Ventes à couvrir (scénario réaliste) |
|---|---|---|
| Mois 1 à 3 | 2,20 € | **1 vente tous les 4 mois** |
| À partir du mois 4 | 44,20 € | **5 ventes par mois** |

**Lecture honnête.** Cinq ventes par mois pour que la boutique Shopify s'autofinance, c'est un seuil bas et atteignable. Ce n'est pas là que se joue ta rentabilité. **Ce qui se joue ici, c'est que 15 € achètent une assurance contre la perte totale de ton stock en cas de suspension du compte TikTok Shop.** C'est le meilleur ratio de tout le projet, et c'est la seule raison pour laquelle ce montage passe avant d'autres dépenses.

---

## Les décisions à trancher avant de commencer

| # | Décision | Bloquant ? | Ma recommandation |
|---|---|---|---|
| 1 | **Le compte Shopify appartient-il à Forqan ?** | **Oui, étape 1** | Oui, obligatoirement. Transfert de propriété avant le bloc 5 |
| 2 | **Acheter `labrumerie.fr` maintenant ?** | **Oui, étapes 9, 10, 57** | Oui, ~12 €, chez un registrar tiers. Pas le `.com`, pas de défensif |
| 3 | **Quelle adresse est publiée en mentions légales ?** | **Oui, étape 2** | À arbitrer avec `juriste-conformite`. Le domicile de Cergy devient public |
| 4 | Prix définitif du flacon seul et du trio | Non, bloque les fiches | Trio à 24,90 €, flacon jamais mis en avant. Acté le 22/08 |
| 5 | Port facturé ou intégré | Non | **Facturé.** Pas de commission sur le port côté Shopify |
| 6 | Seuil de livraison offerte | Non | **Ne pas trancher sans `pilotage-chiffres`.** Laisser désactivé au lancement |
| 7 | Proposer la livraison à domicile Colissimo | Non | Point relais seul au lancement. Domicile en option facturée au prix réel si la pesée le permet |
| 8 | Numéro de TVA intracommunautaire obtenu ? | Non pour monter, oui pour être conforme | À demander au SIE. Concerne aussi Shopify, pas seulement Meta et TikTok |

### Trois échéances externes qui ne dépendent pas de ce plan

- **1er septembre 2026, dans 7 jours :** obligation de pouvoir **recevoir** des factures électroniques, y compris en franchise en base. Shopify facture depuis l'Irlande. → **`juriste-conformite`**
- **30 septembre 2026 :** date limite d'option pour le versement libératoire de l'IR applicable au 1er janvier 2027.
- **Code APE du SIRET :** s'il porte encore une prestation de services, c'est 2,20 € de marge perdue par vente à 25 €, soit environ 22 % de la marge. Vérification en 10 minutes sur l'avis de situation SIRENE.

---

## Sources vérifiées le 25 août 2026

- [Tarifs Shopify France](https://www.shopify.com/fr/pricing) : Basic 36 €/mois, 27 €/mois en annuel, Grow 105 €, Advanced 384 €. Commission Basic 1,5 % + 0,25 € cartes standard. Offre 3 jours gratuits puis 1 €/mois pendant 3 mois
- [Frais PayPal marchands France](https://www.paypal.com/fr/business/paypal-business-fees) : 2,90 % + 0,35 € en transaction commerciale domestique
- [Délais de versement Shopify Payments France](https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/france/payouts) : environ 3 jours ouvrés
- [Tarifs Mondial Relay 2026](https://www.mondialrelay.fr/envoi-de-colis/tarifs-expeditions/) : à partir de 4,10 € jusqu'à 500 g en point relais (page inaccessible en lecture automatisée, chiffre issu de sources secondaires concordantes : [Margeo](https://margeoapp.com/blog/tarifs-mondial-relay-2026), [Comptoir du Net](https://www.comptoirdunet.fr/prix-envoi-colis-par-mondial-relay-tableau-recapitulatif-2026-a-garder-sous-la-main/))
- [Tarifs Colissimo entreprises 2026](https://www.colissimo.entreprise.laposte.fr/en/offer-and-prices/prices/general-rates-colissimo-home-delivery-france) : environ 7,59 € TTC sur la tranche 250-500 g domicile
- [Points de retrait natifs Shopify France](https://stellarprojects.fr/blogs/tout-sur-shopify/mondial-relay-shopify) : Paramètres > Expédition et livraison > Autres modes de livraison > Points de retrait, sans application, tous forfaits (source secondaire, à confirmer à l'écran)
- [Configuration des taxes UE sur Shopify, Sufio](https://fr.sufio.com/articles/shopify/taxes/tva-ue-shopify/ue-taxes/) : nature réelle de l'option « Exonération pour les micro-entreprises »
- [Shopify Editions Printemps 2026](https://www.shopify.com/fr/editions/spring2026) : refonte du checkout, publiée le 17 juin 2026
- [Shopify enverra plus d'événements à Google Analytics à partir du 17 août 2026](https://spilnoagency.com.ua/en/news-en/shopify-google-analytics-new-events-2026) (source secondaire)
- [Comparatif Dawn / Horizon 2026](https://www.magespark.com/blog/best-free-shopify-themes-dawn-vs-horizon.html) : scores PageSpeed mobile 82 contre 52 (sources secondaires, mesures publiques)
- [Règlement (UE) 2023/988 sur la sécurité générale des produits](https://eur-lex.europa.eu/FR/legal-content/summary/general-product-safety-regulation-2023.html) : applicable depuis le 13 décembre 2024, obligations d'information de l'article 19
- [Paramètres de confidentialité des clients Shopify](https://help.shopify.com/en/manual/privacy-and-security/privacy/customer-privacy-settings) : bandeau de cookies natif gratuit
- [Pixel TikTok pour Shopify](https://ads.tiktok.com/help/article/tiktok-pixel-shopify?lang=en) : l'intégration native n'installe qu'un pixel navigateur, sans Events API

### Ce que je n'ai pas pu vérifier

1. **Le prix exact d'un domaine `.fr`** chez OVH, Gandi ou Namecheap, et son prix de renouvellement. Ordre de grandeur 10 à 15 €/an, à confirmer à l'achat.
2. **Le prix des domaines vendus par Shopify.** Sources secondaires entre 11 $ et 15 €/an.
3. **La disponibilité et le prix exact du forfait Starter en France en 2026.** Source secondaire à 5 €/mois, non confirmé sur la page officielle.
4. **La grille tarifaire Mondial Relay au-delà de 500 g.** Page inaccessible en lecture automatisée, et c'est précisément la tranche qui te concerne.
5. **Le seuil exact de litiges déclenchant une suspension Shopify Payments.** Ordre de grandeur 0,9 %, non vérifié.
6. **Les seuils de poids et de dimensions minimum** conditionnant l'affichage des points de retrait (~0,201 kg, ~15 cm). Source secondaire, non documenté officiellement.
7. **Le poids réel de White Dream.** Aucun flacon n'a été pesé. **C'est le chiffre manquant le plus coûteux de ce plan.**
8. **Le prix d'achat réel à Aubervilliers.** Toujours jamais relevé. Toutes les marges de ce document en dépendent.
