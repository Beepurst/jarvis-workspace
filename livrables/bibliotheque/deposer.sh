#!/bin/bash
# Usage : deposer.sh <dossier> <champs.json> [--fiche <id>] [--dry-run]
# champs.json : { titre, url_source, type_section, secteur, tags, outil }. Fiche technique : <dossier>/fiche.txt.
# Sans --fiche : POST (creation). Avec : PATCH (retravailler). Note envoyee seulement en POST (si presente dans champs.json), jamais en PATCH; jamais d'origine.
# Sortie : { code, id, titre }. Le secret n'est jamais affiche.
set -u
RACINE="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$RACINE" || exit 1
D="${1:-}"; CH="${2:-}"; shift 2 2>/dev/null || { echo "Usage : deposer.sh <dossier> <champs.json> [--fiche <id>] [--dry-run]" >&2; exit 1; }
FICHE=""; DRY=0
while [ $# -gt 0 ]; do case "$1" in --fiche) FICHE="${2:-}"; shift 2;; --dry-run) DRY=1; shift;; *) shift;; esac; done
set -a; . ./.env; set +a
HUB_URL="${HUB_URL_ESSAI:-$HUB_URL}"
CAPTURE="$D/section/capture.jpg"
[ -f "$D/fiche.txt" ] || { echo "fiche.txt manquant dans $D" >&2; exit 1; }
MOTS=$(wc -w < "$D/fiche.txt" | tr -d ' '); [ "$MOTS" -le 400 ] || { echo "fiche.txt trop longue : $MOTS mots (400 au plus, titres compris), raccourcis avant de deposer" >&2; exit 4; }
[ -f "$CH" ] || { echo "$CH introuvable" >&2; exit 1; }
champ() { python3 -c 'import json,sys;v=json.load(open(sys.argv[1])).get(sys.argv[2]);print("" if v is None else (", ".join(v) if isinstance(v,list) else v))' "$CH" "$1"; }
ARGS=(-sS -o "$D/depot.json" -w "%{http_code}" -H "x-kleak-secret: $BIBLIO_AGENT_SECRET"
  --form-string "titre=$(champ titre)" --form-string "type_section=$(champ type_section)"
  --form-string "secteur=$(champ secteur)" --form-string "tags=$(champ tags)" --form-string "outil=$(champ outil)"
  -F "fiche_technique=<$D/fiche.txt")
if [ -n "$FICHE" ]; then METHODE=PATCH; CIBLE="$HUB_URL/api/agent/bibliotheque/$FICHE"
else METHODE=POST; CIBLE="$HUB_URL/api/agent/bibliotheque"; ARGS+=(--form-string "url_source=$(champ url_source)"); N="$(champ note)"; [ -n "$N" ] && ARGS+=(--form-string "note=$N"); fi
[ -f "$CAPTURE" ] && ARGS+=(-F "file=@$CAPTURE;type=image/jpeg")
if [ $DRY -eq 1 ]; then
  printf 'curl -X %s' "$METHODE"; for a in "${ARGS[@]}"; do case "$a" in "x-kleak-secret: "*) a="x-kleak-secret: ***";; esac; printf " %q" "$a"; done; printf ' %q\n' "$CIBLE"; exit 0
fi
CODE=$(curl "${ARGS[@]}" -X "$METHODE" "$CIBLE") || { echo "Hub injoignable" >&2; exit 1; }
python3 -c 'import json,sys
code=sys.argv[2]
try: d=json.load(open(sys.argv[1]))
except Exception: d={}
r=d.get("reference") or d
print(json.dumps({"code":int(code),"id":r.get("id") if isinstance(r,dict) else None,"titre":(r.get("titre") if isinstance(r,dict) else None) or d.get("error")},ensure_ascii=False))' "$D/depot.json" "$CODE"
