// Captures des sites montrés dans les créas. Relancer si le site ou la démo change.
import { chromium } from 'playwright';
const shots = [
  { name: 'kleak-desktop', url: 'https://kleakagency.fr', w: 1440, h: 900 },
  { name: 'kleak-mobile', url: 'https://kleakagency.fr', w: 390, h: 844 },
  { name: 'demo-v2-desktop', url: 'https://massive-account-916652.framer.app/atelier-hauteville-v2', w: 1440, h: 900 },
  { name: 'demo-v2-mobile', url: 'https://massive-account-916652.framer.app/atelier-hauteville-v2', w: 390, h: 844 },
  { name: 'demo-v1-desktop', url: 'https://massive-account-916652.framer.app/atelier-hauteville', w: 1440, h: 900 },
  { name: 'demo-v1-mobile', url: 'https://massive-account-916652.framer.app/atelier-hauteville', w: 390, h: 844 },
];
const b = await chromium.launch({ channel: 'chromium' });
let n = 0;
for (const s of shots) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  await p.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2500);
  // Le badge « Made in Framer », le crayon d'édition et le bandeau cookies ne font pas partie du site livré.
  await p.addStyleTag({ content: '#__framer-badge-container,#__framer-editorbar,#__framer-editorbar-button,[id^="__framer-editorbar"]{display:none!important}' });
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('div,section,aside')) {
      if (el.innerText && el.innerText.startsWith('Paramètres Cookies')) el.remove();
    }
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `_captures/${s.name}.png` });
  await p.close(); n++; console.log(s.name);
}
await b.close();
if (n !== shots.length) { console.error(`${n}/${shots.length}`); process.exit(1); }
console.log(n, 'captures');
