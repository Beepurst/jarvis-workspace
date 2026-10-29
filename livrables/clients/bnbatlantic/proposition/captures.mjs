// Captures du site actuel et de la maquette pour la proposition (playwright de livrables/creas-meta).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const ICI = dirname(fileURLToPath(import.meta.url));
const IMG = join(ICI, 'img');
const { chromium } = createRequire(join(ICI, '../../../creas-meta/package.json'))('playwright');
const MAQ = 'file://' + join(ICI, '../maquette/index.html');
const b = await chromium.launch({ channel: 'chromium' });
async function page(url, w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2500);
  const refuser = p.getByRole('button', { name: 'Refuser' });
  if (await refuser.count()) { await refuser.first().click(); await p.waitForTimeout(800); }
  return p;
}
// Site actuel
let p = await page('https://bnbatlantic.com/', 1440, 900);
await p.screenshot({ path: join(IMG, 'actuel-accueil.jpg'), quality: 82 }); await p.close();
p = await page('https://bnbatlantic.com/publier-hebergement-gratuit/', 390, 844);
await p.screenshot({ path: join(IMG, 'actuel-inscription-mobile.jpg'), quality: 82, fullPage: false }); await p.close();
// Maquette
p = await page(MAQ, 1440, 720);
await p.addStyleTag({ content: '.maquette{display:none!important}' });
await p.screenshot({ path: join(IMG, 'maq-accroche.jpg'), quality: 82 });
await p.setViewportSize({ width: 1440, height: 900 });
for (const sel of ['#avantages', '#calcul', '#tarifs', '#inscription']) {
  const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(6500);
  await p.evaluate(() => document.querySelector('nav')?.style.setProperty('display', 'none'));
  await el.screenshot({ path: join(IMG, 'maq-' + sel.slice(1) + '.jpg'), quality: 82 });
}
await p.close();
p = await page(MAQ, 390, 844);
await p.addStyleTag({ content: '.maquette{display:none!important}' });
await p.screenshot({ path: join(IMG, 'maq-mobile.jpg'), quality: 82 }); await p.close();
await b.close();
