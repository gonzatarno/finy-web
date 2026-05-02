import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail } from "lucide-react"

export function Footer() {
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
                className="h-8 w-auto invert brightness-0"
                style={{ filter: "invert(1)" }}
              />
            </Link>
            <p className="mt-4 text-sm text-zinc-400 max-w-sm leading-relaxed">
              La app de finanzas personales con IA. Anotá gastos por audio, foto o chat —
              todo desde tu teléfono.
            </p>
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
            <h3 className="text-sm font-semibold text-white mb-4">Producto</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link></li>
              <li><Link href="#ventajas" className="hover:text-white transition-colors">Ventajas</Link></li>
              <li><Link href="#precios" className="hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="/condiciones-servicios" className="hover:text-white transition-colors">Términos</Link></li>
              <li><Link href="/centro-legal" className="hover:text-white transition-colors">Centro legal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Finy. Todos los derechos reservados.</p>
          <p>Hecho con 💚 en Argentina</p>
        </div>
      </div>
    </footer>
  )
}
