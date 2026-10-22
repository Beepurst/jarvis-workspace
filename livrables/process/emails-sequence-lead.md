# Séquence email des leads Meta (Brevo)

> Validé le 22/10/2026 : signature « Edgar de Kleak », réponses sur `contact@kleakagency.fr`, prix gardé en J+3.
> Le hub choisit le modèle et l'heure, les textes vivent dans Brevo (modifiables sans code).

## Fonctionnement côté hub

- **Invitation** : envoyée dès que le lead arrive dans le hub, à toute heure.
- **Relances** : J+1, J+3 et J+7 après l'invitation, dans les créneaux d'envoi du hub.
- **Arrêt** : la séquence s'arrête dès que le lead réserve, se désinscrit, signale un spam ou si l'adresse est rejetée. Elle ne s'arrête **pas** sur une réponse par mail (le hub ne lit aucune boîte) : si un lead répond, passe-le à la main hors de « Nouveau lead » dans le CRM.
- **Variables disponibles** dans les modèles Brevo : `{{ params.prenom }}`, `{{ params.entreprise }}` (peut être vide), `{{ params.lien_rdv }}` (lien Cal.com prérempli, canal email), `{{ params.lien_desinscription }}`.

## Pied de page commun (les 4 modèles)

```
Kleak Agency, création de sites internet. contact@kleakagency.fr
Vous ne voulez plus recevoir ces messages ? Se désinscrire ({{ params.lien_desinscription }})
```

## 0. Invitation (immédiate)

**Objet :** Votre demande de site internet

Bonjour {{ params.prenom }},

Merci pour votre demande.

Le plus simple pour en parler, c'est un appel de 30 minutes en visio. On regarde votre activité, ce que vous attendez du site, et je vous dis quelle formule vous correspond et à quel prix.

Vous choisissez le créneau ici : **[Réserver un appel]({{ params.lien_rdv }})**

Bonne journée,
Edgar de Kleak

## 1. Relance J+1

**Objet :** Re: Votre demande de site internet

Bonjour {{ params.prenom }},

Je reviens vers vous suite à votre demande d'hier.

Si vous voulez avancer sur votre site, vous pouvez réserver un appel de 30 minutes ici : **[Réserver un appel]({{ params.lien_rdv }})**

Si vous avez d'abord une question sur le prix ou les délais, répondez simplement à ce mail.

Edgar de Kleak

## 2. Relance J+3

**Objet :** Prix et délais de votre site

Bonjour {{ params.prenom }},

Pour vous donner une idée : un site d'une page coûte 699 € et il est en ligne en 5 jours. Le paiement en 6 fois sans frais est possible.

Pour un site plus complet, on en parle pendant l'appel : **[Réserver un appel]({{ params.lien_rdv }})**

Edgar de Kleak

## 3. Relance J+7 (dernière)

**Objet :** Dernier message de ma part

Bonjour {{ params.prenom }},

Je ne vais pas vous relancer davantage.

Si le projet revient plus tard, le lien reste valable : **[Réserver un appel]({{ params.lien_rdv }})**. Vous pouvez aussi répondre à ce mail.

Bonne continuation,
Edgar de Kleak

## Mise en place dans Brevo

1. **Domaine** : Paramètres, Expéditeurs, domaines et IP dédiées, Domaines. `kleakagency.fr` doit être « Authentifié ». Les DNS sont déjà posés chez IONOS (code Brevo, DKIM `brevo1` et `brevo2`, DMARC `p=none`), vérifiés le 22/10.
2. **Expéditeur** : créer `contact@kleakagency.fr`, nom « Edgar de Kleak ».
3. **Clé API** : SMTP et API, Clés API, créer une clé « hub-agence ».
4. **Modèles** : Transactionnel, Modèles, un modèle par email ci-dessus. Noter l'identifiant (#) de chacun.
5. **Webhook** : Transactionnel, Paramètres, Webhooks. URL `https://hub-agence-kleak.vercel.app/api/webhooks/brevo?jeton=<BREVO_WEBHOOK_TOKEN du .env.local>`. Événements : délivré, ouvert, premier ouvert, cliqué, hard bounce, soft bounce, bloqué, email invalide, erreur, spam, désinscrit.
6. **Variables** à ajouter dans `.env.local` puis Vercel : `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_REPLY_TO`, `BREVO_TEMPLATE_INVITATION`, `BREVO_TEMPLATE_RELANCE_1`, `BREVO_TEMPLATE_RELANCE_2`, `BREVO_TEMPLATE_RELANCE_3`. Puis redéployer la production et faire un lead de test.
