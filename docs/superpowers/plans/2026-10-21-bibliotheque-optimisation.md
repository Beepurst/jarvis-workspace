# Bibliothèque : optimisation des tokens et fiches retravaillées : plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal :** réduire les tokens consommés par l'agent `bibliothecaire` et par les sessions de construction Framer, et permettre à l'agent de retravailler les fiches existantes sans perdre notes ni épingles.

**Spec :** `docs/superpowers/specs/2026-10-20-bibliotheque-prompts-design.md` (base), plus les décisions d'Edgar du 21/10 recopiées ci-dessous, qui priment sur la spec quand elles la contredisent.

**Mesures de départ (20/10, section algorix) :**
- Session de construction : 102 tours, contexte de 70 000 à 265 000 tokens, environ 19 millions de tokens relus. Causes : `/prime` au démarrage (CONTEXT et HISTORY), 11 captures du site d'origine ouvert dans un navigateur, 39 appels Framer séparés.
- Agent : 12 tours, environ 335 000 tokens, sur Opus, avec 2 images lues (aperçu pleine page et capture).

## Décisions d'Edgar (21/10)

- Agent `bibliothecaire` sur **Sonnet**. Sessions de construction : **on garde Opus**, on réduit le reste.
- Prompt : la session **ouvre le site d'origine pour voir l'animation** de la section (correction d'Edgar du 21/10), limité à cette section : au plus 2 captures réduites, rien d'autre du site ; capture regardée une fois ; appels Framer groupés ; une seule capture de contrôle à la fin.
- Fiche technique **plus courte** : on retire les couleurs et polices exactes du site d'origine (on adapte au client de toute façon).
- **Commande de démarrage légère** pour les sessions de site, à la place de `/prime`.
- **Mode « retravailler »** : l'agent complète les fiches existantes sur la même ligne. Il **garde la note d'Edgar et les épingles**, et **remplace le titre** (titre descriptif) et **la capture** (section seule, propre).

## Global Constraints

- Hub : `/Users/ed/Desktop/jarvis-kleak/livrables/hub-agence`, branche **`bibliotheque-optimisation`** depuis `main`. Jamais de push sur `main`, jamais de `npm run build` avec un serveur dev lancé, jamais d'écriture sur la vraie base pendant le développement.
- Workspace : `/Users/ed/Desktop/jarvis-kleak`, commits sur sa branche courante, en n'ajoutant que les fichiers de la tâche (jamais `git add -A`).
- Tests : `npm test` et `npx tsc --noEmit` dans le hub.
- Français, aucun tiret long (—), phrasé plat. Secrets jamais affichés.
- L'agent ne modifie **jamais** `note`, `origine`, ni les épingles des briefs.

## Review Focus

1. Mise à jour par l'agent d'une fiche qui n'existe pas : 404 sans téléversement.
2. Mise à jour qui envoie `note` ou `origine` : ignorés, jamais écrits.
3. Remplacement de capture qui échoue pendant une mise à jour agent : l'ancienne capture reste (réutiliser `remplacerCapture`).
4. Titre de section introuvable par `--titre` : code 2 clair, l'agent retombe sur l'aperçu réduit.
5. Prompt d'une fiche sans fiche technique : l'ouverture de l'URL d'origine reste permise (sinon la session n'a rien).

---

### Task 1 : Entrées agent pour retravailler une fiche (hub)

**Files :** Modify `src/app/api/agent/bibliotheque/route.ts` ; Create `src/app/api/agent/bibliotheque/[id]/route.ts` ; Modify `src/lib/bibliotheque-agent.ts` ; Test `scripts/test-bibliotheque-agent.ts`.

**Interfaces :**
- Consumes : `refus()` du fichier route existant (à déplacer dans `src/lib/bibliotheque-agent.ts` sous `refusAgent(request): NextResponse | null` pour le partager), `parserReference(…, "maj")`, `remplacerCapture`, `avecCaptureUrl`.
- Produces :
  - `GET /api/agent/bibliotheque?a_retravailler=1` : `{ fiches: { id, titre, url_source, type_section, note, capture_url }[] }`, les fiches **sans fiche technique**, plus anciennes d'abord. Sans `a_retravailler`, le `GET ?url=` existant ne change pas.
  - `PATCH /api/agent/bibliotheque/[id]` (multipart) : champs `titre`, `type_section`, `secteur`, `tags`, `outil`, `fiche_technique`, et `file` facultatif. Écrit seulement ces champs (via `parserReference` en "maj", après **suppression** de `note` et `origine` des champs lus). Si `file` : remplacement par `remplacerCapture`. Réponses : 200 `{ reference }`, 400, 401, 404 (fiche introuvable, avant tout téléversement), 503, 500.
  - `export function champsAgentMaj(form: Record<string, unknown>): Record<string, unknown>` : ne garde que les 6 clés autorisées. Testée.

- [ ] Tests : `champsAgentMaj` garde les 6 clés, retire `note`, `origine`, `capture_path`, `id`, clés inconnues.
- [ ] RED, implémentation, GREEN, `npm test` et `npx tsc --noEmit`, commit « Bibliothèque : entrées agent pour retravailler une fiche ».

### Task 2 : Prompt plus économe (hub)

**Files :** Modify `src/lib/bibliotheque-prompt.ts` ; Test `scripts/test-bibliotheque-prompt.ts`.

Changements du cadre et des blocs (le reste du cadre ne change pas) :
- La ligne « Pour voir une capture… / Ouvre l'URL d'origine dans un navigateur si la session en a un… » est remplacée par une rubrique **« Économie de tokens »** :
  - quand une section a une fiche technique : **ne pas ouvrir l'URL d'origine** ; télécharger la capture avec curl et la regarder **une seule fois**, réduite à 1000 px de large au plus (`sips -Z 1000` sur Mac) ;
  - construire chaque section en **2 ou 3 appels Framer groupés** au plus, pas un appel par élément ;
  - une **seule capture de contrôle** à la fin de la section (ou de la page), réduite à 1000 px, pas de captures intermédiaires ;
  - ne pas relire de fichiers de contexte de l'agence (CONTEXT.md, HISTORY.md).
- Dans le bloc d'une section **sans** fiche technique, la phrase existante (ouvrir l'URL et / ou la capture) reste : c'est le seul cas où ouvrir l'URL d'origine est permis.
- La mention « URL d'origine (à ouvrir pour voir le comportement réel) » devient « URL d'origine » quand la fiche technique existe.

- [ ] Tests : avec fiche technique, le prompt contient « ne pas ouvrir l'URL d'origine », « 2 ou 3 appels », « une seule capture de contrôle », `sips -Z 1000` et ne contient pas « à ouvrir pour voir le comportement réel » ; sans fiche, la phrase d'ouverture de l'URL est présente. Adapter les assertions existantes qui dépendent de l'ancien texte.
- [ ] RED, implémentation, GREEN, `npm test` et `npx tsc --noEmit`, commit « Bibliothèque : prompt plus économe en tokens ».

### Task 3 : Script de capture : repérage par titre et vignette (workspace)

**Files :** Modify `livrables/bibliotheque/capturer.mjs`.

- Nouveau mode `--titre "<texte>"` (avec `--sortie`) : cherche, parmi les sections de `--lister`, celle dont un titre (`h1` à `h4`) ou un texte de plus de 20 caractères contient le texte donné (comparaison sans casse, sans accents, espaces normalisés). Écrit sur la sortie standard `{ n, premierTitre }` et code 0 ; plusieurs correspondances : la première, et `autres: [n…]` ; aucune : code 2 avec un message clair. N'écrit **pas** d'aperçu pleine page.
- `--section <n>` écrit en plus `vignette.jpg` : la capture réduite à 800 px de large, qualité 60, pour la vérification par l'agent. `capture.jpg` (déposée dans le hub) ne change pas.
- `--section <n>` écrit en plus `resume.json` : seulement ce que la fiche courte utilise (structure : nombre de colonnes, ordre des blocs ; hiérarchie : tailles relatives des niveaux de titre et du texte, capitales, famille condensée / serif / sans-serif sans nom exact ; grille : largeur utile, colonnes, marges ; mobile : ce qui passe en colonne et ce qui disparaît, hauteur bureau et mobile ; animations : la liste déjà détectée ; performance : nombre d'images, plus grande source, nombre de graisses). `analyse.json` reste, pour les cas de doute.
- `--aperçu` reste disponible mais réduit à 1000 px de large (au lieu de la taille réelle).

- [ ] Essai réel sur `https://algorix-ttm.webflow.io/` : `--titre "Building Intelligent Systems"` renvoie la section 3 ; `--section 3` produit `vignette.jpg` (vérifiée avec Read) et un `resume.json` de moins de 3 Ko. Essai d'un titre absent : code 2.
- [ ] Commit (workspace, ce fichier seul) « Capture bibliothèque : repérage par titre, vignette et résumé ».

### Task 4 : Agent sur Sonnet, fiche courte et mode retravailler (workspace)

**Files :** Modify `.claude/agents/bibliothecaire.md` ; Modify `docs/superpowers/specs/2026-10-20-bibliotheque-prompts-design.md` (format de fiche, une ligne de renvoi vers ce plan).

**Interfaces :** Consumes `--titre`, `vignette.jpg`, `resume.json` (Task 3) ; `GET ?a_retravailler=1` et `PATCH /api/agent/bibliotheque/[id]` (Task 1).

- En-tête : `model: sonnet`.
- **Fiche technique courte, 6 rubriques fixes, 180 mots au plus** :
  ```
  Structure : …        (blocs dans l'ordre, colonnes, fond clair ou sombre, où est la couleur)
  Hiérarchie et grille : …   (niveaux de titre en tailles relatives, capitales, style de police sans nom exact, largeur utile, colonnes, marges)
  Mobile : …
  Animations : …       (chacune marquée compatible / à alléger / à proscrire, règles de la checklist section 9)
  Ce qui fait la force de la section : …
  Points d'attention performance : …
  ```
  Interdits : couleurs exactes (rgb, hex), noms de polices du site d'origine, textes du site d'origine au-delà de leur forme.
- **Déroulé AJOUTER économe :** doublons → `--titre` avec le texte donné par Edgar (aperçu seulement si `--titre` échoue) → `--section n` → lire **seulement `vignette.jpg` et `resume.json`** (`analyse.json` seulement en cas de doute précis) → fiche → dépôt. Une seule commande bash par étape, pas de lectures de fichiers non nécessaires.
- **Mode RETRAVAILLER** (déclencheurs : « retravaille la bibliothèque », « complète les fiches », « retravaille la fiche … ») : `GET ?a_retravailler=1` (ou la fiche nommée) ; pour chaque fiche : télécharger la capture d'Edgar et la regarder réduite (`sips -Z 800`) pour savoir quelle section c'est ; repérer la section sur `url_source` avec `--titre` (texte lu sur la capture) ; `--section n` ; vérifier que la vignette correspond à la capture d'Edgar ; écrire la fiche courte, un titre descriptif et le bon `type_section` ; `PATCH` avec la nouvelle capture. Ne jamais envoyer `note`. Si la section n'est plus sur le site (site modifié ou hors ligne) : ne rien changer à la fiche et le dire.
- Une fiche déjà munie d'une fiche technique au **format long** (8 rubriques) peut être retravaillée sur demande nommée d'Edgar : même déroulé.
- Garder intactes les règles de secret, `HUB_URL_ESSAI` et la gestion des codes. Raccourcir le reste du fichier : viser 40 % de lignes en moins sans perdre une règle.
- [ ] Relecture : chaque règle de la spec (sauf le format remplacé) est toujours présente.
- [ ] Commit (workspace, ces deux fichiers) « Agent bibliothecaire : Sonnet, fiche courte, mode retravailler ».

### Task 5 : Commande de démarrage légère pour les sessions de site (workspace)

**Files :** Create `.claude/commands/site.md` ; Modify `CLAUDE.md` (section Commands, une ligne).

`/site <nom du client ou du test>` : ne lit **aucun** fichier de contexte de l'agence. Il pose le cadre de la session :
- outil Framer avec `@framer/agent` (lancer `npx @framer/agent@latest setup` une fois, puis charger la skill `framer` comme elle le demande) ;
- règles de construction résumées en 6 lignes depuis la checklist section 9, avec le chemin absolu du fichier pour le détail ;
- règles d'économie : appels Framer groupés, captures réduites à 1000 px et seulement en fin de section, pas d'ouverture du site d'origine quand une fiche technique existe, pas de relecture de fichiers déjà lus ;
- puis attendre le prompt de page ou de section copié depuis le hub.
- [ ] Commit (workspace, ces deux fichiers) « Commande /site : démarrage léger des sessions de construction ».

### Task 6 : Mise en production et passage sur la bibliothèque (contrôleur, avec Edgar)

- [ ] Tests et build du hub (aucun serveur dev), fusion de `bibliotheque-optimisation` dans `main` et push **après accord d'Edgar**.
- [ ] Vérifier en production : `GET ?a_retravailler=1` répond 200 (secret posé dans Vercel par Edgar).
- [ ] Lancer l'agent en mode RETRAVAILLER sur les 5 fiches manuelles, puis sur la fiche algorix (demande nommée, format long vers format court).
- [ ] Mesurer les tokens de l'agent sur une fiche et comparer aux 335 000 de départ.
