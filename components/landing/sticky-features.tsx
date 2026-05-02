"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Mic, Camera, MessageCircle, Sparkles } from "lucide-react"
import { useT } from "@/hooks/use-t"

interface Feature {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  eyebrow: string
  title: string
  body: string
  bullets: string[]
  screen: string
}

const COPY = {
  es: {
    eyebrow: "Cómo funciona",
    titleA: "Tres formas de cargar gastos.",
    titleB: "Cero esfuerzo.",
    features: [
      {
        eyebrow: "Por audio",
        title: "Háblale a la IA",
        body: "Toca el micrófono, dile en qué gastaste y la IA detecta monto, categoría y método sola. Como contarle a un amigo cuánto te gastaste.",
        bullets: [
          "Detección automática de monto, categoría y comercio",
          "Sin formularios, sin escribir",
          "Funciona en cualquier idioma",
        ],
      },
      {
        eyebrow: "Por foto",
        title: "Saca foto del ticket",
        body: "Toma la foto y la IA lee monto, fecha y comercio. Funciona con tickets en mal estado, capturas de transferencia y resúmenes bancarios completos.",
        bullets: [
          "Tickets físicos, comprobantes digitales o capturas",
          "Resúmenes bancarios PDF: extrae cada movimiento",
          "Detecta pagos a cuotas y los divide automáticamente",
        ],
      },
      {
        eyebrow: "Por chat",
        title: "Pregúntale lo que sea",
        body: "¿Cuánto gasté en delivery? ¿Puedo pagarlo en 6 cuotas? ¿En qué se fue mi dinero? La IA conoce tu historial y te responde con tus números reales.",
        bullets: [
          "Asesor financiero personal con tus datos",
          '"¿Me conviene?" — analiza si puedes comprarlo',
          "Crea presupuestos y metas conversando",
        ],
      },
    ],
  },
  en: {
    eyebrow: "How it works",
    titleA: "Three ways to log expenses.",
    titleB: "Zero effort.",
    features: [
      {
        eyebrow: "By voice",
        title: "Talk to the AI",
        body: "Tap the mic, tell it what you spent and the AI detects amount, category and payment method on its own. Like telling a friend what you bought.",
        bullets: [
          "Automatic detection of amount, category and merchant",
          "No forms, no typing",
          "Works in any language",
        ],
      },
      {
        eyebrow: "By photo",
        title: "Snap your receipt",
        body: "Take the photo and the AI reads amount, date and merchant. Works with damaged receipts, transfer screenshots and full bank statements.",
        bullets: [
          "Physical receipts, digital invoices or screenshots",
          "PDF bank statements: extracts every transaction",
          "Detects installments and splits them automatically",
        ],
      },
      {
        eyebrow: "By chat",
        title: "Ask anything",
        body: "How much did I spend on delivery? Can I afford it in 6 installments? Where did my money go? The AI knows your history and answers with your real numbers.",
        bullets: [
          "Personal financial advisor with your real data",
          '"Should I buy it?" — analyzes if it suits you',
          "Create budgets and goals conversationally",
        ],
      },
    ],
  },
}

const ICONS = [
  { icon: <Mic className="h-5 w-5" />,           iconBg: "bg-violet-500/15",  iconColor: "text-violet-300",  screen: "/screens/audio.png" },
  { icon: <Camera className="h-5 w-5" />,        iconBg: "bg-sky-500/15",     iconColor: "text-sky-300",     screen: "/screens/escaner.png" },
  { icon: <MessageCircle className="h-5 w-5" />, iconBg: "bg-emerald-500/15", iconColor: "text-emerald-300", screen: "/screens/chat-advisor.png" },
]

const N = 3
const CROSS = 0.06 // ancho del crossfade entre features

// Genera los stops/values para opacity de la feature i.
// - Feature 0 arranca visible y se desvanece al final de su segmento.
// - Feature N-1 arranca a 0 y queda visible hasta el final.
// - Las del medio aparecen y desaparecen.
function fadeKeyframes(i: number, n: number, cross: number) {
  const start = i / n
  const end = (i + 1) / n
  if (i === 0) {
    return {
      stops: [0, end - cross, end + cross],
      values: [1, 1, 0],
    }
  }
  if (i === n - 1) {
    return {
      stops: [start - cross, start + cross, 1],
      values: [0, 1, 1],
    }
  }
  return {
    stops: [start - cross, start + cross, end - cross, end + cross],
    values: [0, 1, 1, 0],
  }
}

export function StickyFeatures() {
  const t = useT(COPY)
  const FEATURES: Feature[] = t.features.map((f, i) => ({
    ...f,
    icon: ICONS[i].icon,
    iconBg: ICONS[i].iconBg,
    iconColor: ICONS[i].iconColor,
    screen: ICONS[i].screen,
  }))

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Hooks llamados afuera del map, con índice fijo.
  const f0 = fadeKeyframes(0, N, CROSS)
  const f1 = fadeKeyframes(1, N, CROSS)
  const f2 = fadeKeyframes(2, N, CROSS)
  const opacity0 = useTransform(scrollYProgress, f0.stops, f0.values)
  const opacity1 = useTransform(scrollYProgress, f1.stops, f1.values)
  const opacity2 = useTransform(scrollYProgress, f2.stops, f2.values)
  const opacities: MotionValue<number>[] = [opacity0, opacity1, opacity2]

  // Pequeño parallax vertical en el texto
  const ty0 = useTransform(scrollYProgress, [0, 1 / N], [0, -10])
  const ty1 = useTransform(scrollYProgress, [1 / N, 2 / N], [10, -10])
  const ty2 = useTransform(scrollYProgress, [2 / N, 1], [10, 0])
  const ys: MotionValue<number>[] = [ty0, ty1, ty2]

  // Indicador progress
  const dotW0 = useTransform(scrollYProgress, [0, 1 / N], ["32px", "32px"])
  const dotW1 = useTransform(scrollYProgress, [0, 1 / N, 2 / N], ["6px", "32px", "32px"])
  const dotW2 = useTransform(scrollYProgress, [0, 2 / N, 1], ["6px", "6px", "32px"])
  const dotWs = [dotW0, dotW1, dotW2]

  return (
    <section
      id="como-funciona"
      ref={ref}
      className="relative bg-zinc-950 text-white"
      style={{ minHeight: `${N * 100}vh` }}
    >
      {/* Grid sutil de fondo */}
      <div className="absolute inset-0 bg-grid-dark opacity-50 pointer-events-none" aria-hidden />
      {/* Halo lima en el top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-25"
        style={{
          background: "radial-gradient(50% 50% at 50% 0%, rgba(206,253,85,0.4), transparent)",
        }}
        aria-hidden
      />

      {/* SECCIÓN STICKY */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-6 flex-shrink-0">
          {/* Eyebrow + title (arriba, no centrado vertical) */}
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#CEFD55] mb-3 text-center">
            {t.eyebrow}
          </p>
          <h2 className="text-[26px] sm:text-[36px] lg:text-[48px] font-extrabold tracking-tight text-center text-white max-w-3xl mx-auto leading-[1.05]">
            {t.titleA}{" "}
            <span className="text-zinc-500">{t.titleB}</span>
          </h2>
        </div>

        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex-1 flex items-center">
          {/* CONTENIDO DE 2 COLUMNAS */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
            {/* TEXTO IZQUIERDA — un feature visible a la vez */}
            <div className="relative h-[400px] lg:h-[440px]">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  style={{ opacity: opacities[i], y: ys[i] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconBg} ${f.iconColor} ring-1 ring-white/10`}
                    >
                      {f.icon}
                    </div>
                    <span className="text-[12px] font-bold tracking-wider uppercase text-[#CEFD55]">
                      {f.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-[30px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-tight leading-[1.05] text-white">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-[15px] sm:text-[17px] leading-relaxed text-zinc-400 max-w-md">
                    {f.body}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[14px] text-zinc-200">
                        <Sparkles className="h-4 w-4 text-[#CEFD55] mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* PHONE DERECHA — cambia de imagen según scroll */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[300px] sm:max-w-[320px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-12 rounded-[60px] opacity-50 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(206,253,85,0.4), rgba(206,253,85,0) 70%)",
                  }}
                />
                <div className="relative w-full" style={{ aspectRatio: "393 / 852" }}>
                  <div className="absolute inset-0 rounded-[52px] bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-zinc-800" />
                  <div className="absolute inset-[10px] overflow-hidden rounded-[44px] bg-white">
                    {FEATURES.map((f, i) => (
                      <motion.div
                        key={f.screen}
                        style={{ opacity: opacities[i] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={f.screen}
                          alt={f.title}
                          fill
                          sizes="320px"
                          className="object-cover"
                          priority={i === 0}
                        />
                      </motion.div>
                    ))}
                    {/* Dynamic Island */}
                    <div
                      className="pointer-events-none absolute left-1/2 top-2 z-10 h-[28px] w-[110px] -translate-x-1/2 rounded-full bg-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Progress indicador (fuera del flex item-center para quedar abajo) */}
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 flex-shrink-0">
          <div className="flex justify-center gap-2">
            {FEATURES.map((_, i) => (
              <motion.span
                key={i}
                style={{ width: dotWs[i] }}
                className="h-1.5 rounded-full bg-[#CEFD55]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
