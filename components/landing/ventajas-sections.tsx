"use client"

import { Spotlight } from "./spotlight"

/**
 * Tres secciones spotlight que reemplazan al bento rainbow.
 * Cada una: una idea, un visual, paleta blanco/negro/lima.
 */
export function VentajasSections() {
  return (
    <div id="ventajas">
      {/* 1. Asesor IA con tus números */}
      <Spotlight
        variant="light"
        imagePosition="right"
        eyebrow="Cerebro IA"
        title={
          <>
            Tu asesor financiero,{" "}
            <span className="text-zinc-400">no un chatbot.</span>
          </>
        }
        body="No es un chat genérico. La IA conoce tu historial, detecta patrones y te dice qué hacer con tu plata cada mes. Cuando preguntás, contesta con tus números reales."
        image="/screens/stats.png"
        imageAlt="Análisis IA mensual de Finy"
      />

      {/* 2. Espacios compartidos */}
      <Spotlight
        variant="dark"
        imagePosition="left"
        eyebrow="Finy Split"
        title={
          <>
            Compartí gastos.{" "}
            <span className="text-zinc-500">Sin Excels.</span>
          </>
        }
        body="Casa, viaje, negocio. Creás un espacio, invitás por link, cada uno aporta sus gastos. Finy hace las cuentas y te dice quién le debe a quién."
        image="/screens/spaces.png"
        imageAlt="Espacios compartidos en Finy"
      />

      {/* 3. Sin fronteras */}
      <Spotlight
        variant="light"
        imagePosition="right"
        eyebrow="40+ monedas · Mercado Pago"
        title={
          <>
            Funciona en{" "}
            <span className="lime-underline">tu moneda</span>.
          </>
        }
        body="ARS, USD, EUR, BRL, MXN, COP, CLP, UYU, PEN y muchas más. Conectá Mercado Pago y tus pagos se sincronizan solos en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay."
        image="/screens/transactions.png"
        imageAlt="Movimientos multi-moneda con Mercado Pago"
      />
    </div>
  )
}
