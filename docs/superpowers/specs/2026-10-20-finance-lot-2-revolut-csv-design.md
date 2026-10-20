# Onglet Finance, lot 2 : dépenses Revolut Pro par import de relevé CSV

Date : 20 octobre 2026. Complète la spec `2026-10-19-finance-design.md` (lot 1, Stripe, en production).
Seul ce qui change par rapport à cette spec est décrit ici ; tout le reste s'applique tel quel.

## 1. Pourquoi ce lot change

La spec du 19/10 prévoyait un compte **Revolut Business** et son API. Edgar a finalement ouvert un
compte **Revolut Pro**, rattaché à son compte Revolut personnel. Revolut n'offre pas d'API publique
pour les comptes personnels, et l'open banking par agrégateur (Powens, Bridge…) a été écarté :
payant, couverture du compte Pro non confirmée, consentement à renouveler. Décision d'Edgar du
20/10 : **import manuel du relevé CSV**, une fois par mois environ.

Le compte Pro a **son propre IBAN, séparé du perso** (confirmé par Edgar) et ne sert qu'à Kleak.
Il était vide au 20/10.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectif.** Que la carte Dépenses, le Net, le graphique, les derniers mouvements et
« Dépenses par poste » reflètent les vraies sorties d'argent de l'agence, à partir d'un relevé
qu'Edgar dépose **depuis l'app du hub sur son iPhone** (il télécharge le relevé sur son téléphone).

**Non-objectifs.** Pas de synchronisation automatique avec Revolut, pas d'agrégateur, pas de
comptabilité, pas de rapprochement facture par facture (inutile, voir 4).

**Anti-objectifs** (raté même si ça « marche ») :
- une même ligne comptée deux fois parce qu'Edgar a importé deux relevés qui se recoupent ;
- un versement Stripe ou un apport d'Edgar compté en chiffre d'affaires ;
- un virement d'Edgar vers son compte perso ou le prélèvement URSSAF réel compté en dépense ;
- un import à moitié fait (fichier Excel, PDF ou mal formé) qui laisse des données partielles ;
- une correction de poste faite à la main écrasée par l'import suivant ;
- **la publicité comptée deux fois** : une fois par la dépense Meta, une fois par le prélèvement
  Meta sur le relevé Revolut (voir 11).

## 3. Le fichier

En-tête réel du relevé CSV Revolut Pro (export du 19/10, en anglais, sans aucune ligne) :

```
Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance
```

Ce que l'on sait des valeurs vient du format connu des relevés Revolut, **pas d'une vraie ligne
du compte Pro** (il était vide). Hypothèses à vérifier sur le premier relevé réel :
- `Type` : `CARD_PAYMENT`, `TRANSFER`, `TOPUP`, `FEE`, `CARD_REFUND`, `REFUND`, `EXCHANGE`… ;
- `State` : `COMPLETED`, `PENDING`, `REVERTED`, `DECLINED`, `FAILED` ;
- dates au format `AAAA-MM-JJ HH:MM:SS` ;
- `Amount` signé avec un point décimal (négatif pour une sortie), `Fee` positif à part ;
- `Description` : nom du marchand ou du correspondant du virement.

Conséquence pour le builder : le lecteur reconnaît le fichier **par son en-tête exact** (colonnes
dans n'importe quel ordre acceptées, choix de Claude), gère les guillemets CSV, et refuse
proprement tout le reste. Le premier vrai relevé servira de jeu de test réel ; la lecture doit
être isolée dans une fonction pure facile à ajuster.

Le CSV n'a **pas d'identifiant de transaction**. L'identifiant d'une ligne est construit à partir
des champs qui ne bougent pas entre deux relevés (choix de Claude) : `revolut:` + empreinte de
Type, Started Date, Description, Amount, Currency, plus un rang d'occurrence quand deux lignes du
même fichier ont exactement ces mêmes valeurs (deux paiements identiques à la même seconde).
`State`, `Completed Date`, `Fee` et `Balance` n'en font **pas** partie, car ils peuvent changer
entre un relevé et le suivant.

**Un relevé plus récent met à jour les lignes qu'il contient** (choix de Claude) : une ligne déjà
importée qui réapparaît avec un autre état (par exemple `REVERTED`) est mise à jour et cesse de
compter, et le compte rendu l'indique (« lignes mises à jour »). Sa correction manuelle éventuelle
est conservée. Une ligne absente d'un relevé plus récent n'est **pas** retirée : un relevé peut
couvrir une autre période. Ce modèle est à revoir sur le premier vrai relevé si Revolut se
comporte autrement.

## 4. Règles de classement (validées par Edgar le 20/10)

Tous les clients paient par Stripe (confirmé par Edgar). Le brut vient donc **uniquement de
Stripe**. Cela remplace la règle de la spec du 19/10 qui comptait en brut les entrées Revolut sans
facture.

- **Seules les lignes `COMPLETED` comptent.** En attente, annulées, refusées : ignorées.
- **Rien avant la date de départ** des Réglages (15/10/2026 par défaut), sur la date de fin
  d'opération (choix de Claude ; date de début si la fin est vide).
- **Sortie** (montant négatif) = dépense, classée dans un poste.
- **Frais Revolut** (colonne `Fee` non nulle, ou ligne de type frais) = dépense, poste
  « Banque et frais » (choix de Claude).
- **Entrées :**
  - versement Stripe : mouvement interne, exclu ;
  - apport d'Edgar depuis son compte perso : mouvement interne, exclu ;
  - remboursement fournisseur (Meta, Framer…) : vient en déduction des dépenses de son poste ;
  - toute autre entrée : **jamais comptée en brut**, affichée « à vérifier », reclassable.
- **Sorties exclues des dépenses :**
  - virement d'Edgar vers son compte perso (sa rémunération) : interne, exclu ;
  - prélèvement URSSAF : classé « Cotisations », exclu des dépenses (l'estimation à 21,2 % reste
    la seule déduite).
- **Change de devise** (`EXCHANGE`) : interne, exclu. Une dépense dans une autre devise que l'euro
  est signalée « à vérifier » (cas improbable, le compte est en euros ; choix de Claude).

Comment reconnaître Stripe, URSSAF, un apport ou un virement perso dans `Description` : au builder,
par des règles simples sur le libellé et le type, toutes modifiables par la correction manuelle
(voir 6). En cas de doute, « à vérifier » plutôt qu'une supposition.

## 5. Postes de dépense (validés par Edgar le 20/10)

| Poste | Reconnu automatiquement (exemples) |
|---|---|
| Publicité | Meta, Facebook |
| Outils et abonnements | Framer, Vercel, Supabase, Cal.com, Brevo, Claude / Anthropic, IONOS |
| Banque et frais | frais Revolut |
| Matériel | aucun par défaut |
| Formation | aucun par défaut |
| Déplacements | aucun par défaut |
| Autre | tout ce qui n'est reconnu par aucune règle |

Plus deux classements hors dépenses, pour la correction manuelle : **Interne (exclu)** et
**Cotisations**.

## 6. Correction manuelle

Edgar peut changer le poste (ou le classement) d'une ligne Revolut, depuis l'iPhone comme depuis
le Mac. Deux effets (validés par Edgar) :
- la ligne garde ce choix, **même si un relevé la réimporte** ;
- le hub **retient le fournisseur, de façon rétroactive** (décision d'Edgar du 20/10) : toutes
  les lignes du même fournisseur, déjà importées comme à venir, reçoivent ce poste, sauf celles
  qu'Edgar a corrigées une par une. Ordre de priorité : correction de la ligne, puis choix retenu
  pour le fournisseur, puis règles automatiques. Le classement se calcule donc à partir de ces
  trois niveaux, pas une fois pour toutes à l'import. Comment on identifie « le même
  fournisseur » à partir de `Description` est laissé au builder (libellé normalisé, par exemple).

Une ligne « à vérifier » sort de cet état dès qu'Edgar la classe.

## 7. L'import, côté Edgar

- Dans l'onglet Finance, un bouton **« Importer un relevé »**, utilisable dans l'app iPhone du hub
  (installée sur l'écran d'accueil) comme sur le Mac. Il ouvre le sélecteur de fichiers d'iOS ;
  Edgar choisit le CSV enregistré depuis l'app Revolut dans Fichiers.
- Limite à connaître : une app web ne peut pas apparaître dans le menu « Partager » de Revolut sur
  iOS. Le passage par Fichiers est obligatoire. Une phrase d'aide sous le bouton le dit.
- Après l'import, un **compte rendu court** : lignes ajoutées, déjà présentes, mises à jour, ignorées (en
  attente, annulées, internes, avant la date de départ), et nombre de lignes « à vérifier » avec
  un accès direct à celles-ci.
- **Tout ou rien** : un fichier qui n'est pas un CSV Revolut (export Excel ou PDF choisi par
  erreur, en-tête différent, ligne illisible) est refusé avec un message clair qui dit quoi faire
  (« Choisis le format CSV dans Revolut »), et rien n'est enregistré.
- Réimporter un relevé qui recoupe le précédent ne crée **aucun doublon**.
- Relevé vide (comme au 20/10) : accepté, compte rendu « aucune opération », date d'import
  enregistrée.

## 8. Ce que la page affiche une fois le lot en place

- **Carte Dépenses** : la vraie somme (sorties Revolut classées en dépenses, moins les
  remboursements, plus les frais Stripe), avec en détail la date du dernier import, par exemple
  « relevé importé le 3 nov. ». Avant tout premier import : le texte actuel, adapté
  (« Aucun relevé Revolut importé »), et le Net garde la mention « avant dépenses Revolut ».
- **Net** : libellé normal dès qu'au moins un relevé a été importé.
- **Dépenses par poste** : remplace l'état « pas encore branché ». Total par poste sur la période,
  du plus gros au plus petit, et accès aux lignes d'un poste pour les corriger. Les lignes
  « à vérifier » sont mises en avant tant qu'il y en a.
- **Derniers mouvements** et **graphique** : incluent les lignes Revolut qui comptent (dépenses et
  remboursements), pas les mouvements internes ni les cotisations.
- **Relevé ancien** (choix de Claude) : si le dernier import date de plus de 35 jours, un bandeau
  orange invite à importer le relevé du mois, sur le modèle du bandeau de synchro Stripe périmée.
- Le sous-titre de l'en-tête et la mention « Revolut Business » de la page deviennent
  « Revolut Pro ».

Habillage : composants et classes existants du hub (`hub-verre`, `hub-groupe`, `hub-ligne`,
`hub-bandeau`, `NotConnected`), sans toucher à `theme.css` ni `globals.css`. Les tests de couleurs
et de contraste existants doivent continuer à passer.

## 9. Contraintes techniques connues

- Code dans `livrables/hub-agence/` (dépôt `Beepurst/hub-agence-kleak`, indépendant du
  workspace). Travailler sur une branche, fusionner dans `main` après validation d'Edgar : chaque
  push sur `main` déploie en production.
- La table `finance_mouvements` accepte déjà `source = 'revolut'` et a une colonne `poste`. Les
  calculs (`src/lib/finance/calculs.ts`) additionnent aujourd'hui toutes les entrées en brut et
  toutes les sorties en dépenses : il faudra leur faire ignorer les lignes internes, cotisations et
  « à vérifier », et traiter les remboursements de fournisseur. Le schéma à ajouter (classement,
  correction manuelle, règles par fournisseur, date du dernier import) est au builder, en SQL
  idempotent dans `supabase/`, à exécuter par Edgar avant le déploiement comme pour le lot 1.
- La purge par date de départ du lot 1 ne touche que Stripe ; une date de départ avancée doit
  aussi masquer ou retirer les lignes Revolut antérieures, **sans perdre les corrections
  manuelles** si Edgar la recule ensuite (choix de Claude : masquer plutôt que supprimer).
- L'envoi du fichier passe par une route du hub, derrière la même protection par mot de passe que
  le reste. Le fichier est lu côté serveur et n'est pas conservé (seules les lignes le sont).
- Rien ne change pour Stripe, le cron et le bouton Actualiser.

## 10. Laissé au builder

- Le schéma exact et l'identifiant de ligne.
- Les règles de reconnaissance (Stripe, URSSAF, apports, virements perso, fournisseurs connus).
- Le parcours de correction sur iPhone (feuille, menu, page dédiée).
- Les textes exacts du compte rendu et des erreurs, en français simple et sans tiret long.

## 11. Dépenses publicitaires lues chez Meta (ajout d'Edgar du 20/10)

À livrer dans ce lot, avant la mise en production.

**Décisions d'Edgar :**
1. Les dépenses publicitaires viennent de Meta, en continu, et **Meta fait foi** pour le poste
   Publicité.
2. On compte le **montant dépensé** dans le Gestionnaire de publicités (`spend` de l'API Insights,
   par jour), pas le montant prélevé par Meta.
3. **Dès que la source Meta est branchée**, les lignes Facebook / Meta du relevé Revolut sont
   exclues des dépenses : nouveau classement **« couvert par Meta »**, hors dépenses, visible et
   reclassable comme « interne ». Tant que Meta n'est pas branché, la règle actuelle s'applique
   (ligne Revolut, poste Publicité).

**Synchronisation :**
- Dans le **cron quotidien Finance** et le **bouton Actualiser** existants, à côté de Stripe. Une
  panne Meta ne bloque pas Stripe, et inversement.
- Stockée dans `finance_mouvements` : source `meta`, sortie, poste Publicité, **une ligne par jour
  et par compte publicitaire**, identifiant stable (par exemple `meta:<compte>:<AAAA-MM-JJ>`) pour
  réécrire un jour déjà synchronisé. Plage : de la date de départ des Réglages à aujourd'hui.
- **Meta fait foi sur la plage lue** (choix de Claude) : un jour synchronisé qui n'apparaît plus
  dans la réponse de Meta est retiré. Cela ne se fait qu'après une lecture complète réussie.
- Un compte qui n'a encore **aucune dépense** (cas du 20/10) : synchro réussie, aucune ligne,
  Publicité à 0 € réel, sans erreur.
- Devise du compte autre que l'euro : la synchro échoue avec un message clair (choix de Claude).

**Affichage :**
- **« Indisponible » plutôt que 0 €** : si Meta est branché mais n'a jamais été synchronisé avec
  succès, les cartes Dépenses et Net affichent « Indisponible » (le brut reste affiché).
- **Dernière synchro Meta** mentionnée dans l'en-tête de la page, à côté de Stripe et du relevé
  Revolut. Si elle date de plus de 36 h, bandeau orange sur le modèle de celui de Stripe (même
  seuil, choix de Claude).
- Les lignes Meta comptent dans les cartes, le graphique et « Dépenses par poste » (Publicité).
  **Elles n'apparaissent pas dans « Derniers mouvements »** (choix de Claude : une ligne par jour
  noierait les autres mouvements).
- Les lignes Revolut « couvert par Meta » sont listées sous ce libellé dans la page de détail
  Revolut et peuvent être reclassées. Priorité (choix de Claude) : la correction d'une ligne passe
  avant « couvert par Meta », qui passe avant le choix retenu pour le fournisseur. Ainsi une règle
  fournisseur « Publicité » posée avant le branchement de Meta ne réintroduit pas de double
  comptage.

**Accès (choix de Claude, à valider par Edgar) :**
- Le module Ads (worktree `livrables/hub-agence-ads`, non fusionné) a déjà un client Meta en
  lecture seule (`src/lib/ads/meta-graph.ts`, jeton masqué dans tous les messages) et prévoit un
  **utilisateur système** du Business Manager avec un jeton large (`ads_management`, etc.) dans
  `HUB_META_ADS_ACCESS_TOKEN`.
- Pour ne pas faire deux branchements, Finance **reprend ce client à l'identique** (même fichier,
  même chemin, pour que la fusion du module Ads se fasse sans conflit) et **le même compte
  publicitaire** (`HUB_META_ADS_ACCOUNT_ID`).
- Pour rester en lecture seule, Finance utilise **son propre jeton**, généré pour le même
  utilisateur système avec la seule permission **`ads_read`** : variable
  **`HUB_META_FINANCE_ACCESS_TOKEN`**. « Meta branché » = ces deux variables présentes.
