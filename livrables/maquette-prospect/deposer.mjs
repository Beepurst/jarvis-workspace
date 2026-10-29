#!/usr/bin/env node
// Dépôt de la maquette d'un prospect dans le hub (fiche du compte). N'envoie rien au prospect.
//
//   node livrables/maquette-prospect/deposer.mjs <dossier du prospect> [--dry-run]
//
// Lit <dossier>/compte.json (id du compte), maquette/index.html, maquette/img/ et analyse.json
// ({ constats: [{ titre, detail, gain }] }, 3 à 8 constats). Le score PageSpeed n'est jamais pris
// dans analyse.json : il vient de site/pagespeed.json (mesuré par preparer.mjs), ou null.
// 1. contrôle du fichier (mêmes règles que controler.mjs, sans navigateur) ;
// 2. une URL signée par image référencée (POST /api/agent/maquettes/televersement), envoi de chaque image ;
// 3. POST /api/agent/maquettes { compte_id, html, fichiers, analyse }. Un redépôt remplace la maquette,
//    le lien envoyé au prospect reste le même.
// Sortie : JSON { code, cree, fiche }. Le secret n'est jamais affiché.
// Codes de sortie : 0 fait, 1 hub injoignable ou refus du hub (code et message affichés),
// 2 refus local (rien n'est envoyé).

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { ErreurSortie, adresseHub, appelHub, lancer, messageRefus, verifierHtml } from "./commun.mjs";

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const lireJson = (f) => {
  try {
    return JSON.parse(readFileSync(f, "utf8"));
  } catch (e) {
    throw new ErreurSortie(2, `${f} illisible : ${e.message}`);
  }
};

function analyseValide(a, pagespeed) {
  if (!a || !Array.isArray(a.constats)) throw new ErreurSortie(2, "analyse.json : { constats: [...] } attendu.");
  if (a.constats.length < 3 || a.constats.length > 8) throw new ErreurSortie(2, `analyse.json : ${a.constats.length} constats, 3 à 8 attendus (5 ou 6 visés).`);
  const constats = a.constats.map((c, i) => {
    for (const k of ["titre", "detail", "gain"]) {
      if (typeof c?.[k] !== "string" || !c[k].trim()) throw new ErreurSortie(2, `analyse.json : constats[${i}].${k} vide.`);
      if (/[—–]/.test(c[k])) throw new ErreurSortie(2, `analyse.json : tiret long dans constats[${i}].${k}.`);
    }
    return { titre: c.titre.trim(), detail: c.detail.trim(), gain: c.gain.trim() };
  });
  return { constats, pagespeed };
}

async function principal() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const arg = args.find((a) => !a.startsWith("--"));
  if (!arg) throw new ErreurSortie(1, "Usage : deposer.mjs <dossier du prospect> [--dry-run]");
  const dossier = resolve(arg);

  // ----- contrôles locaux -----
  const compteJson = join(dossier, "compte.json");
  if (!existsSync(compteJson)) throw new ErreurSortie(2, `${compteJson} introuvable : lancer preparer.mjs d'abord.`);
  const { compte, essai } = lireJson(compteJson);
  if (essai || !compte?.id) throw new ErreurSortie(2, "Dossier d'essai (sans compte du hub) : rien à déposer.");
  if (!UUID.test(compte.id)) throw new ErreurSortie(2, `compte.json : id « ${compte.id} » invalide.`);

  const dossierMaquette = join(dossier, "maquette");
  const fichierHtml = join(dossierMaquette, "index.html");
  if (!existsSync(fichierHtml)) throw new ErreurSortie(2, `${fichierHtml} introuvable.`);
  const html = readFileSync(fichierHtml, "utf8");
  const { erreurs, images } = verifierHtml(html, dossierMaquette);
  if (erreurs.length) throw new ErreurSortie(2, `Maquette refusée avant envoi :\n- ${erreurs.join("\n- ")}`);
  if (!existsSync(join(dossier, "controle-mobile.jpg"))) throw new ErreurSortie(2, "Pas de contrôle : lancer controler.mjs avant de déposer.");

  const fichierAnalyse = join(dossier, "analyse.json");
  if (!existsSync(fichierAnalyse)) throw new ErreurSortie(2, `${fichierAnalyse} introuvable.`);
  const ps = existsSync(join(dossier, "site/pagespeed.json")) ? lireJson(join(dossier, "site/pagespeed.json")) : null;
  const pagespeed = typeof ps?.mobile === "number" && ps.mesure_le ? { mobile: ps.mobile, mesure_le: ps.mesure_le } : null;
  const analyse = analyseValide(lireJson(fichierAnalyse), pagespeed);

  const presentes = existsSync(join(dossierMaquette, "img")) ? readdirSync(join(dossierMaquette, "img")).map((f) => `img/${f}`) : [];
  const inutilisees = presentes.filter((f) => !images.includes(f) && !f.endsWith(".DS_Store"));

  if (dryRun) {
    process.stdout.write(
      JSON.stringify(
        {
          dryRun: true,
          hub: adresseHub() || "(HUB_URL absent)",
          compte_id: compte.id,
          televersement: images,
          imagesNonEnvoyees: inutilisees,
          html: `${Buffer.byteLength(html)} octets`,
          analyse: { constats: analyse.constats.length, pagespeed },
        },
        null,
        2,
      ) + "\n",
    );
    return;
  }

  // ----- envoi -----
  if (images.length) {
    const t = await appelHub("POST", "/api/agent/maquettes/televersement", { compte_id: compte.id, fichiers: images });
    if (t.status !== 200) throw new ErreurSortie(1, messageRefus(t));
    for (const [i, nom] of images.entries()) {
      const { url } = t.json.televersements[i];
      let r;
      try {
        r = await fetch(url, {
          method: "PUT",
          headers: { "content-type": TYPES[extname(nom).toLowerCase()], "cache-control": "max-age=3600", "x-upsert": "true" },
          body: readFileSync(join(dossierMaquette, nom)),
          signal: AbortSignal.timeout(60000),
        });
      } catch (e) {
        throw new ErreurSortie(1, `Envoi de ${nom} impossible : ${e.cause?.code || e.cause?.message || e.message}`);
      }
      if (!r.ok) throw new ErreurSortie(1, `Envoi de ${nom} refusé (${r.status}) : ${(await r.text()).slice(0, 300)}`);
    }
  }

  const r = await appelHub("POST", "/api/agent/maquettes", { compte_id: compte.id, html, fichiers: images, analyse });
  if (r.status !== 200 && r.status !== 201) {
    const manquantes = r.json?.manquantes ? ` (absentes du bucket : ${r.json.manquantes.join(", ")})` : "";
    throw new ErreurSortie(1, messageRefus(r) + manquantes);
  }
  process.stdout.write(
    JSON.stringify(
      {
        code: r.status,
        cree: r.json?.cree ?? r.status === 201,
        fiche: `${adresseHub()}/comptes/${compte.id}`,
        images: images.length,
        imagesNonEnvoyees: inutilisees,
        pagespeed,
      },
      null,
      2,
    ) + "\n",
  );
}

lancer(principal);
