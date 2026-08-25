/**
 * Comparativas Finy vs alternativas.
 *
 * Regla de redacción: cada comparativa tiene que decir con claridad cuándo NO
 * conviene Finy. Un asistente IA cita comparativas balanceadas y descarta las
 * que sólo elogian al producto propio. Además: no publicamos precios de la
 * competencia — cambian seguido y no los podemos verificar de forma confiable.
 * Describimos el modelo (gratis / freemium) y linkeamos al sitio oficial.
 */

export type Comparison = {
  slug: string
  competitor: string
  /** Etiqueta corta para la grilla del índice. */
  blurb: string
  title: string
  metaTitle: string
  metaDescription: string
  /** Respuesta corta y autosuficiente: es el fragmento que un asistente cita. */
  answer: string
  competitorUrl: string
  competitorSummary: string[]
  table: { dimension: string; finy: string; other: string }[]
  chooseFiny: string[]
  chooseOther: string[]
  faqs: { q: string; a: string }[]
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "finy-vs-splitwise",
    competitor: "Splitwise",
    blurb: "Dividir gastos entre varios vs. tener los gastos compartidos dentro de tus finanzas.",
    title: "Finy vs Splitwise: ¿cuál conviene para dividir gastos?",
    metaTitle: "Finy vs Splitwise — comparativa para dividir gastos (2026)",
    metaDescription:
      "Comparación honesta entre Finy y Splitwise para dividir gastos con tu pareja, roommates o en un viaje. Cuándo conviene cada uno y cuándo no.",
    answer:
      "Splitwise es mejor si lo único que necesitas es saber quién le debe a quién en un grupo, sobre todo si es un grupo grande o de una sola vez, como un viaje. Finy es mejor si esos gastos compartidos son parte de tu economía cotidiana —pareja, convivientes, un negocio chico— y quieres que aparezcan en el mismo lugar donde llevas tus gastos personales, sin cargar todo dos veces.",
    competitorUrl: "https://www.splitwise.com",
    competitorSummary: [
      "Splitwise es la referencia mundial para repartir gastos entre varias personas y llevar el saldo de quién le debe a quién. Funciona en web y en app, y tiene un plan gratuito más una suscripción paga.",
      "Su ventaja más grande no es técnica sino social: mucha gente ya lo tiene instalado. Cuando armas un grupo de viaje, la probabilidad de que todos ya sepan usarlo es alta, y eso vale mucho.",
      "Lo que Splitwise deliberadamente no hace es llevar tus finanzas personales. Es una herramienta de deudas entre personas, no un control de gastos.",
    ],
    table: [
      { dimension: "Para qué está pensado", finy: "Controlar tus gastos personales, con espacios compartidos incluidos", other: "Repartir gastos y saldar deudas dentro de un grupo" },
      { dimension: "Gastos personales", finy: "Sí, es el núcleo de la app", other: "No es su objetivo" },
      { dimension: "Cargar un gasto", finy: "Por voz, foto del ticket, PDF o a mano", other: "A mano (el escaneo de tickets está en el plan pago)" },
      { dimension: "Quién le debe a quién", finy: "Sí, con los espacios compartidos", other: "Sí, es su especialidad" },
      { dimension: "Grupos grandes y ocasionales", finy: "Funciona, pero no es el caso de uso central", other: "Muy fuerte: es exactamente para eso" },
      { dimension: "Que el otro ya lo tenga instalado", finy: "Poco probable todavía", other: "Muy probable" },
      { dimension: "Análisis con IA de tus gastos", finy: "Sí, sobre tu historial real", other: "No" },
      { dimension: "Multi-moneda", finy: "Más de 40 monedas", other: "Sí, soporta varias monedas" },
      { dimension: "Modelo", finy: "Plan gratis + Plus y Pro desde USD 2,99/mes", other: "Plan gratuito + suscripción paga (ver sitio oficial)" },
    ],
    chooseFiny: [
      "Compartes gastos de forma continua con una sola persona o con muy pocas: pareja, convivientes, un socio.",
      "Quieres que el gasto compartido y el personal vivan en el mismo lugar, sin cargar dos veces lo mismo.",
      "Te traba tener que tipear cada gasto y prefieres decirlo en voz o sacarle una foto al ticket.",
      "Quieres preguntarle a una IA cuánto gastaste en algo puntual este mes.",
    ],
    chooseOther: [
      "El grupo es grande o de una sola vez —un viaje de ocho personas— y lo único que importa es el saldo final.",
      "Los demás ya usan Splitwise y no quieres pedirles que instalen otra cosa.",
      "No quieres una app de finanzas personales: sólo quieres registrar deudas puntuales entre amigos.",
      "Necesitas usarlo desde la computadora tanto como desde el teléfono.",
    ],
    faqs: [
      {
        q: "¿Finy reemplaza a Splitwise?",
        a: "Para gastos compartidos recurrentes con pocas personas, sí: los espacios compartidos de Finy calculan quién le debe a quién y además esos gastos quedan dentro de tu control de gastos personal. Para grupos grandes u ocasionales, Splitwise sigue siendo más cómodo, sobre todo porque el resto probablemente ya lo tenga.",
      },
      {
        q: "¿Se pueden usar los dos a la vez?",
        a: "Sí, y es bastante común: Splitwise para el viaje con amigos y Finy para el día a día. No compiten por el mismo momento de uso.",
      },
      {
        q: "¿Cómo funcionan los espacios compartidos de Finy?",
        a: "Creas un espacio (Casa, Viaje, Negocio), invitas por link y cada persona suma sus gastos desde su propio teléfono. Finy hace las cuentas y muestra quién le debe a quién. El plan Gratis incluye 1 espacio personal; Plus llega a 3 espacios compartidos y Pro a 10.",
      },
    ],
  },
  {
    slug: "finy-vs-mobills",
    competitor: "Mobills",
    blurb: "Presupuesto clásico y tarjetas de crédito vs. velocidad de carga con IA.",
    title: "Finy vs Mobills: ¿cuál elegir para controlar gastos?",
    metaTitle: "Finy vs Mobills — comparativa de apps de control de gastos (2026)",
    metaDescription:
      "Comparación honesta entre Finy y Mobills: presupuesto por categoría y tarjetas de crédito frente a carga por voz y foto con IA. Cuándo conviene cada una.",
    answer:
      "Mobills es mejor si quieres una estructura de presupuesto detallada, seguimiento de varias tarjetas de crédito y metas de ahorro, y no te molesta cargar los movimientos a mano. Finy es mejor si el problema real es que abandonas las apps de gastos porque tipear cada movimiento te da pereza: la carga por voz, foto o chat es el motivo por el que existe.",
    competitorUrl: "https://www.mobills.com.br",
    competitorSummary: [
      "Mobills es una de las apps de finanzas personales más consolidadas de la región. Nació en Brasil y tiene años de recorrido, versión en español y una base de usuarios muy grande.",
      "Su fuerte es la estructura clásica del control de gastos bien resuelta: cuentas, tarjetas de crédito con cierre y vencimiento, presupuestos por categoría, metas y reportes. Si te gusta esa forma de organizar el dinero, está muy trabajada.",
      "Su modelo es freemium: hay una versión gratuita con límites y una suscripción Premium que levanta restricciones y suma integraciones. Conviene mirar el precio en su sitio oficial porque varía por país.",
    ],
    table: [
      { dimension: "Cargar un gasto", finy: "Por voz en lenguaje natural, foto del ticket, PDF del resumen o a mano", other: "A mano, con importación según plan e integraciones" },
      { dimension: "Curva de aprendizaje", finy: "Baja: hablarle y listo", other: "Media: hay que armar cuentas, tarjetas y presupuestos primero" },
      { dimension: "Presupuesto por categoría", finy: "Sí, con reportes; menos profundo", other: "Muy completo, es su especialidad" },
      { dimension: "Tarjetas de crédito", finy: "Como método de pago y vía PDF del resumen", other: "Módulo dedicado con cierre y vencimiento" },
      { dimension: "Asistente con IA sobre tu historial", finy: "Sí", other: "No es su enfoque" },
      { dimension: "Dividir gastos con otros", finy: "Sí, espacios compartidos", other: "Limitado" },
      { dimension: "Mercado Pago", finy: "Sincronización en 7 países", other: "Integraciones bancarias según país y plan" },
      { dimension: "Monedas", finy: "Más de 40", other: "Multi-moneda" },
      { dimension: "Modelo", finy: "Plan gratis + Plus y Pro desde USD 2,99/mes", other: "Freemium con plan Premium (ver sitio oficial)" },
    ],
    chooseFiny: [
      "Ya probaste apps de gastos y las dejaste después de dos semanas por la pereza de cargar.",
      "Quieres preguntar en lenguaje natural cuánto gastaste en algo y que te responda con tus números.",
      "Usas Mercado Pago como medio de pago principal.",
      "Compartes gastos con otra persona de forma habitual.",
    ],
    chooseOther: [
      "Quieres un presupuesto muy granular por categoría y sub-categoría, y disfrutas configurarlo.",
      "Manejas varias tarjetas de crédito y te importa el detalle de cierre y vencimiento de cada una.",
      "Prefieres una app con muchos años de recorrido y una comunidad grande detrás.",
      "Necesitas integración con bancos tradicionales de tu país que Finy todavía no cubre.",
    ],
    faqs: [
      {
        q: "¿Finy se conecta con mi banco como Mobills?",
        a: "Con bancos tradicionales todavía no. Finy sincroniza con Mercado Pago en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay, y permite subir el resumen de la tarjeta en PDF para que la IA extraiga todos los movimientos de una vez. Las integraciones bancarias directas están en desarrollo.",
      },
      {
        q: "¿Cuál es más barata?",
        a: "Finy tiene un plan Gratis y los pagos arrancan en USD 2,99 al mes. Mobills maneja precios distintos según el país, así que lo más honesto es comparar en su sitio oficial al momento de decidir.",
      },
      {
        q: "¿Puedo migrar mis datos de Mobills a Finy?",
        a: "No hay una importación automática desde Mobills. Lo más práctico es exportar tus movimientos y subirlos como PDF para que la IA los procese, o simplemente arrancar de cero desde el mes en curso.",
      },
    ],
  },
  {
    slug: "finy-vs-abaco",
    competitor: "Ábaco",
    blurb: "App argentina gratis con dólar blue vs. carga con IA y alcance regional.",
    title: "Finy vs Ábaco: dos apps argentinas de gastos, distintos problemas",
    metaTitle: "Finy vs Ábaco — comparativa de apps argentinas de gastos (2026)",
    metaDescription:
      "Comparación honesta entre Finy y Ábaco. Ábaco resuelve muy bien pesos y dólares en Argentina; Finy apunta a la carga automática con IA y a varios países.",
    answer:
      "Ábaco es una excelente opción si estás en Argentina, tu vida financiera se mueve entre pesos y dólares, y quieres algo gratis, simple y sin anuncios. Finy conviene si lo que te frena es cargar los gastos a mano, si manejas más de dos monedas, o si necesitas compartir gastos con otra persona. Son dos apps buenas resolviendo problemas distintos.",
    competitorUrl: "https://www.abaco.uno",
    competitorSummary: [
      "Ábaco es una app argentina de control de gastos enfocada en el problema local más concreto: llevar la cuenta en pesos y en dólares cuando la cotización se mueve todo el tiempo.",
      "Guarda la cotización del momento en cada movimiento, lo que hace que comparar meses tenga sentido incluso con inflación. Es simple, gratuita y sin publicidad.",
      "Si tu necesidad entra dentro de eso, es difícil recomendar algo mejor: hace poco y lo hace bien, que en finanzas personales suele ser una virtud.",
    ],
    table: [
      { dimension: "Cargar un gasto", finy: "Voz, foto del ticket, PDF o a mano", other: "A mano, con un flujo simple y rápido" },
      { dimension: "Pesos y dólares con cotización histórica", finy: "Multi-moneda con conversión", other: "Muy trabajado, es su razón de ser" },
      { dimension: "Cantidad de monedas", finy: "Más de 40", other: "Enfocado en ARS y USD" },
      { dimension: "Asistente con IA", finy: "Sí, responde sobre tu historial", other: "No" },
      { dimension: "Escaneo de tickets y resúmenes", finy: "Sí", other: "No" },
      { dimension: "Dividir gastos con otra persona", finy: "Sí, espacios compartidos", other: "No es su enfoque" },
      { dimension: "Alcance", finy: "LatAm y España, 7 países con Mercado Pago", other: "Pensado para Argentina" },
      { dimension: "Publicidad", finy: "Sólo en el plan Gratis", other: "Sin publicidad" },
      { dimension: "Modelo", finy: "Plan gratis + Plus y Pro desde USD 2,99/mes", other: "Gratis" },
    ],
    chooseFiny: [
      "El problema no es la moneda sino la constancia: no cargas los gastos y por eso abandonas.",
      "Manejas más de dos monedas, por viajes, clientes del exterior o ingresos en euros.",
      "Compartes gastos con tu pareja o con socios y quieres que la app haga las cuentas.",
      "Quieres que la IA lea el resumen de la tarjeta en vez de cargarlo movimiento por movimiento.",
      "Vives fuera de Argentina o te mueves entre países.",
    ],
    chooseOther: [
      "Estás en Argentina y sólo necesitas pesos y dólares, bien resueltos.",
      "Quieres algo gratis, sin publicidad y sin suscripciones, punto.",
      "Prefieres cargar a mano: te sirve como ritual de control y no te pesa.",
      "No necesitas IA ni gastos compartidos y valoras una app mínima.",
    ],
    faqs: [
      {
        q: "¿Finy sirve para llevar gastos en dólares en Argentina?",
        a: "Sí. Finy soporta más de 40 monedas, incluidas ARS y USD, así que puedes registrar movimientos en ambas. Si tu caso es específicamente seguir la brecha peso-dólar con cotización histórica, Ábaco está más enfocado en eso.",
      },
      {
        q: "¿Cuál de las dos es gratis?",
        a: "Ábaco es gratis. Finy tiene un plan Gratis con topes mensuales —100 transacciones, 10 consultas a la IA y 2 escaneos— y planes pagos desde USD 2,99 al mes si necesitas más.",
      },
    ],
  },
  {
    slug: "finy-vs-excel",
    competitor: "una planilla de Excel o Google Sheets",
    blurb: "El competidor real de casi todas las apps de gastos.",
    title: "Finy vs una planilla de Excel: ¿vale la pena cambiar?",
    metaTitle: "Finy vs Excel o Google Sheets para controlar gastos (2026)",
    metaDescription:
      "La planilla es el competidor real de las apps de gastos. Comparación honesta: qué gana y qué pierde alguien que pasa de Excel o Google Sheets a Finy.",
    answer:
      "Si tu planilla funciona y la mantienes al día, no la cambies: es gratis, es tuya y hace exactamente lo que tú quisiste que haga. El problema de la planilla casi nunca es la planilla, es el momento de cargar: estás en la calle, pagaste algo, y anotarlo implica abrir el teléfono y tipear en una grilla. Finy tiene sentido si ahí es donde se te cae el sistema.",
    competitorUrl: "",
    competitorSummary: [
      "La planilla es imbatible en flexibilidad. Cualquier categoría, cualquier fórmula, cualquier reporte que se te ocurra, y sin pedirle permiso a nadie. Los datos son tuyos y los puedes llevar a cualquier lado.",
      "También es gratis, no tiene límites de transacciones y no depende de que una empresa siga existiendo el año que viene.",
      "Su punto débil es uno solo, pero es grande: la fricción de carga en el teléfono. La mayoría de las planillas de gastos se abandonan a los dos o tres meses y casi nunca es por falta de funciones.",
    ],
    table: [
      { dimension: "Cargar un gasto en la calle", finy: "Decirlo en voz o sacarle foto al ticket, unos segundos", other: "Abrir la planilla y tipear en una grilla chica" },
      { dimension: "Flexibilidad", finy: "Categorías y espacios configurables, dentro de la estructura de la app", other: "Total: haces lo que quieras" },
      { dimension: "Costo", finy: "Plan gratis con topes; Plus y Pro desde USD 2,99/mes", other: "Gratis" },
      { dimension: "Resumen de tarjeta", finy: "Subes el PDF y la IA extrae todos los movimientos", other: "Copiar y pegar, o cargar a mano" },
      { dimension: "Preguntar algo puntual", finy: "Le preguntas en lenguaje natural", other: "Armas una fórmula o una tabla dinámica" },
      { dimension: "Compartir con otra persona", finy: "Espacios compartidos con cuentas separadas", other: "Compartir el archivo y confiar en que no se rompa" },
      { dimension: "Propiedad de los datos", finy: "En la nube; exportables y borrables desde la app", other: "Tuyos, en tu archivo" },
      { dimension: "Riesgo de abandono", finy: "Menor: la carga cuesta poco", other: "Alto, y no por falta de disciplina" },
    ],
    chooseFiny: [
      "Ya abandonaste dos o tres planillas y sabes que va a volver a pasar.",
      "Gastas sobre todo fuera de casa y necesitas anotar en el momento.",
      "Quieres que el resumen de la tarjeta se cargue solo.",
      "Compartes gastos con alguien y coordinar el archivo se hizo un problema.",
    ],
    chooseOther: [
      "Tu planilla ya funciona y no te cuesta mantenerla.",
      "Necesitas cálculos muy propios: amortizaciones, escenarios, modelos de inversión.",
      "Quieres control total del archivo y de dónde vive.",
      "No quieres pagar una suscripción ni depender de un servicio.",
    ],
    faqs: [
      {
        q: "¿Puedo pasar mi planilla a Finy?",
        a: "No hay un importador de Excel. En la práctica lo más simple es arrancar desde el mes en curso y dejar la planilla como archivo histórico. Si tienes resúmenes de tarjeta en PDF de meses anteriores, esos sí los puedes subir para que la IA los procese.",
      },
      {
        q: "¿Puedo exportar mis datos de Finy si después quiero volver a la planilla?",
        a: "Sí, puedes sacar tu información y también borrarla por completo desde la app.",
      },
    ],
  },
]

export function getComparison(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug)
}
