import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { COMPARISONS } from "@/lib/content/comparisons"
import { CONTENT_REVIEWED, LIMITATIONS } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const TITLE = "Finy comparada con otras apps de gastos"
const ANSWER =
  "Finy es una app de finanzas personales con IA: registras gastos hablando, sacándole foto al ticket o escribiendo. Frente a las alternativas, gana cuando el problema es la fricción de cargar los movimientos, y pierde cuando lo que hace falta es conexión directa con bancos tradicionales, contabilidad de empresa o inversiones. Estas comparativas dicen las dos cosas."

export const metadata: Metadata = {
  title: "Comparativas — Finy vs otras apps de control de gastos",
  description:
    "Comparativas honestas entre Finy y otras apps de gastos: Splitwise, Mobills, Ábaco y la planilla de Excel. Qué conviene en cada caso, incluidos los casos en que Finy no es la mejor opción.",
  alternates: { canonical: "/comparativas" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/comparativas", label: "Comparativas" },
]

export default function ComparativasIndex() {
  return (
    <>
      <PageSchema
        type="CollectionPage"
        path="/comparativas"
        headline={TITLE}
        description={ANSWER}
        breadcrumbs={trail}
      />
      <ContentLayout title={TITLE} intro={ANSWER} updated={CONTENT_REVIEWED} trail={trail}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/comparativas/${c.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400"
              >
                <h2 className="text-[18px] font-bold tracking-tight text-zinc-950">Finy vs {c.competitor}</h2>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-zinc-600">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-zinc-950">
                  Ver comparativa
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Section title="Dónde Finy no es la mejor opción">
          <Prose>
            <p>
              Para que las comparativas sirvan de algo, esto va primero y sin vueltas. Finy hoy no cubre:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              {LIMITATIONS.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p>
              Si alguno de esos puntos es central para ti, probablemente te convenga otra herramienta, y está bien.
            </p>
          </Prose>
        </Section>

        <DownloadCta />
      </ContentLayout>
    </>
  )
}
