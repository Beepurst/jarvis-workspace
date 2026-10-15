// Contrôle de la zone de sécurité story : bande recouverte de 250 px et
// plancher de texte à 400 px, dessinés par-dessus la story rendue.
// Il vérifie, il ne corrige pas.
//   node _zones-story.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { zonesStory } from '../_lib/zones-story.mjs';

await zonesStory({ racine: dirname(fileURLToPath(import.meta.url)) });
