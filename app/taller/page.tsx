import type { Metadata } from "next"
import Link from "next/link"
import { ContentNav, Prose, Section } from "@/components/content/content-layout"
import { Footer } from "@/components/landing/footer"
import { APP_STORE, PLAY_STORE, PAGO_UNICO, DASHBOARD } from "@/lib/content/site"

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
  title: "El taller de Finy: en qué estamos trabajando y qué ya salió",
  description:
    "Qué estamos construyendo en Finy, qué ya salió y qué decidimos no hacer, con el motivo de cada decisión. Los que compraron con el pago único pueden escribirnos directo.",
  alternates: { canonical: "/taller" },
  openGraph: {
    title: "El taller de Finy",
    description: "Qué se está construyendo, qué salió y qué no se va a hacer. Con el motivo de cada decisión.",
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

type Entrada = {
  id: string
  titulo: string
  cuerpo: string
  estado: Estado
  respuesta: string | null
  created_at: string
}

/*
 * En primera persona del plural. "Lo estamos mirando" tiene a alguien adentro,
 * que es lo que hay que demostrar; el singular además cuenta que Finy la hace
 * una sola persona, que es cierto pero no aporta en una página de precios.
 */
const ETIQUETA: Record<Estado, string> = {
  abierta: "Lo estamos pensando",
  en_estudio: "Lo estamos mirando",
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

async function traer(): Promise<Entrada[] | null> {
  try {
    const r = await fetch(API, { next: { revalidate } })
    if (!r.ok) return null
    const d = await r.json()
    return (d.entradas ?? []) as Entrada[]
  } catch {
    return null
  }
}

const trail = [
  { href: "/", label: "Inicio" },
  { href: "/taller", label: "El taller" },
]

/*
 * Sin contadores.
 *
 * Un "2 personas votaron esto" abajo de una entrada dice en voz alta que acá no
 * hay nadie, que es lo único que esta página no puede decir. Lo que tiene que
 * mostrar es que hay alguien trabajando y decidiendo, y para eso los números de
 * otra gente no aportan nada.
 */
function Tarjeta({ p }: { p: Entrada }) {
  return (
    <li className="rounded-2xl border border-zinc-200 p-5">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${PINTA[p.estado]}`}>
        {ETIQUETA[p.estado]}
      </span>

      <h3 className="mt-3 text-[18px] font-bold leading-snug text-zinc-950">{p.titulo}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{p.cuerpo}</p>

      {p.respuesta && (
        <p className="mt-4 border-l-2 border-zinc-900 pl-4 text-[14px] leading-relaxed text-zinc-700">
          <span className="font-semibold text-zinc-950">La respuesta: </span>
          {p.respuesta}
        </p>
      )}

      {/*
        * "Opinar" en cada tarjeta y no una sola vez al final.
        *
        * La opinión aparece cuando se termina de leer algo concreto, no cuando
        * se termina la página. Un único botón abajo de todo obliga a bajar con
        * la idea en la cabeza, y para cuando se llega ya se perdió.
        *
        * Lleva al taller de la app, a ESTA entrada, no a la raíz del dashboard.
        * Dejar a la persona en la home y que vuelva a buscar el taller sola no
        * funciona: el impulso de decir algo no sobrevive a dos pantallas de
        * búsqueda. Y ese dominio ya tiene la sesión, así que el que está
        * logueado escribe sin pasar por ningún login.
        */}
      <a
        href={`${DASHBOARD}/taller#${p.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-zinc-950 underline underline-offset-4"
      >
        Opinar sobre esto
      </a>
    </li>
  )
}

function Grupo({ titulo, cuando, propuestas }: { titulo: string; cuando: string; propuestas: Entrada[] }) {
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
function Cabecera({ propuestas }: { propuestas: Entrada[] | null }) {
  const salieron = (propuestas ?? []).filter((p) => p.estado === "lista").length
  const enCurso = (propuestas ?? []).filter((p) => p.estado === "en_curso").length
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
          En qué anda Finy. Lo que estamos construyendo, lo que ya salió y lo
          que decidimos no hacer, con el motivo de cada decisión.
        </p>

        {hayDatos && (
          <div className="mt-9 flex gap-10">
            {/*
              * Los números son de lo que se hizo, no de cuánta gente hay.
              *
              * "3 en construcción" habla de trabajo; "3 personas votaron" habla
              * de una multitud que no existe. El primero se sostiene con un solo
              * usuario y el segundo no.
              */}
            {([
              [enCurso, enCurso === 1 ? "en construcción" : "en construcción"],
              [salieron, salieron === 1 ? "ya salió" : "ya salieron"],
              [propuestas!.length, propuestas!.length === 1 ? "decisión escrita" : "decisiones escritas"],
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
        ["Contamos", "Qué estamos construyendo, qué salió y qué decidimos no hacer."],
        ["Opinás", "Entrás con tu cuenta de Finy y nos escribís. Lo leemos sólo nosotros: no es un comentario público."],
        ["Te contestamos", "La respuesta te aparece en el taller, con lo que habías escrito arriba."],
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
          La mayoría de las apps te dejan un formulario de sugerencias que nadie
          lee. Acá es al revés: contamos en qué andamos, qué salió y qué
          decidimos no hacer, con el motivo de cada decisión.
        </p>
        <p>
          <strong>Los que compraron Finy con el pago único pueden
          contestarnos.</strong> No es un foro ni una comunidad: lo que escribís
          lo leemos sólo nosotros y te contestamos. No es una recompensa por
          gastar más, es que quien paga una vez se queda para siempre, y alguien
          que se queda para siempre opina distinto que alguien que está probando.
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
          No se pudo cargar en este momento. Está adentro de la app, en Más y
          después El taller.
        </p>
      )}

      {propuestas !== null && propuestas.length === 0 && (
        <p className="mt-10 rounded-2xl bg-zinc-50 p-5 text-[15px] leading-relaxed text-zinc-600">
          El taller recién abre. Lo que estemos construyendo va a aparecer acá.
        </p>
      )}

      <Grupo
        titulo="Lo que estoy construyendo"
        cuando="Decidido y en camino."
        propuestas={de("en_curso")}
      />
      <Grupo
        titulo="Lo que estoy pensando"
        cuando="Todavía sin decidir del todo."
        propuestas={de("abierta").concat(de("en_estudio"))}
      />
      <Grupo
        titulo="Lo que ya salió"
        cuando="Y en qué versión."
        propuestas={de("lista")}
      />
      <Grupo
        titulo="Lo que no vamos a hacer"
        cuando="Con el motivo. Un no sin explicación no sirve para nada."
        propuestas={de("no_va")}
      />

      <Section title={PAGO_UNICO.disponible ? "Cómo se entra" : "Mientras tanto"}>
        <Prose>
          {PAGO_UNICO.disponible ? (
            <p>
              Comprando Finy Pro con el pago único: <strong>US$ {PAGO_UNICO.price}</strong>,
              una vez, sin renovación. Se compra desde la app, en la pestaña
              &ldquo;Una vez&rdquo;, y a partir de ahí podés escribirnos directo
              sobre cualquiera de estas decisiones.
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
