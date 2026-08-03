"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    eyebrow: "Preguntas frecuentes",
    titleA: "Lo que la gente",
    titleB: "nos pregunta.",
    moreDoubts: "¿Otra duda?",
    writeUs: "Escríbenos",
    items: [
      { q: "¿Cómo funciona lo de cargar gastos por audio?", a: "Tocas el botón del micrófono, dices en lenguaje natural lo que gastaste (\"pagué 5 en café con débito\") y la IA detecta el monto, la categoría y el método de pago. Si algo no se entendió bien, lo editas antes de confirmar." },
      { q: "¿Puedo conectar mi cuenta bancaria o tarjeta?", a: "Sí, puedes conectar Mercado Pago para que tus pagos se importen automáticamente. Estamos trabajando en integraciones con bancos directos. Por ahora también puedes subir resúmenes en PDF y la IA extrae todos los movimientos sola." },
      { q: "¿Mis datos están seguros?", a: "Toda la información viaja encriptada de punta a punta. No vendemos datos a terceros. Si algún día quieres borrar todo, lo haces desde la app con un toque y desaparece." },
      { q: "¿Qué pasa cuando se terminan los 14 días de PRO?", a: "Pasas automáticamente al plan Gratis. No te cobramos nada sin que tú lo confirmes. Si quieres mantener PRO, te suscribes cuando quieras desde la app." },
      { q: "¿Funciona en mi país?", a: "Sí. Soporta más de 40 monedas (USD, EUR, MXN, BRL, ARS, COP, CLP, UYU, PEN, etc.) y la integración con Mercado Pago funciona en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay." },
      { q: "¿Puedo compartir gastos con mi pareja o socios?", a: "Sí, con los Espacios Compartidos. Creas un espacio (Casa, Viaje, Negocio), invitas por link y cada persona suma sus gastos. Finy hace las cuentas y te dice quién le debe a quién." },
      { q: "¿Funciona offline?", a: "Puedes cargar gastos manualmente sin conexión y se sincronizan cuando vuelves a tener internet. Las funciones de IA (audio, foto, chat) sí necesitan internet porque se procesan en la nube." },
      { q: "¿Puedo cancelar cuando quiera?", a: "Sí, sin compromiso. Cancelas directo desde la app o desde tu cuenta de App Store / Google Play. Sin costos por cancelar." },
    ],
  },
  en: {
    eyebrow: "FAQ",
    titleA: "What people",
    titleB: "ask us.",
    moreDoubts: "Another question?",
    writeUs: "Write us",
    items: [
      { q: "How does logging expenses by voice work?", a: "You tap the mic, say what you spent in natural language (\"I paid $5 on coffee with debit\") and the AI detects the amount, category and payment method. If something is off, you can edit before confirming." },
      { q: "Can I connect my bank account or card?", a: "Yes, you can connect Mercado Pago so your payments import automatically. We're working on direct bank integrations. For now you can also upload PDF statements and the AI extracts every transaction." },
      { q: "Is my data safe?", a: "All your data travels end-to-end encrypted. We don't sell data to third parties. If you ever want to wipe everything, you do it from the app with one tap." },
      { q: "What happens after the 14-day PRO trial?", a: "You automatically switch to the Free plan. We don't charge you without your explicit confirmation. If you want to keep PRO, you subscribe whenever you want from inside the app." },
      { q: "Does it work outside Argentina?", a: "Yes. It supports 40+ currencies (USD, EUR, BRL, ARS, MXN, COP, CLP, UYU, PEN, etc.) and Mercado Pago integration works in Argentina, Brazil, Mexico, Colombia, Chile, Peru and Uruguay." },
      { q: "Can I share expenses with my partner or business?", a: "Yes, with Shared Spaces. You create a space (Home, Trip, Business), invite by link and everyone adds their expenses. Finy does the math and tells you who owes whom." },
      { q: "Does it work offline?", a: "You can log expenses manually without connection and they sync when you're back online. AI features (voice, photo, chat) need internet since we process in the cloud." },
      { q: "Can I cancel anytime?", a: "Yes, no strings attached. You cancel directly from the app or from your App Store / Google Play account. No cancellation fees." },
    ],
  },
}

export function FAQ() {
  const t = useT(COPY)
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-white py-24 sm:py-28 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-[36px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-tight text-zinc-950 leading-[1.02]">
            {t.titleA}
            <br />
            <span className="text-zinc-400">{t.titleB}</span>
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {t.items.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left active:opacity-60 transition-opacity"
              >
                <span className="text-[16px] sm:text-[18px] font-semibold text-zinc-900">{f.q}</span>
                <Plus
                  className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-45" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open === i ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[15px] text-zinc-600 leading-relaxed pr-12">{f.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-[13px] text-zinc-500">
          {t.moreDoubts}{" "}
          <a href="#contacto" className="font-semibold text-zinc-900 underline underline-offset-2">
            {t.writeUs}
          </a>
        </div>
      </div>
    </section>
  )
}
