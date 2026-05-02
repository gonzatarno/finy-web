"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail } from "lucide-react"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    tagline: "La app de finanzas personales con IA. Anota gastos por audio, foto o chat — todo desde tu teléfono.",
    productH: "Producto",
    productLinks: [
      { href: "#como-funciona", label: "Cómo funciona" },
      { href: "#ventajas",      label: "Ventajas" },
      { href: "#precios",       label: "Precios" },
      { href: "#faq",           label: "FAQ" },
      { href: "#contacto",      label: "Contacto" },
    ],
    legalH: "Legal",
    legalLinks: [
      { href: "/politica-privacidad", label: "Privacidad" },
      { href: "/condiciones-servicios", label: "Términos" },
      { href: "/centro-legal", label: "Centro legal" },
    ],
    rights: "Todos los derechos reservados.",
    madeWith: "Hecho con 💚",
  },
  en: {
    tagline: "The AI-powered personal finance app. Log expenses by voice, photo or chat — all from your phone.",
    productH: "Product",
    productLinks: [
      { href: "#como-funciona", label: "How it works" },
      { href: "#ventajas",      label: "Why Finy" },
      { href: "#precios",       label: "Pricing" },
      { href: "#faq",           label: "FAQ" },
      { href: "#contacto",      label: "Contact" },
    ],
    legalH: "Legal",
    legalLinks: [
      { href: "/politica-privacidad", label: "Privacy" },
      { href: "/condiciones-servicios", label: "Terms" },
      { href: "/centro-legal", label: "Legal center" },
    ],
    rights: "All rights reserved.",
    madeWith: "Made with 💚",
  },
}

export function Footer() {
  const t = useT(COPY)
  return (
    <footer className="relative bg-zinc-950 text-zinc-300 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="Finy">
              <Image
                src="/images/fini-negro-logo.png"
                alt="Finy"
                width={94}
                height={54}
                className="h-8 w-auto"
                style={{ filter: "invert(1)" }}
              />
            </Link>
            <p className="mt-4 text-sm text-zinc-400 max-w-sm leading-relaxed">{t.tagline}</p>
            <div className="mt-5 flex gap-3">
              <Link
                href="https://instagram.com/finybot"
                target="_blank"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:soporte@finyapp.io"
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.productH}</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {t.productLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t.legalH}</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {t.legalLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Finy. {t.rights}</p>
          <p>{t.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}
