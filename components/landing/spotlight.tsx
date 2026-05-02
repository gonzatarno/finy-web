"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  id?: string
  variant?: "light" | "dark"
  imagePosition?: "left" | "right"
  eyebrow: string
  title: React.ReactNode
  body: string
  image: string
  imageAlt: string
  /** Highlight para usar el lima sobre parte del título */
  highlight?: string
}

/**
 * Sección "spotlight": una sola idea, un solo visual, mucho aire.
 * Paleta limitada (negro/blanco/lima). Estilo Apple iPhone landing / Linear.
 */
export function Spotlight({
  id,
  variant = "light",
  imagePosition = "right",
  eyebrow,
  title,
  body,
  image,
  imageAlt,
}: SpotlightProps) {
  const dark = variant === "dark"

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8",
        dark ? "bg-zinc-950 text-white" : "bg-white text-zinc-950",
      )}
    >
      {/* Halo lima muy sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.18] blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(206,253,85,0.7), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-14 lg:gap-20 items-center",
            imagePosition === "left" && "lg:[&>*:first-child]:order-2",
          )}
        >
          {/* TEXTO */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p
              className={cn(
                "text-[11px] font-semibold tracking-[0.24em] uppercase mb-5",
                dark ? "text-[#CEFD55]" : "text-zinc-500",
              )}
            >
              {eyebrow}
            </p>
            <h2
              className={cn(
                "text-[40px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.03em] leading-[0.98]",
                dark ? "text-white" : "text-zinc-950",
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "mt-7 text-[17px] sm:text-[19px] leading-relaxed max-w-md",
                dark ? "text-zinc-400" : "text-zinc-600",
              )}
            >
              {body}
            </p>
          </motion.div>

          {/* IMAGEN — phone full bleed sin marco recargado */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Halo lima atrás del phone */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-10 rounded-[60px] opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(206,253,85,0.45), rgba(206,253,85,0) 70%)",
                }}
              />
              <div className="relative w-full" style={{ aspectRatio: "393 / 852" }}>
                <div
                  className={cn(
                    "absolute inset-0 rounded-[52px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]",
                    dark ? "bg-zinc-900 ring-1 ring-zinc-800" : "bg-zinc-900 ring-1 ring-zinc-800",
                  )}
                />
                <div className="absolute inset-[10px] overflow-hidden rounded-[44px] bg-white">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-[28px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
