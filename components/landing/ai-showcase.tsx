"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    eyebrow: "Cerebro IA en acción",
    titleA: "Conversa con tu dinero.",
    titleB: "Sin abrir Excel.",
    sub: "Ejemplos reales de lo que la IA de Finy responde cuando le preguntas.",
    convs: [
      {
        q: "¿Cuánto gasté en café este mes?",
        a: "Gastaste $48.500 en café — un 23% menos que el mes pasado. Buen mes ☕",
      },
      {
        q: "¿Me alcanza para irme de viaje en 3 meses?",
        a: "Tienes $180.000 disponibles. El viaje promedio sale $250.000. A tu ritmo de ahorro actual, llegas holgado.",
      },
      {
        q: "Pagué 180.000 en gym en 3 cuotas",
        a: "Listo. Registré un gasto de $180.000 en 3 cuotas de $60.000 (Mayo, Junio, Julio).",
      },
      {
        q: "¿En qué se fue mi dinero el mes pasado?",
        a: "El 38% se fue en Salidas ($184.000) — un 24% más que el mes anterior. ¿Quieres que te arme un presupuesto?",
      },
    ],
  },
  en: {
    eyebrow: "AI Brain in action",
    titleA: "Chat with your money.",
    titleB: "Without opening Excel.",
    sub: "Real examples of how Finy's AI replies when you ask.",
    convs: [
      {
        q: "How much did I spend on coffee this month?",
        a: "You spent $48 on coffee — 23% less than last month. Good job ☕",
      },
      {
        q: "Can I afford a trip to Bariloche in 3 months?",
        a: "You have $180 available. The average trip costs $250. At your current saving pace, you'll get there comfortably.",
      },
      {
        q: "I paid $180 at the gym in 3 installments",
        a: "Done. Logged an Expense of $180 in 3 installments of $60 (May, June, July).",
      },
      {
        q: "Where did my money go last month?",
        a: "38% went to Dining Out ($184) — 24% more than in March. Want me to set up a budget for you?",
      },
    ],
  },
}

export function AIShowcase() {
  const t = useT(COPY)

  return (
    <section className="relative bg-zinc-950 text-white py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Halo lima */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-0 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.7), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.6), transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-grid-dark opacity-25 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        {/* Header centrado */}
        <div className="text-center mb-14 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] uppercase text-[#CEFD55] mb-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[36px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.03em] leading-[0.98] max-w-3xl mx-auto"
          >
            {t.titleA}{" "}
            <span className="text-zinc-500">{t.titleB}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-[16px] sm:text-[17px] text-zinc-400 max-w-xl mx-auto"
          >
            {t.sub}
          </motion.p>
        </div>

        {/* Stack de conversaciones */}
        <div className="space-y-10 sm:space-y-12">
          {t.convs.map((c, i) => {
            const fromLeft = i % 2 === 0
            return (
              <div key={i} className="space-y-3">
                {/* User bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20, x: fromLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${fromLeft ? "justify-start" : "justify-end"}`}
                >
                  <div className="max-w-[85%] sm:max-w-[70%] bg-[#CEFD55] text-black text-[15px] sm:text-[16px] font-medium rounded-2xl rounded-bl-md px-4 py-3 shadow-lg shadow-[#CEFD55]/20"
                       style={{ borderBottomRightRadius: fromLeft ? "16px" : "4px", borderBottomLeftRadius: fromLeft ? "4px" : "16px" }}>
                    {c.q}
                  </div>
                </motion.div>

                {/* Assistant bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20, x: fromLeft ? 24 : -24 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-start gap-3 ${fromLeft ? "justify-end" : "justify-start"}`}
                >
                  {!fromLeft && (
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CEFD55] mt-1">
                      <span className="text-black font-extrabold text-[12px]">F</span>
                    </span>
                  )}
                  <div className="max-w-[85%] sm:max-w-[75%] bg-zinc-900 ring-1 ring-zinc-800 text-zinc-100 text-[15px] sm:text-[16px] rounded-2xl px-4 py-3 leading-relaxed shadow-xl"
                       style={{ borderBottomLeftRadius: fromLeft ? "16px" : "4px", borderBottomRightRadius: fromLeft ? "4px" : "16px" }}>
                    {c.a}
                  </div>
                  {fromLeft && (
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CEFD55] mt-1">
                      <span className="text-black font-extrabold text-[12px]">F</span>
                    </span>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
