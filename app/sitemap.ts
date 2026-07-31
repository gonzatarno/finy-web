import type { MetadataRoute } from "next"
import { COMPARISONS } from "@/lib/content/comparisons"
import { GUIDES } from "@/lib/content/guides"
import { SITE } from "@/lib/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: `${SITE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/preguntas-frecuentes`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/comparativas`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...COMPARISONS.map((c) => ({
      url: `${SITE}/comparativas/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE}/guias`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...GUIDES.map((g) => ({
      url: `${SITE}/guias/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE}/centro-legal`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/politica-privacidad`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/condiciones-servicios`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ]
}
