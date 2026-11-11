/**
 * Genera la base de conocimiento que se sube al agente de Botmaker.
 *
 *   node --experimental-strip-types scripts/base-conocimiento.mts
 *
 * Sale de lib/content/faqs.ts, que es la misma fuente que usa la página de
 * preguntas frecuentes. Si cambia el FAQ, se vuelve a correr esto y se sube
 * el archivo de nuevo, en vez de editar el texto a mano en dos lugares.
 */
import { FAQ_GROUPS } from '../lib/content/faqs.ts'
import fs from 'fs'

const ENCABEZADO = `BASE DE CONOCIMIENTO DE FINY
Actualizada el ${new Date().toISOString().slice(0, 10)}

QUE ES FINY
Finy es una app de finanzas personales para iPhone y Android que registra
gastos con inteligencia artificial. Se le habla, se le saca una foto al ticket
o se le escribe, y la IA carga el movimiento con monto, categoria y metodo de
pago. Tiene espacios compartidos para dividir gastos, soporta mas de 40 monedas
y sincroniza con Mercado Pago en siete paises de LatAm.

DONDE SE DESCARGA
App Store: https://apps.apple.com/us/app/finy-control-de-gastos-con-ia/id6760370721
Google Play: https://play.google.com/store/apps/details?id=com.finy.app
Sitio: https://www.finyapp.io

PLANES Y PRECIOS
Gratis: 0. Incluye 100 transacciones, 10 consultas a la IA y 2 escaneos de foto
o PDF por mes, 1 espacio personal, con publicidad.
Plus: USD 2,99 por mes o USD 24,99 por ano. Incluye 500 transacciones, 75
consultas y 30 escaneos por mes, 3 espacios compartidos, sin publicidad.
Pro: USD 4,99 por mes o USD 39,99 por ano. Incluye 1.000 transacciones, 200
consultas y 100 escaneos por mes, 10 espacios compartidos, reportes avanzados
y sin publicidad.
Todos los usuarios nuevos reciben 14 dias de PRO gratis al instalar, sin
tarjeta. Al terminar pasan al plan Gratis, no hay cobro automatico.

CONTACTO
Soporte: soporte@finyapp.io
Formulario de contacto: https://www.finyapp.io
Instagram: @finybot
Politica de privacidad: https://www.finyapp.io/politica-privacidad
Condiciones del servicio: https://www.finyapp.io/condiciones-servicios

LO QUE FINY NO HACE HOY
No se conecta con bancos tradicionales, esas integraciones estan en desarrollo.
No hace contabilidad de empresa ni facturacion.
No hace seguimiento de inversiones ni de portafolio.
Si alguien pregunta por algo de esto, se dice que todavia no esta, sin prometer
fechas.

PREGUNTAS FRECUENTES
`

const cuerpo = FAQ_GROUPS.map((g) =>
  `\n## ${g.title}\n\n` + g.items.map((i) => `P: ${i.q}\nR: ${i.a}\n`).join('\n')
).join('')

const salida = ENCABEZADO + cuerpo
fs.mkdirSync('docs', { recursive: true })
fs.writeFileSync('docs/base-de-conocimiento-finy.txt', salida)
console.log('docs/base-de-conocimiento-finy.txt ·', salida.length, 'caracteres ·', FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0), 'preguntas')
