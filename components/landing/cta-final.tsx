"use client"

import { motion } from "framer-motion"
import { PhoneFrame } from "./phone-frame"
import { StoreBadges } from "./store-badges"
import { Sparkles } from "lucide-react"
import { useT } from "@/hooks/use-t"

const CTA_SCREENS = [
  { src: "/screens/home.png",  alt: "Finy home",         label: "Home" },
  { src: "/screens/stats.png", alt: "Stats",             label: "Stats" },
  { src: "/screens/more.png",  alt: "More",              label: "More" },
]

const COPY = {
  es: {
    pill: "Empieza ahora",
    titleA: "Tu dinero,",
    titleHighlight: "bajo control",
    bodyPre: "Descarga Finy en 30 segundos. Carga tu primer gasto hablando, tomando una foto o escribiendo. Sin tarjeta.",
    bodyBold: "14 días PRO gratis.",
    note: "Disponible para iPhone (iOS 15+) y Android (12+).",
  },
  en: {
    pill: "Get started",
    titleA: "Your money,",
    titleHighlight: "in control",
    bodyPre: "Get Finy in 30 seconds. Log your first expense by voice, photo or typing. No credit card.",
    bodyBold: "14-day PRO trial free.",
    note: "Available on iPhone (iOS 15+) and Android (12+).",
  },
}

export function CTAFinal() {
  const t = useT(COPY)
  return (
    <section id="descargar" className="relative bg-zinc-950 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20">
      {/* Big lime glow */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.7), transparent 70%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#CEFD55]/10 ring-1 ring-[#CEFD55]/30 px-3.5 py-1.5 text-[12px] font-semibold tracking-wider uppercase text-[#CEFD55]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.pill}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 text-[44px] sm:text-[64px] lg:text-[80px] font-extrabold tracking-tight leading-[0.96]"
            >
              {t.titleA}
              <br />
              <span className="text-[#CEFD55]">{t.titleHighlight}</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 text-[18px] text-zinc-300 max-w-md leading-relaxed"
            >
              {t.bodyPre} <span className="font-semibold text-white">{t.bodyBold}</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-9"
            >
              <StoreBadges />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-[12px] text-zinc-500"
            >
              {t.note}
            </motion.p>
          </div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <PhoneFrame screens={CTA_SCREENS} className="!max-w-[320px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
