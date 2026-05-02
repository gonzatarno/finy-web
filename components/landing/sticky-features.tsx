"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Mic, Camera, MessageCircle, Sparkles } from "lucide-react"

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

const FEATURES: Feature[] = [
  {
    icon: <Mic className="h-5 w-5" />,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    eyebrow: "Por audio",
    title: "Hablale al teléfono",
    body:
      "Tocá el micrófono, decile en qué gastaste y listo. Detecta monto, categoría y método solo. Como decirle a un amigo cuánto saliste.",
    bullets: [
      "Detección automática de monto y comercio",
      "Sin formularios, sin tipear",
      "Funciona también con notas en cualquier idioma",
    ],
    screen: "/screens/chat-add.png",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    eyebrow: "Por foto",
    title: "Sacale foto al ticket",
    body:
      "Saca la foto y la IA lee monto, fecha y comercio. Funciona con tickets en mal estado, capturas de transferencia y resúmenes bancarios completos.",
    bullets: [
      "Tickets físicos, comprobantes digitales o pantallazos",
      "Resúmenes bancarios PDF: extrae cada movimiento",
      "Detecta cuotas y las divide automáticamente",
    ],
    screen: "/screens/transactions.png",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    eyebrow: "Por chat",
    title: "Pregúntale lo que sea",
    body:
      "¿Cuánto gasté en delivery? ¿Puedo pagarlo en 6 cuotas? ¿En qué se me fue la plata? La IA conoce tu historial y te responde con tus números reales.",
    bullets: [
      "Asesor financiero personal con tus datos",
      '"¿Lo puedo comprar?" — analiza si te conviene',
      "Crear presupuestos y metas conversando",
    ],
    screen: "/screens/chat-advisor.png",
  },
]

export function StickyFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // 3 segments for 3 features
  const N = FEATURES.length

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
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          {/* Eyebrow general */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#CEFD55] mb-3 lg:mb-4 text-center"
          >
            Cómo funciona
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[34px] sm:text-[48px] lg:text-[60px] font-extrabold tracking-tight text-center text-white max-w-3xl mx-auto leading-[1.05] mb-10 lg:mb-14"
          >
            Tres formas de cargar gastos.{" "}
            <span className="text-zinc-400">Cero esfuerzo.</span>
          </motion.h2>

          {/* CONTENIDO DE 2 COLUMNAS */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* TEXTO IZQUIERDA — un feature visible a la vez */}
            <div className="relative h-[420px]">
              {FEATURES.map((f, i) => {
                const start = i / N
                const end = (i + 1) / N
                const opacity = useTransform(
                  scrollYProgress,
                  [
                    Math.max(start - 0.05, 0),
                    start + 0.05,
                    end - 0.05,
                    Math.min(end + 0.05, 1),
                  ],
                  [0, 1, 1, 0],
                )
                const y = useTransform(
                  scrollYProgress,
                  [start, end],
                  [20, -20],
                )
                return (
                  <motion.div
                    key={f.title}
                    style={{ opacity, y }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconBg} ${f.iconColor}`}>
                        {f.icon}
                      </div>
                      <span className="text-[12px] font-bold tracking-wider uppercase text-[#CEFD55]">
                        {f.eyebrow}
                      </span>
                    </div>
                    <h3 className="text-[32px] sm:text-[44px] font-extrabold tracking-tight leading-[1.05] text-white">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-zinc-400 max-w-md">
                      {f.body}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-[14px] text-zinc-200">
                          <Sparkles className="h-4 w-4 text-[#CEFD55] mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>

            {/* PHONE DERECHA — cambia de imagen según scroll */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-12 rounded-[60px] opacity-50 blur-3xl"
                  style={{
                    background: "radial-gradient(closest-side, rgba(206,253,85,0.4), rgba(206,253,85,0) 70%)",
                  }}
                />
                <div className="relative w-full" style={{ aspectRatio: "393 / 852" }}>
                  <div className="absolute inset-0 rounded-[52px] bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-zinc-800" />
                  <div className="absolute inset-[10px] overflow-hidden rounded-[44px] bg-black">
                    {FEATURES.map((f, i) => {
                      const start = i / N
                      const end = (i + 1) / N
                      const opacity = useTransform(
                        scrollYProgress,
                        [
                          Math.max(start - 0.03, 0),
                          start + 0.03,
                          end - 0.03,
                          Math.min(end + 0.03, 1),
                        ],
                        [0, 1, 1, 0],
                      )
                      const scale = useTransform(scrollYProgress, [start, end], [1.04, 1])
                      return (
                        <motion.div
                          key={f.screen}
                          style={{ opacity, scale }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={f.screen}
                            alt={f.title}
                            fill
                            sizes="340px"
                            className="object-cover"
                          />
                        </motion.div>
                      )
                    })}
                    {/* Dynamic Island */}
                    <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-[28px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicador (puntitos) */}
          <div className="mt-10 flex justify-center gap-2">
            {FEATURES.map((_, i) => {
              const start = i / N
              const end = (i + 1) / N
              const w = useTransform(scrollYProgress, [start, end], ["6px", "32px"])
              const bg = useTransform(
                scrollYProgress,
                [
                  Math.max(start - 0.05, 0),
                  start + 0.05,
                  end - 0.05,
                  Math.min(end + 0.05, 1),
                ],
                ["#3f3f46", "#CEFD55", "#CEFD55", "#3f3f46"],
              )
              return (
                <motion.span
                  key={i}
                  style={{ width: w, backgroundColor: bg }}
                  className="h-1.5 rounded-full transition-all"
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
