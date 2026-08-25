"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

/**
 * La pantalla de baja de los mails de novedades.
 *
 * Pide confirmación en vez de dar de baja al abrir, y la razón no es cortesía:
 * los filtros de correo corporativo abren todos los links de un mail antes de
 * entregarlo. Si esta página diera de baja al cargar, el escáner lo haría solo
 * y la persona quedaría desuscripta sin haber tocado nada. Ver el comentario de
 * app/api/baja/route.ts.
 *
 * De paso, el paso extra deja ofrecer lo que en realidad quiere mucha gente que
 * llega acá: recibir menos, no dejar de recibir.
 */
export default function BajaClient() {
  const params = useSearchParams()
  const userId = params.get("u") ?? ""

  const [estado, setEstado] = useState<"inicial" | "enviando" | "listo" | "error">("inicial")

  const darDeBaja = async () => {
    setEstado("enviando")
    try {
      const res = await fetch("/api/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u: userId }),
      })
      setEstado(res.ok ? "listo" : "error")
    } catch {
      setEstado("error")
    }
  }

  const sinLink = !userId

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-[480px]">
        <Link href="/" className="inline-block mb-5">
          <img
            src="https://zqniepbsjrvuypxyagaz.supabase.co/storage/v1/object/public/newsletter-assets/finy_email_logo.png"
            alt="Finy"
            width={70}
            height={28}
          />
        </Link>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {estado === "listo" ? (
            <>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#CEFD55]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="m5 13 4 4L19 7" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#202020]">Listo, no te escribimos más</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">
                No vas a recibir más mails de novedades. Los avisos de tu cuenta —tu suscripción, tu
                seguridad— siguen llegando, porque de esos no se puede dar de baja.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">
                Si algún día cambias de idea, se activa de nuevo desde <strong>Cuenta → Notificaciones</strong> en la app.
              </p>
              <Link
                href="/"
                className="mt-7 inline-block rounded-[10px] bg-[#CEFD55] px-6 py-3.5 text-[15px] font-bold text-[#202020] transition-colors hover:bg-[#bfff00]"
              >
                Volver a Finy
              </Link>
            </>
          ) : estado === "error" || sinLink ? (
            <>
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#202020]">No pudimos procesarlo</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">
                {sinLink
                  ? "Este link está incompleto. Ábrelo desde el mail que recibiste, o escríbenos y lo damos de baja a mano."
                  : "Algo falló de nuestro lado. Puedes intentar de nuevo, o escribirnos y lo damos de baja a mano."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {!sinLink && (
                  <button
                    onClick={darDeBaja}
                    className="rounded-[10px] bg-[#CEFD55] px-6 py-3.5 text-[15px] font-bold text-[#202020] transition-colors hover:bg-[#bfff00]"
                  >
                    Intentar de nuevo
                  </button>
                )}
                <a
                  href="mailto:soporte@finyapp.io?subject=Baja%20de%20novedades"
                  className="rounded-[10px] border border-[#E5E5E5] px-6 py-3.5 text-[15px] font-bold text-[#404040] transition-colors hover:bg-[#FAFAFA]"
                >
                  Escribirnos
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-[#202020]">
                ¿Dejamos de escribirte?
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">
                Vas a dejar de recibir los mails de novedades de Finy. Los avisos de tu cuenta
                —suscripción, seguridad— siguen llegando igual.
              </p>

              <button
                onClick={darDeBaja}
                disabled={estado === "enviando"}
                className="mt-7 w-full rounded-[10px] bg-[#202020] px-6 py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
              >
                {estado === "enviando" ? "Un segundo…" : "Sí, darme de baja"}
              </button>

              <div className="my-7 h-px bg-[#F0F0F0]" />

              {/*
                Mucha gente que llega acá no quiere irse: quiere que le
                escribamos menos. Ofrecerlo cuesta un párrafo y evita perder a
                alguien que sólo estaba molesto por la frecuencia.
              */}
              <p className="text-[14px] leading-relaxed text-[#666666]">
                ¿Es que te escribimos demasiado? En la app, en{" "}
                <strong>Cuenta → Notificaciones</strong>, puedes elegir qué recibir y qué no, sin
                darte de baja de todo.
              </p>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-[12px] text-[#6B6B6B]">
          <Link href="/" className="underline">finyapp.io</Link>
        </p>
      </div>
    </div>
  )
}
