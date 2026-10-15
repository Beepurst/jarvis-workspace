// ---------------------------------------------------------------------------
// sourcing/fetch-candidates.mjs — TEMPS 1 du sourcing photo : ratisser large,
// en ne téléchargeant que des VIGNETTES.
//
//   node sourcing/fetch-candidates.mjs "lot-nom" "requête 1" "requête 2" ...
//
// Le sourcing est le vrai coût d'une créative photo, pas le texte. Un premier
// ratissage vidéo sur le projet précédent a téléchargé 3,7 Go pour retenir 5
// clips. On ne refait pas ça : ici, vignettes seulement (~20 ko pièce), et la
// pleine résolution ne descend qu'en TEMPS 2, pour les 5 ou 6 retenus
// (fetch-full.mjs).
//
// COMMENT ÉCRIRE LES REQUÊTES : décrire une AMBIANCE, jamais l'activité du
// sujet. Chercher une photo qui "illustre le marketing" ramène exactement la
// banque d'images qu'on veut éviter. Chercher "morning light kitchen linen"
// ramène de la matière.
//
// Le classement par écart-type de luminance ÉLIMINE les 80 % inutilisables, il
// ne CHOISIT pas. Le choix se fait à l'œil, sur la planche, et se confirme au
// rendu avec le texte par-dessus : deux candidats parfaits en vignette
// perdaient complètement le titre dans leurs hautes lumières.
//
// Licence : Pexels autorise l'usage commercial sans attribution obligatoire.
// L'attribution reste due si la source l'exige pour une photo donnée, et le
// champ `photographe` est conservé dans l'index pour cette raison.
// ---------------------------------------------------------------------------
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLE = process.env.PEXELS_API_KEY;
if (!CLE) {
  console.error(`
  ECHEC : PEXELS_API_KEY absente.

  1. Créer une clé sur https://www.pexels.com/api/ (gratuit, 200 requêtes/heure)
  2. L'ajouter dans le .env du workspace :  PEXELS_API_KEY=xxxxx
  3. Relancer avec la clé chargée :        set -a && source ../../../.env && set +a
`);
  process.exit(1);
}

const [lot, ...requetes] = process.argv.slice(2);
if (!lot || requetes.length === 0) {
  console.error(`  Usage : node fetch-candidates.mjs "<lot>" "<requête 1>" "<requête 2>" ...\n` +
                `  Viser 8 à 10 requêtes pour 200 à 400 candidats.`);
  process.exit(1);
}

// Où tombera le texte dans la composition. C'est LA bande qu'on mesure : une
// photo peut être magnifique et rendre le titre illisible sur ce tiers-là.
const BANDES = { haut: [0.05, 0.38], centre: [0.33, 0.66], bas: [0.55, 0.92] };
const nomBande = process.env.BANDE_TEXTE ?? 'bas';
const bande = BANDES[nomBande] ?? BANDES.bas;

const DIR = join(__dirname, '_candidats', lot);
mkdirSync(DIR, { recursive: true });

// --- Ratissage -------------------------------------------------------------
const PAR_REQUETE = 40; // 8 à 10 requêtes -> 320 à 400 candidats
const candidats = [];
const vus = new Set();

for (const q of requetes) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}` +
              `&per_page=${PAR_REQUETE}&orientation=portrait&size=large`;
  const rep = await fetch(url, { headers: { Authorization: CLE } });
  if (!rep.ok) {
    console.error(`\n  ECHEC : Pexels a répondu ${rep.status} sur "${q}".\n` +
                  `  ${rep.status === 401 ? 'Clé invalide.' : rep.status === 429 ? 'Quota horaire dépassé, réessayer plus tard.' : await rep.text()}\n`);
    process.exit(1);
  }
  const { photos = [] } = await rep.json();
  for (const p of photos) {
    if (vus.has(p.id)) continue; // les requêtes se recoupent, on ne compte pas deux fois
    vus.add(p.id);
    candidats.push({
      id: p.id, requete: q, photographe: p.photographer, page: p.url,
      vignette: p.src.small,       // ~130 px de large, tout ce qu'il faut pour mesurer et trier
      pleine: p.src.original,      // n'est PAS téléchargée ici
      w: p.width, h: p.height,
    });
  }
  console.log(`  "${q}" -> ${photos.length} résultats`);
}

if (candidats.length === 0) {
  console.error(`\n  ECHEC : aucun candidat sur ${requetes.length} requête(s).\n` +
                `  Des requêtes trop précises ne ramènent rien : décrire une ambiance, pas une activité.\n`);
  process.exit(1);
}
console.log(`\n  ${candidats.length} candidats uniques.`);

// --- Mesure et classement --------------------------------------------------
// L'écart-type de luminance dans la bande de texte : plus il est bas, plus la
// zone est unie, donc plus un titre y tiendra. On mesure aussi la luminance
// moyenne, parce qu'une zone unie MAIS très claire mange un texte blanc.
const navigateur = await chromium.launch();
const page = await navigateur.newPage();
const mesures = await page.evaluate(async ({ liste, bande }) => {
  const out = [];
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  for (const c of liste) {
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = c.vignette;
      });
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const y0 = Math.floor(cv.height * bande[0]);
      const y1 = Math.floor(cv.height * bande[1]);
      const d = ctx.getImageData(0, y0, cv.width, Math.max(1, y1 - y0)).data;
      let somme = 0, somme2 = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) {
        const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        somme += l; somme2 += l * l; n++;
      }
      const moy = somme / n;
      out.push({ id: c.id, ecartType: Math.sqrt(somme2 / n - moy * moy), luminance: moy });
    } catch {
      out.push({ id: c.id, ecartType: null, luminance: null }); // vignette non chargée : signalée, pas masquée
    }
  }
  return out;
}, { liste: candidats, bande });
await navigateur.close();

const parId = new Map(mesures.map((m) => [m.id, m]));
for (const c of candidats) Object.assign(c, parId.get(c.id));

const echecsMesure = candidats.filter((c) => c.ecartType === null).length;
if (echecsMesure === candidats.length) {
  console.error(`\n  ECHEC : aucune vignette n'a pu être mesurée (${echecsMesure}).\n` +
                `  Sans mesure, le classement affiché serait l'ordre de l'API et non un tri.\n`);
  process.exit(1);
}
if (echecsMesure) console.log(`  ${echecsMesure} vignette(s) non mesurée(s), classées en fin de planche.`);

// Tri : zone la plus unie d'abord, les non mesurées à la fin.
candidats.sort((a, b) => (a.ecartType ?? 1e9) - (b.ecartType ?? 1e9));

// --- Planche contact -------------------------------------------------------
const COLS = 8, VIG = 150;
const cartes = candidats.map((c, i) => `
  <figure>
    <img src="${c.vignette}" loading="eager">
    <figcaption>${i + 1}. <b>${c.id}</b><span>σ ${c.ecartType === null ? '—' : c.ecartType.toFixed(1)} · L ${c.luminance === null ? '—' : c.luminance.toFixed(0)}</span></figcaption>
  </figure>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${COLS * (VIG + 14) + 40}px; background:#3a3a40; padding:20px;
         font-family:-apple-system,BlinkMacSystemFont,sans-serif; color:#fff; }
  h1 { font-size:17px; margin-bottom:4px; }
  p { font-size:12px; color:#dcdce0; margin-bottom:16px; }
  .g { display:grid; grid-template-columns:repeat(${COLS}, ${VIG}px); gap:14px; }
  img { width:${VIG}px; height:${Math.round(VIG * 1.4)}px; object-fit:cover; display:block; border-radius:3px; }
  figcaption { font-size:9px; margin-top:3px; line-height:1.3; }
  figcaption span { display:block; color:#c0c0c6; font-variant-numeric:tabular-nums; }
</style></head><body>
  <h1>${lot} — ${candidats.length} candidats, triés par uniformité de la bande « ${nomBande} »</h1>
  <p>La mesure élimine, elle ne choisit pas. Retenir 5 ou 6 identifiants, puis : node sourcing/fetch-full.mjs "${lot}" &lt;id&gt; &lt;id&gt; ...</p>
  <div class="g">${cartes}</div>
</body></html>`;

const fichierHtml = join(DIR, 'planche-contact.html');
writeFileSync(fichierHtml, html);

// Les vignettes sont chargées depuis le réseau ici, à la différence des
// créatives : ce sont des URL Pexels distantes qu'on ne veut pas rapatrier.
// C'est la seule étape de la chaîne qui dépend du réseau, et elle est jetable.
const nav2 = await chromium.launch();
const p2 = await nav2.newPage({ viewport: { width: COLS * (VIG + 14) + 40, height: 400 }, deviceScaleFactor: 1 });
await p2.goto(`file://${fichierHtml}`);
await p2.waitForLoadState('networkidle');
await p2.waitForTimeout(600);
const planche = join(DIR, 'planche-contact.png');
await p2.screenshot({ path: planche, fullPage: true });
await nav2.close();

writeFileSync(join(DIR, 'index.json'), JSON.stringify({ lot, requetes, bande: nomBande, candidats }, null, 2));

if (!existsSync(planche)) {
  console.error(`\n  ECHEC : la planche n'a pas été écrite.\n`);
  process.exit(1);
}
console.log(`\n  -> ${planche}`);
console.log(`  -> ${join(DIR, 'index.json')}`);
console.log(`\n  Choisir à l'œil sur la planche, puis TEMPS 2 :`);
console.log(`  node sourcing/fetch-full.mjs "${lot}" <id> <id> <id>`);
