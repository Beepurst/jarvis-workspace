// Captures de sections d'une réalisation, pour les carrousels de réalisation (s8, demande d'Edgar du 28/10).
// Les captures plein écran (accueil bureau et mobile) restent faites par livrables/creas-meta/_capture.mjs.
//
//   node _capture-sections.mjs                 toutes les sections
//   node _capture-sections.mjs frenchies-faq   seulement celles nommées
//
// Les prix sont retirés de la page avant la capture : aucun prix dans les posts.
import { chromium } from '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/node_modules/playwright/index.mjs';

const SORTIE = '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/_captures/';

// Chaque section : page, largeur, et la zone à capturer, calculée dans la page à partir de repères de texte.
const SECTIONS = [
  // Les deux cartes de séjour, du titre à la liste des activités.
  { name: 'frenchies-sejours', url: 'https://www.frenchiesinmaldives.com/', w: 1440,
    zone: () => { const a = trouver(/^Séjour 7 jours/); const b = trouver(/^Séjour 10 jours/); return { x: a.left - 60, y: a.top - 40, w: b.right - a.left + 120, h: 560 }; } },
  // Bas de la carte 7 jours sur téléphone, avec le bouton Réserver.
  { name: 'frenchies-reserver-mobile', url: 'https://www.frenchiesinmaldives.com/', w: 390,
    zone: () => { const r = trouver(/^Réserver !$/); return { x: 0, y: r.bottom - 330, w: 390, h: 380 }; } },
  // Début de la FAQ sur ordinateur.
  { name: 'frenchies-faq', url: 'https://www.frenchiesinmaldives.com/', w: 1440,
    zone: () => { const r = trouver(/^faq$/i); return { x: r.left - 20, y: r.top - 40, w: 1440 - 2 * (r.left - 20), h: 620 }; } },
];

const filtre = process.argv.slice(2);
const choix = filtre.length ? SECTIONS.filter((s) => filtre.includes(s.name)) : SECTIONS;
const b = await chromium.launch({ channel: 'chromium' });
let n = 0;
for (const s of choix) {
  const p = await b.newPage({ viewport: { width: s.w, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
  // Défilement complet pour déclencher les apparitions et les images paresseuses.
  const hauteur = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < hauteur; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(250); }
  await p.addStyleTag({ content: '#__framer-badge-container,#__framer-editorbar,#__framer-editorbar-button,[id^="__framer-editorbar"]{display:none!important}' });
  await p.evaluate(() => {
    // Bandeau cookies (bloc fixe qui le porte).
    for (const el of document.querySelectorAll('div,section,aside')) {
      if (!el.isConnected || !/^Paramètres (des )?Cookies/i.test((el.innerText || '').trim())) continue;
      let cible = el;
      for (let a = el; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') { cible = a; break; }
      cible.remove();
    }
    // Prix : retirés.
    for (const el of document.querySelectorAll('body *')) {
      if (!el.children.length && /€/.test(el.innerText || '') && (el.innerText || '').trim().length < 20) el.style.display = 'none';
    }
  });
  await p.waitForTimeout(800);
  const zone = await p.evaluate(`(() => {
    const trouver = (re) => { for (const el of document.querySelectorAll('body *')) { if (!el.children.length && re.test((el.innerText || '').trim())) { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY }; } } throw new Error('repère introuvable ' + re); };
    return (${s.zone.toString()})();
  })()`);
  // Les éléments fixes (menu) ne doivent pas se poser sur la section.
  await p.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const st = getComputedStyle(el); if (st.position === 'fixed' || st.position === 'sticky') el.style.visibility = 'hidden'; } });
  await p.screenshot({ path: `${SORTIE}${s.name}.png`, fullPage: true, clip: { x: Math.max(0, zone.x), y: Math.max(0, zone.y), width: zone.w, height: zone.h } });
  await p.close(); n++; console.log(s.name);
}
await b.close();
if (n !== choix.length) process.exit(1);
