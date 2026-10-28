// Posts organiques Instagram et Facebook de Kleak Agency : un gabarit par type, rendu en JPEG.
//
//   node build.mjs <id> [<id> ...]   rend rendus/<id>/1.jpg, 2.jpg ... et rendus/<id>/_apercu-420.png
//   node build.mjs --grille          planche des posts du plan, dans l'ordre de la grille Instagram
//
// Repris de essais/render.mjs (validé par Edgar le 27/10). Les règles sont dans README.md.
// Toujours en JPEG (qualité 92, 1080 × 1350) : Instagram n'accepte que le JPEG.
// Le contenu de chaque post est dans l'objet POSTS ; la date et le texte sont dans plan-editorial.md.
import { chromium } from '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export const ICI = dirname(fileURLToPath(import.meta.url));
const CAPTURES = '/Users/ed/Desktop/jarvis-kleak/livrables/creas-meta/_captures/';
export const W = 1080, H = 1350;

// ---------- Charte ----------
const CREME = '#F2EEE6';
const NOIR = '#141414';
const GRIS = '#6f6a62';       // métier, « Avis client »
const GRIS_CLAIR = '#8a857c'; // numéro, pagination
const TEXTE = '#4a463f';      // explications des conseils
const TRAIT = '#D9D4CA';      // lignes de texte dessinées
const FOND_BARRE = '#E4DED2';
const BLEU = '#0F2FD1';       // bleu Kleak, seul accent des dessins

const head = (bg, inter = false) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
${inter ? '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">' : ''}
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${bg};font-family:Manrope,sans-serif;color:${NOIR}}</style></head><body>`;
const signe = (c = NOIR) => `<div style="position:absolute;left:80px;bottom:72px;font-size:24px;font-weight:600;color:${c};">Kleak Agency</div>`;
const pagination = (n, t) => `<div style="position:absolute;right:80px;bottom:72px;font-size:24px;font-weight:500;color:${GRIS_CLAIR};">${n}/${t}</div>`;
const capture = (f) => {
  const chemin = CAPTURES + f;
  if (!existsSync(chemin)) throw new Error(`Capture absente : ${chemin}. Lancer _capture.mjs dans livrables/creas-meta.`);
  return `data:image/png;base64,${readFileSync(chemin).toString('base64')}`;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Gabarit 1 : réalisation (une image) ----------
// La capture fait le travail, le texte reste petit. Captures fraîches avant chaque post :
// cd livrables/creas-meta && node _capture.mjs <nom>-desktop <nom>-mobile
function realisation({ client, metier, desktop, mobile }) {
  return [head(CREME) + `
    <div style="position:absolute;left:80px;top:90px;font-size:30px;font-weight:600;">${esc(client)}</div>
    <div style="position:absolute;left:80px;top:134px;font-size:26px;font-weight:500;color:${GRIS};">${esc(metier)}</div>
    <img src="${capture(desktop)}" style="position:absolute;left:80px;top:250px;width:860px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,.08),0 20px 50px rgba(0,0,0,.10);">
    <img src="${capture(mobile)}" style="position:absolute;right:70px;top:600px;width:270px;border-radius:30px;border:8px solid ${NOIR};box-shadow:0 20px 50px rgba(0,0,0,.18);">
    ${signe()}`];
}

// ---------- Gabarit 1 bis : réalisation en carrousel (demande d'Edgar du 28/10 sur s8) ----------
// Couverture = le gabarit réalisation. Puis une spécificité du site par page : nom du client en
// petit, phrase en gras (60 px), une phrase d'explication (32 px), et la section réelle du site en
// capture (coins 10 px, ombre douce). Les captures de sections viennent de _capture-sections.mjs,
// prix retirés. `visuel` reçoit la page et rend le bloc data-bloc="visuel" entre y = 600 et 1160.
function realisationCarrousel(r, pages) {
  const total = pages.length + 1;
  const imgs = realisation(r);
  imgs[0] += pagination(1, total);
  pages.forEach((p, i) => {
    imgs.push(head(CREME) + `
    <div style="position:absolute;left:80px;top:90px;font-size:26px;font-weight:500;color:${GRIS};">${esc(r.client)}</div>
    <div data-bloc="titre" style="position:absolute;left:80px;right:100px;top:150px;font-size:60px;line-height:1.2;font-weight:600;letter-spacing:-.01em;">${p.titre}</div>
    <div data-bloc="explication" style="position:absolute;left:80px;right:140px;top:${p.hautExplication ?? 380}px;font-size:32px;line-height:1.5;font-weight:500;color:${TEXTE};">${p.explication}</div>
    ${p.visuel()}
    ${signe()}${pagination(i + 2, total)}`);
  });
  return imgs;
}
const OMBRE = 'box-shadow:0 2px 6px rgba(0,0,0,.08),0 20px 50px rgba(0,0,0,.10);';
// Capture recadrée : `x` et `y` en fraction de l'image source, `zoom` > 1 pour agrandir.
const section = (f, { top = 620, h = 520, zoom = 1, x = 0, y = 0 } = {}) =>
  `<div data-bloc="visuel" style="position:absolute;left:80px;right:80px;top:${top}px;height:${h}px;border-radius:10px;overflow:hidden;background:#fff;${OMBRE}">
    <img src="${capture(f)}" style="position:absolute;left:${-x * 920 * zoom}px;top:0;width:${920 * zoom}px;transform:translateY(${-y * 100}%);"></div>`;

// ---------- Gabarit 2 : avis client (une image) ----------
// La carte reprend exactement celle de kleakagency.fr. Texte mot pour mot, fautes évidentes seules corrigées.
function avis({ prenom, nom, entreprise, photo, texte }) {
  const n = texte.length;
  const taille = n <= 170 ? 42 : n <= 220 ? 38 : 35;
  const haut = n <= 170 ? 300 : n <= 220 ? 260 : 220;
  return [head(CREME, true) + `
    <div style="position:absolute;left:80px;top:90px;font-size:26px;font-weight:500;color:${GRIS};">Avis client</div>
    <div data-bloc="carte" style="position:absolute;left:80px;right:80px;top:${haut}px;border-radius:30px;padding:72px 72px 80px;font-family:Inter,sans-serif;
      background:linear-gradient(0deg, #1A1A1A 8%, #050B7A 100%);box-shadow:0 30px 60px rgba(20,20,40,.18);">
      <div style="display:flex;align-items:center;gap:34px;">
        <img src="${photo}" style="width:130px;height:130px;border-radius:50%;object-fit:cover;">
        <div><div style="font-size:50px;font-weight:600;color:#fff;letter-spacing:-.01em;">${esc(prenom)} ${esc(nom.toUpperCase())}</div>
        <div style="font-size:42px;font-weight:400;color:rgba(255,255,255,.62);margin-top:6px;">${esc(entreprise.toUpperCase())}</div></div>
      </div>
      <div style="font-size:${taille}px;line-height:1.55;font-weight:400;color:#fff;margin-top:64px;">"${esc(texte)}"</div>
    </div>
    <div data-bloc="note" style="position:absolute;left:80px;top:1130px;font-size:28px;font-weight:600;">4,8 sur 5 <span style="font-weight:500;color:${GRIS};">sur notre fiche Google</span></div>
    ${signe()}`];
}

// ---------- Gabarit 3 : conseil en carrousel (couverture sombre + une idée par page) ----------
function conseil({ couverture, pages }) {
  const total = pages.length + 1;
  const imgs = [head(NOIR) + `
    <div style="position:absolute;left:80px;right:100px;top:420px;font-size:74px;line-height:1.15;font-weight:600;letter-spacing:-.015em;color:${CREME};">${couverture}</div>
    ${signe(CREME)}${pagination(1, total)}`];
  pages.forEach((p, i) => {
    const dessin = DESSINS[p.dessin];
    if (!dessin) throw new Error(`Dessin inconnu : ${p.dessin} (connus : ${Object.keys(DESSINS).join(', ')})`);
    imgs.push(head(CREME) + `
    <div style="position:absolute;left:80px;top:150px;font-size:30px;font-weight:600;color:${GRIS_CLAIR};">${i + 1}</div>
    <div data-bloc="titre" style="position:absolute;left:80px;right:100px;top:200px;font-size:60px;line-height:1.2;font-weight:600;letter-spacing:-.01em;">${p.titre}</div>
    <div data-bloc="explication" style="position:absolute;left:80px;right:140px;top:400px;font-size:32px;line-height:1.5;font-weight:500;color:${TEXTE};">${p.explication}</div>
    ${dessin(p)}
    ${signe()}${pagination(i + 2, total)}`);
  });
  return imgs;
}

// ---------- Dessins plats des conseils ----------
// Noir, gris clair, blanc, un seul accent bleu Kleak. Pas de dégradé, pas d'ombre, pas d'icône.
// Chaque dessin tient entre y = 560 et y = 1160, et porte data-bloc="dessin" sur son cadre.
const ligne = (h, w, mb, c = TRAIT) => `<div style="height:${h}px;width:${w}px;background:${c};border-radius:4px;margin-bottom:${mb}px"></div>`;
const lignes = (nb, h, mb) => Array.from({ length: nb }, (_, i) => ligne(h, [190, 250, 250][i % 3], mb)).join('');
const telephone = (left, top, inner, bloc = true) =>
  `<div ${bloc ? 'data-bloc="dessin"' : ''} style="position:absolute;width:300px;height:540px;border-radius:44px;border:10px solid ${NOIR};background:#fff;overflow:hidden;left:${left}px;top:${top}px;">${inner}</div>`;
const navigateur = (inner) =>
  `<div data-bloc="dessin" style="position:absolute;left:140px;top:620px;width:800px;height:500px;border-radius:18px;border:8px solid ${NOIR};background:#fff;overflow:hidden;">
    <div style="height:46px;border-bottom:2px solid #eee;display:flex;align-items:center;gap:10px;padding:0 20px;">
      <div style="width:12px;height:12px;border-radius:50%;background:${TRAIT}"></div><div style="width:12px;height:12px;border-radius:50%;background:${TRAIT}"></div><div style="width:12px;height:12px;border-radius:50%;background:${TRAIT}"></div>
    </div>${inner}</div>`;
const etiquette = (left, top, w, texte, c = NOIR) =>
  `<div style="position:absolute;left:${left}px;top:${top}px;width:${w}px;text-align:center;font-size:24px;font-weight:600;color:${c};">${texte}</div>`;

export const DESSINS = {
  // Téléphone schématique, bouton « Appeler » bleu en haut de l'écran (essai validé).
  appeler: () => telephone(390, 600, `
      <div style="height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;border-bottom:1px solid #eee;">
        <div style="width:70px;height:16px;background:${NOIR};border-radius:3px"></div>
        <div style="background:${BLEU};color:#fff;font-size:17px;font-weight:700;padding:11px 16px;border-radius:999px;">Appeler</div></div>
      <div style="padding:30px 22px;">${ligne(26, 220, 12, NOIR)}${ligne(26, 160, 28, NOIR)}${lignes(6, 12, 12)}</div>`),
  // Deux téléphones, « À zoomer » et « Lisible » (essai validé).
  zoom: () => telephone(150, 560, `<div style="padding:40px 22px;">${lignes(26, 5, 9)}</div>`)
    + etiquette(150, 1120, 300, 'À zoomer', GRIS_CLAIR)
    + telephone(630, 560, `<div style="padding:40px 22px;">${lignes(13, 14, 16)}</div>`, false)
    + etiquette(630, 1120, 300, 'Lisible'),
  // Barre de temps de 0 à 4 s, arrêtée avant 3 s (essai validé).
  chrono: () => `
    <div data-bloc="dessin" style="position:absolute;left:80px;right:80px;top:760px;height:22px;border-radius:11px;background:${FOND_BARRE};"></div>
    <div style="position:absolute;left:80px;top:760px;width:645px;height:22px;border-radius:11px;background:${BLEU};"></div>
    <div style="position:absolute;left:725px;top:730px;width:3px;height:82px;background:${NOIR};"></div>
    <div style="position:absolute;left:0;right:0;top:820px;">${[0, 1, 2, 3, 4].map((s) => `<div style="position:absolute;left:${80 + s * 230}px;top:0;font-size:26px;font-weight:600;color:${s === 4 ? GRIS_CLAIR : NOIR}">${s} s</div>`).join('')}</div>
    <div style="position:absolute;left:80px;top:930px;font-size:28px;font-weight:500;color:${TEXTE};line-height:1.5;">À tester sur <b style="color:${NOIR}">pagespeed.web.dev</b>, c'est gratuit.</div>`,
  // Fiche d'établissement : lignes d'horaires, celle du jour en bleu.
  horaires: () => telephone(390, 580, `
      <div style="padding:34px 22px 0;">${ligne(22, 200, 12, NOIR)}${ligne(10, 140, 30)}</div>
      <div style="padding:0 22px;">${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((j, i) => `
        <div style="display:flex;justify-content:space-between;align-items:center;height:46px;border-top:1px solid #eee;font-size:18px;font-weight:600;color:${i === 3 ? BLEU : NOIR};">
          <span>${j}</span><div style="height:10px;width:${i === 6 ? 70 : 120}px;background:${i === 3 ? BLEU : TRAIT};border-radius:4px"></div></div>`).join('')}
      </div>`),
  // Un avis, puis la réponse de l'entreprise, décalée.
  reponse: () => `
    <div data-bloc="dessin" style="position:absolute;left:140px;top:600px;width:800px;padding:34px 36px;border-radius:18px;background:#fff;border:2px solid ${TRAIT};">
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:22px;"><div style="width:52px;height:52px;border-radius:50%;background:${TRAIT}"></div>${ligne(16, 180, 0, NOIR)}</div>
      ${ligne(12, 640, 14)}${ligne(12, 600, 14)}${ligne(12, 420, 0)}
    </div>
    <div style="position:absolute;left:260px;top:870px;width:680px;padding:30px 36px;border-radius:18px;background:#fff;border:2px solid ${BLEU};">
      <div style="font-size:20px;font-weight:700;color:${BLEU};margin-bottom:18px;">Réponse du propriétaire</div>
      ${ligne(12, 560, 14)}${ligne(12, 380, 0)}
    </div>`,
  // Fiche sur téléphone avec le bouton « Site web » en bleu.
  lien: () => telephone(390, 580, `
      <div style="height:170px;background:${FOND_BARRE};"></div>
      <div style="padding:26px 22px;">${ligne(22, 210, 12, NOIR)}${ligne(10, 150, 26)}
        <div style="display:flex;gap:10px;margin-bottom:26px;">
          <div style="flex:1;border:2px solid ${TRAIT};border-radius:999px;height:44px;"></div>
          <div style="flex:1.3;background:${BLEU};color:#fff;border-radius:999px;height:44px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;">Site web</div>
          <div style="flex:1;border:2px solid ${TRAIT};border-radius:999px;height:44px;"></div></div>
        ${lignes(4, 10, 12)}</div>`),
  // Page d'accueil dans un navigateur, la phrase du haut cerclée de bleu.
  accroche: () => navigateur(`
      <div style="padding:40px 50px;">
        <div style="border:4px solid ${BLEU};border-radius:12px;padding:18px 20px;margin:0 -24px 30px;">${ligne(30, 520, 12, NOIR)}${ligne(30, 360, 0, NOIR)}</div>
        ${ligne(12, 560, 14)}${ligne(12, 600, 14)}${ligne(12, 480, 30)}
        <div style="width:150px;height:44px;border-radius:999px;background:${NOIR};"></div></div>`),
  // Zone d'intervention : une ligne de la page, avec une épingle bleue.
  zone: () => navigateur(`
      <div style="padding:40px 50px;">
        ${ligne(30, 520, 12, NOIR)}${ligne(30, 360, 34, NOIR)}
        <div style="display:flex;align-items:center;gap:18px;border:4px solid ${BLEU};border-radius:12px;padding:18px 20px;margin:0 -24px 30px;">
          <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${BLEU};"></div>${ligne(14, 300, 0, NOIR)}</div>
        ${ligne(12, 560, 14)}${ligne(12, 480, 0)}</div>`),
  // Bouton « Contact » bleu dans le menu, visible sans chercher.
  contact: () => navigateur(`
      <div style="height:80px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;border-bottom:1px solid #eee;">
        <div style="width:90px;height:20px;background:${NOIR};border-radius:3px"></div>
        <div style="display:flex;align-items:center;gap:26px;">${ligne(10, 60, 0)}${ligne(10, 60, 0)}${ligne(10, 60, 0)}
          <div style="background:${BLEU};color:#fff;font-size:20px;font-weight:700;padding:13px 24px;border-radius:999px;">Contact</div></div></div>
      <div style="padding:46px 40px;">${ligne(30, 480, 12, NOIR)}${ligne(30, 330, 30, NOIR)}${lignes(4, 12, 14)}</div>`),
};

// ---------- Matière réelle ----------
// Avis relevés sur kleakagency.fr le 27/10 (essais/_avis-site.mjs). Ne rien ajouter qui n'existe pas.
const AVIS = {
  meline: { prenom: 'Méliné', nom: 'Grelet', entreprise: 'Mac Alyster', photo: 'https://framerusercontent.com/images/QZUSFrmKelyEAjMhu5YxQ4c.png',
    texte: "Cela fait quelques mois que nous travaillons avec l’équipe Kleak. Nous apprécions leur professionnalisme, leur réactivité, leur capacité d’adaptation." },
  laura: { prenom: 'Laura', nom: 'Dias', entreprise: 'Mega Content', photo: 'https://framerusercontent.com/images/lPKVWJhAaa7KtMRoqStcJ1Z9x54.png',
    texte: "Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci" },
  aurore: { prenom: 'Aurore', nom: 'Melis', entreprise: 'Frenchies in Maldives', photo: 'https://framerusercontent.com/images/C9ahglvQtlaEIG0n0X4xVEYRB4.jpeg',
    texte: "Nous sommes très satisfaits du site réalisé, tant sur le fond que sur son fonctionnement. L’outil est solide, fluide, et surtout parfaitement adapté à nos objectifs en termes de SEO et SEA, ce qui est un vrai atout pour notre visibilité." },
};

// Réalisations montrables. Seule ASA est confirmée (27/10). Mac Alyster, Mega Content et
// Frenchies in Maldives seulement après confirmation d'Edgar ; les démos fictives jamais.
const REALISATIONS = {
  asa: { client: 'Accueil Sénior Assistance', metier: 'Aide à domicile pour personnes âgées', desktop: 'asa-desktop.png', mobile: 'asa-mobile.png' },
  macalyster: { client: 'Mac Alyster', metier: 'Sacs et bagages, Paris', desktop: 'macalyster-desktop.png', mobile: 'macalyster-mobile.png' },
  frenchies: { client: 'Frenchies in Maldives', metier: 'Voyages en petit groupe aux Maldives', desktop: 'frenchies-desktop.png', mobile: 'frenchies-mobile.png' },
};

// Essai du 27/10, gardé à l'identique comme référence de mise en page. Ses explications
// contiennent des généralisations sans source : ne pas les reprendre (voir s2).
const ESSAI_CONSEIL = {
  couverture: 'Votre site sur téléphone, trois choses à vérifier ce&nbsp;soir.',
  pages: [
    { titre: 'Votre numéro se voit sans faire défiler.', explication: "Vos clients vous cherchent souvent depuis leur téléphone. S'ils doivent chercher comment vous joindre, ils appellent le suivant.", dessin: 'appeler' },
    { titre: 'Le texte se lit sans zoomer.', explication: 'Si vous devez écarter deux doigts pour lire, votre site a été fait pour un ordinateur et adapté après coup.', dessin: 'zoom' },
    { titre: "La page s'affiche en moins de trois secondes.", explication: "Testez en 4G, pas sur le wifi du bureau. Au-delà de trois secondes, une bonne partie des visiteurs repart avant d'avoir vu quoi que ce soit.", dessin: 'chrono' },
  ],
};

// ---------- Posts ----------
// Un id par post, le même que dans plan-editorial.md. type doit correspondre à la colonne du plan.
// Un post non rendable (réalisation à confirmer) n'a pas d'entrée ici.
export const POSTS = {
  // Essais validés par Edgar le 27/10 : références de mise en page, jamais déposés tels quels.
  'essai-realisation': { type: 'realisation', images: () => realisation(REALISATIONS.asa) },
  'essai-avis': { type: 'avis', images: () => avis(AVIS.meline) },
  'essai-conseil': { type: 'conseil', images: () => conseil(ESSAI_CONSEIL) },

  // Série de démarrage (9 posts), voir plan-editorial.md. Titres de s2 validés sur l'essai.
  's1-realisation-asa': { type: 'realisation', images: () => realisation(REALISATIONS.asa) },
  's2-conseil-telephone': { type: 'conseil', images: () => conseil({
    couverture: 'Votre site sur téléphone, trois choses à vérifier ce&nbsp;soir.',
    pages: [
      { titre: 'Votre numéro se voit sans faire défiler.', explication: "Mettez le numéro ou un bouton pour appeler en haut de l'écran.", dessin: 'appeler' },
      { titre: 'Le texte se lit sans zoomer.', explication: 'Ouvrez votre site sur votre téléphone. Si vous devez écarter deux doigts pour lire, le texte est trop petit.', dessin: 'zoom' },
      { titre: "La page s'affiche en moins de trois secondes.", explication: 'Faites le test en 4G, avec le wifi coupé.', dessin: 'chrono' },
    ],
  }) },
  's3-avis-meline': { type: 'avis', images: () => avis(AVIS.meline) },
  's4-conseil-fiche-google': { type: 'conseil', images: () => conseil({
    couverture: 'Votre fiche Google, à relire de temps en&nbsp;temps.',
    pages: [
      { titre: 'Vos horaires sont à jour.', explication: 'Un client peut se déplacer en se fiant à ces horaires. Pensez aux jours fériés et aux congés.', dessin: 'horaires' },
      { titre: 'Vous répondez aux avis, même aux bons.', explication: 'Une réponse courte suffit. Elle montre que quelqu’un lit les avis et s’en occupe.', dessin: 'reponse' },
      { titre: 'Le lien vers votre site fonctionne.', explication: "Cliquez dessus depuis votre téléphone de temps en temps. Si votre site a changé d'adresse, le lien peut ne plus marcher.", dessin: 'lien' },
    ],
  }) },
  's5-avis-laura': { type: 'avis', images: () => avis(AVIS.laura) },
  's6-realisation-macalyster': { type: 'realisation', images: () => realisation(REALISATIONS.macalyster) },
  's7-avis-aurore': { type: 'avis', images: () => avis(AVIS.aurore) },
  // Corrigé le 28/10 à la demande d'Edgar : carrousel qui présente le site et ses spécificités.
  // Tout ce qui est dit se vérifie sur frenchiesinmaldives.com (relevé le 28/10).
  's8-realisation-frenchies': { type: 'realisation', images: () => realisationCarrousel(REALISATIONS.frenchies, [
    { titre: 'Les deux séjours sont présentés côte à côte.', explication: 'Hébergement, repas, activités incluses : les deux cartes suivent le même ordre.',
      visuel: () => section('frenchies-sejours.png', { h: 500, zoom: 1.25 }) },
    { titre: 'Le bouton Réserver ouvre WhatsApp.', explication: 'Le message est déjà écrit avec le séjour choisi. Le voyageur n’a plus qu’à l’envoyer.',
      visuel: () => `
    <div data-bloc="visuel" style="position:absolute;left:80px;top:640px;width:420px;height:410px;border-radius:10px;overflow:hidden;${OMBRE}">
      <img src="${capture('frenchies-reserver-mobile.png')}" style="width:420px;display:block;"></div>
    <div style="position:absolute;left:560px;top:660px;width:440px;font-size:22px;font-weight:600;color:${GRIS_CLAIR};">Message reçu sur WhatsApp</div>
    <div style="position:absolute;left:560px;top:706px;width:440px;padding:28px 30px;border-radius:18px 18px 18px 4px;background:#fff;border:2px solid ${TRAIT};font-size:27px;line-height:1.45;font-weight:500;color:${NOIR};">Bonjour, je viens du site Frenchies in Maldives et je souhaite réserver le séjour 7&nbsp;jours. Quelles sont les prochaines dates disponibles&nbsp;?</div>` },
    { titre: 'Les questions d’avant le départ ont leur réponse.', explication: 'Logement, repas, papiers d’entrée, coutumes de l’île : la FAQ de la page d’accueil y répond.',
      visuel: () => section('frenchies-faq.png', { h: 480, zoom: 1.5, x: 0.333 }) },
  ]) },
  's9-conseil-accueil': { type: 'conseil', images: () => conseil({
    couverture: 'Ce qu’un visiteur doit pouvoir lire sur votre page&nbsp;d’accueil.',
    pages: [
      { titre: 'La page dit ce que vous faites.', explication: 'Une phrase en haut de la page, avec des mots simples.', dessin: 'accroche' },
      { titre: 'On sait où vous intervenez.', explication: "Une ville, un département ou toute la France. Écrivez-le sur la page d'accueil.", dessin: 'zone' },
      { titre: 'Votre contact se trouve sans chercher.', explication: 'Mettez un lien vers la page de contact dans le menu, sur chaque page.', dessin: 'contact' },
    ],
  }) },
};

// ---------- Plan éditorial ----------
// Tableau markdown : | id | type | prévu (Paris) | statut | id hub | texte |
export const PLAN = join(ICI, 'plan-editorial.md');
const ENTETE = ['id', 'type', 'prévu (paris)', 'statut', 'id hub', 'texte'];
const cellules = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

export function lirePlan(chemin = PLAN) {
  const lignes = readFileSync(chemin, 'utf8').split('\n');
  const debut = lignes.findIndex((l) => l.trim().startsWith('|') && cellules(l).map((c) => c.toLowerCase()).join('|') === ENTETE.join('|'));
  if (debut < 0) throw new Error(`plan-editorial.md : tableau introuvable (en-tête attendu : | ${ENTETE.join(' | ')} |)`);
  const posts = [];
  for (let i = debut + 2; i < lignes.length && lignes[i].trim().startsWith('|'); i++) {
    const c = cellules(lignes[i]);
    if (c.length !== ENTETE.length) throw new Error(`plan-editorial.md ligne ${i + 1} : ${c.length} colonnes au lieu de ${ENTETE.length}`);
    posts.push({ ligne: i, id: c[0], type: c[1], prevu: c[2], statut: c[3], idHub: c[4], texte: c[5].replace(/<br\s*\/?>/gi, '\n') });
  }
  return { lignes, posts };
}

/** Réécrit les cellules statut et id hub d'un post dans le plan. */
export function majPlan(id, { statut, idHub }, chemin = PLAN) {
  const { lignes, posts } = lirePlan(chemin);
  const p = posts.find((x) => x.id === id);
  if (!p) throw new Error(`Post ${id} absent du plan`);
  const c = cellules(lignes[p.ligne]).map((x) => x.replace(/\|/g, '\\|'));
  if (statut !== undefined) c[3] = statut;
  if (idHub !== undefined) c[4] = idHub;
  lignes[p.ligne] = `| ${c.join(' | ')} |`;
  writeFileSync(chemin, lignes.join('\n'));
}

// ---------- Rendu ----------
export const dossierRendu = (id) => join(ICI, 'rendus', id);
export const imagesRendues = (id) => existsSync(dossierRendu(id))
  ? readdirSync(dossierRendu(id)).filter((f) => /^\d+\.jpg$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b))
  : [];

// Deux blocs marqués data-bloc qui se chevauchent, ou un bloc qui sort de l'image : le rendu échoue.
async function controler(page, nom) {
  const souci = await page.evaluate(({ W, H }) => {
    const r = [...document.querySelectorAll('[data-bloc]')].map((e) => ({ n: e.dataset.bloc, b: e.getBoundingClientRect() }));
    for (const x of r) if (x.b.bottom > H - 110 || x.b.right > W) return `${x.n} déborde (bas ${Math.round(x.b.bottom)} px)`;
    for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
      const a = r[i].b, b = r[j].b;
      if (a.left < b.right && b.left < a.right && a.top < b.bottom + 24 && b.top < a.bottom + 24) return `${r[i].n} et ${r[j].n} se touchent`;
    }
    const imgs = [...document.images].filter((i) => !i.complete || i.naturalWidth === 0);
    if (imgs.length) return `${imgs.length} image(s) non chargée(s)`;
    return null;
  }, { W, H });
  if (souci) throw new Error(`${nom} : ${souci}`);
}

async function rendre(page, id) {
  const post = POSTS[id];
  if (!post) throw new Error(`Post inconnu dans POSTS : ${id}`);
  const htmls = post.images();
  const dossier = dossierRendu(id);
  rmSync(dossier, { recursive: true, force: true });
  mkdirSync(dossier, { recursive: true });
  for (const [i, html] of htmls.entries()) {
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await controler(page, `${id} image ${i + 1}`);
    await page.screenshot({ path: join(dossier, `${i + 1}.jpg`), type: 'jpeg', quality: 92 });
  }
  // Aperçu à 420 px, la largeur d'une image dans le fil : à ouvrir et regarder avant tout dépôt.
  const vignettes = imagesRendues(id).map((f) => `<img src="data:image/jpeg;base64,${readFileSync(join(dossier, f)).toString('base64')}" style="width:420px;display:block">`);
  await page.setViewportSize({ width: 40 + vignettes.length * 436, height: 600 });
  await page.setContent(`<body style="margin:0;background:#fff;display:flex;gap:16px;padding:20px">${vignettes.join('')}</body>`);
  await page.screenshot({ path: join(dossier, '_apercu-420.png'), fullPage: true });
  await page.setViewportSize({ width: W, height: H });
  return htmls.length;
}

// Grille Instagram : 3 colonnes, le plus récent en haut à gauche. Première image de chaque post rendu.
async function grille(page) {
  const { posts } = lirePlan();
  const cases = [...posts].reverse().map((p) => {
    const f = imagesRendues(p.id)[0];
    const img = f ? `<img src="data:image/jpeg;base64,${readFileSync(join(dossierRendu(p.id), f)).toString('base64')}" style="width:300px;height:375px;object-fit:cover;display:block">`
      : `<div style="width:300px;height:375px;background:#ccc;display:flex;align-items:center;justify-content:center;font-size:14px;text-align:center;padding:20px;box-sizing:border-box">pas encore rendu</div>`;
    return `<div>${img}<div style="font:13px sans-serif;padding:4px 0 10px">${esc(p.id)} · ${esc(p.type)}</div></div>`;
  });
  await page.setViewportSize({ width: 3 * 304 + 40, height: 800 });
  await page.setContent(`<body style="margin:0;background:#fff;display:grid;grid-template-columns:repeat(3,300px);gap:4px;padding:20px">${cases.join('')}</body>`);
  const sortie = join(ICI, 'rendus', '_grille.png');
  mkdirSync(dirname(sortie), { recursive: true });
  await page.screenshot({ path: sortie, fullPage: true });
  return sortie;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage : node build.mjs <id> [<id> ...] | --grille\nPosts connus : ' + Object.keys(POSTS).join(', '));
    process.exit(1);
  }
  const b = await chromium.launch({ channel: 'chromium' });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  let code = 0;
  try {
    for (const a of args) {
      if (a === '--grille') { console.log(`Grille : ${await grille(page)}`); continue; }
      const n = await rendre(page, a);
      console.log(`${a} : ${n} image(s) dans rendus/${a}/, aperçu rendus/${a}/_apercu-420.png`);
    }
  } catch (e) {
    console.error(`Échec : ${e.message}`);
    code = 1;
  } finally {
    await b.close();
  }
  process.exit(code);
}
