import type { Metadata } from "next"
import Link from "next/link"
import { ContentNav, Prose, Section } from "@/components/content/content-layout"
import { Footer } from "@/components/landing/footer"
import { APP_STORE, PLAY_STORE, PAGO_UNICO } from "@/lib/content/site"

/**
 * El taller, de puertas afuera.
 *
 * La mitad que convierte. Adentro de la app el taller es una herramienta; acá
 * es el argumento. Alguien que todavía no tiene Finy entra, ve decisiones
 * tomadas de verdad (incluidas las que se rechazaron y por qué), y el pago
 * único deja de ser "Pro sale más barato a la larga" para pasar a ser "entro
 * donde se decide".
 *
 * Por eso la página muestra los rechazos y no sólo lo que se está construyendo.
 * Una lista donde todo avanza no se le cree a nadie: se lee como marketing. Los
 * "no va" con su motivo son la prueba de que del otro lado hay alguien leyendo.
 *
 * Los datos salen de la API de la app, que devuelve el taller sin sesión
 * justamente para esto. Si la API no contesta, la página se dibuja igual con la
 * explicación: el tablero es la prueba, pero el argumento se sostiene solo.
 */

export const metadata: Metadata = {
  title: "El taller de Finy: quien compra decide qué se construye",
  description:
    "Las funciones que se están construyendo en Finy, las que están en debate y las que se descartaron, con el motivo de cada decisión. Proponen y votan los que compraron Finy con el pago único.",
  alternates: { canonical: "/taller" },
  openGraph: {
    title: "El taller de Finy",
    description: "Qué se está construyendo, qué se debate y qué se descartó. Con el motivo de cada decisión.",
    type: "article",
  },
}

/** Se refresca cada cinco minutos. Un tablero de decisiones no cambia por minuto. */
export const revalidate = 300

/*
 * De dónde salen los datos.
 *
 * Configurable y no fijo: un deploy de preview y el server local necesitan
 * apuntar a otro lado, y una URL escrita a mano en medio de un fetch obliga a
 * editar el archivo para probarlo, que es como se terminan subiendo commits
 * con localhost adentro.
 */
const API = `${process.env.FINY_API ?? "https://dashboard.finyapp.io"}/api/taller`

type Estado = "abierta" | "en_estudio" | "en_curso" | "lista" | "no_va"

type Propuesta = {
  id: string
  titulo: string
  cuerpo: string
  estado: Estado
  respuesta: string | null
  autor: string
  votos: number
  comentarios: number
}

const ETIQUETA: Record<Estado, string> = {
  abierta: "En debate",
  en_estudio: "La estoy mirando",
  en_curso: "En construcción",
  lista: "Ya está",
  no_va: "No va",
}

const PINTA: Record<Estado, string> = {
  abierta: "bg-sky-100 text-sky-900",
  en_estudio: "bg-amber-100 text-amber-900",
  en_curso: "bg-violet-100 text-violet-900",
  lista: "bg-emerald-100 text-emerald-900",
  no_va: "bg-zinc-100 text-zinc-600",
}

async function traer(): Promise<Propuesta[] | null> {
  try {
    const r = await fetch(API, { next: { revalidate } })
    if (!r.ok) return null
    const d = await r.json()
    return (d.propuestas ?? []) as Propuesta[]
  } catch {
    return null
  }
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/taller", label: "El taller" },
]

function Tarjeta({ p }: { p: Propuesta }) {
  return (
    <li className="rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-center gap-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${PINTA[p.estado]}`}>
          {ETIQUETA[p.estado]}
        </span>
        <span className="text-[13px] text-zinc-400">
          {p.votos} {p.votos === 1 ? "voto" : "votos"}
          {p.comentarios > 0 && ` · ${p.comentarios} ${p.comentarios === 1 ? "comentario" : "comentarios"}`}
        </span>
      </div>

      <h3 className="mt-3 text-[18px] font-bold leading-snug text-zinc-950">{p.titulo}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{p.cuerpo}</p>

      {p.respuesta && (
        <p className="mt-4 border-l-2 border-zinc-900 pl-4 text-[14px] leading-relaxed text-zinc-700">
          <span className="font-semibold text-zinc-950">La respuesta: </span>
          {p.respuesta}
        </p>
      )}
    </li>
  )
}

function Grupo({ titulo, cuando, propuestas }: { titulo: string; cuando: string; propuestas: Propuesta[] }) {
  if (propuestas.length === 0) return null
  return (
    <Section title={titulo}>
      <p className="-mt-1 mb-5 text-[15px] text-zinc-500">{cuando}</p>
      <ul className="space-y-4">
        {propuestas.map((p) => <Tarjeta key={p.id} p={p} />)}
      </ul>
    </Section>
  )
}

/*
 * La cabecera oscura, la misma idea que adentro de la app.
 *
 * Todo el sitio es blanco. Esta página no, y no es capricho: el taller tiene
 * que parecer otro lugar antes de que se lea una palabra, porque lo que se
 * ofrece es justamente entrar a otro lugar. Una página igual a las demás,
 * explicando que hay un espacio aparte, se contradice sola.
 */
function Cabecera({ propuestas }: { propuestas: Propuesta[] | null }) {
  const salieron = (propuestas ?? []).filter((p) => p.estado === "lista").length
  const votos = (propuestas ?? []).reduce((n, p) => n + p.votos, 0)
  const hayDatos = propuestas !== null && propuestas.length > 0

  return (
    <header className="bg-zinc-950 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-9 text-[13px] text-zinc-500">
          {trail.map((t, i) => (
            <span key={t.href}>
              {i > 0 && <span className="px-2">/</span>}
              {i === trail.length - 1
                ? <span className="text-zinc-300">{t.label}</span>
                : <Link href={t.href} className="hover:text-zinc-300">{t.label}</Link>}
            </span>
          ))}
        </nav>

        <h1 className="text-[40px] font-extrabold leading-[1] tracking-tight text-white sm:text-[58px]">
          El taller
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-zinc-400 sm:text-[19px]">
          Acá se decide qué se construye en Finy. Cualquiera puede mirar: lo que
          se está haciendo, lo que está en debate y lo que se descartó, con el
          motivo de cada decisión.
        </p>

        {hayDatos && (
          <div className="mt-9 flex gap-10">
            {([
              [propuestas!.length, propuestas!.length === 1 ? "propuesta" : "propuestas"],
              [votos, votos === 1 ? "voto" : "votos"],
              [salieron, salieron === 1 ? "salió de acá" : "salieron de acá"],
            ] as [number, string][]).map(([n, t]) => (
              <div key={t}>
                <p className="text-[28px] font-extrabold leading-none text-[#CEFD55]">{n}</p>
                <p className="mt-1.5 text-[12px] font-medium text-zinc-500">{t}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

/** Los tres pasos, la respuesta a "¿y yo qué hago acá?". */
function ComoSeParticipa() {
  return (
    <ol className="mt-10 grid gap-4 sm:grid-cols-3">
      {[
        ["Alguien propone", "Cuenta algo que le falta o le molesta de la app."],
        ["Se discute", "Los demás votan y comentan. Las que más mueven suben."],
        ["Hay una respuesta", "Cada propuesta termina con una decisión escrita, incluso las que no van."],
      ].map(([que, como], i) => (
        <li key={que} className="rounded-2xl bg-zinc-50 p-5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-[12px] font-bold text-white">
            {i + 1}
          </span>
          <p className="mt-3 text-[15px] font-bold text-zinc-950">{que}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-zinc-600">{como}</p>
        </li>
      ))}
    </ol>
  )
}

export default async function TallerPage() {
  const propuestas = await traer()
  const de = (e: Estado) => (propuestas ?? []).filter((p) => p.estado === e)

  return (
    <>
      <ContentNav />
      <Cabecera propuestas={propuestas} />
      <main className="bg-white">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Prose>
        <p>
          La mayoría de las apps tienen un formulario de sugerencias que nadie
          lee. Esto es lo contrario: un lugar chico donde se discute qué falta, y
          donde las decisiones quedan escritas con el nombre de quien las
          propuso y la razón por la que se tomaron.
        </p>
        <p>
          <strong>Escriben los que compraron Finy con el pago único.</strong> No
          es una recompensa por gastar más: es que quien paga una vez se queda
          para siempre, y alguien que se queda para siempre tiene una opinión
          distinta sobre hacia dónde va la app que alguien que la está probando.
        </p>
      </Prose>

      <ComoSeParticipa />

      {propuestas === null && (
        /*
         * Si la API no contesta no se inventa nada ni se muestra un error roto.
         * Se dice, y se deja el enlace a la app, que es donde el tablero está
         * igual. La página sigue explicando lo que tiene que explicar.
         */
        <p className="mt-10 rounded-2xl bg-zinc-50 p-5 text-[15px] leading-relaxed text-zinc-600">
          El tablero no se pudo cargar en este momento. Está adentro de la app,
          en Más y después El taller.
        </p>
      )}

      {propuestas !== null && propuestas.length === 0 && (
        <p className="mt-10 rounded-2xl bg-zinc-50 p-5 text-[15px] leading-relaxed text-zinc-600">
          El taller recién abre. Las primeras propuestas van a aparecer acá
          apenas alguien las escriba.
        </p>
      )}

      <Grupo
        titulo="En construcción"
        cuando="Decidido y en camino."
        propuestas={de("en_curso")}
      />
      <Grupo
        titulo="En debate"
        cuando="Propuestas abiertas. Se votan y se discuten adentro de la app."
        propuestas={de("abierta").concat(de("en_estudio"))}
      />
      <Grupo
        titulo="Ya salió"
        cuando="Empezó como una propuesta de acá."
        propuestas={de("lista")}
      />
      <Grupo
        titulo="Lo que no se va a hacer"
        cuando="Con el motivo. Un no sin explicación no sirve para nada."
        propuestas={de("no_va")}
      />

      <Section title={PAGO_UNICO.disponible ? "Cómo se entra" : "Mientras tanto"}>
        <Prose>
          {PAGO_UNICO.disponible ? (
            <p>
              Comprando Finy Pro con el pago único: <strong>US$ {PAGO_UNICO.price}</strong>,
              una vez, sin renovación. Se compra desde la app, en la pestaña
              &ldquo;Una vez&rdquo;, y a partir de ahí podés proponer, votar y
              discutir lo que otros proponen.
            </p>
          ) : (
            <p>
              El pago único todavía no está disponible para comprar. Mientras
              tanto podés{" "}
              <Link href="/#precios">mirar los planes</Link> o bajar la app y
              usarla gratis.
            </p>
          )}
        </Prose>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={APP_STORE}
            className="rounded-full bg-zinc-950 px-6 py-3 text-[15px] font-semibold text-white"
          >
            Descargar para iPhone
          </a>
          <a
            href={PLAY_STORE}
            className="rounded-full border border-zinc-300 px-6 py-3 text-[15px] font-semibold text-zinc-950"
          >
            Descargar para Android
          </a>
        </div>
      </Section>
        </article>
      </main>
      <Footer />
    </>
  )
}
