import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_DIR = join(__dirname, 'html');
mkdirSync(HTML_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Créas Meta Kleak Agency, premiers essais (18/10/2026)
//
// D'OÙ ÇA VIENT : les anciennes pubs Kleak (accroche capitale italique + cartouche
// blanc, bleu électrique, K en haut, maquette d'appareil) et la méthode Orbikal
// (HTML rendu en PNG, accroches multiples, contrôle à 420 px).
// CE QU'ON ÉCARTE des anciennes pubs : « 49 €/mois » (ne correspond plus à l'offre),
// « N°1 des agences Framer » et « +50 % de clients » (invérifiables), les boutons
// dessinés dans l'image (le bouton est celui de Meta).
// CE QU'ON GARDE : les avis clients et la note Google 4,8/5, réels (confirmé par
// Edgar le 18/10).
// RÈGLE : tout ce qui est promis dans l'image doit être dans la fiche offre
// (livrables/offre/fiche-offre.md) le jour de la diffusion.
//
//   node build.mjs          -> toutes les créas, post seul
//   node build.mjs a        -> une créa, post et story
//   node _feed.mjs          -> contrôle de lisibilité à 420 px
// ---------------------------------------------------------------------------

const FONTS = `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const b64 = (f) => readFileSync(join(__dirname, f)).toString('base64');
const IMG = (f) => `data:image/png;base64,${b64(f)}`;
const LOGO = IMG('assets/k-blanc.png');
const DEMO_MOBILE = IMG('_captures/demo-v1-mobile.png');
const DEMO_DESKTOP = IMG('_captures/demo-v2-desktop.png');
const DEMO_MOBILE_V2 = IMG('_captures/demo-v2-mobile.png');
// Vraie réalisation Kleak : https://accueilseniorassistance.com/ (capture du 18/10/2026).
const ASA_MOBILE = IMG('_captures/asa-mobile.png');

// Couleurs relevées sur kleakagency.fr (styles Framer du site), pas choisies ici.
const T = {
  bleu: '#0F2FD1',      // boutons du site
  bleuNuit: '#050B7A',
  marine: '#090C3B',
  ciel: '#3DA8FF',
  blanc: '#FFFFFF',
  noir: '#0A0A0A',
};

// L'accroche capitale des anciennes pubs n'est pas une police du site. Anton
// penché est la plus proche disponible sans licence.
const HOOK = `font-family:'Anton',sans-serif; text-transform:uppercase; transform:skewX(-9deg); letter-spacing:.005em;`;

const FORMATS = [
  { key: 'post', W: 1080, H: 1350 },
  { key: 'story', W: 1080, H: 1920 },
];

const icone = (size) => `
  <div style="width:${size}px;height:${size}px;border-radius:${size * 0.24}px;
    background:linear-gradient(160deg,#2F6BFF 0%,${T.bleu} 100%);
    box-shadow:0 10px 30px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.35);
    display:flex;align-items:center;justify-content:center;">
    <img src="${LOGO}" style="width:${size * 0.5}px;">
  </div>`;

const telephone = (w, src, fond = '#1d1a17') => `
  <div style="width:${w}px;aspect-ratio:390/844;border-radius:${w * 0.15}px;background:#111;
    padding:${w * 0.035}px;box-shadow:0 40px 80px rgba(0,0,0,.45), 0 0 0 2px #3a3a3a, inset 0 0 0 2px #000;">
    <div style="width:100%;height:100%;border-radius:${w * 0.12}px;overflow:hidden;position:relative;
      background:${fond};">
      <div style="position:absolute;left:0;right:0;bottom:0;top:${w * 0.13}px;background:url(${src}) top center / cover no-repeat;"></div>
      <div style="position:absolute;top:${w * 0.03}px;left:50%;transform:translateX(-50%);
        width:${w * 0.3}px;height:${w * 0.085}px;border-radius:99px;background:#000;"></div>
    </div>
  </div>`;

const ordinateur = (w, src) => `
  <div style="width:${w}px;">
    <div style="border-radius:${w * 0.025}px ${w * 0.025}px 0 0;background:#111;padding:${w * 0.018}px;
      box-shadow:0 30px 70px rgba(0,0,0,.4), 0 0 0 2px #3a3a3a;">
      <div style="aspect-ratio:1440/900;background:url(${src}) top center / cover no-repeat;border-radius:4px;"></div>
    </div>
    <div style="height:${w * 0.03}px;margin:0 -${w * 0.06}px;border-radius:0 0 ${w * 0.03}px ${w * 0.03}px;
      background:linear-gradient(#d9dbe0,#9a9ca3);"></div>
  </div>`;

// Même cadre que telephone(), mais l'écran reçoit du HTML au lieu d'une capture.
// `contenu` est dessiné pour un écran de 390 px de large, mis à l'échelle ici.
const telephoneHtml = (w, contenu) => {
  const ecran = w - 2 * w * 0.035;
  return `
  <div style="width:${w}px;aspect-ratio:390/844;border-radius:${w * 0.15}px;background:#111;
    padding:${w * 0.035}px;box-shadow:0 40px 80px rgba(0,0,0,.45), 0 0 0 2px #3a3a3a, inset 0 0 0 2px #000;">
    <div style="width:100%;height:100%;border-radius:${w * 0.12}px;overflow:hidden;position:relative;background:#fff;">
      <div style="position:absolute;left:0;top:${w * 0.13}px;width:390px;height:2000px;
        transform:scale(${ecran / 390});transform-origin:top left;">${contenu}</div>
      <div style="position:absolute;top:${w * 0.03}px;left:50%;transform:translateX(-50%);
        width:${w * 0.3}px;height:${w * 0.085}px;border-radius:99px;background:#000;"></div>
    </div>
  </div>`;
};

// Un site vitrine daté, générique, inventé ici : aucune vraie entreprise, aucune
// capture. Page pensée pour ordinateur affichée telle quelle sur téléphone :
// police système, couleurs criardes, texte minuscule, lien de contact perdu.
const SITE_DATE = `
  <div style="width:980px;transform:scale(${390 / 980});transform-origin:top left;
    font-family:'Times New Roman',Times,serif;color:#222;background:#e9e9e9;">
    <div style="background:#1b3fa0;border-bottom:6px solid #ffd400;padding:18px 24px;">
      <div style="font-family:'Comic Sans MS',Arial,sans-serif;font-size:58px;font-weight:bold;color:#ffd400;
        text-shadow:3px 3px 0 #b00000;">VOTRE ENTREPRISE</div>
      <div style="font-size:22px;color:#fff;font-style:italic;">Bienvenue sur notre site internet !!!</div>
    </div>
    <div style="background:#cfcfcf;padding:8px 24px;font-size:20px;">
      <u style="color:#00c">Accueil</u> | <u style="color:#00c">Qui sommes-nous</u> | <u style="color:#00c">Nos prestations</u> |
      <u style="color:#00c">Galerie photos</u> | <u style="color:#00c">Liens utiles</u> | <u style="color:#00c">Plan d'accès</u>
    </div>
    <div style="display:flex;gap:18px;padding:18px 24px;">
      <div style="width:230px;flex:none;background:#fff8c4;border:2px solid #999;padding:12px;font-size:17px;line-height:1.3;">
        <b style="color:#b00000">ACTUALITÉS</b><br>Notre site fait peau neuve, revenez bientôt.<br><br>
        <b style="color:#b00000">HORAIRES</b><br>Du lundi au vendredi<br>8h30 à 12h et 14h à 18h<br><br>
        <b style="color:#b00000">NOUS TROUVER</b><br>Voir la page plan d'accès
      </div>
      <div style="flex:1;background:#fff;border:2px solid #999;padding:16px;font-size:17px;line-height:1.35;">
        <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Présentation</div>
        <div style="float:right;width:260px;height:180px;margin:0 0 10px 14px;background:
          repeating-linear-gradient(45deg,#bbb 0 12px,#c8c8c8 12px 24px);border:1px solid #888;"></div>
        Depuis de nombreuses années, notre entreprise met tout son savoir-faire à votre service pour
        répondre à vos besoins. Nous intervenons auprès des particuliers et des professionnels dans
        toute la région. Notre équipe est à votre écoute pour étudier votre projet et vous proposer
        une solution adaptée à votre budget. N'hésitez pas à parcourir les différentes pages de notre
        site pour en savoir plus sur nos prestations, nos réalisations et nos engagements. Nous
        restons à votre disposition pour tout renseignement complémentaire, par téléphone ou par
        courrier, aux horaires d'ouverture indiqués dans la colonne de gauche.
        <br><br>
        Nos prestations : étude, conseil, réalisation, suivi. Devis sur demande, déplacement possible
        selon les secteurs. Pour toute demande, merci d'utiliser la page contact ci-dessous.
        <div style="clear:both;margin-top:12px;font-size:14px;color:#00c;"><u>&gt;&gt; Contact</u></div>
      </div>
    </div>
    <div style="margin:0 24px;background:#fff;border:2px solid #999;padding:16px;">
      <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:10px;">Galerie photos</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
        ${Array.from({ length: 8 }, () => `<div style="height:150px;border:1px solid #888;background:
          repeating-linear-gradient(45deg,#bbb 0 12px,#c8c8c8 12px 24px);"></div>`).join('')}
      </div>
      <div style="font-size:14px;color:#00c;margin-top:10px;"><u>Cliquez sur une photo pour l'agrandir</u></div>
    </div>
    <div style="display:flex;gap:18px;padding:18px 24px;font-size:17px;line-height:1.35;">
      <div style="flex:1;background:#fff;border:2px solid #999;padding:16px;">
        <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Nos engagements</div>
        Qualité, sérieux, respect des délais et des budgets. Chaque projet est suivi du début à la fin
        par un interlocuteur unique. Nous travaillons avec des fournisseurs sélectionnés avec soin et
        nous vous accompagnons à chaque étape, de l'étude à la réalisation.
      </div>
      <div style="flex:1;background:#fff;border:2px solid #999;padding:16px;">
        <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Liens utiles</div>
        <u style="color:#00c">Notre plaquette (PDF)</u><br><u style="color:#00c">Conditions générales</u><br>
        <u style="color:#00c">Plan d'accès</u><br><u style="color:#00c">Livre d'or</u><br><u style="color:#00c">Contact</u>
      </div>
    </div>
    <div style="margin:0 24px 18px;background:#fff;border:2px solid #999;padding:16px;font-size:17px;line-height:1.35;">
      <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Nos prestations</div>
      <table style="width:100%;border-collapse:collapse;font-size:16px;">
        ${['Étude et conseil', 'Réalisation', 'Entretien', 'Dépannage', 'Suivi'].map((t) => `<tr>
          <td style="border:1px solid #999;padding:6px;background:#f2f2f2;width:35%;">${t}</td>
          <td style="border:1px solid #999;padding:6px;">Nous consulter. Devis sur demande, renseignements par téléphone.</td></tr>`).join('')}
      </table>
    </div>
    <div style="display:flex;gap:18px;padding:0 24px 18px;font-size:17px;line-height:1.35;">
      <div style="flex:1;background:#fff;border:2px solid #999;padding:16px;">
        <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Plan d'accès</div>
        <div style="height:260px;border:1px solid #888;background:
          repeating-linear-gradient(0deg,#d6d6d6 0 2px,#ececec 2px 40px),
          repeating-linear-gradient(90deg,#d6d6d6 0 2px,#ececec 2px 40px);background-blend-mode:multiply;"></div>
        <div style="font-size:14px;color:#00c;margin-top:8px;"><u>Imprimer le plan</u></div>
      </div>
      <div style="flex:1;background:#fff8c4;border:2px solid #999;padding:16px;">
        <div style="font-size:28px;font-weight:bold;color:#b00000;margin-bottom:8px;">Livre d'or</div>
        Laissez-nous un message dans notre livre d'or ! Vos remarques nous aident à nous améliorer.
        Merci de votre visite et à bientôt sur notre site.
        <br><br><u style="color:#00c">Signer le livre d'or</u> | <u style="color:#00c">Lire les messages</u>
      </div>
    </div>
    <div style="margin:0 24px 18px;background:#fff;border:2px solid #999;padding:16px;font-size:17px;line-height:1.35;">
      <div style="font-size:28px;font-weight:bold;color:#1b3fa0;margin-bottom:8px;">Contact</div>
      Pour nous joindre, merci de remplir le formulaire ci-dessous. Tous les champs sont obligatoires.
      ${['Nom', 'Prénom', 'Adresse', 'Code postal', 'Ville', 'Téléphone', 'Message'].map((c) => `<div style="display:flex;
        gap:10px;margin-top:8px;"><span style="width:160px;">${c} :</span><span style="flex:1;height:26px;border:1px solid #888;
        background:#fff;"></span></div>`).join('')}
      <div style="margin-top:10px;font-size:14px;"><u style="color:#00c">Envoyer</u> · <u style="color:#00c">Effacer</u></div>
    </div>
    <div style="background:#1b3fa0;color:#ccc;font-size:14px;text-align:center;padding:10px;">
      Site optimisé pour une résolution de 1024x768 · Tous droits réservés
    </div>
    <div style="background:#e9e9e9;padding:18px 24px;font-size:14px;color:#555;text-align:center;">
      Dernière mise à jour du site : voir page d'accueil · <u style="color:#00c">Haut de page</u>
    </div>
  </div>`;

const etoiles = (px) => `<span style="color:#FFC531;letter-spacing:.06em;font-size:${px}px;">★★★★★</span>`;

// ---------------------------------------------------------------------------
// LES CRÉAS
// ---------------------------------------------------------------------------
// Composition avant / après (créas c, d, e), validée en v2 le 18/10. Les variantes
// ne diffèrent que par le texte : txt = { l1: ligne blanche, l2: cartouche, sous }.
// L'« avant » est SITE_DATE (inventé, légendé « Illustration »), l'« après » la démo
// v2 (bandeau « entreprise fictive » non recouvert, doublé d'une légende). Pastille
// « dès 999 € · en 7 jours* » avec la condition de la fiche offre en bas. Story :
// rien d'important sous y = 1520 (bouton Meta et nom du compte).
// txt peut aussi fixer l'écran de l'après (apres, fondApres) et les légendes
// (legendeAvant, legendeApres). Par défaut : la démo fictive.
const avantApres = (fmt, txt) => {
  const ecranApres = txt.apres || DEMO_MOBILE_V2;
  const fondApres = txt.fondApres || '#1d1a17';
  const legendeAvant = txt.legendeAvant || 'Illustration';
  const legendeApres = txt.legendeApres || 'Démo Kleak · entreprise fictive';
  // Fond : par défaut celui de la v2. txt.fond = { haut, milieu, halo } pour l'assombrir.
  const fondHaut = (txt.fond && txt.fond.haut) || T.bleu;
  const fondMilieu = (txt.fond && txt.fond.milieu) || 75;
  const halo = (txt.fond && txt.fond.halo) || .55;
  const fleche = () => {
    const pts = txt.fleche && txt.fleche[fmt.key];
    if (!pts) return `<svg style="position:absolute;left:${xAvant + L.avantW - 50}px;top:${L.avant - (story ? 168 : 150)}px;"
        width="200" height="150" viewBox="0 0 200 150">
        <path d="M14 120 C 50 30, 120 20, 170 58" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
        <path d="M140 36 L 178 62 L 136 84" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    const [sx, sy, ex, ey] = pts;
    const c1x = sx + 10, c1y = sy - (sy - ey) * 1.1;   // monte d'abord
    const c2x = ex - (ex - sx) * .55, c2y = ey;        // arrive à l'horizontale
    const dx = ex - c2x, dy = ey - c2y, n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n, t = 30, a = 0.6;   // pointe : 30 px, ±34°
    const p1 = [ex - t * (ux * Math.cos(a) - uy * Math.sin(a)), ey - t * (uy * Math.cos(a) + ux * Math.sin(a))];
    const p2 = [ex - t * (ux * Math.cos(a) + uy * Math.sin(a)), ey - t * (uy * Math.cos(a) - ux * Math.sin(a))];
    return `<svg style="position:absolute;left:0;top:0;" width="${fmt.W}" height="${fmt.H}" viewBox="0 0 ${fmt.W} ${fmt.H}">
        <path d="M${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
        <path d="M${p1[0]} ${p1[1]} L ${ex} ${ey} L ${p2[0]} ${p2[1]}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  };
  const note = txt.note || "* 7 jours ouvrés après réception de vos contenus et de l'acompte. Formule Essentiel.";
      const story = fmt.key === 'story';
      // Positions verticales par format. La story ne descend pas sous y = 1520.
      // txt.layout = { post: {...}, story: {...} } surcharge ces positions pour une créa.
      const L0 = story
        ? { icone: 90, iconeT: 90, hook: 205, hookPx: 128, cartPx: 120, texte: 505, textePx: 40,
            apres: 690, apresW: 310, avant: 785, avantW: 240, note: 1448 }
        : { icone: 36, iconeT: 76, hook: 128, hookPx: 104, cartPx: 98, texte: 378, textePx: 34,
            apres: 548, apresW: 306, avant: 640, avantW: 230, note: 1312 };
      const L = { xApres: 470, xAvant: 90, pastilleX: story ? 784 : 792, ...L0, ...(txt.layout && txt.layout[fmt.key]) };
      const hApres = L.apresW * 844 / 390;
      const hAvant = L.avantW * 844 / 390;
      const xApres = L.xApres;           // bord gauche du téléphone après
      const xAvant = L.xAvant;
      const etiquette = (txt, fond, couleur, ombre, px) => `
        <div style="display:inline-block;background:${fond};border-radius:16px;padding:10px 34px 6px;
          box-shadow:7px 8px 0 ${ombre};transform:rotate(-3deg);">
          <div style="${HOOK} color:${couleur};font-size:${px}px;line-height:1.1;">${txt}</div>
        </div>`;
      const legende = (txt, op) => `font-family:Manrope;color:rgba(255,255,255,${op});font-size:${txt.legendePx ? txt.legendePx[story ? 1 : 0] : (story ? 28 : 25)}px;font-weight:700;`;
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(${story ? 760 : 680}px ${story ? 900 : 760}px at ${xApres + L.apresW / 2}px ${L.apres + hApres / 2}px,
          rgba(61,168,255,${halo}), rgba(61,168,255,${halo / 3}) 45%, transparent 70%),
        linear-gradient(170deg, ${fondHaut} 0%, ${T.bleuNuit} ${fondMilieu}%, ${T.marine} 100%);"></div>
      <div style="position:absolute;top:${L.icone}px;left:50%;transform:translateX(-50%);">${icone(L.iconeT)}</div>

      <div style="position:absolute;left:0;right:0;top:${L.hook}px;text-align:center;">
        <div style="${HOOK} color:#fff;font-size:${L.hookPx}px;line-height:1;">${txt.l1}</div>
        <div style="display:inline-block;margin-top:14px;background:#fff;border-radius:22px;padding:4px 34px 0;
          box-shadow:10px 12px 0 #000;transform:rotate(-2deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${L.cartPx}px;line-height:1.06;">${txt.l2}</div>
        </div>
      </div>
      <div style="position:absolute;left:40px;right:40px;top:${L.texte}px;text-align:center;color:#fff;
        font-family:Manrope;font-size:${L.textePx}px;line-height:1.2;font-weight:500;">
        ${txt.sous}</div>

      <!-- AVANT : en retrait, plus petit, assombri -->
      <div style="position:absolute;left:${xAvant - 20}px;top:${L.avant - (story ? 96 : 88)}px;width:${L.avantW + 40}px;text-align:center;">
        ${etiquette('Avant', '#9a9ca3', '#1b1b1f', 'rgba(0,0,0,.55)', story ? 50 : 44)}
      </div>
      <div style="position:absolute;left:${xAvant}px;top:${L.avant}px;transform:rotate(-7deg);
        filter:saturate(.55) brightness(.72);">${telephoneHtml(L.avantW, SITE_DATE)}</div>
      <div style="position:absolute;left:${xAvant - 60}px;width:${L.avantW + 120}px;top:${L.avant + hAvant + (story ? 34 : 26)}px;
        text-align:center;white-space:nowrap;${legende(txt, txt.legendePx ? .85 : .75)}">${legendeAvant}</div>

      <!-- Flèche avant -> après, en coordonnées de la page. Par défaut, l'ancien tracé ;
           txt.fleche = { post: [sx, sy, ex, ey], story: [...] } pour un tracé qui ne touche
           ni la bulle « Avant » ni la bulle « Après » ni le téléphone. -->
      ${fleche()}

      <!-- APRÈS : le héros -->
      <div style="position:absolute;left:${xApres}px;top:${L.apres}px;transform:rotate(4deg);
        filter:drop-shadow(0 0 60px rgba(61,168,255,.55));">${telephone(L.apresW, ecranApres, fondApres)}</div>
      <div style="position:absolute;left:${xApres + 30}px;top:${L.apres - (story ? 112 : 102)}px;">
        ${etiquette('Après', '#fff', T.bleu, '#000', story ? 68 : 60)}
      </div>
      <div style="position:absolute;left:${xApres - 60}px;width:${L.apresW + 120}px;top:${L.apres + hApres + (story ? 26 : 22)}px;
        text-align:center;line-height:1.25;${legende(txt, 1)}">${legendeApres}</div>

      <!-- Pastille offre, conforme à la fiche (formule Essentiel) -->
      <div style="position:absolute;left:${L.pastilleX}px;top:${L.apres + hApres * (story ? .52 : .5)}px;width:${story ? 262 : 250}px;height:${story ? 262 : 250}px;
        border-radius:50%;background:#fff;box-shadow:8px 10px 0 #000, 0 20px 50px rgba(0,0,0,.35);transform:rotate(-10deg);
        display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <div style="${HOOK} color:${T.bleu};font-size:${story ? 56 : 52}px;line-height:.98;">dès<br>999 €</div>
        <div style="${HOOK} color:#0A0A0A;font-size:${story ? 31 : 29}px;line-height:1.1;margin-top:8px;">en 7 jours*</div>
      </div>

      <div style="position:absolute;left:40px;right:40px;top:${L.note}px;text-align:center;font-family:Manrope;
        color:rgba(255,255,255,.7);font-size:${story ? 22 : 19}px;font-weight:500;">
        ${story ? note.replace(' Formule', '<br>Formule') : note}</div>`;
};

const CREAS = {
  // A. L'accroche de marque, reprise de l'ancienne Kleak, avec un vrai site
  // construit par l'agence dans le téléphone (la démo affiche elle-même
  // « entreprise fictive » en haut de l'écran).
  a: {
    key: 'a-un-kleak',
    html: (fmt) => {
      const story = fmt.key === 'story';
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(900px 700px at 85% 35%, rgba(61,168,255,.35), transparent 60%),
        linear-gradient(165deg, ${T.bleu} 0%, ${T.bleuNuit} 100%);"></div>
      <div style="position:absolute;top:${story ? 150 : 70}px;left:50%;transform:translateX(-50%);">${icone(story ? 104 : 96)}</div>

      <div style="position:absolute;left:70px;top:${story ? 330 : 220}px;">
        <div style="${HOOK} color:#fff;font-size:${story ? 168 : 150}px;line-height:.98;">Un<br>site web<br>en un</div>
        <div style="display:inline-block;margin-top:${story ? 18 : 14}px;margin-left:-8px;background:#fff;border-radius:22px;
          padding:${story ? '6px 34px 2px' : '4px 30px 0'};box-shadow:10px 12px 0 #000;transform:rotate(-3deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${story ? 182 : 162}px;line-height:1.05;">Kleak</div>
        </div>
      </div>

      <div style="position:absolute;right:${story ? 70 : 60}px;top:${story ? 520 : 230}px;transform:rotate(6deg);">
        ${telephone(story ? 330 : 330, DEMO_MOBILE)}
      </div>

      <div style="position:absolute;left:70px;right:70px;top:${story ? 1260 : 1000}px;color:#fff;
        font-family:Manrope;font-size:${story ? 44 : 42}px;line-height:1.3;font-weight:500;">
        Votre site vitrine, conçu et mis en ligne<br>par <b style="font-weight:800">une agence qui s'occupe de tout</b>
      </div>
      <div style="position:absolute;left:70px;top:${story ? 1420 : 1160}px;display:flex;align-items:center;gap:18px;
        font-family:Manrope;color:#fff;font-size:${story ? 34 : 32}px;font-weight:600;">
        ${etoiles(story ? 36 : 34)}<span>4,8/5 sur Google</span>
      </div>`;
    },
  },

  // B. L'offre telle qu'elle est vendue : prix fixe, délai, 3 pages, et un avis
  // client réel. L'astérisque renvoie à la condition de démarrage du délai,
  // recopiée de la fiche offre.
  b: {
    key: 'b-7-jours-999',
    html: (fmt) => {
      const story = fmt.key === 'story';
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(1000px 600px at 50% 105%, rgba(61,168,255,.30), transparent 60%),
        linear-gradient(180deg, ${T.marine} 0%, ${T.noir} 100%);"></div>
      <div style="position:absolute;top:${story ? 150 : 70}px;left:50%;transform:translateX(-50%);">${icone(story ? 104 : 96)}</div>

      <div style="position:absolute;left:0;right:0;top:${story ? 320 : 215}px;text-align:center;">
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;">Votre site vitrine</div>
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;margin-top:6px;">en 7 jours<sup style="font-size:.4em;vertical-align:1.1em;">*</sup></div>
        <div style="display:inline-block;margin-top:26px;background:#fff;border-radius:22px;padding:4px 34px 0;
          box-shadow:10px 12px 0 ${T.bleu};transform:rotate(-2deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${story ? 120 : 108}px;line-height:1.08;">dès 999 €</div>
        </div>
        <div style="font-family:Manrope;color:rgba(255,255,255,.8);font-size:${story ? 36 : 34}px;font-weight:500;margin-top:28px;">
          Prix fixe · 3 pages · mentions légales et RGPD inclus
        </div>
      </div>

      <div style="position:absolute;left:50%;top:${story ? 900 : 760}px;transform:translateX(-50%);">
        ${ordinateur(story ? 820 : 760, DEMO_DESKTOP)}
      </div>

      <div style="position:absolute;right:50px;top:${story ? 1200 : 1000}px;width:${story ? 560 : 520}px;
        background:#fff;border-radius:26px;padding:28px 32px;
        box-shadow:0 25px 60px rgba(0,0,0,.45);font-family:Manrope;color:#141414;transform:rotate(-2deg);">
        ${etoiles(30)}
        <div style="font-size:${story ? 29 : 27}px;line-height:1.35;font-weight:500;margin:12px 0 14px;">
          « Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci »
        </div>
        <div style="font-size:22px;font-weight:700;">Laura Dias <span style="font-weight:500;color:#666">· Mega Content</span></div>
      </div>

      <div style="position:absolute;left:50px;bottom:${story ? 420 : 34}px;font-family:Manrope;color:rgba(255,255,255,.55);
        font-size:20px;font-weight:500;">* 7 jours ouvrés après réception de vos contenus et de l'acompte. Formule Essentiel.</div>`;
    },
  },

  // C, D, E. Avant / après, trois accroches (18/10/2026, 2e retour d'Edgar : « les
  // textes sont pas terribles », bulles trop pleines). Même composition (avantApres),
  // seuls l'accroche et le sous-titre changent. Chacune parle de ce que le dirigeant
  // gagne ou ressent, pas de technique.
  // Historique : v1 « Votre site vitrine, version Kleak » sans prix (jugée plate) ;
  // v2 même accroche, après en héros, pastille prix (accroche jugée faible).
  // ÉCARTÉ VOLONTAIREMENT : tout chiffre de résultat, tout « nos clients ont… »
  // (l'après est une démo fictive), toute promesse qu'on va « vous trouver » sur Google.

  // C. ÉCARTÉE par Edgar le 18/10 : accroche générique.
  // c: {
  //   key: 'c-avant-apres',
  //   html: (fmt) => avantApres(fmt, {
  //     l1: 'Un site dont vous', l2: 'serez fier',
  //     sous: `À vos couleurs, <b style="font-weight:800">clair et net sur téléphone</b>`,
  //   }),
  // },

  // D. Le contact : un site qui donne envie d'appeler. « Facile à contacter »
  // décrit le site (formulaire, fiche offre), pas un résultat. VALIDÉE (visuel)
  // par Edgar le 18/10. L'après est une vraie réalisation Kleak, Accueil Sénior
  // Assistance (_captures/asa-mobile.png), à la place de la démo fictive : la
  // légende dit donc « Réalisation Kleak », plus « entreprise fictive ». L'avant
  // reste légendé « Avant : illustration » pour qu'on ne croie pas que ce client
  // avait ce site avant. Aucun propos ni résultat prêté au client.
  d: {
    key: 'd-avant-apres-appeler',
    html: (fmt) => avantApres(fmt, {
      l1: 'Un site qui donne', l2: "envie d'appeler",
      sous: `Clair dès le premier écran, <b style="font-weight:800">facile à contacter</b>`,
      apres: ASA_MOBILE, fondApres: '#BFE3F2',
      // 19/10 : Edgar préfère des arguments aux légendes (ses mots, mot pour mot) ;
      // « Avant : illustration » passe en petit dans la ligne de condition.
      legendeAvant: 'Site vieillot',
      legendeApres: 'Site moderne et fluide',
      legendePx: [30, 34],
      // 19/10 : la flèche ne touche plus les bulles, et le fond est un cran plus sombre.
      fleche: { post: [330, 666, 485, 568], story: [345, 805, 491, 698] },
      // 19/10 : plus d'air sous le sous-titre (+70 px), téléphones réduits de 10 %,
      // centres conservés.
      layout: {
        post: { apres: 618, apresW: 276, xApres: 485, avant: 710, avantW: 207, xAvant: 101, pastilleX: 777 },
        story: { apres: 760, apresW: 280, xApres: 485, avant: 855, avantW: 216, xAvant: 102, pastilleX: 769 },
      },
      fond: { haut: '#0A22B0', milieu: 55, halo: .38 },
      note: "* 7 jours ouvrés après réception de vos contenus et de l'acompte. Formule Essentiel. Avant : illustration.",
    }),
  },

  // E. ÉCARTÉE par Edgar le 18/10 : « j'aime pas cette accroche ».
  // e: {
  //   key: 'e-avant-apres-montrer',
  //   html: (fmt) => avantApres(fmt, {
  //     l1: "Fini le site qu'on", l2: "n'ose pas montrer",
  //     sous: `Un site clair, <b style="font-weight:800">à votre image</b>, net sur téléphone`,
  //   }),
  // },
};

function page(fmt, crea) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${fmt.W}px; height:${fmt.H}px; position:relative; overflow:hidden; background:${T.noir}; }
  </style></head><body>${crea.html(fmt)}</body></html>`;
}

// --- Rendu -----------------------------------------------------------------
const arg = process.argv[2];
if (arg && !CREAS[arg]) {
  console.error(`Créa inconnue : ${arg}. Attendu : ${Object.keys(CREAS).join(' | ')}`);
  process.exit(1);
}
const choix = arg ? [CREAS[arg]] : Object.values(CREAS);
// Tant que la créa n'est pas validée, on ne rend que le post.
const formats = arg ? FORMATS : FORMATS.filter((f) => f.key === 'post');

const browser = await chromium.launch({ channel: 'chromium' });
let ecrits = 0;
for (const crea of choix) {
  for (const fmt of formats) {
    const dest = join(__dirname, 'rendus', fmt.key);
    mkdirSync(dest, { recursive: true });
    const base = `${crea.key}-${fmt.key}`;
    const file = join(HTML_DIR, `${base}.html`);
    writeFileSync(file, page(fmt, crea));
    const p = await browser.newPage({ viewport: { width: fmt.W, height: fmt.H }, deviceScaleFactor: 2 });
    await p.goto(`file://${file}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(450);
    await p.screenshot({ path: join(dest, `${base}.png`) });
    await p.close();
    ecrits++;
  }
}
await browser.close();
const attendu = choix.length * formats.length;
if (ecrits !== attendu) { console.error(`${ecrits} fichiers écrits sur ${attendu} attendus.`); process.exit(1); }
console.log(`${ecrits} fichiers écrits.`);
