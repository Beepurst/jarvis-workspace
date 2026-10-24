#!/bin/sh
# Exporte un bilan rempli : <nom>.pdf (A4, une page) et <nom>.png (aperçu, pour WhatsApp).
# Usage : sh livrables/process/bilan-avis/exporter.sh livrables/clients/<client>/bilan-<client>-<aaaa-mm>.html
set -e
[ -f "$1" ] || { echo "Usage : sh exporter.sh <fichier bilan-*.html>"; exit 1; }

C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
F="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
B="${F%.html}"

"$C" --headless=new --virtual-time-budget=15000 --no-pdf-header-footer --print-to-pdf="$B.pdf" "file://$F" 2>/dev/null
# 210 x 297 mm à 96 ppp = 794 x 1123 px, rendu en x2
"$C" --headless=new --hide-scrollbars --window-size=794,1123 --force-device-scale-factor=2 --virtual-time-budget=15000 --screenshot="$B.png" "file://$F" 2>/dev/null

echo "$B.pdf"
echo "$B.png"
