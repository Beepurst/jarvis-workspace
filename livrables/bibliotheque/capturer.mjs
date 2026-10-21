#!/usr/bin/env node
// Capture et analyse d'une section de page pour l'agent bibliothecaire.
//
//   node livrables/bibliotheque/capturer.mjs <url> --lister [--sortie <dossier>]
//   node livrables/bibliotheque/capturer.mjs <url> --section <n> [--sortie <dossier>]
//   node livrables/bibliotheque/capturer.mjs <url> --ecran <haut> [--sortie <dossier>]
//   node livrables/bibliotheque/capturer.mjs <url> --titre "<texte>" [--sortie <dossier>]
//
// --lister  : JSON { sections: [{ n, balise, id, classes, premierTitre, haut, hauteur }] } sur la
//             sortie standard, et apercu.jpg (page entiere reduite, sections numerotees).
// --section : capture.jpg (la section seule, JPEG, 4 Mo au plus), analyse.json (bureau et mobile, pour
//             les cas de doute), vignette.jpg (800 px de large, qualite 60, pour verifier) et resume.json
//             (ce que la fiche courte utilise, 4 Ko au plus), et animation.jpg : planche de 6 images de
//             la section filmee dans une page neuve (entree dans l'ecran sur 2,5 s, ou entree puis
//             25 a 100 % du defilement si elle est collante ou liee au defilement). resume.json.animations
//             donne, en plus des compteurs, chaque effet mesure (element, effet, depuis, vers,
//             declencheur, delaiMs, dureeMs, ordre), les cascades, les boucles et 4 survols au plus.
// --titre   : cherche la section dont un titre (h1 a h4) ou un texte de plus de 20 caracteres contient le
//             texte donne (sans casse, sans accents). Sortie { n, premierTitre, autres? }, code 2 si absent.
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
  const args = { url: null, lister: false, section: null, ecran: null, titre: null, sortie: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lister") args.lister = true;
    else if (a === "--section") args.section = Number(argv[++i]);
    else if (a === "--ecran") args.ecran = Number(argv[++i]);
    else if (a === "--titre") args.titre = argv[++i] ?? "";
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
  if ([args.lister, args.section !== null, args.ecran !== null, args.titre !== null].filter(Boolean).length !== 1) {
    throw new ErreurSortie(1, "Choisir un seul mode : --lister, --section <n>, --ecran <haut> ou --titre \"<texte>\".");
  }
  if (args.titre !== null && !args.titre.trim()) throw new ErreurSortie(1, "--titre attend un texte non vide.");
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

  // Enveloppes geantes (Webflow : tout le contenu dans un seul div) : un bloc de plus de 1,5 ecran
  // est remplace par ses <section> (les plus externes) si elles couvrent la moitie de sa hauteur,
  // sinon par ses enfants de plus de 150 px s'il en a au moins 2. Recursif, 4 niveaux. Une <section>
  // n'est eclatee qu'en <section>, et un bloc collant (defilement lie) n'est jamais eclate.
  const SEUIL = window.innerHeight * 1.5;
  const haut = (el) => el.getBoundingClientRect().height;
  const collant = (el) => getComputedStyle(el).position === "sticky";
  const eclater = (el, prof) => {
    if (prof > 4 || haut(el) <= SEUIL || enTete(el) || el.matches("footer")) return [el];
    const secs = [...el.querySelectorAll("section")].filter((s) => visible(s) && haut(s) > 150);
    const externes = secs.filter((s) => !secs.some((o) => o !== s && o.contains(s)));
    let candidats = [];
    if (externes.length >= 2 && externes.reduce((t, s) => t + haut(s), 0) >= haut(el) * 0.5) candidats = externes;
    else if (el.tagName !== "SECTION") {
      let r = el;
      for (let k = enfants(r).filter((c) => !fixe(c)); k.length === 1; k = enfants(r).filter((c) => !fixe(c))) {
        if (collant(r)) return [el];
        r = k[0];
      }
      if (collant(r)) return [el];
      candidats = enfants(r).filter((c) => !fixe(c) && haut(c) > 150);
      if (candidats.some(collant)) return [el];
    }
    if (candidats.length < 2) return [el];
    return candidats.flatMap((c) => eclater(c, prof + 1));
  };
  blocs = blocs.flatMap((b) => eclater(b, 0));

  const texte =(el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
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
      largeurMoyenne: (() => {
        let brut = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (cs.textTransform === "uppercase") brut = brut.toUpperCase();
        else if (cs.textTransform === "lowercase") brut = brut.toLowerCase();
        else if (cs.textTransform === "capitalize") brut = brut.replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase());
        brut = brut.replace(/\s+/g, "");
        if (brut.length < 4) return null;
        const g = (decrireTexte.canvas ||= document.createElement("canvas")).getContext("2d");
        g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        return Math.round((g.measureText(brut.slice(0, 80)).width / Math.min(brut.length, 80) / parseFloat(cs.fontSize)) * 100) / 100;
      })(),
      generique: cs.fontFamily.split(",").pop().replace(/["']/g, "").trim().toLowerCase(),
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
    if (re.height < 80 && re.width < rs.width * 0.9) continue; // petit groupe en ligne (bouton + fleche)
    if (re.width > rs.width + 1) continue;
    if (re.width < rs.width * 0.5) continue; // petits groupes (bouton + fleche) : pas la grille principale
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

// Cherche, parmi les sections numerotees, celles dont un titre (h1 a h4) ou un texte de plus de
// 20 caracteres contient `recherche` (sans casse, sans accents, espaces normalises).
function chercherTitre(recherche) {
  const norm = (t) => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const cible = norm(recherche);
  const trouvees = [];
  for (const sec of document.querySelectorAll("[data-kleak-n]")) {
    const textes = [...sec.querySelectorAll("h1, h2, h3, h4")].map((e) => norm(e.textContent));
    for (const e of [sec, ...sec.querySelectorAll("*")]) {
      const direct = [...e.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join(" ");
      if (norm(direct).length > 20) textes.push(norm(direct));
    }
    if (textes.some((t) => t.includes(cible))) trouvees.push(Number(sec.getAttribute("data-kleak-n")));
  }
  return trouvees;
}

// Premier texte de plus de 20 caracteres de la section (repli quand elle n'a pas de titre).
function premierTexteLong(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  if (!sec) return null;
  for (const e of [sec, ...sec.querySelectorAll("*")]) {
    const t = [...e.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join(" ").replace(/\s+/g, " ").trim();
    if (t.length > 20) return t.slice(0, 80);
  }
  return null;
}

// Ordre des blocs de la section (titre, texte, bouton, image, video...), dans l'ordre de lecture,
// sans doublons consecutifs.
function ordreBlocs(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  if (!sec) return [];
  const rs = sec.getBoundingClientRect();
  const out = [];
  const direct = (el) => [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("").trim();
  for (const el of sec.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (r.width >= rs.width - 1 && r.height >= rs.height - 1) continue;
    const t = el.tagName;
    let type = null;
    if (/^H[1-6]$/.test(t)) type = "titre";
    else if (t === "A" || t === "BUTTON") type = "bouton";
    else if (t === "IMG" || t === "PICTURE") type = "image";
    else if (t === "VIDEO") type = "video";
    else if (t === "CANVAS") type = "canvas";
    else if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") type = "champ";
    else if (direct(el).length > 0 && !el.closest("h1,h2,h3,h4,h5,h6,a,button")) type = "texte";
    if (!type) continue;
    if (el.closest("a, button") && el !== el.closest("a, button") && type !== "image") continue;
    out.push({ type, haut: r.top, gauche: r.left });
  }
  out.sort((a, b) => Math.round(a.haut / 12) - Math.round(b.haut / 12) || a.gauche - b.gauche);
  const suite = [];
  for (const o of out) if (suite[suite.length - 1] !== o.type) suite.push(o.type);
  return suite.slice(0, 14);
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

// ---------- mesure des animations (page neuve, sans defilement prealable) ----------

// Choisit jusqu'a 60 elements de la section a suivre (priorite : ceux qu'un moteur d'animation
// pilote, puis titres, textes, images, boutons, cartes), les marque data-kleak-a et donne leur role.
function preparerAnimation(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  if (!sec) return null;
  const rs = sec.getBoundingClientRect();
  const direct = (el) => [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("").trim();
  const nonNeutre = (cs) => cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.99 || (cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") || (cs.translate && cs.translate !== "none") || (cs.scale && cs.scale !== "none") || /blur/.test(cs.filter);
  const classe = (el) => (typeof el.className === "string" ? el.className.trim() : "");
  const carte = (el) => {
    const c = classe(el);
    if (!c || !el.parentElement) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 80) return false;
    return [...el.parentElement.children].filter((s) => classe(s) === c).length >= 3;
  };
  const cand = [];
  for (const el of sec.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "path", "g", "BR"].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none") continue; // visibility: hidden reste suivi (etat de depart des moteurs)
    const r = el.getBoundingClientRect();
    if (r.width < 12 || r.height < 12) continue;
    const st = el.getAttribute("style") || "";
    let score = 0;
    if (el.hasAttribute("data-w-id") || el.hasAttribute("data-framer-appear-id") || /opacity|transform|translate/.test(st) || nonNeutre(cs)) score = 3;
    else if (/^(H[1-6]|IMG|VIDEO|PICTURE|A|BUTTON|P)$/.test(el.tagName) || carte(el)) score = 2;
    else if (direct(el).length > 0) score = 1;
    if (score) cand.push({ el, score });
  }
  const pris = cand.map((c, i) => ({ ...c, i })).sort((a, b) => b.score - a.score || a.i - b.i).slice(0, 60).sort((a, b) => a.i - b.i);
  const cartes = new Map();
  const familles = new Map();
  for (const { el } of pris) if (carte(el)) {
    const freres = [...el.parentElement.children].filter((s) => classe(s) === classe(el));
    cartes.set(el, `carte ${freres.indexOf(el) + 1}/${freres.length}`);
  }
  const role = (el) => {
    if (cartes.has(el)) return cartes.get(el);
    const t = el.tagName;
    let base = /^H[12]$/.test(t) ? "titre" : /^H[3-6]$/.test(t) ? "sous-titre" : t === "IMG" || t === "PICTURE" ? "image" : t === "VIDEO" ? "video"
      : t === "BUTTON" || (t === "A" && (getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(getComputedStyle(el).borderTopWidth) > 0)) ? "bouton"
      : t === "A" ? "lien" : direct(el).length > 0 ? "texte" : el.querySelector("img, video, picture") && el.children.length <= 2 ? "image"
      : el.querySelector("h1, h2") ? "bloc du titre" : el.querySelector("h3, h4, h5, h6") ? "bloc de sous-titre" : el.querySelector("img, video, picture") ? "bloc image"
      : el.querySelector("a, button") ? "bloc bouton" : "bloc";
    const anc = [...cartes.keys()].find((c) => c !== el && c.contains(el));
    return anc ? `${base} (${cartes.get(anc)})` : base;
  };
  return {
    haut: Math.round(rs.top + window.scrollY),
    hauteur: Math.round(rs.height),
    collant: [sec, ...sec.querySelectorAll("*")].some((e) => getComputedStyle(e).position === "sticky"),
    // elements collants (position: sticky) : seuls ou empiles (memes parents), ce qu'ils contiennent,
    // la hauteur de defilement pendant laquelle ils restent fixes, et le decalage horizontal de leur
    // contenu d'un bloc a l'autre (cartes qui se posent cote a cote)
    colles: (() => {
      const st = [sec, ...sec.querySelectorAll("*")].filter((e) => getComputedStyle(e).position === "sticky" && e.getBoundingClientRect().height > 20);
      const contenu = (e) => [["h1, h2", "titre"], ["h3, h4, h5, h6", "sous-titres"], ["p", "texte"], ["img, picture, video", "image"], ["a, button", "bouton"]].filter(([q]) => e.matches(q) || e.querySelector(q)).map(([, m]) => m).join(", ") || "décor";
      const groupes = new Map();
      for (const e of st) { if (!groupes.has(e.parentElement)) groupes.set(e.parentElement, []); groupes.get(e.parentElement).push(e); }
      return [...groupes.entries()].slice(0, 3).map(([p, g]) => {
        const r = g[0].getBoundingClientRect();
        const course = Math.round(p.getBoundingClientRect().height - r.height);
        const haut = getComputedStyle(g[0]).top;
        if (g.length === 1) return `1 bloc collant (${contenu(g[0])}), ${Math.round(r.height)} px, fixé à top ${haut} pendant ${course} px de défilement`;
        // bord gauche du contenu visible (textes, images) de chaque bloc
        const gauche = g.map((e) => {
          const l = [...e.querySelectorAll("img, picture, video, h1, h2, h3, h4, h5, h6, p")].map((x) => x.getBoundingClientRect()).filter((b) => b.width > 0).map((b) => b.left);
          return l.length ? Math.min(...l) : null;
        });
        const dx = gauche.every((v) => v !== null) ? gauche.slice(1).map((v, i) => Math.round(v - gauche[i])) : [];
        const decale = dx.length && dx.every((d) => Math.abs(d) > 20) ? `, contenu décalé de ${dx[0]} px à chaque bloc (se posent côte à côte)` : "";
        return `${g.length} blocs collants empilés (${contenu(g[0])}), ${Math.round(r.height)} px chacun, fixés à top ${haut} : chacun monte puis se fige au même niveau${decale}, parent de ${Math.round(p.getBoundingClientRect().height)} px`;
      });
    })(),
    elements: pris.map(({ el }, k) => {
      el.setAttribute("data-kleak-a", String(k));
      el.setAttribute("data-kleak-role", role(el));
      return {
        k,
        role: el.getAttribute("data-kleak-role"),
        famille: (() => {
          const c = [...cartes.keys()].find((x) => x.contains(el));
          const p = (c || el).parentElement;
          if (!familles.has(p)) familles.set(p, familles.size);
          return familles.get(p);
        })(),
        init: el.getAttribute("data-kleak-init") || null,
        moteur: el.hasAttribute("data-w-id") ? "webflow" : el.hasAttribute("data-framer-appear-id") ? "framer-appear" : null,
        parent: (() => {
          const ancs = pris.filter((p) => p.el !== el && p.el.contains(el));
          const proche = ancs.find((a) => ancs.every((b) => b === a || b.el.contains(a.el)));
          return proche ? pris.indexOf(proche) : -1;
        })(),
      };
    }),
  };
}

// Etat des elements suivis : [opacite, translateX, translateY, echelle, rotation, flou] (proprietes
// de l'element lui-meme), plus la position dans la section et l'animation en cours (duree, delai).
function etatsAnimation(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  const rs = sec.getBoundingClientRect();
  return [...document.querySelectorAll("[data-kleak-a]")].map((el) => {
    const cs = getComputedStyle(el);
    let tx = 0, ty = 0, sc = 1, rot = 0;
    if (cs.transform && cs.transform !== "none") {
      const m = new DOMMatrixReadOnly(cs.transform);
      tx = m.m41; ty = m.m42; sc = Math.hypot(m.a, m.b); rot = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    }
    if (cs.translate && cs.translate !== "none") { const p = cs.translate.split(" ").map(parseFloat); tx += p[0] || 0; ty += p[1] || 0; }
    if (cs.scale && cs.scale !== "none") sc *= parseFloat(cs.scale) || 1;
    if (cs.rotate && cs.rotate !== "none") rot += parseFloat(cs.rotate) || 0;
    const flou = parseFloat((cs.filter.match(/blur\(([\d.]+)px\)/) || [])[1] || 0);
    const r = el.getBoundingClientRect();
    const a = el.getAnimations ? el.getAnimations().map((x) => x.effect?.getTiming?.()).filter(Boolean) : [];
    const d = a.length ? Math.max(...a.map((t) => (typeof t.duration === "number" ? t.duration : 0))) : 0;
    const inf = a.some((t) => t.iterations === Infinity);
    const tr = cs.transitionProperty !== "none" ? Math.max(...cs.transitionDuration.split(",").map((x) => parseFloat(x) * 1000)) : 0;
    // visibility: hidden compte comme opacite 0 seulement sur la racine du sous-arbre cache (pas sur
    // les enfants qui en heritent)
    const cache = cs.visibility === "hidden" && (!el.parentElement || getComputedStyle(el.parentElement).visibility !== "hidden");
    return [cache ? 0 : +parseFloat(cs.opacity).toFixed(2), Math.round(tx), Math.round(ty), +sc.toFixed(3), Math.round(rot), Math.round(flou), Math.round(r.left - rs.left), Math.round(r.top - rs.top), Math.round(d), inf ? 1 : 0, Math.round(tr || 0)];
  });
}

// Lance un echantillonnage en tache de fond (toutes les 50 ms), lu par lireEchantillons.
// Les temps sont relatifs a window.__kleakT0, pose par marquerT0 a l'arrivee du defilement.
function demarrerEchantillons(n) {
  window.__kleakE = [];
  window.__kleakT0 = performance.now();
  const f = new Function("n", `return (${window.__kleakEtats})(n)`);
  window.__kleakI = setInterval(() => window.__kleakE.push([performance.now(), f(n)]), 50);
}
function marquerT0() {
  window.__kleakT0 = performance.now();
}
function lireEchantillons() {
  clearInterval(window.__kleakI);
  return window.__kleakE.map(([t, e]) => [Math.round(t - window.__kleakT0), e]);
}

// Survol : etat visuel d'un element et de 12 descendants au plus (proprietes que les survols changent).
function etatSurvol(k) {
  const el = document.querySelector(`[data-kleak-s="${k}"]`);
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); return a < 0.05 ? null : Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b); };
  return [el, ...[...el.querySelectorAll("*")].slice(0, 12)].map((e) => {
    const cs = getComputedStyle(e);
    let tx = 0, ty = 0, sc = 1, rot = 0;
    if (cs.transform && cs.transform !== "none") { const m = new DOMMatrixReadOnly(cs.transform); tx = m.m41; ty = m.m42; sc = Math.hypot(m.a, m.b); rot = (Math.atan2(m.b, m.a) * 180) / Math.PI; }
    return {
      tag: e.tagName, role: e.getAttribute("data-kleak-role"), op: +parseFloat(cs.opacity).toFixed(2), tx: Math.round(tx), ty: Math.round(ty), sc: +sc.toFixed(3), rot: Math.round(rot),
      fond: lum(cs.backgroundColor), texte: lum(cs.color), bord: parseFloat(cs.borderTopWidth) > 0 ? lum(cs.borderTopColor) : null,
      ombre: cs.boxShadow !== "none", flou: /blur/.test(cs.filter), duree: Math.round(Math.max(...cs.transitionDuration.split(",").map((x) => parseFloat(x) * 1000)) || 0),
      img: e.tagName === "IMG" || e.tagName === "PICTURE",
    };
  });
}

// Elements interactifs de la section a survoler : boutons, cartes, liens avec transition (4 au plus).
function choisirSurvols(n) {
  const sec = document.querySelector(`[data-kleak-n="${n}"]`);
  const trans = (e) => [e, ...e.querySelectorAll("*")].slice(0, 20).some((x) => { const cs = getComputedStyle(x); return cs.transitionProperty !== "none" && cs.transitionDuration.split(",").some((d) => parseFloat(d) > 0); });
  const ok = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width >= 20 && r.height >= 16 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const cartes = [...sec.querySelectorAll("[data-kleak-a]")].filter((e) => /^carte/.test(e.getAttribute("data-kleak-role") || ""));
  const liens = [...sec.querySelectorAll("a, button, [role=button]")];
  const pris = [];
  const ajouter = (e) => { if (pris.length < 4 && e && ok(e) && !pris.some((p) => p.contains(e) || e.contains(p))) pris.push(e); };
  ajouter(cartes.find(trans));
  ajouter(liens.find((e) => trans(e) && e.querySelector("img")));
  for (const e of liens.filter(trans)) ajouter(e);
  ajouter(cartes.find(ok));
  return pris.map((e, k) => { e.setAttribute("data-kleak-s", String(k)); return k; });
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

async function recoller(navigateur, morceaux, largeur, { largeurSortie, qualite, hauteurMaxSortie }) {
  const echelle = largeurSortie ? largeurSortie / largeur : 1;
  const total = morceaux.reduce((s, m) => s + m.hauteur, 0);
  const contexte = await navigateur.newContext({ viewport: { width: 800, height: 600 } });
  const atelier = await contexte.newPage();
  const dataUrl = await atelier.evaluate(
    async ({ morceaux, largeur, total, echelle, qualite, hauteurMaxSortie }) => {
      const c = document.createElement("canvas");
      c.width = Math.round(largeur * echelle);
      c.height = Math.min(Math.round(total * echelle), hauteurMaxSortie || Infinity);
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
    { morceaux, largeur, total, echelle, qualite, hauteurMaxSortie },
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

// ---------- animations : film et lecture des mesures ----------

const pause = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

// Planche contact : images cote a cote, 3 par rangee, 520 px chacune (1560 px au plus), legende
// en haut de chaque image, JPEG qualite 60.
async function faireplanche(navigateur, images) {
  const contexte = await navigateur.newContext({ viewport: { width: 800, height: 600 } });
  const atelier = await contexte.newPage();
  const dataUrl = await atelier.evaluate(async ({ images, ratio }) => {
    const L = 520, H = Math.round(L * ratio), B = 26, col = Math.min(3, images.length);
    const c = document.createElement("canvas");
    c.width = col * L + (col - 1) * 6;
    c.height = Math.ceil(images.length / col) * (H + B + 6) - 6;
    const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    g.imageSmoothingQuality = "high";
    for (const [i, im] of images.entries()) {
      const x = (i % col) * (L + 6), y = Math.floor(i / col) * (H + B + 6);
      const img = new Image();
      img.src = `data:image/jpeg;base64,${im.b64}`;
      await img.decode();
      g.fillStyle = "#111"; g.fillRect(x, y, L, B);
      g.fillStyle = "#fff"; g.font = "bold 16px Arial, sans-serif"; g.fillText(`${i + 1}. ${im.legende}`, x + 8, y + 18);
      g.drawImage(img, x, y + B, L, H);
    }
    return c.toDataURL("image/jpeg", 0.6);
  }, { images, ratio: BUREAU.height / BUREAU.width });
  await contexte.close();
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

const TOL = [0.05, 4, 4, 0.02, 2, 1]; // opacite, translateX, translateY, echelle, rotation, flou
const differe = (a, b) => a.slice(0, 6).some((v, i) => Math.abs(v - b[i]) > TOL[i]);
const TOL_FIN = [0.01, 1, 1, 0.005, 0.5, 0.5]; // fin de mouvement : on suit la queue de la courbe
const differeFin = (a, b) => a.slice(0, 6).some((v, i) => Math.abs(v - b[i]) > TOL_FIN[i]);
const NEUTRE = [1, 0, 0, 1, 0, 0];

function decrireEtat(e, autre) {
  const p = [];
  if (Math.abs(e[0] - autre[0]) > TOL[0]) p.push(`opacity ${e[0]}`);
  if (Math.abs(e[1] - autre[1]) > TOL[1]) p.push(`translateX ${e[1]}px`);
  if (Math.abs(e[2] - autre[2]) > TOL[2]) p.push(`translateY ${e[2]}px`);
  if (Math.abs(e[3] - autre[3]) > TOL[3]) p.push(`scale ${+e[3].toFixed(2)}`);
  if (Math.abs(e[4] - autre[4]) > TOL[4]) p.push(`rotate ${e[4]}deg`);
  if (Math.abs(e[5] - autre[5]) > TOL[5]) p.push(`blur ${e[5]}px`);
  return p.join(", ").replace(/ 0px/g, " 0").replace(/ 0deg/g, " 0");
}
function natureEffet(a, b) {
  const k = [];
  if (Math.abs(a[0] - b[0]) > TOL[0]) k.push("fondu");
  if (Math.abs(a[1] - b[1]) > TOL[1] || Math.abs(a[2] - b[2]) > TOL[2]) k.push("glissement");
  if (Math.abs(a[3] - b[3]) > TOL[3]) k.push("zoom");
  if (Math.abs(a[4] - b[4]) > TOL[4]) k.push("rotation");
  if (Math.abs(a[5] - b[5]) > TOL[5]) k.push("flou");
  return k.length === 1 ? k[0] : `combinaison (${k.join(" + ")})`;
}
const arrondi50 = (v) => Math.round(v / 50) * 50;
const mediane = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const baseRole = (r) => r.replace(/ \d+\/\d+/, "").replace(/ \(carte\)/, " de carte");
const pluriel = (n, base) => (/\s/.test(base) ? `${n} × ${base}` : `${n} ${base}s`);

// Lit les echantillons : entrees (fondus, glissements...), defilement lie, boucles.
function lireAnimations({ prep, avant, phases, auChargement }) {
  const entrees = [];
  const boucles = [];
  const lies = [];
  const el = prep.elements;
  const enBoucle = new Set();
  // boucles : position qui avance sans s'arreter pendant l'entree (bandeau defilant), ou animation infinie
  const e0 = phases[0].echantillons.filter(([t]) => t >= 0);
  for (const x of el) {
    const serie = e0.map(([t, s]) => [t, s[x.k]]).filter(([, s]) => s);
    if (serie.length < 10) continue;
    const [t1, s1] = serie[0], [tm, sm] = serie[Math.floor(serie.length / 2)], [t2, s2] = serie[serie.length - 1];
    const dx1 = sm[6] - s1[6], dx2 = s2[6] - sm[6], dy1 = sm[7] - s1[7], dy2 = s2[7] - sm[7], dr = s2[4] - s1[4];
    const horiz = Math.abs(dx1) > 4 && Math.abs(dx2) > 4 && Math.sign(dx1) === Math.sign(dx2);
    const vert = Math.abs(dy1) > 4 && Math.abs(dy2) > 4 && Math.sign(dy1) === Math.sign(dy2) && !horiz;
    const tourne = Math.abs(dr) > 10 && Math.abs(sm[4] - s1[4]) > 4;
    const infinie = serie.some(([, s]) => s[9]);
    if (!horiz && !vert && !tourne && !infinie) continue;
    enBoucle.add(x.k);
    if (x.parent >= 0 && enBoucle.has(x.parent)) continue;
    const duree = (t2 - t1) / 1000 || 1;
    boucles.push(horiz || vert
      ? { element: x.role, direction: horiz ? (dx2 < 0 ? "vers la gauche" : "vers la droite") : dy2 < 0 ? "vers le haut" : "vers le bas", vitessePxS: Math.round(Math.abs(horiz ? s2[6] - s1[6] : s2[7] - s1[7]) / duree) }
      : tourne ? { element: x.role, direction: "rotation continue", vitesseDegS: Math.round(Math.abs(dr) / duree) }
      : { element: x.role, direction: "animation CSS infinie", dureeMs: s2[8] || null });
  }
  for (const x of el) {
    if (enBoucle.has(x.k)) continue;
    const debut = avant[x.k].slice();
    if (auChargement && x.init && /opacite0/.test(x.init) && debut[0] > 0.05) debut[0] = 0;
    // etat pose a la fin de chaque phase, et mouvement a l'interieur de chaque phase
    const poses = phases.map((ph) => ph.echantillons.length ? ph.echantillons[ph.echantillons.length - 1][1][x.k] : null);
    if (poses.some((p) => !p)) continue;
    const changementsApresEntree = poses.slice(1).filter((p, i) => differe(p, poses[i])).length;
    if (changementsApresEntree >= 2) {
      lies.push({ x, depuis: poses[0], vers: poses[poses.length - 1] });
      continue;
    }
    // premiere phase ou l'element change : celle de son declenchement
    let i = 0, ref = debut;
    for (; i < phases.length; i++) {
      const ech = phases[i].echantillons;
      if (ech.some(([, s]) => differe(s[x.k], ref))) break;
      ref = poses[i];
    }
    if (i === phases.length) continue;
    const ech = phases[i].echantillons;
    const fin = poses[i];
    if (!differe(ref, fin) && !ech.some(([, s]) => differe(s[x.k], fin))) continue;
    const tDebutBrut = (ech.find(([, s]) => differe(s[x.k], ref)) || [0])[0]; // < 0 : commence pendant le defilement
    const tDebut = Math.max(0, tDebutBrut);
    const enMouvement = ech.filter(([, s]) => differeFin(s[x.k], fin));
    const tFin = enMouvement.length ? enMouvement[enMouvement.length - 1][0] + 50 : tDebut;
    const encore = enMouvement.length && enMouvement[enMouvement.length - 1][0] >= ech[ech.length - 1][0] - 60;
    // etat de depart : pour chaque propriete, la valeur la plus eloignee de l'etat final (un moteur
    // peut poser son etat initial apres notre premiere mesure, au chargement surtout)
    const depart = ref.slice();
    for (const [t, s] of ech) {
      if (t > tFin) break;
      for (let p = 0; p < 6; p++) if (Math.abs(s[x.k][p] - fin[p]) > Math.abs(depart[p] - fin[p])) depart[p] = s[x.k][p];
    }
    const waapi = Math.max(0, ...ech.map(([, s]) => s[x.k][8]));
    const css = Math.max(0, ...ech.map(([, s]) => s[x.k][10]));
    const dureeMs = waapi > 0 && waapi < 10000 ? Math.round(waapi) : css > 0 && css < 5000 ? Math.round(css) : arrondi50(Math.max(50, tFin - tDebutBrut));
    entrees.push({
      x, effet: natureEffet(depart, fin), depuis: decrireEtat(depart, fin), vers: decrireEtat(fin, depart),
      declencheur: auChargement && i === 0 ? "chargement" : i === 0 ? "entrée dans l'écran" : `entrée dans l'écran (plus bas, ${phases[i].legende})`,
      delaiMs: arrondi50(tDebut), dureeMs, encoreEnCours: !!encore, source: waapi > 0 ? "animation mesurée" : css > 0 ? "transition CSS" : "estimée sur les images",
    });
  }
  for (const l of lies) {
    entrees.push({ x: l.x, effet: natureEffet(l.depuis, l.vers), depuis: decrireEtat(l.depuis, l.vers), vers: decrireEtat(l.vers, l.depuis), declencheur: "défilement lié", delaiMs: null, dureeMs: null, lie: true });
  }

  // regroupement : meme role, meme effet, meme famille (freres) : une ligne, avec le decalage
  const groupes = new Map();
  for (const e of entrees) {
    const cle = [baseRole(e.x.role), e.effet, e.depuis, e.vers, e.declencheur.split(" (")[0], e.x.famille].join("|");
    if (!groupes.has(cle)) groupes.set(cle, []);
    groupes.get(cle).push(e);
  }
  const lignes = [...groupes.values()].map((g) => {
    g.sort((a, b) => (a.delaiMs ?? 0) - (b.delaiMs ?? 0) || a.x.k - b.x.k);
    const delais = g.map((e) => e.delaiMs ?? 0);
    const ecarts = delais.slice(1).map((d, i) => d - delais[i]);
    const decalage = g.length > 1 ? arrondi50(mediane(ecarts)) : 0;
    const e = g[0];
    const o = {
      element: g.length > 1 ? pluriel(g.length, baseRole(e.x.role)) : e.x.role,
      effet: e.effet, depuis: e.depuis, vers: e.vers, declencheur: e.declencheur,
    };
    if (!e.lie) { o.delaiMs = e.delaiMs; o.dureeMs = mediane(g.map((x) => x.dureeMs)); }
    if (decalage >= 40) o.decalageMs = decalage;
    if (e.encoreEnCours) o.encoreEnCours = true;
    if (e.x.moteur) o.moteur = e.x.moteur;
    return { o, k: e.x.k, n: g.length, base: baseRole(e.x.role), decalage, delai: e.delaiMs ?? 99999 };
  });
  lignes.sort((a, b) => a.delai - b.delai || a.k - b.k);
  lignes.forEach((l, i) => (l.o.ordre = i + 1));
  const cascades = lignes.filter((l) => l.n >= 2 && l.decalage >= 40).map((l) => `${pluriel(l.n, l.base)}, décalage ${l.decalage} ms`);
  // detail pour analyse.json : etat avant et pose a la fin de chaque phase, par element
  const detail = el.map((x) => ({ role: x.role, avant: avant[x.k].slice(0, 8).join(" "), poses: phases.map((ph) => (ph.echantillons.at(-1)?.[1][x.k] || []).slice(0, 8).join(" ")) }));
  return { entrees: lignes.map((l) => l.o), cascades, boucles, detail };
}

function lireSurvol(role, avant, apres) {
  const depuis = [];
  const vers = [];
  const kinds = new Set();
  let duree = 0;
  for (let i = 0; i < Math.min(avant.length, apres.length); i++) {
    const a = avant[i], b = apres[i];
    const qui = i === 0 ? "" : `${a.img ? "image" : a.role || a.tag.toLowerCase()} interne `;
    const d = [], v = [];
    const paire = (x, y, kind) => { d.push(x); v.push(y); kinds.add(kind); };
    if (Math.abs(a.sc - b.sc) > 0.01) paire(`scale ${a.sc}`, `scale ${b.sc}`, "zoom");
    if (Math.abs(a.tx - b.tx) > 2) paire(`translateX ${a.tx}px`, `translateX ${b.tx}px`, "glissement");
    if (Math.abs(a.ty - b.ty) > 2) paire(`translateY ${a.ty}px`, `translateY ${b.ty}px`, "glissement");
    if (Math.abs(a.rot - b.rot) > 2) paire(`rotate ${a.rot}deg`, `rotate ${b.rot}deg`, "rotation");
    if (Math.abs(a.op - b.op) > 0.05) paire(`opacity ${a.op}`, `opacity ${b.op}`, "fondu");
    const lum = (x, y, nom) => {
      if (x === y) return;
      if (x === null || y === null) return paire(x === null ? `sans ${nom}` : `${nom} d'origine`, y === null ? `${nom} transparent` : `${nom} qui apparaît`, "couleur");
      if (Math.abs(x - y) > 8) paire(`${nom} d'origine`, `${nom} plus ${y > x ? "clair" : "sombre"}`, "couleur");
    };
    lum(a.fond, b.fond, "fond"); lum(a.texte, b.texte, "texte"); lum(a.bord, b.bord, "bordure");
    if (a.ombre !== b.ombre) paire(a.ombre ? "avec ombre" : "sans ombre", b.ombre ? "avec ombre" : "sans ombre", "ombre");
    if (a.flou !== b.flou) paire(a.flou ? "flou" : "net", b.flou ? "flou" : "net", "flou");
    if (d.length) { depuis.push(qui + d.join(", ")); vers.push(qui + v.join(", ")); duree = Math.max(duree, b.duree || a.duree); }
  }
  if (!depuis.length) return null;
  const k = [...kinds];
  return { element: role, effet: k.length === 1 ? k[0] : `combinaison (${k.join(" + ")})`, depuis: depuis.slice(0, 3).join(" ; ").slice(0, 110), vers: vers.slice(0, 3).join(" ; ").slice(0, 110), declencheur: "survol", dureeMs: duree || null };
}

// Filme la section dans une page neuve (rien n'a encore ete joue) : etat avant, arrivee par le bas
// de l'ecran, 6 images sur 2,5 s (ou entree puis 25 a 100 % du defilement si la section est
// collante), puis survols. Ecrit animation.jpg et rend { animations, detail }.
async function mesurerAnimations(navigateur, url, info, n, sortie) {
  const vh = BUREAU.height;
  const auChargement = info.haut < vh * 0.85;
  const contexte = await navigateur.newContext({ viewport: BUREAU, deviceScaleFactor: 1, locale: "fr-FR", bypassCSP: true });
  try {
    const page = await contexte.newPage();
    await page.addInitScript(`document.addEventListener("DOMContentLoaded", () => (${marquerEtatInitial.toString()})());`);
    await page.goto(url, { waitUntil: auChargement ? "domcontentloaded" : "load", timeout: 45000 });
    if (!auChargement) await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    const sections = await page.evaluate(trouverSections);
    let m = sections[n - 1] && sections[n - 1].premierTitre === info.premierTitre ? n : null;
    if (!m && info.premierTitre) m = (await page.evaluate(chercherTitre, info.premierTitre.slice(0, 40)))[0] ?? null;
    if (!m) {
      const proche = sections.slice().sort((a, b) => Math.abs(a.haut - info.haut) - Math.abs(b.haut - info.haut))[0];
      if (proche && Math.abs(proche.haut - info.haut) < 300) m = proche.n;
    }
    if (!m) return { animations: { nonMesure: "section introuvable dans une page neuve" } };
    const prep = await page.evaluate(preparerAnimation, m);
    await page.evaluate(masquerFixesHors, m);
    await page.evaluate((s) => { window.__kleakEtats = s; }, etatsAnimation.toString());
    const avant = await page.evaluate(etatsAnimation, m);
    trace(`animation : ${prep.elements.length} elements suivis, collant ${prep.collant}`);

    const defilerVers = async (y) => {
      const depart = await page.evaluate(() => window.scrollY);
      for (let i = 1; i <= 6; i++) { await page.evaluate((v) => window.scrollTo(0, v), depart + ((y - depart) * i) / 6); await pause(50); }
    };
    const filmer = async (legendes) => {
      const debut = Date.now();
      const images = [];
      for (const [o, legende] of legendes) {
        await pause(o - (Date.now() - debut));
        images.push({ legende, b64: (await page.screenshot({ type: "jpeg", quality: 70, timeout: 10000 })).toString("base64") });
      }
      return images;
    };

    const tall = prep.hauteur > vh * 1.2;
    const lieAuDefilement = prep.collant && tall;
    const legendesEntree = [[0, "0 ms"], [250, "250 ms"], [600, "600 ms"], [1000, "1 s"], [1600, "1,6 s"], [2500, "2,5 s"]];
    const phases = [];
    const images = [];
    // entree
    await page.evaluate(demarrerEchantillons, m);
    // saut direct (pas de defilement progressif) : tout ce qui est dans l'ecran se declenche au meme
    // moment, un decalage mesure est donc un vrai decalage (cascade) et pas l'effet du defilement
    if (!auChargement) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, prep.haut - vh));
      await pause(80);
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, prep.haut - vh * 0.1));
    }
    await page.evaluate(marquerT0);
    images.push(...(await filmer(legendesEntree)));
    await pause(2600 - 2500);
    phases.push({ legende: "entrée", echantillons: await page.evaluate(lireEchantillons) });
    // traversee de la section (25, 50, 75, 100 %) : elements plus bas, defilement lie
    const entreeY = Math.max(0, prep.haut - vh * 0.1);
    const imagesTraversee = [];
    for (const p of [25, 50, 75, 100]) {
      await page.evaluate(demarrerEchantillons, m);
      await defilerVers(tall ? Math.max(entreeY, prep.haut + (p / 100) * (prep.hauteur - vh)) : entreeY + (p / 100) * Math.min(prep.hauteur, vh) * 0.5);
      await page.evaluate(marquerT0);
      await pause(1200);
      imagesTraversee.push(...(await filmer([[0, `${p} % de la section`]])));
      phases.push({ legende: `${p} %`, echantillons: await page.evaluate(lireEchantillons) });
    }
    const lu = lireAnimations({ prep, avant, phases, auChargement });
    if (process.env.KLEAK_DEBUG) writeFileSync(join(sortie, "echantillons.json"), JSON.stringify({ prep, avant, phases }));
    const filmeEnDefilement = lieAuDefilement || lu.entrees.some((e) => e.declencheur === "défilement lié");
    if (filmeEnDefilement) images.splice(0, images.length, images[0], images[images.length - 1], ...imagesTraversee);

    // survols
    const survols = [];
    const ks = await page.evaluate(choisirSurvols, m);
    for (const k of ks) {
      try {
        const boite = await page.evaluate(async (k) => {
          const e = document.querySelector(`[data-kleak-s="${k}"]`);
          e.scrollIntoView({ block: "center" });
          await new Promise((r) => setTimeout(r, 500));
          const r = e.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2, role: e.getAttribute("data-kleak-role") || (e.tagName === "A" ? "lien" : "bouton") };
        }, k);
        const a = await page.evaluate(etatSurvol, k);
        await page.mouse.move(boite.x, boite.y, { steps: 4 });
        await pause(700);
        const b = await page.evaluate(etatSurvol, k);
        await page.mouse.move(2, 2);
        await pause(300);
        const s = lireSurvol(boite.role, a, b);
        if (s) survols.push(s);
      } catch (e) {
        trace(`survol ${k} impossible : ${e.message.split("\n")[0]}`);
      }
    }

    const planche = join(sortie, "animation.jpg");
    writeFileSync(planche, await faireplanche(navigateur, images));
    const animations = {
      planche: `animation.jpg (${images.map((i) => i.legende).join(", ")})`,
      declencheur: auChargement ? "chargement" : lieAuDefilement ? "entrée puis défilement lié (section collante)" : filmeEnDefilement ? "entrée puis défilement lié" : "entrée dans l'écran",
      suivis: prep.elements.length,
      colles: prep.colles,
      entrees: lu.entrees,
      cascades: lu.cascades,
      boucles: lu.boucles,
      survols,
    };
    if (!lu.entrees.length && !lu.boucles.length) animations.aucuneEntree = true;
    return { animations, fichier: planche, detail: lu.detail };
  } finally {
    await contexte.close();
  }
}

// ---------- vignette et resume (pour limiter ce que l'agent doit lire) ----------

// Largeur et hauteur d'un JPEG (lecture de l'en-tete SOF).
function dimensionsJpeg(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { hauteur: buf.readUInt16BE(i + 5), largeur: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error("dimensions JPEG illisibles");
}

async function faireVignette(navigateur, jpeg) {
  const { largeur, hauteur } = dimensionsJpeg(jpeg);
  return recoller(navigateur, [{ y: 0, hauteur, b64: jpeg.toString("base64") }], largeur, { largeurSortie: Math.min(800, largeur), qualite: 60, hauteurMaxSortie: 2400 });
}

// Categorie de police sans jamais donner le nom exact.
// largeurMoyenne : chasse moyenne d'un caractere / taille de police, mesuree dans la page.
const SEUIL_CONDENSEE = 0.5;
function categoriePolice(famille, generique, largeurMoyenne) {
  const f = (famille || "").toLowerCase();
  if (typeof largeurMoyenne === "number" && largeurMoyenne < SEUIL_CONDENSEE) return "condensee";
  if (/mono|courier|consolas|code/.test(f) || generique === "monospace") return "mono";
  if (/\bsans\b|grotesk|grotesque|gothic|helvetica|arial|inter\b|roboto|poppins|montserrat/.test(f)) return "sans-serif";
  if (/serif|georgia|times|garamond|playfair|merriweather|lora\b|baskerville|didot|bodoni|cormorant|fraunces|caslon|newsreader|crimson|cambria|palatino|libre/.test(f) || generique === "serif") return "serif";
  return "sans-serif";
}

const compacter = (v) => {
  if (Array.isArray(v)) { const a = v.map(compacter).filter((x) => x !== undefined); return a.length ? a : undefined; }
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) { const c = compacter(x); if (c !== undefined) o[k] = c; }
    return Object.keys(o).length ? o : undefined;
  }
  if (v === 0 || v === false || v === null || v === "" || v === undefined) return undefined;
  return typeof v === "string" ? v.slice(0, 70) : v;
};

// Animations du resume : compteurs de la page au repos, puis la mesure filmee, coupee pour que
// resume.json reste sous 4 Ko (entrees les plus tardives retirees d'abord).
function animationsResume(compteurs, mesure, budget) {
  const a = { ...(compacter(compteurs) || {}), ...(mesure || {}) };
  for (const cle of ["entrees", "survols", "boucles", "cascades", "colles"]) if (Array.isArray(a[cle]) && !a[cle].length) delete a[cle];
  if (a.entrees) a.entrees = a.entrees.slice(0, 10);
  if (a.boucles) a.boucles = a.boucles.slice(0, 3);
  if (a.cascades) a.cascades = a.cascades.slice(0, 4);
  while (JSON.stringify(a).length > budget) {
    if (a.entrees?.length > 3) { a.entrees.pop(); a.entreesCoupees = (a.entreesCoupees || 0) + 1; }
    else if (a.survols?.length > 1) a.survols.pop();
    else if (a.transitions?.length > 2) a.transitions.pop();
    else if (a.animationsCss?.length > 2) a.animationsCss.pop();
    else break;
  }
  return a;
}

function construireResume({ info, bureau, mobile, blocsBureau, blocsMobile, avertissements, mesure }) {
  const base = bureau.texteCourant?.taille || 16;
  const rel = (t) => Math.round((t / base) * 10) / 10;
  const parBalise = {};
  for (const t of bureau.titres) parBalise[t.balise] = Math.max(parBalise[t.balise] || 0, t.taille);
  const tailles = {};
  for (const [b, t] of Object.entries(parBalise)) tailles[b] = rel(t);
  const plusGrand = bureau.textesLesPlusGrands[0];
  const titrePrincipal = bureau.titres[0] || plusGrand;
  const capitales = [...bureau.titres, ...bureau.textesLesPlusGrands].some((t) => t.casse === "uppercase");
  const g = bureau.grillePrincipale;
  const gm = mobile && mobile !== "introuvable" ? mobile.grillePrincipale : null;
  const colB = g ? g.colonnes : 1;
  const colM = mobile && mobile !== "introuvable" ? (gm ? gm.colonnes : 1) : null;
  const nb = (a, k) => a?.elementsVisibles?.[k] ?? 0;
  const disparait = {};
  if (mobile && mobile !== "introuvable") {
    for (const [k, cle] of [["textes", "textes"], ["images", "images"], ["boutonsOuLiens", "boutons"]]) {
      const d = nb(bureau, k) - nb(mobile, k);
      if (d > 0) disparait[cle] = d;
    }
  }
  const resume = {
    section: { n: info.n, balise: info.balise, premierTitre: info.premierTitre ? info.premierTitre.slice(0, 70) : null },
    structure: { colonnes: colB, blocs: blocsBureau },
    hierarchie: {
      tailleDeBase: base,
      tailles,
      plusGrandTexte: plusGrand ? rel(plusGrand.taille) : null,
      capitales,
      policeTitres: titrePrincipal ? categoriePolice(titrePrincipal.famille, titrePrincipal.generique, titrePrincipal.largeurMoyenne) : null,
      policeTexte: bureau.texteCourant ? categoriePolice(bureau.texteCourant.famille, null) : null,
    },
    grille: {
      largeurUtile: bureau.contenu?.largeur ?? null,
      colonnes: colB,
      largeursColonnes: g?.largeursColonnes ?? null,
      ecart: g?.ecart && g.ecart !== "normal" ? g.ecart : null,
      marges: bureau.contenu?.margesInternes ?? null,
    },
    mobile: mobile === "introuvable"
      ? { introuvable: true, hauteurBureau: bureau.section.hauteur }
      : mobile
      ? {
          colonnes: colM,
          passeEnColonne: colB > 1 && colM <= 1,
          disparait,
          blocs: JSON.stringify(blocsMobile) === JSON.stringify(blocsBureau) ? "idem" : blocsMobile,
          hauteurBureau: bureau.section.hauteur,
          hauteurMobile: mobile.section.hauteur,
        }
      : { hauteurBureau: bureau.section.hauteur, hauteurMobile: null },
    animations: {},
    performance: {
      images: bureau.images.nombre,
      plusLargeSource: bureau.images.plusLargeSource,
      graisses: new Set(bureau.polices.map((p) => p.graisse)).size,
    },
  };
  if (avertissements.length) resume.avertissements = avertissements.map((a) => a.slice(0, 160));
  resume.animations = animationsResume(bureau.animations, mesure, 4000 - JSON.stringify(resume).length - 50);
  return resume;
}

async function chercher(navigateur, args) {
  const { contexte, page, sections } = await ouvrir(navigateur, args.url, false);
  const trouvees = await page.evaluate(chercherTitre, args.titre);
  await contexte.close();
  if (!trouvees.length) {
    throw new ErreurSortie(2, `Aucune section ne contient "${args.titre}" (${sections.length} sections). Passer par --lister et l'apercu.`);
  }
  const info = sections[trouvees[0] - 1];
  const sortie = { n: trouvees[0], premierTitre: info.premierTitre };
  if (trouvees.length > 1) sortie.autres = trouvees.slice(1);
  process.stdout.write(JSON.stringify(sortie, null, 2) + "\n");
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
  const blocsBureau = await page.evaluate(ordreBlocs, n);
  const texteLong = await page.evaluate(premierTexteLong, n);
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

  // animation filmee dans une page neuve (bureau)
  let mesure;
  try {
    mesure = await mesurerAnimations(navigateur, args.url, info, n, args.sortie);
  } catch (e) {
    mesure = { animations: { nonMesure: `mesure impossible : ${e.message.split("\n")[0].slice(0, 100)}` } };
  }
  trace("animation mesuree");

  // mobile : page rechargee en 390 x 844, section retrouvee par son titre (pas par son numero)
  let analyseMobile = null;
  let blocsMobile = [];
  let avertissementMobile = null;
  let vignetteMobile = null;
  try {
    const mobile = await ouvrir(navigateur, args.url, true);
    // aiguilles : le titre, sinon le premier texte long ; sans texte du tout, repli par numero
    const aiguilles = [info.premierTitre, texteLong].filter(Boolean);
    let trouvees = [];
    for (const a of aiguilles) {
      trouvees = await mobile.page.evaluate(chercherTitre, a);
      if (trouvees.length) break;
    }
    let m = trouvees.includes(n) ? n : trouvees[0];
    const aiguille = aiguilles[0] || null;
    if (!aiguilles.length && mobile.sections[n - 1]) {
      m = n;
      avertissementMobile = `Section ${n} sans texte : retrouvee en mobile par son numero, a verifier.`;
    }
    if (!m) {
      analyseMobile = "introuvable";
      avertissementMobile = `Section ${n} introuvable en mobile (titre "${aiguille}") : mobile non mesure.`;
    } else {
      analyseMobile = await mobile.page.evaluate(analyserSection, m);
      analyseMobile.animations.mouvement = await mobile.page.evaluate(mesurerMouvement, m);
      blocsMobile = await mobile.page.evaluate(ordreBlocs, m);
      if (m !== n) avertissementMobile = `En mobile, la section est la ${m} (la ${n} en bureau).`;
      await mobile.page.evaluate(figerPourCapture);
      await mobile.page.evaluate(masquerFixesHors, m);
      const zm = await mobile.page.evaluate((k) => {
        const r = document.querySelector(`[data-kleak-n="${k}"]`).getBoundingClientRect();
        return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
      }, m);
      vignetteMobile = await capturerZone(navigateur, mobile.page, { ...zm, height: Math.min(zm.height, 1600) }, { qualite: 60 });
      writeFileSync(join(args.sortie, "vignette-mobile.jpg"), vignetteMobile);
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
    bureau: { ...analyseBureau, animationsMesurees: mesure.animations, animationsDetail: mesure.detail || null },
    mobile: analyseMobile,
    avertissements: avertissementMobile ? [avertissementMobile] : [],
  };
  const chemin = join(args.sortie, "analyse.json");
  writeFileSync(chemin, JSON.stringify(analyse, null, 2));
  const vignette = join(args.sortie, "vignette.jpg");
  const vignetteMobileChemin = vignetteMobile ? join(args.sortie, "vignette-mobile.jpg") : null;
  writeFileSync(vignette, await faireVignette(navigateur, image));
  const resume = join(args.sortie, "resume.json");
  writeFileSync(resume, JSON.stringify(construireResume({ info, bureau: analyseBureau, mobile: analyseMobile, blocsBureau, blocsMobile, avertissements: analyse.avertissements, mesure: mesure.animations })));
  process.stdout.write(JSON.stringify({ capture, vignette, vignetteMobile: vignetteMobileChemin, animation: mesure.fichier || null, resume, analyse: chemin, octets: image.length, qualite, decoupe, outil, avertissements: analyse.avertissements }, null, 2) + "\n");
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
    else if (args.titre !== null) await chercher(navigateur, args);
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
