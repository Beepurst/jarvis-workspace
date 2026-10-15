# Conformité : transition des pages légales de La Brumerie vers La Sente

> Date : 2026-09-15
> Revue de conformité documentée, sans valeur de conseil juridique opposable. Je ne suis pas avocat. Les textes ci-dessous sont des modèles adaptés au cas de Forqan Ibrahimi, à relire avant publication. Les points qui exigent un professionnel sont listés en fin de document.

---

## Situation retenue

| Élément | Valeur | Source ou hypothèse |
|---|---|---|
| Titulaire | IBRAHIMI FORQAN, personne physique, entrepreneur individuel | Reprise du dossier La Brumerie du 25 août 2026 |
| Nom commercial | La Sente (remplace La Brumerie et le nom intermédiaire "La Flânerie") | Donnée fournie par Edgar |
| SIREN / SIRET | 984 253 591 / 984 253 591 00015 | Inchangé |
| Adresse | 47 rue du Chemin de Fer, 95800 Cergy | Inchangé |
| Activité | Achat-revente d'accessoires et articles de bien-être pour animaux de compagnie (remplace la revente de désodorisants textiles) | Donnée fournie |
| Modèle de sourcing | **Dropshipping classique, fournisseur AliExpress, expédition directe depuis la Chine, aucun stock détenu** | Donnée fournie, changement majeur par rapport à La Brumerie (grossiste français, stock détenu à Cergy) |
| Produit de lancement | Tapis de léchage en silicone à ventouses pour chien | Donnée fournie |
| Prix de vente | 24,90 € | Donnée fournie |
| Pays de vente | France, extension UE possible mais non activée | Donnée fournie |
| Pays d'expédition | Chine (fournisseur AliExpress) | Donnée fournie, à l'inverse de La Brumerie où le produit était déjà en France |
| Régime TVA | Franchise en base pressentie pour les ventes domestiques, **non tranché avec le SIE** | Hérité du dossier du 25 août, toujours ouvert au 14 septembre selon `context/CONTEXT.md` |
| Statut boutique | Structure Shopify existante (`labrumerie.fr`), pages légales La Brumerie publiées ou prêtes, jamais ouverte au public avec des ventes réelles | Donnée fournie |

---

## Verdict

**La boutique ne peut pas ouvrir en l'état.** La bonne nouvelle : le changement de produit fait tomber un blocage réel (le risque ADR sur un parfum potentiellement inflammable disparaît, un tapis en silicone n'est pas une marchandise dangereuse). La mauvaise nouvelle : le changement de modèle de sourcing (grossiste français dédouané ancien modèle contre importation directe de Chine, colis par colis, nouveau modèle) en ouvre au moins deux nouveaux, plus graves parce qu'ils touchent à l'existence même de l'offre, pas seulement à la rédaction d'une page.

1. **Toutes les pages légales existantes désignent le mauvais nom, la mauvaise activité et un mauvais pays d'expédition.** Elles ne sont pas obsolètes sur un point de détail, elles décrivent une entreprise et un flux logistique qui n'existent plus.
2. **Le statut de Forqan bascule potentiellement de distributeur à importateur au sens du règlement (UE) 2023/988.** Avec La Brumerie, le produit était acheté déjà présent sur le marché européen chez un grossiste français : Forqan n'avait qu'à respecter les obligations de distributeur. Avec un envoi direct depuis un fournisseur AliExpress en Chine, il n'y a plus, dans la chaîne, d'opérateur économique établi dans l'Union qui a placé le produit sur le marché avant lui. C'est potentiellement lui qui le fait, à chaque commande.
3. **La TVA à l'importation et le droit de douane forfaitaire de 3 € sont réactivés par ce modèle**, alors qu'ils étaient neutralisés par l'achat chez un grossiste français dans l'ancien modèle. Sans solution technique (IOSS ou équivalent), soit le client reçoit une facture surprise à la livraison, soit le colis est bloqué en douane.
4. **Le délai de livraison affiché dans les CGV actuelles ("expédié depuis la France") est faux pour ce modèle**, et un délai de livraison inexact affiché avant l'achat est une pratique commerciale trompeuse, indépendamment de toute question de rédaction de page légale.
5. **Les blocages hérités du 25 août ne sont pas confirmés résolus** : bascule INSEE de l'activité commerciale et du RCS, régime de TVA tranché par écrit avec le SIE, médiateur de la consommation désigné, fonctionnalité de rétractation en ligne construite (obligatoire depuis le 19 juin 2026). `context/CONTEXT.md` les indique encore ouverts au 14 septembre.

Les textes mis à jour (mentions légales et CGV) sont fournis plus bas, prêts à coller. Ils deviennent publiables une fois les points 2, 3 et 4 tranchés, et les blocages hérités confirmés résolus.

---

## Écarts bloquants

| # | Écart | Obligation | Risque encouru | Correction |
|---|---|---|---|---|
| B1 | Statut d'importateur non clarifié pour un envoi direct Chine → client final | Règlement (UE) 2023/988 (RSGP), obligations d'importateur : vérifier la conformité, s'assurer qu'un responsable établi dans l'Union est identifiable, conserver une documentation technique, informer les autorités en cas de risque | Retrait de l'offre, sanctions de marché, et en cas de dommage au client (ventouse avalée, silicone toxique), la responsabilité civile et pénale du "premier metteur sur le marché français" pointe vers Forqan puisqu'il n'y a personne d'autre dans la chaîne établi en UE | Documenter par écrit, avant la première vente, qui assume la fonction d'importateur (Forqan lui-même le plus souvent en dropshipping direct), et exiger du fournisseur une fiche technique et une déclaration de conformité RSGP. Faire trancher ce point avec un professionnel, voir section dédiée |
| B2 | TVA à l'importation et droit de douane forfaitaire de 3 € par colis non gérés | Le droit de douane forfaitaire de 3 € s'applique depuis le 1er juillet 2026 à tout colis extra-UE de moins de 150 €, et la franchise douanière historique de 150 € est supprimée. La TVA à l'import est due dès le premier euro | Colis bloqué en douane, client qui reçoit une demande de paiement surprise à la livraison (pratique commerciale trompeuse sur le prix total si non anticipé), ou perte du colis en cas de refus du client de payer | Choisir un mode d'expédition ou un service de dropshipping qui gère la déclaration IOSS ou un régime équivalent, pour que le prix payé par le client soit définitivement le prix total. À défaut, informer explicitement le client avant l'achat que des frais peuvent s'ajouter à la livraison, ce qui reste risqué au regard de l'obligation de prix total affiché |
| B3 | CGV actuelles affirment un produit expédié depuis la France | Art. L221-5 et L111-1 du code de la consommation : l'information sur les modalités de livraison doit être exacte avant la commande | Pratique commerciale trompeuse (art. L132-2, jusqu'à 2 ans d'emprisonnement et 300 000 € d'amende pour une personne physique, montant à vérifier précisément selon la qualification retenue), au minimum non-conformité au devoir d'information précontractuelle | Réécrire l'article 7 des CGV pour annoncer un délai réaliste depuis la Chine, confirmé auprès du fournisseur avant publication |
| B4 | Bascule INSEE de l'activité commerciale et immatriculation RCS non confirmées | Art. 19 LCEN : le RCS doit être publié pour une activité de commerce électronique | Défaut de mentions légales : 1 an d'emprisonnement et 75 000 € d'amende pour une personne physique (art. 1-2 LCEN, loi SREN n° 2024-449) | Vérifier sur l'avis de situation INSEE (Sirene) que le code APE est commercial et que le RCS apparaît, avant de publier quoi que ce soit |
| B5 | Régime TVA non tranché par écrit avec le service des impôts des entreprises | Mention obligatoire sur prix et factures | Fausse mention fiscale ou TVA facturée sans être due | Écrit du SIE via la messagerie sécurisée de l'espace professionnel |
| B6 | Aucun médiateur de la consommation désigné | Art. L612-1 et L616-1 c. conso | Amende administrative jusqu'à 3 000 € (personne physique) | Adhérer avant l'ouverture, CM2C ou équivalent référencé sur la liste officielle |
| B7 | Fonctionnalité de rétractation en ligne non confirmée construite | Art. L221-21 et D221-5 c. conso, obligatoire depuis le 19 juin 2026 | Amende administrative jusqu'à 15 000 € (personne physique) | Bouton dédié, accessible pendant tout le délai, avec accusé de réception horodaté |

---

## Ce qui se règle en changeant de produit (bonne nouvelle)

- **Le risque ADR (marchandise dangereuse, parfum potentiellement inflammable)** disparaît. Un tapis de léchage en silicone n'est ni un liquide, ni un gaz, ni classé dangereux au sens du règlement CLP. Mondial Relay et les transporteurs classiques n'ont pas de motif de refus sur ce point.
- **L'exception ADR sur l'assurance transporteur** tombe avec elle : plus besoin de fiche de données de sécurité (FDS) ni de numéro UN.
- **La question de l'usage des marques tierces (Ameerat, Khamra, White Dream)** ne se pose plus dans les mêmes termes, sauf si le produit retenu porte une marque de fabricant identifiable sur l'emballage, à vérifier au cas par cas selon le fournisseur choisi.

---

## À corriger sous 30 jours

| # | Écart | Obligation | Risque | Correction |
|---|---|---|---|---|
| C1 | Fiche produit sans avertissement sur le risque d'ingestion des ventouses | Art. 5 du règlement (UE) 2023/988, exigence générale de sécurité : le produit doit être sûr compte tenu d'un usage raisonnablement prévisible, y compris par l'animal | Pas de sanction chiffrée identifiée avec certitude, mais responsabilité civile en cas d'incident (ventouse avalée), et argument à charge en cas de contrôle | Ajouter sur la fiche produit et la notice : "à utiliser sous surveillance, retirer le tapis si une ventouse se détache, ne pas laisser un chien qui mâchouille les objets sans surveillance" |
| C2 | Allégation "silicone alimentaire" ou "food grade" à vérifier avant reprise | Le règlement (CE) n° 1935/2004 sur les matériaux au contact des denrées alimentaires vise les aliments **humains**, pas l'alimentation animale, au sens de la définition de "denrée alimentaire" du règlement (CE) n° 178/2002. Il n'existe pas d'obligation harmonisée équivalente et aussi précise pour le contact avec l'alimentation animale, au meilleur de mes recherches. Une allégation "conforme au contact alimentaire" reprise du fournisseur sans vérification est une allégation non fondée si elle n'est pas rattachée à une norme réelle | Reformuler prudemment : "silicone de qualité alimentaire selon les informations du fabricant" plutôt qu'une conformité réglementaire affirmée comme un fait établi, sauf si le fournisseur produit un certificat de test (migration de substances, absence de phtalates) |
| C3 | Mention "EI" absente de la dénomination | Art. R526-27 c. com. | Contravention de 4e classe selon les sources professionnelles, montant non vérifié sur une source officielle | Publier "Forqan IBRAHIMI, EI" partout, inchangé par rapport au dossier du 25 août |
| C4 | Bandeau cookies par défaut de Shopify insuffisant si pixels publicitaires | Art. 82 loi Informatique et Libertés, recommandation CNIL | Amende jusqu'à 2 % du chiffre d'affaires (art. 20 de la loi) | Configurer en mode bloquant, refus aussi simple qu'acceptation |
| C5 | Disponibilité du nom "La Sente" et du domaine non confirmée à l'INPI | Art. L713-2 CPI | Opposition, changement de nom après lancement, troisième changement de marque en un mois | Recherche d'antériorité sur data.inpi.fr, classes 18 et 35, avant tout investissement logo ou publicité, cf. `livrables/boutique/2026-09-14-marque-la-flanerie.md` |
| C6 | REP emballages non traitée | Le colis d'expédition ajouté par le vendeur est un emballage ménager mis sur le marché | Non-adhésion à un éco-organisme | Vérifier auprès de Citeo, question héritée et non résolue depuis le 25 août |

---

## À surveiller

- **Rescrit BOFiP du 4 mars 2026 sur la TVA des ventes à distance de biens importés en dropshipping.** Il distingue plusieurs cas selon que le bien est livré en France ou dans un autre État membre, et selon que le commerçant adhère ou non à l'IOSS. La lecture que j'en ai faite indique que, sans IOSS et sans interface électronique intermédiaire, c'est parfois le client final qui devient redevable de la TVA à l'importation, et parfois le vendeur, selon que la base d'imposition diffère entre le prix de vente et la valeur déclarée à l'import. **Ce point est technique, récent et je ne suis pas certain d'en avoir une lecture complète : à faire confirmer par un expert-comptable avant le premier envoi**, voir section dédiée.
- **Redevance européenne de frais de gestion sur les petits colis, annoncée au 1er novembre 2026.** Un ordre de grandeur d'environ 2 € par colis a été évoqué par les autorités françaises, mais le montant définitif n'était pas fixé au moment de la rédaction. À revérifier avant le lancement si celui-ci a lieu après le 1er novembre.
- **Rumeur d'une "taxe sur les accessoires de luxe pour animaux" finançant un "Pass Éducation".** Des sources secondaires en évoquent l'existence, mais je n'ai trouvé aucun texte officiel (Légifrance, JORF, service-public.fr) qui la confirme avec un seuil de "luxe" défini. À 24,90 €, le produit de La Sente est de toute façon très loin d'un seuil de luxe probable. **Je ne peux pas confirmer que cette taxe existe réellement ni ses modalités : ne rien budgéter dessus, et revérifier si la gamme monte en prix.**
- **Extension à l'Union européenne.** Le jour où la boutique livre hors de France, il faut le régime des ventes à distance intracommunautaires, le seuil unique de 10 000 €, le guichet OSS, et des CGV traduites.
- **Seuil de franchise TVA** : 85 000 € / 93 500 €, inchangé par le changement de produit.

---

## Le point de fond : distributeur ou importateur, et pourquoi ça change tout

Dans le dossier La Brumerie, la position retenue était simple : Forqan achetait un produit déjà présent sur le marché européen, chez un grossiste établi en France. Il n'était donc que "distributeur" au sens du règlement (UE) 2023/988, avec des obligations allégées (vérifier l'information, relayer les rappels, ne pas mettre en vente un produit dont il sait qu'il est dangereux).

Avec le sourcing AliExpress en expédition directe, ce raisonnement ne tient plus automatiquement. Le fournisseur chinois n'est pas établi dans l'Union européenne. Aucun tiers établi dans l'Union n'importe le produit avant Forqan : c'est la vente elle-même, déclenchée sur sa boutique, qui fait entrer le produit sur le marché français pour la première fois. Les analyses professionnelles consultées sur le dropshipping sont concordantes sur un point : le vendeur reste responsable de la conformité du produit devant le client final, quelle que soit la logistique réellement suivie par les colis, et l'administration a mené des campagnes de contrôle ciblées sur ce secteur précis.

Concrètement, cela veut dire que Forqan doit être en mesure de démontrer, produit par produit :
- qu'il a vérifié une documentation technique minimale (fiche produit du fournisseur, éventuellement un test de sécurité) ;
- qu'un nom et une adresse de contact figurent quelque part dans la chaîne d'information du consommateur (à défaut d'un fabricant clairement identifié sur l'emballage, c'est lui qui doit assumer ce rôle sur sa fiche produit et ses mentions légales) ;
- qu'il a un canal pour recevoir et traiter un signalement de sécurité, et le relayer si besoin.

Ce n'est pas une charge écrasante pour un tapis de léchage en silicone, un produit à risque limité. Mais c'est un changement de posture juridique réel par rapport à l'ancien modèle, et il doit être assumé consciemment plutôt que recopié depuis les pages de La Brumerie où la clause "je suis distributeur, pas importateur" ne sera plus vraie.

---

# TEXTES À PUBLIER

Deux documents complets, réécrits pour La Sente. Les quatre autres documents (conditions d'utilisation, politique de retour, confidentialité, cookies) n'ont pas besoin d'une réécriture intégrale : la liste des remplacements nécessaires figure après les deux textes complets.

Champs à compléter en **MAJUSCULES ENTRE CROCHETS**.

---

## Document 1 : Mentions légales (mis à jour)

```
MENTIONS LÉGALES

Dernière mise à jour : [DATE DE PUBLICATION]

1. ÉDITEUR DU SITE

Le site [lasente.fr, À CONFIRMER APRÈS VÉRIFICATION DE DISPONIBILITÉ] est édité par :

Forqan IBRAHIMI, entrepreneur individuel (EI)
Exerçant sous le nom commercial : La Sente
Adresse : 47 rue du Chemin de Fer, 95800 Cergy, France
Téléphone : +33 7 84 34 10 09
Adresse électronique : [ADRESSE E-MAIL DÉFINITIVE, PAR EXEMPLE contact@lasente.fr]

SIREN : 984 253 591
SIRET du siège : 984 253 591 00015
Inscription au Registre national des entreprises (RNE)
Immatriculation au Registre du commerce et des sociétés de [VILLE DU GREFFE, PROBABLEMENT PONTOISE] sous le numéro [984 253 591 - À CONFIRMER APRÈS BASCULE INSEE DE L'ACTIVITÉ]
Code APE : [CODE APE APRÈS MODIFICATION, ACTIVITÉ COMMERCIALE, PAR EXEMPLE 47.91B]
Numéro de TVA intracommunautaire : FR81984253591

TVA non applicable, article 293 B du code général des impôts. [SOUS RÉSERVE DE CONFIRMATION ÉCRITE DU SERVICE DES IMPÔTS DES ENTREPRISES, VOIR ANNEXE TVA]

La Sente est un nom commercial. Il ne désigne pas une personne morale distincte. Le vendeur et l'éditeur du site est la personne physique identifiée ci-dessus.

2. DIRECTEUR DE LA PUBLICATION

Forqan IBRAHIMI.

3. HÉBERGEUR DU SITE

Shopify International Limited
The Sidings, 4th Floor, Grand Canal Quay
Dublin D02 E7K8, Irlande
Société immatriculée en Irlande sous le numéro 560279
Site : www.shopify.com

[VÉRIFIER SECTION 13 DE shopify.com/legal/terms LE JOUR DE LA PUBLICATION ET RECOPIER L'ADRESSE EXACTE ALORS EN VIGUEUR]

4. STOCKAGE DES DONNÉES

Les données traitées dans le cadre du service sont stockées par Shopify International Limited et Shopify Inc., aux coordonnées indiquées ci-dessus et à Ottawa, Canada.

5. PROPRIÉTÉ INTELLECTUELLE

L'ensemble des éléments du site, notamment les textes, photographies, illustrations, logos et éléments graphiques créés pour La Sente, est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite.

[SI LE PRODUIT REVENDU PORTE UNE MARQUE DE FABRICANT IDENTIFIABLE SUR L'EMBALLAGE, AJOUTER ICI UNE CLAUSE D'ÉPUISEMENT DES DROITS ÉQUIVALENTE À CELLE DU DOSSIER LA BRUMERIE. À DÉFAUT DE MARQUE IDENTIFIÉE, NE RIEN AJOUTER.]

6. MÉDIATION DE LA CONSOMMATION

Conformément à l'article L612-1 du code de la consommation, le consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant au vendeur.

Médiateur désigné : [NOM DE L'ORGANISME DE MÉDIATION AGRÉÉ, PRIS SUR LA LISTE OFFICIELLE ECONOMIE.GOUV.FR LE JOUR DE L'ADHÉSION]
Adresse : [ADRESSE POSTALE DU MÉDIATEUR]
Site : [SITE INTERNET DU MÉDIATEUR]

La saisine du médiateur suppose que le consommateur ait préalablement adressé une réclamation écrite au vendeur et qu'il n'ait pas obtenu satisfaction, ou soit resté sans réponse, dans un délai de deux mois.

7. IMPORTATION ET CONFORMITÉ DES PRODUITS

Les produits proposés à la vente sur ce site sont expédiés directement par des fournisseurs situés hors de l'Union européenne. Le Vendeur assume, pour chaque référence, les diligences prévues par le règlement (UE) 2023/988 relatif à la sécurité générale des produits, notamment la vérification des informations de sécurité transmises par le fournisseur et la mise à disposition d'un point de contact pour tout signalement relatif à la sécurité d'un produit.

8. CONTACT

Toute question relative au site ou aux commandes peut être adressée à [ADRESSE E-MAIL DÉFINITIVE] ou au +33 7 84 34 10 09, du [JOURS ET HORAIRES D'OUVERTURE].
```

**Notes hors texte.**
- La section 7 est nouvelle par rapport au dossier La Brumerie. Elle documente le changement de posture (distributeur devenu potentiellement importateur) évoqué plus haut. Elle ne remplace pas une vérification réelle produit par produit, elle l'affiche.
- Toutes les autres sections sont identiques dans leur structure au dossier du 25 août : seuls le nom de marque, le domaine, l'adresse e-mail et l'objet de l'activité changent.

---

## Document 2 : Conditions générales de vente (mis à jour, articles modifiés uniquement présentés en entier, les autres inchangés par rapport au dossier du 25 août sont signalés)

```
CONDITIONS GÉNÉRALES DE VENTE

Dernière mise à jour : [DATE DE PUBLICATION]

ARTICLE 1. IDENTIFICATION DU VENDEUR

Les présentes conditions générales de vente régissent les ventes conclues sur le site [lasente.fr] par :

Forqan IBRAHIMI, entrepreneur individuel (EI)
Nom commercial : La Sente
47 rue du Chemin de Fer, 95800 Cergy, France
SIREN 984 253 591, SIRET 984 253 591 00015
RCS [VILLE DU GREFFE] [NUMÉRO RCS]
TVA intracommunautaire FR81984253591
Téléphone : +33 7 84 34 10 09
E-mail : [ADRESSE E-MAIL DÉFINITIVE]

ci-après "le Vendeur".

La Sente est un nom commercial dépourvu de personnalité juridique. Le contrat est conclu avec la personne physique identifiée ci-dessus.

ARTICLE 2. CHAMP D'APPLICATION

2.1. à 2.5. : inchangés par rapport au dossier La Brumerie du 25 août 2026.

ARTICLE 3. PRODUITS

3.1. Le Vendeur propose des accessoires et articles de bien-être pour animaux de compagnie, notamment des tapis de léchage en silicone destinés à occuper et apaiser le chien lors des repas, du bain, du toilettage ou d'une absence.

3.2. Ces produits sont destinés à un usage animalier. Ils ne sont ni des jouets pour enfants au sens de la directive 2009/48/CE, ni des dispositifs médicaux, ni des produits destinés à la consommation humaine.

3.3. Les produits proposés à la vente sont expédiés directement par des fournisseurs situés hors de l'Union européenne, notamment en Chine. Le Vendeur n'est ni le fabricant du produit, ni, selon les cas, un distributeur au sens strict acquérant un produit déjà mis sur le marché européen : il peut assumer la fonction d'importateur au sens du règlement (UE) 2023/988 relatif à la sécurité générale des produits, faute d'un autre opérateur économique établi dans l'Union intervenant avant lui dans la chaîne.

3.4. L'identité du fabricant, lorsqu'elle est connue, ainsi que les informations et avertissements de sécurité disponibles, figurent sur la fiche du produit concerné. À défaut d'identification claire du fabricant sur le produit ou son emballage, le Vendeur assure ce point de contact.

3.5. Les caractéristiques essentielles de chaque produit, notamment ses dimensions, sa matière, son entretien et ses précautions d'usage, sont indiquées sur la fiche produit. Le Client est invité à en prendre connaissance avant de commander.

3.6. Les produits proposés sont conçus pour un usage sous la surveillance du propriétaire de l'animal. En particulier, les tapis à ventouses doivent être retirés si une ventouse se détache ou se fragilise, pour prévenir tout risque d'ingestion par l'animal.

3.7. Les photographies et illustrations sont fournies à titre d'illustration. Des variations mineures de teinte ou de conditionnement peuvent survenir sans que le produit soit non conforme, sous réserve du respect des caractéristiques essentielles annoncées.

3.8. Les produits sont proposés dans la limite des stocks disponibles chez le fournisseur. En cas d'indisponibilité constatée après commande, le Vendeur en informe le Client sans délai et rembourse l'intégralité des sommes versées au plus tard dans les quatorze jours.

ARTICLE 4. PRIX

4.1. Les prix sont indiqués en euros, toutes taxes comprises.

4.2. TVA non applicable, article 293 B du code général des impôts. [SOUS RÉSERVE DE CONFIRMATION ÉCRITE DU SIE, VOIR ANNEXE TVA DU DOSSIER LA BRUMERIE DU 25 AOÛT, TOUJOURS VALABLE]

4.3. Les frais de livraison ne sont pas compris dans le prix affiché des produits. Ils sont indiqués au Client avant la validation de la commande, dans le récapitulatif de commande, et sont ajoutés au prix des produits.

4.4. Le prix total affiché et payé par le Client au moment de la commande inclut, dans la mesure permise par le mode d'expédition retenu par le Vendeur, la taxe sur la valeur ajoutée éventuellement due à l'importation et le droit de douane forfaitaire applicable aux petits envois importés d'un territoire tiers à l'Union européenne. [CETTE PHRASE N'EST VRAIE QUE SI LE VENDEUR UTILISE UNE SOLUTION D'EXPÉDITION CONFORME IOSS OU ÉQUIVALENTE. SI CE N'EST PAS LE CAS AU MOMENT DE LA PUBLICATION, NE PAS PUBLIER CETTE PHRASE ET REMPLACER PAR UNE INFORMATION HONNÊTE SUR LE RISQUE DE FRAIS SUPPLÉMENTAIRES, VOIR ÉCART BLOQUANT B2]

4.5. Le prix applicable est celui affiché sur le site au moment de la validation de la commande.

4.6. Toute annonce de réduction de prix indique le prix antérieur, qui est le prix le plus bas pratiqué par le Vendeur à l'égard de tous les consommateurs au cours des trente derniers jours précédant l'application de la réduction.

ARTICLE 5. COMMANDE

Inchangé par rapport au dossier La Brumerie du 25 août 2026.

ARTICLE 6. PAIEMENT

Inchangé, sous réserve de mettre à jour la liste des moyens de paiement activés le cas échéant.

ARTICLE 7. LIVRAISON

7.1. Les produits sont expédiés directement par les fournisseurs du Vendeur, situés hors de l'Union européenne, notamment en Chine. La livraison est effectuée à l'adresse indiquée par le Client lors de la commande.

7.2. Modes de livraison proposés et frais applicables :

[MODE DE LIVRAISON, PAR EXEMPLE ENVOI POSTAL INTERNATIONAL SUIVI] : [MONTANT] €

7.3. Délai de préparation chez le fournisseur : [NOMBRE] jours ouvrés à compter de la validation de la commande.

7.4. Délai d'acheminement international indicatif : [NOMBRE RÉEL DE JOURS, TYPIQUEMENT ENTRE 10 ET 25 JOURS CALENDAIRES DEPUIS LA CHINE SELON LE TRANSPORTEUR RETENU, À CONFIRMER AVANT PUBLICATION, NE JAMAIS RECOPIER UN DÉLAI DOMESTIQUE FRANÇAIS].

7.5. Le Vendeur s'engage à livrer au plus tard le [DATE OU DÉLAI MAXIMAL ANNONCÉ AU CLIENT AVANT VALIDATION DE LA COMMANDE]. À défaut d'indication, la livraison intervient au plus tard trente jours après la conclusion du contrat, conformément à l'article L216-1 du code de la consommation.

7.6. à 7.11. : inchangés dans leur principe par rapport au dossier La Brumerie du 25 août 2026 (responsabilité de plein droit du Vendeur pour la livraison, transfert du risque à la remise au Client, gestion des colis perdus ou endommagés).

7.12. Le Client est informé que le franchissement de la frontière douanière de l'Union européenne peut entraîner l'application d'une taxe sur la valeur ajoutée à l'importation et d'un droit de douane forfaitaire pour les envois de valeur inférieure à 150 euros en provenance d'un pays tiers. [SI CES MONTANTS SONT INTÉGRÉS AU PRIX AFFICHÉ (SOLUTION IOSS), SUPPRIMER CETTE CLAUSE ET LA REMPLACER PAR UNE MENTION CONFIRMANT QUE LE PRIX EST DÉFINITIF. SI CE N'EST PAS LE CAS, CETTE INFORMATION DOIT APPARAÎTRE AVANT LA VALIDATION DE LA COMMANDE, PAS SEULEMENT DANS LES CGV.]

ARTICLE 8. DROIT DE RÉTRACTATION

8.1. à 8.4. : inchangés par rapport au dossier La Brumerie du 25 août 2026 (délai de quatorze jours, point de départ à la réception, fonctionnalité en ligne obligatoire, formulaire type).

8.5. Le Vendeur n'applique aucune exception au droit de rétractation. En particulier, il ne se prévaut pas de l'exception prévue au 5° de l'article L221-28 du code de la consommation relative aux biens descellés pour des raisons d'hygiène ou de santé. Un produit utilisé peut donc être retourné, sous réserve de la déduction pour dépréciation prévue à l'article L221-23 et détaillée dans la Politique de retour, notamment lorsque le produit a été souillé par de la nourriture ou de la salive animale et ne peut raisonnablement plus être remis en vente.

8.6. Formulaire type de rétractation : inchangé, mettre à jour le nom commercial et l'adresse e-mail.

ARTICLE 9. GARANTIES LÉGALES

Inchangé par rapport au dossier La Brumerie du 25 août 2026, y compris l'encadré prescrit de l'article D211-2. [CE TEXTE DOIT TOUJOURS ÊTRE COMPARÉ MOT À MOT AVEC L'ANNEXE OFFICIELLE SUR LÉGIFRANCE AVANT PUBLICATION, CETTE VÉRIFICATION N'A PAS ÉTÉ REFAITE DANS CETTE SESSION.]

ARTICLE 10. SÉCURITÉ DES PRODUITS ET CONDITIONS D'USAGE

10.1. Les produits sont destinés à un usage animalier, sous la surveillance du propriétaire de l'animal.

10.2. Le tapis de léchage doit être inspecté avant chaque usage. Toute ventouse détachée, fissurée ou endommagée impose de retirer le produit de l'usage, pour prévenir tout risque d'ingestion par l'animal.

10.3. Le produit doit être nettoyé conformément aux instructions figurant sur la fiche produit avant chaque réutilisation.

10.4. Le Vendeur, en sa qualité d'opérateur économique au sens du règlement (UE) 2023/988, transmet aux autorités compétentes toute information relative à un risque produit dont il aurait connaissance, et relaie sans délai auprès des Clients concernés toute mesure de rappel ou d'avertissement.

ARTICLE 11. RESPONSABILITÉ

Inchangé par rapport au dossier La Brumerie du 25 août 2026.

ARTICLE 12. DONNÉES PERSONNELLES

Inchangé, mettre à jour le nom de domaine et l'adresse e-mail dans la Politique de confidentialité associée.

ARTICLE 13. FORCE MAJEURE

Inchangé.

ARTICLE 14. RÉCLAMATIONS, MÉDIATION ET LITIGES

Inchangé dans sa structure, mettre à jour le nom du médiateur désigné une fois l'adhésion faite.

ARTICLE 15. DISPOSITIONS DIVERSES

Inchangé.
```

**Notes hors texte.**
- L'article 3.3 est la clause la plus importante de cette mise à jour. Elle documente honnêtement le changement de statut plutôt que de recopier la clause "distributeur" de La Brumerie, qui serait fausse ici.
- L'article 4.4 et l'article 7.12 sont volontairement rédigés en deux versions alternatives, parce que la réponse dépend d'une décision opérationnelle qu'Edgar n'a pas encore prise (solution IOSS ou non). Ne pas publier les CGV avant d'avoir tranché ce point, voir écart B2.
- L'article 8.5 reprend la position prudente déjà retenue pour La Brumerie : pas d'exception de principe au droit de rétractation, la protection de la marge passe par la dépréciation documentée, pas par un refus de reprise.

---

## Documents 3 à 6 : remplacements à effectuer (pas de réécriture intégrale nécessaire)

Pour les **Conditions générales d'utilisation**, la **Politique de retour**, la **Politique de confidentialité** et la **Politique de cookies** publiées le 25 août 2026, les remplacements suivants suffisent, section par section :

| Chercher (La Brumerie) | Remplacer par (La Sente) | Où |
|---|---|---|
| "La Brumerie" | "La Sente" | Les 4 documents, toutes occurrences |
| "labrumerie.fr" | "[lasente.fr, à confirmer]" | Les 4 documents |
| "désodorisants textiles parfumés" / "produits parfumés" | "accessoires et articles de bien-être pour animaux de compagnie" | CGU §2, Politique de confidentialité §1 |
| "flacon(s)" | "produit(s)" ou "tapis de léchage" selon le contexte | Politique de retour, section dépréciation (§3) |
| Le paragraphe 3 de la Politique de retour ("Aucun produit n'est exclu"), exemples de dépréciation par flacon | Adapter les exemples : "Tapis retourné non ouvert de son emballage : remboursement intégral. Tapis utilisé, propre : remboursement intégral. Tapis souillé de nourriture ou de salive animale ne pouvant être remis en vente : déduction pouvant atteindre la totalité du prix, documentée par écrit" | Politique de retour §3 |
| "grossistes établis en France" | "fournisseurs situés hors de l'Union européenne" | Politique de confidentialité, s'il y a une mention équivalente au §3 sur les sous-traitants logistiques |
| Section transporteur "[NOM DU TRANSPORTEUR]" | Renseigner le transporteur ou service logistique retenu pour les envois internationaux | Politique de confidentialité §3 |

Aucune autre modification de fond n'est nécessaire sur ces quatre documents : les règles RGPD, le régime des cookies publicitaires et le mécanisme de remboursement restent les mêmes quel que soit le produit vendu.

---

# ANNEXE TVA

Reprendre intégralement l'annexe TVA du dossier La Brumerie du 25 août 2026 (`livrables/boutique/2026-08-25-pages-legales-la-brumerie.md`, section "ANNEXE TVA"). Elle reste valable à l'identique pour le régime domestique de franchise en base.

**Ce qui s'y ajoute avec ce nouveau modèle et que l'ancienne annexe ne couvre pas** : le régime de TVA sur les ventes à distance de biens importés (VADI) est un régime distinct du régime domestique, avec ses propres règles de redevabilité selon que le Vendeur adhère ou non à l'IOSS. Un rescrit BOFiP du 4 mars 2026 (BOI-RES-TVA-000184) traite précisément du cas du dropshipping sans IOSS, mais la lecture que j'en ai faite reste incertaine sur plusieurs points de détail. **Ne pas trancher ce point seul : le faire confirmer par un expert-comptable avant la première commande fournisseur.**

---

# Points nécessitant un professionnel

- **Le statut d'importateur au sens du règlement (UE) 2023/988.** C'est le changement le plus lourd introduit par le nouveau modèle. Un avocat en droit de la consommation ou en droit de la distribution peut confirmer si Forqan doit formellement s'enregistrer ou se déclarer comme importateur, et ce que cela change concrètement pour un produit à risque limité comme un tapis en silicone.
- **Le régime de TVA sur les ventes à distance de biens importés, avec ou sans IOSS.** Le rescrit du 4 mars 2026 est récent et technique. Un expert-comptable doit confirmer si Forqan doit s'enregistrer à l'IOSS, et comment cela s'articule avec sa franchise en base de TVA sur les ventes domestiques.
- **Le montage à deux sur un seul SIRET (Edgar et Forqan).** Point déjà signalé le 25 août, toujours non réglé selon `context/CONTEXT.md`. Risque de requalification en travail dissimulé (art. L8224-1 du code du travail, 3 ans et 45 000 €) ou société créée de fait.
- **L'encadré réglementaire de l'article 9.3 des CGV (garantie légale de conformité).** Toujours pas vérifié mot à mot contre la source officielle Légifrance.
- **La rumeur de taxe sur les accessoires de luxe pour animaux.** Si Edgar envisage une montée en gamme de la marque au-delà de 24,90 €, faire vérifier ce point par un professionnel avant d'y exposer un produit, faute d'avoir trouvé une source officielle exploitable.

---

# Sources

Recherches complémentaires menées le 15 septembre 2026 pour cette mise à jour, en complément des sources déjà citées dans le dossier La Brumerie du 25 août 2026.

**Droit de douane forfaitaire et redevance sur les petits colis**
- [Entrée en vigueur au 1er juillet des droits de douane sur les petits colis à l'échelle de l'UE, presse.economie.gouv.fr](https://presse.economie.gouv.fr/?p=180373)
- [Droit de douane forfaitaire de 3 euros sur les ventes à distance de biens importés, Douane française](https://www.douane.gouv.fr/fiche/droit-de-douane-forfaitaire-de-3-euros-sur-les-ventes-distance-de-biens-importes)
- [Tout savoir sur la taxe sur les petits colis, economie.gouv.fr](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/tout-savoir-sur-la-taxe-sur-les-petits-colis)
- [Réforme douane 2026 : taxe sur les petits colis et frais de gestion, Alliance du Commerce](https://alliancecommerce.org/reforme-douane-taxe-petits-colis-frais-gestion/)

**TVA et dropshipping**
- [Rescrit BOI-RES-TVA-000184, ventes à distance de biens importés sans IOSS, BOFiP](https://bofip.impots.gouv.fr/bofip/14482-PGP.html/identifiant=BOI-RES-TVA-000184-20260304)

**Sécurité générale des produits et dropshipping**
- [Règlement (UE) 2023/988 relatif à la sécurité générale des produits, obligations des importateurs, Le Monde du Droit](https://www.lemondedudroit.fr/decryptages/92057-securite-produits-consommation-reglement-ue-2023-988-10-mai-2023-fabricant-importateur.html)
- [Dropshipping, gare aux mirages !, DGCCRF, economie.gouv.fr](https://www.economie.gouv.fr/dgccrf/actualites-dgccrf/dropshipping-gare-aux-mirages)

**Droit de rétractation, jurisprudence Slewo**
- [Article L221-28 du code de la consommation, Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170)
- [Achat d'un matelas sur internet descellé après livraison : rétractation possible, INC](https://www.inc-conso.fr/content/achat-dun-matelas-sur-internet-descelle-apres-livraison-retractation-possible)

**Taxe sur les accessoires de luxe pour animaux (non confirmée officiellement)**
- Recherches de surface menées, aucune source officielle (Légifrance, JORF, service-public.fr) trouvée pour confirmer l'existence et les modalités exactes de cette taxe. À traiter comme non vérifié.

**Dossier antérieur repris intégralement pour les points inchangés**
- `livrables/boutique/2026-08-25-pages-legales-la-brumerie.md`
- `livrables/boutique/2026-09-14-marque-la-flanerie.md`
- `context/CONTEXT.md`, mise à jour du 14 septembre 2026
