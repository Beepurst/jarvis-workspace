// Contrôle de lisibilité à 420 px, la largeur réelle d'un post Instagram.
// Un texte qui ne se lit pas sur cette planche ne se lira jamais en diffusion.
//   node _feed.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { plancheFeed } from '../_lib/feed.mjs';

await plancheFeed({
  racine: dirname(fileURLToPath(import.meta.url)),
  dossiers: ['créatives ads/post', 'créatives ads/story'],
});
