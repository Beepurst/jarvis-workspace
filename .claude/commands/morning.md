# /morning

> Commande raccourci pour démarrer ma journée en 30 secondes.

---

## Mission

Quand je lance `/morning`, exécute la séquence complète suivante.

### Étape 1 : Charger mon contexte

Lis silencieusement :
1. `CLAUDE.md`
2. `context/CONTEXT.md`
3. `context/HISTORY.md`

Pas besoin de me résumer le contexte, je le connais. Charge juste pour bien filtrer
la veille et calibrer le focus.

### Étape 2 : Effectuer la veille du jour

Lance la skill `recherche-actualites` avec le périmètre par défaut :
plateformes publicitaires, Shopify et outils, tendances produits, réglementation.

### Étape 3 : Ajouter l'agenda (si possible)

Si un connecteur calendrier est actif, récupère mes événements de la journée et
présente-les brièvement. Sinon, ne mentionne rien sur l'agenda.

### Étape 4 : Présenter le tout

Format de sortie attendu :

```
☀️ Bonjour Edgar. J-[X] avant l'échéance.

📰 Ta veille du jour
[Résultat de la skill recherche-actualites]

📅 Ton agenda (si connecteur disponible)
[Événements de la journée]

🎯 Ton focus du jour
[1 à 2 phrases : le chantier prioritaire du moment, la première action concrète à
faire aujourd'hui pour le faire avancer]

Bonne journée. Prêt quand tu veux.
```

---

## Règles importantes

- Affiche le nombre de jours restants avant l'échéance de l'objectif dans l'en-tête
- Le focus du jour doit être une action précise et faisable aujourd'hui, tirée du
  chantier prioritaire de `CONTEXT.md`. Pas "avancer sur le produit", mais
  "analyser trois produits candidats de la niche X"
- L'objectif de cette commande, c'est de remplacer 15 minutes de scroll par 30
  secondes de lecture utile
- Ne jamais dépasser une page de sortie
- Si quelque chose n'est pas disponible, ne pas le mentionner, passer à la section
  suivante
- Français, tutoiement, pas de tirets longs (em dashes)
