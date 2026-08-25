"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    eyebrow: "Finy Split",
    titleA: "Comparte gastos.",
    titleB: "Sin Excel.",
    body: "Casa, viaje, negocio. Creas un espacio, invitas por link, cada uno suma sus gastos. Finy hace las cuentas y te dice quién le debe a quién.",
    space: "Vacaciones en grupo",
    members: "3 personas",
    p1: "Tomas te debe",
    p2: "María te debe",
    total: "Total a recibir",
    detailA: "Pagaste el alojamiento",
    detailB: "Pagaste la cena del jueves",
    settle: "Saldar",
  },
  en: {
    eyebrow: "Finy Split",
    titleA: "Share expenses.",
    titleB: "No spreadsheets.",
    body: "Home, trip, business. You create a space, invite by link, everyone adds their expenses. Finy does the math and tells you who owes whom.",
    space: "Group vacation",
    members: "3 people",
    p1: "Tomas owes you",
    p2: "María owes you",
    total: "Total to receive",
    detailA: "You paid the lodging",
    detailB: "You paid Thursday's dinner",
    settle: "Settle up",
  },
}

export function SplitsDiorama() {
  const t = useT(COPY)

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white py-24 sm:py-32 lg:py-40 px-5 sm:px-6 lg:px-8">
      {/* Halos de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(206,253,85,0.6), transparent 70%)" }}
      />
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* TEXTO (image position left → text right) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl lg:order-2"
          >
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#CEFD55] mb-5">
              {t.eyebrow}
            </p>
            <h2 className="text-[40px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-[-0.03em] leading-[0.98] text-white">
              {t.titleA}{" "}
              <span className="text-zinc-500">{t.titleB}</span>
            </h2>
            <p className="mt-7 text-[17px] sm:text-[19px] leading-relaxed text-zinc-400 max-w-md">
              {t.body}
            </p>
          </motion.div>

          {/* DIORAMA — stack vertical contenido, jerarquía pareja */}
          <div className="relative lg:order-1 flex items-center justify-center py-8">
            {/* Halo verde grande detrás */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40 blur-3xl"
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(206,253,85,0.45), transparent)" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[400px] mx-auto"
              style={{ perspective: "1200px" }}
            >
              <div
                className="relative space-y-3"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(-6deg) rotateX(4deg)" }}
              >
                {/* Card 1: Header del espacio */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#CEFD55] flex items-center justify-center text-2xl shrink-0">
                      ✈️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-zinc-900 truncate leading-tight">{t.space}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{t.members}</p>
                    </div>
                    <div className="flex -space-x-1.5 shrink-0">
                      <span className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-violet-200 items-center justify-center text-[11px] font-bold text-violet-700">G</span>
                      <span className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-amber-200 items-center justify-center text-[11px] font-bold text-amber-800">T</span>
                      <span className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-rose-200 items-center justify-center text-[11px] font-bold text-rose-700">M</span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Tomás */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200 px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 rounded-full bg-amber-200 items-center justify-center text-[14px] font-bold text-amber-800 shrink-0">T</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-zinc-500 leading-tight">{t.p1}</p>
                      <p className="text-[12px] text-zinc-400 truncate mt-0.5">↳ {t.detailA}</p>
                    </div>
                    <p className="text-[18px] font-extrabold text-emerald-600 tabular-nums leading-none shrink-0">
                      +$12.450
                    </p>
                  </div>
                </motion.div>

                {/* Card 3: María */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200 px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 rounded-full bg-rose-200 items-center justify-center text-[14px] font-bold text-rose-700 shrink-0">M</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-zinc-500 leading-tight">{t.p2}</p>
                      <p className="text-[12px] text-zinc-400 truncate mt-0.5">↳ {t.detailB}</p>
                    </div>
                    <p className="text-[18px] font-extrabold text-emerald-600 tabular-nums leading-none shrink-0">
                      +$8.200
                    </p>
                  </div>
                </motion.div>

                {/* Card 4: Total — más sutil, no gigante */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-[#CEFD55] shadow-[0_20px_50px_-15px_rgba(206,253,85,0.5)] px-4 py-4 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-black/70 leading-tight">{t.total}</p>
                    <p className="mt-0.5 text-[28px] sm:text-[30px] font-extrabold text-black leading-none tabular-nums">
                      $20.650 <span className="text-[14px] font-semibold text-black/60 align-baseline">ARS</span>
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-black text-[#CEFD55] px-3.5 py-2 text-[12px] font-bold whitespace-nowrap shrink-0">
                    {t.settle}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
