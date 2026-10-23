# Offre agence : note interne

> Décidée le 16/10/2026, revue le 20/10/2026 (one page, paiement en 6 fois, hébergement chez Kleak) et le 22/10/2026 (Suivi avis à 190 €/mois). Ne pas envoyer aux clients. La fiche client est `fiche-offre.md`.

## Objectif servi

2 000 € nets par mois dès décembre 2026, soit environ 2 550 € de CA (micro BIC prestations de services, cotisations de 21,2 %, taux confirmé).

## Les deux leviers retenus

1. **Réduire le temps de production** grâce à une bibliothèque de sections réutilisables (Hub Agence, page Bibliothèque), construite sur la démo Atelier Hauteville.
2. **6 h par jour jusqu'à fin décembre** au lieu de 4, puis retour à 4 h.

## Temps cibles et rentabilité

| | Prix | Production cible | Vente + retouches | Total | Taux horaire |
|---|---|---|---|---|---|
| One page | 699 € | **7 à 9 h** (hypothèse, à mesurer) | 5 h | 12 à 14 h | 50 à 58 €/h |
| Essentiel | 999 € | **15 h maximum** (dont 1 h de fiche Google) | 8 h | 23 h | 43 €/h |
| Pro | 1 800 € | **24 h** | 12 h | 36 h | 50 €/h |
| Automatisation | 400 € | 4 h | 0 | 4 h | 100 €/h |
| Maintenance one page | 49 €/mois | 30 min/mois | | | 98 €/h, 74 €/h après hébergement |
| Maintenance Essentiel/Pro | 90 €/mois | 1 h/mois | | | 90 €/h, 78 €/h après hébergement |
| Suivi avis | 190 €/mois | 1 h à 1 h 30/mois (estimation, à mesurer) | | | 127 à 190 €/h, environ 120 à 180 €/h après hébergement ; environ 65 €/h sur les 100 € ajoutés à la maintenance |

Point de départ mesuré : 4 à 5 journées de 8 h par site Framer (32 à 40 h), soit 31 à 37 €/h aux prix actuels. Sans les sections, l'objectif n'est pas tenable.

**Règle :** le one page sert de prix d'entrée pour les leads qui annoncent moins de 1 000 € de budget. Il se produit uniquement à partir de sections existantes. Passage à l'Essentiel possible plus tard en payant la différence.

**Règle :** l'Essentiel se produit uniquement à partir de sections existantes. S'il dépasse 15 h de production, il rapporte moins que le Pro par heure : le signaler et recadrer le périmètre.

## Suivi avis (décidé le 22/10)

Deuxième niveau de suivi, proposé **dès la signature**, en face de la maintenance. Il tourne autour de deux promesses, et de deux seulement : **plus d'avis Google, tous répondus**, et **rien à faire pour le client**. La position sur Maps et les appels venus du site figurent dans le bilan comme preuves, jamais dans une pub ni dans un contrat.

- **Contenu** : maintenance Essentiel et Pro, demande d'avis (message type, QR code, rappel mensuel), réponse à tous les avis (rédigée par l'IA, validée par Edgar), 2 à 4 publications par mois sur la fiche Google, bilan mensuel d'une page (prévu par n8n à partir de GA4, Search Console et de la fiche).
- **Prix : 190 €/mois**, dans le bas de ce que facturent les agences pour maintenance et gestion de fiche réunies (environ 180 à 250 € HT, recherche du 22/10 sur des pages d'agences, « à partir de », pas une grille de marché). À revoir à 220 ou 250 € pour les nouveaux clients après 3 à 5 bilans à montrer.
- **Démarrage** : à la mise en ligne en paiement en une fois ; **le mois qui suit le dernier versement** en paiement en 6 fois (la maintenance tourne pendant les versements, pour éviter environ 356 €/mois sur un Essentiel).
- **Avant-goût offert** : message de demande d'avis et QR code remis à chaque livraison, toutes formules, environ 20 minutes par client avec le kit `livrables/process/demande-avis/` (estimation du 23/10, à mesurer au premier client).
- **One page** : la fiche Google n'est pas optimisée à la création. Mon hypothèse : prévoir environ 1 h de remise en état de la fiche au démarrage du pack, sans la facturer à part.
- **Règles** : avis demandés à tous les clients, sans contrepartie ; jamais d'avis rédigé à la place de quelqu'un ; accès gestionnaire à la fiche du client demandé dès la signature. À écrire dans les CGV.
- **Écartés pour l'instant** : les articles SEO automatisés (risque de contenu de masse, aucune preuve sur le blog de Kleak, relecture intenable à 10 clients) et la plateforme façon Orbikal (à partir de 5 clients sur le pack).
- **Effet sur l'objectif** : 10 clients sur le pack font 1 900 €/mois de récurrent pour environ 10 à 15 h par mois.

À faire :
- ~~demander l'accès à l'API Google Business Profile~~ : demande de Kleak refusée le 22/10 (critères non remplis). **On passe par le projet Google Cloud d'Orbikal**, où l'API et l'écran d'autorisation sont validés (vérifié par Edgar le 22/10). Le Suivi avis dépend donc de ce projet : il ne faut ni le supprimer ni le laisser expirer, même si Orbikal reste en pause ;
- construire le bilan mensuel dans n8n ;
- ~~ajouter le Suivi avis au catalogue du hub (`src/lib/offre.ts`) avec le départ décalé après le 6e versement~~ : en production le 23/10 ;
- mettre le Suivi avis dans le script de RDV.

## Capacité

- À 6 h/jour : environ 125 h par mois, dont environ 35 h de prospection en octobre-novembre, donc environ 90 h de production.
- 90 h, c'est par exemple 1 Pro + 2 Essentiels (environ 80 h) = 3 800 € de CA, ou 1 Pro + 1 Essentiel + 1 automatisation = 3 200 €.
- Objectif de décembre (2 550 €) : **1 Pro + 1 Essentiel signés d'ici mi-novembre** suffisent, avec une marge.

## Encaissement

Deux modes, au choix du client :

- **En une fois** : acompte de 50 % à la signature, solde à la livraison avant mise en ligne. Un site signé mi-novembre encaisse la moitié en novembre et la moitié en décembre.
- **En 6 fois sans frais** : 6 × 116,50 € (one page), 6 × 166,50 € (Essentiel), 6 × 300 € (Pro). Premier versement à la signature, les suivants prélevés chaque mois par Stripe (SEPA ou carte). La maintenance est obligatoire, démarre le mois de la mise en ligne et s'ajoute aux versements (précisé le 21/10, fiche client corrigée). Le site reste à Kleak jusqu'au dernier versement, suspendu en cas d'impayé.

**Effet sur le cash :** un client en 6 fois rapporte un sixième du prix le premier mois au lieu de la moitié. Suivre la part des clients en 6 fois dans l'onglet Finance ; si elle grimpe, l'objectif de décembre demande plus de signatures.

## Hébergement

Les sites sont hébergés sur le compte Framer de Kleak, plan Basic par site (10 $/mois facturé à l'année, environ 125 €/an TTC estimés, plus le domaine 15 à 20 €/an), soit environ 12 €/mois par site. L'hébergement est **inclus dans la maintenance, jamais vendu seul** : seul, il rapporterait environ 8 € nets par mois. À la fin de l'engagement, le client renouvelle ou le site est transféré sur son propre compte Framer.

À vérifier dans le compte Framer : le prix mensuel du plan Basic (le prendre s'il est proche de l'annuel, pour ne pas rester engagé si un client arrête de payer) et la procédure de transfert d'un site.

## Points à vérifier avant d'envoyer la fiche

- Le nom de l'agence, l'email et le téléphone (champs entre crochets).
- Le prix de la page supplémentaire (200 €) : proposé, pas encore discuté.
- CGV de prestation à rédiger : périmètre, Suivi avis (règles sur les avis, accès à la fiche, départ après le 6e versement), retouches, propriété (site à Kleak jusqu'au paiement complet), paiement en 6 fois et suspension en cas d'impayé, retards de contenus, résiliation de la maintenance (sans engagement, préavis de 2 mois, décision du 21/10), transfert du site à l'arrêt de la maintenance.
- Mention « TVA non applicable, article 293 B du CGI » valable tant que le CA reste sous le seuil de franchise (à vérifier).
