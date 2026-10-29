// Captures des sites montrés dans les créas. Relancer si le site ou la démo change.
import { chromium } from 'playwright';
const shots = [
  { name: 'kleak-desktop', url: 'https://kleakagency.fr', w: 1440, h: 900 },
  { name: 'kleak-mobile', url: 'https://kleakagency.fr', w: 390, h: 844 },
  { name: 'demo-v2-desktop', url: 'https://massive-account-916652.framer.app/atelier-hauteville-v2', w: 1440, h: 900 },
  { name: 'demo-v2-mobile', url: 'https://massive-account-916652.framer.app/atelier-hauteville-v2', w: 390, h: 844 },
  { name: 'demo-v1-desktop', url: 'https://massive-account-916652.framer.app/atelier-hauteville', w: 1440, h: 900 },
  { name: 'demo-v1-mobile', url: 'https://massive-account-916652.framer.app/atelier-hauteville', w: 390, h: 844 },
  // Vraie réalisation Kleak (Framer, crédit Kleak en pied de page), montrée dans la créa D.
  { name: 'asa-mobile', url: 'https://accueilseniorassistance.com/', w: 390, h: 844 },
  // Pour AB (29/10) : même page, sans la coupure « l'accompag nement » du texte du hero
  // (l'animation lettre par lettre de Framer met chaque mot dans un span en nowrap, sauf
  // celui-ci, en « white-space:unset », qui se coupe donc en plein mot). On remet ce mot
  // en nowrap à la capture. asa-mobile reste tel quel pour D, déjà validée.
  { name: 'asa-mobile-ab', url: 'https://accueilseniorassistance.com/', w: 390, h: 844,
    css: 'p.framer-text > span{white-space:nowrap!important}' },
  { name: 'asa-desktop', url: 'https://accueilseniorassistance.com/', w: 1440, h: 900 },
  // Réalisations Kleak montrées dans les posts organiques (s6, s8), confirmées par Edgar le 28/10.
  { name: 'macalyster-desktop', url: 'https://macalyster.com/', w: 1440, h: 900 },
  { name: 'macalyster-mobile', url: 'https://macalyster.com/', w: 390, h: 844 },
  // La vidéo d'accueil de Frenchies met plusieurs secondes à sortir du gris.
  { name: 'frenchies-desktop', url: 'https://www.frenchiesinmaldives.com/', w: 1440, h: 900, attente: 9000 },
  { name: 'frenchies-mobile', url: 'https://www.frenchiesinmaldives.com/', w: 390, h: 844, attente: 9000 },
  // Démo Garnier Plomberie V2 (entreprise fictive, bandeau visible), montrée dans la créa L (série BTP, 22/10).
  { name: 'garnier-v2-mobile', url: 'https://massive-account-916652.framer.app/garnier-v2', w: 390, h: 844 },
];
// `node _capture.mjs asa-mobile` ne refait que les captures nommées.
const filtre = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chromium' });
let n = 0;
const choix = filtre.length ? shots.filter((s) => filtre.includes(s.name)) : shots;
for (const s of choix) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  await p.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(s.attente ?? 2500);
  // Le badge « Made in Framer », le crayon d'édition et le bandeau cookies ne font pas partie du site livré.
  await p.addStyleTag({ content: '#__framer-badge-container,#__framer-editorbar,#__framer-editorbar-button,[id^="__framer-editorbar"]{display:none!important}' });
  await p.evaluate(() => {
    // « Paramètres Cookies » (démo), « Paramètres des Cookies » (Accueil Sénior Assistance),
    // « Consentement aux cookies » et popup newsletter (Mac Alyster, Shopify) :
    // on retire le bloc en position fixe qui le porte, sinon le bloc lui-même.
    const re = /^(Paramètres (des )?Cookies|Consentement aux cookies|Signup for our newsletter)/i;
    for (const el of document.querySelectorAll('div,section,aside')) {
      if (!el.isConnected || !el.innerText || !re.test(el.innerText.trim())) continue;
      let cible = el;
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).position === 'fixed') { cible = a; break; }
      }
      cible.remove();
    }
    // Voile sombre laissé par une fenêtre retirée (Shopify).
    document.documentElement.style.overflow = 'auto';
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && !el.innerText?.trim() && parseFloat(s.opacity) > 0 && el.offsetWidth >= innerWidth && el.offsetHeight >= innerHeight && s.backgroundColor !== 'rgba(0, 0, 0, 0)') el.remove();
    }
  });
  if (s.css) await p.addStyleTag({ content: s.css });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `_captures/${s.name}.png` });
  await p.close(); n++; console.log(s.name);
}
await b.close();
if (!choix.length || n !== choix.length) { console.error(`${n}/${choix.length}`); process.exit(1); }
console.log(n, 'captures');
