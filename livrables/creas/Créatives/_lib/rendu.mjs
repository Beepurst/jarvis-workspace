// ---------------------------------------------------------------------------
// _lib/rendu.mjs — briques partagées par les builds et les contrôles.
//
// Pourquoi une lib partagée alors que "chaque direction produit ses fichiers
// elle-même" : la logique de rendu et de mesure est identique partout, et cinq
// copies divergent au premier correctif. Ce qui reste dans la direction, c'est
// ce qui la caractérise (copy, gabarit, tokens) plus un wrapper de contrôle de
// quelques lignes. Les corrections de sonde profitent alors à tout le parc.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';

/** Sort en erreur bruyante. Une sonde qui ne trouve rien et se tait est pire
 *  qu'aucune sonde : une sortie vide se lit exactement comme "tout va bien". */
export function echec(msg) {
  console.error(`\n  ECHEC : ${msg}\n`);
  process.exit(1);
}

/** Liste les PNG d'un dossier, triés. Retourne [] si le dossier n'existe pas :
 *  c'est à l'appelant de décider si l'absence est une faute (elle l'est presque
 *  toujours, et il doit alors appeler echec()). */
export function listePng(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => extname(f).toLowerCase() === '.png')
    .sort();
}

/** Un fichier image en data URI. Les HTML sont ouverts en file:// : un chemin
 *  relatif casse à la première réorganisation de dossier, une URL externe rend
 *  le build dépendant du réseau. */
export function dataUri(chemin) {
  const ext = extname(chemin).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mime};base64,${readFileSync(chemin).toString('base64')}`;
}

/** Les polices sont chargées par lien et non installées sur le poste : le rendu
 *  doit être identique sur n'importe quelle machine. Pour le NATIF de plateforme,
 *  ne pas utiliser ceci — voir METHODE.md, on veut la police neutre du système. */
export const FONTS = (familles) => `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${familles}&display=swap" rel="stylesheet">`;

/**
 * Rend une série de pages HTML en PNG et RETOURNE le nombre de fichiers
 * réellement écrits sur le disque. Ne jamais se fier au nombre de tours de
 * boucle ni aux "OK" affichés : quatre builds enchaînés peuvent tous afficher
 * un succès sans que trois aient écrit quoi que ce soit.
 *
 * @param {Array<{html:string, W:number, H:number, scale?:number, out:string, htmlOut?:string, fullPage?:boolean}>} pages
 * @returns {Promise<number>} fichiers effectivement présents après rendu
 */
export async function rendre(pages) {
  const navigateur = await chromium.launch();
  let ecrits = 0;
  try {
    for (const p of pages) {
      mkdirSync(join(p.out, '..'), { recursive: true });
      // Le HTML intermédiaire est écrit sur disque : Playwright l'ouvre en
      // file://, et le garder permet d'inspecter un rendu douteux à la main.
      const fichierHtml = p.htmlOut ?? p.out.replace(/\.png$/, '.html');
      mkdirSync(join(fichierHtml, '..'), { recursive: true });
      writeFileSync(fichierHtml, p.html);

      const page = await navigateur.newPage({
        viewport: { width: p.W, height: p.H },
        deviceScaleFactor: p.scale ?? 2,
      });
      await page.goto(`file://${fichierHtml}`);
      await page.evaluate(() => document.fonts.ready); // sinon la police de repli est capturée
      await page.waitForTimeout(450);                  // filtres, dégradés et grain ne sont pas peints au load
      // fullPage sert aux PLANCHES, dont la hauteur dépend du nombre de vignettes
      // et ne peut donc pas être devinée à l'avance. Une créative, elle, a un
      // format imposé : elle se capture au viewport, sans quoi une hauteur mal
      // calculée sortirait un fichier au mauvais ratio sans rien signaler.
      await page.screenshot({ path: p.out, fullPage: p.fullPage === true });
      await page.close();

      if (existsSync(p.out)) ecrits++;
    }
  } finally {
    await navigateur.close();
  }
  return ecrits;
}

/** Vérifie le compte réel contre l'attendu, et sort en erreur sinon. */
export function verifierCompte(ecrits, attendu, quoi = 'fichiers') {
  if (ecrits !== attendu) echec(`${ecrits} ${quoi} écrits sur ${attendu} attendus.`);
  console.log(`  ${ecrits} ${quoi} écrits (${attendu} attendus).`);
}

export const nomSansExt = (f) => basename(f, extname(f));
