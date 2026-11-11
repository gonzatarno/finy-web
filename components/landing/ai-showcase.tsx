"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useT } from "@/hooks/use-t"
import { ChatFiny } from "@/components/landing/finy-chat"

const COPY = {
  es: {
    eyebrow: "Cerebro IA en acción",
    titleA: "Conversa con tu dinero.",
    titleB: "Sin abrir Excel.",
    sub: "Este es el asistente de Finy, el mismo que responde dentro de la app. Dile un gasto como se lo dirías a alguien y mira cómo lo carga.",
    nota: "Nada de lo que escribas acá se guarda.",
  },
  en: {
    eyebrow: "AI Brain in action",
    titleA: "Chat with your money.",
    titleB: "Without opening Excel.",
    sub: "This is Finy's assistant, the same one that answers inside the app. Tell it an expense the way you'd tell a friend and watch it log it.",
    nota: "Nothing you type here is saved.",
  },
}

export function AIShowcase() {
  const t = useT(COPY)

  return (
    <section
      id="asistente"
      className="relative overflow-hidden scroll-mt-20 bg-zinc-950 px-5 py-24 text-white sm:px-6 sm:py-32 lg:px-8 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 h-[700px] w-[700px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.5), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.6), transparent 70%)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-25" aria-hidden />

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-10 text-center sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#CEFD55]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[36px] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]"
          >
            {t.titleA} <span className="text-zinc-500">{t.titleB}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-[16px] text-zinc-400 sm:text-[17px]"
          >
            {t.sub}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatFiny />
        </motion.div>

        <p className="mt-5 text-center text-[13px] text-zinc-600">{t.nota}</p>
      </div>
    </section>
  )
}
