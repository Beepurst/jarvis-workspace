# Bibliothèque : agent d'ajout et prompts : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** un agent Claude Code dépose des sections analysées dans la bibliothèque du hub, et le hub en tire des prompts copiables (par section, et par page depuis le brief), avec modification des fiches et suppression en deux temps.

**Architecture :** la logique pure (validation, normalisation d'URL, rangement des épingles, assemblage des prompts) vit dans `src/lib/` et se teste avec `node --test`. Les routes Next.js ne font que lire, valider et écrire dans Supabase. L'agent vit dans `.claude/agents/` du workspace, s'appuie sur un script Playwright et dépose ses fiches par `/api/agent/bibliotheque`, protégée par un secret.

**Tech Stack :** Next.js 15 (App Router), React 19, Supabase (`@supabase/supabase-js`), `node:test`, Playwright 1.61 (déjà dans `livrables/creas-meta/node_modules`).

**Spec :** `docs/superpowers/specs/2026-10-20-bibliotheque-prompts-design.md` (racine du workspace).

## Global Constraints

- Code du hub dans `/Users/ed/Desktop/jarvis-kleak/livrables/hub-agence`, dépôt git indépendant, **branche `bibliotheque-prompts`** créée depuis `main`. Ne jamais commiter le hub depuis la racine du workspace. Ne jamais pousser `main` : fusion seulement après validation d'Edgar (Tâche 9).
- Les fichiers du workspace (`.claude/agents/`, `CLAUDE.md`, `.env.example`, `livrables/bibliotheque/`) se commitent dans le dépôt de la racine, séparément.
- Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.
- Tests : `cd livrables/hub-agence && npm test` (tous) ou `node --import ./scripts/alias-hook.mjs --test scripts/test-<nom>.ts`.
- Textes visibles et prompts en français, **sans tiret long (—)**. Commentaires de code en français sans accents, comme le reste du code.
- Couleurs uniquement par variables de `src/app/theme.css`. Pas de classes verre (`.hub-verre`, etc.) sur les cartes et les listes. `scripts/test-couleurs.ts` et `scripts/test-contraste.ts` doivent passer.
- Boutons utilisables au doigt sur iPhone (pas d'action qui dépend du survol). Pas de `confirm()`, `alert()` ni `prompt()`.
- Capture : PNG, JPEG ou WebP, 4 Mo au plus (`CAPTURE_MAX_BYTES`).
- Nouveau secret `BIBLIO_AGENT_SECRET`, en-tête `x-kleak-secret`, comparé avec `secretValide` (`src/lib/secret.ts`).
- Le SQL est fourni à Edgar dans la conversation, en entier (il l'exécute dans Supabase). Ne jamais l'exécuter soi-même.

## Review Focus

1. **URL d'origine avec `www.`, `/` final, `#ancre` ou paramètres `utm_*`, `fbclid`, `gclid`** : le contrôle des doublons doit retrouver la même fiche. Test dans la Tâche 1 (`normaliserUrl`).
2. **Fiche à moitié vide** (pas de capture, pas de fiche technique, pas de note, pas de secteur) : le prompt n'écrit ni `null`, ni `undefined`, ni « non renseigné », et demande d'ouvrir l'URL quand la fiche technique manque. Test dans la Tâche 3.
3. **Épingles existantes, toutes à `ordre = 0`** et créées avant la migration : l'affichage les range par date de création, et monter / descendre fonctionne dès le premier clic. Test dans la Tâche 4 (`trierEpingles`, `deplacerEpingle`).
4. **Remplacement de capture qui échoue** (fichier trop lourd, erreur du stockage) : l'ancienne capture reste en place et affichée, la fiche n'est pas cassée. Test dans la Tâche 2 (ordre des opérations de `remplacerCapture`).
5. **Page qui n'a que des sections Commune, ou Commune vide** : le prompt de page reste valide (pas de bloc vide « Sections communes : » sans contenu). Test dans la Tâche 3.

---

### Task 1 : SQL, types de section élargis, fiche technique et normalisation d'URL

**Files :**
- Create : `supabase/bibliotheque-prompts.sql`
- Modify : `supabase/schema.sql` (tables `bibliotheque` et `brief_references`, pour qu'un nouveau projet parte du bon schéma)
- Modify : `src/lib/bibliotheque.ts`
- Modify : `src/app/api/bibliotheque/route.ts` (liste des champs lus dans le formulaire)
- Test : `scripts/test-bibliotheque.ts`

**Interfaces :**
- Produces :
  - `TYPES_SECTION` élargi, dans cet ordre : `"hero", "navigation", "services", "realisations", "a_propos", "chiffres", "logos", "etapes", "temoignages", "tarifs", "faq", "appel_action", "contact", "footer", "page_complete", "autre"`.
  - Libellés ajoutés : `realisations: "Réalisations"`, `a_propos: "À propos"`, `chiffres: "Chiffres clés"`, `logos: "Logos clients"`, `etapes: "Étapes ou process"`, `appel_action: "Bandeau d'appel à l'action"`.
  - `Reference` gagne `fiche_technique: string | null` et `origine: Origine`.
  - `export const ORIGINES = ["manuel", "agent"] as const; export type Origine`.
  - `parserReference` lit aussi `fiche_technique` (texte ou null, retours à la ligne conservés, espaces de début et de fin retirés). `origine` n'est **jamais** lue depuis la saisie : c'est la route qui la pose.
  - `export function normaliserUrl(url: string): string`.

- [ ] **Step 1 : Créer la branche**

Run : `cd /Users/ed/Desktop/jarvis-kleak/livrables/hub-agence && git checkout main && git pull && git checkout -b bibliotheque-prompts`
Expected : `Switched to a new branch 'bibliotheque-prompts'`

- [ ] **Step 2 : Écrire les tests qui échouent** dans `scripts/test-bibliotheque.ts`

```ts
test("parserReference : accepte les nouveaux types de section", () => {
  for (const t of ["realisations", "a_propos", "chiffres", "logos", "etapes", "appel_action"]) {
    const r = parserReference({ titre: "X", type_section: t }, "creation");
    assert.equal(r.ok, true);
  }
});

test("parserReference : fiche_technique gardee avec ses retours a la ligne, vide = null", () => {
  const r = parserReference({ titre: "X", fiche_technique: "  Structure : 2 colonnes\nMobile : empile  " }, "creation");
  assert.ok(r.ok);
  assert.equal(r.value.fiche_technique, "Structure : 2 colonnes\nMobile : empile");
  const v = parserReference({ titre: "X", fiche_technique: "   " }, "creation");
  assert.ok(v.ok);
  assert.equal(v.value.fiche_technique, null);
});

test("parserReference : origine n'est jamais lue depuis la saisie", () => {
  const r = parserReference({ titre: "X", origine: "agent" }, "creation");
  assert.ok(r.ok);
  assert.equal("origine" in r.value, false);
});

test("parserReference en maj : fiche_technique absente = non touchee", () => {
  const r = parserReference({ titre: "Y" }, "maj");
  assert.ok(r.ok);
  assert.equal("fiche_technique" in r.value, false);
});

test("normaliserUrl : www, slash final, ancre et parametres de suivi retires", () => {
  const attendu = "https://exemple.fr/services";
  for (const u of [
    "https://www.exemple.fr/services/",
    "https://exemple.fr/services#faq",
    "https://exemple.fr/services?utm_source=x&utm_medium=y",
    "https://EXEMPLE.fr/services?fbclid=abc",
    "https://exemple.fr/services?gclid=1",
  ]) assert.equal(normaliserUrl(u), attendu, u);
  assert.equal(normaliserUrl("https://exemple.fr/"), "https://exemple.fr");
  assert.equal(normaliserUrl("https://exemple.fr/p?id=3"), "https://exemple.fr/p?id=3");
  assert.equal(normaliserUrl("http://exemple.fr"), "http://exemple.fr");
});
```

Mettre aussi à jour les fabriques de `Reference` du fichier (ajout de `fiche_technique: null, origine: "manuel"`).

- [ ] **Step 3 : Lancer les tests pour vérifier qu'ils échouent**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque.ts`
Expected : FAIL (`normaliserUrl` n'existe pas, types refusés)

- [ ] **Step 4 : Implémenter dans `src/lib/bibliotheque.ts`**

`normaliserUrl` : `new URL`, hôte en minuscules sans `www.` en tête, suppression de `hash`, suppression des paramètres `utm_*`, `fbclid`, `gclid`, `msclkid`, chemin sans `/` final (racine comprise : pas de `/` seul). Si l'URL est invalide, renvoyer la chaîne d'entrée sans espaces de début ni de fin. Ajouter `fiche_technique` aux champs lus par `POST /api/bibliotheque` (liste `for (const k of [...])`).

- [ ] **Step 5 : Écrire `supabase/bibliotheque-prompts.sql`**

Script idempotent :

```sql
alter table bibliotheque add column if not exists fiche_technique text;
alter table bibliotheque add column if not exists origine text not null default 'manuel'
  check (origine in ('manuel', 'agent'));
alter table bibliotheque drop constraint if exists bibliotheque_type_section_check;
alter table bibliotheque add constraint bibliotheque_type_section_check check (type_section in (
  'hero', 'navigation', 'services', 'realisations', 'a_propos', 'chiffres', 'logos', 'etapes',
  'temoignages', 'tarifs', 'faq', 'appel_action', 'contact', 'footer', 'page_complete', 'autre'));
alter table brief_references add column if not exists page text not null default 'Accueil';
alter table brief_references add column if not exists ordre integer not null default 0;
```

Vérifier dans `schema.sql` que le nom de contrainte généré par Postgres est bien `bibliotheque_type_section_check` (contrainte de colonne sans nom : c'est le nom par défaut). Reporter les mêmes colonnes et la même contrainte dans `schema.sql`.

- [ ] **Step 6 : Lancer tous les tests**

Run : `npm test`
Expected : PASS, aucun test existant cassé

- [ ] **Step 7 : Commit**

```bash
git add supabase/ src/lib/bibliotheque.ts src/app/api/bibliotheque/route.ts scripts/test-bibliotheque.ts
git commit -m "Bibliothèque : types de section élargis, fiche technique, origine et normalisation d'URL"
```

---

### Task 2 : Modifier une fiche et remplacer sa capture (API)

**Files :**
- Create : `src/app/api/bibliotheque/[id]/capture/route.ts`
- Modify : `src/lib/bibliotheque-db.ts`
- Test : `scripts/test-bibliotheque-capture.ts`

**Interfaces :**
- Consumes : `validerCapture`, `CAPTURE_EXTENSIONS`, `BUCKET`, `avecCaptureUrl`.
- Produces :
  - `PATCH /api/bibliotheque/[id]` (existe) : accepte maintenant `fiche_technique` par `parserReference` (Tâche 1, rien à changer dans la route).
  - `POST /api/bibliotheque/[id]/capture` : multipart `file`, renvoie `{ reference }` (201 non, **200**). 400 si fichier invalide, 404 si la fiche n'existe pas.
  - `export function nomCapture(type: string): string` (le nom assaini déjà construit inline dans `POST /api/bibliotheque`, à déplacer ici et à réutiliser dans les deux routes).
  - `export async function remplacerCapture(deps: StockageCaptures, id: string, file: { type: string; size: number; bytes: Buffer }): Promise<{ ok: true; row: unknown } | { ok: false; status: number; error: string }>`, avec `StockageCaptures = { lireChemin(id): Promise<string | null | undefined>; televerser(path, bytes, type): Promise<string | null>; majChemin(id, path): Promise<{ row: unknown } | { error: string }>; supprimer(path): Promise<string | null> }` (chaque fonction renvoie un message d'erreur ou `null`). `undefined` pour `lireChemin` = fiche introuvable.

- [ ] **Step 1 : Écrire les tests qui échouent** dans `scripts/test-bibliotheque-capture.ts`, avec un faux `StockageCaptures` qui journalise les appels :

```ts
test("remplacerCapture : televerse, met a jour, puis supprime l'ancienne", async () => {
  // journal attendu : ["lire", "televerser", "maj", "supprimer:ancienne.png"]
});
test("remplacerCapture : echec du televersement = rien d'autre ne bouge", async () => {
  // televerser renvoie "quota" -> { ok: false, status: 500 }, journal ["lire", "televerser"]
});
test("remplacerCapture : echec de la mise a jour = nouvel objet retire, ancienne gardee", async () => {
  // majChemin renvoie { error } -> supprimer appele sur le NOUVEAU chemin seulement
});
test("remplacerCapture : echec de suppression de l'ancienne = succes quand meme", async () => {
  // supprimer renvoie "x" -> { ok: true }
});
test("remplacerCapture : fiche sans capture = pas de suppression", async () => {});
test("remplacerCapture : fiche introuvable = 404 sans televersement", async () => {});
test("remplacerCapture : fichier invalide (GIF ou 5 Mo) = 400 sans aucun appel", async () => {});
```

Écrire les assertions complètes sur le journal et le résultat dans chaque test.

- [ ] **Step 2 : Vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque-capture.ts`
Expected : FAIL (`remplacerCapture` introuvable)

- [ ] **Step 3 : Implémenter** `nomCapture` et `remplacerCapture` dans `src/lib/bibliotheque-db.ts`, puis la route `capture/route.ts` qui branche les vraies fonctions Supabase sur `StockageCaptures` (même style d'erreurs que les routes voisines). `POST /api/bibliotheque` utilise `nomCapture`. Erreur de suppression de l'ancienne : `console.error("[bibliotheque] capture orpheline:", ...)`.

- [ ] **Step 4 : Vérifier**

Run : `npm test`
Expected : PASS

- [ ] **Step 5 : Commit**

```bash
git add src/lib/bibliotheque-db.ts src/app/api/bibliotheque/ scripts/test-bibliotheque-capture.ts
git commit -m "Bibliothèque : remplacement de la capture d'une fiche"
```

---

### Task 3 : Assemblage des prompts de section et de page

**Files :**
- Create : `src/lib/bibliotheque-prompt.ts`
- Test : `scripts/test-bibliotheque-prompt.ts`

**Interfaces :**
- Consumes : `Reference`, `TYPE_SECTION_LABELS` (Tâche 1) ; `Brief`, `BRIEF_CHAMPS` (`src/lib/briefs.ts`) ; `EpingleRangee` (Tâche 4, déclarée ici en type local si la Tâche 4 n'est pas encore faite : `{ commentaire: string | null; page: string; ordre: number; reference: Reference }`).
- Produces :
  - `export const CADRE_SECTION: string`
  - `export function construirePromptSection(ref: Reference): string`
  - `export interface ClientPrompt { nom: string | null; entreprise: string | null; reponses: Record<string, string> }`
  - `export function construirePromptPage(args: { client: ClientPrompt; page: string; sections: EpingleRangee[]; communes: EpingleRangee[] }): string`

`CADRE_SECTION` reprend mot pour mot le « cadre commun » de la spec. Il contient : construction dans Framer avec `@framer/agent` ; reprendre la structure et l'adapter au site (couleurs, typographies, ton, textes et images du client, tels que posés dans la session) ; ne jamais reprendre textes, images, logos ni marque du site d'origine ; les règles de performance en clair (rien de masqué avant les animations, aucun effet d'apparition au-dessus de la ligne de flottaison, pas d'effet mot par mot, fondus sur 3 ou 4 éléments forts au plus, images à la bonne taille, une seule graisse de titre) ; le chemin absolu `/Users/ed/Desktop/jarvis-kleak/livrables/process/checklist-qualite-site.md` section 9 ; « à proscrire » non repris, « à alléger » repris allégé ; capture à télécharger avec curl puis à ouvrir ; URL à ouvrir dans un navigateur si la session en a un.

Bloc d'une section (même fonction interne pour les deux prompts) : titre, type (libellé), URL d'origine, adresse de la capture, fiche technique, note d'Edgar (« Ce qui plaît à Edgar »), et pour le prompt de page le commentaire (« Adaptation pour ce client »). Lignes vides omises. Sans fiche technique : la phrase « Pas de fiche technique : ouvre l'URL et la capture pour en tirer la structure. » Sans URL ni capture ni fiche technique : la phrase demande de demander à Edgar.

Prompt de page : cadre ; « Client » (entreprise, nom, puis les réponses `activite`, `cible`, `objectifs`, `contenus`, `fonctionnalites` avec leur libellé de `BRIEF_CHAMPS`, seulement celles remplies) ; « Page à construire : <page> » ; bloc « Sections communes » seulement si `communes` n'est pas vide, avec la consigne de les construire une seule fois et de ne pas les refaire si elles existent déjà ; sections numérotées `1.`, `2.`… dans l'ordre reçu ; consigne finale : une seule direction artistique, espacements réguliers, construire dans l'ordre, vérifier la page avec la checklist avant de rendre la main.

- [ ] **Step 1 : Écrire les tests qui échouent**

```ts
test("prompt de section : porte titre, type, url, capture, fiche technique, note et le cadre", () => {
  const p = construirePromptSection(ref({ titre: "Hero split", type_section: "hero", url_source: "https://ex.fr",
    capture_url: "https://cdn/x.jpg", fiche_technique: "Structure : 2 colonnes", note: "La photo à droite" }));
  for (const m of [/Hero split/, /Hero/, /https:\/\/ex\.fr/, /https:\/\/cdn\/x\.jpg/, /Structure : 2 colonnes/,
    /La photo à droite/, /@framer\/agent/, /checklist-qualite-site\.md/, /\/Users\/ed\/Desktop\/jarvis-kleak/,
    /mot par mot/, /ligne de flottaison/, /logos/]) assert.match(p, m);
  assert.doesNotMatch(p, /—/);
});

test("prompt de section : fiche vide = ni null, ni undefined, ni non renseigne", () => {
  const p = construirePromptSection(ref({ titre: "Nu" }));
  assert.doesNotMatch(p, /null|undefined|non renseign/i);
  assert.match(p, /demande/i);
});

test("prompt de section : sans fiche technique mais avec url = demande d'ouvrir l'url", () => {
  assert.match(construirePromptSection(ref({ titre: "X", url_source: "https://ex.fr" })), /Pas de fiche technique/);
});

test("prompt de page : client, page, sections dans l'ordre avec leur adaptation", () => {
  const p = construirePromptPage({
    client: { nom: "Jean Dupont", entreprise: "Dupont Menuiserie", reponses: { activite: "Menuiserie", budget: "1500" } },
    page: "Accueil",
    sections: [ep("Hero A", "garder la photo"), ep("FAQ B", null)],
    communes: [ep("Nav C", null)],
  });
  assert.match(p, /Dupont Menuiserie/);
  assert.match(p, /Menuiserie/);
  assert.doesNotMatch(p, /1500/);            // le budget ne sert pas a construire
  assert.match(p, /Page à construire : Accueil/);
  assert.ok(p.indexOf("Hero A") < p.indexOf("FAQ B"));
  assert.match(p, /1\. /);
  assert.match(p, /garder la photo/);
  assert.match(p, /Nav C/);
  assert.match(p, /une seule fois/);
  assert.doesNotMatch(p, /—/);
});

test("prompt de page : sans sections communes = pas de bloc commun vide", () => {
  const p = construirePromptPage({ client: { nom: null, entreprise: null, reponses: {} }, page: "Contact", sections: [ep("Form", null)], communes: [] });
  assert.doesNotMatch(p, /Sections communes/);
  assert.doesNotMatch(p, /null|undefined/);
});
```

`ref()` et `ep()` sont des fabriques locales avec tous les champs de `Reference` à `null` / défaut.

- [ ] **Step 2 : Vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque-prompt.ts`
Expected : FAIL (module introuvable)

- [ ] **Step 3 : Implémenter** `src/lib/bibliotheque-prompt.ts` (logique pure, aucun import de Supabase).

- [ ] **Step 4 : Vérifier**

Run : `npm test`
Expected : PASS

- [ ] **Step 5 : Commit**

```bash
git add src/lib/bibliotheque-prompt.ts scripts/test-bibliotheque-prompt.ts
git commit -m "Bibliothèque : prompts de section et de page"
```

---

### Task 4 : Épingles rangées par page et dans un ordre (logique et API)

**Files :**
- Modify : `src/lib/briefs.ts`
- Modify : `src/app/api/briefs/[id]/route.ts` (GET : lire `page`, `ordre`)
- Modify : `src/app/api/briefs/[id]/references/route.ts` (POST : fin de la page Accueil ; nouveau PATCH)
- Test : `scripts/test-briefs.ts`

**Interfaces :**
- Produces :
  - `BriefReference` gagne `page: string` et `ordre: number` (remplace le type local de la Tâche 3 : `EpingleRangee = BriefReference`, à exporter sous ce nom aussi).
  - `export const PAGE_COMMUNE = "Commune"` ; `export const PAGES_PROPOSEES = ["Accueil", "Services", "À propos", "Réalisations", "Contact", "Commune"] as const`.
  - `export function nettoyerPage(v: unknown): string | null` : texte sans espaces autour, 40 caractères au plus, `null` si vide. « commune » quelle que soit la casse devient `"Commune"`.
  - `export function trierEpingles(pins: BriefReference[]): { page: string; epingles: BriefReference[] }[]` : Commune en premier, puis les pages dans l'ordre de leur épingle la plus ancienne ; dans une page, tri par `ordre` puis par `created_at` du pin. Pour ça, `BriefReference` porte aussi `created_at: string` (lu par le GET).
  - `export function deplacerEpingle(pins: BriefReference[], referenceId: string, sens: -1 | 1): { reference_id: string; ordre: number }[]` : renvoie les nouveaux `ordre` (0 à n-1) de **toutes** les épingles de la page concernée, après échange avec la voisine ; tableau vide si le déplacement est impossible (première vers le haut, dernière vers le bas, id inconnu).
  - `export function ordreEnFin(pins: BriefReference[], page: string): number` : max des `ordre` de la page + 1, 0 si page vide.
  - `PATCH /api/briefs/[id]/references`, corps au choix :
    - `{ reference_id, page?, commentaire? }` : met à jour une épingle. Un changement de `page` la place en fin de la nouvelle page (`ordre` calculé côté serveur à partir des épingles du brief).
    - `{ ordres: { reference_id: string; ordre: number }[] }` : enregistre un réordonnancement (sortie de `deplacerEpingle`).
    - Réponse : `{ ok: true }` ; 400 si corps invalide ou page vide.
  - `POST` (existant) : la nouvelle épingle reçoit `page = "Accueil"` et `ordre = ordreEnFin(..., "Accueil")`.

- [ ] **Step 1 : Écrire les tests qui échouent** dans `scripts/test-briefs.ts`

```ts
test("trierEpingles : Commune d'abord, puis pages dans l'ordre d'apparition", () => {
  const g = trierEpingles([pin("a", "Services", 0, "T1"), pin("b", "Commune", 0, "T2"), pin("c", "Accueil", 0, "T3")]);
  assert.deepEqual(g.map((x) => x.page), ["Commune", "Services", "Accueil"]);
});
test("trierEpingles : epingles anciennes toutes a ordre 0 = rangees par date", () => {
  const g = trierEpingles([pin("b", "Accueil", 0, "T2"), pin("a", "Accueil", 0, "T1")]);
  assert.deepEqual(g[0].epingles.map((p) => p.reference.id), ["a", "b"]);
});
test("deplacerEpingle : echange avec la voisine et renumerote toute la page", () => {
  const pins = [pin("a", "Accueil", 0, "T1"), pin("b", "Accueil", 0, "T2"), pin("c", "Accueil", 0, "T3"), pin("x", "Contact", 0, "T4")];
  assert.deepEqual(deplacerEpingle(pins, "b", -1), [
    { reference_id: "b", ordre: 0 }, { reference_id: "a", ordre: 1 }, { reference_id: "c", ordre: 2 },
  ]);
});
test("deplacerEpingle : premiere vers le haut, derniere vers le bas, id inconnu = rien", () => {
  const pins = [pin("a", "Accueil", 0, "T1"), pin("b", "Accueil", 1, "T2")];
  assert.deepEqual(deplacerEpingle(pins, "a", -1), []);
  assert.deepEqual(deplacerEpingle(pins, "b", 1), []);
  assert.deepEqual(deplacerEpingle(pins, "z", 1), []);
});
test("ordreEnFin : max + 1, 0 sur une page vide", () => {
  const pins = [pin("a", "Accueil", 3, "T1"), pin("b", "Accueil", 1, "T2")];
  assert.equal(ordreEnFin(pins, "Accueil"), 4);
  assert.equal(ordreEnFin(pins, "Contact"), 0);
});
test("nettoyerPage : espaces, longueur, Commune normalisee, vide = null", () => {
  assert.equal(nettoyerPage("  Services "), "Services");
  assert.equal(nettoyerPage("commune"), "Commune");
  assert.equal(nettoyerPage("   "), null);
  assert.equal(nettoyerPage(12), null);
  assert.equal(nettoyerPage("x".repeat(60))?.length, 40);
});
```

`pin(id, page, ordre, created_at)` : fabrique locale (`reference` minimale avec cet `id`).

- [ ] **Step 2 : Vérifier l'échec**

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-briefs.ts`
Expected : FAIL

- [ ] **Step 3 : Implémenter** les fonctions dans `src/lib/briefs.ts`, puis le GET (sélection `id, commentaire, page, ordre, created_at, reference:bibliotheque(*)`), le POST et le PATCH. Le PATCH `ordres` fait une mise à jour par épingle (`.eq("brief_id", id).eq("reference_id", …)`), quelques lignes au plus. Changer `src/lib/bibliotheque-prompt.ts` pour importer `EpingleRangee` depuis `briefs.ts` et retirer le type local.

- [ ] **Step 4 : Vérifier**

Run : `npm test`
Expected : PASS

- [ ] **Step 5 : Commit**

```bash
git add src/lib/briefs.ts src/lib/bibliotheque-prompt.ts src/app/api/briefs/ scripts/test-briefs.ts
git commit -m "Briefs : épingles rangées par page et dans un ordre"
```

---

### Task 5 : Page Bibliothèque : modifier, supprimer en deux temps, copier le prompt

**Files :**
- Modify : `src/app/(app)/bibliotheque/page.tsx`
- Create (si la page dépasse environ 250 lignes) : `src/app/(app)/bibliotheque/carte-reference.tsx`, `src/app/(app)/bibliotheque/formulaire-reference.tsx`
- Create : `src/lib/presse-papier.ts`
- Test : `scripts/test-presse-papier.ts`

**Interfaces :**
- Consumes : `PATCH /api/bibliotheque/[id]`, `POST /api/bibliotheque/[id]/capture` (Tâche 2), `construirePromptSection` (Tâche 3), types et libellés de la Tâche 1.
- Produces : `export async function copierTexte(texte: string, nav?: { clipboard?: { writeText(t: string): Promise<void> } }): Promise<boolean>` : `true` si copié, `false` si l'API manque ou refuse (jamais d'exception). Réutilisée par la Tâche 6.

Comportement :

- **Formulaire** partagé entre ajout et modification. En modification : prérempli, titre du bouton « Enregistrer les modifications », champ capture facultatif (« Remplacer la capture »). Envoi : `PATCH` des champs (tags renvoyés en chaîne séparée par des virgules), puis si un fichier est choisi, `POST …/capture`. Contrôle `validerCapture` avant envoi, comme l'ajout. 413 traduit en « Capture trop lourde (4 Mo maximum). ». La carte se met à jour localement avec la fiche renvoyée.
- Champ **Fiche technique** (zone de texte haute, environ 10 lignes) dans le formulaire. Libellé de « Note » remplacé par « Ce qui me plaît, ce que je changerais ».
- **Supprimer** : premier appui, la ligne d'actions de la carte devient « Retirée aussi des briefs où elle est épinglée. » avec « Confirmer la suppression » (couleur `var(--rouge)`) et « Annuler ». Une seule carte en confirmation à la fois. Supprimer `confirm()`.
- **Copier le prompt** : bouton dans la ligne d'actions. Succès : le libellé devient « Prompt copié » pendant 2 s. Échec (`false`) : message d'erreur « Copie impossible sur cet appareil. ». Le prompt n'est jamais affiché.
- Repère « Agent » discret (petite étiquette `var(--surface-2)`) sur les cartes `origine === "agent"`.

- [ ] **Step 1 : Test de `copierTexte`** : succès (`true` et texte reçu), `nav` sans `clipboard` (`false`), `writeText` qui rejette (`false`).
- [ ] **Step 2 : Vérifier l'échec**, puis implémenter `src/lib/presse-papier.ts`, puis vérifier le succès.

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-presse-papier.ts`

- [ ] **Step 3 : Implémenter l'interface** décrite ci-dessus.
- [ ] **Step 4 : Vérifier**

Run : `npm test && npx tsc --noEmit`
Expected : PASS, aucune erreur de type

- [ ] **Step 5 : Essai à la main** : `npm run dev` (aucun build en parallèle), sur `/bibliotheque` : modifier une fiche (titre et fiche technique), remplacer sa capture, copier le prompt et le coller dans un éditeur, lancer puis annuler une suppression. Contrôler l'affichage à 390 px de large (`scripts/shots-mobile.mjs` ou outils du navigateur). Arrêter le serveur dev.

- [ ] **Step 6 : Commit**

```bash
git add src/app/\(app\)/bibliotheque/ src/lib/presse-papier.ts scripts/test-presse-papier.ts
git commit -m "Bibliothèque : modifier une fiche, suppression en deux temps, copier le prompt"
```

---

### Task 6 : Fiche du brief : pages, ordre, commentaire et prompt de page

**Files :**
- Modify : `src/app/(app)/briefs/[id]/page.tsx`
- Create (pour garder la page lisible) : `src/app/(app)/briefs/[id]/epingles-par-page.tsx`

**Interfaces :**
- Consumes : `trierEpingles`, `deplacerEpingle`, `PAGES_PROPOSEES`, `PAGE_COMMUNE`, `PATCH /api/briefs/[id]/references` (Tâche 4) ; `construirePromptPage`, `ClientPrompt` (Tâche 3) ; `copierTexte` (Tâche 5). Le client du prompt vient de `brief.compte` (`nom`, `entreprise`, déjà renvoyés par `GET /api/briefs/[id]`) et de `reponses` **telles qu'affichées** (saisie non enregistrée comprise).

Comportement :

- La section « Références épinglées » affiche un bloc par page (`trierEpingles`), titre de page, puis les épingles.
- Chaque épingle : vignette et titre comme aujourd'hui, puis un champ **Page** (`<input list>` relié à une `<datalist>` de `PAGES_PROPOSEES`, enregistré à la sortie du champ), boutons **Monter** et **Descendre** (désactivés en bout de page), champ **Adaptation pour ce client** (le `commentaire`, enregistré à la sortie du champ), et « Retirer » comme aujourd'hui.
- Mise à jour locale optimiste, puis appel du PATCH ; en cas d'erreur, rechargement du brief et message d'erreur.
- Chaque bloc de page autre que Commune porte **« Copier le prompt de la page »** ; retour « Prompt copié » 2 s, ou l'erreur de copie de la Tâche 5.

- [ ] **Step 1 : Implémenter l'interface** décrite ci-dessus.
- [ ] **Step 2 : Vérifier**

Run : `npm test && npx tsc --noEmit`
Expected : PASS

- [ ] **Step 3 : Essai à la main** (serveur dev, aucun build) sur un brief existant : épingler 3 fiches, en passer une en Commune et une en Services, monter / descendre, écrire une adaptation, recharger la page (tout est conservé), copier le prompt d'Accueil et contrôler l'ordre et le contenu. Contrôle à 390 px. Arrêter le serveur dev.

- [ ] **Step 4 : Commit**

```bash
git add "src/app/(app)/briefs/"
git commit -m "Briefs : épingles par page, ordre, adaptation et prompt de page"
```

---

### Task 7 : Route de dépôt de l'agent

**Files :**
- Create : `src/app/api/agent/bibliotheque/route.ts`
- Create : `src/lib/bibliotheque-agent.ts`
- Test : `scripts/test-bibliotheque-agent.ts`
- Modify : `.env.example` du hub s'il existe (ajout de `BIBLIO_AGENT_SECRET=`)

**Interfaces :**
- Consumes : `parserReference`, `validerCapture`, `normaliserUrl` (Tâche 1), `nomCapture` (Tâche 2), `secretValide`.
- Produces :
  - `export function memeSource(a: string | null, b: string | null): boolean` : `true` si les deux URL normalisées sont égales, `false` si l'une est vide.
  - `GET /api/agent/bibliotheque?url=…` : `{ fiches: { id, titre, type_section, url_source }[] }` filtrées par `memeSource` (lecture de toutes les fiches ayant une `url_source`, filtrage en mémoire). 400 si `url` manque.
  - `POST /api/agent/bibliotheque` : multipart, mêmes champs que `POST /api/bibliotheque` plus `fiche_technique` ; enregistre `origine = 'agent'` ; renvoie `{ reference }` en 201.
  - Erreurs : 503 si `BIBLIO_AGENT_SECRET` n'est pas configuré, 401 si secret refusé, 400 saisie invalide, 500 sinon. Même fonction `refus()` que `/api/agent/todo`.
  - La logique d'insertion avec capture (téléversement, insertion, retrait de l'objet si l'insertion échoue) est **extraite** de `POST /api/bibliotheque` dans une fonction partagée de `src/lib/bibliotheque-db.ts` : `creerReference(champs: Record<string, unknown>, file: File | null, origine: Origine)`, utilisée par les deux routes.

- [ ] **Step 1 : Tests de `memeSource`** : `www` et slash final égaux ; paramètres `utm_*` ignorés ; chemins différents inégaux ; `null` ou chaîne vide = `false`.
- [ ] **Step 2 : Vérifier l'échec**, implémenter, vérifier le succès.

Run : `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque-agent.ts`

- [ ] **Step 3 : Implémenter la route et `creerReference`**, refactorer `POST /api/bibliotheque` pour l'utiliser. Le middleware exempte déjà `api/agent` : vérifier, ne rien changer.
- [ ] **Step 4 : Essai à la main** avec le serveur dev et un secret d'essai posé dans `.env.local` (`BIBLIO_AGENT_SECRET`, posé par Edgar ou généré avec `openssl rand -hex 32` sans l'afficher) : `curl` sans en-tête (401), `GET ?url=` (200), `POST` d'une fiche d'essai avec une petite capture (201, visible dans `/bibliotheque` avec le repère Agent), puis suppression de la fiche d'essai depuis l'interface.
- [ ] **Step 5 : Vérifier**

Run : `npm test && npx tsc --noEmit`
Expected : PASS

- [ ] **Step 6 : Commit**

```bash
git add src/app/api/ src/lib/ scripts/test-bibliotheque-agent.ts
git commit -m "Bibliothèque : entrée de dépôt pour l'agent bibliothecaire"
```

---

### Task 8 : Agent `bibliothecaire` et script de capture (workspace)

**Files (dépôt de la racine du workspace) :**
- Create : `livrables/bibliotheque/capturer.mjs`
- Create : `.claude/agents/bibliothecaire.md`
- Modify : `CLAUDE.md` (section « Agents et skills », une ligne)
- Modify : `.env.example` (bloc `BIBLIO_AGENT_SECRET=`, commenté comme ceux de `/demain` et `media-buyer`)

**Interfaces :**
- Consumes : `GET` et `POST /api/agent/bibliotheque` (Tâche 7), `HUB_URL` et `BIBLIO_AGENT_SECRET` du `.env`.
- Produces : `node livrables/bibliotheque/capturer.mjs <url> --lister` et `node livrables/bibliotheque/capturer.mjs <url> --section <n> --sortie <dossier>`.

**Script `capturer.mjs` :**

- Charge Playwright depuis `livrables/creas-meta/node_modules` (`createRequire(new URL("../creas-meta/package.json", import.meta.url))`), sans nouvelle installation.
- Ouvre la page à 1440 × 900, attend le chargement réseau, fait défiler jusqu'en bas par paliers puis remonte (déclenche le chargement paresseux et les apparitions).
- `--lister` : écrit sur la sortie standard un JSON `{ sections: { n, balise, id, classes, premierTitre, haut, hauteur }[] }` des blocs de premier niveau de la page (enfants directs de `main`, sinon de `body` ou du conteneur racine, en descendant tant qu'il n'y a qu'un seul enfant), plus une capture pleine page réduite `apercu.jpg` dans `--sortie` pour que l'agent repère les sections.
- `--section <n>` : capture de l'élément seul en JPEG qualité 80 (`capture.jpg`) ; si elle dépasse 4 Mo, recommencer en qualité 60 puis en découpant à 3000 px de haut. Puis écrit `analyse.json` : pour la section, en bureau et en mobile (390 × 844, page rechargée) : familles et graisses de police utilisées, tailles des titres (`h1` à `h3`) et du texte courant, couleurs de fond et de texte dominantes, largeur maximale du contenu, nombre de colonnes de la grille ou du flex principal, marges internes de la section, écarts entre éléments, rayons ; et les indices d'animation : éléments avec `opacity: 0` ou `transform` au chargement, attributs `data-framer-appear-id`, `transition` et `animation` CSS non vides, `will-change`, éléments défilants (`animation` infinie), vidéos et `canvas`. Indique aussi l'outil détecté (`framer` si des marqueurs `framerusercontent.com` ou `data-framer-*` sont présents, `webflow` si `data-wf-page` est présent, sinon `aucun`).
- Codes de sortie : 0 succès, 2 section introuvable, 3 page inaccessible, avec un message d'erreur clair sur la sortie d'erreur.

**Agent `bibliothecaire.md`** : même forme que `media-buyer.md` (en-tête `name`, `description` avec les déclencheurs « ajoute cette section », « mets le hero de … dans la bibliothèque », « range cette section », outils `Read, Write, Bash, Glob, Grep`). Sections :

1. Mission (la spec, partie « L'agent `bibliothecaire` »).
2. Commandes exactes, depuis la racine, secret chargé sans jamais l'afficher (même règles que media-buyer) : contrôle des doublons (`curl … "$HUB_URL/api/agent/bibliotheque?url=…"`), dépôt (`curl -F titre=… -F url_source=… -F type_section=… -F secteur=… -F tags=… -F outil=… -F fiche_technique=<fichier -F file=@capture.jpg`). Codes et conduite à tenir pour chacun (200/201, 400, 401, 404 entrée pas encore déployée, 503, 500 : s'arrêter et dire le code).
3. Déroulé : doublons, `--lister`, ouvrir `apercu.jpg` avec Read pour reconnaître la section désignée (et la capture d'Edgar s'il en a donné une), `--section n`, ouvrir `capture.jpg` pour vérifier que c'est bien la bonne section, lire `analyse.json`, écrire la fiche technique au format fixe de la spec, déposer, répondre. Plusieurs sections d'un même site demandées d'un coup : un seul `--lister`, puis un `--section` et un dépôt par section. Code 2 (section non isolable) : capture de la zone visible à la place, dite dans la réponse ; code 3 : rien déposé, le dire.
4. Règles de la fiche technique : format fixe à 8 rubriques, jamais de texte du site d'origine au-delà de sa forme, classement de chaque animation compatible / à alléger / à proscrire selon la checklist section 9 (liste des « à proscrire » recopiée de la spec), pas de formule vague (« moderne et épuré » interdit sans mesure à l'appui).
5. Règle des doublons de la spec (même URL normalisée, même type et visiblement la même section : ne rien créer, le dire).
6. Format de réponse : une ligne par fiche déposée (titre, type, lien `$HUB_URL/bibliotheque`), puis les sections ignorées et pourquoi. Pas de validation demandée avant dépôt (décision d'Edgar).
7. Les fichiers de travail vont dans `/tmp/kleak-biblio/<horodatage>/`, jamais dans le dépôt.

- [ ] **Step 1 : Écrire `capturer.mjs`**, puis l'essayer sur `https://kleakagency.fr` : `--lister` donne une liste lisible, `--section 1` produit `capture.jpg` (la section seule, contrôlée avec Read) et un `analyse.json` dont les polices et les marqueurs Framer sont cohérents avec le site.
- [ ] **Step 2 : Écrire `.claude/agents/bibliothecaire.md`**, la ligne de `CLAUDE.md` (« **bibliothecaire** : ajoute une section d'un site à la bibliothèque du hub (capture, analyse du code, fiche technique) et la dépose directement. Déclencheur : « ajoute le hero de … », « range cette section ». ») et le bloc de `.env.example`.
- [ ] **Step 3 : Commit (racine du workspace)**

```bash
cd /Users/ed/Desktop/jarvis-kleak
git add livrables/bibliotheque/capturer.mjs .claude/agents/bibliothecaire.md CLAUDE.md .env.example docs/superpowers/specs/2026-10-20-bibliotheque-prompts-design.md docs/superpowers/plans/2026-10-20-bibliotheque-prompts.md
git commit -m "Agent bibliothecaire : capture, analyse et dépôt des sections dans le hub"
```

---

### Task 9 : Validation avec Edgar et fusion

Pas de code nouveau. Chaque étape attend Edgar.

- [ ] **Step 1 : SQL.** Donner à Edgar le contenu complet de `supabase/bibliotheque-prompts.sql` dans la conversation ; il l'exécute dans Supabase. Vérifier ensuite que `GET /api/bibliotheque` répond toujours (serveur dev).
- [ ] **Step 2 : Secret.** Edgar pose la même valeur de `BIBLIO_AGENT_SECRET` dans `livrables/hub-agence/.env.local` et dans `.env` du workspace (par un script qui n'affiche rien).
- [ ] **Step 3 : Essai réel de l'agent contre le serveur dev local** de la branche (`HUB_URL=http://localhost:3000` passé à la commande, sans modifier `.env`) : Edgar donne une URL et une section ; l'agent dépose la fiche ; contrôle dans `/bibliotheque` (capture, fiche technique, repère Agent), puis test d'un doublon (refusé et signalé).
- [ ] **Step 4 : Essai du parcours complet** : épingler la fiche sur un brief, la ranger, copier le prompt de page, le coller dans une session Claude Code de site et vérifier qu'il est compris sans question. Supprimer ensuite les fiches et épingles d'essai si Edgar ne les garde pas.
- [ ] **Step 5 : Tests et build.** Serveur dev arrêté : `npm test && npm run build`. Expected : tout passe.
- [ ] **Step 6 : Fusion après accord explicite d'Edgar.** `BIBLIO_AGENT_SECRET` posé dans Vercel (production) par Edgar avec `vercel env add BIBLIO_AGENT_SECRET production --value … --non-interactive` lancé par son script ; puis `git checkout main && git merge --no-ff bibliotheque-prompts && git push`. Vérifier le déploiement et un `GET` de l'agent sur la production.
- [ ] **Step 7 : Contexte.** Proposer à Edgar la mise à jour de `CLAUDE.md` (section Hub Agence) et de `context/` via `/update`.
