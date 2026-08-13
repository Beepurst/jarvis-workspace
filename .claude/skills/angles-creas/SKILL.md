---
name: angles-creas
description: >
  Génère des angles marketing distincts et les créas publicitaires qui vont avec
  pour un produit ecommerce : hooks, scripts vidéo prêts à tourner pour Meta et
  TikTok, briefs visuels, accroches statiques et textes d'annonce. Le livrable est
  sauvegardé dans livrables/creas/ et affiché dans le chat. Déclenche cette skill
  dès qu'Edgar parle de créas, de publicités, d'angles marketing, de hooks, de
  scripts vidéo, d'UGC, de contenu TikTok, de visuels pub, ou demande comment
  vendre ou présenter un produit, même s'il ne prononce pas le mot "angle".
---

# Angles et créas

## À quoi sert cette skill

En média payant, ce n'est pas le produit qu'on teste, c'est l'angle. Le même
produit peut faire 0,8 de ROAS avec un angle et 3,2 avec un autre. L'erreur
classique du débutant, c'est de lancer cinq vidéos qui disent toutes la même chose
avec un montage différent, puis de conclure que le produit ne marche pas.

Cette skill produit des angles réellement distincts, chacun avec ses créas prêtes
à tourner. L'objectif est de sortir d'ici avec de quoi filmer ou briefer
directement, pas avec des idées à retravailler.

## Déroulé en 3 temps

1. **Cadrage** du produit et de l'audience.
2. **Génération** des angles, puis des créas pour chacun.
3. **Livrable** sauvegardé dans `livrables/creas/` + plan de test.

---

## Temps 1 : le cadrage

Récupère ce qui existe déjà. Si une validation produit a été faite, lis le fichier
correspondant dans `livrables/produits/` plutôt que de reposer les questions.

Il te faut au minimum :

- **Le produit** et ce qu'il fait concrètement
- **Le problème réel** qu'il résout, ou le désir qu'il satisfait
- **La cible** : qui achète, dans quelle situation
- **Le prix de vente** (il conditionne le niveau de preuve nécessaire)
- **Le canal visé** : Meta, TikTok, ou les deux
- **Ce qui existe déjà** : visuels fournisseur, UGC dispo, ou tournage à faire

Si Edgar ne sait pas répondre sur la cible, ne bloque pas : propose deux ou trois
segments plausibles et fais-les valider en une ligne.

---

## Temps 2 : les angles

### Ce qui fait un angle distinct

Deux angles sont distincts s'ils ne partagent ni le même problème, ni la même
cible, ni la même émotion d'entrée. Changer le décor ou la musique ne crée pas un
angle. Passer de "gagne du temps le matin" à "arrête d'avoir honte de ton salon"
en crée un.

Produis **4 à 6 angles**, en piochant dans des registres différents. Ne les
utilise pas comme une checklist à remplir : choisis ceux qui collent réellement au
produit.

| Registre | Ce qu'il attaque | Fonctionne quand |
|---|---|---|
| Problème / solution | Une douleur quotidienne concrète | Le problème est visible à l'écran |
| Avant / après | La transformation | Le résultat est spectaculaire visuellement |
| Ennemi commun | Ce qui rate aujourd'hui, la méthode d'avant | Il existe une alternative frustrante |
| Curiosité / mécanisme | Le "comment ça marche" | Le produit a un fonctionnement surprenant |
| Identité / statut | Qui tu deviens en l'ayant | Produit déco, mode, lifestyle |
| Preuve sociale | Ce que les autres en disent | Il existe de l'UGC ou des avis |
| Peur / évitement | Ce qui arrive si tu ne fais rien | Sécurité, entretien, santé du quotidien |
| Cadeau / occasion | L'usage social du produit | Produit offrable, saisonnalité |

Pour chaque angle, formule :

- **Le nom de l'angle** (court, pour le nommer dans l'ad manager)
- **La cible précise** visée par cet angle
- **La promesse** en une phrase
- **L'émotion d'entrée** dans les 3 premières secondes
- **Pourquoi il peut gagner**, et **pourquoi il peut échouer**

### Les créas de chaque angle

Pour chaque angle, produis :

**3 hooks** (les 3 premières secondes, à l'oral ou en texte incrusté). Le hook est
la variable qui fait le plus de différence dans le résultat. Écris-les tels qu'ils
seront dits, pas décrits.

**1 script vidéo complet**, découpé en plans, avec la durée de chaque plan, ce
qu'on voit et ce qu'on dit ou affiche. Format attendu :

```
[0-3s]  PLAN : ce qu'on voit          | VOIX/TEXTE : ce qu'on entend ou lit
[3-8s]  ...
```

Cible 20 à 35 secondes pour Meta, 15 à 25 secondes pour TikTok. Termine toujours
par un CTA explicite.

**1 idée de créa statique** : ce qu'on voit, et l'accroche incrustée.

**Le texte d'annonce** (primary text) : 2 à 4 lignes, plus un titre court.

### Spécificités par canal

- **TikTok** : filmé caméra à la main, ton natif et parlé, aucune esthétique de
  pub, le hook doit être dans le premier plan sans intro. Le son compte autant que
  l'image.
- **Meta** : plus de tolérance pour la structure classique problème / solution /
  preuve / offre. Le texte incrusté doit fonctionner sans le son, une grande partie
  du feed est regardée en silence.

---

## Format du livrable

```markdown
# Angles et créas — [Nom du produit]

> Date : [AAAA-MM-JJ] · Canal : [Meta / TikTok / les deux]

## Le produit en une phrase
[Ce qu'il fait, pour qui.]

## Vue d'ensemble des angles
| # | Angle | Cible | Promesse | Priorité de test |
|---|---|---|---|---|
| 1 | | | | |

---

## Angle 1 — [Nom]

- **Cible :**
- **Promesse :**
- **Émotion d'entrée :**
- **Pourquoi il peut gagner :**
- **Pourquoi il peut échouer :**

### Hooks
1. "[hook mot pour mot]"
2. "[hook mot pour mot]"
3. "[hook mot pour mot]"

### Script vidéo
```
[0-3s]  PLAN : ...  | VOIX/TEXTE : ...
[3-8s]  PLAN : ...  | VOIX/TEXTE : ...
```
- **Durée totale :**
- **Matériel nécessaire :**

### Créa statique
- **Visuel :**
- **Accroche incrustée :**

### Texte d'annonce
- **Titre :**
- **Corps :**

---

[Répéter pour chaque angle]

---

## Plan de test
- **Ordre de test recommandé :** [quel angle en premier et pourquoi]
- **Budget suggéré par angle :**
- **Critère de décision :** [ce qu'on regarde pour couper ou scaler]

## Points de vigilance
- [Claims à éviter, contraintes de la plateforme, éléments à ne pas montrer]
```

### Sauvegarde

- Écris le fichier dans `livrables/creas/AAAA-MM-JJ-[slug-produit]-angles.md`
- Affiche le contenu complet dans le chat
- Propose la suite : produire les créas, monter la structure de campagne, ou
  affiner un angle en particulier

---

## Règles transverses

- Toujours en français, tutoiement, pas de tirets longs (em dashes).
- **Écris les hooks et les scripts mot pour mot**, jamais en description. "Un hook
  qui interpelle sur le problème" est inutilisable. "Tu fais encore ça à la main ?"
  est tournable.
- **Aucun claim non tenable.** Pas de promesse santé, minceur, médicale ou de
  revenus. C'est ce qui fait bannir les comptes publicitaires. Si le produit pousse
  naturellement vers ce terrain, propose la formulation de contournement conforme.
- **Reste concret sur la faisabilité.** Si Edgar tourne seul avec un téléphone, ne
  propose pas un script à trois comédiens et deux lieux. Adapte au matériel réel.
- Ne produis pas six variantes du même angle en prétendant qu'elles sont
  différentes. Mieux vaut quatre angles vraiment distincts que six cosmétiques.
