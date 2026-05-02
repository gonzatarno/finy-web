import type { Metadata } from "next"
import CondicionesServiciosClient from "./CondicionesServiciosClient"

export const metadata: Metadata = {
  title: "Términos y Condiciones del Servicio - Finy",
  description: "Términos y Condiciones del Servicio de Finy - Bot asistente financiero",
}

export default function CondicionesServicios() {
  return <CondicionesServiciosClient />
}
