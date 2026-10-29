// Frise des 5 étapes de la page d'inscription BnbAtlantic : 5 pastilles reliées par un trait,
// coche verte, numéro, nom, phrase et badge d'état. L'étape active passe de l'une à l'autre
// toutes les 3,2 s (foncée avec halo), en CSS seul. Sous 760 px de large, la frise devient
// verticale avec le trait à gauche. Le titre de la section reste en natif dans Framer.
// Composant code Framer, un seul fichier (Assets > Code).
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Icone = "envoi" | "appel" | "plume" | "globe" | "message"

type Props = {
    titre1: string
    texte1: string
    badge1: string
    titre2: string
    texte2: string
    badge2: string
    titre3: string
    texte3: string
    badge3: string
    titre4: string
    texte4: string
    badge4: string
    titre5: string
    texte5: string
    badge5: string
    duree: number
    sombre: string
    inactif: string
    trait: string
    halo: string
    vert: string
    texte: string
    texteDiscret: string
    policeTitre: React.CSSProperties
    policeTexte: React.CSSProperties
    style?: React.CSSProperties
}

const ICONES: Icone[] = ["envoi", "appel", "plume", "globe", "message"]

// Tracés simples au trait, 24 × 24.
function Pictogramme({ nom }: { nom: Icone }) {
    const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            {nom === "envoi" && <path {...p} d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />}
            {nom === "appel" && <path {...p} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />}
            {nom === "plume" && <path {...p} d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />}
            {nom === "globe" && (
                <g {...p}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </g>
            )}
            {nom === "message" && <path {...p} d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12Z" />}
        </svg>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 */
export default function FriseEtapes(props: Props) {
    const {
        titre1 = "Vous remplissez le formulaire",
        texte1 = "Deux minutes pour présenter votre maison.",
        badge1 = "2 minutes",
        titre2 = "On vous rappelle",
        texte2 = "On fait connaissance et on note ce qui rend votre maison unique.",
        badge2 = "Sans engagement",
        titre3 = "On rédige votre fiche",
        texte3 = "Description, photos, équipements et un article sur votre région.",
        badge3 = "Écrite pour vous",
        titre4 = "Votre fiche est en ligne",
        texte4 = "Visible sur BnbAtlantic et pensée pour les recherches Google.",
        badge4 = "En ligne",
        titre5 = "Les voyageurs vous écrivent",
        texte5 = "Ils vous contactent en direct, vous gardez le prix de la nuit.",
        badge5 = "0 % de commission",
        duree = 3.2,
        sombre = "#0E2140",
        inactif = "#56637A",
        trait = "#16305A",
        halo = "rgba(244, 183, 59, 0.45)",
        vert = "#2F8F5B",
        texte = "#0E2140",
        texteDiscret = "rgba(14, 33, 64, 0.66)",
        policeTitre = {},
        policeTexte = {},
    } = props

    const etapes = [
        [titre1, texte1, badge1],
        [titre2, texte2, badge2],
        [titre3, texte3, badge3],
        [titre4, texte4, badge4],
        [titre5, texte5, badge5],
    ]

    const id = "fe" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
    const cycle = duree * 5
    // Chaque étape est active pendant un cinquième du cycle ; la montée et la descente durent 0,45 s.
    const rampe = Math.min((0.45 / cycle) * 100, 4)
    const fin = 20

    const css = `
.${id} { container-type: inline-size; width: 100%; color: ${texte}; }
.${id} * { box-sizing: border-box; }
.${id} .rangee { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.${id} .trait { position: absolute; top: 36px; left: 10%; right: 10%; height: 2px; background: ${trait}; opacity: .35; border-radius: 2px; overflow: hidden; }
.${id} .eclat { position: absolute; top: 0; left: 0; width: 18%; height: 100%; background: linear-gradient(90deg, transparent, ${trait}, transparent); animation: ${id}eclat ${cycle}s linear infinite; }
.${id} .etape { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.${id} .tuile { position: relative; z-index: 1; width: 72px; height: 72px; border-radius: 20px; display: grid; place-items: center; color: #fff; background: ${inactif}; animation: ${id}actif ${cycle}s infinite; }
.${id} .coche { position: absolute; top: -7px; right: -7px; width: 22px; height: 22px; border-radius: 50%; background: ${vert}; border: 2px solid #fff; display: grid; place-items: center; }
.${id} .corps { display: flex; flex-direction: column; align-items: center; }
.${id} .num { font-size: 12px; margin-top: 18px; color: ${texteDiscret}; }
.${id} .nom { font-size: 19px; line-height: 1.25; margin-top: 4px; letter-spacing: -0.01em; }
.${id} .phrase { font-size: 14px; line-height: 1.45; margin-top: 6px; color: ${texteDiscret}; max-width: 230px; }
.${id} .badge { display: inline-flex; align-items: center; gap: 5px; margin-top: 12px; font-size: 12px; font-weight: 600; color: ${vert}; background: #E6F3EC; border-radius: 99px; padding: 4px 10px; white-space: nowrap; }
@keyframes ${id}actif {
  0% { background: ${inactif}; box-shadow: 0 0 0 0 transparent; }
  ${rampe}% { background: ${sombre}; box-shadow: 0 0 0 6px ${halo}, 0 14px 30px rgba(14,33,64,.28); }
  ${fin - rampe}% { background: ${sombre}; box-shadow: 0 0 0 6px ${halo}, 0 14px 30px rgba(14,33,64,.28); }
  ${fin}%, 100% { background: ${inactif}; box-shadow: 0 0 0 0 transparent; }
}
@keyframes ${id}eclat { from { transform: translateX(-100%); } to { transform: translateX(555%); } }
@container (max-width: 760px) {
  .${id} .rangee { grid-template-columns: 1fr; gap: 28px; }
  .${id} .trait { top: 36px; bottom: 36px; left: 35px; right: auto; width: 2px; height: auto; }
  .${id} .eclat { width: 100%; height: 18%; background: linear-gradient(180deg, transparent, ${trait}, transparent); animation-name: ${id}eclatV; }
  .${id} .etape { flex-direction: row; align-items: flex-start; text-align: left; gap: 18px; }
  .${id} .tuile { flex: none; }
  .${id} .corps { align-items: flex-start; }
  .${id} .num { margin-top: 2px; }
  .${id} .phrase { max-width: none; }
}
@keyframes ${id}eclatV { from { transform: translateY(-100%); } to { transform: translateY(555%); } }
@media (prefers-reduced-motion: reduce) {
  .${id} .tuile { animation: none; background: ${sombre}; }
  .${id} .eclat { animation: none; display: none; }
}
`

    return (
        <div className={id} style={{ ...policeTexte, ...props.style }}>
            <style>{css}</style>
            <div style={{ position: "relative" }}>
            <span className="trait" aria-hidden="true">
                <span className="eclat" />
            </span>
            <ol className="rangee" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {etapes.map(([nom, phrase, badge], i) => (
                    <li className="etape" key={i}>
                        <div className="tuile" style={{ animationDelay: `${i * duree}s` }}>
                            <Pictogramme nom={ICONES[i]} />
                            <span className="coche" aria-hidden="true">
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8.5l3 3 7-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                        <div className="corps">
                            <span className="num">Étape {String(i + 1).padStart(2, "0")}</span>
                            <span className="nom" style={policeTitre}>
                                {nom}
                            </span>
                            <span className="phrase">{phrase}</span>
                            <span className="badge">✓ {badge}</span>
                        </div>
                    </li>
                ))}
            </ol>
            </div>
        </div>
    )
}

const champs = (n: number, titre: string, texte: string, badge: string) => ({
    [`titre${n}`]: { type: ControlType.String, title: `Étape ${n}`, defaultValue: titre },
    [`texte${n}`]: { type: ControlType.String, title: `Phrase ${n}`, displayTextArea: true, defaultValue: texte },
    [`badge${n}`]: { type: ControlType.String, title: `Badge ${n}`, defaultValue: badge },
})

addPropertyControls(FriseEtapes, {
    ...champs(1, "Vous remplissez le formulaire", "Deux minutes pour présenter votre maison.", "2 minutes"),
    ...champs(2, "On vous rappelle", "On fait connaissance et on note ce qui rend votre maison unique.", "Sans engagement"),
    ...champs(3, "On rédige votre fiche", "Description, photos, équipements et un article sur votre région.", "Écrite pour vous"),
    ...champs(4, "Votre fiche est en ligne", "Visible sur BnbAtlantic et pensée pour les recherches Google.", "En ligne"),
    ...champs(5, "Les voyageurs vous écrivent", "Ils vous contactent en direct, vous gardez le prix de la nuit.", "0 % de commission"),
    duree: { type: ControlType.Number, title: "Durée par étape", min: 1, max: 10, step: 0.1, unit: "s", defaultValue: 3.2 },
    sombre: { type: ControlType.Color, title: "Active", defaultValue: "#0E2140" },
    inactif: { type: ControlType.Color, title: "Inactive", defaultValue: "#56637A" },
    trait: { type: ControlType.Color, title: "Trait", defaultValue: "#16305A" },
    halo: { type: ControlType.Color, title: "Halo", defaultValue: "rgba(244, 183, 59, 0.45)" },
    vert: { type: ControlType.Color, title: "Vert", defaultValue: "#2F8F5B" },
    texte: { type: ControlType.Color, title: "Texte", defaultValue: "#0E2140" },
    texteDiscret: { type: ControlType.Color, title: "Texte discret", defaultValue: "rgba(14, 33, 64, 0.66)" },
    policeTitre: { type: ControlType.Font, title: "Police titres", controls: "extended", defaultFontType: "sans-serif" },
    policeTexte: { type: ControlType.Font, title: "Police texte", controls: "extended", defaultFontType: "sans-serif" },
})
