# Audit SEO de kleakagency.fr

Réalisé le 22/10/2026, lecture seule. Sources : HTML publié récupéré avec curl (sitemap, robots, 17 pages dont 5 articles échantillonnés, plus les titles et descriptions des 22 articles), Search Console sur 90 jours (22/07 au 19/10, script `gsc.mjs`, qui a fonctionné). Aucun volume de recherche n'est cité : les seuls chiffres sont ceux de Search Console. Les estimations sont signalées comme telles. Pas d'audit de vitesse (fait le 22/10).

## Résumé

1. Le site est positionné pour des utilisateurs de Framer, pas pour des patrons de PME. Les titles disent « Expert Framer » ou « Agence Framer », aucune page ne cible un artisan ou un prix. Search Console le confirme : sur 1 032 impressions, la quasi-totalité vient de requêtes « framer vs wordpress », « agence framer », « migrer wordpress vers framer », avec 0 clic. Les 17 clics viennent de la home, dont 8 sur la requête « kleak » (marque).
2. Les 22 articles du blog ont tous le même title et la même meta description que l'accueil générique (« Kleak - Agence Framer experte en création de site web »). Ils se concurrencent entre eux et n'ont aucun signal propre.
3. Il n'existe aucune page de prix indexable. `/pricing` est en noindex, hors sitemap, et affiche d'anciens prix (740 €, 1 690 €, paiement sur 12 mois) qui contredisent l'offre actuelle (699 / 999 / 1 800 €, 6 fois). Or le prix public fixe est l'atout central de la stratégie.
4. Aucune donnée structurée sur tout le site, et la home contient du texte de gabarit resté en place (témoignage « Olivia Bennett, Product Manager » en anglais, « Our platform consistently outperforms competitors »).
5. La technique de base est correcte : HTTPS, www vers racine en 308, canoniques présentes, lang fr, robots.txt ouvert, sitemap propre. Les corrections à faire sont de contenu et de balisage, pas d'infrastructure.

## Ce qui est sain (ne pas toucher)

- `http://` et `www.` redirigent en 308 vers `https://kleakagency.fr/`. Une seule version canonique.
- `robots.txt` : `Allow: /` et déclaration du sitemap. Aucun blocage.
- `<html lang="fr">` partout, balise canonique présente et correcte sur toutes les pages publiques.
- `/linktree`, `/pricing`, `/mentions-légales`, `/politique-de-confidentialite` sont en noindex et absents du sitemap : cohérent.
- Fausse URL (`/nimportequoi`) : vrai 404 (page Framer « Page not found »).
- Open Graph et Twitter cards présents sur toutes les pages, avec image.
- Les 22 articles ont chacun un H1 unique et des H2 propres.

## Problèmes

### Critique

| # | Page | Constat | Correction précise |
|---|---|---|---|
| C1 | Les 22 articles `/blog/...` | Title identique sur les 22 : « Kleak - Agence Framer experte en création de site web ». Meta description identique : « Découvrez Kleak, l'agence Framer experte… ». Le champ SEO du modèle CMS n'est pas relié au titre de l'article (ou n'est pas rempli). Les deux balises sont aussi utilisées par `/rdv`. | Dans le CMS Framer, ouvrir la page modèle d'article, Page Settings, et lier Title au champ titre de l'article et Description au champ résumé (variable CMS). Vérifier ensuite avec curl que deux articles ont des titles différents. À faire avant de publier le prochain article de la stratégie, sinon il partira avec le title générique. |
| C2 | Site entier | Aucune page ne s'adresse à un patron de PME ou à un artisan. Title de la home : « Création de Sites Web Performants | Agence Kleak | Expert Framer ». H1 de la home : « Vous méritez un site web qui captive, convertit et performe » (générique). Le mot « Framer » est dans les titles de 4 pages sur 6 pages clés. | Retitrer les pages clés (voir plus bas), changer le H1 de la home pour dire à qui et quoi (exemple : « Votre site vitrine à prix fixe, livré en 5 à 10 jours ouvrés »), sortir « Expert Framer » des titles. Framer reste citable dans le corps de page si utile, pas dans les balises. |
| C3 | `/pricing` | Page en noindex qui publie d'anciens prix : One Page 740 €, 4 pages 1 690 € (+ 490 € par page), « Sur-mesure sur devis », paiement sur 12 mois, plus la mention « 1ère Agence FRAMER de FRANCE » (affirmation invérifiable). Title « Nos prix ». Elle est accessible à toute personne qui connaît l'adresse et contredit `fiche-offre.md`. | Soit la dépublier, soit la réécrire à partir de `fiche-offre.md` et en faire la page `/tarifs` indexable (voir contenu recommandé n°1). Dans les deux cas, retirer « 1ère Agence FRAMER de FRANCE », sauf preuve. Ajouter la page au sitemap quand elle est indexable (Framer l'inclut automatiquement si le noindex est retiré). |
| C4 | Home | Texte de gabarit visible dans le HTML : témoignage « Olivia Bennett, Product Manager : The platform gave me clarity and confidence in managing my personal investments… » et « Our platform consistently outperforms competitors in speed and efficiency ». Le visiteur et Google voient de l'anglais hors sujet et un faux témoignage. Cela peut aussi être jugé trompeur. | Supprimer ce témoignage du carrousel et remplacer le texte anglais par une phrase réelle. Garder uniquement les témoignages de vrais clients. |

### Important

| # | Page | Constat | Correction précise |
|---|---|---|---|
| I1 | Sitemap | Contient `/rdv` (page de réservation, 252 mots, title générique) et `/newsletter` (promeut un produit Framer vendu sur Lemon Squeezy, sans rapport avec l'offre). Ne contient ni `/pricing` ni `/linktree` (normal). | Retirer `/newsletter` du sitemap et la passer en noindex (Page Settings, « Exclude from search engines »). Garder `/rdv` indexable seulement si elle reçoit un title propre (voir plus bas) ; sinon noindex. |
| I2 | `/calendly` | 404 réel, mais Google l'a connue : 16 impressions, position 2,1 sur 90 jours. L'ancienne adresse se perd. | Dans Framer, Site Settings, Redirects : `/calendly` vers `/rdv` en 301. Le trafic éventuel arrive sur la page de réservation actuelle. |
| I3 | `/création-de-site-framer` | L'adresse contient un accent (encodée en `%C3%A9`) et le mot « framer ». C'est la page qui prend le plus d'impressions après le blog (126, position 54), sur des requêtes de designers. Contenu : « À qui s'adressent-ont ? » (faute), « Demarquez-vous » (faute), un H1 répété 4 fois dans le DOM. | Recommandation : la transformer en page « site vitrine » sur `/creation-de-site-vitrine` (sans accent), avec redirection 301 depuis l'ancienne adresse. Corriger les fautes (« À qui s'adresse-t-on ? » devient « À qui s'adresse ce service ? », « Démarquez-vous »). Réécrire pour la cible PME (contenu recommandé n°2). |
| I4 | `/seo` | Page « Optimisation SEO » qui vend un service que l'offre actuelle ne contient pas (le SEO est de base dans les formules, le suivi avis est à part). Cite des statistiques non sourcées (75 %, 61 %, 8x, 55 %, 53 %, 93 %). Appelle un « pré-audit offert » via un formulaire Tally. 74 impressions, position 68,8. | Décision d'Edgar à prendre. Option A : réécrire la page pour expliquer ce qui est inclus (titres, structure, fiche Google) et la renommer, voir le title proposé. Option B : noindex si le SEO n'est plus vendu seul. Dans les deux cas, sourcer ou retirer les statistiques, et vérifier que le « pré-audit offert » existe encore. |
| I5 | `/politique-de-confidentialite` | Meta description : « Mentions légales pour le jeu concours de noël. » (héritée d'un ancien concours). Title « Politique de confidentialité » avec espace final. Le menu de pied de page contient un lien « Noël ». | Corriger la description (proposition plus bas), retirer l'espace du title, supprimer le lien « Noël » du pied de page s'il mène à une page périmée. Vérifier que la politique couvre GA4 et Cal.com. |
| I6 | Toutes les pages | Aucun JSON-LD. Pas de données d'entreprise lisibles par Google (nom, adresse, téléphone, offres). | Ajouter les blocs de la section « Données structurées » (Framer : Site Settings, Custom Code, End of `<head>`). |
| I7 | Home, Pricing, Blog | Maillage interne pauvre : le menu et le pied de page pointent vers `/blog/framer-vs-webflow` et `/blog/framer-vs-wordpress-...` (articles de designers) dans la zone « Ressources » de tous les gabarits. Ces deux articles reçoivent ainsi le jus de toutes les pages, alors que ce ne sont pas les pages à pousser. Les articles ne renvoient pas vers l'offre. | Remplacer les deux liens « Ressources » par `/tarifs` et le futur article phare (« combien coûte un site »). Chaque nouvel article renvoie vers `/tarifs` et `/rdv`. |
| I8 | Blog (index) | Title « Le Blog de Kleak : Conseils, Tendances & Expertise Framer ». Aucune page de catégorie. Les nouveaux articles seront noyés parmi 22 anciens articles Framer. | Retitrer (proposition plus bas). Si Framer le permet, ajouter un champ « catégorie » au CMS (prix, choix, métiers, Framer) et afficher les nouveaux articles en tête de liste. Les anciens restent en ligne (décision de la stratégie). |

### Secondaire

| # | Page | Constat | Correction précise |
|---|---|---|---|
| S1 | Toutes | Le H1 de la home apparaît 3 fois dans le HTML (une copie par point de rupture de Framer, une seule visible). Idem sur plusieurs pages (H1 x2 à x4). C'est le fonctionnement normal de Framer, Google l'interprète bien en général. | Ne rien faire de précis. Contrôler dans l'outil d'inspection d'URL de Search Console que la page rendue n'affiche qu'un H1. |
| S2 | Images | Textes alternatifs absents sur 24 images sur 53 (home), 36 sur 38 (apporteur), 10 sur 10 (linktree), 5 sur 5 (newsletter). Les logos de réalisations et les captures n'ont pas de description. | Renseigner l'alt des images utiles en une phrase descriptive (« Site de [nom du client], [métier] »). Les images décoratives gardent un alt vide, c'est correct. |
| S3 | Home, pied de page | « © 2025 – KLEAK Agency » alors que nous sommes en 2026. | Passer à 2026 ou retirer l'année. |
| S4 | Sitemap | Aucune balise `lastmod`. Framer ne l'ajoute pas. | Rien à faire. À ne pas considérer comme un défaut. |
| S5 | Home | Scores PageSpeed affichés dans la page (« Performances score: 90 », « Accessibilité 85 », « Bonnes pratiques 93 ») : texte statique qui ne correspond plus aux mesures du 22/10 (mobile ~80, bureau 99, accessibilité 90). | Mettre à jour ou retirer, pour ne pas afficher un chiffre faux. |
| S6 | `/mentions-légales` | Accent dans l'adresse. En noindex donc sans effet SEO. Indique « BLOMME EDGAR, auto-entrepreneur » : à comparer avec le statut réel de l'entreprise (voir le contexte). | Laisser l'adresse. Vérifier le contenu juridique avec la fiche entreprise (SIRET, adresse). |
| S7 | Blog | Anciens articles datés (mars 2025, décembre 2024, Fall Event 2024) restés avec des dates anciennes. Sans effet sur les clients ciblés. | Rien. Ils restent en l'état, selon la stratégie. |

## Positionnement

**Ce que le site cible aujourd'hui.** D'après Search Console (90 jours) :

| Requête | Impressions | Clics | Position |
|---|---|---|---|
| framer vs wordpress | 132 | 0 | 43 |
| migrer wordpress vers framer | 128 | 0 | 54 |
| framer ou wordpress pour le seo | 119 | 0 | 37 |
| sécurité site framer vs wordpress | 114 | 0 | 36 |
| agence framer france | 113 | 0 | 37 |
| webflow ou framer pour startup | 97 | 0 | 64 |
| framer vs webflow | 67 | 0 | 75 |
| kleak (marque) | 43 | 8 | 2,5 |

Toutes les requêtes à impressions sont des requêtes de designers, d'indépendants qui comparent des outils ou de rares acheteurs d'agence Framer. Aucune requête d'un patron de PME ou d'un artisan (« création site internet artisan », « site vitrine prix », « site internet paiement en plusieurs fois ») n'apparaît, ce qui est attendu puisque aucune page ne les cible.

**Adéquation avec la stratégie nationale : faible.** Pour ces requêtes, il n'y a rien à corriger : il faut créer les pages. Ce qui existe peut servir de socle technique (site rapide, bien structuré, canoniques correctes), mais pas de support de contenu.

**Position moyenne.** Sur 90 jours : position 45,5 contre 35,6 sur les 90 jours d'avant (même nombre de clics, 17). L'indice n'est pas fiable pour décider, car il mélange des pages classées 2 et 75. Il baisse parce que de nouvelles requêtes Framer sont apparues en seconde moitié de classement.

**Estimation, non mesurée.** Les requêtes de marque (« kleak », 43 impressions) et celles de la home peuvent monter si la home et les titles disent clairement « site vitrine, prix fixe, PME et artisans ». Aucune estimation chiffrée n'est donnée : Search Console tranchera, comme prévu dans la stratégie.

**Risque de cannibalisation.** Après les corrections, les 2 articles « framer vs wordpress / webflow » (677 et 178 impressions) restent les pages les plus vues. C'est un trafic sans valeur commerciale. Ne pas les supprimer (décision de la stratégie), ne pas les mettre en avant dans le menu (voir I7).

## Titles et meta descriptions proposés

Longueurs vérifiées : title de 60 caractères maximum, description de 155 maximum. Sans tiret long. Les chiffres viennent de `livrables/offre/fiche-offre.md`.

| Page | Title | Meta description |
|---|---|---|
| Home `/` | `Création de site internet pour PME et artisans \| Kleak` (54) | `Site vitrine à prix fixe pour PME et artisans. Trois formules dès 699 €, livraison en 5 à 10 jours ouvrés, paiement possible en 6 fois sans frais.` (146) |
| Tarifs `/tarifs` (page à créer, voir contenu n°1) | `Prix d'un site vitrine : 699 €, 999 € ou 1 800 €` (48) | `Trois formules à prix fixe, sans surprise : One page 699 €, Essentiel 999 €, Pro 1 800 €. Paiement en une fois ou en 6 fois sans frais.` (135) |
| Site vitrine `/creation-de-site-vitrine` (remplace `/création-de-site-framer`) | `Création de site vitrine pour entreprise \| Kleak Agency` (55) | `Ce que comprend un site vitrine livré par Kleak : pages, mobile, formulaire, mentions légales, RGPD, mise en ligne. Prix fixe et délai annoncé.` (143) |
| `/seo` (si option A, voir I4) | `Référencement de votre site vitrine \| Kleak Agency` (50) | `Ce que nous faisons pour que votre site apparaisse sur Google : titres, structure, fiche Google. Inclus dans chaque formule, détaillé ici.` (138) |
| Réservation `/rdv` | `Réserver un appel gratuit de 30 minutes \| Kleak` (47) | `Réservez un appel de 30 minutes pour parler de votre site. Nous comprenons votre activité, puis vous recevez un devis à prix fixe.` (130) |
| Blog `/blog` | `Blog Kleak : prix, choix et conseils pour votre site` (52) | `Combien coûte un site, vitrine ou e-commerce, comment payer en plusieurs fois : des réponses chiffrées pour les patrons de PME et les artisans.` (143) |
| Apporteur `/programme-apporteur-daffaires` | `Apporteur d'affaires : 15 % de commission \| Kleak` (49) | `Recommandez Kleak à une entreprise qui cherche un site et touchez 15 % de commission sur le projet signé. Sans engagement.` (122) |
| Mentions légales | `Mentions légales \| Kleak Agency` (31) | `Mentions légales de Kleak Agency, marque exploitée par Edgar Blomme : éditeur, hébergeur, propriété intellectuelle.` (115) |
| Confidentialité | `Politique de confidentialité \| Kleak Agency` (43) | `Quelles données Kleak Agency collecte via ce site, pourquoi, combien de temps, et comment exercer vos droits RGPD.` (114) |
| Newsletter, Linktree, Pricing actuel | noindex, pas de title à travailler | |

Remarques : le paiement en 6 fois « sans frais » et les délais (5, 7, 10 jours ouvrés) sont tirés de la fiche d'offre ; si l'offre change, ces balises doivent être corrigées. Le chiffre de 15 % pour l'apporteur est celui qui est publié aujourd'hui sur la page, à confirmer par Edgar.

**Modèle des articles du blog** (à lier dans le CMS, voir C1) : Title = titre SEO de l'article (60 caractères, requête au début), Description = résumé de l'article (155 caractères), tels que la stratégie les prévoit. Pour les 22 anciens articles, la correction se fait en lot par le modèle si le champ le permet (le titre de l'article suffira comme title), sans les réécrire.

## Données structurées (JSON-LD)

À coller dans Framer : Site Settings, General, Custom Code, « End of `<head>` tag », sur toutes les pages (l'Organization) ; le Service et le FAQ seulement sur les pages concernées (Page Settings, Custom Code). Les données déjà publiques sur le site (nom, email, téléphone, réseaux) sont reprises. Tout le reste est marqué « À FOURNIR ».

### 1. Organization / ProfessionalService (toutes les pages)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://kleakagency.fr/#organization",
  "name": "Kleak Agency",
  "url": "https://kleakagency.fr/",
  "logo": "À FOURNIR (URL de l'image du logo, carrée, au moins 112 x 112 px)",
  "image": "https://framerusercontent.com/assets/f4yniRsb5EMVg0Fg7pDZ9i0qEpE.png",
  "description": "Agence de création de sites vitrines pour PME, artisans et indépendants. Prix fixes, délai annoncé, paiement possible en 6 fois.",
  "email": "contact@kleakagency.fr",
  "telephone": "+33695115814",
  "areaServed": { "@type": "Country", "name": "France" },
  "founder": { "@type": "Person", "name": "Edgar Blomme" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "À FOURNIR",
    "postalCode": "À FOURNIR",
    "addressLocality": "À FOURNIR",
    "addressCountry": "FR"
  },
  "taxID": "À FOURNIR (SIRET)",
  "sameAs": [
    "https://www.instagram.com/kleak_agency/",
    "https://www.tiktok.com/@kleak_fr"
  ]
}
</script>
```

Notes : la stratégie met le local de côté et la fiche Google Business Profile est domiciliée à l'étranger : tant qu'elle n'est pas corrigée, ne pas mettre d'adresse différente de celle des mentions légales (laisser le bloc `address` supprimé plutôt que d'y mettre une adresse divergente). `areaServed: France` colle à la cible nationale. Le logo doit être une vraie image publique (À FOURNIR).

### 2. Service avec offres (page `/tarifs`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Création de site vitrine",
  "name": "Création de site vitrine pour PME et artisans",
  "provider": { "@id": "https://kleakagency.fr/#organization" },
  "areaServed": { "@type": "Country", "name": "France" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Formules de création de site",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "One page",
        "description": "1 page, mobile, formulaire de contact, référencement de base, mentions légales et RGPD, mise en ligne, 1 série de retouches. Livraison en 5 jours ouvrés.",
        "price": "699",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Essentiel",
        "description": "3 pages (Accueil, Services, Contact), fiche Google optimisée, 1 série de retouches. Livraison en 7 jours ouvrés.",
        "price": "999",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "description": "5 pages, design personnalisé, référencement local, mesure d'audience, 2 séries de retouches, prise en main de 30 minutes. Livraison en 10 jours ouvrés.",
        "price": "1800",
        "priceCurrency": "EUR"
      }
    ]
  }
}
</script>
```

Notes : prix TTC égal au prix HT (TVA non applicable, article 293 B du CGI), à écrire aussi dans le texte visible de la page. À ne mettre qu'une fois la page `/tarifs` publiée avec les mêmes prix : le balisage doit refléter le contenu visible.

### 3. FAQ (page `/tarifs`, et articles qui ont une FAQ)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Peut-on payer son site en plusieurs fois ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, en 6 fois sans frais : One page 6 x 116,50 €, Essentiel 6 x 166,50 €, Pro 6 x 300 €. La maintenance est obligatoire dans ce mode de paiement et s'ajoute aux versements. Le site vous appartient au dernier versement."
      }
    },
    {
      "@type": "Question",
      "name": "En combien de temps le site est-il livré ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "5 jours ouvrés pour la formule One page, 7 pour Essentiel, 10 pour Pro, à compter de la réception de vos contenus et du premier paiement."
      }
    },
    {
      "@type": "Question",
      "name": "La maintenance est-elle avec engagement ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non, sans engagement de durée, avec un préavis de 2 mois. Elle coûte 49 € par mois pour la formule One page et 90 € par mois pour Essentiel et Pro, hébergement compris."
      }
    }
  ]
}
</script>
```

Notes : ces réponses reprennent la fiche d'offre mot pour mot. Depuis août 2023, Google n'affiche plus les résultats enrichis FAQ que pour les sites publics de santé et d'administration, donc ce balisage n'apportera pas d'étoiles ni de questions dépliées dans les résultats. Il reste valide et peut aider la compréhension de la page, mais ce n'est pas une priorité. À poser en dernier. Vérifier que les mêmes questions et réponses sont bien visibles sur la page. Attention : l'engagement de maintenance (note du hub : passage à un préavis de 2 mois à faire dans le Hub) doit rester cohérent avec la fiche.

### 4. Avis (Review) : ne pas en mettre

Google n'affiche pas de résultats enrichis pour des avis écrits sur sa propre entreprise (balisage `Review` ou `AggregateRating` sur une page de l'entreprise elle-même, de type Organization ou LocalBusiness) : ce sont des avis « auto-référencés », non conformes. Les témoignages de la home ne doivent donc pas être balisés. La voie conforme passe par les avis Google de la fiche Google Business Profile (indépendants du site). Cela suppose la correction de la fiche, aujourd'hui domiciliée à l'étranger.

### 5. Articles (BlogPosting), optionnel

Une fois C1 réglé, un BlogPosting par article est possible via une variable CMS (titre, date de publication, auteur « Edgar Blomme »). Priorité basse.

## 5 recommandations de contenu alignées sur la stratégie

Rappel de la stratégie : cible nationale (PME, artisans), 1 article par semaine, sujets dans `sujets.md`, pas d'outil payant, Search Console tranche. La suite part de ce que l'audit montre.

1. **Créer la page `/tarifs` avant tout article.** C'est la page vers laquelle chaque article doit pointer, et la stratégie la prévoit déjà (« une fois créée sur le site »). Contenu : les 3 formules de la fiche d'offre (699 / 999 / 1 800 €), le tableau « en une fois ou en 6 fois », la maintenance (49 / 90 €), ce qui n'est pas compris, un bloc « Comment ça se passe » en 7 étapes, la FAQ. Title et description proposés plus haut. C'est aussi la page qui répond directement à « site vitrine prix » et « site internet paiement en plusieurs fois ». Effort : une demi-journée dans Framer.
2. **Réécrire `/création-de-site-framer` en page « site vitrine » pour PME et artisans** (adresse `/creation-de-site-vitrine`, redirection 301). Même structure, autre promesse : pour qui (artisans, commerçants, indépendants, PME de services), ce qui est inclus, mentions légales et RGPD livrées, le délai, un lien vers `/tarifs`. Retirer les arguments de designers (animations, « leaders Framer en France »).
3. **Premier article : le prix d'un site vitrine** (famille 1 de la stratégie), publié dès que C1 et la page tarifs sont réglés. Fourchette en premier paragraphe, grille de ce qui fait varier le prix, comparaison honnête des options (faire soi-même, freelance, agence), puis Kleak avec ses prix. Ne citer un prix du marché que s'il a une source. C'est le sujet où l'atout de Kleak (prix publics) est le plus fort.
4. **Deuxième et troisième articles : le paiement en plusieurs fois et « artisan » (famille 4, un métier réellement distinct)**. Le paiement en 6 fois est la différence concrète avec les concurrents qui répondent « ça dépend ». Pour le métier, partir de ce que ce métier doit montrer (réalisations, zone d'intervention, obligations propres), et non d'un modèle recopié. À chaque article : lien vers `/tarifs` et `/rdv`, FAQ courte si les suggestions Google la justifient.
5. **Mesurer en priorité deux choses à 4 et 8 semaines dans Search Console** : (a) les impressions des nouvelles pages sur des requêtes non liées à Framer, par la vue `page` et `requete-page` du script `gsc.mjs` ; (b) la part des clics qui arrivent sur `/tarifs` et `/rdv` plutôt que sur la home. Si au bout de 2 mois un sujet n'a aucune impression, il ne se décline pas (règle de la stratégie). Ne pas toucher aux 22 anciens articles, sauf la liaison du title/description (C1).

## Ordre d'exécution conseillé

1. C1 (lier title et description dans le modèle d'article) : bloquant pour l'article de la semaine.
2. C4, I2, S3 (corrections courtes : témoignage de gabarit, redirection `/calendly`, année).
3. C3 et recommandation 1 (page `/tarifs`), puis I7 (maillage vers `/tarifs`).
4. C2 : titles et H1 de la home, de `/rdv` et du blog (tableau plus haut).
5. I3 et recommandation 2 (page site vitrine), I4 (décision sur `/seo`), I1 (newsletter), I5 (confidentialité).
6. JSON-LD n°1 (Organization) dès que le SIRET, le logo et l'adresse validée sont fournis ; n°2 avec la page tarifs ; n°3 en dernier.

## Limites de cet audit

- Pas d'accès à l'interface Framer : les pages, les champs CMS et les réglages ne sont connus que par leur rendu public.
- Pas de volumes de recherche : seules les données de Search Console (90 jours, 17 clics, 1 032 impressions) sont citées. La saisonnalité n'est pas visible sur cette durée.
- Pas de vérification de l'état d'indexation page par page (outil d'inspection d'URL de Search Console, non disponible en lecture via le script).
- Pas de crawl exhaustif des liens externes ni de test de liens cassés au-delà de ceux du menu et du pied de page (aucun lien interne cassé trouvé sur l'échantillon).
- Un premier essai de récupération a renvoyé, quelques minutes après une publication Framer du site, des pages sans contenu ni canonique pour `/rdv` et plusieurs articles ; les essais suivants étaient corrects. À revérifier si Search Console signale des pages explorées vides.
