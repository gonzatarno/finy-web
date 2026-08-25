"use client"

import { useT } from "@/hooks/use-t"

/**
 * El asesor mensual: el análisis del 1°, una sola acción, y el seguimiento.
 *
 * No lleva captura de pantalla a propósito. Todo el resto de la landing muestra
 * un teléfono, y acá eso no alcanzaría: lo que hace distinto a Finy no es cómo
 * se ve una pantalla, es que la pantalla del mes que viene se acuerda de la de
 * este mes. Una sola captura no puede contar eso. Los dos meses encadenados,
 * sí.
 *
 * Va en oscuro para cortar con las secciones claras que tiene alrededor: es la
 * sección que sostiene el producto nuevo y no puede leerse como una más.
 */
const COPY = {
  es: {
    eyebrow: "Nuevo · Análisis mensual",
    titleA: "El 1° de cada mes,",
    titleB: "alguien miró tus números.",
    body: "No un resumen con gráficos, eso ya lo tienes. Un análisis de lo que pasó, por qué pasó, y una sola cosa para hacer el mes que viene. Al mes siguiente abre diciéndote si la cumpliste.",
    mes1: { fecha: "1 de septiembre", titulo: "Gastaste 838 mil en delivery", detalle: "44 pedidos. Más de uno por día.", etiqueta: "Tu única tarea del mes", tarea: "Bajar a 22 pedidos" },
    mes2: { fecha: "1 de octubre", titulo: "Dijiste 22 y cerraste en 19", detalle: "Son 380 mil que no gastaste.", etiqueta: "Cumplido" },
    remate: "Puedes pegarle tus gastos a ChatGPT y tener un buen análisis. Una vez. Al mes siguiente hay que exportar de nuevo, pegar de nuevo, explicar el contexto de nuevo — y no se acuerda de nada de lo que te dijo.",
    pie: "El primer análisis es gratis y viene completo.",
  },
  en: {
    eyebrow: "New · Monthly analysis",
    titleA: "On the 1st of every month,",
    titleB: "someone looked at your numbers.",
    body: "Not a summary with charts, you already have that. An analysis of what happened, why it happened, and one single thing to do next month. The following month opens by telling you whether you did it.",
    mes1: { fecha: "September 1", titulo: "You spent $838 on delivery", detalle: "44 orders. More than one a day.", etiqueta: "Your one task this month", tarea: "Get down to 22 orders" },
    mes2: { fecha: "October 1", titulo: "You said 22 and closed at 19", detalle: "That's $380 you didn't spend.", etiqueta: "Done" },
    remate: "You can paste your expenses into ChatGPT and get a good analysis. Once. Next month you export again, paste again, explain the context again — and it remembers nothing of what it told you.",
    pie: "The first analysis is free and complete.",
  },
}

export function AsesorMensual() {
  const t = useT(COPY)

  return (
    <section
      id="asesor"
      className="relative isolate overflow-hidden bg-[#07090a] py-24 sm:py-32 lg:py-40 px-5 sm:px-6 lg:px-8"
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.055] mix-blend-overlay bg-grain" />

      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase mb-5 text-[#CEFD55]">
          {t.eyebrow}
        </p>
        <h2 className="text-[40px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.03em] leading-[0.98] text-white text-balance">
          {t.titleA}{" "}
          <span className="block text-zinc-500">{t.titleB}</span>
        </h2>
        <p className="mt-7 max-w-xl text-[17px] sm:text-[19px] leading-relaxed text-zinc-400 text-pretty">
          {t.body}
        </p>

        {/* Los dos meses. En mobile van uno debajo del otro y la flecha rota. */}
        <div className="mt-16 grid gap-5 sm:gap-6 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <Mes
            fecha={t.mes1.fecha}
            titulo={t.mes1.titulo}
            detalle={t.mes1.detalle}
            etiqueta={t.mes1.etiqueta}
            tarea={t.mes1.tarea}
          />

          <div aria-hidden className="flex items-center justify-center text-zinc-700">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="rotate-90 md:rotate-0">
              <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <Mes
            fecha={t.mes2.fecha}
            titulo={t.mes2.titulo}
            detalle={t.mes2.detalle}
            etiqueta={t.mes2.etiqueta}
            cumplido
          />
        </div>

        <div className="mt-16 max-w-2xl border-l-2 border-zinc-800 pl-6">
          <p className="text-[15px] sm:text-[16px] leading-relaxed text-zinc-400 text-pretty">
            {t.remate}
          </p>
        </div>

        <p className="mt-10 text-[14px] font-semibold text-[#CEFD55]">{t.pie}</p>
      </div>
    </section>
  )
}

function Mes({
  fecha, titulo, detalle, etiqueta, tarea, cumplido = false,
}: {
  fecha: string; titulo: string; detalle: string
  etiqueta: string; tarea?: string; cumplido?: boolean
}) {
  return (
    <div className="rounded-[20px] border border-zinc-800 bg-[#0d1011] p-6 sm:p-7">
      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-zinc-400">{fecha}</p>
      <p className="mt-4 text-[19px] sm:text-[21px] font-extrabold leading-[1.2] tracking-[-0.01em] text-white text-balance">
        {titulo}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{detalle}</p>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        {cumplido ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#CEFD55]/10 px-3 py-1.5 text-[13px] font-bold text-[#CEFD55]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {etiqueta}
          </span>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{etiqueta}</p>
            <p className="mt-2 text-[17px] font-bold text-[#CEFD55]">{tarea}</p>
          </>
        )}
      </div>
    </div>
  )
}
