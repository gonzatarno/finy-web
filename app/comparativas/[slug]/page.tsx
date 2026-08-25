import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"
import { COMPARISONS, getComparison } from "@/lib/content/comparisons"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getComparison(params.slug)
  if (!c) return {}
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/comparativas/${c.slug}` },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url: `/comparativas/${c.slug}`, type: "article" },
  }
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug)
  if (!c) notFound()

  const trail = [
    { href: "/", label: "Inicio" },
    { href: "/comparativas", label: "Comparativas" },
    { href: `/comparativas/${c.slug}`, label: `Finy vs ${c.competitor}` },
  ]

  return (
    <>
      <PageSchema
        path={`/comparativas/${c.slug}`}
        headline={c.title}
        description={c.answer}
        faqs={c.faqs}
        breadcrumbs={trail}
      />
      <ContentLayout title={c.title} intro={c.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title={`Qué es ${c.competitor}`}>
          <Prose>
            {c.competitorSummary.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {c.competitorUrl && (
              <p>
                Sitio oficial:{" "}
                <a href={c.competitorUrl} target="_blank" rel="noopener nofollow">
                  {c.competitorUrl.replace("https://", "")}
                </a>
                . Los precios y las funciones de terceros cambian seguido: conviene verificarlos ahí antes de decidir.
              </p>
            )}
          </Prose>
        </Section>

        <Section title="Comparación punto por punto">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-zinc-300">
                  <th scope="col" className="py-3 pr-4 font-semibold text-zinc-500"></th>
                  <th scope="col" className="py-3 pr-4 font-bold text-zinc-950">Finy</th>
                  <th scope="col" className="py-3 font-bold text-zinc-950">{c.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {c.table.map((row) => (
                  <tr key={row.dimension} className="border-b border-zinc-200 align-top">
                    <th scope="row" className="py-4 pr-4 text-[14px] font-semibold text-zinc-500">{row.dimension}</th>
                    <td className="py-4 pr-4 text-zinc-800">{row.finy}</td>
                    <td className="py-4 text-zinc-600">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Cuándo elegir cada una">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-[17px] font-bold text-zinc-950">Elige Finy si…</h3>
              <ul className="mt-4 space-y-3">
                {c.chooseFiny.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-zinc-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="text-[17px] font-bold text-zinc-950">
                Mejor {c.slug === "finy-vs-excel" ? "quédate con la planilla" : `elige ${c.competitor}`} si…
              </h3>
              <ul className="mt-4 space-y-3">
                {c.chooseOther.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-zinc-700">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <DownloadCta />

        <Section title="Preguntas frecuentes">
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {c.faqs.map((f) => (
              <details key={f.q} className="group py-4" open>
                <summary className="cursor-pointer list-none text-[16px] font-semibold text-zinc-900 marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="Otras comparativas">
          <ul className="grid gap-3 sm:grid-cols-2">
            {COMPARISONS.filter((o) => o.slug !== c.slug).map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/comparativas/${o.slug}`}
                  className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-400"
                >
                  <span className="text-[15px] font-semibold text-zinc-950">Finy vs {o.competitor}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-zinc-500">{o.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </ContentLayout>
    </>
  )
}
