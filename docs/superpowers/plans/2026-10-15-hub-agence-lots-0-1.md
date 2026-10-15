# Hub Agence, lots 0 et 1 : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en ligne un hub interne pour l'agence, copié de l'Orbikal Hub, avec la Bibliothèque de références visuelles et les Briefs saisis à la main (avec références épinglées).

**Architecture:** Copie de fichiers de `jarvis-beepurst/livrables/interne/orbikal-hub` vers `livrables/hub-agence/` (dépôt git indépendant), élagage des modules propres à Orbikal, puis ajout de tables Supabase et de pages Next.js App Router. La logique pure (validation, normalisation, filtres) vit dans `src/lib/*.ts` et est testée avec le lanceur de tests de Node. Les routes API et les pages suivent le patron de `prospects` de l'original (route handlers + composants client en styles inline).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript 5.8, Tailwind 4, Supabase (`@supabase/supabase-js` 2, Postgres + Storage), Vercel, Node 26 (`node --test`, TypeScript natif).

**Spec:** `docs/superpowers/specs/2026-10-15-hub-agence-design.md` (lots 0 et 1 uniquement ; lots 2 à 5 feront l'objet de plans séparés).

## Global Constraints

- **Ne jamais modifier** `/Users/ed/Desktop/jarvis-beepurst/livrables/interne/orbikal-hub` : lecture et copie seulement.
- `livrables/hub-agence/` est un **dépôt git indépendant**, ajouté au `.gitignore` de la racine du workspace, jamais commité depuis la racine. Toutes les commandes `git` des tâches 2 à 11 s'exécutent **dans** `livrables/hub-agence/`.
- Aucune variable d'environnement ne pointe vers Orbikal. Nouveau projet Supabase, nouveau projet Vercel.
- Tables : `id uuid` par défaut `gen_random_uuid()`, `created_at` et `updated_at`, **RLS activée sans policy**.
- Valeurs exactes :
  - `comptes.source` ∈ `reseau`, `ancien_client`, `formulaire`, `prospection`, `autre`
  - `comptes.statut` ∈ `a_contacter`, `contacte`, `rdv`, `devis_envoye`, `client`, `perdu`
  - `projets.type` ∈ `vitrine`, `refonte`, `maintenance`, `autre` ; `projets.statut` ∈ `brief`, `maquette`, `production`, `recette`, `livre`, `maintenance` ; `projets.outil` ∈ `framer`, `webflow`, `autre` ou nul
  - `briefs.source` ∈ `tally`, `manuel`, `formulaire_site` ; `briefs.statut` ∈ `recu`, `complete`, `valide`
  - `bibliotheque.type_section` ∈ `hero`, `navigation`, `services`, `temoignages`, `tarifs`, `faq`, `contact`, `footer`, `page_complete`, `autre`
  - `bibliotheque.outil` ∈ `aucun`, `framer`, `webflow`
- Captures : PNG, JPEG ou WebP, **5 Mo maximum**, bucket Supabase public `bibliotheque`.
- Ne jamais lancer `npm run build` pendant qu'un `npm run dev` tourne (même dossier `.next`).
- Interface en français. Pas de tiret long (—) dans les textes visibles.
- Node 26 exécute le TypeScript en retirant les types : dans les fichiers testés, pas d'`enum`, pas de `namespace`, imports de types en `import type`.

## Review Focus

1. **Capture non image ou trop lourde** (PDF, HEIC, 12 Mo) : refus 400 avec un message clair, aucun objet laissé dans le bucket. Test : `validerCapture` (tâche 5).
2. **Email déjà connu, avec une casse ou des espaces différents** (`Marie@Exemple.fr ` puis `marie@exemple.fr`) : le brief se rattache au compte existant, pas de doublon. Tests : `normaliserEmail` (tâche 8) + index unique sur `lower(email)` (tâche 3).
3. **Même référence épinglée deux fois sur un brief** : pas d'erreur, une seule épingle. Test : route idempotente via `upsert ... ignoreDuplicates` (tâche 9), vérifiée à la main en tâche 11.
4. **Référence supprimée alors qu'elle est épinglée** : l'épingle disparaît, la fiche du brief s'affiche normalement. Clé étrangère `on delete cascade` (tâche 3), vérifiée en tâche 11.
5. **Tags saisis en vrac** (`" Minimal, minimal ,, Bois "`) : tags propres, en minuscules, sans doublon ni vide. Test : `parserTags` (tâche 5).

---

## Structure des fichiers

Dans `livrables/hub-agence/` :

| Fichier | Rôle |
|---|---|
| `src/lib/bibliotheque.ts` | Types, constantes, `parserTags`, `validerCapture`, `parserReference`, `filtrerReferences` |
| `src/lib/comptes.ts` | Types, constantes, `normaliserEmail`, `parserCompteMinimal` |
| `src/lib/briefs.ts` | Types, constantes, `BRIEF_CHAMPS`, `parserReponses`, `parserBriefMaj` |
| `src/app/api/bibliotheque/route.ts` | GET liste, POST création (multipart) |
| `src/app/api/bibliotheque/[id]/route.ts` | PATCH, DELETE |
| `src/app/api/comptes/route.ts` | GET liste minimale, POST |
| `src/app/api/briefs/route.ts` | GET liste, POST création (compte existant ou nouveau) |
| `src/app/api/briefs/[id]/route.ts` | GET fiche complète, PATCH |
| `src/app/api/briefs/[id]/references/route.ts` | POST épingler, DELETE désépingler |
| `src/app/(app)/bibliotheque/page.tsx` | Galerie, filtres, ajout |
| `src/app/(app)/briefs/page.tsx` | Liste, création |
| `src/app/(app)/briefs/[id]/page.tsx` | Fiche brief, références épinglées |
| `src/app/(app)/reglages/page.tsx` | Notifications push, révocation des sessions |
| `src/components/ui/form-styles.ts` | Styles d'input et de label partagés |
| `supabase/schema.sql` | Tables techniques + tables agence du lot 1 + bucket |
| `scripts/test-bibliotheque.ts`, `scripts/test-briefs.ts` | Tests |

---

### Task 1: Copier l'original et élaguer

**Files:**
- Create: `livrables/hub-agence/` (copie)
- Modify: `/Users/ed/Desktop/jarvis-ecom/.gitignore`

**Interfaces:**
- Produces: un dossier `livrables/hub-agence/` contenant uniquement les fichiers gardés, dépôt git initialisé.

- [ ] **Step 1: Copier sans les artefacts**

```bash
mkdir -p /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
rsync -a \
  --exclude node_modules --exclude .next --exclude tsconfig.tsbuildinfo \
  --exclude '.env*' --exclude .vercel --exclude plan-tiktok-carrousels.json \
  /Users/ed/Desktop/jarvis-beepurst/livrables/interne/orbikal-hub/ \
  /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence/
```

- [ ] **Step 2: Supprimer les modules retirés**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
rm -rf \
  "src/app/(app)/annonces" "src/app/(app)/clients" "src/app/(app)/connexions" \
  "src/app/(app)/creatives-ads" "src/app/(app)/creatives" "src/app/(app)/emails" \
  "src/app/(app)/google-ads" "src/app/(app)/mailing" "src/app/(app)/meta-ads" \
  "src/app/(app)/organique" "src/app/(app)/posts" "src/app/(app)/prospects" \
  "src/app/(app)/revenus" "src/app/(app)/support" \
  src/app/api/ads src/app/api/announcements src/app/api/clients src/app/api/creatives \
  src/app/api/cron src/app/api/funnel src/app/api/google-ads src/app/api/linkedin \
  src/app/api/mika src/app/api/post-ideas src/app/api/posts src/app/api/prospects \
  src/app/api/support \
  src/components/agenda-bar.css src/components/agenda-bar.tsx \
  src/components/charts/mail-bar.tsx src/components/charts/spend-bar.tsx src/components/charts/views-bar.tsx \
  src/components/creatives src/components/failing-connectors.css src/components/failing-connectors.tsx \
  src/components/funnel-block.tsx src/components/google-ads src/components/mika src/components/posts \
  src/components/support \
  src/lib/ad-generator.ts src/lib/agenda.ts src/lib/ai-error.ts src/lib/announcements-client.ts \
  src/lib/brevo.ts src/lib/calendar-dates.ts src/lib/clients.ts src/lib/creative-caption-generator.ts \
  src/lib/creative-captions.ts src/lib/creative-meta.ts src/lib/creative-scope.ts \
  src/lib/funnel-outcomes.ts src/lib/funnel.ts src/lib/google-ads-campagne-api.ts \
  src/lib/google-ads-campagne.ts src/lib/google-ads.ts src/lib/groq-model.ts \
  src/lib/lifecycle-emails.ts src/lib/linkedin.ts src/lib/meta-ads.ts src/lib/meta-campaign.ts \
  src/lib/meta-organic.ts src/lib/mika-hub.ts src/lib/mika-pages-client.ts src/lib/mika-stream.ts \
  src/lib/mrr-history.ts src/lib/organic-performance.ts src/lib/organic-view.ts \
  src/lib/prospect-sync.ts src/lib/prospection src/lib/prospects.ts src/lib/publish-post.ts \
  src/lib/reminders.ts src/lib/revenue.ts src/lib/social-platforms.ts src/lib/support-client.ts \
  src/lib/token-crypto.ts \
  public/creatives public/template-swatches public/mika-avatar.png public/logo-orbikal.png \
  scripts/backfill-carrousels.mjs scripts/check-mika-stream.mjs scripts/import-creatives.mjs \
  scripts/remove-creatives.mjs scripts/replace-creative.mjs scripts/schedule-calendar.mjs \
  scripts/test-google-ads-campagne.ts scripts/test-meta-campaign.ts scripts/test-prospection-sirene.ts \
  supabase
mkdir supabase
```

`agenda.ts` et `reminders.ts` sont retirés ici et **réécrits au lot 3** : ceux de l'original agrègent Meta Ads, Google Ads, support et clients SaaS, tous supprimés.

- [ ] **Step 3: Exclure le dossier du dépôt racine**

Ajouter à la fin de `/Users/ed/Desktop/jarvis-ecom/.gitignore` :

```
# Hub Agence : depot git independant (Beepurst/hub-agence), ne jamais commiter depuis la racine
livrables/hub-agence/
```

Run: `cd /Users/ed/Desktop/jarvis-ecom && git check-ignore livrables/hub-agence/package.json`
Expected: affiche `livrables/hub-agence/package.json`

- [ ] **Step 4: Initialiser le dépôt**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
git init -b main
```

Pas de commit à ce stade : le code ne compile pas encore. Le premier commit est à la fin de la tâche 2.

- [ ] **Step 5: Vérifier que l'original n'a pas bougé**

Run: `cd /Users/ed/Desktop/jarvis-beepurst && git status --short livrables/interne/orbikal-hub | head`
Expected: aucune ligne (ou exactement les mêmes lignes qu'avant la tâche, si l'original avait déjà des modifications non commitées).

---

### Task 2: Recâbler le socle et faire passer le build

**Files:**
- Modify: `src/lib/channels.tsx`, `src/lib/source-status.ts`, `src/components/app-shell.tsx`, `src/components/sidebar.tsx`, `src/components/icons.tsx`, `src/app/layout.tsx`, `src/app/login/page.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/app/api/login/route.ts` (commentaire seulement), `public/manifest.json`, `public/sw.js`, `next.config.ts`, `vercel.json`, `package.json`, `src/lib/notion.ts` (commentaires), `README.md`
- Create: `src/app/(app)/reglages/page.tsx`, `src/components/ui/form-styles.ts`, `.env.example`

**Interfaces:**
- Produces: `CHANNELS` avec les clés `dashboard`, `todo`, `briefs`, `bibliotheque`, `analytics`, `seo`, `reglages` ; icônes `BriefIcon`, `LibraryIcon`, `SettingsIcon`, `FolderIcon` ; `inputStyle` et `labelStyle` exportés par `@/components/ui/form-styles`.

- [ ] **Step 1: Ajouter les icônes**

À la fin de `src/components/icons.tsx` :

```tsx
export function BriefIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

export function LibraryIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function FolderIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function SettingsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
```

Puis supprimer de `icons.tsx` les exports qui ne sont plus importés nulle part après le Step 2 : `RevenueIcon`, `MetaIcon`, `GoogleAdsIcon`, `MailingIcon`, `ProspectsIcon`, `ClientsIcon`, `SupportIcon`, `PostsIcon`, `PlugIcon`, `MegaphoneIcon`, `ImageIcon`. Vérifier chaque nom avant suppression :

Run: `grep -rn "RevenueIcon\|MetaIcon\|GoogleAdsIcon\|MailingIcon\|ProspectsIcon\|ClientsIcon\|SupportIcon\|PostsIcon\|PlugIcon\|MegaphoneIcon\|ImageIcon" src --include=*.tsx | grep -v "components/icons.tsx"`
Expected: aucune ligne (sinon garder l'icône encore utilisée).

- [ ] **Step 2: Réécrire la navigation**

Remplacer intégralement `src/lib/channels.tsx` :

```tsx
import type { ComponentType } from "react";
import {
  DashboardIcon,
  TodoIcon,
  FolderIcon,
  BriefIcon,
  LibraryIcon,
  AnalyticsIcon,
  SeoIcon,
  SettingsIcon,
} from "@/components/icons";

export interface ChannelDef {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  accent: string;
}

// Le statut de connexion ne vit PAS ici : il est derive de l'environnement par
// `getChannelConnectivity()` (source-status.ts) et descendu depuis le layout. Un statut ecrit
// en dur se perime en silence (lecon de l'Orbikal Hub, d'ou ce hub est copie).
//
// Les pages Comptes, Devis et Factures arrivent aux lots 3 et 4 : elles ne figurent pas ici
// tant qu'elles n'existent pas, pour ne pas afficher de lien vers une 404.
export const CHANNELS: Record<string, ChannelDef> = {
  dashboard: { href: "/dashboard", label: "Dashboard", icon: DashboardIcon, accent: "#C45E1A" },
  todo: { href: "/todo", label: "To-do", icon: TodoIcon, accent: "#F59E0B" },
  briefs: { href: "/briefs", label: "Briefs", icon: BriefIcon, accent: "#8B5CF6" },
  bibliotheque: { href: "/bibliotheque", label: "Bibliothèque", icon: LibraryIcon, accent: "#14B8A6" },
  analytics: { href: "/analytics", label: "Analytics", icon: AnalyticsIcon, accent: "#F9AB00" },
  seo: { href: "/seo", label: "SEO", icon: SeoIcon, accent: "#14B8A6" },
  reglages: { href: "/reglages", label: "Réglages", icon: SettingsIcon, accent: "#94A3B8" },
};

export const NAV_GROUPS: { title: string | null; keys: string[] }[] = [
  { title: null, keys: ["dashboard", "todo"] },
  { title: "Production", keys: ["briefs", "bibliotheque"] },
  { title: "Mesure", keys: ["analytics", "seo"] },
  { title: null, keys: ["reglages"] },
];
```

`FolderIcon` est importé pour la page Projets du lot 3 ; si le linter signale l'import inutilisé, le retirer de cet import et le laisser exporté par `icons.tsx`.

- [ ] **Step 3: Réécrire l'état des sources**

Remplacer intégralement `src/lib/source-status.ts` :

```ts
// Etat de branchement des sources du Hub, derive de l'environnement et jamais ecrit en dur.
//
// Contrainte qui dicte la forme du fichier : il est importe par le layout, donc par TOUTES
// les pages. Il ne doit tirer aucune dependance lourde. Les libs concernees reimportent
// depuis ici : la condition reste ecrite une seule fois.

export function isGoogleServiceAccountConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
}

export function isAnalyticsConfigured(): boolean {
  return isGoogleServiceAccountConfigured() && Boolean(process.env.GA4_PROPERTY_ID);
}

export function isSearchConsoleConfigured(): boolean {
  return isGoogleServiceAccountConfigured() && Boolean(process.env.GSC_SITE_URL);
}

/**
 * Pastille de la sidebar, par cle de canal. Une cle absente = pas de notion de connexion,
 * la pastille ne s'affiche pas. Serveur uniquement : lit `process.env`.
 */
export function getChannelConnectivity(): Record<string, boolean> {
  return {
    seo: isSearchConsoleConfigured(),
    analytics: isAnalyticsConfigured(),
  };
}
```

- [ ] **Step 4: Retirer Mika du shell, renommer la marque**

Dans `src/components/app-shell.tsx` : supprimer la ligne `import MikaWidget from "@/components/mika/mika-widget";` et l'élément `<MikaWidget ... />` (rechercher `MikaWidget`).

Remplacer `Orbikal Hub` par `Hub Agence` dans `src/components/sidebar.tsx`, `src/app/login/page.tsx`, `public/sw.js`.

Dans `src/app/layout.tsx`, les métadonnées deviennent :

```ts
  title: "Hub Agence",
  description: "Pilotage interne de l'agence : production des sites et suivi commercial",
```

`public/manifest.json` : `"name": "Hub Agence"`, `"description": "Pilotage interne de l'agence : briefs, bibliothèque, clients et devis."`.

Run: `grep -rni "orbikal" src public --include=*.ts --include=*.tsx --include=*.json --include=*.js | grep -v "^src/.*://"`
Expected: seules restent des mentions dans des **commentaires** qui expliquent la lignée du code (à garder, comme dans le Hub Ecom). Toute mention dans une chaîne affichée ou une URL doit disparaître.

- [ ] **Step 5: Styles de formulaire partagés**

Create `src/components/ui/form-styles.ts` (repris de l'ancienne page Prospects, partagé par toutes les nouvelles pages) :

```ts
import type { CSSProperties } from "react";

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  background: "var(--color-input)",
  border: "1px solid rgba(255,255,255,.08)",
  color: "#F1F5F9",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
};

export const labelStyle: CSSProperties = {
  fontSize: 13.5,
  fontWeight: 500,
  color: "#8b8f98",
  marginBottom: 6,
  display: "block",
};

export const buttonStyle = (accent: string): CSSProperties => ({
  padding: "9px 16px",
  borderRadius: 8,
  background: accent,
  color: "#fff",
  border: "none",
  fontSize: 14.5,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
});

export const cardStyle: CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid rgba(255,255,255,.06)",
  borderRadius: 12,
  padding: 18,
};
```

- [ ] **Step 6: Dashboard provisoire et page Réglages**

Remplacer intégralement `src/app/(app)/dashboard/page.tsx` (le vrai dashboard arrive au lot 4) :

```tsx
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CHANNELS } from "@/lib/channels";
import { DashboardIcon } from "@/components/icons";
import { cardStyle } from "@/components/ui/form-styles";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader icon={DashboardIcon} accent={CHANNELS.dashboard.accent} title="Dashboard" subtitle="Les chiffres arrivent avec les devis et les factures (lot 4)." />
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <Link href="/briefs" style={{ ...cardStyle, display: "block" }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Briefs</div>
          <div style={{ color: "#8b8f98", fontSize: 14 }}>Créer et compléter les briefs clients.</div>
        </Link>
        <Link href="/bibliotheque" style={{ ...cardStyle, display: "block" }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Bibliothèque</div>
          <div style={{ color: "#8b8f98", fontSize: 14 }}>Les sections et sites de référence.</div>
        </Link>
      </div>
    </div>
  );
}
```

Create `src/app/(app)/reglages/page.tsx` :

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { CHANNELS } from "@/lib/channels";
import { SettingsIcon } from "@/components/icons";
import { PushToggle } from "@/components/push-toggle";
import { RevokeSessions } from "@/components/revoke-sessions";

export default function ReglagesPage() {
  return (
    <div>
      <PageHeader icon={SettingsIcon} accent={CHANNELS.reglages.accent} title="Réglages" />
      <div style={{ display: "grid", gap: 18, maxWidth: 640 }}>
        <PushToggle />
        <RevokeSessions />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Configuration**

`vercel.json` devient (plus aucun cron au lot 0 ; ceux des relances arrivent au lot 3) :

```json
{
  "framework": "nextjs"
}
```

Le `"git": { "deploymentEnabled": false }` de l'original est volontairement retiré : le hub se déploie depuis GitHub (tâche 4).

`next.config.ts` : supprimer la ligne `serverExternalPackages: [...]` et son commentaire ; dans le commentaire des en-têtes, remplacer la phrase sur les tickets support et le MRR par `// Le hub expose les donnees des clients de l'agence (briefs, coordonnees).` ; remplacer le commentaire de `img-src` par `// les captures de la bibliotheque sont servies par le Storage Supabase`.

`package.json` : `"name": "hub-agence"` ; retirer des dépendances `@sparticuz/chromium-min`, `playwright-core`, `stripe` ; retirer des devDependencies `playwright` ; remplacer le bloc `scripts` par :

```json
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "node --import ./scripts/alias-hook.mjs --test scripts/test-*.ts"
  },
```

`src/lib/notion.ts` : remplacer le commentaire `/** Page « Orbikal — To Do ». */` par `/** Page Notion de la to-do (NOTION_TODO_PAGE_ID). */`. La page Notion « Agence » est branchée au lot 5.

Create `.env.example` :

```
# Socle (obligatoire)
INTERNAL_APP_PASSWORD=
INTERNAL_APP_SESSION_SECRET=      # openssl rand -hex 32
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Notifications push (optionnel) : node scripts/generate-vapid-keys.mjs
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

# To-do Notion (lot 5)
NOTION_TOKEN=
NOTION_TODO_PAGE_ID=

# GA4 et Search Console du site de l'agence (lot 5)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GA4_PROPERTY_ID=
GSC_SITE_URL=
```

Avant d'écrire ce fichier, vérifier les noms exacts des variables VAPID lues par `src/lib/push.ts` et `src/components/push-toggle.tsx` :

Run: `grep -rhno "process.env.[A-Z_]*" src | sed 's/.*process.env.//' | sort -u`
Expected: la liste complète des variables encore lues. `.env.example` doit en contenir exactement la liste (ni plus, ni moins). Si une variable de la liste ne correspond à aucun module gardé, c'est un reste à nettoyer.

- [ ] **Step 8: Installer et compiler**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
npm install
npx tsc --noEmit
```

Expected: 0 erreur. Toute erreur restante est un import vers un module supprimé : supprimer l'import et son usage, jamais recréer le module. Les fichiers les plus probables sont `src/app/(app)/todo/page.tsx`, `src/app/(app)/analytics/page.tsx`, `src/lib/analytics.ts`, `src/lib/traffic-source.ts`.

- [ ] **Step 9: Tests et build**

```bash
npm test
npm run build
```

Expected: les tests `test-session-epoch.mjs` et `test-session-revocation.mjs` ne sont pas matchés par le glob `test-*.ts` ; les lancer à part :

```bash
node scripts/test-session-epoch.mjs && node scripts/test-session-revocation.mjs
```

Expected: PASS. Si l'un d'eux exige une connexion Supabase réelle, noter qu'il sera relancé en tâche 4 et passer. `npm run build` : succès, les routes listées sont `/`, `/login`, `/dashboard`, `/todo`, `/analytics`, `/seo`, `/reglages` et les API `login`, `logout`, `push/*`, `sessions/revoke`, `todo`.

- [ ] **Step 10: README et premier commit**

Remplacer intégralement `README.md` :

```markdown
# Hub Agence

Cockpit interne mono-utilisateur de l'agence de création de sites : briefs clients,
bibliothèque de références, puis comptes, projets, devis et factures.

Copié le 15/10/2026 de l'Orbikal Hub (dépôt Beepurst/Orbikal, `livrables/interne/orbikal-hub`)
et élagué. Les commentaires qui citent la lignée sont gardés volontairement : ils expliquent
pourquoi le code est comme il est. Ils ne connectent rien.

Spec : `jarvis-ecom/docs/superpowers/specs/2026-10-15-hub-agence-design.md`.

## Deux règles, valables partout

- Une source non configurée dégrade proprement, elle ne plante pas (`src/lib/source-status.ts`).
- Une donnée absente n'est pas une donnée nulle.

## Démarrer

    npm install
    cp .env.example .env.local   # remplir au moins les 4 variables du socle
    npm run dev

L'authentification est désactivée en `NODE_ENV === "development"`, jamais sur Vercel.
Ne jamais lancer `npm run build` pendant qu'un `npm run dev` tourne.

## Base de données

Exécuter `supabase/schema.sql` dans le SQL Editor du projet Supabase du hub.

## Tests

    npm test
```

```bash
git add -A
git commit -m "Copie elaguee de l'Orbikal Hub, socle du Hub Agence"
```

---

### Task 3: Schéma Supabase

**Files:**
- Create: `supabase/schema.sql`

**Interfaces:**
- Produces: tables `hub_session_epoch`, `rate_limits`, `push_subscriptions`, `push_reminder_state`, `comptes`, `projets`, `briefs`, `bibliotheque`, `brief_references` ; fonctions `bump_hub_session_epoch()`, `consume_rate_limit(text, int, int)` ; bucket public `bibliotheque`.

- [ ] **Step 1: Récupérer les tables techniques de l'original**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
O=/Users/ed/Desktop/jarvis-beepurst/livrables/interne/orbikal-hub/supabase
{
  echo "-- Hub Agence : schema complet. A executer dans le SQL Editor du projet Supabase du hub."
  echo "-- Idempotent : peut etre rejoue sans casse."
  echo
  echo "-- ===== Socle technique, copie de l'Orbikal Hub ====="
  cat "$O/hub_session_revocation.sql" "$O/rate_limits.sql" "$O/push_notifications.sql"
} > supabase/schema.sql
grep -n "enable row level security" supabase/schema.sql
```

Expected: RLS activée sur `hub_session_epoch` et `rate_limits`. Si `push_subscriptions` et `push_reminder_state` n'ont pas de ligne `enable row level security`, l'ajouter à la fin du bloc socle :

```sql
alter table push_subscriptions enable row level security;
alter table push_reminder_state enable row level security;
```

- [ ] **Step 2: Ajouter les tables agence du lot 1**

Ajouter à la fin de `supabase/schema.sql` :

```sql
-- ===== Agence, lot 1 =====
-- RLS activee sans policy partout : seule la cle service role (serveur) lit et ecrit.

create table if not exists comptes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  entreprise text,
  email text,
  telephone text,
  source text check (source in ('reseau', 'ancien_client', 'formulaire', 'prospection', 'autre')),
  statut text not null default 'a_contacter'
    check (statut in ('a_contacter', 'contacte', 'rdv', 'devis_envoye', 'client', 'perdu')),
  prochaine_action text,
  prochaine_action_le date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Un email = un compte, quelle que soit la casse. C'est ce qui rattache un brief entrant au
-- bon compte au lieu d'en creer un doublon (lot 2, Tally).
create unique index if not exists comptes_email_unique on comptes (lower(email)) where email is not null;

create table if not exists projets (
  id uuid primary key default gen_random_uuid(),
  compte_id uuid not null references comptes(id) on delete cascade,
  nom text not null,
  type text check (type in ('vitrine', 'refonte', 'maintenance', 'autre')),
  statut text not null default 'brief'
    check (statut in ('brief', 'maquette', 'production', 'recette', 'livre', 'maintenance')),
  livraison_prevue_le date,
  url_preprod text,
  url_prod text,
  url_reporting text,
  outil text check (outil in ('framer', 'webflow', 'autre')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  compte_id uuid not null references comptes(id) on delete cascade,
  projet_id uuid references projets(id) on delete set null,
  source text not null check (source in ('tally', 'manuel', 'formulaire_site')),
  source_id text,
  reponses jsonb not null default '{}'::jsonb,
  texte text,
  brut jsonb,
  statut text not null default 'recu' check (statut in ('recu', 'complete', 'valide')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Anti-doublon des envois entrants : Tally reessaie un webhook en echec.
create unique index if not exists briefs_source_unique on briefs (source, source_id) where source_id is not null;

create table if not exists bibliotheque (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  url_source text,
  capture_path text,
  type_section text check (type_section in ('hero', 'navigation', 'services', 'temoignages', 'tarifs', 'faq', 'contact', 'footer', 'page_complete', 'autre')),
  secteur text,
  tags text[] not null default '{}',
  outil text not null default 'aucun' check (outil in ('aucun', 'framer', 'webflow')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brief_references (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs(id) on delete cascade,
  reference_id uuid not null references bibliotheque(id) on delete cascade,
  commentaire text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brief_id, reference_id)
);

alter table comptes enable row level security;
alter table projets enable row level security;
alter table briefs enable row level security;
alter table bibliotheque enable row level security;
alter table brief_references enable row level security;

-- Captures de la bibliotheque : bucket PUBLIC. Ce sont des captures de sites publics, rien de
-- confidentiel, et une URL publique evite de signer chaque vignette de la galerie.
insert into storage.buckets (id, name, public)
values ('bibliotheque', 'bibliotheque', true)
on conflict (id) do nothing;
```

- [ ] **Step 3: Vérifier la syntaxe localement (si Postgres est disponible)**

Run: `which psql && echo "psql present" || echo "pas de psql, verification en tache 4"`

Si `psql` et une base locale jetable existent : `psql -d <base_jetable> -f supabase/schema.sql` (le `insert into storage.buckets` échouera hors Supabase, c'est attendu). Sinon la vérification se fait à l'exécution dans Supabase, tâche 4.

- [ ] **Step 4: Commit**

```bash
git add supabase/schema.sql
git commit -m "Schema Supabase : socle technique et tables du lot 1"
```

---

### Task 4: Mise en ligne du socle (avec Edgar)

**Files:** aucun fichier de code. Actions sur Supabase, GitHub, Vercel.

**Interfaces:**
- Produces: un hub en ligne derrière mot de passe, URL Vercel notée dans le README.

Les Steps 1 à 3 demandent Edgar : l'exécutant prépare les commandes et s'arrête pour lui demander de les faire ou de les valider.

- [ ] **Step 1 (Edgar): Projet Supabase**

Vérifier dans le tableau de bord Supabase le nombre de projets actifs sur l'offre gratuite. Si la limite est atteinte, mettre en pause le projet Supabase du Hub Ecom (inutilisé). Créer le projet `hub-agence`, région Europe (Paris ou Francfort). Ouvrir le SQL Editor, coller et exécuter `supabase/schema.sql`.

Expected: « Success. No rows returned ». Dans Table Editor : les 9 tables existent. Dans Storage : le bucket `bibliotheque` existe et est marqué Public.

- [ ] **Step 2 (Edgar): Dépôt GitHub**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
gh repo create Beepurst/hub-agence --private --source . --push
```

Expected: dépôt privé créé, branche `main` poussée.

- [ ] **Step 3 (Edgar): Projet Vercel et variables**

```bash
vercel link --yes --project hub-agence
openssl rand -hex 32   # -> INTERNAL_APP_SESSION_SECRET
printf '%s' "<mot de passe choisi par Edgar>" | vercel env add INTERNAL_APP_PASSWORD production
printf '%s' "<secret genere>" | vercel env add INTERNAL_APP_SESSION_SECRET production
printf '%s' "<URL du projet Supabase>" | vercel env add SUPABASE_URL production --no-sensitive
printf '%s' "<cle service_role>" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel --prod
```

Note héritée de l'Orbikal Hub : sur ce compte, le défaut des variables Vercel peut être `Sensitive`. Une variable qui n'est pas un secret (`SUPABASE_URL`) porte `--no-sensitive` explicitement. Vérifier la syntaxe exacte de `vercel env add` avec `vercel env add --help` avant de lancer.

- [ ] **Step 4: Vérifier en ligne**

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://<url-vercel>/dashboard
curl -s -o /dev/null -w "%{http_code}\n" https://<url-vercel>/manifest.json
```

Expected: `307 https://<url-vercel>/login` puis `200`.

Puis Edgar se connecte avec le mot de passe, ouvre Dashboard, To-do (« non configuré » attendu), Analytics (« non configuré »), Réglages. Aucune page d'erreur.

Relancer les tests de session s'ils avaient été mis de côté en tâche 2 :

```bash
node scripts/test-session-epoch.mjs && node scripts/test-session-revocation.mjs
```

- [ ] **Step 5: Noter l'URL et commiter**

Ajouter au README, sous le titre : `En ligne : https://<url-vercel> (mot de passe).`

```bash
git add README.md && git commit -m "README : URL de production" && git push
```

---

### Task 5: Logique de la bibliothèque (TDD)

**Files:**
- Create: `src/lib/bibliotheque.ts`
- Test: `scripts/test-bibliotheque.ts`

**Interfaces:**
- Produces:
  - `TYPES_SECTION: readonly string[]`, `TYPE_SECTION_LABELS: Record<TypeSection, string>`, `type TypeSection`
  - `OUTILS: readonly ["aucun", "framer", "webflow"]`, `type Outil`
  - `interface Reference { id: string; titre: string; url_source: string | null; capture_path: string | null; capture_url: string | null; type_section: TypeSection | null; secteur: string | null; tags: string[]; outil: Outil; note: string | null; created_at: string; updated_at: string }`
  - `parserTags(raw: unknown): string[]`
  - `validerCapture(file: { type: string; size: number }): string | null` (message d'erreur ou `null`)
  - `CAPTURE_EXTENSIONS: Record<string, string>`
  - `parserReference(input: Record<string, unknown>, mode: "creation" | "maj"): { ok: true; value: Record<string, unknown> } | { ok: false; error: string }`
  - `filtrerReferences(refs: Reference[], f: { type_section?: string; outil?: string; secteur?: string; tag?: string; texte?: string }): Reference[]`

- [ ] **Step 1: Écrire les tests**

Create `scripts/test-bibliotheque.ts` :

```ts
/**
 * Tests de lib/bibliotheque.ts : la normalisation des saisies de la bibliotheque.
 *
 * Lancer : node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parserTags,
  validerCapture,
  parserReference,
  filtrerReferences,
  type Reference,
} from "@/lib/bibliotheque";

test("parserTags : minuscules, sans espaces, sans vides ni doublons, ordre conserve", () => {
  assert.deepEqual(parserTags(" Minimal, minimal ,, Bois "), ["minimal", "bois"]);
  assert.deepEqual(parserTags(["Sombre", " sombre", "", "Serif"]), ["sombre", "serif"]);
  assert.deepEqual(parserTags(undefined), []);
  assert.deepEqual(parserTags(42), []);
});

test("validerCapture : accepte PNG, JPEG, WebP jusqu'a 5 Mo", () => {
  assert.equal(validerCapture({ type: "image/png", size: 1000 }), null);
  assert.equal(validerCapture({ type: "image/jpeg", size: 5 * 1024 * 1024 }), null);
  assert.equal(validerCapture({ type: "image/webp", size: 10 }), null);
});

test("validerCapture : refuse un autre format ou un fichier trop lourd", () => {
  assert.match(validerCapture({ type: "application/pdf", size: 10 }) ?? "", /Format non supporté/);
  assert.match(validerCapture({ type: "image/heic", size: 10 }) ?? "", /Format non supporté/);
  assert.match(validerCapture({ type: "", size: 10 }) ?? "", /inconnu/);
  assert.match(validerCapture({ type: "image/png", size: 5 * 1024 * 1024 + 1 }) ?? "", /5 Mo/);
});

test("parserReference creation : titre obligatoire", () => {
  const r = parserReference({ titre: "   " }, "creation");
  assert.equal(r.ok, false);
});

test("parserReference creation : nettoie et applique les defauts", () => {
  const r = parserReference(
    { titre: " Hero Aesop ", url_source: " https://aesop.com ", type_section: "hero", tags: "Minimal, Serif", outil: "", secteur: "  ", note: "" },
    "creation",
  );
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.deepEqual(r.value, {
    titre: "Hero Aesop",
    url_source: "https://aesop.com",
    type_section: "hero",
    secteur: null,
    tags: ["minimal", "serif"],
    outil: "aucun",
    note: null,
  });
});

test("parserReference : refuse une valeur hors liste", () => {
  assert.equal(parserReference({ titre: "X", type_section: "carrousel" }, "creation").ok, false);
  assert.equal(parserReference({ titre: "X", outil: "wix" }, "creation").ok, false);
});

test("parserReference : refuse une URL qui n'est pas http(s)", () => {
  assert.equal(parserReference({ titre: "X", url_source: "javascript:alert(1)" }, "creation").ok, false);
  assert.equal(parserReference({ titre: "X", url_source: "pas une url" }, "creation").ok, false);
});

test("parserReference maj : ne touche que les champs fournis", () => {
  const r = parserReference({ note: "Très bon rythme" }, "maj");
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.deepEqual(r.value, { note: "Très bon rythme" });
});

test("parserReference maj : un titre vide est refuse", () => {
  assert.equal(parserReference({ titre: "" }, "maj").ok, false);
});

function ref(o: Partial<Reference>): Reference {
  return {
    id: "1", titre: "T", url_source: null, capture_path: null, capture_url: null,
    type_section: null, secteur: null, tags: [], outil: "aucun", note: null,
    created_at: "2026-10-15T00:00:00Z", updated_at: "2026-10-15T00:00:00Z", ...o,
  };
}

test("filtrerReferences : combine les filtres, texte insensible a la casse et aux accents", () => {
  const refs = [
    ref({ id: "a", titre: "Hero Cuisine Écrin", type_section: "hero", secteur: "cuisine", tags: ["bois"], outil: "webflow" }),
    ref({ id: "b", titre: "Tarifs studio", type_section: "tarifs", secteur: "studio", tags: ["minimal"] }),
    ref({ id: "c", titre: "Hero minimal", type_section: "hero", tags: ["minimal"], note: "ecrin sombre" }),
  ];
  assert.deepEqual(filtrerReferences(refs, { type_section: "hero" }).map((r) => r.id), ["a", "c"]);
  assert.deepEqual(filtrerReferences(refs, { type_section: "hero", tag: "minimal" }).map((r) => r.id), ["c"]);
  assert.deepEqual(filtrerReferences(refs, { outil: "webflow" }).map((r) => r.id), ["a"]);
  assert.deepEqual(filtrerReferences(refs, { texte: "ecrin" }).map((r) => r.id), ["a", "c"]);
  assert.deepEqual(filtrerReferences(refs, {}).map((r) => r.id), ["a", "b", "c"]);
  assert.deepEqual(filtrerReferences(refs, { type_section: "" }).map((r) => r.id), ["a", "b", "c"]);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque.ts`
Expected: FAIL, module `src/lib/bibliotheque.ts` introuvable.

- [ ] **Step 3: Implémenter**

Create `src/lib/bibliotheque.ts` :

```ts
// Bibliotheque de references visuelles : sections et sites que j'aime, a montrer en phase de
// brief et a reprendre en production. Logique pure, sans Supabase, testee par
// scripts/test-bibliotheque.ts.

export const TYPES_SECTION = [
  "hero", "navigation", "services", "temoignages", "tarifs", "faq", "contact", "footer", "page_complete", "autre",
] as const;
export type TypeSection = (typeof TYPES_SECTION)[number];

export const TYPE_SECTION_LABELS: Record<TypeSection, string> = {
  hero: "Hero",
  navigation: "Navigation",
  services: "Services",
  temoignages: "Témoignages",
  tarifs: "Tarifs",
  faq: "FAQ",
  contact: "Contact",
  footer: "Footer",
  page_complete: "Page complète",
  autre: "Autre",
};

export const OUTILS = ["aucun", "framer", "webflow"] as const;
export type Outil = (typeof OUTILS)[number];

export const OUTIL_LABELS: Record<Outil, string> = { aucun: "Inspiration", framer: "Framer", webflow: "Webflow" };

export interface Reference {
  id: string;
  titre: string;
  url_source: string | null;
  capture_path: string | null;
  /** Calculee par l'API depuis capture_path, jamais stockee. */
  capture_url: string | null;
  type_section: TypeSection | null;
  secteur: string | null;
  tags: string[];
  outil: Outil;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export const CAPTURE_MAX_BYTES = 5 * 1024 * 1024;
export const CAPTURE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export function parserTags(raw: unknown): string[] {
  const parts = typeof raw === "string" ? raw.split(",") : Array.isArray(raw) ? raw : [];
  const out: string[] = [];
  for (const p of parts) {
    if (typeof p !== "string") continue;
    const t = p.trim().toLowerCase();
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

export function validerCapture(file: { type: string; size: number }): string | null {
  if (!CAPTURE_EXTENSIONS[file.type]) {
    return `Format non supporté (${file.type || "inconnu"}). Attendu : PNG, JPEG ou WebP.`;
  }
  if (file.size > CAPTURE_MAX_BYTES) return "Capture trop lourde (5 Mo maximum).";
  return null;
}

const texteOuNull = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

function urlValide(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type Resultat = { ok: true; value: Record<string, unknown> } | { ok: false; error: string };

/**
 * Valide et nettoie une saisie. En "creation", tous les champs sont produits (defauts
 * appliques). En "maj", seuls les champs presents dans `input` sont produits.
 */
export function parserReference(input: Record<string, unknown>, mode: "creation" | "maj"): Resultat {
  const value: Record<string, unknown> = {};
  const has = (k: string) => mode === "creation" || input[k] !== undefined;

  if (has("titre")) {
    const titre = texteOuNull(input.titre);
    if (!titre) return { ok: false, error: "Le titre est obligatoire." };
    value.titre = titre;
  }
  if (has("url_source")) {
    const url = texteOuNull(input.url_source);
    if (url && !urlValide(url)) return { ok: false, error: "L'URL doit commencer par http:// ou https://." };
    value.url_source = url;
  }
  if (has("type_section")) {
    const t = texteOuNull(input.type_section);
    if (t && !(TYPES_SECTION as readonly string[]).includes(t)) return { ok: false, error: "Type de section invalide." };
    value.type_section = t;
  }
  if (has("secteur")) value.secteur = texteOuNull(input.secteur);
  if (has("tags")) value.tags = parserTags(input.tags);
  if (has("outil")) {
    const o = texteOuNull(input.outil) ?? "aucun";
    if (!(OUTILS as readonly string[]).includes(o)) return { ok: false, error: "Outil invalide." };
    value.outil = o;
  }
  if (has("note")) value.note = texteOuNull(input.note);

  return { ok: true, value };
}

const plier = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function filtrerReferences(
  refs: Reference[],
  f: { type_section?: string; outil?: string; secteur?: string; tag?: string; texte?: string },
): Reference[] {
  const texte = f.texte ? plier(f.texte.trim()) : "";
  return refs.filter((r) => {
    if (f.type_section && r.type_section !== f.type_section) return false;
    if (f.outil && r.outil !== f.outil) return false;
    if (f.secteur && plier(r.secteur ?? "") !== plier(f.secteur)) return false;
    if (f.tag && !r.tags.includes(f.tag)) return false;
    if (texte) {
      const foin = plier([r.titre, r.secteur ?? "", r.note ?? "", r.tags.join(" ")].join(" "));
      if (!foin.includes(texte)) return false;
    }
    return true;
  });
}
```

- [ ] **Step 4: Vérifier le succès**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-bibliotheque.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bibliotheque.ts scripts/test-bibliotheque.ts
git commit -m "Bibliotheque : validation, tags et filtres, avec tests"
```

---

### Task 6: API de la bibliothèque

**Files:**
- Create: `src/app/api/bibliotheque/route.ts`, `src/app/api/bibliotheque/[id]/route.ts`

**Interfaces:**
- Consumes: `parserReference`, `validerCapture`, `CAPTURE_EXTENSIONS`, `Reference` (tâche 5) ; `getSupabaseClient` (`@/lib/supabase`).
- Produces:
  - `GET /api/bibliotheque` → `{ references: Reference[] }` (plus récentes d'abord, `capture_url` calculée)
  - `POST /api/bibliotheque` (multipart : `titre`, `url_source`, `type_section`, `secteur`, `tags`, `outil`, `note`, `file` optionnel) → 201 `{ reference: Reference }`
  - `PATCH /api/bibliotheque/[id]` (JSON, champs partiels) → `{ reference: Reference }`
  - `DELETE /api/bibliotheque/[id]` → `{ ok: true }`, supprime aussi l'objet du bucket
  - `avecCaptureUrl(row: Omit<Reference, "capture_url">): Reference` et `BUCKET` dans `src/lib/bibliotheque-db.ts` (Next refuse les exports non-route dans un fichier `route.ts`).

- [ ] **Step 1: Helper serveur**

Create `src/lib/bibliotheque-db.ts` :

```ts
import { getSupabaseClient } from "@/lib/supabase";
import type { Reference } from "@/lib/bibliotheque";

export const BUCKET = "bibliotheque";

/** Ajoute l'URL publique de la capture a une ligne lue en base. */
export function avecCaptureUrl(row: Omit<Reference, "capture_url">): Reference {
  const capture_url = row.capture_path
    ? getSupabaseClient().storage.from(BUCKET).getPublicUrl(row.capture_path).data.publicUrl
    : null;
  return { ...row, capture_url };
}
```

- [ ] **Step 2: Liste et création**

Create `src/app/api/bibliotheque/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parserReference, validerCapture, CAPTURE_EXTENSIONS, type Reference } from "@/lib/bibliotheque";
import { avecCaptureUrl, BUCKET } from "@/lib/bibliotheque-db";

export const dynamic = "force-dynamic";

// GET /api/bibliotheque : toutes les references, plus recentes en premier. Le filtrage se fait
// cote client (filtrerReferences) : quelques centaines de lignes au plus.
export async function GET() {
  try {
    const { data, error } = await getSupabaseClient()
      .from("bibliotheque")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const references = (data ?? []).map((r) => avecCaptureUrl(r as Omit<Reference, "capture_url">));
    return NextResponse.json({ references });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/bibliotheque : multipart, une reference et sa capture facultative.
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const champs: Record<string, unknown> = {};
    for (const k of ["titre", "url_source", "type_section", "secteur", "tags", "outil", "note"]) {
      const v = form.get(k);
      if (typeof v === "string") champs[k] = v;
    }
    const parsed = parserReference(champs, "creation");
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const supabase = getSupabaseClient();
    let capture_path: string | null = null;
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      const erreur = validerCapture(file);
      if (erreur) return NextResponse.json({ error: erreur }, { status: 400 });
      // Nom assaini : on ne construit jamais un chemin avec le nom d'origine du fichier.
      capture_path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${CAPTURE_EXTENSIONS[file.type]}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(capture_path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("bibliotheque")
      .insert({ ...parsed.value, capture_path } as never)
      .select()
      .single();
    if (error) {
      // La ligne a echoue : on retire l'objet pour ne pas laisser d'orphelin dans le bucket.
      if (capture_path) await supabase.storage.from(BUCKET).remove([capture_path]);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ reference: avecCaptureUrl(data as Omit<Reference, "capture_url">) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Mise à jour et suppression**

Create `src/app/api/bibliotheque/[id]/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parserReference, type Reference } from "@/lib/bibliotheque";
import { avecCaptureUrl, BUCKET } from "@/lib/bibliotheque-db";

export const dynamic = "force-dynamic";

// PATCH /api/bibliotheque/[id] : champs partiels. La capture ne se remplace pas ici :
// supprimer et recreer la reference (rare, et evite toute logique d'orphelins).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = parserReference(await request.json(), "maj");
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { data, error } = await getSupabaseClient()
      .from("bibliotheque")
      .update({ ...parsed.value, updated_at: new Date().toISOString() } as never)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ reference: avecCaptureUrl(data as Omit<Reference, "capture_url">) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/bibliotheque/[id] : la ligne puis l'objet. Les epingles sur des briefs partent
// avec la ligne (on delete cascade sur brief_references).
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("bibliotheque").delete().eq("id", id).select("capture_path").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const path = (data as { capture_path: string | null }).capture_path;
    if (path) {
      const { error: rmErr } = await supabase.storage.from(BUCKET).remove([path]);
      // La ligne est deja partie : on signale l'orphelin sans faire echouer la suppression.
      if (rmErr) console.error("[bibliotheque] capture orpheline:", path, rmErr.message);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Compiler**

Run: `npx tsc --noEmit && npm test`
Expected: 0 erreur, tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bibliotheque-db.ts src/app/api/bibliotheque
git commit -m "API de la bibliotheque : liste, ajout avec capture, mise a jour, suppression"
```

---

### Task 7: Page Bibliothèque

**Files:**
- Create: `src/app/(app)/bibliotheque/page.tsx`

**Interfaces:**
- Consumes: API de la tâche 6 ; `filtrerReferences`, `TYPES_SECTION`, `TYPE_SECTION_LABELS`, `OUTILS`, `OUTIL_LABELS`, `Reference` ; `PageHeader`, `CHANNELS`, `LibraryIcon`, `PlusIcon`, `CloseIcon` ; `inputStyle`, `labelStyle`, `buttonStyle`, `cardStyle`.

- [ ] **Step 1: Écrire la page**

Create `src/app/(app)/bibliotheque/page.tsx` :

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CHANNELS } from "@/lib/channels";
import { LibraryIcon, PlusIcon, CloseIcon } from "@/components/icons";
import { inputStyle, labelStyle, buttonStyle, cardStyle } from "@/components/ui/form-styles";
import {
  filtrerReferences, TYPES_SECTION, TYPE_SECTION_LABELS, OUTILS, OUTIL_LABELS, type Reference,
} from "@/lib/bibliotheque";

const ACCENT = CHANNELS.bibliotheque.accent;
const vide = { titre: "", url_source: "", type_section: "", secteur: "", tags: "", outil: "aucun", note: "" };

export default function BibliothequePage() {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(vide);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filtres, setFiltres] = useState({ type_section: "", outil: "", tag: "", texte: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bibliotheque");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur de chargement");
      setRefs(json.references);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const tousTags = useMemo(() => [...new Set(refs.flatMap((r) => r.tags))].sort(), [refs]);
  const visibles = useMemo(() => filtrerReferences(refs, filtres), [refs, filtres]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.append(k, v);
    if (file) fd.append("file", file);
    try {
      const res = await fetch("/api/bibliotheque", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur à l'enregistrement");
      setRefs((prev) => [json.reference, ...prev]);
      setForm(vide);
      setFile(null);
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette référence ? Elle sera aussi retirée des briefs où elle est épinglée.")) return;
    const res = await fetch(`/api/bibliotheque/${id}`, { method: "DELETE" });
    if (res.ok) setRefs((prev) => prev.filter((r) => r.id !== id));
    else setError((await res.json()).error || "Suppression impossible");
  }

  return (
    <div>
      <PageHeader
        icon={LibraryIcon}
        accent={ACCENT}
        title="Bibliothèque"
        subtitle={loading ? "Chargement…" : `${refs.length} référence${refs.length > 1 ? "s" : ""}`}
        actions={
          <button onClick={() => setShowForm((s) => !s)} style={{ ...buttonStyle(ACCENT), display: "flex", gap: 6, alignItems: "center" }}>
            {showForm ? <CloseIcon size={15} /> : <PlusIcon size={15} />} {showForm ? "Fermer" : "Ajouter"}
          </button>
        }
      />

      {error && <div style={{ ...cardStyle, borderColor: "#F87171", color: "#F87171", marginBottom: 16 }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, marginBottom: 20, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div><label style={labelStyle}>Titre *</label><input style={inputStyle} value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required /></div>
          <div><label style={labelStyle}>URL d'origine</label><input style={inputStyle} type="url" value={form.url_source} onChange={(e) => setForm({ ...form, url_source: e.target.value })} placeholder="https://" /></div>
          <div>
            <label style={labelStyle}>Type de section</label>
            <select style={inputStyle} value={form.type_section} onChange={(e) => setForm({ ...form, type_section: e.target.value })}>
              <option value="">Non précisé</option>
              {TYPES_SECTION.map((t) => <option key={t} value={t}>{TYPE_SECTION_LABELS[t]}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Secteur</label><input style={inputStyle} value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} placeholder="cuisine, avocat…" /></div>
          <div><label style={labelStyle}>Tags (séparés par des virgules)</label><input style={inputStyle} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="minimal, serif, sombre" /></div>
          <div>
            <label style={labelStyle}>Outil</label>
            <select style={inputStyle} value={form.outil} onChange={(e) => setForm({ ...form, outil: e.target.value })}>
              {OUTILS.map((o) => <option key={o} value={o}>{OUTIL_LABELS[o]}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Capture (PNG, JPEG, WebP, 5 Mo max)</label><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Note</label><textarea style={{ ...inputStyle, minHeight: 70 }} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><button type="submit" disabled={submitting} style={buttonStyle(ACCENT)}>{submitting ? "Envoi…" : "Enregistrer"}</button></div>
        </form>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <input style={{ ...inputStyle, width: 220 }} placeholder="Rechercher" value={filtres.texte} onChange={(e) => setFiltres({ ...filtres, texte: e.target.value })} />
        <select style={{ ...inputStyle, width: 170 }} value={filtres.type_section} onChange={(e) => setFiltres({ ...filtres, type_section: e.target.value })}>
          <option value="">Toutes les sections</option>
          {TYPES_SECTION.map((t) => <option key={t} value={t}>{TYPE_SECTION_LABELS[t]}</option>)}
        </select>
        <select style={{ ...inputStyle, width: 150 }} value={filtres.outil} onChange={(e) => setFiltres({ ...filtres, outil: e.target.value })}>
          <option value="">Tous les outils</option>
          {OUTILS.map((o) => <option key={o} value={o}>{OUTIL_LABELS[o]}</option>)}
        </select>
        <select style={{ ...inputStyle, width: 150 }} value={filtres.tag} onChange={(e) => setFiltres({ ...filtres, tag: e.target.value })}>
          <option value="">Tous les tags</option>
          {tousTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {!loading && visibles.length === 0 && (
        <p style={{ color: "#8b8f98" }}>{refs.length === 0 ? "Aucune référence pour l'instant. Ajoute la première." : "Aucune référence ne correspond à ces filtres."}</p>
      )}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {visibles.map((r) => (
          <div key={r.id} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            {r.capture_url
              ? <a href={r.capture_url} target="_blank" rel="noreferrer"><img src={r.capture_url} alt={r.titre} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top", display: "block" }} /></a>
              : <div style={{ aspectRatio: "16 / 10", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>Pas de capture</div>}
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.titre}</div>
              <div style={{ color: "#8b8f98", fontSize: 13, marginBottom: 8 }}>
                {[r.type_section && TYPE_SECTION_LABELS[r.type_section], r.secteur, OUTIL_LABELS[r.outil]].filter(Boolean).join(" · ")}
              </div>
              {r.tags.length > 0 && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                  {r.tags.map((t) => <span key={t} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: `${ACCENT}22`, color: ACCENT }}>{t}</span>)}
                </div>
              )}
              {r.note && <p style={{ fontSize: 13.5, color: "#c4c7cc", marginBottom: 8 }}>{r.note}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                {r.url_source ? <a href={r.url_source} target="_blank" rel="noreferrer" style={{ color: ACCENT }}>Voir le site</a> : <span />}
                <button onClick={() => handleDelete(r.id)} style={{ background: "none", border: "none", color: "#8b8f98", cursor: "pointer", fontSize: 13 }}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Compiler et build**

Run: `npx tsc --noEmit && npm run build`
Expected: succès, `/bibliotheque` listée. Un avertissement `@next/next/no-img-element` est acceptable (les captures viennent du Storage, `next/image` exigerait de déclarer le domaine Supabase).

- [ ] **Step 3: Vérifier à l'écran en local**

Avec `.env.local` rempli (Supabase du hub) : `npm run dev`, ouvrir `http://localhost:3000/bibliotheque`.
Expected : ajouter une référence avec capture PNG → elle apparaît en tête avec sa vignette ; ajouter un PDF → message « Format non supporté » ; filtrer par type et par tag ; supprimer → elle disparaît, et dans Supabase Storage l'objet a disparu. Arrêter le serveur dev.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(app)/bibliotheque"
git commit -m "Page Bibliotheque : galerie, filtres, ajout avec capture"
```

---

### Task 8: Logique des comptes et des briefs (TDD)

**Files:**
- Create: `src/lib/comptes.ts`, `src/lib/briefs.ts`
- Test: `scripts/test-briefs.ts`

**Interfaces:**
- Produces:
  - `comptes.ts` : `SOURCES_COMPTE`, `STATUTS_COMPTE`, `type StatutCompte`, `interface CompteMinimal { id: string; nom: string; entreprise: string | null; email: string | null }`, `normaliserEmail(raw: unknown): string | null`, `parserCompteMinimal(input: Record<string, unknown>): { ok: true; value: { nom: string; entreprise: string | null; email: string | null; source: string } } | { ok: false; error: string }`
  - `briefs.ts` : `STATUTS_BRIEF`, `type StatutBrief`, `STATUT_BRIEF_LABELS`, `BRIEF_CHAMPS: readonly { cle: string; label: string; long: boolean }[]`, `interface Brief`, `interface BriefReference`, `parserReponses(raw: unknown): Record<string, string>`, `parserBriefMaj(input: Record<string, unknown>): { ok: true; value: Record<string, unknown> } | { ok: false; error: string }`

- [ ] **Step 1: Écrire les tests**

Create `scripts/test-briefs.ts` :

```ts
/**
 * Tests de lib/comptes.ts et lib/briefs.ts.
 *
 * CE QUE CE FICHIER PROTEGE. Le rattachement d'un brief au bon compte repose sur l'email
 * normalise : une casse ou un espace de trop creerait un doublon de client. Et les reponses
 * d'un brief n'acceptent que les cles connues, pour que le formulaire Tally du lot 2 ne puisse
 * pas remplir la base de champs fantomes.
 *
 * Lancer : node --import ./scripts/alias-hook.mjs --test scripts/test-briefs.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { normaliserEmail, parserCompteMinimal } from "@/lib/comptes";
import { parserReponses, parserBriefMaj, BRIEF_CHAMPS } from "@/lib/briefs";

test("normaliserEmail : minuscules et espaces retires", () => {
  assert.equal(normaliserEmail(" Marie@Exemple.FR "), "marie@exemple.fr");
});

test("normaliserEmail : vide ou invalide donne null", () => {
  assert.equal(normaliserEmail(""), null);
  assert.equal(normaliserEmail("   "), null);
  assert.equal(normaliserEmail("pas-un-email"), null);
  assert.equal(normaliserEmail(undefined), null);
});

test("parserCompteMinimal : nom obligatoire", () => {
  assert.equal(parserCompteMinimal({ nom: " " }).ok, false);
});

test("parserCompteMinimal : email invalide refuse, pas ignore", () => {
  const r = parserCompteMinimal({ nom: "Marie", email: "marie@" });
  assert.equal(r.ok, false);
});

test("parserCompteMinimal : nettoie, source manuelle par defaut", () => {
  const r = parserCompteMinimal({ nom: " Marie Dupont ", entreprise: "", email: "Marie@Exemple.fr" });
  assert.deepEqual(r, { ok: true, value: { nom: "Marie Dupont", entreprise: null, email: "marie@exemple.fr", source: "autre" } });
});

test("parserCompteMinimal : source hors liste refusee", () => {
  assert.equal(parserCompteMinimal({ nom: "M", source: "pub" }).ok, false);
  assert.equal(parserCompteMinimal({ nom: "M", source: "reseau" }).ok, true);
});

test("parserReponses : garde les cles connues, ecarte les autres et les vides", () => {
  const r = parserReponses({ cible: " Propriétaires ", budget: "", inconnu: "x", objectifs: 42 });
  assert.deepEqual(r, { cible: "Propriétaires" });
});

test("parserReponses : entree non objet donne un objet vide", () => {
  assert.deepEqual(parserReponses(null), {});
  assert.deepEqual(parserReponses("texte"), {});
  assert.deepEqual(parserReponses([1, 2]), {});
});

test("BRIEF_CHAMPS : cles uniques", () => {
  const cles = BRIEF_CHAMPS.map((c) => c.cle);
  assert.equal(new Set(cles).size, cles.length);
});

test("parserBriefMaj : statut controle, texte nettoye, reponses filtrees", () => {
  assert.equal(parserBriefMaj({ statut: "termine" }).ok, false);
  const r = parserBriefMaj({ statut: "complete", texte: "  ## Notes  ", reponses: { pages: "Accueil, Contact", x: "y" } });
  assert.deepEqual(r, { ok: true, value: { statut: "complete", texte: "## Notes", reponses: { pages: "Accueil, Contact" } } });
});

test("parserBriefMaj : texte vide devient null, champs absents non produits", () => {
  assert.deepEqual(parserBriefMaj({ texte: "  " }), { ok: true, value: { texte: null } });
  assert.deepEqual(parserBriefMaj({}), { ok: true, value: {} });
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `node --import ./scripts/alias-hook.mjs --test scripts/test-briefs.ts`
Expected: FAIL, modules introuvables.

- [ ] **Step 3: Implémenter `comptes.ts`**

Create `src/lib/comptes.ts` :

```ts
// Comptes : chaque entreprise ou contact, de prospect a client. Une seule table, un prospect
// qui signe ne change pas de fiche. Au lot 1 seul le minimum sert (rattacher un brief) ; les
// pages Comptes completes arrivent au lot 3.

export const SOURCES_COMPTE = ["reseau", "ancien_client", "formulaire", "prospection", "autre"] as const;
export const STATUTS_COMPTE = ["a_contacter", "contacte", "rdv", "devis_envoye", "client", "perdu"] as const;
export type StatutCompte = (typeof STATUTS_COMPTE)[number];

export interface CompteMinimal {
  id: string;
  nom: string;
  entreprise: string | null;
  email: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** L'email sert de cle de rattachement : toujours compare sous cette forme. */
export function normaliserEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const e = raw.trim().toLowerCase();
  return EMAIL_RE.test(e) ? e : null;
}

const texteOuNull = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export function parserCompteMinimal(
  input: Record<string, unknown>,
):
  | { ok: true; value: { nom: string; entreprise: string | null; email: string | null; source: string } }
  | { ok: false; error: string } {
  const nom = texteOuNull(input.nom);
  if (!nom) return { ok: false, error: "Le nom du contact est obligatoire." };
  const emailBrut = texteOuNull(input.email);
  const email = normaliserEmail(emailBrut);
  if (emailBrut && !email) return { ok: false, error: "Email invalide." };
  const source = texteOuNull(input.source) ?? "autre";
  if (!(SOURCES_COMPTE as readonly string[]).includes(source)) return { ok: false, error: "Source invalide." };
  return { ok: true, value: { nom, entreprise: texteOuNull(input.entreprise), email, source } };
}
```

- [ ] **Step 4: Implémenter `briefs.ts`**

Create `src/lib/briefs.ts` :

```ts
// Briefs clients. Les reponses structurees ont des cles fixes (BRIEF_CHAMPS) : la saisie
// manuelle du lot 1 et l'adaptateur Tally du lot 2 ecrivent dans les memes cles.

import type { Reference } from "@/lib/bibliotheque";
import type { CompteMinimal } from "@/lib/comptes";

export const STATUTS_BRIEF = ["recu", "complete", "valide"] as const;
export type StatutBrief = (typeof STATUTS_BRIEF)[number];

export const STATUT_BRIEF_LABELS: Record<StatutBrief, { label: string; color: string }> = {
  recu: { label: "Reçu", color: "#F59E0B" },
  complete: { label: "Complété", color: "#0D6EF5" },
  valide: { label: "Validé", color: "#10B981" },
};

export const BRIEF_CHAMPS = [
  { cle: "activite", label: "Activité de l'entreprise", long: true },
  { cle: "cible", label: "Clientèle visée", long: true },
  { cle: "objectifs", label: "Objectifs du site", long: true },
  { cle: "pages", label: "Pages souhaitées", long: true },
  { cle: "contenus", label: "Contenus fournis (textes, photos, logo)", long: true },
  { cle: "references_aimees", label: "Sites aimés ou détestés", long: true },
  { cle: "fonctionnalites", label: "Fonctionnalités (prise de RDV, formulaire, blog…)", long: true },
  { cle: "domaine", label: "Nom de domaine et hébergement actuels", long: false },
  { cle: "echeance", label: "Échéance", long: false },
  { cle: "budget", label: "Budget", long: false },
] as const;

export interface BriefReference {
  id: string;
  commentaire: string | null;
  reference: Reference;
}

export interface Brief {
  id: string;
  compte_id: string;
  projet_id: string | null;
  source: "tally" | "manuel" | "formulaire_site";
  source_id: string | null;
  reponses: Record<string, string>;
  texte: string | null;
  statut: StatutBrief;
  created_at: string;
  updated_at: string;
  compte: CompteMinimal;
}

const CLES = new Set<string>(BRIEF_CHAMPS.map((c) => c.cle));

export function parserReponses(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!CLES.has(k) || typeof v !== "string") continue;
    const t = v.trim();
    if (t) out[k] = t;
  }
  return out;
}

export function parserBriefMaj(
  input: Record<string, unknown>,
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const value: Record<string, unknown> = {};
  if (input.statut !== undefined) {
    if (!(STATUTS_BRIEF as readonly unknown[]).includes(input.statut)) return { ok: false, error: "Statut invalide." };
    value.statut = input.statut;
  }
  if (input.texte !== undefined) {
    value.texte = typeof input.texte === "string" && input.texte.trim() ? input.texte.trim() : null;
  }
  if (input.reponses !== undefined) value.reponses = parserReponses(input.reponses);
  return { ok: true, value };
}
```

- [ ] **Step 5: Vérifier le succès**

Run: `npm test`
Expected: PASS, tests de `test-bibliotheque.ts` et `test-briefs.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/comptes.ts src/lib/briefs.ts scripts/test-briefs.ts
git commit -m "Comptes et briefs : normalisation email, reponses, statuts, avec tests"
```

---

### Task 9: API des comptes et des briefs

**Files:**
- Create: `src/app/api/comptes/route.ts`, `src/app/api/briefs/route.ts`, `src/app/api/briefs/[id]/route.ts`, `src/app/api/briefs/[id]/references/route.ts`, `src/lib/comptes-db.ts`

**Interfaces:**
- Consumes: `parserCompteMinimal`, `normaliserEmail`, `CompteMinimal` ; `parserReponses`, `parserBriefMaj`, `Brief`, `BriefReference` ; `avecCaptureUrl` ; `Reference`.
- Produces:
  - `trouverOuCreerCompte(input: { nom: string; entreprise: string | null; email: string | null; source: string }): Promise<{ compte: CompteMinimal; cree: boolean }>` dans `src/lib/comptes-db.ts` (réutilisé par Tally au lot 2)
  - `GET /api/comptes` → `{ comptes: CompteMinimal[] }` (triés par nom)
  - `POST /api/comptes` → 201 `{ compte }` ou 200 `{ compte }` si l'email existait
  - `GET /api/briefs` → `{ briefs: Brief[] }` (plus récents d'abord, avec `compte`)
  - `POST /api/briefs` `{ compte_id }` ou `{ compte: { nom, entreprise, email } }`, + `reponses`, `texte` → 201 `{ brief }`
  - `GET /api/briefs/[id]` → `{ brief: Brief, references: BriefReference[] }`
  - `PATCH /api/briefs/[id]` → `{ brief }`
  - `POST /api/briefs/[id]/references` `{ reference_id, commentaire? }` → 200 `{ ok: true }` (idempotent)
  - `DELETE /api/briefs/[id]/references?reference_id=…` → `{ ok: true }`

- [ ] **Step 1: Rattachement de compte**

Create `src/lib/comptes-db.ts` :

```ts
import { getSupabaseClient } from "@/lib/supabase";
import type { CompteMinimal } from "@/lib/comptes";

const COLONNES = "id, nom, entreprise, email";
// `ilike` sans joker = egalite insensible a la casse. `_` et `%` d'un email seraient des jokers.
const echapperLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/**
 * Rattache a un compte existant par email (deja normalise), sinon en cree un. Sans email, cree
 * toujours : deux homonymes sans email sont deux comptes, on ne devine pas.
 *
 * La course entre deux creations simultanees du meme email est arbitree par l'index unique
 * `comptes_email_unique` : le perdant relit la ligne gagnante (code Postgres 23505).
 */
export async function trouverOuCreerCompte(input: {
  nom: string;
  entreprise: string | null;
  email: string | null;
  source: string;
}): Promise<{ compte: CompteMinimal; cree: boolean }> {
  const supabase = getSupabaseClient();
  if (input.email) {
    const { data } = await supabase.from("comptes").select(COLONNES).ilike("email", echapperLike(input.email)).maybeSingle();
    if (data) return { compte: data as CompteMinimal, cree: false };
  }
  const { data, error } = await supabase.from("comptes").insert(input as never).select(COLONNES).single();
  if (error) {
    if (error.code === "23505" && input.email) {
      const { data: existant } = await supabase.from("comptes").select(COLONNES).ilike("email", echapperLike(input.email)).single();
      if (existant) return { compte: existant as CompteMinimal, cree: false };
    }
    throw new Error(error.message);
  }
  return { compte: data as CompteMinimal, cree: true };
}
```

- [ ] **Step 2: Route comptes**

Create `src/app/api/comptes/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parserCompteMinimal } from "@/lib/comptes";
import { trouverOuCreerCompte } from "@/lib/comptes-db";

export const dynamic = "force-dynamic";

// GET /api/comptes : liste minimale pour les selecteurs (lot 1). La page Comptes arrive au lot 3.
export async function GET() {
  try {
    const { data, error } = await getSupabaseClient()
      .from("comptes")
      .select("id, nom, entreprise, email")
      .order("nom", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ comptes: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = parserCompteMinimal(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { compte, cree } = await trouverOuCreerCompte(parsed.value);
    return NextResponse.json({ compte }, { status: cree ? 201 : 200 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Routes briefs**

Create `src/app/api/briefs/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parserCompteMinimal } from "@/lib/comptes";
import { trouverOuCreerCompte } from "@/lib/comptes-db";
import { parserReponses } from "@/lib/briefs";

export const dynamic = "force-dynamic";

const SELECT_BRIEF = "*, compte:comptes(id, nom, entreprise, email)";

export async function GET() {
  try {
    const { data, error } = await getSupabaseClient()
      .from("briefs")
      .select(SELECT_BRIEF)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ briefs: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/briefs : saisie manuelle. Soit `compte_id` d'un compte existant, soit `compte`
// ({ nom, entreprise, email }) rattache par email ou cree.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    let compte_id: string;
    if (typeof body.compte_id === "string" && body.compte_id) {
      const { data } = await supabase.from("comptes").select("id").eq("id", body.compte_id).maybeSingle();
      if (!data) return NextResponse.json({ error: "Compte introuvable." }, { status: 400 });
      compte_id = body.compte_id;
    } else {
      const parsed = parserCompteMinimal(body.compte ?? {});
      if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
      compte_id = (await trouverOuCreerCompte(parsed.value)).compte.id;
    }

    const texte = typeof body.texte === "string" && body.texte.trim() ? body.texte.trim() : null;
    const { data, error } = await supabase
      .from("briefs")
      .insert({ compte_id, source: "manuel", reponses: parserReponses(body.reponses), texte, statut: "recu" } as never)
      .select(SELECT_BRIEF)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ brief: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

Create `src/app/api/briefs/[id]/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { parserBriefMaj } from "@/lib/briefs";
import { avecCaptureUrl } from "@/lib/bibliotheque-db";
import type { Reference } from "@/lib/bibliotheque";

export const dynamic = "force-dynamic";

const SELECT_BRIEF = "*, compte:comptes(id, nom, entreprise, email)";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    const { data: brief, error } = await supabase.from("briefs").select(SELECT_BRIEF).eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!brief) return NextResponse.json({ error: "Brief introuvable." }, { status: 404 });

    const { data: pins, error: pinErr } = await supabase
      .from("brief_references")
      .select("id, commentaire, reference:bibliotheque(*)")
      .eq("brief_id", id)
      .order("created_at", { ascending: true });
    if (pinErr) return NextResponse.json({ error: pinErr.message }, { status: 500 });

    const references = (pins ?? []).map((p) => {
      const row = p as unknown as { id: string; commentaire: string | null; reference: Omit<Reference, "capture_url"> };
      return { id: row.id, commentaire: row.commentaire, reference: avecCaptureUrl(row.reference) };
    });
    return NextResponse.json({ brief, references });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = parserBriefMaj(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { data, error } = await getSupabaseClient()
      .from("briefs")
      .update({ ...parsed.value, updated_at: new Date().toISOString() } as never)
      .eq("id", id)
      .select(SELECT_BRIEF)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ brief: data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Route des épingles**

Create `src/app/api/briefs/[id]/references/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST : epingle une reference. Idempotent : epingler deux fois la meme ne cree rien de plus
// et ne renvoie pas d'erreur (contrainte unique brief_id + reference_id).
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (typeof body.reference_id !== "string" || !body.reference_id) {
      return NextResponse.json({ error: "reference_id manquant." }, { status: 400 });
    }
    const commentaire = typeof body.commentaire === "string" && body.commentaire.trim() ? body.commentaire.trim() : null;
    const { error } = await getSupabaseClient()
      .from("brief_references")
      .upsert({ brief_id: id, reference_id: body.reference_id, commentaire } as never, {
        onConflict: "brief_id,reference_id",
        ignoreDuplicates: true,
      });
    if (error) return NextResponse.json({ error: error.message }, { status: error.code === "23503" ? 400 : 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const referenceId = request.nextUrl.searchParams.get("reference_id");
    if (!referenceId) return NextResponse.json({ error: "reference_id manquant." }, { status: 400 });
    const { error } = await getSupabaseClient()
      .from("brief_references")
      .delete()
      .eq("brief_id", id)
      .eq("reference_id", referenceId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Compiler**

Run: `npx tsc --noEmit && npm test`
Expected: 0 erreur, PASS.

- [ ] **Step 6: Vérifier les routes contre Supabase en local**

`npm run dev` (authentification désactivée en développement), puis :

```bash
B=http://localhost:3000/api
curl -s -X POST $B/comptes -H 'content-type: application/json' -d '{"nom":"Test Rattachement","email":" Test.Rattachement@Exemple.fr "}'
curl -s -X POST $B/comptes -H 'content-type: application/json' -d '{"nom":"Autre nom","email":"test.rattachement@exemple.fr"}'
```

Expected: deux réponses avec **le même `id`** (le second rattache, statut HTTP 200).

```bash
BRIEF=$(curl -s -X POST $B/briefs -H 'content-type: application/json' -d '{"compte":{"nom":"Test Rattachement","email":"test.rattachement@exemple.fr"},"reponses":{"cible":"Propriétaires","inconnu":"x"}}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).brief.id')
REF=$(curl -s $B/bibliotheque | node -pe 'JSON.parse(require("fs").readFileSync(0)).references[0]?.id')
curl -s -X POST $B/briefs/$BRIEF/references -H 'content-type: application/json' -d "{\"reference_id\":\"$REF\"}"
curl -s -X POST $B/briefs/$BRIEF/references -H 'content-type: application/json' -d "{\"reference_id\":\"$REF\"}"
curl -s $B/briefs/$BRIEF | node -pe 'const j=JSON.parse(require("fs").readFileSync(0)); [j.brief.reponses, j.references.length]'
```

Expected: les deux épinglages renvoient `{"ok":true}` ; la dernière commande affiche `[ { cible: 'Propriétaires' }, 1 ]` (clé inconnue écartée, une seule épingle). Si la bibliothèque est vide, ajouter d'abord une référence via la page.

Nettoyer : supprimer dans Supabase le compte « Test Rattachement » (le brief et l'épingle partent en cascade). Arrêter le serveur dev.

- [ ] **Step 7: Commit**

```bash
git add src/lib/comptes-db.ts src/app/api/comptes src/app/api/briefs
git commit -m "API comptes et briefs : rattachement par email, fiche, epingles idempotentes"
```

---

### Task 10: Pages Briefs

**Files:**
- Create: `src/app/(app)/briefs/page.tsx`, `src/app/(app)/briefs/[id]/page.tsx`

**Interfaces:**
- Consumes: API de la tâche 9 et `GET /api/bibliotheque` ; `BRIEF_CHAMPS`, `STATUTS_BRIEF`, `STATUT_BRIEF_LABELS`, `Brief`, `BriefReference` ; `CompteMinimal` ; `filtrerReferences`, `TYPE_SECTION_LABELS`, `Reference` ; composants et styles partagés.

- [ ] **Step 1: Liste et création**

Create `src/app/(app)/briefs/page.tsx` :

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CHANNELS } from "@/lib/channels";
import { BriefIcon, PlusIcon, CloseIcon } from "@/components/icons";
import { inputStyle, labelStyle, buttonStyle, cardStyle } from "@/components/ui/form-styles";
import { STATUT_BRIEF_LABELS, STATUTS_BRIEF, type Brief, type StatutBrief } from "@/lib/briefs";
import type { CompteMinimal } from "@/lib/comptes";
import { formatDateShort } from "@/lib/format";

const ACCENT = CHANNELS.briefs.accent;
const NOUVEAU = "__nouveau__";

export default function BriefsPage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [comptes, setComptes] = useState<CompteMinimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [compteId, setCompteId] = useState(NOUVEAU);
  const [nouveau, setNouveau] = useState({ nom: "", entreprise: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [filtre, setFiltre] = useState<StatutBrief | "tous">("tous");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rb, rc] = await Promise.all([fetch("/api/briefs"), fetch("/api/comptes")]);
      const [jb, jc] = await Promise.all([rb.json(), rc.json()]);
      if (!rb.ok) throw new Error(jb.error || "Erreur de chargement");
      if (!rc.ok) throw new Error(jc.error || "Erreur de chargement");
      setBriefs(jb.briefs);
      setComptes(jc.comptes);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = compteId === NOUVEAU ? { compte: nouveau } : { compte_id: compteId };
      const res = await fetch("/api/briefs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Création impossible");
      router.push(`/briefs/${json.brief.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setSubmitting(false);
    }
  }

  const visibles = filtre === "tous" ? briefs : briefs.filter((b) => b.statut === filtre);

  return (
    <div>
      <PageHeader
        icon={BriefIcon}
        accent={ACCENT}
        title="Briefs"
        subtitle={loading ? "Chargement…" : `${briefs.filter((b) => b.statut === "recu").length} à traiter`}
        actions={
          <button onClick={() => setShowForm((s) => !s)} style={{ ...buttonStyle(ACCENT), display: "flex", gap: 6, alignItems: "center" }}>
            {showForm ? <CloseIcon size={15} /> : <PlusIcon size={15} />} {showForm ? "Fermer" : "Nouveau brief"}
          </button>
        }
      />

      {error && <div style={{ ...cardStyle, borderColor: "#F87171", color: "#F87171", marginBottom: 16 }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} style={{ ...cardStyle, marginBottom: 20, display: "grid", gap: 12, maxWidth: 560 }}>
          <div>
            <label style={labelStyle}>Compte</label>
            <select style={inputStyle} value={compteId} onChange={(e) => setCompteId(e.target.value)}>
              <option value={NOUVEAU}>Nouveau compte</option>
              {comptes.map((c) => <option key={c.id} value={c.id}>{c.nom}{c.entreprise ? ` (${c.entreprise})` : ""}</option>)}
            </select>
          </div>
          {compteId === NOUVEAU && (
            <>
              <div><label style={labelStyle}>Nom du contact *</label><input style={inputStyle} required value={nouveau.nom} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} /></div>
              <div><label style={labelStyle}>Entreprise</label><input style={inputStyle} value={nouveau.entreprise} onChange={(e) => setNouveau({ ...nouveau, entreprise: e.target.value })} /></div>
              <div><label style={labelStyle}>Email (rattache au compte existant s'il est connu)</label><input style={inputStyle} type="email" value={nouveau.email} onChange={(e) => setNouveau({ ...nouveau, email: e.target.value })} /></div>
            </>
          )}
          <div><button type="submit" disabled={submitting} style={buttonStyle(ACCENT)}>{submitting ? "Création…" : "Créer et ouvrir"}</button></div>
        </form>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["tous", ...STATUTS_BRIEF] as const).map((s) => (
          <button key={s} onClick={() => setFiltre(s)} style={{ padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,.08)", background: filtre === s ? `${ACCENT}33` : "transparent", color: "#F1F5F9", cursor: "pointer", fontSize: 13.5 }}>
            {s === "tous" ? "Tous" : STATUT_BRIEF_LABELS[s].label}
          </button>
        ))}
      </div>

      {!loading && visibles.length === 0 && <p style={{ color: "#8b8f98" }}>{briefs.length === 0 ? "Aucun brief pour l'instant." : "Aucun brief avec ce statut."}</p>}

      <div style={{ display: "grid", gap: 10 }}>
        {visibles.map((b) => (
          <Link key={b.id} href={`/briefs/${b.id}`} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{b.compte.entreprise || b.compte.nom}</div>
              <div style={{ color: "#8b8f98", fontSize: 13.5 }}>{b.compte.entreprise ? `${b.compte.nom} · ` : ""}{b.source === "manuel" ? "Saisi à la main" : "Formulaire"} · {formatDateShort(b.created_at)}</div>
            </div>
            <span style={{ fontSize: 12.5, padding: "3px 10px", borderRadius: 99, background: `${STATUT_BRIEF_LABELS[b.statut].color}22`, color: STATUT_BRIEF_LABELS[b.statut].color, whiteSpace: "nowrap" }}>
              {STATUT_BRIEF_LABELS[b.statut].label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

Avant d'utiliser `formatDateShort`, vérifier qu'il accepte un timestamp ISO complet : `grep -n -A8 "export function formatDateShort" src/lib/format.ts`. S'il attend une date `YYYY-MM-DD`, lui passer `b.created_at.slice(0, 10)`.

- [ ] **Step 2: Fiche brief**

Create `src/app/(app)/briefs/[id]/page.tsx` :

```tsx
"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CHANNELS } from "@/lib/channels";
import { BriefIcon } from "@/components/icons";
import { inputStyle, labelStyle, buttonStyle, cardStyle } from "@/components/ui/form-styles";
import { BRIEF_CHAMPS, STATUTS_BRIEF, STATUT_BRIEF_LABELS, type Brief, type BriefReference, type StatutBrief } from "@/lib/briefs";
import { filtrerReferences, TYPE_SECTION_LABELS, type Reference } from "@/lib/bibliotheque";

const ACCENT = CHANNELS.briefs.accent;

export default function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [pins, setPins] = useState<BriefReference[]>([]);
  const [biblio, setBiblio] = useState<Reference[]>([]);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [texte, setTexte] = useState("");
  const [statut, setStatut] = useState<StatutBrief>("recu");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");
  const [picker, setPicker] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/briefs/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Brief introuvable");
      setBrief(json.brief);
      setPins(json.references);
      setReponses(json.brief.reponses ?? {});
      setTexte(json.brief.texte ?? "");
      setStatut(json.brief.statut);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!picker || biblio.length > 0) return;
    fetch("/api/bibliotheque").then((r) => r.json()).then((j) => setBiblio(j.references ?? [])).catch(() => setError("Bibliothèque indisponible"));
  }, [picker, biblio.length]);

  const dejaEpingles = useMemo(() => new Set(pins.map((p) => p.reference.id)), [pins]);
  const candidats = useMemo(
    () => filtrerReferences(biblio, { texte: recherche }).filter((r) => !dejaEpingles.has(r.id)),
    [biblio, recherche, dejaEpingles],
  );

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/briefs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reponses, texte, statut }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Enregistrement impossible");
      setBrief(json.brief);
      setReponses(json.brief.reponses ?? {});
      setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setSaving(false);
  }

  async function epingler(referenceId: string) {
    const res = await fetch(`/api/briefs/${id}/references`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference_id: referenceId }) });
    if (res.ok) await load();
    else setError((await res.json()).error || "Épinglage impossible");
  }

  async function desepingler(referenceId: string) {
    const res = await fetch(`/api/briefs/${id}/references?reference_id=${encodeURIComponent(referenceId)}`, { method: "DELETE" });
    if (res.ok) setPins((prev) => prev.filter((p) => p.reference.id !== referenceId));
    else setError((await res.json()).error || "Retrait impossible");
  }

  if (!brief) {
    return <div style={{ color: error ? "#F87171" : "#8b8f98" }}>{error ?? "Chargement…"} {error && <Link href="/briefs" style={{ color: ACCENT }}>Retour aux briefs</Link>}</div>;
  }

  return (
    <div>
      <PageHeader
        icon={BriefIcon}
        accent={ACCENT}
        title={brief.compte.entreprise || brief.compte.nom}
        subtitle={[brief.compte.nom, brief.compte.email].filter(Boolean).join(" · ")}
        actions={
          <>
            <select style={{ ...inputStyle, width: 150 }} value={statut} onChange={(e) => setStatut(e.target.value as StatutBrief)}>
              {STATUTS_BRIEF.map((s) => <option key={s} value={s}>{STATUT_BRIEF_LABELS[s].label}</option>)}
            </select>
            <button onClick={save} disabled={saving} style={buttonStyle(ACCENT)}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </>
        }
      />

      {error && <div style={{ ...cardStyle, borderColor: "#F87171", color: "#F87171", marginBottom: 16 }}>{error}</div>}
      {savedAt && <p style={{ color: "#10B981", fontSize: 13.5, marginBottom: 12 }}>Enregistré à {savedAt}.</p>}

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", alignItems: "start" }}>
        <div style={{ ...cardStyle, display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Réponses</h2>
          {BRIEF_CHAMPS.map((c) => (
            <div key={c.cle}>
              <label style={labelStyle}>{c.label}</label>
              {c.long
                ? <textarea style={{ ...inputStyle, minHeight: 64 }} value={reponses[c.cle] ?? ""} onChange={(e) => setReponses({ ...reponses, [c.cle]: e.target.value })} />
                : <input style={inputStyle} value={reponses[c.cle] ?? ""} onChange={(e) => setReponses({ ...reponses, [c.cle]: e.target.value })} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Notes (Markdown)</h2>
            <textarea style={{ ...inputStyle, minHeight: 220, fontFamily: "ui-monospace, monospace", fontSize: 14 }} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Direction artistique, arborescence, points d'attention…" />
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Références épinglées ({pins.length})</h2>
              <button onClick={() => setPicker((p) => !p)} style={{ ...buttonStyle(ACCENT), padding: "6px 12px", fontSize: 13.5 }}>{picker ? "Fermer" : "Épingler"}</button>
            </div>

            {picker && (
              <div style={{ marginBottom: 14 }}>
                <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="Chercher dans la bibliothèque" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                <div style={{ display: "grid", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                  {candidats.length === 0 && <p style={{ color: "#8b8f98", fontSize: 13.5 }}>Aucune référence disponible.</p>}
                  {candidats.map((r) => (
                    <button key={r.id} onClick={() => epingler(r.id)} style={{ display: "flex", gap: 10, alignItems: "center", textAlign: "left", background: "var(--color-input)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: 6, color: "#F1F5F9", cursor: "pointer" }}>
                      {r.capture_url ? <img src={r.capture_url} alt="" style={{ width: 64, height: 40, objectFit: "cover", objectPosition: "top", borderRadius: 4 }} /> : <div style={{ width: 64, height: 40 }} />}
                      <span style={{ fontSize: 14 }}>{r.titre}{r.type_section ? ` · ${TYPE_SECTION_LABELS[r.type_section]}` : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pins.length === 0 && !picker && <p style={{ color: "#8b8f98", fontSize: 13.5 }}>Aucune référence épinglée.</p>}
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
              {pins.map((p) => (
                <div key={p.id} style={{ border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, overflow: "hidden" }}>
                  {p.reference.capture_url
                    ? <a href={p.reference.capture_url} target="_blank" rel="noreferrer"><img src={p.reference.capture_url} alt={p.reference.titre} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top", display: "block" }} /></a>
                    : <div style={{ aspectRatio: "16 / 10" }} />}
                  <div style={{ padding: 8, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{p.reference.titre}</div>
                    {p.commentaire && <div style={{ color: "#8b8f98" }}>{p.commentaire}</div>}
                    <button onClick={() => desepingler(p.reference.id)} style={{ background: "none", border: "none", color: "#8b8f98", cursor: "pointer", fontSize: 12.5, padding: 0, marginTop: 4 }}>Retirer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Le commentaire d'épingle (`commentaire`) est stocké et affiché ; sa saisie depuis l'interface n'est pas dans ce lot (l'API l'accepte déjà). Si Edgar le demande à la revue, ajouter un `prompt()` dans `epingler`.

- [ ] **Step 3: Compiler et build**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: succès ; `/briefs` et `/briefs/[id]` listées.

- [ ] **Step 4: Vérifier à l'écran en local**

`npm run dev`, ouvrir `http://localhost:3000/briefs`.
Expected : créer un brief avec un nouveau compte → redirection vers la fiche ; remplir « Clientèle visée », écrire une note, passer en « Complété », Enregistrer → « Enregistré à hh:mm » ; recharger la page → tout est conservé ; épingler une référence, la retirer ; revenir à la liste → filtre « Complété » montre le brief. Recréer un brief en choisissant le même compte dans le sélecteur → deux briefs pour ce compte, pas de second compte. Arrêter le serveur dev.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/briefs"
git commit -m "Pages Briefs : liste, creation, fiche avec reponses, notes et references epinglees"
```

---

### Task 11: Mise en ligne du lot 1 et documentation

**Files:**
- Modify: `README.md` (dépôt hub-agence) ; `/Users/ed/Desktop/jarvis-ecom/CLAUDE.md` (structure du workspace)

- [ ] **Step 1: Déployer**

```bash
cd /Users/ed/Desktop/jarvis-ecom/livrables/hub-agence
git push
vercel --prod
```

Expected: déploiement en succès (si le dépôt GitHub est lié à Vercel, le `git push` suffit ; vérifier avec `vercel ls hub-agence | head -3`).

- [ ] **Step 2: Vérifier en ligne (avec Edgar, derrière mot de passe)**

Edgar se connecte et déroule :
1. Bibliothèque : ajouter 2 références avec capture (dont une utile à la démo Atelier Hauteville).
2. Briefs : créer le brief « Atelier Hauteville » (compte fictif), remplir 3 champs, épingler les 2 références, enregistrer, recharger.
3. Épingler deux fois la même référence (double clic rapide) → une seule épingle affichée.
4. Supprimer dans Bibliothèque une référence épinglée → la fiche du brief s'ouvre normalement, l'épingle a disparu.
5. Sur iPhone : la page Bibliothèque s'affiche en une colonne, sans défilement horizontal.

Expected : les 5 points passent. Tout écart est corrigé avant de déclarer le lot fini.

- [ ] **Step 3: README**

Ajouter au `README.md` du hub, avant « Tests » :

```markdown
## État

- Lot 0 (socle) et lot 1 (Bibliothèque, Briefs, références épinglées) : en ligne.
- Lot 2 : réception des briefs par Tally. Lots 3 à 5 : comptes et projets, devis et
  factures, to-do Notion et GA4. Voir la spec.
```

```bash
git add README.md && git commit -m "README : etat apres le lot 1" && git push
```

- [ ] **Step 4: Workspace**

Dans `/Users/ed/Desktop/jarvis-ecom/CLAUDE.md`, section « Workspace Structure », sous `livrables/`, ajouter la ligne :

```
│   ├── hub-agence/              # Hub Agence, dépôt git indépendant (Beepurst/hub-agence)
```

et après la section « Hub Ecom (inutilisé) », ajouter :

```markdown
## Hub Agence

`livrables/hub-agence/` est l'outil interne de l'agence (briefs, bibliothèque, puis comptes, devis, factures). Copié de l'Orbikal Hub le 15/10/2026. Spec : `docs/superpowers/specs/2026-10-15-hub-agence-design.md`.

- **Dépôt git indépendant** (`github.com/Beepurst/hub-agence`), exclu du `.gitignore` du workspace. Ne jamais le commiter depuis la racine.
- **Ne jamais lancer `npm run build` pendant qu'un serveur dev tourne.**
```

```bash
cd /Users/ed/Desktop/jarvis-ecom
git add CLAUDE.md .gitignore
git commit -m "Workspace : declaration du Hub Agence"
```
