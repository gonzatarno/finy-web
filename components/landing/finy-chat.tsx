"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BorderBeam } from "border-beam"
import { ThinkingOrb, type OrbState } from "thinking-orbs"
import { VoiceBeam, useMicrophone } from "voice-glow"

const WEBCHAT_ID = "G29K7UM4E7"
const SCRIPT_SRC = `https://go.botmaker.com/rest/webchat/p/${WEBCHAT_ID}/init.js`

/**
 * Chat de Finy con motor de Botmaker.
 *
 * El widget de Botmaker se carga igual que siempre, pero lo mandamos fuera de
 * pantalla: queda de motor. Sesión, reconexión, orquestador y base de
 * conocimiento siguen siendo de ellos. Nosotros sólo dibujamos.
 *
 *   mandar   bmSendMessage, que es API pública de Botmaker
 *   avisar   el widget le postMessage al padre {messageType:"new-message"}
 *   leer     el iframe no tiene src, así que es del mismo origen y se puede leer
 *
 * De lo único que dependemos que no es API es del nombre de las clases con las
 * que Botmaker dibuja cada mensaje. Si las cambian dejamos de ver respuestas,
 * así que hay un perro guardián: si mandamos algo y no vuelve nada, mostramos
 * el webchat de ellos y la conversación sigue.
 *
 * El estado vive en un contexto porque el chat se dibuja en dos lugares, la
 * sección y la burbuja flotante, y tiene que ser la misma conversación.
 */

const SELECTOR_MENSAJE = ".bm-webchat-rule-message-all-container"
const SELECTOR_BOT = ".bm-webchat-text-entry-left"
const SELECTOR_PERSONA = ".bm-webchat-text-entry-right"
const SELECTOR_HORA = ".bm-webchat-sent-tilde-time"

const LIMA = "#CEFD55"
/** Lo que dura la ola cuando se confirma un gasto. */
const OLA = 1300

const ESPERA_MOTOR = 12000
/**
 * Cuánto esperamos una respuesta antes de avisar que está tardando. El
 * orquestador con varios agentes se toma su tiempo, y una respuesta larga pasa
 * los quince segundos sin que nada esté roto. Pasado esto no se bloquea nada:
 * sólo se apagan los puntitos y se avisa.
 */
const ESPERA_RESPUESTA = 45000

type Quien = "yo" | "bot"
type Movimiento = {
  monto: string
  cuotas?: string
  categoria: string
  descripcion: string
  medio: string
  tipo: string
}
type Mensaje = {
  quien: Quien
  texto: string
  movimiento?: Movimiento
  nota?: string
  /** La hora con la que Botmaker marca el mensaje, por ejemplo "01:18 PM". */
  hora?: string
}

declare global {
  interface Window {
    bmMaximize?: () => void
    bmSendMessage?: (texto: string) => void
  }
}

/* ── el motor ──────────────────────────────────────────────────────────── */

function marcoDelWidget(): HTMLIFrameElement | null {
  return Array.from(document.querySelectorAll("iframe")).find((i) => !i.src) ?? null
}

function cajasDelWidget(): HTMLElement[] {
  return Array.from(document.body.children).filter(
    (n) => n.tagName === "DIV" && n.className === "" && n.id === "",
  ) as HTMLElement[]
}

function esconderCaja(caja: HTMLElement) {
  const yaEsta =
    caja.style.getPropertyValue("left") === "-10000px" &&
    caja.style.getPropertyValue("position") === "fixed"
  if (yaEsta) return
  caja.style.setProperty("position", "fixed", "important")
  caja.style.setProperty("left", "-10000px", "important")
  caja.style.setProperty("top", "0", "important")
  caja.style.setProperty("pointer-events", "none", "important")
}

function esconderWidget() {
  for (const caja of cajasDelWidget()) esconderCaja(caja)
}

/**
 * El widget trae tres sonidos propios, el "pop" de mensaje entre ellos. Acá
 * el chat es nuestro, así que los apagamos. Son siempre los mismos tres nodos
 * y aguantan el mute aunque les cambien el src.
 */
function silenciarWidget() {
  const doc = marcoDelWidget()?.contentDocument
  if (!doc) return
  for (const sonido of Array.from(doc.querySelectorAll("audio"))) {
    if (sonido.muted) continue
    sonido.muted = true
    sonido.volume = 0
  }
}

/**
 * Cuánto perseguimos al widget antes de dejarlo en manos del reloj lento. El
 * parpadeo pasa en el primer segundo y medio, así que cinco alcanzan de sobra.
 */
const PERSECUCION = 5000

/**
 * El parpadeo: el chat de Botmaker se ve un instante y desaparece. Pasa en
 * cada recarga y también cada vez que se manda o llega un mensaje.
 *
 * Pasa porque ellos escriben el atributo style entero cuando arman el widget
 * y cada vez que lo vuelven a pintar, y eso borra lo que le pusimos nosotros.
 * Medido: le ponen left: unset y queda visible hasta que lo tapamos. Mirar
 * cuándo lo insertan no alcanza, y el reloj de 600 milisegundos llega tarde:
 * esa es la ventana que se ve.
 *
 * Así que miramos el style de cada caja del widget y la volvemos a esconder en
 * el mismo cuadro, antes de que se pinte. El guardia de esconderCaja corta el
 * ida y vuelta: si ya está escondida no toca nada. Los primeros segundos
 * además la perseguimos cuadro por cuadro, mientras el widget se arma.
 */
function vigilarWidget(): () => void {
  const vigiladas = new WeakSet<HTMLElement>()

  const porEstilo = new MutationObserver((cambios) => {
    for (const cambio of cambios) esconderCaja(cambio.target as HTMLElement)
  })

  const revisar = () => {
    for (const caja of cajasDelWidget()) {
      esconderCaja(caja)
      if (vigiladas.has(caja)) continue
      vigiladas.add(caja)
      porEstilo.observe(caja, { attributes: true, attributeFilter: ["style"] })
    }
  }

  revisar()

  const porCuerpo = new MutationObserver(revisar)
  porCuerpo.observe(document.body, { childList: true })

  let cuadro = 0
  const desde = performance.now()
  const perseguir = () => {
    revisar()
    silenciarWidget()
    if (performance.now() - desde < PERSECUCION) cuadro = requestAnimationFrame(perseguir)
  }
  cuadro = requestAnimationFrame(perseguir)

  return () => {
    porEstilo.disconnect()
    porCuerpo.disconnect()
    cancelAnimationFrame(cuadro)
  }
}

function cargarScript() {
  if (typeof window.bmMaximize === "function") return
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
  const script = document.createElement("script")
  script.type = "text/javascript"
  script.async = true
  script.src = SCRIPT_SRC
  document.body.appendChild(script)
}

/** Las cinco líneas con las que el agente devuelve un gasto. */
function leerMovimiento(texto: string): { movimiento?: Movimiento; nota?: string } {
  const campo = (etiqueta: string) =>
    texto.match(new RegExp(`^\\s*${etiqueta}\\s*:\\s*(.+)$`, "im"))?.[1]?.trim()

  const monto = campo("Monto")
  const categoria = campo("Categor[íi]a")
  const tipo = campo("Tipo")
  if (!monto || !categoria || !tipo) return {}

  const sinCampos = texto
    .split("\n")
    .filter((l) => !/^\s*(Monto|Categor[íi]a|Descripci[óo]n|Medio de pago|Tipo)\s*:/i.test(l))
    .join(" ")
    .trim()

  // El agente manda las cuotas pegadas al monto: "180.000 en 3 cuotas de 60.000".
  const conCuotas = monto.match(/^(.+?)\s+(en\s+\d+\s+cuotas?.*)$/i)

  return {
    movimiento: {
      monto: conCuotas ? conCuotas[1].trim() : monto,
      cuotas: conCuotas ? conCuotas[2].trim() : undefined,
      categoria,
      descripcion: campo("Descripci[óo]n") ?? "",
      medio: campo("Medio de pago") ?? "",
      tipo,
    },
    nota: sinCampos || undefined,
  }
}

/**
 * Una respuesta por turno.
 *
 * Después de que el agente contesta, el orquestador manda un segundo mensaje
 * ofreciendo otros temas. No hay forma de apagarlo desde la consola: la regla
 * está escrita en las restricciones, con esas palabras, y no se cumple. Acá nos
 * quedamos con la primera respuesta de cada turno, que es la que contesta lo
 * que se preguntó. Si algún día Botmaker lo arregla, se borra esta función.
 */
function unaPorTurno(mensajes: Mensaje[]): Mensaje[] {
  return mensajes.filter((m, i) => m.quien === "yo" || i === 0 || mensajes[i - 1].quien === "yo")
}

/** Pasa "01:18 PM" a minutos desde medianoche. Devuelve null si no se entiende. */
function enMinutos(hora?: string): number | null {
  const m = hora?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!m) return null
  let h = Number(m[1]) % 12
  if (m[3]?.toUpperCase() === "PM") h += 12
  return h * 60 + Number(m[2])
}

/**
 * Dónde empieza la conversación de ahora.
 *
 * Botmaker guarda el hilo por visitante y lo trae entero, así que quien habló
 * la semana pasada abre el chat y cae en el medio de algo viejo. Para cortar,
 * lo único que tenemos es la hora de cada mensaje: ellos marcan la hora pero
 * no el día. Si la hora va para atrás de un mensaje al siguiente, ahí hubo un
 * cambio de día. No sabemos cuál, y por eso lo de antes se rotula sin fecha.
 */
function dondeEmpiezaHoy(mensajes: Mensaje[]): number {
  let corte = 0
  let previo: number | null = null
  mensajes.forEach((m, i) => {
    const ahora = enMinutos(m.hora)
    if (ahora === null) return
    if (previo !== null && ahora < previo) corte = i
    previo = ahora
  })
  return corte
}

/**
 * Lo que mandamos cuando alguien quiere empezar de nuevo.
 *
 * Una conversación nueva de verdad no se puede: Botmaker reconoce al visitante
 * por su lado y le devuelve la misma aunque borremos lo que guardamos acá
 * (probado, vuelve el mismo customerId y los mismos mensajes). Así que le
 * pedimos al asistente que suelte el hilo, cosa que hace, y de esta frase para
 * atrás no mostramos nada.
 */
const BORRON = "Empecemos de nuevo. Olvida todo lo anterior de esta conversación."

/**
 * Todo lo que va después del último borrón: ni la frase, ni lo de antes, ni la
 * respuesta con la que el asistente arranca de cero. Sin borrón, todo.
 */
function desdeElBorron(mensajes: Mensaje[]): Mensaje[] {
  let desde = -1
  mensajes.forEach((m, i) => {
    if (m.quien === "yo" && m.texto === BORRON) desde = i
  })
  if (desde < 0) return mensajes
  let i = desde + 1
  while (i < mensajes.length && mensajes[i].quien === "bot") i++
  return mensajes.slice(i)
}

function leerConversacion(): Mensaje[] {
  const doc = marcoDelWidget()?.contentDocument
  if (!doc) return []
  return unaPorTurno(Array.from(doc.querySelectorAll(SELECTOR_MENSAJE)).flatMap((nodo) => {
    const texto = (nodo as HTMLElement).innerText?.trim()
    if (!texto) return []
    const delBot = !!nodo.closest(SELECTOR_BOT)
    const dePersona = !!nodo.closest(SELECTOR_PERSONA)
    if (!delBot && !dePersona) return []
    const hora = nodo.closest(`${SELECTOR_BOT}, ${SELECTOR_PERSONA}`)
      ?.querySelector(SELECTOR_HORA)
      ?.textContent?.trim()
    if (dePersona) return [{ quien: "yo" as Quien, texto, hora }]
    return [{ quien: "bot" as Quien, texto, hora, ...leerMovimiento(texto) }]
  }))
}

/* ── el contexto ───────────────────────────────────────────────────────── */

type Asistente = {
  mensajes: Mensaje[]
  pendiente: string | null
  esperando: boolean
  demorado: boolean
  listo: boolean
  rendido: boolean
  mandar: (frase: string) => void
  reiniciar: () => void
}

const Contexto = createContext<Asistente | null>(null)

export function AsistenteProvider({ children }: { children: ReactNode }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [pendiente, setPendiente] = useState<string | null>(null)
  const [esperando, setEsperando] = useState(false)
  const [demorado, setDemorado] = useState(false)
  const [listo, setListo] = useState(false)
  const [rendido, setRendido] = useState(false)
  const alarma = useRef<number | null>(null)
  const abierto = useRef(false)

  const refrescar = useCallback(() => {
    const leidos = leerConversacion()
    setMensajes((previos) => (leidos.length === previos.length ? previos : leidos))
    if (!leidos.length) return
    setPendiente((p) => (p && leidos.some((m) => m.quien === "yo" && m.texto === p) ? null : p))
    if (leidos[leidos.length - 1].quien === "bot") {
      setEsperando(false)
      setDemorado(false)
      if (alarma.current) window.clearTimeout(alarma.current)
    }
  }, [])

  useEffect(() => {
    const dejarDeVigilar = vigilarWidget()
    cargarScript()

    const alLlegar = (e: MessageEvent) => {
      if (e?.data?.messageType === "new-message") window.setTimeout(refrescar, 120)
    }
    window.addEventListener("message", alLlegar)

    const reloj = window.setInterval(() => {
      esconderWidget()
      silenciarWidget()
      if (typeof window.bmMaximize === "function") {
        if (!abierto.current) {
          abierto.current = true
          window.bmMaximize()
        }
        setListo(true)
      }
      refrescar()
    }, 600)

    const limite = window.setTimeout(() => {
      if (typeof window.bmMaximize !== "function") setRendido(true)
    }, ESPERA_MOTOR)

    return () => {
      dejarDeVigilar()
      window.removeEventListener("message", alLlegar)
      window.clearInterval(reloj)
      window.clearTimeout(limite)
    }
  }, [refrescar])

  const mandar = useCallback((frase: string) => {
    const limpio = frase.trim()
    if (!limpio || !window.bmSendMessage) return
    window.bmSendMessage(limpio)
    setPendiente(limpio)
    setEsperando(true)
    setDemorado(false)
    if (alarma.current) window.clearTimeout(alarma.current)
    alarma.current = window.setTimeout(() => {
      setEsperando(false)
      setDemorado(true)
    }, ESPERA_RESPUESTA)
  }, [])

  const reiniciar = useCallback(() => {
    if (!window.bmSendMessage) return
    window.bmSendMessage(BORRON)
    setPendiente(null)
    setEsperando(false)
    setDemorado(false)
    if (alarma.current) window.clearTimeout(alarma.current)
  }, [])

  return (
    <Contexto.Provider value={{ mensajes, pendiente, esperando, demorado, listo, rendido, mandar, reiniciar }}>
      {children}
    </Contexto.Provider>
  )
}

function useAsistente(): Asistente {
  const v = useContext(Contexto)
  if (!v) throw new Error("Falta AsistenteProvider")
  return v
}

/* ── la interfaz ───────────────────────────────────────────────────────── */

function Marca({ alto = 18 }: { alto?: number }) {
  return (
    <svg viewBox="6 13.4 36 21" height={alto} width={(alto * 36) / 21} aria-hidden="true">
      <path d="M42.0002 18.6692V28.2922C42.0002 32.2859 40.0425 34.2827 36.1271 34.2827C35.0952 34.2827 34.1058 34.1411 33.1587 33.8578C32.2258 33.5888 31.4555 33.1922 30.8477 32.6682L32.035 30.6714C32.5156 31.0821 33.1022 31.4078 33.7948 31.6486C34.4874 31.8893 35.2154 32.0097 35.9787 32.0097C37.1377 32.0097 37.9858 31.7265 38.523 31.16C39.0742 30.6077 39.3499 29.7509 39.3499 28.5896V28.0585C38.9258 28.5259 38.4099 28.887 37.8021 29.1419C37.1943 29.3827 36.537 29.5031 35.8302 29.5031C34.3178 29.5031 33.1234 29.0853 32.247 28.2497C31.3848 27.4142 30.9537 26.1608 30.9537 24.4897V18.6692H33.604V24.1499C33.604 25.1553 33.8301 25.913 34.2825 26.4228C34.7489 26.9185 35.4062 27.1663 36.2543 27.1663C37.2013 27.1663 37.9505 26.876 38.5018 26.2954C39.0672 25.7147 39.3499 24.8721 39.3499 23.7675V18.6692H42.0002Z" fill="currentColor" />
      <path d="M24.6026 18.58C26.0302 18.58 27.1751 18.9959 28.0374 19.8278C28.8996 20.6596 29.3307 21.8933 29.3307 23.5288V30.0002H26.6804V23.8671C26.6804 22.8802 26.4472 22.14 25.9807 21.6465C25.5143 21.139 24.8499 20.8852 23.9877 20.8852C23.0124 20.8852 22.242 21.1813 21.6766 21.7734C21.1112 22.3515 20.8285 23.1904 20.8285 24.2901V30.0002H18.1782V18.7069H20.7013V20.1662C21.1395 19.6445 21.6908 19.2497 22.3551 18.9818C23.0195 18.714 23.7686 18.58 24.6026 18.58Z" fill="currentColor" />
      <path d="M13.7206 18.7064H16.3693V30.0001H13.7206V18.7064ZM15.0555 16.8452C14.5752 16.8452 14.1726 16.6972 13.8477 16.4011C13.5228 16.0909 13.3604 15.7102 13.3604 15.2591C13.3604 14.8079 13.5228 14.4342 13.8477 14.1381C14.1726 13.8279 14.5752 13.6729 15.0555 13.6729C15.5358 13.6729 15.9384 13.8209 16.2633 14.117C16.5883 14.399 16.7507 14.7585 16.7507 15.1956C16.7507 15.6609 16.5883 16.0557 16.2633 16.38C15.9526 16.6902 15.55 16.8452 15.0555 16.8452Z" fill="currentColor" />
      <path d="M10.2918 16.2605C9.17888 16.2605 8.62242 16.8684 8.62242 18.084V18.7625H11.7287V20.8828H8.68582V30.0002H6.04443V18.0416C6.04443 16.8401 6.39662 15.8859 7.10099 15.1792C7.80536 14.4724 8.80556 14.119 10.1016 14.119C11.1018 14.119 11.8907 14.324 12.4683 14.7339L11.7287 16.727C11.3061 16.416 10.8271 16.2605 10.2918 16.2605Z" fill="currentColor" />
    </svg>
  )
}

const PRUEBAS = [
  "gasté 3500 en un café con débito",
  "pagué 180.000 de gimnasio en 3 cuotas",
  "cobré el sueldo, 2.400.000",
]
const PREGUNTAS = ["¿cuánto sale el plan Pro?", "¿funciona en México?"]

/**
 * La ola del Confirmar.
 *
 * El gesto de la pantalla que se contrae hacia el botón y de lo nuevo que se
 * abre desde el punto exacto donde se tocó, con un filo lima que va adelante.
 * Es sólo clip-path y un aro que crece de tamaño, no de escala, para que el
 * borde no engorde mientras viaja.
 */
function OlaEstilos() {
  return (
    <style>{`
      @keyframes finy-ola-abre { from { clip-path: circle(0 at var(--x) var(--y)) }
                                 to   { clip-path: circle(var(--lejos) at var(--x) var(--y)) } }
      @keyframes finy-ola-filo { from { width: 0; height: 0; opacity: 1 }
                                 60%  { opacity: .85 }
                                 to   { width: var(--lejos); height: var(--lejos); opacity: 0 } }
      @keyframes finy-ola-cede { from { transform: scale(1) } 45% { transform: scale(.955) } to { transform: scale(.985) } }
      @keyframes finy-entra    { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      @keyframes finy-brota    { from { opacity: 0; transform: translateY(10px) scale(.965) } to { opacity: 1; transform: none } }
      .finy-ola-nueva { animation: finy-ola-abre ${OLA}ms cubic-bezier(.22,1,.36,1) both }
      .finy-ola-vieja { animation: finy-ola-cede ${OLA}ms cubic-bezier(.33,1,.68,1) both; transform-origin: var(--x) var(--y) }
      .finy-ola-filo  { animation: finy-ola-filo ${OLA}ms cubic-bezier(.22,1,.36,1) both }
      .finy-entra     { animation: finy-entra .42s cubic-bezier(.16,1,.3,1) both }
      .finy-brota     { animation: finy-brota .5s cubic-bezier(.16,1,.3,1) both }
      @media (prefers-reduced-motion: reduce) {
        .finy-ola-nueva, .finy-ola-vieja, .finy-ola-filo, .finy-entra, .finy-brota { animation-duration: 1ms !important }
      }
    `}</style>
  )
}

function TarjetaMovimiento({ m, nota }: { m: Movimiento; nota?: string }) {
  const caja = useRef<HTMLDivElement>(null)
  const [fase, setFase] = useState<"antes" | "yendo" | "despues">("antes")

  const confirmar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const marco = caja.current
    if (!marco || fase !== "antes") return
    const r = marco.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const lejos = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y))
    marco.style.setProperty("--x", `${x}px`)
    marco.style.setProperty("--y", `${y}px`)
    marco.style.setProperty("--lejos", `${Math.ceil(lejos * 2.1)}px`)
    setFase("yendo")
    window.setTimeout(() => setFase("despues"), OLA)
  }

  return (
    <div className="finy-brota w-[88%] self-start">
      <div ref={caja} className="relative overflow-hidden rounded-2xl bg-white tabular-nums">
        <div className={fase === "yendo" ? "finy-ola-vieja" : ""}>
        <div className="border-b border-[#ECEDE7] px-4 pb-3 pt-3.5">
          <div className="text-[25px] font-extrabold leading-none tracking-[-0.03em] text-[#14150F]">
            ${m.monto}
          </div>
          {(m.cuotas || m.descripcion) && (
            <div className="mt-1 text-[13px] text-[#6F726A]">
              {[m.cuotas, m.descripcion].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 pb-3 pt-3 text-[13px]">
          <dt className="text-[#85887F]">Categoría</dt>
          <dd className="m-0 text-right">
            <span className="inline-block rounded-full bg-[#F0F1EB] px-2.5 py-0.5 text-[12px] text-[#14150F]">
              {m.categoria}
            </span>
          </dd>
          {m.medio && (
            <>
              <dt className="text-[#85887F]">Medio de pago</dt>
              <dd className="m-0 text-right font-medium text-[#14150F]">{m.medio}</dd>
            </>
          )}
          <dt className="text-[#85887F]">Tipo</dt>
          <dd className="m-0 text-right font-medium text-[#14150F]">{m.tipo}</dd>
        </dl>
        <div className="flex gap-2 px-4 pb-3.5">
          <button
            type="button"
            onClick={confirmar}
            className="flex-1 rounded-[10px] bg-[#CEFD55] py-2 text-center text-[12.5px] font-semibold text-[#14150F]"
          >
            Confirmar
          </button>
          <span className="flex-1 rounded-[10px] bg-[#F0F1EB] py-2 text-center text-[12.5px] font-semibold text-[#6F726A]">
            Editar
          </span>
        </div>
        </div>

        {fase !== "antes" && (
          <div
            className={`absolute inset-0 grid place-items-center bg-[#14150F] px-5 text-center ${
              fase === "yendo" ? "finy-ola-nueva" : ""
            }`}
          >
            <div>
              <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#CEFD55] text-[20px] text-[#14150F]">
                ✓
              </div>
              <div className="text-[19px] font-extrabold tracking-[-0.03em] text-[#EDEDE6]">Guardado</div>
              <div className="mt-1 text-[12.5px] text-[#9FA196]">Así queda en tu app</div>
              <a
                href="#descargar"
                className="mt-4 inline-block rounded-full bg-[#CEFD55] px-4 py-1.5 text-[12.5px] font-semibold text-[#14150F]"
              >
                Bajar Finy
              </a>
            </div>
          </div>
        )}

        {fase === "yendo" && (
          <span
            aria-hidden="true"
            className="finy-ola-filo pointer-events-none absolute rounded-full border-2 border-[#CEFD55]"
            style={{
              left: "var(--x)",
              top: "var(--y)",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 36px 2px rgba(206,253,85,.5)",
            }}
          />
        )}
      </div>
      {nota && <p className="mt-2 max-w-[92%] text-[12px] leading-snug text-[#6E7067]">{nota}</p>}
    </div>
  )
}

function Sugerencias({
  rotulo,
  frases,
  onElegir,
  activo,
}: {
  rotulo: string
  frases: string[]
  onElegir: (f: string) => void
  activo: boolean
}) {
  return (
    <div className="rounded-2xl border border-[#292C21] bg-[#1B1D17] p-3.5">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E8176]">
        {rotulo}
      </div>
      {frases.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onElegir(f)}
          disabled={!activo}
          className="mb-1.5 flex w-full items-center justify-between gap-2.5 rounded-[11px] border border-[#2B2E23] bg-[#0E0F0C] px-3 py-2.5 text-left text-[13.5px] text-[#DEDFD7] transition-colors last:mb-0 hover:border-[#CEFD55]/60 hover:text-white disabled:opacity-50"
        >
          <span>{f}</span>
          <span className="text-[#585B50]">↗</span>
        </button>
      ))}
    </div>
  )
}

/**
 * Lo que decimos mientras el agente piensa.
 *
 * Son frases por tiempo, no el paso real: el widget sólo nos avisa que llegó un
 * mensaje nuevo y nada más. El razonamiento del orquestador, que sí dice en qué
 * paso está, se ve únicamente en la consola de Botmaker. Si algún día lo mandan
 * al webchat, acá se reemplazan por el paso de verdad.
 */
const PASOS: { desde: number; texto: string; orbe: OrbState }[] = [
  { desde: 0, texto: "Pensando", orbe: "working" },
  { desde: 2500, texto: "Buscando en lo que sé", orbe: "searching" },
  { desde: 6000, texto: "Armando la respuesta", orbe: "composing" },
]

function Pensando() {
  const [desde] = useState(() => Date.now())
  const [paso, setPaso] = useState(PASOS[0])

  useEffect(() => {
    const reloj = window.setInterval(() => {
      const va = Date.now() - desde
      setPaso([...PASOS].reverse().find((p) => va >= p.desde) ?? PASOS[0])
    }, 400)
    return () => window.clearInterval(reloj)
  }, [desde])

  return (
    <div className="finy-entra flex items-center gap-2.5 self-start rounded-[15px] rounded-bl-[5px] bg-[#1B1D17] px-3 py-2.5">
      <ThinkingOrb state={paso.orbe} size={20} color={LIMA} theme="dark" dotSize={1.3} />
      <span className="text-[13.5px] text-[#9FA196]">{paso.texto}</span>
    </div>
  )
}

/**
 * El campo de escribir.
 *
 * El borde se enciende sólo mientras está enfocado, y el micrófono dicta: el
 * navegador escucha y transcribe, y mandamos el texto, porque Botmaker no tiene
 * forma de recibir un audio desde afuera de su propio widget. Mientras hablás,
 * el resplandor de abajo sigue el volumen de verdad.
 *
 * Las dos piezas arman su hoja de estilos con un id por instancia, y ese id no
 * coincide entre el servidor y el cliente, así que se montan recién en el
 * navegador.
 */
function Campo({
  listo,
  rendido,
  onEnviar,
}: {
  listo: boolean
  rendido: boolean
  onEnviar: (frase: string) => void
}) {
  const [texto, setTexto] = useState("")
  const [enfocado, setEnfocado] = useState(false)
  const [montado, setMontado] = useState(false)
  const { dictando, soportado, arrancar, parar } = useDictado(setTexto)
  const mic = useMicrophone()

  useEffect(() => setMontado(true), [])

  const apagado = !listo || rendido

  const alternarVoz = () => {
    if (dictando) {
      parar()
      mic.stop()
      return
    }
    arrancar()
    mic.start()
  }

  const adentro = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (dictando) {
          parar()
          mic.stop()
        }
        onEnviar(texto)
        setTexto("")
      }}
      className="flex items-center gap-2 border-t border-[#24261D] bg-[#0E0F0C] px-4 py-3"
    >
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        disabled={apagado}
        placeholder={dictando ? "Te escucho…" : listo ? "Escribe lo tuyo" : "Abriendo el asistente…"}
        aria-label="Mensaje para el asistente de Finy"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#EDEDE6] outline-none placeholder:text-[#65685D] disabled:opacity-60"
      />
      {soportado && (
        <button
          type="button"
          onClick={alternarVoz}
          disabled={apagado}
          aria-label={dictando ? "Dejar de dictar" : "Dictar"}
          className={`grid h-7 w-7 place-items-center rounded-lg transition-colors disabled:opacity-30 ${
            dictando ? "bg-[#CEFD55] text-[#14150F]" : "text-[#6E7067] hover:text-[#EDEDE6]"
          }`}
        >
          {dictando ? (
            <span className="block h-2.5 w-2.5 rounded-[2px] bg-current" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          )}
        </button>
      )}
      <button
        type="submit"
        disabled={apagado || !texto.trim()}
        aria-label="Enviar"
        className="grid h-7 w-7 place-items-center rounded-lg bg-[#CEFD55] text-[13px] text-[#14150F] transition-opacity disabled:opacity-30"
      >
        ↑
      </button>
    </form>
  )

  if (!montado) return adentro

  return (
    <VoiceBeam stream={mic.stream} colors={PALETA_VOZ} theme="dark" sensitivity={1.4}>
      <BorderBeam
        size="line"
        colorVariant="forest"
        theme="dark"
        active={enfocado && !dictando}
        duration={6}
        brightness={1.3}
        saturation={1.4}
      >
        {adentro}
      </BorderBeam>
    </VoiceBeam>
  )
}

/** Siete colores para el resplandor de la voz, del centro hacia afuera. */
const PALETA_VOZ = ["#E8FFA8", "#CEFD55", "#B5EC3A", "#9ADC28", "#7DCB1C", "#5FB814", "#43A30E"]

type Reconocimiento = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

/**
 * Dictado del navegador. Chrome y Safari lo tienen, Firefox no, y por eso el
 * micrófono no se muestra ahí en lugar de mostrarse y fallar.
 */
function useDictado(escribir: (texto: string) => void) {
  const motor = useRef<Reconocimiento | null>(null)
  const [dictando, setDictando] = useState(false)
  const [soportado, setSoportado] = useState(false)

  useEffect(() => {
    const ventana = window as unknown as {
      SpeechRecognition?: new () => Reconocimiento
      webkitSpeechRecognition?: new () => Reconocimiento
    }
    const Motor = ventana.SpeechRecognition ?? ventana.webkitSpeechRecognition
    setSoportado(!!Motor)
    if (!Motor) return
    const m = new Motor()
    m.lang = "es"
    m.continuous = true
    m.interimResults = true
    m.onresult = (e) => {
      let dicho = ""
      for (let i = e.resultIndex; i < e.results.length; i++) dicho += e.results[i][0].transcript
      escribir(dicho.trim())
    }
    m.onend = () => setDictando(false)
    m.onerror = () => setDictando(false)
    motor.current = m
    return () => m.stop()
  }, [escribir])

  return {
    dictando,
    soportado,
    arrancar: () => {
      if (!motor.current) return
      motor.current.start()
      setDictando(true)
    },
    parar: () => motor.current?.stop(),
  }
}

/** El chat en sí. Lo usan la sección y la burbuja flotante. */
export function PanelChat({ onCerrar }: { onCerrar?: () => void }) {
  const { mensajes: todos, pendiente, esperando, demorado, listo, rendido, mandar, reiniciar } = useAsistente()
  const hilo = useRef<HTMLDivElement>(null)
  const [abriLoViejo, setAbriLoViejo] = useState(false)
  const [hayNuevo, setHayNuevo] = useState(false)

  const mensajes = desdeElBorron(todos)
  const corte = dondeEmpiezaHoy(mensajes)
  const viejos = mensajes.slice(0, corte)
  const deHoy = mensajes.slice(corte)

  const bajar = useCallback((suave = true) => {
    const caja = hilo.current
    if (!caja) return
    caja.scrollTo({ top: caja.scrollHeight, behavior: suave ? "smooth" : "auto" })
    setHayNuevo(false)
  }, [])

  /**
   * Bajar solo, pero sólo si ya estabas abajo. Si estás leyendo algo más
   * arriba, una respuesta nueva no te arranca de donde estás: avisa y vos
   * decidís.
   */
  const yaBajo = useRef(false)

  useEffect(() => {
    const caja = hilo.current
    if (!caja || !mensajes.length) return
    // La primera vez caemos abajo de una, sin avisar nada: recién abrís.
    if (!yaBajo.current) {
      yaBajo.current = true
      bajar(false)
      return
    }
    // Si acabás de escribir vos, siempre te seguimos.
    const escribiste = !!pendiente || esperando || mensajes[mensajes.length - 1]?.quien === "yo"
    const cerca = caja.scrollHeight - caja.scrollTop - caja.clientHeight < 90
    if (escribiste || cerca) bajar()
    else setHayNuevo(true)
  }, [mensajes, pendiente, esperando, demorado, bajar])

  /* Si bajás a mano hasta el final, el cartel sobra. */
  useEffect(() => {
    const caja = hilo.current
    if (!caja) return
    const alMover = () => {
      const cerca = caja.scrollHeight - caja.scrollTop - caja.clientHeight < 90
      if (cerca) setHayNuevo(false)
    }
    caja.addEventListener("scroll", alMover, { passive: true })
    return () => caja.removeEventListener("scroll", alMover)
  }, [])

  const enviar = (f: string) => {
    mandar(f)
    bajar()
  }

  const vacio = mensajes.length === 0 && !pendiente

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0E0F0C]">
      <OlaEstilos />
      <div className="flex items-center gap-2.5 border-b border-[#24261D] bg-[#14150F] px-4 py-3.5 text-[#CEFD55]">
        <Marca />
        <span className="text-[13.5px] font-semibold text-[#EDEDE6]">Asistente</span>
        {mensajes.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setAbriLoViejo(false)
              reiniciar()
            }}
            className="ml-auto rounded-full border border-[#2B2E23] px-2.5 py-1 text-[11.5px] text-[#9FA196] transition-colors hover:border-[#CEFD55]/50 hover:text-[#EDEDE6]"
          >
            Empezar de nuevo
          </button>
        )}
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar el asistente"
            className="ml-auto text-[18px] leading-none text-[#6E7067] transition-colors hover:text-[#EDEDE6]"
          >
            ×
          </button>
        )}
      </div>

      <div ref={hilo} className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4">
        {vacio && !rendido && (
          <>
            <p className="mt-1 text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
              Hola.
              <span className="block text-[#6E7067]">¿Probamos?</span>
            </p>
            <p className="mb-1 text-[14px] text-[#9FA196]">
              Dime un gasto como se lo dirías a alguien y te muestro cómo lo carga Finy.
            </p>
            <Sugerencias rotulo="Prueba con" frases={PRUEBAS} onElegir={enviar} activo={listo} />
            <Sugerencias rotulo="O pregúntame" frases={PREGUNTAS} onElegir={enviar} activo={listo} />
          </>
        )}

        {vacio && rendido && (
          <p className="my-auto text-center text-[14px] leading-relaxed text-[#9FA196]">
            El asistente no está disponible en este momento.
            <br />
            Está dentro de la app, que puedes bajar gratis.
          </p>
        )}

        {viejos.length > 0 && !abriLoViejo && (
          <button
            type="button"
            onClick={() => setAbriLoViejo(true)}
            className="self-center rounded-full border border-[#2B2E23] px-3.5 py-1.5 text-[12px] text-[#9FA196] transition-colors hover:border-[#CEFD55]/50 hover:text-[#EDEDE6]"
          >
            Ver lo que hablamos antes
          </button>
        )}

        {abriLoViejo && viejos.map((m, i) => <Burbuja key={`v${i}`} m={m} />)}

        {viejos.length > 0 && abriLoViejo && (
          <div className="flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.1em] text-[#6E7067]">
            <span className="h-px flex-1 bg-[#2B2E23]" />
            Hoy
            <span className="h-px flex-1 bg-[#2B2E23]" />
          </div>
        )}

        {deHoy.map((m, i) => <Burbuja key={`h${i}`} m={m} />)}

        {pendiente && (
          <div className="max-w-[84%] self-end rounded-[15px] rounded-br-[5px] bg-[#CEFD55] px-3 py-2.5 text-[14px] font-medium text-[#14150F] opacity-60">
            {pendiente}
          </div>
        )}

        {esperando && <Pensando />}
        {demorado && (
          <p className="self-start text-[13px] text-[#7E8176]">
            Está tardando más de lo normal. Puedes volver a escribir.
          </p>
        )}
      </div>

      <AnimatePresence>
        {hayNuevo && (
          <motion.button
            type="button"
            onClick={() => bajar()}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-[68px] left-1/2 -translate-x-1/2 rounded-full bg-[#CEFD55] px-3.5 py-1.5 text-[12px] font-semibold text-[#14150F] shadow-lg"
          >
            Hay algo nuevo
          </motion.button>
        )}
      </AnimatePresence>

      <Campo listo={listo} rendido={rendido} onEnviar={enviar} />
    </div>
  )
}

/** Un mensaje del hilo, del lado que sea. */
function Burbuja({ m }: { m: Mensaje }) {
  if (m.quien === "yo") {
    return (
      <div className="finy-entra max-w-[84%] self-end rounded-[15px] rounded-br-[5px] bg-[#CEFD55] px-3 py-2.5 text-[14px] font-medium text-[#14150F]">
        {m.texto}
      </div>
    )
  }
  if (m.movimiento) return <TarjetaMovimiento m={m.movimiento} nota={m.nota} />
  return (
    <div className="finy-entra max-w-[88%] self-start whitespace-pre-line rounded-[15px] rounded-bl-[5px] bg-[#1B1D17] px-3 py-2.5 text-[14px] leading-relaxed text-[#E3E4DC]">
      {m.texto}
    </div>
  )
}

/** El chat embebido en la sección. */
export function ChatFiny() {
  return (
    <div className="h-[560px] overflow-hidden rounded-3xl ring-1 ring-zinc-800 sm:h-[620px]">
      <PanelChat />
    </div>
  )
}

/**
 * La burbuja de toda la página. Se esconde mientras la sección del asistente
 * está a la vista, para que nunca haya dos chats abiertos a la vez.
 */
export function BurbujaFiny() {
  const [abierta, setAbierta] = useState(false)
  const [tapada, setTapada] = useState(false)

  useEffect(() => {
    const seccion = document.getElementById("asistente")
    if (!seccion) return
    const ojo = new IntersectionObserver(
      ([e]) => setTapada(e.isIntersecting),
      { threshold: 0.12 },
    )
    ojo.observe(seccion)
    return () => ojo.disconnect()
  }, [])

  if (tapada) return null

  return (
    <>
      <AnimatePresence>
        {abierta && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-5 z-[60] h-[min(560px,calc(100dvh-8rem))] w-[min(380px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
          >
            <PanelChat onCerrar={() => setAbierta(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-label={abierta ? "Cerrar el asistente de Finy" : "Abrir el asistente de Finy"}
        className="fixed bottom-5 right-5 z-[60] grid h-[56px] w-[56px] place-items-center rounded-full bg-[#CEFD55] text-[#14150F] shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {!abierta && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#CEFD55]/35"
            style={{ animation: "finy-latido 3.4s ease-out infinite" }}
          />
        )}
        <style>{`
          @keyframes finy-latido { 0% { transform: scale(.92); opacity: 0 } 30% { opacity: .9 } 100% { transform: scale(1.22); opacity: 0 } }
          @media (prefers-reduced-motion: reduce) { @keyframes finy-latido { from, to { opacity: 0 } } }
        `}</style>
        {abierta ? <span className="text-[22px] leading-none">×</span> : <Marca alto={17} />}
      </button>
    </>
  )
}
