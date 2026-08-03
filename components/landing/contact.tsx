"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/hooks/use-t"

type ContactType = "soporte" | "propuesta" | "baja" | "otro"
type Status = "idle" | "sending" | "ok" | "error"

const COPY = {
  es: {
    eyebrow: "Contacto",
    title: "Hablemos.",
    intro: "Soporte, propuesta de negocio o solicitud de baja. Te respondemos en menos de 24 hs.",
    reasonsLabel: "¿En qué podemos ayudarte?",
    reasons: [
      { id: "soporte"  as const, label: "Soporte técnico" },
      { id: "propuesta"as const, label: "Propuesta de negocio" },
      { id: "baja"     as const, label: "Cancelar mi cuenta" },
      { id: "otro"     as const, label: "Otro" },
    ],
    nameLabel: "Nombre",
    namePh: "Tu nombre",
    emailLabel: "Email",
    emailPh: "tu@email.com",
    msgLabel: "Mensaje",
    msgPh: "Cuéntanos en detalle qué necesitas…",
    eta: "Te respondemos en menos de 24 hs.",
    sending: "Enviando…",
    send: "Enviar",
    okTitle: "¡Mensaje enviado!",
    okBodyPre: "Te respondemos a",
    okBodyPost: "en menos de 24 hs.",
    okYourEmail: "tu email",
    sendAnother: "Enviar otro",
    errFallback: "No se pudo enviar. Inténtalo de nuevo.",
    errOffline: "No se pudo conectar. Verifica tu conexión.",
  },
  en: {
    eyebrow: "Contact",
    title: "Let's talk.",
    intro: "Support, business proposal or cancellation. We answer in less than 24h.",
    reasonsLabel: "How can we help?",
    reasons: [
      { id: "soporte"  as const, label: "Technical support" },
      { id: "propuesta"as const, label: "Business proposal" },
      { id: "baja"     as const, label: "Cancel my account" },
      { id: "otro"     as const, label: "Other" },
    ],
    nameLabel: "Name",
    namePh: "Your name",
    emailLabel: "Email",
    emailPh: "you@email.com",
    msgLabel: "Message",
    msgPh: "Tell us in detail what you need…",
    eta: "We answer in less than 24h.",
    sending: "Sending…",
    send: "Send",
    okTitle: "Message sent!",
    okBodyPre: "We'll reply to",
    okBodyPost: "in less than 24h.",
    okYourEmail: "your email",
    sendAnother: "Send another",
    errFallback: "Couldn't send. Try again.",
    errOffline: "Couldn't connect. Check your connection.",
  },
}

export function Contact() {
  const t = useT(COPY)
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
        setError(data?.error || t.errFallback)
        setStatus("error")
        return
      }
      setStatus("ok")
      setName(""); setEmail(""); setMessage(""); setType("soporte")
    } catch {
      setError(t.errOffline)
      setStatus("error")
    }
  }

  return (
    <section id="contacto" className="relative bg-white py-24 sm:py-32 px-5 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Lado izquierdo: copy */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold tracking-[0.24em] uppercase text-zinc-500 mb-3">
              {t.eyebrow}
            </p>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-tight text-zinc-950 leading-[1]">
              {t.title}
            </h2>
            <p className="mt-5 text-[16px] text-zinc-600 leading-relaxed max-w-md">
              {t.intro}
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
                <h3 className="text-2xl font-bold text-zinc-900">{t.okTitle}</h3>
                <p className="mt-2 text-zinc-600 max-w-sm">
                  {t.okBodyPre} <span className="font-semibold text-zinc-900">{email || t.okYourEmail}</span> {t.okBodyPost}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-zinc-900 underline underline-offset-2"
                >
                  {t.sendAnother}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[13px] font-semibold text-zinc-900 mb-2.5">{t.reasonsLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {t.reasons.map((r) => (
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
                    <label htmlFor="ct-name" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">{t.nameLabel}</label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePh}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-email" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">{t.emailLabel}</label>
                    <input
                      id="ct-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPh}
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-msg" className="block text-[13px] font-semibold text-zinc-900 mb-1.5">{t.msgLabel}</label>
                  <textarea
                    id="ct-msg"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.msgPh}
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-zinc-200 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-[12px] text-zinc-500">{t.eta}</p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-5 py-2.5 text-[14px] font-semibold disabled:opacity-50 active:scale-[0.98] hover:bg-zinc-800 transition-all"
                  >
                    {status === "sending" ? t.sending : t.send}
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
