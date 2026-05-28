"use client"

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Mic, Camera, MessageCircle, Sparkles, Star, ArrowDown } from "lucide-react"
import { PhoneFrame } from "./phone-frame"
import { StoreBadges } from "./store-badges"
import { useT } from "@/hooks/use-t"
import { useLanguage } from "@/contexts/language-context"

const ROTATING_WORDS = {
  es: ["voz",   "foto",  "chat", "IA"],
  en: ["voice", "photo", "chat", "AI"],
}

const COPY = {
  es: {
    pillL: "Asistente financiero",
    pillM: "con IA",
    pillR: "14 días",
    pillRStrong: "PRO gratis",
    headlineLead: "Anota gastos",
    headlineMid:  "con",
    subPre:  "Háblale, saca foto del ticket o escríbele.",
    subBold: "La IA de Finy lo carga todo por ti.",
    subPost: "En 1 minuto sabes cuánto gastaste este mes.",
    proof: "220+ usuarios · iPhone & Android · 40+ monedas",
    scrollHint: "Mira cómo funciona",
    floatMsg: '"Pagué 25 en delivery"',
    floatMsgMeta: "Audio · 2s",
    floatTickEyebrow: "Ticket leído",
    floatTickReady: "✓ Listo",
    floatTickStore: "Comercio",
    floatTickStoreVal: "Supermercado",
    floatTickTotal: "Total",
    floatTickTotalVal: "$28.50",
    floatChip: "✓ Cargado",
  },
  en: {
    pillL: "AI-powered",
    pillM: "money assistant",
    pillR: "14-day",
    pillRStrong: "PRO trial",
    headlineLead: "Track expenses",
    headlineMid:  "with",
    subPre:  "Talk to it, snap your receipt or type.",
    subBold: "Finy's AI logs everything for you.",
    subPost: "In one minute you know what you've spent this month.",
    proof: "220+ users · iPhone & Android · 40+ currencies",
    scrollHint: "See how it works",
    floatMsg: '"Yesterday I paid $25 on delivery"',
    floatMsgMeta: "Voice · 2s",
    floatTickEyebrow: "Receipt scanned",
    floatTickReady: "✓ Done",
    floatTickStore: "Store",
    floatTickStoreVal: "Whole Foods",
    floatTickTotal: "Total",
    floatTickTotalVal: "$28.50",
    floatChip: "✓ Logged",
  },
}

// Contador que tickea de 0 → target con ease-out cubic
function CountUp({ to, duration = 2 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{n.toLocaleString("es-AR")}</>
}

const HERO_SCREENS = [
  { src: "/screens/chat-add.png",     alt: "Asistente IA de Finy",         label: "IA Chat" },
  { src: "/screens/home.png",         alt: "Pantalla principal de Finy",   label: "Inicio" },
  { src: "/screens/stats.png",        alt: "Análisis IA mensual",          label: "IA Stats" },
  { src: "/screens/transactions.png", alt: "Movimientos con cuotas",       label: "Movimientos" },
]

export function Hero() {
  const t = useT(COPY)
  const { language } = useLanguage()
  const words = ROTATING_WORDS[language as "es" | "en"] ?? ROTATING_WORDS.es

  // 3D tilt seguidor del mouse en el phone
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 14 })
  const sy = useSpring(my, { stiffness: 80, damping: 14 })
  const rotY = useTransform(sx, [-1, 1], [10, -10])
  const rotX = useTransform(sy, [-1, 1], [-8, 8])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width  // 0..1
    const py = (e.clientY - r.top) / r.height // 0..1
    mx.set(px * 2 - 1)
    my.set(py * 2 - 1)
  }
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  // Word rotator del headline
  const [wIdx, setWIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWIdx((i) => (i + 1) % words.length), 2400)
    return () => clearInterval(id)
  }, [words.length])

  // Cursor glow seguidor (efecto premium)
  const sectionRef = useRef<HTMLElement>(null)
  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)
  const sgx = useSpring(glowX, { stiffness: 100, damping: 20 })
  const sgy = useSpring(glowY, { stiffness: 100, damping: 20 })
  const onSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    glowX.set(e.clientX - r.left)
    glowY.set(e.clientY - r.top)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onSectionMove}
      id="inicio"
      className="relative isolate overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28"
    >
      {/* Mesh gradient background animado */}
      <div className="absolute inset-0 mesh-bg -z-10" aria-hidden />
      {/* Cursor glow — efecto premium que sigue al mouse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 hidden lg:block w-[600px] h-[600px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(206,253,85,0.55), rgba(206,253,85,0) 70%)",
          x: sgx,
          y: sgy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Fade superior para que el nav respire */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent -z-10" aria-hidden />
      {/* Fade inferior para corte limpio con la siguiente sección */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent -z-10" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12 items-center">
          {/* TEXTO */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pre-headline pill con dot animado — IA first */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300/60 bg-white/80 backdrop-blur px-3.5 py-1.5 text-[12px] font-medium text-zinc-800 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7AB23A]" />
              <span className="text-zinc-700">
                {t.pillL} <span className="font-bold text-zinc-900">{t.pillM}</span>
              </span>
              <span className="h-3 w-px bg-zinc-300" />
              <span className="text-zinc-700">{t.pillR} <span className="font-bold text-zinc-900">{t.pillRStrong}</span></span>
            </motion.div>

            {/* Headline GIGANTE con palabra rotando */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[52px] sm:text-[80px] lg:text-[100px] font-extrabold tracking-[-0.04em] text-zinc-950 leading-[0.92]"
            >
              {t.headlineLead}
              <br />
              <span className="text-zinc-400">{t.headlineMid}</span>{" "}
              <span className="relative inline-block align-baseline" style={{ minWidth: "1ch" }}>
                <span className="invisible">{words.reduce((max, w) => (w.length > max.length ? w : max), "")}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={words[wIdx]}
                    initial={{ y: "0.45em", opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-0.45em", opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 lime-underline whitespace-nowrap"
                  >
                    {words[wIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-zinc-950">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-[18px] sm:text-[20px] leading-relaxed text-zinc-700 max-w-xl mx-auto lg:mx-0"
            >
              {t.subPre}{" "}
              <span className="font-semibold text-zinc-900">{t.subBold}</span>{" "}
              {t.subPost}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col items-center lg:items-start gap-5"
            >
              <StoreBadges />

              {/* Línea sutil debajo de los CTAs — sin métricas vanity */}
              <p className="text-[13px] text-zinc-500">
                {t.proof}
              </p>
            </motion.div>

            {/* Scroll hint en mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="hidden lg:flex items-center gap-2 mt-12 text-[12px] font-medium text-zinc-500"
            >
              <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              {t.scrollHint}
            </motion.div>
          </div>

          {/* PHONE MOCKUP con tilt 3D */}
          <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative w-full max-w-[440px] mx-auto"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
              className="relative"
            >
              <PhoneFrame screens={HERO_SCREENS} className="!max-w-[340px]" />
            </motion.div>

            {/* Floating real-product cards (paleta disciplinada — solo lima + zinc) */}
            <FloatingMessageCard
              className="absolute -left-4 sm:-left-12 top-[12%] hidden sm:flex"
              delay={0.7}
              avatar={<Mic className="h-4 w-4 text-zinc-900" />}
              text={t.floatMsg}
              meta={t.floatMsgMeta}
            />
            <FloatingTickCard
              className="absolute -right-4 sm:-right-10 top-[40%] hidden sm:flex"
              delay={1.0}
              copy={{
                eyebrow: t.floatTickEyebrow,
                ready:   t.floatTickReady,
                store:   t.floatTickStore,
                storeVal:t.floatTickStoreVal,
                total:   t.floatTickTotal,
                totalVal:t.floatTickTotalVal,
              }}
            />
            <FloatingChipBubble
              className="absolute -left-2 sm:-left-8 bottom-[12%] hidden sm:flex"
              delay={1.3}
              text={t.floatChip}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Tarjetas flotantes que parecen pedacitos reales del producto ───────────
function FloatingMessageCard({
  className, delay, avatar, text, meta,
}: {
  className?: string; delay: number; avatar: React.ReactNode; text: string; meta: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, x: -8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${className} items-start gap-3 rounded-2xl bg-white/95 backdrop-blur px-3.5 py-3 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80 max-w-[220px]`}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CEFD55]">{avatar}</span>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-zinc-900 leading-tight">{text}</span>
        <span className="text-[10.5px] text-zinc-500 mt-1">{meta}</span>
      </div>
    </motion.div>
  )
}

function FloatingTickCard({
  className, delay, copy,
}: {
  className?: string
  delay: number
  copy: { eyebrow: string; ready: string; store: string; storeVal: string; total: string; totalVal: string }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${className} flex-col gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80 min-w-[200px]`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
          <Camera className="h-3 w-3" /> {copy.eyebrow}
        </span>
        <span className="text-[10px] font-semibold text-emerald-600">{copy.ready}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-500">{copy.store}</span>
          <span className="font-semibold text-zinc-900">{copy.storeVal}</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-500">{copy.total}</span>
          <span className="font-semibold text-zinc-900">{copy.totalVal}</span>
        </div>
      </div>
    </motion.div>
  )
}

function FloatingChipBubble({
  className, delay, text,
}: {
  className?: string; delay: number; text: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${className} items-center gap-2 rounded-full bg-zinc-950 text-white px-4 py-2 shadow-xl shadow-zinc-900/30`}
    >
      <span className="text-[12px] font-semibold whitespace-nowrap">{text}</span>
    </motion.div>
  )
}
