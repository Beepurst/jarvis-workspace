# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-06-17

### Création de la skill "cadrage-automatisation"
- Nouvelle skill personnalisée dans `.claude/skills/cadrage-automatisation/`
- Rôle : mener un entretien adaptatif puis produire un cahier des charges d'automatisation (objectif, déclencheur, entrées, sorties, règles, cas limites, reco n8n vs Make, design des nodes, critères de succès)
- Sortie : fichier markdown dans `briefs/` + affichage dans le chat
- Validée sur 3 cas de test réels (app de création de posts, reporting mensuel, notification Slack sur nouveau lead CRM), comparaison avec/sans skill concluante
- Se déclenche automatiquement quand Edgar veut cadrer ou scoper une automatisation

### Installation initiale du Jarvis
- Workspace personnalisé pour Edgar, basé à Cergy
- Profil principal : Employé chez Treenity Group
- Activité : Head of Automatisation Marketing, implante des systèmes d'IA et d'automatisation pour l'équipe marketing (5 personnes, rattaché au directeur marketing)
- Objectifs court terme identifiés : livrer la v1 de l'app de création de posts, automatiser le reporting marketing mensuel, faire gagner du temps à l'équipe sur la production de contenu
- Vision long terme : devenir la référence IA et automatisation du groupe Treenity
- Projets actifs au démarrage : app de création de posts automatisée (prioritaire), création des apps internes, montée en compétence en cours
- Domaine d'aide prioritaire : productivité et organisation au quotidien
- Style de communication choisi : mélange selon le contexte, direct par défaut
- Note technique : contenu du kit remonté du sous-dossier `jarvis-starter-kit/` vers la racine du workspace pour un chargement automatique correct
