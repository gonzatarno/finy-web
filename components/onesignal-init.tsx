"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@/contexts/user-context"
import { useOneSignalSync } from "@/hooks/useOneSignalSync"
import { updatePushNotificationState, getOneSignalSubscriptionId } from "@/lib/push-notifications"

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>
  }
}

export function OneSignalInit() {
  const { user } = useUser() // Tu usuario de Supabase en memoria
  const initDone = useRef(false)

  // Activar hook de sincronización persistente para mobile
  useOneSignalSync()

  // EFECTO 1: Cargar SDK e inicializar OneSignal (Solo una vez al cargar la página)
  useEffect(() => {
    if (initDone.current) return
    
    // Only initialize OneSignal on production domain
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : ""
    const isProductionDomain = currentDomain === "dashboard.finyapp.io"
    
    if (!isProductionDomain) {
      return
    }

    initDone.current = true

    const initOneSignal = async () => {
      if (typeof window === "undefined") return

      // Cargar el SDK dinámicamente si no está ya presente
      if (!(window as any).OneSignal) {
        await new Promise<void>((resolve, reject) => {
          const el = document.createElement("script")
          el.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          el.async = true
          el.onload = () => resolve()
          el.onerror = () => reject(new Error("OneSignal SDK failed to load"))
          document.head.appendChild(el)
        })
      }

      // Esperar a que window.OneSignal esté disponible
      let attempts = 0
      while (!(window as any).OneSignal && attempts < 30) {
        await new Promise((r) => setTimeout(r, 300))
        attempts++
      }

      const OneSignal = (window as any).OneSignal
      if (!OneSignal) {
        console.error("[OneSignal] SDK script no se cargó")
        return
      }

      try {
        await OneSignal.init({
          appId: "ffbacf72-31ec-49d1-b6f4-6ede11c68f04",
          allowLocalhostAsSecureOrigin: true,
        })
      } catch (error) {
        console.error("[OneSignal] Error inicializando:", error)
      }
    }

    initOneSignal()
  }, [])

  // EFECTO 2: Identificar al Usuario (Se ejecuta cuando 'user' cambia)
  useEffect(() => {
    if (!user?.id) return

    const currentDomain = typeof window !== "undefined" ? window.location.hostname : ""
    const isProductionDomain = currentDomain === "dashboard.finyapp.io"
    if (!isProductionDomain) return

    const linkUser = async () => {
      // Esperar hasta que el SDK esté disponible en window.OneSignal
      let attempts = 0
      while (!(window as any).OneSignal && attempts < 20) {
        await new Promise((r) => setTimeout(r, 500))
        attempts++
      }

      const OneSignal = (window as any).OneSignal
      if (!OneSignal) return

      try {
        const externalId = await OneSignal.User.getExternalId()

        if (externalId !== user.id) {
          await OneSignal.login(user.id)

          if (user.email) {
            OneSignal.User.addEmail(user.email)
          }
        }

        const subscriptionId = await getOneSignalSubscriptionId()
        if (subscriptionId) {
          await updatePushNotificationState(user.id, subscriptionId, true)
        }
      } catch (error) {
        console.error("[OneSignal] Error linking user:", error)
      }
    }

    linkUser()
  }, [user?.id])

  return null
}
