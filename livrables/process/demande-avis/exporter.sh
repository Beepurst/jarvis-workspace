#!/bin/sh
# Exporte une carte avis remplie : <nom>.pdf (A4, 4 cartes A6 à découper) et <nom>.png (une carte, pour WhatsApp ou email).
# Usage : sh livrables/process/demande-avis/exporter.sh livrables/clients/<client>/avis-<client>.html
set -e
[ -f "$1" ] || { echo "Usage : sh exporter.sh <fichier avis-*.html>"; exit 1; }

C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
F="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
B="${F%.html}"

"$C" --headless=new --virtual-time-budget=15000 --no-pdf-header-footer --print-to-pdf="$B.pdf" "file://$F" 2>/dev/null
# 105 x 148,5 mm à 96 ppp = 397 x 561 px, rendu en x3 pour rester net à l'impression
"$C" --headless=new --hide-scrollbars --window-size=397,561 --force-device-scale-factor=3 --virtual-time-budget=15000 --screenshot="$B.png" "file://$F?carte=1" 2>/dev/null

echo "$B.pdf"
echo "$B.png"
