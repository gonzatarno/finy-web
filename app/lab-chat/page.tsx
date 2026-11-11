"use client"

import { useEffect, useRef, useState } from "react"
import { BorderBeam } from "border-beam"
import { ThinkingOrb, type OrbState } from "thinking-orbs"
import { VoiceBeam, useMicrophone } from "voice-glow"

/**
 * Laboratorio de las tres librerías de libraries.dev con los colores de Finy.
 * No es parte del sitio: es para mirar y decidir. Vive en /lab-chat.
 */

const LIMA = "#CEFD55"

/** Siete colores, el del centro primero y después los pares hacia afuera. */
const PALETA_VOZ = ["#E8FFA8", "#CEFD55", "#B5EC3A", "#9ADC28", "#7DCB1C", "#5FB814", "#43A30E"]

const ESTADOS: { estado: OrbState; para: string }[] = [
  { estado: "working", para: "pensando, el estado base" },
  { estado: "searching", para: "buscando en la base de conocimiento" },
  { estado: "composing", para: "armando la respuesta" },
  { estado: "connecting", para: "eligiendo a qué agente pasarle" },
  { estado: "listening", para: "mientras hablás al micrófono" },
  { estado: "solving", para: "leyendo el gasto que dictaste" },
  { estado: "breathing", para: "esperando sin hacer nada" },
  { estado: "weaving", para: "sin uso claro todavía" },
  { estado: "shaping", para: "sin uso claro todavía" },
]

const VARIANTES = ["forest", "mono", "colorful", "ice"] as const

const DURACIONES = [
  { segundos: 1.96, rotulo: "1,96 s, el de fábrica" },
  { segundos: 4, rotulo: "4 s" },
  { segundos: 6, rotulo: "6 s · elegida" },
  { segundos: 9, rotulo: "9 s" },
  { segundos: 14, rotulo: "14 s, apenas se mueve" },
]

/** El logotipo de Finy. Con sola, sólo la f. */
function Marca({ alto = 18, sola = false }: { alto?: number; sola?: boolean }) {
  const caja = sola ? "6 13.4 7 21" : "6 13.4 36 21"
  const ancho = sola ? (alto * 7) / 21 : (alto * 36) / 21
  return (
    <svg viewBox={caja} height={alto} width={ancho} aria-hidden="true">
      <path d="M42.0002 18.6692V28.2922C42.0002 32.2859 40.0425 34.2827 36.1271 34.2827C35.0952 34.2827 34.1058 34.1411 33.1587 33.8578C32.2258 33.5888 31.4555 33.1922 30.8477 32.6682L32.035 30.6714C32.5156 31.0821 33.1022 31.4078 33.7948 31.6486C34.4874 31.8893 35.2154 32.0097 35.9787 32.0097C37.1377 32.0097 37.9858 31.7265 38.523 31.16C39.0742 30.6077 39.3499 29.7509 39.3499 28.5896V28.0585C38.9258 28.5259 38.4099 28.887 37.8021 29.1419C37.1943 29.3827 36.537 29.5031 35.8302 29.5031C34.3178 29.5031 33.1234 29.0853 32.247 28.2497C31.3848 27.4142 30.9537 26.1608 30.9537 24.4897V18.6692H33.604V24.1499C33.604 25.1553 33.8301 25.913 34.2825 26.4228C34.7489 26.9185 35.4062 27.1663 36.2543 27.1663C37.2013 27.1663 37.9505 26.876 38.5018 26.2954C39.0672 25.7147 39.3499 24.8721 39.3499 23.7675V18.6692H42.0002Z" fill="currentColor" />
      <path d="M24.6026 18.58C26.0302 18.58 27.1751 18.9959 28.0374 19.8278C28.8996 20.6596 29.3307 21.8933 29.3307 23.5288V30.0002H26.6804V23.8671C26.6804 22.8802 26.4472 22.14 25.9807 21.6465C25.5143 21.139 24.8499 20.8852 23.9877 20.8852C23.0124 20.8852 22.242 21.1813 21.6766 21.7734C21.1112 22.3515 20.8285 23.1904 20.8285 24.2901V30.0002H18.1782V18.7069H20.7013V20.1662C21.1395 19.6445 21.6908 19.2497 22.3551 18.9818C23.0195 18.714 23.7686 18.58 24.6026 18.58Z" fill="currentColor" />
      <path d="M13.7206 18.7064H16.3693V30.0001H13.7206V18.7064ZM15.0555 16.8452C14.5752 16.8452 14.1726 16.6972 13.8477 16.4011C13.5228 16.0909 13.3604 15.7102 13.3604 15.2591C13.3604 14.8079 13.5228 14.4342 13.8477 14.1381C14.1726 13.8279 14.5752 13.6729 15.0555 13.6729C15.5358 13.6729 15.9384 13.8209 16.2633 14.117C16.5883 14.399 16.7507 14.7585 16.7507 15.1956C16.7507 15.6609 16.5883 16.0557 16.2633 16.38C15.9526 16.6902 15.55 16.8452 15.0555 16.8452Z" fill="currentColor" />
      <path d="M10.2918 16.2605C9.17888 16.2605 8.62242 16.8684 8.62242 18.084V18.7625H11.7287V20.8828H8.68582V30.0002H6.04443V18.0416C6.04443 16.8401 6.39662 15.8859 7.10099 15.1792C7.80536 14.4724 8.80556 14.119 10.1016 14.119C11.1018 14.119 11.8907 14.324 12.4683 14.7339L11.7287 16.727C11.3061 16.416 10.8271 16.2605 10.2918 16.2605Z" fill="currentColor" />
    </svg>
  )
}

const VELOCIDADES_OLA = [
  { ms: 620, rotulo: "620 ms" },
  { ms: 900, rotulo: "900 ms" },
  { ms: 1300, rotulo: "1300 ms · elegida" },
]

/**
 * La ola que lleva la tarjeta al comprobante.
 *
 * Tres cosas al mismo tiempo, todas desde el punto que tocaste: la pantalla de
 * atrás se contrae hacia ahí, lo nuevo se abre con un círculo que crece, y un
 * filo lima va delante de ese círculo y se apaga. Sin WebGL: clip-path para el
 * recorte y un aro que crece de tamaño, no de escala, para que el borde no
 * engorde.
 */
function Ola() {
  const caja = useRef<HTMLDivElement>(null)
  const [fase, setFase] = useState<"antes" | "yendo" | "despues">("antes")
  const [ms, setMs] = useState(1300)

  const lanzar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const marco = caja.current
    if (!marco || fase === "yendo") return
    const r = marco.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const lejos = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y))
    marco.style.setProperty("--x", `${x}px`)
    marco.style.setProperty("--y", `${y}px`)
    marco.style.setProperty("--lejos", `${Math.ceil(lejos * 2.1)}px`)
    marco.style.setProperty("--ms", `${ms}ms`)
    setFase("yendo")
    window.setTimeout(() => setFase("despues"), ms)
  }

  return (
    <div>
      <style>{`
        @keyframes ola-abre { from { clip-path: circle(0 at var(--x) var(--y)) }
                              to   { clip-path: circle(var(--lejos) at var(--x) var(--y)) } }
        @keyframes ola-filo { from { width: 0; height: 0; opacity: 1 }
                              60%  { opacity: .85 }
                              to   { width: var(--lejos); height: var(--lejos); opacity: 0 } }
        @keyframes ola-cede { from { transform: scale(1) }
                              45%  { transform: scale(.955) }
                              to   { transform: scale(.985) } }
        .ola-nueva { animation: ola-abre var(--ms) cubic-bezier(.22,1,.36,1) both }
        .ola-vieja { animation: ola-cede var(--ms) cubic-bezier(.33,1,.68,1) both; transform-origin: var(--x) var(--y) }
        .ola-filo  { animation: ola-filo var(--ms) cubic-bezier(.22,1,.36,1) both }
        @media (prefers-reduced-motion: reduce) {
          .ola-nueva, .ola-vieja, .ola-filo { animation-duration: 1ms !important }
        }
      `}</style>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <span className="text-[12px] uppercase tracking-[0.14em] text-[#6E7067]">La ola tarda</span>
        {VELOCIDADES_OLA.map((v) => (
          <button
            key={v.ms}
            type="button"
            onClick={() => setMs(v.ms)}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
              ms === v.ms
                ? "border-[#CEFD55] bg-[#CEFD55] font-semibold text-[#14150F]"
                : "border-[#2B2E23] text-[#9FA196] hover:border-[#CEFD55]/50"
            }`}
          >
            {v.rotulo}
          </button>
        ))}
      </div>

      <div
        ref={caja}
        className="relative h-[330px] w-full max-w-[300px] overflow-hidden rounded-[22px] border border-[#24261D] bg-[#0E0F0C]"
      >
        {/* la pantalla de antes */}
        <div className={`absolute inset-0 p-3.5 ${fase === "yendo" ? "ola-vieja" : ""}`}>
          <div className="mb-2.5 self-end rounded-[14px] rounded-br-[4px] bg-[#CEFD55] px-3 py-2.5 text-[13.5px] font-medium text-[#14150F]">
            gasté 3500 en un café con débito
          </div>
          <div className="overflow-hidden rounded-[14px] bg-white tabular-nums">
            <div className="border-b border-[#ECEDE7] px-3.5 pb-2.5 pt-3">
              <div className="text-[24px] font-extrabold leading-none tracking-[-0.03em] text-[#14150F]">$3.500</div>
              <div className="mt-1 text-[12.5px] text-[#6F726A]">Café · Débito</div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 px-3.5 py-2.5 text-[12.5px]">
              <dt className="text-[#85887F]">Categoría</dt>
              <dd className="m-0 text-right">
                <span className="rounded-full bg-[#F0F1EB] px-2 py-0.5 text-[11.5px] text-[#14150F]">Gastronomía</span>
              </dd>
              <dt className="text-[#85887F]">Tipo</dt>
              <dd className="m-0 text-right font-medium text-[#14150F]">Gasto</dd>
            </dl>
            <div className="flex gap-2 px-3.5 pb-3">
              <button
                type="button"
                onClick={lanzar}
                className="flex-1 rounded-[9px] bg-[#CEFD55] py-2 text-[12.5px] font-semibold text-[#14150F]"
              >
                Confirmar
              </button>
              <span className="flex-1 rounded-[9px] bg-[#F0F1EB] py-2 text-center text-[12.5px] font-semibold text-[#6F726A]">
                Editar
              </span>
            </div>
          </div>
        </div>

        {/* la pantalla de después */}
        {fase !== "antes" && (
          <div
            className={`absolute inset-0 grid place-items-center bg-[#14150F] px-6 text-center ${
              fase === "yendo" ? "ola-nueva" : ""
            }`}
          >
            <div>
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#CEFD55] text-[22px] text-[#14150F]">
                ✓
              </div>
              <div className="text-[22px] font-extrabold tracking-[-0.03em] text-[#EDEDE6]">Guardado</div>
              <div className="mt-1.5 text-[13.5px] text-[#9FA196]">$3.500 en Gastronomía, hoy</div>
              <button
                type="button"
                onClick={() => setFase("antes")}
                className="mt-6 rounded-full border border-[#2B2E23] px-4 py-1.5 text-[12.5px] text-[#9FA196]"
              >
                Otra vez
              </button>
            </div>
          </div>
        )}

        {/* el filo que va delante de la ola */}
        {fase === "yendo" && (
          <span
            aria-hidden="true"
            className="ola-filo pointer-events-none absolute rounded-full border-2 border-[#CEFD55]"
            style={{
              left: "var(--x)",
              top: "var(--y)",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 36px 2px rgba(206,253,85,.5)",
            }}
          />
        )}
      </div>
    </div>
  )
}

function Bloque({
  numero,
  titulo,
  children,
  nota,
}: {
  numero: string
  titulo: string
  children: React.ReactNode
  nota?: React.ReactNode
}) {
  return (
    <section className="border-t border-[#24261D] pt-8">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CEFD55]">{numero}</span>
      <h2 className="mb-2 mt-2 text-[21px] font-bold tracking-[-0.02em] text-[#EDEDE6]">{titulo}</h2>
      {nota && <div className="mb-5 max-w-[64ch] text-[15px] leading-relaxed text-[#9FA196]">{nota}</div>}
      {children}
    </section>
  )
}

/**
 * El beam arma su hoja de estilos con un id por instancia, y ese id no
 * coincide entre el servidor y el cliente, así que rompe la hidratación de
 * Next. Lo montamos recién en el navegador.
 */
function CampoConBeam({
  variante,
  duracion,
}: {
  variante: (typeof VARIANTES)[number]
  duracion: number
}) {
  const [enfocado, setEnfocado] = useState(false)
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  const campo = (
    <div className="flex items-center gap-2 rounded-[13px] border border-[#2B2E23] bg-[#14150F] px-3 py-2.5">
      <input
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        placeholder="Escribe lo tuyo"
        aria-label={`Campo con la variante ${variante}`}
        className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#EDEDE6] outline-none placeholder:text-[#65685D]"
      />
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#CEFD55] text-[13px] text-[#14150F]">↑</span>
    </div>
  )

  if (!montado) {
    return (
      <div>
        {campo}
        <p className={`mt-2 text-center text-[12px] ${variante === "forest" ? "text-[#CEFD55]" : "text-[#6E7067]"}`}>
        {variante === "forest" ? "forest · elegida" : variante}
      </p>
      </div>
    )
  }

  return (
    <div>
      <BorderBeam
        size="md"
        colorVariant={variante}
        theme="dark"
        active={enfocado}
        borderRadius={13}
        brightness={1.3}
        saturation={1.4}
        duration={duracion}
      >
        {campo}
      </BorderBeam>
      <p className={`mt-2 text-center text-[12px] ${variante === "forest" ? "text-[#CEFD55]" : "text-[#6E7067]"}`}>
        {variante === "forest" ? "forest · elegida" : variante}
      </p>
    </div>
  )
}

function Voz() {
  const mic = useMicrophone()
  const grabando = mic.state === "live"
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  const Envoltura = montado
    ? ({ children }: { children: React.ReactNode }) => (
        <VoiceBeam stream={mic.stream} colors={PALETA_VOZ} theme="dark" sensitivity={1.4}>
          {children}
        </VoiceBeam>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>

  return (
    <div className="max-w-[420px]">
      <Envoltura>
        <div className="flex items-center gap-2 rounded-[13px] border border-[#2B2E23] bg-[#14150F] px-3 py-2.5">
          <span className="min-w-0 flex-1 text-[13.5px] text-[#9FA196]">
            {grabando ? "Te escucho…" : mic.state === "denied" ? "No diste permiso al micrófono" : "Apretá el micrófono y hablá"}
          </span>
          <button
            type="button"
            onClick={() => (grabando ? mic.stop() : mic.start())}
            disabled={!mic.supported}
            aria-label={grabando ? "Dejar de escuchar" : "Escuchar"}
            className="grid h-8 w-8 place-items-center rounded-lg bg-[#CEFD55] text-[#14150F] disabled:opacity-30"
          >
            {grabando ? "■" : "●"}
          </button>
        </div>
      </Envoltura>
      <p className="mt-3 text-[13px] text-[#6E7067]">
        micrófono: {mic.supported ? "disponible" : "no disponible"} · estado: {mic.state}
      </p>
    </div>
  )
}

export default function LabChat() {
  const [estado, setEstado] = useState<OrbState>("searching")
  const [duracion, setDuracion] = useState(6)

  return (
    <main className="min-h-dvh bg-[#0B0C09] px-[max(20px,env(safe-area-inset-left))] py-14 text-[#EDEDE6]">
      <div className="mx-auto flex max-w-[860px] flex-col gap-9">
        <header>
          <h1 className="mb-3 text-[clamp(30px,6vw,44px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Las piezas de libraries.dev, con nuestros colores
          </h1>
          <p className="max-w-[62ch] text-[17px] leading-relaxed text-[#9FA196]">
            Las tres instaladas y andando. Son MIT, sin dependencias propias, y piden React 18 o más, así que
            también entran en la app. Tocá todo.
          </p>
        </header>

        <Bloque
          numero="00"
          titulo="El logo entero adentro del círculo"
          nota={
            <>
              Entra, pero la palabra es ancha y el círculo recorta por los costados, así que a 52 queda chiquita. A 56
              ya se lee bien. Mirá las cuatro y decime cuál.
            </>
          }
        >
          <div className="flex flex-wrap items-end gap-8">
            {[
              { lado: 52, alto: 15, texto: "52, logo entero", elegido: false },
              { lado: 56, alto: 17, texto: "56, logo entero · elegido", elegido: true },
              { lado: 60, alto: 18, texto: "60, logo entero", elegido: false },
              { lado: 52, alto: 22, texto: "52, sólo la f", sola: true, elegido: false },
            ].map((o) => (
              <div key={o.texto} className="flex flex-col items-center gap-2.5">
                <div
                  className={`grid place-items-center rounded-full bg-[#CEFD55] text-[#14150F] ${
                    o.elegido ? "ring-2 ring-[#CEFD55]/40 ring-offset-4 ring-offset-[#0B0C09]" : ""
                  }`}
                  style={{ width: o.lado, height: o.lado, boxShadow: "0 10px 30px -8px rgba(206,253,85,.3)" }}
                >
                  <Marca alto={o.alto} sola={o.sola} />
                </div>
                <span className="text-[11px] text-[#6E7067]">{o.texto}</span>
              </div>
            ))}
          </div>
        </Bloque>

        <Bloque
          numero="01"
          titulo="El orbe que piensa"
          nota={
            <>
              Esta es la que mejor nos queda. Acepta un color nuestro y trae <strong className="text-[#EDEDE6]">nueve
              estados distintos</strong>, y resulta que tres de ellos son exactamente los pasos que ya nos informa la
              consola de Botmaker: eligiendo agente, buscando en la base y redactando. Podemos mostrar el paso real,
              no una animación genérica.
            </>
          }
        >
          <div className="flex flex-wrap gap-2.5">
            {ESTADOS.map(({ estado: e, para }) => (
              <button
                key={e}
                type="button"
                onClick={() => setEstado(e)}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
                  estado === e
                    ? "border-[#CEFD55] bg-[#CEFD55] font-semibold text-[#14150F]"
                    : "border-[#2B2E23] text-[#9FA196] hover:border-[#CEFD55]/50"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[13.5px] text-[#6E7067]">{ESTADOS.find((x) => x.estado === estado)?.para}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#24261D] bg-[#0E0F0C] p-5">
              <ThinkingOrb state={estado} size={64} color={LIMA} theme="dark" dotSize={1.15} />
              <div className="mt-3 text-[13px] text-[#EDEDE6]">Con nuestro lima</div>
              <div className="text-[12px] text-[#6E7067]">se apaga hacia el negro del fondo</div>
            </div>

            <div className="rounded-2xl border border-[#24261D] bg-[#0E0F0C] p-5">
              <ThinkingOrb state={estado} size={64} theme="dark" dotSize={1.15} />
              <div className="mt-3 text-[13px] text-[#EDEDE6]">Gris de fábrica</div>
              <div className="text-[12px] text-[#6E7067]">más neutro, no compite con la tarjeta</div>
            </div>

            <div className="rounded-2xl border border-[#24261D] bg-[#0E0F0C] p-5">
              <div className="inline-flex items-center gap-2.5 rounded-[14px] rounded-bl-[4px] bg-[#1B1D17] px-3 py-2.5">
                <ThinkingOrb state={estado} size={20} color={LIMA} theme="dark" dotSize={1.3} />
                <span className="text-[13.5px] text-[#9FA196]">
                  {estado === "searching" ? "Buscando en lo que sé" : estado === "composing" ? "Armando la respuesta" : "Pensando"}
                </span>
              </div>
              <div className="mt-3 text-[13px] text-[#EDEDE6]">20 píxeles, en la burbuja</div>
              <div className="text-[12px] text-[#6E7067]">mi favorito de los tres</div>
            </div>
          </div>
        </Bloque>

        <Bloque
          numero="02"
          titulo="El borde que se enciende"
          nota={
            <>
              Venía como un reloj porque de fábrica da una vuelta cada <strong className="text-[#EDEDE6]">1,96
              segundos</strong>, que es ritmo de reloj. Ahora arranca en seis, que es un recorrido lento, y
              abajo podés comparar las cinco velocidades.
              <br />
              <br />
              El otro límite conviene saberlo antes: <strong className="text-[#EDEDE6]">la versión libre no deja poner
              un color propio</strong>, sólo elegir entre ocho paletas. El color de verdad está detrás del plan pago.
              De las ocho, la verde es la única que convive con el lima.
            </>
          }
        >
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <span className="text-[12px] uppercase tracking-[0.14em] text-[#6E7067]">Una vuelta cada</span>
            {DURACIONES.map((d) => (
              <button
                key={d.segundos}
                type="button"
                onClick={() => setDuracion(d.segundos)}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
                  duracion === d.segundos
                    ? "border-[#CEFD55] bg-[#CEFD55] font-semibold text-[#14150F]"
                    : "border-[#2B2E23] text-[#9FA196] hover:border-[#CEFD55]/50"
                }`}
              >
                {d.rotulo}
              </button>
            ))}
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            {VARIANTES.map((v) => (
              <CampoConBeam key={`${v}-${duracion}`} variante={v} duracion={duracion} />
            ))}
          </div>
          <p className="mt-5 text-[13px] text-[#6E7067]">Hacé clic adentro de cada uno. Apagado hasta que lo enfocás.</p>
        </Bloque>

        <Bloque
          numero="03"
          titulo="La voz"
          nota={
            <>
              Esta sí acepta <strong className="text-[#EDEDE6]">nuestros siete colores</strong>, y además resuelve lo
              aburrido: trae el permiso del micrófono, el estado y si el navegador lo soporta. O sea que no reacciona a
              una animación falsa, reacciona a tu voz de verdad. Apretá y hablá.
            </>
          }
        >
          <Voz />
        </Bloque>

        <Bloque
          numero="04"
          titulo="La ola, nuestra versión"
          nota={
            <>
              El gesto entero sin la distorsión de píxeles: la pantalla se contrae hacia el botón y desde el punto
              exacto donde tocaste se abre lo nuevo, con un filo lima que va adelante de la ola. Es{" "}
              <strong className="text-[#EDEDE6]">clip-path y nada más</strong>, ni WebGL ni librería.
              <br />
              <br />
              Lo puse donde creo que va: el Confirmar de la tarjeta del gasto. Tocá en distintos lugares del botón y
              vas a ver que la ola sale de ahí.
            </>
          }
        >
          <Ola />
        </Bloque>

        <Bloque
          numero="05"
          titulo="Por qué no usamos la de la librería"
          nota={
            <>
              Fui a verla. <strong className="text-[#EDEDE6]">Es sólo para SwiftUI</strong>, no hay versión web. Y en
              la app de Finy tampoco entra, porque la app es esta misma web adentro de una cáscara nativa, no SwiftUI.
              Lo verifiqué en el repo.
              <br />
              <br />
              Lo único que la suya tiene y la nuestra no es la{" "}
              <strong className="text-[#EDEDE6]">distorsión de los píxeles</strong>, esa deformación de la pantalla
              cuando pasa la ola. Para hacerla en web hay que fotografiar la pantalla a una textura y pasarla por un
              shader: la foto es lenta y se rompe con tipografías e imágenes. Por eso la dejé afuera, no por falta de
              ganas.
            </>
          }
        >
          <div />
        </Bloque>
      </div>
    </main>
  )
}
