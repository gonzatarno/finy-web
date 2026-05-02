"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Screen {
  src: string
  alt: string
  label?: string
}

interface PhoneFrameProps {
  screens: Screen[]
  intervalMs?: number
  className?: string
}

/**
 * Marco de iPhone con dynamic island. Rota una serie de screenshots con fade.
 * Usa aspect-ratio fijo 393:852 (iPhone Pro). Se ajusta proporcionalmente al ancho.
 */
export function PhoneFrame({ screens, intervalMs = 3500, className }: PhoneFrameProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (screens.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % screens.length), intervalMs)
    return () => clearInterval(id)
  }, [screens.length, intervalMs])

  const current = screens[index]

  return (
    <div className={cn("relative w-full max-w-[340px] mx-auto", className)}>
      {/* Halo verde detrás */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-[60px] opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(206,253,85,0.35), rgba(206,253,85,0) 70%)",
        }}
      />

      {/* Marco del iPhone */}
      <div className="relative w-full" style={{ aspectRatio: "393 / 852" }}>
        {/* Bezel exterior */}
        <div className="absolute inset-0 rounded-[52px] bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-zinc-800/80" />
        {/* Bezel interior brillo sutil */}
        <div className="absolute inset-[3px] rounded-[49px] bg-gradient-to-br from-zinc-700/30 via-transparent to-zinc-900/40" />

        {/* Pantalla */}
        <div className="absolute inset-[10px] overflow-hidden rounded-[44px] bg-black">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                priority
                sizes="340px"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-[28px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>

      {/* Indicadores */}
      {screens.length > 1 && (
        <div className="mt-5 flex justify-center gap-1.5">
          {screens.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400",
              )}
              aria-label={`Ver ${s.label || `pantalla ${i + 1}`}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
