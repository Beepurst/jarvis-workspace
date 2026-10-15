// ---------------------------------------------------------------------------
// ESSAI — direction "search / solution", NON DIFFUSABLE EN L'ÉTAT.
//
// >>> CONDITION DE NON-DIFFUSION <<<
// Le produit n'est pas arbitré : pas de fournisseur, pas de prix, pas de fiche
// produit, pas de page d'arrivée. Cette direction éprouve la CHAÎNE et la
// COMPOSITION, pas une offre. Aucun prix ni délai n'est imprimé.
//
// Trois garde-fous redondants : le dossier ne s'appelle pas `direction-*` donc
// ranger-ready.mjs ne peut pas le ramasser, les fichiers sortent préfixés
// `ESSAI-`, et la condition est répétée dans NOTES.md et ETAT.md.
//
//   node build.mjs mep      -> les variantes de MISE EN PAGE, requête fixe
//   node build.mjs          -> les 4 requêtes dans la mise en page retenue
//   node build.mjs b        -> une requête, post et story
//   node _feed.mjs          -> planche 420 px
//   node _zones-story.mjs   -> zone de sécurité story
//
// ORDRE D'ARBITRAGE : la mise en page d'abord, la requête ensuite. Faire varier
// les deux en même temps rend la planche illisible, on ne sait plus ce qui a
// fait la différence.
// ---------------------------------------------------------------------------
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync, readFileSync } from 'fs';
import { rendre, verifierCompte, FONTS, dataUri } from '../_lib/rendu.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Direction E — "search / solution"
//
// D'OÙ ELLE VIENT : capture fournie par Edgar (annonce skincare anglophone,
//   « the search: how to stop dry flaky skin » / « the solution: » + pot de
//   crème posé sur un drap blanc froissé).
//
//   CE QU'ON REPREND — le MÉCANISME : la requête qui met des mots sur un besoin,
//   la barre de recherche comme preuve que la demande existe déjà, le produit en
//   réponse plutôt qu'en vitrine. Aucun lockup, aucun bouton.
//
//   CE QU'ON ÉCARTE — la PROMESSE. « stop dry flaky skin » est un claim que leur
//   produit peut porter. Une pince à cheveux n'a pas d'équivalent, et lui en
//   fabriquer un serait le travers que la méthode interdit. Nos requêtes portent
//   sur le CHOIX, jamais sur un effet.
//
// ---------------------------------------------------------------------------
// PREMIÈRE VERSION REJETÉE PAR EDGAR — « c'est mauvais ». Trois causes retenues,
// à ne pas réintroduire :
//
//   1. LA PHOTO. Trois objets détourés alignés sur un aplat gris : c'est une
//      fiche marketplace agrandie. La référence, elle, POSE un produit dans une
//      scène (drap froissé, lumière, ombre). C'est le défaut principal et il ne
//      se corrige pas au clavier, il demande une photo mise en scène.
//   2. LE PRODUIT FLOTTAIT. Centré, contenu dans le cadre, sans ombre, avec de
//      l'air partout. Dans la référence il déborde du bord bas et occupe les
//      deux tiers de l'image. Corrigé ici : détourage, ombre portée, débordement.
//   3. LES LIBELLÉS. « la recherche : / la solution : » est une traduction
//      littérale de « the search: / the solution: ». En anglais le rythme porte,
//      en français ça sonne scolaire. Plusieurs formulations sont mises en
//      concurrence ci-dessous, dont l'absence totale de libellé.
// ---------------------------------------------------------------------------

const POLICES = FONTS('family=Poppins:wght@500;600;700');

// >>> A RENSEIGNER : à RECOPIER du thème Shopify quand il existera.
const T = {
  bg: '#F0F0F0',
  txt: '#141414',
  champ: '#FFFFFF',
  champTxt: '#3C3C3C',
  loupe: '#9A9A9A',
};

const FORMATS = [
  { key: 'post', W: 1080, H: 1350 },
  { key: 'story', W: 1080, H: 1920 },
];

// ---------------------------------------------------------------------------
// LES PHOTOS
// Détourées sur fond transparent par photos/detourer.mjs. Le détourage n'est pas
// une coquetterie : sans lui, pas d'ombre portée qui suive la forme, et pas de
// débordement propre hors du cadre.
// ---------------------------------------------------------------------------
function photo(nom) {
  const f = join(__dirname, 'photos', nom);
  if (!existsSync(f)) return null;
  const b = readFileSync(f);
  return { src: dataUri(f), w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
const SEULE = photo('produit-rose.png');
const TRIO = photo('produit-trio.png');

if (!SEULE || !TRIO) {
  console.error(`\n  ECHEC : photos détourées absentes.\n` +
                `  Lancer : node photos/nettoyer.mjs && node photos/detourer.mjs\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// LES REQUÊTES
// Registre : ce qu'une personne tape réellement, minuscules comprises. Une
// requête trop bien écrite se lit comme un slogan et casse le mécanisme.
//
// ÉCARTÉES, gardées avec leur motif :
//   — « pince à cheveux qui tient les cheveux épais » : meilleure requête du lot
//     en intention d'achat, INTERDITE tant que la tenue n'est pas confirmée par
//     le fournisseur. À rouvrir dès que la fiche le documente.
//   — « la pince à cheveux que tout le monde s'arrache » : preuve sociale
//     fabriquée, aucun client réel derrière.
//   — « accessoire cheveux introuvable ailleurs » : personne ne tape ça. C'est
//     une formule publicitaire déguisée en requête, ce qui tue le mécanisme.
// ---------------------------------------------------------------------------
const COPIES = {
  a: { key: 'A-originale', requete: 'pince à cheveux originale' },
  b: { key: 'B-cadeau-ado', requete: 'idée cadeau pour une ado' },
  c: { key: 'C-deja-tout', requete: 'quoi offrir à une ado qui a déjà tout' },
  d: { key: 'D-pas-comme', requete: 'pince à cheveux pas comme les autres' },
};

// ---------------------------------------------------------------------------
// LES MISES EN PAGE en concurrence.
//
// `libelles: null` = aucun libellé, la barre de recherche pose le mécanisme
// toute seule. C'est la piste la plus native, et celle qui évite complètement le
// problème de traduction.
// ---------------------------------------------------------------------------
const MEP = {
  1: {
    key: 'MEP1-parle', libelles: ['tu cherches :', 'ça existe :'],
    sujet: 'seule', echelle: 1, debord: 0.16, titre: 54, hautPost: 470, hautStory: 830,
  },
  2: {
    key: 'MEP2-sans-libelle', libelles: null,
    sujet: 'seule', echelle: 1, debord: 0.16, titre: 54, hautPost: 300, hautStory: 640,
  },
  3: {
    key: 'MEP3-trio-sans-libelle', libelles: null,
    sujet: 'trio', echelle: 1, debord: 0.10, titre: 54, hautPost: 330, hautStory: 660,
  },
  4: {
    key: 'MEP4-litteral', libelles: ['la recherche :', 'la solution :'],
    sujet: 'seule', echelle: 1, debord: 0.16, titre: 54, hautPost: 470, hautStory: 830,
  },
};

function html(fmt, COPY, mep) {
  const story = fmt.key === 'story';
  const img = mep.sujet === 'trio' ? TRIO : SEULE;

  // DIMENSIONNEMENT PAR LA HAUTEUR DISPONIBLE, pas par la largeur.
  //
  // Une première version fixait la largeur du produit à 62 % du cadre. La méduse
  // seule ayant un rapport de 1,9 en hauteur, elle sortait à 1298 px de haut dans
  // un cadre de 1350 : elle remontait par-dessus la barre de recherche et la
  // coupait en deux. Un produit très allongé casse tout dimensionnement pensé en
  // largeur.
  //
  // On part donc du HAUT du produit, calé sous le bloc de texte, et on remplit ce
  // qui reste. `debord` est la fraction de cette hauteur qui sort du cadre bas.
  const hautProduit = story ? mep.hautStory : mep.hautPost;
  const dispo = fmt.H - hautProduit;
  let hauteurProduit = Math.round(dispo * (1 + mep.debord) * mep.echelle);
  let largeurProduit = Math.round(hauteurProduit * (img.w / img.h));

  // Plafond de largeur : le produit ne touche jamais les bords latéraux.
  const largeurMax = Math.round(fmt.W * 0.94);
  if (largeurProduit > largeurMax) {
    largeurProduit = largeurMax;
    hauteurProduit = Math.round(largeurProduit * (img.h / img.w));
  }

  // En story, la bande basse de 250 px est recouverte par la plateforme : on
  // plafonne le débordement, sinon on perd du produit deux fois.
  const sousLeCadre = Math.max(0, hauteurProduit - dispo);
  const bas = story ? -Math.min(sousLeCadre, 60) : -sousLeCadre;

  const titre = story ? mep.titre + 10 : mep.titre;

  return `<!doctype html><html><head><meta charset="utf-8">${POLICES}<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${fmt.W}px; height:${fmt.H}px; overflow:hidden; position:relative;
           background:${T.bg}; color:${T.txt};
           font-family:'Poppins',-apple-system,sans-serif; }

    .haut { position:absolute; left:0; right:0; top:${story ? 250 : 118}px;
            display:flex; flex-direction:column; align-items:center; padding:0 70px; }

    .libelle { font-size:${titre}px; font-weight:700; letter-spacing:-.02em; text-align:center; }
    .libelle.second { margin-top:${story ? 54 : 44}px; }

    .champ { margin-top:${mep.libelles ? (story ? 36 : 30) : 0}px; width:100%;
             max-width:${story ? 880 : 840}px;
             background:${T.champ}; border-radius:${story ? 60 : 54}px;
             padding:${story ? '28px 40px' : '24px 36px'};
             display:flex; align-items:center; gap:${story ? 24 : 20}px;
             box-shadow:0 2px 10px rgba(0,0,0,.07); }
    .champ svg { flex:0 0 auto; }
    /* Graisse 500 et non 700 : une requête tapée n'est pas un titre. En 700 elle
       se lit comme un slogan et le mécanisme tombe. */
    .champ span { font-size:${story ? 35 : 32}px; font-weight:500; color:${T.champTxt};
                  line-height:1.25; white-space:nowrap; }

    /* Le produit déborde par le bas. L'ombre est un drop-shadow et non une
       box-shadow : elle suit l'ALPHA du détourage, donc la silhouette de la
       méduse, au lieu de dessiner un rectangle. */
    .produit { position:absolute; left:50%; transform:translateX(-50%);
               bottom:${bas}px; width:${largeurProduit}px; height:${hauteurProduit}px;
               filter:drop-shadow(0 18px 24px rgba(0,0,0,.15)); }
    .produit img { width:100%; height:100%; object-fit:contain; display:block; }

    /* Aucun bouton dessiné, aucun lockup : la référence n'en a pas, et c'est ce
       qui la fait passer pour du contenu plutôt que pour une publicité. */
  </style></head><body>
    <div class="haut">
      ${mep.libelles ? `<div class="libelle">${mep.libelles[0]}</div>` : ''}
      <div class="champ">
        <svg width="${story ? 38 : 34}" height="${story ? 38 : 34}" viewBox="0 0 24 24" fill="none"
             stroke="${T.loupe}" stroke-width="2.4" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"></circle><line x1="16.2" y1="16.2" x2="21" y2="21"></line>
        </svg>
        <span>${COPY.requete}</span>
      </div>
      ${mep.libelles ? `<div class="libelle second">${mep.libelles[1]}</div>` : ''}
    </div>
    <div class="produit"><img src="${img.src}"></div>
  </body></html>`;
}

// --- Rendu -----------------------------------------------------------------
const arg = process.argv[2];
const modeMep = arg === 'mep';

// Mise en page retenue une fois l'arbitrage fait. Tant qu'Edgar n'a pas tranché,
// on ne rend PAS les 4 requêtes x 4 mises en page : 16 fichiers dont 12 seront
// jetés n'apprennent rien de plus que 4 bien choisis.
const MEP_RETENUE = 2;

let pages = [];
let attendu = 0;

if (modeMep) {
  // Requête fixe : on ne fait varier QUE la mise en page.
  const COPY = COPIES.b;
  for (const [, mep] of Object.entries(MEP)) {
    const dest = join(__dirname, 'créatives ads', 'post');
    mkdirSync(dest, { recursive: true });
    const base = `ESSAI-e-${mep.key}`;
    pages.push({
      html: html(FORMATS[0], COPY, mep), W: 1080, H: 1350, scale: 2,
      out: join(dest, `${base}.png`), htmlOut: join(__dirname, 'html', `${base}.html`),
    });
  }
} else {
  if (arg && !COPIES[arg]) {
    console.error(`Requête inconnue : ${arg}. Attendu : ${Object.keys(COPIES).join(' | ')} | mep`);
    process.exit(1);
  }
  const choix = arg ? [[arg, COPIES[arg]]] : Object.entries(COPIES);
  const formats = arg ? FORMATS : FORMATS.filter((f) => f.key === 'post');
  const mep = MEP[MEP_RETENUE];
  for (const [, COPY] of choix) {
    for (const fmt of formats) {
      const dest = join(__dirname, 'créatives ads', fmt.key);
      mkdirSync(dest, { recursive: true });
      const base = `ESSAI-e-${COPY.key}${fmt.key === 'story' ? '-story' : ''}`;
      pages.push({
        html: html(fmt, COPY, mep), W: fmt.W, H: fmt.H, scale: 2,
        out: join(dest, `${base}.png`), htmlOut: join(__dirname, 'html', `${base}.html`),
      });
    }
  }
}
attendu = pages.length;

const ecrits = await rendre(pages);
verifierCompte(ecrits, attendu, 'visuel(s)');

// La source doit être connue du build, sinon une photo trop petite est agrandie
// en silence et sort floue : défaut invisible sur un écran de travail, flagrant
// une fois la publicité diffusée.
for (const [nom, img, part] of [['produit-rose', SEULE, 0.62], ['produit-trio', TRIO, 0.94]]) {
  const largeurRendue = 1080 * part * 2;
  const facteur = largeurRendue / img.w;
  const drapeau = facteur > 1.15 ? '  SOUS-RÉSOLUE' : '';
  console.log(`  ${nom} : ${img.w}x${img.h}, agrandie x${facteur.toFixed(1)}${drapeau}`);
}
console.log(`\n  La source est une capture d'écran. Pour diffuser, il faut les photos`);
console.log(`  du fournisseur en pleine résolution, et de préférence mises en scène.`);
