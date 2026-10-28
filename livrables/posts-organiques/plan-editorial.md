# Plan éditorial des posts organiques

Tenu par l'agent `createur-posts`. Lu par `build.mjs --grille` et `deposer.mjs`.

## Format du tableau (ne pas changer l'en-tête, les scripts le cherchent tel quel)

| Colonne | Contenu |
|---|---|
| id | Identifiant du post, le même que la clé de `POSTS` dans `build.mjs`. Minuscules et tirets : `s3-avis-meline`, `l2-conseil-mentions`. |
| type | `realisation`, `avis` ou `conseil`. |
| prévu (Paris) | `2026-11-03 12:30`, heure de Paris. `à fixer` tant qu'aucune date n'est choisie : `deposer.mjs` refuse. 12 h 30 par défaut. |
| statut | Statut local : `proposé` (rédigé, pas déposé), `à confirmer par Edgar` (matière à confirmer, ni rendu ni dépôt), `déposé` (écrit par `deposer.mjs`), `corrigé` (redéposé avec `--correction`), `publié` (relevé dans le hub). Le statut qui fait foi après dépôt est celui du hub. |
| id hub | Rempli par `deposer.mjs` après le dépôt. Sert à `--correction`. Vide avant. |
| texte | Le texte sous le post, sur une seule ligne. `<br>` pour un retour à la ligne, `\|` pour une barre verticale. |

Ordre du tableau = ordre de publication. La grille Instagram l'affiche à l'envers (le dernier en haut à gauche) : jamais deux posts du même type de suite.

## Posts

| id | type | prévu (Paris) | statut | id hub | texte |
|---|---|---|---|---|---|
| s1-realisation-asa | realisation | 2026-10-29 12:30 | déposé | 32118524-0b60-4c0a-8b92-6a40446aa9a3 | Le site d'Accueil Sénior Assistance, aide à domicile pour les personnes âgées. Les familles trouvent les services et le numéro dès la première page, sur ordinateur comme sur téléphone. |
| s2-conseil-telephone | conseil | 2026-10-31 12:30 | déposé | be8bb830-349f-4afc-9c90-25c31ee4a499 | Ouvrez votre site sur votre téléphone et vérifiez ces points. |
| s3-avis-meline | avis | 2026-11-03 12:30 | déposé | 6b15268c-fb8c-4747-b716-94163ba01ad0 | Merci Méliné et toute l'équipe Mac Alyster pour ce retour. |
| s4-conseil-fiche-google | conseil | 2026-11-05 12:30 | déposé | 8a06c928-a796-4f8d-9f1e-55e8b199c9ed | Horaires, réponses aux avis, lien vers le site : les points à regarder sur votre fiche Google. |
| s7-avis-aurore | avis | 2026-11-07 12:30 | déposé | 3d862a01-4480-4b2d-9713-c100ca4633e0 | Merci Aurore pour ce retour sur le site de Frenchies in Maldives. |
| s6-realisation-macalyster | realisation | 2026-11-10 12:30 | déposé | f1c813e6-db81-4d45-baec-6428ecc3be60 | Le site de Mac Alyster, marque parisienne de sacs et de bagages. Les nouveautés et les précommandes sont en tête de la page d'accueil. |
| s5-avis-laura | avis | 2026-11-12 12:30 | déposé | 6cfab692-f2a1-4b25-ac2a-6c6c278d8c01 | Merci Laura pour ce retour. |
| s8-realisation-frenchies | realisation | 2026-11-14 12:30 | déposé | 60fc9572-f81a-472e-bd78-f8adcd07929d | Le site de Frenchies in Maldives, voyages en petit groupe sur une île locale des Maldives, en français. Les séjours, les activités et les offres se trouvent depuis le menu. |
| s9-conseil-accueil | conseil | 2026-11-17 12:30 | déposé | 6f015cba-835b-4fca-b46d-f94b34a67d67 | Relisez votre page d'accueil avec ces points en tête. |

Ordre en diagonale : dans la grille à 3 colonnes (le dernier en haut à gauche), les lignes sont s9 s8 s7 / s6 s5 s4 / s3 s2 s1, soit C R A / R A C / A C R. Aucune colonne n'empile le même type, et jamais deux types identiques de suite.

`s6` et `s8` : Mac Alyster et Frenchies in Maldives confirmés par Edgar le 28/10 comme réalisations montrables. Mega Content n'est pas montré en réalisation. Les avis de Laura et d'Aurore ont été échangés (Aurore en 5e, Laura en 7e) pour séparer l'avis et la réalisation d'un même client : Mac Alyster s3 et s6, Frenchies 5e et s8.

## Déjà montré

Pour ne pas se répéter. À tenir à jour à chaque dépôt.

- **Réalisations** : Accueil Sénior Assistance (s1) ; Mac Alyster (s6) ; Frenchies in Maldives (s8). Mega Content : jamais en réalisation.
- **Avis** : Méliné Grelet, Mac Alyster (s3) ; Aurore Melis, Frenchies in Maldives (5e, id s7) ; Laura Dias, Mega Content (7e, id s5). Après s7, les trois avis réels ont tous été montrés : un nouvel avis ne vient que d'un vrai client.
- **Sujets de conseils** : le site sur téléphone (numéro visible, texte lisible, page rapide en 4G) (s2) ; la fiche Google (horaires, réponses aux avis, lien vers le site) (s4) ; la page d'accueil (ce que vous faites, où vous intervenez, le contact dans le menu) (s9).
- **Sujets en réserve** (sans chiffre inventé) : mentions légales et bandeau cookies ; les photos du site (vraies photos plutôt que banque d'images) ; le formulaire de contact (le tester soi-même, savoir où arrivent les messages) ; le nom de domaine et l'adresse email à son nom.
