# Modèles Brevo du questionnaire client

Deux modèles d'email transactionnel à créer dans Brevo. Le Hub choisit le modèle et remplit trois paramètres, les textes vivent dans Brevo.

Paramètres disponibles dans les deux modèles :

- `{{ params.prenom }}` : prénom du client (peut être vide)
- `{{ params.lien }}` : lien personnel du questionnaire
- `{{ params.manquants }}` : liste de ce qui manque, **déjà en HTML** (`<ul><li>…</li></ul>`)

À vérifier dans Brevo : comme `params.manquants` contient du HTML, il faut qu'il soit inséré tel quel. Si l'envoi de test affiche les balises `<ul>` et `<li>` en clair, utiliser `{{ params.manquants | safe }}` à la place de `{{ params.manquants }}`. Les libellés sont déjà échappés côté Hub.

Prénom vide : l'objet et la formule d'appel ne doivent pas casser. Le corps ci-dessous commence par « Bonjour {{ params.prenom }}, » : si le prénom est vide, cela donne « Bonjour , ». Option propre dans Brevo : `Bonjour{% if params.prenom %} {{ params.prenom }}{% endif %},` (à tester, c'est la syntaxe Jinja de Brevo).

---

## Modèle 1 : « Lien du questionnaire »

Variable d'environnement : `BREVO_TEMPLATE_FORMULAIRE_LIEN` (numéro du modèle).

**Objet :** Votre questionnaire pour le site

**Corps :**

Bonjour {{ params.prenom }},

Voici le questionnaire pour votre site : {{ params.lien }}

Il faut une dizaine de minutes. Vous pouvez vous arrêter et le reprendre plus tard, vos réponses sont enregistrées au fur et à mesure. Vous pouvez aussi y déposer votre logo, vos photos et vos textes.

Ce qu'il me reste à recevoir de votre part :
{{ params.manquants }}

Si une question vous bloque, répondez simplement à cet email ou appelez-moi.

Edgar, Kleak

---

## Modèle 2 : « Relance questionnaire »

Variable d'environnement : `BREVO_TEMPLATE_FORMULAIRE_RELANCE` (numéro du modèle).

**Objet :** Votre questionnaire pour le site

**Corps :**

Bonjour {{ params.prenom }},

Je n'ai pas encore reçu tout ce qu'il me faut pour avancer sur votre site. Il manque :
{{ params.manquants }}

Vous pouvez reprendre là où vous vous êtes arrêté : {{ params.lien }}

Si c'est plus simple pour vous, répondez à cet email ou appelez-moi, on le fait ensemble en quelques minutes.

Edgar, Kleak

---

## Comment créer ces modèles dans Brevo

1. Brevo, Campagnes puis Modèles, onglet Transactionnel (ou Email transactionnel puis Modèles), « Nouveau modèle ».
2. Nom du modèle : « Lien du questionnaire » pour le premier, « Relance questionnaire » pour le second.
3. Expéditeur : le même que les modèles du CRM (le Hub envoie avec `BREVO_SENDER_EMAIL`, nom « Edgar de Kleak »).
4. Objet et corps : coller les textes ci-dessus. Un design très simple, texte seul, sans image ni gros bouton.
5. Insérer les trois paramètres exactement comme écrits (`{{ params.prenom }}`, `{{ params.lien }}`, `{{ params.manquants }}`).
6. Faire un envoi de test, avec des paramètres d'essai dont une liste HTML, et vérifier : le lien est cliquable, la liste s'affiche en puces (sinon passer à `| safe`), le prénom vide ne laisse pas « Bonjour , ».
7. Activer le modèle, puis noter son numéro (visible dans la liste des modèles et dans l'adresse de la page).
8. Poser les deux numéros dans Vercel (projet `hub-agence-kleak`) et dans `.env.local` :
   - `BREVO_TEMPLATE_FORMULAIRE_LIEN` = numéro de « Lien du questionnaire »
   - `BREVO_TEMPLATE_FORMULAIRE_RELANCE` = numéro de « Relance questionnaire »
9. Redéployer. Tant que ces deux variables et Brevo ne sont pas toutes configurées, le bouton email du Hub reste désactivé et aucune relance ne part.
