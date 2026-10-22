# Réglages des devis automatiques : à faire par Edgar

Dans l'ordre. Chaque étape dit quoi cliquer et comment vérifier que ça marche. Ne déploie pas le code (fusion de la branche `devis`) avant l'étape 1.

## 1. Le SQL, avant tout déploiement

1. Ouvre Supabase, projet du hub, **SQL Editor**, nouvelle requête.
2. Colle **tout** le contenu de `livrables/hub-agence-devis/supabase/devis.sql` (Claude te le recopie dans la conversation) et clique **Run**.
3. Le fichier est idempotent : tu peux le rejouer sans casse.
4. Vérifier : dans **Table Editor**, les tables `devis` et `reglages_devis` existent, et `reglages_devis` contient une ligne (id 1). Dans **Storage**, le bucket `devis` existe, privé.

Sans ça, le cron et la création de brouillon échouent après le déploiement.

## 2. Cal.com

1. **Event types**, créer un type « Appel découverte », lieu **Cal Video**.
2. Dans ce type, activer la **transcription**. Elle démarre quand tu rejoins l'appel et l'invité ne peut pas la couper (Cal Video ne transcrit que si la transcription est activée). Vérifier : à la fin d'un appel test, une transcription apparaît dans Cal.com.
3. **Settings > Developer > Webhooks** : ouvrir le webhook existant du hub et cocher aussi **MEETING_ENDED** (sans retirer les autres). Vérifier : la case est cochée après enregistrement.
4. **Settings > Developer > API keys** : créer une clé, la copier dans `.env.local` sous le nom `CALCOM_API_KEY` (étape 5).
5. Rappels : dans les **workflows** du type, un email à l'invité la veille et un 1 h avant, avec le lien de la visio.
6. Phrase dans la confirmation de rendez-vous : « L'appel est transcrit pour préparer votre devis. » Vérifier : réserver un créneau test et lire l'email de confirmation.

## 3. Google Cloud (projet `hub-agence-kleak`, compte kleakagency@gmail.com)

1. **APIs et services > Bibliothèque** : activer **Gmail API**.
2. **Écran de consentement OAuth** : type **Externe**, nom de l'application, email de support.
3. **Identifiants > Créer des identifiants > ID client OAuth**, type **Application Web**. URI de redirection autorisées :
   - `https://hub-agence-kleak.vercel.app/api/google/retour`
   - `http://localhost:3000/api/google/retour`
4. Copier l'ID client et le secret dans `.env.local` : `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`.
5. **Publier l'application en production** (écran de consentement > « Publier l'application »). En mode Test, le jeton de connexion expire au bout de 7 jours. En production non vérifiée, Google affiche un avertissement « application non vérifiée » mais ça fonctionne pour toi, le propriétaire : clique « Paramètres avancés » puis continuer.
6. Après le déploiement : **Réglages > Connexion Google > Connecter Gmail**. Vérifier : la carte affiche « Connecté » avec ton adresse.

## 4. Stripe

1. **Développeurs > Clés API > Créer une clé restreinte**, nom « Hub devis écriture ». Droits en **écriture** uniquement sur : Customers, Invoices, Invoice Items, Products, Prices, Subscriptions, Subscription Schedules (lecture là où Stripe l'impose). **Aucun** droit sur Refunds, Payouts, Transfers, ni le reste. Copier la clé dans `.env.local` sous `STRIPE_WRITE_KEY`.
2. Commencer en **mode test** : crée la clé dans le mode test de Stripe (clé `rk_test_...`). On passera à la clé live après la fusion, une fois la recette faite.
3. **Numérotation des factures** : Stripe numérote au niveau du compte. Dans le Dashboard : **Paramètres > Facturation > Factures** (https://dashboard.stripe.com/settings/billing/invoice), régler le **préfixe** de facture (1 à 12 majuscules ou chiffres) et le champ **Séquence de la prochaine facture** pour démarrer la nouvelle série à un numéro élevé. Le prochain numéro doit être supérieur à tout numéro déjà utilisé, maximum 1 000 000 000. Source : https://docs.stripe.com/invoicing/customize (section « Définir le numéro de la facture initial »). À faire dans le mode test, puis à refaire en mode live.
4. **Pied de facture** : dans les mêmes paramètres, remplir le pied de page avec les mentions : nom légal, mention EI, SIRET, « TVA non applicable, article 293 B du CGI », pénalités de retard et indemnité forfaitaire de recouvrement de 40 €.
5. Vérifier : la clé apparaît dans la liste avec les droits attendus.

## 5. Variables Vercel

Variables à poser en production : `STRIPE_WRITE_KEY`, `CALCOM_API_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`. Vérifier aussi que `GROQ_API_KEY` est déjà dans Vercel (elle existe dans `.env.local`).

Méthode : un script qui lit `.env.local` sans rien afficher et lance, pour chaque nom :
`vercel env add <NOM> production --value <valeur> --non-interactive`
Claude te l'écrit. Vérifier : `vercel env ls production` liste les noms. Redéployer ensuite pour que les variables soient prises en compte.

## 6. Réglages dans le hub

Page **Réglages > Devis** :

1. **Identité de l'émetteur** : nom légal, mention EI, adresse, SIRET, email, téléphone. Enregistrer.
2. **Numérotation** : préfixe et premier numéro. Modifiable seulement tant qu'aucun devis n'existe, et le numéro ne redescend jamais. Fais-le avant le premier devis.
3. **CGV** : coller le texte validé de `livrables/offre/cgv-prestation.md`, à partir de « Conditions générales de vente », sans la note de travail en tête.
4. Objet et message de l'email, relances (délais en jours et textes), message WhatsApp. Variables : `{prenom}`, `{entreprise}`, `{numero}`.
5. Vérifier : recharger la page, les valeurs sont conservées.

## 7. Recette à faire ensemble

Claude et toi, en mode test Stripe :

- Appel Cal Video de 5 minutes, en français. Vérifier : le résumé arrive sur la fiche du compte.
- Le devis est prérempli depuis le résumé.
- Le brouillon Gmail est créé. Dans Gmail, « Afficher l'original » : notre Message-ID est conservé et le nom d'expéditeur est le bon.
- Marquer le devis envoyé.
- Relance forcée : elle arrive dans le même fil chez le destinataire.
- Devis signé : téléverser un PDF quelconque.
- Stripe test, une fois (acompte) : facture créée et payable.
- Stripe test, 6 fois : le moyen de paiement est enregistré sur la première facture payée (envoi par lien), puis le cron passe en prélèvement automatique. Il y a exactement 6 factures, avec `cancel_at`, sans proratisation.
- Suivi avis : l'abonnement démarre après la 6e échéance.
- Facture non recouvrable : elle est annulée (void).
- Après la synchro Finance, le paiement apparaît dans la vente.
- Chronométrer « fin d'appel > brouillon prêt ». Cible : moins de 10 minutes en tout, moins de 5 pour toi.

Après la fusion : remplacer `STRIPE_WRITE_KEY` par la clé live et refaire l'étape 4.3 en mode live.
