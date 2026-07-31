import type { Metadata } from "next"
import Link from "next/link"
import { getGuide } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const guide = getGuide("apps-de-gastos-con-inteligencia-artificial")!

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guias/${guide.slug}` },
  openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
  { href: `/guias/${guide.slug}`, label: "Apps de gastos con IA" },
]

const FAQS = [
  {
    q: "¿Qué hace realmente la IA en una app de gastos?",
    a: "Tres cosas concretas: interpretar lo que decís en voz y convertirlo en un movimiento con monto, categoría y método de pago; leer tickets y resúmenes de tarjeta para extraer los movimientos sin tipearlos; y responder preguntas sobre tu historial con tus números reales. Todo lo demás que se promete suele ser marketing.",
  },
  {
    q: "¿Es seguro darle mis datos financieros a una app con IA?",
    a: "Depende de la app, y son preguntas que conviene hacer antes: si los datos viajan encriptados, si se venden a terceros y si podés borrarlos por completo. En el caso de Finy, la información viaja encriptada de punta a punta, no se vende a terceros y se puede borrar todo desde la app.",
  },
  {
    q: "¿La IA se equivoca al cargar un gasto?",
    a: "A veces sí, sobre todo con audios ruidosos, tickets borrosos o comercios con nombres raros. Por eso importa que la app te muestre lo que entendió antes de confirmar. Una app de gastos con IA que no te deje corregir es peor que una manual.",
  },
  {
    q: "¿Funciona sin internet?",
    a: "Las funciones de IA no, porque el procesamiento pasa en la nube. En Finy podés cargar gastos a mano sin conexión y se sincronizan cuando volvés a tener internet, pero la voz, la foto y el chat necesitan estar online.",
  },
]

export default function Page() {
  return (
    <>
      <PageSchema path={`/guias/${guide.slug}`} headline={guide.title} description={guide.answer} faqs={FAQS} breadcrumbs={trail} />
      <ContentLayout title={guide.title} intro={guide.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title="El problema que la IA sí resuelve">
          <Prose>
            <p>
              Las apps de control de gastos no se abandonan por falta de funciones. Se abandonan porque cargar cada
              movimiento es un peaje diario: cuatro toques, elegir categoría, elegir método de pago, confirmar. Doce
              segundos que no parecen nada hasta que los multiplicás por seis gastos por día durante un mes.
            </p>
            <p>
              Ahí es donde la IA cambia algo real. No porque sea inteligente, sino porque elimina el tipeo:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Voz.</strong> Decís “pagué 5 en café con débito” y el modelo extrae monto, categoría y método
                de pago. Pasás de doce segundos a dos.
              </li>
              <li>
                <strong>Foto del ticket.</strong> Sacás la foto y la app lee comercio, total y fecha.
              </li>
              <li>
                <strong>Resumen de tarjeta en PDF.</strong> Subís el archivo y en vez de cargar cuarenta movimientos,
                cargás uno.
              </li>
              <li>
                <strong>Preguntas en lenguaje natural.</strong> “¿Cuánto gasté en delivery este mes?” devuelve el
                número sin que armes ningún reporte.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Lo que la IA no resuelve">
          <Prose>
            <p>
              Conviene bajar las expectativas donde corresponde, porque acá es donde varias apps prometen de más.
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>No reemplaza la conexión con el banco.</strong> Si la app no está integrada con tu banco, la
                IA no puede adivinar tus movimientos. Lee lo que le das: audio, foto, PDF.
              </li>
              <li>
                <strong>No decide por vos.</strong> Puede mostrarte que gastás el triple en delivery que el año
                pasado. Dejar de hacerlo sigue siendo tuyo.
              </li>
              <li>
                <strong>No es infalible.</strong> Se equivoca con audios ruidosos y tickets arrugados. La app tiene que
                mostrarte lo que entendió antes de guardar.
              </li>
              <li>
                <strong>No funciona offline.</strong> El procesamiento pasa en la nube.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Cómo distinguir IA útil de IA de marketing">
          <Prose>
            <p>Tres preguntas alcanzan para separar una cosa de la otra:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>¿La IA reduce toques o los agrega?</strong> Si para usarla tenés que entrar a una sección
                aparte, no te está ahorrando nada. Tiene que estar en el camino principal de carga.
              </li>
              <li>
                <strong>¿Responde con tus números o con generalidades?</strong> Un asistente que contesta “conviene
                ahorrar el 20% de tus ingresos” es un chatbot genérico. Uno que contesta “gastaste $84.000 en delivery,
                un 31% más que el mes pasado” está leyendo tu historial.
              </li>
              <li>
                <strong>¿Podés corregir lo que entendió?</strong> Si no hay confirmación antes de guardar, vas a
                terminar con datos sucios.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Dónde entra Finy">
          <Prose>
            <p>
              <Link href="/">Finy</Link> está construida alrededor de esas cuatro entradas: voz, foto, PDF y chat sobre
              tu propio historial, con confirmación antes de guardar. Suma espacios compartidos para dividir gastos,
              más de 40 monedas y sincronización con Mercado Pago en siete países de LatAm.
            </p>
            <p>
              Lo que no hace: conectarse con bancos tradicionales —eso se cubre hoy con Mercado Pago y con el PDF del
              resumen—, contabilidad de empresa ni seguimiento de inversiones. Si buscás alguna de esas tres cosas, la
              IA no compensa la diferencia.
            </p>
            <p>
              Comparativas relacionadas:{" "}
              <Link href="/comparativas/finy-vs-mobills">Finy vs Mobills</Link>,{" "}
              <Link href="/comparativas/finy-vs-abaco">Finy vs Ábaco</Link> y{" "}
              <Link href="/comparativas/finy-vs-excel">Finy vs una planilla de Excel</Link>.
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
