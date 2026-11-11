import type { Metadata } from "next"

/*
  El laboratorio es una herramienta de trabajo, no una página del sitio: queda
  en línea para poder mirarla desde el teléfono, pero fuera de los buscadores.
*/
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LabChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
