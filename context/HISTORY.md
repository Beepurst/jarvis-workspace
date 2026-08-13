# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-08-13

### Pivot complet du workspace vers l'ecommerce

**Décision :** abandon total de l'activité Treenity Group et de l'automatisation marketing. Le workspace devient dédié à un projet unique, la création d'une boutique ecommerce en dropshipping.

**Nouveau cadre :**
- Modèle : dropshipping sur Shopify, boutique en propre
- Objectif : 10 000 € de profit net par mois d'ici mi-novembre 2026
- Acquisition : Google Ads, Meta Ads, TikTok organique
- Point de départ : zéro. Pas de boutique, pas de niche, pas de produit
- Rôle attendu de Claude : assistant personnel spécialisé ecommerce, de A à Z

**Refonte technique du workspace :**
- `CLAUDE.md` réécrit intégralement, avec une section de règles spécifiques ecommerce (raisonner en chiffres, profit et non CA, pas de données inventées, conformité UE, pas de claims non tenables)
- `CONTEXT.md` réécrit : profil entrepreneur ecommerce, tableau de statut des chantiers, points à clarifier
- Arborescence `livrables/` refondue autour de la chaîne ecommerce : `produits/`, `boutique/`, `creas/`, `campagnes/`, `pilotage/`, `fournisseurs/`
- Skill `cadrage-automatisation` supprimée (obsolète, ancrée n8n/Make/CRM Treenity)
- Trois nouvelles skills créées : `validation-produit`, `angles-creas`, `pilotage-chiffres`
- Skill `recherche-actualites` réorientée vers la veille ecommerce
- Commandes `/prime` et `/morning` adaptées au nouveau contexte
- Anciens livrables du site Prodvocation supprimés

**Réserve posée par Claude et assumée par Edgar :** 10 000 € de profit net mensuel en 3 mois, en dropshipping depuis zéro, se situe dans le très haut du panier de ce qui se fait. L'objectif est conservé tel quel et sera piloté avec des chiffres réels plutôt qu'avec de l'optimisme.

**Prochain chantier :** choix de la niche et recherche produit.

---

## Avant le pivot (archive)

> Contexte historique conservé pour mémoire. Plus actif depuis le 13 août 2026.

### 2026-06-17

**Création de la skill "cadrage-automatisation"** (depuis supprimée)
- Skill de cadrage d'automatisation produisant un cahier des charges (objectif, déclencheur, entrées, sorties, règles, cas limites, reco n8n vs Make)
- Validée sur 3 cas de test réels

**Installation initiale du Jarvis**
- Workspace créé pour Edgar, basé à Cergy
- Profil : Head of Automatisation Marketing chez Treenity Group, équipe marketing de 5 personnes
- Objectifs de l'époque : v1 d'une app de création de posts, automatisation du reporting marketing mensuel, gain de temps sur la production de contenu
- Vision : devenir la référence IA et automatisation du groupe Treenity
- Note technique : contenu du kit remonté du sous-dossier `jarvis-starter-kit/` vers la racine du workspace
