import type { Metadata } from "next"
import Link from "next/link"
import { getGuide } from "@/lib/content/guides"
import { CONTENT_REVIEWED } from "@/lib/content/site"
import { ContentLayout, DownloadCta, Prose, Section } from "@/components/content/content-layout"
import { PageSchema } from "@/components/content/page-schema"

const guide = getGuide("apps-para-dividir-gastos-con-tu-pareja")!

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: `/guias/${guide.slug}` },
  openGraph: { title: guide.metaTitle, description: guide.metaDescription, type: "article" },
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/guias", label: "Guías" },
  { href: `/guias/${guide.slug}`, label: "Dividir gastos en pareja" },
]

const FAQS = [
  {
    q: "¿Conviene mitad y mitad o proporcional al sueldo?",
    a: "Mitad y mitad es más simple y funciona bien cuando los ingresos son parecidos. Cuando hay una diferencia grande, el reparto proporcional suele generar menos resentimiento: cada uno aporta el mismo porcentaje de lo que gana, no el mismo monto. No hay una respuesta correcta, pero sí conviene elegir una explícitamente en vez de dejarlo implícito.",
  },
  {
    q: "¿Qué app conviene para dividir gastos entre dos?",
    a: "Si sólo querés el saldo de quién le debe a quién, Splitwise alcanza y probablemente la otra persona ya lo tenga. Si además querés que esos gastos aparezcan dentro de tu control de gastos personal, conviene una app con espacios compartidos como Finy, así no cargás lo mismo dos veces.",
  },
  {
    q: "¿Por qué falla la planilla compartida?",
    a: "Porque depende de que las dos personas carguen con la misma constancia, y eso casi nunca pasa. En general uno de los dos se convierte en el contador de la pareja, se cansa, y el sistema se cae. Una app donde cada uno carga desde su propio teléfono reparte mejor ese trabajo.",
  },
  {
    q: "¿Hace falta abrir una cuenta bancaria conjunta?",
    a: "No es necesario, y muchas parejas prefieren no hacerlo. Lo importante es que quede claro qué gastos son comunes y cómo se saldan. Una cuenta conjunta simplifica los pagos, pero no reemplaza el acuerdo sobre qué se comparte.",
  },
]

export default function Page() {
  return (
    <>
      <PageSchema path={`/guias/${guide.slug}`} headline={guide.title} description={guide.answer} faqs={FAQS} breadcrumbs={trail} />
      <ContentLayout title={guide.title} intro={guide.answer} updated={CONTENT_REVIEWED} trail={trail}>
        <Section title="Primero el método, después la app">
          <Prose>
            <p>
              La discusión por la plata en pareja rara vez es por la herramienta. Es por no haber acordado el criterio
              y descubrirlo recién cuando llega un gasto grande. Hay tres esquemas que funcionan, y los tres son
              válidos siempre que estén dichos en voz alta.
            </p>
            <p>
              <strong>Mitad y mitad.</strong> Todo gasto común se divide en dos. Simple, transparente, fácil de
              sostener. Se rompe cuando los ingresos son muy distintos: el que gana menos termina destinando una
              porción mucho más grande de lo suyo.
            </p>
            <p>
              <strong>Proporcional al ingreso.</strong> Si uno aporta el 60% del ingreso del hogar, cubre el 60% de los
              gastos comunes. Es el que menos tensión genera cuando hay diferencia de sueldos. Requiere estar dispuesto
              a decirse cuánto gana cada uno, que para algunas parejas es el verdadero obstáculo.
            </p>
            <p>
              <strong>Pozo común.</strong> Cada uno pone un monto fijo por mes para los gastos de la casa y lo que
              queda es de cada quien, sin rendir cuentas. Es el que mejor protege la autonomía. Necesita que el monto
              se revise cada tanto porque los precios se mueven.
            </p>
          </Prose>
        </Section>

        <Section title="Qué herramienta encaja con cada método">
          <Prose>
            <p>
              <strong>Para mitad y mitad o proporcional</strong>, necesitás algo que lleve el saldo acumulado. Si eso
              es todo lo que querés, <Link href="/comparativas/finy-vs-splitwise">Splitwise</Link> lo hace bien y es
              probable que la otra persona ya lo tenga instalado.
            </p>
            <p>
              El límite aparece cuando querés ver tus finanzas completas. Splitwise sabe que pagaste el supermercado y
              que te deben la mitad, pero no forma parte de tu control de gastos personal, así que terminás cargando el
              mismo gasto en dos lugares. Ahí conviene una app con <strong>espacios compartidos</strong>, como{" "}
              <Link href="/">Finy</Link>: creás un espacio, invitás por link, cada uno carga desde su teléfono, la app
              calcula quién le debe a quién y el gasto igual aparece en tus números.
            </p>
            <p>
              <strong>Para el pozo común</strong>, casi no necesitás herramienta de reparto: alcanza con que los gastos
              del pozo estén juntos y separados de los personales. Un espacio compartido para la casa y tu control de
              gastos individual aparte resuelve el 90%.
            </p>
          </Prose>
        </Section>

        <Section title="Los tres errores que más se repiten">
          <Prose>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Que cargue siempre el mismo.</strong> Es la causa número uno de abandono. Elegí una
                herramienta donde cada uno cargue desde su propio teléfono, con su propia cuenta.
              </li>
              <li>
                <strong>No definir qué es gasto común.</strong> ¿El delivery del viernes es de la casa o personal? ¿Y
                el regalo para la familia del otro? Acordarlo una vez ahorra veinte discusiones.
              </li>
              <li>
                <strong>Saldar muy espaciado.</strong> Si el saldo se cierra una vez por año, el número se vuelve
                grande y emocional. Una vez por mes lo mantiene chico y aburrido, que es como conviene que sea.
              </li>
            </ul>
          </Prose>
        </Section>

        <Section title="Y si además compartís con roommates o socios">
          <Prose>
            <p>
              El mismo criterio aplica, con un matiz: cuantas más personas hay, más pesa que la herramienta ya la
              tengan todos. Para un grupo grande y ocasional —un viaje de ocho— casi siempre gana Splitwise por eso.
              Para convivencia estable de dos o tres personas, los espacios compartidos suelen ser más cómodos porque
              no obligan a llevar dos apps en paralelo.
            </p>
          </Prose>
        </Section>

        <DownloadCta
          title="Probá los espacios compartidos"
          body="Creás un espacio, invitás por link y Finy hace las cuentas. 14 días de PRO gratis al instalar, sin tarjeta."
        />

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
