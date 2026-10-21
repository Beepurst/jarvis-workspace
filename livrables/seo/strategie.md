# Stratégie SEO de kleakagency.fr

> Décidée le 21/10/2026 avec Edgar. Lue par l'agent `redacteur-seo` avant chaque article.
> Si une règle te semble fausse, dis-le à Edgar et propose la modification, ne l'ignore pas.

## Point de départ (21/10/2026)

- Search Console, 90 derniers jours : **16 clics, environ 1 000 impressions, position moyenne 45**.
  15 des 16 clics arrivent sur la home, dont la moitié sur la requête « kleak » (des gens qui
  connaissent déjà la marque).
- Les 22 articles du blog parlent de Framer (comparatifs, plugins, nouveautés). Ils attirent des
  utilisateurs de Framer, pas des clients. Aucun clic.
- Le site ne mentionne jamais une ville ni une cible de PME.

## Cible

**Patrons de PME, artisans et indépendants, partout en France**, qui préparent l'achat d'un site
vitrine : ils cherchent un prix, comparent des options, se demandent si ça vaut le coup. Ce ne
sont ni des développeurs ni des utilisateurs de Framer.

**Hors périmètre pour l'instant :**
- **Le local** (« agence web Cergy »). Mis de côté par Edgar le 21/10. Il demandera aussi de
  corriger la fiche Google Business Profile, aujourd'hui domiciliée à l'étranger.
- **Les articles sur Framer.** L'outil n'intéresse pas le client. Les 22 anciens articles restent
  en ligne, tels quels.
- **Les requêtes de tête** (« création site internet », « agence web ») : tenues par de gros
  acteurs, hors de portée d'un site sans autorité.

## Les 4 familles de sujets

1. **Le prix** : ce que coûte un site, par mois, pour un artisan, une refonte, la maintenance.
   L'atout de Kleak : des prix publics et fixes là où les concurrents répondent « ça dépend ».
2. **Le paiement en plusieurs fois** : très peu traité, et c'est la formule en 6 fois de Kleak.
3. **Les choix avant l'achat** : site vitrine ou landing page, vitrine ou e-commerce, one page
   ou plusieurs pages, faire soi-même ou passer par une agence.
4. **Les métiers** : le site d'un plombier, d'une esthéticienne, d'un avocat… Chaque article
   doit être réellement différent : ce que ce métier doit montrer, ce que ses clients
   cherchent, les obligations propres au métier quand il y en a. **Jamais une page recopiée
   où seul le métier change** : Google sanctionne ces pages, et elles n'aident personne.

Les sujets et leur ordre sont dans `sujets.md`.

## Choisir les sujets sans outil payant

Pas de Semrush ni de DataForSEO (décision d'Edgar du 21/10). Donc **aucun volume de recherche
n'est connu avant publication**, et l'agent n'en cite jamais un.

- **Preuve qu'une requête existe** : les suggestions de Google (autocomplétion). Elles montrent
  ce que les gens tapent, pas combien ils sont.
- **Concurrence** : lire les premiers résultats Google de la requête. Si ce sont uniquement de
  gros sites ou des comparateurs, viser une variante plus précise.
- **Après publication** : Search Console tranche. Les sujets qui prennent des impressions
  méritent des articles voisins, ceux qui n'en prennent aucune au bout de 2 mois ne se
  déclinent pas.

## Règles d'écriture

- **Vouvoiement**, phrases courtes, phrasé plat et parlé. Pas de formules, pas de paires en
  miroir, pas de chute en fin de paragraphe, pas d'antithèses, pas de « dans un monde où ».
  Edgar rejette tout ce qui « fait IA ».
- **Pas de tirets longs.** Des virgules ou des points.
- **Répondre à la question dès les premières lignes**, puis détailler. Le lecteur qui cherche
  « combien coûte un site » doit avoir une fourchette dans le premier paragraphe.
- **Les prix de Kleak viennent de `livrables/offre/fiche-offre.md`**, jamais de mémoire. Un prix
  du marché ne s'écrit qu'avec une source citée, ou pas du tout.
- **Être utile même à celui qui n'achète pas chez Kleak.** Un article qui ne fait que vendre ne
  se classe pas.
- **Longueur** : celle qu'il faut pour répondre complètement, sans remplissage. Repère : 900 à
  1 500 mots.
- **Structure** : un H1 qui reprend la requête, des H2 qui sont de vraies questions ou étapes,
  une FAQ courte en fin d'article si les suggestions Google montrent des questions voisines.

## Ce que chaque article contient

- **Titre SEO** : 60 caractères maximum, la requête au début.
- **Description** : 155 caractères maximum, une promesse concrète.
- **Adresse** : `/blog/<slug>`, en minuscules, sans accents, mots séparés par des tirets.
- **Liens internes** :
  - vers l'offre : la page tarifs, une fois créée sur le site ; d'ici là, la home
    `https://kleakagency.fr/` ;
  - vers la réservation : `https://cal.com/kleak-agency/appel-decouverte?canal=site`
    (`canal=site` permet au hub de reconnaître une réservation venue du site) ;
  - vers 1 ou 2 autres articles de la nouvelle série quand ils existent.
- **Un appel à l'action en fin d'article**, simple : réserver un appel de 30 minutes.

## Rythme et circuit

- **1 article par semaine au départ.**
- Statuts d'un article dans `sujets.md` : `à écrire` → `à relire` → `validé` → `publié`.
- L'agent rédige, Edgar relit dans la conversation. Rien n'est publié sans sa validation.
- **Publication** : par la session principale de Claude Code, avec la skill `framer`, dans la
  collection Blog du CMS Framer de kleakagency.fr. **Bloquée tant que le problème IONOS n'est pas
  réglé** : les articles validés attendent en file. À la première publication, relever les
  champs de la collection Blog et les noter ici.

## Mesure

Script en lecture seule, compte de service du Hub Agence :

```
node --env-file=livrables/hub-agence/.env.local livrables/seo/gsc.mjs [jours] [requete|page|requete-page]
```

Bilan une fois par mois dans `suivi.md`. Un article met en général plusieurs semaines à prendre
des positions : pas de conclusion sur un article de moins d'un mois.
