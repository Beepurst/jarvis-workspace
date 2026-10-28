// Dépôt d'un post organique dans le Hub Agence. Ne publie jamais : le post arrive « à valider ».
//
//   node deposer.mjs <id>                  téléverse rendus/<id>/*.jpg puis dépose le post (date et texte du plan)
//   node deposer.mjs <id> --correction     redépose le même post (id hub du plan), date lue dans le hub
//   node deposer.mjs --liste               posts à venir du hub, avec les commentaires des « à corriger »
//   ajouter --dry-run                      affiche les requêtes prévues, sans réseau ni secret, sans toucher au plan
//
// HUB_URL et POSTS_AGENT_SECRET viennent de l'environnement, sinon du .env du workspace.
// Le secret n'est jamais affiché. Aucune dépendance : fetch de Node.
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { POSTS, lirePlan, majPlan, dossierRendu, imagesRendues, W, H } from './build.mjs';

const ENV = '/Users/ed/Desktop/jarvis-kleak/.env';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const correction = args.includes('--correction');
const liste = args.includes('--liste');
const id = args.find((a) => !a.startsWith('--'));

const stop = (m) => { console.error(`Arrêt : ${m}`); process.exit(1); };

// ---------- Configuration ----------
function lireEnv() {
  const v = {};
  if (!existsSync(ENV)) return v;
  for (const l of readFileSync(ENV, 'utf8').split('\n')) {
    const m = l.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) v[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return v;
}
const env = lireEnv();
const HUB = (process.env.HUB_URL || env.HUB_URL || (dryRun ? '<HUB_URL>' : '')).replace(/\/+$/, '');
const SECRET = process.env.POSTS_AGENT_SECRET || env.POSTS_AGENT_SECRET || '';
if (!HUB) stop('HUB_URL absent de l\'environnement et du .env.');
if (!SECRET && !dryRun) {
  stop('POSTS_AGENT_SECRET absent du .env du workspace. Edgar doit le créer (la même valeur dans le .env, le .env.local du hub et Vercel) avant tout dépôt.');
}

// ---------- Appels au hub ----------
async function appel(methode, chemin, corps) {
  if (dryRun) {
    console.log(`\n[dry-run] ${methode} ${HUB}${chemin}\n  en-têtes : content-type: application/json, x-kleak-secret: (masqué)`);
    if (corps !== undefined) console.log(`  corps : ${JSON.stringify(corps, null, 2).replace(/\n/g, '\n  ')}`);
    return null;
  }
  const r = await fetch(`${HUB}${chemin}`, {
    method: methode,
    headers: { 'content-type': 'application/json', 'x-kleak-secret': SECRET },
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
  const texte = await r.text();
  let json = null;
  try { json = JSON.parse(texte); } catch { /* réponse non JSON */ }
  return { status: r.status, json, texte };
}

const masquerUrl = (u) => u.replace(/token=[^&]+/, 'token=(masqué)');

// ---------- Contrôles locaux (le hub refait les siens) ----------
// Date du plan « 2026-11-03 12:30 » (heure de Paris) -> « 2026-11-03T12:30:00+01:00 ».
function parisVersIso(s) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!m) return null;
  const [, a, mo, j, h, mi] = m.map(Number);
  const decalage = (t) => {
    const nom = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', timeZoneName: 'longOffset' })
      .formatToParts(new Date(t)).find((p) => p.type === 'timeZoneName').value; // « GMT+01:00 »
    const o = nom.match(/GMT([+-])(\d{2}):(\d{2})/);
    return o ? (o[1] === '-' ? -1 : 1) * (Number(o[2]) * 60 + Number(o[3])) : 0;
  };
  const local = Date.UTC(a, mo - 1, j, h, mi);
  let off = decalage(local);
  off = decalage(local - off * 60000);
  const sg = off < 0 ? '-' : '+';
  const abs = Math.abs(off);
  return { iso: `${s.replace(' ', 'T')}:00${sg}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`, t: local - off * 60000 };
}

function problemesTexte(t) {
  const p = [];
  if (!t.trim()) p.push('texte vide');
  if (/[—–]/.test(t) || / - /.test(t)) p.push('tiret à la place d\'une virgule');
  if (/\p{Extended_Pictographic}/u.test(t)) p.push('emoji');
  if (/€|\beuros?\b/i.test(t)) p.push('prix (aucun prix dans les posts)');
  const tags = (t.match(/(?<![\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu) ?? []).length;
  if (tags > 3) p.push(`${tags} hashtags (3 au plus)`);
  return p;
}

// Dimensions d'un JPEG (segment SOF), pour refuser autre chose que du 1080 × 1350.
function tailleJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marque = buf[i + 1];
    const long = buf.readUInt16BE(i + 2);
    if (marque >= 0xc0 && marque <= 0xc3) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + long;
  }
  return null;
}

// ---------- --liste ----------
if (liste) {
  const r = await appel('GET', '/api/agent/posts');
  if (r) {
    if (r.status !== 200) stop(`le hub répond ${r.status} : ${r.texte.slice(0, 300)}`);
    const { posts } = lirePlan();
    const parHub = new Map(posts.filter((p) => p.idHub).map((p) => [p.idHub, p.id]));
    for (const p of r.json.a_venir) {
      console.log(`${p.statut.padEnd(14)} ${p.prevu_le}  ${p.type.padEnd(11)} ${parHub.get(p.id) ?? '(hors plan)'}  ${p.id}`);
      if (p.statut === 'a_corriger') console.log(`  commentaire d'Edgar : ${p.commentaire ?? '(aucun)'}`);
    }
    console.log(`${r.json.publies.length} post(s) publié(s) parmi les 30 derniers.`);
  }
  process.exit(0);
}

// ---------- Dépôt ----------
if (!id) stop('Usage : node deposer.mjs <id> [--correction] [--dry-run] | --liste [--dry-run]');
const { posts } = lirePlan();
const ligne = posts.find((p) => p.id === id);
if (!ligne) stop(`${id} absent de plan-editorial.md.`);
if (/confirmer/i.test(ligne.statut)) stop(`${id} est « ${ligne.statut} » : rien ne part avant la confirmation d'Edgar.`);
if (!POSTS[id]) stop(`${id} absent de POSTS dans build.mjs.`);
if (id.startsWith('essai-')) stop('les essais servent de référence, ils ne se déposent pas.');
if (POSTS[id].type !== ligne.type) stop(`type du plan (${ligne.type}) différent de celui de build.mjs (${POSTS[id].type}).`);
if (correction && !ligne.idHub) stop(`${id} n'a pas d'id hub dans le plan : rien à corriger, faire un premier dépôt.`);
if (!correction && ligne.idHub) stop(`${id} est déjà déposé (id hub ${ligne.idHub}). Pour le refaire : --correction.`);

const pb = problemesTexte(ligne.texte);
if (pb.length) stop(`texte de ${id} refusé : ${pb.join(', ')}.`);

const fichiers = imagesRendues(id);
if (!fichiers.length) stop(`aucune image dans rendus/${id}/ : lancer d'abord node build.mjs ${id}.`);
// Réalisation : une image ou un carrousel (demande d'Edgar du 28/10). Avis : une image.
if (ligne.type === 'conseil' ? fichiers.length < 2 || fichiers.length > 10
  : ligne.type === 'realisation' ? fichiers.length < 1 || fichiers.length > 10 : fichiers.length !== 1) {
  stop(`${fichiers.length} image(s) pour un post de type ${ligne.type}.`);
}
const contenus = fichiers.map((f) => {
  const buf = readFileSync(join(dossierRendu(id), f));
  const t = tailleJpeg(buf);
  if (!t || t.w !== W || t.h !== H) stop(`${f} n'est pas un JPEG ${W} × ${H}.`);
  if (buf.length > 8 * 1024 * 1024) stop(`${f} dépasse 8 Mo, la limite d'Instagram.`);
  return buf;
});

// Date : celle du hub pour une correction (Edgar a pu la changer), celle du plan sinon.
let prevuLe;
if (correction && !dryRun) {
  const r = await appel('GET', '/api/agent/posts');
  if (r.status !== 200) stop(`lecture du hub impossible (${r.status}) : ${r.texte.slice(0, 300)}`);
  const actuel = r.json.a_venir.find((p) => p.id === ligne.idHub);
  if (!actuel) stop(`le post ${ligne.idHub} n'est plus dans les posts à venir du hub (publié ou supprimé).`);
  prevuLe = actuel.prevu_le;
  console.log(`Correction de ${id}, date gardée : ${prevuLe}. Commentaire d'Edgar : ${actuel.commentaire ?? '(aucun)'}`);
} else {
  if (/fixer/i.test(ligne.prevu)) stop(`${id} n'a pas encore de date (« ${ligne.prevu} ») : la fixer dans plan-editorial.md, 12:30 par défaut.`);
  const d = parisVersIso(ligne.prevu);
  if (!d) stop(`date « ${ligne.prevu} » invalide, format attendu « 2026-11-03 12:30 » (heure de Paris).`);
  if (d.t <= Date.now()) stop(`date ${ligne.prevu} déjà passée.`);
  prevuLe = d.iso;
  if (correction) console.log(`[dry-run] correction : la date réelle sera lue dans le hub ; à défaut celle du plan, ${prevuLe}.`);
}

// 1. Une URL signée par image.
const t = await appel('POST', '/api/agent/posts/televersement', { fichiers });
let chemins;
if (dryRun) {
  chemins = fichiers.map((f, i) => `AAAA-MM/<uuid-${i + 1}>.jpg`);
} else {
  if (t.status !== 200) stop(`téléversement refusé (${t.status}) : ${t.texte.slice(0, 300)}`);
  chemins = t.json.televersements.map((x) => x.chemin);
}

// 2. Envoi de chaque image sur son URL signée (même requête que uploadToSignedUrl de supabase-js).
for (const [i, f] of fichiers.entries()) {
  if (dryRun) {
    console.log(`\n[dry-run] PUT <url signée Supabase de ${chemins[i]}>\n  en-têtes : content-type: image/jpeg, cache-control: max-age=3600, x-upsert: false\n  corps : rendus/${id}/${f} (${contenus[i].length} octets)`);
    continue;
  }
  const { url } = t.json.televersements[i];
  const r = await fetch(url, {
    method: 'PUT',
    headers: { 'content-type': 'image/jpeg', 'cache-control': 'max-age=3600', 'x-upsert': 'false' },
    body: contenus[i],
  });
  if (!r.ok) stop(`envoi de ${f} refusé (${r.status}) sur ${masquerUrl(url)} : ${(await r.text()).slice(0, 300)}`);
}

// 3. Le post lui-même. Tout ou rien côté hub : un texte refusé et rien n'est enregistré.
const corps = { type: ligne.type, texte: ligne.texte, prevu_le: prevuLe, images: chemins };
if (correction) corps.id = ligne.idHub;
const r = await appel('POST', '/api/agent/posts', corps);
if (dryRun) {
  console.log(`\n[dry-run] rien n'a été envoyé, le plan n'est pas modifié. Après un vrai dépôt : statut « ${correction ? 'corrigé' : 'déposé'} » et id hub dans plan-editorial.md.`);
  process.exit(0);
}
if (r.status === 422) stop(`texte refusé par les contrôles du hub :\n- ${(r.json?.problemes ?? []).join('\n- ')}\n(les images téléversées restent dans le bucket sans post)`);
if (r.status !== 201) stop(`dépôt refusé (${r.status}) : ${r.texte.slice(0, 300)}`);
majPlan(id, { statut: correction ? 'corrigé' : 'déposé', idHub: r.json.id });
console.log(`${r.status} : ${id} ${r.json.cree ? 'déposé' : 'corrigé'} (id hub ${r.json.id}), à valider par Edgar dans le hub.`);
