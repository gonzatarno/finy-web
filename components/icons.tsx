"use client"

import type { LightbulbIcon as LucideProps } from "lucide-react"
import { Check, ChevronDown, ChevronUp, Globe, Languages, Loader2, Menu, X } from "lucide-react"

/**
 * Colección centralizada de iconos.
 * Agrega nuevas entradas si tu UI necesita otros iconos:
 *
 *  Icons.nuevoIcono = (props) => <NombreLucide {...props} />
 */
export const Icons = {
  /* Branding / UI */
  logo: (props: LucideProps) => (
    /* Usa el icono Check como placeholder del logo */
    <Check strokeWidth={1.5} {...props} />
  ),
  menu: (props: LucideProps) => <Menu {...props} />,
  close: (props: LucideProps) => <X {...props} />,
  chevronDown: (props: LucideProps) => <ChevronDown {...props} />,
  chevronUp: (props: LucideProps) => <ChevronUp {...props} />,
  globe: (props: LucideProps) => <Globe {...props} />,
  languages: (props: LucideProps) => <Languages {...props} />,
  /* Estado / feedback */
  spinner: (props: LucideProps) => <Loader2 className="animate-spin" {...props} />,
}

export type IconName = keyof typeof Icons
export default Icons
