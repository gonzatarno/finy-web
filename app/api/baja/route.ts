import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Dar de baja de los mails de novedades.
 *
 * Sólo POST, y eso NO es un detalle de estilo.
 *
 * Los filtros de correo corporativo —Outlook Safe Links, Proofpoint, Mimecast y
 * varios antivirus— abren todos los links de un mail antes de entregarlo, para
 * ver a dónde llevan. Si la baja se hiciera con el GET de la página, el escáner
 * la ejecutaría solo: la persona abre el mail y ya está desuscripta sin haber
 * tocado nada. Con 444 destinatarios eso no es un caso raro, es garantizado.
 *
 * Por eso /baja muestra un botón y la baja recién ocurre cuando alguien lo
 * aprieta, que es un POST y ningún escáner lo dispara.
 *
 * El user_id va sin firmar. Es un UUID v4: no se adivina, y es lo que usa todo
 * el mundo para esto. Además la acción es reversible desde la app y no destruye
 * nada — el costo de un falso positivo es que alguien deje de recibir novedades
 * que no quería recibir.
 */
export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const userId = typeof body?.u === "string" ? body.u.trim() : ""

  // Formato de UUID, para no mandarle basura a Postgres y comerse un 500.
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID.test(userId)) {
    return NextResponse.json({ error: "Link inválido" }, { status: 400 })
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("[baja] faltan las variables de Supabase")
    return NextResponse.json({ error: "No disponible" }, { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  const { error } = await supabase
    .from("users")
    .update({ marketing_emails: false })
    .eq("id", userId)

  if (error) {
    console.error("[baja] error al actualizar:", error.message)
    return NextResponse.json({ error: "No pudimos procesarlo" }, { status: 500 })
  }

  /*
   * Responde ok aunque el id no exista.
   *
   * Contestar distinto según exista o no convierte esto en un oráculo para
   * saber si un UUID cualquiera es de un usuario real. No vale la pena por una
   * pantalla de baja.
   */
  return NextResponse.json({ ok: true })
}
