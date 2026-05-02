"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/language-selector"

const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ventajas", label: "Ventajas" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-white/85 backdrop-blur-md border-b border-zinc-200/70"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" aria-label="Finy">
          <Image
            src="/images/fini-negro-logo.png"
            alt="Finy"
            width={94}
            height={54}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-[14px] font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <Link
            href="#descargar"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-zinc-900 text-white text-[14px] font-semibold hover:bg-zinc-800 transition-colors"
          >
            Descargar app
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6 text-zinc-900" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-zinc-900/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[78%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100">
              <span className="font-semibold text-zinc-900">Menú</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-zinc-100"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5 text-zinc-900" />
              </button>
            </div>
            <div className="flex-1 px-5 py-4 flex flex-col">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[17px] font-medium text-zinc-900"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-auto pt-6 space-y-3">
                <LanguageSelector />
                <Link
                  href="#descargar"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center px-5 py-3 rounded-full bg-zinc-900 text-white text-[15px] font-semibold"
                >
                  Descargar app
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
