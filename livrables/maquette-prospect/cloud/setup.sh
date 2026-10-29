#!/bin/bash
# Script d'installation de l'environnement cloud « Kleak maquettes » (tâche planifiée maquette-prospect).
# Tourne en root sur Ubuntu 24.04 avant chaque nouvelle session, résultat mis en cache par Anthropic.
# Installe Chromium et ses dépendances système pour Playwright, à la version de livrables/creas-meta.
npx -y playwright@1.61.1 install --with-deps chromium || true
