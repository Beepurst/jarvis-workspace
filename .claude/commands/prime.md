# /prime

> Commande pour démarrer une nouvelle session avec contexte complet.

---

## Mission

Quand je lance `/prime` au début d'une session, exécute la séquence suivante :

### Étape 1 : Charger le contexte

Lis dans cet ordre, en intégralité :
1. `CLAUDE.md` (le fichier racine du workspace)
2. `context/CONTEXT.md` (mon contexte et l'état de l'agence)
3. `context/HISTORY.md` (l'historique de mes sessions précédentes)

Puis liste (sans les lire entièrement) les sous-dossiers de `livrables/`, hors
`hub/`, pour savoir quels livrables existent déjà. Ne lis pas `archive/`.

### Étape 2 : Résumer ta compréhension

Présente-moi un résumé clair et synthétique en suivant cette structure :

```
Bonjour Edgar, contexte chargé. Voici où on en est :

**Le projet**
- [2 lignes : activité, outil, stade actuel]

**L'objectif**
- [Objectif chiffré + échéance + jours restants]

**État des chantiers**
- Outil : [statut]
- Offre et prix : [statut]
- Prospection : [statut]
- Clients : [statut]
- Orbikal : [statut]

**Chiffres actuels**
- [CA encaissé, devis en cours, ou "aucun chiffre encore"]

**Dernière session**
- [Résumé de la dernière entrée de HISTORY.md]

**Prochain chantier**
- [Le chantier prioritaire identifié dans CONTEXT.md]

Prêt. Que veux-tu faire aujourd'hui ?
```

### Étape 3 : Attendre les instructions

Ne lance aucune action de toi-même. Attends que je te donne le sujet de la
session.

---

## Règles importantes

- Calcule et affiche le nombre de jours restants avant l'échéance de l'objectif,
  c'est ce qui donne le tempo de la session
- Si certains fichiers sont vides ou incomplets, signale-le et propose de les
  remplir
- Si tu détectes une incohérence entre les fichiers, signale-le calmement
- Ne fais pas de suppositions sur ce qu'on doit faire aujourd'hui, attends mes
  instructions
- Le résumé doit être en français et utiliser le tutoiement
- Pas de tirets longs (em dashes) dans tes réponses
