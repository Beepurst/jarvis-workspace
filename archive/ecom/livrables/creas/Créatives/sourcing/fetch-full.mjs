// ---------------------------------------------------------------------------
// sourcing/fetch-full.mjs — TEMPS 2 : descendre en pleine résolution les SEULS
// candidats retenus à l'œil sur la planche contact.
//
//   node sourcing/fetch-full.mjs "<lot>" <id> <id> <id> [-> dossier destination]
//
// 5 ou 6 fichiers, pas 300. C'est toute la raison d'être des deux temps.
// ---------------------------------------------------------------------------
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const [lot, ...args] = process.argv.slice(2);
const flecheI = args.indexOf('->');
const ids = (flecheI === -1 ? args : args.slice(0, flecheI)).map(String);
const destArg = flecheI === -1 ? null : args[flecheI + 1];

if (!lot || ids.length === 0) {
  console.error(`  Usage : node fetch-full.mjs "<lot>" <id> <id> ... [-> ../direction-a-xxx/photos]`);
  process.exit(1);
}

const indexPath = join(__dirname, '_candidats', lot, 'index.json');
if (!existsSync(indexPath)) {
  console.error(`\n  ECHEC : aucun index pour le lot "${lot}".\n` +
                `  Lancer d'abord : node sourcing/fetch-candidates.mjs "${lot}" "<requêtes>"\n`);
  process.exit(1);
}

const { candidats } = JSON.parse(readFileSync(indexPath, 'utf-8'));
const parId = new Map(candidats.map((c) => [String(c.id), c]));

const inconnus = ids.filter((id) => !parId.has(id));
if (inconnus.length) {
  console.error(`\n  ECHEC : identifiant(s) absent(s) de l'index : ${inconnus.join(', ')}\n` +
                `  Ce sont les numéros en gras sur la planche contact.\n`);
  process.exit(1);
}

const dest = destArg ? join(process.cwd(), destArg) : join(__dirname, '_candidats', lot, 'pleine-resolution');
mkdirSync(dest, { recursive: true });

let ecrits = 0;
const credits = [];
for (const id of ids) {
  const c = parId.get(id);
  const rep = await fetch(c.pleine);
  if (!rep.ok) {
    console.error(`\n  ECHEC : téléchargement de ${id} -> ${rep.status}\n`);
    process.exit(1);
  }
  const ext = (c.pleine.split('?')[0].match(/\.(jpe?g|png)$/i)?.[1] ?? 'jpg').toLowerCase();
  const out = join(dest, `${lot}-${id}.${ext}`);
  writeFileSync(out, Buffer.from(await rep.arrayBuffer()));
  if (existsSync(out)) {
    ecrits++;
    console.log(`  ${id} -> ${(statSync(out).size / 1e6).toFixed(1)} Mo`);
  }
  credits.push(`${lot}-${id}.${ext} — ${c.photographe} — ${c.page}`);
}

// Compter les fichiers réellement écrits, jamais les tours de boucle.
if (ecrits !== ids.length) {
  console.error(`\n  ECHEC : ${ecrits} fichiers écrits sur ${ids.length} demandés.\n`);
  process.exit(1);
}

// Les crédits suivent la photo dans son dossier de destination : séparés d'elle,
// ils sont perdus au premier déplacement, et l'attribution redevient impossible.
writeFileSync(join(dest, 'CREDITS.txt'),
  `Source : Pexels (licence autorisant l'usage commercial).\n` +
  `Attribution non obligatoire, conservée ici pour pouvoir la fournir si besoin.\n\n` +
  credits.join('\n') + '\n');

console.log(`\n  ${ecrits} photo(s) -> ${dest}`);
console.log(`  Crédits écrits à côté des fichiers.`);
console.log(`\n  Rappel : juger sur le rendu AVEC le texte par-dessus, pas sur la vignette.`);
