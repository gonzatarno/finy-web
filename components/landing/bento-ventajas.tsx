"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Globe, Users, Repeat, BarChart3, Smartphone, Sparkles, Lock, Bell } from "lucide-react"

export function BentoVentajas() {
  return (
    <section id="ventajas" className="relative bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Bg grid sutil */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.6), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Eyebrow + title */}
        <div className="text-center mb-14 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[12px] font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-3"
          >
            Por qué Finy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[36px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-tight text-zinc-950 leading-[0.98] max-w-4xl mx-auto"
          >
            La app de finanzas
            <br />
            <span className="lime-underline">hecha para vos</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-[17px] text-zinc-600 max-w-2xl mx-auto"
          >
            Todo lo que esperás de una app de gastos, sin la fricción de tener que abrir una planilla.
          </motion.p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 auto-rows-[minmax(200px,auto)]">
          {/* 1. AI Cerebro — big hero card */}
          <BentoCard
            className="md:col-span-2 md:row-span-2 bg-zinc-950 text-white"
            decorative={
              <>
                <div
                  className="pointer-events-none absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-40 blur-3xl"
                  style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.7), transparent 70%)" }}
                />
                <div className="absolute inset-0 bg-grid-dark opacity-50 pointer-events-none" aria-hidden />
              </>
            }
          >
            <div className="relative h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#CEFD55]/10 ring-1 ring-[#CEFD55]/30 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#CEFD55] mb-5">
                  <Sparkles className="h-3 w-3" />
                  IA Cerebro
                </div>
                <h3 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight leading-tight">
                  Tu asesor financiero
                  <br />
                  <span className="text-zinc-400">personalizado.</span>
                </h3>
                <p className="mt-4 text-[15px] text-zinc-300 max-w-md leading-relaxed">
                  No es un chatbot genérico. Conoce tu historial, detecta patrones y te dice
                  qué hacer con tu plata cada mes.
                </p>
              </div>

              {/* Mock chat con la IA */}
              <div className="mt-8 space-y-2.5">
                <div className="ml-auto max-w-[80%] bg-[#CEFD55] text-black text-[14px] rounded-2xl rounded-br-sm px-4 py-2.5 font-medium">
                  ¿En qué se me fue la plata este mes?
                </div>
                <div className="max-w-[88%] bg-zinc-900 ring-1 ring-zinc-800 text-zinc-100 text-[14px] rounded-2xl rounded-bl-sm px-4 py-3 leading-relaxed">
                  Gastaste <strong className="text-white">$485.200</strong>. El 38% se fue en{" "}
                  <strong className="text-[#CEFD55]">Salidas</strong>{" "}
                  ($184k) — un 24% más que en marzo. ¿Querés que te arme un presupuesto?
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Multi-currency */}
          <BentoCard className="bg-gradient-to-br from-violet-50 to-violet-100/50">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/30">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-violet-700 bg-white/70 ring-1 ring-violet-200 rounded-full px-2.5 py-1">
                  Universal
                </span>
              </div>
              <h3 className="text-[26px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                40+ monedas
              </h3>
              <p className="mt-2 text-[14px] text-zinc-700">
                ARS, USD, EUR, BRL, MXN, COP, CLP, UYU, PEN y más. Cada gasto en su moneda original.
              </p>
              <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                {["🇦🇷 ARS", "🇺🇸 USD", "🇪🇺 EUR", "🇧🇷 BRL", "🇲🇽 MXN", "🇨🇴 COP", "🇨🇱 CLP"].map((f) => (
                  <span key={f} className="text-[11px] font-medium bg-white/80 ring-1 ring-violet-200/80 text-zinc-700 rounded-full px-2.5 py-1">
                    {f}
                  </span>
                ))}
                <span className="text-[11px] font-medium text-violet-700 bg-violet-200/50 rounded-full px-2.5 py-1">
                  +33 más
                </span>
              </div>
            </div>
          </BentoCard>

          {/* 3. Mercado Pago sync */}
          <BentoCard className="bg-gradient-to-br from-sky-50 to-cyan-50">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/30">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-sky-700 bg-white/70 ring-1 ring-sky-200 rounded-full px-2.5 py-1">
                  Auto-sync
                </span>
              </div>
              <h3 className="text-[26px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                Conectá Mercado Pago
              </h3>
              <p className="mt-2 text-[14px] text-zinc-700">
                Tus pagos se sincronizan solos. Cero re-tipear lo que ya está en tu cuenta.
              </p>
              <div className="mt-auto pt-5">
                <div className="flex items-center gap-2 rounded-xl bg-white/80 ring-1 ring-sky-200 p-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-[14px] font-bold">
                    💸
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-zinc-900 truncate">
                      Café Martinez
                    </p>
                    <p className="text-[10px] text-zinc-500">Hoy · 09:14</p>
                  </div>
                  <span className="text-[12px] font-bold text-rose-500 tabular-nums">-$3.200</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 4. Espacios compartidos */}
          <BentoCard className="md:col-span-2 bg-emerald-50/60 ring-emerald-100">
            <div className="grid sm:grid-cols-2 gap-6 h-full items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-[26px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                  Espacios compartidos
                </h3>
                <p className="mt-2 text-[14px] text-zinc-700 max-w-xs leading-relaxed">
                  Casa, viaje, negocio. Dividí gastos con tu pareja, familia o socios. Cada uno aporta lo suyo y Finy hace las cuentas.
                </p>
              </div>
              <div className="relative w-full aspect-[3/2.4] rounded-2xl overflow-hidden ring-1 ring-emerald-200/80 shadow-md">
                <Image
                  src="/screens/spaces.png"
                  alt="Espacios compartidos en Finy"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </BentoCard>

          {/* 5. Estadísticas */}
          <BentoCard className="bg-gradient-to-br from-amber-50 to-yellow-50">
            <div className="flex flex-col h-full">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-[22px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                Reportes que entendés
              </h3>
              <p className="mt-2 text-[13px] text-zinc-700">
                Análisis mensual + tendencias + tasa de ahorro, todo automático.
              </p>
              <div className="mt-auto pt-4">
                <div className="rounded-xl bg-white/80 ring-1 ring-amber-200 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-700">
                    <span>Tasa de ahorro</span>
                    <span className="font-bold text-emerald-600">45%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 6. Recurrentes */}
          <BentoCard>
            <div className="flex flex-col h-full">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white mb-4">
                <Repeat className="h-5 w-5" />
              </div>
              <h3 className="text-[22px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                Pagos fijos automáticos
              </h3>
              <p className="mt-2 text-[13px] text-zinc-700">
                Alquiler, sueldo, suscripciones. Se cargan solos cada mes.
              </p>
            </div>
          </BentoCard>

          {/* 7. Privacidad */}
          <BentoCard className="bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="flex flex-col h-full">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/30 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-[22px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                Tu plata, tu data
              </h3>
              <p className="mt-2 text-[13px] text-zinc-700">
                Encriptado de punta a punta. Sin venta de datos. Borrá todo cuando quieras.
              </p>
            </div>
          </BentoCard>

          {/* 8. Recordatorios */}
          <BentoCard>
            <div className="flex flex-col h-full">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/30 mb-4">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-[22px] font-extrabold tracking-tight text-zinc-950 leading-tight">
                Recordatorios diarios
              </h3>
              <p className="mt-2 text-[13px] text-zinc-700">
                Te avisamos a la hora que elijas para que no se te pase ningún gasto.
              </p>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function BentoCard({
  children, className = "", decorative,
}: {
  children: React.ReactNode; className?: string; decorative?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl ring-1 ring-zinc-200/80 bg-white p-6 sm:p-7 ${className}`}
    >
      {decorative}
      <div className="relative h-full">{children}</div>
    </motion.div>
  )
}
