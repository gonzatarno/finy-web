"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Bell, ExternalLink, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updatePushNotificationState } from "@/lib/push-notifications"

interface Announcement {
  id: string
  title: string
  message: string
  button_text: string
  action_type: 'PUSH_PERMISSION' | 'OPEN_LINK' | 'DISMISS'
  action_url?: string
  is_active: boolean
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>
  }
}

export function DynamicAnnouncementModal() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        // Consultar el anuncio activo más reciente
        const { data, error } = await supabase
          .from('app_announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.log('[Finy] No hay anuncios activos:', error.message)
          return
        }

        if (!data) {
          console.log('[Finy] No se encontraron anuncios')
          return
        }

        // Verificar si ya fue visto en localStorage
        const seenKey = `finy_announcement_seen_${data.id}`
        const hasBeenSeen = localStorage.getItem(seenKey)

        if (hasBeenSeen) {
          console.log('[Finy] Anuncio ya visto, no mostrar')
          return
        }

        // Mostrar el anuncio
        console.log('[Finy] Mostrando anuncio:', data.title)
        setAnnouncement(data)
        setIsOpen(true)
      } catch (error) {
        console.error('[Finy] Error al obtener anuncio:', error)
      }
    }

    fetchAnnouncement()
  }, [])

  // Helper: Esperar hasta que OneSignal genere el Subscription ID
  const waitForSubscriptionId = async (): Promise<string | null> => {
    const maxAttempts = 10
    const delayMs = 500

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const subId = await (window as any).OneSignal.User.PushSubscription.id
        if (subId) {
          console.log(`[Finy] Subscription ID obtenido en intento ${attempt}:`, subId)
          return subId
        }
      } catch (e) {
        console.log(`[Finy] Intento ${attempt}/${maxAttempts} - Subscription ID aún no disponible`)
      }
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    console.warn('[Finy] No se pudo obtener Subscription ID tras', maxAttempts, 'intentos')
    return null
  }

  const handlePrimaryAction = async () => {
    if (!announcement) return

    setIsProcessing(true)

    try {
      switch (announcement.action_type) {
        case 'PUSH_PERMISSION':
          console.log('[Finy] Iniciando flujo de permisos de notificaciones...')
          
          try {
            // 1. OBTENER USUARIO DE SUPABASE
            console.log('[Finy] Obteniendo usuario autenticado...')
            
            // Usar el email de NextAuth session
            const userEmail = session?.user?.email
            console.log('[Finy] Email de NextAuth:', userEmail || 'No detectado')
            
            if (!userEmail) {
              console.error('[Finy] No se detectó email de usuario')
              setIsProcessing(false)
              return
            }
            
            // Consultar Supabase users table para obtener el user.id
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id')
              .eq('email', userEmail)
              .single()
            
            if (userError || !userData?.id) {
              console.error('[Finy] Error obteniendo usuario de Supabase:', userError)
              setIsProcessing(false)
              return
            }
            
            const userId = userData.id
            console.log('[Finy] Usuario Supabase ID obtenido:', userId)

            // 2. PEDIR PERMISO NATIVO (SIN LOGIN PREVIO - n8n lo hará)
            console.log('[Finy] Solicitando permiso nativo de notificaciones...')
            if (typeof window !== 'undefined' && (window as any).OneSignal) {
              await (window as any).OneSignal.Notifications.requestPermission()
              console.log('[Finy] Permiso solicitado correctamente')
              
              // 3. ESPERAR SUBSCRIPTION ID (POLLING)
              console.log('[Finy] Esperando que OneSignal genere el Subscription ID...')
              const subscriptionId = await waitForSubscriptionId()
              
              // 4. GUARDAR EN SUPABASE INMEDIATAMENTE (SIN ESPERAR n8n)
              if (subscriptionId) {
                console.log('[Finy] 💾 Guardando OneSignal ID directamente en Supabase...')
                try {
                  await updatePushNotificationState(userId, subscriptionId, true)
                  console.log('[Finy] ✅ OneSignal ID guardado exitosamente en Supabase')
                } catch (error) {
                  console.error('[Finy] ❌ Error al guardar en Supabase:', error)
                }
              }
              
              // 5. ENVIAR WEBHOOK A n8n (en background, no necesita esperar)
              if (subscriptionId) {
                const webhookUrl = 'https://n8n.finyapp.io/webhook/vincular-onesignal'
                const body = {
                  supabase_id: userId,
                  onesignal_subscription_id: subscriptionId,
                }
                
                console.log('[Finy] 🚀 Enviando a n8n:', body)
                
                fetch(webhookUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
                  .then(response => {
                    if (response.ok) {
                      console.log('[Finy] ✅ Webhook enviado exitosamente')
                    } else {
                      throw new Error(`HTTP ${response.status}`)
                    }
                  })
                  .catch(error => {
                    console.error('[Finy] ⚠️ Error al enviar webhook (pero datos ya en Supabase):', error)
                  })
              } else {
                console.error('[Finy] No se pudo obtener el Subscription ID')
              }
            }

            // 5. CERRAR MODAL
            markAsSeen()
            setIsOpen(false)
          } catch (e) {
            console.error('[Finy] Error en flujo de permisos:', e)
          }
          break

        case 'OPEN_LINK':
          if (announcement.action_url) {
            console.log('[Finy] Abriendo link:', announcement.action_url)
            window.open(announcement.action_url, '_blank')
          }
          markAsSeen()
          setIsOpen(false)
          break

        case 'DISMISS':
          console.log('[Finy] Anuncio descartado')
          markAsSeen()
          setIsOpen(false)
          break
      }
    } catch (error) {
      console.error('[Finy] Error en acción principal:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    console.log('[Finy] Anuncio cerrado - Marcando como visto para no repetir')
    markAsSeen()
    setIsOpen(false)
  }

  const markAsSeen = () => {
    if (!announcement) return
    const seenKey = `finy_announcement_seen_${announcement.id}`
    localStorage.setItem(seenKey, 'true')
    console.log('[Finy] Anuncio marcado como visto')
  }

  if (!announcement) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-[#CEFD55]/20 dark:bg-[#CEFD55]/10 p-4">
              <Bell className="h-8 w-8 text-[#CEFD55] dark:text-[#CEFD55]" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-gray-900 dark:text-white text-xl">
            {announcement.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-600 dark:text-zinc-400 pt-2">
            {announcement.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={handlePrimaryAction}
            disabled={isProcessing}
            className="bg-[#CEFD55] hover:bg-[#CEFD55]/90 text-black font-semibold px-8"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Procesando...
              </div>
            ) : (
              <>
                {announcement.button_text}
                {announcement.action_type === 'OPEN_LINK' && (
                  <ExternalLink className="ml-2 h-4 w-4" />
                )}
              </>
            )}
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cerrar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
