// ---------------------------------------------------------------------------
// _lib/grain.mjs — grain SVG feTurbulence, et la mesure qui prouve qu'il existe.
//
// Le grain est la brique la plus traîtresse de la chaîne : il a DEUX façons de
// se rendre totalement invisible, chacune suffisante seule, et aucune des deux
// ne produit d'erreur. On croit avoir du grain, on n'en a pas, et ça ne se voit
// qu'en comparant deux rendus côte à côte.
//
//   PIÈGE 1 — feTurbulence bruite aussi le CANAL ALPHA. Le motif se dissout dans
//   sa propre transparence. Correctif : forcer alpha à 1.
//
//   PIÈGE 2 — le bruit est centré sur 0.5, or `overlay` est mathématiquement
//   NEUTRE en 0.5 : superposer un gris à 50 % ne fait rigoureusement rien.
//   Correctif : étaler l'amplitude autour de 0.5 (slope 3, intercept -1, soit
//   0.33 -> 0 et 0.67 -> 1).
//
// C'est pour ça que ce module expose `mesurerGrain()` : le grain se prouve, il
// ne se constate pas.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

/** Le SVG du grain, prêt à être posé en background-image (data URI). */
export const grainSvg = ({ frequence = 0.85, octaves = 3, tuile = 360, etalement = 3 } = {}) =>
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tuile}" height="${tuile}">` +
    `<filter id="g" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${frequence}" numOctaves="${octaves}" stitchTiles="stitch"/>` +
    `<feComponentTransfer>` +
      // Étalement autour de 0.5, sinon overlay est neutre (piège 2).
      `<feFuncR type="linear" slope="${etalement}" intercept="${(1 - etalement) / 2}"/>` +
      `<feFuncG type="linear" slope="${etalement}" intercept="${(1 - etalement) / 2}"/>` +
      `<feFuncB type="linear" slope="${etalement}" intercept="${(1 - etalement) / 2}"/>` +
      // Alpha forcé à 1, sinon le motif se dissout (piège 1).
      `<feFuncA type="linear" slope="0" intercept="1"/>` +
    `</feComponentTransfer></filter>` +
    `<rect width="100%" height="100%" filter="url(#g)"/></svg>`
  );

/** Le bloc CSS à insérer dans un gabarit. L'élément .grain se pose en dernier,
 *  au-dessus de tout, en overlay à ~17 %. */
export const cssGrain = ({ opacite = 0.17, tuile = 360, ...o } = {}) => `
  .grain { position:absolute; inset:0; pointer-events:none; z-index:3;
           background-image:url("data:image/svg+xml,${grainSvg({ tuile, ...o })}");
           background-size:${tuile}px ${tuile}px;
           mix-blend-mode:overlay; opacity:${opacite}; }`;

/**
 * Mesure l'écart-type de luminance d'un aplat uni AVEC et SANS grain.
 * Un aplat uni a un écart-type nul par construction : tout ce qui dépasse vient
 * du grain, et rien d'autre. La mesure est donc sans ambiguïté.
 * @returns {Promise<{sans:number, avec:number}>}
 */
export async function mesurerGrain(options = {}) {
  const page = (async () => {
    const navigateur = await chromium.launch();
    const p = await navigateur.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 1 });
    return { navigateur, p };
  })();
  const { navigateur, p } = await page;
  try {
    const mesure = async (avecGrain) => {
      await p.setContent(`<!doctype html><html><head><style>
        * { margin:0; padding:0; }
        body { width:400px; height:400px; position:relative; background:#3A2E24; }
        ${cssGrain(options)}
      </style></head><body>${avecGrain ? '<div class="grain"></div>' : ''}</body></html>`);
      await p.waitForTimeout(450); // le filtre n'est pas peint à l'instant du load
      const tampon = await p.screenshot();
      const b64 = tampon.toString('base64');
      return p.evaluate(async (data) => {
        const img = await new Promise((res) => {
          const i = new Image(); i.onload = () => res(i); i.src = `data:image/png;base64,${data}`;
        });
        const cv = document.createElement('canvas');
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
        let s = 0, s2 = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          s += l; s2 += l * l; n++;
        }
        const moy = s / n;
        return Math.sqrt(Math.max(0, s2 / n - moy * moy));
      }, b64);
    };
    return { sans: await mesure(false), avec: await mesure(true) };
  } finally {
    await navigateur.close();
  }
}
