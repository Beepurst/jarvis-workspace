// ---------------------------------------------------------------------------
// _lib/zones-story.mjs — repères de zone de sécurité posés sur une story rendue.
//
// En 1080x1920, les 250 derniers pixels du bas sont recouverts en diffusion par
// le CTA natif et le nom du compte. La consigne de composition est plus stricte
// que ça : AUCUN texte ne descend sous 400 px du bord bas.
//
// Sur le projet précédent, 4 directions sur 5 étaient en faute, dont une où la
// seule ligne portant l'offre disparaissait purement et simplement.
//
// CE SCRIPT VÉRIFIE, IL NE CORRIGE PAS. Et il ne décide pas non plus : il
// n'essaie pas de deviner par analyse d'image ce qui est du texte et ce qui est
// de la photo. Une heuristique qui confond un motif contrasté avec un titre
// donnerait des alertes fausses, et une sonde à laquelle on cesse de croire ne
// vaut pas mieux qu'une sonde absente. Ce qu'il produit se regarde.
// ---------------------------------------------------------------------------
import { join } from 'path';
import { listePng, dataUri, echec, rendre, verifierCompte, nomSansExt } from './rendu.mjs';

export const STORY_W = 1080;
export const STORY_H = 1920;
export const BANDE_RECOUVERTE = 250; // recouvert par l'interface de la plateforme
export const PLANCHER_TEXTE = 400;   // limite de composition, plus stricte que la bande

/**
 * @param {object} o
 * @param {string} o.racine    dossier de la direction
 * @param {string} [o.dossier] sous-dossier des stories
 */
export async function zonesStory({ racine, dossier = 'créatives ads/story' }) {
  const dir = join(racine, dossier);
  const fichiers = listePng(dir);

  if (fichiers.length === 0) {
    echec(
      `aucune story dans ${dossier}\n` +
      `  Les stories ne sont rendues qu'une fois l'accroche tranchée (build.mjs <accroche>).\n` +
      `  Tant qu'il n'y a rien à mesurer, ce contrôle ne prouve rien.`
    );
  }

  const pages = fichiers.map((f) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { width:${STORY_W}px; height:${STORY_H}px; position:relative; overflow:hidden;
             font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
      .story { position:absolute; inset:0; background:url('${dataUri(join(dir, f))}') center/cover; }
      /* Bande réellement recouverte par l'interface de la plateforme. */
      .bande { position:absolute; left:0; right:0; bottom:0; height:${BANDE_RECOUVERTE}px;
               background:rgba(255,0,0,.28); border-top:2px solid rgba(255,0,0,.9); }
      /* Plancher de composition : rien en dessous, texte comme élément graphique porteur. */
      .plancher { position:absolute; left:0; right:0; bottom:${PLANCHER_TEXTE}px; height:0;
                  border-top:3px dashed rgba(0,255,180,.95); }
      /* Zone haute masquée par l'avatar et le nom du compte sur certaines surfaces. */
      .haut { position:absolute; left:0; right:0; top:0; height:160px;
              background:rgba(255,0,0,.16); border-bottom:2px solid rgba(255,0,0,.6); }
      .lbl { position:absolute; right:16px; padding:6px 12px; border-radius:4px; font-size:22px;
             font-weight:600; color:#fff; background:rgba(0,0,0,.72); }
    </style></head><body>
      <div class="story"></div>
      <div class="haut"></div><span class="lbl" style="top:168px">haut recouvert — 160 px</span>
      <div class="bande"></div><span class="lbl" style="bottom:${BANDE_RECOUVERTE + 12}px">recouvert par la plateforme — ${BANDE_RECOUVERTE} px</span>
      <div class="plancher"></div><span class="lbl" style="bottom:${PLANCHER_TEXTE + 12}px; background:rgba(0,120,90,.85)">plancher texte — ${PLANCHER_TEXTE} px</span>
    </body></html>`;

    return {
      html, W: STORY_W, H: STORY_H, scale: 1,
      out: join(racine, '_planches', `zones-${nomSansExt(f)}.png`),
      htmlOut: join(racine, 'html', `_zones-${nomSansExt(f)}.html`),
    };
  });

  const ecrits = await rendre(pages);
  verifierCompte(ecrits, pages.length, 'repère(s) story');
  console.log(`  -> ${join(racine, '_planches')}`);
  console.log(`\n  À regarder : aucun glyphe de texte ne doit franchir la ligne verte.`);
  console.log(`  Rappel : remonter le bloc du bas oblige à recomposer ce qui est au-dessus.`);
  return pages.map((p) => p.out);
}
