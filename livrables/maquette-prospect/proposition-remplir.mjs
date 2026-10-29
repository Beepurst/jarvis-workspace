// Remplissage du gabarit de proposition (proposition-gabarit.html) : petit moteur {{…}} et vue construite
// à partir de contenu.json (texte rédigé par l'agent) et donnees.json (hub : prix, 6 fois, suivi, options, émetteur).
//   {{x}}        texte brut échappé
//   {{{x}}}      texte riche : échappé, puis **gras** et retours à la ligne (\n) permis, rien d'autre
//   {{#x}}…{{/x}} bloc répété (liste), ou affiché une fois (objet, texte non vide) ; {{^x}}…{{/x}} si vide
// Fonction pure : aucun accès disque ni réseau. Les prix ne viennent que des données du hub.

const SUIVI_AVIS_LIBELLE = "Suivi avis";
const ECHAPPEMENTS = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function echapper(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, (c) => ECHAPPEMENTS[c]);
}

/** Texte riche : échappé d'abord, puis **gras** et retours à la ligne. */
export function riche(texte) {
  return echapper(texte)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\r?\n/g, "<br>");
}

// ---------- moteur ----------

function chercher(pile, nom) {
  const haut = pile[pile.length - 1];
  if (nom === ".") return haut;
  // Dans un élément de liste ou un bloc, seuls ses propres champs comptent : un champ manquant reste vide.
  if (pile.length > 1) return haut !== null && typeof haut === "object" && !Array.isArray(haut) ? haut[nom] : undefined;
  return haut?.[nom];
}

const vide = (v) => v === undefined || v === null || v === false || v === "" || (Array.isArray(v) && v.length === 0);

/** Position de la balise fermante de `nom` qui correspond à une ouverture déjà lue (imbrications du même nom comprises). */
function fermeture(modele, depuis, nom) {
  const motif = /\{\{([#^/])([^}]+)\}\}/g;
  motif.lastIndex = depuis;
  let profondeur = 1;
  for (let m; (m = motif.exec(modele)); ) {
    if (m[2] !== nom) continue;
    profondeur += m[1] === "/" ? -1 : 1;
    if (profondeur === 0) return { debut: m.index, fin: motif.lastIndex };
  }
  throw new Error(`Gabarit : {{#${nom}}} sans {{/${nom}}}.`);
}

function rendre(modele, pile) {
  let sortie = "";
  let i = 0;
  const motif = /\{\{\{([^}]+)\}\}\}|\{\{([#^])([^}]+)\}\}|\{\{([^#^/}][^}]*)\}\}/g;
  for (let m; (m = motif.exec(modele)); ) {
    sortie += modele.slice(i, m.index);
    if (m[1] !== undefined) {
      sortie += riche(chercher(pile, m[1].trim()));
      i = motif.lastIndex;
    } else if (m[2] !== undefined) {
      const nom = m[3].trim();
      const f = fermeture(modele, motif.lastIndex, nom);
      const interieur = modele.slice(motif.lastIndex, f.debut);
      const v = chercher(pile, nom);
      if (m[2] === "^") {
        if (vide(v)) sortie += rendre(interieur, pile);
      } else if (Array.isArray(v)) {
        for (const item of v) sortie += rendre(interieur, [...pile, item]);
      } else if (!vide(v)) {
        sortie += rendre(interieur, typeof v === "object" ? [...pile, v] : pile);
      }
      motif.lastIndex = f.fin;
      i = f.fin;
    } else {
      sortie += echapper(chercher(pile, m[4].trim()));
      i = motif.lastIndex;
    }
  }
  return sortie + modele.slice(i);
}

// ---------- vue ----------

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function dateFrancaise(d) {
  const x = d ? new Date(d) : new Date();
  const date = Number.isNaN(x.getTime()) ? new Date() : x;
  return `${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Libellé des 6 versements. Premier = suivant : « 6 × x » ; sinon « x puis 5 × y ». « (options comprises) » si le devis a des options. */
export function texteSixFois(prix) {
  const s = prix.sixFois;
  if (!s) return null;
  const base = s.premier === s.suivant ? `ou 6 × ${s.suivant} par mois` : `ou 6 versements : ${s.premier} puis 5 × ${s.suivant}`;
  return prix.options?.length ? `${base} (options comprises)` : base;
}

function liste(valeur) {
  return Array.isArray(valeur) ? valeur.filter((x) => typeof x === "string" && x.trim()) : [];
}

export function construireVue(contenu, donnees, images = {}) {
  const prix = donnees.prix;
  if (!prix) throw new Error("donnees.prix absent : pas de devis en brouillon ou prêt.");
  const compte = donnees.compte ?? {};
  const emetteur = donnees.emetteur ?? {};
  const entreprise = compte.entreprise || compte.nom || "";
  const cadre = (src, legende) => (src ? { src, legende } : null);

  const mobile = contenu.legendeMobile && images.mobile ? cadre(images.mobile, contenu.legendeMobile) : null;
  const captures = (contenu.captures ?? [])
    .map((c, i) => cadre(images[`capture${i + 1}`], c.legende))
    .filter(Boolean);

  const page = liste(contenu.contenuPage);
  const moitie = Math.ceil(page.length / 2);

  const lignesPrix = [];
  if (prix.suivi) {
    const maintenance = prix.suivi.libelle !== SUIVI_AVIS_LIBELLE;
    const preavis = `Sans engagement, préavis de ${prix.suivi.preavisMois} mois.`;
    lignesPrix.push({
      titre: prix.suivi.libelle,
      detail: maintenance && prix.suivi.obligatoireSixFois ? `${preavis} Obligatoire en paiement en 6 fois.` : preavis,
      montant: `${prix.suivi.parMois} / mois`,
    });
  }
  for (const o of prix.options ?? []) {
    // Options et lignes libres font partie du total du devis. « + » seulement pour un montant positif (une remise garde son signe).
    const negatif = /^[-\u2212]/.test(String(o.prix).trim());
    lignesPrix.push({ titre: `Inclus au devis : ${o.libelle}`, detail: contenu.explicationsOptions?.[o.libelle] ?? "", montant: negatif ? o.prix : `+ ${o.prix}` });
  }

  const six = texteSixFois(prix);
  // Une page seule (one_page) se « livre » au féminin ; tout autre devis est un site.
  const unePage = donnees.devis?.formule === "one_page";
  return {
    entreprise,
    pour: contenu.pour,
    date: dateFrancaise(donnees.dateProposition),
    contactEntete: [emetteur.nom, emetteur.email].filter(Boolean).join(" · ") + (emetteur.telephone ? `\n${emetteur.telephone} · kleakagency.fr` : ""),
    titre: contenu.titre,
    cible: contenu.cible,
    marche: liste(contenu.marche),
    neTouchePas: liste(contenu.neTouchePas),
    freins: contenu.freins ?? [],
    classePleine: mobile ? "" : " pleine",
    mobile,
    chapeau: contenu.chapeau,
    accroche: cadre(images.accroche, contenu.legendeAccroche),
    captures: captures.length ? [captures] : [],
    colonne1: page.slice(0, moitie),
    colonne2: page.slice(moitie),
    chapeauPrix: contenu.chapeauPrix,
    nomOffre: contenu.nomOffre || prix.formule,
    prixSite: prix.prixSite,
    totalDevis: prix.options?.length && prix.total ? { texte: `Total du devis : ${prix.total}` } : null,
    sixFois: six ? { texte: six, objet: unePage ? "la page" : "le site" } : null,
    inclus: [`${unePage ? "Livrée" : "Livré"} en ${prix.delaiJoursOuvres} jours ouvrés après réception des contenus et du premier paiement`, ...liste(contenu.inclus)],
    lignesPrix,
    deroule: liste(contenu.deroule),
    aCaler: (contenu.aCaler ?? []).map((x) => ({ ...x, titre: String(x.titre ?? "").replace(/\.$/, "") })),
    mention: `${MENTION_TVA}.`,
  };
}

/** Même mention que les devis du hub (`MENTION_TVA`, src/lib/devis/contenu.ts) ; `emetteur.mention` est la forme juridique (EI). */
const MENTION_TVA = "TVA non applicable, article 293 B du CGI";

/** Gabarit HTML + contenu rédigé + données du hub + chemins d'images (mobile, accroche, capture1, capture2, ou null) -> HTML. */
export function remplirGabarit(gabaritHtml, contenu, donnees, images = {}) {
  const vue = construireVue(contenu, donnees, images);
  // « plain » : champs en {{x}} reçoivent du texte brut ; ceux en {{{x}}} du texte riche (échappé aussi).
  return rendre(gabaritHtml, [vue]);
}
