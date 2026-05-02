import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { LanguageProvider } from "@/contexts/language-context"
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
  openGraph: {
    title: "Finy — Anotá tus gastos sin esfuerzo",
    description:
      "Hablale, sacale foto al ticket o escribile. Finy entiende y registra todo por vos.",
    url: "https://www.finyapp.io",
    siteName: "Finy",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finy — Anotá tus gastos sin esfuerzo",
    description: "La app de finanzas personales con IA.",
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
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Suspense>
              {children}
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
