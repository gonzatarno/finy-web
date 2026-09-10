import type { Metadata } from "next"
import Link from "next/link"
import { getGuide } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

/**
 * La tercera guía por país, y la que tiene el ángulo más propio.
 *
 * Argentina arranca por la moneda, Colombia por las billeteras repartidas.
 * México arranca por los meses sin intereses, que no tienen equivalente en los
 * otros dos: comprar a 12 o 18 MSI es una práctica corriente, y el efecto es
 * que el gasto del mes deja de ser una medida de nada. Lo que pagas hoy se
 * decidió hace medio año, y una app que suma movimientos sueltos no lo muestra.
 *
 * Es además el único de los tres ángulos donde Finy tiene algo concreto que
 * ofrecer y no sólo "carga más fácil": registra la compra a meses como una
 * compra repartida, con su número de cuota, y avisa cuando cae cada una.
 *
 * QUÉ SE VERIFICÓ ANTES DE ESCRIBIRLO
 * Que las cuotas existan de verdad en la app (installments_total,
 * installment_number, month_imputation, la barra "cuota 2 de 3" en el detalle)
 * y que las notificaciones estén activas.
 *
 * Y qué NO: la "vista dedicada de cuotas activas con el total comprometido por
 * mes" vive en coming-soon-section.tsx. Es roadmap. No se promete acá.
 */

const guide = getGuide("mejor-app-de-gastos-mexico")!

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guias/${guide.slug}` },
  openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
  { href: `/guias/${guide.slug}`, label: "Mejor app de gastos en México" },
]

const FAQS = [
  {
    q: "¿Cómo llevo la cuenta de mis compras a meses sin intereses?",
    a: "Necesitas que la app entienda la compra como una sola compra repartida en N pagos, no como un cargo suelto cada mes. Si la registra bien, en cualquier momento puedes ver cuántas cuotas te quedan de cada una. Si la app sólo suma lo que aparece en el estado de cuenta, vas a ver el pago del mes sin saber cuánto falta ni de dónde viene.",
  },
  {
    q: "¿Hay alguna app que se conecte con BBVA, Banorte o Santander México?",
    a: "La conexión directa con bancos mexicanos no está resuelta en las apps de gastos, y conviene desconfiar de la que prometa conectarse con todos. Lo que sí funciona hoy es subir el estado de cuenta en PDF para que la app extraiga los movimientos, y cargar en el momento lo que pagas en efectivo o por transferencia.",
  },
  {
    q: "¿Cuál es la mejor app gratis para controlar gastos en México?",
    a: "Antes de mirar cuál, contá cuántos movimientos haces por mes: casi todas las apps tienen plan gratis con topes y ahí se define si te alcanza. Fíjate también en si el plan gratis muestra publicidad dentro de la pantalla de carga, porque es fricción justo donde menos conviene. Finy tiene plan gratis con topes y suma carga por voz y foto.",
  },
  {
    q: "Pago con tarjeta, en efectivo y por transferencia. ¿Cómo junto todo?",
    a: "Ninguna app lo junta sola. Lo que funciona es mixto: el estado de cuenta en PDF cubre lo de la tarjeta, y lo demás se carga en el momento. Que eso sea sostenible depende de cuánto tarda cargar un gasto: si es dictar una frase o sacar una foto al ticket, se sostiene; si hay que tipear cada compra, no.",
  },
  {
    q: "¿Puedo llevar pesos mexicanos y dólares al mismo tiempo?",
    a: "Sí, pero fíjate que la app guarde la moneda de cada movimiento en lugar de convertir todo a un solo número al final. Si convierte, comparar dos meses deja de significar algo. Finy soporta más de 40 monedas, incluido el peso mexicano con su formato local.",
  },
]

export default function Page() {
  return (
    <>
      <PageSchema path={`/guias/${guide.slug}`} headline={guide.title} description={guide.answer} faqs={FAQS} breadcrumbs={trail} />
      <ContentLayout title={guide.title} intro={guide.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title="Tu gasto del mes no es lo que gastaste este mes">
          <Prose>
            <p>
              En México comprar a meses sin intereses es lo normal. La pantalla, el refrigerador, el vuelo: 12 o 18
              pagos, sin recargo, y la decisión se toma una sola vez. El problema aparece cuando tienes tres o cuatro
              de esas corriendo al mismo tiempo.
            </p>
            <p>
              Porque entonces el total del mes se ve tranquilo mientras una parte de tu ingreso ya está comprometida
              con decisiones que tomaste hace medio año. No es que gastes de más este mes: es que no sabes cuánto de
              lo que entra ya tiene dueño.
            </p>
            <p>
              Una app que suma los cargos del estado de cuenta no te muestra eso. Ves un pago de mil doscientos y no
              sabes si es la cuota tres de doce o la última. La pregunta que importa, cuánto le debo a los próximos
              seis meses, no aparece en ningún lado.
            </p>
          </Prose>
        </Section>

        <Section title="Qué elegir según tu caso">
          <Prose>
            <p>
              <strong>Si compras seguido a meses.</strong> Fíjate si la app deja registrar una compra como compra a N
              pagos, con su número de cuota, en lugar de anotarte un cargo suelto cada mes. Es la diferencia entre
              saber que te faltan nueve pagos y ver un número que no explica nada.
            </p>
            <p>
              <strong>Si tu problema es que abandonas a las tres semanas.</strong> Es el caso más común y el que menos
              se admite. No necesitas más funciones: necesitas que cargar un gasto tarde segundos. Busca apps donde
              puedas dictarlo por voz, fotografiar el ticket o subir el estado de cuenta en PDF de una vez. Es
              exactamente el problema para el que existe <Link href="/">Finy</Link>.
            </p>
            <p>
              <strong>Si tu problema es la foto incompleta.</strong> Asumí que vas a juntar de dos fuentes: el estado
              de cuenta para lo de la tarjeta, y carga en el momento para el efectivo y las transferencias. Una app que
              lea el PDF te ahorra la mitad del trabajo de entrada.
            </p>
            <p>
              <strong>Si compartes gastos con alguien.</strong> Necesitas espacios compartidos, no una hoja de cálculo
              compartida. Está desarrollado en la guía de{" "}
              <Link href="/guias/apps-para-dividir-gastos-con-tu-pareja">cómo dividir gastos en pareja</Link>.
            </p>
            <p>
              <strong>Si tu hoja de cálculo funciona</strong>, quédate con ella. Lo desarrollamos en{" "}
              <Link href="/comparativas/finy-vs-excel">Finy vs Excel</Link>.
            </p>
          </Prose>
        </Section>

        <Section title="Lo que conviene mirar antes de decidir">
          <Prose>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Si entiende las compras a meses.</strong> En México es lo que más distorsiona la foto y lo que
                más apps ignoran.
              </li>
              <li>
                <strong>Cómo se carga un gasto parado en la fila.</strong> Prueba ese momento exacto antes de
                comprometerte. Si tarda más de diez segundos, no lo vas a sostener.
              </li>
              <li>
                <strong>Si lee estados de cuenta en PDF.</strong> Es lo que más trabajo ahorra mientras la conexión
                automática con bancos no exista.
              </li>
              <li>
                <strong>En qué moneda está el precio.</strong> Varias apps cobran en dólares, así que lo que pagas en
                pesos se mueve todos los meses sin que cambie nada del producto.
              </li>
              <li>
                <strong>Publicidad.</strong> Varias apps gratis se financian con anuncios dentro de la pantalla donde
                cargas. Es fricción justo donde menos conviene.
              </li>
              <li>
                <strong>Si puedes exportar y borrar tus datos.</strong> Son tus finanzas: tienes que poder llevártelas
                y tienes que poder borrarlas.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Dónde entra Finy y dónde no">
          <Prose>
            <p>
              Finy es una app de finanzas personales con IA: le hablas y carga el gasto, le sacas foto al ticket y lo
              lee, subes el PDF del estado de cuenta y extrae los movimientos. Registra compras a meses como una
              compra repartida, con su número de cuota, y avisa cuando cae cada pago. Soporta más de 40 monedas,
              incluido el peso mexicano, tiene espacios compartidos y sincroniza con Mercado Pago, que opera en México.
            </p>
            <p>
              Es una buena recomendación si tu problema es la constancia, las compras a meses o los gastos
              compartidos. <strong>No es la mejor opción</strong> si esperas conexión automática con BBVA, Banorte o
              Santander: eso no lo hace, y hoy tampoco lo hace bien ninguna otra. Tampoco sirve para contabilidad de
              empresa con facturación ni para seguimiento de inversiones.
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
