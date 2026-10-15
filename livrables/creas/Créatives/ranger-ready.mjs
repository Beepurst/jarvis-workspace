// ---------------------------------------------------------------------------
// ranger-ready.mjs — range les rendus finis dans Ready/, par DESTINATION.
//
//   node ranger-ready.mjs
//
// Ready/ est entièrement généré : il est effacé et reconstruit à chaque passage.
// La vérité vit dans les dossiers de direction, jamais ici. Ne rien y déposer à
// la main, ce serait perdu au prochain rangement.
//
// On range par destination et non par direction : au moment de poser une
// campagne on cherche un format et un lot d'offre, pas un numéro de direction.
// La direction reste lisible dans le préfixe du fichier (a-, b-...).
//
// Le script COPIE, il ne déplace pas : une direction doit rester rejouable sur
// place, et un build écrit dans SON dossier.
// ---------------------------------------------------------------------------
import { rmSync, mkdirSync, copyFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const READY = join(__dirname, 'Ready');

// ---------------------------------------------------------------------------
// LES SOURCES
//
// Une entrée par dossier de sortie. `dest: null` déclare une source
// VOLONTAIREMENT exclue, avec son motif : les lister explicitement évite qu'on
// se demande dans six mois si l'absence est un oubli. Une créative finie mais
// suspendue à une condition extérieure se déclare avec `condition`, ce qui la
// fait remonter dans le README de Ready/ sans être copiée.
//
//   { src: 'direction-a-<nom>/créatives ads/post', dest: 'ads/<lot>/post', prefixe: 'a-' }
//   { src: 'direction-b-<nom>/créatives ads/story', dest: null, motif: '...' }
//   { src: '...', dest: 'ads/promo/post', prefixe: 'b-', condition: 'la promo doit être active en boutique' }
//
// VIDE À DESSEIN pour l'instant : aucune direction n'existe, faute de produit
// arbitré. Voir ETAT.md. Ce n'est pas un oubli.
// ---------------------------------------------------------------------------
const SOURCES = [];

// --- Rangement -------------------------------------------------------------
const png = (d) => (existsSync(d) ? readdirSync(d).filter((f) => extname(f).toLowerCase() === '.png') : null);

rmSync(READY, { recursive: true, force: true });
mkdirSync(READY, { recursive: true });

const retenues = [];
const exclues = [];
const suspendues = [];
let copies = 0;

for (const s of SOURCES) {
  const dirSrc = join(__dirname, s.src);

  if (s.dest === null) {
    exclues.push(s);
    continue;
  }

  const fichiers = png(dirSrc);
  // Une source déclarée mais introuvable ou vide est une faute, pas un cas
  // limite : soit le build n'a rien écrit, soit les sorties ont bougé. Passer
  // outre en silence produirait un Ready/ incomplet qui a l'air complet.
  if (fichiers === null) {
    console.error(`\n  ECHEC : source déclarée mais dossier absent -> ${s.src}\n`);
    process.exit(1);
  }
  if (fichiers.length === 0) {
    console.error(`\n  ECHEC : source déclarée mais aucun PNG -> ${s.src}\n  Lancer le build de la direction avant de ranger.\n`);
    process.exit(1);
  }

  if (s.condition) {
    suspendues.push({ ...s, nb: fichiers.length });
    continue; // rendue, mais pas versée dans Ready/ tant que la condition n'est pas levée
  }

  const dirDest = join(READY, s.dest);
  mkdirSync(dirDest, { recursive: true });
  for (const f of fichiers) {
    copyFileSync(join(dirSrc, f), join(dirDest, `${s.prefixe ?? ''}${f}`));
    copies++;
  }
  retenues.push({ ...s, nb: fichiers.length });
}

// --- Le README de Ready/ ---------------------------------------------------
// Il répond à UNE seule question : qu'est-ce que je peux diffuser aujourd'hui.
const l = [];
l.push('# Ready — ce qui est diffusable');
l.push('');
l.push('> Dossier **entièrement généré** par `ranger-ready.mjs`. Effacé et reconstruit à chaque');
l.push('> passage : ne rien y déposer à la main. La vérité vit dans les dossiers de direction.');
l.push('');

if (copies === 0 && suspendues.length === 0) {
  l.push('## Rien à diffuser');
  l.push('');
  l.push('Aucune direction n\'a encore produit de visuel. La chaîne de production est en place');
  l.push('et testée, mais elle attend un produit arbitré : sans fiche produit, un visuel');
  l.push('porterait un prix, une promesse et une page d\'arrivée qui n\'existent pas.');
  l.push('');
  l.push('Voir `../ETAT.md` pour ce qui bloque exactement.');
} else {
  l.push(`## Diffusable aujourd'hui — ${copies} fichier(s)`);
  l.push('');
  for (const r of retenues) l.push(`- \`${r.dest}\` — ${r.nb} fichier(s), préfixe \`${r.prefixe ?? ''}\` (source : ${r.src})`);
}

if (suspendues.length) {
  l.push('');
  l.push('## Rendu, mais NON diffusable en l\'état');
  l.push('');
  l.push('Ces lots sont finis et attendent une condition extérieure. Ils ne sont volontairement');
  l.push('pas copiés dans `Ready/` : quelqu\'un les programmerait sans connaître la condition.');
  l.push('');
  for (const s of suspendues) l.push(`- **${s.src}** (${s.nb} fichier(s)) — condition : ${s.condition}`);
}

if (exclues.length) {
  l.push('');
  l.push('## Exclus volontairement');
  l.push('');
  for (const s of exclues) l.push(`- \`${s.src}\` — ${s.motif ?? 'motif non renseigné'}`);
}

l.push('');
l.push('---');
l.push('');
l.push('**Avant de programmer un lot :** relire le `build.mjs` de la direction, pas seulement les');
l.push('images. Un visuel se périme en silence — un prix qui a changé, une promo finie, un produit');
l.push('en rupture ne se voient ni dans la bibliothèque ni dans les légendes.');
l.push('');
writeFileSync(join(READY, 'README.md'), l.join('\n'));

console.log(`  Ready/ reconstruit : ${copies} fichier(s) copié(s), ${suspendues.length} lot(s) suspendu(s), ${exclues.length} exclu(s).`);
if (SOURCES.length === 0) {
  console.log('  Aucune source déclarée (attendu à ce stade, voir ETAT.md).');
}
