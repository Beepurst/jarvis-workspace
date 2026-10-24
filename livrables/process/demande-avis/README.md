# Kit de demande d'avis

Remis **sans frais à chaque livraison**, toutes formules (fiche offre, « Suivi avis »). C'est aussi la base du Suivi avis à 190 €/mois : le même kit, plus le rappel mensuel, les réponses aux avis et le bilan.

Le client reçoit trois choses :

1. les messages prêts à envoyer (SMS ou WhatsApp, email, relance), adaptés à son métier ;
2. une planche A4 de 4 cartes A6 avec son QR code, à imprimer et découper (comptoir, camion, facture, fin de chantier) ;
3. la même carte en image, à glisser dans un WhatsApp ou une signature d'email.

Temps prévu : environ 20 minutes par client avec ce kit (la note interne comptait 1 h sans).

## Fichiers

- `messages.md` : les messages types et ce qu'on n'écrit jamais (règles Google).
- `modele-qr.html` : le modèle de carte. Ne pas le remplir directement.
- `exporter.sh` : produit le PDF A4 et le PNG d'une carte.
- `exemple-garnier.*` : exemple rempli sur le client test Garnier, **lien fictif**, ne pas l'envoyer.

## Pour un client

### 1. Récupérer le lien d'avis Google

Le client doit avoir une fiche Google (Google Business Profile) **validée**. Sans fiche, pas de lien : la créer d'abord (c'est inclus dans Essentiel et Pro, pas dans le one page).

Depuis le compte qui gère la fiche (le client, ou Kleak avec l'accès gestionnaire) :

- chercher le nom de l'entreprise dans Google en étant connecté, ou ouvrir business.google.com ;
- cliquer sur **« Demander des avis »** (ou « Recevoir plus d'avis ») ;
- copier le lien, de la forme `https://g.page/r/XXXXXXXX/review`.

Repli si on n'a pas encore l'accès : trouver l'identifiant du lieu (« Place ID ») avec l'outil Place ID Finder de Google, puis utiliser `https://search.google.com/local/writereview?placeid=<identifiant>`. Le lien `g.page` est plus court, donc un QR code plus simple : le préférer dès qu'on a l'accès.

**Tester le lien** sur un téléphone, hors connexion au compte de l'entreprise : il doit ouvrir directement la fenêtre de notation.

### 2. Adapter les messages

Copier `messages.md` en `livrables/clients/<client>/avis-messages.md`, remplacer les variables, choisir vouvoiement ou tutoiement, « je » ou « nous », et le mot juste pour la prestation. Retirer ce qui ne sert pas (version courte, email si le client n'a que des numéros). Garder la section « Ce qu'on n'écrit jamais » : le client doit la lire.

### 3. Faire la carte QR

```sh
cp livrables/process/demande-avis/modele-qr.html livrables/clients/<client>/avis-<client>.html
# remplir uniquement l'objet AVIS : entreprise, lien, lienAffiche, couleurs et police du site du client, logo si fichier propre
sh livrables/process/demande-avis/exporter.sh livrables/clients/<client>/avis-<client>.html
```

- Couleurs : celles de la planche de direction. Le code se dessine avec la couleur `sombre` : elle doit rester **foncée** (contraste fort sur le blanc), sinon les téléphones le lisent mal.
- Logo : seulement s'il existe en SVG ou PNG à fond transparent, sinon le nom en texte suffit.
- `lienAffiche` : le lien sans `https://`, pour qui ne peut pas scanner.

### 4. Vérifier avant d'envoyer

- [ ] Ouvrir le PNG et le PDF : rien ne déborde, nom de l'entreprise bien écrit.
- [ ] **Scanner le QR avec un vrai téléphone**, sur l'écran puis sur une feuille imprimée : il ouvre la fenêtre d'avis de la bonne fiche.
- [ ] Vérification automatique possible du contenu du code (macOS) : `swift` avec le détecteur QR de CoreImage, comme fait le 23/10 sur l'exemple.

### 5. Remettre au client

Avec le site, dans le message de livraison : le PDF, le PNG et les messages adaptés, avec une consigne simple :

> Demandez un avis à **chaque** client, le jour même ou le lendemain. Un message, une relance au bout d'une semaine si rien n'est venu, pas plus. Pas de cadeau ni de remise en échange.

## Dans le Suivi avis

- Le kit est le même. S'y ajoute le **rappel mensuel** au client (« pensez à demander un avis à vos clients du mois »), envoyé avec le bilan mensuel (`livrables/process/bilan-avis/`).
- Chaque nouvel avis reçoit une réponse rédigée par l'IA et validée par Edgar.

## Règles (Google et fiche offre)

- On demande à **tous** les clients, sans trier les contents (pas de « si vous êtes satisfait »).
- Aucune contrepartie : ni remise, ni cadeau, ni tirage au sort.
- On ne suggère pas de note, on n'écrit jamais d'avis à la place de quelqu'un, et Kleak n'en dépose jamais.
- Sur le site, pas de note d'avis auto-déclarée dans les données structurées (checklist qualité, section 10).
- Les étoiles de la carte sont décoratives : pas de logo Google, la carte ne doit pas se faire passer pour un document de Google.
