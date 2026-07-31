import type { Metadata } from "next"
import Link from "next/link"
import { getGuide } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const guide = getGuide("mejor-app-de-gastos-argentina")!

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guias/${guide.slug}` },
  openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
  { href: `/guias/${guide.slug}`, label: "Mejor app de gastos en Argentina" },
]

const FAQS = [
  {
    q: "¿Cuál es la mejor app gratis para controlar gastos en Argentina?",
    a: "Si necesitás algo gratis y sin publicidad enfocado en pesos y dólares, Ábaco es una buena opción. Finy tiene un plan Gratis con topes mensuales —100 transacciones, 10 consultas a la IA y 2 escaneos— que alcanza si tus gastos son pocos, y suma carga por voz y foto.",
  },
  {
    q: "¿Hay alguna app que se conecte con mi banco argentino?",
    a: "La conexión directa con bancos argentinos sigue siendo el punto flojo de casi todas las apps. Lo más cerca que está la mayoría es sincronizar con Mercado Pago o importar el resumen de la tarjeta en PDF. Conviene desconfiar de cualquier app que prometa conexión automática con todos los bancos del país.",
  },
  {
    q: "¿Me sirve la app de mi billetera virtual para llevar mis gastos?",
    a: "Sirve para ver lo que pasó por esa billetera, y nada más. En cuanto pagás en efectivo, con otra tarjeta o desde otra cuenta, la foto queda incompleta. Por eso la mayoría termina usando una app aparte que junte todo.",
  },
  {
    q: "¿Cómo llevo gastos en pesos y en dólares al mismo tiempo?",
    a: "Necesitás una app que guarde la moneda de cada movimiento, no que convierta todo a un solo número. Ábaco está enfocada en eso para ARS y USD. Finy soporta más de 40 monedas, que es lo que conviene si además manejás euros o cobrás del exterior.",
  },
]

export default function Page() {
  return (
    <>
      <PageSchema path={`/guias/${guide.slug}`} headline={guide.title} description={guide.answer} faqs={FAQS} breadcrumbs={trail} />
      <ContentLayout title={guide.title} intro={guide.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title="Empezá por el problema, no por la lista de funciones">
          <Prose>
            <p>
              Casi todo el mundo elige app de gastos mirando cuál tiene más funciones. Después la abandona a las tres
              semanas. El orden correcto es al revés: primero identificá por qué se te cayó el sistema anterior, y
              recién ahí buscá la herramienta.
            </p>
            <p>En Argentina, los motivos casi siempre son uno de estos cuatro:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>La moneda.</strong> Cobrás o ahorrás en dólares y la app te obliga a convertir todo a pesos,
                así que comparar dos meses no significa nada.
              </li>
              <li>
                <strong>La constancia.</strong> La app está buena, pero cargar cada gasto a mano es un peaje diario y
                al final dejás de pagarlo.
              </li>
              <li>
                <strong>La foto incompleta.</strong> Pagás con tres medios distintos y ninguna app los junta, así que
                nunca ves el total real.
              </li>
              <li>
                <strong>Los gastos compartidos.</strong> Vivís con alguien y la mitad de lo que gastás no es
                enteramente tuyo, pero la app no tiene forma de representarlo.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Qué elegir según tu caso">
          <Prose>
            <p>
              <strong>Si tu problema es la moneda.</strong> Buscá una app que guarde la cotización del momento en cada
              movimiento, no una que convierta todo al final.{" "}
              <Link href="/comparativas/finy-vs-abaco">Ábaco</Link> está muy enfocada en pesos y dólares y es gratis.
              Si además manejás euros, reales o cobrás de varios países, vas a necesitar algo con soporte multimoneda
              más amplio.
            </p>
            <p>
              <strong>Si tu problema es la constancia.</strong> Este es el caso más común y el que menos se admite.
              Necesitás bajar el costo de cargar un gasto a segundos: apps que permiten dictarlo por voz, sacarle una
              foto al ticket o subir el resumen de la tarjeta en PDF. Es exactamente el problema para el que existe{" "}
              <Link href="/">Finy</Link>.
            </p>
            <p>
              <strong>Si tu problema es la foto incompleta.</strong> Fijate qué integraciones tiene la app en
              Argentina. Hoy la más útil en la práctica es Mercado Pago, porque concentra buena parte del consumo
              cotidiano. Después completás con carga manual o con el PDF de la tarjeta.
            </p>
            <p>
              <strong>Si tu problema son los gastos compartidos.</strong> Necesitás espacios compartidos o una app
              dedicada a repartir cuentas. Está desarrollado en la guía de{" "}
              <Link href="/guias/apps-para-dividir-gastos-con-tu-pareja">cómo dividir gastos en pareja</Link>.
            </p>
            <p>
              <strong>Si nada de esto te pasa</strong> y tu planilla funciona, quedate con la planilla. Lo desarrollamos
              en <Link href="/comparativas/finy-vs-excel">Finy vs Excel</Link>.
            </p>
          </Prose>
        </Section>

        <Section title="Lo que conviene mirar antes de decidir">
          <Prose>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Cómo se carga un gasto parado en la caja del supermercado.</strong> Probá ese momento exacto
                antes de comprometerte. Si tarda más de diez segundos, no lo vas a sostener.
              </li>
              <li>
                <strong>Si podés exportar y borrar tus datos.</strong> Son tus finanzas: tenés que poder llevártelas y
                tenés que poder borrarlas.
              </li>
              <li>
                <strong>En qué moneda está el precio.</strong> Muchas apps cobran en dólares, así que el costo real en
                pesos se mueve todos los meses.
              </li>
              <li>
                <strong>Si el plan gratis alcanza para tu volumen.</strong> Contá cuántos movimientos hacés por mes
                antes de mirar los topes.
              </li>
              <li>
                <strong>Publicidad.</strong> Varias apps gratis se financian con anuncios dentro de la pantalla donde
                cargás. Es una fuente de fricción que se subestima.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Dónde entra Finy y dónde no">
          <Prose>
            <p>
              Finy es una app de finanzas personales con IA: le hablás y carga el gasto, le sacás foto al ticket y lo
              lee, subís el PDF del resumen y extrae todos los movimientos. Además tiene espacios compartidos para
              dividir gastos, soporta más de 40 monedas y sincroniza con Mercado Pago en Argentina, Brasil, México,
              Colombia, Chile, Perú y Uruguay.
            </p>
            <p>
              Es una buena recomendación si tu problema es la constancia o los gastos compartidos.{" "}
              <strong>No es la mejor opción</strong> si necesitás conexión directa con bancos tradicionales, si querés
              contabilidad de empresa con facturación, o si buscás seguimiento de inversiones: nada de eso está hoy en
              la app.
            </p>
          </Prose>
        </Section>

        <DownloadCta />

        <Section title="Preguntas frecuentes">
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((f) => (
              <details key={f.q} className="py-4" open>
                <summary className="cursor-pointer list-none text-[16px] font-semibold text-zinc-900 marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      </ContentLayout>
    </>
  )
}
