---
name: cadrage-automatisation
description: >
  Cadre une demande d'automatisation de bout en bout : mène un entretien
  adaptatif pour clarifier le besoin, puis produit un cahier des charges complet
  (objectif, déclencheur, entrées, sorties, règles métier, cas limites, reco
  d'outil n8n vs Make, design des étapes/nodes, critères de succès). Le brief est
  sauvegardé en markdown dans briefs/ et affiché dans le chat. Déclenche cette
  skill dès qu'Edgar veut automatiser une tâche, cadrer ou scoper une
  automatisation, rédiger un brief ou un cahier des charges, préparer ou concevoir
  un workflow n8n ou Make, ou dès qu'il décrit une tâche répétitive et chronophage
  qu'il aimerait déléguer à un système, même s'il ne prononce pas les mots
  "cahier des charges" ou "cadrage".
---

# Cadrage d'automatisation

## À quoi sert cette skill

Edgar conçoit des automatisations pour l'équipe marketing. Le piège classique,
c'est de foncer dans n8n ou Make avant d'avoir clarifié le besoin, et de devoir
tout refaire parce qu'un cas limite ou une source de données avait été oubliée.

Cette skill impose la discipline du cadrage : on pose les bonnes questions, on met
les zones floues sur la table, et on sort un cahier des charges qu'on peut soit
construire directement, soit transmettre à quelqu'un. L'objectif n'est pas de
remplir un formulaire, mais de réfléchir au problème avant de le coder.

## Déroulé en 3 temps

1. **Entretien adaptatif** pour couvrir les 8 dimensions ci-dessous.
2. **Récapitulatif** soumis à validation avant d'écrire.
3. **Écriture du cahier des charges** : fichier markdown dans `briefs/` + affichage
   dans le chat.

---

## Temps 1 : l'entretien

Mène un entretien, pas un interrogatoire. Avance dimension par dimension, regroupe
ce qui va ensemble, et n'envoie jamais les 8 blocs d'un coup. Tutoie Edgar.

Règles de conduite :

- **Pars de ce qui est déjà connu.** Edgar a souvent déjà décrit la tâche avant de
  lancer la skill. Récupère ce qu'il a dit, ne le refais pas répéter, et attaque
  directement les trous.
- **Creuse les zones floues.** C'est une skill "adaptative et fouillée" : si une
  réponse reste vague (par ex. "ça vient du CRM"), demande la précision qui
  compte (quelle table, quel format, accès API ou export manuel).
- **Propose des hypothèses plutôt que des questions ouvertes** quand tu peux. "Je
  suppose un déclenchement manuel par bouton, tu confirmes ?" fait avancer plus
  vite qu'une page blanche.
- **N'invente jamais une donnée pour remplir une case.** Si une info manque et
  qu'Edgar ne l'a pas, note-la comme point ouvert dans le brief plutôt que de la
  deviner. Un cahier des charges honnête sur ses inconnues vaut mieux qu'un
  cahier des charges faussement complet.
- **Ne bloque pas quand le besoin est déjà détaillé.** Si Edgar arrive avec une
  description riche ou demande explicitement le brief directement, ne le force pas
  à subir tout l'entretien : produis le cahier des charges immédiatement, marque
  les hypothèses prises et les inconnues dans la section "Points ouverts", puis
  propose de les confirmer. L'entretien sert à combler les trous, pas à ralentir
  quelqu'un qui sait déjà ce qu'il veut.

### Les 8 dimensions à couvrir

**1. Objectif et contexte.** Quelle tâche, pour résoudre quoi. Combien de temps
elle prend aujourd'hui, à quelle fréquence, qui la fait. C'est ce qui permet plus
tard de chiffrer le gain et de prioriser.

**2. Déclencheur.** Qu'est-ce qui lance l'automatisation : une action manuelle (un
bouton, un formulaire), un planning (tous les lundis à 9h), ou un événement
(nouvelle ligne dans le CRM, nouveau message Slack, email reçu, webhook). Le
déclencheur conditionne toute l'architecture.

**3. Entrées (sources de données).** D'où viennent les données : CRM interne,
Slack, un fichier, une API tierce. Pour chacune : le format, le mode d'accès (API
disponible ou export manuel), le volume approximatif. Le CRM d'Edgar étant
développé en interne, demande systématiquement s'il expose une API ou une base
accessible.

**4. Traitement (règles métier).** Ce qui se passe entre l'entrée et la sortie :
transformations, filtres, conditions, branches selon les cas. Y a-t-il une étape
de validation humaine avant d'agir, et si oui à quel moment. C'est le cœur de la
logique, creuse-le.

**5. Sorties (destinations).** Où atterrit le résultat : un post publié, une ligne
écrite dans le CRM, un message Slack, un email, un fichier. Pour chaque
destination, le format attendu et l'action exacte (créer, mettre à jour, notifier).

**6. Cas limites et erreurs.** Le sujet qu'on oublie toujours et qui fait planter
les automatisations en prod. Que faire si une donnée manque, si une API échoue ou
est lente, s'il y a des doublons, si on dépasse une limite de requêtes. Pose au
moins la question, même si la réponse est "on verra plus tard".

**7. Critères de succès.** Comment Edgar saura que ça marche : un résultat concret
à observer, et idéalement une métrique de gain (temps économisé par semaine,
nombre de tâches traitées). Sans ça, impossible de juger l'automatisation après
coup.

**8. Contraintes.** Données sensibles ou personnelles (RGPD, ce qui peut pousser
vers un n8n auto-hébergé), budget, deadline, outils imposés par l'entreprise.

---

## Temps 2 : récapitulatif

Avant d'écrire, présente un résumé court et structuré et demande validation, dans
l'esprit :

> Voilà ce que j'ai compris. Je te liste l'essentiel, tu me dis si je me trompe ou
> s'il manque quelque chose avant que je rédige le cahier des charges.

Intègre les corrections d'Edgar avant de passer à l'écriture.

---

## Temps 3 : le cahier des charges

### Choix de l'outil (n8n vs Make)

Le brief doit trancher entre n8n et Make, avec une justification, pas un coup de
dés. Raisonne à partir du besoin réel plutôt que d'appliquer une règle fixe :

- **n8n** brille quand il faut de la logique complexe ou du code custom, quand le
  contrôle des coûts compte (auto-hébergeable), quand les données sont sensibles
  (auto-hébergement = données qui ne sortent pas), ou quand on s'intègre à des
  systèmes maison via des appels HTTP/API libres. Le CRM interne d'Edgar penche
  souvent de ce côté.
- **Make** brille pour assembler vite des connecteurs SaaS standards (Google,
  réseaux sociaux, outils marketing courants) avec un visuel clair, quand il n'y a
  pas de logique tordue ni de besoin d'auto-hébergement.

Donne une reco ferme, explique le pourquoi en une ou deux phrases, et mentionne
l'alternative écartée. Si le besoin est vraiment à cheval, dis-le et donne le
critère qui ferait pencher la balance.

### Design technique (étapes / nodes)

Décompose le flux en étapes concrètes, dans l'ordre, en nommant pour chacune le
type de node/module et son rôle. L'idée est qu'Edgar puisse ouvrir n8n ou Make et
reconstituer le workflow sans avoir à tout re-réfléchir. Reste au niveau "brique
fonctionnelle" (Trigger, HTTP Request, Filter, Router, Set, etc.), pas besoin de
configurer chaque champ.

### Structure exacte du fichier

Utilise ce gabarit. Garde les sections vides explicitement marquées plutôt que de
les supprimer, pour que les trous restent visibles.

```markdown
# Cahier des charges — [Nom de l'automatisation]

> Date : [AAAA-MM-JJ] · Statut : Brief v1

## 1. Objectif et contexte
- **Problème résolu :**
- **Tâche automatisée :**
- **Aujourd'hui :** [temps passé / fréquence / qui le fait]
- **Gain attendu :**

## 2. Déclencheur
- **Type :** [manuel / planifié / événement]
- **Détail :**

## 3. Entrées (sources de données)
| Source | Format | Accès (API / manuel) | Volume |
|--------|--------|----------------------|--------|
| | | | |

## 4. Traitement (règles métier)
- [Étapes logiques, conditions, branches]
- **Validation humaine :** [oui/non, à quel moment]

## 5. Sorties (destinations)
| Destination | Format | Action (créer / MAJ / notifier) |
|-------------|--------|----------------------------------|
| | | |

## 6. Cas limites et gestion d'erreurs
- [Donnée manquante, échec d'API, doublons, limites de requêtes...]

## 7. Outil recommandé
- **Reco :** [n8n / Make / autre]
- **Pourquoi :**
- **Alternative écartée :**

## 8. Design technique (étapes / nodes)
1. **[Type de node]** — [rôle]
2. **[Type de node]** — [rôle]
3. ...

## 9. Critères de succès
- [Résultat observable + métrique de gain]

## 10. Contraintes et points ouverts
- **Données sensibles :**
- **Budget / deadline :**
- **Questions en suspens :** [tout ce qui reste à clarifier]
```

### Sauvegarde

- Crée le dossier `briefs/` à la racine du workspace s'il n'existe pas.
- Nomme le fichier `briefs/AAAA-MM-JJ-[slug-court].md` (slug en minuscules,
  tirets, dérivé du nom de l'automatisation).
- Écris le fichier, puis affiche le contenu complet dans le chat pour
  qu'Edgar le voie sans ouvrir le fichier.
- Termine en proposant la suite logique : construire le workflow, affiner une
  section, ou archiver le brief.

---

## Règles transverses

- Toujours en français, tutoiement, pas de tirets longs (em dashes).
- Direct et efficace : pas de remplissage, on est là pour cadrer vite et bien.
- Le brief sert à réfléchir avant de construire. Un cahier des charges qui assume
  ses inconnues est plus utile qu'un document faussement exhaustif.
