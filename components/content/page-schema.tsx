import { SITE } from "@/lib/content/site"

/**
 * JSON-LD por página de contenido.
 *
 * Le da a los asistentes IA la respuesta corta ya aislada (`description`) y las
 * preguntas con su respuesta como datos, sin que tengan que inferirlas del HTML.
 */
export function PageSchema({
  type = "Article",
  path,
  headline,
  description,
  faqs = [],
  breadcrumbs = [],
}: {
  type?: "Article" | "FAQPage" | "CollectionPage"
  path: string
  headline: string
  description: string
  faqs?: { q: string; a: string }[]
  breadcrumbs?: { href: string; label: string }[]
}) {
  const url = `${SITE}${path}`

  const questions = faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  }))

  const main: Record<string, unknown> = {
    "@type": type,
    "@id": `${url}#main`,
    url,
    headline,
    name: headline,
    description,
    inLanguage: "es",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#app` },
    publisher: { "@id": `${SITE}/#organization` },
  }

  // Si la página ya ES un FAQPage, las preguntas van dentro del nodo principal.
  // Emitir un segundo FAQPage para la misma URL confunde a los parsers.
  if (type === "FAQPage") main.mainEntity = questions

  const graph: Record<string, unknown>[] = [main]

  if (type !== "FAQPage" && questions.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: questions,
    })
  }

  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: `${SITE}${b.href}`,
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  )
}
