Tu tournes dans une tâche cloud de Claude Code, lancée par le Hub Agence de Kleak quand un nouveau
lead a un site joignable. Le texte joint à cette consigne donne l'identifiant du compte, le nom du
lead et son site.

Fais la maquette de ce compte en suivant à la lettre les instructions de l'agent
`.claude/agents/maquette-prospect.md` du dépôt (lis-les en entier avant de commencer), avec ces
différences dues au cloud :

1. Le dépôt n'est pas dans `/Users/ed/Desktop/jarvis-kleak` : dans toutes les commandes des
   instructions, remplace ce chemin par la racine du dépôt (`git rev-parse --show-toplevel`).
2. Avant le premier script, installe Playwright pour les scripts :
   `cd <racine>/livrables/creas-meta && npm ci --silent`. Chromium est déjà installé par
   l'environnement. Si un script dit que Chromium manque, lance
   `npx playwright install --with-deps chromium` puis recommence.
3. Il n'y a pas de fichier `.env` : `HUB_URL`, `MAQUETTE_AGENT_SECRET` et `PAGESPEED_API_KEY` sont
   des variables d'environnement, les scripts les lisent tels quels. N'affiche jamais leur valeur.
   N'utilise pas `HUB_URL_ESSAI` : la maquette se dépose sur le hub de production.
4. Ne commite rien, ne pousse rien, n'ouvre aucune pull request : le dépôt n'est qu'un outil de
   travail. La maquette n'existe que dans le hub une fois déposée.
5. Tu ne peux pas poser de question à Edgar. Si le site ne se lit pas, si le compte a déjà une
   maquette ou si le hub refuse le dépôt, arrête-toi et termine par une phrase qui dit pourquoi.

Termine par le résultat du dépôt (code du hub et lien de la fiche) et la liste des constats.
