import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_DIR = join(__dirname, 'html');
mkdirSync(HTML_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Créas Meta Kleak Agency, premiers essais (18/10/2026)
//
// D'OÙ ÇA VIENT : les anciennes pubs Kleak (accroche capitale italique + cartouche
// blanc, bleu électrique, K en haut, maquette d'appareil) et la méthode Orbikal
// (HTML rendu en PNG, accroches multiples, contrôle à 420 px).
// CE QU'ON ÉCARTE des anciennes pubs : « 49 €/mois » (ne correspond plus à l'offre),
// « N°1 des agences Framer » et « +50 % de clients » (invérifiables), les boutons
// dessinés dans l'image (le bouton est celui de Meta).
// CE QU'ON GARDE : les avis clients et la note Google 4,8/5, réels (confirmé par
// Edgar le 18/10).
// RÈGLE : tout ce qui est promis dans l'image doit être dans la fiche offre
// (livrables/offre/fiche-offre.md) le jour de la diffusion.
//
//   node build.mjs          -> toutes les créas, post seul
//   node build.mjs a        -> une créa, post et story
//   node _feed.mjs          -> contrôle de lisibilité à 420 px
// ---------------------------------------------------------------------------

const FONTS = `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const b64 = (f) => readFileSync(join(__dirname, f)).toString('base64');
const IMG = (f) => `data:image/png;base64,${b64(f)}`;
const LOGO = IMG('assets/k-blanc.png');
const DEMO_MOBILE = IMG('_captures/demo-v1-mobile.png');
const DEMO_DESKTOP = IMG('_captures/demo-v2-desktop.png');

// Couleurs relevées sur kleakagency.fr (styles Framer du site), pas choisies ici.
const T = {
  bleu: '#0F2FD1',      // boutons du site
  bleuNuit: '#050B7A',
  marine: '#090C3B',
  ciel: '#3DA8FF',
  blanc: '#FFFFFF',
  noir: '#0A0A0A',
};

// L'accroche capitale des anciennes pubs n'est pas une police du site. Anton
// penché est la plus proche disponible sans licence.
const HOOK = `font-family:'Anton',sans-serif; text-transform:uppercase; transform:skewX(-9deg); letter-spacing:.005em;`;

const FORMATS = [
  { key: 'post', W: 1080, H: 1350 },
  { key: 'story', W: 1080, H: 1920 },
];

const icone = (size) => `
  <div style="width:${size}px;height:${size}px;border-radius:${size * 0.24}px;
    background:linear-gradient(160deg,#2F6BFF 0%,${T.bleu} 100%);
    box-shadow:0 10px 30px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.35);
    display:flex;align-items:center;justify-content:center;">
    <img src="${LOGO}" style="width:${size * 0.5}px;">
  </div>`;

const telephone = (w, src) => `
  <div style="width:${w}px;aspect-ratio:390/844;border-radius:${w * 0.15}px;background:#111;
    padding:${w * 0.035}px;box-shadow:0 40px 80px rgba(0,0,0,.45), 0 0 0 2px #3a3a3a, inset 0 0 0 2px #000;">
    <div style="width:100%;height:100%;border-radius:${w * 0.12}px;overflow:hidden;position:relative;
      background:#1d1a17;">
      <div style="position:absolute;left:0;right:0;bottom:0;top:${w * 0.13}px;background:url(${src}) top center / cover no-repeat;"></div>
      <div style="position:absolute;top:${w * 0.03}px;left:50%;transform:translateX(-50%);
        width:${w * 0.3}px;height:${w * 0.085}px;border-radius:99px;background:#000;"></div>
    </div>
  </div>`;

const ordinateur = (w, src) => `
  <div style="width:${w}px;">
    <div style="border-radius:${w * 0.025}px ${w * 0.025}px 0 0;background:#111;padding:${w * 0.018}px;
      box-shadow:0 30px 70px rgba(0,0,0,.4), 0 0 0 2px #3a3a3a;">
      <div style="aspect-ratio:1440/900;background:url(${src}) top center / cover no-repeat;border-radius:4px;"></div>
    </div>
    <div style="height:${w * 0.03}px;margin:0 -${w * 0.06}px;border-radius:0 0 ${w * 0.03}px ${w * 0.03}px;
      background:linear-gradient(#d9dbe0,#9a9ca3);"></div>
  </div>`;

const etoiles = (px) => `<span style="color:#FFC531;letter-spacing:.06em;font-size:${px}px;">★★★★★</span>`;

// ---------------------------------------------------------------------------
// LES CRÉAS
// ---------------------------------------------------------------------------
const CREAS = {
  // A. L'accroche de marque, reprise de l'ancienne Kleak, avec un vrai site
  // construit par l'agence dans le téléphone (la démo affiche elle-même
  // « entreprise fictive » en haut de l'écran).
  a: {
    key: 'a-un-kleak',
    html: (fmt) => {
      const story = fmt.key === 'story';
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(900px 700px at 85% 35%, rgba(61,168,255,.35), transparent 60%),
        linear-gradient(165deg, ${T.bleu} 0%, ${T.bleuNuit} 100%);"></div>
      <div style="position:absolute;top:${story ? 150 : 70}px;left:50%;transform:translateX(-50%);">${icone(story ? 104 : 96)}</div>

      <div style="position:absolute;left:70px;top:${story ? 330 : 220}px;">
        <div style="${HOOK} color:#fff;font-size:${story ? 168 : 150}px;line-height:.98;">Un<br>site web<br>en un</div>
        <div style="display:inline-block;margin-top:${story ? 18 : 14}px;margin-left:-8px;background:#fff;border-radius:22px;
          padding:${story ? '6px 34px 2px' : '4px 30px 0'};box-shadow:10px 12px 0 #000;transform:rotate(-3deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${story ? 182 : 162}px;line-height:1.05;">Kleak</div>
        </div>
      </div>

      <div style="position:absolute;right:${story ? 70 : 60}px;top:${story ? 520 : 230}px;transform:rotate(6deg);">
        ${telephone(story ? 330 : 330, DEMO_MOBILE)}
      </div>

      <div style="position:absolute;left:70px;right:70px;top:${story ? 1260 : 1000}px;color:#fff;
        font-family:Manrope;font-size:${story ? 44 : 42}px;line-height:1.3;font-weight:500;">
        Votre site vitrine, conçu et mis en ligne<br>par <b style="font-weight:800">une agence qui s'occupe de tout</b>
      </div>
      <div style="position:absolute;left:70px;top:${story ? 1420 : 1160}px;display:flex;align-items:center;gap:18px;
        font-family:Manrope;color:#fff;font-size:${story ? 34 : 32}px;font-weight:600;">
        ${etoiles(story ? 36 : 34)}<span>4,8/5 sur Google</span>
      </div>`;
    },
  },

  // B. L'offre telle qu'elle est vendue : prix fixe, délai, 3 pages, et un avis
  // client réel. L'astérisque renvoie à la condition de démarrage du délai,
  // recopiée de la fiche offre.
  b: {
    key: 'b-7-jours-999',
    html: (fmt) => {
      const story = fmt.key === 'story';
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(1000px 600px at 50% 105%, rgba(61,168,255,.30), transparent 60%),
        linear-gradient(180deg, ${T.marine} 0%, ${T.noir} 100%);"></div>
      <div style="position:absolute;top:${story ? 150 : 70}px;left:50%;transform:translateX(-50%);">${icone(story ? 104 : 96)}</div>

      <div style="position:absolute;left:0;right:0;top:${story ? 320 : 215}px;text-align:center;">
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;">Votre site vitrine</div>
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;margin-top:6px;">en 7 jours<sup style="font-size:.4em;vertical-align:1.1em;">*</sup></div>
        <div style="display:inline-block;margin-top:26px;background:#fff;border-radius:22px;padding:4px 34px 0;
          box-shadow:10px 12px 0 ${T.bleu};transform:rotate(-2deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${story ? 120 : 108}px;line-height:1.08;">dès 999 €</div>
        </div>
        <div style="font-family:Manrope;color:rgba(255,255,255,.8);font-size:${story ? 36 : 34}px;font-weight:500;margin-top:28px;">
          Prix fixe · 3 pages · mentions légales et RGPD inclus
        </div>
      </div>

      <div style="position:absolute;left:50%;top:${story ? 900 : 760}px;transform:translateX(-50%);">
        ${ordinateur(story ? 820 : 760, DEMO_DESKTOP)}
      </div>

      <div style="position:absolute;right:50px;top:${story ? 1200 : 1000}px;width:${story ? 560 : 520}px;
        background:#fff;border-radius:26px;padding:28px 32px;
        box-shadow:0 25px 60px rgba(0,0,0,.45);font-family:Manrope;color:#141414;transform:rotate(-2deg);">
        ${etoiles(30)}
        <div style="font-size:${story ? 29 : 27}px;line-height:1.35;font-weight:500;margin:12px 0 14px;">
          « Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci »
        </div>
        <div style="font-size:22px;font-weight:700;">Laura Dias <span style="font-weight:500;color:#666">· Mega Content</span></div>
      </div>

      <div style="position:absolute;left:50px;bottom:${story ? 420 : 34}px;font-family:Manrope;color:rgba(255,255,255,.55);
        font-size:20px;font-weight:500;">* 7 jours ouvrés après réception de vos contenus et de l'acompte. Formule Essentiel.</div>`;
    },
  },
};

function page(fmt, crea) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${fmt.W}px; height:${fmt.H}px; position:relative; overflow:hidden; background:${T.noir}; }
  </style></head><body>${crea.html(fmt)}</body></html>`;
}

// --- Rendu -----------------------------------------------------------------
const arg = process.argv[2];
if (arg && !CREAS[arg]) {
  console.error(`Créa inconnue : ${arg}. Attendu : ${Object.keys(CREAS).join(' | ')}`);
  process.exit(1);
}
const choix = arg ? [CREAS[arg]] : Object.values(CREAS);
// Tant que la créa n'est pas validée, on ne rend que le post.
const formats = arg ? FORMATS : FORMATS.filter((f) => f.key === 'post');

const browser = await chromium.launch({ channel: 'chromium' });
let ecrits = 0;
for (const crea of choix) {
  for (const fmt of formats) {
    const dest = join(__dirname, 'rendus', fmt.key);
    mkdirSync(dest, { recursive: true });
    const base = `${crea.key}-${fmt.key}`;
    const file = join(HTML_DIR, `${base}.html`);
    writeFileSync(file, page(fmt, crea));
    const p = await browser.newPage({ viewport: { width: fmt.W, height: fmt.H }, deviceScaleFactor: 2 });
    await p.goto(`file://${file}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(450);
    await p.screenshot({ path: join(dest, `${base}.png`) });
    await p.close();
    ecrits++;
  }
}
await browser.close();
const attendu = choix.length * formats.length;
if (ecrits !== attendu) { console.error(`${ecrits} fichiers écrits sur ${attendu} attendus.`); process.exit(1); }
console.log(`${ecrits} fichiers écrits.`);
