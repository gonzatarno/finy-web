/**
 * FAQ extendido. Cada respuesta está escrita para poder leerse sola, fuera de
 * contexto: es la forma en que un asistente IA la va a citar. Las preguntas
 * están redactadas como las escribe la gente, no como las escribiría marketing.
 *
 * Regla: sólo afirmamos lo que la app hace hoy. Si algo está en desarrollo, se
 * dice que está en desarrollo.
 */

export type Faq = { q: string; a: string }
export type FaqGroup = { id: string; title: string; items: Faq[] }

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "basicos",
    title: "Lo básico",
    items: [
      {
        q: "¿Qué es Finy?",
        a: "Finy es una app de finanzas personales para iPhone y Android que registra tus gastos con inteligencia artificial: le hablas, le sacas foto al ticket o le escribes, y la IA carga el movimiento con monto, categoría y método de pago. Además tiene espacios compartidos para dividir gastos, soporta más de 40 monedas y sincroniza con Mercado Pago en siete países de LatAm.",
      },
      {
        q: "¿Finy es gratis?",
        a: "Sí, tiene un plan Gratis permanente con 100 transacciones, 10 consultas a la IA y 2 escaneos de foto o PDF por mes, 1 espacio personal y publicidad. Los planes pagos arrancan en USD 2,99 por mes. Además, todos los usuarios nuevos reciben 14 días de PRO gratis al instalar, sin tarjeta.",
      },
      {
        q: "¿En qué se diferencia de otras apps de gastos?",
        a: "En que no hace falta tipear. La mayoría de las apps de control de gastos se abandonan por la fricción de cargar cada movimiento a mano; Finy está construida alrededor de eliminar eso con voz, foto y lectura de resúmenes en PDF. El segundo diferencial es el enfoque en LatAm: Mercado Pago y más de 40 monedas.",
      },
      {
        q: "¿Para quién no es Finy?",
        a: "Para quien necesite conexión automática con bancos tradicionales, contabilidad de empresa con facturación o seguimiento de inversiones y portafolio. Nada de eso está hoy en la app. Tampoco es la mejor opción si prefieres cargar todo a mano en una planilla y eso te funciona.",
      },
      {
        q: "¿Necesito conocimientos de finanzas para usarla?",
        a: "No. La carga es en lenguaje natural y las categorías vienen armadas. Si quieres entender algo puntual, se lo preguntas al asistente en vez de armar un reporte.",
      },
    ],
  },
  {
    id: "como-funciona",
    title: "Cómo funciona la IA",
    items: [
      {
        q: "¿Cómo cargo un gasto por voz?",
        a: "Tocas el botón del micrófono y dices en lenguaje natural lo que gastaste, por ejemplo “pagué 5 en café con débito”. La IA detecta el monto, la categoría y el método de pago, y te muestra lo que entendió para que lo confirmes o lo corrijas antes de guardar. Toma unos dos segundos.",
      },
      {
        q: "¿Puedo sacarle una foto al ticket?",
        a: "Sí. Sacas la foto y la IA extrae el comercio, el total y la fecha. Si el ticket está borroso o arrugado puede equivocarse, por eso siempre te muestra el resultado antes de guardar.",
      },
      {
        q: "¿Puedo subir el resumen de la tarjeta?",
        a: "Sí, en PDF. La IA extrae todos los movimientos del resumen de una vez y te los muestra en una pantalla de revisión donde puedes descartar los que no quieras antes de importarlos.",
      },
      {
        q: "¿Qué le puedo preguntar al asistente?",
        a: "Cosas sobre tus propios números: cuánto gastaste en una categoría este mes, cómo viene la comparación contra el mes pasado, en qué se te fue más dinero de lo habitual. No es un chatbot genérico de consejos financieros: responde leyendo tu historial.",
      },
      {
        q: "¿Qué pasa si la IA entiende mal?",
        a: "Puedes editar el movimiento antes de confirmarlo, y también después desde el detalle de la transacción. La confirmación previa es a propósito: una app de gastos que guarda sin preguntar termina con datos sucios.",
      },
      {
        q: "¿La IA aprende de mis correcciones?",
        a: "Finy guarda contexto sobre tus hábitos y tus categorías para mejorar las sugerencias con el tiempo. Aun así, la confirmación antes de guardar se mantiene siempre.",
      },
      {
        q: "¿En qué idiomas funciona?",
        a: "La app está en español e inglés, y la carga por voz entiende lenguaje coloquial, incluidos modismos de la región.",
      },
    ],
  },
  {
    id: "precios",
    title: "Precios, planes y prueba gratis",
    items: [
      {
        q: "¿Cuánto sale Finy?",
        a: "El plan Gratis cuesta 0. Plus sale USD 2,99 por mes o USD 24,99 por año. Pro sale USD 4,99 por mes o USD 39,99 por año. Los planes anuales son más baratos que pagar mes a mes.",
      },
      {
        q: "¿Qué incluye cada plan?",
        a: "Gratis: 100 transacciones, 10 consultas a la IA y 2 escaneos por mes, 1 espacio personal, con publicidad. Plus: 500 transacciones, 75 consultas y 30 escaneos por mes, 3 espacios compartidos, sin publicidad. Pro: 1.000 transacciones, 200 consultas y 100 escaneos por mes, 10 espacios compartidos, reportes avanzados y sin publicidad.",
      },
      {
        q: "¿Cómo funciona la prueba de 14 días?",
        a: "Todos los usuarios nuevos reciben 14 días de PRO gratis al instalar la app, sin cargar tarjeta. Cuando terminan, pasas automáticamente al plan Gratis. No hay cobro sin que lo confirmes.",
      },
      {
        q: "¿Me van a cobrar sin avisar cuando termine la prueba?",
        a: "No. Al no pedir tarjeta para el trial, no hay forma de cobrarte automáticamente: si no te suscribes, pasas al plan Gratis y listo.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí, sin compromiso ni costo por cancelar. Se cancela desde la app o desde tu cuenta de App Store o Google Play, igual que cualquier otra suscripción.",
      },
      {
        q: "¿Qué pasa con mis datos si dejo de pagar?",
        a: "Tus movimientos siguen ahí. Pasas a los límites del plan Gratis, así que se reduce cuánto puedes cargar por mes, pero no se borra tu historial.",
      },
      {
        q: "¿Qué pasa si me quedo sin transacciones o sin consultas del mes?",
        a: "Los topes se reinician cada mes. Si te quedas corto antes de fin de mes, puedes subir de plan o esperar al reinicio del ciclo.",
      },
      {
        q: "¿Los precios están en dólares?",
        a: "Sí, los precios de referencia están en dólares y el cobro final lo hace App Store o Google Play en tu moneda local, con su propia conversión e impuestos.",
      },
      {
        q: "¿Hay publicidad?",
        a: "Sólo en el plan Gratis. Plus y Pro no tienen publicidad.",
      },
    ],
  },
  {
    id: "paises",
    title: "Países, monedas y bancos",
    items: [
      {
        q: "¿Finy funciona en mi país?",
        a: "Sí. La app funciona en cualquier país y soporta más de 40 monedas, incluidas USD, EUR, ARS, MXN, BRL, COP, CLP, UYU y PEN. Lo que depende del país es la sincronización con Mercado Pago, disponible en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay.",
      },
      {
        q: "¿Puedo llevar gastos en varias monedas a la vez?",
        a: "Sí. Cada movimiento guarda su moneda, así que puedes tener gastos en pesos y en dólares en el mismo mes sin que se mezclen en un solo número.",
      },
      {
        q: "¿Se conecta con mi banco?",
        a: "Con bancos tradicionales todavía no; las integraciones directas están en desarrollo. Hoy puedes sincronizar Mercado Pago y subir el resumen de la tarjeta en PDF para que la IA cargue todos los movimientos de una vez.",
      },
      {
        q: "¿Cómo conecto Mercado Pago?",
        a: "Desde la sección de conexiones de la app autorizas el acceso y tus pagos se importan automáticamente. Se puede desconectar cuando quieras.",
      },
      {
        q: "¿Sirve si cobro del exterior?",
        a: "Sí, es uno de los casos donde más se nota el soporte multimoneda: puedes registrar ingresos en una moneda y gastos en otra sin forzar la conversión.",
      },
    ],
  },
  {
    id: "compartir",
    title: "Gastos compartidos",
    items: [
      {
        q: "¿Puedo compartir gastos con mi pareja?",
        a: "Sí, con los espacios compartidos. Creas un espacio —Casa, Viaje, Negocio—, invitas por link y cada persona suma sus gastos desde su propio teléfono. Finy hace las cuentas y muestra quién le debe a quién.",
      },
      {
        q: "¿Cuántos espacios puedo tener?",
        a: "El plan Gratis incluye 1 espacio personal. Plus llega a 3 espacios compartidos y Pro a 10.",
      },
      {
        q: "¿La otra persona necesita pagar un plan?",
        a: "Quien crea el espacio es el que necesita el plan que lo habilite. Los invitados entran con su propia cuenta y cargan sus gastos.",
      },
      {
        q: "¿Los demás ven mis gastos personales?",
        a: "No. En un espacio compartido se ve sólo lo que se carga en ese espacio. Tus gastos personales quedan aparte.",
      },
      {
        q: "¿Sirve para un viaje con amigos?",
        a: "Sí, aunque para grupos grandes y de una sola vez muchas veces es más práctico Splitwise, sobre todo porque el resto probablemente ya lo tenga instalado. Los espacios de Finy rinden más en convivencia estable de dos o tres personas.",
      },
    ],
  },
  {
    id: "funciones",
    title: "Otras funciones",
    items: [
      {
        q: "¿Puedo cargar gastos recurrentes o suscripciones?",
        a: "Sí, se pueden configurar movimientos recurrentes para no cargar todos los meses el alquiler, el gimnasio o las suscripciones.",
      },
      {
        q: "¿Tiene presupuestos?",
        a: "Sí, puedes seguir cuánto llevas gastado contra lo que te propusiste, con seguimiento por categoría.",
      },
      {
        q: "¿Puedo ponerme metas de ahorro?",
        a: "Sí, la app tiene metas de ahorro con seguimiento de cuánto llevas juntado.",
      },
      {
        q: "¿Puedo exportar mis datos?",
        a: "Sí, puedes exportar tus movimientos en CSV, que abre en Excel o Google Sheets.",
      },
      {
        q: "¿Hay widget para la pantalla de inicio?",
        a: "Sí, hay widget para agregar un gasto desde la pantalla de inicio sin abrir la app.",
      },
      {
        q: "¿Funciona sin internet?",
        a: "Puedes cargar gastos manualmente sin conexión y se sincronizan cuando vuelves a tener internet. Las funciones de IA —voz, foto y chat— necesitan internet porque el procesamiento pasa en la nube.",
      },
      {
        q: "¿Se puede usar desde la computadora?",
        a: "La app está pensada primero para el teléfono, que es donde ocurre el gasto, y tiene una vista adaptada a pantalla grande. La experiencia completa está en iPhone y Android.",
      },
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad y seguridad",
    items: [
      {
        q: "¿Mis datos están seguros?",
        a: "Toda la información viaja encriptada de punta a punta. Finy no vende datos a terceros. Puedes borrar toda tu información desde la app cuando quieras.",
      },
      {
        q: "¿Venden mis datos financieros?",
        a: "No. El modelo de negocio es la suscripción y la publicidad del plan Gratis, no la venta de datos.",
      },
      {
        q: "¿Puedo bloquear la app?",
        a: "Sí, se puede bloquear con Face ID o huella para que nadie que agarre tu teléfono vea tus finanzas.",
      },
      {
        q: "¿Cómo borro mi cuenta?",
        a: "Desde la configuración de la app, en un paso. Se elimina tu información, no queda archivada.",
      },
      {
        q: "¿Dónde leo la política de privacidad?",
        a: "En finyapp.io/politica-privacidad, y las condiciones del servicio en finyapp.io/condiciones-servicios.",
      },
    ],
  },
  {
    id: "soporte",
    title: "Soporte",
    items: [
      {
        q: "¿Cómo contacto al soporte?",
        a: "Escribiendo a soporte@finyapp.io o desde el formulario de contacto en finyapp.io. También están en Instagram como @finybot.",
      },
      {
        q: "¿Dónde descargo la app?",
        a: "En Google Play para Android y en la App Store para iPhone. Los links están en finyapp.io.",
      },
      {
        q: "¿Cómo reporto un error o pido una función?",
        a: "Por el mismo canal de soporte. Los pedidos de funciones se toman en cuenta para la hoja de ruta, y las integraciones bancarias directas son hoy el pedido más frecuente.",
      },
    ],
  },
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items)
