import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { MetaPixel } from "@/components/meta-pixel"
import { LanguageProvider } from "@/contexts/language-context"
import { StructuredData } from "@/components/structured-data"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Finy — Anotá tus gastos sin esfuerzo",
  description:
    "Hablale, sacale foto al ticket o escribile. Finy entiende y registra todo por vos. La app de finanzas personales con IA para Argentina y LatAm.",
  keywords: [
    "app finanzas personales",
    "control de gastos",
    "asistente financiero IA",
    "registro de gastos voz",
    "escanear tickets",
    "Mercado Pago",
    "presupuesto personal",
  ],
  metadataBase: new URL("https://www.finyapp.io"),
  alternates: {
    canonical: "/",
  },
  // Sin límite de snippet: queremos que buscadores y asistentes IA puedan citar
  // el contenido completo en sus respuestas.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Finy — Anotá tus gastos sin esfuerzo",
    description:
      "Hablale, sacale foto al ticket o escribile. Finy entiende y registra todo por vos.",
    url: "https://www.finyapp.io",
    siteName: "Finy",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/images/iphone-finy-chat-updated.png", alt: "Finy — asistente financiero con IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finy — Anotá tus gastos sin esfuerzo",
    description: "La app de finanzas personales con IA.",
    images: ["/images/iphone-finy-chat-updated.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  generator: "Finy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <StructuredData />
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Analytics />
            {/*
              MetaPixel usa useSearchParams(), que fuerza render en cliente de
              todo lo que esté dentro de su Suspense. Tiene que ir en su propio
              boundary: si envuelve a {children}, el body entero deja de
              prerenderizarse y los crawlers que no ejecutan JS ven una página
              vacía.
            */}
            <Suspense fallback={null}>
              <MetaPixel />
            </Suspense>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
