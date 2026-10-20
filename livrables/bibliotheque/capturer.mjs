#!/usr/bin/env node
// Capture et analyse d'une section de page pour l'agent bibliothecaire.
//
//   node livrables/bibliotheque/capturer.mjs <url> --lister [--sortie <dossier>]
//   node livrables/bibliotheque/capturer.mjs <url> --section <n> [--sortie <dossier>]
//   node livrables/bibliotheque/capturer.mjs <url> --ecran <haut> [--sortie <dossier>]
//
// --lister  : JSON { sections: [{ n, balise, id, classes, premierTitre, haut, hauteur }] } sur la
//             sortie standard, et apercu.jpg (page entiere reduite, sections numerotees).
// --section : capture.jpg (la section seule, JPEG, 4 Mo au plus) et analyse.json (bureau et mobile).
// --ecran   : repli quand une section ne s'isole pas : capture.jpg de l'ecran (1440 x 900) avec
//             son haut a <haut> px du haut de la page. Pas d'analyse.
//
// Codes de sortie : 0 succes, 1 erreur inattendue, 2 section introuvable, 3 page inaccessible.
// Playwright est charge depuis livrables/creas-meta/node_modules (aucune installation ici).

import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const require = createRequire(new URL("../creas-meta/package.json", import.meta.url));
const { chromium } = require("playwright");

const CAPTURE_MAX_BYTES = 4 * 1024 * 1024; // meme limite que le hub
const BUREAU = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const DEBUT = Date.now();
const trace = (m) => process.env.KLEAK_DEBUG && process.stderr.write(`[${((Date.now() - DEBUT) / 1000).toFixed(1)} s] ${m}\n`);

class ErreurSortie extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// ---------- arguments ----------

function lireArguments(argv) {
  const args = { url: null, lister: false, section: null, ecran: null, sortie: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lister") args.lister = true;
    else if (a === "--section") args.section = Number(argv[++i]);
    else if (a === "--ecran") args.ecran = Number(argv[++i]);
    else if (a === "--sortie") args.sortie = argv[++i];
    else if (!a.startsWith("--") && !args.url) args.url = a;
    else throw new ErreurSortie(1, `Argument inconnu : ${a}`);
  }
  if (!args.url) throw new ErreurSortie(1, "URL manquante. Usage : capturer.mjs <url> --lister | --section <n> [--sortie <dossier>]");
  try {
    const u = new URL(args.url);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
  } catch {
    throw new ErreurSortie(1, `URL invalide : ${args.url}`);
  }
  if ([args.lister, args.section !== null, args.ecran !== null].filter(Boolean).length !== 1) {
    throw new ErreurSortie(1, "Choisir un seul mode : --lister, --section <n> ou --ecran <haut>.");
  }
  if (args.ecran !== null && (!Number.isFinite(args.ecran) || args.ecran < 0)) throw new ErreurSortie(1, "--ecran attend une position en px (0 ou plus).");
  if (args.section !== null && (!Number.isInteger(args.section) || args.section < 1)) {
    throw new ErreurSortie(1, "--section attend un numero entier a partir de 1 (celui donne par --lister).");
  }
  if (!args.sortie) {
    const h = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    args.sortie = `/tmp/kleak-biblio/${h}`;
  }
  args.sortie = resolve(args.sortie);
  return args;
}

// ---------- fonctions executees dans la page ----------

// Marque l'etat initial, au DOMContentLoaded (avant que les effets d'apparition aient joue) :
// opacite (quasi) nulle, transform. Injecte par addInitScript.
function marquerEtatInitial() {
  const hauteurEcran = window.innerHeight;
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    const marques = [];
    if (parseFloat(cs.opacity) < 0.05) marques.push("opacite0");
    if (cs.transform && cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") marques.push("transform");
    if (marques.length) {
      const r = el.getBoundingClientRect();
      if (r.top < hauteurEcran && r.bottom > 0) marques.push("premierEcran");
      el.setAttribute("data-kleak-init", marques.join(" "));
    }
  }
}

async function defiler() {
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const pas = Math.max(300, Math.round(window.innerHeight * 0.7));
  let y = 0;
  for (let i = 0; i < 200; i++) {
    const max = document.documentElement.scrollHeight;
    if (y >= max) break;
    window.scrollTo(0, y);
    await pause(120);
    y += pas;
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await pause(600);
  window.scrollTo(0, 0);
  await pause(800);
}

// Trouve les blocs de premier niveau et les marque data-kleak-n. Doit rester deterministe :
// la meme fonction sert en --lister et en --section, page rechargee.
function trouverSections() {
  const IGNORES = new Set(["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "TEMPLATE", "META", "svg", "IFRAME"]);
  const visible = (el) => {
    if (IGNORES.has(el.tagName)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.height >= 1 && r.width >= 1;
  };
  // les enveloppes display: contents (variantes Framer "ssr-variant") n'ont pas de boite :
  // on les traverse pour prendre leurs enfants
  const enfants = (el) =>
    [...el.children].flatMap((c) => (IGNORES.has(c.tagName) ? [] : getComputedStyle(c).display === "contents" ? enfants(c) : [c])).filter(visible);

  // les elements fixes (bandeau cookies, bouton flottant) ne comptent pas pour descendre ;
  // un en-tete fixe (header, nav) reste une section
  const fixe = (el) => getComputedStyle(el).position === "fixed";
  const enTete = (el) => el.matches("header, nav") || !!el.querySelector("nav");
  const blocsDe = (el) => {
    let racine = el;
    for (;;) {
      const k = enfants(racine);
      const flux = k.filter((c) => !fixe(c));
      if (flux.length !== 1) return k.filter((c) => !fixe(c) || enTete(c));
      if (k.some((c) => fixe(c) && enTete(c))) return k.filter((c) => !fixe(c) || enTete(c));
      racine = flux[0];
    }
  };

  let blocs;
  const main = document.querySelector("main");
  if (main && visible(main) && enfants(main).length) {
    blocs = blocsDe(main);
    // en-tete et pied de page hors de <main> : ajoutes avant et apres
    const autour = [...document.querySelectorAll("header, nav, footer")].filter(
      (el) => !main.contains(el) && !el.parentElement.closest("header, nav, footer") && visible(el),
    );
    const debut = autour.filter((el) => el.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING);
    const fin = autour.filter((el) => el.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING);
    blocs = [...debut, ...blocs, ...fin];
  } else {
    blocs = blocsDe(document.body);
  }

  const texte = (el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  return blocs.map((el, i) => {
    el.setAttribute("data-kleak-n", String(i + 1));
    const r = el.getBoundingClientRect();
    const titre = el.querySelector("h1, h2, h3");
    let premierTitre = titre ? texte(titre) : "";
    if (!premierTitre) premierTitre = texte(el);
    return {
      n: i + 1,
      balise: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: (typeof el.className === "string" ? el.className : "").trim().split(/\s+/).filter(Boolean).slice(0, 6).join(" ") || null,
      premierTitre: premierTitre.slice(0, 90) || null,
      haut: Math.round(r.top + window.scrollY),
      hauteur: Math.round(r.height),
    };
  });
}

// Pose un cadre et un numero sur chaque section, pour apercu.jpg.
function numeroterSections() {
  for (const el of document.querySelectorAll("[data-kleak-n]")) {
    const r = el.getBoundingClientRect();
    const cadre = document.createElement("div");
    cadre.setAttribute("data-kleak-cadre", "");
    cadre.style.cssText = `position:absolute;left:${r.left + window.scrollX}px;top:${r.top + window.scrollY}px;width:${r.width}px;height:${r.height}px;outline:4px solid #e11d48;outline-offset:-4px;z-index:2147483646;pointer-events:none;`;
    const num = document.createElement("div");
    num.textContent = el.getAttribute("data-kleak-n");
    num.style.cssText = "position:absolute;left:8px;top:8px;background:#e11d48;color:#fff;font:bold 44px/1 Arial,sans-serif;padding:8px 16px;border-radius:6px;";
    cadre.appendChild(num);
    document.body.appendChild(cadre);
  }
}

// Masque les elements fixes ou collants hors de la section n (tous si n est null), sinon ils
// recouvrent la capture ou se repetent sur chaque morceau.
function masquerFixesHors(n) {
  const cible = n === null ? null : document.querySelector(`[data-kleak-n="${n}"]`);
  let masques = 0;
  for (const el of document.body.querySelectorAll("*")) {
    if (el.hasAttribute("data-kleak-cadre") || el.closest("[data-kleak-cadre]")) continue;
    if (cible && (el === cible || el.contains(cible) || cible.contains(el))) continue;
    const p = getComputedStyle(el).position;
    if (p === "fixed" || p === "sticky") {
      el.style.setProperty("visibility", "hidden", "important");
      masques++;
    }
  }
  return masques;
}

// Fige la page avant une capture par morceaux : animations en pause (bandeaux defilants), elements
// collants remis a leur place dans le flux. Sinon les morceaux ne se raccordent pas.
function figerPourCapture() {
  for (const a of document.getAnimations()) a.pause();
  for (const el of document.body.querySelectorAll("*")) {
    if (getComputedStyle(el).position === "sticky") el.style.setProperty("position", "relative", "important");
  }
}

// Analyse des styles calcules de la section n.
function analyserSection(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  if (!sec) return null;
  const rs = sec.getBoundingClientRect();
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0" && !el.hasAttribute("data-kleak-init")) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1;
  };
  const tous = [sec, ...sec.querySelectorAll("*")];
  const vis = tous.filter(visible);
  const px = (v) => Math.round(parseFloat(v) * 10) / 10;
  const compter = (map, cle, poids = 1) => map.set(cle, (map.get(cle) || 0) + poids);
  const top = (map, k = 6) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, k);
  const texteDirect = (el) =>
    [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("").replace(/\s+/g, " ").trim();

  // textes
  const textes = vis.filter((el) => texteDirect(el).length > 0);
  const polices = new Map();
  const tailles = new Map();
  const couleursTexte = new Map();
  for (const el of textes) {
    const cs = getComputedStyle(el);
    const lg = texteDirect(el).length;
    const famille = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    compter(polices, `${famille}|${cs.fontWeight}|${cs.fontStyle}`, lg);
    compter(tailles, `${px(cs.fontSize)}|${cs.lineHeight}|${famille}|${cs.fontWeight}`, lg);
    compter(couleursTexte, cs.color, lg);
  }
  const totalTexte = [...polices.values()].reduce((a, b) => a + b, 0) || 1;

  const decrireTexte = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const t = (el.innerText || "").replace(/\s+/g, " ").trim();
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    return {
      balise: el.tagName.toLowerCase(),
      famille: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      graisse: cs.fontWeight,
      style: cs.fontStyle,
      taille: px(cs.fontSize),
      interligne: cs.lineHeight,
      espacementLettres: cs.letterSpacing,
      casse: cs.textTransform,
      alignement: cs.textAlign,
      couleur: cs.color,
      mots: t ? t.split(" ").length : 0,
      lignes: Math.max(1, Math.round(r.height / lh)),
      largeur: Math.round(r.width),
    };
  };
  const titres = [...sec.querySelectorAll("h1, h2, h3")].filter(visible).slice(0, 8).map(decrireTexte);
  const plusGrands = textes
    .slice()
    .sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))
    .slice(0, 4)
    .map(decrireTexte);
  const courantCle = top(tailles, 1)[0];
  const texteCourant = courantCle
    ? (([taille, interligne, famille, graisse]) => ({ taille: Number(taille), interligne, famille, graisse }))(courantCle[0].split("|"))
    : null;

  // fonds, ponderes par surface visible dans la section
  const fonds = new Map();
  const degradesOuImages = new Set();
  for (const el of vis) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const surface = Math.max(0, Math.min(r.right, rs.right) - Math.max(r.left, rs.left)) * Math.max(0, Math.min(r.bottom, rs.bottom) - Math.max(r.top, rs.top));
    if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") compter(fonds, cs.backgroundColor, surface);
    if (cs.backgroundImage && cs.backgroundImage !== "none") degradesOuImages.add(cs.backgroundImage.startsWith("url") ? "image de fond" : cs.backgroundImage.slice(0, 120));
  }
  // fond herite d'un ancetre si la section est transparente
  let fondSection = null;
  for (let a = sec; a; a = a.parentElement) {
    const bg = getComputedStyle(a).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") { fondSection = { couleur: bg, porteePar: a === sec ? "section" : "ancetre" }; break; }
  }
  const surfaceSec = rs.width * rs.height || 1;

  // boite du contenu (textes, images, boutons) : marges internes et largeur utile
  // boite du contenu : textes, images, videos, boutons et champs (pas les decors canvas ou svg),
  // en ignorant ce qui deborde de la section et les fonds plein cadre
  const contenu = vis.filter((el) => texteDirect(el) || ["IMG", "VIDEO", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
  let boite = null;
  for (const el of contenu) {
    const r = el.getBoundingClientRect();
    if (r.width >= rs.width - 1 && r.height >= rs.height - 1) continue; // fond plein cadre
    if (r.left < rs.left - 1 || r.right > rs.right + 1 || r.top < rs.top - 1 || r.bottom > rs.bottom + 1) continue; // deborde
    boite = boite
      ? { l: Math.min(boite.l, r.left), t: Math.min(boite.t, r.top), r: Math.max(boite.r, r.right), b: Math.max(boite.b, r.bottom) }
      : { l: r.left, t: r.top, r: r.right, b: r.bottom };
  }
  const maxWidths = new Map();
  for (const el of vis) {
    const mw = getComputedStyle(el).maxWidth;
    if (mw && mw !== "none" && mw !== "100%") compter(maxWidths, mw);
  }

  // grille ou flex principal : conteneur le plus grand dont au moins 2 enfants sont cote a cote
  let grille = null;
  for (const el of vis) {
    const cs = getComputedStyle(el);
    if (!(cs.display.includes("grid") || cs.display.includes("flex"))) continue;
    // seuls comptent les enfants qui portent du contenu (texte ou image), pas les decors
    const kids = [...el.children].filter((k) => visible(k) && ((k.innerText || "").trim() || k.querySelector("img, video, picture") || k.tagName === "IMG"));
    if (kids.length < 2) continue;
    const re = el.getBoundingClientRect();
    if (re.width > rs.width + 1) continue;
    const t0 = kids[0].getBoundingClientRect().top;
    const ligneEntiere = kids.filter((k) => Math.abs(k.getBoundingClientRect().top - t0) < 4);
    // colonnes visibles dans la largeur de la section ; le reste deborde (carrousel, bandeau)
    const ligne = ligneEntiere.filter((k) => { const r = k.getBoundingClientRect(); return r.left >= rs.left - 1 && r.right <= rs.right + 1; });
    const debordants = ligneEntiere.length - ligne.length;
    const colonnes = new Set(ligne.map((k) => Math.round(k.getBoundingClientRect().left))).size;
    if (colonnes < 2 && debordants === 0) continue;
    const r = el.getBoundingClientRect();
    const score = r.width * r.height;
    if (!grille || score > grille.score) {
      grille = {
        score,
        display: cs.display,
        direction: cs.flexDirection,
        colonnes,
        enfants: kids.length,
        lignes: new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top / 4))).size,
        modeleColonnes: cs.display.includes("grid") ? cs.gridTemplateColumns : null,
        ecart: cs.gap,
        largeursColonnes: ligne.map((k) => Math.round(k.getBoundingClientRect().width)),
        enfantsHorsSection: debordants, // > 0 : rangee qui deborde (carrousel ou bandeau defilant)
      };
    }
  }
  if (grille) delete grille.score;

  const ecarts = new Map();
  const rayons = new Map();
  const ombres = new Map();
  const bordures = new Map();
  for (const el of vis) {
    const cs = getComputedStyle(el);
    if ((cs.display.includes("flex") || cs.display.includes("grid")) && cs.gap && cs.gap !== "normal" && cs.gap !== "0px") compter(ecarts, cs.gap);
    if (cs.borderRadius && cs.borderRadius !== "0px") compter(rayons, cs.borderRadius);
    if (cs.boxShadow && cs.boxShadow !== "none") compter(ombres, cs.boxShadow.slice(0, 80));
    if (cs.borderTopStyle !== "none" && parseFloat(cs.borderTopWidth) > 0) compter(bordures, `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`);
  }

  // indices d'animation
  const init = [...sec.querySelectorAll("[data-kleak-init]")];
  if (sec.hasAttribute("data-kleak-init")) init.push(sec);
  const initAvec = (m) => init.filter((el) => el.getAttribute("data-kleak-init").split(" ").includes(m));
  const transitions = new Map();
  const animations = new Map();
  let infinies = 0;
  let willChange = 0;
  let collants = 0;
  let fondFixe = 0;
  for (const el of tous) {
    const cs = getComputedStyle(el);
    const durees = cs.transitionDuration.split(",").map((d) => parseFloat(d));
    if (cs.transitionProperty && cs.transitionProperty !== "none" && durees.some((d) => d > 0)) compter(transitions, `${cs.transitionProperty.slice(0, 60)} ${cs.transitionDuration}`);
    if (cs.animationName && cs.animationName !== "none") {
      compter(animations, `${cs.animationName} ${cs.animationDuration} ${cs.animationIterationCount}`);
      if (cs.animationIterationCount.includes("infinite")) infinies++;
    }
    if (cs.willChange && cs.willChange !== "auto") willChange++;
    if (cs.position === "sticky") collants++;
    if (cs.backgroundAttachment === "fixed") fondFixe++;
  }
  const videos = [...sec.querySelectorAll("video")].map((v) => ({
    autoplay: v.autoplay, boucle: v.loop, muet: v.muted,
    largeur: Math.round(v.getBoundingClientRect().width), hauteur: Math.round(v.getBoundingClientRect().height),
    hote: (() => { try { return new URL(v.currentSrc || v.src || v.querySelector("source")?.src || "", location.href).host || null; } catch { return null; } })(),
  }));
  const images = [...sec.querySelectorAll("img")].filter(visible);

  const arrondi = (o) => o && Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v)]));
  return {
    viewport: { largeur: window.innerWidth, hauteur: window.innerHeight },
    section: {
      balise: sec.tagName.toLowerCase(),
      id: sec.id || null,
      haut: Math.round(rs.top + window.scrollY),
      largeur: Math.round(rs.width),
      hauteur: Math.round(rs.height),
      padding: getComputedStyle(sec).padding,
    },
    polices: top(polices, 8).map(([k, v]) => { const [famille, graisse, style] = k.split("|"); return { famille, graisse, style, partTexte: Math.round((v / totalTexte) * 100) }; }),
    titres,
    textesLesPlusGrands: plusGrands,
    texteCourant,
    couleurs: {
      fondSection,
      fonds: top(fonds, 6).map(([c, s]) => ({ couleur: c, partSurface: Math.min(100, Math.round((s / surfaceSec) * 100)) })),
      textes: top(couleursTexte, 6).map(([c, v]) => ({ couleur: c, partTexte: Math.round((v / totalTexte) * 100) })),
      degradesOuImagesDeFond: [...degradesOuImages].slice(0, 6),
    },
    contenu: boite && {
      largeur: Math.round(boite.r - boite.l),
      margesInternes: arrondi({ haut: boite.t - rs.top, droite: rs.right - boite.r, bas: rs.bottom - boite.b, gauche: boite.l - rs.left }),
      maxWidthCss: top(maxWidths, 5).map(([v, c]) => ({ valeur: v, elements: c })),
    },
    grillePrincipale: grille,
    ecarts: top(ecarts, 8).map(([v, c]) => ({ valeur: v, elements: c })),
    rayons: top(rayons, 6).map(([v, c]) => ({ valeur: v, elements: c })),
    ombres: top(ombres, 4).map(([v, c]) => ({ valeur: v, elements: c })),
    bordures: top(bordures, 4).map(([v, c]) => ({ valeur: v, elements: c })),
    elementsVisibles: { textes: textes.length, images: images.length, boutonsOuLiens: vis.filter((el) => ["A", "BUTTON"].includes(el.tagName)).length },
    images: {
      nombre: images.length,
      plusLargeSource: images.reduce((m, i) => Math.max(m, i.naturalWidth || 0), 0),
      chargementDiffere: images.filter((i) => i.loading === "lazy").length,
    },
    animations: {
      opacite0AuChargement: initAvec("opacite0").length,
      transformAuChargement: initAvec("transform").length,
      cachesAuChargementDansPremierEcran: init.filter((el) => /opacite0/.test(el.getAttribute("data-kleak-init")) && /premierEcran/.test(el.getAttribute("data-kleak-init"))).length,
      framerAppear: sec.querySelectorAll("[data-framer-appear-id]").length + (sec.hasAttribute("data-framer-appear-id") ? 1 : 0),
      transitions: top(transitions, 6).map(([v, c]) => ({ valeur: v, elements: c })),
      animationsCss: top(animations, 6).map(([v, c]) => ({ valeur: v, elements: c })),
      animationsInfinies: infinies,
      willChange,
      collants,
      fondFixe,
      videos,
      canvas: sec.querySelectorAll("canvas").length,
      iframes: sec.querySelectorAll("iframe").length,
    },
  };
}

// Animations en cours (CSS et Web Animations, dont celles de Framer) et elements qui bougent
// tout seuls (bandeaux defilants pilotes en JavaScript), mesures sur 600 ms sans defiler.
async function mesurerMouvement(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  if (!sec) return null;
  const r0 = sec.getBoundingClientRect();
  window.scrollTo(0, r0.top + window.scrollY - 50);
  await new Promise((r) => setTimeout(r, 400));
  const els = [...sec.querySelectorAll("*")];
  const avant = els.map((el) => { const r = el.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)}|${getComputedStyle(el).transform}`; });
  await new Promise((r) => setTimeout(r, 600));
  let bougent = 0;
  els.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (`${Math.round(r.left)},${Math.round(r.top)}|${getComputedStyle(el).transform}` !== avant[i]) bougent++;
  });
  const anims = document.getAnimations().filter((a) => a.effect && a.effect.target && sec.contains(a.effect.target));
  const infinies = anims.filter((a) => a.effect.getComputedTiming().iterations === Infinity);
  return { animationsEnCours: anims.length, animationsInfiniesEnCours: infinies.length, elementsQuiBougentSansDefiler: bougent };
}

function detecterOutil() {
  const html = document.documentElement.outerHTML;
  if (document.documentElement.hasAttribute("data-wf-page") || document.querySelector("[data-wf-page]")) return "webflow";
  const framerAttr = [...document.querySelectorAll("*")].some((el) => [...el.attributes].some((a) => a.name.startsWith("data-framer-")));
  if (framerAttr || html.includes("framerusercontent.com")) return "framer";
  return "aucun";
}

// ---------- navigation ----------

async function ouvrir(navigateur, url, mobile) {
  const contexte = await navigateur.newContext(
    mobile
      ? { viewport: MOBILE, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: UA_MOBILE, locale: "fr-FR" }
      : { viewport: BUREAU, deviceScaleFactor: 1, locale: "fr-FR" },
  );
  const page = await contexte.newPage();
  await page.addInitScript(`document.addEventListener("DOMContentLoaded", () => (${marquerEtatInitial.toString()})());`);
  let reponse;
  try {
    reponse = await page.goto(url, { waitUntil: "load", timeout: 45000 });
  } catch (e) {
    throw new ErreurSortie(3, `Page inaccessible (${url}) : ${e.message.split("\n")[0]}`);
  }
  if (!reponse) throw new ErreurSortie(3, `Page inaccessible (${url}) : aucune reponse.`);
  if (reponse.status() >= 400) throw new ErreurSortie(3, `Page inaccessible (${url}) : HTTP ${reponse.status()}.`);
  trace(`page chargee (${mobile ? "mobile" : "bureau"})`);
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  trace("reseau calme");
  await page.evaluate(defiler);
  trace("defilement fait");
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  const sections = await page.evaluate(trouverSections);
  trace(`${sections.length} sections`);
  return { contexte, page, sections };
}

// Capture une zone (coordonnees du document). D'abord en une fois (capture native au-dela de
// l'ecran) ; si elle echoue ou bloque (headless leger et effets WebGL), par morceaux de la
// hauteur de l'ecran recolles dans un canvas. Les morceaux raccordent mal les elements qui
// bougent en JavaScript : c'est un repli.
async function capturerZone(navigateur, page, zone, opts) {
  const ecran = page.viewportSize();
  const clip = {
    x: Math.max(0, Math.floor(zone.x)),
    y: Math.max(0, Math.floor(zone.y)),
    width: Math.min(ecran.width - Math.max(0, Math.floor(zone.x)), Math.ceil(zone.width)),
    height: Math.ceil(zone.height),
  };
  try {
    if (opts.largeurSortie) {
      if (opts.masquerFixesApres) {
        await page.evaluate(() => {
          for (const el of document.body.querySelectorAll("*")) {
            if (el.closest("[data-kleak-n], [data-kleak-cadre]")) continue;
            if (getComputedStyle(el).position === "fixed") el.style.setProperty("visibility", "hidden", "important");
          }
        });
      }
      const png = await page.screenshot({ type: "png", fullPage: true, clip, timeout: 30000 });
      return await recoller(navigateur, [{ y: 0, hauteur: clip.height, b64: png.toString("base64") }], clip.width, opts);
    }
    return await page.screenshot({ type: "jpeg", quality: opts.qualite, fullPage: true, clip, timeout: 30000 });
  } catch (e) {
    trace(`capture native impossible (${e.message.split("\n")[0]}), repli par morceaux`);
    return capturerParMorceaux(navigateur, page, zone, opts);
  }
}

async function recoller(navigateur, morceaux, largeur, { largeurSortie, qualite }) {
  const echelle = largeurSortie ? largeurSortie / largeur : 1;
  const total = morceaux.reduce((s, m) => s + m.hauteur, 0);
  const contexte = await navigateur.newContext({ viewport: { width: 800, height: 600 } });
  const atelier = await contexte.newPage();
  const dataUrl = await atelier.evaluate(
    async ({ morceaux, largeur, total, echelle, qualite }) => {
      const c = document.createElement("canvas");
      c.width = Math.round(largeur * echelle);
      c.height = Math.round(total * echelle);
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      for (const m of morceaux) {
        const img = new Image();
        img.src = `data:image/png;base64,${m.b64}`;
        await img.decode();
        g.drawImage(img, 0, Math.round(m.y * echelle), c.width, Math.round(m.hauteur * echelle));
      }
      return c.toDataURL("image/jpeg", qualite / 100);
    },
    { morceaux, largeur, total, echelle, qualite },
  );
  await contexte.close();
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function capturerParMorceaux(navigateur, page, zone, { largeurSortie, qualite, masquerFixesApres = false }) {
  const ecran = page.viewportSize();
  const x = Math.max(0, Math.floor(zone.x));
  const largeur = Math.min(ecran.width - x, Math.ceil(zone.width));
  const morceaux = [];
  let y = Math.floor(zone.y);
  const fin = Math.ceil(zone.y + zone.height);
  while (y < fin) {
    const defile = await page.evaluate(async (cible) => {
      window.scrollTo(0, cible);
      await new Promise((r) => setTimeout(r, 250));
      return window.scrollY;
    }, y);
    const hauteur = Math.min(fin - y, ecran.height - (y - defile));
    if (hauteur <= 0) break;
    const png = await page.screenshot({ type: "png", clip: { x, y: y - defile, width: largeur, height: hauteur }, timeout: 20000 });
    trace(`morceau a y=${y}`);
    morceaux.push({ y: y - Math.floor(zone.y), hauteur, b64: png.toString("base64") });
    y += hauteur;
    if (masquerFixesApres && morceaux.length === 1) await page.evaluate(masquerFixesHors, null);
  }
  return recoller(navigateur, morceaux, largeur, { largeurSortie, qualite });
}

async function lister(navigateur, args) {
  const { contexte, page, sections } = await ouvrir(navigateur, args.url, false);
  if (!sections.length) throw new ErreurSortie(2, "Aucune section de premier niveau trouvee dans la page.");
  await page.evaluate(figerPourCapture);
  await page.evaluate(numeroterSections);
  const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
  const image = await capturerZone(navigateur, page, { x: 0, y: 0, width: BUREAU.width, height: Math.min(hauteur, 30000) }, { largeurSortie: 480, qualite: 70, masquerFixesApres: true });
  await contexte.close();
  const apercu = join(args.sortie, "apercu.jpg");
  writeFileSync(apercu, image);
  process.stdout.write(JSON.stringify({ url: args.url, apercu, sections }, null, 2) + "\n");
}

async function capturerSection(navigateur, args) {
  const n = args.section;
  const bureau = await ouvrir(navigateur, args.url, false);
  const { page } = bureau;
  if (n > bureau.sections.length) {
    throw new ErreurSortie(2, `Section ${n} introuvable : la page en compte ${bureau.sections.length} (voir --lister).`);
  }
  const info = bureau.sections[n - 1];
  if (info.hauteur < 10) throw new ErreurSortie(2, `Section ${n} introuvable : element de ${info.hauteur} px de haut.`);

  const outil = await page.evaluate(detecterOutil);
  const analyseBureau = await page.evaluate(analyserSection, n);
  analyseBureau.animations.mouvement = await page.evaluate(mesurerMouvement, n);
  await page.evaluate(figerPourCapture);
  const fixesMasques = await page.evaluate(masquerFixesHors, n);
  const zone = await page.evaluate((k) => {
    const r = document.querySelector(`[data-kleak-n="${k}"]`).getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
  }, n);

  // JPEG 80, puis 60, puis 60 coupe a 3000 px de haut si la limite de 4 Mo est depassee
  const LIMITE_HAUTEUR = 16000; // limite de securite du canvas
  let qualite = 80;
  let decoupe = zone.height > LIMITE_HAUTEUR;
  const hauteurMax = decoupe ? LIMITE_HAUTEUR : zone.height;
  let image = await capturerZone(navigateur, page, { ...zone, height: hauteurMax }, { qualite });
  if (image.length > CAPTURE_MAX_BYTES) {
    qualite = 60;
    image = await capturerZone(navigateur, page, { ...zone, height: hauteurMax }, { qualite });
  }
  if (image.length > CAPTURE_MAX_BYTES) {
    decoupe = true;
    image = await capturerZone(navigateur, page, { ...zone, height: Math.min(zone.height, 3000) }, { qualite });
  }
  if (image.length > CAPTURE_MAX_BYTES) throw new ErreurSortie(1, `Capture trop lourde meme reduite (${image.length} octets).`);
  const capture = join(args.sortie, "capture.jpg");
  writeFileSync(capture, image);
  await bureau.contexte.close();

  // mobile : page rechargee en 390 x 844
  let analyseMobile = null;
  let avertissementMobile = null;
  try {
    const mobile = await ouvrir(navigateur, args.url, true);
    const infoM = mobile.sections[n - 1];
    if (!infoM) {
      avertissementMobile = `En mobile, la page n'a que ${mobile.sections.length} sections : pas de section ${n}.`;
    } else {
      analyseMobile = await mobile.page.evaluate(analyserSection, n);
      analyseMobile.animations.mouvement = await mobile.page.evaluate(mesurerMouvement, n);
      if (infoM.balise !== info.balise || infoM.id !== info.id || infoM.classes !== info.classes) {
        avertissementMobile = `La section ${n} en mobile ne semble pas la meme qu'en bureau (${infoM.balise}.${infoM.classes} contre ${info.balise}.${info.classes}, titre "${infoM.premierTitre}") : verifier.`;
      }
    }
    await mobile.contexte.close();
  } catch (e) {
    avertissementMobile = `Analyse mobile impossible : ${e.message}`;
  }

  const analyse = {
    url: args.url,
    outil,
    section: info,
    capture: { fichier: capture, octets: image.length, qualite, decoupeA3000px: decoupe, elementsFixesMasques: fixesMasques },
    bureau: analyseBureau,
    mobile: analyseMobile,
    avertissements: avertissementMobile ? [avertissementMobile] : [],
  };
  const chemin = join(args.sortie, "analyse.json");
  writeFileSync(chemin, JSON.stringify(analyse, null, 2));
  process.stdout.write(JSON.stringify({ capture, analyse: chemin, octets: image.length, qualite, decoupe, outil, avertissements: analyse.avertissements }, null, 2) + "\n");
}

async function capturerEcran(navigateur, args) {
  const { contexte, page } = await ouvrir(navigateur, args.url, false);
  const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
  const y = Math.max(0, Math.min(args.ecran, hauteur - BUREAU.height));
  // seuls les elements fixes (bandeau cookies, bouton flottant) sont masques : les elements
  // collants font partie de la zone visible
  await page.evaluate(() => {
    for (const el of document.body.querySelectorAll("*")) {
      if (getComputedStyle(el).position === "fixed") el.style.setProperty("visibility", "hidden", "important");
    }
  });
  const image = await capturerZone(navigateur, page, { x: 0, y, width: BUREAU.width, height: Math.min(BUREAU.height, hauteur) }, { qualite: 80 });
  await contexte.close();
  const capture = join(args.sortie, "capture.jpg");
  writeFileSync(capture, image);
  process.stdout.write(JSON.stringify({ capture, octets: image.length, haut: y, zoneVisible: true }, null, 2) + "\n");
}

// ---------- principal ----------

async function principal() {
  const args = lireArguments(process.argv.slice(2));
  mkdirSync(args.sortie, { recursive: true });
  // Chromium complet (nouveau mode headless) : avec le headless leger par defaut, les effets
  // WebGL (shaders Framer) passent en rendu logiciel et une page prend plusieurs minutes.
  // Repli : headless leger avec WebGL coupe (les canvas restent comptes dans l'analyse).
  let navigateur;
  try {
    navigateur = await chromium.launch({ channel: "chromium" });
  } catch {
    trace("chromium complet indisponible, repli sans WebGL");
    navigateur = await chromium.launch({ args: ["--disable-3d-apis", "--disable-webgl"] });
  }
  try {
    if (args.lister) await lister(navigateur, args);
    else if (args.ecran !== null) await capturerEcran(navigateur, args);
    else await capturerSection(navigateur, args);
  } finally {
    await navigateur.close();
  }
}

principal().catch((e) => {
  const code = e instanceof ErreurSortie ? e.code : 1;
  process.stderr.write(`Erreur : ${e.message}\n`);
  process.exit(code);
});
