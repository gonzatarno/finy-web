import type { Metadata } from "next"
import Link from "next/link"
import { getGuide } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

/**
 * La segunda guía por país, con el molde de la de Argentina.
 *
 * La de Argentina trae 53 visitantes por mes, cinco veces más que las cuatro
 * comparativas juntas. La lectura es clara: la gente busca "mejor app de gastos
 * en mi país", no "Finy vs X", porque todavía no sabe que Finy existe.
 *
 * Colombia es el segundo mercado de la app (36 usuarios llegaron solos, sin una
 * sola línea de contenido dirigido a ellos).
 *
 * NO ES LA DE ARGENTINA CON OTRO NOMBRE
 * La de Argentina funciona porque habla de pesos y dólares, de Mercado Pago y
 * del PDF de la tarjeta: cosas que le pasan a un argentino. Cambiar el país en
 * el título y dejar el mismo texto da una página que no le sirve a nadie y que
 * Google no rankea.
 *
 * En Colombia el problema es otro. No es la moneda: es que el dinero se reparte
 * entre Nequi, Daviplata, la tarjeta y el efectivo, y ninguna app junta todo.
 *
 * Sobre las apps de terceros se habla en general y no con listas de funciones o
 * precios concretos: eso cambia sin aviso y una guía con un dato viejo pierde
 * lo único que la hace útil.
 */

const guide = getGuide("mejor-app-de-gastos-colombia")!

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guias/${guide.slug}` },
  openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
  { href: `/guias/${guide.slug}`, label: "Mejor app de gastos en Colombia" },
]

const FAQS = [
  {
    q: "¿Hay alguna app que se conecte con Nequi o Daviplata?",
    a: "Hoy no hay una conexión automática y confiable con las billeteras colombianas en las apps de gastos. Lo que sí funciona es el camino de al lado: subir el extracto en PDF y que la app extraiga los movimientos, o cargar por voz y foto en el momento. Desconfía de cualquier app que prometa conectarse con todas tus cuentas en Colombia.",
  },
  {
    q: "¿Cuál es la mejor app gratis para controlar gastos en Colombia?",
    a: "Depende de cuánto cargues por mes. Casi todas las apps tienen plan gratis con topes, así que primero contá cuántos movimientos haces: si son pocos, cualquiera te sirve. Si son muchos, el plan gratis se te va a quedar corto en semanas y conviene mirar el precio real antes de empezar a cargar. Finy tiene plan gratis con topes mensuales y suma carga por voz y foto.",
  },
  {
    q: "Pago con Nequi, con tarjeta y en efectivo. ¿Cómo llevo todo junto?",
    a: "Ese es el problema real en Colombia y ninguna app lo resuelve conectándose sola. La forma que funciona es mixta: subir el extracto de la tarjeta en PDF para lo que pasó por el banco, y cargar en el momento lo de las billeteras y el efectivo. Lo que define si lo vas a sostener es cuánto tarda esa carga en el momento: si es dictar una frase o sacar una foto, se sostiene.",
  },
  {
    q: "¿Sirve la app de mi banco para llevar mis gastos?",
    a: "Sirve para ver lo que pasó por esa cuenta, y nada más. En cuanto pagas por Nequi, con otra tarjeta o en efectivo, la foto queda incompleta. Por eso la mayoría termina usando una app aparte que junte todo, aunque implique cargar una parte a mano.",
  },
  {
    q: "¿Puedo llevar pesos colombianos y dólares al mismo tiempo?",
    a: "Sí, pero fíjate que la app guarde la moneda de cada movimiento en lugar de convertir todo a un solo número. Si conviertes al final, comparar dos meses deja de significar algo. Finy soporta más de 40 monedas, incluido el peso colombiano con su formato local.",
  },
]

export default function Page() {
  return (
    <>
      <PageSchema path={`/guias/${guide.slug}`} headline={guide.title} description={guide.answer} faqs={FAQS} breadcrumbs={trail} />
      <ContentLayout title={guide.title} intro={guide.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title="El problema en Colombia no es cuál app, es cuántas billeteras">
          <Prose>
            <p>
              La pregunta suele ser cuál app es mejor. Pero si haces la cuenta de por dónde te sale la plata en un mes
              cualquiera, aparece el problema real: una parte por Nequi, otra por Daviplata, otra con la tarjeta del
              banco, otra en efectivo. Cuatro lugares, y ninguna app se conecta con los cuatro.
            </p>
            <p>
              Por eso elegir por la lista de integraciones lleva siempre a la misma decepción: instalas, conectas lo
              único que se deja conectar, y el total que ves sigue siendo una fracción de lo que gastaste.
            </p>
            <p>
              Lo que sí decide si vas a seguir usando la app dentro de dos meses es otra cosa, mucho menos vistosa:
              cuánto te cuesta cargar un gasto a mano.
            </p>
          </Prose>
        </Section>

        <Section title="Qué elegir según tu caso">
          <Prose>
            <p>
              <strong>Si tu problema es que abandonas a las tres semanas.</strong> Es el caso más común y el que menos
              se admite. No necesitas más funciones: necesitas que cargar un gasto tarde segundos. Busca apps donde
              puedas dictarlo por voz, sacarle una foto al recibo o subir el extracto en PDF de una vez. Es exactamente
              el problema para el que existe <Link href="/">Finy</Link>.
            </p>
            <p>
              <strong>Si tu problema es la foto incompleta.</strong> Asumí que vas a tener que juntar de dos fuentes:
              el extracto del banco o la tarjeta para lo grande, y carga en el momento para las billeteras y el
              efectivo. Una app que lea el PDF del extracto te ahorra la mitad del trabajo de entrada.
            </p>
            <p>
              <strong>Si compartes gastos con alguien.</strong> Necesitas espacios compartidos, no una planilla. Está
              desarrollado en la guía de{" "}
              <Link href="/guias/apps-para-dividir-gastos-con-tu-pareja">cómo dividir gastos en pareja</Link>.
            </p>
            <p>
              <strong>Si además manejas dólares</strong> porque cobras del exterior o ahorras en divisa, fíjate que la
              app guarde la moneda de cada movimiento y no convierta todo a pesos al final.
            </p>
            <p>
              <strong>Si tu planilla funciona</strong>, quédate con la planilla. Lo desarrollamos en{" "}
              <Link href="/comparativas/finy-vs-excel">Finy vs Excel</Link>.
            </p>
          </Prose>
        </Section>

        <Section title="Lo que conviene mirar antes de decidir">
          <Prose>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Cómo se carga un gasto parado en la fila de la tienda.</strong> Prueba ese momento exacto antes
                de comprometerte. Si tarda más de diez segundos, no lo vas a sostener.
              </li>
              <li>
                <strong>Si lee extractos en PDF.</strong> Es lo que más trabajo te ahorra en Colombia, justamente
                porque la conexión automática con bancos y billeteras no está resuelta.
              </li>
              <li>
                <strong>En qué moneda está el precio.</strong> Varias apps cobran en dólares, así que lo que pagas en
                pesos se mueve todos los meses sin que cambie nada del producto.
              </li>
              <li>
                <strong>Si el plan gratis alcanza para tu volumen.</strong> Contá cuántos movimientos haces por mes
                antes de mirar los topes.
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
              Finy es una app de finanzas personales con IA: le hablas y carga el gasto, le sacas foto al recibo y lo
              lee, subes el PDF del extracto y extrae todos los movimientos. Soporta más de 40 monedas, incluido el
              peso colombiano, tiene espacios compartidos para dividir gastos, y sincroniza con Mercado Pago, que opera
              en Colombia.
            </p>
            <p>
              Es una buena recomendación si tu problema es la constancia o los gastos compartidos.{" "}
              <strong>No es la mejor opción</strong> si esperas que se conecte sola con Nequi, Daviplata o tu banco:
              eso no lo hace, y hoy tampoco lo hace bien ninguna otra. Tampoco sirve para contabilidad de empresa con
              facturación ni para seguimiento de inversiones.
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
