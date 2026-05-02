'use client'

import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PoliticaPrivacidadClient() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: 'Política de Privacidad de Finy',
      lastUpdated: 'Última actualización: 2 de Mayo de 2026',
      sections: [
        {
          number: 1,
          title: 'Introducción',
          content: `Bienvenido a Finy ("nosotros", "nuestro").

La presente Política de Privacidad describe cómo Finy recopila, utiliza y protege la información de los usuarios a través de su ecosistema multiplataforma, el cual incluye nuestra Aplicación Móvil (disponible en iOS y Android), nuestra Plataforma Web (dashboard) y nuestro Asistente virtual en WhatsApp.

Al utilizar el Ecosistema Finy, usted acepta las prácticas descritas en esta política. Si no está de acuerdo, por favor no utilice nuestros servicios.`,
        },
        {
          number: 2,
          title: 'Información que Recopilamos',
          content: `Para brindarle una plataforma financiera precisa y funcional, recopilamos los siguientes tipos de información:

A. Datos de Registro:
• Nombre y correo electrónico (incluyendo autenticación a través de terceros como Google).
• Número de teléfono vinculado para el Asistente virtual de WhatsApp.
• En caso de suscripciones, datos de facturación procesados por los procesadores de pago autorizados (Gumroad, Apple App Store, Google Play Store y RevenueCat).

B. Datos Financieros:
• Registros de ingresos, gastos, presupuestos, categorías personalizadas, métodos de pago y la moneda de preferencia del usuario (primary_currency).
• Información de transacciones que usted envía voluntariamente a la Plataforma mediante texto, audio o imágenes.

C. Archivos Multimedia:
• Imágenes de tickets o comprobantes que el usuario decida subir explícitamente para su análisis mediante Inteligencia Artificial.
• Notas de voz (audios) enviados al Asistente virtual para su transcripción y procesamiento.

Permisos de Dispositivo: Finy solicitará permisos explícitos, opcionales y revocables para acceder a los siguientes componentes de tu dispositivo móvil:
- Cámara: Para capturar imágenes de tickets y comprobantes.
- Galería de fotos: Para seleccionar imágenes guardadas en tu dispositivo.
- Micrófono: Para grabar notas de voz y audios con gastos.
Todos estos permisos son completamente opcionales y puedes revocarlos en cualquier momento desde los Ajustes de tu dispositivo.

D. Información obtenida automáticamente:
• Datos de Uso: Registros de interacción con la Plataforma, frecuencia de uso y configuración de preferencias.
• Datos Técnicos: Dirección IP, tipo de navegador y dispositivo utilizado para acceder a la Plataforma Web (dashboard.finyapp.io) o la Aplicación Móvil.

E. Información de Terceros (Integraciones):
• Lectura de Correos (Gmail): Solo si usted activa explícitamente esta función, accedemos a su bandeja de entrada mediante la API de Google bajo permisos restringidos, únicamente para rastrear comprobantes de pago transaccionales.`,
        },
        {
          number: 3,
          title: 'Almacenamiento, Seguridad y Proveedores de Terceros',
          content: `Para brindar nuestro servicio, Finy utiliza infraestructuras de terceros de primer nivel. Los datos financieros y de usuario se almacenan de forma segura en Supabase (nuestro proveedor de base de datos en la nube). Para el procesamiento de lenguaje natural y lectura de comprobantes (imágenes), utilizamos las APIs de Inteligencia Artificial de OpenAI, Anthropic y Google (Gemini). Finy no vende tus datos personales y los proveedores de IA utilizados no utilizan tus datos privados para entrenar sus modelos públicos.

El almacenamiento en nuestra infraestructura es estrictamente necesario para:
1. Permitir el funcionamiento del Dashboard Web y la Aplicación Móvil con carga instantánea de gráficos.
2. Generar reportes históricos (comparativas mes a mes, Top Gastos) sin depender de la latencia de servicios externos.
3. Procesar lenguaje natural y mantener el contexto de su historial financiero.

Medidas de Seguridad:
Utilizamos encriptación SSL/TLS en tránsito y encriptación de base de datos en reposo. Restringimos el acceso a los datos personales a los empleados de Finy que necesitan conocerlos para operar, desarrollar o mejorar nuestros servicios.`,
        },
        {
          number: 4,
          title: 'Uso de Inteligencia Artificial y Procesadores Externos',
          content: `Para ofrecer las funcionalidades de Finy (entender audios y fotos), compartimos fragmentos de datos estrictamente necesarios con proveedores de Inteligencia Artificial de clase mundial.

• Proveedores de IA: Utilizamos servicios de OpenAI, Anthropic (Claude) y Google (Gemini) para el procesamiento de lenguaje natural y visión por computadora.
• Naturaleza del Uso: Enviamos el texto transcrito o la imagen del ticket a estos proveedores únicamente para extraer la información estructurada (Monto, Comercio, Categoría).
• Privacidad de la IA: Según los acuerdos empresariales vigentes, estos proveedores NO utilizan sus datos financieros personales para entrenar sus modelos públicos.`,
        },
        {
          number: 5,
          title: 'Finalidad del Tratamiento de Datos',
          content: `Utilizamos su información para:
• Prestar y mantener el Ecosistema Finy (Aplicación Móvil, Plataforma Web y Asistente virtual).
• Personalizar su experiencia y mejorar nuestros modelos de categorización.
• Enviarle notificaciones técnicas, alertas de presupuesto y reportes.
• Detectar y prevenir fraudes o abusos.

Compromiso de No Venta:
Finy no vende, alquila ni comercializa su información personal o financiera a anunciantes ni terceros data brokers. Su información financiera es suya.`,
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

Derecho al olvido y Eliminación de Cuenta: En cualquier momento, el usuario puede solicitar la eliminación total y definitiva de su cuenta y todos los datos financieros asociados. Esto se puede realizar directamente desde la Aplicación Móvil o la Plataforma Web en la sección "Ajustes de Cuenta" > "Eliminar Cuenta". También puedes solicitar la eliminación de tu cuenta y todos tus datos asociados enviando un email a soporte@finyapp.io. Al hacerlo, se borrarán permanentemente sus registros de nuestra base de datos.

Plazo de ejecución: Eliminaremos sus credenciales y datos en un plazo máximo de 30 días, salvo obligación legal de conservarlos.`,
        },
        {
          number: 8,
          title: 'Sus Derechos',
          content: `Dependiendo de su ubicación, usted tiene derecho a:
• Acceder a los datos personales que tenemos sobre usted.
• Rectificar datos inexactos (puede hacerlo directamente desde el Dashboard).
• Solicitar la portabilidad de sus datos (exportación a CSV/Excel).
• Revocar su consentimiento para el procesamiento de datos en cualquier momento (lo que implicará la terminación del servicio).`,
        },
        {
          number: 9,
          title: 'Publicidad y Redes de Terceros',
          content: `La versión gratuita de Finy utiliza redes publicitarias como Google AdMob para mostrar anuncios contextuales y relevantes.

Recopilación de datos por Google AdMob:
• Advertising ID: Identificador único de tu dispositivo que permite mostrar anuncios personalizados.
• Datos de uso anónimos: Información sobre tu interacción con los anuncios mostrados.
• Ubicación aproximada: Con tu consentimiento, para mostrar anuncios geográficamente relevantes.

Tu privacidad: Estos datos se recopilan de forma anónima y no se vinculan con tu información personal o financiera. Puedes deshabilitar anuncios personalizados en la configuración de tu dispositivo en cualquier momento.`,
        },
        {
          number: 10,
          title: 'Privacidad Infantil (Menores de edad)',
          content: `Importante: Finy es una herramienta financiera dirigida exclusivamente a personas mayores de 13 años (o la edad mínima requerida en su país de residencia).

Protección de menores:
• No recopilamos intencionalmente datos de menores de 13 años.
• Si descubrimos que un usuario es menor de la edad permitida, eliminaremos su cuenta e inmediatamente.
• Los padres, madres o tutores pueden solicitar la eliminación de datos de un menor contactando directamente a soporte@finyapp.io.
• No utilizamos técnicas de seguimiento especiales ni perfilado para menores.

Si eres padre, madre o tutor y tienes preocupaciones sobre la privacidad de un menor en Finy, contáctanos inmediatamente.`,
        },
        {
          number: 11,
          title: 'Cambios en esta Política',
          content: `Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio significativo a través de WhatsApp o por correo electrónico. El uso continuado de Finy después de dichos cambios constituye su aceptación de la nueva política.`,
        },
        {
          number: 12,
          title: 'Contacto',
          content: `Si tiene preguntas sobre esta política o sus datos, contáctenos en:

Correo: soporte@finyapp.io
Web: www.finyapp.io`,
        },
      ],
    },
    en: {
      title: 'Finy Privacy Policy',
      lastUpdated: 'Last updated: May 2, 2026',
      sections: [
        {
          number: 1,
          title: 'Introduction',
          content: `Welcome to Finy ("we", "our").

This Privacy Policy describes how Finy collects, uses and protects user information through its multi-platform ecosystem, which includes our Mobile Application (available on iOS and Android), our Web Platform (dashboard) and our virtual assistant on WhatsApp.

By using the Finy Ecosystem, you accept the practices described in this policy. If you do not agree, please do not use our services.`,
        },
        {
          number: 2,
          title: 'Information We Collect',
          content: `To provide you with an accurate and functional financial platform, we collect the following types of information:

A. Registration Data:
• Name and email address (including authentication through third parties such as Google).
• Phone number linked to the WhatsApp virtual assistant.
• In case of subscriptions, billing data processed by authorized payment processors (Gumroad, Apple App Store, Google Play Store and RevenueCat).

B. Financial Data:
• Records of income, expenses, budgets, custom categories, payment methods, and the user's preferred currency (primary_currency).
• Transaction information you voluntarily submit to the Platform via text, audio, or images.

C. Multimedia Files:
• Images of receipts or vouchers that the user explicitly chooses to upload for analysis using Artificial Intelligence.
• Voice notes (audio) sent to the virtual assistant for transcription and processing.

Device Permissions: Finy will request explicit, optional and revocable permissions to access the following components of your mobile device:
- Camera: To capture images of receipts and vouchers.
- Photo Gallery: To select images saved on your device.
- Microphone: To record voice notes and audio clips with expenses.
All these permissions are completely optional and you can revoke them at any time from your device Settings.

D. Information obtained automatically:
• Usage Data: Records of interaction with the Platform, frequency of use, and preference settings.
• Technical Data: IP address, browser type, and device used to access the Web Platform (dashboard.finyapp.io) or the Mobile Application.

E. Third-Party Information (Integrations):
• Email Reading (Gmail): Only if you explicitly activate this function, we access your inbox through the Google API under restricted permissions, solely to track transactional payment receipts.`,
        },
        {
          number: 3,
          title: 'Data Storage, Security and Third-Party Providers',
          content: `To provide our service, Finy uses best-in-class third-party infrastructure. Financial and user data is securely stored in Supabase (our cloud database provider). For natural language processing and receipt reading (images), we use the Artificial Intelligence APIs of OpenAI, Anthropic and Google (Gemini). Finy does not sell your personal data and the AI providers used do not use your private data to train their public models.

Storage on our infrastructure is strictly necessary for:
1. Enabling the Web Dashboard and Mobile Application to function with instant chart loading.
2. Generating historical reports (month-to-month comparisons, Top Expenses) without depending on external service latency.
3. Processing natural language and maintaining the context of your financial history.

Security Measures:
We use SSL/TLS encryption in transit and database encryption at rest. We restrict access to personal data to Finy employees who need to know it to operate, develop, or improve our services.`,
        },
        {
          number: 4,
          title: 'Use of Artificial Intelligence and External Processors',
          content: `To deliver Finy's features (understanding audio and photos), we share strictly necessary data fragments with world-class Artificial Intelligence providers.

• AI Providers: We use services from OpenAI, Anthropic (Claude) and Google (Gemini) for natural language processing and computer vision.
• Nature of Use: We send transcribed text or receipt images to these providers only to extract structured information (Amount, Business, Category).
• AI Privacy: According to current business agreements, these providers do NOT use your personal financial data to train their public models.`,
        },
        {
          number: 5,
          title: 'Purpose of Data Processing',
          content: `We use your information for:
• Providing and maintaining the Finy Ecosystem (Mobile Application, Web Platform and virtual assistant).
• Personalizing your experience and improving our categorization models.
• Sending you technical notifications, budget alerts, and reports.
• Detecting and preventing fraud or abuse.

No-Sell Commitment:
Finy does not sell, rent, or commercialize your personal or financial information to advertisers or third-party data brokers. Your financial information is yours.`,
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

Right to be Forgotten and Account Deletion: At any time, the user may request the total and definitive deletion of their account and all associated financial data. This can be done directly from the Mobile Application or Web Platform in the "Account Settings" > "Delete Account" section. You can also request the deletion of your account and all your associated data by sending an email to soporte@finyapp.io. Upon doing so, your records will be permanently deleted from our database.

Execution timeframe: We will delete your credentials and data within a maximum of 30 days, except where legally required to retain them.`,
        },
        {
          number: 8,
          title: 'Your Rights',
          content: `Depending on your location, you have the right to:
• Access the personal data we have about you.
• Rectify inaccurate data (you can do this directly from the Dashboard).
• Request portability of your data (export to CSV/Excel).
• Revoke your consent for data processing at any time (which will result in service termination).`,
        },
        {
          number: 9,
          title: 'Advertising and Third-Party Networks',
          content: `The free version of Finy uses advertising networks such as Google AdMob to display contextual and relevant ads.

Data Collection by Google AdMob:
• Advertising ID: A unique identifier on your device that allows us to show personalized ads.
• Anonymous usage data: Information about your interaction with the ads displayed.
• Approximate location: With your consent, to show geographically relevant ads.

Your privacy: This data is collected anonymously and is not linked to your personal or financial information. You can disable personalized ads in your device settings at any time.`,
        },
        {
          number: 10,
          title: 'Children\'s Privacy (Minors)',
          content: `Important: Finy is a financial tool designed exclusively for people 13 years of age or older (or the minimum required age in your country of residence).

Protecting Minors:
• We do not intentionally collect data from children under 13 years of age.
• If we discover that a user is below the permitted age, we will immediately delete their account.
• Parents, guardians, or tutors can request the deletion of a minor's data by directly contacting soporte@finyapp.io.
• We do not use special tracking techniques or profiling for minors.

If you are a parent, guardian, or tutor and have concerns about a minor's privacy on Finy, please contact us immediately.`,
        },
        {
          number: 11,
          title: 'Changes to This Policy',
          content: `We may update this Privacy Policy occasionally. We will notify you of any significant changes through WhatsApp or email. Continued use of Finy after such changes constitutes your acceptance of the new policy.`,
        },
        {
          number: 12,
          title: 'Contact',
          content: `If you have questions about this policy or your data, contact us at:

Email: soporte@finyapp.io
Web: www.finyapp.io`,
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-40 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{currentContent.title}</h1>
            <p className="text-sm text-gray-500 mt-3">{currentContent.lastUpdated}</p>
          </div>
          <Link href="/" className="text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
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
