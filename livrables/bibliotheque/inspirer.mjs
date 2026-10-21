#!/usr/bin/env node
// Inspirations du Framer Marketplace pour l'agent bibliothecaire (mode INSPIRER).
//
//   node livrables/bibliotheque/inspirer.mjs --categories
//   node livrables/bibliotheque/inspirer.mjs --lister <categorie> [<categorie> ...] [--max <n>] --sortie <dossier>
//   node livrables/bibliotheque/inspirer.mjs --planche <dossier>/candidats.json <slug> [<slug> ...] --sortie <dossier> [--nom <fichier.jpg>]
//
// --categories : JSON { categories: ["agency", "beauty", ...] } lu sur la page des templates.
// --lister     : pour chaque categorie, les <max> premiers templates de sa liste (12 par defaut, par
//                categorie), sans doublon, avec leur fiche : { slug, nom, description, prix, categories, demo }.
//                Ecrit <sortie>/candidats.json, sortie { fichier, candidats } (compacte).
// --planche    : capture le haut de page (1440 x 900) de la demo de chaque slug, puis assemble
//                <sortie>/planche.jpg (ou --nom) : vignettes numerotees, nom, prix, adresse de la demo.
//                Sortie { planche, vignettes: [{ n, slug, nom, demo, ok }] }.
//
// Codes de sortie : 0 succes, 1 erreur inattendue, 3 marketplace inaccessible (blocage anti-robots).
// Playwright est charge depuis livrables/creas-meta/node_modules (aucune installation ici).

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://www.framer.com/marketplace/templates/";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const PAUSE_MS = 350; // entre deux pages du marketplace, pour ne pas declencher le blocage
const ECRAN = { width: 1440, height: 900 };

class ErreurSortie extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

// Une page du marketplace. Le premier passage tombe parfois sur la page de controle de Vercel
// (429) : on reessaie deux fois en laissant du temps.
async function page(url) {
  for (let essai = 0; essai < 3; essai++) {
    if (essai > 0) await attendre(3000 * essai);
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" } });
    if (r.ok) return r.text();
    if (r.status !== 429 && r.status < 500) throw new ErreurSortie(1, `${url} : code ${r.status}`);
  }
  throw new ErreurSortie(3, `marketplace inaccessible (blocage anti-robots) : ${url}`);
}

function jsonLd(html) {
  const blocs = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      blocs.push(JSON.parse(m[1]));
    } catch {
      // bloc illisible : ignore
    }
  }
  return blocs;
}

const slugDe = (url) => url.replace(/\/$/, "").split("/").pop();

async function categories() {
  const html = await page(BASE);
  const vues = new Set();
  for (const m of html.matchAll(/href="\/marketplace\/templates\/categories\/([a-z0-9-]+)\/"/g)) vues.add(m[1]);
  return [...vues].sort();
}

async function ficheTemplate(slug) {
  const html = await page(`${BASE}${slug}/`);
  const produit = jsonLd(html).find((b) => b["@type"] === "Product") ?? {};
  const fil = jsonLd(html).find((b) => b["@type"] === "BreadcrumbList");
  // Le bouton d'apercu est le premier lien externe du createur (rel « ugc »), avant le lien d'achat
  // quand le template est vendu hors de Framer (Polar, Gumroad...).
  const externes = [...html.matchAll(/<a [^>]*rel="[^"]*ugc[^"]*"[^>]*href="(https:\/\/[^"]+)"/g)].map((m) => m[1]);
  const demo = externes.find((u) => !/polar\.sh|gumroad|lemonsqueezy|stripe|paddle|payhip/.test(u)) ?? null;
  const prix = produit.offers?.price;
  return {
    slug,
    nom: (produit.name ?? slug).trim(),
    description: produit.description ?? null,
    prix: prix === undefined ? null : prix === "0" ? "gratuit" : `${prix} ${produit.offers?.priceCurrency ?? ""}`.trim(),
    categorie: fil?.itemListElement?.[2]?.name ?? null,
    demo,
  };
}

async function lister(cats, max, sortie) {
  const connues = new Set(await categories());
  const inconnues = cats.filter((c) => !connues.has(c));
  if (inconnues.length) throw new ErreurSortie(1, `categorie inconnue : ${inconnues.join(", ")} (voir --categories)`);
  const parSlug = new Map();
  for (const cat of cats) {
    await attendre(PAUSE_MS);
    const liste = jsonLd(await page(`${BASE}categories/${cat}/`)).find((b) => b["@type"] === "ItemList");
    const slugs = (liste?.itemListElement ?? []).map((e) => slugDe(e.url)).slice(0, max);
    for (const slug of slugs) {
      if (parSlug.has(slug)) {
        parSlug.get(slug).categories.push(cat);
        continue;
      }
      await attendre(PAUSE_MS);
      const f = await ficheTemplate(slug);
      parSlug.set(slug, { ...f, categories: [cat] });
    }
  }
  const candidats = [...parSlug.values()];
  mkdirSync(sortie, { recursive: true });
  writeFileSync(join(sortie, "candidats.json"), JSON.stringify({ candidats }, null, 2));
  return { fichier: join(sortie, "candidats.json"), candidats: candidats.map(({ slug, nom, description, prix, categories, demo }) => ({ slug, nom, description, prix, categories, demo })) };
}

async function planche(fichierCandidats, slugs, sortie, nom) {
  const { candidats } = JSON.parse(readFileSync(fichierCandidats, "utf8"));
  const choisis = slugs.map((s) => {
    const c = candidats.find((x) => x.slug === s);
    if (!c) throw new ErreurSortie(1, `slug absent de candidats.json : ${s}`);
    return c;
  });
  const dossier = join(sortie, "vignettes");
  mkdirSync(dossier, { recursive: true });
  const require = createRequire(new URL("../creas-meta/package.json", import.meta.url));
  const { chromium } = require("playwright");
  const navigateur = await chromium.launch();
  const vignettes = [];
  try {
    const contexte = await navigateur.newContext({ viewport: ECRAN, deviceScaleFactor: 1 });
    for (const [i, c] of choisis.entries()) {
      const n = i + 1;
      const fichier = join(dossier, `${n}-${c.slug}.jpg`);
      let ok = false;
      if (c.demo) {
        const p = await contexte.newPage();
        try {
          await p.goto(c.demo, { waitUntil: "load", timeout: 30000 });
          await p.waitForTimeout(2500); // les apparitions du haut de page
          await p.screenshot({ path: fichier, type: "jpeg", quality: 70 });
          ok = true;
        } catch {
          ok = false;
        }
        await p.close();
      }
      vignettes.push({ n, slug: c.slug, nom: c.nom, prix: c.prix, demo: c.demo, ok, fichier });
    }
    const echapper = (t) => String(t ?? "").replace(/[&<>"]/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[x]);
    const tuiles = vignettes
      .map(
        (v) => `<figure>${v.ok ? `<img src="data:image/jpeg;base64,${readFileSync(v.fichier).toString("base64")}">` : `<div class="vide">démo inaccessible</div>`}
<figcaption><b>${v.n}. ${echapper(v.nom)}</b> · ${echapper(v.prix ?? "")}<br><span>${echapper(v.demo ?? "pas de démo")}</span></figcaption></figure>`,
      )
      .join("\n");
    const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#f3f2ef;font:15px/1.35 -apple-system,Helvetica,sans-serif;color:#111;width:1432px}
.grille{display:grid;grid-template-columns:1fr 1fr;gap:24px}
figure{margin:0;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px #0002}
img,.vide{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top}
.vide{display:grid;place-items:center;background:#ddd;color:#666}
figcaption{padding:10px 14px}span{color:#666;font-size:13px}
</style><div class="grille">${tuiles}</div>`;
    const p = await contexte.newPage();
    await p.setViewportSize({ width: 1480, height: 900 });
    await p.setContent(html, { waitUntil: "load" });
    const sortiePlanche = join(sortie, nom);
    await p.screenshot({ path: sortiePlanche, type: "jpeg", quality: 72, fullPage: true });
    return { planche: sortiePlanche, vignettes: vignettes.map(({ n, slug, nom, demo, ok }) => ({ n, slug, nom, demo, ok })) };
  } finally {
    await navigateur.close();
  }
}

async function principal(argv) {
  const val = (opt) => {
    const i = argv.indexOf(opt);
    return i >= 0 ? argv[i + 1] : null;
  };
  const libres = (depuis) => {
    const res = [];
    for (let i = depuis; i < argv.length; i++) {
      if (argv[i].startsWith("--")) break;
      res.push(argv[i]);
    }
    return res;
  };
  if (argv.includes("--categories")) return { categories: await categories() };
  const sortie = val("--sortie");
  if (argv.includes("--lister")) {
    const cats = libres(argv.indexOf("--lister") + 1);
    if (!cats.length || !sortie) throw new ErreurSortie(1, "Usage : --lister <categorie> [...] [--max <n>] --sortie <dossier>");
    return lister(cats, Number(val("--max") ?? 12), sortie);
  }
  if (argv.includes("--planche")) {
    const [fichier, ...slugs] = libres(argv.indexOf("--planche") + 1);
    if (!fichier || !slugs.length || !sortie) throw new ErreurSortie(1, "Usage : --planche <candidats.json> <slug> [...] --sortie <dossier>");
    if (slugs.length > 10) throw new ErreurSortie(1, "10 templates au plus par planche");
    return planche(fichier, slugs, sortie, val("--nom") ?? "planche.jpg");
  }
  throw new ErreurSortie(1, "Usage : --categories | --lister ... | --planche ... (voir l'en-tete du script)");
}

principal(process.argv.slice(2))
  .then((r) => process.stdout.write(JSON.stringify(r) + "\n"))
  .catch((e) => {
    process.stderr.write(`${e.message}\n`);
    process.exit(e instanceof ErreurSortie ? e.code : 1);
  });
