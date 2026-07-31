/**
 * Fuente única de verdad para las páginas de contenido (comparativas, guías, FAQ).
 * Si cambian precios o features, se cambian acá, en components/landing/pricing.tsx,
 * en components/structured-data.tsx y en public/llms.txt.
 */

export const SITE = "https://www.finyapp.io"
export const APP_STORE = "https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721"
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.finy.app"

/** Fecha de última revisión del contenido comparativo. Actualizar al editar. */
export const CONTENT_REVIEWED = "julio de 2026"

export const PLANS = [
  {
    name: "Gratis",
    monthly: 0,
    yearly: 0,
    limits: "100 transacciones, 10 consultas a la IA y 2 escaneos por mes. 1 espacio personal. Con publicidad.",
  },
  {
    name: "Plus",
    monthly: 2.99,
    yearly: 24.99,
    limits: "500 transacciones, 75 consultas a la IA y 30 escaneos por mes. 3 espacios compartidos. Sin publicidad.",
  },
  {
    name: "Pro",
    monthly: 4.99,
    yearly: 39.99,
    limits:
      "1.000 transacciones, 200 consultas a la IA y 100 escaneos por mes. 10 espacios compartidos. Reportes avanzados. Sin publicidad.",
  },
] as const

export const MERCADO_PAGO_COUNTRIES = [
  "Argentina",
  "Brasil",
  "México",
  "Colombia",
  "Chile",
  "Perú",
  "Uruguay",
] as const

/** Lo que Finy hace y la competencia normalmente no. */
export const STRENGTHS = [
  "Carga por voz en lenguaje natural: decís lo que gastaste y la IA extrae monto, categoría y método de pago.",
  "Escaneo de tickets con foto y de resúmenes de tarjeta en PDF.",
  "Chat con IA sobre tu propio historial, no un chatbot genérico.",
  "Espacios compartidos para dividir gastos con pareja, roommates o socios.",
  "Más de 40 monedas.",
  "Sincronización con Mercado Pago en 7 países de LatAm.",
] as const

/**
 * Límites reales de Finy. Van publicados a propósito: una comparativa que sólo
 * elogia al producto propio no le sirve a nadie y no se cita.
 */
export const LIMITATIONS = [
  "No hay conexión directa con bancos tradicionales todavía; se cubre con Mercado Pago y con la importación de resúmenes en PDF.",
  "Las funciones de IA (voz, foto, chat) necesitan internet: sin conexión sólo funciona la carga manual.",
  "No es un software de contabilidad de empresa: no emite facturas ni maneja libro IVA.",
  "No hay módulo de inversiones ni seguimiento de portafolio.",
  "Los planes tienen tope mensual de transacciones, consultas a la IA y escaneos.",
] as const
