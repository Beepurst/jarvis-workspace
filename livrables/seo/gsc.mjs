// Lecture seule de Search Console pour kleakagency.fr, utilisée par l'agent redacteur-seo.
// Réutilise le compte de service du Hub Agence (hub-ga4@…, droit « Restreint » sur la propriété).
//
// Usage, depuis la racine du workspace :
//   node --env-file=livrables/hub-agence/.env.local livrables/seo/gsc.mjs [jours] [requete|page|requete-page]
// Exemple : node --env-file=livrables/hub-agence/.env.local livrables/seo/gsc.mjs 28 requete
//
// Affiche les totaux de la période, ceux de la période précédente de même durée, puis le
// détail (clics, impressions, CTR, position). Les données Search Console ont environ 3 jours
// de retard : la période s'arrête 3 jours avant aujourd'hui. Aucun secret n'est affiché.

import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const RETARD_JOURS = 3;
const DIMENSIONS = { requete: ["query"], page: ["page"], "requete-page": ["query", "page"] };

const jours = Number(process.argv[2] ?? 28);
const vue = process.argv[3] ?? "requete";
if (!Number.isInteger(jours) || jours < 1 || !DIMENSIONS[vue]) {
  console.error("Usage : gsc.mjs [jours] [requete|page|requete-page]");
  process.exit(1);
}

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
const site = process.env.GSC_SITE_URL;
if (!email || !privateKey || !site) {
  console.error("Variables manquantes : lancer avec --env-file=livrables/hub-agence/.env.local");
  process.exit(1);
}

const b64 = (s) => Buffer.from(s).toString("base64url");

async function jeton() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(
    JSON.stringify({ iss: email, scope: SCOPE, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }),
  )}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(privateKey).toString("base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`Jeton Google refusé (${res.status})`);
  return (await res.json()).access_token;
}

const iso = (d) => d.toISOString().slice(0, 10);
const decale = (d, n) => new Date(d.getTime() + n * 86400000);

async function requete(token, debut, fin, dimensions) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: iso(debut), endDate: iso(fin), dimensions, rowLimit: 250 }),
    },
  );
  if (!res.ok) throw new Error(`Search Console a répondu ${res.status} : ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).rows ?? [];
}

const fmt = (r) =>
  `clics ${r.clicks} | impr ${r.impressions} | CTR ${(r.ctr * 100).toFixed(1)} % | pos ${r.position.toFixed(1)}`;

const token = await jeton();
const fin = decale(new Date(), -RETARD_JOURS);
const debut = decale(fin, -(jours - 1));
const finAvant = decale(debut, -1);
const debutAvant = decale(finAvant, -(jours - 1));

const [total] = await requete(token, debut, fin, []);
const [totalAvant] = await requete(token, debutAvant, finAvant, []);
console.log(`Propriété ${site}`);
console.log(`Période ${iso(debut)} → ${iso(fin)} : ${total ? fmt(total) : "aucune donnée"}`);
console.log(`Période précédente ${iso(debutAvant)} → ${iso(finAvant)} : ${totalAvant ? fmt(totalAvant) : "aucune donnée"}`);
console.log(`\nDétail par ${vue}, trié par impressions :`);
const lignes = await requete(token, debut, fin, DIMENSIONS[vue]);
lignes.sort((a, b) => b.impressions - a.impressions);
for (const l of lignes) console.log(`${l.keys.join(" | ")} | ${fmt(l)}`);
if (!lignes.length) console.log("aucune ligne");
