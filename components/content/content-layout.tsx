import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/landing/footer"
import { APP_STORE, PLAY_STORE } from "@/lib/content/site"

/**
 * Shell de las páginas de contenido (comparativas, guías, FAQ).
 *
 * A propósito es un Server Component sin framer-motion ni acordeones en JS:
 * todo el texto tiene que estar en el HTML inicial para que lo lean los
 * crawlers de buscadores y de asistentes IA.
 */

function ContentNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center" aria-label="Finy — inicio">
          <Image src="/images/fini-negro-logo.png" alt="Finy" width={94} height={54} className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/#precios" className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 sm:block">
            Precios
          </Link>
          <Link href="/preguntas-frecuentes" className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 sm:block">
            Preguntas
          </Link>
          <Link
            href={PLAY_STORE}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Descargar
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Breadcrumbs({ trail }: { trail: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8 text-sm text-zinc-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="text-zinc-300">/</span>}
            {i === trail.length - 1 ? (
              <span className="text-zinc-700">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-zinc-900">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function DownloadCta({
  title = "Probá Finy",
  body = "14 días de PRO gratis al instalar, sin tarjeta. Después pasás al plan Gratis solo.",
}: {
  title?: string
  body?: string
}) {
  return (
    <aside className="my-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{body}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={PLAY_STORE}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Google Play
        </Link>
        <Link
          href={APP_STORE}
          target="_blank"
          rel="noopener"
          className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400"
        >
          App Store
        </Link>
      </div>
    </aside>
  )
}

export function ContentLayout({
  children,
  title,
  intro,
  updated,
  trail,
}: {
  children: React.ReactNode
  title: string
  /** Respuesta corta y autosuficiente: es el fragmento que un asistente cita. */
  intro: string
  updated?: string
  trail?: { href: string; label: string }[]
}) {
  return (
    <>
      <ContentNav />
      <main className="bg-white">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {trail && <Breadcrumbs trail={trail} />}
          <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-tight text-zinc-950 sm:text-[46px]">
            {title}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-zinc-600 sm:text-[19px]">{intro}</p>
          {updated && (
            <p className="mt-4 text-[13px] text-zinc-400">Última revisión: {updated}</p>
          )}
          <div className="mt-10">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  )
}

/** Tipografía compartida para bloques de texto largo. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-[16px] leading-[1.75] text-zinc-700 [&_a]:font-medium [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-zinc-950">
      {children}
    </div>
  )
}

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="text-[26px] font-bold tracking-tight text-zinc-950 sm:text-[32px]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
