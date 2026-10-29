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
// Même page, recapturée le 29/10 pour AB sans la coupure « l'accompag nement » (voir _capture.mjs).
const ASA_MOBILE_AB = IMG('_captures/asa-mobile-ab.png');

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

// --- Test « prix affiché ou non » (série 6, 24/10/2026) -----------------------
// Décidé par Edgar le 24/10 : chaque créa existe en deux versions strictement
// identiques, sauf le prix. Version P (`<id>-p`) avec la pastille prix, version S
// (`<id>-s`) sans elle, sans rien mis à la place. Toutes mènent à la même landing
// page avec réservation Cal.com, les tarifs sont présentés au RDV.
// La pastille est le SEUL élément qui change : son texte et sa condition (« formule
// One page ») sont dedans, donc rien d'autre n'est à retirer en S. Source : fiche
// offre, One page 699 €, la formule la moins chère (d'où « dès »).
const pastillePrix = (fmt, x, top) => {
  const story = fmt.key === 'story';
  return `
  <div style="position:absolute;left:${x}px;top:${top}px;display:flex;align-items:center;gap:${story ? 22 : 20}px;
    padding:${story ? '18px 34px 18px 30px' : '16px 30px 16px 26px'};border-radius:999px;
    background:linear-gradient(165deg, rgba(255,255,255,.09), rgba(255,255,255,.02) 60%), rgba(16,17,23,.78);
    border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.08), 0 18px 40px rgba(0,0,0,.45);">
    <span style="width:10px;height:10px;border-radius:50%;background:#3D6BFF;box-shadow:0 0 12px rgba(61,107,255,.8);"></span>
    <span style="font-family:'Inter Tight',sans-serif;font-weight:600;letter-spacing:-.015em;font-size:${story ? 44 : 40}px;color:#F3F4F7;">Dès 699 €</span>
    <span style="width:1px;height:${story ? 34 : 30}px;background:rgba(255,255,255,.18);"></span>
    <span style="font-family:Manrope;font-weight:600;font-size:${story ? 27 : 25}px;color:rgba(255,255,255,.6);">Formule One page</span>
  </div>`;
};
// Fabrique les deux versions d'une créa. `html(fmt, prix)` reçoit prix = true ou
// false, et ne s'en sert QUE pour poser ou non pastillePrix().
const testPrix = (id, slug, html) => ({
  [`${id}-p`]: { key: `${id}-${slug}-p`, fonts: FONTS_FIN, html: (fmt) => html(fmt, true) },
  [`${id}-s`]: { key: `${id}-${slug}-s`, fonts: FONTS_FIN, html: (fmt) => html(fmt, false), base: html },
});
// Carte en verre mise en avant (bord ambre vers bleu), reprise de J et M.
const VERRE_AVANT = `border:1.5px solid transparent;
  background:linear-gradient(165deg, rgba(255,255,255,.07), rgba(255,255,255,.015) 55%) padding-box,
    linear-gradient(#111218,#111218) padding-box,
    linear-gradient(135deg, rgba(214,128,60,.85), rgba(255,255,255,.12) 45%, rgba(60,95,255,.95)) border-box;
  box-shadow:0 30px 70px rgba(0,0,0,.55), -20px -10px 60px rgba(180,96,40,.13), 24px 26px 70px rgba(15,47,209,.28);`;
// Papier (grain, plis), repris de K et N.
const PAPIER = `background:
    linear-gradient(180deg, transparent 32.8%, rgba(0,0,0,.05) 33.3%, rgba(255,255,255,.35) 33.8%, transparent 35%),
    linear-gradient(180deg, transparent 65.8%, rgba(0,0,0,.05) 66.3%, rgba(255,255,255,.35) 66.8%, transparent 68%),
    linear-gradient(115deg,#FAF7F0 0%,#EFEADF 55%,#E3DCCC 100%);
  box-shadow:0 50px 90px rgba(0,0,0,.65), 0 12px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.5);`;
const lignesGrises = (largeurs, h, gap, op = .1) => `<div style="display:flex;flex-direction:column;gap:${gap}px;">
  ${largeurs.map((w) => `<div style="height:${h}px;width:${w}%;border-radius:4px;background:rgba(40,34,26,${op});"></div>`).join('')}</div>`;

// --- Briques de la DA claire « métiers » (série 8, 26/10/2026) -------------------
// Pour une landing page en thème clair : fond crème chaud, encre presque noire, un mot
// en Instrument Serif italique bleu Kleak. Mêmes polices que la DA fine (FONTS_FIN).
const JPG = (f) => `data:image/jpeg;base64,${b64(f)}`;
const TITRE_CLAIR = `font-family:'Inter Tight',sans-serif;font-weight:600;letter-spacing:-.022em;color:#17181D;`;
const italiqueBleu = (mot) => `<span style="font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:0;font-size:1.1em;color:${T.bleu};">${mot}</span>`;
const fondClair = (fmt) => `${STYLE_FIN}
  <div style="position:absolute;inset:0;background:
    radial-gradient(${fmt.W * .9}px ${fmt.W * .55}px at 92% 0%, rgba(15,47,209,.06), transparent 70%),
    linear-gradient(180deg,#F7F4EE 0%,#F1ECE3 100%);"></div>
  <div class="grain" style="position:absolute;inset:0;opacity:.55;"></div>`;
const marqueClaire = (story) => `
  <div style="display:flex;align-items:center;gap:14px;font-family:Manrope;font-weight:600;
    font-size:${story ? 24 : 22}px;color:rgba(23,24,29,.72);">${icone(story ? 44 : 40)}Kleak Agency</div>`;
const photoCarte = (fmt, f, x, top, w, h, pos, taille = 'cover') => `
  <div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;height:${h}px;border-radius:28px;overflow:hidden;
    box-shadow:0 30px 60px rgba(60,44,24,.18), 0 6px 14px rgba(60,44,24,.1);">
    <div style="position:absolute;inset:0;background:url(${JPG(f)}) ${pos} / ${taille} no-repeat;"></div>
  </div>`;
const mentionPhoto = (x, top, story) => `<div style="position:absolute;left:${x}px;top:${top}px;font-family:Manrope;
  font-weight:500;font-size:${story ? 22 : 20}px;color:rgba(23,24,29,.45);">Photo d'illustration</div>`;

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

  // ---------------------------------------------------------------------------
  // Série BTP (22/10/2026), commande de media-buyer
  // (livrables/media-buying/commande-creas-btp.md). Cible : artisans du bâtiment.
  // C'est l'image qui fait le ciblage : « artisan » ou « chantiers » est dans ce
  // qu'on lit en premier. DA fine de la série 5 (FONTS_FIN, TITRE_FIN, fondFin,
  // italique). Une idée par créa, le prix sur N seulement.
  // ---------------------------------------------------------------------------

  // L. La démo métier, sans prix. Une idée : voilà à quoi ressemble un site d'artisan
  // fait par Kleak. Un seul téléphone, la démo Garnier Plomberie V2 à l'écran
  // (_captures/garnier-v2-mobile.png, `node _capture.mjs garnier-v2-mobile`), beaucoup
  // de vide autour.
  // D'OÙ ÇA VIENT : fiche offre, One page, « 1 page qui réunit tout : présentation,
  // services, avis, zone d'intervention, contact ». Accroche d'après la piste de la
  // commande. La démo garde son bandeau « Site de démonstration… entreprise fictive »
  // en haut de l'écran, doublé de la légende « Démo Kleak · entreprise fictive ».
  // ÉCARTÉ VOLONTAIREMENT : « One page » et le prix (une idée par créa), « réalisation »
  // et « client » (la démo est fictive), tout cadrage sur les avis ou le numéro de la
  // démo (le téléphone montre l'écran d'accueil tel quel, sans zoom).
  l: {
    key: 'l-demo-artisan',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 310, titrePx: 68, tel: 640, telW: 360, x: 90 }
        : { marque: 96, titre: 196, titrePx: 58, tel: 452, telW: 352, x: 92 };
      const hTel = L.telW * 844 / 390;
      return `
      ${fondFin(fmt, fmt.W * .5, L.tel + hTel * .45)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 20}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Un site d'artisan sur une seule page, avec vos services et votre zone ${italique("d'intervention.")}</div>

      <div style="position:absolute;left:${(fmt.W - L.telW) / 2}px;top:${L.tel}px;
        filter:drop-shadow(0 40px 60px rgba(0,0,0,.55));">${telephone(L.telW, IMG('_captures/garnier-v2-mobile.png'), '#14243A')}</div>
      <div style="position:absolute;left:0;right:0;top:${L.tel + hTel + (story ? 34 : 24)}px;text-align:center;
        font-family:Manrope;font-weight:600;font-size:${story ? 32 : 30}px;color:rgba(255,255,255,.82);">
        Démo Kleak · entreprise fictive</div>`;
    },
  },

  // M. Le peu de temps que ça demande, sans prix. Une idée : l'artisan est sur les
  // chantiers ; pour son site, on lui demande un questionnaire de 15 minutes et ses
  // contenus. Un seul objet : une carte en verre « Questionnaire », dont la ligne
  // « Photos de vos chantiers » est mise en avant avec trois vignettes.
  // D'OÙ ÇA VIENT : fiche offre, « Comment ça se passe », étape 3 : « un questionnaire
  // en ligne (15 minutes). Vous y décrivez vos goûts (ambiance, couleurs, styles
  // d'écriture, sites que vous aimez) et vous y déposez vos contenus (logo, photos,
  // textes) ». Les rubriques de la carte sont celles-là, rien d'autre. « Bon à savoir » :
  // les contenus sont fournis par le client, d'où la ligne du bas. Vignettes : photos
  // Unsplash de la planche Garnier (assets/garnier/), pas d'image générée.
  // ÉCARTÉ VOLONTAIREMENT : « on écrit tout », « vous n'avez rien à faire », « zéro
  // effort » (faux : textes, photos, logo viennent du client, rédaction sur devis),
  // « 15 minutes » appliqué à autre chose que le questionnaire, la frise des 7 étapes,
  // le délai et le prix.
  m: {
    key: 'm-15-minutes-chantiers',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { titre: 260, titrePx: 68, carte: 640, note: 1400, x: 90, s: 1.06 }
        : { titre: 150, titrePx: 60, carte: 490, note: 1240, x: 92, s: 1 };
      const s = L.s;
      const photo = (id) => `<div style="width:${132 * s}px;height:${132 * s}px;border-radius:${14 * s}px;flex:none;
        background:url(data:image/jpeg;base64,${b64(`assets/garnier/${id}.jpg`)}) center / cover;
        box-shadow:0 8px 20px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.12);"></div>`;
      const coche = `<span style="flex:none;width:${34 * s}px;height:${34 * s}px;border-radius:50%;
        background:rgba(15,47,209,.9);color:#fff;display:inline-flex;align-items:center;justify-content:center;
        font-family:Manrope;font-weight:800;font-size:${19 * s}px;">✓</span>`;
      const ligne = (t, premier) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:${22 * s}px 0;
          ${premier ? '' : 'border-top:1px solid rgba(255,255,255,.09);'}">
          <span style="font-family:Manrope;font-weight:600;font-size:${30 * s}px;color:rgba(255,255,255,.62);">${t}</span>${coche}
        </div>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.carte + 380)}
      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Vous êtes sur les chantiers. Pour votre site, comptez 15 minutes de ${italique('questionnaire.')}</div>

      <div style="position:absolute;left:${L.x + 30}px;right:${L.x + 30}px;top:${L.carte}px;border-radius:30px;
        padding:${story ? '40px 46px 44px' : '36px 42px 40px'};border:1.5px solid transparent;
        background:linear-gradient(165deg, rgba(255,255,255,.07), rgba(255,255,255,.015) 55%) padding-box,
          linear-gradient(#111218,#111218) padding-box,
          linear-gradient(135deg, rgba(214,128,60,.85), rgba(255,255,255,.12) 45%, rgba(60,95,255,.95)) border-box;
        box-shadow:0 30px 70px rgba(0,0,0,.55), -20px -10px 60px rgba(180,96,40,.13), 24px 26px 70px rgba(15,47,209,.28);
        transform:rotate(-1.5deg);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${14 * s}px;">
          <div style="display:flex;align-items:center;gap:${16 * s}px;">${icone(46 * s)}
            <span style="font-family:'Inter Tight';font-weight:600;font-size:${36 * s}px;letter-spacing:-.01em;color:#F3F4F7;">Questionnaire</span></div>
          <span style="font-family:Manrope;font-weight:600;font-size:${25 * s}px;color:rgba(255,255,255,.55);">15 minutes</span>
        </div>
        ${ligne('Ambiance et couleurs', true)}
        ${ligne('Sites que vous aimez')}
        ${ligne('Votre logo')}
        <div style="border-top:1px solid rgba(255,255,255,.09);padding-top:${24 * s}px;">
          <div style="font-family:Manrope;font-weight:700;font-size:${32 * s}px;color:#fff;">Photos de vos chantiers</div>
          <div style="display:flex;gap:${16 * s}px;margin-top:${20 * s}px;">
            ${photo('1694827893591-af9b80361599')}${photo('1518276779712-dfdcb9daa7a1')}${photo('1584622650111-993a426fbf0a')}
            <div style="width:${132 * s}px;height:${132 * s}px;border-radius:${14 * s}px;flex:none;border:2px dashed rgba(255,255,255,.22);
              display:flex;align-items:center;justify-content:center;font-family:Manrope;font-weight:500;font-size:${48 * s}px;color:rgba(255,255,255,.4);">+</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.note}px;font-family:Manrope;
        color:rgba(255,255,255,.55);font-size:${story ? 22 : 20}px;line-height:1.45;font-weight:500;">
        Questionnaire en ligne, envoyé à la signature. Textes, photos et logo sont fournis par vous.</div>`;
    },
  },

  // N. Le prix fixe, dans les mots d'un artisan. Une idée : un artisan fait des devis
  // toute la semaine ; voici le sien pour son site, 699 €, prix fixe. Même traitement
  // papier que K (grain, plis, tampon), mais l'accroche parle à l'artisan et le corps
  // du devis détaille les cinq rubriques de la page.
  // D'OÙ ÇA VIENT : fiche offre, One page 699 €, « 1 page qui réunit tout :
  // présentation, services, avis, zone d'intervention, contact », « Un devis à prix
  // fixe, valable 30 jours ». Condition reprise de K : « Formule One page, paiement en
  // une fois. Maintenance en option. »
  // ÉCARTÉ VOLONTAIREMENT : la TVA, le prix de la maintenance et toute durée
  // d'engagement, le délai (une idée par créa), le paiement en 6 fois, tout numéro de
  // devis, nom de client ou date inventés.
  n: {
    key: 'n-devis-artisan-699',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { titre: 290, titrePx: 72, devis: 500, devisW: 640, note: 1440, x: 90 }
        : { titre: 150, titrePx: 66, devis: 360, devisW: 590, note: 1262, x: 92 };
      const sc = L.devisW / 640;
      const pointilles = `<div style="height:0;border-top:2px dotted rgba(40,34,26,.28);margin:${26 * sc}px 0;"></div>`;
      const rubrique = (t) => `<div style="display:flex;align-items:center;gap:${14 * sc}px;font-weight:500;
        font-size:${23 * sc}px;color:#3A342B;margin-top:${12 * sc}px;"><span style="width:${7 * sc}px;height:${7 * sc}px;
        border-radius:50%;background:#9A9285;flex:none;"></span>${t}</div>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.devis + 380 * sc)}
      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Votre site d'artisan, à prix ${italique('fixe.')}</div>

      <div style="position:absolute;left:${(fmt.W - L.devisW) / 2}px;top:${L.devis}px;width:${L.devisW}px;transform:rotate(3deg);">
        <div style="position:relative;border-radius:6px;padding:${50 * sc}px ${54 * sc}px ${56 * sc}px;
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
              <div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:${40 * sc}px;">Devis</div>
            </div>
            ${pointilles}
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
              <div style="font-weight:700;font-size:${25 * sc}px;white-space:nowrap;">Site internet, One page</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:${25 * sc}px;white-space:nowrap;">699,00 €</div>
            </div>
            <div style="font-weight:500;font-size:${21 * sc}px;color:#7A7266;margin:${8 * sc}px 0 ${6 * sc}px;">1 page qui réunit tout :</div>
            ${['Présentation', 'Services', 'Avis', "Zone d'intervention", 'Contact'].map(rubrique).join('')}
            ${pointilles}
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <div style="font-weight:700;font-size:${24 * sc}px;">Total</div>
              <div style="font-family:'JetBrains Mono',monospace;font-weight:500;font-size:${58 * sc}px;letter-spacing:-.02em;">699,00 €</div>
            </div>
            <div style="font-weight:500;font-size:${19 * sc}px;color:#7A7266;margin-top:${18 * sc}px;">Valable 30 jours</div>
          </div>
          <div class="encre" style="position:absolute;right:${50 * sc}px;bottom:${56 * sc}px;transform:rotate(-10deg);
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

  // ---------------------------------------------------------------------------
  // Série 6 (24/10/2026) : test « prix affiché ou non ». Trois créas, chacune en
  // version P (pastille « Dès 699 € · Formule One page ») et S (sans la pastille,
  // rien à la place). Accroche, objet, légende et positions sont les mêmes ; la
  // pastille est posée sous l'objet, dans une zone qui reste vide en S. Aucune
  // accroche ne dépend du prix. DA fine de la série 5. Pas de story à ce stade,
  // mais chaque créa a ses positions story (rien sous y = 1520).
  // ---------------------------------------------------------------------------

  // RETENUE (Edgar, 24/10) : la version S seule (o-site-captivant-s). La version P est
  // abandonnée (plus aucun prix dans cette campagne), son PNG reste mais ne sert plus.
  // O. La promesse de Kleak : un site captivant qui amène des contacts. Un seul objet :
  // la notification d'un nouveau message reçu depuis le site, en carte de verre mise en
  // avant, une seconde carte vide en retrait pour la profondeur.
  // D'OÙ ÇA VIENT : promesse validée par Edgar le 22/10 (« un site captivant, pensé
  // pour transformer vos visiteurs en clients ») ; fiche offre, « Formulaire de
  // contact : chaque demande arrive directement dans votre boîte mail », recopié en
  // légende.
  // ÉCARTÉ VOLONTAIREMENT : tout nom, tout texte de message, toute entreprise (le
  // message est fait de lignes grises, rien n'est prêté à un vrai client), tout nombre
  // de demandes, les intitulés de champs (« Nom », « Message ») qui feraient croire que
  // la pub mène à un formulaire, le délai.
  ...testPrix('o', 'site-captivant', (fmt, prix, txt = {}) => {
    const story = fmt.key === 'story';
    const L = story
      ? { marque: 220, titre: 330, titrePx: 70, fond: 680, carte: 730, legende: 1220, prix: 1340, x: 90, s: 1.18 }
      : { marque: 110, titre: 210, titrePx: 62, fond: 500, carte: 548, legende: 1030, prix: 1150, x: 92, s: 1.14 };
    const s = L.s;
    const enveloppe = `<div style="flex:none;width:${66 * s}px;height:${66 * s}px;border-radius:${16 * s}px;
      background:linear-gradient(160deg,#2F6BFF,${T.bleu});box-shadow:inset 0 1px 0 rgba(255,255,255,.3);
      display:flex;align-items:center;justify-content:center;">
      <svg width="${34 * s}" height="${34 * s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5 L12 13 L20.5 6.5"/></svg></div>`;
    const barre = (w, op = .12) => `<div style="height:${14 * s}px;width:${w}%;border-radius:7px;background:rgba(255,255,255,${op});"></div>`;
    return `
    ${fondFin(fmt, fmt.W * .5, L.carte + 200)}
    <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
    <div style="position:absolute;left:${L.x}px;right:${L.x + 30}px;top:${L.titre}px;${TITRE_FIN}
      font-size:${L.titrePx}px;line-height:1.1;">${txt.titre || `Un site captivant, pensé pour que vos visiteurs vous ${italique('contactent.')}`}</div>

    <div style="position:absolute;left:${L.x + 60}px;right:${L.x + 60}px;top:${L.fond}px;height:${200 * s}px;border-radius:26px;
      background:linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.015) 50%), rgba(16,17,23,.6);
      border:1px solid rgba(255,255,255,.07);transform:rotate(2deg);"></div>

    <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.carte}px;border-radius:30px;
      padding:${story ? '46px 50px 52px' : '42px 46px 48px'};${VERRE_AVANT} transform:rotate(-1.5deg);">
      <div style="display:flex;align-items:center;gap:${22 * s}px;">
        ${enveloppe}
        <div style="flex:1;">
          <div style="font-family:'Inter Tight';font-weight:600;letter-spacing:-.01em;font-size:${36 * s}px;color:#F3F4F7;">Nouveau message</div>
          <div style="font-family:Manrope;font-weight:500;font-size:${24 * s}px;color:rgba(255,255,255,.55);margin-top:4px;">Reçu depuis votre site internet</div>
        </div>
        <div style="align-self:flex-start;font-family:Manrope;font-weight:600;font-size:${22 * s}px;color:rgba(255,255,255,.45);">à l'instant</div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,.1);margin:${30 * s}px 0 ${30 * s}px;"></div>
      <div style="display:flex;flex-direction:column;gap:${18 * s}px;">
        ${barre(34, .2)}${barre(92)}${barre(86)}${barre(58)}
      </div>
    </div>

    <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.legende}px;font-family:Manrope;
      color:rgba(255,255,255,.62);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:500;">
      ${txt.legende || 'Chaque demande arrive directement dans votre boîte mail.'}</div>
    ${prix ? pastillePrix(fmt, L.x, L.prix) : ''}`;
  }),

  /* ÉCARTÉE (Edgar, 24/10) : P abandonnée, plus aucun prix dans cette campagne, et l'idée
     n'est pas retenue. Les PNG p-mentions-legales-p/-s restent dans rendus/post/ mais ne servent plus.
  // P. La conformité, incluse. Un seul objet : la page « Mentions légales » du site,
  // en papier (traitement de K et N), avec ses rubriques et des lignes grises.
  // D'OÙ ÇA VIENT : fiche offre, One page, Essentiel et Pro : « Mentions légales,
  // bandeau cookies et conformité RGPD ». Les rubriques du papier sont les rubriques
  // habituelles d'une page de mentions légales, sans aucun contenu (lignes grises).
  // ÉCARTÉ VOLONTAIREMENT : toute amende, toute menace (« vous risquez… »), tout nom
  // d'entreprise, de domaine ou d'hébergeur, tout tampon (déjà sur K et N), le délai.
  ...testPrix('p', 'mentions-legales', (fmt, prix) => {
    const story = fmt.key === 'story';
    const L = story
      ? { marque: 220, titre: 330, titrePx: 70, papier: 640, papierW: 540, prix: 1380, x: 90 }
      : { marque: 110, titre: 210, titrePx: 62, papier: 450, papierW: 500, prix: 1185, x: 92 };
    const sc = L.papierW / 640;
    const pointilles = `<div style="height:0;border-top:2px dotted rgba(40,34,26,.28);margin:${28 * sc}px 0 ${8 * sc}px;"></div>`;
    const rubrique = (t, largeurs) => `
      <div style="margin-top:${34 * sc}px;">
        <div style="font-weight:700;font-size:${27 * sc}px;color:#1E1B16;margin-bottom:${16 * sc}px;">${t}</div>
        ${lignesGrises(largeurs, 10 * sc, 13 * sc, .13)}
      </div>`;
    return `
    ${fondFin(fmt, fmt.W * .5, L.papier + 420 * sc)}
    <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
    <div style="position:absolute;left:${L.x}px;right:${L.x + 20}px;top:${L.titre}px;${TITRE_FIN}
      font-size:${L.titrePx}px;line-height:1.1;">Votre site internet, livré avec ses mentions légales et la conformité ${italique('RGPD.')}</div>

    <div style="position:absolute;left:${(fmt.W - L.papierW) / 2}px;top:${L.papier}px;width:${L.papierW}px;transform:rotate(-3deg);">
      <div style="position:relative;border-radius:6px;padding:${54 * sc}px ${56 * sc}px ${56 * sc}px;aspect-ratio:1/1.32;${PAPIER}">
        <div class="grain" style="position:absolute;inset:0;border-radius:6px;"></div>
        <div style="position:relative;font-family:Manrope;">
          <div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:${54 * sc}px;color:#1E1B16;line-height:1;">Mentions légales</div>
          ${pointilles}
          ${rubrique('Éditeur du site', [86, 64])}
          ${rubrique('Hébergement', [78, 52])}
          ${rubrique('Données personnelles', [92, 88, 60])}
          ${rubrique('Cookies', [84, 70, 46])}
          ${rubrique('Propriété intellectuelle', [80, 52])}
        </div>
      </div>
    </div>
    ${prix ? pastillePrix(fmt, L.x, L.prix) : ''}`;
  }),
  */

  /* ÉCARTÉE (Edgar, 24/10) : Q abandonnée, plus aucun prix dans cette campagne, et l'idée
     n'est pas retenue. Les PNG q-planche-direction-p/-s restent dans rendus/post/ mais ne servent plus.
  // Q. On valide avant de construire. Un seul objet : la planche de direction, une
  // feuille à l'horizontale avec ses quatre rubriques (structure, couleurs, polices,
  // photos), sans contenu de client.
  // D'OÙ ÇA VIENT : fiche offre, « Comment ça se passe », étape 4 : « Une planche de
  // direction sous 48 heures : la structure de votre site, les couleurs, les polices
  // et les photos retenues, sur une seule page. Vous validez ou vous corrigez avant
  // qu'on construise quoi que ce soit. » Accroche tirée de la dernière phrase.
  // ÉCARTÉ VOLONTAIREMENT : « 48 heures » (un délai de plus, une idée par créa), le
  // nombre de retouches, toute photo réelle (les cases photo sont des aplats de
  // couleur, pas des images d'un client), tout nom de police ou de client.
  ...testPrix('q', 'planche-direction', (fmt, prix) => {
    const story = fmt.key === 'story';
    const L = story
      ? { marque: 220, titre: 330, titrePx: 70, feuille: 640, feuilleW: 900, prix: 1340, x: 90 }
      : { marque: 110, titre: 210, titrePx: 62, feuille: 450, feuilleW: 900, prix: 1150, x: 92 };
    const sc = L.feuilleW / 880;
    const libelle = (t) => `<div style="font-family:Manrope;font-weight:600;font-size:${20 * sc}px;color:#7A7266;margin-bottom:${14 * sc}px;">${t}</div>`;
    const pastille = (c) => `<div style="width:${62 * sc}px;height:${62 * sc}px;border-radius:50%;background:${c};
      box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);"></div>`;
    const bloc = (h, fond = 'rgba(40,34,26,.1)') => `<div style="height:${h * sc}px;border-radius:${5 * sc}px;background:${fond};"></div>`;
    const photo = (a, b) => `<div style="flex:1;height:${118 * sc}px;border-radius:${8 * sc}px;background:linear-gradient(150deg,${a},${b});"></div>`;
    return `
    ${fondFin(fmt, fmt.W * .5, L.feuille + 290 * sc)}
    <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
    <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_FIN}
      font-size:${L.titrePx}px;line-height:1.1;">Vous validez le style de votre site avant qu'on le ${italique('construise.')}</div>

    <div style="position:absolute;left:${(fmt.W - L.feuilleW) / 2}px;top:${L.feuille}px;width:${L.feuilleW}px;transform:rotate(-2deg);">
      <div style="position:relative;border-radius:6px;padding:${40 * sc}px ${44 * sc}px ${44 * sc}px;${PAPIER}">
        <div class="grain" style="position:absolute;inset:0;border-radius:6px;"></div>
        <div style="position:relative;font-family:Manrope;color:#1E1B16;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:${48 * sc}px;line-height:1;">Planche de direction</div>
            <div style="font-weight:600;font-size:${20 * sc}px;color:#7A7266;">Sur une seule page</div>
          </div>
          <div style="height:0;border-top:2px dotted rgba(40,34,26,.28);margin:${24 * sc}px 0 ${26 * sc}px;"></div>
          <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:${34 * sc}px ${40 * sc}px;">
            <div style="grid-row:span 2;">
              ${libelle('Structure')}
              <div style="display:flex;flex-direction:column;gap:${10 * sc}px;padding:${14 * sc}px;border-radius:${8 * sc}px;
                border:1.5px solid rgba(40,34,26,.16);">
                ${bloc(16, 'rgba(40,34,26,.16)')}${bloc(92, 'rgba(15,47,209,.16)')}
                <div style="display:flex;gap:${10 * sc}px;"><div style="flex:1">${bloc(54)}</div><div style="flex:1">${bloc(54)}</div><div style="flex:1">${bloc(54)}</div></div>
                ${bloc(40)}${bloc(26, 'rgba(40,34,26,.16)')}
              </div>
            </div>
            <div>
              ${libelle('Couleurs')}
              <div style="display:flex;gap:${14 * sc}px;">${pastille('#1F2A24')}${pastille('#7C8F72')}${pastille('#D9C7A7')}${pastille('#B5603A')}${pastille('#F4EFE6')}</div>
            </div>
            <div style="display:grid;grid-template-columns:auto 1fr;gap:${26 * sc}px;">
              <div>
                ${libelle('Polices')}
                <div style="display:flex;align-items:baseline;gap:${16 * sc}px;line-height:1;">
                  <span style="font-family:'Instrument Serif',serif;font-size:${74 * sc}px;">Aa</span>
                  <span style="font-family:'Inter Tight';font-weight:600;font-size:${60 * sc}px;letter-spacing:-.02em;">Aa</span>
                </div>
              </div>
              <div>
                ${libelle('Photos')}
                <div style="display:flex;gap:${10 * sc}px;">${photo('#C9B28F', '#8A6E4B')}${photo('#9DAE93', '#55684D')}${photo('#D8C9B4', '#A88B6A')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${prix ? pastillePrix(fmt, L.x, L.prix) : ''}`;
  }),
  */

  // R. Avant / après, idée d'Edgar (24/10/2026). Deux photos de vraies personnes côte à
  // côte : à gauche, une dirigeante agacée devant son téléphone, notification « Aucune
  // nouvelle demande » ; à droite, une personne contente devant son téléphone,
  // notification « 12 nouvelles demandes ». Sans prix (décision du 24/10 : la pub mène
  // à une landing page avec réservation Cal.com, les tarifs sont présentés au RDV).
  // D'OÙ ÇA VIENT : l'idée et le principe des deux notifications sont d'Edgar. Photos
  // Pexels (licence Pexels : usage commercial gratuit, sans attribution obligatoire),
  // copiées dans assets/personnes/ : pexels-5999828 (gauche) et pexels-10375885
  // (droite). Aucune image générée. « Reçues depuis votre site internet » reprend la
  // fiche offre (« chaque demande arrive directement dans votre boîte mail »).
  // Le chiffre 12 est une ILLUSTRATION, dit en bas de l'image : « Illustration. Le
  // nombre de demandes dépend de chaque activité. » Pas de période, pas de « en moyenne »,
  // pas de « nos clients ».
  // ÉCARTÉ VOLONTAIREMENT : « garanti », toute période (« par semaine ») qui ferait du 12
  // une promesse, tout nom de personne ou d'entreprise, tout contenu de message, toute
  // mention d'un formulaire, le prix et le délai, les étiquettes « Avant » / « Après »
  // (les deux notifications suffisent à lire le sens).
  r: {
    key: 'r-avant-apres-demandes',
    fonts: FONTS_FIN,
    html: (fmt, txt = {}) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 310, titrePx: 68, photos: 600, photoH: 760, gap: 30, legende: 1420, x: 90, s: 1.06 }
        : { marque: 96, titre: 196, titrePx: 60, photos: 410, photoH: 730, gap: 28, legende: 1180, x: 92, s: 1 };
      const s = L.s;
      const photoW = (fmt.W - 2 * L.x - L.gap) / 2;
      const JPG = (f) => `data:image/jpeg;base64,${b64(f)}`;
      const photo = (src, pos, filtre, notif, avant) => `
        <div style="position:relative;width:${photoW}px;height:${L.photoH}px;">
          <div style="position:absolute;inset:0;border-radius:28px;overflow:hidden;
            box-shadow:0 30px 70px rgba(0,0,0,.55);${avant ? '' : 'outline:1.5px solid rgba(255,255,255,.12);'}">
            <div style="position:absolute;inset:0;background:url(${src}) ${pos} / cover no-repeat;filter:${filtre};"></div>
            <div style="position:absolute;inset:0;background:linear-gradient(180deg, transparent 50%, rgba(8,9,12,.55) 100%);"></div>
          </div>
          <div style="position:absolute;left:18px;right:18px;bottom:22px;">${notif}</div>
        </div>`;
      const icone = (actif) => `<div style="flex:none;width:${50 * s}px;height:${50 * s}px;border-radius:${13 * s}px;
        background:${actif ? `linear-gradient(160deg,#2F6BFF,${T.bleu})` : 'rgba(255,255,255,.14)'};
        display:flex;align-items:center;justify-content:center;">
        <svg width="${26 * s}" height="${26 * s}" viewBox="0 0 24 24" fill="none" stroke="${actif ? '#fff' : 'rgba(255,255,255,.6)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5 L12 13 L20.5 6.5"/></svg></div>`;
      const notif = (actif, titre, sous) => `
        <div style="display:flex;align-items:center;gap:${16 * s}px;padding:${18 * s}px ${20 * s}px;border-radius:${22 * s}px;
          ${actif ? VERRE_AVANT : 'background:rgba(22,23,28,.72);border:1px solid rgba(255,255,255,.1);box-shadow:0 20px 40px rgba(0,0,0,.4);'}
          backdrop-filter:blur(14px);">
          ${icone(actif)}
          <div style="min-width:0;">
            <div style="font-family:'Inter Tight';font-weight:600;letter-spacing:-.01em;font-size:${29 * s}px;line-height:1.15;
              color:${actif ? '#F3F4F7' : 'rgba(255,255,255,.62)'};">${titre}</div>
            <div style="font-family:Manrope;font-weight:500;font-size:${21 * s}px;line-height:1.3;margin-top:4px;color:rgba(255,255,255,.5);">${sous}</div>
          </div>
        </div>`;
      return `
      ${fondFin(fmt, fmt.W * .72, L.photos + L.photoH * .6)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">${txt.titre || `Votre site internet devrait vous apporter des ${italique('demandes.')}`}</div>

      <div style="position:absolute;left:${L.x}px;top:${L.photos}px;display:flex;gap:${L.gap}px;">
        ${photo(JPG('assets/personnes/pexels-5999828.jpg'), '62% 30%', 'grayscale(.55) brightness(.78) contrast(1.05)',
          notif(false, 'Aucune nouvelle demande', 'Boîte de réception'), true)}
        ${photo(JPG('assets/personnes/pexels-10375885.jpg'), '50% 30%', 'saturate(1.05) brightness(.98)',
          notif(true, '12 nouvelles demandes', 'Reçues depuis votre site internet'), false)}
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.legende}px;font-family:Manrope;
        color:rgba(255,255,255,.5);font-size:${story ? 24 : 22}px;line-height:1.4;font-weight:500;">
        ${txt.legende || 'Illustration. Le nombre de demandes dépend de chaque activité.'}</div>`;
    },
  },

  // ABANDONNÉE (Edgar, 24/10) : idée trop rassurante, pas assez forte pour donner envie de
  // cliquer. Code gardé (non commenté pour pouvoir la rendre), PNG gardé mais inutilisé.
  // S. Le nom de domaine à votre nom (24/10/2026), sans prix. Une idée : votre site est
  // en ligne à votre adresse, et cette adresse vous appartient. Un seul objet : une
  // fenêtre de navigateur en verre, sa barre d'adresse au premier plan (cadenas,
  // « votre-entreprise.fr »), la page en dessous réduite à des blocs gris.
  // D'OÙ ÇA VIENT : fiche offre, les trois formules : « Mise en ligne sur votre nom de
  // domaine » ; « Bon à savoir » : « Le nom de domaine est à votre nom. », recopié en
  // légende. « votre-entreprise.fr » est un gabarit, comme « VOTRE ENTREPRISE » de D.
  // ÉCARTÉ VOLONTAIREMENT : « le site vous appartient » (vrai en une fois, mais au dernier
  // versement en 6 fois : il faudrait une condition), tout vrai nom de domaine ou
  // d'hébergeur, toute promesse d'être trouvé sur Google, le prix et le délai, toute
  // comparaison nommée avec un concurrent.
  s: {
    key: 's-nom-de-domaine',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 330, titrePx: 70, fenetre: 720, fenetreH: 560, legende: 1360, x: 90, s: 1.1 }
        : { marque: 110, titre: 210, titrePx: 62, fenetre: 520, fenetreH: 520, legende: 1150, x: 92, s: 1 };
      const s = L.s;
      const bloc = (h, w = 100, op = .07) => `<div style="height:${h}px;width:${w}%;border-radius:10px;background:rgba(255,255,255,${op});"></div>`;
      const point = (c) => `<span style="width:${15 * s}px;height:${15 * s}px;border-radius:50%;background:${c};opacity:.75;"></span>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.fenetre + 120)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Votre site internet, en ligne sur votre propre nom de ${italique('domaine.')}</div>

      <div style="position:absolute;left:${L.x + 40}px;right:${L.x + 40}px;top:${L.fenetre}px;height:${L.fenetreH}px;border-radius:26px;
        background:linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.012) 50%), rgba(16,17,23,.66);
        border:1px solid rgba(255,255,255,.08);box-shadow:0 40px 80px rgba(0,0,0,.5);overflow:hidden;">
        <div style="display:flex;gap:${10 * s}px;padding:${24 * s}px ${28 * s}px;">${point('#E36A5D')}${point('#E5B34B')}${point('#5DBB6B')}</div>
        <div style="padding:${130 * s}px ${44 * s}px 0;display:flex;flex-direction:column;gap:${18 * s}px;">
          ${bloc(26 * s, 58, .1)}${bloc(26 * s, 40, .1)}
          <div style="height:${14 * s}px;"></div>
          <div style="display:flex;gap:${18 * s}px;">
            <div style="flex:1">${bloc(150 * s)}</div><div style="flex:1">${bloc(150 * s)}</div><div style="flex:1">${bloc(150 * s)}</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.fenetre + 70 * s}px;border-radius:${24 * s}px;
        padding:${26 * s}px ${34 * s}px;${VERRE_AVANT} display:flex;align-items:center;gap:${22 * s}px;">
        <svg width="${34 * s}" height="${34 * s}" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;">
          <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
        <div style="font-family:'Inter Tight';font-weight:500;letter-spacing:-.015em;font-size:${44 * s}px;color:#F3F4F7;">
          votre-entreprise<span style="color:rgba(255,255,255,.55);">.fr</span><span style="display:inline-block;width:3px;height:${44 * s}px;
          background:#3D6BFF;margin-left:6px;vertical-align:-${8 * s}px;box-shadow:0 0 10px rgba(61,107,255,.8);"></span></div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.legende}px;font-family:Manrope;
        color:rgba(255,255,255,.62);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:500;">
        Le nom de domaine est à votre nom.</div>`;
    },
  },

  // T. Le rendez-vous lui-même (24/10/2026), sans prix. Une idée : ce qu'on obtient en
  // cliquant, un appel de 30 minutes pour parler de son site, au créneau qu'on choisit.
  // La destination est une landing page avec calendrier Cal.com : la créa montre ce
  // calendrier, l'image et la page disent la même chose. Un seul objet : une carte en
  // verre « Appel de 30 minutes », une semaine et quelques créneaux, un seul mis en avant.
  // D'OÙ ÇA VIENT : fiche offre, « Comment ça se passe », étape 1 : « Un appel de 30
  // minutes pour comprendre votre activité et vos objectifs. » Les jours et les heures
  // sont un exemple d'agenda, sans date.
  // RETENUE (Edgar, 24/10) avec deux corrections : les créneaux sont ceux du Cal.com
  // réel (9 h à 12 h et 15 h à 18 h : 9:30, 10:30, 11:00, 15:30, 16:30, 17:30, 10:30 mis
  // en avant), et « gratuit » entre dans l'accroche, validé par Edgar (tous les boutons de
  // la landing page disent « Réserver un appel gratuit »). « futur » est retiré.
  // ÉCARTÉ VOLONTAIREMENT (avant correction) : « gratuit » et « sans engagement » (la fiche ne le dit pas de
  // l'appel), tout bouton « Réserver » ou « Confirmer » (le bouton est celui de Meta),
  // toute date réelle, tout nom, le prix, le délai, le devis (une idée par créa).
  t: {
    key: 't-appel-30-minutes',
    fonts: FONTS_FIN,
    html: (fmt, txt = {}) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 330, titrePx: 70, carte: 720, legende: 1360, x: 90, s: 1.1 }
        : { marque: 110, titre: 210, titrePx: 62, carte: 510, legende: 1120, x: 92, s: 1 };
      const s = L.s;
      const jours = [['Lun', false], ['Mar', false], ['Mer', true], ['Jeu', false], ['Ven', false]];
      const jour = ([j, actif]) => `<div style="flex:1;text-align:center;padding:${16 * s}px 0;border-radius:${16 * s}px;
        font-family:Manrope;font-weight:600;font-size:${24 * s}px;
        ${actif ? 'background:rgba(61,107,255,.16);color:#F3F4F7;box-shadow:inset 0 0 0 1.5px rgba(61,107,255,.7);' : 'color:rgba(255,255,255,.45);'}">${j}</div>`;
      const creneau = (h, actif) => `<div style="padding:${20 * s}px 0;border-radius:${16 * s}px;text-align:center;
        font-family:'Inter Tight';font-weight:${actif ? 600 : 500};letter-spacing:-.01em;font-size:${30 * s}px;
        ${actif ? `background:linear-gradient(160deg,#2F6BFF,${T.bleu});color:#fff;box-shadow:0 12px 30px rgba(15,47,209,.45), inset 0 1px 0 rgba(255,255,255,.3);`
          : 'color:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.1);'}">${h}</div>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.carte + 260)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">${txt.titre || `Un appel gratuit de 30 minutes pour parler de votre ${italique('site.')}`}</div>

      <div style="position:absolute;left:${L.x + 50}px;right:${L.x + 50}px;top:${L.carte - 40}px;height:${200 * s}px;border-radius:26px;
        background:linear-gradient(165deg, rgba(255,255,255,.05), rgba(255,255,255,.012) 50%), rgba(16,17,23,.6);
        border:1px solid rgba(255,255,255,.07);transform:rotate(2deg);"></div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.carte}px;border-radius:30px;
        padding:${40 * s}px ${44 * s}px ${44 * s}px;${VERRE_AVANT} transform:rotate(-1.2deg);">
        <div style="display:flex;align-items:center;gap:${20 * s}px;">
          ${icone(64 * s)}
          <div>
            <div style="font-family:'Inter Tight';font-weight:600;letter-spacing:-.01em;font-size:${36 * s}px;color:#F3F4F7;">Appel de 30 minutes</div>
            <div style="font-family:Manrope;font-weight:500;font-size:${24 * s}px;color:rgba(255,255,255,.55);margin-top:4px;">Votre activité, vos objectifs, votre site</div>
          </div>
        </div>
        <div style="height:1px;background:rgba(255,255,255,.1);margin:${32 * s}px 0 ${28 * s}px;"></div>
        <div style="display:flex;gap:${12 * s}px;">${jours.map(jour).join('')}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:${14 * s}px;margin-top:${24 * s}px;">
          ${creneau('9:30')}${creneau('10:30', true)}${creneau('11:00')}
          ${creneau('15:30')}${creneau('16:30')}${creneau('17:30')}
        </div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.legende}px;font-family:Manrope;
        color:rgba(255,255,255,.62);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:500;">
        ${txt.legende || "Vous choisissez le jour et l'heure."}</div>`;
    },
  },

  // ---------------------------------------------------------------------------
  // Série 8 (26/10/2026) : « moins tech, plus orientée PME ». Commande de la to-do
  // d'Edgar. Des gens au travail dans leur métier, une phrase, rien d'autre : aucun
  // écran, aucune interface, aucun mockup, aucune carte en verre. DA claire (fond
  // crème), pensée pour une landing page en thème clair. L'orientation PME passe par
  // les photos, jamais par les mots (ni « PME », ni « TPE », ni « artisans »).
  // Photos : Unsplash d'avant 2017, sous licence CC0, récupérées sur Wikimedia
  // Commons (fichiers « (Unsplash) », licence vérifiée sur la page Commons), copiées
  // dans assets/personnes/. Mention « Photo d'illustration » sur chaque créa, pour
  // qu'on ne prenne pas ces personnes pour des clients Kleak.
  // Aucun prix (décision du 26/10), aucun délai, aucun chiffre.
  // ---------------------------------------------------------------------------

  /* ÉCARTÉE (Edgar, 26/10) : U non retenue, v et w gardées. PNG gardé mais inutilisé.
  // U. Restauration. Bénéfice : des clients qui viennent. Photo : un cuisinier au
  // travail derrière le comptoir d'un café (Joanna Boj, Unsplash MhOoD_h90ks, CC0 via
  // Commons « Cook in a café (Unsplash).jpg »). Photo en carte arrondie sous l'accroche.
  // ÉCARTÉ VOLONTAIREMENT : « en cuisine » ou « restaurant » dans l'accroche (le métier
  // est dans la photo), toute promesse d'être trouvé sur Google, toute réservation en
  // ligne (hors offre).
  u: {
    key: 'u-metier-cafe',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 300, titrePx: 70, photo: 640, photoH: 760, mention: 1430, x: 84, pos: '22% 45%', taille: 'auto 125%' }
        : { marque: 92, titre: 186, titrePx: 62, photo: 460, photoH: 760, mention: 1252, x: 72, pos: '24% 42%', taille: 'auto 128%' };
      return `
      ${fondClair(fmt)}
      <div style="position:absolute;left:${L.x + 10}px;top:${L.marque}px;">${marqueClaire(story)}</div>
      <div style="position:absolute;left:${L.x + 10}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_CLAIR}
        font-size:${L.titrePx}px;line-height:1.1;">Pendant que vous travaillez, votre site donne envie de venir vous ${italiqueBleu('voir.')}</div>
      ${photoCarte(fmt, 'assets/personnes/unsplash-MhOoD_h90ks.jpg', L.x, L.photo, fmt.W - 2 * L.x, L.photoH, L.pos, L.taille)}
      ${mentionPhoto(L.x + 10, L.mention, story)}`;
    },
  },

  */
  // RETENUE (Edgar, 26/10).
  // V. Artisan. Bénéfice : des appels. Photo : les mains d'un menuisier qui travaille
  // une planche (Igor Ovsyannykov, Unsplash iXV0i4Wo4yc, CC0 via Commons « Craft
  // Workshop (Unsplash).jpg »). Photo à fond perdu sur le bas de la créa.
  // ÉCARTÉ VOLONTAIREMENT : « artisan », « chantier », « savoir-faire » (le métier est
  // dans la photo, et « savoir-faire » sonne publicité), tout nombre d'appels.
  v: {
    key: 'v-metier-atelier',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 300, titrePx: 70, photo: 640, mention: 1450, x: 90, pos: '45% 55%' }
        : { marque: 92, titre: 186, titrePx: 62, photo: 470, mention: 1290, x: 82, pos: '45% 60%' };
      // La photo descend jusqu'en bas, y compris sur la story : sous la ligne des 400 px
      // il n'y a que de l'image, la mention reste au-dessus (1450 < 1520).
      return `
      ${fondClair(fmt)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marqueClaire(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_CLAIR}
        font-size:${L.titrePx}px;line-height:1.1;">Un site qui montre votre travail, pour que vos clients vous ${italiqueBleu('appellent.')}</div>
      <div style="position:absolute;left:0;right:0;top:${L.photo}px;bottom:0;overflow:hidden;">
        <div style="position:absolute;inset:0;background:url(${JPG('assets/personnes/unsplash-iXV0i4Wo4yc.jpg')}) ${L.pos} / cover no-repeat;"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg, transparent 70%, rgba(10,10,12,.4) 100%);"></div>
      </div>
      <div style="position:absolute;left:${L.x}px;top:${L.mention}px;font-family:Manrope;font-weight:500;
        font-size:${story ? 22 : 20}px;color:rgba(255,255,255,.85);text-shadow:0 1px 8px rgba(0,0,0,.6);">Photo d'illustration</div>`;
    },
  },

  // RETENUE (Edgar, 26/10).
  // W. Commerce de service. Bénéfice : les clients trouvent ce qu'ils cherchent et
  // vous joignent. Photo : un barbier au travail (Phùng Hải, Unsplash m4Pd_e-4zKs, CC0
  // via Commons « Head shaved by barber (Unsplash).jpg »), présentée en tirage photo
  // (bord blanc, ombre, légère rotation), seul objet de la créa.
  // D'OÙ ÇA VIENT : fiche offre, One page, « 1 page qui réunit tout : présentation,
  // services, avis, zone d'intervention, contact ». L'accroche reprend trois de ces
  // rubriques.
  // ÉCARTÉ VOLONTAIREMENT : horaires et prix dans l'accroche (pas dans la liste de la
  // fiche), « coiffeur » ou « salon », la note Google (une idée par créa).
  w: {
    key: 'w-metier-barbier',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 300, titrePx: 70, tirage: 700, tirageW: 860, imgH: 620, mention: 1440, x: 90, pos: '40% 40%' }
        : { marque: 92, titre: 186, titrePx: 62, tirage: 470, tirageW: 860, imgH: 640, mention: 1262, x: 82, pos: '40% 40%' };
      const bord = 22;
      return `
      ${fondClair(fmt)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marqueClaire(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 40}px;top:${L.titre}px;${TITRE_CLAIR}
        font-size:${L.titrePx}px;line-height:1.1;">Un site où vos clients trouvent vos services, vos avis et votre ${italiqueBleu('numéro.')}</div>
      <div style="position:absolute;left:${(fmt.W - L.tirageW) / 2}px;top:${L.tirage}px;width:${L.tirageW}px;
        padding:${bord}px;background:#FDFCF9;border-radius:6px;transform:rotate(-2.2deg);
        box-shadow:0 40px 70px rgba(60,44,24,.22), 0 8px 18px rgba(60,44,24,.14), inset 0 0 0 1px rgba(0,0,0,.04);">
        <div style="height:${L.imgH}px;border-radius:2px;background:url(${JPG('assets/personnes/unsplash-m4Pd_e-4zKs.jpg')}) ${L.pos} / cover no-repeat;"></div>
      </div>
      ${mentionPhoto(L.x, L.mention, story)}`;
    },
  },

  // ---------------------------------------------------------------------------
  // Série 8 bis (26/10/2026) : après le retour d'Edgar (v et w retenues, u écartée),
  // 3 créas complètement différentes de u, v, w : autres angles, autres mises en page,
  // plus de « photo + phrase sur fond crème ». Même cadre : patrons au travail, bénéfice
  // concret, aucun écran, aucun prix, ni « PME », ni « TPE », ni « artisans ».
  // Photos Pexels (licence Pexels : usage commercial gratuit, attribution non
  // obligatoire), téléchargées par le CDN images.pexels.com, copiées dans
  // assets/personnes/. Les séances de Y et Z sont celles des photos de la landing page
  // (chef 17655298, fleuriste 5409710), avec d'autres images : la pub et la page se
  // ressemblent.
  // ---------------------------------------------------------------------------

  // RETENUE (Edgar, 26/10), post et story déposés dans le hub.
  // X. L'appel qui arrive grâce au site. Photo plein cadre d'une patronne de café au
  // téléphone, qui rit (Pexels 10375889, même séance que la photo de droite de R), et
  // une bulle blanche avec ce que dit la personne au bout du fil. La bulle est
  // l'accroche. Ligne de marque en bas : on comprend que c'est une agence de sites.
  // ÉCARTÉ VOLONTAIREMENT : toute demande précise (devis, réservation) qui exclurait
  // des métiers, tout nom, toute interface d'appel (écran, bouton décrocher), l'écran
  // de l'ordinateur (seul le dos est dans la photo, recadré à gauche).
  x: {
    key: 'x-appel-bulle',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { bulle: 250, bulleW: 820, bullePx: 60, marque: 1380, x: 90, pos: '22% 46%', taille: 'auto 112%' }
        : { bulle: 110, bulleW: 830, bullePx: 56, marque: 1210, x: 80, pos: '8% 52%', taille: '132% auto' };
      return `
      <div style="position:absolute;inset:0;background:url(${JPG('assets/personnes/pexels-10375889.jpg')}) ${L.pos} / ${L.taille} no-repeat;"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(8,9,12,.18) 0%, transparent 35%, transparent 70%, rgba(8,9,12,.7) 100%);"></div>
      <div style="position:absolute;left:${L.x}px;top:${L.bulle}px;width:${L.bulleW}px;">
        <div style="position:relative;background:#FFFFFF;border-radius:${story ? 46 : 42}px;padding:${story ? '44px 50px 48px' : '40px 46px 44px'};
          box-shadow:0 30px 60px rgba(0,0,0,.28);">
          <div style="${TITRE_CLAIR} font-size:${L.bullePx}px;line-height:1.12;">« Bonjour, j'ai vu votre site internet, je voudrais un ${italiqueBleu('renseignement.')} »</div>
          <svg style="position:absolute;left:120px;bottom:-34px;" width="70" height="40" viewBox="0 0 70 40"><path d="M0 0 H70 L18 40 Z" fill="#FFFFFF"/></svg>
        </div>
      </div>
      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.marque}px;display:flex;align-items:center;justify-content:space-between;text-shadow:0 1px 10px rgba(0,0,0,.55);">
        <div style="display:flex;align-items:center;gap:16px;font-family:Manrope;font-weight:600;font-size:${story ? 28 : 26}px;color:#fff;">
          ${icone(story ? 54 : 50)}<span>Kleak Agency <span style="color:rgba(255,255,255,.7);font-weight:500;">· Création de sites internet</span></span></div>
        <div style="font-family:Manrope;font-weight:500;font-size:${story ? 20 : 18}px;color:rgba(255,255,255,.6);">Illustration</div>
      </div>`;
    },
  },

  /* ÉCARTÉES (Edgar, 26/10) : Y et Z non retenues, motif non précisé. PNG gardés mais inutilisés.
  // Y. La personne derrière l'entreprise. Mise en page coupée en deux : à gauche, le
  // portrait d'un chef de face (Pexels 17655302, séance de la photo chef de la landing
  // page) ; à droite, un aplat bleu Kleak avec l'accroche en blanc. Bénéfice : des
  // clients qui viennent en sachant qui les reçoit.
  // ÉCARTÉ VOLONTAIREMENT : « cuisine », « restaurant », « food truck » (le métier est
  // dans la photo), toute promesse de confiance chiffrée, tout avis.
  y: {
    key: 'y-portrait-chef',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { split: 1080, photoH: 900, marque: 980, titre: 1080, titrePx: 66, mention: 1440, x: 80 }
        : { split: 520, marque: 92, titre: 470, titrePx: 60, mention: 1262, x: 572 };
      // Post : photo à gauche (520 px), aplat à droite. Story : photo en haut, aplat en bas
      // (une colonne de 540 px serait trop étroite pour l'accroche à cette taille).
      const photo = story
        ? `<div style="position:absolute;left:0;top:0;width:1080px;height:${L.photoH}px;background:url(${JPG('assets/personnes/pexels-17655302.jpg')}) 46% 30% / cover no-repeat;"></div>`
        : `<div style="position:absolute;left:0;top:0;width:${L.split}px;height:${fmt.H}px;background:url(${JPG('assets/personnes/pexels-17655302.jpg')}) 46% 30% / auto 118% no-repeat;"></div>`;
      const fond = story
        ? `<div style="position:absolute;left:0;right:0;top:${L.photoH}px;bottom:0;background:linear-gradient(170deg,${T.bleu} 0%,#0A23A8 100%);"></div>`
        : `<div style="position:absolute;left:${L.split}px;right:0;top:0;bottom:0;background:linear-gradient(170deg,${T.bleu} 0%,#0A23A8 100%);"></div>`;
      return `
      ${photo}${fond}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;display:flex;align-items:center;gap:14px;font-family:Manrope;
        font-weight:600;font-size:${story ? 24 : 22}px;color:rgba(255,255,255,.85);">
        <div style="width:${story ? 44 : 40}px;height:${story ? 44 : 40}px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;">
          <span style="font-family:'Inter Tight';font-weight:600;color:${T.bleu};font-size:${story ? 26 : 24}px;">K</span></div>Kleak Agency</div>
      <div style="position:absolute;left:${L.x}px;right:${story ? 80 : 60}px;top:${L.titre}px;font-family:'Inter Tight',sans-serif;font-weight:600;
        letter-spacing:-.022em;color:#fff;font-size:${L.titrePx}px;line-height:1.1;">
        Sur votre site, vos clients voient qui les attend avant de ${italique('venir.')}</div>
      <div style="position:absolute;left:${L.x}px;top:${L.mention}px;font-family:Manrope;font-weight:500;
        font-size:${story ? 22 : 20}px;color:rgba(255,255,255,.6);">Photo d'illustration</div>`;
    },
  },

  // Z. Les demandes arrivent sans interrompre le travail. Photo plein cadre d'une
  // fleuriste qui lit son carnet à sa table de travail (Pexels 5409734, séance de la
  // photo fleuriste de la landing page), accroche en blanc dans le tiers bas, sur un
  // dégradé sombre, comme une couverture de magazine.
  // D'OÙ ÇA VIENT : fiche offre, « Formulaire de contact : chaque demande arrive
  // directement dans votre boîte mail ».
  // ÉCARTÉ VOLONTAIREMENT : « fleuriste », « boutique » dans l'accroche, tout délai de
  // réponse, toute réponse automatique (option payante, pas dans les formules).
  z: {
    key: 'z-carnet-fleuriste',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 200, titre: 1090, titrePx: 68, mention: 1450, x: 90, pos: '72% 50%' }
        : { marque: 80, titre: 900, titrePx: 60, mention: 1262, x: 80, pos: '74% 50%' };
      return `
      <div style="position:absolute;inset:0;background:url(${JPG('assets/personnes/pexels-5409734.jpg')}) ${L.pos} / cover no-repeat;"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(10,9,8,.35) 0%, transparent 18%, transparent ${story ? 45 : 48}%, rgba(10,9,8,.78) ${story ? 70 : 78}%, rgba(10,9,8,.86) 100%);"></div>
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;display:flex;align-items:center;gap:14px;font-family:Manrope;font-weight:600;
        font-size:${story ? 24 : 22}px;color:rgba(255,255,255,.9);">${icone(story ? 44 : 40)}Kleak Agency</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 30}px;top:${L.titre}px;font-family:'Inter Tight',sans-serif;font-weight:600;
        letter-spacing:-.022em;color:#fff;font-size:${L.titrePx}px;line-height:1.1;">
        Vos clients vous écrivent depuis votre site. Vous répondez quand vous avez un ${italique('moment.')}</div>
      <div style="position:absolute;left:${L.x}px;top:${L.mention}px;font-family:Manrope;font-weight:500;
        font-size:${story ? 22 : 20}px;color:rgba(255,255,255,.6);">Photo d'illustration</div>`;
    },
  },

  */

  // ---------------------------------------------------------------------------
  // Série 9 (29/10/2026) : la 3e pub de la campagne `Kleak | Relance`, formulaire
  // instantané, 10 € par jour (journal media-buying du 29/10). Elle tourne avec J (avis
  // clients) et r (avant / après) : trois angles qui ne recoupent ni la preuve ni
  // l'avant / après. DA fine de la série 5 (fond sombre, verre, un mot en italique),
  // comme J et r, pour que les trois pubs se tiennent. AUCUN prix. Ligne d'appel commune
  // en bas, écrite pour un formulaire instantané : on laisse ses coordonnées, on est
  // recontacté (email immédiat puis WhatsApp, voir CLAUDE.md), pas de réservation sur une
  // page. « Gratuit » validé par Edgar le 24/10 pour l'appel (créa t).
  // ---------------------------------------------------------------------------
  // AA. Le délai. Un seul objet : une carte en verre « Livraison de votre site », cinq
  // jours en barres, le cinquième en bleu. La condition est dans l'accroche et recopiée
  // mot pour mot en bas.
  // D'OÙ ÇA VIENT : fiche offre, One page : « Livraison en 5 jours ouvrés après
  // réception de vos contenus et du premier paiement ».
  // ÉCARTÉ VOLONTAIREMENT : « en ligne en 5 jours » (la fiche dit « livraison » ; la mise
  // en ligne suit le paiement du solde), tout jour de la semaine nommé (« lundi,
  // vendredi » serait faux en jours ouvrés), le prix, les délais de l'Essentiel et du
  // Pro, la planche sous 48 heures (une idée par créa).
  aa: {
    key: 'aa-livre-5-jours',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 330, titrePx: 70, carte: 760, condition: 1250, appel: 1370, x: 90, s: 1.1 }
        : { marque: 110, titre: 210, titrePx: 62, carte: 560, condition: 1010, appel: 1150, x: 92, s: 1 };
      const s = L.s;
      const jour = (n) => {
        const fin = n === 5;
        return `<div style="flex:1;display:flex;flex-direction:column;gap:${14 * s}px;">
          <div style="height:${fin ? 70 : 54}px;margin-top:${fin ? 0 : 16}px;border-radius:${14 * s}px;
            ${fin ? `background:linear-gradient(160deg,#2F6BFF,${T.bleu});box-shadow:0 12px 30px rgba(15,47,209,.45), inset 0 1px 0 rgba(255,255,255,.3);
              display:flex;align-items:center;justify-content:center;`
              : `background:rgba(255,255,255,${.05 + n * .025});border:1px solid rgba(255,255,255,.08);`}">
            ${fin ? `<svg width="${30 * s}" height="${30 * s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 L10 17.5 L19 7.5"/></svg>` : ''}
          </div>
          <div style="text-align:center;font-family:Manrope;font-weight:600;font-size:${22 * s}px;
            color:${fin ? '#F3F4F7' : 'rgba(255,255,255,.45)'};">${fin ? 'Livré' : `Jour ${n}`}</div>
        </div>`;
      };
      return `
      ${fondFin(fmt, fmt.W * .5, L.carte + 200)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 30}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Votre site internet livré en 5 jours ouvrés, une fois vos contenus ${italique('reçus.')}</div>

      <div style="position:absolute;left:${L.x + 50}px;right:${L.x + 50}px;top:${L.carte - 40}px;height:${200 * s}px;border-radius:26px;
        background:linear-gradient(165deg, rgba(255,255,255,.05), rgba(255,255,255,.012) 50%), rgba(16,17,23,.6);
        border:1px solid rgba(255,255,255,.07);transform:rotate(2deg);"></div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.carte}px;border-radius:30px;
        padding:${40 * s}px ${44 * s}px ${40 * s}px;${VERRE_AVANT} transform:rotate(-1.2deg);">
        <div style="display:flex;align-items:center;gap:${20 * s}px;">
          ${icone(64 * s)}
          <div>
            <div style="font-family:'Inter Tight';font-weight:600;letter-spacing:-.01em;font-size:${36 * s}px;color:#F3F4F7;">Livraison de votre site</div>
            <div style="font-family:Manrope;font-weight:500;font-size:${24 * s}px;color:rgba(255,255,255,.55);margin-top:4px;">5 jours ouvrés</div>
          </div>
        </div>
        <div style="height:1px;background:rgba(255,255,255,.1);margin:${32 * s}px 0 ${30 * s}px;"></div>
        <div style="display:flex;gap:${14 * s}px;align-items:flex-start;">${[1, 2, 3, 4, 5].map(jour).join('')}</div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.condition}px;font-family:Manrope;
        color:rgba(255,255,255,.5);font-size:${story ? 23 : 21}px;line-height:1.45;font-weight:500;">
        Formule One page. Livraison en 5 jours ouvrés après réception de vos contenus et du premier paiement.</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.appel}px;font-family:Manrope;
        color:rgba(255,255,255,.72);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:600;">
        Appel découverte gratuit : laissez vos coordonnées, on vous recontacte.</div>`;
    },
  },

  // RETENUES (Edgar, 29/10) : aa, ab et ac, post et story.
  // AB. Un vrai site Kleak, en situation sur téléphone. Le téléphone déborde en bas à
  // droite, la légende et la ligne d'appel sont à gauche, en colonne.
  // D'OÙ ÇA VIENT : fiche offre, « Affichage soigné sur mobile, tablette et ordinateur »
  // (toutes les formules). Capture `_captures/asa-mobile.png` : Accueil Sénior
  // Assistance, vraie réalisation Kleak (crédit Kleak en pied de page), déjà montrée
  // sur D avec la légende « Réalisation Kleak ». Retouche d'Edgar (29/10) : capture
  // refaite (`asa-mobile-ab.png`) sans la coupure de mot « l'accompag nement ».
  // ÉCARTÉ VOLONTAIREMENT : toute part de visiteurs sur mobile (aucune source), tout
  // propos ou résultat prêté au client, la démo fictive (une vraie réalisation se
  // suffit), Mac Alyster (boutique, site qui n'est pas de Kleak), Frenchies (capture
  // délavée à l'écran).
  ab: {
    key: 'ab-telephone-realisation',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 330, titrePx: 70, tel: 720, telX: 520, telW: 470, legende: 1150, appel: 1290, colW: 380, x: 90 }
        : { marque: 110, titre: 210, titrePx: 62, tel: 500, telX: 560, telW: 430, legende: 930, appel: 1090, colW: 400, x: 92 };
      return `
      ${fondFin(fmt, L.telX + L.telW / 2, L.tel + 300)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 30}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Votre site, aussi soigné sur un téléphone que sur un ${italique('ordinateur.')}</div>

      <div style="position:absolute;left:${L.telX}px;top:${L.tel}px;transform:rotate(-4deg);transform-origin:top left;">
        ${telephone(L.telW, ASA_MOBILE_AB, '#ffffff')}
      </div>

      <div style="position:absolute;left:${L.x}px;width:${L.colW}px;top:${L.legende}px;font-family:Manrope;font-weight:500;
        font-size:${story ? 26 : 24}px;line-height:1.4;color:rgba(255,255,255,.55);">
        <span style="color:#F3F4F7;font-weight:700;">Réalisation Kleak</span><br>Accueil Sénior Assistance</div>
      <div style="position:absolute;left:${L.x}px;width:${L.colW}px;top:${L.appel}px;font-family:Manrope;
        color:rgba(255,255,255,.72);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:600;">
        Appel découverte gratuit : laissez vos coordonnées, on vous recontacte.</div>`;
    },
  },

  // AC. Ce que vous faites, ce que nous faisons (la piste « on s'occupe de tout »,
  // ramenée à ce qui est vrai). Deux cartes en verre : « Vous » en retrait, « Nous » en
  // avant, une ligne par tâche.
  // D'OÙ ÇA VIENT : fiche offre, « Bon à savoir » : « Les textes sont rédigés par nous, à
  // partir de vos réponses au questionnaire » et « Le logo et les photos sont fournis par
  // vous » ; étape 3 : « un questionnaire en ligne (15 minutes) » ; formules : mise en
  // page, « Mentions légales, bandeau cookies et conformité RGPD », « Mise en ligne sur
  // votre nom de domaine ».
  // ÉCARTÉ VOLONTAIREMENT : « on s'occupe de tout » et « vous n'avez rien à faire » (le
  // logo et les photos viennent du client), les photos professionnelles (hors offre),
  // la maintenance, le délai, le prix.
  ac: {
    key: 'ac-on-ecrit-les-textes',
    fonts: FONTS_FIN,
    html: (fmt) => {
      const story = fmt.key === 'story';
      const L = story
        ? { marque: 220, titre: 330, titrePx: 70, vous: 640, nous: 860, appel: 1390, x: 90, s: 1.1 }
        : { marque: 110, titre: 210, titrePx: 62, vous: 460, nous: 650, appel: 1170, x: 92, s: 1 };
      const s = L.s;
      const coche = `<span style="flex:none;width:${34 * s}px;height:${34 * s}px;border-radius:50%;background:linear-gradient(160deg,#2F6BFF,${T.bleu});
        display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.3);">
        <svg width="${18 * s}" height="${18 * s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 L10 17.5 L19 7.5"/></svg></span>`;
      const ligne = (t) => `<div style="display:flex;align-items:center;gap:${18 * s}px;font-family:'Inter Tight';font-weight:500;
        letter-spacing:-.01em;font-size:${33 * s}px;color:#F3F4F7;">${coche}${t}</div>`;
      const libelle = (t, op) => `<div style="font-family:Manrope;font-weight:700;font-size:${22 * s}px;letter-spacing:.02em;color:rgba(255,255,255,${op});">${t}</div>`;
      return `
      ${fondFin(fmt, fmt.W * .5, L.nous + 220)}
      <div style="position:absolute;left:${L.x}px;top:${L.marque}px;">${marquePetite(story)}</div>
      <div style="position:absolute;left:${L.x}px;right:${L.x + 30}px;top:${L.titre}px;${TITRE_FIN}
        font-size:${L.titrePx}px;line-height:1.1;">Vous nous parlez de votre activité, on écrit les textes de votre ${italique('site.')}</div>

      <div style="position:absolute;left:${L.x + 40}px;right:${L.x + 40}px;top:${L.vous}px;border-radius:26px;padding:${28 * s}px ${36 * s}px ${70 * s}px;
        background:linear-gradient(165deg, rgba(255,255,255,.07), rgba(255,255,255,.02) 50%), rgba(16,17,23,.72);
        border:1px solid rgba(255,255,255,.09);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);transform:rotate(1.6deg);">
        ${libelle('Vous', .5)}
        <div style="font-family:Manrope;font-weight:500;font-size:${27 * s}px;line-height:1.4;color:rgba(255,255,255,.7);margin-top:${8 * s}px;">
          Un questionnaire de 15 minutes, votre logo et vos photos</div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.nous}px;border-radius:30px;
        padding:${36 * s}px ${44 * s}px ${42 * s}px;${VERRE_AVANT} transform:rotate(-1.2deg);">
        ${libelle('Nous', .62)}
        <div style="display:flex;flex-direction:column;gap:${24 * s}px;margin-top:${24 * s}px;">
          ${ligne('Les textes')}${ligne('La mise en page')}${ligne('Les mentions légales')}${ligne('La mise en ligne')}
        </div>
      </div>

      <div style="position:absolute;left:${L.x}px;right:${L.x}px;top:${L.appel}px;font-family:Manrope;
        color:rgba(255,255,255,.72);font-size:${story ? 29 : 27}px;line-height:1.4;font-weight:600;">
        Appel découverte gratuit : laissez vos coordonnées, on vous recontacte.</div>`;
    },
  },
};

// --- Variantes d'accroche (24/10/2026) -----------------------------------------
// Demande d'Edgar : o-S, r et t sont retenues ; pour chacune, même visuel, 2 accroches de
// plus (-v2, -v3), chacune avec un autre bénéfice ou un autre point d'entrée. La légende
// ne change que si elle répétait l'accroche. Aucun prix, aucun chiffre de résultat.
const VARIANTES = {
  // o v2 : la rapidité de réception (le visuel dit « à l'instant »). Légende gardée.
  'o-s-v2': ['o-s', 'o-site-captivant-s-v2', { titre: `Quand un visiteur vous écrit depuis votre site, vous le recevez tout de ${italique('suite.')}` }],
  // o v3 : la facilité de contact pour le visiteur. Légende gardée.
  'o-s-v3': ['o-s', 'o-site-captivant-s-v3', { titre: `Un site où vos visiteurs trouvent tout de suite comment vous ${italique('joindre.')}` }],
  // r v2 : le point d'entrée est la douleur (la photo de gauche). Légende gardée.
  'r-v2': ['r', 'r-avant-apres-demandes-v2', { titre: `Votre site est en ligne, mais personne ne vous ${italique('contacte ?')}` }],
  // r v3 : la promesse Kleak, mots d'Edgar (« site captivant qui convertit »). Légende gardée.
  'r-v3': ['r', 'r-avant-apres-demandes-v3', { titre: `Un site captivant, qui convertit vos visiteurs en ${italique('demandes.')}` }],
  // t v2 : ce qu'on fait pendant l'appel (fiche, étape 1). Légende gardée.
  't-v2': ['t', 't-appel-30-minutes-v2', { titre: `On prend 30 minutes pour comprendre votre activité et vos ${italique('objectifs.')}` }],
  // t v3 : le choix du moment. La légende disait déjà « Vous choisissez le jour et
  // l'heure » : elle devient « Appel gratuit de 30 minutes, pour parler de votre site. »
  't-v3': ['t', 't-appel-30-minutes-v3', { titre: `Réservez 30 minutes avec nous, au moment qui vous ${italique('arrange.')}`,
    legende: 'Appel gratuit de 30 minutes, pour parler de votre site.' }],
};
for (const [id, [src, key, txt]] of Object.entries(VARIANTES)) {
  const c = CREAS[src];
  CREAS[id] = { key, fonts: c.fonts, html: c.base ? (fmt) => c.base(fmt, false, txt) : (fmt) => c.html(fmt, txt) };
}

function page(fmt, crea) {
  return `<!doctype html><html><head><meta charset="utf-8">${crea.fonts || FONTS}<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${fmt.W}px; height:${fmt.H}px; position:relative; overflow:hidden; background:${T.noir}; }
  </style></head><body>${crea.html(fmt)}</body></html>`;
}

// --- Rendu -----------------------------------------------------------------
// node build.mjs r s --post -> plusieurs créas, post seul (pas de story).
const args = process.argv.slice(2);
const postSeul = args.includes('--post');
const ids = args.filter((a) => a !== '--post');
const inconnue = ids.find((a) => !CREAS[a]);
if (inconnue) {
  console.error(`Créa inconnue : ${inconnue}. Attendu : ${Object.keys(CREAS).join(' | ')}`);
  process.exit(1);
}
const choix = ids.length ? ids.map((a) => CREAS[a]) : Object.values(CREAS);
// Tant que la créa n'est pas validée, on ne rend que le post.
const formats = ids.length && !postSeul ? FORMATS : FORMATS.filter((f) => f.key === 'post');

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
