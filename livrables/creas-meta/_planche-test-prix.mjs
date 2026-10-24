// Planche du test « prix affiché ou non » : une ligne par créa, version P (avec prix)
// et version S (sans prix) côte à côte, à 420 px (taille réelle dans le fil).
//   node _planche-test-prix.mjs o p q   -> _planche-test-prix.png
// Échoue si une image manque : une planche vide se lit comme un succès.
import { readdirSync, readFileSync } from 'fs';
import { chromium } from 'playwright';
const ids = process.argv.slice(2);
if (!ids.length) { console.error('Usage : node _planche-test-prix.mjs <id> [<id>…]'); process.exit(1); }
const dir = new URL('./rendus/post/', import.meta.url).pathname;
const files = readdirSync(dir);
const trouve = (id, v) => files.find((f) => f.startsWith(`${id}-`) && f.endsWith(`-${v}-post.png`));
const lignes = ids.map((id) => {
  const p = trouve(id, 'p'), s = trouve(id, 's');
  if (!p || !s) { console.error(`Version P ou S manquante pour ${id}.`); process.exit(1); }
  return [id, p, s];
});
const src = (f) => `data:image/png;base64,${readFileSync(dir + f).toString('base64')}`;
const cel = (f, t) => `<div><div style="font:600 15px system-ui;color:#333;margin-bottom:8px">${t} · ${f.replace('-post.png', '')}</div><img src="${src(f)}" style="width:420px;display:block"></div>`;
const html = `<body style="margin:0;padding:24px;background:#fff;display:flex;flex-direction:column;gap:32px">${lignes
  .map(([, p, s]) => `<div style="display:flex;gap:40px">${cel(p, 'Avec prix (P)')}${cel(s, 'Sans prix (S)')}</div>`).join('')}</body>`;
const b = await chromium.launch({ channel: 'chromium' });
const pg = await b.newPage({ viewport: { width: 928, height: 400 } });
await pg.setContent(html);
await pg.waitForTimeout(500);
const charges = await pg.$$eval('img', (imgs) => imgs.filter((i) => i.naturalWidth > 0).length);
if (charges !== lignes.length * 2) { console.error(`${charges}/${lignes.length * 2} images chargées.`); process.exit(1); }
await pg.screenshot({ path: '_planche-test-prix.png', fullPage: true });
await b.close();
console.log(lignes.length * 2, 'posts sur la planche du test prix');
