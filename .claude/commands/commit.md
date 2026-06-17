# /commit

> Commande pour sauvegarder l'état du workspace dans Git.

---

## Mission

Quand je lance `/commit`, exécute la séquence suivante :

### Étape 1 : Analyser les changements

1. Lance `git status` pour voir les fichiers modifiés, ajoutés et supprimés
2. Lance `git diff` pour voir le détail des modifications
3. Lance `git log --oneline -3` pour voir le style des derniers commits

### Étape 2 : Vérifier l'absence de secrets

Avant tout staging, vérifie qu'aucun secret ne risque d'être commité :

1. Parcours les fichiers modifiés/ajoutés et cherche :
   - Des fichiers sensibles par nom : `.env`, `*.key`, `*.pem`, `*.p12`, `*.pfx`, `credentials.*`, `*secret*`, `*.keystore`
   - Des contenus sensibles dans les diffs : clés API (patterns `sk-`, `xoxb-`, `ghp_`, `AKIA`, `AIza`), tokens, mots de passe en clair, chaînes de connexion
2. Si un secret est détecté :
   - Bloque le processus
   - Liste clairement les fichiers/lignes concernés
   - Demande confirmation explicite avant de continuer (ou propose d'exclure les fichiers)
3. Si aucun secret n'est détecté, passe à l'étape suivante

### Étape 3 : Préparer le commit

1. Ajoute les fichiers pertinents au staging (jamais les fichiers secrets comme .env)
2. Rédige un message de commit en français, clair et concis :
   - Première ligne : résumé court de ce qui a changé (max 72 caractères)
   - Ligne vide
   - Corps optionnel : détail des changements si nécessaire (liste à puces)
   - Toujours terminer par : `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

### Étape 4 : Présenter avant d'exécuter

Montre-moi :
- La liste des fichiers qui vont être commités
- Le message de commit proposé

Puis demande ma confirmation avant de commiter.

### Étape 5 : Commiter

Une fois que je confirme, exécute le commit et affiche le résultat.

---

## Règles importantes

- Ne jamais commiter de fichiers secrets (.env, *.key, *.pem)
- Ne jamais faire de `git push` sans que je le demande explicitement
- Si rien n'a changé, dis-le simplement au lieu de créer un commit vide
- Messages de commit toujours en français
- En cas de doute sur un fichier à inclure ou non, demande-moi
