// Cartes « ce qu'on entend chez les propriétaires » qui tournent lentement en ellipse autour
// du titre de la section BnbAtlantic, en restant droites. Le titre reste en natif dans Framer,
// posé au centre au-dessus de ce composant. Sous 900 px de large, ou quand le visiteur demande
// moins d'animations, les 4 premières cartes restent fixes, 2 au-dessus et 2 sous le titre.
// Composant code Framer, un seul fichier (Assets > Code).
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Image = { src: string; srcSet?: string; alt?: string }

type Props = {
    texte1: string
    image1?: Image
    texte2: string
    image2?: Image
    texte3: string
    image3?: Image
    texte4: string
    image4?: Image
    texte5: string
    image5?: Image
    texte6: string
    image6?: Image
    tour: number
    largeurCarte: number
    fondCarte: string
    texte: string
    police: React.CSSProperties
    style?: React.CSSProperties
}

const HAUTEUR_CARTE = 70

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function OrbiteCartes(props: Props) {
    const {
        texte1 = "15 % de commission sur chaque nuit, ça finit par peser",
        texte2 = "Je ne sais pas écrire une annonce qui donne envie",
        texte3 = "Mes habitués reviennent, les nouveaux voyageurs ne me trouvent pas",
        texte4 = "J’aimerais parler aux voyageurs avant leur arrivée",
        texte5 = "Les plateformes changent leurs règles sans prévenir",
        texte6 = "Mes photos ne rendent pas justice à la maison",
        tour = 90,
        largeurCarte = 320,
        fondCarte = "#EAE2D3",
        texte = "#0E2140",
        police = {},
    } = props
    const cartes = [
        [texte1, props.image1],
        [texte2, props.image2],
        [texte3, props.image3],
        [texte4, props.image4],
        [texte5, props.image5],
        [texte6, props.image6],
    ] as const

    const cadre = React.useRef<HTMLDivElement>(null)
    const refs = React.useRef<(HTMLDivElement | null)[]>([])
    const [taille, setTaille] = React.useState({ l: 1200, h: 800 })
    const [mobile, setMobile] = React.useState(false)

    React.useEffect(() => {
        const el = cadre.current
        if (!el || typeof ResizeObserver === "undefined") return
        const obs = new ResizeObserver(([e]) => {
            const { width, height } = e.contentRect
            setTaille({ l: width, h: height })
            setMobile(width < 900)
        })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Position d'une carte sur l'ellipse pour un angle donné (centre de la carte).
    const rx = Math.max(taille.l / 2 - largeurCarte / 2, 0)
    const ry = Math.max(taille.h / 2 - HAUTEUR_CARTE / 2 - 8, 0)
    const placer = (i: number, angle: number) => {
        const a = angle + (i / cartes.length) * Math.PI * 2
        return `translate(${taille.l / 2 + rx * Math.cos(a) - largeurCarte / 2}px, ${taille.h / 2 + ry * Math.sin(a) - HAUTEUR_CARTE / 2}px)`
    }

    // Départ décalé pour que les cartes ne coupent pas le titre à l'arrivée sur la section.
    const DEPART = -Math.PI / 2 + Math.PI / 6

    React.useEffect(() => {
        if (mobile || typeof window === "undefined") return
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let angle = DEPART
        let visible = false
        let avant = 0
        let image = 0
        const dessiner = () => refs.current.forEach((el, i) => el && (el.style.transform = placer(i, angle)))
        dessiner()
        if (reduit) return
        const pas = (t: number) => {
            if (avant) angle += ((t - avant) / 1000) * ((Math.PI * 2) / tour)
            avant = t
            dessiner()
            image = requestAnimationFrame(pas)
        }
        const obs = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            cancelAnimationFrame(image)
            avant = 0
            if (visible) image = requestAnimationFrame(pas)
        })
        if (cadre.current) obs.observe(cadre.current)
        return () => {
            obs.disconnect()
            cancelAnimationFrame(image)
        }
    }, [mobile, taille.l, taille.h, tour, largeurCarte])

    // Mobile et tablette : 4 cartes fixes, 2 en haut, 2 en bas, légèrement décalées.
    const fixe = (i: number): React.CSSProperties => {
        const l = Math.min(largeurCarte, taille.l - 30)
        const gauche = i % 2 === 0 ? 0 : taille.l - l
        const haut = i < 2 ? i * (HAUTEUR_CARTE + 26) : taille.h - (4 - i) * (HAUTEUR_CARTE + 26) + 26
        return { width: l, transform: `translate(${gauche}px, ${haut}px)` }
    }

    return (
        <div ref={cadre} aria-hidden="true" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...props.style }}>
            {cartes.map(([txt, img], i) => {
                if (mobile && i > 3) return null
                return (
                    <div
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: largeurCarte,
                            height: HAUTEUR_CARTE,
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            paddingRight: 18,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: fondCarte,
                            willChange: mobile ? undefined : "transform",
                            transform: placer(i, DEPART),
                            ...(mobile ? fixe(i) : {}),
                        }}
                    >
                        <div style={{ width: HAUTEUR_CARTE, height: HAUTEUR_CARTE, flex: "none", background: "#D9D0BF" }}>
                            {img?.src && <img src={img.src} srcSet={img.srcSet} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                        </div>
                        <span style={{ fontSize: 15, lineHeight: 1.35, color: texte, ...police }}>{txt}</span>
                    </div>
                )
            })}
        </div>
    )
}

const carte = (n: number, texte: string) => ({
    [`texte${n}`]: { type: ControlType.String, title: `Carte ${n}`, displayTextArea: true, defaultValue: texte },
    [`image${n}`]: { type: ControlType.ResponsiveImage, title: `Photo ${n}` },
})

addPropertyControls(OrbiteCartes, {
    ...carte(1, "15 % de commission sur chaque nuit, ça finit par peser"),
    ...carte(2, "Je ne sais pas écrire une annonce qui donne envie"),
    ...carte(3, "Mes habitués reviennent, les nouveaux voyageurs ne me trouvent pas"),
    ...carte(4, "J’aimerais parler aux voyageurs avant leur arrivée"),
    ...carte(5, "Les plateformes changent leurs règles sans prévenir"),
    ...carte(6, "Mes photos ne rendent pas justice à la maison"),
    tour: { type: ControlType.Number, title: "Un tour en", min: 20, max: 300, step: 5, unit: "s", defaultValue: 90 },
    largeurCarte: { type: ControlType.Number, title: "Largeur carte", min: 220, max: 420, step: 10, unit: "px", defaultValue: 320 },
    fondCarte: { type: ControlType.Color, title: "Fond carte", defaultValue: "#EAE2D3" },
    texte: { type: ControlType.Color, title: "Texte", defaultValue: "#0E2140" },
    police: { type: ControlType.Font, title: "Police", controls: "extended", defaultFontType: "sans-serif" },
})
