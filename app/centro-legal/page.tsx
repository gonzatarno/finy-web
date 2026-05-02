import type { Metadata } from "next"
import { LegalCenter } from "@/components/legal-center"

export const metadata: Metadata = {
  title: "Centro Legal - Finy",
  description: "Términos de Servicio y Política de Privacidad de Finy - Bot asistente financiero",
}

export default function LegalCenterPage() {
  return <LegalCenter />
}
