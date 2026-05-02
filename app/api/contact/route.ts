import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VALID_TYPES = ["soporte", "propuesta", "baja", "otro"] as const
type ContactType = (typeof VALID_TYPES)[number]

interface ContactPayload {
  name: string
  email: string
  type: ContactType
  message: string
}

const TYPE_LABEL: Record<ContactType, string> = {
  soporte:    "Soporte técnico",
  propuesta:  "Propuesta de negocio",
  baja:       "Cancelación / baja",
  otro:       "Otro",
}

function validate(body: any): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Body inválido" }
  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const type = String(body.type ?? "").trim() as ContactType
  const message = String(body.message ?? "").trim()
  if (!name || name.length < 2)        return { ok: false, error: "Tu nombre es muy corto." }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Email inválido." }
  if (!VALID_TYPES.includes(type))     return { ok: false, error: "Tipo de consulta inválido." }
  if (!message || message.length < 10) return { ok: false, error: "El mensaje es muy corto (mínimo 10 caracteres)." }
  if (message.length > 4000)           return { ok: false, error: "El mensaje es muy largo." }
  return { ok: true, data: { name, email, type, message } }
}

export async function POST(request: Request) {
  let raw: any
  try { raw = await request.json() } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }) }

  const v = validate(raw)
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 })
  const data = v.data

  const N8N_URL = process.env.N8N_CONTACT_WEBHOOK_URL
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Payload enviado a n8n: incluye el label legible para que el workflow lo use directamente
  const payload = {
    name:        data.name,
    email:       data.email,
    type:        data.type,
    type_label:  TYPE_LABEL[data.type],
    message:     data.message,
    received_at: new Date().toISOString(),
    source:      "finyapp.io/contacto",
  }

  // 1) Intentar via n8n (es el camino primario — maneja Supabase + Gmail team + auto-reply)
  if (N8N_URL) {
    try {
      const res = await fetch(N8N_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // 12s timeout para no colgar la UI
        signal: AbortSignal.timeout(12_000),
      })
      if (res.ok) return NextResponse.json({ ok: true, channel: "n8n" })
      console.error("[contact] n8n responded non-2xx:", res.status, await res.text().catch(() => ""))
      // sigue al fallback
    } catch (e: any) {
      console.error("[contact] n8n exception:", e?.message)
      // sigue al fallback
    }
  }

  // 2) Fallback: guardar en Supabase para no perder el lead aunque n8n falle
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.type,
        message: data.message,
      })
      if (!error) return NextResponse.json({ ok: true, channel: "supabase-fallback" })
      console.error("[contact] Supabase insert error:", error.message)
    } catch (e: any) {
      console.error("[contact] Supabase exception:", e?.message)
    }
  }

  // 3) Sin nada configurado en dev: log y devolvemos OK (no romper UX local)
  if (process.env.NODE_ENV !== "production") {
    console.log("[contact] DEV — mensaje recibido (sin canales configurados):", payload)
    return NextResponse.json({ ok: true, channel: "dev-log" })
  }

  return NextResponse.json(
    { error: "No pudimos enviar el mensaje ahora. Probá más tarde o escribinos a soporte@finyapp.io." },
    { status: 502 },
  )
}
