// Calculateur « Ce que vous gardez chaque année » de la page d'inscription BnbAtlantic :
// trois curseurs (prix de la nuit, nuits louées, commission d'une plateforme), le gain annuel
// en grand qui défile vers sa nouvelle valeur, et deux barres plateforme / en direct.
// Composant code Framer, un seul fichier (Assets > Code). L'en-tête et le fond de la section
// restent en natif dans Framer, ce composant ne contient que les deux panneaux.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    prixDepart: number
    prixMin: number
    prixMax: number
    nuitsDepart: number
    nuitsMin: number
    nuitsMax: number
    commissionDepart: number
    commissionMin: number
    commissionMax: number
    libellePrix: string
    libelleNuits: string
    libelleCommission: string
    noteCommission: string
    sousChiffre: string
    libellePlateforme: string
    libelleDirect: string
    panneau: string
    piste: string
    accent: string
    texte: string
    texteDiscret: string
    policeChiffres: React.CSSProperties
    policeTexte: React.CSSProperties
    style?: React.CSSProperties
}

// Espaces fines de toLocaleString remplacées par des espaces insécables classiques :
// certaines polices de Framer n'ont pas le glyphe U+202F.
const euros = (n: number) => Math.round(n).toLocaleString("fr-FR").replace(/ /g, " ") + " €"

const pourcent = (v: number, min: number, max: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0)

// Le grand chiffre glisse de sa valeur affichée vers la nouvelle en 450 ms.
// Valeur juste dès le premier rendu, pour le prérendu de Framer.
function useChiffreAnime(cible: number): number {
    const [affiche, setAffiche] = React.useState(cible)
    const courant = React.useRef(cible)
    React.useEffect(() => {
        const reduit = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduit) {
            courant.current = cible
            setAffiche(cible)
            return
        }
        const depart = courant.current
        const debut = performance.now()
        let image = 0
        const pas = (t: number) => {
            const k = Math.min((t - debut) / 450, 1)
            courant.current = depart + (cible - depart) * (1 - Math.pow(1 - k, 3))
            setAffiche(courant.current)
            if (k < 1) image = requestAnimationFrame(pas)
        }
        image = requestAnimationFrame(pas)
        return () => cancelAnimationFrame(image)
    }, [cible])
    return affiche
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 */
export default function CalculCommission(props: Props) {
    const {
        prixDepart = 70,
        prixMin = 40,
        prixMax = 250,
        nuitsDepart = 120,
        nuitsMin = 10,
        nuitsMax = 300,
        commissionDepart = 15,
        commissionMin = 3,
        commissionMax = 25,
        libellePrix = "Prix d'une nuit",
        libelleNuits = "Nuits louées par an",
        libelleCommission = "Commission d'une plateforme",
        noteCommission = "Réglez le taux de votre plateforme actuelle.",
        sousChiffre = "gardés par an en louant en direct",
        libellePlateforme = "Via une plateforme",
        libelleDirect = "En direct avec BnbAtlantic",
        panneau = "#16305A",
        piste = "rgba(255, 255, 255, 0.14)",
        accent = "#F4B73B",
        texte = "#FFFFFF",
        texteDiscret = "rgba(255, 255, 255, 0.7)",
        policeChiffres = {},
        policeTexte = {},
    } = props

    const [prix, setPrix] = React.useState(prixDepart)
    const [nuits, setNuits] = React.useState(nuitsDepart)
    const [commission, setCommission] = React.useState(commissionDepart)

    // Sur le canevas, un changement des valeurs de départ dans le panneau se voit tout de suite.
    React.useEffect(() => setPrix(prixDepart), [prixDepart])
    React.useEffect(() => setNuits(nuitsDepart), [nuitsDepart])
    React.useEffect(() => setCommission(commissionDepart), [commissionDepart])

    const direct = prix * nuits
    const plateforme = direct * (1 - commission / 100)
    const gain = useChiffreAnime(direct - plateforme)

    // Classe propre à chaque instance : deux calculateurs sur une page ne partagent pas leurs styles.
    const id = "kc" + React.useId().replace(/[^a-zA-Z0-9]/g, "")

    // Les curseurs et la mise en colonne demandent du CSS (pseudo-éléments, requête de conteneur) :
    // la mise en page suit la largeur du composant, pas les points de rupture de Framer.
    const css = `
.${id} { container-type: inline-size; width: 100%; }
.${id} .grille { display: grid; grid-template-columns: 1fr 1.1fr; gap: 18px; }
.${id} .panneau { background: ${panneau}; border-radius: 20px; padding: 34px; }
.${id} .resultat { display: flex; flex-direction: column; justify-content: space-between; gap: 28px; }
.${id} input[type=range] { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 6px; margin: 0; padding: 0; border: 0; border-radius: 6px; outline: none; cursor: pointer;
  background: linear-gradient(90deg, ${accent} var(--p), ${piste} var(--p)); }
.${id} input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 5px solid ${accent}; box-sizing: border-box; cursor: grab; }
.${id} input[type=range]::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 5px solid ${accent}; box-sizing: border-box; cursor: grab; }
.${id} input[type=range]:focus-visible { box-shadow: 0 0 0 3px ${accent}55; }
.${id} .barre i { display: block; height: 100%; border-radius: 12px; transition: width .5s cubic-bezier(.2,.8,.2,1); }
@container (max-width: 760px) {
  .${id} .grille { grid-template-columns: 1fr; }
  .${id} .panneau { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) { .${id} .barre i { transition: none; } }
`

    const curseur = (
        libelle: string,
        valeur: number,
        affichage: string,
        min: number,
        max: number,
        pas: number,
        changer: (v: number) => void,
        note?: string
    ) => (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
                <label style={{ ...policeTexte, fontSize: 15, color: texteDiscret }}>{libelle}</label>
                <output style={{ ...policeChiffres, fontSize: 34, lineHeight: 1, letterSpacing: "-0.02em", color: texte, whiteSpace: "nowrap" }}>
                    {affichage}
                </output>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={pas}
                value={valeur}
                aria-label={libelle}
                onChange={(e) => changer(Number(e.target.value))}
                style={{ ["--p" as string]: pourcent(valeur, min, max) + "%" }}
            />
            {note && <div style={{ ...policeTexte, fontSize: 12, color: texteDiscret, opacity: 0.75, marginTop: 8 }}>{note}</div>}
        </div>
    )

    const barre = (libelle: string, montant: number, largeur: number, couleur: string) => (
        <div>
            <div style={{ ...policeTexte, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5, color: texteDiscret, marginBottom: 6 }}>
                <span>{libelle}</span>
                <b style={{ color: texte, fontWeight: 500 }}>{euros(montant)}</b>
            </div>
            <div className="barre" style={{ height: 12, borderRadius: 12, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <i style={{ width: largeur + "%", background: couleur }} />
            </div>
        </div>
    )

    return (
        <div className={id} style={props.style}>
            <style>{css}</style>
            <div className="grille">
                <div className="panneau" style={{ display: "grid", gap: 30 }}>
                    {curseur(libellePrix, prix, prix + " €", prixMin, prixMax, 5, setPrix)}
                    {curseur(libelleNuits, nuits, String(nuits), nuitsMin, nuitsMax, 5, setNuits)}
                    {curseur(libelleCommission, commission, commission + " %", commissionMin, commissionMax, 1, setCommission, noteCommission)}
                </div>
                <div className="panneau resultat">
                    <div>
                        <div
                            aria-live="polite"
                            style={{ ...policeChiffres, fontSize: "clamp(64px, 9cqi, 116px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: accent, whiteSpace: "nowrap" }}
                        >
                            {euros(gain)}
                        </div>
                        <div style={{ ...policeTexte, fontSize: 16, color: texteDiscret, marginTop: 10 }}>{sousChiffre}</div>
                    </div>
                    <div style={{ display: "grid", gap: 14 }}>
                        {barre(libellePlateforme, plateforme, 100 - commission, "rgba(255,255,255,0.35)")}
                        {barre(libelleDirect, direct, 100, accent)}
                    </div>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(CalculCommission, {
    prixDepart: { type: ControlType.Number, title: "Prix de départ", min: 10, max: 1000, step: 5, unit: "€", defaultValue: 70 },
    prixMin: { type: ControlType.Number, title: "Prix min", min: 0, max: 1000, step: 5, unit: "€", defaultValue: 40 },
    prixMax: { type: ControlType.Number, title: "Prix max", min: 10, max: 2000, step: 5, unit: "€", defaultValue: 250 },
    nuitsDepart: { type: ControlType.Number, title: "Nuits de départ", min: 1, max: 365, step: 5, defaultValue: 120 },
    nuitsMin: { type: ControlType.Number, title: "Nuits min", min: 0, max: 365, step: 5, defaultValue: 10 },
    nuitsMax: { type: ControlType.Number, title: "Nuits max", min: 10, max: 365, step: 5, defaultValue: 300 },
    commissionDepart: { type: ControlType.Number, title: "Commission", min: 0, max: 50, step: 1, unit: "%", defaultValue: 15 },
    commissionMin: { type: ControlType.Number, title: "Commission min", min: 0, max: 50, step: 1, unit: "%", defaultValue: 3 },
    commissionMax: { type: ControlType.Number, title: "Commission max", min: 1, max: 50, step: 1, unit: "%", defaultValue: 25 },
    libellePrix: { type: ControlType.String, title: "Libellé prix", defaultValue: "Prix d'une nuit" },
    libelleNuits: { type: ControlType.String, title: "Libellé nuits", defaultValue: "Nuits louées par an" },
    libelleCommission: { type: ControlType.String, title: "Libellé commission", defaultValue: "Commission d'une plateforme" },
    noteCommission: { type: ControlType.String, title: "Note commission", defaultValue: "Réglez le taux de votre plateforme actuelle." },
    sousChiffre: { type: ControlType.String, title: "Sous le chiffre", defaultValue: "gardés par an en louant en direct" },
    libellePlateforme: { type: ControlType.String, title: "Barre plateforme", defaultValue: "Via une plateforme" },
    libelleDirect: { type: ControlType.String, title: "Barre direct", defaultValue: "En direct avec BnbAtlantic" },
    panneau: { type: ControlType.Color, title: "Panneaux", defaultValue: "#16305A" },
    piste: { type: ControlType.Color, title: "Piste", defaultValue: "rgba(255, 255, 255, 0.14)" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#F4B73B" },
    texte: { type: ControlType.Color, title: "Texte", defaultValue: "#FFFFFF" },
    texteDiscret: { type: ControlType.Color, title: "Texte discret", defaultValue: "rgba(255, 255, 255, 0.7)" },
    policeChiffres: { type: ControlType.Font, title: "Police chiffres", controls: "extended", defaultFontType: "serif" },
    policeTexte: { type: ControlType.Font, title: "Police texte", controls: "extended", defaultFontType: "sans-serif" },
})
