"use client"

import { useEffect, useRef } from "react"

/**
 * Fondo interactivo del hero oscuro: luz que se mueve bajo el vidrio.
 *
 * No dice nada literal a propósito. La versión anterior mostraba dígitos y el
 * problema no era técnico: alguien que entra no tiene por qué descifrar un
 * fondo. Esto es sólo luz — se siente caro y no pide ser interpretado.
 *
 * Truco de performance: el canvas se dibuja a un sexto de la resolución y se
 * escala por CSS. Al agrandarlo, la interpolación del navegador hace el
 * degradado gratis, así que pintar cinco manchas por frame cuesta nada.
 */

type Blob = {
  /** centro base, en fracción del lienzo */
  bx: number
  by: number
  /** amplitud y velocidad de la deriva */
  ax: number
  ay: number
  sx: number
  sy: number
  phase: number
  radius: number
  color: [number, number, number]
  /** cuánto la atrae el puntero (0 = ignora, 1 = lo persigue) */
  pull: number
}

const BLOBS: Blob[] = [
  { bx: 0.24, by: 0.3,  ax: 0.1,  ay: 0.08, sx: 0.11, sy: 0.14, phase: 0.0, radius: 0.55, color: [206, 253, 85],  pull: 0.42 },
  { bx: 0.74, by: 0.26, ax: 0.09, ay: 0.1,  sx: 0.09, sy: 0.12, phase: 1.7, radius: 0.48, color: [110, 231, 215], pull: 0.3 },
  { bx: 0.5,  by: 0.72, ax: 0.12, ay: 0.07, sx: 0.07, sy: 0.1,  phase: 3.1, radius: 0.62, color: [122, 178, 58],  pull: 0.2 },
  { bx: 0.88, by: 0.66, ax: 0.07, ay: 0.09, sx: 0.13, sy: 0.08, phase: 4.4, radius: 0.4,  color: [206, 253, 85],  pull: 0.5 },
  { bx: 0.12, by: 0.78, ax: 0.08, ay: 0.06, sx: 0.1,  sy: 0.15, phase: 5.6, radius: 0.44, color: [70, 200, 190],  pull: 0.26 },
]

/** El lienzo real es diminuto; el CSS lo estira. */
const BUFFER_W = 220
const EASE = 0.055

export function AuroraField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = BUFFER_W
    let h = BUFFER_W
    let raf = 0
    let visible = true
    let lastTime = 0

    // Puntero normalizado 0..1, con inercia. Arranca en el centro para que no
    // haya un salto en el primer movimiento del mouse.
    let tx = 0.5
    let ty = 0.45
    let cx = 0.5
    let cy = 0.45

    function resize() {
      const rect = parent!.getBoundingClientRect()
      const ratio = rect.height / Math.max(rect.width, 1)
      w = BUFFER_W
      h = Math.max(1, Math.round(BUFFER_W * ratio))
      canvas!.width = w
      canvas!.height = h
      draw(lastTime)
    }

    function draw(time: number) {
      const t = reduced ? 0 : time / 1000

      // Base oscura
      ctx!.globalCompositeOperation = "source-over"
      ctx!.fillStyle = "#07090a"
      ctx!.fillRect(0, 0, w, h)

      if (!reduced) {
        cx += (tx - cx) * EASE
        cy += (ty - cy) * EASE
      }

      // Las manchas se suman entre sí: donde se cruzan, la luz se acumula
      ctx!.globalCompositeOperation = "lighter"

      for (const b of BLOBS) {
        const driftX = b.bx + (reduced ? 0 : Math.sin(t * b.sx + b.phase) * b.ax)
        const driftY = b.by + (reduced ? 0 : Math.cos(t * b.sy + b.phase) * b.ay)

        // Mezcla entre la deriva propia y la posición del puntero
        const x = (driftX + (cx - driftX) * b.pull) * w
        const y = (driftY + (cy - driftY) * b.pull) * h
        const r = b.radius * w

        const g = ctx!.createRadialGradient(x, y, 0, x, y, r)
        const [cr, cg, cb] = b.color
        g.addColorStop(0, `rgba(${cr},${cg},${cb},0.26)`)
        g.addColorStop(0.45, `rgba(${cr},${cg},${cb},0.06)`)
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(x, y, r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Viñeta hacia los bordes
      ctx!.globalCompositeOperation = "source-over"
      const vg = ctx!.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.78)
      vg.addColorStop(0, "rgba(7,9,10,0)")
      vg.addColorStop(0.55, "rgba(7,9,10,0.35)")
      vg.addColorStop(1, "rgba(7,9,10,0.92)")
      ctx!.fillStyle = vg
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalCompositeOperation = "lighter"

      // Núcleo brillante justo bajo el puntero: es lo que hace que se lea como
      // interactivo y no como un degradé animado cualquiera.
      const hx = cx * w
      const hy = cy * h
      const hr = 0.3 * w
      const hg = ctx!.createRadialGradient(hx, hy, 0, hx, hy, hr)
      hg.addColorStop(0, "rgba(206,253,85,0.2)")
      hg.addColorStop(0.5, "rgba(206,253,85,0.045)")
      hg.addColorStop(1, "rgba(206,253,85,0)")
      ctx!.fillStyle = hg
      ctx!.beginPath()
      ctx!.arc(hx, hy, hr, 0, Math.PI * 2)
      ctx!.fill()
    }

    function loop(time: number) {
      lastTime = time
      if (visible && !document.hidden) draw(time)
      raf = requestAnimationFrame(loop)
    }

    function onMove(e: PointerEvent) {
      const rect = parent!.getBoundingClientRect()
      tx = Math.max(-0.2, Math.min(1.2, (e.clientX - rect.left) / rect.width))
      ty = Math.max(-0.2, Math.min(1.2, (e.clientY - rect.top) / rect.height))
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(parent)
    window.addEventListener("pointermove", onMove, { passive: true })

    if (!reduced) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      // El blur suaviza los saltos de la interpolación al agrandar el lienzo
      style={{ filter: "blur(28px) saturate(125%)", transform: "scale(1.12)" }}
    />
  )
}
