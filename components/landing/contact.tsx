"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

type ContactType = "soporte" | "propuesta" | "baja" | "otro"
type Status = "idle" | "sending" | "ok" | "error"

const REASONS: { id: ContactType; label: string; description: string }[] = [
  { id: "soporte",   label: "Soporte técnico",     description: "Algo no funciona o necesito ayuda con la app." },
  { id: "propuesta", label: "Propuesta de negocio", description: "Quiero hablar de partnership, integración o prensa." },
  { id: "baja",      label: "Cancelar / dar de baja", description: "Quiero cancelar mi suscripción o eliminar mi cuenta." },
  { id: "otro",      label: "Otro",                description: "Sugerencia, idea o cualquier otra cosa." },
]

export function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [type, setType] = useState<ContactType>("soporte")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    setStatus("sending")
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "No se pudo enviar. Probá de nuevo.")
        setStatus("error")
        return
      }
      setStatus("ok")
      setName(""); setEmail(""); setMessage(""); setType("soporte")
    } catch {
      setError("No se pudo conectar. Verificá tu conexión.")
      setStatus("error")
    }
  }

  return (
    <section id="contacto" className="relative bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Lado izquierdo: copy */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold tracking-[0.24em] uppercase text-zinc-500 mb-3">
              Contacto
            </p>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-tight text-zinc-950 leading-[1]">
              Hablemos.
            </h2>
            <p className="mt-5 text-[16px] text-zinc-600 leading-relaxed max-w-md">
              Soporte, propuesta de negocio o pedido de baja. Te respondemos en menos de 24 hs.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[14px] text-zinc-700">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#CEFD55]">
                <Mail className="h-4 w-4 text-black" />
              </span>
              <a href="mailto:soporte@finyapp.io" className="font-semibold text-zinc-900 hover:underline underline-offset-2">
                soporte@finyapp.io
              </a>
            </div>
          </div>

          {/* Lado derecho: form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 p-6 sm:p-8 space-y-5"
          >
            {status === "ok" ? (
              <div className="flex flex-col items-center text-center py-10">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#CEFD55] mb-4">
                  <Check className="h-7 w-7 text-black" strokeWidth={3} />
                </span>
                <h3 className="text-2xl font-bold text-zinc-900">¡Mensaje enviado!</h3>
                <p className="mt-2 text-zinc-600 max-w-sm">
                  Te respondemos a <span className="font-semibold text-zinc-900">{email || "tu email"}</span> en menos de 24 hs.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-zinc-900 underline underline-offset-2"
                >
                  Enviar otro
                </button>
              </div>
            ) : (
              <>
                {/* Tipo de consulta — pills */}
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-900 mb-2.5">¿En qué podemos ayudarte?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {REASONS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setType(r.id)}
                        className={cn(
                          "text-left px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all border",
                          type === r.id
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300",
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ct-name" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">Nombre</label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Cómo te llamás"
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-email" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">Email</label>
                    <input
                      id="ct-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vos@email.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-msg" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">Mensaje</label>
                  <textarea
                    id="ct-msg"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contanos en detalle qué necesitás…"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-[13px] text-red-600 font-medium">{error}</p>
                )}

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-[12px] text-zinc-500">
                    Te respondemos en menos de 24 hs.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-5 py-2.5 text-[14px] font-semibold disabled:opacity-50 active:scale-[0.98] hover:bg-zinc-800 transition-all"
                  >
                    {status === "sending" ? "Enviando…" : "Enviar"}
                    {status !== "sending" && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
