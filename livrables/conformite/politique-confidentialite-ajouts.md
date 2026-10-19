# Politique de confidentialité de kleakagency.fr : ajouts du 19/10/2026

> À coller dans la page Framer `politique-de-confidentialite`, à l'endroit indiqué pour
> chaque section. Le reste de la page ne change pas. À faire avant de publier le
> formulaire instantané Meta, qui renvoie vers cette page.

---

## En haut de la page

Remplacer la date par :

```
Dernière mise à jour : 19 octobre 2026
```

## Section 3. Données collectées, ajouter à la liste

```
Informations sur votre projet : nom de votre entreprise, existence d'un site actuel, budget envisagé, et vos préférences de contact (accord pour être contacté par WhatsApp).
```

## Section 4. Méthodes de collecte, ajouter à la liste

```
Formulaires publicitaires : lorsque vous remplissez un formulaire de demande sur Facebook ou Instagram, à la suite d'une de nos publicités.
Prise de rendez-vous : lorsque vous réservez un appel avec nous.
```

## Section 5. Finalités du traitement, ajouter à la liste

```
Suivi de votre demande : vous envoyer un lien pour réserver un appel, vous rappeler votre rendez-vous, et vous relancer par email si vous n'avez pas encore réservé. Chaque email contient un lien pour ne plus en recevoir.
Contact par WhatsApp : uniquement si vous l'avez accepté dans le formulaire. Vous pouvez répondre STOP à tout moment pour ne plus être contacté par ce moyen.
Préparation d'un devis : comprendre votre projet avant notre échange.
```

## Section 6. Base légale, ajouter à la liste

```
Mesures précontractuelles : lorsque vous nous demandez d'être recontacté au sujet de la création de votre site, le traitement de votre demande et les relances par email reposent sur les mesures prises à votre demande avant la conclusion d'un contrat.
```

## Section 7. Partage des données, remplacer la ligne « Prestataires de services » par

```
Prestataires de services, qui traitent vos données pour notre compte et selon nos instructions :
Meta Platforms Ireland (Facebook, Instagram, WhatsApp) : formulaires de demande publicitaires et, si vous l'avez accepté, messages WhatsApp.
Google (Google Sheets) : réception des réponses aux formulaires.
Brevo (France) : envoi des emails.
Cal.com : réservation des rendez-vous.
Supabase et Vercel : hébergement de notre outil interne de suivi des demandes.
Framer : hébergement du site.
Google Analytics : mesure d'audience, avec votre accord.
Certains de ces prestataires peuvent traiter des données hors de l'Union européenne. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne ou par le cadre de protection des données UE / États-Unis.
```

---

## À vérifier avant de publier

- **La page contient deux versions du texte** (sans doute une par taille d'écran dans
  Framer). La seconde n'est pas à jour : nom « Kleak Agency » au lieu de « BLOMME EDGAR »,
  adresse restée à « [Adresse de l'entreprise] » et un autre numéro de téléphone
  (06 16 34 04 05 au lieu de 06 95 11 58 14). Aligner les deux versions, avec ces ajouts.
- **La région de la base Supabase** du hub (Europe ou États-Unis), pour savoir si la phrase
  sur les transferts hors UE la concerne.
- **Le pixel Meta et Google Analytics** se chargent dès l'ouverture de la page, avant tout
  choix dans le bandeau cookies. Sans consentement préalable, c'est le point le plus souvent
  relevé par la CNIL. À régler dans Framer (chargement conditionné au bandeau).
