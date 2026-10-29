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
  assert.ok(html.includes("ou 6 × 116,50 € par mois (options comprises)"));
  assert.ok(html.includes("49 € / mois") && html.includes("Obligatoire en paiement en 6 fois."));
  assert.ok(html.includes("+ 400 €") && html.includes("+ 200 €"));
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
  d.prix.sixFois = { premier: "116,52 €", suivant: "116,50 €" };
  assert.equal(texteSixFois(d.prix), "ou 6 versements : 116,52 € puis 5 × 116,50 € (options comprises)");
  d.prix.options = [];
  assert.equal(texteSixFois(d.prix), "ou 6 versements : 116,52 € puis 5 × 116,50 €");
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
