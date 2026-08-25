'use client'

import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CondicionesServiciosClient() {
  const { language } = useLanguage()

  const content = {
    es: {
      title: 'Términos y Condiciones del Servicio Finy',
      lastUpdated: 'Última actualización: 24 de Agosto de 2026',
      sections: [
        {
          number: 1,
          title: 'Aceptación de los Términos',
          content: `Al registrarse, acceder al sitio web dashboard.finyapp.io o descargar la aplicación móvil de Finy desde la Apple App Store o Google Play Store (el "Servicio"), usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no acepta estos términos en su totalidad, no podrá utilizar el Servicio.`,
        },
        {
          number: 2,
          title: 'Descripción del Servicio',
          content: `Finy es una herramienta tecnológica de registro, organización, análisis y visualización de finanzas personales, accesible vía App Móvil (iOS y Android) y Plataforma Web. Finy utiliza Inteligencia Artificial para procesar comandos de voz, texto e imágenes, categorizar gastos y elaborar análisis periódicos. El servicio incluye:
• Una App Móvil disponible en la Apple App Store y Google Play Store, como canal principal de acceso.
• Un Dashboard Web en dashboard.finyapp.io para la visualización de métricas, gráficos históricos y gestión de categorías.
• Un análisis periódico automatizado de los movimientos que usted registre, con observaciones y sugerencias de organización (ver la sección 5).
• Herramientas de automatización para procesamiento de correos electrónicos transaccionales (opcional).

Naturaleza del Servicio: Finy no es un banco, una entidad financiera, un agente de bolsa, ni un asesor de inversiones registrado ante la Comisión Nacional de Valores de la República Argentina o ante el organismo regulador equivalente de cualquier otra jurisdicción. Finy tampoco presta servicios de contaduría ni de asesoramiento legal o impositivo.

Los reportes, análisis, proyecciones de cuotas, alertas y sugerencias generados por el Servicio son estimaciones elaboradas a partir de los datos que usted registra, y tienen una finalidad exclusivamente organizativa e informativa.`,
        },
        {
          number: 3,
          title: 'Registro y Seguridad',
          content: `Para utilizar el Servicio, puede registrarse a través de la App Móvil o el sitio web mediante email o autenticación con Google o Apple.
• Responsabilidad: Usted es el único responsable de mantener la seguridad de sus credenciales de acceso y de su dispositivo móvil.
• Acceso no autorizado: Finy no será responsable por pérdidas o daños causados por el acceso no autorizado a su cuenta por parte de terceros.`,
        },
        {
          number: 4,
          title: 'Uso de Inteligencia Artificial y Descargo de Responsabilidad',
          content: `Finy utiliza modelos de Inteligencia Artificial (IA) de terceros para interpretar lenguaje natural, transcribir audios y extraer datos de imágenes (OCR).

Descargo de Responsabilidad Financiera: Finy no es una entidad financiera ni un asesor de inversiones registrado. La información, gráficos, presupuestos y respuestas generadas por el asistente de Inteligencia Artificial tienen un propósito netamente organizativo e informativo. Finy no se hace responsable por las decisiones financieras, de inversión o de ahorro que el usuario tome basándose en la información proporcionada por la plataforma.

Reconocimiento de Falibilidad: Al usar el servicio, usted reconoce y acepta que:
1. La IA es una tecnología experimental y puede cometer errores de interpretación (ej: leer un monto incorrecto en un ticket borroso o categorizar mal un gasto).
2. Es su responsabilidad exclusiva verificar y validar periódicamente en el Dashboard Web o la App que la información registrada coincida con sus transacciones reales.
3. Finy no asume responsabilidad por errores contables, discrepancias financieras o decisiones económicas tomadas en base a datos interpretados incorrectamente por la IA.`,
        },
        {
          number: 5,
          title: 'Análisis Mensual y Sugerencias',
          content: `El Servicio puede generar periódicamente un análisis de los movimientos que usted haya registrado, con observaciones sobre sus hábitos de gasto y sugerencias de acción para el período siguiente, así como el seguimiento de aquellas sugerencias que usted decida aceptar.

Alcance de las sugerencias: Las sugerencias que genera el Servicio se refieren exclusivamente a la administración de los gastos e ingresos que usted mismo registró en la aplicación (por ejemplo, reducir la frecuencia de una categoría de gasto). El Servicio no formula, ni pretende formular, recomendaciones de inversión, de compra o venta de instrumentos financieros, de contratación de productos bancarios, crediticios o de seguros, ni asesoramiento impositivo, contable o legal de ningún tipo.

Sobre el uso de la palabra "asesor": Finy emplea los términos "asesor" y "análisis" en su sentido corriente y con finalidad descriptiva de la función del producto. Su uso no constituye ni implica una relación de asesoramiento profesional, fiduciaria o de intermediación financiera entre usted y Finy, ni supone que Finy se encuentre matriculada o registrada para prestar servicios de asesoramiento financiero en ninguna jurisdicción.

Elaboración y límites: El análisis se genera de forma automatizada mediante modelos de Inteligencia Artificial, sobre la base de los datos que usted haya registrado. En consecuencia:
1. Su calidad y exactitud dependen de que sus movimientos estén cargados de forma completa y correcta. Un análisis elaborado sobre datos parciales o mal categorizados producirá conclusiones parciales o incorrectas.
2. El análisis no contempla su situación patrimonial, impositiva, familiar ni laboral completa, salvo por los datos que usted haya proporcionado voluntariamente.
3. La medición del cumplimiento de una sugerencia se realiza únicamente con los movimientos registrados en el Servicio, y no constituye una verificación ni una auditoría de sus finanzas reales.
4. Las decisiones que usted adopte a partir del análisis son de su exclusiva responsabilidad. Si necesita asesoramiento sobre inversiones, impuestos, deudas o planificación financiera, debe consultar a un profesional matriculado en su jurisdicción.`,
        },
        {
          number: 6,
          title: 'Propiedad de los Datos y Licencias',
          content: `Sus Datos: Usted conserva la plena propiedad y los derechos intelectuales sobre sus datos financieros.

Licencia a Finy: Para que podamos prestarle el servicio (mostrarle gráficos, calcular totales, guardar historial), usted otorga a Finy una licencia mundial, libre de regalías y transferible para alojar, transferir, visualizar, procesar y crear copias de seguridad de sus datos en nuestra infraestructura de servidores y bases de datos.`,
        },
        {
          number: 7,
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
          number: 8,
          title: 'Dependencia de Plataformas de Terceros',
          content: `El Servicio depende de la disponibilidad continua de plataformas externas, incluyendo la Apple App Store, Google Play Store y proveedores de correo electrónico (Google).

Finy no garantiza que el servicio sea ininterrumpido. Finy no será responsable si alguna de estas plataformas sufre interrupciones, cambia sus políticas o suspende el acceso al Servicio.`,
        },
        {
          number: 9,
          title: 'Automatización de Email (Gmail)',
          content: `Si habilita la lectura de correos:
• Autoriza a Finy a acceder a su bandeja de entrada con el fin exclusivo de rastrear comprobantes de pago.
• Reconoce que este proceso es automatizado y Finy podría omitir correos con formatos no reconocidos.`,
        },
        {
          number: 10,
          title: 'Limitación de Responsabilidad',
          content: `En la medida máxima permitida por la ley aplicable, Finy, sus desarrolladores y afiliados no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por pérdida de beneficios, datos, uso o buena voluntad, que surjan de (i) su acceso o uso del servicio; (ii) cualquier conducta de terceros en el servicio; o (iii) acceso no autorizado, uso o alteración de sus transmisiones o contenido.`,
        },
        {
          number: 11,
          title: 'Modificaciones al Servicio y Términos',
          content: `Finy se reserva el derecho de modificar o discontinuar, temporal o permanentemente, el Servicio (o cualquier parte del mismo) con o sin previo aviso. Asimismo, podemos actualizar estos Términos periódicamente. El uso continuado del servicio tras una modificación constituye la aceptación de los nuevos términos.`,
        },
        {
          number: 12,
          title: 'Ley Aplicable',
          content: `Estos Términos se regirán e interpretarán de acuerdo con las leyes vigentes en la República Argentina (o su país de residencia fiscal), sin tener en cuenta sus disposiciones sobre conflictos de leyes.`,
        },
        {
          number: 13,
          title: 'Contacto',
          content: `Para cualquier duda legal o relacionada con estos términos, contáctenos en:

soporte@finyapp.io`,
        },
      ],
    },
    en: {
      title: 'Finy Terms and Conditions of Service',
      lastUpdated: 'Last updated: August 24, 2026',
      sections: [
        {
          number: 1,
          title: 'Acceptance of Terms',
          content: `By registering, accessing the website dashboard.finyapp.io or downloading the Finy mobile app from the Apple App Store or Google Play Store (the "Service"), you agree to be legally bound by these Terms and Conditions. If you do not accept these terms in full, you will not be able to use the Service.`,
        },
        {
          number: 2,
          title: 'Service Description',
          content: `Finy is a technological tool for recording, organizing and visualizing personal finances, accessible via Mobile App (iOS and Android) and Web Platform. Finy uses Artificial Intelligence to process voice commands, text and images and categorize expenses. The service includes:
• A Mobile App available on the Apple App Store and Google Play Store, as the primary access channel.
• A Web Dashboard at dashboard.finyapp.io for viewing metrics, historical charts, and category management.
• Automation tools for processing transactional emails (optional).

Informational Nature: Finy is a recording and visualization tool. Finy is NOT a financial advisor, investment planner, accountant or lawyer. Reports, installment projections, and alerts are estimates based on data provided by you.`,
        },
        {
          number: 3,
          title: 'Registration and Security',
          content: `To use the Service, you may register through the Mobile App or the website using email or Google/Apple authentication.
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
          title: 'Monthly Analysis and Suggestions',
          content: `The Service may periodically generate an analysis of the transactions you have recorded, with observations about your spending habits and suggested actions for the following period, as well as follow-up on any suggestion you choose to accept.

Scope of the suggestions: The suggestions generated by the Service relate exclusively to managing the expenses and income you yourself recorded in the application (for example, reducing how often you spend in a given category). The Service does not make, and does not purport to make, investment recommendations, recommendations to buy or sell financial instruments, recommendations regarding banking, credit or insurance products, nor tax, accounting or legal advice of any kind.

On the use of the word "advisor": Finy uses the terms "advisor" and "analysis" in their ordinary sense, to describe what the product does. Such use does not constitute or imply any professional advisory, fiduciary or financial intermediation relationship between you and Finy, nor does it imply that Finy is licensed or registered to provide financial advisory services in any jurisdiction.

How it is produced, and its limits: The analysis is generated automatically by Artificial Intelligence models, based on the data you have recorded. Accordingly:
1. Its quality and accuracy depend on your transactions being recorded completely and correctly. An analysis built on partial or miscategorized data will produce partial or incorrect conclusions.
2. The analysis does not take into account your complete financial, tax, family or employment situation, except for the data you have voluntarily provided.
3. Measuring whether a suggestion was met is done solely with the transactions recorded in the Service, and does not constitute a verification or audit of your actual finances.
4. Any decisions you make based on the analysis are your sole responsibility. If you need advice on investments, taxes, debt or financial planning, you should consult a licensed professional in your jurisdiction.`,
        },
        {
          number: 6,
          title: 'Data Ownership and Licenses',
          content: `Your Data: You retain full ownership and intellectual rights over your financial data.

License to Finy: To enable us to provide you with the service (show you charts, calculate totals, save history), you grant Finy a worldwide, royalty-free and transferable license to host, transfer, display, process and create backups of your data in our server infrastructure and databases.`,
        },
        {
          number: 7,
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
          number: 8,
          title: 'Dependence on Third-Party Platforms',
          content: `The Service depends on the continuous availability of external platforms, including the Apple App Store, Google Play Store and email providers (Google).

Finy does not guarantee uninterrupted service. Finy will not be responsible if any of these platforms experiences outages, changes its policies, or suspends access to the Service.`,
        },
        {
          number: 9,
          title: 'Email Automation (Gmail)',
          content: `If you enable email reading:
• You authorize Finy to access your inbox exclusively for the purpose of tracking payment receipts.
• You acknowledge that this process is automated and Finy may miss emails with unrecognized formats.`,
        },
        {
          number: 10,
          title: 'Limitation of Liability',
          content: `To the maximum extent permitted by applicable law, Finy, its developers and affiliates will not be liable for indirect, incidental, special, consequential or punitive damages, nor for loss of profits, data, use or goodwill, arising from (i) your access or use of the service; (ii) any conduct of third parties on the service; or (iii) unauthorized access, use or alteration of your transmissions or content.`,
        },
        {
          number: 11,
          title: 'Modifications to Service and Terms',
          content: `Finy reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We may also update these Terms periodically. Continued use of the service following a modification constitutes acceptance of the new terms.`,
        },
        {
          number: 12,
          title: 'Applicable Law',
          content: `These Terms shall be governed and construed in accordance with the laws in force in the Argentine Republic (or your country of tax residence), without regard to its conflict of law provisions.`,
        },
        {
          number: 13,
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
