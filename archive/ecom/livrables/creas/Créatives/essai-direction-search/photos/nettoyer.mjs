// ---------------------------------------------------------------------------
// photos/nettoyer.mjs — retire les éléments d'interface d'une capture de fiche
// produit, et écrit `produit.png`.
//
//   node photos/nettoyer.mjs
//
// POURQUOI : la source est une capture d'écran de fiche marchande. Elle porte le
// cœur « favori », la loupe « zoom », la flèche « suivant » et le liseré blanc de
// la capture. Poser ça dans une créative, c'est afficher l'interface d'un
// marketplace concurrent dans sa propre publicité.
//
// POURQUOI UN SCRIPT et pas une retouche à la main : la retouche n'est pas
// rejouable. Le jour où le fournisseur envoie une meilleure photo, tout est à
// refaire sans trace de ce qui avait été enlevé.
//
// ---------------------------------------------------------------------------
// LA PREMIÈRE VERSION ÉTAIT FAUSSE, ET ELLE SORTAIT EN SUCCÈS.
//
// Elle peignait les pixels « clairs ET peu saturés ». Or les icônes sont des
// TRAITS GRIS FONCÉ sur un DISQUE BLANC : le critère effaçait le disque et
// préservait le trait, soit exactement l'inverse du but. Le script annonçait
// « 32 179 pixels neutralisés » et sortait 0, et les icônes étaient toujours là,
// avec en prime un rectangle blanc.
//
// Deux enseignements payés ici :
//   1. la couleur de fond était relevée sur les QUATRE COINS, dont le coin
//      haut-droit qui tombe dans le liseré blanc de la capture. La moyenne
//      sortait #fcfcfc au lieu du vrai #f4f4f4, d'où le rectangle visible ;
//   2. « des pixels ont été peints » ne prouve pas que les BONS l'ont été. Le
//      contrôle final vérifie donc qu'il ne reste plus rien d'étranger dans la
//      bande, au lieu de compter.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(__dirname, 'photo produit 1.jpg');
const SORTIE = join(__dirname, 'produit.png');

if (!existsSync(SOURCE)) {
  console.error(`\n  ECHEC : source introuvable -> ${SOURCE}\n`);
  process.exit(1);
}

// Mesuré sur l'image, pas estimé : la colonne d'interface commence à x = 597, et
// le bord droit de la méduse violette atteint x = 613. Les deux se chevauchent,
// donc un rectangle plein mangerait le produit. On commence la bande à 590 et on
// discrimine par la SATURATION, pas par la position.
const BANDE_X = 596 / 698;

// Le produit est franchement coloré, l'interface ne l'est pas du tout : disques
// blancs, traits gris, liseré blanc. Un seul seuil suffit à les séparer, et il
// n'utilise PAS la luminance, qui était l'erreur de la première version.
//
// Seuil descendu de 30 à 16 après contrôle visuel : à 30, le reflet clair du
// bord droit de la méduse violette passait pour de l'interface et se faisait
// peindre, ce qui creusait une encoche dans la bulle. 16 reste très au-dessus du
// bruit JPEG des aplats gris, donc aucune icône ne revient.
const SEUIL_SATURATION = 16;

// Points de fond sûrs : loin du produit et loin de la bande d'interface.
const POINTS_FOND = [[60, 60], [349, 660], [60, 620], [200, 30]];

const navigateur = await chromium.launch();
const page = await navigateur.newPage();
const r = await page.evaluate(async ({ b64, bandeX, seuilSat, pointsFond }) => {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i); i.onerror = rej;
    i.src = `data:image/jpeg;base64,${b64}`;
  });
  const cv = document.createElement('canvas');
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

  // Fond relevé sur des points choisis, jamais sur les coins.
  const ech = pointsFond.map(([x, y]) => ctx.getImageData(x, y, 1, 1).data);
  const fond = [0, 1, 2].map((k) => Math.round(ech.reduce((s, p) => s + p[k], 0) / ech.length));

  const x0 = Math.floor(bandeX * cv.width);

  // CRITÈRE : par LIGNE, on repère le dernier pixel coloré, qui est le bord
  // visible du produit, et on n'efface qu'à DROITE de ce bord.
  //
  // Le critère précédent effaçait tout pixel peu saturé de la bande. Or le bord
  // droit d'une bulle translucide est un reflet CLAIR et peu coloré : il se
  // faisait peindre, ce qui creusait une encoche bien visible dans la méduse
  // violette. Invisible sur la planche à 420 px, flagrant sur la story.
  //
  // Ce critère est exact plutôt qu'heuristique : dans la capture, l'icône est
  // DEVANT le produit, donc là où l'icône est visible le produit ne l'est pas.
  // Le dernier pixel coloré de la ligne est donc bien la limite du produit.
  const complet = ctx.getImageData(0, 0, cv.width, cv.height);
  const c = complet.data;
  let peints = 0, preserves = 0;
  for (let y = 0; y < cv.height; y++) {
    let bord = -1;
    for (let x = cv.width - 1; x >= 0; x--) {
      const i = (y * cv.width + x) * 4;
      if (sat(c[i], c[i + 1], c[i + 2]) > seuilSat) { bord = x; break; }
    }
    for (let x = Math.max(x0, bord + 1); x < cv.width; x++) {
      const i = (y * cv.width + x) * 4;
      c[i] = fond[0]; c[i + 1] = fond[1]; c[i + 2] = fond[2];
      peints++;
    }
    if (bord >= x0) preserves += bord - x0 + 1;
  }
  ctx.putImageData(complet, 0, 0);

  // RECADRAGE AU CONTENU. La capture porte de larges marges de fond : posée
  // telle quelle, la photo se met à l'échelle sur SES bords, pas sur ceux du
  // produit, et le produit flotte au milieu de sa zone en paraissant deux fois
  // trop petit. On recadre donc sur la boîte des pixels saturés, avec une marge
  // qui laisse respirer les tentacules.
  const bbox = { x0: cv.width, y0: cv.height, x1: 0, y1: 0 };
  const tout = ctx.getImageData(0, 0, cv.width, cv.height).data;
  for (let y = 0; y < cv.height; y++) {
    for (let x = 0; x < cv.width; x++) {
      const i = (y * cv.width + x) * 4;
      if (sat(tout[i], tout[i + 1], tout[i + 2]) > seuilSat) {
        if (x < bbox.x0) bbox.x0 = x;
        if (x > bbox.x1) bbox.x1 = x;
        if (y < bbox.y0) bbox.y0 = y;
        if (y > bbox.y1) bbox.y1 = y;
      }
    }
  }
  if (bbox.x1 <= bbox.x0 || bbox.y1 <= bbox.y0) {
    return { erreur: 'aucun pixel de produit trouvé : le seuil de saturation ne voit pas le produit' };
  }
  const marge = 14;
  const cx0 = Math.max(0, bbox.x0 - marge), cy0 = Math.max(0, bbox.y0 - marge);
  const cw = Math.min(cv.width, bbox.x1 + marge) - cx0;
  const chh = Math.min(cv.height, bbox.y1 + marge) - cy0;

  const cropCv = document.createElement('canvas');
  cropCv.width = cw; cropCv.height = chh;
  const cropCtx = cropCv.getContext('2d', { willReadFrequently: true });
  // Le fond est peint AVANT le collage : les marges ajoutées valent alors
  // exactement la couleur de fond, sans bord résiduel de la capture.
  cropCtx.fillStyle = `rgb(${fond.join(',')})`;
  cropCtx.fillRect(0, 0, cw, chh);
  cropCtx.drawImage(cv, cx0, cy0, cw, chh, 0, 0, cw, chh);

  // CONTRÔLE : la sonde regarde ce qu'elle prétend avoir corrigé. Dans la bande,
  // tout pixel non saturé doit désormais valoir EXACTEMENT la couleur de fond.
  // Compter les pixels peints ne prouvait rien, c'est ce qui a laissé passer la
  // première version.
  const apres = ctx.getImageData(0, 0, cv.width, cv.height).data;
  let intrus = 0;
  for (let y = 0; y < cv.height; y++) {
    let bord = -1;
    for (let x = cv.width - 1; x >= 0; x--) {
      const i = (y * cv.width + x) * 4;
      if (sat(apres[i], apres[i + 1], apres[i + 2]) > seuilSat) { bord = x; break; }
    }
    for (let x = Math.max(x0, bord + 1); x < cv.width; x++) {
      const i = (y * cv.width + x) * 4;
      if (!(apres[i] === fond[0] && apres[i + 1] === fond[1] && apres[i + 2] === fond[2])) intrus++;
    }
  }

  return {
    png: cropCv.toDataURL('image/png').split(',')[1],
    crop: `${cw}x${chh} depuis ${cx0},${cy0}`,
    fondHex: '#' + fond.map((v) => v.toString(16).padStart(2, '0')).join(''),
    peints, preserves, intrus, x0, W: cv.width, H: cv.height,
  };
}, {
  b64: readFileSync(SOURCE).toString('base64'),
  bandeX: BANDE_X, seuilSat: SEUIL_SATURATION, pointsFond: POINTS_FOND,
});
await navigateur.close();

writeFileSync(SORTIE, Buffer.from(r.png, 'base64'));

if (!existsSync(SORTIE)) {
  console.error(`\n  ECHEC : produit.png n'a pas été écrit.\n`);
  process.exit(1);
}
if (r.intrus > 0) {
  console.error(`\n  ECHEC : ${r.intrus} pixel(s) d'interface subsistent dans la bande x >= ${r.x0}.\n`);
  process.exit(1);
}

if (r.erreur) { console.error(`\n  ECHEC : ${r.erreur}\n`); process.exit(1); }
console.log(`  Source : ${r.W}x${r.H}`);
console.log(`  Recadré au contenu : ${r.crop}`);
console.log(`  Fond relevé : ${r.fondHex}`);
console.log(`  Bande d'interface neutralisée : x >= ${r.x0}`);
console.log(`  ${r.peints} pixels remis au fond, ${r.preserves} préservés (bord du produit).`);
console.log(`  Contrôle : 0 pixel d'interface restant dans la bande.`);
console.log(`\n  -> ${SORTIE}`);
console.log(`  Caler le fond de la créative sur ${r.fondHex}, sinon la photo fera rectangle.`);
