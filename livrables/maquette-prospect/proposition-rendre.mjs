#!/usr/bin/env node
// Rendu et contrôle de la proposition d'un prospect.
//
//   node livrables/maquette-prospect/proposition-rendre.mjs <dossier du prospect>
//
// Lit <dossier>/proposition/contenu.json (écrit par l'agent) et donnees.json (proposition-preparer.mjs), puis :
// 1. verifierContenu (champs, bornes, longueurs, tirets longs, montants du devis, du site et du RDV, PageSpeed) ;
// 2. captures dans proposition/img/ : site actuel en 390 px (si le site du compte est « ok »), accroche de la maquette
//    en 1440 x 720 puis les sélecteurs de contenu.captures (bandeau .maquette masqué) ;
// 3. remplissage du gabarit -> proposition/proposition.html ;
// 4. mesure dans le DOM : refus si un élément dépasse le bas d'une page, chevauche son pied de page, ou si un texte est coupé ;
// 5. PDF A4 proposition/proposition-<slug>.pdf (exactement 3 pages) et aperçus proposition/apercu-1.png à apercu-3.png.
// Sortie standard : JSON { ok, erreurs, pdf, apercus }. Codes de sortie : 0 bon, 2 refus (rien n'est déposé).
// Les aperçus sont écrits même en cas de refus de mise en page, pour voir où ça déborde.

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ErreurSortie, ICI, defiler, lancer, lancerNavigateur, slug } from "./commun.mjs";
import { PAGES_ATTENDUES, montantsDeTexte, verifierContenu } from "./proposition-controles.mjs";
import { remplirGabarit } from "./proposition-remplir.mjs";

const lireJson = (f) => {
  try {
    return JSON.parse(readFileSync(f, "utf8"));
  } catch (e) {
    throw new ErreurSortie(2, `${f} illisible ou absent : ${e.message}`);
  }
};

/** Même regex que le hub (nombrePagesPdf) : on compte comme lui. */
export const nombrePagesPdf = (octets) => (Buffer.from(octets).toString("latin1").match(/\/Type\s*\/Page(?![A-Za-z])/g) ?? []).length;

/** Dossier de la maquette : `maquette/` pour l'accueil, sinon `maquette-<page>/`. */
export function dossierMaquette(dossier, page) {
  return join(dossier, page === "accueil" ? "maquette" : `maquette-${slug(page)}`);
}

async function ouvrir(contexte, url, largeur, hauteur) {
  const p = await contexte.newPage();
  await p.setViewportSize({ width: largeur, height: hauteur });
  await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(2500);
  // Bandeau de cookies du site actuel : « Refuser » s'il y en a un.
  const refuser = p.getByRole("button", { name: /^(Refuser|Tout refuser)/i });
  if (await refuser.count()) {
    await refuser.first().click().catch(() => {});
    await p.waitForTimeout(800);
  }
  return p;
}

async function faireCaptures(navigateur, dossier, contenu, donnees) {
  const img = join(dossier, "proposition", "img");
  mkdirSync(img, { recursive: true });
  const images = { mobile: null, accroche: null, capture1: null, capture2: null };
  const jpg = (nom) => ({ path: join(img, nom), type: "jpeg", quality: 82 });
  const contexte = await navigateur.newContext({ deviceScaleFactor: 2, locale: "fr-FR" });
  try {
    const compte = donnees.compte ?? {};
    const urlMobile = contenu.urlMobile || compte.site_url;
    if (compte.site_statut === "ok" && urlMobile) {
      const p = await ouvrir(contexte, urlMobile, 390, 844);
      await p.screenshot(jpg("actuel-mobile.jpg"));
      await p.close();
      images.mobile = "img/actuel-mobile.jpg";
    }

    const fichier = join(dossierMaquette(dossier, contenu.page), "index.html");
    if (!existsSync(fichier)) throw new ErreurSortie(2, `${fichier} introuvable : maquette de la page « ${contenu.page} » absente.`);
    const p = await ouvrir(contexte, pathToFileURL(fichier).href, 1440, 720);
    await p.addStyleTag({ content: ".maquette{display:none!important}" });
    await p.screenshot(jpg("maq-accroche.jpg"));
    images.accroche = "img/maq-accroche.jpg";
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.evaluate(defiler);
    for (const [i, c] of (contenu.captures ?? []).entries()) {
      const el = await p.$(c.selecteur);
      if (!el) throw new ErreurSortie(2, `captures[${i}] : sélecteur « ${c.selecteur} » introuvable dans la maquette.`);
      await el.scrollIntoViewIfNeeded();
      await p.waitForTimeout(2500);
      await p.evaluate(() => document.querySelector("nav")?.style.setProperty("display", "none"));
      const nom = `maq-${i + 1}.jpg`;
      await el.screenshot(jpg(nom));
      images[`capture${i + 1}`] = `img/${nom}`;
    }
    await p.close();
  } finally {
    await contexte.close();
  }
  return images;
}

// Exécuté dans la page : liste des débordements de chaque .page (texte du premier élément fautif, tronqué à 60 caractères).
function mesurerPages() {
  const coupe = (el) => ((el.innerText || el.textContent || "").trim().replace(/\s+/g, " ") || `<${el.tagName.toLowerCase()}>`).slice(0, 60);
  const sortie = [];
  document.querySelectorAll(".page").forEach((page, i) => {
    const boite = page.getBoundingClientRect();
    const pied = page.querySelector(":scope > footer");
    const piedBoite = pied?.getBoundingClientRect();
    const fautes = [];
    for (const el of page.querySelectorAll("*")) {
      if (pied && (el === pied || pied.contains(el))) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > boite.right + 0.5) fautes.push({ raison: "dépasse le côté droit de la page", texte: coupe(el), y: r.top });
      else if (r.bottom > boite.bottom + 0.5) fautes.push({ raison: "dépasse le bas de la page", texte: coupe(el), y: r.top });
      else if (piedBoite && r.bottom > piedBoite.top + 0.5) fautes.push({ raison: "chevauche le pied de page", texte: coupe(el), y: r.top });
    }
    for (const el of [page, ...page.querySelectorAll("*")]) {
      // Seuls les éléments qui rognent (overflow autre que visible) peuvent couper un texte ; un dépassement visible est déjà vu plus haut.
      const st = getComputedStyle(el);
      const coupeV = el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 0 && st.overflowY !== "visible";
      const coupeH = el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && st.overflowX !== "visible";
      if (coupeV || coupeH) {
        fautes.push({ raison: "texte ou contenu coupé", texte: coupe(el), y: el === page ? Infinity : el.getBoundingClientRect().top });
      }
    }
    fautes.sort((a, b) => a.y - b.y);
    if (fautes.length) sortie.push({ page: i + 1, ...fautes[0] });
  });
  return { nombre: document.querySelectorAll(".page").length, fautes: sortie };
}

/** Montants en euros des sources du prospect : site/textes.json, site/textes-page-*.json, résumé et transcription du RDV. */
export function montantsSources(dossier, donnees) {
  const textes = [donnees.rdv?.resume, donnees.rdv?.transcription].filter(Boolean).map((t) => (typeof t === "string" ? t : JSON.stringify(t)));
  const site = join(dossier, "site");
  if (existsSync(site)) {
    for (const f of readdirSync(site)) {
      if (f === "textes.json" || /^textes-page-.*\.json$/.test(f)) textes.push(readFileSync(join(site, f), "utf8"));
    }
  }
  return [...new Set(textes.flatMap(montantsDeTexte))];
}

/** Rendu complet. Retourne { ok, erreurs, pdf, apercus } ; ne quitte pas le processus. */
export async function rendre(dossierArg) {
  const dossier = resolve(dossierArg);
  const dossierProp = join(dossier, "proposition");
  const contenu = lireJson(join(dossierProp, "contenu.json"));
  const donnees = lireJson(join(dossierProp, "donnees.json"));
  const fPs = join(dossier, "site", "pagespeed.json");
  const pagespeed = existsSync(fPs) ? lireJson(fPs) : null;

  const erreurs = verifierContenu(contenu, donnees, pagespeed, montantsSources(dossier, donnees));
  if (erreurs.length) return { ok: false, erreurs, pdf: null, apercus: [] };

  const nom = slug(donnees.compte?.entreprise || donnees.compte?.nom) || "prospect";
  const navigateur = await lancerNavigateur();
  try {
    const images = await faireCaptures(navigateur, dossier, contenu, donnees);
    copyFileSync(join(ICI, "proposition-kleak.png"), join(dossierProp, "proposition-kleak.png"));
    const html = remplirGabarit(readFileSync(join(ICI, "proposition-gabarit.html"), "utf8"), contenu, donnees, images);
    const fichierHtml = join(dossierProp, "proposition.html");
    writeFileSync(fichierHtml, html);

    const contexte = await navigateur.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5, locale: "fr-FR" });
    const p = await contexte.newPage();
    await p.goto(pathToFileURL(fichierHtml).href, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);

    const mesure = await p.evaluate(mesurerPages);
    const problemes = [];
    if (mesure.nombre !== PAGES_ATTENDUES) problemes.push(`Le gabarit rendu compte ${mesure.nombre} page(s), ${PAGES_ATTENDUES} attendues.`);
    for (const f of mesure.fautes) problemes.push(`Page ${f.page} : ${f.raison} (« ${f.texte} »). Raccourcir les textes, ne pas réduire les polices.`);

    const apercus = [];
    for (let i = 0; i < mesure.nombre; i++) {
      const f = join(dossierProp, `apercu-${i + 1}.png`);
      await p.locator(".page").nth(i).screenshot({ path: f });
      apercus.push(f);
    }
    if (problemes.length) {
      await contexte.close();
      return { ok: false, erreurs: problemes, pdf: null, apercus };
    }

    const pdf = join(dossierProp, `proposition-${nom}.pdf`);
    await p.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
    await contexte.close();
    const pages = nombrePagesPdf(readFileSync(pdf));
    if (pages !== PAGES_ATTENDUES) {
      return { ok: false, erreurs: [`Le PDF compte ${pages} page(s), ${PAGES_ATTENDUES} attendues.`], pdf: null, apercus };
    }
    return { ok: true, erreurs: [], pdf, apercus };
  } finally {
    await navigateur.close();
  }
}

async function principal() {
  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!arg) throw new ErreurSortie(1, "Usage : proposition-rendre.mjs <dossier du prospect>");
  const r = await rendre(arg);
  process.stdout.write(JSON.stringify(r, null, 2) + "\n");
  if (!r.ok) process.exit(2);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) lancer(principal);
