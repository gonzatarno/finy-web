import type { Metadata } from "next"
import { Suspense } from "react"
import BajaClient from "./BajaClient"

export const metadata: Metadata = {
  title: "Darse de baja — Finy",
  // Una página de baja indexada no le sirve a nadie, y en los resultados de
  // búsqueda de la marca queda francamente mal.
  robots: { index: false, follow: false },
}

export default function BajaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F5]" />}>
      <BajaClient />
    </Suspense>
  )
}
