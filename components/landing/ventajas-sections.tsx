"use client"

import { Spotlight } from "./spotlight"
import { useT } from "@/hooks/use-t"

const COPY = {
  es: {
    a: {
      eyebrow: "Cerebro IA",
      titleA: "Tu asesor financiero,",
      titleB: "no un chatbot.",
      body: "No es un chat genérico. La IA conoce tu historial, detecta patrones y te dice qué hacer con tu plata cada mes. Cuando preguntás, contesta con tus números reales.",
      alt: "Análisis IA mensual de Finy",
    },
    b: {
      eyebrow: "Finy Split",
      titleA: "Compartí gastos.",
      titleB: "Sin Excels.",
      body: "Casa, viaje, negocio. Creás un espacio, invitás por link, cada uno aporta sus gastos. Finy hace las cuentas y te dice quién le debe a quién.",
      alt: "Espacios compartidos en Finy",
    },
    c: {
      eyebrow: "40+ monedas · Mercado Pago",
      titleA: "Funciona en",
      titleHighlight: "tu moneda",
      titleEnd: ".",
      body: "ARS, USD, EUR, BRL, MXN, COP, CLP, UYU, PEN y muchas más. Conectá Mercado Pago y tus pagos se sincronizan solos en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay.",
      alt: "Movimientos multi-moneda con Mercado Pago",
    },
  },
  en: {
    a: {
      eyebrow: "AI Brain",
      titleA: "Your money advisor,",
      titleB: "not a chatbot.",
      body: "It's not a generic chat. The AI knows your history, spots patterns and tells you what to do with your money each month. When you ask, it answers with your real numbers.",
      alt: "Monthly AI analysis in Finy",
    },
    b: {
      eyebrow: "Finy Split",
      titleA: "Share expenses.",
      titleB: "No spreadsheets.",
      body: "Home, trip, business. You create a space, invite by link, everyone adds their expenses. Finy does the math and tells you who owes whom.",
      alt: "Shared spaces in Finy",
    },
    c: {
      eyebrow: "40+ currencies · Mercado Pago",
      titleA: "Works in",
      titleHighlight: "your currency",
      titleEnd: ".",
      body: "USD, EUR, BRL, ARS, MXN, COP, CLP, UYU, PEN and many more. Connect Mercado Pago and your payments sync automatically in Argentina, Brazil, Mexico, Colombia, Chile, Peru and Uruguay.",
      alt: "Multi-currency transactions with Mercado Pago",
    },
  },
}

export function VentajasSections() {
  const t = useT(COPY)
  return (
    <div id="ventajas">
      <Spotlight
        variant="light"
        imagePosition="right"
        eyebrow={t.a.eyebrow}
        title={<>{t.a.titleA} <span className="text-zinc-400">{t.a.titleB}</span></>}
        body={t.a.body}
        image="/screens/stats.png"
        imageAlt={t.a.alt}
      />

      <Spotlight
        variant="dark"
        imagePosition="left"
        eyebrow={t.b.eyebrow}
        title={<>{t.b.titleA} <span className="text-zinc-500">{t.b.titleB}</span></>}
        body={t.b.body}
        image="/screens/spaces.png"
        imageAlt={t.b.alt}
      />

      <Spotlight
        variant="light"
        imagePosition="right"
        eyebrow={t.c.eyebrow}
        title={<>{t.c.titleA} <span className="lime-underline">{t.c.titleHighlight}</span>{t.c.titleEnd}</>}
        body={t.c.body}
        image="/screens/transactions.png"
        imageAlt={t.c.alt}
      />
    </div>
  )
}
