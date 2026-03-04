"use client"

import { useState, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface HelpFeedbackDialogProps {
  children: ReactNode
}

export function HelpFeedbackDialog({ children }: HelpFeedbackDialogProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async () => {
    // Validación
    if (!npsScore || !message.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (!session?.user?.email) {
      toast({
        title: "Error de autenticación",
        description: "No se detectó tu sesión. Por favor inicia sesión nuevamente.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar datos
      const deviceInfo = window.navigator.userAgent

      // Enviar a API route
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          nps_score: npsScore,
          message: message.trim(),
          device_info: deviceInfo,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar feedback")
      }

      // Éxito
      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu opinión nos ayuda a mejorar Finy.",
      })

      setSubmitSuccess(true)
      setNpsScore(null)
      setMessage("")

      // Cerrar diálogo después de 2 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      console.error("[v0] Error submitting feedback:", err)
      toast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Ayuda y Feedback
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-zinc-400">
            Preguntas frecuentes y comparte tu opinión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* FAQ Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Preguntas Frecuentes
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-gray-200 dark:border-zinc-700">
                <AccordionTrigger className="text-sm text-gray-900 dark:text-white hover:no-underline">
                  ¿Cómo registro un gasto?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-zinc-400">
                  Simplemente abre el chat de WhatsApp y escribe, manda un audio o una foto. Puedes ser natural: "Almuerzo 15000", "Súper 45000 con Visa" o incluso varios juntos: "Cine 8000 y Cena 22000".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-gray-200 dark:border-zinc-700">
                <AccordionTrigger className="text-sm text-gray-900 dark:text-white hover:no-underline">
                  ¿Cómo funcionan las cuotas?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-zinc-400">
                  Si compraste algo en cuotas, díselo al bot: "Zapatillas 120.000 en 3 cuotas". Finy dividirá el monto automáticamente y cargará una parte este mes y proyectará las deudas para los meses siguientes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-gray-200 dark:border-zinc-700">
                <AccordionTrigger className="text-sm text-gray-900 dark:text-white hover:no-underline">
                  ¿Cómo registro un ahorro o inversión?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-zinc-400">
                  Si compraste dólares o hiciste un Plazo Fijo, no es un "Gasto" (pérdida). Dile al bot: "Invertí 50.000" o "Ahorré 100 dólares". En tu Dashboard, estos movimientos aparecerán en Azul y no afectarán tu balance de gastos negativos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-gray-200 dark:border-zinc-700">
                <AccordionTrigger className="text-sm text-gray-900 dark:text-white hover:no-underline">
                  ¿Puedo crear mis propias categorías?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-zinc-400">
                  ¡Sí! Ve a la sección "Categorías y Tarjetas" en el menú lateral. Ahí puedes personalizar las categorías y agregar tus propios métodos de pago (bancos, tarjetas) para que Finy se adapte a tu vida.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-gray-200 dark:border-zinc-700">
                <AccordionTrigger className="text-sm text-gray-900 dark:text-white hover:no-underline">
                  ¿Cómo elimino mi cuenta?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-zinc-400">
                  Si decides irte, puedes eliminar tu cuenta y todos tus datos permanentemente desde la "Zona de Peligro" en Configuración de Cuenta. Esto borrará tu historial de chat, transacciones y configuraciones sin posibilidad de recuperación.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Feedback Section */}
          <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              ¿Qué te parece Finy?
            </h3>

            {submitSuccess ? (
              <div className="text-center py-8">
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  ¡Gracias por tu feedback! 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* NPS Score */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-zinc-200 mb-2 block">
                    Del 1 al 10, ¿qué tan probable es que recomiendes Finy?
                  </Label>
                  <div className="grid grid-cols-10 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setNpsScore(score)}
                        className={`
                          h-10 rounded-lg font-medium text-sm transition-all
                          ${
                            npsScore === score
                              ? "bg-[#CEFD55] text-black scale-105"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                          }
                        `}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-gray-500 dark:text-zinc-500">Poco probable</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-500">Muy probable</span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="feedback-message" className="text-sm font-medium text-gray-700 dark:text-zinc-200 mb-2 block">
                    Cuéntanos más (sugerencias, problemas, ideas)
                  </Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Ej: Me gustaría poder..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!npsScore || !message.trim() || isSubmitting}
                  className="w-full bg-[#CEFD55] text-black hover:bg-[#b8e34a] font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Feedback"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
