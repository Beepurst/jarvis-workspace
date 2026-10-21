# /site

> Démarrer léger une session de construction de site Framer : `/site <nom du client ou du test>`.
> Remplace `/prime` pour ces sessions. Plan : `docs/superpowers/plans/2026-10-21-bibliotheque-optimisation.md`.

---

## Mission

Session de construction pour **$ARGUMENTS**. Ne lis **aucun** fichier de contexte de l'agence (ni `context/CONTEXT.md`, ni `context/HISTORY.md`, ni autre chose) : tout ce qu'il faut arrive avec le prompt copié depuis le hub.

### Étape 1 : Outil

Framer avec `@framer/agent`. Lance une fois `npx @framer/agent@latest setup`, attends la fin, puis charge la skill `framer` et suis ce qu'elle demande.

### Étape 2 : Règles de construction (checklist section 9)

1. Aucun effet d'apparition au-dessus de la ligne de flottaison, aucun effet de texte mot par mot.
2. Fondus d'apparition sur 3 ou 4 éléments forts par page, jamais sur listes, chiffres ou cartes.
3. Parallaxe jamais sur l'accroche, 3 éléments au plus par page ; bandeaux défilants et survols autorisés ; pas de WebGL ni de vidéo de fond sauf demande explicite.
4. 10 à 12 images par page, importées à la bonne taille (1920 px pleine largeur, 1000 à 1200 px en carte), jamais 2400 px ou plus ; accroche mobile sous 80 Ko.
5. Une famille de titres, une graisse, sans italique si possible.
6. `lang="fr"`, repères `header`, `nav`, `main`, `footer`, bouton de menu en `button`, contraste des petits textes vérifié.

Détail : `/Users/ed/Desktop/jarvis-kleak/livrables/process/checklist-qualite-site.md`, section 9 (à ouvrir seulement en cas de doute).

### Étape 3 : Économie

- Appels Framer groupés : 2 ou 3 par section au plus, pas un appel par élément.
- Captures de contrôle réduites à 1000 px de large, une seule par section, à la fin de la section.
- Animations : reproduis exactement la recette de la rubrique « Animations » de la fiche (élément, effet, depuis → vers, déclencheur, délai, durée, cascade, blocs collants, survols), dans la version permise (« à alléger » allégée comme écrit, « à proscrire » non reproduite). Ne construis jamais statique une section dont la fiche décrit une animation.
- Pour voir l'animation, sans Chrome : `node /Users/ed/Desktop/jarvis-kleak/livrables/bibliotheque/capturer.mjs <url> --titre "<un titre de la section, lu sur la capture>"` donne son numéro `n`, puis `node /Users/ed/Desktop/jarvis-kleak/livrables/bibliotheque/capturer.mjs <url> --section <n> --sortie /tmp/kleak-biblio/site-<section>` écrit `animation.jpg` (6 images légendées) et `resume.json` (`animations` : mesures) ; lis les deux une fois. Chrome seulement s'il est déjà connecté et que la planche ne suffit pas : au plus 2 captures de la section réduites à 1000 px, rien d'autre du site.
- Ne relis pas un fichier déjà lu dans la session.

### Étape 4 : Attendre

Réponds en une ligne : « Session prête pour $ARGUMENTS, colle le prompt de page ou de section copié depuis le hub. » Puis attends ce prompt, sans rien construire avant.
