import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GUIDES } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const TITLE = "Guías de finanzas personales"
const ANSWER =
  "Guías prácticas para elegir cómo llevar tus gastos: qué app conviene según cuál sea tu problema real, cómo dividir gastos en pareja sin que se vuelva una discusión, y qué resuelve de verdad la inteligencia artificial en una app de finanzas."

export const metadata: Metadata = {
  title: "Guías — Finy",
  description:
    "Guías prácticas sobre control de gastos: cómo elegir app en Argentina, cómo dividir gastos en pareja y qué hace realmente la IA en finanzas personales.",
  alternates: { canonical: "/guias" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
]

export default function GuiasIndex() {
  return (
    <>
      <PageSchema type="CollectionPage" path="/guias" headline={TITLE} description={ANSWER} breadcrumbs={trail} />
      <ContentLayout title={TITLE} intro={ANSWER} updated={CONTENT_REVIEWED} trail={trail}>
        <ul className="space-y-4">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guias/${g.slug}`}
                className="group block rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400"
              >
                <h2 className="text-[19px] font-bold tracking-tight text-zinc-950">{g.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{g.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-zinc-950">
                  Leer la guía
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <DownloadCta />
      </ContentLayout>
    </>
  )
}
