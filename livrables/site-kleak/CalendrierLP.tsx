// Calendrier Cal.com de la landing page des pubs : transmet a Cal.com le canal et la pub Meta
// d'origine, lus dans l'adresse de la page (ad_id, ad_name, utm_*), pour que le hub rattache le RDV a la pub.
import { useEffect, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

interface CalendrierLPProps {
    lienCal: string
    canal: string
    style?: CSSProperties
}

const PARAMS_PUB = ["ad_id", "ad_name", "adset_name", "campaign_name", "utm_source", "utm_medium", "utm_campaign", "utm_content"]

function construireLien(base: string, canal: string, recherche: string): string {
    const url = new URL(base)
    url.searchParams.set("embed", "true")
    url.searchParams.set("layout", "month_view")
    url.searchParams.set("theme", "dark")
    url.searchParams.set("metadata[canal]", canal)
    const page = new URLSearchParams(recherche)
    for (const cle of PARAMS_PUB) {
        const valeur = page.get(cle)
        if (valeur) url.searchParams.set(`metadata[${cle}]`, valeur.slice(0, 200))
    }
    // Sans ad_name explicite, le nom de la pub vient de utm_content ({{ad.name}} dans Meta).
    if (!page.get("ad_name") && page.get("utm_content")) url.searchParams.set("metadata[ad_name]", page.get("utm_content")!.slice(0, 200))
    return url.toString()
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 1000
 * @framerIntrinsicHeight 760
 */
export default function CalendrierLP(props: CalendrierLPProps) {
    const { lienCal = "https://cal.com/kleak-agency/appel-decouverte", canal = "lp" } = props
    const [src, setSrc] = useState(() => construireLien(lienCal, canal, ""))
    useEffect(() => {
        if (typeof window === "undefined") return
        setSrc(construireLien(lienCal, canal, window.location.search))
    }, [lienCal, canal])
    return (
        <div style={{ ...props.style, position: "relative", width: "100%", height: "100%" }}>
            <iframe
                src={src}
                title="Réserver un appel avec Kleak Agency"
                loading="lazy"
                style={{ width: "100%", height: "100%", border: "none", background: "transparent" }}
            />
        </div>
    )
}

addPropertyControls(CalendrierLP, {
    lienCal: { type: ControlType.String, title: "Lien Cal.com", defaultValue: "https://cal.com/kleak-agency/appel-decouverte" },
    canal: { type: ControlType.String, title: "Canal", defaultValue: "lp" },
})
