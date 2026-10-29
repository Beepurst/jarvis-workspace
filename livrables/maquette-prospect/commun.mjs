// Outils communs aux scripts de l'agent maquette-prospect : configuration (.env), appels au hub,
// règles du HTML déposé (les mêmes que le hub, src/lib/maquette-prospect/depot.ts), navigateur.
// Le secret n'est jamais affiché ni écrit : il ne sert que dans l'en-tête x-kleak-secret.

import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ICI = dirname(fileURLToPath(import.meta.url));
export const RACINE = resolve(ICI, "../..");
export const DOSSIER_PROSPECTS = join(RACINE, "livrables/clients/prospects");

const require = createRequire(join(RACINE, "livrables/creas-meta/package.json"));

export class ErreurSortie extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/** Lance un principal async : message d'erreur sur stderr, code de sortie de l'erreur (1 par défaut). */
export function lancer(principal) {
  principal().catch((e) => {
    process.stderr.write(`Erreur : ${e.message}\n`);
    process.exit(e instanceof ErreurSortie ? e.code : 1);
  });
}

// ---------- configuration ----------

function lireEnv() {
  const v = {};
  const fichier = join(RACINE, ".env");
  if (!existsSync(fichier)) return v;
  for (const l of readFileSync(fichier, "utf8").split("\n")) {
    const m = l.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) v[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return v;
}

let ENV = null;
/** Variable de l'environnement, sinon du .env du workspace. */
export function variable(nom) {
  ENV ??= lireEnv();
  return process.env[nom] || ENV[nom] || "";
}

/** Adresse du hub : HUB_URL_ESSAI (hub local) sinon HUB_URL. */
export function adresseHub() {
  return (variable("HUB_URL_ESSAI") || variable("HUB_URL")).replace(/\/+$/, "");
}

/** Appel JSON au hub avec le secret de l'agent. Hub injoignable : ErreurSortie 1, sans le secret. */
export async function appelHub(methode, chemin, corps) {
  const hub = adresseHub();
  if (!hub) throw new ErreurSortie(1, "HUB_URL absent de l'environnement et du .env.");
  const secret = variable("MAQUETTE_AGENT_SECRET");
  if (!secret) throw new ErreurSortie(1, "MAQUETTE_AGENT_SECRET absent du .env du workspace (même valeur que dans Vercel).");
  let r;
  try {
    r = await fetch(`${hub}${chemin}`, {
      method: methode,
      headers: { "content-type": "application/json", "x-kleak-secret": secret },
      body: corps === undefined ? undefined : JSON.stringify(corps),
      signal: AbortSignal.timeout(60000),
    });
  } catch (e) {
    throw new ErreurSortie(1, `Hub injoignable (${hub}) : ${e.cause?.code || e.cause?.message || e.message}`);
  }
  const texte = await r.text();
  let json = null;
  try {
    json = JSON.parse(texte);
  } catch {
    /* réponse non JSON */
  }
  return { status: r.status, json, texte };
}

/** Message d'un refus du hub, selon le tableau des codes de l'agent. */
export function messageRefus(r) {
  const detail = r.json?.error || r.texte.slice(0, 300);
  const sens = {
    400: "dépôt refusé, corriger puis relancer une fois",
    401: "secret refusé",
    404: "introuvable (compte, ou route pas encore déployée)",
    409: "conflit",
    500: "erreur du hub",
    503: "secret non configuré côté hub",
  }[r.status];
  return `Hub : code ${r.status}${sens ? ` (${sens})` : ""} : ${detail}`;
}

// ---------- règles du HTML déposé ----------

// Mêmes règles que le hub (src/lib/maquette-prospect/depot.ts) : à garder identiques.
export const NOM_FICHIER_VALIDE = /^[a-z0-9][a-z0-9._-]{0,80}\.(jpe?g|png|webp|svg)$/i;
const NOM_DOSSIER_VALIDE = /^[a-z0-9_-]+$/;
const IMAGE = /\.(jpe?g|png|webp|svg)$/i;

export function cheminRelatifValide(chemin) {
  const segments = chemin.split("/");
  if (segments.length === 1) return NOM_FICHIER_VALIDE.test(segments[0]);
  if (segments.length === 2) return NOM_DOSSIER_VALIDE.test(segments[0]) && NOM_FICHIER_VALIDE.test(segments[1]);
  return false;
}

function estLocale(ref) {
  return ref !== "" && !/^(https?:|\/\/|data:|#)/i.test(ref);
}

/** Copie de imagesReferencees du hub : chemins relatifs des images du HTML, sans doublon. */
export function imagesReferencees(html) {
  const motif = /\b(src|srcset|href)\s*=\s*(?:"([^"]*)"|'([^']*)')|url\(\s*(['"]?)([^'")]+)\4\s*\)/gi;
  const trouves = [];
  for (const m of html.matchAll(motif)) {
    const attribut = m[1]?.toLowerCase();
    const valeur = (m[2] ?? m[3] ?? m[5] ?? "").trim();
    if (attribut === "srcset") {
      if (/^data:/i.test(valeur)) continue;
      for (const candidat of valeur.split(",")) trouves.push(candidat.trim().split(/\s+/)[0] ?? "");
    } else if (attribut === "href") {
      if (IMAGE.test(valeur)) trouves.push(valeur);
    } else {
      trouves.push(valeur);
    }
  }
  return [...new Set(trouves.filter(estLocale))];
}

const POLICES_EXTERNES = /^https:\/\/fonts\.(googleapis|gstatic)\.com(\/|$)/i;
const BANDEAU = /Première piste proposée par Kleak Agency/;

/**
 * Contrôle statique de maquette/index.html (sans navigateur). Erreurs bloquantes et avertissements.
 * `dossierMaquette` : le dossier qui contient index.html et img/.
 */
export function verifierHtml(html, dossierMaquette) {
  const erreurs = [];
  const avertissements = [];
  const tete = html.slice(0, 400).toLowerCase();
  if (!tete.trimStart().startsWith("<!doctype html")) erreurs.push("Le fichier doit commencer par <!doctype html>.");
  if (!/<html[\s>]/i.test(html) || !/<head[\s>]/i.test(html)) erreurs.push("Document complet attendu : <html> et <head> (le hub y insère <base>).");

  // Images : exactement img/<nom>, présentes dans maquette/img/
  const images = imagesReferencees(html);
  for (const ref of images) {
    if (!/^img\/[^/]+$/.test(ref) || !cheminRelatifValide(ref)) {
      erreurs.push(`Référence interdite « ${ref} » : une image s'écrit img/<nom>.jpg|jpeg|png|webp|svg (minuscules, chiffres, - _ .), sans ./, sans ?v=, sans sous-dossier.`);
    } else if (!existsSync(join(dossierMaquette, ref))) {
      erreurs.push(`Image référencée absente : ${ref} (à copier dans maquette/img/).`);
    }
  }

  // Ressources : pas de fichier local autre qu'une image, rien d'externe sauf Google Fonts
  for (const m of html.matchAll(/<(script|link|iframe|video|audio|source|embed|object)\b[^>]*?\b(src|href|data)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const balise = m[1].toLowerCase();
    const valeur = (m[3] ?? m[4] ?? "").trim();
    if (/^data:/i.test(valeur)) continue;
    if (balise === "link" && IMAGE.test(valeur) && !/^(https?:)?\/\//i.test(valeur)) continue; // icône locale : comptée avec les images
    if (balise === "link" && POLICES_EXTERNES.test(valeur)) continue;
    if (balise === "source" && IMAGE.test(valeur.split(/\s+/)[0])) continue; // <source srcset> d'une <picture>
    erreurs.push(`<${balise}> vers « ${valeur} » : seuls les styles et scripts en ligne, les images de img/ et Google Fonts sont permis.`);
  }
  for (const m of html.matchAll(/@import\s+(?:url\()?\s*['"]?([^'")\s;]+)/gi)) {
    if (!POLICES_EXTERNES.test(m[1])) erreurs.push(`@import « ${m[1]} » : seul Google Fonts est permis.`);
  }
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc\s*=\s*["'](https?:\/\/[^"']+)/gi)) {
    erreurs.push(`Image externe « ${m[1]} » : télécharger l'image dans maquette/img/, jamais de lien vers le site du prospect.`);
  }
  for (const m of html.matchAll(/url\(\s*['"]?(https?:\/\/[^'")]+)/gi)) {
    if (!POLICES_EXTERNES.test(m[1])) erreurs.push(`Fond externe « ${m[1]} » : télécharger l'image dans maquette/img/.`);
  }

  // Page servie en bac à sable (CSP sandbox allow-scripts), sous <base href="/maquette/<jeton>/">
  const liens = [...html.matchAll(/<a\b[^>]*?\bhref\s*=\s*["']([^"']*)["']/gi)].map((m) => m[1]);
  if (liens.length) {
    erreurs.push(`${liens.length} lien(s) <a href> (${[...new Set(liens)].slice(0, 4).join(", ")}) : liens et boutons inactifs, <a> sans href ou <button type="button">. Un href="#…" ouvrirait une page vide à cause de <base>.`);
  }
  if (/\btarget\s*=\s*["']_blank/i.test(html)) erreurs.push('target="_blank" interdit (pas de fenêtre ni d\'onglet dans le bac à sable).');
  if (/<form\b/i.test(html)) erreurs.push("<form> interdit : un formulaire ne peut pas être envoyé depuis la maquette (champs seuls permis, hors <form>).");
  for (const [motif, nom] of [[/\blocalStorage\b/, "localStorage"], [/\bsessionStorage\b/, "sessionStorage"], [/\bdocument\.cookie\b/, "document.cookie"], [/\bindexedDB\b/, "indexedDB"], [/\bwindow\.open\s*\(/, "window.open"], [/\balert\s*\(/, "alert"]]) {
    if (motif.test(html)) erreurs.push(`${nom} interdit : la page tourne sans origine (bac à sable), l'appel lève une erreur.`);
  }

  // Règles de l'agence
  if (!BANDEAU.test(html)) erreurs.push("Bandeau absent : « Première piste proposée par Kleak Agency à <entreprise>. Textes et images issus de <domaine>. »");
  const texte = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ");
  if (/[—–]/.test(texte)) erreurs.push("Tiret long ou demi-cadratin dans le texte : le remplacer par une virgule ou un point.");
  if (/Instrument\s*Serif|Fraunces/i.test(html)) erreurs.push("Police interdite (Instrument Serif ou Fraunces) : choisir une autre famille.");
  if (/family=Inter\b|['"]Inter['"]/i.test(html)) avertissements.push("Inter détectée : jamais par défaut, seulement si c'est la police du prospect.");
  if (/<i\b|<em\b|font-style\s*:\s*italic/i.test(html)) avertissements.push("Italique présent : jamais en fin de titre.");
  if (/\b(backdrop-filter|filter\s*:\s*blur)/i.test(html)) avertissements.push("Flou ou verre détecté : verre et lueurs proscrits dans la maquette.");
  const octets = Buffer.byteLength(html);
  if (octets > 600 * 1024) avertissements.push(`index.html pèse ${Math.round(octets / 1024)} Ko : images en base64 ? Les mettre dans img/.`);
  return { erreurs, avertissements, images };
}

// ---------- navigateur ----------

export function playwright() {
  try {
    return require("playwright");
  } catch {
    throw new ErreurSortie(1, "Playwright absent de livrables/creas-meta/node_modules : rien n'est installé ici, le signaler à Edgar.");
  }
}

/** Chromium complet (WebGL), repli sur le headless léger sans WebGL. */
export async function lancerNavigateur() {
  const { chromium } = playwright();
  try {
    return await chromium.launch({ channel: "chromium" });
  } catch {
    return await chromium.launch({ args: ["--disable-3d-apis", "--disable-webgl"] });
  }
}

export const BUREAU = { width: 1440, height: 900 };
export const MOBILE = { width: 390, height: 844 };
export const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

export function optionsContexte(mobile) {
  return mobile
    ? { viewport: MOBILE, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: UA_MOBILE, locale: "fr-FR" }
    : { viewport: BUREAU, deviceScaleFactor: 1, locale: "fr-FR" };
}

/** Défile toute la page (chargements différés, apparitions au défilement), puis revient en haut. Exécuté dans la page. */
export async function defiler() {
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const pas = Math.max(300, Math.round(window.innerHeight * 0.7));
  for (let y = 0, i = 0; i < 150 && y < document.documentElement.scrollHeight; i++, y += pas) {
    window.scrollTo(0, y);
    await pause(120);
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await pause(600);
  window.scrollTo(0, 0);
  await pause(500);
}

/** Capture pleine page coupée à `hauteurMax`, en JPEG. */
export async function capturePleinePage(page, hauteurMax, qualite = 70) {
  const largeur = page.viewportSize().width;
  const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
  const h = Math.min(hauteur, hauteurMax);
  const image = await page.screenshot({ type: "jpeg", quality: qualite, fullPage: true, clip: { x: 0, y: 0, width: largeur, height: h }, timeout: 60000 });
  return { image, hauteur, coupee: hauteur > hauteurMax };
}

export function slug(texte) {
  return (texte || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/, "");
}

export function domaineDe(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Dossier d'un prospect : slug de l'entreprise (sinon du nom, sinon du domaine du site), suffixé par l'id si un autre compte l'occupe déjà. */
export function dossierProspect(compte, prefixe = "") {
  let dossier = join(DOSSIER_PROSPECTS, prefixe + (slug(compte.entreprise || compte.nom) || slug(domaineDe(compte.site_url) || "")));
  const fichier = join(dossier, "compte.json");
  if (compte.id && existsSync(fichier)) {
    const ancien = JSON.parse(readFileSync(fichier, "utf8"));
    if (ancien.compte?.id && ancien.compte.id !== compte.id) dossier = `${dossier}-${compte.id.slice(0, 8)}`;
  }
  return dossier;
}
