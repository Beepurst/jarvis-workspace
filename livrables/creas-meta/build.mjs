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


// --- Briques de la DA « fine » (série 5, créas j et k) -------------------------
// Tirées des références Orbikal (assets/references-da/), la DA seule : une accroche
// en phrase normale, semi-grasse, taille moyenne, beaucoup de vide ; un seul objet
// réaliste ou deux cartes en verre dont une seule en avant ; marque petite.
const FONTS_FIN = `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet">`;
const TITRE_FIN = `font-family:'Inter Tight',sans-serif;font-weight:600;letter-spacing:-.022em;color:#F3F4F7;`;
const italique = (mot) => `<span style="font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:0;font-size:1.1em;">${mot}</span>`;
// Grain de papier (SVG feTurbulence), dans une classe pour éviter les guillemets imbriqués.
const STYLE_FIN = `<style>
  .grain { background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
 .encre { -webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.1'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>"); }
</style>`;
// Fond presque noir, halo chaud derrière l'objet (cx, cy), halo bleu Kleak discret en haut à droite.
const fondFin = (fmt, cx, cy) => `${STYLE_FIN}
  <div style="position:absolute;inset:0;background:
    radial-gradient(${fmt.W * .8}px ${fmt.W * .75}px at ${cx}px ${cy}px, rgba(118,62,24,.42), rgba(70,36,14,.16) 45%, transparent 72%),
    radial-gradient(${fmt.W * .7}px ${fmt.W * .5}px at 92% 4%, rgba(15,47,209,.20), transparent 70%),
    #0A0B0F;"></div>
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.035) 1px, transparent 1.3px);
    background-size:26px 26px;"></div>`;
const marquePetite = (story) => `
  <div style="display:flex;align-items:center;gap:14px;font-family:Manrope;font-weight:600;
    font-size:${story ? 24 : 22}px;color:rgba(255,255,255,.62);">${icone(story ? 44 : 40)}Kleak Agency</div>`;

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

      <!-- Pastille offre, conforme à la fiche. txt.pastille = { prix, delai } ; par défaut
           l'ancienne Essentiel (dès 999 €, en 7 jours*). -->
      <div style="position:absolute;left:${L.pastilleX}px;top:${L.apres + hApres * (story ? .52 : .5)}px;width:${story ? 262 : 250}px;height:${story ? 262 : 250}px;
        border-radius:50%;background:#fff;box-shadow:8px 10px 0 #000, 0 20px 50px rgba(0,0,0,.35);transform:rotate(-10deg);
        display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <div style="${HOOK} color:${T.bleu};font-size:${story ? 56 : 52}px;line-height:.98;">dès<br>${(txt.pastille && txt.pastille.prix) || '999 €'}</div>
        <div style="${HOOK} color:#0A0A0A;font-size:${story ? 31 : 29}px;line-height:1.1;margin-top:8px;">${(txt.pastille && txt.pastille.delai) || 'en 7 jours*'}</div>
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
    // 21/10 : Edgar veut l'offre la plus basse. One page à la place d'Essentiel :
    // 699 € (le prix le plus bas de la fiche, d'où « dès »), 5 jours ouvrés après
    // réception des contenus et du premier paiement, 1 page. Mentions légales,
    // bandeau cookies et RGPD sont aussi dans le One page. Composition inchangée.
    // Fichier renommé (ex b-7-jours-999).
    key: 'b-5-jours-699',
    html: (fmt) => {
      const story = fmt.key === 'story';
      return `
      <div style="position:absolute;inset:0;background:
        radial-gradient(1000px 600px at 50% 105%, rgba(61,168,255,.30), transparent 60%),
        linear-gradient(180deg, ${T.marine} 0%, ${T.noir} 100%);"></div>
      <div style="position:absolute;top:${story ? 150 : 70}px;left:50%;transform:translateX(-50%);">${icone(story ? 104 : 96)}</div>

      <div style="position:absolute;left:0;right:0;top:${story ? 320 : 215}px;text-align:center;">
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;">Votre site vitrine</div>
        <div style="${HOOK} color:#fff;font-size:${story ? 128 : 118}px;line-height:1;margin-top:6px;">en 5 jours<sup style="font-size:.4em;vertical-align:1.1em;">*</sup></div>
        <div style="display:inline-block;margin-top:26px;background:#fff;border-radius:22px;padding:4px 34px 0;
          box-shadow:10px 12px 0 ${T.bleu};transform:rotate(-2deg);">
          <div style="${HOOK} color:${T.bleu};font-size:${story ? 120 : 108}px;line-height:1.08;">dès 699 €</div>
        </div>
        <div style="font-family:Manrope;color:rgba(255,255,255,.8);font-size:${story ? 36 : 34}px;font-weight:500;margin-top:28px;">
          Prix fixe · 1 page · mentions légales et RGPD inclus
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
        font-size:20px;font-weight:500;">* 5 jours ouvrés après réception de vos contenus et du premier paiement. Formule One page.</div>`;
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
      // 21/10 : One page à la place d'Essentiel (offre la plus basse), même composition.
      pastille: { prix: '699 €', delai: 'en 5 jours*' },
      note: "* 5 jours ouvrés après réception de vos contenus et du premier paiement. Formule One page. Avant : illustration.",
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

  // F, G, H, I. ÉCARTÉES par Edgar le 21/10/2026, PNG supprimés. Ses mots : « j'aime
  // pas », « trop d'informations, on va perdre les visiteurs », « ça fait trop IA, ça
  // se voit que c'est Claude qui les a faits, il faut plus raffiné, plus fin, comme les
  // références » et « on parle trop de prix ». F et G : série 3 (Anton, fond clair,
  // échéancier en cases, fiche rapport). H et I : série 4, DA « verre sombre » trop
  // chargée (tuiles, pastilles répétées, chiffres géants, en-têtes mono). Les briques
  // de la série 4 (FONTS_VERRE, GROT, MONO, SERIF, libelleMono, pastilleStatut,
  // verreFond, carteVerre) sont retirées du fichier : ce code commenté ne tourne plus.
  // // F. Le paiement en 6 fois sans frais (série 3, 21/10/2026). Angle : le prix
  // // fait peur d'un coup, pas en six fois. Composition nouvelle : fond clair (le seul
  // // de la série, pour trancher dans le fil), accroche bleue, échéancier en 6 cases.
  // // D'OÙ ÇA VIENT : fiche offre, « Payer en une fois ou en 6 fois » : Essentiel
  // // 6 × 166,50 €, premier versement à la signature puis prélèvement automatique
  // // chaque mois, maintenance comprise dans ce mode de paiement (démarre à la mise en
  // // ligne), site à vous au dernier versement, mise en ligne à la livraison. La
  // // condition est recopiée en bas, mot pour mot.
  // // ÉCARTÉ VOLONTAIREMENT : « 999 € au total » (la maintenance comprise rend le total
  // // ambigu, à trancher par Edgar), le délai de 7 jours (une idée par créa), One page
  // // et Pro (une seule formule pour rester lisible), toute démo ou capture.
  // f: {
  //   key: 'f-6-fois-sans-frais',
  //   html: (fmt) => {
  //     const story = fmt.key === 'story';
  //     // Story : tout au-dessus de y = 1520.
  //     const L = story
  //       ? { icone: 120, iconeT: 104, hook: 290, l1Px: 128, cartPx: 118, sous: 660, sousPx: 40,
  //           grille: 790, caseH: 250, gap: 26, note: 1395, notePx: 22 }
  //       : { icone: 60, iconeT: 96, hook: 200, l1Px: 116, cartPx: 96, sous: 530, sousPx: 36,
  //           grille: 650, caseH: 236, gap: 24, note: 1192, notePx: 19 };
  //     const cases = [
  //       ['1er versement', 'à la signature'],
  //       ['2e', 'prélèvement'],
  //       ['3e', 'prélèvement'],
  //       ['4e', 'prélèvement'],
  //       ['5e', 'prélèvement'],
  //       ['6e', 'le site est à vous'],
  //     ];
  //     const carte = ([rang, quand], i) => {
  //       const fin = i === 5;
  //       return `
  //       <div style="height:${L.caseH}px;border-radius:26px;padding:26px 24px 0;text-align:left;
  //         background:${fin ? T.bleu : '#fff'};color:${fin ? '#fff' : T.marine};
  //         box-shadow:${fin ? '8px 10px 0 #000' : '0 14px 34px rgba(9,12,59,.12)'};
  //         ${fin ? 'transform:rotate(-2deg);' : ''}">
  //         <div style="font-family:Manrope;font-weight:800;font-size:${story ? 30 : 28}px;
  //           color:${fin ? 'rgba(255,255,255,.85)' : 'rgba(9,12,59,.55)'};">${rang}</div>
  //         <div style="${HOOK} font-size:${story ? 78 : 74}px;line-height:1.1;margin-top:10px;
  //           color:${fin ? '#fff' : T.bleu};">166,50 €</div>
  //         <div style="font-family:Manrope;font-weight:700;font-size:${story ? 29 : 27}px;margin-top:6px;">${quand}</div>
  //       </div>`;
  //     };
  //     return `
  //     <div style="position:absolute;inset:0;background:
  //       radial-gradient(900px 700px at 50% 100%, rgba(61,168,255,.22), transparent 65%),
  //       linear-gradient(180deg, #F3F5FF 0%, #E4E9FF 100%);"></div>
  //     <div style="position:absolute;top:${L.icone}px;left:50%;transform:translateX(-50%);">${icone(L.iconeT)}</div>
  //
  //     <div style="position:absolute;left:0;right:0;top:${L.hook}px;text-align:center;">
  //       <div style="${HOOK} color:${T.marine};font-size:${L.l1Px}px;line-height:1;">Votre site vitrine</div>
  //       <div style="display:inline-block;margin-top:20px;background:${T.bleu};border-radius:22px;padding:4px 36px 0;
  //         box-shadow:10px 12px 0 #000;transform:rotate(-2deg);">
  //         <div style="${HOOK} color:#fff;font-size:${L.cartPx}px;line-height:1.08;">en 6 fois sans frais</div>
  //       </div>
  //     </div>
  //     <div style="position:absolute;left:40px;right:40px;top:${L.sous}px;text-align:center;color:${T.marine};
  //       font-family:Manrope;font-size:${L.sousPx}px;line-height:1.25;font-weight:500;">
  //       Formule Essentiel, 3 pages, <b style="font-weight:800">en ligne dès la livraison</b></div>
  //
  //     <div style="position:absolute;left:70px;right:70px;top:${L.grille}px;display:grid;
  //       grid-template-columns:repeat(3,1fr);gap:${L.gap}px;">
  //       ${cases.map(carte).join('')}
  //     </div>
  //
  //     <div style="position:absolute;left:30px;right:30px;top:${L.note}px;text-align:center;font-family:Manrope;
  //       color:rgba(9,12,59,.65);font-size:${L.notePx}px;line-height:1.4;font-weight:500;">
  //       Formule Essentiel. Premier versement à la signature, puis un prélèvement automatique chaque mois.<br>
  //       La maintenance est comprise dans ce mode de paiement et démarre à la mise en ligne.<br>
  //       Le site vous appartient au dernier versement.</div>`;
  //   },
  // },
  //
  // // G. Le suivi après la mise en ligne (série 3, 21/10/2026). Angle : le dirigeant
  // // n'a pas à s'occuper de son site une fois livré. Composition nouvelle : fiche
  // // « Rapport mensuel » blanche au centre, ce qui est inclus coché, pastille prix.
  // // D'OÙ ÇA VIENT : fiche offre, « Maintenance et hébergement », colonne Essentiel et
  // // Pro : 90 € par mois, hébergement inclus, mises à jour techniques et surveillance,
  // // 30 minutes de petites modifications par mois, rapport mensuel « visiteurs, d'où
  // // ils viennent, demandes reçues », engagement de 12 mois (dans la condition).
  // // ÉCARTÉ VOLONTAIREMENT : tout chiffre dans le rapport (les lignes sont des
  // // emplacements vides, aucun visiteur ni demande inventés), la capture d'Orbikal
  // // (en pause, pas dans la fiche offre), la formule One page à 49 € (une seule ligne
  // // de prix), le prix du site.
  // g: {
  //   key: 'g-suivi-chaque-mois',
  //   html: (fmt) => {
  //     const story = fmt.key === 'story';
  //     // Story : tout au-dessus de y = 1520.
  //     const L = story
  //       ? { icone: 120, iconeT: 104, hook: 280, l1Px: 112, cartPx: 100, sous: 640, sousPx: 40,
  //           carte: 770, carteW: 900, rowPx: 34, pastilleX: 760, pastilleY: 700, note: 1440, notePx: 22 }
  //       : { icone: 54, iconeT: 92, hook: 170, l1Px: 100, cartPx: 90, sous: 528, sousPx: 35,
  //           carte: 640, carteW: 880, rowPx: 32, pastilleX: 800, pastilleY: 600, note: 1296, notePx: 20 };
  //     const coche = (fond) => `<span style="flex:none;width:${L.rowPx + 8}px;height:${L.rowPx + 8}px;border-radius:50%;
  //       background:${fond};color:#fff;display:inline-flex;align-items:center;justify-content:center;
  //       font-size:${L.rowPx * .8}px;font-weight:800;">✓</span>`;
  //     const ligneRapport = (titre, w) => `
  //       <div style="display:flex;align-items:center;gap:22px;padding:${story ? 20 : 16}px 0;border-top:2px solid #EEF0F7;">
  //         <div style="width:${story ? 330 : 310}px;font-weight:700;font-size:${L.rowPx}px;color:${T.marine};">${titre}</div>
  //         <div style="flex:1;height:18px;border-radius:99px;background:#EEF0F7;">
  //           <div style="width:${w}%;height:100%;border-radius:99px;background:linear-gradient(90deg,#BFD0FF,#DCE4FF);"></div>
  //         </div>
  //       </div>`;
  //     const inclus = (txt) => `
  //       <div style="display:flex;align-items:center;gap:18px;font-weight:700;font-size:${L.rowPx}px;color:${T.marine};
  //         margin-top:${story ? 20 : 16}px;">${coche(T.bleu)}<span>${txt}</span></div>`;
  //     return `
  //     <div style="position:absolute;inset:0;background:
  //       radial-gradient(800px 700px at 50% 70%, rgba(61,168,255,.32), transparent 65%),
  //       linear-gradient(170deg, ${T.bleuNuit} 0%, ${T.marine} 100%);"></div>
  //     <div style="position:absolute;top:${L.icone}px;left:50%;transform:translateX(-50%);">${icone(L.iconeT)}</div>
  //
  //     <div style="position:absolute;left:0;right:0;top:${L.hook}px;text-align:center;">
  //       <div style="${HOOK} color:#fff;font-size:${L.l1Px}px;line-height:1.02;">On s'occupe<br>de votre site</div>
  //       <div style="display:inline-block;margin-top:16px;background:#fff;border-radius:22px;padding:4px 34px 0;
  //         box-shadow:10px 12px 0 ${T.bleu};transform:rotate(-2deg);">
  //         <div style="${HOOK} color:${T.bleu};font-size:${L.cartPx}px;line-height:1.08;">après la mise en ligne</div>
  //       </div>
  //     </div>
  //     <div style="position:absolute;left:40px;right:40px;top:${L.sous}px;text-align:center;color:#fff;
  //       font-family:Manrope;font-size:${L.sousPx}px;line-height:1.25;font-weight:500;">
  //       Hébergement, mises à jour, <b style="font-weight:800">et un rapport chaque mois</b></div>
  //
  //     <div style="position:absolute;left:50%;top:${L.carte}px;width:${L.carteW}px;transform:translateX(-50%) rotate(-1.5deg);
  //       background:#fff;border-radius:30px;padding:${story ? '40px 48px 44px' : '34px 44px 38px'};
  //       box-shadow:0 30px 70px rgba(0,0,0,.45);font-family:Manrope;">
  //       <div style="display:flex;align-items:center;gap:18px;margin-bottom:${story ? 18 : 14}px;">
  //         ${icone(story ? 60 : 54)}
  //         <div style="font-weight:800;font-size:${L.rowPx + 8}px;color:${T.marine};">Rapport mensuel</div>
  //       </div>
  //       ${ligneRapport('Visiteurs', 72)}
  //       ${ligneRapport("D'où ils viennent", 54)}
  //       ${ligneRapport('Demandes reçues', 38)}
  //       <div style="border-top:2px solid #EEF0F7;margin-top:4px;padding-top:${story ? 8 : 4}px;">
  //         ${inclus('Hébergement inclus')}
  //         ${inclus('Mises à jour techniques et surveillance')}
  //         ${inclus('30 minutes de petites modifications par mois')}
  //       </div>
  //     </div>
  //
  //     <div style="position:absolute;left:${L.pastilleX}px;top:${L.pastilleY}px;width:${story ? 230 : 210}px;height:${story ? 230 : 210}px;
  //       border-radius:50%;background:${T.bleu};box-shadow:8px 10px 0 #000, 0 20px 50px rgba(0,0,0,.35);transform:rotate(-10deg);
  //       display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
  //       <div style="${HOOK} color:#fff;font-size:${story ? 74 : 68}px;line-height:1;">90 €</div>
  //       <div style="${HOOK} color:#fff;font-size:${story ? 32 : 30}px;line-height:1.1;margin-top:4px;">par mois*</div>
  //     </div>
  //
  //     <div style="position:absolute;left:40px;right:40px;top:${L.note}px;text-align:center;font-family:Manrope;
  //       color:rgba(255,255,255,.7);font-size:${L.notePx}px;line-height:1.4;font-weight:500;">
  //       * Maintenance des formules Essentiel et Pro. Engagement de 12 mois.</div>`;
  //   },
  // },
  // // ---------------------------------------------------------------------------
  // // DA « verre sombre » (série 4, 21/10/2026), demandée par Edgar à partir de deux
  // // créas Orbikal (assets/references-da/orbikal-ticket.png et orbikal-avant-apres.png).
  // // On reprend la DA seule, jamais le contenu ni la marque Orbikal : fond presque
  // // noir, halo ambre d'un côté et bleu de l'autre, trame de points discrète, cartes
  // // en verre (fond translucide, bord fin lumineux, reflet), lueur ambre vers bleu
  // // autour de la carte mise en avant, titre en grotesque très gras avec un mot en
  // // serif italique, libellés en mono capitales espacées, gros chiffres, pastilles.
  // // Le bleu Kleak et le K remplacent l'orange et le logo Orbikal. Polices :
  // // Inter Tight 800, Instrument Serif italique, JetBrains Mono (Google Fonts).
  // // Briques : verreFond, carteVerre, libelleMono, pastilleStatut.
  // // ---------------------------------------------------------------------------
  //
  // // H. Même angle et même contenu que F (paiement en 6 fois), en DA verre sombre.
  // // CORRECTION par rapport à F : la condition ne dit plus « la maintenance est
  // // comprise ». Source : livrables/offre/note-interne-offre.md (Encaissement) : la
  // // maintenance est obligatoire, démarre à la mise en ligne et s'ajoute aux
  // // versements. Elle est donc montrée dans l'image (carte « + 90 €/mois ») et dans
  // // la condition. ÉCARTÉ : « 999 € au total » (faux une fois la maintenance
  // // ajoutée), le délai (une idée par créa), One page et Pro.
  // h: {
  //   key: 'h-6-fois-verre',
  //   fonts: FONTS_VERRE,
  //   html: (fmt) => {
  //     const story = fmt.key === 'story';
  //     const s = story ? 1.06 : 1;
  //     const etape = (n) => {
  //       const fin = n === 6;
  //       return `<div style="flex:1;text-align:center;">
  //         <div style="height:12px;border-radius:99px;background:${fin ? T.bleu : 'rgba(255,255,255,.28)'};
  //           ${fin ? `box-shadow:0 0 18px ${T.bleu};` : ''}"></div>
  //         <div style="${MONO} font-size:${24 * s}px;color:${fin ? '#fff' : 'rgba(255,255,255,.75)'};margin-top:14px;">${n}</div>
  //       </div>`;
  //     };
  //     return `
  //     ${verreFond(fmt)}
  //     <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${story ? 210 : 80}px;bottom:${story ? 400 : 60}px;
  //       display:flex;flex-direction:column;gap:${story ? 46 : 36}px;">
  //       <div style="display:flex;align-items:center;gap:20px;">
  //         ${icone(story ? 84 : 76)}
  //         ${libelleMono('Kleak Agency · sites vitrines', story ? 26 : 24)}
  //       </div>
  //       <div style="${GROT} font-size:${story ? 104 : 94}px;line-height:1.02;">
  //         Votre site vitrine<br>en 6 fois, ${SERIF('sans')} frais</div>
  //       <div style="font-family:Manrope;font-weight:500;font-size:${story ? 38 : 35}px;color:rgba(255,255,255,.85);margin-top:-${story ? 18 : 12}px;">
  //         Formule Essentiel, 3 pages, <b style="font-weight:800;color:#fff;">en ligne dès la livraison</b></div>
  //
  //       ${carteVerre(`
  //         <div style="display:flex;justify-content:space-between;align-items:center;">
  //           ${libelleMono('6 versements', 24 * s)}
  //           ${pastilleStatut('Chaque mois', 24 * s)}
  //         </div>
  //         <div style="${GROT} font-size:${150 * s}px;line-height:1;margin-top:${26 * s}px;">
  //           6 × 166,50 €</div>
  //         <div style="display:flex;gap:14px;margin-top:${34 * s}px;">${[1, 2, 3, 4, 5, 6].map(etape).join('')}</div>
  //         <div style="display:flex;justify-content:space-between;margin-top:${14 * s}px;font-family:Manrope;font-weight:700;
  //           font-size:${28 * s}px;color:rgba(255,255,255,.88);">
  //           <span>1er versement à la signature</span><span>le site est à vous</span></div>
  //       `, { lueur: true, pad: story ? 50 : 44 })}
  //
  //       ${carteVerre(`
  //         <div style="display:flex;justify-content:space-between;align-items:center;gap:24px;">
  //           <div>
  //             ${libelleMono('Maintenance obligatoire', 24 * s)}
  //             <div style="font-family:Manrope;font-weight:600;font-size:${28 * s}px;color:rgba(255,255,255,.82);margin-top:12px;line-height:1.3;">
  //               Dès la mise en ligne, engagement 12 mois</div>
  //           </div>
  //           <div style="${GROT} font-size:${70 * s}px;white-space:nowrap;">+ 90 €<span style="font-family:Manrope;font-weight:700;letter-spacing:0;font-size:.4em;color:rgba(255,255,255,.78);margin-left:6px;">/mois</span></div>
  //         </div>
  //       `, { pad: story ? 40 : 34 })}
  //     </div>
  //     <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${story ? 1418 : 1212}px;font-family:Manrope;
  //       color:rgba(255,255,255,.66);font-size:${story ? 22 : 20}px;line-height:1.45;font-weight:500;">
  //       Formule Essentiel. Premier versement à la signature, puis un prélèvement automatique chaque mois.
  //       Maintenance obligatoire de 90 €/mois en plus, dès la mise en ligne, engagement 12 mois.
  //       Le site vous appartient au dernier versement.</div>`;
  //   },
  // },
  //
  // // I. Même angle et même contenu que G (le suivi), en DA verre sombre.
  // // CORRECTION par rapport à G : plus aucune barre. Le rapport ne montre que des
  // // libellés (les trois rubriques de la fiche offre) avec une pastille « Inclus »,
  // // aucune valeur, aucune longueur, rien qui ressemble à des données.
  // // Contenu identique à G, tiré de la fiche offre, colonne Essentiel et Pro.
  // i: {
  //   key: 'i-suivi-verre',
  //   fonts: FONTS_VERRE,
  //   html: (fmt) => {
  //     const story = fmt.key === 'story';
  //     const s = story ? 1.06 : 1;
  //     const ligne = (t, premier) => `
  //       <div style="display:flex;justify-content:space-between;align-items:center;padding:${20 * s}px 0;
  //         ${premier ? '' : 'border-top:1px solid rgba(255,255,255,.12);'}">
  //         <span style="font-family:Manrope;font-weight:700;font-size:${34 * s}px;color:#fff;">${t}</span>
  //         ${pastilleStatut('Inclus', 22 * s)}
  //       </div>`;
  //     const tuile = (lib, gros, petit) => carteVerre(`
  //         ${libelleMono(lib, 21 * s)}
  //         <div style="${GROT} font-size:${54 * s}px;line-height:1.05;margin-top:${16 * s}px;">${gros}</div>
  //         <div style="font-family:Manrope;font-weight:600;font-size:${25 * s}px;color:rgba(255,255,255,.8);margin-top:8px;">${petit}</div>
  //       `, { pad: 28, flex: true });
  //     return `
  //     ${verreFond(fmt)}
  //     <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${story ? 210 : 80}px;bottom:${story ? 400 : 60}px;
  //       display:flex;flex-direction:column;gap:${story ? 44 : 32}px;">
  //       <div style="display:flex;align-items:center;gap:20px;">
  //         ${icone(story ? 84 : 76)}
  //         ${libelleMono('Kleak Agency · maintenance', story ? 26 : 24)}
  //       </div>
  //       <div style="${GROT} font-size:${story ? 96 : 86}px;line-height:1.03;">
  //         On s'occupe de<br>votre site, même<br>${SERIF('après')} la mise en ligne</div>
  //
  //       ${carteVerre(`
  //         <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${10 * s}px;">
  //           <div style="display:flex;align-items:center;gap:16px;">
  //             ${icone(story ? 54 : 50)}
  //             <span style="font-family:Manrope;font-weight:800;font-size:${36 * s}px;color:#fff;">Rapport mensuel</span>
  //           </div>
  //           <div style="${GROT} font-size:${64 * s}px;white-space:nowrap;">90 €<span style="font-family:Manrope;font-weight:700;letter-spacing:0;font-size:.4em;color:rgba(255,255,255,.78);margin-left:6px;">/mois*</span></div>
  //         </div>
  //         ${ligne('Visiteurs', true)}
  //         ${ligne("D'où ils viennent")}
  //         ${ligne('Demandes reçues')}
  //       `, { lueur: true, pad: story ? 46 : 40 })}
  //
  //       <div style="display:flex;gap:20px;">
  //         ${tuile('Hébergement', 'Inclus', 'hébergé par nous')}
  //         ${tuile('Mises à jour', 'Incluses', 'et surveillance')}
  //         ${tuile('Modifications', '30 min', 'par mois')}
  //       </div>
  //     </div>
  //     <div style="position:absolute;left:${PAD}px;right:${PAD}px;top:${story ? 1440 : 1262}px;font-family:Manrope;
  //       color:rgba(255,255,255,.66);font-size:${story ? 22 : 20}px;line-height:1.45;font-weight:500;">
  //       * Maintenance des formules Essentiel et Pro. Engagement de 12 mois.</div>`;
  //   },
  // },
  //
  // J. La preuve, sans aucun prix (série 5, 21/10/2026). Une idée : avant de confier
  // son site, on regarde ce que disent les clients. VALIDÉE par Edgar le 21/10, avec
  // une retouche : « on ne comprend pas forcément que c'est de la création de sites
  // internet ». L'accroche porte donc « votre site internet » (au lieu de « Avant de
  // nous appeler »), sans ligne en plus, et le bloc est redescendu pour remplir le bas. Composition des références : deux cartes en
  // verre, la note Google en retrait, l'avis en avant.
  // D'OÙ ÇA VIENT : README, avis réels. Note 4,8/5 sur Google, avis de Laura Dias
  // (Mega Content) recopié mot pour mot.
  // ÉCARTÉ VOLONTAIREMENT : tout prix et tout délai, Méliné Grelet et Aurore Melis
  // (texte de l'avis inconnu), le nombre d'avis (inconnu), tout logo Google.
  j: {
    key: 'j-avis-clients',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 340, titrePx: 70, c1: 740, c2: 960, x: 90 }
        : { marque: 170, titre: 290, titrePx: 62, c1: 610, c2: 816, x: 92 };
      const verre = `background:linear-gradient(165deg, rgba(255,255,255,.075), rgba(255,255,255,.02) 50%), rgba(16,17,23,.72);`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.c2 + 150)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Avant de nous confier votre site internet, lisez ce qu'en disent nos ${italique('clients.')}</div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.c1}px;border-radius:26px;padding:30px 38px;
        ${verre} border:1px solid rgba(255,255,255,.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
        display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:Manrope;font-weight:600;font-size:${story ? 24 : 22}px;color:rgba(255,255,255,.5);">Note Google</div>
          <div style="font-family:'Inter Tight';font-weight:500;letter-spacing:-.02em;font-size:${story ? 72 : 64}px;color:rgba(255,255,255,.78);line-height:1.05;margin-top:4px;">
            4,8<span style="font-size:.5em;color:rgba(255,255,255,.5);">/5</span></div>
        </div>
        <span style="color:rgba(255,197,49,.5);letter-spacing:.08em;font-size:${story ? 32 : 28}px;">★★★★★</span>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.c2}px;border-radius:28px;padding:${story ? '44px 46px 40px' : '40px 42px 36px'};
        border:1.5px solid transparent;
        background:linear-gradient(165deg, rgba(255,255,255,.07), rgba(255,255,255,.015) 55%) padding-box,
          linear-gradient(#111218,#111218) padding-box,
          linear-gradient(135deg, rgba(214,128,60,.85), rgba(255,255,255,.12) 45%, rgba(60,95,255,.95)) border-box;
        box-shadow:0 30px 70px rgba(0,0,0,.55), -20px -10px 60px rgba(180,96,40,.13), 24px 26px 70px rgba(15,47,209,.28);">
        <span style="color:#FFC531;letter-spacing:.08em;font-size:${story ? 32 : 28}px;">★★★★★</span>
        <div style="font-family:'Inter Tight';font-weight:500;letter-spacing:-.01em;font-size:${story ? 39 : 35}px;line-height:1.36;
          color:#F3F4F7;margin-top:18px;">« Un super prestataire pour nous ! Toujours réactif, ils ont su répondre à nos demandes sans aucun souci »</div>
        <div style="height:1px;background:rgba(255,255,255,.1);margin:${story ? 32 : 28}px 0 ${story ? 24 : 20}px;"></div>
        <div style="font-family:Manrope;font-size:${story ? 27 : 25}px;color:rgba(255,255,255,.62);font-weight:500;">
          <b style="color:#fff;font-weight:700;">Laura Dias</b> · Mega Content</div>
      </div>`;
    },
  },

  // K. Le prix, et rien d'autre (série 5, 21/10/2026). Une idée : le prix est fixé et
  // écrit avant de commencer. Un seul objet, comme le ticket des références : un devis
  // papier (grain, ombre, légère rotation) avec une ligne et un total, et un tampon
  // « Prix fixe » à l'encre bleu Kleak.
  // D'OÙ ÇA VIENT : fiche offre, One page 699 € (1 page), « Un devis à prix fixe,
  // valable 30 jours », maintenance One page 49 € par mois avec engagement de 12 mois,
  // « TVA non applicable, article 293 B du CGI ». VALIDÉE par Edgar le 21/10 avec une
  // retouche : la formule la moins chère (One page 699 €) à la place de l'Essentiel
  // 999 €, et « Maintenance en option, 49 €/mois » à la place de « Hors maintenance et
  // hébergement ». Le reste du visuel est inchangé.
  // ÉCARTÉ VOLONTAIREMENT : le paiement en 6 fois (fiche à corriger), le délai, tout
  // numéro de devis, nom de client ou date inventés, la liste des contenus.
  k: {
    key: 'k-devis-prix-fixe',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { titre: 290, titrePx: 70, devis: 530, devisW: 610, note: 1440, x: 90 }
        : { titre: 160, titrePx: 62, devis: 440, devisW: 540, note: 1262, x: 92 };
      const sc = L.devisW / 640;
      const pointilles = `<div style="height:0;border-top:2px dotted rgba(40,34,26,.28);margin:${30 * sc}px 0;"></div>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.devis + 330 * sc)}
      <div style="position:absolute;left:${L.x}px;right:${L.x + 60}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Le prix, vous le connaissez ${italique('avant')} de commencer.</div>

      <div style="position:absolute;left:${(fmt.W - L.devisW) / 2}px;top:${L.devis}px;width:${L.devisW}px;transform:rotate(-4deg);">
        <div style="position:relative;border-radius:6px;padding:${54 * sc}px ${54 * sc}px ${60 * sc}px;
          aspect-ratio:1/1.32;
          background:
            linear-gradient(180deg, transparent 32.8%, rgba(0,0,0,.05) 33.3%, rgba(255,255,255,.35) 33.8%, transparent 35%),
            linear-gradient(180deg, transparent 65.8%, rgba(0,0,0,.05) 66.3%, rgba(255,255,255,.35) 66.8%, transparent 68%),
            linear-gradient(115deg,#FAF7F0 0%,#EFEADF 55%,#E3DCCC 100%);
          box-shadow:0 50px 90px rgba(0,0,0,.65), 0 12px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.5);">
          <div class="grain" style="position:absolute;inset:0;border-radius:6px;"></div>
          <div style="position:relative;color:#1E1B16;font-family:Manrope;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;align-items:center;gap:${12 * sc}px;font-weight:700;font-size:${21 * sc}px;">${icone(38 * sc)}Kleak Agency</div>
              <div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:${40 * sc}px;color:#1E1B16;">Devis</div>
            </div>
            ${pointilles}
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
              <div>
                <div style="font-weight:600;font-size:${25 * sc}px;">Site vitrine, formule One page</div>
                <div style="font-weight:500;font-size:${21 * sc}px;color:#7A7266;margin-top:6px;">1 page</div>
              </div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:${25 * sc}px;white-space:nowrap;">699,00 €</div>
            </div>
            ${pointilles}
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <div style="font-weight:700;font-size:${24 * sc}px;">Total</div>
              <div style="font-family:'JetBrains Mono',monospace;font-weight:500;font-size:${58 * sc}px;letter-spacing:-.02em;">699,00 €</div>
            </div>
            <div style="font-weight:500;font-size:${19 * sc}px;color:#7A7266;margin-top:${26 * sc}px;">Valable 30 jours</div>
            <div style="margin-top:${70 * sc}px;display:flex;flex-direction:column;gap:${14 * sc}px;">
              ${[88, 94, 72, 0, 60, 40].map((w) => `<div style="height:${8 * sc}px;width:${w}%;border-radius:4px;background:rgba(40,34,26,${w ? .1 : 0});"></div>`).join('')}
            </div>
          </div>
          <div class="encre" style="position:absolute;right:${56 * sc}px;bottom:${120 * sc}px;transform:rotate(-12deg);
            border:${4 * sc}px solid rgba(15,47,209,.8);border-radius:${10 * sc}px;padding:${5 * sc}px;mix-blend-mode:multiply;">
            <div style="border:${1.5 * sc}px solid rgba(15,47,209,.7);border-radius:${6 * sc}px;padding:${10 * sc}px ${24 * sc}px ${8 * sc}px;
              font-family:'Inter Tight';font-weight:600;font-size:${30 * sc}px;letter-spacing:.14em;text-transform:uppercase;color:rgba(15,47,209,.82);">Prix fixe</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.note}px;font-family:Manrope;
        color:rgba(255,255,255,.55);font-size:${story ? 22 : 20}px;line-height:1.45;font-weight:500;">
        Formule One page, paiement en une fois. Maintenance en option.</div>`;
    },
  },

};

function page(fmt, crea) {
  return `<!doctype html><html><head><meta charset="utf-8">${crea.fonts || FONTS}<style>
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
