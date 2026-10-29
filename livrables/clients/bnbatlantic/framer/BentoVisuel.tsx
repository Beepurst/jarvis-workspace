// Mini-interfaces animées du bento « Vous accueillez. On s'occupe du reste. » de la page
// d'inscription BnbAtlantic : la fiche qui s'écrit, la recherche Google qui fait sortir la fiche,
// les messages d'un voyageur jusqu'à « Réservé en direct ». Une prop « visuel » choisit l'écran.
// Composant code Framer, un seul fichier (Assets > Code). Les animations ne tournent qu'à l'écran
// et sont coupées quand le visiteur demande moins d'animations.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Image = { src: string; srcSet?: string; alt?: string }

type Props = {
    visuel: "fiche" | "google" | "messages"
    photo?: Image
    titreFiche: string
    prixFiche: string
    recherche: string
    adresseResultat: string
    titreResultat: string
    texteResultat: string
    expediteur: string
    message1: string
    message2: string
    message3: string
    confirmation: string
    fond: string
    sombre: string
    accent: string
    vert: string
    lien: string
    police: React.CSSProperties
    style?: React.CSSProperties
}

const ETOILES = "★★★★★"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 370
 * @framerIntrinsicHeight 270
 */
export default function BentoVisuel(props: Props) {
    const {
        visuel = "fiche",
        photo,
        titreFiche = "Chez Germaine, Lourdes",
        prixFiche = "à partir de 65 € la nuit",
        recherche = "chambre d'hôtes lourdes",
        adresseResultat = "bnbatlantic.com › lourdes",
        titreResultat = "Chez Germaine, chambre d'hôtes à Lourdes",
        texteResultat = "Accueil chaleureux à deux pas du sanctuaire. Contact direct avec l'hôte…",
        expediteur = "Claire, Bordeaux",
        message1 = "Bonjour Germaine, auriez-vous une chambre du 14 au 16 novembre ?",
        message2 = "Bonjour Claire, oui, la chambre bleue est libre. Petit-déjeuner compris.",
        message3 = "Parfait, je réserve !",
        confirmation = "✓ Réservé en direct · 0 € de commission",
        fond = "#F6F3EC",
        sombre = "#0E2140",
        accent = "#F4B73B",
        vert = "#2F8F5B",
        lien = "#1A4FC4",
        police = {},
    } = props

    const racine = React.useRef<HTMLDivElement>(null)
    const [actif, setActif] = React.useState(false)
    React.useEffect(() => {
        const el = racine.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const obs = new IntersectionObserver(([e]) => setActif(e.isIntersecting), { threshold: 0.2 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Classe propre à chaque instance : plusieurs visuels sur la page ne partagent pas leurs styles.
    const id = "bv" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
    const a = actif ? ".actif" : ".jamais"

    const css = `
.${id} { position: relative; width: 100%; height: 100%; background: ${fond}; border-radius: 14px; overflow: hidden; color: ${sombre}; }
.${id} * { box-sizing: border-box; }
.${id} .etoiles { color: ${accent}; letter-spacing: 1px; }
.${id} .pastille { display: inline-flex; align-items: center; font-size: 12px; font-weight: 500; background: #E6F3EC; color: ${vert}; border-radius: 99px; padding: 3px 9px; white-space: nowrap; }

.${id} .fiche { position: absolute; left: 50%; top: 50%; width: 250px; max-width: calc(100% - 32px); transform: translate(-50%, -50%); background: #fff; border-radius: 14px; padding: 7px; box-shadow: 0 14px 40px rgba(14,33,64,.12); }
.${id} .fiche .photo { height: 112px; border-radius: 9px; overflow: hidden; background: #E9E4D8; }
.${id} .fiche .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.${id} .fiche .l { height: 9px; border-radius: 5px; background: #EDE8DD; margin: 9px 6px 0; transform-origin: left; }
.${id} .fiche .titre { font-size: 14px; font-weight: 600; margin: 10px 6px 0; min-height: 21px; white-space: nowrap; overflow: hidden; }
.${id} .fiche .titre span { display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; border-right: 2px solid ${sombre}; max-width: 100%; }
.${id} .fiche .bas { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 10px 6px 4px; font-size: 12px; opacity: .66; }
.${id}${a} .fiche .photo { animation: ${id}photo 7s infinite; }
.${id}${a} .fiche .titre span { animation: ${id}tape 7s steps(24) infinite, ${id}curseur .7s step-end infinite; }
.${id}${a} .fiche .l { animation: ${id}ligne 7s infinite; }
.${id}${a} .fiche .l2 { animation-delay: .15s; }
.${id}${a} .fiche .bas { animation: ${id}apparait 7s infinite; }
@keyframes ${id}photo { 0% { opacity: 0; transform: scale(.94); } 8%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }
@keyframes ${id}tape { 0%, 12% { width: 0; } 38%, 92% { width: 196px; } 100% { width: 0; } }
@keyframes ${id}curseur { 50% { border-color: transparent; } }
@keyframes ${id}ligne { 0%, 40% { transform: scaleX(0); } 52%, 92% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
@keyframes ${id}apparait { 0%, 55% { opacity: 0; transform: translateY(6px); } 64%, 92% { opacity: .66; transform: none; } 100% { opacity: 0; } }

.${id} .google { position: absolute; inset: 22px 18px; }
.${id} .barre { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 99px; padding: 11px 16px; font-size: 13.5px; box-shadow: 0 6px 20px rgba(14,33,64,.08); }
.${id} .barre .req { overflow: hidden; white-space: nowrap; border-right: 2px solid ${sombre}; }
.${id} .res { background: #fff; border-radius: 12px; padding: 12px 14px; margin-top: 10px; font-size: 12px; line-height: 1.4; }
.${id} .res .url { opacity: .66; font-size: 11px; }
.${id} .res b { color: ${lien}; font-weight: 500; font-size: 14px; display: block; margin: 2px 0; }
.${id} .res.nous { box-shadow: 0 0 0 2px ${accent}; }
.${id} .res.autre { filter: grayscale(1); opacity: .55; }
.${id}${a} .barre .req { animation: ${id}tapeG 8s steps(30) infinite, ${id}curseur .7s step-end infinite; }
.${id}${a} .res.nous { animation: ${id}res 8s infinite; }
.${id}${a} .res.autre { animation: ${id}resAutre 8s infinite; }
@keyframes ${id}tapeG { 0%, 6% { width: 0; } 34%, 94% { width: 196px; } 100% { width: 0; } }
@keyframes ${id}res { 0%, 40% { opacity: 0; transform: translateY(10px); } 48%, 94% { opacity: 1; transform: none; } 100% { opacity: 0; } }
@keyframes ${id}resAutre { 0%, 46% { opacity: 0; transform: translateY(10px); } 54%, 94% { opacity: .55; transform: none; } 100% { opacity: 0; } }

.${id} .messages { position: absolute; inset: 20px 18px; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; }
.${id} .bulle { max-width: 84%; padding: 10px 13px; border-radius: 16px; font-size: 13px; line-height: 1.4; }
.${id} .bulle.eux { background: #fff; border-bottom-left-radius: 5px; box-shadow: 0 4px 14px rgba(14,33,64,.06); }
.${id} .bulle.nous { align-self: flex-end; background: ${sombre}; color: #fff; border-bottom-right-radius: 5px; }
.${id} .bulle small { display: block; font-size: 11px; opacity: .6; margin-bottom: 2px; }
.${id} .recu { align-self: center; }
.${id}${a} .b1 { animation: ${id}b1 9s infinite; }
.${id}${a} .b2 { animation: ${id}b2 9s infinite; }
.${id}${a} .b3 { animation: ${id}b3 9s infinite; }
.${id}${a} .recu { animation: ${id}b4 9s infinite; }
@keyframes ${id}b1 { 0%, 4% { opacity: 0; transform: translateY(12px) scale(.96); } 10%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }
@keyframes ${id}b2 { 0%, 24% { opacity: 0; transform: translateY(12px) scale(.96); } 30%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }
@keyframes ${id}b3 { 0%, 44% { opacity: 0; transform: translateY(12px) scale(.96); } 50%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }
@keyframes ${id}b4 { 0%, 62% { opacity: 0; transform: scale(.9); } 68%, 92% { opacity: 1; transform: none; } 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .${id} *, .${id} *::before { animation: none !important; }
}
`

    // Hors écran et au prérendu, chaque visuel montre son état final, complet et lisible.
    let ecran: React.ReactNode
    if (visuel === "google") {
        ecran = (
            <div className="google">
                <div className="barre">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <span className="req">{recherche}</span>
                </div>
                <div className="res nous">
                    <span className="url">{adresseResultat}</span>
                    <b>{titreResultat}</b>
                    {texteResultat}
                </div>
                <div className="res autre">
                    <span className="url">plateforme.com › lourdes</span>
                    <b>Hébergements à Lourdes</b>1 240 logements disponibles…
                </div>
            </div>
        )
    } else if (visuel === "messages") {
        ecran = (
            <div className="messages">
                <div className="bulle eux b1">
                    <small>{expediteur}</small>
                    {message1}
                </div>
                <div className="bulle nous b2">{message2}</div>
                <div className="bulle eux b3">
                    <small>{expediteur}</small>
                    {message3}
                </div>
                <div className="recu">
                    <span className="pastille">{confirmation}</span>
                </div>
            </div>
        )
    } else {
        ecran = (
            <div className="fiche">
                <div className="photo">{photo?.src && <img src={photo.src} srcSet={photo.srcSet} alt={photo.alt ?? ""} />}</div>
                <div className="titre">
                    <span>{titreFiche}</span>
                </div>
                <div className="l" />
                <div className="l l2" style={{ width: "62%" }} />
                <div className="bas">
                    <span className="etoiles">{ETOILES}</span>
                    <span>{prixFiche}</span>
                </div>
            </div>
        )
    }

    return (
        <div ref={racine} className={`${id}${actif ? " actif" : ""}`} style={{ ...police, ...props.style }}>
            <style>{css}</style>
            {ecran}
        </div>
    )
}

addPropertyControls(BentoVisuel, {
    visuel: {
        type: ControlType.Enum,
        title: "Visuel",
        options: ["fiche", "google", "messages"],
        optionTitles: ["Fiche", "Recherche Google", "Messages"],
        defaultValue: "fiche",
    },
    photo: { type: ControlType.ResponsiveImage, title: "Photo", hidden: (p: Props) => p.visuel !== "fiche" },
    titreFiche: { type: ControlType.String, title: "Titre fiche", defaultValue: "Chez Germaine, Lourdes", hidden: (p: Props) => p.visuel !== "fiche" },
    prixFiche: { type: ControlType.String, title: "Prix fiche", defaultValue: "à partir de 65 € la nuit", hidden: (p: Props) => p.visuel !== "fiche" },
    recherche: { type: ControlType.String, title: "Recherche", defaultValue: "chambre d'hôtes lourdes", hidden: (p: Props) => p.visuel !== "google" },
    adresseResultat: { type: ControlType.String, title: "Adresse", defaultValue: "bnbatlantic.com › lourdes", hidden: (p: Props) => p.visuel !== "google" },
    titreResultat: { type: ControlType.String, title: "Titre résultat", defaultValue: "Chez Germaine, chambre d'hôtes à Lourdes", hidden: (p: Props) => p.visuel !== "google" },
    texteResultat: {
        type: ControlType.String,
        title: "Texte résultat",
        displayTextArea: true,
        defaultValue: "Accueil chaleureux à deux pas du sanctuaire. Contact direct avec l'hôte…",
        hidden: (p: Props) => p.visuel !== "google",
    },
    expediteur: { type: ControlType.String, title: "Expéditeur", defaultValue: "Claire, Bordeaux", hidden: (p: Props) => p.visuel !== "messages" },
    message1: { type: ControlType.String, title: "Message 1", displayTextArea: true, defaultValue: "Bonjour Germaine, auriez-vous une chambre du 14 au 16 novembre ?", hidden: (p: Props) => p.visuel !== "messages" },
    message2: { type: ControlType.String, title: "Réponse", displayTextArea: true, defaultValue: "Bonjour Claire, oui, la chambre bleue est libre. Petit-déjeuner compris.", hidden: (p: Props) => p.visuel !== "messages" },
    message3: { type: ControlType.String, title: "Message 2", defaultValue: "Parfait, je réserve !", hidden: (p: Props) => p.visuel !== "messages" },
    confirmation: { type: ControlType.String, title: "Confirmation", defaultValue: "✓ Réservé en direct · 0 € de commission", hidden: (p: Props) => p.visuel !== "messages" },
    fond: { type: ControlType.Color, title: "Fond", defaultValue: "#F6F3EC" },
    sombre: { type: ControlType.Color, title: "Sombre", defaultValue: "#0E2140" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F4B73B" },
    vert: { type: ControlType.Color, title: "Vert", defaultValue: "#2F8F5B" },
    lien: { type: ControlType.Color, title: "Lien", defaultValue: "#1A4FC4" },
    police: { type: ControlType.Font, title: "Police", controls: "extended", defaultFontType: "sans-serif" },
})
