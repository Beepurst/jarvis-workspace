# Nouveau blog : état et bascule

> Construit le 23/10/2026 dans le Framer du site (projet « Kleak Agency New »), en brouillon.
> Rien n'est visible sur kleakagency.fr tant que la bascule n'est pas faite.

## Ce qui existe

- **Collection CMS « Articles »** : Titre, Slug, Date, Catégorie (Prix, Paiement, Choisir son site),
  Image, Description (sert de meta description), Temps de lecture (minutes), Contenu.
- **Page `/blog-nouveau`** (brouillon) : structure Agnos. Titre, un article en une (texte et auteur
  à gauche, image à droite), une carte à côté, puis une grille de 3 colonnes. Tri par date, du plus
  récent au plus ancien.
- **Page `/articles/:Articles`** (brouillon) : modèle d'article. Titre, catégorie, date, temps de
  lecture, image encadrée, texte, encadré « Un site vitrine à prix fixe » vers `/creation-site-vitrine#formules`,
  carte auteur Kleak Agency, 2 autres articles, appel final, pied de page. Title `{{Titre}} | Kleak Agency`,
  description `{{Description}}`.
- **Articles dans la collection** :
  - « Site internet : payer en plusieurs fois, comment ça marche » (texte de `livrables/seo/articles/2026-10-21-...`, encore « à relire »).
  - 4 articles d'exemple (slugs `exemple-...`, texte de remplissage) qui servent à voir la grille. À supprimer à la bascule.
- **Une page à supprimer à la main** dans Framer : `/articles/:Blog` (brouillon), copie ratée. L'outil ne peut pas supprimer de page.

## Ce qui reste avant d'ouvrir

1. Avoir 4 ou 5 vrais articles validés dans « Articles » (redacteur-seo).
2. Corriger l'article paiement : il parle encore d'un « engagement de 12 mois » sur la maintenance, alors qu'elle est sans engagement avec préavis de 2 mois.
3. Le tableau des articles déborde sur téléphone au-delà de 3 colonnes.

## Bascule (le jour J)

1. Supprimer les 4 articles d'exemple.
2. Supprimer les 22 anciens articles et la collection « Blog », puis les pages `/blog` et `/blog/:Blog` (à la main dans Framer).
3. Passer `/blog-nouveau` en `/blog` et `/articles/:Articles` en `/blog/:Articles`, et les sortir du brouillon.
4. Vérifier les liens « Blog » du menu et du pied de page, retirer « Wordpress VS FRAMER » et « Webflow VS FRAMER » du pied de page.
5. Publier, puis vérifier une page article et la page liste sur téléphone.

Sans redirections (plan Framer), les anciennes adresses d'articles tomberont en 404. Search Console : 0 clic en 90 jours sur ces articles.
