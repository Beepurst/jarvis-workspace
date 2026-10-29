// node --test livrables/maquette-prospect/proposition-remplir.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { remplirGabarit, texteSixFois } from "./proposition-remplir.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const lire = (f) => readFileSync(join(ICI, f), "utf8");
const gabarit = lire("proposition-gabarit.html");
const contenu = () => JSON.parse(lire("fixtures/bnbatlantic-contenu.json"));
const donnees = () => JSON.parse(lire("fixtures/bnbatlantic-donnees.json"));
const images = { mobile: "img/m.jpg", accroche: "img/a.jpg", capture1: "img/c1.jpg", capture2: "img/c2.jpg" };

const textes = (c) => [
  c.pour, c.cible, c.nomOffre, c.legendeMobile, c.legendeAccroche, c.chapeauPrix,
  ...c.marche, ...c.neTouchePas, ...c.contenuPage, ...c.inclus, ...c.deroule,
  ...c.freins.flatMap((f) => [f.titre, f.detail]), ...c.captures.map((x) => x.legende),
  ...c.aCaler.flatMap((f) => [f.titre, f.detail]), ...Object.values(c.explicationsOptions),
];
const brut = (h) => h.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

test("la proposition BnbAtlantic contient chaque texte, 3 pages et la case des questions", () => {
  const html = remplirGabarit(gabarit, contenu(), donnees(), images);
  const lisible = brut(html);
  for (const t of textes(contenu())) assert.ok(lisible.includes(t), `texte absent : ${t}`);
  assert.equal((html.match(/<section class="page"/g) ?? []).length, 3);
  assert.ok(html.includes("Ce qu'il reste à caler avec vous"));
  assert.ok(!html.includes("Ce document n'est pas un devis"));
  assert.ok(!html.includes("{{"), "balise non remplie");
});

test("prix, 6 fois, suivi, options et délai viennent des données", () => {
  const html = remplirGabarit(gabarit, contenu(), donnees(), images);
  assert.ok(html.includes("699 €"));
  assert.ok(html.includes("ou 6 × 216,50 € par mois (options comprises)"));
  assert.ok(html.includes("49 € / mois") && html.includes("Obligatoire en paiement en 6 fois."));
  assert.ok(html.includes("+ 400 €") && html.includes("+ 200 €"));
  assert.ok(html.includes("Inclus au devis : Automatisation des demandes") && !html.includes("En option"));
  assert.ok(html.includes("Total du devis : 1\u202f299 €"));
  assert.ok(html.includes("Livrée en 5 jours ouvrés après réception des contenus et du premier paiement"));
  assert.ok(html.includes("TVA non applicable, article 293 B du CGI."));
});

test("un texte hostile est échappé", () => {
  const c = contenu();
  c.marche[0] = "<script>alert(1)</script> & \"x\"";
  const html = remplirGabarit(gabarit, c, donnees(), images);
  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;x&quot;"));
});

test("six fois : premier différent, une fois, sans options", () => {
  const d = donnees();
  d.prix.sixFois = { premier: "216,54 €", suivant: "216,50 €" };
  assert.equal(texteSixFois(d.prix), "ou 6 versements : 216,54 € puis 5 × 216,50 € (options comprises)");
  d.prix.options = [];
  assert.equal(texteSixFois(d.prix), "ou 6 versements : 216,54 € puis 5 × 216,50 €");
  d.prix.sixFois = null;
  const html = remplirGabarit(gabarit, contenu(), d, images);
  assert.ok(!html.includes('class="six"') && !html.includes("ou 6 "));
  assert.ok(!html.includes("En paiement en 6 fois, la page"));
});

test("suivi : obligatoire en 6 fois seulement pour la maintenance, pas pour le suivi des avis", () => {
  const d = donnees();
  d.prix.suivi = { libelle: "Suivi avis", parMois: "29 €", preavisMois: 2, obligatoireSixFois: true };
  const html = remplirGabarit(gabarit, contenu(), d, images);
  assert.ok(html.includes("29 € / mois") && !html.includes("Obligatoire"));
  d.prix.suivi = null;
  assert.ok(!remplirGabarit(gabarit, contenu(), d, images).includes("préavis"));
});

test("sans capture mobile : la liste des freins prend toute la largeur", () => {
  const c = contenu();
  delete c.legendeMobile;
  const html = remplirGabarit(gabarit, c, donnees(), { ...images, mobile: null });
  assert.ok(html.includes('class="grille-c pleine"'));
  assert.ok(!html.includes('class="mobile"'));
  assert.ok(remplirGabarit(gabarit, contenu(), donnees(), images).includes('class="grille-c"'));
});

test("images absentes : les cadres correspondants disparaissent", () => {
  const html = remplirGabarit(gabarit, contenu(), donnees(), { mobile: null, accroche: null, capture1: null, capture2: null });
  assert.ok(!html.includes("img/"));
});

test("un texte hostile dans un champ simple ({{pour}}) est échappé", () => {
  const c = contenu();
  c.pour = "<img src=x onerror=alert(1)> & Cie";
  const html = remplirGabarit(gabarit, c, donnees(), images);
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt; &amp; Cie"));
});

test("un champ manquant d'un élément reste vide, sans reprendre celui du niveau supérieur", () => {
  const c = contenu();
  delete c.aCaler[0].detail;
  const html = remplirGabarit(gabarit, c, donnees(), images);
  assert.ok(html.includes("<li><b>L&#39;objectif.</b> </li>"));
});

test("un titre qui finit par un point n'en double pas", () => {
  const c = contenu();
  c.aCaler[0].titre = "L'objectif.";
  assert.ok(!remplirGabarit(gabarit, c, donnees(), images).includes(".."));
});

test("une suivi autre que « Suivi avis » est une maintenance, quel que soit son libellé", () => {
  const d = donnees();
  d.prix.suivi.libelle = "Hébergement et maintenance";
  assert.ok(remplirGabarit(gabarit, contenu(), d, images).includes("Obligatoire en paiement en 6 fois."));
});

test("une remise garde son signe, sans « + » ; sans option ni ligne, pas de total", () => {
  const d = donnees();
  d.prix.options.push({ libelle: "Remise", prix: "-100\u00a0€" });
  const html = remplirGabarit(gabarit, contenu(), d, images);
  assert.ok(html.includes("-100\u00a0€") && !html.includes("+ -100"));
  d.prix.options = [];
  assert.ok(!remplirGabarit(gabarit, contenu(), d, images).includes("Total du devis"));
});

test("formulation selon la formule : one_page livrée et la page, autre formule livré et le site", () => {
  const d = donnees();
  let html = remplirGabarit(gabarit, contenu(), d, images);
  assert.ok(html.includes("Livrée en 5") && html.includes("En paiement en 6 fois, la page est en ligne"));
  d.devis.formule = "essentiel";
  html = remplirGabarit(gabarit, contenu(), d, images);
  assert.ok(html.includes("Livré en 5") && !html.includes("Livrée") && html.includes("En paiement en 6 fois, le site est en ligne"));
});

test("pied de la page 3 : mention TVA des devis, pas la forme juridique de l'émetteur", () => {
  const html = remplirGabarit(gabarit, contenu(), donnees(), images);
  assert.ok(html.includes("<span>TVA non applicable, article 293 B du CGI.</span>"));
  assert.ok(!html.includes("<span>EI</span>"));
});
