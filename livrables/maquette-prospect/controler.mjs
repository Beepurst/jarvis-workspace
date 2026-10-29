#!/usr/bin/env node
// Contrôle de la maquette avant dépôt, dans les conditions du hub.
//
//   node livrables/maquette-prospect/controler.mjs <dossier du prospect>
//
// Lit <dossier>/maquette/index.html et ses images (maquette/img/). Deux temps :
// 1. contrôle du fichier (mêmes règles que le hub, plus celles de l'agence : bandeau, polices, tirets) ;
// 2. rendu par Playwright, servi comme par le hub : adresse /maquette/<jeton>, <base href> inséré,
//    en-tête Content-Security-Policy « sandbox allow-scripts » (page sans origine).
//    Bureau 1440 px et mobile 390 px (iPhone), page défilée en entier pour déclencher les apparitions.
//
// Produit dans <dossier> : controle-bureau.jpg et controle-mobile.jpg (pleine page, coupées à 12000 px),
// et controle/bureau-N.jpg, controle/mobile-N.jpg (tranches lisibles, 6 au plus chacune).
// Sortie : JSON { ok, erreurs, avertissements, mobile, captures }.
// Codes de sortie : 0 bon, 2 refus (largeur de défilement > 390 px à 390 px, image absente ou cassée,
// erreur JavaScript, règle du fichier), 1 erreur inattendue.

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import {
  ErreurSortie,
  capturePleinePage,
  cheminRelatifValide,
  defiler,
  lancer,
  lancerNavigateur,
  optionsContexte,
  verifierHtml,
} from "./commun.mjs";

const JETON = "controle-local";
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
// Mêmes en-têtes que la page publique du hub (src/lib/maquette-prospect/publique.ts).
const ENTETES = {
  "Content-Security-Policy": "sandbox allow-scripts",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};

/** Copie de avecBase du hub. */
function avecBase(html, jeton) {
  const base = `<base href="/maquette/${jeton}/">`;
  if (/<head(\s[^>]*)?>/i.test(html)) return html.replace(/<head(\s[^>]*)?>/i, (o) => `${o}${base}`);
  if (/<html(\s[^>]*)?>/i.test(html)) return html.replace(/<html(\s[^>]*)?>/i, (o) => `${o}<head>${base}</head>`);
  return `<head>${base}</head>${html}`;
}

function servir(dossierMaquette, html) {
  const serveur = createServer((req, res) => {
    const chemin = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (chemin === `/maquette/${JETON}` || chemin === `/maquette/${JETON}/`) {
      res.writeHead(200, { ...ENTETES, "Content-Type": "text/html; charset=utf-8" });
      return res.end(avecBase(html, JETON));
    }
    const prefixe = `/maquette/${JETON}/`;
    const relatif = chemin.startsWith(prefixe) ? chemin.slice(prefixe.length) : null;
    if (relatif && cheminRelatifValide(relatif) && existsSync(join(dossierMaquette, relatif))) {
      res.writeHead(200, { "Content-Type": TYPES[extname(relatif).toLowerCase()] ?? "application/octet-stream", "Content-Security-Policy": "sandbox", "X-Content-Type-Options": "nosniff" });
      return res.end(readFileSync(join(dossierMaquette, relatif)));
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Introuvable");
  });
  return new Promise((ok) => serveur.listen(0, "127.0.0.1", () => ok(serveur)));
}

// Exécuté dans la page, au DOMContentLoaded : éléments cachés dès le premier écran (apparition sur l'accroche).
function marquerPremierEcran() {
  document.addEventListener("DOMContentLoaded", () => {
    let n = 0;
    for (const el of document.body.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && r.width > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05 && (el.innerText || "").trim()) n++;
    }
    window.__kleakCachesPremierEcran = n;
  });
}

function mesurer(largeurCible) {
  const decrire = (el) => {
    const c = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${c ? `.${c}` : ""}`;
  };
  const largeurDefilement = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  // éléments qui dépassent à droite, les plus extérieurs seulement
  const depassent = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= largeurCible + 1) continue;
    if (depassent.some((p) => p.el.contains(el))) continue;
    if (getComputedStyle(el).position === "fixed") continue;
    depassent.push({ el, desc: `${decrire(el)} (${Math.round(r.width)} px de large, bord droit à ${Math.round(r.right)} px)` });
    if (depassent.length >= 6) break;
  }
  const cassees = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src"));
  const invisibles = [...document.body.querySelectorAll("h1, h2, h3, p, li, img, a, button")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05 && !el.closest("[aria-hidden=true]");
  }).length;
  return {
    largeurDefilement,
    largeurEcran: window.innerWidth,
    depassent: depassent.map((d) => d.desc),
    cassees,
    invisibles,
    cachesPremierEcran: window.__kleakCachesPremierEcran ?? 0,
    hauteur: document.documentElement.scrollHeight,
  };
}

async function rendre(navigateur, url, mobile, dossier, nom) {
  const contexte = await navigateur.newContext(optionsContexte(mobile));
  const page = await contexte.newPage();
  const erreursJs = [];
  const consoles = [];
  const echecs = [];
  page.on("pageerror", (e) => erreursJs.push(e.message.split("\n")[0]));
  page.on("console", (m) => m.type() === "error" && consoles.push(m.text().slice(0, 200)));
  page.on("response", (r) => r.status() >= 400 && echecs.push(`${r.status()} ${r.url().replace(/^http:\/\/127\.0\.0\.1:\d+\/maquette\/[^/]+\//, "")}`));
  page.on("requestfailed", (r) => !/fonts\.(googleapis|gstatic)/.test(r.url()) && echecs.push(`échec ${r.url()}`));
  await page.addInitScript(marquerPremierEcran);
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await page.evaluate(defiler);
  await page.waitForTimeout(400);
  const m = await page.evaluate(mesurer, mobile ? 390 : 1440);
  const { image, coupee } = await capturePleinePage(page, 12000, 72);
  writeFileSync(join(dossier, `controle-${nom}.jpg`), image);
  // tranches lisibles
  const tranche = mobile ? 1600 : 1800;
  const largeur = page.viewportSize().width;
  const total = Math.min(m.hauteur, tranche * 6);
  const tranches = [];
  for (let i = 0, y = 0; y < total; i++, y += tranche) {
    const f = join(dossier, "controle", `${nom}-${i + 1}.jpg`);
    writeFileSync(f, await page.screenshot({ type: "jpeg", quality: 72, fullPage: true, clip: { x: 0, y, width: largeur, height: Math.min(tranche, total - y) } }));
    tranches.push(f);
  }
  await contexte.close();
  return { ...m, erreursJs, consoles, echecs, coupee, tranches };
}

async function principal() {
  const arg = process.argv[2];
  if (!arg) throw new ErreurSortie(1, "Usage : controler.mjs <dossier du prospect>");
  const dossier = resolve(arg);
  let dossierMaquette = join(dossier, "maquette");
  if (!existsSync(join(dossierMaquette, "index.html")) && existsSync(join(dossier, "index.html"))) dossierMaquette = dossier;
  const fichier = join(dossierMaquette, "index.html");
  if (!existsSync(fichier)) throw new ErreurSortie(1, `${fichier} introuvable.`);
  const html = readFileSync(fichier, "utf8");

  const { erreurs, avertissements } = verifierHtml(html, dossierMaquette);

  rmSync(join(dossier, "controle"), { recursive: true, force: true });
  mkdirSync(join(dossier, "controle"), { recursive: true });
  const serveur = await servir(dossierMaquette, html);
  const url = `http://127.0.0.1:${serveur.address().port}/maquette/${JETON}`;
  const navigateur = await lancerNavigateur();
  let bureau;
  let mobile;
  try {
    bureau = await rendre(navigateur, url, false, dossier, "bureau");
    mobile = await rendre(navigateur, url, true, dossier, "mobile");
  } finally {
    await navigateur.close();
    serveur.close();
  }

  if (mobile.largeurDefilement > 390) {
    erreurs.push(`Mobile : largeur de défilement ${mobile.largeurDefilement} px à 390 px (barre horizontale, page dézoomée). En cause : ${mobile.depassent.join(" ; ") || "élément non identifié"}.`);
  }
  if (bureau.largeurDefilement > 1440) erreurs.push(`Bureau : largeur de défilement ${bureau.largeurDefilement} px à 1440 px. En cause : ${bureau.depassent.join(" ; ")}.`);
  const cassees = [...new Set([...bureau.cassees, ...mobile.cassees])];
  if (cassees.length) erreurs.push(`Image(s) cassée(s) au rendu : ${cassees.join(", ")}.`);
  const echecs = [...new Set([...bureau.echecs, ...mobile.echecs])];
  if (echecs.length) erreurs.push(`Ressource(s) introuvable(s) au rendu : ${echecs.slice(0, 8).join(", ")}.`);
  const js = [...new Set([...bureau.erreursJs, ...mobile.erreursJs])];
  if (js.length) erreurs.push(`Erreur(s) JavaScript dans le bac à sable du hub : ${js.slice(0, 4).join(" | ")}.`);
  const consoles = [...new Set([...bureau.consoles, ...mobile.consoles])].filter((c) => !/Failed to load resource/.test(c));
  if (consoles.length) avertissements.push(`Console : ${consoles.slice(0, 4).join(" | ")}`);
  if (bureau.cachesPremierEcran || mobile.cachesPremierEcran) {
    avertissements.push(`Apparition sur l'accroche : ${Math.max(bureau.cachesPremierEcran, mobile.cachesPremierEcran)} élément(s) à texte cachés au chargement dans le premier écran. L'accroche s'affiche sans effet.`);
  }
  if (bureau.invisibles || mobile.invisibles) {
    avertissements.push(`${Math.max(bureau.invisibles, mobile.invisibles)} élément(s) encore invisibles après défilement complet : apparition qui ne se déclenche pas ?`);
  }
  if (bureau.coupee || mobile.coupee) avertissements.push("Page de plus de 12000 px : captures pleine page coupées.");

  const ok = erreurs.length === 0;
  process.stdout.write(
    JSON.stringify(
      {
        ok,
        erreurs,
        avertissements,
        mobile: { largeurDefilement: mobile.largeurDefilement, hauteur: mobile.hauteur },
        bureau: { hauteur: bureau.hauteur },
        captures: {
          bureau: join(dossier, "controle-bureau.jpg"),
          mobile: join(dossier, "controle-mobile.jpg"),
          tranchesBureau: bureau.tranches,
          tranchesMobile: mobile.tranches,
        },
      },
      null,
      2,
    ) + "\n",
  );
  if (!ok) process.exitCode = 2;
}

lancer(principal);
