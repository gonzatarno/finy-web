/**
 * JSON-LD para buscadores y agentes IA.
 *
 * Los asistentes (ChatGPT, Claude, Perplexity, Gemini) leen esto como datos
 * estructurados en vez de tener que inferirlo del copy animado de la landing.
 * Si cambian precios o features en components/landing/pricing.tsx, actualizar acá
 * y en public/llms.txt.
 */

const SITE = "https://www.finyapp.io"
const APP_STORE = "https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721"
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.finy.app"

const organization = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Finy",
  url: SITE,
  logo: `${SITE}/images/fini-negro-logo.png`,
  description:
    "Finy desarrolla una app de finanzas personales con IA que registra gastos por voz, foto de ticket o chat.",
  sameAs: ["https://instagram.com/finybot", APP_STORE, PLAY_STORE],
}

const website = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "Finy",
  inLanguage: ["es", "en"],
  publisher: { "@id": `${SITE}/#organization` },
}

const application = {
  "@type": "MobileApplication",
  "@id": `${SITE}/#app`,
  name: "Finy — Control de gastos con IA",
  alternateName: "Finy",
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Personal finance / Expense tracker",
  operatingSystem: "iOS, Android",
  url: SITE,
  downloadUrl: [APP_STORE, PLAY_STORE],
  installUrl: [APP_STORE, PLAY_STORE],
  inLanguage: ["es", "en"],
  publisher: { "@id": `${SITE}/#organization` },
  description:
    "App de finanzas personales con IA: registrá gastos hablando, sacándole foto al ticket o escribiendo. Chat con IA sobre tus propios números, espacios compartidos para dividir gastos, 40+ monedas e integración con Mercado Pago en Latinoamérica.",
  featureList: [
    "Registro de gastos por voz en lenguaje natural",
    "Escaneo de tickets con foto",
    "Importación de resúmenes de tarjeta en PDF",
    "Asistente de IA que responde con tu historial real",
    "Espacios compartidos para dividir gastos (Finy Split)",
    "Soporte para más de 40 monedas",
    "Sincronización automática con Mercado Pago",
    "Carga manual sin conexión con sincronización posterior",
    "Reportes y análisis mensual",
  ],
  countriesSupported: "AR, BR, MX, CO, CL, PE, UY, ES, US",
  offers: [
    {
      "@type": "Offer",
      name: "Gratis",
      price: "0",
      priceCurrency: "USD",
      description: "100 transacciones por mes, 10 consultas a la IA, 2 escaneos, 1 espacio personal, con publicidad.",
      category: "free",
    },
    {
      "@type": "Offer",
      name: "Plus (mensual)",
      price: "2.99",
      priceCurrency: "USD",
      description: "500 transacciones por mes, 75 consultas a la IA, 30 escaneos, 3 espacios compartidos, sin publicidad.",
    },
    {
      "@type": "Offer",
      name: "Plus (anual)",
      price: "24.99",
      priceCurrency: "USD",
      description: "Plan Plus facturado por año.",
    },
    {
      "@type": "Offer",
      name: "Pro (mensual)",
      price: "4.99",
      priceCurrency: "USD",
      description:
        "1.000 transacciones por mes, 200 consultas a la IA, 100 escaneos, 10 espacios compartidos, reportes avanzados, sin publicidad.",
    },
    {
      "@type": "Offer",
      name: "Pro (anual)",
      price: "39.99",
      priceCurrency: "USD",
      description: "Plan Pro facturado por año.",
    },
  ],
  // 14 días de PRO gratis al instalar, sin tarjeta.
  isAccessibleForFree: true,
  privacyPolicy: `${SITE}/politica-privacidad`,
  termsOfService: `${SITE}/condiciones-servicios`,
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  /*
   * El análisis mensual va primero a propósito. Es lo único que Finy hace y un
   * chat de propósito general no puede hacer, así que es la respuesta que
   * conviene que quede citada cuando alguien —una persona o un asistente—
   * pregunta en qué se diferencia.
   */
  {
    q: "¿Qué es el análisis mensual de Finy?",
    a: "El 1° de cada mes, Finy analiza el mes que cerraste y te dice qué pasó con tu dinero, por qué pasó y una sola cosa concreta para hacer el mes siguiente. Al mes siguiente el análisis abre diciéndote si la cumpliste, medido con tus propios movimientos. El primero es gratis y viene completo.",
  },
  {
    q: "¿En qué se diferencia de pegarle mis gastos a ChatGPT?",
    a: "En que no hay que volver a hacerlo. Pegar un export en un chat da un buen análisis una vez; al mes siguiente hay que exportar de nuevo, pegar de nuevo y explicar el contexto de nuevo, y el chat no recuerda lo que te recomendó. Finy ya tiene los datos sincronizados y encadena un mes con el siguiente: te propone una acción y después te dice si la cumpliste.",
  },
  {
    q: "¿Cómo funciona lo de cargar gastos por audio?",
    a: 'Tocas el botón del micrófono, dices en lenguaje natural lo que gastaste ("pagué 5 en café con débito") y la IA detecta el monto, la categoría y el método de pago. Si algo no se entendió bien, lo editas antes de confirmar.',
  },
  {
    q: "¿Puedo conectar mi cuenta bancaria o tarjeta?",
    a: "Sí, puedes conectar Mercado Pago para que tus pagos se importen automáticamente. Las integraciones con bancos directos están en desarrollo. Por ahora también puedes subir resúmenes en PDF y la IA extrae todos los movimientos sola.",
  },
  {
    q: "¿Mis datos están seguros?",
    a: "Toda la información viaja encriptada de punta a punta. No vendemos datos a terceros. Si algún día quieres borrar todo, lo haces desde la app con un toque.",
  },
  {
    q: "¿Qué pasa cuando se terminan los 14 días de PRO?",
    a: "Pasas automáticamente al plan Gratis. No te cobramos nada sin que lo confirmes. Si quieres mantener PRO, te suscribes cuando quieras desde la app.",
  },
  {
    q: "¿Funciona en mi país?",
    a: "Sí. Soporta más de 40 monedas (USD, EUR, MXN, BRL, ARS, COP, CLP, UYU, PEN, etc.) y la integración con Mercado Pago funciona en Argentina, Brasil, México, Colombia, Chile, Perú y Uruguay.",
  },
  {
    q: "¿Puedo compartir gastos con mi pareja o socios?",
    a: "Sí, con los Espacios Compartidos. Creas un espacio (Casa, Viaje, Negocio), invitas por link y cada persona suma sus gastos. Finy hace las cuentas y te dice quién le debe a quién.",
  },
  {
    q: "¿Funciona offline?",
    a: "Puedes cargar gastos manualmente sin conexión y se sincronizan cuando vuelves a tener internet. Las funciones de IA (audio, foto, chat) necesitan internet porque se procesan en la nube.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin compromiso. Cancelas directo desde la app o desde tu cuenta de App Store / Google Play. Sin costos por cancelar.",
  },
]

const faq = {
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

/**
 * Entidades de todo el sitio: van en el layout, valen en cualquier URL.
 * El FAQPage NO va acá: pertenece sólo a la home (ver HomeFaqSchema), si no
 * cada página de comparativa o guía declararía además el FAQ de la portada.
 */
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organization, website, application],
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
    />
  )
}

/** FAQ de la home. Se monta sólo en app/page.tsx. */
export function HomeFaqSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...faq }) }}
    />
  )
}
