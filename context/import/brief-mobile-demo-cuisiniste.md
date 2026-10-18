# Brief mobile : Atelier Hauteville

> Complément de `brief-demo-cuisiniste.md`. La page d'accueil est construite, la version mobile doit être reprise.
> Site Webflow : `demo-cuisine`.

---

## Principe

Dans Webflow, les styles se posent sur le breakpoint de base (desktop) et descendent en cascade vers tablette (991 px), mobile paysage (767 px) et mobile portrait (478 px). On ne refait donc pas tout : on corrige **sur chaque breakpoint inférieur**, de la tablette vers le portrait, et seulement ce qui casse.

- Modifier les **classes existantes** au breakpoint concerné, jamais créer des classes "mobile" en double.
- Aucun style posé élément par élément.
- Le contrôle de référence est le **mobile portrait à 375 px de large** (iPhone courant), puis 478 px.

## Règles communes à toutes les sections

| Élément | Règle mobile portrait |
|---|---|
| Marges latérales | 20 px de chaque côté, jamais de contenu collé au bord |
| Espacement vertical des sections | 64 à 80 px (contre 120 px et plus sur desktop) |
| Titre H1 | 34 à 40 px, interligne 1,1 |
| Titres H2 | 28 à 32 px |
| Texte courant | 16 px minimum, interligne 1,5 |
| Grilles et colonnes | Une seule colonne |
| Boutons | Pleine largeur, hauteur 48 px minimum (zone de clic au doigt) |
| Images | Largeur 100 %, hauteur maîtrisée (object-fit cover), jamais de débordement |
| Défilement horizontal | Aucun. C'est le premier défaut à traquer (overflow) |

## Section par section

1. **Navigation :** menu burger, logo à gauche, bouton "Prendre rendez-vous" visible soit dans la barre (compact), soit en premier dans le menu ouvert.
2. **Accroche principale :** hauteur environ 85 % de l'écran, texte lisible sur la photo (voile sombre si besoin), boutons empilés pleine largeur.
3. **Chiffres de réassurance :** grille 2 x 2, pas 4 en ligne.
4. **Savoir-faire :** 3 blocs empilés.
5. **Réalisations :** une colonne, ou un défilement horizontal volontaire (carrousel) si la page devient trop longue. Pas de grille à 3 colonnes réduite.
6. **Démarche :** 4 étapes empilées, numéros conservés.
7. **Matériaux :** bandes empilées, images moins hautes.
8. **Témoignages :** empilés, ou un seul visible avec défilement.
9. **Showroom :** photo au-dessus, informations dessous, carte en hauteur réduite.
10. **Formulaire :** champs pleine largeur, taille de police 16 px minimum (en dessous, iOS zoome à la saisie), bouton pleine largeur.
11. **Pied de page :** colonnes empilées, liens espacés pour le doigt.

## Bandeau "Site de démonstration"

Doit rester visible et lisible sur mobile, sans masquer la navigation.

## Contrôle final

Pour chaque breakpoint (991, 767, 478 px), lister section par section : conforme, corrigé, ou problème restant. Signaler tout défilement horizontal.
