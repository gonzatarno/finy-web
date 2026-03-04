/**
 * Haptics utility for Finy PWA / Capacitor native app.
 *
 * Currently uses the Web Vibration API (navigator.vibrate) as a fallback.
 *
 * TODO: When @capacitor/haptics is installed, replace the body of each
 * function with the Capacitor implementation:
 *
 *   import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics"
 *
 *   export async function triggerVibration() {
 *     await Haptics.impact({ style: ImpactStyle.Medium })
 *   }
 *   export async function triggerSuccess() {
 *     await Haptics.notification({ type: NotificationType.Success })
 *   }
 *   export async function triggerLight() {
 *     await Haptics.impact({ style: ImpactStyle.Light })
 *   }
 */

/**
 * Medium haptic feedback — use for confirming important actions
 * (e.g. "Confirmar Gasto", "Guardar", destructive actions).
 */
export function triggerVibration(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([50])
  }
}

/**
 * Light haptic feedback — use for subtle interactions
 * (e.g. toggling a switch, selecting a filter).
 */
export function triggerLight(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([20])
  }
}

/**
 * Success haptic pattern — use after a successful save/create operation.
 */
export function triggerSuccess(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([30, 50, 30])
  }
}

/**
 * Error haptic pattern — use when an operation fails.
 */
export function triggerError(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([100, 30, 100])
  }
}
