'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function EmptyStateNoExpenses() {
  const openWhatsApp = () => {
    const botNumber = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '5491234567890'
    const message = 'Hola, quiero empezar a usar Finy'
    window.open(`https://wa.me/${botNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="mx-auto max-w-2xl w-full">
      <Card className="bg-gray-50 border-gray-200 shadow-sm">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Finy Logo */}
            <div>
              <Image
                src="/images/fini-negro-logo.png"
                alt="Finy Logo"
                width={60}
                height={60}
                priority
              />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Aún no tienes gastos registrados
              </h2>
              <p className="text-gray-700 max-w-md leading-relaxed">
                Tu dashboard se llenará de datos tan pronto como registres tu primer gasto a través del bot de WhatsApp.
              </p>
            </div>

            {/* Steps */}
            <div className="w-full bg-white rounded-lg p-6 space-y-4 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#CEFD55] flex items-center justify-center font-semibold text-black text-sm">
                  1
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Abre WhatsApp</h3>
                  <p className="text-sm text-gray-600">
                    Busca el bot de Finy o haz clic en el botón de abajo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#CEFD55] flex items-center justify-center font-semibold text-black text-sm">
                  2
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Registra un gasto</h3>
                  <p className="text-sm text-gray-600">
                    Envía un mensaje como: "Gasté $500 en comida"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#CEFD55] flex items-center justify-center font-semibold text-black text-sm">
                  3
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Vuelve aquí</h3>
                  <p className="text-sm text-gray-600">
                    Tu gasto aparecerá automáticamente en tu dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={openWhatsApp}
              size="lg"
              className="bg-[#CEFD55] hover:bg-[#B8E64A] text-black font-semibold gap-2 px-8 py-3 rounded-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Ir al Bot de WhatsApp
            </Button>

            {/* Tip */}
            <p className="text-sm text-gray-600">
              💡 Tip: El bot entiende comandos en español, inglés y portugués
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
