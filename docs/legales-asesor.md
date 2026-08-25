# Términos y privacidad: qué cambió con el asesor

**Esto lo escribí yo, que no soy abogado. Es una propuesta redactada, no un
dictamen.** Los cambios están aplicados en el repo pero **no publicados**: hace
falta un push para que salgan al sitio. Antes de eso conviene que lo lea alguien
con matrícula, sobre todo la parte de la CNV.

---

## El problema

La landing dice *"Tu asesor financiero, no un chatbot"*. Los términos decían:

> Finy es una herramienta de registro y visualización. Finy **NO es un asesor
> financiero**, planificador de inversiones, contador ni abogado.

Las dos cosas no pueden ser ciertas a la vez. La contradicción ya existía, pero
era chica mientras el producto sólo mostraba gráficos. Ahora el producto dice
*"bajá el delivery a 22 pedidos"* y al mes siguiente mide si lo hiciste, así
que negar en los términos lo que la app hace en la pantalla es peor que no
decir nada: si algún día hay un reclamo, el documento que tenía que proteger
describe un producto que no es el que se entregó.

## Por dónde pasa la línea

No es entre "dar consejos" y "no darlos". Es entre **asesoramiento de inversión
regulado** y **organización de gastos propios**.

Lo regulado —en Argentina por la CNV, y por el equivalente en cada país— es
recomendar qué hacer con instrumentos financieros: comprar, vender, invertir,
contratar productos. Para eso hay que estar registrado.

Lo que hace Finy es mirar los gastos que vos mismo cargaste y sugerirte gastar
menos en una categoría. Eso no es asesoramiento de inversión y no requiere
matrícula. Pero conviene decirlo explícitamente, porque la palabra "asesor" en
el nombre invita a confundirlo.

Por eso la redacción nueva **no niega que Finy analice y sugiera**. Reconoce que
lo hace, y acota exactamente qué tipo de sugerencias son.

---

## Términos: los tres cambios

### 1. Descripción del Servicio (sección 2)

El análisis mensual ahora figura entre las cosas que el servicio incluye —antes
no estaba— y la "Naturaleza Informativa" pasó a decir:

> Finy no es un banco, una entidad financiera, un agente de bolsa, ni un asesor
> de inversiones **registrado ante la Comisión Nacional de Valores** de la
> República Argentina o ante el organismo regulador equivalente de cualquier
> otra jurisdicción.

Nombrar al regulador es más fuerte que "no es un asesor financiero" a secas,
porque dice exactamente qué figura no se está ejerciendo en vez de negar una
categoría difusa que el producto sí parece ocupar.

### 2. Sección 5, nueva: "Análisis Mensual y Sugerencias"

Va en sección propia y no metida dentro de otra, porque un descargo que está a
la vista es más difícil de discutir después que uno escondido en un párrafo.
Cubre cuatro cosas:

- **Qué alcance tienen las sugerencias**: administrar los gastos que vos mismo
  registraste. Nada de inversiones, instrumentos financieros, productos
  bancarios, crédito, seguros, impuestos ni asuntos legales.

- **El uso de la palabra "asesor"**: que es descriptiva, en su sentido
  corriente, y que no implica relación de asesoramiento profesional, fiduciaria
  ni de intermediación. Este es el párrafo que resuelve la contradicción de
  fondo: permite que la landing siga diciendo "asesor" sin que eso se lea como
  una afirmación regulatoria.

- **Los límites reales, que no son formularios**: el análisis vale lo que valen
  los datos cargados; no conoce tu situación patrimonial ni impositiva completa;
  y —esto importa— **medir si cumpliste un compromiso se hace sólo con los
  movimientos que están en la app, y no es una auditoría de tus finanzas.**

- **A dónde ir**: si hace falta asesoramiento de verdad, un profesional
  matriculado en tu jurisdicción.

### 3. Una traducción que estaba mal (sección 4)

Decía *"Finy no es un asesor financiero **legal** ni un banco"*, que es
"licensed financial advisor" traducido de más. En español "asesor financiero
legal" no quiere decir nada. Ahora dice *"no es una entidad financiera ni un
asesor de inversiones registrado"*.

Las secciones 5 a 12 pasaron a 6 a 13. Nadie enlaza a esos anclajes, así que
renumerar no rompe nada.

---

## Privacidad: lo que encontré de paso, y es más urgente

Mirando esto apareció algo que no tiene que ver con la palabra "asesor" y pesa
más. La política decía:

> **Naturaleza del Uso:** Enviamos el texto transcrito o la imagen del ticket a
> estos proveedores únicamente para extraer la información estructurada (Monto,
> Comercio, Categoría).

Eso describía la app de antes. El análisis mensual manda a Gemini bastante más
que un ticket. Verifiqué en el código exactamente qué viaja:

| Va | No va |
|---|---|
| Totales de ingresos, gastos y balance | Tu nombre |
| Desglose por categoría | Tu correo |
| Tus movimientos más grandes, **con su descripción** | El identificador de tu cuenta |
| Totales de meses anteriores | |
| Ingreso declarado y frecuencia | |
| Metas de ahorro, con el nombre que les pusiste | |
| Convivencia y personas a cargo | |
| Contexto personal que hayas escrito | |

Las descripciones de los movimientos y el contexto son campos de texto libre:
puede haber ahí nombres de personas y detalles que nadie clasificó como
sensibles. En una corrida de prueba salió *"auriculares para Lucas"*.

La política ahora enumera esa lista, dice explícitamente que no se manda nombre,
correo ni identificador de cuenta —lo verifiqué en el código, no lo asumí— y
aclara que el análisis y el chat son **opcionales**: se puede usar Finy entera
sin ellos.

Esto no es cosmético. Una política de privacidad que describe un procesamiento
más chico que el real es exactamente lo que mira un DPO, y con usuarios en
España cae bajo GDPR.

---

## Lo que dejo anotado y no toqué

- **Si le ponés nombre propio al asesor**, la sección 5 hay que revisarla: un
  nombre de persona refuerza la idea de que hay alguien asesorando, que es justo
  lo que el párrafo trata de acotar.

- **La ley aplicable dice "Argentina (o su país de residencia fiscal)"**. Ese
  paréntesis deja la jurisdicción abierta a cualquier país. Con 40 % de usuarios
  fuera de Argentina puede ser deliberado, pero es de las cosas que un abogado
  va a querer mirar.

- **El consentimiento del análisis.** Hoy la app genera el análisis y avisa por
  push. Si en algún momento se considera que hace falta un consentimiento
  explícito y separado para el procesamiento con IA —no el de los términos
  generales—, eso es un cambio de producto, no de redacción.
