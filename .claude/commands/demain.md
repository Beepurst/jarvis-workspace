# /demain

> Préparer avec Edgar la to-do du lendemain, puis l'écrire dans le Hub Agence.
> Spec : `docs/superpowers/specs/2026-10-19-todo-hub-design.md`.

---

## Mission

Le soir, Edgar lance `/demain`. Tu proposes la to-do du jour suivant à partir de ce que le hub sait, il corrige, et tu n'écris dans le hub **qu'après son feu vert explicite**.

### Étape 1 : Lire le contexte du hub

Lis `HUB_URL` et `TODO_AGENT_SECRET` dans le `.env` du workspace. **N'affiche jamais le secret**, ni dans une commande visible ni dans ta réponse : passe-le par une variable shell.

```bash
set -a; source .env; set +a
curl -s -H "x-kleak-secret: $TODO_AGENT_SECRET" "$HUB_URL/api/agent/todo"
```

- 401 : le secret du `.env` ne correspond pas à celui du hub. 503 : la variable n'est pas posée sur le hub. Dis-le et arrête-toi.
- La réponse contient `jourCible` (le jour préparé : demain, ou aujourd'hui si on est entre minuit et 5 h), les tâches d'aujourd'hui pas faites, les tâches en retard (avec `reports`), celles déjà prévues pour le jour visé, les RDV des 7 prochains jours, les prochaines actions dues, les leads jamais contactés, les leads dont la séquence est finie sans RDV, et les projets en cours.

### Étape 2 : Proposer

Commence par la date en clair : « To-do du mardi 20 octobre ». Puis :

1. **Les tâches pas faites** (d'aujourd'hui et en retard), chacune avec son jour d'origine. Signale celles repoussées 2 fois ou plus. Pour chacune, demande ce qu'Edgar veut en faire : la repousser au jour visé, la laisser en retard, ou la supprimer. Ne décide pas à sa place.
2. **La proposition du jour visé**, rangée dans cet ordre de thématiques, en sautant celles qui sont vides :
   Prospection, Réunions (chaque tâche avec son heure), Production, Clients, Admin et finances, Outils.
   Rappelle les tâches déjà prévues comme « déjà là », sans les recréer.
   Chaque tâche est une ligne concrète. Ajoute un détail court quand il aide, et marque « Claude » quand la tâche se fait en session.

Tire les tâches des données (RDV, relances, livraisons) et de ce que tu sais de l'agence (`context/CONTEXT.md`, chantier prioritaire). N'invente pas de rendez-vous ni de lead.

### Étape 3 : Corriger avec Edgar

Edgar complète, corrige, retire. Reprends la liste à jour quand il a fini, et demande une validation explicite (« J'écris ça dans le hub ? »).

### Étape 4 : Écrire, seulement après le oui

Construis le lot et envoie-le en une fois :

```json
{
  "idLot": "<uuidgen en minuscules>",
  "jour": "<jourCible>",
  "creations": [
    { "thematique": "reunions", "libelle": "Appel découverte Dupont", "heure": "10:00", "acteur": "edgar", "urgente": false, "detail": "..." }
  ],
  "reports": ["<id des tâches à repousser au jour visé>"],
  "suppressions": ["<id des tâches à supprimer>"]
}
```

Clés de thématique : `prospection`, `reunions`, `production`, `clients`, `admin`, `outils`. `acteur` : `edgar` ou `claude`. Les tâches laissées en retard n'apparaissent pas dans le lot.

```bash
curl -s -X POST -H "x-kleak-secret: $TODO_AGENT_SECRET" -H "Content-Type: application/json" \
  --data @<fichier du lot dans le scratchpad> "$HUB_URL/api/agent/todo"
```

- 200 `{ creees, repoussees, supprimees }` : annonce-le en une ligne.
- 409 `lot_deja_applique` : le lot était déjà écrit (envoi en double). Ne le renvoie pas avec un nouvel `idLot` sans vérifier dans le hub.
- 400 : rien n'a été écrit. Donne le message (`report_invalide` : une tâche à repousser n'existe plus ou est déjà faite), corrige le lot avec Edgar et renvoie-le avec un **nouvel** `idLot`.

## Règles

- Français, tutoiement, pas de tiret long, phrasé plat : pas de formules ni de chutes.
- Rien n'est écrit dans le hub avant le oui d'Edgar, et tout est écrit d'un coup.
- Le client payant passe avant le reste : une tâche Clients ou Production due pour un client passe en tête de sa thématique.
