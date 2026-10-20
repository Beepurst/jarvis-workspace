# Media buying Meta Ads de Kleak Agency

Le travail de l'agent `media-buyer` (`.claude/agents/media-buyer.md`) : préparer les campagnes,
écrire et déposer les textes d'annonce dans le Hub Agence, faire les bilans, commander les
créas à `createur-creas`. L'agent recommande, Edgar exécute dans le Gestionnaire de publicités.

## Fichiers

- `regles.md` : les règles de décision (volume minimum, coupure, budget, variantes, fréquence,
  qualité des leads, données manquantes). Les valeurs chiffrées font foi dans les Réglages du
  hub (Ads > Réglages), que l'agent lit dans `seuils`.
- `journal.md` : une entrée par test lancé et par bilan, la plus récente en haut.

## Entrées du hub utilisées

En-tête `x-kleak-secret: $ADS_AGENT_SECRET`, base `$HUB_URL` (les deux dans le `.env` du
workspace, à ne jamais afficher).

| Entrée | Usage |
|---|---|
| `GET /api/agent/ads?debut=AAAA-MM-JJ&fin=AAAA-MM-JJ` | Lecture seule : performances, qualité des leads, détail par texte, seuils, textes déposés, alertes ouvertes. Par défaut les 30 derniers jours jusqu'à hier (heure de Paris) |
| `POST /api/agent/ads/elements` | Dépôt des textes d'une créa (1 à 5 textes, 1 à 5 titres, 0 à 5 descriptions). Tout ou rien : un refus et rien n'est enregistré |

Limites au dépôt : titre 40 caractères et description 30 (bloquantes), texte principal 125
(avertissement seulement). Les commandes exactes sont dans l'agent.

## Ce qui reste ailleurs

- Les visuels : `livrables/creas-meta/` et l'agent `createur-creas`.
- Les prix et délais : `livrables/offre/fiche-offre.md`, seule source.
- Les anciens textes de A, B, D : `livrables/creas-meta/TEXTES-ANNONCES.md`, à déposer une fois
  dans le hub. Ensuite, les textes vivent dans le hub.
