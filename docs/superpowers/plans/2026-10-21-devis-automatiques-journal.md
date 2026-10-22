# SDD ledger — plan: /Users/ed/Desktop/jarvis-kleak/docs/superpowers/plans/2026-10-21-devis-automatiques.md

Spec: /Users/ed/Desktop/jarvis-kleak/docs/superpowers/specs/2026-10-21-devis-automatiques-design.md
Repo: livrables/hub-agence-devis (branche devis, base f3648cd). Baseline : 633 tests, 1 échec préexistant (`lireDimensions : PNG réel du workspace`, créa supprimée le 21/10, hors sujet).

## Preflight scan

| Tâches | Produit / consommé | Constat |
|---|---|---|
| 1 ↔ 11 | `Devis` (T1) / `peutRelancer` lit `relancesCoupees` (T11) ; SQL a `relances_coupees` | Champ absent de l'interface `Devis` → Ruling 1 |
| 1 (SQL) | `ventes.devis_id references devis(id)` | Doit être créé après la table `devis` → Ruling 2 |
| 2 ↔ 8 | `EntreeVente` (Omit<Vente,"id"\|"statut">) avec `maintenanceMois: null`, `maintenanceArreteeLe` / `venteDepuisDevis` | Cohérent ; `devis_id` géré par T8 dans ventes/db |
| 2 ↔ rapprochement/synthese | `echeancier(v, jusquAu)` | Tous les appelants changent dans T2 : cohérent |
| 3 ↔ 5, 6, 8, 10 | `lignesDevis`, `totalCentimes`, `echeancierDevis`, `maintenanceCentimes`, `validerEntreeDevis` | Cohérent |
| 5 | Test : texte extrait du PDF | Avec @react-pdf les glyphes sont encodés, recherche de texte fragile → Ruling 3 |
| 5 | CGV écrites dans le dépôt workspace | Autre dépôt → Ruling 4 |
| 6 ↔ 8 | `transitionDevis` : `signer` seulement depuis `envoye`/`en_discussion` | Devis signé reçu alors qu'Edgar n'a pas cliqué « Marquer envoyé » → bloqué → Ruling 5 |
| 6 ↔ 7 | brouillon → `changerStatut(id,"preparer")` | Cohérent |
| 6 ↔ 11 | action `envoyer` de la route T6 enrichie par T11 | Cohérent (séquentiel) |
| 7 ↔ 11 | `construireMessage`, `envoyer(raw, threadId)` | Cohérent ; threading destinataire vérifié en T11 |
| 7, 8, 9, 11, 12 | Vérifications réelles (Google, Stripe test, Cal.com, cron) | Dépendent de réglages d'Edgar → Ruling 6 |
| 9 ↔ crm | `MEETING_ENDED` → `rdv_termine` dans `appliquerEvenement` | Ne doit pas changer l'étape ; forme du payload MEETING_ENDED à vérifier |
| 9 ↔ 11 | cron `/api/cron/relances` modifié par les deux | Séquentiel, cohérent |
| 10 ↔ 6 | `preremplir` → éditeur | Cohérent |
| Toutes | Test préexistant en échec | → Ruling 7 |
| Chaque tâche (cohérence interne) | tests ↔ code ↔ fichiers | T1–T4, T6–T12 cohérentes en elles-mêmes ; T5 voir Ruling 3 |

## Rulings
- Ruling 1: ajouter `relancesCoupees: boolean` à l'interface `Devis` (T1) — le SQL et T11 l'utilisent — coût si faux : nul.
- Ruling 2: dans `supabase/devis.sql`, créer `devis` avant d'ajouter `ventes.devis_id` — sinon le SQL échoue — coût : nul.
- Ruling 3: T5 sépare `contenuDevis(d, r)` (pur, renvoie les blocs de texte du PDF) testé sur les mentions, et `genererPdfDevis` testé seulement sur le préfixe `%PDF-` et une taille non nulle — l'extraction de texte d'un PDF react-pdf est fragile — coût si faux : un test moins direct sur le rendu final.
- Ruling 4: T5 écrit `livrables/offre/cgv-prestation.md` dans le workspace mais ne commite pas ce dépôt ; Claude (contrôleur) le présentera à Edgar — on ne commite jamais le workspace depuis un sous-agent — coût : nul.
- Ruling 5: `transitionDevis` accepte aussi `prepare → signer` — un client peut renvoyer le devis signé avant qu'Edgar ait cliqué « Marquer envoyé » — coût si faux : un devis signé sans date d'envoi enregistrée.
- Ruling 6: les vérifications réelles qui demandent des réglages d'Edgar (OAuth Google, clé Stripe de test, clé Cal.com, webhook) ne bloquent pas les tâches : code + tests unitaires + faux en mémoire ; vérifications réelles regroupées dans la recette T12 avec Edgar — les sous-agents n'ont pas ces accès — coût : bugs d'intégration découverts plus tard, en recette.
- Ruling 7: les implémenteurs ignorent l'échec préexistant `lireDimensions : PNG réel du workspace` et le signalent seulement s'il change — hors périmètre — coût : nul.
Task 1: dispatched (base f3648cd, implementer a44a0b56e586c2310, sonnet)
Task 1: minor (deferred): devis.vente_id sans clé étrangère (référence circulaire avec ventes.devis_id), pas de commentaire le disant
Task 1: minor (deferred): updated_at sans trigger (comme ventes)
Task 1: complete (commits f3648cd..80a7b97, review clean)
Task 2: dispatched (base 80a7b97)
Task 2: minor (deferred): « reste à encaisser » inclut 6 mois de maintenance projetée pour les ventes sans fin (bouge avec l'horizon)
Task 2: minor (deferred): date d'arrêt de maintenance inclusive (échéance le jour même facturée), égalité non testée
Task 2: minor (deferred): validation accepte maintenanceArreteeLe sans maintenance
Task 2: complete (commits 80a7b97..54a1760, review clean)
Task 3: dispatched (base 54a1760)
Ruling 8: sur_mesure → maintenance 9 000 c, délai 10 jours ouvrés, 2 séries de retouches (comme Pro) — la spec ne fixe rien pour le sur mesure — coût si faux : texte du devis à corriger à la main
Task 3: minor (deferred): entierPositif accepte des entiers non sûrs (1e21), pas de plafond
Task 3: minor (deferred): email client seulement non vide, pas de contrôle de format
Task 3: minor (deferred): options dédoublonnées (deux pages supplémentaires via lignes libres seulement)
Task 3: minor (deferred): règle du reste en 6 fois dupliquée entre calcul.ts et echeancier.ts
Task 3: fix round 1/5 dispatched (findings: total > 0 ; sur_mesure dans DELAI/RETOUCHES ; petites modifications 15/30 min ; FIX_BASE a7c8236)
Task 3: fix round 1/5 (3 addressed, 0 open; commits a7c8236..824b849)
Task 3: complete (commits 54a1760..824b849, review clean)
Task 4: dispatched (base 824b849)
Task 4: minor (deferred): 429/5xx/timeout de l'API confondus en un 502 ; l'éditeur (T6) doit temporiser la recherche (debounce)
Task 4: minor (deferred): l'adresse est celle du siège, pas forcément de l'établissement (afficher la ville dans l'UI)
Task 4: fix round 1/5 dispatched (findings: actif pour établissements fermés ; nom_raison_sociale d'abord ; q plafonné ; FIX_BASE c11a038)
Task 4: fix round 1/5 (3 addressed, 0 open; commits c11a038..115efdc)
Task 4: minor (deferred): q coupé en unités UTF-16 (peut couper un emoji) ; route sans test
Task 4: complete (commits 824b849..115efdc, review clean)
Task 5: dispatched (base 115efdc)
Ruling 9: T5 livre contenu.ts (pur) + pdf.ts écrit avec createElement au lieu de pdf.tsx — le lanceur de tests node ne charge pas .tsx — coût si faux : nul (interfaces identiques)
Task 5: minor (deferred): Font.registerHyphenationCallback global ; apercu-devis.ts chemin CGV en dur ; génération PDF à confirmer sur la première préproduction Vercel (fichiers de polices de pdfkit tracés)
Task 5: fix round 1/5 dispatched (findings: maintenance obligatoire en 6 fois sur devis + CGV §8 ; « premier paiement » ; conditions construites sans startsWith ; FIX_BASE e0db4a5)
Ruling 10: le Suivi avis (190 €/mois, décidé par Edgar le 22/10 dans une autre session, fiche offre et note interne mises à jour, absent de la spec du 21/10) entre dans ce chantier comme tâche 5b avant le devis en base : choix « maintenance » ou « Suivi avis » sur le devis, montant sur la vente, en 6 fois maintenance pendant les versements puis Suivi avis le mois suivant le dernier versement — un devis qui ne sait pas vendre le Suivi avis serait faux dès le premier RDV, et changer les types maintenant coûte moins qu'après T6/T8 — coût si faux : une tâche de plus à défaire.
Ruling 10 (suite): tâches 6, 8, 10 et 11 doivent utiliser EntreeDevis.suivi (et non maintenance) ; T8 planFacture('maintenance') doit gérer le Suivi avis et, en 6 fois, la bascule maintenance → Suivi avis après le 6e versement ; T10 preremplir doit lire le Suivi avis s'il est évoqué ; le prompt du résumé (T9) liste le Suivi avis parmi les options
Task 5: fix round 1/5 (2 addressed, 1 open — ligne conditions 6 fois non qualifiée ; commits e0db4a5..b16063d) ; round 2 dispatched (FIX_BASE b16063d)
Task 5: fix round 2/5 (1 addressed, 0 open; commits b16063d..a39598a)
Task 5: complete (commits 115efdc..a39598a, review clean)
Task 5b: dispatched (base a39598a)
Ruling 10 (T8): venteDepuisDevis : une fois + Suivi avis → maintenanceCentimes null, suiviAvisCentimes 19 000 ; 6 fois + Suivi avis → maintenance de la formule + suiviAvisCentimes 19 000
Task 5b: minor (deferred): libellé « maintenance » de la prévision Finance inclut le Suivi avis (renommer « abonnements »)
Task 5b: minor (deferred): wording « Résiliable à tout moment avec un préavis de 2 mois » du Suivi avis en 6 fois à aligner sur la fiche offre
Task 5b: minor (deferred): 6 fois + Suivi avis : conditions et bon pour accord en page 2 (PDF de 4 pages)
Task 5b: fix round 1/5 dispatched (findings: normalisation une fois + Suivi avis, helper montantsSuiviPourVente ; case maintenance désactivée ; phrase en double ; FIX_BASE bcd7526)
Task 5b: fix round 1/5 (3 addressed, 0 open; commits bcd7526..5919ef7)
Task 5b: minor (deferred): règle « une fois + Suivi avis → maintenance null » dupliquée entre validerEntreeVente et montantsSuiviPourVente ; formulaire : case maintenance désactivée mais encore cochée, montant actif
Task 5b: complete (commits a39598a..5919ef7, review clean)
Task 6: dispatched (base 5919ef7)
Ruling 11: un trou dans la numérotation des devis (insertion échouée après réservation) est accepté — seules les factures exigent une suite sans trou, et elles sortent de Stripe — coût si faux : un numéro de devis sauté
Ruling 12: la route générique refuse « signer » (signature réservée à la route /signe de la tâche 8) et le bouton « Marquer prêt à envoyer » ajouté en tâche 6 est gardé — un devis signé sans vente serait incohérent, et sans ce bouton rien ne fige un devis avant la tâche 7 — coût si faux : un bouton de trop à retirer
Ruling 13: un nouveau devis part en « une fois + maintenance » par défaut — choix neutre, Edgar oriente pendant l'appel — coût si faux : un clic de plus par devis
Task 6: fix round 1/5 dispatched (findings: PDF figé périmé ; prochain_numero écrasé par les réglages ; erreurs brutes ; rollback non vérifié ; défaut une fois ; FIX_BASE 97e23b5)
Task 6: fix round 1/5 (5 addressed, 0 open; commits 97e23b5..fb6cd91)
Task 6: minor (deferred): 409 possible sur « préparer » si le PDF du brouillon est ouvert au même instant (sans danger, réessai OK)
Task 6: note pour T12 : brancher modifierNumerotation dans l'écran Réglages (préfixe et prochain numéro)
Task 6: complete (commits 5919ef7..fb6cd91, review clean)
Task 7: dispatched (base fb6cd91)
Task 7: note pour T12 : checklist Google = activer l'API Gmail, URI de retour https://hub-agence-kleak.vercel.app/api/google/retour (et localhost), publier l'appli en production (jeton de 7 jours en Testing)
Task 7: minor (deferred): cache du jeton d'accès par instance après changement de compte Google
Task 7: minor (deferred): From sans nom affiché (à vérifier en recette)
Task 7: minor (deferred): tous les 403 Gmail lus comme problème d'accès (quota)
Task 7: minor (deferred): lien des brouillons /mail/u/0/ (mauvaise boîte si plusieurs comptes ouverts)
Task 7: complete (commits fb6cd91..5966965, review clean)
Task 8: dispatched (base 5966965)
Ruling 14: 6 fois et maintenance passent de `default_incomplete` (23 h pour payer, puis abonnement expiré sans retour possible) à un abonnement actif dès sa création en `collection_method: send_invoice`, `days_until_due: 7`, `payment_settings.save_default_payment_method: on_subscription`, fin après 6 périodes par `cancel_at` ; le cron Finance bascule l'abonnement en `charge_automatically` dès qu'un moyen de paiement par défaut est enregistré (mois 2 à 6 prélevés). Le reste des centimes du 6 fois passe sur le 1er versement partout (devis, vente, Stripe) pour supprimer le calendrier d'abonnement du 6 fois. Maintenance avec bascule vers le Suivi avis : calendrier créé directement (sans from_subscription) sur le client qui a déjà un moyen de paiement. — le client d'Edgar reçoit sa facture par email et ne paiera pas toujours en 23 h ; la promesse « prélèvement automatique » est gardée à partir du 2e mois — coût si faux : à confirmer en mode test Stripe (enregistrement du moyen de paiement sur une facture send_invoice, passage en charge_automatically) ; sinon prélèvement manuel chaque mois, à dire à Edgar.
Task 8: fix round 1/5 dispatched (findings: 6 fois/maintenance sans fenêtre de 23 h (Ruling 14) + état visible et « Recommencer » ; clés d'idempotence avec tentative + recherche avant création + try séparés ; pied de facture 293 B/pénalités/40 € explicite ; date de signature déclarée gardée ; moyen de paiement réutilisé pour la maintenance ; FIX_BASE 1603f55)
Task 8: minor (deferred): dates Stripe ancrées sur le clic « Envoyer » et non sur signeLe (rapprochement par montants OK)
Task 8: minor (deferred): recherche client Stripe par email sensible à la casse ; factures annulées gardent un numéro KLK ; renvoi d'email possible après 24 h sur reprise
Task 8: fix round 1/5 (2 addressed, 2 open + 2 new — cancel_at absent à la reprise ; brouillon vide adopté ; Recommencer refacture un 6 fois impayé ; boucle uncollectible ; commits 1603f55..d5c5cdc)
Task 8: minor (deferred): clés d'idempotence fixes du cron (prelevement:<id>:<pm>) rejouent une erreur 24 h ; listerEnvoyees relit indéfiniment les lignes terminées ; save_default_payment_method non posé si l'update du calendrier échoue
Task 8: fix round 2/5 dispatched (FIX_BASE d5c5cdc)
Task 8: fix round 2/5 (5 addressed, 0 open; commits d5c5cdc..0ff272d)
Task 8: minor (deferred): bouton Recommencer affiché sur un abonnement annulé après paiements alors que le serveur refuse (libellé « Impayé » inexact) ; assurerFin avant lireEtat dans le même try du cron ; cancel_at initial calculé sur l'horloge serveur
Task 8: à vérifier en mode test Stripe (recette) : moyen de paiement enregistré sur facture send_invoice payée ; passage charge_automatically ; cancel_at = 6 factures sans prorata ; voidInvoice sur uncollectible ; calendrier 6 fois + Suivi avis
Task 8: complete (commits 5966965..0ff272d, review clean)
Ruling 15: ResumeRdv gagne `suivi: "maintenance" | "suivi_avis" | null` (le résumé doit savoir si le Suivi avis a été évoqué ; T10 le reprend) — Ruling 10 — coût : nul
Task 9: dispatched (base 0ff272d)
Task 9: note pour T12 : Cal Video ne transcrit que si « Transcribe » est actif → régler « transcription automatique à l'arrivée de l'organisateur » dans le type de RDV ; vérifier en recette uid MEETING_ENDED = rdv_uid et format des liens
Task 9: minor (deferred): corrigerResume passe en « resumee » depuis n'importe quel statut ; horsFormule non recoupé ; plafond vérifié après request.json() ; boucle du cron sans borne dans les 60 s
Task 9: fix round 1/5 dispatched (findings: citations vérifiées ; résumé par étapes persistées + plafond 60 000 ; rattacher les orphelines ; verrou de traitement ; FIX_BASE 9bfe90d)
Task 9: fix round 1/5 (4 addressed, 0 open; commits 9bfe90d..56d415e)
Task 9: minor (deferred): verrou de 90 s après un arrêt brutal ; citation à cheval sur deux morceaux marquée non retrouvée ; filtre .or() avec horodatage non testé en base
Task 9: complete (commits 0ff272d..56d415e, review clean)
Task 10: dispatched (base 56d415e)
Task 10: ⚠️ aucun + six_fois : sans objet, ResumeRdv.suivi exclut « aucun » (src/lib/rdv/types.ts:32)
Task 10: minor (deferred): une demande venue de la carte RDV écrase un éditeur déjà ouvert sans confirmation ; demande rejouée si DevisCarte se remonte ; pas de test pour « Email du client » / « Autres demandes »
Task 10: complete (commits 56d415e..6b6b0c4, review clean)
Task 11: dispatched (base 6b6b0c4)
Ruling 16: une réponse du prospect n'arrête pas les relances (le hub ne lit pas la boîte, la notification de la veille « Couper ? » est le garde-fou) — spec 3.5 — coût si faux : une relance gênante si Edgar ne coupe pas
Task 11: minor (deferred): notification de la veille non idempotente au-delà du tag push ; peutRelancer ne bloque pas un compte déjà signé via un autre devis ; pas de test prénom vide en milieu de phrase
Task 11: fix round 1/5 dispatched (findings: objet stocké ; Message-ID maison stocké pour In-Reply-To ; Appeler après échec ; prochaine_action non écrasée ; FIX_BASE 24e5ea0)
Task 11: fix round 1/5 (5 addressed, 0 open; commits 24e5ea0..8e309d8) — prochaine_action_le est de type date (schema.sql), comparaison de chaînes correcte
Task 11: note pour T12 : le SQL doit être exécuté AVANT de déployer le code (sinon cron et brouillon échouent) ; vérifier en recette que Gmail garde notre Message-ID
Task 11: complete (commits 6b6b0c4..8e309d8, review clean)
Ruling 17: T12 Step 4 (recette de bout en bout avec Edgar) n'est pas faite par un sous-agent : elle demande les réglages et la présence d'Edgar ; elle sera menée par la session principale après la revue finale — coût : nul
Task 12: dispatched (base 8e309d8)
Task 12: minor (deferred): parenthèse tautologique ligne 17 de la checklist ; préfixe des devis distinct du préfixe des factures Stripe à préciser ; opt-in WhatsApp à vérifier sur le formulaire
Task 12: complete (commits 8e309d8..75f8973, review clean)
Final review: dispatched (f3648cd..HEAD)
Final review: Ready with fixes (I1 relance vide ; I2 cron relances borné ; I3 préparer refusé sans CGV/émetteur ; I4 mention d'escompte sur les factures)
Ruling 18: M5 (ventes existantes à 12 mois) sans objet — aucune vente réelle (0 client au 22/10) — coût : nul
Ruling 19: M9 (opt-in WhatsApp) reporté — l'envoi WhatsApp reste manuel par Edgar, le formulaire Meta n'a pas de case WhatsApp — coût : un message WhatsApp à un prospect qui ne l'a pas accepté, si Edgar l'envoie
Final fix wave: dispatched (FIX_BASE 75f8973) : I1-I4 + M2 (relances à 9 h Paris), M3 (.env.example), M4 (bucket privé forcé), M6 (maxDuration + états finaux ignorés), M7 (orphelines sans texte)
Final fix wave: re-review clean (9 addressed; commits 75f8973..5fd62ab)
