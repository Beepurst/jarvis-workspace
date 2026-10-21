# Planche de direction

Une page envoyée au client **après le questionnaire de cadrage et avant toute construction**. Elle fige la direction (intention, couleurs, polices, photos, accroche, structure) pour tenir 2 ou 3 allers-retours maximum.

## Fichiers

- `modele.html` : le modèle. Ne pas le remplir directement.
- `exemple-atelier-hauteville.html`, `.pdf` et `.png` : exemple rempli avec la démo V2.

## Pour un nouveau client

0. Demander des inspirations au bibliothécaire (« trouve des inspirations pour <client> ») : il pose `inspirations.jpg` dans `livrables/clients/<client>/`, 4 ou 5 démos du Framer Marketplace du même secteur. Les sections retenues vont dans la bibliothèque, puis s'épinglent au brief.
1. Copier `modele.html` en `planche-<client>.html`, dans `livrables/clients/<client>/`.
2. Remplir uniquement l'objet `PLANCHE` en haut du fichier, à partir des réponses au questionnaire (`livrables/process/questionnaire-cadrage.md`) :
   - `mots`, `luminosite` : réponses `mots` et `luminosite`
   - `couleurs` : charte du client, palette choisie (`palette-*`) ou proposition de l'agence ; 4 ou 5 couleurs avec leur rôle
   - `polices` : style choisi (`polices-*`), traduit en une police de titre et une de texte disponibles dans Framer et Google Fonts
   - `photos` : 4 ou 5 photos (celles du client en priorité, sinon libres de droits), chacune vérifiée par rapport à sa légende
   - `sections` : la structure de la page d'accueil, dans l'ordre ; `pages` selon la formule
   - `animations` : toujours discrètes, la performance passe avant (checklist qualité, section 9)
3. Exporter (Chrome installé sur le Mac) :

```sh
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$C" --headless=new --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=15000 --screenshot=planche.png "file://$PWD/planche-<client>.html"
"$C" --headless=new --virtual-time-budget=15000 --no-pdf-header-footer --print-to-pdf=planche.pdf "file://$PWD/planche-<client>.html"
```

4. Relire l'image : pas de texte qui déborde, photos cohérentes entre elles, polices bien chargées.
5. Envoyer le PDF au client avec une seule demande : valider ou corriger, en un message.

## Règles

- Une seule page. Si ça déborde, c'est qu'il y a trop d'éléments : couper.
- Rien d’inventé : pas de chiffres ni d’avis non fournis par le client.
- La planche validée devient la référence : toute demande qui la contredit après construction compte comme une série de retouches.
