// Contrôle : la zone de sécurité des stories. En diffusion, les 250 px du bas (en 1080x1920)
// sont recouverts par le bouton de Meta et le nom du compte ; aucun texte ne descend sous la
// ligne des 400 px. Ce script dessine les deux repères par-dessus chaque story rendue. Il
// vérifie, il ne corrige pas : c'est à l'œil, sur la planche, qu'on juge si un texte déborde.
// Échoue si aucune story n'existe ou si une image n'est pas chargée.
import { readdirSync, readFileSync, existsSync } from 'fs';
import { chromium } from 'playwright';
const dir = new URL('./rendus/story/', import.meta.url).pathname;
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.png')) : [];
if (!files.length) { console.error('Aucune story à contrôler.'); process.exit(1); }
const src = (f) => `data:image/png;base64,${readFileSync(dir + f).toString('base64')}`;
// Affichage à 360 px de large : 1920 px de haut deviennent 640, soit un facteur 1/3.
const W = 360, H = 640, k = W / 1080;
const carte = (f) => `
  <div style="position:relative;width:${W}px;height:${H}px;">
    <img src="${src(f)}" style="width:${W}px;height:${H}px;display:block">
    <div style="position:absolute;left:0;right:0;bottom:0;height:${250 * k}px;background:rgba(255,0,0,.35)"></div>
    <div style="position:absolute;left:0;right:0;bottom:${400 * k}px;border-top:2px dashed #ff0"></div>
    <div style="font:12px sans-serif;margin-top:6px">${f}</div>
  </div>`;
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: (W + 30) * files.length + 20, height: H + 60 } });
await p.setContent(`<body style="margin:0;display:flex;gap:30px;padding:20px;background:#fff">${files.map(carte).join('')}</body>`);
await p.waitForTimeout(500);
const charges = await p.$$eval('img', (imgs) => imgs.filter((i) => i.naturalWidth > 0).length);
if (charges !== files.length) { console.error(`${charges}/${files.length} images chargées.`); process.exit(1); }
await p.screenshot({ path: '_planche-story.png' });
await b.close();
console.log(files.length, 'stories sur la planche');
