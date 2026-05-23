"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { useT } from "@/hooks/use-t"

type Period = "monthly" | "yearly"

interface Plan {
  name: string
  tagline: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  highlight?: boolean
  cta: string
}

const COPY = {
  es: {
    eyebrow: "Precios",
    titleA: "Un precio simple.",
    titleB: "Sin sorpresas.",
    intro: "Empieza gratis. Si te gusta, subes a Plus o Pro. Cancela cuando quieras.",
    monthly: "Mensual",
    yearly: "Anual",
    saveBadge: "Ahorra hasta 33%",
    perMonth: "/mes",
    perYear: "al año",
    saveText: (pct: number) => `ahorra ${pct}%`,
    orYear: "o",
    paidYearly: "pagado por año",
    trialNote: "Todos los nuevos usuarios reciben",
    trialBold: "14 días de PRO gratis",
    trialNote2: "al instalar la app. Sin tarjeta.",
    trial14Badge: "14 días gratis",
    plans: [
      {
        name: "Gratis",
        tagline: "Para empezar a controlar tus gastos.",
        features: ["100 transacciones por mes","10 consultas a la IA","1 espacio personal","Categorías ilimitadas","Con publicidad"],
        cta: "Empezar gratis",
      },
      {
        name: "Plus",
        tagline: "Para quien lo usa todos los días.",
        features: ["500 transacciones por mes","75 consultas a la IA","30 escaneos de foto / PDF","3 espacios compartidos","Sin publicidad"],
        cta: "Probar Plus",
      },
      {
        name: "Pro",
        tagline: "El plan completo. Todo desbloqueado.",
        features: ["1.000 transacciones por mes","200 consultas a la IA","100 escaneos de foto / PDF","10 espacios compartidos","Reportes avanzados","Sin publicidad"],
        cta: "Probar Pro 14 días",
      },
    ],
  },
  en: {
    eyebrow: "Pricing",
    titleA: "Simple pricing.",
    titleB: "No surprises.",
    intro: "Start for free. If you like it, upgrade to Plus or Pro. Cancel anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    saveBadge: "Save up to 33%",
    perMonth: "/mo",
    perYear: "per year",
    saveText: (pct: number) => `save ${pct}%`,
    orYear: "or",
    paidYearly: "billed yearly",
    trialNote: "Every new user gets",
    trialBold: "14 days of PRO free",
    trialNote2: "when they install the app. No credit card.",
    trial14Badge: "14-day trial",
    plans: [
      {
        name: "Free",
        tagline: "To start tracking your expenses.",
        features: ["100 transactions per month","10 AI queries","1 personal space","Unlimited categories","With ads"],
        cta: "Start free",
      },
      {
        name: "Plus",
        tagline: "For everyday users.",
        features: ["500 transactions per month","75 AI queries","30 photo / PDF scans","3 shared spaces","No ads"],
        cta: "Try Plus",
      },
      {
        name: "Pro",
        tagline: "The full plan. Everything unlocked.",
        features: ["1,000 transactions per month","200 AI queries","100 photo / PDF scans","10 shared spaces","Advanced reports","No ads"],
        cta: "Try Pro 14 days",
      },
    ],
  },
}

const PRICES: { monthlyPrice: number; yearlyPrice: number; highlight?: boolean }[] = [
  { monthlyPrice: 0,    yearlyPrice: 0 },
  { monthlyPrice: 2.99, yearlyPrice: 24.99 },
  { monthlyPrice: 4.99, yearlyPrice: 39.99, highlight: true },
]

export function Pricing() {
  const t = useT(COPY)
  const PLANS: Plan[] = t.plans.map((p, i) => ({ ...p, ...PRICES[i] }))
  const [period, setPeriod] = useState<Period>("yearly")

  const yearlyDiscount = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0
    const yearlyMonthly = plan.yearlyPrice / 12
    return Math.round(((plan.monthlyPrice - yearlyMonthly) / plan.monthlyPrice) * 100)
  }

  return (
    <section id="precios" className="relative bg-zinc-50 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[12px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3"
          >
            {t.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[36px] sm:text-[56px] lg:text-[68px] font-extrabold tracking-tight text-zinc-950 leading-[0.98] max-w-3xl mx-auto"
          >
            {t.titleA}{" "}
            <span className="text-zinc-400">{t.titleB}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 text-[16px] text-zinc-600 max-w-xl mx-auto"
          >
            {t.intro}
          </motion.p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center bg-white ring-1 ring-zinc-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setPeriod("monthly")}
              className={`relative px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                period === "monthly" ? "text-zinc-900" : "text-zinc-500"
              }`}
            >
              {period === "monthly" && (
                <motion.span
                  layoutId="period-pill"
                  className="absolute inset-0 bg-zinc-100 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t.monthly}</span>
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`relative px-5 py-2 rounded-full text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
                period === "yearly" ? "text-zinc-900" : "text-zinc-500"
              }`}
            >
              {period === "yearly" && (
                <motion.span
                  layoutId="period-pill"
                  className="absolute inset-0 bg-zinc-100 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t.yearly}</span>
              <span className="relative inline-flex items-center text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-[#CEFD55] rounded-full px-2 py-0.5">
                {t.saveBadge}
              </span>
            </button>
          </div>
        </div>

        {/* PLANES */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {PLANS.map((plan, i) => {
            const isFree = plan.monthlyPrice === 0
            const price = period === "monthly" ? plan.monthlyPrice : plan.yearlyPrice / 12
            const annual = period === "yearly" && !isFree
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-3xl p-7 sm:p-8 ${
                  plan.highlight
                    ? "bg-zinc-950 text-white ring-2 ring-[#CEFD55] shadow-2xl shadow-zinc-900/20 lg:scale-[1.03]"
                    : "bg-white ring-1 ring-zinc-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-[#CEFD55] text-black text-[11px] font-bold tracking-wider uppercase rounded-full px-3 py-1.5 shadow-lg shadow-[#CEFD55]/30">
                    <Sparkles className="h-3 w-3" />
                    {t.trial14Badge}
                  </div>
                )}

                <h3
                  className={`text-[22px] font-bold tracking-tight ${
                    plan.highlight ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1.5 text-[13px] ${
                    plan.highlight ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  {isFree ? (
                    <span className={`text-[44px] font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-zinc-950"}`}>
                      $0
                    </span>
                  ) : (
                    <>
                      <span className={`text-[44px] font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-zinc-950"}`}>
                        ${price.toFixed(2)}
                      </span>
                      <span className={`text-[14px] font-medium ${plan.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                        {t.perMonth}
                      </span>
                    </>
                  )}
                </div>
                {annual && (
                  <p className={`mt-1 text-[12px] font-semibold ${plan.highlight ? "text-[#CEFD55]" : "text-zinc-900"}`}>
                    ${plan.yearlyPrice.toFixed(2)} {t.perYear}{" "}
                    <span className={`font-medium ${plan.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                      · {t.saveText(yearlyDiscount(plan))}
                    </span>
                  </p>
                )}
                {!annual && !isFree && (
                  <p className="mt-1 text-[12px] text-zinc-500">
                    {t.orYear} <span className="font-semibold text-zinc-900">${plan.yearlyPrice} {t.perYear}</span>{" "}
                    <span className="font-semibold">({t.saveText(yearlyDiscount(plan))})</span>
                  </p>
                )}

                <Link
                  href="#descargar"
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-2xl py-3.5 text-[14px] font-bold transition-all ${
                    plan.highlight
                      ? "bg-[#CEFD55] text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#CEFD55]/30"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2.5 text-[13px] ${
                        plan.highlight ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          plan.highlight ? "text-[#CEFD55]" : "text-emerald-500"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-[13px] text-zinc-500">
          {t.trialNote}{" "}
          <span className="font-semibold text-zinc-900">{t.trialBold}</span> {t.trialNote2}
        </p>
      </div>
    </section>
  )
}
