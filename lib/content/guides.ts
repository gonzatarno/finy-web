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
