import { createClient } from "@/lib/supabase/client"

/**
 * Guarda o actualiza el estado de notificaciones push en Supabase
 */
export const updatePushNotificationState = async (
  userId: string,
  onesignalId: string | null,
  isActive: boolean
) => {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from("users")
      .update({
        push_active: isActive,
        onesignal_id: onesignalId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Error updating push notification state in Supabase:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("[v0] Failed to update push notification state:", error)
    throw error
  }
}

/**
 * Obtiene el estado de notificaciones push desde Supabase
 */
export const getPushNotificationState = async (userId: string) => {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("users")
      .select("push_active, onesignal_id")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("[v0] Error fetching push notification state:", error)
      return { push_active: false, onesignal_id: null }
    }

    return { push_active: data?.push_active || false, onesignal_id: data?.onesignal_id || null }
  } catch (error) {
    console.error("[v0] Failed to fetch push notification state:", error)
    return { push_active: false, onesignal_id: null }
  }
}

/**
 * Obtiene el OneSignal subscription ID con reintentos
 * Espera a que la suscripción sea completada
 */
export const getOneSignalSubscriptionId = async (maxRetries = 10, delayMs = 500) => {
  try {
    if (typeof window === "undefined" || !(window as any).OneSignal) {
      return null
    }

    const OneSignal = (window as any).OneSignal
    
    // Intentar obtener el ID con reintentos si no está disponible inmediatamente
    for (let i = 0; i < maxRetries; i++) {
      try {
        // En OneSignal v16+, se obtiene así:
        const subscriptionId = OneSignal.User.PushSubscription.id
        
        if (subscriptionId) {
          console.log("[v0] OneSignal Subscription ID obtenido:", subscriptionId)
          return subscriptionId
        }
      } catch (e) {
        // Silently continue to retry
      }
      
      // Esperar antes de reintentar
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    console.warn("[v0] No se pudo obtener OneSignal Subscription ID después de reintentos")
    return null
  } catch (error) {
    console.error("[v0] Error getting OneSignal subscription ID:", error)
    return null
  }
}
