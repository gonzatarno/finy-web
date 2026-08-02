"use client"

import Image from "next/image"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

/**
 * El teléfono del hero, con volumen real.
 *
 * El marco anterior era un rectángulo gris con bordes redondeados: leía como un
 * dibujo, no como un objeto. Lo que hace que un mockup se sienta físico no es el
 * tilt 3D sino cuatro cosas que casi nunca se ponen:
 *
 *  1. Un canto metálico con degradé, no un color plano.
 *  2. Un brillo especular que se mueve *en contra* del tilt. Es el que convence
 *     al ojo de que hay vidrio.
 *  3. Sombra en dos capas: una de contacto, corta y densa, y una ambiente.
 *  4. El resplandor de la propia pantalla derramándose en el fondo. Sobre
 *     oscuro, esto es lo que más suma: la pantalla se ve encendida.
 */

export type Screen = { src: string; alt: string; label?: string }

const ASPECT = "393 / 852"

export function Device({
  screens,
  intervalMs = 3800,
  className = "",
}: {
  screens: Screen[]
  intervalMs?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (screens.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % screens.length), intervalMs)
    return () => clearInterval(id)
  }, [screens.length, intervalMs])

  // Tilt. Amortiguado fuerte: un teléfono tiene masa, no debe seguir al mouse
  // al instante.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 1.1 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 1.1 })

  const rotateY = useTransform(sx, [-1, 1], [16, -16])
  const rotateX = useTransform(sy, [-1, 1], [-12, 12])

  // El especular se desplaza en sentido contrario al giro: así el reflejo
  // parece venir de una luz fija en la sala.
  const glareX = useTransform(sx, [-1, 1], ["115%", "-15%"])
  const glareY = useTransform(sy, [-1, 1], ["-10%", "110%"])
  const glareOpacity = useTransform(sx, [-1, 0, 1], [0.5, 0.2, 0.5])

  // La sombra de contacto se corre con el giro, como si la luz no se moviera
  const shadowX = useTransform(sx, [-1, 1], [40, -40])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // El tilt escucha en window y no en el elemento: reaccionar sólo cuando el
    // mouse está encima del teléfono hace que el movimiento arranque de golpe.
    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      // Normalizado sobre un área más grande que el equipo, para que el giro
      // acompañe el recorrido del mouse por todo el hero
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 1.6))))
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 1.1))))
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [mx, my])

  const current = screens[index]

  return (
    <div ref={wrapRef} className={`relative mx-auto w-full max-w-[330px] ${className}`}>
      {/*
        Resplandor de pantalla: la misma captura, ampliada y desenfocada detrás
        del equipo. Es el truco que hace que la pantalla parezca encendida en
        vez de ser una imagen pegada.
      */}
      <div className="pointer-events-none absolute inset-0 -z-10 scale-[1.35] opacity-70 blur-[60px] saturate-150">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            className="relative h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image src={current.src} alt="" fill sizes="330px" className="object-cover" aria-hidden />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div style={{ perspective: 1500 }} className="relative">
        {/* Sombra de contacto: corta y densa, justo debajo del equipo */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-[-26px] h-10 rounded-[50%] bg-black/55 blur-2xl"
          style={{ x: shadowX }}
        />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Canto metálico. El degradé cruzado simula el chaflán del titanio. */}
          <div
            className="relative rounded-[54px] p-[3px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85),0_20px_50px_-20px_rgba(0,0,0,0.6)]"
            style={{
              background:
                "linear-gradient(150deg, #8e8e93 0%, #3a3a3c 18%, #1c1c1e 42%, #48484a 62%, #d1d1d6 78%, #2c2c2e 100%)",
              aspectRatio: ASPECT,
            }}
          >
            {/* Cuerpo negro entre el canto y el vidrio */}
            <div className="relative h-full w-full overflow-hidden rounded-[51px] bg-[#050505] p-[9px]">
              {/* Vidrio */}
              <div className="relative h-full w-full overflow-hidden rounded-[43px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),inset_0_2px_14px_rgba(0,0,0,0.9)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.src}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      priority
                      sizes="330px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Dynamic island */}
                <div className="pointer-events-none absolute left-1/2 top-[9px] z-20 h-[26px] w-[98px] -translate-x-1/2 rounded-full bg-black" />

                {/* Especular: la banda de luz que cruza el vidrio */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-[40%] z-10"
                  style={{
                    x: glareX,
                    y: glareY,
                    opacity: glareOpacity,
                    background:
                      "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.5) 47%, rgba(255,255,255,0.14) 53%, transparent 62%)",
                  }}
                />

                {/* Viñeta del vidrio: los bordes de una pantalla nunca son
                    tan brillantes como el centro */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{
                    background:
                      "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.28) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Brillo del canto superior, el que atrapa la luz del ambiente */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-16 top-0 h-px rounded-full bg-white/60"
            />
          </div>

          {/* Botones laterales, adelantados en Z para que se despeguen del canto */}
          <div
            aria-hidden
            className="absolute -left-[3px] top-[22%] h-11 w-[3px] rounded-l-sm bg-gradient-to-b from-[#6e6e73] to-[#2c2c2e]"
            style={{ transform: "translateZ(-6px)" }}
          />
          <div
            aria-hidden
            className="absolute -left-[3px] top-[32%] h-16 w-[3px] rounded-l-sm bg-gradient-to-b from-[#6e6e73] to-[#2c2c2e]"
            style={{ transform: "translateZ(-6px)" }}
          />
          <div
            aria-hidden
            className="absolute -right-[3px] top-[28%] h-20 w-[3px] rounded-r-sm bg-gradient-to-b from-[#6e6e73] to-[#2c2c2e]"
            style={{ transform: "translateZ(-6px)" }}
          />
        </motion.div>
      </motion.div>

      {/* Selector de pantalla */}
      {screens.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {screens.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setIndex(i)}
              aria-label={`Ver ${s.label ?? `pantalla ${i + 1}`}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-7 bg-[#CEFD55]" : "w-1.5 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
