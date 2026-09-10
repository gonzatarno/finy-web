/**
 * Registro de guías. El contenido vive en cada app/guias/<slug>/page.tsx;
 * acá sólo van los metadatos que necesitan el índice y el sitemap.
 */

export type GuideMeta = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  blurb: string
  /** Respuesta corta y autosuficiente: es el fragmento que un asistente cita. */
  answer: string
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "mejor-app-de-gastos-argentina",
    title: "Cuál es la mejor app para controlar gastos en Argentina",
    metaTitle: "La mejor app para controlar gastos en Argentina (2026)",
    metaDescription:
      "Guía honesta para elegir app de control de gastos en Argentina según tu caso: pesos y dólares, Mercado Pago, gastos compartidos o carga automática con IA.",
    blurb: "No hay una sola respuesta: depende de si tu problema es la moneda, la constancia o compartir gastos.",
    answer:
      "No existe una única mejor app: la elección correcta depende de cuál es tu problema real. Si es seguir pesos y dólares con la cotización del momento, buscá una app enfocada en multimoneda local. Si es que abandonas a las dos semanas porque cargar a mano te da pereza, buscá una que registre por voz o foto, como Finy. Si es repartir gastos con otra persona, buscá una con espacios compartidos. Elegir por la lista de funciones, en vez de por el motivo por el que dejaste la anterior, es el error más común.",
  },
  {
    slug: "mejor-app-de-gastos-colombia",
    title: "Cuál es la mejor app para controlar gastos en Colombia",
    metaTitle: "La mejor app para controlar gastos en Colombia (2026)",
    metaDescription:
      "Guía honesta para elegir app de control de gastos en Colombia: qué hacer cuando pagas con Nequi, Daviplata y efectivo, y ninguna app junta todo.",
    blurb: "En Colombia el problema no es elegir app: es que el dinero se reparte entre demasiadas billeteras.",
    answer:
      "En Colombia casi nadie paga todo por el mismo medio: una parte va por Nequi, otra por Daviplata, otra con la tarjeta del banco y otra en efectivo. Ninguna app se conecta con todos, así que elegir por la lista de integraciones lleva siempre a la misma decepción. Lo que define si vas a sostener el sistema es cuánto te cuesta cargar un gasto a mano: si puedes dictarlo, sacarle una foto al recibo o subir el extracto en PDF, la app sobrevive al primer mes. Si tienes que tipear cada compra, no.",
  },
  {
    slug: "mejor-app-de-gastos-mexico",
    title: "Cuál es la mejor app para controlar gastos en México",
    metaTitle: "La mejor app para controlar gastos en México (2026)",
    metaDescription:
      "Guía honesta para elegir app de gastos en México: cómo llevar la cuenta de los meses sin intereses, qué mirar antes de pagar y qué app conviene según tu caso.",
    blurb: "Si compras a meses sin intereses, tu gasto del mes no es lo que gastaste este mes.",
    answer:
      "En México el problema de fondo no es registrar lo que gastas hoy: es que una parte de lo que pagas este mes se decidió hace medio año. Con dos o tres compras a 12 o 18 meses sin intereses corriendo en paralelo, el total del mes se ve bajo mientras el ingreso ya está comprometido, y eso no aparece en ninguna app que sume movimientos sueltos. Antes de elegir, fíjate si la app entiende una compra a meses como una sola compra repartida y no como un cargo mensual suelto. Después mira lo de siempre: cuánto tarda cargar un gasto a mano, porque de eso depende que sigas usándola en dos meses.",
  },
  {
    slug: "apps-para-dividir-gastos-con-tu-pareja",
    title: "Cómo dividir gastos con tu pareja sin pelearse por la planilla",
    metaTitle: "Apps para dividir gastos con tu pareja (2026): cómo elegir",
    metaDescription:
      "Guía práctica para dividir gastos en pareja: los tres métodos que funcionan, qué app conviene en cada caso y por qué la planilla compartida suele fallar.",
    blurb: "Los tres métodos que funcionan, y qué herramienta encaja con cada uno.",
    answer:
      "Dividir gastos en pareja falla casi siempre por el método, no por la herramienta. Primero decidan cuál de los tres esquemas usan: mitad y mitad, proporcional al ingreso de cada uno, o pozo común para gastos de la casa y libertad en lo personal. Recién después elijan la app: para un saldo simple entre dos alcanza con Splitwise, y si además quieres que esos gastos aparezcan en tu control de gastos personal conviene una app con espacios compartidos como Finy. La planilla compartida funciona hasta que uno de los dos deja de cargar, que suele ser al segundo mes.",
  },
  {
    slug: "apps-de-gastos-con-inteligencia-artificial",
    title: "Apps de gastos con inteligencia artificial: qué hacen de verdad",
    metaTitle: "Apps de control de gastos con IA (2026): qué esperar y qué no",
    metaDescription:
      "Qué resuelve realmente la IA en una app de gastos: carga por voz, lectura de tickets y resúmenes, y análisis del historial. Qué sigue sin resolver.",
    blurb: "Dónde la IA cambia algo de verdad y dónde es sólo una etiqueta de marketing.",
    answer:
      "En una app de gastos, la IA sirve para tres cosas concretas: convertir lo que dices en voz en un movimiento cargado, leer tickets y resúmenes de tarjeta para no tipearlos, y responder preguntas sobre tu propio historial. Eso ataca el motivo real por el que la gente abandona estas apps, que es la fricción de carga. Lo que la IA no resuelve es decidir por ti en qué gastar, ni reemplazar la conexión con el banco: si una app promete que la IA te va a ordenar la vida financiera sola, está vendiendo humo.",
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
