// ---------------------------------------------------------------------------
// photos/detourer.mjs — détoure le produit sur fond transparent, et en sort
// deux versions : le trio et la méduse rose seule.
//
//   node photos/nettoyer.mjs && node photos/detourer.mjs
//
// POURQUOI DÉTOURER alors que le fond de la photo est déjà celui de la créative :
// parce qu'un produit collé sur un aplat ne se pose sur rien. Pour lui donner une
// ombre et le faire DÉBORDER du cadre, il faut pouvoir le séparer du fond.
//
// LA MÉTHODE : propagation depuis les bords, pas seuillage.
//
//   Un simple seuil « ce qui ressemble au fond devient transparent » perce les
//   bulles : une méduse translucide a des reflets clairs à l'intérieur, aussi
//   proches du gris de fond que le fond lui-même. On obtient un produit troué.
//
//   Ici, on part des bords de l'image et on propage de proche en proche tant
//   qu'on reste proche du fond. Est fond CE QUI EST RELIÉ AU BORD. Un reflet
//   clair enfermé dans une bulle n'est relié à rien, il est donc conservé.
//   C'est exact plutôt qu'heuristique.
//
// L'alpha est progressif sur les bords (pas binaire) : un détourage binaire
// laisse un liseré dentelé qui se voit surtout sur fond clair.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(__dirname, 'produit.png'); // sortie de nettoyer.mjs

if (!existsSync(SOURCE)) {
  console.error(`\n  ECHEC : ${SOURCE} absent. Lancer d'abord : node photos/nettoyer.mjs\n`);
  process.exit(1);
}

// Distances au fond, en unités RGB. En dessous de T0 c'est du fond, au-dessus de
// T1 c'est du produit, entre les deux l'alpha monte progressivement.
const T0 = 8, T1 = 30;

const navigateur = await chromium.launch();
const page = await navigateur.newPage();
const r = await page.evaluate(async ({ b64, t0, t1 }) => {
  const img = await new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej;
    i.src = `data:image/png;base64,${b64}`;
  });
  const W = img.naturalWidth, H = img.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const im = ctx.getImageData(0, 0, W, H);
  const d = im.data;

  const fond = [d[0], d[1], d[2]]; // le coin est du fond : nettoyer.mjs l'a uniformisé
  const dist = (i) => Math.hypot(d[i] - fond[0], d[i + 1] - fond[1], d[i + 2] - fond[2]);

  // --- Propagation depuis les bords ---------------------------------------
  const estFond = new Uint8Array(W * H);
  const pile = [];
  const pousser = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (estFond[p]) return;
    if (dist(p * 4) > t0) return; // on ne traverse pas le produit
    estFond[p] = 1;
    pile.push(p);
  };
  for (let x = 0; x < W; x++) { pousser(x, 0); pousser(x, H - 1); }
  for (let y = 0; y < H; y++) { pousser(0, y); pousser(W - 1, y); }
  while (pile.length) {
    const p = pile.pop();
    const x = p % W, y = (p / W) | 0;
    pousser(x + 1, y); pousser(x - 1, y); pousser(x, y + 1); pousser(x, y - 1);
  }

  // --- Alpha ---------------------------------------------------------------
  let opaques = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    if (estFond[p]) { d[i + 3] = 0; continue; }
    const dd = dist(i);
    // Bords progressifs : évite le liseré dentelé, très visible sur fond clair.
    const a = dd >= t1 ? 255 : Math.round(255 * Math.max(0, (dd - t0) / (t1 - t0)));
    d[i + 3] = a;
    if (a > 200) opaques++;
  }
  ctx.putImageData(im, 0, 0);

  // --- Découpe : trio complet, puis la méduse rose seule -------------------
  // Boîte des pixels réellement opaques, marge nulle : le débordement se règle
  // dans la composition, pas ici.
  const boite = (x0b, x1b, y0b, y1b) => {
    const b = { x0: W, y0: H, x1: 0, y1: 0 };
    for (let y = y0b; y < y1b; y++) for (let x = x0b; x < x1b; x++) {
      if (d[(y * W + x) * 4 + 3] > 128) {
        if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x;
        if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y;
      }
    }
    return b;
  };
  const decouper = (b) => {
    const w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1;
    const c2 = document.createElement('canvas');
    c2.width = w; c2.height = h;
    c2.getContext('2d').drawImage(cv, b.x0, b.y0, w, h, 0, 0, w, h);
    return { png: c2.toDataURL('image/png').split(',')[1], w, h };
  };

  const bTrio = boite(0, W, 0, H);
  const trioDecoupe = decouper(bTrio);

  // --- Isoler UNE méduse : composantes connexes, pas rectangle -------------
  // Un simple rectangle autour de la méduse du haut emporte des morceaux des
  // deux autres, qui entrent dans le cadre par le bas. On étiquette donc les
  // groupes de pixels opaques reliés entre eux, et on ne garde que celui qui
  // contient le pixel opaque le plus haut : la méduse rose.
  const vu = new Uint8Array(W * H);
  const groupes = [];
  for (let p0 = 0; p0 < W * H; p0++) {
    if (vu[p0] || d[p0 * 4 + 3] <= 128) continue;
    const membres = [p0]; vu[p0] = 1;
    const file = [p0];
    let yMin = (p0 / W) | 0;
    while (file.length) {
      const p = file.pop();
      const x = p % W, y = (p / W) | 0;
      if (y < yMin) yMin = y;
      const voisins = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [vx, vy] of voisins) {
        if (vx < 0 || vy < 0 || vx >= W || vy >= H) continue;
        const q = vy * W + vx;
        if (vu[q] || d[q * 4 + 3] <= 128) continue;
        vu[q] = 1; membres.push(q); file.push(q);
      }
    }
    groupes.push({ membres, yMin });
  }
  // Les tentacules fines peuvent se détacher en petits groupes : on ignore le
  // bruit et on garde les composantes significatives.
  const utiles = groupes.filter((g) => g.membres.length > 400);
  utiles.sort((a, b) => a.yMin - b.yMin);
  const rose = utiles[0];

  // On efface tout ce qui n'appartient pas à la composante retenue, puis on
  // recadre sur ce qu'il reste.
  const garder = new Uint8Array(W * H);
  for (const p of rose.membres) garder[p] = 1;
  for (let p = 0; p < W * H; p++) if (!garder[p]) d[p * 4 + 3] = 0;
  ctx.putImageData(im, 0, 0);
  const bRose = boite(0, W, 0, H);

  return {
    trio: trioDecoupe, rose: decouper(bRose), groupes: utiles.length,
    opaques, total: W * H, W, H,
    fond: '#' + fond.map((v) => v.toString(16).padStart(2, '0')).join(''),
  };
}, { b64: readFileSync(SOURCE).toString('base64'), t0: T0, t1: T1 });
await navigateur.close();

// Un détourage qui garde tout, ou qui ne garde rien, n'a pas détouré.
const part = r.opaques / r.total;
if (part < 0.05 || part > 0.85) {
  console.error(`\n  ECHEC : ${(part * 100).toFixed(1)} % de pixels opaques, ce n'est pas un détourage plausible.\n` +
                `  Soit le fond n'a pas été reconnu, soit le produit a été effacé.\n`);
  process.exit(1);
}

writeFileSync(join(__dirname, 'produit-trio.png'), Buffer.from(r.trio.png, 'base64'));
writeFileSync(join(__dirname, 'produit-rose.png'), Buffer.from(r.rose.png, 'base64'));

console.log(`  Fond détecté : ${r.fond}`);
console.log(`  Produit conservé : ${(part * 100).toFixed(1)} % de l'image`);
console.log(`  -> produit-trio.png  ${r.trio.w}x${r.trio.h}`);
console.log(`  -> produit-rose.png  ${r.rose.w}x${r.rose.h}`);
