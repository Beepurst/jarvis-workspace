// node --test livrables/maquette-prospect/proposition-controles.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES_ATTENDUES, montantsDeTexte, montantsInconnus, verifierContenu } from "./proposition-controles.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const lire = (f) => JSON.parse(readFileSync(join(ICI, "fixtures", f), "utf8"));
const contenu = () => lire("bnbatlantic-contenu.json");
const sources = ["190 €", "690 €"];
const donnees = () => lire("bnbatlantic-donnees.json");
const ps = { mobile: 41, mesure_le: "2026-10-29" };

test("PAGES_ATTENDUES vaut 3", () => assert.equal(PAGES_ATTENDUES, 3));

test("la fixture BnbAtlantic (190 € à 690 € du site) passe avec les montants du site, pas sans", () => {
  assert.deepEqual(verifierContenu(contenu(), donnees(), ps, sources), []);
  const e = verifierContenu(contenu(), donnees(), ps);
  assert.ok(e.some((x) => x.includes("690 €")) && e.some((x) => x.includes("190 €")), e.join("|"));
});

test("un champ obligatoire manquant est nommé", () => {
  const c = contenu();
  delete c.chapeauPrix;
  const e = verifierContenu(c, donnees(), ps);
  assert.ok(e.some((x) => x.includes("chapeauPrix")), e.join("|"));
});

test("5 freins : erreur", () => {
  const c = contenu();
  c.freins.push({ titre: "Un de plus.", detail: "Trop." });
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.includes("freins") && x.includes("5")));
});

test("inclus : 2 refusé, 3 et 4 acceptés, 5 refusé", () => {
  const c = contenu();
  c.inclus = ["a", "b"];
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.startsWith("inclus")));
  c.inclus = ["a", "b", "c"];
  assert.deepEqual(verifierContenu(c, donnees(), ps, sources), []);
  c.inclus = ["a", "b", "c", "d", "e"];
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.startsWith("inclus")));
});

test("un tiret long est refusé", () => {
  const c = contenu();
  c.marche[0] = "Un argument — fort.";
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.includes("Tiret long")));
});

test("un frein de 200 mots dépasse", () => {
  const c = contenu();
  c.freins[0].detail = Array(200).fill("mot").join(" ");
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.includes("dépasse")));
});

test("montantsInconnus : montants du devis acceptés, autres refusés, espaces normalisées", () => {
  assert.deepEqual(montantsInconnus("699 € ou 6 × 116,50 €", ["699 €", "116,50 €"]), []);
  assert.deepEqual(montantsInconnus("690 €", ["699 €"]), ["690 €"]);
  assert.deepEqual(montantsInconnus("1 299 € puis 216,50 €", ["1 299 €", "216,50 €"]), []);
  assert.deepEqual(montantsInconnus("1 300 €", ["1 299 €"]), ["1 300 €"]);
  assert.deepEqual(montantsInconnus("49€ par mois", ["49 €"]), []);
  assert.deepEqual(montantsInconnus("aucun prix ici, 6 fois", ["49 €"]), []);
});

test("montant inconnu dans le contenu : erreur", () => {
  const c = contenu();
  c.marche[0] = "Une page à 650 €.";
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.includes("Montant inconnu") && x.includes("650")));
});

test("PageSpeed cité sans mesure : erreur ; avec mesure : accepté", () => {
  const c = contenu();
  c.freins[2].detail = "Le site obtient 41 sur 100 sur mobile.";
  assert.ok(verifierContenu(c, donnees(), { mobile: null }, sources).some((x) => x.includes("PageSpeed")));
  assert.ok(verifierContenu(c, donnees(), null, sources).some((x) => x.includes("PageSpeed")));
  assert.deepEqual(verifierContenu(c, donnees(), ps, sources), []);
});

test("montant tiré des sources : accepté quand il y est, refusé sinon", () => {
  const c = contenu();
  c.marche[0] = "Une page à 650 €.";
  assert.ok(verifierContenu(c, donnees(), ps, sources).some((x) => x.includes("650")));
  assert.ok(!verifierContenu(c, donnees(), ps, [...sources, "650 €"]).some((x) => x.includes("650")));
});

test("montantsInconnus : « euros », « euro » et séparateur de milliers", () => {
  assert.deepEqual(montantsInconnus("690 euros", ["699 €"]), ["690 euros"]);
  assert.deepEqual(montantsInconnus("699 euros", ["699 €"]), []);
  assert.deepEqual(montantsInconnus("1 euro", ["1 €"]), []);
  assert.deepEqual(montantsInconnus("les 2 400 € du site", ["2 400 €"]), []);
  assert.deepEqual(montantsInconnus("les 2 400 € du site", ["400 €"]), ["2 400 €"]);
  assert.deepEqual(montantsInconnus("6 × 216,50 €", ["216,50 €"]), []);
  assert.deepEqual(montantsInconnus("un européen", []), []);
});

test("montantsDeTexte : liste normalisée sans doublon", () => {
  assert.deepEqual(montantsDeTexte("de 190\u202f€ à 690 euros, puis 190 €"), ["190 €", "690 euros"]);
});
