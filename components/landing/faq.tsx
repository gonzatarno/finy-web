"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"

const FAQS = [
  {
    q: "¿Cómo es eso de cargar gastos por audio?",
    a: "Tocás el botón de micrófono, decís en lenguaje natural lo que gastaste (\"pagué $5.000 en café con débito\") y la IA detecta el monto, la categoría y el método de pago. Si algo no entendió bien, lo editás antes de confirmar.",
  },
  {
    q: "¿Puedo conectar mi cuenta bancaria o tarjeta?",
    a: "Sí, podés conectar Mercado Pago para que tus pagos se importen automáticamente. Estamos trabajando en integraciones con bancos directos. Por ahora también podés subir resúmenes en PDF y la IA extrae todos los movimientos solos.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Toda la información viaja encriptada de punta a punta. No vendemos datos a terceros. Si algún día querés borrar todo, lo hacés desde la app con un toque y desaparece.",
  },
  {
    q: "¿Qué pasa cuando se acaban los 14 días de PRO?",
    a: "Pasás automáticamente al plan Gratis. No te cobramos nada sin que vos confirmes. Si querés mantener PRO, suscribís cuando quieras desde la app.",
  },
  {
    q: "¿Funciona en Argentina y otros países?",
    a: "Sí. Soporta más de 40 monedas (ARS, USD, EUR, BRL, MXN, COP, CLP, UYU, PEN, etc.) y la integración con Mercado Pago funciona en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay.",
  },
  {
    q: "¿Puedo compartir gastos con mi pareja o socios?",
    a: "Sí, con los Espacios Compartidos. Creás un espacio (Casa, Viaje, Negocio), invitás por link y cada persona aporta sus gastos. Finy hace las cuentas y te dice quién le debe a quién.",
  },
  {
    q: "¿Funciona offline?",
    a: "Podés cargar gastos manualmente sin conexión y se sincronizan cuando volvés a tener internet. Las funciones de IA (audio, foto, chat) sí necesitan internet porque procesamos en la nube.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin compromiso. Cancelás directo desde la app o desde tu cuenta de App Store / Google Play. Sin costos por cancelar.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="text-[36px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-tight text-zinc-950 leading-[1.02]">
            Lo que la gente
            <br />
            <span className="text-zinc-400">nos pregunta.</span>
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {FAQS.map((f, i) => (
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
                <span className="text-[16px] sm:text-[18px] font-semibold text-zinc-900">
                  {f.q}
                </span>
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
          ¿Otra duda?{" "}
          <a href="#contacto" className="font-semibold text-zinc-900 underline underline-offset-2">
            Escribinos
          </a>
        </div>
      </div>
    </section>
  )
}
