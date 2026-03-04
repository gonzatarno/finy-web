"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * useOneSignalSync - Hook que sincroniza persistentemente el External ID de OneSignal.
 * Usa window.OneSignal directamente (no la cola deferred) para garantizar que el
 * login se ejecuta aunque el SDK ya esté inicializado.
 */
export function useOneSignalSync() {
  const supabase = createClient()
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isSyncedRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const isAllowedDomain = () => {
      if (typeof window === "undefined") return false
      const hostname = window.location.hostname
      return hostname === "dashboard.finyapp.io"
    }

    if (!isAllowedDomain()) return

    const syncOneSignalUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const supabaseUserId = session?.user?.id

        if (!supabaseUserId) {
          if (lastUserIdRef.current) {
            lastUserIdRef.current = null
            isSyncedRef.current = false
          }
          return
        }

        // Ya sincronizado con este usuario, no hacer nada
        if (supabaseUserId === lastUserIdRef.current && isSyncedRef.current) return

        // Esperar a que window.OneSignal esté disponible
        const OneSignal = (window as any).OneSignal
        if (!OneSignal) return

        try {
          const currentExternalId = await OneSignal.User.getExternalId()

          if (currentExternalId !== supabaseUserId) {
            await OneSignal.login(supabaseUserId)
          }

          isSyncedRef.current = true
          lastUserIdRef.current = supabaseUserId
        } catch (error) {
          console.error("[OneSignalSync] Error sincronizando:", error)
        }
      } catch (error) {
        console.error("[OneSignalSync] Error obteniendo sesión:", error)
      }
    }

    syncOneSignalUser()

    syncIntervalRef.current = setInterval(syncOneSignalUser, 5000)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [supabase])

  return null
}
