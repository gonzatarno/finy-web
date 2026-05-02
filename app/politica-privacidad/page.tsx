import type { Metadata } from "next"
import PoliticaPrivacidadClient from "./PoliticaPrivacidadClient"

export const metadata: Metadata = {
  title: "Política de Privacidad - Finy",
  description: "Política de Privacidad de Finy - Bot asistente financiero",
}

export default function PoliticaPrivacidad() {
  return <PoliticaPrivacidadClient />
}
