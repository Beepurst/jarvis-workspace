import { chromium } from '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/node_modules/playwright/index.mjs';
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('https://kleakagency.fr', { waitUntil: 'networkidle', timeout: 60000 });
const r = await p.evaluate(() => {
  const out = [];
  for (const n of ['Méliné', 'Laura', 'Aurore']) {
    const el = [...document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span')].find(e => e.innerText && e.innerText.trim().startsWith(n));
    if (!el) { out.push(n + ' ?'); continue; }
    let c = el; for (let i = 0; i < 8 && c.parentElement; i++) { c = c.parentElement; if (c.innerText.length > 80) break; }
    const cs = getComputedStyle(c);
    out.push({ n, texte: c.innerText, bg: cs.backgroundImage + ' ' + cs.backgroundColor, radius: cs.borderRadius, border: cs.border, imgs: [...c.querySelectorAll('img')].map(i => i.src), fonts: getComputedStyle(el).fontFamily });
  }
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
