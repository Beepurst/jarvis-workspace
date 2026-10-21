#!/bin/bash
# Usage : preparer.sh <url> <texte-du-titre> [--fiche <id>]
# Prepare une fiche : doublons, capture d'Edgar (--fiche), reperage, capture de la section.
# Sortie : un JSON compact sur stdout. Le secret n'est jamais affiche.
set -u
RACINE="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$RACINE" || exit 1
URL="${1:-}"; TITRE="${2:-}"; FICHE=""
[ "${3:-}" = "--fiche" ] && FICHE="${4:-}"
[ -z "$URL" ] && { echo "Usage : preparer.sh <url> <texte-du-titre> [--fiche <id>]" >&2; exit 1; }
set -a; . ./.env; set +a
HUB_URL="${HUB_URL_ESSAI:-$HUB_URL}"
D="/tmp/kleak-biblio/$(date +%Y-%m-%d-%H%M%S)"
mkdir -p "$D"

CODE=$(curl -sS -G -o "$D/doublons.json" -w "%{http_code}" -H "x-kleak-secret: $BIBLIO_AGENT_SECRET" --data-urlencode "url=$URL" "$HUB_URL/api/agent/bibliotheque") || { echo "Hub injoignable" >&2; exit 1; }
if [ "$CODE" != "200" ]; then echo "Hub : code $CODE sur la verification des doublons" >&2; exit 1; fi

if [ -n "$FICHE" ]; then
  CAP=$(python3 -c 'import json,sys
d=json.load(open(sys.argv[1])); f=[x for x in d.get("fiches",[]) if str(x.get("id"))==sys.argv[2]]
print((f[0].get("capture_url") or "") if f else "")' "$D/doublons.json" "$FICHE")
  if [ -n "$CAP" ]; then
    if curl -sSf -o "$D/edgar.img" "$CAP" 2>/dev/null; then
      sips -Z 800 -s format jpeg "$D/edgar.img" --out "$D/capture-edgar.jpg" >/dev/null 2>&1 || rm -f "$D/capture-edgar.jpg"
    fi
  fi
fi

LISTER=false; N=""; PT=""; AUTRES="[]"; OUTIL=""; ANIM=""
SORTIE=$(node livrables/bibliotheque/capturer.mjs "$URL" --titre "$TITRE" 2>"$D/err.txt"); RC=$?
if [ $RC -eq 0 ]; then
  N=$(printf '%s' "$SORTIE" | python3 -c 'import json,sys;print(json.load(sys.stdin)["n"])')
  PT=$(printf '%s' "$SORTIE" | python3 -c 'import json,sys;print(json.dumps(json.load(sys.stdin).get("premierTitre")))')
  AUTRES=$(printf '%s' "$SORTIE" | python3 -c 'import json,sys;print(json.dumps(json.load(sys.stdin).get("autres",[])))')
  SEC=$(node livrables/bibliotheque/capturer.mjs "$URL" --section "$N" --sortie "$D/section" 2>"$D/err.txt"); RC=$?
  if [ $RC -eq 0 ]; then OUTIL=$(printf '%s' "$SEC" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("outil") or "")')
    ANIM=$(printf '%s' "$SEC" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("animation") or "")')
  else echo "capturer --section code $RC : $(head -c 300 "$D/err.txt" | tr '\n' ' ')" >&2; exit $RC; fi
elif [ $RC -eq 2 ]; then
  LISTER=true; PT="null"
  node livrables/bibliotheque/capturer.mjs "$URL" --lister --sortie "$D" >"$D/lister.json" 2>"$D/err.txt" || { echo "capturer --lister code $? : $(head -c 300 "$D/err.txt" | tr '\n' ' ')" >&2; exit 1; }
else
  echo "capturer --titre code $RC : $(head -c 300 "$D/err.txt" | tr '\n' ' ')" >&2; exit $RC
fi

python3 - "$D" "$HUB_URL" "$FICHE" "$LISTER" "$N" "$PT" "$AUTRES" "$OUTIL" "$ANIM" <<'PY'
import json, os, sys
d, hub, fiche, lister, n, pt, autres, outil, anim = sys.argv[1:10]
dbl = json.load(open(d + "/doublons.json")).get("fiches", [])
cut = lambda x: {"id": x.get("id"), "titre": x.get("titre"), "type_section": x.get("type_section")}
f = None
if fiche:
    m = [x for x in dbl if str(x.get("id")) == fiche]
    f = cut(m[0]) if m else {"id": fiche, "titre": None, "type_section": None}
    ce = d + "/capture-edgar.jpg"
    f["captureEdgar"] = ce if os.path.exists(ce) else None
lister = lister == "true"
sec = None if lister else {"n": int(n), "premierTitre": json.loads(pt), "autres": json.loads(autres), "outil": outil}
s = d + "/section/"
fich = {k: (s + v if os.path.exists(s + v) else None) for k, v in
        [("vignette", "vignette.jpg"), ("vignetteMobile", "vignette-mobile.jpg"), ("resume", "resume.json"), ("capture", "capture.jpg")]}
# animation.jpg : seulement si ce passage de capturer.mjs l'a produit (champ "animation" de sa sortie)
fich["animation"] = anim if anim and os.path.exists(anim) else None
if lister:
    fich = {"apercu": d + "/apercu.jpg", "lister": d + "/lister.json"}
print(json.dumps({"dossier": d, "codeHub": 200, "doublons": [cut(x) for x in dbl], "fiche": f, "section": sec, "lister": lister, "fichiers": fich}, ensure_ascii=False, separators=(",", ":")))
PY
