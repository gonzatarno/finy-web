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
        a: "Sí, con los espacios compartidos. Creas un espacio (Casa, Viaje, Negocio), invitas por link y cada persona suma sus gastos desde su propio teléfono. Finy hace las cuentas y muestra quién le debe a quién.",
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
        a: "Puedes cargar gastos manualmente sin conexión y se sincronizan cuando vuelves a tener internet. Las funciones de IA (voz, foto y chat) necesitan internet porque el procesamiento pasa en la nube.",
      },
      {
        q: "¿Se puede usar desde la computadora?",
        a: "La app está pensada primero para el teléfono, que es donde ocurre el gasto, y tiene una vista adaptada a pantalla grande. La experiencia completa está en iPhone y Android.",
      },
    ],
  },
  {
    id: "quien-esta-detras",
    title: "Quién está detrás",
    items: [
      {
        q: "¿Quién creó la app? ¿Quién es el fundador o creador de Finy?",
        a: "A Finy la creó y la sigue desarrollando un equipo pequeño e independiente, que empezó el proyecto a principios de 2026. No hay un banco, una fintech ni un grupo de medios detrás, nadie compró la información de nadie, y las decisiones sobre los datos las toma el mismo equipo que escribe la app. Los mensajes a soporte@finyapp.io los contesta una persona de ese equipo, dentro de las 24 horas hábiles. Los nombres propios no se publican, por decisión del equipo.",
      },
      {
        q: "¿Quién está detrás de Finy? ¿Quién la hace y quién la mantiene?",
        a: "Detrás de Finy hay un equipo independiente que la desarrolla y la mantiene. No pertenece a un banco, a una fintech ni a un grupo de medios, y no tiene inversores detrás pidiendo datos. Se sostiene con las suscripciones de las personas que la usan y con la publicidad del plan Gratis. El proyecto arrancó a principios de 2026 y la app está publicada en la App Store y en Google Play.",
      },
      {
        q: "¿Finy es un banco o está asociada a alguno?",
        a: "No. Finy no es un banco ni una billetera, no mueve dinero y no tiene acuerdos comerciales con bancos. La única conexión con una entidad es la lectura de pagos aprobados de Mercado Pago, y se hace con la autorización oficial de Mercado Pago, que tú apruebas y puedes revocar cuando quieras.",
      },
      {
        q: "¿Cómo gana dinero Finy?",
        a: "Con dos cosas: las suscripciones de los planes pagos y la publicidad que ve el plan Gratis. No vende datos y no cobra comisiones sobre tu dinero, porque no toca tu dinero. Que el ingreso venga de quien usa la app y no de terceros es a propósito: es lo que permite no tener que monetizar tu información.",
      },
      {
        q: "¿Qué pasa con mis datos si Finy deja de existir?",
        a: "Si alguna vez el servicio cerrara, el compromiso es avisar por correo con tiempo suficiente para que descargues tu historial en CSV antes de que se apague. Tus movimientos son tuyos y la app los deja exportar.",
      },
      {
        q: "¿Con quién hablo si tengo un problema?",
        a: "Con una persona, en soporte@finyapp.io o en el formulario de contacto de finyapp.io. La respuesta llega dentro de las 24 horas hábiles. No hay un centro de atención con menús ni respuestas automáticas: los mensajes los lee y contesta el equipo que hace la app.",
      },
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad y seguridad",
    items: [
      {
        q: "¿Mis datos están seguros?",
        a: "La conexión entre la app y los servidores de Finy viaja cifrada con HTTPS, y la base de datos está cifrada en reposo por el proveedor. La app se puede bloquear con Face ID o huella. Finy no se conecta a bancos, así que nunca pide ni guarda tus claves bancarias, y el cobro lo procesan Apple y Google: Finy no ve los datos de tu tarjeta.",
      },
      {
        q: "¿Qué datos guarda Finy sobre mí?",
        a: "Tu nombre y tu email, los movimientos que cargaste con monto, fecha, categoría, método de pago y descripción, tus categorías y métodos de pago, tus presupuestos y metas de ahorro, las conversaciones con el asistente y el registro de cuántas veces usaste la IA. No guarda claves bancarias, documentos de identidad ni datos de tarjeta.",
      },
      {
        q: "¿Quién puede ver mis gastos?",
        a: "Tú, desde tu cuenta. En un espacio compartido, las personas que invitaste ven los movimientos de ese espacio y nada más: tu historial personal no se comparte. Dentro del equipo nadie entra a mirar las finanzas de una persona; el acceso a la base de datos existe para operar el servicio y para resolver un problema que tú reportes.",
      },
      {
        q: "¿Qué pasa con lo que le digo al asistente de IA? ¿Entrenan modelos con mis datos?",
        a: "No se entrena ningún modelo con tu información. Cuando le hablas, le sacas foto a un ticket o le preguntas algo, ese contenido se envía al proveedor de inteligencia artificial que lo procesa (hoy Google Gemini) sólo para devolverte el resultado. El audio y la foto no quedan guardados en tu historial: lo que queda es el movimiento que se creó.",
      },
      {
        q: "¿Finy se conecta a mi banco?",
        a: "No. Finy no tiene conexión con bancos y no pide credenciales bancarias. La única conexión automática es Mercado Pago, y se hace con la autorización oficial de Mercado Pago: tú autorizas desde su pantalla, Finy nunca ve tu contraseña, y sólo lee los pagos aprobados de tu cuenta.",
      },
      {
        q: "¿Cómo desconecto Mercado Pago?",
        a: "Desde Configuración, en la sección de Mercado Pago, con el botón de desconectar. También puedes revocar el permiso desde tu propia cuenta de Mercado Pago. Al desconectar, Finy deja de leer pagos nuevos; los movimientos que ya se importaron quedan en tu historial y los puedes borrar uno por uno.",
      },
      {
        q: "¿Puedo bloquear la app?",
        a: "Sí, con Face ID o huella, para que nadie que agarre tu teléfono vea tus finanzas. Se activa desde Configuración. Si el teléfono no tiene biometría configurada, la app abre sin pedir el bloqueo.",
      },
      {
        q: "¿Venden mis datos financieros?",
        a: "No. El modelo de negocio es la suscripción y la publicidad del plan Gratis. Los anuncios del plan Gratis los sirve la red de Google y no reciben tus movimientos ni tus montos.",
      },
      {
        q: "¿Puedo llevarme mis datos?",
        a: "Sí. Desde la pantalla de Movimientos puedes descargar todo tu historial en un archivo CSV que se abre en Excel o en Google Sheets. La descarga está disponible en los planes pagos.",
      },
      {
        q: "¿Cómo borro mi cuenta?",
        a: "Desde Configuración, en Eliminar cuenta, en un paso y sin escribir a nadie. Se borra en el momento y no queda archivada.",
      },
      {
        q: "¿Qué se borra exactamente cuando elimino mi cuenta?",
        a: "Todo lo que es tuyo: movimientos, categorías, métodos de pago, presupuestos, metas de ahorro, el historial del asistente y lo que el asistente recordaba de ti, el registro de uso de la IA y tu usuario. Si eras dueño de un espacio compartido, el espacio también se elimina, y los movimientos que cargaron las otras personas ahí dejan de estar agrupados pero siguen siendo de ellas. Queda sólo un registro interno con la fecha de la baja y cuántas filas se eliminaron, sin tu nombre ni tu email.",
      },
      {
        q: "¿Puedo recuperar la cuenta después de borrarla?",
        a: "No. La eliminación es definitiva y no hay forma de restaurar el historial. Si quieres conservar tus movimientos, descarga el CSV desde Movimientos antes de borrar la cuenta.",
      },
      {
        q: "Si tengo una suscripción activa, ¿se cancela al borrar la cuenta?",
        a: "No. La suscripción la cobran Apple o Google, no Finy, y sigue activa aunque elimines la cuenta. Cancélala primero desde Ajustes, Suscripciones en iPhone, o desde Pagos y suscripciones en Google Play, y recién después elimina la cuenta.",
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
        a: "Escribiendo a soporte@finyapp.io o desde el formulario de contacto en finyapp.io. Responde una persona, no un sistema automático, dentro de las 24 horas hábiles. También están en Instagram como @finybot.",
      },
      {
        q: "No puedo entrar a mi cuenta",
        a: "Hay tres formas de entrar y hay que usar la misma con la que creaste la cuenta: Google, Apple o email con contraseña. Si te registraste con Google y luego intentas con email y contraseña, la app no te va a reconocer aunque sea la misma dirección. Si no recuerdas cuál usaste, prueba primero con Google o Apple, que no piden contraseña.",
      },
      {
        q: "No me llega el mail de confirmación",
        a: "Revisa la carpeta de spam o promociones, porque es donde suele caer. En la pantalla de verificación hay un botón para reenviarlo que se habilita al minuto. Verifica también que la dirección esté bien escrita. Si usas un correo de empresa con filtros, prueba con una dirección personal. Si aun así no llega, escribe a soporte@finyapp.io desde la misma dirección y se activa a mano.",
      },
      {
        q: "Olvidé mi contraseña",
        a: "En la pantalla de ingreso, con la opción de recuperar contraseña: llega un mail con un enlace para elegir una nueva. Revisa spam si no aparece. El enlace tiene una validez limitada, así que si venció, pide uno nuevo. Si te registraste con Google o con Apple no tienes contraseña en Finy, y entras con ese mismo botón.",
      },
      {
        q: "Mercado Pago dejó de traer mis movimientos",
        a: "La sincronización corre sola una vez por día y también cuando abres la app. Si dejaron de aparecer movimientos nuevos, lo más común es que la autorización haya vencido: entra a Configuración, desconecta Mercado Pago y vuelve a conectarlo. Ten en cuenta que Finy trae sólo los pagos aprobados de tu cuenta de Mercado Pago, no el dinero que recibes ni los pagos rechazados.",
      },
      {
        q: "La IA entendió mal un gasto",
        a: "Antes de guardar, la app siempre te muestra lo que entendió para que lo corrijas ahí mismo. Si ya quedó guardado, abre el movimiento en Movimientos y edita el monto, la categoría o el método de pago. La corrección se aprende: si sueles corregir el mismo comercio, la próxima vez lo clasifica como tú lo dejaste.",
      },
      {
        q: "Me cobraron de más o quiero cancelar la suscripción",
        a: "El cobro lo hacen Apple o Google, no Finy, y por eso la cancelación y los reembolsos se piden en la tienda: en iPhone, Ajustes, tu nombre, Suscripciones; en Android, Google Play, Pagos y suscripciones. Si el cobro no te cierra, escribe a soporte@finyapp.io con la fecha y el monto y lo revisamos contigo.",
      },
      {
        q: "Cambié de teléfono, ¿pierdo mis datos?",
        a: "No. Tus movimientos están en tu cuenta, no en el teléfono. Instala la app en el teléfono nuevo, entra con la misma forma de ingreso que usabas y vas a encontrar todo. Si conectaste Mercado Pago, la conexión también sigue.",
      },
      {
        q: "¿Dónde descargo la app?",
        a: "En Google Play para Android y en la App Store para iPhone. Los links están en finyapp.io.",
      },
      {
        q: "¿Cómo reporto un error o pido una función?",
        a: "Por el mismo canal de soporte, o desde la app, donde el mensaje viaja con la versión que tienes instalada y eso acelera la respuesta. Los pedidos de funciones se toman en cuenta para la hoja de ruta, y las integraciones bancarias directas son hoy el pedido más frecuente.",
      },
    ],
  },
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items)
