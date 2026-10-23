// Etapes au défilement : section collante, ligne de progression, 4 étapes qui entrent
// une à une et images dévoilées par 5 volets. Recréée d'après la section « How we work »
// de tokomoo-fidelora.webflow.io (timeline Webflow relevée le 22/10/2026).
// Composant code Framer, un seul fichier (Assets > Code), ajouté par Claude via @framer/agent.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useReducedMotion,
    MotionValue,
} from "framer-motion"

type Image = { src: string; srcSet?: string; alt?: string }

type Etape = {
    titre: string
    texte: string
    image?: Image
}

// Quatre étapes en champs simples : Framer n'accepte pas une liste d'objets dans les réglages.
type Props = {
    etiquette: string
    titre: string
    titre1: string
    texte1: string
    image1?: Image
    titre2: string
    texte2: string
    image2?: Image
    titre3: string
    texte3: string
    image3?: Image
    titre4: string
    texte4: string
    image4?: Image
    hauteurDefilement: number
    fond: string
    accent: string
    accentClair: string
    ligne: string
    texte: string
    texteDiscret: string
    policeTitre: React.CSSProperties
    policeTexte: React.CSSProperties
    style?: React.CSSProperties
}

// Positions de la timeline Webflow (0 à 1) : chaque étape dure 0,24.
const DEBUTS = [0, 0.26, 0.51, 0.76]
const DUREE = 0.24
const VOLETS = 5
const MOBILE = 810

type Courbe = [number, number, number, number]
const DOUCE: Courbe = [0.25, 0.1, 0.25, 1]
const SORTIE: Courbe = [0.22, 1, 0.36, 1]
const VOLET: Courbe = [0.65, 0, 0.35, 1]

const ETAPES: Etape[] = [
    { titre: "Écouter", texte: "Un appel pour comprendre votre métier, vos clients et ce que le site doit rapporter." },
    { titre: "Concevoir", texte: "La structure, les textes et l'ambiance validés avec vous avant de construire." },
    { titre: "Construire", texte: "Le site monté, rapide sur mobile, prêt pour Google dès la mise en ligne." },
    { titre: "Suivre", texte: "Maintenance et chiffres du mois, pour savoir ce que le site vous apporte." },
]

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function EtapesDefilement(props: Props) {
    const {
        etiquette = "Notre méthode",
        titre = "Quatre étapes, de la première idée au site en ligne.",
        hauteurDefilement = 300,
        fond = "#1C1712",
        accent = "#D44500",
        accentClair = "#FFAA7D",
        ligne = "#525252",
        texte = "#FFFFFF",
        texteDiscret = "#9C9C9C",
        policeTitre = {},
        policeTexte = {},
        style,
    } = props

    const conteneur = React.useRef<HTMLDivElement>(null)
    const [largeur, setLargeur] = React.useState(1440)
    const reduit = useReducedMotion()
    const surCanevas = RenderTarget.current() === RenderTarget.canvas
    const mobile = largeur < MOBILE
    // Sur le canevas ou en animations réduites, tout est affiché à l'état final.
    const fige = surCanevas || !!reduit

    React.useEffect(() => {
        const el = conteneur.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setLargeur(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Webflow : start "30% bottom", end "bottom 120%", scrub 0,8 s.
    const { scrollYProgress } = useScroll({
        target: conteneur,
        offset: ["0.3 1", "1 1.2"],
    })
    const progres = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 32,
        restDelta: 0.0005,
    })
    const ligneX = useTransform(progres, [0, 1], ["-100%", "0%"])

    const champs = props as unknown as Record<string, any>
    const etapes: Etape[] = [1, 2, 3, 4].map((k, i) => ({
        titre: champs[`titre${k}`] ?? ETAPES[i].titre,
        texte: champs[`texte${k}`] ?? ETAPES[i].texte,
        image: champs[`image${k}`],
    }))
    const colonnes = mobile ? 1 : largeur < 1200 ? 2 : 4
    const collant = !mobile && !fige

    return (
        <div
            ref={conteneur}
            style={{
                ...style,
                width: "100%",
                background: fond,
                height: collant ? `${hauteurDefilement}vh` : "auto",
                position: "relative",
            }}
        >
            <div
                style={{
                    position: collant ? "sticky" : "relative",
                    top: 0,
                    height: collant ? "100vh" : "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: mobile ? 24 : "2.5vw",
                    padding: mobile ? "64px 16px" : collant ? "0 2vw" : "105px 2vw",
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >
                <Entete
                    etiquette={etiquette}
                    titre={titre}
                    accentClair={accentClair}
                    texte={texte}
                    policeTitre={policeTitre}
                    policeTexte={policeTexte}
                    mobile={mobile}
                    fige={fige}
                />

                <div style={{ position: "relative" }}>
                    {!mobile && (
                        <div
                            style={{
                                // Posée au milieu des carrés, comme sur l'original.
                                position: "absolute",
                                top: "max(4px, 0.35vw)",
                                left: 0,
                                right: 0,
                                height: 1,
                                background: ligne,
                                overflow: "hidden",
                            }}
                        >
                            <motion.div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: accent,
                                    x: fige ? "0%" : ligneX,
                                }}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${colonnes}, 1fr)`,
                            gap: mobile ? 40 : 16,
                        }}
                    >
                        {etapes.map((etape, i) => (
                            <Carte
                                key={i}
                                index={i}
                                etape={etape}
                                debut={DEBUTS[i]}
                                progres={progres}
                                defile={collant}
                                fige={fige}
                                mobile={mobile}
                                fond={fond}
                                accent={accent}
                                accentClair={accentClair}
                                ligne={ligne}
                                texte={texte}
                                texteDiscret={texteDiscret}
                                policeTitre={policeTitre}
                                policeTexte={policeTexte}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Entete(p: {
    etiquette: string
    titre: string
    accentClair: string
    texte: string
    policeTitre: React.CSSProperties
    policeTexte: React.CSSProperties
    mobile: boolean
    fige: boolean
}) {
    // Webflow : opacité 0 et y -10 % vers l'état normal, 1 s, décalage 0,1 s, une fois.
    const entree = (i: number) =>
        p.fige
            ? {}
            : {
                  initial: { opacity: 0, y: "-10%" },
                  whileInView: { opacity: 1, y: "0%" },
                  viewport: { once: true, amount: 0.3 },
                  transition: { duration: 1, delay: 0.1 + i * 0.1, ease: DOUCE },
              }
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <motion.div
                {...entree(0)}
                style={{ ...p.policeTexte, fontSize: 15, color: p.texte, display: "flex", gap: 6 }}
            >
                <span style={{ color: p.accentClair }}>[</span>
                {p.etiquette}
                <span style={{ color: p.accentClair }}>]</span>
            </motion.div>
            <motion.h2
                {...entree(1)}
                style={{
                    ...p.policeTitre,
                    margin: 0,
                    color: p.texte,
                    fontSize: p.mobile ? 34 : "3vw",
                    lineHeight: p.mobile ? 1.15 : "3.5vw",
                    letterSpacing: p.mobile ? "-0.03em" : "-0.15vw",
                    maxWidth: p.mobile ? "100%" : "50%",
                }}
            >
                {p.titre}
            </motion.h2>
        </div>
    )
}

function Carte(p: {
    index: number
    etape: Etape
    debut: number
    progres: MotionValue<number>
    defile: boolean
    fige: boolean
    mobile: boolean
    fond: string
    accent: string
    accentClair: string
    ligne: string
    texte: string
    texteDiscret: string
    policeTitre: React.CSSProperties
    policeTexte: React.CSSProperties
}) {
    const plage = [p.debut, p.debut + DUREE]
    // Liées au défilement en bureau ; en mobile, la carte joue seule à l'entrée dans l'écran.
    const texteX = useTransform(p.progres, plage, ["-110%", "0%"])
    const voletX = useTransform(p.progres, plage, ["0%", "102%"])
    const point = useTransform(p.progres, (v) =>
        p.index === 0 || v >= p.debut ? p.accent : p.ligne
    )

    const animeTexte = (decalage: number) => {
        if (p.fige) return { style: {} }
        if (p.defile) return { style: { x: texteX } }
        return {
            style: {},
            initial: { x: "-110%" },
            whileInView: { x: "0%" },
            viewport: { once: true, amount: 0.4 },
            transition: { duration: 0.7, delay: decalage, ease: SORTIE },
        }
    }
    const animeVolet = () => {
        if (p.fige) return { style: { x: "102%" } }
        if (p.defile) return { style: { x: voletX } }
        return {
            style: {},
            initial: { x: "0%" },
            whileInView: { x: "102%" },
            viewport: { once: true, amount: 0.4 },
            transition: { duration: 0.8, ease: VOLET },
        }
    }

    const numero = String(p.index + 1).padStart(2, "0")
    const blocTexte = (contenu: React.ReactNode, decalage: number) => {
        const a = animeTexte(decalage)
        return (
            <motion.div {...a} style={{ ...a.style, willChange: p.defile ? "transform" : undefined }}>
                {contenu}
            </motion.div>
        )
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div
                style={{
                    height: p.mobile ? "auto" : "16vw",
                    minHeight: p.mobile ? 0 : 200,
                    display: "flex",
                    flexDirection: "column",
                    gap: p.mobile ? 8 : 12,
                    paddingBottom: p.mobile ? 0 : 16,
                }}
            >
                <motion.div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        width: p.mobile ? 10 : "0.7vw",
                        height: p.mobile ? 10 : "0.7vw",
                        minWidth: 8,
                        minHeight: 8,
                        background: p.fige || !p.defile ? p.accent : point,
                    }}
                />
                {blocTexte(
                    <div style={{ ...p.policeTexte, fontSize: 18, lineHeight: 1.35, color: p.accentClair }}>
                        {numero}
                    </div>,
                    0
                )}
                {blocTexte(
                    <h3
                        style={{
                            ...p.policeTitre,
                            margin: 0,
                            fontSize: p.mobile ? 28 : 36,
                            lineHeight: 1.3,
                            letterSpacing: "-0.05rem",
                            color: p.texte,
                        }}
                    >
                        {p.etape.titre}
                    </h3>,
                    0.06
                )}
                {blocTexte(
                    <div style={{ ...p.policeTexte, fontSize: 16, lineHeight: 1.4, color: p.texteDiscret }}>
                        {p.etape.texte}
                    </div>,
                    0.12
                )}
            </div>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: p.mobile ? 192 : "25rem",
                    display: "flex",
                    background: p.ligne,
                }}
            >
                {p.etape.image?.src && (
                    <img
                        src={p.etape.image.src}
                        srcSet={p.etape.image.srcSet}
                        sizes={p.mobile ? "100vw" : "25vw"}
                        alt={p.etape.image.alt || ""}
                        loading="lazy"
                        decoding="async"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                )}
                {Array.from({ length: VOLETS }).map((_, v) => {
                    const a = animeVolet()
                    return (
                        <div
                            key={v}
                            style={{
                                position: "relative",
                                zIndex: 1,
                                width: `${100 / VOLETS}%`,
                                height: "100%",
                                overflow: "hidden",
                            }}
                        >
                            <motion.div
                                {...a}
                                style={{ ...a.style, width: "100%", height: "100%", background: p.fond }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

addPropertyControls(EtapesDefilement, {
    etiquette: { type: ControlType.String, title: "Étiquette", defaultValue: "Notre méthode" },
    titre: {
        type: ControlType.String,
        title: "Titre",
        displayTextArea: true,
        defaultValue: "Quatre étapes, de la première idée au site en ligne.",
    },
    titre1: { type: ControlType.String, title: "Étape 1", defaultValue: ETAPES[0].titre },
    texte1: {
        type: ControlType.String,
        title: "Texte 1",
        displayTextArea: true,
        defaultValue: ETAPES[0].texte,
    },
    image1: { type: ControlType.ResponsiveImage, title: "Image 1" },
    titre2: { type: ControlType.String, title: "Étape 2", defaultValue: ETAPES[1].titre },
    texte2: {
        type: ControlType.String,
        title: "Texte 2",
        displayTextArea: true,
        defaultValue: ETAPES[1].texte,
    },
    image2: { type: ControlType.ResponsiveImage, title: "Image 2" },
    titre3: { type: ControlType.String, title: "Étape 3", defaultValue: ETAPES[2].titre },
    texte3: {
        type: ControlType.String,
        title: "Texte 3",
        displayTextArea: true,
        defaultValue: ETAPES[2].texte,
    },
    image3: { type: ControlType.ResponsiveImage, title: "Image 3" },
    titre4: { type: ControlType.String, title: "Étape 4", defaultValue: ETAPES[3].titre },
    texte4: {
        type: ControlType.String,
        title: "Texte 4",
        displayTextArea: true,
        defaultValue: ETAPES[3].texte,
    },
    image4: { type: ControlType.ResponsiveImage, title: "Image 4" },
    hauteurDefilement: {
        type: ControlType.Number,
        title: "Défilement",
        min: 150,
        max: 500,
        step: 25,
        unit: "vh",
        defaultValue: 300,
    },
    fond: { type: ControlType.Color, title: "Fond", defaultValue: "#1C1712" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#D44500" },
    accentClair: { type: ControlType.Color, title: "Accent clair", defaultValue: "#FFAA7D" },
    ligne: { type: ControlType.Color, title: "Ligne", defaultValue: "#525252" },
    texte: { type: ControlType.Color, title: "Texte", defaultValue: "#FFFFFF" },
    texteDiscret: { type: ControlType.Color, title: "Texte discret", defaultValue: "#9C9C9C" },
    policeTitre: {
        type: ControlType.Font,
        title: "Police titres",
        controls: "extended",
        defaultFontType: "sans-serif",
    },
    policeTexte: {
        type: ControlType.Font,
        title: "Police texte",
        controls: "extended",
        defaultFontType: "sans-serif",
    },
})
