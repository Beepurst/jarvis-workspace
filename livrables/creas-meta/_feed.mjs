// Contrôle : les posts à 420 px de large, la taille réelle d'un post dans le fil.
// Échoue si une image n'est pas chargée : une planche vide se lit comme un succès.
import { readdirSync, readFileSync } from 'fs';
import { chromium } from 'playwright';
const dir = new URL('./rendus/post/', import.meta.url).pathname;
const files = readdirSync(dir).filter((f) => f.endsWith('.png'));
if (!files.length) { console.error('Aucun post à contrôler.'); process.exit(1); }
const src = (f) => `data:image/png;base64,${readFileSync(dir + f).toString('base64')}`;
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 460 * files.length, height: 565 } });
await p.setContent(`<body style="margin:0;display:flex;gap:40px;padding:20px;background:#fff">${files.map((f) => `<img src="${src(f)}" style="width:420px">`).join('')}</body>`);
await p.waitForTimeout(500);
const charges = await p.$$eval('img', (imgs) => imgs.filter((i) => i.naturalWidth > 0).length);
if (charges !== files.length) { console.error(`${charges}/${files.length} images chargées.`); process.exit(1); }
await p.screenshot({ path: '_planche-feed.png' });
await b.close();
console.log(files.length, 'posts sur la planche');
