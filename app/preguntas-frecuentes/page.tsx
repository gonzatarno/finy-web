import type { Metadata } from "next"
import Link from "next/link"
import { ALL_FAQS, FAQ_GROUPS } from "@/lib/content/faqs"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const TITLE = "Preguntas frecuentes sobre Finy"
const ANSWER =
  "Todo lo que se pregunta antes de instalar Finy: cómo funciona la carga por voz y el escaneo de tickets, cuánto sale, qué incluye el plan Gratis, en qué países funciona Mercado Pago, cómo se dividen gastos con otra persona y qué pasa con tus datos."

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Finy",
  description:
    "Respuestas sobre Finy: precios y planes, prueba de 14 días, carga de gastos por voz y foto, monedas y países, Mercado Pago, gastos compartidos, privacidad y soporte.",
  alternates: { canonical: "/preguntas-frecuentes" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
]

export default function PreguntasFrecuentes() {
  return (
    <>
      <PageSchema
        type="FAQPage"
        path="/preguntas-frecuentes"
        headline={TITLE}
        description={ANSWER}
        faqs={ALL_FAQS}
        breadcrumbs={trail}
      />
      <ContentLayout title={TITLE} intro={ANSWER} updated={CONTENT_REVIEWED} trail={trail}>
        <nav aria-label="Índice" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500">En esta página</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-950">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {FAQ_GROUPS.map((group) => (
          <Section key={group.id} id={group.id} title={group.title}>
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {group.items.map((f) => (
                <details key={f.q} className="py-4" open>
                  <summary className="cursor-pointer list-none text-[16px] font-semibold text-zinc-900 marker:content-none">
                    {f.q}
                  </summary>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-600">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        ))}

        <DownloadCta />

        <Section title="¿Sigues con dudas?">
          <p className="text-[16px] leading-relaxed text-zinc-700">
            Escríbenos a{" "}
            <a href="mailto:soporte@finyapp.io" className="font-medium text-zinc-950 underline underline-offset-4">
              soporte@finyapp.io
            </a>{" "}
            o mira las{" "}
            <Link href="/comparativas" className="font-medium text-zinc-950 underline underline-offset-4">
              comparativas con otras apps
            </Link>{" "}
            y las{" "}
            <Link href="/guias" className="font-medium text-zinc-950 underline underline-offset-4">
              guías
            </Link>
            .
          </p>
        </Section>
      </ContentLayout>
    </>
  )
}
