---
name: recherche-actualites
description: >
  Veille ecommerce personnalisée, filtrée selon le contexte d'Edgar (boutique
  dropshipping Shopify, acquisition Google Ads / Meta Ads / TikTok, objectif de
  profit). Couvre les tendances produits, les changements de plateformes
  publicitaires, les évolutions Shopify, la réglementation, et les signaux de
  marché. Déclenche cette skill quand Edgar demande une veille, "les news du
  jour", "un point sur les actualités", "ce que je dois savoir aujourd'hui", ou
  utilise la commande /morning.
---

# Veille ecommerce contextualisée

## Mission

Faire une veille filtrée, pas un revue de presse. L'objectif n'est pas de tout
dire, mais de ne garder que ce qui peut changer une décision d'Edgar cette
semaine.

Trois actualités qui comptent valent mieux que dix qui remplissent.

---

## Phase 1 : charger le contexte

Avant toute recherche, lire :

1. `context/CONTEXT.md` (où en est la boutique, quels chantiers sont ouverts)
2. `context/HISTORY.md` (les sessions récentes, les sujets actifs)

Identifie en interne :

- Le **stade du projet** (pas de produit / produit choisi / boutique en ligne /
  campagnes actives)
- La **niche et le produit** s'ils sont définis
- Les **canaux d'acquisition** en cours d'utilisation
- Le **chantier prioritaire** du moment

Ces éléments forment le filtre de pertinence. Une actu sur l'optimisation du
scaling Meta n'a aucun intérêt tant qu'aucune campagne ne tourne.

---

## Phase 2 : périmètre de la veille

Par défaut, couvre ces quatre axes :

1. **Plateformes publicitaires** : changements d'algorithme, nouveaux formats,
   règles de compte, politiques de contenu sur Meta, Google Ads et TikTok
2. **Shopify et outils ecommerce** : nouveautés, applications, changements de
   tarification
3. **Tendances produits et consommation** : ce qui monte, saisonnalité à venir,
   signaux de demande
4. **Réglementation et conformité** : TVA, import, droit de la consommation,
   obligations d'affichage pour la vente en ligne en France et dans l'UE

Si Edgar précise un sujet, concentre-toi dessus. S'il tape `/morning`, lance
directement le périmètre par défaut sans poser de question.

---

## Phase 3 : la recherche

Utilise les outils de recherche web disponibles.

- 3 à 5 recherches ciblées maximum
- Privilégie les sources de moins de 7 jours
- Sources francophones en priorité pour la réglementation et le marché français,
  internationales pour les plateformes publicitaires et les tendances produits

Adapte les requêtes au stade du projet :

**Stade recherche produit :** tendances produits, produits qui percent sur TikTok,
saisonnalité des prochains mois, nouveautés sur les plateformes de sourcing.

**Stade création de boutique :** nouveautés Shopify, taux de conversion, standards
de tunnel d'achat, obligations légales de la vente en ligne.

**Stade campagnes actives :** changements sur Meta et Google Ads, évolution des
CPM, politiques de compte publicitaire, nouveaux formats et placements.

---

## Phase 4 : filtrer

Pour chaque actualité trouvée, trois questions :

1. Est-ce que ça change quelque chose au chantier prioritaire d'Edgar ?
2. Est-ce que ça impacte sa rentabilité, ses coûts, ou son accès à un canal ?
3. Est-ce que ça crée une opportunité ou un risque sur son produit ou sa niche ?

Non aux trois questions, on écarte. Oui à au moins une, on garde.

Écarte systématiquement : les levées de fonds, les annonces corporate sans effet
opérationnel, les articles génériques du type "10 astuces pour vendre plus", et
tout ce qui concerne un stade du projet qu'Edgar n'a pas encore atteint.

---

## Phase 5 : présenter

Format attendu :

```
📰 Ta veille du [date]

Filtrée selon ton contexte : [1 ligne, stade du projet et chantier en cours]

---

🔥 À savoir absolument

[Actualité 1]
- Ce que ça change pour toi : [1 à 2 lignes, concret]
- Source : [lien]

[Actualité 2]
- Ce que ça change pour toi : [1 à 2 lignes]
- Source : [lien]

---

💡 Bon à savoir

[1 ou 2 bullets courts]

---

🎯 Action du jour

[1 action concrète, faisable aujourd'hui, liée au chantier prioritaire]
```

---

## Si rien de pertinent

Sois honnête plutôt que de remplir :

```
📰 Ta veille du [date]

J'ai cherché sur [domaines couverts], rien qui impacte réellement ton chantier en
cours aujourd'hui.

Pas de bruit. Tu veux que j'élargisse à un autre domaine ?
```

---

## Règles importantes

- **Toujours expliquer pourquoi c'est pertinent pour Edgar spécifiquement**, pas
  juste "voici les news"
- **Maximum 3 à 4 actualités**, au delà c'est du bruit
- **Ne jamais inventer** une actualité, une source ou un chiffre
- **Toujours terminer par une action concrète**, c'est ce qui transforme la veille
  en valeur
- Français, tutoiement, pas de tirets longs (em dashes)
