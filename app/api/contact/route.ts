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

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "soporte@finyapp.io"
  const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Finy Web <hola@finyapp.io>"

  // 1) Guardar en Supabase si está configurado
  let stored = false
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.type,
        message: data.message,
      })
      if (error) console.error("[contact] Supabase insert error:", error.message)
      else stored = true
    } catch (e: any) {
      console.error("[contact] Supabase exception:", e?.message)
    }
  }

  // 2) Enviar email via Resend si está configurado
  let mailed = false
  if (RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(RESEND_API_KEY)
      const subject = `[${TYPE_LABEL[data.type]}] ${data.name}`
      const text = [
        `Nueva consulta desde finyapp.io`,
        ``,
        `Tipo:    ${TYPE_LABEL[data.type]}`,
        `Nombre:  ${data.name}`,
        `Email:   ${data.email}`,
        ``,
        `Mensaje:`,
        data.message,
      ].join("\n")
      const html = `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b">
          <h2 style="margin:0 0 8px 0;font-size:18px">Nueva consulta — finyapp.io</h2>
          <p style="margin:0 0 16px 0;color:#71717a;font-size:13px">${TYPE_LABEL[data.type]}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px">
            <tr><td style="padding:6px 0;color:#71717a;width:80px">Nombre</td><td style="padding:6px 0;font-weight:600">${escape(data.name)}</td></tr>
            <tr><td style="padding:6px 0;color:#71717a">Email</td><td style="padding:6px 0;font-weight:600"><a href="mailto:${escape(data.email)}" style="color:#18181b;text-decoration:underline">${escape(data.email)}</a></td></tr>
          </table>
          <div style="background:#f4f4f5;border-radius:12px;padding:16px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escape(data.message)}</div>
        </div>
      `
      const res = await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        replyTo: data.email,
        subject,
        text,
        html,
      })
      if (res?.error) console.error("[contact] Resend error:", res.error)
      else mailed = true
    } catch (e: any) {
      console.error("[contact] Resend exception:", e?.message)
    }
  } else {
    // En dev sin Resend: log al servidor para que se vea
    console.log("[contact] No Resend configurado. Mensaje recibido:", data)
  }

  if (!stored && !mailed) {
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje. Intentá de nuevo o escribinos a soporte@finyapp.io." },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, stored, mailed })
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}
