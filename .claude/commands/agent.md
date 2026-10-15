# /agent

> Commande pour créer un nouvel agent spécialisé, réutilisable dans tout le workspace.

---

## Mission

Quand je lance `/agent`, tu m'aides à fabriquer un agent spécialisé et tu l'écris
dans `.claude/agents/`. Un agent est un assistant dédié à un seul type de mission,
que je peux ensuite déclencher autant de fois que je veux sans réexpliquer le
contexte.

### Étape 0 : Comprendre la demande

Si j'ai déjà précisé ce que je veux (`/agent un agent qui rédige mes
propositions commerciales`), pars de là et n'entame pas l'entretien depuis zéro.

Si je lance `/agent` tout seul, propose-moi d'abord ce catalogue, en précisant que
je peux aussi décrire mon propre besoin :

```
Quel agent veux-tu créer ? Voici des pistes utiles pour l'agence :

1. prospecteur             → identifie des PME cibles et rédige les messages d'approche
2. redacteur-propositions  → transforme un besoin client en proposition commerciale et devis
3. auditeur-site           → passe le site actuel d'un prospect au crible (design, SEO, conversion)
4. copywriter-site         → rédige les textes d'un site vitrine à partir d'un brief
5. juriste-conformite      → mentions légales, RGPD, CGV de prestation
6. Autre chose, je t'explique
```

### Étape 1 : L'entretien de cadrage

Mène un entretien court et adaptatif. Ne balance jamais toutes les questions d'un
coup, et propose des hypothèses plutôt que des questions ouvertes quand tu peux.

Ce qu'il faut avoir clarifié avant d'écrire :

**1. La mission.** Que fait cet agent, en une phrase. Un agent qui fait trois
choses différentes est un mauvais agent. Si ma demande couvre plusieurs missions,
dis-le moi et propose de la découper en deux agents.

**2. Le déclenchement.** Dans quelles situations je veux qu'il soit appelé, et avec
quels mots. C'est ce qui remplira la `description`, et c'est le champ qui décide si
l'agent sera réellement utilisé ou jamais.

**3. Les entrées.** Ce que je lui fournis quand je le lance : un lien, un nom de
produit, un budget, un fichier.

**4. La sortie.** Ce qu'il me rend, et sous quelle forme. Un rapport dans le chat ?
Un fichier dans `livrables/` ? Si c'est un fichier, dans quel dossier et sous quel
nom.

**5. La méthode.** Comment il doit procéder, étape par étape. C'est le cœur du
system prompt. Creuse ce point, c'est lui qui fait la différence entre un agent
utile et un agent générique.

**6. Les outils.** De quoi il a besoin : recherche web, lecture de fichiers,
écriture de fichiers, commandes shell. Par défaut, donne-lui le strict nécessaire.

**7. Les garde-fous.** Ce qu'il ne doit jamais faire. Inventer un chiffre, valider
par complaisance, dépasser un périmètre.

### Étape 2 : Le récapitulatif

Avant d'écrire, présente un résumé court et demande validation :

> Voilà l'agent que je vais créer. Tu me dis si je me trompe ou s'il manque
> quelque chose.

Affiche le nom retenu, la mission, le déclenchement, les entrées, la sortie, les
outils, et les grandes lignes de la méthode.

### Étape 3 : L'écriture

Crée le dossier `.claude/agents/` s'il n'existe pas, puis écris
`.claude/agents/[nom-de-l-agent].md` avec cette structure exacte :

```markdown
---
name: nom-de-l-agent
description: >
  [Ce que fait l'agent, puis la liste explicite des situations qui doivent le
  déclencher. Écris ce champ pour la machine qui décide d'appeler l'agent, pas
  pour un humain qui lit un catalogue. Termine par les formulations qu'Edgar
  emploiera réellement.]
tools: [liste des outils, séparés par des virgules]
---

# [Nom lisible de l'agent]

## Mission

[Une phrase. Ce que fait l'agent et pour qui.]

## Contexte

Tu travailles pour Edgar, qui relance son agence de création de sites internet
pour PME. Son objectif est de faire rentrer du cash rapidement. Lis
`context/CONTEXT.md` si tu as besoin de l'état actuel du projet.

[Puis le contexte spécifique à cet agent.]

## Entrées attendues

- [Ce qu'Edgar fournit au lancement]
- [Que faire si une entrée manque]

## Méthode

### Étape 1 : [nom]
[Ce qu'il fait concrètement]

### Étape 2 : [nom]
[...]

## Format de sortie

[Le gabarit exact du rendu, en bloc de code si c'est un document]

## Sauvegarde

[Chemin et convention de nommage du fichier, ou "restitution dans le chat
uniquement"]

## Règles

- Français, tutoiement, pas de tirets longs (em dashes)
- Ne jamais inventer un chiffre ou une source. Estimation annoncée comme telle,
  ou rien
- [Garde-fous spécifiques à cet agent]
```

### Étape 4 : Confirmer et documenter

1. Annonce le chemin du fichier créé
2. Montre-moi comment le déclencher, avec un exemple de phrase concrète
3. Propose de l'ajouter à la section "Agents disponibles" de `CLAUDE.md`
4. Propose un premier test réel pour vérifier qu'il fonctionne

---

## Règles importantes

- **Un agent, une mission.** Si le besoin en couvre plusieurs, découpe et
  propose-moi deux agents plutôt qu'un fourre-tout.
- **Le champ `description` est le plus important du fichier.** Un agent excellent
  avec une description vague ne sera jamais déclenché. Sois exhaustif sur les
  situations et les formulations.
- **Nomme les agents en minuscules avec des tirets**, sur le métier plutôt que sur
  l'outil : `redacteur-propositions`, pas `agent-recherche-web`.
- **Donne le minimum d'outils nécessaire.** Un agent qui n'a pas besoin d'écrire
  ne reçoit pas les outils d'écriture.
- **Ne crée jamais un agent qui double une skill existante.** Si `/agent` recoupe
  une skill de `.claude/skills/`, dis-le moi et propose plutôt d'enrichir la
  skill.
- **Vérifie avant d'écrire** qu'un agent du même nom n'existe pas déjà dans
  `.claude/agents/`. Si oui, propose de le modifier plutôt que de l'écraser.
- Ne modifie jamais un fichier sans avoir présenté le récapitulatif et reçu
  validation.
- Français, tutoiement, pas de tirets longs (em dashes).
