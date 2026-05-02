'use client'

import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CondicionesServiciosClient() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: 'Términos y Condiciones del Servicio Finy',
      lastUpdated: 'Última actualización: 2 de Marzo de 2026',
      sections: [
        {
          number: 1,
          title: 'Aceptación de los Términos',
          content: `Al registrarse, acceder al sitio web dashboard.finyapp.io, descargar la aplicación móvil de Finy desde la Apple App Store o Google Play Store, o interactuar con el bot de WhatsApp de Finy (el "Servicio"), usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no acepta estos términos en su totalidad, no podrá utilizar el Servicio.`,
        },
        {
          number: 2,
          title: 'Descripción del Servicio',
          content: `Finy es una herramienta tecnológica de registro, organización y visualización de finanzas personales, accesible vía App Móvil (iOS y Android), Web y WhatsApp. Finy utiliza Inteligencia Artificial para procesar comandos de voz, texto e imágenes y categorizar gastos. El servicio incluye:
• Una App Móvil disponible en la Apple App Store y Google Play Store, como canal principal de acceso.
• Un Dashboard Web en dashboard.finyapp.io para la visualización de métricas, gráficos históricos y gestión de categorías.
• Un Bot de WhatsApp como canal complementario para el ingreso de datos mediante texto, audio e imágenes.
• Herramientas de automatización para procesamiento de correos electrónicos transaccionales (opcional).

Naturaleza Informativa: Finy es una herramienta de registro y visualización. Finy NO es un asesor financiero, planificador de inversiones, contador ni abogado. Los reportes, proyecciones de cuotas y alertas son estimaciones basadas en los datos provistos por usted.`,
        },
        {
          number: 3,
          title: 'Registro y Seguridad',
          content: `Para utilizar el Servicio, puede registrarse a través de la App Móvil, el sitio web o vinculando una cuenta de WhatsApp válida.
• Responsabilidad: Usted es el único responsable de mantener la seguridad de sus credenciales de acceso y de su dispositivo móvil.
• Acceso no autorizado: Finy no será responsable por pérdidas o daños causados por el acceso no autorizado a su cuenta por parte de terceros.`,
        },
        {
          number: 4,
          title: 'Uso de Inteligencia Artificial y Descargo de Responsabilidad',
          content: `Finy utiliza modelos de Inteligencia Artificial (IA) de terceros para interpretar lenguaje natural, transcribir audios y extraer datos de imágenes (OCR).

Descargo de Responsabilidad Financiera: Finy no es un asesor financiero legal ni un banco. La información, gráficos, presupuestos y respuestas generadas por el asistente de Inteligencia Artificial tienen un propósito netamente organizativo e informativo. Finy no se hace responsable por las decisiones financieras, de inversión o de ahorro que el usuario tome basándose en la información proporcionada por la plataforma.

Reconocimiento de Falibilidad: Al usar el servicio, usted reconoce y acepta que:
1. La IA es una tecnología experimental y puede cometer errores de interpretación (ej: leer un monto incorrecto en un ticket borroso o categorizar mal un gasto).
2. Es su responsabilidad exclusiva verificar y validar periódicamente en el Dashboard Web o la App que la información registrada coincida con sus transacciones reales.
3. Finy no asume responsabilidad por errores contables, discrepancias financieras o decisiones económicas tomadas en base a datos interpretados incorrectamente por la IA.`,
        },
        {
          number: 5,
          title: 'Propiedad de los Datos y Licencias',
          content: `Sus Datos: Usted conserva la plena propiedad y los derechos intelectuales sobre sus datos financieros.

Licencia a Finy: Para que podamos prestarle el servicio (mostrarle gráficos, calcular totales, guardar historial), usted otorga a Finy una licencia mundial, libre de regalías y transferible para alojar, transferir, visualizar, procesar y crear copias de seguridad de sus datos en nuestra infraestructura de servidores y bases de datos.`,
        },
        {
          number: 6,
          title: 'Pagos, Suscripciones y Reembolsos',
          content: `Finy ofrece planes de suscripción (ej. Finy Plus, Finy Pro). Las condiciones varían según el canal de compra:

Suscripciones vía Apple App Store o Google Play Store:
• Si la suscripción se realiza a través de la Apple App Store o Google Play Store, el pago y la renovación automática estarán sujetos a los términos y condiciones de dichas plataformas.
• El usuario puede cancelar su suscripción en cualquier momento desde los ajustes de su dispositivo (Apple ID > Suscripciones, o cuenta de Google > Play Store > Suscripciones).
• Finy no gestiona directamente los reembolsos de compras realizadas en las tiendas de apps. Para solicitar un reembolso, el usuario debe comunicarse con el soporte de Apple o Google según corresponda.

Suscripciones vía Web (Gumroad):
• Los pagos son procesados de forma segura por Gumroad. Finy no almacena sus datos de tarjeta de crédito.
• Las suscripciones se renuevan automáticamente al final de cada periodo de facturación.
• Los pagos son finales y no reembolsables. Si cancela antes de finalizar el ciclo, mantendrá el acceso hasta el último día del periodo pagado.

Cambios de Precio: Nos reservamos el derecho de modificar las tarifas de suscripción. Cualquier cambio será notificado con al menos 30 días de antelación.`,
        },
        {
          number: 7,
          title: 'Dependencia de Plataformas de Terceros',
          content: `El Servicio depende de la disponibilidad continua de plataformas externas, incluyendo la Apple App Store, Google Play Store, WhatsApp (Meta Platforms, Inc.) y proveedores de correo electrónico (Google).

Finy no garantiza que el servicio sea ininterrumpido. Finy no será responsable si alguna de estas plataformas sufre interrupciones, cambia sus políticas o suspende el acceso al Servicio.`,
        },
        {
          number: 8,
          title: 'Automatización de Email (Gmail)',
          content: `Si habilita la lectura de correos:
• Autoriza a Finy a acceder a su bandeja de entrada con el fin exclusivo de rastrear comprobantes de pago.
• Reconoce que este proceso es automatizado y Finy podría omitir correos con formatos no reconocidos.`,
        },
        {
          number: 9,
          title: 'Limitación de Responsabilidad',
          content: `En la medida máxima permitida por la ley aplicable, Finy, sus desarrolladores y afiliados no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por pérdida de beneficios, datos, uso o buena voluntad, que surjan de (i) su acceso o uso del servicio; (ii) cualquier conducta de terceros en el servicio; o (iii) acceso no autorizado, uso o alteración de sus transmisiones o contenido.`,
        },
        {
          number: 10,
          title: 'Modificaciones al Servicio y Términos',
          content: `Finy se reserva el derecho de modificar o discontinuar, temporal o permanentemente, el Servicio (o cualquier parte del mismo) con o sin previo aviso. Asimismo, podemos actualizar estos Términos periódicamente. El uso continuado del servicio tras una modificación constituye la aceptación de los nuevos términos.`,
        },
        {
          number: 11,
          title: 'Ley Aplicable',
          content: `Estos Términos se regirán e interpretarán de acuerdo con las leyes vigentes en la República Argentina (o su país de residencia fiscal), sin tener en cuenta sus disposiciones sobre conflictos de leyes.`,
        },
        {
          number: 12,
          title: 'Contacto',
          content: `Para cualquier duda legal o relacionada con estos términos, contáctenos en:

soporte@finyapp.io`,
        },
      ],
    },
    en: {
      title: 'Finy Terms and Conditions of Service',
      lastUpdated: 'Last updated: March 2, 2026',
      sections: [
        {
          number: 1,
          title: 'Acceptance of Terms',
          content: `By registering, accessing the website dashboard.finyapp.io, downloading the Finy mobile app from the Apple App Store or Google Play Store, or interacting with the Finy WhatsApp bot (the "Service"), you agree to be legally bound by these Terms and Conditions. If you do not accept these terms in full, you will not be able to use the Service.`,
        },
        {
          number: 2,
          title: 'Service Description',
          content: `Finy is a technological tool for recording, organizing and visualizing personal finances, accessible via Mobile App (iOS and Android), Web and WhatsApp. Finy uses Artificial Intelligence to process voice commands, text and images and categorize expenses. The service includes:
• A Mobile App available on the Apple App Store and Google Play Store, as the primary access channel.
• A Web Dashboard at dashboard.finyapp.io for viewing metrics, historical charts, and category management.
• A WhatsApp Bot as a complementary channel for data entry through text, audio, and images.
• Automation tools for processing transactional emails (optional).

Informational Nature: Finy is a recording and visualization tool. Finy is NOT a financial advisor, investment planner, accountant or lawyer. Reports, installment projections, and alerts are estimates based on data provided by you.`,
        },
        {
          number: 3,
          title: 'Registration and Security',
          content: `To use the Service, you may register through the Mobile App, the website, or by linking a valid WhatsApp account.
• Responsibility: You are solely responsible for maintaining the security of your access credentials and your mobile device.
• Unauthorized Access: Finy will not be responsible for any losses or damages caused by unauthorized access to your account by third parties.`,
        },
        {
          number: 4,
          title: 'Artificial Intelligence Use and Disclaimer',
          content: `Finy uses third-party Artificial Intelligence (AI) models to interpret natural language, transcribe audio, and extract data from images (OCR).

Financial Disclaimer: Finy is not a licensed financial advisor or a bank. The information, charts, budgets and responses generated by the Artificial Intelligence assistant are for organizational and informational purposes only. Finy is not responsible for any financial, investment or savings decisions made by the user based on the information provided by the platform.

Recognition of Fallibility: By using the service, you acknowledge and accept that:
1. AI is an experimental technology and may make interpretation errors (ex: reading an incorrect amount on a blurry receipt or miscategorizing an expense).
2. It is your exclusive responsibility to verify and validate periodically in the Web Dashboard or the App that recorded information matches your actual transactions.
3. Finy assumes no responsibility for accounting errors, financial discrepancies, or economic decisions made based on data incorrectly interpreted by AI.`,
        },
        {
          number: 5,
          title: 'Data Ownership and Licenses',
          content: `Your Data: You retain full ownership and intellectual rights over your financial data.

License to Finy: To enable us to provide you with the service (show you charts, calculate totals, save history), you grant Finy a worldwide, royalty-free and transferable license to host, transfer, display, process and create backups of your data in our server infrastructure and databases.`,
        },
        {
          number: 6,
          title: 'Payments, Subscriptions and Refunds',
          content: `Finy offers subscription plans (e.g. Finy Plus, Finy Pro). Terms vary depending on the purchase channel:

Subscriptions via Apple App Store or Google Play Store:
• If the subscription is made through the Apple App Store or Google Play Store, payment and automatic renewal will be subject to the terms and conditions of those platforms.
• Users may cancel their subscription at any time from their device settings (Apple ID > Subscriptions, or Google Account > Play Store > Subscriptions).
• Finy does not directly manage refunds for purchases made in the app stores. To request a refund, the user must contact Apple or Google support as applicable.

Subscriptions via Web (Gumroad):
• Payments are processed securely by Gumroad. Finy does not store your credit card data.
• Subscriptions automatically renew at the end of each billing period.
• Payments are final and non-refundable. If you cancel before the cycle ends, you will retain access until the last day of the paid period.

Price Changes: We reserve the right to modify subscription fees. Any changes will be notified with at least 30 days notice.`,
        },
        {
          number: 7,
          title: 'Dependence on Third-Party Platforms',
          content: `The Service depends on the continuous availability of external platforms, including the Apple App Store, Google Play Store, WhatsApp (Meta Platforms, Inc.) and email providers (Google).

Finy does not guarantee uninterrupted service. Finy will not be responsible if any of these platforms experiences outages, changes its policies, or suspends access to the Service.`,
        },
        {
          number: 8,
          title: 'Email Automation (Gmail)',
          content: `If you enable email reading:
• You authorize Finy to access your inbox exclusively for the purpose of tracking payment receipts.
• You acknowledge that this process is automated and Finy may miss emails with unrecognized formats.`,
        },
        {
          number: 9,
          title: 'Limitation of Liability',
          content: `To the maximum extent permitted by applicable law, Finy, its developers and affiliates will not be liable for indirect, incidental, special, consequential or punitive damages, nor for loss of profits, data, use or goodwill, arising from (i) your access or use of the service; (ii) any conduct of third parties on the service; or (iii) unauthorized access, use or alteration of your transmissions or content.`,
        },
        {
          number: 10,
          title: 'Modifications to Service and Terms',
          content: `Finy reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We may also update these Terms periodically. Continued use of the service following a modification constitutes acceptance of the new terms.`,
        },
        {
          number: 11,
          title: 'Applicable Law',
          content: `These Terms shall be governed and construed in accordance with the laws in force in the Argentine Republic (or your country of tax residence), without regard to its conflict of law provisions.`,
        },
        {
          number: 12,
          title: 'Contact',
          content: `For any legal questions or questions related to these terms, please contact us at:

soporte@finyapp.io`,
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
