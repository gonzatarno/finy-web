"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "@/components/language-selector"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    links: [
      { href: "#como-funciona", label: "Cómo funciona" },
      { href: "#ventajas",      label: "Ventajas" },
      { href: "#precios",       label: "Precios" },
      { href: "#faq",           label: "FAQ" },
      { href: "#contacto",      label: "Contacto" },
    ],
    download: "Descargar app",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  en: {
    links: [
      { href: "#como-funciona", label: "How it works" },
      { href: "#ventajas",      label: "Why Finy" },
      { href: "#precios",       label: "Pricing" },
      { href: "#faq",           label: "FAQ" },
      { href: "#contacto",      label: "Contact" },
    ],
    download: "Download app",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
}

export function Nav() {
  const t = useT(COPY)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Cerrar drawer con Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  // Cerrar drawer cuando crece la viewport a desktop
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const onChange = () => { if (mql.matches) setOpen(false) }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // El hero es oscuro, así que arriba de todo el nav va en claro. Al scrollear
  // aparece la barra blanca y vuelve a contenido oscuro.
  const onDark = !scrolled

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-md border-b border-zinc-200/70"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0" aria-label="Finy">
            <Image
              src="/images/fini-negro-logo.png"
              alt="Finy"
              width={94}
              height={54}
              priority
              className="h-7 w-auto transition-[filter] duration-300"
              style={onDark ? { filter: "invert(1)" } : undefined}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {t.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 text-[14px] font-medium rounded-lg transition-colors",
                  onDark
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
                )}
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
              className={cn(
                "hidden md:inline-flex items-center px-4 py-2 rounded-full text-[14px] font-semibold transition-colors",
                onDark ? "bg-white text-zinc-950 hover:bg-white/90" : "bg-zinc-900 text-white hover:bg-zinc-800",
              )}
            >
              {t.download}
            </Link>
            <button
              onClick={() => setOpen(true)}
              className={cn(
                "md:hidden p-2 -mr-2 rounded-lg transition-colors",
                onDark ? "hover:bg-white/10 active:bg-white/20" : "hover:bg-zinc-100 active:bg-zinc-200",
              )}
              aria-label={t.openMenu}
              aria-expanded={open}
            >
              <Menu className={cn("h-6 w-6", onDark ? "text-white" : "text-zinc-900")} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer en portal — evita conflictos de stacking con el header */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-drawer"
                className="fixed inset-0 z-[60] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
                {/* Panel */}
                <motion.div
                  className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl flex flex-col"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100 flex-shrink-0">
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center"
                      aria-label="Finy"
                    >
                      <Image
                        src="/images/fini-negro-logo.png"
                        alt="Finy"
                        width={94}
                        height={54}
                        className="h-6 w-auto"
                      />
                    </Link>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-9 h-9 -mr-1 rounded-full bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 flex items-center justify-center transition-colors"
                      aria-label={t.closeMenu}
                    >
                      <X className="h-5 w-5 text-zinc-900" />
                    </button>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
                    {t.links.map((l, i) => (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="block py-3.5 text-[17px] font-semibold text-zinc-900 border-b border-zinc-100"
                        >
                          {l.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="px-5 pt-4 pb-[max(env(safe-area-inset-bottom),20px)] border-t border-zinc-100 flex-shrink-0 space-y-3">
                    <div className="flex justify-start">
                      <LanguageSelector />
                    </div>
                    <Link
                      href="#descargar"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center px-5 py-3.5 rounded-full bg-zinc-900 text-white text-[15px] font-semibold active:scale-[0.98] transition-transform"
                    >
                      {t.download}
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
