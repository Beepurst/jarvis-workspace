// ESSAI JETABLE (27/10) : 3 posts organiques pour calibrer le « pas typé IA ».
import { chromium } from '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'fs';
const C = '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/_captures/';
const img = (f) => `data:image/png;base64,${readFileSync(C + f).toString('base64')}`;
const DESK = img('asa-desktop.png'), MOB = img('asa-mobile.png');
const head = (bg) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${bg};font-family:Manrope,sans-serif;color:#141414}</style></head><body>`;
const signe = (c = '#141414') => `<div style="position:absolute;left:80px;bottom:72px;font-size:24px;font-weight:600;color:${c};">Kleak Agency</div>`;
const page = (n, t) => `<div style="position:absolute;right:80px;bottom:72px;font-size:24px;font-weight:500;color:#8a857c;">${n}/${t}</div>`;
const CREME = '#F2EEE6';

const posts = {
  // 1. Réalisation : la capture fait le travail, le texte reste petit.
  '1-realisation': head(CREME) + `
    <div style="position:absolute;left:80px;top:90px;font-size:30px;font-weight:600;">Accueil Sénior Assistance</div>
    <div style="position:absolute;left:80px;top:134px;font-size:26px;font-weight:500;color:#6f6a62;">Aide à domicile pour personnes âgées</div>
    <img src="${DESK}" style="position:absolute;left:80px;top:250px;width:860px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.08),0 20px 50px rgba(0,0,0,.10);">
    <img src="${MOB}" style="position:absolute;right:70px;top:600px;width:270px;border-radius:30px;border:8px solid #141414;box-shadow:0 20px 50px rgba(0,0,0,.18);">
    ${signe()}`,
  // 2. Avis : la phrase du client, mot pour mot, rien autour.
  '2-avis': head(CREME) + `
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <div style="position:absolute;left:80px;top:90px;font-size:26px;font-weight:500;color:#6f6a62;">Avis client</div>
    <div style="position:absolute;left:80px;right:80px;top:300px;border-radius:30px;padding:72px 72px 80px;font-family:Inter,sans-serif;
      background:linear-gradient(0deg, #1A1A1A 8%, #050B7A 100%);box-shadow:0 30px 60px rgba(20,20,40,.18);">
      <div style="display:flex;align-items:center;gap:34px;">
        <img src="data:image/png;base64,${readFileSync('meline.png').toString('base64')}" style="width:130px;height:130px;border-radius:50%;object-fit:cover;">
        <div><div style="font-size:50px;font-weight:600;color:#fff;letter-spacing:-.01em;">Méliné GRELET</div>
        <div style="font-size:42px;font-weight:400;color:rgba(255,255,255,.62);margin-top:6px;">MAC ALYSTER</div></div>
      </div>
      <div style="font-size:42px;line-height:1.55;font-weight:400;color:#fff;margin-top:64px;">"Cela fait quelques mois que nous travaillons avec l’équipe Kleak. Nous apprécions leur professionnalisme, leur réactivité, leur capacité d’adaptation."</div>
    </div>
    <div style="position:absolute;left:80px;top:1130px;font-size:28px;font-weight:600;">4,8 sur 5 <span style="font-weight:500;color:#6f6a62;">sur notre fiche Google</span></div>
    ${signe()}`,
  // 3. Conseil en carrousel : texte simple, une idée par page.
  '3-conseil-1': head('#141414') + `
    <div style="position:absolute;left:80px;right:100px;top:420px;font-size:74px;line-height:1.15;font-weight:600;letter-spacing:-.015em;color:#F2EEE6;">Votre site sur téléphone, trois choses à vérifier ce&nbsp;soir.</div>
    ${signe('#F2EEE6')}${page(1, 4)}`,
  '3-conseil-2': head(CREME) + `
    <div style="position:absolute;left:80px;top:150px;font-size:30px;font-weight:600;color:#8a857c;">1</div>
    <div style="position:absolute;left:80px;right:100px;top:200px;font-size:60px;line-height:1.2;font-weight:600;letter-spacing:-.01em;">Votre numéro se voit sans faire défiler.</div>
    <div style="position:absolute;left:80px;right:140px;top:400px;font-size:32px;line-height:1.5;font-weight:500;color:#4a463f;">Vos clients vous cherchent souvent depuis leur téléphone. S'ils doivent chercher comment vous joindre, ils appellent le suivant.</div>
    
    <div style="position:absolute;width:300px;height:540px;border-radius:44px;border:10px solid #141414;background:#fff;overflow:hidden;left:390px;top:600px;">
      <div style="height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;border-bottom:1px solid #eee;">
        <div style="width:70px;height:16px;background:#141414;border-radius:3px"></div>
        <div style="background:#0F2FD1;color:#fff;font-size:17px;font-weight:700;padding:11px 16px;border-radius:999px;">Appeler</div></div>
      <div style="padding:30px 22px;"><div style="height:26px;width:220px;background:#141414;border-radius:4px;margin-bottom:12px"></div><div style="height:26px;width:160px;background:#141414;border-radius:4px;margin-bottom:28px"></div><div style="height:12px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div><div style="height:12px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div><div style="height:12px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div><div style="height:12px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div><div style="height:12px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div><div style="height:12px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:12px"></div></div>
    </div>
    ${signe()}${page(2, 4)}`,
  '3-conseil-3': head(CREME) + `
    <div style="position:absolute;left:80px;top:150px;font-size:30px;font-weight:600;color:#8a857c;">2</div>
    <div style="position:absolute;left:80px;right:100px;top:200px;font-size:60px;line-height:1.2;font-weight:600;letter-spacing:-.01em;">Le texte se lit sans zoomer.</div>
    <div style="position:absolute;left:80px;right:140px;top:400px;font-size:32px;line-height:1.5;font-weight:500;color:#4a463f;">Si vous devez écarter deux doigts pour lire, votre site a été fait pour un ordinateur et adapté après coup.</div>
    
    <div style="position:absolute;width:300px;height:540px;border-radius:44px;border:10px solid #141414;background:#fff;overflow:hidden;left:150px;top:560px;"><div style="padding:40px 22px;"><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div><div style="height:5px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:9px"></div></div></div>
    <div style="position:absolute;left:150px;top:1120px;width:300px;text-align:center;font-size:24px;font-weight:600;color:#8a857c;">À zoomer</div>
    <div style="position:absolute;width:300px;height:540px;border-radius:44px;border:10px solid #141414;background:#fff;overflow:hidden;left:630px;top:560px;"><div style="padding:40px 22px;"><div style="height:14px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:250px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div><div style="height:14px;width:190px;background:#D9D4CA;border-radius:4px;margin-bottom:16px"></div></div></div>
    <div style="position:absolute;left:630px;top:1120px;width:300px;text-align:center;font-size:24px;font-weight:600;color:#141414;">Lisible</div>
    ${signe()}${page(3, 4)}`,
  '3-conseil-4': head(CREME) + `
    <div style="position:absolute;left:80px;top:150px;font-size:30px;font-weight:600;color:#8a857c;">3</div>
    <div style="position:absolute;left:80px;right:100px;top:200px;font-size:60px;line-height:1.2;font-weight:600;letter-spacing:-.01em;">La page s'affiche en moins de trois secondes.</div>
    <div style="position:absolute;left:80px;right:140px;top:400px;font-size:32px;line-height:1.5;font-weight:500;color:#4a463f;">Testez en 4G, pas sur le wifi du bureau. Au-delà de trois secondes, une bonne partie des visiteurs repart avant d'avoir vu quoi que ce soit.</div>
    
    <div style="position:absolute;left:80px;right:80px;top:760px;height:22px;border-radius:11px;background:#E4DED2;"></div>
    <div style="position:absolute;left:80px;top:760px;width:645px;height:22px;border-radius:11px;background:#0F2FD1;"></div>
    <div style="position:absolute;left:725px;top:730px;width:3px;height:82px;background:#141414;"></div>
    <div style="position:absolute;left:0;right:0;top:820px;"><div style="position:absolute;left:80px;top:0;font-size:26px;font-weight:600;color:#141414">0 s</div><div style="position:absolute;left:310px;top:0;font-size:26px;font-weight:600;color:#141414">1 s</div><div style="position:absolute;left:540px;top:0;font-size:26px;font-weight:600;color:#141414">2 s</div><div style="position:absolute;left:770px;top:0;font-size:26px;font-weight:600;color:#141414">3 s</div><div style="position:absolute;left:1000px;top:0;font-size:26px;font-weight:600;color:#8a857c">4 s</div></div>
    <div style="position:absolute;left:80px;top:930px;font-size:28px;font-weight:500;color:#4a463f;line-height:1.5;">À tester sur <b style="color:#141414">pagespeed.web.dev</b>, c'est gratuit.</div>
    ${signe()}${page(4, 4)}`,
};

const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
for (const [k, html] of Object.entries(posts)) {
  writeFileSync(`${k}.html`, html);
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.screenshot({ path: `${k}.png` });
}
// Planche : les 6 images côte à côte, comme un aperçu de grille.
const files = Object.keys(posts);
await p.setViewportSize({ width: 1920, height: 1080 });
await p.setContent(`<body style="margin:0;background:#ddd;display:flex;flex-wrap:wrap;gap:16px;padding:16px;font-family:sans-serif">${files.map(f => `<div><img src="data:image/png;base64,${readFileSync(f + '.png').toString('base64')}" style="width:600px;display:block"><div style="font-size:14px;padding:4px">${f}</div></div>`).join('')}</body>`);
await p.screenshot({ path: '_planche.png', fullPage: true });
await b.close();
console.log('ok');
