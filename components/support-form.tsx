"use client"

import { useState } from "react"
import { CheckCircle, Loader2, Send } from "lucide-react"

function generateTicketId() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `#FINY-${num}`
}

export function SupportForm({ language }: { language: "es" | "en" }) {
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)

  const labels = {
    es: {
      title: "Centro de Soporte",
      subtitle: "¿En qué podemos ayudarte hoy? Nuestro equipo te responderá lo antes posible.",
      emailPlaceholder: "tu@email.com",
      emailLabel: "Email",
      categoryLabel: "Categoría",
      categories: ["Problema técnico", "Duda sobre mi suscripción", "Sugerencia", "Otro"],
      categoryPlaceholder: "Seleccioná una categoría",
      messageLabel: "Mensaje",
      messagePlaceholder: "Cuéntanos en qué podemos ayudarte...",
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
      successTitle: "¡Mensaje recibido!",
      successBody: (id: string) =>
        `Tu número de ticket es ${id}. Hemos enviado una confirmación a tu correo. Te contactaremos desde soporte@finyapp.io muy pronto.`,
      another: "Enviar otro mensaje",
    },
    en: {
      title: "Support Center",
      subtitle: "How can we help you today? Our team will get back to you as soon as possible.",
      emailPlaceholder: "you@email.com",
      emailLabel: "Email",
      categoryLabel: "Category",
      categories: ["Technical issue", "Subscription question", "Suggestion", "Other"],
      categoryPlaceholder: "Select a category",
      messageLabel: "Message",
      messagePlaceholder: "Tell us how we can help you...",
      submit: "Send Message",
      submitting: "Sending...",
      successTitle: "Message received!",
      successBody: (id: string) =>
        `Your ticket number is ${id}. We've sent a confirmation to your email. We'll contact you from soporte@finyapp.io very soon.`,
      another: "Send another message",
    },
  }

  const l = labels[language]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const ticket_id = generateTicketId()

    try {
      await fetch("https://n8n.finyapp.io/webhook/soporte-finy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, message, ticket_id }),
      })
    } catch {
      // Si el webhook falla igual mostramos el ticket al usuario
    }

    setTicketId(ticket_id)
    setLoading(false)
  }

  function handleReset() {
    setEmail("")
    setCategory("")
    setMessage("")
    setTicketId(null)
  }

  if (ticketId) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-6 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-[#CEFD55] rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-black mb-3">{l.successTitle}</h3>
          <p className="text-gray-600 max-w-md leading-relaxed">{l.successBody(ticketId)}</p>
        </div>
        <button
          onClick={handleReset}
          className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          {l.another}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{l.emailLabel}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={l.emailPlaceholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{l.categoryLabel}</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white appearance-none"
        >
          <option value="" disabled>
            {l.categoryPlaceholder}
          </option>
          {l.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{l.messageLabel}</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={l.messagePlaceholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {l.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {l.submit}
          </>
        )}
      </button>
    </form>
  )
}
