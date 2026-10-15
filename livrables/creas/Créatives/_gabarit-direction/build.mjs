// ---------------------------------------------------------------------------
// GABARIT DE DIRECTION — à copier, pas à diffuser.
//
//   cp -R _gabarit-direction direction-a-<nom>
//
// AVANT de choisir la lettre : `ls -d direction-*`. Deux sessions parallèles se
// sont disputé la même lettre deux fois.
//
// Ce gabarit est exécutable EN L'ÉTAT, pour vérifier que la chaîne de rendu
// fonctionne sur le poste. Ce qu'il produit porte "GABARIT" en toutes lettres et
// n'est jamais diffusable : le dossier ne s'appelle pas `direction-*`, donc
// `ranger-ready.mjs` ne peut pas le ramasser par accident.
//
//   node build.mjs          -> toutes les accroches, post seul
//   node build.mjs a        -> l'accroche retenue, post et story
//   node _feed.mjs          -> contrôle de lisibilité à 420 px
//   node _zones-story.mjs   -> contrôle de la zone de sécurité story
// ---------------------------------------------------------------------------
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import { rendre, verifierCompte, FONTS } from '../_lib/rendu.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Direction <X> — "<nom>"
//
// CE QU'ELLE MONTRE   : >>> A RENSEIGNER — le mécanisme visuel en 3 lignes.
// D'OÙ ELLE VIENT     : >>> A RENSEIGNER — la référence fournie, ce qu'on en
//                       reprend (le MÉCANISME) et ce qu'on écarte (la PROMESSE :
//                       un concurrent peut affirmer ce que son produit tient).
// CE QU'ON S'INTERDIT : >>> A RENSEIGNER — les règles propres à cette direction.
//                       Rappel des règles générales, non négociables :
//                       pas de bouton dessiné, pas de témoignage inventé,
//                       pas de chiffre de performance fabriqué, pas de délai non
//                       mesuré, et rien que la page d'arrivée ne tienne pas.
// ---------------------------------------------------------------------------

// Polices chargées par lien, jamais installées sur le poste : le rendu doit être
// identique sur n'importe quelle machine.
// EXCEPTION à ne pas oublier : sur du NATIF DE PLATEFORME (carrousel TikTok de
// découverte), on veut au contraire la police neutre du système, aucune charte,
// aucun traitement. Voir METHODE.md.
const POLICES = FONTS('family=Inter:wght@400;500;600;700');

// Les assets sont INLINÉS en base64 par dataUri() : le HTML s'ouvre en file://,
// un chemin relatif casse à la première réorganisation de dossier.
//   import { dataUri } from '../_lib/rendu.mjs';
//   const LOGO = dataUri(join(__dirname, 'assets', 'logo.png'));

// ---------------------------------------------------------------------------
// LES TOKENS
// >>> A RENSEIGNER — à RECOPIER depuis le thème Shopify, jamais à choisir ici.
// Une créative qui invente sa palette diverge du site au premier ajustement, et
// c'est le site qui a raison.
// ---------------------------------------------------------------------------
const T = {
  bg: '#111114',
  txt: '#F4F4F5',
  muted: '#8A8A90',
  accent: '#D94F2B',
};

// Le format est une donnée, pas une variante de code : ajouter un canal ne doit
// pas demander de toucher au gabarit.
const FORMATS = [
  { key: 'post', W: 1080, H: 1350 },
  { key: 'story', W: 1080, H: 1920 },
];

// ---------------------------------------------------------------------------
// LES ACCROCHES
// Une entrée par accroche testée, 3 à 5. On tranche SUR PIÈCE, jamais sur du
// texte dans une conversation.
//
// Les accroches ÉCARTÉES RESTENT ICI, en commentaire avec leur motif : les jeter
// oblige à refaire l'arbitrage si le sujet revient.
//
// `linesShort` existe parce qu'à 76 px en story la largeur utile ne tient
// qu'environ 24 caractères par ligne.
//
// Registre : une seule idée, aucune figure de style, aucune chute, pas de point
// final. Le rythme trahit une production automatique bien avant le vocabulaire.
// ---------------------------------------------------------------------------
const COPIES = {
  a: {
    key: 'GABARIT-exemple',
    lines: ['Le gabarit rend', 'et <em>rien de plus</em>'],
    linesShort: ['Le gabarit rend', 'et rien de plus'],
  },
  // b: { key: '...', lines: [...], linesShort: [...] },
  //
  // ÉCARTÉES (garder, avec le motif) :
  // — « ... » : promesse de délai non mesurée.
  // — « ... » : chute en fin de ligne, se lit comme une publicité.
};

function html(fmt, COPY) {
  const story = fmt.key === 'story';
  return `<!doctype html><html><head><meta charset="utf-8">${POLICES}<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${fmt.W}px; height:${fmt.H}px; background:${T.bg}; overflow:hidden;
           font-family:'Inter',sans-serif; color:${T.txt}; }

    /* Zone de sécurité story : le padding bas de 430 px garantit que le dernier
       élément de texte ne descend pas sous le plancher de 400 px. Toucher à
       cette valeur oblige à recomposer ce qui est au-dessus, ce n'est jamais un
       correctif d'une seule ligne. */
    .wrap { padding:${story ? '200px 76px 430px' : '96px 76px'}; height:100%;
            display:flex; flex-direction:column; justify-content:center; }

    h1 { font-size:${story ? 76 : 68}px; line-height:1.08; letter-spacing:-.02em; font-weight:600; }
    h1 em { font-style:italic; color:${T.accent}; }
    .note { margin-top:32px; font-size:26px; color:${T.muted}; }

    /* Pas de bouton dessiné, jamais : en story on tape dessus et rien ne se
       passe, en feed il double celui que la plateforme fournit. L'incitation
       reste, mais en ligne de texte. */
  </style></head><body>
    <div class="wrap">
      <h1>${(story ? COPY.linesShort : COPY.lines).join('<br>')}</h1>
      <p class="note">Gabarit de contrôle — ne pas diffuser</p>
    </div>
  </body></html>`;
}

// --- Rendu -----------------------------------------------------------------
const argCopy = process.argv[2];
if (argCopy && !COPIES[argCopy]) {
  console.error(`Accroche inconnue : ${argCopy}. Attendu : ${Object.keys(COPIES).join(' | ')}`);
  process.exit(1);
}
const choix = argCopy ? [[argCopy, COPIES[argCopy]]] : Object.entries(COPIES);

// Tant que l'accroche n'est pas tranchée, on ne rend QUE le post : rendre huit
// fichiers dont sept seront jetés n'apporte rien, et la story demande en plus
// une version courte de chaque titre.
const formats = argCopy ? FORMATS : FORMATS.filter((f) => f.key === 'post');

const pages = [];
for (const [, COPY] of choix) {
  for (const fmt of formats) {
    const dest = join(__dirname, 'créatives ads', fmt.key);
    mkdirSync(dest, { recursive: true });
    const base = `x-${COPY.key}${fmt.key === 'story' ? '-story' : ''}`;
    pages.push({
      html: html(fmt, COPY),
      W: fmt.W, H: fmt.H,
      // deviceScaleFactor 2 -> les PNG sortent en 2160x2700. C'est nécessaire au
      // RENDU (texte net), pas à la diffusion : on redescend à 1080 en WebP
      // avant tout envoi vers un stockage.
      scale: 2,
      out: join(dest, `${base}.png`),
      htmlOut: join(__dirname, 'html', `${base}.html`),
    });
  }
}

const ecrits = await rendre(pages);
// Compter ce qui est RÉELLEMENT sorti, jamais se fier aux "OK" affichés : quatre
// builds enchaînés peuvent tous afficher un succès sans que trois aient écrit
// quoi que ce soit.
verifierCompte(ecrits, pages.length, 'visuel(s)');
