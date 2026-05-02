"use client"

import { useLanguage } from "@/contexts/language-context"

/**
 * Helper de i18n local-al-componente.
 * Pasás un dict { es, en } y te devuelve el bloque del idioma activo.
 *
 * @example
 * const t = useT({
 *   es: { title: 'Hola' },
 *   en: { title: 'Hello' },
 * })
 * return <h1>{t.title}</h1>
 */
export function useT<T extends Record<string, any>>(dict: { es: T; en: T }): T {
  const { language } = useLanguage()
  return dict[language as "es" | "en"] ?? dict.es
}
