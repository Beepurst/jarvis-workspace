// ---------------------------------------------------------------------------
// _lib/feed.mjs — LA planche de contrôle qui rattrape le plus de défauts.
//
// 420 px est la largeur réelle d'un post Instagram sur un écran courant. Tout ce
// qui est dessiné à 1080 y est divisé par 2,57. Un texte qui ne se lit pas sur
// cette planche ne se lira JAMAIS en diffusion.
//
// Ce contrôle vérifie, il ne corrige pas. Il échoue bruyamment si le dossier
// visé est vide : une planche vide se lirait comme "rien à signaler".
// ---------------------------------------------------------------------------
import { join } from 'path';
import { listePng, dataUri, echec, rendre, verifierCompte, nomSansExt } from './rendu.mjs';

const LARGEUR_FEED = 420; // largeur réelle d'un post dans un fil Instagram
const GAP = 28;
const PADDING = 40;

/**
 * @param {object} o
 * @param {string} o.racine         dossier de la direction
 * @param {string[]} o.dossiers     sous-dossiers à ratisser, ex. ['créatives ads/post']
 * @param {string} [o.sortie]       chemin du PNG de planche
 * @param {number} [o.colonnes]
 */
export async function plancheFeed({ racine, dossiers, sortie, colonnes = 3 }) {
  const vignettes = [];
  for (const d of dossiers) {
    const dir = join(racine, d);
    for (const f of listePng(dir)) vignettes.push({ dir: d, fichier: f, chemin: join(dir, f) });
  }

  // La sonde doit pouvoir physiquement observer sa cible. Si elle ne voit rien,
  // c'est un échec du contrôle, pas un succès de la créative.
  if (vignettes.length === 0) {
    echec(
      `aucun PNG dans : ${dossiers.join(', ')}\n` +
      `  Soit le build n'a rien écrit, soit les sorties ont changé de place.\n` +
      `  Dans les deux cas la planche ne prouve rien : lancer le build avant.`
    );
  }

  const W = PADDING * 2 + colonnes * LARGEUR_FEED + (colonnes - 1) * GAP;

  const cartes = vignettes
    .map((v) => `
      <figure>
        <img src="${dataUri(v.chemin)}">
        <figcaption>${nomSansExt(v.fichier)}<span>${v.dir}</span></figcaption>
      </figure>`)
    .join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    * { margin:0; padding:0; box-sizing:border-box; }
    /* Fond de planche volontairement gris moyen : une direction sur fond sombre
       posée sur une planche noire rend ses bords invisibles, et on ne peut plus
       juger ni le cadrage ni les marges. Le liseré sur l'image fait le reste. */
    body { width:${W}px; background:#4a4a50; padding:${PADDING}px;
           font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#bbb; }
    h1 { color:#fff; font-size:20px; text-shadow:0 1px 2px rgba(0,0,0,.5); font-weight:600; margin-bottom:6px; }
    p.sous { font-size:13px; color:#e8e8ea; margin-bottom:${PADDING}px; }
    .grille { display:grid; grid-template-columns:repeat(${colonnes}, ${LARGEUR_FEED}px); gap:${GAP}px; }
    figure { width:${LARGEUR_FEED}px; }
    /* Largeur imposée, hauteur libre : post et story cohabitent sur la planche
       sans être déformés, et chacun est vu à sa taille réelle de fil. */
    img { width:${LARGEUR_FEED}px; height:auto; display:block; border-radius:4px;
           box-shadow:0 0 0 1px rgba(255,255,255,.45), 0 6px 18px rgba(0,0,0,.35); }
    figcaption { font-size:11px; margin-top:8px; color:#f0f0f2; font-variant-numeric:tabular-nums; }
    figcaption span { display:block; color:#c8c8cc; font-size:10px; }
  </style></head><body>
    <h1>Planche feed — ${vignettes.length} visuel(s) à ${LARGEUR_FEED} px</h1>
    <p class="sous">Largeur réelle d'un post Instagram. Ce qui ne se lit pas ici ne se lira pas en diffusion.</p>
    <div class="grille">${cartes}</div>
  </body></html>`;

  const out = sortie ?? join(racine, '_planches', 'feed-420.png');
  // Hauteur capturée en fullPage : elle dépend du nombre de vignettes ET de leurs
  // ratios (post et story mélangés), donc elle ne se calcule pas d'avance. Une
  // hauteur devinée trop courte rognerait la dernière ligne en silence.
  // scale 1 : la planche doit peser ce que pèse l'œil, pas être agrandie.
  // Viewport volontairement court : fullPage étend jusqu'au contenu mais ne
  // rétrécit jamais sous la hauteur du viewport. Un viewport haut laisserait une
  // bande morte en bas de planche, qui ressemble à une ligne de vignettes vide.
  const ecrits = await rendre([{
    html, W, H: 200, scale: 1, out, fullPage: true,
    htmlOut: join(racine, 'html', '_planche-feed.html'),
  }]);
  verifierCompte(ecrits, 1, 'planche');
  console.log(`  -> ${out}`);
  return out;
}
