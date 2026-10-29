// Contrôles purs de la proposition (sans disque ni navigateur) : champs obligatoires, bornes, longueurs,
// tirets longs, montants en euros hors données du hub, score PageSpeed sans mesure.
// Les contrôles de mise en page (débordement, 3 pages) sont dans proposition-rendre.mjs (ils se mesurent dans le DOM).

export const PAGES_ATTENDUES = 3;

// Bornes de nombre d'éléments par liste. `inclus` : le moteur ajoute la ligne du délai (donc 4 ou 5 points à l'écran).
export const BORNES = {
  marche: [2, 4],
  neTouchePas: [2, 4],
  freins: [3, 4],
  contenuPage: [6, 12],
  inclus: [3, 4],
  deroule: [4, 7],
  aCaler: [2, 5],
  captures: [0, 2],
};

// Longueur maximale en mots, par texte (au-delà, la page déborde : raccourcir, ne pas réduire les polices).
export const MOTS_MAX = {
  titre: 14,
  chapeau: 60,
  chapeauPrix: 40,
  legende: 25,
  point: 30,
  frein: 45,
  caleDetail: 35,
  explicationOption: 30,
};

const CHAMPS_TEXTE = ["pour", "titre", "cible", "chapeau", "chapeauPrix", "legendeAccroche"];

const mots = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;
const plein = (v) => typeof v === "string" && v.trim() !== "";

/** Tous les textes de contenu.json avec leur nom, pour les contrôles transversaux. */
export function textesDe(c) {
  const sortie = [];
  const ajouter = (nom, v) => {
    if (typeof v === "string") sortie.push([nom, v]);
  };
  for (const k of [...CHAMPS_TEXTE, "nomOffre", "legendeMobile"]) ajouter(k, c[k]);
  for (const k of ["marche", "neTouchePas", "contenuPage", "inclus", "deroule"]) (c[k] ?? []).forEach((v, i) => ajouter(`${k}[${i}]`, v));
  (c.freins ?? []).forEach((f, i) => {
    ajouter(`freins[${i}].titre`, f?.titre);
    ajouter(`freins[${i}].detail`, f?.detail);
  });
  (c.captures ?? []).forEach((x, i) => ajouter(`captures[${i}].legende`, x?.legende));
  (c.aCaler ?? []).forEach((x, i) => {
    ajouter(`aCaler[${i}].titre`, x?.titre);
    ajouter(`aCaler[${i}].detail`, x?.detail);
  });
  for (const [k, v] of Object.entries(c.explicationsOptions ?? {})) ajouter(`explicationsOptions.${k}`, v);
  return sortie;
}

// ---------- montants ----------

const ESPACES = /[\s   ]+/g;
const normaliser = (t) => String(t).replace(ESPACES, " ").trim();
const sansEspaces = (t) => String(t).replace(ESPACES, "");

// Un montant : chiffres (milliers séparés par espace, insécable ou fine), décimales en virgule, puis « € » ou « euro(s) » (espace permis).
// Le chiffre ne doit pas être précédé d'un autre chiffre, d'une virgule ou d'un point : « les 2 400 € » se lit 2 400 €, « 6 × 216,50 € » 216,50 €.
const MONTANT = /(?<![\d,.])(?:\d{1,3}(?:[\s\u00a0\u202f\u2009]\d{3})+|\d+)(?:,\d{1,2})?[\s\u00a0\u202f\u2009]?(?:€|euros?(?![A-Za-zÀ-ÿ]))/gi;
const canon = (t) => sansEspaces(t).replace(/euros?$/i, "€");

/** Tous les montants en euros d'un texte, espaces normalisées, sans doublon. */
export function montantsDeTexte(texte) {
  return [...new Set([...String(texte).matchAll(MONTANT)].map((m) => normaliser(m[0])))];
}

/** Montants en euros du texte qui ne sont pas dans `autorises` (comparaison sans espaces, « euros » = « € »). */
export function montantsInconnus(texte, autorises) {
  const ok = new Set((autorises ?? []).map(canon));
  return montantsDeTexte(texte).filter((m) => !ok.has(canon(m)));
}

// ---------- contrôle global ----------

/**
 * Erreurs de contenu.json (liste vide = bon). `pagespeed` : contenu de site/pagespeed.json ou null.
 * `montantsSources` : montants en euros trouvés dans les sources du prospect (site, transcription), permis en plus de ceux du devis.
 */
export function verifierContenu(contenu, donnees, pagespeed, montantsSources = []) {
  const erreurs = [];
  const c = contenu && typeof contenu === "object" ? contenu : {};

  for (const k of CHAMPS_TEXTE) if (!plein(c[k])) erreurs.push(`Champ obligatoire manquant ou vide : ${k}.`);
  for (const k of Object.keys(BORNES)) {
    const [min, max] = BORNES[k];
    const v = c[k];
    if (v === undefined && min === 0) continue;
    if (!Array.isArray(v)) {
      erreurs.push(`Champ obligatoire manquant : ${k} (liste attendue).`);
      continue;
    }
    if (v.length < min || v.length > max) erreurs.push(`${k} : ${v.length} élément(s), ${min} à ${max} attendus.`);
  }
  if (!c.page || !plein(c.page)) erreurs.push("Champ obligatoire manquant ou vide : page (page de la maquette, par exemple « accueil »).");
  if (c.legendeMobile !== undefined && !plein(c.legendeMobile)) erreurs.push("legendeMobile vide : l'omettre ou la rédiger.");

  const limite = (nom, texte, max) => {
    if (typeof texte === "string" && mots(texte) > max) erreurs.push(`${nom} dépasse ${max} mots (${mots(texte)}) : raccourcir le texte.`);
  };
  limite("titre", c.titre, MOTS_MAX.titre);
  limite("chapeau", c.chapeau, MOTS_MAX.chapeau);
  limite("chapeauPrix", c.chapeauPrix, MOTS_MAX.chapeauPrix);
  limite("legendeAccroche", c.legendeAccroche, MOTS_MAX.legende);
  limite("legendeMobile", c.legendeMobile, MOTS_MAX.legende);
  (c.captures ?? []).forEach((x, i) => {
    if (!plein(x?.selecteur)) erreurs.push(`captures[${i}].selecteur manquant.`);
    if (!plein(x?.legende)) erreurs.push(`captures[${i}].legende manquante.`);
    limite(`captures[${i}].legende`, x?.legende, MOTS_MAX.legende);
  });
  (c.freins ?? []).forEach((f, i) => {
    if (!plein(f?.titre) || !plein(f?.detail)) erreurs.push(`freins[${i}] : titre et detail obligatoires.`);
    limite(`freins[${i}].titre`, f?.titre, MOTS_MAX.point);
    limite(`freins[${i}].detail`, f?.detail, MOTS_MAX.frein);
  });
  for (const k of ["marche", "neTouchePas", "contenuPage", "inclus", "deroule"]) (c[k] ?? []).forEach((v, i) => limite(`${k}[${i}]`, v, MOTS_MAX.point));
  (c.aCaler ?? []).forEach((x, i) => {
    if (!plein(x?.titre) || !plein(x?.detail)) erreurs.push(`aCaler[${i}] : titre et detail obligatoires.`);
    limite(`aCaler[${i}].detail`, x?.detail, MOTS_MAX.caleDetail);
  });
  for (const [k, v] of Object.entries(c.explicationsOptions ?? {})) limite(`explicationsOptions.${k}`, v, MOTS_MAX.explicationOption);

  // Les options du devis doivent toutes avoir leur explication (sinon la ligne de prix reste vide).
  for (const o of donnees?.prix?.options ?? []) {
    if (!plein(c.explicationsOptions?.[o.libelle])) erreurs.push(`explicationsOptions manque pour l'option « ${o.libelle} ».`);
  }

  const textes = textesDe(c);
  for (const [nom, t] of textes) {
    if (/[—–]/.test(t)) erreurs.push(`Tiret long dans ${nom} : le remplacer par une virgule ou un point.`);
  }
  const autorises = [...(donnees?.prix?.montantsAutorises ?? []), ...montantsSources];
  for (const [nom, t] of textes) {
    const inconnus = montantsInconnus(t, autorises);
    if (inconnus.length) erreurs.push(`Montant inconnu du devis dans ${nom} : ${inconnus.join(", ")} (seuls ceux du devis, du site et du RDV sont permis).`);
  }
  if (!pagespeed || typeof pagespeed.mobile !== "number") {
    for (const [nom, t] of textes) {
      if (/page\s?speed|sur 100/i.test(t)) erreurs.push(`Score PageSpeed cité dans ${nom} alors que pagespeed.mobile est null (non mesuré).`);
    }
  }
  return erreurs;
}
