'use client'

import { useLanguage } from '@/contexts/language-context'

export function LegalCenter() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: 'Política de Privacidad de Finy',
      lastUpdated: 'Última actualización: 26 de Enero de 2026',
      sections: [
        {
          number: 1,
          title: 'Introducción',
          content: `Bienvenido a Finy ("nosotros", "nuestro"). Finy es una plataforma de gestión financiera inteligente que opera a través de una Aplicación Móvil (iOS y Android) y una Aplicación Web (Dashboard).

Su privacidad es crítica para nosotros. Esta Política de Privacidad describe cómo recopilamos, usamos, procesamos y compartimos su información personal cuando utiliza nuestros servicios.

Al utilizar Finy, usted acepta las prácticas descritas en esta política. Si no está de acuerdo, por favor no utilice nuestros servicios.`,
        },
        {
          number: 2,
          title: 'Información que Recopilamos',
          content: `Para brindarle un asistente financiero preciso y un dashboard funcional, recopilamos los siguientes tipos de información:

**A. Información proporcionada por usted:**
• **Datos de Cuenta:** Su nombre, correo electrónico (incluyendo autenticación de Google y Apple) y, en caso de suscripciones, datos de facturación (procesados por Apple App Store, Google Play Store y RevenueCat).
• **Datos Financieros:** Información sobre sus gastos, ingresos, presupuestos, categorías, fechas y descripciones que usted envía voluntariamente al chat o carga en el Dashboard Web.
• **Contenido Multimedia:** Notas de voz (audios) e imágenes (fotos de tickets/facturas) que envía al bot para su procesamiento automático.

**B. Información obtenida automáticamente:**
• **Datos de Uso:** Registros de interacción con el bot, frecuencia de uso y configuración de preferencias.
• **Datos Técnicos:** Dirección IP, tipo de navegador y dispositivo utilizado para acceder al Dashboard Web (dashboard.finyapp.io).

**C. Información de Terceros (Integraciones):**
• **Lectura de Correos (Gmail):** *Solo si usted activa explícitamente esta función*, accedemos a su bandeja de entrada mediante la API de Google bajo permisos restringidos.
    - **Alcance:** Únicamente buscamos correos de remitentes transaccionales identificados (bancos, billeteras digitales, apps de delivery).
    - **Exclusión:** No leemos, almacenamos ni procesamos sus correos personales, laborales o íntimos.`,
        },
        {
          number: 3,
          title: 'Almacenamiento y Seguridad de los Datos',
          content: `**¿Dónde viven sus datos?**
A diferencia de versiones anteriores que dependían exclusivamente de hojas de cálculo personales, **Finy almacena una copia encriptada de sus transacciones financieras en nuestra infraestructura segura en la nube (Base de Datos).**

**¿Por qué almacenamos sus datos?**
El almacenamiento en nuestros servidores es estrictamente necesario para:
1. Permitir el funcionamiento del **Dashboard Web** y la carga instantánea de gráficos.
2. Generar reportes históricos (comparativas mes a mes, Top Gastos) sin depender de la latencia de servicios externos.
3. Procesar lenguaje natural y mantener el "contexto" de su historial financiero.

**Medidas de Seguridad:**
Utilizamos encriptación SSL/TLS en tránsito y encriptación de base de datos en reposo. Restringimos el acceso a los datos personales a los empleados de Finy que necesiten conocerlos para operar, desarrollar o mejorar nuestros servicios.`,
        },
        {
          number: 4,
          title: 'Uso de Inteligencia Artificial y Procesadores Externos',
          content: `Para ofrecer la "magia" de Finy (entender audios y fotos), compartimos fragmentos de datos estrictamente necesarios con proveedores de Inteligencia Artificial de clase mundial.

• **Proveedores de IA:** Utilizamos servicios como **Google Gemini** y **Anthropic (Claude)** para el procesamiento de lenguaje natural y visión por computadora.
• **Naturaleza del Uso:** Enviamos el texto transcrito o la imagen del ticket a estos proveedores únicamente para extraer la información estructurada (Monto, Comercio, Categoría).
• **Privacidad de la IA:** Según los acuerdos empresariales vigentes, estos proveedores **NO utilizan sus datos financieros personales para entrenar sus modelos públicos**.`,
        },
        {
          number: 5,
          title: 'Finalidad del Tratamiento de Datos',
          content: `Utilizamos su información para:
• Prestar y mantener el Servicio (Bot y Dashboard).
• Personalizar su experiencia y mejorar nuestros modelos de categorización.
• Enviarle notificaciones técnicas, alertas de presupuesto y reportes semanales.
• Detectar y prevenir fraudes o abusos.

**Compromiso de No Venta:**
Finy **no vende, alquila ni comercializa** su información personal o financiera a anunciantes ni terceros data brokers. Su información financiera es suya.`,
        },
        {
          number: 6,
          title: 'Política de Datos de Usuario de los Servicios de Google API',
          content: `El uso y la transferencia a cualquier otra aplicación de la información recibida de las API de Google se adherirán a la Política de Datos de Usuario de los Servicios de API de Google, incluidos los requisitos de "Uso Limitado".`,
        },
        {
          number: 7,
          title: 'Retención y Eliminación de Datos',
          content: `Conservaremos su información mientras mantenga su cuenta activa.

• **Derecho de Supresión (Eliminar Cuenta):** Usted puede solicitar la eliminación completa de su cuenta en cualquier momento enviando un correo a soporte@finyapp.io o mediante los comandos del bot.
• **Consecuencia:** Al solicitar la baja, eliminaremos sus credenciales y anonimizaremos o eliminaremos permanentemente su historial transaccional de nuestra base de datos en un plazo máximo de 30 días, salvo obligación legal de conservarlos.`,
        },
        {
          number: 8,
          title: 'Sus Derechos',
          content: `Dependiendo de su ubicación, usted tiene derecho a:
• **Acceder** a los datos personales que tenemos sobre usted.
• **Rectificar** datos inexactos (puede hacerlo directamente desde el Dashboard).
• **Solicitar la portabilidad** de sus datos (exportación a CSV/Excel).
• **Revocar su consentimiento** para el procesamiento de datos en cualquier momento (lo que implicará la terminación del servicio).`,
        },
        {
          number: 9,
          title: 'Cambios en esta Política',
          content: `Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio significativo dentro de la app o por correo electrónico. El uso continuado de Finy después de dichos cambios constituye su aceptación de la nueva política.`,
        },
        {
          number: 10,
          title: 'Contacto',
          content: `Si tiene preguntas sobre esta política o sus datos, contáctenos en:

**Correo:** soporte@finyapp.io
**Web:** www.finyapp.io`,
        },
      ],
    },
    en: {
      title: 'Finy Privacy Policy',
      lastUpdated: 'Last updated: January 26, 2026',
      sections: [
        {
          number: 1,
          title: 'Introduction',
          content: `Welcome to Finy ("we", "our"). Finy is an intelligent financial management platform that operates through a Mobile App (iOS and Android) and a Web Application (Dashboard).

Your privacy is critical to us. This Privacy Policy describes how we collect, use, process, and share your personal information when you use our services.

By using Finy, you accept the practices described in this policy. If you do not agree, please do not use our services.`,
        },
        {
          number: 2,
          title: 'Information We Collect',
          content: `To provide you with an accurate financial assistant and functional dashboard, we collect the following types of information:

**A. Information provided by you:**
• **Account Data:** Your name, email address (including Google and Apple authentication) and, in case of subscriptions, billing data (processed by Apple App Store, Google Play Store and RevenueCat).
• **Financial Data:** Information about your expenses, income, budgets, categories, dates, and descriptions that you voluntarily send to the chat or upload to the Web Dashboard.
• **Multimedia Content:** Voice notes (audio) and images (photos of receipts/invoices) that you send to the bot for automatic processing.

**B. Information obtained automatically:**
• **Usage Data:** Records of interaction with the bot, frequency of use, and preference settings.
• **Technical Data:** IP address, browser type, and device used to access the Web Dashboard (dashboard.finyapp.io).

**C. Third-Party Information (Integrations):**
• **Email Reading (Gmail):** *Only if you explicitly activate this function*, we access your inbox through the Google API under restricted permissions.
    - **Scope:** We only search for emails from identified transactional senders (banks, digital wallets, delivery apps).
    - **Exclusion:** We do not read, store, or process your personal, work, or intimate emails.`,
        },
        {
          number: 3,
          title: 'Data Storage and Security',
          content: `**Where does your data live?**
Unlike previous versions that relied exclusively on personal spreadsheets, **Finy stores an encrypted copy of your financial transactions on our secure cloud infrastructure (Database).**

**Why do we store your data?**
Storage on our servers is strictly necessary for:
1. Enabling the **Web Dashboard** to function and load charts instantly.
2. Generating historical reports (month-to-month comparisons, Top Expenses) without depending on external service latency.
3. Processing natural language and maintaining the "context" of your financial history.

**Security Measures:**
We use SSL/TLS encryption in transit and database encryption at rest. We restrict access to personal data to Finy employees who need to know it to operate, develop, or improve our services.`,
        },
        {
          number: 4,
          title: 'Use of Artificial Intelligence and External Processors',
          content: `To deliver the "magic" of Finy (understanding audio and photos), we share strictly necessary data fragments with world-class Artificial Intelligence providers.

• **AI Providers:** We use services like **Google Gemini** and **Anthropic (Claude)** for natural language processing and computer vision.
• **Nature of Use:** We send transcribed text or receipt images to these providers only to extract structured information (Amount, Business, Category).
• **AI Privacy:** According to current business agreements, these providers **do NOT use your personal financial data to train their public models**.`,
        },
        {
          number: 5,
          title: 'Purpose of Data Processing',
          content: `We use your information for:
• Providing and maintaining the Service (Bot and Dashboard).
• Personalizing your experience and improving our categorization models.
• Sending you technical notifications, budget alerts, and weekly reports.
• Detecting and preventing fraud or abuse.

**No-Sell Commitment:**
Finy **does not sell, rent, or commercialize** your personal or financial information to advertisers or third-party data brokers. Your financial information is yours.`,
        },
        {
          number: 6,
          title: 'Google API Services User Data Policy',
          content: `Use and transfer to any other application of information received from Google APIs will adhere to the Google API Services User Data Policy, including "Limited Use" requirements.`,
        },
        {
          number: 7,
          title: 'Data Retention and Deletion',
          content: `We will retain your information as long as you maintain your active account.

• **Right to Deletion (Delete Account):** You can request complete deletion of your account at any time by sending an email to soporte@finyapp.io or through bot commands.
• **Consequence:** Upon requesting deletion, we will remove your credentials and anonymize or permanently delete your transaction history from our database within a maximum of 30 days, except where legally required to retain them.`,
        },
        {
          number: 8,
          title: 'Your Rights',
          content: `Depending on your location, you have the right to:
• **Access** the personal data we have about you.
• **Rectify** inaccurate data (you can do this directly from the Dashboard).
• **Request portability** of your data (export to CSV/Excel).
• **Revoke your consent** for data processing at any time (which will result in service termination).`,
        },
        {
          number: 9,
          title: 'Changes to This Policy',
          content: `We may update this Privacy Policy occasionally. We will notify you of any significant changes inside the app or by email. Continued use of Finy after such changes constitutes your acceptance of the new policy.`,
        },
        {
          number: 10,
          title: 'Contact',
          content: `If you have questions about this policy or your data, contact us at:

**Email:** soporte@finyapp.io
**Web:** www.finyapp.io`,
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-40 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{currentContent.title}</h1>
          <p className="text-sm text-gray-500 mt-3">{currentContent.lastUpdated}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-12 md:space-y-14">
          {currentContent.sections.map((section) => (
            <section key={section.number} id={`section-${section.number}`} className="scroll-mt-32">
              {/* Section Header */}
              <div className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm md:text-base font-semibold text-gray-600">{section.number}</span>
                  </div>
                </div>

                {/* Section Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-gray-700 leading-relaxed space-y-4 text-sm md:text-base">
                    {section.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 md:mt-20 pt-8 md:pt-12 border-t border-gray-200">
          <p className="text-xs md:text-sm text-gray-500 text-center">
            © 2026 Finy. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </footer>
      </main>
    </div>
  )
}
