"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function OnboardingRequired() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-lg text-center space-y-8 p-10 rounded-lg shadow-2xl border-0">
        <div className="flex justify-center">
          <Image src="/images/fini-negro-logo.png" alt="Finy Logo" width={120} height={40} className="h-10 w-auto" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Activa tu cuenta Finy</h2>
          <p className="text-zinc-500 leading-relaxed text-base">
            Finy funciona conectando tu WhatsApp con este tablero. Para empezar a ver tus gastos aquí, necesitas conocer
            cómo funciona la plataforma y activar tu cuenta.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <Button
            asChild
            size="lg"
            className="w-full bg-black hover:bg-zinc-800 text-white font-semibold rounded-full h-12 shadow-md transition-colors cursor-pointer"
          >
            <a
              href="https://www.finyapp.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Empezar con Finy
              <span>🚀</span>
            </a>
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-sm text-gray-500 hover:text-gray-900 hover:underline cursor-pointer"
          >
            ¿Te equivocaste de cuenta? Cerrar sesión
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <a
            href="https://www.finyapp.io/#contacto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
          >
            Contactar Soporte
          </a>
        </div>
      </Card>
    </div>
  )
}
