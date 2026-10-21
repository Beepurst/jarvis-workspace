# Prompt de construction : Garnier Plomberie Chauffage (One page)

> À coller dans une session ouverte avec `/site test-garnier-plomberie`.
> Direction validée par le client sur la planche V1 (`planche.png` dans ce dossier). Toute la direction est ici : ne lis rien d'autre.

---

## Cible

- Projet Framer **TEST-CLAUDE**, nouvelle page **`/garnier-plomberie`**. Ne touche à aucune autre page du projet.
- Site **One page** d'un plombier chauffagiste fictif à Osny (95). **Entreprise fictive, site de démonstration** : bandeau en haut et mention dans le pied de page obligatoires.
- Le but du site : **faire appeler**. Le bouton principal ouvre `tel:+33199004217` partout.
- 3 tailles : bureau 1440, tablette 810, mobile 390.

## Direction

- **Ambiance :** rassurant, sobre, dynamique. Clair. Beaucoup d'air, des blocs nets, coins légèrement arrondis (8 px).
- **Couleurs :**
  - fond `#F6F7F9`, blanc `#FFFFFF` pour les cartes ;
  - texte et titres `#16324F` (bleu nuit) ;
  - liens et icônes `#1F5FA8` (bleu camion) ;
  - bouton Appeler `#F08A24` avec texte `#16324F` (contraste 5,2) ;
  - texte secondaire `#5B6573`.
  - **Aucun rouge**, demande du client. Le texte orange sur fond clair est interdit (contraste insuffisant).
- **Polices :** titres Plus Jakarta Sans 700, texte Inter 400, sans italique. Pas d'autre graisse.
- **Animations :** presque aucune. Survols des boutons et des cartes de services. Une seule apparition, sur la rangée de photos des services. Rien sur l'accroche, rien sur les listes, les avis ni la FAQ.
- **Mobile :** barre fixe en bas d'écran avec le bouton « Appeler le 01 99 00 42 17 », sur toute la page. Menu burger en balise `button`.

## Images (Unsplash, libres de droits)

| Usage | URL | Taille d'import |
|---|---|---|
| Accroche : cuivre posé dans le mur | `https://images.unsplash.com/photo-1694827893591-af9b80361599` | 1200 px, version mobile sous 80 Ko |
| Service dépannage | `https://images.unsplash.com/photo-1676210134190-3f2c0d5cf58d` | 1000 px |
| Service chaudière (radiateur) | `https://images.unsplash.com/photo-1518276779712-dfdcb9daa7a1` | 1000 px |
| Service salle de bain | `https://images.unsplash.com/photo-1584622650111-993a426fbf0a` | 1000 px |
| Service pompe à chaleur | `https://images.unsplash.com/photo-1776860155275-eee24bfb1dee` | 1000 px |

Ajoute `?fm=jpg&q=75&w=<taille>&fit=crop` à chaque URL. 5 images en tout, aucune autre.

## Sections et textes (définitifs, à reprendre mot pour mot)

### 1. Bandeau de démonstration
Fine bande bleu nuit, texte blanc, petit :
> Site de démonstration réalisé par Kleak Agency. Garnier Plomberie Chauffage est une entreprise fictive.

### 2. En-tête (`header`, `nav`)
- À gauche, le nom en texte : **Garnier** en Plus Jakarta Sans, puis « Plomberie Chauffage » en Inter, plus petit. Pas de logo.
- Liens : Services, Avis, Zone, Questions (ancres).
- À droite : bouton orange « Appeler ».

### 3. Accroche
Deux colonnes sur bureau : texte à gauche, photo du cuivre à droite. Sur mobile : texte d'abord, photo dessous.
- Petite ligne au-dessus du titre : « Urgences 7 jours sur 7 »
- Titre (H1) : **Plombier chauffagiste à Osny et 20 km autour.**
- Sous-titre : Dépannage, chaudière, salle de bain, pompe à chaleur. Devis gratuit, prix annoncé avant de commencer.
- Bouton orange : **Appeler le 01 99 00 42 17**
- Lien secondaire : Demander un devis (ancre vers le formulaire)

### 4. Trois engagements
Trois colonnes, une icône simple en bleu camion par colonne.
- **Prix annoncé avant de commencer.** Le devis est gratuit, et vous connaissez le prix avant le début des travaux.
- **Vous tombez sur moi.** Je réponds au téléphone moi-même.
- **Artisan RGE.** Travaux garantis. *(mention « exemple » en petit, l'entreprise est fictive)*

### 5. Services (ancre `services`)
Titre : **Ce que je fais**
Quatre cartes avec photo :
- **Dépannage plomberie** : Fuite, WC bouché, ballon d'eau chaude en panne. Urgences 7 jours sur 7.
- **Chaudière** : Entretien annuel obligatoire et réparation, gaz et fioul.
- **Salle de bain** : Rénovation complète, douche à l'italienne, adaptation pour les personnes âgées.
- **Pompe à chaleur** : Installation par un artisan RGE.

### 6. Avis (ancre `avis`)
- Gros chiffre : **4,8 sur 5**, « 63 avis Google »
- Trois avis en cartes :
  - « Venu le dimanche pour une fuite sous l'évier, prix annoncé au téléphone et respecté. » Monique, Pontoise
  - « Salle de bain refaite en 8 jours, chantier propre. » Karim, Osny
  - « Enfin un plombier qui rappelle. » Julie, Cergy
- En petit sous la section : Avis présentés à titre d'exemple, entreprise fictive.

### 7. Zone et horaires (ancre `zone`)
Deux blocs côte à côte. Pas de carte interactive.
- **Zone d'intervention** : Osny, Pontoise, Cergy et 20 km autour.
- **Horaires** : Du lundi au vendredi, de 8 h à 18 h. Urgences 7 jours sur 7.

### 8. Questions fréquentes (ancre `questions`)
Accordéon, la première ouverte.
- **Combien coûte un dépannage ?** Ça dépend de la panne. Le devis est gratuit et je vous donne le prix avant de commencer.
- **Vous venez le week-end ?** Oui, pour les urgences, 7 jours sur 7.
- **Ai-je droit à des aides pour une pompe à chaleur ?** Ça dépend de votre situation. Les aides de l'État demandent un artisan RGE. Les conditions sont sur france-renov.gouv.fr.
- **Combien de temps pour refaire une salle de bain ?** Ça dépend de la salle de bain. La durée est indiquée sur le devis.

### 9. Appel final et formulaire (ancre `devis`)
Fond bleu nuit, texte blanc. Deux colonnes sur bureau.
- Titre : **Appelez-moi au 01 99 00 42 17.**
- Texte : Ou laissez votre numéro, je vous rappelle.
- Bouton orange : Appeler
- Formulaire Framer : Nom, Téléphone, Votre besoin (texte libre), bouton « Envoyer ». Sous le bouton, en petit : Vos coordonnées servent uniquement à vous recontacter. Voir la politique de confidentialité.

### 10. Pied de page (`footer`)
- Garnier Plomberie Chauffage, Osny (95). 01 99 00 42 17. contact@garnier-plomberie.example
- Liens : Mentions légales, Politique de confidentialité (pages non créées pour le test, liens vers `#`).
- Site de démonstration, entreprise fictive. Réalisé par Kleak Agency.

## Fin de construction

1. Publie et donne l'adresse de la page.
2. Une capture bureau et une capture mobile de la page entière, réduites à 1000 px.
3. Liste ce qui a dévié de ce prompt, et pourquoi.
4. Note l'heure de début et l'heure de fin dans `livrables/clients/test-garnier-plomberie/suivi-test.md`, ligne « Construction ».
