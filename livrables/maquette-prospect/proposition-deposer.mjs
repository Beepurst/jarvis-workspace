#!/usr/bin/env node
// Dépôt de la proposition d'un prospect dans le hub (fiche du compte). N'envoie rien au prospect.
//
//   node livrables/maquette-prospect/proposition-deposer.mjs <dossier du prospect>
//
// 1. relance le rendu et le contrôle (proposition-rendre.mjs) : rien n'est envoyé au moindre refus ;
// 2. POST /api/agent/propositions/televersement { devis_id } -> URL signée ; PUT du PDF sur cette URL ;
// 3. POST /api/agent/propositions { devis_id, empreinte, chemin } avec l'empreinte des prix de donnees.json.
// Sortie standard : JSON { code, cree, fiche }. Le secret n'est jamais affiché.
// Codes de sortie : 0 fait, 1 hub injoignable ou refus du hub, 2 refus local (contenu ou mise en page),
// 7 le devis a changé depuis proposition-preparer.mjs : relancer proposition-preparer.mjs puis refaire la proposition.

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ErreurSortie, adresseHub, appelHub, lancer, messageRefus } from "./commun.mjs";
import { rendre } from "./proposition-rendre.mjs";

async function principal() {
  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!arg) throw new ErreurSortie(1, "Usage : proposition-deposer.mjs <dossier du prospect>");
  const dossier = resolve(arg);

  const r = await rendre(dossier);
  if (!r.ok) throw new ErreurSortie(2, `Proposition refusée avant envoi :\n- ${r.erreurs.join("\n- ")}`);

  const donnees = JSON.parse(readFileSync(join(dossier, "proposition", "donnees.json"), "utf8"));
  const devisId = donnees.devis?.id;
  const empreinte = donnees.prix?.empreinte;
  if (!devisId || !empreinte) throw new ErreurSortie(2, "donnees.json : devis.id ou prix.empreinte absent : relancer proposition-preparer.mjs.");
  const chemin = `${devisId}/proposition.pdf`;

  const t = await appelHub("POST", "/api/agent/propositions/televersement", { devis_id: devisId });
  if (t.status === 409 && /a changé/i.test(t.json?.error ?? "")) throw new ErreurSortie(7, `${messageRefus(t)} Relancer proposition-preparer.mjs.`);
  if (t.status !== 200 || !t.json?.televersement?.url) throw new ErreurSortie(1, messageRefus(t));
  let put;
  try {
    put = await fetch(t.json.televersement.url, {
      method: "PUT",
      headers: { "content-type": "application/pdf", "cache-control": "max-age=3600", "x-upsert": "true" },
      body: readFileSync(r.pdf),
      signal: AbortSignal.timeout(60000),
    });
  } catch (e) {
    throw new ErreurSortie(1, `Envoi du PDF impossible : ${e.cause?.code || e.cause?.message || e.message}`);
  }
  if (!put.ok) throw new ErreurSortie(1, `Envoi du PDF refusé (${put.status}) : ${(await put.text()).slice(0, 300)}`);

  const d = await appelHub("POST", "/api/agent/propositions", { devis_id: devisId, empreinte, chemin });
  if (d.status === 409 && /a changé/i.test(d.json?.error ?? "")) {
    throw new ErreurSortie(7, `${messageRefus(d)} Le devis a changé depuis la préparation : relancer proposition-preparer.mjs, puis refaire la proposition.`);
  }
  if (d.status !== 200 && d.status !== 201) throw new ErreurSortie(1, messageRefus(d));
  process.stdout.write(
    JSON.stringify({ code: d.status, cree: d.status === 201, fiche: `${adresseHub()}${d.json?.fiche ?? `/comptes/${donnees.compte?.id}`}` }, null, 2) + "\n",
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) lancer(principal);
