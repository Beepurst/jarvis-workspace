#!/usr/bin/env node
// Prépare la maquette d'un prospect : lit le compte dans le hub, puis le site actuel.
//
//   node livrables/maquette-prospect/preparer.mjs                       leads au site `ok` sans maquette (hub)
//   node livrables/maquette-prospect/preparer.mjs "<nom ou id>"         prépare le dossier du prospect
//        [--page <url>]...      jusqu'à 3 pages internes en plus de l'accueil (textes et images)
//        [--sortie <dossier>]   ailleurs que livrables/clients/prospects/<slug>/
//   node livrables/maquette-prospect/preparer.mjs --essai --site <url> [--nom "<entreprise>"] [--sortie <dossier>]
//                              essai sans hub : compte fictif, rien ne pourra être déposé
//
// Dossier produit :
//   compte.json        compte du hub (id, nom, entreprise, email, site_url, site_statut), maquette existante, domaine
//   site/bureau-N.jpg  accueil à 1440 px, en tranches de 1800 px (6 au plus)
//   site/mobile-N.jpg  accueil à 390 px, en tranches de 1600 px (6 au plus)
//   site/textes.json   page (titre, description, navigation, pied) et textes par section, dans l'ordre
//   site/textes-page-K.json   pages internes demandées par --page
//   site/images/       images téléchargées (logo d'abord), 1920 px au plus, et images.json (source, rôle, section)
//   site/couleurs.json couleurs dominantes mesurées (fonds, textes, boutons) pondérées par surface ou longueur
//   site/polices.json  polices mesurées (titres, texte, boutons) et polices chargées
//   site/pagespeed.json score PageSpeed Insights mobile mesuré par l'API publique, daté ; null et l'erreur sinon
//   site/signaux.json  faits vérifiables pour l'analyse (copyright, mentions, cookies, débordement mobile...)
//   maquette/          vide à la création, jamais vidé ensuite (redépôt)
//
// Codes de sortie : 0 fait, 1 erreur (hub, arguments), 3 site injoignable, 4 statut du site autre que `ok`,
// 5 plusieurs comptes correspondent (liste sur la sortie standard).
// Le secret n'est jamais affiché.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  ErreurSortie,
  appelHub,
  defiler,
  domaineDe,
  dossierProspect,
  lancer,
  lancerNavigateur,
  messageRefus,
  optionsContexte,
  slug,
  variable,
} from "./commun.mjs";

const MAX_IMAGES = 40;
const MAX_IMAGES_PAGE = 15;
const COTE_MAX = 1920;

function lireArguments(argv) {
  const a = { recherche: null, site: null, essai: false, nom: null, sortie: null, pages: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--essai") a.essai = true;
    else if (x === "--site") a.site = argv[++i];
    else if (x === "--nom") a.nom = argv[++i];
    else if (x === "--sortie") a.sortie = argv[++i];
    else if (x === "--page") a.pages.push(argv[++i]);
    else if (!x.startsWith("--") && a.recherche === null) a.recherche = x;
    else throw new ErreurSortie(1, `Argument inconnu : ${x}`);
  }
  if (a.site && !a.essai) throw new ErreurSortie(1, "--site ne sert qu'avec --essai : sinon le site vient du hub.");
  if (a.essai && !a.site) throw new ErreurSortie(1, "--essai attend --site <url>.");
  if (a.pages.length > 3) throw new ErreurSortie(1, "3 pages internes au plus.");
  for (const u of [a.site, ...a.pages].filter(Boolean)) {
    try {
      if (!/^https?:$/.test(new URL(u).protocol)) throw new Error();
    } catch {
      throw new ErreurSortie(1, `Adresse invalide : ${u}`);
    }
  }
  return a;
}

// ---------- hub ----------

async function listerLeads() {
  const r = await appelHub("GET", "/api/agent/maquettes");
  if (r.status !== 200) throw new ErreurSortie(1, messageRefus(r));
  const comptes = (r.json?.comptes ?? []).map((c) => ({ id: c.id, nom: c.nom, entreprise: c.entreprise, site_url: c.site_url, lead_cree_le: c.lead_cree_le }));
  process.stdout.write(JSON.stringify({ comptes }, null, 2) + "\n");
}

async function lireCompte(recherche) {
  const r = await appelHub("GET", `/api/agent/maquettes?compte=${encodeURIComponent(recherche)}`);
  if (r.status === 409) {
    const comptes = (r.json?.comptes ?? []).map((c) => ({ id: c.id, nom: c.nom, entreprise: c.entreprise, email: c.email, site_url: c.site_url, site_statut: c.site_statut }));
    process.stdout.write(JSON.stringify({ plusieurs: comptes }, null, 2) + "\n");
    throw new ErreurSortie(5, `Plusieurs comptes correspondent à « ${recherche} » : relancer avec l'id.`);
  }
  if (r.status !== 200) throw new ErreurSortie(1, messageRefus(r));
  return { compte: r.json.compte, maquette: r.json.maquette };
}

// ---------- PageSpeed Insights ----------

async function mesurerPageSpeed(url) {
  const cle = variable("PAGESPEED_API_KEY");
  const params = new URLSearchParams({ url, strategy: "mobile", category: "performance", locale: "fr" });
  if (cle) params.set("key", cle);
  const masquer = (m) => (cle ? String(m).split(cle).join("(clé)") : String(m));
  const vide = (erreur) => ({ mobile: null, mesure_le: null, url, strategie: "mobile", erreur: masquer(erreur), cle_api: !!cle });
  try {
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { signal: AbortSignal.timeout(150000) });
    const j = await r.json().catch(() => null);
    if (!r.ok) return vide(`HTTP ${r.status} : ${j?.error?.message ?? "réponse illisible"}${r.status === 429 && !cle ? " (quota anonyme épuisé : ajouter PAGESPEED_API_KEY au .env)" : ""}`);
    const lh = j?.lighthouseResult;
    const score = lh?.categories?.performance?.score;
    if (typeof score !== "number") return vide("score absent de la réponse");
    const m = (id) => lh.audits?.[id]?.displayValue ?? null;
    return {
      mobile: Math.round(score * 100),
      mesure_le: j.analysisUTCTimestamp ?? lh.fetchTime ?? new Date().toISOString(),
      url: lh.finalDisplayedUrl ?? lh.finalUrl ?? url,
      strategie: "mobile",
      metriques: { fcp: m("first-contentful-paint"), lcp: m("largest-contentful-paint"), tbt: m("total-blocking-time"), cls: m("cumulative-layout-shift"), si: m("speed-index") },
      source: "API PageSpeed Insights v5",
    };
  } catch (e) {
    return vide(e.name === "TimeoutError" ? "pas de réponse en 150 s" : e.message);
  }
}

// ---------- fonctions exécutées dans la page ----------

// Bandeau de cookies : repéré (outil), puis accepté ou masqué, pour des captures propres.
function traiterCookies() {
  const OUTILS = { tarteaucitron: "#tarteaucitronRoot", axeptio: "#axeptio_overlay, .axeptio_mount", didomi: "#didomi-host", cookiebot: "#CybotCookiebotDialog", onetrust: "#onetrust-banner-sdk, #onetrust-consent-sdk", complianz: ".cmplz-cookiebanner", cookieyes: ".cky-consent-container", iubenda: "#iubenda-cs-banner", "cookie-notice": "#cookie-notice", borlabs: "#BorlabsCookieBox" };
  let outil = null;
  for (const [nom, sel] of Object.entries(OUTILS)) if (document.querySelector(sel)) { outil = nom; break; }
  const candidats = [...document.body.querySelectorAll("div, section, aside, dialog, footer")].filter((el) => {
    const cs = getComputedStyle(el);
    if (!(cs.position === "fixed" || cs.position === "sticky" || Number(cs.zIndex) > 999)) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && /cookie|traceur|consentement|confidentialit/i.test(el.innerText || "");
  });
  const detecte = !!outil || candidats.length > 0;
  const ACCEPTER = /^(tout accepter|accepter tout|accepter et fermer|accepter|j'accepte|j’accepte|ok|accept all|accept|continuer sans accepter|refuser|tout refuser)$/i;
  let clic = null;
  for (const b of document.querySelectorAll("button, a, [role=button]")) {
    const t = (b.innerText || "").replace(/\s+/g, " ").trim();
    const r = b.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && ACCEPTER.test(t) && (candidats.some((c) => c.contains(b)) || (outil && b.closest(Object.values(OUTILS).join(","))))) {
      b.click();
      clic = t;
      break;
    }
  }
  return { detecte, outil, clic };
}

function masquerCookies() {
  for (const el of document.body.querySelectorAll("div, section, aside, dialog")) {
    const cs = getComputedStyle(el);
    if ((cs.position === "fixed" || Number(cs.zIndex) > 999) && /cookie|traceur|consentement/i.test(el.innerText || "") && !el.querySelector("nav")) {
      el.style.setProperty("display", "none", "important");
    }
  }
  for (const sel of ["#tarteaucitronRoot", "#axeptio_overlay", "#didomi-host", "#CybotCookiebotDialog", "#onetrust-consent-sdk", ".cmplz-cookiebanner", ".cky-consent-container", "#iubenda-cs-banner", "#cookie-notice", "#BorlabsCookieBox"]) {
    for (const el of document.querySelectorAll(sel)) el.style.setProperty("display", "none", "important");
  }
}

// Textes par section, images, couleurs, polices et signaux. Déterministe, sans réseau.
function extraire({ maxImages }) {
  const net = (s) => (s || "").replace(/\s+/g, " ").trim();
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1;
  };
  const IGNORES = new Set(["SCRIPT", "STYLE", "LINK", "NOSCRIPT", "TEMPLATE", "META", "IFRAME"]);
  const enfants = (el) =>
    [...el.children].flatMap((c) => (IGNORES.has(c.tagName) ? [] : getComputedStyle(c).display === "contents" ? enfants(c) : [c])).filter(visible);
  const fixe = (el) => getComputedStyle(el).position === "fixed";
  const blocsDe = (el) => {
    let racine = el;
    for (let i = 0; i < 30; i++) {
      const k = enfants(racine).filter((c) => !fixe(c) || c.matches("header, nav") || c.querySelector("nav"));
      if (k.length !== 1) return k;
      racine = k[0];
    }
    return [racine];
  };
  let blocs;
  const main = document.querySelector("main");
  if (main && visible(main)) {
    const autour = [...document.querySelectorAll("header, nav, footer")].filter((el) => !main.contains(el) && !el.parentElement.closest("header, nav, footer") && visible(el));
    blocs = [
      ...autour.filter((el) => el.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING),
      ...blocsDe(main),
      ...autour.filter((el) => el.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_PRECEDING),
    ];
  } else {
    blocs = blocsDe(document.body);
  }
  // Une enveloppe géante (tout le contenu dans un div) est redécoupée une fois.
  blocs = blocs.flatMap((b) => (b.getBoundingClientRect().height > window.innerHeight * 4 && enfants(b).length > 1 ? enfants(b) : [b]));
  blocs = blocs.filter((b) => b.getBoundingClientRect().height >= 40).slice(0, 40);

  const absolu = (u) => { try { return new URL(u, location.href).href; } catch { return null; } };
  const hex = (c) => {
    const m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
    if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
    return "#" + [m[1], m[2], m[3]].map((v) => Math.round(Number(v)).toString(16).padStart(2, "0")).join("");
  };
  const fondDe = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const h = hex(getComputedStyle(e).backgroundColor);
      if (h) return h;
    }
    return null;
  };
  const estBouton = (el) => {
    if (el.tagName === "BUTTON" || el.getAttribute("role") === "button") return true;
    const cs = getComputedStyle(el);
    return !!hex(cs.backgroundColor) || /btn|button|bouton|cta/i.test(el.className?.baseVal ?? el.className ?? "") || (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderRadius) > 0);
  };

  const sections = blocs.map((b, i) => {
    b.setAttribute("data-kleak-section", String(i + 1));
    const r = b.getBoundingClientRect();
    const titres = [...b.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(visible).map((h) => ({ niveau: Number(h.tagName[1]), texte: net(h.innerText) })).filter((t) => t.texte).slice(0, 12);
    const vus = new Set(titres.map((t) => t.texte));
    const textes = [];
    for (const el of b.querySelectorAll("p, li, blockquote, dd, dt, figcaption, td, address, span, div")) {
      if (textes.length >= 30) break;
      if (!visible(el) || el.closest("h1, h2, h3, h4, h5, h6, button, nav")) continue;
      // un bloc dont le texte vient seulement de ses enfants est sauté (on garde les feuilles)
      if ((el.tagName === "DIV" || el.tagName === "SPAN") && [...el.childNodes].every((n) => n.nodeType !== 3 || !net(n.textContent))) continue;
      const t = net(el.innerText);
      if (t.length < 3 || vus.has(t) || [...vus].some((v) => v.length > 40 && v.includes(t))) continue;
      vus.add(t);
      textes.push(t.slice(0, 600));
    }
    const boutons = [...b.querySelectorAll("a, button, [role=button]")]
      .filter((el) => visible(el) && net(el.innerText).length > 0 && net(el.innerText).length <= 40 && estBouton(el))
      .slice(0, 10)
      .map((el) => ({ texte: net(el.innerText), href: el.getAttribute("href") || null }));
    return {
      n: i + 1,
      balise: b.tagName.toLowerCase(),
      id: b.id || null,
      haut: Math.round(r.top + scrollY),
      hauteur: Math.round(r.height),
      fond: fondDe(b),
      titres,
      textes,
      boutons,
    };
  });

  // ----- images -----
  const images = [];
  const vuesImg = new Set();
  const ajouterImage = (url, el, info) => {
    const u = absolu(url);
    if (!u || u.startsWith("data:") || vuesImg.has(u)) return;
    vuesImg.add(u);
    const s = el?.closest("[data-kleak-section]");
    images.push({ source: u, section: s ? Number(s.getAttribute("data-kleak-section")) : null, ...info });
  };
  const logoRegex = /logo/i;
  for (const img of document.querySelectorAll("img")) {
    const r = img.getBoundingClientRect();
    const src = img.currentSrc || img.src;
    if (!src) continue;
    const dansEntete = !!img.closest("header, nav");
    const logo = logoRegex.test(`${img.alt} ${src} ${img.className} ${img.id} ${img.closest("a")?.className ?? ""}`) || (dansEntete && img.closest("a") && r.width < 400);
    if (!logo && (r.width < 60 || r.height < 60) && (img.naturalWidth < 120 || img.naturalHeight < 120)) continue;
    ajouterImage(src, img, { role: logo ? "logo" : "image", alt: net(img.alt) || null, affichee: `${Math.round(r.width)}x${Math.round(r.height)}`, naturelle: `${img.naturalWidth}x${img.naturalHeight}` });
  }
  for (const el of document.body.querySelectorAll("*")) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none" || !bg.includes("url(")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 80) continue;
    for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) ajouterImage(m[1], el, { role: "fond", alt: null, affichee: `${Math.round(r.width)}x${Math.round(r.height)}`, naturelle: null });
  }
  // logo en SVG dans l'en-tête, si aucun logo image
  let logoSvg = null;
  if (!images.some((i) => i.role === "logo")) {
    const svg = [...document.querySelectorAll("header svg, nav svg")].find((s) => {
      const r = s.getBoundingClientRect();
      return r.width >= 40 && r.height >= 16 && (s.closest("a") || logoRegex.test(s.outerHTML.slice(0, 300)));
    });
    if (svg) {
      const copie = svg.cloneNode(true);
      copie.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      if (!copie.getAttribute("fill")) copie.setAttribute("fill", getComputedStyle(svg).color);
      logoSvg = copie.outerHTML;
    }
  }
  for (const v of document.querySelectorAll("video")) {
    if (!v.poster) continue;
    const r = v.getBoundingClientRect();
    ajouterImage(v.poster, v, { role: "fond", alt: "image d'attente de la vidéo", affichee: `${Math.round(r.width)}x${Math.round(r.height)}`, naturelle: null });
  }
  const og = document.querySelector('meta[property="og:image"]')?.content;
  if (og) ajouterImage(og, null, { role: "og", alt: null, affichee: null, naturelle: null });
  const icones = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => l.href).filter(Boolean);
  if (icones.length) ajouterImage(icones[icones.length - 1], null, { role: "icone", alt: null, affichee: null, naturelle: null });
  const ordre = { logo: 0, image: 1, fond: 1, og: 2, icone: 3 };
  images.sort((a, b) => ordre[a.role] - ordre[b.role]);

  // ----- couleurs -----
  const poids = { fonds: {}, textes: {}, boutons: {} };
  const ajouter = (t, h, p) => { if (h) poids[t][h] = (poids[t][h] || 0) + p; };
  const tous = [...document.body.querySelectorAll("*")].slice(0, 6000);
  for (const el of tous) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const surface = Math.min(r.width, innerWidth) * Math.min(r.height, 3000);
    ajouter("fonds", hex(cs.backgroundColor), surface);
    const directs = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("").length;
    if (directs) ajouter("textes", hex(cs.color), directs);
    if ((el.tagName === "A" || el.tagName === "BUTTON") && estBouton(el) && net(el.innerText).length <= 40) ajouter("boutons", hex(cs.backgroundColor) || hex(cs.borderTopColor), 1);
  }
  ajouter("fonds", hex(getComputedStyle(document.body).backgroundColor) || "#ffffff", 1);
  const classer = (o, n) => {
    const total = Object.values(o).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([couleur, p]) => ({ couleur, part: Math.round((p / total) * 1000) / 10 }));
  };
  const couleurs = { fonds: classer(poids.fonds, 8), textes: classer(poids.textes, 6), boutons: classer(poids.boutons, 5) };

  // ----- polices -----
  const parRole = {};
  const roles = { titres: "h1, h2, h3", texte: "p, li", boutons: "button, a[class*=btn], a[class*=button]", navigation: "nav a, header a" };
  for (const [role, sel] of Object.entries(roles)) {
    const familles = {};
    for (const el of [...document.querySelectorAll(sel)].filter(visible).slice(0, 200)) {
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      const cle = `${fam}|${cs.fontWeight}`;
      familles[cle] = familles[cle] || { famille: fam, graisse: cs.fontWeight, taillesPx: new Set(), n: 0 };
      familles[cle].n++;
      familles[cle].taillesPx.add(Math.round(parseFloat(cs.fontSize)));
    }
    parRole[role] = Object.values(familles).sort((a, b) => b.n - a.n).slice(0, 4).map((f) => ({ ...f, taillesPx: [...f.taillesPx].sort((a, b) => b - a).slice(0, 6) }));
  }
  const chargees = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family.replace(/["']/g, "")} ${f.weight} ${f.style}`))].slice(0, 30);
  const googleFonts = [...document.querySelectorAll('link[href*="fonts.googleapis.com"]')].map((l) => l.href);
  const polices = { parRole, chargees, googleFonts };

  // ----- page et signaux -----
  const texteCorps = document.body.innerText || "";
  const copyright = [...texteCorps.matchAll(/(?:©|copyright|\(c\))\s*(?:[^\d\n]{0,30})?((?:19|20)\d{2})(?:\s*[-–à]\s*((?:19|20)\d{2}))?/gi)].map((m) => Number(m[2] || m[1]));
  const annees = [...texteCorps.matchAll(/\b(19[89]\d|20[0-3]\d)\b/g)].map((m) => Number(m[1]));
  const liens = [...document.querySelectorAll("a[href]")].map((a) => ({ texte: net(a.innerText).slice(0, 80), href: a.href }));
  const internes = [...new Map(liens.filter((l) => { try { const u = new URL(l.href); return u.host === location.host && u.pathname !== location.pathname && !/\.(pdf|jpe?g|png|zip)$/i.test(u.pathname); } catch { return false; } }).map((l) => [l.href.split("#")[0], l])).values()].slice(0, 40);
  const navigation = [...document.querySelectorAll("header a, nav a")].filter(visible).map((a) => ({ texte: net(a.innerText), href: a.getAttribute("href") })).filter((l) => l.texte).slice(0, 25);
  const pied = document.querySelector("footer");
  const page = {
    url: location.href,
    titre: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? null,
    langue: document.documentElement.lang || null,
    navigation,
    pied: pied ? net(pied.innerText).slice(0, 1500) : null,
    liensInternes: internes,
  };
  const signaux = {
    h1: [...document.querySelectorAll("h1")].filter(visible).map((h) => net(h.innerText)),
    copyright: copyright.length ? Math.max(...copyright) : null,
    anneeLaPlusRecente: annees.length ? Math.max(...annees) : null,
    mentions: liens.filter((l) => /mentions|l[ée]gal|cgv|conditions|confidentialit|cookie|rgpd|privacy|donn[ée]es personnelles/i.test(`${l.texte} ${l.href}`)).slice(0, 10),
    telephones: [...new Set(liens.filter((l) => l.href.startsWith("tel:")).map((l) => l.href.slice(4)))].slice(0, 5),
    emails: [...new Set(liens.filter((l) => l.href.startsWith("mailto:")).map((l) => l.href.slice(7).split("?")[0]))].slice(0, 5),
    formulaires: document.querySelectorAll("form").length,
    videos: document.querySelectorAll("video").length,
    viewport: document.querySelector('meta[name="viewport"]')?.content ?? null,
    generateur: document.querySelector('meta[name="generator"]')?.content ?? null,
    https: location.protocol === "https:",
  };
  return { page, sections, images: images.slice(0, maxImages), logoSvg, couleurs, polices, signaux };
}

// ---------- images ----------

function typeImage(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.slice(0, 4).toString("hex") === "89504e47") return "png";
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return "webp";
  if (buf.slice(0, 4).toString() === "GIF8") return "gif";
  if (buf.slice(4, 12).toString().startsWith("ftypavi")) return "avif";
  const debut = buf.slice(0, 600).toString().trimStart();
  if (/^(<\?xml[\s\S]*?)?(<!--[\s\S]*?-->\s*)*(<!doctype svg[^>]*>\s*)?<svg[\s>]/i.test(debut)) return "svg";
  return null;
}

function dimensions(fichier) {
  try {
    const s = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", fichier], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const w = Number(s.match(/pixelWidth: (\d+)/)?.[1]);
    const h = Number(s.match(/pixelHeight: (\d+)/)?.[1]);
    return w && h ? { w, h } : null;
  } catch {
    return null;
  }
}

function sips(args) {
  execFileSync("sips", args, { stdio: "ignore" });
}

/** Télécharge, convertit (gif, avif en jpg), réduit à 1920 px. Rend la fiche de l'image ou une raison d'échec. */
async function telecharger(requete, image, dossier, nom, referer) {
  let r;
  try {
    r = await requete.get(image.source, { timeout: 20000, headers: { referer: referer } });
  } catch (e) {
    return { erreur: e.message.split("\n")[0] };
  }
  if (!r.ok()) return { erreur: `HTTP ${r.status()}` };
  const buf = await r.body();
  const type = typeImage(buf);
  if (!type) return { erreur: "format non reconnu" };
  if (buf.length < 400 && type !== "svg") return { erreur: "image vide" };
  let ext = type === "jpg" || type === "png" || type === "webp" || type === "svg" ? type : "jpg";
  let fichier = join(dossier, `${nom}.${ext}`);
  if (type === "gif" || type === "avif") {
    const brut = join(dossier, `${nom}.${type}`);
    writeFileSync(brut, buf);
    try {
      sips(["-s", "format", "jpeg", "-s", "formatOptions", "82", brut, "--out", fichier]);
    } catch {
      rmSync(brut, { force: true });
      return { erreur: `${type} non convertible` };
    }
    rmSync(brut, { force: true });
  } else {
    writeFileSync(fichier, buf);
  }
  let dim = ext === "svg" ? null : dimensions(fichier);
  if (dim && Math.max(dim.w, dim.h) > COTE_MAX) {
    const cible = ext === "png" ? fichier : join(dossier, `${nom}.jpg`);
    try {
      if (ext === "png") sips(["-Z", String(COTE_MAX), fichier]);
      else sips(["-Z", String(COTE_MAX), "-s", "format", "jpeg", "-s", "formatOptions", "82", fichier, "--out", cible]);
      if (cible !== fichier) rmSync(fichier, { force: true });
      fichier = cible;
      ext = fichier.split(".").pop();
      dim = dimensions(fichier);
    } catch {
      /* gardée telle quelle */
    }
  }
  return { fichier: `${nom}.${ext}`, largeur: dim?.w ?? null, hauteur: dim?.h ?? null, octets: readFileSync(fichier).length };
}

function nomImage(image, i, logos) {
  if (image.role === "logo") return logos === 0 ? "logo" : `logo-${logos + 1}`;
  let base = "image";
  try {
    const brut = decodeURIComponent(new URL(image.source).pathname.split("/").pop().replace(/\.[a-z0-9]+$/i, ""));
    // sans les empreintes des CDN (Webflow, Framer, Wix) ni les suffixes de taille
    base = slug(brut.replace(/(^|[_-])[0-9a-f]{12,}(?=[_-]|$)/gi, "$1").replace(/[_-](p|w|h)?[_-]?\d{2,4}(x\d{2,4})?$/i, "")) || "image";
  } catch {
    /* nom par défaut */
  }
  return `${String(i).padStart(2, "0")}-${base.slice(0, 40).replace(/-+$/, "")}`;
}

// ---------- capture ----------

async function ouvrir(navigateur, url, mobile) {
  const contexte = await navigateur.newContext(optionsContexte(mobile));
  const page = await contexte.newPage();
  let reponse;
  try {
    reponse = await page.goto(url, { waitUntil: "load", timeout: 45000 });
  } catch (e) {
    await contexte.close();
    throw new ErreurSortie(3, `Site injoignable (${url}) : ${e.message.split("\n")[0]}`);
  }
  if (!reponse || reponse.status() >= 400) {
    await contexte.close();
    throw new ErreurSortie(3, `Site injoignable (${url}) : ${reponse ? `HTTP ${reponse.status()}` : "aucune réponse"}.`);
  }
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  const cookies = await page.evaluate(traiterCookies);
  await page.waitForTimeout(800);
  await page.evaluate(masquerCookies);
  await page.evaluate(defiler);
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await page.evaluate(masquerCookies);
  return { contexte, page, cookies, statut: reponse.status() };
}

async function tranches(page, dossier, prefixe, hauteurTranche, max) {
  const largeur = page.viewportSize().width;
  const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
  const total = Math.min(hauteur, hauteurTranche * max);
  const fichiers = [];
  for (let i = 0, y = 0; y < total; i++, y += hauteurTranche) {
    const f = join(dossier, `${prefixe}-${i + 1}.jpg`);
    const buf = await page.screenshot({ type: "jpeg", quality: 70, fullPage: true, clip: { x: 0, y, width: largeur, height: Math.min(hauteurTranche, total - y) }, timeout: 60000 });
    writeFileSync(f, buf);
    fichiers.push(f);
  }
  return { fichiers, hauteur, coupee: hauteur > total };
}

// ---------- principal ----------

async function principal() {
  const args = lireArguments(process.argv.slice(2));
  if (!args.recherche && !args.essai) return listerLeads();

  let compte;
  let maquette = null;
  if (args.essai) {
    const domaine = domaineDe(args.site);
    compte = { id: null, nom: args.nom || domaine, entreprise: args.nom || null, email: null, site_url: args.site, site_statut: "ok", essai: true };
  } else {
    ({ compte, maquette } = await lireCompte(args.recherche));
    if (compte.site_statut !== "ok" || !compte.site_url) {
      throw new ErreurSortie(4, `Site de ${compte.entreprise || compte.nom} : statut ${compte.site_statut ?? "aucun site"}${compte.site_url ? ` (${compte.site_url})` : ""}. Pas de maquette possible.`);
    }
  }
  const domaine = domaineDe(compte.site_url);
  const dossier = args.sortie ? resolve(args.sortie) : dossierProspect(compte, args.essai ? "essai-" : "");
  const existait = existsSync(dossier);
  const site = join(dossier, "site");
  const dossierImages = join(site, "images");
  rmSync(site, { recursive: true, force: true });
  mkdirSync(dossierImages, { recursive: true });
  mkdirSync(join(dossier, "maquette", "img"), { recursive: true });

  const pagespeed = mesurerPageSpeed(compte.site_url);
  const avertissements = [];
  const navigateur = await lancerNavigateur();
  try {
    // bureau : captures, textes, images, couleurs, polices
    const b = await ouvrir(navigateur, compte.site_url, false);
    const donnees = await b.page.evaluate(extraire, { maxImages: MAX_IMAGES });
    const capturesBureau = await tranches(b.page, site, "bureau", 1800, 6);
    if (capturesBureau.coupee) avertissements.push(`accueil bureau de ${capturesBureau.hauteur} px : captures coupées à ${1800 * 6} px`);

    // pages internes
    const pagesInternes = [];
    for (const [k, url] of args.pages.entries()) {
      try {
        const p = await ouvrir(navigateur, url, false);
        const d = await p.page.evaluate(extraire, { maxImages: MAX_IMAGES_PAGE });
        writeFileSync(join(site, `textes-page-${k + 1}.json`), JSON.stringify({ page: d.page, sections: d.sections }, null, 2));
        for (const img of d.images) if (!donnees.images.some((x) => x.source === img.source)) donnees.images.push({ ...img, page: k + 1 });
        pagesInternes.push(join(site, `textes-page-${k + 1}.json`));
        await p.contexte.close();
      } catch (e) {
        avertissements.push(`page interne ${url} non lue : ${e.message}`);
      }
    }

    // téléchargement des images (le contexte bureau garde les cookies du site)
    const manifeste = [];
    const ignorees = [];
    let n = 0;
    let logos = 0;
    for (const img of donnees.images.slice(0, MAX_IMAGES)) {
      const nom = nomImage(img, img.role === "logo" ? 0 : ++n, logos);
      const res = await telecharger(b.contexte.request, img, dossierImages, nom, compte.site_url);
      if (res.erreur) {
        ignorees.push({ source: img.source, raison: res.erreur });
        continue;
      }
      if (img.role === "logo") logos++;
      manifeste.push({ fichier: res.fichier, role: img.role, section: img.section, page: img.page ?? null, alt: img.alt, affichee: img.affichee, largeur: res.largeur, hauteur: res.hauteur, octets: res.octets, source: img.source });
    }
    if (donnees.logoSvg && logos === 0) {
      writeFileSync(join(dossierImages, "logo.svg"), donnees.logoSvg);
      manifeste.unshift({ fichier: "logo.svg", role: "logo", section: 1, alt: null, source: "svg de l'en-tête" });
      logos++;
    }
    if (logos === 0) avertissements.push("aucun logo trouvé : le chercher sur les captures (texte stylé ?) ou le demander à Edgar");
    writeFileSync(join(dossierImages, "images.json"), JSON.stringify({ images: manifeste, ignorees }, null, 2));
    await b.contexte.close();

    // mobile : captures et débordement
    const m = await ouvrir(navigateur, compte.site_url, true);
    const mesureMobile = await m.page.evaluate(() => ({
      largeurDefilement: document.documentElement.scrollWidth,
      largeurEcran: window.innerWidth,
      texteMinPx: Math.min(...[...document.querySelectorAll("p, li")].filter((e) => e.getBoundingClientRect().width > 0).map((e) => parseFloat(getComputedStyle(e).fontSize)).filter(Boolean), 99),
    }));
    const capturesMobile = await tranches(m.page, site, "mobile", 1600, 6);
    await m.contexte.close();

    const signaux = {
      ...donnees.signaux,
      urlFinale: donnees.page.url,
      statutHttp: b.statut,
      bandeauCookies: b.cookies,
      mobile: { ...mesureMobile, deborde: mesureMobile.largeurDefilement > 390, texteMinPx: mesureMobile.texteMinPx === 99 ? null : mesureMobile.texteMinPx },
      hauteurAccueilBureau: capturesBureau.hauteur,
      hauteurAccueilMobile: capturesMobile.hauteur,
      lu_le: new Date().toISOString(),
    };
    writeFileSync(join(site, "textes.json"), JSON.stringify({ page: donnees.page, sections: donnees.sections }, null, 2));
    writeFileSync(join(site, "couleurs.json"), JSON.stringify(donnees.couleurs, null, 2));
    writeFileSync(join(site, "polices.json"), JSON.stringify(donnees.polices, null, 2));
    writeFileSync(join(site, "signaux.json"), JSON.stringify(signaux, null, 2));

    const ps = await pagespeed;
    writeFileSync(join(site, "pagespeed.json"), JSON.stringify(ps, null, 2));
    if (ps.mobile === null) avertissements.push(`PageSpeed non mesuré : ${ps.erreur}`);

    writeFileSync(
      join(dossier, "compte.json"),
      JSON.stringify({ compte, maquette, domaine, prepare_le: new Date().toISOString(), essai: !!args.essai }, null, 2),
    );

    process.stdout.write(
      JSON.stringify(
        {
          dossier,
          compte: { id: compte.id, nom: compte.nom, entreprise: compte.entreprise, site_url: compte.site_url, domaine },
          maquetteExistante: !!maquette,
          sections: donnees.sections.length,
          images: manifeste.length,
          imagesIgnorees: ignorees.length,
          pagespeed: ps.mobile,
          fichiers: {
            bureau: capturesBureau.fichiers,
            mobile: capturesMobile.fichiers,
            textes: join(site, "textes.json"),
            pagesInternes,
            images: join(dossierImages, "images.json"),
            couleurs: join(site, "couleurs.json"),
            polices: join(site, "polices.json"),
            pagespeed: join(site, "pagespeed.json"),
            signaux: join(site, "signaux.json"),
            maquette: join(dossier, "maquette"),
          },
          avertissements,
        },
        null,
        2,
      ) + "\n",
    );
  } catch (e) {
    // site injoignable : pas de dossier vide laissé derrière
    if (e instanceof ErreurSortie && e.code === 3 && !existait) rmSync(dossier, { recursive: true, force: true });
    throw e;
  } finally {
    await navigateur.close();
  }
}

lancer(principal);
