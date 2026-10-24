// Planche en lignes : un argument par ligne, noms de base séparés par des virgules,
// à 420 px (taille réelle dans le fil).
//   node _planche-lignes.mjs o-site-captivant-s,o-site-captivant-s-v2 r-a,r-b  -> _planche-lignes.png
// Échoue si un post manque ou si une image n'est pas chargée.
import { existsSync, readFileSync } from 'fs';
import { chromium } from 'playwright';
const lignes = process.argv.slice(2).map((a) => a.split(','));
if (!lignes.length) { console.error('Usage : node _planche-lignes.mjs a,b,c d,e,f'); process.exit(1); }
const dir = new URL('./rendus/post/', import.meta.url).pathname;
for (const f of lignes.flat()) if (!existsSync(`${dir}${f}-post.png`)) { console.error(`Post manquant : ${f}`); process.exit(1); }
const src = (f) => `data:image/png;base64,${readFileSync(`${dir}${f}-post.png`).toString('base64')}`;
const cel = (f) => `<div><div style="font:600 15px system-ui;color:#333;margin-bottom:8px">${f}</div><img src="${src(f)}" style="width:420px;display:block"></div>`;
const html = `<body style="margin:0;padding:24px;background:#fff;display:flex;flex-direction:column;gap:32px">${lignes
  .map((l) => `<div style="display:flex;gap:40px">${l.map(cel).join('')}</div>`).join('')}</body>`;
const n = lignes.flat().length;
const b = await chromium.launch({ channel: 'chromium' });
const pg = await b.newPage({ viewport: { width: 48 + Math.max(...lignes.map((l) => l.length)) * 460 - 40, height: 400 } });
await pg.setContent(html);
await pg.waitForTimeout(500);
const charges = await pg.$$eval('img', (imgs) => imgs.filter((i) => i.naturalWidth > 0).length);
if (charges !== n) { console.error(`${charges}/${n} images chargées.`); process.exit(1); }
await pg.screenshot({ path: '_planche-lignes.png', fullPage: true });
await b.close();
console.log(n, 'posts sur la planche en lignes');
