#!/usr/bin/env node
// Prépare la proposition d'un prospect : lit le compte, le devis, les prix et le dernier RDV dans le hub.
//
//   node livrables/maquette-prospect/proposition-preparer.mjs "<nom ou id>"
//
// Écrit <dossier>/proposition/donnees.json (réponse du hub telle quelle, plus `dossier`).
// Si le site du compte est `ok` et que <dossier>/site/ manque, lance preparer.mjs pour ce compte.
// Sortie standard : JSON { dossier, devis, prix, rdv: !!rdv, avertissements }.
//
// Codes de sortie : 0 fait, 1 erreur (hub, arguments), 5 plusieurs comptes correspondent (liste sur la sortie
// standard), 6 pas de devis en brouillon ou prêt à envoyer, plus ceux de preparer.mjs si le site est lu (3).
// Le secret n'est jamais affiché.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ErreurSortie, ICI, appelHub, dossierProspect, lancer, messageRefus } from "./commun.mjs";

async function principal() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0].startsWith("--")) throw new ErreurSortie(1, 'Usage : proposition-preparer.mjs "<nom ou id>"');
  const recherche = args[0];

  const r = await appelHub("GET", `/api/agent/propositions?compte=${encodeURIComponent(recherche)}`);
  if (r.status === 409) {
    const comptes = (r.json?.comptes ?? []).map((c) => ({ id: c.id, nom: c.nom, entreprise: c.entreprise, email: c.email, site_url: c.site_url, site_statut: c.site_statut }));
    process.stdout.write(JSON.stringify({ plusieurs: comptes }, null, 2) + "\n");
    throw new ErreurSortie(5, `Plusieurs comptes correspondent à « ${recherche} » : relancer avec l'id.`);
  }
  if (r.status !== 200) throw new ErreurSortie(1, messageRefus(r));
  const donnees = r.json;
  if (!donnees?.devis || !donnees?.prix) {
    throw new ErreurSortie(6, `Pas de devis en brouillon ou prêt à envoyer pour « ${recherche} » : le créer dans le hub d'abord.`);
  }

  const compte = donnees.compte;
  const dossier = dossierProspect(compte);
  if (compte.site_statut === "ok" && compte.site_url && !existsSync(join(dossier, "site"))) {
    const lu = spawnSync(process.execPath, [join(ICI, "preparer.mjs"), compte.id], { stdio: ["ignore", "ignore", "inherit"] });
    if (lu.status !== 0) throw new ErreurSortie(lu.status ?? 1, `Lecture du site (preparer.mjs) en échec, code ${lu.status}.`);
  }

  mkdirSync(join(dossier, "proposition"), { recursive: true });
  writeFileSync(join(dossier, "proposition", "donnees.json"), JSON.stringify({ ...donnees, dossier }, null, 2) + "\n");
  process.stdout.write(JSON.stringify({ dossier, devis: donnees.devis, prix: donnees.prix, rdv: !!donnees.rdv, avertissements: donnees.avertissements ?? [] }, null, 2) + "\n");
}

lancer(principal);
